import { getCachedJson, setCachedJson } from './contentCache';
import { daysOfHijriMonth, gregorianForHijri, hijriForDate } from './hijri';
import { getChapters as getWorkerChapters, getDailyHadith as getWorkerDailyHadith, getEditions, getSurah, IslamicChapter, IslamicDataError, IslamicEdition } from './islamicDataApi';
import {
  ayahNumberToKey, convertTajweedMarkup, globalAyahNumber, isTajweedScript,
  juzOfVerse, juzVerseKeys, MUSHAF_PAGE_COUNT, pageOfVerse, pageSegments,
  QURAN_AYAH_COUNT, rubOfVerse, rubVerseKeys, scriptEditionId, versesInSurah,
} from './quranMeta';
import { DEFAULT_TRANSLATION_EDITION } from './quranState';
import {
  computeDayTimes,
  hijriLabel,
  methodName,
  PRAYER_NAMES,
} from './prayerTimes';

export type Prayer = { name: string; time: string; raw: string };
export type PrayerSnapshot = { prayers: Prayer[]; hijri: string; hijriAr?: string; hijriYear: number; hijriMonth: number; readable: string; timezone: string; method: string };
export type CalendarDay = { gregorian: string; weekday: string; weekdayAr?: string; hijriDay: number; hijriMonth: string; hijriMonthAr?: string; hijriMonthNumber: number; hijriYear: number; prayers: Prayer[] };
export type Chapter = { id: number; name_simple: string; name_arabic: string; verses_count: number; revelation_place?: string; translated_name?: { name: string } };
export type Verse = { id: number; verse_key: string; text_uthmani: string; translation?: string; audio?: string; page?: number; juz?: number; hizbQuarter?: number; surah_name?: string };
export type DailyHadith = { collection: string; number: string; text: string; arabic?: string };
export type DivineName = { number: number; name: string; transliteration: string; meaning: string; meanings: Record<string, string> };
export type DailyAyah = { reference: string; arabicReference?: string; arabic: string; translation: string };
export type QuranEdition = { identifier: string; language: string; englishName: string; name: string; type: string; direction?: string };
export type QuranSearchResult = { verseKey: string; surahId: number; surahName: string; ayah: number; text: string; edition: string };
export type AudioEdition = { identifier: string; language: string; englishName: string; name: string; type: string; direction?: string };
export type SurahAudioAyah = { numberInSurah: number; globalNumber: number; audio: string; text: string };
export type SurahReciter = { id: number; name: string; letter: string; server: string; moshaf: string; rewaya: string; surahTotal: number };

const ISLAMIC = 'https://api.islamic.app/v1';

/**
 * Per-ayah recitations, bundled and verified.
 *
 * Every identifier here was checked against the CDN before shipping. The
 * list the app used to fetch was 190 long and most of it did not resolve,
 * which is how a reciter ends up in the list and silent in the player.
 */
const AUDIO_TABLE: { base: string; editions: AudioEdition[] } =
  require('../data/audio-editions.json');
const AUDIO_BASE = AUDIO_TABLE.base;
const AUDIO_EDITIONS: AudioEdition[] = AUDIO_TABLE.editions;

/** What the app calls its Arabic scripts when it has to name one. */
const SCRIPT_NAMES: Record<string, string> = {
  'quran-uthmani': 'Uthmani',
  'quran-simple': "Imla'i Simple",
  'quran-indopak': 'IndoPak',
  'quran-tajweed': 'Tajweed colour',
  'quran-mushaf': 'Mushaf page',
};

/**
 * The meaning of a verse, from the app's own server.
 *
 * `getVerses` and its siblings were written when there was one provider for
 * everything, and they read the translation, the page number and the juz from
 * the same response. The app's own Worker serves the meaning but carries no
 * page index, so those two jobs have to come apart: the Arabic edition keeps
 * supplying where a verse sits, and the Worker supplies what it means.
 *
 * Which provider answers is decided by trying the Worker first and falling
 * back on a 404. It is not decided by inspecting the id, because an id that
 * looks like one thing and is another is exactly the mistake that leaves a
 * reader staring at a blank column, and a round trip tells you for certain.
 *
 * Results are held per surah for the session. Reading a surah touches this
 * once, and paging through every surah touches it 114 times, which the Worker
 * is happy to serve but a phone is not obliged to wait for twice.
 */
const workerSurahCache = new Map<string, Map<string, string> | null>();

async function workerTexts(editionId: string, surahs: Iterable<string>): Promise<Map<string, string> | null> {
  if (!editionId) return null;
  const out = new Map<string, string>();
  for (const surah of new Set(surahs)) {
    const cacheKey = `${editionId}:${surah}`;
    let rows = workerSurahCache.get(cacheKey);
    if (rows === undefined) {
      try {
        const response = await getSurah('quran', editionId, Number(surah));
        rows = new Map(response.rows.map((row) => [row.verseKey, row.text]));
      } catch (error) {
        /* A 404 means this is not one of ours, and the caller should ask the
           other provider. Anything else - offline, timeout - is not an answer
           either way, so it is not cached as one. */
        if (error instanceof IslamicDataError && error.status === 404) {
          workerSurahCache.set(cacheKey, null);
          return null;
        }
        return null;
      }
      workerSurahCache.set(cacheKey, rows);
    }
    if (rows === null) return null;
    for (const [key, value] of rows) out.set(key, value);
  }
  return out;
}

