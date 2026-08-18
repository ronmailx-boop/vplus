import { db, save } from '../core/store.js';
import { openModal } from '../ui/modals.js';
import { formatCurrency, sanitize } from '../core/utils.js';

function visibleEntries() {
  return Object.entries(db.pricebook).filter(([name]) => !db.hiddenFromAutocomplete.includes(name));
}

function getSuggestions(term) {
  const t = term.toLowerCase().trim();
  if (!t) return [];
  return visibleEntries()
    .filter(([name]) => name.includes(t))
    .slice(0, 6);
}

function renderSuggestions(term) {
  const container = document.getElementById('autocompleteContainer');
  const matches = getSuggestions(term);
  if (!matches.length) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }
  container.innerHTML = matches
    .map(
      ([name, data]) => `
      <div class="autocomplete-item" data-name="${sanitize(name)}" data-price="${data.price}" data-category="${sanitize(data.category || '')}">
        <span>${sanitize(name)}</span>
        <span>${formatCurrency(data.price)}</span>
      </div>
    `
    )
    .join('');
  container.classList.remove('hidden');
}

function selectSuggestion(el) {
  document.getElementById('itemName').value = el.dataset.name;
  document.getElementById('itemPrice').value = el.dataset.price;
  if (el.dataset.category) document.getElementById('itemCategorySelect').value = el.dataset.category;
  document.getElementById('autocompleteContainer').classList.add('hidden');
}

export function initAutocomplete() {
  const nameInput = document.getElementById('itemName');
  const container = document.getElementById('autocompleteContainer');

  nameInput.addEventListener('input', () => renderSuggestions(nameInput.value));
  nameInput.addEventListener('blur', () => setTimeout(() => container.classList.add('hidden'), 150));
  container.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (item) selectSuggestion(item);
  });
}

function renderMacheron(filterTerm = '') {
  const container = document.getElementById('macheronContent');
  const term = filterTerm.toLowerCase().trim();
  const entries = visibleEntries().filter(([name]) => !term || name.includes(term));
  if (!entries.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:16px;">אין מוצרים במחירון.</p>';
    return;
  }
  container.innerHTML = entries
    .map(
      ([name, data]) => `
      <div class="summary-row">
        <div>
          <div class="summary-name">${sanitize(name)}</div>
          <div class="summary-sub">${sanitize(data.category || '')} · ${formatCurrency(data.price)}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button data-action="edit-price" data-name="${sanitize(name)}" aria-label="עריכת מחיר" title="עריכת מחיר">✏️</button>
          <button data-action="hide-item" data-name="${sanitize(name)}" aria-label="הסתרה מהמחירון" title="הסתרה">🚫</button>
        </div>
      </div>
    `
    )
    .join('');
}

function handleMacheronClick(e) {
  const editBtn = e.target.closest('[data-action="edit-price"]');
  const hideBtn = e.target.closest('[data-action="hide-item"]');
  if (editBtn) {
    const name = editBtn.dataset.name;
    const current = db.pricebook[name]?.price || 0;
    const input = window.prompt(`מחיר חדש עבור "${name}":`, current);
    if (input !== null) {
      const price = Number(input);
      if (!isNaN(price) && price >= 0) {
        db.pricebook[name].price = price;
        save();
        renderMacheron(document.getElementById('macheronSearch').value);
      }
    }
  } else if (hideBtn) {
    const name = hideBtn.dataset.name;
    db.hiddenFromAutocomplete.push(name);
    save();
    renderMacheron(document.getElementById('macheronSearch').value);
  }
}

export function initMacheron() {
  document.getElementById('openMacheronBtn').addEventListener('click', () => {
    renderMacheron('');
    document.getElementById('macheronSearch').value = '';
    openModal('macheronModal');
  });
  document.getElementById('macheronSearch').addEventListener('input', (e) => renderMacheron(e.target.value));
  document.getElementById('macheronContent').addEventListener('click', handleMacheronClick);
}
