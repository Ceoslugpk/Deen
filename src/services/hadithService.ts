import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCachedJson, listCachedKeys, setCachedJson } from './contentCache';

/**
 * Phase 3 — Hadith.
 *
 * Live source: the community hadith-api corpus (cdn.jsdelivr.net/gh/fawazahmed0/hadith-api),
 * which republishes the six major collections, the Muwatta and the three "Forty" books
 * with matched English and Arabic editions. Nothing is bundled and nothing is invented:
 * if a collection fails to load the screen says so, and if a hadith has no Arabic or no
 * grade in the source, those rows are simply absent rather than filled with placeholders.
 */

export type HadithGrade = { name: string; grade: string };

export type Hadith = {
  id: string;
  slug: string;
  number: number;
  arabicNumber: number;
  book: number;
  bookName: string;
  english: string;
  arabic: string;
  grades: HadithGrade[];
};

export type HadithBook = { number: number; name: string; first: number; last: number; count: number };

export type HadithCollection = {
  slug: string;
  name: string;
  arabicName: string;
  author: string;
  kind: string;
  graded: boolean;
};

export type HadithCollectionData = {
  slug: string;
  name: string;
  books: HadithBook[];
  hadiths: Hadith[];
  loadedAt: number;
  source: string;
  arabicReady: boolean;
};

export const HADITH_COLLECTIONS: HadithCollection[] = [
  { slug: 'bukhari', name: 'Sahih al-Bukhari', arabicName: 'صحيح البخاري', author: 'Imam al-Bukhari', kind: 'Sahih', graded: false },
  { slug: 'muslim', name: 'Sahih Muslim', arabicName: 'صحيح مسلم', author: 'Imam Muslim', kind: 'Sahih', graded: false },
  { slug: 'abudawud', name: 'Sunan Abu Dawud', arabicName: 'سنن أبي داود', author: 'Imam Abu Dawud', kind: 'Sunan', graded: true },
  { slug: 'tirmidhi', name: "Jami' at-Tirmidhi", arabicName: 'جامع الترمذي', author: 'Imam at-Tirmidhi', kind: 'Jami', graded: true },
  { slug: 'nasai', name: "Sunan an-Nasa'i", arabicName: 'سنن النسائي', author: "Imam an-Nasa'i", kind: 'Sunan', graded: true },
  { slug: 'ibnmajah', name: 'Sunan Ibn Majah', arabicName: 'سنن ابن ماجه', author: 'Imam Ibn Majah', kind: 'Sunan', graded: true },
  { slug: 'malik', name: "Muwatta Malik", arabicName: 'موطأ مالك', author: 'Imam Malik', kind: 'Muwatta', graded: true },
  { slug: 'nawawi', name: "Forty Hadith of an-Nawawi", arabicName: 'الأربعون النووية', author: 'Imam an-Nawawi', kind: 'Forty', graded: false },
  { slug: 'qudsi', name: 'Forty Hadith Qudsi', arabicName: 'الأربعون القدسية', author: 'Compiled', kind: 'Forty', graded: false },
  { slug: 'dehlawi', name: 'Forty Hadith of Shah Waliullah', arabicName: 'الأربعون لولي الله الدهلوي', author: 'Shah Waliullah Dehlawi', kind: 'Forty', graded: false },
];

export function hadithSourceLabel(rtl: boolean, slug: string): string {
  const known = HADITH_COLLECTIONS.find((collection) => collection.slug.toLowerCase() === (slug || '').toLowerCase());
  return rtl ? known?.arabicName || slug : (known?.name || slug).toUpperCase();
}

const EDITION_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
const STATE_KEY = 'hadith-state-v1';
const MEMORY_LIMIT = 3;

const memory = new Map<string, HadithCollectionData>();
const inflight = new Map<string, Promise<HadithCollectionData>>();
const arabicInflight = new Map<string, Promise<HadithCollectionData | null>>();

