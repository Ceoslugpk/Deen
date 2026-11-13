import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeText } from './storage';
import { useEffect, useState } from 'react';
import mushaf from '../data/mushaf-pages.json';

/**
 * Khatam — how many times you have completed the Qur'an, and how far you are
 * through the one you are reading now.
 *
 * Everything here is computed on the device from a list of page numbers.
 * Nothing is sent anywhere, and there is no account to send it to.
 *
 * Progress is counted in pages rather than verses or surahs because that is
 * the shape of the book people actually read: the Madinah Mushaf is 604 pages,
 * and a sitting is measured in pages. The page numbers here are the same ones
 * the reader already uses, so a page marked read in one place is read in the
 * other.
 */

/** The Madinah Mushaf. Fixed, and the source of the page count below. */
export const TOTAL_PAGES = Object.keys(mushaf.pages).length;

export type KhatamCycle = {
  id: string;
  /** When this reading of the Qur'an began. */
  startedAt: number;
  /** When the last page was reached. */
  completedAt: number;
};

export type KhatamState = {
  /** Pages reached in the current cycle, 1..604. */
  readPages: number[];
  /** When the current cycle began. */
  cycleStartedAt: number;
  /** Finished readings, oldest first. */
  cycles: KhatamCycle[];
};

const KEY = 'deen-khatam-v1';
const EMPTY: KhatamState = { readPages: [], cycleStartedAt: Date.now(), cycles: [] };

let state: KhatamState = { ...EMPTY };
const listeners = new Set<(next: KhatamState) => void>();

function emit(next: KhatamState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: KhatamState) {
  emit(next);
  await writeText(KEY, JSON.stringify(next));
}

export function subscribeKhatam(listener: (next: KhatamState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useKhatam(): KhatamState {
  const [value, setValue] = useState<KhatamState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeKhatam(setValue);
  }, []);
  return value;
}

export async function loadKhatamState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    state = {
      readPages: Array.isArray(saved?.readPages) ? saved.readPages.filter(isPage) : [],
      cycleStartedAt: typeof saved?.cycleStartedAt === 'number' ? saved.cycleStartedAt : Date.now(),
      cycles: Array.isArray(saved?.cycles) ? saved.cycles.filter(isCycle) : [],
    };
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}

const isPage = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= TOTAL_PAGES;

const isCycle = (value: any): value is KhatamCycle =>
  !!value && typeof value.id === 'string' && typeof value.startedAt === 'number';

export type KhatamSummary = {
  read: number;
  total: number;
  percent: number;
  remaining: number;
  /** How many times the Qur'an has been completed. */
  completed: number;
  /** Whole days since the current cycle began. */
  daysElapsed: number;
  /** The day the current cycle began. */
  startedAt: number;
  /** True when every page has been reached in the current cycle. */
  isComplete: boolean;
};

export function khatamSummary(value: KhatamState = state): KhatamSummary {
  const read = value.readPages.length;
  const total = TOTAL_PAGES;
  return {
    read,
    total,
    percent: total ? Math.round((read / total) * 100) : 0,
    remaining: Math.max(0, total - read),
    completed: value.cycles.length,
    daysElapsed: Math.max(0, Math.floor((Date.now() - value.cycleStartedAt) / 86400000)),
    startedAt: value.cycleStartedAt,
    isComplete: read >= total,
  };
}

/** Whether a given page has been reached in the current cycle. */
export function isPageRead(page: number, value: KhatamState = state) {
  return value.readPages.includes(page);
}

/**
 * Record that a page has been read.
 *
 * Reaches the end of the book and the cycle closes on its own: it is filed in
 * the history and a fresh one begins with an empty page list. Nothing is lost
 * — the completed reading stays in `cycles`.
 */
export async function markPageRead(page: number) {
  if (!isPage(page)) return state;
  if (state.readPages.includes(page)) return state;
  const readPages = [...state.readPages, page];

  if (readPages.length >= TOTAL_PAGES) {
    const finished: KhatamCycle = {
      id: `cycle-${Date.now()}`,
      startedAt: state.cycleStartedAt,
      completedAt: Date.now(),
    };
    await persist({
      readPages: [],
      cycleStartedAt: Date.now(),
      cycles: [...state.cycles, finished],
    });
    return state;
  }

  await persist({ ...state, readPages });
  return state;
}

/**
 * Record several pages at once — used when a stretch is marked in one go.
 *
 * Closing the cycle is handled here rather than handed to `markPageRead`:
 * that function ignores a page it already holds, and a bulk fill will always
 * hold the last page by the time it reaches the end. Delegating would leave
 * a finished reading sitting at 604 of 604 and never filed.
 */
export async function markPagesRead(pages: number[]) {
  const valid = pages.filter(isPage);
  if (!valid.length) return state;
  const merged = Array.from(new Set([...state.readPages, ...valid]));

  if (merged.length >= TOTAL_PAGES) {
    const finished: KhatamCycle = {
      id: `cycle-${Date.now()}`,
      startedAt: state.cycleStartedAt,
      completedAt: Date.now(),
    };
    await persist({
      readPages: [],
      cycleStartedAt: Date.now(),
      cycles: [...state.cycles, finished],
    });
    return state;
  }

  await persist({ ...state, readPages: merged });
  return state;
}

/** Take a page back, for when something was marked by mistake. */
export async function unmarkPage(page: number) {
  await persist({ ...state, readPages: state.readPages.filter((item) => item !== page) });
  return state;
}

/**
 * Begin the current reading again from the first page.
 *
 * Finished readings are never touched — this only clears the pages of the
 * cycle in progress.
 */
export async function resetKhatamCycle() {
  await persist({ ...state, readPages: [], cycleStartedAt: Date.now() });
  return state;
}

/** Fill every page — for someone who completed a reading before installing. */
export async function completeKhatamCycle() {
  const finished: KhatamCycle = {
    id: `cycle-${Date.now()}`,
    startedAt: state.cycleStartedAt,
    completedAt: Date.now(),
  };
  await persist({
    readPages: [],
    cycleStartedAt: Date.now(),
    cycles: [...state.cycles, finished],
  });
  return state;
}

/** Drop a finished reading from the history. */
export async function removeKhatamCycle(id: string) {
  await persist({ ...state, cycles: state.cycles.filter((cycle) => cycle.id !== id) });
  return state;
}

/** The pages that make up a juz, for anyone wanting to track by juz. */
export function pagesForSurah(surahId: number): number[] {
  const pages = (mushaf.pages || {}) as Record<string, { surah: number }>;
  return Object.keys(pages)
    .filter((page) => pages[page]?.surah === surahId)
    .map(Number)
    .sort((a, b) => a - b);
}
