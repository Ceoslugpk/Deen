/**
 * The adhan recordings that ship with the app.
 *
 * Every recording here lives in `assets/audio` and is copied into the native
 * project by the `withAdhanSounds` plugin, because a notification can only
 * play a sound compiled into the app - a file the app merely downloaded
 * cannot sound from a notification, on either platform. That is why these are
 * bundled rather than fetched: the adhan has to sound at Fajr whether or not
 * there is a network, and whether or not the app has been opened that day.
 *
 * Fajr is separate. The dawn call is its own recitation, longer and recited
 * in its own manner, so choosing one does not touch the other five prayers.
 * Two recordings exist for it; eighteen for the rest of the day.
 *
 * Each file was verified against the catalogue's published SHA-256 before it
 * was committed, so what is here is byte-identical to what the server serves.
 */

export type AdhanTrack = {
  /** `kind:id`, so a Fajr id and an adhan id can never be confused. */
  id: string;
  name: string;
  nameAr: string;
  /** The native resource name the notification asks the system to play. */
  sound: string;
  /** The bundled file, for previewing inside the app. */
  source: any;
  bytes: number;
};

export const ADHAN_TRACKS: AdhanTrack[] = [
  {
    id: 'adhan:abdul-basit',
    name: "Abdul Basit",
    nameAr: 'عبد الباسط',
    sound: 'adhan_abdul_basit',
    source: require('../../assets/audio/adhan-abdul-basit.mp3'),
    bytes: 207723,
  },
  {
    id: 'adhan:abdul-ghaffar',
    name: "Abdul Ghaffar",
    nameAr: 'عبد الغفار',
    sound: 'adhan_abdul_ghaffar',
    source: require('../../assets/audio/adhan-abdul-ghaffar.mp3'),
    bytes: 188551,
  },
  {
    id: 'adhan:abdul-hakam',
    name: "Abdul Hakam",
    nameAr: 'عبد الحكم',
    sound: 'adhan_abdul_hakam',
    source: require('../../assets/audio/adhan-abdul-hakam.mp3'),
    bytes: 192363,
  },
  {
    id: 'adhan:ahmad-al-nafees',
    name: "Ahmad al-Nafees",
    nameAr: 'أحمد النفيس',
    sound: 'adhan_ahmad_al_nafees',
    source: require('../../assets/audio/adhan-ahmad-al-nafees.mp3'),
    bytes: 3418938,
  },
  {
    id: 'adhan:al-hussaini',
    name: "Al-Hussaini",
    nameAr: 'الحسيني',
    sound: 'adhan_al_hussaini',
    source: require('../../assets/audio/adhan-al-hussaini.mp3'),
    bytes: 198580,
  },
  {
    id: 'adhan:bakir-bash',
    name: "Bakir Bash",
    nameAr: 'باقر باش',
    sound: 'adhan_bakir_bash',
    source: require('../../assets/audio/adhan-bakir-bash.mp3'),
    bytes: 349567,
  },
  {
    id: 'adhan:hafez',
    name: "Hafez",
    nameAr: 'حافظ',
    sound: 'adhan_hafez',
    source: require('../../assets/audio/adhan-hafez.mp3'),
    bytes: 168899,
  },
  {
    id: 'adhan:hafiz-murad',
    name: "Hafiz Murad",
    nameAr: 'حافظ مراد',
    sound: 'adhan_hafiz_murad',
    source: require('../../assets/audio/adhan-hafiz-murad.mp3'),
    bytes: 104226,
  },
  {
    id: 'adhan:hafiz-mustafa-ozcan-from-turkey',
    name: "Hafiz Mustafa Özcan from Turkey",
    nameAr: 'حافظ مصطفى أوزجان (تركيا)',
    sound: 'adhan_hafiz_mustafa_ozcan_from_turkey',
    source: require('../../assets/audio/adhan-hafiz-mustafa-ozcan-from-turkey.mp3'),
    bytes: 3805132,
  },
  {
    id: 'adhan:karl-jenkins',
    name: "Karl Jenkins",
    nameAr: 'كارل جينكينز',
    sound: 'adhan_karl_jenkins',
    source: require('../../assets/audio/adhan-karl-jenkins.mp3'),
    bytes: 2999080,
  },
  {
    id: 'adhan:mansour-al-zahrani',
    name: "Mansour Al-Zahrani",
    nameAr: 'منصور الزهراني',
    sound: 'adhan_mansour_al_zahrani',
    source: require('../../assets/audio/adhan-mansour-al-zahrani.mp3'),
    bytes: 3358625,
  },
  {
    id: 'adhan:minshawi',
    name: "Minshawi",
    nameAr: 'المنشاوي',
    sound: 'adhan_minshawi',
    source: require('../../assets/audio/adhan-minshawi.mp3'),
    bytes: 237238,
  },
  {
    id: 'adhan:mishary-rashid-alafasy',
    name: "Mishary Rashid Alafasy",
    nameAr: 'مشاري رشيد العفاسي',
    sound: 'adhan_mishary_rashid_alafasy',
    source: require('../../assets/audio/adhan-mishary-rashid-alafasy.mp3'),
    bytes: 4114842,
  },
  {
    id: 'adhan:naghshbandi',
    name: "Naghshbandi",
    nameAr: 'النقشبندي',
    sound: 'adhan_naghshbandi',
    source: require('../../assets/audio/adhan-naghshbandi.mp3'),
    bytes: 164568,
  },
  {
    id: 'adhan:saber',
    name: "Saber",
    nameAr: 'صابر',
    sound: 'adhan_saber',
    source: require('../../assets/audio/adhan-saber.mp3'),
    bytes: 151240,
  },
  {
    id: 'adhan:sharif-doman',
    name: "Sharif Doman",
    nameAr: 'شريف دومان',
    sound: 'adhan_sharif_doman',
    source: require('../../assets/audio/adhan-sharif-doman.mp3'),
    bytes: 283218,
  },
  {
    id: 'adhan:traditional',
    name: "Traditional",
    nameAr: 'التقليدي',
    sound: 'adhan_traditional',
    source: require('../../assets/audio/adhan-traditional.mp3'),
    bytes: 203440,
  },
  {
    id: 'adhan:yusuf-islam',
    name: "Yusuf Islam",
    nameAr: 'يوسف إسلام',
    sound: 'adhan_yusuf_islam',
    source: require('../../assets/audio/adhan-yusuf-islam.mp3'),
    bytes: 101091,
  },
];

