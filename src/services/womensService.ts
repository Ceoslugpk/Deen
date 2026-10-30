import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 4 — the women's area: cycle, purity, post-natal bleeding and the
 * make-up fasts that follow from them.
 *
 * Every record here stays on the device. Nothing is uploaded, nothing is
 * shared, and no account is involved. The app records what a woman tells it
 * and works out the arithmetic — averages, predictions and what is still owed.
 * It does not give rulings: the fiqh of hayd, nifas and istihadha turns on
 * details only she and a scholar she trusts can weigh, so the guidance screens
 * describe the well-known positions and then say so.
 */

export type FlowLevel = 'light' | 'medium' | 'heavy';
export type PurityStatus = 'flow' | 'spotting' | 'pure';
export type QadaReason = 'menstruation' | 'nifas' | 'travel' | 'illness' | 'other';

export type CycleEntry = {
  id: string;
  start: string;
  end: string | null;
  flow: FlowLevel;
  note?: string;
};

export type NifasEntry = {
  id: string;
  start: string;
  end: string | null;
  note?: string;
};

export type QadaEntry = {
  id: string;
  date: string;
  reason: QadaReason;
  done: boolean;
  doneOn?: string;
  loggedAt: number;
};

export type WomensState = {
  optedIn: boolean;
  cycles: CycleEntry[];
  nifas: NifasEntry[];
  purity: Record<string, PurityStatus>;
  qada: QadaEntry[];
};

/** The commonly cited outer limits, shown as guidance rather than rulings. */
export const LIMITS = {
  haydMinDays: 3,
  haydMaxDays: 15,
  nifasMaxDays: 40,
  purityBetweenCycles: 15,
};

export const FLOW_LEVELS: { id: FlowLevel; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy', label: 'Heavy' },
];

export const QADA_REASONS: { id: QadaReason; label: string }[] = [
  { id: 'menstruation', label: 'Menstruation' },
  { id: 'nifas', label: 'Post-natal' },
  { id: 'travel', label: 'Travelling' },
  { id: 'illness', label: 'Illness' },
  { id: 'other', label: 'Other' },
];

const KEY = 'deen-womens-v1';
const EMPTY: WomensState = { optedIn: false, cycles: [], nifas: [], purity: {}, qada: [] };

let state: WomensState = { ...EMPTY };
const listeners = new Set<(next: WomensState) => void>();

function emit(next: WomensState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: WomensState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function getWomensState() {
  return state;
}

export function subscribeWomens(listener: (next: WomensState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useWomens(): WomensState {
  const [value, setValue] = useState<WomensState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeWomens(setValue);
  }, []);
  return value;
}

export async function loadWomensState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<WomensState>) : {};
    state = {
      optedIn: Boolean(saved.optedIn),
      cycles: Array.isArray(saved.cycles) ? saved.cycles : [],
      nifas: Array.isArray(saved.nifas) ? saved.nifas : [],
      purity: saved.purity && typeof saved.purity === 'object' ? saved.purity : {},
      qada: Array.isArray(saved.qada) ? saved.qada : [],
    };
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

/* --------------------------------------------------------------- dates --- */

export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** Parsed at noon local time so day arithmetic never crosses a timezone edge. */
function parseDay(key: string) {
  return new Date(`${key}T12:00:00`);
}

export function addDays(key: string, days: number) {
  const date = parseDay(key);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

export function daysBetween(from: string, to: string) {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86_400_000);
}

// Arabic months and weekdays, but the digits stay as they are everywhere else
// in the app — switching numbering systems halfway down a screen reads as a
// mistake rather than as a translation.
function dateLocale(locale: string) {
  return locale === 'ar' ? 'ar-u-nu-latn' : locale;
}

