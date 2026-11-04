import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCachedJson, listCachedKeys, setCachedJson } from './contentCache';
import { hadithLanguage } from './languages';
import {
  /* `getHadith` already names the local lookup at the bottom of this file, so
     the network call is imported under the name the API gives it. */
  getHadith as getHadithRecord, getHadithBook, getHadithCollection, getHadithCollections,
  HadithBook as WorkerBook, HadithRecord, IslamicDataError, ISLAMIC_DATA_BASE_URL,
} from './islamicDataApi';

/**
 * Phase 3 — Hadith.
 *
 * Live source: api.islamicdata.uz, our own server, which republishes the six
 * major collections, the Muwatta and the three "Forty" books with matched
 * English and Arabic editions. Nothing is bundled and nothing is invented: if a
 * collection fails to load the screen says so, and if a hadith has no Arabic or
 * no grade in the source, those rows are simply absent rather than filled with
 * placeholders.
 *
 * Reading is on demand. Opening a collection costs one request for its book
 * list, opening a book costs one request, opening a hadith costs one request.
 * The whole collection is only fetched whole when someone asks for it, via
 * `downloadCollection` — the app never downloads 7,589 narrations to let a
 * person read one of them.
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
  /* Which language these narrations are actually written in, which is not
     always the one that was asked for: a collection with no Urdu edition
     answers in English rather than in nothing. */
  lang?: string;
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
async function fetchBook(
  slug: string,
  book: WorkerBook,
  force: boolean,
  language: string = DEFAULT_HADITH_LANGUAGE,
): Promise<Hadith[]> {
  const cacheKey = `book-${slug}-${language}-${book.number}`;
  if (!force) {
    const cached = await getCachedJson<{ hadiths: Hadith[] }>('hadith', cacheKey).catch(() => null);
    if (cached && Array.isArray(cached.hadiths) && cached.hadiths.length) return cached.hadiths;
  }

  const rows: Hadith[] = [];
  const limit = 100;
  let offset = 0;
  for (;;) {
    /* eslint-disable no-await-in-loop */
    const page = await getHadithBook(slug, book.number, { language, limit, offset });
    page.hadiths.forEach((row) => rows.push(toHadith(slug, row, book.name)));
    if (!page.page?.hasMore || page.hadiths.length === 0) break;
    offset += page.hadiths.length;
    /* A server that reports hasMore but returns nothing would spin forever. */
    if (offset > 20000) break;
  }

  if (rows.length) void setCachedJson('hadith', cacheKey, { book, lang: language, hadiths: rows }).catch(() => undefined);
  return rows;
}

/* ==================== Which language ==================== */

const HADITH_LANG_KEY = 'hadith:language-v1';
export const DEFAULT_HADITH_LANGUAGE = 'en';

const languageListeners = new Set<() => void>();
let currentLanguage: string = DEFAULT_HADITH_LANGUAGE;
let languageHydrated = false;

export function getHadithLanguage(): string {
  return currentLanguage;
}

export async function loadHadithLanguage(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(HADITH_LANG_KEY);
    if (stored && hadithLanguage(stored)) currentLanguage = stored;
  } catch { /* first run, or storage unavailable */ }
  languageHydrated = true;
  languageListeners.forEach((listener) => listener());
  return currentLanguage;
}

export async function setHadithLanguage(code: string): Promise<void> {
  if (!hadithLanguage(code)) return;
  currentLanguage = code;
  await AsyncStorage.setItem(HADITH_LANG_KEY, code).catch(() => undefined);
  languageListeners.forEach((listener) => listener());
}

export function useHadithLanguage(): string {
  const [code, setCode] = useState(getHadithLanguage());
  useEffect(() => {
    if (!languageHydrated) void loadHadithLanguage();
    const off = subscribeHadithLanguage(() => setCode(getHadithLanguage()));
    return off;
  }, []);
  return code;
}

export function subscribeHadithLanguage(listener: () => void) {
  languageListeners.add(listener);
  return () => { languageListeners.delete(listener); };
}

