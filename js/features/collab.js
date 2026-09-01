import { db, getCurrentList, makeListId, save } from '../core/store.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../core/supabase-config.js';
import { render, onRender } from '../ui/render.js';
import { openModal, showToast } from '../ui/modals.js';

const POLL_INTERVAL_MS = 4000;

let supabaseClient = null;
let channel = null;
let pushTimer = null;
let pollTimer = null;
let lastKnownUpdatedAt = null;

async function getClient() {
  if (supabaseClient) return supabaseClient;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

function findListByShareId(shareId) {
  return Object.keys(db.lists).find((id) => db.lists[id].shareId === shareId) || null;
}

function mergeItems(localItems, remoteItems) {
  const byId = new Map(remoteItems.map((item) => [item.id, item]));
  localItems.forEach((item) => {
    if (!byId.has(item.id)) byId.set(item.id, item);
  });
  return Array.from(byId.values());
}

function applyRemoteUpdate(shareId, remoteData, remoteUpdatedAt) {
  if (remoteUpdatedAt && lastKnownUpdatedAt && new Date(remoteUpdatedAt) <= new Date(lastKnownUpdatedAt)) {
    return; // stale or duplicate (self-echo, or a slow poll response overtaken by a newer update) — ignore
  }
  const listId = findListByShareId(shareId);
  if (!listId) return;
  const localList = db.lists[listId];
  const items = localList ? mergeItems(localList.items, remoteData.items) : remoteData.items;
  db.lists[listId] = { ...remoteData, items, shareId };
  lastKnownUpdatedAt = remoteUpdatedAt || lastKnownUpdatedAt;
  save();
  if (db.currentId === listId) render();
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
      if (data.updated_at !== lastKnownUpdatedAt) {
        applyRemoteUpdate(shareId, data.data, data.updated_at);
      }
    } catch {
      /* silent — the next poll tick or the realtime channel will retry */
    }
  }, POLL_INTERVAL_MS);
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
      .subscribe();
  } catch {
    /* the polling fallback started above still keeps the list in sync */
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
    db.lists[listId] = { ...data.data, shareId };
    db.currentId = listId;
    lastKnownUpdatedAt = data.updated_at;
    save();
    subscribeToList(shareId);
    render();
  } catch {
    showToast('לא ניתן לטעון את הרשימה המשותפת — בדקו חיבור לרשת');
  }
}

function pushCurrentListIfShared() {
  const list = getCurrentList();
  if (!list || !list.shareId) return;
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
