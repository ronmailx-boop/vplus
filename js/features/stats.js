import { db } from '../core/store.js';
import { CATEGORIES, CATEGORY_LABELS } from '../core/constants.js';

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
  const monthKeys = lastSixMonthKeys();
  const monthlyValues = monthKeys.map((k) => db.stats.monthlyData[k] || 0);

  const monthlyCanvas = document.getElementById('monthlyChart');
  if (monthlyCanvas && window.Chart) {
    monthlyChart?.destroy();
    monthlyChart = new Chart(monthlyCanvas, {
      type: 'bar',
      data: {
        labels: monthKeys.map(monthLabel),
        datasets: [{ data: monthlyValues, backgroundColor: '#7367f0', borderRadius: 6 }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  const catTotals = categoryTotals();
  const catEntries = Object.entries(catTotals).filter(([, v]) => v > 0);
  const categoryCanvas = document.getElementById('categoryChart');
  if (categoryCanvas && window.Chart) {
    categoryChart?.destroy();
    categoryChart = new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: catEntries.map(([cat]) => CATEGORY_LABELS[cat] || cat),
        datasets: [{ data: catEntries.map(([, v]) => v), backgroundColor: catEntries.map(([cat]) => CATEGORIES[cat] || '#6b7280') }],
      },
      options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } },
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
