import { Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { arNoun, clockTime, prayerName } from './arabicCopy';
import type { PrayerSnapshot } from './api';
import type { WorshipSettings } from './localState';
import { ADHAN_TRACKS, FAJR_TRACKS, adhanSoundName, adhanTrack, type AdhanTrack } from './adhanCatalog';
import { isAdhanCached } from './adhanCache';
import { isAdhanAlarmAvailable, canScheduleExactAlarms, scheduleAdhanAlarms, cancelAdhanAlarms } from './adhanAlarm';
import { recordScheduled, type PendingEntry } from './notificationLog';
import { createSerialQueue } from './scheduleQueue';

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
 * Only what is actually compiled into the app can play from a notification, so
 * this is the bundled catalogue: every file named `adhan-*.mp3` or
 * `fajr-*.mp3` in `assets/audio` is copied by the `withAdhanSounds` plugin
 * under the filename with punctuation turned into underscores, and that
 * resource name is what the system is asked to play.
 *
 * Adding another recording is a matter of dropping the file in and naming it
 * in the catalogue. If a named sound is somehow missing the system tone plays
 * instead, because an adhan that fails to make a noise at all is worse than
 * one that uses a generic chime — which is also why the bundled list carries
 * its own fallback rather than trusting a value read off disk.
 */
export const ADHAN_OPTIONS: { id: string; label: string; labelAr: string; sound: string }[] = [
  ...ADHAN_TRACKS.map((track) => ({
    id: track.id, label: track.name, labelAr: track.nameAr, sound: track.sound,
  })),
  { id: 'default', label: 'System tone', labelAr: 'نغمة الجهاز', sound: 'default' },
];

/** Fajr's own recordings, offered in the same shape. */
export const FAJR_OPTIONS: { id: string; label: string; labelAr: string; sound: string }[] = [
  ...FAJR_TRACKS.map((track) => ({
    id: track.id, label: track.name, labelAr: track.nameAr, sound: track.sound,
  })),
  { id: 'default', label: 'System tone', labelAr: 'نغمة الجهاز', sound: 'default' },
];

const SYSTEM_TONE = { id: 'default', label: 'System tone', labelAr: 'نغمة الجهاز', sound: 'default' };

function pickOption(options: typeof ADHAN_OPTIONS, id: string) {
  /* Tolerant of an old saved value that stored the label rather than the id. */
  const wanted = String(id || '').toLowerCase();
  return options.find((option) => option.id === wanted || option.label.toLowerCase() === wanted)
    || SYSTEM_TONE;
}

export function adhanOption(id: string) {
  return pickOption(ADHAN_OPTIONS, id);
}

export function fajrOption(id: string) {
  return pickOption(FAJR_OPTIONS, id);
}

/**
 * Which recording a prayer asks for.
 *
 * Fajr is the only prayer with its own recording. Everything else — Dhuhr,
 * Asr, Maghrib, Isha — shares the one choice, so picking a noon adhan does
 * not quietly change what sounds at dawn.
 */
export function adhanTrackFor(prayerName: string, settings: { adhanReciter?: string; adhanFajrReciter?: string }): AdhanTrack {
  const id = prayerName === 'Fajr'
    ? fajrOption(settings.adhanFajrReciter || '').id
    : adhanOption(settings.adhanReciter || '').id;
  return adhanTrack(id, prayerName === 'Fajr' ? FAJR_TRACKS[0] : ADHAN_TRACKS[0]);
}

/**
 * Why the real recording will not sound at prayer time.
 *
 * `null` means it will. Anything else is a reason the settings screen can
 * explain, because "the adhan did not play" is not something a person can
 * act on without being told which of these it was.
 */
export type AdhanAudioReason =
  | 'no-adhan-enabled'
  | 'alarm-unavailable'
  | 'exact-alarms-denied'
  | 'not-downloaded'
  /**
   * The chosen recording is not one of the ones shipped inside the app, so
   * iOS has nothing to play. Downloading will not help — the file has to be
   * in the bundle — so this is said separately from `not-downloaded`, which
   * tells somebody to fetch the file and would send them in circles.
   */
  | 'ios-no-clip'
  | 'alarm-rejected'
  /**
   * There is no app to sound it from: scheduling, alarms and notification
   * sounds are all native, so on the web none of the above applies. Named
   * rather than reusing `no-adhan-enabled`, which would be read elsewhere as
   * the setting being switched off.
   */
  | 'web-unsupported';

export type AdhanAudio = {
  /** True when the actual recording will sound at the prayer time. */
  willPlay: boolean;
  reason: AdhanAudioReason | null;
  /** How many alarms the system accepted, and how many it was not given. */
  scheduled: number;
  skipped: number;
};

/**
 * Whether the alarm can be trusted on this device, decided once per pass.
 *
 * Exact alarms are the whole mechanism: without them the system is free to
 * deliver the alarm late or not at all, and the adhan arrives at the wrong
 * moment or not at all. Android 12+ grants the permission by default but the
 * person can withdraw it, and several manufacturers refuse it outright, so it
 * is checked rather than assumed.
 *
 * This is the check that used to be missing. The alarm was trusted purely
 * because the module was present, so on a device that would not honour an
 * exact alarm the adhan was silenced in favour of an alarm that never came.
 */
/**
 * The single place that turns everything known about the last pass into one
 * explanation, ordered so the most fixable cause is the one reported.
 */
function diagnoseAdhanAudio(facts: {
  /* Two counts, and the difference between them is the whole point. How many
     prayers the adhan is switched on for, and how many were actually laid down
     for the rest of today. After the last prayer of the day the second is zero
     while the first is not, and that is the evening, not a fault. */
  adhansEnabled: number;
  adhansScheduled: number;
  alarm: { usable: boolean; reason: AdhanAudioReason | null };
  alarms: { scheduled: number; skipped: number };
  recordingMissing: boolean;
}): AdhanAudioReason | null {
  const { adhansEnabled, adhansScheduled, alarm, alarms, recordingMissing } = facts;
  if (adhansEnabled === 0) return 'no-adhan-enabled';
  if (alarms.scheduled > 0) return null;
  if (alarm.reason) return alarm.reason;
  if (recordingMissing) return 'not-downloaded';
  /* Nothing scheduled and nothing at fault: every prayer left is tomorrow's.
     Reporting a fault here would mean the adhan looked broken for about five
     hours every single night. */
  if (adhansScheduled === 0) return null;
  return 'alarm-rejected';
}

async function alarmIsTrustworthy(): Promise<{ usable: boolean; reason: AdhanAudioReason | null }> {
  if (!isAdhanAlarmAvailable()) return { usable: false, reason: 'alarm-unavailable' };
  let exact = false;
  try { exact = await canScheduleExactAlarms(); } catch { exact = false; }
  if (!exact) return { usable: false, reason: 'exact-alarms-denied' };
  return { usable: true, reason: null };
}

const COPY = {
  en: {
    channelReminder: 'Prayer reminders',
    channelAdhan: 'Adhan',
    channelDaily: 'Daily reminder',
    testTitle: 'Prayer reminders are ready',
    testBodyQuiet: 'This is the quiet daily reminder — it arrives in your tray and waits.',
    testAdhanTitle: 'Adhan',
    testAdhanBody: 'This is the adhan: it sounds, it stays on screen, and it carries the two buttons. Tap Silence or Mark as prayed to try them.',
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
  fa: {
    channelReminder: 'یادآوری‌های نماز',
    channelAdhan: 'اذان',
    channelDaily: 'یادآوری روزانه',
    testTitle: 'یادآوری‌های نماز آماده است',
    testBodyQuiet: 'این یادآوریِ آرامِ روزانه است — به نوار اعلان‌ها می‌آید و منتظر می‌ماند.',
    testAdhanTitle: 'اذان',
    testAdhanBody: 'این اذان است: صدا می‌دهد، روی صفحه می‌ماند و دو دکمه دارد. برای امتحان «بی‌صدا» یا «خوانده‌ام» را بزنید.',
    quranTitle: 'وقت قرآن',
    quranBody: 'تلاوت خود را با چند آیهٔ همراه با تدبّر ادامه دهید.',
    webUnsupported: 'اعلان‌های سیستمی نیازمند نسخهٔ نصب‌شدهٔ برنامه روی iOS یا اندروید است.',
    adhanBody: 'وقت نماز فرا رسیده است.',
    adhanBodyName: (name: string) => `وقت ${name} فرا رسیده است.`,
    mute: 'بی‌صدا',
    prayed: 'خوانده‌ام',
    continueTitle: 'ادامه از همان‌جا که بودید',
    continueBody: (where: string) => `در حال خواندن ${where} بودید.`,
    verseTitle: 'آیهٔ روز',
    hadithTitle: 'حدیث روز',
    preAdhan: (name: string, mins: string) => `${name} در ${mins}`,
    preAdhanBody: (name: string, at: string) => `${name} در ساعت ${at} آغاز می‌شود.`,
    sleepTitle: 'سورهٔ ملک پیش از خواب',
    sleepBody: 'سی آیه که برای قاریِ خود شفاعت می‌کند. حدود پنج دقیقه زمان می‌برد.',
    sleepAction: 'همین حالا بخوانید',
  },
  tr: {
    channelReminder: 'Namaz hatırlatmaları',
    channelAdhan: 'Ezan',
    channelDaily: 'Günlük hatırlatma',
    testTitle: 'Namaz hatırlatmaları hazır',
    testBodyQuiet: 'Bu sessiz günlük hatırlatmadır — bildirim tepsisine gelir ve bekler.',
    testAdhanTitle: 'Ezan',
    testAdhanBody: 'Bu ezandır: ses verir, ekranda kalır ve iki düğme taşır. Denemek için «Sessize al» veya «Kıldım»a dokunun.',
    quranTitle: 'Kur’an vakti',
    quranBody: 'Okumanızı birkaç ayetle, üzerinde düşünerek sürdürün.',
    webUnsupported: 'Sistem bildirimleri için iOS veya Android uygulamasının kurulu olması gerekir.',
    adhanBody: 'Namaz vakti geldi.',
    adhanBodyName: (name: string) => `${name} vakti geldi.`,
    mute: 'Sessize al',
    prayed: 'Kıldım',
    continueTitle: 'Kaldığınız yerden devam edin',
    continueBody: (where: string) => `${where} okuyordunuz.`,
    verseTitle: 'Günün ayeti',
    hadithTitle: 'Günün hadisi',
    preAdhan: (name: string, mins: string) => `${name} ${mins} içinde`,
    preAdhanBody: (name: string, at: string) => `${name} saat ${at}te başlıyor.`,
    sleepTitle: 'Uyumadan önce Mülk suresi',
    sleepBody: 'Okuyanı için şefaat eden otuz ayet. Yaklaşık beş dakika sürüyor.',
    sleepAction: 'Şimdi oku',
  },
  ar: {
    channelReminder: 'تذكيرات الصلاة',
    channelAdhan: 'الأذان',
    channelDaily: 'تذكير يومي',
    testTitle: 'تذكيرات الصلاة جاهزة',
    testBodyQuiet: 'هذا هو التذكير اليومي الهادئ — يصل إلى شريط التنبيهات وينتظر.',
    testAdhanTitle: 'الأذان',
    testAdhanBody: 'هذا هو الأذان: يصدر صوتًا، ويبقى على الشاشة، ويحمل الزرّين. جرّب «إسكات» أو «صليت».',
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
    ur: {
      channelReminder: 'نماز کی یادہانیاں',
      channelAdhan: 'اذان',
      channelDaily: 'روزانہ کی یادہانی',
      testTitle: 'نماز کی یادہانیاں تیار ہیں',
      testBodyQuiet: 'یہ پُرسکون روزانہ یادہانی ہے — یہ اطلاعات میں آتی ہے اور منتظر رہتی ہے۔',
      testAdhanTitle: 'اذان',
      testAdhanBody: 'یہ اذان ہے: یہ بجتی ہے، اسکرین پر رہتی ہے، اور دو بٹن رکھتی ہے۔ آزمانے کے لیے «خاموش» یا «ادا ہو گئی» پر ٹیپ کریں۔',
      quranTitle: 'قرآن کا وقت',
      quranBody: 'کچھ آیاتِ با تدبر کے ساتھ اپنی تلاوت جاری رکھیں۔',
      webUnsupported: 'سسٹم کی اطلاعات کے لیے انسٹال شدہ iOS یا اینڈرائیڈ ایپ درکار ہے۔',
      adhanBody: 'نماز کا وقت ہو گیا ہے۔',
      adhanBodyName: (name: string) => `${name} کا وقت ہو گیا ہے۔`,
      mute: 'خاموش',
      prayed: 'ادا ہو گئی',
      continueTitle: 'جہاں چھوڑا تھا وہاں سے',
      continueBody: (where: string) => `آپ ${where} پڑھ رہے تھے۔`,
      verseTitle: 'روز کی آیت',
      hadithTitle: 'روز کی حدیث',
      preAdhan: (name: string, mins: string) => `${name} ${mins} میں`,
      preAdhanBody: (name: string, at: string) => `${name} ${at} بجے شروع ہوتی ہے۔`,
      sleepTitle: 'سونے سے پہلے سورۃ الملک',
      sleepBody: 'تیس آیات جو پڑھنے والے کی سفارش کرتی ہیں۔ اس میں تقریباً پانچ منٹ لگتے ہیں۔',
      sleepAction: 'ابھی پڑھیں',
    },
  id: {
    channelReminder: 'Pengingat salat',
    channelAdhan: 'Adzan',
    channelDaily: 'Pengingat harian',
    testTitle: 'Pengingat salat sudah siap',
    testBodyQuiet:
      'Ini pengingat harian yang pelan — ia masuk ke bilah notifikasi dan menanti.',
    testAdhanTitle: 'Adzan',
    testAdhanBody:
      'Ini adzan: ia berbunyi, tetap di layar, dan membawa dua tombol. Ketuk «Bisukan» atau «Tandai sudah salat» untuk mencobanya.',
    quranTitle: 'Waktu Al-Quran Anda',
    quranBody: 'Lanjutkan bacaan Anda dengan beberapa ayat yang direnungkan.',
    webUnsupported:
      'Notifikasi sistem memerlukan aplikasi iOS atau Android yang terpasang.',
    adhanBody: 'Telah masuk waktu salat.',
    adhanBodyName: (name: string) => `Waktu ${name} telah tiba.`,
    mute: 'Bisukan',
    prayed: 'Tandai sudah salat',
    continueTitle: 'Lanjutkan dari yang terakhir',
    continueBody: (where: string) => `Anda sedang membaca ${where}.`,
    verseTitle: 'Ayat hari ini',
    hadithTitle: 'Hadis hari ini',
    preAdhan: (name: string, mins: string) => `${name} dalam ${mins}`,
    preAdhanBody: (name: string, at: string) => `${name} dimulai pukul ${at}.`,
    sleepTitle: 'Surah Al-Mulk sebelum tidur',
    sleepBody:
      'Tiga puluh ayat yang memberi syafaat bagi pembacanya. Membutuhkan waktu sekitar lima menit.',
    sleepAction: 'Baca sekarang',
  },
  hi: {
    channelReminder: 'नमाज़ की याददिहानियाँ',
    channelAdhan: 'अज़ान',
    channelDaily: 'दैनिक याददिहानी',
    testTitle: 'नमाज़ की याददिहानियाँ तैयार हैं',
    testBodyQuiet:
      'यह शांत दैनिक याददिहानी है — यह आपकी सूचना-ट्रे में आकर ठहरती है।',
    testAdhanTitle: 'अज़ान',
    testAdhanBody:
      'यह अज़ान है: यह बजती है, स्क्रीन पर रहती है, और इसके साथ दो बटन होते हैं। उन्हें आज़माने के लिए «ख़ामोश» या «नमाज़ अदा» पर टैप करें।',
    quranTitle: 'आपका क़ुरआन समय',
    quranBody: 'कुछ सोची-समझी आयतों के साथ अपना पठन जारी रखें।',
    webUnsupported:
      'सिस्टम सूचनाओं के लिए इंस्टॉल किया iOS या Android ऐप आवश्यक है।',
    adhanBody: 'नमाज़ का समय हो गया है।',
    adhanBodyName: (name: string) => `${name} का समय हो गया है।`,
    mute: 'ख़ामोश',
    prayed: 'नमाज़ अदा की गई',
    continueTitle: 'वहीं से आगे बढ़ें जहाँ छोड़ा था',
    continueBody: (where: string) => `आप ${where} पढ़ रहे थे।`,
    verseTitle: 'दिन की आयत',
    hadithTitle: 'दिन की हदीस',
    preAdhan: (name: string, mins: string) => `${name} ${mins} में`,
    preAdhanBody: (name: string, at: string) => `${name} ${at} बजे शुरू होती है।`,
    sleepTitle: 'सोने से पहले सूरह अल-मुल्क',
    sleepBody:
      'तीस आयतें जो पढ़ने वाले की सिफ़ारिश करती हैं। इसमें लगभग पाँच मिनट लगते हैं।',
    sleepAction: 'अभी पढ़ें',
  },
  ml: {
    channelReminder: 'നിസ്കാര അറിയിപ്പുകൾ',
    channelAdhan: 'ബാങ്ക്',
    channelDaily: 'ദിവസേനയുള്ള അറിയിപ്പ്',
    testTitle: 'നിസ്കാര അറിയിപ്പുകൾ തയ്യാറാണ്',
    testBodyQuiet:
      'ഇത് ശാന്തമായ ദിവസേനയുള്ള അറിയിപ്പാണ് — അത് അറിയിപ്പ് പട്ടികയിൽ എത്തി കാത്തിരിക്കും.',
    testAdhanTitle: 'ബാങ്ക്',
    testAdhanBody:
      'ഇതാണ് ബാങ്ക്: അത് മുഴങ്ങുന്നു, സ്ക്രീനിൽ നിൽക്കുന്നു, കൂടെ രണ്ട് ബട്ടണുകളുമുണ്ട്. അവ പരീക്ഷിക്കാൻ «നിശ്ശബ്ദമാക്കുക» അല്ലെങ്കിൽ «നിസ്കരിച്ചു» എന്നതിൽ ടാപ്പ് ചെയ്യുക.',
    quranTitle: 'നിങ്ങളുടെ ഖുർആൻ സമയം',
    quranBody: 'ചിന്തിച്ചു വായിക്കുന്ന ഏതാനും ആയത്തുകളോടെ വായന തുടരുക.',
    webUnsupported:
      'സിസ്റ്റം അറിയിപ്പുകൾക്ക് ഇൻസ്റ്റാൾ ചെയ്ത iOS അല്ലെങ്കിൽ Android ആപ്പ് ആവശ്യമാണ്.',
    adhanBody: 'നിസ്കാര സമയമായി.',
    adhanBodyName: (name: string) => `${name} നിസ്കാര സമയമായി.`,
    mute: 'നിശ്ശബ്ദമാക്കുക',
    prayed: 'നിസ്കരിച്ചു',
    continueTitle: 'നിർത്തിയിടത്തു നിന്ന് തുടരുക',
    continueBody: (where: string) => `നിങ്ങൾ ${where} വായിക്കുകയായിരുന്നു.`,
    verseTitle: 'ഇന്നത്തെ ആയത്ത്',
    hadithTitle: 'ഇന്നത്തെ ഹദീസ്',
    preAdhan: (name: string, mins: string) => `${name} ${mins} കഴിഞ്ഞ്`,
    preAdhanBody: (name: string, at: string) => `${name} ${at} ന് ആരംഭിക്കുന്നു.`,
    sleepTitle: 'ഉറങ്ങുന്നതിന് മുമ്പ് സൂറത്തുൽ മുൽക്ക്',
    sleepBody:
      'വായിക്കുന്നവർക്ക് ശുപാർശ ചെയ്യുന്ന മുപ്പത് ആയത്തുകൾ. ഏകദേശം അഞ്ച് മിനിറ്റ് മതി.',
    sleepAction: 'ഇപ്പോൾ വായിക്കുക',
  },
};

/* Keyed by language rather than by a boolean. A boolean can only say
   "Arabic or not", so the moment a third language arrives every notification
   a speaker of it receives is in English - and these are the words that reach
   someone before the app is even open. */
const copy = (code: string | boolean) => {
  if (code === 'fa') return COPY.fa;
  if (code === 'tr') return COPY.tr;
  if (code === 'ur') return COPY.ur;
  if (code === 'id') return COPY.id;
  if (code === 'hi') return COPY.hi;
  if (code === 'ml') return COPY.ml;
  return code === true || code === 'ar' ? COPY.ar : COPY.en;
};

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
function minutesWord(code: string | boolean, n: number) {
  if (code === 'fa') return `${n} دقیقه`;
  if (code === 'tr') return `${n} dakika`;
  if (code === 'ur') return `${n} منٹ`;
  /* Indonesian has no plural for this: "menit" is the same for one and many,
     so unlike English it needs no branch on n. */
  if (code === 'id') return `${n} menit`;
  /* Hindi "मिनट" is likewise the same for one and many. */
  if (code === 'hi') return `${n} मिनट`;
  /* Malayalam "മിനിറ്റ്" likewise takes no plural. */
  if (code === 'ml') return `${n} മിനിറ്റ്`;
  if (!(code === true || code === 'ar')) return n === 1 ? '1 minute' : `${n} minutes`;
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

export type NotificationStatus = {
  health: NotificationHealth;
  /** Whether the system would still show the prompt if we asked. */
  canAsk: boolean;
};

/**
 * The permission state, and separately whether asking is still any use.
 *
 * `health` alone is not enough to decide whether to ask, and reading it that
 * way is what stopped the onboarding from ever raising the prompt.
 *
 * On Android 13 the status of a device that has never been asked is `denied`,
 * not `undetermined`: POST_NOTIFICATIONS has not been granted, so
 * `areNotificationsEnabled()` is false, and expo maps that to denied before
 * considering whether anybody has refused anything. It looks exactly like a
 * person who said no, and any check written against the status alone quietly
 * skips the one device that most needs asking.
 *
 * `canAskAgain` is the part that distinguishes them, so that is what this
 * carries. A device that has genuinely refused keeps answering false.
 */
export async function getNotificationStatus(): Promise<NotificationStatus> {
  if (Platform.OS === 'web') return { health: 'unsupported', canAsk: false };
  const current = await Notifications.getPermissionsAsync();
  return {
    health: current.status as NotificationHealth,
    canAsk: current.status !== 'granted' && current.canAskAgain !== false,
  };
}

/** The channels the app posts to. */
export const CHANNEL_ADHAN = 'adhan';
/** The adhan, for the case where the recording itself will sound instead. */
export const CHANNEL_ADHAN_SILENT = 'adhan-silent';
export const CHANNEL_REMINDERS = 'prayer-reminders';
export const CHANNEL_DAILY = 'daily';

/**
 * Bumped whenever a channel's shape changes in a way Android will refuse to
 * apply to a channel that already exists - which is everything except its name
 * and description. A device that has already been given the older, silent
 * channels has to have them deleted and rebuilt, and this is how it is told
 * apart from a device where that has already been done.
 */
const CHANNEL_SCHEMA = 2;
const CHANNEL_SCHEMA_KEY = '@deen/notification-channels/v1';

/**
 * The channels and the action buttons.
 *
 * The adhan gets its own channel so the person can lower the volume of
 * everything else without touching it.
 *
 * Two things here are easy to get wrong and were.
 *
 * First, the sound. `sound: 'default'` looks like it asks for the system
 * notification tone; on Android it does the opposite. A channel's `sound` is
 * the name of a raw resource compiled into the app, there is no resource
 * called `default`, and a name that resolves to nothing leaves the channel
 * with no sound at all. Since Android 8 the channel governs what a
 * notification sounds like, so every notification in the app - the adhan and
 * the before-prayer heads-up alike - arrived in silence. The way to ask for
 * the system tone is to omit the key entirely, which is what these do.
 *
 * Second, the adhan channel is deliberately audible. When the recording
 * itself is going to sound there is a separate silent channel to post to,
 * because a notification cannot be made quiet on its own once its channel has
 * a sound.
 */
export async function ensureNotificationChannels(rtl: string | boolean = false) {
  if (Platform.OS !== 'android') return;
  const c = copy(rtl);

  /* Rebuilt once, not on every pass: deleting a channel also discards
     whatever the person chose for it, so it is only done when the shape
     itself is out of date. */
  let stored = 0;
  try { stored = Number(await AsyncStorage.getItem(CHANNEL_SCHEMA_KEY)) || 0; } catch { stored = 0; }
  if (stored < CHANNEL_SCHEMA) {
    for (const id of [CHANNEL_ADHAN, CHANNEL_ADHAN_SILENT, CHANNEL_REMINDERS, CHANNEL_DAILY]) {
      await Notifications.deleteNotificationChannelAsync(id).catch(() => undefined);
    }
    try { await AsyncStorage.setItem(CHANNEL_SCHEMA_KEY, String(CHANNEL_SCHEMA)); } catch { /* next time */ }
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ADHAN, {
    name: c.channelAdhan,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 180, 250],
    lightColor: '#452D9F',
    // No `sound` key: that is what selects the system notification tone.
  });

  /* For the adhan that will be heard from the alarm instead. `null` is
     explicit silence, which is a different thing from a name that failed to
     resolve. */
  await Notifications.setNotificationChannelAsync(CHANNEL_ADHAN_SILENT, {
    name: c.channelAdhan,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 180, 250],
    lightColor: '#452D9F',
    sound: null,
  });

  await Notifications.setNotificationChannelAsync(CHANNEL_REMINDERS, {
    name: c.channelReminder,
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 180, 250],
    lightColor: '#452D9F',
  });

  await Notifications.setNotificationChannelAsync(CHANNEL_DAILY, {
    name: c.channelDaily,
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  /* Two buttons on the adhan itself. Somebody mid-prayer does not want to
     unlock their phone to silence it, and somebody who has prayed should be
     able to record that from the lock screen. */
  await Notifications.setNotificationCategoryAsync('adhan-actions', [
    { identifier: 'MUTE', buttonTitle: c.mute, options: { isDestructive: false, opensAppToForeground: false } },
    { identifier: 'PRAYED', buttonTitle: c.prayed, options: { isDestructive: false, opensAppToForeground: false } },
  ]);
}

/**
 * Ask for the notification permission.
 *
 * The permission is named rather than left to the library's default. On
 * Android 13 and later `POST_NOTIFICATIONS` is a runtime permission, and
 * while current versions of the library request it on their own, naming it
 * makes the ask explicit and means the request cannot silently become a no-op
 * on a device where the default set differs.
 *
 * The channels are built either way: granting permission later should not mean
 * re-answering this screen to get a channel that exists.
 */
export async function requestNotificationPermission(rtl: string | boolean = false): Promise<NotificationHealth> {
  if (Platform.OS === 'web') return 'unsupported';
  const requested = Platform.OS === 'android'
    ? await Notifications.requestPermissionsAsync({
        android: { permissions: ['android.permission.POST_NOTIFICATIONS'] },
      } as any).catch(() => Notifications.requestPermissionsAsync())
    : await Notifications.requestPermissionsAsync();
  await ensureNotificationChannels(rtl);
  return requested.status as NotificationHealth;
}

/** Opens the app's own page in the system settings, where permission can be granted after a refusal. */
export async function openNotificationSettings() {
  if (Platform.OS === 'web') return;
  await Linking.openSettings().catch(() => undefined);
}

/**
 * Two notifications, so both kinds can be seen at once.
 *
 * They are the two shapes the app actually sends: the quiet daily one that
 * simply arrives, and the adhan, which sounds, stays on screen and carries the
 * Silence and Mark-as-prayed buttons. Somebody pressing "Test notification"
 * wants to know what the app will do at prayer time, and one grey line saying
 * "ready" never told them that.
 *
 * Both are scheduled a second or two out rather than fired in place. Firing in
 * place means no trigger, and on Android a notification with no channel is not
 * shown at all — which is the whole reason a test would appear to do nothing.
 */
export async function sendTestNotification(rtl: string | boolean = false) {
  if (Platform.OS === 'web') throw new Error(copy(rtl).webUnsupported);
  await ensureNotificationChannels(rtl);
  const c = copy(rtl);

  await scheduleAndLog({
    content: {
      title: c.testTitle,
      body: c.testBodyQuiet,
      sound: 'default',
      data: { route: 'Prayer', kind: 'daily' },
    },
    trigger: intervalTrigger(1, CHANNEL_DAILY),
  });

  await scheduleAndLog({
    content: {
      title: c.testAdhanTitle,
      body: c.testAdhanBody,
      sound: 'default',
      categoryIdentifier: 'adhan-actions',
      sticky: true,
      data: { route: 'Prayer', kind: 'adhan', prayer: 'Dhuhr' },
    },
    trigger: intervalTrigger(2, CHANNEL_ADHAN),
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

const intervalTrigger = (seconds: number, channelId: string) =>
  ({ type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, channelId }) as any;

const dailyTrigger = (hour: number, minute: number, channelId: string) =>
  ({ type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId }) as any;

/**
 * Where somebody left off, in the two forms it is needed in: as words for the
 * body of the reminder, and as a place the app can open.
 */
export type PendingReading = { surahId: number; verseKey: string; label: string };

export type ScheduleResult = {
  scheduled: number;
  unsupported: boolean;
  /** How many of the scheduled ones are the adhan itself. */
  adhans: number;
  /** Whether the real recording will sound, and why not when it will not. */
  adhanAudio: AdhanAudio;
};

const NO_AUDIO: AdhanAudio = { willPlay: false, reason: 'web-unsupported', scheduled: 0, skipped: 0 };

/**
 * Schedule everything, from scratch.
 *
 * Called whenever any of it could have changed: a new day's prayer times, a
 * move to a new city, a settings toggle, or the app being opened. Everything
 * previously scheduled is cancelled first, because the alternative — trying to
 * work out which of the old timers are still right — is how you end up with a
 * phone that prays at yesterday's times.
 */
/**
 * Everything scheduled in the current pass, written to the history at the end.
 * Kept in one place so each call site stays a single, readable call.
 */
let pending: PendingEntry[] = [];

/**
 * Schedules a notification and notes it for the history in the same step.
 *
 * The fire time is read off the trigger rather than passed separately, so a
 * call site cannot record one time and schedule another.
 */
async function scheduleAndLog(request: Notifications.NotificationRequestInput) {
  const id = await Notifications.scheduleNotificationAsync(request);
  const trigger = request.trigger as { date?: number | Date } | undefined;
  const raw = trigger?.date;
  const fireAt = raw instanceof Date ? raw.getTime() : typeof raw === 'number' ? raw : Date.now();
  if (Number.isFinite(fireAt)) {
    const data = (request.content.data || {}) as Record<string, unknown>;
    pending.push({
      kind: (data.kind as string) || '',
      title: request.content.title || '',
      body: request.content.body || '',
      prayer: data.prayer as string | undefined,
      fireAt,
    });
  }
  return id;
}

/**
 * Scheduling passes are put through a queue rather than started where they
 * are asked for. Three separate places rebuild the schedule and none of them
 * knows about the others, so without this they overlap and everything is laid
 * down twice.
 */
const scheduleQueue = createSerialQueue<ScheduleResult>();

export function schedulePrayerNotifications(
  snapshot: PrayerSnapshot,
  settings: WorshipSettings,
  rtl: string | boolean = false,
  reading?: PendingReading | null,
): Promise<ScheduleResult> {
  return scheduleQueue(() => rebuildSchedule(snapshot, settings, rtl, reading));
}

async function rebuildSchedule(
  snapshot: PrayerSnapshot,
  settings: WorshipSettings,
  rtl: string | boolean = false,
  reading?: PendingReading | null,
): Promise<ScheduleResult> {
  if (Platform.OS === 'web') return { scheduled: 0, unsupported: true, adhans: 0, adhanAudio: NO_AUDIO };
  pending = [];

  await ensureNotificationChannels(rtl);
  await Notifications.cancelAllScheduledNotificationsAsync();

  const c = copy(rtl);
  const now = new Date();
  let scheduled = 0;
  let adhans = 0;
  /* How many prayers the adhan is switched on for, counted without regard to
     the clock — see diagnoseAdhanAudio. */
  let adhansEnabled = 0;
  /* Decided once, not per prayer: it is a property of the device, so asking
     five times would give the same answer five times. */
  const alarm = await alarmIsTrustworthy();
  let recordingMissing = false;
  /* Collected as the loop runs, then handed to the alarm in one call at the
     end. An alarm per prayer is the only way the recording can sound, because
     a notification cannot play a file the app is merely carrying. */
  const alarmEntries: { at: number; prayerName: string; trackId: string; title: string }[] = [];

  const prayers = snapshot.prayers.filter((prayer) => prayer.name !== 'Sunrise');

  for (const prayer of prayers) {
    const at = atTime(prayer.raw);
    if (!at) continue;
    const name = prayerName(rtl, prayer.name);

    // ---- 1. the adhan itself ------------------------------------------
    if (settings.adhanEnabled?.[prayer.name]) {
      /* Counted here rather than where the notification is laid down, so the
         count does not fall to zero once today's prayers have gone by. Only
         the times have passed; the setting has not changed. */
      adhansEnabled++;
      const track = adhanTrackFor(prayer.name, settings);
      /* On iOS the sound has to travel with the notification, because there
         is no alarm to play it from. A custom notification sound there has to
         be inside the app bundle and under thirty seconds, so only the
         recordings shipped with the app can sound — and a bundled clip is
         always ready, with nothing to download first. */
      const iosSound = Platform.OS === 'ios' ? adhanSoundName(track) : null;
      const recordingReady = Platform.OS === 'ios' ? Boolean(iosSound) : isAdhanCached(track);
      /* The recording sounds from the alarm, and the notification is quiet so
         the two do not talk over each other. When that cannot be relied on
         the notification keeps the system tone, so prayer time is still
         heard rather than passing in silence. */
      const willPlay = Platform.OS === 'ios' ? Boolean(iosSound) : alarm.usable && recordingReady;
      if (!recordingReady) recordingMissing = true;
      const channel = willPlay ? CHANNEL_ADHAN_SILENT : CHANNEL_ADHAN;
      if (at > now) {
        await scheduleAndLog({
          content: {
            title: name,
            body: c.adhanBodyName(name),
            categoryIdentifier: 'adhan-actions',
            data: { route: 'Prayer', kind: 'adhan', prayer: prayer.name },
            /* Named only on iOS, where the sound rides with the
               notification. On Android the channel governs the sound, and
               naming one here would fight with it. */
            ...(iosSound ? { sound: iosSound } : {}),
            // Stay on screen rather than vanishing: an adhan you have to hunt
            // for in the shade is an adhan you missed.
            sticky: true,
          },
          trigger: dateTrigger(at, channel),
        });
        scheduled++;
        adhans++;
        /* The resolved track rather than the raw saved value. The alarm used
           to look the recording up again from the setting, which a legacy
           value stored as a label would resolve differently - so the alarm
           could be handed one recording while the notification was checking
           whether a different one was on the device. */
        alarmEntries.push({
          at: at.getTime(),
          prayerName: prayer.name,
          trackId: track.id,
          title: name,
        });
      }

      // ---- 2. back to your reading, half an hour later -----------------
      if (settings.continueReadingReminder !== false && reading?.label) {
        const later = new Date(at.getTime() + 30 * 60 * 1000);
        if (later > now) {
          await scheduleAndLog({
            content: {
              title: c.continueTitle,
              body: c.continueBody(reading.label),
              sound: 'default',
              /* Where to go is written into the notification as well as read
                 from storage at tap time. Storage is the better answer, since
                 a person may have read on since this was scheduled, but if it
                 is ever empty the notification still knows which ayah it was
                 talking about instead of opening the Quran to nowhere. */
              data: {
                route: 'Quran', kind: 'continue',
                surah: reading.surahId, verseKey: reading.verseKey,
              },
            },
            trigger: dateTrigger(later, CHANNEL_DAILY),
          });
          scheduled++;
        }
      }
    }

    // ---- 3. the quiet heads-up before ---------------------------------
    if (settings.remindersEnabled && settings.prayerReminders?.[prayer.name]) {
      const early = new Date(at.getTime() - settings.reminderOffset * 60 * 1000);
      if (early > now) {
        await scheduleAndLog({
          content: {
            title: c.preAdhan(name, minutesWord(rtl, settings.reminderOffset)),
            body: c.preAdhanBody(name, clockTime(rtl, prayer.time)),
            sound: 'default',
            data: { route: 'Prayer', kind: 'pre-adhan', prayer: prayer.name },
          },
          trigger: dateTrigger(early, CHANNEL_REMINDERS),
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
    return scheduleAndLog({
      content: { title, body: '', sound: 'default', data: { route, kind } },
      trigger: dailyTrigger(at.getHours(), at.getMinutes(), CHANNEL_DAILY),
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
      await scheduleAndLog({
        content: {
          title: c.sleepTitle,
          body: c.sleepBody,
          sound: 'default',
          // Opens straight into the surah, so the reminder and the reading
          // are one motion rather than two.
          data: { route: 'Quran', kind: 'sleep', surah: SLEEP_SURAH.chapterId },
        },
        trigger: dailyTrigger(at.getHours(), at.getMinutes(), CHANNEL_DAILY),
      });
      scheduled++;
    }
  }

  // The older Quran reminder, kept for anyone who set it before the above existed.
  if (settings.quranReminderEnabled) {
    const at = atTime(settings.quranReminderTime);
    if (at) {
      await scheduleAndLog({
        content: { title: c.quranTitle, body: c.quranBody, data: { route: 'Quran' } },
        trigger: dailyTrigger(at.getHours(), at.getMinutes(), CHANNEL_DAILY),
      });
      scheduled++;
    }
  }

  /* Rescheduled every time, because the times, the city, and the person's
     choice of recording all move. Any alarm already set is replaced.

     The result is read rather than thrown away. An alarm that was skipped
     used to be invisible, which left no way to tell the difference between
     "the adhan is set" and "the adhan can never sound on this phone". */
  const alarms = await scheduleAdhanAlarms(alarmEntries);

  /* The same answer the settings screen gives. On iOS the alarm figures are
     meaningless - nothing was ever scheduled and nothing needs downloading -
     so the clip is the only thing that was ever going to decide it. */
  const iosAudio = adhanAudioForIos(settings);
  /* "In working order", rather than "something happened to be laid down just
     now": after the last prayer of the day nothing is scheduled, and that must
     not read as the adhan being broken. */
  const reason = iosAudio ? iosAudio.reason
    : diagnoseAdhanAudio({ adhansEnabled, adhansScheduled: adhans, alarm, alarms, recordingMissing });
  const adhanAudio: AdhanAudio = iosAudio ?? {
    willPlay: reason === null,
    reason,
    scheduled: alarms.scheduled,
    skipped: alarms.skipped,
  };

  await recordScheduled(pending);
  pending = [];

  return { scheduled, unsupported: false, adhans, adhanAudio };
}

/**
 * What the adhan will do right now, without changing anything.
 *
 * The settings screen needs to be able to answer "will the adhan actually
 * sound?" on being opened, not only after a scheduling pass has happened to
 * run. This is that answer, reached the same way the scheduler reaches it.
 */
/**
 * How the adhan stands on iOS, or null anywhere else.
 *
 * Kept in one place because it is asked from two: when the settings screen
 * opens, and again after a scheduling pass. Those two used to disagree — the
 * screen knew about the bundled clips and the schedule did not, so on a phone
 * it read one way on arrival and flipped to "the installed Android app is not
 * running here" the moment somebody pressed Save.
 *
 * There is no alarm on iOS, so the whole question is a smaller one: it is only
 * whether the chosen recording is one of the ones shipped inside the app. A
 * bundled clip needs nothing downloaded and cannot be missing.
 */
function adhanAudioForIos(
  settings: { adhanEnabled?: Record<string, boolean>; adhanReciter?: string; adhanFajrReciter?: string },
): AdhanAudio | null {
  if (Platform.OS !== 'ios') return null;
  const enabled = Object.keys(settings.adhanEnabled || {}).filter((name) => settings.adhanEnabled?.[name]);
  if (!enabled.length) return { willPlay: false, reason: 'no-adhan-enabled', scheduled: 0, skipped: 0 };

  const withoutClip = enabled.filter((name) => !adhanSoundName(adhanTrackFor(name, settings)));
  if (withoutClip.length === enabled.length) {
    return { willPlay: false, reason: 'ios-no-clip', scheduled: 0, skipped: enabled.length };
  }
  return {
    willPlay: true,
    reason: null,
    scheduled: enabled.length - withoutClip.length,
    skipped: withoutClip.length,
  };
}

export async function inspectAdhanAudio(
  settings: { adhanEnabled?: Record<string, boolean>; adhanReciter?: string; adhanFajrReciter?: string },
): Promise<AdhanAudio> {
  /* The same early exit the scheduling pass has. Without it the checks below
     run as though this were a phone, and the web is told the adhan is played
     by an installed Android app it cannot have - on a screen that has just
     said scheduling needs the installed app. */
  if (Platform.OS === 'web') return NO_AUDIO;
  const ios = adhanAudioForIos(settings);
  if (ios) return ios;

  const enabled = Object.keys(settings.adhanEnabled || {}).filter((name) => settings.adhanEnabled?.[name]);
  if (!enabled.length) return { willPlay: false, reason: 'no-adhan-enabled', scheduled: 0, skipped: 0 };

  const alarm = await alarmIsTrustworthy();
  const missing = enabled.filter((name) => !isAdhanCached(adhanTrackFor(name, settings)));
  const ready = enabled.length - missing.length;

  if (!alarm.usable) return { willPlay: false, reason: alarm.reason, scheduled: 0, skipped: enabled.length };
  if (ready === 0) return { willPlay: false, reason: 'not-downloaded', scheduled: 0, skipped: enabled.length };

  return { willPlay: true, reason: null, scheduled: ready, skipped: missing.length };
}

/**
 * Opens the page where Android lets somebody allow exact alarms again.
 *
 * Android 12 introduced this screen and it is the only way back once the
 * permission has been withdrawn — the system prompt is not shown twice, so
 * asking from inside the app would be a button that does nothing. Devices
 * without that screen fall through to the app's own settings page.
 */
export async function openExactAlarmSettings() {
  if (Platform.OS !== 'android') return;
  const exactScreen = 'android.settings.REQUEST_SCHEDULE_EXACT_ALARM';
  try {
    await Linking.sendIntent(exactScreen);
  } catch {
    await openNotificationSettings();
  }
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  /* The alarms are not notifications, so cancelling one does not cancel the
     other. Both have to go, or the adhan keeps sounding after being switched
     off. */
  await cancelAdhanAlarms();
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