/**
 * The Arabic of one surah, from the app's own server.
 *
 * Scripts are addressed by our ids, which are not the ones the app has always
 * kept in a person's saved preferences, so the stored name is translated on
 * the way in. Tajweed comes back as HTML spans and is rewritten here into the
 * bracket form the renderer reads, which is also what every surah already
 * cached on a device is stored in - so converting on arrival means nothing
 * on disk goes stale and the component is left alone.
 */
async function scriptTexts(script: string, surah: number): Promise<Map<string, string> | null> {
  const editionId = scriptEditionId(script);
  const cacheKey = `script:${editionId}:${surah}`;
  const cached = workerSurahCache.get(cacheKey);
  if (cached !== undefined) return cached;
  try {
    const response = await getSurah('scripts', editionId, surah);
    const rows = new Map<string, string>();
    for (const row of response.rows) {
      rows.set(row.verseKey, isTajweedScript(editionId) ? convertTajweedMarkup(row.text) : row.text);
    }
    workerSurahCache.set(cacheKey, rows);
    return rows;
  } catch (error) {
    /* A missing script is not a reason to blank the reader: fall back to
       Uthmani, which every surah has. */
    if (error instanceof IslamicDataError && error.status === 404) {
      workerSurahCache.set(cacheKey, null);
      return null;
    }
    return null;
  }
}

/**
 * The Arabic for any list of verses, whichever surahs they straddle.
 *
 * Juz, hizb and Mushaf pages all cross surah boundaries, so the verses are
 * grouped by surah first and one request is made per surah rather than one
 * per verse.
 */
async function scriptTextsFor(script: string, keys: string[]): Promise<Map<string, string>> {
  const bySurah = new Map<string, string[]>();
  for (const key of keys) {
    const surah = key.split(':')[0];
    const list = bySurah.get(surah);
    if (list) list.push(key);
    else bySurah.set(surah, [key]);
  }
  const out = new Map<string, string>();
  await Promise.all(
    [...bySurah.keys()].map(async (surah) => {
      const rows = await scriptTexts(script, Number(surah));
      if (!rows) return;
      for (const key of bySurah.get(surah) || []) {
        const text = rows.get(key);
        if (text) out.set(key, text);
      }
    }),
  );
  return out;
}

async function json(url: string) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const body = await response.json();
  if (body.code && body.code !== 200) throw new Error(body.status || 'API request failed');
  return body.data;
}

/** The device's own IANA zone, as a fallback when a place has not named one. */
function deviceZoneName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

const cleanTime = (value: string) => value?.split(' ')[0] ?? '';
const displayTime = (value: string, format: '12' | '24' = '12') => {
  const [h, m] = cleanTime(value).split(':').map(Number);
  if (!Number.isFinite(h)) return '';
  if (format === '24') return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

/**
 * `timezone` is an IANA name. Prayer times are instants; the zone says whose
 * clock reads them. Without one we use the device's, which is right whenever
 * the person is in the place they have selected.
 */
export type PrayerRequestOptions = {
  method?: number;
  school?: 'shafi' | 'hanafi';
  timeFormat?: '12' | '24';
  timezone?: string;
};

/**
 * Today's times, worked out on the device.
 *
 * This used to call AlAdhan. It no longer does: the calculation is done here
 * from the coordinates and the date, so it needs no connection, tells a third
 * party nothing about where you are, and keeps working when the network does
 * not. The Hijri line comes from the bundled Umm al-Qura table rather than
 * the arithmetic approximation, because the month view matches events by
 * Hijri date and a day either side of the first of Ramadan is not a rounding
 * error.
 */
export async function getPrayerSnapshot(latitude = 25.2048, longitude = 55.2708, options: PrayerRequestOptions = {}): Promise<PrayerSnapshot> {
  const method = options.method ?? 8;
  const school = options.school === 'hanafi' ? 'hanafi' : 'shafi';
  const timeFormat = options.timeFormat ?? '12';

  const now = new Date();
  const times = computeDayTimes(latitude, longitude, now, method, school, options.timezone);
  const prayers = PRAYER_NAMES.map(name => ({
    name,
    raw: times[name],
    time: displayTime(times[name], timeFormat),
  }));

  const h = hijriLabel(now);
  return {
    prayers,
    hijri: h.hijri,
    hijriAr: h.hijriAr,
    hijriYear: h.hijriYear,
    hijriMonth: h.hijriMonth,
    readable: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    timezone: options.timezone || deviceZoneName(),
    method: methodName(method),
  };
}

export async function getPrayerTimes(latitude = 25.2048, longitude = 55.2708): Promise<Prayer[]> {
  return (await getPrayerSnapshot(latitude, longitude)).prayers;
}

/**
 * A Gregorian month of days, each with its times and its Hijri date.
 *
 * The calendar screen's month view. It now runs on the device for the same
 * reason the day card does; it delegates to the month builder below rather
 * than keeping its own copy of the arithmetic.
 */
export async function getGregorianCalendar(
  latitude: number,
  longitude: number,
  month: number,
  year: number,
  options: PrayerRequestOptions = {},
): Promise<CalendarDay[]> {
  return getPrayerCalendar(latitude, longitude, month, year, { method: 8, ...options });
}

/**
 * A month of prayer times, from AlAdhan's calendar endpoint - the same source
 * today's card uses, so the two cannot disagree.
 *
 * The method and the Asr school are the ones chosen in Settings rather than
 * the API's defaults. A week that applied a different rule from the day above
 * it would be worse than showing nothing.
 */
export async function getPrayerCalendar(
  latitude: number,
  longitude: number,
  month: number,
  year: number,
  options: PrayerRequestOptions = {},
): Promise<CalendarDay[]> {
  const method = options.method ?? 8;
  const school = options.school === 'hanafi' ? 'hanafi' : 'shafi';
  const timeFormat = options.timeFormat ?? '12';

  /*
   * Built a day at a time rather than fetched a month at a time. Each day is
   * an independent calculation, which is what makes a month of them instant
   * and offline: there is no month-length request to wait on and no partially
   * filled calendar when the connection drops halfway.
   */
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day);
    const times = computeDayTimes(latitude, longitude, date, method, school, options.timezone);
    const h = hijriLabel(date);
    days.push({
      gregorian: `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`,
      weekday: date.toLocaleDateString('en', { weekday: 'long' }),
      weekdayAr: date.toLocaleDateString('ar-u-nu-latn', { weekday: 'long' }),
      hijriDay: h.hijriDay,
      hijriMonth: h.hijriMonthName,
      hijriMonthAr: h.hijriMonthNameAr,
      hijriMonthNumber: h.hijriMonth,
      hijriYear: h.hijriYear,
      prayers: PRAYER_NAMES.map(name => ({
        name,
        raw: times[name],
        time: displayTime(times[name], timeFormat),
      })),
    });
  }
  return days;
}

