import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PrayerSnapshot } from './api';
import type { WorshipSettings } from './localState';

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

export async function requestNotificationPermission(): Promise<NotificationHealth> {
  if (Platform.OS === 'web') return 'unsupported';
  const result = await Notifications.requestPermissionsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-reminders', {
      name: 'Prayer reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 180, 250],
      lightColor: '#5146A4',
      sound: 'default',
    });
  }
  return result.status as NotificationHealth;
}

export async function sendTestNotification() {
  if (Platform.OS === 'web') throw new Error('System notifications require the installed iOS or Android app.');
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Prayer reminders are ready', body: 'Deen Companion can now notify you at the times you choose.', sound: 'default', data: { route: 'Prayer' } },
    trigger: null,
  });
}

export async function schedulePrayerNotifications(snapshot: PrayerSnapshot, settings: WorshipSettings) {
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
        title: `${prayer.name} in ${settings.reminderOffset} minutes`,
        body: `${prayer.name} begins at ${prayer.time}.`,
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
      content: { title: 'Your Quran time', body: 'Continue your reading with a few mindful verses.', data: { route: 'Quran' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'prayer-reminders' },
    });
    scheduled++;
  }
  return { scheduled, unsupported: false };
}
