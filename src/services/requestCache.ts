import { getCachedJson, setCachedJson, CacheNamespace } from './contentCache';

/**
 * The layer above the offline cache.
 *
 * The offline cache is a disk. That is exactly right for surviving a restart
 * and for reading with the network off, but it is the wrong place to go for
 * something the app asked for ninety seconds ago and is still holding: every
 * read is a trip to IndexedDB or the filesystem followed by a fresh parse of
 * the whole payload, and a screen that is opened and closed ten times pays
 * that ten times.
 *
 * So there are three layers, and each one is asked in order:
 *
 *   1. memory   - what this session has already parsed. Costs nothing.
 *   2. disk     - what an earlier session saved. Costs a read and a parse.
 *   3. network  - costs the most, and is the only one that can fail.
 *
 * Two other things happen here that no layer below does:
 *
 * Requests are joined. When two parts of the screen want the same thing at
 * the same moment, one request goes out and both wait for it. Without this,
 * opening a screen that asks for the same catalogue from two places sends
 * two identical requests and pays for both.
 *
 * Stale answers are given immediately. Something held a little too long is
 * shown straight away and refreshed behind it, rather than making the person
 * watch a spinner while a byte-identical copy downloads. Only a first-ever
 * request has to wait.
 */

type Entry<T> = { value: T; at: number; bytes: number };

/**
 * How much one session may hold.
 *
 * A count alone is not a budget. Preparing the Quran for offline reads all
 * one hundred and fourteen surahs one after another, and a limit of "a
 * hundred and twenty things" would let that one job fill the whole cache and
 * push out everything else the app was keeping — on the same small phones the
 * rest of this file is meant to help. So entries are counted and weighed, and
 * the weight is the one that really binds: eight megabytes of parsed text,
 * which is a few long surahs or a great many small things, and small enough
 * that it cannot itself become the memory problem.
 */
const MEMORY_LIMIT = 120;
const MEMORY_BYTES = 8 * 1024 * 1024;
const memory = new Map<string, Entry<unknown>>();
let memoryBytes = 0;

/**
 * Roughly how much room a value takes, without serialising it.
 *
 * Only used to decide when to let go of something, so being approximate costs
 * nothing: it walks the structure once and charges two bytes a character,
 * which is what JavaScript actually spends on a string.
 */
function weigh(value: unknown): number {
  if (typeof value === 'string') return value.length * 2;
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) return 8;
  if (Array.isArray(value)) return 16 + value.reduce((n, item) => n + weigh(item), 0);
  if (typeof value === 'object') return 32 + Object.values(value as object).reduce((n, item) => n + weigh(item), 0);
  return 8;
}

/** Requests already on the wire, so a second caller joins rather than repeats. */
const inFlight = new Map<string, Promise<unknown>>();

function memKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

function remember<T>(k: string, value: T): T {
  /* Delete before set so a re-read moves the entry to the end: Map iterates in
     insertion order, so the oldest entry is always first and the newest last.
     That makes eviction a shift rather than a sort. */
  const previous = memory.get(k);
  if (previous) memoryBytes -= previous.bytes;
  memory.delete(k);
  const bytes = weigh(value);
  memory.set(k, { value, at: Date.now(), bytes });
  memoryBytes += bytes;
  trim();
  return value;
}

/** Let go of the oldest entries until both budgets are satisfied. */
function trim(): void {
  while (memory.size > MEMORY_LIMIT || (memoryBytes > MEMORY_BYTES && memory.size > 1)) {
    const oldest = memory.keys().next().value as string | undefined;
    if (oldest === undefined) break;
    const gone = memory.get(oldest);
    if (gone) memoryBytes -= gone.bytes;
    memory.delete(oldest);
  }
}

/** Forget one payload, because the caller knows it changed. */
export function forgetCached(namespace: string, key: string): void {
  const k = memKey(namespace, key);
  const gone = memory.get(k);
  if (gone) memoryBytes -= gone.bytes;
  memory.delete(k);
}

/** Forget every parsed payload. For a language or edition change. */
export function clearRequestMemory(): void {
  memory.clear();
  memoryBytes = 0;
}

export type CachedOptions = {
  /** How long a stored answer stays acceptable without being revalidated. */
  ttlMs?: number;
  /**
   * How long a stale answer may still be shown while a fresh one loads.
   * Zero means a stale answer is never shown — the caller waits.
   */
  staleMs?: number;
  /** Keep the stored copy out of the eviction queue. For the Arabic text. */
  pinned?: boolean;
  /** Skip the disk entirely. For small things not worth persisting. */
  memoryOnly?: boolean;
};

/**
 * One value, through all three layers.
 *
 * The first call for a key waits for the network. Every call after that is
 * answered from memory until the TTL runs out, then from disk, and only then
 * from the network again — and even then the old answer is handed over first
 * if `staleMs` allows it, so the screen fills in immediately.
 *
 * A failed request is never stored, so an error cannot become the answer
 * everyone keeps getting. If a stale copy exists it is used instead.
 */
export async function cached<T>(
  namespace: CacheNamespace,
  key: string,
  fetcher: () => Promise<T>,
  options: CachedOptions = {},
): Promise<T> {
  const { ttlMs = 24 * 60 * 60 * 1000, staleMs = 7 * 24 * 60 * 60 * 1000, pinned, memoryOnly } = options;
  const k = memKey(namespace, key);
  const now = Date.now();

  const hit = memory.get(k) as Entry<T> | undefined;
  if (hit && now - hit.at < ttlMs) return hit.value;
  if (hit) { memoryBytes -= hit.bytes; memory.delete(k); }

  /* A request for this key is already out. Join it rather than sending another;
     this is what stops a screen with two callers making two identical calls. */
  const pending = inFlight.get(k) as Promise<T> | undefined;
  if (pending) return pending;

  const run = (async (): Promise<T> => {
    if (!memoryOnly) {
      const stored = await getCachedJson<{ at: number; value: T }>(namespace, key).catch(() => null);
      if (stored && typeof stored.at === 'number') {
        const age = Date.now() - stored.at;
        if (age < ttlMs) return remember(k, stored.value);
        /* Too old to trust, recent enough to show. Hand it over now and let
           the refresh land behind it. */
        if (stored.value != null && age < staleMs) {
          remember(k, stored.value);
          void refresh();
          return stored.value;
        }
      }
    }
    return refresh();

    async function refresh(): Promise<T> {
      const value = await fetcher();
      remember(k, value);
      if (!memoryOnly && value != null) {
        await setCachedJson(namespace, key, { at: Date.now(), value }, { pinned }).catch(() => undefined);
      }
      return value;
    }
  })();

  inFlight.set(k, run);
  try {
    return await run;
  } finally {
    inFlight.delete(k);
  }
}

/**
 * A single-flight request with no storage at all.
 *
 * For things that should always be live — a search box, a freshness check —
 * where the only thing worth fixing is two callers asking at the same instant
 * and sending the same request twice.
 */
export async function singleFlight<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const pending = inFlight.get(`flight:${key}`) as Promise<T> | undefined;
  if (pending) return pending;
  const run = (async () => fetcher())();
  inFlight.set(`flight:${key}`, run);
  try {
    return await run;
  } finally {
    inFlight.delete(`flight:${key}`);
  }
}

/** How much the session is holding, for the storage screens. */
export function requestMemorySize(): { entries: number; bytes: number; inflight: number } {
  return { entries: memory.size, bytes: memoryBytes, inflight: inFlight.size };
}