/**
 * Which languages a collection actually carries.
 *
 * Coverage is per-collection and uneven — Arabic and English reach all ten,
 * Russian only three, Tamil two — so this is read from the server's own
 * catalogue rather than assumed from a global list.
 */
const languageMemory = new Map<string, string[]>();

export async function collectionLanguages(slug: string): Promise<string[]> {
  if (languageMemory.has(slug)) return languageMemory.get(slug) as string[];
  try {
    const all = await getHadithCollections();
    all.forEach((entry: any) => {
      if (entry?.slug && Array.isArray(entry.languages)) {
        languageMemory.set(entry.slug, entry.languages);
      }
    });
  } catch { /* the catalogue is optional; a miss just means "assume yes" */ }
  return languageMemory.get(slug) || [];
}

/**
 * The language to actually ask the server for.
 *
 * A collection that has no edition in the chosen language answers 404, so the
 * request is made in English instead and `fellBack` is set, which is how the
 * screen knows to say so rather than silently showing the wrong tongue.
 */
async function resolveLanguage(slug: string, wanted: string): Promise<{ lang: string; fellBack: boolean }> {
  if (wanted === 'en') return { lang: 'en', fellBack: false };
  const available = await collectionLanguages(slug);
  /* No catalogue means no knowledge, and guessing costs a 404 - so ask for
     what was wanted and let the caller handle the miss. */
  if (!available.length) return { lang: wanted, fellBack: false };
  return available.includes(wanted) ? { lang: wanted, fellBack: false } : { lang: 'en', fellBack: true };
}

/* ==================== Reading on demand ==================== */

const outlineMemory = new Map<string, HadithOutline>();

export type HadithOutline = {
  slug: string;
  name: string;
  books: HadithBook[];
  loadedAt: number;
  source: string;
  /** The language the contents were fetched in. */
  lang: string;
  /** True when the wanted language was missing and English was used instead. */
  fellBack: boolean;
  /** Every language this collection publishes, for the picker to grey out. */
  available: string[];
  /** Narrations in this language - editions disagree slightly on the total. */
  total: number;
};

/**
 * The shape of a collection: its books, and how many narrations each holds.
 *
 * One request, whatever the size of the collection. This is what lets the
 * reader open Bukhari without waiting on 7,589 narrations — the numbers are
 * the table of contents, not the contents.
 */
export async function loadHadithOutline(
  slug: string,
  language: string = DEFAULT_HADITH_LANGUAGE,
  force = false,
): Promise<HadithOutline> {
  const known = HADITH_COLLECTIONS.find((collection) => collection.slug === slug);
  if (!known) throw new Error('Unknown collection');
  const { lang, fellBack } = await resolveLanguage(slug, language);
  const cacheSlug = `${slug}:${lang}`;
  if (!force && outlineMemory.has(cacheSlug)) return outlineMemory.get(cacheSlug) as HadithOutline;

  const key = `outline-${slug}-${lang}`;
  if (!force) {
    const cached = await getCachedJson<HadithOutline>('hadith', key).catch(() => null);
    if (cached && Array.isArray(cached.books) && cached.books.length) {
      outlineMemory.set(cacheSlug, cached);
      return cached;
    }
  }

  const detail = await getHadithCollection(slug, lang);
  const books: HadithBook[] = (detail.books || [])
    .filter((book: any) => book && typeof book.number === 'number')
    .map((book: any) => ({
      number: book.number,
      name: book.name || 'General',
      first: Number(book.first ?? 0),
      last: Number(book.last ?? 0),
      count: Number(book.count ?? 0),
    }))
    .filter((book: HadithBook) => book.count > 0);
  if (!books.length) throw new Error('The collection listed no books');

  const available = await collectionLanguages(slug);
  const counts: Record<string, number> = (detail as any)?.counts || {};
  /* Editions disagree on the total - Russian Bukhari has one narration more
     than English - so the count is taken for the language actually in hand. */
  const total = counts[lang] || books.reduce((sum, entry) => sum + entry.count, 0);
  const outline: HadithOutline = {
    slug,
    name: detail.collection?.name || known.name || slug,
    books,
    loadedAt: Date.now(),
    source: `${ISLAMIC_DATA_BASE_URL}/hadith/collections/${slug}`,
    lang,
    fellBack,
    available,
    total,
  };
  outlineMemory.set(cacheSlug, outline);
  void setCachedJson('hadith', key, outline).catch(() => undefined);
  return outline;
}

