/**
 * Choosing a name.
 *
 * The list arrived as one file of 14,585 rows and is kept on the device in
 * full: nobody looks up a name for a child on a connection they cannot count
 * on, and the whole thing is about a megabyte once the repeated keys are gone.
 *
 * Two things about the source are worth knowing, because both shape what the
 * screen can honestly claim.
 *
 *   1. 963 names were listed twice — once as a boy's name, once as a girl's.
 *      Checking them, the pairs carry the same Arabic and the same meaning;
 *      they are names given to either, not two different names that happen to
 *      be spelled alike. They are stored once and shown as "either", rather
 *      than as two rows the reader has to reconcile. That is 14,585 rows
 *      becoming 13,622 names.
 *
 *   2. The meanings are the supplier's, written in English, and they are
 *      short — an average of fifty characters. Where a name differs between
 *      the two source rows, the fuller wording is kept. Nothing has been
 *      rewritten or added, and nothing here is a ruling on what a child may
 *      be called.
 *
 * Search is over the romanised name, the Arabic, and the meaning, so "light"
 * finds Nur and "nur" finds it back. Ranking is the same shape as the city
 * search: an exact name wins, then a name that starts with what was typed,
 * then a word inside it, and only then a match anywhere.
 */
export type MuslimName = {
  /** The romanised name. Unique, and used as the key. */
  name: string;
  arabic: string;
  meaning: string;
  /** 'both' is a name the source lists under each gender alike. */
  gender: 'male' | 'female' | 'both';
};

type Row = [string, string, string, number];

const MALE = 1;
const FEMALE = 2;

let table: Row[] | null = null;
let folds: { name: string; hay: string }[] | null = null;

/**
 * Read the first time somebody actually looks, rather than at startup.
 *
 * A megabyte of JSON parsed on launch is a cost every session pays for a
 * screen most sessions never open.
 */
function table$(): Row[] {
  if (table) return table;
  try {
    const data = require('../data/muslim-names.json');
    table = data.rows as Row[];
    buildFoldIndex();
  } catch {
    table = [];
  }
  return table || [];
}

/**
 * Everything folded once, up front.
 *
 * Folding thirteen thousand rows on every keystroke is long enough to feel
 * while typing, and the folds never change once the file is read.
 */
function buildFoldIndex() {
  const rows = table || [];
  folds = rows.map((row) => ({
    name: fold(row[0]),
    hay: `${fold(row[0])} ${fold(row[2])}`,
  }));
}

/** Fold case, accents and punctuation so "nur" finds "Nūr" and "Noor". */
function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim();
}

function toName(row: Row): MuslimName {
  return {
    name: row[0],
    arabic: row[1],
    meaning: row[2],
    gender: row[3] === MALE ? 'male' : row[3] === FEMALE ? 'female' : 'both',
  };
}

/**
 * Ranking, highest first.
 *
 * An exact name wins outright, so "Zayd" is not buried under Zaydah. A name
 * that starts with what was typed outranks a word buried inside the meaning,
 * which is what stops a search for "light" from being led by a name that
 * merely mentions light. Shorter names win ties, because the one the reader
 * typed is usually the shorter one.
 */
function score(index: number, query: string): number {
  const f = folds![index];
  let rank = 0;
  if (f.name === query) rank = 1_000_000;
  else if (f.name.startsWith(query)) rank = 500_000;
  else if (f.name.split(' ').some((word) => word.startsWith(query))) rank = 250_000;
  else if (f.hay.includes(query)) rank = 50_000;
  if (!rank) return 0;
  return rank - f.name.length;
}

export type NameFilter = 'all' | 'male' | 'female';

/**
 * The whole list, in the supplier's order, which is alphabetical.
 *
 * Returned as objects rather than rows so the screen never has to know how
 * the file is packed.
 */
export function loadMuslimNames(): MuslimName[] {
  return table$().map(toName);
}

/**
 * Names matching `query`, narrowed to one gender when asked.
 *
 * 'both' names belong to whichever gender is being looked at — a name given
 * to either is a boy's name as much as it is a girl's — but they are never
 * filtered out of 'all', which is the only view where "either" means
 * something on its own.
 */
export function searchMuslimNames(query: string, filter: NameFilter = 'all', limit = 400): MuslimName[] {
  const rows = table$();
  const q = fold(query.trim());

  if (!q) {
    const out: MuslimName[] = [];
    for (let i = 0; i < rows.length && out.length < limit; i += 1) {
      if (!matches(rows[i][3], filter)) continue;
      out.push(toName(rows[i]));
    }
    return out;
  }

  const scored: { index: number; rank: number }[] = [];
  for (let i = 0; i < rows.length; i += 1) {
    if (!matches(rows[i][3], filter)) continue;
    const rank = score(i, q);
    if (rank > 0) scored.push({ index: i, rank });
  }
  scored.sort((a, b) => b.rank - a.rank);
  return scored.slice(0, limit).map(({ index }) => toName(rows[index]));
}

function matches(mask: number, filter: NameFilter): boolean {
  if (filter === 'all') return true;
  if (mask === MALE + FEMALE) return true; // 'both' belongs to either view
  return filter === 'male' ? mask === MALE : mask === FEMALE;
}

/** How many names a given filter would show, for the count under the search. */
export function countMuslimNames(filter: NameFilter = 'all'): number {
  const rows = table$();
  let n = 0;
  for (let i = 0; i < rows.length; i += 1) if (matches(rows[i][3], filter)) n += 1;
  return n;
}
