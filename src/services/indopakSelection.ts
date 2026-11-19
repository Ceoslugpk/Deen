import { INDOPAK_VIEWBOX, type PlacedIndopakLine } from './indopakMushaf';

export type IndopakRect = { x: number; y: number; width: number; height: number };
export type IndopakSegment = IndopakRect & { verse: string; firstWord: number; lastWord: number; line: number };
export type IndopakSelection = { verse: string; wordId: number };
export const INDOPAK_HOLD_MS = 500;
export const INDOPAK_POPOVER = { width: 154, height: 54, gap: 8, margin: 6 };
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(Math.max(low, high), n));

/** One continuous highlight per ayah fragment on each original source line, including inter-word gaps. */
export function indopakAyahSegments(lines: PlacedIndopakLine[]): IndopakSegment[] {
  return lines.flatMap(line => {
    if (line.source.t !== 'ayah') return [];
    const segments: IndopakSegment[] = [];
    for (const word of line.words) {
      const last = segments[segments.length - 1];
      if (last?.verse === word.key) {
        const right = Math.max(last.x + last.width, word.boxX + word.width + 2);
        last.x = Math.min(last.x, word.boxX - 2); last.width = right - last.x; last.lastWord = word.id;
      } else segments.push({ verse: word.key, firstWord: word.id, lastWord: word.id, line: line.source.n,
        x: word.boxX - 2, y: line.top + 2, width: word.width + 4, height: line.height - 4 });
    }
    return segments;
  });
}

export function indopakWordAnchor(lines: PlacedIndopakLine[], verse: string, wordId?: number) {
  const words = lines.filter(line => line.source.t === 'ayah').flatMap(line => line.words.filter(w => w.key === verse)
    .map(word => ({ wordId: word.id, rect: { x: word.boxX, y: line.top + 2, width: word.width, height: line.height - 4 } })));
  return words.find(w => w.wordId === wordId) || words[0] || null;
}

export function indopakPageOrigin(viewport: { width: number; height: number }, size: { width: number; height: number }) {
  return { x: Math.max(0, (viewport.width - size.width) / 2), y: Math.max(0, (viewport.height - size.height) / 2) };
}

/** All coordinates are physical page coordinates, independent of the interface's RTL/LTR direction. */
export function indopakPopoverLayout(viewport: { width: number; height: number }, size: { width: number; height: number },
  scroll: { x: number; y: number }, segments: IndopakSegment[], selected: IndopakSelection) {
  const P = INDOPAK_POPOVER;
  if (![viewport.width, viewport.height, size.width, size.height].every(n => Number.isFinite(n) && n > 0)
    || ![scroll.x, scroll.y].every(Number.isFinite) || viewport.width < P.width + P.margin * 2 || viewport.height < P.height + P.margin * 2) return null;
  const origin = indopakPageOrigin(viewport, size), sx = size.width / INDOPAK_VIEWBOX.width, sy = size.height / INDOPAK_VIEWBOX.height;
  const visible = segments.filter(s => s.verse === selected.verse).map(s => ({ ...s,
    x: origin.x + s.x * sx - scroll.x, y: origin.y + s.y * sy - scroll.y, width: s.width * sx, height: s.height * sy }))
    .filter(s => s.x < viewport.width && s.x + s.width > 0 && s.y < viewport.height && s.y + s.height > 0);
  const segment = visible.find(s => selected.wordId >= s.firstWord && selected.wordId <= s.lastWord) || visible[0];
  if (!segment) return null;
  const target = { x: Math.max(0, segment.x), y: Math.max(0, segment.y),
    right: Math.min(viewport.width, segment.x + segment.width), bottom: Math.min(viewport.height, segment.y + segment.height) };
  // Prefer the outside of the whole visible ayah, so a two-line selection is not covered by its own menu.
  const ayahTop = Math.max(0, Math.min(...visible.map(s => s.y)));
  const ayahBottom = Math.min(viewport.height, Math.max(...visible.map(s => s.y + s.height)));
  if (ayahTop - P.gap - P.height >= P.margin || ayahBottom + P.gap + P.height <= viewport.height - P.margin) {
    target.y = ayahTop; target.bottom = ayahBottom;
  }
  const centre = (target.x + target.right) / 2;
  const x = clamp(centre - P.width / 2, P.margin, viewport.width - P.width - P.margin);
  const above = target.y - P.gap - P.height;
  const side = above >= P.margin ? 'above' : 'below';
  const y = clamp(side === 'above' ? above : target.bottom + P.gap, P.margin, viewport.height - P.height - P.margin);
  return { x, y, width: P.width, height: P.height, side, arrowX: clamp(centre - x, 14, P.width - 14), target };
}

/** Resume at the exact saved word/line, with space above for its action popover when possible. */
export function indopakRevealOffset(viewport: { width: number; height: number }, size: { width: number; height: number }, rect: IndopakRect) {
  const origin = indopakPageOrigin(viewport, size);
  return { x: clamp(origin.x + (rect.x + rect.width / 2) * size.width / INDOPAK_VIEWBOX.width - viewport.width / 2, 0, size.width - viewport.width),
    y: clamp(origin.y + rect.y * size.height / INDOPAK_VIEWBOX.height - 74, 0, size.height - viewport.height) };
}

/** A hold must remain a stationary single-finger press; rejection is sticky until a fresh press. */
export function indopakStationaryPress(touches: number, dx: number, dy: number): boolean {
  return touches === 1 && Number.isFinite(dx) && Number.isFinite(dy) && Math.hypot(dx, dy) <= 8;
}
