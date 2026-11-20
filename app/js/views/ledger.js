// Tracker view: 3 panes — filterable trophy list | trophy detail | next-up + sources rail.
import { CHIPS, applyFilters } from '../filters.js';
import { displayName, displayDesc, isSealed } from '../data.js';

const GL = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
function cites(model, ids) {
  return (ids || []).map((id) => `<span class="cite">[${id}]</span>`).join(' ');
}
function tags(t, state) {
  let h = '';
  if (t.hidden) h += '<span class="tag">HIDDEN</span>';
  if (t.missable) h += `<span class="tag miss">${esc(t.missable.toUpperCase())}</span>`;
  if (t.dispute) h += '<span class="tag disp">DISPUTED</span>';
  if (state.earned.has(t.id)) h += '<span class="tag">EARNED</span>';
  return h;
}

export function renderLedger(root, model, store, rerender) {
  const { state } = store;
  const f = renderLedger.f || (renderLedger.f = { query: '', chip: 'all', grade: 'all' });
  const list = applyFilters(model.trophies, state, f);
  const sel = model.trophies.find((t) => t.id === state.selected) || model.trophies[0];
  const nextUp = model.trophies
    .filter((t) => !state.earned.has(t.id))
    .sort((a, b) => a.stage.localeCompare(b.stage) || a.id - b.id)
    .slice(0, 10);

  root.innerHTML = `
  <div class="ledger">
    <section class="pane">
      <h2>Trophies <span class="small">(${list.length} shown)</span></h2>
      <input type="search" id="q" placeholder="Search name or description…" value="${esc(f.query)}">
      <div class="chips">${CHIPS.map((c) => `<button type="button" class="chip ${f.chip === c.id ? 'active' : ''}" data-chip="${c.id}">${c.label}</button>`).join('')}</div>
      <div class="grades">
        ${['all', 'platinum', 'gold', 'silver', 'bronze'].map((g) => `<button type="button" class="chip ${f.grade === g ? 'active' : ''}" data-grade="${g}">${g === 'all' ? 'All grades' : GL[g]}</button>`).join('')}
      </div>
      <div class="tlist">
      ${list.map((t) => `
        <div class="trow ${t.id === sel.id ? 'sel' : ''}" data-sel="${t.id}">
          <input type="checkbox" data-earn="${t.id}" ${state.earned.has(t.id) ? 'checked' : ''}>
          <span class="badge b-${t.grade}">${GL[t.grade]}</span>
          <span><span class="nm">${esc(displayName(t, state))}</span> <span class="srcn">${(t.sources || []).length} src</span><br>
          <span class="ds">${esc(displayDesc(t, state))}</span><br>${tags(t, state)}</span>
        </div>`).join('')}
      </div>
    </section>
    <section class="pane detail">${detailHtml(model, store, sel)}</section>
    <aside class="pane">
      <h2>Next Up — Roadmap Order</h2>
      <ol class="nextup">${nextUp.map((t) => `<li data-sel="${t.id}"><b>${esc(t.stage)}</b> · ${esc(displayName(t, state))} <span class="srcn">${GL[t.grade]} · ${(t.sources || []).length} src</span></li>`).join('')}</ol>
      <h3>Sources for This Guide</h3>
      ${(sel.sources || []).map((id) => { const s = model.sourcesById.get(id); return s ? `<div class="rail-src"><span class="cite">[${s.id}]</span> <b>${esc(s.name)}</b> — ${esc(s.title)}<br><span class="small">read ${esc(s.read)}</span></div>` : ''; }).join('')}
    </aside>
  </div>`;

  root.querySelector('#q').addEventListener('input', (e) => { f.query = e.target.value; rerender(); const q = root.querySelector('#q'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); });
  root.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('click', () => { f.chip = b.dataset.chip; rerender(); }));
  root.querySelectorAll('[data-grade]').forEach((b) => b.addEventListener('click', () => { f.grade = b.dataset.grade; rerender(); }));
  root.querySelectorAll('[data-sel]').forEach((el) => el.addEventListener('click', (e) => { if (e.target.dataset.earn) return; state.selected = Number(el.dataset.sel); store.save(); rerender(); }));
  root.querySelectorAll('[data-earn]').forEach((cb) => cb.addEventListener('change', () => { const id = Number(cb.dataset.earn); if (cb.checked) state.earned.add(id); else state.earned.delete(id); store.save(); rerender(); }));
  wireDetail(root, model, store, rerender, sel);
}

function detailHtml(model, store, t) {
  const { state } = store;
  const sealed = isSealed(t, state);
  const count = state.counts[t.id] || 0;
  const srcLine = (t.sources || []).map((id) => { const s = model.sourcesById.get(id); return s ? `[${id}] ${s.name} — cited by ${model.citedBy.get(id)} of 55 guides` : ''; }).join(' · ');
  return `
    <h2>${esc(displayName(t, state))}</h2>
    <p class="official">&ldquo;${esc(displayDesc(t, state))}&rdquo;</p>
    <div class="meta"><span>Grade: ${t.grade} (${t.points} pts)</span><span>Stage ${t.stage}</span><span>Kind: ${t.kind}</span>${t.hidden ? '<span>PSN-hidden</span>' : ''}<span>${(t.sources || []).length} sources</span></div>
    ${t.missable ? `<div class="missbox ${t.missable}"><b>${esc(t.missable.toUpperCase())}:</b> ${esc(t.missableNote)}</div>` : ''}
    ${t.dispute ? `<div class="dispute"><h3>SOURCES DIFFER — BOTH VERSIONS SHOWN</h3>
      <div class="cols">
        <div class="col"><b>Reading A</b><br>${esc(t.dispute.a.text)} ${cites(model, t.dispute.a.cite)}</div>
        <div class="col"><b>Reading B</b><br>${esc(t.dispute.b.text)} ${cites(model, t.dispute.b.cite)}</div>
      </div>
      <p class="call"><b>Our call:</b> ${esc(t.dispute.call)}</p></div>` : ''}
    ${t.target > 1 ? `<div class="counter"><span>YOUR COUNT</span><button type="button" id="cMinus">−</button><b>${count} / ${t.target}</b><button type="button" id="cPlus">+</button><span class="small">${sealed ? '' : esc(t.name)}</span></div>` : ''}
    <h3>In Short</h3><p>${esc(t.inShort)}</p>
    <h3>How to Earn It — in our own words, every step cited</h3>
    <ol class="steps">${t.steps.map((s) => `<li>${esc(s.text)} ${cites(model, s.cite)}</li>`).join('')}</ol>
    <p class="gsrc">Guide sources: ${esc(srcLine)}</p>
    <h3>Your Notes</h3>
    <textarea id="notes" rows="3" placeholder="Your own notes for this trophy…">${esc(state.notes[t.id] || '')}</textarea>`;
}

function wireDetail(root, model, store, rerender, t) {
  const { state } = store;
  const minus = root.querySelector('#cMinus');
  const plus = root.querySelector('#cPlus');
  if (minus) minus.addEventListener('click', () => { state.counts[t.id] = Math.max(0, (state.counts[t.id] || 0) - 1); store.save(); rerender(); });
  if (plus) plus.addEventListener('click', () => { state.counts[t.id] = Math.min(t.target, (state.counts[t.id] || 0) + 1); if (state.counts[t.id] >= t.target) state.earned.add(t.id); store.save(); rerender(); });
  const notes = root.querySelector('#notes');
  if (notes) notes.addEventListener('change', () => { state.notes[t.id] = notes.value; store.save(); });
}
