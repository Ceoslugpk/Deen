/**
 * Quran structural data that does not change.
 *
 * Three things live here, and all three used to be asked of a third-party
 * index on every read:
 *
 *  - the Mushaf page map (which verses sit on which of the 604 pages),
 *  - the script ids, which our own server names differently from the way the
 *    app has always named them,
 *  - the tajweed markup, which our server writes as HTML spans and the app
 *    has always rendered from a shorter bracket form.
 *
 * The page map is bundled rather than fetched. It is 604 records, 32 KB, and
 * it describes a book that was fixed fourteen centuries ago - there is no
 * version of this that needs the network, and asking for it means a page of
 * the Quran cannot be read on a plane. It was fetched once from the old
 * provider and is now ours; the file is the whole of what we ever needed
 * from them for this feature.
 */

import { ISLAMIC_DATA_BASE_URL } from './islamicDataApi';

/* ==================== Mushaf pages ==================== */

type PageRecord = {
  surah: number;
  start: number;
  end: number;
  /** Present when a surah begins part-way down the page. */
  spans: [[number, number], [number, number]] | null;
};

type PageTable = {
  schemaVersion: number;
  source: string;
  pages: Record<string, PageRecord>;
  /** Verses per surah. Carried alongside the pages because a surah that
      finishes part-way down a page leaves no last verse to read back. */
  verseCounts: Record<string, number>;
  ayahCount: number;
  surahCount: number;
  /** Juz 1-30 as runs of [surah, firstVerse, lastVerse]. */
  juz: Record<string, Array<[number, number, number]>>;
  /** Rub 1-240 - the quarter-hizb - in the same shape. */
  rub: Record<string, Array<[number, number, number]>>;
};

const PAGE_TABLE: PageTable = require('../data/mushaf-pages.json');

export const MUSHAF_PAGE_COUNT = 604;

/** One contiguous run of verses, always inside a single surah. */
export type PageSegment = { surah: number; start: number; end: number };

/**
 * The verse runs on one Mushaf page, in reading order.
 *
 * A page usually holds the middle of one surah. Fifty-one of them carry the
 * end of one surah and the start of the next, and a handful span three, so
 * this returns a list rather than a pair - the caller walks the segments.
 */
export function pageSegments(page: number): PageSegment[] {
  const record = PAGE_TABLE.pages[String(page)];
  if (!record) return [];

  if (!record.spans) return [{ surah: record.surah, start: record.start, end: record.end }];

  const [[firstSurah, firstVerse], [lastSurah, lastVerse]] = record.spans;
  return expandSpans(firstSurah, firstVerse, lastSurah, lastVerse);
}

/**
 * Fills in the surahs between the two ends of a spanning page.
 *
 * The table stores only the first and last verse, so the surahs in between
 * are whole ones and their lengths come from the bundled counts.
 */
function expandSpans(
  firstSurah: number,
  firstVerse: number,
  lastSurah: number,
  lastVerse: number,
): PageSegment[] {
  if (firstSurah === lastSurah) {
    return [{ surah: firstSurah, start: firstVerse, end: lastVerse }];
  }
  const counts = PAGE_TABLE.verseCounts;
  const segments: PageSegment[] = [
    { surah: firstSurah, start: firstVerse, end: counts[String(firstSurah)] ?? firstVerse },
  ];
  for (let s = firstSurah + 1; s < lastSurah; s += 1) {
    segments.push({ surah: s, start: 1, end: counts[String(s)] ?? 1 });
  }
  segments.push({ surah: lastSurah, start: 1, end: lastVerse });
  return segments;
}

/** Verses in one surah, from the bundled table. */
export function versesInSurah(surah: number): number {
  return PAGE_TABLE.verseCounts[String(surah)] ?? 0;
}

/* ==================== Where a verse sits ==================== */

/**
 * The same segment lists, keyed for lookup.
 *
 * Juz and rub are stored as runs - "surah 2, verses 1 to 141" - which is how
 * they are published and how a person thinks about them. Reading them the
 * other way round, one verse at a time, needs the runs flattened once; the
 * first lookup builds that index and every later one is a map read.
 */
type Divisions = Record<string, Array<[number, number, number]>>;

function buildIndex(divisions: Divisions): Map<string, number> {
  const index = new Map<string, number>();
  for (const [key, segments] of Object.entries(divisions)) {
    for (const [surah, start, end] of segments) {
      for (let verse = start; verse <= end; verse += 1) {
        index.set(`${surah}:${verse}`, Number(key));
      }
    }
  }
  return index;
}

let juzIndex: Map<string, number> | null = null;
let rubIndex: Map<string, number> | null = null;
let pageIndex: Map<string, number> | null = null;

/** Which of the thirty juz a verse falls in. */
export function juzOfVerse(surah: number, verse: number): number {
  if (!juzIndex) juzIndex = buildIndex(PAGE_TABLE.juz as Divisions);
  return juzIndex.get(`${surah}:${verse}`) ?? 1;
}

/** Which of the 240 rub - the quarter-hizb - a verse falls in. */
export function rubOfVerse(surah: number, verse: number): number {
  if (!rubIndex) rubIndex = buildIndex(PAGE_TABLE.rub as Divisions);
  return rubIndex.get(`${surah}:${verse}`) ?? 1;
}

/**
 * Which of the 604 Mushaf pages a verse falls on.
 *
 * Built from the bundled table rather than fetched: the page map is already
 * on the device, and this is the only question the reader actually asks of
 * it - it wants a number back, not the page's contents.
 */
