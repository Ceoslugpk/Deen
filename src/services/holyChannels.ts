import { Linking } from 'react-native';

/**
 * Live channels from the two holy mosques.
 *
 * These are the official Saudi Broadcasting Authority channels — Quran TV carries
 * Al-Masjid al-Haram from Makkah and Sunnah TV carries Al-Masjid an-Nabawi from
 * Madinah — plus the General Authority's own channel. Every link below was
 * checked when it was added; streams open outside the app, in the browser or the
 * YouTube app, because re-broadcasting them here would need rights the app does
 * not hold.
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
  /** Present only where the broadcaster is a YouTube channel we can embed. */
  channelId?: string;
  /** YouTube embed for whatever that channel is streaming right now. */
  embedUrl?: string;
};

/* YouTube resolves a channel's current livestream through this path, so the
   app does not have to know the video id, which changes with every broadcast. */
const liveEmbed = (channelId: string) =>
  `https://www.youtube.com/embed/live_stream?channel=${channelId}&enablejsapi=1`;


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
    channelId: 'UCos52azQNBgW63_9uDJoPDA',
    embedUrl: liveEmbed('UCos52azQNBgW63_9uDJoPDA'),
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
    channelId: 'UCROKYPep-UuODNwyipe6JMw',
    embedUrl: liveEmbed('UCROKYPep-UuODNwyipe6JMw'),
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
