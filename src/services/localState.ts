import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PrayerSnapshot } from './api';

export type TimeFormat = '12' | '24';
export type Madhab = 'shafi' | 'hanafi';
export type WorshipSettings = {
  calculationMethod: number;
  calculationMethodName: string;
  madhab: Madhab;
  timeFormat: TimeFormat;
};
export type StoredLocation = { latitude: number; longitude: number; label: string };

export const DEFAULT_WORSHIP_SETTINGS: WorshipSettings = {
  calculationMethod: 8,
  calculationMethodName: 'Gulf Region',
  madhab: 'shafi',
  timeFormat: '12',
};

const KEYS = {
  settings: '@deen/worship-settings/v1',
  location: '@deen/location/v1',
  prayerCache: '@deen/prayer-cache/v1',
  prayerCompletion: '@deen/prayer-completion/v1',
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadWorshipSettings(): Promise<WorshipSettings> {
  const saved = await readJson<Partial<WorshipSettings>>(KEYS.settings);
  return { ...DEFAULT_WORSHIP_SETTINGS, ...saved };
}

export async function saveWorshipSettings(settings: WorshipSettings) {
  await writeJson(KEYS.settings, settings);
}

export async function loadStoredLocation() {
  return readJson<StoredLocation>(KEYS.location);
}

export async function saveStoredLocation(location: StoredLocation | null) {
  if (!location) return AsyncStorage.removeItem(KEYS.location);
  return writeJson(KEYS.location, location);
}

type PrayerCache = {
  key: string;
  fetchedAt: number;
  snapshot: PrayerSnapshot;
};

const prayerCacheKey = (latitude: number, longitude: number, method: number, school: Madhab) =>
  `${latitude.toFixed(3)}:${longitude.toFixed(3)}:${method}:${school}:${new Date().toISOString().slice(0, 10)}`;

export async function loadPrayerCache(latitude: number, longitude: number, method: number, school: Madhab) {
  const cached = await readJson<PrayerCache>(KEYS.prayerCache);
  if (!cached || cached.key !== prayerCacheKey(latitude, longitude, method, school)) return null;
  return cached;
}

export async function savePrayerCache(latitude: number, longitude: number, method: number, school: Madhab, snapshot: PrayerSnapshot) {
  const cached: PrayerCache = {
    key: prayerCacheKey(latitude, longitude, method, school),
    fetchedAt: Date.now(),
    snapshot,
  };
  await writeJson(KEYS.prayerCache, cached);
}

export async function loadPrayerCompletion(dateKey: string): Promise<string[]> {
  const all = await readJson<Record<string, string[]>>(KEYS.prayerCompletion) || {};
  return all[dateKey] || [];
}

export async function savePrayerCompletion(dateKey: string, completed: string[]) {
  const all = await readJson<Record<string, string[]>>(KEYS.prayerCompletion) || {};
  all[dateKey] = completed;
  const keys = Object.keys(all).sort().slice(-60);
  await writeJson(KEYS.prayerCompletion, Object.fromEntries(keys.map(key => [key, all[key]])));
}
