/**
 * The Islamic Data Worker - the app's own server.
 *
 * This is the app's first source for Quran text, Tafsir, Hadith and the
 * division maps. It serves immutable snapshot objects from
 * `https://api.islamicdata.uz/v1`, needs no key, and answers every request
 * with `sourceApi: "Islamic - Your Daily Companion"`.
 *
 * What it carries, at the time of writing:
 *   484 translation editions across 97 language codes
 *    82 tafsir editions across 33
 *    30 Arabic script entries (12 complete enough to serve by surah)
 *    14 transliteration entries (3 complete)
 *    10 hadith collections in 9 languages
 *   juz, hizb, ruku, rub, manzil and sajda maps
 *   114 chapter records and a structure summary
 *
 * What it does not carry: a page index and a search index. Those two are why
 * `api.ts` still exists - see the note on `PAGE_INDEX_EDITION` there.
 *
 * Two rules run through this module:
 *
 *   1. A failed refresh must cost the reader nothing. Every read falls back to
 *      the cached copy on timeout, network failure, 404, 503 or a malformed
 *      payload, and a bad response never overwrites good cached content.
 *   2. Validate before writing. The cache is only ever handed a payload that
 *      has already been checked, so the stored copy is always readable.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCachedJson, setCachedJson } from './contentCache';

/* ==================== Configuration ==================== */

/**
 * Read from the environment so the URL can stay pending, or change, without a
 * source rewrite. Metro inlines `process.env.EXPO_PUBLIC_*` at build time by
 * static replacement, so this must stay a literal - reading it off `globalThis`
 * would survive to runtime and never be substituted.
 */
const CONFIGURED = process.env.EXPO_PUBLIC_QURAN_API_BASE_URL;
export const ISLAMIC_DATA_BASE_URL: string = (
  CONFIGURED && CONFIGURED.trim() ? CONFIGURED.trim() : 'https://api.islamicdata.uz/v1'
).replace(/\/+$/, '');

/** Long enough for a cold Worker on a slow network, short enough to give up. */
export const REQUEST_TIMEOUT_MS = 12_000;
/** Catalogs are ~200 KB. They change only when a snapshot does. */
const CATALOG_TTL_MS = 6 * 60 * 60 * 1000;
const ETAGS_KEY = '@deen/islamic-data/etags/v1';

/* ==================== Types ==================== */

/** The four content categories the Worker serves by surah. */
export type IslamicCategory = 'quran' | 'tafsir' | 'scripts' | 'transliteration';

/** A catalog entry. Field names are the live ones - `displayName`, not `name`. */
export type IslamicEdition = {
  id: string;
  /** ISO 639-1 where the source had one, otherwise a three-letter code. */
  language: string;
  /** Lower-case English name of the language, e.g. "turkish". */
  languageName?: string;
  /** Populated from source metadata on most entries; null on a few. */
  author?: string | null;
  authorSource?: string | null;
  displayName: string;
  /** translation | tafsir | ayah-script | transliteration ... */
  variant?: string;
  ayahCount?: number;
  /**
   * Scripts and transliteration only. When false the file is a word-level,
   * glyph or image variant, or it does not cover all 6,236 ayahs, so there is
   * no surah route - only the raw file.
   */
  apiAvailable?: boolean;
  provenance?: { sourceIdentifier?: string; sourcePath?: string };
  sourceApi?: string;
};

/**
 * One ayah as the Worker sends it.
 *
 * The global ayah number is gone. Earlier snapshots carried a `number` from
 * 1 to 6236 alongside `numberInSurah`; the current one sends only
 * `numberInSurah` and `text`, and the OpenAPI `EditionSurah` schema agrees.
 * Anything here that needs a global number derives it from the surah.
 */
export type IslamicAyah = {
  numberInSurah: number;
  text: string;
  footnotes?: unknown;
};

export type IslamicSurahResponse = {
  schemaVersion: 1;
  category: IslamicCategory;
  edition: IslamicEdition;
  surah: { number: number; ayahs: IslamicAyah[] };
  sourceApi?: string;
};

export type IslamicChapter = {
  number: number;
  nameArabic: string;
  nameSimple: string;
  nameEnglish: string;
  revelationPlace: string;
  ayahCount: number;
};

export type IslamicStructure = {
  schemaVersion: number;
  category: string;
  counts: {
    ayahs: number; surahs: number; juz: number;
    hizb: number; ruku: number; rub: number; manzil: number; sajda: number;
  };
  surahs: Array<Record<string, unknown>>;
  provenance?: unknown;
  sourceApi?: string;
};

