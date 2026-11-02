import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * A private journal.
 *
 * The notes in the Quran are tied to a verse — they belong to the ayah they
 * were written beside. This belongs to nothing but the day it was written on.
 * That is the whole difference, and it is why this is a separate place rather
 * than another tab on the notes screen.
 *
 * There are no streaks here, no targets and no reminders. Writing is the
 * practice; counting it would turn it into something else. Some days will have
 * an entry and many will not, and that is not a failure of anything.
 *
 * It stays on the device. Nothing is uploaded, nothing is shared, and no
 * account is involved.
 */

export type JournalEntry = {
  id: string;
  text: string;
  /** The day it was written, as YYYY-MM-DD. */
  dateKey: string;
  createdAt: number;
  updatedAt: number;
};

export type JournalState = {
  entries: JournalEntry[];
};

const KEY = 'deen-journal-v1';
const EMPTY: JournalState = { entries: [] };

let state: JournalState = { ...EMPTY };
const listeners = new Set<(next: JournalState) => void>();

function emit(next: JournalState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: JournalState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export function subscribeJournal(listener: (next: JournalState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useJournal(): JournalState {
  const [value, setValue] = useState<JournalState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeJournal(setValue);
  }, []);
  return value;
}

export const journalDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export async function loadJournalState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    state = { entries: Array.isArray(saved?.entries) ? saved.entries.filter(isEntry) : [] };
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

const isEntry = (value: any): value is JournalEntry =>
  !!value &&
  typeof value.id === 'string' &&
  typeof value.text === 'string' &&
  typeof value.dateKey === 'string' &&
  typeof value.createdAt === 'number';

export type JournalSummary = {
  count: number;
  /** Days with an entry, which is fewer than entries if you write twice. */
  days: number;
  /** The most recent entry, if any. */
  lastAt?: number;
  /** Longest run of consecutive days with an entry, in days. */
  streak: number;
};

export function journalSummary(value: JournalState = state): JournalSummary {
  let lastAt: number | undefined;
  value.entries.forEach((entry) => {
    if (lastAt === undefined || entry.updatedAt > lastAt) lastAt = entry.updatedAt;
  });

  const days = new Set(value.entries.map((entry) => entry.dateKey));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { count: value.entries.length, days: days.size, lastAt, streak };
}

/**
 * Write an entry, or rewrite one that is already there.
 *
 * Passing an id edits that entry; leaving it out starts a new one for today.
 */
export async function saveJournalEntry(text: string, id?: string) {
  const trimmed = text.trim();
  if (!trimmed) return state;

  if (id) {
    await persist({
      ...state,
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, text: trimmed, updatedAt: Date.now() } : entry,
      ),
    });
    return state;
  }

  const entry: JournalEntry = {
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    dateKey: journalDayKey(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await persist({ ...state, entries: [entry, ...state.entries] });
  return state;
}

export async function removeJournalEntry(id: string) {
  await persist({ ...state, entries: state.entries.filter((entry) => entry.id !== id) });
  return state;
}

/** Wipe the journal. */
export async function resetJournal() {
  await persist({ ...EMPTY });
  return state;
}
