/**
 * What a saved Quran payload has to look like to be worth keeping.
 *
 * The reader stores the verses it has finished building, so a surah opens
 * without a request. Everything on the way in used to be checked lightly - a
 * payload with rows was a payload - and that is how a request that failed
 * part-way through, one surah saved with six verses instead of seven, became
 * the answer for the next thirty minutes and for every offline read after it.
 * The cache can only be trusted if what goes into it is checked first.
 *
 * Two properties are needed, and neither depends on the network:
 *
 *   - the verses are the ones the chapter actually has, no more and no fewer,
 *     judged against the bundled table rather than against the payload's own
 *     length, so a short answer cannot certify itself;
 *   - every verse that is there has Arabic. A row without the Arabic is not a
 *     lost translation, it is a hole in the Quran - the one thing the reader
 *     must never draw.
 *
 * A missing *translation* is kept rather than rejected. An offline download
 * made while the Worker could not be reached holds real Arabic and no
 * meanings; throwing it away would cost the reader genuine text they can
 * still read. Only the Arabic is required.
 *
 * Compositions saved before this check existed are judged the same way when
 * they are read, so a device that already holds a short row heals itself on
 * the next open instead of needing anyone to clear storage.
 */
/**
 * Deliberately a leaf module: it imports nothing.
 *
 * It is reached from the preference and storage layer, which is loaded by
 * screens that never touch the network. Pulling the whole API module in here
 * would give those screens a network dependency they did not have - and would
 * make `quranMeta` and `islamicDataApi` import each other. The one number it
 * needs comes from the bundled table, read the same way `quranMeta` reads it.
 */
const PAGE_TABLE: { verseCounts: Record<string, number> } = require('../data/mushaf-pages.json');

/** Verses in one surah, from the bundled table. Zero for an unknown chapter. */
export function verseCountInSurah(surah: number): number {
  return PAGE_TABLE.verseCounts[String(surah)] ?? 0;
}

type VerseLike = { verse_key?: unknown; text_uthmani?: unknown };

/**
 * Why a stored list is not usable, or `null` when it is.
 *
 * `expected` of zero means the chapter is outside the bundled table - there is
 * no count to judge against, and only the per-row check applies.
 */
export function quranPayloadProblem(value: unknown, expected = 0): string | null {
  if (!Array.isArray(value)) return 'it was not a list of verses';
  if (expected > 0 && value.length !== expected) {
    return `it held ${value.length} of ${expected} verses`;
  }
  if (!expected && value.length === 0) return 'it held no verses';
  for (const row of value as VerseLike[]) {
    if (!row || typeof row.verse_key !== 'string') return 'a verse had no reference';
    if (typeof row.text_uthmani !== 'string' || !row.text_uthmani.trim()) {
      return `verse ${row.verse_key} had no Arabic`;
    }
  }
  return null;
}

/** True when a stored list is complete and can be shown as it is. */
export function isCompleteQuranPayload(value: unknown, expected: number): boolean {
  return quranPayloadProblem(value, expected) === null;
}

