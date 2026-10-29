/**
 * The division markers printed in a mushaf.
 *
 * A mushaf is not only divided into surahs. It is cut into thirty equal parts
 * so it can be read across a month, and each part is cut again, and again —
 * so that somebody reading a set amount each day can tell from the page
 * alone where a section begins and ends. Those cuts are marked in the text,
 * traditionally in a decorated roundel or a line in the margin.
 *
 * The API tells us, for every verse, which eighth-of-a-juz it falls in
 * (`hizbQuarter`, 1–240). Everything else is arithmetic on that number.
 *
 * The arithmetic, and what each number means:
 *
 *   240 quarters ÷ 4 = 60 hizbs        hizb      = ceil(q / 4)
 *    60 hizbs   ÷ 2 = 30 juzs         juz       = ceil(hizb / 2)
 *
 * So moving into a new value of `hizbQuarter` means crossing one of five
 * boundaries, and which one tells you what to print:
 *
 *   q ≡ 1 (mod 8)  a new juz    — eight quarters to a juz
 *   q ≡ 1 (mod 4)  a new hizb   — four quarters to a hizb
 *   q ≡ 2 (mod 4)  الربع        a quarter of the hizb is behind you
 *   q ≡ 3 (mod 4)  النصف        half the hizb is behind you
 *   q ≡ 0 (mod 4)  ثلاثة أرباع  three quarters of the hizb are behind you
 *
 * Those are the five marks, and they are exhaustive: every change of
 * `hizbQuarter` is exactly one of them.
 */

export type MarkerKind = 'juz' | 'hizb' | 'rub' | 'nisf' | 'thuluth';

export const MARKER_KINDS: MarkerKind[] = ['juz', 'hizb', 'rub', 'nisf', 'thuluth'];

/** Which hizb (1–60) a quarter-of-hizb falls in. */
export const hizbOfQuarter = (q: number) => (q ? Math.ceil(q / 4) : 0);

/** Which juz (1–30) a quarter-of-hizb falls in. */
export const juzOfQuarter = (q: number) => (q ? Math.ceil(hizbOfQuarter(q) / 2) : 0);

export type MarkerLabel = { ar: string; en: string; short: string };

/**
 * The names of the five marks.
 *
 * `thuluth` is given its full printed name, three-quarters, rather than being
 * shortened to "a third": in the Madinah mushaf the mark that appears here is
 * ثلاثة أرباع الحزب, the three-quarter point of the hizb. Calling it a third
 * would be a different division and would put the mark in the wrong place.
 */
export const MARKER_LABELS: Record<MarkerKind, MarkerLabel> = {
  juz: { ar: 'الجزء', en: 'Juz', short: 'J' },
  hizb: { ar: 'الحزب', en: 'Hizb', short: 'H' },
  rub: { ar: 'الربع', en: 'Quarter', short: '¼' },
  nisf: { ar: 'النصف', en: 'Half', short: '½' },
  thuluth: { ar: 'ثلاثة الأرباع', en: 'Three quarters', short: '¾' },
};

/**
 * What each mark means, so the settings screen can explain what it is turning
 * off. Somebody who does not know that a hizb is half a juz has no way of
 * deciding whether they want it marked.
 */
export const MARKER_NOTE: Record<MarkerKind, { en: string; ar: string }> = {
  juz: { en: 'One of thirty equal parts, so the Quran can be read across a month', ar: 'أحد ثلاثين جزءًا متساوية، ليُختم القرآن في شهر' },
  hizb: { en: 'Half a juz — sixty in the whole Quran', ar: 'نصف الجزء — ستون حزبًا في القرآن كله' },
  rub: { en: 'A quarter of the way through the hizb', ar: 'ربع الحزب' },
  nisf: { en: 'Halfway through the hizb', ar: 'نصف الحزب' },
  thuluth: { en: 'Three quarters through the hizb', ar: 'ثلاثة أرباع الحزب' },
};

export type MushafMarker = {
  kind: MarkerKind;
  /** The number of the thing just entered: juz 7, hizb 13, and so on. */
  number: number;
  label: MarkerLabel;
};

/**
 * The mark a verse begins with, or null if it begins none.
 *
 * The previous verse is needed because a mark describes a crossing: you only
 * know a boundary is here by seeing that the verse before it was on the other
 * side. The first verse of a page is compared against nothing, so it is read
 * from its own position instead — otherwise every page would open claiming to
 * be a fresh juz.
 */
export function markerBetween(prev: { juz?: number; hizbQuarter?: number } | null, verse: { juz?: number; hizbQuarter?: number }): MushafMarker | null {
  const q = verse.hizbQuarter;
  if (!q) return null;

  // Opening a page mid-division: show where we are, not that we arrived.
  if (!prev || !prev.hizbQuarter) {
    return null;
  }

  const pq = prev.hizbQuarter;
  if (q === pq) return null;

  const juz = juzOfQuarter(q);
  const hizb = hizbOfQuarter(q);
  const withinHizb = ((q - 1) % 4) + 1;

  if (q % 8 === 1) return { kind: 'juz', number: juz, label: MARKER_LABELS.juz };
  if (withinHizb === 1) return { kind: 'hizb', number: hizb, label: MARKER_LABELS.hizb };
  if (withinHizb === 2) return { kind: 'rub', number: hizb, label: MARKER_LABELS.rub };
  if (withinHizb === 3) return { kind: 'nisf', number: hizb, label: MARKER_LABELS.nisf };
  return { kind: 'thuluth', number: hizb, label: MARKER_LABELS.thuluth };
}

/**
 * A verse split across a page boundary.
 *
 * Pages are cut where the printed line lands, which is not always where a
 * verse ends. When a verse is cut, the reader needs to be told — otherwise the
 * sentence simply stops, and it looks like a mistake rather than a page turn.
 */
export type PageConnection = 'continues' | 'continued';

/**
 * Whether the last verse of a page runs on into the next one.
 *
 * Detected by asking the next page for its first verse: if the next page opens
 * on the same verse key this page ended on, that verse is cut in two.
 */
export function continuationAtEnd(thisPage: { verse_key: string }[], nextPage: { verse_key: string }[]): PageConnection | null {
  if (!thisPage.length || !nextPage.length) return null;
  return thisPage[thisPage.length - 1].verse_key === nextPage[0].verse_key ? 'continues' : null;
}

/**
 * Whether the first verse of a page began on the previous one.
 */
export function continuationAtStart(thisPage: { verse_key: string }[], prevPage: { verse_key: string }[]): PageConnection | null {
  if (!thisPage.length || !prevPage.length) return null;
  return prevPage[prevPage.length - 1].verse_key === thisPage[0].verse_key ? 'continued' : null;
}
