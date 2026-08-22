import { db, getCurrentList, calcListTotal, calcListPaid, sortItemsByStatusAndCategory } from '../core/store.js';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ORDER } from '../core/constants.js';
import { sanitize, formatCurrency, formatDate } from '../core/utils.js';
import { renderCharts } from '../features/stats.js';

/* Nocturne redesign: categories are marked by an accent rule + label, not by a
   per-category color. Icons come from Phosphor (loaded in index.html). */
const CATEGORY_ICONS = {
  'פירות וירקות': 'ph-carrot',
  'בשר ודגים': 'ph-fish',
  'חלב וביצים': 'ph-egg',
  'לחם ומאפים': 'ph-bread',
  'שימורים': 'ph-cooking-pot',
  'חטיפים': 'ph-cookie',
  'משקאות': 'ph-wine',
  'ניקיון': 'ph-broom',
  'היגיינה': 'ph-drop',
  'אחר': 'ph-package',
};

export const categoryIcon = (cat) => CATEGORY_ICONS[cat] || 'ph-package';

export let activePage = 'lists';
export let itemEditMode = false;
export let listEditMode = false;
export let selectedItemIds = new Set();
export let selectedListIds = new Set();

export function setItemEditMode(value) {
  itemEditMode = value;
  selectedItemIds = new Set();
  document.getElementById('bulkDeleteRow').classList.toggle('hidden', !value);
  document.getElementById('itemEditModeBtn').classList.toggle('active', value);
  render();
}

export function setListEditMode(value) {
  listEditMode = value;
  selectedListIds = new Set();
  document.getElementById('bulkDeleteListsRow').classList.toggle('hidden', !value);
  document.getElementById('listEditModeBtn').classList.toggle('active', value);
  render();
}

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
  const budget = list.budget > 0 ? ` · תקציב ${formatCurrency(list.budget)}` : '';
  countEl.textContent = `${done}/${total} נאספו${budget}`;

  const lockBtn = document.getElementById('lockListBtn');
  lockBtn.innerHTML = `<i class="ph ${list.locked ? 'ph-lock' : 'ph-lock-open'}"></i>`;
  lockBtn.classList.toggle('active', !!list.locked);
}

function itemCardHTML(item) {
  const metaParts = [];
  if (item.qty > 1) metaParts.push(`×${item.qty}`);
  if (item.price) metaParts.push(`${formatCurrency(item.price)} ליח'`);
  if (item.dueDate) metaParts.push(formatDate(item.dueDate));
  if (item.note) metaParts.push(sanitize(item.note));
  const lineTotal = item.price ? formatCurrency(item.price * item.qty) : '';
  const catColor = CATEGORIES[item.category] || CATEGORIES['אחר'];

  if (itemEditMode) {
    return `
      <div class="item-card" data-item-id="${item.id}" style="--cat:${catColor}">
        <span class="drag-handle">⠿</span>
        <input type="checkbox" class="item-checkbox-select" data-action="select" ${selectedItemIds.has(item.id) ? 'checked' : ''}>
        <div class="item-main">
          <div class="item-name">${sanitize(item.name)}</div>
          <div class="item-meta">${metaParts.join(' · ')}</div>
        </div>
        <div class="item-line-total">${lineTotal}</div>
      </div>
    `;
  }

  return `
    <div class="item-card ${item.checked ? 'checked' : ''}" data-item-id="${item.id}" style="--cat:${catColor}">
      <div class="item-checkbox ${item.checked ? 'checked' : ''}" data-action="toggle"></div>
      <div class="item-main" data-action="edit">
        <div class="item-name" data-action="expand-name" title="${sanitize(item.name)}">${sanitize(item.name)}</div>
        <div class="item-meta">${metaParts.join(' · ')}</div>
      </div>
      <div class="item-line-total">${lineTotal}</div>
      <div class="item-actions">
        <button data-action="delete" aria-label="מחיקת פריט" title="מחיקה"><i class="ph ph-x"></i></button>
      </div>
    </div>
  `;
}

function categoryHeaderHTML(category, sum) {
  const label = CATEGORY_LABELS[category] || category;
  const color = CATEGORIES[category] || CATEGORIES['אחר'];
  return `<div class="category-header" style="color:${color}">${sanitize(label)}<span class="cat-sum">${formatCurrency(sum)}</span></div>`;
}

