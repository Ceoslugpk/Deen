/**
 * The Islamic Data Quran API - translations and Tafsir.
 *
 * This is a second provider, not a replacement. It carries 307 translation
 * editions and 83 Tafsir editions, every one of them complete at 6,236 ayahs,
 * served from immutable snapshot objects with working ETag/304 caching.
 *
 * What it does not carry is everything else the reader is built on: no Arabic
 * script, no page/juz/hizb structure, no chapter metadata, no audio, no
 * search. So this module never tries to produce a `Verse`. It produces
 * `TranslationRow`s - text keyed by verse_key - and `mergeTranslations` joins
 * them onto verses that came from the provider that does know where a verse
 * sits on a page. Keeping that split honest is the whole design.
 *
 * Rules it follows, from the integration doc:
 *   5. Validate schemaVersion, category, edition.id, surah.number, ayahs.
 *   6. Validate that ayah numbers are sequential.
 *   7. Preserve author, name, language, variant, format in cache metadata.
 *   8. Fall back to cache on timeout, offline, 404, 503, or invalid payload.
 *   9. Never replace valid cached content with an empty/malformed response.
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
/** Catalogs are ~241 KB and ~65 KB. They change only when a snapshot does. */
const CATALOG_TTL_MS = 6 * 60 * 60 * 1000;
const ETAGS_KEY = '@deen/islamic-data/etags/v1';

/* ==================== Types ==================== */

export type IslamicDataCategory = 'quran' | 'tafsir';

export type QuranApiCoverage = {
  expectedAyahCount: number;
  missingAyahCount: number;
  fullAyahCoverage: boolean;
};

/**
 * The real catalog entry. The integration doc's suggested type is a subset of
 * this - the live API adds provenance and coverage fields, and `author` is
 * always null, which is worth knowing before you design a UI that shows it.
 */
export type QuranApiEdition = {
  id: string;
  language: string;
  languageName?: string;
  languageConfidence?: 'high' | 'medium' | 'low';
  languageDetectionSource?: string;
  languagePair?: string[];
  bilingual?: boolean;
  name: string;
  /** Null on every edition in the published snapshot (all 390). */
  author: string | null;
  authorSource?: string | null;
  direction: 'ltr' | 'rtl';
  /** How the same work was split: simple / chunks / footnotes / footnotes-inline / word-by-word / tafsir. */
  variant?: string;
  format?: string;
  /** ayah-map, or word-map for the eleven word-by-word editions. */
  shape?: string;
  coverage?: QuranApiCoverage;
  complete: boolean;
  provenanceStatus?: string;
  authorizationStatus?: string;
  counterpartStatus?: string;
  object?: string;
  appBrand?: string;
};

export type QuranApiWord = { number: number; text: string };

/** The documented `translation` field never appears; the text is always here. */
export type QuranApiAyah = {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  words?: QuranApiWord[];
};

export type QuranApiSurahResponse = {
  schemaVersion: 1;
  category: IslamicDataCategory;
  edition: QuranApiEdition;
  surah: {
    number: number;
    /** Empty string in the published snapshot - source chapter names elsewhere. */
    nameArabic: string;
    nameSimple: string;
    nameEnglish: string;
    revelationPlace: string;
    versesCount: number;
    ayahs: QuranApiAyah[];
  };
};

export type IslamicDataHealth = { ok: boolean; apiVersion: number; dataVersion: string };
export type IslamicDataManifest = {
  schemaVersion: number;
  snapshotVersion: string;
  generatedAt: string;
  counts?: { quranEditions?: number; tafsirEditions?: number; ayahsPerEdition?: number };
  objects?: Array<{ key: string; bytes: number; sha256: string }>;
};

/**
 * What this provider can honestly return: the words for a verse, and where the
 * verse sits in its surah. Deliberately has no `text_uthmani` - there is no
 * Arabic here to put in it.
 */
export type TranslationRow = {
  verseKey: string;
  numberInSurah: number;
  /** Global ayah number, 1-6236. */
  globalNumber: number;
  text: string;
  words?: QuranApiWord[];
};

export type CachedSurah = {
  dataVersion?: string;
  fetchedAt: number;
  edition: QuranApiEdition;
  rows: TranslationRow[];
};

/* ==================== Errors ==================== */