type RawHadith = {
  hadithnumber?: number | string;
  arabicnumber?: number | string;
  text?: string;
  grades?: HadithGrade[];
  reference?: { book?: number; hadith?: number };
};

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function arabicMap(arabic: any) {
  const map = new Map<number, string>();
  const rows: RawHadith[] = Array.isArray(arabic?.hadiths) ? arabic.hadiths : [];
  rows.forEach((row) => {
    const key = toNumber(row.hadithnumber);
    if (key && typeof row.text === 'string') map.set(key, row.text.trim());
  });
  return map;
}

/**
 * The Arabic edition is fetched separately, after the English text is already on
 * screen. A 7,000-hadith collection is several megabytes per language, and waiting
 * for both before showing anything would make the library feel broken.
 */
export async function hydrateHadithArabic(slug: string): Promise<HadithCollectionData | null> {
  const data = memory.get(slug);
  if (!data || data.arabicReady) return data || null;
  const arabic = await fetch(`${EDITION_BASE}/ara-${slug}.min.json`)
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  if (!arabic) {
    const next = { ...data, arabicReady: true };
    memory.set(slug, next);
    return next;
  }
  const map = arabicMap(arabic);
  const hadiths = data.hadiths.map((hadith) => (hadith.arabic || !map.has(hadith.number) ? hadith : { ...hadith, arabic: map.get(hadith.number) as string }));
  const next = { ...data, hadiths, arabicReady: true };
  memory.set(slug, next);
  void setCachedJson('hadith', `collection-${slug}`, next).catch(() => undefined);
  void cacheBooks(next);
  return next;
}

function mergeEditions(slug: string, english: any, arabic: any): HadithCollectionData {
  const sections: Record<string, string> = english?.metadata?.sections || {};
  const details: Record<string, any> = english?.metadata?.section_details || {};
  const englishRows: RawHadith[] = Array.isArray(english?.hadiths) ? english.hadiths : [];
  const arabicRows: RawHadith[] = Array.isArray(arabic?.hadiths) ? arabic.hadiths : [];
  const arabicByNumber = new Map<number, string>();
  arabicRows.forEach((row) => {
    const key = toNumber(row.hadithnumber);
    if (key && typeof row.text === 'string') arabicByNumber.set(key, row.text);
  });

  const hadiths: Hadith[] = [];
  englishRows.forEach((row) => {
    const number = toNumber(row.hadithnumber);
    if (!number) return;
    const text = typeof row.text === 'string' ? row.text.trim() : '';
    const arabic = (arabicByNumber.get(number) || '').trim();
    if (!text && !arabic) return;
    const book = toNumber(row.reference?.book);
    hadiths.push({
      id: `${slug}:${number}`,
      slug,
      number,
      arabicNumber: toNumber(row.arabicnumber) || number,
      book,
      bookName: sections[String(book)] || 'General',
      english: text,
      arabic,
      grades: Array.isArray(row.grades) ? row.grades.filter((grade) => grade && grade.grade) : [],
    });
  });

  const books: HadithBook[] = Object.keys(sections)
    .map((key) => toNumber(key))
    .filter((number) => number > 0)
    .sort((a, b) => a - b)
    .map((number) => {
      const detail = details[String(number)] || {};
      const first = toNumber(detail.hadithnumber_first);
      const last = toNumber(detail.hadithnumber_last);
      const count = hadiths.filter((hadith) => hadith.book === number).length || Math.max(0, last - first + 1);
      return { number, name: sections[String(number)] || `Book ${number}`, first, last, count };
    })
    .filter((book) => book.count > 0);

  return {
    slug,
    name: english?.metadata?.name || slug,
    books,
    hadiths,
    loadedAt: Date.now(),
    source: `${EDITION_BASE}/eng-${slug}.min.json`,
    arabicReady: !!arabic,
  };
}

async function cacheBooks(data: HadithCollectionData) {
  try {
    const existing = new Set(await listCachedKeys('hadith'));
    for (const book of data.books) {
      const key = `book-${data.slug}-${book.number}`;
      if (existing.has(key)) continue;
      const rows = data.hadiths.filter((hadith) => hadith.book === book.number);
      // eslint-disable-next-line no-await-in-loop
      await setCachedJson('hadith', key, { book, hadiths: rows });
    }
  } catch {
    /* caching is best effort — a failed write must not break browsing */
  }
}