/** juz, hizb, ruku, rub, manzil and sajda all answer in this envelope. */
export type IslamicDivision = {
  schemaVersion: number;
  category: string;
  type: 'juz' | 'hizb' | 'ruku' | 'rub' | 'manzil' | 'sajda';
  record: Record<string, unknown>;
  provenance?: unknown;
  sourceApi?: string;
};

export type IslamicHealth = { ok: boolean; apiVersion: number; dataVersion: string };
export type IslamicManifest = {
  schemaVersion: number;
  snapshotVersion: string;
  generatedAt?: string;
  counts?: Record<string, number | undefined>;
  objects?: Array<{ key: string; bytes: number; sha256: string }>;
};

/**
 * What a surah fetch produces: the words for each verse, keyed the way the
 * rest of the app keys verses.
 */
export type TranslationRow = {
  verseKey: string;
  numberInSurah: number;
  text: string;
};

export type CachedSurah = {
  dataVersion?: string;
  fetchedAt: number;
  edition: IslamicEdition;
  rows: TranslationRow[];
};

/* ---------------- Hadith ---------------- */

export type HadithCollectionSummary = {
  slug: string;
  name: string;
  author?: string;
  languages?: string[];
  bookCount?: number;
  sourceApi?: string;
};

export type HadithBook = {
  number: number;
  /** Null on the unclassified bucket in Bukhari, Nasai and Malik. */
  name: string | null;
  first: number;
  last: number;
  count: number;
};

export type HadithGrade = { name: string; grade: string };

/**
 * One record. Note which field carries which language: with `language=en` the
 * Arabic sits in `arabic` and the English in `text`; with `language=ar` the
 * Arabic moves into `text` and `arabic` comes back empty. One English request
 * therefore returns both languages, which is why the app asks for English and
 * never needs the two-pass hydration the old jsDelivr source required.
 */
export type HadithRecord = {
  number: number;
  arabicNumber?: number;
  book: number;
  arabic?: string;
  text: string;
  grades?: HadithGrade[];
  bookTitle?: string | null;
  sourceOrdinal?: number;
};

export type HadithBookPage = {
  schemaVersion: number;
  category: string;
  collection: HadithCollectionSummary;
  language: string;
  book: HadithBook;
  hadiths: HadithRecord[];
  page: { offset: number; limit: number; total: number; hasMore: boolean };
  provenance?: unknown;
  sourceApi?: string;
};

export type HadithCollectionDetail = {
  schemaVersion: number;
  category: string;
  collection: HadithCollectionSummary;
  language: string;
  books: HadithBook[];
  counts: Record<string, number>;
  provenance?: unknown;
  sourceApi?: string;
};

export type HadithDaily = {
  schemaVersion: number;
  category: string;
  date: string;
  collection: HadithCollectionSummary;
  language: string;
  hadith: HadithRecord;
  provenance?: unknown;
  sourceApi?: string;
};

/* ==================== Errors ==================== */

export type IslamicDataErrorKind =
  | 'timeout'
  | 'network'
  | 'http'
  | 'invalid'
  | 'unavailable'
  /** A hadith number that appears more than once and was not pinned down. */
  | 'ambiguous';

export class IslamicDataError extends Error {
  kind: IslamicDataErrorKind;
  status?: number;
  /** The choices the server offered, when the answer was a 409. */
  matches?: Array<{ book: number; occurrence: number }>;
  retryable: boolean;
  constructor(kind: IslamicDataErrorKind, message: string, status?: number, matches?: Array<{ book: number; occurrence: number }>) {
    super(message);
    this.name = 'IslamicDataError';
    this.kind = kind;
    this.status = status;
    this.matches = matches;
    this.retryable = kind === 'timeout' || kind === 'network' || status === 503;
  }
}

/* ==================== HTTP ==================== */

type FetchResult = { status: number; body: string | null; etag?: string; dataVersion?: string; notModified: boolean };

/** ETags live with the cached payloads; one small map keeps them addressable. */
let etagCache: Record<string, string> | null = null;
async function etagStore(): Promise<Record<string, string>> {
  if (etagCache) return etagCache;
  try {
    etagCache = JSON.parse((await AsyncStorage.getItem(ETAGS_KEY)) || '{}');
  } catch {
    etagCache = {};
  }
  return etagCache!;
}
async function rememberEtag(url: string, etag: string) {
  const store = await etagStore();
  if (store[url] === etag) return;
  store[url] = etag;
  try {
    await AsyncStorage.setItem(ETAGS_KEY, JSON.stringify(store));
  } catch {
    /* A lost ETag only costs one re-download. Never worth failing a request. */
  }
}

