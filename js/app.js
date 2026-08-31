import './core/store.js';
import { render, setActivePage } from './ui/render.js';
import { setupGenericModalDismiss } from './ui/modals.js';
import { initItemCrud } from './features/item-crud.js';
import { initListCrud } from './features/list-crud.js';
import { initHistory } from './features/history.js';
import { initAutocomplete, initMacheron } from './features/autocomplete.js';
import { initImport } from './features/import.js';
import { initVoiceInput } from './features/voice.js';
import { initOrganize } from './features/organize.js';
import { initTextScale } from './features/text-scale.js';
import { initShare } from './features/share.js';
import { initCollab } from './features/collab.js';

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

function initSummarySearch() {
  const input = document.getElementById('summarySearchInput');
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    document.querySelectorAll('#summaryContainer .summary-row').forEach((row) => {
      const name = row.querySelector('.summary-name')?.textContent.toLowerCase() || '';
      row.style.display = !term || name.includes(term) ? '' : 'none';
    });
  });
}

function handleShortcutParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('page') === 'stats') {
    setActivePage('stats');
  }
  if (params.get('action') === 'new-list') {
    document.getElementById('lnbNewListBtn').click();
  }
}

setupGenericModalDismiss();
initNavTabs();
initListSearch();
initSummarySearch();
initItemCrud();
initListCrud();
initHistory();
initAutocomplete();
initMacheron();
initImport();
initVoiceInput();
initOrganize();
initTextScale();
initShare();
initCollab();
render();
handleShortcutParams();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      console.warn("רישום ה-Service Worker נכשל — האפליקציה תמשיך לעבוד ללא מצב אופליין");
    });
  });
}