/** Dawn has its own recordings, and only two of them. */
export const FAJR_TRACKS: AdhanTrack[] = [
  {
    id: 'fajr:mansour-al-zahrani',
    name: "Mansour Al-Zahrani",
    nameAr: 'منصور الزهراني',
    sound: 'fajr_mansour_al_zahrani',
    source: require('../../assets/audio/fajr-mansour-al-zahrani.mp3'),
    bytes: 3905851,
  },
  {
    id: 'fajr:traditional',
    name: "Traditional",
    nameAr: 'التقليدي',
    sound: 'fajr_traditional',
    source: require('../../assets/audio/fajr-traditional.mp3'),
    bytes: 1503337,
  },
];

export const ALL_ADHAN_TRACKS: AdhanTrack[] = [...FAJR_TRACKS, ...ADHAN_TRACKS];

/** The default for the five prayers: Alafasy, the most widely recognised. */
export const DEFAULT_ADHAN_ID = 'adhan:mishary-rashid-alafasy';
/** The default for Fajr: the traditional dawn call. */
export const DEFAULT_FAJR_ID = 'fajr:traditional';

export function adhanTrack(id: string, fallback: AdhanTrack): AdhanTrack {
  return ALL_ADHAN_TRACKS.find((track) => track.id === String(id || '')) || fallback;
}

/** Fajr asks for its own recording; every other prayer shares one. */
export function trackForPrayer(
  prayerName: string,
  fajrId: string,
  adhanId: string,
): AdhanTrack {
  return prayerName === 'Fajr'
    ? adhanTrack(fajrId, adhanTrack(DEFAULT_FAJR_ID, FAJR_TRACKS[0]))
    : adhanTrack(adhanId, adhanTrack(DEFAULT_ADHAN_ID, ADHAN_TRACKS[0]));
}
