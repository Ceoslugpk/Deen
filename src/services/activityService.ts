import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 3 — weekly summaries.
 *
 * A small, private, on-device record of what a person actually did: which verses
 * they marked, which Surahs and Mushaf pages they opened, how often they tested
 * their memorisation, and how much dhikr they counted. Salah completion and Tasbih
 * totals already live in their own stores, so this only holds what nothing else
 * records — and it keeps 30 days, which is all a weekly review can show.
 *
 * Nothing here leaves the device and no account is involved.
 */

/** The language the week is written in, so the summary reads in Arabic too. */
let dateLocale: string | undefined;
export function setActivityDateLocale(code?: string) {
  dateLocale = code;
}

export type ActivityDay = {
  date: string;
  verses: string[];
  surahs: number[];
  pages: number[];
  hifz: number;
};

export type WeekRow = {
  key: string;
  date: Date;
  label: string;
  short: string;
  prayers: number;
  verses: number;
  surahs: number;
  pages: number;
  hifz: number;
  dhikr: number;
};

export type WeeklySummary = {
  rows: WeekRow[];
  totals: { prayers: number; verses: number; surahs: number; pages: number; hifz: number; dhikr: number };
  prayerStreak: number;
  activeStreak: number;
  bestDay: WeekRow | null;
};

const KEY = 'deen-activity-v1';
const KEEP_DAYS = 30;
const MAX_VERSES = 400;

let activity: Record<string, ActivityDay> = {};
const listeners = new Set<(next: Record<string, ActivityDay>) => void>();

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

function emit(next: Record<string, ActivityDay>) {
  activity = next;
  listeners.forEach((listener) => listener(activity));
}

async function persist(next: Record<string, ActivityDay>) {
  const keys = Object.keys(next).sort();
  const trimmed: Record<string, ActivityDay> = {};
  keys.slice(-KEEP_DAYS).forEach((key) => {
    trimmed[key] = next[key];
  });
  emit(trimmed);
  await AsyncStorage.setItem(KEY, JSON.stringify(trimmed)).catch(() => undefined);
}


export function subscribeActivity(listener: (next: Record<string, ActivityDay>) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActivity(): Record<string, ActivityDay> {
  const [value, setValue] = useState<Record<string, ActivityDay>>(activity);
  useEffect(() => {
    setValue(activity);
    return subscribeActivity(setValue);
  }, []);
  return value;
}

export async function loadActivity() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    activity = raw ? JSON.parse(raw) : {};
  } catch {
    activity = {};
  }
  emit(activity);
  return activity;
}

function blank(date = dayKey()): ActivityDay {
  return { date, verses: [], surahs: [], pages: [], hifz: 0 };
}

/** Opens (or reuses) today's record, applies the change, and saves it. */
async function record(change: (day: ActivityDay) => ActivityDay) {
  if (!Object.keys(activity).length && !(await AsyncStorage.getItem(KEY))) await loadActivity().catch(() => undefined);
  const key = dayKey();
  const current = activity[key] || blank(key);
  const next = change(current);
  await persist({ ...activity, [key]: next });
  return next;
}

export function logVerseRead(verseKey: string, surahId: number, page?: number) {
  return record((day) => {
    const verses = day.verses.includes(verseKey) ? day.verses : [...day.verses, verseKey].slice(-MAX_VERSES);
    const surahs = day.surahs.includes(surahId) ? day.surahs : [...day.surahs, surahId].slice(-114);
    const pages = page && !day.pages.includes(page) ? [...day.pages, page].slice(-60) : day.pages;
    return { ...day, verses, surahs, pages };
  }).catch(() => blank());
}

export function logSurahOpen(surahId: number) {
  return record((day) => ({
    ...day,
    surahs: day.surahs.includes(surahId) ? day.surahs : [...day.surahs, surahId].slice(-114),
  })).catch(() => blank());
}

export function logMushafPage(page: number) {
  return record((day) => ({
    ...day,
    pages: day.pages.includes(page) ? day.pages : [...day.pages, page].slice(-60),
  })).catch(() => blank());
}

export function logHifzReview() {
  return record((day) => ({ ...day, hifz: day.hifz + 1 })).catch(() => blank());
}

/**
 * Builds the last seven days from every local store: prayer completion, the
 * reading record kept here, and the Tasbih totals.
 */
export function buildWeeklySummary(options: {
  activity?: Record<string, ActivityDay>;
  prayerHistory?: Record<string, string[]>;
  tasbihDays?: Record<string, number>;
  days?: number;
} = {}): WeeklySummary {
  const { activity: log = activity, prayerHistory = {}, tasbihDays = {}, days = 7 } = options;
  const rows: WeekRow[] = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - ((days - 1) - index));
    const key = dayKey(date);
    const entry = log[key];
    return {
      key,
      date,
      label: date.toLocaleDateString(dateLocale, { weekday: 'long' }),
      short: date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' }),
      prayers: (prayerHistory[key] || []).length,
      verses: entry?.verses.length || 0,
      surahs: entry?.surahs.length || 0,
      pages: entry?.pages.length || 0,
      hifz: entry?.hifz || 0,
      dhikr: tasbihDays[key] || 0,
    };
  });

  const totals = rows.reduce(
    (sum, row) => ({
      prayers: sum.prayers + row.prayers,
      verses: sum.verses + row.verses,
      surahs: sum.surahs + row.surahs,
      pages: sum.pages + row.pages,
      hifz: sum.hifz + row.hifz,
      dhikr: sum.dhikr + row.dhikr,
    }),
    { prayers: 0, verses: 0, surahs: 0, pages: 0, hifz: 0, dhikr: 0 },
  );

  let prayerStreak = 0;
  let activeStreak = 0;
  for (let i = 0; i < 60; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    const prayers = (prayerHistory[key] || []).length >= 5;
    const active = (prayerHistory[key] || []).length > 0 || (log[key]?.verses.length || 0) > 0 || (log[key]?.pages.length || 0) > 0 || (log[key]?.hifz || 0) > 0 || (tasbihDays[key] || 0) > 0;
    if (prayers) prayerStreak += 1;
    else if (i > 0) break;
    if (active) activeStreak += 1;
    else if (i > 0) break;
  }

  const bestDay = rows.reduce<WeekRow | null>((best, row) => (!best || row.prayers + row.verses > best.prayers + best.verses ? row : best), null);
  return { rows, totals, prayerStreak, activeStreak, bestDay };
}