/**
 * One GET, with a timeout, conditional-request support and a single retry.
 *
 * Two quirks of this Worker are handled here. The catalog routes answer a
 * plain GET with `206 Partial Content` carrying the whole body, so 200 and 206
 * are both successes. And the snapshot objects are immutable, so a 304 means
 * the cached copy is still exactly right - not an error to fall back from.
 */
async function get(path: string, options: { timeoutMs?: number; conditional?: boolean } = {}): Promise<FetchResult> {
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const url = `${ISLAMIC_DATA_BASE_URL}${path}`;
  const store = await etagStore();
  const known = options.conditional === false ? undefined : store[url];

  const attempt = async (): Promise<FetchResult> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (known) headers['If-None-Match'] = known;
      const response = await fetch(url, { method: 'GET', headers, signal: controller.signal });
      const etag = response.headers.get('etag') || undefined;
      const dataVersion = response.headers.get('x-data-version') || undefined;

      if (response.status === 304) return { status: 304, body: null, notModified: true };
      /* 206 is how the catalog routes answer an unconditional GET. */
      if (response.status !== 200 && response.status !== 206) {
        const text = await response.text().catch(() => '');
        let message = `HTTP ${response.status}`;
        let matches: Array<{ book: number; occurrence: number }> | undefined;
        try {
          const parsed = JSON.parse(text);
          if (parsed?.error?.message) message = parsed.error.message;
          if (Array.isArray(parsed?.error?.matches)) matches = parsed.error.matches;
        } catch {
          /* The Worker's non-JSON error pages (Cloudflare 1010) land here. */
        }
        if (response.status === 409) throw new IslamicDataError('ambiguous', message, 409, matches);
        throw new IslamicDataError('http', message, response.status);
      }
      const body = await response.text();
      if (!body) throw new IslamicDataError('invalid', 'Empty response body', response.status);
      if (etag) await rememberEtag(url, etag);
      return { status: response.status, body, etag, dataVersion, notModified: false };
    } catch (error) {
      if (error instanceof IslamicDataError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new IslamicDataError('timeout', `No answer within ${timeoutMs}ms`);
      }
      throw new IslamicDataError('network', error instanceof Error ? error.message : 'Network request failed');
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    return await attempt();
  } catch (error) {
    /* One retry, for a transient failure only. Not for a 404 or bad payload. */
    if (error instanceof IslamicDataError && error.retryable) return attempt();
    throw error;
  }
}

/**
 * A JSON GET.
 *
 * A 304 is a real answer, not a failure - but it only means anything if we
 * still hold the body it refers to. Callers that do (the catalogs) pass that
 * copy as `fallback` and get it straight back. Callers that do not (health,
 * manifest - both freshness probes, and tiny) ask with `conditional: false`,
 * because a health check that can be answered "unchanged" has stopped being a
 * health check.
 */
async function getJson<T>(
  path: string,
  options: { conditional?: boolean; fallback?: T } = {},
): Promise<{ data: T; dataVersion?: string; notModified: boolean }> {
  const result = await get(path, { conditional: options.conditional });
  if (result.notModified) {
    if (options.fallback === undefined) {
      throw new IslamicDataError('http', 'Server said 304 but no cached copy was kept', 304);
    }
    return { data: options.fallback, notModified: true };
  }
  try {
    return { data: JSON.parse(result.body as string) as T, dataVersion: result.dataVersion, notModified: false };
  } catch {
    throw new IslamicDataError('invalid', 'Response was not valid JSON');
  }
}

/* ==================== Health, manifest, data version ==================== */

/** Availability check, not a content request. Safe to call often. */
export async function getHealth(): Promise<IslamicHealth> {
  const { data } = await getJson<IslamicHealth>('/health', { conditional: false });
  if (!data || typeof data.ok !== 'boolean') {
    throw new IslamicDataError('invalid', 'Health response was malformed');
  }
  return data;
}

export async function getManifest(): Promise<IslamicManifest> {
  const { data } = await getJson<IslamicManifest>('/manifest', { conditional: false });
  if (!data || !data.snapshotVersion) {
    throw new IslamicDataError('invalid', 'Manifest response was malformed');
  }
  return data;
}