export async function loadHadithCollection(slug: string, force = false): Promise<HadithCollectionData> {
  const known = HADITH_COLLECTIONS.find((collection) => collection.slug === slug);
  if (!known) throw new Error('Unknown collection');
  if (!force && memory.has(slug)) return memory.get(slug) as HadithCollectionData;
  if (!force && inflight.has(slug)) return inflight.get(slug) as Promise<HadithCollectionData>;

  const task = (async () => {
    let data: HadithCollectionData | null = null;
    if (!force) {
      const cached = await getCachedJson<HadithCollectionData>('hadith', `collection-${slug}`).catch(() => null);
      if (cached && Array.isArray(cached.hadiths) && cached.hadiths.length) data = cached;
    }
    if (!data) {
      const english = await fetch(`${EDITION_BASE}/eng-${slug}.min.json`).then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
      });
      data = mergeEditions(slug, english, null);
      if (!data.hadiths.length) throw new Error('The collection returned no hadith');
      memory.set(slug, data);
      void setCachedJson('hadith', `collection-${slug}`, data).catch(() => undefined);
      const hydration = hydrateHadithArabic(slug);
      arabicInflight.set(slug, hydration);
      void hydration.catch(() => null);
    }
    memory.set(slug, data);
    if (memory.size > MEMORY_LIMIT) {
      const oldest = [...memory.keys()].filter((key) => key !== slug).slice(0, memory.size - MEMORY_LIMIT);
      oldest.forEach((key) => memory.delete(key));
    }
    return data;
  })();

  inflight.set(slug, task);
  try {
    return await task;
  } finally {
    inflight.delete(slug);
  }
}

/** Resolves once the Arabic edition has been merged, so screens can refresh their text. */
export function whenArabicReady(slug: string): Promise<HadithCollectionData | null> {
  const pending = arabicInflight.get(slug);
  if (pending) return pending;
  const hydration = hydrateHadithArabic(slug);
  arabicInflight.set(slug, hydration);
  return hydration;
}

export async function loadBookOffline(slug: string, book: number): Promise<Hadith[] | null> {
  const cached = await getCachedJson<{ hadiths: Hadith[] }>('hadith', `book-${slug}-${book}`).catch(() => null);
  return cached && Array.isArray(cached.hadiths) ? cached.hadiths : null;
}

export type HadithPage = { rows: Hadith[]; total: number; offset: number; hasMore: boolean };

export function getHadithPage(data: HadithCollectionData, options: { book?: number | null; query?: string; offset?: number; limit?: number }): HadithPage {
  const { book = null, query = '', offset = 0, limit = 20 } = options;
  const needle = query.trim().toLowerCase();
  const pool = data.hadiths.filter((hadith) => {
    if (book !== null && hadith.book !== book) return false;
    if (!needle) return true;
    return (
      hadith.english.toLowerCase().includes(needle) ||
      hadith.arabic.includes(needle) ||
      hadith.bookName.toLowerCase().includes(needle) ||
      String(hadith.number) === needle ||
      String(hadith.arabicNumber) === needle
    );
  });
  const rows = pool.slice(offset, offset + limit);
  return { rows, total: pool.length, offset, hasMore: offset + rows.length < pool.length };
}

/** Collections already fetched this session — the only ones a cross-collection search can cover. */
export function getLoadedCollections(): HadithCollectionData[] {
  return [...memory.values()];
}

export function searchLoadedCollections(query: string, limit = 40): Hadith[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 3) return [];
  const rows: Hadith[] = [];
  getLoadedCollections().forEach((data) => {
    data.hadiths.forEach((hadith) => {
      if (rows.length >= limit) return;
      if (hadith.english.toLowerCase().includes(needle) || hadith.arabic.includes(needle) || hadith.bookName.toLowerCase().includes(needle)) rows.push(hadith);
    });
  });
  return rows;
}

