import { db, getCurrentList, createList, addItem, insertItem, editItem, deleteItem, toggleItemChecked, save } from '../core/store.js';
import { CATEGORIES } from '../core/constants.js';
import { openModal, closeModal, showToast } from '../ui/modals.js';
import { render } from '../ui/render.js';

const CONTINUOUS_ADD_KEY = 'vplus_continuous_add';

let targetListId = null;
let continuousAdd = localStorage.getItem(CONTINUOUS_ADD_KEY) === 'true';

function populateCategorySelect() {
  const select = document.getElementById('itemCategorySelect');
  select.innerHTML =
    '<option value="">זיהוי אוטומטי</option>' +
    Object.keys(CATEGORIES)
      .map((cat) => `<option value="${cat}">${cat}</option>`)
      .join('');
}

function isListLocked() {
  const list = getCurrentList();
  if (list?.locked) {
    showToast('הרשימה נעולה — יש לבטל נעילה כדי לערוך');
    return true;
  }
  return false;
}

function updateContextBarDisplay() {
  const nameEl = document.getElementById('contextListName');
  nameEl.textContent = db.lists[targetListId]?.name || '—';
}

function renderListDropdown() {
  const scroll = document.getElementById('listDropdownScroll');
  const ids = db.listsOrder.filter((id) => db.lists[id]);
  scroll.innerHTML = ids
    .map(
      (id) => `
      <div class="list-dropdown-item ${id === targetListId ? 'active' : ''}" data-list-id="${id}">
        ${db.lists[id].name}
      </div>
    `
    )
    .join('');
  document.getElementById('newListFromDropdown').value = '';
}

function closeListDropdown() {
  document.getElementById('listDropdown').classList.remove('open');
  document.getElementById('contextListBtn').classList.remove('open');
  document.removeEventListener('click', handleOutsideDropdownClick);
}

function handleOutsideDropdownClick(e) {
  const bar = document.getElementById('contextBar');
  if (bar && !bar.contains(e.target)) closeListDropdown();
}

function toggleListDropdown() {
  const dropdown = document.getElementById('listDropdown');
  const isOpen = dropdown.classList.toggle('open');
  document.getElementById('contextListBtn').classList.toggle('open', isOpen);
  if (isOpen) {
    renderListDropdown();
    setTimeout(() => document.addEventListener('click', handleOutsideDropdownClick), 10);
  } else {
    document.removeEventListener('click', handleOutsideDropdownClick);
  }
}

function selectTargetList(id) {
  targetListId = id;
  updateContextBarDisplay();
  closeListDropdown();
}

function handleCreateListFromDropdown() {
  const input = document.getElementById('newListFromDropdown');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  const id = createList(name, { switchCurrent: false });
  targetListId = id;
  updateContextBarDisplay();
  closeListDropdown();
  showToast(`הרשימה "${name}" נוצרה`);
}

function stepQty(delta) {
  const input = document.getElementById('itemQty');
  const next = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
  input.value = next;
}

function updateItemModalScrollHint() {
  const card = document.getElementById('itemModalCard');
  const hint = document.getElementById('itemModalScrollHint');
  const hasMore = card.scrollHeight - card.scrollTop - card.clientHeight > 4;
  hint.classList.toggle('visible', hasMore);
}

