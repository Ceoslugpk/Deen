import { INDOPAK_CHUNKS } from './indopakChunks';

/** This edition has its own page namespace; never use the Madani 604-page map. */
export const INDOPAK_EDITION = 'indopak-taj-16' as const;
export const INDOPAK_PAGE_COUNT = 548;
export const INDOPAK_FONT = 'IndopakNastaleeq';
export const INDOPAK_VIEWBOX = { width: 1000, height: 1640 };

/** Source text is verbatim. Metrics are HarfBuzz/font units, not estimated character counts. */
export type IndopakWord = [surah: number, ayah: number, position: number, text: string, advance: number,
  inkLeft: number, inkRight: number, ascent: number, descent: number, shape: number];
export type IndopakLine = { n: number; t: 'ayah' | 'surah_name' | 'basmallah'; c: boolean; f?: number; l?: number; s?: number };
export type IndopakPage = { n: number; firstWord: number; lines: IndopakLine[]; words: IndopakWord[] };
export type IndopakChapter = { id: number; name: string; arabic: string; verses: number; page: number; heading: IndopakWord };
export type IndopakMeta = {
  schemaVersion: number; edition: string; pageCount: number; linesPerPage: number; wordCount: number;
  verseCount: number; chunkSize: number; unitsPerEm: number; spaceAdvance: number;
  renderer: string; storage: string; shapeCount: number; glyphCount: number;
  basmallah: IndopakWord[]; chapters: IndopakChapter[]; juz: Array<{ id: number; verse: string; page: number }>;
  shortPages: Record<string, number>; source: Record<string, string>;
};
export function indopakMeta(): IndopakMeta {
  return require('../data/indopak16/meta.json');
}

export function validIndopakPage(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= INDOPAK_PAGE_COUNT;
}

/** Arabic and Persian digits are accepted in page entry, without accepting partial numbers. */
export function parseIndopakPage(value: string): number | null {
  const normalized = value.trim().replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 0x6f0));
  if (!/^\d{1,3}$/.test(normalized)) return null;
  const page = Number(normalized);
  return validIndopakPage(page) ? page : null;
}

const pageChunks = new Map<number, IndopakPage[]>();
function unpackIndopak<T>(asset: unknown): T {
  const packed = asset as { encoding?: string; json?: string } | null;
  if (packed?.encoding !== 'utf8-json-v1' || typeof packed.json !== 'string') throw new Error('Invalid IndoPak asset');
  return JSON.parse(packed.json) as T;
}

export function indopakPage(pageNumber: number): IndopakPage {
  if (!validIndopakPage(pageNumber)) throw new Error('Invalid IndoPak page');
  const size = indopakMeta().chunkSize, index = Math.floor((pageNumber - 1) / size);
  let chunk = pageChunks.get(index);
  if (!chunk) {
    chunk = unpackIndopak<IndopakPage[]>(INDOPAK_CHUNKS[index]());
    // Bound expanded records on small devices. Original bundled strings remain
    // available offline; visiting distant pages never accumulates all 548 pages.
    if (pageChunks.size >= 6) pageChunks.delete(pageChunks.keys().next().value!);
    pageChunks.set(index, chunk);
  }
  const page = chunk[(pageNumber - 1) % size];
  if (!page || page.n !== pageNumber || !page.lines.length || !page.words.length) throw new Error('Incomplete IndoPak page asset');
  return page;
}

export function indopakVerseKey(word: IndopakWord): string { return `${word[0]}:${word[1]}`; }
const verseNumber = (word: IndopakWord) => word[0] * 1000 + word[1];

/** First page containing a verse, including verses split across a page turn. */
export function indopakPageForVerse(key: string): number | null {
  const match = /^(\d{1,3}):(\d{1,3})$/.exec(key);
  if (!match) return null;
  const surah = Number(match[1]), ayah = Number(match[2]);
  const chapter = indopakMeta().chapters.find(c => c.id === surah);
  if (!chapter || ayah < 1 || ayah > chapter.verses) return null;
  const target = surah * 1000 + ayah;
  let first = 1, last = INDOPAK_PAGE_COUNT;
  while (first < last) {
    const mid = Math.floor((first + last) / 2), words = indopakPage(mid).words;
    if (verseNumber(words[words.length - 1]) >= target) last = mid;
    else first = mid + 1;
  }
  return indopakPage(first).words.some(w => verseNumber(w) === target) ? first : null;
}

export function indopakVerseWords(key: string): IndopakWord[] {
  const first = indopakPageForVerse(key);
  if (!first) return [];
  const words: IndopakWord[] = [];
  for (let page = first; page <= INDOPAK_PAGE_COUNT; page++) {
    const source = indopakPage(page).words;
    words.push(...source.filter(w => indopakVerseKey(w) === key));
    if (indopakVerseKey(source[source.length - 1]) !== key) break;
  }
  return words;
}

export type PlacedIndopakWord = { id: number; key: string; text: string; shape: number; x: number; boxX: number; width: number };
export type PlacedIndopakLine = { source: IndopakLine; top: number; height: number; baseline: number; fontSize: number; words: PlacedIndopakWord[] };

const wordWidth = (w: IndopakWord) => Math.max(w[4], w[6]) - Math.min(0, w[5]);

