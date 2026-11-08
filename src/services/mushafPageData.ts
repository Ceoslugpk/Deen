import { MUSHAF_LINES_JSON } from '../data/mushafLines';

/**
 * The lines of the printed Madinah mushaf.
 *
 * Six hundred and four pages, and for each one the lines the King Fahd
 * Glorious Quran Printing Complex set on it — fifteen on all of them except
 * the opening two, which carry eight because their surah headings are
 * decorated rather than set in a line of text. Every line knows the words on
 * it and the verse each word belongs to, which is what lets a page be drawn
 * without any of it being worked out at run time.
 *
 * This is not the same thing as `mushaf-pages.json`. That one answers "which
 * verses are on page 297"; this one answers "which words are on which line of
 * page 297, and where the Complex chose to break them". The first is content,
 * the second is geometry, and only the second can make a page look like a
 * page.
 */

/** A surah heading, set as a band across the page. */
export type MushafHeaderLine = { t: 'h'; x: string };
/** A Basmalah, set on a line of its own. */
export type MushafBasmalaLine = { t: 'b' };
/**
 * A line of text, as the verse runs that make it up in order.
 * Each run is `[verseKey, words]`, so a line can begin in one verse and end
 * in the next — which is exactly what happens at the foot of a printed page.
 */
export type MushafTextLine = { t: 'a'; x: [string, string][] };

export type MushafLine = MushafHeaderLine | MushafBasmalaLine | MushafTextLine;


let table: Record<string, MushafLine[]> | null = null;

/**
 * The table, parsed the first time a page is asked for and held after that.
 *
 * It is a megabyte and a half of JSON, which is not something to turn into an
 * object tree on the way to the home screen. Nothing but the mushaf asks for
 * it, so nothing but the mushaf pays for it, and it pays once.
 */
function lines(): Record<string, MushafLine[]> {
  if (!table) table = JSON.parse(MUSHAF_LINES_JSON) as Record<string, MushafLine[]>;
  return table;
}

/** The lines of one page, in the order they are printed. */
export function mushafPageLines(page: number): MushafLine[] {
  const p = Math.min(604, Math.max(1, Math.round(page) || 1));
  return lines()[String(p)] || [];
}

/** Whether the printed layout is available for a page. */
export function hasMushafLines(page: number): boolean {
  return mushafPageLines(page).length > 0;
}
