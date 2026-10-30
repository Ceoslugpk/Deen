/**
 * The source registry.
 *
 * Every external source the app touches, and every source it could touch, in
 * one place — each carrying the exact URL that was requested and what came
 * back. This file is a record of what was checked, not a list of intentions,
 * so a source is only marked `live` when a request against `probe` answered.
 *
 * `unwired` means the source works and is available, but no screen calls it
 * yet. `broken` means the request failed and the source cannot be relied on.
 *
 * Verified 2026-10-28.
 */

export type SourceStatus = 'live' | 'unwired' | 'broken';

export type SourceCategory =
  | 'quran' | 'tafsir' | 'hadith' | 'names' | 'dhikr'
  | 'prayer' | 'location' | 'audio' | 'live' | 'finance' | 'reference';

export type SourceEntry = {
  id: string;
  name: string;
  ar: string;
  /** The host, as it is shown in the app. */
  host: string;
  /** The exact URL that was requested during the check. */
  probe: string;
  category: SourceCategory;
  purpose: string;
  arPurpose: string;
  status: SourceStatus;
  /** Corrections and caveats discovered while checking. */
  note?: string;
};

/** The date the registry was last checked end to end. */
export const SOURCES_VERIFIED_ON = '2026-10-28';

export const SOURCES: SourceEntry[] = [
  /* ---------------- Quran text ---------------- */
  {
    id: 'alquran-cloud',
    name: 'AlQuran Cloud',
    ar: 'القرآن السحابي',
    host: 'api.alquran.cloud',
    probe: 'https://api.alquran.cloud/v1/surah',
    category: 'quran',
    purpose: 'Surah list, Arabic script editions, translations, and verse-by-verse audio editions. The primary Quran source.',
    arPurpose: 'قائمة السور، ونصوص القرآن، والترجمات، وملفات الصوت لكل آية. وهو المصدر الأساسي للقرآن.',
    status: 'live',
  },
  {
    id: 'qurancom-api',
    name: 'Quran.com API',
    ar: 'واجهة قرآن.كوم',
    host: 'api.quran.com',
    probe: 'https://api.quran.com/api/v4/chapters/1',
    category: 'quran',
    purpose: 'Chapter metadata and Uthmani text. Intended as the fallback when AlQuran Cloud is unavailable.',
    arPurpose: 'بيانات السور والنص العثماني، ويُستخدم بديلًا عند تعذّر الوصول إلى القرآن السحابي.',
    status: 'unwired',
    note: 'Verified working, but no screen calls it yet. The Arabic-text fallback currently points at quran-json instead.',
  },
  {
    id: 'quran-json',
    name: 'Quran JSON',
    ar: 'نص القرآن',
    host: 'quran-json.risanb.com',
    probe: 'https://quran-json.risanb.com/text/hafs-nastaliq/chapters/1.json',
    category: 'quran',
    purpose: 'Fallback Arabic text when AlQuran Cloud cannot be reached.',
    arPurpose: 'النص العربي البديل عند تعذّر الوصول إلى المصدر الأساسي.',
    status: 'live',
  },
  {
    id: 'quranhub',
    name: 'QuranHub',
    ar: 'قرآن هَب',
    host: 'quranhub.io',
    probe: 'https://quranhub.io/',
    category: 'quran',
    purpose: 'Tajweed-marked Quran script and verse data for colour-coded reading rules.',
    arPurpose: 'نص القرآن مُعلَّمًا بأحكام التجويد، لقراءة ملوّنة حسب الأحكام.',
    status: 'unwired',
    note: 'Host answers, but the tajweed data endpoint has not been pinned down. Wiring this needs the verse path confirmed first.',
  },

  /* ---------------- Tafsir ---------------- */
  {
    id: 'spa5k-tafsir',
    name: 'Tafsir API (spa5k)',
    ar: 'موسوعة التفسير',
    host: 'cdn.jsdelivr.net/gh/spa5k/tafsir_api',
    probe: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/1.json',
    category: 'tafsir',
    purpose: 'Per-ayah tafsir across 123 editions, including Ibn Kathir, Jalalayn, As-Sa’di, Tabari, Qurtubi, Baghawi and Muyassar in Arabic, English, Urdu and Bengali.',
    arPurpose: 'تفسير كل آية من ١٢٣ مصدرًا، منها ابن كثير والجلالين والسعدي والطبري والقرطبي والبغوي والميسّر، بالعربية والإنجليزية والأردية والبنغالية.',
    status: 'unwired',
    note: 'The English Ibn Kathir slug misspells the word upstream — en-tafisr-ibn-kathir, not en-tafsir. Arabic slugs use the correct spelling (ar-tafsir-muyassar, ar-tafsir-ibn-kathir).',
  },

  /* ---------------- Hadith ---------------- */
  {
    id: 'islamic-app-hadith',
    name: 'Islamic.app — Hadith',
    ar: 'إسلاميك — الحديث',
    host: 'api.islamic.app',
    probe: 'https://api.islamic.app/v1/hadith/today/bukhari',
    category: 'hadith',
    purpose: 'Hadith of the day.',
    arPurpose: 'حديث اليوم.',
    status: 'live',
  },
  {
    id: 'hadith-api',
    name: 'Hadith API',
    ar: 'مكتبة الحديث',
    host: 'cdn.jsdelivr.net/gh/fawazahmed0/hadith-api',
    probe: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json',
    category: 'hadith',
    purpose: 'Full collections with matched Arabic and English editions, fetched per collection and cached on the device.',
    arPurpose: 'المجموعات الكاملة بنصّها العربي وترجمتها الإنجليزية، تُحمَّل لكل مجموعة وتُحفظ على الجهاز.',
    status: 'live',
    note: 'Per-edition files are editions/{lang}-{collection}.min.json. The bare editions directory returns 404 — it is not an index.',
  },
  {
    id: 'sunnah-com',
    name: 'Sunnah.com',
    ar: 'سنن.كوم',
    host: 'sunnah.com',
    probe: 'https://sunnah.com/bukhari:1',
    category: 'reference',
    purpose: 'Citation links so a hadith can be checked against its source.',
    arPurpose: 'روابط الإحالة للتحقق من الحديث في مصدره.',
    status: 'live',
  },

  /* ---------------- Names ---------------- */
  {
    id: 'islamic-app-names',
    name: 'Islamic.app — Asma al-Husna',
    ar: 'إسلاميك — الأسماء الحسنى',
    host: 'api.islamic.app',
    probe: 'https://api.islamic.app/v1/asma-al-husna',
    category: 'names',
    purpose: 'The 99 Names with meanings, and the Name of the Day.',
    arPurpose: 'الأسماء الحسنى التسعة والتسعون مع معانيها، واسم اليوم.',
    status: 'live',
  },
  {
    id: 'esmaulhusna',
    name: 'EsmaulHusna.org',
    ar: 'أسماء الله الحسنى',
    host: 'esmaulhusna.org',
    probe: 'https://esmaulhusna.org/',
    category: 'audio',
    purpose: 'Audio clips for the 99 Names.',
    arPurpose: 'مقاطع صوتية للأسماء الحسنى التسعة والتسعين.',
    status: 'unwired',
  },

  /* ---------------- Dhikr ---------------- */
  {
    id: 'islamic-app-dhikr',
    name: 'Islamic.app — Adhkar',
    ar: 'إسلاميك — الأذكار',
    host: 'api.islamic.app',
    probe: 'https://api.islamic.app/v1/dhikr',
    category: 'dhikr',
    purpose: 'Hisn al-Muslim adhkar by occasion, 132 categories, including post-prayer dhikr.',
    arPurpose: 'أذكار حصن المسلم حسب المناسبة، وتضم ١٣٢ قسمًا، منها أذكار بعد الصلاة.',
    status: 'live',
  },

  /* ---------------- Prayer ---------------- */
  {
    id: 'aladhan-timings',
    name: 'AlAdhan — Prayer times',
    ar: 'الأذان — المواقيت',
    host: 'api.aladhan.com',
    probe: 'https://api.aladhan.com/v1/timings?latitude=25.2048&longitude=55.2708&method=2',
    category: 'prayer',
    purpose: 'No longer called. Prayer times are calculated on the device from the coordinates, so this host is never contacted.',
    arPurpose: 'لم يعد مستخدمًا. تُحسب المواقيت على الجهاز من الإحداثيات، فلا يُستدعى هذا المصدر.',
    status: 'unwired',
    note: 'Replaced by on-device calculation (see services/prayerTimes.ts). Kept for reference only.',
  },
  {
    id: 'aladhan-hijri',
    name: 'AlAdhan — Hijri calendar',
    ar: 'الأذان — التقويم الهجري',
    host: 'api.aladhan.com',
    probe: 'https://api.aladhan.com/v1/hijriCalendar/1447/9?latitude=25.2048&longitude=55.2708&method=8',
    category: 'prayer',
    purpose: 'No longer called. The Hijri date and the Ramadan timetable come from a bundled Umm al-Qura table on the device.',
    arPurpose: 'لم يعد مستخدمًا. التاريخ الهجري وجدول رمضان من جدول أم القرى المضمّن في الجهاز.',
    status: 'unwired',
    note: 'The bundled table was itself derived from this endpoint; it is now read locally.',
  },
  {
    id: 'islamic-app-qibla',
    name: 'Islamic.app — Qibla',
    ar: 'إسلاميك — القبلة',
    host: 'api.islamic.app',
    probe: 'https://api.islamic.app/v1/qibla/25.2048/55.2708',
    category: 'prayer',
    purpose: 'Qibla direction for a coordinate.',
    arPurpose: 'اتجاه القبلة من أي إحداثيات.',
    status: 'live',
  },

  /* ---------------- Location ---------------- */
  {
    id: 'islamic-app-masajid',
    name: 'Islamic.app — Mosques',
    ar: 'إسلاميك — المساجد',
    host: 'api.islamic.app',
    probe: 'https://api.islamic.app/v1/masajid/near?lat=25.2048&lng=55.2708&radius=50&limit=5',
    category: 'location',
    purpose: 'Nearby mosques with names, addresses, coordinates and distance.',
    arPurpose: 'المساجد القريبة مع أسمائها وعناوينها وإحداثياتها ومسافاتها.',
    status: 'live',
    note: 'This is the mosque provider. Overpass is not used — see the broken entry below.',
  },
  {
    id: 'nominatim',
    name: 'Nominatim',
    ar: 'نوميناتيم',
    host: 'nominatim.openstreetmap.org',
    probe: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=25.2048&lon=55.2708',
    category: 'location',
    purpose: 'Reverse geocoding coordinates into place names, and area search.',
    arPurpose: 'تحويل الإحداثيات إلى أسماء أماكن، والبحث عن المناطق.',
    status: 'unwired',
  },
  {
    id: 'overpass',
    name: 'Overpass API',
    ar: 'أوفرباس',
    host: 'overpass-api.de',
    probe: 'https://overpass-api.de/api/interpreter',
    category: 'location',
    purpose: 'OpenStreetMap queries for places of worship.',
    arPurpose: 'الاستعلام عن أماكن العبادة من بيانات الشارع المفتوح.',
    status: 'broken',
    note: 'All three mirrors failed on 2026-10-28 — 502 on the main endpoint, timeouts on kumi.systems and private.coffee. Kept here so it is not mistaken for an available option. Islamic.app covers mosques in the meantime.',
  },

  /* ---------------- Audio ---------------- */
  {
    id: 'islamic-network',
    name: 'Islamic.network CDN',
    ar: 'الشبكة الإسلامية',
    host: 'cdn.islamic.network',
    probe: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    category: 'audio',
    purpose: 'Quran recitation audio, whole-surah and per-ayah.',
    arPurpose: 'تلاوات القرآن، للسورة كاملة أو لكل آية.',
    status: 'live',
  },
  {
    id: 'mp3quran',
    name: 'MP3Quran',
    ar: 'إم بي ٣ قرآن',
    host: 'www.mp3quran.net',
    probe: 'https://www.mp3quran.net/api/v3/reciters?language=ar',
    category: 'audio',
    purpose: 'The reciter directory for surah-mode playback.',
    arPurpose: 'دليل القرّاء للتشغيل حسب السورة.',
    status: 'live',
  },
  {
    id: 'everyayah',
    name: 'EveryAyah',
    ar: 'كل آية',
    host: 'everyayah.com',
    probe: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/001001.mp3',
    category: 'audio',
    purpose: 'Translation audio in English, Urdu, Persian, Azerbaijani, Bosnian and others, per ayah.',
    arPurpose: 'صوت الترجمة لكل آية بالإنجليزية والأردية والفارسية والأذرية والبوسنية وغيرها.',
    status: 'unwired',
  },
  {
    id: 'archive-org-adhan',
    name: 'Internet Archive — Adhan',
    ar: 'أرشيف الإنترنت — الأذان',
    host: 'archive.org',
    probe: 'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_01_Fajr_Adhan.mp3',
    category: 'audio',
    purpose: 'Remote adhan recordings used for the adhan alarm.',
    arPurpose: 'تسجيلات الأذان عن بُعد المستخدمة في منبّه الأذان.',
    status: 'live',
    note: 'The app serves adhan audio from archive.org, not from the GitHub Kiwifu repository. Both work; only this one is wired.',
  },
  {
    id: 'kiwifu-adhan',
    name: 'Adhan recordings (GitHub)',
    ar: 'تسجيلات الأذان',
    host: 'github.com/kiwifu/adhan-mp3',
    probe: 'https://api.github.com/repos/kiwifu/adhan-mp3',
    category: 'audio',
    purpose: 'Adhan recordings — Mishary Alafasy, Abdul Basit, Makkah, Madinah, Al-Aqsa and others.',
    arPurpose: 'تسجيلات الأذان: مشاري العفاسي، وعبد الباسط، ومكة، والمدينة، والأقصى، وغيرها.',
    status: 'unwired',
    note: 'Repository confirmed to exist. Not the source the app currently uses.',
  },

  /* ---------------- Live ---------------- */
  {
    id: 'makkahlive',
    name: 'Makkah Live',
    ar: 'بث مكة',
    host: 'makkahlive.net',
    probe: 'https://makkahlive.net/makkahlive.aspx',
    category: 'live',
    purpose: 'Live broadcasts from Makkah and Madinah.',
    arPurpose: 'البث المباشر من مكة المكرمة والمدينة المنورة.',
    status: 'live',
  },
  {
    id: 'youtube-live',
    name: 'YouTube — official channels',
    ar: 'يوتيوب — القنوات الرسمية',
    host: 'youtube.com',
    probe: 'https://www.youtube.com/@alharamain_sa',
    category: 'live',
    purpose: 'Makkah, Madinah and Hajj live streams. Native devices open the channel link; web embeds playback.',
    arPurpose: 'البث المباشر لمكة والمدينة والحج. تفتح الأجهزة رابط القناة، ويعرض الويب المشغّل المضمّن.',
    status: 'live',
  },

  /* ---------------- Finance ---------------- */
  {
    id: 'gold-api',
    name: 'Gold API',
    ar: 'أسعار الذهب',
    host: 'api.gold-api.com',
    probe: 'https://api.gold-api.com/price/XAU',
    category: 'finance',
    purpose: 'Spot gold and silver prices, converted to a price per gram for the nisab threshold.',
    arPurpose: 'أسعار الذهب والفضة الفورية، وتُحوَّل إلى سعر الغرام لحساب النصاب.',
    status: 'live',
  },
  {
    id: 'er-api',
    name: 'Exchange Rate API',
    ar: 'أسعار العملات',
    host: 'open.er-api.com',
    probe: 'https://open.er-api.com/v6/latest/USD',
    category: 'finance',
    purpose: 'Currency conversion for zakat calculated in other currencies.',
    arPurpose: 'تحويل العملات لحساب الزكاة بعملات أخرى.',
    status: 'live',
  },

  /* ---------------- Reference ---------------- */
  {
    id: 'quran-com-links',
    name: 'Quran.com',
    ar: 'قرآن.كوم',
    host: 'quran.com',
    probe: 'https://quran.com/1',
    category: 'reference',
    purpose: 'Verse reference links.',
    arPurpose: 'روابط الإحالة للآيات.',
    status: 'live',
  },
  {
    id: 'corpus-quran',
    name: 'Corpus Quran',
    ar: 'مدونة القرآن',
    host: 'corpus.quran.com',
    probe: 'https://corpus.quran.com/lemmas.jsp',
    category: 'reference',
    purpose: 'Grammar and lemma reference for Quranic vocabulary study.',
    arPurpose: 'مرجع النحو والجذور لدراسة مفردات القرآن.',
    status: 'live',
  },
];

