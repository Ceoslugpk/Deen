/**
 * The adhan recordings the app can play.
 *
 * Almost all of these are fetched once, after onboarding, and kept in the
 * app's own cache directory. Shipping the full set - all twenty, at 24 MB of
 * three-and-a-half-minute recordings - would be a cost everybody pays for a
 * feature only some people use.
 *
 * Eight of them also ship inside the app, as thirty-second clips. That is not
 * a convenience, it is the only way iOS can sound the real adhan at all: a
 * notification on iOS can only play a sound that is compiled into the bundle,
 * and only if it is under thirty seconds. A downloaded recording, however it
 * is stored, is silently replaced by the system tone. So the eight bundled
 * clips are what iOS plays; Android keeps the full recording through the
 * native alarm and loses nothing.
 *
 * The eight were chosen for being recognisable and for the quality of the
 * source: the popular recitations, and the ones whose masters are not so
 * heavily compressed that a clip of them sounds thin.
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
   * A thirty-second clip compiled into the app, named without its extension.
   *
   * Present on eight of the twenty. It is what iOS plays at the prayer time,
   * it is what the settings screen previews instantly instead of waiting for a
   * download, and it is what sounds when nothing has been fetched yet.
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
    clip: 'adhan_abdul_basit',
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
    clip: 'adhan_ahmad_al_nafees',
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
    clip: 'adhan_hafiz_mustafa_ozcan',
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
    clip: 'adhan_mansour_al_zahrani',
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
    clip: 'adhan_mishary_rashid_alafasy',
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
    clip: 'fajr_mansour_al_zahrani',
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

/**
 * Whether a thirty-second clip of this recording is compiled into the app.
 *
 * Only eight of the twenty are. The rest can still be chosen and will still
 * sound on Android, but there is nothing in the bundle for iOS to play, so on
 * iOS they are not offered — listing a voice that silently becomes a system
 * tone is worse than not listing it.
 */
export function hasClip(track: AdhanTrack | null | undefined): boolean {
  return Boolean(track && track.clip);
}

/**
 * The name to hand to a notification, extension included.
 *
 * iOS resolves this against the app bundle and plays nothing it cannot find,
 * so it is worth being exact about. `null` when there is no clip, which the
 * caller reads as "let the system tone sound".
 */
export function clipSoundName(track: AdhanTrack | null | undefined): string | null {
  return track?.clip ? `${track.clip}.m4a` : null;
}

/** The bundled clip as something a player can load, for previews on iOS. */
export const ADHAN_CLIPS: Record<string, any> = {
  adhan_mishary_rashid_alafasy: require('../../assets/sounds/adhan_mishary_rashid_alafasy.m4a'),
  adhan_mansour_al_zahrani: require('../../assets/sounds/adhan_mansour_al_zahrani.m4a'),
  adhan_hafiz_mustafa_ozcan: require('../../assets/sounds/adhan_hafiz_mustafa_ozcan.m4a'),
  adhan_ahmad_al_nafees: require('../../assets/sounds/adhan_ahmad_al_nafees.m4a'),
  adhan_abdul_basit: require('../../assets/sounds/adhan_abdul_basit.m4a'),
  adhan_minshawi: require('../../assets/sounds/adhan_minshawi.m4a'),
  fajr_mansour_al_zahrani: require('../../assets/sounds/fajr_mansour_al_zahrani.m4a'),
  fajr_traditional: require('../../assets/sounds/fajr_traditional.m4a'),
};

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