function setAdvancedFieldsOpen(open) {
  document.getElementById('itemAdvancedFields').classList.toggle('hidden', !open);
  document.getElementById('itemAdvancedToggle').classList.toggle('open', open);
  document.getElementById('itemAdvancedToggleLabel').textContent = open ? 'הצג פחות' : 'עוד אפשרויות';
  if (open) {
    document.getElementById('itemAdvancedToggle').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    document.getElementById('itemModalCard').scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateItemModalScrollHint();
}

function toggleContinuousMode() {
  const toggle = document.getElementById('continuousToggle');
  continuousAdd = toggle.checked;
  localStorage.setItem(CONTINUOUS_ADD_KEY, continuousAdd);
  document.getElementById('continuousToggleWrap').classList.toggle('active', continuousAdd);
  document.getElementById('itemSaveBtn').textContent = continuousAdd ? 'הוסף + המשך ➜' : 'שמירה';
}

function openAddItemModal() {
  if (isListLocked()) return;
  document.getElementById('itemModalTitle').textContent = 'הוספת פריט';
  document.getElementById('itemForm').reset();
  document.getElementById('itemFormId').value = '';
  setAdvancedFieldsOpen(false);

  targetListId = db.currentId;
  updateContextBarDisplay();
  document.getElementById('continuousToggleWrap').classList.remove('hidden');
  document.getElementById('contextBar').classList.remove('hidden');
  document.getElementById('continuousToggle').checked = continuousAdd;
  document.getElementById('continuousToggleWrap').classList.toggle('active', continuousAdd);
  document.getElementById('itemSaveBtn').textContent = continuousAdd ? 'הוסף + המשך ➜' : 'שמירה';

  openModal('itemModal');
  updateItemModalScrollHint();
  document.getElementById('itemName').focus();
}

function openEditItemModal(itemId) {
  const list = getCurrentList();
  const item = list?.items.find((i) => i.id === itemId);
  if (!item) return;
  document.getElementById('itemModalTitle').textContent = 'עריכת פריט';
  document.getElementById('itemFormId').value = item.id;
  document.getElementById('itemName').value = item.name;
  setAdvancedFieldsOpen(true);
  document.getElementById('itemPrice').value = item.price || '';
  document.getElementById('itemQty').value = item.qty || 1;
  document.getElementById('itemCategorySelect').value = item.category || '';
  document.getElementById('itemDueDate').value = item.dueDate || '';
  document.getElementById('itemNote').value = item.note || '';
  document.getElementById('itemPaymentUrl').value = item.paymentUrl || '';

  document.getElementById('continuousToggleWrap').classList.add('hidden');
  document.getElementById('contextBar').classList.add('hidden');

  openModal('itemModal');
  updateItemModalScrollHint();
}

function handleItemFormSubmit(e) {
  e.preventDefault();
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
    closeModal('itemModal');
    render();
    return;
  }

  const destId = db.lists[targetListId] ? targetListId : db.currentId;
  if (db.lists[destId]?.locked) {
    showToast('הרשימה נעולה — יש לבטל נעילה כדי להוסיף אליה');
    return;
  }
  addItem(destId, data);
  db.currentId = destId;
  save();
  render();

  if (continuousAdd) {
    document.getElementById('itemForm').reset();
    document.getElementById('itemFormId').value = '';
    setTimeout(() => document.getElementById('itemName').focus(), 80);
  } else {
    closeModal('itemModal');
  }
}

function handleItemsContainerClick(e) {
  const card = e.target.closest('.item-card');
  if (!card) return;
  const itemId = card.dataset.itemId;
  const action = e.target.closest('[data-action]')?.dataset.action;

  if (action === 'toggle') {
    if (isListLocked()) return;
    toggleItemChecked(db.currentId, itemId);
    render();
  } else if (action === 'delete') {
    if (isListLocked()) return;
    const list = getCurrentList();
    const snapshotIndex = list.items.findIndex((i) => i.id === itemId);
    const snapshot = { ...list.items[snapshotIndex] };
    const anchorRect = card.getBoundingClientRect();
    deleteItem(db.currentId, itemId);
    render();
    showToast(`"${snapshot.name}" נמחק`, {
      undoLabel: 'בטל',
      onUndo: () => {
        insertItem(db.currentId, snapshotIndex, snapshot);
        render();
      },
      anchorRect,
      itemShaped: true,
      accentColor: CATEGORIES[snapshot.category] || CATEGORIES['אחר'],
    });
  } else if (action === 'expand-name') {
    e.target.closest('.item-name').classList.toggle('expanded');
  } else if (action === 'edit') {
    if (isListLocked()) return;
    openEditItemModal(itemId);
  }
}

export function initItemCrud() {
  populateCategorySelect();
  document.getElementById('fabAddItem').addEventListener('click', openAddItemModal);
  document.getElementById('itemForm').addEventListener('submit', handleItemFormSubmit);
  document.getElementById('itemAdvancedToggle').addEventListener('click', () => {
    setAdvancedFieldsOpen(document.getElementById('itemAdvancedFields').classList.contains('hidden'));
  });
  document.getElementById('itemQtyMinus').addEventListener('click', () => stepQty(-1));
  document.getElementById('itemQtyPlus').addEventListener('click', () => stepQty(1));
  document.getElementById('itemModalCard').addEventListener('scroll', updateItemModalScrollHint);
  document.getElementById('itemsContainer').addEventListener('click', handleItemsContainerClick);

  document.getElementById('continuousToggle').addEventListener('change', toggleContinuousMode);
  document.getElementById('contextListBtn').addEventListener('click', toggleListDropdown);
  document.getElementById('listDropdownScroll').addEventListener('click', (e) => {
    const item = e.target.closest('.list-dropdown-item');
    if (item) selectTargetList(item.dataset.listId);
  });
  document.getElementById('createListFromDropdownBtn').addEventListener('click', handleCreateListFromDropdown);
  document.getElementById('newListFromDropdown').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateListFromDropdown();
    }
  });
}
