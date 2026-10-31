import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { arNoun, clockTime, prayerName } from './arabicCopy';
import type { PrayerSnapshot } from './api';
import type { WorshipSettings } from './localState';

/**
 * Everything the app says out loud, and when it says it.
 *
 * The wording of a notification is fixed when it is *scheduled*, not when it
 * appears — by then the system is showing it and the app may not even be
 * running. So the language is passed in at scheduling time and the strings live
 * here rather than in the interface copy.
 *
 * Four things are scheduled, and each is independent:
 *
 *   - a quiet heads-up some minutes before each prayer;
 *   - the adhan itself at the prayer time, with buttons to silence it or to
 *     record the prayer as prayed without opening the app;
 *   - a nudge back to your reading, half an hour after a prayer;
 *   - one verse or hadith each morning.
 *
 * Every one of them is off until it is switched on, and switching it off
 * cancels what was scheduled rather than leaving it to fire regardless.
 */

/**
 * The adhan voices that can sound from a notification.
 *
 * Only what is actually in the app can play, so this list is built from
 * `assets/audio`: every file named `adhan-*.mp3` there is copied into the
 * Android raw resources by the `withAdhanSounds` plugin, under the filename
 * with punctuation turned into underscores. `adhan-doha-public-domain.mp3`
 * therefore becomes the sound `adhan_doha_public_domain`.
 *
 * Adding another recording is a matter of dropping the file in — no code
 * change, and no rebuild of this list. If a named sound is somehow missing the
 * system tone plays instead, because an adhan that fails to make a noise at all
 * is worse than one that uses a generic chime.
 */
export const ADHAN_OPTIONS: { id: string; label: string; labelAr: string; sound: string }[] = [
  { id: 'doha', label: 'Doha', labelAr: 'الدوحة', sound: 'adhan_doha_public_domain' },
  { id: 'default', label: 'System tone', labelAr: 'نغمة الجهاز', sound: 'default' },
];

export function adhanOption(id: string) {
  // Tolerant of an old saved value that stored the label rather than the id.
  const wanted = String(id || '').toLowerCase();
  return ADHAN_OPTIONS.find((option) => option.id === wanted || option.label.toLowerCase() === wanted)
    || ADHAN_OPTIONS[ADHAN_OPTIONS.length - 1];
}

const COPY = {
  en: {
    channelReminder: 'Prayer reminders',
    channelAdhan: 'Adhan',
    channelDaily: 'Daily reminder',
    testTitle: 'Prayer reminders are ready',
    testBody: 'Islamic can now notify you at the times you choose.',
    quranTitle: 'Your Quran time',
    quranBody: 'Continue your reading with a few mindful verses.',
    webUnsupported: 'System notifications require the installed iOS or Android app.',
    adhanBody: 'It is time for prayer.',
    adhanBodyName: (name: string) => `Time for ${name}.`,
    mute: 'Silence',
    prayed: 'Mark as prayed',
    continueTitle: 'Pick up where you left off',
    continueBody: (where: string) => `You were reading ${where}.`,
    verseTitle: 'Ayah of the day',
    hadithTitle: 'Hadith of the day',
    preAdhan: (name: string, mins: string) => `${name} in ${mins}`,
    preAdhanBody: (name: string, at: string) => `${name} begins at ${at}.`,
    sleepTitle: 'Surah Al-Mulk before you sleep',
    sleepBody: 'Thirty verses that intercede for the one who recites them. It takes about five minutes.',
    sleepAction: 'Read it now',
  },
  ar: {
    channelReminder: 'تذكيرات الصلاة',
    channelAdhan: 'الأذان',
    channelDaily: 'تذكير يومي',
    testTitle: 'تذكيرات الصلاة جاهزة',
    testBody: 'يمكن لرفيق الدين تنبيهك الآن في الأوقات التي تختارها.',
    quranTitle: 'وقت القرآن',
    quranBody: 'واصل قراءتك بآياتٍ متدبَّرة.',
    webUnsupported: 'التنبيهات النظامية تحتاج التطبيق المثبَّت على iOS أو أندرويد.',
    adhanBody: 'حان وقت الصلاة.',
    adhanBodyName: (name: string) => `حان وقت ${name}.`,
    mute: 'إسكات',
    prayed: 'صليت',
    continueTitle: 'أكمل من حيث توقفت',
    continueBody: (where: string) => `كنت تقرأ ${where}.`,
    verseTitle: 'آية اليوم',
    hadithTitle: 'حديث اليوم',
    preAdhan: (name: string, mins: string) => `${name} بعد ${mins}`,
    preAdhanBody: (name: string, at: string) => `يبدأ ${name} في ${at}.`,
    sleepTitle: 'سورة الملك قبل النوم',
    sleepBody: 'ثلاثون آية تشفع لصاحبها حتى يُغفر له. تستغرق نحو خمس دقائق.',
    sleepAction: 'اقرأها الآن',
  },
};

