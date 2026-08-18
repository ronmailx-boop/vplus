import { db, getCurrentList, toggleListLock, reorderListItems, reorderListsOrder, deleteItem, deleteList } from '../core/store.js';
import {
  render,
  itemEditMode,
  listEditMode,
  selectedItemIds,
  selectedListIds,
  setItemEditMode,
  setListEditMode,
} from '../ui/render.js';
import { showToast, confirmDialog } from '../ui/modals.js';

let itemSortable = null;
let listSortable = null;

function initSortableInstances() {
  if (!window.Sortable) return;
  const itemsContainer = document.getElementById('itemsContainer');
  const summaryContainer = document.getElementById('summaryContainer');

  itemSortable = new Sortable(itemsContainer, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: () => {
      const ids = [...itemsContainer.querySelectorAll('.item-card')].map((el) => el.dataset.itemId);
      reorderListItems(db.currentId, ids);
    },
  });

  listSortable = new Sortable(summaryContainer, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: () => {
      const ids = [...summaryContainer.querySelectorAll('.summary-row')].map((el) => el.dataset.listId);
      reorderListsOrder(ids);
    },
  });
}

function handleItemsContainerSelectClick(e) {
  const checkbox = e.target.closest('[data-action="select"]');
  if (!checkbox) return;
  const itemId = checkbox.closest('.item-card').dataset.itemId;
  if (checkbox.checked) selectedItemIds.add(itemId);
  else selectedItemIds.delete(itemId);
}

function handleSummarySelectClick(e) {
  const checkbox = e.target.closest('[data-action="select-list"]');
  if (!checkbox) return;
  const listId = checkbox.closest('.summary-row').dataset.listId;
  if (checkbox.checked) selectedListIds.add(listId);
  else selectedListIds.delete(listId);
}

async function handleBulkDeleteItems() {
  if (!selectedItemIds.size) return;
  const ok = await confirmDialog(`למחוק ${selectedItemIds.size} פריטים נבחרים?`);
  if (!ok) return;
  for (const itemId of selectedItemIds) {
    deleteItem(db.currentId, itemId);
  }
  setItemEditMode(false);
  showToast('הפריטים נמחקו');
}

async function handleBulkDeleteLists() {
  if (!selectedListIds.size) return;
  const ok = await confirmDialog(`למחוק ${selectedListIds.size} רשימות נבחרות?`);
  if (!ok) return;
  for (const listId of selectedListIds) {
    deleteList(listId);
  }
  setListEditMode(false);
  showToast('הרשימות נמחקו');
}

function handleLockToggle() {
  toggleListLock(db.currentId);
  render();
}

function handlePrint() {
  window.print();
}

export function initOrganize() {
  initSortableInstances();

  document.getElementById('itemEditModeBtn').addEventListener('click', () => setItemEditMode(!itemEditMode));
  document.getElementById('listEditModeBtn').addEventListener('click', () => setListEditMode(!listEditMode));
  document.getElementById('bulkDeleteCancelBtn').addEventListener('click', () => setItemEditMode(false));
  document.getElementById('bulkDeleteListsCancelBtn').addEventListener('click', () => setListEditMode(false));
  document.getElementById('bulkDeleteItemsBtn').addEventListener('click', handleBulkDeleteItems);
  document.getElementById('bulkDeleteListsBtn').addEventListener('click', handleBulkDeleteLists);
  document.getElementById('lockListBtn').addEventListener('click', handleLockToggle);
  document.getElementById('printListBtn').addEventListener('click', handlePrint);
  document.getElementById('itemsContainer').addEventListener('change', handleItemsContainerSelectClick);
  document.getElementById('summaryContainer').addEventListener('change', handleSummarySelectClick);
}
