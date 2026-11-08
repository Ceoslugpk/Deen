/* Read on demand, not at import.

   The table is well over a megabyte and the printed layout is withdrawn until
   it works everywhere, so on a phone that has never opened it this must not
   cost anything at all — not even the work of building the object. `require`
   is what buys that: the module is only evaluated the first time a page is
   actually asked for. */
let table: Record<number, string> | null = null;
function pageJson(): Record<number, string> {
  if (!table) table = require('../data/mushafLines').MUSHAF_PAGE_JSON as Record<number, string>;
  return table;
}

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

/**
 * The pages already turned into objects, most recently read last.
 *
 * Small on purpose. A page is about three kilobytes of objects, so even a
 * dozen of them is nothing; but the whole book at once is tens of megabytes,
 * which is how an app comes to be killed on a phone that has done nothing
 * wrong. Turning a page is cheap and reading one back is cheaper, so there is
 * no reason to hold more than the reader can see.
 */
const OPEN = 8;
const open: number[] = [];
const parsed = new Map<number, MushafLine[]>();

function read(page: number): MushafLine[] {
  const held = parsed.get(page);
  if (held) return held;

  const raw = pageJson()[page];
  if (!raw) return [];

  const lines = JSON.parse(raw) as MushafLine[];
  parsed.set(page, lines);
  open.push(page);
  if (open.length > OPEN) parsed.delete(open.shift() as number);
  return lines;
}

/** The lines of one page, in the order they are printed. */
export function mushafPageLines(page: number): MushafLine[] {
  const p = Math.min(604, Math.max(1, Math.round(page) || 1));
  try {
    return read(p);
  } catch {
    /* A page that will not parse is a page we cannot show, and the answer is
       to show nothing rather than to take the reader's app down with it. */
    return [];
  }
}

/** Whether the printed layout is available for a page. */
export function hasMushafLines(page: number): boolean {
  return mushafPageLines(page).length > 0;
}