export function getHadith(data: HadithCollectionData, number: number): Hadith | undefined {
  return data.hadiths.find((hadith) => hadith.number === number);
}

export function getNeighbours(data: HadithCollectionData, number: number) {
  const index = data.hadiths.findIndex((hadith) => hadith.number === number);
  if (index < 0) return { previous: undefined, next: undefined };
  return { previous: data.hadiths[index - 1], next: data.hadiths[index + 1] };
}

/* ---------------------------------------------------------------- state */

export type HadithBookmark = {
  id: string;
  slug: string;
  collection: string;
  number: number;
  book: number;
  bookName: string;
  preview: string;
  savedAt: number;
};

export type HadithUserState = {
  saved: HadithBookmark[];
  recent: { slug: string; number: number; readAt: number }[];
  read: Record<string, number[]>;
  totals: Record<string, number>;
};

export const EMPTY_HADITH_STATE: HadithUserState = { saved: [], recent: [], read: {}, totals: {} };

let state: HadithUserState = EMPTY_HADITH_STATE;
const listeners = new Set<(next: HadithUserState) => void>();

function emit(next: HadithUserState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

export function getHadithState() {
  return state;
}

export function subscribeHadith(listener: (next: HadithUserState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function loadHadithState() {
  try {
    const raw = await AsyncStorage.getItem(STATE_KEY);
    state = raw ? { ...EMPTY_HADITH_STATE, ...JSON.parse(raw) } : EMPTY_HADITH_STATE;
  } catch {
    state = EMPTY_HADITH_STATE;
  }
  listeners.forEach((listener) => listener(state));
  return state;
}

async function persist(next: HadithUserState) {
  emit(next);
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(next)).catch(() => undefined);
}

export function useHadithState(): HadithUserState {
  const [value, setValue] = useState<HadithUserState>(state);
  useEffect(() => {
    const unsubscribe = subscribeHadith(setValue);
    return () => {
      unsubscribe();
    };
  }, []);
  return value;
}

export function isHadithSaved(slug: string, number: number) {
  return state.saved.some((item) => item.slug === slug && item.number === number);
}

export function hadithReference(collection: HadithCollection | undefined, hadith: Hadith) {
  return `${collection?.name || hadith.slug} · ${hadith.book ? `Book ${hadith.book}, ` : ''}Hadith ${hadith.number}`;
}

export async function toggleHadithSaved(collection: HadithCollection, hadith: Hadith) {
  const exists = isHadithSaved(hadith.slug, hadith.number);
  const saved = exists
    ? state.saved.filter((item) => !(item.slug === hadith.slug && item.number === hadith.number))
    : [
        {
          id: hadith.id,
          slug: hadith.slug,
          collection: collection.name,
          number: hadith.number,
          book: hadith.book,
          bookName: hadith.bookName,
          preview: (hadith.english || hadith.arabic).replace(/\s+/g, ' ').slice(0, 220),
          savedAt: Date.now(),
        },
        ...state.saved,
      ].slice(0, 300);
  await persist({ ...state, saved });
}

export async function markHadithRead(slug: string, number: number, total: number) {
  const read = { ...state.read };
  const rows = read[slug] || [];
  if (!rows.includes(number)) read[slug] = [...rows, number].slice(-8000);
  const recent = [{ slug, number, readAt: Date.now() }, ...state.recent.filter((item) => !(item.slug === slug && item.number === number))].slice(0, 40);
  await persist({ ...state, read, recent, totals: { ...state.totals, [slug]: total } });
}

export async function removeHadithBookmark(id: string) {
  await persist({ ...state, saved: state.saved.filter((item) => item.id !== id) });
}

export function hadithProgress(slug: string) {
  const total = state.totals[slug] || 0;
  const read = (state.read[slug] || []).length;
  return { read, total, percent: total ? Math.min(100, Math.round((read / total) * 100)) : 0 };
}
