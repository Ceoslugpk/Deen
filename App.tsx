function ExploreStack(){const subtle=useSubtleTransitions();return <Stack.Navigator screenOptions={{...subtle,headerShown:false}}><Stack.Screen name="ExploreHome" component={ExploreHome}/><Stack.Screen name="Adhkar" component={AdhkarScreen}/><Stack.Screen name="99 Names" component={NamesScreen}/><Stack.Screen name="Prophet Names" component={ProphetNamesScreen}/><Stack.Screen name="Muslim Names" component={MuslimNamesScreen}/><Stack.Screen name="Duas" component={DuasScreen}/><Stack.Screen name="Dua Category" component={DuaCategoryScreen}/><Stack.Screen name="Hadith" component={HadithScreen}/><Stack.Screen name="Hadith Collection" component={HadithCollectionScreen}/><Stack.Screen name="Hadith Detail" component={HadithDetailScreen}/><Stack.Screen name="Hadith Saved" component={HadithSavedScreen}/><Stack.Screen name="Worship Guides" component={GuideDirectory}/><Stack.Screen name="Guide Detail" component={needsPayload(GuideDetailInner, 'Guide')}/><Stack.Screen name="Ramadan" component={RamadanScreen}/><Stack.Screen name="Journey" component={needsPayload(JourneyScreenInner, 'Journey')}/><Stack.Screen name="Purity" component={PurityScreen}/><Stack.Screen name="Ghusl" component={GhuslScreen}/></Stack.Navigator>}

/**
 * The prayer tab: keeping the day. The times, the direction, the call, the
 * reminders, the location they are worked out from, and the calendar and
 * fasts that hang on them.
 */
function PrayerStack(){const subtle=useSubtleTransitions();return <Stack.Navigator screenOptions={{...subtle,headerShown:false}}><Stack.Screen name="Prayer" component={PrayerScreen}/></Stack.Navigator>}
/** The tools tab: what you calculate, look up, travel for, or record. */
function ToolsStack(){const subtle=useSubtleTransitions();return <Stack.Navigator screenOptions={{...subtle,headerShown:false}}><Stack.Screen name="ToolsHome" component={ToolsHomeScreen}/><Stack.Screen name="Zakat" component={ZakatScreen}/><Stack.Screen name="Holy site channels" component={HolyChannelsScreen}/><Stack.Screen name="Women" component={WomenHubScreen}/><Stack.Screen name="Istihada" component={IstihadaScreen}/><Stack.Screen name="Ramadan Planner" component={RamadanPlannerScreen}/><Stack.Screen name="These Days" component={TheseDaysScreen}/><Stack.Screen name="Cycle" component={CycleScreen}/><Stack.Screen name="Qada" component={QadaScreen}/><Stack.Screen name="Qada Prayer" component={QadaPrayerScreen}/><Stack.Screen name="Sadaqah" component={SadaqahScreen}/>
      <Stack.Screen name="Sunnah Prayers" component={SunnahScreen}/><Stack.Screen name="Journal" component={JournalScreen}/><Stack.Screen name="Women Guides" component={WomenGuidesScreen}/><Stack.Screen name="Privacy Lock" component={PrivacyLockScreen}/><Stack.Screen name="Fasting" component={FastingScreen}/><Stack.Screen name="Weekly Summary" component={WeeklySummaryScreen}/><Stack.Screen name="Qibla" component={QiblaScreen}/><Stack.Screen name="Location Setup" component={LocationSetupScreen}/><Stack.Screen name="Notifications" component={NotificationScreen}/><Stack.Screen name="Salah Tracker" component={SalahTrackerScreen}/><Stack.Screen name="Adhan" component={AdhanScreen}/><Stack.Screen name="Hijri Calendar" component={HijriCalendarScreen}/><Stack.Screen name="Tasbih" component={TasbihScreen}/><Stack.Screen name="Umrah Packing" component={UmrahPackingScreen}/></Stack.Navigator>}

import { Accelerometer, Magnetometer } from 'expo-sensors';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, Alert, Animated, AppState, BackHandler, Easing, Image, ImageBackground, Linking, Platform,
  Pressable as BarePressable,
  I18nManager, RefreshControl, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput,
  PanResponder, useColorScheme, useWindowDimensions, View, Modal, Dimensions, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';
import { haptic, isHapticsSupported, setHapticsEnabled, withHaptic, type HapticKind } from './src/services/haptics';
import { createNavigationContainerRef, NavigationContainer, StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
const KFGQPCUthmanicHafs = require('./assets/fonts/KFGQPCUthmanicHafs.ttf');
const IBMPlexSansArabic_400Regular = require('./assets/fonts/IBMPlexSansArabic-Regular.ttf');
const IBMPlexSansArabic_600SemiBold = require('./assets/fonts/IBMPlexSansArabic-SemiBold.ttf');

/**
 * The interface faces live in the repository rather than in @expo-google-fonts.
 *
 * The web export copies every file under `assets/` into the bundle, but it did
 * not copy the ones Metro resolved out of node_modules — the build asked for
 * seven .ttf files under /assets/node_modules/@expo-google-fonts/ that were
 * never written, and expo-font never resolved, so the app sat on its loading
 * screen. Requiring them from here keeps every face the app needs inside the
 * one directory the export is known to copy.
 */
const DMSans_400Regular = require('./assets/fonts/DMSans-Regular.ttf');
const DMSans_600SemiBold = require('./assets/fonts/DMSans-SemiBold.ttf');
const DMSans_700Bold = require('./assets/fonts/DMSans-Bold.ttf');
const Newsreader_600SemiBold = require('./assets/fonts/Newsreader-SemiBold.ttf');
const NotoNaskhArabic_400Regular = require('./assets/fonts/NotoNaskhArabic-Regular.ttf');
const NotoNaskhArabic_600SemiBold = require('./assets/fonts/NotoNaskhArabic-SemiBold.ttf');
const Amiri_400Regular = require('./assets/fonts/Amiri-Regular.ttf');
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomIcon, { iconTheme } from './src/components/CustomIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, Ellipse, Path, Polygon, RadialGradient, Stop } from 'react-native-svg';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  AudioEdition, Chapter, DailyAyah, DailyHadith, DivineName, getAyahEditions, getAyahOfDay, getChapters, getDailyHadith, getDuas, getQuranEditions,
  getAyahForDate, getCalendarSpan, getGregorianCalendar, getNameOfDay, getNames, getPrayerCalendar, getPrayerSnapshot, getQibla, qiblaDistance, getRamadanCalendar,
  getHizbVerses, getJuzVerses, getPageVerses, getVerses, searchQuran, CalendarDay, Prayer, PrayerSnapshot, QuranEdition, QuranSearchResult, SurahReciter, Verse,
} from './src/services/api';
import {
  DEFAULT_DAY_TOOLS, DEFAULT_WORSHIP_SETTINGS, loadDailyContent, loadPrayerCache, loadPrayerCompletion, loadPrayerHistory, loadQuickTasbih, loadStoredLocation, loadWorshipSettings,
  saveDailyContent, savePrayerCache, savePrayerCompletion, saveQuickTasbih, saveStoredLocation, saveWorshipSettings,
  WorshipSettings, loadOnboarding, saveOnboarding, loadLanguage, saveLanguage,
  loadAppliedDirection, saveAppliedDirection
} from './src/services/localState';
import {
  actionFromResponse, cancelAllNotifications, getNotificationStatus, NotificationStatus, getScheduledCount,
  NotificationHealth, prayerFromNotification, requestNotificationPermission, schedulePrayerNotifications, sendTestNotification,
  inspectAdhanAudio, openExactAlarmSettings, type AdhanAudio,
  SLEEP_SURAH, openNotificationSettings } from './src/services/notifications';
import {
  clearNotificationLog, loadNotificationLog, markDelivered, markOpened, newestFirst,
  type NotificationRecord,
} from './src/services/notificationLog';
import * as Notifications from 'expo-notifications';
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, type NotificationResponse } from 'expo-notifications';
import { getBatteryOptimizationState, openBatterySettings, requestBatteryExemption, type BatteryState } from './src/services/batteryOptimization';
import { copyFeedback, issueLabel, loadReports, markReportSent } from './src/services/reportService';
import { computeMushafLayout } from './src/services/mushafLayout';
import { markerBetween, MARKER_KINDS, MARKER_LABELS, MARKER_NOTE, type MushafMarker, type MarkerKind, type PageConnection } from './src/services/mushafMarkers';
import { localizeGuide, WORSHIP_GUIDES, WorshipGuide } from './src/content/worshipGuides';
import { GUIDE_HADITH, GUIDE_VERSES } from './src/content/guideSources';
import { QURAN_TOPICS, QURAN_VOCABULARY, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from './src/content/quranStudy';
import {addSearchHistory, clearSearchHistory, clearSurahCache, deleteNote, HifzStatus, loadBookmarks, loadHifz, loadNotes, loadPlan, loadQuranPreferences, loadReadingPosition, loadRecentSurahs, loadSearchHistory, loadSurahCache, readerCacheKey, loadSurahCacheIndex, DEFAULTS, loadVocabularyProgress, QuranBookmark, QuranNote, QuranPreferences, removeSearchHistory, saveHifz, saveNote, savePlan, saveQuranPreferences, saveReadingPosition, saveSurahCache, saveVocabularyProgress, toggleBookmark, ReadingPosition, VocabularyProgress} from './src/services/quranState';
import {
  clearMemorization, confidenceOf, demoteVerse, getMemorization, hiddenIndexes, isWord,
  loadMemorization, MODE_LABELS, overallConfidence, pickNext, recentAttempts, recordAttempt,
  saveMemSettings, splitWords, undoAttempt, unflagVerse, useMemorization, weakBank
} from './src/services/memorizationService';
import type { Attempt, AttemptResult, MemorizationMode, VerseRecord } from './src/services/memorizationService';
import {
  BackupSummary, BACKUP_RELOCK_OPTIONS, clearLastRestore, createBackup, getLastRestore, loadBackupSettings, lockBackup, readBackupSummary,
  removePassword, restoreBackup, saveRelock, setPassword as setBackupPassword, startBackupWatch, unlock,
  useBackupSettings, useBackupUnlocked, useRestoreNonce
} from './src/services/backupService';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Clipboard from 'expo-clipboard';
import { getCacheUsage, getCachedJson, setCachedJson } from './src/services/contentCache';
import { AudioSession, AudioSettings, AudioTrackKind, buildQueueForChapter, buildSurahQueue, loadSurahReciters, clearQueue, clearRecentPlays, deletePlaylist, formatClock, getAudioSettings, loadAudioEditions, loadAudioSession, loadAudioSettings, loadPlaylists, loadRecentPlays, nextTrack, playQueue, Playlist, previousTrack, RecentPlay, removeFromQueue, restoreSavedSession, saveAudioSettings, savePlaylist, seekTo, selectQueueItem, setAutoNextSurah, setRepeatCount, setRepeatMode, setRepeatRange, setResumeOnStart, setVolume, stepPlaybackRate, MAX_RATE, MIN_RATE, RATE_STEPS, REPEAT_COUNT_CHOICES, REPEAT_FOREVER, setPlaybackRate, reciterLabel, stopPlayback, syncAudioTranslationToLanguage, togglePlayback, useAudio } from './src/services/audioService';
import {DEFAULT_HADITH_LANGUAGE, deviceHadithCount, downloadCollection, fetchHadithOne, getHadith, getHadithLanguage, hadithDownloadProgress, searchDeviceHadith, useHadithLanguage, setHadithLanguage, hadithReference, hadithSourceLabel, HADITH_COLLECTIONS, Hadith, HadithOutline, isHadithSaved, loadHadithBook, loadHadithOutline, loadHadithState, markHadithRead, removeDownloadedCollection, removeHadithBookmark, subscribeHadithDownloads, toggleHadithSaved, useDownloadedCollections, useHadithState } from './src/services/hadithService';
import { adhanTrack, ADHAN_TRACKS, AdhanTrack, DEFAULT_ADHAN_ID, DEFAULT_FAJR_ID, FAJR_TRACKS } from './src/services/adhanCatalog';
import { adhanPlaybackSource, downloadAllAdhanTracks, getAdhanCacheState, isAdhanCached, refreshAdhanCache, subscribeAdhanCache, clearAdhanCache } from './src/services/adhanCache';
import {
  buildReportMailto, deleteReport, openReportEmail, saveReport, subscribeReports,
  type CorrectionReport, type CorrectionIssue as ReportIssue
} from './src/services/reportService';
import {
  loadOfflineSetup, offlineProgress, pauseOfflineSetup, replanForLanguage, resumeSavedOfflineSetup,
  startOfflineSetup, subscribeOfflineSetup, type OfflineSetup
} from './src/services/offlinePlan';
import { rememberCity, searchCities, searchLocalCities, type CityResult } from './src/services/cities';
import { loadDuaCategories, loadDuas } from './src/services/duaService';
import {
  completeKhatamCycle, isPageRead, khatamSummary, loadKhatamState, markPageRead,
  markPagesRead, removeKhatamCycle, resetKhatamCycle, TOTAL_PAGES, unmarkPage,
  useKhatam,
} from './src/services/khatamService';
import {
  clearQada, clearQadaEntry, loadQadaState, logMissedPrayer, QADA_PRAYERS,
  qadaSummary, removeQadaEntry, reopenQadaEntry, resetQada, setQadaDailyGoal,
  useQada, type QadaPrayer,
} from './src/services/qadaService';
import { loadNameLanguage, loadNameOfDay, loadNames, saveNameLanguage } from './src/services/namesService';
import { ARABIC_UI, ARABIC_UI_SEMIBOLD, ensureLatinFace, ensureQuranFont, quranFontFamily as quranFont, QURAN_FONTS, useQuranFont } from './src/services/fonts';
import { shareVerseCard } from './src/services/verseCard';
import { shareHadithCard } from './src/services/hadithCard';
import { shareCard, type CardTheme, type ShareCardData } from './src/services/shareCard';
import { VerseShareCard } from './src/components/VerseShareCard';
import { HadithShareCard } from './src/components/HadithShareCard';
import { ShareCardView } from './src/components/ShareCardView';
import Flag from './src/components/Flag';
import EditionPicker from './src/components/EditionPicker';
import {
  clearIslamicDataCache, editionDisplayName, editionSubtitle, getDivision,
  getEditions, getHadithBook, getHadithCollection, getHadithCollections, getSurah,
  getChapters as getWorkerChapters,
  getHadith as getWorkerHadith, getDailyHadith as getWorkerDailyHadith,
  CachedSurah, IslamicChapter, IslamicCategory,
  IslamicDataError, IslamicEdition, languageName as workerLanguageName,
  HadithBook, HadithRecord, servableEditions,
} from './src/services/islamicDataApi';
import { languageFlag, languageLabel, languagesOf, type LanguageEntry } from './src/services/languageFlags';

/**
 * The language a Quran edition is written in, as a short code the flag can
 * draw. Preference stores two things and neither alone is reliable: the
 * edition identifier carries the code (`en.sahih` -> `en`) but is empty before
 * a translation has ever been picked, while `translationLanguage` is a display
 * name like "English". Try the identifier first, then the name.
 */
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  english: 'en', arabic: 'ar', urdu: 'ur', french: 'fr', turkish: 'tr',
  indonesian: 'id', russian: 'ru', chinese: 'zh', persian: 'fa',
  uzbek: 'uz', kazakh: 'kk', malay: 'my', german: 'de', spanish: 'es',
  dutch: 'nl', italian: 'it', portuguese: 'pt', bengali: 'bn', hindi: 'hi'
};
const languageOf = (identifier?: string, language?: string) => {
  const fromId = (identifier || '').split('.')[0];
  if (fromId && /^[a-z]{2,3}$/.test(fromId)) return fromId;
  return LANGUAGE_NAME_TO_CODE[(language || '').toLowerCase()] || (language || '');
};

/**
 * Share a card as a picture on native.
 *
 * react-native-view-shot photographs a view that is already on screen, so
 * there is nothing to capture at the moment the button is pressed — building
 * the card and capturing it in the same tick would photograph whatever was
 * there before, or nothing at all the first time. That is why these shares
 * were silently falling back to text.
 *
 * So the card data is staged in state, rendered off in the corner where nobody
 * sees it, and captured on the frame after that render commits. On the web
 * there is a canvas to draw into and none of this is needed.
 *
 * The card is mounted only while a share is in flight. A list of duas or
 * names can be hundreds of rows long, and a full-bleed card behind every
 * one of them would be ruinous.
 */
function useCardShare() {
  const cardRef = useRef<any>(null);
  const [pending, setPending] = useState<ShareCardData | null>(null);
  /* The card leaves the app, so it wears the theme it was made in rather
     than one fixed set of colours. */
  const { theme: cardTheme } = useTheme();

  useEffect(() => {
    if (!pending) return;
    let alive = true;
    const run = async () => {
      /* Two frames: one for React to commit the card to the tree, one for
         the layout to be measured. Capturing sooner yields a blank PNG. */
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (!alive) return;
      await shareCard({ ...pending, theme: cardTheme }, cardRef);
      if (alive) setPending(null);
    };
    void run();
    return () => { alive = false; };
  }, [pending, cardTheme]);

  const share = useCallback(
    (data: ShareCardData) => {
      /* Stamped here rather than read back out of the palette at draw time,
         so the card cannot change theme between being asked for and being
         drawn. */
      const themed: ShareCardData = { ...data, theme: cardTheme };
      if (Platform.OS === 'web') { void shareCard(themed); return; }
      setPending(themed);
    },
    [cardTheme],
  );

  const offscreenCard = Platform.OS !== 'web' && pending
    ? (
      <View style={s.offscreenCard} pointerEvents="none" aria-hidden>
        <ShareCardView viewRef={cardRef} {...pending} theme={cardTheme} />
      </View>
    )
    : null;

  return { share, offscreenCard };
}
import { CARD, CARD_GAP, RADIUS, SPACE } from './src/design/tokens';
import { BRAND, C_DARK, C_LIGHT, C_PALESTINE, C_PALESTINE_DARK, DEPTH, FLAG, GLASS, GLASS_INTENSITY, brandHex, mix, snapToBrand } from './src/design/brand';
import { useCalmMotion } from './src/design/useCalmMotion';
import { EidConfetti } from './src/components/EidConfetti';
import { AmbientField } from './src/components/AmbientField';
import { ambienceFor, type Ambience } from './src/services/ambience';
import { eidToday } from './src/services/eid';
import { Tactile } from './src/components/Tactile';
import { useSubtleTransitions } from './src/design/transitions';
import { MOTION, easeOut, useEntrance, usePressDepth } from './src/design/motion';
import { completeJourney, clearJourney, journeyMeta, JOURNEY_META, JOURNEY_STEPS, localizeJourneyStep, JourneyKind, JourneyStep, journeyProgress, setStepCount, setStepNote, startJourney, toggleStep, useJourneys, loadJourneys, setJourneyDateLocale } from './src/services/journeyService';
import { HOLY_CHANNELS, openChannel, type HolyChannel } from './src/services/holyChannels';
import { VideoView, useVideoPlayer, type VideoPlayerStatus } from 'expo-video';
import { clearFastDay, FastType, labelForEntry, loadFastingState, missedReasons, MISSED_REASONS, MissedReason, recordFast, readableDate, setFastingOwed, summariseFasting, useFasting, setFastingDateLocale } from './src/services/fastingService';
import { buildWeeklySummary, loadActivity, logAdhkarRead, logHifzReview, logMushafPage, logSurahOpen, logVerseRead, useActivity, setActivityDateLocale } from './src/services/activityService';
import { addDays, addQada, ADVISORY, assessBleeding, BISMILLAH_ARABIC, BLEEDING_GUIDANCE, cycleStats, dayKey, daysBetween, deleteCycle, deleteNifas, deleteQada, endCycle, endNifas, EXPLANATIONS, FLOW_LEVELS, formatDay, formatLongDay, GHUSL_FARD, GHUSL_SUNNAH, LIMITS, loadWomensState, logPurity, nifasStats, NIYYAH_ARABIC, NIYYAH_MEANING, NIYYAH_TRANSLITERATION, PurityStatus, QadaReason, QADA_REASONS, qadaStats, RAMADAN_ADVISORY, RAMADAN_NOTES, RAMADAN_STATE_LABEL, ramadanPlan, RamadanPlanDay, recentPurity, REFERENCES, SCHOOL_NOTE, setFlow, setOptedIn, startCycle, startNifas, THESE_DAYS_ACTS, THESE_DAYS_ADVISORY, THESE_DAYS_ANCHOR, THESE_DAYS_DISPUTED, TheseDaysAct, toggleQada, TUHR_SIGNS, useWomens, WORSHIP_GUIDANCE } from './src/services/womensService';
import { BiometricInfo, biometricInfo, checkPin, removePin, RELOCK_OPTIONS, setPin, startLockWatch, unlockSession, unlockWithBiometric, updateLockSettings, useIsLocked, useLockConfig, loadLockConfig } from './src/services/privacyService';
import { CURRENCIES, clearHistory, computeZakat, currencySymbol, deleteCalculation, formatMoney, livePrices, loadZakatState, marketIsFresh, pricesAvailable, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, refreshMarket, saveCalculation, setAssetAmount, setBasis, setCurrency, setLiabilityAmount, setMetalPrice, setMoneyLocale, useLiveMetalPrices, useMarket, useZakat } from './src/services/zakatService';
import { setSurahNameLanguage } from './src/content/surahNames';

import { arNoun, clockTime, prayerName, tx, tf } from './src/services/arabicCopy';
import { downloadSurahAudio, loadDownloads, estimateFreeBytes, formatBytes, pauseDownload, removeDownload, resolveAudioSource, resumeDownload, retryDownload, totalDownloadBytes, useDownloads } from './src/services/downloadService';
import { NAME_LANGUAGES } from './src/services/api';
import { PROPHETS } from './src/content/prophets';
import { NAMES_MEANING_AR } from './src/content/namesAr';
import { countMuslimNames, findMuslimNames, letterCounts, loadMuslimNames, type MuslimName, type NameFilter } from './src/services/muslimNames';
import { currentPhrase, dhikrMeaning, DHIKR_PHRASES, loadTasbihState, removeTasbihSession, resetTasbihCount, saveTasbihSession, setTasbihGoal, setTasbihPhrase, tasbihDays, tasbihLifetime, TASBIH_GOALS, tapTasbih, todayTotal, useTasbih } from './src/services/tasbihService';
import { formatSadaqah, loadSadaqahState, logSadaqah, removeSadaqah, resetSadaqah, sadaqahSummary, setSadaqahCurrency, useSadaqah } from './src/services/sadaqahService';
import { loadSunnahState, resetSunnah, sunnahDayKey, sunnahForDay, sunnahHistory, sunnahSummary, SUNNAH_ORDER, SUNNAH_PRAYERS, toggleSunnah, useSunnah } from './src/services/sunnahService';
import { journalSummary, loadJournalState, removeJournalEntry, resetJournal, saveJournalEntry, useJournal } from './src/services/journalService';
import { Dua, DuaCategory } from './src/services/api';
import { clearPreparedQuran, getPreloadState, pauseQuranPreload, refreshPreload, resumeSavedQuranPreload, startQuranPreload, subscribePreload } from './src/services/quranPreload';

/**
 * The three posters.
 *
 * Islamic keeps the artwork it has always had. It is deliberately plain — a
 * mosque, a prayer card, a Quran — scenery rather than a statement, which is
 * what the app's own theme wants.
 *
 * Palestine is drawn separately, once per brightness, because a poster is
 * part of a theme and not decoration hung on top of one. An indigo poster
 * under the Palestine theme was the one thing on screen that did not belong
 * to it. Home is the Al-Aqsa compound, Prayer a minaret at the call, Quran an
 * illuminated page.
 *
 * In the Palestine set the subject sits in the right of the frame with the
 * left left quiet, because all three are covered by a scrim that runs from
 * near-solid on the left to clear on the right, with the text over the solid
 * end.
 */
const SCENE_HOME_ISLAMIC = require('./assets/hero-mosque-scene.webp');
const SCENE_HOME_ISLAMIC_DARK = require('./assets/hero-mosque-scene-dark.webp');
const SCENE_HOME_PALESTINE = require('./assets/scene-home-palestine.webp');
const SCENE_HOME_PALESTINE_DARK = require('./assets/scene-home-palestine-dark.webp');
const SCENE_PRAYER_ISLAMIC = require('./assets/prayer-card-scene.webp');
const SCENE_PRAYER_ISLAMIC_DARK = require('./assets/prayer-card-scene-dark.webp');
const SCENE_PRAYER_PALESTINE = require('./assets/scene-prayer-palestine.webp');
const SCENE_PRAYER_PALESTINE_DARK = require('./assets/scene-prayer-palestine-dark.webp');
const SCENE_QURAN_ISLAMIC = require('./assets/quran-scene.webp');
const SCENE_QURAN_ISLAMIC_DARK = require('./assets/quran-scene-dark.webp');
const SCENE_QURAN_PALESTINE = require('./assets/scene-quran-palestine-light.webp');
const SCENE_QURAN_PALESTINE_DARK = require('./assets/scene-quran-palestine-dark.webp');

type SceneSet = { islamic: any; islamicDark: any; palestine: any; palestineDark: any };
function pickScene(set: SceneSet, theme: ResolvedTheme) {
  return theme === 'palestineDark' ? set.palestineDark
    : theme === 'palestineLight' ? set.palestine
    : theme === 'islamicDark' ? set.islamicDark
    : set.islamic;
}
const SCENE_HOME: SceneSet = { islamic: SCENE_HOME_ISLAMIC, islamicDark: SCENE_HOME_ISLAMIC_DARK, palestine: SCENE_HOME_PALESTINE, palestineDark: SCENE_HOME_PALESTINE_DARK };
const SCENE_PRAYER: SceneSet = { islamic: SCENE_PRAYER_ISLAMIC, islamicDark: SCENE_PRAYER_ISLAMIC_DARK, palestine: SCENE_PRAYER_PALESTINE, palestineDark: SCENE_PRAYER_PALESTINE_DARK };
const SCENE_QURAN: SceneSet = { islamic: SCENE_QURAN_ISLAMIC, islamicDark: SCENE_QURAN_ISLAMIC_DARK, palestine: SCENE_QURAN_PALESTINE, palestineDark: SCENE_QURAN_PALESTINE_DARK };

/**
 * The scrim laid over each poster: near-solid on the left where the text goes,
 * clearing to nothing on the right where the artwork shows.
 *
 * These were hardcoded indigo, which meant a Palestine poster was still washed
 * indigo on the side you actually read. They follow the theme now. The Islamic
 * values are the original ones, unchanged.
 */
const SCRIM = {
  islamic:      ['rgba(34,27,62,.92)', 'rgba(60,47,101,.54)', 'rgba(77,60,145,.08)'],
  palestine:    ['rgba(8,12,9,.92)',   'rgba(0,60,25,.54)',   'rgba(0,120,50,.08)'],
  prayerIslamic:   ['rgba(15,11,25,.95)', 'rgba(38,28,79,.74)', 'rgba(77,60,145,.26)'],
  prayerPalestine: ['rgba(0,0,0,.95)',    'rgba(6,40,18,.74)',  'rgba(0,120,50,.26)'],
  quranIslamic:    ['rgba(42,32,81,.96)', 'rgba(92,63,141,.52)', 'transparent'],
  quranPalestine:  ['rgba(6,10,7,.96)',   'rgba(0,70,28,.52)',   'transparent'],
  /* The Home "Continue reading" card sits on the Quran scene, so it follows
     the Quran pair. Its Islamic stops are the ones it always had; only the
     Palestine side is new. */
  readIslamic:     ['rgba(42,32,81,.95)', 'rgba(77,59,129,.55)', 'rgba(77,60,145,.08)'],
  readPalestine:   ['rgba(6,10,7,.95)',   'rgba(0,70,28,.55)',   'rgba(0,120,50,.08)'],
} as const;
const isPal = (theme: ResolvedTheme) => theme === 'palestineLight' || theme === 'palestineDark';
/* One mark for both themes. A logo-mark-dark.png used to sit beside it, but it
   was byte-for-byte the same file, so the ternaries that picked between them
   were doing nothing. The mark carries its own colours and reads on either
   ground; if a genuinely different dark cut is drawn later, add it back as
   logo-mark-dark.png and restore the choice below. */
const LOGO_MARK = require('./assets/logo-mark.png');

/**
 * The palettes live in `src/design/brand.ts`, next to the ten brand colours
 * they are derived from. Nothing here may introduce a colour of its own.
 */
/** The palette in use. It is swapped in place when the theme changes. */
/* The bottom tab bar is absolutely positioned, so it floats over the screen
   rather than shortening it, and the mini-player floats above that again.
   Every vertical scroll container has to reserve room for them, or the end of
   its content is unreachable behind the bar. Measured, not guessed. */
const TAB_BAR_BODY = 66;
/** `FloatingTabBar` pads itself by 24 on iOS and 16 everywhere else. */
const TAB_BAR_INSET = Platform.OS === 'ios' ? 24 : 16;
/** What the floating bar actually occupies, not what it looks like it should. */
const TAB_BAR_H = TAB_BAR_BODY + TAB_BAR_INSET;
/** Clears the tab bar with a little air. `Page` adds the player reserve on top. */
const BOTTOM_RESERVE = TAB_BAR_H + 14;
/** The mini-player body, measured. */
const MINI_PLAYER_H = 62;
/**
 * Where the mini-player sits. It used to be a literal 96 on Android and 112 on
 * iOS, which quietly disagreed with the bar below it: the gap under the player
 * came out 14 on one platform and 22 on the other, and the strip of dead space
 * in Settings was that difference showing. Anchoring it to the reserve it
 * already reserves makes the gap the same 14 everywhere.
 */
const MINI_PLAYER_BOTTOM = BOTTOM_RESERVE;
/** Extra room a screen needs once the mini-player appears, given it already
    reserves BOTTOM_RESERVE. Keeps the shortest container clear of the player. */
const MINI_PLAYER_INSET = MINI_PLAYER_H + 20;
/**
 * How much horizontal room the reader's scroll area actually hands its
 * content. It caps its width and pads what is left, so anything sized to the
 * raw screen width comes out wider than the box it sits in.
 */
const READER_MAX_WIDTH = 860;
const READER_PAD = 16;
/** How a mushaf page is put together: the frame, and the border it carries. */
const MUSHAF_FRAME_PAD = 10;
const MUSHAF_FRAME_BORDER = 1.6;
const MUSHAF_INNER_PAD_H = 10;
const MUSHAF_INNER_PAD_V = 12;
const MUSHAF_INNER_BORDER = 0.8;
/** Bounds the fitted script is allowed to land between. */
const MUSHAF_MIN_SIZE = 9;
const MUSHAF_MAX_SIZE = 52;
/** Leading, as a proportion of the script size. */
const MUSHAF_LEAD = 1.48;
/** How much of the page's room the text is asked to fill. */
const MUSHAF_FILL = 0.97;

let C: Record<string, string> = { ...C_LIGHT };
/** The palette built into the sheet right now, so a swap happens only once. */
let themeApplied: ResolvedTheme = 'islamicLight';
/** Whether that palette is the dark one. A few colours are chosen on this
 *  rather than on the palette itself. */
let themeDark = false;
let shadow: any = { shadowColor: DEPTH.light.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: .11, shadowRadius: 24, elevation: 5 };
let soft: any = { shadowColor: DEPTH.light.soft, shadowOffset: { width: 0, height: 4 }, shadowOpacity: .07, shadowRadius: 14, elevation: 2 };


/**
 * Depth.
 *
 * A card catches light three ways and needs all three to read as an object
 * rather than a rectangle with a border: a wide ambient shadow beneath it, a
 * tight contact shadow where it meets the surface, and a hairline of light
 * along its top edge. The two shadows are separate layers because a single
 * shadow cannot be both tight and wide, and because the contact shadow is the
 * one that moves when the card is pressed.
 */
let depth: any = {
  ambient: { shadowColor: DEPTH.light.soft, shadowOffset: { width: 0, height: 8 }, shadowOpacity: .09, shadowRadius: 20, elevation: 3 },
  contact: { shadowColor: DEPTH.light.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: .10, shadowRadius: 2, elevation: 1 },
  edge: 'rgba(255,255,255,.9)',
  veil: DEPTH.light.veil
};
/**
 * What a card is made of.
 *
 * `soft` is for small chrome - chips, search fields, buttons. A card is larger
 * and should sit further off the page, so it takes the ambient shadow and the
 * lit top border instead. Both are kept as tokens so a card is one spread
 * rather than four properties that can drift apart screen by screen.
 */
let surface: any = { borderTopColor: depth.edge, ...depth.ambient };

/* ==================== Theme ==================== */
/** Colours and shadows follow the theme; the structure of the app does not. */

function hexToHsl(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, sat, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 1) + 1) % 1;
  if (s === 0) {
    const v = Math.round(l * 255).toString(16).padStart(2, '0');
    return ('#' + v + v + v).toUpperCase();
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  const to = (t: number) => Math.round(channel(t) * 255).toString(16).padStart(2, '0');
  return ('#' + to(hue + 1 / 3) + to(hue) + to(hue - 1 / 3)).toUpperCase();
}

/**
 * Moves a colour onto the dark palette, keeping its hue. Light surfaces fall to
 * deep ones, ink rises to near-white, and the warm accents are held up so text
 * and gold details stay legible on the dark ground.
 *
 * Colours that are already dark are returned untouched. The remap can hand this
 * a Midnight Ink surface, which belongs on the dark ground exactly as it is —
 * running it through the lift below would invert it to near-white and turn the
 * whole screen pale.
 */
function darkHex(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  if (l < 0.25) return hex;
  let l2: number;
  let s2: number;
  if (s >= 0.55 && l >= 0.75 && l < 0.9) { l2 = 0.82; s2 = s * 0.72; }        // gold and warm accents on dark cards
  else if (s < 0.2 && l >= 0.42 && l <= 0.78) { l2 = 0.68; s2 = s; }          // grey text
  else if (l >= 0.9) { l2 = 0.14; s2 = Math.min(s, 0.2); }                     // near-white surfaces
  else if (l >= 0.72) { l2 = 0.19; s2 = Math.min(s * 0.9, 0.24); }             // soft fills
  else if (l >= 0.55) { l2 = 0.24; s2 = Math.min(s * 0.9, 0.28); }             // fills and borders
  else if (l >= 0.3) { l2 = 0.66; s2 = Math.min(0.6, s * 1.05 + 0.04); }       // brand colours
  else { l2 = 0.86; s2 = Math.min(s, 0.3); }                                    // ink
  /* The HSL arithmetic above is free to land anywhere in RGB space, so the
     result is projected back onto the nearest true mix of two brand colours.
     Without this a colour can leave the palette on its way to dark. */
  return snapToBrand(hslToHex(h, s2, l2));
}

/**
 * The colours written literally into the style sheet. The ones that come from
 * `C` are already the right colour, so only these are moved onto the dark
 * palette.
 */
const LITERAL_HEXES: string[] = ['#14121F','#7B7671','#D6D2CB','#EBD3A6','#E6DEFA','#F5E9D2','#FCFAF6','#DFB163'];

/** Puts the brand palette over the style sheet without touching its layout. */
function remapStyles(created: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  Object.keys(created).forEach((key) => {
    const style = created[key] || {};
    const next: Record<string, any> = {};
    Object.keys(style).forEach((prop) => {
      const value = (style as any)[prop];
      if (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) && LITERAL_HEXES.indexOf(value) >= 0) {
        /* Colours written straight into the sheet rather than read from `C`
           are the one place a non-brand hue could survive. Move each onto the
           brand ramp first, then onto the dark palette if that is the one in
           use. Without the first step the light theme keeps the old hues. */
        const branded = brandHex(value);
        if (prop === 'shadowColor') next[prop] = themeDark ? '#000000' : branded;
        else next[prop] = themeDark ? darkHex(branded) : branded;
      } else {
        next[prop] = value;
      }
      /* Every surface goes dark with the palette, so every text colour has to
         come up with it. This lift is only correct when the ground has actually
         gone dark — applying it on light would bleach dark text to near-white
         and make it invisible on a Pearl card. */
      if (prop === 'fontFamily' && arabicFontOverride && typeof value === 'string' && ARABIC_FACES.has(value)) {
        next[prop] = arabicFontOverride;
      }
      /* Second, and independent of the Arabic face: the Latin face is swapped
         weight for weight, so Vietnamese keeps the hierarchy the design gives
         it instead of collapsing every weight onto one. Newsreader is left
         alone there — it already carries Vietnamese, so a heading set in it
         needs no substitute. Sinhala is the opposite case: Newsreader has no
         Sinhala at all, so the same table carries the heading weights too and
         they change with it. See SINHALA_HEADING_FACE_MAP. */
      if (prop === 'fontFamily' && latinFontMap && typeof value === 'string' && latinFontMap[value]) {
        next[prop] = latinFontMap[value];
      }
      if (themeDark && prop === 'color' && typeof next[prop] === 'string' && /^#[0-9a-fA-F]{6}$/.test(next[prop])
          && next[prop] !== C.onAccentInk && next[prop] !== C.surahBadgeInk) {
        /* `onAccentInk` is text sitting on the accent fill, which rises to a
           light Lavender on dark — so this is the one colour the lift must
           leave dark, or the button's label goes pale on its own button.
           `surahBadgeInk` is the same case: a dark numeral on a gold
           medallion, not on the card. Left to the lift it would go cream on
           gold, which is unreadable. */
        const [h, sat, l] = hexToHsl(next[prop]);
        if (l < 0.62) next[prop] = snapToBrand(hslToHex(h, Math.min(sat, 0.35), 0.84));
      }
    });
    out[key] = next;
  });
  return out;
}

/**
 * Two separate choices, and they are worth keeping apart.
 *
 * `ThemeName` is which set of colours the app wears. Islamic is the app's own
 * — Midnight Ink, Royal Indigo and gold. Palestine is the flag's four
 * colours, black, white, green and red, every value in it one of those or a
 * tint of one toward another.
 *
 * `ThemeMode` is light or dark, within whichever theme is chosen. It is the
 * same question whichever theme you are in, and it is answered the same way:
 * follow the device, or hold it at light or dark.
 *
 * So there are four palettes, not two. A theme is not a brightness, and
 * choosing Palestine at night should not quietly hand back somebody else's
 * dark — Palestine has a dark of its own, made the same way and to the same
 * standard, so the flag still reads as the flag after sunset.
 */
export type ThemeName = 'islamic' | 'palestine';
export type ThemeMode = 'system' | 'light' | 'dark';
/** What is on screen once both the theme and the mode have been resolved. */
export type ResolvedTheme = 'islamicLight' | 'islamicDark' | 'palestineLight' | 'palestineDark';
type ThemeState = { theme: ThemeName; mode: ThemeMode; dark: boolean; resolved: ResolvedTheme; tick: number;
  setTheme: (theme: ThemeName) => void; setMode: (mode: ThemeMode) => void;
  /**
   * Drives the change-over. It falls to 0 while the palette is swapped and
   * comes back to 1, so the swap itself is never seen.
   */
  swap: Animated.Value };
const THEME_KEY = 'deen-theme-v1';
const THEME_NAME_KEY = 'deen-theme-name-v1';
const ThemeContext = createContext<ThemeState>({ theme: 'islamic', mode: 'system', dark: false, resolved: 'islamicLight', tick: 0, setTheme: () => {}, setMode: () => {}, swap: new Animated.Value(1) });

async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
  } catch {
    return 'system';
  }
}

async function loadThemeName(): Promise<ThemeName> {
  try {
    const raw = await AsyncStorage.getItem(THEME_NAME_KEY);
    return raw === 'palestine' || raw === 'islamic' ? raw : 'islamic';
  } catch {
    return 'islamic';
  }
}

/** Puts one palette in place and rebuilds the style sheet from it. */
function applyPalette(theme: ResolvedTheme) {
  themeApplied = theme;
  const palette =
    theme === 'islamicDark' ? C_DARK :
    theme === 'palestineLight' ? C_PALESTINE :
    theme === 'palestineDark' ? C_PALESTINE_DARK :
    C_LIGHT;
  Object.keys(palette).forEach((key) => { C[key] = palette[key]; });
  const d =
    theme === 'islamicDark' ? DEPTH.dark :
    theme === 'palestineLight' ? DEPTH.palestine :
    theme === 'palestineDark' ? DEPTH.palestineDark :
    DEPTH.light;
  const dark = theme === 'islamicDark' || theme === 'palestineDark';
  themeDark = dark;
  shadow = { ...shadow, shadowColor: d.shadow, shadowOpacity: dark ? 0.5 : 0.11 };
  surface = { ...surface, borderTopColor: depth.edge, ...depth.ambient };
  soft = { ...soft, shadowColor: d.soft, shadowOpacity: dark ? 0.4 : 0.07 };
  /* On dark, shadows alone would disappear into the background, so the top
     edge carries the form: a faint light along the lip instead of a dark
     outline. */
  depth = {
    ambient: { ...depth.ambient, shadowColor: d.soft, shadowOpacity: dark ? 0.45 : 0.09 },
    contact: { ...depth.contact, shadowColor: d.shadow, shadowOpacity: dark ? 0.5 : 0.10 },
    edge: d.edge,
    veil: d.veil
  };
  CARD_GREEN.backgroundColor = C.mint;
  CARD_GOLD.backgroundColor = C.peach;
  s = makeStyles();
  /* These two were built once at module load, which baked the light palette
     into them: they stayed white after everything else went dark. They have to
     be rebuilt with the rest. */
  consistency = makeConsistency();
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [theme, setThemeState] = useState<ThemeName>('islamic');
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    void Promise.all([loadThemeMode(), loadThemeName()]).then(([nextMode, nextTheme]) => {
      setModeState(nextMode);
      setThemeState(nextTheme);
      setHydrated(true);
    });
  }, []);
  /* The theme is which colours, the mode is how bright. Neither alone is
     enough to pick a palette, so both are resolved into one answer and only
     that answer decides what is on screen. */
  const systemDark = system === 'dark';
  const dark = mode === 'system' ? systemDark : mode === 'dark';
  const resolved: ResolvedTheme =
    theme === 'palestine' ? (dark ? 'palestineDark' : 'palestineLight') :
    dark ? 'islamicDark' : 'islamicLight';
  const swap = useRef(new Animated.Value(1)).current;
  /* Painted once, during render, so the opening screen is already in the right
     palette. Every change after that goes through the animation below instead
     of happening here - otherwise the swap would land on the same render as
     the tap and the change-over would have nothing left to hide. */
  const painted = useRef(false);
  if (hydrated && !painted.current) {
    painted.current = true;
    if (themeApplied !== resolved) applyPalette(resolved);
  }
  useEffect(() => {
    if (!hydrated) return;
    if (themeApplied === resolved) return;
    const paper = (next: ResolvedTheme) => {
      if (Platform.OS !== 'web' || typeof document === 'undefined') return;
      const value = next === 'islamicDark' ? C_DARK.bg : next === 'palestineLight' ? C_PALESTINE.bg : next === 'palestineDark' ? C_PALESTINE_DARK.bg : C_LIGHT.bg;
      document.documentElement.style.background = value;
      document.body.style.background = value;
    };
    /* The palette is a module-level object and the sheet is built from it, so
       changing theme is a rebuild and a remount - an instant cut from one
       palette to the other. That cut is hidden by taking the screen to nothing
       first: it dips out, the swap happens while there is nothing to see, and
       it comes back in the new palette.

       The dip is quicker than the return. Going should feel like a decision;
       coming back should feel like the screen settling. */
    Animated.timing(swap, {
      toValue: 0,
      duration: 150,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      applyPalette(resolved);
      paper(resolved);
      setTick((value) => value + 1);
      Animated.timing(swap, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [resolved, hydrated, swap]);
  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
  };
  const setTheme = (next: ThemeName) => {
    setThemeState(next);
    AsyncStorage.setItem(THEME_NAME_KEY, next).catch(() => undefined);
  };
  const value = useMemo(() => ({ theme, mode, dark, resolved, setTheme, setMode, tick, swap }), [theme, mode, dark, resolved, setTheme, tick, swap]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() { return useContext(ThemeContext); }

/**
 * The navigation state is not written to disk.
 *
 * It used to be, so that a theme change - which remounts the whole navigator,
 * because the palette is a module-level object - could put the person back
 * where they were. That was worth solving, but saving to disk solved more than
 * that: it also meant the app *reopened* on whatever screen it was closed on.
 * You put it down on a hadith page on Sunday and came back to that hadith page
 * on Wednesday, with no way to know why you were there.
 *
 * The remount is handled in memory instead (see `liveState` in Root), which is
 * the case that actually needs it. A fresh launch opens on Home, every time.
 */
const NAV_KEY = 'deen-nav-v2';
/** Older builds left a snapshot behind; nothing reads it now, so tidy it up. */
function clearSavedNavState() {
  AsyncStorage.removeItem(NAV_KEY).catch(() => undefined);
}

/**
 * Every press in the app goes through this.
 *
 * The app has a couple of hundred Pressables. Rather than visit each one, the
 * primitive itself is wrapped: a press buzzes, then does its work. Wrapping at
 * this level also means a later screen gets haptics without anyone having to
 * remember, and the one switch in Settings really does silence everything.
 *
 * `kind` lets a call site ask for something other than the default tap, and
 * `hapticOff` opts a press out where a buzz would be noise - scrolling a list
 * of rows you are only brushing past, for instance.
 */
type HapticPressableProps = React.ComponentProps<typeof BarePressable> & { hapticKind?: HapticKind; hapticOff?: boolean };
const Pressable = React.forwardRef<React.ElementRef<typeof BarePressable>, HapticPressableProps>(function Pressable(props, ref) {
  const { onPress, hapticKind = 'tap', hapticOff, ...rest } = props;
  return <BarePressable
    ref={ref}
    {...rest}
    onPress={hapticOff ? onPress : withHaptic(onPress, hapticKind as HapticKind)}
  />;
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
type QuranPreferencesState={preferences:QuranPreferences;hydrated:boolean;update:(patch:Partial<QuranPreferences>)=>Promise<void>;fontTick:number};
/**
 * Whether the reading chrome is currently hidden.
 *
 * The floating tab bar is rendered by the navigator, above the reader, so it
 * cannot see the reader's state and the reader cannot reach the bar. Rather
 * than thread a context through the navigator for one boolean, the reader
 * announces it here and whoever cares listens. It is reset whenever the reader
 * unmounts, so leaving mid-scroll never leaves the bar gone.
 */
const chromeListeners = new Set<(hidden: boolean) => void>();
let chromeHiddenFlag = false;
function setChromeHidden(next: boolean) {
  if (chromeHiddenFlag === next) return;
  chromeHiddenFlag = next;
  chromeListeners.forEach((fn) => fn(next));
}
function useChromeHidden() {
  const [hidden, setHidden] = useState(chromeHiddenFlag);
  useEffect(() => {
    chromeListeners.add(setHidden);
    return () => { chromeListeners.delete(setHidden); };
  }, []);
  return hidden;
}

/* ==================== Overlay layer ==================== */
/**
 * Sheets that have to sit above the floating menu.
 *
 * A sheet drawn inside a screen is a descendant of the navigator, while the
 * floating tab bar and the mini player are siblings rendered after it - so
 * they paint on top and swallow the bottom of every sheet. zIndex cannot fix
 * that, because it only orders siblings, and a sheet and the tab bar are not
 * siblings: no zIndex on the sheet can lift it out of the navigator.
 *
 * So sheets register themselves here instead, and a host that is the last
 * child of the navigation container draws them. Being last, it is above
 * everything the app floats, and its scrim dims the whole screen - the tab bar
 * included - rather than fighting it for the same strip of pixels.
 */
type OverlayEntry = { key: string; render: () => React.ReactNode; onDismiss?: () => void };
let overlayEntries: OverlayEntry[] = [];
const overlayListeners = new Set<() => void>();
function emitOverlay() { overlayListeners.forEach((fn) => fn()); }
function showOverlay(key: string, render: () => React.ReactNode, onDismiss?: () => void) {
  overlayEntries = [...overlayEntries.filter((entry) => entry.key !== key), { key, render, onDismiss }];
  emitOverlay();
}
function hideOverlay(key: string) {
  const next = overlayEntries.filter((entry) => entry.key !== key);
  if (next.length === overlayEntries.length) return;
  overlayEntries = next;
  emitOverlay();
}
function useOverlayEntries() {
  const [, bump] = useState(0);
  useEffect(() => {
    const listener = () => bump((n) => n + 1);
    overlayListeners.add(listener);
    return () => { overlayListeners.delete(listener); };
  }, []);
  return overlayEntries;
}
/**
 * Closes the sheet on top, the same way its close button would.
 *
 * Entries are appended as sheets open, so the last one is the one on screen.
 * A sheet with no dismisser is left alone: taking it away here would hide it
 * while whatever opened it still believed it was open, and the next tap on
 * that control would do nothing. Better to let back go to the screen behind.
 */
function dismissTopOverlay(): boolean {
  const top = overlayEntries[overlayEntries.length - 1];
  if (!top || !top.onDismiss) return false;
  top.onDismiss();
  return true;
}
/** Draws the registered sheets, in the order they were opened. */
function OverlayHost() {
  const entries = useOverlayEntries();
  if (!entries.length) return null;
  return <>{entries.map((entry) => (
    <View key={entry.key} pointerEvents="box-none" style={s.overlayLayer}>{entry.render()}</View>
  ))}</>;
}
/**
 * Keeps one sheet registered while `active` is true, and tears it down on
 * close or unmount.
 *
 * The callback is held in a ref rather than captured, so when the parent
 * re-renders the host calls the newest one and the sheet's props stay current
 * - while the sheet itself is never remounted. That matters for the note
 * sheet: the keyboard pushes a re-render through on every keystroke, and a
 * remount would throw away whatever had been typed.
 */
function useOverlaySheet(key: string, active: boolean, render: () => React.ReactNode, onDismiss?: () => void) {
  const latest = useRef(render);
  latest.current = render;
  /* Held in a ref so a parent that rebuilds its dismissal on every render
     does not re-register the sheet and remount it mid-typing. */
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    if (!active) return;
    showOverlay(key, () => latest.current(), () => dismiss.current?.());
    return () => hideOverlay(key);
  }, [key, active]);
  /* The host draws whatever the callback returned the last time *it* rendered,
     and it only re-renders when a sheet opens or closes. So registering the
     newest callback was not enough: anything that arrived after the sheet was
     already on screen never reached it. The translations sheet opened, asked
     for a ~200KB catalogue, and stayed on "Loading live data…" - the parent
     re-rendered with all 484 editions and the host never heard, so the sheet
     kept its first output until something else, toggling a switch, happened to
     redraw it. Ask the host to redraw after every render while this sheet is
     open. It never loops: redrawing the host does not re-render the owner. */
  useEffect(() => {
    if (active) emitOverlay();
  });
}

/* The same defaults the service uses, so the two cannot drift: this is only
   what is on screen until the stored preferences have been read. */
const DEFAULT_QURAN_PREFERENCES:QuranPreferences=DEFAULTS;
const QuranPreferencesContext=createContext<QuranPreferencesState>({preferences:DEFAULT_QURAN_PREFERENCES,hydrated:false,update:async()=>{},fontTick:0});
function QuranPreferencesProvider({children}:{children:React.ReactNode}){const[preferences,setPreferences]=useState(DEFAULT_QURAN_PREFERENCES);const[hydrated,setHydrated]=useState(false);useEffect(()=>{loadQuranPreferences().then(value=>{setPreferences(value);setHydrated(true)})},[]);
  /* The chosen face is fetched on demand, so it may not be there yet. Once it
     is, the sheet is rebuilt with it and everyone wearing it re-renders. */
  useEffect(()=>{
    let alive=true;
    void ensureQuranFont(preferences.arabicFont).then((ok)=>{
      if(!alive)return;
      arabicFontOverride = ok ? quranFont(preferences.arabicFont) : null;
      s = makeStyles();
          consistency = makeConsistency();
      setFontTick((value)=>value+1);
    });
    return ()=>{alive=false};
  },[preferences.arabicFont]);
  const [fontTick,setFontTick]=useState(0);const update=async(patch:Partial<QuranPreferences>)=>{const next={...preferences,...patch};setPreferences(next);await saveQuranPreferences(next)};return <QuranPreferencesContext.Provider value={{preferences,hydrated,update,fontTick}}>{children}</QuranPreferencesContext.Provider>}
function useQuranPreferences(){return useContext(QuranPreferencesContext)}
type WorshipSettingsState={settings:WorshipSettings;hydrated:boolean;update:(patch:Partial<WorshipSettings>)=>Promise<void>};
const WorshipSettingsContext=createContext<WorshipSettingsState>({settings:DEFAULT_WORSHIP_SETTINGS,hydrated:false,update:async()=>{}});
function WorshipSettingsProvider({children}:{children:React.ReactNode}){const[settings,setSettings]=useState(DEFAULT_WORSHIP_SETTINGS);const[hydrated,setHydrated]=useState(false);useEffect(()=>{loadWorshipSettings().then(value=>{setSettings(value);setHydrated(true)})},[]);const update=async(patch:Partial<WorshipSettings>)=>{const next={...settings,...patch};setSettings(next);await saveWorshipSettings(next)};useEffect(()=>{setHapticsEnabled(settings.hapticsEnabled)},[settings.hapticsEnabled]);return <WorshipSettingsContext.Provider value={{settings,hydrated,update}}>{children}</WorshipSettingsContext.Provider>}
function useWorshipSettings(){return useContext(WorshipSettingsContext)}
async function managedPrayerSnapshot(location:AppLocation,settings:WorshipSettings){try{const snapshot=await getPrayerSnapshot(location.latitude,location.longitude,{method:settings.calculationMethod,school:settings.madhab,timezone:location.timezone,timeFormat:settings.timeFormat});await savePrayerCache(location.latitude,location.longitude,settings.calculationMethod,settings.madhab,snapshot);return{snapshot,cached:false}}catch(error){const cached=await loadPrayerCache(location.latitude,location.longitude,settings.calculationMethod,settings.madhab);if(cached)return{snapshot:cached.snapshot,cached:true};throw error}}
/** The IANA zone, when we know it, so times are read on the city's own clock. */
type AppLocation = { latitude: number; longitude: number; label: string; timezone?: string };

/**
 * The zone the phone itself is set to, as an IANA name.
 *
 * Used as the default for a place whose zone we were not told: coordinates
 * typed by hand are coordinates you are standing at, so your own clock is the
 * one to read them on. Anything that cannot name its zone falls back to
 * undefined, and the formatter then uses local time directly, which is the
 * same answer.
 */
function deviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}
type LocationState = { location: AppLocation | null; useDubai: () => void; setManual: (location:AppLocation)=>void; clear: () => void };
/**
 * Where the app starts when nobody has chosen anywhere.
 *
 * Makkah is the one place every Muslim shares as a reference, so it is a
 * truthful default rather than a placeholder: the times shown before a choice
 * is made are real times for a real city. It is held in state only and never
 * written to storage, so choosing your own city is never overridden later,
 * while a fresh install still lands somewhere sensible.
 *
 * The coordinates are the ones in the bundled city list, so searching for
 * Makkah returns exactly this.
 */
const DEFAULT_LOCATION: AppLocation = {
  latitude: 21.43,
  longitude: 39.83,
  label: 'Makkah, Saudi Arabia',
  timezone: 'Asia/Riyadh',
};

const LocationContext = createContext<LocationState | null>(null);
function LocationProvider({children}:{children:React.ReactNode}) {
  const {rtl,language}=useLanguage();
  const [location,setLocation]=useState<AppLocation|null>(null);
  useEffect(()=>{loadStoredLocation().then(saved=>setLocation(saved||DEFAULT_LOCATION))},[]);
  /*
   * A place is stored with the zone its times should be read in. When the
   * caller knows it — a city from the bundled list — it is passed through.
   * When they do not, it is the phone's own: you are standing at coordinates
   * you just typed in, so your clock is the right one.
   */
  const commit=(next:AppLocation|null)=>{
    if(next&&!next.timezone) next={...next,timezone:deviceTimeZone()};
    setLocation(next);saveStoredLocation(next).catch(()=>{})
  };
  const useDubai=()=>commit({latitude:25.2048,longitude:55.2708,label:'Dubai, United Arab Emirates',timezone:'Asia/Dubai'});
  return <LocationContext.Provider value={{location,useDubai,setManual:commit,clear:()=>commit(null)}}>{children}</LocationContext.Provider>;
}
function useAppLocation(){const value=useContext(LocationContext);if(!value)throw new Error('Location provider missing');return value}
type AppLanguage=LanguageCode;
type LanguageState={language:AppLanguage;rtl:boolean;ready:boolean;setLanguage:(language:AppLanguage)=>void;latinFaceTick:number};
const LanguageContext=createContext<LanguageState>({language:'en',rtl:false,ready:false,setLanguage:()=>{},latinFaceTick:0});

/**
 * The language the interface is in, for the code that cannot ask the hook.
 *
 * The error boundary is a class rendered outside the provider, so it has no way
 * to call useLanguage - and a screen that has already thrown is exactly the
 * moment the words on it matter most. The provider writes here as it goes, and
 * anything outside the tree reads it.
 */
let currentLanguage: AppLanguage = 'en';
/** The interface language, for callers with no access to the context. */
export function getAppLanguage(): AppLanguage {
  return currentLanguage;
}
/**
 * The interface language. Eleven are offered and three of them read right to
 * left. Only English and Arabic have finished interface copy, so the rest are
 * shown as they are and fall back to English until theirs is written.
 */

/**
 * Reloads the app so a change of direction takes effect.
 *
 * forceRTL cannot re-lay-out the screens that are already mounted, so the
 * direction only truly changes on the next launch. On a phone there is no
 * "next launch" the person is going to wait for, so we bring it about: save
 * first, then reload, which is the documented way to apply it.
 *
 * expo-updates is the only mechanism that works in a release build, and it
 * needs the app to have been built with it. Where it is not available we fall
 * back to the dev-menu reload, and if that is missing too we leave the app
 * running rather than crash it — the language still changes, and the direction
 * catches up whenever the app is next opened.
 */
async function restartForDirection() {
  try {
    const Updates = require('expo-updates');
    if (Updates?.reloadAsync) { await Updates.reloadAsync(); return; }
  } catch { /* not built with expo-updates — try the dev path */ }
  try {
    const RN = require('react-native');
    if (RN?.DevSettings?.reload) { RN.DevSettings.reload(); return; }
  } catch { /* neither path is available */ }
}

/* The direction a wrapper should declare — or, quite often, none at all.
 *
 * On the web this is the whole mechanism. `direction` is a real CSS
 * property: the browser lays out with it, hit-tests with it, and cascades
 * it into text alignment, so a wrapper that sets it is correct and
 * sufficient, and it needs no restart.
 *
 * On native it is only a fallback, and using it as more than that is what
 * made the Android build wrong while the web build looked right. There,
 * `direction` reaches Yoga's layout but not the text or the hit-testing:
 * a wrapper mirrors where things are drawn without moving the touch
 * targets underneath them, so taps land away from the control they appear
 * to be on, and text keeps the alignment its own characters imply instead
 * of inheriting anything. `I18nManager` is the supported mechanism, and it
 * is already applied elsewhere with the restart it requires. When it
 * agrees, the wrapper must say nothing and let Yoga inherit the direction
 * I18nManager has already chosen.
 *
 * It is still set when the two disagree, which is the case it was written
 * for: a device that refuses the reload would otherwise be stuck facing
 * the wrong way with nothing to correct it. */
function shellDirection(wantsRtl: boolean): 'rtl' | 'ltr' | undefined {
  if (Platform.OS === 'web') return wantsRtl ? 'rtl' : 'ltr';
  return I18nManager.isRTL === wantsRtl ? undefined : wantsRtl ? 'rtl' : 'ltr';
}

function LanguageProvider({children}:{children:React.ReactNode}){
  const[language,setLanguageState]=useState<AppLanguage>('en');
  const[ready,setReady]=useState(false);
  /* Bumped when the Latin face is swapped in or out. The sheet is a module-level
     object, so rebuilding it does not by itself re-render anyone wearing it;
     carrying a tick on the language context is what makes the whole tree pick
     the new face up. */
  const[latinFaceTick,setLatinFaceTick]=useState(0);
  const rtl=isRtl(language);
  /* Hand a direction to I18nManager and say whether the app must be restarted
     for it to mean anything.

     Native layout direction is decided once, when the app starts. forceRTL
     only records the new value — it cannot re-lay-out what is already on
     screen — so the reload is what actually applies it. That reload has to be
     a one-shot: some devices keep reporting the previous direction back, and
     restarting on every launch would be far worse than the original bug. So
     the marker in storage decides, not isRTL. */
  const applyDirection=async(wantsRtl:boolean)=>{
    if(Platform.OS==='web')return false;
    const wanted=wantsRtl?'rtl':'ltr';
    const applied=await loadAppliedDirection();
    /* First launch after this shipped: if native already agrees there is
       nothing to do, so adopt it rather than restarting for no reason. */
    if(applied===null&&I18nManager.isRTL===wantsRtl){await saveAppliedDirection(wanted);return false}
    if(applied===wanted)return false;
    I18nManager.allowRTL(true);
    if(I18nManager.isRTL!==wantsRtl)I18nManager.forceRTL(wantsRtl);
    await saveAppliedDirection(wanted);
    return true;
  };
  const setLanguage=(next:AppLanguage)=>{
    const wantsRtl=isRtl(next);
    currentLanguage=next;
    setLanguageState(next);
    /* The language has to reach storage before the reload, or the app would
       come back in the old language under the new direction — worse than the
       bug being fixed. */
    void (async()=>{
      await saveLanguage(next);
      if(await applyDirection(wantsRtl))await restartForDirection();
    })();
  };
  useEffect(()=>{
    void (async()=>{
      let saved:string|null=null;
      try{saved=await loadLanguage()}catch{saved=null}
      const code=(saved&&languageByCode(saved)?saved:'en') as AppLanguage;
      /* ready gates the first frame, so the app never paints in the wrong
         language and then swap underneath you. */
      currentLanguage=code;
      setLanguageState(code);
      setReady(true);
      try{if(await applyDirection(isRtl(code)))void restartForDirection()}catch{/* a device that refuses the reload still gets the right layout from the direction style */}
    })();
  },[]);
  /* Two languages are set in a face that is not DM Sans, because DM Sans does
     not carry them — Vietnamese in Be Vietnam Pro, Sinhala in DM Sans with the
     Sinhala block grafted on. See `ensureLatinFace`. The face is fetched the
     first time the language is chosen, and the sheet is rebuilt once it is in
     memory, the same way the Quran faces are: the override alone would reach
     only the next screen that happened to re-render. Loading takes a moment,
     so until it lands the language wears DM Sans and the system fallback
     rather than nothing at all. */
  useEffect(() => {
    let alive = true;
    void ensureLatinFace(language).then((map) => {
      if (!alive) return;
      /* Unchanged map means nothing to rebuild: every language without its own
         face resolves to null, and re-running the sheet on each of them would
         rebuild it for nothing. */
      if (map === latinFontMap) return;
      latinFontMap = map;
      s = makeStyles();
      setLatinFaceTick((value) => value + 1);
    });
    return () => { alive = false; };
  }, [language]);
  useEffect(()=>{
    // Dates follow the language only where the copy is finished; an English
    // interface with French dates would be a surprise.
    /* Urdu is written here so its weekday and month names come out in Urdu.
       Left undefined it fell through to the browser's own locale, and the
       weekly summary read "Thursday" and "Nov 4" in the middle of Urdu.
       'ur' rather than 'ur-IN': the latter numbers in Arabic-Indic digits,
       and the rest of the app uses the Latin ones. */
    /* Indonesian dates are named like the other explicit languages rather than
       left to the device, so a reader who has chosen Indonesian in the app gets
       Indonesian dates even if the phone itself is set to something else. */
    /* Persian keeps Latin digits for the same reason Arabic does: switching
     numbering systems halfway down a screen reads as a mistake. */
    const dateLocale=language==='ar'?'ar-u-nu-latn':language==='ur'?'ur':language==='en'?'en':language==='id'?'id'
      :language==='tr'?'tr':language==='fa'?'fa-u-nu-latn':language==='hi'?'hi':language==='ml'?'ml':undefined;
    setMoneyLocale(language);setFastingDateLocale(dateLocale);setActivityDateLocale(dateLocale);setJourneyDateLocale(dateLocale);
    /* Surah names are looked up from a table rather than asked of the API,
       so they need telling which language to answer in the same way. */
    setSurahNameLanguage(language);
  },[language]);
  useEffect(()=>{if(Platform.OS==='web'&&typeof document!=='undefined'){
    const dir=rtl?'rtl':'ltr';
    document.documentElement.dir=dir;
    document.documentElement.lang=language;
    document.documentElement.dataset.appDirection=dir;
  }},[rtl,language]);
    /* Held in step with the state as well as with setLanguage, so the mirror
       is right whichever way the language came to be what it is. */
    currentLanguage=language;
  return <LanguageContext.Provider value={{language,rtl,ready,setLanguage,latinFaceTick}}>{children}</LanguageContext.Provider>;
}
function useLanguage(){return useContext(LanguageContext)}
const ico = (name: any, size = 21, color?: string) => <CustomIcon name={String(name)} size={size} color={color} />;
function MotionGlyph({ name, size = 22, delay = 0, inverse = false }: { name: any; size?: number; delay?: number; inverse?: boolean }) {
  const enter = useRef(new Animated.Value(.72)).current;
  const lift = useRef(new Animated.Value(3)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(enter, { toValue: 1, delay, friction: 5, tension: 85, useNativeDriver: true }),
      Animated.spring(lift, { toValue: 0, delay, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);
  const theme = iconTheme(String(name)); return <View style={[s.motionGlyph,!inverse&&{backgroundColor:theme.bg,borderColor:theme.border},inverse&&s.motionGlyphInverse]}><Animated.View style={{ transform: [{ scale: enter }, { translateY: lift }] }}>{ico(name,size,inverse?C.white:theme.fg)}</Animated.View><View style={[s.glyphDot,{backgroundColor:inverse?C.onHero:theme.accent}]} /></View>;
}
const TOOL_IMAGES:Record<string,any>={
  Quran:require('./assets/tool-icons/quran.png'),
  Qibla:require('./assets/tool-icons/qibla.png'),
  Prayer:require('./assets/tool-icons/salah-guide.png'),
  Tools:require('./assets/tool-icons/tab-tools.png'),
  Pilgrimage:require('./assets/tool-icons/pilgrimage.png'),
  'Umrah and Hajj':require('./assets/tool-icons/pilgrimage.png'),
  Umrah:require('./assets/tool-icons/umrah.png'),
  Hajj:require('./assets/tool-icons/hajj.png'),
  'Holy site channels':require('./assets/tool-icons/holy-sites.png'),
  'ritual-ihram':require('./assets/tool-icons/ritual-ihram.png'),
  'ritual-tawaf':require('./assets/tool-icons/ritual-tawaf.png'),
  'ritual-sai':require('./assets/tool-icons/ritual-sai.png'),
  'ritual-arafat':require('./assets/tool-icons/ritual-arafat.png'),
  'ritual-jamarat':require('./assets/tool-icons/ritual-jamarat.png'),
  'ritual-mina':require('./assets/tool-icons/ritual-mina.png'),
  'ritual-shave-or-trim-hair':require('./assets/tool-icons/ritual-shave-or-trim-hair.png'),
  'pray-rakah':require('./assets/tool-icons/pray-rakah.png'),
  Duas:require('./assets/tool-icons/duas.png'),
  Tasbih:require('./assets/tool-icons/tasbih.png'),
  Hijri:require('./assets/tool-icons/hijri.png'),
  'Hijri calendar':require('./assets/tool-icons/hijri.png'),
  Ramadan:require('./assets/tool-icons/ramadan.png'),
  Hadith:require('./assets/tool-icons/hadith.png'),
  Names:require('./assets/tool-icons/99-names-of-allah.png'),
  'Prophet Names':require('./assets/tool-icons/prophet-names.png'),
  'Muslim Names':require('./assets/tool-icons/muslim-names.png'),
  'Adhkar':require('./assets/tool-icons/adhkar.png'),
  '99 Names':require('./assets/tool-icons/99-names-of-allah.png'),
  Zakat:require('./assets/tool-icons/zakat.png'),
  Fasting:require('./assets/tool-icons/fasting-tracker.png'),
  Location:require('./assets/tool-icons/location.png'),
  Notifications:require('./assets/tool-icons/notifications.png'),
  Adhan:require('./assets/tool-icons/adhan.png'),
  'Morning Adhkar':require('./assets/tool-icons/morning-adhkar.png'),
  'Evening Adhkar':require('./assets/tool-icons/evening-adhkar.png'),
  Audio:require('./assets/tool-icons/audio.png'),
  Downloads:require('./assets/tool-icons/downloads.png'),
  'Worship guides':require('./assets/tool-icons/worship-guides.png'),
  'Weekly Summary':require('./assets/tool-icons/weekly-summary.png'),
  'Wudu Guide':require('./assets/tool-icons/wudu-guide.png'),
  'Ghusl':require('./assets/tool-icons/ghusl.png'),
  'Salah Guide':require('./assets/tool-icons/salah-guide.png'),
  'Janazah Guide':require('./assets/tool-icons/janazah-guide.png'),
  'Eid Prayer Guide':require('./assets/tool-icons/eid-guide.png'),
  'Istikhara Guide':require('./assets/tool-icons/istikhara-guide.png'),
  'Taraweeh Guide':require('./assets/tool-icons/taraweeh-guide.png'),
  Shahada:require('./assets/tool-icons/shahada.png'),
  'Ramadan Guide':require('./assets/tool-icons/ramadan.png'),
  'Fasting Guide':require('./assets/tool-icons/fasting-guide.png'),
  'Laylatul Qadr':require('./assets/tool-icons/laylatul-qadr.png'),
  'Zakat al-Fitr':require('./assets/tool-icons/zakat-fitr.png'),
  'Arabic Quran':require('./assets/tool-icons/quran-arabic.png'),
  'Quran Arabic':require('./assets/tool-icons/quran-arabic.png'),
  'English meaning':require('./assets/tool-icons/quran-english.png'),
  Recitations:require('./assets/tool-icons/recitations.png'),
  'Quran Audio':require('./assets/tool-icons/recitations.png'),
  'Quran Search':require('./assets/tool-icons/quran-search.png'),
  Translations:require('./assets/tool-icons/translations.png'),
  Transliteration:require('./assets/tool-icons/transliteration.png'),
  '30 Juz':require('./assets/tool-icons/juz.png'),
  'Juz Directory':require('./assets/tool-icons/juz.png'),
  Bookmarks:require('./assets/tool-icons/bookmarks.png'),
  Notes:require('./assets/tool-icons/notes.png'),
  'Reading Plans':require('./assets/tool-icons/reading-plans.png'),
  Hifz:require('./assets/tool-icons/hifz.png'),
  'Reader Settings':require('./assets/tool-icons/reader-settings.png'),
  Tafsir:require('./assets/tool-icons/tafsir.png'),
  'Translation Compare':require('./assets/tool-icons/translation-compare.png'),
  'Offline Quran':require('./assets/tool-icons/offline-quran.png'),
  'Quran Preload':require('./assets/tool-icons/offline-quran.png'),
  'Mushaf Pages':require('./assets/tool-icons/mushaf-pages.png'),
  '60 Hizb':require('./assets/tool-icons/hizb.png'),
  'Quran Topics':require('./assets/tool-icons/quran-topics.png'),
  'Quran Vocabulary':require('./assets/tool-icons/quran-vocabulary.png'),
  Tajweed:require('./assets/tool-icons/tajweed.png'),
  'Women’s worship':require('./assets/tool-icons/womens-area.png'),
  Cycle:require('./assets/tool-icons/cycle.png'),
  Purity:require('./assets/tool-icons/purity.png'),
  'Qada fasts':require('./assets/tool-icons/qada-fasts.png'),
  /* The five newest screens. Their keys are the ones the screens pass to
     ToolGraphic, so a key that does not match the tool name exactly falls
     back to the generic glyph and the art silently goes unused. */
  'Sadaqah':require('./assets/tool-icons/sadaqah.png'),
  'Qada Prayer':require('./assets/tool-icons/qada-prayer.png'),
    'Qada Prayers':require('./assets/tool-icons/qada-prayer.png'),
  /* The tile says "Qada Prayers" and the screen says "Qada Prayer". Both are
     the same tool, and ToolGraphic matches the key exactly, so without this
     alias the tile keeps the generic glyph while the screen gets the art. */
  'Journal':require('./assets/tool-icons/journal.png'),
  'Khatam':require('./assets/tool-icons/khatam.png'),
  /* The four the Quran screen asks for by its own short name.
     The tiles used to be looked up by their label — '30 Juz',
     'Quran Topics' — and those keys are still above, because other
     screens resolve them that way. Naming the tool on the tile is what
     lets the Palestine set be chosen by theme, but it also means the
     lookup now arrives as 'Juz', 'Hizb', 'Topics' and 'Vocab', which
     these maps had never held. So the short names are added as aliases
     onto drawings that already existed: nothing new is drawn, and the
     Islamic theme stops falling through to the generic glyph. */
  Juz:require('./assets/tool-icons/juz.png'),
  Hizb:require('./assets/tool-icons/hizb.png'),
  Topics:require('./assets/tool-icons/quran-topics.png'),
  Vocab:require('./assets/tool-icons/quran-vocabulary.png'),
  'Sunnah Prayers':require('./assets/tool-icons/sunnah-prayers.png'),
  'Privacy lock':require('./assets/tool-icons/privacy-lock.png'),
  /* Given its own file. It was pointing at pilgrimage.png, which is also
     the Pilgrimage graphic on the rites screens, so replacing that art
     would have changed those with it. */
  'Umrah Resources':require('./assets/tool-icons/umrah-resources.png'),
  'Madinah Live':require('./assets/tool-icons/madinah-live.png'),
  /* Likewise its own file: holy-sites.png is the Holy site channels
     graphic too. */
  'Makkah Live':require('./assets/tool-icons/makkah-live.png'),
  /* Given its own file rather than sharing Fajr's. The tracker used to point
     at prayer-fajr.png, which is also the Fajr row in the prayer list, so
     replacing that art would have changed the Fajr icon with it. */
  'Salah Tracker':require('./assets/tool-icons/salah-tracker.png'),
  'Qada Fasts':require('./assets/tool-icons/qada-fasts.png'),
  'Cycle Tracker':require('./assets/tool-icons/cycle.png'),
  'Hijri Calendar':require('./assets/tool-icons/hijri.png'),
  'Prayer Reminders':require('./assets/tool-icons/prayer-reminders.png'),
  Istihada:require('./assets/tool-icons/istihada.png'),
  'Ramadan Planner':require('./assets/tool-icons/ramadan-planner.png'),
  'These Days':require('./assets/tool-icons/these-days.png'),
  /* The Settings rows. Storage, Backup and Corrections had no entry at all
     and were quietly falling back to the generic glyph - on the row and on
     their own screens. The other two were borrowing another tool's artwork:
     Data Sources was showing the Quran icon, and Quran Reading shared a file
     with Quran Arabic. Each row now owns its own. 'My Reports' is the row's
     label; 'Corrections' is the key the row and its screen both resolve. */
  'Data Sources':require('./assets/tool-icons/data-sources.png'),
  'Quran Reading':require('./assets/tool-icons/quran-reading.png'),
  Backup:require('./assets/tool-icons/backup.png'),
  Storage:require('./assets/tool-icons/storage.png'),
  Corrections:require('./assets/tool-icons/my-reports.png'),
  'My Reports':require('./assets/tool-icons/my-reports.png'),
  /* The biometric row on the Lock and PIN screen. It was showing the
     Privacy lock artwork because that is what both rows on that screen
     pointed at; this one now has its own. */
  'Biometric Unlock':require('./assets/tool-icons/biometric-unlock.png'),
    Language:require('./assets/tool-icons/language.png'),

  Theme: require('./assets/tool-icons/theme.png'),
};
/** The same icons, re-toned for the dark palette. */
const TOOL_IMAGES_DARK:Record<string,any>={
  'Qada Fasts':require('./assets/tool-icons/qada-fasts-dark.png'),
  'Cycle Tracker':require('./assets/tool-icons/cycle-dark.png'),
  'Hijri Calendar':require('./assets/tool-icons/hijri-dark.png'),
  'Prayer Reminders':require('./assets/tool-icons/prayer-reminders-dark.png'),
  Istihada:require('./assets/tool-icons/istihada-dark.png'),
  'Ramadan Planner':require('./assets/tool-icons/ramadan-planner-dark.png'),
  'These Days':require('./assets/tool-icons/these-days-dark.png'),

  Quran:require('./assets/tool-icons/quran-dark.png'),
  Qibla:require('./assets/tool-icons/qibla-dark.png'),
  Prayer:require('./assets/tool-icons/salah-guide-dark.png'),
  Tools:require('./assets/tool-icons/tab-tools-dark.png'),
  Pilgrimage:require('./assets/tool-icons/pilgrimage-dark.png'),
  'Umrah and Hajj':require('./assets/tool-icons/pilgrimage-dark.png'),
  Umrah:require('./assets/tool-icons/umrah-dark.png'),
  Hajj:require('./assets/tool-icons/hajj-dark.png'),
  'Holy site channels':require('./assets/tool-icons/holy-sites-dark.png'),
  'ritual-ihram':require('./assets/tool-icons/ritual-ihram-dark.png'),
  'ritual-tawaf':require('./assets/tool-icons/ritual-tawaf-dark.png'),
  'ritual-sai':require('./assets/tool-icons/ritual-sai-dark.png'),
  'ritual-arafat':require('./assets/tool-icons/ritual-arafat-dark.png'),
  'ritual-jamarat':require('./assets/tool-icons/ritual-jamarat-dark.png'),
  'ritual-mina':require('./assets/tool-icons/ritual-mina-dark.png'),
  'ritual-shave-or-trim-hair':require('./assets/tool-icons/ritual-shave-or-trim-hair-dark.png'),
  'pray-rakah':require('./assets/tool-icons/pray-rakah-dark.png'),
  Duas:require('./assets/tool-icons/duas-dark.png'),
  Tasbih:require('./assets/tool-icons/tasbih-dark.png'),
  Hijri:require('./assets/tool-icons/hijri-dark.png'),
  'Hijri calendar':require('./assets/tool-icons/hijri-dark.png'),
  Ramadan:require('./assets/tool-icons/ramadan-dark.png'),
  Hadith:require('./assets/tool-icons/hadith-dark.png'),
  Names:require('./assets/tool-icons/99-names-of-allah-dark.png'),
  'Prophet Names':require('./assets/tool-icons/prophet-names-dark.png'),
  'Muslim Names':require('./assets/tool-icons/muslim-names-dark.png'),
  'Adhkar':require('./assets/tool-icons/adhkar-dark.png'),
  '99 Names':require('./assets/tool-icons/99-names-of-allah-dark.png'),
  Zakat:require('./assets/tool-icons/zakat-dark.png'),
  Fasting:require('./assets/tool-icons/fasting-tracker-dark.png'),
  Location:require('./assets/tool-icons/location-dark.png'),
  Notifications:require('./assets/tool-icons/notifications-dark.png'),
  Adhan:require('./assets/tool-icons/adhan-dark.png'),
  'Morning Adhkar':require('./assets/tool-icons/morning-adhkar-dark.png'),
  'Evening Adhkar':require('./assets/tool-icons/evening-adhkar-dark.png'),
  Audio:require('./assets/tool-icons/audio-dark.png'),
  Downloads:require('./assets/tool-icons/downloads-dark.png'),
  'Worship guides':require('./assets/tool-icons/worship-guides-dark.png'),
  'Weekly Summary':require('./assets/tool-icons/weekly-summary-dark.png'),
  'Wudu Guide':require('./assets/tool-icons/wudu-guide-dark.png'),
  'Ghusl':require('./assets/tool-icons/ghusl-dark.png'),
  'Salah Guide':require('./assets/tool-icons/salah-guide-dark.png'),
  'Janazah Guide':require('./assets/tool-icons/janazah-guide-dark.png'),
  'Eid Prayer Guide':require('./assets/tool-icons/eid-guide-dark.png'),
  'Istikhara Guide':require('./assets/tool-icons/istikhara-guide-dark.png'),
  'Taraweeh Guide':require('./assets/tool-icons/taraweeh-guide-dark.png'),
  Shahada:require('./assets/tool-icons/shahada-dark.png'),
  'Ramadan Guide':require('./assets/tool-icons/ramadan-dark.png'),
  'Fasting Guide':require('./assets/tool-icons/fasting-guide-dark.png'),
  'Laylatul Qadr':require('./assets/tool-icons/laylatul-qadr-dark.png'),
  'Zakat al-Fitr':require('./assets/tool-icons/zakat-fitr-dark.png'),
  'Arabic Quran':require('./assets/tool-icons/quran-arabic-dark.png'),
  'Quran Arabic':require('./assets/tool-icons/quran-arabic-dark.png'),
  'English meaning':require('./assets/tool-icons/quran-english-dark.png'),
  Recitations:require('./assets/tool-icons/recitations-dark.png'),
  'Quran Audio':require('./assets/tool-icons/recitations-dark.png'),
  'Quran Search':require('./assets/tool-icons/quran-search-dark.png'),
  Translations:require('./assets/tool-icons/translations-dark.png'),
  Transliteration:require('./assets/tool-icons/transliteration-dark.png'),
  '30 Juz':require('./assets/tool-icons/juz-dark.png'),
  'Juz Directory':require('./assets/tool-icons/juz-dark.png'),
  Bookmarks:require('./assets/tool-icons/bookmarks-dark.png'),
  Notes:require('./assets/tool-icons/notes-dark.png'),
  'Reading Plans':require('./assets/tool-icons/reading-plans-dark.png'),
  Hifz:require('./assets/tool-icons/hifz-dark.png'),
  'Reader Settings':require('./assets/tool-icons/reader-settings-dark.png'),
  Tafsir:require('./assets/tool-icons/tafsir-dark.png'),
  'Translation Compare':require('./assets/tool-icons/translation-compare-dark.png'),
  'Offline Quran':require('./assets/tool-icons/offline-quran-dark.png'),
  'Quran Preload':require('./assets/tool-icons/offline-quran-dark.png'),
  'Mushaf Pages':require('./assets/tool-icons/mushaf-pages-dark.png'),
  '60 Hizb':require('./assets/tool-icons/hizb-dark.png'),
  'Quran Topics':require('./assets/tool-icons/quran-topics-dark.png'),
  'Quran Vocabulary':require('./assets/tool-icons/quran-vocabulary-dark.png'),
  Tajweed:require('./assets/tool-icons/tajweed-dark.png'),
  'Women’s worship':require('./assets/tool-icons/womens-area-dark.png'),
  Cycle:require('./assets/tool-icons/cycle-dark.png'),
  Purity:require('./assets/tool-icons/purity-dark.png'),
  'Qada fasts':require('./assets/tool-icons/qada-fasts-dark.png'),
  'Sadaqah':require('./assets/tool-icons/sadaqah-dark.png'),
  'Qada Prayer':require('./assets/tool-icons/qada-prayer-dark.png'),
  'Qada Prayers':require('./assets/tool-icons/qada-prayer-dark.png'),
  'Journal':require('./assets/tool-icons/journal-dark.png'),
  'Khatam':require('./assets/tool-icons/khatam-dark.png'),
  Juz:require('./assets/tool-icons/juz-dark.png'),
  Hizb:require('./assets/tool-icons/hizb-dark.png'),
  Topics:require('./assets/tool-icons/quran-topics-dark.png'),
  Vocab:require('./assets/tool-icons/quran-vocabulary-dark.png'),
  'Sunnah Prayers':require('./assets/tool-icons/sunnah-prayers-dark.png'),
  'Privacy lock':require('./assets/tool-icons/privacy-lock-dark.png'),
  'Umrah Resources':require('./assets/tool-icons/umrah-resources-dark.png'),
  'Madinah Live':require('./assets/tool-icons/madinah-live-dark.png'),
  'Makkah Live':require('./assets/tool-icons/makkah-live-dark.png'),
  'Salah Tracker':require('./assets/tool-icons/salah-tracker-dark.png'),
  'Data Sources':require('./assets/tool-icons/data-sources-dark.png'),
  'Quran Reading':require('./assets/tool-icons/quran-reading-dark.png'),
  Backup:require('./assets/tool-icons/backup-dark.png'),
  Storage:require('./assets/tool-icons/storage-dark.png'),
  Corrections:require('./assets/tool-icons/my-reports-dark.png'),
  'My Reports':require('./assets/tool-icons/my-reports-dark.png'),
  'Biometric Unlock':require('./assets/tool-icons/biometric-unlock-dark.png'),
    Language:require('./assets/tool-icons/language-dark.png'),

  Theme: require('./assets/tool-icons/theme-dark.png'),
};
/* The five drawn for the Palestine theme, so far. Chosen by theme below
   rather than swapped into the maps above: the two sets are kept apart, and
   replacing the shared art would change the Islamic theme's drawings too.

   Khatam, Juz and Hizb carry no art in the shared maps - they fall through to
   the generic glyph there, and always have. That is left as it is: filling
   those in is a drawing for that theme, not a substitution of this one. */
const TOOL_IMAGES_PALESTINE: Record<string, any> = {
  Vocab: require('./assets/tool-icons/vocab-palestine.png'),
  Transliteration: require('./assets/tool-icons/transliteration-palestine.png'),
  Topics: require('./assets/tool-icons/topics-palestine.png'),
  Tajweed: require('./assets/tool-icons/tajweed-palestine.png'),
  Tafsir: require('./assets/tool-icons/tafsir-palestine.png'),
  Khatam: require('./assets/tool-icons/khatam-palestine.png'),
  Juz: require('./assets/tool-icons/juz-palestine.png'),
  Hizb: require('./assets/tool-icons/hizb-palestine.png'),
  Audio: require('./assets/tool-icons/audio-palestine.png'),
  /* The Quran screen's reading-preferences card. Its key carries a space, so
     it is quoted here while the single-word ones above are not. */
  'Reader Settings': require('./assets/tool-icons/reader-settings-palestine.png'),
  /* The Quran screen's second preference card. It is reached under the key
     'Translations' but the row reads 'Translation', singular, because that is
     what it changes — one edition, not several. */
  Translations: require('./assets/tool-icons/translations-palestine.png'),
  /* The library cards. These are looked up by the title the card shows, not
     by a tool name, so the keys are the titles. The Beautiful Names is
     reached under two of them — 'Names' on its own screen and '99 Names' in
     the library list — and both point at the one drawing. */
  Hadith: require('./assets/tool-icons/hadith-palestine.png'),
  Duas: require('./assets/tool-icons/duas-palestine.png'),
  'Muslim Names': require('./assets/tool-icons/muslim-names-palestine.png'),
  'Prophet Names': require('./assets/tool-icons/prophet-names-palestine.png'),
  '99 Names': require('./assets/tool-icons/99-names-of-allah-palestine.png'),
  Names: require('./assets/tool-icons/99-names-of-allah-palestine.png'),
  /* Adhkar, Ramadan and Shahada. Ramadan is asked for under two keys: the
     library card, and 'Ramadan Guide' in the worship guides, which has
     always shared the one drawing with it. */
  Adhkar: require('./assets/tool-icons/adhkar-palestine.png'),
  Ramadan: require('./assets/tool-icons/ramadan-palestine.png'),
  'Ramadan Guide': require('./assets/tool-icons/ramadan-palestine.png'),
  Shahada: require('./assets/tool-icons/shahada-palestine.png'),
  /* The worship guides card. Spoken of in the singular on the card that opens
     them and in the plural in the key that looks the drawing up, so the key
     carries the plural to match every other title-keyed card. */
  'Worship guides': require('./assets/tool-icons/worship-guides-palestine.png'),
  /* The Quran study row: bookmarks, memorisation, notes, reading plans and
     the offline copy. Palestine art for the five. */
  Bookmarks: require('./assets/tool-icons/bookmarks-palestine.png'),
  Hifz: require('./assets/tool-icons/hifz-palestine.png'),
  Notes: require('./assets/tool-icons/notes-palestine.png'),
  'Reading Plans': require('./assets/tool-icons/reading-plans-palestine.png'),
  /* Offline Quran and Quran Preload have always shared one drawing, and they
     keep sharing this one: the two rows are the same screen reached from
     different places, so they should not drift apart. */
  'Offline Quran': require('./assets/tool-icons/offline-quran-palestine.png'),
  'Quran Preload': require('./assets/tool-icons/offline-quran-palestine.png'),

  /* The five worship guides. They carry no Palestine art of their own until
     now, so in this theme they fell through to the shared drawing — which
     meant the guides looked like they belonged to another theme while every
     row around them did not. */
  'Wudu Guide': require('./assets/tool-icons/wudu-guide-palestine.png'),
  'Ghusl': require('./assets/tool-icons/ghusl-palestine.png'),
  'Salah Guide': require('./assets/tool-icons/salah-guide-palestine.png'),
  'Janazah Guide': require('./assets/tool-icons/janazah-guide-palestine.png'),
  'Istikhara Guide': require('./assets/tool-icons/istikhara-guide-palestine.png'),
  /* The five Ramadan and Eid guides. Until now these had no Palestine art
     of their own and fell back to the Islamic drawing, so they read as
     out of place beside neighbours that did have it. */
  'Eid Prayer Guide': require('./assets/tool-icons/eid-guide-palestine.png'),
  'Fasting Guide': require('./assets/tool-icons/fasting-guide-palestine.png'),
  'Laylatul Qadr': require('./assets/tool-icons/laylatul-qadr-palestine.png'),
  'Taraweeh Guide': require('./assets/tool-icons/taraweeh-guide-palestine.png'),
  'Zakat al-Fitr': require('./assets/tool-icons/zakat-fitr-palestine.png'),

  /* The daily-practice tools: the fasting ledger, the salah log, the prayers
     one owes, and the two pilgrimages. These five had no Palestine art and
     fell through to the shared drawing, so on the tools grid — where every
     other card carried it — they were the ones that looked out of place.
     Qada Prayer is asked for under both spellings, singular on its own screen
     and plural on the library card, and both point at the one drawing. */
  Fasting: require('./assets/tool-icons/fasting-tracker-palestine.png'),
  'Salah Tracker': require('./assets/tool-icons/salah-tracker-palestine.png'),
  'Qada Prayer': require('./assets/tool-icons/qada-prayer-palestine.png'),
  'Qada Prayers': require('./assets/tool-icons/qada-prayer-palestine.png'),
  Umrah: require('./assets/tool-icons/umrah-palestine.png'),
  Hajj: require('./assets/tool-icons/hajj-palestine.png'),

  /* The rite-by-rite drawings the Umrah and Hajj journeys put beside each
     step. These are keyed by icon name rather than by screen title, which is
     why they are quoted lowercase here while the cards above are not. Tawaf
     arrived with only its dark drawing and was left out until the light one
     turned up, so that it would not be Palestinian in one theme and Islamic
     in the other; both halves are here now. */
  'ritual-ihram': require('./assets/tool-icons/ritual-ihram-palestine.png'),
  'ritual-tawaf': require('./assets/tool-icons/ritual-tawaf-palestine.png'),
  'ritual-sai': require('./assets/tool-icons/ritual-sai-palestine.png'),
  'ritual-arafat': require('./assets/tool-icons/ritual-arafat-palestine.png'),
  'ritual-jamarat': require('./assets/tool-icons/ritual-jamarat-palestine.png'),
  'ritual-mina': require('./assets/tool-icons/ritual-mina-palestine.png'),
  'ritual-shave-or-trim-hair': require('./assets/tool-icons/ritual-shave-or-trim-hair-palestine.png'),
  'pray-rakah': require('./assets/tool-icons/pray-rakah-palestine.png'),

  /* The places the calendar, the language and the compass are reached from.
     Hijri is asked for under three keys and all three point at one drawing:
     'Hijri' on the tools grid, and both spellings of the calendar screen. */
  Hijri: require('./assets/tool-icons/hijri-palestine.png'),
  'Hijri calendar': require('./assets/tool-icons/hijri-palestine.png'),
  'Hijri Calendar': require('./assets/tool-icons/hijri-palestine.png'),
  Language: require('./assets/tool-icons/language-palestine.png'),
  Location: require('./assets/tool-icons/location-palestine.png'),
  'Prayer Reminders': require('./assets/tool-icons/prayer-reminders-palestine.png'),
  Qibla: require('./assets/tool-icons/qibla-palestine.png'),
  'Umrah Resources': require('./assets/tool-icons/umrah-resources-palestine.png'),
  'Weekly Summary': require('./assets/tool-icons/weekly-summary-palestine.png'),

  /* Giving, dhikr, the voluntary prayers and the private journal. Zakat here
     is the calculator on the tools grid; 'Zakat al-Fitr' further up is the
     Ramadan guide, and the two are different screens with different art, so
     they deliberately do not share a drawing. */
  Zakat: require('./assets/tool-icons/zakat-palestine.png'),
  Sadaqah: require('./assets/tool-icons/sadaqah-palestine.png'),
  Tasbih: require('./assets/tool-icons/tasbih-palestine.png'),
  'Sunnah Prayers': require('./assets/tool-icons/sunnah-prayers-palestine.png'),
  Journal: require('./assets/tool-icons/journal-palestine.png'),

  'Cycle Tracker': require('./assets/tool-icons/cycle-palestine.png'),
  Istihada: require('./assets/tool-icons/istihada-palestine.png'),
  'Qada Fasts': require('./assets/tool-icons/qada-fasts-palestine.png'),
  'Quran Reading': require('./assets/tool-icons/quran-reading-palestine.png'),
  'Ramadan Planner': require('./assets/tool-icons/ramadan-planner-palestine.png'),
  Storage: require('./assets/tool-icons/storage-palestine.png'),
  Theme: require('./assets/tool-icons/theme-palestine.png'),
  'These Days': require('./assets/tool-icons/these-days-palestine.png'),
  'Women’s worship': require('./assets/tool-icons/womens-area-palestine.png'),

  'Data Sources': require('./assets/tool-icons/data-sources-palestine.png'),
  'Privacy lock': require('./assets/tool-icons/privacy-lock-palestine.png'),
  'Makkah Live': require('./assets/tool-icons/makkah-live-palestine.png'),
  'Madinah Live': require('./assets/tool-icons/madinah-live-palestine.png'),
  'My Reports': require('./assets/tool-icons/my-reports-palestine.png'),
  Backup: require('./assets/tool-icons/backup-palestine.png'),

};
const TOOL_IMAGES_PALESTINE_DARK: Record<string, any> = {
  Vocab: require('./assets/tool-icons/vocab-dark-palestine.png'),
  Transliteration: require('./assets/tool-icons/transliteration-dark-palestine.png'),
  Topics: require('./assets/tool-icons/topics-dark-palestine.png'),
  Tajweed: require('./assets/tool-icons/tajweed-dark-palestine.png'),
  Tafsir: require('./assets/tool-icons/tafsir-dark-palestine.png'),
  Khatam: require('./assets/tool-icons/khatam-dark-palestine.png'),
  Juz: require('./assets/tool-icons/juz-dark-palestine.png'),
  Hizb: require('./assets/tool-icons/hizb-dark-palestine.png'),
  Audio: require('./assets/tool-icons/audio-dark-palestine.png'),
  'Reader Settings': require('./assets/tool-icons/reader-settings-dark-palestine.png'),
  Translations: require('./assets/tool-icons/translations-dark-palestine.png'),
  Hadith: require('./assets/tool-icons/hadith-dark-palestine.png'),
  Duas: require('./assets/tool-icons/duas-dark-palestine.png'),
  'Muslim Names': require('./assets/tool-icons/muslim-names-dark-palestine.png'),
  'Prophet Names': require('./assets/tool-icons/prophet-names-dark-palestine.png'),
  '99 Names': require('./assets/tool-icons/99-names-of-allah-dark-palestine.png'),
  Names: require('./assets/tool-icons/99-names-of-allah-dark-palestine.png'),
  Adhkar: require('./assets/tool-icons/adhkar-dark-palestine.png'),
  Ramadan: require('./assets/tool-icons/ramadan-dark-palestine.png'),
  'Ramadan Guide': require('./assets/tool-icons/ramadan-dark-palestine.png'),
  Shahada: require('./assets/tool-icons/shahada-dark-palestine.png'),
  'Worship guides': require('./assets/tool-icons/worship-guides-dark-palestine.png'),
  /* The same five, in the dark Palestine set. */
  Bookmarks: require('./assets/tool-icons/bookmarks-dark-palestine.png'),
  Hifz: require('./assets/tool-icons/hifz-dark-palestine.png'),
  Notes: require('./assets/tool-icons/notes-dark-palestine.png'),
  'Reading Plans': require('./assets/tool-icons/reading-plans-dark-palestine.png'),
  'Offline Quran': require('./assets/tool-icons/offline-quran-dark-palestine.png'),
  'Quran Preload': require('./assets/tool-icons/offline-quran-dark-palestine.png'),

  /* The five worship guides. They carry no Palestine art of their own until
     now, so in this theme they fell through to the shared drawing — which
     meant the guides looked like they belonged to another theme while every
     row around them did not. */
  'Wudu Guide': require('./assets/tool-icons/wudu-guide-dark-palestine.png'),
  'Ghusl': require('./assets/tool-icons/ghusl-dark-palestine.png'),
  'Salah Guide': require('./assets/tool-icons/salah-guide-dark-palestine.png'),
  'Janazah Guide': require('./assets/tool-icons/janazah-guide-dark-palestine.png'),
  'Istikhara Guide': require('./assets/tool-icons/istikhara-guide-dark-palestine.png'),
  /* The five Ramadan and Eid guides. Until now these had no Palestine art
     of their own and fell back to the Islamic drawing, so they read as
     out of place beside neighbours that did have it. */
  'Eid Prayer Guide': require('./assets/tool-icons/eid-guide-dark-palestine.png'),
  'Fasting Guide': require('./assets/tool-icons/fasting-guide-dark-palestine.png'),
  'Laylatul Qadr': require('./assets/tool-icons/laylatul-qadr-dark-palestine.png'),
  'Taraweeh Guide': require('./assets/tool-icons/taraweeh-guide-dark-palestine.png'),
  'Zakat al-Fitr': require('./assets/tool-icons/zakat-fitr-dark-palestine.png'),

  /* The same five daily-practice tools, in the dark Palestine set. */
  Fasting: require('./assets/tool-icons/fasting-tracker-dark-palestine.png'),
  'Salah Tracker': require('./assets/tool-icons/salah-tracker-dark-palestine.png'),
  'Qada Prayer': require('./assets/tool-icons/qada-prayer-dark-palestine.png'),
  'Qada Prayers': require('./assets/tool-icons/qada-prayer-dark-palestine.png'),
  Umrah: require('./assets/tool-icons/umrah-dark-palestine.png'),
  Hajj: require('./assets/tool-icons/hajj-dark-palestine.png'),

  /* The same journey steps, in the dark Palestine set. */
  'ritual-ihram': require('./assets/tool-icons/ritual-ihram-dark-palestine.png'),
  'ritual-tawaf': require('./assets/tool-icons/ritual-tawaf-dark-palestine.png'),
  'ritual-sai': require('./assets/tool-icons/ritual-sai-dark-palestine.png'),
  'ritual-arafat': require('./assets/tool-icons/ritual-arafat-dark-palestine.png'),
  'ritual-jamarat': require('./assets/tool-icons/ritual-jamarat-dark-palestine.png'),
  'ritual-mina': require('./assets/tool-icons/ritual-mina-dark-palestine.png'),
  'ritual-shave-or-trim-hair': require('./assets/tool-icons/ritual-shave-or-trim-hair-dark-palestine.png'),
  'pray-rakah': require('./assets/tool-icons/pray-rakah-dark-palestine.png'),

  /* The same seven, in the dark Palestine set. */
  Hijri: require('./assets/tool-icons/hijri-dark-palestine.png'),
  'Hijri calendar': require('./assets/tool-icons/hijri-dark-palestine.png'),
  'Hijri Calendar': require('./assets/tool-icons/hijri-dark-palestine.png'),
  Language: require('./assets/tool-icons/language-dark-palestine.png'),
  Location: require('./assets/tool-icons/location-dark-palestine.png'),
  'Prayer Reminders': require('./assets/tool-icons/prayer-reminders-dark-palestine.png'),
  Qibla: require('./assets/tool-icons/qibla-dark-palestine.png'),
  'Umrah Resources': require('./assets/tool-icons/umrah-resources-dark-palestine.png'),
  'Weekly Summary': require('./assets/tool-icons/weekly-summary-dark-palestine.png'),

  /* The same five, in the dark Palestine set. */
  Zakat: require('./assets/tool-icons/zakat-dark-palestine.png'),
  Sadaqah: require('./assets/tool-icons/sadaqah-dark-palestine.png'),
  Tasbih: require('./assets/tool-icons/tasbih-dark-palestine.png'),
  'Sunnah Prayers': require('./assets/tool-icons/sunnah-prayers-dark-palestine.png'),
  Journal: require('./assets/tool-icons/journal-dark-palestine.png'),

  'Cycle Tracker': require('./assets/tool-icons/cycle-dark-palestine.png'),
  Istihada: require('./assets/tool-icons/istihada-dark-palestine.png'),
  'Qada Fasts': require('./assets/tool-icons/qada-fasts-dark-palestine.png'),
  'Quran Reading': require('./assets/tool-icons/quran-reading-dark-palestine.png'),
  'Ramadan Planner': require('./assets/tool-icons/ramadan-planner-dark-palestine.png'),
  Storage: require('./assets/tool-icons/storage-dark-palestine.png'),
  Theme: require('./assets/tool-icons/theme-dark-palestine.png'),
  'These Days': require('./assets/tool-icons/these-days-dark-palestine.png'),
  'Women’s worship': require('./assets/tool-icons/womens-area-dark-palestine.png'),

  'Data Sources': require('./assets/tool-icons/data-sources-dark-palestine.png'),
  'Privacy lock': require('./assets/tool-icons/privacy-lock-dark-palestine.png'),
  'Makkah Live': require('./assets/tool-icons/makkah-live-dark-palestine.png'),
  'Madinah Live': require('./assets/tool-icons/madinah-live-dark-palestine.png'),
  'My Reports': require('./assets/tool-icons/my-reports-dark-palestine.png'),
  Backup: require('./assets/tool-icons/backup-dark-palestine.png'),

};
/**
 * The drawing for a tool, in the theme that is showing.
 *
 * Kept here rather than written out wherever an icon is drawn. Reaching for
 * TOOL_IMAGES and TOOL_IMAGES_DARK directly looks right and is not: it drops
 * every theme that keeps art of its own, which is how both the App language
 * row and the Quran stat row came to ignore Palestine while their neighbours
 * followed it. A name the theme's set does not hold falls back to the shared
 * art, so the Islamic theme keeps every drawing it has.
 */
function toolImage(tool: string, dark: boolean, resolved: string) {
  const themed =
    resolved === 'palestineDark' ? TOOL_IMAGES_PALESTINE_DARK
      : resolved === 'palestineLight' ? TOOL_IMAGES_PALESTINE
        : null;
  const shared = dark ? (TOOL_IMAGES_DARK[tool] || TOOL_IMAGES[tool]) : TOOL_IMAGES[tool];
  return (themed && themed[tool]) || shared;
}

function ToolGraphic({tool,size=64}:{tool:string;size?:number}){const{dark,resolved}=useTheme();
  const image=toolImage(tool,dark,resolved);const enter=useRef(new Animated.Value(.78)).current;const fade=useRef(new Animated.Value(0)).current;useEffect(()=>{Animated.parallel([Animated.spring(enter,{toValue:1,friction:6,tension:75,useNativeDriver:true}),Animated.timing(fade,{toValue:1,duration:350,useNativeDriver:true})]).start()},[]);return <Animated.View accessibilityElementsHidden style={[s.graphicFrame,{width:size,height:size,opacity:fade,transform:[{scale:enter}]}]}>{image?<Image source={image} resizeMode="contain" style={{width:size-6,height:size-6}}/>:ico('sparkles-outline',size*.48,C.green)}</Animated.View>}
/** Hadith bodies arrive with markup; the card shows them as plain text. */
const stripTags=(value:string)=>value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const plainTajweed=(value:string)=>value.replace(/\[([a-z])(?::\d+)?\[([^\]]*)\]/g,'$2');
function TajweedText({text,style}:{text:string;style?:any}){const parts:React.ReactNode[]=[];const regex=/\[([a-z])(?::\d+)?\[([^\]]*)\]/g;let cursor=0;let match:RegExpExecArray|null;while((match=regex.exec(text))){if(match.index>cursor)parts.push(text.slice(cursor,match.index));const rule=TAJWEED_RULES.find(item=>item.codes.includes(match![1]));parts.push(<Text key={`${match.index}-${match[1]}`} style={{color:rule?.color||C.ink}}>{match[2]}</Text>);cursor=regex.lastIndex}if(cursor<text.length)parts.push(text.slice(cursor));return <Text accessibilityLabel={plainTajweed(text)} style={style}>{parts}</Text>}
/**
 * A card with depth.
 *
 * Sitting on the surface rather than drawn on it: a wide ambient shadow under
 * it, a hairline of light along its top edge, and a press that pushes it into
 * the surface instead of merely shrinking it.
 *
 * Two rules keep this cheap. Only opacity and transform animate, so the native
 * thread owns every frame. And the whole thing collapses to a still card when
 * the device asks for reduced motion, because that check lives in the hooks
 * rather than here.
 */
function DepthCard({ children, onPress, style, cardStyle, bodyStyle, radius = RADIUS.xl, index = 0, delay = 0, padded = true, testID, gradient }: any) {
  const press = usePressDepth();
  const enter = useEntrance(index, delay);
  return <Animated.View style={[style, { opacity: enter.opacity, transform: [{ translateY: enter.translateY }] }]}>
    <Animated.View style={[s.depthCard, cardStyle, { borderRadius: radius, transform: [{ scale: press.scale }, { translateY: press.lift }] }]}>
      {!!gradient && <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[s.depthGradient, { borderRadius: radius }]} />}
      <Pressable testID={testID} onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut}
        style={[s.depthBody, { borderRadius: radius }, padded && { padding: CARD.padding }, bodyStyle]}>
        {children}
      </Pressable>
      <Animated.View pointerEvents="none" style={[s.depthVeil, { borderRadius: radius, opacity: press.veil }]} />
    </Animated.View>
  </Animated.View>;
}

/* `contentStyle` lands on the inner Pressable rather than the outer animated
   view. It is optional and unset everywhere by default, because the inner
   view is a plain column with no alignment of its own and most callers are
   happy with that. A caller whose children should be centred — rather than
   stretched to the width of whichever child happens to be widest — asks for
   it here. */
/**
 * A pressable surface that also arrives.
 *
 * Press depth was already here; the entrance is new. Passing `index` staggers
 * a row or a grid, so a screen assembles itself from the top down instead of
 * appearing all at once. Leaving it off gives the plain entrance, which is
 * right for a card that is on its own.
 *
 * The stagger is capped inside `useEntrance`, so a list of forty arrives as a
 * wave across the first few and then all together, rather than taking two
 * seconds to finish crossing the screen.
 */
function MotionPress({ children, onPress, onLongPress, style, contentStyle, testID, accessibilityLabel, index, delay = 0 }: { children: React.ReactNode; onPress?: () => void; onLongPress?: () => void; style?: any; contentStyle?: any; testID?: string; accessibilityLabel?: string; index?: number; delay?: number }) {
  const press = usePressDepth();
  const enter = useEntrance(index ?? 0, delay);
  /* Opt in by passing `index`. A card in a grid wants to arrive; a button
     that stays put while you page through onboarding does not, and animating
     it would mean it re-arrived on every step. */
  const reveal = index === undefined ? null : { opacity: enter.opacity, transform: [{ scale: press.scale }, { translateY: enter.translateY }] };
  return <Animated.View style={[style, reveal ?? { transform: [{ scale: press.scale }] }]}><Pressable testID={testID} accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityLabel?'button':undefined} onPress={onPress} onLongPress={onLongPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={contentStyle}>{children}</Pressable></Animated.View>;
}

/**
 * How every vertical list in the app scrolls.
 *
 * Three small things, chosen once so the lists agree with each other:
 *
 * - The indicator is hidden. Most of these lists already hid it, and a system
 *   scrollbar sitting on top of a designed screen was only ever an
 *   inconsistency between one screen and the next.
 * - `handled` means a tap on a control acts, instead of the first tap only
 *   dismissing the keyboard and a second one doing the work.
 * - Android's over-scroll glow is switched off. It is `undefined` everywhere
 *   else so the prop is dropped rather than landing on a web DOM node, which
 *   does not understand it.
 */
const SCROLL = {
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: 'handled' as const,
  overScrollMode: Platform.OS === 'android' ? ('never' as const) : undefined,
};

function Page({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions(); const {rtl,language}=useLanguage();
  const audio=useAudio();
  const playerInset = audio.track ? (Platform.OS==='ios'?96:MINI_PLAYER_INSET) : 0;
  const enter = useEntrance();
  return <SafeAreaView style={[s.safe,{direction:shellDirection(rtl)} as any]}><Animated.View style={[s.page,width > 700 && s.pageWide,{direction:shellDirection(rtl),paddingBottom:playerInset} as any,{opacity:enter.opacity,transform:[{translateY:enter.translateY}]}]}>{children}</Animated.View></SafeAreaView>;
}
function Spinner() { const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);return <View style={s.loading}><ActivityIndicator color={C.green} /><Text style={s.loadingText}>{T('Loading live data…')}</Text></View>; }

/* ==================== Skeleton ==================== */

/**
 * Loading placeholders.
 *
 * A spinner answers "is anything happening?" and nothing else: it does not
 * say what is coming, how much of it, or where on the screen it will land, so
 * a screen goes from empty to full in one jump. A skeleton is shaped like the
 * content that is on its way, so the screen keeps its shape while it fills and
 * the reader already knows where to look when it does.
 *
 * Spinners are still right where there is no shape to stand in for - a button
 * that is working, audio that is buffering, a bar showing real progress - and
 * those are left alone.
 */

/**
 * The sweep, shared by every placeholder on screen.
 *
 * One animation rather than one per block: they have to travel together or the
 * screen flickers like broken glass, and a dozen loops where one will do is
 * wasted work on a phone. Each shape still sweeps across its own width, so a
 * short line and a wide card finish together rather than one racing ahead.
 */
const ShimmerContext = createContext<Animated.Value | null>(null);

function SkeletonProvider({ children }: { children: React.ReactNode }) {
  const still = useCalmMotion();
  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) { sweep.setValue(0.5); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, { toValue: 1, duration: 1150, easing: Easing.linear, useNativeDriver: true }),
        Animated.delay(420),
        Animated.timing(sweep, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [still, sweep]);
  return <ShimmerContext.Provider value={sweep}>{children}</ShimmerContext.Provider>;
}

/**
 * A single placeholder block.
 *
 * Measures itself rather than guessing: the sweep has to travel exactly its
 * own width, and these are asked for in percentages and flexible widths that
 * are not known until layout.
 */
function Shimmer({ width = '100%', height = 14, radius = 7, style }: {
  width?: number | string; height?: number; radius?: number; style?: any;
}) {
  const still = useCalmMotion();
  const sweep = useContext(ShimmerContext);
  const [w, setW] = useState(0);
  const translate = sweep
    ? sweep.interpolate({ inputRange: [0, 1], outputRange: [-Math.max(w, 1), Math.max(w, 1)] })
    : null;

  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[{ width, height, borderRadius: radius, backgroundColor: C.skeleton, overflow: 'hidden' }, style]}
    >
      {!still && w > 0 && translate ? (
        <Animated.View style={{ width: '100%', height: '100%', transform: [{ translateX: translate }] }}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', C.skeletonSweep, 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** A line of text. Trailing lines are shorter, the way a paragraph ends. */
function SkeletonLine({ width = '100%', height = 13 }: { width?: number | string; height?: number }) {
  return <Shimmer width={width} height={height} radius={height / 2} />;
}

/** A block of copy, as a paragraph. */
function SkeletonParagraph({ lines = 3, gap = 9 }: { lines?: number; gap?: number }) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '62%' : '100%'} />
      ))}
    </View>
  );
}

/**
 * A list row: a leading tile, a title and a line under it.
 *
 * This is the shape most of the app's lists share, from hadith to names to
 * saved verses, so it is the one worth getting right.
 */
function SkeletonRow({ tile = 44, lines = 2 }: { tile?: number; lines?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
      <Shimmer width={tile} height={tile} radius={tile / 2} />
      <View style={{ flex: 1, gap: 8 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} width={i === lines - 1 ? '55%' : '88%'} />
        ))}
      </View>
    </View>
  );
}

/** A list of rows, separated the way the real list separates them. */
function SkeletonList({ rows = 5, tile = 44, lines = 2 }: { rows?: number; tile?: number; lines?: number }) {
  return (
    <View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i}>
          <SkeletonRow tile={tile} lines={lines} />
          {i < rows - 1 ? <View style={{ height: 1, backgroundColor: C.line, opacity: 0.5 }} /> : null}
        </View>
      ))}
    </View>
  );
}

/** A card: a heading, a body, and a row of small details under it. */
function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: C.line, padding: 16, gap: 12 }}>
      <SkeletonLine width="42%" height={16} />
      <SkeletonParagraph lines={lines} />
    </View>
  );
}

/** A grid of square tiles, as the Tools and Library screens lay theirs out. */
function SkeletonGrid({ tiles = 6, columns = 2, height = 108 }: { tiles?: number; columns?: number; height?: number }) {
  const rows = Math.ceil(tiles / columns);
  return (
    <View style={{ gap: CARD_GAP }}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: CARD_GAP }}>
          {Array.from({ length: columns }).map((_, c) => (
            <View
              key={c}
              style={{ flex: 1, backgroundColor: C.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: C.line, padding: 14, gap: 10, height }}
            >
              <Shimmer width={38} height={38} radius={19} />
              <SkeletonLine width="70%" height={12} />
              <SkeletonLine width="90%" height={10} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** A wall of small squares, as the tracker lays out its days. */
function SkeletonSquares({ rows = 6, columns = 10, size = 26, gap = 6 }: {
  rows?: number; columns?: number; size?: number; gap?: number;
}) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {Array.from({ length: columns }).map((_, c) => (
            <Shimmer key={c} width={size} height={size} radius={6} />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * The stand-in for a screen whose content has not arrived.
 *
 * Falls back to this shape when a screen does not name one, so a new screen
 * gets something reasonable without having to ask.
 */
function SkeletonScreen({ rows = 6 }: { rows?: number }) {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <SkeletonLine width="46%" height={20} />
      <SkeletonList rows={rows} />
    </View>
  );
}

function ErrorState({ message, retry }: { message: string; retry?: () => void }) { const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);return <View style={s.error}><View style={s.errorIcon}>{ico('cloud-offline-outline', 24, C.coral)}</View><Text style={s.errorTitle}>{T('Couldn’t load live data')}</Text><Text style={s.errorText}>{message}</Text>{retry && <Tactile onPress={retry} style={s.retry}><Text style={s.retryText}>{T('Try again')}</Text></Tactile>}</View>; }
function TopBar({ overline, title, right }: { overline?: string; title: string; right?: React.ReactNode }) { return <View style={s.topbar}><View><Text style={s.overline}>{overline}</Text><Text style={s.h1}>{title}</Text></View>{right}</View>; }
/**
 * The header shared by the five tab roots: the mark, the name, and the two
 * actions that make sense wherever you are.
 *
 * Only the landing screen of each tab carries it. Screens you push into keep
 * their own TopBar, so the back button and the screen title stay where people
 * expect them, and the header never competes with a title for the top line.
 */
/**
 * The three header actions, in the generated icon set rather than the SVG
 * glyph set, so the header matches the rest of the app. The theme action is
 * a single sun-and-moon toggle drawn in the variant for the theme it appears
 * against, rather than swapping between a moon and a sun.
 */
/**
 * The three header buttons, in all four versions.
 *
 * Named for what the theme needs rather than for the files they happen to
 * come from, so the Palestine set can be swapped without touching the
 * Islamic one — which is the whole point of keeping them apart.
 */
const HEADER_LIGHT = {
  notifications: require('./assets/tool-icons/notifications.png'),
  theme: require('./assets/tool-icons/theme-switch.png'),
  settings: require('./assets/tool-icons/settings.png')
};
const HEADER_DARK = {
  notifications: require('./assets/tool-icons/notifications-dark.png'),
  theme: require('./assets/tool-icons/theme-switch-dark.png'),
  settings: require('./assets/tool-icons/settings-dark.png')
};
const HEADER_PALESTINE = {
  notifications: require('./assets/tool-icons/header-notifications-palestine.png'),
  theme: require('./assets/tool-icons/header-theme-palestine.png'),
  settings: require('./assets/tool-icons/header-settings-palestine.png')
};
const HEADER_PALESTINE_DARK = {
  notifications: require('./assets/tool-icons/header-notifications-palestine-dark.png'),
  theme: require('./assets/tool-icons/header-theme-palestine-dark.png'),
  settings: require('./assets/tool-icons/header-settings-palestine-dark.png')
};

const headerIcons = (resolved: ResolvedTheme) =>
  isPal(resolved)
    ? (resolved === 'palestineDark' ? HEADER_PALESTINE_DARK : HEADER_PALESTINE)
    : (resolved === 'islamicDark' ? HEADER_DARK : HEADER_LIGHT);

/**
 * Whether there is somewhere to go back to from here.
 *
 * Deliberately narrower than the navigator's own canGoBack, which is also
 * true when the last thing that happened was a change of tab. A tab is not
 * somewhere you came *from* - the tab bar is how you leave one - so only the
 * stacks count. Without that, every root screen grew a back arrow the moment
 * you visited another tab.
 *
 * Read on focus rather than once, because a screen can be pushed onto a stack
 * that was already on screen and the answer changes underneath the header.
 */
function useCanGoBack() {
  const navigation = useNavigation<any>();
  const [can, setCan] = useState(false);
  useFocusEffect(useCallback(() => {
    let alive = true;
    const read = () => {
      let found = false;
      try {
        const walk = (state: any) => {
          if (!state || !state.routes) return;
          if (state.type === 'stack' && (state.index || 0) > 0) found = true;
          const focused = state.routes[state.index || 0];
          if (focused && focused.state) walk(focused.state);
        };
        walk((navigationRef as any).getRootState?.() ?? navigation.getState?.());
      } catch { /* the navigator is not ready yet */ }
      if (alive) setCan(found);
    };
    read();
    const settle = setTimeout(read, 60); /* after the push has settled */
    return () => { alive = false; clearTimeout(settle); };
  }, [navigation]));
  return can;
}

/**
 * Opens the notification settings from the header.
 *
 * This goes through the root ref rather than the screen's own `navigation`.
 * The header is worn by screens in several different stacks, and from inside
 * one of them a nested navigate has to bubble up to the tab navigator to be
 * understood - which works until the tab has just been reset, and then
 * quietly does nothing. Starting from the root resolves top-down instead, so
 * it lands the same way whichever screen the header is on.
 */
function openNotifications() {
  navigateWhenReady('Inbox');
}
function AppHeader() {
  const { rtl , language }=useLanguage();
  const { dark, setMode, resolved } = useTheme();
  const navigation = useNavigation<any>();
  const T = (text: string) => tx(language, text);
  const header = headerIcons(resolved);
  /* Six screens wear this header, and some of them are reached by pushing
     onto a stack. Without this the only way out of those was the tab bar. */
  const canGoBack = useCanGoBack();
  return <View style={s.appHeader}>
    {canGoBack
      ? <IconButton name={rtl ? 'arrow-forward' : 'arrow-back'} label={tx(language,'Back')} onPress={() => goBackOrHome(navigation)} />
      : <View style={s.appHeaderBrand}>
        <Image source={LOGO_MARK} resizeMode="contain" style={s.appLogo} />
        <Text style={s.appName} numberOfLines={1}>{T('Islamic')}</Text>
      </View>}
    <View style={s.appHeaderActions}>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Notifications')}
        onPress={() => openNotifications()}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={header.notifications} resizeMode="contain" style={{ width: 24, height: 24 }} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={dark ? T('Show the light theme') : T('Show the dark theme')}
        onPress={() => setMode(dark ? 'light' : 'dark')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={header.theme} resizeMode="contain" style={{ width: 24, height: 24 }} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Settings')}
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={header.settings} resizeMode="contain" style={{ width: 24, height: 24 }} />
      </Pressable>
    </View>
  </View>;
}

/**
 * The back arrow and the header buttons. These are on nearly every screen, so
 * they are where a press that does not answer is most obvious.
 */
function IconButton({ name, onPress, dark = false, label = 'Go back' }: { name: any; onPress?: () => void; dark?: boolean; label?: string }) {
  const press = usePressDepth();
  return <Animated.View style={{ transform: [{ scale: press.scale }] }}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      onPressIn={press.onPressIn} onPressOut={press.onPressOut}
      style={[s.iconBtn, dark && s.iconBtnDark]}>
      {ico(name, 20, dark ? C.white : C.ink)}
    </Pressable>
  </Animated.View>;
}
function Section({ title, action, onPress, busy }: { title: string; action?: string; onPress?: () => void; busy?: boolean }) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  /* A refresh that takes a moment and shows nothing is indistinguishable from
     one that did nothing at all, so the link says so while it works. */
  return <View style={s.section}><Text style={s.h2}>{title}</Text>{action&&<Tactile onPress={busy?undefined:onPress} disabled={busy} accessibilityState={{busy}} style={s.sectionLink}>
    {busy?<><ActivityIndicator size="small" color={C.green}/><Text style={s.sectionAction}>{T('Refreshing…')}</Text></>
        :<Text style={s.sectionAction}>{rtl?'\u2190  ':''}{action}{tx(language, '  \u2192')}</Text>}
  </Tactile>}</View>}
function LiveBadge({ source }: { source: string }) {
  const { rtl , language }=useLanguage();
  return <View style={s.liveBadge}><View style={s.liveDot} /><Text style={s.liveText}>{tf(language,'LIVE · {s}',{s:tx(language, source)})}</Text></View>;
}
/**
 * Asking for a place.
 *
 * There are two shapes here on purpose. Before the person has been asked, the
 * full card: it explains why, and offers a city to search for. Once they
 * have been through onboarding — asked once, as promised — the same missing
 * information becomes a single quiet line with a link, because somebody who
 * already said "not now" does not want to be stopped at every screen.
 */
function LocationPrompt({compact=false}:{compact?:boolean}){const loc=useAppLocation();const navigation=useNavigation<any>();const{width}=useWindowDimensions();const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[asked,setAsked]=useState(false);
useEffect(()=>{void loadOnboarding().then(value=>setAsked(!!value?.locationAsked)).catch(()=>setAsked(false))},[]);
const manual=()=>{navigation.navigate('Tools',{screen:'Location Setup',initial:false})};
if(asked)return <Pressable accessibilityRole="button" accessibilityLabel={T('Choose your prayer location')} onPress={manual} style={s.locationBanner}>
  <View style={s.locationBannerIcon}>{ico('location-outline',17,C.green)}</View>
  <View style={{flex:1}}>
    <Text style={s.locationBannerTitle}>{T('No location set')}</Text>
    <Text style={s.locationBannerBody}>{T('Prayer times, Qibla and fasting times read from one place. Tap to choose a city or enter coordinates.')}</Text>
  </View>
  {ico(rtl ? 'arrow-back' : 'arrow-forward',17,C.muted)}
</Pressable>;return <View style={[s.locationGate,width<370&&s.locationGateNarrow,compact&&{marginVertical: 12}]}><ToolGraphic tool="Location" size={60}/><View style={{flex:1,width:width<370?'100%':undefined}}><Text style={s.locationGateTitle}>{T('Choose your prayer location')}</Text><Text style={s.locationGateBody}>{T('Makkah is shown until you choose. Search for your city, or enter coordinates by hand.')}</Text><View style={[s.locationActions,width<370&&s.locationActionsNarrow]}><Tactile accessibilityLabel={T('Choose prayer location manually')} onPress={manual} style={s.primarySmall}><Text style={s.primaryText}>{T('Choose a city')}</Text></Tactile></View></View></View>}

type DailyContentCache={ayah:DailyAyah;hadith:DailyHadith;name:DivineName;dua:any};
/**
 * Home's daily content - the ayah, the Name and the hadith behind the
 * reflections.
 *
 * Everything here is read off the device first and only then refreshed from
 * the network. The reflection is the first thing you look at when you open the
 * app, and a card that waits for a request is a card that is usually blank on
 * a train, in a lift, or abroad with data off. So: paint what is stored, then
 * quietly replace it if the network has something newer.
 *
 * Behind that, the week ahead is fetched while the phone is online and put
 * away, so the card has something to show even if it is opened a week later
 * with no connection at any point.
 */
const REFLECTION_AHEAD_DAYS = 7;

const dayKeyOf = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** Fills the days after today, one at a time so a slow network is not hammered. */
async function preloadReflectionsAhead() {
  /* Only the verse of the day is tied to a date. The Name and the morning
     adhkar come from endpoints that take no date at all, so asking for them
     once per day asked for today, seven times over - and then filed today's
     Name under six future dates. They are fetched once, here, and shared. */
  let name: DivineName | null = null;
  let duas: any[] = [];
  for (let ahead = 1; ahead <= REFLECTION_AHEAD_DAYS; ahead += 1) {
    const date = new Date(); date.setDate(date.getDate() + ahead);
    const key = dayKeyOf(date);
    try {
      const already = await loadDailyContent<DailyContentCache>(key);
      if (already?.ayah) continue;
      if (!name && !duas.length) {
        [name, duas] = await Promise.all([
          loadNameOfDay().catch(() => null),
          getDuas('morning').catch(() => [] as any[]),
        ]);
      }
      const ayah = await getAyahForDate(date);
      await saveDailyContent(key, { ayah, hadith: null as any, name: name as any, dua: duas?.[0] });
    } catch {
      return; // offline, or one day failed - the rest will fill in next time
    }
  }
}

function useHomeData() {
  const {rtl,language}=useLanguage(); const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const dateKey=dayKeyOf(new Date());
  /* The hadith of the day is fetched in the reader's hadith language, so a
     change of language has to be a reason to refresh — otherwise the card
     keeps yesterday's tongue until midnight. */
  const hadithLanguage=useHadithLanguage();
  const [snapshot,setSnapshot]=useState<PrayerSnapshot|null>(null); const[ayah,setAyah]=useState<DailyAyah|null>(null); const[hadith,setHadith]=useState<DailyHadith|null>(null); const[name,setName]=useState<DivineName|null>(null); const[dua,setDua]=useState<any>(null); const[cached,setCached]=useState(false); const[error,setError]=useState('');
  const applyDaily=(daily:DailyContentCache)=>{setAyah(daily.ayah);setHadith(daily.hadith);setName(daily.name);setDua(daily.dua)};
  const load=async()=>{
    if(!location)return;
    /* 1. what is already on the device */
    const saved=await loadDailyContent<DailyContentCache>(dateKey).catch(()=>null);
    if(saved){applyDaily(saved);setCached(true)}
    /* 2. then the network, to freshen it - never to blank a card that is
          already showing something */
    setError('');
    try{
      const[p,a,h,n,duas]=await Promise.all([managedPrayerSnapshot(location,settings),getAyahOfDay(),getDailyHadith().catch(()=>null),loadNameOfDay().catch(()=>null),getDuas('morning').catch(()=>[])]);
      const daily={ayah:a,hadith:h as any,name:n as any,dua:duas?.[0]};
      setSnapshot(p.snapshot);setCached(p.cached);applyDaily(daily);
      await saveDailyContent(dateKey,daily);
      /* 3. and, once today is safe, the days after it */
      void preloadReflectionsAhead();
    }catch(e:any){
      if(!saved){const older=await loadDailyContent<DailyContentCache>(dateKey).catch(()=>null);
        if(older){applyDaily(older);setCached(true)}else setError(tx(language,e.message||'Please check your connection.'))}
    }
  };
  useEffect(()=>{
    loadDailyContent<DailyContentCache>(dateKey).then(saved=>saved&&applyDaily(saved)).catch(()=>undefined);
    setSnapshot(null);
    if(location)load();
  },[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat,hadithLanguage]);
  return{snapshot,ayah,hadith,name,dua,location,cached,error,load};
}
function getNext(prayers: Prayer[]) {
  const d = new Date(); const now = d.getHours() * 60 + d.getMinutes();
  return prayers.find(p => { const [h,m] = p.raw.split(':').map(Number); return h*60+m > now; }) || prayers[0];
}

const PRAYER_ICONS: Record<string, any> = {
  Fajr: require('./assets/tool-icons/prayer-fajr.png'),
  Dhuhr: require('./assets/tool-icons/prayer-dhuhr.png'),
  Asr: require('./assets/tool-icons/prayer-asr.png'),
  Maghrib: require('./assets/tool-icons/prayer-maghrib.png'),
  Isha: require('./assets/tool-icons/prayer-isha.png'),
  /* Sunrise is a solar event rather than a prayer — it is never ticked off
     with the five — but it sits in the same list, so it carries artwork to
     match them instead of the bare glyph it used to fall back to. */
  Sunrise: require('./assets/tool-icons/sunrise.png')
};
/**
 * The same five, drawn for the dark theme.
 *
 * Only Fajr used to have one. The other four have sat in the assets folder
 * unwired since they were generated, so in dark mode the Asr, Dhuhr, Maghrib
 * and Isha rows quietly showed the light artwork — drawn for a parchment
 * background and sitting on near-black.
 */
const PRAYER_ICONS_DARK: Record<string, any> = {
  Fajr: require('./assets/tool-icons/prayer-fajr-dark.png'),
  Dhuhr: require('./assets/tool-icons/prayer-dhuhr-dark.png'),
  Asr: require('./assets/tool-icons/prayer-asr-dark.png'),
  Maghrib: require('./assets/tool-icons/prayer-maghrib-dark.png'),
  Isha: require('./assets/tool-icons/prayer-isha-dark.png'),
  Sunrise: require('./assets/tool-icons/sunrise-dark.png')
};
/* The five again, drawn for the Palestine theme.

   Given their own files rather than replacing the ones above. The prayer rows
   are shared by every theme, so swapping the art in place would have put
   these on the Islamic theme too — and the two themes are meant to stay
   separate, the way their scenes already do.

   Sunrise is deliberately absent: it is no one's prayer time, it has no
   Palestine drawing, and it falls through to the shared one below rather
   than borrowing Fajr's. */
const PRAYER_ICONS_PALESTINE: Record<string, any> = {
  Fajr: require('./assets/tool-icons/prayer-fajr-palestine.png'),
  Dhuhr: require('./assets/tool-icons/prayer-dhuhr-palestine.png'),
  Asr: require('./assets/tool-icons/prayer-asr-palestine.png'),
  Maghrib: require('./assets/tool-icons/prayer-maghrib-palestine.png'),
  Isha: require('./assets/tool-icons/prayer-isha-palestine.png')
};
const PRAYER_ICONS_PALESTINE_DARK: Record<string, any> = {
  Fajr: require('./assets/tool-icons/prayer-fajr-dark-palestine.png'),
  Dhuhr: require('./assets/tool-icons/prayer-dhuhr-dark-palestine.png'),
  Asr: require('./assets/tool-icons/prayer-asr-dark-palestine.png'),
  Maghrib: require('./assets/tool-icons/prayer-maghrib-dark-palestine.png'),
  Isha: require('./assets/tool-icons/prayer-isha-dark-palestine.png')
};
/* Chosen the way the scenes are: by theme, which carries the lightness with
   it, rather than by a separate flag that could disagree. A name the Palestine
   sets do not carry falls back to the shared one, so Sunrise keeps its own
   artwork instead of silently becoming Fajr. */
const prayerIconFor = (name: string, theme: ResolvedTheme) => {
  const dark = theme === 'palestineDark' || theme === 'islamicDark';
  const shared = dark ? PRAYER_ICONS_DARK : PRAYER_ICONS;
  const themed = theme === 'palestineDark' ? PRAYER_ICONS_PALESTINE_DARK
    : theme === 'palestineLight' ? PRAYER_ICONS_PALESTINE
    : null;
  return (themed && themed[name]) || shared[name] || shared.Fajr;
};

/** Honour the system setting: when reduce motion is on, everything sits still. */

/** A value that drifts back and forth, slowly. */
function useDrift(duration: number, from: number, to: number, still: boolean) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) { value.setValue(0.5); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [duration, still, value]);
  return value.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
}

/** Soft light that moves behind the hero text — three slow, low-contrast auras. */
/**
 * The slow glow behind the hero.
 *
 * It was painted in the brand's own gold, indigo and violet, which meant a
 * Palestine poster still had brand colours breathing over it. It takes its
 * colours from the theme now: warm red and green for Palestine, gold and
 * indigo for Islamic.
 */
function HeroAura({ still, palestine = false }: { still: boolean; palestine?: boolean }) {
  const warmIn = palestine ? FLAG.red : BRAND.radiantGold;
  const warmOut = palestine ? mix(FLAG.red, '#000000', 0.45) : BRAND.antiqueGold;
  const cool = palestine ? FLAG.green : BRAND.royalIndigo;
  const deep = palestine ? mix(FLAG.green, '#000000', 0.45) : BRAND.violet;
  const x1 = useDrift(26000, -24, 24, still);
  const y1 = useDrift(31000, -10, 12, still);
  const x2 = useDrift(34000, 18, -16, still);
  const y2 = useDrift(29000, 10, -12, still);
  const grow = useDrift(24000, 1, 1.14, still);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Animated.View style={[s.aura, { transform: [{ translateX: x1 }, { translateY: y1 }, { scale: grow }] }]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="auraGold" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={warmIn} stopOpacity="0.5" />
            <Stop offset="55%" stopColor={warmOut} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={warmOut} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="auraTeal" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={cool} stopOpacity="0.34" />
            <Stop offset="100%" stopColor={cool} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="72" cy="78" rx="96" ry="80" fill="url(#auraGold)" />
        <Ellipse cx="146" cy="146" rx="76" ry="66" fill="url(#auraTeal)" />
      </Svg>
    </Animated.View>
    <Animated.View style={[s.auraAlt, { transform: [{ translateX: x2 }, { translateY: y2 }] }]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="auraViolet" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={deep} stopOpacity="0.32" />
            <Stop offset="100%" stopColor={cool} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="100" cy="100" rx="92" ry="82" fill="url(#auraViolet)" />
      </Svg>
    </Animated.View>
  </View>;
}

function HomeScreen() {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  /* `ar` rather than `rtl`: the Arabic arm of a sentence is Arabic, and
     Urdu reads the same layout but must not be handed it. */
  const ar = language === 'ar';
  const { dark, resolved } = useTheme();
  const [hour,setHour]=useState(new Date().getHours());const still=useCalmMotion();const scrollY=useRef(new Animated.Value(0)).current;const heroShift=scrollY.interpolate({inputRange:[0,300],outputRange:[0,54],extrapolate:'clamp'});const heroZoom=useDrift(30000,1,1.07,still);const sheenShift=useDrift(20000,-0.85,0.85,still);const greeting=T(hour<12?'A purposeful morning':hour<18?'A purposeful afternoon':'A peaceful evening'); const nav = useNavigation<any>(); const locationState=useAppLocation(); const { width } = useWindowDimensions(); /* Poster cards: grow the height with the available width instead of
    holding a fixed height, so a wide screen crops far less of the artwork
    (a 940px-wide card at height 310 showed only 40% of the image).
    Math.max keeps the phone value byte-identical; Math.min stops the card
    from becoming absurdly tall on a tablet. */
    const posterW=Math.min(width,980)-40;const heroH=Math.round(Math.max(285,Math.min(posterW/1.55,520)));const readH=Math.round(Math.max(205,Math.min(posterW/2.35,360))); const data = useHomeData(); const next = data.snapshot ? getNext(data.snapshot.prayers) : undefined; const dateKey=new Date().toISOString().slice(0,10); const[completed,setCompleted]=useState<string[]>([]);const[history,setHistory]=useState<Record<string,string[]>>({});const[quickCount,setQuickCount]=useState(0);const tasbih=useTasbih();const{preferences}=useQuranPreferences();
const[quranPosition,setQuranPosition]=useState<any>(null);const[openReflection,setOpenReflection]=useState<'ayah'|'name'|'dua'|null>(null);const[reportHadith,setReportHadith]=useState<any|null>(null);const[refreshing,setRefreshing]=useState(false);

  /* The hadith card. Home has the resolved UI theme rather than the card
     theme, so the two are married here: a shared picture leaves the app and
     should belong to the colours it was made in. */
  const cardTheme: CardTheme = isPal(resolved) ? 'palestine' : 'islamic';
  const hadithCardRef = useRef<any>(null);
  const [sharingHadith, setSharingHadith] = useState(false);
  /* null while it is still arriving, empty if it never did. The card only
     appears once there is a real remembrance to put in it. */
  const[afterPrayer,setAfterPrayer]=useState<Dua[]|null>(null);
  useEffect(()=>{loadDuas('after-prayer').then(r=>setAfterPrayer(r.duas||[])).catch(()=>setAfterPrayer([]))},[]);
    useEffect(()=>{const t=setInterval(()=>setHour(new Date().getHours()),60000);return()=>clearInterval(t)},[]);
  const hydrateLocal=()=>Promise.all([loadPrayerCompletion(dateKey).then(setCompleted),loadPrayerHistory().then(setHistory),loadQuickTasbih().then(setQuickCount),loadReadingPosition().then(setQuranPosition)]);useEffect(()=>{hydrateLocal()},[dateKey]);useFocusEffect(useCallback(()=>{void hydrateLocal()},[]));const togglePrayer=(name:string)=>setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).then(()=>loadPrayerHistory().then(setHistory));return next});const addQuick=async()=>{await tapTasbih();haptic('count')};

  /* Shares the hadith of the day as a picture. The card is mounted below the
     scroller and photographed in place: it has to be laid out before the
     capture, which is the whole reason it lives in the tree at all times
     rather than being built on the press. */
  const shareHadithAsImage = async () => {
    const h = data.hadith;
    if (!h || sharingHadith) return;
    const card = {
      arabic: h.arabic ? stripTags(h.arabic) : undefined,
      translation: stripTags(h.text || ''),
      collection: hadithSourceLabel(language, h.collection),
      number: String(h.number || ''),
      arabicFontFamily: quranFont(preferences.arabicFont),
      theme: cardTheme,
    };
    setSharingHadith(true);
    try {
      const result = await shareHadithCard(card, hadithCardRef);
      if (result === 'saved') Alert.alert(T('Image saved'), T('The hadith card was saved to your downloads.'));
    } finally {
      setSharingHadith(false);
    }
  };
const onRefresh=async()=>{setRefreshing(true);await Promise.all([data.load(),hydrateLocal()]);setRefreshing(false)};const weekTotal=Object.entries(history).filter(([key])=>Date.now()-new Date(key).getTime()<7*86400000).reduce((sum,[,items])=>sum+items.length,0);let streak=0;for(let i=0;i<60;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if((history[key]||[]).length>=5)streak++;else if(i>0||completed.length<5)break}
  /* The seven days ending today, oldest first, so the row reads left to right
     the way a week does. Keys are cut the same way the completion records
     are written, in UTC, or the counts land on the wrong day. */
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const key=d.toISOString().slice(0,10);return{key,label:d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'narrow'}),count:(history[key]||[]).length,isToday:i===6}});
  /* A day with nothing marked still gets a stub, so the week keeps its shape
     instead of showing gaps where a day was simply quiet. */
  const weekBarHeight=(count:number)=>6+Math.round((Math.min(count,5)/5)*32);
  /* The adhkar sit in their own cards above, so "For your day" keeps the four
     things you reach for most, as round icons rather than a row of cards.
     Which four is hers to say — the row is chosen, not handed over fixed. */
  const { settings: worship, update: updateWorship, hydrated: worshipHydrated } = useWorshipSettings();
  const dayTools = resolveDayTools(worship.dayTools);
  /* Eid. The burst is remembered in state rather than derived from the
     settings, because recording that it has fired is what stops it firing
     again — and if the burst were derived, recording it would pull the
     confetti off the screen mid-fall. So: work out once whether this Eid
     still deserves a greeting, hold that answer, and write the receipt. */
  const eid = useMemo(() => eidToday(), []);
  const [eidBurst, setEidBurst] = useState<string | null>(null);
  useEffect(() => {
    /* Waiting for the saved settings matters. Before they have loaded,
       `lastCelebratedEid` is undefined, which reads as "never greeted" —
       and without this guard the app would greet her again every time it
       started, which is the one thing the receipt exists to prevent. */
    if (!eid || !worshipHydrated || eidBurst) return;
    if (worship.celebrateEid === false || still) return;
    if (worship.lastCelebratedEid === eid.id) return;
    setEidBurst(eid.id);
    void updateWorship({ lastCelebratedEid: eid.id });
  }, [eid, worshipHydrated, eidBurst, worship.celebrateEid, worship.lastCelebratedEid, still, updateWorship]);

  /* The quiet layer under all of that: snow, petals, summer light or leaves,
     from the season where she actually is. Recomputed when the season or the
     place changes and not on every render, and deliberately not tied to the
     clock — a field that restarted at midnight would be a field that jumped
     once a day for no reason anyone asked for. */
  const ambience = useMemo(
    () => (worship.ambientEffects === false ? null : ambienceFor(new Date())),
    [worship.ambientEffects],
  );
  /* Two reasons to stop, and both of them are about a screen nobody is
     looking at. Losing focus covers moving to another tab; the app going to
     the background covers locking the phone with Home still mounted. An
     effect slow enough to be pleasant is still an animation running all day,
     and a battery pays for that whether or not anyone can see it. */
  const [homeFocused, setHomeFocused] = useState(true);
  useFocusEffect(useCallback(() => {
    setHomeFocused(true);
    return () => setHomeFocused(false);
  }, []));
  const [appActive, setAppActive] = useState(true);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  /* The sheet has two faces: the four slots it holds now, and, once one of
     them is picked, everything that could go there instead. `null` shows the
     first face, a number shows the second for that slot. */
  const [dayToolOpen, setDayToolOpen] = useState(false);
  const [dayToolSlot, setDayToolSlot] = useState<number | null>(null);
  const replaceDayTool = (slot: number, id: string) => {
    const next = dayTools.map((tool, index) => (index === slot ? id : tool.id));
    void updateWorship({ dayTools: next });
    setDayToolOpen(false);
    setDayToolSlot(null);
  };
  /* Morning gives way to evening as the day does. The hour is re-read every
     minute so the card turns over by itself rather than on the next render. */
  /* One of the eight remembrances said once the salam is given, chosen by the
     day so it turns over on its own instead of showing the same line forever.
     The local date is used rather than the UTC one so it changes at midnight
     where the person is, not eight hours either side of it. */
  const today = new Date();
  const dayNumber = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 86400000);
  /* All eight are shown, in a strip that swipes sideways. The day only decides
     which one it opens on, so the card still turns over each morning without
     hiding the other seven behind a tap. */
  const adhkarRef = useRef<any>(null);
  const adhkarOpen = afterPrayer && afterPrayer.length ? dayNumber % afterPrayer.length : 0;
  const [adhkarIndex, setAdhkarIndex] = useState(0);
  /* The eight remembrances are not the same length, so left to themselves the
     cards would be eight different heights and the strip would jump under your
     thumb as you swiped. Every card is measured and they all settle at the
     height of the tallest one. Long text is clamped to a few lines and opens
     on a tap, which is the only time a card is allowed to grow. */
  const adhkarHeights = useRef<Record<number, number>>({});
  const [adhkarTallest, setAdhkarTallest] = useState(0);
  const [adhkarExpanded, setAdhkarExpanded] = useState<Record<number, boolean>>({});
  const measureAdhkar = (i: number) => (event: any) => {
    const h = Math.round(event.nativeEvent.layout.height);
    if (!h || adhkarHeights.current[i] === h) return;
    adhkarHeights.current[i] = h;
    const tallest = Math.max(...Object.values(adhkarHeights.current));
    if (tallest && tallest !== adhkarTallest) setAdhkarTallest(tallest);
  };
  const adhkarAnyOpen = Object.values(adhkarExpanded).some(Boolean);

  const contentWidth=Math.min(Math.max(width-36,280),980);

  useEffect(() => {
    if (!afterPrayer?.length) return;
    adhkarRef.current?.scrollTo({ x: adhkarOpen * contentWidth, y: 0, animated: false });
    setAdhkarIndex(adhkarOpen);
  }, [afterPrayer, contentWidth]);
  /* One reflection at a time rather than four in a sliding row. A verse is
     read, not browsed, and a card narrow enough to fit three across leaves
     the Arabic at a size nobody can comfortably recite from. The Quick
     Tasbih counter has moved to "For your day", where it belongs: it is a
     thing you do, not a thing you reflect on. */
  const [reflectionKind,setReflectionKind]=useState<'ayah'|'name'|'dua'>('ayah');  const [reflectBusy,setReflectBusy]=useState(false);
  const REFLECTION_TABS:{id:'ayah'|'name'|'dua';label:string}[]=[
    {id:'ayah',label:'Ayah'},{id:'name',label:'Name'},{id:'dua',label:'Dua'},
  ];
  /* Both of these are drawn by the overlay host, above the floating menu. */
  useOverlaySheet('home-hadith-report', !!reportHadith, () => reportHadith
    ? <CorrectionSheet target={{kind:'hadith',
        reference:`${hadithSourceLabel(language, reportHadith.collection)} · ${reportHadith.number}`,
        source:hadithSourceLabel(language, reportHadith.collection),
        arabic:stripTags(reportHadith.arabic||''), text:stripTags(reportHadith.text||'')}}
        rtl={rtl} T={T} appLanguage={language} onClose={()=>setReportHadith(null)}/>
    : null, () => setReportHadith(null));
  useOverlaySheet('home-reflection', !!openReflection, () => openReflection
    ? <ReflectionDetail kind={openReflection} data={data} rtl={rtl} T={T}
        translationName={T(rtl?preferences.translationLanguage:preferences.translationName)}
        onClose={()=>setOpenReflection(null)}
        onOpenVerse={(verseKey:string,surahId:number,surahName:string)=>nav.navigate('Quran',{screen:'Reader',params:{chapter:{id:surahId,name_simple:surahName,name_arabic:'',verses_count:0},focusVerse:verseKey},initial:false})}/>
    : null, () => setOpenReflection(null));

  useOverlaySheet('home-day-tools', dayToolOpen, () => dayToolOpen
    ? <DayToolSheet initialSlot={dayToolSlot} chosen={dayTools} rtl={rtl} T={T}
        onReplace={replaceDayTool}
        onClose={()=>{setDayToolOpen(false);setDayToolSlot(null)}}
        onSeeAll={()=>{setDayToolOpen(false);nav.navigate('Tools')}}/>
    : null, () => { setDayToolOpen(false); setDayToolSlot(null); });

  /* Where the continue-reading card goes.

     It used to open the Quran tab whatever it was showing, which meant the
     one control that knew exactly where you had stopped reading took you
     somewhere that did not. Now it opens that place.

     The chapter is built from the saved position rather than looked up in a
     chapter list, because Home does not hold one and would have to fetch
     ninety-odd surahs to find the one whose name it already has. The reader
     uses the id to fetch the text and the name for its heading, so a chapter
     built this way opens correctly — the same shape the daily ayah card has
     always used. With nothing saved yet the card is showing Ya-Sin as a
     suggestion, so the Quran tab is still the right place to land. */
  const openReadingPosition = () => {
    if (!quranPosition) { nav.navigate('Quran'); return; }
    nav.navigate('Quran', {
      screen: 'Reader',
      params: {
        chapter: {
          id: quranPosition.surahId,
          name_simple: quranPosition.surahName,
          name_arabic: '',
          verses_count: 0,
        },
        focusVerse: quranPosition.verseKey,
      },
      initial: false,
    });
  };
  return <Page><Animated.ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:false})} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green}/>}>
    <AppHeader/>
    <View style={s.greeting}><View><Text style={s.salam}>السَّلَامُ عَلَيْكُمْ</Text><Text style={s.greetingTitle}>{greeting}</Text></View></View>
    {!data.location?<LocationPrompt/>:data.error && !data.snapshot ? <ErrorState message={data.error} retry={data.load} /> : <>
      <View style={[s.hero,{height:heroH}]}><Animated.View style={[StyleSheet.absoluteFill,{transform:[{translateY:heroShift},{scale:heroZoom}]}]}><Image source={pickScene(SCENE_HOME, resolved)} resizeMode="cover" style={s.heroBg}/></Animated.View>
        <LinearGradient colors={isPal(resolved)?SCRIM.palestine:SCRIM.islamic} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} /> <HeroAura still={still} palestine={isPal(resolved)} /> <Animated.View pointerEvents="none" style={[s.heroSheen,{transform:[{translateX:Animated.multiply(sheenShift,width)},{skewX:'-16deg'}]}]}><LinearGradient colors={['rgba(255,255,255,0)','rgba(255,255,255,.16)','rgba(255,255,255,0)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/></Animated.View> 
        <Pressable onPress={locationState.clear} style={s.locationPill}>{ico('location',13,C.onHero)}<Text numberOfLines={1} style={s.locationText}>{T(data.location?.label || '')}</Text></Pressable>
        <Text style={s.hijri}>{(language === 'ar' ? data.snapshot?.hijriAr || data.snapshot?.hijri : data.snapshot?.hijri) || T('Loading Hijri date…')} · {new Date().toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{data.cached ? (tx(language, ' · CACHED')) : ''}</Text>
        <Text style={s.nextLabel}>{tx(language, 'NEXT · ')}{next ? prayerName(language, next.name) : '—'}</Text><Text style={s.heroTime}>{clockTime(language, next?.time || '—')}</Text>
        <View style={s.heroFooter}><View style={s.countPill}>{ico('time-outline',14,C.white)}<Text style={s.countText}>{tx(language, 'in ')}{next ? <HeroCountdown raw={next.raw} rtl={rtl} language={language}/> : '—'}</Text></View><Pressable onPress={()=>nav.navigate('Prayer')} style={s.heroCta}><Text style={s.heroCtaText}>{T('Prayer schedule')}</Text>{ico(rtl ? 'arrow-back' : 'arrow-forward',15,C.white)}</Pressable></View>
      </View>
      <View style={s.prayerRail}>{data.snapshot?.prayers.filter(p=>p.name!=='Sunrise').map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole="checkbox" accessibilityState={{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.railItem,p.name===next?.name&&s.railItemActive]}><View style={[s.railIcon,checked&&s.railIconDone]}><Image source={prayerIconFor(p.name, resolved)} resizeMode="contain" style={{width:35,height:35,opacity:checked?1:.7}}/>{!!checked && <View style={s.railCheck}>{ico('checkmark',10,C.white)}</View>}</View><Text style={s.railName}>{prayerName(language, p.name)}</Text><Text style={s.railTime}>{clockTime(language, p.time).replace(' ','\n')}</Text></Pressable>})}</View><View style={s.homeProgress}><View><Text style={s.sourceTitle}>{completed.length}/5 {tx(language, 'prayers today')}</Text><Text style={s.sourceBody}>{ar ? `${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')} · ${weekTotal}/35 هذا الأسبوع` : tf(language,'{s} day streak · {w}/35 this week',{s:streak,w:weekTotal})}</Text></View><View style={s.homeProgressRing}><Text style={s.progressCount}>{completed.length*20}%</Text></View></View>
    </>}
    <Section title={T('Adhkar')} action={T('All duas')} onPress={()=>nav.navigate('Library',{screen:'Duas',initial:false})} />
    {afterPrayer === null && <View style={[s.adhkarDuaCard, s.adhkarDuaPad]}><SkeletonParagraph lines={2} /></View>}
    {!!afterPrayer?.length && <>
      <ScrollView
        ref={adhkarRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={contentWidth}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={(e: any) => {
          const x = e?.nativeEvent?.contentOffset?.x || 0;
          const i = Math.min(afterPrayer.length - 1, Math.max(0, Math.round(x / contentWidth)));
          if (i !== adhkarIndex) setAdhkarIndex(i);
        }}
        style={{ width: contentWidth, height: adhkarAnyOpen ? undefined : (adhkarTallest || undefined) }}
      >
        {afterPrayer.map((dua: any, i: number) => (
          <DepthCard key={i} radius={RADIUS.xl} style={{ width: contentWidth }}
            cardStyle={{ width: contentWidth, minHeight: adhkarTallest || undefined }}
            bodyStyle={s.adhkarDuaPad}
            onPress={()=>nav.navigate('Library',{screen:'Adhkar',params:{initial:'after-prayer'},initial:false})}>
            <View onLayout={measureAdhkar(i)}>
            <View style={s.adhkarDuaHead}>
              <ToolGraphic tool="Duas" size={52} />
              <View style={{ flex: 1 }}>
                <Text style={s.adhkarKicker}>{T('After every prayer')}</Text>
                <Text style={s.adhkarTitle}>{T('After the salam')}</Text>
              </View>
              <View style={s.adhkarCount}><Text style={s.adhkarCountText}>{i + 1}/{afterPrayer.length}</Text></View>
            </View>
            <Text style={s.dailyArabic} numberOfLines={adhkarExpanded[i] ? undefined : 4}>{dua.arabic}</Text>
            {!!dua.translation && <Text style={s.adhkarTranslation} numberOfLines={adhkarExpanded[i] ? undefined : 3}>{dua.translation}</Text>}
            {!!dua.reference && <Text style={s.adhkarRef}>{dua.reference}</Text>}
            <Pressable accessibilityRole="button" accessibilityLabel={T(adhkarExpanded[i] ? 'Show less' : 'Read more')}
              hapticKind="select"
              onPress={() => setAdhkarExpanded((open) => ({ ...open, [i]: !open[i] }))} style={s.adhkarMore}>
              <Text style={s.adhkarMoreText}>{T(adhkarExpanded[i] ? 'Show less' : 'Read more')}</Text>
              {ico(adhkarExpanded[i] ? 'chevron-up' : 'chevron-down', 14, C.green)}
            </Pressable>
            <Text style={s.adhkarFoot}>{T('Swipe for the next one')} · {T('Tap to read them all')}</Text>
            </View>
          </DepthCard>
        ))}
      </ScrollView>
      <View style={s.adhkarDots}>
        {afterPrayer.map((_: any, i: number) => <View key={i} style={[s.adhkarDot, i === adhkarIndex && s.adhkarDotOn]} />)}
      </View>
    </>}
    <Section title={T('For your day')} action={T('Edit')} onPress={()=>{setDayToolSlot(null);setDayToolOpen(true)}} />
    <View style={s.roundRow}>{dayTools.map((tool,index)=>(
      <MotionPress key={tool.id} index={index}
        accessibilityLabel={tool.id==='quick-tasbih'?`${T('Quick Tasbih')} ${todayTotal(tasbih)}. ${T('Tap to count')}`:T(tool.label)}
        onPress={()=>{ if(tool.id==='quick-tasbih'){ void addQuick(); return; } tool.open?.(nav); }}
        onLongPress={()=>{setDayToolSlot(index);setDayToolOpen(true)}}
        style={s.roundItem}>
        <View style={s.roundIcon}><ToolGraphic tool={tool.icon} size={38}/></View>
        <Text style={s.roundLabel} numberOfLines={2}>{T(tool.label)}</Text>
      </MotionPress>
    ))}</View>

    <Section title={T('Daily reflection')} action={T('Refresh')} busy={reflectBusy} onPress={async()=>{setReflectBusy(true);const started=Date.now();await onRefresh();
      /* Cached content comes back in a few milliseconds, and a busy state that
         appears for two frames reads as a flicker rather than as an answer. The
         label is held long enough to be seen, and the work is not delayed by it. */
      const rest=650-(Date.now()-started); if(rest>0) await new Promise(r=>setTimeout(r,rest));
      setReflectBusy(false)}}/>
    <View style={s.homeReflectTabs}>{REFLECTION_TABS.map(tab=>(
      <Pressable key={tab.id} accessibilityRole="tab" accessibilityState={{selected:reflectionKind===tab.id}}
        onPress={()=>setReflectionKind(tab.id)} style={[s.homeReflectTab,reflectionKind===tab.id&&s.homeReflectTabOn]}>
        <Text style={[s.homeReflectTabText,reflectionKind===tab.id&&s.homeReflectTabTextOn]} numberOfLines={1}>{T(tab.label)}</Text>
      </Pressable>
    ))}</View>
    <Pressable accessibilityRole="button"
      accessibilityLabel={`${T(REFLECTION_LABEL[reflectionKind])}. ${T('Open the full reflection')}`}
      onPress={()=>setOpenReflection(reflectionKind)} style={({pressed}:any)=>[s.homeReflectHero,pressed&&{opacity:.72}]}>
      <Text style={s.dailyKicker}>{T(REFLECTION_LABEL[reflectionKind])}</Text>
      {reflectionKind==='ayah'?<>
        <Text style={s.homeReflectArabic}>{data.ayah?.arabic||T('Loading verified Quran text…')}</Text>
        {!rtl && <Text style={s.homeReflectBody}>{data.ayah?.translation}</Text>}
        <Text style={s.dataMeta}>{rtl ? data.ayah?.arabicReference || data.ayah?.reference : data.ayah?.reference}</Text>
      </>:reflectionKind==='name'?<>
        <Text style={s.homeReflectName}>{data.name?.name}</Text>
        <Text style={s.homeReflectBody}>{rtl ? data.name?.meaning : data.name?.transliteration}</Text>
        {!rtl && <Text style={s.homeReflectBody}>{data.name?.meaning}</Text>}
      </>:<>
        <Text style={s.homeReflectArabic}>{data.dua?.arabic||T('Loading verified dua…')}</Text>
        {!rtl && <Text style={s.homeReflectBody}>{data.dua?.translation}</Text>}
      </>}
      <View style={s.homeReflectFoot}><Text style={s.homeReflectFootText}>{T('Read the full reflection')}</Text>{ico(rtl ? 'arrow-back' : 'arrow-forward',15,C.green)}</View>
    </Pressable>
    <DepthCard index={0} radius={RADIUS.xl} style={s.weekWrap} cardStyle={s.weekSurface}
      gradient={[C.heroA, C.heroB]}
      bodyStyle={s.weekBody}
      onPress={()=>nav.navigate('Tools',{screen:'Weekly Summary',initial:false})}>
      <View style={s.weekTop}>
        <View style={{flex:1}}>
          <Text style={s.weekSummaryTitle}>{T('This week')}</Text>
          <Text style={s.weekSummaryBody}>{ar ? `${weekTotal} من 35 صلاة مؤداة · ${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')}` : tf(language,'{w} of 35 prayers marked · {s} day streak',{w:weekTotal,s:streak})}</Text>
        </View>
        {ico(rtl ? 'arrow-back' : 'arrow-forward',18,C.white)}
      </View>
      <View style={s.homeWeekRow}>{weekDays.map(day=>(
        <View key={day.key} style={s.homeWeekCol}>
          <View style={s.homeWeekTrack}>
            <View style={[s.homeWeekBar,{height:weekBarHeight(day.count),backgroundColor:day.isToday?C.gold:'rgba(228,189,124,.55)'}]}/>
          </View>
          <Text style={[s.homeWeekDay,day.isToday&&s.homeWeekDayOn]}>{day.label}</Text>
        </View>
      ))}</View>
    </DepthCard>
    <Section title={T('Continue reading')} action={T('Open Quran')} onPress={()=>nav.navigate('Quran')} />
    {/* DepthCard puts `style` on an outer wrapper and sizes the visible card from
       its content, so the height has to be set on cardStyle as well, and the
       body given flex:1 to fill it. Only when the card actually grew, so the
       phone layout is untouched. */}
    <DepthCard index={0} radius={28} padded={false} style={[s.readWrap,{height:readH}]} cardStyle={[s.readSurface,readH>205&&{height:readH}]} bodyStyle={[s.readPad,readH>205&&{flex:1,justifyContent:'space-between'}]}
      onPress={openReadingPosition}>
      <View style={StyleSheet.absoluteFill}><Image source={pickScene(SCENE_QURAN, resolved)} resizeMode="cover" style={s.heroBg}/></View>
      <LinearGradient colors={isPal(resolved)?SCRIM.readPalestine:SCRIM.readIslamic} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} />
      <Text style={s.readKicker}>{T(quranPosition ? 'CONTINUE READING' : 'FEATURED READING')}</Text><Text style={s.readArabic}>{quranPosition?'۝':'يس'}</Text><Text style={s.readTitle}>{quranPosition ? quranPosition.surahName : T('Surah Ya-Sin')}</Text><Text style={s.readMeta}>{quranPosition ? `${quranPosition.verseKey} · ${tx(language, 'Page')} ${quranPosition.page || '—'}` : (tx(language, '83 verses · Makkan'))}</Text><Tactile onPress={()=>nav.navigate('Quran',{screen:'Reader',params:{chapter:quranPosition?{id:quranPosition.surahId,name_simple:quranPosition.surahName,name_arabic:'',verses_count:0}:{id:36,name_simple:'Ya-Sin',name_arabic:'يس',verses_count:83},focusVerse:quranPosition?.verseKey},initial:false})} style={s.whiteButton}><Text style={s.whiteButtonText}>{T(quranPosition ? 'Continue' : 'Read now')}</Text>{ico(rtl ? 'arrow-back' : 'arrow-forward',14,C.green)}</Tactile>
    </DepthCard>
    <Section title={T('Hadith of the day')} />
    <View style={[s.depthCard,s.hadithSurface,{borderRadius:RADIUS.xl}]}><Text style={s.quote}>“</Text><Text numberOfLines={6} style={s.hadithText}>{data.hadith ? (rtl && data.hadith.arabic ? stripTags(data.hadith.arabic) : data.hadith.text) : T('Loading today’s authenticated hadith…')}</Text><View style={s.hadithFoot}><Text style={s.meta}>{data.hadith ? `${hadithSourceLabel(rtl, data.hadith.collection)} · ${data.hadith.number}` : ''}</Text><View style={s.hadithActions}>{!!data.hadith&&<Pressable accessibilityRole="button" accessibilityLabel={T('Share as image card')} onPress={shareHadithAsImage} disabled={sharingHadith} hitSlop={10} style={{opacity:sharingHadith?.5:1}}>{ico('image-outline',18,C.muted)}</Pressable>}{!!data.hadith&&<Pressable accessibilityRole="button" accessibilityLabel={T('Report a correction in this hadith')} onPress={()=>{const h=data.hadith;if(h)setReportHadith({collection:h.collection,number:h.number,arabic:h.arabic,text:h.text})}} hitSlop={10}>{ico('flag-outline',18,C.muted)}</Pressable>}</View></View></View>
  </Animated.ScrollView>
  {/* Outside the scroller, so it stays put while the page moves under it.
      Only Home mounts it: `scrollY` here is Home's own offset. */}
  {!!next && <NextPrayerPill prayer={next} prayers={data.snapshot?.prayers || []} language={language} rtl={rtl} still={still} scrollY={scrollY} />}
  {/* The hadith card, kept in the tree so it is laid out and can be
      photographed on the press. Off-screen rather than hidden: a view with
      no layout captures as a blank PNG. Web draws on a canvas instead. */}
  {Platform.OS !== 'web' && !!data.hadith && <View style={s.offscreenCard} pointerEvents="none" aria-hidden>
    <HadithShareCard
      viewRef={hadithCardRef}
      arabic={data.hadith.arabic ? stripTags(data.hadith.arabic) : undefined}
      translation={stripTags(data.hadith.text || '')}
      collection={hadithSourceLabel(language, data.hadith.collection)}
      number={String(data.hadith.number || '')}
      arabicFontFamily={quranFont(preferences.arabicFont)}
      theme={cardTheme}
    />
  </View>}
  {/* The light and the burst never run together: on an Eid the ambience
      resolves to confetti, and the field stands down so the two are not
      competing over the same screen. */}
  <AmbientField
    kind={ambience === null || ambience === 'confetti' ? null : ambience}
    dark={dark}
    active={homeFocused && appActive}
  />
  <EidConfetti fire={eidBurst} dark={dark} />
</Page>;
}
let CARD_GREEN: any = { backgroundColor: C.mint }; let CARD_GOLD: any = { backgroundColor: C.peach };

/**
 * Tools is what you calculate, look up, travel for, or record. The prayer
 * cluster — times, Qibla, Adhan, reminders, location, the calendar, the
 * fasts, the week — now has its own tab and is not repeated here.
 */
type ToolItem = { title: string; caption: string; route: string; params?: any };

/**
 * `when` gates a whole group rather than the cards inside it. The women's
 * area holds the most personal records in the app, so it is not listed in
 * Tools at all until it has been turned on — a heading that appears and then
 * asks to be unlocked has already told the wrong person it exists.
 */
type ToolGroup = { label: string; title: string; when?: 'womens'; items: ToolItem[] };

/**
 * Tools is what you work out, keep track of, or watch. Three groups, and
 * every card opens a screen inside this stack so the back button returns
 * here rather than leaving you in another tab.
 */
/** Routes that exist only inside the women's area, hidden until it is opted into. */
const WOMENS_ONLY_TOOLS = ['Women', 'Cycle', 'Qada'];

const TOOL_GROUPS: ToolGroup[] = [
  { label: 'TRACK', title: 'Trackers and calculators', items: [
    { title: 'Salah Tracker', caption: 'Every day you have marked, on one map', route: 'Salah Tracker' },
    { title: 'Qada Prayers', caption: 'Prayers you owe, and a pace to clear them', route: 'Qada Prayer' },
    { title: 'Fasting', caption: 'Ramadan, voluntary and missed fasts', route: 'Fasting' },
    { title: 'Zakat', caption: 'Gold, silver, cash and investments', route: 'Zakat' },
    { title: 'Sadaqah', caption: 'Voluntary giving, recorded privately', route: 'Sadaqah' },
    { title: 'Sunnah Prayers', caption: 'Witr, Duha and Tahajjud, kept apart from the five', route: 'Sunnah Prayers' },
    { title: 'Tasbih', caption: 'A quiet, tactile dhikr counter', route: 'Tasbih' },
    { title: 'Journal', caption: 'A private place to reflect', route: 'Journal' },
    { title: 'Weekly Summary', caption: 'Your past seven days at a glance', route: 'Weekly Summary' },
  ]},
  { label: 'FIND', title: 'Utilities and location', items: [
    { title: 'Qibla', caption: 'Direction to the Ka‘bah', route: 'Qibla' },
    { title: 'Location', caption: 'Search for a city, or set coordinates', route: 'Location Setup' },
    { title: 'Hijri Calendar', caption: 'Islamic dates and the month grid', route: 'Hijri Calendar' },
    { title: 'Prayer Reminders', caption: 'Adhan alerts and their toggles', route: 'Notifications' },
    { title: 'Umrah Resources', caption: 'A packing checklist you can tick off', route: 'Umrah Packing' },
  ]},
  { label: 'WATCH', title: 'Live broadcasts', items: [
    { title: 'Makkah Live', caption: 'Al-Masjid al-Haram, around the clock', route: 'Holy site channels', params: { site: 'Makkah' } },
    { title: 'Madinah Live', caption: 'Al-Masjid an-Nabawi, around the clock', route: 'Holy site channels', params: { site: 'Madinah' } },
  ]},
  /* Last, and only once it has been turned on. The three cards here are the
     hub, the record it is built on, and the question the record raises. */
  { label: 'WOMEN’S WORSHIP', title: 'Kept on this device', when: 'womens', items: [
    { title: 'Women’s worship', caption: 'Your cycle, purity and the fasts you owe', route: 'Women' },
    { title: 'Cycle Tracker', caption: 'Period logging and predictions', route: 'Cycle' },
    { title: 'Istihada', caption: 'Bleeding that is not a period', route: 'Istihada' },
    { title: 'Ramadan Planner', caption: 'Which fasts your cycle may claim, and when they fall due', route: 'Ramadan Planner' },
    { title: 'These Days', caption: 'What stays open when the prayer and the fast are lifted', route: 'These Days' },
    { title: 'Qada Fasts', caption: 'What you owe, and what you have made up', route: 'Qada' },
  ]},
];

/**
 * What to take for Umrah. Grouped in the order you would think of it, not
 * alphabetically, and ticked off on the device rather than on a web page.
 */
/**
 * Everything that can be put under "For your day" on the Home screen.
 *
 * A shortcut and a Tools card are not the same thing, which is why this is
 * written out rather than derived from TOOL_GROUPS. A Tools card names a
 * screen inside the tab it already sits in; a shortcut has to work from
 * Home, which means naming the tab and the screen both. Deriving one from
 * the other would quietly produce shortcuts that lead nowhere.
 *
 * `open` is left unset for Quick Tasbih, which counts where it stands
 * rather than taking you anywhere.
 */
type DayTool = { id: string; label: string; icon: string; open?: (nav: any) => void };

const DAY_TOOL_POOL: DayTool[] = [
  { id: 'quran', label: 'Quran', icon: 'Quran',
    open: (n) => n.navigate('Quran') },
  { id: 'qibla', label: 'Qibla', icon: 'Qibla',
    open: (n) => n.navigate('Tools', { screen: 'Qibla', initial: false }) },
  { id: 'tasbih', label: 'Tasbih', icon: 'Tasbih',
    open: (n) => n.navigate('Tools', { screen: 'Tasbih', initial: false }) },
  { id: 'audio', label: 'Audio', icon: 'Audio',
    open: (n) => n.navigate('Quran', { screen: 'Quran Audio', initial: false }) },
  { id: 'quick-tasbih', label: 'Quick Tasbih', icon: 'Tasbih' },
  { id: 'prayer', label: 'Salah Tracker', icon: 'Prayer',
    open: (n) => n.navigate('Prayer') },
  { id: 'adhkar', label: 'Adhkar', icon: 'Adhkar',
    open: (n) => n.navigate('Library', { screen: 'Adhkar', initial: false }) },
  { id: 'duas', label: 'Duas', icon: 'Duas',
    open: (n) => n.navigate('Library', { screen: 'Duas', initial: false }) },
  { id: 'hadith', label: 'Hadith', icon: 'Hadith',
    open: (n) => n.navigate('Library', { screen: 'Hadith', initial: false }) },
  { id: 'names', label: '99 Names', icon: '99 Names',
    open: (n) => n.navigate('Library', { screen: '99 Names', initial: false }) },
  { id: 'vocabulary', label: 'Vocabulary', icon: 'Quran Vocabulary',
    open: (n) => n.navigate('Quran', { screen: 'Quran Vocabulary', initial: false }) },
  { id: 'mushaf', label: 'Mushaf', icon: 'Mushaf Pages',
    open: (n) => n.navigate('Quran', { screen: 'Reader', initial: false }) },
  { id: 'search', label: 'Search', icon: 'Quran Search',
    open: (n) => n.navigate('Quran', { screen: 'Quran Search', initial: false }) },
  { id: 'tafsir', label: 'Tafsir', icon: 'Tafsir',
    open: (n) => n.navigate('Quran', { screen: 'Tafsir', initial: false }) },
  { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmarks',
    open: (n) => n.navigate('Quran', { screen: 'Bookmarks', initial: false }) },
  { id: 'plans', label: 'Reading Plans', icon: 'Reading Plans',
    open: (n) => n.navigate('Quran', { screen: 'Reading Plans', initial: false }) },
  { id: 'khatam', label: 'Khatam', icon: 'Khatam',
    open: (n) => n.navigate('Quran', { screen: 'Khatam', initial: false }) },
  { id: 'qada-prayer', label: 'Qada Prayers', icon: 'Qada Prayer',
    open: (n) => n.navigate('Tools', { screen: 'Qada Prayer', initial: false }) },
  { id: 'memorize', label: 'Memorize', icon: 'Hifz',
    open: (n) => n.navigate('Quran', { screen: 'Memorize', initial: false }) },
  { id: 'fasting', label: 'Fasting', icon: 'Fasting',
    open: (n) => n.navigate('Tools', { screen: 'Fasting', initial: false }) },
  { id: 'zakat', label: 'Zakat', icon: 'Zakat',
    open: (n) => n.navigate('Tools', { screen: 'Zakat', initial: false }) },
  { id: 'sadaqah', label: 'Sadaqah', icon: 'Sadaqah',
    open: (n) => n.navigate('Tools', { screen: 'Sadaqah', initial: false }) },
  { id: 'journal', label: 'Journal', icon: 'Journal',
    open: (n) => n.navigate('Tools', { screen: 'Journal', initial: false }) },
  { id: 'sunnah', label: 'Sunnah Prayers', icon: 'Sunnah Prayers',
    open: (n) => n.navigate('Tools', { screen: 'Sunnah Prayers', initial: false }) },
  { id: 'qada', label: 'Qada Fasts', icon: 'Qada Fasts',
    open: (n) => n.navigate('Tools', { screen: 'Qada', initial: false }) },
  { id: 'hijri', label: 'Hijri Calendar', icon: 'Hijri Calendar',
    open: (n) => n.navigate('Tools', { screen: 'Hijri Calendar', initial: false }) },
  { id: 'weekly', label: 'Weekly Summary', icon: 'Weekly Summary',
    open: (n) => n.navigate('Tools', { screen: 'Weekly Summary', initial: false }) },
  { id: 'guides', label: 'Worship Guides', icon: 'Worship guides',
    open: (n) => n.navigate('Library', { screen: 'Worship Guides', initial: false }) },
];

const DAY_TOOL_BY_ID = new Map(DAY_TOOL_POOL.map((tool) => [tool.id, tool]));

/** Four. It is what the row was drawn for: one line on every phone, and each
    icon keeps a comfortable target to press. */
const DAY_TOOL_SLOTS = 4;

/**
 * Turn whatever was saved into a full row of four.
 *
 * Ids this build no longer knows are dropped rather than shown as blanks,
 * the same id is never repeated, and the tail is filled from the defaults so
 * the row is never short. A saved choice that has gone stale should settle
 * back into the row everybody starts with, not into a hole.
 */
function resolveDayTools(saved: string[] | undefined): DayTool[] {
  const out: DayTool[] = [];
  for (const id of saved || []) {
    const tool = DAY_TOOL_BY_ID.get(id);
    if (tool && !out.some((chosen) => chosen.id === tool.id)) out.push(tool);
    if (out.length === DAY_TOOL_SLOTS) break;
  }
  for (const id of DEFAULT_DAY_TOOLS) {
    if (out.length === DAY_TOOL_SLOTS) break;
    if (out.some((chosen) => chosen.id === id)) continue;
    const tool = DAY_TOOL_BY_ID.get(id);
    if (tool) out.push(tool);
  }
  return out;
}

/** The three reflections, named the way the card names them. */
const REFLECTION_LABEL: Record<'ayah' | 'name' | 'dua', string> = {
  ayah: 'AYAH OF THE DAY',
  name: 'NAME OF ALLAH',
  dua: 'DUA OF THE DAY'
};

/**
 * Choosing what sits under "For your day".
 *
 * Two faces, because the two ways into it want different things. Opening it
 * from the section header is a decision about the row as a whole, so it
 * lists the four slots and lets you pick one. Long-pressing an icon is
 * already a decision about that icon, so it goes straight to the list of
 * replacements.
 *
 * A slot is filled rather than emptied: four is what the row is drawn for,
 * and a row with a hole in it is not a choice anybody asked to make.
 */
function DayToolSheet({ initialSlot, chosen, rtl, T, onReplace, onClose, onSeeAll }: {
  /**
   * Which face to open on: null for the four slots, a number to go straight
   * to replacing that one. Read once, when the sheet mounts.
   */
  initialSlot: number | null;
  chosen: DayTool[];
  rtl: boolean;
  T: (text: string) => string;
  onReplace: (index: number, id: string) => void;
  onClose: () => void;
  onSeeAll: () => void;
}) {
  const { height: windowH } = useWindowDimensions();
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  /* Which slot is being replaced lives here rather than in the Home screen.
     The overlay host only redraws when a sheet is opened or closed, so a
     value held by the caller would change without ever reaching this
     component — the sheet would open and then refuse to switch faces. State
     the sheet owns re-renders it directly, which is how every other sheet in
     the app keeps its own choices. */
  const [slot, setSlot] = useState<number | null>(initialSlot);

  const replacing = slot !== null ? chosen[slot] : null;

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, { maxHeight: Math.round(windowH * 0.86) }, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise
    }]}>
      <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={s.sheetGrip} />
        <Text style={s.sheetTitle}>{replacing ? T('Replace with') : T('For your day')}</Text>
        <Text style={s.sheetSub}>
          {replacing ? T('Choose what takes its place.') : T('Four shortcuts, and which four is yours to say. Pick one to change it.')}
        </Text>

        {replacing === null ? chosen.map((tool, index) => (
          <Pressable key={tool.id} accessibilityRole="button"
            accessibilityLabel={`${T('Change')} ${T(tool.label)}`}
            onPress={() => setSlot(index)}
            style={[s.setting, index === chosen.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={s.dayToolIcon}><ToolGraphic tool={tool.icon} size={38} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T(tool.label)}</Text>
              <Text style={s.meta}>{T(tool.open ? 'Opens a screen' : 'Counts where it stands')}</Text>
            </View>
            {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
          </Pressable>
        )) : DAY_TOOL_POOL.map((tool, index) => {
          const isCurrent = tool.id === replacing.id;
          return <Pressable key={tool.id} accessibilityRole="radio" accessibilityState={{ selected: isCurrent }}
            onPress={() => (isCurrent ? onClose() : onReplace(slot as number, tool.id))}
            style={[s.setting, index === DAY_TOOL_POOL.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={s.dayToolIcon}><ToolGraphic tool={tool.icon} size={38} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T(tool.label)}</Text>
              <Text style={s.meta}>{T(isCurrent ? 'Already here' : tool.open ? 'Opens a screen' : 'Counts where it stands')}</Text>
            </View>
            {ico(isCurrent ? 'checkmark-circle' : 'ellipse-outline', 20, isCurrent ? C.green : C.muted)}
          </Pressable>;
        })}

        {replacing === null && (
          <Tactile accessibilityRole="button" accessibilityLabel={T('See all tools')} onPress={onSeeAll} style={s.secondary}>
            <Text style={s.secondaryText}>{T('See all tools')}</Text>
          </Tactile>
        )}
      </ScrollView>
    </Animated.View>
  </View>;
}
const PACKING_GROUPS: { title: string; items: string[] }[] = [
  { title: 'Documents and money', items: [
    'Passport with at least six months left on it',
    'Visa or Nusuk permit — printed, and saved offline on your phone',
    'Meningitis ACWY vaccination certificate — required for every pilgrim',
    'Printed hotel bookings and your agency’s contact details',
    'A card in your pocket with your name, hotel and a companion’s number',
    'Photocopies of your passport photo page, kept apart from the original',
    'Nusuk installed and logged in before you leave home wifi',
    'Some cash in riyals for the small things',
  ]},
  { title: 'Ihram — for men', items: [
    'Two sets, not one — a wet set and a dry set',
    'Towelling weave rather than thin cotton, which goes see-through when you sweat',
    'Hold it up to a light before you buy it',
    'A belt with a zip pocket — the only place your phone and cards can live',
    'Safety pins, plus a spare set',
  ]},
  { title: 'For women', items: [
    'No special garment — modest, loose clothing you can walk in',
    'No face veil and no gloves while in ihram; face and hands stay uncovered',
    'Two or three interchangeable abayas — laundries wash same-day and cheaply',
    'Scarves that pin easily, and more pins than you think you need',
    'A dark, non-see-through layer underneath',
    'Sanitary products in the quantity you will actually need',
  ]},
  { title: 'Unscented toiletries', items: [
    'Unscented soap and shower gel',
    'Unscented shampoo — check the bottle, not the label',
    'Deodorant without perfume; a crystal or alum stick is the safe bet',
    'Unscented wet wipes — almost all supermarket wipes are scented',
    'Hand sanitiser, unscented lip balm, unscented sunscreen',
    'Wash your travel clothes in plain detergent, not the perfumed kind',
  ]},
  { title: 'Chafing — the thing nobody warns you about', items: [
    'Unscented petroleum jelly — plain, not aloe, cocoa butter or baby-scented',
    'Or an unscented anti-chafe balm in a stick',
    'Zinc oxide cream for skin that is already raw — jelly prevents, zinc heals',
    'A small pot decanted into your day bag',
    'Apply before you set out, and again before Sa’i, on dry skin',
    'Inner thighs, waistband, underarms, feet and between the toes',
  ]},
  { title: 'Feet', items: [
    'Sandals already broken in — never new ones for this trip',
    'A spare pair, in case one gives out',
    'Men’s must leave the ankle bare while in ihram',
    'A drawstring shoe bag — the gates hold thousands of identical pairs',
    'Blister plasters in the day bag, not the suitcase',
    'Thin socks for outside ihram — the marble runs cold at Fajr',
  ]},
  { title: 'Health and medicines', items: [
    'Prescriptions in their original packaging, with a copy of the prescription',
    'A doctor’s letter for anything controlled — codeine, tramadol, sedatives, some ADHD medication',
    'All medicines in hand luggage, never in the hold',
    'Rehydration salts, painkillers, throat lozenges, upset-stomach remedy',
    'Face masks, spare glasses or lenses, eye drops',
    'Your own nail and hair clippers',
  ]},
  { title: 'Power and connectivity', items: [
    'A Type G plug adapter — Saudi runs 220V on UK-style three-pin sockets',
    'Power bank, carried in hand luggage',
    'A short charging cable and a spare',
    'Offline maps of Makkah and Madinah',
    'A phone lanyard — a dropped phone in the mataf is gone',
  ]},
  { title: 'The mosque day bag', items: [
    'A small shoulder bag — large backpacks are turned away at the gates',
    'Shoes in their bag, your jelly pot, blister plasters',
    'Phone, power bank and short cable',
    'Your ID card and a little cash',
    'A collapsible cup for the Zamzam coolers',
    'A thin folding prayer mat and unscented wipes',
  ]},
  { title: 'Leave at home', items: [
    'Half the clothes you were going to bring',
    'Anything perfumed — scented product in ihram breaks a restriction',
    'Expensive jewellery',
    'A hairdryer, iron or travel kettle',
    'A rigid itinerary — the crowds will set your pace',
  ]},
];

const PACKING_KEY = '@deen/umrah-packing/v1';

/**
 * The Umrah packing list. A tool rather than a guide: what you have packed is
 * kept on the device, so the list is where you left it.
 */
function UmrahPackingScreen({ navigation }: any) {
  /* Sixty items across ten groups is a lot to hold on screen at once, so the
     groups close. They start open: a packing list you have to open before you
     can see any of it is not a packing list. */
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const [packed, setPacked] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(PACKING_KEY).then((raw) => {
      if (raw) { try { const value = JSON.parse(raw); if (Array.isArray(value)) setPacked(value); } catch { /* a damaged list simply starts empty */ } }
    }).catch(() => {});
  }, []);

  const toggle = (item: string) => setPacked((current) => {
    const next = current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item];
    AsyncStorage.setItem(PACKING_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  });
  const clear = () => { setPacked([]); AsyncStorage.removeItem(PACKING_KEY).catch(() => {}); };

  const total = PACKING_GROUPS.reduce((count, group) => count + group.items.length, 0);
  const done = PACKING_GROUPS.reduce((count, group) => count + group.items.filter((item) => packed.includes(item)).length, 0);
  const percent = total ? Math.round((done / total) * 100) : 0;

  return <Page><ToolBar title={T('Umrah packing')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Pilgrimage" size={83} />
      <Text style={s.dataTitle}>{T('What to take')}</Text>
      <Text style={s.intro}>{T('A list you can tick off, kept on this device. While you are in ihram, anything with perfume in it is best left at home.')}</Text>
      <View style={s.packingHead}>
        <Text style={s.packingCount}>{`${done} / ${total}`}</Text>
        <View style={s.packingTrack}><View style={[s.packingFill, { width: `${percent}%` }]} /></View>
        <Text style={s.packingPct}>{`${percent}%`}</Text>
      </View>
      {!!done && <Tactile accessibilityRole="button" accessibilityLabel={T('Clear the list')} onPress={clear} style={s.secondary}>
        <Text style={s.secondaryText}>{T('Clear the list')}</Text>
      </Tactile>}
      {PACKING_GROUPS.map((group) => {
        const inGroup = group.items.filter((item) => packed.includes(item)).length;
        const isOpen = open[group.title] !== false;
        const caution = group.title === 'Leave at home';
        return <View key={group.title} style={[s.packingGroup, caution && s.packingGroupCaution]}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: isOpen }}
          accessibilityLabel={`${T(group.title)}, ${inGroup} of ${group.items.length}`}
          onPress={() => setOpen((prev) => ({ ...prev, [group.title]: !isOpen }))}
          style={s.packingGroupHead}>
          <Text style={[s.packingGroupTitle, caution && { color: C.gold }, { flex: 1 }]}>{T(group.title)}</Text>
          <Text style={s.packingGroupCount}>{caution ? '' : `${inGroup}/${group.items.length}`}</Text>
          {ico(isOpen ? 'chevron-down' : 'chevron-forward', 16, C.muted)}
        </Pressable>
        {isOpen && group.items.map((item) => {
          const checked = packed.includes(item);
          return <Pressable key={item} onPress={() => toggle(item)} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={T(item)} style={s.packingRow}>
            <View style={[s.packingBox, checked && s.packingBoxOn]}>{checked && ico('checkmark', 14, C.onAccent)}</View>
            <Text style={[s.packingItem, checked && s.packingItemOn]}>{T(item)}</Text>
          </Pressable>;
        })}
      </View>;})}
    </ScrollView></Page>;
}

function ToolsHomeScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  // The women's area stays hidden until it is opted into.
  /* The cycle tracker belongs to the women's area, so it stays out of
     Tools until that area is turned on - the same gate the area's own
     entry uses. Nobody who has not opted in is shown a period tracker. */
  const shown = (group: ToolGroup) =>
    group.items.filter((item) => !WOMENS_ONLY_TOOLS.includes(item.route) || womens.optedIn);
  /* The header belongs inside the scroller, as it is on the other four tabs.
     Left outside it sits flush to the screen edge with no padding, so Tools
     looked like a different app from Home, Prayer, Quran and Library. */
  return <Page>
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <AppHeader/>
      <Text style={s.dataTitle}>{T('Tools')}</Text>
      <Text style={s.dataBody}>{T('What you work out, look up, keep track of, or watch — apart from the flow of the day.')}</Text>
      {TOOL_GROUPS.filter((group) => group.when !== 'womens' || womens.optedIn).map((group) => <View key={group.label}>
        <Text style={s.libraryKicker}>{T(group.label)}</Text>
        <Text style={s.libraryHeading}>{T(group.title)}</Text>
        <View style={s.exploreGrid}>{shown(group).map((item, i) => <MotionPress key={item.title} index={i} onPress={() => navigation.navigate(item.route, item.params)} style={s.exploreCard}>
          <View style={s.exploreCardInner}>
            <ToolGraphic tool={item.title} size={72} />
            <Text style={s.exploreTitle}>{T(item.title)}</Text>
            <Text style={s.exploreBody}>{T(item.caption)}</Text>
            <View style={s.exploreArrow}>{ico(rtl ? 'arrow-back' : 'arrow-forward', 15, C.green)}</View>
          </View>
        </MotionPress>)}</View>
      </View>)}
    </ScrollView>
  </Page>;
}

/**
 * The five that count toward a day being "complete". Sunrise is in the
 * timetable but is a solar event, not a prayer, so it is deliberately left
 * out — otherwise a day would look complete while Fajr was still missed.
 */
const PRAYER_FIVE = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/** Keys are stored as UTC days elsewhere in the app, so we key them the same way. */
function prayerDayKey(d: Date) { return d.toISOString().slice(0, 10); }

/** Consecutive days on which all five were marked. Today does not break it. */
function prayerStreak(history: Record<string, string[]>): number {
  const full = (key: string) => PRAYER_FIVE.every((p) => (history[key] || []).includes(p));
  const cursor = new Date();
  if (!full(prayerDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let run = 0;
  while (full(prayerDayKey(cursor)) && run < 3650) { run += 1; cursor.setDate(cursor.getDate() - 1); }
  return run;
}

/**
 * Counts down in real time. It holds its own ticking state so that the
 * seconds do not redraw the whole prayer screen once a second — only this
 * little component re-renders.
 */
function PrayerCountdown({ raw }: { raw: string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const [h, m] = raw.split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1);
  const left = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left - hh * 3600) / 60);
  const ss = left - hh * 3600 - mm * 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return <>{pad(hh)}:{pad(mm)}:{pad(ss)}</>;
}
/**
 * How long until the next prayer, counting down to the second.
 *
 * It keeps its own one-second timer rather than asking the home screen to
 * re-render every second: only this string changes, and the screen around it
 * is far too large to rebuild on a timer.
 */
function HeroCountdown({ raw, rtl, language }: { raw: string; rtl: boolean; language: string }) {
  const ar = language === 'ar';
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const [h, m] = raw.split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1);
  const left = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left - hh * 3600) / 60);
  const ss = left - hh * 3600 - mm * 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return <>{ar ? `${hh} س ${mm} د ${pad(ss)} ث` : tf(language,'{h}h {m}m {s}s',{h:hh,m:mm,s:pad(ss)})}</>;
}

/**
 * The next prayer, held in a pill that appears once the reader has scrolled.
 *
 * The header scrolls away with the page — it carries the brand and three
 * buttons and nothing about the day — so the one thing worth keeping in
 * sight is the first thing to leave. This sits outside the scroller, above
 * the content, and fades in over the first stretch of scrolling rather than
 * snapping on, which on a fast flick would read as a flicker.
 *
 * Centred rather than aligned to an edge. A pill pinned to the left would
 * have to be pinned to the right in Urdu and Arabic, and a centred one is
 * correct in both without knowing which it is in.
 *
 * Display only: it floats over whatever is beneath it, so it takes no
 * presses at all. pointerEvents are off and it has no accessibility role,
 * so nothing can be tapped by accident while scrolling.
 *
 * The countdown is computed from the prayer's own time rather than read
 * from a stored value, so it cannot drift from the prayer list, and it
 * rolls past midnight the way the prayer it is counting to does.
 */
function NextPrayerPill({ prayer, prayers, language, rtl, still, scrollY }: {
  prayer: Prayer; prayers: Prayer[]; language: any; rtl: boolean; still: boolean; scrollY: Animated.Value;
}) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const now = Date.now();
  /* The two ends of the window being counted through: the last prayer
     whose time has passed, and the one being counted to.

     Both are found across yesterday, today and tomorrow rather than
     derived from today's list alone, because either end can sit on the
     other side of midnight — after Isha the window runs to tomorrow's
     Fajr, and before Fajr it began with yesterday's Isha. */
  const list = prayers && prayers.length ? prayers : [prayer];
  const at = (dayOffset: number, raw: string) => {
    const [h, m] = raw.split(':').map(Number);
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h || 0, m || 0, 0, 0);
    return d.getTime();
  };
  const marks: number[] = [];
  for (const offset of [-1, 0, 1]) for (const p of list) marks.push(at(offset, p.raw));
  marks.sort((a, b) => a - b);
  let from = marks[0];
  let target = marks[marks.length - 1];
  for (const t of marks) {
    if (t <= now) from = t;
    if (t > now) { target = t; break; }
  }
  /* How far through that window the moment sits. A window crossed in a
     few minutes — Sunrise to Dhuhr is not, but a prayer time that lands
     a minute after another would be — still gives a bar that moves
     smoothly rather than jumping, because it is a fraction and not a
     count. */
  const span = Math.max(1, target - from);
  const run = Math.min(1, Math.max(0, (now - from) / span));
  /* The bar is drawn in measured points rather than as a percentage.

     The pill shrinks to fit its contents — it carries a minWidth and sits
     in a centred wrapper — so the track's `100%` had no definite width to
     resolve against, and the fill was then a percentage of that. On the web
     the browser takes a second pass and the bar appears; on native the
     fraction collapsed and the fill measured zero, which is why the pill
     showed its countdown and no bar on Android. Measuring the track once
     and giving the fill a number makes it identical on every platform and
     independent of how the pill happens to be sized. */
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = trackWidth > 0 ? Math.round(trackWidth * run * 100) / 100 : 0;
  const left = Math.max(0, Math.floor((target - now) / 1000));
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left - hh * 3600) / 60);
  const ss = left - hh * 3600 - mm * 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  /* A reader who has asked for less motion still gets the fade — removing
     it would make the pill appear from nowhere — but not the slide. The
     range collapses to flat rather than swapping in a constant, so the
     value stays an interpolation and the transform keeps its type. */
  const opacity = scrollY.interpolate({ inputRange: [90, 150], outputRange: [0, 1], extrapolate: 'clamp' });
  const lift = scrollY.interpolate({ inputRange: [90, 150], outputRange: still ? [0, 0] : [-10, 0], extrapolate: 'clamp' });
  return <Animated.View pointerEvents="none" style={[s.nextPillWrap, { opacity, transform: [{ translateY: lift }] }]}>
    <View style={s.nextPill}>
      <View style={s.nextPillRow}>
        {ico('time-outline', 15, C.gold)}
        {/* prayerName rather than T: the six prayer names are not in the copy
            tables, they have their own, and looking them up through tx would
            hand an Arabic reader "Fajr" where the rest of the app says
            الفجر. */}
        <Text style={s.nextPillName}>{prayerName(language, prayer.name)}</Text>
        <Text style={s.nextPillDot}>·</Text>
        {/* Tabular-ish: the countdown changes every second, so the digits are
            padded and the whole thing is one string, to stop the pill from
            twitching as the seconds narrow and widen. */}
        <Text style={s.nextPillTime}>{`${hh}:${pad(mm)}:${pad(ss)}`}</Text>
      </View>
      {/* How much of the window has gone. The countdown alone says how
          long is left without saying how long there was, so a wait of
          four minutes out of four hours looks the same as one four
          minutes out of forty. This is the other half of that. */}
      <View
        style={s.nextPillTrack}
        onLayout={(e) => {
          const w = e?.nativeEvent?.layout?.width || 0;
          if (w > 0) setTrackWidth((prev) => (Math.abs(prev - w) > 0.5 ? w : prev));
        }}
      >
        <View style={[s.nextPillFill, { width: fillWidth }]} />
      </View>
    </View>
  </Animated.View>;
}

function makeConsistency() { return StyleSheet.create({

  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: C.line },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  streak: { fontFamily: 'Newsreader_600SemiBold', fontSize: 30, color: C.ink, letterSpacing: -1 },
  unit: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: C.green },
  label: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: C.muted, marginTop: 2 },
  pctBox: { alignItems: 'flex-end' },
  pct: { fontFamily: 'Newsreader_600SemiBold', fontSize: 26, color: C.green, letterSpacing: -.8 },
  pctLabel: { fontFamily: 'DMSans_600SemiBold', fontSize: 10.5, color: C.muted, letterSpacing: .3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  cell: { width: '8.6%', aspectRatio: 1, borderRadius: 4, margin: '0.7%' },
  note: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: C.muted, lineHeight: 17 }

});}
let consistency: Record<string, any> = makeConsistency();


/**
 * Thirty days of the user's own history. Nothing here is estimated or filled
 * in — a square is only as full as the prayers that were actually marked.
 */
function PrayerConsistency({ history, T }: { history: Record<string, string[]>; T: (s: string) => string }) {
  const streak = useMemo(() => prayerStreak(history), [history]);
  const cells = useMemo(() => {
    const out: { key: string; done: number }[] = [];
    const today = new Date();
    for (let back = 29; back >= 0; back -= 1) {
      const day = new Date(today);
      day.setDate(day.getDate() - back);
      const key = prayerDayKey(day);
      out.push({ key, done: PRAYER_FIVE.filter((p) => (history[key] || []).includes(p)).length });
    }
    return out;
  }, [history]);
  const marked = cells.reduce((sum, cell) => sum + cell.done, 0);
  const pct = Math.round((marked / (30 * 5)) * 100);
  const st = consistency;

  return (
    <View style={st.card}>
      <View style={st.top}>
        <View style={{ flex: 1 }}>
          <Text style={st.streak}>{streak} <Text style={st.unit}>{streak === 1 ? T('day') : T('days')}</Text></Text>
          <Text style={st.label}>{T('in a row with all five marked')}</Text>
        </View>
        <View style={st.pctBox}>
          <Text style={st.pct}>{pct}%</Text>
          <Text style={st.pctLabel}>{T('LAST 30 DAYS').toUpperCase()}</Text>
        </View>
      </View>
      <View style={st.grid}>
        {cells.map((cell) => (
          <View
            key={cell.key}
            style={[st.cell, { backgroundColor: cell.done ? C.green : C.line, opacity: cell.done ? 0.28 + (cell.done / 5) * 0.72 : 1 }]}
          />
        ))}
      </View>
      <Text style={st.note}>{T('Each square is one day, oldest first. The fuller the square, the more of the five you marked.')}</Text>
    </View>
  );
}

function PrayerScreen({navigation}:any) {
  const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const ar = language === 'ar';
  const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const [snap,setSnap]=useState<PrayerSnapshot|null>(null); const [cached,setCached]=useState(false); const [error,setError]=useState(''); const [completed,setCompleted]=useState<string[]>([]);
  const dateKey=new Date().toISOString().slice(0,10); useEffect(()=>{loadPrayerCompletion(dateKey).then(setCompleted)},[dateKey]);
  const [history,setHistory]=useState<Record<string,string[]>>({}); useEffect(()=>{loadPrayerHistory().then(h=>setHistory(h||{}))},[completed]);
  /* The next-prayer card carries the same slow drift and passing highlight as
     the Home hero, so the two read as the same app. `still` parks both when
     reduced motion is on, and the scene is drawn twice - once for light, once
     for dark - rather than dimming one picture to serve both. */
  const {dark,resolved}=useTheme(); const still=useCalmMotion();
  const prayerZoom=useDrift(30000,1,1.07,still); const prayerSheen=useDrift(20000,-0.85,0.85,still);
  const {width:prayerW}=useWindowDimensions();const nextH=Math.round(Math.max(190,Math.min((Math.min(prayerW,980)-40)/2.6,340)));
  /* The week ahead, from the same source today's times come from. Loaded for
     the month the week starts in and, if it runs over the end of that month,
     the month after it. */
  const [calendar,setCalendar]=useState<CalendarDay[]>([]);
  const [dayIndex,setDayIndex]=useState(0);

  useEffect(()=>{
    if(!location) return;
    let alive = true;
    const now = new Date();
    const months: [number, number][] = [[now.getFullYear(), now.getMonth()+1]];
    const spill = new Date(now.getFullYear(), now.getMonth(), now.getDate()+6);
    if (spill.getMonth() !== now.getMonth()) months.push([spill.getFullYear(), spill.getMonth()+1]);
    Promise.all(months.map(([y,mo])=>getPrayerCalendar(location.latitude, location.longitude, mo, y,
      { method: Number(settings.calculationMethod) || 8, school: settings.madhab, timeFormat: settings.timeFormat, timezone: location.timezone })))
      .then(parts => { if (alive) setCalendar(parts.flat()); })
      .catch(() => { if (alive) setCalendar([]); });
    return () => { alive = false; };
  }, [location?.latitude, location?.longitude, settings.calculationMethod, settings.madhab, settings.timeFormat]);
  const togglePrayer=(name:string)=>{if(name==='Sunrise')return;setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).catch(()=>{});return next})};
  const load=async()=>{if(!location)return;setError('');try{const value=await managedPrayerSnapshot(location,settings);setSnap(value.snapshot);setCached(value.cached);if(settings.remindersEnabled)schedulePrayerNotifications(value.snapshot,settings,rtl).catch(()=>{})}catch(e:any){setError(T(e.message))}}; useEffect(()=>{setSnap(null);load()},[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
  const next=snap?getNext(snap.prayers):undefined; const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d;}); const done=completed.length;
  /* Calendar days are keyed DD-MM-YYYY, so the week is matched against that
     rather than by index - the array starts at the first of the month, not
     at today. */
  const key=(d:Date)=>`${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  const chosen=days[dayIndex]||days[0];
  const chosenDay=calendar.find(c=>c.gregorian===key(chosen))||null;
  /* Today keeps the live snapshot, which carries the countdown; the rest of
     the week comes from the calendar. */
  const listedPrayers:Prayer[]=(dayIndex===0?snap?.prayers:(chosenDay?.prayers||snap?.prayers))||[];
  const listingToday=dayIndex===0;
  return <Page><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/><View style={s.prayerHeader}><View><Text style={s.prayerOverline}>{cached?T('SAVED ON DEVICE'):T('TODAY')}</Text><Text style={s.prayerTitle}>{T('Prayer times')}</Text></View><ToolGraphic tool="Qibla" size={52}/></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayStripScroll}><View style={s.dayStrip}>{days.map((d,i)=><Pressable key={i} accessibilityRole="button" accessibilityState={{selected:i===dayIndex}} accessibilityLabel={`${d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'long'})} ${d.getDate()}`} onPress={()=>setDayIndex(i)} style={[s.day,i===dayIndex&&s.dayActive]}><Text style={[s.dayName,i===dayIndex&&s.dayText]}>{d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'short'})}</Text><Text style={[s.dayNum,i===dayIndex&&s.dayText]}>{d.getDate()}</Text>{!calendar.length&&i>0&&<View style={s.dayDot}/>}</Pressable>)}</View></ScrollView>
    {!!chosenDay && dayIndex>0 && <Text style={s.dayChosen}>{ar?`${chosenDay.hijriDay} ${chosenDay.hijriMonthAr||chosenDay.hijriMonth} ${chosenDay.hijriYear} هـ`:tf(language,'{w} {g} · {d} {m} {y} AH',{w:chosenDay.weekday,g:chosenDay.gregorian,d:chosenDay.hijriDay,m:chosenDay.hijriMonth,y:chosenDay.hijriYear})}</Text>}
    {!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!snap?<SkeletonScreen rows={6} />:<><View style={[s.nextCard,{height:nextH}]}><Animated.View style={[StyleSheet.absoluteFill,{transform:[{scale:prayerZoom}]}]}><Image source={pickScene(SCENE_PRAYER, resolved)} resizeMode="cover" style={s.heroBg}/></Animated.View>{/* A scrim rather than a flat fill: the artwork shows through on the right and settles to near-solid behind the text on the left. */}<LinearGradient colors={isPal(resolved)?SCRIM.prayerPalestine:SCRIM.prayerIslamic} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><HeroAura still={still} palestine={isPal(resolved)} /><Animated.View pointerEvents="none" style={[s.heroSheen,{transform:[{translateX:Animated.multiply(prayerSheen,prayerW)},{skewX:'-16deg'}]}]}><LinearGradient colors={['rgba(255,255,255,0)','rgba(255,255,255,.16)','rgba(255,255,255,0)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/></Animated.View><View style={s.nextCardBody}>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.nextCardLabel}>{T('NEXT PRAYER')}</Text><Text style={s.nextCardName}>{next ? prayerName(language, next.name) : ''}</Text><Text style={s.nextCardTime}>{clockTime(language, next?.time || '')}</Text><View style={s.countPill}><Text style={s.countText}>{T('Begins in')} {next ? <PrayerCountdown raw={next.raw}/> : ''}</Text></View></View></View>
      <View style={s.prayerProgress}><View style={{flex:1}}><Text style={s.sourceTitle}>{T('Today’s Salah')}</Text><Text style={s.sourceBody}>{tf(language,'{d} of 5 prayers marked complete',{d:done})}</Text></View><View style={s.progressTrack}><View style={[s.progressFill,{width:`${done*20}%`} as any]}/></View><Text style={s.progressCount}>{done}/5</Text></View>
      <Section title={T('Your consistency')}/>
      <PrayerConsistency history={history} T={T}/>
      <Section title={T('Today’s schedule')}/>
      <View style={s.prayerList}>{listedPrayers.map((p,i)=>{const checked=listingToday&&completed.includes(p.name);return <Pressable accessibilityRole={!listingToday||p.name==='Sunrise'?undefined:'checkbox'} accessibilityState={!listingToday||p.name==='Sunrise'?undefined:{checked}} onPress={()=>listingToday&&togglePrayer(p.name)} key={p.name} style={[s.prayerRow,p.name===next?.name&&s.prayerRowLive]}><View style={[s.prayerSymbol,checked&&s.prayerSymbolDone]}>{checked ? ico('checkmark',21,C.white) : <Image source={prayerIconFor(p.name, resolved)} resizeMode="contain" style={{width:32,height:32}}/>}</View><View style={{flex:1}}><Text style={s.prayerName}>{prayerName(language, p.name)}</Text><Text style={s.meta}>{T(p.name==='Sunrise'?'Solar event':checked?'Completed':!listingToday?'':p.name===next?.name?'Up next':'Tap to mark complete')}</Text></View><Text style={s.prayerValue}>{clockTime(language, p.time)}</Text>{p.name!=='Sunrise'&&ico(checked?'checkmark-circle':'ellipse-outline',18,checked?C.green:C.muted)}</Pressable>})}</View>
          </>}
  </ScrollView></Page>;
}

/**
 * One surah in the list. Memoised, because the search field that filters it
 * lives in the same component: without this, every keystroke redraws the lot.
 */
const SurahRow = React.memo(/**
 * One Surah as a row.
 *
 * It used to be a card with a chip on its own line, which meant three lines of
 * its own before you got to the next one: about ten Surahs to a screen. This is
 * two lines of text in one row - number, name, meaning, length, where it was
 * revealed, Arabic name - and nothing that is not one of those.
 *
 * The ring on the right only appears when there is something to show. A ring
 * at zero on all 114 rows would be a hundred ornaments saying nothing.
 */
function SurahRow({ chapter, onOpen, hifz }: {
  chapter: Chapter; onOpen: (chapter: Chapter) => void; hifz?: HifzStatus;
}) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const makki = chapter.revelation_place === 'makkah';
  const memorized = hifz === 'memorized';
  const revising = hifz === 'revising';
  return <MotionPress accessibilityLabel={`${chapter.id}. ${chapter.name_simple}. ${chapter.translated_name?.name || ''}. ${chapter.verses_count} ${T('verses')}`}
    onPress={() => onOpen(chapter)} style={s.surahCard}>
    {/* MotionPress renders its children in a column, so the row has to be
        declared here or the number, the name and the Arabic stack up rather
        than sitting side by side. */}
    <View style={s.surahRowInner}>
      <View style={s.surahMedal}><Text style={s.surahMedalText}>{chapter.id}</Text></View>
      <View style={{ flex: 1 }}>
        {/* The Arabic name sits beside the transliteration rather than out
            at the far end of the row, so the two are read together. It goes
            first in whichever direction that screen reads, which is why it
            is placed on either side of the name rather than being fixed. */}
        <View style={s.surahNameRow}>
          {rtl && <Text style={s.surahArInline}>{chapter.name_arabic}</Text>}
          <Text style={s.surahName} numberOfLines={1}>{chapter.name_simple}</Text>
          {!rtl && <Text style={s.surahArInline}>{chapter.name_arabic}</Text>}
        </View>
        <Text style={s.meta} numberOfLines={1}>
          {chapter.translated_name?.name} · {chapter.verses_count} {T('verses')} · {T(makki ? 'Makki' : 'Madani')}
        </Text>
      </View>
      <View style={s.surahRight}>
        {(memorized || revising) && <View style={[s.surahRing, revising && s.surahRingHalf]}>
          {memorized ? ico('checkmark', 11, C.white) : <View style={s.surahRingDot} />}
        </View>}
      </View>
    </View>
  </MotionPress>;
});
function QuranHome({navigation}:any){const{dark,resolved}=useTheme();
 const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
 const{width}=useWindowDimensions();const qHeroH=Math.round(Math.max(225,Math.min((Math.min(width,980)-40)/2.15,400)));const[chapters,setChapters]=useState<Chapter[]>([]);const[query,setQuery]=useState('');const[debounced,setDebounced]=useState('');const[expanded,setExpanded]=useState(false);const[error,setError]=useState('');const[position,setPosition]=useState<any>(null);const[bookmarkCount,setBookmarkCount]=useState(0);const[noteCount,setNoteCount]=useState(0);const[recent,setRecent]=useState<number[]>([]);const[plan,setPlanState]=useState<any>(null);const[hifz,setHifzState]=useState<Record<number,HifzStatus>>({});const[preload,setPreload]=useState(getPreloadState());const[gridW,setGridW]=useState(0);const{preferences}=useQuranPreferences();
 const load=()=>getChapters().then(setChapters).catch(e=>setError(T(e.message)));const hydrate=()=>Promise.all([loadReadingPosition().then(setPosition),loadBookmarks().then(x=>setBookmarkCount(x.length)),loadNotes().then(x=>setNoteCount(x.length)),loadRecentSurahs().then(setRecent),loadPlan().then(setPlanState),loadHifz().then(setHifzState),loadAudioSettings().then(value=>setAudioReciter(value.reciterName))]);useEffect(()=>{load();hydrate();resumeSavedQuranPreload();const unsubscribePreload=subscribePreload(setPreload);const unsubscribeFocus=navigation.addListener('focus',hydrate);return()=>{unsubscribePreload();unsubscribeFocus()}},[navigation]);useEffect(()=>{const id=setTimeout(()=>setDebounced(query.trim()),250);return()=>clearTimeout(id)},[query]);
 const shown=chapters.filter(c=>`${c.id} ${c.name_simple} ${c.name_arabic} ${c.translated_name?.name}`.toLowerCase().includes(debounced.toLowerCase()));const visible=expanded||debounced.length>0?shown:shown.slice(0,30);const openSurah=useCallback((chapter:Chapter)=>navigation.navigate('Reader',{chapter,mode:'both'}),[navigation]);const open=(chapter:Chapter,mode='both',focusVerse?:string)=>navigation.navigate('Reader',{chapter,mode,focusVerse});const featured={id:55,name_simple:'Ar-Rahman',name_arabic:'الرحمن',translated_name:{name:'The Most Merciful'},verses_count:78};const submit=()=>{const ref=query.match(/^(\d{1,3}):(\d{1,3})$/);if(ref){const chapter=chapters.find(c=>c.id===Number(ref[1]));if(chapter)return open(chapter,'both',query)}navigation.navigate('Quran Search',{initialQuery:query})};
 const[audioReciter,setAudioReciter]=useState(T('Choose a reciter'));const memorized=Object.values(hifz).filter(value=>value==='memorized').length;const contentWidth=Math.min(Math.max(width-36,280),980);
const gridGap=8;const gridCols=gridW>=640?10:4;const tileW=gridW?Math.floor((gridW-gridGap*(gridCols-1))/gridCols):0;
const exploreTools:{label:string;title:string;screen:string;tab?:string;params?:Record<string,any>;tool?:string}[]=[{label:'Transliteration',title:T('Transliteration'),screen:'Transliteration',tool:'Transliteration'},{label:'30 Juz',title:T('Juz'),screen:'Juz Directory',tool:'Juz'},{label:'60 Hizb',title:T('Hizb'),screen:'Hizb Directory',tool:'Hizb'},{label:'Quran Topics',title:T('Topics'),screen:'Quran Topics',tool:'Topics'},{label:'Translation Compare',title:T('Tafsir'),screen:'Tafsir Compare',tool:'Tafsir'},{label:'Tajweed',title:T('Tajweed'),screen:'Tajweed Study',tool:'Tajweed'},{label:'Quran Vocabulary',title:T('Vocab'),screen:'Quran Vocabulary',tool:'Vocab'},{label:'Khatam',title:T('Khatam'),screen:'Khatam',tool:'Khatam'},{label:'Recitations',title:T('Audio'),screen:'Quran Audio',tool:'Audio'}];
const compactStats=[{label:'Bookmarks',title:T('Bookmarks'),value:String(bookmarkCount),screen:'Bookmarks',icon:'bookmark-outline',tool:'Bookmarks'},{label:'Notes',title:T('Notes'),value:String(noteCount),screen:'Notes',icon:'create-outline',tool:'Notes'},{label:'Reading Plans',title:T('Plans'),value:plan?`${plan.days}d`:'—',screen:'Reading Plans',icon:'calendar-outline',tool:'Reading Plans'},{label:'Hifz',title:T('Hifz'),value:String(memorized),screen:'Hifz',icon:'school-outline',tool:'Hifz'},{label:'Offline Quran',title:T('Offline'),value:`${preload.cached}/114`,screen:'Quran Preload',icon:'download-outline',tool:'Offline Quran'}];
 return <Page><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/>
 <View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput accessibilityLabel={T('Search the Quran')} value={query} onChangeText={setQuery} onSubmitEditing={submit} returnKeyType="search" style={s.searchInput} placeholder={T('Search Surah, meaning, or 2:255')} placeholderTextColor={C.muted}/>{query.length>0&&<Pressable accessibilityLabel={T('Clear Quran search')} onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}</View>
 {position&&<Pressable onPress={()=>{const chapter=chapters.find(c=>c.id===position.surahId);if(chapter)open(chapter,'both',position.verseKey)}} style={s.continueBar}><ToolGraphic tool="Quran Arabic" size={54}/><View style={{flex:1}}><Text style={s.dailyKicker}>{T('CONTINUE READING')}</Text><Text style={s.settingName}>{position.surahName} · {position.verseKey}</Text><Text style={s.meta}>{tf(language,'Page {p} · saved locally',{p:position.page || '—'})}</Text></View>{ico(rtl ? 'arrow-back' : 'arrow-forward',18,C.green)}</Pressable>}
 <View style={[s.quranHero,{height:qHeroH}]}><View style={StyleSheet.absoluteFill}><Image source={pickScene(SCENE_QURAN, resolved)} resizeMode="cover" style={s.heroBg}/></View><LinearGradient colors={isPal(resolved)?SCRIM.quranPalestine:SCRIM.quranIslamic} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><Text style={s.quranArabic}>الرَّحْمَٰن</Text><Text style={s.quranHeroTitle}>{T('Read. Listen. Reflect.')}</Text><Text style={s.quranHeroMeta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text><View style={s.heroActions}><Tactile style={s.whiteButton} onPress={()=>open(featured)}><Text style={s.whiteButtonText}>{T('Start reading')}</Text>{ico('play',13,C.green)}</Tactile><Pressable style={s.ghostHeroButton} onPress={()=>navigation.navigate('Quran Audio')}><Text style={s.ghostHeroText}>{T('Listen')}</Text>{ico('headset-outline',13,C.white)}</Pressable></View></View>
 <Section title={T('Explore')}/>
 <View style={s.qTileGrid} onLayout={e=>setGridW(e.nativeEvent.layout.width)}>{exploreTools.map((item,i)=><MotionPress key={item.label} index={i} testID={`qtile-${item.label}`} onPress={()=>item.tab?navigation.navigate(item.tab,{screen:item.screen,params:item.params||{}}):navigation.navigate(item.screen,item.params||{})} style={[s.qTile,tileW?{width:tileW}:{flex:1,minWidth:60}]} contentStyle={s.qTileInner}><ToolGraphic tool={item.tool||item.label} size={40}/><Text numberOfLines={2} style={s.qTileLabel}>{item.title}</Text></MotionPress>)}</View>
 <Section title={T('Your Quran')}/>
 <View style={s.qStatRow}>{compactStats.map((item,i)=><MotionPress key={item.label} index={i} testID={`qstat-${item.label}`} onPress={()=>navigation.navigate(item.screen)} style={s.qStat}><View style={s.qStatIcon}>{item.tool?<Image source={toolImage(item.tool,dark,resolved)} resizeMode="contain" style={{width:24,height:24}}/>:ico(item.icon,17,C.green)}</View><Text style={s.qStatValue}>{item.value}</Text><Text numberOfLines={1} style={s.qStatLabel}>{item.title}</Text></MotionPress>)}</View>
 <Section title={T('Reading preferences')}/>
 <View style={s.quranPreferenceRow}><Pressable onPress={()=>navigation.navigate('Reader Settings')} style={s.quranPreferenceCard}><ToolGraphic tool="Reader Settings" size={56}/><View style={{flex:1}}><Text style={s.settingName}>{T('Script & display')}</Text><Text numberOfLines={1} style={s.meta}>{T(preferences.scriptName)} · {T(QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.short || '')} · {preferences.fontSize}px</Text></View>{ico(rtl ? 'arrow-back' : 'arrow-forward',17,C.green)}</Pressable><Pressable onPress={()=>navigation.navigate('Translations')} style={s.quranPreferenceCard}><ToolGraphic tool="Translations" size={56}/><View style={{flex:1}}><Text style={s.settingName}>{T('Translation')}</Text><View style={s.metaRow}><Flag code={languageOf(preferences.translationEdition, preferences.translationLanguage)} size={12} /><Text numberOfLines={1} style={s.meta}>{T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text></View></View>{ico(rtl ? 'arrow-back' : 'arrow-forward',17,C.green)}</Pressable></View>
 
 {recent.length>0&&<><Section title={T('Recent Surahs')}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingRight: 16}}>{recent.map(id=>{const c=chapters.find(x=>x.id===id);return c?<Pressable key={id} onPress={()=>open(c)} style={s.recentChip}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.surahAr}>{c.name_arabic}</Text></Pressable>:null})}</ScrollView></>}
 <Section title={T('All surahs')} action={tf(language,'{n} chapters',{n:shown.length})}/>{error?<ErrorState message={error} retry={load}/>:!chapters.length?<SkeletonList rows={8} />:<View style={s.surahList}>{visible.map(c=><SurahRow key={c.id} chapter={c} onOpen={openSurah} hifz={hifz[c.id]}/>)}{visible.length<shown.length&&<Pressable accessibilityRole="button" accessibilityLabel={T('Show all')} onPress={()=>setExpanded(true)} style={s.surahMore}><Text style={s.surahMoreText}>{T('Show all')} · {shown.length}</Text></Pressable>}</View>}</ScrollView></Page>
}
/**
 * The one Quran reader.
 *
 * Everything the app reads - a Surah, a Juz, a Hizb or a single Mushaf page -
 * is rendered here, so the reading experience, the script, the font and the
 * Juz / Hizb markers are configured in exactly one place. Entry points such as
 * the Juz directory or the Mushaf tool simply pass a different `section`, and
 * choosing "Mushaf page" as the Arabic script switches this same screen to the
 * paged layout instead of sending the reader somewhere else.
 */
function ReaderScreen({route,navigation}:any){
  /* Below this the header cannot hold both the step arrows and a readable
     title, so the arrows - reachable from the list anyway - stand down. */
  const narrow=(useWindowDimensions().width)<360;
  const chapter:Chapter|undefined=route.params?.chapter;
  const section:'surah'|'juz'|'hizb'|'page'=route.params?.section||'surah';
  const juz:number=Math.max(1,Math.min(30,Number(route.params?.juz||1)));
  const hizb:number=Math.max(1,Math.min(60,Number(route.params?.hizb||1)));
  const initial=route.params?.mode||'both';
  const focusVerse=route.params?.focusVerse;
  const{preferences,update}=useQuranPreferences();
  /* "Mushaf page" is a script like Uthmani or IndoPak, not a separate screen. */
  const isMushaf=preferences.scriptEdition==='quran-mushaf';
  /* Arabic is always shown and the translation follows the preference, which
     lives in Reading Settings. There used to be two buttons above the ayahs
     for this; they duplicated what the settings screen already offered, and
     hiding the Arabic in a Quran reader is not something anyone asked to do. */
  const[verses,setVerses]=useState<Verse[]>([]);
  const[page,setPage]=useState<number|null>(route.params?.page?Math.max(1,Math.min(604,Number(route.params.page))):null);
  const[input,setInput]=useState(String(route.params?.page||''));
  const[bookmarks,setBookmarks]=useState<QuranBookmark[]>([]);
  const[error,setError]=useState('');
  const[cached,setCached]=useState(false);
  /* The progress bar used to be driven by a state value, which meant every
     scroll event re-rendered this component — and with it all 286 ayahs of
     a long surah — to move a bar that a native animation can move without
     touching React at all. The bar now reads an animated value, and the
     height it is measured against is recorded once per surah rather than
     on every frame. */
  const progressY = useRef(new Animated.Value(0)).current;
  const[scrollSpan,setScrollSpan]=useState(1);
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);
  /* One place that works out how far there is to scroll, since the two
     events that feed it — the view's height and the content's — arrive in
     either order. */
  const measureSpan = useCallback(() => {
    const next = contentHeight.current - viewportHeight.current;
    if (next > 0) setScrollSpan(next);
  }, []);
  const progressWidth = useMemo(
    () => progressY.interpolate({ inputRange: [0, Math.max(1, scrollSpan)], outputRange: ['0%', '100%'], extrapolate: 'clamp' }),
    [progressY, scrollSpan],
  );
  const scrollRef=useRef<any>(null);
  /* Which ayah has been scrolled to already, rather than a bare yes/no.
      A flag meant the reader restored its position the first time and then
      never again, so continuing from a notification into a surah that was
      already open updated the verse and left the page where it was. */
  const restoredFor=useRef<string|null>(null);
  const verseRefs=useRef<Record<string,any>>({});
  const scrollY=useRef(0);
  const {rtl,language}=useLanguage();
  const ar = language === 'ar';
  const T=(text:string)=>tx(language,text);
  const[target,setTarget]=useState<string|null>(focusVerse||null);
  /* Where each ayah sits inside the scroll content, measured once per layout.
     Measuring during a scroll would be far too expensive to repeat for every
     verse on every frame, so the offsets are taken after the list settles and
     then simply looked up. Anything that changes the height of the page -
     turning the translation off, changing the font - makes them stale, so
     they are retaken when any of that changes. */
  const offsets=useRef<Record<string,number>>({});
  const lastSavedVerse=useRef<string>('');
  const[savedPosition,setSavedPosition]=useState<ReadingPosition|null>(null);
  const[shareVerse,setShareVerse]=useState<Verse|null>(null);
  const[noteVerse,setNoteVerse]=useState<Verse|null>(null);
  const[actionsVerse,setActionsVerse]=useState<Verse|null>(null);
  /* Focus mode. Scrolling down takes the chrome away; tapping a verse brings
     it back. It is never hidden leaving the screen, and it is never hidden
     when focus mode is off, so the toggle is the only thing that changes how
     the reader behaves. */
  const focusOn=!!preferences.focusMode;
  const[chromeShown,setChromeShown]=useState(true);
  const chromeY=useRef(new Animated.Value(0)).current;
  const revealChrome=()=>{if(focusOn)setChromeShown(true)};
  useEffect(()=>{
    if(!focusOn){setChromeShown(true);return}
    Animated.timing(chromeY,{toValue:chromeShown?0:-140,duration:200,useNativeDriver:true}).start();
    setChromeHidden(!chromeShown);
  },[chromeShown,focusOn,chromeY]);
  useEffect(()=>()=>setChromeHidden(false),[]);
  /* `target` starts from the route, but useState only ever reads it once.
     Continuing into a surah you already had open updated the chapter and left
     the target behind, so the reader landed at the top instead of the ayah. */
  useEffect(()=>{setTarget(focusVerse||null)},[focusVerse]);
  /* Landing on the right ayah. `onLayout` cannot do this: the y it reports is
     the gap since the previous sibling - about 12px for every verse - not the
     offset inside the scroll content, so every continuation scrolled to the
     top of the surah. Measuring the verse and the scroll view in page
     coordinates and adding the current offset gives the real position. */
  useEffect(()=>{
    if(!target||!verses.length||restoredFor.current===target)return;
    const node=verseRefs.current[target];
    if(!node)return;
    restoredFor.current=target;
    const timer=setTimeout(()=>{
      node.measure?.((_x:number,_y:number,_w:number,_h:number,_px:number,py:number)=>{
        scrollRef.current?.measure?.((
          _sx:number,_sy:number,_sw:number,_sh:number,_spx:number,spy:number,
        )=>{
          const offset=(py-spy)+scrollY.current;
          scrollRef.current?.scrollTo({y:Math.max(0,offset-88),animated:false});
        });
      });
    },120);
    return()=>clearTimeout(timer);
  },[verses,target]);
  useEffect(()=>{let live=true;loadReadingPosition().then(p=>{if(live)setSavedPosition(p)});return()=>{live=false}},[savedPosition?.verseKey]);
  const[chapters,setChapters]=useState<Chapter[]>([]);
  const chapterId=chapter?.id||Number(focusVerse?.split(':')[0]||1);
  const full:Chapter=chapters.find(c=>c.id===chapterId)??(chapter||{id:chapterId,name_simple:'',name_arabic:'',verses_count:0} as Chapter);
  /* IndoPak and the Mushaf page both fall back to the Uthmani text, which is
     then rendered by the appropriate font. */
  const scriptFor=(id:string)=>(id==='quran-indopak'||id==='quran-mushaf')?'quran-uthmani':id;
  const hizbOf=(v:Verse)=>v.hizbQuarter?Math.ceil(v.hizbQuarter/4):0;
  const opts=()=>({script:scriptFor(preferences.scriptEdition),translation:preferences.translationEdition});
  const cacheKey=readerCacheKey({section,chapterId,juz,hizb,page,script:preferences.scriptEdition,translation:preferences.translationEdition});
  const load=async()=>{setError('');setVerses([]);restoredFor.current=null;progressY.setValue(0);const o=opts();const local=await loadSurahCache(cacheKey) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=(isMushaf&&page!==null)?await getPageVerses(page,o):section==='juz'?await getJuzVerses(juz,o):section==='hizb'?await getHizbVerses(hizb,o):section==='page'?await getPageVerses(Number(route.params?.page||1),o):await getVerses(chapterId,o);setVerses(fresh);setCached(false);await saveSurahCache(cacheKey,fresh)}catch(e:any){if(!local)setError(T(e.message))}};
  useEffect(()=>{load();loadBookmarks().then(setBookmarks);if(section==='surah'&&!isMushaf)void logSurahOpen(chapterId);if(isMushaf&&page!==null)void logMushafPage(page)},[section,chapterId,juz,hizb,page,isMushaf,preferences.scriptEdition,preferences.translationEdition]);
  /* Entering the Mushaf script from a Surah, Juz or Hizb opens it on the page
     where that section begins. */
  useEffect(()=>{if(!isMushaf||page!==null||section==='page')return;let live=true;const o=opts();const p=section==='juz'?getJuzVerses(juz,o):section==='hizb'?getHizbVerses(hizb,o):getVerses(chapterId,o);p.then(v=>{if(live&&v.length)setPage(v[0].page||1)}).catch(()=>undefined);return()=>{live=false}},[isMushaf,page,section,chapterId,juz,hizb,preferences.scriptEdition,preferences.translationEdition]);
  useEffect(()=>{getChapters().then(setChapters)},[]);
  useEffect(()=>{if(focusVerse){setTarget(focusVerse);return}let live=true;loadReadingPosition().then(pos=>{if(live&&pos&&pos.surahId===chapterId)setTarget(pos.verseKey)});return()=>{live=false}},[chapterId,focusVerse]);
  useEffect(()=>{if(page!==null)setInput(String(page))},[page]);
  useEffect(()=>{
    offsets.current={};
    const take=()=>{
      for(const v of verses){
        const node=verseRefs.current[v.verse_key];
        node?.measure?.((_x:number,_y:number,_w:number,_h:number,_px:number,py:number)=>{
          offsets.current[v.verse_key]=py;
        });
      }
    };
    const timer=setTimeout(take,260);
    return()=>clearTimeout(timer);
  },[verses,preferences.arabicFont,preferences.fontSize,preferences.translationFontSize,preferences.showTranslation,preferences.showTransliteration]);

  /* Keeping the reading position live.
     Continuing used to resume wherever you last pressed "save reading
     position" - which for most people is nowhere, because nothing ever
     recorded where they actually were. The ayah nearest the top of the screen
     is now saved as they read, so leaving a surah and coming back returns to
     the verse they left instead of the beginning. */
  const rememberTimer=useRef<any>(null);
  const rememberPosition=useCallback(()=>{
    const entries=Object.entries(offsets.current);
    if(!entries.length||!verses.length)return;
    const at=scrollY.current+96;
    let bestKey='';let bestDelta=Infinity;
    for(const[key,y]of entries){
      const delta=Math.abs(y-at);
      if(delta<bestDelta){bestDelta=delta;bestKey=key;}
    }
    if(!bestKey||bestKey===lastSavedVerse.current)return;
    const v=verses.find(x=>x.verse_key===bestKey);
    if(!v)return;
    lastSavedVerse.current=bestKey;
    void saveReadingPosition({
      surahId:Number(v.verse_key.split(':')[0])||chapterId,
      surahName:v.surah_name||full.name_simple,
      verseKey:v.verse_key,
      ayah:Number(v.verse_key.split(':')[1]),
      page:v.page,updatedAt:Date.now(),
    });
  },[verses,chapterId,full?.name_simple]);

  const bookmark=async(v:Verse)=>setBookmarks(await toggleBookmark({verseKey:v.verse_key,surahId:Number(v.verse_key.split(':')[0])||chapterId,surahName:v.surah_name||full.name_simple,arabic:v.text_uthmani,translation:v.translation,savedAt:Date.now()}));
  const isMarked=(v:Verse)=>savedPosition?.verseKey===v.verse_key;
  const mark=async(v:Verse)=>{const surahId=Number(v.verse_key.split(':')[0])||chapterId;await saveReadingPosition({surahId,surahName:v.surah_name||full.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});void logVerseRead(v.verse_key,surahId,v.page);setSavedPosition({surahId,surahName:v.surah_name||full.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});
    /* No dialog. Marking where you are is something done every few minutes
       while reading, and a modal that has to be dismissed each time turns a
       quiet act of keeping your place into an interruption. The button itself
       answers: it fills in and stays filled on the verse that is marked, and
       the tap is haptic. That is the whole confirmation the act warrants. */};
  const share=(v:Verse)=>Share.share({message:`${v.text_uthmani}\n\n${v.translation||''}\n\nQuran ${v.verse_key} · ${preferences.translationName}`});
  const goPage=(value:number)=>setPage(Math.max(1,Math.min(604,value)));
  /**
   * Reading a Mushaf page counts towards the khatam.
   *
   * Turning the page is the only signal needed — there is nothing to confirm
   * and nothing to remember to do. Reaching the last page closes the reading
   * on its own inside the service.
   */
  useEffect(()=>{if(page!==null) void markPageRead(page)},[page]);
  const title=section==='juz'?(tf(language,'Juz {n}',{n:juz})):section==='hizb'?(tf(language,'Hizb {n}',{n:hizb})):section==='page'||isMushaf?(tf(language,'Mushaf page {n}',{n:page||1})):full.name_simple;
  const subtitle=(isMushaf||section==='page')?((cached?(tx(language, 'Offline · ')):'')+(verses.length?(verses[0].surah_name||''):'')):section==='juz'?(ar?`الأرباع ${(juz-1)*8+1}–${juz*8}`:tf(language,'HIZBS {a}–{b}',{a:(juz-1)*2+1,b:juz*2})):section==='hizb'?(tf(language,'QUARTERS {a}–{b}',{a:(hizb-1)*4+1,b:hizb*4})):(cached?(tx(language, 'Available offline · ')):'')+`${full.verses_count}${tx(language, ' verses')}`;
  /* Stepper: Surah to Surah, Juz to Juz, Hizb to Hizb. The Mushaf script pages
     instead, using the controls above the page itself. */
  const step=(delta:number)=>{if(section==='juz')navigation.replace('Reader',{section:'juz',juz:juz+delta});else if(section==='hizb')navigation.replace('Reader',{section:'hizb',hizb:hizb+delta});else{const i=chapters.findIndex(c=>c.id===chapterId);const next=chapters[i+delta];if(next)navigation.replace('Reader',{chapter:next})}};
  const canStep=(delta:number)=>{if(section==='juz')return delta<0?juz>1:juz<30;if(section==='hizb')return delta<0?hizb>1:hizb<60;if(isMushaf||section==='page')return false;const i=chapters.findIndex(c=>c.id===chapterId);return i<0?false:!!chapters[i+delta]};
  const arStyle=[{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}];
  /* Both sheets go through the overlay layer so the floating tab bar and the
     mini player sit behind them instead of across their lower edge. */
  useOverlaySheet('verse-share', !!shareVerse, () => shareVerse
    ? <VerseShareSheet verse={shareVerse} chapter={full} rtl={rtl} T={T} onClose={()=>setShareVerse(null)}/>
    : null, () => setShareVerse(null));
  useOverlaySheet('verse-note', !!noteVerse, () => noteVerse
    ? <VerseNoteSheet verse={noteVerse} chapter={full} rtl={rtl} T={T} onClose={()=>setNoteVerse(null)}/>
    : null, () => setNoteVerse(null));
  useOverlaySheet('verse-actions', !!actionsVerse, () => actionsVerse
    ? <VerseActionsSheet verse={actionsVerse} chapter={full} rtl={rtl} T={T} language={language} navigation={navigation} onClose={()=>setActionsVerse(null)}/>
    : null, () => setActionsVerse(null));
  return <Page><Animated.View style={[s.readerBar,{transform:[{translateY:chromeY}]}]}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>goBackOrHome(navigation)}/>{!narrow&&(canStep(-1)?<Pressable accessibilityLabel={T('Previous section')} onPress={()=>step(-1)} style={s.surahStep}>{ico(rtl?'chevron-forward':'chevron-back',19,C.ink)}</Pressable>:<View style={s.surahStep}/>)}<View style={{alignItems:'center',flex:1}}><Text style={s.readerName} numberOfLines={1}>{title}</Text><Text style={s.meta} numberOfLines={1}>{subtitle}</Text></View>{!narrow&&(canStep(1)?<Pressable accessibilityLabel={T('Next section')} onPress={()=>step(1)} style={s.surahStep}>{ico(rtl?'chevron-back':'chevron-forward',19,C.ink)}</Pressable>:<View style={s.surahStep}/>)}<View style={s.readerHeaderActions}>{section==='surah'&&<Pressable accessibilityLabel={T('Play this Surah')} onPress={()=>{void playSurahFromReader(full,rtl)}} style={s.readerIconBtn}>{ico('play-circle',20,C.ink)}</Pressable>}{section==='surah'&&<Pressable accessibilityLabel={T('Keep this Surah for offline')} onPress={()=>navigation.navigate('Downloads',{chapterId,surahName:full.name_simple})} style={s.readerIconBtn}>{ico('download-outline',20,C.ink)}</Pressable>}<Pressable accessibilityRole="switch" accessibilityState={{checked:focusOn}} accessibilityLabel={`${T('Focus mode')}: ${focusOn?T('On'):T('Off')}`} onPress={()=>update({focusMode:!focusOn})} style={s.readerIconBtn}>{ico(focusOn?'eye':'eye-outline',20,focusOn?C.gold:C.ink)}</Pressable><Pressable accessibilityLabel={T('Reader settings')} onPress={()=>navigation.navigate('Reader Settings')} style={s.readerIconBtn}>{ico('options-outline',20,C.ink)}</Pressable></View></Animated.View><View style={s.readerProgress}><Animated.View style={[s.preloadFill,{width:progressWidth as any}]}/></View>
  <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} ref={scrollRef} contentContainerStyle={s.readerScroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event(
    [{nativeEvent:{contentOffset:{y:progressY}}}],
    {useNativeDriver:false,listener:(e:any)=>{const{contentOffset}=e.nativeEvent;if(focusOn){const dy=contentOffset.y-scrollY.current;if(dy>4&&chromeShown)setChromeShown(false)}scrollY.current=contentOffset.y;
    if(rememberTimer.current)clearTimeout(rememberTimer.current);
    rememberTimer.current=setTimeout(rememberPosition,700);}})}
  onContentSizeChange={(w:number,h:number)=>{contentHeight.current=h;measureSpan();}}
  onLayout={e=>{viewportHeight.current=e.nativeEvent.layout.height;measureSpan();}}
  /* On Android only. A long surah keeps several hundred ayahs mounted, and
     this lets the platform drop the offscreen ones out of the native
     hierarchy instead of composing all of them — the single largest win
     available on a phone, where the long surahs were reported as slow. It
     is left off elsewhere: on iOS it has a history of leaving blank
     patches behind, and on the web it does nothing at all. */
  removeClippedSubviews={Platform.OS==='android'}>
  {isMushaf?<MushafPageView page={page||1} verses={verses} error={error} cached={cached} retry={load} preferences={preferences} rtl={rtl} T={T} language={language} input={input} setInput={setInput} goPage={goPage} navigation={navigation} arStyle={arStyle} bookmarks={bookmarks} savedPosition={savedPosition} onBookmark={(v:any)=>{void bookmark(v)}} onMark={(v:any)=>{void mark(v)}} onPlay={(v:any)=>{void playFromReader(full,v,rtl)}} onNote={(v:any)=>setNoteVerse(v)}/>
  :<>
  {section==='surah'&&<LinearGradient colors={[C.heroA,C.green]} style={s.surahHead}>{!!cached&&<LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.surahHeadAr}>{full.name_arabic}</Text><Text style={s.surahHeadEn}>{chapter?.translated_name?.name}</Text><Text style={s.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text></LinearGradient>}
  {error?<ErrorState message={error} retry={load}/>:!verses.length?<SkeletonList rows={7} />:verses.map((v,i)=>{const saved=bookmarks.some(x=>x.verseKey===v.verse_key);const prev=i>0?verses[i-1]:null;const newJuz=!!v.juz&&(!prev||prev.juz!==v.juz);const newHizb=!!hizbOf(v)&&(!prev||hizbOf(prev)!==hizbOf(v));return <View key={v.id||v.verse_key}>
  {newJuz&&<View style={s.sectionMarker}><View style={s.sectionRule}/><Text style={s.sectionMarkerText}>{tf(language,'JUZ {n}',{n:v.juz ?? ''})}</Text><View style={s.sectionRule}/></View>}
  {newHizb&&<View style={s.sectionMarker}><View style={s.sectionRule}/><Text style={s.sectionMarkerText}>{tf(language,'HIZB {n}',{n:hizbOf(v)})}</Text><View style={s.sectionRule}/></View>}
  <Pressable ref={(node:any)=>{verseRefs.current[v.verse_key]=node}} delayLongPress={500} onLongPress={()=>setNoteVerse(v)} onPress={()=>revealChrome()} style={[s.ayah,preferences.readingMode==='continuous'&&s.ayahContinuous,focusVerse===v.verse_key&&s.ayahSelected]}>
  <View style={s.ayahTop}><Text style={s.ayahNo}>{v.verse_key}</Text><View style={s.ayahActions}>
    <VerseActionButton label={`${T('Play verse')} ${v.verse_key}`} name="play-circle" size={22} onPress={()=>{void playFromReader(full,v,rtl)}}/>
    <VerseActionButton label={`${T('Mark position at')} ${v.verse_key}`} name={isMarked(v)?'locate':'locate-outline'} size={19} active={isMarked(v)} onPress={()=>mark(v)} haptic="success"/>
    <VerseActionButton label={`${saved?T('Remove bookmark from'):T('Bookmark')} ${T('verse')} ${v.verse_key}`} name={saved?'bookmark':'bookmark-outline'} size={19} active={saved} onPress={()=>bookmark(v)}/>
    <VerseActionButton label={`${T('Share')} ${T('verse')} ${v.verse_key}`} name="share-outline" size={19} onPress={()=>setShareVerse(v)}/>
    <VerseActionButton label={`${T('More actions for verse')} ${v.verse_key}`} name="ellipsis-horizontal-circle-outline" size={20} onPress={()=>setActionsVerse(v)}/>
  </View></View>
  {preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,...arStyle]}/>:<Text style={[s.ayahAr,...arStyle]}>{v.text_uthmani}</Text>}
  {preferences.showTranslation&&v.translation?<Text style={s.ayahTranslation}>{v.translation}</Text>:null}
  {section!=='surah'&&<Text style={s.dataMeta}>{v.surah_name}</Text>}
  <View style={s.ayahFooter}><Text style={s.ayahMeta}>{tf(language,'Juz {j} · Page {p}',{j:v.juz ?? '',p:v.page ?? ''})}{section==='hizb'?(tf(language,' · Quarter {n}',{n:v.hizbQuarter ?? ''})):''} · {T(rtl?preferences.translationLanguage:preferences.translationName)}</Text></View></Pressable></View>})}
  </>}
  </ScrollView>
  </Page>
}

/**
 * The Mushaf page layout, used when "Mushaf page" is the chosen script.
 *
 * A page of the Madinah Mushaf is fifteen lines of unbroken Arabic: no
 * translation, no verse cards, just the script with its verse-end markers and
 * the surah heading where one begins. It is a way of drawing the same text, so
 * it lives inside the reader rather than on a screen of its own.
 */
/**
 * A printed page of the Madinah mushaf, not a list of verses.
 *
 * The frame is the point: a double rule with a medallion at each corner, an
 * illuminated band over the surah name, a small ornament every few verses the
 * way a printed mushaf groups them, and the page number in a roundel at the
 * foot. Nothing else is on the page - no translation, no verse numbers in the
 * margin - because the page is meant to be read, not annotated.
 */
/**
 * One of the actions under a verse.
 *
 * They all press the same way: a quick squeeze under the finger and a spring
 * back with a little overshoot, so a press is felt as well as seen. The
 * haptic comes from the wrapped Pressable, so the buzz and the squeeze are
 * the same event rather than two things that might drift apart.
 */
function VerseActionButton({ label, name, onPress, active, size = 21, haptic: hapticKind = 'tap' }: {
  label: string; name: string; onPress: () => void; active?: boolean; size?: number; haptic?: HapticKind;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const pressIn = () => {
    Animated.spring(scale, { toValue: .8, friction: 7, tension: 240, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 170, useNativeDriver: true }).start();
    /* a short wash behind the glyph on the way out, so the press leaves a
       trace even where nothing visibly changed */
    Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 110, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
  };
  return <Pressable accessibilityRole="button" accessibilityLabel={label} hapticKind={hapticKind}
    onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={s.verseAction}>
    <Animated.View style={[s.verseActionGlow, { opacity: glow }]} />
    {!!active && <View style={s.verseActionOn} />}
    <Animated.View style={{ transform: [{ scale }] }}>
      {ico(name, size, active ? C.gold : C.green)}
    </Animated.View>
  </Pressable>;
}

/**
 * Digits as the mushaf prints them.
 *
 * A Madinah Mushaf numbers its pages in Eastern Arabic numerals, so showing
 * page ٦٠٤ as "604" is a small wrongness on every page. Cheap to fix, and the
 * page looks like the thing it is imitating.
 */
function toArabicDigits(value: number | string): string {
  const east = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(value).replace(/[0-9]/g, (d) => east[Number(d)]);
}


/** The four corner medallions, drawn rather than imported so they match exactly. */
function MushafCorners({ color = C.gold }: { color?: string }) {
  const corners: any[] = [[s.mushafCornerTL], [s.mushafCornerTR], [s.mushafCornerBL], [s.mushafCornerBR]];
  return <>{corners.map(([pos], i) => <View key={i} pointerEvents="none" style={[s.mushafCorner, pos]}>
    <View style={[s.mushafCornerDiamond, { borderColor: color }]} />
    <View style={[s.mushafCornerDot, { backgroundColor: color }]} />
  </View>)}</>;
}

/**
 * The three things you can do to a verse, offered only when asked for.
 *
 * A mushaf page is the Quran set as a printed page, and a printed page has no
 * buttons on it: rows of icons down every verse would undo the whole point of
 * the layout. So they are kept behind a long press and shown once, above the
 * verse you pressed, then dismissed. Half a second is long enough that turning
 * the page or scrolling past does not summon it.
 */
/**
 * Share a verse as text or as a card, without leaving the page.
 *
 * The two are genuinely different objects. Text is what pastes into a message
 * or a note; the card is what you post. Offering one of them means guessing
 * which the person wanted, so it asks - once, in a small sheet, with no
 * navigation in between.
 */
/**
 * A note on a verse, written where you are.
 *
 * Half a second on a verse brings this up rather than a menu, because there is
 * only one thing you are ever doing at that moment: you read something and you
 * want to say something about it. Everything else on the verse is an icon.
 */
/**
 * What a daily reflection card actually is.
 *
 * The card on Home is a glimpse - three lines of Arabic, four of meaning, cut
 * to fit. Tapping it should not take you somewhere else; it should finish what
 * the card started, and say where it came from. A verse without its reference
 * and its translator is decoration; with them it is something you can check.
 */
/**
 * The sheet behind every "report a correction" control.
 *
 * What it asks for is deliberately narrow: which part is wrong, and what you
 * noticed. It does not ask for a name, an account, or a rating, because none of
 * those help anyone fix a diacritic.
 *
 * Sending is optional. The report is already saved by the time this sheet
 * opens, so "Not now" costs nothing and the report can be sent later from
 * Settings. That is the difference between a report feature people use and one
 * they abandon half way through.
 */
function CorrectionSheet({ target, rtl, T, appLanguage, onClose }: {
  target: {
    kind: 'ayah' | 'hadith' | 'dua';
    reference: string;
    source: string;
    arabic?: string;
    text?: string;
    edition?: string;
  };
  rtl: boolean;
  T: (text: string) => string;
  appLanguage: string;
  onClose: () => void;
}) {
  const options: { key: ReportIssue; label: string }[] = target.kind === 'hadith'
    ? [
      { key: 'arabic', label: T('The Arabic text') },
      { key: 'translation', label: T('The English rendering') },
      { key: 'grading', label: T('The grading or authenticity') },
      { key: 'reference', label: T('The reference or numbering') },
      { key: 'other', label: T('Something else') },
    ]
    : target.kind === 'dua'
    ? [
      { key: 'arabic', label: T('The Arabic text') },
      { key: 'transliteration', label: T('The transliteration') },
      { key: 'translation', label: T('The translation') },
      { key: 'reference', label: T('The reference or numbering') },
      { key: 'other', label: T('Something else') },
    ]
    : [
      { key: 'arabic', label: T('The Arabic text') },
      { key: 'translation', label: T('The translation') },
      { key: 'reference', label: T('The reference or numbering') },
      { key: 'other', label: T('Something else') },
    ];
  const [issue, setIssue] = useState<ReportIssue>('arabic');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const [noMail, setNoMail] = useState(false);
  const [busy, setBusy] = useState(false);
  const { height: windowH } = useWindowDimensions();
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  const send = async () => {
    if (busy) return;
    setBusy(true);
    try {
    const saved = await saveReport({
      kind: target.kind, issue, reference: target.reference, source: target.source,
      arabic: target.arabic, text: target.text, edition: target.edition,
      note, appLanguage
    });
    const opened = await openReportEmail(saved);
    if (opened) setSent(true); else { setNoMail(true); setBusy(false); }
    } catch { setBusy(false); }
  };

  const keep = async () => {
    if (busy) return;
    setBusy(true);
    await saveReport({
      kind: target.kind, issue, reference: target.reference, source: target.source,
      arabic: target.arabic, text: target.text, edition: target.edition,
      note, appLanguage
    });
    onClose();
  };

  if (sent) {
    return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
      <Animated.View style={[s.verseSheet, { opacity: rise }]}>
        <View style={s.sheetGrip} />
        <View style={s.noteSheetHead}>
          <View style={s.sheetOptionIcon}>{ico('checkmark-circle', 20, C.green)}</View>
          <View style={{ flex: 1 }}>
            <Text style={s.sheetTitle}>{T('Thank you')}</Text>
            <Text style={s.sheetSub}>{T('Your mail app has the report. It is also saved in Settings.')}</Text>
          </View>
        </View>
        <Tactile accessibilityRole="button" accessibilityLabel={T('Done')} onPress={onClose} style={s.primary}>
          <Text style={s.primaryText}>{T('Done')}</Text>
        </Tactile>
      </Animated.View>
    </View>;
  }

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, { maxHeight: Math.round(windowH * 0.86) }, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise
    }]}>
      {/* Without `keyboardShouldPersistTaps` the first tap on Send only puts the
          keyboard away, which is most of why this sheet felt unresponsive: you
          typed a note, pressed send, and nothing appeared to happen. */}
      <ScrollView overScrollMode={SCROLL.overScrollMode} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false} bounces={false}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Report a correction')}</Text>
      <Text style={s.sheetSub}>{target.source} · {target.reference}</Text>

      {(!!target.arabic || !!target.text) && <View style={s.reportQuote}>
        {!!target.arabic && <Text numberOfLines={3} style={s.reportQuoteAr}>{target.arabic}</Text>}
        {!!target.text && <Text numberOfLines={3} style={s.reportQuoteEn}>{target.text}</Text>}
      </View>}

      <Section title={T('What is wrong?')} />
      <View style={s.reportOptions}>
        {options.map((option) => {
          const on = issue === option.key;
          return <Pressable key={option.key} accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={option.label}
            onPress={() => setIssue(option.key)} style={[s.reportOption, on && s.reportOptionOn]}>
            <View style={[s.reportDot, on && s.reportDotOn]} />
            <Text style={[s.reportOptionText, on && { color: C.green }]}>{option.label}</Text>
          </Pressable>;
        })}
      </View>

      <TextInput accessibilityLabel={T('What did you notice?')} multiline value={note}
        onChangeText={setNote} placeholder={T('Optional — anything that helps us find it.')}
        placeholderTextColor={C.muted} style={s.reportInput} />

      {noMail && <Text style={s.reportNote}>
        {T('No mail app was found. The report is saved in Settings and you can send it from there.')}
      </Text>}

      <Pressable accessibilityRole="button" accessibilityLabel={T('Send by email')}
        disabled={busy} onPress={() => { void send(); }}
        style={({ pressed }) => [s.primary, (pressed || busy) && s.sheetBtnBusy]}>
        <Text style={s.primaryText}>{busy ? T('Saving…') : T('Send by email')}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Save without sending')}
        disabled={busy} onPress={() => { void keep(); }}
        style={({ pressed }) => [s.secondary, (pressed || busy) && s.sheetBtnBusy]}>
        <Text style={s.secondaryText}>{T('Save without sending')}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Cancel')} disabled={busy}
        onPress={onClose} style={({ pressed }) => [s.sheetCancel, pressed && s.sheetBtnBusy]}>
        <Text style={s.sheetCancelText}>{T('Cancel')}</Text>
      </Pressable>
      </ScrollView>
    </Animated.View>
  </View>;
}

function ReflectionDetail({ kind, data, rtl, T, translationName, onClose, onOpenVerse }: {
  kind: 'ayah' | 'name' | 'dua';
  data: any;
  rtl: boolean;
  T: (t: string) => string;
  translationName: string;
  onClose: () => void;
  onOpenVerse: (verseKey: string, surahId: number, surahName: string) => void;
}) {
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  /* A verse reference arrives as "Aal-i-Imraan 3:10" - the name first, then the
     surah and ayah. The number is the part you have to find with a pattern
     rather than by splitting, because the name itself may contain spaces. */
  const refRaw = String(data?.ayah?.reference || '');
  const refKey = refRaw.match(/(\d+):(\d+)\s*$/);
  const refName = refKey ? refRaw.slice(0, refKey.index).trim() : refRaw;
  const refNum = refKey ? refKey[0] : '';
  const refSurah = refKey ? Number(refKey[1]) : 0;

  const body = kind === 'ayah'
    ? {
      kicker: T('AYAH OF THE DAY'),
      arabic: data?.ayah?.arabic || '',
      prose: data?.ayah?.translation || '',
      rows: [
        [T('Where it is'), refName ? `${T('Surah')} ${refName} · ${refNum}` : '—'],
        [T('This meaning'), translationName],
        [T('The Arabic'), T('Uthmani script, as printed in the Madinah Mushaf')],
      ],
      action: refSurah ? { label: T('Open in the reader'), go: () => onOpenVerse(`${refSurah}:${refKey![2]}`, refSurah, refName) } : null
    }
    : kind === 'name'
      ? {
        kicker: T('NAME OF ALLAH'),
        arabic: data?.name?.name || '',
        prose: data?.name?.meaning || '',
        rows: [
          [T('Transliteration'), data?.name?.transliteration || '—'],
          [T('Which one'), data?.name?.number ? `${data.name.number} ${T('of 99')}` : '—'],
          [T('Where it is from'), T('Islamic.app Asma al-Husna, drawn from the Quran and Sunnah')],
        ],
        action: null
      }
      : {
        kicker: T('DUA OF THE DAY'),
        arabic: data?.dua?.arabic || '',
        prose: data?.dua?.translation || '',
        rows: [
          [T('Said for'), data?.dua?.category || '—'],
          /* The dhikr payload names no book and no number: what it carries is
             the narration the wording is attached to. That is the honest thing
             to show, so it is shown in full rather than trimmed to fit. */
          [T('The narration it belongs to'), data?.dua?.reference || T('Islamic.app dhikr collection')],
        ],
        action: null
      };

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetKicker}>{body.kicker}</Text>
      {!!body.arabic && <Text style={s.reflectArabic}>{body.arabic}</Text>}
      {!!body.prose && <Text style={s.reflectProse}>{body.prose}</Text>}
      <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} style={s.reflectScroll} showsVerticalScrollIndicator={false}>
      <View style={s.reflectSource}>
        <Text style={s.reflectSourceHead}>{T('Where this came from')}</Text>
        {body.rows.map(([label, value]) => (
          <View key={label} style={s.reflectRow}>
            <Text style={s.reflectLabel}>{label}</Text>
            <Text style={s.reflectValue}>{value}</Text>
          </View>
        ))}
      </View>
      </ScrollView>
      {body.action && <Tactile accessibilityRole="button" accessibilityLabel={body.action.label}
        onPress={() => { body.action!.go(); onClose(); }} style={s.primary}>
        <Text style={s.primaryText}>{body.action.label}</Text>
      </Tactile>}
      <Tactile accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetCancel}>
        <Text style={s.sheetCancelText}>{T('Close')}</Text>
      </Tactile>
    </Animated.View>
  </View>;
}

function VerseNoteSheet({ verse, chapter, rtl, T, onClose }: {
  verse: Verse; chapter: Chapter; rtl: boolean; T: (t: string) => string; onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [existing, setExisting] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const rise = useRef(new Animated.Value(0)).current;
  /* How far the sheet has to rise to clear the keyboard.

     Measured rather than assumed. Android is meant to resize the window when
     the keyboard opens, and when it does the sheet is already clear and this
     stays at zero; when it does not, the sheet is measured against the top of
     the keyboard and lifted by exactly the overlap. Either way it ends up
     resting on the keyboard rather than behind it or floating above it. */
  const sheet = useRef<any>(null);
  const liftRef = useRef(0);
  const [lift, setLift] = useState(0);
  useEffect(() => {
    const adjust = (keyboardHeight: number) => {
      const node = sheet.current;
      if (!node?.measureInWindow) return;
      node.measureInWindow((_x: number, y: number, _w: number, h: number) => {
        if (!h) return;
        /* The sheet is already lifted by whatever is in liftRef, so add it
           back to recover where it would have sat untouched. */
        const restingBottom = y + h + liftRef.current;
        const keyboardTop = Dimensions.get('window').height - keyboardHeight;
        const next = Math.max(0, Math.round(restingBottom - keyboardTop));
        if (next !== liftRef.current) {
          liftRef.current = next;
          setLift(next);
        }
      });
    };
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: any) => adjust(event?.endCoordinates?.height || 0)
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        liftRef.current = 0;
        setLift(0);
      }
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
    let live = true;
    loadNotes().then((all) => {
      if (!live) return;
      const found = all.find((n) => n.verseKey === verse.verse_key);
      setExisting(found?.note || null);
      setText(found?.note || '');
      setReady(true);
    });
    return () => { live = false; };
  }, [rise, verse.verse_key]);

  const save = async () => {
    const body = text.trim();
    if (!body) {
      if (existing) await deleteNote(verse.verse_key);
      onClose();
      return;
    }
    await saveNote({
      verseKey: verse.verse_key,
      surahId: chapter.id,
      surahName: chapter.name_simple,
      arabic: verse.text_uthmani,
      translation: verse.translation,
      note: body,
      savedAt: Date.now(),
      updatedAt: Date.now()
    });
    onClose();
  };

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View ref={sheet} style={[s.verseSheet, {
      bottom: lift,
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [340, 0] }) }],
      opacity: rise
    }]}>
      <View style={s.sheetGrip} />
      <View style={s.noteSheetHead}>
        <View style={s.sheetOptionIcon}>{ico('create-outline', 20, C.green)}</View>
        <View style={{ flex: 1 }}>
          <Text style={s.sheetTitle} >{T(existing ? 'Edit your note' : 'Add a note')}</Text>
          <Text style={s.sheetSub}>{chapter.name_simple} · {T('Verse')} {verse.verse_key}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={s.noteSheetArabic}>{verse.text_uthmani}</Text>
      <TextInput
        accessibilityLabel={T('Your note on this verse')}
        multiline
        autoFocus={ready}
        value={text}
        onChangeText={setText}
        placeholder={T('Write a private reflection…')}
        placeholderTextColor={C.muted}
        style={s.noteSheetInput}
      />
      <View style={s.noteSheetActions}>
        {!!existing && <Tactile accessibilityRole="button" accessibilityLabel={T('Delete note')}
          onPress={async () => { await deleteNote(verse.verse_key); onClose(); }} style={s.dangerButton}>
          <Text style={s.dangerText}>{T('Delete')}</Text>
        </Tactile>}
        <View style={{ flex: 1 }} />
        <Tactile accessibilityRole="button" accessibilityLabel={T('Cancel')} onPress={onClose} style={s.secondary}>
          <Text style={s.secondaryText}>{T('Cancel')}</Text>
        </Tactile>
        <Tactile accessibilityRole="button" accessibilityLabel={T('Save note')} onPress={() => { void save(); }} style={s.primarySmall}>
          <Text style={s.primaryText}>{T('Save')}</Text>
        </Tactile>
      </View>
    </Animated.View>
  </View>;
}

function VerseShareSheet({ verse, chapter, rtl, T, onClose }: {
  verse: Verse; chapter: Chapter; rtl: boolean; T: (t: string) => string; onClose: () => void;
}) {
  const { preferences } = useQuranPreferences();
  /* A card that leaves the app wears the theme it was made in. */
  const { theme: cardTheme } = useTheme();
  const cardRef = useRef<any>(null);
  const [busy, setBusy] = useState(false);
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  const cardData = {
    arabic: verse.text_uthmani,
    translation: verse.translation || '',
    reference: verse.verse_key,
    surahName: chapter.name_simple,
    translationName: T(rtl ? preferences.translationLanguage : preferences.translationName),
    arabicFontFamily: quranFont(preferences.arabicFont),
    theme: cardTheme,
  };

  const asText = async () => {
    await Share.share({
      message: `${verse.text_uthmani}\n\n${verse.translation || ''}\n\nQuran ${verse.verse_key} · ${chapter.name_simple}\n${preferences.translationName}`
    });
    onClose();
  };

  const asImage = async () => {
    setBusy(true);
    try {
      const result = await shareVerseCard(cardData, cardRef);
      if (result === 'saved') Alert.alert(T('Image saved'), T('The verse card was saved to your downloads.'));
    } finally {
      setBusy(false);
    }
    onClose();
  };

  const options = [
    { key: 'text', icon: 'text-outline', label: T('Share as text'), detail: T('The Arabic, the meaning and the reference'), onPress: asText },
    { key: 'image', icon: 'image-outline', label: T('Share as image card'), detail: T('A designed card, ready to post'), onPress: asImage },
  ];

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    {/* captured into a PNG on native; the web path draws on a canvas instead */}
    {Platform.OS !== 'web' && <View style={s.offscreenCard} pointerEvents="none" aria-hidden>
      <VerseShareCard viewRef={cardRef} {...cardData} theme={cardTheme} />
    </View>}
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [340, 0] }) }],
      opacity: rise
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Share verse')} {verse.verse_key}</Text>
      <Text style={s.sheetSub} numberOfLines={2}>{chapter.name_simple} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text>
      {options.map((option) => (
        <Tactile key={option.key} accessibilityRole="button" accessibilityLabel={option.label}
          disabled={busy} onPress={() => { void option.onPress(); }} style={s.sheetOption}>
          <View style={s.sheetOptionIcon}>{ico(option.icon, 20, C.green)}</View>
          <View style={{ flex: 1 }}>
            <Text style={s.sheetOptionLabel}>{option.label}</Text>
            <Text style={s.sheetOptionDetail}>{option.detail}</Text>
          </View>
          {busy ? <ActivityIndicator color={C.green} /> : ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.muted)}
        </Tactile>
      ))}
      <Tactile accessibilityRole="button" accessibilityLabel={T('Cancel')} onPress={onClose} style={s.sheetCancel}>
        <Text style={s.sheetCancelText}>{T('Cancel')}</Text>
      </Tactile>
    </Animated.View>
  </View>;
}

function MushafVerseMenu({
  T, rtl, saved, marked, onPlay, onBookmark, onMark, onNote
}: {
  T: (t: string) => string; rtl: boolean; saved: boolean; marked: boolean;
  onPlay: () => void; onBookmark: () => void; onMark: () => void; onNote: () => void;
}) {
  const items = [
    { key: 'play', icon: 'play-circle', label: T('Play'), active: false, onPress: onPlay },
    { key: 'mark', icon: marked ? 'locate' : 'locate-outline', label: T(marked ? 'Your position' : 'Mark'), active: marked, onPress: onMark },
    { key: 'save', icon: saved ? 'bookmark' : 'bookmark-outline', label: T(saved ? 'Saved' : 'Bookmark'), active: saved, onPress: onBookmark },
    { key: 'note', icon: 'create-outline', label: T('Note'), active: false, onPress: onNote },
  ];
  return <View style={s.mushafMenu}>
    <View style={[s.mushafMenuBar, { flexDirection: 'row' }]}>
      {items.map((item) => (
        <Pressable key={item.key} accessibilityRole="button"
          accessibilityLabel={`${item.label} - ${T('verse actions')}`}
          accessibilityState={{ selected: item.active }}
          hapticKind={item.key === 'mark' ? 'success' : 'tap'}
          onPress={item.onPress} style={[s.mushafMenuItem, item.active && s.mushafMenuItemOn]}>
          {ico(item.icon, 16, item.active ? C.gold : C.green)}
          <Text style={[s.mushafMenuLabel, item.active && { color: C.gold }]} numberOfLines={1}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  </View>;
}

/**
 * A division mark on the page, where a new portion begins.
 *
 * Drawn the way a printed mushaf draws it: a rule either side of the name, so
 * the eye catches the interruption without the mark having to shout. It is
 * inline rather than in the margin because there is no margin here — the page
 * is the width of the screen, and a mark floating outside it would be off the
 * edge.
 */
function MushafMarkerBand({ marker, width }: { marker: MushafMarker; width: number }) {
  return <View style={s.mushafMarkerBand}>
    <View style={[s.mushafMarkerRule, { width: width * 0.16 }]} />
    <Text style={s.mushafMarkerName}>{marker.label.ar}</Text>
    <Text style={s.mushafMarkerNum}>{toArabicDigits(marker.number)}</Text>
    <View style={[s.mushafMarkerRule, { width: width * 0.16 }]} />
  </View>;
}

/**
 * The join between this page and the one next to it.
 *
 * Two jobs, and the first is the reason it exists. A printed page ends where
 * the last line lands, not where a verse ends, so a verse is sometimes cut in
 * two: without a note the sentence simply stops, and it reads as a fault in
 * the app rather than as the foot of a page. That case is called out in its
 * own words and its own colour, because it is the one that confuses.
 *
 * The second job is quieter: naming what comes next. The edition this app
 * reads from lays its pages out on verse boundaries, so a cut verse is in fact
 * rare — and a note that only ever appeared on a handful of pages would be a
 * feature in name only. So the rest of the time it says what is over the page,
 * which is useful on every page: where you are going, without turning there.
 */
function MushafConnectionNote({ kind, rtl, T, language, page, cut, nextVerse }: {
  kind: PageConnection; rtl: boolean; T: (t: string) => string; language: string; page: number;
  cut: boolean; nextVerse?: { verse_key: string; surah_name?: string };
}) {
  const ar = language === 'ar';
  const onward = kind === 'continues';
  const label = cut
    ? (onward
        ? (ar ? `الآية ${toArabicDigits(nextVerse?.verse_key || '')} تكتمل في الصفحة ${toArabicDigits(page + 1)}`
               : tf(language,'Verse {v} continues on page {p}',{v:nextVerse?.verse_key || '',p:page + 1}))
        : (ar ? `تتمة الآية ${toArabicDigits(nextVerse?.verse_key || '')} من الصفحة ${toArabicDigits(page - 1)}`
               : tf(language,'Verse {v} continued from page {p}',{v:nextVerse?.verse_key || '',p:page - 1})))
    : (onward
        ? (nextVerse
            ? (ar ? `التالي: ${nextVerse.verse_key} · الصفحة ${toArabicDigits(page + 1)}`
                   : tf(language,'Next: {v}{s} on page {p}',{v:nextVerse.verse_key,s:nextVerse.surah_name ? ` · ${nextVerse.surah_name}` : '',p:page + 1}))
            : (ar ? `الصفحة ${toArabicDigits(page + 1)}` : tf(language,'Page {n}',{n:page + 1})))
        : (nextVerse
            ? (ar ? `السابق: ${nextVerse.verse_key} · الصفحة ${toArabicDigits(page - 1)}`
                   : tf(language,'Before: {v}{s} on page {p}',{v:nextVerse.verse_key,s:nextVerse.surah_name ? ` · ${nextVerse.surah_name}` : '',p:page - 1}))
            : (ar ? `الصفحة ${toArabicDigits(page - 1)}` : tf(language,'Page {n}',{n:page - 1}))));

  return <View style={[s.mushafConnection, cut && s.mushafConnectionCut]}>
    {!onward && ico(rtl ? 'arrow-forward' : 'arrow-back', 12, cut ? C.gold : C.muted)}
    <Text style={[s.mushafConnectionText, cut && s.mushafConnectionTextCut]}>{label}</Text>
    {onward && ico(rtl ? 'arrow-back' : 'arrow-forward', 12, cut ? C.gold : C.muted)}
  </View>;
}

/**
 * One page, drawn at a given size.
 *
 * The size is passed in rather than measured, because how big a page should be
 * is decided once for the whole opening by `computeMushafLayout`, and every page
 * in the opening is then the same size. Letting each page decide for itself
 * would let the two halves of a spread drift apart.
 */
/**
 * One page of the mushaf.
 *
 * A printed page is a fixed amount of room holding a variable amount of text:
 * one page of the Quran carries three hundred characters and another carries
 * twelve hundred. Setting the script at one size and hoping is what made this
 * screen cut pages in half — the short ones came out half empty and the dense
 * ones ran off the bottom and were clipped.
 *
 * So the size is solved for rather than chosen. The height a block of text
 * occupies grows with the square of the type size: double the size and you get
 * twice as many lines, each of them twice as tall. That means a single
 * measurement at one size is enough to work out the size that fills the page,
 * and a second pass corrects for the rounding that natural word breaking
 * introduces. Dense pages land smaller, sparse pages larger, and nothing is
 * ever cut off.
 *
 * The verses are set as one continuous text rather than one block each, which
 * is how a mushaf is actually typeset: a verse does not start a new line
 * merely because the one before it finished. Verse ends are marked inline with
 * the aya sign, as they are on the page.
 */
function MushafPage({ page, verses, width, height, preferences, rtl, T, bookmarks, savedPosition,
  onBookmark, onMark, onPlay, onNote, before }: any) {
  const [openVerse, setOpenVerse] = useState<string | null>(null);
  const enabled = preferences.mushafMarkers || {};

  /* The room inside the frame. The page is a fixed size and the frame's
     padding and border come off it, so this is known without measuring. */
  const contentW = Math.max(60, width - 2 * (MUSHAF_FRAME_PAD + MUSHAF_FRAME_BORDER) - 2 * (MUSHAF_INNER_PAD_H + MUSHAF_INNER_BORDER));
  const contentH = Math.max(60, height - 2 * (MUSHAF_FRAME_PAD + MUSHAF_FRAME_BORDER) - 2 * (MUSHAF_INNER_PAD_V + MUSHAF_INNER_BORDER));

  /* The runs of text, split wherever something that is not text has to be
     inserted — the heading of a surah, or a division mark. Everything else
     flows as one piece. */
  const segments = useMemo(() => {
    const out: any[] = [];
    let run: any[] = [];
    const flush = () => { if (run.length) { out.push({ kind: 'text', verses: run }); run = []; } };
    verses.forEach((v: any, i: number) => {
      const prev = i > 0 ? verses[i - 1] : (before && before.length ? before[before.length - 1] : null);
      const startsSurah = i === 0
        ? (!prev || prev.surah_name !== v.surah_name)
        : verses[i - 1].surah_name !== v.surah_name;
      const marker = markerBetween(prev, v);
      if (startsSurah) { flush(); out.push({ kind: 'surah', name: v.surah_name }); }
      if (marker && enabled[marker.kind] !== false) { flush(); out.push({ kind: 'marker', marker }); }
      run.push(v);
    });
    flush();
    return out;
  }, [verses, before, enabled]);

  const [size, setSize] = useState(18);
  const [textH, setTextH] = useState(0);
  const [totalH, setTotalH] = useState(0);
  const [pass, setPass] = useState(0);
  const segH = useRef<{ [k: number]: number }>({});

  const setSegH = (k: number, h: number) => {
    if (Math.abs((segH.current[k] || 0) - h) < 0.5) return;
    segH.current[k] = h;
    setTextH(Object.keys(segH.current).reduce((a, key) => a + segH.current[+key], 0));
  };

  /* What is left once everything that is not text has taken its share. The
     headings, the marks and the page number occupy the same room whatever size
     the script is, so they are whatever the column measures minus what the
     text measures. */
  const chromeH = Math.max(0, totalH - textH);
  /* How full the page should be. The page is a fixed object, so this is a
     near-constant: it keeps the small margin at the foot that a printed page
     keeps. The reader's size preference is allowed to move it a little, but
     only a little — it belongs to the card reader, and letting it run free
     could leave a page of the Quran half empty. */
  const fill = MUSHAF_FILL * Math.min(1, Math.max(0.85, (preferences.fontSize || 30) / 30));
  const budget = Math.max(40, (contentH - chromeH) * fill);

  const [settledH, setSettledH] = useState(0);
  /* Whether the solve has finished, and the page may be seen.
     It finishes three ways, and the second is the one that was being missed:
     the size lands inside the page, the size stops moving, or it runs out of
     passes. A page carrying very little text on a large screen asks for more
     size than there is, stops at the largest size there is, and stops asking —
     which is a finished solve, not a failed one. Counting only the first and
     the last left those pages invisible for good, which is how a mushaf came
     to have pages missing from it. */
  const [settledFlag, setSettledFlag] = useState(false);

  useEffect(() => {
    if (!textH) return;
    if (pass >= 3) { setSettledFlag(true); if (settledH !== textH) setSettledH(textH); return; }
    const ratio = budget / textH;
    if (Math.abs(ratio - 1) < 0.03) { setSettledFlag(true); if (settledH !== textH) setSettledH(textH); return; }
    const next = Math.max(MUSHAF_MIN_SIZE, Math.min(MUSHAF_MAX_SIZE, size * Math.sqrt(ratio)));
    if (Math.abs(next - size) < 0.4) { setSettledFlag(true); if (settledH !== textH) setSettledH(textH); return; }
    segH.current = {}; setTextH(0); setPass(n => n + 1); setSize(next);
  }, [textH, budget, size, pass, settledH]);

  /* Turning the page starts the solve again from where the last one left off,
     which is quicker than starting from a guess. */
  useEffect(() => { setPass(0); setSettledFlag(false); }, [page, verses, width, height]);

  /* No page is allowed to stay invisible. If the solve has not finished a
     moment after arriving, the page is shown as it stands rather than left
     blank — a size slightly off is a smaller wrong than a page that is not
     there at all. */
  useEffect(() => {
    if (settledFlag) return;
    const t = setTimeout(() => setSettledFlag(true), 900);
    return () => clearTimeout(t);
  }, [settledFlag, page]);

  /* Normally the leading is a fixed proportion of the size. Where the size has
     run into one of its bounds — a page carrying very little text on a large
     screen — the lines are spread instead, so the page still reads as full
     rather than ending halfway down. */
  const probeLines = settledH ? Math.max(1, Math.round(settledH / (size * MUSHAF_LEAD))) : 0;
  const atBound = size >= MUSHAF_MAX_SIZE - 0.01 || size <= MUSHAF_MIN_SIZE + 0.01;
  let lineHeight = atBound && probeLines
    ? Math.max(size * 1.25, Math.min(size * 2.4, budget / probeLines))
    : size * MUSHAF_LEAD;
  /* However the solve ends, the text must not run past the room it has. If it
     still would, the lines are drawn closer rather than the page losing its
     foot. This is the backstop, not the mechanism. */
  const room = Math.max(40, contentH - chromeH);
  if (probeLines && probeLines * lineHeight > room) {
    lineHeight = Math.max(size * 1.2, room / probeLines);
  }
  /* And where even the closest leading leaves the text past the foot of the
     page — a size that landed one line too large, which is easily done on a
     page carrying little, since one line there is a large step — the size
     itself comes down. A smaller script cannot need more lines than a larger
     one, so this cannot overshoot. */
  let drawnSize = size;
  if (probeLines && probeLines * size * 1.2 > room) {
    drawnSize = Math.max(MUSHAF_MIN_SIZE, room / (probeLines * 1.2));
    lineHeight = Math.max(drawnSize * 1.2, room / probeLines);
  }
  /* Until the size has settled the page is measured, not shown, so the text is
     not seen jumping between sizes while it is being solved for. */
  const settled = settledFlag;

  const savedKeys = new Set((bookmarks || []).map((b: any) => b.verseKey));

  return <View style={[s.mushafPageOuter, { width, height }]}>
    <View style={s.mushafFrame}>
      <MushafCorners />
      <View style={s.mushafFrameInner}>
        {/* Measured without the frame's padding, which the budget already
            allows for — counting it twice here stole about fifty points and
            the script paid for it. */}
        <View onLayout={e => setTotalH(e.nativeEvent.layout.height)}>
        {segments.map((seg: any, idx: number) => seg.kind === 'surah' ? (
          <View key={`s${idx}`} style={s.mushafSurahBand}>
            <View style={s.mushafBandRule} />
            <Text style={s.mushafSurahName}>{seg.name}</Text>
            <View style={s.mushafBandRule} />
          </View>
        ) : seg.kind === 'marker' ? (
          <MushafMarkerBand key={`m${idx}`} marker={seg.marker} width={contentW} />
        ) : (
          <Text key={`t${idx}`} style={[s.mushafPageLine, { fontSize: drawnSize, lineHeight, width: contentW, opacity: settled ? 1 : 0 }]}
            onLayout={e => setSegH(idx, e.nativeEvent.layout.height)}>
            {seg.verses.map((v: any) => <Text key={v.verse_key}
              onLongPress={() => setOpenVerse(openVerse === v.verse_key ? null : v.verse_key)}
              onPress={() => openVerse === v.verse_key && setOpenVerse(null)}
              accessibilityLabel={`${T('Verse')} ${v.verse_key}. ${T('Press and hold for actions')}`}
              style={openVerse === v.verse_key ? s.mushafVerseOpen : undefined}>
              {v.text_uthmani} <Text style={{ fontSize: drawnSize * 0.72 }}>۝{v.verse_key.split(':')[1]}</Text>{' '}
            </Text>)}
          </Text>
        ))}
        <View style={s.mushafPageNoRow}>
          <View style={s.mushafPageNo}><Text style={s.mushafPageNoText}>{toArabicDigits(page)}</Text></View>
        </View>
        </View>
      </View>
      {!!openVerse && <View style={s.mushafVerseMenuOverlay}>
        <MushafVerseMenu T={T} rtl={rtl}
          saved={savedKeys.has(openVerse)}
          marked={savedPosition?.verseKey === openVerse}
          onPlay={() => { const v = verses.find((x: any) => x.verse_key === openVerse); setOpenVerse(null); v && onPlay(v); }}
          onBookmark={() => { const v = verses.find((x: any) => x.verse_key === openVerse); setOpenVerse(null); v && onBookmark(v); }}
          onMark={() => { const v = verses.find((x: any) => x.verse_key === openVerse); setOpenVerse(null); v && onMark(v); }}
          onNote={() => { const v = verses.find((x: any) => x.verse_key === openVerse); setOpenVerse(null); v && onNote(v); }} />
      </View>}
    </View>
  </View>;
}


/**
 * The verses on the pages immediately before and after what is on screen.
 *
 * Asked for by page number rather than held across navigation, because the
 * reader can jump to any of 604 pages at will and a cache of the last page
 * visited would be wrong the moment somebody types a number in.
 */
function useMushafNeighbours(page: number, script: string, translation: string) {
  const [pages, setPages] = useState<{ prev: any[]; next: any[] }>({ prev: [], next: [] });

  useEffect(() => {
    const before = page - 1;
    const after = page + 1;
    let live = true;
    const opts = { script, translation };

    const grab = (n: number) => n >= 1 && n <= 604
      ? getPageVerses(n, opts).catch(() => [] as any[])
      : Promise.resolve([] as any[]);

    Promise.all([grab(before), grab(after)]).then(([p, n]) => {
      if (!live) return;
      setPages({ prev: p || [], next: n || [] });
    });
    return () => { live = false; };
  }, [page, script, translation]);

  return pages;
}

function MushafPageView({page,verses,error,cached,retry,preferences,rtl,T,language,input,setInput,goPage,navigation,arStyle,bookmarks,savedPosition,onBookmark,onMark,onPlay,onNote}:any){
  /* How many pages, and how big — fitted to the room it is actually given
     rather than to the screen. The reader pads its scroll area and caps its
     width, so a page sized to the screen is always wider than the box it has
     to sit in and gets clipped at both edges. That is worst on a phone held
     upright, where the page is already as wide as the screen allows and what
     the clipping cuts off is the decorated frame. Measured rather than
     assumed, so turning the device or opening a foldable re-decides it. */
  const {width:screenW,height:screenH}=useWindowDimensions();
  const [boxW,setBoxW]=useState(0);
  const availW=boxW||Math.max(200,Math.min(screenW,READER_MAX_WIDTH)-READER_PAD*2);
  const availH=Math.max(200,screenH-(screenW>screenH?96:190));
  const layout=useMemo(()=>computeMushafLayout(availW,availH),[availW,availH]);

  const scriptFor = (id: string) => (id === 'quran-indopak' || id === 'quran-mushaf') ? 'quran-uthmani' : id;

  /* The pages either side of what is on screen.
     Two things cannot be worked out from a page alone. A division mark
     describes a crossing, so the first verse of a page needs the last verse of
     the one before it to know it has crossed anything — without that, a page
     that opens a new hizb looks like any other page. And a verse cut by the
     turn of a page can only be recognised by seeing the same verse key on
     both sides. So the neighbours are fetched: quietly, and only once per
     page, since what comes back is cached with everything else. */
  const neighbours = useMushafNeighbours(page, scriptFor(preferences.scriptEdition), preferences.translationEdition);

  const step = (delta: number) => goPage(page + delta);

  const pageProps = { preferences, rtl, T, bookmarks, savedPosition, onBookmark, onMark, onPlay, onNote };

  /* Whether the reading is cut at either edge of what is on screen.
     Worked out by comparing verse keys across the join rather than assuming,
     because most page turns fall between verses, and claiming a verse runs on
     when it does not is a small lie repeated on every page. */
  const firstShown = verses || [];
  const lastShown = verses || [];
  const startsContinued = !!neighbours.prev.length && !!firstShown.length &&
    neighbours.prev[neighbours.prev.length - 1].verse_key === firstShown[0].verse_key;
  const endsContinued = !!neighbours.next.length && !!lastShown.length &&
    lastShown[lastShown.length - 1].verse_key === neighbours.next[0].verse_key;
  const canPrev = page > 1;
  const canNext = page < 604;

  return <View style={{width:'100%'}} onLayout={e=>{const w=e.nativeEvent.layout.width;if(w&&Math.abs(w-boxW)>.5)setBoxW(w);}}>
  <View style={s.mushafNav}>
    <Pressable accessibilityLabel={T('Previous Mushaf page')} disabled={!canPrev} onPress={() => step(-1)} style={[s.stepButton, !canPrev && { opacity: .3 }]}>{ico(rtl ? 'arrow-forward' : 'arrow-back', 20, C.green)}</Pressable>
    <View style={s.pageJump}>
      <Text style={s.dataMeta}>
        {T(cached ? 'OFFLINE PAGE' : 'MADINAH MUSHAF · 604 PAGES')}
      </Text>
      <TextInput accessibilityLabel={T('Mushaf page number')} keyboardType="number-pad" value={input} onChangeText={setInput} onSubmitEditing={() => goPage(Number(input))} style={s.pageInput} />
    </View>
    <Pressable accessibilityLabel={T('Next Mushaf page')} disabled={!canNext} onPress={() => step(1)} style={[s.stepButton, !canNext && { opacity: .3 }]}>{ico(rtl ? 'arrow-back' : 'arrow-forward', 20, C.green)}</Pressable>
  </View>
  <View style={s.pageProgress}><View style={[s.preloadFill, { width: `${page / 604 * 100}%` } as any]} /></View>

  {error ? <ErrorState message={error} retry={retry} /> : !verses.length ? <SkeletonParagraph lines={12} /> :
   <View style={s.mushafPageStack}>
     {!!preferences.showVerseConnections && page > 1 &&
       <MushafConnectionNote kind="continued" rtl={rtl} T={T} language={language} page={page} cut={startsContinued} nextVerse={neighbours.prev[neighbours.prev.length - 1]} />}
     <MushafPage page={page} verses={verses} width={layout.pageWidth} height={layout.pageHeight} before={neighbours.prev} {...pageProps} />
     {!!preferences.showVerseConnections && page < 604 &&
       <MushafConnectionNote kind="continues" rtl={rtl} T={T} language={language} page={page} cut={endsContinued} nextVerse={neighbours.next[0]} />}
   </View>}

  <View style={[s.mushafNav, s.mushafNavFoot]}>
    <Tactile onPress={() => step(-1)} disabled={!canPrev} style={s.secondary}><Text style={s.secondaryText}>{T('Previous')}</Text></Tactile>
    <Text style={s.meta}>
      {rtl
        ? `الجزء ${verses[0]?.juz || '—'} · صفحة ${toArabicDigits(page)}`
        : `Juz ${verses[0]?.juz || '—'} · Page ${page}`}
    </Text>
    <Tactile onPress={() => step(1)} disabled={!canNext} style={s.secondary}><Text style={s.secondaryText}>{T('Next')}</Text></Tactile>
  </View>
  </View>;
}

/**
 * Every language the server carries, A to Z, in a sheet.
 *
 * The picker normally orders languages by how many editions each has, which
 * is the right order for browsing — the likely answer is at the front. But
 * that order is only legible if you already know it is ordered that way, and
 * someone looking for "Portuguese" has no way to guess whether it sits near
 * the top or the bottom. Asked for by name, alphabetical is the order that
 * lets you find a thing without already knowing where it is.
 *
 * So the same list is offered twice: by weight for browsing, and here, A to Z,
 * for looking a language up.
 */
/**
 * One row of the language picker.
 *
 * Both callers fill this in: the translation screen lists every language the
 * server carries editions for, and Settings lists the handful the app itself
 * speaks. Keeping one row shape means one list, one search box and one set of
 * keys rather than two pickers that drift apart.
 */
export type PickerRow = {
  code: string;
  /** The name as its own speakers write it — shown first. */
  native: string;
  /** The English name — shown underneath, and what the search also matches. */
  label: string;
  flag: string;
  /** Edition count. Only the translation list has one. */
  count?: number;
  /** A line saying honestly what that choice offers. */
  note?: string;
};

function LanguagePickerSheet({ rtl, T, rows, selected, onPick, onClose }: {
  rtl: boolean; T: (t: string) => string; rows: PickerRow[];
  selected?: string; onPick: (code: string) => void; onClose: () => void;
}) {
  const rise = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  /* One flat list, A to Z. Nothing is grouped or given priority, because the
     only thing a reader is doing here is looking for one language: anything
     that reorders the list makes that slower rather than faster. */
  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.label.localeCompare(b.label, 'en')),
    [rows],
  );
  /* Matched on the native name as well as the English one. Someone looking
     for their own language types it the way they write it, so a list that
     only searched "Urdu" would not find اردو for the person it is for. */
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter(
      (e) =>
        e.label.toLowerCase().includes(needle) ||
        (e.native || '').toLowerCase().includes(needle) ||
        e.code.includes(needle),
    );
  }, [sorted, query]);

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, s.langSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise,
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Language')}</Text>
      <Text style={s.sheetSub}>{shown.length === rows.length
        ? `${rows.length} ${T('languages, A to Z')}`
        : `${shown.length} ${T('of')} ${rows.length}`}</Text>

      <View style={s.onbSearch}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={T('Search a language')}
          placeholderTextColor={C.muted}
          style={s.onbSearchInput}
          accessibilityLabel={T('Search a language')}
        />
        {!!query && <Pressable accessibilityLabel={T('Clear search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}
      </View>

      <ScrollView overScrollMode={SCROLL.overScrollMode} style={{ marginTop: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!shown.length && <Text style={s.onbCardNote}>{T('No language matches that.')}</Text>}
        {shown.map((entry) => {
          const active = entry.code === selected;
          return <Pressable key={entry.code}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${entry.native || entry.label}, ${entry.label}, ${entry.count} ${entry.count === 1 ? T('version') : T('versions')}`}
            onPress={() => { onPick(entry.code); onClose(); }}
            style={[s.langRow, active && s.langRowOn]}>
            <Text style={s.langFlag}>{entry.flag}</Text>
            <View style={s.langText}>
              {/* Their own name for it first, in its own script — that is what
                  a reader scans for. The English sits underneath so the row
                  still reads when the script is unfamiliar. */}
              <Text style={[s.langName, active && s.langNameOn]} numberOfLines={1}>
                {entry.native || entry.label}
              </Text>
              {!!entry.native && entry.native !== entry.label && (
                <Text style={s.langSub} numberOfLines={1}>{entry.label}</Text>
              )}
            </View>
            {entry.count != null && <Text style={s.langCount}>{entry.count}</Text>}
            {active && ico('checkmark', 16, C.green)}
            {/* Said on the row, not only in the header: a language that is
                half written still needs to be pickable, and the person
                picking it deserves to know which half is missing. */}
            {!!entry.note && <Text style={s.langSub}>{entry.note}</Text>}
          </Pressable>;
        })}
        <View style={{ height: 8 }} />
      </ScrollView>
    </Animated.View>
  </View>;
}

function TranslationScreen({navigation}:any){const{preferences,update}=useQuranPreferences();const {rtl,language:appLanguage}=useLanguage();const T=(text:string)=>tx(appLanguage,text);const[editions,setEditions]=useState<IslamicEdition[]>([]);const[error,setError]=useState('');const[picking,setPicking]=useState(false);const load=()=>getEditions('quran').then(setEditions).catch(e=>setError(T(e.message)));useEffect(()=>{load()},[]);
  /* The language is chosen from a sheet holding all ninety-seven in
     alphabetical order, so the screen opens with one control: what language
     am I reading. The editions of that language sit underneath it. */
  const languages=useMemo(()=>languagesOf(editions),[editions]);
  const currentCode=(editions.find(e=>e.id===preferences.translationEdition)?.language)||'en';
  const current=useMemo(()=>languages.find(l=>l.code===currentCode),[languages,currentCode]);
  const[language,setLanguage]=useState(currentCode);
  useEffect(()=>{setLanguage(currentCode)},[currentCode]);

  /* The rows are built here rather than inside the sheet's render callback.
     `useOverlaySheet` hands that callback to the overlay host, which invokes it
     as a plain function during *its own* render — so a hook written inside it
     is registered against the host, not against this screen. The host renders
     one such call per open sheet, so the number of hooks it registers rises and
     falls as sheets open and close, and React throws "rendered fewer hooks than
     expected". That is what took this screen down on opening the sheet. */
  const languageRows=useMemo(()=>languages.map((e)=>({code:e.code,native:e.native,label:e.label,flag:e.flag,count:e.count})),[languages]);

  /* Registered on the overlay layer rather than drawn inside the page: the
     floating tab bar paints after the screens, so a sheet rendered inline is
     drawn underneath it and its lower rows cannot be reached. */
  useOverlaySheet('translations-language', picking, () => (
    <LanguagePickerSheet rtl={rtl} T={T} rows={languageRows} selected={language}
      onPick={(code)=>setLanguage(code)} onClose={()=>setPicking(false)}/>
  ), () => setPicking(false));

  return <Page><ToolBar title={T('Translation')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
    <ToolGraphic tool="Translations" size={85}/>
    <Text style={s.dataTitle}>{T('Choose a translation')}</Text>
    <Text style={s.intro}>{T('Translations explain meaning and do not replace the Arabic Quran. Edition attribution remains visible in the reader.')}</Text>

    <Pressable accessibilityRole="button" accessibilityState={{expanded:picking}} accessibilityLabel={`${T('Language')}: ${current?current.label:currentCode}`}
      onPress={()=>setPicking(true)} style={s.tsLangButton}>
      <Text style={s.langFlag}>{languageFlag(language)}</Text>
      <View style={{flex:1}}>
        <Text style={s.preferenceLabel}>{T('LANGUAGE')}</Text>
        <Text style={s.settingName}>{current?current.label:languageLabel(language)}</Text>
      </View>
      <Text style={s.langCount}>{current?current.count:0} {T(current&&current.count===1?'version':'versions')}</Text>
      {ico('chevron-down',18,C.green)}
    </Pressable>

    {error?<ErrorState message={error} retry={load}/>:!editions.length?<SkeletonList rows={6} />:<EditionPicker C={C} editions={editions} category="quran" selectedId={preferences.translationEdition} initialLanguage={language} hideLanguageRow searchPlaceholder={T('Search translator or edition')} onPick={async(e)=>{
      await update({
        translationEdition:e.id,
        translationName:editionDisplayName(e),
        translationLanguage:languageLabel(e.language||'en'),
      });
      goBackOrHome(navigation);
    }}/>}
  </ScrollView>
</Page>}

function QuranSearchScreen({route,navigation}:any){const{preferences}=useQuranPreferences();const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[query,setQuery]=useState(route.params?.initialQuery||'');const[results,setResults]=useState<QuranSearchResult[]>([]);const[history,setHistory]=useState<string[]>([]);const[error,setError]=useState('');const[loading,setLoading]=useState(false);useEffect(()=>{loadSearchHistory().then(setHistory);if(route.params?.initialQuery)run(route.params.initialQuery)},[]);const run=async(value=query)=>{const q=value.trim();if(q.length<2)return;setLoading(true);setError('');try{const edition=/[\u0600-\u06ff]/.test(q)?preferences.scriptEdition:preferences.translationEdition;setResults((await searchQuran(q,edition)).slice(0,100));setHistory(await addSearchHistory(q))}catch(e:any){setError(T(e.message))}finally{setLoading(false)}};const open=(r:QuranSearchResult)=>navigation.navigate('Reader',{chapter:{id:r.surahId,name_simple:r.surahName,name_arabic:'',verses_count:0},focusVerse:r.verseKey});return <Page><ToolBar title={T('Quran search')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Quran Search" size={81}/><Text style={s.dataTitle}>{T('Search Arabic or translation')}</Text><View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput autoFocus value={query} onChangeText={setQuery} onSubmitEditing={()=>run()} returnKeyType="search" style={s.searchInput} placeholder={T('Mercy, الصبر, or 2:255')}/><Pressable onPress={()=>run()}>{ico('arrow-forward-circle',22,C.green)}</Pressable></View>{history.length>0&&<><View style={s.historyHead}><Text style={s.preferenceLabel}>{T('RECENT SEARCHES')}</Text><Pressable onPress={async()=>{await clearSearchHistory();setHistory([])}}><Text style={s.sectionAction}>{T('Clear')}</Text></Pressable></View><View style={s.historyWrap}>{history.map(item=><Pressable key={item} onPress={()=>{setQuery(item);run(item)}} onLongPress={async()=>setHistory(await removeSearchHistory(item))} style={s.historyChip}><Text style={s.meta}>{item}</Text></Pressable>)}</View></>}{error?<ErrorState message={error} retry={()=>run()}/>:loading?<SkeletonList rows={6} />:<View>{results.map(r=><Pressable key={`${r.verseKey}-${r.edition}`} onPress={()=>open(r)} style={s.searchResult}><Text style={s.dataMeta}>{r.surahName} · {r.verseKey}</Text><Text numberOfLines={4} style={/[\u0600-\u06ff]/.test(r.text)?s.dataArabic:s.dataBody}>{r.text}</Text><Text style={s.meta}>{r.edition}</Text></Pressable>)}</View>}</ScrollView></Page>}

function BookmarkScreen({navigation}:any){const[items,setItems]=useState<QuranBookmark[]>([]);const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadBookmarks().then(setItems));loadBookmarks().then(setItems);return unsub},[navigation]);const[chapters,setChapters]=useState<Chapter[]>([]);useEffect(()=>{getChapters().then(setChapters)},[]);const openBookmark=(item:QuranBookmark)=>{const full=chapters.find(c=>c.id===item.surahId);navigation.navigate('Reader',{chapter:full||{id:item.surahId,name_simple:item.surahName,name_arabic:'',verses_count:0},focusVerse:item.verseKey})};return <Page><ToolBar title={T('Bookmarks')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Bookmarks" size={81}/><Text style={s.dataTitle}>{tf(language,'{n} saved verses',{n:items.length})}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No bookmarks yet')}</Text><Text style={s.errorText}>{T('Use the bookmark action beside any verse.')}</Text></View>:items.map(item=><View key={item.verseKey} style={s.dataCard}><Pressable onPress={()=>openBookmark(item)} style={s.bookmarkMain}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text numberOfLines={3} style={s.dataArabic}>{item.arabic}</Text><Text numberOfLines={3} style={s.dataBody}>{item.translation}</Text></Pressable><Pressable accessibilityLabel={`${T('Remove bookmark')} ${item.verseKey}`} onPress={async()=>setItems(await toggleBookmark(item))} style={s.bookmarkRemove}>{ico('trash-outline',18,C.muted)}</Pressable></View>)}</ScrollView></Page>}
function NotesScreen({navigation}:any){const[items,setItems]=useState<QuranNote[]>([]);const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadNotes().then(setItems));loadNotes().then(setItems);return unsub},[navigation]);return <Page><ToolBar title={T('Quran notes')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Notes" size={81}/><Text style={s.dataTitle}>{tf(language,'{n} private notes',{n:items.length})}</Text><Text style={s.intro}>{T('Notes remain on this device and are never added to diagnostics.')}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No notes yet')}</Text><Text style={s.errorText}>{T('Open verse actions to add a reflection.')}</Text></View>:items.map(item=><Tactile key={item.verseKey} onPress={()=>navigation.navigate('Note Editor',{verse:item,chapter:{id:item.surahId,name_simple:item.surahName}})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text style={s.noteText}>{item.note}</Text><Text style={s.meta}>{new Date(item.updatedAt).toLocaleDateString()}</Text></Tactile>)}</ScrollView></Page>}
/**
 * Three screens read their payload straight off `route.params`. In normal use
 * they are always opened with one, but a deep link, a restored stack or a
 * stale tab can arrive bare, and reading `.verse` off undefined takes the
 * whole navigator down. This shows a way back instead of a blank screen.
 */
function needsPayload(Inner: any, title: string) {
  return function Guarded(props: any) {
    const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
    const bare = !props.route?.params || Object.keys(props.route.params).length === 0;
    if (bare) return <Page><ToolBar title={T(title)} navigation={props.navigation}/><View style={s.dataPage}><View style={s.emptyWrap}>{ico('alert-circle-outline',34,C.muted)}<Text style={s.emptyTitle}>{T('Nothing to show here')}</Text><Text style={s.emptyBody}>{T('Open this page by choosing an item from the list before it.')}</Text></View></View></Page>;
    return <Inner {...props}/>;
  };
}

function NoteEditorScreen({route,navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const chapter:Chapter=route.params.chapter;
  /* Two different things arrive in `verse`, and they do not agree on what a
     verse is called.

     From the notes list it is a QuranNote, whose field is `verseKey` and
     whose text is `arabic`. From a verse's actions in the reader it is a
     Verse, whose field is `verse_key` and whose text is `text_uthmani`.

     Reading only the Verse names meant the notes list handed this screen
     `undefined` for the key, and `deleteNote(undefined)` matches nothing —
     so Delete did nothing at all, and saving wrote a note with no key. */
  const incoming=route.params.verse;
  const verseKey:string=incoming.verseKey??incoming.verse_key;
  const arabic:string=incoming.arabic??incoming.text_uthmani??'';
  const original:string=incoming.note??'';
  const savedAt:number=incoming.savedAt??Date.now();
  const[text,setText]=useState(original);
  const save=async()=>{const body=text.trim();
    if(!body){if(original)await deleteNote(verseKey);goBackOrHome(navigation);return}
    await saveNote({verseKey,surahId:chapter.id,surahName:chapter.name_simple,arabic,translation:incoming.translation??'',note:body,savedAt,updatedAt:Date.now()});
    goBackOrHome(navigation)};
  return <Page><ToolBar title={`Note · ${verseKey}`} navigation={navigation}/><View style={s.dataPage}><Text style={s.dataArabic}>{arabic}</Text><TextInput multiline autoFocus value={text} onChangeText={setText} placeholder={T('Write a private reflection…')} style={s.noteInput}/><View style={s.actionRow}><Tactile onPress={save} style={s.primary}><Text style={s.primaryText}>{T('Save note')}</Text></Tactile>{!!original&&<Tactile onPress={async()=>{await deleteNote(verseKey);goBackOrHome(navigation)}} style={s.dangerButton}><Text style={s.dangerText}>{T('Delete')}</Text></Tactile>}</View></View></Page>}

/**
 * How the Quran reads on this screen, as a sheet.
 *
 * This used to be a screen pushed on top of the reader. It is a sheet now, for
 * the same reason the verse actions are: every control here changes the two
 * lines of Arabic in front of you, and leaving the page to judge a type size
 * means holding that size in your head across a navigation. Opened over the
 * reader, the change is visible while it is being made.
 *
 * Translation and transliteration sit side by side because they answer
 * different questions and a person often wants both. A translation is what the
 * verse means; a transliteration is how it sounds. Someone learning to recite
 * wants the sound and the sense together, so transliteration is its own
 * setting with its own switch rather than a third entry in the translation
 * list — choosing one should never silently cost you the other.
 */
function ReaderSettingsScreen({navigation}:any){
  const {rtl,language:appLanguage}=useLanguage(); const T=(text:string)=>tx(appLanguage,text);
  const{preferences,update}=useQuranPreferences();
  const rise=useRef(new Animated.Value(0)).current;
  const[picking,setPicking]=useState<null|'translation'>(null);
  const[editions,setEditions]=useState<IslamicEdition[]>([]);
  const[catalogError,setCatalogError]=useState('');
  const[catalogAttempt,setCatalogAttempt]=useState(0);

  useEffect(()=>{ Animated.spring(rise,{toValue:1,friction:9,tension:130,useNativeDriver:true}).start(); },[rise]);
  /* The catalogue is ~200KB. When that first fetch failed the rejection was
     swallowed and "Loading live data…" stayed on screen for good, with no way
     to recover short of leaving the screen and coming back. Report it instead,
     and offer a retry that re-runs this effect. */
  useEffect(()=>{
    let live=true;
    setCatalogError('');
    getEditions('quran')
      .then((nextEditions)=>{
        if(!live)return;
        setEditions(nextEditions);
      })
      .catch((e:any)=>{ if(live) setCatalogError(e?.message || 'Please check your connection.'); });
    return ()=>{ live=false; };
  },[catalogAttempt]);

  const scripts=[['quran-uthmani','Uthmani'],['quran-simple','Imla’i Simple'],['quran-indopak','IndoPak'],['quran-tajweed','Tajweed colour'],['quran-mushaf','Mushaf page']];
  /* Every control below is a setting of the same two lines of text, so the two
     lines sit at the top and change as the controls change. Reading about a
     type size is slower than seeing it. */
  const previewSize=Math.min(preferences.fontSize,32);

  const languages=useMemo(()=>languagesOf(editions),[editions]);
  const currentCode=(editions.find(e=>e.id===preferences.translationEdition)?.language)||'en';
  const current=useMemo(()=>languages.find(l=>l.code===currentCode),[languages,currentCode]);
  const[language,setLanguage]=useState(currentCode);
  useEffect(()=>{setLanguage(currentCode)},[currentCode]);
  /* Built in the body, not at the point of use: the sheet below is rendered
     conditionally, so a `useMemo` written inside that expression would be
     skipped on every render where the condition is false. React then sees the
     hook count change and throws "rendered more hooks than expected" — which is
     what took this screen down when the language row was tapped. */
  const languageRows=useMemo(()=>languages.map((e)=>({code:e.code,native:e.native,label:e.label,flag:e.flag,count:e.count})),[languages]);

  const close=()=>goBackOrHome(navigation);
  const Switch=({on,label,detail,glyph,onPress}:{on:boolean;label:string;detail:string;glyph:string;onPress:()=>void})=>(
    <Tactile accessibilityRole="switch" accessibilityState={{checked:on}} onPress={onPress} style={s.setting}>
      <MotionGlyph name={glyph} size={19}/>
      <View style={{flex:1}}><Text style={s.settingName}>{T(label)}</Text><Text style={s.meta}>{T(detail)}</Text></View>
      {ico(on?'toggle':'toggle-outline',22,on?C.green:C.muted)}
    </Tactile>
  );

  /* Drawn through the overlay layer rather than by the navigator.

     The floating tab bar is a sibling of the navigator rendered after it,
     so a sheet drawn inside a screen lies under the bar whatever zIndex it
     carries: zIndex orders siblings, and these two are not siblings. The
     overlay host is the last child of the navigation container, so it sits
     above everything the app floats, and its scrim dims the tab bar too
     instead of fighting it for the same strip of pixels. */
  useOverlaySheet('reader-settings', true, () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={close} style={s.sheetScrim}/>
      <Animated.View style={[s.verseSheet,s.langSheet,{
        transform:[{translateY:rise.interpolate({inputRange:[0,1],outputRange:[520,0]})}],
        opacity:rise,
      }]}>
        <View style={s.sheetGrip}/>
        <Text style={s.sheetTitle}>{T('Reading settings')}</Text>
        <Text style={s.sheetSub}>{T('Everything here changes the page behind this sheet')}</Text>

        <ScrollView overScrollMode={SCROLL.overScrollMode} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:12}}>
          <Text style={s.rsEyebrow}>{T('HOW IT WILL READ')}</Text>
          <View style={s.rsPreview}>
            <Text style={[s.rsPreviewArabic,{fontFamily:quranFont(preferences.arabicFont),fontSize:previewSize,lineHeight:Math.round(previewSize*preferences.lineHeight)}]}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
            {!!preferences.showTranslation && <Text style={[s.rsPreviewMeaning,{fontSize:Math.min(preferences.translationFontSize,20)}]}>{T('In the name of Allah, the Most Gracious, the Most Merciful.')}</Text>}
            {!!preferences.showTransliteration && <Text style={[s.rsPreviewTranslit,{fontSize:Math.min(preferences.translationFontSize,18)}]}>bismi llāhi r-raḥmāni r-raḥīm</Text>}
            <View style={s.rsPreviewFoot}><Text style={s.rsPreviewMeta}>{T(preferences.scriptName)}</Text><Text style={s.rsPreviewMeta}>{preferences.fontSize}px · {preferences.lineHeight.toFixed(1)}×</Text></View>
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('ARABIC SCRIPT')}</Text>
            <View style={s.choiceGrid}>{scripts.map(([id,name])=><ChoicePill key={id} label={T(name)} selected={preferences.scriptEdition===id} onPress={()=>update({scriptEdition:id,scriptName:name})}/>)}</View>
            <Text style={[s.meta,{marginTop: 8}]}>{T('Mushaf page lays the Quran out as printed pages, fifteen lines to a page, with no translation or verse numbers. Choose it here and the reader becomes a mushaf.')}</Text>
            <View style={s.rsDivider}/>
            <Text style={s.rsGroupTitle}>{T('ARABIC FONT')}</Text>
            <View style={s.choiceGrid}>{QURAN_FONTS.map(font=><ChoicePill key={font.id} label={T(font.label)} selected={preferences.arabicFont===font.id} onPress={()=>{void ensureQuranFont(font.id);update({arabicFont:font.id})}}/>)}</View>
            <Text style={[s.meta,{marginTop: 8}]}>{T(QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.detail || '')}</Text>
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('SIZE & SPACING')}</Text>
            <Text style={s.preferenceLabel}>{T('ARABIC')}</Text>
            <View style={s.stepper}><Tactile accessibilityLabel={T('Smaller Arabic')} onPress={()=>update({fontSize:Math.max(18,preferences.fontSize-2)})} style={s.stepButton}>{ico('remove',20,C.green)}</Tactile><Text style={[s.previewArabic,{fontSize:preferences.fontSize}]}>ٱلْقُرْآنُ</Text><Tactile accessibilityLabel={T('Larger Arabic')} onPress={()=>update({fontSize:Math.min(40,preferences.fontSize+2)})} style={s.stepButton}>{ico('add',20,C.green)}</Tactile></View>
            <Text style={s.preferenceLabel}>{T('LINE SPACING')}</Text>
            <View style={s.stepper}><Tactile accessibilityLabel={T('Tighter lines')} onPress={()=>update({lineHeight:Math.max(1.4,+(preferences.lineHeight-.1).toFixed(1))})} style={s.stepButton}>{ico('remove',20,C.green)}</Tactile><Text style={s.settingName}>{preferences.lineHeight.toFixed(1)}×</Text><Tactile accessibilityLabel={T('Looser lines')} onPress={()=>update({lineHeight:Math.min(3,+(preferences.lineHeight+.1).toFixed(1))})} style={s.stepButton}>{ico('add',20,C.green)}</Tactile></View>
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('THE MEANING')}</Text>
            {/* Showing the meaning is a reading choice, so it belongs with the
                rest of the reading choices rather than out on the reader. */}
            <View style={s.settings}>
              <Switch on={preferences.showTranslation} glyph="text"
                label={'Show the translation'} detail={'The meaning under the Arabic. Turn it off to read the Arabic alone.'}
                onPress={()=>update({showTranslation:!preferences.showTranslation})}/>
            </View>
            {!!preferences.showTranslation && <>
              <Pressable accessibilityRole="button" accessibilityState={{expanded:picking==='translation'}} accessibilityLabel={`${T('Language')}: ${current?current.label:currentCode}`}
                onPress={()=>setPicking('translation')} style={s.tsLangButton}>
                <Text style={s.langFlag}>{languageFlag(language)}</Text>
                <View style={{flex:1}}>
                  <Text style={s.preferenceLabel}>{T('LANGUAGE')}</Text>
                  <Text style={s.settingName}>{current?current.label:languageLabel(language)}</Text>
                </View>
                <Text style={s.langCount}>{current?current.count:0} {T(current&&current.count===1?'version':'versions')}</Text>
                {ico('chevron-down',18,C.green)}
              </Pressable>
              {!editions.length
                ? (catalogError
                    ? <ErrorState message={catalogError} retry={()=>setCatalogAttempt(a=>a+1)}/>
                    : <SkeletonList rows={6} />)
                : <EditionPicker C={C} editions={editions} category="quran"
                selectedId={preferences.translationEdition} initialLanguage={language} hideLanguageRow
                searchPlaceholder={T('Search translator or edition')}
                onPick={(e)=>{void update({translationEdition:e.id,translationName:editionDisplayName(e),translationLanguage:languageLabel(e.language||'en')})}}/>}
              <Text style={s.preferenceLabel}>{T('TRANSLATION SIZE')}</Text>
              <View style={s.stepper}><Tactile accessibilityLabel={T('Smaller translation')} onPress={()=>update({translationFontSize:Math.max(11,preferences.translationFontSize-1)})} style={s.stepButton}>{ico('remove',20,C.green)}</Tactile><Text style={[s.settingName,{fontSize:Math.min(preferences.translationFontSize,22)}]}>{T('The meaning beside the Arabic')}</Text><Tactile accessibilityLabel={T('Larger translation')} onPress={()=>update({translationFontSize:Math.min(26,preferences.translationFontSize+1)})} style={s.stepButton}>{ico('add',20,C.green)}</Tactile></View>
              <Text style={s.meta}>{T('The script and the meaning are set apart, because they are not read at the same speed or from the same distance.')}</Text>
            </>}
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('READING MODE')}</Text>
            <View style={s.settings}><Tactile accessibilityRole="switch" accessibilityState={{checked:preferences.focusMode}} onPress={()=>update({focusMode:!preferences.focusMode})} style={s.setting}><MotionGlyph name={preferences.focusMode?'eye':'eye-outline'} size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Focus mode')}</Text><Text style={s.meta}>{T('Hide the top bar and the tab menu as you scroll. Tap a verse to bring them back.')}</Text></View>{ico(preferences.focusMode?'toggle':'toggle-outline',22,preferences.focusMode?C.green:C.muted)}</Tactile></View>
            <View style={s.choiceGrid}><ChoicePill label={T('Ayah cards')} selected={preferences.readingMode==='cards'} onPress={()=>update({readingMode:'cards'})}/><ChoicePill label={T('Continuous')} selected={preferences.readingMode==='continuous'} onPress={()=>update({readingMode:'continuous'})}/></View>
          </View>

          {preferences.scriptEdition==='quran-mushaf'&&<View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('MUSHAF PAGE')}</Text>
            <Text style={s.rsGroupTitle}>{T('ON THE PAGE')}</Text>
            <View style={s.settings}>
              <Tactile accessibilityRole="switch" accessibilityState={{checked:!!preferences.mushafTranslation}} onPress={()=>update({mushafTranslation:!preferences.mushafTranslation})} style={s.setting}><MotionGlyph name={preferences.mushafTranslation?'text':'text-outline'} size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Show the meaning on the page')}</Text><Text style={s.meta}>{T('A printed page carries no translation. Turn this on to have the meaning under each verse.')}</Text></View>{ico(preferences.mushafTranslation?'toggle':'toggle-outline',22,preferences.mushafTranslation?C.green:C.muted)}</Tactile>
              <Tactile accessibilityRole="switch" accessibilityState={{checked:preferences.showVerseConnections!==false}} onPress={()=>update({showVerseConnections:preferences.showVerseConnections===false})} style={s.setting}><MotionGlyph name="git-compare-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Mark verses cut across a page')}</Text><Text style={s.meta}>{T('Notes where a verse runs on to the next page, so the sentence does not simply stop.')}</Text></View>{ico(preferences.showVerseConnections!==false?'toggle':'toggle-outline',22,preferences.showVerseConnections!==false?C.green:C.muted)}</Tactile>
            </View>
            <View style={s.rsDivider}/>
            <Text style={s.rsGroupTitle}>{T('DIVISION MARKS')}</Text>
            <View style={s.settings}>{MARKER_KINDS.map(kind=><Tactile key={kind} accessibilityRole="switch" accessibilityState={{checked:preferences.mushafMarkers[kind]!==false}} onPress={()=>update({mushafMarkers:{...preferences.mushafMarkers,[kind]:preferences.mushafMarkers[kind]===false}})} style={s.setting}><MotionGlyph name="bookmark-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?MARKER_LABELS[kind].ar:MARKER_LABELS[kind].en}</Text></View>{ico(preferences.mushafMarkers[kind]!==false?'toggle':'toggle-outline',22,preferences.mushafMarkers[kind]!==false?C.green:C.muted)}</Tactile>)}</View>
          </View>}
        </ScrollView>
      </Animated.View>

      {picking==='translation'&&<LanguagePickerSheet rtl={rtl} T={T} rows={languageRows} selected={language}
        onPick={(code)=>setLanguage(code)} onClose={()=>setPicking(null)}/>}
    </View>
  ), close);
  return null;
}

/**
 * Everything you can do to one verse, as a sheet.
 *
 * This used to be a screen you were pushed to. It is a sheet now, for the same
 * reason the share and note sheets are: the verse is right there in front of
 * you, and leaving the page to act on it costs more than the act is worth.
 *
 * It is drawn by the overlay host, so the floating menu is behind it rather
 * than across it.
 */
function VerseActionsSheet({ verse, chapter, rtl, T, navigation, onClose, language }: {
  verse: Verse; chapter: Chapter; rtl: boolean; T: (t: string) => string; navigation: any; onClose: () => void; language?: string;
}) {
  /* The report carries the language it was written in. Falling back to rtl
     keeps an unconverted caller working, but the caller should pass it: a
     boolean files Persian reports as Arabic. */
  const reportLanguage = language || (rtl ? 'ar' : 'en');
  const { preferences } = useQuranPreferences();
  /* A card that leaves the app wears the theme it was made in. */
  const { theme: cardTheme } = useTheme();
  const { height } = useWindowDimensions();
  const [bookmarked, setBookmarked] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<any>(null);
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);
  useEffect(() => {
    let live = true;
    loadBookmarks().then((all) => { if (live) setBookmarked(all.some((x) => x.verseKey === verse.verse_key)); });
    return () => { live = false; };
  }, [verse.verse_key]);

  const cardData = {
    arabic: verse.text_uthmani,
    translation: verse.translation || '',
    reference: verse.verse_key,
    surahName: chapter.name_simple,
    translationName: T(rtl ? preferences.translationLanguage : preferences.translationName),
    arabicFontFamily: quranFont(preferences.arabicFont),
    theme: cardTheme,
  };

  const mark: QuranBookmark = { verseKey: verse.verse_key, surahId: chapter.id, surahName: chapter.name_simple, arabic: verse.text_uthmani, translation: verse.translation || '', savedAt: Date.now() };
  const toggleMark = async () => {
    const all = await toggleBookmark(mark);
    const now = all.some((x) => x.verseKey === verse.verse_key);
    setBookmarked(now);
    Alert.alert(now ? T('Bookmarked') : T('Bookmark removed'), `${chapter.name_simple} ${verse.verse_key}`);
  };
  const shareImage = async () => {
    setBusy(true);
    try {
      const result = await shareVerseCard(cardData, cardRef);
      if (result === 'saved') Alert.alert(T('Image saved'), T('The verse card was saved to your downloads.'));
    } finally { setBusy(false); }
  };

  /* `done` carries the confirmation so the wording travels with the action
     instead of being guessed back from the label - which broke in Arabic,
     where the label no longer starts with "Copy". */
  const options: any[] = [
    { key: 'bookmark', icon: bookmarked ? 'bookmark' : 'bookmark-outline', label: bookmarked ? T('Remove bookmark') : T('Bookmark this verse'), detail: bookmarked ? T('Saved to your bookmarks') : T('Keep it, to come back to'), onPress: toggleMark },
    { key: 'copy-ar', icon: 'copy-outline', label: T('Copy Arabic'), detail: T('The verse as it is written'), done: T('Copied'), onPress: () => Clipboard.setStringAsync(verse.text_uthmani) },
    { key: 'copy-tr', icon: 'copy-outline', label: T('Copy translation'), detail: T(rtl ? preferences.translationLanguage : preferences.translationName), done: T('Copied'), onPress: () => Clipboard.setStringAsync(verse.translation || '') },
    { key: 'share-image', icon: 'image-outline', label: T('Share as image card'), detail: T('A designed card, ready to post'), onPress: shareImage },
    { key: 'note', icon: 'create-outline', label: T('Add or edit note'), detail: T('Your own words beside the verse'), go: 'Note Editor' },
    { key: 'tafsir', icon: 'library-outline', label: T('Tafsir & compare'), detail: T('Other translations and commentary'), go: 'Tafsir Compare' },
    { key: 'position', icon: 'locate-outline', label: T('Save reading position'), detail: T('Carry on from here next time'), done: T('Reading position saved'), onPress: () => saveReadingPosition({ surahId: chapter.id, surahName: chapter.name_simple, verseKey: verse.verse_key, ayah: Number(verse.verse_key.split(':')[1]), page: verse.page, updatedAt: Date.now() }) },
    { key: 'report', icon: 'flag-outline', label: T('Report a correction'), detail: T('Tell us what looks wrong'), onPress: () => setReporting(true) },
  ];

  /* Stacked on this sheet rather than drawn inside it, so the report opens
     above the actions instead of being clipped by them. */
  useOverlaySheet('verse-report', reporting, () => <CorrectionSheet
    target={{ kind: 'ayah', reference: verse.verse_key, source: `${T('Surah')} ${chapter.name_simple}`,
      arabic: verse.text_uthmani, text: verse.translation,
      edition: T(rtl ? preferences.translationLanguage : preferences.translationName) }}
    rtl={rtl} T={T} appLanguage={reportLanguage} onClose={() => setReporting(false)} />, () => setReporting(false));

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    {/* captured into a PNG on native; the web path draws on a canvas instead */}
    {Platform.OS !== 'web' && <View style={s.offscreenCard} pointerEvents="none" aria-hidden>
      <VerseShareCard viewRef={cardRef} {...cardData} theme={cardTheme} />
    </View>}
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Verse')} {verse.verse_key}</Text>
      <Text style={s.sheetSub} numberOfLines={2}>{chapter.name_simple} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text>
      {/* Eight options will not fit on a short screen, so the list scrolls and
          the sheet never grows past the point where it could be read. */}
      <ScrollView overScrollMode={SCROLL.overScrollMode} style={{ maxHeight: Math.round(height * 0.44) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {options.map((option) => (
          <Tactile key={option.key} accessibilityRole="button" accessibilityLabel={option.label}
            disabled={busy} onPress={async () => {
              if (option.go) { onClose(); navigation.navigate(option.go, { verse, chapter }); return; }
              await option.onPress();
              if (option.done) Alert.alert(option.done, option.label);
            }} style={s.sheetOption}>
            <View style={s.sheetOptionIcon}>{ico(option.icon, 20, C.green)}</View>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetOptionLabel}>{option.label}</Text>
              <Text style={s.sheetOptionDetail}>{option.detail}</Text>
            </View>
            {busy ? <ActivityIndicator color={C.green} /> : ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.muted)}
          </Tactile>
        ))}
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={[s.primary, { marginTop: 12 }]}>
        <Text style={s.primaryText}>{T('Close')}</Text>
      </Pressable>
    </Animated.View>
  </View>;
}
/**
 * Tafsir arrives with the source's markup still in it - bold, italics, the
 * occasional anchor. React Native's Text renders none of those, so without
 * this the reader sees literal `<b>` around the words. Tags are dropped
 * rather than escaped: the emphasis was the editor's, and losing it reads far
 * better than printing it. Entities are decoded after, so `&amp;` does not
 * survive as six characters where one belongs.
 */
function stripTafsirMarkup(input:string):string{
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function TafsirScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[editions,setEditions]=useState<IslamicEdition[]>([]);const[chapters,setChapters]=useState<IslamicChapter[]>([]);const[picked,setPicked]=useState<IslamicEdition|null>(null);const[surah,setSurah]=useState(1);const[result,setResult]=useState<CachedSurah|null>(null);const[busy,setBusy]=useState(false);const[error,setError]=useState('');const load=()=>{  getEditions('tafsir').then(setEditions).catch(e=>setError(T(e.message)));  getWorkerChapters().then(setChapters).catch(()=>undefined);};useEffect(()=>{load()},[]);useEffect(()=>{  if(!picked)return;  let live=true;  setBusy(true);setError('');  getSurah('tafsir',picked.id,surah)    .then(r=>{if(live)setResult(r)})    .catch(e=>{if(live)setError(T(e.message))})    .finally(()=>{if(live)setBusy(false)});  return()=>{live=false};},[picked,surah]);const chapter=chapters.find(c=>c.number===surah);const title=chapter?(rtl?chapter.nameArabic:chapter.nameSimple):(tf(language,'Surah {n}',{n:surah}));if(!picked)return <Page><ToolBar title={T('Tafsir')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Tafsir" size={85}/><Text style={s.dataTitle}>{T('Choose a Tafsir')}</Text><Text style={s.intro}>{T('Commentary on the Quran, in the language you read it in. Tafsir is one scholar’s reading, not the text itself.')}</Text>{error&&!editions.length?<ErrorState message={error} retry={load}/>:!editions.length?<SkeletonList rows={6} />:<EditionPicker C={C} editions={editions} category="tafsir" searchPlaceholder={T('Search commentary')}  onPick={e=>setPicked(e)}/>}</ScrollView></Page>;return <Page><ToolBar title={T('Tafsir')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><Pressable onPress={()=>setPicked(null)} style={s.editionChip}><Text style={{fontSize:20}}>{languageFlag(picked.language||'ar')}</Text><View style={{flex:1}}><Text style={s.settingName}>{editionDisplayName(picked)}</Text><Text style={s.meta}>{editionSubtitle(picked)}</Text></View><Text style={s.sectionAction}>{T('Change')}</Text></Pressable><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,marginTop:12}}>{chapters.map(c=><ChoicePill key={c.number} label={rtl?c.nameArabic:c.nameSimple} selected={c.number===surah} onPress={()=>setSurah(c.number)}/>)}</ScrollView>{busy&&!result?<Spinner/>:error?<ErrorState message={error}/>:result&&<View style={{marginTop:12}}>{result.rows.map(row=><View key={row.verseKey} style={s.dataCard}><Text style={s.dataMeta}>{title} · {T('AYAH')} {row.numberInSurah}</Text><Text style={s.dataBody}>{stripTafsirMarkup(row.text)}</Text></View>)}</View>}</ScrollView></Page>}
function TafsirCompareScreen({route,navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const verse:Verse=route.params?.verse||{verse_key:'2:255',text_uthmani:''};const[reference,setReference]=useState(verse.verse_key);const{preferences}=useQuranPreferences();const{width}=useWindowDimensions();const[mode,setMode]=useState<'translation'|'tafsir'>('translation');const[editions,setEditions]=useState<QuranEdition[]>([]);const[selected,setSelected]=useState<string[]>([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i));const[rows,setRows]=useState<any[]>([]);const[query,setQuery]=useState('');const[error,setError]=useState('');const loadEditions=()=>getQuranEditions(mode).then(setEditions).catch(e=>setError(T(e.message)));const load=async()=>{setError('');const ids=[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,...selected];const cacheKey=`${reference}:${ids.join(',')}`;const cached=mode==='tafsir'?await getCachedJson<any[]>('tafsir',cacheKey):null;if(cached)setRows(cached);try{const fresh=await getAyahEditions(reference,ids);setRows(fresh);if(mode==='tafsir')await setCachedJson('tafsir',cacheKey,fresh)}catch(e:any){if(!cached)setError(T(e.message))}};useEffect(()=>{loadEditions()},[mode]);useEffect(()=>{load()},[reference,selected.join('|'),preferences.scriptEdition]);useEffect(()=>{if(mode==='tafsir')setSelected(['ar.jalalayn']);else setSelected([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i))},[mode]);const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.length>1?current.filter(x=>x!==id):current:current.length<(mode==='translation'?3:1)?[...current,id]:current);const results=query.trim().length<2?[]:editions.filter(e=>`${e.englishName} ${e.name} ${e.language}`.toLowerCase().includes(query.toLowerCase())).slice(0,30);const arabic=rows[0];const compared=rows.slice(1);const wide=width>=760;const columnWidth=wide?Math.max(260,(Math.min(width-40,900)-12*(compared.length-1))/Math.max(1,compared.length)):0;return <Page><ToolBar title={T('Tafsir & comparison')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      {/* Where you are. The stepper moves one verse; the field takes a typed one. */}
      <View style={s.tcRefBar}>
        <Tactile accessibilityLabel={T('Previous verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${Math.max(1,v-1)}`)}} style={s.stepButton}>{ico(rtl ? 'arrow-forward' : 'arrow-back',19,C.green)}</Tactile>
        <TextInput accessibilityLabel={T('Verse reference')} value={reference} onChangeText={setReference} onSubmitEditing={load} style={[s.referenceInput,{flex:1}]}/>
        <Tactile accessibilityLabel={T('Next verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${v+1}`)}} style={s.stepButton}>{ico(rtl ? 'arrow-back' : 'arrow-forward',19,C.green)}</Tactile>
      </View>
      <View style={s.choiceRow}><ChoicePill label={T('Translations')} selected={mode==='translation'} onPress={()=>setMode('translation')}/><ChoicePill label={T('Tafsir')} selected={mode==='tafsir'} onPress={()=>setMode('tafsir')}/></View>

      {/* The verse first, so every column below has something to be read against. */}
      {!!arabic?.text && <View style={s.tcVerse}><Text style={s.dataMeta}>{T('ARABIC REFERENCE')} · {arabic?.name}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={arabic?.text||''} style={s.dataArabic}/>:<Text style={s.dataArabic}>{arabic?.text}</Text>}</View>}

      <Text style={s.tcSectionLabel}>{mode==='tafsir'?T('TAFSIR SOURCE'):T('COMPARING')}</Text>
      <View style={s.tcChosen}>{selected.map(id=>{const e=editions.find(x=>x.identifier===id);return <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${T('Remove')} ${e?.englishName||id}`} onPress={()=>toggle(id)} style={s.tcChip}><Flag code={e?.language||'en'} size={14}/><Text numberOfLines={1} style={s.tcChipText}>{e?.englishName||id}</Text>{ico('close',13,C.green)}</Pressable>})}</View>

      <View style={[s.search,{marginTop:10}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T(mode === 'translation' ? 'Search language or translator' : 'Search Tafsir source')} style={s.searchInput}/></View>
      {!!results.length && <View style={s.editionPicker}>{results.map(e=><Pressable accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(e.identifier)}} key={e.identifier} onPress={()=>toggle(e.identifier)} style={[s.editionChip,selected.includes(e.identifier)&&s.editionChipActive]}><Flag code={e.language} size={16} /><View style={{flex:1}}><Text numberOfLines={1} style={s.settingName}>{e.englishName}</Text><Text numberOfLines={1} style={s.meta}>{e.language.toUpperCase()} · {e.identifier}</Text></View>{ico(selected.includes(e.identifier)?'checkmark-circle':'add-circle-outline',19,selected.includes(e.identifier)?C.green:C.muted)}</Pressable>)}</View>}
      <Text style={s.comparisonHelp}>{T(mode === 'translation' ? 'Tap a chip to drop it, or search for another. Up to three at a time.' : 'Select a live Tafsir source and language.')}</Text>

      {error?<ErrorState message={error} retry={load}/>:!rows.length?<SkeletonGrid tiles={3} columns={3} height={240} />:<View style={[s.tcColumns,wide&&{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start'}]}>
        {/* Stacked on a phone, side by side when the screen is wide enough for it. */}
        {compared.map(row=><View key={row.edition} style={[s.tcCard,wide&&{width:columnWidth}]}>
          <View style={s.tcCardHead}><Flag code={row.language} size={16} /><Text numberOfLines={1} style={s.tcCardName}>{row.name}</Text><Text style={s.tcCardLang}>{row.language.toUpperCase()}</Text></View>
          <Text style={row.language==='ar'?s.dataArabic:s.comparisonText}>{row.text}</Text>
        </View>)}
      </View>}
    </ScrollView></Page>}

function QuranTopicsScreen({navigation}:any){const[category,setCategory]=useState('All');const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[query,setQuery]=useState('');const shown=QURAN_TOPICS.filter(topic=>(category==='All'||topic.category===category)&&`${topic.title} ${topic.description} ${topic.titleAr} ${topic.descriptionAr}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title={T('Quran topics')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Topics" size={83}/><Text style={s.dataTitle}>{T('Explore the Quran by theme')}</Text><Text style={s.intro}>{T('Curated references open the Arabic text alongside your selected translation.')}</Text><View style={s.search}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T('Search faith, family, patience…')} style={s.searchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8,marginVertical: 12}}>{['All','Faith','Life','Spirituality'].map(item=><ChoicePill key={item} label={T(item)} selected={category===item} onPress={()=>setCategory(item)}/>)}</ScrollView><View style={s.topicGrid}>{shown.map((topic,i)=><MotionPress key={topic.id} index={i} onPress={()=>navigation.navigate('Topic Detail',{topic})} style={s.topicWrap}><View style={s.topicCard}><Text style={s.libraryKicker}>{topicCategory(topic,language)}</Text><Text style={s.exploreTitle}>{topicTitle(topic,language)}</Text><Text style={s.exploreBody}>{topicDescription(topic,language)}</Text><Text style={s.dataMeta}>{tf(language,'{n} VERSES',{n:topic.references.length})}</Text></View></MotionPress>)}</View></ScrollView></Page>}


function TopicDetailScreen({route,navigation}:any){const topic=route.params.topic;const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const{preferences}=useQuranPreferences();const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const load=()=>{setError('');return Promise.all(topic.references.map((ref:string)=>getAyahEditions(ref,[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,preferences.translationEdition]))).then(groups=>setRows(groups.map((items,i)=>({reference:topic.references[i],arabic:items[0],translation:items[1]})))).catch(e=>setError(T(e.message)))};useEffect(()=>{load()},[topic.id,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={topicTitle(topic,language)} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><Text style={s.libraryKicker}>{topicCategory(topic,language)}</Text><Text style={s.dataTitle}>{topicTitle(topic,language)}</Text><Text style={s.intro}>{topicDescription(topic,language)}</Text>{error?<ErrorState message={error} retry={load}/>:!rows.length?<SkeletonList rows={6} />:rows.map(row=><Tactile key={row.reference} onPress={()=>{const[surah]=row.reference.split(':').map(Number);navigation.navigate('Reader',{chapter:{id:surah,name_simple:row.arabic?.name||`Surah ${surah}`,name_arabic:'',verses_count:0},focusVerse:row.reference})}} style={s.dataCard}><Text style={s.dataMeta}>{T('QURAN')} {row.reference}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={row.arabic.text} style={s.dataArabic}/>:<Text style={s.dataArabic}>{row.arabic.text}</Text>}<Text style={s.dataBody}>{row.translation.text}</Text><Text style={s.meta}>{row.translation.name}</Text></Tactile>)}</ScrollView></Page>}

/** The four ways into the word list. */
type VocabGroup = 'all' | 'saved' | 'known' | 'review';
const VOCAB_GROUPS: { key: VocabGroup; label: string }[] = [
  { key: 'all', label: 'All words' },
  { key: 'saved', label: 'Bookmarked' },
  { key: 'known', label: 'Known' },
  { key: 'review', label: 'Still to review' },
];

function VocabularyScreen({navigation}:any){const[index,setIndex]=useState(0);const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[revealed,setRevealed]=useState(false);const[progress,setProgress]=useState<VocabularyProgress>({reviewed:[],known:[],saved:[]});const[mode,setMode]=useState<'study'|'browse'>('study');const[query,setQuery]=useState('');const[group,setGroup]=useState<VocabGroup>('all');useEffect(()=>{loadVocabularyProgress().then(setProgress)},[]);const word=QURAN_VOCABULARY[index];
  const trimmed=query.trim();
  const needle=trimmed.toLowerCase();
  const listed=QURAN_VOCABULARY.filter((entry)=>{
    if(group==='saved'&&!progress.saved.includes(entry.id))return false;
    if(group==='known'&&!progress.known.includes(entry.id))return false;
    /* 'still to review' is the cards you have seen and not yet claimed. */
    if(group==='review'&&(progress.known.includes(entry.id)||!progress.reviewed.includes(entry.id)))return false;
    if(!needle)return true;
    return entry.arabic.includes(trimmed)||entry.transliteration.toLowerCase().includes(needle)
      ||entry.meaning.toLowerCase().includes(needle)||(entry.root||'').includes(trimmed);
  });
  const toggleSaved=async(id:string)=>{
    const saved=progress.saved.includes(id)?progress.saved.filter((entry)=>entry!==id):[...progress.saved,id];
    const value={...progress,saved};setProgress(value);await saveVocabularyProgress(value);
  };const mark=async(known:boolean)=>{const value={reviewed:[...new Set([...progress.reviewed,word.id])],known:known?[...new Set([...progress.known,word.id])]:progress.known.filter(id=>id!==word.id),saved:progress.saved};setProgress(value);await saveVocabularyProgress(value);setRevealed(false);setIndex(valueIndex=>(valueIndex+1)%QURAN_VOCABULARY.length)};return <Page><ToolBar title={T('Quran vocabulary')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Vocabulary" size={83}/><Text style={s.dataTitle}>{T('Frequent Quranic words')}</Text><Text style={s.intro}>{T('A private flashcard review based on high-frequency lemmas and verbs documented by the Quranic Arabic Corpus.')}</Text><View style={s.vocabStats}><Text style={s.settingName}>{tf(language,'{n} known',{n:progress.known.length})}</Text><Text style={s.meta}>{tf(language,'{r} reviewed · {c} cards',{r:progress.reviewed.length,c:QURAN_VOCABULARY.length})}</Text></View>
<View style={s.choiceRow}>
  <ChoicePill label={T('Study')} selected={mode==='study'} onPress={()=>setMode('study')}/>
  <ChoicePill label={T('Browse')} selected={mode==='browse'} onPress={()=>setMode('browse')}/>
</View>
{mode==='browse'?<>
  <TextInput accessibilityLabel={T('Search the vocabulary')} value={query} onChangeText={setQuery}
    placeholder={T('Search Arabic, transliteration, meaning or root')} placeholderTextColor={C.muted} style={s.searchInput}/>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,marginTop:12}}>
    {VOCAB_GROUPS.map((item)=><ChoicePill key={item.key} label={T(item.label)} selected={group===item.key} onPress={()=>setGroup(item.key)}/>)}
  </ScrollView>
  {!listed.length&&<View style={s.empty}><Text style={s.dataBody}>{T('No words match. Try another search, or another group.')}</Text></View>}
  {!!listed.length&&<View style={s.settings}>{listed.map((entry)=>{
    const isSaved=progress.saved.includes(entry.id);
    return <View key={entry.id} style={s.vocabRow}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{checked:isSaved}}
        accessibilityLabel={`${isSaved?T('Remove the bookmark from'):T('Bookmark')} ${entry.transliteration}`}
        onPress={()=>void toggleSaved(entry.id)} style={s.vocabSave}>
        {ico(isSaved?'bookmark':'bookmark-outline',18,isSaved?C.gold:C.muted)}
      </Pressable>
      <View style={{flex:1}}>
        <Text style={s.vocabWord}>{entry.arabic}</Text>
        <Text style={s.settingName}>{entry.transliteration}</Text>
        <Text style={s.meta}>{entry.meaning}{entry.root?` · ${T('Root')} ${entry.root}`:''}</Text>
      </View>
      {progress.known.includes(entry.id)&&<View style={s.vocabKnown}><Text style={s.vocabKnownText}>{T('Known')}</Text></View>}
    </View>;})}
  </View>}
</>:<>
<Pressable accessibilityLabel={`${word.arabic}. ${revealed?`${word.transliteration}, ${word.meaning}`:T('Tap to reveal meaning')}`} onPress={()=>setRevealed(value=>!value)} style={[s.flashcard,{marginTop:20}]}><Text style={s.flashIndex}>{index+1} / {QURAN_VOCABULARY.length}</Text><Text style={s.flashArabic}>{word.arabic}</Text>{revealed?<><Text style={s.flashTransliteration}>{word.transliteration}</Text><Text style={s.flashMeaning}>{word.meaning}</Text>{word.root&&<Text style={s.meta}>{T('Root')} · {word.root}</Text>}</>:<Text style={s.flashHint}>{T('Tap to reveal')}</Text>}</Pressable>{revealed&&<View style={s.actionRow}><Tactile onPress={()=>mark(false)} style={s.secondary}><Text style={s.secondaryText}>{T('Review again')}</Text></Tactile><Tactile onPress={()=>mark(true)} style={s.primary}><Text style={s.primaryText}>{T('I know this')}</Text></Tactile></View>}<View style={s.mushafNav}><Tactile onPress={()=>{setRevealed(false);setIndex((index-1+QURAN_VOCABULARY.length)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico(rtl ? 'arrow-forward' : 'arrow-back',19,C.green)}</Tactile><Tactile onPress={()=>Linking.openURL('https://corpus.quran.com/lemmas.jsp')} style={s.sectionLink}><Text style={s.sectionAction}>{T('Frequency source')}</Text></Tactile><Tactile onPress={()=>{setRevealed(false);setIndex((index+1)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico(rtl ? 'arrow-back' : 'arrow-forward',19,C.green)}</Tactile></View></>}</ScrollView></Page>}

function TajweedStudyScreen({navigation}:any){const[reference,setReference]=useState('2:255');const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const[showNormal,setShowNormal]=useState(false);const load=()=>{if(!/^([1-9]|[1-9]\d|1(?:0\d|1[0-4])):([1-9]\d*)$/.test(reference.trim())){setError(T('Enter a verse reference such as 2:255.'));return}setError('');setRows([]);getAyahEditions(reference.trim(),['quran-tajweed','quran-uthmani','en.sahih']).then(setRows).catch(e=>setError(T(e.message)))};useEffect(load,[]);return <Page><ToolBar title={T('Tajweed study')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Tajweed" size={83}/><Text style={s.dataTitle}>{T('Read the rules in colour')}</Text><Text style={s.intro}>{T('Each Tajweed rule is coloured where it applies. Colours are a learning aid and do not replace study with a qualified teacher.')}</Text><View style={s.search}><TextInput value={reference} onChangeText={setReference} onSubmitEditing={load} placeholder="2:255" style={s.searchInput}/><Pressable accessibilityLabel={T('Load this verse')} onPress={load} style={s.searchGo}>{ico('arrow-forward-circle',23,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label={T('Tajweed colour')} selected={!showNormal} onPress={()=>setShowNormal(false)}/><ChoicePill label={T('Normal text')} selected={showNormal} onPress={()=>setShowNormal(true)}/></View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<SkeletonList rows={5} />:<View style={s.tajweedPractice}><Text style={s.dataMeta}>{T('QURAN')} {reference}</Text>{showNormal?<Text style={s.dataArabic}>{rows[1]?.text}</Text>:<TajweedText text={rows[0]?.text||''} style={s.dataArabic}/>}<Text style={s.dataBody}>{rows[2]?.text}</Text></View>}<Section title={T('Colour legend')}/><View style={s.settings}>{TAJWEED_RULES.map(rule=><View key={rule.name} style={s.tajweedRule}><View style={[s.tajweedSwatch,{backgroundColor:rule.color}]}/><View style={{flex:1}}><Text style={s.settingName}>{tajweedName(rule,language)}</Text><Text style={s.meta}>{tajweedDetail(rule,language)}</Text></View></View>)}</View></ScrollView></Page>}

function JuzDirectoryScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);return <Page><ToolBar title={T('30 Juz')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="30 Juz" size={81}/><Text style={s.dataTitle}>{T('Read by Juz')}</Text><View style={s.juzGrid}>{Array.from({length:30},(_,i)=>i+1).map(juz=><Tactile key={juz} onPress={()=>navigation.navigate('Reader',{section:'juz',juz})} style={s.juzCard}><Text style={s.juzNo}>{juz}</Text><Text style={s.meta}>{T('JUZ')}</Text></Tactile>)}</View></ScrollView></Page>}
function HizbDirectoryScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);return <Page><ToolBar title={T('60 Hizb')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="60 Hizb" size={81}/><Text style={s.dataTitle}>{T('Read by Hizb')}</Text><Text style={s.intro}>{T('Each Hizb contains four quarter-Hizb sections.')}</Text><View style={s.juzGrid}>{Array.from({length:60},(_,i)=>i+1).map(hizb=><Tactile key={hizb} onPress={()=>navigation.navigate('Reader',{section:'hizb',hizb})} style={s.juzCard}><Text style={s.juzNo}>{hizb}</Text><Text style={s.meta}>{T('HIZB')}</Text></Tactile>)}</View></ScrollView></Page>}
function QuranPreloadScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const{preferences}=useQuranPreferences();const[state,setState]=useState(getPreloadState());useEffect(()=>{const unsubscribe=subscribePreload(setState);refreshPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return unsubscribe},[preferences.scriptEdition,preferences.translationEdition]);const start=()=>startQuranPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return <Page><ToolBar title={T('Offline Quran')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Offline Quran" size={85}/><Text style={s.dataTitle}>{T('Prepare for offline reading')}</Text><Text style={s.intro}>{T('Downloads the Arabic script and translation you have selected, one Surah at a time. Preparation continues while you use other screens and prioritizes your current reading Surah.')}</Text><View style={s.preloadScore}><Text style={s.planDays}>{state.cached}</Text><Text style={s.settingName}>{T('of 114 Surahs cached')}</Text><View style={s.preloadTrack}><View style={[s.preloadFill,{width:`${state.cached/114*100}%`} as any]}/></View><Text style={s.meta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}{state.current?(tf(language,' · Preparing Surah {n}',{n:state.current})):''}</Text>{state.usage&&<Text style={s.cacheUsage}>{tf(language,'Quran cache {u} MB · limit {l} MB · total limit {t} MB',{u:(state.usage.byNamespace.quran/1048576).toFixed(1),l:(state.usage.limits.quran/1000000).toFixed(0),t:(state.usage.limits.total/1000000).toFixed(0)})}</Text>}</View>{state.error&&<ErrorState message={state.error} retry={start}/>}<View style={s.actionRow}>{!state.running?<Tactile onPress={start} style={s.primary}><Text style={s.primaryText}>{T(state.cached ? 'Resume preparation' : 'Preload all')}</Text></Tactile>:<Tactile onPress={pauseQuranPreload} style={s.secondary}><Text style={s.secondaryText}>{T('Pause')}</Text></Tactile>}<Tactile onPress={clearPreparedQuran} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear Quran cache')}</Text></Tactile></View><View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Managed low-priority preparation')}</Text><Text style={s.sourceBody}>{T('Cached Surahs open first, already-saved content is skipped, and bounded LRU storage prevents unlimited growth.')}</Text></View></View></ScrollView></Page>}
function ReadingPlansScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[plan,setPlan]=useState<any>(null);useEffect(()=>{loadPlan().then(setPlan)},[]);const start=async(days:number)=>{const next={days,startedAt:Date.now(),completed:[]};await savePlan(next);setPlan(next)};const today=plan?Math.min(plan.days,Math.floor((Date.now()-plan.startedAt)/86400000)+1):0;const toggle=async()=>{const completed=plan.completed.includes(today)?plan.completed.filter((x:number)=>x!==today):[...plan.completed,today];const next={...plan,completed};await savePlan(next);setPlan(next)};return <Page><ToolBar title={T('Reading plans')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Reading Plans" size={81}/><Text style={s.dataTitle}>{T('Complete the Quran')}</Text>{!plan?<><Text style={s.intro}>{T('Choose a private local plan. Progress stays on this device.')}</Text><View style={s.planGrid}>{[30,60,90,120].map(days=><Pressable key={days} onPress={()=>start(days)} style={s.planCard}><Text style={s.planDays}>{days}</Text><Text style={s.settingName}>{T('day plan')}</Text><Text style={s.meta}>{tf(language,'{n} pages daily',{n:(604/days).toFixed(1)})}</Text></Pressable>)}</View></>:<><View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('CURRENT DAY')}</Text><Text style={s.zakatNo}>{today} / {plan.days}</Text></View><View><Text style={s.nextCardLabel}>{T('COMPLETED')}</Text><Text style={s.zakatNo}>{plan.completed.length}</Text></View></View><Pressable onPress={toggle} style={s.planToday}><Text style={s.settingName}>{tf(language,'Day {d} reading',{d:today})}</Text>{ico(plan.completed.includes(today)?'checkmark-circle':'ellipse-outline',28,C.green)}</Pressable><Tactile onPress={async()=>{await savePlan(null);setPlan(null)}} style={s.dangerButton}><Text style={s.dangerText}>{T('End current plan')}</Text></Tactile></>}</ScrollView></Page>}
function HifzScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const[chapters,setChapters]=useState<Chapter[]>([]);const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[filter,setFilter]=useState<'all'|HifzStatus>('all');useEffect(()=>{getChapters().then(setChapters);loadHifz().then(setStatus)},[]);const cycle=async(id:number)=>{const current=status[id]||'not-started';const next:HifzStatus=current==='not-started'?'revising':current==='revising'?'memorized':'not-started';const value={...status,[id]:next};setStatus(value);await saveHifz(value)};const shown=chapters.filter(c=>filter==='all'||(status[c.id]||'not-started')===filter);const memorized=Object.values(status).filter(x=>x==='memorized').length;return <Page><ToolBar title={T('Hifz tracker')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={81}/><Text style={s.dataTitle}>{tf(language,'{n} of 114 memorized',{n:memorized})}</Text><Tactile onPress={()=>navigation.navigate('Memorize')} style={s.practiceLaunch}><View><Text style={s.settingName}>{T('Hide-and-peek recall')}</Text><Text style={s.meta}>{T('Test a verse from your revising or memorized Surahs')}</Text></View>{ico('play-circle',28,C.green)}</Tactile><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>{(['all','not-started','revising','memorized'] as const).map(value=><ChoicePill key={value} label={T(value.replace('-',' '))} selected={filter===value} onPress={()=>setFilter(value)}/>)}</ScrollView><View style={{height:13}}/><View style={s.settings}>{shown.map(c=><Pressable key={c.id} onPress={()=>cycle(c.id)} style={s.translationRow}><View style={s.surahNum}><Text style={s.surahNumText}>{c.id}</Text></View><View style={{flex:1}}><View style={s.surahNameRow}>{rtl && <Text style={s.surahArInline}>{c.name_arabic}</Text>}<Text style={[s.settingName,{flexShrink:1}]} numberOfLines={1}>{c.name_simple}</Text>{!rtl && <Text style={s.surahArInline}>{c.name_arabic}</Text>}</View><Text style={s.meta}>{tf(language,'{n} verses',{n:c.verses_count})}</Text></View><Text style={s.hifzStatus}>{T((status[c.id]||'not-started').replace('-',' '))}</Text></Pressable>)}</View></ScrollView></Page>}

/** The four ways a verse can be put in front of you, in the order they get easier. */
const MEM_MODES: MemorizationMode[] = ['hide-ayah', 'hide-words', 'progressive', 'random'];

/**
 * The memorisation hub.
 *
 * Everything shown here is read back out of the attempt history rather than
 * stored alongside it, so the numbers cannot drift away from the evidence.
 * Correct a verse anywhere in the app and this screen already agrees.
 */
function MemorizeHubScreen({ navigation }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const mem = useMemorization();
  const [hifz, setHifz] = useState<Record<number, HifzStatus>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    void loadHifz().then(setHifz);
    void getChapters().then(setChapters);
  }, []);

  const settings = mem.settings;
  const bank = weakBank();
  const practised = Object.values(mem.verses).filter((verse) => verse.attempts > 0).length;
  const overall = overallConfidence();
  const logged = mem.attempts.filter((entry) => entry.kind === 'attempt').length;
  const working = chapters.filter((chapter) => (hifz[chapter.id] || 'not-started') !== 'not-started');
  const recent = recentAttempts(8);
  const score = Math.round(overall * 100);

  const open = (surahId: number | undefined, label: string) =>
    navigation.navigate('Memorize Test', { surahId, label });

  /* The sliders run over a narrower range than 0-1: blanking nothing is not a
     test, and blanking everything is the other mode. */
  const blankSpan = (settings.hideRatio - 0.15) / 0.7;
  const weakSpan = (settings.weakThreshold - 0.2) / 0.7;

  return <Page><ToolBar title={T('Memorisation')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <View style={s.memHero}>
        <Text style={s.memScore}>{score}%</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.memScoreLabel}>{T('Remembered')}</Text>
          <Text style={s.memHeroNote}>{T('Worked out from your attempts, never set by hand — so correcting one moves this immediately.')}</Text>
        </View>
      </View>
      <View style={s.memBar}><View style={[s.memBarFill, { width: `${score}%` }]} /></View>
      <View style={s.memStats}>
        <View style={s.memStat}><Text style={s.memStatValue}>{practised}</Text><Text style={s.memStatLabel}>{T('Practised')}</Text></View>
        <View style={s.memStat}><Text style={s.memStatValue}>{bank.length}</Text><Text style={s.memStatLabel}>{T('Weak')}</Text></View>
        <View style={s.memStat}><Text style={s.memStatValue}>{logged}</Text><Text style={s.memStatLabel}>{T('Attempts')}</Text></View>
      </View>

      <Section title={T('How you are tested')} />
      <View style={s.choiceGrid}>
        {MEM_MODES.map((mode) => <ChoicePill key={mode}
          label={T(rtl ? MODE_LABELS[mode].ar : MODE_LABELS[mode].en)}
          selected={settings.mode === mode}
          onPress={() => { void saveMemSettings({ mode }); }} />)}
      </View>
      <Text style={[s.meta, { marginTop: 8 }]}>{T(rtl ? MODE_LABELS[settings.mode].noteAr : MODE_LABELS[settings.mode].note)}</Text>

      <Section title={T('How it behaves')} />
      <View style={s.playerCard}>
        {settings.mode === 'hide-words' && <>
          <Text style={s.preferenceLabel}>{T('HOW MUCH TO BLANK')}</Text>
          <View style={s.levelRow}>
            {ico('eye-off-outline', 17, C.green)}
            <LevelBar value={blankSpan} label={T('How much of the verse is blanked')}
              onValue={(next) => { void saveMemSettings({ hideRatio: 0.15 + next * 0.7 }); }} />
            <Text style={s.levelValue}>{Math.round(settings.hideRatio * 100)}</Text>
          </View>
          <Text style={[s.meta, { marginTop: 8 }]}>{T('The blanked words are spread through the verse rather than bunched at one end.')}</Text>
        </>}
        {settings.mode === 'progressive' && <>
          <Text style={s.preferenceLabel}>{T('WORDS AT A TIME')}</Text>
          <View style={s.memStepper}>
            <Pressable onPress={() => { void saveMemSettings({ revealStep: Math.max(1, settings.revealStep - 1) }); }} style={s.memStepButton}>{ico('remove', 18, C.green)}</Pressable>
            <Text style={s.memStepValue}>{settings.revealStep}</Text>
            <Pressable onPress={() => { void saveMemSettings({ revealStep: Math.min(8, settings.revealStep + 1) }); }} style={s.memStepButton}>{ico('add', 18, C.green)}</Pressable>
          </View>
          <Text style={[s.meta, { marginTop: 8 }]}>{T('Each press uncovers a few more words, so you are never completely stuck.')}</Text>
        </>}
        <Text style={[s.preferenceLabel, { marginTop: 16 }]}>{T('TREAT BELOW THIS AS WEAK')}</Text>
        <View style={s.levelRow}>
          {ico('trending-down-outline', 17, C.green)}
          <LevelBar value={weakSpan} label={T('Confidence below which a verse counts as weak')} tint={C.gold}
            onValue={(next) => { void saveMemSettings({ weakThreshold: 0.2 + next * 0.7 }); }} />
          <Text style={s.levelValue}>{Math.round(settings.weakThreshold * 100)}</Text>
        </View>
        <Text style={[s.meta, { marginTop: 8 }]}>{T('Verses under this are drawn more often. Anything you flag yourself counts as weak whatever it scores.')}</Text>
      </View>

      <Section title={T('Practise')} />
      <Tactile onPress={() => open(undefined, T('Weak bank'))} style={s.practiceLaunch}>
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Weak bank')}</Text>
          <Text style={s.meta}>{bank.length
            ? T('What you have flagged, and whatever scores lowest')
            : T('Empty for now — flag a verse during practice and it waits here')}</Text>
        </View>
        {ico('play-circle', 28, C.green)}
      </Tactile>
      {working.length ? <View style={s.settings}>
        {working.map((chapter) => <Pressable key={chapter.id} onPress={() => open(chapter.id, chapter.name_simple)} style={s.memRow}>
          <View style={s.surahMedal}><Text style={s.surahMedalText}>{chapter.id}</Text></View>
          <View style={s.memRowMain}>
            <Text style={s.memKey}>{chapter.name_simple}</Text>
            <Text style={s.meta}>{T((hifz[chapter.id] || 'not-started').replace('-', ' '))}</Text>
          </View>
          {ico('chevron-forward', 18, C.muted)}
        </Pressable>)}
      </View> : <Text style={s.meta}>{T('Mark a Surah as revising or memorised in the Hifz tracker and it appears here.')}</Text>}

      {bank.length > 0 && <>
        <Section title={T('Weak bank')} />
        <View style={s.settings}>
          {bank.slice(0, 12).map((record) => {
            const percent = Math.round(confidenceOf(record) * 100);
            return <View key={record.verseKey} style={s.memRow}>
              <View style={s.memRowMain}>
                <Text style={s.memKey}>{record.verseKey}  <Text style={s.meta}>{record.surahName}</Text></Text>
                <View style={s.memMiniBar}><View style={[s.memMiniFill, { width: `${percent}%` }]} /></View>
              </View>
              <View style={s.memRowRight}>
                <Text style={s.memConf}>{percent}%</Text>
                {record.flaggedWeak ? <View style={s.memFlag}><Text style={s.memFlagText}>{T('Flagged')}</Text></View> : null}
              </View>
              {record.flaggedWeak
                ? <Pressable onPress={() => { void unflagVerse(record.verseKey); }} style={s.memChip}><Text style={s.memChipText}>{T('Remove')}</Text></Pressable>
                : <View style={s.memSpacer} />}
            </View>;
          })}
        </View>
      </>}

      {recent.length > 0 && <>
        <Section title={T('Recent')} />
        <View style={s.memChipWrap}>
          {recent.map((entry) => <View key={entry.id} style={s.memChip}>
            <Text style={s.memChipText}>{entry.verseKey} {entry.result === 'correct' ? '✓' : '✗'}</Text>
          </View>)}
        </View>
      </>}

      <Tactile onPress={() => { void clearMemorization(); }} style={s.dangerButton}>
        <Text style={s.dangerText}>{T('Erase all memorisation history')}</Text>
      </Tactile>
    </ScrollView>
  </Page>;
}

/**
 * One verse at a time.
 *
 * The two ways of being wrong about a verse need two different corrections,
 * which is why both are offered after every answer. "Move to weak bank" says
 * the app gave credit it should not have, and the verse stays weak until it is
 * taken out. "That was a mis-tap" says the attempt should never have counted,
 * and it stops counting — but the record that it happened survives, because
 * quietly deleting the evidence of a mistake is not the same as correcting it.
 */
function MemorizeTestScreen({ navigation, route }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const { preferences } = useQuranPreferences();
  const mem = useMemorization();
  const settings = mem.settings;
  const surahId = route?.params?.surahId as number | undefined;
  const scopeLabel = (route?.params?.label as string) || T('Weak bank');

  const byKey = useRef<Record<string, Verse>>({}).current;
  const [pool, setPool] = useState<VerseRecord[]>([]);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<Attempt | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError('');
    try {
      await loadMemorization();
      const known = getMemorization().verses;
      const records: VerseRecord[] = [];
      if (surahId) {
        const list = await getVerses(surahId, { script: preferences.scriptEdition, translation: preferences.translationEdition });
        list.forEach((item) => { byKey[item.verse_key] = item; });
        list.forEach((item) => {
          records.push(known[item.verse_key] || {
            verseKey: item.verse_key, surahId,
            surahName: item.surah_name || scopeLabel,
            ayah: Number(item.verse_key.split(':')[1]) || 0,
            attempts: 0, correct: 0, wrong: 0, streak: 0
          });
        });
      } else {
        const bank = weakBank();
        const ids = Array.from(new Set(bank.map((record) => record.surahId)));
        const lists = await Promise.all(ids.map((id) => getVerses(id, { script: preferences.scriptEdition, translation: preferences.translationEdition })));
        lists.forEach((list) => list.forEach((item) => { byKey[item.verse_key] = item; }));
        bank.forEach((record) => { if (byKey[record.verseKey]) records.push(record); });
      }
      setPool(records);
      const pick = pickNext(records);
      setCurrentKey(pick ? pick.verseKey : null);
      setRevealed(0); setOpen(false); setAnswer(null);
    } catch (e: any) {
      setError(T(e.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  /* Read the record live rather than from the pool, so a demote or an undo is
     reflected here straight away instead of on the next verse. */
  const current = currentKey ? (mem.verses[currentKey] || pool.find((record) => record.verseKey === currentKey) || null) : null;
  const verse = currentKey ? byKey[currentKey] : undefined;
  const parts = useMemo(() => (verse ? splitWords(verse.text_uthmani) : []), [verse]);
  const wordIndexes = useMemo(() => parts.map((part, index) => (isWord(part) ? index : -1)).filter((index) => index >= 0), [parts]);
  const total = wordIndexes.length;

  const hiddenSet = useMemo(() => {
    if (!total) return new Set<number>();
    if (open) return new Set<number>();
    if (settings.mode === 'progressive') return new Set(wordIndexes.slice(revealed));
    if (settings.mode === 'hide-words') return new Set(hiddenIndexes(parts, settings.hideRatio, currentKey || ''));
    return new Set(wordIndexes);
  }, [total, open, settings.mode, settings.hideRatio, revealed, currentKey, parts, wordIndexes]);

  const revealedRatio = total ? (total - hiddenSet.size) / total : 0;

  const next = () => {
    const live = pool.map((record) => mem.verses[record.verseKey] || record);
    const pick = pickNext(live, currentKey || undefined);
    setCurrentKey(pick ? pick.verseKey : null);
    setRevealed(0); setOpen(false); setAnswer(null);
  };

  const mark = async (result: AttemptResult) => {
    if (!current) return;
    /* Captured before the verse opens, or every answer would look like it was
       given with the whole thing on screen. */
    const ratio = revealedRatio;
    setOpen(true);
    const attempt = await recordAttempt(current.verseKey, current.surahId, current.surahName, current.ayah, result, settings.mode, ratio);
    setAnswer(attempt);
    void logHifzReview();
  };

  const demoteCurrent = async () => {
    if (!current) return;
    await demoteVerse(current.verseKey, current.surahId, current.surahName, current.ayah);
  };

  const undoCurrent = async () => {
    if (!answer) return;
    if (await undoAttempt(answer.id)) setAnswer(null);
  };

  if (loading) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><SkeletonScreen rows={6} /></Page>;
  if (error) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ErrorState message={error} retry={load} /></ScrollView></Page>;
  if (!current || !verse) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><View style={s.emptyWrap}>
    <Text style={s.emptyTitle}>{T('Nothing to test yet')}</Text>
    <Text style={s.emptyBody}>{surahId
      ? T('This Surah has no verses to hand at the moment.')
      : T('Flag a verse during practice and it will wait for you here.')}</Text>
    <Tactile onPress={() => goBackOrHome(navigation)} style={s.primary}><Text style={s.primaryText}>{T('Back')}</Text></Tactile>
  </View></Page>;

  const useTajweed = preferences.scriptEdition === 'quran-tajweed' && (open || !!answer);
  const live = mem.verses[current.verseKey];
  const percent = Math.round(confidenceOf(live || current) * 100);

  return <Page><ToolBar title={scopeLabel} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <Text style={s.memTarget}>{current.surahName} · {current.verseKey}</Text>
      <Text style={s.meta}>{current.attempts
        ? tf(language, 'Asked {n} times · {p}% remembered', { n: current.attempts, p: percent })
        : T('Not tested yet')}</Text>

      <View style={s.memVerseBox}>
        {useTajweed
          ? <TajweedText text={verse.text_uthmani} style={s.memVerseText} />
          : <Text style={s.memVerseText}>{parts.map((part, index) => {
              if (!isWord(part)) return <Text key={index}>{part}</Text>;
              const hidden = hiddenSet.has(index) && !answer;
              return hidden
                ? <Text key={index} style={s.memBlank}>{'\u2007'.repeat(Math.min(5, Math.max(3, Math.round(part.length * 0.5))))}</Text>
                : <Text key={index}>{part}</Text>;
            })}</Text>}
        {!open && !answer && <Text style={s.memHint}>{T('Say it, then check.')}</Text>}
      </View>

      {!answer && <View style={s.memActions}>
        <Tactile onPress={() => { void mark('correct'); }} style={s.primary}><Text style={s.primaryText}>{T('I knew it')}</Text></Tactile>
        {settings.mode === 'progressive' && !open
          ? <Tactile onPress={() => setRevealed((value) => Math.min(total, value + settings.revealStep))} style={s.secondary}>
              {ico('add', 16, C.green)}<Text style={s.secondaryText}>{T('Show more')}</Text></Tactile>
          : null}
        {!open
          ? <Tactile onPress={() => setOpen(true)} style={s.secondary}>
              {ico('eye-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Show me')}</Text></Tactile>
          : <Tactile onPress={() => { void mark('wrong'); }} style={s.secondary}>
              {ico('close-outline', 16, C.coral)}<Text style={s.secondaryText}>{T('I didn’t know it')}</Text></Tactile>}
      </View>}

      {answer && <View style={s.memAnswerCard}>
        <Text style={s.memAnswerTitle}>{answer.result === 'correct' ? T('Marked as known') : T('Marked for review')}</Text>
        <Text style={s.memAnswerBody}>{tf(language, 'Counted with {a}% of the verse on screen. Now {p}% remembered.', { a: Math.round(answer.revealedRatio * 100), p: percent })}</Text>
        <View style={s.memActions}>
          <Tactile onPress={() => { void demoteCurrent(); }} style={s.secondary}>
            {ico('arrow-down-circle-outline', 16, C.gold)}<Text style={s.secondaryText}>{T('Move to weak bank')}</Text></Tactile>
          <Tactile onPress={() => { void undoCurrent(); }} style={s.secondary}>
            {ico('arrow-undo-outline', 16, C.green)}<Text style={s.secondaryText}>{T('That was a mis-tap')}</Text></Tactile>
        </View>
        <Text style={[s.meta, { marginTop: 8 }]}>{T('Moving to the weak bank keeps the attempt and holds the verse there. Undoing stops it counting at all.')}</Text>
      </View>}

      {answer && <Tactile onPress={next} style={s.primary}><Text style={s.primaryText}>{T('Next verse')}</Text></Tactile>}
    </ScrollView>
  </Page>;
}

/**
 * Transliteration: the Arabic sounded out, verse by verse.
 *
 * This is a guide to reciting, not a translation. The two are easy to confuse
 * and the difference matters, so the screen says which it is and keeps the
 * Arabic above the line it is describing rather than replacing it — a
 * transliteration read on its own is a transliteration of something you
 * cannot see.
 *
 * Only three of the fourteen transliterations in the catalogue actually serve
 * a surah; the rest are listed but return nothing. `servableEditions` filters
 * them out, because offering a choice that produces an empty page is worse
 * than offering three.
 */
/**
 * Every surah in one list, so finding one is a single tap rather than a
 * hundred clicks of "next". Search matches the number, the Latin name, the
 * Arabic name or the English meaning.
 */
function SurahPickerSheet({ rtl, T, chapters, selected, onPick, onClose }: {
  rtl: boolean; T: (t: string) => string; chapters: Chapter[];
  selected: number; onPick: (id: number) => void; onClose: () => void;
}) {
  const rise = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return chapters;
    return chapters.filter((c) => (
      String(c.id) === needle ||
      c.name_simple.toLowerCase().includes(needle) ||
      (c.name_arabic || '').includes(needle) ||
      (c.translated_name?.name || '').toLowerCase().includes(needle)
    ));
  }, [chapters, query]);

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise,
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Choose a surah')}</Text>
      <Text style={s.sheetSub}>{chapters.length} {T('surahs')}</Text>

      <View style={s.onbSearch}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={T('Search a surah')}
          placeholderTextColor={C.muted}
          style={s.onbSearchInput}
          accessibilityLabel={T('Search a surah')}
        />
        {!!query && <Pressable accessibilityLabel={T('Clear search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}
      </View>

      <ScrollView overScrollMode={SCROLL.overScrollMode} style={{ marginTop: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!shown.length && <Text style={s.onbCardNote}>{T('No surah matches that.')}</Text>}
        {shown.map((c) => {
          const active = c.id === selected;
          return <Pressable key={c.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${c.name_simple}, ${T('Surah')} ${c.id}`}
            onPress={() => { onPick(c.id); onClose(); }}
            style={[s.langRow, active && s.langRowOn]}>
            <Text style={s.surahPickNum}>{c.id}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.langName, active && s.langNameOn]} numberOfLines={1}>{c.name_simple}</Text>
              {!!c.name_arabic && <Text style={s.surahPickAr} numberOfLines={1}>{c.name_arabic}</Text>}
            </View>
            <Text style={s.langCount}>{c.verses_count}</Text>
            {active && ico('checkmark', 16, C.green)}
          </Pressable>;
        })}
        <View style={{ height: 8 }} />
      </ScrollView>
    </Animated.View>
  </View>;
}

function TransliterationScreen({navigation}:any){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  const[pickingSurah,setPickingSurah]=useState(false);
  const{preferences,update}=useQuranPreferences();
  /* Every surah sits in one strip so reaching any of them is a single tap.
     Chip positions are remembered as they lay out, which is the only way to
     scroll the live one into view without guessing at a width. */
  const stripRef=useRef<any>(null);
  const chipX=useRef<Record<number,number>>({});
  const[chapters,setChapters]=useState<Chapter[]>([]);
  const[chapterId,setChapterId]=useState(1);
  const[editions,setEditions]=useState<IslamicEdition[]>([]);
  const[editionId,setEditionId]=useState('');
  const[rows,setRows]=useState<{n:number;arabic:string;translit:string}[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');
  const chapter=chapters.find(c=>c.id===chapterId);

  useEffect(()=>{getChapters().then(setChapters).catch(()=>undefined)},[]);

  useEffect(()=>{
    let alive=true;
    getEditions('transliteration').then((all)=>{
      if(!alive)return;
      const pool=servableEditions(all,'transliteration');
      setEditions(pool);
      const wanted=pool.find(e=>e.id===preferences.transliterationEdition)||pool.find(e=>e.language==='en')||pool[0];
      if(wanted)setEditionId(wanted.id);
      else setLoading(false);
    }).catch(()=>{if(alive){setError(T('Could not load the transliterations'));setLoading(false)}});
    return ()=>{alive=false};
  },[]);

  useEffect(()=>{
    if(!editionId)return;
    let alive=true; setLoading(true); setError('');
    /* The Arabic and the transliteration are two separate fetches. They are
       joined on the verse's position within the surah, which is the one field
       both endpoints carry. */
    Promise.all([
      getVerses(chapterId,{script:preferences.scriptEdition,translation:preferences.translationEdition}),
      getSurah('transliteration',editionId,chapterId)
    ]).then(([verses,translit])=>{
      if(!alive)return;
      const byNumber=new Map(translit.rows.map(r=>[r.numberInSurah,r.text]));
      setRows(verses.map(v=>{
        const n=Number(String(v.verse_key).split(':')[1])||0;
        return {n, arabic:v.text_uthmani||'', translit:byNumber.get(n)||''};
      }));
      setLoading(false);
    }).catch((e:any)=>{if(alive){setError(e?.message||T('Could not load this surah'));setLoading(false)}});
    return ()=>{alive=false};
  },[chapterId,editionId,preferences.scriptEdition,preferences.translationEdition]);

  useEffect(()=>{
    const x=chipX.current[chapterId];
    if(x===undefined)return;
    const t=setTimeout(()=>{ try{ stripRef.current?.scrollTo({x:Math.max(0,x-24),animated:true}); }catch{} },60);
    return ()=>clearTimeout(t);
  },[chapterId,chapters.length]);

  const step=(delta:number)=>{
    const next=Math.min(114,Math.max(1,chapterId+delta));
    if(next!==chapterId)setChapterId(next);
  };

  return <Page><ToolBar title={T('Transliteration')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Transliteration" size={81}/>
      <Text style={s.dataTitle}>{T('How the Arabic sounds')}</Text>
      <Text style={s.intro}>{T('A guide to reciting, not a translation. The Arabic is kept above each line so you can see what is being sounded out.')}</Text>

      <Section title={T('Surah')} action={T('Search all 114')} onPress={()=>setPickingSurah(true)}/>
      <View style={s.trSurahBar}>
        <Pressable accessibilityRole="button" accessibilityLabel={T('Search a surah')}
          onPress={()=>setPickingSurah(true)} style={s.trSurahSearch}>{ico('search',17,C.green)}</Pressable>
        <ScrollView ref={stripRef} horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.trStrip}>
          {chapters.map((c)=>{
            const active=c.id===chapterId;
            return <Pressable key={c.id}
              accessibilityRole="button" accessibilityState={{selected:active}}
              accessibilityLabel={`${c.name_simple}, ${T('Surah')} ${c.id}`}
              onLayout={(e)=>{chipX.current[c.id]=e.nativeEvent.layout.x;}}
              onPress={()=>setChapterId(c.id)}
              style={[s.trChip,active&&s.trChipOn]}>
              <Text style={[s.trChipNum,active&&s.trChipNumOn]}>{c.id}</Text>
              <Text style={[s.trChipName,active&&s.trChipNameOn]} numberOfLines={1}>{c.name_simple}</Text>
            </Pressable>;
          })}
        </ScrollView>
      </View>

      <View style={s.trStepRow}>
        <Pressable accessibilityLabel={T('Previous Surah')} onPress={()=>step(-1)} disabled={chapterId<=1} style={s.trStep}>{ico(rtl?'chevron-forward':'chevron-back',19,chapterId<=1?C.muted:C.ink)}</Pressable>
        <View style={{flex:1,alignItems:'center'}}>
          <Text style={s.trSurahName} numberOfLines={1}>{chapter?chapter.name_simple:T('Surah')}</Text>
          <Text style={s.meta} numberOfLines={1}>{chapter?`${T('Surah')} ${chapter.id} · ${chapter.verses_count} ${T('verses')}`:''}</Text>
        </View>
        <Pressable accessibilityLabel={T('Next Surah')} onPress={()=>step(1)} disabled={chapterId>=114} style={s.trStep}>{ico(rtl?'chevron-back':'chevron-forward',19,chapterId>=114?C.muted:C.ink)}</Pressable>
      </View>

      {editions.length>1&&<>
        <Section title={T('Script')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingRight:16}}>
          {editions.map(e=>(
            <Pressable key={e.id}
              accessibilityRole="button" accessibilityState={{selected:e.id===editionId}}
              onPress={()=>{setEditionId(e.id);update({transliterationEdition:e.id,transliterationName:editionDisplayName(e)})}}
              style={[s.trEdition,e.id===editionId&&s.trEditionOn]}>
              <Flag code={e.language} size={12}/>
              <Text style={[s.trEditionText,e.id===editionId&&s.trEditionTextOn]} numberOfLines={1}>{editionDisplayName(e)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </>}

      <Section title={T('Verses')}/>
      {loading?<SkeletonList rows={6} />:error?<ErrorState message={error} retry={()=>setChapterId(chapterId)}/>:(
        rows.length?rows.map(r=>(
          <DepthCard key={r.n} style={s.trVerse}>
            <View style={s.trVerseTop}>
              <View style={s.trNum}><Text style={s.trNumText}>{r.n}</Text></View>
              <Text style={s.trArabic}>{r.arabic}</Text>
            </View>
            {!!r.translit&&<Text style={s.trTranslit}>{r.translit}</Text>}
            {!r.translit&&<Text style={s.meta}>{T('No transliteration for this verse in this script.')}</Text>}
          </DepthCard>
        )):<Text style={s.intro}>{T('Nothing to show yet.')}</Text>
      )}
    </ScrollView>
    {pickingSurah&&<SurahPickerSheet rtl={rtl} T={T} chapters={chapters} selected={chapterId}
      onPick={setChapterId} onClose={()=>setPickingSurah(false)}/>}
    </Page>;
}

function QuranStack(){const subtle=useSubtleTransitions();return <Stack.Navigator screenOptions={{...subtle,headerShown:false}}><Stack.Screen name="QuranHome" component={QuranHome}/><Stack.Screen name="Downloads" component={DownloadsScreen}/><Stack.Screen name="Reader" component={ReaderScreen}/><Stack.Screen name="Translations" component={TranslationScreen}/><Stack.Screen name="Quran Vocabulary" component={VocabularyScreen}/><Stack.Screen name="Tajweed Study" component={TajweedStudyScreen}/><Stack.Screen name="Quran Search" component={QuranSearchScreen}/><Stack.Screen name="Bookmarks" component={BookmarkScreen}/><Stack.Screen name="Notes" component={NotesScreen}/><Stack.Screen name="Note Editor" component={needsPayload(NoteEditorScreen, 'Note')}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}
      options={{presentation:'transparentModal',animation:'slide_from_bottom',contentStyle:{backgroundColor:'transparent'}}}/>{/* 'Ayah Actions' was a screen; it is the verse actions sheet now. The route is
    gone on purpose - a restored stack naming it is dropped by the navigator. */}<Stack.Screen name="Tafsir" component={TafsirScreen}/><Stack.Screen name="Tafsir Compare" component={TafsirCompareScreen}/><Stack.Screen name="Quran Topics" component={QuranTopicsScreen}/><Stack.Screen name="Topic Detail" component={TopicDetailScreen}/><Stack.Screen name="Juz Directory" component={JuzDirectoryScreen}/><Stack.Screen name="Hizb Directory" component={HizbDirectoryScreen}/><Stack.Screen name="Reading Plans" component={ReadingPlansScreen}/><Stack.Screen name="Quran Preload" component={QuranPreloadScreen}/><Stack.Screen name="Hifz" component={HifzScreen}/><Stack.Screen name="Khatam" component={KhatamScreen}/><Stack.Screen name="Memorize" component={MemorizeHubScreen}/><Stack.Screen name="Memorize Test" component={MemorizeTestScreen}/><Stack.Screen name="Quran Audio" component={AudioCenterScreen}/><Stack.Screen name="Audio Player" component={AudioPlayerScreen}/><Stack.Screen name="Transliteration" component={TransliterationScreen}/></Stack.Navigator>}

/**
 * The library holds what you read, recite and learn. Nothing here calculates
 * or looks anything up — Zakat and Mosques moved to Tools, and recitation
 * moved to the Quran tab, where the audio screens already live.
 */
/** The guides that belong to Ramadan and the two Eids, kept together. */
const RAMADAN_GUIDE_IDS = ['Ramadan Guide', 'Fasting Guide', 'Laylatul Qadr', 'Zakat al-Fitr', 'Eid Prayer Guide', 'Taraweeh Guide'];

/** The same six, resolved once and in the order they should be read. */
const RAMADAN_GUIDES: WorshipGuide[] = RAMADAN_GUIDE_IDS
  .map((id) => WORSHIP_GUIDES.find((guide) => guide.id === id))
  .filter((guide): guide is WorshipGuide => !!guide);

type LibraryItem = { title: string; caption: string; route: string; params?: any };

/**
 * The library: what you read, what you say, and how the acts of worship go.
 *
 * Three groups rather than a feature grid, so each card says what it is for
 * instead of what it is called. `route` is always a screen in the library's
 * own stack, so a card opens inside the library and the back button returns
 * here rather than dropping you into another tab.
 */
const libraryGroups: { label: string; title: string; items: LibraryItem[] }[] = [
  { label: 'READ', title: 'What you read', items: [
    { title: 'Hadith', caption: 'Collections, books and saved hadith', route: 'Hadith' },
    { title: '99 Names', caption: 'Asma ul-Husna with meanings', route: '99 Names' },
    { title: 'Prophet Names', caption: 'The twenty-five prophets named in the Qur’an', route: 'Prophet Names' },
    { title: 'Muslim Names', caption: 'Boys’ and girls’ names with meanings', route: 'Muslim Names' },
  ]},
  { label: 'REMEMBER', title: 'What you say', items: [
    { title: 'Duas', caption: 'Hisn al-Muslim by occasion', route: 'Duas' },
    { title: 'Adhkar', caption: 'Morning and evening remembrance', route: 'Adhkar' },
    { title: 'Shahada', caption: 'The declaration of faith', route: 'Guide Detail', params: { guide: WORSHIP_GUIDES.find((guide) => guide.id === 'Shahada') } },
  ]},
  { label: 'GUIDES', title: 'Step by step', items: [
    { title: 'Worship guides', caption: 'Wudu, Salah, Janazah and more', route: 'Worship Guides' },
    { title: 'Ramadan', caption: 'Suhoor and Iftar timetable, fasting record and guides', route: 'Ramadan' },
    { title: 'Umrah', caption: 'Ihram, Tawaf and Sa’i, rite by rite', route: 'Journey', params: { kind: 'umrah' } },
    { title: 'Hajj', caption: 'A day-by-day timeline of the journey', route: 'Journey', params: { kind: 'hajj' } },
    { title: 'Ghusl', caption: 'The full washing, step by step', route: 'Ghusl' },
  ]},
];
/**
 * The library. Every card opens a screen in this stack, and a journey is
 * started on the way in so the journey screen always has one to show.
 */
function ExploreHome({navigation}:any){
  const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const journeys=useJourneys();
  const open=(item:LibraryItem)=>{
    const kind=item.params?.kind as JourneyKind|undefined;
    if(kind&&!journeys.active[kind])startJourney(kind,journeyMeta(kind,language).title);
    navigation.navigate(item.route,item.params);
  };
  return <Page><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/><Text style={s.dataTitle}>{T('Library')}</Text><Text style={s.intro}>{T('Remembrance, trusted learning and step-by-step guidance—organized by purpose rather than hidden in a feature grid.')}</Text>{libraryGroups.map(group=><View key={group.label}><Text style={s.libraryKicker}>{T(group.label)}</Text><Text style={s.libraryHeading}>{T(group.title)}</Text><View style={s.exploreGrid}>{group.items.map((item,i)=>{return <MotionPress key={item.title} index={i} onPress={()=>open(item)} style={s.exploreCard}><View style={s.exploreCardInner}><ToolGraphic tool={item.title} size={72}/><Text style={s.exploreTitle}>{T(item.title)}</Text><Text style={s.exploreBody}>{T(item.caption)}</Text><View style={s.exploreArrow}>{ico(rtl ? 'arrow-back' : 'arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></View>)}</ScrollView></Page>;}
/* The back control every secondary screen wears. It goes through
   `goBackOrHome` rather than calling `goBack()` itself: a screen that passes
   no navigator — or one sitting at the bottom of its stack — used to leave
   this arrow pointing at nothing. */
function ToolBar({title,navigation}:any){const {rtl,language}=useLanguage();return <View style={s.readerBar}><IconButton name={rtl?'arrow-forward':'arrow-back'} label={tx(language,'Back')} onPress={()=>goBackOrHome(navigation)}/><Text style={s.readerName}>{title}</Text><View style={{width:44}}/></View>}
/* Sixteen points, the usual navigational set. Left as the Latin abbreviations
   in both languages: they are the standard notation on a compass rather than
   prose, and an invented Arabic for "north-north-east" would be a guess
   dressed up as a translation. */
const COMPASS_POINTS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const compassPoint = (bearing: number) => COMPASS_POINTS[Math.round(((bearing % 360) + 360) % 360 / 22.5) % 16];

/**
 * Which way the top of the device is pointing, in degrees clockwise from
 * magnetic north — or null when there is no magnetometer to ask, which
 * is the case on the web and on a device without one.
 *
 * The Qibla screen used to draw its bearing once and leave it there. A
 * bearing is only half a compass: knowing Makkah is at 137° tells you
 * nothing about where to stand until you also know which way you are
 * facing, and that cannot be worked out from the coordinates — the
 * screen drew an arrow at a fixed angle and called it a direction.
 *
 * The heading is reconstructed the way Android's own SensorManager does
 * it, from the gravity vector and the geomagnetic vector: H is their
 * cross product, M is gravity crossed with H, and the azimuth is
 * atan2(Hy, My). Doing it that way rather than from the magnetometer
 * alone keeps it true when the phone is held up, which is how somebody
 * finding the Qibla will be holding it — a flat reading is only right
 * while the device is flat.
 *
 * Readings are smoothed in vector space, on the circle, because a plain
 * average of two angles one either side of north comes out south.
 */
function useCompass(active: boolean): number | null {
  const [heading, setHeading] = useState<number | null>(null);
  useEffect(() => {
    if (!active) { setHeading(null); return; }
    let mag: { x: number; y: number; z: number } | null = null;
    let acc: { x: number; y: number; z: number } | null = null;
    let sx = 0;
    let sy = 0;
    let seeded = false;
    let alive = true;

    const compute = () => {
      if (!alive || !mag || !acc) return;
      const { x: mx, y: my, z: mz } = mag;
      let ax = acc.x, ay = acc.y, az = acc.z;
      const an = Math.hypot(ax, ay, az);
      /* Below a tenth of a gee the device is in free fall, and there is no
         down to measure an angle against. */
      if (an < 0.1) return;
      ax /= an; ay /= an; az /= an;
      let hx = my * az - mz * ay;
      let hy = mz * ax - mx * az;
      let hz = mx * ay - my * ax;
      const hn = Math.hypot(hx, hy, hz);
      if (hn < 1e-6) return;
      hx /= hn; hy /= hn; hz /= hn;
      const wx = ay * hz - az * hy;
      const wy = az * hx - ax * hz;
      const wz = ax * hy - ay * hx;
      const wn = Math.hypot(wx, wy, wz);
      if (wn < 1e-6) return;
      const rad = Math.atan2(hy, wy / wn);
      if (!seeded) { sx = Math.cos(rad); sy = Math.sin(rad); seeded = true; }
      else { sx = sx * 0.82 + Math.cos(rad) * 0.18; sy = sy * 0.82 + Math.sin(rad) * 0.18; }
      let deg = Math.atan2(sy, sx) * 180 / Math.PI;
      if (deg < 0) deg += 360;
      setHeading(deg);
    };

    let magSub: any = null;
    let accSub: any = null;
    try {
      Magnetometer.setUpdateInterval(80);
      Accelerometer.setUpdateInterval(80);
      magSub = Magnetometer.addListener((d: any) => { mag = d; compute(); });
      accSub = Accelerometer.addListener((d: any) => { acc = d; compute(); });
    } catch {
      /* No sensor to subscribe to — on the web, or on hardware without
         one. The caller keeps showing the plain bearing instead. */
      return;
    }
    return () => {
      alive = false;
      try { magSub?.remove?.(); accSub?.remove?.(); } catch {}
    };
  }, [active]);
  return heading;
}

function QiblaScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const{location}=useAppLocation();const[direction,setDirection]=useState<number|null>(null);const[error,setError]=useState('');const heading=useCompass(direction!==null);const load=async()=>{if(!location)return;setDirection(null);setError('');try{setDirection(await getQibla(location.latitude,location.longitude))}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title={T('Qibla direction')} navigation={navigation}/>{!location?<View style={s.dataPage}><LocationPrompt compact/></View>:<ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.toolPageScroll} showsVerticalScrollIndicator={false}><View style={s.toolPage}><Text style={s.toolEyebrow}>{T(location.label)}</Text>{error?<ErrorState message={error} retry={load}/>:direction===null?<SkeletonCard lines={3} />:<><View style={s.compass}><View style={[s.compassRose,{transform:[{rotate:`${-(heading ?? 0)}deg`}]}]}><Text style={s.north}>N</Text><View style={[s.compassArrow,{transform:[{rotate:`${direction}deg`}]}]}>{ico('navigate',74,C.green)}</View></View><View style={s.kaaba}><View style={s.kaabaGold}/></View></View><Text style={s.direction}>{direction.toFixed(1)}°</Text>
        <Text style={s.directionText}>{compassPoint(direction)} · {T('clockwise from true north')}</Text>{heading!==null&&<><Text style={s.compassLive}>{T('Live')} · {Math.round(heading)}° {T('facing')}</Text><Text style={s.compassHint}>{T('Hold the phone flat, or in a figure of eight, if the arrow drifts.')}</Text></>}
        {!!location && <View style={s.trackStats}>
          <View style={s.trackStat}><Text style={s.trackStatValue}>{Math.round(qiblaDistance(location.latitude, location.longitude)).toLocaleString('en-US')}</Text><Text style={s.trackStatLabel}>{T('km to Makkah')}</Text></View>
          <View style={s.trackStat}><Text style={s.trackStatValue}>{compassPoint(direction)}</Text><Text style={s.trackStatLabel}>{T('Compass point')}</Text></View>
        </View>}
        <Text style={s.intro}>{T('The bearing is measured on a great circle — the shortest way round the earth — which is why it can differ from the direction a flat map appears to show.')}</Text>
        <Tactile onPress={load} style={s.primary}><Text style={s.primaryText}>{T('Refresh direction')}</Text></Tactile></>}</View></ScrollView>}</Page>}
/* A tasbih is a ring of beads, so the counter is one: the beads fill as the
   round goes round, and the one under your thumb is the one that moves. The
   number in the middle is there because you still want to know where you are,
   not because the counter needed a number. */
function TasbihRing({ count, goal, size, onPress, label, children }: {
  count: number; goal: number; size: number; onPress: () => void; label: string; children?: React.ReactNode;
}) {
  const beads = Math.max(1, Math.min(goal, 99));
  const bead = beads > 60 ? 8 : beads > 40 ? 10 : beads > 24 ? 12 : 15;
  const radius = size / 2 - bead - 6;
  const centre = size / 2;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulse.setValue(0);
    Animated.spring(pulse, { toValue: 1, friction: 5, tension: 190, useNativeDriver: true }).start();
  }, [count, pulse]);

  const nodes = [];
  for (let i = 0; i < beads; i += 1) {
    const angle = (i / beads) * Math.PI * 2 - Math.PI / 2;
    const lit = i < count;
    const active = i === count - 1;
    const x = centre + radius * Math.cos(angle) - bead / 2;
    const y = centre + radius * Math.sin(angle) - bead / 2;
    const dot = (
      <View
        key={i}
        style={{
          position: 'absolute', left: x, top: y,
          width: bead, height: bead, borderRadius: bead / 2,
          backgroundColor: lit ? C.gold : C.line,
          opacity: lit ? 1 : 0.6,
        }}
      />
    );
    nodes.push(active
      ? <Animated.View key={i} style={{ position: 'absolute', left: x - bead * 0.35, top: y - bead * 0.35,
          width: bead * 1.7, height: bead * 1.7, borderRadius: bead, alignItems: 'center', justifyContent: 'center',
          transform: [{ scale: pulse }] }}>
          <View style={{ width: bead, height: bead, borderRadius: bead / 2, backgroundColor: C.gold }} />
        </Animated.View>
      : dot);
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 1, borderColor: C.line }} />
      {nodes}
      <View style={{ width: size - radius * 0.95, height: size - radius * 0.95, borderRadius: (size - radius * 0.95) / 2,
        backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </Pressable>
  );
}

function TasbihScreen({ navigation }: any) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const ar = language === 'ar';/* The reader's Arabic face, for the card they share. */const{preferences}=useQuranPreferences();
  const state = useTasbih();
  const { width } = useWindowDimensions();
  const phrase = currentPhrase(state);
  const total = todayTotal(state);
  const press = useRef(new Animated.Value(1)).current;
  const [celebrated, setCelebrated] = useState(false);
  useEffect(() => { if (!celebrated) return; const timer = setTimeout(() => setCelebrated(false), 1600); return () => clearTimeout(timer); }, [celebrated]);
  const tap = async () => {
    Animated.sequence([
      Animated.timing(press, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.spring(press, { toValue: 1, friction: 4, tension: 220, useNativeDriver: true }),
    ]).start();
    haptic('tap');
    const completed = await tapTasbih();
    if (completed) {
      if (Platform.OS !== 'web') haptic('success');
      setCelebrated(true);
    }
  };
  const progress = Math.min(100, Math.round((state.count / state.goal) * 100));
  /**
   * Share the phrase being counted as a card.
   *
   * The lifetime figure goes on the bottom line rather than a running count —
   * a card is a thing you keep, and a number that changes would be wrong on it
   * by tomorrow.
   */
  const { share: shareCardImage, offscreenCard } = useCardShare();
  const sharePhrase = () => {
    const lifetime = tasbihLifetime(state);
    void shareCardImage({
      kicker: T('Dhikr'),
      arabic: phrase.arabic,
      body: dhikrMeaning(phrase, language),
      footer: lifetime ? `${lifetime.toLocaleString('en-US')} ${T('counted so far')}` : phrase.transliteration,
      arabicFontFamily: quranFont(preferences.arabicFont),
      filename: `dhikr-${phrase.id}.png`,
      shareTitle: phrase.transliteration,
      fallbackText: `${phrase.arabic}\n\n${dhikrMeaning(phrase, language)}\n\n${phrase.transliteration}`,
    });
  };
  return <Page><ToolBar title={T('Tasbih')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Tasbih" size={76} />
      <Text style={s.dataTitle}>{T('Dhikr counter')}</Text>
      <Text style={s.intro}>{T('Count privately on this device. Nothing is sent anywhere and no account is needed.')}</Text>

      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View>
          <Text style={s.nextCardLabel}>{T('ALL TIME')}</Text>
          <Text style={s.zakatNo}>{tasbihLifetime(state).toLocaleString('en-US')}</Text>
          <Text style={s.weekScoreBody}>{tasbihDays(state)} {tasbihDays(state) === 1 ? T('day') : T('days')}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.nextCardLabel}>{T('TODAY')}</Text>
          <Text style={s.zakatNo}>{total.toLocaleString('en-US')}</Text>
          <Text style={s.weekScoreBody}>{phrase.transliteration}</Text>
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.choiceRow, s.tasbihRow]}>
        {DHIKR_PHRASES.map((item) => <ChoicePill key={item.id} label={rtl ? item.arabic : item.transliteration} selected={item.id === state.phraseId} onPress={() => { void setTasbihPhrase(item.id); }} />)}
      </ScrollView>

      <View style={s.tasbihCard}>
        <Text style={s.tasbihAr}>{phrase.arabic}</Text>
        <Text style={s.directionText}>{dhikrMeaning(phrase, language)}</Text>
        <View style={{ alignItems: 'center' }}>
          <TasbihRing count={state.count} goal={state.goal} size={width < 360 ? width - 60 : 268} onPress={tap} label={T('Count one dhikr')}>
            <Animated.View style={{ transform: [{ scale: press }], alignItems: 'center' }}>
              <Text style={s.counterNo}>{state.count}</Text>
              <Text style={s.counterGoal}>{celebrated ? T('COMPLETE') : (tf(language,'GOAL · {g}',{g:state.goal}))}</Text>
              {!!state.rounds && <Text style={s.counterGoal}>{ar ? `${state.rounds} ${arNoun(state.rounds, 'دورة', 'دورتان', 'دورات', 'دورة')}` : tf(language,'{n} rounds',{n:state.rounds})}</Text>}
            </Animated.View>
          </TasbihRing>
        </View>
        <View style={[s.hadithTrack, { marginTop: 18 }]}><View style={[s.hadithFill, { width: `${progress}%` }]} /></View>
        <View style={[s.actionRow, { marginTop: 16 }]}>
          <Tactile accessibilityLabel={T('Reset the current count')} onPress={() => void resetTasbihCount()} style={s.secondary}>{ico('refresh-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Reset')}</Text></Tactile>
          <Tactile accessibilityLabel={T('Save this round to history')} onPress={() => void saveTasbihSession()} style={s.secondary}>{ico('checkmark-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Save round')}</Text></Tactile>
          <Tactile accessibilityLabel={T('Share this dhikr as a card')} onPress={sharePhrase} style={s.secondary}>{ico('share-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Share')}</Text></Tactile>
        </View>
      </View>

      <Section title={T('Goal')} />
      <View style={[s.choiceRow, s.tasbihGoalRow]}>
        {TASBIH_GOALS.map((goal) => <ChoicePill key={goal} label={`${goal}`} selected={goal === state.goal} onPress={() => { void setTasbihGoal(goal); }} />)}
      </View>

      <Section title={T('Today')} />
      <View style={s.dataCard}>
        <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{T('Counted today')}</Text><Text style={s.hadithProgressName}>{total}</Text></View>
        <Text style={s.meta}>{tf(language,'Rounds completed on this phrase: {n}',{n:state.rounds})}</Text>
      </View>

      <Section title={T('History')} />
      {!state.sessions.length && <View style={s.empty}><Text style={s.dataBody}>{T('Saved rounds will appear here.')}</Text></View>}
      {state.sessions.slice(0, 12).map((session) => <View key={session.id} style={s.dataCard}>
        <View style={s.hadithProgressHead}>
          <Text style={s.hadithProgressName}>{session.phrase}</Text>
          <Text style={s.meta}>{new Date(session.completedAt).toLocaleDateString()}</Text>
        </View>
        <Text style={s.dataBody}>{session.count} of {session.goal}</Text>
        <Pressable accessibilityLabel={T('Remove this saved round')} onPress={() => void removeTasbihSession(session.id)} style={{ marginTop: 8, alignSelf: 'flex-start' }}><Text style={s.dangerText}>{T('Remove')}</Text></Pressable>
      </View>)}
    </ScrollView>
    {offscreenCard}
  </Page>}

const DUA_SHORTCUT_LABELS: Record<string, string> = {
  morning: 'Morning adhkar',
  evening: 'Evening adhkar',
  'after-prayer': 'After prayer',
  'before-sleep': 'Before sleep',
  'waking-up': 'Waking up',
  prayer: 'Prayer',
  mosque: 'Mosque',
  travel: 'Travel',
  food: 'Food and drink',
  home: 'Home',
  anxiety: 'Anxiety and distress',
  protection: 'Protection',
  forgiveness: 'Forgiveness',
  hajj: 'Hajj and Umrah'
};

function DuaCard({ dua, read, onRead }: { dua: Dua; read?: boolean; onRead?: () => void }) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const { preferences } = useQuranPreferences();
  const [openSource, setOpenSource] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reporting, setReporting] = useState(false);
  const text = [dua.arabic, dua.transliteration, dua.translation].filter(Boolean).join('\n\n');
  const copy = async () => {
    try { await Clipboard.setStringAsync(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ }
  };
  /* Shared as the same picture a verse is, so a dua forwarded to someone
     arrives as the thing itself rather than as a wall of copied text. */
  const { share: shareCardImage, offscreenCard } = useCardShare();
  const share = async () => {
    await shareCardImage({
      kicker: T('Dua and remembrance'),
      arabic: dua.arabic,
      body: dua.translation || '',
      footer: dua.reference || dua.transliteration || '',
      arabicFontFamily: quranFont(preferences.arabicFont),
      filename: `dua-${dua.id}.png`,
      shareTitle: T('A dua'),
      fallbackText: `${text}${dua.reference ? `\n\n${dua.reference}` : ''}`,
    });
  };
  return <View style={s.dataCard}>
    <Text style={s.dataArabic}>{dua.arabic}</Text>
    {!!dua.transliteration && <>
      <Text style={s.duaKicker}>{T('TRANSLITERATION')}</Text>
      <Text style={s.duaTransliteration}>{dua.transliteration}</Text>
    </>}
    <Text style={s.duaKicker}>{T('MEANING')}</Text>
    <Text style={s.dataBody}>{dua.translation}</Text>
    {!!dua.reference && <Tactile accessibilityLabel={T('Show the source of this dua')} onPress={() => setOpenSource(!openSource)} style={s.sectionLink}>
      <Text style={s.duaRefToggle}>{openSource ? T('Hide source') : T('Source')}</Text>
      {openSource && <Text style={s.duaReference}>{dua.reference}</Text>}
    </Tactile>}
    <View style={s.actionRow}>
      <Tactile accessibilityLabel={T('Copy this dua')} onPress={copy} style={s.secondary}>{ico('copy-outline', 16, C.green)}<Text style={s.secondaryText}>{copied ? T('Copied') : T('Copy')}</Text></Tactile>
      <Tactile accessibilityLabel={T('Share this dua')} onPress={share} style={s.secondary}>{ico('share-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Share')}</Text></Tactile>
      <Tactile accessibilityLabel={T('Report a correction')} onPress={() => setReporting(true)} style={s.secondary}>{ico('flag-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Report')}</Text></Tactile>
      {!!onRead && <Tactile accessibilityRole="checkbox" accessibilityState={{ checked: !!read }}
        accessibilityLabel={T('Mark this remembrance as read')} onPress={onRead} style={s.secondary}>
        {ico(read ? 'checkmark-circle' : 'ellipse-outline', 16, read ? C.gold : C.green)}
        <Text style={s.secondaryText}>{read ? T('Read') : T('Mark read')}</Text>
      </Tactile>}
    </View>
    <Modal visible={reporting} transparent animationType="slide" onRequestClose={() => setReporting(false)}>
      <CorrectionSheet
        target={{
          kind: 'dua',
          reference: dua.reference || T('Dua'),
          source: T('Dua and remembrance'),
          arabic: dua.arabic,
          text: dua.translation,
        }}
        rtl={rtl} T={T} appLanguage={language} onClose={() => setReporting(false)}
      />
    </Modal>
    {offscreenCard}
  </View>;
}

function DownloadsScreen({ route, navigation }: any) {
  const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const downloads = useDownloads();
  const { preferences } = useQuranPreferences();
  const [settings, setAudioSettings] = useState<AudioSettings>(getAudioSettings());
  const focusId = Number(route.params?.chapterId || 0) || null;
  const focusName = route.params?.chapterName || '';
  const [free, setFree] = useState<number>(Number.POSITIVE_INFINITY);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { estimateFreeBytes().then(setFree).catch(() => undefined); }, [downloads.length]);
  const edition = settings.reciterMode === 'surah' ? `mp3quran-${settings.surahReciterId ?? ''}` : settings.reciter;
  const editionLabel = settings.reciterMode === 'surah' ? reciterLabel(settings.surahReciterName || T('Full-Surah reciter'), rtl) : reciterLabel(settings.reciterName, rtl);
  const [source, setSource] = useState<{ url: string; note: string }>({ url: '', note: '' });
  useEffect(() => {
    if (!focusId || !edition) { setSource({ url: '', note: '' }); return; }
    let alive = true;
    setSource({ url: '', note: '' });
    resolveAudioSource(edition, focusId)
      .then((resolved) => { if (alive) setSource({ url: resolved.url, note: resolved.note }); })
      .catch(() => { if (alive) setSource({ url: '', note: 'This reciter has no full-Surah file to keep.' }); });
    return () => { alive = false; };
  }, [edition, focusId]);
  const url = source.url;
  const run = async (label: string, task: () => Promise<unknown>) => {
    setBusy(label);
    setMessage('');
    try {
      await task();
    } catch (error: any) {
      setMessage(error?.message || T('The download could not be completed.'));
    } finally {
      setBusy('');
    }
  };
  const keepAudio = () => run('audio', () => downloadSurahAudio({
    chapterId: focusId as number,
    chapterName: focusName,
    edition,
    label: tf(language,'{e} · full Surah',{e:editionLabel}),
    url
  }));
  const used = totalDownloadBytes();
  return <Page><ToolBar title={T('Downloads')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Offline Quran" size={76} />
      <Text style={s.dataTitle}>{T('Kept on this device')}</Text>
      <View style={s.dataCard}>
        <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{T('Stored')}</Text><Text style={s.hadithProgressName}>{formatBytes(used)}</Text></View>
        <Text style={s.meta}>{T('Free space: ')}{free === Number.POSITIVE_INFINITY ? T('unknown on this browser') : formatBytes(free)}</Text>
      </View>

      {!!focusId && <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('KEEP THIS SURAH')}</Text>
        <Text style={s.dataName}>{focusName}</Text>
        <Text style={s.meta}>{T('Audio')}: {editionLabel}{T(settings.reciterMode === 'surah' ? ' (file per Surah)' : ' (full-Surah file)')}</Text>
        <Text style={s.meta}>{T('Text')}: {T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel={T('Keep the audio for this Surah')} disabled={!url || busy === 'audio'} onPress={() => { void keepAudio(); }} style={[s.secondary, (!url || busy === 'audio') && { opacity: 0.5 }]}><Text style={s.secondaryText}>{T(busy === 'audio' ? 'Downloading…' : 'Keep audio')}</Text></Pressable>
        </View>
        {!url && !!source.note && <Text style={s.meta}>{source.note}</Text>}
        {!!url && <Text style={s.meta}>{T(settings.reciterMode === 'surah' ? 'One file for the whole Surah.' : 'Fetched in 4 MB pieces, checked against the size the source reports, then saved.')}</Text>}
      </View>}

      {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}

      <Section title={tf(language,'Saved ({n})',{n:downloads.length})} />
      {!downloads.length && <View style={s.empty}><Text style={s.dataBody}>{T('Nothing saved yet. Open a Surah and choose what to keep.')}</Text></View>}
      {downloads.map((item) => <View key={item.id} style={s.dataCard}>
        <View style={s.hadithProgressHead}>
          <Text style={s.hadithProgressName}>{item.chapterName}</Text>
          <Text style={s.meta}>{T(item.kind === 'audio' ? 'Audio' : 'Text')} · {item.status === 'done' ? formatBytes(item.bytes) : T(item.status)}</Text>
        </View>
        <Text style={s.dataBody}>{item.label}</Text>
        {item.status === 'downloading' && <View style={s.hadithTrack}><View style={[s.hadithFill, { width: `${Math.round(item.progress * 100)}%` }]} /></View>}
        {!!item.error && <Text style={s.duaReference}>{item.error}</Text>}
        <View style={s.actionRow}>
          {(item.status === 'failed' || item.status === 'paused') && <Tactile accessibilityLabel={`${T('Retry')} ${item.chapterName}`} onPress={() => { void retryDownload(item.id).catch((error: any) => setMessage(error?.message || 'The download could not be restarted.')); }} style={s.secondary}><Text style={s.secondaryText}>{T('Retry')}</Text></Tactile>}
          {item.status === 'downloading' && <Tactile accessibilityLabel={`${T('Pause')} ${item.chapterName}`} onPress={() => { void pauseDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>{T('Pause')}</Text></Tactile>}
          {item.status === 'paused' && <Tactile accessibilityLabel={`${T('Resume')} ${item.chapterName}`} onPress={() => { void resumeDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>{T('Resume')}</Text></Tactile>}
          <Tactile accessibilityLabel={`${T('Remove')} ${item.chapterName}`} onPress={() => { void removeDownload(item.id); }} style={s.secondary}>{ico('trash-outline', 15, C.coral)}<Text style={[s.secondaryText, { color: C.coral }]}>{T('Remove')}</Text></Tactile>
        </View>
      </View>)}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('How a download is verified')}</Text><Text style={s.apiText}>{T('Files are written to a temporary partial file first, checked against the size the server reported, and only then moved into place. A failed download is deleted rather than left half-written.')}</Text></View>
    </ScrollView></Page>}

function NamesScreen({ navigation }: any) {const {rtl,language:appLanguage}=useLanguage();const T=(text:string)=>tx(appLanguage,text);
  const { preferences } = useQuranPreferences();
  const [names, setNames] = useState<DivineName[]>([]);
  const [day, setDay] = useState<DivineName | null>(null);
  const [language, setLanguage] = useState('en');
  const [query, setQuery] = useState('');
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  /* Shared as the same artefact as a verse: dark brand card, Arabic set in
     the family the reader is using, meaning in the language they picked. */
  const { share: shareCardImage, offscreenCard } = useCardShare();
  const shareNameCard = async (name: DivineName) => {
    const value = meaning(name);
    await shareCardImage({
      kicker: `${T('Name')} ${name.number} · ${T('The Beautiful Names')}`,
      arabic: name.name,
      body: value,
      footer: name.transliteration,
      arabicFontFamily: quranFont(preferences.arabicFont),
      filename: `name-${name.number}.png`,
      shareTitle: name.transliteration,
      fallbackText: `${name.name}\n\n${name.transliteration}\n\n${value}`,
    });
  };

  const load = () => {
    setError('');
    return Promise.all([loadNames(), loadNameOfDay(), loadNameLanguage()])
      .then(([catalogue, today, code]) => {
        setNames(catalogue);
        setDay(today);
        setLanguage(code);
        setOffline(false);
      })
      .catch((e: any) => setError(T(e.message || 'Please check your connection.')));
  };
  useEffect(() => { void load(); }, []);
  const soften = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]/g, '').replace(/aa/g, 'a');
  const needle = soften(query.trim());
  const shown = names.filter((name) => soften(`${name.number} ${name.transliteration} ${name.meaning} ${Object.values(name.meanings || {}).join(' ')} ${name.name}`).includes(needle));
  const meaning = (name: DivineName) => (language === 'ar' ? NAMES_MEANING_AR[name.number] : undefined) || name.meanings?.[language] || name.meanings?.en || name.meaning;
  const pickLanguage = async (code: string) => { setLanguage(code); await saveNameLanguage(code); };
  return <Page><ToolBar title={T('The Beautiful Names')} navigation={navigation}/><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="99 Names" size={81} />
    <Text style={s.dataTitle}>{T('The Beautiful Names')}</Text>
    
    <Text style={s.intro}>{T('Ninety-nine Names with their Arabic, transliteration and meaning. Choose the language the meaning is shown in.')}</Text>

    {!!day && <View style={s.nameOfDayCard}>
      <Text style={s.duaKicker}>{T('NAME OF THE DAY')}</Text>
      <Text style={s.namesArabicLarge}>{day.name}</Text>
      <Text style={s.namesTransliteration}>{day.transliteration}</Text>
      <Text style={s.dataBody}>{meaning(day)}</Text>
    </View>}

    <Section title={T('Meaning language')} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
      {NAME_LANGUAGES.map((entry) => <ChoicePill key={entry.code} label={T(entry.label)} selected={entry.code === language} onPress={() => { void pickLanguage(entry.code); }} />)}
    </ScrollView>

    <View style={[s.search,{marginTop:12}]}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search the Names')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search a Name')} placeholderTextColor={C.muted} />{query.length > 0 && <Pressable accessibilityLabel={T('Clear name search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!error && !names.length && <SkeletonList rows={8} tile={44} lines={3} />}
    {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
    <Text style={s.meta}>{tf(language,'{s} of {t} Names',{s:shown.length,t:names.length || 99})}</Text>
    {shown.map((name) => <View key={name.number} style={s.nameRow}>
      <View style={s.nameNumber}><Text style={s.hadithNumberText}>{name.number}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={s.namesArabic}>{name.name}</Text>
        <Text style={s.namesTransliteration}>{name.transliteration}</Text>
        <Text style={s.dataBody}>{meaning(name)}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Share this Name as an image')}
        onPress={() => void shareNameCard(name)} style={s.nameShare}>
        {ico('share-outline', 18, C.green)}
      </Pressable>
    </View>)}
    {!!names.length && <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Kept on this device')}</Text><Text style={s.apiText}>{tf(language,'The catalogue is stored after the first visit, so the Names can be read without a connection. The Qur’an translation you use elsewhere ({e}) does not affect these meanings.',{e:preferences.translationEdition})}</Text></View>}
    <Tactile accessibilityLabel={T('Open the prophets catalogue')} onPress={() => navigation.navigate('Prophet Names')} style={s.secondary}><Text style={s.secondaryText}>{T("Prophets named in the Qur'an")}</Text></Tactile>
  </ScrollView>
    {offscreenCard}
  </Page>}

/**
 * Choosing a name for a child.
 *
 * Thirteen thousand names is far too many to draw at once — a list that long
 * would need tens of thousands of views and would stop the phone — so the
 * list is paged, sixty at a time, and search is the quickest way in.
 *
 * The meanings are the supplier's and are shown as they arrived. This is a
 * book of names, not a ruling: nothing here says what a child may be called.
 */
const NAME_FILTER_LABEL: Record<NameFilter, string> = { all: 'All', male: 'Boys', female: 'Girls', unisex: 'Unisex' };
const NAME_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function MuslimNamesScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const { preferences } = useQuranPreferences();
  const scrollRef = useRef<any>(null);
  const [filter, setFilter] = useState<NameFilter>('all');
  const [letter, setLetter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(60);
  const [ready, setReady] = useState(false);

  /* The catalogue is about a megabyte, so it is read the first time this
     screen opens rather than while the app is starting. */
  useEffect(() => { loadMuslimNames(); setReady(true); }, []);
  /* Any change to what is being looked at starts the list again from the top. */
  useEffect(() => { setLimit(60); }, [query, filter, letter]);

  const results = useMemo(
    () => (ready ? findMuslimNames({ query, filter, letter, limit }) : []),
    [ready, query, filter, letter, limit]);
  const total = useMemo(() => (ready ? countMuslimNames(filter, letter) : 0), [ready, filter, letter]);
  const counts = useMemo(() => (ready ? letterCounts(filter) : {}), [ready, filter]);

  /* Choosing a letter or a gender replaces the whole list, so the reader is
     taken back to the top of it rather than left wherever they had scrolled. */
  const jump = (run: () => void) => { run(); scrollRef.current?.scrollTo?.({ y: 0, animated: false }); };

  const genderLabel = (gender: MuslimName['gender']) =>
    gender === 'male' ? T('Boy') : gender === 'female' ? T('Girl') : T('Either');

  const { share: shareCardImage, offscreenCard } = useCardShare();
  const shareName = async (name: MuslimName) => {
    await shareCardImage({
      kicker: T('Muslim Names'),
      arabic: name.arabic,
      body: name.meaning,
      footer: `${name.name} · ${genderLabel(name.gender)}`,
      arabicFontFamily: quranFont(preferences.arabicFont),
      filename: `muslim-name-${name.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      shareTitle: name.name,
      fallbackText: `${name.arabic}\n\n${name.name}\n\n${name.meaning}`,
    });
  };

  return <Page><ToolBar title={T('Muslim names')} navigation={navigation}/>
    <ScrollView ref={scrollRef} keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Muslim Names" size={81} />
      <Text style={s.dataTitle}>{T('Muslim names')}</Text>
      <Text style={[s.intro, { marginBottom: 0 }]}>{T('Thirteen thousand names for boys and girls, with their Arabic and meaning.')}</Text>

      <Section title={T('Boy or girl')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
        {(['all', 'male', 'female', 'unisex'] as NameFilter[]).map((option) => (
          <ChoicePill key={option} label={T(NAME_FILTER_LABEL[option])} selected={filter === option}
            onPress={() => jump(() => setFilter(option))} />
        ))}
      </ScrollView>

      <View style={[s.search, { marginTop: 12, marginBottom: 0 }]}>
        {ico('search', 18, C.muted)}
        <TextInput accessibilityLabel={T('Search Muslim names')} value={query} onChangeText={setQuery}
          placeholder={T('Search a name, its Arabic or its meaning')} placeholderTextColor={C.muted} style={s.searchInput} />
        {query.length > 0 && <Pressable accessibilityLabel={T('Clear the search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}
      </View>

      <Section title={T('Alphabetical')} />
      <View style={s.letterGrid}>
        <Tactile accessibilityLabel={T('Every letter')} onPress={() => jump(() => setLetter(null))}
          style={[s.letterCell, s.letterCellWide, letter === null && s.letterCellActive]}>
          <Text style={[s.letterText, letter === null && s.letterTextActive]}>{T('All')}</Text>
        </Tactile>
        {NAME_LETTERS.map((L) => {
          const howMany = counts[L] || 0;
          const on = letter === L;
          return <Tactile key={L} accessibilityLabel={`${T('Letter')} ${L}, ${howMany} ${T('names')}`}
            onPress={() => jump(() => setLetter(on ? null : L))}
            style={[s.letterCell, on && s.letterCellActive, !howMany && s.letterCellEmpty]}>
            <Text style={[s.letterText, on && s.letterTextActive, !on && !howMany && s.letterTextDim]}>{L}</Text>
          </Tactile>;
        })}
      </View>

      <Text style={[s.meta, { marginTop: 16, marginBottom: 8 }]}>{rtl
        ? `${results.length} من ${total} اسم`
        : `${results.length.toLocaleString('en-US')} of ${total.toLocaleString('en-US')} names`}</Text>

      {results.map((name) => <View key={name.name} style={s.nameRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.dataName}>{name.name}</Text>
          <Text style={s.namesArabic}>{name.arabic}</Text>
          <Text style={s.dataBody}>{name.meaning}</Text>
          {name.gender === 'both' && <Text style={s.meta}>{T('Given to either')}</Text>}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`${T('Share')} ${name.name}`}
          onPress={() => void shareName(name)} style={s.nameShare}>{ico('share-outline', 18, C.green)}</Pressable>
      </View>)}

      {results.length >= limit && <Tactile accessibilityLabel={T('Show more names')}
        onPress={() => setLimit((value) => value + 60)} style={[s.secondary, { marginTop: 12 }]}>
        <Text style={s.secondaryText}>{T('Show more')}</Text>
      </Tactile>}
      {ready && !results.length && <View style={s.empty}><Text style={s.dataBody}>{T('No name matches. Try another spelling.')}</Text></View>}
    </ScrollView>
    {offscreenCard}
  </Page>;
}


function ProphetNamesScreen({ navigation }: any) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const { preferences } = useQuranPreferences();
  const [open, setOpen] = useState<string | null>(null);
  const [verse, setVerse] = useState<any[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    const prophet = PROPHETS.find((entry) => entry.id === open);
    if (!prophet) return;
    setError('');
    setVerse([]);
    getAyahEditions(prophet.reference, [preferences.scriptEdition === 'quran-indopak' ? 'quran-uthmani' : preferences.scriptEdition, preferences.translationEdition])
      .then(setVerse)
      .catch((e: any) => setError(T(e.message || 'Please check your connection.')));
  }, [open, preferences.scriptEdition, preferences.translationEdition]);
  return <Page><ToolBar title={T('Prophets')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Names" size={76} />
      <Text style={s.dataTitle}>{T("Prophets in the Qur'an")}</Text>
      <Text style={s.intro}>{T("Twenty-five prophets are named in the Qur'an. Open one to read the verse the reference points to.")}</Text>
      {PROPHETS.map((prophet) => {
        const isOpen = open === prophet.id;
        return <View key={prophet.id} style={s.dataCard}>
          <Pressable accessibilityLabel={`${T('Open')} ${prophet.english}`} onPress={() => setOpen(isOpen ? null : prophet.id)}>
            <View style={s.nameRow}>
              <View style={s.nameNumber}><Text style={s.namesArabic}>{prophet.arabic}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.namesTransliteration}>{rtl ? prophet.transliteration : `${prophet.transliteration} · ${prophet.english}`}</Text>
                <Text style={s.dataBody}>{language === 'ar' ? prophet.noteAr : prophet.note}</Text>
              </View>
              {ico(isOpen ? 'chevron-down' : 'chevron-forward', 16, C.muted)}
            </View>
          </Pressable>
          {isOpen && <>
            <Text style={s.duaKicker}>{T('VERSE')} {prophet.reference}</Text>
            {!!error && <Text style={s.dataMeta}>{error}</Text>}
            {!error && !verse.length && <SkeletonParagraph lines={3} />}
            {verse.map((row) => <View key={row.edition}>
              {row.language === 'ar' ? <Text style={s.dataArabic}>{row.text}</Text> : <Text style={s.dataBody}>{row.text}</Text>}
            </View>)}
          </>}
        </View>;
      })}
    </ScrollView></Page>}

function DuasScreen({ navigation }: any) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const [payload, setPayload] = useState<{ shortcuts: string[]; categories: DuaCategory[] } | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const load = () => {
    setError('');
    return loadDuaCategories()
      .then((next) => setPayload({ shortcuts: next.shortcuts, categories: next.categories }))
      .catch((e: any) => setError(T(e.message || 'Please check your connection.')));
  };
  useEffect(() => { void load(); }, []);
  const categories = (payload?.categories || []).filter((category) => `${category.en} ${category.ar}`.toLowerCase().includes(query.trim().toLowerCase()));
  const shortcuts = payload?.shortcuts || [];
  return <Page><ToolBar title={T('Duas and Adhkar')} navigation={navigation}/><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Duas" size={81} />
    <Text style={s.dataTitle}>{T('Duas and Adhkar')}</Text>
    
    <Text style={s.intro}>{T('Remembrance for 132 occasions, in Arabic with transliteration and meaning. Each entry keeps the reference the source gives for it.')}</Text>

    <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search occasions')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search an occasion')} placeholderTextColor={C.muted} />{query.length > 0 && <Pressable accessibilityLabel={T('Clear occasion search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!payload && !error && <SkeletonList rows={6} />}
    {!!payload && <>
      <Section title={T('Daily moments')} />
      <View style={s.duaShortcutGrid}>{shortcuts.map((key) => {
        const category = payload.categories.find((entry) => entry.key === key);
        return <Pressable key={key} accessibilityLabel={`Open ${T(DUA_SHORTCUT_LABELS[key] || key)}`} onPress={() => navigation.navigate('Dua Category', { key, label: T(DUA_SHORTCUT_LABELS[key] || key) })} style={s.duaShortcut}>
          <Text style={s.duaShortcutLabel}>{T(DUA_SHORTCUT_LABELS[key] || key)}</Text>
          <Text style={s.meta}>{category ? `${category.count} ${T(category.count === 1 ? 'dua' : 'duas')}` : T('Open')}</Text>
        </Pressable>;
      })}</View>
      <Section title={T('All occasions')} />
      <View style={s.duaCategoryGrid}>{categories.map((category) => <Pressable key={category.key} accessibilityLabel={`Open ${rtl ? category.ar : category.en}`} onPress={() => navigation.navigate('Dua Category', { key: category.key, label: rtl ? category.ar : category.en })} style={s.duaCategoryCard}>
        <Text style={s.duaCategoryNo}>{category.number}</Text>
        <Text style={s.duaCategoryName}>{rtl ? category.ar : category.en}</Text>
        <Text style={s.meta}>{category.count} {T(category.count === 1 ? 'dua' : 'duas')}</Text>
      </Pressable>)}</View>
      {!categories.length && <View style={s.empty}><Text style={s.dataBody}>{T('No occasion matches that word.')}</Text></View>}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Kept on this device')}</Text><Text style={s.apiText}>{T('Every occasion you open is stored locally, so it can be read again without a connection.')}</Text></View>
    </>}
  </ScrollView></Page>}

function DuaCategoryScreen({ route, navigation }: any) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const key = String(route.params?.key || 'morning');
  const label = route.params?.label || 'Adhkar';
  const [duas, setDuas] = useState<Dua[]>([]);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    return loadDuas(key)
      .then((result) => { setDuas(result.duas); setOffline(result.cached); })
      .catch((e: any) => setError(T(e.message || 'Please check your connection.')));
  };
  useEffect(() => { void load(); }, [key]);
  return <Page><ToolBar title={label} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <SkeletonList rows={6} />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)}
      {!!duas.length && <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Collection')}</Text><Text style={s.apiText}>{duas[0].category || label}</Text></View>}
    </ScrollView></Page>}

function AdhkarScreen({ route, navigation }: any) {const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const [category, setCategory] = useState(route.params?.initial || 'morning');
  /* Which of these have been said today. The count is what the week adds up;
     the tick is only so you can see where you are, and it resets when the
     screen does. */
  const [read, setRead] = useState<Record<string, boolean>>({});
  const markRead = (id: string) => {
    if (read[id]) return;
    setRead((prev) => ({ ...prev, [id]: true }));
    void logAdhkarRead();
  };
  const [duas, setDuas] = useState<Dua[]>([]);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    return loadDuas(category)
      .then((result) => { setDuas(result.duas); setOffline(result.cached); })
      .catch((e: any) => setError(T(e.message || 'Please check your connection.')));
  };
  useEffect(() => { void load(); }, [category]);
  /* Morning and evening are two of the fourteen occasions this collection
     carries, so the screen names whichever one it was pointed at rather
     than assuming everything that is not morning must be evening. */
  const tabs=[
    {key:'morning',label:T('Morning'),title:T('Morning remembrance'),graphic:'Morning Adhkar'},
    {key:'evening',label:T('Evening'),title:T('Evening remembrance'),graphic:'Evening Adhkar'},
    {key:'after-prayer',label:T('After prayer'),title:T('After the prayer'),graphic:'Duas'},
  ];
  const active=tabs.find(t=>t.key===category)||tabs[0];
  return <Page><ToolBar title={T('Daily Adhkar')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool={active.graphic} size={81} />
      <Text style={s.dataTitle}>{active.title}</Text>
      <View style={s.choiceRow}>
        {tabs.map(tab => <ChoicePill key={tab.key} label={tab.label} selected={category === tab.key} onPress={() => setCategory(tab.key)} />)}
      </View>
      <View style={{ height: 12 }} />
      <Tactile accessibilityLabel={T('Browse every occasion')} onPress={() => navigation.navigate('Duas')} style={s.secondary}><Text style={s.secondaryText}>{T('All duas and occasions')}</Text></Tactile>
      <View style={{ height: 14 }} />
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <SkeletonList rows={6} />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} read={!!read[dua.id]} onRead={() => markRead(dua.id)} />)}
    </ScrollView></Page>}

function DataTool({route,navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
 const {location}=useAppLocation(); const title=route.name; const[items,setItems]=useState<any[]>([]); const[error,setError]=useState(''); const[loaded,setLoaded]=useState(false);
 const load=async()=>{setError('');setLoaded(false);try{if(title==='Duas')setItems(await getDuas('morning'));else if(title==='99 Names')setItems(await getNames());else if(title==='Hadith')setItems([await getDailyHadith()]);}catch(e:any){setError(T(e.message))}finally{setLoaded(true)}};
 useEffect(()=>{load()},[title,location?.latitude,location?.longitude]);
 return <Page><ToolBar title={T(title)} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><Text style={s.dataTitle}>{title==='Duas'?T('Morning remembrance'):title==='99 Names'?'The Beautiful Names':title==='Hadith'?T('Hadith of the day'):T(title)}</Text>{error?<ErrorState message={error} retry={load}/>:!loaded?<SkeletonList rows={6} />:!items.length?<View style={s.empty}><View style={s.errorIcon}>{ico('location-outline',24,C.green)}</View><Text style={s.errorTitle}>{T('No live records nearby')}</Text><Text style={s.errorText}>{T('The directory does not currently list a public mosque within 50 km of this location.')}</Text></View>:items.map((item:any,i)=><View key={item.number||item.slug||i} style={s.dataCard}>{title==='99 Names'?<><Text style={s.dataArabic}>{item.name}</Text><Text style={s.dataName}>{item.transliteration}</Text><Text style={s.dataBody}>{item.meaning}</Text></>:title==='Hadith'?<><Text style={s.dataBody}>{item.text}</Text><Text style={s.dataMeta}>{item.collection?.toUpperCase()} · {item.number}</Text></>:<><Text style={s.dataArabic}>{item.arabic}</Text><Text style={s.dataBody}>{item.translation}</Text><Text style={s.dataMeta}>{item.category}</Text></>}</View>)}</ScrollView></Page>
}

const formatJourneyDay = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};



function JourneyScreenInner({ route, navigation }: any) {
  const [tappedStep, setTappedStep] = useState<string | null>(null);
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const kind: JourneyKind = route.params.kind;
  const { preferences } = useQuranPreferences();
  const journeys = useJourneys();
  const journey = journeys.active[kind];
  const steps = JOURNEY_STEPS[kind].map((step) => localizeJourneyStep(step, language));
  const progress = journeyProgress(journey);
  const [verseFor, setVerseFor] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [verses, setVerses] = useState<Record<string, { arabic: string; translation: string; reference: string }[]>>({});
  const [loadingVerse, setLoadingVerse] = useState<string | null>(null);
  const [verseError, setVerseError] = useState('');
  const wentBack = useRef(false);
  useEffect(() => {
    if (!journey && !wentBack.current) { wentBack.current = true; goBackOrHome(navigation); }
  }, [journey, navigation]);

  const loadVerses = async (step: JourneyStep) => {
    if (verses[step.id] || !step.verseKeys?.length) { setVerseFor(verseFor === step.id ? null : step.id); return; }
    setLoadingVerse(step.id);
    setVerseError('');
    try {
      const loaded: { arabic: string; translation: string; reference: string }[] = [];
      for (const key of step.verseKeys) {
        const editions = await getAyahEditions(key, [preferences.scriptEdition, preferences.translationEdition]);
        const arabic = editions.find((edition) => edition.language === 'ar')?.text || '';
        const translation = editions.find((edition) => edition.language !== 'ar')?.text || '';
        loaded.push({ arabic, translation, reference: key });
      }
      setVerses((current) => ({ ...current, [step.id]: loaded }));
      setVerseFor(step.id);
    } catch (e: any) {
      setVerseError(e.message || 'Please check your connection.');
    } finally {
      setLoadingVerse(null);
    }
  };

  if (!journey) return <Page><ToolBar title={JOURNEY_META[kind].title} navigation={navigation} /><SkeletonScreen rows={6} /></Page>;

  return <Page><ToolBar title={tf(language,'{t} journey',{t:JOURNEY_META[kind].title})} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Pilgrimage" size={81} />
      <Text style={s.dataTitle}>{journeyMeta(kind, language).title}</Text>
      <Text style={s.journeyArabic}>{JOURNEY_META[kind].arabic}</Text>
      <View style={[s.summaryScore, ]}>
        <View>
          <Text style={s.nextCardLabel}>{T('RITES DONE')}</Text>
          <Text style={s.zakatNo}>{progress.done}<Text style={s.weekScoreBody}> / {progress.total}</Text></Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.nextCardLabel}>{T('PROGRESS')}</Text>
          <Text style={s.zakatNo}>{progress.percent}%</Text>
        </View>
      </View>
      <View style={s.journeyBar}><View style={[s.journeyBarFill, { width: `${progress.percent}%` }]} /></View>

      {steps.map((step, index) => {
        const checked = !!journey.done[step.id];
        const count = journey.counts[step.id] || 0;
        const note = journey.notes[step.id] || '';
        /* Hajj is eleven rites and Umrah six, each with a page of detail, so
           the whole journey is far too long to hold open at once. The rite you
           are on opens itself; tapping another moves the focus. */
        const isOpen = (tappedStep ?? (steps.find((item) => !journey.done[item.id]) || steps[0])?.id) === step.id;
        return <View key={step.id} style={[s.stepCard, checked && s.stepCardDone]}>
          <View style={[s.stepHead, ]}>
            <ToolGraphic tool={step.icon} size={49} />
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={`${step.title}, ${isOpen ? 'open' : 'closed'}`}
              onPress={() => setTappedStep(isOpen ? null : step.id)} style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.stepIndex}>{tf(language,'RITE {n}',{n:index + 1})}</Text>
                  <Text style={s.settingName}>{step.title}</Text>
                  <Text style={s.meta}>{step.short}</Text>
                </View>
                {ico(isOpen ? 'chevron-down' : (rtl ? 'chevron-back' : 'chevron-forward'), 17, C.muted)}
              </View>
            </Pressable>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={`${T('Mark as done')} ${step.title}`}
              onPress={() => toggleStep(kind, step.id)} style={[s.stepCheck, checked && s.stepCheckDone]}>
              {!!checked && ico('checkmark', 16, C.white)}
            </Pressable>
          </View>
          {isOpen && <>
          <Text style={s.dataBody}>{step.detail}</Text>
          {!!step.counter && <View style={s.stepper}>
            <Tactile accessibilityLabel={`${T('One fewer')} ${step.counter.label}`} onPress={() => setStepCount(kind, step.id, count - 1, step.counter!.max)} style={s.stepButton}>{ico('remove', 20, C.green)}</Tactile>
            <View style={s.stepCountBox}>
              <Text style={s.stepCount}>{count}</Text>
              <Text style={s.stepCountLabel}>of {step.counter.max} {step.counter.label}</Text>
            </View>
            <Tactile accessibilityLabel={`${T('One more')} ${step.counter.label}`} onPress={() => setStepCount(kind, step.id, count + 1, step.counter!.max)} style={s.stepButton}>{ico('add', 20, C.green)}</Tactile>
          </View>}
          <View style={s.actionRow}>
            {!!step.verseKeys?.length && <Tactile accessibilityLabel={`${T('Read the verse for')} ${step.title}`} onPress={() => loadVerses(step)} style={s.secondary}>
              <Text style={s.secondaryText}>{T(verseFor === step.id ? 'Hide the verse' : 'Read the verse')}</Text>
            </Tactile>}
            <Tactile accessibilityLabel={`${T('Add a note for')} ${step.title}`} onPress={() => setNoteFor(noteFor === step.id ? null : step.id)} style={s.secondary}>
              <Text style={s.secondaryText}>{T(note ? 'Edit your note' : 'A note')}</Text>
            </Tactile>
          </View>
          {verseFor === step.id && <View style={s.verseBox}>
            {loadingVerse === step.id ? <SkeletonParagraph lines={2} /> : (verses[step.id] || []).map((entry) => <View key={entry.reference}>
              <Text style={s.dataMeta}>{T('QURAN')} {entry.reference}</Text>
              {!!entry.arabic && <Text style={s.verseArabic}>{entry.arabic}</Text>}
              {!!entry.translation && <Text style={s.dataBody}>{entry.translation}</Text>}
            </View>)}
            {!!verseError && <Text style={s.meta}>{verseError}</Text>}
          </View>}
          {noteFor === step.id && <TextInput accessibilityLabel={`${T('Note for')} ${step.title}`} value={note} onChangeText={(text) => setStepNote(kind, step.id, text)}
            placeholder={T('A reminder to yourself — kept only on this device')} placeholderTextColor={C.muted} style={s.searchInput} multiline />}
          {!!note && noteFor !== step.id && <Text style={s.stepNote}>{note}</Text>}
          </>}
        </View>;
      })}

      <Section title={T('This journey')} />
      <View style={s.dataCard}>
        <Text style={s.dataBody}>{T(progress.done === progress.total ? 'Every rite is marked. You can keep the journey in your history, or start a fresh one the next time you go.' : 'Mark each rite as you complete it. Counts and notes are saved as you go.')}</Text>
        <View style={s.actionRow}>
          {progress.done === progress.total && <Tactile accessibilityLabel={T('Complete this journey')} onPress={() => { completeJourney(kind); goBackOrHome(navigation); }} style={s.primary}><Text style={s.primaryText}>{T('Complete journey')}</Text></Tactile>}
          <Tactile accessibilityLabel={T('Start this journey again from the beginning')} onPress={() => { clearJourney(kind); startJourney(kind, JOURNEY_META[kind].title); }} style={s.secondary}><Text style={s.secondaryText}>{T('Start again')}</Text></Tactile>
        </View>
        <Tactile accessibilityLabel={T('Delete this journey')} onPress={() => { clearJourney(kind); goBackOrHome(navigation); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Delete journey')}</Text></Tactile>
      </View>
      <View style={s.apiPanel}>
        <Text style={s.apiTitle}>{tx(language, 'A note on the rites')}</Text>
        <Text style={s.apiText}>{tx(language, 'This is a personal checklist, not a ruling. The schools differ on the details of the rites, on what breaks them and on what is due for them, so confirm your own case with a scholar you trust.')}</Text>
      </View>
    </ScrollView>
  </Page>;
}


/**
 * A player for one of the two broadcasts the app is allowed to carry.
 *
 * Both are HLS playlists published by the Saudi Broadcasting Authority, played
 * through the platform's own player, which for a live stream is the right tool:
 * it reads the playlist, keeps up with the live edge and recovers from a stall
 * on its own. There is no YouTube frame anywhere in this screen any more.
 *
 * Two things about a live feed shape how this behaves. It has no duration, so
 * there is nothing to scrub and no timeline to show — the controls are
 * play/pause, mute and fullscreen, and that is the whole set. And it can be
 * interrupted at any moment by the network or by the broadcaster, so the
 * player's own status is treated as the truth about whether anything is
 * playing, rather than the app assuming its last command took effect.
 *
 * Playback starts muted. A live broadcast from the Haramain is not something
 * that should begin by making a noise, particularly on a phone that may be
 * opened in a quiet room; the unmute button is one tap away.
 */
function LiveStreamPlayer({ channel, rtl, T }: { channel: HolyChannel; rtl: boolean; T: (text: string) => string }) {
  const viewRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<VideoPlayerStatus>('loading');
  const [controlsOn, setControlsOn] = useState(true);
  /* Bumped whenever the frame is tapped, so the fade-out timer restarts. */
  const [nudge, setNudge] = useState(0);
  const controlsFade = useRef(new Animated.Value(1)).current;

  const player = useVideoPlayer(channel.streamUrl || '', (p) => {
    p.loop = false;
    p.muted = true;
    p.staysActiveInBackground = false;
  });

  useEffect(() => {
    const statusSub = player.addListener('statusChange', ({ status: next }) => {
      setStatus(next);
      if (next === 'readyToPlay') player.play();
    });
    const playingSub = player.addListener('playingChange', ({ isPlaying }) => setPlaying(isPlaying));
    return () => { statusSub.remove(); playingSub.remove(); };
  }, [player]);

  /* Controls rest over the picture, so they clear themselves once playback is
     under way and come back on a tap. While paused they stay put. */
  useEffect(() => {
    if (!playing) { setControlsOn(true); return; }
    setControlsOn(true);
    const timer = setTimeout(() => setControlsOn(false), 2600);
    return () => clearTimeout(timer);
  }, [playing, nudge]);

  useEffect(() => {
    Animated.timing(controlsFade, {
      toValue: controlsOn ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [controlsOn]);

  const togglePlay = () => { if (playing) player.pause(); else player.play(); };
  const toggleMute = () => { const next = !muted; setMuted(next); player.muted = next; };

  const buffering = status === 'loading' || (status === 'idle' && !!channel.streamUrl);
  const failed = status === 'error' || !channel.streamUrl;

  return <View style={s.liveFrame}>
    {!failed && <Pressable accessibilityRole="button" accessibilityLabel={T('Show the player controls')}
      onPress={() => setNudge((n) => n + 1)} style={s.liveSurface}>
      <VideoView ref={viewRef} player={player} style={s.liveWeb} contentFit="contain"
        nativeControls={false} fullscreenOptions={{ enable: true }} />
    </Pressable>}

    {buffering && <View style={s.liveFallback} pointerEvents="none">
      <ActivityIndicator color={C.onAccent} />
      <Text style={s.liveFallbackText}>{T('Connecting to the broadcast…')}</Text>
    </View>}

    {failed && <View style={s.liveFallback}>
      <Text style={s.liveFallbackText}>{T('The broadcast will not play right now. Open it in the browser instead.')}</Text>
      <Tactile accessibilityRole="button" accessibilityLabel={`${T('Open')} ${channel.channel} ${T('outside the app')}`}
        onPress={() => openChannel(channel)} style={s.liveFallbackButton}>
        <Text style={s.liveFallbackAction}>{T('Open outside')}</Text>
      </Tactile>
    </View>}

    <Animated.View style={[s.liveScrim, { opacity: controlsFade }]} pointerEvents="box-none">
      <View style={s.liveBar} pointerEvents={controlsOn ? 'auto' : 'none'}>
        <View style={s.liveBadge}><View style={s.livePulse} /><Text style={s.liveBadgeText}>{T('LIVE')}</Text></View>
        <View style={s.liveControls}>
          <Tactile accessibilityRole="button" accessibilityLabel={muted ? T('Unmute the stream') : T('Mute the stream')}
            onPress={toggleMute} style={s.liveButton}>
            {ico(muted ? 'volume-mute' : 'volume-high', 17, C.onAccent)}
          </Tactile>
          <Pressable accessibilityRole="button" accessibilityLabel={playing ? T('Pause the stream') : T('Play the stream')}
            onPress={togglePlay} style={s.livePlay}>
            {buffering ? <ActivityIndicator size="small" color={C.deep} /> : ico(playing ? 'pause' : 'play', 19, C.deep)}
          </Pressable>
          <Tactile accessibilityRole="button" accessibilityLabel={T('Watch full screen')}
            onPress={() => viewRef.current?.enterFullscreen().catch(() => undefined)} style={s.liveButton}>
            {ico('fullscreen', 17, C.onAccent)}
          </Tactile>
        </View>
      </View>
    </Animated.View>
  </View>;
}


function HolyChannelsScreen({ route, navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const [opened, setOpened] = useState('');
  const site = route?.params?.site;
  const channels = site ? HOLY_CHANNELS.filter((channel) => channel.site === site) : HOLY_CHANNELS;
  const heading = site === 'Madinah' ? 'Madinah Live' : 'Makkah Live';
  const open = async (channel: (typeof HOLY_CHANNELS)[number]) => { setOpened(channel.id); await openChannel(channel); };
  return <Page><ToolBar title={site ? T(heading) : (tx(language, 'Holy site channels'))} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Holy site channels" size={85} />
      <Text style={s.dataTitle}>{tx(language, 'Holy site channels')}</Text>
      <Text style={s.intro}>{tx(language, 'The official broadcasts from Makkah and Madinah, around the clock.')}</Text>
      {channels.map((channel) => <View key={channel.id} style={s.channelCard}>
        <View style={[s.channelHead, ]}>
          <ToolGraphic tool="Holy site channels" size={52} />
          <View style={{ flex: 1 }}>
            <Text style={s.dataMeta}>{channel.site.toUpperCase()} · {channel.channel.toUpperCase()}</Text>
            {/* Through T() so the two that are descriptions rather than
                names can be translated; the mosques keep their names. */}
            <Text style={s.settingName}>{T(channel.place)}</Text>
            <Text style={s.channelArabic}>{channel.arabic}</Text>
          </View>
        </View>
        <Text style={s.dataBody}>{T(channel.detail)}</Text>
        <Text style={s.meta}>{T(channel.broadcaster)}</Text>
        {!!channel.streamUrl && Platform.OS !== 'web' && <LiveStreamPlayer channel={channel} rtl={rtl} T={T} />}
        <Tactile accessibilityRole="button" accessibilityLabel={`${T('Watch live')} ${channel.channel}`} onPress={() => open(channel)} style={s.primary}>
          <Text style={s.primaryText}>{opened === channel.id ? T('Opening…')
            : (channel.streamUrl ? T('Open outside the app') : T('Open live stream'))}</Text>
        </Tactile>
      </View>)}
      <View style={s.apiPanel}>
        <Text style={s.apiTitle}>{tx(language, 'About these streams')}</Text>
        <Text style={s.apiText}>{tx(language, 'Quran TV and Sunnah TV play right here, from the broadcaster’s own stream. The other channels open outside this app, because carrying them here would need rights the app does not hold.')}</Text>
      </View>
    </ScrollView>
  </Page>;
}

function FastingScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);/* Arabic, as opposed to merely right-to-left: Urdu runs right to left as well, so keying an Arabic string off `rtl` hands it to Urdu readers. */const ar=language==='ar';
  const fasting=useFasting();
  const [message,setMessage]=useState('');
  const [reason,setReason]=useState<MissedReason>('travel');
  const summary=summariseFasting(fasting);
  const todayKey=new Date().toISOString().slice(0,10);
  const mark=(type:FastType,options?:{reason?:MissedReason})=>{void recordFast(type,options).then(()=>setMessage('Saved on this device.'))};
  const undo=()=>{void clearFastDay().then(()=>setMessage('Today’s record cleared.'))};
  const adjust=(delta:number)=>{void setFastingOwed(summary.owed+delta)};
  return <Page><ToolBar title={T('Fasting record')} navigation={navigation}/><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Fasting" size={90}/>
    <Text style={s.dataTitle}>{T('Fasting record')}</Text>
    <Text style={s.intro}>{T('A private record of the days you fasted, the days you could not, and the make-up days that remain. Nothing leaves this device.')}</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('DAYS FASTED')}</Text><Text style={s.zakatNo}>{summary.completed}</Text><Text style={s.weekScoreBody}>{tf(language,'{r} Ramadan · {v} voluntary',{r:summary.ramadan,v:summary.voluntary})}</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>{T('CURRENT STREAK')}</Text><Text style={s.zakatNo}>{summary.streak} {T(summary.streak===1?'day':'days')}</Text><Text style={s.weekScoreBody}>{tf(language,'{n} in the last 7 days',{n:summary.thisWeek})}</Text></View></View>
    <Section title={T('Today')} action={readableDate(todayKey)} />
    <View style={s.dataCard}>
      <Text style={s.dataMeta}>{summary.today?`${T('RECORDED')} · ${labelForEntry(summary.today, language)}`:T('NOT RECORDED YET')}</Text>
      <View style={s.actionRow}>
        <Tactile accessibilityLabel={T('Record today as a Ramadan fast')} onPress={()=>mark('ramadan')} style={s.secondary}><Text style={s.secondaryText}>{T('Ramadan fast')}</Text></Tactile>
        <Tactile accessibilityLabel={T('Record today as a voluntary fast')} onPress={()=>mark('voluntary')} style={s.secondary}><Text style={s.secondaryText}>{T('Voluntary')}</Text></Tactile>
        <Tactile accessibilityLabel={T('Record today as a make-up fast')} onPress={()=>mark('qada')} style={s.secondary}><Text style={s.secondaryText}>{T('Make-up day')}</Text></Tactile>
      </View>
      {!!summary.today && <Tactile accessibilityLabel={T('Clear today’s fasting record')} onPress={undo} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear today')}</Text></Tactile>}
    </View>
    <Section title={T('If today was not fasted')} />
    <View style={s.dataCard}>
      <Text style={s.dataBody}>{T('Recording a missed day adds one day to the make-up ledger below.')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8,marginTop: 12}}>{missedReasons(language).map(item=><ChoicePill key={item.id} label={item.label} selected={reason===item.id} onPress={()=>setReason(item.id)}/>)}</ScrollView>
      <Text style={s.meta}>{missedReasons(language).find(item=>item.id===reason)?.detail}</Text>
      <Tactile accessibilityLabel={T('Record today as not fasted')} onPress={()=>mark('missed',{reason})} style={s.primary}><Text style={s.primaryText}>{T('Record as not fasted')}</Text></Tactile>
    </View>
    <Section title={T('Make-up ledger')} action={tf(language,'{n} settled',{n:summary.qada})} />
    <View style={s.dataCard}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{T('Days owed')}</Text><Text style={s.hadithProgressName}>{summary.owed}</Text></View>
      <Text style={s.meta}>{tf(language,'{q} make-up days recorded · {m} missed days recorded',{q:summary.qada,m:summary.missed})}</Text>
      <View style={s.actionRow}>
        <Tactile accessibilityLabel={T('One fewer day owed')} onPress={()=>adjust(-1)} style={s.secondary}><Text style={s.secondaryText}>{T('− 1 day')}</Text></Tactile>
        <Tactile accessibilityLabel={T('One more day owed')} onPress={()=>adjust(1)} style={s.secondary}><Text style={s.secondaryText}>{T('+ 1 day')}</Text></Tactile>
      </View>
    </View>
    <Section title={T('The last six months')} />
    <View style={s.dataCard}>
      <View style={s.fastMonths}>
        {summary.months.map((month) => {
          const total = month.fasted + month.missed;
          const share = total ? Math.round((month.fasted / total) * 100) : 0;
          return <View key={month.key} style={s.fastMonth}>
            <View style={s.fastMonthTrack}>
              <View style={[s.fastMonthFill, { height: `${Math.max(share, 4)}%` }]} />
            </View>
            <Text style={s.fastMonthLabel}>{month.label}</Text>
            <Text style={s.fastMonthCount}>{month.fasted}</Text>
          </View>;
        })}
      </View>
      <Text style={s.meta}>{tx(language, 'Days fasted in each month, oldest first.')}</Text>
    </View>
    <Section title={T('Recent record')} action={ar?`${fasting.entries.length} ${arNoun(fasting.entries.length,'يوم مسجَّل','يومان مسجَّلان','أيام مسجَّلة','يومًا مسجَّلًا')}`:tf(language,'{n} entries',{n:fasting.entries.length})} />
    {!fasting.entries.length && <View style={s.empty}><Text style={s.dataBody}>{T('Nothing recorded yet. Mark today above and your record starts here.')}</Text></View>}
    {!!fasting.entries.length && <View style={s.settings}>{summary.recent.map(entry=><View key={entry.date} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{readableDate(entry.date)}</Text><Text style={s.meta}>{labelForEntry(entry, language)}</Text></View><Pressable accessibilityLabel={`${T('Remove the fasting record for')} ${readableDate(entry.date)}`} onPress={()=>{void clearFastDay(entry.date)}}>{ico('trash-outline',17,C.coral)}</Pressable></View>)}</View>}
    {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}
    <View style={s.apiPanel}><Text style={s.apiTitle}>{T('A note on rulings')}</Text><Text style={s.apiText}>{T('This is a private record, not a ruling. What obliges a make-up fast, and what excuses a day, depends on your situation: travel, illness, pregnancy, the monthly cycle and post-natal bleeding each have their own rules. Please confirm your own case with a scholar or a trusted, sourced guide. Everything here stays on this device, and nothing is uploaded.')}</Text></View>
  </ScrollView></Page>;
}
function WeeklySummaryScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);/* Arabic, as opposed to merely right-to-left: these counts are written
     in Arabic, and Urdu is right to left too, so keying them off `rtl`
     handed the Arabic to Urdu readers. */
  const ar=language==='ar';const[history,setHistory]=useState<Record<string,string[]>>({});const[hifz,setHifz]=useState<Record<number,HifzStatus>>({});const[names,setNames]=useState<Record<number,string>>({});const log=useActivity();const tasbih=useTasbih();
 useEffect(()=>{loadPrayerHistory().then(setHistory);loadHifz().then(setHifz);getChapters().then(list=>{const map:Record<number,string>={};list.forEach(c=>{map[c.id]=c.name_simple});setNames(map)}).catch(()=>undefined)},[]);
 const week=buildWeeklySummary({activity:log,prayerHistory:history,tasbihDays:tasbih.days});
 const maxVerses=Math.max(1,...week.rows.map(r=>r.verses));const maxDhikr=Math.max(1,...week.rows.map(r=>r.dhikr));const maxHifz=Math.max(1,...week.rows.map(r=>r.hifz));
 const memorized=Object.values(hifz).filter(x=>x==='memorized').length;const revising=Object.values(hifz).filter(x=>x==='revising').length;
 const opened=Array.from(new Set(week.rows.flatMap(r=>log[r.key]?.surahs||[])));const total=week.totals;const active=total.prayers+total.verses+total.dhikr+total.hifz;
 return <Page><ToolBar title={T('Weekly summary')} navigation={navigation}/><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Weekly Summary" size={87}/>
    <Text style={s.dataTitle}>{T('Your week in review')}</Text>
    <Text style={s.intro}>{T('Seven days of salah, reading, dhikr and memorisation, counted only from what you did in the app. Everything stays on this device.')}</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('LAST 7 DAYS')}</Text><Text style={s.zakatNo}>{total.prayers} / 35</Text><Text style={s.weekScoreBody}>{T('prayers marked')}</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>{T('STREAKS')}</Text><Text style={s.zakatNo}>{week.prayerStreak} {T(week.prayerStreak===1?'day':'days')}</Text><Text style={s.weekScoreBody}>{ar?`${week.activeStreak} ${arNoun(week.activeStreak,'يوم نشط','يومان نشطان','أيام نشطة','يومًا نشطًا')}`:tf(language,week.activeStreak===1?'{n} active day':'{n} active days',{n:week.activeStreak})}</Text></View></View>
    <View style={s.twoCol}>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>{T('VERSES MARKED')}</Text><Text style={s.weekStatValue}>{total.verses}</Text><Text style={s.meta}>{ar?`${total.surahs} ${arNoun(total.surahs,'سورة','سورتان','سور','سورة')} · ${total.pages} ${arNoun(total.pages,'صفحة','صفحتان','صفحات','صفحة')}`:tf(language,'{s} Surahs · {p} pages',{s:total.surahs,p:total.pages})}</Text></View>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>{T('DHIKR COUNTED')}</Text><Text style={s.weekStatValue}>{total.dhikr}</Text><Text style={s.meta}>{ar?`${total.adhkar} ${arNoun(total.adhkar,'ذكر مقروء','ذكران مقروءان','أذكار مقروءة','ذكرًا مقروءًا')} · ${total.hifz} مراجعة حفظ`:tf(language,'{d} remembrances · {h} hifz reviews',{d:total.adhkar,h:total.hifz})}</Text></View>
    </View>
    {!active && <View style={[s.empty,{marginTop:12}]}><Text style={s.dataBody}>{T('Nothing recorded in the last seven days yet. Mark a prayer, read a Surah, count dhikr or practise a verse and this page fills in.')}</Text></View>}
    <Section title={T('Daily salah')} action={week.bestDay && week.bestDay.prayers ? `${T('Best')}: ${week.bestDay.label}` : ''} />
    <View style={s.settings}>{week.rows.map(day=><View key={day.key} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.summaryDots}>{Array.from({length:5}).map((_,i)=><View key={i} style={[s.summaryDot,i<day.prayers&&s.summaryDotDone]}/>)}</View><Text style={s.progressCount}>{day.prayers}/5</Text></View>)}</View>
    <Section title={T('Quran reading')} action={ar?`${total.verses} ${arNoun(total.verses,'آية','آيتان','آيات','آية')}`:tf(language,'{n} verses',{n:total.verses})} />
    <View style={s.settings}>{week.rows.map(day=><View key={`read-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{ar?`${day.surahs} ${arNoun(day.surahs,'سورة','سورتان','سور','سورة')} · ${day.pages} ${arNoun(day.pages,'صفحة','صفحتان','صفحات','صفحة')}`:tf(language,'{s} Surahs · {p} pages',{s:day.surahs,p:day.pages})}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.verses/maxVerses*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.verses}</Text></View>)}</View>
    {!!opened.length && <View style={s.dataCard}><Text style={s.dataMeta}>{T('SURAHS OPENED THIS WEEK')}</Text><Text style={s.dataBody}>{opened.slice(0,8).map(id=>names[id]||(ar?`سورة ${id}`:tf(language,'Surah {n}',{n:id}))).join(' · ')}</Text></View>}
    <Section title={T('Hifz')} action={ar?`${memorized} محفوظة · ${revising} قيد المراجعة`:tf(language,'{m} memorized · {r} revising',{m:memorized,r:revising})} />
    <View style={s.settings}>{week.rows.map(day=><View key={`hifz-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.hifz/maxHifz*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.hifz}</Text></View>)}</View>
    <Section title={T('Dhikr')} action={ar?`${total.dhikr} معدودة`:tf(language,'{n} counted',{n:total.dhikr})} />
    <View style={s.settings}>{week.rows.map(day=><View key={`dhikr-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.dhikr/maxDhikr*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.dhikr}</Text></View>)}</View>
    <View style={s.apiPanel}><Text style={s.apiTitle}>{T('How these numbers are counted')}</Text><Text style={s.apiText}>{T('Salah counts the prayers you mark on the Prayer screen. Reading counts the verses you mark in the reader and the Mushaf pages you open. Dhikr comes from the Tasbih counter, and hifz from every verse you rate in recall practice. Thirty days are kept, on this device only, and nothing is uploaded.')}</Text></View>
  </ScrollView></Page>}

function LocationSetupScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const loc=useAppLocation();
  const[query,setQuery]=useState('');
  const[results,setResults]=useState<CityResult[]>([]);
  const[searching,setSearching]=useState(false);
  const[lookedOnline,setLookedOnline]=useState(false);
  const[manual,setManual]=useState(false);
  const[label,setLabel]=useState('');
  const[lat,setLat]=useState('');
  const[lng,setLng]=useState('');
  const[error,setError]=useState('');

  /* Typing is answered from the list on the device, which is instant, and only
     falls through to the network when that list has nothing. `lookedOnline` is
     what lets the screen say so honestly instead of implying a place does not
     exist when in fact the phone simply has no signal. */
  useEffect(()=>{
    const text=query.trim();
    if(text.length<2){setResults([]);setSearching(false);setLookedOnline(false);return}
    let live=true; setSearching(true);
    const local=searchLocalCities(text,14);
    setResults(local);
    if(local.length){setSearching(false);setLookedOnline(false);return}
    const timer=setTimeout(()=>{
      void searchCities(text,14).then(list=>{if(!live)return;setResults(list);setLookedOnline(list.some(c=>c.source==='online'));setSearching(false)});
    },450);
    return()=>{live=false;clearTimeout(timer)}
  },[query]);

  const choose=(city:CityResult)=>{
    haptic('success');
    loc.setManual({label:`${city.name}, ${city.countryName}`,latitude:city.latitude,longitude:city.longitude,timezone:city.timezone});
    void rememberCity(city);
    goBackOrHome(navigation);
  };

  const saveManual=()=>{
    const latitude=Number(lat),longitude=Number(lng);
    if(!label.trim()||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){
      setError(T('Enter a name and valid latitude and longitude.'));return}
    haptic('success');
    loc.setManual({label:label.trim(),latitude,longitude});
    goBackOrHome(navigation);
  };

  return <Page><ToolBar title={T('Location')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
      <Text style={s.dataTitle}>{T('Where are your prayer times?')}</Text>
      <Text style={s.intro}>{T('Prayer times, Qibla, Ramadan and nearby mosques all read from this one place. It is asked once and kept on this device.')}</Text>

      {!!loc.location&&<View style={s.cityCurrent}>
        <View style={{flex:1}}>
          <Text style={s.cityCurrentLabel}>{T('Currently using')}</Text>
          <Text style={s.cityCurrentName}>{loc.location.label}</Text>
          <Text style={s.meta}>{loc.location.latitude.toFixed(3)}, {loc.location.longitude.toFixed(3)}</Text>
        </View>
        <Tactile accessibilityLabel={T('Clear saved location')} onPress={loc.clear} style={s.ghostSmall}><Text style={s.ghostText}>{T('Clear')}</Text></Tactile>
      </View>}

      <Section title={T('Search for a city')}/>
      <View style={s.search}>{ico('search',19,C.muted)}
        <TextInput accessibilityLabel={T('Search for a city or place')} value={query} onChangeText={setQuery}
          style={s.searchInput} placeholder={T('Try Dubai, Makkah, London…')} placeholderTextColor={C.muted}
          returnKeyType="search" autoCorrect={false}/>
        {query.length>0&&<Pressable accessibilityLabel={T('Clear city search')} onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}
      </View>

      {searching&&<SkeletonList rows={4} />}

      {!searching&&query.trim().length>=2&&results.length===0&&<View style={s.empty}>
        <Text style={s.errorTitle}>{lookedOnline?T('Nothing found for that name'):T('No match in the offline list')}</Text>
        <Text style={s.errorText}>{lookedOnline
          ? T('Check the spelling, or add the place by its coordinates below.')
          : T('The list on this device did not have it and the connection could not be reached. You can add the place by its coordinates.')}</Text>
        <Tactile accessibilityLabel={T('Add coordinates manually')} onPress={()=>setManual(true)} style={s.primarySmall}>
          <Text style={s.primaryText}>{T('Add by coordinates')}</Text>
        </Tactile>
      </View>}

      {results.length>0&&<View style={s.cityResults}>
        {results.map(city=><Tactile key={`${city.ascii}-${city.country}-${city.latitude}`}
          accessibilityLabel={`${city.name}, ${city.countryName}`}
          onPress={()=>choose(city)} style={s.cityResultRow}>
          <View style={{flex:1}}>
            <Text style={s.cityResultName}>{city.name}</Text>
            <Text style={s.meta}>{city.countryName} · {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}</Text>
          </View>
          {city.source!=='device'&&<View style={s.citySourceTag}><Text style={s.citySourceText}>{city.source==='online'?T('online'):T('saved')}</Text></View>}
          {ico(rtl ? 'arrow-back' : 'arrow-forward',17,C.muted)}
        </Tactile>)}
        <Text style={s.cityFootnote}>{T('Not in the list? Add it by coordinates below.')}</Text>
      </View>}

      {lookedOnline&&results.length>0&&<Text style={s.cityFootnote}>{T('Found online — saved on this device for next time.')}</Text>}

      <Section title={T('Or enter coordinates')}/>
      {!manual
        ? <Tactile accessibilityRole="button" accessibilityLabel={T('Add coordinates manually')} onPress={()=>setManual(true)} style={s.secondary}>
            <Text style={s.secondaryText}>{T('Add a place by latitude and longitude')}</Text>
          </Tactile>
        : <View style={s.formCard}>
            <Text style={s.inputLabel}>{T('NAME')}</Text>
            <TextInput accessibilityLabel={T('Location name')} value={label} onChangeText={setLabel}
              placeholder={T('e.g. Home, Abu Dhabi')} style={s.textField}/>
            <View style={s.fieldRow}>
              <View style={{flex:1}}>
                <Text style={s.inputLabel}>{T('LATITUDE')}</Text>
                <TextInput accessibilityLabel={T('Latitude')} value={lat} onChangeText={setLat}
                  keyboardType="numbers-and-punctuation" placeholder="24.4539" style={s.textField}/>
              </View>
              <View style={{flex:1}}>
                <Text style={s.inputLabel}>{T('LONGITUDE')}</Text>
                <TextInput accessibilityLabel={T('Longitude')} value={lng} onChangeText={setLng}
                  keyboardType="numbers-and-punctuation" placeholder="54.3773" style={s.textField}/>
              </View>
            </View>
            {!!error&&<Text style={s.errorText}>{error}</Text>}
            <Tactile accessibilityRole="button" accessibilityLabel={T('Save location')} onPress={saveManual} style={s.primary}>
              <Text style={s.primaryText}>{T('Save this place')}</Text>
            </Tactile>
          </View>}

      <View style={s.sourceCard}>{ico('location-outline',20,C.green)}<View style={{flex:1}}>
        <Text style={s.sourceTitle}>{T('Stored only here')}</Text>
        <Text style={s.sourceBody}>{T('Your location never leaves this device. It is used to compute prayer times, Qibla and the fasting timetable, and you can clear it at any time.')}</Text>
      </View></View>
    </ScrollView></Page>}
/* "3 min ago" is interface copy, not scripture, so it is written here the same
   way the calendar's day counts are - Arabic gets its proper dual and plural
   forms rather than a number bolted onto the singular. */
function timeAgoText(ms: number, language: string | boolean): string {
  const mins = Math.round(ms / 60000);
  const ar = language === true || language === 'ar';
  const ur = language === 'ur';
  /* Written out per language rather than switched on a boolean: the Arabic
     noun changes form with the number in front of it, Urdu puts the unit
     first, and a two-way choice had nowhere to put the third. */
  if (mins < 1) return tx(language, 'just now');
  if (mins < 60) {
    if (ur) return `${mins} منٹ پہلے`;
    if (ar) return `قبل ${arNoun(mins, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة')}`;
    return `${mins} min ago`;
  }
  const hours = Math.round(mins / 60);
  if (hours < 24) {
    if (ur) return `${hours} گھنٹے پہلے`;
    if (ar) return `قبل ${arNoun(hours, 'ساعة', 'ساعتين', 'ساعات', 'ساعة')}`;
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  if (ur) return `${days} دن پہلے`;
  if (ar) return `قبل ${arNoun(days, 'يوم', 'يومين', 'أيام', 'يومًا')}`;
  return `${days}d ago`;
}

const HEAT_STOPS = [
  'rgba(223,177,99,0.20)',
  'rgba(223,177,99,0.38)',
  'rgba(223,177,99,0.56)',
  'rgba(223,177,99,0.74)',
  '#DFB163',
];

function heatColour(done: number) {
  if (done <= 0) return C.line;
  return HEAT_STOPS[Math.min(done, 5) - 1];
}

function SalahTrackerScreen({ navigation }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const ar = language === 'ar';
  const [history, setHistory] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(true);
  /* The day whose detail is showing under the map. Tapping a square opens it,
     tapping the same square again closes it. */
  const [openDay, setOpenDay] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setHistory((await loadPrayerHistory()) || {});
    setBusy(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const keys = useMemo(() => Object.keys(history).sort(), [history]);
  const counted = useCallback(
    (key: string) => (history[key] || []).filter((p) => PRAYER_FIVE.includes(p)).length,
    [history],
  );

  const stats = useMemo(() => {
    let total = 0, best = 0, run = 0, tracked = 0;
    for (const key of keys) {
      const n = counted(key);
      total += n;
      if (n > 0) tracked += 1;
      if (n >= 5) { run += 1; best = Math.max(best, run); } else run = 0;
    }
    return {
      tracked, total, best,
      streak: prayerStreak(history),
      rate: tracked ? Math.round((total / (tracked * 5)) * 100) : 0,
    };
  }, [keys, counted, history]);

  /* One column per week, Sunday first, across every day on record. The map
     starts at the first day ever marked rather than a fixed window, so a
     record going back a year shows a year — which is the whole point of
     keeping the record at all. */
  const weeks = useMemo(() => {
    if (!keys.length) return [] as string[][];
    const start = new Date(`${keys[0]}T00:00:00`);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date();
    const out: string[][] = [];
    const cur = new Date(start);
    let guard = 0;
    while (cur <= end && guard++ < 800) {
      const week: string[] = [];
      for (let d = 0; d < 7; d += 1) {
        week.push(prayerDayKey(cur));
        cur.setDate(cur.getDate() + 1);
      }
      out.push(week);
    }
    return out;
  }, [keys]);

  const monthLabels = useMemo(() => {
    const out: { index: number; label: string }[] = [];
    let lastMonth = '';
    weeks.forEach((week, i) => {
      const first = week[0];
      if (!first) return;
      const month = new Date(`${first}T00:00:00`).toLocaleDateString(rtl ? 'ar-u-nu-latn' : 'en', { month: 'short' });
      if (month !== lastMonth) { out.push({ index: i, label: month }); lastMonth = month; }
    });
    return out;
  }, [weeks, rtl]);

  const dayNames = useMemo(() => {
    const base = new Date(2024, 0, 7); // a Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base); d.setDate(base.getDate() + i);
      return d.toLocaleDateString(rtl ? 'ar-u-nu-latn' : 'en', { weekday: 'narrow' });
    });
  }, [rtl]);

  /* Correcting a day you forgot to mark. This writes straight to the same
     record the Prayer screen uses, so a correction here is a correction there
     and the two never disagree about what happened. */
  const toggleDay = (day: string, prayer: string) => {
    const current = history[day] || [];
    const next = current.includes(prayer) ? current.filter((p) => p !== prayer) : [...current, prayer];
    setHistory((prev) => ({ ...prev, [day]: next }));
    void savePrayerCompletion(day, next).then(() => setOpenDay(null));
  };

  return <Page><ToolBar title={T('Salah Tracker')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <Text style={s.intro}>{T('Every day you have marked, going back as far as your record does. A square is a day; the deeper the gold, the more of the five you prayed.')}</Text>

      {busy && !keys.length ? <SkeletonSquares rows={6} columns={10} /> : !stats.tracked ? (
        <View style={s.inboxEmpty}>
          <ToolGraphic tool="Salah Tracker" size={70} />
          <Text style={s.emptyTitle}>{T('No days marked yet')}</Text>
          <Text style={s.emptyBody}>{T('Mark a prayer from the Prayer screen and it will appear here.')}</Text>
        </View>
      ) : (
        <>
          <View style={s.trackStats}>
            <View style={s.trackStat}><Text style={s.trackStatValue}>{stats.streak}</Text><Text style={s.trackStatLabel}>{T('Day streak')}</Text></View>
            <View style={s.trackStat}><Text style={s.trackStatValue}>{stats.best}</Text><Text style={s.trackStatLabel}>{T('Longest run')}</Text></View>
            <View style={s.trackStat}><Text style={s.trackStatValue}>{stats.total}</Text><Text style={s.trackStatLabel}>{T('Prayers marked')}</Text></View>
            <View style={s.trackStat}><Text style={s.trackStatValue}>{stats.rate}%</Text><Text style={s.trackStatLabel}>{T('Of the five')}</Text></View>
          </View>

          <Text style={s.dataMeta}>{ar ? `${stats.tracked} ${arNoun(stats.tracked, 'يوم', 'يومين', 'أيام', 'يومًا')} مسجّلة` : tf(language,'{n} days on record',{n:stats.tracked})}</Text>

          <View style={{ marginTop: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={{ flexDirection: 'row', gap: 3, marginLeft: 20, marginBottom: 4 }}>
                  {monthLabels.map((m) => (
                    <Text key={`${m.index}-${m.label}`} style={[s.trackLegendText, { width: 16 * (weeks.length ? 1 : 1) }]}>{m.label}</Text>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  <View style={{ width: 20 }}>
                    {dayNames.map((d, i) => (
                      <View key={i} style={{ height: 13, marginBottom: 3, justifyContent: 'center' }}>
                        {i % 2 === 1 && <Text style={[s.trackLegendText, { fontSize: 9 }]}>{d}</Text>}
                      </View>
                    ))}
                  </View>
                  <View style={s.trackGrid}>
                    {weeks.map((week, wi) => (
                      <View style={s.trackWeek} key={wi}>
                        {week.map((day) => {
                          const n = counted(day);
                          const future = new Date(`${day}T00:00:00`) > new Date();
                          if (future) return <View key={day} style={[s.trackCell, { backgroundColor: 'transparent' }]} />;
                          const open = openDay === day;
                          return (
                            <Pressable
                              key={day}
                              onPress={() => setOpenDay(open ? null : day)}
                              accessibilityRole="button"
                              accessibilityLabel={T('Day') + ' ' + day}
                              style={[s.trackCell, { backgroundColor: heatColour(n) }, open && s.trackCellOpen]}
                            />
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={s.trackLegend}>
            <Text style={s.trackLegendText}>{T('Less')}</Text>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={[s.trackCell, { backgroundColor: heatColour(n) }]} />
            ))}
            <Text style={s.trackLegendText}>{T('More')}</Text>
          </View>

          {openDay ? (
            <View style={s.dataCard}>
              <Text style={s.preferenceLabel}>{openDay}</Text>
              <View style={s.memChipWrap}>
                {PRAYER_FIVE.map((prayer) => {
                  const done = (history[openDay] || []).includes(prayer);
                  return (
                    <Tactile
                      key={prayer}
                      onPress={() => toggleDay(openDay, prayer)}
                      accessibilityLabel={`${prayer}${done ? ' ' + T('done') : ''}`}
                      style={[s.memChip, done && s.choicePillActive]}
                    >
                      <Text style={[s.choiceText, done && s.choiceTextActive]}>{T(prayer)}</Text>
                    </Tactile>
                  );
                })}
              </View>
              <Text style={s.meta}>{tx(language, 'Tap to correct this day.')}</Text>
            </View>
          ) : (
            <Text style={s.meta}>{tx(language, 'Tap any square to see that day.')}</Text>
          )}
        </>
      )}
    </ScrollView></Page>;
}

function SunnahScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const sunnah = useSunnah();
  const summary = sunnahSummary(sunnah.days);
  const history = useMemo(() => sunnahHistory(sunnah.days, 60), [sunnah.days]);
  const todayKey = sunnahDayKey();
  const todays = sunnahForDay(sunnah.days, todayKey);

  const clear = () => Alert.alert(
    T('Clear this record?'),
    T('Removes every sunnah prayer you have marked. Your five daily prayers are kept in their own record and are not touched.'),
    [
      { text: T('Cancel'), style: 'cancel' },
      { text: T('Clear'), style: 'destructive', onPress: () => void resetSunnah() },
    ],
  );

  return (
    <Page>
      <ToolBar title={T('Sunnah Prayers')} navigation={navigation} />
      <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <ToolGraphic tool="Sunnah Prayers" size={87} />
        <Text style={s.dataTitle}>{T('Sunnah prayers')}</Text>
        <Text style={s.intro}>{T('Witr, Duha and Tahajjud are voluntary, so they are kept apart from the five. Counting them together would flatter the obligation and turn these into a task.')}</Text>

        <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
          <View>
            <Text style={s.nextCardLabel}>{T('PRAYED')}</Text>
            <Text style={s.zakatNo}>{summary.total}</Text>
            <Text style={s.weekScoreBody}>{summary.daysKept} {tx(language, 'days')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.nextCardLabel}>{T('ALL THREE')}</Text>
            <Text style={s.zakatNo}>{summary.fullDays}</Text>
            <Text style={s.weekScoreBody}>{tx(language, 'full days')}</Text>
          </View>
        </LinearGradient>

        <Section title={T('Today')} />
        <View style={s.sunnahList}>
          {SUNNAH_PRAYERS.map((prayer) => {
            const done = todays.includes(prayer);
            const stat = summary.per[prayer];
            return (
              <Tactile
                key={prayer}
                onPress={() => void toggleSunnah(prayer, todayKey)}
                accessibilityLabel={`${prayer}${done ? ' ' + T('done') : ''}`}
                style={[s.sunnahRow, done && s.sunnahRowOn]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[s.trackCell, { backgroundColor: done ? C.green : C.line }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.sunnahRowName}>{T(prayer)}</Text>
                    <Text style={s.meta}>{T(SUNNAH_ORDER[prayer])}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.trackStatValue}>{stat.streak}</Text>
                    <Text style={s.trackStatLabel}>{tx(language, 'days')}</Text>
                  </View>
                </View>
              </Tactile>
            );
          })}
        </View>

        <Text style={s.meta}>{tx(language, 'Tap to toggle. Each run is counted on its own.')}</Text>

        <Section title={T('So far')} />
        <View style={s.trackStats}>
          {SUNNAH_PRAYERS.map((prayer) => (
            <View style={s.trackStat} key={prayer}>
              <Text style={s.trackStatValue}>{summary.per[prayer].count}</Text>
              <Text style={s.trackStatLabel}>{T(prayer)}</Text>
            </View>
          ))}
        </View>

        <Section title={T('Recent days')} />
        {!history.length ? (
          <View style={s.inboxEmpty}>
            <Text style={s.emptyTitle}>{T('Nothing marked yet')}</Text>
            <Text style={s.emptyBody}>{T('Mark one above and this day will appear here.')}</Text>
          </View>
        ) : (
          history.map(({ key, prayers }) => (
            <View style={s.dataCard} key={key}>
              <Text style={s.preferenceLabel}>{key}</Text>
              <View style={s.memChipWrap}>
                {SUNNAH_PRAYERS.map((p) => (
                  <View key={p} style={[s.memChip, prayers.includes(p) && s.choicePillActive]}>
                    <Text style={[s.choiceText, prayers.includes(p) && s.choiceTextActive]}>{T(p)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={s.actionRow}>
          <Tactile onPress={clear} style={s.primary}>
            <Text style={s.primaryText}>{T('Clear this record')}</Text>
          </Tactile>
        </View>
      </ScrollView>
    </Page>
  );
}

function NotificationInboxScreen({navigation}:any){
  const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const[log,setLog]=useState<NotificationRecord[]>([]);
  const[busy,setBusy]=useState(true);
  const load=useCallback(async()=>{setBusy(true);setLog(newestFirst(await loadNotificationLog()));setBusy(false)},[]);
  useEffect(()=>{void load()},[load]);

  const clear=()=>Alert.alert(T('Clear this history?'),
    T('Removes every notification from this list. Your reminders stay switched on and keep being sent.'),
    [{text:T('Cancel'),style:'cancel'},{text:T('Clear'),style:'destructive',onPress:()=>{void clearNotificationLog().then(load)}}]);

  const KIND_COLOUR:Record<string,string>={adhan:C.green,'pre-adhan':C.green,continue:C.green,verse:C.green,hadith:C.green,sleep:C.green,quran:C.green};

  return <Page><ToolBar title={T('Notifications')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <Text style={s.intro}>{T('Every reminder this app has sent you. A past entry means it was sent — the system delivers notifications whether or not the app is open, so it cannot say whether you saw it.')}</Text>
      {!log.length
        ? <View style={s.inboxEmpty}><ToolGraphic tool="Reminders" size={70}/><Text style={s.emptyTitle}>{busy?T('Loading…'):T('Nothing yet')}</Text><Text style={s.emptyBody}>{T('Switch a reminder on and it will be listed here once it has been sent.')}</Text></View>
        : <>
            <View style={s.inboxHead}><Text style={s.meta}>{log.length} {T('sent')}</Text><Pressable accessibilityRole="button" onPress={clear}><Text style={s.sectionAction}>{T('Clear')}</Text></Pressable></View>
            <View style={s.settings}>{log.map((entry)=>{
              const past=entry.fireAt<=Date.now();
              return <View key={entry.id} style={s.inboxRow}>
                <View style={[s.inboxDot,{backgroundColor:past?(entry.deliveredAt?C.green:C.muted):(KIND_COLOUR[entry.kind]||C.green)}]}/>
                <View style={{flex:1}}>
                  <Text style={s.inboxKind}>{T(past?'SENT':'SCHEDULED')}</Text>
                  <Text style={s.settingName}>{entry.title}</Text>
                  {!!entry.body&&<Text style={s.meta}>{entry.body}</Text>}
                  <Text style={s.inboxTime}>{past?timeAgoText(Date.now()-entry.fireAt,language):new Date(entry.fireAt).toLocaleString(rtl?'ar-u-nu-latn':'en',{weekday:'short',hour:'numeric',minute:'2-digit'})}
                    {entry.openedAt?' · '+T('opened'):''}</Text>
                </View>
              </View>})}
            </View>
          </>}
    </ScrollView></Page>;
}

/**
 * A twelve-hour clock on three wheels, for the morning reminders.
 *
 * React Native ships no time picker and adding one would pull in a native
 * module this app otherwise avoids, so the wheels are built here. They are
 * also the better control: the four preset times they replaced left somebody
 * whose Fajr is at 5:12 choosing between 06:00 and nothing at all.
 *
 * Everything about a clock reads the same whichever way the app is laid out —
 * the numbers run upwards, the order of the wheels does not change — so the
 * picker holds itself left-to-right inside a right-to-left screen.
 */
const CLOCK_ROW = 44;

function TimeWheel({ items, index, onPick, width }: { items: string[]; index: number; onPick: (i: number) => void; width: number }) {
  const ref = useRef<any>(null);

  /* Set once, when the sheet opens: the wheel has to start on the chosen
     value rather than at the top of the list. Retried on the next frame
     because the content is not yet measured in the first commit. */
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      ref.current?.scrollTo({ y: index * CLOCK_ROW, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View style={{ width, height: CLOCK_ROW * 5 }}>
      <View style={s.clockBand} pointerEvents="none" />
      <ScrollView
        ref={ref}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={CLOCK_ROW}
        decelerationRate="fast"
        onMomentumScrollEnd={(e: any) => {
          const next = Math.round(e.nativeEvent.contentOffset.y / CLOCK_ROW);
          onPick(Math.max(0, Math.min(items.length - 1, next)));
        }}
        contentContainerStyle={{ paddingVertical: CLOCK_ROW * 2 }}
      >
        {items.map((item) => (
          <View key={item} style={s.clockItem}>
            <Text style={s.clockItemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** "14:30" -> 2, 30, 'PM'. Anything unparseable falls back to 08:00. */
function splitTime(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) return { hour: 8, minute: 0, half: 'AM' as const };
  const hour24 = Math.max(0, Math.min(23, Number(match[1])));
  return {
    hour: hour24 % 12 || 12,
    minute: Math.max(0, Math.min(59, Number(match[2]))),
    half: hour24 < 12 ? ('AM' as const) : ('PM' as const),
  };
}

function joinTime(hour: number, minute: number, half: 'AM' | 'PM') {
  const hour24 = (hour % 12) + (half === 'PM' ? 12 : 0);
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** The clock as it appears on screen: a button showing the chosen hour. */
function TimeField({ label, value, onChange, T }: { label: string; value: string; onChange: (next: string) => void; T: (t: string) => string }) {
  const [open, setOpen] = useState(false);
  const start = splitTime(value);
  const [hour, setHour] = useState(start.hour);
  const [minute, setMinute] = useState(start.minute);
  const [half, setHalf] = useState<'AM' | 'PM'>(start.half);

  /* Re-seeded each time it is opened, so abandoning a change and coming back
     shows the saved time rather than the half-finished one left behind. */
  const openSheet = () => {
    const next = splitTime(value);
    setHour(next.hour); setMinute(next.minute); setHalf(next.half);
    setOpen(true);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const halves = ['AM', 'PM'];

  /* Shown twelve-hour, because that is how the wheels are set; the setting
     itself stays twenty-four-hour, which is what the scheduler reads. */
  const shown = `${hour}:${String(minute).padStart(2, '0')} ${half}`;

  return (
    <View style={s.timeField}>
      <Text style={s.timeFieldLabel}>{label}</Text>
      <Pressable accessibilityLabel={`${label}, ${shown}. ${T('Change the time')}`} onPress={openSheet} style={s.timeFieldButton}>
        <Text style={s.timeFieldValue}>{shown}</Text>
        {ico('time-outline', 17, C.green)}
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={s.clockScrim}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel={T('Close')} />
          <View style={s.clockSheet}>
            <Text style={s.clockTitle}>{label}</Text>
            <Text style={s.clockPreview}>{shown}</Text>
            <View style={s.clockWheels}>
              <TimeWheel items={hours} index={hour - 1} onPick={(i) => setHour(i + 1)} width={72} />
              <TimeWheel items={minutes} index={minute} onPick={setMinute} width={72} />
              <TimeWheel items={halves} index={half === 'AM' ? 0 : 1} onPick={(i) => setHalf(i === 0 ? 'AM' : 'PM')} width={78} />
            </View>
            <View style={s.clockActions}>
              <Pressable accessibilityLabel={T('Cancel')} onPress={() => setOpen(false)} style={[s.secondary, { flex: 1 }]}>
                <Text style={s.secondaryText}>{T('Cancel')}</Text>
              </Pressable>
              <Pressable accessibilityLabel={T('Save')} onPress={() => { onChange(joinTime(hour, minute, half)); setOpen(false); }} style={[s.primary, { flex: 1 }]}>
                <Text style={s.primaryText}>{T('Save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/**
 * A short confirmation that fades on its own.
 *
 * Saving used to throw up a system dialog: a grey box that stopped everything
 * until it was dismissed, to report something that only needed acknowledging.
 * A line that appears and then goes away says the same thing without asking
 * to be closed.
 */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let done = false;
    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 170, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => { if (!done) onDone(); });
    return () => { done = true; };
  }, [message, opacity, onDone]);

  return (
    <Animated.View pointerEvents="none" style={[s.toast, { opacity }]}>
      {ico('checkmark-circle', 17, C.green)}
      <Text style={s.toastText}>{message}</Text>
    </Animated.View>
  );
}

/**
 * Why the adhan recording cannot play, in words.
 *
 * Each of these is a state the device can actually be in, and each has a
 * different way out — so they are named separately rather than collapsed
 * into "the adhan is unavailable", which tells nobody anything.
 */
const ADHAN_AUDIO_REASON: Record<string, string> = {
  'alarm-unavailable': 'The adhan is played by the installed Android app, which is not running here. Your device notification tone will sound instead.',
  'exact-alarms-denied': 'Android is not allowing this app to set exact alarms, so the adhan cannot be timed to the prayer. Your notification tone will sound instead. Allow alarms and it will play properly.',
  'not-downloaded': 'The recording has not been downloaded to this phone yet, so your notification tone will sound instead. Fetch it once and the adhan will play.',
  'ios-no-clip': 'This recording is not one of the ones included with the app, so it cannot sound on iPhone. Choose one of the included recordings, or the system tone, and the adhan will play.',
  'alarm-rejected': 'The alarm could not be set on this phone. Your notification tone will sound at the prayer time instead of the adhan.',
};

function NotificationScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const{location}=useAppLocation();const{settings,update}=useWorshipSettings();
  const[health,setHealth]=useState<NotificationHealth>('undetermined');
  /* Android 13 reports a never-asked device as `denied`; canAsk is what
     separates that from a real refusal. See getNotificationStatus. */
  const[canAsk,setCanAsk]=useState(true);
  const[working,setWorking]=useState(false);
  const[queued,setQueued]=useState(0);
  const[battery,setBattery]=useState<BatteryState>('unknown');
  const[toast,setToast]=useState('');
  const toastDone=useCallback(()=>setToast(''),[]);
  /* Whether the real recording will sound, so the screen can say so instead
     of leaving somebody to discover it at prayer time. */
  const[audio,setAudio]=useState<AdhanAudio|null>(null);

  useEffect(()=>{void getNotificationStatus().then(st=>{setHealth(st.health);setCanAsk(st.canAsk)});void getScheduledCount().then(setQueued);void getBatteryOptimizationState().then(setBattery)},[]);
  useEffect(()=>{void inspectAdhanAudio(settings).then(setAudio)},[settings]);

  const permission=async()=>{await requestNotificationPermission(language);const next=await getNotificationStatus();setHealth(next.health);setCanAsk(next.canAsk)};
  const sync=async()=>{
    if(!location)return Alert.alert(T('Location needed'),T('Choose a prayer location before scheduling reminders.'));
    setWorking(true);
    try{
      const value=await managedPrayerSnapshot(location,settings);
      const position=await loadReadingPosition().catch(()=>null);
      const result=await schedulePrayerNotifications(value.snapshot,settings,language,
        position?{surahId:position.surahId,verseKey:position.verseKey,label:`${position.surahName} ${position.verseKey}`}:null);
      setQueued(await getScheduledCount());
      setAudio(result.adhanAudio);
      setToast(result.unsupported
        ? T('Saved. Reminders are scheduled in the installed app.')
        : tf(language,'{n} reminders scheduled.',{n:result.scheduled}));
    }catch(e:any){setToast(T(e.message||'Could not schedule'))}finally{setWorking(false)}};

  const toggleAdhan=(name:string)=>update({adhanEnabled:{...settings.adhanEnabled,[name]:!settings.adhanEnabled[name]}});
  /* Narrowed once, so the panel below reads as a single condition rather
     than re-checking the same three things at every mention. */
  const audioBlocked: string | null = audio && !audio.willPlay && audio.reason && audio.reason!=='no-adhan-enabled'&&audio.reason!=='web-unsupported'
    ? audio.reason : null;
  const togglePre=(name:string)=>update({prayerReminders:{...settings.prayerReminders,[name]:!settings.prayerReminders[name]}});
  const prayers=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
  const Row=({icon,title,subtitle,value,onChange}:any)=><View style={s.setting}>
    {icon?<MotionGlyph name={icon} size={19}/>:null}
    <View style={{flex:1}}><Text style={s.settingName}>{title}</Text>{!!subtitle&&<Text style={s.meta}>{subtitle}</Text>}</View>
    <View style={{direction:'ltr'} as any}><Switch value={value} onValueChange={onChange} trackColor={{true:C.green}}/></View>
  </View>;

  return <Page><ToolBar title={T('Prayer reminders')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Notifications" size={85}/>
      <Text style={s.dataTitle}>{T('Gentle, local reminders')}</Text>
      <Text style={s.intro}>{T('Permission and scheduling happen on your device. No notification profile is sent to us.')}</Text>

      <View style={[s.healthCard,{marginBottom:4}]}>
        <View style={[s.healthDot,{backgroundColor:health==='granted'?C.success:!canAsk&&health==='denied'?C.coral:C.gold}]}/>
        <View style={{flex:1}}>
          <Text style={s.sourceTitle}>{T('Permission')}: {T(health)}</Text>
          <Text style={s.sourceBody}>{health==='unsupported'
            ? T('System scheduling is available in the installed mobile app.')
            : !canAsk&&health==='denied'
              ? T('Declined earlier. Turn it on in the system settings for this app.')
              : queued?T(tf(language,'{n} scheduled right now.',{n:queued})):T('You remain in control through system settings.')}</Text>
        </View>
        {health!=='granted'&&health!=='unsupported'&&(!canAsk&&health==='denied'
          /* Genuinely declined, so the system prompt will not be shown again
             and asking again is a button that does nothing. The way back is
             the app's own page in the system settings. */
          ? <Tactile onPress={()=>{void openNotificationSettings()}} style={s.ghostSmall}><Text style={s.ghostText}>{T('Open settings')}</Text></Tactile>
          : <Tactile onPress={permission} style={s.ghostSmall}><Text style={s.ghostText}>{T('Allow')}</Text></Tactile>)}
      </View>

      {/* ---- the adhan itself ---- */}
      <Section title={T('Adhan')}/>
      {/* Whether the recording will really sound. Saying so here is the
          difference between a setting that is switched on and one that
          works: without it, a phone that will not honour exact alarms looks
          exactly like a phone that will, right up to the prayer time. */}
      {!!audioBlocked && <View style={[s.healthCard,{marginBottom:4,borderColor:C.coral,borderWidth:1}]}>
        <View style={[s.healthDot,{backgroundColor:C.coral}]}/>
        <View style={{flex:1}}>
          <Text style={s.sourceTitle}>{T('The adhan cannot sound on this device')}</Text>
          <Text style={s.sourceBody}>{T(ADHAN_AUDIO_REASON[audioBlocked] || ADHAN_AUDIO_REASON['alarm-rejected'])}</Text>
        </View>
        {audioBlocked==='exact-alarms-denied'
          ? <Tactile onPress={()=>{void openExactAlarmSettings()}} style={s.ghostSmall}><Text style={s.ghostText}>{T('Allow alarms')}</Text></Tactile>
          : audioBlocked==='not-downloaded'
            ? <Tactile onPress={()=>navigation.navigate('Adhan')} style={s.ghostSmall}><Text style={s.ghostText}>{T('Get the recordings')}</Text></Tactile>
            : null}
      </View>}
      <View style={s.settings}>
        <Row icon="notifications-outline" title={T('Sound the adhan')}
          subtitle={T('At each prayer time, with buttons to silence it or to mark the prayer as prayed.')}
          value={settings.adhanEnabled?.Fajr||settings.adhanEnabled?.Isha?true:false}
          onChange={(v:boolean)=>update({adhanEnabled:Object.fromEntries(prayers.map(p=>[p,v]))})}/>
      </View>
      <View style={s.settings}>
        <Tactile accessibilityLabel={T('Choose the adhan recordings')} onPress={()=>navigation.navigate('Adhan')} style={s.setting}>
          <MotionGlyph name="musical-notes-outline" size={19}/>
          <View style={{flex:1}}>
            <Text style={s.settingName}>{T('Choose the recordings')}</Text>
            <Text style={s.meta}>{T('Fajr has its own call, chosen separately. All recordings are stored in the app.')}</Text>
          </View>
          {ico('chevron-forward',18,C.muted)}
        </Tactile>
      </View>
      {/* Choosing a recording was offered here twice over — once for Fajr and
          once for everything else — and the second picker never changed what
          actually played. Rather than leave a control that lies, the choice
          lives in one place: the Adhan screen above, where every recording can
          be heard before it is picked. */}
      <View style={s.settings}>
        {prayers.map(name=><View key={name} style={s.setting}>
          <ToolGraphic tool="Notifications" size={47}/>
          <Text style={[s.settingName,{flex:1}]}>{prayerName(language, name)}</Text>
          <View style={{direction:'ltr'} as any}>
            <Switch value={!!settings.adhanEnabled?.[name]} onValueChange={()=>toggleAdhan(name)} trackColor={{true:C.green}}/>
          </View>
        </View>)}
      </View>

      {/* ---- before the prayer ---- */}
      <Section title={T('Before each prayer')}/>
      <View style={s.settings}>
        <Row icon="time-outline" title={T('Remind me beforehand')}
          subtitle={T('A quiet heads-up, so you are not caught out.')}
          value={settings.remindersEnabled} onChange={(v:boolean)=>update({remindersEnabled:v})}/>
      </View>
      <Text style={s.preferenceLabel}>{T('HOW LONG BEFORE')}</Text>
      <View style={s.choiceRow}>
        {[5,10,15,30].map(value=><ChoicePill key={value} label={tf(language,'{n} min',{n:value})}
          selected={settings.reminderOffset===value} onPress={()=>update({reminderOffset:value})}/>)}
      </View>
      <View style={s.settings}>
        {prayers.map(name=><View key={name} style={s.setting}>
          <ToolGraphic tool="Notifications" size={47}/>
          <Text style={[s.settingName,{flex:1}]}>{prayerName(language, name)}</Text>
          <View style={{direction:'ltr'} as any}>
            <Switch value={!!settings.prayerReminders?.[name]} onValueChange={()=>togglePre(name)} trackColor={{true:C.green}}/>
          </View>
        </View>)}
      </View>

      {/* ---- after the prayer ---- */}
      <Section title={T('After the prayer')}/>
      <View style={s.settings}>
        <Row icon="book-outline" title={T('Continue reading')}
          subtitle={T('Half an hour after each adhan, a nudge back to where you left off.')}
          value={settings.continueReadingReminder!==false}
          onChange={(v:boolean)=>update({continueReadingReminder:v})}/>
      </View>

      {/* ---- each morning ---- */}
      <Section title={T('Each morning')}/>
      <View style={s.settings}>
        <Row icon="sunny-outline" title={T('Verse of the day')}
          subtitle={T('One verse each morning, at the hour you choose.')}
          value={!!settings.dailyVerseReminder} onChange={(v:boolean)=>update({dailyVerseReminder:v})}/>
      </View>
      <TimeField label={T('Verse of the day')} value={settings.dailyVerseTime||'08:00'} T={T}
        onChange={(time:string)=>update({dailyVerseTime:time,dailyVerseReminder:true})}/>
      <View style={[s.settings,{marginTop:10}]}>
        <Row icon="library-outline" title={T('Hadith of the day')}
          subtitle={T('One hadith each morning, at the hour you choose.')}
          value={!!settings.dailyHadithReminder} onChange={(v:boolean)=>update({dailyHadithReminder:v})}/>
      </View>
      <TimeField label={T('Hadith of the day')} value={settings.dailyHadithTime||'09:00'} T={T}
        onChange={(time:string)=>update({dailyHadithTime:time,dailyHadithReminder:true})}/>

      {/* ---- before you sleep ---- */}
      <Section title={T('Before you sleep')}/>
      <View style={s.sleepHadith}>
        <Text style={s.sleepHadithAr}>
          {'إِنَّ سُورَةً مِنَ القُرآنِ ثَلاثُونَ آيَةً شَفَعَتْ لِصَاحِبِهَا حَتَّى غُفِرَ لَهُ، وَهِيَ سُورَةُ تَبَارَكَ'}
        </Text>
        <Text style={s.sleepHadithEn}>
          {T('“Indeed there is a Surah in the Qur’an of thirty Ayat, which intercedes for a man until he is forgiven. It is [Surah] Tabarak Alladhi Biyadihil-Mulk.”')}
        </Text>
        <Text style={s.sleepHadithRef}>{language === 'ar' ? SLEEP_SURAH.hadithAr : SLEEP_SURAH.hadith} · {language === 'ar' ? SLEEP_SURAH.practiceAr : SLEEP_SURAH.practice}</Text>
      </View>
      <View style={s.settings}>
        <Row icon="moon-outline" title={T('Remind me to read Surah Al-Mulk')}
          subtitle={settings.sleepReminderEnabled
            ? (settings.sleepReminderTime || '22:30')
            : T('Thirty verses, about five minutes.')}
          value={!!settings.sleepReminderEnabled}
          onChange={(v:boolean)=>update({sleepReminderEnabled:v})}/>
      </View>
      <View style={s.choiceGrid}>
        {['21:00','21:30','22:00','22:30','23:00','23:30'].map(time=><ChoicePill key={time} label={time}
          selected={!!settings.sleepReminderEnabled && settings.sleepReminderTime===time}
          onPress={()=>update({sleepReminderTime:time,sleepReminderEnabled:true})}/>)}
      </View>
      <Text style={s.cityFootnote}>
        {T('The hour is kept on this device only. It is not sent anywhere and is not used for tracking.')}
      </Text>

      {/* ---- android battery ---- */}
      {battery!=='notNeeded'&&<>
        <Section title={T('Reliability')}/>
        <View style={s.sourceCard}>
          <View style={s.locationBannerIcon}>{ico(battery==='exempt'?'shield-checkmark-outline':'warning-outline',18,C.green)}</View>
          <View style={{flex:1}}>
            <Text style={s.sourceTitle}>
              {battery==='exempt'?T('Protected from battery saving'):T('Battery saving may delay the adhan')}
            </Text>
            <Text style={s.sourceBody}>
              {battery==='exempt'
                ? T('Android will not delay this app’s reminders while it is saving power.')
                : T('Android sometimes delays alarms for apps it thinks are idle, which can make the adhan arrive late. Exempting this app takes one tap.')}
            </Text>
            {battery!=='exempt'&&<Pressable
              accessibilityLabel={T('Fix now')}
              onPress={async()=>{const shown=await requestBatteryExemption();if(shown===false)Alert.alert(T('Not available'),T('This device does not offer the exemption dialog. You can still change it from the Android battery settings.'));void getBatteryOptimizationState().then(setBattery)}}
              style={[s.primarySmall,{marginTop:10}]}>
              <Text style={s.primaryText}>{T('Fix now')}</Text>
            </Pressable>}
            {/* Android will not tell us whether the exemption was granted, so
                once asked we stop asking. The way back stays available: the
                system page lists every app that is exempt, and the setting can
                be checked or reversed there by hand. */}
            {battery==='exempt'&&<Pressable accessibilityLabel={T('Open the Android battery settings')}
              onPress={()=>{void openBatterySettings()}}
              style={[s.secondary,{alignSelf:'flex-start',marginTop:10}]}>
              <Text style={s.secondaryText}>{T('Check in battery settings')}</Text>
            </Pressable>}
          </View>
        </View>
      </>}

      <View style={s.actionRow}>
        <Tactile onPress={sync} style={s.primary}><Text style={s.primaryText}>{working?T('Scheduling…'):T('Save & reschedule')}</Text></Tactile>
        <Tactile onPress={()=>sendTestNotification(language).then(()=>setToast(T('Two notifications sent — one quiet, one adhan.'))).catch(e=>setToast(T(e.message||'Test unavailable')))} style={s.secondary}>
          <Text style={s.secondaryText}>{T('Test notification')}</Text>
        </Tactile>
      </View>
      <Text style={s.cityFootnote}>{T('Everything is rescheduled for you each day and whenever the location or these settings change.')}</Text>
    </ScrollView>
    {!!toast&&<Toast message={toast} onDone={toastDone}/>}
  </Page>}


/**
 * One recording list, used twice: once for Fajr and once for the rest.
 *
 * Fajr and the other five are different calls, so they are chosen separately
 * and previewed separately. Everything here is bundled in the app rather than
 * fetched, which is the only way a notification can play it at all - and it
 * means the adhan sounds at dawn with no network and no warm-up, once the
 * recordings have been fetched after onboarding.
 *
 * The player is bound to whichever recording is selected, so tapping a
 * recording you have not selected cannot play it yet: the choice is committed
 * first and the preview is started once the player has actually moved to the
 * new file. Doing it the other way round plays the previous recording, which
 * is worse than a short wait.
 */
/**
 * What the small line under a recording's name should say.
 *
 * The two platforms cannot be described in the same words, because what makes
 * a recording able to sound is a different thing on each.
 *
 * On iOS it is whether a clip of it ships inside the app. Nothing else there
 * will ever play, so that is the whole of the story, and it cannot change
 * after the install.
 *
 * On Android it is whether the recording has actually been fetched. The alarm
 * plays the whole recording from the cache, and the clip is only ever a
 * preview, so saying "included with the app" there would be a promise the
 * alarm cannot keep: a person would choose it, hear nothing at the prayer
 * time, and have no reason to suspect a download was missing.
 */
function trackRowLabel(track: AdhanTrack, onDevice: boolean): string {
  if (Platform.OS === 'ios') return track.clip ? 'Included with the app' : 'Downloaded on first use';
  return onDevice ? 'On this device' : 'Downloaded on first use';
}

function AdhanTrackList({tracks,selectedId,onSelect}:{tracks:AdhanTrack[];selectedId:string;onSelect:(id:string)=>void}){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  /* Which recordings are actually on the device, so the row can say so
     instead of promising. It changes underneath the screen while the
     onboarding download runs, so it is watched rather than read once. */
  const [onDevice,setOnDevice]=useState<Record<string,boolean>>({});
  useEffect(()=>{
    const read=()=>{const next:Record<string,boolean>={};for(const t of tracks)next[t.id]=isAdhanCached(t);setOnDevice(next)};
    read();
    const unsub=subscribeAdhanCache(read);
    return ()=>{unsub()};
  },[tracks]);
  /* The local file once it has been fetched, the network address while it is
     still arriving. Either way the preview works; only the wait differs. */
  const source=useMemo(()=>{const t=tracks.find(x=>x.id===selectedId); return t?adhanPlaybackSource(t):undefined;}, [tracks,selectedId]);
  const player=useAudioPlayer(source);
  const status=useAudioPlayerStatus(player);
  const [pending,setPending]=useState(false);
  const [failed,setFailed]=useState(false);
  useEffect(()=>()=>{player.pause()},[player]);

  const press=(track:AdhanTrack)=>{
    if(track.id===selectedId){
      if(status.playing){player.pause()}
      else{setFailed(false);setPending(true)}
      return;
    }
    onSelect(track.id); setFailed(false); setPending(true);
  };

  /* Started here rather than in the press handler, because the player is still
     pointed at the previous file at that moment. */
  useEffect(()=>{
    if(!pending)return;
    let alive=true;
    void (async()=>{
      try{
        if(status.currentTime>0.05)player.seekTo(0);
        player.play();
      }catch{ if(alive)setFailed(true); }
      finally{ if(alive)setPending(false); }
    })();
    return ()=>{alive=false};
  },[pending,player]);

  useEffect(()=>{ if(!status.playing) setPending(false); },[status.playing]);

  return <View style={s.settings}>
    {tracks.map(track=>{
      const chosen=track.id===selectedId;
      const playing=chosen&&status.playing;
      return <Tactile key={track.id} accessibilityRole="radio" accessibilityState={{selected:chosen}}
        accessibilityLabel={`${language==='ar'?(track.nameAr||track.name):track.name}`}
        onPress={()=>press(track)} style={s.setting}>
        <ToolGraphic tool="Adhan" size={49}/>
        <View style={{flex:1}}>
          <Text style={s.settingName}>{language==='ar'?(track.nameAr||track.name):track.name}</Text>
          <Text style={s.meta}>{T(trackRowLabel(track,onDevice[track.id]))} · {(track.bytes/1024/1024)>=1
            ? `${(track.bytes/1048576).toFixed(1)} ${T('MB')}`
            : `${Math.round(track.bytes/1024)} ${T('KB')}`}</Text>
        </View>
        <Pressable accessibilityLabel={playing?T('Pause Adhan preview'):T('Play Adhan preview')}
          onPress={()=>press(track)} style={s.iconButton} hitSlop={8}>
          {ico(playing?'pause':'play-outline',20,chosen?C.green:C.muted)}
        </Pressable>
        {ico(chosen?'checkmark-circle':'ellipse-outline',20,chosen?C.green:C.muted)}
      </Tactile>;
    })}
    {failed&&<Text style={s.meta}>{T('This recording could not be played here.')}</Text>}
  </View>;
}

function AdhanScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const {settings,update}=useWorshipSettings();
  const fajrId=adhanTrack(settings.adhanFajrReciter,FAJR_TRACKS[0]).id;
  const otherId=adhanTrack(settings.adhanReciter,ADHAN_TRACKS[0]).id;
  return <Page><ToolBar title={T('Adhan')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Adhan" size={92}/>
      <Text style={s.dataTitle}>{T('Choose an Adhan')}</Text>
      <Text style={s.intro}>{T('Fajr has its own call, so it is chosen on its own. Every other prayer shares the second choice. All recordings are stored in the app and play with no connection.')}</Text>

      <Section title={T('Fajr adhan')}/>
      <Text style={s.preferenceLabel}>{T('FOR FAJR ONLY')}</Text>
      <AdhanTrackList tracks={FAJR_TRACKS} selectedId={fajrId} onSelect={(id)=>update({adhanFajrReciter:id})}/>

      <Section title={T('Adhan for other prayers')}/>
      <Text style={s.preferenceLabel}>{T('FOR DHUHR, ASR, MAGHRIB AND ISHA')}</Text>
      <AdhanTrackList tracks={ADHAN_TRACKS} selectedId={otherId} onSelect={(id)=>update({adhanReciter:id})}/>

      <View style={s.apiPanel}>
        <Text style={s.apiTitle}>{T('Stored on your device')}</Text>
        <Text style={s.apiText}>{T('These recordings ship inside the app rather than downloading when you pick them. A notification can only play a sound built into the app, so this is what lets the adhan sound at dawn with no network at all.')}</Text>
      </View>
    </ScrollView></Page>}

function GuideDirectory({route,navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);/* The Ramadan guides are not listed here. They belong to the Ramadan
     screen, beside the timetable they belong with, and having them in both
     places made two tiles that look like different features show the same
     six things. */
  const guides=WORSHIP_GUIDES.filter((guide)=>!RAMADAN_GUIDE_IDS.includes(guide.id));return <Page><ToolBar title={T('Worship guides')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Worship guides" size={87}/><Text style={s.dataTitle}>{T('Learn with references')}</Text><Text style={s.intro}>{T('Concise educational overviews with transparent Qur’an and Hadith references. Detailed rulings should be learned from a qualified local scholar.')}</Text><View style={s.guideGrid}>{guides.map((guide,i)=>{const g=localizeGuide(guide,language);return <MotionPress key={guide.id} index={i} onPress={()=>navigation.navigate('Guide Detail',{guide})} style={s.guideCard}><View style={s.guideCardInner}><ToolGraphic tool={guide.id} size={69}/><Text style={s.exploreTitle}>{g.title}</Text><Text style={s.exploreBody}>{g.subtitle}</Text><View style={s.exploreArrow}>{ico(rtl ? 'arrow-back' : 'arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></ScrollView></Page>}
/**
 * The evidence for a guide, shown in full on the page rather than as a link
 * out. Both kinds are held on the device in guideSources, so a guide reads
 * the same with no connection, and tapping one opens it in the Hadith Library
 * or the Quran reader instead of a browser.
 */
function GuideReferences({ guide, navigation }: { guide: WorshipGuide; navigation: any }) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  return (<>
    <Section title={T('References')} />
    {guide.references.map((ref, i) => {
      if (ref.kind === 'hadith') {
        const h = GUIDE_HADITH[ref.ref];
        if (!h) return null;
        return (
          <MotionPress key={ref.ref} index={i} onPress={() => navigation.navigate('Hadith Detail', { slug: h.collection, number: h.number })} style={s.evidenceCard}>
            <Text style={s.evidenceLabel}>{h.label}</Text>
            <Text style={s.evidenceArabic}>{h.arabic}</Text>
            <Text style={s.evidenceBody}>{h.english}</Text>
            <View style={s.evidenceFoot}>
              <Text style={s.evidenceLink}>{T('Open in the Hadith Library')}</Text>
              {ico('chevron-forward', 15, C.green)}
            </View>
          </MotionPress>
        );
      }
      const v = GUIDE_VERSES[ref.ref];
      if (!v) return null;
      return (
        <MotionPress
          key={ref.ref}
          index={i}
          onPress={() => navigation.navigate('Quran', { screen: 'Reader', params: {
            chapter: { id: v.surah, name_simple: v.name, name_arabic: v.nameArabic, verses_count: v.versesCount },
            focusVerse: `${v.surah}:${v.verses[0].n}`
          }})}
          style={s.evidenceCard}
        >
          <Text style={s.evidenceLabel}>{v.label} · {v.name}</Text>
          {v.verses.map((ay) => (
            <View key={ay.n} style={s.evidenceVerse}>
              <Text style={s.evidenceArabic}>{ay.ar}</Text>
              <Text style={s.evidenceBody}>{ay.en}</Text>
            </View>
          ))}
          <View style={s.evidenceFoot}>
            <Text style={s.evidenceLink}>{T('Open in the Quran')}</Text>
            {ico('chevron-forward', 15, C.green)}
          </View>
        </MotionPress>
      );
    })}
  </>);
}

function GuideDetailInner({route,navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);const guide:WorshipGuide=localizeGuide(route.params.guide,language);return <Page><ToolBar title={guide.title} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool={guide.id} size={92}/>{guide.arabic&&<LinearGradient colors={[C.heroA,C.heroB]} style={s.guideHero}><Text style={s.guideHeroKicker}>{T('The testimony of faith')}</Text><Text style={s.guideHeroArabic}>{guide.arabic}</Text></LinearGradient>}<Text style={s.dataTitle}>{guide.subtitle}</Text><Text style={s.intro}>{guide.introduction}</Text><Section title={T('Step by step')}/><View style={s.settings}>{guide.steps.map((step,i)=><View key={step} style={[s.guideStep, i===guide.steps.length-1&&s.guideStepLast]}><View style={s.stepNo}><Text style={s.stepNoText}>{i+1}</Text></View><Text style={s.guideStepText}>{step}</Text></View>)}</View>{guide.note&&<View style={s.guideNote}><Text style={s.sourceTitle}>{T('Important note')}</Text><Text style={s.sourceBody}>{guide.note}</Text></View>}<GuideReferences guide={guide} navigation={navigation}/></ScrollView></Page>}

/**
 * The fixed dates of the Islamic year.
 *
 * These are the days that are agreed on and widely kept. Two of them carry a
 * note because they are not: the Mawlid and the middle of Sha'ban are observed
 * by many and disputed by others, and an app that states them as flat fact is
 * taking a side it has no business taking. The note is shown with the date.
 *
 * Laylat al-Qadr is dated to the 27th because that is the night most commonly
 * kept, but the reports place it in the odd nights of the last ten, so the note
 * says so rather than pretending the 27th is certain.
 *
 * The conversion comes from the bundled Umm al-Qura table; the dates
 * themselves are fixed in the Hijri year and do not move.
 */
type IslamicEvent = {
  month: number; day: number; title: string; titleAr: string;
  kind: 'fast' | 'eid' | 'night' | 'hajj' | 'newyear';
  note?: string; noteAr?: string;
};

const EVENT_COLOURS: Record<IslamicEvent['kind'], string> = {
  fast: C.success, eid: C.gold, night: C.gold, hajj: C.teal, newyear: C.green
};

const ISLAMIC_EVENTS: IslamicEvent[] = [
  { month: 1, day: 1, title: 'Islamic New Year', titleAr: 'رأس السنة الهجرية', kind: 'newyear' },
  { month: 1, day: 10, title: 'Ashura', titleAr: 'عاشوراء', kind: 'fast',
    note: 'A recommended fast. The Prophet ﷺ fasted it and said it expiates the year before it.',
    noteAr: 'صيام مستحب، صامه النبي ﷺ وقال إنه يكفر السنة التي قبله.' },
  { month: 3, day: 12, title: 'Mawlid al-Nabi', titleAr: 'المولد النبوي', kind: 'night',
    note: 'Observed by many Muslims; others do not mark it. Neither position is stated here as the only one.',
    noteAr: 'يحتفل به كثير من المسلمين، ولا يراه آخرون. لا يُقدَّم هنا رأي على آخر.' },
  { month: 7, day: 27, title: 'Isra and Mi’raj', titleAr: 'الإسراء والمعراج', kind: 'night' },
  { month: 8, day: 15, title: 'Middle of Sha’ban', titleAr: 'ليلة النصف من شعبان', kind: 'night',
    note: 'Commonly observed, and disputed. The reports about it are not all sound.',
    noteAr: 'معمول به عند كثيرين، وفيه خلاف، وليست كل الأحاديث فيه صحيحة.' },
  { month: 9, day: 1, title: 'Ramadan begins', titleAr: 'بداية رمضان', kind: 'fast' },
  { month: 9, day: 27, title: 'Laylat al-Qadr', titleAr: 'ليلة القدر', kind: 'night',
    note: 'Kept on the 27th by most, but the reports place it in the odd nights of the last ten.',
    noteAr: 'الأكثر على السابع والعشرين، لكن الأحاديث تجعلها في الوتر من العشر الأواخر.' },
  { month: 10, day: 1, title: 'Eid al-Fitr', titleAr: 'عيد الفطر', kind: 'eid' },
  { month: 12, day: 8, title: 'Hajj begins', titleAr: 'بداية الحج', kind: 'hajj' },
  { month: 12, day: 9, title: 'Day of Arafah', titleAr: 'يوم عرفة', kind: 'fast',
    note: 'A fast that expiates two years for those not on Hajj.',
    noteAr: 'صيامه يكفر سنتين لغير الحاج.' },
  { month: 12, day: 10, title: 'Eid al-Adha', titleAr: 'عيد الأضحى', kind: 'eid' },
];

/** Hijri months are 29 or 30 days; a 30th that does not exist simply has no event. */
const eventOn = (month: number, day: number) => ISLAMIC_EVENTS.filter((e) => e.month === month && e.day === day);

/** "in 12 days", "tomorrow", "today" - day counts, not precise times. */
/**
 * "in 12 days", "tomorrow", "today" - day counts, not precise times.
 *
 * Takes the language rather than a direction: Arabic and Urdu are both
 * right-to-left but do not share a word for "tomorrow", so a two-way switch
 * has nowhere to put the third.
 */
function daysUntilText(days: number, language: string | boolean): string {
  if (days <= 0) return tx(language, 'today');
  if (days === 1) return tx(language, 'tomorrow');
  if (language === 'ur') return `${days} دن میں`;
  if (language === 'ar') return `بعد ${days} ${arNoun(days, 'يوم', 'يومين', 'أيام', 'يومًا')}`;
  /* Indonesian "hari" has no plural: "12 hari" is twelve days, the same as
     "1 hari" is one. It also puts the number after the word, not before. */
  if (language === 'id') return `dalam ${days} hari`;
  /* Persian "روز", Turkish "gün" and Hindi "दिन" all carry the count the same
     way regardless of the number, so none of them needs a branch on days. */
  if (language === 'fa') return `${days} روز دیگر`;
  if (language === 'tr') return `${days} gün içinde`;
  if (language === 'hi') return `${days} दिन में`;
  /* Malayalam puts the count first as well, and "ദിവസം" carries it unchanged. */
  if (language === 'ml') return `${days} ദിവസം കഴിഞ്ഞ്`;
  return `in ${days} days`;
}

function HijriCalendarScreen({navigation}:any){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  const ar = language === 'ar';
  const {location}=useAppLocation(); const {settings}=useWorshipSettings();
  const [days,setDays]=useState<CalendarDay[]>([]);
  const [span,setSpan]=useState<CalendarDay[]>([]);
  const [error,setError]=useState('');
  const [selected,setSelected]=useState<CalendarDay|null>(null);
  const now=new Date();
  const load=async()=>{
    if(!location)return; setError(''); setDays([]);
    try{
      setDays(await getGregorianCalendar(location.latitude,location.longitude,now.getMonth()+1,now.getFullYear(),{timezone:location.timezone}));
    }catch(e:any){setError(T(e.message))}
  };
  useEffect(()=>{load()},[location?.latitude,location?.longitude]);
  /* A year ahead, so a fixed Hijri date can be turned into a day you can count
     down to. Fixed Hijri dates slide against the Gregorian year, so there is no
     way to work this out without reading the mapping. */
  useEffect(()=>{
    if(!location)return; let alive=true;
    getCalendarSpan(location.latitude,location.longitude,12,{
      method:Number(settings.calculationMethod)||8, school:settings.madhab, timeFormat:settings.timeFormat
    }).then((next:CalendarDay[])=>{if(alive)setSpan(next)}).catch(()=>{if(alive)setSpan([])});
    return()=>{alive=false};
  },[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);

  const first=days[0]?.gregorian.split('-').map(Number);
  const offset=first?new Date(first[2],first[1]-1,first[0]).getDay():0;
  const todayKey=`${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  const gregorianDate=(d:CalendarDay)=>{const[dd,mm,yy]=d.gregorian.split('-').map(Number);return new Date(yy,mm-1,dd)};
  const midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();

  /* What is coming, from the mapping rather than from arithmetic. */
  const upcoming=useMemo(()=>{
    if(!span.length)return [] as {event:IslamicEvent;date:Date;days:number;day:CalendarDay}[];
    const seen=new Set<string>(); const out:{event:IslamicEvent;date:Date;days:number;day:CalendarDay}[]=[];
    for(const day of span){
      const hits=eventOn(day.hijriMonthNumber,day.hijriDay);
      if(!hits.length)continue;
      const date=gregorianDate(day);
      const diff=Math.round((date.getTime()-midnight)/86400000);
      if(diff<0)continue;
      for(const event of hits){
        const key=`${event.title}-${day.hijriYear}`;
        if(seen.has(key))continue;
        seen.add(key);
        out.push({event,date,days:diff,day});
      }
    }
    return out.sort((a,b)=>a.days-b.days).slice(0,6);
  },[span]);

  const selectedEvents=selected?eventOn(selected.hijriMonthNumber,selected.hijriDay):[];

  return <Page><ToolBar title={T('Hijri calendar')} navigation={navigation}/>
  <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
    {!location?<LocationPrompt compact/>:<>
      <View style={s.calendarIntro}>
        <Text style={s.calendarMonth}>{now.toLocaleDateString(language==='ar'?'ar-u-nu-latn':'en',{month:'long',year:'numeric'})}</Text>
        <Text style={s.calendarHijri}>{days.length?(ar?`${days[0].hijriMonthAr||days[0].hijriMonth} – ${days[days.length-1].hijriMonthAr||days[days.length-1].hijriMonth} ${days[0].hijriYear} هـ`:tf(language,'{a} – {b} {y} AH',{a:days[0].hijriMonth,b:days[days.length-1].hijriMonth,y:days[0].hijriYear})):''}</Text>
      </View>

      {!!upcoming.length&&<>
        {/* The list below already covers the next twelve months - `span` is a
            twelve-month fetch - so there is nothing for a "next 12 months"
            control to do. It used to be rendered as a link with no press
            handler at all, which looked like a button and was not one. */}
        <Section title={T('Next 12 months')}/>
        <View style={s.settings}>
          {upcoming.map(({event,date,days:away,day})=>(
            <Pressable key={`${event.title}-${day.hijriYear}`} accessibilityRole="button"
              accessibilityLabel={`${T(event.title)}, ${daysUntilText(away,language)}`}
              onPress={()=>setSelected(day)} style={s.eventRow}>
              <View style={[s.eventDot,{ backgroundColor: EVENT_COLOURS[event.kind] }]}/>
              <View style={{flex:1}}>
                <Text style={s.settingName}>{language==='ar'?event.titleAr:T(event.title)}</Text>
                <Text style={s.meta} numberOfLines={1}>
                  {rtl
                    ? `${day.hijriDay} ${day.hijriMonthAr||day.hijriMonth} ${day.hijriYear} هـ · ${date.toLocaleDateString('ar-u-nu-latn',{day:'numeric',month:'short'})}`
                    : `${day.hijriDay} ${day.hijriMonth} ${day.hijriYear} AH · ${date.toLocaleDateString('en',{day:'numeric',month:'short'})}`}
                </Text>
              </View>
              <View style={s.eventCountdown}><Text style={s.eventCountdownText}>{daysUntilText(away,language)}</Text></View>
            </Pressable>
          ))}
        </View>
      </>}

      {error?<ErrorState message={error} retry={load}/>:!days.length?<SkeletonList rows={6} />:<>
        <Section title={T('This month')}/>
        <View style={s.weekHead}>{['ح','ن','ث','ر','خ','ج','س'].map((d,i)=><Text key={i} style={s.weekLabel}>{rtl?d:['S','M','T','W','T','F','S'][i]}</Text>)}</View>
        <View style={s.calendarGrid}>
          {Array.from({length:offset}).map((_,i)=><View key={`e${i}`} style={s.calendarCell}/>)}
          {days.map((d,i)=>{
            const hits=eventOn(d.hijriMonthNumber,d.hijriDay);
            const isToday=d.gregorian===todayKey;
            const isPicked=selected?.gregorian===d.gregorian;
            return <Pressable key={d.gregorian} accessibilityRole="button"
              accessibilityLabel={`${d.hijriDay} ${d.hijriMonth}${hits.length?', '+hits.map(h=>T(h.title)).join(', '):''}`}
              onPress={()=>setSelected(d)} style={[s.calendarCell,isToday&&s.calendarToday,isPicked&&s.calendarPicked]}>
              <Text style={s.gregorianDay}>{i+1}</Text>
              <Text style={s.hijriDay}>{d.hijriDay}</Text>
              {!!hits.length&&<View style={[s.calendarEvent,{ backgroundColor: EVENT_COLOURS[hits[0].kind] }]}/>}
            </Pressable>;
          })}
        </View>
        <View style={s.calendarLegend}>
          <View style={s.legendDot}/><Text style={s.sourceBody}>{T('Large number: Gregorian · Small number: Hijri')}</Text>
        </View>
        <View style={s.calendarLegend}>
          <View style={[s.legendDot,{backgroundColor:C.gold}]}/><Text style={s.sourceBody}>{T('A gold mark means a date kept in the Islamic year')}</Text>
        </View>
      </>}

      {!!selected&&<>
        <Section title={T('Selected day')}/>
        <View style={s.dayDetail}>
          <Text style={s.dayDetailHijri}>{rtl
            ? `${selected.hijriDay} ${selected.hijriMonthAr||selected.hijriMonth} ${selected.hijriYear} هـ`
            : `${selected.hijriDay} ${selected.hijriMonth} ${selected.hijriYear} AH`}</Text>
          <Text style={s.meta}>
            {rtl
              ? `${selected.weekdayAr||selected.weekday} · ${gregorianDate(selected).toLocaleDateString('ar-u-nu-latn',{day:'numeric',month:'long',year:'numeric'})}`
              : `${selected.weekday} · ${gregorianDate(selected).toLocaleDateString('en',{day:'numeric',month:'long',year:'numeric'})}`}
          </Text>
          {!!selectedEvents.length&&<View style={{marginTop:12,gap:10}}>
            {selectedEvents.map(event=>(
              <View key={event.title} style={s.dayDetailEvent}>
                <Text style={s.dayDetailEventTitle}>{language==='ar'?event.titleAr:T(event.title)}</Text>
                {!!event.note&&<Text style={s.sourceBody}>{T(rtl&&event.noteAr?event.noteAr:event.note!)}</Text>}
              </View>
            ))}
          </View>}
          <View style={s.dayDetailPrayers}>
            {selected.prayers.map(p=>(
              <View key={p.name} style={s.dayDetailPrayer}>
                <Text style={s.dayDetailPrayerName}>{prayerName(language,p.name)}</Text>
                <Text style={s.dayDetailPrayerTime}>{clockTime(language,p.time)}</Text>
              </View>
            ))}
          </View>
        </View>
      </>}
    </>}
  </ScrollView></Page>
}
/* ------------------------------------------------------------------ *
 * Ramadan
 * ------------------------------------------------------------------ */

/** Short weekday initials for the grid header, in the order the grid runs. */
const WEEK_INITIALS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEK_INITIALS_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
/** Sunday first, to put the first of the month in the right column. */
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Today, in the DD-MM-YYYY shape the calendar is keyed by. */
function todayKey() {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
}

/** Whole days from one DD-MM-YYYY key to another. Negative once `to` has gone. */
function dayGap(from: string, to: string) {
  const at = (v: string) => {
    const [d, m, y] = v.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((at(to) - at(from)) / 86400000);
}

/** `5:03 AM` down to `5:03`: a grid cell is 46 wide and has no room for the half. */
const shortTime = (value: string) => value.replace(/\s*(AM|PM|ص|م)\s*$/i, '').trim();

/**
 * The running count to whichever of the two times comes next.
 *
 * Before dawn it is Suhoor that is coming; between dawn and sunset, Iftar;
 * after sunset the day's fast is behind you and it is tomorrow's Suhoor being
 * counted to. It ticks on its own, so the number is never a second stale.
 */
function RamadanCount({ suhoor, iftar, rtl }: { suhoor: string; iftar: string; rtl: boolean }) {
  const { language } = useLanguage();
  const T = (text: string) => tx(language, text);
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const at = (raw: string) => {
    const [h, m] = raw.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };
  const now = Date.now();
  const suhoorAt = at(suhoor);
  const iftarAt = at(iftar);
  const [label, target] =
    now < suhoorAt ? [T('Suhoor in'), suhoorAt] :
    now < iftarAt ? [T('Iftar in'), iftarAt] :
    [T('Suhoor in'), suhoorAt + 86400000];
  const left = Math.max(0, Math.floor((target - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, '0');
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left - hh * 3600) / 60);
  return <Text style={s.ramCountValue}>{label} {hh}:{pad(mm)}:{pad(left % 60)}</Text>;
}

/**
 * Ramadan.
 *
 * Two questions are asked of this screen and they are not the same question.
 * Once a day, inside the month, it is asked what time to eat — and that wants
 * the one day you are standing in, with the count running against it. Once a
 * year it is asked what the month looks like — and that wants all thirty at
 * once, in the shape they are actually held in the mind.
 *
 * So it answers them in that order, and each in the form it wants: the day you
 * are in first, whole, with the clock ticking; the month underneath as a grid
 * rather than as thirty identical rows, which is what it used to be.
 *
 * The guides come last. They are read once and kept, while the timetable is
 * looked at every evening of the month — burying it under them was backwards.
 */
function RamadanScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const { resolved } = useTheme();
  const { location } = useAppLocation();
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [error, setError] = useState('');
  const load = async () => {
    if (!location) return;
    setError('');
    setDays([]);
    try {
      const snap = await getPrayerSnapshot(location.latitude, location.longitude);
      const target = snap.hijriMonth > 9 ? snap.hijriYear + 1 : snap.hijriYear;
      setYear(target);
      setDays(await getRamadanCalendar(location.latitude, location.longitude, target));
    } catch (e: any) {
      setError(T(e.message));
    }
  };
  useEffect(() => {
    load();
  }, [location?.latitude, location?.longitude]);

  const key = todayKey();
  const index = days.findIndex((d) => d.gregorian === key);
  const today = index >= 0 ? days[index] : null;
  /* The calendar is always the *next* Ramadan, so for eleven months of the
     year the panel looks forward to it rather than standing empty. */
  const opening = days.length ? days[0] : null;
  const away = opening ? dayGap(key, opening.gregorian) : 0;
  const focus = today || opening;
  const suhoor = focus?.prayers.find((p) => p.name === 'Fajr');
  const iftar = focus?.prayers.find((p) => p.name === 'Maghrib');
  const lead = opening ? Math.max(0, WEEKDAY_NAMES.indexOf(opening.weekday)) : 0;
  const initials = rtl ? WEEK_INITIALS_AR : WEEK_INITIALS_EN;

  return <Page><ToolBar title={T('Ramadan')} navigation={navigation}/><ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>{!location ? <LocationPrompt compact/> : <>
    {/* The day you are in — or, for eleven months of the year, the opening one.
        Palestine takes the deep green off the flag: the theme's own green is
        too light to carry white type at this size. */}
    <LinearGradient colors={isPal(resolved) ? [C.heroA, mix(FLAG.green, FLAG.black, 0.30)] : [C.heroA, C.green]} style={s.ramToday}>
      <View style={s.ramTodayTop}>
        <Text style={s.ramArabic}>رَمَضَان</Text>
        <Text style={s.ramStatus}>{
          today
            ? (tf(language,'Day {i} of {t}',{i:index + 1,t:days.length}))
            : away > 0
              ? (tf(language,'Begins in {n}',{n:`${away} ${away === 1 ? T('day') : T('days')}`}))
              : `${T('Ramadan')} ${year || ''} ${T('AH')}`
        }</Text>
      </View>
      {!!focus && <View style={s.ramTodayTimes}>
        <View style={s.ramTimeBlock}>
          <Text style={s.ramTimeLabel}>{T('SUHOOR')}</Text>
          <Text style={s.ramTimeValue}>{clockTime(language, suhoor?.time || '')}</Text>
        </View>
        <View style={s.ramTimeBlock}>
          <Text style={s.ramTimeLabel}>{T('IFTAR')}</Text>
          <Text style={s.ramTimeValue}>{clockTime(language, iftar?.time || '')}</Text>
        </View>
      </View>}
      <View style={s.ramCountRow}>
        {ico('time-outline', 14, C.onAccent)}
        {today
          ? <RamadanCount suhoor={suhoor?.raw || '00:00'} iftar={iftar?.raw || '00:00'} rtl={rtl}/>
          : <Text style={s.ramCountValue}>{rtl
              ? `${focus?.weekdayAr || ''} · ${focus?.gregorian}`
              : `${focus?.weekday} · ${focus?.gregorian}`}</Text>}
      </View>
    </LinearGradient>

    {error ? <ErrorState message={error} retry={load}/> : !days.length ? <SkeletonList rows={6} /> : <>
      <Section title={T('Fasting timetable')} action={tf(language,'{n} days',{n:days.length})}/>
      <View style={s.ramMonth}>
        <View style={s.ramWeekRow}>{initials.map((initial, i) => <View key={i} style={s.ramWeekCell}><Text style={s.ramWeekText}>{initial}</Text></View>)}</View>
        <View style={s.ramGrid}>
          {Array.from({ length: lead }).map((_, i) => <View key={`pad${i}`} style={s.ramCellSpacer}/>)}
          {days.map((d) => {
            const dawn = d.prayers.find((p) => p.name === 'Fajr');
            const dusk = d.prayers.find((p) => p.name === 'Maghrib');
            const isToday = d.gregorian === key;
            const past = dayGap(d.gregorian, key) > 0;
            return <View key={d.gregorian} style={[s.ramCell, past && s.ramCellPast, isToday && s.ramCellToday]}>
              <Text style={[s.ramCellNum, past && s.ramCellNumPast]}>{d.hijriDay}</Text>
              <View style={s.ramCellRule}/>
              <Text style={[s.ramCellTime, past && s.ramCellTimePast]}>{shortTime(dawn?.time || '')}</Text>
              <Text style={[s.ramCellTime, s.ramCellIftar, past && s.ramCellTimePast]}>{shortTime(dusk?.time || '')}</Text>
            </View>;
          })}
        </View>
        <View style={s.ramLegend}>
          <View style={s.ramLegendItem}><View style={s.ramSwatch}/><Text style={s.ramLegendText}>{T('Suhoor')}</Text></View>
          <View style={s.ramLegendItem}><View style={[s.ramSwatch, s.ramSwatchIftar]}/><Text style={s.ramLegendText}>{T('Iftar')}</Text></View>
          <Text style={s.ramLegendNote}>{T(location.label)}</Text>
        </View>
      </View>
    </>}

    <Pressable onPress={() => navigation.navigate('Tools', { screen: 'Fasting', initial: false })} style={[s.sourceCard, { marginTop: 16 }]}>{ico('create-outline', 20, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Fasting record')}</Text><Text style={s.sourceBody}>{T('Mark each day and keep your make-up ledger')}</Text></View>{ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}</Pressable>

    {/* The guides live here rather than in the worship directory, so the
        six of them are not listed twice under two different names. */}
    <Section title={T('Guides')} action={String(RAMADAN_GUIDES.length)}/>
    <View style={s.ramGuideGrid}>{RAMADAN_GUIDES.map((guide, i) => {
      const g = localizeGuide(guide, language);
      return <MotionPress key={guide.id} index={i} onPress={() => navigation.navigate('Guide Detail', { guide })} style={s.ramGuideCard}>
        <View style={s.ramGuideIcon}><ToolGraphic tool={guide.id} size={44}/></View>
        <Text style={s.ramGuideTitle} numberOfLines={2}>{g.title}</Text>
        <Text style={s.ramGuideBody} numberOfLines={3}>{g.subtitle}</Text>
      </MotionPress>;
    })}</View>
  </>}</ScrollView></Page>}
/* ==================== Phase 4 · women's area ==================== */

// `title` is what is shown, so it is translated; `label` is what a screen reader
// and the QA scripts read, and it stays in English in both languages.
function PrivateRow({ title, caption, graphic, onPress, rtl, label }: { title: string; caption: string; graphic: string; onPress: () => void; rtl: boolean; label?: string }) {
  return <Tactile accessibilityRole="button" accessibilityLabel={label ?? title} onPress={onPress} style={s.setting}>
    <ToolGraphic tool={graphic} size={49} />
    <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{title}</Text><Text style={s.meta}>{caption}</Text></View>
    {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
  </Tactile>;
}

function StatBox({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <View style={s.statBox}><Text style={s.statLabel}>{label}</Text><Text style={s.statValue}>{value}</Text>{!!hint && <Text style={s.meta}>{hint}</Text>}</View>;
}

function PinDots({ filled, error }: { filled: number; error?: boolean }) {
  return <View style={s.pinDots}>{Array.from({ length: 4 }, (_, i) => <View key={i} style={[s.pinDot, i < filled && s.pinDotFilled, !!error && s.pinDotError]} />)}</View>;
}

function PinKeypad({ onDigit, onDelete, onBiometric, biometric }: { onDigit: (digit: string) => void; onDelete: () => void; onBiometric?: (() => void) | null; biometric: BiometricInfo }) {
  const { rtl , language }=useLanguage();
  const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
  return <View style={s.pinPad}>
    {rows.map((row) => <View key={row.join('')} style={s.pinRow}>{row.map((digit) => <Pressable key={digit} accessibilityRole="button" accessibilityLabel={`${tx(language,'Digit')} ${digit}`} onPress={() => onDigit(digit)} style={({ pressed }) => [s.pinKey, pressed && s.press]}><Text style={s.pinKeyText}>{digit}</Text></Pressable>)}</View>)}
    <View style={s.pinRow}>
      {onBiometric ? <Pressable accessibilityRole="button" accessibilityLabel={`${tx(language,'Unlock with')} ${biometric.label}`} onPress={onBiometric} style={s.pinKey}>{ico(biometric.kind === 'face' ? 'scan-outline' : 'finger-print-outline', 22, C.green)}</Pressable> : <View style={s.pinKeyGhost} />}
      <Pressable accessibilityRole="button" accessibilityLabel={tx(language,'Digit 0')} onPress={() => onDigit('0')} style={({ pressed }) => [s.pinKey, pressed && s.press]}><Text style={s.pinKeyText}>0</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={tx(language,'Delete the last digit')} onPress={onDelete} style={s.pinKey}>{ico('backspace-outline', 20, C.ink)}</Pressable>
    </View>
  </View>;
}

function usePrivateGate() {
  const config = useLockConfig();
  const locked = useIsLocked();
  const [info, setInfo] = useState<BiometricInfo>({ available: false, enrolled: false, kind: 'none', label: 'Biometric' });
  useEffect(() => {
    let alive = true;
    void biometricInfo(true).then((value) => { if (alive) setInfo(value); });
    return () => { alive = false; };
  }, []);
  return { config, locked, info };
}

function PrivateLockScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const { config, info } = usePrivateGate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const busy = useRef(false);
  const withBiometrics = async () => {
    if (busy.current) return;
    busy.current = true;
    const ok = await unlockWithBiometric();
    busy.current = false;
    if (!ok) setError(T('That was not recognised. You can use your PIN instead.'));
  };
  useEffect(() => {
    if (config.biometric && info.available) void withBiometrics();
  }, [config.biometric, info.available]);
  const submit = async (value: string) => {
    if (value.length < 4) return;
    if (await checkPin(value)) { setPin(''); setError(''); unlockSession(); return; }
    haptic('error');
    setError(T('That is not the PIN saved on this device.'));
    setPin('');
  };
  const digit = async (value: string) => {
    haptic();
    const next = (pin + value).slice(0, 4);
    setPin(next);
    setError('');
    if (next.length === 4) await submit(next);
  };
  return <Page><ToolBar title={T('Private')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.pinPage}>
      <ToolGraphic tool="Privacy lock" size={87} />
      <Text style={s.dataTitle}>{T('Locked')}</Text>
      <Text style={s.intro}>{tx(language, 'These records stay on this device. Unlock with ')}{info.available ? `${info.label}${tx(language, ' or ')}` : ''}{tx(language, 'your PIN to open them.')}</Text>
      <PinDots filled={pin.length} error={!!error} />
      <Text style={[s.pinHint, !!error && s.pinHintError]}>{error || (config.pinSet ? T('Enter your 4-digit PIN') : T('No PIN has been set yet'))}</Text>
      <PinKeypad onDigit={digit} onDelete={() => { setPin((value) => value.slice(0, -1)); setError(''); }} onBiometric={config.biometric && info.available ? withBiometrics : null} biometric={info} />
      {!config.pinSet && <Tactile accessibilityLabel={T('Set a PIN')} onPress={() => navigation.navigate('Privacy Lock')} style={s.sectionLink}><Text style={s.sectionAction}>{T('Set a PIN')}{rtl ? ' ←' : ' →'}</Text></Tactile>}
    </ScrollView>
  </Page>;
}

function PrivateArea({ navigation, children }: { navigation: any; children: React.ReactNode }) {
  const { locked } = usePrivateGate();
  if (locked) return <PrivateLockScreen navigation={navigation} />;
  return <>{children}</>;
}

/**
 * Istihada — bleeding that is not a period.
 *
 * The most consequential question in this area, and the one most often got
 * wrong in the direction that costs the most. A woman who takes irregular
 * bleeding for a period leaves the prayer and the fast for days she still
 * owed them, and does not know it. Hayd is measured against her own pattern
 * and against the outer limits; bleeding that falls outside them does not
 * carry its rules, however much it looks like it does.
 *
 * So the screen asks the two things she knows and the app cannot guess — how
 * long the bleeding has run, and how many clear days came before it — and
 * holds them against what her own history says. It then names the position it
 * applied, because the schools differ on these numbers and she is entitled to
 * know which set she was just measured with.
 */
function IstihadaScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const stats = cycleStats(womens);

  /* Begin from what the app already holds. With a cycle open it knows the
     first day, and therefore knows how long the bleeding has run — asking
     for that again would be asking for a number it is already carrying. */
  const openDays = stats.active ? Math.max(1, daysBetween(stats.active.start, dayKey()) + 1) : 0;
  const [days, setDays] = useState(openDays || 4);
  const [purity, setPurity] = useState<number | null>(null);

  const assessment = assessBleeding(womens, { days, purityBefore: purity });
  const guidance = BLEEDING_GUIDANCE[assessment.verdict];
  const verdictColour = assessment.verdict === 'hayd' || assessment.verdict === 'nifas'
    ? C.green
    : assessment.verdict === 'unclear' ? C.muted : C.gold;
  const headline = assessment.verdict === 'istihada' ? T('Prayer and fasting are due')
    : assessment.verdict === 'hayd' || assessment.verdict === 'nifas' ? T('Prayer and fasting are not due in these days')
    : assessment.verdict === 'unclear' ? T('Ask a scholar you trust')
    : T('Prayer and fasting resume from here');

  const stepper = (
    value: number | null,
    dec: () => void,
    inc: () => void,
    unit: string,
  ) => (
    <View style={s.stepper}>
      <Tactile accessibilityLabel={T('Fewer')} onPress={dec} style={s.stepButton}>{ico('remove', 20, C.green)}</Tactile>
      <Text style={s.settingName}>{value === null ? T('Not sure') : `${value} ${T(unit)}`}</Text>
      <Tactile accessibilityLabel={T('More')} onPress={inc} style={s.stepButton}>{ico('add', 20, C.green)}</Tactile>
    </View>
  );

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Istihada')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Istihada" size={87} />
      <Text style={s.dataTitle}>{T('Is this bleeding a period?')}</Text>
      <Text style={s.intro}>{T('Bleeding is not always hayd, and the difference decides whether the prayer and the fast are due. Answer the two questions below and the app will hold them against your own pattern and against the limits commonly cited.')}</Text>

      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{T('HOW LONG IT HAS RUN')}</Text>
        {stepper(days, () => setDays(Math.max(1, days - 1)), () => setDays(Math.min(45, days + 1)), 'days')}
        {!!openDays && <Text style={s.meta}>{T('Started from the cycle you have open.')}</Text>}
      </View>

      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{T('CLEAR DAYS BEFORE IT BEGAN')}</Text>
        {stepper(
          purity,
          () => setPurity(purity === null ? null : purity <= 0 ? null : purity - 1),
          () => setPurity(purity === null ? 0 : Math.min(40, purity + 1)),
          'days',
        )}
        <Text style={s.meta}>{T('If you are not sure, leave it. The answer is firmer with it, but it is not required.')}</Text>
      </View>

      <View style={s.dataCard}>
        <Text style={[s.dataMeta, { color: verdictColour }]}>{T(guidance.title)}</Text>
        <Text style={s.dataTitle}>{headline}</Text>
        <Text style={s.dataBody}>{T(guidance.body)}</Text>
      </View>

      <Section title={T('How it was worked out')} />
      <View style={s.dataCard}>
        {assessment.reasons.map((reason: string, index: number) => <Text key={index} style={[s.dataBody, index > 0 && { marginTop: 8 }]}>{language === 'ar' ? assessment.reasonsAr?.[index] || T(reason) : T(reason)}</Text>)}
        {assessment.adah !== null && <Text style={[s.meta, { marginTop: 10 }]}>{tf(language, 'Your recorded pattern: about {n} days.', { n: assessment.adah })}</Text>}
      </View>

      <Section title={T('What to do')} />
      <View style={s.dataCard}>
        {guidance.steps.map((step: string, index: number) => (
          <View key={index} style={[s.packingRow, index === guidance.steps.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[s.dataMeta, { minWidth: 22 }]}>{index + 1}</Text>
            <Text style={[s.dataBody, { flex: 1 }]}>{T(step)}</Text>
          </View>
        ))}
      </View>

      <Section title={T('Keep the record straight')} />
      <View style={s.settings}>
        <Tactile onPress={() => navigation.navigate('Cycle')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('Record these days so your own pattern stays accurate.')}</Text></View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
        </Tactile>
        <Tactile onPress={() => navigation.navigate('Qada')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Qada Fasts')}</Text><Text style={s.meta}>{T('Fast days that fall in hayd or nifas are owed, and are kept here.')}</Text></View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
        </Tactile>
      </View>

      <Section title={T('Which position this uses')} />
      <View style={s.dataCard}><Text style={s.dataBody}>{T(SCHOOL_NOTE)}</Text></View>

      <View style={s.dataCard}><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

/**
 * The Ramadan planner.
 *
 * It answers one question a woman asks quietly every year: which of these
 * thirty days am I likely to lose, and how long do I have to make them up?
 *
 * The answer is drawn entirely from her own recorded pattern, and it is drawn
 * on the device. Nothing about it leaves.
 *
 * The month is shown as a grid rather than a list because that is how Ramadan
 * is actually held in the mind — thirty days, and the few that are in question.
 * Days inside a projected period are marked one way, the days either side of
 * it another, because the edge is where a fast is decided: bleeding that begins
 * in the last minutes before Maghrib breaks that day, and no projection can
 * know the minute.
 */
const RAMADAN_CELL = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  cell: {
    flexGrow: 1, flexShrink: 1, flexBasis: '13%', maxWidth: 52, aspectRatio: 1,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.line
  },
  cellLikely: { backgroundColor: C.gold, borderColor: C.gold },
  cellPossible: { backgroundColor: C.yellow, borderColor: C.gold },
  cellToday: { borderWidth: 2, borderColor: C.green },
  cellNum: { fontFamily: 'DMSans_700Bold', fontSize: 13 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  swatch: { width: 13, height: 13, borderRadius: 4, borderWidth: 1, borderColor: C.line },
  legendText: { color: C.muted, fontSize: 12, fontFamily: 'DMSans_400Regular', flex: 1 },
  heroOwed: { color: C.ink, fontSize: 40, fontFamily: 'DMSans_700Bold', marginTop: 6 },
  heroUnit: { color: C.muted, fontSize: 13, fontFamily: 'DMSans_400Regular', marginTop: 2 },
  statRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
  stat: { flex: 1, backgroundColor: C.mint, borderRadius: 14, padding: 11 },
  statValue: { color: C.green, fontSize: 16, fontFamily: 'DMSans_700Bold', marginTop: 2 },
  statLabel: { color: C.muted, fontSize: 10, fontFamily: 'DMSans_700Bold', letterSpacing: 0.6 }
});

function RamadanPlannerScreen({ navigation }: any) {
  const { rtl, language } = useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const plan = ramadanPlan(womens);
  const today = dayKey();

  const owedText = !plan.hasPattern
    ? T('—')
    : plan.likelyCount === plan.owedHigh
      ? `${plan.likelyCount}`
      : `${plan.owedLow}–${plan.owedHigh}`;

  const whenText = plan.finished
    ? T('This Ramadan has ended')
    : plan.started
      ? tf(language, 'Ramadan is under way — day {n}', { n: Math.min(30, Math.abs(daysBetween(plan.start, today)) + 1) })
      : tf(language, 'Starts in {n} days', { n: plan.daysLeft });

  const confidenceText =
    plan.confidence === 'good'
      ? T('Your pattern is steady, so this should be close.')
      : plan.confidence === 'fair'
        ? T('Your cycle varies somewhat, so treat the outer days as a question mark.')
        : plan.hasPattern
          ? T('Your cycle has varied a good deal, so this is a rough shape rather than a forecast.')
          : T('Not enough history yet to project from.');

  const cell = (day: RamadanPlanDay) => {
    const isToday = day.date === today;
    const tone =
      day.state === 'likely'
        ? RAMADAN_CELL.cellLikely
        : day.state === 'possible'
          ? RAMADAN_CELL.cellPossible
          : null;
    const numColour = day.state === 'likely' ? C.card : day.state === 'possible' ? C.gold : C.muted;
    return (
      <View
        key={day.date}
        style={[RAMADAN_CELL.cell, tone, isToday && RAMADAN_CELL.cellToday]}
        accessibilityLabel={tf(language, 'Day {n}, {state}', { n: day.ramadanDay, state: T(RAMADAN_STATE_LABEL[day.state]) })}
      >
        <Text style={[RAMADAN_CELL.cellNum, { color: numColour }]}>{day.ramadanDay}</Text>
      </View>
    );
  };

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Ramadan Planner')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Ramadan Planner" size={87} />
      <Text style={s.dataTitle}>{T('Ramadan through your cycle')}</Text>
      <Text style={s.intro}>{T('Thirty days, and the handful your cycle is likely to claim from them. The app counts forward from your own recorded pattern and marks the days it lands on, so the number you owe is known before the month begins rather than counted up at the end of it.')}</Text>

      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{tf(language, 'Ramadan {year}', { year: plan.hijriYear })}</Text>
        <Text style={s.dataName}>{formatLongDay(plan.start, language)}{T(' — ')}{formatLongDay(plan.end, language)}</Text>
        <Text style={s.meta}>{whenText}</Text>

        <Text style={RAMADAN_CELL.heroOwed}>{owedText}</Text>
        <Text style={RAMADAN_CELL.heroUnit}>
          {plan.hasPattern
            ? T(plan.owedHigh === plan.owedLow ? 'fasts likely to be owed' : 'fasts likely to be owed — the second figure if the timing shifts')
            : T('no projection yet')}
        </Text>

        {plan.hasPattern && (
          <Text style={[s.meta, { marginTop: 8 }]}>
            {tf(language, 'To make up before {date} — {n} days away.', { date: formatDay(plan.deadline, language), n: plan.daysUntilDeadline })}
          </Text>
        )}
      </View>

      {!plan.hasPattern && (
        <View style={s.dataCard}>
          <Text style={s.dataName}>{T('What it needs from you')}</Text>
          <Text style={s.dataBody}>{T('This is counted from your own cycles, not from an average. Record two complete cycles — a start and an end for each — and the projection appears here. Until then the honest answer is no answer, and a number invented from someone else’s pattern would be worse than a blank.')}</Text>
          <Pressable onPress={() => navigation.navigate('Cycle')} style={[s.setting, { marginTop: 8, borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('Record a start and an end for each cycle.')}</Text></View>
            {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
          </Pressable>
        </View>
      )}

      {plan.hasPattern && (
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('THE THIRTY DAYS')}</Text>
          <View style={RAMADAN_CELL.grid}>{plan.days.map(cell)}</View>

          <View style={RAMADAN_CELL.legendRow}>
            <View style={[RAMADAN_CELL.swatch, { backgroundColor: C.gold, borderColor: C.gold }]} />
            <Text style={RAMADAN_CELL.legendText}>{T('Likely — inside your projected days')}</Text>
          </View>
          <View style={RAMADAN_CELL.legendRow}>
            <View style={[RAMADAN_CELL.swatch, { backgroundColor: C.yellow, borderColor: C.gold }]} />
            <Text style={RAMADAN_CELL.legendText}>{T('Possible — either side of them')}</Text>
          </View>
          <View style={RAMADAN_CELL.legendRow}>
            <View style={[RAMADAN_CELL.swatch, { backgroundColor: 'transparent' }]} />
            <Text style={RAMADAN_CELL.legendText}>{T('No period expected')}</Text>
          </View>
        </View>
      )}

      {plan.hasPattern && (
        <View style={s.dataCard}>
          <View style={RAMADAN_CELL.statRow}>
            <View style={RAMADAN_CELL.stat}>
              <Text style={RAMADAN_CELL.statLabel}>{T('YOUR CYCLE')}</Text>
              <Text style={RAMADAN_CELL.statValue}>{plan.averageCycle} {T('days')}</Text>
            </View>
            <View style={RAMADAN_CELL.stat}>
              <Text style={RAMADAN_CELL.statLabel}>{T('YOUR PERIOD')}</Text>
              <Text style={RAMADAN_CELL.statValue}>{plan.averagePeriod} {T('days')}</Text>
            </View>
            <View style={RAMADAN_CELL.stat}>
              <Text style={RAMADAN_CELL.statLabel}>{T('VARIES BY')}</Text>
              <Text style={RAMADAN_CELL.statValue}>{plan.variation} {T('days')}</Text>
            </View>
          </View>
          <Text style={[s.meta, { marginTop: 12 }]}>{confidenceText}</Text>
          <Text style={[s.meta, { marginTop: 6 }]}>{tf(language, 'Counted from your last {n} recorded cycles.', { n: plan.cycleCount }) }</Text>
        </View>
      )}

      <Section title={T('What is worth knowing')} />
      <View style={s.dataCard}>
        {RAMADAN_NOTES.map((note, index) => (
          <View key={index} style={[s.packingRow, { alignItems: 'flex-start' }, index === RAMADAN_NOTES.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[s.dataMeta, { minWidth: 22, marginTop: 0 }]}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.dataName, { marginTop: 0 }]}>{T(note.title)}</Text>
              <Text style={s.dataBody}>{T(note.body)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Section title={T('Keep the record straight')} />
      <View style={s.settings}>
        <Tactile onPress={() => navigation.navigate('Cycle')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('The projection is only as good as the record it is built on.')}</Text></View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
        </Tactile>
        <Tactile onPress={() => navigation.navigate('Qada')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Qada Fasts')}</Text><Text style={s.meta}>{T('Once a day is actually missed, keep it here.')}</Text></View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
        </Tactile>
        <Pressable onPress={() => navigation.navigate('Istihada')} style={[s.setting, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Istihada')}</Text><Text style={s.meta}>{T('When bleeding runs past your pattern, this is the question it raises.')}</Text></View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
        </Pressable>
      </View>

      <View style={s.dataCard}><Text style={s.dataBody}>{T(RAMADAN_ADVISORY)}</Text></View>
      <View style={s.dataCard}><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

/**
 * Keeping going through these days.
 *
 * The temptation in an app like this is to dim the screen — to show a woman
 * what she cannot do. That has the month backwards. Two worships are lifted
 * in these days and they are lifted as a mercy. Almost everything else she
 * does is untouched by them, and every one of those things already lives
 * somewhere in this app.
 *
 * So the screen is mostly a set of doors. It opens with what is open, names
 * the one genuine disagreement without settling it, and says plainly that the
 * prayer streak resting is not ground lost.
 */
function TheseDaysScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const stats = cycleStats(womens);
  const nifas = nifasStats(womens);

  /* Where each open act actually lives in the app. Kept here, next to the
     screen, because routing is the screen's business and not the service's. */
  const GO: Record<TheseDaysAct['id'], () => void> = {
    listen: () => navigation.navigate('Quran', { screen: 'Audio Player', initial: false }),
    meaning: () => navigation.navigate('Quran', { screen: 'Tafsir Compare', initial: false }),
    vocabulary: () => navigation.navigate('Quran', { screen: 'Quran Vocabulary', initial: false }),
    dhikr: () => navigation.navigate('Tasbih'),
    dua: () => navigation.navigate('Library', { screen: 'Duas', initial: false })
  };

  const onFlow = stats.status === 'flow' || stats.status === 'spotting' || nifas.active;
  const dayLine = nifas.active
    ? tf(language, 'Day {n} of post-natal bleeding', { n: nifas.day })
    : stats.active
      ? tf(language, 'Day {n} of this cycle', { n: stats.dayOfCycle })
      : null;

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('These Days')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="These Days" size={87} />
      <Text style={s.dataTitle}>{T('Keeping going through these days')}</Text>
      <Text style={s.intro}>{T('Two worships are lifted in these days — the prayer and the fast — and they are lifted as a mercy, not held back as a loss. Nearly everything else you do is untouched by them: the remembrance, the listening, the study, the asking. All of it is still yours, and all of it is already here.')}</Text>

      {onFlow && (
        <View style={s.dataCard}>
          <Text style={s.dataMeta}>{T('WHERE YOU ARE')}</Text>
          <Text style={s.dataName}>{dayLine}</Text>
          <Text style={s.meta}>{T('Everything below is open to you today.')}</Text>
        </View>
      )}

      <View style={s.dataCard}>
        <Text style={s.dataBody}>{T(THESE_DAYS_ANCHOR)}</Text>
      </View>

      <Section title={T('Open to you')} />
      <View style={s.settings}>
        {THESE_DAYS_ACTS.map((act, index) => (
          <Pressable
            key={act.id}
            accessibilityRole="button"
            onPress={GO[act.id]}
            style={[s.setting, { minHeight: 76, alignItems: 'flex-start', paddingTop: 12 }, index === THESE_DAYS_ACTS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T(act.title)}</Text>
              <Text style={s.meta}>{T(act.body)}</Text>
            </View>
            {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
          </Pressable>
        ))}
      </View>

      <Section title={T('Where the scholars differ')} />
      <View style={s.dataCard}>
        {THESE_DAYS_DISPUTED.map((note, index) => (
          <View key={index} style={[s.packingRow, { alignItems: 'flex-start' }, index === THESE_DAYS_DISPUTED.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[s.dataMeta, { minWidth: 22, marginTop: 0 }]}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.dataName, { marginTop: 0 }]}>{T(note.title)}</Text>
              <Text style={s.dataBody}>{T(note.body)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Section title={T('On the streak')} />
      <View style={s.dataCard}>
        <Text style={s.dataBody}>{T('The streak on the Home tab counts days on which all five prayers were marked. In these days it rests, because the prayer itself is lifted — and a counter that measures a worship you have been excused from is measuring the wrong thing. Nothing is lost by it. These are not blank days. They are simply counted a different way.')}</Text>
      </View>

      <Section title={T('Which position this uses')} />
      <View style={s.dataCard}><Text style={s.dataBody}>{T(SCHOOL_NOTE)}</Text></View>

      <View style={s.dataCard}><Text style={s.dataBody}>{T(THESE_DAYS_ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

function WomenHubScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const { config, info } = usePrivateGate();
  const stats = cycleStats(womens);
  const nifas = nifasStats(womens);
  const qada = qadaStats(womens);
  const today = dayKey();

  if (!womens.optedIn) return <Page><ToolBar title={T('Women’s worship')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Women’s worship" size={90} />
      <Text style={s.dataTitle}>{T('A private area')}</Text>
      <Text style={s.intro}>{T('Cycle and purity records, the days after childbirth, and the fasts owed because of them — kept only on this device. Nothing is uploaded and no account is involved.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('WHAT IT HOLDS')}</Text>
        <Text style={s.dataBody}>{T('Your own cycle lengths and averages, a prediction worked out from your history rather than an assumption, purity and ghusl guidance, the post-natal days, and a running scorecard of make-up fasts.')}</Text>
        <Text style={s.dataBody}>{T('You can put a PIN in front of it, or use the face or fingerprint unlock your phone already has.')}</Text>
        <Tactile accessibilityLabel={T('Turn on the women’s area')} onPress={() => void setOptedIn(true)} style={s.primary}><Text style={s.primaryText}>{T('Turn on this area')}</Text></Tactile>
      </View>
    </ScrollView>
  </Page>;

  const status = nifas.active ? tf(language,'Post-natal · day {n}',{n:nifas.day}) : stats.status === 'flow' ? tf(language,'Cycle · day {n}',{n:stats.dayOfCycle}) : stats.status === 'spotting' ? T('Spotting') : stats.status === 'pure' ? T('Pure') : T('Nothing recorded today');
  const detail = nifas.active
    ? tf(language,'{n} days left inside the forty',{n:LIMITS.nifasMaxDays - nifas.day})
    : stats.active
      ? tf(language,'Started {d} · day {n}',{d:formatDay(stats.active.start, language),n:stats.dayOfCycle})
      : stats.nextStart
        ? tf(language,'Next cycle expected in {n} days',{n:stats.daysToNext ?? ''})
        : T('Record a cycle to see your averages');

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Women’s worship')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View style={{ flex: 1 }}><Text style={s.nextCardLabel}>{T('TODAY')} · {formatDay(today, language).toUpperCase()}</Text><Text style={s.zakatNo}>{status}</Text><Text style={s.weekScoreBody}>{detail}</Text></View>
      </LinearGradient>
      <View style={s.statGrid}>
        <StatBox label={T('AVERAGE CYCLE')} value={stats.averageCycle ? tf(language,'{n} days',{n:stats.averageCycle}) : '—'} hint={stats.averageCycle ? tf(language,'From {n} recorded cycles',{n:stats.cycleCount}) : stats.cycleCount ? T('Two cycles needed') : T('No history yet')} />
        <StatBox label={T('NEXT EXPECTED')} value={stats.nextStart ? formatDay(stats.nextStart, language) : '—'} hint={stats.daysToNext !== null ? tf(language,'In {n} days',{n:stats.daysToNext ?? ''}) : undefined} />
        <StatBox label={T('FASTS OWED')} value={`${qada.remaining}`} hint={tf(language,'{n} settled',{n:qada.done})} />
        <StatBox label={T('POST-NATAL')} value={nifas.active ? tf(language,'Day {n}',{n:nifas.day}) : '—'} hint={nifas.active ? T('Active') : T('Not recorded')} />
      </View>
      <Section title={T('Records')} />
      <View style={s.settings}>
        <PrivateRow rtl={rtl} graphic="Cycle" title={T('Cycle')} label={T('Cycle')} caption={T('Log the days, your flow, and the purity that follows')} onPress={() => navigation.navigate('Cycle')} />
        <PrivateRow rtl={rtl} graphic="Purity" title={T('Purity and ghusl')} label={T('Purity and ghusl')} caption={T('The signs of tuhr, the ghusl, and the post-natal days')} onPress={() => navigation.navigate('Library',{screen:'Purity',initial:false})} />
        <PrivateRow rtl={rtl} graphic="Qada fasts" title={T('Qada fasts')} label={T('Qada fasts')} caption={T('Every day owed, and every day settled')} onPress={() => navigation.navigate('Qada')} />
        <PrivateRow rtl={rtl} graphic="Worship guides" title={T('Worship guidance')} label={T('Worship guidance')} caption={T('What continues in these days, and the references')} onPress={() => navigation.navigate('Women Guides')} />
      </View>
      <Section title={T('Privacy')} />
      <View style={s.settings}>
        <PrivateRow rtl={rtl} graphic="Privacy lock" title={config.pinSet ? T('Lock and PIN') : T('Add a PIN')} label={config.pinSet ? 'Lock and PIN' : 'Add a PIN'} caption={config.pinSet ? (config.required ? (tf(language,'Locked · {m}PIN',{m:config.biometric && info.available ? `${info.label} or ` : ''})) : T('PIN saved, lock is off')) : info.available ? T('Face and fingerprint unlock are ready on this device') : T('This device has no biometric unlock, so a PIN is used')} onPress={() => navigation.navigate('Privacy Lock')} />
      </View>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('KEPT ON THIS DEVICE')}</Text>
        <Text style={s.dataBody}>{T('Nothing here is uploaded, backed up to an account, or used for anything else. Clearing the app data removes these records for good.')}</Text>
      </View>
    </ScrollView>
  </Page></PrivateArea>;
}

function CycleScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const stats = cycleStats(womens);
  const today = dayKey();
  const chips = recentPurity(womens, today, 14);
  const cycle = (status: PurityStatus) => (status === 'flow' ? 'spotting' : status === 'spotting' ? 'pure' : 'flow') as PurityStatus;
  const statusWord: Record<string, string> = { flow: T('Flow'), spotting: T('Spotting'), pure: T('Pure') };

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Cycle')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Cycle" size={87} />
      <Text style={s.dataTitle}>{T('Your cycle')}</Text>
      <Text style={s.intro}>{T('Record the days as they come. The averages and the prediction are worked out from your own history — nothing is assumed about what your cycle should look like.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{stats.active ? (tf(language,'IN PROGRESS · DAY {n}',{n:stats.dayOfCycle})) : T('NO CYCLE IN PROGRESS')}</Text>
        <Text style={s.dataBody}>{stats.active ? (tf(language,'Started {d}. {n} so far.',{d:formatDay(stats.active.start, language),n:`${stats.dayOfCycle} ${stats.dayOfCycle === 1 ? T('day') : T('days')}`})) : T('When bleeding begins, start a cycle here and the count begins from that day.')}</Text>
        {stats.active ? <>
          <Text style={s.preferenceLabel}>{T('FLOW')}</Text>
          <View style={s.choiceRow}>{FLOW_LEVELS.map((level) => <ChoicePill key={level.id} label={T(level.label)} selected={stats.active?.flow === level.id} onPress={() => void setFlow(level.id)} />)}</View>
          <View style={s.actionRow}>
            <Tactile accessibilityLabel={T('Mark purity today')} onPress={() => void endCycle(today)} style={s.secondary}><Text style={s.secondaryText}>{T('Mark purity today')}</Text></Tactile>
          </View>
          <Text style={s.meta}>{T('Purity ends the cycle and starts the count towards the next one.')}</Text>
        </> : <Tactile accessibilityLabel={T('Start a cycle today')} onPress={() => void startCycle(today)} style={s.primary}><Text style={s.primaryText}>{T('Start a cycle today')}</Text></Tactile>}
      </View>
      <Section title={T('Your pattern')} />
      <View style={s.statGrid}>
        <StatBox label={T('AVERAGE CYCLE')} value={stats.averageCycle ? tf(language,'{n} days',{n:stats.averageCycle}) : '—'} hint={stats.averageCycle ? T('From your last few cycles') : T('Two cycles needed')} />
        <StatBox label={T('AVERAGE LENGTH')} value={stats.averagePeriod ? tf(language,'{n} days',{n:stats.averagePeriod}) : '—'} hint={T('Bleeding days')} />
        <StatBox label={T('NEXT EXPECTED')} value={stats.nextStart ? formatDay(stats.nextStart, language) : '—'} hint={stats.daysToNext !== null ? tf(language,'In {n} days',{n:stats.daysToNext ?? ''}) : undefined} />
        <StatBox label={T('FERTILE WINDOW')} value={stats.fertileStart ? `${formatDay(stats.fertileStart, language)} – ${formatDay(stats.fertileEnd as string, language)}` : '—'} hint={T('An estimate, not a certainty')} />
      </View>
      <Section title={T('Day by day')} action={T('Tap to change')} />
      <View style={s.dataCard}>
        <View style={s.purityRow}>{chips.map((chip) => <Pressable key={chip.date} accessibilityLabel={`${formatDay(chip.date, language)}: ${chip.status ? statusWord[chip.status] : T('not recorded')}`} onPress={() => void logPurity(chip.date, chip.status ? cycle(chip.status) : 'flow')} style={[s.purityChip, chip.status === 'flow' && s.purityFlow, chip.status === 'spotting' && s.puritySpotting, chip.status === 'pure' && s.purityPure, chip.date === today && s.purityToday]}><Text style={s.purityDay}>{Number(chip.date.slice(8, 10))}</Text><Text style={s.purityLabel}>{chip.status ? statusWord[chip.status].slice(0, 3) : '—'}</Text></Pressable>)}</View>
        <Text style={s.meta}>{T('The last fourteen days. Nothing is recorded until you tap a day.')}</Text>
      </View>
      <Section title={T('History')} />
      {!womens.cycles.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('No cycles recorded yet.')}</Text></View> : <View style={s.settings}>{womens.cycles.slice(0, 12).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.start, language)}{entry.end ? ` – ${formatDay(entry.end, language)}` : (tx(language, ' · ongoing'))}</Text><Text style={s.meta}>{entry.end ? (tf(language,'{n} days',{n:daysBetween(entry.start, entry.end) + 1})) : (tf(language,'Day {n}',{n:Math.max(1, daysBetween(entry.start, today) + 1)}))} · {T(FLOW_LEVELS.find((level) => level.id === entry.flow)?.label || 'Flow')}</Text></View>
        <Tactile accessibilityLabel={T('Delete this cycle')} onPress={() => void deleteCycle(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Tactile>
      </View>)}</View>}
    </ScrollView>
  </Page></PrivateArea>;
}

/* Ghusl is not a women's subject. It is required of a man after janabah just
   as it is of a woman after hayd or nifas, so it cannot live only behind the
   women's lock — doing that would leave men with no way to read how to do it.

   The steps are the ones already used by the purity screen, taken from the
   same service rather than restated, so the two screens cannot disagree. */
function GhuslScreen({ navigation }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  return <Page><ToolBar title={T('Ghusl')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Purity" size={87} />
      <Text style={s.dataTitle}>{T('The full washing')}</Text>
      <Text style={s.intro}>{T('How to perform ghusl, with what is required of it and how the Prophet ﷺ performed it.')}</Text>

      <View style={[s.dataCard,{marginBottom:0}]}>
        <Text style={s.dataArabic}>{BISMILLAH_ARABIC}</Text>
        <Text style={s.dataMeta}>{T('THE INTENTION, IN THE HEART AND ON THE TONGUE')}</Text>
        <Text style={s.dataArabic}>{NIYYAH_ARABIC}</Text>
        <Text style={s.dataBody}>{language === 'ar' ? `${NIYYAH_ARABIC} — ${NIYYAH_TRANSLITERATION}` : `${NIYYAH_TRANSLITERATION} — ${T(NIYYAH_MEANING)}`}</Text>
      </View>

      <Section title={T('What is required')} />
      <View style={s.settings}>{GHUSL_FARD.map((step, index) => (
        <View key={step} style={s.setting}>
          <View style={s.stepNo}><Text style={s.stepNoText}>{index + 1}</Text></View>
          <Text style={[s.guideStepText, { flex: 1 }]}>{T(step)}</Text>
        </View>))}
      </View>

      <Section title={T('As the Prophet ﷺ performed it')} />
      <View style={s.settings}>{GHUSL_SUNNAH.map((step, index) => (
        <View key={step} style={s.setting}>
          <View style={s.stepNo}><Text style={s.stepNoText}>{index + 1}</Text></View>
          <Text style={[s.guideStepText, { flex: 1 }]}>{T(step)}</Text>
        </View>))}
      </View>

      <View style={[s.dataCard,{marginTop:20}]}>
        <Text style={s.dataMeta}>{T('BEFORE YOU RELY ON ANY OF THIS')}</Text>
        <Text style={s.dataBody}>{T(ADVISORY)}</Text>
      </View>
    </ScrollView></Page>;
}

function PurityScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const ar = language === 'ar';
  const womens = useWomens();
  const nifas = nifasStats(womens);
  const [verse, setVerse] = useState<{ arabic: string; english: string } | null>(null);
  const [verseError, setVerseError] = useState('');
  const load = () => getAyahEditions('2:222', ['quran-uthmani', 'en.sahih']).then((rows) => {
    setVerse({ arabic: rows[0]?.text || '', english: rows[1]?.text || '' });
    setVerseError('');
  }).catch((error: any) => setVerseError(error?.message || T('The verse could not be loaded.')));
  useEffect(() => { void load(); }, []);

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Purity and ghusl')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Purity" size={87} />
      <Text style={s.dataTitle}>{T('Purity and ghusl')}</Text>
      <Text style={s.intro}>{T('What ends the bleeding, the washing that follows it, and the days after childbirth. The well-known positions are described here; the ruling for your case belongs with a scholar you trust.')}</Text>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View style={{ flex: 1 }}>
          <Text style={s.nextCardLabel}>{nifas.active ? T('POST-NATAL') : T('NIFAS NOT RECORDED')}</Text>
          <Text style={s.zakatNo}>{nifas.active ? tf(language,'Day {n}',{n:nifas.day}) : '—'}</Text>
          <Text style={s.weekScoreBody}>{nifas.active ? (nifas.pastLimit ? T('Past forty days — speak to a scholar and a doctor') : tf(language,'{n} days remain inside the forty',{n:nifas.remaining})) : (tf(language,'Bleeding after childbirth is commonly counted up to {n} days.',{n:LIMITS.nifasMaxDays}))}</Text>
        </View>
      </LinearGradient>
      <View style={s.dataCard}>
        {nifas.active ? <>
          <Text style={s.dataMeta}>{tx(language, 'STARTED')} {formatDay(nifas.active.start, language)}</Text>
          <View style={s.actionRow}>
            <Tactile accessibilityLabel={T('I am pure now')} onPress={() => void endNifas(dayKey())} style={s.primary}><Text style={s.primaryText}>{T('I am pure now')}</Text></Tactile>
          </View>
        </> : <>
          <Text style={s.dataBody}>{T('Record the birth when it happens and the counter follows the days. Purity is marked the day the bleeding stops.')}</Text>
          <Tactile accessibilityLabel={T('Record a birth')} onPress={() => void startNifas(dayKey())} style={s.primary}><Text style={s.primaryText}>{T('Record a birth today')}</Text></Tactile>
        </>}
      </View>
      {!!womens.nifas.filter((entry) => entry.end).length && <><Section title={T('Earlier births')} /><View style={s.settings}>{womens.nifas.filter((entry) => entry.end).slice(0, 6).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.start, language)} – {formatDay(entry.end as string, language)}</Text><Text style={s.meta}>{ar?`${daysBetween(entry.start, entry.end as string) + 1} ${arNoun(daysBetween(entry.start, entry.end as string) + 1, 'يوم', 'يومان', 'أيام', 'يومًا')}`:tf(language,'{n} days',{n:daysBetween(entry.start, entry.end as string) + 1})}</Text></View>
        <Tactile accessibilityLabel={T('Delete this record')} onPress={() => void deleteNifas(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Tactile>
      </View>)}</View></>}
      <Section title={T('The verse on menstruation')} action={T('Quran 2:222')} />
      {verseError ? <ErrorState message={verseError} retry={load} /> : !verse ? <SkeletonParagraph lines={3} /> : <View style={s.dataCard}>
        <Text style={s.dataArabic}>{verse.arabic}</Text>
        <Text style={s.dataBody}>{verse.english}</Text>
      </View>}
      <Section title={T('Signs that bleeding has ended')} />
      <View style={s.settings}>{TUHR_SIGNS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('The ghusl')} />
      <Tactile accessibilityRole="button" onPress={() => navigation.navigate('Ghusl')} style={s.dataCard}>
        <Text style={s.settingName}>{T('How to perform ghusl')}</Text>
        <Text style={s.dataBody}>{T('What is required of the washing, and how the Prophet ﷺ performed it.')}</Text>
      </Tactile>

      <Section title={T('Hayd, nifas and istihadha')} />
      <View style={s.settings}>{EXPLANATIONS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('BEFORE YOU RELY ON ANY OF THIS')}</Text><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

function QadaScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const womens = useWomens();
  const qada = qadaStats(womens);
  const [date, setDate] = useState(dayKey());
  const [reason, setReason] = useState<QadaReason>('menstruation');
  const owed = womens.qada.filter((entry) => !entry.done);
  const settled = womens.qada.filter((entry) => entry.done);

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Qada fasts')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Qada fasts" size={87} />
      <Text style={s.dataTitle}>{T('Days owed')}</Text>
      <Text style={s.intro}>{T('Fast days missed through menstruation or the post-natal days are made up one for one, before the next Ramadan. This is the running count.')}</Text>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View><Text style={s.nextCardLabel}>{T('STILL OWED')}</Text><Text style={s.zakatNo}>{qada.remaining}</Text><Text style={s.weekScoreBody}>{qada.total} {tx(language, 'recorded in total')}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={s.nextCardLabel}>{T('SETTLED')}</Text><Text style={s.zakatNo}>{qada.done}</Text><Text style={s.weekScoreBody}>{qada.percent}% {tx(language, 'complete')}</Text></View>
      </LinearGradient>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${qada.percent}%` } as any]} /></View>
      <Section title={T('Add a missed day')} />
      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{T('THE DAY THAT WAS MISSED')}</Text>
        <View style={s.dayStepper}>
          <Tactile accessibilityLabel={T('One day earlier')} onPress={() => setDate((value) => addDays(value, -1))} style={s.stepButton}>{ico(rtl ? 'arrow-forward' : 'arrow-back', 19, C.green)}</Tactile>
          <View style={{ flex: 1, alignItems: 'center' }}><Text style={s.settingName}>{formatLongDay(date, language)}</Text><Text style={s.meta}>{date}</Text></View>
          <Tactile accessibilityLabel={T('One day later')} onPress={() => setDate((value) => addDays(value, 1))} style={s.stepButton}>{ico(rtl ? 'arrow-back' : 'arrow-forward', 19, C.green)}</Tactile>
        </View>
        <Text style={s.preferenceLabel}>{T('WHY IT WAS MISSED')}</Text>
        <View style={s.choiceGrid}>{QADA_REASONS.map((item) => <ChoicePill key={item.id} label={T(item.label)} selected={reason === item.id} onPress={() => setReason(item.id)} />)}</View>
        <Tactile accessibilityLabel={T('Add this day to the ledger')} onPress={() => void addQada(date, reason)} style={s.primary}><Text style={s.primaryText}>{T('Add this day')}</Text></Tactile>
      </View>
      <Section title={T('Still owed')} action={`${owed.length}`} />
      {!owed.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('Nothing outstanding. Every recorded day has been settled.')}</Text></View> : <View style={s.settings}>{owed.map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <Pressable accessibilityLabel={`${T('Mark as settled')} ${formatDay(entry.date, language)}`} onPress={() => void toggleQada(entry.id)} style={s.stepCheck}>{entry.done ? ico('checkmark', 22, C.green) : null}</Pressable>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.date, language)}</Text><Text style={s.meta}>{T(QADA_REASONS.find((item) => item.id === entry.reason)?.label ?? '')}</Text></View>
        <Tactile accessibilityLabel={T('Delete this entry')} onPress={() => void deleteQada(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Tactile>
      </View>)}</View>}
      {!!settled.length && <><Section title={T('Settled')} action={`${settled.length}`} /><View style={s.settings}>{settled.slice(0, 20).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <Pressable accessibilityLabel={`${T('Reopen')} ${formatDay(entry.date, language)}`} onPress={() => void toggleQada(entry.id)} style={[s.stepCheck, s.stepCheckDone]}>{ico('checkmark', 22, C.white)}</Pressable>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.date, language)}</Text><Text style={s.meta}>{tf(language,'Made up on {d}',{d:entry.doneOn ? formatDay(entry.doneOn, language) : '—'})}</Text></View>
        <Tactile accessibilityLabel={T('Delete this entry')} onPress={() => void deleteQada(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Tactile>
      </View>)}</View></>}
    </ScrollView>
  </Page></PrivateArea>;
}

/**
 * Khatam — how many times the Qur'an has been finished, and how far the
 * reading in progress has got.
 *
 * Progress is counted in pages because that is the shape of the book: the
 * Madinah Mushaf is 604 pages, and a sitting is measured in pages, not in
 * verses. Marking a page here is the same marking the reader makes as you
 * turn the page, so the two never disagree.
 *
 * Reaching the last page closes the reading by itself. It is filed in the
 * history below and a fresh one begins, so the count of completed readings
 * only ever goes up.
 */
function KhatamScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const khatam = useKhatam();
  const summary = khatamSummary(khatam);
  const [pageText, setPageText] = useState('');
  const [message, setMessage] = useState('');

  const submit = () => {
    const page = Math.round(Number(pageText));
    if (!Number.isFinite(page) || page < 1 || page > TOTAL_PAGES) {
      setMessage(tf(language,'Enter a page between 1 and {n}',{n:TOTAL_PAGES}));
      return;
    }
    void markPageRead(page);
    setMessage(tf(language,'Page {p} marked as read',{p:page}));
    setPageText('');
  };

  return (
    <Page>
      <ToolBar title={T('Khatam')} navigation={navigation} />
      <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <ToolGraphic tool="Khatam" size={87} />
        <Text style={s.dataTitle}>{T("Completing the Qur'an")}</Text>
        <Text style={s.intro}>{T('A reading is counted in pages, the way the Mushaf is printed — 604 of them. Mark the pages you have reached and the rest is worked out here, on your device.')}</Text>

        <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
          <View>
            <Text style={s.nextCardLabel}>{T('COMPLETED')}</Text>
            <Text style={s.zakatNo}>{summary.completed}</Text>
            <Text style={s.weekScoreBody}>{summary.completed === 1 ? T('reading') : T('readings')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.nextCardLabel}>{T('THIS READING')}</Text>
            <Text style={s.zakatNo}>{summary.read}/{summary.total}</Text>
            <Text style={s.weekScoreBody}>{summary.percent}% · {summary.remaining} {T('to go')}</Text>
          </View>
        </LinearGradient>
        <View style={s.progressTrack}><View style={[s.progressFill, { width: `${summary.percent}%` } as any]} /></View>

        <Section title={T('Mark pages read')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('A PAGE YOU HAVE REACHED')}</Text>
          <TextInput
            style={s.searchInput}
            value={pageText}
            onChangeText={setPageText}
            keyboardType="number-pad"
            placeholder={tx(language, 'Page number')}
            placeholderTextColor={C.muted}
            maxLength={3}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          {!!message && <Text style={s.meta}>{message}</Text>}
          <View style={s.actionRow}>
            <Tactile onPress={submit} style={s.primary}><Text style={s.primaryText}>{T('Mark as read')}</Text></Tactile>
          </View>
        </View>

        {summary.read > 0 && (
          <>
            <Section title={T('Pages reached')} />
            <View style={s.dataCard}>
              <Text style={s.preferenceLabel}>{`${summary.read} ${T('OF')} ${summary.total} ${T('PAGES')}`}</Text>
              <View style={s.memChipWrap}>
                {khatam.readPages.slice().sort((a, b) => a - b).slice(-40).map((page) => (
                  <Pressable key={page} onPress={() => void unmarkPage(page)} style={s.memChip}>
                    <Text style={s.memChipText}>{page}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={s.meta}>{T('Tap a page to take it back. The most recent forty are shown.')}</Text>
            </View>
          </>
        )}

        <Section title={T('This reading')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('BEGAN')}</Text>
          <Text style={s.settingName}>{new Date(summary.startedAt).toLocaleDateString()}</Text>
          <Text style={s.meta}>{summary.daysElapsed} {T('days so far')}</Text>
          <View style={s.actionRow}>
            <Tactile onPress={() => void completeKhatamCycle()} style={s.secondary}><Text style={s.secondaryText}>{T('Finish this reading')}</Text></Tactile>
            <Tactile onPress={() => void resetKhatamCycle()} style={s.dangerButton}><Text style={s.dangerText}>{T('Start over')}</Text></Tactile>
          </View>
          <Text style={s.meta}>{T('"Finish this reading" files it as complete and begins the next one — for a reading finished before you installed the app.')}</Text>
        </View>

        {khatam.cycles.length > 0 && (
          <>
            <Section title={T('Completed readings')} />
            <View style={s.settings}>
              {khatam.cycles.slice().reverse().map((cycle, index) => (
                <View key={cycle.id} style={s.translationRow}>
                  <View style={s.surahNum}><Text style={s.surahNumText}>{khatam.cycles.length - index}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.settingName}>{new Date(cycle.completedAt).toLocaleDateString()}</Text>
                    <Text style={s.meta}>{Math.max(1, Math.ceil((cycle.completedAt - cycle.startedAt) / 86400000))} {T('days')}</Text>
                  </View>
                  <Pressable onPress={() => void removeKhatamCycle(cycle.id)}>{ico('trash-outline', 18, C.muted)}</Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </Page>
  );
}

/**
 * Qada — the prayers still owed, and the pace for clearing them.
 *
 * Deliberately plain. Missing a prayer happens: you slept, you travelled, you
 * were unwell. What is owed is a debt, not a verdict, so this reads like a
 * ledger rather than a scoreboard — what is outstanding, what is settled, and
 * how long it will take at a pace you can actually keep.
 */
function QadaPrayerScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const qada = useQada();
  const summary = qadaSummary(qada);
  const outstanding = qada.entries.filter((entry) => !entry.clearedAt);

  return (
    <Page>
      <ToolBar title={T('Qada prayers')} navigation={navigation} />
      <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <ToolGraphic tool="Qada Prayer" size={87} />
        <Text style={s.dataTitle}>{T('Prayers to make up')}</Text>
        <Text style={s.intro}>{T('A missed prayer is made up on its own, in its own time. This is a private ledger of what is outstanding — it is not sent anywhere and no one else sees it.')}</Text>

        <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
          <View>
            <Text style={s.nextCardLabel}>{T('OUTSTANDING')}</Text>
            <Text style={s.zakatNo}>{summary.outstanding}</Text>
            <Text style={s.weekScoreBody}>
              {summary.outstanding && summary.oldestOutstanding
                ? `${T('since')} ${new Date(summary.oldestOutstanding).toLocaleDateString()}`
                : T('nothing owed')}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.nextCardLabel}>{T('MADE UP')}</Text>
            <Text style={s.zakatNo}>{summary.cleared}</Text>
            <Text style={s.weekScoreBody}>
              {summary.etaDays ? `~${summary.etaDays} ${summary.etaDays === 1 ? T('day') : T('days')}` : '—'}
            </Text>
          </View>
        </LinearGradient>

        <Section title={T('Log a missed prayer')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('WHICH PRAYER')}</Text>
          <View style={s.memChipWrap}>
            {QADA_PRAYERS.map((prayer) => (
              <Tactile key={prayer} onPress={() => void logMissedPrayer(prayer)} style={s.memChip}>
                <Text style={s.memChipText}>{T(prayer)}</Text>
              </Tactile>
            ))}
          </View>
          <Text style={s.meta}>{T('Logged against today. One tap per prayer missed.')}</Text>
        </View>

        <Section title={T('Daily pace')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('MADE UP PER DAY')}</Text>
          <View style={s.memChipWrap}>
            {[1, 2, 3, 5].map((goal) => (
              <ChoicePill key={goal} label={String(goal)} selected={qada.dailyGoal === goal} onPress={() => void setQadaDailyGoal(goal)} />
            ))}
          </View>
          <Text style={s.meta}>{T('One a day is enough for most people. The pace only sets the estimate above — nothing is scheduled for you.')}</Text>
        </View>

        <Section title={T('Outstanding')} />
        {!outstanding.length ? (
          <View style={s.dataCard}>
            <Text style={s.emptyTitle}>{T('Nothing outstanding')}</Text>
            <Text style={s.meta}>{T('Every prayer you logged here has been made up.')}</Text>
          </View>
        ) : (
          <View style={s.settings}>
            {outstanding.slice(0, 60).map((entry) => (
              <View key={entry.id} style={s.translationRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.settingName}>{T(entry.prayer)}</Text>
                  <Text style={s.meta}>{new Date(entry.dateKey).toLocaleDateString()}</Text>
                </View>
                <Pressable onPress={() => void clearQadaEntry(entry.id)} accessibilityLabel={T('Made up')}>
                  {ico('checkmark-circle-outline', 22, C.green)}
                </Pressable>
              </View>
            ))}
            {outstanding.length > 60 && (
              <Text style={s.meta}>{`+${outstanding.length - 60} ${T('more')}`}</Text>
            )}
          </View>
        )}

        {!!qada.entries.length && (
          <>
            <Section title={T('Settled')} />
            <View style={s.settings}>
              {qada.entries.filter((entry) => entry.clearedAt).slice(-20).reverse().map((entry) => (
                <View key={entry.id} style={s.translationRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.settingName}>{T(entry.prayer)}</Text>
                    <Text style={s.meta}>{entry.clearedAt ? new Date(entry.clearedAt).toLocaleDateString() : ''}</Text>
                  </View>
                  <Pressable onPress={() => void reopenQadaEntry(entry.id)}>{ico('arrow-undo-outline', 18, C.muted)}</Pressable>
                  <Pressable onPress={() => void removeQadaEntry(entry.id)}>{ico('trash-outline', 18, C.muted)}</Pressable>
                </View>
              ))}
            </View>
            <View style={s.actionRow}>
              <Tactile onPress={() => void resetQada()} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear the ledger')}</Text></Tactile>
            </View>
          </>
        )}
      </ScrollView>
    </Page>
  );
}

/**
 * Sadaqah — voluntary giving, kept privately.
 *
 * Zakat is an obligation with an arithmetic behind it and has its own screen.
 * This is the other half: whatever you gave because you wanted to. No nisab,
 * no rate, no threshold — just what, when, and what it came to.
 *
 * Amounts are never converted between currencies. A gift given in one currency
 * stays in that currency, because that is what it actually was.
 */
function SadaqahScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const sadaqah = useSadaqah();
  const summary = sadaqahSummary(sadaqah);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const give = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setMessage(tx(language, 'Enter an amount greater than zero'));
      return;
    }
    void logSadaqah(value, note);
    setAmount('');
    setNote('');
    setMessage(tx(language, 'Recorded'));
  };

  return (
    <Page>
      <ToolBar title={T('Sadaqah')} navigation={navigation} />
      <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <ToolGraphic tool="Sadaqah" size={87} />
        <Text style={s.dataTitle}>{T('Voluntary giving')}</Text>
        <Text style={s.intro}>{T('Zakat is what is owed and has its own calculation. This is what you gave because you wanted to. Nothing here is sent anywhere.')}</Text>

        <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
          <View>
            <Text style={s.nextCardLabel}>{T('GIVEN')}</Text>
            <Text style={s.zakatNo}>{formatSadaqah(summary.total, sadaqah.currency)}</Text>
            <Text style={s.weekScoreBody}>{summary.count} {summary.count === 1 ? T('gift') : T('gifts')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.nextCardLabel}>{T('THIS MONTH')}</Text>
            <Text style={s.zakatNo}>{formatSadaqah(summary.thisMonth, sadaqah.currency)}</Text>
            <Text style={s.weekScoreBody}>{T('this year')} {formatSadaqah(summary.thisYear, sadaqah.currency)}</Text>
          </View>
        </LinearGradient>

        <Section title={T('Record a gift')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('AMOUNT')}</Text>
          <TextInput
            style={s.searchInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={C.muted}
            returnKeyType="done"
          />
          <Text style={s.preferenceLabel}>{T('WHAT IT WAS FOR (OPTIONAL)')}</Text>
          <TextInput
            style={s.searchInput}
            value={note}
            onChangeText={setNote}
            placeholder={T('Water, a neighbour, a mosque…')}
            placeholderTextColor={C.muted}
            returnKeyType="done"
          />
          {!!message && <Text style={s.meta}>{message}</Text>}
          <View style={s.actionRow}>
            <Tactile onPress={give} style={s.primary}><Text style={s.primaryText}>{T('Record')}</Text></Tactile>
          </View>
        </View>

        <Section title={T('Currency')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('RECORDED IN')}</Text>
          <View style={s.memChipWrap}>
            {['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR', 'INR', 'TRY', 'MYR', 'IDR'].map((code) => (
              <ChoicePill key={code} label={code} selected={sadaqah.currency === code} onPress={() => void setSadaqahCurrency(code)} />
            ))}
          </View>
          <Text style={s.meta}>{T('Only changes what new entries are recorded in — past gifts keep the currency they were given in.')}</Text>
        </View>

        {!!sadaqah.entries.length && (
          <>
            <Section title={T('Given')} />
            <View style={s.settings}>
              {sadaqah.entries.slice().reverse().slice(0, 60).map((entry) => (
                <View key={entry.id} style={s.translationRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.settingName}>{formatSadaqah(entry.amount, entry.currency)}</Text>
                    <Text style={s.meta}>{entry.note ? `${entry.note} · ` : ''}{new Date(entry.dateKey).toLocaleDateString()}</Text>
                  </View>
                  <Pressable onPress={() => void removeSadaqah(entry.id)}>{ico('trash-outline', 18, C.muted)}</Pressable>
                </View>
              ))}
            </View>
            <View style={s.actionRow}>
              <Tactile onPress={() => void resetSadaqah()} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear the record')}</Text></Tactile>
            </View>
          </>
        )}
      </ScrollView>
    </Page>
  );
}

/**
 * A private journal.
 *
 * Deliberately has no streak, no target and no reminder. The verse notes are
 * tied to an ayah and belong to it; this belongs only to the day it was
 * written on. Counting days would turn reflection into a task, and a task is
 * the one thing it should not be.
 */
function JournalScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const journal = useJournal();
  const summary = journalSummary(journal);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const save = () => {
    if (!text.trim()) return;
    void saveJournalEntry(text, editing || undefined);
    setText('');
    setEditing(null);
  };

  const startEdit = (id: string, body: string) => {
    setEditing(id);
    setText(body);
  };

  return (
    <Page>
      <ToolBar title={T('Journal')} navigation={navigation} />
      <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <ToolGraphic tool="Journal" size={87} />
        <Text style={s.dataTitle}>{T('A private journal')}</Text>
        <Text style={s.intro}>{T('Not notes on a verse — those live beside the ayah they belong to. This is only for you and the day you are in. Nothing is shared, and there is no streak to keep.')}</Text>

        <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
          <View>
            <Text style={s.nextCardLabel}>{T('ENTRIES')}</Text>
            <Text style={s.zakatNo}>{summary.count}</Text>
            <Text style={s.weekScoreBody}>{summary.days} {summary.days === 1 ? T('day') : T('days')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.nextCardLabel}>{T('LAST WRITTEN')}</Text>
            <Text style={s.zakatNo}>{summary.lastAt ? new Date(summary.lastAt).toLocaleDateString() : '—'}</Text>
            <Text style={s.weekScoreBody}>{T('on this device')}</Text>
          </View>
        </LinearGradient>

        <Section title={editing ? T('Edit the entry') : T('Write')} />
        <View style={s.dataCard}>
          <TextInput
            style={s.noteInput}
            value={text}
            onChangeText={setText}
            multiline
            placeholder={T('Write a private reflection…')}
            placeholderTextColor={C.muted}
          />
          <View style={s.actionRow}>
            <Tactile onPress={save} style={s.primary}><Text style={s.primaryText}>{editing ? T('Save changes') : T('Save entry')}</Text></Tactile>
            {!!editing && (
              <Tactile onPress={() => { setEditing(null); setText(''); }} style={s.secondary}><Text style={s.secondaryText}>{T('Cancel')}</Text></Tactile>
            )}
          </View>
        </View>

        {!!journal.entries.length && (
          <>
            <Section title={T('Entries')} />
            <View style={s.settings}>
              {journal.entries.map((entry) => (
                <View key={entry.id} style={s.dataCard}>
                  <Text style={s.meta}>{new Date(entry.dateKey).toLocaleDateString()}</Text>
                  <Text style={s.noteText}>{entry.text}</Text>
                  <View style={s.actionRow}>
                    <Tactile onPress={() => startEdit(entry.id, entry.text)} style={s.secondary}>{ico('create-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Edit')}</Text></Tactile>
                    <Tactile onPress={() => void removeJournalEntry(entry.id)} style={s.dangerButton}>{ico('trash-outline', 16, C.danger)}<Text style={s.dangerText}>{T('Delete')}</Text></Tactile>
                  </View>
                </View>
              ))}
            </View>
            <View style={s.actionRow}>
              <Tactile onPress={() => void resetJournal()} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear the journal')}</Text></Tactile>
            </View>
          </>
        )}
      </ScrollView>
    </Page>
  );
}

function WomenGuidesScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Worship guidance')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Worship guides" size={87} />
      <Text style={s.dataTitle}>{T('Worship in these days')}</Text>
      <Text style={s.intro}>{T('What is lifted, what continues, and what is owed afterwards. These are the well-known positions, described plainly — the ruling for your situation belongs with a scholar you trust.')}</Text>
      <Section title={T('The acts of worship')} />
      <View style={s.settings}>{WORSHIP_GUIDANCE.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('The terms')} />
      <View style={s.settings}>{EXPLANATIONS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('References')} />
      <View style={s.settings}>{REFERENCES.map((reference) => <View key={reference} style={s.setting}><ToolGraphic tool="Quran" size={31} /><Text style={[s.settingName, { flex: 1, marginHorizontal: 12 }]}>{T(reference)}</Text></View>)}</View>
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('AND SEE A DOCTOR')}</Text><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

function PrivacyLockScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const { config, info } = usePrivateGate();
  const [stage, setStage] = useState<'idle' | 'create' | 'confirm'>('idle');
  const [draft, setDraft] = useState('');
  const [first, setFirst] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const finish = async (value: string) => {
    await setPin(value);
    haptic();
    setStage('idle');
    setDraft('');
    setFirst('');
    setError('');
    setNote('Your PIN is saved on this device.');
  };
  const digit = async (value: string) => {
    haptic();
    setNote('');
    if (stage === 'idle') return;
    const next = (draft + value).slice(0, 4);
    setDraft(next);
    setError('');
    if (next.length < 4) return;
    if (stage === 'create') { setFirst(next); setDraft(''); setStage('confirm'); return; }
    if (next === first) await finish(next);
    else { haptic('error'); setError(T('Those did not match. Start again.')); setDraft(''); setFirst(''); setStage('create'); }
  };

  if (stage !== 'idle') return <Page><ToolBar title={T('Private')} navigation={navigation} />
    <View style={s.pinPageBare}>
      <ToolGraphic tool="Privacy lock" size={87} />
      <Text style={s.dataTitle}>{stage === 'create' ? T('Choose a PIN') : T('Confirm it')}</Text>
      <Text style={s.intro}>{T('Four digits. There is no reset link and no recovery email — this code lives on this device only, so choose one you will remember.')}</Text>
      <PinDots filled={draft.length} error={!!error} />
      <Text style={[s.pinHint, !!error && s.pinHintError]}>{error || (stage === 'create' ? T('Enter four digits') : T('Enter the same four digits'))}</Text>
      <PinKeypad onDigit={digit} onDelete={() => { setDraft((value) => value.slice(0, -1)); setError(''); }} biometric={info} />
      <Tactile accessibilityLabel={T('Cancel')} onPress={() => { setStage('idle'); setDraft(''); setFirst(''); setError(''); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Cancel')}</Text></Tactile>
    </View>
  </Page>;

  return <Page><ToolBar title={T('Lock and PIN')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Privacy lock" size={87} />
      <Text style={s.dataTitle}>{T('Private by default')}</Text>
      <Text style={s.intro}>{T('The women’s screens can be put behind a gate. The PIN is stored as a salted digest, never as the digits themselves, and the face or fingerprint scan is handled entirely by your phone — this app is only told yes or no.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('THE PIN')}</Text>
        <Text style={s.dataBody}>{config.pinSet ? T('A PIN is saved on this device.') : T('No PIN yet. Choose one to switch the lock on.')}</Text>
        <View style={s.actionRow}>
          <Tactile accessibilityLabel={config.pinSet ? 'Change the PIN' : 'Set a PIN'} onPress={() => { setStage('create'); setDraft(''); setFirst(''); setError(''); setNote(''); }} style={s.primary}><Text style={s.primaryText}>{config.pinSet ? T('Change PIN') : T('Set a PIN')}</Text></Tactile>
          {config.pinSet && <Tactile accessibilityLabel={T('Remove the PIN')} onPress={() => void removePin().then(() => setNote(T('The PIN and the lock were removed.')))} style={s.secondary}><Text style={s.secondaryText}>{T('Remove PIN')}</Text></Tactile>}
        </View>
        {!!note && <Text style={s.dataMeta}>{T(note).toUpperCase()}</Text>}
      </View>
      {config.pinSet && <>
        <Section title={T('The gate')} />
        <View style={s.settings}>
          <View style={[s.setting, ]}>
            <ToolGraphic tool="Privacy lock" size={49} />
            <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{T('Lock the women’s area')}</Text><Text style={s.meta}>{T('Ask for the PIN whenever these screens are opened')}</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch accessibilityLabel={T('Lock the women’s area')} value={config.required} onValueChange={(value) => void updateLockSettings({ required: value })} trackColor={{ true: C.green }} /></View>
          </View>
          <View style={[s.setting, ]}>
            <ToolGraphic tool="Biometric Unlock" size={49} />
            <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{info.available ? tf(language, 'Use {name}', { name: info.label }) : T('Biometric unlock')}</Text><Text style={s.meta}>{info.available ? (info.enrolled ? T('Set up on this device') : T('Not enrolled on this device yet')) : T('This device cannot use face or fingerprint unlock, so the PIN is used')}</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch accessibilityLabel={T('Use biometric unlock')} disabled={!info.available} value={config.biometric && info.available} onValueChange={(value) => void updateLockSettings({ biometric: value })} trackColor={{ true: C.green }} /></View>
          </View>
        </View>
        <Section title={T('Lock again')} />
        <View style={s.dataCard}>
          <Text style={s.preferenceLabel}>{T('WHEN THE APP IS PUT AWAY')}</Text>
          <View style={s.choiceGrid}>{RELOCK_OPTIONS.map((option) => <ChoicePill key={option.minutes} label={T(option.label)} selected={config.relockMinutes === option.minutes} onPress={() => void updateLockSettings({ relockMinutes: option.minutes })} />)}</View>
          <Text style={s.meta}>{T('Choosing “Immediately” closes the gate the moment the app moves to the background.')}</Text>
        </View>
      </>}
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('IF THE PIN IS FORGOTTEN')}</Text><Text style={s.dataBody}>{T('There is no recovery by design — no email, no account, no server that could hand it over. Removing the app clears the records along with the code, which is the only way back in.')}</Text></View>
    </ScrollView>
  </Page>;
}

/* ==================== Phase 4 · Zakat ==================== */

/**
 * Working out Zakat means a lot of numbers on one screen. Each block closes,
 * and its header keeps whatever the old `action` showed, so a closed block
 * still tells you its answer (the currency, the nisab, the amount due).
 * The blocks you only set once start out of the way.
 */
function ZakatSection({ title, action, open, onToggle, children }: any) {
  const { rtl , language }=useLanguage();
  return <View>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }}
      accessibilityLabel={`${title}, ${open ? 'open' : 'closed'}`}
      onPress={onToggle} style={s.zHead}>
      <Text style={s.zHeadTitle}>{title}</Text>
      <View style={s.zHeadRight}>
        {!!action && <Text style={s.zHeadAction}>{action}</Text>}
        {ico(open ? 'chevron-down' : (rtl ? 'chevron-back' : 'chevron-forward'), 16, C.muted)}
      </View>
    </Pressable>
    {open && <View style={s.zBody}>{children}</View>}
  </View>;
}

function ZakatScreen({ navigation }: any) {
  const [zOpen, setZOpen] = useState<Record<string, boolean>>({
    own: true, nisab: true, result: true,
  });
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(language, text);
  const zakat = useZakat();
  const market = useMarket();
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState('');
  const result = computeZakat(zakat);
  const live = livePrices(zakat.currency);
  const fresh = marketIsFresh();
  /* Asked once, so every figure below can refuse to answer rather than answer
     from a price that never arrived. */
  const havePrices = pricesAvailable(zakat);
  const symbol = currencySymbol(zakat.currency);

  const refresh = async () => {
    setRefreshing(true);
    await refreshMarket();
    setRefreshing(false);
  };
  useEffect(() => {
    if (!market.fetchedAt) void refresh();
  }, []);

  const metalPrice = (metal: 'gold' | 'silver') => (metal === 'gold' ? result.goldPerGram : result.silverPerGram);

  return <Page><ToolBar title={T('Zakat')} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Zakat" size={87} />
      <Text style={s.dataTitle}>{T('Work out what is due')}</Text>
      <Text style={s.intro}>{T('List what you own, subtract what falls due, and compare what is left with the nisab. Prices and exchange rates are fetched live where they are reachable and kept on this device when they are not. This is arithmetic, not a ruling — take the details to a scholar.')}</Text>

      <ZakatSection title={T('Currency')} action={zakat.currency} open={zOpen.currency === true} onToggle={() => setZOpen((prev) => ({ ...prev, currency: prev.currency !== true }))}>
      <View style={s.preferencePanel}>
        <View style={s.choiceGrid}>{CURRENCIES.map((currency) => <ChoicePill key={currency.code} label={currency.code} selected={zakat.currency === currency.code} onPress={() => void setCurrency(currency.code)} />)}</View>
        <Text style={s.meta}>{T(CURRENCIES.find((item) => item.code === zakat.currency)?.name ?? zakat.currency)} · {T('every figure below is shown in it.')}</Text>
      </View>

     
      </ZakatSection> <ZakatSection title={T('What you own')} open={zOpen.own === true} onToggle={() => setZOpen((prev) => ({ ...prev, own: prev.own !== true }))}>
      <View style={s.settings}>
        {zakat.assets.map((asset) => <View key={asset.id} style={[s.assetRow, ]}>
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Text style={s.settingName}>{T(asset.label)}</Text>
            {asset.kind === 'gold' || asset.kind === 'silver' ? <Text style={s.meta}>{`${Number(asset.amount) || 0} ${tx(language, 'g')}`} {tx(language, 'at')} {havePrices ? formatMoney(metalPrice(asset.kind), zakat.currency) : '—'} {tx(language, 'per gram')}</Text> : <Text style={s.meta}>{asset.kind === 'cash' || asset.kind === 'bank' ? T('Balances on the day of your Zakat') : T('Market value today')}</Text>}
          </View>
          <TextInput accessibilityLabel={`${T('Amount of')} ${asset.label}`} keyboardType="numeric" value={asset.amount ? String(asset.amount) : ''} onChangeText={(value) => void setAssetAmount(asset.id, Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>)}
      </View>

     
      </ZakatSection> <ZakatSection title={T('What falls due')} open={zOpen.due === true} onToggle={() => setZOpen((prev) => ({ ...prev, due: prev.due !== true }))}>
      <View style={s.settings}>
        {zakat.liabilities.map((item) => <View key={item.id} style={[s.assetRow, ]}>
          <View style={{ flex: 1, marginHorizontal: 4 }}><Text style={s.settingName}>{T(item.label)}</Text><Text style={s.meta}>{T('Subtracted from the total above')}</Text></View>
          <TextInput accessibilityLabel={`${T('Amount of')} ${item.label}`} keyboardType="numeric" value={item.amount ? String(item.amount) : ''} onChangeText={(value) => void setLiabilityAmount(item.id, Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>)}
      </View>

     
      </ZakatSection> <ZakatSection title={T('Gold and silver prices')} open={zOpen.metals === true} onToggle={() => setZOpen((prev) => ({ ...prev, metals: prev.metals !== true }))}>
      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{tx(language, 'PER GRAM, IN ')}{zakat.currency}</Text>
        <View style={[s.metalRow, ]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Gold')}</Text><Text style={s.meta}>{tf(language,'Nisab is {n} grams',{n:NISAB_GOLD_GRAMS})}</Text></View>
          <TextInput accessibilityLabel={T('Gold price per gram')} keyboardType="numeric" value={result.goldPerGram ? String(Number(result.goldPerGram.toFixed(2))) : ''} onChangeText={(value) => void setMetalPrice('gold', Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>
        <View style={[s.metalRow, ]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Silver')}</Text><Text style={s.meta}>{tf(language,'Nisab is {n} grams',{n:NISAB_SILVER_GRAMS})}</Text></View>
          <TextInput accessibilityLabel={T('Silver price per gram')} keyboardType="numeric" value={result.silverPerGram ? String(Number(result.silverPerGram.toFixed(2))) : ''} onChangeText={(value) => void setMetalPrice('silver', Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>
        <View style={s.actionRow}>
          <Tactile accessibilityLabel={T('Use live prices')} onPress={() => void useLiveMetalPrices()} style={s.secondary}><Text style={s.secondaryText}>{T('Use live prices')}</Text></Tactile>
          <Tactile accessibilityLabel={T('Refresh prices and rates')} onPress={refresh} style={s.secondary}><Text style={s.secondaryText}>{refreshing ? T('Refreshing…') : T('Refresh')}</Text></Tactile>
        </View>
        <Text style={s.meta}>{zakat.prices.custom ? T('You are using your own prices.') : fresh ? T('Prices and exchange rates were fetched within the last twelve hours.') : market.fetchedAt ? T('Prices and rates were last saved on this device.') : T('No prices have been fetched yet.')}{market.fetchedAt ? ` ${tx(language, 'Updated')} ${new Date(market.fetchedAt).toLocaleString(language === 'ar' ? 'ar-u-nu-latn' : language)}.` : ''}</Text>
      </View>

     
      </ZakatSection> <ZakatSection title={T('The nisab')} open={zOpen.nisab === true} onToggle={() => setZOpen((prev) => ({ ...prev, nisab: prev.nisab !== true }))}>
      <View style={s.dataCard}>
        <View style={s.choiceRow}><ChoicePill label={`${T('Gold')} · ${NISAB_GOLD_GRAMS}${tx(language, 'g')}`} selected={zakat.basis === 'gold'} onPress={() => void setBasis('gold')} /><ChoicePill label={`${T('Silver')} · ${NISAB_SILVER_GRAMS}${tx(language, 'g')}`} selected={zakat.basis === 'silver'} onPress={() => void setBasis('silver')} /></View>
        <View style={s.statGrid}>
          <StatBox label={T('GOLD NISAB')} value={formatMoney(NISAB_GOLD_GRAMS * result.goldPerGram, zakat.currency, 0)} hint={`${NISAB_GOLD_GRAMS} ${tx(language, 'grams')}`} />
          <StatBox label={T('SILVER NISAB')} value={formatMoney(NISAB_SILVER_GRAMS * result.silverPerGram, zakat.currency, 0)} hint={`${NISAB_SILVER_GRAMS} ${tx(language, 'grams')}`} />
        </View>
        <Text style={s.meta}>{T('Scholars differ on which of the two to measure against. The lower threshold brings more wealth into Zakat; take the choice to someone you trust.')}</Text>
      {/* Said here rather than only at the result: the threshold is the number
          a ruling is measured against, and a threshold of zero would be
          believed before anybody scrolled far enough to be told otherwise. */}
      {!havePrices && <View style={[s.healthCard, { marginTop: 8, borderColor: C.coral, borderWidth: 1 }]}>
        <View style={[s.healthDot, { backgroundColor: C.coral }]} />
        <View style={{ flex: 1 }}>
          <Text style={s.sourceTitle}>{T('Prices are not available')}</Text>
          <Text style={s.sourceBody}>{T('The nisab is measured in money, and the gold and silver prices could not be fetched. Rather than work it out from nothing, the result is left empty until they arrive.')}</Text>
        </View>
        <Tactile onPress={() => void refresh()} style={s.ghostSmall}><Text style={s.ghostText}>{refreshing ? T('Fetching…') : T('Try again')}</Text></Tactile>
      </View>}
      </View>

     
      </ZakatSection> <ZakatSection title={T('The result')} open={zOpen.result === true} onToggle={() => setZOpen((prev) => ({ ...prev, result: prev.result !== true }))}>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View><Text style={s.nextCardLabel}>{T('ZAKAT DUE · 2.5%')}</Text><Text style={s.zakatNo}>{havePrices ? formatMoney(result.zakat, zakat.currency) : '—'}</Text><Text style={s.weekScoreBody}>{!havePrices ? T('Gold and silver prices could not be fetched, so nothing can be worked out yet.') : result.above ? T('Your net wealth is above the nisab') : T('Below the nisab — nothing is due')}</Text></View>
      </LinearGradient>
      <View style={s.statGrid}>
        <StatBox label={T('GROSS ASSETS')} value={formatMoney(result.gross, zakat.currency, 0)} hint={T('Everything listed above')} />
        <StatBox label={T('LIABILITIES')} value={formatMoney(result.liabilities, zakat.currency, 0)} hint={T('Subtracted')} />
        <StatBox label={T('NET WEALTH')} value={formatMoney(result.net, zakat.currency, 0)} hint={T('What Zakat is taken from')} />
        <StatBox label={T('NISAB')} value={formatMoney(result.nisab, zakat.currency, 0)} hint={zakat.basis === 'gold' ? T('Gold threshold') : T('Silver threshold')} />
      </View>
      <Tactile accessibilityLabel={T('Save this calculation')} onPress={() => void saveCalculation(result).then(() => setSaved(T('Saved on this device.')))} style={s.primary}><Text style={s.primaryText}>{T('Save this calculation')}</Text></Tactile>
      {!!saved && <Text style={s.dataMeta}>{saved.toUpperCase()}</Text>}
      </ZakatSection>

      <Section title={T('History')} action={zakat.history.length ? `${zakat.history.length} ${tx(language, 'saved')}` : undefined} onPress={zakat.history.length ? () => void clearHistory() : undefined} />
      {!zakat.history.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('No saved calculations yet. Save one and it stays here on this device.')}</Text></View> : <View style={s.settings}>{zakat.history.map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatMoney(entry.zakat, entry.currency)}</Text><Text style={s.meta}>{new Date(entry.at).toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : language)} · {tx(language, 'net')} {formatMoney(entry.net, entry.currency, 0)} · {tf(language, '{pos} the {metal} nisab', { pos: entry.above ? tx(language, 'above') : tx(language, 'below'), metal: entry.basis === 'gold' ? T('Gold') : T('Silver') })}</Text></View>
        <Tactile accessibilityLabel={T('Delete this calculation')} onPress={() => void deleteCalculation(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Tactile>
      </View>)}</View>}
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('BEFORE YOU PAY')}</Text><Text style={s.dataBody}>{T('What counts as zakatable, how business stock is valued and which debts may be deducted differ between schools and situations. This figure is a careful estimate to take to a scholar, and your Zakat year matters as much as the total.')}</Text></View>
    </ScrollView>
  </Page>;
}

function HadithProgressBars(){
  const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const state=useHadithState();
  const rows=HADITH_COLLECTIONS.map(collection=>{
    const total=state.totals[collection.slug]||0;
    const read=(state.read[collection.slug]||[]).length;
    return {collection,total,read,percent:total?Math.min(100,Math.round(read/total*100)):0};
  }).filter(row=>row.total>0);
  if(!rows.length)return null;
  const readTotal=rows.reduce((sum,row)=>sum+row.read,0);
  const hadithTotal=rows.reduce((sum,row)=>sum+row.total,0);
  return <View style={s.dataCard}>
    <Text style={s.dataMeta}>{T('READING PROGRESS')}</Text>
    <Text style={s.dataTitle}>{tf(language,'{r} of {t} opened',{r:readTotal,t:hadithTotal.toLocaleString()})}</Text>
    <View style={{marginTop:12,gap:10}}>{rows.map(row=><View key={row.collection.slug}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{rtl ? row.collection.arabicName : row.collection.name}</Text><Text style={s.meta}>{row.read} / {row.total.toLocaleString()}</Text></View>
      <View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${row.percent}%`}]}/></View>
    </View>)}</View>
  </View>;
}

function HadithScreen({navigation}:any){const {rtl,language:appLanguage}=useLanguage();const T=(text:string)=>tx(appLanguage,text);const ar = appLanguage === 'ar';
  const state=useHadithState();
  const [query,setQuery]=useState('');
  const [results,setResults]=useState<Hadith[]>([]);
  const [searching,setSearching]=useState(false);
  const [booksOnDevice,setBooksOnDevice]=useState(0);
  const downloaded=useDownloadedCollections();
  const language=useHadithLanguage();
  const [downloadTick,setDownloadTick]=useState(0);
  useEffect(()=>subscribeHadithDownloads(()=>setDownloadTick(t=>t+1)) as any,[]);
  useEffect(()=>{void deviceHadithCount().then(setBooksOnDevice)},[downloadTick]);

  /* How many narrations each collection holds.
     The catalogue carries no counts, and it is right not to: editions and
     languages disagree on the total, so the outline fetched for the language
     actually in hand is the only honest source. They are read quietly in the
     background, one at a time, and each card fills in as its number arrives —
     after the first visit they are served from the device cache and cost no
     network at all. A collection whose count never arrives simply omits it
     rather than showing a number nobody can stand behind. */
  const [counts,setCounts]=useState<Record<string,number>>({});
  useEffect(()=>{
    let alive=true;
    void (async()=>{
      for(const collection of HADITH_COLLECTIONS){
        try{
          const outline=await loadHadithOutline(collection.slug,language);
          if(!alive)return;
          if(outline?.total)setCounts(prev=>({...prev,[collection.slug]:outline.total}));
        }catch{/* nothing to show for this one */}
      }
    })();
    return()=>{alive=false};
  },[language]);

  /* Search runs over what is on the device. There is no server-side search -
     the endpoint accepts `q` and ignores it - so anything not read or
     downloaded is simply not searchable, and the screen says so. */
  useEffect(()=>{
    if(query.trim().length<3){setResults([]);setSearching(false);return}
    setSearching(true);
    const timer=setTimeout(()=>{
      void searchDeviceHadith(query,60).then(hits=>{setResults(hits);setSearching(false)});
    },220);
    return ()=>clearTimeout(timer);
  },[query,downloadTick]);

  const searching3=query.trim().length>=3;
  const open=(slug:string,number?:number)=>navigation.navigate(number?'Hadith Detail':'Hadith Collection',number?{slug,number}:{slug});
  return <Page><ToolBar title={T('Hadith')} navigation={navigation}/><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Hadith" size={81}/>
    <Text style={s.dataTitle}>{T('Hadith')}</Text>

    <Text style={s.intro}>{T('Ten verified collections with matched Arabic and English texts. Grading is shown where the source publishes it—Sahih al-Bukhari and Sahih Muslim carry no separate grade because their contents are accepted as sound.')}</Text>

    <View style={s.hadithPick}><HadithLanguagePicker available={[]}/></View>

    <View style={[s.search,s.hadithSearch]}>{ico('search',18,C.muted)}<TextInput accessibilityLabel={T('Search hadith on this device')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={booksOnDevice?T('Search hadith you have opened or downloaded'):T('Search hadith')} placeholderTextColor={C.muted}/></View>

    {searching3?(searching?<SkeletonList rows={6} />:results.length?<>
      <Text style={[s.meta,s.hadithResults]}>{ar?`${results.length} ${arNoun(results.length, 'نتيجة', 'نتيجتان', 'نتائج', 'نتيجة')}`:tf(appLanguage,'{n} results',{n:results.length})}</Text>
      {results.map(hadith=>{const collection=HADITH_COLLECTIONS.find(item=>item.slug===hadith.slug);return <Tactile key={hadith.id} onPress={()=>open(hadith.slug,hadith.number)} style={s.dataCard}>
        <Text style={s.dataMeta}>{rtl ? collection?.arabicName || collection?.name : collection?.name} · {T('Hadith')} {hadith.number}</Text>
        <Text style={s.dataBody} numberOfLines={3}>{hadith.english||hadith.arabic}</Text>
      </Tactile>})}
    </>:<View style={s.empty}>
      <Text style={s.dataBody}>{booksOnDevice
        ? T('No match in what is on this device. Search only covers books you have opened or downloaded.')
        : T('Search covers books you have opened or downloaded. Open a collection, or download one to search it all.')}</Text>
    </View>):<>
      {state.recent.length>0&&<>
        <Section title={T('Continue reading')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingRight:20}}>
          {state.recent.slice(0,8).map(item=>{const collection=HADITH_COLLECTIONS.find(entry=>entry.slug===item.slug);return <Tactile key={`${item.slug}-${item.number}`} onPress={()=>open(item.slug,item.number)} style={s.dataCard}>
            <Text style={s.dataMeta}>{rtl ? collection?.arabicName || collection?.name : collection?.name}</Text>
            <Text style={s.recentChipTitle}>{T('Hadith')} {item.number}</Text>
          </Tactile>})}
        </ScrollView>
      </>}
      {state.saved.length>0&&<>
        <Section title={T('Saved hadith')} action={T('See all')} onPress={()=>navigation.navigate('Hadith Saved')}/>
        {state.saved.slice(0,3).map(item=><Tactile key={item.id} onPress={()=>open(item.slug,item.number)} style={s.dataCard}>
          <Text style={s.dataMeta}>{item.collection} · {T('Hadith')} {item.number}</Text>
          <Text style={s.dataBody} numberOfLines={2}>{item.preview}</Text>
        </Tactile>)}
      </>}
      <HadithProgressBars/>
      <Section title={T('Collections')}/>
      {HADITH_COLLECTIONS.map(collection=>{
        const total=counts[collection.slug]||state.totals[collection.slug]||0;
        const read=(state.read[collection.slug]||[]).length;
        const percent=total?Math.min(100,Math.round(read/total*100)):0;
        const isDownloaded=!!downloaded[collection.slug];
        const progress=hadithDownloadProgress(collection.slug);
        const pct=progress.booksTotal?Math.round(progress.booksDone/progress.booksTotal*100):0;
        return <View key={collection.slug} style={s.hadithCollectionCard}>
          <Pressable accessibilityLabel={`${T('Open')} ${collection.name}`} onPress={()=>open(collection.slug)}>
            <View style={s.hadithCollectionTop}>
              <View style={{flex:1}}>
                <Text style={s.dataName}>{collection.name}</Text>
                <Text style={s.hadithCollectionAr}>{collection.arabicName}</Text>
                <Text style={s.meta}>{T(collection.author)} · {T(collection.kind)}{collection.graded ? (tx(language, ' · graded')) : ''}{isDownloaded ? (tx(language, ' · downloaded')) : ''}</Text>
              </View>
              <View style={s.hadithCountCol}>
                {!!total && <Text style={s.hadithCountNum}>{total.toLocaleString('en-US')}</Text>}
                {!!total && <Text style={s.hadithCountLabel}>{T('hadith')}</Text>}
              </View>
              {ico('chevron-forward',18,C.muted)}
            </View>
          </Pressable>
          {progress.phase==='downloading'&&<View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${pct}%`}]}/></View>}
          {progress.phase==='downloading'&&<Text style={s.meta}>{progress.booksDone} / {progress.booksTotal} {T('books')}</Text>}
          {percent>0&&progress.phase!=='downloading'&&<View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${percent}%`}]}/></View>}
          {progress.phase!=='downloading'&&<Pressable accessibilityLabel={isDownloaded?T('Remove this collection from the device'):T('Download this collection for offline reading')}
            onPress={()=>{void (isDownloaded?removeDownloadedCollection(collection.slug):downloadCollection(collection.slug,language)).catch(()=>undefined)}}
            style={[s.secondary,{marginTop:10}]}>
            <Text style={s.secondaryText}>{isDownloaded?T('Remove download'):T('Download for offline')}</Text></Pressable>}
        </View>;
      })}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Arabic and English together')}</Text><Text style={s.apiText}>{T('Each collection carries Arabic and English editions, so every hadith can be read in both. Collections are read on demand: opening one costs a single request for its list of books.')}</Text></View>
    </>}
  </ScrollView></Page>}

function HadithCollectionScreen({route,navigation}:any){const {rtl,language:appLanguage}=useLanguage();const T=(text:string)=>tx(appLanguage,text);
  const slug=route.params?.slug||'bukhari';
  const collection=HADITH_COLLECTIONS.find(item=>item.slug===slug);
  const [outline,setOutline]=useState<HadithOutline|null>(null);
  const [book,setBook]=useState<number|null>(null);
  const [rows,setRows]=useState<Hadith[]>([]);
  const language=useHadithLanguage();
  const [loadingBook,setLoadingBook]=useState(false);
  const [error,setError]=useState('');
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(20);
  const downloaded=useDownloadedCollections();
  const progress=hadithDownloadProgress(slug);
  const isDownloaded=!!downloaded[slug];
  const [downloadTick,setDownloadTick]=useState(0);
  const state=useHadithState();
  const read=new Set(state.read[slug]||[]);

  /* Re-render while a download runs - the progress lives outside React. */
  useEffect(()=>subscribeHadithDownloads(()=>setDownloadTick(t=>t+1)) as any,[]);

  const load=()=>{setError('');return loadHadithOutline(slug,language).then(next=>{setOutline(next)}).catch((e:any)=>setError(T(e.message||'Please check your connection.')))};
  useEffect(()=>{void load()},[slug,language]);
  useEffect(()=>{setLimit(20)},[book,query]);

  /* A book is read only when it is opened, and then only once. */
  useEffect(()=>{
    if(book===null){setRows([]);return}
    let alive=true;
    setLoadingBook(true);setError('');
    void loadHadithBook(slug,book,outline?.lang||language)
      .then(next=>{if(alive){setRows(next);setLoadingBook(false)}})
      .catch((e:any)=>{if(alive){setError(T(e.message||'Please check your connection.'));setLoadingBook(false)}});
    return ()=>{alive=false};
  },[slug,book,downloadTick,outline?.lang]);

  const filtered=query.trim().length>=2
    ? rows.filter(row=>(row.english||'').toLowerCase().includes(query.trim().toLowerCase())||(row.arabic||'').includes(query.trim()))
    : rows;
  const shown=filtered.slice(0,limit);
  const totalInCollection=outline?.total||outline?.books.reduce((sum,entry)=>sum+entry.count,0)||0;
  const booksDone=progress.booksDone, booksTotal=progress.booksTotal;
  const pct=booksTotal?Math.round(booksDone/booksTotal*100):0;

  return <Page><ToolBar title={rtl ? (collection?.arabicName || T('Hadith')) : (collection?.name || 'Hadith')} navigation={navigation}/>
    {!outline&&!error&&<SkeletonList rows={6} />}
    {!!error&&!outline&&<ErrorState message={error} retry={load}/>}
    {!!outline&&<>
      {book===null?<ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        <Text style={s.dataTitle}>{collection?.name||outline.name}</Text>
        <Text style={s.hadithCollectionAr}>{collection?.arabicName}</Text>
        <Text style={s.intro}>{T(collection?.author||'')} · {T(collection?.kind||'')} · {totalInCollection.toLocaleString()} {T('hadith')} · {outline.books.length} {T('books')}</Text>

        {/* The language is chosen on the Hadith screen and applies everywhere.
            Repeating the picker here meant two places to look, and a choice
            made on one book silently changing another. The notice stays: if
            the language you asked for was not available for this collection,
            that is worth saying. */}
        {outline.fellBack&&<HadithLanguageNotice wanted={language} onReset={()=>{void setHadithLanguage(DEFAULT_HADITH_LANGUAGE)}}/>}

        <View style={s.apiPanel}>
          <View style={s.hadithRowTop}>
            <View style={{flex:1}}>
              <Text style={s.apiTitle}>{isDownloaded?T('Available offline'):T('Read offline')}</Text>
              <Text style={s.apiText}>{isDownloaded
                ? `${(downloaded[slug].count||0).toLocaleString()} ${T('hadith stored on this device')}.`
                : T('Download this collection to read it without a connection.')}</Text>
            </View>
          </View>
          {progress.phase==='downloading'&&<View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${pct}%`}]}/></View>}
          {progress.phase==='downloading'&&<Text style={s.meta}>{booksDone} / {booksTotal} {T('books')}</Text>}
          <View style={{flexDirection:'row',gap:8,marginTop:12}}>
            {!isDownloaded&&<Pressable accessibilityLabel={T('Download this collection for offline reading')}
              onPress={()=>{void downloadCollection(slug,outline?.lang||language).catch(()=>undefined)}}
              style={[s.secondary,{flex:1,opacity:progress.phase==='downloading'?.5:1}]} disabled={progress.phase==='downloading'}>
              <Text style={s.secondaryText}>{progress.phase==='downloading'?T('Downloading…'):T('Download for offline')}</Text></Pressable>}
            {isDownloaded&&<Pressable accessibilityLabel={T('Remove this collection from the device')}
              onPress={()=>{void removeDownloadedCollection(slug).catch(()=>undefined)}}
              style={[s.secondary,{flex:1}]}>
              <Text style={s.secondaryText}>{T('Remove download')}</Text></Pressable>}
          </View>
          {progress.phase==='error'&&<Text style={s.meta}>{T(progress.error||'Download failed')}</Text>}
        </View>

        <Section title={T('Books')}/>
        {outline.books.map(entry=>{
          const readInBook=rows.length?0:0;
          return <Tactile key={entry.number} accessibilityLabel={`${T('Open book')} ${entry.number}`}
            onPress={()=>setBook(entry.number)} style={s.dataCard}>
            <View style={s.hadithRowTop}>
              <View style={s.hadithNumber}><Text style={s.hadithNumberText}>{entry.number}</Text></View>
              <View style={{flex:1}}>
                <Text style={s.dataName}>{entry.name}</Text>
                <Text style={s.hadithRowMeta}>{entry.count.toLocaleString()} {T('hadith')}</Text>
              </View>
              {ico('chevron-forward',16,C.muted)}
            </View>
          </Tactile>})}
      </ScrollView>:<>
        <View style={{paddingHorizontal:20,paddingBottom:10}}>
          <Pressable accessibilityLabel={T('Back to books')} onPress={()=>setBook(null)} style={[s.secondary,{alignSelf:'flex-start'}]}>
            <Text style={s.secondaryText}>‹ {T('All books')}</Text></Pressable>
        </View>
        <View style={s.search}>{ico('search',18,C.muted)}<TextInput accessibilityLabel={T('Search this book')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search this book')} placeholderTextColor={C.muted}/></View>
        <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
          {loadingBook&&<SkeletonList rows={6} />}
          {!!error&&<ErrorState message={error} retry={()=>setBook(book)}/>}
          {!loadingBook&&<Text style={s.meta}>{filtered.length.toLocaleString()} {T('hadith')}{query.trim().length>=2?` · ${T('matching your search')}`:''}</Text>}
          {shown.map((hadith,position)=><Tactile key={hadith.id} accessibilityLabel={`${T('Hadith')} ${position+1}`} onPress={()=>navigation.navigate('Hadith Detail',{slug,number:hadith.number})} style={s.dataCard}>
            <View style={s.hadithRowTop}>
              {/* Numbered by position, not by the source's own number.
                  That number is a row index across the whole collection,
                  so the first book of Muslim opens at 93 and the second
                  book of Bukhari at 8 — which reads as random to anyone
                  counting along. The running position starts at one and
                  continues, and the source number is kept underneath as
                  the reference a reader would cite. */}
              <View style={s.hadithNumber}><Text style={s.hadithNumberText}>{position+1}</Text></View>
              <View style={{flex:1}}>
                {hadith.grades.length>0&&<Text style={s.hadithRowMeta}>{hadith.grades.map(g=>g.grade).join(' · ')}</Text>}
                {!!hadith.arabic&&<Text style={s.hadithRowAr} numberOfLines={2}>{hadith.arabic}</Text>}
                <Text style={s.dataBody} numberOfLines={3}>{hadith.english}</Text>
                <Text style={s.hadithRowRef}>{hadithSourceLabel(language,slug)} {hadith.number}</Text>
                {read.has(hadith.number)&&<Text style={[s.meta,{marginTop:6}]}>{T('Read')}</Text>}
              </View>
              {ico('chevron-forward',16,C.muted)}
            </View>
          </Tactile>)}
          {!loadingBook&&!shown.length&&<View style={s.empty}><Text style={s.dataBody}>{query.trim().length>=2?T('No hadith matches this search.'):T('This book is empty.')}</Text></View>}
          {limit<filtered.length&&<Tactile accessibilityLabel={T('Load more hadith')} onPress={()=>setLimit(value=>value+20)} style={s.secondary}><Text style={s.secondaryText}>{T('Load more')}</Text></Tactile>}
        </ScrollView>
      </>}
    </>}
  </Page>}
function HadithDetailScreen({route,navigation}:any){const {rtl,language:appLanguage}=useLanguage();const T=(text:string)=>tx(appLanguage,text);
  const slug=route.params?.slug||'bukhari';
  const number=Number(route.params?.number||1);
  const collection=HADITH_COLLECTIONS.find(item=>item.slug===slug);
  const [hadith,setHadith]=useState<Hadith|null>(null);
  const [outline,setOutline]=useState<HadithOutline|null>(null);
  const language=useHadithLanguage();
  const [neighbours,setNeighbours]=useState<{previous?:Hadith;next?:Hadith}>({});
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [reporting,setReporting]=useState(false);
  useHadithState();
  const saved=isHadithSaved(slug,number);
  const total=outline?.total||0;

  /* One request for the narration, one for its book so the reader can walk
     forward and back. The book is cached, so walking is free after the first
     step. Reading a hadith never downloads the collection. */
  const load=async()=>{
    setError('');
    try{
      const record=await fetchHadithOne(slug,number,language);
      setHadith(record);
      const shape=await loadHadithOutline(slug,language).catch(()=>null);
      if(shape)setOutline(shape);
      if(record.book){
        const rows=await loadHadithBook(slug,record.book,shape?.lang||language).catch(()=>[] as Hadith[]);
        if(rows.length){
          const at=rows.findIndex(row=>row.number===number);
          if(at>=0){
            const previous=rows[at-1]; const next=rows[at+1];
            setNeighbours({previous,next});
            if(previous)await fetchHadithOne(slug,previous.number,shape?.lang||language).then(r=>setNeighbours(n=>({...n,previous:r}))).catch(()=>undefined);
            if(next)await fetchHadithOne(slug,next.number,shape?.lang||language).then(r=>setNeighbours(n=>({...n,next:r}))).catch(()=>undefined);
          }
        }
      }
    }catch(e:any){
      setError(T(e.message||'Please check your connection.'));
    }
  };
  useEffect(()=>{setNeighbours({});void load()},[slug,number,language]);
  useEffect(()=>{if(total)void markHadithRead(slug,number,total)},[total,slug,number]);
  const share=async()=>{
    if(!hadith)return;
    const text=`${hadithReference(collection,hadith)}\n\n${hadith.arabic}\n\n${hadith.english}`;
    try{await Share.share({message:text})}catch{/* sharing is unavailable on some platforms */}
  };
  const copy=async()=>{
    if(!hadith)return;
    try{await Clipboard.setStringAsync(`${hadith.arabic}\n\n${hadith.english}`);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{/* clipboard unavailable */}
  };
  useOverlaySheet('hadith-detail-report', !!hadith && reporting, () => hadith
    ? <CorrectionSheet
        target={{kind:'hadith',reference:`${collection?.name||''} · ${hadith.number}`,
          source:collection?.name||'', arabic:hadith.arabic, text:hadith.english,
          edition:hadith.grades[0]?.grade}}
        rtl={rtl} T={T} appLanguage={language} onClose={()=>setReporting(false)}/>
    : null, () => setReporting(false));
  return <Page><ToolBar title={rtl ? (collection?.arabicName || T('Hadith')) : (collection?.name || 'Hadith')} navigation={navigation}/>
    {!hadith&&!error&&<SkeletonParagraph lines={4} />}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!hadith&&<ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      {/* The chapter this hadith belongs to, above the text rather than lost in
          a subtitle, so you always know where in the collection you are. */}
      <View style={s.hadithBreadcrumb}>
        <Text style={s.hadithCrumbMain}>{collection?.name}</Text>
        <Text style={s.hadithCrumbSub}>
          {hadith.book?(tf(appLanguage,'Book {b} · {n}',{b:hadith.book,n:hadith.bookName})):T('General')}
          {total?` · ${T('Hadith')} ${hadith.number} ${T('of')} ${total.toLocaleString()}`:''}
        </Text>
      </View>

      {/* The Arabic as a page, not as body text. A hadith is committed to
          memory and read aloud; giving it a frame of its own is a small way of
          saying that. */}
      {!!hadith.arabic&&<View style={s.hadithPage}>
        <View style={s.hadithPageInner}>
          <Text style={s.hadithPageAr}>{hadith.arabic}</Text>
        </View>
        <View style={s.hadithPageNo}><Text style={s.hadithPageNoText}>{hadith.number}</Text></View>
      </View>}

      {hadith.grades.length>0&&<View style={s.hadithGrades}>{hadith.grades.map((grade,index)=><View key={`${grade.name}-${index}`} style={s.hadithGrade}><Text style={s.hadithGradeText}>{grade.grade}</Text><Text style={s.hadithGradeSource}>{grade.name}</Text></View>)}</View>}

      <Text style={s.hadithReaderEn}>{hadith.english}</Text>

      <View style={s.actionRow}>
        <Tactile accessibilityLabel={saved?'Remove hadith from saved':'Save this hadith'} onPress={()=>{if(collection)void toggleHadithSaved(collection,hadith)}} style={s.secondary}><Text style={s.secondaryText}>{saved?T('Saved'):T('Save')}</Text></Tactile>
        <Tactile accessibilityLabel={T('Copy hadith text')} onPress={copy} style={s.secondary}><Text style={s.secondaryText}>{copied?T('Copied'):T('Copy')}</Text></Tactile>
        <Tactile accessibilityLabel={T('Share hadith')} onPress={share} style={s.secondary}><Text style={s.secondaryText}>{T('Share')}</Text></Tactile>
        <Tactile accessibilityLabel={T('Report a correction')} onPress={()=>setReporting(true)} style={s.secondary}>{ico('flag-outline',15,C.green)}<Text style={s.secondaryText}>{T('Report')}</Text></Tactile>
      </View>
      <View style={s.hadithNav}>
        {neighbours.previous?<Pressable accessibilityLabel={T('Previous hadith')} onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.previous?.number})} style={s.hadithNavBtn}><Text style={s.hadithNavText}>← {neighbours.previous.number}</Text></Pressable>:<View style={s.hadithNavBtn}/>}
        {neighbours.next?<Pressable accessibilityLabel={T('Next hadith')} onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.next?.number})} style={[s.hadithNavBtn,{alignItems:'flex-end'}]}><Text style={s.hadithNavText}>{neighbours.next.number} →</Text></Pressable>:<View style={s.hadithNavBtn}/>}
      </View>
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Source')}</Text><Text style={s.apiText}>{hadithReference(collection,hadith)}</Text></View>
    </ScrollView>}
  </Page>}

function HadithSavedScreen({navigation}:any){const {rtl,language}=useLanguage();const T=(text:string)=>tx(language,text);
  const state=useHadithState();
  return <Page><ToolBar title={T('Saved hadith')} navigation={navigation}/>
    {!state.saved.length&&<View style={s.empty}><ToolGraphic tool="Hadith" size={60}/><Text style={s.dataTitle}>{T('Nothing saved yet')}</Text><Text style={s.dataBody}>{T('Save a hadith from any collection and it will appear here on this device only.')}</Text></View>}
    {state.saved.map(item=><View key={item.id} style={s.dataCard}>
      <Pressable onPress={()=>navigation.navigate('Hadith Detail',{slug:item.slug,number:item.number})}>
        <Text style={s.dataMeta}>{item.collection} · {T('Hadith')} {item.number}</Text>
        <Text style={s.dataBody} numberOfLines={4}>{item.preview}</Text>
      </Pressable>
      <Pressable accessibilityLabel={T('Remove saved hadith')} onPress={()=>void removeHadithBookmark(item.id)} style={{marginTop:10,alignSelf:'flex-start'}}><Text style={s.dangerText}>{T('Remove')}</Text></Pressable>
    </View>)}
  </Page>}

const PRAYER_METHODS=[{id:8,name:'Gulf Region',ar:'منطقة الخليج'},{id:4,name:'Umm al-Qura',ar:'أم القرى'},{id:3,name:'Muslim World League',ar:'رابطة العالم الإسلامي'},{id:5,name:'Egyptian Authority',ar:'الهيئة المصرية'},{id:1,name:'Karachi',ar:'كراتشي'},{id:2,name:'North America',ar:'أمريكا الشمالية'}];
/**
 * A choice. Forty-odd of these carry every toggle in the app, and they used to
 * answer a press with nothing at all. They now answer the way a card does -
 * they give slightly under the finger - so the whole app feels consistent.
 */
/**
 * A theme, small enough to sit inside a pill.
 *
 * Palestine is the flag: three bands and a triangle at the hoist, drawn from
 * FLAG so it is the same four colours the theme itself is made of. The
 * triangle is a border triangle — a box of no size whose left border is red
 * and whose top and bottom borders are nothing, which React Native paints as
 * the wedge the flag has.
 *
 * Islamic is the app's own two: Deep Indigo beside Radiant Gold.
 */
function ThemeMark({theme,height=12}:{theme:'islamic'|'palestine';height?:number}){
  const w=height*2, h=height;
  if (theme === 'palestine') {
    return <View style={{width:w,height:h,borderRadius:2,overflow:'hidden',backgroundColor:FLAG.white}}>
      <View style={{position:'absolute',left:0,right:0,top:0,height:h/3,backgroundColor:FLAG.black}}/>
      <View style={{position:'absolute',left:0,right:0,bottom:0,height:h/3,backgroundColor:FLAG.green}}/>
      <View style={{position:'absolute',left:0,top:0,width:0,height:0,
        borderTopWidth:h/2,borderBottomWidth:h/2,borderLeftWidth:w/3,
        borderTopColor:'transparent',borderBottomColor:'transparent',borderLeftColor:FLAG.red}}/>
    </View>;
  }
  return <View style={{width:w,height:h,borderRadius:2,overflow:'hidden',flexDirection:'row'}}>
    <View style={{flex:3,backgroundColor:BRAND.deepIndigo}}/>
    <View style={{flex:2,backgroundColor:BRAND.radiantGold}}/>
  </View>;
}

function ChoicePill({label,selected,onPress,swatch}:{label:string;selected:boolean;onPress:()=>void;swatch?:React.ReactNode}){
  const press=usePressDepth();
  return <Animated.View style={{transform:[{scale:press.scale}]}}>
    <Pressable accessibilityRole="radio" accessibilityState={{selected}} onPress={onPress}
      onPressIn={press.onPressIn} onPressOut={press.onPressOut}
      style={[s.choicePill,selected&&s.choicePillActive,swatch?{flexDirection:'row',gap:6}:null]}>
      {swatch}
      <Text style={[s.choiceText,selected&&s.choiceTextActive]}>{label}</Text>
    </Pressable>
  </Animated.View>;
}

/**
 * The language a narration is read in.
 *
 * Ten languages exist in the corpus but not one of them covers every
 * collection, so the pills are drawn dimmed where the collection has no
 * edition. Choosing a missing one still works - it falls back to English and
 * the screen says so - because a picker that refuses to be touched is worse
 * than one that explains itself.
 */
function HadithLanguagePicker({available,onPick}:{available:string[];onPick?:()=>void}){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  const current=useHadithLanguage();
  const has=available.length>0;
  return <View>
    <Text style={s.meta}>{T('Hadith language')}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
      {HADITH_LANGUAGES.map(entry=>{
        const missing=has&&!available.includes(entry.code);
        const selected=current===entry.code;
        return <View key={entry.code} style={{opacity:missing?.42:1}}>
          <ChoicePill
            label={rtl?entry.native:entry.english}
            selected={selected}
            onPress={()=>{void setHadithLanguage(entry.code);onPick?.()}}
          />
        </View>;
      })}
    </ScrollView>
    {has&&<Text style={[s.meta,{marginTop:-4}]}>
      {available.length} {T('of')} {HADITH_LANGUAGES.length} {T('languages in this collection')}
    </Text>}
  </View>;
}

/**
 * Shown when the collection has no edition in the chosen language.
 *
 * Falling back to English is the only honest option - there is nothing else to
 * show - but doing it silently would leave a person wondering why they asked
 * for Turkish and got English.
 */
function HadithLanguageNotice({wanted,onReset}:{wanted:string;onReset:()=>void}){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  const entry=hadithLanguage(wanted);
  const name=entry?(rtl?entry.native:entry.english):wanted;
  return <View style={s.apiPanel}>
    <Text style={s.apiTitle}>{T('No edition in this language')}</Text>
    <Text style={s.apiText}>{`${T('This collection has no')} ${name} ${T('edition, so these narrations are shown in English.')}`}</Text>
    <Pressable accessibilityLabel={T('Read hadith in English')} onPress={onReset} style={[s.secondary,{marginTop:10}]}>
      <Text style={s.secondaryText}>{T('Switch to English')}</Text>
    </Pressable>
  </View>;
}

/**
 * Where each part of the app's content comes from.
 *
 * The rows are named for what they carry and say who provides it, rather
 * than listing hostnames. A reader deciding whether to trust a source is
 * asking who stands behind it, and `api.islamicdata.uz` answers a question
 * they did not ask — the servers are the app's own, so the honest answer is
 * the app itself. Where nothing is fetched at all, the row says so, because
 * "no request leaves your device" is the single most reassuring thing on
 * this screen and it was previously written as the absence of a hostname.
 */
const DATA_SOURCES: { name: string; ar: string; provider: string; arProvider: string; detail: string; arDetail: string }[] = [
  { name: 'Quran text, translations and Tafsir', ar: 'نص القرآن والترجمات والتفاسير',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'The app’s own server. Every Arabic script — Uthmani, Imla’i simple, IndoPak and Tajweed — all 484 translations and every Tafsir, the Surah, Juz and Hizb structure, and Quran search.',
    arDetail: 'خادم التطبيق نفسه. كل الرسوم القرآنية — العثماني والإملائي البسيط والهندي والتجويد — وجميع الترجمات وكل التفاسير، وترتيب السور والأجزاء والأحزاب، والبحث في القرآن.' },
  { name: 'Recitation and adhan audio', ar: 'تلاوات القرآن والأذان',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'Every recitation and every spoken translation, ayah by ayah, plus the full-Surah reciters drawn from all the providers behind one catalogue. Both adhan catalogues are served here too, though the recordings themselves ship inside the app so they can sound from a notification. Kept audio for a verse-by-verse reciter is the one thing still fetched whole from the Islamic Network CDN.',
    arDetail: 'كل التلاوات وكل تلاوات المعنى آية بآية، إضافة إلى قرّاء السورة كاملة من جميع المزوّدين في فهرس واحد. ويُقدَّم فهرسا الأذان من هنا أيضًا، مع أن التسجيلات نفسها مخزّنة داخل التطبيق لتعمل من الإشعار. الصوت المحفوظ لقارئ آية بآية هو الشيء الوحيد الذي ما زال يُجلب كاملاً من شبكة إسلاميك.' },
  { name: 'Prices and city search', ar: 'الأسعار والبحث عن المدن',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'Gold and silver prices and the currency rates Zakat is worked out from, and city search when a place is not in the list kept on the device.',
    arDetail: 'أسعار الذهب والفضة وأسعار العملات التي تُحسب منها الزكاة، والبحث عن المدن عندما لا يكون المكان في القائمة المحفوظة على الجهاز.' },
  { name: 'On your device', ar: 'على جهازك',
    provider: 'Worked out on your device · no network request', arProvider: 'يُحسب على جهازك · بلا أي طلب شبكة',
    detail: 'Prayer times, the Hijri date, the Ramadan timetable, and the 604-page Mushaf layout with the Juz and Hizb divisions — kept with the app rather than asked for, so a page of the Quran opens without a connection. Every adhan recording is stored here too, eighteen for the day and two for dawn, which is what lets the call sound at Fajr with no network at all. The sun does not need the internet, and nothing about where you are is sent anywhere.',
    arDetail: 'تُحسب مواقيت الصلاة والتاريخ الهجري وجدول رمضان على جهازك من إحداثياتك، كما يُحفظ ترتيب صفحات المصحف الـ604 مع تقسيم الأجزاء والأحزاب، فتُفتح صفحة القرآن بلا اتصال. وتُخزَّن كل تسجيلات الأذان هنا أيضًا، ثمانية عشر للنهار واثنان للفجر، وهو ما يجعل الأذان يعمل في الفجر بلا أي اتصال. فالشمس لا تحتاج إلى إنترنت، ولا يُرسل أي شيء عن موقعك إلى أي جهة.' },
  { name: 'Gold and silver prices', ar: 'أسعار الذهب والفضة',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'Spot gold and silver prices per troy ounce, converted to a price per gram for the nisab threshold.',
    arDetail: 'أسعار الذهب والفضة الفورية للأوقية، وتحوّل إلى سعر الغرام لحساب النصاب.' },
  { name: 'Exchange rates', ar: 'أسعار الصرف',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'Daily reference exchange rates, used to show Zakat figures in the currency you choose.',
    arDetail: 'أسعار صرف مرجعية يومية، تُستخدم لعرض أرقام الزكاة بالعملة التي تختارها.' },
  { name: 'Full-Surah reciters', ar: 'قرّاء السورة كاملة',
    provider: 'Provided by Islamic · Your Daily Companion', arProvider: 'يوفره تطبيق إسلامك · رفيقك اليومي',
    detail: 'Complete Surah recitations from published reciters, used when you play a whole Surah rather than verse by verse.',
    arDetail: 'تلاوات كاملة للسور من القرّاء المنشورين، وتُستخدم عند تشغيل السورة كاملة.' },
];

function DataSourcesScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  return <Page><ToolBar title={tx(language, 'Data sources')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran" size={81} />
      <Text style={s.dataTitle}>{tx(language, 'Data sources')}</Text>
      <Text style={s.dataBody}>{tx(language, 'Everything the app opens is fetched from these public, keyless sources. No account, and no key, is needed for any of them.')}</Text>
      {DATA_SOURCES.map((source) => <View key={source.name} style={s.apiPanel}>
        <Text style={s.apiTitle}>{rtl ? source.ar : source.name}</Text>
        <Text style={s.dataProvider}>{rtl ? source.arProvider : source.provider}</Text>
        <Text style={s.apiText}>{rtl ? source.arDetail : source.detail}</Text>
      </View>)}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{tx(language, 'Kept on this device')}</Text>
        <Text style={s.apiText}>{tx(language, 'What you open is stored on this device so it can be read again without a connection. Nothing you record is uploaded anywhere.')}</Text>
      </View>
    </ScrollView>
  </Page>;
}

/**
 * Settings owns the two screens it links to. Reading preferences and the
 * lock live in the Quran and Tools stacks too, but reaching across to those
 * from here finds no route - the navigator only looks at its own stack and
 * its ancestors, and Settings is not inside either. Registering them here
 * keeps the journey honest: open reading settings, press back, land in
 * Settings where you started.
 */
function ReportsScreen({navigation}:any){
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const [reports, setReports] = useState<CorrectionReport[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /* loadReports fills the in-memory list from storage; getReports only reads what is already there. */
  const load = useCallback(() => { void loadReports().then(setReports); }, []);
  useEffect(load, [load]);

  const refresh = async () => { setRefreshing(true); setReports(await loadReports()); setRefreshing(false); };

  const remove = (id: string) => {
    Alert.alert(T('Delete this report?'), T('The saved copy on this device is removed. Anything already sent by email is not affected.'), [
      { text: T('Keep'), style: 'cancel' },
      { text: T('Delete'), style: 'destructive', onPress: () => { void deleteReport(id); load(); } },
    ]);
  };

  const resend = (report: CorrectionReport) => {
    void openReportEmail(report).then(async (opened) => {
      if (opened) { await markReportSent(report.id); load(); }
      else Alert.alert(T('No email app'), T('This report is still saved below. It can be copied and sent from any mail app.'));
    });
  };

  return <Page>
    <ToolBar title={tx(language, 'My reports')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <ToolGraphic tool="Corrections" size={85} />
      <Text style={s.dataTitle}>{tx(language, 'My reports')}</Text>
      <Text style={s.intro}>
        {tx(language, 'Every correction you have sent, kept here on your device. Resend it, copy it, or remove it.')}
      </Text>

      {reports.length === 0 ? <Text style={s.sourceBody}>
        {tx(language, 'You have not reported anything yet.')}
      </Text> : reports.map(report => <View key={report.id} style={s.reportCard}>
        <Text style={s.reportRef}>{report.reference}</Text>
        <Text style={s.reportFlag}>{issueLabel(report.issue)}</Text>
        {!!report.note && <Text style={s.reportBodyText}>{report.note}</Text>}
        {!!report.edition && <Text style={s.reportMeta}>{report.edition}</Text>}
        <Text style={s.reportMeta}>
          {report.sent ? (tx(language, 'Sent')) : (tx(language, 'Not sent yet'))}
          {' · '}{new Date(report.createdAt).toLocaleDateString()}
        </Text>
        <View style={s.reportActions}>
          <Pressable onPress={() => { void copyFeedback(report); Alert.alert(T('Copied'), T('The report is on your clipboard.')); }} style={s.reportBtnSmall}>
            <Text style={s.reportBtnSmallText}>{T('Copy')}</Text>
          </Pressable>
          <Pressable onPress={() => resend(report)} style={s.reportBtn}>
            <Text style={s.reportBtnText}>{report.sent ? T('Send again') : T('Send by email')}</Text>
          </Pressable>
          <Pressable onPress={() => remove(report.id)} style={s.reportBtnGhost}>
            <Text style={s.reportBtnGhostText}>{T('Delete')}</Text>
          </Pressable>
        </View>
      </View>)}
    </ScrollView>
  </Page>;
}

/**
 * Backup and restore.
 *
 * The screen says plainly what the encryption does and does not protect
 * against, because a backup is exactly the thing people assume is safe and
 * then share. It is safe to share — the file is sealed — but only for as long
 * as the password is not written anywhere, and there is no way to recover it.
 */
function BackupScreen({ navigation }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const backup = useBackupSettings();
  const unlocked = useBackupUnlocked();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState<{ text: string; summary: BackupSummary } | null>(null);
  const [restorePassword, setRestorePassword] = useState('');
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasted, setPasted] = useState('');
  /* A restore remounts this screen, so the confirmation is read back from the
     service rather than held here. */
  const done = getLastRestore();
  useEffect(() => {
    if (!done) return undefined;
    const id = setTimeout(() => clearLastRestore(), 12000);
    return () => clearTimeout(id);
  }, [done]);

  const run = async (label: string, work: () => Promise<void>) => {
    setBusy(label); setError('');
    try {
      await work();
    } catch (e: any) {
      setError(T(e?.message || 'Something went wrong.'));
    } finally {
      setBusy(null);
    }
  };

  const onSetPassword = () => run(T('Setting the password…'), async () => {
    if (password !== confirm) {
      setError(T('Those two passwords do not match.'));
      return;
    }
    await setBackupPassword(password);
    setPassword(''); setConfirm('');
    setNotice(T('Password set. Nothing can recover it — not this app, and not anyone else.'));
  });

  const onUnlock = () => run(T('Unlocking…'), async () => {
    await unlock(password);
    setPassword('');
  });

  const onChangePassword = () => run(T('Changing…'), async () => {
    if (password !== confirm) {
      setError(T('Those two passwords do not match.'));
      return;
    }
    await setBackupPassword(password);
    setPassword(''); setConfirm('');
    setNotice(T('Password changed. Backups already made still open with the old one.'));
  });

  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const onCreate = () => run(T('Encrypting…'), async () => {
    const made = await createBackup();
    const name = `deen-backup-${fileStamp()}.deenbackup`;
    const root = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
    const uri = `${root}${name}`;
    let saved = false;
    try {
      await FileSystem.writeAsStringAsync(uri, made.text);
      saved = true;
    } catch {
      /* a device that will not take the file can still share the text */
    }
    let shared = false;
    try {
      if (saved && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: T('Save your Islamic backup') });
        shared = true;
      }
    } catch {
      shared = false;
    }
    setNotice(shared
      ? tf(language, 'Encrypted {n} records. Keep the file somewhere you will find it again.', { n: made.keys })
      : tf(language, "Encrypted {n} records, but this device would not open a share sheet. The file is in the app's cache.", { n: made.keys }));
  });

  const accept = (text: string) => {
    const summary = readBackupSummary(text);
    if (!summary) {
      setError(T('That file is not an Islamic backup.'));
      return;
    }
    setPending({ text, summary });
    setError('');
  };

  const onPick = () => run(T('Opening…'), async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.length) return;
      accept(await FileSystem.readAsStringAsync(result.assets[0].uri));
    } catch {
      setError(T('No file picker here — paste the backup instead.'));
      setPasteOpen(true);
    }
  });

  const onRestore = () => run(T('Restoring…'), async () => {
    if (!pending) return;
    await restoreBackup(pending.text, restorePassword);
    setPending(null); setRestorePassword(''); setPasted(''); setPasteOpen(false);
  });

  const onRemove = () => run(T('Removing…'), async () => {
    await removePassword();
    setNotice(T('Password removed. Backups already made still open with it.'));
  });

  const secretField = (value: string, onChange: (next: string) => void, label: string) =>
    <TextInput value={value} onChangeText={onChange} secureTextEntry autoCapitalize="none"
      autoCorrect={false} placeholder={T(label)} placeholderTextColor={C.muted}
      style={s.backupInput} accessibilityLabel={T(label)} />;

  return <Page><ToolBar title={T('Backup')} navigation={navigation} />
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
      <Text style={s.dataTitle}>{T('An encrypted copy of everything')}</Text>
      <Text style={s.intro}>{T('Your worship, memorisation, notes, fasting and Qada are sealed with a password you choose. The password is never written down and cannot be recovered — not by this app, and not by anyone else.')}</Text>

      <View style={s.backupHero}>
        {ico(backup.passwordSet ? (unlocked ? 'lock-open-outline' : 'lock-closed-outline') : 'key-outline', 22, C.onAccent)}
        <View style={{ flex: 1 }}>
          <Text style={s.backupHeroTitle}>{backup.passwordSet
            ? (unlocked ? T('Unlocked') : T('Locked'))
            : T('No password yet')}</Text>
          <Text style={s.backupHeroText}>{backup.passwordSet
            ? (unlocked
              ? T('This device can make and open backups until it locks again.')
              : T('Enter the password to make or open a backup.'))
            : T('Choose a password to begin.')}</Text>
        </View>
      </View>

      {backup.lastBackupAt ? <Text style={[s.meta, { marginTop: 10 }]}>
        {tf(language, 'Last backup {date}', { date: new Date(backup.lastBackupAt).toLocaleDateString() })}</Text> : null}

      {!!notice && <View style={[s.backupNotice, s.backupNoticeGood]}><Text style={s.backupNoticeGoodText}>{notice}</Text></View>}
      {!!done && <View style={[s.backupNotice, s.backupNoticeGood]}>
        <Text style={s.backupNoticeGoodText}>
          {tf(language, 'Restored {n} records, from {date}.', { n: done.keys, date: new Date(done.exportedAt).toLocaleDateString() })}
        </Text>
      </View>}
      {!!error && <View style={s.backupNotice}><Text style={s.backupNoticeText}>{error}</Text></View>}
      {busy && <View style={s.backupBusy}><ActivityIndicator color={C.green} /><Text style={s.meta}>{busy}</Text></View>}

      {!backup.passwordSet && <View style={s.formCard}>
        <Text style={s.inputLabel}>{T('CHOOSE A PASSWORD')}</Text>
        {secretField(password, setPassword, 'At least 8 characters')}
        {secretField(confirm, setConfirm, 'The same password again')}
        <Tactile onPress={() => { void onSetPassword(); }} style={s.primary}><Text style={s.primaryText}>{T('Set password')}</Text></Tactile>
      </View>}

      {backup.passwordSet && !unlocked && <View style={s.formCard}>
        <Text style={s.inputLabel}>{T('YOUR PASSWORD')}</Text>
        {secretField(password, setPassword, 'Password')}
        <Tactile onPress={() => { void onUnlock(); }} style={s.primary}><Text style={s.primaryText}>{T('Unlock')}</Text></Tactile>
      </View>}

      {backup.passwordSet && unlocked && <>
        <Section title={T('Make a backup')} />
        <Tactile onPress={() => { void onCreate(); }} style={s.practiceLaunch}>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Create and share a backup')}</Text>
            <Text style={s.meta}>{T('Sealed here before it leaves the device, then handed to whatever you save it with.')}</Text>
          </View>
          {ico('cloud-upload-outline', 28, C.green)}
        </Tactile>

        <Section title={T('Restore')} />
        {!pending && <>
          <Tactile onPress={() => { void onPick(); }} style={s.practiceLaunch}>
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T('Choose a backup file')}</Text>
              <Text style={s.meta}>{T('Everything on this device is replaced by what is in the file.')}</Text>
            </View>
            {ico('cloud-download-outline', 28, C.green)}
          </Tactile>
          <Pressable onPress={() => setPasteOpen((open) => !open)} style={s.backupLink}>
            <Text style={s.backupLinkText}>{T('Or paste one instead')}</Text>
          </Pressable>
          {pasteOpen && <>
            <TextInput value={pasted} onChangeText={setPasted} multiline
              placeholder={T('Paste the whole backup file here')} placeholderTextColor={C.muted}
              style={s.backupPaste} accessibilityLabel={T('Backup contents')} />
            <Tactile onPress={() => accept(pasted)} style={s.secondary}><Text style={s.secondaryText}>{T('Use this backup')}</Text></Tactile>
          </>}
        </>}

        {pending && <View style={s.formCard}>
          <Text style={s.inputLabel}>{T('OPENING THIS BACKUP')}</Text>
          <Text style={s.meta}>{tf(language, 'Made {date}', { date: new Date(pending.summary.exportedAt).toLocaleDateString() })}</Text>
          {secretField(restorePassword, setRestorePassword, 'The password for this backup')}
          <View style={s.backupActions}>
            <Tactile onPress={() => { void onRestore(); }} style={s.primary}><Text style={s.primaryText}>{T('Restore and replace')}</Text></Tactile>
            <Tactile onPress={() => { setPending(null); setRestorePassword(''); }} style={s.secondary}><Text style={s.secondaryText}>{T('Cancel')}</Text></Tactile>
          </View>
        </View>}

        <Section title={T('Password')} />
        <View style={s.formCard}>
          <Text style={s.inputLabel}>{T('ASK AGAIN')}</Text>
          <View style={s.choiceGrid}>{BACKUP_RELOCK_OPTIONS.map((option) =>
            <ChoicePill key={option.minutes} label={T(option.label)}
              selected={backup.relockMinutes === option.minutes}
              onPress={() => { void saveRelock(option.minutes); }} />)}</View>
          <Text style={s.inputLabel}>{T('NEW PASSWORD')}</Text>
          {secretField(password, setPassword, 'New password')}
          {secretField(confirm, setConfirm, 'The same password again')}
          <Tactile onPress={() => { void onChangePassword(); }} style={s.secondary}><Text style={s.secondaryText}>{T('Change password')}</Text></Tactile>
          <Tactile onPress={() => { void onRemove(); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Remove the password')}</Text></Tactile>
          <Tactile onPress={() => lockBackup()} style={s.secondary}><Text style={s.secondaryText}>{T('Lock now')}</Text></Tactile>
        </View>
      </>}

      <Section title={T('What travels, and what does not')} />
      <View style={s.preferencePanel}>
        <Text style={s.meta}>{T('Included: prayer and fasting records, Qada, Zakat, memorisation, Quran bookmarks and notes, journeys, dhikr counts, and your settings — including this device’s cycle records, if you keep them.')}</Text>
        <Text style={[s.meta, { marginTop: 8 }]}>{T('Left out: downloaded recitation audio, which lives as files on this device and can be downloaded again, and the backup password itself.')}</Text>
      </View>
    </ScrollView>
  </Page>;
}

/**
 * Storage.
 *
 * What the app is holding on the device, and what it costs. The numbers come
 * from three places that do not know about each other: the text cache index,
 * the audio downloads list, and everything left over in AsyncStorage. They are
 * measured separately and added up here, because a screen that said the Quran
 * was 40 MB and did not mention the recitations would be answering a different
 * question from the one being asked.
 *
 * Bytes are counted as they are stored, not as they are served. Text is
 * compressed on the wire and not on the device, so a translation that arrives
 * as 3 MB is 11 MB here, and that is the number that matters when the question
 * is how much room is left.
 */
function StorageScreen({navigation}:any){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(language,text);
  const[usage,setUsage]=useState<any>(null);
  const[otherBytes,setOtherBytes]=useState(0);
  const[loading,setLoading]=useState(true);
  const[free,setFree]=useState<number|null>(null);
  const downloads=useDownloads();
  const audioBytes=downloads.filter(d=>d.status==='done').reduce((n,d)=>n+(d.bytes||0),0);
  const audioCount=downloads.filter(d=>d.status==='done').length;

  const measure=useCallback(async()=>{
    setLoading(true);
    const[u,f]=await Promise.all([
      getCacheUsage().catch(()=>null),
      estimateFreeBytes().catch(()=>null)
    ]);
    setUsage(u); setFree(f);
    /* Everything the cache does not already account for: settings, prayer
       history, the adhkar log, saved positions. Counted key by key, because
       AsyncStorage has no way to report a total. */
    let other=0;
    const keys=await AsyncStorage.getAllKeys().catch(()=>[] as readonly string[]);
    for(const key of keys){
      if(key==='@deen/content-cache/index/v1') continue;
      const raw=await AsyncStorage.getItem(key).catch(()=>null);
      if(raw) other+=raw.length*2;
    }
    setOtherBytes(other);
    setLoading(false);
  },[]);

  useFocusEffect(useCallback(()=>{void measure()},[measure]));

  /* Free space is reported in gigabytes on a modern phone, and a figure in
     megabytes there is a number nobody reads. Downloads are quoted in MB
     because that is the unit they were chosen in. */
  const formatRoom=(bytes:number)=>bytes>=1024*1024*1024
    ? `${(bytes/(1024*1024*1024)).toFixed(1)} GB`
    : formatBytes(bytes);

  const ns=usage?.byNamespace||{};
  const rows=[
    {label:T('Quran'), detail:T('The Arabic and the translations'), bytes:ns.quran||0, color:C.heroA},
    {label:T('Tafsir'), detail:T('Commentary you have kept'), bytes:ns.tafsir||0, color:C.green},
    {label:T('Hadith'), detail:T('Collections kept for offline'), bytes:ns.hadith||0, color:C.gold},
    {label:T('Recitations'), detail:audioCount?`${audioCount} ${T('surahs')}`:T('Nothing downloaded yet'), bytes:audioBytes, color:C.heroB},
    {label:T('Daily content'), detail:T('Verse, Name and adhkar of the day'), bytes:ns.daily||0, color:C.muted},
    {label:T('Everything else'), detail:T('Settings, history, saved places'), bytes:otherBytes+(ns['audio-meta']||0), color:C.line},
  ].filter(r=>r.bytes>0);

  const total=rows.reduce((n,r)=>n+r.bytes,0);
  const largest=rows.reduce((m,r)=>Math.max(m,r.bytes),1);

  return <Page><ToolBar title={T('Storage')} navigation={navigation}/>
    <ScrollView {...SCROLL} contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Storage" size={81}/>
      <Text style={s.dataTitle}>{T('What the app is holding')}</Text>
      <Text style={s.intro}>{T('Measured as it sits on the device, not as it arrived. Text is compressed on the way in and not once stored, so a translation that downloads as 3 MB takes 11 MB here.')}</Text>

      {loading?<SkeletonList rows={5} />:<>
        <DepthCard style={s.storeTotal}>
          <Text style={s.storeTotalNum}>{formatBytes(total)}</Text>
          <Text style={s.meta}>{T('used by the app')}</Text>
          {free!==null&&Number.isFinite(free)&&<Text style={s.meta}>{formatRoom(free)} {T('free on this device')}</Text>}
        </DepthCard>

        {rows.map(r=>(
          <View key={r.label} style={s.storeRow}>
            <View style={s.storeRowTop}>
              <Text style={s.storeLabel}>{r.label}</Text>
              <Text style={s.storeBytes}>{formatBytes(r.bytes)}</Text>
            </View>
            <View style={s.storeTrack}>
              <View style={[s.storeFill,{width:`${Math.max(2,(r.bytes/largest)*100)}%`,backgroundColor:r.color}]}/>
            </View>
            <Text style={s.storeDetail}>{r.detail}</Text>
          </View>
        ))}

        {!rows.length&&<Text style={s.intro}>{T('Nothing is stored yet.')}</Text>}
      </>}
    </ScrollView></Page>;
}

function SettingsStack(){const subtle=useSubtleTransitions();return <Stack.Navigator screenOptions={{...subtle,headerShown:false}}><Stack.Screen name="Settings" component={SettingsScreen}/><Stack.Screen name="Legal" component={LegalScreen}/><Stack.Screen name="Data sources" component={DataSourcesScreen}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}
      options={{presentation:'transparentModal',animation:'slide_from_bottom',contentStyle:{backgroundColor:'transparent'}}}/><Stack.Screen name="Privacy Lock" component={PrivacyLockScreen}/><Stack.Screen name="My Reports" component={ReportsScreen}/><Stack.Screen name="Backup" component={BackupScreen}/><Stack.Screen name="Storage" component={StorageScreen}/></Stack.Navigator>}

/**
 * The header of a settings card: a tile, a name, and what the choice does.
 *
 * Settings is a list of cards that do not otherwise resemble each other -
 * one holds pills, one holds switches, one is a single link. Giving them all
 * the same head is what makes the screen read as one page rather than five.
 */
function PanelHead({ tool, glyph, image, title, note }: { tool?: string; glyph?: string; image?: any; title: string; note: string }) {
  return <View style={s.preferenceHead}>
    {tool
      ? <ToolGraphic tool={tool} size={60} />
      : <View style={s.prefIconTile}>{image
        ? <Image source={image} resizeMode="contain" style={{ width: 30, height: 30 }} />
        : glyph ? <MotionGlyph name={glyph} size={22} /> : null}</View>}
    <View style={{ flex: 1 }}>
      <Text style={s.settingName}>{title}</Text>
      <Text style={s.meta}>{note}</Text>
    </View>
  </View>;
}

/* The three documents a store listing asks for, written from what the app
   actually does rather than from a template. Each is plain language on
   purpose: a policy nobody reads is not a policy.

   They are kept as data next to the screen that renders them so that the
   text and the screen cannot drift, and so that a change to what the app
   sends over the network is a change to one list rather than a hunt. */
type LegalDoc = { title: string; updated: string; sections: { heading: string; body: string }[] };

const LEGAL_DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    updated: '5 November 2026',
    sections: [
      { heading: 'Who this is',
        body: 'This app is published by Orin Developers. If you have a question about this policy, or about your data, write to Islamic@qashi.uz and we will answer.' },
      { heading: 'There is no account',
        body: 'The app does not ask you to sign up, log in, or give an email address. There is no account to close because there is no account, and there is therefore nothing we could identify you by even if we wanted to.' },
      { heading: 'What stays on your device',
        body: 'Your prayer record, the surah and verse you last read, bookmarks, notes, reminder settings, the language you chose, the city you picked and any collection you have downloaded for offline use are stored on the device itself. They are never uploaded. Clearing the app\u2019s storage or uninstalling removes them completely.' },
      { heading: 'What we collect',
        body: 'Nothing. The app runs no analytics, no advertising identifier, no crash reporting that could be tied back to you, and no third-party tracking of any kind. We cannot see how many people use the app, which screens they open, or what they read.' },
      { heading: 'What is sent over the network',
        body: 'When the app fetches something it sends only what that request needs — the coordinates of the city you selected, in order to work out prayer times and the direction of the qibla, or the identifier of the chapter, hadith or audio you asked for. Those requests carry no account, no device identifier and no history. They are not joined to one another.' },
      { heading: 'Who we ask',
        body: 'Quran text, prayer times, hadith, the Names, supplications and the countdown to Hajj come from api.islamicdata.uz. Recitation audio comes from cdn.islamic.network. The adhan recordings you choose are downloaded from audio.islamicdata.uz. Gold and silver prices used by the Zakat calculator come from misc.islamicdata.uz. Each receives the request needed to answer it and nothing about you.' },
      { heading: 'Location',
        body: 'The app works with a city you choose from a list, and with Makkah if you choose nothing. Location permission is optional: if you grant it, the device is asked once to resolve the nearest city, and that resolves to a city name. Your coordinates are not stored, not kept as a history, and not sent anywhere as a record of where you have been. Denying the permission costs you nothing but the convenience of the lookup.' },
      { heading: 'Notifications',
        body: 'Reminders are scheduled on the device itself. Nothing about them, including which reminders you set, is sent anywhere.' },
      { heading: 'Data sharing and sale',
        body: 'We do not sell your data, and we have no data to sell. We do not share it with third parties for advertising, analytics, marketing or any other purpose. The services named above are asked for content, not told about you.' },
      { heading: 'Children',
        body: 'The app is suitable for all ages and knowingly collects nothing from anyone, including children. It contains no advertising and no in-app purchases.' },
      { heading: 'Your rights',
        body: 'Because nothing is held about you, there is no profile to request, correct, export or erase. Everything you have created lives on your device and can be removed by clearing the app\u2019s storage in Settings or by uninstalling. If you believe we hold something about you, write to Islamic@qashi.uz.' },
      { heading: 'Changes',
        body: 'If this policy changes, this page changes with it and the date at the top moves. Where a change is material we will say so in the app.' },
      { heading: 'Contact',
        body: 'Orin Developers — Islamic@qashi.uz' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: '5 November 2026',
    sections: [
      { heading: 'Who this is',
        body: 'These terms govern your use of this app, published by Orin Developers. Questions about them can go to Islamic@qashi.uz. By using the app you accept them.' },
      { heading: 'Provided as it is',
        body: 'The app is offered in good faith and without warranty of any kind. Prayer times are calculated, and calculations can differ by a minute or two from a local mosque\u2019s timetable. Where the difference matters, follow your mosque. We do not warrant that the app will be uninterrupted, error-free, or available at all times.' },
      { heading: 'Religious content',
        body: 'Quran text, hadith, the Names and the supplications come from the sources named in the app. Rulings and guidance are summarised for learning and are not a substitute for scholarship. For a matter that affects your worship, your fasting, your zakat or any other obligation, ask a qualified scholar. This app is not a source of legal or religious authority and no part of it constitutes a fatwa.' },
      { heading: 'Your content',
        body: 'Notes, bookmarks and records you create remain yours and remain on your device. We have no copy of them and no way to read them.' },
      { heading: 'Acceptable use',
        body: 'Use the app for its purpose. Do not attempt to interfere with the services it relies on, resell access to it, or present its content as your own scholarship.' },
      { heading: 'Availability',
        body: 'The app depends on external services for Quran text, prayer times, hadith and audio. Where one of those is unavailable, the parts of the app that depend on it may be unavailable too. Content you have downloaded for offline use remains available.' },
      { heading: 'Limitation of liability',
        body: 'To the extent permitted by law, Orin Developers is not liable for any loss arising from your use of, or reliance on, the app, including any inaccuracy in a calculated time or a summarised ruling.' },
      { heading: 'Changes to these terms',
        body: 'We may update these terms. The date at the top tells you when they last changed, and continuing to use the app after a change means you accept the updated terms.' },
      { heading: 'Contact',
        body: 'Orin Developers — Islamic@qashi.uz' },
    ],
  },
  datasafety: {
    title: 'Data Safety',
    updated: '5 November 2026',
    sections: [
      { heading: 'Collected', body: 'Nothing is collected. No account, no analytics, no advertising identifier, no crash reporting that identifies you, no third-party tracking.' },
      { heading: 'Stored on device', body: 'Prayer record, reading position, bookmarks, notes, settings, chosen city, language, and anything downloaded for offline use. Removed by clearing storage or uninstalling. Never uploaded.' },
      { heading: 'Shared', body: 'Nothing is sold, and nothing is shared with third parties for advertising, analytics or marketing.' },
      { heading: 'Sent in requests', body: 'The coordinates of the city you selected, and the identifiers of the content you asked for. Not linked to you, and not retained as a history.' },
      { heading: 'Encryption', body: 'Requests to the services named in the Privacy Policy are made over HTTPS.' },
      { heading: 'Deletion', body: 'There is nothing held about you to delete. What is on the device can be cleared from Settings or by uninstalling.' },
      { heading: 'Independent review', body: 'No third party has reviewed these practices. They are stated here plainly so that you can judge them yourself, and so that they can be checked against what the app actually does.' },
    ],
  },

};

function LegalScreen({ route, navigation }: any) {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const key = route?.params?.doc || 'privacy';
  const doc = LEGAL_DOCS[key] || LEGAL_DOCS.privacy;
  /* The header needs the navigator. This screen used to take only `route` and
     hand the toolbar `undefined`, so the arrow called `goBack()` on nothing and
     the press threw — the report was a back button that led to a blank page. */
  return <Page><ToolBar title={T(doc.title)} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <Text style={s.dataTitle}>{T(doc.title)}</Text>
      <Text style={s.meta}>{T('Last updated')}: {doc.updated}</Text>
      {doc.sections.map((section) => (
        <View key={section.heading} style={{ marginTop: 18 }}>
          <Text style={s.sourceTitle}>{T(section.heading)}</Text>
          <Text style={s.intro}>{T(section.body)}</Text>
        </View>
      ))}
    </ScrollView></Page>;
}

/**
 * What the quiet layer is showing today, for the settings row that has to
 * describe it. Plain sentences rather than a name, because most people will
 * never know this exists and the row is the only place that tells them.
 */
const AMBIENCE_NOTE: Record<Ambience, string> = {
  confetti: 'Confetti — today is one of the Eids',
  ramadan: 'Warm light — Ramadan',
};

function SettingsScreen({navigation}:any){
  const { language, rtl, setLanguage } = useLanguage();
  const T = (text: string) => tx(language, text);
  /* The interface language is chosen from a list rather than a switch, now
     that there is more than one alternative to English. Only the languages
     with any copy of their own are offered: the rest would put an English
     interface under an Urdu flag, which is not a choice anyone is making. */
  const [pickingApp, setPickingApp] = useState(false);
  const appLanguageRows = useMemo<PickerRow[]>(
    () =>
      LANGUAGES.filter((entry) => entry.uiReady || entry.uiPartial).map((entry) => ({
        code: entry.code,
        native: entry.native,
        label: entry.english,
        flag: languageFlag(entry.code),
        note: entry.uiReady
          ? undefined
          : T('Partly translated — some screens stay in English'),
      })),
    [T],
  );
  const currentApp = LANGUAGES.find((entry) => entry.code === language);
  const appLangLabel = currentApp ? currentApp.native : String(language).toUpperCase();
  const appLangNote =
    currentApp && !currentApp.uiReady && currentApp.uiPartial
      ? T('Partly translated')
      : undefined;
  const { theme: themeName, mode: themeMode, setTheme, setMode, dark } = useTheme();
  const { settings, update } = useWorshipSettings();
  const still = useCalmMotion();
  /* Both of these are easy to switch on and then never notice: the burst is
     two mornings a year, and the field is quiet enough to fade into the
     background. So both can be played here on request. The tick counts up
     rather than toggling, so every tap is a new value and the burst runs
     again instead of sitting still. */
  const [previewTick, setPreviewTick] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  useEffect(() => {
    if (!previewing) return;
    /* Long enough to watch a piece cross the screen once. The field is
       built to be lived with, not looked at, so ten seconds says more
       than three would. */
    const timer = setTimeout(() => setPreviewing(false), 10000);
    return () => clearTimeout(timer);
  }, [previewing, previewTick]);
  const ambience = useMemo(() => ambienceFor(new Date()), []);
  const { preferences } = useQuranPreferences();
  const womens = useWomens();
  const lock = useLockConfig();
  /* Shown under "Quran reading" so the row describes what is actually in
     force rather than a guess that drifts out of step with the reader. */
  const scriptLabel = preferences.scriptName || T('Uthmani');
  const translationLabel = preferences.translationName || T('Sahih International');
  /* Registered on the overlay layer rather than drawn inside the page: the

     floating tab bar paints after the screens, so a sheet rendered inline is

     drawn underneath it and its lower rows cannot be reached. */

  useOverlaySheet('settings-app-language', pickingApp, () => (

    <LanguagePickerSheet rtl={rtl} T={T} rows={appLanguageRows} selected={language}

      onPick={(code)=>setLanguage(code as AppLanguage)} onClose={()=>setPickingApp(false)}/>

  ), () => setPickingApp(false));



  return <Page>
    <ScrollView {...SCROLL} contentContainerStyle={s.scroll}>
      {/* Settings is the root of its stack, so goBack() alone would sit there.
          goBackOrHome sends a reader who arrived by deep link back to the tabs. */}
      <View style={s.backRow}><IconButton name={rtl ? 'arrow-forward' : 'arrow-back'} label={tx(language,'Back')} onPress={() => goBackOrHome(navigation)} /></View>
      <TopBar overline={tx(language, 'PRIVATE BY DESIGN')} title={tx(language, 'Settings')} right={<MotionGlyph name="shield-checkmark-outline" size={20} />} />
      <LinearGradient colors={[C.heroA, C.green]} style={s.privacyHero}>
        <MotionGlyph name="shield-checkmark-outline" size={25} inverse />
        <View style={{ flex: 1 }}>
          <Text style={s.profileName}>{tx(language, 'No account. No tracking.')}</Text>
          <Text style={s.profileSub}>{tx(language, 'Your worship stays private and your preferences remain on this device.')}</Text>
        </View>
      </LinearGradient>
      <View style={s.privacyPoints}>
        <View style={s.privacyPoint}>{ico('person-remove-outline', 19, C.green)}<Text style={s.privacyPointText}>{tx(language, 'No sign-up')}</Text></View>
        <View style={s.privacyPoint}>{ico('cloud-offline-outline', 19, C.green)}<Text style={s.privacyPointText}>{tx(language, 'No cloud profile')}</Text></View>
        <View style={s.privacyPoint}>{ico('analytics-outline', 19, C.green)}<Text style={s.privacyPointText}>{tx(language, 'No ad tracking')}</Text></View>
      </View>

      <Section title={tx(language, 'Prayer times')} />
      <View style={s.preferencePanel}>
        <PanelHead tool="Prayer" title={tx(language, 'Calculation method')} note={tx(language, 'Saved on this device and applied to every prayer time.')} />
        <View style={s.choiceGrid}>{PRAYER_METHODS.map(method => <ChoicePill key={method.id} label={rtl ? method.ar : method.name} selected={settings.calculationMethod === method.id} onPress={() => update({ calculationMethod: method.id, calculationMethodName: method.name })} />)}</View>
        <Text style={s.preferenceLabel}>{tx(language, 'ASR MADHAB')}</Text>
        <View style={s.choiceRow}>
          <ChoicePill label={tx(language, 'Shafi')} selected={settings.madhab === 'shafi'} onPress={() => update({ madhab: 'shafi' })} />
          <ChoicePill label={tx(language, 'Hanafi')} selected={settings.madhab === 'hanafi'} onPress={() => update({ madhab: 'hanafi' })} />
        </View>
        <Text style={s.preferenceLabel}>{tx(language, 'TIME FORMAT')}</Text>
        <View style={s.choiceRow}>
          <ChoicePill label={tx(language, '12 hour')} selected={settings.timeFormat === '12'} onPress={() => update({ timeFormat: '12' })} />
          <ChoicePill label={tx(language, '24 hour')} selected={settings.timeFormat === '24'} onPress={() => update({ timeFormat: '24' })} />
        </View>
      </View>

      <Section title={T('Theme')} />
      <View style={s.preferencePanel}>
        <PanelHead tool="Theme" title={T('Theme')} note={T('Which colours the app wears. Each theme has its own light and dark.')} />
        <View style={s.choiceGrid}>
          <ChoicePill label={T('Islamic')} selected={themeName === 'islamic'} onPress={() => setTheme('islamic')} swatch={<ThemeMark theme="islamic" height={11} />} />
          <ChoicePill label={T('Palestine')} selected={themeName === 'palestine'} onPress={() => setTheme('palestine')} swatch={<ThemeMark theme="palestine" height={11} />} />
        </View>
      </View>

      <Section title={T('Appearance')} />
      <View style={s.preferencePanel}>
        <PanelHead glyph={themeMode === 'dark' ? 'moon-outline' : themeMode === 'light' ? 'sunny-outline' : 'contrast-outline'} title={T('Appearance')} note={T('Light, dark, or whatever the device is set to')} />
        <View style={s.choiceGrid}>
          <ChoicePill label={T('System')} selected={themeMode === 'system'} onPress={() => setMode('system')} />
          <ChoicePill label={T('Light')} selected={themeMode === 'light'} onPress={() => setMode('light')} />
          <ChoicePill label={T('Dark')} selected={themeMode === 'dark'} onPress={() => setMode('dark')} />
        </View>
      </View>

      <Section title={T('Touch')} />
      <View style={s.preferencePanel}>
        <PanelHead glyph="pulse-outline" title={T('Haptics')} note={T('Whether the app is felt as well as seen')} />
        <View style={s.setting}>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Vibrate on press')}</Text>
            <Text style={s.meta}>{isHapticsSupported()
              ? T('Every tap, toggle and counter answers with a small vibration')
              : T('This device cannot vibrate, so this switch changes nothing')}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch
              accessibilityLabel={T('Vibrate on press')}
              value={settings.hapticsEnabled !== false}
              trackColor={{ true: C.green }}
              onValueChange={(value) => {
                /* turning it on buzzes once, so the switch explains itself
                   in the same language it is describing */
                if (value) haptic('toggle');
                void update({ hapticsEnabled: value });
              }}
            />
          </View>
        </View>
      </View>

      {/* Two things in here that are easy to love and easy to resent, so
          both get a switch. Somebody who opens a prayer app and gets light
          drifting over it will either be delighted or will want it gone, and
          that should be her call rather than the app's. */}
      <Section title={T('Ambience')} />
      <View style={s.preferencePanel}>
        <PanelHead glyph="sparkles-outline" title={T('On the Home screen')} note={T('Something quiet drifting, and a greeting on Eid')} />
        <View style={s.setting}>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Ambient light')}</Text>
            <Text style={s.meta}>{still
              ? T('Your device is set to reduce motion, so nothing will drift')
              : ambience === null || ambience === 'confetti'
                ? T('Nothing today — a warm light falls through Ramadan')
                : T(AMBIENCE_NOTE[ambience])}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch
              accessibilityLabel={T('Ambient light')}
              disabled={still}
              value={settings.ambientEffects !== false && !still}
              trackColor={{ true: C.green }}
              onValueChange={(value) => {
                if (value) haptic('toggle');
                void update({ ambientEffects: value });
              }}
            />
          </View>
        </View>
        <View style={s.setting}>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Celebrate on Eid')}</Text>
            <Text style={s.meta}>{still
              ? T('Your device is set to reduce motion, so nothing will fall')
              : T('Falls once on the Home screen on the day of Eid, and not again until the next one')}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch
              accessibilityLabel={T('Celebrate on Eid')}
              /* Reduced motion is read from the device rather than stored,
                 so the switch is disabled rather than shown as off: the
                 preference she set is still hers, and it comes back the
                 moment the device setting does. */
              disabled={still}
              value={settings.celebrateEid !== false && !still}
              trackColor={{ true: C.green }}
              onValueChange={(value) => {
                if (value) haptic('toggle');
                void update({ celebrateEid: value });
              }}
            />
          </View>
        </View>
        <Tactile
          accessibilityRole="button"
          accessibilityLabel={T('Show me')}
          onPress={() => { haptic('toggle'); setPreviewTick((n) => n + 1); setPreviewing(true); }}
          style={s.setting}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Show me')}</Text>
            <Text style={s.meta}>{still
              ? T('Nothing to show while your device is set to reduce motion')
              : previewing ? T('Playing now') : T('Play what the Home screen is showing today')}</Text>
          </View>
          {ico('play-circle', 22, C.green)}
        </Tactile>
      </View>

      <Section title={tx(language, 'Preferences')} />
      <View style={s.settings}>
        <Tactile accessibilityRole="button" accessibilityState={{expanded:pickingApp}} accessibilityLabel={`${T('Language')}: ${appLangLabel}`}
          onPress={()=>setPickingApp(true)} style={s.setting}>
          {/* The same ToolGraphic every other row here uses, rather than a
              hand-rolled tile: that one pinned a single Islamic drawing and
              knew nothing about the Palestine theme, so this was the only
              row in the section that did not follow the theme. */}
          <ToolGraphic tool="Language" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{T('App language')}</Text>
            {/* Named, rather than a switch that only knew about Arabic: there
                are three languages to choose between now, and a two-state
                control cannot hold three. */}
            <Text style={s.meta}>{appLangLabel}{appLangNote ? ` · ${appLangNote}` : ''}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>
        <Tactile accessibilityRole="button" accessibilityLabel={T('Quran reading')}
          onPress={() => navigation.navigate('Reader Settings')} style={s.setting}>
          <ToolGraphic tool="Quran Reading" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'Quran reading')}</Text>
            <Text style={s.meta}>{scriptLabel} · {translationLabel}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>
        <Tactile accessibilityRole="button" accessibilityLabel={tx(language, 'My reports')}
          onPress={() => navigation.navigate('My Reports')} style={s.setting}>
          <ToolGraphic tool="Corrections" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'My reports')}</Text>
            <Text style={s.meta}>{tx(language, 'Corrections you have sent, kept on your device')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>
        <View style={s.setting}>
          <ToolGraphic tool="Women’s worship" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'Women’s worship')}</Text>
            <Text style={s.meta}>{rtl ? tf(language, womens.optedIn ? 'Cycle, purity and Qada records · on this device only' : 'A private area for the cycle, purity and Qada records', {}) : (womens.optedIn ? 'Cycle, purity and Qada records · on this device only' : 'A private area for the cycle, purity and Qada records')}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch accessibilityLabel={T('Women’s worship')} value={womens.optedIn} onValueChange={(value) => void setOptedIn(value)} trackColor={{ true: C.green }} />
          </View>
        </View>
        {womens.optedIn && <Tactile accessibilityRole="button" accessibilityLabel={T('Lock and PIN')} onPress={() => navigation.navigate('Privacy Lock')} style={s.setting}>
          <ToolGraphic tool="Privacy lock" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'Lock and PIN')}</Text>
            <Text style={s.meta}>{rtl ? tf(language, lock.pinSet ? (lock.required ? 'Locked' : 'PIN saved, lock is off') : 'No PIN yet', {}) : (lock.pinSet ? (lock.required ? 'Locked' : 'PIN saved, lock is off') : 'No PIN yet')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>}
        <Tactile accessibilityRole="button" accessibilityLabel={T('Backup')} onPress={() => navigation.navigate('Backup')} style={s.setting}>
          <ToolGraphic tool="Backup" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'Backup')}</Text>
            <Text style={s.meta}>{tx(language, 'An encrypted copy, sealed with a password you choose')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>

        <Tactile accessibilityRole="button" accessibilityLabel={T('Storage')} onPress={() => navigation.navigate('Storage')} style={s.setting}>
          <ToolGraphic tool="Storage" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{T('Storage')}</Text>
            <Text style={s.meta}>{T('What the app is holding on this device')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Tactile>
      </View>

      <Section title={tx(language, 'About')} />
      <Pressable onPress={() => navigation.navigate('Data sources')} style={s.settings} accessibilityRole="button" accessibilityLabel={T('Data sources')}>
        <View style={s.setting}>
          <ToolGraphic tool="Data Sources" size={49} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{tx(language, 'Data sources')}</Text>
            <Text style={s.meta}>{tx(language, 'Where the Quran text, prayer times, hadith and audio come from')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </View>
      </Pressable>
      <Section title={T('Legal')} />
      <View style={s.settings}>
        {[['privacy', T('Privacy Policy')], ['terms', T('Terms of Use')], ['datasafety', T('Data Safety')]].map(([key, label]) => (
          <Pressable key={key} accessibilityRole="button" onPress={() => navigation.navigate('Legal', { doc: key })} style={s.settingsRow}>
            <Text style={s.settingName}>{label}</Text>
            {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
          </Pressable>
        ))}
      </View>

      <View style={s.madeWith}>
        <Text style={s.madeWithText}>{T('Made with')} ❤️ {T('for Ummah')}</Text>
      </View>
    </ScrollView>
    {/* Outside the ScrollView and after it: both of these belong to the whole
        screen, and neither should scroll away with the page underneath. Only
        one is ever live — on an Eid the ambience resolves to confetti and the
        field stands down, so the two are never competing. */}
    {ambience === 'confetti'
      ? <EidConfetti fire={previewing ? `preview-${previewTick}` : null} dark={dark} />
      : <AmbientField kind={ambience} dark={dark} active={previewing} />}
  </Page>}
import { DEFAULT_RECITER, editionsForLanguage, LANGUAGES, Language, LanguageCode, languageByCode, isRtl, pickEdition, HADITH_LANGUAGES, hadithLanguage } from './src/services/languages';

const navigationRef = createNavigationContainerRef<any>();
/**
 * Navigate, even when the tap that launched the app arrived before the
 * navigator existed.
 *
 * A notification tapped on a cold start is handed over while Root is still
 * mounting. Navigating a container ref that is not ready yet is dropped
 * without complaint: the app opens on Home and the reminder the person tapped
 * goes nowhere. So the intent is parked and replayed the moment the navigator
 * reports a state, and only once - otherwise every later navigation would
 * drag them back to it.
 */
function navigateWhenReady(name: string, params?: any) {
  const nav: any = navigationRef;
  if (nav.isReady?.()) { nav.navigate(name, params); return; }
  let unsub: (() => void) | undefined;
  let done = false;
  const fire = () => {
    if (done || !nav.isReady?.()) return;
    done = true;
    try { unsub?.(); } catch { /* already gone */ }
    nav.navigate(name, params);
  };
  unsub = nav.addListener?.('state', fire);
  /* It may have become ready between the check above and the subscribe. */
  setTimeout(fire, 0);
}

/**
 * Leave a screen, however it was reached and however deep it sits.
 *
 * Every back control in the app routes through here rather than calling
 * `navigation.goBack()` directly, because `goBack()` has two failure modes
 * and both of them strand the reader. At the bottom of a stack it is a silent
 * no-op, so the arrow looks broken. And where the navigation object is
 * missing — a screen that never took it as a prop — it throws, which the
 * screen boundary turns into an empty page. The legal documents did exactly
 * that: they were given a header with no navigator behind it.
 *
 * So: go back when there is somewhere to go back to, and otherwise land on
 * the tabs. A control that always does something is worth more than one that
 * is usually right.
 */
function goBackOrHome(navigation?: any) {
  try {
    if (navigation?.canGoBack?.()) { navigation.goBack(); return; }
    if (navigation?.goBack) { navigation.goBack(); return; }
  } catch { /* there is nowhere to go back to — fall through */ }
  /* Reached when the navigator was missing or already at its root. */
  try { navigateWhenReady('Main'); } catch { /* the navigator is not ready */ }
}
const AUDIO_LANGUAGES: Record<string, string> = {
  en: 'English', ur: 'Urdu', zh: 'Chinese', fr: 'French', ru: 'Russian',
  kk: 'Kazakh', tr: 'Turkish', fa: 'Persian', uz: 'Uzbek', my: 'Burmese'
};
const AUDIO_LANGUAGES_AR: Record<string, string> = {
  en: 'الإنجليزية', ur: 'الأردية', zh: 'الصينية', fr: 'الفرنسية', ru: 'الروسية',
  kk: 'الكازاخية', tr: 'التركية', fa: 'الفارسية', uz: 'الأوزبكية', my: 'البورمية'
};
const languageName = (code: string, rtl: boolean) =>
  (rtl ? AUDIO_LANGUAGES_AR : AUDIO_LANGUAGES)[code] || code;

/**
 * A level from nothing to full, dragged with the thumb.
 *
 * Built the same way as the seek bar so the two feel like one instrument:
 * the same track, the same knob, the same resistance under the finger. Volume
 * is the obvious use, but nothing about it is specific to sound.
 */
function LevelBar({ value, onValue, label, tint = C.green }: {
  value: number; onValue: (next: number) => void; label: string; tint?: string;
}) {
  const width = useRef(0);
  const [drag, setDrag] = useState<number | null>(null);
  const clamp = (next: number) => Math.min(1, Math.max(0, next));
  const shown = drag ?? clamp(value);

  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => setDrag(clamp(event.nativeEvent.locationX / (width.current || 1))),
    onPanResponderMove: (event) => setDrag(clamp(event.nativeEvent.locationX / (width.current || 1))),
    onPanResponderRelease: (event) => {
      const next = clamp(event.nativeEvent.locationX / (width.current || 1));
      setDrag(null);
      onValue(next);
    }
  })).current;

  return <View accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ now: Math.round(shown * 100), min: 0, max: 100 }}
    onLayout={(event) => { width.current = event.nativeEvent.layout.width; }}
    {...responder.panHandlers} style={s.levelTrack}>
    <View style={[s.levelFill, { width: `${shown * 100}%`, backgroundColor: tint }]} />
    <View style={[s.levelKnob, { left: `${shown * 100}%`, borderColor: tint }]} />
  </View>;
}

function SeekBar({ position, duration, onSeek }: { position: number; duration: number; onSeek: (value: number) => void }) {
  const { rtl , language }=useLanguage();
  const width = useRef(0);
  const [drag, setDrag] = useState<number | null>(null);
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  const ratio = duration > 0 ? clamp(position / duration) : 0;
  const value = drag ?? ratio;
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => setDrag(clamp(event.nativeEvent.locationX / (width.current || 1))),
    onPanResponderMove: (event) => setDrag(clamp(event.nativeEvent.locationX / (width.current || 1))),
    onPanResponderRelease: (event) => { const next = clamp(event.nativeEvent.locationX / (width.current || 1)); setDrag(null); onSeek(next * duration); }
  })).current;
  return <View accessibilityRole="adjustable" accessibilityLabel={tx(language,'Seek within the recitation')} onLayout={(event) => { width.current = event.nativeEvent.layout.width; }} {...responder.panHandlers} style={s.seekTrack}>
    <View style={[s.seekFill, { width: `${value * 100}%` }]} />
    <View style={[s.seekKnob, { left: `${value * 100}%` }]} />
  </View>;
}

function MiniPlayer() {
  const audio = useAudio();
  const { rtl , language }=useLanguage();
  if (!audio.track) return null;
  const bottom = MINI_PLAYER_BOTTOM;
  const open = () => { if (navigationRef.isReady()) (navigationRef as any).navigate('Quran', { screen: 'Audio Player' }); };
  return <View style={[s.miniPlayer, { bottom, flexDirection: 'row' }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={tx(language,'Open the audio player')} onPress={open} style={s.miniBody}>
      <View style={s.miniArt}>{audio.buffering ? <ActivityIndicator color={C.green} /> : <ToolGraphic tool="Recitations" size={38} />}</View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={s.miniTitle}>{audio.track.title}</Text>
        <Text numberOfLines={1} style={s.miniMeta}>{audio.track.performer}{audio.buffering ? ' · buffering' : audio.playing ? ' · playing' : ''}</Text>
      </View>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={audio.playing ? 'Pause recitation' : 'Play recitation'} onPress={() => { void togglePlayback(); }} style={s.miniBtn}>{ico(audio.playing ? 'pause' : 'play', 19, C.white)}</Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={tx(language,'Close the player')} onPress={() => { void clearQueue(); }} style={s.miniGhost}>{ico('close', 17, C.muted)}</Pressable>
  </View>;
}

async function playFromReader(chapter: Chapter, verse: Verse, rtl = false) {
  try {
    const settings = getAudioSettings();
    const ayah = Number(String(verse.verse_key).split(':')[1] || 1);
    let queue = await buildQueueForChapter(chapter.id, chapter.name_simple, settings);
    let index = queue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayah);
    // A full-Surah reciter is a single file covering the whole chapter, so it has no
    // track for the tapped ayah. Fall back to per-ayah audio (verse mode) so tapping a
    // verse plays that verse instead of restarting the Surah from the beginning.
    if (index < 0) {
      try {
        const verseQueue = await buildQueueForChapter(chapter.id, chapter.name_simple, { ...settings, reciterMode: 'verse' });
        const verseIndex = verseQueue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayah);
        if (verseIndex >= 0) { queue = verseQueue; index = verseIndex; }
      } catch { /* no per-ayah audio for this reciter — keep the queue we already have */ }
    }
    await playQueue(queue, index < 0 ? 0 : index);
  } catch (e: any) { Alert.alert(tx(getAppLanguage(),'Audio unavailable'),tx(getAppLanguage(),e.message)); }
}

async function playSurahFromReader(chapter: Chapter, rtl = false) {
  try {
    const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, getAudioSettings());
    await playQueue(queue, 0);
  } catch (e: any) { Alert.alert(tx(getAppLanguage(),'Audio unavailable'),tx(getAppLanguage(),e.message)); }
}

function AudioCenterScreen({ navigation }: any) {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const ar = language === 'ar';
  const [settings, setSettings] = useState<AudioSettings>(getAudioSettings());
  const [editions, setEditions] = useState<{ arabic: AudioEdition[]; translation: AudioEdition[] }>({ arabic: [], translation: [] });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [recent, setRecent] = useState<RecentPlay[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [session, setSession] = useState<AudioSession | null>(null);
  const [surahReciters, setSurahReciters] = useState<SurahReciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'reciters' | 'translation' | 'surah' | 'saved'>('reciters');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const audio = useAudio();

  const refreshLibrary = () => Promise.all([loadRecentPlays().then(setRecent), loadPlaylists().then(setPlaylists), loadAudioSession().then(setSession)]);
  const load = () => {
    setLoading(true); setError('');
    Promise.all([loadAudioEditions(), getChapters(), loadSurahReciters()])
      .then(([list, chapterList, reciterList]) => { setEditions(list); setChapters(chapterList); setSurahReciters(reciterList); })
      .catch((e: any) => setError(T(e.message)))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); void refreshLibrary(); }, []);
  useEffect(() => { const unsubscribe = navigation.addListener('focus', () => { void refreshLibrary(); }); return unsubscribe; }, [navigation]);

  const update = async (patch: Partial<AudioSettings>) => setSettings(await saveAudioSettings(patch));

  const startChapter = async (chapter: Chapter, ayah = 1) => {
    setBusy(`chapter-${chapter.id}`);
    try {
      const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, settings);
      const index = queue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayah);
      await playQueue(queue, index < 0 ? 0 : index);
      await refreshLibrary();
    } catch (e: any) { Alert.alert(T('Audio unavailable'),T(e.message)); } finally { setBusy(''); }
  };

  const sample = async (edition: AudioEdition, kind: AudioTrackKind) => {
    setBusy(`sample-${edition.identifier}`);
    try {
      const next: AudioSettings = kind === 'translation'
        ? { ...settings, translationAudioEnabled: true, translationEdition: edition.identifier, translationName: edition.englishName, sequential: false }
        : { ...settings, reciter: edition.identifier, reciterName: edition.englishName, translationAudioEnabled: false };
      const queue = await buildSurahQueue(1, 'Al-Fatihah', next);
      const index = kind === 'translation' ? queue.findIndex((track) => track.kind === 'translation') : 0;
      await playQueue(queue, index < 0 ? 0 : index);
    } catch (e: any) { Alert.alert(T('Sample unavailable'),T(e.message)); } finally { setBusy(''); }
  };

  const resumeSession = async () => {
    if (!session) return;
    setBusy('resume');
    try {
      const queue = await buildQueueForChapter(session.chapterId, session.chapterName, {
        ...settings,
        reciterMode: session.reciterMode || 'verse',
        surahReciterId: session.surahReciterId ?? settings.surahReciterId,
        reciter: session.edition,
        translationEdition: session.translationEdition,
        sequential: session.sequential,
        translationAudioEnabled: session.sequential
      });
      await playQueue(queue, session.index);
      if (session.position > 1) await seekTo(session.position);
      await refreshLibrary();
    } catch (e: any) { Alert.alert(T('Could not resume'),T(e.message)); } finally { setBusy(''); }
  };

  const saveCurrentQueue = async () => {
    if (!audio.queue.length) return;
    setPlaylists(await savePlaylist(playlistName, audio.queue));
    setPlaylistName('');
  };

  const needle = query.trim().toLowerCase();
  const reciters = editions.arabic.filter((edition) => `${edition.englishName} ${edition.identifier}`.toLowerCase().includes(needle));
  const translations = editions.translation.filter((edition) => `${edition.englishName} ${languageName(edition.language, rtl)}`.toLowerCase().includes(needle));
  const shownChapters = chapters.filter((chapter) => `${chapter.id} ${chapter.name_simple} ${chapter.translated_name?.name || ''}`.toLowerCase().includes(needle));
  const selectedReciter = editions.arabic.find((edition) => edition.identifier === settings.reciter);

  return <Page><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title={T('Quran audio')} navigation={navigation} />
    
    <Text style={s.dataTitle}>{T('Listen by verse, Surah or playlist')}</Text>
    <Text style={s.intro}>{T('Recitation streams live from attributed public sources. Playback, recents and playlists stay on this device.')}</Text>

    {!!session && <Pressable onPress={() => { void resumeSession(); }} style={s.continueBar}>
      <ToolGraphic tool="Recitations" size={52} />
      <View style={{ flex: 1 }}><Text style={s.dailyKicker}>{T('CONTINUE LISTENING')}</Text><Text style={s.settingName}>{session.chapterName}</Text><Text style={s.meta}>{busy === 'resume' ? T('Preparing…') : (tf(language,'Verse queue · saved {d}',{d:new Date(session.savedAt).toLocaleDateString()}))}</Text></View>
      {ico('play-circle', 22, C.green)}
    </Pressable>}

    {!!audio.track && <Pressable onPress={() => navigation.navigate('Audio Player')} style={s.audioHero}>
      <View style={s.audioHeroRow}>
        <ToolGraphic tool="Recitations" size={60} />
        <View style={{ flex: 1 }}><Text style={s.audioHeroKicker}>{T('NOW PLAYING')}</Text><Text numberOfLines={1} style={s.audioHeroTitle}>{audio.track.title}</Text><Text numberOfLines={1} style={s.audioHeroMeta}>{audio.track.performer}</Text></View>
        {ico('chevron-forward', 20, C.white)}
      </View>
    </Pressable>}

    <View style={s.choiceRow}>
      <ChoicePill label={T('Reciters')} selected={tab === 'reciters'} onPress={() => { setTab('reciters'); setQuery(''); }} />
      <ChoicePill label={T('Translation')} selected={tab === 'translation'} onPress={() => { setTab('translation'); setQuery(''); }} />
      <ChoicePill label={T('Surahs')} selected={tab === 'surah'} onPress={() => { setTab('surah'); setQuery(''); }} />
      <ChoicePill label={T('Saved')} selected={tab === 'saved'} onPress={() => { setTab('saved'); setQuery(''); }} />
    </View>

    {loading ? <SkeletonList rows={6} /> : !!error ? <ErrorState message={error} retry={load} /> : <>
      {tab === 'reciters' && <>
        <Section title={T('Recitation source')} />
        <View style={s.choiceRow}>
          <ChoicePill label={T('Verse by verse')} selected={settings.reciterMode === 'verse'} onPress={() => { void update({ reciterMode: 'verse' }); }} />
          <ChoicePill label={T('Full Surah')} selected={settings.reciterMode === 'surah'} onPress={() => { void update({ reciterMode: 'surah' }); }} />
        </View>
        <Text style={s.meta}>{T(settings.reciterMode === 'verse' ? 'Verse-by-verse files, one track per ayah, with translation audio and reader controls.' : 'Complete Surah recordings — one continuous track per Surah.')}</Text>
        <Section title={T(settings.reciterMode === 'verse' ? 'Arabic reciters' : 'Full-Surah reciters')} />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search reciters')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search a reciter')} placeholderTextColor={C.muted} />{query.length > 0 && <Pressable accessibilityLabel={T('Clear reciter search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{(settings.reciterMode === 'verse' ? reciters.map((edition) => <View key={edition.identifier} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.reciter === edition.identifier }} onPress={() => { void update({ reciter: edition.identifier, reciterName: edition.englishName }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={47} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{reciterLabel(edition.englishName, rtl)}</Text><Text style={s.meta}>{T('Verse by verse')} · {edition.identifier}</Text></View>
            {ico(settings.reciter === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.reciter === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play a sample from')} ${reciterLabel(edition.englishName, rtl)}`} onPress={() => { void sample(edition, 'arabic'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>) : surahReciters.filter((reciter) => reciter.name.toLowerCase().includes(needle)).map((reciter) => <View key={reciter.id} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.surahReciterId === reciter.id }} onPress={() => { void update({ surahReciterId: reciter.id, surahReciterName: reciter.name }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={47} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{reciter.name}</Text><Text style={s.meta}>{reciter.rewaya}{reciter.surahTotal ? (tf(language,' · {n} Surahs',{n:reciter.surahTotal})) : ''}</Text></View>
            {ico(settings.surahReciterId === reciter.id ? 'checkmark-circle' : 'ellipse', 20, settings.surahReciterId === reciter.id ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play a sample from')} ${reciter.name}`} onPress={() => { void startChapter({ id: 1, name_simple: 'Al-Fatihah', name_arabic: 'الفاتحة', verses_count: 7 } as Chapter, 1); }} style={s.audioRowAction}>{busy === 'chapter-1' ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>))}</View>
      </>}

      {tab === 'translation' && <>
        <Section title={T('Translation audio')} />
        <View style={s.settings}>
          <View style={s.setting}>
            <MotionGlyph name="language-outline" size={19} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Translation audio')}</Text><Text style={s.meta}>{T('Play the meaning after each verse')}</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch value={settings.translationAudioEnabled} onValueChange={(value) => { void update({ translationAudioEnabled: value }); }} trackColor={{ true: C.green }} /></View>
          </View>
          {settings.translationAudioEnabled && <View style={s.setting}>
            <MotionGlyph name="layers-outline" size={19} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Arabic then translation')}</Text><Text style={s.meta}>{T('Keep both sections in one queue')}</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch value={settings.sequential} onValueChange={(value) => { void update({ sequential: value }); }} trackColor={{ true: C.green }} /></View>
          </View>}
        </View>
        <Text style={s.preferenceLabel}>{T('AVAILABLE LANGUAGES')}</Text>
        <View style={s.settings}>{translations.map((edition) => <View key={edition.identifier} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.translationEdition === edition.identifier }} onPress={() => { void update({ translationEdition: edition.identifier, translationName: edition.englishName }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Translations" size={47} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{languageName(edition.language, rtl)}</Text><Text style={s.meta}>{edition.englishName}</Text></View>
            {ico(settings.translationEdition === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.translationEdition === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play a sample in')} ${(rtl ? AUDIO_LANGUAGES_AR : AUDIO_LANGUAGES)[edition.language] || edition.language}`} onPress={() => { void sample(edition, 'translation'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
        <View style={s.sourceCard}>{ico('information-circle', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Languages come from the source')}</Text><Text style={s.sourceBody}>{T('Only languages that are published are listed. Others are not shown rather than faked.')}</Text></View></View>
      </>}

      {tab === 'surah' && <>
        <Section title={T('Play a Surah')} />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search Surahs')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search 114 Surahs')} placeholderTextColor={C.muted} />{query.length > 0 && <Pressable accessibilityLabel={T('Clear Surah search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{shownChapters.map((chapter) => <View key={chapter.id} style={s.audioRow}>
          <Pressable onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowMain}>
            <View style={s.surahNo}><Text style={s.surahNoText}>{chapter.id}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.settingName}>{chapter.name_simple}</Text><Text style={s.meta}>{ar?`${chapter.verses_count} ${arNoun(chapter.verses_count, 'آية', 'آيتان', 'آيات', 'آية')} · ${chapter.translated_name?.name}`:tf(language,'{n} verses · {t}',{n:chapter.verses_count,t:chapter.translated_name?.name ?? ''})}</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play')} ${chapter.name_simple}`} onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowAction}>{busy === `chapter-${chapter.id}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
      </>}

      {tab === 'saved' && <>
        <Section title={T('Recently played')} action={recent.length ? 'Clear' : undefined} onPress={recent.length ? () => { void clearRecentPlays().then(() => setRecent([])); } : undefined} />
        {!recent.length ? <Text style={s.meta}>{T('Nothing played yet.')}</Text> : recent.map((item, index) => <Pressable key={`${item.chapterId}-${item.edition}-${index}`} onPress={() => { const chapter = chapters.find((c) => c.id === item.chapterId); if (chapter) void startChapter(chapter, item.ayahNumber); }} style={s.queueRow}>
          <ToolGraphic tool="Recitations" size={43} />
          <View style={{ flex: 1 }}><Text style={s.settingName}>{tf(language,'{c} · verse {a}',{c:item.chapterName,a:item.ayahNumber})}</Text><Text style={s.meta}>{item.performer}</Text></View>
          {ico('play-circle', 20, C.green)}
        </Pressable>)}
        <Section title={T('Playlists')} />
        {!playlists.length ? <Text style={s.meta}>{T('Save the current queue to build a playlist.')}</Text> : playlists.map((playlist) => <View key={playlist.id} style={s.queueRow}>
          <Pressable onPress={() => { void playQueue(playlist.tracks, 0); }} style={s.audioRowMain}>
            <ToolGraphic tool="Audio" size={43} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{playlist.name}</Text><Text style={s.meta}>{ar?`${playlist.tracks.length} ${arNoun(playlist.tracks.length, 'مقطع', 'مقطعان', 'مقاطع', 'مقطعًا')} · محفوظ على الجهاز`:tf(language,'{n} tracks · saved locally',{n:playlist.tracks.length})}</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`${T('Delete')} ${playlist.name}`} onPress={() => { void deletePlaylist(playlist.id).then(setPlaylists); }} style={s.audioRowAction}>{ico('trash', 19, C.coral)}</Pressable>
        </View>)}
        {!!audio.queue.length && <View style={s.formCard}>
          <Text style={s.preferenceLabel}>{T('SAVE CURRENT QUEUE')}</Text>
          <View style={s.fieldRow}>
            <TextInput accessibilityLabel={T('Playlist name')} value={playlistName} onChangeText={setPlaylistName} placeholder={audio.track ? audio.track.chapterName : 'Playlist name'} placeholderTextColor={C.muted} style={[s.textField, { flex: 1, marginTop: 0 }]} />
            <Tactile onPress={() => { void saveCurrentQueue(); }} style={s.primarySmall}><Text style={s.primaryText}>{T('Save')}</Text></Tactile>
          </View>
        </View>}
      </>}
    </>}

    <View style={s.sourceCard}>{ico('server', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Sources')}</Text><Text style={s.sourceBody}>{T('Verse-by-verse: one track for each ayah. Full-Surah: a complete recitation of the Surah.')}</Text></View></View>
    {settings.reciterMode === 'verse' ? (!!selectedReciter && <Text style={s.meta}>{tf(language,'Selected reciter: {r}',{r:reciterLabel(selectedReciter.englishName, rtl)})}</Text>) : <Text style={s.meta}>{tf(language,'Selected full-Surah reciter: {r} · {n} available',{r:reciterLabel(settings.surahReciterName || T('Choose from the list above'), rtl),n:surahReciters.length})}</Text>}
  </ScrollView></Page>;
}

function AudioPlayerScreen({ navigation }: any) {
  const audio = useAudio();
  const { rtl , language }=useLanguage();
  const ar = language === 'ar';
  const T = (text: string) => tx(language, text);
  const { preferences, update } = useQuranPreferences();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  /* The translations that can actually be *played*. They are not the
     translations shown beside the Arabic in the reader: those are texts, and
     this list is voices. Offering the reader's list here meant picking a name
     and hearing nothing change, because the audio was never re-pointed. */
  const [audioEditions, setAudioEditions] = useState<AudioEdition[]>([]);
  const [pickingTranslation, setPickingTranslation] = useState(false);
  /* The settings object rather than the playback state: volume, repeat count
     and the range are settings that persist, and `useAudio` only carries what
     is true of the playback at this instant. */
  const [settings, setSettingsState] = useState<AudioSettings>(getAudioSettings());
  useEffect(() => { void loadAudioSettings().then(setSettingsState); }, []);
  useEffect(() => { void loadPlaylists().then(setPlaylists); }, []);
  useEffect(() => { loadAudioEditions().then((list) => setAudioEditions(list.translation)).catch(() => undefined); }, []);
  const track = audio.track;
  /* The player carries the translation switch because that is where you notice
     you want a different one - mid-verse, when a wording does not land.

     It points at the *audio* translation, which is a different thing from the
     text beside the Arabic and is stored separately. Changing it here changes
     what you hear; the words on the page are left alone. */
  const shownEditions = audioEditions.slice(0, 8);

  if (!track) return <Page><ToolBar title={T('Audio player')} navigation={navigation} /><View style={s.dataPage}>
    <ToolGraphic tool="Recitations" size={87} />
    <Text style={s.dataTitle}>{T('Nothing is playing')}</Text>
    <Text style={s.intro}>{T('Choose a reciter and a Surah from the audio center to start listening.')}</Text>
    <Tactile onPress={() => goBackOrHome(navigation)} style={s.primary}><Text style={s.primaryText}>{T('Open audio center')}</Text></Tactile>
  </View></Page>;

  return <Page><ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title={T('Now playing')} navigation={navigation} />

    <LinearGradient colors={[C.heroA, C.green]} style={s.playerHero}>
      <PlayerAura />
      <View style={s.playerArtRing}><ToolGraphic tool="Recitations" size={110} /></View>
      <Text style={s.playerTitle}>{track.title}</Text>
      <Text style={s.playerPerformer}>{track.performer}</Text>
      <View style={s.trackBadge}><Text style={s.trackBadgeText}>{track.kind === 'translation' ? 'TRANSLATION' : 'ARABIC RECITATION'}</Text></View>
    </LinearGradient>

    {!!track.text && <Text style={s.playerArabic}>{track.text}</Text>}

    <Pressable accessibilityRole="button" accessibilityState={{ expanded: pickingTranslation }}
      accessibilityLabel={`${T('Translation')}: ${settings.translationName}`}
      onPress={() => setPickingTranslation((v) => !v)} style={s.playerTranslationRow}>
      <Flag code={languageOf(settings.translationEdition, '')} size={18} />
      <View style={{ flex: 1 }}>
        <Text style={s.settingName}>{T('Translation')}</Text>
        <Text style={s.meta} numberOfLines={1}>{settings.translationName}</Text>
      </View>
      {ico(pickingTranslation ? 'chevron-up' : 'chevron-down', 18, C.green)}
    </Pressable>
    {!!pickingTranslation && <View style={s.playerTranslationList}>
      {shownEditions.map((e) => <Pressable key={e.identifier}
        accessibilityRole="radio" accessibilityState={{ checked: settings.translationEdition === e.identifier }}
        onPress={() => { void saveAudioSettings({ translationEdition: e.identifier, translationName: e.englishName, translationAudioEnabled: true }).then(setSettingsState); setPickingTranslation(false); }}
        style={[s.playerTranslationOption, settings.translationEdition === e.identifier && s.playerTranslationOptionOn]}>
        <Flag code={languageOf(e.identifier, e.language)} size={16} />
        <Text style={[s.settingName, { flex: 1 }]} numberOfLines={1}>{e.englishName}</Text>
        {settings.translationEdition === e.identifier && ico('checkmark-circle', 18, C.green)}
      </Pressable>)}
      <Pressable accessibilityRole="button" accessibilityLabel={T('All translations')}
        onPress={() => navigation.navigate('Quran Audio')} style={s.playerTranslationOptionLast}>
        <Text style={[s.settingName, { flex: 1, color: C.green }]}>{T('All translations')}</Text>
        {ico(rtl ? 'arrow-back' : 'arrow-forward', 18, C.green)}
      </Pressable>
    </View>}

    <View style={s.audioTimes}>
      <Text style={s.meta}>{formatClock(audio.position)}</Text>
      <Text style={s.meta}>{audio.buffering ? 'Buffering…' : formatClock(audio.duration)}</Text>
    </View>
    <View style={s.playerSeek}><SeekBar position={audio.position} duration={audio.duration} onSeek={(value) => { void seekTo(value); }} /></View>

    <View style={s.audioControls}>
      <Pressable accessibilityLabel={T('Previous verse')} onPress={() => { void previousTrack(); }} style={s.audioControlBtn}>{ico('play-skip-back', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={audio.playing ? 'Pause' : 'Play'} onPress={() => { void togglePlayback(); }} style={s.audioControlMain}>{audio.playing ? ico('pause', 28, C.white) : ico('play', 28, C.white)}</Pressable>
      <Pressable accessibilityLabel={T('Next verse')} onPress={() => { void nextTrack(); }} style={s.audioControlBtn}>{ico('play-skip-forward', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={`${T('Repeat mode')}: ${T(audio.repeat === 'one' ? 'Repeat one' : audio.repeat === 'all' ? 'Repeat all' : 'Repeat off')}`} onPress={() => setRepeatMode(audio.repeat === 'none' ? 'all' : audio.repeat === 'all' ? 'one' : 'none')} style={s.audioControlBtn}>{ico('repeat', 19, audio.repeat === 'none' ? C.muted : C.green)}<Text style={s.rateText}>{audio.repeat === 'one' ? '1' : audio.repeat === 'all' ? '∞' : '—'}</Text></Pressable>
    </View>

    <View style={s.playerRow}>
      <Tactile accessibilityLabel={T('Stop playback')} onPress={() => { void stopPlayback(); }} style={s.secondary}>{ico('stop', 17, C.green)}<Text style={s.secondaryText}>{T('Stop')}</Text></Tactile>
      <Tactile accessibilityLabel={T('Clear the queue')} onPress={() => { void clearQueue(); }} style={s.secondary}>{ico('trash', 17, C.green)}<Text style={s.secondaryText}>{T('Clear queue')}</Text></Tactile>
    </View>

    <Text style={s.preferenceLabel}>{T('SPEED')}</Text>
    <View style={s.rateRow}>
      <Tactile accessibilityLabel={T('Slower')} onPress={() => { void stepPlaybackRate(false); }} style={s.stepButton}>{ico('remove', 19, C.green)}</Tactile>
      <Text style={s.rateValue}>{audio.rate.toFixed(2).replace(/0$/, '').replace(/\.$/, '')}×</Text>
      <Tactile accessibilityLabel={T('Faster')} onPress={() => { void stepPlaybackRate(true); }} style={s.stepButton}>{ico('add', 19, C.green)}</Tactile>
    </View>
    <View style={s.choiceRow}>{RATE_STEPS.map((rate) => <ChoicePill key={rate} label={`${rate}×`} selected={Math.abs(audio.rate - rate) < 0.001} onPress={() => { void setPlaybackRate(rate); }} />)}</View>
    <Text style={s.meta}>{T('Half speed to double. Pitch is held, so slowing the recitation does not make the voice drop.')}</Text>

    <Section title={T('Repeat')} />
    <View style={s.choiceRow}>
      {(['none', 'one', 'range', 'all'] as const).map((mode) => <ChoicePill key={mode}
        label={T(mode === 'none' ? 'Off' : mode === 'one' ? 'This verse' : mode === 'range' ? 'A passage' : 'The Surah')}
        selected={audio.repeat === mode} onPress={() => { setSettingsState({ ...settings, repeat: mode }); void setRepeatMode(mode); }} />)}
    </View>
    <Text style={s.meta}>{
      audio.repeat === 'none' ? T('Plays straight through, then stops.')
      : audio.repeat === 'one' ? T('The verse under your finger, again and again.')
      : audio.repeat === 'range' ? T('A stretch of verses, both ends included — for learning a passage.')
      : T('The whole Surah, then again from the top.')}</Text>

    {audio.repeat !== 'none' && <>
      <Text style={s.preferenceLabel}>{T('HOW MANY TIMES')}</Text>
      <View style={s.choiceRow}>{REPEAT_COUNT_CHOICES.map((count) => <ChoicePill key={count}
        label={count === REPEAT_FOREVER ? '∞' : String(count)}
        selected={(settings.repeatCount ?? 0) === count} onPress={() => { setSettingsState({ ...settings, repeatCount: count }); void setRepeatCount(count); }} />)}</View>
      <Text style={s.meta}>{T('Without end is the default: you stop when you know it, not when a counter runs out.')}</Text>
    </>}

    {audio.repeat === 'range' && <View style={s.playerCard}>
      <Text style={s.preferenceLabel}>{T('WHICH VERSES')}</Text>
      <View style={s.rangeRow}>
        <View style={s.rangeEnd}><Text style={s.meta}>{T('From')}</Text>
          <View style={s.stepperSmall}>
            <Tactile accessibilityLabel={T('Earlier start')} onPress={() => { const a = Math.max(1, settings.repeatRangeStart - 1); setSettingsState({ ...settings, repeatRangeStart: a }); void setRepeatRange(a, settings.repeatRangeEnd); }} style={s.stepButtonSmall}>{ico('remove', 15, C.green)}</Tactile>
            <Text style={s.rangeNumber}>{settings.repeatRangeStart}</Text>
            <Tactile accessibilityLabel={T('Later start')} onPress={() => { const a = Math.min(settings.repeatRangeEnd, settings.repeatRangeStart + 1); setSettingsState({ ...settings, repeatRangeStart: a }); void setRepeatRange(a, settings.repeatRangeEnd); }} style={s.stepButtonSmall}>{ico('add', 15, C.green)}</Tactile>
          </View>
        </View>
        <View style={s.rangeEnd}><Text style={s.meta}>{T('To')}</Text>
          <View style={s.stepperSmall}>
            <Tactile accessibilityLabel={T('Earlier end')} onPress={() => { const b = Math.max(settings.repeatRangeStart, settings.repeatRangeEnd - 1); setSettingsState({ ...settings, repeatRangeEnd: b }); void setRepeatRange(settings.repeatRangeStart, b); }} style={s.stepButtonSmall}>{ico('remove', 15, C.green)}</Tactile>
            <Text style={s.rangeNumber}>{settings.repeatRangeEnd}</Text>
            <Tactile accessibilityLabel={T('Later end')} onPress={() => { const b = settings.repeatRangeEnd + 1; setSettingsState({ ...settings, repeatRangeEnd: b }); void setRepeatRange(settings.repeatRangeStart, b); }} style={s.stepButtonSmall}>{ico('add', 15, C.green)}</Tactile>
          </View>
        </View>
      </View>
      <Text style={s.meta}>{rtl
        ? `من الآية ${settings.repeatRangeStart} إلى الآية ${settings.repeatRangeEnd}`
        : `Verses ${settings.repeatRangeStart} to ${settings.repeatRangeEnd}, both included.`}</Text>
    </View>}

    <Section title={T('When the Surah ends')} />
    <View style={s.settings}>
      <Tactile accessibilityRole="switch" accessibilityState={{ checked: !!settings.autoNextSurah }}
        onPress={() => { setSettingsState({ ...settings, autoNextSurah: !settings.autoNextSurah }); void setAutoNextSurah(!settings.autoNextSurah); }} style={s.setting}>
        <MotionGlyph name="play-skip-forward" size={19} />
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Carry on to the next Surah')}</Text>
          <Text style={s.meta}>{T('Rather than stopping at the end. Stops at An-Nas.')}</Text>
        </View>
        {ico(settings.autoNextSurah ? 'toggle' : 'toggle-outline', 22, settings.autoNextSurah ? C.green : C.muted)}
      </Tactile>
      <Tactile accessibilityRole="switch" accessibilityState={{ checked: settings.resumeOnStart !== false }}
        onPress={() => { setSettingsState({ ...settings, resumeOnStart: settings.resumeOnStart === false }); void setResumeOnStart(settings.resumeOnStart === false); }} style={s.setting}>
        <MotionGlyph name="refresh-outline" size={19} />
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Pick up where I left off')}</Text>
          <Text style={s.meta}>{T('Restores the Surah and the exact moment when the app opens, paused and ready.')}</Text>
        </View>
        {ico(settings.resumeOnStart !== false ? 'toggle' : 'toggle-outline', 22, settings.resumeOnStart !== false ? C.green : C.muted)}
      </Tactile>
    </View>

    <Section title={T('Volume')} />
    <View style={s.playerCard}>
      <Text style={s.preferenceLabel}>{T('RECITATION')}</Text>
      <View style={s.levelRow}>
        {ico('volume-high', 17, C.green)}
        <LevelBar value={settings.arabicVolume ?? 1} label={T('Recitation volume')}
          onValue={(next) => { setSettingsState({ ...settings, arabicVolume: next }); void setVolume('arabic', next); }} />
        <Text style={s.levelValue}>{Math.round((settings.arabicVolume ?? 1) * 100)}</Text>
      </View>
      {settings.translationAudioEnabled && <>
        <Text style={[s.preferenceLabel, { marginTop: 14 }]}>{T('TRANSLATION')}</Text>
        <View style={s.levelRow}>
          {ico('volume-medium', 17, C.green)}
          <LevelBar value={settings.translationVolume ?? 1} label={T('Translation volume')} tint={C.gold}
            onValue={(next) => { setSettingsState({ ...settings, translationVolume: next }); void setVolume('translation', next); }} />
          <Text style={s.levelValue}>{Math.round((settings.translationVolume ?? 1) * 100)}</Text>
        </View>
      </>}
      <Text style={s.meta}>{T('Set apart, because the Arabic and its meaning are not listened to the same way.')}</Text>
    </View>

    <Section title={`Queue · ${audio.queue.length} tracks`} />
    {audio.queue.map((item, index) => <Pressable key={`${item.id}-${index}`} onPress={() => { void selectQueueItem(index); }} style={[s.queueRow, index === audio.index && s.queueRowActive]}>
      <Text style={s.queueIndex}>{index + 1}</Text>
      <View style={{ flex: 1 }}><Text numberOfLines={1} style={s.settingName}>{item.title}</Text><Text style={s.meta}>{item.performer}</Text></View>
      <Pressable accessibilityLabel={`${T('Remove from the queue')} ${item.title}`} onPress={() => removeFromQueue(index)} style={s.audioRowAction}>{ico('close', 16, C.muted)}</Pressable>
    </Pressable>)}

    <View style={s.playerCard}>
      <Text style={s.preferenceLabel}>{T('SAVE QUEUE AS PLAYLIST')}</Text>
      <View style={s.fieldRow}>
        <TextInput accessibilityLabel={T('Playlist name')} value={name} onChangeText={setName} placeholder={track.chapterName} placeholderTextColor={C.muted} style={[s.textField, { flex: 1, marginTop: 0 }]} />
        <Tactile onPress={() => { void savePlaylist(name, audio.queue).then((next) => { setPlaylists(next); setName(''); }); }} style={s.primarySmall}><Text style={s.primaryText}>{T('Save')}</Text></Tactile>
      </View>
      {!!playlists.length && <Text style={s.meta}>{ar?`${playlists.length} ${arNoun(playlists.length, 'قائمة', 'قائمتان', 'قوائم', 'قائمة')} محفوظة على هذا الجهاز.`:tf(language,'{n} playlists stored on this device.',{n:playlists.length})}</Text>}
    </View>

    <View style={s.sourceCard}>{ico('server', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Now playing')}</Text><Text style={s.sourceBody}>{track.performer}</Text></View></View>
    <View style={{ height: 40 }} />
  </ScrollView></Page>;
}

/** A slow glow behind the artwork, so the hero is not a flat rectangle. */
function PlayerAura() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 14000, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View pointerEvents="none" style={[s.playerAura, { transform: [{ rotate }] }]}>
    <LinearGradient colors={['rgba(255,255,255,.20)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFill} />
  </Animated.View>;
}

/* Tab icons are drawn for the navigation bar specifically: read at 23pt, they
   are filled artwork rather than the stroked glyphs used elsewhere, so they
   carry their own colour in both themes instead of being tinted at runtime.
   Each is supplied as a 160px light and a 160px dark cut. */
/**
 * Which version of an icon to show.
 *
 * The theme is asked first and the brightness second, the same order the
 * scene art uses. A theme can therefore carry its own artwork without either
 * theme having to borrow the other's, and the Islamic set is left exactly as
 * it was for anybody still using it.
 */
type IconSet = { light: any; dark: any; palestine: any; palestineDark: any };

function themedIcon(resolved: ResolvedTheme, set: IconSet) {
  if (isPal(resolved)) return resolved === 'palestineDark' ? set.palestineDark : set.palestine;
  return resolved === 'islamicDark' ? set.dark : set.light;
}

/**
 * One tab, with the four versions of its icon the app can need.
 *
 * The Palestine icons are drawn for that theme rather than recoloured from the
 * Islamic ones: the two palettes are not the same colours under different
 * light, and artwork made for one reads wrong against the other. Either set
 * can be changed without touching the other.
 */
const TAB_ITEMS = [
  { name: 'Home', label: 'Home', ar: 'الرئيسية',
    icon: require('./assets/tool-icons/tab-home.png'), iconDark: require('./assets/tool-icons/tab-home-dark.png'),
    iconPalestine: require('./assets/tool-icons/tab-home-palestine.png'), iconPalestineDark: require('./assets/tool-icons/tab-home-palestine-dark.png') },
  { name: 'Prayer', label: 'Prayer', ar: 'الصلاة',
    icon: require('./assets/tool-icons/tab-prayer.png'), iconDark: require('./assets/tool-icons/tab-prayer-dark.png'),
    iconPalestine: require('./assets/tool-icons/tab-prayer-palestine.png'), iconPalestineDark: require('./assets/tool-icons/tab-prayer-palestine-dark.png') },
  { name: 'Quran', label: 'Quran', ar: 'القرآن',
    icon: require('./assets/tool-icons/tab-quran.png'), iconDark: require('./assets/tool-icons/tab-quran-dark.png'),
    iconPalestine: require('./assets/tool-icons/tab-quran-palestine.png'), iconPalestineDark: require('./assets/tool-icons/tab-quran-palestine-dark.png') },
  { name: 'Library', label: 'Library', ar: 'المكتبة',
    icon: require('./assets/tool-icons/tab-library.png'), iconDark: require('./assets/tool-icons/tab-library-dark.png'),
    iconPalestine: require('./assets/tool-icons/tab-library-palestine.png'), iconPalestineDark: require('./assets/tool-icons/tab-library-palestine-dark.png') },
  { name: 'Tools', label: 'Tools', ar: 'الأدوات',
    icon: require('./assets/tool-icons/tab-tools.png'), iconDark: require('./assets/tool-icons/tab-tools-dark.png'),
    iconPalestine: require('./assets/tool-icons/tab-tools-palestine.png'), iconPalestineDark: require('./assets/tool-icons/tab-tools-palestine-dark.png') },
];

/**
 * How the tab indicator travels.
 *
 * Apple's tab bars do not ease; they settle. The stiffness throws the
 * indicator across quickly, and the damping is high enough that it arrives
 * without wobbling — you see the motion stop rather than see it bounce.
 * Mass is below one so it feels like a light object being placed, not a
 * heavy one being dragged.
 */
const TAB_SPRING = { stiffness: 480, damping: 32, mass: 0.65, useNativeDriver: true };

/** The bar's own horizontal padding. The indicator measures its slot from
    this, so the two have to agree — change one and the other follows. */
const FLOAT_BAR_PAD = 8;

/** The menu floats above the content as a single capsule, always in reach. */
/**
 * One tab. A component of its own so each holds its own press value instead of
 * asking a hook to run inside a map.
 */
function TabButton({ route, focused, navigation, resolved, rtl, language, state, index }: any) {
  const press = usePressDepth();
  const item = TAB_ITEMS.find((entry: any) => entry.name === route.name);
  /* Translated rather than switched on `rtl`: the tab bar carried a
     hand-written Arabic label and fell back to English, which left a
     reader in Urdu looking at Arabic words. Going through the table
     means every language the interface speaks gets its own word. */
  const label = item ? tx(language, item.label) : route.name;
  /* How selected this tab is, 0 to 1. Everything below is driven off this
     one value, so the icon and the label move together instead of each
     running its own clock. */
  const on = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(on, { toValue: focused ? 1 : 0, ...TAB_SPRING }).start();
  }, [focused, on]);
  const iconOpacity = on.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const iconScale = on.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  return <Animated.View style={[s.floatItem, { transform: [{ scale: press.scale }] }]}>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={label}
      onPressIn={press.onPressIn} onPressOut={press.onPressOut}
      onPress={() => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (event.defaultPrevented) return;
        if (focused) {
          /* Already here: unwind the tab's own stack in one press.
             The action carries the child stack's key as its target, so it is
             dispatched to that stack rather than to the tab bar. Navigating to
             the tab's first screen by name also *looked* right, but it left
             the stack in a state where the next cross-tab navigate into it
             was silently dropped. */
          const child = state?.routes?.[index]?.state;
          if (child?.key && (child.index || 0) > 0) {
            navigation.dispatch({ ...StackActions.popToTop(), target: child.key });
          }
          return;
        }
        navigation.navigate(route.name);
      }}>
      <Animated.View style={s.floatPill}>
        {item?.icon ? <Animated.Image source={themedIcon(resolved, {
          light: item.icon, dark: item.iconDark || item.icon,
          palestine: item.iconPalestine || item.icon, palestineDark: item.iconPalestineDark || item.iconDark || item.icon,
        })} resizeMode="contain" style={{ width: 26, height: 26, opacity: iconOpacity, transform: [{ scale: iconScale }] }} /> : ico('ellipse-outline', 20, focused ? C.green : C.chevron)}
        {/* Two labels stacked rather than one whose colour is animated.
            Colour cannot be tweened on the native driver, and the native
            driver is what keeps this smooth; fading one over the other gets
            the same result on the compositor. */}
        <View style={s.floatLabelWrap}>
          <Text numberOfLines={1} style={s.floatLabel}>{label}</Text>
          <Animated.Text numberOfLines={1} style={[s.floatLabel, s.floatLabelActive, s.floatLabelOver, { opacity: on }]}>{label}</Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  </Animated.View>;
}

/**
 * The floating menu, as a capsule of glass.
 *
 * The bar is a BlurView, so it shows whatever is passing behind it — the
 * page scrolling under it, the indigo hero, a surah list — blurred and
 * brightened rather than hidden behind an opaque panel. Two layers are
 * painted over that blur, and the order of the three matters: the wash and
 * the sheen belong to the material, so they sit under the tabs and never
 * dim them.
 *
 * Two things about BlurView are easy to get wrong and are handled here.
 * It draws its blur out to the square edge of its own box unless the box
 * clips it, so the capsule needs `overflow: 'hidden'` — without it the
 * blur shows as a rectangle behind the rounded border. And it has to be
 * rendered after the content it sits over, which it already is: the bar is
 * a sibling drawn after the navigator, not a child of it.
 */
function FloatingTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const { rtl , language }=useLanguage();
  const { resolved, dark } = useTheme();
  const hidden = useChromeHidden();
  const barWidth = Math.min(Math.max(width - 32, 300), 460);
  const glass = dark ? GLASS.dark : GLASS.light;
  const drop = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(drop, { toValue: hidden ? 0 : 1, duration: 200, useNativeDriver: true }).start();
  }, [hidden, drop]);

  /* One indicator that belongs to the bar, rather than one pill per tab
     that appears and disappears. The difference is that a shared one can
     be seen travelling, and the travel is the whole effect. */
  const slots = Math.max(state.routes.length, 1);
  const slot = (barWidth - FLOAT_BAR_PAD * 2) / slots;
  /* `at` is the tab the indicator is over, as a fraction rather than an
     index, so an interruption mid-flight starts from wherever it is. */
  const at = useRef(new Animated.Value(state.index)).current;
  const stretch = useRef(new Animated.Value(1)).current;
  const from = useRef(state.index);
  useEffect(() => {
    if (from.current === state.index) return;
    /* Further to travel, further it stretches. Two tabs apart pulls the
       glass out more than next door does, which is what makes a long jump
       read as effort rather than as a teleport. */
    const distance = Math.min(Math.abs(state.index - from.current), 3);
    from.current = state.index;
    Animated.parallel([
      Animated.spring(at, { toValue: state.index, ...TAB_SPRING }),
      Animated.sequence([
        Animated.timing(stretch, {
          toValue: 1 + distance * 0.09, duration: 120,
          easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
        Animated.spring(stretch, { toValue: 1, ...TAB_SPRING }),
      ]),
    ]).start();
  }, [state.index, at, stretch]);

  return <Animated.View pointerEvents="box-none" style={[s.floatBarWrap, {
    opacity: drop,
    transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [110, 0] }) }]
  }]}>
    {/* The shadow is on this wrapper and not on the blur view. A BlurView
        clips to its own bounds — that is how it keeps the blur inside the
        capsule — and a shadow sitting on that same view would be clipped
        away with it. */}
    <View style={[s.floatBarShadow, { width: barWidth }]}>
      <BlurView
        intensity={dark ? GLASS_INTENSITY.bar.dark : GLASS_INTENSITY.bar.light}
        tint={dark ? 'dark' : 'light'}
        style={[s.floatBar, { width: barWidth, flexDirection: 'row' }]}
      >
        {/* The colour of the material. expo-blur's own tints are neutral
            greys; this is what brings the bar back onto the brand. */}
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: glass.wash }]} />
        {/* Light falling across the top edge, gone by the middle. */}
        <LinearGradient pointerEvents="none" colors={glass.sheen}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        {/* The selected tab, as a thicker piece of the same material.

            Deliberately not a second BlurView. A blur blurs what is behind
            it, and behind this is already a blur — stacking one on another
            costs twice and reads as mud. What makes a selected region read
            as selected is that it is more of the material, not a different
            material: a stronger fill, its own sheen, and a hairline. */}
        <Animated.View pointerEvents="none" style={[s.floatIndicator, {
          width: slot - 6,
          transform: [
            { translateX: at.interpolate({ inputRange: [0, slots - 1], outputRange: [0, (slots - 1) * slot] }) },
            { scaleX: stretch },
          ],
        }]}>
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: glass.pill, borderRadius: 24, overflow: 'hidden',
            borderWidth: 1, borderColor: glass.pillRim,
          }]}>
            <LinearGradient pointerEvents="none" colors={glass.sheen}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          </View>
        </Animated.View>
        {state.routes.map((route: any, index: number) => (
          <TabButton key={route.key} route={route} focused={state.index === index}
            navigation={navigation} resolved={resolved} rtl={rtl} language={language} state={state} index={index} />
        ))}
      </BlurView>
    </View>
  </Animated.View>;
}

function Tabs(){return <Tab.Navigator screenOptions={{headerShown:false,tabBarHideOnKeyboard:true}} tabBar={(props:any)=><FloatingTabBar {...props}/>}><Tab.Screen name="Home" component={HomeScreen}/><Tab.Screen name="Prayer" component={PrayerStack}/><Tab.Screen name="Quran" component={QuranStack}/><Tab.Screen name="Library" component={ExploreStack}/><Tab.Screen name="Tools" component={ToolsStack}/></Tab.Navigator>}
/**
 * The navigation tree. It is rebuilt when the theme changes, so the palette
/* ==================== Back ==================== */
/**
 * Back, from every direction a person means it.
 *
 * The navigator held the stack but nothing outside the app could reach it, so
 * the gestures that live outside - the Android back key, the browser's back
 * button, a swipe in from the edge - stepped straight out of the app. Leaving
 * a reader or a settings page closed it instead of returning to where the
 * person came from.
 *
 * On Android the key is offered to the navigator first and only closes the
 * app once there is nowhere left to go.
 *
 * On the web a sentinel entry is kept in the browser's history. Pressing back
 * pops that sentinel, which tells the navigator to go back one screen, and a
 * fresh sentinel is left behind so the next press works too. Forward moves
 * inside the app deliberately add nothing: one press of back should mean one
 * screen back, however many screens deep the person went.
 */
/* How long a second back press has to arrive to be counted as "yes, leave". */
const EXIT_CONFIRM_WINDOW = 2000;

function useBackIntegration(ref: any) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let lastPress = 0;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      /* A sheet is not somewhere you came *from*, so the first press closes
         it. Without this, back on a full-screen sheet skipped straight past
         it to the screen underneath and left the sheet's own state behind. */
      if (dismissTopOverlay()) return true;
      if (!ref.isReady() || !ref.canGoBack()) {
        /* Nothing left to pop. Leaving is almost never what someone meant by
           one press on a root screen, so it takes two inside two seconds. */
        const now = Date.now();
        if (now - lastPress > EXIT_CONFIRM_WINDOW) {
          lastPress = now;
          showExitPrompt();
          return true;
        }
        return false; /* second press: let the OS close the app */
      }
      ref.goBack();
      return true;
    });
    return () => sub.remove();
  }, [ref]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.history) return;
    const history = window.history;
    history.pushState({ deen: 'sentinel' }, '');
    const onPop = () => {
      /* Sheets close before the screen behind them moves, same as Android. */
      if (dismissTopOverlay()) {
        history.pushState({ deen: 'sentinel' }, '');
        return;
      }
      if (ref.isReady() && ref.canGoBack()) {
        ref.goBack();
        history.pushState({ deen: 'sentinel' }, ''); /* leave one behind for the next press */
      }
      /* At the root there is nothing to go back to, so the press is allowed
         to leave the site rather than being swallowed. */
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [ref]);
}

/**
 * "Press back again to leave."
 *
 * A small module-level emitter rather than a context, because the back handler
 * is not inside the tree - it is a hardware-key listener created once in Root.
 */
const exitListeners = new Set<() => void>();
function showExitPrompt() { exitListeners.forEach((fn) => fn()); }
function useExitPrompt() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<any>(null);
  useEffect(() => {
    const listener = () => {
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), EXIT_CONFIRM_WINDOW);
    };
    exitListeners.add(listener);
    return () => {
      exitListeners.delete(listener);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  return visible;
}
/** Sits above the tab bar so it reads as belonging to the app, not a screen. */
function ExitPrompt() {
  const visible = useExitPrompt();
  const { rtl , language }=useLanguage();
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: visible ? 1 : 0, duration: 140, useNativeDriver: true }).start();
  }, [visible, fade]);
  if (!visible) return null;
  return <Animated.View pointerEvents="none" style={[s.exitPrompt, { opacity: fade }]}>
    <View style={s.exitPill}>
      <Text style={s.exitText}>{tx(language, 'Press back again to leave')}</Text>
    </View>
  </Animated.View>;
}

/*
 * reaches every screen; the navigation state is carried across that rebuild.
 */
function Root() {
  const { dark, tick, swap } = useTheme();
  const subtle = useSubtleTransitions();
  /* The palette is a module-level object, so a theme change remounts the
     navigator (via `key` below) to make every screen repaint. That remount
     re-runs `initialState`, so the newest state is held in a ref: the remount
     restores exactly where the person was, back stack and all.

     Nothing is read from or written to disk here. On a real cold start the ref
     is empty and the app opens on Home. */
  /* The Arabic face is written into the sheet the same way, so it needs the
     same remount to reach screens that are not re-rendering at the moment the
     choice is made. */
  const { fontTick } = useQuranPreferences();
  const liveState = useRef<any>(undefined);
  useBackIntegration(navigationRef);
  useEffect(() => { clearSavedNavState(); }, []);
  /* The screen dips out and back around the palette swap. It gives way a
     little as it goes: a plain fade reads like a light bulb being switched,
     whereas a small withdrawal towards the middle reads as the screen settling
     into the new palette rather than simply being replaced by it.

     The backdrop is the new ground colour and stays put, so what shows through
     the dip is where the screen is going, not the page behind it. */
  const dip = {
    opacity: swap,
    transform: [{ scale: swap.interpolate({ inputRange: [0, 1], outputRange: [0.965, 1] }) }],
  };

  return <Animated.View style={[s.themeSwap, dip]}>
    <NavigationContainer ref={navigationRef} key={(dark ? 'dark' : 'light') + ':' + tick + ':' + fontTick} initialState={liveState.current} onStateChange={(state: any) => { liveState.current = state; }}>
    <Stack.Navigator screenOptions={{...subtle,headerShown:false}}>
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Settings" component={SettingsStack} />
      {/* The inbox sits above the tabs, not inside one of them. It is
          reached from a header that any tab can be showing, and a screen
          reached from anywhere belongs above all of them. */}
      <Stack.Screen name="Inbox" component={NotificationInboxScreen} />
    </Stack.Navigator>
      <ExpoStatusBar style={dark ? 'light' : 'dark'} /><MiniPlayer /><OverlayHost /><ExitPrompt />
    </NavigationContainer>
  </Animated.View>;
}

/* ==================== First run ==================== */
/**
 * Splash and onboarding.
 *
 * Both are built from the app's own palette, radii and motion timings rather
 * than borrowed from a starter template, so the first thing a person sees
 * already looks like the app they are about to use.
 */

/** The splash stays at least this long, so the mark has time to settle. */
const SPLASH_MIN_MS = 1150;

/* Hold the native splash until the one this app draws is actually on screen.

   Without this, Android hides its own splash the moment the bundle mounts, and
   the window behind it — the default light grey of the launch theme — shows
   through for a frame or two before React paints. On a cold start that read as
   a grey flash in front of the splash. Keeping the native layer up until the
   drawn splash has mounted means the two hand over with nothing between them.

   The catch matters: on the web there is no native splash to hold, and the
   call rejects rather than throwing the app away. */
SplashScreen.preventAutoHideAsync().catch(() => {});
/* A backstop. If the drawn splash never mounts — a render that throws before
   it, or a bundle that stalls — the native layer must still come down, or the
   app sits behind a splash it cannot get past. */
setTimeout(() => { void SplashScreen.hideAsync().catch(() => {}); }, 8000);

/** A child that rises into place. Used to stagger the language cards. */
function RiseIn({ delay = 0, distance = 14, children, style }: { delay?: number; distance?: number; children: React.ReactNode; style?: any; key?: string | number }) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(value, { toValue: 1, duration: 520, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    return () => { value.stopAnimation(); };
  }, [delay, distance]);
  return <Animated.View style={[style, { opacity: value, transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>{children}</Animated.View>;
}

/**
 * The splash.
 *
 * The emblem is built the way this pattern has always been built: two squares,
 * one turned inside the other, and the eight-pointed star that appears where
 * they cross. It is drawn rather than faded in — the squares turn towards each
 * other until they meet, the star resolves out of them, and only then does the
 * mark settle into the middle of what they made.
 *
 * It leaves the moment the app behind it is ready, and never before it has
 * held long enough to read as a beginning rather than a flash.
 */

/* ------------------------------------------------------------------ *
 * The eight-pointed star
 * ------------------------------------------------------------------ */

/** The square the emblem is drawn in. */
const KHATAM_BOX = 216;
/** Its centre. */
const KHATAM_C = KHATAM_BOX / 2;
/** How far the points of the star reach. */
const KHATAM_R = 90;
/**
 * How far out the two squares cross.
 *
 * This is exact rather than chosen, and it has to be. A square on this circle
 * has its sides at r/sqrt(2); the turned square's side meets it at
 * r(1 - 1/sqrt(2)); and that puts every crossing at sqrt(2 - sqrt(2)) of the
 * radius, one sixteenth of a turn — 22.5 degrees — round from each point.
 * Approximate it and the star comes out visibly lopsided.
 */
const KHATAM_I = KHATAM_R * Math.sqrt(2 - Math.SQRT2);

const khatamPoint = (deg: number, radius: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(KHATAM_C + radius * Math.cos(a)).toFixed(2)},${(KHATAM_C + radius * Math.sin(a)).toFixed(2)}`;
};

/** The star: a point, then a crossing, all the way round. */
const KHATAM_STAR = Array.from({ length: 16 }, (_, i) =>
  khatamPoint(-90 + i * 22.5, i % 2 === 0 ? KHATAM_R : KHATAM_I)).join(' ');

/** The two squares that make it. Drawn whole, they show the construction. */
const KHATAM_SQUARES = [
  [45, 135, 225, 315].map((deg) => khatamPoint(deg, KHATAM_R)).join(' '),
  [0, 90, 180, 270].map((deg) => khatamPoint(deg, KHATAM_R)).join(' '),
];

/**
 * One stroke of the emblem, brought in over its own slice of the draw.
 *
 * Each stroke is a separate drawing layered over the last rather than one path
 * cut into several pieces, so each can carry its own timing and its own turn.
 * That is what lets the pattern assemble instead of simply appearing.
 */
function KhatamStroke({ draw, from, to, turn = 0, children }: {
  draw: Animated.Value; from: number; to: number; turn?: number; children: React.ReactNode;
}) {
  const opacity = draw.interpolate({ inputRange: [from, to], outputRange: [0, 1], extrapolate: 'clamp' });
  const scale = draw.interpolate({ inputRange: [from, to], outputRange: [0.9, 1], extrapolate: 'clamp' });
  const rotate = draw.interpolate({ inputRange: [from, to], outputRange: [`${turn}deg`, '0deg'], extrapolate: 'clamp' });
  return <Animated.View style={[s.khatamStroke, { opacity, transform: [{ scale }, { rotate }] }]}>{children}</Animated.View>;
}

/**
 * The emblem.
 *
 * The two squares turn towards each other until they meet, the star resolves
 * out of where they cross, and then the whole thing settles back — it is the
 * frame, not the picture, and the mark is what is being introduced.
 */
function Khatam({ draw, settle }: { draw: Animated.Value; settle: Animated.Value }) {
  /* The emblem is drawn in whatever the theme puts on a hero: the brand's
     own gold for Islamic, the flag's white for Palestine. */
  const line = C.onHero;
  const box = `0 0 ${KHATAM_BOX} ${KHATAM_BOX}`;
  return <Animated.View style={[s.khatamWrap, { opacity: settle }]}>
    <KhatamStroke draw={draw} from={0} to={0.26}>
      <Svg width={KHATAM_BOX} height={KHATAM_BOX} viewBox={box}>
        <Circle cx={KHATAM_C} cy={KHATAM_C} r={KHATAM_R + 14} fill="none" stroke={line} strokeWidth={1} opacity={0.3} />
      </Svg>
    </KhatamStroke>
    <KhatamStroke draw={draw} from={0.08} to={0.58} turn={-24}>
      <Svg width={KHATAM_BOX} height={KHATAM_BOX} viewBox={box}>
        <Polygon points={KHATAM_SQUARES[0]} fill="none" stroke={line} strokeWidth={1} opacity={0.4} />
      </Svg>
    </KhatamStroke>
    <KhatamStroke draw={draw} from={0.14} to={0.64} turn={24}>
      <Svg width={KHATAM_BOX} height={KHATAM_BOX} viewBox={box}>
        <Polygon points={KHATAM_SQUARES[1]} fill="none" stroke={line} strokeWidth={1} opacity={0.4} />
      </Svg>
    </KhatamStroke>
    <KhatamStroke draw={draw} from={0.46} to={0.86}>
      <Svg width={KHATAM_BOX} height={KHATAM_BOX} viewBox={box}>
        <Polygon points={KHATAM_STAR} fill="none" stroke={line} strokeWidth={1.7} opacity={0.95} />
      </Svg>
    </KhatamStroke>
    <KhatamStroke draw={draw} from={0.6} to={0.94}>
      <Svg width={KHATAM_BOX} height={KHATAM_BOX} viewBox={box}>
        <Circle cx={KHATAM_C} cy={KHATAM_C} r={KHATAM_I * 0.58} fill="none" stroke={line} strokeWidth={1} opacity={0.45} />
      </Svg>
    </KhatamStroke>
  </Animated.View>;
}

function Splash({ ready, progress, onDone }: { ready: boolean; progress: number; onDone: () => void }) {
  const { dark, resolved } = useTheme();
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  /* The native splash has been held since the module loaded. Now that this
     one is mounted and has painted its own indigo field, the two are showing
     the same picture, so the layer underneath can go. Hiding from inside an
     effect rather than on a timer means the handover cannot open a gap. */
  useEffect(() => {
    const id = requestAnimationFrame(() => { void SplashScreen.hideAsync().catch(() => {}); });
    return () => cancelAnimationFrame(id);
  }, []);
  const still = useCalmMotion();
  const draw = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(1)).current;
  const mark = useRef(new Animated.Value(0.86)).current;
  const words = useRef(new Animated.Value(0)).current;
  const version = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [held, setHeld] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    if (still) {
      /* Nothing is withheld from somebody who asked for less movement: the
         emblem is simply there, already built. */
      draw.setValue(1); settle.setValue(0.6); mark.setValue(1); words.setValue(1); version.setValue(1);
      setHeld(true);
      return;
    }
    /* Linear, and deliberately so. Every stroke owns a slice of this one
       value, and easing it here would bunch those slices up at the start
       instead of spreading them across the second. */
    Animated.timing(draw, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }).start();
    /* Once it is built the pattern steps back out of the way of the mark. */
    Animated.timing(settle, { toValue: 0.55, duration: 420, delay: 880, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    Animated.spring(mark, { toValue: 1, friction: 5, tension: 64, delay: 560, useNativeDriver: true }).start();
    Animated.timing(words, { toValue: 1, duration: 460, delay: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    /* The plate is the last thing to arrive, once the name it sits under
       has already been read. */
    Animated.timing(version, { toValue: 1, duration: 380, delay: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const timer = setTimeout(() => setHeld(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, [still]);

  /* How much of the startup work has actually landed, not a sweep that looks
     busy while the app is really just waiting. */
  useEffect(() => {
    Animated.timing(bar, { toValue: Math.max(0, Math.min(1, progress)), duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progress]);

  // It goes as soon as the app behind it is ready and the emblem has had its moment.
  useEffect(() => {
    if (!ready || !held || leaving.current) return;
    leaving.current = true;
    Animated.timing(fade, { toValue: 0, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => onDone());
  }, [ready, held, onDone]);

  return <Animated.View style={[s.splashRoot, { opacity: fade }]}>
    <StatusBar barStyle="light-content" />
    {/* The field behind the emblem. It used to put the brand's own indigo in
       the middle stops whichever theme was on, so a Palestine splash came up
       purple and an Islamic one read correct by accident. Each theme now
       fills its own colours: indigo for Islamic, a green field off the flag
       for Palestine. The Islamic values are unchanged. */}
    <LinearGradient colors={
      isPal(resolved)
        ? (dark
            ? [C.heroA, mix(FLAG.black, FLAG.green, 0.38), C.deep]
            : [C.heroA, C.heroB, mix(FLAG.green, FLAG.black, 0.30)])
        : (dark
            ? [C.heroA, mix(BRAND.deepIndigo, BRAND.midnightInk, .35), C.deep]
            : [C.heroA, C.heroB, mix(BRAND.royalIndigo, BRAND.midnightInk, .25)])
    } start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.splashFill} />
    <View style={s.splashStage}>
      <View style={s.splashMarkWrap}>
        <Khatam draw={draw} settle={settle} />
        <Animated.View style={{ transform: [{ scale: mark }] }}>
          <Image source={LOGO_MARK} resizeMode="contain" style={s.splashMark} />
        </Animated.View>
      </View>
      <Animated.View style={[s.splashWords, { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
        <Text style={s.splashName}>{T('Islamic')}</Text>
        <Text style={s.splashTagline}>{T('Your Daily Companion')}</Text>
        {/* The second version of the app, named on the one screen everybody
            sees. A plate rather than a bare line, so it reads as part of the
            mark instead of a build number someone forgot to remove. */}
        <Animated.View style={[s.splashVersion, { opacity: version, transform: [{ translateY: version.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }]}>
          <Text style={s.splashVersionText}>{T('Version 2.0')}</Text>
        </Animated.View>
      </Animated.View>
    </View>
    <View style={s.splashTrack}>
      <Animated.View style={[s.splashBar, { width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
  </Animated.View>;
}

/**
 * Onboarding: three choices, one screen each.
 *
 * Choosing on the first step carries the other two with it — that is the whole
 * point of the screen. The two steps after it let you pull them apart again if
 * you read one language and listen in another.
 */
/**
 * The location step of onboarding.
 *
 * Asked once, and then it is a setting rather than a question. The person can
 * skip it: everything in the app that needs a place says so plainly and points
 * here, but nothing hunts them down screen after screen.
 */
function OnboardingLocation() {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const loc = useAppLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (text.length < 2) { setResults([]); setSearching(false); setOnline(false); return; }
    let live = true;
    const local = searchLocalCities(text, 8);
    setResults(local);
    if (local.length) { setSearching(false); setOnline(false); return; }
    setSearching(true);
    const timer = setTimeout(() => {
      void searchCities(text, 8).then((list) => {
        if (!live) return;
        setResults(list); setOnline(list.some((c) => c.source === 'online')); setSearching(false);
      });
    }, 450);
    return () => { live = false; clearTimeout(timer); };
  }, [query]);

  const choose = (city: CityResult) => {
    haptic('success');
    loc.setManual({ label: `${city.name}, ${city.countryName}`, latitude: city.latitude, longitude: city.longitude, timezone: city.timezone });
    void rememberCity(city);
  };

  return <View style={s.onbList}>
    {!!loc.location && <View style={s.onbChosen}>
      {ico('checkmark-circle', 18, C.green)}
      <Text style={s.onbChosenText}>{loc.location.label}</Text>
    </View>}

    <View style={s.search}>
      {ico('search', 18, C.muted)}
      <TextInput accessibilityLabel={T('Search for a city')} value={query} onChangeText={setQuery}
        style={s.searchInput} placeholder={T('Search for your city')} placeholderTextColor={C.muted}
        returnKeyType="search" autoCorrect={false} />
      {query.length > 0 && <Pressable accessibilityLabel={T('Clear city search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}
    </View>

    {searching && <SkeletonList rows={4} />}

    {!searching && query.trim().length >= 2 && results.length === 0 && <View style={s.onbNote}>
      <Text style={s.onbNoteText}>{online
        ? T('No place found with that name. You can still continue — set it later in Settings, or enter coordinates there.')
        : T('Not in the offline list, and the connection could not be reached. Continue and set it in Settings, where coordinates can be entered by hand.')}</Text>
    </View>}

    {results.length > 0 && <View style={s.cityResults}>
      {results.map((city) => <Tactile key={`${city.ascii}-${city.country}-${city.latitude}`}
        accessibilityLabel={`${city.name}, ${city.countryName}`} onPress={() => choose(city)} style={s.cityResultRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.cityResultName}>{city.name}</Text>
          <Text style={s.meta}>{city.countryName}</Text>
        </View>
        {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.muted)}
      </Tactile>)}
    </View>}

    {!loc.location && <Text style={s.onbNoteText}>
      {T('You can skip this and choose a place later in Settings.')}
    </Text>}
  </View>;
}

/**
 * The notification step.
 *
 * The ask is honest about what it is for and what it is not: three kinds of
 * reminder, each switchable off, and a plain statement that nothing is
 * scheduled unless permission is given. Asking for permission before saying
 * what it buys is how apps lose it.
 */
function OnboardingNotifications() {
  const { rtl , language }=useLanguage(); const T = (text: string) => tx(language, text);
  const { theme, setTheme } = useTheme();
  const [status, setStatus] = useState<NotificationStatus>({ health: 'undetermined', canAsk: true });
  const [asking, setAsking] = useState(false);

  useEffect(() => { void getNotificationStatus().then(setStatus); }, []);

  const granted = status.health === 'granted';
  /* Never asked, and refused, look alike in `health` and are told apart by
     `canAsk`. See getNotificationStatus. */
  const neverAsked = !granted && status.canAsk;

  const ask = async () => {
    setAsking(true);
    await requestNotificationPermission(language);
    setStatus(await getNotificationStatus());
    setAsking(false);
  };

  return <View style={s.onbList}>
    <View style={s.onbPromise}>
      {ico('notifications-outline', 22, C.green)}
      <View style={{ flex: 1 }}>
        <Text style={s.onbPromiseTitle}>{T('Adhan at its time')}</Text>
        <Text style={s.onbPromiseBody}>{T('The adhan you choose, with a button to silence it or to mark the prayer as prayed.')}</Text>
      </View>
    </View>
    <View style={s.onbPromise}>
      {ico('time-outline', 22, C.green)}
      <View style={{ flex: 1 }}>
        <Text style={s.onbPromiseTitle}>{T('A few minutes before')}</Text>
        <Text style={s.onbPromiseBody}>{T('A quiet heads-up before each prayer, so you are not caught out.')}</Text>
      </View>
    </View>
    <View style={s.onbPromise}>
      {ico('sunny-outline', 22, C.green)}
      <View style={{ flex: 1 }}>
        <Text style={s.onbPromiseTitle}>{T('A verse or hadith each day')}</Text>
        <Text style={s.onbPromiseBody}>{T('One reminder in the morning, and a nudge back to where you were reading.')}</Text>
      </View>
    </View>

    {granted
      ? <View style={s.onbChosen}>{ico('checkmark-circle', 18, C.green)}<Text style={s.onbChosenText}>{T('Allowed. Every reminder can be switched off in Settings.')}</Text></View>
      : neverAsked
        ? <View style={s.onbNote}>
            <Text style={s.onbNoteText}>{T('Continue to be asked. Nothing is scheduled unless you allow it, and every reminder can be switched off later in Settings.')}</Text>
            {/* A button after all. The prompt is also raised by Continue, but
                somebody who wants to answer on this screen should be able to,
                and on Android the answer only comes from a real request — a
                screen that describes what would happen never produces one. */}
            <Tactile accessibilityRole="button" accessibilityLabel={T('Allow notifications')}
              onPress={() => { void ask(); }} style={[s.primary, { marginTop: 12, alignSelf: 'stretch' }]}>
              <Text style={s.primaryText}>{T(asking ? 'Allowing…' : 'Allow notifications')}</Text>
            </Tactile>
          </View>
        : status.health === 'unsupported'
          ? <View style={s.onbNote}>
              <Text style={s.onbNoteText}>{T('Nothing is scheduled unless you allow it, and every reminder has its own switch in Settings.')}</Text>
            </View>
          : <View style={s.onbNote}>
              <Text style={s.onbNoteText}>{T('Permission was declined earlier, so reminders stay off. You can turn them on in the system settings for this app at any time.')}</Text>
            </View>}

    {/* Which colours the app wears. It lives here rather than on a screen of
        its own because it is not needed for the app to work, so it does not
        earn a step; but it is the one question asked on this screen that
        somebody might want to answer, and buried in Settings most people
        never find it. Light and dark are not asked here — the app starts on
        System, which is the answer nearly everybody wants, and Appearance in
        Settings holds it. Asked once, here, changeable in Settings. */}
    <Text style={s.preferenceLabel}>{T('HOW THE APP SHOULD LOOK')}</Text>
    <View style={s.choiceGrid}>
      <ChoicePill label={T('Islamic')} selected={theme === 'islamic'} onPress={() => setTheme('islamic')} swatch={<ThemeMark theme="islamic" height={11} />} />
      <ChoicePill label={T('Palestine')} selected={theme === 'palestine'} onPress={() => setTheme('palestine')} swatch={<ThemeMark theme="palestine" height={11} />} />
    </View>

    <Text style={s.onbNoteText}>
      {T('Nothing is scheduled unless you allow it, and every reminder has its own switch in Settings.')}
    </Text>
  </View>;
}

/**
 * The last thing asked, and the only one that can be skipped.
 *
 * Everything before it is needed for the app to work at all — a language, a
 * place, whether reminders are allowed. This is different: a nightly reminder
 * to read Surah Al-Mulk is an invitation, not a requirement, so it is asked
 * as one and can be declined without consequence.
 *
 * The hadith is quoted rather than paraphrased, and the reference is shown,
 * because a reminder that leans on a text ought to let the person go and read
 * that text. Two are given: 2891 for the surah's virtue, and 2892 for the
 * practice of reciting it before sleep — the first does not mention night at
 * all, and quietly implying that it does would be careless.
 *
 * The time is said plainly to stay on the device. Somebody being asked when
 * they go to bed is entitled to wonder where that answer goes.
 */
function OnboardingSleep() {
  const { rtl , language }=useLanguage();
  const T = (text: string) => tx(language, text);
  const { settings, update } = useWorshipSettings();

  /* Some presets and a wide berth either side of them. Most people sleep
     somewhere between nine and one; offering every quarter hour would be a
     formality, not a choice. */
  const TIMES = ['21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  const picked = settings.sleepReminderEnabled ? (settings.sleepReminderTime || '22:30') : null;

  const choose = (time: string) => update({ sleepReminderEnabled: true, sleepReminderTime: time });
  const clear = () => update({ sleepReminderEnabled: false });

  return <View style={s.onbList}>
    <View style={s.sleepHadith}>
      <Text style={s.sleepHadithAr}>
        {'إِنَّ سُورَةً مِنَ القُرآنِ ثَلاثُونَ آيَةً شَفَعَتْ لِصَاحِبِهَا حَتَّى غُفِرَ لَهُ، وَهِيَ سُورَةُ تَبَارَكَ'}
      </Text>
      <Text style={s.sleepHadithEn}>
        {T('“Indeed there is a Surah in the Qur’an of thirty Ayat, which intercedes for a man until he is forgiven. It is [Surah] Tabarak Alladhi Biyadihil-Mulk.”')}
      </Text>
      <Text style={s.sleepHadithRef}>{language === 'ar' ? SLEEP_SURAH.hadithAr : SLEEP_SURAH.hadith}</Text>
    </View>

    <View style={s.onbPromise}>
      {ico('moon-outline', 22, C.green)}
      <View style={{ flex: 1 }}>
        <Text style={s.onbPromiseTitle}>{T('Recited before sleeping')}</Text>
        <Text style={s.onbPromiseBody}>
          {T('The Prophet (peace be upon him) would not sleep until he had recited As-Sajdah and Al-Mulk.')}
        </Text>
        <Text style={s.sleepHadithRef}>{language === 'ar' ? SLEEP_SURAH.practiceAr : SLEEP_SURAH.practice}</Text>
      </View>
    </View>

    <Text style={s.preferenceLabel}>{T('WHEN DO YOU SLEEP?')}</Text>
    <View style={s.choiceGrid}>
      {TIMES.map(time => <ChoicePill key={time} label={time} selected={picked === time} onPress={() => choose(time)} />)}
    </View>

    {picked
      ? <View style={s.onbChosen}>
          {ico('checkmark-circle', 18, C.green)}
          <Text style={s.onbChosenText}>
            {T('A reminder will come at')} {picked}. {T('Change it or switch it off in Settings at any time.')}
          </Text>
        </View>
      : <Text style={s.onbNoteText}>{T('Choose an hour, or skip this — it can always be turned on later.')}</Text>}

    {picked && <Pressable accessibilityLabel={T('Do not remind me')} onPress={clear} style={s.onbGhostWide}>
      <Text style={s.onbGhostText}>{T('Do not remind me')}</Text>
    </Pressable>}

    <View style={s.sleepPrivacy}>
      {ico('shield-checkmark-outline', 16, C.green)}
      <Text style={s.sleepPrivacyText}>
        {T('The hour you choose is stored on this device and nowhere else. It is not sent to us, not shared, and not used for tracking — there is no account to attach it to.')}
      </Text>
    </View>
  </View>;
}

/**
 * The languages onboarding offers before it is expanded: the ones this app
 * speaks itself. The Quran exists in far more than these, and every one of
 * them stays one tap away, but opening on ninety-seven rows is not an
 * invitation to choose - it is a wall.
 */
const COMMON_CODES: string[] = LANGUAGES.map((entry) => entry.code);

function Onboarding({ onFinish }: { onFinish: () => void }) {
  const { dark, resolved } = useTheme();
  const { rtl, language, setLanguage } = useLanguage();
  const T = (text: string) => tx(language, text);
  const { update } = useQuranPreferences();
  /* Separate from the Quran preferences above: the sleep reminder lives with
     the other worship settings, so it has to be written through its own
     setter rather than the reader's. */
  const { update: updateWorship } = useWorshipSettings();
  const [step, setStep] = useState(0);
  const [app, setApp] = useState<LanguageCode>(language);
  const [text, setText] = useState<string>(language);
  const [voice, setVoice] = useState<LanguageCode>(language);
  const [busy, setBusy] = useState(false);
  const { location } = useAppLocation();
  const slide = useRef(new Animated.Value(0)).current;

  /* Every language the server carries, not the handful this app once listed
     by hand. They arrive once and are shared with the step that asks which
     meaning to read beside the Arabic. */
  const [editions, setEditions] = useState<IslamicEdition[]>([]);
  // Edition ids marked for offline. Nothing downloads until 'Begin'.
  const [queued, setQueued] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  /* Two things stay out of the way until they are asked for: the full
     language list, and offline downloads. Both are one tap away. */
  const [showAll, setShowAll] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  useEffect(() => { getEditions('quran').then(setEditions).catch(() => undefined); }, []);

  const languages = useMemo(
    () => (editions.length ? languagesOf(editions) : []),
    [editions],
  );
  /** Every edition of the language being read, the recommended one first. */
  const textEditions = useMemo(() => editionsForLanguage(editions, text), [editions, text]);
  const textEdition = textEditions[0] || null;
  const textEditionIds = useMemo(() => textEditions.map((e) => e.id), [textEditions]);

  /* Choosing a language keeps the whole language: every translation the
     server holds for it, not just the one shown. Switching between Urdu
     editions later should not need the network. The Arabic goes with it,
     always, and is added by the plan itself. */
  const textKey = textEditionIds.join(',');
  useEffect(() => {
    if (!textEditionIds.length) return;
    setQueued((current) => {
      const missing = textEditionIds.filter((id) => !current.includes(id));
      return missing.length ? [...current, ...missing] : current;
    });
  }, [textKey]);

  const byLanguage = useMemo(() => {
    const map = new Map<string, IslamicEdition[]>();
    for (const entry of languages) {
      const list = editionsForLanguage(editions, entry.code);
      if (list.length) map.set(entry.code, list);
    }
    return map;
  }, [editions, languages]);

  const everyId = useMemo(() => [...byLanguage.values()].flat().map((e) => e.id), [byLanguage]);
  const allQueued = everyId.length > 0 && everyId.every((id) => queued.includes(id));
  /* Turning everything off returns to the default rather than to nothing:
     the language being read is always kept, so the app always opens. */
  const toggleAll = () => setQueued(allQueued ? textEditionIds : everyId);
  const hasLanguage = (code: string) => {
    const list = byLanguage.get(code);
    return !!list && list.every((e) => queued.includes(e.id));
  };
  /** Adds or removes a whole language — every edition it carries. */
  const toggleLanguage = (code: string) => setQueued((current) => {
    const ids = (byLanguage.get(code) || []).map((e) => e.id);
    if (!ids.length) return current;
    if (ids.every((id) => current.includes(id))) return current.filter((id) => !ids.includes(id));
    return [...current, ...ids.filter((id) => !current.includes(id))];
  });

  /* The download button used to only record the choice, and everything came
     down at the end. That left a tap with no answer: nothing moved, nothing
     arrived, and there was no way to tell a download that had started from one
     that had not. So a tap starts the download there and then.

     Progress is measured in bytes actually on the device rather than in
     surahs counted, because "114 of 114" says nothing about how long is left
     and "38.4 MB" does. The baseline is the cache size at the moment the tap
     landed, so the figure is what this download has added, not what the app
     already held. */
  const [dl, setDl] = useState<{ code: string; baseline: number; bytes: number; percent: number } | null>(null);

  useEffect(() => subscribeOfflineSetup((next) => {
    setDl((current) => {
      if (!current) return current;
      /* The plan covers the whole queue, not one language, so it is asked to
         stop reporting once it is no longer running rather than when it
         finishes — a plan that finished someone else's language is not this
         language's progress. */
      if (!next.running) return null;
      return { ...current, percent: offlineProgress(next).percent };
    });
  }), []);

  useEffect(() => {
    if (!dl) return;
    let alive = true;
    const tick = async () => {
      const u = await getCacheUsage().catch(() => null);
      if (!alive || !u) return;
      setDl((current) => current ? { ...current, bytes: Math.max(0, (u.byNamespace?.quran || 0) - current.baseline) } : current);
    };
    void tick();
    const id = setInterval(tick, 1200);
    return () => { alive = false; clearInterval(id); };
  }, [dl?.code]);

  const startLanguage = async (code: string) => {
    const list = byLanguage.get(code) || [];
    if (!list.length) return;
    setQueued((current) => [...current, ...list.map((e) => e.id).filter((id) => !current.includes(id))]);
    const usage = await getCacheUsage().catch(() => null);
    setDl({ code, baseline: usage?.byNamespace?.quran || 0, bytes: 0, percent: 0 });
    void startOfflineSetup({
      language: code,
      script: 'qpc-hafs',
      translation: list[0]?.id,
      translationName: list[0] ? editionDisplayName(list[0]) : undefined,
      editions: list.map((e) => ({ id: e.id, name: editionDisplayName(e), language: e.language || code, category: 'quran' as const })),
      append: true,
    });
  };

  const cancelDownload = async () => { await pauseOfflineSetup(); setDl(null); };

  /* Until it is expanded, the list is only the languages this app speaks
     itself - not a judgement about the others, just a short way in. Searching
     always looks through every language, expanded or not. */
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = !needle && !showAll
      ? languages.filter((entry) => COMMON_CODES.includes(entry.code))
      : languages;
    if (!needle) return pool;
    return pool.filter(
      (entry) => entry.label.toLowerCase().includes(needle) || entry.code.includes(needle),
    );
  }, [languages, query, showAll]);

  // Each step arrives from the side rather than simply appearing.
  useEffect(() => {
    slide.setValue(0);
    Animated.timing(slide, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [step]);

  // One choice moves the rest with it.
  const chooseApp = (code: LanguageCode) => { setApp(code); setLanguage(code); setText(code); setVoice(code); };
  const chosen: string = step === 0 ? app : step === 1 ? text : voice;
  const pick = (code: string) => { if (step === 0) chooseApp(code as LanguageCode); else if (step === 1) setText(code); else setVoice(code as LanguageCode); };

  const steps = [
    { title: T('How should the app speak to you?'), caption: T('This sets the words on every screen, and it carries the Quran text and the voice with it. You can change either of those next.') },
    { title: T('Which meaning beside the Arabic?'), caption: T('The Quran is always shown in Arabic. This is the text you read next to it.') },
    { title: T('Which voice with the recitation?'), caption: T('Recitation stays the Arabic Qur’an. This adds a voice in your own language underneath it.') },
    { title: T('Where should prayer times be calculated?'), caption: T('Prayer times, Qibla and the fasting timetable all read from one place. Search for your city, or use your location once. This is asked only here — you can change it any time in Settings.') },
    { title: T('May this app remind you?'), caption: T('Adhan, a quiet reminder before each prayer, and a verse each morning. Every one of these can be switched off later, and nothing is scheduled until you allow it.') },
    { title: T('When do you sleep?'), caption: T('Surah Al-Mulk takes about five minutes. Say the hour you turn in and we will remind you before it — or skip this entirely. The hour stays on your device and is never used for tracking.') },
  ];
  /* Named, because the Continue button has to know which step raises the
     permission prompt, and a bare 4 says nothing to whoever reads it next. */
  const NOTIFICATION_STEP = 4;
  const active = steps[step];
  /* The offline controls belong to a question the person may never ask, so
     they stay folded away. They open themselves if there is a download to
     watch or if more has been queued than the reading language alone, so a
     choice already made is never hidden behind a collapsed section. */
  const offlineOpen = showOffline || !!dl || queued.length > textEditionIds.length;

  /** A short line under a card saying honestly what that choice can offer. */
  const hint = (entry: Language) => {
    if (step === 0) return entry.uiReady ? null : T('Interface stays in English');
    if (step === 1) return !entry.text ? T('Text stays in English') : entry.text.kind === 'tafsir' ? T('A tafsir, not a translation') : null;
    return entry.voice ? null : T('Recitation only');
  };

  /* `skipSleep` clears the reminder rather than merely not scheduling it, so
     that somebody who tapped an hour and then thought better of it is not
     left with a setting they never meant to keep. */
  const finish = async (skipSleep = false) => {
    if (busy) return;
    setBusy(true);
    try {
      if (skipSleep) await updateWorship({ sleepReminderEnabled: false });
      setLanguage(app);
      const voiceEntry = languageByCode(voice);
      /* The edition for the chosen language. Most languages have several, so
         it is read from the server's own list rather than from the short list
         this app keeps for its interface. */
      if (textEdition) await update({
        translationEdition: textEdition.id,
        translationName: editionDisplayName(textEdition),
        translationLanguage: languageLabel(textEdition.language || text),
      });
      // The voice heard under the recitation. Arabic has none: for Arabic the
      // audio *is* the recitation.
      await saveAudioSettings(voiceEntry?.voice
        ? { reciter: DEFAULT_RECITER.identifier, reciterName: DEFAULT_RECITER.name, translationAudioEnabled: true, translationEdition: voiceEntry.voice.identifier, translationName: voiceEntry.voice.name }
        : { reciter: DEFAULT_RECITER.identifier, reciterName: DEFAULT_RECITER.name, translationAudioEnabled: false });
      await saveOnboarding({ completed: true, app, text, voice, locationAsked: true, notificationsAsked: true, at: Date.now() });
      /* Everything marked for offline starts arriving now, along with the
         Arabic the plan always adds. Marking a language only recorded the
         choice — the download waits for this moment so that it never competes
         with onboarding for attention or bandwidth.

         It runs in the background and is resumable: the person is already
         using the app while the Quran comes down, and if they close it the
         plan picks up where it stopped next time. */
      const queue = queued
        .map((id) => editions.find((e) => e.id === id))
        .filter((e): e is IslamicEdition => !!e)
        .map((e) => ({ id: e.id, name: editionDisplayName(e), language: e.language || text, category: 'quran' as const }));
      void startOfflineSetup({
        language: text,
        script: 'qpc-hafs',
        translation: textEdition?.id,
        translationName: textEdition ? editionDisplayName(textEdition) : undefined,
        editions: queue,
      });
      /* The adhan recordings come down now too, for the same reason: they are
         what sounds at the prayer times, so they have to be on the device
         before the first one arrives, and they are far too large to ship
         inside the app.

         This is fire-and-forget on purpose. A person who has just finished
         onboarding should not be made to watch a progress bar, and a
         recording that fails here is fetched again the next time the adhan
         screen is opened - the only consequence of a failure is that the
         first prayer may fall back to a system tone. */
      void downloadAllAdhanTracks().catch(() => undefined);
      onFinish();
    } catch { setBusy(false); }
  };

  return <View style={s.safe}>
    <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
    <View style={s.onbTop}>
      <Image source={LOGO_MARK} resizeMode="contain" style={s.appLogo} />
    </View>
    <ScrollView keyboardShouldPersistTaps={SCROLL.keyboardShouldPersistTaps} overScrollMode={SCROLL.overScrollMode} contentContainerStyle={s.onbScroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={[s.onbHead, { opacity: slide, transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [rtl ? -26 : 26, 0] }) }] }]}>
        <Text style={s.h1}>{active.title}</Text>
        <Text style={s.onbCaption}>{active.caption}</Text>
      </Animated.View>
      {step === 1 ? <View style={s.onbList} key="languages">
        {/* Search comes first because it is the short way through ninety-seven
            languages: someone who knows they read Kiswahili should never have
            to scroll to it. */}
        <View style={s.onbSearch}>
          {ico('search-outline', 16, C.muted)}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={T('Search a language')}
            placeholderTextColor={C.muted}
            style={s.onbSearchInput}
            accessibilityLabel={T('Search a language')}
          />
          {!!query && <Pressable accessibilityLabel={T('Clear search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}
        </View>

        {/* Offline is a separate question from "which meaning will you read",
            so it stays folded until it is asked for. Opening it is what puts
            the download controls on the rows below. */}
        <View style={s.onbOffline}>
          <MotionPress
            accessibilityLabel={T('Keep translations for offline')}
            onPress={() => setShowOffline(!offlineOpen)}
            style={s.onbOfflineHead}>
            <View style={s.onbAllText}>
              <Text style={s.onbOfflineTitle}>{T('Keep translations for offline')}</Text>
              <Text style={s.onbAllSub}>{T('Optional. Nothing is downloaded until you finish setting up.')}</Text>
            </View>
            {ico(offlineOpen ? 'chevron-up-outline' : 'chevron-down-outline', 18, C.muted)}
          </MotionPress>
          {offlineOpen && <View style={s.onbAllBar}>
            <View style={s.onbAllText}>
              <Text style={s.onbAllTitle}>{T('Download all languages')}</Text>
              <Text style={s.onbAllSub}>{everyId.length ? T('Every translation in every language, kept on this device. Around 725 MB of free space.') : T('Every translation in every language.')}</Text>
            </View>
            <MotionPress
              accessibilityLabel={allQueued ? T('Remove all languages from offline') : T('Select all languages for offline')}
              onPress={toggleAll}
              style={[s.onbAllBtn, allQueued && s.onbAllBtnOn]}>
              {ico(allQueued ? 'checkmark' : 'download-outline', 16, C.onAccent)}
              <Text style={s.onbAllBtnText}>{T('All')}</Text>
            </MotionPress>
          </View>}
        </View>

        {!editions.length && <SkeletonList rows={5} />}
        {editions.length > 0 && !visible.length && <Text style={s.onbCardNote}>{T('No language matches that.')}</Text>}

        {visible.map((entry, index) => {
          const selected = chosen === entry.code;
          const list = byLanguage.get(entry.code) || [];
          const saved = hasLanguage(entry.code);
          const downloading = dl?.code === entry.code;
          return <RiseIn key={entry.code} delay={Math.min(index, 14) * 26}>
            <MotionPress style={[s.onbCard, selected && s.onbCardOn]} onPress={() => pick(entry.code)}>
              <View style={s.onbCardTop}>
                <Text style={s.onbFlag}>{languageFlag(entry.code)}</Text>
                <View style={s.onbCardText}>
                  <Text style={s.onbCardName}>{entry.label}</Text>
                  <Text style={s.onbCardSub}>
                    {entry.count === 1 ? T('1 version') : `${entry.count} ${T('versions')}`}
                  </Text>
                </View>
                {/* Marking only records the choice. Nothing downloads until
                    the last step, so onboarding stays quick. One tap keeps
                    every edition this language carries. */}
{offlineOpen && list.length ? <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={downloading ? `${T('Cancel')} ${entry.label}` : saved ? `${T('Stop keeping')} ${entry.label} ${T('offline')}` : `${T('Keep')} ${entry.label} ${T('for offline')}`}
                  onPress={() => downloading ? cancelDownload() : startLanguage(entry.code)}
                  style={[s.onbDl, (saved || downloading) && s.onbDlOn]}>
                  {ico(downloading ? 'close-outline' : saved ? 'checkmark' : 'download-outline', 17, (saved || downloading) ? C.onAccent : C.ink)}
                </Pressable> : null}
                <View style={[s.onbTick, selected && s.onbTickOn]}>{selected && ico('checkmark', 16, C.onAccent)}</View>
              </View>
              {downloading ? <View style={s.onbProgressRow}>
                <View style={s.onbProgressTrack}>
                  <View style={[s.onbProgressFill, { width: `${Math.max(3, dl?.percent || 0)}%` }]} />
                </View>
                <Text style={s.onbProgressText}>
                  {formatBytes(dl?.bytes || 0)}{(dl?.percent || 0) > 0 ? ` · ${dl?.percent}%` : ''}
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel={T('Cancel')}
                  onPress={() => cancelDownload()} style={s.onbCancel}>
                  <Text style={s.onbCancelText}>{T('Cancel')}</Text>
                </Pressable>
              </View> : (offlineOpen && saved) && <View style={s.onbSavedRow}>
                {ico('cloud-done-outline', 12, C.success)}
                <Text style={s.onbSavedText}>{T('Saved for offline')}</Text>
              </View>}
            </MotionPress>
          </RiseIn>;
        })}

        {/* The rest of the languages, behind one tap. The count is stated so
            that expanding is a decision rather than a surprise. */}
        {!showAll && !query && languages.length > visible.length && <MotionPress
          accessibilityLabel={T('Show all languages')}
          onPress={() => setShowAll(true)}
          style={s.onbMore}>
          <Text style={s.onbMoreText}>
            {T('Show all')} {languages.length} {T('languages')}
          </Text>
          {ico('chevron-down-outline', 16, C.muted)}
        </MotionPress>}
      </View> : step < 3 ? <View style={s.onbList} key={step}>
        {LANGUAGES.map((entry, index) => {
          const selected = chosen === entry.code;
          const note = hint(entry);
          return <RiseIn key={entry.code} delay={index * 40}>
            <MotionPress style={[s.onbCard, selected && s.onbCardOn]} onPress={() => pick(entry.code)}>
              <View style={s.onbCardTop}>
                <View style={s.onbCardText}>
                  <Text style={[s.onbCardName, entry.rtl && s.onbCardNameRtl]}>{entry.native}</Text>
                  {entry.native !== entry.english && <Text style={s.onbCardSub}>{entry.english}</Text>}
                </View>
                <View style={[s.onbTick, selected && s.onbTickOn]}>{selected && ico('checkmark', 16, C.onAccent)}</View>
              </View>
              {note ? <Text style={s.onbCardNote}>{note}</Text> : null}
            </MotionPress>
          </RiseIn>;
        })}
      </View> : step === 3 ? <OnboardingLocation/> : step === 4 ? <OnboardingNotifications/> : <OnboardingSleep/>}
    </ScrollView>
    <View style={s.onbFoot}>
      <View style={s.onbDots}>{steps.map((_, index) => <View key={index} style={[s.onbDot, index === step && s.onbDotOn]} />)}</View>
      <View style={s.onbActions}>
        {step > 0 && <MotionPress style={s.onbGhost} onPress={() => setStep(step - 1)}><Text style={s.onbGhostText}>{T('Back')}</Text></MotionPress>}
        {step === steps.length - 1 && <MotionPress style={s.onbGhost} onPress={() => void finish(true)}><Text style={s.onbGhostText}>{T('Skip')}</Text></MotionPress>}
        <MotionPress style={[s.onbCta, busy && s.onbCtaOff]} onPress={() => {
          if (step < steps.length - 1) {
            /* Leaving the notifications step raises the system prompt, for
               anybody who has not answered the button on that step already. */
            /* Gate on canAsk, never on the status alone. On Android 13 a
               device that has never been asked reports `denied`, so any check
               written against the status silently skips the one device that
               most needs asking — which is why the prompt never appeared here.
               Someone who has already answered on this screen is covered too:
               canAsk is false the moment they have. */
            if (step === NOTIFICATION_STEP) void getNotificationStatus().then((current) => {
              if (!current.canAsk) return;
              void requestNotificationPermission(language);
            });
            setStep(step + 1);
          } else void finish();
        }}>
          <Text style={s.onbCtaText}>{step < steps.length - 1 ? T('Continue') : T('Begin')}</Text>
        </MotionPress>
      </View>
    </View>
  </View>;
}

/**
 * The gate. A splash while the app settles, then onboarding the first time
 * through, then the app itself. The app is mounted underneath the whole time,
 * so the first screen is warm by the time it is uncovered.
 */
/**
 * The language a translation edition is written in, read from its identifier.
 *
 * Editions are named `tr_<language>_<translator>` — `tr_ur_abul_ala_maududi`,
 * say — so the language is the second part. It is parsed rather than looked
 * up in the catalogue because this has to work on the very first launch,
 * before any catalogue has been fetched.
 */
function languageFromEditionId(editionId: string): string {
  const match = /^(?:tr|tafsir)_([a-z]{2,3})_/.exec(String(editionId || '').toLowerCase());
  return match ? match[1] : '';
}

/**
 * Keeps the spoken translation in step with the language being read.
 *
 * Someone who switched the app to Urdu kept hearing the translation recited
 * in English. The choice lived only in the player: it was set once at its
 * default and thereafter changed by hand, mid-verse, and nothing that changed
 * the reading language ever touched it.
 *
 * So the reading language drives it now, from wherever that language was
 * chosen — onboarding, the Translation screen, or Reading settings — because
 * all three write the same preference. Where a voice exists in that language
 * it is selected; where none does, the spoken translation is turned off and
 * the recitation plays alone. Whether it plays at all remains the person's
 * own switch: this decides which voice, not whether.
 */
function useAudioLanguageSync() {
  const { language: appLanguage } = useLanguage();
  const { preferences, hydrated } = useQuranPreferences();
  const language = languageFromEditionId(preferences.translationEdition);
  useEffect(() => {
    if (!hydrated || !language) return;
    void syncAudioTranslationToLanguage(language).catch(() => undefined);
  }, [hydrated, language]);
}


/**
 * Catches a screen that throws on render.
 *
 * There was nowhere in the app for an error to land, so one bad screen took the
 * whole tree down with it: the app went blank and stayed blank, and reloading
 * ran straight back into the same throw, which is why the only way out was to
 * clear storage. Now the failure is contained to the part that failed, and the
 * rest of the app — and a way back — stays on screen.
 *
 * The boundary is keyed on the message so that a second, different failure
 * resets it rather than leaving the first one's message up.
 */
class ScreenBoundary extends React.Component<
  { children: React.ReactNode; onReset?: () => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Kept on the console: this is the trace you need when a screen will not
    // open, and it is otherwise impossible to recover after the fact.
    console.error('[screen]', error?.message, info?.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;
    /* Read from the mirror rather than the hook: this renders outside the
       provider, and a screen that has already thrown is the moment when the
       words on it matter most. */
    const language = getAppLanguage();
    const heading = tx(language, 'This screen could not open');
    const body = tx(language, 'Something went wrong while drawing it. The rest of the app is fine, and you can try again.');
    const action = tx(language, 'Try again');
    return <View style={s.crashScreen}>
      <View style={s.crashCard}>
        <Text style={s.crashTitle}>{heading}</Text>
        <Text style={s.crashBody}>{body}</Text>
        {!!this.state.error?.message && <Text style={s.crashDetail}>{String(this.state.error.message).slice(0, 200)}</Text>}
        <Tactile accessibilityRole="button" accessibilityLabel={action} onPress={this.reset} style={s.primary}>
          <Text style={s.primaryText}>{action}</Text>
        </Tactile>
      </View>
    </View>;
  }
}

/* The reading a language is named after, when the catalog offers more than
   one and the first is not the one to open on.

   The Urdu list is the reason this exists. Its first eight entries are
   Roman Urdu — the meaning written in Latin letters — because that is how
   they sort. Handing those to somebody who has just asked to read the app
   in Urdu would give them the Qur'an in a script they did not ask for,
   which is worse than the English they were already reading.

   The names of the native-script editions are themselves written in Urdu,
   so the script of the title is the signal. Where a curated name exists it
   is preferred; the rest fall back to that test, then to catalog order. */
const PREFERRED_TRANSLATION: Record<string, string> = {
  ur: 'tr_ur_fateh_muhammad_jalandhry',
  en: 'tr_en_saheeh_international',
  ar: 'tr_ar_buck',
  /* Turkish has sixty translations and the first is a Latin-script
     transliteration, so the same rule that kept Roman Urdu away from an
     Urdu reader applies here: name the one to open on. Diyanet is the
     translation of Turkey's Presidency of Religious Affairs, which is
     the one a Turkish reader will recognise and expect. */
  tr: 'tr_tr_diyanet_isleri',
};

/** True when a title is written in a script other than Latin. */
function inNativeScript(name: string): boolean {
  return /[؀-ۿऀ-ॿ਀-੿]/.test(name || '');
}

/**
 * The edition to read a language in, or null when the catalog carries none.
 *
 * Preference order: the curated id if the catalog has it, then an edition
 * whose title is in the language's own script, then the first one listed.
 */
function bestEditionFor(editions: IslamicEdition[], language: string): IslamicEdition | null {
  const code = (language || '').toLowerCase();
  const wanted = editions.filter((e) => (e.language || '').toLowerCase() === code);
  if (!wanted.length) return null;
  const preferred = PREFERRED_TRANSLATION[code];
  if (preferred) {
    const hit = wanted.find((e) => e.id === preferred);
    if (hit) return hit;
  }
  return wanted.find((e) => inNativeScript(e.displayName)) ?? wanted[0];
}

/**
 * Puts the content in the language the app is being read in.
 *
 * Choosing Urdu or Arabic used to move the interface and nothing else: the
 * buttons and headings changed, while the translation under every ayah, the
 * hadith on the Home screen and the spoken translation stayed English, and
 * were each switched separately, three screens deep, by anyone who wanted
 * them to match. They follow the app now.
 *
 * Two things are deliberately left alone. A translation picked by hand
 * afterwards is not put back — the sync runs on a change of language, not
 * on a change of preference — so the settings screens still work as a way
 * of overriding it. And where a language has nothing in the catalog,
 * English is chosen rather than leaving whatever was there, because reading
 * a translation in a language you did not ask for is the thing being fixed.
 *
 * The spoken translation is not touched here. It follows the reading
 * translation on its own, so it arrives at the right voice through that.
 */
function useContentLanguageSync() {
  const { language, ready } = useLanguage();
  const { preferences, update, hydrated } = useQuranPreferences();

  /* Hadith. It serves nine languages of its own, which is not the app's
     list, so an app language it does not carry lands on English. */
  useEffect(() => {
    if (!ready) return;
    const wanted = hadithLanguage(language) ? language : DEFAULT_HADITH_LANGUAGE;
    if (wanted === getHadithLanguage()) return;
    void setHadithLanguage(wanted);
  }, [language, ready]);

  /* The reading translation. One catalog read per change of language,
     cached by the service for six hours, and used both to see whether the
     current choice is already in this language and to find the one to
     move it to. */
  useEffect(() => {
    if (!ready || !hydrated) return;
    let alive = true;
    void (async () => {
      const editions = await getEditions('quran').catch(() => [] as IslamicEdition[]);
      if (!alive || !editions.length) return;
      const current = editions.find((e) => e.id === preferences.translationEdition);
      /* Already reading this language — whether we put it there or the
         reader did — so leave it. */
      if (current && (current.language || '').toLowerCase() === language.toLowerCase()) return;
      const pick = bestEditionFor(editions, language) ?? bestEditionFor(editions, 'en');
      if (!alive || !pick || pick.id === preferences.translationEdition) return;
      await update({
        translationEdition: pick.id,
        translationName: editionDisplayName(pick),
        translationLanguage: languageLabel(pick.language || 'en'),
      });
    })();
    return () => { alive = false; };
  }, [language, ready, hydrated, preferences.translationEdition, update]);
}

function AppShell() {
  const { ready, rtl: rtlNow , language }=useLanguage();  /* rtlNow is a flag here, not a function */
  const { location } = useAppLocation();
  const { settings } = useWorshipSettings();
  const { hydrated } = useQuranPreferences();
  useAudioLanguageSync();
  useContentLanguageSync();
  const [onboarding, setOnboarding] = useState<boolean | null>(null);
  const [splash, setSplash] = useState(true);
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    void loadOnboarding().then(value => setOnboarding(!value?.completed)).catch(() => setOnboarding(false));
  }, []);

  // A storage read that never settles must not leave the app stuck behind the
  // splash. Six seconds is far longer than hydration takes on any device.
  useEffect(() => {
    const timer = setTimeout(() => setStalled(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Answering a notification.
   *
   * There are two kinds of answer and they want different things.
   *
   * The two buttons on the adhan do a job and then stay out of the way:
   * somebody mid-prayer should not have to unlock their phone to silence
   * it, and somebody who has just prayed should be able to record that
   * from the lock screen without opening the app and hunting for the
   * toggle. Neither of those should drag her into the app.
   *
   * A tap on the notification itself is the other thing. It is a request
   * to be taken somewhere, and every notification this app schedules says
   * where it meant to go. That promise used to be written and never kept:
   * only the sleep reminder was handled, so tapping an adhan, a pre-adhan,
   * a nudge to carry on reading, or either of the daily cards did nothing
   * at all. The route is now read for what it is.
   */
  const openFromNotification = async (data: any) => {
    /* Deliberately no "is the navigator ready?" test here. There was one, and
       it was why tapping a notification opened the app to the home screen
       instead of the thing the notification was about: a tap that launches the
       app arrives while the navigator is still being built, the answer was
       "not ready", and the intent was dropped on the floor. `navigateWhenReady`
       already waits for readiness, so the waiting is done there and nowhere
       else — the destination is never thrown away for being early. */
    const go = (name: string, params?: any) => navigateWhenReady(name, params);

    /* The sleep reminder opens the surah itself. A reminder to read Al-Mulk
       that lands you on the home screen has done half a job. */
    if (data?.kind === 'sleep' && data?.surah) {
      go('Quran', {
        screen: 'Reader',
        params: {
          chapter: {
            id: data.surah,
            name_simple: SLEEP_SURAH.name,
            name_arabic: SLEEP_SURAH.nameAr,
            verses_count: SLEEP_SURAH.verses
          },
          mode: 'both'
        },
        initial: false
      });
      return;
    }

    /* "Back to your reading" picks up where she left off. Opening the Quran
       tab and leaving her to find her own place again is not the same thing
       as carrying on. */
    if (data?.kind === 'continue') {
      /* The position is read rather than trusted from the notification,
         because it may have moved on since this reminder was scheduled —
         carrying on should mean from where she actually stopped, not from
         where she was half an hour ago. The place written into the
         notification is the fallback for when nothing is stored. */
      const position = await loadReadingPosition().catch(() => null);
      const surahId = position?.surahId ?? data?.surah;
      const verseKey = position?.verseKey ?? data?.verseKey;
      if (surahId) {
        go('Quran', {
          screen: 'Reader',
          params: {
            chapter: {
              id: surahId,
              name_simple: position?.surahName || '',
              name_arabic: '',
              verses_count: 0
            },
            ...(verseKey ? { focusVerse: verseKey } : {})
          },
          initial: false
        });
        return;
      }
      /* Nothing saved yet - fall through and open the Quran tab instead. */
    }

    /* Everything else names a tab. Only the five real ones are followed:
       a name the navigator does not know is swallowed with a console
       warning, and the tap would feel exactly as dead as it did before. */
    const route = data?.route;
    if (route === 'Home' || route === 'Prayer' || route === 'Quran' || route === 'Library' || route === 'Tools') {
      go(route);
    }
  };

  /* While the app is open, arrival is observable, so the history can say
     delivered rather than only sent. Backgrounded, the system delivers the
     notification without telling the app, which is why entries exist at all. */
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = addNotificationReceivedListener((notification) => {
      const content = notification?.request?.content;
      if (content) void markDelivered(content);
    });
    return () => sub.remove();
  }, []);

  const handleNotificationResponse = (response: NotificationResponse | null | undefined) => {
    if (!response) return;
    const data: any = response?.notification?.request?.content?.data;
    const action = actionFromResponse(response);

    /* Tapped, so it was both delivered and seen. */
    if (response?.notification?.request?.content) void markOpened(response.notification.request.content);

    /* Buttons first. They act, and they do not navigate. */
    if (action === 'mute') {
      // Silence whatever is playing, and anything queued behind it.
      void stopPlayback();
      return;
    }
    if (action === 'prayed') {
      const prayer = prayerFromNotification(data);
      if (prayer) {
        const key = new Date().toISOString().slice(0, 10);
        void loadPrayerCompletion(key).then((current) => {
          if (current.includes(prayer)) return;
          const next = [...current, prayer];
          return savePrayerCompletion(key, next);
        });
      }
      return;
    }

    /* A plain tap. Go where the notification said it would. */
    void openFromNotification(data);
  };

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* A tap that starts the app is not delivered by the listener above: by the
     time JavaScript can subscribe, the response has already happened. It is
     held by the system and has to be collected, which is what this does.

     Without it, every notification tapped from a closed app did nothing —
     the app opened, and that was all. It is tried a few times over the first
     seconds, because the navigator is still being built when the response
     arrives and a single attempt can land too early. */
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let cancelled = false;
    let attempts = 0;
    const collect = async () => {
      attempts += 1;
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (cancelled || !response) return;
        /* Only a response from a moment ago counts as the thing that opened
           the app; an old one would reopen a screen days later. */
        handleNotificationResponse(response as NotificationResponse);
      } catch {
        /* not fatal: the listener still covers taps made while running */
      }
      if (!cancelled && attempts < 3) setTimeout(collect, 800);
    };
    void collect();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keeping the schedule honest.
     Prayer times move every day, and they move a long way when somebody
     travels, so everything is rescheduled whenever the day, the place or the
     settings change — rather than trusting timers laid down earlier. */
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!location || !settings) return;
    let live = true;
    void managedPrayerSnapshot(location, settings).then(async (value) => {
      if (!live) return;
      const position = await loadReadingPosition().catch(() => null);
      await schedulePrayerNotifications(
        value.snapshot, settings, language,
        position ? { surahId: position.surahId, verseKey: position.verseKey,
                     label: `${position.surahName} ${position.verseKey}` } : null,
      );
    }).catch(() => undefined);
    return () => { live = false; };
  }, [location?.latitude, location?.longitude, JSON.stringify({
    adhan: settings?.adhanEnabled, reciter: settings?.adhanReciter,
    reminders: settings?.remindersEnabled, offset: settings?.reminderOffset,
    per: settings?.prayerReminders, verse: settings?.dailyVerseReminder,
    verseAt: settings?.dailyVerseTime, hadith: settings?.dailyHadithReminder,
    hadithAt: settings?.dailyHadithTime, cont: settings?.continueReadingReminder,
    sleep: settings?.sleepReminderEnabled, sleepAt: settings?.sleepReminderTime
  })]);

  /* What the splash is waiting for. Three storage reads have to land before
     the app can show anything, and the bar counts them off rather than
     sweeping back and forth: what it shows is how far the start has actually
     got. The sixth-second fallback is still there for a read that never
     settles, and it counts as done. */
  const bootSteps = [ready, hydrated, onboarding !== null];
  const bootProgress = bootSteps.filter(Boolean).length / bootSteps.length;
  const bootSettled = bootSteps.every(Boolean) || stalled;

  /* The layout direction starts here, at the very top, so it reaches every
     screen — including the ones that do not go through <Page>. Yoga passes
     direction down to a node's children, which is why this works on both
     platforms and needs no restart, unlike I18nManager.

     Because direction is inherited, a plain flexDirection:'row' already runs
     right to left in here. Do not add `rtl ? 'row-reverse' : 'row'` to a
     child: the two cancel and the row comes out left to right again — which
     is what left the floating tab bar unmirrored. */
  return <View style={[s.shellRoot,{direction:shellDirection(rtlNow)} as any]}>
    {/* Nothing mounts until the saved language is known, so the very first
        frame is already in the right language and the right direction. The
        splash covers the read, which is a single storage lookup. */}
    {ready && <Root />}
    {splash && <View style={s.shellLayer}><Splash ready={bootSettled} progress={bootProgress} onDone={() => setSplash(false)} /></View>}
    {!splash && onboarding === true && <View style={s.shellLayer}><Onboarding onFinish={() => setOnboarding(false)} /></View>}
  </View>;
}

/**
 * Re-reads everything a restore may have replaced.
 *
 * Most services keep their state in a module variable set once at startup.
 * Writing new values into storage does not move those variables, so without
 * this the app would carry on showing the old data until it was restarted —
 * a restore that appears to do nothing is worse than one that refuses.
 */
async function reloadAllState() {
  await Promise.all([
    loadOfflineSetup(), loadAudioSettings(), loadHadithState(), loadTasbihState(),
    loadDownloads(), loadActivity(), loadFastingState(), loadJourneys(),
    loadWomensState(), loadZakatState(), loadLockConfig(), loadMemorization(),
    loadReports(), loadKhatamState(), loadQadaState(), loadSadaqahState(), loadJournalState(), loadSunnahState(),
  ]).catch(() => undefined);
}

export default function App(){const[fontsLoaded]=useFonts({DMSans_400Regular,DMSans_600SemiBold,DMSans_700Bold,Newsreader_600SemiBold,NotoNaskhArabic_400Regular,NotoNaskhArabic_600SemiBold,Amiri_400Regular,KFGQPCUthmanicHafs,IBMPlexSansArabic_400Regular,IBMPlexSansArabic_600SemiBold});const restoreTick=useRestoreNonce();
useEffect(()=>{if(restoreTick>0){void reloadAllState()}},[restoreTick]);
useEffect(()=>{if(fontsLoaded){void loadOfflineSetup();void resumeSavedOfflineSetup();resumeSavedQuranPreload();/* The saved recitation is restored after the first frame rather than during
   it. Restoring it means bringing the transport up, and a transport that
   answers nothing must not be able to keep the app from painting: this runs
   once the screen is already up, and swallows its own failure, so the worst
   a broken player can do is leave the mini player silent. */
void loadAudioSettings().then(() => new Promise<void>(resolve => setTimeout(resolve, 0)).then(() => restoreSavedSession())).catch(() => undefined);void loadHadithState();void loadTasbihState();void loadDownloads();void loadActivity();void loadFastingState();void loadJourneys();void loadWomensState();void loadZakatState();void loadKhatamState();void loadQadaState();void loadSadaqahState();void loadJournalState();void loadLockConfig();void loadBackupSettings();void refreshMarket();startLockWatch();startBackupWatch()}},[fontsLoaded]);if(!fontsLoaded)return <SafeAreaView style={s.safe}><Spinner/></SafeAreaView>;/* The boundary sits *outside* every provider, not just around the shell. A
   provider that throws on its first render takes the whole tree with it, and
   a boundary nested inside them never sees the error — the app simply comes
   up as an empty screen with nothing to explain it. From out here the crash
   card is drawn with the real message instead. It needs no context of its
   own: the copy comes from I18nManager and the styles from module scope. */
return <ScreenBoundary><ThemeProvider key={restoreTick}><SkeletonProvider><LanguageProvider><QuranPreferencesProvider><WorshipSettingsProvider><LocationProvider><AppShell/></LocationProvider></WorshipSettingsProvider></QuranPreferencesProvider></LanguageProvider></SkeletonProvider></ThemeProvider></ScreenBoundary>}

/**
 * The Arabic face used everywhere, once someone has chosen one.
 *
 * The app used two: a Quranic hand for the Quran and IBM Plex Sans Arabic for
 * everything else — buttons, names, headings. That is the right default, but it
 * means picking a face for the Quran changed the Quran and nothing else, so the
 * app wore two different Arabic hands at once. When a face is chosen it is now
 * carried through the whole sheet; the null default keeps the split.
 */
let arabicFontOverride: string | null = null;
const ARABIC_FACES = new Set([
  'KFGQPCUthmanicHafs',
  'IBMPlexSansArabic_400Regular',
  'IBMPlexSansArabic_600SemiBold',
  'IBMPlexSansArabic_700Bold',
]);

/**
 * The Latin face the interface is set in, when it is not DM Sans.
 *
 * Every Latin weight the sheet asks for is remapped, so a screen wearing
 * `DMSans_700Bold` keeps its weight when the face changes. Vietnamese and
 * Sinhala need this today — see `ensureLatinFace`. Cleared back to null for
 * every other language, which leaves the sheet on DM Sans exactly as before.
 */
let latinFontMap: Record<string, string> | null = null;

let s: Record<string, any> = makeStyles();

/** Builds the style sheet for the palette that is currently in use. */
function makeStyles() {
  const created: Record<string, any> = StyleSheet.create({
 packingHead:{flexDirection:'row',alignItems:'center',gap:12,marginTop:18,marginBottom:4},
 packingCount:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',minWidth:52},
 packingTrack:{flex:1,height:8,borderRadius:4,backgroundColor:C.mint,overflow:'hidden'},
 packingFill:{height:8,borderRadius:4,backgroundColor:C.green},
 packingPct:{color:C.muted,fontSize:12,fontFamily:'DMSans_600SemiBold',minWidth:38,textAlign:'right'},
 packingGroup:{marginTop:22},
 packingGroupTitle:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold',letterSpacing:1.4,marginBottom:10},
 packingRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:11,borderBottomWidth:1,borderColor:C.line},
 packingBox:{width:24,height:24,borderRadius:8,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',backgroundColor:C.card},
 packingBoxOn:{backgroundColor:C.green,borderColor:C.green},
 packingItem:{flex:1,color:C.ink,fontSize:14,fontFamily:'DMSans_400Regular'},
 packingItemOn:{color:C.muted,textDecorationLine:'line-through'},
 shellRoot:{flex:1,backgroundColor:C.bg},
 shellLayer:{position:'absolute',left:0,right:0,top:0,bottom:0},
 splashRoot:{flex:1,backgroundColor:C.heroA,alignItems:'center',justifyContent:'center',overflow:'hidden'},
 splashFill:{position:'absolute',left:0,right:0,top:0,bottom:0},
 /* Splash emblem: every stroke is its own small drawing stacked on the same
       centre, so each one can be timed and turned on its own. */
    khatamWrap:{position:'absolute',width:KHATAM_BOX,height:KHATAM_BOX,alignItems:'center',justifyContent:'center'},
    khatamStroke:{position:'absolute',width:KHATAM_BOX,height:KHATAM_BOX},
 splashStage:{alignItems:'center',justifyContent:'center',gap:26,paddingHorizontal:40},
 splashMarkWrap:{width:112,height:112,alignItems:'center',justifyContent:'center'},
 splashMark:{width:88,height:88},
 splashWords:{alignItems:'center',gap:8},
 splashName:{color:C.onHero,fontSize:30,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6,textAlign:'center'},
 splashTagline:{color:'rgba(255,255,255,.68)',fontSize:13,fontFamily:'DMSans_400Regular',textAlign:'center',letterSpacing:.2},
 splashVersion:{marginTop:4,paddingHorizontal:11,paddingVertical:4,borderRadius:999,borderWidth:1,borderColor:'rgba(255,255,255,.30)',backgroundColor:'rgba(255,255,255,.09)'},
 splashVersionText:{color:C.onHero,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.4,textAlign:'center'},
 splashTrack:{position:'absolute',bottom:56,left:'22%',right:'22%',height:3,borderRadius:2,backgroundColor:'rgba(255,255,255,.22)',overflow:'hidden'},
 splashBar:{height:3,borderRadius:2,backgroundColor:C.onHero},
 onbTop:{paddingHorizontal:20,paddingTop:12,paddingBottom:2},
 onbScroll:{paddingHorizontal:20,paddingTop:4,paddingBottom:12},
 onbHead:{marginBottom:12},
 onbCaption:{color:C.muted,fontSize:13,fontFamily:'DMSans_400Regular',lineHeight:19,marginTop:5},
 onbList:{gap:8},
 onbCard:{backgroundColor:C.card,borderRadius:16,padding:11,borderWidth:1,borderColor:C.line},
 onbCardOn:{borderColor:C.green,backgroundColor:C.mint},
 onbCardTop:{flexDirection:'row',alignItems:'center',gap:10},
 onbCardText:{flex:1,gap:2},
 onbCardName:{color:C.ink,fontSize:15,fontFamily:'DMSans_600SemiBold'},
 onbCardNameRtl:{textAlign:'right'},
 onbCardSub:{color:C.muted,fontSize:12,fontFamily:'DMSans_400Regular'},
 onbCardNote:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular',marginTop:6},
 onbTick:{width:22,height:22,borderRadius:11,backgroundColor:C.blue,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
 onbTickOn:{backgroundColor:C.green,borderColor:C.green},
 /* --- offline downloads on the language step --- */
 onbAllBar:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.mint,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line,marginBottom:12},
 onbAllText:{flex:1,gap:2},
 onbAllTitle:{color:C.ink,fontSize:15,fontFamily:'DMSans_600SemiBold'},
 onbAllSub:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular',lineHeight:16},
 onbAllBtn:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:C.green,borderRadius:14,paddingHorizontal:12,paddingVertical:9},
 onbAllBtnOn:{backgroundColor:C.success},
 onbAllBtnText:{color:C.onAccentInk,fontSize:12,fontFamily:'DMSans_600SemiBold'},
 onbCount:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular'},
 onbDl:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,backgroundColor:C.blue},
 onbDlOn:{backgroundColor:C.success,borderColor:C.success},
 onbDlBusy:{backgroundColor:C.blue,borderColor:C.green},
 onbFlag:{fontSize:18,marginRight:8},
 onbSearch:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.card,borderRadius:14,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderColor:C.line,marginBottom:8},
 onbSearchInput:{flex:1,color:C.ink,fontSize:14,fontFamily:'DMSans_400Regular',padding:0},
 onbSavedRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:6},
 onbOffline:{backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,overflow:'hidden',marginBottom:8},
 onbOfflineHead:{flexDirection:'row',alignItems:'center',gap:10,padding:12},
 onbOfflineTitle:{color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold'},
 onbAllBarFlat:{margin:12,marginTop:0},
 onbMore:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingVertical:12,borderRadius:14,borderWidth:1,borderColor:C.line,borderStyle:'dashed'},
 onbMoreText:{color:C.muted,fontSize:13,fontFamily:'DMSans_600SemiBold'},
 onbSavedText:{color:C.success,fontSize:11,fontFamily:'DMSans_500Medium'},
 onbFoot:{paddingHorizontal:20,paddingTop:10,paddingBottom:16,gap:10,borderTopWidth:1,borderColor:C.line,backgroundColor:C.bg},
 onbDots:{flexDirection:'row',justifyContent:'center',gap:6},
 onbDot:{width:7,height:7,borderRadius:4,backgroundColor:C.line},
 onbDotOn:{width:24,backgroundColor:C.green},
 onbActions:{flexDirection:'row',gap:10},
 onbCta:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:46,borderRadius:16,backgroundColor:C.green},
 onbCtaOff:{opacity:.6},
 onbCtaText:{color:C.onAccentInk,fontSize:15,fontFamily:'DMSans_700Bold'},
 onbGhost:{flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:46,paddingHorizontal:20,borderRadius:16,borderWidth:1,borderColor:C.line},
 onbGhostText:{color:C.ink,fontSize:15,fontFamily:'DMSans_600SemiBold'},
  journeyCard:{flexDirection:'row',alignItems:'center',gap:CARD.gap,backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,...surface},
  journeyTitleRow:{flexDirection:'row',alignItems:'center',gap:SPACE.sm},
  journeyArabic:{color:C.green,fontSize:18,fontFamily:'KFGQPCUthmanicHafs',marginTop:SPACE.xs,marginBottom:SPACE.xs,writingDirection:'rtl'},
  journeyBar:{height:6,borderRadius:3,backgroundColor:C.mint,overflow:'hidden',marginTop:SPACE.sm,marginBottom:SPACE.xs},
  journeyBarFill:{height:6,borderRadius:3,backgroundColor:C.green},
  stepCard:{backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:CARD.gap,...surface},
  stepCardDone:{borderColor:C.gold,backgroundColor:C.card},
  stepHead:{flexDirection:'row',alignItems:'flex-start',gap:CARD.gap},
  stepIndex:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.4,marginBottom:SPACE.xs},
  stepCheck:{width:44,height:44,borderRadius:22,borderWidth:1.5,borderColor:C.line,alignItems:'center',justifyContent:'center'},
  stepCheckDone:{backgroundColor:C.accent,borderColor:C.green},
  stepCountBox:{alignItems:'center',minWidth:96},
  stepCount:{color:C.ink,fontSize:24,fontFamily:'Newsreader_600SemiBold'},
  stepCountLabel:{color:C.muted,fontSize:11,marginTop:SPACE.xs},
  verseBox:{backgroundColor:C.mint,borderRadius:RADIUS.lg,padding:CARD.padding,gap:SPACE.sm,borderWidth:1,borderColor:C.line},
  verseArabic:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:24,lineHeight:48,includeFontPadding:false,writingDirection:'rtl'},
  stepNote:{color:C.ink,fontSize:13,fontStyle:'italic',backgroundColor:C.mint,borderRadius:RADIUS.md,padding:SPACE.md},
  channelCard:{backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:SPACE.md,...surface},
  channelHead:{flexDirection:'row',alignItems:'center',gap:CARD.gap},
  channelArabic:{color:C.green,fontSize:18,fontFamily:'KFGQPCUthmanicHafs',marginTop:SPACE.xs,writingDirection:'rtl'},
  dataSourceRow:{marginTop:8},
  floatBarWrap:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:Platform.OS==='ios'?24:16,pointerEvents:'box-none'},
  /* The shadow, split out onto its own wrapper: see FloatingTabBar. */
  floatBarShadow:{height:66,borderRadius:33,...shadow},
  /* The material. Its blur is clipped to this box already, and the tint
     comes from expo-blur plus the wash painted inside it, so there is no
     backgroundColor here — setting one would sit under the tint and
     deaden the glass. */
  floatBar:{height:66,borderRadius:33,overflow:'hidden',alignItems:'center',justifyContent:'space-between',paddingHorizontal:FLOAT_BAR_PAD,
    /* Four hairlines rather than one. Bright along the top where the light
       falls, dim along the bottom: that gradient across the edge is most of
       what makes the capsule read as something with thickness rather than as
       a rounded rectangle with a border. */
    borderWidth:1,
    borderTopColor:themeDark?GLASS.dark.rimTop:GLASS.light.rimTop,
    borderLeftColor:themeDark?GLASS.dark.rimSide:GLASS.light.rimSide,
    borderRightColor:themeDark?GLASS.dark.rimSide:GLASS.light.rimSide,
    borderBottomColor:themeDark?GLASS.dark.rimBottom:GLASS.light.rimBottom},
  /* The indicator is measured, not laid out: it is absolutely placed and
     moved with a transform, so nothing about it can reflow the bar. */
  floatIndicator:{position:'absolute',left:FLOAT_BAR_PAD+3,top:6,height:54,borderRadius:24},
  floatItem:{flex:1,alignItems:'center',justifyContent:'center',minHeight:54,borderRadius:28},
  floatPill:{alignItems:'center',justifyContent:'center',borderRadius:24,paddingHorizontal:12,paddingVertical:8,minWidth:58},
  /* The selected tab is lifted out of the material rather than painted on
     top of it: a brighter piece of the same glass, with its own hairline. */
  floatLabelWrap:{marginTop:4,height:13,alignItems:'center',justifyContent:'center'},
  floatLabel:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10,letterSpacing:.2},
  floatLabelActive:{color:C.green},
  floatLabelOver:{position:'absolute',left:0,right:0,textAlign:'center'},
 safe:{flex:1,backgroundColor:C.bg,overflow:'hidden',paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0},page:{flex:1,backgroundColor:C.bg},pageWide:{width:'100%',maxWidth:1180,alignSelf:'center'},scroll:{width:'100%',maxWidth:980,alignSelf:'center',paddingHorizontal:20,paddingTop:20,paddingBottom:BOTTOM_RESERVE},row:{flexDirection:'row',alignItems:'center'},press:{opacity:.72,transform:[{scale:.98}]},loading:{padding:44,alignItems:'center',gap:12},loadingText:{color:C.muted,fontSize:12},error:{backgroundColor:C.card,padding:24,borderRadius:24,alignItems:'center',marginVertical:12},errorIcon:{width:48,height:48,borderRadius:16,backgroundColor:C.yellow,alignItems:'center',justifyContent:'center'},errorTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_600SemiBold',marginTop:12},errorText:{color:C.muted,textAlign:'center',fontSize:12,lineHeight:18,marginTop:4},retry:{backgroundColor:C.ink,paddingHorizontal:16,paddingVertical:8,borderRadius:12,marginTop:12},retryText:{color:C.onAccent,fontSize:11,fontFamily:'DMSans_600SemiBold'},
 topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 appHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 /* The next-prayer pill. It floats over the page, so it carries its own
   surface and a small lift rather than sitting on the content like a row
   would. C.card and C.ink keep it inside whichever palette is wearing. */
nextPillWrap:{position:'absolute',top:6,left:0,right:0,alignItems:'center',zIndex:30},
nextPill:{alignItems:'center',justifyContent:'center',minWidth:176,backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:22,paddingHorizontal:19,paddingTop:9,paddingBottom:8,elevation:4,shadowColor:'#000',shadowOpacity:.18,shadowRadius:10,shadowOffset:{width:0,height:3}},nextPillRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9},nextPillTrack:{width:'100%',height:3,borderRadius:2,backgroundColor:C.line,marginTop:7,overflow:'hidden'},nextPillFill:{height:3,borderRadius:2,backgroundColor:C.gold},
nextPillName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
nextPillDot:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:13},
/* successInk, not gold: gold measures 2.7:1 against the card in the light
   Islamic palette, and the countdown is the part of the pill you actually
   read. This is the palette's own gold-family token for text on a light
   ground, and it clears 4.5:1 in all four. */
nextPillTime:{color:C.successInk,fontFamily:'DMSans_700Bold',fontSize:14,fontVariant:['tabular-nums']},
appHeaderBrand:{flexDirection:'row',alignItems:'center',gap:10,flexShrink:1},
 appLogo:{width:36,height:36},
 appName:{color:C.ink,fontSize:20,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,flexShrink:1},
 appHeaderActions:{flexDirection:'row',alignItems:'center',gap:6},
 headerBtn:{width:40,height:40,borderRadius:14},overline:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginBottom:4},h1:{color:C.ink,fontSize:32,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.8},iconBtn:{width:44,height:44,borderRadius:16,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},iconBtnDark:{backgroundColor:C.card,borderColor:C.line},section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:28,marginBottom:16},h2:{color:C.ink,fontSize:22,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.35},sectionAction:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
 graphicFrame:{alignItems:'center',justifyContent:'center',overflow:'hidden'},motionGlyph:{width:49,height:49,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},motionGlyphInverse:{backgroundColor:'rgba(255,255,255,.14)',borderColor:'rgba(255,255,255,.22)'},glyphDot:{position:'absolute',right:6,top:6,width:5,height:5,borderRadius:4,backgroundColor:C.gold},greeting:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16},salam:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:4},greetingTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},prayerHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:6,marginBottom:16},prayerOverline:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:5},prayerTitle:{color:C.ink,fontSize:27,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},
 aura:{position:'absolute',top:'-30%',left:'-20%',right:'-20%',height:'160%'},auraAlt:{position:'absolute',top:'-20%',left:'10%',right:'-25%',height:'140%',opacity:.8},heroSheen:{position:'absolute',top:'-20%',bottom:'-20%',width:'38%',left:'31%',opacity:.5},hero:{height:285,borderRadius:28,overflow:'hidden',padding:20,...shadow},/* Poster artwork: the <Image> is always nested inside a StyleSheet.absoluteFill
   wrapper (see the home hero, continue-reading card, prayer next-card and Quran
   hero). Two reasons, one per platform: on native, percentage width/height on an
   absolutely positioned image that is a direct child of a plain card resolves
   against the image's own intrinsic 1200px instead of the card, so overflow:
   'hidden' clipped it to a corner; on web an <img> is a replaced element, so
   insets alone do not stretch it and it falls back to intrinsic size. The
   wrapper stretches by its edges everywhere, and the image then fills it by
   percentage. Do not drop either half. */
   heroBg:{position:'absolute',left:0,right:0,top:0,bottom:0,width:'100%',height:'100%'},locationPill:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',maxWidth:'72%',backgroundColor:'rgba(17,16,27,.62)',paddingHorizontal:12,paddingVertical:8,borderRadius:16},locationText:{color:C.onAccent,fontFamily:'DMSans_600SemiBold',fontSize:11,flexShrink:1},hijri:{color:C.onAccent,fontSize:11,marginTop:12},nextLabel:{color:C.onHero,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginTop:36},heroTime:{color:C.onAccent,fontSize:42,fontFamily:'DMSans_700Bold',letterSpacing:-1.2,marginTop:2},heroFooter:{position:'absolute',left:20,right:20,bottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},countPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'rgba(255,255,255,.16)',paddingHorizontal:12,paddingVertical:8,borderRadius:16,borderWidth:1,borderColor:'rgba(255,255,255,.18)'},countText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_600SemiBold'},heroCta:{flexDirection:'row',alignItems:'center',gap:8},heroCtaText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold'},
 prayerRail:{marginHorizontal:8,marginTop:-1,backgroundColor:C.white,borderBottomLeftRadius:24,borderBottomRightRadius:24,flexDirection:'row',paddingHorizontal:8,paddingVertical:12,borderWidth:1,borderTopWidth:0,borderColor:C.line,...soft},railItem:{flex:1,alignItems:'center',paddingVertical:4,borderRadius:16},railItemActive:{backgroundColor:C.card},railIcon:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,.94)',borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginBottom:8},railIconDone:{backgroundColor:C.yellow,borderColor:C.green},
adhkarDuaCard:{marginHorizontal:8},
adhkarCount:{minWidth:38,paddingVertical:4,paddingHorizontal:9,borderRadius:11,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
adhkarCountText:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11},
adhkarDots:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:6,marginTop:12,marginBottom:2},
adhkarMore:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4,alignSelf:'center',marginTop:10,paddingVertical:5,paddingHorizontal:12,borderRadius:13,backgroundColor:C.mint,borderWidth:1,borderColor:C.line},
adhkarMoreText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
adhkarDot:{width:6,height:6,borderRadius:3,backgroundColor:C.line},
adhkarDotOn:{width:18,backgroundColor:C.green},
adhkarDuaPad:{padding:16},
adhkarDuaHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:14},
adhkarTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:19,marginTop:10},
adhkarRef:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9.5,letterSpacing:.6,marginTop:10,textTransform:'uppercase'},
adhkarFoot:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10.5,marginTop:14},
adhkarKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9,textTransform:'uppercase',letterSpacing:.6,marginTop:10},
adhkarTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:14,marginTop:4},

roundRow:{flexDirection:'row',marginHorizontal:8,backgroundColor:C.card,borderRadius:24,paddingVertical:16,borderWidth:1,borderColor:C.line,borderTopColor:depth.edge,...depth.ambient},
roundItem:{flex:1,alignItems:'center',paddingHorizontal:4},
roundIcon:{width:58,height:58,borderRadius:29,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
roundLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:11,lineHeight:14,marginTop:8,textAlign:'center'},
depthGradient:{position:'absolute',top:0,left:0,right:0,bottom:0},
  depthCard:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderTopColor:depth.edge,...depth.ambient},
depthBody:{overflow:'hidden'},
depthVeil:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:depth.veil},railCheck:{position:'absolute',top:-2,right:-2,width:16,height:16,borderRadius:8,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.white},railName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},railTime:{color:C.ink,textAlign:'center',fontFamily:'DMSans_600SemiBold',fontSize:10,lineHeight:11,marginTop:2},essentialSlide:{height:174,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},essentialTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},essentialArrow:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},essentialTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,marginTop:4},essentialBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},tool:{width:'33.33%',paddingVertical:12},
 homeProgress:{marginHorizontal:8,backgroundColor:C.card,borderBottomLeftRadius:20,borderBottomRightRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderTopWidth:0,borderColor:C.line},homeProgressRing:{width:43,height:43,borderRadius:24,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:C.line},dailyKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:4},dailyArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,lineHeight:36,textAlign:'right',marginTop:8,writingDirection:'rtl'},weekWrap:{marginTop:12},
weekSurface:{backgroundColor:'transparent',borderColor:'transparent',borderTopColor:'rgba(255,255,255,.16)'},
weekBody:{padding:16,gap:14},weekSummaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:19},weekSummaryBody:{color:C.onAccent,fontSize:10,marginTop:4},
weekTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:10},
homeWeekRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:6},
homeWeekCol:{flex:1,alignItems:'center',gap:6},
homeWeekTrack:{width:'100%',height:38,justifyContent:'flex-end',alignItems:'center'},
homeWeekBar:{width:'100%',maxWidth:18,borderRadius:4,backgroundColor:C.gold},
homeWeekDay:{color:mix(BRAND.lavender,BRAND.pearl,.42),fontSize:9.5,fontFamily:'DMSans_600SemiBold'},
homeWeekDayOn:{color:C.onAccentInk},weekStatValue:{color:C.green,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:8},weekBar:{flex:1,height:8,borderRadius:4,backgroundColor:C.mint,overflow:'hidden',marginHorizontal:8},weekBarFill:{height:'100%',borderRadius:4,backgroundColor:C.green},weekScoreBody:{color:C.onAccent,fontSize:10,marginTop:4},readWrap:{height:205},
readSurface:{borderColor:'transparent'},
readPad:{padding:20,overflow:'hidden',borderRadius:28},readKicker:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5},readArabic:{color:C.onAccent,fontSize:29,marginTop:8},readTitle:{color:C.onAccent,fontSize:20,fontFamily:'DMSans_700Bold'},readMeta:{color:C.onAccent,fontSize:10,marginTop:4},whiteButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,alignSelf:'flex-start',backgroundColor:C.white,paddingHorizontal:12,paddingVertical:8,borderRadius:16,marginTop:12},whiteButtonText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},twoCol:{flexDirection:'row',gap:12,marginTop:12},liveBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',backgroundColor:'rgba(75,56,145,.90)',paddingHorizontal:8,paddingVertical:4,borderRadius:8} as any,liveDot:{width:5,height:5,borderRadius:4,backgroundColor:C.gold},liveText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:.5},hadithSurface:{padding:16},quote:{position:'absolute',right:18,top:2,color:C.onAccent,fontSize:72,fontFamily:'DMSans_700Bold'},hadithText:{color:C.ink,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:16},hadithFoot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:16,paddingTop:12,borderTopWidth:1,borderColor:C.line},hadithActions:{flexDirection:'row',alignItems:'center',gap:14},metaRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:2},meta:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16},
 dayStripScroll:{paddingHorizontal:20,marginHorizontal:-20},dayStrip:{flexDirection:'row',gap:4,backgroundColor:C.card,padding:8,borderRadius:24,borderWidth:1,borderColor:C.line,...soft},dayChosen:{color:C.muted,fontSize:11,fontFamily:'DMSans_600SemiBold',textAlign:'center',marginTop:10},dayDot:{width:4,height:4,borderRadius:2,backgroundColor:C.line,marginTop:3},day:{width:47,alignItems:'center',paddingVertical:8,borderRadius:16},dayActive:{backgroundColor:C.accent},dayName:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},dayNum:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dayText:{color:C.onAccentInk},nextCard:{height:190,borderRadius:28,padding:20,marginTop:16,overflow:'hidden',...shadow},nextCardBody:{flex:1},nextCardLabel:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5,marginTop:20},nextCardName:{color:C.onAccent,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:4},nextCardTime:{color:C.onAccent,fontSize:17,fontFamily:'DMSans_600SemiBold',marginBottom:12},moonOrb:{position:'absolute',right:24,top:43,width:96,height:96,borderRadius:48,backgroundColor:'rgba(255,255,255,.13)',alignItems:'center',justifyContent:'center'},prayerList:{backgroundColor:C.card,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...surface},prayerRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,minHeight:68,borderBottomWidth:1,borderColor:C.line},prayerRowLive:{backgroundColor:C.card},prayerSymbol:{width:41,height:41,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},prayerName:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},prayerValue:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold',marginRight:8},prayerProgress:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line,...surface},progressTrack:{width:86,height:7,borderRadius:4,backgroundColor:C.mint,overflow:'hidden'},progressFill:{height:'100%',borderRadius:4,backgroundColor:C.green},progressCount:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},prayerSymbolDone:{backgroundColor:C.accent,borderColor:C.green},sourceCard:{flexDirection:'row',gap:12,alignItems:'center',backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:16},sourceTitle:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},sourceBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},
 search:{height:48,flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,borderWidth:1,borderColor:C.line,marginBottom:12,...soft},searchInput:{flex:1,color:C.ink,fontSize:12,outlineStyle:'none'} as any,quranHero:{height:225,borderRadius:28,overflow:'hidden',padding:20,...shadow},quranArabic:{color:C.onAccent,fontSize:28,marginTop:16},quranHeroTitle:{color:C.onAccent,fontSize:21,fontFamily:'DMSans_700Bold'},quranHeroMeta:{color:C.onAccent,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:4},continueBar:{backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},quranActionGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},quranPrimaryWrap:{flexGrow:1,flexBasis:'40%',minWidth:280},quranPrimaryAction:{height:142,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',overflow:'hidden',...soft},quranPrimaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:24,marginTop:8},quranPrimaryBody:{color:C.onAccent,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:4},quranNavWrap:{flexGrow:1,flexBasis:'14%',minWidth:98},quranNavCard:{height:142,backgroundColor:C.card,borderRadius:20,padding:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...surface},quranNavTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:4},quranNavCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:14,marginTop:2,textAlign:'center'},quranStudyCard:{height:190,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},quranStudyTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},studyNumber:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},quranStudyTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:20,marginTop:8},quranStudyCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16,marginTop:4},quranPreferenceRow:{flexDirection:'row',flexWrap:'wrap',gap:12},qTileGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},qTile:{alignItems:'center',justifyContent:'center',backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingVertical:12,paddingHorizontal:4,...soft},qTileLabel:{marginTop:6,fontSize:11,fontFamily:'DMSans_600SemiBold',color:C.ink,textAlign:'center',lineHeight:14},
  /* The tile centres its children, but MotionPress's inner view does not: it
     is a plain column, so it grows to the width of its widest child and lets
     the icon sit at its left edge. A long title such as "Transliteration"
     therefore pushed its own tile wider than the others and left the icon
     hard against one side. Stretching that inner view to the tile and
     centring inside it keeps every tile the same width, the icon in the
     middle of it, and gives the label a width to wrap within. */
  qTileInner:{alignSelf:'stretch',alignItems:'center'},qStatRow:{flexDirection:'row',gap:8},qStat:{flex:1,alignItems:'center',backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingVertical:12,paddingHorizontal:4,...soft},qStatIcon:{width:32,height:32,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginBottom:7,alignSelf:'center'},qStatValue:{fontSize:16,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:1,textAlign:'center'},qStatLabel:{marginTop:2,fontSize:10,color:C.muted,fontFamily:'DMSans_600SemiBold',textAlign:'center',alignSelf:'stretch'},quranPreferenceCard:{flex:1,minWidth:260,minHeight:76,backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line,...surface},quranPersonalGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},quranPersonalWrap:{flexGrow:1,flexBasis:'18%',minWidth:130},quranPersonalCard:{minHeight:132,backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...surface},quranPersonalHead:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},quranPersonalValue:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:22},quranPersonalTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:8},quranPersonalCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,marginTop:4},recentChip:{minWidth:128,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line},surahList:{gap:CARD_GAP},surahMore:{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:16,borderRadius:RADIUS.lg,borderWidth:1,borderColor:C.line,borderStyle:'dashed'},surahMoreText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:13},surahChips:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:7},
surahChip:{paddingVertical:3,paddingHorizontal:8,borderRadius:9,backgroundColor:C.mint,borderWidth:1,borderColor:C.line},
surahChipText:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},
surahChipMakki:{backgroundColor:C.mint,borderColor:C.line},
surahChipMadani:{backgroundColor:mix(BRAND.pearl,BRAND.radiantGold,.14),borderColor:mix(BRAND.radiantGold,BRAND.pearl,.5)},
surahChipTextMakki:{color:C.green},
surahChipTextMadani:{color:BRAND.bronze},
surahArWrap:{alignItems:'flex-end',justifyContent:'center',paddingStart:4},surahRight:{alignItems:'flex-end',justifyContent:'center',gap:5},surahRing:{width:17,height:17,borderRadius:9,backgroundColor:C.gold,alignItems:'center',justifyContent:'center',marginBottom:3},surahRingHalf:{backgroundColor:'transparent',borderWidth:1.6,borderColor:C.gold},surahRingDot:{width:6,height:6,borderRadius:3,backgroundColor:C.gold},
surahCard:{width:'100%',minHeight:64,backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingHorizontal:13,paddingVertical:9,...surface},surahRowInner:{flex:1,flexDirection:'row',alignItems:'center',gap:11},surahPlace:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,textTransform:'uppercase',marginTop:SPACE.xs},surahNum:{width:36,height:36,borderRadius:12,backgroundColor:C.mint,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},
  /* The surah number as a small filled medallion. The fill and the number are
     a matched pair - on a gold ground the numeral has to be dark, because
     white on gold is 2.4:1 and the number is small text. The Khatam screen
     reuses surahNum for its cycle count, which is not a surah, so this is a
     separate token rather than a change to that one. */
  surahMedal:{width:36,height:36,borderRadius:12,backgroundColor:C.surahBadge,borderWidth:1,borderColor:C.surahBadge,alignItems:'center',justifyContent:'center'},
  surahMedalText:{color:C.surahBadgeInk,fontSize:13,fontFamily:'Newsreader_700Bold'},surahNumText:{color:C.green,fontSize:13,fontFamily:'Newsreader_700Bold'},surahName:{color:C.ink,fontSize:14.5,fontFamily:'DMSans_700Bold',flexShrink:1},surahNameRow:{flexDirection:'row',alignItems:'center',gap:9},surahArInline:{color:C.green,fontSize:16.5,fontFamily:'KFGQPCUthmanicHafs',writingDirection:'rtl'},surahAr:{color:C.green,fontSize:20,fontFamily:'KFGQPCUthmanicHafs',writingDirection:'rtl'},
 readerModes:{flexDirection:'row',gap:12,marginTop:12},readerMode:{flex:1,minHeight:56,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:C.white,borderRadius:20,borderWidth:1,borderColor:C.line},readerModeActive:{backgroundColor:C.mint,borderColor:C.line},readerModeText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},readerBar:{height:56,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:8,borderBottomWidth:1,borderColor:C.line},surahStep:{width:32,height:32,alignItems:'center',justifyContent:'center',marginHorizontal:2},/* Hidden off the top of the screen, but not transparent.

     The capture reads the view back off the GPU, and a view at opacity 0 is
     read back as nothing at all - the picture comes out empty. Being off the
     top of the screen is what hides it, so the opacity has to stay at 1 and
     the position is what keeps it unseen. */
  offscreenCard:{position:'absolute',top:-100000,left:0,opacity:1},readerName:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold'},readerProgress:{height:4,backgroundColor:C.mint,overflow:'hidden'},readerScroll:{width:'100%',maxWidth:860,alignSelf:'center',padding:16,paddingBottom:BOTTOM_RESERVE},surahHead:{borderRadius:28,padding:24,alignItems:'center',...shadow},surahHeadAr:{color:C.onAccent,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:38,marginTop:16,writingDirection:'rtl'},surahHeadEn:{color:C.onAccent,fontSize:10,marginTop:4},bismillah:{color:C.onAccent,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,marginTop:24,writingDirection:'rtl'},ayahContinuous:{marginTop:4,borderRadius:4,borderBottomWidth:1,shadowOpacity:0,elevation:0},ayahSelected:{borderColor:C.gold,borderWidth:2,backgroundColor:C.card},ayahActions:{flexDirection:'row',alignItems:'center',gap:6,marginLeft:-4},ayahFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12},ayah:{backgroundColor:C.white,borderRadius:24,padding:20,marginTop:12,borderWidth:1,borderColor:C.line,...soft},ayahTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},ayahNo:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',backgroundColor:C.mint,paddingHorizontal:8,paddingVertical:8,borderRadius:12},ayahAr:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:30,lineHeight:58,marginTop:16,writingDirection:'rtl'},ayahTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:20,marginTop:16,paddingTop:16,borderTopWidth:1,borderColor:C.line},ayahMeta:{color:C.muted,fontSize:10,marginTop:12},
 translationRow:{minHeight:67,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},languageBadge:{width:52,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:4},languageFlag:{fontSize:12},languageBadgeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},historyHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},historyWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:12},historyChip:{backgroundColor:C.mint,borderRadius:16,paddingHorizontal:12,paddingVertical:8},searchResult:{backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:8,borderWidth:1,borderColor:C.line},noteText:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:17,lineHeight:24,marginVertical:8},noteInput:{minHeight:180,backgroundColor:C.white,borderRadius:20,padding:16,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,stepper:{backgroundColor:C.white,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},stepButton:{width:44,height:44,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},fontPreview:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line},fontPreviewText:{color:C.ink,textAlign:'right',lineHeight:52,includeFontPadding:false},previewArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',writingDirection:'rtl'},referenceNavigator:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginBottom:12},referenceInput:{width:100,textAlign:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,color:C.ink,fontFamily:'DMSans_700Bold',outlineStyle:'none'} as any,comparisonHelp:{color:C.muted,fontSize:10,lineHeight:15,marginTop:8},editionPicker:{gap:8,marginTop:12},editionChip:{minHeight:58,backgroundColor:C.white,borderRadius:16,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line},editionChipActive:{borderColor:C.green,backgroundColor:C.mint},editionFlag:{fontSize:20},arabicReference:{backgroundColor:C.yellow,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:C.gold},comparisonColumns:{gap:12,paddingVertical:12,paddingRight:20},comparisonText:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,marginTop:12},mushafPage:{width:'100%',maxWidth:900,alignSelf:'center',paddingHorizontal:18,paddingTop:22,paddingBottom:BOTTOM_RESERVE},mushafNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},mushafNavFoot:{marginTop:18},pageJump:{flex:1,minWidth:0,alignItems:'center'},pageInput:{minWidth:74,textAlign:'center',color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:28,borderBottomWidth:1,borderColor:C.line,paddingVertical:4,outlineStyle:'none'} as any,pageProgress:{height:5,borderRadius:4,backgroundColor:C.mint,overflow:'hidden',marginVertical:16},mushafSheet:{backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.gold,...soft},
  /* long-press verse menu: sits entirely above the verse it belongs to, so it
     never covers the line you are reading */
  mushafMenu:{position:'absolute',left:0,right:0,bottom:'100%',zIndex:20,alignItems:'center',paddingBottom:6},
  mushafMenuBar:{backgroundColor:C.card,borderRadius:18,paddingHorizontal:5,paddingVertical:4,borderWidth:1,borderColor:C.gold,...shadow},
  mushafMenuItem:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10,paddingVertical:7,borderRadius:14},
  mushafMenuItemOn:{backgroundColor:mix(BRAND.pearl,BRAND.radiantGold,.14)},
  mushafMenuLabel:{color:C.ink,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  mushafVerseMenuOverlay:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:6},
  mushafVerseOpen:{backgroundColor:mix(BRAND.pearl,BRAND.radiantGold,.14),borderRadius:10},
  /* the share sheet: a scrim that dismisses, and a card that rises */
  /* The overlay is the last child of the navigation container, so it is above
     the floating tab bar and the mini player by order of drawing alone. The
     zIndex is belt and braces for the platforms that reorder on elevation. */
  overlayLayer:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:9000,elevation:9000},
  sheetScrim:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(20,18,32,.42)'},
  exitPrompt:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:120,zIndex:9500,elevation:9500},
  exitPill:{backgroundColor:'rgba(28,25,20,0.92)',paddingHorizontal:18,paddingVertical:11,borderRadius:999,maxWidth:'86%'},
  exitText:{color:C.onAccent,fontSize:13.5,fontWeight:'600',textAlign:'center'},
  /* Sheets are drawn by the overlay host, which sits outside every SafeAreaView
     in the app, so the sheet has to clear the home indicator itself. */
  verseSheet:{position:'absolute',left:12,right:12,bottom:0,backgroundColor:C.card,borderTopLeftRadius:26,borderTopRightRadius:26,padding:18,paddingBottom:Platform.OS==='ios'?36:24,borderWidth:1,borderColor:C.line,...shadow},
  sheetGrip:{width:44,height:4,borderRadius:2,backgroundColor:C.line,alignSelf:'center',marginBottom:14},
  sheetTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:19,textAlign:'center'},
  sheetSub:{color:C.muted,fontSize:11,textAlign:'center',marginTop:3,marginBottom:16},
  sheetOption:{flexDirection:'row',alignItems:'center',gap:13,backgroundColor:C.bg,borderRadius:18,paddingHorizontal:14,paddingVertical:13,marginBottom:9,borderWidth:1,borderColor:C.line},
  sheetOptionIcon:{width:38,height:38,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  sheetOptionLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:14},
  sheetOptionDetail:{color:C.muted,fontSize:11,marginTop:2},
  langSheet:{maxHeight:'78%'},
  langRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,paddingVertical:11,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.bg,marginBottom:7},
  langRowOn:{backgroundColor:C.mint,borderColor:C.green},
  langFlag:{fontSize:19,width:26,textAlign:'center'},
  /* The two-line block beside the flag: the language's own name on top,
     the English underneath. flex:1 was on the name before; it moves to
     the wrapper so the count and the tick stay pushed to the end. */
  langText:{flex:1,minWidth:0},
  langSub:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular',marginTop:1},
  langName:{color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold'},
  langNameOn:{color:C.green,fontFamily:'DMSans_700Bold'},
  langCount:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular'},
  surahPickNum:{color:C.muted,fontSize:12,fontFamily:'DMSans_700Bold',width:26,textAlign:'center'},
  surahPickAr:{color:C.green,fontSize:14,fontFamily:'KFGQPCUthmanicHafs',marginTop:1,writingDirection:'rtl',textAlign:'right'},
  surahPickHint:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold',marginTop:2},
  trSurahBar:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:4},
  trSurahSearch:{width:44,height:44,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,flexShrink:0},
  trStrip:{gap:8,paddingRight:16,alignItems:'center'},
  trChip:{flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:13,paddingVertical:10,borderRadius:14,backgroundColor:C.card,borderWidth:1,borderColor:C.line},
  trChipOn:{backgroundColor:C.green,borderColor:C.green},
  trChipNum:{color:C.muted,fontSize:11,fontFamily:'DMSans_700Bold'},
  trChipNumOn:{color:C.onAccent},
  trChipName:{color:C.ink,fontSize:13,fontFamily:'DMSans_600SemiBold',maxWidth:120},
  trChipNameOn:{color:C.onAccent},
  ramGuideGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},
  ramGuideCard:{flexGrow:1,flexBasis:'44%',minWidth:140,backgroundColor:C.card,borderRadius:20,padding:14,borderWidth:1,borderColor:C.line,...surface},
  ramGuideIcon:{width:56,height:56,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',marginBottom:10},
  ramGuideTitle:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',lineHeight:18},
  ramGuideBody:{color:C.muted,fontSize:11,lineHeight:15,marginTop:5,fontFamily:'DMSans_400Regular'},
  langIndex:{color:C.muted,fontSize:10,fontFamily:'DMSans_400Regular',width:16,textAlign:'center'},
  tsLangButton:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.mint,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line,marginBottom:14},
  sheetCancel:{alignItems:'center',paddingVertical:12,marginTop:4},
  sheetBtnBusy:{opacity:.55},
  sheetCancelText:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:13},
  sheetKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.4,textAlign:'center',marginBottom:14},
  reflectArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:25,lineHeight:44,textAlign:'right',direction:'rtl',writingDirection:'rtl'} as any,
  reflectProse:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:14},
  reflectSource:{backgroundColor:C.bg,borderRadius:18,padding:14,marginTop:18,borderWidth:1,borderColor:C.line},
  reflectSourceHead:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2,marginBottom:10},
  reflectScroll:{maxHeight:260},
  reportQuote:{backgroundColor:C.bg,borderRadius:14,padding:12,marginTop:12,borderWidth:1,borderColor:C.line},
  reportQuoteAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_400Regular',fontSize:16,lineHeight:28,textAlign:'right',direction:'rtl',writingDirection:'rtl'} as any,
  reportQuoteEn:{color:C.muted,fontSize:12,lineHeight:18,marginTop:6},
  reportOptions:{gap:8,marginBottom:4},
  reportOption:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:10,paddingHorizontal:12,borderRadius:12,borderWidth:1,borderColor:C.line,backgroundColor:C.card},
  reportOptionOn:{borderColor:C.green,backgroundColor:C.mint},
  reportDot:{width:16,height:16,borderRadius:8,borderWidth:1.6,borderColor:C.line,alignItems:'center',justifyContent:'center'},
  reportDotOn:{borderColor:C.green},
  reportOptionText:{color:C.ink,fontSize:13,flex:1},
  reportInput:{backgroundColor:C.bg,borderRadius:14,borderWidth:1,borderColor:C.line,padding:12,minHeight:76,color:C.ink,fontSize:13,textAlignVertical:'top',marginVertical:12},
  reportNote:{color:C.muted,fontSize:11,lineHeight:16,marginBottom:10},reflectRow:{flexDirection:'row',gap:10,marginBottom:8,alignItems:'flex-start'},
  reflectLabel:{color:C.muted,fontSize:11,fontFamily:'DMSans_600SemiBold',width:104,flexShrink:0},
  reflectValue:{color:C.ink,fontSize:12,lineHeight:18,flex:1},
  noteSheetHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:14},
  noteSheetArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17,lineHeight:30,textAlign:'right',marginBottom:12,direction:'rtl',writingDirection:'rtl'} as any,
  noteSheetInput:{minHeight:104,maxHeight:200,backgroundColor:C.bg,borderRadius:18,padding:14,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,
  noteSheetActions:{flexDirection:'row',alignItems:'center',gap:9,marginTop:14},
mushafFrame:{backgroundColor:themeDark?mix(BRAND.midnightInk,BRAND.lavender,.12):brandHex('#FCFAF6'),borderRadius:8,borderWidth:MUSHAF_FRAME_BORDER,borderColor:C.gold,padding:MUSHAF_FRAME_PAD,marginTop:4,...soft,overflow:'hidden'},
mushafFrameInner:{borderRadius:4,borderWidth:MUSHAF_INNER_BORDER,borderColor:C.gold,borderStyle:'solid',opacity:.999,paddingHorizontal:MUSHAF_INNER_PAD_H,paddingVertical:MUSHAF_INNER_PAD_V},
mushafCorner:{position:'absolute',width:16,height:16,alignItems:'center',justifyContent:'center'},
mushafCornerTL:{top:-9,left:-9},mushafCornerTR:{top:-9,right:-9},mushafCornerBL:{bottom:-9,left:-9},mushafCornerBR:{bottom:-9,right:-9},
mushafCornerDiamond:{width:11,height:11,borderWidth:1.2,borderColor:C.gold,transform:[{rotate:'45deg'}]},
mushafCornerDot:{position:'absolute',width:3.5,height:3.5,borderRadius:2,backgroundColor:C.gold},
mushafSurahBand:{alignItems:'center',marginBottom:7,marginTop:2},
mushafBandRule:{height:1,width:'62%',backgroundColor:C.gold,opacity:.5},
mushafSurahName:{color:C.green,fontFamily:'Newsreader_700Bold',fontSize:16,textAlign:'center',paddingVertical:5,paddingHorizontal:14,letterSpacing:.3},
mushafOrnamentRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginVertical:16},
mushafOrnamentRule:{height:1,flex:1,maxWidth:96},
mushafPageNoRow:{alignItems:'center',marginTop:6},
mushafPageNo:{width:30,height:30,borderRadius:15,borderWidth:1.2,borderColor:C.gold,alignItems:'center',justifyContent:'center',backgroundColor:C.mint},
mushafPageNoText:{color:C.green,fontFamily:'Newsreader_700Bold',fontSize:16},mushafAyah:{paddingVertical:12,borderBottomWidth:1,borderColor:C.line},mushafSurah:{textAlign:'center',color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:20,backgroundColor:C.mint,borderRadius:16,paddingVertical:8,marginBottom:12},verseMarker:{color:C.gold,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17,writingDirection:'rtl'},mushafTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:8},sectionMarker:{flexDirection:'row',alignItems:'center',gap:10,marginTop:18,marginBottom:6},sectionRule:{flex:1,height:1,backgroundColor:C.line},sectionMarkerText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,textTransform:'uppercase',letterSpacing:1},mushafPageLine:{color:C.ink,textAlign:'center',writingDirection:'rtl'},topicGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},topicWrap:{width:'48%'},topicCard:{minHeight:190,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},vocabStats:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},flashcard:{minHeight:330,backgroundColor:C.white,borderRadius:28,padding:24,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...shadow},flashIndex:{position:'absolute',top:18,right:18,color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},flashArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:58,lineHeight:86,textAlign:'center',writingDirection:'rtl'},flashTransliteration:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:28,marginTop:12},flashMeaning:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:18,marginVertical:8,textAlign:'center'},flashHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:16},tajweedPractice:{backgroundColor:C.card,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:C.line,...surface},tajweedRule:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,padding:12,borderBottomWidth:1,borderColor:C.line},tajweedSwatch:{width:18,height:44,borderRadius:9},compareCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},
  tcRefBar:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14},
  tcVerse:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:14,borderWidth:1,borderColor:C.line},
  tcSectionLabel:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:20,marginBottom:8},
  tcChosen:{flexDirection:'row',flexWrap:'wrap',gap:8},
  tcChip:{flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:12,paddingVertical:8,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:C.line},
  tcChipText:{color:C.green,fontSize:12,fontFamily:'DMSans_600SemiBold',maxWidth:150},
  tcColumns:{gap:12,marginTop:16},
  tcCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},
  tcCardHead:{flexDirection:'row',alignItems:'center',gap:8,paddingBottom:10,marginBottom:10,borderBottomWidth:1,borderColor:C.line},
  tcCardName:{flex:1,color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},
  tcCardLang:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold'},juzGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},juzCard:{width:'22.8%',aspectRatio:1,backgroundColor:C.card,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...surface},juzNo:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:23},preloadScore:{backgroundColor:C.white,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line},cacheUsage:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:8},preloadTrack:{height:9,borderRadius:4,backgroundColor:C.mint,overflow:'hidden',marginVertical:12},preloadFill:{height:'100%',backgroundColor:C.green,borderRadius:4},planGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},planCard:{width:'48%',minHeight:130,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},planDays:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:36},planToday:{backgroundColor:C.white,borderRadius:20,padding:16,marginTop:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},practiceLaunch:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},recallCard:{minHeight:340,backgroundColor:C.white,borderRadius:28,padding:20,borderWidth:1,borderColor:C.line,...shadow},recallPrompt:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,lineHeight:29,marginTop:28,textAlign:'center'},recallArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:32,lineHeight:58,textAlign:'right',marginTop:24,paddingTop:20,borderTopWidth:1,borderColor:C.line,writingDirection:'rtl'},revealArea:{flex:1,minHeight:110,alignItems:'center',justifyContent:'center',gap:8,marginTop:20,borderTopWidth:1,borderColor:C.line},hifzStatus:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,textTransform:'uppercase'},intro:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:19,marginTop:0,marginBottom:20},exploreGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},exploreCard:{flexGrow:1,flexBasis:'31%',minWidth:150},exploreCardInner:{minHeight:164,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},exploreTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold',marginTop:12},exploreBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:15,marginTop:4,flex:1},exploreArrow:{width:29,height:29,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'},apiPanel:{backgroundColor:C.deep,borderRadius:24,padding:20,marginTop:12},apiTitle:{color:C.onAccent,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:16},apiText:{color:C.onAccent,fontSize:10,marginTop:4},dataProvider:{color:C.onAccent,fontSize:10.5,fontFamily:'DMSans_600SemiBold',marginTop:3,opacity:.72,letterSpacing:.2},
 toolPage:{width:'100%',maxWidth:780,alignSelf:'center',alignItems:'center',padding:24,paddingTop:24,paddingBottom:BOTTOM_RESERVE},toolPageScroll:{flexGrow:1},toolEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:20},compass:{width:260,height:260,borderRadius:130,backgroundColor:C.white,borderWidth:12,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:32,...shadow},compassRose:{position:'absolute',width:'100%',height:'100%',alignItems:'center',justifyContent:'center'},compassLive:{fontFamily:'DMSans_600SemiBold',fontSize:11,color:C.green,marginTop:8},compassHint:{color:C.muted,fontSize:11,marginTop:4,textAlign:'center'},north:{position:'absolute',top:12,color:C.coral,fontSize:10,fontFamily:'DMSans_700Bold'},compassArrow:{alignItems:'center',justifyContent:'center'},kaaba:{position:'absolute',right:43,bottom:47,width:31,height:31,backgroundColor:C.deep,borderRadius:4},kaabaGold:{height:5,backgroundColor:C.gold,marginTop:8},direction:{color:C.ink,fontSize:31,fontFamily:'DMSans_700Bold',marginTop:24},directionText:{color:C.muted,fontSize:11,marginTop:4},primary:{backgroundColor:C.accent,paddingHorizontal:20,paddingVertical:12,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:16,marginTop:20},primaryText:{color:C.onAccentInk,fontSize:11,fontFamily:'DMSans_700Bold'},tasbihAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:32,marginTop:16,writingDirection:'rtl'},counter:{width:205,height:205,borderRadius:103,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:12,borderColor:C.line,marginVertical:32,...shadow},counterNo:{color:C.onAccent,fontSize:58,fontFamily:'DMSans_700Bold'},counterGoal:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.3},secondary:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,backgroundColor:C.white,paddingHorizontal:16,paddingVertical:12,borderRadius:16,borderWidth:1,borderColor:C.line,marginHorizontal:4},secondaryText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
 summaryScore:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',justifyContent:'space-between',...shadow,borderTopColor:depth.edge},summaryDay:{minHeight:66,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line},summaryDots:{flexDirection:'row',gap:4},summaryDot:{width:8,height:8,borderRadius:4,backgroundColor:C.mint},summaryDotDone:{backgroundColor:C.green},cityGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},cityCard:{width:'48.5%',minHeight:76,backgroundColor:C.card,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...surface},cityCardActive:{backgroundColor:C.mint,borderColor:C.line},cityName:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},formCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},
  rsEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginBottom:10},
  rsPreview:{backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...surface},
  rsPreviewArabic:{color:C.ink,textAlign:'right',writingDirection:'rtl'} as any,
  rsPreviewTranslit:{color:C.muted,fontFamily:'DMSans_400Regular',fontStyle:'italic',marginTop:8,textAlign:'right'},
  rsPreviewMeaning:{color:C.muted,fontFamily:'DMSans_400Regular',lineHeight:22,marginTop:14},
  rsPreviewFoot:{flexDirection:'row',justifyContent:'space-between',marginTop:16,paddingTop:12,borderTopWidth:1,borderColor:C.line},
  rsPreviewMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
  rsGroup:{backgroundColor:C.card,borderRadius:24,padding:16,marginTop:16,borderWidth:1,borderColor:C.line,...surface},
  rsGroupTitle:{color:C.ink,fontSize:12,fontFamily:'DMSans_700Bold',letterSpacing:1.1,marginBottom:12},
  rsDivider:{height:1,backgroundColor:C.line,marginVertical:16},fieldRow:{flexDirection:'row',gap:12},textField:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,fontSize:13,color:C.ink,marginTop:8,outlineStyle:'none'} as any,dangerButton:{padding:16,alignItems:'center',marginTop:12},dangerText:{color:C.coral,fontFamily:'DMSans_700Bold',fontSize:11},healthCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,marginBottom:16,...surface},healthDot:{width:10,height:10,borderRadius:5},actionRow:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:8,marginTop:4},audioPreview:{backgroundColor:C.deep,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',gap:12},audioPlay:{width:48,height:48,borderRadius:24,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'},guideGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},guideCard:{flexGrow:1,flexBasis:'30%',minWidth:150},guideCardInner:{minHeight:180,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},guideHero:{borderRadius:24,padding:22,marginTop:16,alignItems:'center'},guideHeroKicker:{color:C.onHero,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.4,textTransform:'uppercase',marginBottom:14},guideHeroArabic:{color:C.onAccent,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:26,lineHeight:46,textAlign:'center',writingDirection:'rtl'},guideStep:{flexDirection:'row',gap:14,paddingVertical:16,paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line,alignItems:'flex-start'},guideStepLast:{borderBottomWidth:0},stepNo:{width:28,height:28,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},stepNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},guideStepText:{flex:1,color:C.ink,fontFamily:'DMSans_400Regular',fontSize:13.5,lineHeight:21},guideNote:{backgroundColor:C.yellow,borderRadius:20,padding:16,marginTop:20},referenceRow:{minHeight:54,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},evidenceCard:{backgroundColor:C.card,borderRadius:18,padding:15,marginBottom:11,borderWidth:1,borderColor:C.line},evidenceLabel:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold',letterSpacing:.4,marginBottom:9},evidenceArabic:{color:C.ink,fontSize:17,fontFamily:'NotoNaskhArabic_400Regular',lineHeight:31,marginBottom:8,writingDirection:'rtl',textAlign:'right'},evidenceBody:{color:C.body,fontSize:13,fontFamily:'DMSans_400Regular',lineHeight:20},evidenceVerse:{marginBottom:11},evidenceFoot:{flexDirection:'row',alignItems:'center',marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:C.line},evidenceLink:{flex:1,color:C.green,fontSize:12,fontFamily:'DMSans_600SemiBold'},emptyWrap:{alignItems:'center',justifyContent:'center',paddingVertical:60,gap:10,paddingHorizontal:24},emptyTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16,textAlign:'center'},emptyBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,textAlign:'center'},
  inboxEmpty:{alignItems:'center',paddingVertical:40,gap:8},inboxHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},
  inboxRow:{flexDirection:'row',gap:12,padding:14,borderBottomWidth:1,borderColor:C.line,alignItems:'flex-start'},inboxDot:{width:8,height:8,borderRadius:4,marginTop:6},
  inboxKind:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9,letterSpacing:.8},inboxTime:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},dataPage:{width:'100%',maxWidth:860,alignSelf:'center',padding:20,paddingBottom:BOTTOM_RESERVE},empty:{backgroundColor:C.white,borderRadius:24,padding:24,alignItems:'center',borderWidth:1,borderColor:C.line},dataTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,marginTop:16,marginBottom:8},dataCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},bookmarkMain:{flex:1},bookmarkRemove:{paddingStart:10,paddingVertical:4,justifyContent:'center'},dataArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:27,lineHeight:48,textAlign:'right',writingDirection:'rtl'},dataName:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dataBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:18,marginTop:4},dataMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',marginTop:12,textTransform:'uppercase'},inputLabel:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:12},moneyInput:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:20,padding:16,fontSize:24,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:8,outlineStyle:'none'} as any,zakatResult:{borderRadius:24,padding:20,marginTop:12},zakatNo:{color:C.onAccent,fontSize:34,fontFamily:'DMSans_700Bold',marginTop:8},
 profileName:{color:C.onAccent,fontSize:18,fontFamily:'DMSans_700Bold'},profileSub:{color:C.onHero,fontSize:10,marginTop:4},privacyHero:{borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',gap:12,...shadow},privacyPoints:{flexDirection:'row',gap:8,marginTop:12},privacyPoint:{flex:1,backgroundColor:C.card,borderRadius:16,paddingVertical:12,alignItems:'center',gap:4,borderWidth:1,borderColor:C.line},privacyPointText:{color:C.ink,fontSize:10,fontFamily:'DMSans_700Bold',textAlign:'center'},preferencePanel:{backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},preferenceHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16},prefIconTile:{width:54,height:54,borderRadius:18,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},choiceRow:{flexDirection:'row',gap:8},
  hadithPick:{marginTop:4,marginBottom:20},hadithSearch:{marginBottom:0},hadithResults:{marginBottom:10},
  nameShare:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,flexShrink:0},
  trackGrid:{flexDirection:'row',gap:3,alignItems:'flex-start'},trackWeek:{gap:3},trackCell:{width:13,height:13,borderRadius:3},trackCellOpen:{borderWidth:2,borderColor:C.ink},
  trackStats:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:18},trackStat:{flex:1,minWidth:88,backgroundColor:C.card,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line},
  trackStatValue:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:22},trackStatLabel:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},
  trackLegend:{flexDirection:'row',alignItems:'center',gap:6,marginTop:14},trackLegendText:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11},
  madeWith:{alignItems:'center',paddingTop:28,paddingBottom:8},madeWithText:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12},
  
  packingGroupHead:{flexDirection:'row',alignItems:'center',gap:8},packingGroupCount:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11},
  packingGroupCaution:{borderColor:C.gold,borderWidth:1},
  fastMonths:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:8,marginTop:4},
  fastMonth:{flex:1,alignItems:'center',gap:5},
  fastMonthTrack:{width:'100%',height:74,borderRadius:6,backgroundColor:C.mint,overflow:'hidden',justifyContent:'flex-end'},
  fastMonthFill:{width:'100%',backgroundColor:C.gold,borderRadius:6},
  fastMonthLabel:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},
  fastMonthCount:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},
  zHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,paddingVertical:16,paddingHorizontal:16,borderBottomWidth:1,borderBottomColor:C.line},
  zHeadTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,letterSpacing:1,textTransform:'uppercase',flex:1},
  zHeadRight:{flexDirection:'row',alignItems:'center',gap:8,flexShrink:0},
  zHeadAction:{color:C.gold,fontFamily:'DMSans_600SemiBold',fontSize:11,flexShrink:1,textAlign:'right'},
  zBody:{paddingTop:16},
  crashScreen:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',padding:24},
  crashCard:{backgroundColor:C.card,borderRadius:24,padding:22,borderWidth:1,borderColor:C.line,gap:10,maxWidth:420,width:'100%'},
  crashTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:20},
  crashBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13.5,lineHeight:20},
  crashDetail:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16,marginTop:2},
  liveFrame:{height:211,borderRadius:18,overflow:'hidden',backgroundColor:'#000',marginTop:12,borderWidth:1,borderColor:C.line},
  liveWeb:{flex:1,backgroundColor:'#000'},
  liveFallback:{position:'absolute',top:0,left:0,right:0,bottom:0,alignItems:'center',justifyContent:'center',padding:20},
  liveFallbackText:{color:C.onAccent,fontFamily:'DMSans_400Regular',fontSize:12,textAlign:'center'},
  liveBar:{position:'absolute',left:0,right:0,bottom:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingVertical:10},
  livePulse:{width:6,height:6,borderRadius:3,backgroundColor:C.coral},
  liveBadgeText:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:9,letterSpacing:1.2},
  liveSurface:{flex:1},
  liveScrim:{position:'absolute',top:0,left:0,right:0,bottom:0,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.28)'},
  liveFallbackButton:{marginTop:12,paddingHorizontal:14,paddingVertical:8,borderRadius:999,backgroundColor:C.onAccent},
  liveFallbackAction:{color:C.deep,fontFamily:'DMSans_700Bold',fontSize:12},
  liveControls:{flexDirection:'row',alignItems:'center',gap:8},
  liveButton:{width:32,height:32,borderRadius:16,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center'},
  livePlay:{width:38,height:38,borderRadius:19,backgroundColor:C.onAccent,alignItems:'center',justifyContent:'center'},
  vocabRow:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderBottomWidth:1,borderColor:C.line},
  vocabSave:{padding:4},
  vocabWord:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:22,lineHeight:34,textAlign:'right',writingDirection:'rtl'},
  vocabKnown:{backgroundColor:C.mint,borderRadius:10,paddingHorizontal:8,paddingVertical:3},
  vocabKnownText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10},
  letterGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},letterCell:{width:42,height:42,borderRadius:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,backgroundColor:C.white},letterCellWide:{width:58},letterCellActive:{backgroundColor:C.accent,borderColor:C.green},letterCellEmpty:{opacity:.4},letterText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:13},letterTextActive:{color:C.onAccent},letterTextDim:{color:C.muted},  settingsRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderColor:C.line},choicePill:{minHeight:44,justifyContent:'center',minWidth:44,alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderRadius:12,backgroundColor:C.bg,borderWidth:1,borderColor:C.line},choicePillActive:{backgroundColor:C.accent,borderColor:C.green},choiceText:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},choiceTextActive:{color:C.onAccent},preferenceLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:16,marginBottom:8},settings:{backgroundColor:C.card,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...surface},setting:{minHeight:69,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},settingName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
 locationGate:{flexDirection:'row',gap:16,alignItems:'flex-start',backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...soft},locationGateNarrow:{flexDirection:'column',alignItems:'stretch'},locationGateTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16},locationGateBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},locationActions:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:16},locationActionsNarrow:{flexDirection:'column',alignItems:'stretch'},primarySmall:{backgroundColor:C.accent,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostSmall:{backgroundColor:C.mint,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
 prayerTools:{flexDirection:'row',flexWrap:'wrap',gap:8},prayerToolsTwo:{flexDirection:'row',gap:12,marginBottom:8},prayerToolTwo:{flex:1},prayerTool:{flexGrow:1,flexBasis:'30%',minWidth:220},prayerToolInner:{minHeight:86,flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line},prayerToolText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,flex:1},
 libraryKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.7,marginTop:24},libraryHeading:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:4,marginBottom:12},
 calendarIntro:{backgroundColor:C.deep,borderRadius:24,padding:20},calendarMonth:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:29,marginTop:16},calendarHijri:{color:C.onAccent,fontFamily:'DMSans_400Regular',fontSize:12,marginTop:4},weekHead:{flexDirection:'row',marginTop:16},weekLabel:{width:'14.285%',textAlign:'center',color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11},calendarGrid:{flexDirection:'row',flexWrap:'wrap',marginTop:8,backgroundColor:C.white,borderRadius:24,padding:8,borderWidth:1,borderColor:C.line},calendarCell:{width:'14.285%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderRadius:12},calendarToday:{backgroundColor:C.mint,borderWidth:1,borderColor:C.line},gregorianDay:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:15},hijriDay:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:2},calendarLegend:{flexDirection:'row',alignItems:'center',gap:8,marginTop:12},
calendarPicked:{borderColor:C.green,borderWidth:1.5},
calendarEvent:{position:'absolute',bottom:3,width:5,height:5,borderRadius:3},
calendarEventFast:{backgroundColor:C.success},
calendarEventEid:{backgroundColor:C.gold},
calendarEventNight:{backgroundColor:C.gold},
calendarEventHajj:{backgroundColor:C.teal},
calendarEventNewyear:{backgroundColor:C.green},
eventRow:{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},
eventDot:{width:9,height:9,borderRadius:5},
eventDotFast:{backgroundColor:C.success},
eventDotEid:{backgroundColor:C.gold},
eventDotNight:{backgroundColor:C.gold},
eventDotHajj:{backgroundColor:C.teal},
eventDotNewyear:{backgroundColor:C.green},
eventCountdown:{backgroundColor:C.mint,borderRadius:11,paddingVertical:4,paddingHorizontal:10,borderWidth:1,borderColor:C.line},
eventCountdownText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
dayDetail:{backgroundColor:C.card,borderRadius:20,borderWidth:1,borderColor:C.line,padding:16,...soft},
dayDetailHijri:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:19,textAlign:'center'},
dayDetailEvent:{backgroundColor:C.mint,borderRadius:14,padding:12,gap:4},
dayDetailEventTitle:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:14},
dayDetailPrayers:{marginTop:14,gap:7},
dayDetailPrayer:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
dayDetailPrayerName:{color:C.muted,fontFamily:'DMSans_500Medium',fontSize:12},
dayDetailPrayerTime:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
legendDot:{width:8,height:8,borderRadius:4,backgroundColor:C.green},
 
 seekTrack:{height:26,justifyContent:'center',marginTop:8},
 seekFill:{position:'absolute',left:0,height:5,borderRadius:4,backgroundColor:C.green},
 seekKnob:{position:'absolute',top:7,width:13,height:13,borderRadius:8,backgroundColor:C.white,borderWidth:2,borderColor:C.green,marginLeft:-6},
 miniPlayer:{position:'absolute',left:12,right:12,backgroundColor:C.card,borderRadius:20,paddingHorizontal:12,paddingVertical:8,alignItems:'center',borderWidth:1,borderColor:C.line,...shadow},
 miniBody:{flex:1,flexDirection:'row',alignItems:'center',gap:12},
 miniArt:{width:40,height:40,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',overflow:'hidden'},
 miniTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},
 miniMeta:{color:C.muted,fontSize:10,marginTop:2},
 miniBtn:{width:44,height:44,borderRadius:22,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',marginLeft:8},
 miniGhost:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',marginLeft:2},
 audioRow:{flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:C.line},
 audioRowMain:{flex:1,flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12},
 audioRowAction:{width:46,height:46,alignItems:'center',justifyContent:'center'},
 audioHero:{backgroundColor:C.deep,borderRadius:24,padding:16,marginTop:16,...soft},
 audioHeroRow:{flexDirection:'row',alignItems:'center',gap:12},
 audioHeroKicker:{color:C.onHero,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2},
 audioHeroTitle:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:13,marginTop:4},
 audioHeroMeta:{color:C.onAccent,fontSize:10,marginTop:2},
 playerArt:{backgroundColor:C.deep,borderRadius:28,padding:24,alignItems:'center',...shadow},
playerHero:{borderRadius:30,padding:26,alignItems:'center',overflow:'hidden',...shadow},
playerAura:{position:'absolute',width:300,height:300,top:-90,borderRadius:150,opacity:.5},
playerArtRing:{width:150,height:150,borderRadius:75,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.13)',borderWidth:1,borderColor:'rgba(255,255,255,.28)'},
playerTranslationRow:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,padding:12,marginTop:16,...soft},
playerTranslationList:{backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,marginTop:8,overflow:'hidden'},
playerTranslationOption:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:14,paddingHorizontal:14,borderBottomWidth:1,borderColor:C.line},
  playerTranslationOptionLast:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:14,paddingHorizontal:14},
playerTranslationOptionOn:{backgroundColor:C.mint},
  playerRow:{flexDirection:'row',alignItems:'center',gap:10,marginTop:20},
  playerSeek:{marginTop:10},
  playerCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,marginTop:24,...surface},
 playerTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:14,textAlign:'center'},
 playerPerformer:{color:C.onAccent,fontSize:11,marginTop:5},
 trackBadge:{marginTop:16,backgroundColor:'rgba(255,255,255,.14)',borderRadius:12,paddingHorizontal:12,paddingVertical:8},
 trackBadgeText:{color:C.onHero,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1},
 playerArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:26,lineHeight:46,textAlign:'right',marginTop:24,direction:'rtl',writingDirection:'rtl'} as any,
 audioTimes:{flexDirection:'row',justifyContent:'space-between',marginTop:28},
 audioControls:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:16,marginTop:24},
 audioControlBtn:{width:52,height:52,borderRadius:26,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},
 audioControlMain:{width:72,height:72,borderRadius:36,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',...shadow},
 rateText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,marginTop:0},
 queueRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line},
 queueRowActive:{backgroundColor:C.mint,borderRadius:16,paddingHorizontal:8},
 queueIndex:{width:24,color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11,textAlign:'center'},
 heroActions:{flexDirection:'row',alignItems:'center',gap:8,marginTop:16},
 ghostHeroButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,borderWidth:1,borderColor:'rgba(255,255,255,.42)',paddingHorizontal:12,paddingVertical:12,borderRadius:16},
 ghostHeroText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold'},
 readerHeaderActions:{flexDirection:'row',alignItems:'center',gap:2},readerIconBtn:{width:36,height:36,borderRadius:12,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},
 audioEntryInner:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},
 surahNo:{width:40,height:40,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
 surahNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithProgressHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  hadithProgressName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  hadithTrack:{height:6,borderRadius:3,backgroundColor:C.line,marginTop:8,overflow:'hidden'},
  hadithFill:{height:'100%',borderRadius:4,backgroundColor:C.green},
  hadithCollectionCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},
  hadithCollectionTop:{flexDirection:'row',alignItems:'center',gap:12},hadithCollectionAr:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:19,lineHeight:30,textAlign:'right',writingDirection:'rtl',marginTop:2},hadithCountCol:{alignItems:'flex-end',marginLeft:4},hadithCountNum:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:15,includeFontPadding:false},hadithCountLabel:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:9,marginTop:1},hadithRowMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',textTransform:'uppercase',marginTop:3},hadithRowAr:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:21,lineHeight:36,textAlign:'right',writingDirection:'rtl',marginTop:7,includeFontPadding:false},
  hadithRowTop:{flexDirection:'row',alignItems:'flex-start',gap:12},
  hadithNumber:{minWidth:34,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',paddingHorizontal:8},hadithRowRef:{color:C.muted,fontSize:10,marginTop:5,fontFamily:'DMSans_600SemiBold'},
  hadithNumberText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12,includeFontPadding:false,textAlign:'center'},
  hadithNumberLarge:{width:46,height:46,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  hadithDetailHead:{flexDirection:'row',alignItems:'center',gap:12},
  hadithGrades:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:16},
  hadithGrade:{backgroundColor:C.mint,borderRadius:12,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderColor:C.line},
  hadithGradeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},
  hadithGradeSource:{color:C.muted,fontSize:10,marginTop:2},
  hadithNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,gap:12},
  hadithNavBtn:{flex:1,minHeight:44,justifyContent:'center'},
  hadithNavText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:12},
hadithBreadcrumb:{alignItems:'center',marginBottom:14},
hadithCrumbMain:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11,letterSpacing:1.2,textAlign:'center'},
hadithCrumbSub:{color:C.muted,fontSize:11,marginTop:4,textAlign:'center'},
hadithPage:{backgroundColor:themeDark?mix(BRAND.midnightInk,BRAND.lavender,.12):brandHex('#FCFAF6'),borderRadius:10,borderWidth:1.6,borderColor:C.gold,padding:12,...soft},
hadithPageInner:{borderRadius:5,borderWidth:.8,borderColor:C.gold,paddingHorizontal:16,paddingVertical:20},
hadithPageAr:{color:C.ink,fontFamily:'NotoNaskhArabic_400Regular',fontSize:24,lineHeight:46,textAlign:'right',direction:'rtl',writingDirection:'rtl'} as any,
hadithPageNo:{alignSelf:'center',marginTop:-1,marginBottom:-22,width:36,height:36,borderRadius:18,borderWidth:1.3,borderColor:C.gold,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
hadithPageNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
hadithReaderEn:{color:C.ink,fontSize:15.5,lineHeight:27,marginTop:26},
cityCurrent:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.mint,borderRadius:16,padding:14,borderWidth:1,borderColor:C.line,marginTop:12},
cityCurrentLabel:{color:C.muted,fontSize:10,letterSpacing:1.1,fontFamily:'DMSans_700Bold'},
cityCurrentName:{color:C.ink,fontSize:15,fontFamily:'DMSans_700Bold',marginTop:3},
cityResults:{gap:8,marginTop:10},
cityResultRow:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:C.card,borderRadius:14,paddingVertical:12,paddingHorizontal:13,borderWidth:1,borderColor:C.line},
cityResultName:{color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold'},
citySourceTag:{backgroundColor:C.bg,borderRadius:8,paddingHorizontal:7,paddingVertical:3,borderWidth:1,borderColor:C.line},
citySourceText:{color:C.muted,fontSize:9,letterSpacing:.8},
cityFootnote:{color:C.muted,fontSize:11,lineHeight:16,marginTop:10,marginBottom:2},
reportCard:{backgroundColor:C.card,borderRadius:16,padding:14,borderWidth:1,borderColor:C.line,marginTop:10},
reportRef:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13.5},
reportFlag:{color:C.green,fontSize:11,letterSpacing:.6,marginTop:3},
reportBodyText:{color:C.ink,fontSize:12.5,lineHeight:19,marginTop:8},
reportMeta:{color:C.muted,fontSize:11,marginTop:4},
reportActions:{flexDirection:'row',alignItems:'center',gap:8,marginTop:12},
reportBtnSmall:{paddingVertical:8,paddingHorizontal:12,borderRadius:11,borderWidth:1,borderColor:C.line},
reportBtnSmallText:{color:C.ink,fontSize:12,fontFamily:'DMSans_600SemiBold'},
reportBtn:{flex:1,paddingVertical:9,paddingHorizontal:12,borderRadius:11,backgroundColor:C.green,alignItems:'center'},
reportBtnText:{color:'#fff',fontSize:12.5,fontFamily:'DMSans_600SemiBold'},
reportBtnGhost:{paddingVertical:8,paddingHorizontal:12,borderRadius:11},
reportBtnGhostText:{color:C.coral,fontSize:12,fontFamily:'DMSans_600SemiBold'},


onbChosen:{flexDirection:'row',alignItems:'center',gap:9,backgroundColor:C.mint,borderRadius:14,padding:12,marginBottom:12,borderWidth:1,borderColor:C.line},
onbChosenText:{color:C.ink,fontSize:13,flex:1},
onbNote:{backgroundColor:C.bg,borderRadius:12,padding:12,marginTop:8,borderWidth:1,borderColor:C.line},
onbNoteText:{color:C.muted,fontSize:11,lineHeight:17,marginTop:10},
onbPromise:{flexDirection:'row',gap:12,backgroundColor:C.card,borderRadius:16,padding:14,borderWidth:1,borderColor:C.line,marginBottom:10},
onbPromiseTitle:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13.5},
onbPromiseBody:{color:C.muted,fontSize:11.5,lineHeight:17,marginTop:3},
locationBanner:{flexDirection:'row',alignItems:'center',gap:11,backgroundColor:C.card,borderRadius:14,padding:12,borderWidth:1,borderColor:C.line,marginVertical:8,...surface},
locationBannerIcon:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
locationBannerTitle:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12.5},
sleepHadith:{backgroundColor:C.mint,borderRadius:16,padding:16,borderWidth:1,borderColor:C.line,marginBottom:12},
sleepHadithAr:{color:C.ink,fontSize:15,lineHeight:28,textAlign:'center',marginBottom:10,fontFamily:'Amiri_400Regular',writingDirection:'rtl'},
sleepHadithEn:{color:C.ink,fontSize:12.5,lineHeight:20,fontStyle:'italic',marginBottom:8},
sleepHadithRef:{color:C.green,fontSize:10.5,letterSpacing:.6,marginTop:2},
sleepPrivacy:{flexDirection:'row',gap:10,backgroundColor:C.bg,borderRadius:12,padding:12,marginTop:12,borderWidth:1,borderColor:C.line},
sleepPrivacyText:{color:C.muted,fontSize:11,lineHeight:17,flex:1},
levelRow:{flexDirection:'row',alignItems:'center',gap:11},
levelValue:{color:C.muted,fontSize:11,fontFamily:'DMSans_600SemiBold',width:26,textAlign:'right'},
levelTrack:{flex:1,height:26,justifyContent:'center'},
levelFill:{position:'absolute',left:0,height:4,borderRadius:2},
levelKnob:{position:'absolute',width:15,height:15,borderRadius:8,backgroundColor:'#fff',borderWidth:2,marginLeft:-7.5,elevation:2,shadowColor:'#000',shadowOpacity:.18,shadowRadius:2,shadowOffset:{width:0,height:1}},
rateRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:22,marginVertical:6},
rateValue:{color:C.ink,fontSize:22,fontFamily:'DMSans_700Bold',minWidth:74,textAlign:'center'},
rangeRow:{flexDirection:'row',gap:14,marginTop:6},
rangeEnd:{flex:1},
stepperSmall:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:4,backgroundColor:C.bg,borderRadius:11,paddingHorizontal:6,paddingVertical:3,borderWidth:1,borderColor:C.line},
rangeNumber:{color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold'},
stepButtonSmall:{padding:4},
mushafPageStack:{alignItems:'center',paddingVertical:6},
mushafPageOuter:{overflow:'hidden'},
mushafMarkerBand:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginVertical:5},
mushafMarkerRule:{height:1,backgroundColor:C.gold,opacity:.55},
mushafMarkerName:{color:C.gold,fontSize:11,fontFamily:'NotoNaskhArabic_600SemiBold',writingDirection:'rtl'},
mushafMarkerNum:{color:C.gold,fontSize:11,fontFamily:'NotoNaskhArabic_400Regular',writingDirection:'rtl'},
mushafConnection:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,paddingVertical:5,paddingHorizontal:10,alignSelf:'center',backgroundColor:C.card,borderRadius:11,borderWidth:1,borderColor:C.line,marginVertical:3},
mushafConnectionText:{color:C.muted,fontSize:10.5,fontFamily:'DMSans_600SemiBold'},
mushafConnectionTextCut:{color:C.gold},
mushafConnectionCut:{borderColor:C.gold,backgroundColor:C.mint},
mushafPageTranslation:{color:C.muted,lineHeight:19,marginTop:5,marginBottom:2},
onbGhostWide:{alignItems:'center',paddingVertical:11,borderRadius:12,marginTop:10},
locationBannerBody:{color:C.muted,fontSize:11,lineHeight:15,marginTop:2},
  recentChipWide:{minWidth:150,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...soft},
  recentChipTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:4},
  duaKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2,marginTop:12,marginBottom:4},
  duaTransliteration:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13,lineHeight:22,fontStyle:'italic'},
  duaRefToggle:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:12},
  duaReference:{color:C.muted,fontSize:11,lineHeight:18,marginTop:8},
  duaShortcutGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  duaShortcut:{width:'48.7%',backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...surface},
  duaShortcutLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  duaCategoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4},
  duaCategoryCard:{width:'48.7%',minHeight:88,backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...surface},
  duaCategoryNo:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
  duaCategoryName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12,marginTop:4},
  offlineNote:{backgroundColor:C.mint,borderRadius:16,padding:12,marginBottom:12,borderWidth:1,borderColor:C.line},
  offlineNoteText:{color:C.green,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  tasbihCard:{backgroundColor:C.card,borderRadius:20,padding:16,alignItems:'center',marginTop:16,borderWidth:1,borderColor:C.line,...surface},sunnahList:{backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,gap:8,...surface},sunnahRow:{borderRadius:14,paddingVertical:13,paddingHorizontal:12,backgroundColor:C.mint,borderWidth:1,borderColor:C.line},sunnahRowOn:{backgroundColor:C.accent,borderColor:C.green},sunnahRowName:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:13},tasbihRow:{paddingVertical:4,marginTop:16},tasbihGoalRow:{marginTop:2},timeField:{marginTop:12},timeFieldLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginBottom:7},timeFieldButton:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:48,backgroundColor:C.white,paddingHorizontal:16,borderRadius:16,borderWidth:1,borderColor:C.line},timeFieldValue:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16,direction:'ltr'},clockScrim:{flex:1,backgroundColor:'rgba(11,8,20,0.55)',alignItems:'center',justifyContent:'center',padding:24},clockSheet:{width:'100%',maxWidth:360,backgroundColor:C.bg,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...shadow},clockTitle:{color:C.ink,fontSize:18,fontFamily:'Newsreader_600SemiBold',textAlign:'center'},clockPreview:{color:C.green,fontSize:28,fontFamily:'DMSans_700Bold',textAlign:'center',marginTop:6,direction:'ltr'},clockWheels:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:4,marginTop:14,direction:'ltr'},clockBand:{position:'absolute',top:CLOCK_ROW*2,left:0,right:0,height:CLOCK_ROW,borderRadius:12,backgroundColor:C.mint,borderWidth:1,borderColor:C.line},clockItem:{height:CLOCK_ROW,alignItems:'center',justifyContent:'center'},clockItemText:{color:C.ink,fontSize:19,fontFamily:'DMSans_600SemiBold'},clockActions:{flexDirection:'row',gap:8,marginTop:18},toast:{position:'absolute',left:24,right:24,bottom:BOTTOM_RESERVE+8,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,paddingVertical:13,borderWidth:1,borderColor:C.line,...shadow},toastText:{flex:1,color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12,lineHeight:17},
  nameOfDayCard:{backgroundColor:C.deep,borderRadius:24,padding:20,alignItems:'center',marginTop:16,...shadow,borderTopColor:depth.edge},
  namesArabicLarge:{color:C.onAccent,fontFamily:'Amiri_400Regular',fontSize:38,marginTop:8,textAlign:'center',writingDirection:'rtl'},
  namesTransliteration:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:8},
  namesArabic:{color:C.ink,fontFamily:'Amiri_400Regular',fontSize:24,textAlign:'right',writingDirection:'rtl'},
  nameRow:{flexDirection:'row',alignItems:'flex-start',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line},
  nameNumber:{width:56,alignItems:'flex-end'},
backRow:{marginBottom:4,flexDirection:'row'},
  sectionLink:{paddingVertical: 16,marginVertical:-15,paddingHorizontal:12,marginHorizontal:-12},markLink:{flexDirection:'row',alignItems:'center',gap:5,paddingVertical:16,marginVertical:-15,paddingHorizontal:12,marginHorizontal:-12},stopButton:{width:44,height:44,alignItems:'center',justifyContent:'center'},verseAction:{width:31,height:31,alignItems:'center',justifyContent:'center'},verseActionGlow:{position:'absolute',width:26,height:26,borderRadius:13,backgroundColor:C.mint},verseActionOn:{position:'absolute',width:25,height:25,borderRadius:13,backgroundColor:mix(BRAND.pearl,BRAND.radiantGold,.14),borderWidth:1,borderColor:mix(BRAND.radiantGold,BRAND.pearl,.45)},searchGo:{width:44,height:44,alignItems:'center',justifyContent:'center'},
pinPage:{flexGrow:1,alignItems:'center',paddingHorizontal:24,paddingTop:4,paddingBottom:BOTTOM_RESERVE},pinPageBare:{flex:1,alignItems:'center',paddingHorizontal:24,paddingTop:4,paddingBottom:24},
pinDots:{flexDirection:'row',gap: 12,marginTop:24},
pinDot:{width:14,height:14,borderRadius:7,borderWidth:1.5,borderColor:C.line},
pinDotFilled:{backgroundColor:C.accent,borderColor:C.green},
pinDotError:{backgroundColor:C.coral,borderColor:C.coral},
pinPad:{width:'100%',maxWidth:340,gap:12,marginTop:20},
pinRow:{flexDirection:'row',gap:12},
pinKey:{flex:1,height:64,borderRadius:20,backgroundColor:C.card,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...surface},
pinKeyGhost:{flex:1,height:64},
pinKeyText:{color:C.ink,fontSize:22,fontFamily:'DMSans_700Bold'},
pinHint:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,marginTop: 12,textAlign:'center',minHeight:20},
pinHintError:{color:C.coral},
statGrid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12},
statBox:{width:'47%',backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},
statLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1},
statValue:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:22,marginTop:4},
guideBlock:{padding:16,borderBottomWidth:1,borderColor:C.line},
guideTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:13,marginBottom:6},
purityRow:{flexDirection:'row',flexWrap:'wrap',gap:8},
purityChip:{width:44,height:52,borderRadius:14,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
purityDay:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:13},
purityLabel:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:9,marginTop:2},
purityFlow:{backgroundColor:C.card,borderColor:C.gold},
puritySpotting:{backgroundColor:C.yellow,borderColor:C.gold},
purityPure:{backgroundColor:C.mint,borderColor:C.line},
purityToday:{borderColor:C.green,borderWidth:1.5},
dayStepper:{flexDirection:'row',alignItems:'center',gap:12,marginTop:4},

assetRow:{minHeight:69,alignItems:'center',paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},
assetInput:{width:120,backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:14,paddingHorizontal:12,paddingVertical:8,fontSize:15,fontFamily:'DMSans_700Bold',color:C.ink,textAlign:'right',outlineStyle:'none'} as any,
metalRow:{alignItems:'center',minHeight:56,borderBottomWidth:1,borderColor:C.line},
memHero:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',gap:16,...shadow},
memScore:{color:C.onAccent,fontSize:38,fontFamily:'DMSans_700Bold'},
memScoreLabel:{color:C.onAccent,fontSize:13,fontFamily:'DMSans_700Bold'},
memHeroNote:{color:C.onAccent,fontSize:10,marginTop:3},
memBar:{height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,.22)',overflow:'hidden',marginTop:12},
memBarFill:{height:'100%',borderRadius:3,backgroundColor:C.gold},
memStats:{flexDirection:'row',gap:8,marginTop:12},
memStat:{flex:1,backgroundColor:C.card,borderRadius:16,paddingVertical:12,alignItems:'center',gap:2,borderWidth:1,borderColor:C.line},
memStatValue:{color:C.ink,fontSize:19,fontFamily:'DMSans_700Bold'},
memStatLabel:{color:C.muted,fontSize:9,fontFamily:'DMSans_700Bold',letterSpacing:.6,textTransform:'uppercase'},
memVerseBox:{backgroundColor:C.white,borderRadius:24,padding:20,marginTop:12,borderWidth:1,borderColor:C.line,...shadow},
memTarget:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.1,textTransform:'uppercase'},
memVerseText:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:29,lineHeight:58,textAlign:'right',marginTop:14,writingDirection:'rtl'} as any,
memBlank:{color:'transparent',backgroundColor:C.mint,borderRadius:5,overflow:'hidden'},
memHint:{color:C.muted,fontSize:12,lineHeight:18,marginTop:14,textAlign:'center'},
memAnswerCard:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line},
memAnswerTitle:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold',letterSpacing:.6,textTransform:'uppercase'},
memAnswerBody:{color:C.muted,fontSize:12,lineHeight:18,marginTop:6},
memActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8,marginTop:14},
memRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},
memRowMain:{flex:1},
memRowRight:{alignItems:'flex-end',minWidth:56},
memKey:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
memConf:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
memFlag:{backgroundColor:C.yellow,borderRadius:8,paddingHorizontal:7,paddingVertical:2,marginTop:4},
memFlagText:{color:BRAND.bronze,fontSize:9,fontFamily:'DMSans_700Bold'},
memMiniBar:{height:4,borderRadius:2,backgroundColor:C.mint,overflow:'hidden',marginTop:6},
memMiniFill:{height:'100%',borderRadius:2,backgroundColor:C.green},
memStepper:{flexDirection:'row',alignItems:'center',gap:10,marginTop:8},
memStepButton:{width:38,height:38,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
memStepValue:{color:C.ink,fontSize:17,fontFamily:'DMSans_700Bold',minWidth:26,textAlign:'center'},
memChip:{backgroundColor:C.mint,borderRadius:12,paddingHorizontal:10,paddingVertical:6,borderWidth:1,borderColor:C.line},
memChipText:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold'},
memChipWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:10},
memSpacer:{width:1,height:1},
backupHero:{backgroundColor:C.deep,borderRadius:24,padding:18,flexDirection:'row',alignItems:'center',gap:14,...shadow},
backupHeroTitle:{color:C.onAccent,fontSize:15,fontFamily:'DMSans_700Bold'},
backupHeroText:{color:C.onAccent,fontSize:11,lineHeight:16,marginTop:3},
backupNotice:{backgroundColor:mix(BRAND.bronze,BRAND.pearl,.90),borderRadius:16,padding:14,marginTop:12,borderWidth:1,borderColor:mix(BRAND.bronze,BRAND.pearl,.72)},
backupNoticeText:{color:BRAND.bronze,fontSize:12,lineHeight:17},
backupNoticeGood:{backgroundColor:C.mint,borderColor:C.line},
backupNoticeGoodText:{color:C.green,fontSize:12,lineHeight:17},
backupBusy:{flexDirection:'row',alignItems:'center',gap:10,marginTop:14},
backupInput:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:16,padding:14,fontSize:14,color:C.ink,marginTop:8,outlineStyle:'none'} as any,
backupPaste:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:16,padding:14,fontSize:11,color:C.ink,minHeight:120,textAlignVertical:'top',marginTop:8,outlineStyle:'none'} as any,
backupLink:{alignSelf:'flex-start',paddingVertical:10},
backupLinkText:{color:C.green,fontSize:11,fontFamily:'DMSans_600SemiBold'},
backupActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8,marginTop:12},
homeReflectTabs:{flexDirection:'row',backgroundColor:C.mint,borderRadius:16,padding:4,marginBottom:12,borderWidth:1,borderColor:C.line},
homeReflectTab:{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:6,borderRadius:12},
homeReflectTabOn:{backgroundColor:C.card,borderWidth:1,borderColor:C.line},
homeReflectTabText:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:12},
homeReflectTabTextOn:{color:C.green,fontFamily:'DMSans_700Bold'},
homeReflectHero:{backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...surface},
homeReflectArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:28,lineHeight:46,textAlign:'right',marginTop:12,writingDirection:'rtl'},
homeReflectName:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:40,textAlign:'right',marginTop:14,writingDirection:'rtl'},
homeReflectBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13.5,lineHeight:21,marginTop:10},
homeReflectFoot:{flexDirection:'row',alignItems:'center',gap:6,marginTop:16,paddingTop:14,borderTopWidth:1,borderTopColor:C.line},
homeReflectFootText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:12,flex:1},
dayToolIcon:{width:52,height:52,borderRadius:26,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,marginRight:12},
  /* Transliteration: the Arabic on top, sounded out underneath. */
  trStepRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:16,marginBottom:4},
  trStep:{width:40,height:40,borderRadius:14,backgroundColor:C.card,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
  trSurahName:{color:C.ink,fontSize:20,fontFamily:'Newsreader_600SemiBold',textAlign:'center'},
  trEdition:{flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:14,paddingVertical:9,borderRadius:14,backgroundColor:C.card,borderWidth:1,borderColor:C.line},
  trEditionOn:{backgroundColor:C.green,borderColor:C.green},
  trEditionText:{color:C.muted,fontSize:12,fontFamily:'DMSans_600SemiBold'},
  trEditionTextOn:{color:C.onAccent},
  trVerse:{marginBottom:10,padding:14},
  trVerseTop:{flexDirection:'row',alignItems:'flex-start',gap:10},
  trNum:{width:26,height:26,borderRadius:13,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,marginTop:6},
  trNumText:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold'},
  trArabic:{flex:1,color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:24,lineHeight:46,textAlign:'right',writingDirection:'rtl'} as any,
  trTranslit:{color:C.muted,fontSize:14,lineHeight:22,marginTop:10,fontFamily:'DMSans_400Regular'},
  /* Storage: what the app is holding, and what it costs. */
  storeTotal:{alignItems:'center',paddingVertical:18,marginBottom:16},
  storeTotalNum:{color:C.ink,fontSize:34,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},
  storeRow:{marginBottom:16},
  storeRowTop:{flexDirection:'row',alignItems:'baseline',justifyContent:'space-between'},
  storeLabel:{color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold',flex:1},
  storeBytes:{color:C.green,fontSize:13,fontFamily:'DMSans_700Bold'},
  storeTrack:{height:8,borderRadius:4,backgroundColor:C.mint,marginTop:7,overflow:'hidden'},
  storeFill:{height:8,borderRadius:4},
  storeDetail:{color:C.muted,fontSize:11.5,fontFamily:'DMSans_400Regular',marginTop:5},
  /* Onboarding download: what has arrived, in bytes, and a way to stop it. */
  onbProgressRow:{flexDirection:'row',alignItems:'center',gap:10,marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:C.line},
  onbProgressTrack:{flex:1,height:6,borderRadius:3,backgroundColor:C.mint,overflow:'hidden'},
  onbProgressFill:{height:6,borderRadius:3,backgroundColor:C.green},
  onbProgressText:{color:C.muted,fontSize:11.5,fontFamily:'DMSans_600SemiBold',minWidth:64,textAlign:'right'},
  onbCancel:{paddingHorizontal:10,paddingVertical:5,borderRadius:10,borderWidth:1,borderColor:C.line,backgroundColor:C.card},
  onbCancelText:{color:C.ink,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  /* Onboarding permission: the ask, and somewhere to go if it is not shown. */
  
  
  
    /* The backdrop that holds the screen while it dips out and back during a
       theme change. Opaque and full-height, so what shows through the dip is
       the new ground colour rather than whatever sits behind the app. */
    /* ---------------------------------------------------------------- *
       Ramadan
     * ---------------------------------------------------------------- */
    ramToday:{borderRadius:24,padding:18,...shadow},
    ramTodayTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},
    ramArabic:{color:C.onHero,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:30,writingDirection:'rtl'},
    ramStatus:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:12},
    ramTodayTimes:{flexDirection:'row',gap:10,marginTop:16},
    ramTimeBlock:{flex:1,backgroundColor:'rgba(255,255,255,.15)',borderRadius:14,padding:11},
    ramTimeLabel:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:9,letterSpacing:.8,opacity:.85},
    ramTimeValue:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:20,marginTop:3},
    ramCountRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:14},
    ramCountValue:{color:C.onAccent,fontFamily:'DMSans_600SemiBold',fontSize:12.5},
    ramMonth:{backgroundColor:C.card,borderRadius:24,borderWidth:1,borderColor:C.line,padding:12,...surface},
    ramWeekRow:{flexDirection:'row',gap:6},
    ramWeekCell:{flex:1,alignItems:'center',paddingVertical:5},
    ramWeekText:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10},
    ramGrid:{flexDirection:'row',flexWrap:'wrap',gap:6},
    ramCellSpacer:{flexGrow:1,flexShrink:1,flexBasis:'13%',height:64},
    ramCell:{flexGrow:1,flexShrink:1,flexBasis:'13%',height:64,borderRadius:12,borderWidth:1,borderColor:C.line,backgroundColor:C.bg,alignItems:'center',justifyContent:'center'},
    ramCellPast:{backgroundColor:'transparent'},
    ramCellToday:{borderWidth:2,borderColor:C.green,backgroundColor:C.mint},
    ramCellNum:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:14},
    ramCellNumPast:{color:C.muted},
    ramCellRule:{height:1,width:15,backgroundColor:C.line,marginVertical:3},
    ramCellTime:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:12},
    ramCellIftar:{color:C.body,fontFamily:'DMSans_700Bold'},
    ramCellTimePast:{color:C.chevron},
    ramLegend:{flexDirection:'row',alignItems:'center',gap:14,marginTop:10,paddingHorizontal:4},
    ramLegendItem:{flexDirection:'row',alignItems:'center',gap:6},
    ramSwatch:{width:9,height:9,borderRadius:3,backgroundColor:C.muted},
    ramSwatchIftar:{backgroundColor:C.body},
    ramLegendText:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11},
    ramLegendNote:{marginLeft:'auto',color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11},
    themeSwap:{flex:1,backgroundColor:C.bg}});
  /* Runs in both themes now: the brand remap has to land on light too. */
  return remapStyles(created);
}