function renderItemsPage() {
  const container = document.getElementById('itemsContainer');
  const budgetWarning = document.getElementById('budgetWarning');
  const list = getCurrentList();
  if (!list) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-neutral-500);padding:40px 16px;font-size:12.5px;">אין רשימה נבחרת. צרו רשימה חדשה.</p>';
    budgetWarning.classList.add('hidden');
    return;
  }

  const total = calcListTotal(list);
  const paid = calcListPaid(list);
  document.getElementById('totalsPaid').textContent = formatCurrency(paid);
  document.getElementById('totalsRemaining').textContent = formatCurrency(total - paid);
  document.getElementById('totalsTotal').textContent = formatCurrency(total);

  if (list.budget > 0 && total > list.budget) {
    budgetWarning.innerHTML = `<i class="ph ph-warning-circle"></i><span>חריגה מהתקציב: ${formatCurrency(total)} מתוך ${formatCurrency(list.budget)}</span>`;
    budgetWarning.classList.remove('hidden');
  } else {
    budgetWarning.classList.add('hidden');
  }

  if (!list.items.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-neutral-500);padding:56px 16px;font-size:12.5px;">הרשימה ריקה. הוסיפו פריט ראשון.</p>';
    return;
  }

  if (itemEditMode) {
    container.innerHTML = list.items.map(itemCardHTML).join('');
    return;
  }

  const sorted = sortItemsByStatusAndCategory(list.items, CATEGORY_ORDER);
  const catSum = {};
  for (const item of sorted) {
    if (item.checked) continue;
    catSum[item.category] = (catSum[item.category] || 0) + item.price * item.qty;
  }

  let html = '';
  let lastCategory = null;
  let doneHeaderDone = false;
  const doneItems = sorted.filter((i) => i.checked);

  for (const item of sorted) {
    if (!item.checked) {
      if (item.category !== lastCategory) {
        html += categoryHeaderHTML(item.category, catSum[item.category] || 0);
        lastCategory = item.category;
      }
    } else if (!doneHeaderDone) {
      const doneSum = doneItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      html += `<div class="category-header" style="color:var(--color-neutral-300)">נאספו · ${doneItems.length}<span class="cat-sum">${formatCurrency(doneSum)}</span></div>`;
      doneHeaderDone = true;
    }
    html += itemCardHTML(item);
  }
  container.innerHTML = html;
}

function renderSummaryPage() {
  const container = document.getElementById('summaryContainer');
  const ids = db.listsOrder.filter((id) => db.lists[id]);
  if (!ids.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-neutral-500);padding:40px 16px;font-size:12.5px;">אין רשימות.</p>';
    return;
  }
  container.innerHTML = ids
    .map((id) => {
      const list = db.lists[id];
      const total = calcListTotal(list);
      const paid = calcListPaid(list);
      const pct = total ? Math.round((paid / total) * 100) : 0;
      const trailing = listEditMode
        ? `<input type="checkbox" class="item-checkbox-select" data-action="select-list" ${selectedListIds.has(id) ? 'checked' : ''}>`
        : `<button data-action="delete-list" data-list-id="${id}" aria-label="מחיקת רשימה" title="מחיקה"><i class="ph ph-x"></i></button>`;
      const handle = listEditMode ? '<span class="drag-handle">⠿</span>' : '';
      const budget = list.budget > 0 ? ` מתוך ${formatCurrency(list.budget)}` : '';
      return `
        <div class="summary-row" data-list-id="${id}">
          ${handle}
          <i class="ph ph-list-checks" style="font-size:15px;color:${id === db.currentId ? 'var(--color-accent)' : 'var(--color-neutral-600)'}"></i>
          <div style="flex:1;min-width:0;">
            <div class="summary-name">${sanitize(list.name)}</div>
            <div class="summary-sub">${list.items.length} פריטים · ${formatCurrency(total)}${budget}</div>
          </div>
          <div class="summary-progress">
            <div class="track"><div class="fill" style="width:${pct}%"></div></div>
            <div class="pct">${pct}% נאסף</div>
          </div>
          ${trailing}
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
    <div class="stat-headline">
      <div class="stat-kicker">הוצאות החודש</div>
      <div class="stat-value">${formatCurrency(monthlyTotal)}</div>
      <div class="stat-sub">${db.stats.listsCompleted} רשימות הושלמו · מצטבר ${formatCurrency(db.stats.totalSpent)}</div>
    </div>
    <div class="chart-card">
      <h3>הוצאות חודשיות</h3>
      <canvas id="monthlyChart" height="150"></canvas>
    </div>
    <div class="chart-card">
      <h3>פילוח לפי קטגוריה</h3>
      <canvas id="categoryChart" height="150"></canvas>
    </div>
    <div class="chart-card">
      <h3>פריטים פופולריים</h3>
      <ul id="popularItemsList" style="margin:0;padding-inline-start:18px;"></ul>
    </div>
  `;
  renderCharts();
}