/**
 * A run of consecutive Gregorian months as one list of days.
 *
 * Fixed Hijri dates - Ashura, the Eids, the start of Ramadan - do not fall on
 * a predictable Gregorian day, so the only honest way to say when one lands is
 * to read the mapping for the months it could fall in. This fetches those
 * months once and hands them back in order.
 */
export async function getCalendarSpan(
  latitude: number,
  longitude: number,
  months: number,
  options: PrayerRequestOptions = {},
): Promise<CalendarDay[]> {
  const now = new Date();
  const wanted: [number, number][] = [];
  for (let ahead = 0; ahead < months; ahead += 1) {
    const when = new Date(now.getFullYear(), now.getMonth() + ahead, 1);
    wanted.push([when.getFullYear(), when.getMonth() + 1]);
  }
  /* Three at a time rather than a dozen at once - the endpoint throttles a
     burst - and a month that fails is dropped rather than losing the lot.
     A partial map still answers "when is Eid"; an empty one answers nothing. */
  const out: CalendarDay[] = [];
  for (let i = 0; i < wanted.length; i += 3) {
    const batch = wanted.slice(i, i + 3);
    const settled = await Promise.allSettled(
      batch.map(([y, mo]) => getPrayerCalendar(latitude, longitude, mo, y, options)),
    );
    for (const result of settled) if (result.status === 'fulfilled') out.push(...result.value);
  }
  // `out` is built in order because the batches are awaited in order
  return out;
}

/**
 * The days of Ramadan, worked out on the device.
 *
 * Ramadan is a Hijri month, so finding it means knowing when that month
 * begins in ordinary dates — which the bundled Umm al-Qura table answers
 * directly. Each day is then calculated like any other. Nothing here needs a
 * connection, which matters most for exactly this screen: a month of suhoor
 * and iftar times is the thing you are most likely to want with no signal.
 */
