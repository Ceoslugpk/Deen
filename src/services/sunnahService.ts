import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * Sunnah prayers — the voluntary ones kept beside the five rather than inside
 * them.
 *
 * This is deliberately a separate record from the five daily prayers. Witr,
 * Duha and Tahajjud are not obligations, so folding them into the same ledger
 * would quietly corrupt both numbers: a missed Fajr and a missed Duha are not
 * the same kind of thing, and a completion rate that counted them together
 * would flatter the obligation and nag the voluntary act. Two records, each
 * honest about what it is counting.
 *
 * It stays on the device. Nothing is uploaded, and no account is involved.
 */

export const SUNNAH_PRAYERS = ['Witr', 'Duha', 'Tahajjud'] as const;
export type SunnahPrayer = (typeof SUNNAH_PRAYERS)[number];

/** When each one is prayed, used only for ordering and for the day's summary. */
export const SUNNAH_ORDER: Record<SunnahPrayer, string> = {
  Tahajjud: 'Night, before Fajr',
  Duha: 'Mid-morning, after sunrise',
  Witr: 'After Isha',
};

export type SunnahState = {
  /** Day key -> which of the sunnah were prayed that day. */
  days: Record<string, SunnahPrayer[]>;
};

const KEY = 'deen-sunnah-v1';
const EMPTY: SunnahState = { days: {} };

let state: SunnahState = { ...EMPTY, days: {} };
const listeners = new Set<(next: SunnahState) => void>();

function emit(next: SunnahState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: SunnahState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function subscribeSunnah(listener: (next: SunnahState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Local calendar day, not UTC — a night prayer belongs to the night you prayed it. */
export function sunnahDayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function loadSunnahState(): Promise<SunnahState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SunnahState>;
      state = { days: parsed && typeof parsed.days === 'object' && parsed.days ? parsed.days : {} };
    } else {
      state = { days: {} };
    }
  } catch {
    state = { days: {} };
  }
  emit(state);
  return state;
}

export function useSunnah(): SunnahState {
  const [value, setValue] = useState<SunnahState>(state);
  useEffect(() => subscribeSunnah(setValue), []);
  return value;
}

/** The sunnah marked for one day, guaranteed to be an array. */
export function sunnahForDay(days: Record<string, SunnahPrayer[]>, key: string): SunnahPrayer[] {
  return (days && days[key]) || [];
}

/**
 * Mark or unmark one sunnah prayer on one day. Only the known names are
 * accepted, so a stray value can never be written into the record.
 */
export async function toggleSunnah(prayer: SunnahPrayer, key: string = sunnahDayKey()) {
  if (!SUNNAH_PRAYERS.includes(prayer)) return;
  const current = sunnahForDay(state.days, key);
  const next = current.includes(prayer)
    ? current.filter((p) => p !== prayer)
    : [...current, prayer];
  const days = { ...state.days };
  if (next.length) days[key] = next;
  else delete days[key];
  await persist({ days });
}

/* Consecutive days, counting back from today, where a day only counts when it
   holds the single prayer asked about. This is per-prayer on purpose: a run of
   Witr is a different habit from a run of Tahajjud, and collapsing them into
   one streak would make the number meaningless. */
export function sunnahStreak(days: Record<string, SunnahPrayer[]>, prayer: SunnahPrayer): number {
  const cursor = new Date();
  let run = 0;
  /* Today not yet marked should not break a run that is otherwise intact —
     the day is still young, so start from yesterday when today is empty. */
  if (!sunnahForDay(days, sunnahDayKey(cursor)).includes(prayer)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  for (let i = 0; i < 2000; i += 1) {
    if (sunnahForDay(days, sunnahDayKey(cursor)).includes(prayer)) {
      run += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return run;
}

export type SunnahSummary = {
  /** Days on which at least one sunnah was prayed. */
  daysKept: number;
  /** Total individual sunnah prayers marked. */
  total: number;
  /** Days where all three were prayed. */
  fullDays: number;
  /** Per-prayer lifetime totals and current runs. */
  per: Record<SunnahPrayer, { count: number; streak: number }>;
};

export function sunnahSummary(days: Record<string, SunnahPrayer[]>, today: string = sunnahDayKey()): SunnahSummary {
  const per = {
    Witr: { count: 0, streak: 0 },
    Duha: { count: 0, streak: 0 },
    Tahajjud: { count: 0, streak: 0 },
  } as Record<SunnahPrayer, { count: number; streak: number }>;

  let daysKept = 0;
  let total = 0;
  let fullDays = 0;

  for (const key of Object.keys(days || {})) {
    /* A day in the future cannot have been prayed. Skip rather than let a
       clock change or a bad import inflate the record. */
    if (key > today) continue;
    const list = sunnahForDay(days, key);
    if (!list.length) continue;
    daysKept += 1;
    for (const prayer of list) {
      if (per[prayer]) {
        total += 1;
        per[prayer].count += 1;
      }
    }
    if (SUNNAH_PRAYERS.every((p) => list.includes(p))) fullDays += 1;
  }

  for (const prayer of SUNNAH_PRAYERS) per[prayer].streak = sunnahStreak(days, prayer);

  return { daysKept, total, fullDays, per };
}

/** Recent days, newest first, for the history list. */
export function sunnahHistory(days: Record<string, SunnahPrayer[]>, limit = 60) {
  return Object.keys(days || {})
    .filter((key) => sunnahForDay(days, key).length > 0)
    .sort()
    .reverse()
    .slice(0, limit)
    .map((key) => ({ key, prayers: sunnahForDay(days, key) }));
}

export async function resetSunnah() {
  await persist({ days: {} });
}
