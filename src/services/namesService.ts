import AsyncStorage from '@react-native-async-storage/async-storage';
import { DivineName, getNameOfDay, getNames } from './api';
import { getCachedJson, setCachedJson } from './contentCache';

/**
 * Phase 3 — the Beautiful Names.
 *
 * Live source: Islamic.app Asma al-Husna, which supplies the Arabic Name, its
 * transliteration and its meaning in nine languages. The full catalogue is small
 * enough to keep on the device, so once it has been fetched it is readable offline.
 */

const CATALOGUE_KEY = 'names-catalogue-v1';
const LANGUAGE_KEY = 'names-language-v1';
const TTL = 30 * 24 * 3600 * 1000;

let memory: { savedAt: number; names: DivineName[] } | null = null;
let inflight: Promise<DivineName[]> | null = null;

export async function loadNames(force = false): Promise<DivineName[]> {
  if (!force && memory && memory.names.length) return memory.names;
  if (!force && inflight) return inflight;
  const task = (async () => {
    if (!force) {
      const cached = await getCachedJson<{ savedAt: number; names: DivineName[] }>('daily', CATALOGUE_KEY).catch(() => null);
      if (cached && Array.isArray(cached.names) && cached.names.length && Date.now() - cached.savedAt < TTL) {
        memory = cached;
        return cached.names;
      }
    }
    try {
      const names = await getNames();
      memory = { savedAt: Date.now(), names };
      void setCachedJson('daily', CATALOGUE_KEY, memory).catch(() => undefined);
      return names;
    } catch (error) {
      if (memory) return memory.names;
      const stale = await getCachedJson<{ savedAt: number; names: DivineName[] }>('daily', CATALOGUE_KEY).catch(() => null);
      if (stale && Array.isArray(stale.names) && stale.names.length) return stale.names;
      throw error;
    }
  })();
  inflight = task;
  try {
    return await task;
  } finally {
    inflight = null;
  }
}

export async function loadNameOfDay(): Promise<DivineName | null> {
  try {
    return await getNameOfDay();
  } catch {
    const names = await loadNames().catch(() => []);
    if (!names.length) return null;
    const day = Math.floor(Date.now() / 86400000);
    return names[day % names.length];
  }
}

export async function loadNameLanguage() {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY).catch(() => null);
  return stored || 'en';
}

export async function saveNameLanguage(code: string) {
  await AsyncStorage.setItem(LANGUAGE_KEY, code).catch(() => undefined);
}