/**
 * The snapshot the API is serving, which forms part of every cache key.
 *
 * Persisted, because otherwise the first cache key of every session would need
 * a round trip to /health before it could be built. Every response also carries
 * the version in a header, so it is learned for free and refreshed whenever
 * anything is fetched.
 */
const DATA_VERSION_KEY = '@deen/islamic-data/data-version/v1';
let cachedDataVersion: string | null = null;

async function noteDataVersion(version?: string) {
  if (!version || version === cachedDataVersion) return;
  cachedDataVersion = version;
  try {
    await AsyncStorage.setItem(DATA_VERSION_KEY, version);
  } catch {
    /* A lost version only costs one extra validation. */
  }
}

export async function currentDataVersion(): Promise<string> {
  if (cachedDataVersion) return cachedDataVersion;
  try {
    const stored = await AsyncStorage.getItem(DATA_VERSION_KEY);
    if (stored) {
      cachedDataVersion = stored;
      return stored;
    }
  } catch {
    /* Fall through to the network. */
  }
  const health = await getHealth().catch(() => null);
  cachedDataVersion = health?.dataVersion || 'unknown';
  return cachedDataVersion;
}

/* ==================== Validation ==================== */

function fail(why: string) {
  return new IslamicDataError('invalid', why);
}

/**
 * Checks a surah payload before anything is written to the cache.
 *
 * The ayah loop is deliberately lighter than it used to be. It once required a
 * global ayah number on every row; the current snapshot does not send one, so
 * requiring it meant rejecting every surah the Worker served. What still holds
 * across the published snapshot is that rows are sequential from one and every
 * row carries text - and that is enough to catch a truncated or shuffled file.
 */
function validateSurah(raw: any, category: IslamicCategory, editionId: string, surahNumber: number): IslamicSurahResponse {
  if (!raw || typeof raw !== 'object') throw fail('Response was not an object');
  if (raw.schemaVersion !== 1) throw fail(`Unexpected schemaVersion ${raw.schemaVersion}`);
  if (raw.category !== category) throw fail(`Expected category "${category}", got "${raw.category}"`);
  if (raw.edition?.id !== editionId) throw fail(`Edition mismatch: asked for ${editionId}, got ${raw.edition?.id}`);
  if (raw.surah?.number !== surahNumber) throw fail(`Surah mismatch: asked for ${surahNumber}, got ${raw.surah?.number}`);
  const ayahs = raw.surah?.ayahs;
  if (!Array.isArray(ayahs) || ayahs.length === 0) throw fail('No ayahs in response');
  for (let i = 0; i < ayahs.length; i += 1) {
    const ayah = ayahs[i];
    if (ayah?.numberInSurah !== i + 1) {
      throw fail(`Ayah ${i} has numberInSurah ${ayah?.numberInSurah}, expected ${i + 1}`);
    }
    if (typeof ayah?.text !== 'string' || !ayah.text.trim()) throw fail(`Ayah ${i + 1} has empty text`);
  }
  return raw as IslamicSurahResponse;
}

function validateCatalog(raw: any, category: IslamicCategory): IslamicEdition[] {
  if (!raw || typeof raw !== 'object') throw fail('Catalog was not an object');
  if (raw.schemaVersion !== 1) throw fail(`Unexpected catalog schemaVersion ${raw.schemaVersion}`);
  if (raw.category !== category) throw fail(`Expected category "${category}", got "${raw.category}"`);
  if (!Array.isArray(raw.editions) || raw.editions.length === 0) {
    throw fail('Catalog carried no editions');
  }
  const editions = raw.editions as IslamicEdition[];
  /* An id is the only thing we ever send back to the API, so it is mandatory. */
  if (editions.some((e) => !e?.id || typeof e.id !== 'string')) {
    throw fail('Catalog carried an edition with no id');
  }
  return editions;
}

/* ==================== Catalogs ==================== */

type CatalogEnvelope = { fetchedAt: number; dataVersion?: string; editions: IslamicEdition[] };

/**
 * One edition catalog.
 *
 * Every category is cached in its own envelope, and the quran-side categories
 * share the 'quran' storage namespace, which is where the reader's LRU
 * eviction already looks.
 */
