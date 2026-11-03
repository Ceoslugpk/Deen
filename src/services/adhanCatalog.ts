/**
 * The adhan recordings the app can play.
 *
 * None of these ship inside the app. They are fetched once, after onboarding,
 * and kept in the app's own cache directory - 25 MB of audio in the install is
 * a cost everybody pays for a feature only some people use.
 *
 * Fajr is separate. The dawn call is its own recitation, longer and recited in
 * its own manner, so choosing one does not touch the other five prayers. Two
 * recordings exist for it; eighteen for the rest of the day.
 *
 * `sound` is kept only so older saved settings still resolve; the recording is
 * no longer a compiled resource, so nothing asks the system to play it.
 */
export type AdhanTrack = {
  /** `kind:id`, so a Fajr id and an adhan id can never be confused. */
  id: string;
  name: string;
  nameAr: string;
  /** Kept so settings saved by earlier builds still resolve. Unused now. */
  sound: string;
  /** Where the recording is fetched from, once, into the cache. */
  url: string;
  /** Size of the download, for the cache screen and the progress row. */
  bytes: number;
  /**
   * The name of the thirty-second clip shipped inside the app, without an
   * extension, for the tracks that have one.
   *
   * iOS cannot play a recording that lives outside the app: a custom
   * notification sound has to be in the bundle, and has to be no longer than
   * thirty seconds, or the system quietly plays its own tone instead. So the
   * tracks listed here can sound on iOS, and the rest cannot however much of
   * them has been downloaded.
   *
   * Android is unaffected — it plays the whole recording from the cache
   * through the alarm — so a track without a clip still works fully there.
   */
  clip?: string;
};

/** Where a recording is served from. `id` is already `kind:name`. */
function adhanAudioUrl(id: string): string {
  const [kind, name] = String(id || '').split(':');
  return `https://audio.islamicdata.uz/v1/${kind}/editions/${name}/audio`;
}