export type IslamicDataErrorKind =
  | 'timeout'      /* AbortController fired. */
  | 'network'      /* fetch itself rejected - offline, DNS, TLS. */
  | 'http'         /* 4xx/5xx that is not 304. */
  | 'invalid'      /* 200 with a payload that failed validation. */
  | 'unavailable'; /* 503, or a payload we will not trust. */

export class IslamicDataError extends Error {
  kind: IslamicDataErrorKind;
  status?: number;
  /** True when a later attempt could reasonably succeed. */
  retryable: boolean;
  constructor(kind: IslamicDataErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'IslamicDataError';
    this.kind = kind;
    this.status = status;
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
        try {
          const parsed = JSON.parse(text);
          if (parsed?.error?.message) message = parsed.error.message;
        } catch {
          /* The Worker's non-JSON error pages (Cloudflare 1010) land here. */
        }
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
 * still hold the body it refers to. Callers that do (the catalog) pass that
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

/* ==================== Health and manifest ==================== */

/** Availability check, not a content request. Safe to call often. */
export async function getHealth(): Promise<IslamicDataHealth> {
  /* Unconditional: the point is to learn whether the Worker answers at all. */
  const { data } = await getJson<IslamicDataHealth>('/health', { conditional: false });
  if (!data || typeof data.ok !== 'boolean') {
    throw new IslamicDataError('invalid', 'Health response was malformed');
  }
  return data;
}

export async function getManifest(): Promise<IslamicDataManifest> {
  const { data } = await getJson<IslamicDataManifest>('/manifest', { conditional: false });
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

/**
 * The six checks the doc asks for, plus two of our own.
 *
 * `versesCount` is checked against the array length and every row is required to
 * carry non-empty text. Both hold across the published snapshot - a full sweep
 * of all 114 surahs on three editions came back clean - so a breach means
 * something has genuinely changed, not that we are being fussy.
 */
function validateSurah(raw: any, category: IslamicDataCategory, editionId: string, surahNumber: number): QuranApiSurahResponse {
  const fail = (why: string) => new IslamicDataError('invalid', why);
  if (!raw || typeof raw !== 'object') throw fail('Response was not an object');
  if (raw.schemaVersion !== 1) throw fail(`Unexpected schemaVersion ${raw.schemaVersion}`);
  if (raw.category !== category) throw fail(`Expected category "${category}", got "${raw.category}"`);
  if (raw.edition?.id !== editionId) throw fail(`Edition mismatch: asked for ${editionId}, got ${raw.edition?.id}`);
  if (raw.surah?.number !== surahNumber) throw fail(`Surah mismatch: asked for ${surahNumber}, got ${raw.surah?.number}`);
  if (!Array.isArray(raw.surah?.ayahs) || raw.surah.ayahs.length === 0) throw fail('No ayahs in response');

  const ayahs = raw.surah.ayahs as QuranApiAyah[];
  for (let i = 0; i < ayahs.length; i++) {
    const ayah = ayahs[i];
    /* Sequential, counting from one. */
    if (ayah?.numberInSurah !== i + 1) {
      throw fail(`Ayah ${i} has numberInSurah ${ayah?.numberInSurah}, expected ${i + 1}`);
    }
    if (typeof ayah?.number !== 'number') throw fail(`Ayah ${i + 1} has no global number`);
    if (typeof ayah?.text !== 'string' || !ayah.text.trim()) throw fail(`Ayah ${i + 1} has empty text`);
  }
  if (typeof raw.surah.versesCount === 'number' && raw.surah.versesCount !== ayahs.length) {
    throw fail(`versesCount says ${raw.surah.versesCount}, response carries ${ayahs.length}`);
  }
  return raw as QuranApiSurahResponse;
}

function validateCatalog(raw: any, category: IslamicDataCategory): QuranApiEdition[] {
  if (!raw || typeof raw !== 'object') throw new IslamicDataError('invalid', 'Catalog was not an object');
  if (raw.schemaVersion !== 1) throw new IslamicDataError('invalid', `Unexpected catalog schemaVersion ${raw.schemaVersion}`);
  if (raw.category !== category) throw new IslamicDataError('invalid', `Expected category "${category}", got "${raw.category}"`);
  if (!Array.isArray(raw.editions) || raw.editions.length === 0) {
    throw new IslamicDataError('invalid', 'Catalog carried no editions');
  }
  const editions = raw.editions as QuranApiEdition[];
  /* An id is the only thing we ever send back to the API, so it is mandatory. */
  if (editions.some((e) => !e?.id || typeof e.id !== 'string')) {
    throw new IslamicDataError('invalid', 'Catalog carried an edition with no id');
  }
  return editions;
}

/* ==================== Catalogs ==================== */

type CatalogEnvelope = { fetchedAt: number; dataVersion?: string; editions: QuranApiEdition[] };

/**
 * Translation and Tafsir catalogs are separate data classes and stay in
 * separate caches - `contentCache` already namespaces 'quran' and 'tafsir'
 * apart, which is exactly the split the doc asks for.
 */
export async function getEditions(category: IslamicDataCategory, options: { force?: boolean } = {}): Promise<QuranApiEdition[]> {
  const key = 'editions-catalog-v1';
  const cached = await getCachedJson<CatalogEnvelope>(category, key).catch(() => null);
  const fresh = !!cached && Date.now() - cached.fetchedAt < CATALOG_TTL_MS;

  if (fresh && !options.force) return cached!.editions;

  try {
    const { data, dataVersion, notModified } = await getJson<any>(`/${category}/editions`, {
      fallback: cached ?? undefined,
    });
    if (notModified && cached?.editions?.length) {
      /* Still the newest snapshot - just move the TTL along so a busy app does
         not keep re-validating a catalog it already holds. */
      await setCachedJson(category, key, { ...cached, fetchedAt: Date.now() }).catch(() => {});
      return cached.editions;
    }
    const editions = validateCatalog(data, category);
    await setCachedJson(category, key, { fetchedAt: Date.now(), dataVersion, editions } satisfies CatalogEnvelope).catch(() => {});
    return editions;
  } catch (error) {
    /* Never let a failed refresh cost the person their catalog. */
    if (cached?.editions?.length) return cached.editions;
    throw error;
  }
}

/* ==================== Surah content ==================== */

/**
 * One surah of one edition.
 *
 * The cache key carries the data version, so a new snapshot never collides with
 * the old one, and the old entry stays readable until it is evicted. That is
 * the doc's "retain old cached data until the new response validates" rule: the
 * new payload is validated *before* anything is written.
 */
export async function getSurah(
  category: IslamicDataCategory,
  editionId: string,
  surahNumber: number,
  options: { force?: boolean } = {},
): Promise<CachedSurah> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new IslamicDataError('invalid', `Surah must be 1-114, got ${surahNumber}`);
  }
  const dataVersion = await currentDataVersion().catch(() => 'unknown');
  const key = `surah:${editionId}:${surahNumber}:${dataVersion}`;
  const cached = await getCachedJson<CachedSurah>(category, key).catch(() => null);

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

  let validated: QuranApiSurahResponse;
  try {
    validated = validateSurah(JSON.parse(result.body as string), category, editionId, surahNumber);
  } catch (error) {
    /* Rule 9: a malformed payload must never displace good cached content. */
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
  await setCachedJson(category, key, next).catch(() => {});
  return next;
}

/** Turn a validated response into rows keyed the way the rest of the app keys verses. */
export function toRows(response: QuranApiSurahResponse): TranslationRow[] {
  const surahNumber = response.surah.number;
  return response.surah.ayahs.map((ayah) => ({
    verseKey: `${surahNumber}:${ayah.numberInSurah}`,
    numberInSurah: ayah.numberInSurah,
    globalNumber: ayah.number,
    text: ayah.translation && ayah.translation.trim() ? ayah.translation : ayah.text,
    words: ayah.words,
  }));
}

/**
 * Join this provider's text onto verses that came from a provider which knows
 * the structure - page, juz, hizb, Arabic. Anything this response has nothing
 * to say about is left exactly as it was.
 */
export function mergeTranslations<T extends { verse_key: string }>(verses: T[], rows: TranslationRow[]): Array<T & { translation?: string; words?: QuranApiWord[] }> {
  if (!rows.length) return verses as Array<T & { translation?: string; words?: QuranApiWord[] }>;
  const byKey = new Map(rows.map((row) => [row.verseKey, row]));
  return verses.map((verse) => {
    const row = byKey.get(verse.verse_key);
    if (!row) return verse as T & { translation?: string; words?: QuranApiWord[] };
    return { ...verse, translation: row.text, words: row.words };
  });
}

/* ==================== Reading the catalog ==================== */

const VARIANT_LABELS: Record<string, string> = {
  simple: 'Plain text',
  chunks: 'Grouped',
  footnotes: 'Footnotes',
  'footnotes-inline': 'Notes in text',
  'word-by-word': 'Word by word',
  tafsir: 'Commentary',
};

export function variantLabel(variant?: string): string {
  return (variant && VARIANT_LABELS[variant]) || 'Plain text';
}

/**
 * Catalog `name` values are slugs - "urud", "de-bubenheim", "mrn-unknown".
 * Readable enough to list once tidied, and honest when there is nothing to
 * tidy: a name that admits it is unknown keeps saying so.
 */
export function editionDisplayName(edition: QuranApiEdition): string {
  const raw = (edition.name || '').trim();
  if (!raw) return edition.languageName || edition.language || edition.id;
  const withoutUnknown = raw.replace(/[-_\s]*(unknown|n-a|na)$/i, '').trim();
  const slug = withoutUnknown || raw;
  const words = slug.split(/[-_\s]+/).filter(Boolean);
  if (!words.length) return raw;
  /* Keep language tags like "en" or "ur" as a prefix rather than shouting them. */
  const titled = words.map((w, i) =>
    i === 0 && w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1),
  );
  return titled.join(' ');
}

/**
 * `author` is null across the whole snapshot, so a subtitle built on it would
 * be blank for all 390 editions. Language and variant are always there, and the
 * variant is what tells apart the four copies of the same translation.
 */
export function editionSubtitle(edition: QuranApiEdition): string {
  const language = languageName(edition);
  const variant = variantLabel(edition.variant);
  return `${language} · ${variant}`;
}

/**
 * Quran editions answer "English"; Tafsir editions answer "en". Fall back to
 * the code itself rather than showing a person their own locale string.
 */
export function languageName(edition: QuranApiEdition): string {
  const name = (edition.languageName || '').trim();
  if (!name || name === edition.language) return (edition.language || '').toUpperCase();
  return name;
}

/**
 * A display list, sorted so a person can actually find something.
 *
 * Editions are grouped by name and language because one work appears up to four
 * times, once per variant - four separate IDs all called
 * "en-sahih-international". Sorting on name alone would leave them in whatever
 * order the catalog happened to emit, so variant breaks the tie.
 */
export type EditionChoice = { edition: QuranApiEdition; label: string; subtitle: string; group: string };

export function toEditionChoices(editions: QuranApiEdition[]): EditionChoice[] {
  return editions
    .map((edition) => ({
      edition,
      label: editionDisplayName(edition),
      subtitle: editionSubtitle(edition),
      group: languageName(edition),
    }))
    .sort((a, b) =>
      a.group.localeCompare(b.group) ||
      a.label.localeCompare(b.label) ||
      a.subtitle.localeCompare(b.subtitle),
    );
}

/* ==================== Diagnostics ==================== */

/**
 * Everything the rollout gate asks about, in one call. Used by a diagnostics
 * screen and by the smoke test; cheap enough to run on demand.
 */
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
  await push('manifest', async () => {
    const m = await getManifest();
    const c = m.counts || {};
    return `${c.quranEditions} quran / ${c.tafsirEditions} tafsir @ ${c.ayahsPerEdition} ayahs`;
  });
  await push('quran catalog', async () => `${(await getEditions('quran', { force: true })).length} editions`);
  await push('tafsir catalog', async () => `${(await getEditions('tafsir', { force: true })).length} editions`);
  await push('surah 1 + 114', async () => {
    const [en] = (await getEditions('quran')).filter((e) => e.language === 'en' && e.variant === 'simple');
    if (!en) throw new Error('no simple English edition');
    const a = await getSurah('quran', en.id, 1, { force: true });
    const b = await getSurah('quran', en.id, 114, { force: true });
    if (a.rows.length !== 7 || b.rows.length !== 6) throw new Error(`got ${a.rows.length}/${b.rows.length}`);
    return `${a.rows.length} + ${b.rows.length} ayahs`;
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
export async function clearIslamicDataCache(category?: IslamicDataCategory) {
  cachedDataVersion = null;
  etagCache = null;
  try {
    await AsyncStorage.removeItem(ETAGS_KEY);
  } catch {
    /* Nothing to clear if the store is unreachable. */
  }
  const { clearCacheNamespace } = await import('./contentCache');
  if (category) await clearCacheNamespace(category);
  else {
    await clearCacheNamespace('quran');
    await clearCacheNamespace('tafsir');
  }
}
