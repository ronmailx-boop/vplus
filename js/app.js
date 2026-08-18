import './core/store.js';
import { render, setActivePage } from './ui/render.js';
import { setupGenericModalDismiss } from './ui/modals.js';
import { initItemCrud } from './features/item-crud.js';
import { initListCrud } from './features/list-crud.js';
import { initHistory } from './features/history.js';

function initNavTabs() {
  document.querySelectorAll('.tab-btn[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => setActivePage(btn.dataset.page));
  });
}

function initListSearch() {
  const toggleBtn = document.getElementById('searchIconBtn');
  const bar = document.getElementById('listSearchBar');
  const input = document.getElementById('listSearchInput');
  const clearBtn = document.getElementById('clearListSearchBtn');

  function applyFilter() {
    const term = input.value.trim().toLowerCase();
    document.querySelectorAll('#itemsContainer .item-card').forEach((card) => {
      const name = card.querySelector('.item-name')?.textContent.toLowerCase() || '';
      card.style.display = !term || name.includes(term) ? '' : 'none';
    });
  }

  toggleBtn.addEventListener('click', () => {
    bar.classList.toggle('hidden');
    if (!bar.classList.contains('hidden')) input.focus();
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    applyFilter();
    bar.classList.add('hidden');
  });
  input.addEventListener('input', applyFilter);
}

setupGenericModalDismiss();
initNavTabs();
initListSearch();
initItemCrud();
initListCrud();
initHistory();
render();
