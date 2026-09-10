const TEXT_SCALE_KEY = 'vplus_text_scale';
const LABELS = { 1: 'רגיל', 2: 'גדול', 3: 'גדול מאוד', 4: 'ענק', 5: 'ענק מאוד' };

function currentScale() {
  const value = Number(document.documentElement.dataset.textScale) || 1;
  return value >= 1 && value <= 5 ? value : 1;
}

function applyScale(scale) {
  if (scale === 1) {
    delete document.documentElement.dataset.textScale;
  } else {
    document.documentElement.dataset.textScale = String(scale);
  }
  localStorage.setItem(TEXT_SCALE_KEY, String(scale));

  const btn = document.getElementById('textScaleBtn');
  btn.title = `גודל טקסט: ${LABELS[scale]}`;
  btn.classList.toggle('active', scale > 1);
}

export function initTextScale() {
  const btn = document.getElementById('textScaleBtn');
  applyScale(currentScale());
  btn.addEventListener('click', () => {
    const next = (currentScale() % 5) + 1;
    applyScale(next);
  });
}
