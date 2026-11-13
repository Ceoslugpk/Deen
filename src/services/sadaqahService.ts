import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeText } from './storage';
import { useEffect, useState } from 'react';
import { CURRENCIES } from './zakatService';

/**
 * Sadaqah — voluntary giving, recorded privately.
 *
 * Zakat is an obligation with a calculation behind it; sadaqah is whatever you
 * gave because you wanted to. So there is no nisab here, no threshold, and no
 * rate — just what you gave, when, and what it came to.
 *
 * The amount is kept as a number and the currency as a code, never converted
 * between the two. A gift given in one currency stays in that currency, which
 * is what it actually was.
 *
 * It stays on the device. Nothing is uploaded and no account is involved.
 */

export type SadaqahEntry = {
  id: string;
  amount: number;
  /** An ISO currency code from CURRENCIES. */
  currency: string;
  /** What it was for, if you want to say. Optional on purpose. */
  note?: string;
  /** The day it was given, as YYYY-MM-DD. */
  dateKey: string;
  loggedAt: number;
};

export type SadaqahState = {
  entries: SadaqahEntry[];
  /** The currency new entries are recorded in. */
  currency: string;
};

const KEY = 'deen-sadaqah-v1';
const EMPTY: SadaqahState = { entries: [], currency: 'USD' };

let state: SadaqahState = { ...EMPTY };
const listeners = new Set<(next: SadaqahState) => void>();

function emit(next: SadaqahState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: SadaqahState) {
  emit(next);
  await writeText(KEY, JSON.stringify(next));
}

export function subscribeSadaqah(listener: (next: SadaqahState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSadaqah(): SadaqahState {
  const [value, setValue] = useState<SadaqahState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeSadaqah(setValue);
  }, []);
  return value;
}

export const sadaqahDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

/** The symbol for a code, falling back to the code itself if it is unknown. */
export function currencySymbol(code: string) {
  return CURRENCIES.find((entry) => entry.code === code)?.symbol || code;
}

export async function loadSadaqahState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    state = {
      entries: Array.isArray(saved?.entries) ? saved.entries.filter(isEntry) : [],
      currency: typeof saved?.currency === 'string' ? saved.currency : 'USD',
    };
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

const isEntry = (value: any): value is SadaqahEntry =>
  !!value &&
  typeof value.id === 'string' &&
  Number.isFinite(value.amount) &&
  typeof value.currency === 'string' &&
  typeof value.dateKey === 'string' &&
  typeof value.loggedAt === 'number';

export type SadaqahSummary = {
  /** Total given, in the chosen currency. Mixed currencies are not summed. */
  total: number;
  count: number;
  /** Given in the current calendar month. */
  thisMonth: number;
  /** Given in the current calendar year. */
  thisYear: number;
  /** The most recent gift, if any. */
  lastAt?: number;
};

export function sadaqahSummary(value: SadaqahState = state): SadaqahSummary {
  const now = new Date();
  const month = now.toISOString().slice(0, 7);
  const year = now.toISOString().slice(0, 4);
  let total = 0;
  let thisMonth = 0;
  let thisYear = 0;
  let lastAt: number | undefined;

  value.entries.forEach((entry) => {
    if (entry.currency !== value.currency) return;
    total += entry.amount;
    if (entry.dateKey.startsWith(month)) thisMonth += entry.amount;
    if (entry.dateKey.startsWith(year)) thisYear += entry.amount;
    if (lastAt === undefined || entry.loggedAt > lastAt) lastAt = entry.loggedAt;
  });

  return { total, count: value.entries.length, thisMonth, thisYear, lastAt };
}

/** Format an amount for display, with thousands separated. */
export function formatSadaqah(amount: number, currency: string) {
  const symbol = currencySymbol(currency);
  const body = amount.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${body}`;
}

/** Record a gift. Defaults to today. */
export async function logSadaqah(amount: number, note?: string, dateKey = sadaqahDayKey()) {
  if (!Number.isFinite(amount) || amount <= 0) return state;
  const entry: SadaqahEntry = {
    id: `sadaqah-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    amount,
    currency: state.currency,
    note: note?.trim() || undefined,
    dateKey,
    loggedAt: Date.now(),
  };
  await persist({ ...state, entries: [...state.entries, entry] });
  return state;
}

export async function removeSadaqah(id: string) {
  await persist({ ...state, entries: state.entries.filter((entry) => entry.id !== id) });
  return state;
}

/**
 * Change the currency new entries are recorded in.
 *
 * Past entries keep the currency they were given in — this sets the default
 * going forward, it does not convert anything.
 */
export async function setSadaqahCurrency(currency: string) {
  await persist({ ...state, currency });
  return state;
}

/** Wipe the record. */
export async function resetSadaqah() {
  await persist({ ...EMPTY, currency: state.currency });
  return state;
}
