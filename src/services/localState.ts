import type { PrayerSnapshot } from './api';
import { readJson, readText, removeKey, writeJson, writeText } from './storage';
import { adhanTrack, ADHAN_TRACKS, DEFAULT_ADHAN_ID, DEFAULT_FAJR_ID, FAJR_TRACKS } from './adhanCatalog';

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
  /**
   * The recording for the five prayers other than Fajr.
   *
   * An id from ADHAN_TRACKS, not a label — labels change with language.
   */
  adhanReciter: string;
  /**
   * The recording for Fajr alone.
   *
   * Dawn carries its own call, longer and recited in its own manner, so it is
   * chosen separately. Setting this never touches the other five prayers, and
   * setting those never touches Fajr.
   */
  adhanFajrReciter: string;
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
  /* The Eid greeting and the drifting-light field that used to be switched
     from here are gone. Their keys stayed in saved settings on devices that
     had used them; they are dropped when a saved object is read, so an old
     install does not carry switches for a feature that no longer exists. */
};

/**
 * What those two switches were called while the feature existed.
 *
 * Kept only so the read below can name and drop them. They belong to
 * settings this build no longer has, so they are not part of
 * `WorshipSettings` and never will be again.
 */
type LegacyAmbienceSettings = {
  celebrateEid?: boolean;
  ambientEffects?: boolean;
  lastCelebratedEid?: string;
};

/** The four shortcuts a first-time opening shows. Ids, not labels. */
export const DEFAULT_DAY_TOOLS = ['quran', 'qibla', 'tasbih', 'audio'];
/**
 * A place we remember.
 *
 * `timezone` arrived with on-device prayer times. The calculation produces an
 * instant, not a time of day; which time of day it is depends on whose clock
 * reads it. Keeping the zone with the coordinates means a city picked in
 * Karachi still reads as Karachi time after the phone flies home, and it is
 * one IANA string rather than anything clever.
 */
export type StoredLocation = { latitude: number; longitude: number; label: string; timezone?: string };

/** Reads a stored object. Absent or unreadable is null — never a default. */
const readStored = <T>(key: string): Promise<T | null> => readJson<T | null>(key, null);

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
  // Ids from adhanCatalog, not labels - labels change with language.
  adhanReciter: DEFAULT_ADHAN_ID,
  adhanFajrReciter: DEFAULT_FAJR_ID,
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
  direction: '@deen/direction/v1',
};

export async function loadWorshipSettings(): Promise<WorshipSettings> {
  const saved = await readStored<Partial<WorshipSettings>>(KEYS.settings);
  /* The two ambience switches are gone from the app. Anything saved by an
     older build still carries them, and because this whole object is written
     back whenever any setting changes, they would otherwise be carried
     forward forever. They are dropped on read, which is the only place the
     saved copy and the shape in memory meet. */
  const { celebrateEid: _celebrateEid, ambientEffects: _ambientEffects, lastCelebratedEid: _lastCelebratedEid, ...rest } =
    (saved || {}) as Partial<WorshipSettings> & Partial<LegacyAmbienceSettings>;
  return {
    ...DEFAULT_WORSHIP_SETTINGS,
    ...rest,
    prayerReminders: { ...DEFAULT_WORSHIP_SETTINGS.prayerReminders, ...(rest.prayerReminders || {}) },
    adhanEnabled: { ...DEFAULT_WORSHIP_SETTINGS.adhanEnabled, ...(rest.adhanEnabled || {}) },
    /* Older builds stored 'makkah' and 'doha', ids that never matched an
       entry in the list - so the notification quietly fell back to the system
       tone while the screen showed a recording as chosen. Anything that does
       not name a recording we still carry is dropped in favour of the
       default, which is at least the adhan a person expected to hear. */
    adhanReciter: adhanTrack(rest.adhanReciter || '', adhanTrack(DEFAULT_ADHAN_ID, ADHAN_TRACKS[0])).id,
    adhanFajrReciter: adhanTrack(rest.adhanFajrReciter || '', adhanTrack(DEFAULT_FAJR_ID, FAJR_TRACKS[0])).id,
  };
}

