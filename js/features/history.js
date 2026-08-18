import { db, completeList, restoreFromHistory, deleteHistoryEntry, calcListTotal, getCurrentList, createList } from '../core/store.js';
import { openModal, closeModal, confirmDialog, showToast } from '../ui/modals.js';
import { render, setActivePage } from '../ui/render.js';
import { formatCurrency, formatDate } from '../core/utils.js';

function renderHistoryContent() {
  const container = document.getElementById('historyContent');
  if (!db.history.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:16px;">אין עדיין רשימות בהיסטוריה.</p>';
    return;
  }
  container.innerHTML = [...db.history]
    .map((entry, index) => {
      const realIndex = db.history.indexOf(entry);
      return `
        <div class="summary-row">
          <div>
            <div class="summary-name">${entry.name}</div>
            <div class="summary-sub">${formatDate(new Date(entry.completedAt).toISOString())} · ${entry.items.length} פריטים · ${formatCurrency(entry.total)}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button data-action="restore-history" data-index="${realIndex}" aria-label="שחזור רשימה" title="שחזור">↩️</button>
            <button data-action="delete-history" data-index="${realIndex}" aria-label="מחיקה מהיסטוריה" title="מחיקה">🗑️</button>
          </div>
        </div>
      `;
    })
    .reverse()
    .join('');
}

async function handleHistoryClick(e) {
  const restoreBtn = e.target.closest('[data-action="restore-history"]');
  const deleteBtn = e.target.closest('[data-action="delete-history"]');

  if (restoreBtn) {
    const index = Number(restoreBtn.dataset.index);
    restoreFromHistory(index);
    closeModal('historyModal');
    setActivePage('lists');
    showToast('הרשימה שוחזרה');
    return;
  }
  if (deleteBtn) {
    const index = Number(deleteBtn.dataset.index);
    const ok = await confirmDialog('למחוק את הרשומה מההיסטוריה?');
    if (ok) {
      deleteHistoryEntry(index);
      renderHistoryContent();
    }
  }
}

async function handleFinishList() {
  const list = getCurrentList();
  if (!list || !list.items.length) return;
  const total = calcListTotal(list);
  const ok = await confirmDialog(`לסיים את הרשימה "${list.name}" (${formatCurrency(total)})? הרשימה תעבור להיסטוריה.`);
  if (!ok) return;
  const listId = db.currentId;
  completeList(listId);
  if (!db.listsOrder.length) {
    createList('רשימה חדשה');
  }
  render();
  showToast('הרשימה הושלמה ועברה להיסטוריה');
}

export function initHistory() {
  document.getElementById('openHistoryBtn').addEventListener('click', () => {
    renderHistoryContent();
    openModal('historyModal');
  });
  document.getElementById('historyContent').addEventListener('click', handleHistoryClick);
  document.getElementById('finishListBtn').addEventListener('click', handleFinishList);
}
