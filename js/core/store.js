import { STORAGE_KEY, detectCategory } from './constants.js';

export function makeListId() {
  return 'L' + Date.now();
}

function makeItemId() {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function defaultDb() {
  const firstListId = makeListId();
  return {
    currentId: firstListId,
    lists: {
      [firstListId]: { name: 'רשימה 1', url: '', budget: 0, items: [] },
    },
    listsOrder: [firstListId],
    history: [],
    stats: { totalSpent: 0, listsCompleted: 0, monthlyData: {} },
    categoryMemory: {},
    pricebook: {},
    hiddenFromAutocomplete: [],
  };
}

export function normalizeItem(item) {
  return {
    id: item.id || makeItemId(),
    name: item.name || '',
    price: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
    checked: !!item.checked,
    category: item.category || detectCategory(item.name),
    note: item.note || '',
    dueDate: item.dueDate || '',
    paymentUrl: item.paymentUrl || '',
    isPaid: !!item.isPaid,
    lastUpdated: item.lastUpdated || Date.now(),
  };
}

function normalizeList(list) {
  return {
    name: list.name || '',
    url: list.url || '',
    budget: Number(list.budget) || 0,
    locked: !!list.locked,
    items: Array.isArray(list.items) ? list.items.map(normalizeItem) : [],
  };
}

function load() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) return defaultDb();
  try {
    const parsed = JSON.parse(raw);
    const base = defaultDb();
    const merged = { ...base, ...parsed };
    for (const id of Object.keys(merged.lists || {})) {
      merged.lists[id] = normalizeList(merged.lists[id]);
    }
    if (!merged.listsOrder || !merged.listsOrder.length) {
      merged.listsOrder = Object.keys(merged.lists);
    }
    return merged;
  } catch {
    return defaultDb();
  }
}

export const db = load();

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function calcListTotal(list) {
  return list.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calcListPaid(list) {
  return list.items
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCurrentList() {
  return db.lists[db.currentId] || null;
}

export function createList(name, { switchCurrent = true } = {}) {
  const id = makeListId();
  db.lists[id] = { name: name || 'רשימה חדשה', url: '', budget: 0, items: [] };
  db.listsOrder.push(id);
  if (switchCurrent) db.currentId = id;
  save();
  return id;
}

export function renameList(id, name) {
  if (!db.lists[id]) return;
  db.lists[id].name = name;
  save();
}

export function deleteList(id) {
  delete db.lists[id];
  db.listsOrder = db.listsOrder.filter((x) => x !== id);
  if (db.currentId === id) {
    db.currentId = db.listsOrder[0] || null;
  }
  save();
}

export function selectList(id) {
  if (!db.lists[id]) return;
  db.currentId = id;
  save();
}

export function completeList(id) {
  const list = db.lists[id];
  if (!list) return;
  const total = calcListTotal(list);
  db.history.push({
    name: list.name,
    url: list.url,
    items: list.items,
    total,
    completedAt: Date.now(),
  });
  db.stats.totalSpent += total;
  db.stats.listsCompleted += 1;
  const monthKey = new Date().toISOString().slice(0, 7);
  db.stats.monthlyData[monthKey] = (db.stats.monthlyData[monthKey] || 0) + total;
  deleteList(id);
}

export function addItem(listId, itemData) {
  const list = db.lists[listId];
  if (!list) return null;
  const learned = db.categoryMemory[(itemData.name || '').toLowerCase().trim()];
  const item = normalizeItem({ ...itemData, category: itemData.category || learned });
  list.items.push(item);
  db.pricebook[item.name.toLowerCase().trim()] = { price: item.price, category: item.category };
  save();
  return item;
}

export function insertItem(listId, index, itemData) {
  const list = db.lists[listId];
  if (!list) return null;
  const item = normalizeItem(itemData);
  const at = Math.max(0, Math.min(index, list.items.length));
  list.items.splice(at, 0, item);
  db.pricebook[item.name.toLowerCase().trim()] = { price: item.price, category: item.category };
  save();
  return item;
}

export function editItem(listId, itemId, changes) {
  const list = db.lists[listId];
  if (!list) return;
  const item = list.items.find((i) => i.id === itemId);
  if (!item) return;
  Object.assign(item, changes, { lastUpdated: Date.now() });
  if (changes.category) {
    db.categoryMemory[item.name.toLowerCase().trim()] = changes.category;
  }
  save();
}

export function deleteItem(listId, itemId) {
  const list = db.lists[listId];
  if (!list) return;
  list.items = list.items.filter((i) => i.id !== itemId);
  save();
}

export function toggleItemChecked(listId, itemId) {
  const list = db.lists[listId];
  if (!list) return;
  const item = list.items.find((i) => i.id === itemId);
  if (!item) return;
  item.checked = !item.checked;
  save();
}

export function moveItem(fromListId, toListId, itemId) {
  const fromList = db.lists[fromListId];
  const toList = db.lists[toListId];
  if (!fromList || !toList) return;
  const idx = fromList.items.findIndex((i) => i.id === itemId);
  if (idx === -1) return;
  const [item] = fromList.items.splice(idx, 1);
  toList.items.push(item);
  save();
}

export function restoreFromHistory(index) {
  const entry = db.history[index];
  if (!entry) return null;
  const id = createList(entry.name);
  db.lists[id].url = entry.url || '';
  db.lists[id].items = entry.items.map((i) => normalizeItem({ ...i, checked: false }));
  save();
  return id;
}

export function deleteHistoryEntry(index) {
  db.history.splice(index, 1);
  save();
}

export function reorderListsOrder(newOrder) {
  db.listsOrder = newOrder.filter((id) => db.lists[id]);
  save();
}

export function reorderListItems(listId, newItemIds) {
  const list = db.lists[listId];
  if (!list) return;
  const byId = new Map(list.items.map((i) => [i.id, i]));
  list.items = newItemIds.map((id) => byId.get(id)).filter(Boolean);
  save();
}

export function toggleListLock(listId) {
  const list = db.lists[listId];
  if (!list) return;
  list.locked = !list.locked;
  save();
}

export function sortItemsByStatusAndCategory(items, categoryOrder) {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    const ai = categoryOrder.indexOf(a.category);
    const bi = categoryOrder.indexOf(b.category);
    return ai - bi;
  });
}