export async function saveWorshipSettings(settings: WorshipSettings) {
  await writeJson(KEYS.settings, settings);
}

export async function loadStoredLocation() {
  return readStored<StoredLocation>(KEYS.location);
}

export async function saveStoredLocation(location: StoredLocation | null) {
  if (!location) { void removeKey(KEYS.location); return; }
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
  const cached = await readStored<PrayerCache>(KEYS.prayerCache);
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
  const all = await readJson<Record<string, string[]>>(KEYS.prayerCompletion, {});
  return all[dateKey] || [];
}

export async function savePrayerCompletion(dateKey: string, completed: string[]) {
  const all = await readJson<Record<string, string[]>>(KEYS.prayerCompletion, {});
  all[dateKey] = completed;
  /* Kept in full. This used to be trimmed to the last sixty days, which made a
     heat map of the whole record impossible - anything older than two months
     had already been deleted by the time you went looking for it. A year of
     days is around 365 short entries, so keeping all of them costs little and
     the record is the one thing here that cannot be recreated. */
  await writeJson(KEYS.prayerCompletion, all);
}

export async function loadPrayerHistory(): Promise<Record<string, string[]>> {
  return await readJson<Record<string, string[]>>(KEYS.prayerCompletion, {});
}

export async function loadDailyContent<T>(dateKey: string): Promise<T | null> {
  const cached = await readStored<{ dateKey: string; value: T }>(KEYS.dailyContent);
  return cached?.dateKey === dateKey ? cached.value : null;
}

export async function saveDailyContent<T>(dateKey: string, value: T) {
  return writeJson(KEYS.dailyContent, { dateKey, value });
}

export async function loadQuickTasbih(): Promise<number> {
  return (await readStored<number>(KEYS.tasbihQuick)) || 0;
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
  return readStored<OnboardingState>(KEYS.onboarding);
}

export async function saveOnboarding(value: OnboardingState) {
  await writeJson(KEYS.onboarding, value);
}

export async function clearOnboarding() {
  await removeKey(KEYS.onboarding);
}

/**
 * The interface language, remembered between launches.
 *
 * This is the one stored value whose loss is immediately visible: a read
 * that fails returns null, and null means English, so a transient hiccup at
 * startup put a person who had chosen Urdu back into an English app with no
 * explanation. Reads are retried here for that reason rather than assumed.
 */
export async function loadLanguage(): Promise<string | null> {
  return readText(KEYS.language);
}

/**
 * Remember the interface language. Returns whether it reached the disk.
 *
 * It used to swallow every failure, which is how a language could be chosen,
 * applied, and then be gone on the next launch while everything else about
 * the choice looked like it had worked. The write is retried and read back,
 * and the answer is handed back so the caller can tell the difference
 * between "saved" and "applied for now".
 */
export async function saveLanguage(code: string): Promise<boolean> {
  return writeText(KEYS.language, code);
}

/**
 * The layout direction already handed to I18nManager.
 *
 * forceRTL only takes effect on a fresh start, so switching language has to
 * restart the app. That restart must happen once per change and never again:
 * a device that reports the old direction back would otherwise restart on
 * every launch. This marker is what makes it a one-shot.
 */
export async function loadAppliedDirection(): Promise<'rtl' | 'ltr' | null> {
  const value = await readText(KEYS.direction);
  return value === 'rtl' || value === 'ltr' ? value : null;
}

/**
 * Record the direction handed to I18nManager. Returns whether it landed.
 *
 * This marker is what keeps the restart a one-shot, so a write that fails
 * here does not merely lose a setting — it restarts the app on every launch
 * that follows. It is retried like the others, and the caller is told.
 */
export async function saveAppliedDirection(value: 'rtl' | 'ltr'): Promise<boolean> {
  return writeText(KEYS.direction, value);
}
