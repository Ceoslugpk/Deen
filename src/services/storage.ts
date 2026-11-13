/**
 * The one way this app writes to disk.
 *
 * Everything the app remembers — the language you chose, the prayers you
 * marked, the verses you saved, the count on your tasbih — goes through
 * AsyncStorage. Until now each service called it directly, and most of those
 * calls ended in `.catch(() => undefined)`: a write that failed was a write
 * nobody heard about. The symptom is not an error message. It is a language
 * that quietly returns to English on the next launch, or a count that is
 * lower than it was yesterday, with nothing anywhere to explain why.
 *
 * So the writes come through here instead, and this layer promises four
 * things:
 *
 * 1. A write is retried. Storage on a phone fails transiently — the native
 *    module is still warming up, the process was backgrounded mid-write, the
 *    sandbox was not ready. Two more attempts with a short pause between
 *    them turns most of those into a success.
 * 2. A write of anything small is checked. The value is read back and
 *    compared, because a `setItem` that resolved is not the same as a value
 *    that is on the disk. Large blobs are exempt: reading a megabyte back to
 *    check it would cost more than the risk it removes.
 * 3. A write that cannot be made is not silent. It is counted, remembered,
 *    and offered to anything listening, so a screen can say so rather than
 *    leaving a person to notice on their own.
 * 4. Writes to one key do not overtake each other. Two changes to the same
 *    key fired in quick succession used to race, and the loser landed last.
 *    They queue here instead.
 *
 * Nothing here deletes anything of the reader's. When storage is genuinely
 * full, the only thing that gives way is a cache, and only a cache that
 * registered itself as expendable. Saved prayers, fasts, journal entries and
 * counts are never evicted, and no heuristic ever decides a record is stale.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/** How many times a single operation is attempted before it is given up. */
const ATTEMPTS = 3;
/** Pauses between attempts. Short: a retry that takes a second is a stall. */
const BACKOFF_MS = [0, 60, 240];
/**
 * Values at or below this size are read back and compared after writing.
 * Bigger than this and the check would cost more than it is worth.
 */
const VERIFY_LIMIT = 8 * 1024;

export type StorageFailure = {
  key: string;
  op: 'read' | 'write' | 'remove';
  message: string;
  /** When, as a Unix millisecond stamp. */
  at: number;
  attempts: number;
};

const failures: StorageFailure[] = [];
const listeners = new Set<(failure: StorageFailure) => void>();

/**
 * Heard whenever a write or a read has failed and will not be retried again.
 *
 * Returns its own unsubscribe. Nothing is thrown to the caller: a screen
 * that is being read should not be interrupted by a disk that is full.
 */
export function onStorageFailure(listener: (failure: StorageFailure) => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** What is known about storage right now, for a screen that wants to say. */
export function storageHealth(): { failed: number; last: StorageFailure | null } {
  return { failed: failures.length, last: failures.length ? failures[failures.length - 1] : null };
}

function report(failure: StorageFailure) {
  failures.push(failure);
  /* Kept to the recent past rather than growing for a whole session. */
  if (failures.length > 50) failures.splice(0, failures.length - 50);
  if (__DEV__) console.warn(`[storage] ${failure.op} failed for ${failure.key}: ${failure.message}`);
  listeners.forEach((listener) => {
    try { listener(failure); } catch { /* a listener that throws must not stop the others */ }
  });
}

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Storage that is out of room says so in one of these ways. */
function isQuotaError(error: unknown): boolean {
  const message = messageOf(error).toLowerCase();
  return (
    message.includes('quota') ||
    message.includes('exceeded') ||
    message.includes('full') ||
    message.includes('database or disk is full') ||
    message.includes('no space')
  );
}

/**
 * Something that can be thrown away when the disk is full.
 *
 * A cache registers one of these. It frees what it can and reports how many
 * characters it released, so the layer knows whether freeing anything was
 * worth trying again. Nothing that holds a reader's own record may register:
 * the eviction path must never be able to touch a prayer, a fast, a count or
 * a note.
 */
export type Evictor = { name: string; free: () => Promise<number> };

const evictors: Evictor[] = [];

export function registerEvictor(evictor: Evictor): () => void {
  evictors.push(evictor);
  return () => {
    const index = evictors.indexOf(evictor);
    if (index >= 0) evictors.splice(index, 1);
  };
}

let evicting: Promise<number> | null = null;

/**
 * Ask the caches to give something back, once, however many writes are
 * waiting. Two writes that both hit the quota must not both tear the cache
 * down.
 */
async function freeSomeSpace(): Promise<number> {
  if (!evicting) {
    evicting = (async () => {
      let freed = 0;
      for (const evictor of evictors) {
        try { freed += await evictor.free(); } catch { /* a cache that will not shrink is skipped */ }
      }
      return freed;
    })().finally(() => { evicting = null; });
  }
  return evicting;
}

/**
 * One key at a time.
 *
 * Two writes to the same key fired together used to resolve in whichever
 * order storage happened to take them, which meant a slow earlier write could
 * land over a later one. Queuing per key keeps the last value asked for the
 * last value stored.
 */
const queues = new Map<string, Promise<unknown>>();

function enqueue<T>(key: string, run: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) || Promise.resolve();
  const next = previous.then(run, run);
  queues.set(key, next.catch(() => undefined));
  return next;
}