/** Sources grouped by category, in the order the app presents them. */
export const SOURCE_CATEGORIES: { key: SourceCategory; label: string; ar: string }[] = [
  { key: 'quran', label: 'Quran', ar: 'القرآن' },
  { key: 'tafsir', label: 'Tafsir', ar: 'التفسير' },
  { key: 'hadith', label: 'Hadith', ar: 'الحديث' },
  { key: 'names', label: 'The Names', ar: 'الأسماء الحسنى' },
  { key: 'dhikr', label: 'Dhikr', ar: 'الأذكار' },
  { key: 'prayer', label: 'Prayer and calendar', ar: 'الصلاة والتقويم' },
  { key: 'location', label: 'Location', ar: 'الموقع' },
  { key: 'audio', label: 'Audio', ar: 'الصوت' },
  { key: 'live', label: 'Live', ar: 'البث المباشر' },
  { key: 'finance', label: 'Finance', ar: 'المال' },
  { key: 'reference', label: 'Reference', ar: 'المراجع' },
];

/** One-line counts, for the header of the data-sources screen. */
export function sourceCounts() {
  return {
    total: SOURCES.length,
    live: SOURCES.filter((s) => s.status === 'live').length,
    unwired: SOURCES.filter((s) => s.status === 'unwired').length,
    broken: SOURCES.filter((s) => s.status === 'broken').length,
  };
}
