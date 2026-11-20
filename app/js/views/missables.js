// Missables view: three boards (Possibly missable / Watch / Unconfirmed) plus every dispute.
import { displayName } from '../data.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function board(model, state, key, title) {
  const items = model.trophies.filter((t) => t.missable === key);
  return `<section class="board"><h2>${title} (${items.length})</h2>
    ${items.map((t) => `<div class="mcard"><b>${esc(displayName(t, state))}</b> <span class="small">${t.grade} · ${t.stage}</span><br>${esc(t.missableNote)}</div>`).join('') || '<p class="small">None.</p>'}
  </section>`;
}

export function renderMissables(root, model, store) {
  const { state } = store;
  const disputed = model.trophies.filter((t) => t.dispute);
  root.innerHTML = `
  <div class="boards">
    ${board(model, state, 'possibly', 'Possibly Missable')}
    ${board(model, state, 'watch', 'Watch')}
    ${board(model, state, 'unconfirmed', 'Unconfirmed')}
  </div>
  <section class="stage" style="margin-top:10px">
    <h2>Disputes — shown both ways (${disputed.length})</h2>
    ${disputed.map((t) => `<div class="dispute"><h3>${esc(displayName(t, state))}</h3>
      <div class="cols">
        <div class="col"><b>Reading A</b><br>${esc(t.dispute.a.text)} ${(t.dispute.a.cite || []).map((i) => `[${i}]`).join(' ')}</div>
        <div class="col"><b>Reading B</b><br>${esc(t.dispute.b.text)} ${(t.dispute.b.cite || []).map((i) => `[${i}]`).join(' ')}</div>
      </div>
      <p class="call"><b>Our call:</b> ${esc(t.dispute.call)}</p></div>`).join('')}
  </section>`;
}
