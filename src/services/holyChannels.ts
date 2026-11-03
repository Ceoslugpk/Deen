import { Linking } from 'react-native';

/**
 * Live channels from the two holy mosques.
 *
 * These are the official Saudi Broadcasting Authority channels — Quran TV
 * carries Al-Masjid al-Haram from Makkah and Sunnah TV carries Al-Masjid
 * an-Nabawi from Madinah — plus the General Authority's own channel.
 *
 * The two SBA channels play inside the app, from the HLS playlists the
 * broadcaster publishes itself. The rest are links out to whoever is carrying
 * them, because re-broadcasting those here would need rights this app does not
 * hold. `url` is kept on every channel, including the two that play here, so
 * there is always somewhere to go when the stream will not start.
 */

export type HolyChannel = {
  id: string;
  site: 'Makkah' | 'Madinah' | 'Hajj';
  place: string;
  arabic: string;
  channel: string;
  broadcaster: string;
  detail: string;
  url: string;
  icon: string;
  /**
   * The broadcast itself, as an HLS playlist, for the channels we are
   * permitted to play inside the app.
   *
   * Only the two Saudi Broadcasting Authority feeds carry one. The rest are
   * links out, and say so, because playing them here would need rights the app
   * does not hold.
   *
   * Plain HTTP: the broadcaster publishes no HTTPS endpoint for these. Android
   * refuses cleartext by default from API 28, so `plugins/withHaramain-
   * Cleartext.js` opens it for this one host and nothing else.
   */
  streamUrl?: string;
};

/** The HLS playlists, published by the Saudi Broadcasting Authority. */
const SBA_LIVE = 'http://m.live.net.sa:1935/live';


export const HOLY_CHANNELS: HolyChannel[] = [
  {
    id: 'makkah-quran',
    site: 'Makkah',
    place: 'Al-Masjid al-Haram',
    arabic: 'الْمَسْجِدُ الْحَرَام',
    channel: 'Quran TV',
    broadcaster: 'Saudi Broadcasting Authority',
    detail: 'The Ka‘bah, the Tawaf, the five daily prayers, Jumu‘ah, and Taraweeh — broadcast from Makkah, twenty-four hours a day.',
    url: 'https://www.youtube.com/channel/UCos52azQNBgW63_9uDJoPDA/live',
    streamUrl: `${SBA_LIVE}/quran/playlist.m3u8`,
    icon: 'holy-sites',
  },
  {
    id: 'haramain',
    site: 'Makkah',
    place: 'The Two Holy Mosques',
    arabic: 'الْحَرَمَيْنِ الشَّرِيفَيْنِ',
    channel: 'Alharamain',
    broadcaster: 'General Authority for the care of the Two Holy Mosques',
    detail: 'The Authority’s own channel: prayers, sermons and service announcements from both holy mosques.',
    url: 'https://www.youtube.com/@alharamain_sa',
    icon: 'holy-sites',
  },
  {
    id: 'madinah-sunnah',
    site: 'Madinah',
    place: 'Al-Masjid an-Nabawi',
    arabic: 'الْمَسْجِدُ النَّبَوِيّ',
    channel: 'Sunnah TV',
    broadcaster: 'Saudi Broadcasting Authority',
    detail: 'The Prophet’s Mosque ﷺ: the five prayers with its imams, the Friday khutbah, and the Rawdah — from Madinah, twenty-four hours a day.',
    url: 'https://www.youtube.com/channel/UCROKYPep-UuODNwyipe6JMw/live',
    streamUrl: `${SBA_LIVE}/sunnah/playlist.m3u8`,
    icon: 'holy-sites',
  },
  {
    id: 'makkah-live',
    site: 'Makkah',
    place: 'Al-Masjid al-Haram',
    arabic: 'الْحَرَمُ الْمَكِّيُّ',
    channel: 'Haram feed',
    broadcaster: 'Relayed from Saudi Quran TV',
    detail: 'A plain web page carrying the same official feed, for when a phone browser is easier than the YouTube app.',
    url: 'https://makkahlive.net/makkahlive.aspx',
    icon: 'holy-sites',
  },
  {
    id: 'hajj-ministry',
    site: 'Hajj',
    place: 'The holy sites',
    arabic: 'الْمَشَاعِرُ الْمُقَدَّسَةُ',
    channel: 'Ministry of Hajj and Umrah',
    broadcaster: 'Ministry of Hajj and Umrah',
    detail: 'Official coverage from the holy sites — Arafah, Muzdalifah and Mina. The channel is live during the days of Hajj and carries other programming for the rest of the year.',
    url: 'https://www.youtube.com/@HajjUmrah',
    icon: 'holy-sites',
  },
];

export async function openChannel(channel: HolyChannel) {
  const canOpen = await Linking.canOpenURL(channel.url).catch(() => false);
  await Linking.openURL(channel.url).catch(() => undefined);
  return canOpen;
}