/**
 * One book's narrations, read only when that book is opened.
 *
 * Cached per book, so reading a book a second time costs nothing, and a book
 * that was pulled down for offline use is not fetched again.
 */
export async function loadHadithBook(
  slug: string,
  bookNumber: number,
  language: string = DEFAULT_HADITH_LANGUAGE,
  force = false,
): Promise<Hadith[]> {
  const { lang } = await resolveLanguage(slug, language);
  const key = `book-${slug}-${lang}-${bookNumber}`;
  if (!force) {
    const cached = await getCachedJson<{ hadiths: Hadith[] }>('hadith', key).catch(() => null);
    if (cached && Array.isArray(cached.hadiths) && cached.hadiths.length) return cached.hadiths;
  }

  const outline = await loadHadithOutline(slug, lang).catch(() => null);
  const bookName = outline?.books.find((book) => book.number === bookNumber)?.name || 'General';

  const rows: Hadith[] = [];
  const limit = 100;
  let offset = 0;
  for (;;) {
    /* eslint-disable no-await-in-loop */
    const page = await getHadithBook(slug, bookNumber, { language: lang, limit, offset });
    page.hadiths.forEach((row) => rows.push(toHadith(slug, row, bookName)));
    if (!page.page?.hasMore || page.hadiths.length === 0) break;
    offset += page.hadiths.length;
    /* A server that reports hasMore but returns nothing would spin forever. */
    if (offset > 20000) break;
  }

  if (rows.length) void setCachedJson('hadith', key, { bookNumber, lang, hadiths: rows }).catch(() => undefined);
  return rows;
}

/**
 * One hadith by its number, with the ambiguity resolved.
 *
 * Numbers repeat within a collection — the same number appears once per book
 * in some editions. The server answers 409 and lists the readings it can see,
 * so the retry is not a guess: it asks again with the first reading offered.
 * Silently returning the wrong narration would be worse than failing, so if no
 * reading is offered we let the error stand.
 */
export async function fetchHadithOne(
  slug: string,
  number: number,
  language: string = DEFAULT_HADITH_LANGUAGE,
  disambiguate?: { book?: number; occurrence?: number },
): Promise<Hadith> {
  const { lang } = await resolveLanguage(slug, language);
  const key = `one-${slug}-${lang}-${number}-${disambiguate?.book ?? 'x'}-${disambiguate?.occurrence ?? 'x'}`;
  if (!disambiguate) {
    const cached = await getCachedJson<{ hadith: Hadith }>('hadith', key).catch(() => null);
    if (cached?.hadith) return cached.hadith;
  }

  let record: HadithRecord;
  try {
    record = await getHadithRecord(slug, number, { language: lang, ...disambiguate });
  } catch (error) {
    const ambiguous = error instanceof IslamicDataError && error.kind === 'ambiguous';
    const first = ambiguous ? (error.matches || [])[0] : undefined;
    if (!first) throw error;
    record = await getHadithRecord(slug, number, {
      language: lang,
      book: first.book,
      occurrence: first.occurrence,
    });
  }

  const outline = await loadHadithOutline(slug, lang).catch(() => null);
  const bookName = outline?.books.find((book) => book.number === record.book)?.name || null;
  const hadith = toHadith(slug, record, bookName);
  void setCachedJson('hadith', key, { hadith }).catch(() => undefined);
  return hadith;
}

/** How many books are read at once. Enough to be quick, few enough to be polite. */
const BOOK_CONCURRENCY = 4;

