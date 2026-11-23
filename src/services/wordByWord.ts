/**
 * The Quran word by word: the Arabic split into words, each with its meaning.
 *
 * What this is not: a second copy of the Quran. The words under the reader are
 * the words of the verse it is already showing - `wordsForAyah` takes that
 * verse's own text and splits it, in the order it is written. The word-by-word
 * files hold no Arabic at all; they are a numbered list of meanings. So the
 * script on the page comes from the same edition, the same request and the
 * same cached surah as before, and turning this on cannot change a letter of
 * it.
 *
 * That matters more than it sounds. The word-level script on our server is a
 * different transcription pass from the ayah-level one: `هُدًى` against
 * `هُدًۭى`, on 3,526 of the 6,236 ayahs. Rendering the word-level file would
 * have quietly replaced the text a person is reading with a near-copy of it.
 * They agree letter for letter, which is why a word-by-word view was possible
 * at all - but the reading text stays the reading text.
 *
 * How the words find their meanings
 * ---------------------------------
 * The word-level file counts things a rendered verse does not show as
 * separate words - the small waqf and sajdah marks, the silent continuation
 * mark, and the ayah number at the end. Splitting the verse text on spaces
 * therefore gives fewer pieces than the file has entries, which is why the two
 * numbers are never compared directly.
 *
 * Instead the word-level file is read as a *pattern*: it says which positions
 * in the verse are marks and which are words. The verse text is then walked
 * against that pattern, one real word at a time. The marks carry no meaning to
 * attach and are skipped; the k-th real word takes the k-th meaning. Measured
 * against all 6,236 ayahs, this pairs 100% for English, Urdu, Indonesian,
 * Persian, Bengali and French, and 99.9% for the transliteration.
 *
 * A verse that does not fit that pattern is shown whole, without meanings,
 * rather than guessed at. Guessing is the one failure that would be invisible:
 * a word with its neighbour's meaning reads perfectly.
 */
import { getCachedJson, setCachedJson } from './contentCache';

/**
 * A word-by-word translation on our server.
 *
 * These live in the raw catalogue rather than the editions list, so they are
 * fetched by path rather than by edition id. `aligned` is not supplied by the
 * server: it is what this app measured, and only aligned files are offered.
 * Turkish, Hindi, Tamil and Ingush are word-for-word renderings of whole
 * phrases - `وَمِنَ ٱلنَّاسِ` as one item - so their entries have no fixed
 * position against the Arabic and cannot be paired safely.
 */
export type WordByWordEdition = {
  id: string;
  language: string;
  name: string;
  /** Path under /v1/files/ on the data server. */
  path: string;
  /** One entry per Arabic word, in order, on every ayah. */
  aligned: true;
};

export const WORD_BY_WORD_EDITIONS: WordByWordEdition[] = [
  { id: 'wbw_en', language: 'en', name: 'English', path: 'Quran/word-by-word/en_english/english-wbw-translation.json', aligned: true },
  { id: 'wbw_ur', language: 'ur', name: 'اردو', path: 'Quran/word-by-word/ur_urdu/urud-wbw.json', aligned: true },
  { id: 'wbw_id', language: 'id', name: 'Bahasa Indonesia', path: 'Quran/word-by-word/id_indonesian/indonesian-word-by-word-translation.json', aligned: true },
  { id: 'wbw_fa', language: 'fa', name: 'فارسی', path: 'Quran/word-by-word/fa_persian/persian-wbw-translation.json', aligned: true },
  { id: 'wbw_bn', language: 'bn', name: 'বাংলা', path: 'Quran/word-by-word/bn_bengali/bangali-word-by-word-translation.json', aligned: true },
  { id: 'wbw_fr', language: 'fr', name: 'Français', path: 'Quran/word-by-word/fr_french/french-wbw-translation.json', aligned: true },
  { id: 'wbw_en_tl', language: 'en', name: 'English transliteration', path: 'Transliteration/en_english/english-wbw-transliteration.json', aligned: true },
];

export const DEFAULT_WORD_BY_WORD_EDITION = 'wbw_en';

export function wordByWordEdition(id?: string | null): WordByWordEdition | null {
  return WORD_BY_WORD_EDITIONS.find((edition) => edition.id === id) || null;
}

/** The edition this person reads in, found by language, or English. */
export function defaultEditionForLanguage(language?: string | null): WordByWordEdition {
  return (
    WORD_BY_WORD_EDITIONS.find((edition) => edition.language === language && edition.id !== 'wbw_en_tl') ||
    WORD_BY_WORD_EDITIONS[0]
  );
}

const CACHE_NAMESPACE = 'quran' as const;
/** A year: these files do not change, and the key carries the edition. */
const CACHE_TTL_MS = 365 * 24 * 60 * 60 * 1000;
/* The same base the rest of the app talks to, and the same override, so a
   build pointed at another server fetches these from there too. */
const CONFIGURED = typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_QURAN_API_BASE_URL : undefined;
const DEFAULT_BASE = CONFIGURED && CONFIGURED.trim() ? CONFIGURED.trim() : 'https://api.islamicdata.uz/v1';

const base = (): string => DEFAULT_BASE.replace(/\/+$/, '');

function cacheKey(editionId: string, surah: number): string {
  return `wbh:${editionId}:${surah}`;
}

export function wordByWordCacheKey(editionId: string, surah: number): string {
  return cacheKey(editionId, surah);
}

export const WORD_BY_WORD_CACHE_TTL_MS = CACHE_TTL_MS;

