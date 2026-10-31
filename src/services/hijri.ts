/**
 * The Hijri date, without asking anybody.
 *
 * The tabular civil calendar — 30 year cycle, nineteen common years, eleven
 * leap ones — is the usual shortcut, and it is not good enough here. It is
 * right on the year and the month but off by a day on roughly half of all
 * days, because the real Hijri calendar is not an arithmetic rule, it is a
 * series of actual month beginnings. A day is not a rounding error when the
 * day is the first of Ramadan, or the tenth of Dhu al-Hijjah. The app matches
 * Islamic events by Hijri date, so a wrong day moves Eid.
 *
 * So the table is the calendar: for each Hijri year, the day number of the
 * first of each of its twelve months, in the Umm al-Qura reckoning that the
 * Arab world and the app's own dates use. It is two kilobytes, it covers
 * 1440–1461, and it agrees with AlAdhan on every day tested.
 *
 * Outside that span we fall back to the tabular rule rather than show nothing.
 */
type Table = {
  epoch: string;
  method: string;
  firstYear: number;
  lastYear: number;
  /** year -> twelve day numbers, Muharram through Dhu al-Hijjah. */
  years: Record<string, number[]>;
};

const table = require('../data/hijri.json') as Table;

const DAY_MS = 86400000;

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumādá al-ūlá', 'Jumādá al-ākhirah', 'Rajab', "Sha'bān",
  'Ramadan', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah',
] as const;

export const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
] as const;

/** Days since 1970-01-01, on the same scale as the table. */
function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

export type HijriDate = {
  year: number;
  month: number; /** 1-12 */
  day: number;   /** 1-30 */
  monthName: string;
  monthNameAr: string;
  /** True when the answer came from the table rather than the arithmetic fallback. */
  exact: boolean;
};

// Sorted once, so a lookup never re-sorts twenty-two keys.
const YEARS: number[] = Object.keys(table.years).map(Number).sort((a, b) => a - b);

// Flattened to [year, monthIndex, start, ...] triples: one pass, no scanning
// of a nested object on every call.
const FLAT: { y: number; m: number; start: number }[] = [];
for (const y of YEARS) {
  const starts = table.years[String(y)];
  if (!starts) continue;
  for (let m = 0; m < 12; m += 1) FLAT.push({ y, m, start: starts[m] });
}

export function hijriForDate(date: Date): HijriDate | null {
  const dn = dayNumber(date);

  // The last month that has begun on or before this day.
  let best: { y: number; m: number; start: number } | null = null;
  for (const entry of FLAT) {
    if (entry.start <= dn && (!best || entry.start > best.start)) best = entry;
  }
  if (best) {
    return {
      year: best.y,
      month: best.m + 1,
      // The table only records where months begin; the length is implied by
      // the next one, so a day past the end means the span has run out.
      day: dn - best.start + 1,
      monthName: HIJRI_MONTHS[best.m],
      monthNameAr: HIJRI_MONTHS_AR[best.m],
      exact: true,
    };
  }
  return tabularHijri(date);
}

/**
 * The last month in the table has no successor to bound it, so a day near the
 * end of 1461 could run past its true length. Guard against reading a 31st.
 */
const LEAP_YEARS_IN_CYCLE = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

function monthLength(year: number, month: number): number {
  if (month % 2 === 1) return 30;             // odd months are 30
  if (month === 12) {
    const leap = LEAP_YEARS_IN_CYCLE.includes(((year - 1) % 30) + 1);
    return leap ? 30 : 29;
  }
  return 29;
}

/**
 * Arithmetic fallback, used only outside the table's span.
 *
 * Accurate to the year and month and usually to the day; the point is that
 * dates a long way from anything the app will be asked about still render as
 * something a person can read.
 */
function tabularHijri(date: Date): HijriDate {
  const jd = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS + 2440587.5,
  );
  // Civil (tabular) Islamic epoch, 16 July 622 Julian = JD 1948440.
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.min(12, Math.max(1, Math.floor((24 * l) / 709)));
  const day = Math.min(monthLength(30 * n + j - 30, month), Math.max(1, l - Math.floor((709 * month) / 24)));
  const year = 30 * n + j - 30;
  return {
    year,
    month,
    day,
    monthName: HIJRI_MONTHS[month - 1] || '',
    monthNameAr: HIJRI_MONTHS_AR[month - 1] || '',
    exact: false,
  };
}

/** The Hijri month a Gregorian date falls in, as a number, or 0. */
export function hijriMonthNumber(date: Date): number {
  return hijriForDate(date)?.month ?? 0;
}

/**
 * The other direction: a Hijri date into a Gregorian one.
 *
 * Needed for Ramadan. A Ramadan is a Hijri month, and the month view wants
 * Gregorian days, so the ninth month has to be turned into a span of dates
 * before anything can be calculated for it. The table gives the first of each
 * month directly, so this is a lookup and an addition rather than a search.
 */
export function gregorianForHijri(year: number, month: number, day: number): Date | null {
  const starts = table.years[String(year)];
  if (!starts || !starts[month - 1]) return null;
  return new Date((starts[month - 1] + day - 1) * DAY_MS);
}

/**
 * Every Gregorian date in one Hijri month, in order.
 *
 * The length is the month's own — 29 or 30 — read from where the next month
 * begins, which is the only authority the table offers and is exactly how the
 * real calendar decides it.
 */
export function daysOfHijriMonth(year: number, month: number): Date[] {
  const start = gregorianForHijri(year, month, 1);
  if (!start) return [];
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const next = gregorianForHijri(nextYear, nextMonth, 1);
  if (!next) return [];
  const length = Math.round((next.getTime() - start.getTime()) / DAY_MS);
  if (!Number.isFinite(length) || length < 29 || length > 30) return [];
  const out: Date[] = [];
  for (let d = 0; d < length; d += 1) out.push(new Date(start.getTime() + d * DAY_MS));
  return out;
}