export async function loadHadithCollection(
  slug: string,
  force = false,
  language: string = DEFAULT_HADITH_LANGUAGE,
): Promise<HadithCollectionData> {
  const known = HADITH_COLLECTIONS.find((collection) => collection.slug === slug);
  if (!known) throw new Error('Unknown collection');
  if (!force && memory.has(slug)) return memory.get(slug) as HadithCollectionData;
  if (!force && inflight.has(slug)) return inflight.get(slug) as Promise<HadithCollectionData>;

  const task = (async () => {
    /* Ask in the language the collection actually has.

       Three of the ten collections carry no Urdu at all, and three carry no
       Turkish, so asking them in those languages answers with nothing and
       the book opens empty. It looks like missing content and it reads as a
       bug in the app rather than a gap in the source. The outline already
       resolved this before asking; the collection did not, which is why a
       book could look empty here and full on the screen behind it. */
    const { lang } = await resolveLanguage(slug, language);
    let data: HadithCollectionData | null = null;
    if (!force) {
      const cached = await getCachedJson<HadithCollectionData>('hadith', `collection-${slug}`).catch(() => null);
      if (cached && Array.isArray(cached.hadiths) && cached.hadiths.length) data = cached;
    }
    if (!data) {
      const detail = await getHadithCollection(slug, lang);
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
          slice.map((book) => fetchBook(slug, book, force, lang).catch(() => [] as Hadith[])),
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
        lang,
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

export async function loadBookOffline(
  slug: string,
  book: number,
  language: string = DEFAULT_HADITH_LANGUAGE,
): Promise<Hadith[] | null> {
  const cached = await getCachedJson<{ hadiths: Hadith[] }>('hadith', `book-${slug}-${language}-${book}`).catch(() => null);
  return cached && Array.isArray(cached.hadiths) ? cached.hadiths : null;
}

/* ==================== Downloading for offline ==================== */

export type DownloadPhase = 'idle' | 'listing' | 'downloading' | 'done' | 'error';
export type DownloadProgress = { phase: DownloadPhase; booksDone: number; booksTotal: number; error?: string };

const DOWNLOAD_MARKER = 'downloaded-v1';
const downloadListeners = new Set<() => void>();
let downloadProgress: Record<string, DownloadProgress> = {};

export function subscribeHadithDownloads(listener: () => void) {
  downloadListeners.add(listener);
  return () => downloadListeners.delete(listener);
}
function emitDownloads() {
  downloadListeners.forEach((listener) => listener());
}
function setProgress(slug: string, next: DownloadProgress) {
  downloadProgress = { ...downloadProgress, [slug]: next };
  emitDownloads();
}
export function hadithDownloadProgress(slug: string): DownloadProgress {
  return downloadProgress[slug] || { phase: 'idle', booksDone: 0, booksTotal: 0 };
}

/** Which collections are already complete on the device. */
export async function downloadedCollections(): Promise<Record<string, { at: number; count: number }>> {
  try {
    const raw = await AsyncStorage.getItem(`hadith:${DOWNLOAD_MARKER}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useDownloadedCollections(): Record<string, { at: number; count: number }> {
  const [state, setState] = useState<Record<string, { at: number; count: number }>>({});
  useEffect(() => {
    let alive = true;
    void downloadedCollections().then((next) => alive && setState(next));
    return subscribeHadithDownloads(() => {
      void downloadedCollections().then((next) => { if (alive) setState(next); });
    }) as unknown as void;
  }, []);
  return state;
}

/**
 * Pull a whole collection down, on purpose.
 *
 * This is the only path that reads every book. It exists because reading
 * offline is a real thing a person wants, but it should be a decision they
 * make and watch, not something that happens because they tapped a hadith.
 */
export async function downloadCollection(
  slug: string,
  language: string = DEFAULT_HADITH_LANGUAGE,
): Promise<number> {
  if (hadithDownloadProgress(slug).phase === 'downloading') return 0;
  const known = HADITH_COLLECTIONS.find((collection) => collection.slug === slug);
  if (!known) throw new Error('Unknown collection');
  setProgress(slug, { phase: 'listing', booksDone: 0, booksTotal: 0 });
  try {
    const outline = await loadHadithOutline(slug, language, true);
    const books = outline.books;
    setProgress(slug, { phase: 'downloading', booksDone: 0, booksTotal: books.length });

    let done = 0;
    let count = 0;
    for (let i = 0; i < books.length; i += BOOK_CONCURRENCY) {
      const slice = books.slice(i, i + BOOK_CONCURRENCY);
      /* eslint-disable no-await-in-loop */
      const groups = await Promise.all(
        slice.map((book) => loadHadithBook(slug, book.number, outline.lang, true).catch(() => [] as Hadith[])),
      );
      groups.forEach((group) => { count += group.length; });
      done += slice.length;
      setProgress(slug, { phase: 'downloading', booksDone: done, booksTotal: books.length });
    }

    if (!count) throw new Error('Nothing came back for this collection');
    const all = await downloadedCollections();
    all[slug] = { at: Date.now(), count };
    await AsyncStorage.setItem(`hadith:${DOWNLOAD_MARKER}`, JSON.stringify(all)).catch(() => undefined);
    setProgress(slug, { phase: 'done', booksDone: books.length, booksTotal: books.length });
    emitDownloads();
    return count;
  } catch (error) {
    setProgress(slug, {
      phase: 'error',
      booksDone: 0,
      booksTotal: 0,
      error: error instanceof Error ? error.message : 'Download failed',
    });
    throw error;
  }
}

/** Give the space back. Books already read stay cached; the marker goes. */
export async function removeDownloadedCollection(slug: string): Promise<void> {
  const all = await downloadedCollections();
  delete all[slug];
  await AsyncStorage.setItem(`hadith:${DOWNLOAD_MARKER}`, JSON.stringify(all)).catch(() => undefined);
  /* Every language: the cache key carries the language, so removing one
     collection means clearing it in each tongue it was read in. */
  const keys = await listCachedKeys('hadith').catch(() => [] as string[]);
  await Promise.all(
    keys
      .filter((key) => key.startsWith(`book-${slug}-`) || key.startsWith(`outline-${slug}-`) || key === `outline-${slug}`)
      .map((key) => AsyncStorage.removeItem(key).catch(() => undefined)),
  );
  setProgress(slug, { phase: 'idle', booksDone: 0, booksTotal: 0 });
  emitDownloads();
}

/**
 * Search what is actually on the device.
 *
 * The server has no cross-collection search — it accepts `q` and ignores it —
 * so a search can only look through narrations already read or downloaded.
 * That is the honest deal with on-demand reading, and the screen says so
 * rather than implying the whole corpus was searched.
 */
export async function searchDeviceHadith(query: string, limit = 60): Promise<Hadith[]> {
  const needle = query.trim().toLowerCase();
  if (needle.length < 3) return [];
  const keys = await listCachedKeys('hadith').catch(() => [] as string[]);
  const bookKeys = keys.filter((key) => key.startsWith('book-'));

  const seen = new Set<string>();
  const hits: Hadith[] = [];
  /* Small batches: a phone with every collection downloaded has ~350 books. */
  for (let i = 0; i < bookKeys.length && hits.length < limit; i += 8) {
    /* eslint-disable no-await-in-loop */
    const slice = bookKeys.slice(i, i + 8);
    const groups = await Promise.all(
      slice.map((key) => getCachedJson<{ hadiths: Hadith[] }>('hadith', key).catch(() => null)),
    );
    for (const group of groups) {
      for (const row of group?.hadiths || []) {
        if (seen.has(row.id)) continue;
        if ((row.english || '').toLowerCase().includes(needle) || (row.arabic || '').includes(query.trim())) {
          seen.add(row.id);
          hits.push(row);
          if (hits.length >= limit) break;
        }
      }
      if (hits.length >= limit) break;
    }
  }
  return hits;
}

/** How many narrations are on the device in total, for an honest search prompt. */
export async function deviceHadithCount(): Promise<number> {
  const keys = await listCachedKeys('hadith').catch(() => [] as string[]);
  return keys.filter((key) => key.startsWith('book-')).length;
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