const copy = (rtl: boolean) => (rtl ? COPY.ar : COPY.en);

/**
 * Surah Al-Mulk, and why it is the one this reminder is about.
 *
 * Jami` at-Tirmidhi 2891 (hasan): "Indeed there is a Surah in the Qur'an of
 * thirty Ayat, which intercedes for a man until he is forgiven. It is [Surah]
 * Tabarak Alladhi Biyadihil-Mulk."
 *
 * The nightly practice itself comes from the next hadith, Tirmidhi 2892: the
 * Prophet (peace be upon him) would not sleep until he had recited As-Sajdah
 * and Al-Mulk. Both are quoted in the app so the reminder rests on what the
 * texts actually say rather than on a habit nobody can source.
 */
export const SLEEP_SURAH = {
  chapterId: 67,
  name: 'Al-Mulk',
  nameAr: 'الملك',
  verses: 30,
  hadith: 'Jami` at-Tirmidhi 2891 · hasan',
  hadithAr: 'جامع الترمذي ٢٨٩١ · حسن',
  practice: 'Jami` at-Tirmidhi 2892',
  practiceAr: 'جامع الترمذي ٢٨٩٢',
};

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

/**
 * The channels and the action buttons, created once.
 *
 * The adhan gets its own channel so the person can lower the volume of
 * everything else without touching it, and so the chosen adhan sound plays
 * even when the phone is set to silent for notifications.
 */