export async function getRamadanCalendar(
  latitude: number,
  longitude: number,
  hijriYear: number,
  options: PrayerRequestOptions = {},
): Promise<CalendarDay[]> {
  const method = options.method ?? 8;
  const school = options.school === 'hanafi' ? 'hanafi' : 'shafi';
  const timeFormat = options.timeFormat ?? '12';

  return daysOfHijriMonth(hijriYear, 9).map((date) => {
    const times = computeDayTimes(latitude, longitude, date, method, school, options.timezone);
    const h = hijriLabel(date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return {
      gregorian: `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`,
      weekday: date.toLocaleDateString('en', { weekday: 'long', timeZone: 'UTC' }),
      weekdayAr: date.toLocaleDateString('ar-u-nu-latn', { weekday: 'long', timeZone: 'UTC' }),
      hijriDay: h.hijriDay,
      hijriMonth: h.hijriMonthName,
      hijriMonthAr: h.hijriMonthNameAr,
      hijriMonthNumber: h.hijriMonth,
      hijriYear: h.hijriYear,
      prayers: PRAYER_NAMES.map(name => ({
        name,
        raw: times[name],
        time: displayTime(times[name], timeFormat),
      })),
    };
  });
}

/**
 * The list of surahs.
 *
 * This is the index to the whole Quran: without it nothing can be opened, no
 * matter how much text is cached. It also barely ever changes, which makes it
 * the one thing that should always be answered from the device first.
 *
 * The stored list is used whenever the network will not answer, so a cold open
 * with no signal still shows all 114 surahs rather than a failure message.
 */
const CHAPTERS_KEY = 'chapters-v1';


export async function getChapters(): Promise<Chapter[]> {
  const cached = await getCachedJson<Chapter[]>('quran', CHAPTERS_KEY).catch(() => null);
  try {
    const worker = await getWorkerChapters();
    const chapters: Chapter[] = worker.map((c: IslamicChapter) => ({
      id: c.number,
      name_simple: c.nameSimple,
      /* Our server writes the Arabic as "سُورَةُ ٱلْفَاتِحَةِ", with the word
         for chapter in front. The list shows the name on its own, so the
         prefix comes off here rather than in the row. */
      name_arabic: String(c.nameArabic || '').replace(/^سُورَةُ\s*/, ''),
      verses_count: c.ayahCount,
      revelation_place: c.revelationPlace,
      translated_name: { name: c.nameEnglish },
    }));
    if (chapters.length) void setCachedJson('quran', CHAPTERS_KEY, chapters).catch(() => undefined);
    return chapters;
  } catch (error) {
    // Offline, or the server refused. A stored index is enough to open any
    // surah whose text is on the device, so it is returned rather than thrown.
    if (cached && cached.length) return cached;
    throw error;
  }
}

export async function getVerses(chapterId: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script || 'quran-uthmani';
  const translation = options.translation || DEFAULT_TRANSLATION_EDITION;

  /* Everything here comes from the app's own server now - the Arabic, the
     meaning, and the page and juz, which used to be read off the Arabic
     edition because that was the only place they were guaranteed. They are
     computed from the bundled structure instead, so they cost no request and
     stay right offline. */
  const [arabic, worker] = await Promise.all([
    scriptTexts(script, chapterId),
    workerTexts(translation, [String(chapterId)]),
  ]);

  const count = versesInSurah(chapterId) || arabic?.size || 0;
  const verses: Verse[] = [];
  for (let verse = 1; verse <= count; verse += 1) {
    const verseKey = `${chapterId}:${verse}`;
    const text = arabic?.get(verseKey);
    if (!text) continue;
    verses.push({
      id: globalAyahNumber(chapterId, verse),
      verse_key: verseKey,
      text_uthmani: text,
      translation: worker?.get(verseKey) || '',
      page: pageOfVerse(chapterId, verse),
      juz: juzOfVerse(chapterId, verse),
      hizbQuarter: rubOfVerse(chapterId, verse),
    });
  }
  return verses;
}

/**
 * One Mushaf page.
 *
 * Which verses are on the page comes from the map bundled with the app, so
 * opening a page costs one request per surah the page touches and nothing at
 * all once those surahs are held. No provider is asked which verses belong
 * together - the book has not changed since it was written down.
 */
export async function getPageVerses(page: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script || 'quran-uthmani';
  const translation = options.translation || DEFAULT_TRANSLATION_EDITION;
  if (page < 1 || page > MUSHAF_PAGE_COUNT) return [];

  const segments = pageSegments(page);
  if (!segments.length) return [];

  const keys: string[] = [];
  for (const segment of segments) {
    for (let verse = segment.start; verse <= segment.end; verse += 1) {
      keys.push(`${segment.surah}:${verse}`);
    }
  }

  const [arabic, worker] = await Promise.all([
    scriptTextsFor(script, keys),
    workerTexts(translation, keys.map((k) => k.split(':')[0])),
  ]);

  const chapters = await getChapters().catch(() => [] as Chapter[]);
  const names = new Map(chapters.map((c) => [c.id, c.name_simple]));

  return keys.map((key) => {
    const [surahText, verseText] = key.split(':');
    const surah = Number(surahText);
    const verse = Number(verseText);
    return {
      id: globalAyahNumber(surah, verse),
      verse_key: key,
      text_uthmani: arabic.get(key) || '',
      translation: worker?.get(key) || '',
      page,
      juz: juzOfVerse(surah, verse),
      hizbQuarter: rubOfVerse(surah, verse),
      surah_name: names.get(surah) || `Surah ${surah}`,
    };
  }).filter((verse) => verse.text_uthmani);
}

export async function getAyahOfDay(edition = DEFAULT_TRANSLATION_EDITION): Promise<DailyAyah> {
  return getAyahForDate(new Date(), edition);
}

/**
 * The ayah for a given day.
 *
 * The day is chosen by position in the year, so which ayah a date gets is
 * fixed and knowable in advance - which is what lets the app fetch the next
 * several before they are needed and keep them on the device.
 */
export async function getAyahForDate(date: Date, edition = DEFAULT_TRANSLATION_EDITION): Promise<DailyAyah> {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - start.getTime()) / 86400000);
  const ayahNumber = (day % QURAN_AYAH_COUNT) + 1;
  /* Which surah and verse that number lands in is arithmetic on the bundled
     surah lengths - it used to cost a round trip to a third party whose only
     advantage was that it numbered the whole book the same way. */
  const { surah, verse } = ayahNumberToKey(ayahNumber);
  const verseKey = `${surah}:${verse}`;
  const arabicText = (await scriptTexts('quran-uthmani', surah))?.get(verseKey) || '';
  /* The meaning is asked for at home, and only at home. This used to fall back
     to a hardcoded English edition on the third-party index - which pinned the
     ayah of the day to one language whatever the person reads, and was the
     last caller still addressing that index by a legacy id. Where the chosen
     edition is not served here, the day is shown in Arabic alone rather than
     in a language that was never chosen. */
  let translation = (await workerTexts(edition, [String(surah)]))?.get(verseKey);
  if (!translation && edition !== DEFAULT_TRANSLATION_EDITION) {
    translation = (await workerTexts(DEFAULT_TRANSLATION_EDITION, [String(surah)]))?.get(verseKey);
  }
  const chapters = await getChapters().catch(() => [] as Chapter[]);
  const chapter = chapters.find((c) => c.id === surah);
  return {
    reference: `${chapter?.name_simple || `Surah ${surah}`} ${surah}:${verse}`,
    arabicReference: `${chapter?.name_arabic || ''} ${surah}:${verse}`.trim(),
    arabic: arabicText,
    translation: translation || '',
  };
}

