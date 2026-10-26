import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 4 — fasting record and Qada ledger.
 *
 * A private, on-device record: which days were fasted, why a day was missed, and
 * how many make-up days remain. Nothing is uploaded and no account is involved.
 * The missed-day reasons exist so the make-up ledger can be kept honest — not to
 * give rulings. Anything that depends on a person's situation belongs with a
 * scholar they trust, and the screen says so.
 */

export type FastType = 'ramadan' | 'voluntary' | 'qada' | 'missed';
export type MissedReason = 'travel' | 'illness' | 'menstruation' | 'nifas' | 'other';

export type FastEntry = {
  date: string;
  type: FastType;
  reason?: MissedReason;
  note?: string;
  loggedAt: number;
};

export type FastingState = {
  entries: FastEntry[];
  owed: number;
};

export const MISSED_REASONS: { id: MissedReason; label: string; detail: string }[] = [
  { id: 'travel', label: 'Travelling', detail: 'A day missed while on a journey' },
  { id: 'illness', label: 'Illness', detail: 'A day missed through sickness' },
  { id: 'menstruation', label: 'Menstruation', detail: 'A day not fasted during the monthly cycle' },
  { id: 'nifas', label: 'Post-natal', detail: 'A day not fasted after childbirth' },
  { id: 'other', label: 'Other', detail: 'Any other reason' },
];

const KEY = 'deen-fasting-v1';
const EMPTY: FastingState = { entries: [], owed: 0 };

let state: FastingState = EMPTY;
const listeners = new Set<(next: FastingState) => void>();

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

function emit(next: FastingState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: FastingState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function getFastingState() {
  return state;
}

export function subscribeFasting(listener: (next: FastingState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFasting(): FastingState {
  const [value, setValue] = useState<FastingState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeFasting(setValue);
  }, []);
  return value;
}

export async function loadFastingState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    state = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
    if (!Array.isArray(state.entries)) state.entries = [];
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

export function entryForDate(date = dayKey()) {
  return state.entries.find((entry) => entry.date === date) || null;
}

/** A missed day adds one to the make-up ledger; a make-up fast settles one. */
function owedAfter(type: FastType, current: number) {
  if (type === 'missed') return current + 1;
  if (type === 'qada') return Math.max(0, current - 1);
  return current;
}

export async function recordFast(type: FastType, options: { date?: string; reason?: MissedReason; note?: string } = {}) {
  const date = options.date || dayKey();
  const existing = state.entries.find((entry) => entry.date === date);
  const entries = state.entries.filter((entry) => entry.date !== date);
  let owed = state.owed;
  if (existing?.type === 'missed') owed = Math.max(0, owed - 1);
  if (existing?.type === 'qada') owed += 1;
  const entry: FastEntry = { date, type, reason: options.reason, note: options.note, loggedAt: Date.now() };
  await persist({ entries: [entry, ...entries].slice(0, 400), owed: owedAfter(type, owed) });
  return state;
}

export async function clearFastDay(date = dayKey()) {
  const existing = state.entries.find((entry) => entry.date === date);
  if (!existing) return state;
  const owed = state.owed + (existing.type === 'missed' ? -1 : 0) + (existing.type === 'qada' ? 1 : 0);
  await persist({ entries: state.entries.filter((entry) => entry.date !== date), owed: Math.max(0, owed) });
  return state;
}

export async function setFastingOwed(value: number) {
  const owed = Math.max(0, Math.min(365, Math.round(value)));
  await persist({ ...state, owed });
  return owed;
}

export type FastingSummary = {
  completed: number;
  ramadan: number;
  voluntary: number;
  qada: number;
  missed: number;
  owed: number;
  streak: number;
  thisWeek: number;
  today: FastEntry | null;
  recent: FastEntry[];
};

export function summariseFasting(next: FastingState = state): FastingSummary {
  const entries = next.entries;
  const fasted = entries.filter((entry) => entry.type !== 'missed');
  const counts = {
    ramadan: fasted.filter((entry) => entry.type === 'ramadan').length,
    voluntary: fasted.filter((entry) => entry.type === 'voluntary').length,
    qada: fasted.filter((entry) => entry.type === 'qada').length,
    missed: entries.filter((entry) => entry.type === 'missed').length,
  };

  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    const entry = entries.find((item) => item.date === key);
    const fastedThatDay = !!entry && entry.type !== 'missed';
    if (fastedThatDay) streak += 1;
    else if (i > 0) break;
    else if (!entry) continue; // today is not decided yet — do not break the streak
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weekKey = dayKey(weekStart);
  return {
    completed: fasted.length,
    ...counts,
    owed: next.owed,
    streak,
    thisWeek: fasted.filter((entry) => entry.date >= weekKey).length,
    today: entries.find((entry) => entry.date === dayKey()) || null,
    recent: [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 21),
  };
}

export function labelForEntry(entry: FastEntry) {
  if (entry.type === 'missed') {
    const reason = MISSED_REASONS.find((item) => item.id === entry.reason);
    return `Missed · ${reason?.label || 'recorded'}`;
  }
  if (entry.type === 'qada') return 'Make-up fast';
  if (entry.type === 'voluntary') return 'Voluntary fast';
  return 'Ramadan fast';
}

export function readableDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}
