export function sanitize(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

export function formatCurrency(amount) {
  return "₪" + (Number(amount) || 0).toFixed(2);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("he-IL");
}

export function formatAddedAt(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}

export function getShareCode(shareId) {
  let hash = 0;
  for (let i = 0; i < shareId.length; i++) {
    hash = (hash * 31 + shareId.charCodeAt(i)) >>> 0;
  }
  return String(hash % 10000).padStart(4, '0');
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
