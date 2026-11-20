// Roadmap view: the 7 stages S1-S7, each with its trophies, progress and points.
import { STAGES, displayName } from '../data.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function renderRoadmap(root, model, store, rerender) {
  const { state } = store;
  root.innerHTML = STAGES.map((st) => {
    const items = model.trophies.filter((t) => t.stage === st.id);
    const done = items.filter((t) => state.earned.has(t.id)).length;
    const pts = items.reduce((a, t) => a + t.points, 0);
    const got = items.filter((t) => state.earned.has(t.id)).reduce((a, t) => a + t.points, 0);
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    return `<section class="stage">
      <h2>${esc(st.label)}</h2>
      <div class="small">${done}/${items.length} earned · ${got}/${pts} points</div>
      <div class="bar"><div style="height:100%;width:${pct}%;background:var(--accent2)"></div></div>
      <ul>${items.map((t) => `<li>${state.earned.has(t.id) ? '✔' : '○'} <b>${esc(displayName(t, state))}</b> <span class="small">(${t.grade}, ${t.points} pts${t.target > 1 ? `, target ${t.target}` : ''}${t.missable ? `, ${t.missable}` : ''})</span></li>`).join('')}</ul>
    </section>`;
  }).join('');
}
