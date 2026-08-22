import { getCurrentList, calcListTotal, sortItemsByStatusAndCategory } from '../core/store.js';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../core/constants.js';
import { formatCurrency } from '../core/utils.js';
import { showToast } from '../ui/modals.js';

function buildShareText() {
  const list = getCurrentList();
  if (!list || !list.items.length) return null;

  const sorted = sortItemsByStatusAndCategory(list.items, CATEGORY_ORDER);
  const catSums = {};
  sorted.forEach((item) => {
    if (!item.checked) catSums[item.category] = (catSums[item.category] || 0) + item.price * item.qty;
  });
  const doneItems = sorted.filter((item) => item.checked);
  const doneSum = doneItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  let text = `🛒 *${list.name}*\n_שותף מ-vplus_\n`;

  let lastCategory = null;
  let doneHeaderShown = false;
  let itemNum = 0;
  sorted.forEach((item) => {
    if (!item.checked) {
      if (item.category !== lastCategory) {
        const label = CATEGORY_LABELS[item.category] || item.category;
        text += `\n${label} — ${formatCurrency(catSums[item.category])}\n`;
        lastCategory = item.category;
      }
    } else if (!doneHeaderShown) {
      text += `\n✅ נאספו · ${doneItems.length} — ${formatCurrency(doneSum)}\n`;
      doneHeaderShown = true;
    }
    itemNum++;
    const mark = item.checked ? '✅' : '⬜';
    const name = item.checked ? `~${item.name}~` : `*${item.name}*`;
    const qty = item.qty > 1 ? ` ×${item.qty}` : '';
    text += `${itemNum}. ${mark} ${name}${qty} - ${formatCurrency(item.price * item.qty)}\n`;
  });

  text += `\n━━━━━━━━━━━━━━━\n💰 *סה"כ: ${formatCurrency(calcListTotal(list))}*`;

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
