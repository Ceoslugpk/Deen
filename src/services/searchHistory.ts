import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeText } from './storage';

/**
 * What has been typed into a search bar lately, kept per search.
 *
 * Each search keeps its own list rather than sharing one. Typing "mercy" into
 * the Quran's full-text search and then opening the surah list would otherwise
 * offer "mercy" as something to type again, and there it filters by nothing at
 * all — a suggestion that cannot work is worse than no suggestion. City search
 * is the exception: the onboarding screen and the location screen are the same
 * question asked in two places, so they share a scope on purpose.
 *
 * Ten is enough to be useful and short enough to scan. A term is moved to the
 * front rather than duplicated, so the list reads newest first without
 * repeating itself.
 */
const PREFIX = '@deen/search-history/';
const LIMIT = 10;

/**
 * The Quran's list used to live under the preferences store. It is lifted into
 * here the first time it is read so nobody loses what they had typed before
 * the other searches learned to remember.
 */
const LEGACY_QURAN_KEY = '@deen/quran/searches/v1';

const key = (scope: string) => `${PREFIX}${scope}/v1`;

async function read(scope: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key(scope));
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    }
  } catch { /* an unreadable list is an empty list */ }
  return [];
}

async function write(scope: string, list: string[]): Promise<string[]> {
  await writeText(key(scope), JSON.stringify(list));
  return list;
}

export async function loadSearchHistory(scope: string): Promise<string[]> {
  const list = await read(scope);
  if (list.length) return list;
  /* Nothing here yet: the Quran's older store may still hold some. */
  if (scope === 'quran') {
    try {
      const old = await AsyncStorage.getItem(LEGACY_QURAN_KEY);
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed) && parsed.length) {
          const carried = parsed.filter((x) => typeof x === 'string').slice(0, LIMIT);
          if (carried.length) return write(scope, carried);
        }
      }
    } catch { /* nothing to carry */ }
  }
  return [];
}

/** Put a term at the front of its list. Returns the new list. */
export async function addSearchHistory(scope: string, query: string): Promise<string[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return read(scope);
  const all = await read(scope);
  return write(scope, [trimmed, ...all.filter((x) => x !== trimmed)].slice(0, LIMIT));
}

/** Drop one term, for a long press. Returns the new list. */
export async function removeSearchHistory(scope: string, query: string): Promise<string[]> {
  const all = await read(scope);
  return write(scope, all.filter((x) => x !== query));
}

export async function clearSearchHistory(scope: string): Promise<void> {
  await write(scope, []);
}
