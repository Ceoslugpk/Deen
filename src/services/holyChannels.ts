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
  site: 'Makkah' | 'Madinah';
  place: string;
  arabic: string;
  channel: string;
  broadcaster: string;
  detail: string;
  url: string;
  icon: string;
};

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
    url: 'https://makkahlive.net/madinalive.aspx',
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
];

export async function openChannel(channel: HolyChannel) {
  const canOpen = await Linking.canOpenURL(channel.url).catch(() => false);
  await Linking.openURL(channel.url).catch(() => undefined);
  return canOpen;
}
