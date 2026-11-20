// Leonida Legend v3 — app bootstrap: header progress, audit strip, tabs, export/import/reset.
import { loadData } from './data.js';
import { createStore } from './store.js';
import { renderLedger } from './views/ledger.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderSources } from './views/sources.js';

const params = new URLSearchParams(location.search);
const model = await loadData();
const store = createStore();
if (params.get('demo') === '1' && !sessionStorage.getItem('ll-demo-applied')) {
  store.applyDemo();
  sessionStorage.setItem('ll-demo-applied', '1');
}
if (params.has('spoilers')) store.state.spoilers = params.get('spoilers') === 'on';
let view = params.get('view') || 'ledger';
if (!['ledger', 'roadmap', 'missables', 'sources'].includes(view)) view = 'ledger';
const openId = Number(params.get('open'));
if (openId && model.trophies.some((t) => t.id === openId)) store.state.selected = openId;

const viewEl = document.getElementById('view');
document.getElementById('auditStrip').textContent = 'AUDIT · ' + model.auditText;
const spoilerToggle = document.getElementById('spoilerToggle');
spoilerToggle.checked = store.state.spoilers;

function header() {
  const { state } = store;
  const by = { platinum: [0, 1], gold: [0, 2], silver: [0, 6], bronze: [0, 46] };
  let pts = 0;
  for (const t of model.trophies) {
    if (state.earned.has(t.id)) {
      by[t.grade][0] += 1;
      pts += t.points;
    }
  }
  document.getElementById('earnedCount').textContent = `${state.earned.size}/55`;
  document.getElementById('pointsLine').textContent =
    `P ${by.platinum[0]}/1 · G ${by.gold[0]}/2 · S ${by.silver[0]}/6 · B ${by.bronze[0]}/46`;
  document.getElementById('totalPoints').textContent = `${pts} pts`;
  document.getElementById('progressBar').style.width = `${(state.earned.size / 55) * 100}%`;
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
}

function rerender() {
  header();
  if (view === 'ledger') renderLedger(viewEl, model, store, rerender);
  else if (view === 'roadmap') renderRoadmap(viewEl, model, store, rerender);
  else if (view === 'missables') renderMissables(viewEl, model, store);
  else renderSources(viewEl, model);
}

document.querySelectorAll('.tab').forEach((b) =>
  b.addEventListener('click', () => { view = b.dataset.view; rerender(); }),
);
spoilerToggle.addEventListener('change', () => { store.state.spoilers = spoilerToggle.checked; store.save(); rerender(); });
document.getElementById('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(store.snapshot(), null, 2)], { type: 'application/json' }));
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    store.restore(JSON.parse(await file.text()));
    spoilerToggle.checked = store.state.spoilers;
    rerender();
  } catch {
    document.getElementById('savedNote').textContent = 'Import failed: not a valid progress file.';
  }
});
document.getElementById('resetBtn').addEventListener('click', () => { store.reset(); rerender(); });

rerender();