export async function getJuzVerses(juz: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  return versesForDivision(juzVerseKeys(juz), juz, options, (surah, verse) => juz);
}

/**
 * The verses of any run of keys, with their Arabic, meaning and position.
 *
 * Juz and hizb are both just named stretches of the same book, so they share
 * one path: the bundled table says which verses belong to the stretch, and
 * the text for those verses comes from our own server.
 */
async function versesForDivision(
  keys: string[],
  fallbackJuz: number,
  options: { script?: string; translation?: string },
  juzFor: (surah: number, verse: number) => number,
): Promise<Verse[]> {
  if (!keys.length) return [];
  const script = options.script || 'quran-uthmani';
  const translation = options.translation || DEFAULT_TRANSLATION_EDITION;

  const [arabic, worker] = await Promise.all([
    scriptTextsFor(script, keys),
    workerTexts(translation, keys.map((k) => k.split(':')[0])),
  ]);

  const chapters = await getChapters().catch(() => [] as Chapter[]);
  const names = new Map(chapters.map((c) => [c.id, c.name_simple]));

  return keys.map((key) => {
    const [surahText, verseText] = key.split(':');
    const surah = Number(surahText);
    const verse = Number(verseText);
    return {
      id: globalAyahNumber(surah, verse),
      verse_key: key,
      text_uthmani: arabic.get(key) || '',
      translation: worker?.get(key) || '',
      page: pageOfVerse(surah, verse),
      juz: juzFor(surah, verse) || fallbackJuz,
      hizbQuarter: rubOfVerse(surah, verse),
      surah_name: names.get(surah) || `Surah ${surah}`,
    } as Verse & { surah_name: string };
  }).filter((verse) => verse.text_uthmani);
}

/**
 * One hizb.
 *
 * A hizb is four rub - the quarter-hizb our server publishes - so the keys
 * are the four runs taken together rather than four separate fetches that
 * then need de-duplicating.
 */
export async function getHizbVerses(hizb: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const quarters = Array.from({ length: 4 }, (_, i) => (hizb - 1) * 4 + i + 1);
  const keys = quarters.flatMap((quarter) => rubVerseKeys(quarter));
  /* A hizb can straddle a juz boundary, so each verse is asked which juz it
     is in rather than the whole run being labelled with the first one's. */
  return versesForDivision(keys, juzOfVerse(1, 1), options, juzOfVerse);
}

/**
 * The editions offered for reading side by side.
 *
 * These are our own editions now - the ids the app actually stores - rather
 * than the third party's list, which named the same books differently and
 * quietly handed back Arabic for any id it did not recognise.
 */
export async function getQuranEditions(type = 'translation'): Promise<QuranEdition[]> {
  const category = type === 'tafsir' ? 'tafsir' : 'quran';
  const editions = await getEditions(category as 'quran' | 'tafsir');
  return editions.map((e) => ({
    identifier: e.id,
    language: e.language || '',
    englishName: e.displayName || e.id,
    name: e.author || e.displayName || e.id,
    type: e.variant || type,
    direction: e.language === 'ar' ? 'rtl' : 'ltr',
  }));
}

/**
 * Every verse of one edition, asked surah by surah, so a search can run
 * against the text itself.
 *
 * The Worker is the only server that knows our own edition ids, and a search
 * is the one place the whole book has to be read rather than one surah of it.
 * The requests go out a handful at a time - enough to fill the wait, few
 * enough that a phone is not juggling a hundred sockets - and every surah
 * lands in the Worker's cache, so a second search costs nothing and works
 * with the network off.
 *
 * A 404 means the edition is not one of ours, and the caller should ask the
 * other provider instead.
 */
