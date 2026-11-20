// Progress state: earned flags, per-trophy counters, notes and the spoiler toggle.
// Persisted to localStorage only; Export downloads it as JSON, Import reads it back.
const KEY = 'leonida-legend-v3';

export function createStore() {
  let raw = {};
  try {
    raw = JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    raw = {};
  }
  const state = {
    earned: new Set(raw.earned || []),
    counts: raw.counts || {},
    notes: raw.notes || {},
    spoilers: !!raw.spoilers,
    selected: raw.selected || 28,
  };
  function save() {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        earned: [...state.earned],
        counts: state.counts,
        notes: state.notes,
        spoilers: state.spoilers,
        selected: state.selected,
      }),
    );
  }
  function snapshot() {
    return { earned: [...state.earned], counts: state.counts, notes: state.notes, spoilers: state.spoilers };
  }
  function restore(data) {
    state.earned = new Set(data.earned || []);
    state.counts = data.counts || {};
    state.notes = data.notes || {};
    state.spoilers = !!data.spoilers;
    save();
  }
  function reset() {
    state.earned = new Set();
    state.counts = {};
    state.notes = {};
    save();
  }
  function applyDemo() {
    // Demo mode (?demo=1): a believable mid-run save for screenshots and evaluation.
    const demoEarned = [2, 3, 4, 8, 16, 21, 44, 45, 46, 5, 20, 29, 9, 37];
    state.earned = new Set(demoEarned);
    state.counts = { 28: 6, 15: 87, 31: 34, 35: 41, 42: 19, 32: 12, 48: 133, 52: 62000, 53: 28400 };
    save();
  }
  return { state, save, snapshot, restore, reset, applyDemo };
}
