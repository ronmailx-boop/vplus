import { db, getCurrentList, addItem, editItem, deleteItem, toggleItemChecked } from '../core/store.js';
import { CATEGORIES } from '../core/constants.js';
import { openModal, closeModal, showToast } from '../ui/modals.js';
import { render } from '../ui/render.js';

function populateCategorySelect() {
  const select = document.getElementById('itemCategorySelect');
  select.innerHTML =
    '<option value="">זיהוי אוטומטי</option>' +
    Object.keys(CATEGORIES)
      .map((cat) => `<option value="${cat}">${cat}</option>`)
      .join('');
}

function openAddItemModal() {
  document.getElementById('itemModalTitle').textContent = 'הוספת פריט';
  document.getElementById('itemForm').reset();
  document.getElementById('itemFormId').value = '';
  document.getElementById('itemAdvancedFields').classList.add('hidden');
  openModal('itemModal');
  document.getElementById('itemName').focus();
}

function openEditItemModal(itemId) {
  const list = getCurrentList();
  const item = list?.items.find((i) => i.id === itemId);
  if (!item) return;
  document.getElementById('itemModalTitle').textContent = 'עריכת פריט';
  document.getElementById('itemFormId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemPrice').value = item.price || '';
  document.getElementById('itemQty').value = item.qty || 1;
  document.getElementById('itemCategorySelect').value = item.category || '';
  document.getElementById('itemDueDate').value = item.dueDate || '';
  document.getElementById('itemNote').value = item.note || '';
  document.getElementById('itemPaymentUrl').value = item.paymentUrl || '';
  openModal('itemModal');
}

function handleItemFormSubmit(e) {
  e.preventDefault();
  const list = getCurrentList();
  if (!list) return;
  const id = document.getElementById('itemFormId').value;
  const data = {
    name: document.getElementById('itemName').value.trim(),
    price: document.getElementById('itemPrice').value,
    qty: document.getElementById('itemQty').value || 1,
    category: document.getElementById('itemCategorySelect').value || undefined,
    dueDate: document.getElementById('itemDueDate').value,
    note: document.getElementById('itemNote').value.trim(),
    paymentUrl: document.getElementById('itemPaymentUrl').value.trim(),
  };
  if (!data.name) return;

  if (id) {
    editItem(db.currentId, id, data);
  } else {
    addItem(db.currentId, data);
  }
  closeModal('itemModal');
  render();
}

function handleItemsContainerClick(e) {
  const card = e.target.closest('.item-card');
  if (!card) return;
  const itemId = card.dataset.itemId;
  const action = e.target.closest('[data-action]')?.dataset.action;

  if (action === 'toggle') {
    toggleItemChecked(db.currentId, itemId);
    render();
  } else if (action === 'delete') {
    const list = getCurrentList();
    const item = list.items.find((i) => i.id === itemId);
    const snapshot = { ...item };
    deleteItem(db.currentId, itemId);
    render();
    showToast(`"${snapshot.name}" נמחק`, {
      undoLabel: 'בטל',
      onUndo: () => {
        addItem(db.currentId, snapshot);
        render();
      },
    });
  } else if (action === 'edit') {
    openEditItemModal(itemId);
  }
}

export function initItemCrud() {
  populateCategorySelect();
  document.getElementById('fabAddItem').addEventListener('click', openAddItemModal);
  document.getElementById('itemForm').addEventListener('submit', handleItemFormSubmit);
  document.getElementById('itemAdvancedToggle').addEventListener('click', () => {
    document.getElementById('itemAdvancedFields').classList.toggle('hidden');
  });
  document.getElementById('itemsContainer').addEventListener('click', handleItemsContainerClick);
}