async function wholeEdition(editionId: string): Promise<Array<{ surah: number; rows: Array<{ verseKey: string; numberInSurah: number; text: string }> }> | null> {
  const out: Array<{ surah: number; rows: Array<{ verseKey: string; numberInSurah: number; text: string }> }> = [];
  const queue = Array.from({ length: 114 }, (_, i) => i + 1);
  const WORKERS = 16;
  let index = 0;
  const lane = async () => {
    while (index < queue.length) {
      const surah = queue[index];
      index += 1;
      const rows = (await getSurah('quran', editionId, surah)).rows || [];
      out.push({ surah, rows });
    }
  };
  try {
    await Promise.all(Array.from({ length: WORKERS }, lane));
  } catch (error) {
    if (error instanceof IslamicDataError && error.status === 404) return null;
    throw error;
  }
  /* The lanes finish in whatever order the network allows, so `out` is not in
     Quran order. A search reading it as-is would list the same matches in a
     different order on every run. */
  out.sort((a, b) => a.surah - b.surah);
  return out;
}

export async function searchQuran(query: string, edition = DEFAULT_TRANSLATION_EDITION): Promise<QuranSearchResult[]> {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  /* Our own server first: it is the one that understands our edition ids. */
  const book = await wholeEdition(edition).catch(() => null);
  if (book) {
    /* Surah names come from the same server as the text. Reaching for the
       chapter list on the other provider here would mean a search could fail
       on their outage while everything it needs is sat in our own cache. */
    const chapters = await getWorkerChapters().catch(() => [] as IslamicChapter[]);
    const names = new Map(chapters.map((c) => [c.number, c.nameSimple]));
    const matches: QuranSearchResult[] = [];
    for (const { surah, rows } of book) {
      for (const row of rows || []) {
        if ((row.text || '').toLowerCase().includes(needle)) {
          matches.push({
            verseKey: row.verseKey,
            surahId: surah,
            surahName: names.get(surah) || `Surah ${surah}`,
            ayah: row.numberInSurah,
            text: row.text,
            edition,
          });
        }
      }
    }
    return matches;
  }

  /* An edition we do not hold - a preference saved before the move, say.
     There is nowhere else to ask now, so the search is run in the edition
     everyone starts in rather than coming back empty. The reader shows which
     edition the matches came from, so nothing is being passed off as a
     choice the person made. */
  if (edition !== DEFAULT_TRANSLATION_EDITION) {
    return searchQuran(query, DEFAULT_TRANSLATION_EDITION);
  }
  return [];
}

/**
 * Any list of editions for one verse, split across the two providers.
 *
 * The split has to happen before the asking, not after. Handed an id it does
 * not know, the third-party index does not 404 - it answers 200 with a
 * stand-in, an Arabic script where a translation was wanted. The row arrives,
 * carries a plausible edition object, and passes every check on the way in, so
 * the screen shows the wrong book with no error anywhere to see. Since the
 * reader moved to the app's own edition ids, every translation asked for here
 * was silently answered in Arabic.
 *
 * The two sets do not overlap: our catalog is 484 entries and every one is a
 * translation, while the script ids and the old index ids are absent from it.
 * So membership of the catalog is the whole test - no guesswork about shape.
 */
export async function getAyahEditions(verseKey: string, editions: string[]): Promise<{edition:string;name:string;language:string;text:string}[]> {
  const surah = String(verseKey).split(':')[0];
  const wanted = (editions || []).filter(Boolean);

  const catalogue = await getEditions('quran').catch(() => [] as IslamicEdition[]);
  const ours = new Map(catalogue.map((edition) => [edition.id, edition]));

  const rows: {edition:string;name:string;language:string;text:string}[] = [];

  await Promise.all(
    wanted.map(async (id) => {
      /* The Arabic row is a script rather than a translation, and scripts are
         addressed on a different part of our server under different ids. */
      const meta = ours.get(id);
      if (!meta) {
        const arabic = await scriptTexts(id, Number(surah));
        if (arabic?.get(verseKey)) {
          rows.push({ edition: id, name: SCRIPT_NAMES[id] || 'Arabic', language: 'ar', text: arabic.get(verseKey) || '' });
        }
        return;
      }
      const texts = await workerTexts(id, [surah]);
      rows.push({
        edition: id,
        name: meta.displayName,
        language: meta.language || '',
        text: texts?.get(verseKey) || '',
      });
    }),
  );

  /* Back in the order they were asked for, so a caller reading by position -
     or by "the one that is not Arabic" - still finds what it expected. */
  const order = new Map(wanted.map((id, index) => [id, index]));
  return rows.sort((a, b) => (order.get(a.edition) ?? 0) - (order.get(b.edition) ?? 0));
}

/**
 * The hadith of the day.
 *
 * Asked from the app's own server first, because it is deterministic there:
 * the same date always returns the same narration, so a day can be cached
 * whole and a person who opens the app twice sees the same hadith rather than
 * whichever one was next in a rotation.
 *
 * The old host stays as a fallback. A failed day is a blank card on the home
 * screen, and one request to a third party is worth avoiding that.
 */