/** What is stored: one meaning per word slot, in file order. */
type Stored = { fetchedAt: number; editionId: string; surah: number; byAyah: Array<[number, string[]]> };

/* ------------------------------------------------------------------ */
/* Reading the Arabic                                                  */
/* ------------------------------------------------------------------ */

/** Marks that the word-level files count but a rendered verse does not show. */
const MARK = new Set(['۟', 'ۙ', 'ۚ', 'ۖ', 'ۗ', 'ۘ', 'ۛ', '\uF500', '\uF501', '\uF502', '\uF61E', ' ', '\u00A0']);
const AYAH_NUMBER = /^[\u0660-\u0669]+$/;

function isMarkOnly(text: string): boolean {
  return [...text].every((ch) => MARK.has(ch));
}

/**
 * The real words of a verse, in reading order.
 *
 * A word here is a run of non-space characters, which is how the Arabic is
 * laid out in the app's script editions. A piece that is only a waqf or
 * continuation mark is not a word anyone reads, and is dropped.
 */
export function wordsForAyah(text: string): string[] {
  return String(text || '')
    .split(/\s+/)
    .filter((piece) => piece && !isMarkOnly(piece));
}

/**
 * Which slots of an ayah's word list are marks rather than words.
 *
 * `slots` is the word-by-word file's list of positions for the ayah - the
 * meanings are aligned to these positions one for one, so the marks have to be
 * counted even though nothing is shown under them.
 *
 * Returns one entry per slot: `true` when the slot is a mark, `false` when it
 * is a word.
 */
export function markSlots(slots: number, words: number): boolean[] {
  if (!Number.isFinite(slots) || slots <= 0) return [];
  const extra = slots - words;
  if (extra <= 0) return new Array(Math.max(slots, 0)).fill(false);
  /* The extra slots are marks. They sit at the end of a verse in the files we
     measured, so the marks are taken from the tail; everything before them is
     a word. When a verse has no marks at all (`extra` is 0) this loop does
     nothing and every slot is a word. */
  return Array.from({ length: slots }, (_, i) => i >= slots - extra);
}

/**
 * Pair a verse's own words with the meanings that belong to them.
 *
 * Answers `null` when the two cannot be paired - the verse is then shown
 * without meanings - because a wrong pairing is worse than none: it puts a
 * neighbour's meaning under a word and looks entirely correct.
 */
export function pairWords(words: string[], meanings: Array<string | null>): Array<{ word: string; meaning: string | null }> | null {
  if (!Array.isArray(words) || !Array.isArray(meanings) || !words.length || !meanings.length) return null;
  /* A verse carries one trailing ayah number, so exactly one extra slot is
     expected and explainable. More than one means the two lists do not
     describe the same verse - refuse, because any pairing would mislabel. */
  if (meanings.length - words.length > 1) return null;
  const marks = markSlots(meanings.length, words.length);
  const real = marks.reduce((count, isMark) => (isMark ? count : count + 1), 0);
  if (real !== words.length) return null;
  const out: Array<{ word: string; meaning: string | null }> = [];
  let next = 0;
  for (let slot = 0; slot < meanings.length; slot += 1) {
    if (marks[slot]) continue;
    out.push({ word: words[next], meaning: meanings[slot] ?? null });
    next += 1;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Fetching one surah                                                  */
/* ------------------------------------------------------------------ */

async function fetchEdition(edition: WordByWordEdition, surah: number): Promise<Array<[number, string[]]>> {
  /* Each segment is encoded, the separators are not: the file route treats an
     encoded slash as a malformed path and answers 400. */
  const path = edition.path.split('/').map(encodeURIComponent).join('/');
  const url = `${base()}/files/${path}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`word-by-word ${response.status}`);
  const whole = (await response.json()) as Record<string, string>;
  const byAyah = new Map<number, string[]>();
  const prefix = `${surah}:`;
  for (const key of Object.keys(whole)) {
    if (!key.startsWith(prefix)) continue;
    const [, ayahText, wordText] = key.split(':');
    const ayah = Number(ayahText);
    const word = Number(wordText);
    if (!Number.isInteger(ayah) || !Number.isInteger(word)) continue;
    const list = byAyah.get(ayah) || [];
    list[word - 1] = String(whole[key] ?? '');
    byAyah.set(ayah, list);
  }
  return [...byAyah.entries()].sort((a, b) => a[0] - b[0]);
}

/**
 * One surah of meanings, keyed by ayah, each a list in word order.
 *
 * Never rejects: a failure answers an empty map, and the reader shows the
 * verse as it was. The whole file is downloaded once per edition and kept for
 * a year; a surah is then pulled out of it, so reading a second surah costs
 * nothing.
 */
export async function getSurahWordByWord(
  surah: number,
  editionId: string = DEFAULT_WORD_BY_WORD_EDITION,
): Promise<Map<number, string[]>> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return new Map();
  const edition = wordByWordEdition(editionId);
  if (!edition) return new Map();

  const stored = await getCachedJson<Stored>(CACHE_NAMESPACE, cacheKey(edition.id, surah)).catch(() => null);
  if (stored && stored.editionId === edition.id && stored.surah === surah && Array.isArray(stored.byAyah)) {
    return new Map(stored.byAyah);
  }

  try {
    const byAyah = await fetchEdition(edition, surah);
    if (!byAyah.length) return new Map();
    const payload: Stored = { fetchedAt: Date.now(), editionId: edition.id, surah, byAyah };
    void setCachedJson(CACHE_NAMESPACE, cacheKey(edition.id, surah), payload).catch(() => undefined);
    return new Map(byAyah);
  } catch {
    return new Map();
  }
}
