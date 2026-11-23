/**
 * The root and the lemma of each word of the Quran.
 *
 * A root is the three letters an Arabic word is built from - بِسْمِ comes from
 * س م و - and the lemma is the dictionary form behind a particular word. Both
 * are what a learner reaches for after the meaning: the meaning tells you this
 * word, the root tells you every word built the same way.
 *
 * The data is our own `Quran Morphology` catalogue: 1,642 roots, 4,817 lemmas
 * and a position for 50,298 of the 83,668 words - the rest are particles (فِى,
 * مِن, لَا) and pronouns, which have no root because they are not built from
 * one. Where there is no root the word simply shows none; nothing is invented
 * to fill the gap.
 *
 * Loading
 * -------
 * Shipped, not fetched. The indexes are about 2 MB in total, so they are split:
 * one 213 KB table of roots and lemmas, and 114 small per-surah slices (16 KB
 * on average) pulled in with the same lazy `require` the IndoPak assets use.
 * Opening the reader costs the 213 KB; a surah costs its own slice once.
 *
 * The word keys are the same `surah:ayah:word` this app already uses for the
 * words under the verse, which is why these can be hung on those cells without
 * any matching step.
 */

const SURAH_SLICE_CACHE = new Map<number, SurahMorphology>();

/** `[id, arabic, latin, words, uniqueWords]` */
export type RootRow = [number, string, string, number | null, number | null];
/** `[id, text, textClean]` */
export type LemmaRow = [number, string, string];

type Index = { schemaVersion: number; roots: RootRow[]; lemmas: LemmaRow[] };
type SurahMorphology = { schemaVersion: number; surah: number; wordRoot: Record<string, number>; wordLemma: Record<string, number> };

let index: Index | null = null;

function morphologyIndex(): Index {
  if (!index) {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const raw = require('../data/morphology/roots.json') as Index;
    index = raw;
  }
  return index;
}

/** One surah's word positions. A missing or unreadable slice answers nothing. */
function surahMorphology(surah: number): SurahMorphology | null {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const cached = SURAH_SLICE_CACHE.get(surah);
  if (cached) return cached;
  try {
    const { MORPHOLOGY_SURAH_CHUNKS } = require('./morphologyChunks') as { MORPHOLOGY_SURAH_CHUNKS: Array<() => unknown> };
    const slice = MORPHOLOGY_SURAH_CHUNKS[surah - 1]() as SurahMorphology;
    if (!slice?.wordRoot) return null;
    /* Two surahs is enough for a page or a juz that crosses a boundary, and it
       stops a long read from accumulating all 114 slices. */
    if (SURAH_SLICE_CACHE.size >= 3) {
      const first = SURAH_SLICE_CACHE.keys().next().value;
      if (first !== undefined) SURAH_SLICE_CACHE.delete(first);
    }
    SURAH_SLICE_CACHE.set(surah, slice);
    return slice;
  } catch {
    return null;
  }
}

export type WordMorphology = {
  /** The root letters, spaced for display: `س م و`. */
  root?: string;
  /** The root in Latin letters, as the catalogue carries it: `smw`. */
  rootLatin?: string;
  /** How many words in the whole Quran share this root. */
  rootWords?: number;
  /** The dictionary form of this particular word. */
  lemma?: string;
  lemmaClean?: string;
};

/**
 * The root and lemma for one word, given its `surah:ayah:word` key.
 *
 * Answers an empty object when the word has none - a particle, or a slice that
 * could not be read - so a caller can render nothing rather than a placeholder.
 */
export function wordMorphology(location: string): WordMorphology {
  const [surahText] = String(location || '').split(':');
  const surah = Number(surahText);
  const slice = surahMorphology(surah);
  if (!slice) return {};
  const out: WordMorphology = {};
  const rootId = slice.wordRoot[location];
  if (rootId) {
    const row = morphologyIndex().roots.find((entry) => entry[0] === rootId);
    if (row) {
      /* The catalogue separates root letters with runs of spaces; one space
         between them reads as a root rather than as words. */
      out.root = row[1].trim().split(/\s+/).join(' ');
      out.rootLatin = row[2];
      if (typeof row[3] === 'number') out.rootWords = row[3];
    }
  }
  const lemmaId = slice.wordLemma[location];
  if (lemmaId) {
    const row = morphologyIndex().lemmas.find((entry) => entry[0] === lemmaId);
    if (row) {
      out.lemma = row[1];
      out.lemmaClean = row[2];
    }
  }
  return out;
}

/**
 * Every word of one surah that carries a given root, as locations.
 *
 * This is what a tap on a root opens: the other places the same letters are
 * used. Read from the same slice, so it costs nothing extra once a surah is
 * open - the list covers that surah, which is where a reader is looking.
 */
export function wordsWithRootInSurah(surah: number, rootId: number): string[] {
  const slice = surahMorphology(surah);
  if (!slice) return [];
  return Object.keys(slice.wordRoot).filter((location) => slice.wordRoot[location] === rootId).sort(byPosition);
}

/** The root id for one word, or 0. Exposed so a tap can find its siblings. */
export function rootIdAt(location: string): number {
  const [surahText] = String(location || '').split(':');
  const slice = surahMorphology(Number(surahText));
  return slice?.wordRoot[location] || 0;
}

function byPosition(a: string, b: string): number {
  const [as, aa, aw] = a.split(':').map(Number);
  const [bs, ba, bw] = b.split(':').map(Number);
  return as - bs || aa - ba || aw - bw;
}

/** Exposed for tests: how many roots and lemmas the bundled table carries. */
export function morphologyTotals(): { roots: number; lemmas: number } {
  const table = morphologyIndex();
  return { roots: table.roots.length, lemmas: table.lemmas.length };
}
