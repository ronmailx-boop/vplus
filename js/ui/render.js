import { db, getCurrentList, calcListTotal, calcListPaid, sortItemsByStatusAndCategory } from '../core/store.js';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ORDER } from '../core/constants.js';
import { sanitize, formatCurrency, formatDate } from '../core/utils.js';

export let activePage = 'lists';

export function setActivePage(page) {
  activePage = page;
  document.querySelectorAll('.page').forEach((el) => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach((el) => el.classList.remove('active'));
  document.getElementById('page' + capitalize(page))?.classList.remove('hidden');
  document.getElementById('tab' + capitalize(page))?.classList.add('active');
  render();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function render() {
  renderListNameBar();
  if (activePage === 'lists') renderItemsPage();
  else if (activePage === 'summary') renderSummaryPage();
  else if (activePage === 'stats') renderStatsPage();
}

function renderListNameBar() {
  const list = getCurrentList();
  const nameEl = document.getElementById('listNameDisplay');
  const countEl = document.getElementById('itemCountDisplay');
  if (!list) {
    nameEl.textContent = 'אין רשימה';
    countEl.textContent = '';
    return;
  }
  nameEl.textContent = list.name;
  const total = list.items.length;
  const done = list.items.filter((i) => i.checked).length;
  countEl.textContent = `${done}/${total} פריטים`;
}

function itemCardHTML(item) {
  const color = CATEGORIES[item.category] || CATEGORIES['אחר'];
  const metaParts = [];
  if (item.qty > 1) metaParts.push(`×${item.qty}`);
  if (item.price) metaParts.push(formatCurrency(item.price * item.qty));
  if (item.dueDate) metaParts.push('📅 ' + formatDate(item.dueDate));
  if (item.note) metaParts.push('📝 ' + sanitize(item.note));

  return `
    <div class="item-card ${item.checked ? 'checked' : ''}" data-item-id="${item.id}" style="border-color:${color}">
      <div class="item-checkbox ${item.checked ? 'checked' : ''}" data-action="toggle"></div>
      <div class="item-main" data-action="edit">
        <div class="item-name">${sanitize(item.name)}</div>
        <div class="item-meta">${metaParts.join(' · ')}</div>
      </div>
      <div class="item-actions">
        <button data-action="delete" aria-label="מחיקת פריט" title="מחיקה">🗑️</button>
      </div>
    </div>
  `;
}

function renderItemsPage() {
  const container = document.getElementById('itemsContainer');
  const budgetWarning = document.getElementById('budgetWarning');
  const list = getCurrentList();
  if (!list) {
    container.innerHTML = '<p>אין רשימה נבחרת. צור רשימה חדשה.</p>';
    budgetWarning.classList.add('hidden');
    return;
  }

  const total = calcListTotal(list);
  if (list.budget > 0 && total > list.budget) {
    budgetWarning.textContent = `⚠️ חריגה מהתקציב: ${formatCurrency(total)} מתוך ${formatCurrency(list.budget)}`;
    budgetWarning.classList.remove('hidden');
  } else {
    budgetWarning.classList.add('hidden');
  }

  if (!list.items.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:24px;">הרשימה ריקה. הוסיפו פריט ראשון!</p>';
    return;
  }

  const sorted = sortItemsByStatusAndCategory(list.items, CATEGORY_ORDER);
  let html = '';
  let lastCategory = null;
  for (const item of sorted) {
    if (!item.checked && item.category !== lastCategory) {
      html += `<div class="category-header" style="color:${CATEGORIES[item.category] || CATEGORIES['אחר']}">${CATEGORY_LABELS[item.category] || item.category}</div>`;
      lastCategory = item.category;
    }
    html += itemCardHTML(item);
  }
  container.innerHTML = html;
}

function renderSummaryPage() {
  const container = document.getElementById('summaryContainer');
  const ids = db.listsOrder.filter((id) => db.lists[id]);
  if (!ids.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:24px;">אין רשימות.</p>';
    return;
  }
  container.innerHTML = ids
    .map((id) => {
      const list = db.lists[id];
      const total = calcListTotal(list);
      const paid = calcListPaid(list);
      return `
        <div class="summary-row" data-list-id="${id}">
          <div>
            <div class="summary-name">${sanitize(list.name)}</div>
            <div class="summary-sub">${list.items.length} פריטים · ${formatCurrency(paid)} / ${formatCurrency(total)}</div>
          </div>
          <button data-action="delete-list" data-list-id="${id}" aria-label="מחיקת רשימה" title="מחיקה">🗑️</button>
        </div>
      `;
    })
    .join('');
}

function renderStatsPage() {
  const container = document.getElementById('statsContainer');
  const monthKey = new Date().toISOString().slice(0, 7);
  const monthlyTotal = db.stats.monthlyData[monthKey] || 0;
  container.innerHTML = `
    <div class="summary-row">
      <div>
        <div class="summary-name">סה"כ הוצאות החודש</div>
        <div class="summary-sub">${formatCurrency(monthlyTotal)}</div>
      </div>
    </div>
    <div class="summary-row">
      <div>
        <div class="summary-name">רשימות שהושלמו</div>
        <div class="summary-sub">${db.stats.listsCompleted}</div>
      </div>
    </div>
    <div class="summary-row">
      <div>
        <div class="summary-name">סה"כ הוצאות מצטבר</div>
        <div class="summary-sub">${formatCurrency(db.stats.totalSpent)}</div>
      </div>
    </div>
  `;
}