export async function ensureNotificationChannels(rtl = false) {
  if (Platform.OS !== 'android') return;
  const c = copy(rtl);
  await Notifications.setNotificationChannelAsync('adhan', {
    name: c.channelAdhan,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 180, 250],
    lightColor: '#452D9F',
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync('prayer-reminders', {
    name: c.channelReminder,
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 180, 250],
    lightColor: '#452D9F',
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync('daily', {
    name: c.channelDaily,
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });

  /* Two buttons on the adhan itself. Somebody mid-prayer does not want to
     unlock their phone to silence it, and somebody who has prayed should be
     able to record that from the lock screen. */
  await Notifications.setNotificationCategoryAsync('adhan-actions', [
    { identifier: 'MUTE', buttonTitle: c.mute, options: { isDestructive: false, opensAppToForeground: false } },
    { identifier: 'PRAYED', buttonTitle: c.prayed, options: { isDestructive: false, opensAppToForeground: false } },
  ]);
}

export async function requestNotificationPermission(rtl = false): Promise<NotificationHealth> {
  if (Platform.OS === 'web') return 'unsupported';
  const result = await Notifications.requestPermissionsAsync();
  await ensureNotificationChannels(rtl);
  return result.status as NotificationHealth;
}

export async function sendTestNotification(rtl = false) {
  if (Platform.OS === 'web') throw new Error(copy(rtl).webUnsupported);
  await ensureNotificationChannels(rtl);
  await Notifications.scheduleNotificationAsync({
    content: { title: copy(rtl).testTitle, body: copy(rtl).testBody, sound: 'default', data: { route: 'Prayer' } },
    trigger: null,
  });
}

/** Turn "18:42" into today's Date at that time. */
function atTime(raw: string): Date | null {
  const [hour, minute] = String(raw || '').split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

const dateTrigger = (date: Date, channelId: string) =>
  ({ type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId }) as any;

const dailyTrigger = (hour: number, minute: number, channelId: string) =>
  ({ type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId }) as any;

export type ScheduleResult = {
  scheduled: number;
  unsupported: boolean;
  /** How many of the scheduled ones are the adhan itself. */
  adhans: number;
};

/**
 * Schedule everything, from scratch.
 *
 * Called whenever any of it could have changed: a new day's prayer times, a
 * move to a new city, a settings toggle, or the app being opened. Everything
 * previously scheduled is cancelled first, because the alternative — trying to
 * work out which of the old timers are still right — is how you end up with a
 * phone that prays at yesterday's times.
 */
export async function schedulePrayerNotifications(
  snapshot: PrayerSnapshot,
  settings: WorshipSettings,
  rtl = false,
  readingLabel?: string,
): Promise<ScheduleResult> {
  if (Platform.OS === 'web') return { scheduled: 0, unsupported: true, adhans: 0 };

  await ensureNotificationChannels(rtl);
  await Notifications.cancelAllScheduledNotificationsAsync();

  const c = copy(rtl);
  const now = new Date();
  let scheduled = 0;
  let adhans = 0;

  const prayers = snapshot.prayers.filter((prayer) => prayer.name !== 'Sunrise');

  for (const prayer of prayers) {
    const at = atTime(prayer.raw);
    if (!at) continue;
    const name = prayerName(rtl, prayer.name);

    // ---- 1. the adhan itself ------------------------------------------
    if (settings.adhanEnabled?.[prayer.name]) {
      const sound = adhanOption(settings.adhanReciter).sound;
      if (at > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: name,
            body: c.adhanBodyName(name),
            sound,
            categoryIdentifier: 'adhan-actions',
            data: { route: 'Prayer', kind: 'adhan', prayer: prayer.name },
            // Stay on screen rather than vanishing: an adhan you have to hunt
            // for in the shade is an adhan you missed.
            sticky: true,
          },
          trigger: dateTrigger(at, 'adhan'),
        });
        scheduled++;
        adhans++;
      }

      // ---- 2. back to your reading, half an hour later -----------------
      if (settings.continueReadingReminder !== false && readingLabel) {
        const later = new Date(at.getTime() + 30 * 60 * 1000);
        if (later > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: c.continueTitle,
              body: c.continueBody(readingLabel),
              sound: 'default',
              data: { route: 'Quran', kind: 'continue' },
            },
            trigger: dateTrigger(later, 'daily'),
          });
          scheduled++;
        }
      }
    }

    // ---- 3. the quiet heads-up before ---------------------------------
    if (settings.remindersEnabled && settings.prayerReminders?.[prayer.name]) {
      const early = new Date(at.getTime() - settings.reminderOffset * 60 * 1000);
      if (early > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: c.preAdhan(name, minutesWord(rtl, settings.reminderOffset)),
            body: c.preAdhanBody(name, clockTime(rtl, prayer.time)),
            sound: 'default',
            data: { route: 'Prayer', kind: 'pre-adhan', prayer: prayer.name },
          },
          trigger: dateTrigger(early, 'prayer-reminders'),
        });
        scheduled++;
      }
    }
  }

  // ---- 4. one verse or hadith each morning ----------------------------
  const daily = (on: boolean | undefined, raw: string, kind: string, title: string, route: string) => {
    if (!on) return;
    const at = atTime(raw);
    if (!at) return;
    return Notifications.scheduleNotificationAsync({
      content: { title, body: '', sound: 'default', data: { route, kind } },
      trigger: dailyTrigger(at.getHours(), at.getMinutes(), 'daily'),
    });
  };

  if (settings.dailyVerseReminder) {
    await daily(true, settings.dailyVerseTime || '08:00', 'daily-verse', c.verseTitle, 'Home');
    scheduled++;
  }
  if (settings.dailyHadithReminder) {
    await daily(true, settings.dailyHadithTime || '09:00', 'daily-hadith', c.hadithTitle, 'Home');
    scheduled++;
  }

  /* ---- 5. Surah Al-Mulk before sleeping --------------------------------
     Scheduled on its own rather than folded into the morning reminders,
     because it is the one reminder tied to a time of day the person chose
     themselves and may well change. */
  if (settings.sleepReminderEnabled) {
    const at = atTime(settings.sleepReminderTime || '22:30');
    if (at) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: c.sleepTitle,
          body: c.sleepBody,
          sound: 'default',
          // Opens straight into the surah, so the reminder and the reading
          // are one motion rather than two.
          data: { route: 'Quran', kind: 'sleep', surah: SLEEP_SURAH.chapterId },
        },
        trigger: dailyTrigger(at.getHours(), at.getMinutes(), 'daily'),
      });
      scheduled++;
    }
  }

  // The older Quran reminder, kept for anyone who set it before the above existed.
  if (settings.quranReminderEnabled) {
    const at = atTime(settings.quranReminderTime);
    if (at) {
      await Notifications.scheduleNotificationAsync({
        content: { title: c.quranTitle, body: c.quranBody, data: { route: 'Quran' } },
        trigger: dailyTrigger(at.getHours(), at.getMinutes(), 'daily'),
      });
      scheduled++;
    }
  }

  return { scheduled, unsupported: false, adhans };
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** What is currently queued, for the settings screen to be honest about. */
export async function getScheduledCount(): Promise<number> {
  if (Platform.OS === 'web') return 0;
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.length;
}

/**
 * Marks a prayer as prayed from the notification button.
 *
 * Returns the prayer name so the caller can do the bookkeeping identically to
 * somebody pressing the button inside the app.
 */
export function prayerFromNotification(data: any): string | null {
  return typeof data?.prayer === 'string' ? data.prayer : null;
}

export type NotificationAction = 'mute' | 'prayed' | null;

export function actionFromResponse(response: Notifications.NotificationResponse): NotificationAction {
  const id = response?.actionIdentifier;
  if (id === 'MUTE') return 'mute';
  if (id === 'PRAYED') return 'prayed';
  return null;
}