export function formatDay(key: string, locale = 'en') {
  try {
    return parseDay(key).toLocaleDateString(dateLocale(locale), { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return key;
  }
}

export function formatLongDay(key: string, locale = 'en') {
  try {
    return parseDay(key).toLocaleDateString(dateLocale(locale), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return key;
  }
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/* -------------------------------------------------------------- actions --- */

export async function setOptedIn(optedIn: boolean) {
  await persist({ ...state, optedIn });
}

export async function startCycle(start = dayKey(), flow: FlowLevel = 'medium') {
  const open = state.cycles.find((entry) => entry.end === null);
  if (open) return open;
  const entry: CycleEntry = { id: id('cycle'), start, end: null, flow };
  await persist({ ...state, cycles: [entry, ...state.cycles].slice(0, 60) });
  return entry;
}

export async function endCycle(end = dayKey()) {
  const open = state.cycles.find((entry) => entry.end === null);
  if (!open) return;
  const cycles = state.cycles.map((entry) => (entry.id === open.id ? { ...entry, end } : entry));
  await persist({ ...state, cycles, purity: { ...state.purity, [end]: 'pure' } });
}

export async function setFlow(flow: FlowLevel) {
  const open = state.cycles.find((entry) => entry.end === null);
  if (!open) return;
  const cycles = state.cycles.map((entry) => (entry.id === open.id ? { ...entry, flow } : entry));
  await persist({ ...state, cycles });
}

export async function logPurity(date: string, status: PurityStatus) {
  await persist({ ...state, purity: { ...state.purity, [date]: status } });
}

export async function deleteCycle(entryId: string) {
  await persist({ ...state, cycles: state.cycles.filter((entry) => entry.id !== entryId) });
}

export async function startNifas(start = dayKey()) {
  const open = state.nifas.find((entry) => entry.end === null);
  if (open) return open;
  const entry: NifasEntry = { id: id('nifas'), start, end: null };
  await persist({ ...state, nifas: [entry, ...state.nifas].slice(0, 30) });
  return entry;
}

export async function endNifas(end = dayKey()) {
  const open = state.nifas.find((entry) => entry.end === null);
  if (!open) return;
  const nifas = state.nifas.map((entry) => (entry.id === open.id ? { ...entry, end } : entry));
  await persist({ ...state, nifas });
}

export async function deleteNifas(entryId: string) {
  await persist({ ...state, nifas: state.nifas.filter((entry) => entry.id !== entryId) });
}

export async function addQada(date: string, reason: QadaReason) {
  if (state.qada.some((entry) => entry.date === date)) return;
  const entry: QadaEntry = { id: id('qada'), date, reason, done: false, loggedAt: Date.now() };
  await persist({ ...state, qada: [...state.qada, entry].sort((a, b) => (a.date < b.date ? -1 : 1)) });
}

export async function toggleQada(entryId: string) {
  const qada = state.qada.map((entry) =>
    entry.id === entryId ? { ...entry, done: !entry.done, doneOn: entry.done ? undefined : dayKey() } : entry
  );
  await persist({ ...state, qada });
}

export async function deleteQada(entryId: string) {
  await persist({ ...state, qada: state.qada.filter((entry) => entry.id !== entryId) });
}

/* ------------------------------------------------------------ summaries --- */

export type CycleStats = {
  /** Cycle that is open right now, if any. */
  active: CycleEntry | null;
  /** 1-based day of the active cycle. */
  dayOfCycle: number;
  status: PurityStatus | 'nifas' | 'none';
  averageCycle: number | null;
  averagePeriod: number | null;
  cycleCount: number;
  nextStart: string | null;
  daysToNext: number | null;
  fertileStart: string | null;
  fertileEnd: string | null;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function cycleStats(current = state, today = dayKey()): CycleStats {
  const sorted = [...current.cycles].sort((a, b) => (a.start < b.start ? 1 : -1));
  const active = sorted.find((entry) => entry.end === null) || null;
  const completed = sorted.filter((entry) => entry.end !== null);

  const lengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const gap = daysBetween(sorted[i + 1].start, sorted[i].start);
    if (gap > 0 && gap < 90) lengths.push(gap);
  }
  const periods = completed
    .map((entry) => daysBetween(entry.start, entry.end as string) + 1)
    .filter((value) => value > 0 && value <= LIMITS.haydMaxDays + 5);

  // Only ever measured from her own history. With nothing to measure there is no
  // average to show and nothing to predict from — a guess presented as her pattern
  // would be worse than a blank.
  const averageCycle = average(lengths.slice(0, 6));
  const averagePeriod = average(periods.slice(0, 6));
  const lastStart = sorted[0]?.start || null;
  const nextStart = lastStart && averageCycle ? addDays(lastStart, averageCycle) : null;
  const daysToNext = nextStart ? daysBetween(today, nextStart) : null;

  const openNifas = current.nifas.find((entry) => entry.end === null) || null;
  const todayStatus = current.purity[today];
  let status: CycleStats['status'] = 'none';
  if (openNifas) status = 'nifas';
  else if (todayStatus) status = todayStatus;
  else if (active) status = 'flow';

  return {
    active,
    dayOfCycle: active ? Math.max(1, daysBetween(active.start, today) + 1) : 0,
    status,
    averageCycle,
    averagePeriod,
    cycleCount: sorted.length,
    nextStart,
    daysToNext,
    fertileStart: nextStart ? addDays(nextStart, -19) : null,
    fertileEnd: nextStart ? addDays(nextStart, -11) : null,
  };
}

export type NifasStats = {
  active: NifasEntry | null;
  day: number;
  remaining: number;
  pastLimit: boolean;
};

export function nifasStats(current = state, today = dayKey()): NifasStats {
  const active = current.nifas.find((entry) => entry.end === null) || null;
  if (!active) return { active: null, day: 0, remaining: 0, pastLimit: false };
  const day = Math.max(1, daysBetween(active.start, today) + 1);
  return {
    active,
    day,
    remaining: Math.max(0, LIMITS.nifasMaxDays - day),
    pastLimit: day > LIMITS.nifasMaxDays,
  };
}

export type QadaStats = {
  total: number;
  done: number;
  remaining: number;
  percent: number;
  byReason: Record<QadaReason, number>;
};

export function qadaStats(current = state): QadaStats {
  const total = current.qada.length;
  const done = current.qada.filter((entry) => entry.done).length;
  const byReason = current.qada.reduce(
    (acc, entry) => {
      acc[entry.reason] = (acc[entry.reason] || 0) + 1;
      return acc;
    },
    {} as Record<QadaReason, number>
  );
  return {
    total,
    done,
    remaining: total - done,
    percent: total ? Math.round((done / total) * 100) : 0,
    byReason,
  };
}

/** The last fortnight of purity chips, newest first. */
export function recentPurity(current = state, today = dayKey(), days = 14) {
  const out: { date: string; status: PurityStatus | null }[] = [];
  for (let i = 0; i < days; i += 1) {
    const key = addDays(today, -i);
    out.push({ date: key, status: current.purity[key] || null });
  }
  return out.reverse();
}

/* ------------------------------------------------------------- guidance --- */

export type GuidanceBlock = { title: string; body: string };

export const WORSHIP_GUIDANCE: GuidanceBlock[] = [
  {
    title: 'Prayer during the monthly cycle',
    body:
      'The prayers that fall during hayd or nifas are not prayed and are not made up afterwards. The Prophet ﷺ described the shortcoming of a woman’s practice in these days as leaving the prayer and the fast, and the make-up that was commanded covered the fast only. Aisha reported: “We were commanded to make up the fasts, but we were not commanded to make up the prayers.” Many women keep the times in mind anyway — sitting in dhikr at Fajr and Maghrib, or making the dua of that hour — so the rhythm of the day is not lost.',
  },
  {
    title: 'Fasting, and the days owed',
    body:
      'Days of Ramadan missed through menstruation or post-natal bleeding are made up before the next Ramadan, one day for each day. They do not need to be consecutive, and they may be spread through the year — but they are a debt, so most women keep a running count. This area records those days for you and keeps the scorecard honest as you settle them.',
  },
  {
    title: 'Tawaf and the Haram',
    body:
      'Tawaf is not performed while bleeding. When Aisha began her menses during the Farewell Pilgrimage, the Prophet ﷺ told her: “Do what the pilgrim does, except do not circumambulate the House until you are pure.” Everything else in the rites stands — the standing at Arafah, the nights at Mina, the stoning, the Sa‘i between Safa and Marwah. Only the Tawaf waits, and it is performed once purity begins and ghusl has been made.',
  },
  {
    title: 'What continues in these days',
    body:
      'Dhikr, dua, charity, kindness to family, listening to the Quran, and seeking knowledge all continue. Nothing about these days closes the door to a person’s relationship with Allah — they are part of the worship of a woman’s life, not a suspension of it. Many find the regular adhkar of morning and evening especially valuable here, since the habit continues even when the prayer does not.',
  },
  {
    title: 'The Quran in these days',
    body:
      'Scholars differ. Reciting from memory is widely permitted; touching the physical mushaf is not, since it requires purification. On screens and phones the question turns on whether a device counts as a mushaf — many contemporary scholars permit reading and reciting from a phone for that reason, while others advise limiting it to looking and listening. Follow the position of a scholar you trust, and keep the Quran close either way: listening to recitation is open to everyone, in every state.',
  },
];

export const EXPLANATIONS: GuidanceBlock[] = [
  {
    title: 'Hayd — the monthly cycle',
    body:
      'Natural bleeding that comes to a woman at its known time, without a cause such as injury or illness. Commonly cited limits are a minimum of three days and a maximum of fifteen, with at least fifteen days of purity between two cycles. Anything outside that pattern is usually treated as istihadha, and the details belong with a scholar.',
  },
  {
    title: 'Nifas — after childbirth',
    body:
      'The bleeding that follows delivery. Its commonly cited limit is forty days; bleeding that stops earlier ends it, and purity is established then. Anything that continues past forty days is generally treated as istihadha by those who hold the limit, and the woman returns to prayer and fasting while seeking advice.',
  },
  {
    title: 'Istihadha — irregular bleeding',
    body:
      'Bleeding outside the pattern of hayd or nifas: ongoing spotting, a wound, or bleeding that runs past the limits above. It does not prevent the prayer or the fast. The well-known guidance is to wash, protect the area, and make wudu for the time of each prayer rather than once for the day.',
  },
];

export const GHUSL_FARD: string[] = [
  'Make the intention in the heart, then say: Bismillah.',
  'Wash both hands three times.',
  'Wash away any impurity from the body.',
  'Perform a complete wudu, as for prayer.',
  'Pour water over the head three times, so it reaches the roots of the hair.',
  'Pour water over the whole body, right side first, making sure no patch of skin is left dry.',
];

export const GHUSL_SUNNAH: string[] = [
  'Begin with Bismillah and the intention to lift the major impurity.',
  'Wash the hands, then the private parts, then any impurity on the body.',
  'Perform wudu in full — the Prophet ﷺ performed wudu before the ghusl.',
  'Rub the hair gently so water reaches the scalp, then pour three handfuls over the head.',
  'Start with the right shoulder and the right side of the body, then the left.',
  'Rub the body with the hand where the water can reach, and finish by washing the feet.',
];

export const TUHR_SIGNS: GuidanceBlock[] = [
  {
    title: 'Al-qassah al-bayda',
    body:
      'A white, clear discharge released at the end of the cycle. The Prophet ﷺ described it to Umm Atiyya as the sign that bleeding has ended, and women of the early generations would send word of it to one another.',
  },
  {
    title: 'Jufuf',
    body:
      'Complete dryness: nothing at all is seen when checking, so the place remains clean and dry. For many women this is the clearer of the two signs, and it is reached a day or two after the discharge stops.',
  },
  {
    title: 'When neither comes',
    body:
      'If bleeding continues past what is usual for you, the commonly cited limits are fifteen days for hayd and forty for nifas. Beyond them, the bleeding is generally treated as istihadha: pray, fast, and speak to a scholar and a doctor. Neither of them will find the question unusual.',
  },
];

export const NIYYAH_ARABIC = 'نَوَيْتُ رَفْعَ الْحَدَثِ الْأَكْبَرِ';
export const NIYYAH_TRANSLITERATION = 'Nawaytu raf‘ al-hadath al-akbar';
export const NIYYAH_MEANING = 'I intend to lift the major impurity.';
export const BISMILLAH_ARABIC = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export const REFERENCES: string[] = [
  'Quran 2:222 — “And they ask you about menstruation…”',
  'Sahih al-Bukhari, Kitab al-Hayd — the hadith of Aisha on making up fasts, not prayers',
  'Sahih Muslim — the hadith of Umm Atiyya on the signs of purity',
  'Sahih al-Bukhari and Muslim — “Do what the pilgrim does, except do not circumambulate the House”',
];

export const ADVISORY =
  'This app records what you tell it and works out the arithmetic. It does not give rulings. The fiqh of hayd, nifas and istihadha turns on your own pattern, your madhab and your circumstances, so take the details to a scholar you trust. See a doctor as well for bleeding that is very heavy, that runs past fifteen days for hayd or forty for nifas, or that changes sharply from what is normal for you.';

/* ------------------------------------------------------------ istihada --- */

/**
 * What a stretch of bleeding is, measured against her own pattern and
 * against the limits that are widely cited.
 *
 * This is arithmetic, not a ruling. The app can hold a stretch of bleeding
 * against two things it actually knows — how long she usually bleeds, and
 * the outer limits — and say which side of them it falls on. It cannot weigh
 * the details, and the schools differ on several of them, so every screen
 * that shows this carries the advisory and says which position it applied.
 */
export type BleedingVerdict = 'hayd' | 'hayd-ended' | 'istihada' | 'nifas' | 'nifas-ended' | 'unclear';

export type BleedingAssessment = {
  verdict: BleedingVerdict;
  /** Days the bleeding has run. */
  days: number;
  /** Her own usual length, taken from her history where there is enough. */
  adah: number | null;
  /** Clear days between the last bleeding and this one, as she gave it. */
  purityBefore: number | null;
  /** Longer than the outer maximum for hayd. */
  pastMaximum: boolean;
  /** Began before the minimum purity between two periods had passed. */
  tooSoon: boolean;
  /** Shorter than the minimum for hayd, where a minimum is set at all. */
  belowMinimum: boolean;
  /** Why it landed where it did, in the order the tests were applied. */
  reasons: string[];
};

/** The two questions the screen asks. Both are things she knows directly. */
export type BleedingAnswers = {
  days: number;
  purityBefore: number | null;
};

export function assessBleeding(
  current: WomensState = state,
  answers: BleedingAnswers,
): BleedingAssessment {
  const days = Math.max(1, Math.round(answers.days));
  const purityBefore = answers.purityBefore === null ? null : Math.max(0, Math.round(answers.purityBefore));
  const stats = cycleStats(current);
  const adah = stats.averagePeriod || null;
  const reasons: string[] = [];

  const openNifas = current.nifas.find((entry) => entry.end === null) || null;
  if (openNifas) {
    if (days > LIMITS.nifasMaxDays) {
      reasons.push(`This has run ${days} days, past the ${LIMITS.nifasMaxDays} commonly taken as the outer limit for post-natal bleeding.`);
      reasons.push('Past that limit the extra days are treated as istihada rather than as nifas.');
      return { verdict: 'nifas-ended', days, adah, purityBefore, pastMaximum: true, tooSoon: false, belowMinimum: false, reasons };
    }
    reasons.push('Post-natal bleeding is open, so bleeding in these days is counted as nifas and not as hayd.');
    return { verdict: 'nifas', days, adah, purityBefore, pastMaximum: false, tooSoon: false, belowMinimum: false, reasons };
  }

  const tooSoon = purityBefore !== null && purityBefore < LIMITS.purityBetweenCycles;
  const pastMaximum = days > LIMITS.haydMaxDays;
  const belowMinimum = adah === null && days < LIMITS.haydMinDays;

  if (tooSoon) {
    reasons.push(`There were only ${purityBefore} clear days before it, and ${LIMITS.purityBetweenCycles} days of purity are commonly required between two periods.`);
    reasons.push('Bleeding that begins inside that gap is not counted as a new period.');
    return { verdict: 'istihada', days, adah, purityBefore, pastMaximum, tooSoon, belowMinimum, reasons };
  }

  if (pastMaximum) {
    reasons.push(`This has run ${days} days, past the ${LIMITS.haydMaxDays} commonly taken as the outer limit for hayd.`);
    if (adah) reasons.push(`Your own pattern is about ${adah} days, so hayd is taken as ending there and the days after it are not hayd.`);
    else reasons.push('With no recorded pattern to measure against, the outer limit is what there is to go on.');
    return { verdict: 'hayd-ended', days, adah, purityBefore, pastMaximum: true, tooSoon, belowMinimum, reasons };
  }

  if (adah && days > adah) {
    reasons.push(`This has run ${days} days, past your own pattern of about ${adah}.`);
    reasons.push('Hayd is taken as ending at your usual length, and what follows is counted as istihada.');
    return { verdict: 'hayd-ended', days, adah, purityBefore, pastMaximum, tooSoon, belowMinimum, reasons };
  }

  if (belowMinimum) {
    reasons.push(`This has run ${days} days, short of the ${LIMITS.haydMinDays} commonly taken as the minimum for hayd.`);
    reasons.push('This is the point the schools differ on most: some set no minimum at all, and treat any bleeding as hayd once it has begun.');
    return { verdict: 'unclear', days, adah, purityBefore, pastMaximum, tooSoon, belowMinimum, reasons };
  }

  if (adah) reasons.push(`This has run ${days} days, within your own pattern of about ${adah}.`);
  else reasons.push(`This has run ${days} days, inside the limits commonly cited for hayd.`);
  return { verdict: 'hayd', days, adah, purityBefore, pastMaximum, tooSoon, belowMinimum, reasons };
}

/** What each answer means for what she does next. Guidance, not rulings. */
export const BLEEDING_GUIDANCE: Record<BleedingVerdict, { title: string; body: string; steps: string[] }> = {
  hayd: {
    title: 'Counted as hayd',
    body: 'On what you have entered, this falls inside your own pattern and inside the limits commonly cited. Prayer and fasting are not due in these days.',
    steps: [
      'The prayers of these days are not prayed and are not made up afterwards.',
      'Fast days that fall in them are not fasted, and are owed — the Qada screen will keep the count.',
      'When the bleeding stops, ghusl, and then prayer resumes.',
      'There is no set minimum number of days to wait before the ghusl; the end of the bleeding is the sign.',
    ],
  },
  'hayd-ended': {
    title: 'The hayd has ended — what follows is istihada',
    body: 'The bleeding has run past the length that counts, so the hayd is taken as finished and the days after it do not carry its rules. That distinction is the whole point of this screen: the days after are days of prayer and fasting, not days off.',
    steps: [
      'Ghusl once, now — the major impurity of the hayd is lifted by it, and the bleeding that continues does not bring it back.',
      'Prayer and fasting resume from here, and the fasts of these days count.',
      'The continuing bleeding is treated as istihada: wudu is made for each prayer rather than ghusl.',
      'Any fast already missed in the hayd portion is still owed, and belongs on the Qada screen.',
    ],
  },
  istihada: {
    title: 'Counted as istihada — not a period',
    body: 'This is bleeding that is not menstrual. That changes almost everything: the prayer and the fast remain due, and the days are not days to be made up later. This is the case most often mistaken for a period, and the cost of getting it wrong is a week of prayer that was owed all along.',
    steps: [
      'Prayer is due in these days, and the prayer of each one is prayed.',
      'Fasting is due, and a fast kept in them counts — it is not owed again.',
      'Wudu is made for each prayer rather than once for the day, which is the practice commonly described for istihada.',
      'Ghusl is not required by the bleeding itself; it is for the hayd that preceded it.',
      'Record the bleeding on the Cycle screen so your own pattern stays accurate.',
    ],
  },
  'nifas-ended': {
    title: 'The post-natal bleeding has ended — what follows is istihada',
    body: 'This has run past the outer limit for post-natal bleeding, so the nifas is taken as finished and the days after it do not carry its rules. What remains is istihada, and with it the prayer and the fast.',
    steps: [
      'Ghusl once, now — the days that follow are days of prayer, not days off.',
      'Prayer and fasting resume from here, and a fast kept after the ghusl counts.',
      'The continuing bleeding is treated as istihada: wudu for each prayer rather than ghusl.',
      'The fasts missed during the nifas itself are still owed, and belong on the Qada screen.',
    ],
  },
  nifas: {
    title: 'Counted as post-natal bleeding (nifas)',
    body: 'Bleeding after childbirth is counted as nifas while it lasts, up to the outer limit. Its rules follow those of hayd for the days it runs.',
    steps: [
      'Prayer and fasting are not due while it continues, and the fasts are owed.',
      'When it stops — or at the outer limit, whichever comes first — ghusl, and prayer resumes.',
      'Bleeding that continues past the outer limit is treated as istihada from that point.',
      'The fasts missed are kept on the Qada screen.',
    ],
  },
  unclear: {
    title: 'Not settled by the numbers alone',
    body: 'This sits in the range the schools disagree on, so the app will not settle it for you. The two positions are set out below so that you can take them to someone who can weigh them.',
    steps: [
      'One position sets a minimum length for hayd, so bleeding shorter than it is not a period and prayer remains due.',
      'Another sets no minimum at all, and counts any bleeding as hayd once it has begun.',
      'Either way, record the days on the Cycle screen so the pattern is there when you need it.',
      'For what you do in these specific days, ask a scholar you trust.',
    ],
  },
};

/**
 * Which position the arithmetic above applies, said out loud. The app holds
 * one set of numbers, because a screen that hedged every figure would be
 * useless — but which set it holds should never be a surprise.
 */
export const SCHOOL_NOTE =
  'The figures used here are the ones most commonly cited: a minimum of three days and a maximum of fifteen for hayd, fifteen clear days between two periods, and forty for post-natal bleeding. Schools differ on several of them, and your own school may set them differently. Where the difference changes the answer, this screen says so rather than choosing for you.';

/* ------------------------------------------------------ ramadan plan --- */

/**
 * Which of the coming days of Ramadan the cycle is likely to fall on, and
 * what that leaves to make up.
 *
 * Two things are kept separate throughout. The first is arithmetic the app can
 * actually do: given her own recorded cycle length, count forward and see where
 * the days land. The second is what actually happens, which no projection can
 * know. A period that arrives early, or the arrival of bleeding in the last
 * minutes before Maghrib, changes the answer. So the plan is always offered as
 * a shape of the month to prepare around, never as a verdict on a day.
 *
 * Nothing here is transmitted. The Hijri dates are worked out on the device by
 * the tabular calendar rather than fetched, so planning the month costs no
 * network request and leaves no trace of what was asked.
 */

/** Tabular Islamic calendar, civil epoch. Verified against published dates for
 *  the first of Ramadan across 1445-1450 AH: exact in every one of them. */
const HIJRI_EPOCH_JD = 1948439;

function hijriToJd(year: number, month: number, day: number) {
  return (
    day +
    (29 * (month - 1) + Math.floor(month / 2)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    HIJRI_EPOCH_JD
  );
}

function jdToGregorian(jd: number) {
  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const d = l - Math.floor((2447 * j) / 80);
  const k = Math.floor(j / 11);
  return { year: 100 * (n - 49) + i + k, month: j + 2 - 12 * k, day: d };
}

function gregorianToJd(year: number, month: number, day: number) {
  const a = Math.floor((month - 14) / 12);
  return (
    Math.floor((1461 * (year + 4800 + a)) / 4) +
    Math.floor((367 * (month - 2 - 12 * a)) / 12) -
    Math.floor((3 * Math.floor((year + 4900 + a) / 100)) / 4) +
    day -
    32075
  );
}

/** 1 Ramadan of a given Hijri year, as a YYYY-MM-DD key. */
export function ramadanStartForHijriYear(hijriYear: number) {
  const g = jdToGregorian(hijriToJd(hijriYear, 9, 1));
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${g.year}-${pad(g.month)}-${pad(g.day)}`;
}

/**
 * The Ramadan that this month belongs to - the one still running if today falls
 * inside it, otherwise the one coming next.
 *
 * The distinction matters more than it looks. A woman opening this on the tenth
 * of Ramadan does not want next year's plan; she wants the month she is in.
 * Only once the month has actually ended does the planner move on.
 */
export function nextRamadanHijriYear(today = dayKey()) {
  const [y, m] = today.split('-').map(Number);
  const jd = gregorianToJd(y, m, 1);
  /* Search a window either side of the year the tabular calendar suggests. */
  const guess = Math.floor(((jd - HIJRI_EPOCH_JD) * 30) / 10631) + 1;
  for (let year = guess - 1; year <= guess + 2; year += 1) {
    const start = ramadanStartForHijriYear(year);
    const end = addDays(start, RAMADAN_LENGTH - 1);
    /* Today is before or inside this Ramadan. */
    if (daysBetween(today, end) >= 0) return year;
  }
  return guess;
}

/** Ramadan runs 29 or 30 days. The tabular calendar gives 30; the month is
 *  never longer, so the thirtieth is included and is marked as the day that
 *  depends on the sighting. */
export const RAMADAN_LENGTH = 30;

export type RamadanDayState = 'clear' | 'likely' | 'possible';

export type RamadanPlanDay = {
  date: string;
  ramadanDay: number;
  state: RamadanDayState;
};

export type RamadanConfidence = 'good' | 'fair' | 'weak';

export type RamadanPlan = {
  /** False until there is enough history to count forward from. */
  hasPattern: boolean;
  confidence: RamadanConfidence;
  cycleCount: number;
  averageCycle: number | null;
  averagePeriod: number | null;
  /** How far her cycle length has actually swung, in days. Drives the band. */
  variation: number;
  hijriYear: number;
  start: string;
  end: string;
  days: RamadanPlanDay[];
  likelyCount: number;
  possibleCount: number;
  owedLow: number;
  owedHigh: number;
  started: boolean;
  finished: boolean;
  daysLeft: number;
  /** The next Ramadan after this one - the day the debt falls due. */
  deadline: string;
  daysUntilDeadline: number;
};

export function ramadanPlan(
  current = state,
  today = dayKey(),
  ramadanStart?: string,
): RamadanPlan {
  const sorted = [...current.cycles].sort((a, b) => (a.start < b.start ? 1 : -1));
  const completed = sorted.filter((entry) => entry.end !== null);

  const lengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const gap = daysBetween(sorted[i + 1].start, sorted[i].start);
    if (gap > 0 && gap < 90) lengths.push(gap);
  }
  const periods = completed
    .map((entry) => daysBetween(entry.start, entry.end as string) + 1)
    .filter((value) => value > 0 && value <= LIMITS.haydMaxDays + 5);

  /* Two measured gaps is the least that counts as a pattern. One gap is a
     single number, and a projection built on it would be a guess wearing the
     clothes of her own history. */
  const hasPattern = lengths.length >= 2 && average(periods.slice(0, 6)) > 0;
  const averageCycle = average(lengths.slice(0, 6));
  const averagePeriod = average(periods.slice(0, 6));
  const variation = lengths.length
    ? Math.max(...lengths.slice(0, 6)) - Math.min(...lengths.slice(0, 6))
    : 0;

  const hijriYear = nextRamadanHijriYear(today);
  const start = ramadanStart || ramadanStartForHijriYear(hijriYear);
  const end = addDays(start, RAMADAN_LENGTH - 1);

  const days: RamadanPlanDay[] = [];
  for (let i = 0; i < RAMADAN_LENGTH; i += 1) {
    days.push({ date: addDays(start, i), ramadanDay: i + 1, state: 'clear' });
  }

  if (hasPattern) {
    /* The band is half her own swing, so a regular cycle gets a tight band and
       an irregular one gets a wide one. Capped, because past a certain width
       the band stops being information and becomes a hedge. */
    const band = Math.min(4, Math.max(1, Math.round(variation / 2)));
    const lastStart = sorted[0].start;

    /* Count forward from the last recorded start, one cycle at a time, and
       stop once the projections have walked past the end of Ramadan. */
    for (let k = 0; k < 40; k += 1) {
      const cycleStart = addDays(lastStart, k * averageCycle);
      if (daysBetween(cycleStart, end) < 0) break;
      const cycleEnd = addDays(cycleStart, averagePeriod - 1);
      for (const day of days) {
        if (day.state !== 'clear') continue;
        const withinPeriod =
          daysBetween(cycleStart, day.date) >= 0 && daysBetween(day.date, cycleEnd) >= 0;
        if (withinPeriod) {
          day.state = 'likely';
          continue;
        }
        /* Either side of the projected days - the spread her own history shows. */
        const gapToPeriod = Math.min(
          Math.abs(daysBetween(day.date, cycleStart)),
          Math.abs(daysBetween(cycleEnd, day.date)),
        );
        if (gapToPeriod <= band) day.state = 'possible';
      }
    }
    /* A day cannot be merely possible if it sits between two likely runs. */
    for (let i = 1; i < days.length - 1; i += 1) {
      if (days[i].state === 'possible' && days[i - 1].state === 'likely' && days[i + 1].state === 'likely') {
        days[i].state = 'likely';
      }
    }
  }

  const likelyCount = days.filter((day) => day.state === 'likely').length;
  const possibleCount = days.filter((day) => day.state === 'possible').length;

  const confidence: RamadanConfidence =
    !hasPattern ? 'weak' : lengths.length >= 4 && variation <= 7 ? 'good' : lengths.length >= 3 && variation <= 14 ? 'fair' : 'weak';

  const deadline = ramadanStartForHijriYear(hijriYear + 1);

  return {
    hasPattern,
    confidence,
    cycleCount: sorted.length,
    averageCycle: hasPattern ? averageCycle : null,
    averagePeriod: hasPattern ? averagePeriod : null,
    variation,
    hijriYear,
    start,
    end,
    days,
    likelyCount,
    possibleCount,
    owedLow: likelyCount,
    owedHigh: likelyCount + possibleCount,
    started: daysBetween(start, today) >= 0,
    finished: daysBetween(end, today) > 0,
    daysLeft: Math.max(0, -daysBetween(start, today)),
    deadline,
    daysUntilDeadline: Math.max(0, daysBetween(today, deadline)),
  };
}

/** Short lines for the three states, written for the day rows. */
export const RAMADAN_STATE_LABEL: Record<RamadanDayState, string> = {
  likely: 'Likely',
  possible: 'Possible',
  clear: 'No period expected',
};

/** What a woman most often needs to know, and what is most often got wrong. */
export const RAMADAN_NOTES: { title: string; body: string }[] = [
  {
    title: 'The last minutes count',
    body: 'A fast is broken by bleeding that begins even a moment before Maghrib, and that day is then owed. This is why the plan marks the days either side of the projected ones rather than only the days inside them — the edge of a period is where the day is decided.',
  },
  {
    title: 'Made up, not paid off',
    body: 'Days missed through hayd or nifas are made up one for one. There is no fidyah on them, because fidyah belongs to the one who cannot make the day up at all. A woman who can fast later fasts later.',
  },
  {
    title: 'Before the next Ramadan',
    body: 'The days are a debt with a date on it: they are due before the next Ramadan arrives. They do not have to be kept consecutively, and may be spread through the year — which is the whole reason to know the number early rather than in the last week of Shaban.',
  },
  {
    title: 'Ghusl is for the prayer, not the fast',
    body: 'If bleeding stops before Fajr and the fast is intended that night, the fast stands. Ghusl is required before the prayer; it is not a condition of the fast itself. A woman may wake in a state that defers Fajr and still hold a valid fast.',
  },
];

export const RAMADAN_ADVISORY =
  'This is arithmetic on your own recorded pattern, not knowledge of what the month will bring. A cycle that comes early, a period that runs long, or bleeding that starts in the last minutes before Maghrib all change the count. The ruling follows what happens, not what was projected — so treat this as a shape to prepare around, and settle each day as it actually comes.';

/* ---------------------------------------------------- these days --- */

/**
 * What remains open in the days of hayd and nifas.
 *
 * The instinct in an app like this is to grey things out - to show a woman
 * what she cannot do. That gets the month backwards. Two worships are lifted
 * in these days, and they are lifted as a mercy, not held back as a loss.
 * Almost everything else she does is untouched by them.
 *
 * The one place the screen slows down is where the scholars genuinely differ.
 * There the range is given rather than a position chosen, because the app
 * does not know which school she follows and has no business deciding for
 * her. A difference of opinion is not a problem to be solved by picking a
 * default; it is something she takes to someone she trusts.
 */

export type TheseDaysAct = {
  id: 'listen' | 'meaning' | 'vocabulary' | 'dhikr' | 'dua';
  title: string;
  body: string;
};

/** The acts on which there is no dispute at all. */
export const THESE_DAYS_ACTS: TheseDaysAct[] = [
  {
    id: 'listen',
    title: 'Listening to the recitation',
    body: 'Open to you without question — no school disputes it. Put a reciter on and let the day be filled with the sound of it. Listening is not a lesser substitute for reciting; it is its own worship, and these are often the days a woman listens most.',
  },
  {
    id: 'meaning',
    title: 'Studying the meaning',
    body: 'Translation and tafsir are not the Quran in the sense that recitation is — they are the study of it, and study is not closed to you. Many women find these days become the most attentive reading of their month, precisely because the pace slows and the hurry goes out of it.',
  },
  {
    id: 'vocabulary',
    title: 'Learning the words',
    body: 'A word at a time, and every root learned is a door that stays open long after these days have passed. Ten days of ten words is a hundred words carried into the rest of the year.',
  },
  {
    id: 'dhikr',
    title: 'Dhikr, tasbih and istighfar',
    body: 'The tongue is not restrained from the remembrance of Allah at any hour. Subhan Allah, alhamdulillah, la ilaha illa Allah, Allahu akbar — and asking His forgiveness — are yours in every one of these days, in whatever measure you wish.',
  },
  {
    id: 'dua',
    title: 'Asking',
    body: 'Dua is worship, and it is never closed. The days in which the prayer is lifted from a woman are, by many accounts, days in which her asking is especially her own — nothing stands between her and it.',
  },
];

/** Where the difference genuinely lies, given as a range and not resolved. */
export const THESE_DAYS_DISPUTED: { title: string; body: string }[] = [
  {
    title: 'Reciting the Arabic',
    body: 'The scholars differ, and the difference is old and real. The majority hold that a woman in hayd or nifas does not recite the Quran, and this is the position most commonly taught. Others permit it — among them the Maliki school, a view within the Hanbali school, and a number of later scholars — particularly for one who fears losing what she has memorised, or for whom recitation has become a form of remembrance. Both sides reason from the same sources.',
  },
  {
    title: 'Touching the mushaf',
    body: 'The well-known position rests on the verse that none touch it but the purified, so the majority restrict handling the physical mushaf to one in a state of purity. Reading from a screen is a newer question: a phone is not a mushaf, and many therefore permit it while still holding back from reciting the Arabic aloud. Others draw no such distinction.',
  },
  {
    title: 'What both sides agree on',
    body: 'Everyone agrees that listening, studying the meaning, dhikr, dua, charity and seeking knowledge remain open. Where the disagreement falls, it falls on a narrow question — and a narrow question should not be allowed to swallow the whole month.',
  },
];

/** The hadith the whole screen leans on, given for its meaning rather than as a proof text. */
export const THESE_DAYS_ANCHOR =
  'When ‘A’ishah began to menstruate on the pilgrimage, the Prophet ﷺ told her to do everything the pilgrim does, and to leave only the circling of the House until she was pure. Every worship of the Hajj stayed hers; one was held back. That is the shape of these days — nearly everything stays, and the thing held back is held back by the One who gave it.';

export const THESE_DAYS_ADVISORY =
  'Two worships are lifted in these days, and they are lifted as a mercy rather than taken as a loss. Nothing here is owed back, and nothing needs to be made up except the fasts. Where the scholars differ, the difference is described rather than settled — take it to someone you trust, and do not let it become a weight. This app records and explains; it does not rule.';
