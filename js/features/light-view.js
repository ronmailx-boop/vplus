import { render } from '../ui/render.js';

const LIGHT_VIEW_KEY = 'vplus_light_view';

function isLightViewOn() {
  return localStorage.getItem(LIGHT_VIEW_KEY) === '1';
}

function applyLightView(on) {
  if (on) document.documentElement.dataset.lightView = '1';
  else delete document.documentElement.dataset.lightView;
  localStorage.setItem(LIGHT_VIEW_KEY, on ? '1' : '0');

  const btn = document.getElementById('lightViewBtn');
  btn.title = on ? 'תצוגה קלה (פעיל)' : 'תצוגה קלה';
  btn.classList.toggle('active', on);
}

export function initLightView() {
  const btn = document.getElementById('lightViewBtn');
  applyLightView(isLightViewOn());
  btn.addEventListener('click', () => {
    applyLightView(!isLightViewOn());
    render();
  });
}
