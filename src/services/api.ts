export type Prayer = { name: string; time: string; raw: string };
export type PrayerSnapshot = { prayers: Prayer[]; hijri: string; hijriYear: number; hijriMonth: number; readable: string; timezone: string; method: string };
export type CalendarDay = { gregorian: string; weekday: string; hijriDay: number; hijriMonth: string; hijriYear: number; prayers: Prayer[] };
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
const QURAN = 'https://api.alquran.cloud/v1';

async function json(url: string) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const body = await response.json();
  if (body.code && body.code !== 200) throw new Error(body.status || 'API request failed');
  return body.data;
}

const cleanTime = (value: string) => value?.split(' ')[0] ?? '';
const displayTime = (value: string, format: '12' | '24' = '12') => {
  const [h, m] = cleanTime(value).split(':').map(Number);
  if (!Number.isFinite(h)) return '';
  if (format === '24') return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export type PrayerRequestOptions = { method?: number; school?: 'shafi' | 'hanafi'; timeFormat?: '12' | '24' };

export async function getPrayerSnapshot(latitude = 25.2048, longitude = 55.2708, options: PrayerRequestOptions = {}): Promise<PrayerSnapshot> {
  // AlAdhan resolves the timezone from coordinates and returns local clock times.
  const method = options.method ?? 8;
  const school = options.school === 'hanafi' ? 1 : 0;
  const timeFormat = options.timeFormat ?? '12';
  const data = await json(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`);
  const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayers = names.map(name => ({ name, raw: cleanTime(data.timings[name]), time: displayTime(data.timings[name], timeFormat) }));
  const h = data.date.hijri;
  return {
    prayers,
    hijri: `${h.day} ${h.month.en} ${h.year} AH`,
    hijriYear: Number(h.year),
    hijriMonth: Number(h.month.number),
    readable: data.date.readable,
    timezone: data.meta.timezone,
    method: data.meta.method?.name || 'Gulf Region',
  };
}

export async function getPrayerTimes(latitude = 25.2048, longitude = 55.2708): Promise<Prayer[]> {
  return (await getPrayerSnapshot(latitude, longitude)).prayers;
}

function calendarDay(row: any): CalendarDay {
  const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  return {
    gregorian: row.date.gregorian.date,
    weekday: row.date.gregorian.weekday.en,
    hijriDay: Number(row.date.hijri.day),
    hijriMonth: row.date.hijri.month.en,
    hijriYear: Number(row.date.hijri.year),
    prayers: names.map(name => ({ name, raw: cleanTime(row.timings[name]), time: displayTime(row.timings[name]) })),
  };
}

export async function getGregorianCalendar(latitude: number, longitude: number, month: number, year: number): Promise<CalendarDay[]> {
  const data = await json(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=8`);
  return data.map(calendarDay);
}

export async function getRamadanCalendar(latitude: number, longitude: number, hijriYear: number): Promise<CalendarDay[]> {
  const data = await json(`https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/9?latitude=${latitude}&longitude=${longitude}&method=8`);
  return data.map(calendarDay);
}

export async function getChapters(): Promise<Chapter[]> {
  const data = await json(`${QURAN}/surah`);
  return data.map((s: any) => ({
    id: s.number,
    name_simple: s.englishName,
    name_arabic: s.name.replace(/^سُورَةُ\s*/, ''),
    verses_count: s.numberOfAyahs,
    revelation_place: s.revelationType,
    translated_name: { name: s.englishNameTranslation },
  }));
}

export async function getVerses(chapterId: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script || 'quran-uthmani';
  const translation = options.translation || 'en.sahih';
  const arabicRequest = script === 'quran-indopak'
    ? fetch(`https://quran-json.risanb.com/text/hafs-nastaliq/chapters/${chapterId}.json`).then(async response=>{if(!response.ok)throw new Error(`IndoPak text request failed (${response.status})`);return response.json()})
    : json(`${QURAN}/surah/${chapterId}/${script}`);
  const [arabic, english, audio] = await Promise.all([
    arabicRequest,
    json(`${QURAN}/surah/${chapterId}/${translation}`),
    json(`${QURAN}/surah/${chapterId}/ar.alafasy`),
  ]);
  const ayahs = script === 'quran-indopak' ? arabic.verses : arabic.ayahs;
  return ayahs.map((a: any, index: number) => ({
    id: script === 'quran-indopak' ? index + 1 : a.number,
    verse_key: `${chapterId}:${script === 'quran-indopak' ? index + 1 : a.numberInSurah}`,
    text_uthmani: a.text,
    translation: english.ayahs[index]?.text,
    audio: audio.ayahs[index]?.audio,
    page: english.ayahs[index]?.page,
    juz: english.ayahs[index]?.juz,
  }));
}

export async function getPageVerses(page: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script === 'quran-indopak' ? 'quran-uthmani' : options.script || 'quran-uthmani';
  const translation = options.translation || 'en.sahih';
  const [arabic, translated] = await Promise.all([json(`${QURAN}/page/${page}/${script}`),json(`${QURAN}/page/${page}/${translation}`)]);
  return arabic.ayahs.map((a:any,index:number)=>({id:a.number,verse_key:`${a.surah.number}:${a.numberInSurah}`,text_uthmani:a.text,translation:translated.ayahs[index]?.text,page:a.page,juz:a.juz,surah_name:a.surah.englishName}));
}

export async function getAyahOfDay(): Promise<DailyAyah> {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const day = Math.floor((Date.now() - start.getTime()) / 86400000);
  const ayahNumber = (day % 6236) + 1;
  const [arabic, english] = await Promise.all([
    json(`${QURAN}/ayah/${ayahNumber}/quran-uthmani`),
    json(`${QURAN}/ayah/${ayahNumber}/en.sahih`),
  ]);
  return {
    reference: `${arabic.surah.englishName} ${arabic.surah.number}:${arabic.numberInSurah}`,
    arabicReference: `${arabic.surah.name} ${arabic.surah.number}:${arabic.numberInSurah}`,
    arabic: arabic.text,
    translation: english.text,
  };
}

export async function getJuzVerses(juz: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script || 'quran-uthmani';
  const translation = options.translation || 'en.sahih';
  const [arabic, english, audio] = await Promise.all([
    json(`${QURAN}/juz/${juz}/${script}`), json(`${QURAN}/juz/${juz}/${translation}`), json(`${QURAN}/juz/${juz}/ar.alafasy`),
  ]);
  return arabic.ayahs.map((a:any,index:number)=>({id:a.number,verse_key:`${a.surah.number}:${a.numberInSurah}`,text_uthmani:a.text,translation:english.ayahs[index]?.text,audio:audio.ayahs[index]?.audio,page:a.page,juz:a.juz,surah_name:a.surah.englishName} as Verse & {surah_name:string}));
}

export async function getHizbVerses(hizb: number, options: { script?: string; translation?: string } = {}): Promise<Verse[]> {
  const script = options.script === 'quran-indopak' ? 'quran-uthmani' : options.script || 'quran-uthmani';
  const translation = options.translation || 'en.sahih';
  const quarters=Array.from({length:4},(_,i)=>(hizb-1)*4+i+1);
  const groups=await Promise.all(quarters.map(async quarter=>{const[arabic,translated]=await Promise.all([json(`${QURAN}/hizbQuarter/${quarter}/${script}`),json(`${QURAN}/hizbQuarter/${quarter}/${translation}`)]);return arabic.ayahs.map((a:any,index:number)=>({id:a.number,verse_key:`${a.surah.number}:${a.numberInSurah}`,text_uthmani:a.text,translation:translated.ayahs[index]?.text,page:a.page,juz:a.juz,hizbQuarter:a.hizbQuarter,surah_name:a.surah.englishName}))}));
  const unique=new Map<string,Verse>();groups.flat().forEach((verse:any)=>unique.set(verse.verse_key,verse));return [...unique.values()];
}

export async function getQuranEditions(type = 'translation'): Promise<QuranEdition[]> {
  const data = await json(`${QURAN}/edition?format=text&type=${type}`);
  return data.map((e:any)=>({identifier:e.identifier,language:e.language,englishName:e.englishName,name:e.name,type:e.type,direction:e.direction}));
}

export async function searchQuran(query: string, edition = 'en.sahih'): Promise<QuranSearchResult[]> {
  const data = await json(`${QURAN}/search/${encodeURIComponent(query)}/all/${edition}`);
  return (data.matches || []).map((m:any)=>({verseKey:`${m.surah.number}:${m.numberInSurah}`,surahId:m.surah.number,surahName:m.surah.englishName,ayah:m.numberInSurah,text:m.text,edition:m.edition?.englishName||edition}));
}

export async function getAyahEditions(verseKey: string, editions: string[]): Promise<{edition:string;name:string;language:string;text:string}[]> {
  const data = await json(`${QURAN}/ayah/${verseKey}/editions/${editions.join(',')}`);
  return data.map((row:any)=>({edition:row.edition.identifier,name:row.edition.englishName,language:row.edition.language,text:row.text}));
}

export async function getDailyHadith(): Promise<DailyHadith> {
  const data = await json(`${ISLAMIC}/hadith/today/bukhari`);
  return { collection: data.collection, number: data.hadithNumber, text: data.en?.text || '', arabic: data.ar?.text };
}

export const NAME_LANGUAGES = [
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
    ar: category.ar,
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

export async function getAudioEditions(): Promise<AudioEdition[]> {
  const data = await json(`${QURAN}/edition/format/audio`);
  return data.map((edition: any) => ({
    identifier: edition.identifier,
    language: edition.language,
    englishName: edition.englishName,
    name: edition.name,
    type: edition.type,
    direction: edition.direction,
  }));
}

export async function getSurahAudio(chapterId: number, edition: string): Promise<SurahAudioAyah[]> {
  const data = await json(`${QURAN}/surah/${chapterId}/${edition}`);
  return (data.ayahs || []).map((ayah: any) => ({
    numberInSurah: ayah.numberInSurah,
    globalNumber: ayah.number,
    audio: ayah.audio || '',
    text: ayah.text || '',
  }));
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
