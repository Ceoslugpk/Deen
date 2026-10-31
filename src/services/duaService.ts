import { Dua, DuaCategory, getDuaCategories, getDuasByCategory } from './api';
import { getCachedJson, setCachedJson } from './contentCache';

/**
 * Phase 3 — Duas and Adhkar.
 *
 * Live source: Islamic.app dhikr (api.islamic.app/v1/dhikr), which republishes
 * Hisn al-Muslim with 132 occasions and fourteen shortcuts (morning, evening,
 * after-prayer, before-sleep, waking-up, prayer, mosque, travel, food, home,
 * anxiety, protection, forgiveness, hajj).
 *
 * Nothing is bundled, so "offline content" here means this: the first time an
 * occasion is opened its duas are written to the local content cache, and the
 * cache is used as the fallback whenever the network is unavailable.
 */

const CATEGORY_KEY = 'dua-categories-v1';
const TTL = 30 * 24 * 3600 * 1000;

let categoriesCache: { savedAt: number; shortcuts: string[]; categories: DuaCategory[] } | null = null;

export async function loadDuaCategories(force = false) {
  if (!force && categoriesCache) return categoriesCache;
  if (!force) {
    const cached = await getCachedJson<typeof categoriesCache>('daily', CATEGORY_KEY).catch(() => null);
    if (cached && Array.isArray(cached.categories) && cached.categories.length) {
      categoriesCache = cached;
      return cached;
    }
  }
  try {
    const fresh = await getDuaCategories();
    const payload = { savedAt: Date.now(), ...fresh };
    categoriesCache = payload;
    void setCachedJson('daily', CATEGORY_KEY, payload).catch(() => undefined);
    return payload;
  } catch (error) {
    if (categoriesCache) return categoriesCache;
    const stale = await getCachedJson<typeof categoriesCache>('daily', CATEGORY_KEY).catch(() => null);
    if (stale) return stale;
    throw error;
  }
}

export async function loadDuas(key: string, force = false): Promise<{ duas: Dua[]; cached: boolean; savedAt: number }> {
  const cacheKey = `dua-${key}`;
  if (!force) {
    const cached = await getCachedJson<{ savedAt: number; duas: Dua[] }>('daily', cacheKey).catch(() => null);
    if (cached && Array.isArray(cached.duas) && cached.duas.length && Date.now() - cached.savedAt < TTL) {
      return { duas: cached.duas, cached: true, savedAt: cached.savedAt };
    }
  }
  try {
    const duas = await getDuasByCategory(key);
    const savedAt = Date.now();
    void setCachedJson('daily', cacheKey, { savedAt, duas }).catch(() => undefined);
    return { duas, cached: false, savedAt };
  } catch (error) {
    const stale = await getCachedJson<{ savedAt: number; duas: Dua[] }>('daily', cacheKey).catch(() => null);
    if (stale && Array.isArray(stale.duas) && stale.duas.length) return { duas: stale.duas, cached: true, savedAt: stale.savedAt };
    throw error;
  }
}

