import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PrayerSnapshot } from './api';

export type TimeFormat = '12' | '24';
export type Madhab = 'shafi' | 'hanafi';
export type WorshipSettings = {
  calculationMethod: number;
  calculationMethodName: string;
  madhab: Madhab;
  timeFormat: TimeFormat;
  remindersEnabled: boolean;
  reminderOffset: number;
  prayerReminders: Record<string, boolean>;
  quranReminderEnabled: boolean;
  quranReminderTime: string;
  adhanReciter: string;
  /**
   * Which prayers the adhan sounds for. On for the five prayers by default —
   * that is what a prayer app is for — but nothing sounds until permission has
   * actually been granted, and each prayer keeps its own switch.
   */
  adhanEnabled: Record<string, boolean>;
  /** A nudge back to your reading, half an hour after each adhan. */
  continueReadingReminder?: boolean;
  /** One verse each morning. */
  dailyVerseReminder?: boolean;
  dailyVerseTime?: string;
  /** One hadith each morning. */
  dailyHadithReminder?: boolean;
  dailyHadithTime?: string;
  /**
   * A reminder to read Surah Al-Mulk before sleeping.
   *
   * Off until a time has been chosen, because a reminder set to an hour the
   * person never picked is a guess, and a guess that wakes them at the wrong
   * time is worse than no reminder at all.
   */
  sleepReminderEnabled?: boolean;
  /** Kept as "HH:MM" in the person's own local time. */
  sleepReminderTime?: string;
  /** Buzz on every press. Off means silent everywhere, not per-screen. */
  hapticsEnabled: boolean;
  /**
   * Which four shortcuts sit under "For your day" on the Home screen.
   *
   * Stored as ids only. The labels, icons and destinations live with the
   * screen that draws them, so a tool can be renamed or moved without
   * stranding a saved choice. Anything unrecognised is dropped when the
   * row is built, and gaps are filled from the defaults — a saved list that
   * no longer matches anything must never leave a hole in the row.
   */
  dayTools?: string[];
};

/** The four shortcuts a first-time opening shows. Ids, not labels. */
export const DEFAULT_DAY_TOOLS = ['quran', 'qibla', 'tasbih', 'audio'];
export type StoredLocation = { latitude: number; longitude: number; label: string };

export const DEFAULT_WORSHIP_SETTINGS: WorshipSettings = {
  calculationMethod: 8,
  calculationMethodName: 'Gulf Region',
  madhab: 'shafi',
  timeFormat: '12',
  remindersEnabled: false,
  reminderOffset: 10,
  prayerReminders: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
  quranReminderEnabled: false,
  quranReminderTime: '20:00',
  // The id of an entry in ADHAN_OPTIONS, not its label.
  adhanReciter: 'makkah',
  adhanEnabled: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
  continueReadingReminder: true,
  dailyVerseReminder: false,
  dailyVerseTime: '08:00',
  dailyHadithReminder: false,
  dailyHadithTime: '09:00',
  sleepReminderEnabled: false,
  sleepReminderTime: '22:30',
  hapticsEnabled: true,
  dayTools: DEFAULT_DAY_TOOLS,
};

const KEYS = {
  settings: '@deen/worship-settings/v1',
  location: '@deen/location/v1',
  prayerCache: '@deen/prayer-cache/v1',
  prayerCompletion: '@deen/prayer-completion/v1',
  dailyContent: '@deen/daily-content/v1',
  tasbihQuick: '@deen/tasbih-quick/v1',
  onboarding: '@deen/onboarding/v1',
  language: '@deen/language/v1',
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
  return {
    ...DEFAULT_WORSHIP_SETTINGS,
    ...saved,
    prayerReminders: { ...DEFAULT_WORSHIP_SETTINGS.prayerReminders, ...(saved?.prayerReminders || {}) },
    adhanEnabled: { ...DEFAULT_WORSHIP_SETTINGS.adhanEnabled, ...(saved?.adhanEnabled || {}) },
  };
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

export async function loadPrayerHistory(): Promise<Record<string, string[]>> {
  return await readJson<Record<string, string[]>>(KEYS.prayerCompletion) || {};
}

export async function loadDailyContent<T>(dateKey: string): Promise<T | null> {
  const cached = await readJson<{ dateKey: string; value: T }>(KEYS.dailyContent);
  return cached?.dateKey === dateKey ? cached.value : null;
}

export async function saveDailyContent<T>(dateKey: string, value: T) {
  return writeJson(KEYS.dailyContent, { dateKey, value });
}

export async function loadQuickTasbih(): Promise<number> {
  return (await readJson<number>(KEYS.tasbihQuick)) || 0;
}

export async function saveQuickTasbih(value: number) {
  return writeJson(KEYS.tasbihQuick, value);
}

/**
 * What the first-run screens chose. Kept so the app opens where you left it,
 * and so the set-up can be walked through again from Settings.
 */
export type OnboardingState = {
  completed: boolean;
  /** The language of the interface. */
  app: string;
  /** The language of the Quran text beside the Arabic. */
  text: string;
  /** The language of the voice under the recitation. */
  voice: string;
  /**
   * Whether the place has been put to the person. Location is asked once,
   * here, and then never again — from then on it is a setting to change, not
   * a question to answer. Skipping still counts as having been asked.
   */
  locationAsked?: boolean;
  /** Whether notification permission has been put to them once. */
  notificationsAsked?: boolean;
  /** When it was finished, as a Unix millisecond stamp. */
  at?: number;
};

export async function loadOnboarding(): Promise<OnboardingState | null> {
  return readJson<OnboardingState>(KEYS.onboarding);
}

export async function saveOnboarding(value: OnboardingState) {
  await writeJson(KEYS.onboarding, value);
}

export async function clearOnboarding() {
  try {
    await AsyncStorage.removeItem(KEYS.onboarding);
  } catch {
    return;
  }
}

/** The interface language, remembered between launches. */
export async function loadLanguage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.language);
  } catch {
    return null;
  }
}

export async function saveLanguage(code: string) {
  try {
    await AsyncStorage.setItem(KEYS.language, code);
  } catch {
    return;
  }
}
