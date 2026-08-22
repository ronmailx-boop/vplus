import { getCurrentList, calcListTotal } from '../core/store.js';
import { formatCurrency } from '../core/utils.js';
import { showToast } from '../ui/modals.js';

function buildShareText() {
  const list = getCurrentList();
  if (!list || !list.items.length) return null;

  let text = `🛒 *${list.name}:*\n\n`;
  list.items.forEach((item, idx) => {
    const mark = item.checked ? '✅' : '⬜';
    text += `${idx + 1}. ${mark} *${item.name}* (x${item.qty}) - ${formatCurrency(item.price * item.qty)}\n`;
  });
  text += `\n💰 *סה"כ: ${formatCurrency(calcListTotal(list))}*`;

  return { title: `Vplus - ${list.name}`, text };
}

async function handleShareClick() {
  const shared = buildShareText();
  if (!shared) {
    showToast('הרשימה ריקה — אין מה לשתף');
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share(shared);
    } catch (err) {
      if (err.name !== 'AbortError') showToast('השיתוף נכשל');
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(shared.text);
    showToast('הטקסט הועתק ללוח');
  } catch {
    showToast('לא ניתן להעתיק ללוח');
  }
}

export function initShare() {
  document.getElementById('shareListBtn').addEventListener('click', handleShareClick);
}
