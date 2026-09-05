import { db, createList, renameList, deleteList, selectList } from '../core/store.js';
import { openModal, closeModal, confirmDialog, showToast } from '../ui/modals.js';
import { render, setActivePage, listEditMode } from '../ui/render.js';

function openNewListModal() {
  document.getElementById('listModalTitle').textContent = 'רשימה חדשה';
  document.getElementById('listForm').reset();
  document.getElementById('listFormId').value = '';
  openModal('listModal');
}

function openEditListModal(listId) {
  const list = db.lists[listId];
  if (!list) return;
  document.getElementById('listModalTitle').textContent = 'עריכת רשימה';
  document.getElementById('listFormId').value = listId;
  document.getElementById('listNameInput').value = list.name;
  document.getElementById('listUrlInput').value = list.url || '';
  document.getElementById('listBudgetInput').value = list.budget || '';
  openModal('listModal');
}

function handleListFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('listFormId').value;
  const name = document.getElementById('listNameInput').value.trim();
  const url = document.getElementById('listUrlInput').value.trim();
  const budget = document.getElementById('listBudgetInput').value;
  if (!name) return;

  if (id) {
    renameList(id, name);
    db.lists[id].url = url;
    db.lists[id].budget = Number(budget) || 0;
  } else {
    const newId = createList(name);
    db.lists[newId].url = url;
    db.lists[newId].budget = Number(budget) || 0;
  }
  closeModal('listModal');
  render();
}

async function handleSummaryContainerClick(e) {
  if (listEditMode) return;
  const deleteBtn = e.target.closest('[data-action="delete-list"]');
  if (deleteBtn) {
    const listId = deleteBtn.dataset.listId;
    const list = db.lists[listId];
    const ok = await confirmDialog(`למחוק את הרשימה "${list.name}"?`);
    if (ok) {
      deleteList(listId);
      render();
      showToast('הרשימה נמחקה');
    }
    return;
  }
  const row = e.target.closest('.summary-row[data-list-id]');
  if (row) {
    selectList(row.dataset.listId);
    setActivePage('lists');
  }
}

export function initListCrud() {
  document.getElementById('lnbNewListBtn').addEventListener('click', openNewListModal);
  document.getElementById('listForm').addEventListener('submit', handleListFormSubmit);
  document.getElementById('summaryContainer').addEventListener('click', handleSummaryContainerClick);
  document.getElementById('listNameDisplay').addEventListener('click', () => {
    if (db.currentId) openEditListModal(db.currentId);
  });
}
