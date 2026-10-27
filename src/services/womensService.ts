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

export function formatDay(key: string, locale = 'en') {
  try {
    return parseDay(key).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return key;
  }
}

export function formatLongDay(key: string, locale = 'en') {
  try {
    return parseDay(key).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
