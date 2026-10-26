export type Prayer = { name: string; time: string; raw: string };
export type PrayerSnapshot = { prayers: Prayer[]; hijri: string; readable: string; timezone: string; method: string };
export type Chapter = { id: number; name_simple: string; name_arabic: string; verses_count: number; revelation_place?: string; translated_name?: { name: string } };
export type Verse = { id: number; verse_key: string; text_uthmani: string; translation?: string; audio?: string; page?: number; juz?: number };
export type DailyHadith = { collection: string; number: string; text: string; arabic?: string };
export type DivineName = { number: number; name: string; transliteration: string; meaning: string };

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
const displayTime = (value: string) => {
  const [h, m] = cleanTime(value).split(':').map(Number);
  if (!Number.isFinite(h)) return '';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export async function getPrayerSnapshot(latitude = 25.2048, longitude = 55.2708): Promise<PrayerSnapshot> {
  // AlAdhan resolves the timezone from coordinates and returns local clock times.
  const data = await json(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=8`);
  const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayers = names.map(name => ({ name, raw: cleanTime(data.timings[name]), time: displayTime(data.timings[name]) }));
  const h = data.date.hijri;
  return {
    prayers,
    hijri: `${h.day} ${h.month.en} ${h.year} AH`,
    readable: data.date.readable,
    timezone: data.meta.timezone,
    method: data.meta.method?.name || 'Gulf Region',
  };
}

export async function getPrayerTimes(latitude = 25.2048, longitude = 55.2708): Promise<Prayer[]> {
  return (await getPrayerSnapshot(latitude, longitude)).prayers;
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

export async function getVerses(chapterId: number): Promise<Verse[]> {
  const [arabic, english, audio] = await Promise.all([
    json(`${QURAN}/surah/${chapterId}/quran-uthmani`),
    json(`${QURAN}/surah/${chapterId}/en.sahih`),
    json(`${QURAN}/surah/${chapterId}/ar.alafasy`),
  ]);
  return arabic.ayahs.map((a: any, index: number) => ({
    id: a.number,
    verse_key: `${chapterId}:${a.numberInSurah}`,
    text_uthmani: a.text,
    translation: english.ayahs[index]?.text,
    audio: audio.ayahs[index]?.audio,
    page: a.page,
    juz: a.juz,
  }));
}

export async function getDailyHadith(): Promise<DailyHadith> {
  const data = await json(`${ISLAMIC}/hadith/today/bukhari`);
  return { collection: data.collection, number: data.hadithNumber, text: data.en?.text || '', arabic: data.ar?.text };
}

export async function getNameOfDay(): Promise<DivineName> {
  const data = await json(`${ISLAMIC}/asma-al-husna/today`);
  return { number: data.number, name: data.name, transliteration: data.transliteration, meaning: data.en.meaning };
}

export async function getNames(): Promise<DivineName[]> {
  const data = await json(`${ISLAMIC}/asma-al-husna`);
  return data.map((n: any) => ({ number: n.number, name: n.name, transliteration: n.transliteration, meaning: n.en.meaning }));
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

export async function getDuas(category = 'morning'): Promise<any[]> {
  const data = await json(`${ISLAMIC}/dhikr/${category}`);
  const rows = data.items || data.duas || data.dhikr || [];
  return rows.map((d: any) => ({
    number: d.number,
    arabic: plain(d.ar?.body || d.arabic || ''),
    translation: plain(d.en?.body || d.translation || ''),
    category: d.category?.en || data.label,
  }));
}

export async function getNearbyMosques(latitude: number, longitude: number): Promise<any[]> {
  const data = await json(`${ISLAMIC}/masajid/near?lat=${latitude}&lng=${longitude}&radius=50&limit=20`);
  return data.mosques || [];
}
