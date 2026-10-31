import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCachedJson, listCachedKeys, setCachedJson } from './contentCache';
import {
  getHadithBook, getHadithCollection, HadithBook as WorkerBook,
  HadithRecord, ISLAMIC_DATA_BASE_URL,
} from './islamicDataApi';

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

const STATE_KEY = 'hadith-state-v1';
const MEMORY_LIMIT = 3;

const memory = new Map<string, HadithCollectionData>();
const inflight = new Map<string, Promise<HadithCollectionData>>();
const arabicInflight = new Map<string, Promise<HadithCollectionData | null>>();

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * No longer a second fetch.
 *
 * The old source published Arabic and English as two separate files, so the
 * Arabic text had to be downloaded after the English was already on screen.
 * The app's own server returns both languages in one record, so by the time
 * anything is on screen the Arabic is already with it.
 *
 * Kept as a function because the screens still ask for it, and answering
 * "already done" is cheaper than teaching every caller a new shape.
 */
export async function hydrateHadithArabic(slug: string): Promise<HadithCollectionData | null> {
  const data = memory.get(slug);
  if (!data) return null;
  if (data.arabicReady) return data;
  const next = { ...data, arabicReady: true };
  memory.set(slug, next);
  return next;
}

/**
 * One record from the app's own server, in the shape this service uses.
 *
 * The two sources disagree about where the Arabic lives. Ours returns the
 * Arabic in `arabic` and the English in `text` when asked for English - so one
 * request carries both, which is why nothing here fetches a second language.
 */
function toHadith(slug: string, row: HadithRecord, fallbackBookName: string | null): Hadith {
  const number = toNumber(row.number);
  return {
    id: `${slug}:${number}`,
    slug,
    number,
    arabicNumber: toNumber(row.arabicNumber) || number,
    book: toNumber(row.book),
    /* Three collections - Bukhari, Nasai, Malik - carry an unnamed book 0 for
       narrations the source never filed. Naming it beats printing a blank. */
    bookName: (row.bookTitle || '').trim() || (fallbackBookName || '').trim() || 'General',
    english: typeof row.text === 'string' ? row.text.trim() : '',
    arabic: typeof row.arabic === 'string' ? row.arabic.trim() : '',
    grades: Array.isArray(row.grades) ? row.grades.filter((grade) => grade && grade.grade) : [],
  };
}

/**
 * Every hadith in one book, paged through the Worker.
 *
 * The server caps a page at 100 records and says how many are left, so a long
 * book is read in as many pages as it takes. Pages already on the device are
 * used as they are: a person reopening a collection should not re-download
 * what they already have.
 */
async function fetchBook(slug: string, book: WorkerBook, force: boolean): Promise<Hadith[]> {
  const cacheKey = `book-${slug}-${book.number}`;
  if (!force) {
    const cached = await getCachedJson<{ hadiths: Hadith[] }>('hadith', cacheKey).catch(() => null);
    if (cached && Array.isArray(cached.hadiths) && cached.hadiths.length) return cached.hadiths;
  }

  const rows: Hadith[] = [];
  const limit = 100;
  let offset = 0;
  for (;;) {
    /* eslint-disable no-await-in-loop */
    const page = await getHadithBook(slug, book.number, { language: 'en', limit, offset });
    page.hadiths.forEach((row) => rows.push(toHadith(slug, row, book.name)));
    if (!page.page?.hasMore || page.hadiths.length === 0) break;
    offset += page.hadiths.length;
    /* A server that reports hasMore but returns nothing would spin forever. */
    if (offset > 20000) break;
  }

  if (rows.length) void setCachedJson('hadith', cacheKey, { book, hadiths: rows }).catch(() => undefined);
  return rows;
}

/** How many books are read at once. Enough to be quick, few enough to be polite. */
const BOOK_CONCURRENCY = 4;

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
      const detail = await getHadithCollection(slug, 'en');
      const books = (detail.books || []).filter((book) => book && typeof book.number === 'number');
      if (!books.length) throw new Error('The collection listed no books');

      const hadiths: Hadith[] = [];
      /* Bounded rather than all at once: Bukhari is 98 books, and firing every
         one at the server at the same time is how a phone on a weak connection
         ends up waiting on all of them. */
      for (let i = 0; i < books.length; i += BOOK_CONCURRENCY) {
        const slice = books.slice(i, i + BOOK_CONCURRENCY);
        // eslint-disable-next-line no-await-in-loop
        const groups = await Promise.all(
          slice.map((book) => fetchBook(slug, book, force).catch(() => [] as Hadith[])),
        );
        groups.forEach((group) => group.forEach((row) => hadiths.push(row)));
      }
      if (!hadiths.length) throw new Error('The collection returned no hadith');

      /* Source order, not arrival order - the books finish in whatever order
         the network delivers them. */
      const bookOrder = new Map(books.map((book, index) => [book.number, index]));
      hadiths.sort(
        (a, b) =>
          (bookOrder.get(a.book) ?? 0) - (bookOrder.get(b.book) ?? 0) || a.number - b.number,
      );

      data = {
        slug,
        name: detail.collection?.name || known.name || slug,
        books: books.map((book) => ({ ...book, name: book.name || 'General' })),
        hadiths,
        loadedAt: Date.now(),
        source: `${ISLAMIC_DATA_BASE_URL}/hadith/collections/${slug}`,
        arabicReady: true,
      };
      void setCachedJson('hadith', `collection-${slug}`, data).catch(() => undefined);
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
