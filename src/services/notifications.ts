import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { arNoun, clockTime, prayerName } from './arabicCopy';
import type { PrayerSnapshot } from './api';
import type { WorshipSettings } from './localState';

/**
 * The wording of a notification is fixed when it is scheduled, not when it
 * appears: by then the system is showing it and the app may not even be
 * running. So the language is passed in at scheduling time and the strings
 * live here rather than in the interface copy.
 */
const COPY = {
  en: {
    channel: 'Prayer reminders',
    testTitle: 'Prayer reminders are ready',
    testBody: 'Deen Companion can now notify you at the times you choose.',
    quranTitle: 'Your Quran time',
    quranBody: 'Continue your reading with a few mindful verses.',
    webUnsupported: 'System notifications require the installed iOS or Android app.',
  },
  ar: {
    channel: 'تذكيرات الصلاة',
    testTitle: 'تذكيرات الصلاة جاهزة',
    testBody: 'يمكن لرفيق الدين تنبيهك الآن في الأوقات التي تختارها.',
    quranTitle: 'وقت القرآن',
    quranBody: 'واصل قراءتك بآياتٍ متدبَّرة.',
    webUnsupported: 'التنبيهات النظامية تحتاج التطبيق المثبَّت على iOS أو أندرويد.',
  },
};

const copy = (rtl: boolean) => (rtl ? COPY.ar : COPY.en);

/** Minutes, with the Arabic noun agreeing with the number in front of it. */
function minutesWord(rtl: boolean, n: number) {
  if (!rtl) return n === 1 ? '1 minute' : `${n} minutes`;
  return `${n} ${arNoun(n, 'دقيقة', 'دقيقتان', 'دقائق', 'دقيقة')}`;
}

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export type NotificationHealth = 'unsupported' | 'undetermined' | 'denied' | 'granted';

export async function getNotificationHealth(): Promise<NotificationHealth> {
  if (Platform.OS === 'web') return 'unsupported';
  const current = await Notifications.getPermissionsAsync();
  return current.status as NotificationHealth;
}

export async function requestNotificationPermission(rtl = false): Promise<NotificationHealth> {
  if (Platform.OS === 'web') return 'unsupported';
  const result = await Notifications.requestPermissionsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-reminders', {
      name: copy(rtl).channel,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 180, 250],
      lightColor: '#5146A4',
      sound: 'default',
    });
  }
  return result.status as NotificationHealth;
}

export async function sendTestNotification(rtl = false) {
  if (Platform.OS === 'web') throw new Error(copy(rtl).webUnsupported);
  await Notifications.scheduleNotificationAsync({
    content: { title: copy(rtl).testTitle, body: copy(rtl).testBody, sound: 'default', data: { route: 'Prayer' } },
    trigger: null,
  });
}

export async function schedulePrayerNotifications(snapshot: PrayerSnapshot, settings: WorshipSettings, rtl = false) {
  if (Platform.OS === 'web') return { scheduled: 0, unsupported: true };
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) return { scheduled: 0, unsupported: false };
  let scheduled = 0;
  const now = new Date();
  for (const prayer of snapshot.prayers) {
    if (prayer.name === 'Sunrise' || !settings.prayerReminders[prayer.name]) continue;
    const [hour, minute] = prayer.raw.split(':').map(Number);
    const triggerDate = new Date();
    triggerDate.setHours(hour, minute - settings.reminderOffset, 0, 0);
    if (triggerDate <= now) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: rtl
          ? `${prayerName(true, prayer.name)} بعد ${minutesWord(true, settings.reminderOffset)}`
          : `${prayerName(false, prayer.name)} in ${minutesWord(false, settings.reminderOffset)}`,
        body: rtl
          ? `يبدأ وقت ${prayerName(true, prayer.name)} في ${clockTime(true, prayer.time)}`
          : `${prayerName(false, prayer.name)} begins at ${clockTime(false, prayer.time)}.`,
        sound: 'default',
        data: { route: 'Prayer', prayer: prayer.name },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate, channelId: 'prayer-reminders' },
    });
    scheduled++;
  }
  if (settings.quranReminderEnabled) {
    const [hour, minute] = settings.quranReminderTime.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: { title: copy(rtl).quranTitle, body: copy(rtl).quranBody, data: { route: 'Quran' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'prayer-reminders' },
    });
    scheduled++;
  }
  return { scheduled, unsupported: false };
}
