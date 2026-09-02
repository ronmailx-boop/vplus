import { db, getCurrentList, makeListId, save } from '../core/store.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../core/supabase-config.js';
import { render, onRender } from '../ui/render.js';
import { openModal, showToast } from '../ui/modals.js';

const POLL_INTERVAL_MS = 4000;
const TYPING_PING_THROTTLE_MS = 2000;
const TYPING_INDICATOR_HIDE_MS = 3500;

let supabaseClient = null;
let channel = null;
let pushTimer = null;
let pollTimer = null;
let lastKnownUpdatedAt = null;
let lastTypingPingAt = 0;
let typingHideTimer = null;
let suppressNextPush = false;
let lastSyncedItemIds = null;

async function getClient() {
  if (supabaseClient) return supabaseClient;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

function findListByShareId(shareId) {
  return Object.keys(db.lists).find((id) => db.lists[id].shareId === shareId) || null;
}

// A plain union-by-id merge can only ADD items, never remove one — so a deletion (an item
// simply missing from one side) always looked identical to "an item I don't know about yet
// on the other side", and kept getting merged back in forever. deletedIds is a tombstone set
// (id-only, "only grows" just like items "only join") carried alongside items in the synced
// payload: any id in it is excluded on both sides, regardless of whether either side still has it.
function mergeItems(localItems, remoteItems, deletedIds) {
  const tombstones = new Set(deletedIds || []);
  const byId = new Map(remoteItems.filter((item) => !tombstones.has(item.id)).map((item) => [item.id, item]));
  localItems.forEach((item) => {
    if (!tombstones.has(item.id) && !byId.has(item.id)) byId.set(item.id, item);
  });
  return Array.from(byId.values());
}

// No more comparing timestamps-as-strings or content-as-JSON: Postgres round-trips those in
// ways JS string/JSON.stringify equality can't rely on (different timestamp string, reordered
// jsonb keys), and that broke self-echo/no-op detection twice already (stages 52, 53). Instead:
// always merge and always render (cheap and idempotent), and decide whether to push back up
// purely by whether the merge actually pulled in a local-only item or tombstone the remote
// didn't have — a plain length comparison, immune to any text/formatting differences from the server.
function applyRemoteUpdate(shareId, remoteData, remoteUpdatedAt) {
  lastKnownUpdatedAt = remoteUpdatedAt || lastKnownUpdatedAt;

  const listId = findListByShareId(shareId);
  if (!listId) return;
  const localList = db.lists[listId];
  const remoteDeletedIds = remoteData.deletedIds || [];
  const deletedIds = Array.from(new Set([...(localList?.deletedIds || []), ...remoteDeletedIds]));
  const items = localList ? mergeItems(localList.items, remoteData.items, deletedIds) : remoteData.items;
  const healedNewInfo = items.length > remoteData.items.length || deletedIds.length > remoteDeletedIds.length;
  db.lists[listId] = { ...remoteData, items, deletedIds, shareId };
  save();
  if (db.currentId === listId) {
    lastSyncedItemIds = new Set(items.map((item) => item.id));
    // This remote update already reflects everything we merged in — nothing to push back.
    if (!healedNewInfo) suppressNextPush = true;
    render();
  }
}

function stopPolling() {
  clearInterval(pollTimer);
  pollTimer = null;
}

function startPolling(shareId) {
  stopPolling();
  pollTimer = setInterval(async () => {
    if (!findListByShareId(shareId)) {
      stopPolling();
      return;
    }
    try {
      const client = await getClient();
      const { data, error } = await client
        .from('shared_lists')
        .select('data,updated_at')
        .eq('id', shareId)
        .single();
      if (error || !data) return;
      applyRemoteUpdate(shareId, data.data, data.updated_at);
    } catch {
      /* silent — the next poll tick or the realtime channel will retry */
    }
  }, POLL_INTERVAL_MS);
}

function showTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (!indicator) return;
  indicator.classList.remove('hidden');
  clearTimeout(typingHideTimer);
  typingHideTimer = setTimeout(() => {
    indicator.classList.add('hidden');
  }, TYPING_INDICATOR_HIDE_MS);
}

async function subscribeToList(shareId) {
  startPolling(shareId);
  try {
    const client = await getClient();
    if (channel) {
      client.removeChannel(channel);
      channel = null;
    }
    channel = client
      .channel('shared_lists:' + shareId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'shared_lists', filter: `id=eq.${shareId}` },
        (payload) => {
          applyRemoteUpdate(shareId, payload.new.data, payload.new.updated_at);
        }
      )
      .on('broadcast', { event: 'typing' }, () => showTypingIndicator())
      .subscribe();
  } catch {
    /* the polling fallback started above still keeps the list in sync */
  }
}

function sendTypingPing() {
  const list = getCurrentList();
  if (!list?.shareId || !channel) return;
  const now = Date.now();
  if (now - lastTypingPingAt < TYPING_PING_THROTTLE_MS) return;
  lastTypingPingAt = now;
  try {
    channel.send({ type: 'broadcast', event: 'typing', payload: {} });
  } catch {
    /* best-effort cosmetic ping — a failed send just means the other side won't see the indicator this time */
  }
}

export function getShareLink(shareId) {
  const url = new URL(location.href);
  url.hash = '';
  url.search = '';
  url.searchParams.set('share', shareId);
  return url.toString();
}

