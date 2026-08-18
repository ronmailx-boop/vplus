import { db, addItem } from '../core/store.js';
import { openModal, closeModal, showToast } from '../ui/modals.js';
import { render } from '../ui/render.js';

function parseLine(rawLine) {
  let line = rawLine.trim();
  if (!line) return null;
  line = line.replace(/^[-*•▪●]\s*/, '').trim();
  if (!line) return null;

  let qty = 1;
  const qtyMatch = line.match(/[x×]\s*(\d+)/i);
  if (qtyMatch) {
    qty = parseInt(qtyMatch[1], 10) || 1;
    line = line.replace(qtyMatch[0], '').trim();
  }

  let price = 0;
  const priceMatch = line.match(/₪\s*(\d+(?:\.\d+)?)/) || line.match(/(\d+(?:\.\d+)?)\s*₪/) || line.match(/[-–]\s*(\d+(?:\.\d+)?)\s*$/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1]) || 0;
    line = line.replace(priceMatch[0], '').trim();
  }

  line = line.replace(/[()]/g, '').replace(/[-–]\s*$/, '').trim();
  if (!line) return null;

  return { name: line, price, qty };
}

export function parseTextToItems(text) {
  return text
    .split('\n')
    .map(parseLine)
    .filter(Boolean);
}

function importItems(items) {
  if (!items.length) {
    showToast('לא נמצאו פריטים לייבוא');
    return;
  }
  for (const item of items) {
    addItem(db.currentId, item);
  }
  render();
  showToast(`יובאו ${items.length} פריטים`);
}

async function handleImportFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('importText').value = text;
  } catch {
    showToast('לא ניתן לקרוא מהלוח — יש לאשר הרשאת גישה בדפדפן');
  }
}

function handleImportTextBtn() {
  const text = document.getElementById('importText').value;
  const items = parseTextToItems(text);
  importItems(items);
  document.getElementById('importText').value = '';
  closeModal('importModal');
}

function handleExcelFile(e) {
  const file = e.target.files[0];
  if (!file || !window.XLSX) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const workbook = XLSX.read(evt.target.result, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const items = rows
        .map((row) => {
          const name = String(row[0] || '').trim();
          if (!name) return null;
          const price = parseFloat(row[1]) || 0;
          return { name, price, qty: 1 };
        })
        .filter(Boolean);
      importItems(items);
      closeModal('importModal');
    } catch {
      showToast('שגיאה בקריאת קובץ ה-Excel');
    }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = '';
}

export function initImport() {
  document.getElementById('lnbImportBtn').addEventListener('click', () => openModal('importModal'));
  document.getElementById('importTextBtn').addEventListener('click', handleImportTextBtn);
  document.getElementById('importFromClipboardBtn').addEventListener('click', handleImportFromClipboard);
  document.getElementById('excelFileInput').addEventListener('change', handleExcelFile);
}
