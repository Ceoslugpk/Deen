import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * Qada — the prayers that were missed and are still owed.
 *
 * There is no judgement here on purpose. Missing a prayer happens: you slept
 * through Fajr, you were travelling, you were unwell. What this keeps is a
 * plain private ledger — what is outstanding, what has been made up, and a
 * pace you can actually keep — so the debt can be cleared without guilt
 * becoming the interface.
 *
 * It stays on the device. Nothing is uploaded, and no account is involved.
 *
 * The five prayer names match the ones the rest of the app already uses, so a
 * prayer logged here is the same prayer the tracker and the reminders mean.
 */

export const QADA_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type QadaPrayer = (typeof QADA_PRAYERS)[number];

export type QadaEntry = {
  id: string;
  prayer: QadaPrayer;
  /** The day the prayer was missed, as YYYY-MM-DD. */
  dateKey: string;
  loggedAt: number;
  /** Set when it has been made up. */
  clearedAt?: number;
};

export type QadaState = {
  entries: QadaEntry[];
  /** How many are made up per day. One is the gentle default. */
  dailyGoal: number;
};

const KEY = 'deen-qada-prayer-v1';
const EMPTY: QadaState = { entries: [], dailyGoal: 1 };

let state: QadaState = { ...EMPTY };
const listeners = new Set<(next: QadaState) => void>();

function emit(next: QadaState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: QadaState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function subscribeQada(listener: (next: QadaState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useQada(): QadaState {
  const [value, setValue] = useState<QadaState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeQada(setValue);
  }, []);
  return value;
}

export const qadaDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export async function loadQadaState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    state = {
      entries: Array.isArray(saved?.entries) ? saved.entries.filter(isEntry) : [],
      dailyGoal: Number.isFinite(saved?.dailyGoal) && saved.dailyGoal > 0 ? saved.dailyGoal : 1,
    };
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

const isEntry = (value: any): value is QadaEntry =>
  !!value &&
  typeof value.id === 'string' &&
  QADA_PRAYERS.includes(value.prayer) &&
  typeof value.dateKey === 'string' &&
  typeof value.loggedAt === 'number';

export type QadaSummary = {
  /** Still owed. */
  outstanding: number;
  /** Made up so far. */
  cleared: number;
  /** Outstanding, counted per prayer. */
  byPrayer: Record<string, number>;
  /**
   * Days to clear the debt at the current pace, rounded up.
   * Zero when nothing is owed.
   */
  etaDays: number;
  /** The oldest day still owed, if any. */
  oldestOutstanding?: string;
};

export function qadaSummary(value: QadaState = state): QadaSummary {
  const outstandingEntries = value.entries.filter((entry) => !entry.clearedAt);
  const byPrayer: Record<string, number> = {};
  QADA_PRAYERS.forEach((prayer) => {
    byPrayer[prayer] = 0;
  });
  outstandingEntries.forEach((entry) => {
    byPrayer[entry.prayer] = (byPrayer[entry.prayer] || 0) + 1;
  });
  const dates = outstandingEntries.map((entry) => entry.dateKey).sort();
  return {
    outstanding: outstandingEntries.length,
    cleared: value.entries.length - outstandingEntries.length,
    byPrayer,
    etaDays: outstandingEntries.length
      ? Math.ceil(outstandingEntries.length / Math.max(1, value.dailyGoal))
      : 0,
    oldestOutstanding: dates[0],
  };
}

/** Record a prayer that was missed. */
export async function logMissedPrayer(prayer: QadaPrayer, dateKey = qadaDayKey()) {
  const entry: QadaEntry = {
    id: `qada-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prayer,
    dateKey,
    loggedAt: Date.now(),
  };
  await persist({ ...state, entries: [...state.entries, entry] });
  return state;
}

/** Mark one made up. The oldest outstanding of that prayer goes first. */
export async function clearQada(prayer: QadaPrayer) {
  const index = state.entries.findIndex((entry) => entry.prayer === prayer && !entry.clearedAt);
  if (index === -1) return state;
  const entries = state.entries.slice();
  entries[index] = { ...entries[index], clearedAt: Date.now() };
  await persist({ ...state, entries });
  return state;
}

/** Settle a specific logged entry. */
export async function clearQadaEntry(id: string) {
  await persist({
    ...state,
    entries: state.entries.map((entry) =>
      entry.id === id && !entry.clearedAt ? { ...entry, clearedAt: Date.now() } : entry,
    ),
  });
  return state;
}

/** Put an entry back into the outstanding list. */
export async function reopenQadaEntry(id: string) {
  await persist({
    ...state,
    entries: state.entries.map((entry) => {
      if (entry.id !== id) return entry;
      const { clearedAt, ...rest } = entry;
      return rest;
    }),
  });
  return state;
}

/** Forget an entry entirely. */
export async function removeQadaEntry(id: string) {
  await persist({ ...state, entries: state.entries.filter((entry) => entry.id !== id) });
  return state;
}

export async function setQadaDailyGoal(goal: number) {
  const next = Math.max(1, Math.min(10, Math.round(goal)));
  await persist({ ...state, dailyGoal: next });
  return state;
}

/** Wipe the ledger, made-up history included. */
export async function resetQada() {
  await persist({ ...EMPTY, dailyGoal: state.dailyGoal });
  return state;
}