export async function getEditions(category: IslamicCategory, options: { force?: boolean } = {}): Promise<IslamicEdition[]> {
  const key = `editions-catalog-v2:${category}`;
  const cached = await getCachedJson<CatalogEnvelope>('quran', key).catch(() => null);
  const fresh = !!cached && Date.now() - cached.fetchedAt < CATALOG_TTL_MS;

  if (cached?.editions?.length && !options.force && fresh) return cached.editions;

  try {
    const { data, dataVersion, notModified } = await getJson<any>(`/${category}/editions`, {
      fallback: cached ?? undefined,
    });
    if (notModified && cached?.editions?.length) {
      /* Still the newest snapshot - just move the TTL along so a busy app does
         not keep re-validating a catalog it already holds. */
      await setCachedJson('quran', key, { ...cached, fetchedAt: Date.now() }).catch(() => {});
      return cached.editions;
    }
    const editions = validateCatalog(data, category);
    await setCachedJson('quran', key, { fetchedAt: Date.now(), dataVersion, editions } satisfies CatalogEnvelope).catch(() => {});
    return editions;
  } catch (error) {
    /* Never let a failed refresh cost the person their catalog. */
    if (cached?.editions?.length) return cached.editions;
    throw error;
  }
}

/** Editions that have a surah route. Scripts and transliteration are partial. */
export function servableEditions(editions: IslamicEdition[], category: IslamicCategory): IslamicEdition[] {
  if (category === 'quran' || category === 'tafsir') return editions;
  return editions.filter((e) => e.apiAvailable === true);
}

/* ==================== Surah content ==================== */

/**
 * One surah of one edition.
 *
 * The cache key carries the data version, so a new snapshot never collides with
 * the old one, and the old entry stays readable until it is evicted. That is
 * the "retain old cached data until the new response validates" rule: the new
 * payload is validated *before* anything is written.
 */
export async function getSurah(
  category: IslamicCategory,
  editionId: string,
  surahNumber: number,
  options: { force?: boolean } = {},
): Promise<CachedSurah> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new IslamicDataError('invalid', `Surah must be 1-114, got ${surahNumber}`);
  }
  const dataVersion = await currentDataVersion().catch(() => 'unknown');
  const key = `surah:${category}:${editionId}:${surahNumber}:${dataVersion}`;
  const cached = await getCachedJson<CachedSurah>('quran', key).catch(() => null);

  if (cached?.rows?.length && !options.force) return cached;

  let result: FetchResult;
  try {
    result = await get(`/${category}/editions/${encodeURIComponent(editionId)}/surahs/${surahNumber}`);
  } catch (error) {
    if (cached?.rows?.length) return cached;
    throw error;
  }

  /* 304 means the cached copy is byte-for-byte what the Worker holds. */
  if (result.notModified) {
    if (cached?.rows?.length) return cached;
    /* We kept an ETag but lost the body - drop it and ask again, once. */
    return getSurah(category, editionId, surahNumber, { force: true });
  }

  let validated: IslamicSurahResponse;
  try {
    validated = validateSurah(JSON.parse(result.body as string), category, editionId, surahNumber);
  } catch (error) {
    /* A malformed payload must never displace good cached content. */
    if (cached?.rows?.length) return cached;
    throw error;
  }

  const next: CachedSurah = {
    dataVersion: result.dataVersion || dataVersion,
    fetchedAt: Date.now(),
    edition: validated.edition,
    rows: toRows(validated),
  };
  /* The response header tells us the snapshot for free - no /health needed. */
  void noteDataVersion(result.dataVersion);
  await setCachedJson('quran', key, next).catch(() => {});
  return next;
}

/** Turn a validated response into rows keyed the way the rest of the app keys verses. */
export function toRows(response: IslamicSurahResponse): TranslationRow[] {
  const surahNumber = response.surah.number;
  return response.surah.ayahs.map((ayah) => ({
    verseKey: `${surahNumber}:${ayah.numberInSurah}`,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
  }));
}

/**
 * Join this provider's text onto verses that came from a provider which knows
 * the structure - page, juz, Arabic. Anything this response has nothing to say
 * about is left exactly as it was.
 */
export function mergeTranslations<T extends { verse_key: string }>(
  verses: T[],
  rows: TranslationRow[],
): Array<T & { translation?: string }> {
  if (!rows.length) return verses as Array<T & { translation?: string }>;
  const byKey = new Map(rows.map((row) => [row.verseKey, row]));
  return verses.map((verse) => {
    const row = byKey.get(verse.verse_key);
    if (!row) return verse as T & { translation?: string };
    return { ...verse, translation: row.text };
  });
}

/* ==================== Chapters and structure ==================== */

