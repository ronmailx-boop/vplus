import { db } from '../core/store.js';
import { CATEGORY_LABELS } from '../core/constants.js';

/* Nocturne redesign: charts are themed from the design tokens — one accent for
   the current month, muted ramp steps for the rest, no per-category colors. */
const token = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

let monthlyChart = null;
let categoryChart = null;

function lastSixMonthKeys() {
  const keys = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(d.toISOString().slice(0, 7));
  }
  return keys;
}

function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('he-IL', { month: 'short' });
}

function categoryTotals() {
  const totals = {};
  for (const entry of db.history) {
    for (const item of entry.items) {
      const cat = item.category || 'אחר';
      totals[cat] = (totals[cat] || 0) + item.price * item.qty;
    }
  }
  return totals;
}

function popularItems(limit = 5) {
  const counts = {};
  for (const entry of db.history) {
    for (const item of entry.items) {
      const key = item.name.toLowerCase().trim();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export function renderCharts() {
  const accent = token('--color-accent', '#9184d9');
  const accentDeep = token('--color-accent-700', '#5a4d9b');
  const muted = token('--color-neutral-800', '#2e3244');
  const label = token('--color-neutral-500', '#7d8090');
  const grid = token('--color-neutral-900', '#1f2233');
  const family = 'Assistant, Inter, system-ui, sans-serif';

  const axis = {
    grid: { color: grid, drawBorder: false },
    border: { display: false },
    ticks: { color: label, font: { size: 10, family } },
  };

  const monthKeys = lastSixMonthKeys();
  const monthlyValues = monthKeys.map((k) => db.stats.monthlyData[k] || 0);

  const monthlyCanvas = document.getElementById('monthlyChart');
  if (monthlyCanvas && window.Chart) {
    monthlyChart?.destroy();
    monthlyChart = new Chart(monthlyCanvas, {
      type: 'bar',
      data: {
        labels: monthKeys.map(monthLabel),
        datasets: [
          {
            data: monthlyValues,
            backgroundColor: monthKeys.map((_, i) => (i === monthKeys.length - 1 ? accent : muted)),
            borderRadius: 3,
            borderSkipped: 'bottom',
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { titleFont: { family }, bodyFont: { family } } },
        scales: { x: { ...axis, grid: { display: false } }, y: { ...axis, beginAtZero: true } },
      },
    });
  }

  /* Category split reads as a horizontal bar chart — a doughnut needs one color
     per slice, which this system's mono palette does not provide. */
  const catTotals = categoryTotals();
  const catEntries = Object.entries(catTotals)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const categoryCanvas = document.getElementById('categoryChart');
  if (categoryCanvas && window.Chart) {
    categoryChart?.destroy();
    categoryChart = new Chart(categoryCanvas, {
      type: 'bar',
      data: {
        labels: catEntries.map(([cat]) => CATEGORY_LABELS[cat] || cat),
        datasets: [
          {
            data: catEntries.map(([, v]) => v),
            backgroundColor: catEntries.map((_, i) => (i === 0 ? accent : accentDeep)),
            borderRadius: 3,
            maxBarThickness: 12,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { titleFont: { family }, bodyFont: { family } } },
        scales: { x: { ...axis, beginAtZero: true }, y: { ...axis, grid: { display: false } } },
      },
    });
  }

  const popularContainer = document.getElementById('popularItemsList');
  if (popularContainer) {
    const popular = popularItems();
    popularContainer.innerHTML = popular.length
      ? popular.map(([name, count]) => `<li>${name} <span class="totals-label">×${count}</span></li>`).join('')
      : '<li class="totals-label">אין עדיין נתונים</li>';
  }
}
