// Tracker filtering: text search, kind chips and grade filter.
export const CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
  { id: 'misc', label: 'Misc' },
  { id: 'hidden', label: 'PSN-hidden' },
  { id: 'disputed', label: 'Disputed' },
  { id: 'notearned', label: 'Not earned' },
];

export function applyFilters(trophies, state, f) {
  const q = (f.query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (f.grade !== 'all' && t.grade !== f.grade) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    switch (f.chip) {
      case 'all':
        return true;
      case 'story':
        return t.kind === 'story';
      case 'missable':
        return !!t.missable;
      case 'collectible':
        return t.kind === 'collectible';
      case 'activity':
        return t.kind === 'activity';
      case 'misc':
        return t.kind === 'misc' || t.kind === 'completion';
      case 'hidden':
        return t.hidden;
      case 'disputed':
        return !!t.dispute;
      case 'notearned':
        return !state.earned.has(t.id);
      default:
        return true;
    }
  });
}