export const ADHAN_TRACKS: AdhanTrack[] = [
  {
    id: 'adhan:abdul-basit',
    name: "Abdul Basit",
    nameAr: 'عبد الباسط',
    sound: 'adhan_abdul_basit',
    url: adhanAudioUrl('adhan:abdul-basit'),
    bytes: 207723,
    clip: 'adhan_abdulbasit',
  },
  {
    id: 'adhan:abdul-ghaffar',
    name: "Abdul Ghaffar",
    nameAr: 'عبد الغفار',
    sound: 'adhan_abdul_ghaffar',
    url: adhanAudioUrl('adhan:abdul-ghaffar'),
    bytes: 188551,
  },
  {
    id: 'adhan:abdul-hakam',
    name: "Abdul Hakam",
    nameAr: 'عبد الحكم',
    sound: 'adhan_abdul_hakam',
    url: adhanAudioUrl('adhan:abdul-hakam'),
    bytes: 192363,
  },
  {
    id: 'adhan:ahmad-al-nafees',
    name: "Ahmad al-Nafees",
    nameAr: 'أحمد النفيس',
    sound: 'adhan_ahmad_al_nafees',
    url: adhanAudioUrl('adhan:ahmad-al-nafees'),
    bytes: 3418938,
    clip: 'adhan_nafees',
  },
  {
    id: 'adhan:al-hussaini',
    name: "Al-Hussaini",
    nameAr: 'الحسيني',
    sound: 'adhan_al_hussaini',
    url: adhanAudioUrl('adhan:al-hussaini'),
    bytes: 198580,
  },
  {
    id: 'adhan:bakir-bash',
    name: "Bakir Bash",
    nameAr: 'باقر باش',
    sound: 'adhan_bakir_bash',
    url: adhanAudioUrl('adhan:bakir-bash'),
    bytes: 349567,
  },
  {
    id: 'adhan:hafez',
    name: "Hafez",
    nameAr: 'حافظ',
    sound: 'adhan_hafez',
    url: adhanAudioUrl('adhan:hafez'),
    bytes: 168899,
  },
  {
    id: 'adhan:hafiz-murad',
    name: "Hafiz Murad",
    nameAr: 'حافظ مراد',
    sound: 'adhan_hafiz_murad',
    url: adhanAudioUrl('adhan:hafiz-murad'),
    bytes: 104226,
  },
  {
    id: 'adhan:hafiz-mustafa-ozcan-from-turkey',
    name: "Hafiz Mustafa Özcan from Turkey",
    nameAr: 'حافظ مصطفى أوزجان (تركيا)',
    sound: 'adhan_hafiz_mustafa_ozcan_from_turkey',
    url: adhanAudioUrl('adhan:hafiz-mustafa-ozcan-from-turkey'),
    bytes: 3805132,
    clip: 'adhan_ozcan',
  },
  {
    id: 'adhan:karl-jenkins',
    name: "Karl Jenkins",
    nameAr: 'كارل جينكينز',
    sound: 'adhan_karl_jenkins',
    url: adhanAudioUrl('adhan:karl-jenkins'),
    bytes: 2999080,
  },
  {
    id: 'adhan:mansour-al-zahrani',
    name: "Mansour Al-Zahrani",
    nameAr: 'منصور الزهراني',
    sound: 'adhan_mansour_al_zahrani',
    url: adhanAudioUrl('adhan:mansour-al-zahrani'),
    bytes: 3358625,
    clip: 'adhan_mansour',
  },
  {
    id: 'adhan:minshawi',
    name: "Minshawi",
    nameAr: 'المنشاوي',
    sound: 'adhan_minshawi',
    url: adhanAudioUrl('adhan:minshawi'),
    bytes: 237238,
    clip: 'adhan_minshawi',
  },
  {
    id: 'adhan:mishary-rashid-alafasy',
    name: "Mishary Rashid Alafasy",
    nameAr: 'مشاري رشيد العفاسي',
    sound: 'adhan_mishary_rashid_alafasy',
    url: adhanAudioUrl('adhan:mishary-rashid-alafasy'),
    bytes: 4114842,
    clip: 'adhan_mishary',
  },
  {
    id: 'adhan:naghshbandi',
    name: "Naghshbandi",
    nameAr: 'النقشبندي',
    sound: 'adhan_naghshbandi',
    url: adhanAudioUrl('adhan:naghshbandi'),
    bytes: 164568,
  },
  {
    id: 'adhan:saber',
    name: "Saber",
    nameAr: 'صابر',
    sound: 'adhan_saber',
    url: adhanAudioUrl('adhan:saber'),
    bytes: 151240,
  },
  {
    id: 'adhan:sharif-doman',
    name: "Sharif Doman",
    nameAr: 'شريف دومان',
    sound: 'adhan_sharif_doman',
    url: adhanAudioUrl('adhan:sharif-doman'),
    bytes: 283218,
  },
  {
    id: 'adhan:traditional',
    name: "Traditional",
    nameAr: 'التقليدي',
    sound: 'adhan_traditional',
    url: adhanAudioUrl('adhan:traditional'),
    bytes: 203440,
  },
  {
    id: 'adhan:yusuf-islam',
    name: "Yusuf Islam",
    nameAr: 'يوسف إسلام',
    sound: 'adhan_yusuf_islam',
    url: adhanAudioUrl('adhan:yusuf-islam'),
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
    url: adhanAudioUrl('fajr:mansour-al-zahrani'),
    bytes: 3905851,
    clip: 'fajr_mansour',
  },
  {
    id: 'fajr:traditional',
    name: "Traditional",
    nameAr: 'التقليدي',
    sound: 'fajr_traditional',
    url: adhanAudioUrl('fajr:traditional'),
    bytes: 1503337,
    clip: 'fajr_traditional',
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

/**
 * The sound to ask iOS for, or null when this track has no bundled clip.
 *
 * Only the bundled tracks can sound on iOS. Everything else has to fall back
 * to the system tone there, which the settings screen says out loud rather
 * than letting it look broken.
 */
export function adhanSoundName(track: AdhanTrack | null | undefined): string | null {
  return track?.clip ? track.clip : null;
}

/** Whether this recording can sound at prayer time on iOS. */
export function adhanSoundsOnIos(track: AdhanTrack | null | undefined): boolean {
  return Boolean(track?.clip);
}