export async function enableSharing(listId) {
  const list = db.lists[listId];
  if (!list) return null;
  if (list.shareId) return list.shareId;
  list.deletedIds = list.deletedIds || [];

  try {
    const client = await getClient();
    const { data, error } = await client
      .from('shared_lists')
      .insert({ data: list })
      .select('id,updated_at')
      .single();
    if (error || !data) throw error || new Error('no data');

    list.shareId = data.id;
    lastKnownUpdatedAt = data.updated_at;
    lastSyncedItemIds = new Set(list.items.map((item) => item.id));
    save();
    subscribeToList(list.shareId);
    return list.shareId;
  } catch {
    showToast('שגיאה בהפעלת שיתוף — בדקו חיבור לרשת ונסו שוב');
    return null;
  }
}

export async function joinSharedList(shareId) {
  try {
    const client = await getClient();
    const { data, error } = await client
      .from('shared_lists')
      .select('data,updated_at')
      .eq('id', shareId)
      .single();
    if (error || !data) throw error || new Error('no data');

    let listId = findListByShareId(shareId);
    if (!listId) {
      listId = makeListId();
      db.listsOrder.push(listId);
    }
    db.lists[listId] = { ...data.data, deletedIds: data.data.deletedIds || [], shareId };
    db.currentId = listId;
    lastKnownUpdatedAt = data.updated_at;
    lastSyncedItemIds = new Set(db.lists[listId].items.map((item) => item.id));
    save();
    subscribeToList(shareId);
    render();
  } catch {
    showToast('לא ניתן לטעון את הרשימה המשותפת — בדקו חיבור לרשת');
  }
}

function pushCurrentListIfShared() {
  if (suppressNextPush) {
    suppressNextPush = false;
    return;
  }
  const list = getCurrentList();
  if (!list || !list.shareId) return;

  // Deletion has no explicit signal here — it's inferred by diffing against the ids we last
  // knew about. An id that vanished since then was deleted locally (tombstone it); an id that's
  // back (e.g. the delete-toast's "undo") is un-tombstoned so the restore also propagates.
  const currentIds = new Set(list.items.map((item) => item.id));
  if (lastSyncedItemIds) {
    const tombstones = new Set(list.deletedIds || []);
    lastSyncedItemIds.forEach((id) => {
      if (!currentIds.has(id)) tombstones.add(id);
    });
    currentIds.forEach((id) => tombstones.delete(id));
    list.deletedIds = Array.from(tombstones);
  } else {
    list.deletedIds = list.deletedIds || [];
  }
  lastSyncedItemIds = currentIds;

  clearTimeout(pushTimer);
  const shareId = list.shareId;
  pushTimer = setTimeout(async () => {
    const updatedAt = new Date().toISOString();
    try {
      const client = await getClient();
      const { error } = await client
        .from('shared_lists')
        .update({ data: list, updated_at: updatedAt })
        .eq('id', shareId);
      if (error) throw error;
      lastKnownUpdatedAt = updatedAt;
    } catch {
      showToast('לא ניתן לעדכן את הרשימה המשותפת — בדקו חיבור לרשת');
    }
  }, 600);
}

function refreshLiveShareModal() {
  const list = getCurrentList();
  const linkWrap = document.getElementById('liveShareLinkWrap');
  const linkInput = document.getElementById('liveShareLinkInput');
  const enableBtn = document.getElementById('liveShareEnableBtn');
  const sendBtn = document.getElementById('liveShareSendBtn');

  if (list?.shareId) {
    linkInput.value = getShareLink(list.shareId);
    linkWrap.classList.remove('hidden');
    enableBtn.classList.add('hidden');
    sendBtn.classList.remove('hidden');
  } else {
    linkWrap.classList.add('hidden');
    enableBtn.classList.remove('hidden');
    sendBtn.classList.add('hidden');
  }
}

async function handleEnableClick() {
  const list = getCurrentList();
  if (!list) return;
  const enableBtn = document.getElementById('liveShareEnableBtn');
  enableBtn.disabled = true;
  try {
    await enableSharing(db.currentId);
  } finally {
    enableBtn.disabled = false;
    refreshLiveShareModal();
  }
}

async function handleSendClick() {
  const list = getCurrentList();
  if (!list?.shareId) return;
  const link = getShareLink(list.shareId);
  if (navigator.share) {
    try {
      await navigator.share({ title: `Vplus - ${list.name}`, url: link });
    } catch (err) {
      if (err.name !== 'AbortError') showToast('השיתוף נכשל');
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(link);
    showToast('הקישור הועתק ללוח');
  } catch {
    showToast('לא ניתן להעתיק ללוח');
  }
}

function handleLinkInputFocus(e) {
  e.target.select();
}

function handleVisibilityChange() {
  if (document.visibilityState !== 'visible') return;
  const current = getCurrentList();
  if (current?.shareId) subscribeToList(current.shareId);
}

export function initCollab() {
  document.getElementById('liveShareBtn').addEventListener('click', () => {
    refreshLiveShareModal();
    openModal('liveShareModal');
  });
  document.getElementById('liveShareEnableBtn').addEventListener('click', handleEnableClick);
  document.getElementById('liveShareSendBtn').addEventListener('click', handleSendClick);
  document.getElementById('liveShareLinkInput').addEventListener('focus', handleLinkInputFocus);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  document.getElementById('itemName').addEventListener('input', sendTypingPing);

  onRender(pushCurrentListIfShared);

  const params = new URLSearchParams(location.search);
  const shareId = params.get('share');
  if (shareId) {
    joinSharedList(shareId);
  } else {
    const current = getCurrentList();
    if (current?.shareId) subscribeToList(current.shareId);
  }
}