export async function getDailyHadith(): Promise<DailyHadith> {
  try {
    const data = await getWorkerDailyHadith();
    return {
      collection: data.collection?.slug || data.collection?.name || 'bukhari',
      number: String(data.hadith?.number ?? ''),
      text: data.hadith?.text || '',
      arabic: data.hadith?.arabic || undefined,
    };
  } catch {
    const data = await json(`${ISLAMIC}/hadith/today/bukhari`);
    return { collection: data.collection, number: data.hadithNumber, text: data.en?.text || '', arabic: data.ar?.text };
  }
}

export const NAME_LANGUAGES = [
  { code: 'ar', label: 'Arabic' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
  { code: 'ur', label: 'اردو' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'bn', label: 'বাংলা' },
];

/** Islamic.app publishes each Name's meaning in nine languages; the app shows whatever the source has. */
function nameMeanings(row: any) {
  const meanings: Record<string, string> = {};
  if (row.en?.meaning) meanings.en = row.en.meaning;
  if (row.es?.meaning) meanings.es = row.es.meaning;
  Object.keys(row.i18n || {}).forEach((code) => {
    const value = row.i18n[code]?.meaning;
    if (value) meanings[code] = value;
  });
  return meanings;
}

export async function getNameOfDay(): Promise<DivineName> {
  const data = await json(`${ISLAMIC}/asma-al-husna/today`);
  const meanings = nameMeanings(data);
  return { number: data.number, name: data.name, transliteration: data.transliteration, meaning: meanings.en || data.en?.meaning || '', meanings };
}

export async function getNames(): Promise<DivineName[]> {
  const data = await json(`${ISLAMIC}/asma-al-husna`);
  return data.map((n: any) => {
    const meanings = nameMeanings(n);
    return { number: n.number, name: n.name, transliteration: n.transliteration, meaning: meanings.en || '', meanings };
  });
}

export async function getQibla(latitude: number, longitude: number): Promise<number | null> {
  const data = await json(`${ISLAMIC}/qibla/${latitude}/${longitude}`);
  return data.direction;
}

const plain = (value = '') => value
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

export type DuaCategory = { key: string; number: string; en: string; ar: string; count: number };

export type Dua = {
  id: string;
  number: string;
  categoryKey: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
};

/** The Islamic.app dhikr payload keeps transliteration, translation and reference inside
 *  one HTML string; splitting them out is what lets the app show each one on its own line. */
function spanText(body = '', className: string) {
  const match = body.match(new RegExp(`<span class="${className}"[^>]*>([\\s\\S]*?)</span>`, 'i'));
  return match ? plain(match[1]) : '';
}

export async function getDuaCategories(): Promise<{ shortcuts: string[]; categories: DuaCategory[] }> {
  const data = await json(`${ISLAMIC}/dhikr`);
  const shortcuts: string[] = data.shortcuts || [];
  const categories: DuaCategory[] = (data.categories || []).map((category: any) => ({
    key: String(category.number),
    number: String(category.number),
    en: category.en,
    ar: String(category.ar || '').normalize('NFC'),
    count: Number(category.count) || 0,
  }));
  return { shortcuts, categories };
}

export async function getDuasByCategory(key: string): Promise<Dua[]> {
  const data = await json(`${ISLAMIC}/dhikr/${key}`);
  const rows = data.duas || data.items || [];
  return rows.map((row: any) => {
    const body = row.en?.body || '';
    return {
      id: `${key}:${row.number}`,
      number: String(row.number ?? ''),
      categoryKey: key,
      category: row.category?.en || data.label || '',
      arabic: plain(row.ar?.text || row.ar?.body || ''),
      transliteration: spanText(body, 'transliteration'),
      translation: spanText(body, 'translation') || plain(row.en?.text || ''),
      reference: spanText(body, 'hisn_english_reference') || spanText(body, 'hisn_arabic_reference'),
    };
  }).filter((dua: Dua) => dua.arabic || dua.translation);
}

export async function getDuas(category = 'morning'): Promise<any[]> {
  const rows = await getDuasByCategory(category);
  return rows.map((dua) => ({
    number: dua.number,
    arabic: dua.arabic,
    transliteration: dua.transliteration,
    translation: dua.translation,
    reference: dua.reference,
    category: dua.category,
  }));
}

/**
 * The recitations available ayah by ayah.
 *
 * These were listed by the third-party index before. The list is bundled
 * instead, and every entry in it was checked against the CDN - of the 190 the
 * index offered, 24 actually resolve per ayah, so shipping the verified set
 * means nobody is shown a reciter whose audio will not play. The Arabic ones
 * cover the reciters people ask for by name; the rest are translation
 * recitations, which the index had no equivalent of at all.
 */
export async function getAudioEditions(): Promise<AudioEdition[]> {
  return AUDIO_EDITIONS.map((edition) => ({ ...edition }));
}

/**
 * One surah's ayah-by-ayah audio, in the recitation asked for.
 *
 * The URLs are built rather than fetched: the CDN names a file by the ayah's
 * position in the whole book, which is arithmetic on the bundled surah
 * lengths. It costs no request to work out where the audio is.
 */
export async function getSurahAudio(chapterId: number, edition: string): Promise<SurahAudioAyah[]> {
  const known = AUDIO_EDITIONS.find((entry) => entry.identifier === edition);
  if (!known) return [];
  const arabic = await scriptTexts('quran-uthmani', chapterId).catch(() => null);
  const count = versesInSurah(chapterId);
  const out: SurahAudioAyah[] = [];
  for (let verse = 1; verse <= count; verse += 1) {
    const globalNumber = globalAyahNumber(chapterId, verse);
    out.push({
      numberInSurah: verse,
      globalNumber,
      audio: ayahAudioUrl(edition, globalNumber),
      text: arabic?.get(`${chapterId}:${verse}`) || '',
    });
  }
  return out;
}

/** Where one ayah of one recitation lives on the CDN. */
export function ayahAudioUrl(edition: string, globalAyahNumber: number): string {
  return `${AUDIO_BASE}/${edition}/${globalAyahNumber}.mp3`;
}

const REWAYA_NAMES: Record<string, string> = {
  '1': "Hafs 'an Asim", '2': "Warsh 'an Nafi'", '3': "Qalun 'an Nafi'", '4': "Al-Duri 'an Abi Amr",
  '5': "Shu'bah 'an Asim", '6': "Khalaf 'an Hamzah", '7': "Al-Susi 'an Abi Amr",
};

export async function getSurahReciters(language = 'eng'): Promise<SurahReciter[]> {
  const response = await fetch(`https://www.mp3quran.net/api/v3/reciters?language=${language}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const body = await response.json();
  const rows: any[] = body.reciters || [];
  const reciters: SurahReciter[] = [];
  rows.forEach((row) => {
    const moshaf = (row.moshaf || []).find((entry: any) => Number(entry.surah_total) >= 114) || (row.moshaf || [])[0];
    if (!moshaf?.server) return;
    reciters.push({
      id: Number(row.id),
      name: String(row.name || '').trim(),
      letter: String(row.letter || '#'),
      server: String(moshaf.server).endsWith('/') ? moshaf.server : `${moshaf.server}/`,
      moshaf: String(moshaf.name || ''),
      rewaya: REWAYA_NAMES[String(moshaf.rewaya_id)] || moshaf.name || '',
      surahTotal: Number(moshaf.surah_total || 0),
    });
  });
  return reciters.filter((reciter) => reciter.name);
}

export async function getNearbyMosques(latitude: number, longitude: number): Promise<any[]> {
  const data = await json(`${ISLAMIC}/masajid/near?lat=${latitude}&lng=${longitude}&radius=50&limit=20`);
  return data.mosques || [];
}

/**
 * How long until the next Hajj, worked out from the Hijri calendar rather
 * than a hard-coded date. We count to Arafah — 9 Dhul-Hijjah — because that
 * is the day the pilgrimage stands or falls on: miss it and there is no Hajj.
 * AlAdhan converts both ways (gToH to read today's Hijri date, hToG to place
 * the coming Dhul-Hijjah back on the Gregorian calendar).
 */
export interface HajjCountdown {
  todayHijri: string;
  hijriYear: number;
  daysToArafah: number;
  daysToTarwiyah: number;
  arafahGregorian: string;
  tarwiyahGregorian: string;
  eidGregorian: string;
}

const MONTHS = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Akhirah','Rajab','Shaban','Ramadan','Shawwal','Dhul-Qadah','Dhul-Hijjah'];

function gregorianStamp(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function getHajjCountdown(): Promise<HajjCountdown> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const h = hijriForDate(today);
  const day = h?.day ?? 1;
  const month = h?.month ?? 1;
  let year = h?.year ?? 1448;

  // Hajj belongs to the coming Dhul-Hijjah. Once Tashriq is over we roll to
  // the next Hijri year, so the countdown never shows a negative or a zero.
  if (month > 12 || (month === 12 && day > 13)) year += 1;

  /*
   * The table hands back a day counted in UTC. The countdown is measured
   * against midnight tonight, which is local, so the parts are taken in UTC
   * and rebuilt as a local date — otherwise every count is short by the
   * offset wherever the device is.
   */
  const toGregorian = (hijriDay: number) => {
    const utc = gregorianForHijri(year, 12, hijriDay);
    if (!utc) return null;
    return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
  };

  const tarwiyah = toGregorian(8);
  const arafah = toGregorian(9);
  const eid = toGregorian(10);

  // Outside the table's span the dates cannot be known, so say so rather
  // than counting down to a day built by the arithmetic fallback.
  if (!tarwiyah || !arafah || !eid) {
    return {
      todayHijri: `${day} ${h?.monthName || MONTHS[month - 1] || ''} ${year}`,
      hijriYear: year,
      daysToArafah: 0,
      daysToTarwiyah: 0,
      arafahGregorian: '',
      tarwiyahGregorian: '',
      eidGregorian: '',
    };
  }
  const nights = (target: Date) => Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));

  return {
    todayHijri: `${day} ${h?.monthName || MONTHS[month - 1] || ''} ${year}`,
    hijriYear: year,
    daysToArafah: nights(arafah),
    daysToTarwiyah: nights(tarwiyah),
    arafahGregorian: gregorianStamp(arafah),
    tarwiyahGregorian: gregorianStamp(tarwiyah),
    eidGregorian: gregorianStamp(eid),
  };
}
