// Sources view: every numbered source with its read date and live citation count.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function renderSources(root, model) {
  root.innerHTML = `
  <p class="small">All guides in this app are written in our own words. These are the sources each numbered step cites, read on the date shown. URLs are printed as text so the guide stays fully offline.</p>
  <table class="src">
    <tr><th>#</th><th>Source</th><th>Page</th><th>URL (text)</th><th>Read</th><th>Cited by</th></tr>
    ${model.sources.map((s) => `<tr>
      <td><b>[${s.id}]</b></td><td><b>${esc(s.name)}</b></td><td>${esc(s.title)}</td>
      <td class="url">${esc(s.url)}</td><td>${esc(s.read)}</td>
      <td>${model.citedBy.get(s.id) || 0} of 55 guides</td></tr>`).join('')}
  </table>`;
}