const sleep = (ms: number) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve());

/** The pause before attempt `index`, or null when there are no attempts left. */
const backoffFor = (index: number) => (index < BACKOFF_MS.length ? BACKOFF_MS[index] : null);

/**
 * Read a key, retrying.
 *
 * A read that fails returns null, and null is what an empty key returns too
 * — so a transient failure at startup read exactly like a person who had
 * never chosen a language. That is why reads are retried here and not only
 * writes.
 */
export function readText(key: string): Promise<string | null> {
  return enqueue(key, async () => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        const backoff = backoffFor(attempt);
        if (backoff === null) {
          report({ key, op: 'read', message: messageOf(error), at: Date.now(), attempts: attempt + 1 });
          return null;
        }
        await sleep(backoff);
      }
    }
    return null;
  });
}

export type WriteOptions = {
  /**
   * Read the value back and check it landed. On by default for anything
   * small. Turn it off for a value that is written often and matters little.
   */
  verify?: boolean;
};

/**
 * Write a key. Returns whether it is on the disk.
 *
 * The return value is the point of this function: callers that would
 * otherwise have swallowed the failure can now say something, and callers
 * that must not continue without it can stop.
 */
export async function writeText(key: string, value: string, options: WriteOptions = {}): Promise<boolean> {
  const shouldVerify = options.verify ?? value.length <= VERIFY_LIMIT;
  return enqueue(key, async () => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      try {
        await AsyncStorage.setItem(key, value);
        if (shouldVerify) {
          const stored = await AsyncStorage.getItem(key);
          if (stored === value) return true;
          /* Stored but different: something else wrote over it, or the
             value was truncated. Either way it goes round again. */
        } else {
          return true;
        }
      } catch (error) {
        if (isQuotaError(error) && evictors.length) {
          await freeSomeSpace();
        }
      }
      const backoff = backoffFor(attempt);
      if (backoff === null) break;
      await sleep(backoff);
    }
    report({
      key,
      op: 'write',
      message: shouldVerify ? 'the value could not be saved' : 'the write did not succeed',
      at: Date.now(),
      attempts: ATTEMPTS,
    });
    return false;
  });
}

export async function removeKey(key: string): Promise<boolean> {
  return enqueue(key, async () => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      try {
        await AsyncStorage.removeItem(key);
        return true;
      } catch (error) {
        const backoff = backoffFor(attempt);
        if (backoff === null) {
          report({ key, op: 'remove', message: messageOf(error), at: Date.now(), attempts: attempt + 1 });
          return false;
        }
        await sleep(backoff);
      }
    }
    return false;
  });
}

/** Read a key holding JSON. A failed or corrupt read gives the fallback. */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await readText(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write a key holding JSON. False means it did not reach the disk. */
export function writeJson(key: string, value: unknown, options?: WriteOptions): Promise<boolean> {
  let encoded: string;
  try {
    encoded = JSON.stringify(value);
  } catch (error) {
    report({ key, op: 'write', message: `could not be encoded: ${messageOf(error)}`, at: Date.now(), attempts: 1 });
    return Promise.resolve(false);
  }
  /* `undefined` is what JSON.stringify returns for a value it cannot hold,
     and storing the string "undefined" would read back as a value. */
  if (typeof encoded !== 'string') {
    report({ key, op: 'write', message: 'could not be encoded', at: Date.now(), attempts: 1 });
    return Promise.resolve(false);
  }
  return writeText(key, encoded, options);
}

/** The keys currently in storage, for the backup and the storage screen. */
export async function allKeys(): Promise<string[]> {
  try {
    return (await AsyncStorage.getAllKeys()) as string[];
  } catch (error) {
    report({ key: '*', op: 'read', message: messageOf(error), at: Date.now(), attempts: 1 });
    return [];
  }
}