/**
 * One fixed source line per row. Words keep their source order and their full
 * glyph bearings; justification adds space BETWEEN words, never edits letters,
 * inserts tatweel, wraps a line, or guesses a size from the character count.
 * SVG uses an explicit LTR coordinate system and original, RTL-shaped outlines.
 * This avoids platform-specific SVG text bidi/combining-mark implementations.
 */
export function placeIndopakPage(page: IndopakPage): PlacedIndopakLine[] {
  const meta = indopakMeta(), upm = meta.unitsPerEm;
  const left = 48, innerWidth = 904, top = 92, bodyHeight = 1452;
  const opening = page.n <= 2;
  const slots = opening ? 8 : 16;
  const rowHeight = bodyHeight / slots;
  const offset = opening ? (slots - page.lines.length) * rowHeight / 2 : 0;
  const lineWords = page.lines.map(line => line.t === 'ayah'
    ? page.words.slice(line.f! - page.firstWord, line.l! - page.firstWord + 1)
    : line.t === 'basmallah' ? meta.basmallah : []);
  let fontSize = opening ? 60 : 48;
  for (const words of lineWords) {
    if (!words.length) continue;
    const naturalWidth = words.reduce((n, w) => n + wordWidth(w), 0) + (words.length - 1) * meta.spaceAdvance;
    const inkHeight = Math.max(...words.map(w => w[7])) - Math.min(...words.map(w => w[8]));
    fontSize = Math.min(fontSize, (innerWidth - 12) * upm / Math.max(1, naturalWidth), (rowHeight - 12) * upm / Math.max(1, inkHeight));
  }
  const scale = fontSize / upm;
  return page.lines.map((source, index) => {
    const words = lineWords[index], y = top + offset + (source.n - 1) * rowHeight;
    const topInk = words.length ? Math.max(...words.map(w => w[7])) : 0;
    const bottomInk = words.length ? Math.min(...words.map(w => w[8])) : 0;
    const width = words.reduce((n, w) => n + wordWidth(w) * scale, 0);
    const naturalGap = meta.spaceAdvance * scale;
    const gap = source.c || words.length < 2 ? naturalGap : (innerWidth - width) / (words.length - 1);
    const used = width + Math.max(0, words.length - 1) * gap;
    let cursor = left + innerWidth - (source.c ? (innerWidth - used) / 2 : 0);
    const placed = words.map((word, offset) => {
      const width = wordWidth(word) * scale;
      const boxX = cursor - width;
      cursor = boxX - gap;
      return { id: source.t === 'ayah' ? source.f! + offset : -offset - 1,
        key: indopakVerseKey(word), text: word[3], shape: word[9], boxX, width,
        x: boxX - Math.min(0, word[5]) * scale };
    });
    return { source, top: y, height: rowHeight, baseline: y + rowHeight / 2 + (topInk + bottomInk) * scale / 2,
      fontSize, words: placed };
  });
}

const pathCache = new Map<number, string>();
let shapedWords: number[][] | null = null;
/** Original glyph contours, composed at their HarfBuzz positions, not browser/OS SVG text shaping. */
export function indopakShapePath(shapeId: number): string {
  const cached = pathCache.get(shapeId);
  if (cached !== undefined) return cached;
  const shapes = shapedWords ?? (shapedWords = unpackIndopak<number[][]>(require('../data/indopak16/shapes.json')));
  const glyphs: Record<string, string> = require('../data/indopak16/glyphs.json');
  const shape = shapes[shapeId];
  if (!shape || shape.length % 3) throw new Error('Invalid IndoPak shape');
  const parts: string[] = [];
  for (let i = 0; i < shape.length; i += 3) {
    const outline = glyphs[shape[i]];
    if (outline === undefined) throw new Error('Missing IndoPak glyph outline');
    if (outline) parts.push(`M${shape[i + 1]} ${shape[i + 2]}${outline}`);
  }
  const path = parts.join('');
  // Bound the derived strings; scrolling through the Quran must not accumulate
  // every expanded word outline in memory. Original source assets remain lazy.
  if (pathCache.size >= 512) pathCache.delete(pathCache.keys().next().value!);
  pathCache.set(shapeId, path);
  return path;
}

/** Center an Arabic heading by its ink bounds rather than an OS-dependent text anchor. */
export function centeredIndopakWord(word: IndopakWord, cx: number, cy: number, fontSize: number) {
  const scale = fontSize / indopakMeta().unitsPerEm;
  return { x: cx - (Math.max(word[4], word[6]) + Math.min(0, word[5])) * scale / 2,
    baseline: cy + (word[7] + word[8]) * scale / 2, scale };
}

/** A very short pane uses width-fit plus vertical scrolling, not an unreadable postage-stamp page. */
export function fitIndopakPage(width: number, height: number, zoom = 1, scrollShortPane = false): { width: number; height: number } {
  const w = Number.isFinite(width) ? Math.max(0, width - 12) : 0;
  const h = Number.isFinite(height) ? Math.max(0, height - 12) : 0;
  const scale = scrollShortPane && h > 0 && h < 260 ? w / INDOPAK_VIEWBOX.width
    : Math.min(w / INDOPAK_VIEWBOX.width, h / INDOPAK_VIEWBOX.height);
  const magnification = [1, 1.5, 2].includes(zoom) ? zoom : 1;
  return { width: scale * INDOPAK_VIEWBOX.width * magnification, height: scale * INDOPAK_VIEWBOX.height * magnification };
}