/** The 114 chapters. Immutable for a snapshot, so cached for a year. */
export async function getChapters(): Promise<IslamicChapter[]> {
  const cached = await getCachedJson<{ fetchedAt: number; chapters: IslamicChapter[] }>('quran', 'chapters-v1').catch(() => null);
  if (cached?.chapters?.length === 114) return cached.chapters;
  try {
    const { data } = await getJson<any>('/chapters', { conditional: false });
    const chapters = (data?.chapters || []) as IslamicChapter[];
    if (chapters.length !== 114) throw fail(`Expected 114 chapters, got ${chapters.length}`);
    if (chapters.some((c) => typeof c?.number !== 'number' || !c?.nameSimple)) {
      throw fail('A chapter record was missing its number or name');
    }
    await setCachedJson('quran', 'chapters-v1', { fetchedAt: Date.now(), chapters }).catch(() => {});
    return chapters;
  } catch (error) {
    if (cached?.chapters?.length) return cached.chapters;
    throw error;
  }
}

/** Structure summary plus 114 surah records, in the source's snake_case. */
export async function getStructure(): Promise<IslamicStructure> {
  const cached = await getCachedJson<IslamicStructure>('quran', 'structure-v1').catch(() => null);
  if (cached?.surahs?.length) return cached;
  try {
    const { data } = await getJson<IslamicStructure>('/structure');
    if (!data?.counts || !Array.isArray(data?.surahs) || data.surahs.length !== 114) {
      throw fail('Structure response was malformed');
    }
    await setCachedJson('quran', 'structure-v1', data).catch(() => {});
    return data;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

/* ==================== Division maps ==================== */

export const DIVISION_RANGES = {
  juz: 30, hizb: 60, ruku: 558, rub: 240, manzil: 7, sajda: 15,
} as const;

export type DivisionType = keyof typeof DIVISION_RANGES;

/**
 * One juz, hizb, ruku, rub, manzil or sajda.
 *
 * All six are immutable snapshot objects, so they are cached indefinitely and
 * the bounds are checked before the request rather than learned from a 400.
 */
export async function getDivision(type: DivisionType, number: number): Promise<IslamicDivision> {
  const max = DIVISION_RANGES[type];
  if (!Number.isInteger(number) || number < 1 || number > max) {
    throw new IslamicDataError('invalid', `${type} must be 1-${max}, got ${number}`);
  }
  const key = `division:${type}:${number}`;
  const cached = await getCachedJson<IslamicDivision>('quran', key).catch(() => null);
  if (cached?.record) return cached;
  try {
    const { data } = await getJson<IslamicDivision>(`/quran/${type}/${number}`);
    if (!data?.record) throw fail(`${type} ${number} carried no record`);
    await setCachedJson('quran', key, data).catch(() => {});
    return data;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

/* ==================== Hadith ==================== */

/** The 10 collections. Cached for the same TTL as the other catalogs. */
export async function getHadithCollections(options: { force?: boolean } = {}): Promise<HadithCollectionSummary[]> {
  const key = 'hadith-collections-v1';
  const cached = await getCachedJson<{ fetchedAt: number; collections: HadithCollectionSummary[] }>('hadith', key).catch(() => null);
  if (cached?.collections?.length && !options.force && Date.now() - cached.fetchedAt < CATALOG_TTL_MS) {
    return cached.collections;
  }
  try {
    const { data, notModified } = await getJson<any>('/hadith/collections', { fallback: cached ?? undefined });
    if (notModified && cached?.collections?.length) return cached.collections;
    const collections = (data?.collections || []) as HadithCollectionSummary[];
    if (!collections.length) throw fail('Hadith catalog carried no collections');
    if (collections.some((c) => !c?.slug)) throw fail('Hadith catalog carried a collection with no slug');
    await setCachedJson('hadith', key, { fetchedAt: Date.now(), collections }).catch(() => {});
    return collections;
  } catch (error) {
    if (cached?.collections?.length) return cached.collections;
    throw error;
  }
}

/** One collection: its metadata and its book list. */
export async function getHadithCollection(
  collectionId: string,
  language = 'en',
): Promise<HadithCollectionDetail> {
  const key = `hadith-collection:${collectionId}:${language}`;
  const cached = await getCachedJson<HadithCollectionDetail>('hadith', key).catch(() => null);
  if (cached?.books?.length) return cached;
  try {
    const { data } = await getJson<HadithCollectionDetail>(
      `/hadith/collections/${encodeURIComponent(collectionId)}?language=${encodeURIComponent(language)}`,
    );
    if (!Array.isArray(data?.books)) throw fail('Collection carried no book list');
    await setCachedJson('hadith', key, data).catch(() => {});
    return data;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

/**
 * One book, page by page.
 *
 * This is the stable way through a collection. Hadith numbers repeat - inside
 * a book and across books - so the book route is the only one that visits
 * every record exactly once.
 */
export async function getHadithBook(
  collectionId: string,
  bookNumber: number,
  options: { language?: string; limit?: number; offset?: number } = {},
): Promise<HadithBookPage> {
  const language = options.language ?? 'en';
  const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 50)));
  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const { data } = await getJson<HadithBookPage>(
    `/hadith/collections/${encodeURIComponent(collectionId)}/books/${bookNumber}` +
      `?language=${encodeURIComponent(language)}&limit=${limit}&offset=${offset}`,
  );
  if (!Array.isArray(data?.hadiths)) throw fail('Book carried no hadiths');
  return data;
}

/**
 * One record by its source number.
 *
 * Numbers repeat. When the number is not unique the Worker answers 409 with
 * the choices it wants, and that error is passed through with `matches`
 * attached so the caller can ask again with `book` and `occurrence`.
 */
export async function getHadith(
  collectionId: string,
  hadithNumber: number,
  options: { language?: string; book?: number; occurrence?: number } = {},
): Promise<HadithRecord> {
  const language = options.language ?? 'en';
  let query = `?language=${encodeURIComponent(language)}`;
  if (options.book !== undefined) query += `&book=${Math.floor(options.book)}`;
  if (options.occurrence !== undefined) query += `&occurrence=${Math.floor(options.occurrence)}`;
  const { data } = await getJson<any>(
    `/hadith/collections/${encodeURIComponent(collectionId)}/hadith/${hadithNumber}${query}`,
  );
  const record = data?.hadith;
  if (!record || typeof record.text !== 'string') throw fail('Hadith response carried no record');
  return record as HadithRecord;
}

/**
 * The daily hadith. Deterministic for a date, so a day can be cached outright.
 */
export async function getDailyHadith(date?: string): Promise<HadithDaily> {
  const key = `hadith-daily:${date || 'today'}`;
  const cached = await getCachedJson<HadithDaily>('daily', key).catch(() => null);
  if (cached?.hadith) return cached;
  try {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    const { data } = await getJson<HadithDaily>(`/hadith/daily${query}`);
    if (!data?.hadith) throw fail('Daily hadith carried no record');
    await setCachedJson('daily', key, data).catch(() => {});
    return data;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

/* ==================== Reading the catalog ==================== */

const VARIANT_LABELS: Record<string, string> = {
  translation: 'Translation',
  tafsir: 'Tafsir',
  'ayah-script': 'Arabic script',
  transliteration: 'Transliteration',
  simple: 'Plain text',
  chunks: 'Grouped',
  footnotes: 'Footnotes',
  'footnotes-inline': 'Notes in text',
  'word-by-word': 'Word by word',
};

export function variantLabel(variant?: string): string {
  if (!variant) return 'Translation';
  return VARIANT_LABELS[variant] || variant.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * A readable name for an edition.
 *
 * `displayName` is usually the translator, and `author` is usually the same
 * person pulled from source metadata - so when they agree, showing both is
 * saying the same name twice. When they differ, the author is the one worth
 * keeping visible, because the display name is often a bare slug.
 */
export function editionDisplayName(edition: IslamicEdition): string {
  const display = (edition.displayName || '').trim();
  const author = (edition.author || '').trim();
  if (author && display && author.toLowerCase() !== display.toLowerCase()) {
    /* Prefer the human name over a slug like "sq-saadi". */
    const looksLikeSlug = /^[a-z]{2,3}[-_]./i.test(display) && !display.includes(' ');
    return looksLikeSlug ? author : display;
  }
  if (author) return author;
  if (display) return display;
  return edition.id;
}

/**
 * The line under the name. Language and variant are always present; the
 * author is only worth the space when it is not already the title.
 */
export function editionSubtitle(edition: IslamicEdition): string {
  const language = languageName(edition);
  const variant = variantLabel(edition.variant);
  const author = (edition.author || '').trim();
  const title = editionDisplayName(edition);
  if (author && author.toLowerCase() !== title.toLowerCase()) return `${language} · ${author} · ${variant}`;
  return `${language} · ${variant}`;
}

/**
 * Quran editions answer "english"; a few catalogs send null. Fall back to the
 * code itself rather than showing a person an empty subtitle.
 */
export function languageName(edition: IslamicEdition): string {
  const name = (edition.languageName || '').trim();
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return (edition.language || '').toUpperCase();
}

export type EditionChoice = { edition: IslamicEdition; label: string; subtitle: string; group: string };

/** A display list, sorted so a person can actually find something. */
export function toEditionChoices(editions: IslamicEdition[]): EditionChoice[] {
  return editions
    .map((edition) => ({
      edition,
      label: editionDisplayName(edition),
      subtitle: editionSubtitle(edition),
      group: languageName(edition),
    }))
    .sort(
      (a, b) =>
        a.group.localeCompare(b.group) ||
        a.label.localeCompare(b.label) ||
        a.subtitle.localeCompare(b.subtitle),
    );
}

/* ==================== Diagnostics ==================== */

/** Everything worth asking about the rollout, in one call. */
export async function runRolloutGate(): Promise<Array<{ check: string; passed: boolean; detail: string }>> {
  const out: Array<{ check: string; passed: boolean; detail: string }> = [];
  const push = async (check: string, fn: () => Promise<string>) => {
    try {
      out.push({ check, passed: true, detail: await fn() });
    } catch (error) {
      out.push({ check, passed: false, detail: error instanceof Error ? error.message : String(error) });
    }
  };

  await push('health', async () => {
    const h = await getHealth();
    if (!h.ok) throw new Error('ok was false');
    return `ok, dataVersion ${h.dataVersion}`;
  });
  await push('chapters', async () => `${(await getChapters()).length} chapters`);
  await push('quran catalog', async () => `${(await getEditions('quran', { force: true })).length} editions`);
  await push('tafsir catalog', async () => `${(await getEditions('tafsir', { force: true })).length} editions`);
  await push('scripts catalog', async () => {
    const all = await getEditions('scripts', { force: true });
    return `${all.length} editions, ${servableEditions(all, 'scripts').length} servable`;
  });
  await push('transliteration catalog', async () => {
    const all = await getEditions('transliteration', { force: true });
    return `${all.length} editions, ${servableEditions(all, 'transliteration').length} servable`;
  });
  await push('surah 1 + 114', async () => {
    const [en] = (await getEditions('quran')).filter((e) => e.language === 'en');
    if (!en) throw new Error('no English edition');
    const a = await getSurah('quran', en.id, 1, { force: true });
    const b = await getSurah('quran', en.id, 114, { force: true });
    if (a.rows.length !== 7 || b.rows.length !== 6) throw new Error(`got ${a.rows.length}/${b.rows.length}`);
    return `${a.rows.length} + ${b.rows.length} ayahs`;
  });
  await push('division maps', async () => {
    const juz = await getDivision('juz', 30);
    const sajda = await getDivision('sajda', 15);
    if (!juz.record || !sajda.record) throw new Error('a division carried no record');
    return 'juz 30 and sajda 15 fetched';
  });
  await push('hadith', async () => {
    const collections = await getHadithCollections({ force: true });
    const page = await getHadithBook('bukhari', 1, { limit: 2 });
    if (!page.hadiths.length) throw new Error('book 1 returned no records');
    return `${collections.length} collections, bukhari book 1 ok`;
  });
  await push('daily hadith', async () => {
    const d = await getDailyHadith();
    return `${d.collection?.slug} ${d.hadith?.number} on ${d.date}`;
  });
  await push('missing edition 404', async () => {
    try {
      await getSurah('quran', 'definitely-not-an-edition', 1, { force: true });
      throw new Error('expected a 404');
    } catch (error) {
      if (error instanceof IslamicDataError && error.status === 404) return '404 as expected';
      throw error;
    }
  });
  return out;
}

/** Drops cached catalogs and surahs for one or both categories. */
export async function clearIslamicDataCache(category?: IslamicCategory) {
  cachedDataVersion = null;
  etagCache = null;
  try {
    await AsyncStorage.removeItem(ETAGS_KEY);
  } catch {
    /* Nothing to clear if the store is unreachable. */
  }
  const { clearCacheNamespace } = await import('./contentCache');
  if (category) await clearCacheNamespace('quran');
  else {
    await clearCacheNamespace('quran');
    await clearCacheNamespace('tafsir');
    await clearCacheNamespace('hadith');
  }
}
