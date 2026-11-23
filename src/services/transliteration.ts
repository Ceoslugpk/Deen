/**
 * The Arabic sounded out in Latin letters, under the verse it belongs to.
 *
 * This has been a setting in the app for a while - `showTransliteration` is
 * stored, defaulted, and drawn in the Reading settings preview - but nothing
 * ever put it in the reader: a switch that saved a preference and changed
 * nothing on the page. This is the missing half.
 *
 * Three things decide the shape of it:
 *
 *   - A transliteration is not a translation, and it is not a script. It is a
 *     separate catalogue on our own server ("transliteration"), with its own
 *     ids, of which only three cover the whole book. Asking the translation
 *     route for one 404s, which is the same mistake the tafsir ids made before
 *     the routing work.
 *   - It is joined on position within the surah, because that is the one field
 *     both payloads share: everything here comes from one snapshot and one
 *     chapter, so nothing has to be matched by text.
 *   - It is optional and secondary. A failure to fetch it must leave the
 *     reader exactly as it was - Arabic and meaning, no transliteration, no
 *     error - because a person reading the Quran is not waiting for a reading
 *     aid. Every failure below answers "no transliteration" instead of throwing.
 */
import { getSurah } from './islamicDataApi';
import { getCachedJson, setCachedJson } from './contentCache';
import { versesInSurah } from './quranMeta';

/** The edition shown unless another is chosen. Covers all 6,236 ayahs. */
export const DEFAULT_TRANSLITERATION_EDITION = 'translit_en_english_transliteration';

const CACHE_NAMESPACE = 'quran' as const;
/** A year: a transliteration of the Quran does not change, and the key is
 *  per edition and per surah, so a different edition never collides. */
const CACHE_TTL_MS = 365 * 24 * 60 * 60 * 1000;

type Stored = { fetchedAt: number; editionId: string; surah: number; byNumber: Array<[number, string]> };

function cacheKey(editionId: string, surah: number): string {
  return `transliteration:${editionId}:${surah}`;
}

/** A stored copy, if it is for this edition and reaches the last verse. */
async function stored(editionId: string, surah: number): Promise<Map<number, string> | null> {
  const row = await getCachedJson<Stored>(CACHE_NAMESPACE, cacheKey(editionId, surah)).catch(() => null);
  if (!row || row.editionId !== editionId || row.surah !== surah || !Array.isArray(row.byNumber)) return null;
  const map = new Map(row.byNumber);
  /* Judged against the bundled count, not against its own length: a short
     file must not be remembered as a whole surah. */
  const expected = versesInSurah(surah);
  if (expected && map.size < expected) return null;
  return map;
}

/**
 * One surah of transliteration, keyed by verse number within the surah.
 *
 * Answers an empty map - never a rejection - when the edition is missing, the
 * request fails, or the payload is short. An empty map means "nothing to show
 * under the Arabic", which is exactly what the reader should do about it.
 */
export async function getSurahTransliteration(
  surah: number,
  editionId: string = DEFAULT_TRANSLITERATION_EDITION,
): Promise<Map<number, string>> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return new Map();
  const id = editionId || DEFAULT_TRANSLITERATION_EDITION;

  const cached = await stored(id, surah);
  if (cached) return cached;

  try {
    const response = await getSurah('transliteration', id, surah);
    const byNumber = response.rows.map((row) => [row.numberInSurah, row.text] as [number, string]);
    const map = new Map(byNumber.filter(([, text]) => typeof text === 'string' && text.trim()));
    const expected = versesInSurah(surah);
    /* Short means the read stopped early. Nothing is kept and nothing is
       shown: half a transliteration under a whole surah would silently
       misalign against the verses. */
    if (expected && map.size < expected) return new Map();
    const payload: Stored = { fetchedAt: Date.now(), editionId: id, surah, byNumber: [...map.entries()] };
    void setCachedJson(CACHE_NAMESPACE, cacheKey(id, surah), payload).catch(() => undefined);
    return map;
  } catch {
    /* Offline, or an edition this snapshot does not carry. The reader shows
       the Arabic and the meaning, which is the app working. */
    return new Map();
  }
}

/**
 * Put the transliteration under the verses it belongs to.
 *
 * The one thing that can go wrong here is a verse taking a line from the
 * wrong surah: a page, a juz and a hizb each cross chapter boundaries, so
 * "verse 3" alone is ambiguous. The key carries the surah and the line is
 * matched on position inside it, never on text. A verse with no line is
 * returned untouched rather than given an empty string, so the reader can
 * tell "there is nothing here" from "there is a blank line here".
 *
 * Pure: it is given the maps and decides where each line goes, which is the
 * part worth testing.
 */
export function attachTransliteration<T extends { verse_key: string }>(
  verses: T[],
  surahOf: (verse: T) => number,
  maps: Map<number, Map<number, string>>,
): T[] {
  return verses.map((verse) => {
    const surah = surahOf(verse);
    const number = Number(verse.verse_key.split(':')[1]);
    const line = maps.get(surah)?.get(number);
    return line ? { ...verse, transliteration: line } : verse;
  });
}

/** Drop the in-memory/disk copies for one surah of one edition. */
export function transliterationCacheKey(editionId: string, surah: number): string {
  return cacheKey(editionId, surah);
}

export const TRANSLITERATION_CACHE_TTL_MS = CACHE_TTL_MS;