export function pageOfVerse(surah: number, verse: number): number {
  if (!pageIndex) {
    const index = new Map<string, number>();
    /* Every verse sits on exactly one page - the table is built that way and
       is checked for it - so a verse already written is never written again. */
    for (let page = 1; page <= MUSHAF_PAGE_COUNT; page += 1) {
      for (const segment of pageSegments(page)) {
        for (let v = segment.start; v <= segment.end; v += 1) {
          index.set(`${segment.surah}:${v}`, page);
        }
      }
    }
    pageIndex = index;
  }
  return pageIndex.get(`${surah}:${verse}`) ?? 1;
}

/** The verse's position in the whole book, 1 to 6236. */
export function globalAyahNumber(surah: number, verse: number): number {
  let total = 0;
  for (let s = 1; s < surah; s += 1) total += versesInSurah(s);
  return total + verse;
}

/** All the verse keys one juz covers, in reading order. */
export function juzVerseKeys(juz: number): string[] {
  const keys: string[] = [];
  for (const [surah, start, end] of (PAGE_TABLE.juz as Divisions)[String(juz)] ?? []) {
    for (let verse = start; verse <= end; verse += 1) keys.push(`${surah}:${verse}`);
  }
  return keys;
}

/** All the verse keys one rub covers, in reading order. */
export function rubVerseKeys(rub: number): string[] {
  const keys: string[] = [];
  for (const [surah, start, end] of (PAGE_TABLE.rub as Divisions)[String(rub)] ?? []) {
    for (let verse = start; verse <= end; verse += 1) keys.push(`${surah}:${verse}`);
  }
  return keys;
}

/* ==================== Script editions ==================== */

/**
 * Our server names the Arabic scripts differently from the way the app has
 * always named them, and the app's names are what is stored in everyone's
 * saved preferences. This maps one to the other so no stored choice breaks.
 */
const SCRIPT_TO_WORKER: Record<string, string> = {
  'quran-uthmani': 'uthmani_1',
  'quran-simple': 'imlaei-simple',
  'quran-indopak': 'indopak',
  'quran-tajweed': 'qpc-hafs-tajweed_1',
  /* The Mushaf reading mode is a page layout, not a script; its text is
     Uthmani. It is listed here so the reader never asks for a script our
     server has never heard of. */
  'quran-mushaf': 'uthmani_1',
};

/** True for the scripts that carry tajweed markup needing conversion. */
const TAJWEED_SCRIPTS = new Set(['qpc-hafs-tajweed_1']);

/** Our server's id for one of the app's script names. */
export function scriptEditionId(script?: string): string {
  if (!script) return SCRIPT_TO_WORKER['quran-uthmani'];
  return SCRIPT_TO_WORKER[script] || script;
}

export function isTajweedScript(workerScriptId: string): boolean {
  return TAJWEED_SCRIPTS.has(workerScriptId);
}

/* ==================== Tajweed markup ==================== */

/**
 * Our server writes tajweed as `<rule class=ham_wasl>ٱ</rule>`; the app has
 * always rendered `[h[ٱ]]`, and that shorter form is also what sits in every
 * cached surah on every device. Converting on the way in means the renderer
 * is untouched and nothing already stored goes stale.
 */
const TAJWEED_CLASS_TO_CODE: Record<string, string> = {
  ham_wasl: 'h',
  slnt: 's',
  laam_shamsiyah: 'l',
  madda_normal: 'm',
  madda_permissible: 'p',
  madda_necessary: 'n',
  madda_obligatory_mottasel: 'o',
  madda_obligatory_monfasel: 'o',
  qalaqah: 'q',
  ikhafa_shafawi: 'c',
  ikhafa: 'f',
  idgham_shafawi: 'w',
  iqlab: 'i',
  idgham_ghunnah: 'a',
  idgham_wo_ghunnah: 'u',
  idgham_mutajanisayn: 'u',
  idgham_mutaqaribayn: 'u',
  ghunnah: 'g',
};

const RULE_OPEN = /<rule\s+class=["']?([a-z_]+)["']?\s*>/gi;
const RULE_CLOSE = /<\/rule\s*>/gi;

/** Rewrites the server's spans into the bracket form TajweedText reads. */
export function convertTajweedMarkup(text: string): string {
  if (!text || text.indexOf('<rule') === -1) return text;
  return text
    .replace(RULE_OPEN, (_all, cls: string) => {
      const code = TAJWEED_CLASS_TO_CODE[String(cls).toLowerCase()];
      return code ? `[${code}[` : '';
    })
    .replace(RULE_CLOSE, ']');
}

/* ==================== Global ayah numbering ==================== */

/**
 * Which surah and verse a 1..6236 ayah number falls in.
 *
 * The daily ayah is picked by its position in the whole book, because that
 * spreads the year evenly, which a per-surah choice would not. Working out
 * where a position lands needs only the lengths of the surahs.
 */
export function ayahNumberToKey(ayahNumber: number): { surah: number; verse: number } {
  let remaining = ayahNumber;
  for (let surah = 1; surah <= PAGE_TABLE.surahCount; surah += 1) {
    const length = versesInSurah(surah);
    if (remaining <= length) return { surah, verse: remaining };
    remaining -= length;
  }
  return { surah: PAGE_TABLE.surahCount, verse: versesInSurah(PAGE_TABLE.surahCount) };
}

export const QURAN_AYAH_COUNT = PAGE_TABLE.ayahCount;

/** Where the page table came from, surfaced on the data-sources screen. */
export const MUSHAF_PAGE_SOURCE = `${PAGE_TABLE.source} — bundled with the app`;
export const WORKER_BASE = ISLAMIC_DATA_BASE_URL;
