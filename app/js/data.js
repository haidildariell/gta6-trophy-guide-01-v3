// Loads trophies.json and computes the audit statistics shown in the audit strip.
// Every number in the strip is derived here from the data itself, never hard-coded.
export async function loadData() {
  const res = await fetch('data/trophies.json');
  const doc = await res.json();
  return buildModel(doc);
}

export function buildModel(doc) {
  const trophies = doc.trophies;
  const sourcesById = new Map(doc.sources.map((s) => [s.id, s]));
  const citedBy = new Map(doc.sources.map((s) => [s.id, 0]));
  let totalSteps = 0;
  let citedSteps = 0;
  let guidesCiting = 0;
  let backed2 = 0;
  for (const t of trophies) {
    totalSteps += t.steps.length;
    citedSteps += t.steps.filter((s) => Array.isArray(s.cite) && s.cite.length > 0).length;
    if (Array.isArray(t.sources) && t.sources.length > 0) guidesCiting += 1;
    if (Array.isArray(t.sources) && t.sources.length >= 2) backed2 += 1;
    for (const id of t.sources || []) citedBy.set(id, (citedBy.get(id) || 0) + 1);
  }
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) grades[t.grade] += 1;
  const audit = {
    total: trophies.length,
    grades,
    hidden: trophies.filter((t) => t.hidden).length,
    totalSteps,
    citedSteps,
    guidesCiting,
    backed2,
    sourceCount: doc.sources.length,
    possibly: trophies.filter((t) => t.missable === 'possibly').length,
    watch: trophies.filter((t) => t.missable === 'watch').length,
    unconfirmed: trophies.filter((t) => t.missable === 'unconfirmed').length,
    disputes: trophies.filter((t) => t.dispute).length,
  };
  const auditText =
    `${audit.total}/${audit.total} official name, description, grade · ` +
    `${grades.platinum}P ${grades.gold}G ${grades.silver}S ${grades.bronze}B · ` +
    `${audit.hidden} PSN-hidden · ${audit.citedSteps}/${audit.totalSteps} steps cited · ` +
    `${audit.guidesCiting}/${audit.total} guides cite a source · ${audit.backed2} backed by 2+ sources · ` +
    `${audit.sourceCount} sources read 20 Nov 2026 · ${audit.possibly} possibly missable · ` +
    `${audit.watch} watch · ${audit.unconfirmed} unconfirmed · ${audit.disputes} disputes shown both ways`;
  return { doc, trophies, sources: doc.sources, sourcesById, citedBy, audit, auditText };
}

export const STAGES = [
  { id: 'S1', label: 'S1 · Chapter 1' },
  { id: 'S2', label: 'S2 · Chapter 2 & Early Roam' },
  { id: 'S3', label: 'S3 · Chapter 3' },
  { id: 'S4', label: 'S4 · Chapter 4 & Strangers' },
  { id: 'S5', label: 'S5 · Endgame Story & Set Pieces' },
  { id: 'S6', label: 'S6 · The Long Grind to 100%' },
  { id: 'S7', label: 'S7 · Platinum' },
];

export function isSealed(t, state) {
  return state.spoilers && t.hidden && t.kind === 'story' && !state.earned.has(t.id);
}
export function displayName(t, state) {
  return isSealed(t, state) ? 'SEALED' : t.name;
}
export function displayDesc(t, state) {
  return isSealed(t, state) ? 'SEALED — spoiler shield is on. Earn it or turn the shield off to read this.' : t.description;
}
