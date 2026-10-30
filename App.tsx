function ExploreStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ExploreHome" component={ExploreHome}/><Stack.Screen name="Adhkar" component={AdhkarScreen}/><Stack.Screen name="99 Names" component={NamesScreen}/><Stack.Screen name="Prophet Names" component={ProphetNamesScreen}/><Stack.Screen name="Duas" component={DuasScreen}/><Stack.Screen name="Dua Category" component={DuaCategoryScreen}/><Stack.Screen name="Hadith" component={HadithScreen}/><Stack.Screen name="Hadith Collection" component={HadithCollectionScreen}/><Stack.Screen name="Hadith Detail" component={HadithDetailScreen}/><Stack.Screen name="Hadith Saved" component={HadithSavedScreen}/><Stack.Screen name="Worship Guides" component={GuideDirectory}/><Stack.Screen name="Guide Detail" component={needsPayload(GuideDetailInner, 'Guide')}/><Stack.Screen name="Quran Vocabulary" component={VocabularyScreen}/><Stack.Screen name="Tajweed Study" component={TajweedStudyScreen}/><Stack.Screen name="Pilgrimage" component={PilgrimageScreen}/><Stack.Screen name="Journey" component={needsPayload(JourneyScreenInner, 'Journey')}/><Stack.Screen name="Purity" component={PurityScreen}/></Stack.Navigator>}

/**
 * The prayer tab: keeping the day. The times, the direction, the call, the
 * reminders, the location they are worked out from, and the calendar and
 * fasts that hang on them.
 */
function PrayerStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Prayer" component={PrayerScreen}/><Stack.Screen name="Adhan" component={AdhanScreen}/><Stack.Screen name="Ramadan" component={RamadanScreen}/></Stack.Navigator>}
/** The tools tab: what you calculate, look up, travel for, or record. */
function ToolsStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ToolsHome" component={ToolsHomeScreen}/><Stack.Screen name="Zakat" component={ZakatScreen}/><Stack.Screen name="Mosques" component={DataTool}/><Stack.Screen name="Holy site channels" component={HolyChannelsScreen}/><Stack.Screen name="Women" component={WomenHubScreen}/><Stack.Screen name="Istihada" component={IstihadaScreen}/><Stack.Screen name="Ramadan Planner" component={RamadanPlannerScreen}/><Stack.Screen name="These Days" component={TheseDaysScreen}/><Stack.Screen name="Cycle" component={CycleScreen}/><Stack.Screen name="Qada" component={QadaScreen}/><Stack.Screen name="Women Guides" component={WomenGuidesScreen}/><Stack.Screen name="Privacy Lock" component={PrivacyLockScreen}/><Stack.Screen name="Fasting" component={FastingScreen}/><Stack.Screen name="Weekly Summary" component={WeeklySummaryScreen}/><Stack.Screen name="Qibla" component={QiblaScreen}/><Stack.Screen name="Location Setup" component={LocationSetupScreen}/><Stack.Screen name="Notifications" component={NotificationScreen}/><Stack.Screen name="Hijri Calendar" component={HijriCalendarScreen}/><Stack.Screen name="Tasbih" component={TasbihScreen}/><Stack.Screen name="Umrah Packing" component={UmrahPackingScreen}/><Stack.Screen name="Hajj Live" component={HajjLiveScreen}/></Stack.Navigator>}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, Alert, Animated, BackHandler, Easing, Image, ImageBackground, Linking, Platform,
  Pressable as BarePressable,
  I18nManager, RefreshControl, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput,
  PanResponder, useColorScheme, useWindowDimensions, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { haptic, isHapticsSupported, setHapticsEnabled, withHaptic, type HapticKind } from './src/services/haptics';
import { createNavigationContainerRef, NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
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
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  AudioEdition, Chapter, DailyAyah, DailyHadith, DivineName, getAyahEditions, getAyahOfDay, getChapters, getDailyHadith, getDuas, getQuranEditions,
  getAyahForDate, getCalendarSpan, getGregorianCalendar, getNameOfDay, getNames, getNearbyMosques, getPrayerCalendar, getPrayerSnapshot, getQibla, getRamadanCalendar,
  getHizbVerses, getJuzVerses, getPageVerses, getVerses, searchQuran, CalendarDay, Prayer, PrayerSnapshot, QuranEdition, QuranSearchResult, SurahReciter, Verse,
  HajjCountdown, getHajjCountdown
} from './src/services/api';
import {
  DEFAULT_DAY_TOOLS, DEFAULT_WORSHIP_SETTINGS, loadDailyContent, loadPrayerCache, loadPrayerCompletion, loadPrayerHistory, loadQuickTasbih, loadStoredLocation, loadWorshipSettings,
  saveDailyContent, savePrayerCache, savePrayerCompletion, saveQuickTasbih, saveStoredLocation, saveWorshipSettings,
  WorshipSettings, loadOnboarding, saveOnboarding, loadLanguage, saveLanguage
} from './src/services/localState';
import {
  actionFromResponse, adhanOption, ADHAN_OPTIONS, cancelAllNotifications, getNotificationHealth, getScheduledCount,
  NotificationHealth, prayerFromNotification, requestNotificationPermission, schedulePrayerNotifications, sendTestNotification,
  SLEEP_SURAH
} from './src/services/notifications';
import { addNotificationResponseReceivedListener, type NotificationResponse } from 'expo-notifications';
import { getBatteryOptimizationState, requestBatteryExemption, type BatteryState } from './src/services/batteryOptimization';
import { copyFeedback, issueLabel, loadReports, markReportSent } from './src/services/reportService';
import { computeMushafLayout } from './src/services/mushafLayout';
import { markerBetween, MARKER_KINDS, MARKER_LABELS, MARKER_NOTE, type MushafMarker, type MarkerKind, type PageConnection } from './src/services/mushafMarkers';
import { localizeGuide, WORSHIP_GUIDES, WorshipGuide } from './src/content/worshipGuides';
import { GUIDE_HADITH, GUIDE_VERSES } from './src/content/guideSources';
import { QURAN_TOPICS, QURAN_VOCABULARY, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from './src/content/quranStudy';
import { addSearchHistory, clearSearchHistory, clearSurahCache, deleteNote, HifzStatus, loadBookmarks, loadHifz, loadNotes, loadPlan, loadQuranPreferences, loadReadingPosition, loadRecentSurahs, loadSearchHistory, loadSurahCache, readerCacheKey, loadSurahCacheIndex, DEFAULTS, loadVocabularyProgress, QuranBookmark, QuranNote, QuranPreferences, removeSearchHistory, saveHifz, saveNote, savePlan, saveQuranPreferences, saveReadingPosition, saveSurahCache, saveVocabularyProgress, toggleBookmark, ReadingPosition } from './src/services/quranState';
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
import { getHadithPage, getHadith, getLoadedCollections, getNeighbours, whenArabicReady, hadithReference, hadithSourceLabel, HADITH_COLLECTIONS, Hadith, HadithCollectionData, isHadithSaved, loadHadithCollection, loadHadithState, markHadithRead, removeHadithBookmark, searchLoadedCollections, toggleHadithSaved, useHadithState } from './src/services/hadithService';
import {
  buildReportMailto, deleteReport, openReportEmail, saveReport, subscribeReports,
  type CorrectionReport, type CorrectionIssue as ReportIssue
} from './src/services/reportService';
import {
  loadOfflineSetup, offlineProgress, replanForLanguage, resumeSavedOfflineSetup,
  startOfflineSetup, subscribeOfflineSetup, type OfflineSetup
} from './src/services/offlinePlan';
import { rememberCity, searchCities, searchLocalCities, type CityResult } from './src/services/cities';
import { loadDuaCategories, loadDuas } from './src/services/duaService';
import { loadNameLanguage, loadNameOfDay, loadNames, saveNameLanguage } from './src/services/namesService';
import { ARABIC_UI, ARABIC_UI_SEMIBOLD, ensureQuranFont, quranFontFamily as quranFont, QURAN_FONTS, useQuranFont } from './src/services/fonts';
import { shareVerseCard } from './src/services/verseCard';
import { VerseShareCard } from './src/components/VerseShareCard';
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
import { CARD, CARD_GAP, RADIUS, SPACE } from './src/design/tokens';
import { useCalmMotion } from './src/design/useCalmMotion';
import { MOTION, easeOut, useEntrance, usePressDepth } from './src/design/motion';
import { completeJourney, clearJourney, journeyMeta, JOURNEY_META, JOURNEY_STEPS, localizeJourneyStep, JourneyKind, JourneyStep, journeyProgress, setStepCount, setStepNote, startJourney, toggleStep, useJourneys, loadJourneys, setJourneyDateLocale } from './src/services/journeyService';
import { HOLY_CHANNELS, openChannel } from './src/services/holyChannels';
import { clearFastDay, FastType, labelForEntry, loadFastingState, missedReasons, MISSED_REASONS, MissedReason, recordFast, readableDate, setFastingOwed, summariseFasting, useFasting, setFastingDateLocale } from './src/services/fastingService';
import { buildWeeklySummary, loadActivity, logHifzReview, logMushafPage, logSurahOpen, logVerseRead, useActivity, setActivityDateLocale } from './src/services/activityService';
import { addDays, addQada, ADVISORY, assessBleeding, BISMILLAH_ARABIC, BLEEDING_GUIDANCE, cycleStats, dayKey, daysBetween, deleteCycle, deleteNifas, deleteQada, endCycle, endNifas, EXPLANATIONS, FLOW_LEVELS, formatDay, formatLongDay, GHUSL_FARD, GHUSL_SUNNAH, LIMITS, loadWomensState, logPurity, nifasStats, NIYYAH_ARABIC, NIYYAH_MEANING, NIYYAH_TRANSLITERATION, PurityStatus, QadaReason, QADA_REASONS, qadaStats, RAMADAN_ADVISORY, RAMADAN_NOTES, RAMADAN_STATE_LABEL, ramadanPlan, RamadanPlanDay, recentPurity, REFERENCES, SCHOOL_NOTE, setFlow, setOptedIn, startCycle, startNifas, THESE_DAYS_ACTS, THESE_DAYS_ADVISORY, THESE_DAYS_ANCHOR, THESE_DAYS_DISPUTED, TheseDaysAct, toggleQada, TUHR_SIGNS, useWomens, WORSHIP_GUIDANCE } from './src/services/womensService';
import { BiometricInfo, biometricInfo, checkPin, removePin, RELOCK_OPTIONS, setPin, startLockWatch, unlockSession, unlockWithBiometric, updateLockSettings, useIsLocked, useLockConfig, loadLockConfig } from './src/services/privacyService';
import { CURRENCIES, clearHistory, computeZakat, currencySymbol, deleteCalculation, formatMoney, livePrices, loadZakatState, marketIsFresh, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, refreshMarket, saveCalculation, setAssetAmount, setBasis, setCurrency, setLiabilityAmount, setMetalPrice, setMoneyLocale, useLiveMetalPrices, useMarket, useZakat } from './src/services/zakatService';
import { arNoun, clockTime, prayerName, tx } from './src/services/arabicCopy';
import { downloadSurahAudio, loadDownloads, downloadSurahText, estimateFreeBytes, formatBytes, pauseDownload, removeDownload, resolveAudioSource, resumeDownload, retryDownload, totalDownloadBytes, useDownloads } from './src/services/downloadService';
import { NAME_LANGUAGES } from './src/services/api';
import { PROPHETS } from './src/content/prophets';
import { NAMES_MEANING_AR } from './src/content/namesAr';
import { currentPhrase, dhikrMeaning, DHIKR_PHRASES, loadTasbihState, removeTasbihSession, resetTasbihCount, saveTasbihSession, setTasbihGoal, setTasbihPhrase, TASBIH_GOALS, tapTasbih, todayTotal, useTasbih } from './src/services/tasbihService';
import { Dua, DuaCategory } from './src/services/api';
import { clearPreparedQuran, getPreloadState, pauseQuranPreload, refreshPreload, resumeSavedQuranPreload, startQuranPreload, subscribePreload } from './src/services/quranPreload';

const SCENE_QURAN = require('./assets/quran-scene.png');
const SCENE_QURAN_DARK = require('./assets/quran-scene-dark.png');
const SCENE_MOSQUE = require('./assets/hero-mosque-scene.png');
const SCENE_MOSQUE_DARK = require('./assets/hero-mosque-scene-dark.png');
const PRAYER_CARD_SCENE = require('./assets/prayer-card-scene.png');
const PRAYER_CARD_SCENE_DARK = require('./assets/prayer-card-scene-dark.png');
const LOGO_MARK = require('./assets/logo-mark.png');
const LOGO_MARK_DARK = require('./assets/logo-mark-dark.png');

/** The light palette: warm parchment, indigo and gold. */
const C_LIGHT: Record<string, string> = {
  bg: '#F7F5F2', card: '#FFFDF9', ink: '#25233A', muted: '#6A6979',
  green: '#5146A4', green2: '#665AB4', deep: '#292744', teal: '#2F6F73',
  mint: '#F2EFF8', blue: '#F1F0F5', peach: '#F4F0EE', lilac: '#F2EFF6',
  yellow: '#F5F0E4', cyan: '#EEF3F2', gold: '#B49352', line: '#E7E2E5',
  coral: '#8B5960', white: '#FFFFFF',
  chevron: '#B9BEC9', onAccent: '#FFFFFF', onHero: '#FFE09B', accent: '#5146A4',
  link: '#0B7891', success: '#3A8A72', heroA: '#2A2849', heroB: '#5146A4'
};
/** The dark palette: the same hues, resting on a deep warm ink. */
const C_DARK: Record<string, string> = {
  bg: '#12111A', card: '#1B1926', ink: '#F1EDE6', muted: '#9C98AB',
  green: '#A79AEA', green2: '#BCAFE6', deep: '#0C0B12', teal: '#7EC0C3',
  mint: '#241F33', blue: '#1F1D2B', peach: '#2A2320', lilac: '#251F33',
  yellow: '#292518', cyan: '#1B2726', gold: '#D8BC80', line: '#2E2A3C',
  coral: '#D08F97', white: '#1B1926',
  chevron: '#7A768C', onAccent: '#F6F2EC', onHero: '#F3DCA8', accent: '#4B3F8F',
  link: '#67C7DE', success: '#6FC5A8', heroA: '#191531', heroB: '#4B3F8F'
};
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
const MINI_PLAYER_TOP = MINI_PLAYER_BOTTOM + MINI_PLAYER_H;
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
/** True while the dark palette is the one in use. */
let themeDark = false;
let shadow: any = { shadowColor: '#292750', shadowOffset: { width: 0, height: 10 }, shadowOpacity: .11, shadowRadius: 24, elevation: 5 };
let soft: any = { shadowColor: '#3B3568', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .07, shadowRadius: 14, elevation: 2 };


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
  ambient: { shadowColor: '#3B3568', shadowOffset: { width: 0, height: 8 }, shadowOpacity: .09, shadowRadius: 20, elevation: 3 },
  contact: { shadowColor: '#292750', shadowOffset: { width: 0, height: 1 }, shadowOpacity: .10, shadowRadius: 2, elevation: 1 },
  edge: 'rgba(255,255,255,.9)',
  veil: 'rgba(41,39,80,.035)'
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
 */
function darkHex(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  let l2: number;
  let s2: number;
  if (s >= 0.55 && l >= 0.75 && l < 0.9) { l2 = 0.82; s2 = s * 0.72; }        // gold and warm accents on dark cards
  else if (s < 0.2 && l >= 0.42 && l <= 0.78) { l2 = 0.68; s2 = s; }          // grey text
  else if (l >= 0.9) { l2 = 0.14; s2 = Math.min(s, 0.2); }                     // near-white surfaces
  else if (l >= 0.72) { l2 = 0.19; s2 = Math.min(s * 0.9, 0.24); }             // soft fills
  else if (l >= 0.55) { l2 = 0.24; s2 = Math.min(s * 0.9, 0.28); }             // fills and borders
  else if (l >= 0.3) { l2 = 0.66; s2 = Math.min(0.6, s * 1.05 + 0.04); }       // brand colours
  else { l2 = 0.86; s2 = Math.min(s, 0.3); }                                    // ink
  return hslToHex(h, s2, l2);
}

/**
 * The colours written literally into the style sheet. The ones that come from
 * `C` are already the right colour, so only these are moved onto the dark
 * palette.
 */
const LITERAL_HEXES: string[] = ['#111C18','#474653','#9AA0AC','#BFD9CF','#C2DED3','#C7C2E4','#C9E5DB','#CAE4DB','#CCEBDE','#CFC7EE','#D7CFFF','#D8D4EA','#D8D5E9','#D9D3F3','#D9D5EC','#DDD6FF','#DED7C9','#E1DCF7','#E2DEE8','#E2EEE8','#E3DEF7','#E4DEFA','#E4DFFA','#E4F2EC','#E5D4A6','#E6E2EB','#E8CFD5','#E9E1D5','#EAE6F0','#EAE7F1','#EDE5E4','#F0DCBE','#F0EDFF','#F2EFFF','#F5EFEE','#F7EDF0','#FBFCFB','#FF9A72','#FFE2A1','#FFE3A4','#FFF1DD','#FFFDF5','#FFFDF8'];

/** Writes the dark palette over the style sheet without touching its layout. */
function remapStyles(created: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  Object.keys(created).forEach((key) => {
    const style = created[key] || {};
    const next: Record<string, any> = {};
    Object.keys(style).forEach((prop) => {
      const value = (style as any)[prop];
      if (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) && LITERAL_HEXES.indexOf(value) >= 0) {
        next[prop] = prop === 'shadowColor' ? '#000000' : darkHex(value);
      } else {
        next[prop] = value;
      }
      // every surface goes dark with the palette, so every text colour has to come up with it
      if (prop === 'color' && typeof next[prop] === 'string' && /^#[0-9a-fA-F]{6}$/.test(next[prop])) {
        const [h, sat, l] = hexToHsl(next[prop]);
        if (l < 0.62) next[prop] = hslToHex(h, Math.min(sat, 0.35), 0.84);
      }
    });
    out[key] = next;
  });
  return out;
}

export type ThemeMode = 'system' | 'light' | 'dark';
type ThemeState = { mode: ThemeMode; dark: boolean; tick: number; setMode: (mode: ThemeMode) => void };
const THEME_KEY = 'deen-theme-v1';
const ThemeContext = createContext<ThemeState>({ mode: 'system', dark: false, tick: 0, setMode: () => {} });

async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
  } catch {
    return 'system';
  }
}

/** Puts one palette in place and rebuilds the style sheet from it. */
function applyPalette(dark: boolean) {
  themeDark = dark;
  const palette = dark ? C_DARK : C_LIGHT;
  Object.keys(palette).forEach((key) => { C[key] = palette[key]; });
  shadow = { ...shadow, shadowColor: dark ? '#000000' : '#292750', shadowOpacity: dark ? 0.5 : 0.11 };
  surface = { ...surface, borderTopColor: depth.edge, ...depth.ambient };
  soft = { ...soft, shadowColor: dark ? '#000000' : '#3B3568', shadowOpacity: dark ? 0.4 : 0.07 };
  /* On dark, shadows alone would disappear into the background, so the top
     edge carries the form: a faint light along the lip instead of a dark
     outline. */
  depth = {
    ambient: { ...depth.ambient, shadowColor: dark ? '#000000' : '#3B3568', shadowOpacity: dark ? 0.45 : 0.09 },
    contact: { ...depth.contact, shadowColor: dark ? '#000000' : '#292750', shadowOpacity: dark ? 0.5 : 0.10 },
    edge: dark ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.9)',
    veil: dark ? 'rgba(255,255,255,.05)' : 'rgba(41,39,80,.035)'
  };
  CARD_GREEN.backgroundColor = C.mint;
  CARD_GOLD.backgroundColor = C.peach;
  s = makeStyles();
  /* These two were built once at module load, which baked the light palette
     into them: they stayed white after everything else went dark. They have to
     be rebuilt with the rest. */
  hajjStyles = makeHajjStyles();
  consistency = makeConsistency();
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => { void loadThemeMode().then((next) => { setModeState(next); setHydrated(true); }); }, []);
  const dark = mode === 'system' ? system === 'dark' : mode === 'dark';
  // applied while rendering, so the first screen is already painted in it
  if (hydrated && themeDark !== dark) applyPalette(dark);
  useEffect(() => {
    if (!hydrated) return;
    if (themeDark !== dark) applyPalette(dark);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const paper = dark ? C_DARK.bg : C_LIGHT.bg;
      document.documentElement.style.background = paper;
      document.body.style.background = paper;
    }
    setTick((value) => value + 1);
  }, [dark, hydrated]);
  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
  };
  const value = useMemo(() => ({ mode, dark, setMode, tick }), [mode, dark, tick]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() { return useContext(ThemeContext); }

/** Keeps the navigation state across the remount that a theme change needs. */
// v2: Prayer became a tab and Settings left the tab bar for the header, so a
// state saved by v1 names routes that no longer exist.
const NAV_KEY = 'deen-nav-v2';
async function loadNavState(): Promise<any> {
  try {
    const raw = await AsyncStorage.getItem(NAV_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
function saveNavState(state: any) {
  if (state) AsyncStorage.setItem(NAV_KEY, JSON.stringify(state)).catch(() => undefined);
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
type QuranPreferencesState={preferences:QuranPreferences;hydrated:boolean;update:(patch:Partial<QuranPreferences>)=>Promise<void>};
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
type OverlayEntry = { key: string; render: () => React.ReactNode };
let overlayEntries: OverlayEntry[] = [];
const overlayListeners = new Set<() => void>();
function emitOverlay() { overlayListeners.forEach((fn) => fn()); }
function showOverlay(key: string, render: () => React.ReactNode) {
  overlayEntries = [...overlayEntries.filter((entry) => entry.key !== key), { key, render }];
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
function useOverlaySheet(key: string, active: boolean, render: () => React.ReactNode) {
  const latest = useRef(render);
  latest.current = render;
  useEffect(() => {
    if (!active) return;
    showOverlay(key, () => latest.current());
    return () => hideOverlay(key);
  }, [key, active]);
}

/* The same defaults the service uses, so the two cannot drift: this is only
   what is on screen until the stored preferences have been read. */
const DEFAULT_QURAN_PREFERENCES:QuranPreferences=DEFAULTS;
const QuranPreferencesContext=createContext<QuranPreferencesState>({preferences:DEFAULT_QURAN_PREFERENCES,hydrated:false,update:async()=>{}});
function QuranPreferencesProvider({children}:{children:React.ReactNode}){const[preferences,setPreferences]=useState(DEFAULT_QURAN_PREFERENCES);const[hydrated,setHydrated]=useState(false);useEffect(()=>{loadQuranPreferences().then(value=>{setPreferences(value);setHydrated(true)})},[]);const update=async(patch:Partial<QuranPreferences>)=>{const next={...preferences,...patch};setPreferences(next);await saveQuranPreferences(next)};return <QuranPreferencesContext.Provider value={{preferences,hydrated,update}}>{children}</QuranPreferencesContext.Provider>}
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
  const {rtl}=useLanguage();
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
type LanguageState={language:AppLanguage;rtl:boolean;ready:boolean;setLanguage:(language:AppLanguage)=>void};
const LanguageContext=createContext<LanguageState>({language:'en',rtl:false,ready:false,setLanguage:()=>{}});
/**
 * The interface language. Eleven are offered and three of them read right to
 * left. Only English and Arabic have finished interface copy, so the rest are
 * shown as they are and fall back to English until theirs is written.
 */
function LanguageProvider({children}:{children:React.ReactNode}){
  const[language,setLanguageState]=useState<AppLanguage>('en');
  const[ready,setReady]=useState(false);
  const rtl=isRtl(language);
  const setLanguage=(next:AppLanguage)=>{
    setLanguageState(next);
    void saveLanguage(next);
    const wantsRtl=isRtl(next);
    I18nManager.allowRTL(true);
    if(Platform.OS!=='web'&&I18nManager.isRTL!==wantsRtl)I18nManager.forceRTL(wantsRtl);
  };
  useEffect(()=>{void loadLanguage().then(saved=>{if(saved&&languageByCode(saved))setLanguageState(saved as AppLanguage);setReady(true)}).catch(()=>setReady(true))},[]);
  useEffect(()=>{
    // Dates follow the language only where the copy is finished; an English
    // interface with French dates would be a surprise.
    const dateLocale=language==='ar'?'ar-u-nu-latn':language==='en'?'en':undefined;
    setMoneyLocale(language);setFastingDateLocale(dateLocale);setActivityDateLocale(dateLocale);setJourneyDateLocale(dateLocale);
  },[language]);
  useEffect(()=>{if(Platform.OS==='web'&&typeof document!=='undefined'){document.documentElement.dir='ltr';document.documentElement.lang=language;document.documentElement.dataset.appDirection=rtl?'rtl':'ltr'}},[rtl,language]);
  return <LanguageContext.Provider value={{language,rtl,ready,setLanguage}}>{children}</LanguageContext.Provider>;
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
  Umrah:require('./assets/tool-icons/pilgrimage.png'),
  Hajj:require('./assets/tool-icons/pilgrimage.png'),
  'Holy site channels':require('./assets/tool-icons/holy-sites.png'),
  'ritual-ihram':require('./assets/tool-icons/ritual-ihram.png'),
  'ritual-tawaf':require('./assets/tool-icons/ritual-tawaf.png'),
  'ritual-sai':require('./assets/tool-icons/ritual-sai.png'),
  'ritual-arafat':require('./assets/tool-icons/ritual-arafat.png'),
  'ritual-jamarat':require('./assets/tool-icons/ritual-jamarat.png'),
  'ritual-mina':require('./assets/tool-icons/ritual-mina.png'),
  Duas:require('./assets/tool-icons/duas.png'),
  Tasbih:require('./assets/tool-icons/tasbih.png'),
  Hijri:require('./assets/tool-icons/hijri.png'),
  'Hijri calendar':require('./assets/tool-icons/hijri.png'),
  Ramadan:require('./assets/tool-icons/ramadan.png'),
  Hadith:require('./assets/tool-icons/hadith.png'),
  Names:require('./assets/tool-icons/names.png'),
  'Prophet Names':require('./assets/tool-icons/names.png'),
  'Adhkar':require('./assets/tool-icons/morning-adhkar.png'),
  '99 Names':require('./assets/tool-icons/names.png'),
  Zakat:require('./assets/tool-icons/zakat.png'),
  Fasting:require('./assets/tool-icons/fasting-tracker.png'),
  Mosques:require('./assets/tool-icons/mosques.png'),
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
  'Privacy lock':require('./assets/tool-icons/privacy-lock.png'),
  'Umrah Resources':require('./assets/tool-icons/pilgrimage.png'),
  'Hajj Live':require('./assets/tool-icons/hajj-live.png'),
  'Madinah Live':require('./assets/tool-icons/madinah-live.png'),
  'Makkah Live':require('./assets/tool-icons/holy-sites.png'),
  'Salah Tracker':require('./assets/tool-icons/prayer-fajr.png'),
  'Qada Fasts':require('./assets/tool-icons/qada-fasts.png'),
  'Cycle Tracker':require('./assets/tool-icons/cycle.png'),
  'Hijri Calendar':require('./assets/tool-icons/hijri.png'),
  'Prayer Reminders':require('./assets/tool-icons/prayer-reminders.png'),
  Istihada:require('./assets/tool-icons/istihada.png'),
  'Ramadan Planner':require('./assets/tool-icons/ramadan-planner.png'),
  'These Days':require('./assets/tool-icons/these-days.png')
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
  Umrah:require('./assets/tool-icons/pilgrimage-dark.png'),
  Hajj:require('./assets/tool-icons/pilgrimage-dark.png'),
  'Holy site channels':require('./assets/tool-icons/holy-sites-dark.png'),
  'ritual-ihram':require('./assets/tool-icons/ritual-ihram-dark.png'),
  'ritual-tawaf':require('./assets/tool-icons/ritual-tawaf-dark.png'),
  'ritual-sai':require('./assets/tool-icons/ritual-sai-dark.png'),
  'ritual-arafat':require('./assets/tool-icons/ritual-arafat-dark.png'),
  'ritual-jamarat':require('./assets/tool-icons/ritual-jamarat-dark.png'),
  'ritual-mina':require('./assets/tool-icons/ritual-mina-dark.png'),
  Duas:require('./assets/tool-icons/duas-dark.png'),
  Tasbih:require('./assets/tool-icons/tasbih-dark.png'),
  Hijri:require('./assets/tool-icons/hijri-dark.png'),
  'Hijri calendar':require('./assets/tool-icons/hijri-dark.png'),
  Ramadan:require('./assets/tool-icons/ramadan-dark.png'),
  Hadith:require('./assets/tool-icons/hadith-dark.png'),
  Names:require('./assets/tool-icons/names-dark.png'),
  'Prophet Names':require('./assets/tool-icons/names-dark.png'),
  'Adhkar':require('./assets/tool-icons/morning-adhkar-dark.png'),
  '99 Names':require('./assets/tool-icons/names-dark.png'),
  Zakat:require('./assets/tool-icons/zakat-dark.png'),
  Fasting:require('./assets/tool-icons/fasting-tracker-dark.png'),
  Mosques:require('./assets/tool-icons/mosques-dark.png'),
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
  'Privacy lock':require('./assets/tool-icons/privacy-lock-dark.png'),
  'Umrah Resources':require('./assets/tool-icons/pilgrimage-dark.png'),
  'Hajj Live':require('./assets/tool-icons/hajj-live-dark.png'),
  'Madinah Live':require('./assets/tool-icons/madinah-live-dark.png'),
  'Makkah Live':require('./assets/tool-icons/holy-sites-dark.png'),
  'Salah Tracker':require('./assets/tool-icons/prayer-fajr-dark.png')
};
function ToolGraphic({tool,size=58}:{tool:string;size?:number}){const{dark}=useTheme();const image=dark?(TOOL_IMAGES_DARK[tool]||TOOL_IMAGES[tool]):TOOL_IMAGES[tool];const enter=useRef(new Animated.Value(.78)).current;const fade=useRef(new Animated.Value(0)).current;useEffect(()=>{Animated.parallel([Animated.spring(enter,{toValue:1,friction:6,tension:75,useNativeDriver:true}),Animated.timing(fade,{toValue:1,duration:350,useNativeDriver:true})]).start()},[]);return <Animated.View accessibilityElementsHidden style={[s.graphicFrame,{width:size,height:size,opacity:fade,transform:[{scale:enter}]}]}>{image?<Image source={image} resizeMode="contain" style={{width:size-6,height:size-6}}/>:ico('sparkles-outline',size*.48,C.green)}</Animated.View>}
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
function DepthCard({ children, onPress, style, cardStyle, bodyStyle, radius = RADIUS.xl, index = 0, delay = 0, padded = true, testID }: any) {
  const press = usePressDepth();
  const enter = useEntrance(index, delay);
  return <Animated.View style={[style, { opacity: enter.opacity, transform: [{ translateY: enter.translateY }] }]}>
    <Animated.View style={[s.depthCard, cardStyle, { borderRadius: radius, transform: [{ scale: press.scale }, { translateY: press.lift }] }]}>
      <Pressable testID={testID} onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut}
        style={[s.depthBody, { borderRadius: radius }, padded && { padding: CARD.padding }, bodyStyle]}>
        {children}
      </Pressable>
      <Animated.View pointerEvents="none" style={[s.depthVeil, { borderRadius: radius, opacity: press.veil }]} />
    </Animated.View>
  </Animated.View>;
}

function MotionPress({ children, onPress, onLongPress, style, testID, accessibilityLabel }: { children: React.ReactNode; onPress?: () => void; onLongPress?: () => void; style?: any; testID?: string; accessibilityLabel?: string }) {
  const press = usePressDepth();
  return <Animated.View style={[style, { transform: [{ scale: press.scale }] }]}><Pressable testID={testID} accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityLabel?'button':undefined} onPress={onPress} onLongPress={onLongPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut}>{children}</Pressable></Animated.View>;
}

function Page({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions(); const {rtl}=useLanguage();
  const audio=useAudio();
  const playerInset = audio.track ? (Platform.OS==='ios'?96:MINI_PLAYER_INSET) : 0;
  return <SafeAreaView style={s.safe}><View style={[s.page,width > 700 && s.pageWide,{direction:rtl?'rtl':'ltr',paddingBottom:playerInset} as any]}>{children}</View></SafeAreaView>;
}
function Spinner() { const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <View style={s.loading}><ActivityIndicator color={C.green} /><Text style={s.loadingText}>{T('Loading live data…')}</Text></View>; }
function ErrorState({ message, retry }: { message: string; retry?: () => void }) { const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <View style={s.error}><View style={s.errorIcon}>{ico('cloud-offline-outline', 24, C.coral)}</View><Text style={s.errorTitle}>{T('Couldn’t load live data')}</Text><Text style={s.errorText}>{message}</Text>{retry && <Pressable onPress={retry} style={s.retry}><Text style={s.retryText}>{T('Try again')}</Text></Pressable>}</View>; }
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
 * glyph set, so the header matches the rest of the app. The theme action
 * shows a moon while you are in the light theme and a sun while you are in
 * the dark one - each in the variant drawn for the theme it appears against.
 */
const HEADER_LIGHT = {
  notifications: require('./assets/tool-icons/notifications.png'),
  theme: require('./assets/tool-icons/moon.png'),
  settings: require('./assets/tool-icons/tab-settings.png')
};
const HEADER_DARK = {
  notifications: require('./assets/tool-icons/notifications-dark.png'),
  theme: require('./assets/tool-icons/sunny-dark.png'),
  settings: require('./assets/tool-icons/tab-settings-dark.png')
};

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

function AppHeader() {
  const { rtl } = useLanguage();
  const { dark, setMode } = useTheme();
  const navigation = useNavigation<any>();
  const T = (text: string) => tx(rtl, text);
  /* Six screens wear this header, and some of them are reached by pushing
     onto a stack. Without this the only way out of those was the tab bar. */
  const canGoBack = useCanGoBack();
  return <View style={s.appHeader}>
    {canGoBack
      ? <IconButton name={rtl ? 'arrow-forward' : 'arrow-back'} onPress={() => navigation.goBack()} />
      : <View style={s.appHeaderBrand}>
        <Image source={dark ? LOGO_MARK_DARK : LOGO_MARK} resizeMode="contain" style={s.appLogo} />
        <Text style={s.appName} numberOfLines={1}>{T('Islamic')}</Text>
      </View>}
    <View style={s.appHeaderActions}>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Notifications')}
        onPress={() => navigation.navigate('Prayer', { screen: 'Notifications' })}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={dark ? HEADER_DARK.notifications : HEADER_LIGHT.notifications} resizeMode="contain" style={{ width: 21, height: 21 }} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={dark ? T('Show the light theme') : T('Show the dark theme')}
        onPress={() => setMode(dark ? 'light' : 'dark')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={dark ? HEADER_DARK.theme : HEADER_LIGHT.theme} resizeMode="contain" style={{ width: 21, height: 21 }} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Settings')}
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        <Image source={dark ? HEADER_DARK.settings : HEADER_LIGHT.settings} resizeMode="contain" style={{ width: 21, height: 21 }} />
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
function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {const{rtl}=useLanguage();return <View style={s.section}><Text style={s.h2}>{title}</Text>{action&&<Pressable onPress={onPress} style={s.sectionLink}><Text style={s.sectionAction}>{rtl?'←  ':''}{action}{rtl?'':'  →'}</Text></Pressable>}</View>}
function LiveBadge({ source }: { source: string }) {
  const { rtl } = useLanguage();
  return <View style={s.liveBadge}><View style={s.liveDot} /><Text style={s.liveText}>{rtl ? `مباشر · ${tx(rtl, source)}` : `LIVE · ${source}`}</Text></View>;
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
function LocationPrompt({compact=false}:{compact?:boolean}){const loc=useAppLocation();const navigation=useNavigation<any>();const{width}=useWindowDimensions();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[asked,setAsked]=useState(false);
useEffect(()=>{void loadOnboarding().then(value=>setAsked(!!value?.locationAsked)).catch(()=>setAsked(false))},[]);
const manual=()=>{navigation.navigate('Tools',{screen:'Location Setup',initial:false})};
if(asked)return <Pressable accessibilityRole="button" accessibilityLabel={T('Choose your prayer location')} onPress={manual} style={s.locationBanner}>
  <View style={s.locationBannerIcon}>{ico('location-outline',17,C.green)}</View>
  <View style={{flex:1}}>
    <Text style={s.locationBannerTitle}>{T('No location set')}</Text>
    <Text style={s.locationBannerBody}>{T('Prayer times, Qibla and fasting times read from one place. Tap to choose a city or enter coordinates.')}</Text>
  </View>
  {ico('arrow-forward',17,C.muted)}
</Pressable>;return <View style={[s.locationGate,width<370&&s.locationGateNarrow,compact&&{marginVertical: 12}]}><ToolGraphic tool="Location" size={54}/><View style={{flex:1,width:width<370?'100%':undefined}}><Text style={s.locationGateTitle}>{T('Choose your prayer location')}</Text><Text style={s.locationGateBody}>{T('Makkah is shown until you choose. Search for your city, or enter coordinates by hand.')}</Text><View style={[s.locationActions,width<370&&s.locationActionsNarrow]}><Pressable accessibilityLabel={T('Choose prayer location manually')} onPress={manual} style={s.primarySmall}><Text style={s.primaryText}>{T('Choose a city')}</Text></Pressable></View></View></View>}

function SlidingCards<T>({label,items,cardWidth,renderItem}:{label:string;items:T[];cardWidth:number;renderItem:(item:T,index:number,minHeight:number)=>React.ReactNode}){
  const ref=useRef<any>(null);const[active,setActive]=useState(0);const{rtl}=useLanguage();const stride=cardWidth+12;
  /* Cards in a strip are measured, then all of them settle at the tallest. A
     card that grows to fit its text would otherwise make the whole strip
     change height under your thumb as you swipe between them. */
  const heights=useRef<Record<number,number>>({});const[tallest,setTallest]=useState(0);
  const measure=(i:number)=>(event:any)=>{const h=Math.round(event?.nativeEvent?.layout?.height||0);if(!h||heights.current[i]===h)return;heights.current[i]=h;const t=Math.max(...Object.values(heights.current));if(t&&t!==tallest)setTallest(t)};
  const go=(index:number)=>{const next=Math.max(0,Math.min(items.length-1,index));setActive(next);ref.current?.scrollTo({x:next*stride,animated:true})};
  return <View accessible accessibilityLabel={`${label}، ${tx(rtl,'card')} ${active+1} ${tx(rtl,'of')} ${items.length}`}>
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} snapToInterval={stride} snapToAlignment="start" decelerationRate="fast" directionalLockEnabled contentContainerStyle={s.sliderContent} style={[{direction:'ltr'} as any, tallest?{height:tallest}:null]} onMomentumScrollEnd={(event:any)=>setActive(Math.max(0,Math.min(items.length-1,Math.round(event.nativeEvent.contentOffset.x/stride))))}>
      {items.map((item,index)=><View key={index} testID={`slider-card-${index}`} onLayout={measure(index)} style={[{width:cardWidth,direction:rtl?'rtl':'ltr'} as any, tallest?{minHeight:tallest}:null]}>{renderItem(item,index,tallest)}</View>)}
    </ScrollView>
    <View style={s.sliderControls}><Text style={s.sliderHint}>{active+1} / {items.length}{rtl ? ' · اسحب أو استخدم الأسهم' : ' · Swipe or use arrows'}</Text><View style={s.sliderButtons}><Pressable accessibilityLabel={`${tx(rtl,'Previous')} ${label}`} accessibilityState={{disabled:active===0}} disabled={active===0} onPress={()=>go(active-1)} style={[s.sliderButton,active===0&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-forward':'arrow-back',16,C.ink)}</Pressable><Pressable accessibilityLabel={`${tx(rtl,'Next')} ${label}`} accessibilityState={{disabled:active===items.length-1}} disabled={active===items.length-1} onPress={()=>go(active+1)} style={[s.sliderButton,active===items.length-1&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-back':'arrow-forward',16,C.ink)}</Pressable></View></View>
  </View>
}

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
  for (let ahead = 1; ahead <= REFLECTION_AHEAD_DAYS; ahead += 1) {
    const date = new Date(); date.setDate(date.getDate() + ahead);
    const key = dayKeyOf(date);
    try {
      const already = await loadDailyContent<DailyContentCache>(key);
      if (already?.ayah) continue;
      const [ayah, name, duas] = await Promise.all([
        getAyahForDate(date), loadNameOfDay().catch(() => null), getDuas('morning').catch(() => []),
      ]);
      await saveDailyContent(key, { ayah, hadith: null as any, name: name as any, dua: duas?.[0] });
    } catch {
      return; // offline, or one day failed - the rest will fill in next time
    }
  }
}

function useHomeData() {
  const {rtl}=useLanguage(); const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const dateKey=dayKeyOf(new Date());
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
        if(older){applyDaily(older);setCached(true)}else setError(tx(rtl,e.message||'Please check your connection.'))}
    }
  };
  useEffect(()=>{
    loadDailyContent<DailyContentCache>(dateKey).then(saved=>saved&&applyDaily(saved)).catch(()=>undefined);
    setSnapshot(null);
    if(location)load();
  },[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
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
  Isha: require('./assets/tool-icons/prayer-isha.png')
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
  Isha: require('./assets/tool-icons/prayer-isha-dark.png')
};
const prayerIconFor = (name: string, dark: boolean) => {
  const set = dark ? PRAYER_ICONS_DARK : PRAYER_ICONS;
  return set[name] || set.Fajr;
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
function HeroAura({ still }: { still: boolean }) {
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
            <Stop offset="0%" stopColor="#E7C07A" stopOpacity="0.5" />
            <Stop offset="55%" stopColor="#B49352" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#B49352" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="auraTeal" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#0B7891" stopOpacity="0.34" />
            <Stop offset="100%" stopColor="#0B7891" stopOpacity="0" />
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
            <Stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.32" />
            <Stop offset="100%" stopColor="#5146A4" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="100" cy="100" rx="92" ry="82" fill="url(#auraViolet)" />
      </Svg>
    </Animated.View>
  </View>;
}

function HomeScreen() {
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  const { dark } = useTheme();
  const [hour,setHour]=useState(new Date().getHours());const still=useCalmMotion();const scrollY=useRef(new Animated.Value(0)).current;const heroShift=scrollY.interpolate({inputRange:[0,300],outputRange:[0,54],extrapolate:'clamp'});const heroZoom=useDrift(30000,1,1.07,still);const sheenShift=useDrift(20000,-0.85,0.85,still);const greeting=T(hour<12?'A purposeful morning':hour<18?'A purposeful afternoon':'A peaceful evening'); const nav = useNavigation<any>(); const locationState=useAppLocation(); const { width } = useWindowDimensions(); const wide = width >= 760; const data = useHomeData(); const next = data.snapshot ? getNext(data.snapshot.prayers) : undefined; const dateKey=new Date().toISOString().slice(0,10); const[completed,setCompleted]=useState<string[]>([]);const[history,setHistory]=useState<Record<string,string[]>>({});const[quickCount,setQuickCount]=useState(0);const tasbih=useTasbih();const{preferences}=useQuranPreferences();
const[quranPosition,setQuranPosition]=useState<any>(null);const[openReflection,setOpenReflection]=useState<'ayah'|'name'|'dua'|null>(null);const[reportHadith,setReportHadith]=useState<any|null>(null);const[refreshing,setRefreshing]=useState(false);
  /* null while it is still arriving, empty if it never did. The card only
     appears once there is a real remembrance to put in it. */
  const[afterPrayer,setAfterPrayer]=useState<Dua[]|null>(null);
  useEffect(()=>{loadDuas('after-prayer').then(r=>setAfterPrayer(r.duas||[])).catch(()=>setAfterPrayer([]))},[]);
    useEffect(()=>{const t=setInterval(()=>setHour(new Date().getHours()),60000);return()=>clearInterval(t)},[]);
  const hydrateLocal=()=>Promise.all([loadPrayerCompletion(dateKey).then(setCompleted),loadPrayerHistory().then(setHistory),loadQuickTasbih().then(setQuickCount),loadReadingPosition().then(setQuranPosition)]);useEffect(()=>{hydrateLocal()},[dateKey]);useFocusEffect(useCallback(()=>{void hydrateLocal()},[]));const togglePrayer=(name:string)=>setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).then(()=>loadPrayerHistory().then(setHistory));return next});const addQuick=async()=>{await tapTasbih();haptic('count')};const onRefresh=async()=>{setRefreshing(true);await Promise.all([data.load(),hydrateLocal()]);setRefreshing(false)};const weekTotal=Object.entries(history).filter(([key])=>Date.now()-new Date(key).getTime()<7*86400000).reduce((sum,[,items])=>sum+items.length,0);let streak=0;for(let i=0;i<60;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if((history[key]||[]).length>=5)streak++;else if(i>0||completed.length<5)break}
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
  const { settings: worship, update: updateWorship } = useWorshipSettings();
  const dayTools = resolveDayTools(worship.dayTools);
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
  const morningTime = hour < 13;
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
  const [reflectionKind,setReflectionKind]=useState<'ayah'|'name'|'dua'>('ayah');
  const REFLECTION_TABS:{id:'ayah'|'name'|'dua';label:string}[]=[
    {id:'ayah',label:'Ayah'},{id:'name',label:'Name'},{id:'dua',label:'Dua'},
  ];
  /* Both of these are drawn by the overlay host, above the floating menu. */
  useOverlaySheet('home-hadith-report', !!reportHadith, () => reportHadith
    ? <CorrectionSheet target={{kind:'hadith',
        reference:`${hadithSourceLabel(rtl, reportHadith.collection)} · ${reportHadith.number}`,
        source:hadithSourceLabel(rtl, reportHadith.collection),
        arabic:stripTags(reportHadith.arabic||''), text:stripTags(reportHadith.text||'')}}
        rtl={rtl} T={T} appLanguage={rtl?'ar':'en'} onClose={()=>setReportHadith(null)}/>
    : null);
  useOverlaySheet('home-reflection', !!openReflection, () => openReflection
    ? <ReflectionDetail kind={openReflection} data={data} rtl={rtl} T={T}
        translationName={T(rtl?preferences.translationLanguage:preferences.translationName)}
        onClose={()=>setOpenReflection(null)}
        onOpenVerse={(verseKey:string,surahId:number,surahName:string)=>nav.navigate('Quran',{screen:'Reader',params:{chapter:{id:surahId,name_simple:surahName,name_arabic:'',verses_count:0},focusVerse:verseKey},initial:false})}/>
    : null);

  useOverlaySheet('home-day-tools', dayToolOpen, () => dayToolOpen
    ? <DayToolSheet initialSlot={dayToolSlot} chosen={dayTools} rtl={rtl} T={T}
        onReplace={replaceDayTool}
        onClose={()=>{setDayToolOpen(false);setDayToolSlot(null)}}
        onSeeAll={()=>{setDayToolOpen(false);nav.navigate('Tools')}}/>
    : null);
  return <Page><Animated.ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:false})} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green}/>}>
    <AppHeader/>
    <View style={s.greeting}><View><Text style={s.salam}>السَّلَامُ عَلَيْكُمْ</Text><Text style={s.greetingTitle}>{greeting}</Text></View></View>
    {!data.location?<LocationPrompt/>:data.error && !data.snapshot ? <ErrorState message={data.error} retry={data.load} /> : <>
      <View style={[s.hero,wide&&s.heroWide]}><Animated.View style={[StyleSheet.absoluteFill,{transform:[{translateY:heroShift},{scale:heroZoom}]}]}><Image source={(dark?SCENE_MOSQUE_DARK:SCENE_MOSQUE)} resizeMode="cover" style={s.heroBg}/></Animated.View>
        <LinearGradient colors={['rgba(30,30,63,.92)','rgba(56,48,103,.54)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} /> <HeroAura still={still}/> <Animated.View pointerEvents="none" style={[s.heroSheen,{transform:[{translateX:Animated.multiply(sheenShift,width)},{skewX:'-16deg'}]}]}><LinearGradient colors={['rgba(255,255,255,0)','rgba(255,255,255,.16)','rgba(255,255,255,0)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/></Animated.View> 
        <Pressable onPress={locationState.clear} style={s.locationPill}>{ico('location',13,C.onHero)}<Text numberOfLines={1} style={s.locationText}>{T(data.location?.label || '')}</Text></Pressable>
        <Text style={s.hijri}>{(rtl ? data.snapshot?.hijriAr || data.snapshot?.hijri : data.snapshot?.hijri) || T('Loading Hijri date…')} · {new Date().toLocaleDateString(rtl ? 'ar-u-nu-latn' : undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{data.cached ? (rtl ? ' · مخزَّن' : ' · CACHED') : ''}</Text>
        <Text style={s.nextLabel}>{rtl ? 'التالي · ' : 'NEXT · '}{next ? prayerName(rtl, next.name) : '—'}</Text><Text style={s.heroTime}>{next?.time || '—'}</Text>
        <View style={s.heroFooter}><View style={s.countPill}>{ico('time-outline',14,C.white)}<Text style={s.countText}>{rtl ? 'بعد ' : 'in '}{next ? <HeroCountdown raw={next.raw} rtl={rtl}/> : '—'}</Text></View><Pressable onPress={()=>nav.navigate('Prayer')} style={s.heroCta}><Text style={s.heroCtaText}>{T('Prayer schedule')}</Text>{ico('arrow-forward',15,C.white)}</Pressable></View>
      </View>
      <View style={s.prayerRail}>{data.snapshot?.prayers.filter(p=>p.name!=='Sunrise').map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole="checkbox" accessibilityState={{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.railItem,p.name===next?.name&&s.railItemActive]}><View style={[s.railIcon,checked&&s.railIconDone]}><Image source={prayerIconFor(p.name, dark)} resizeMode="contain" style={{width:26,height:26,opacity:checked?1:.7}}/>{!!checked && <View style={s.railCheck}>{ico('checkmark',10,C.white)}</View>}</View><Text style={s.railName}>{prayerName(rtl, p.name)}</Text><Text style={s.railTime}>{p.time.replace(' ','\n')}</Text></Pressable>})}</View><View style={s.homeProgress}><View><Text style={s.sourceTitle}>{completed.length}/5 {rtl ? 'صلاة اليوم' : 'prayers today'}</Text><Text style={s.sourceBody}>{rtl ? `${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')} · ${weekTotal}/35 هذا الأسبوع` : `${streak} day streak · ${weekTotal}/35 this week`}</Text></View><View style={s.homeProgressRing}><Text style={s.progressCount}>{completed.length*20}%</Text></View></View>
    </>}
    <Section title={T('Adhkar')} action={T('All duas')} onPress={()=>nav.navigate('Library',{screen:'Duas',initial:false})} />
    {afterPrayer === null && <View style={[s.adhkarDuaCard, s.adhkarDuaPad]}><Spinner /></View>}
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
              <ToolGraphic tool="Duas" size={46} />
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
      <MotionPress key={tool.id}
        accessibilityLabel={tool.id==='quick-tasbih'?`${T('Quick Tasbih')} ${todayTotal(tasbih)}. ${T('Tap to count')}`:T(tool.label)}
        onPress={()=>{ if(tool.id==='quick-tasbih'){ void addQuick(); return; } tool.open?.(nav); }}
        onLongPress={()=>{setDayToolSlot(index);setDayToolOpen(true)}}
        style={s.roundItem}>
        <View style={s.roundIcon}><ToolGraphic tool={tool.icon} size={34}/></View>
        <Text style={s.roundLabel} numberOfLines={2}>{T(tool.label)}</Text>
      </MotionPress>
    ))}</View>

    <Section title={T('Daily reflection')} action={T('Refresh')} onPress={onRefresh}/>
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
      <View style={s.homeReflectFoot}><Text style={s.homeReflectFootText}>{T('Read the full reflection')}</Text>{ico('arrow-forward',15,C.green)}</View>
    </Pressable>
    <DepthCard index={0} radius={RADIUS.xl} style={s.weekWrap} cardStyle={s.weekSurface}
      bodyStyle={s.weekBody}
      onPress={()=>nav.navigate('Tools',{screen:'Weekly Summary',initial:false})}>
      <View style={s.weekTop}>
        <View style={{flex:1}}>
          <Text style={s.weekSummaryTitle}>{T('This week')}</Text>
          <Text style={s.weekSummaryBody}>{rtl ? `${weekTotal} من 35 صلاة مؤداة · ${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')}` : `${weekTotal} of 35 prayers marked · ${streak} day streak`}</Text>
        </View>
        {ico('arrow-forward',18,C.white)}
      </View>
      <View style={s.homeWeekRow}>{weekDays.map(day=>(
        <View key={day.key} style={s.homeWeekCol}>
          <View style={s.homeWeekTrack}>
            <View style={[s.homeWeekBar,{height:weekBarHeight(day.count),backgroundColor:day.isToday?C.gold:'rgba(231,192,122,.55)'}]}/>
          </View>
          <Text style={[s.homeWeekDay,day.isToday&&s.homeWeekDayOn]}>{day.label}</Text>
        </View>
      ))}</View>
    </DepthCard>
    <Section title={T('Continue reading')} action={T('Open Quran')} onPress={()=>nav.navigate('Quran')} />
    <DepthCard index={0} radius={28} padded={false} style={s.readWrap} cardStyle={s.readSurface} bodyStyle={s.readPad}
      onPress={()=>nav.navigate('Quran')}>
      <Image source={(dark?SCENE_QURAN_DARK:SCENE_QURAN)} resizeMode="cover" style={s.heroBg}/>
      <LinearGradient colors={['rgba(39,34,82,.95)','rgba(76,58,130,.55)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} />
      <Text style={s.readKicker}>{T(quranPosition ? 'CONTINUE READING' : 'FEATURED READING')}</Text><Text style={s.readArabic}>{quranPosition?'۝':'يس'}</Text><Text style={s.readTitle}>{quranPosition ? quranPosition.surahName : T('Surah Ya-Sin')}</Text><Text style={s.readMeta}>{quranPosition ? `${quranPosition.verseKey} · ${rtl ? 'صفحة' : 'Page'} ${quranPosition.page || '—'}` : (rtl ? '83 آية · مكية' : '83 verses · Makkan')}</Text><Pressable onPress={()=>nav.navigate('Quran',{screen:'Reader',params:{chapter:quranPosition?{id:quranPosition.surahId,name_simple:quranPosition.surahName,name_arabic:'',verses_count:0}:{id:36,name_simple:'Ya-Sin',name_arabic:'يس',verses_count:83},focusVerse:quranPosition?.verseKey},initial:false})} style={s.whiteButton}><Text style={s.whiteButtonText}>{T(quranPosition ? 'Continue' : 'Read now')}</Text>{ico('arrow-forward',14,C.green)}</Pressable>
    </DepthCard>
    <Section title={T('Hadith of the day')} />
    <View style={[s.depthCard,s.hadithSurface,{borderRadius:RADIUS.xl}]}><Text style={s.quote}>“</Text><Text numberOfLines={6} style={s.hadithText}>{data.hadith ? (rtl && data.hadith.arabic ? stripTags(data.hadith.arabic) : data.hadith.text) : T('Loading today’s authenticated hadith…')}</Text><View style={s.hadithFoot}><Text style={s.meta}>{data.hadith ? `${hadithSourceLabel(rtl, data.hadith.collection)} · ${data.hadith.number}` : ''}</Text>{!!data.hadith&&<Pressable accessibilityRole="button" accessibilityLabel={T('Report a correction in this hadith')} onPress={()=>{const h=data.hadith;if(h)setReportHadith({collection:h.collection,number:h.number,arabic:h.arabic,text:h.text})}} hitSlop={10}>{ico('flag-outline',18,C.muted)}</Pressable>}</View></View>
  </Animated.ScrollView>
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
    { title: 'Salah Tracker', caption: 'The five prayers, and the run you are on', route: 'Prayer' },
    { title: 'Fasting', caption: 'Ramadan, voluntary and missed fasts', route: 'Fasting' },
    { title: 'Zakat', caption: 'Gold, silver, cash and investments', route: 'Zakat' },
    { title: 'Tasbih', caption: 'A quiet, tactile dhikr counter', route: 'Tasbih' },
    { title: 'Weekly Summary', caption: 'Your past seven days at a glance', route: 'Weekly Summary' },
  ]},
  { label: 'FIND', title: 'Utilities and location', items: [
    { title: 'Qibla', caption: 'Direction to the Ka‘bah', route: 'Qibla' },
    { title: 'Mosques', caption: 'Nearby prayer spaces, with directions', route: 'Mosques' },
    { title: 'Location', caption: 'Search for a city, or set coordinates', route: 'Location Setup' },
    { title: 'Hijri Calendar', caption: 'Islamic dates and the month grid', route: 'Hijri Calendar' },
    { title: 'Prayer Reminders', caption: 'Adhan alerts and their toggles', route: 'Notifications' },
    { title: 'Umrah Resources', caption: 'A packing checklist you can tick off', route: 'Umrah Packing' },
  ]},
  { label: 'WATCH', title: 'Live broadcasts', items: [
    { title: 'Makkah Live', caption: 'Al-Masjid al-Haram, around the clock', route: 'Holy site channels', params: { site: 'Makkah' } },
    { title: 'Madinah Live', caption: 'Al-Masjid an-Nabawi, around the clock', route: 'Holy site channels', params: { site: 'Madinah' } },
    { title: 'Hajj Live', caption: 'The days of Hajj, and the countdown to Arafah', route: 'Hajj Live' },
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
    open: (n) => n.navigate('Library', { screen: 'Quran Vocabulary', initial: false }) },
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
  { id: 'memorize', label: 'Memorize', icon: 'Hifz',
    open: (n) => n.navigate('Quran', { screen: 'Memorize', initial: false }) },
  { id: 'fasting', label: 'Fasting', icon: 'Fasting',
    open: (n) => n.navigate('Tools', { screen: 'Fasting', initial: false }) },
  { id: 'zakat', label: 'Zakat', icon: 'Zakat',
    open: (n) => n.navigate('Tools', { screen: 'Zakat', initial: false }) },
  { id: 'qada', label: 'Qada Fasts', icon: 'Qada Fasts',
    open: (n) => n.navigate('Tools', { screen: 'Qada', initial: false }) },
  { id: 'hijri', label: 'Hijri Calendar', icon: 'Hijri Calendar',
    open: (n) => n.navigate('Tools', { screen: 'Hijri Calendar', initial: false }) },
  { id: 'mosques', label: 'Mosques', icon: 'Mosques',
    open: (n) => n.navigate('Tools', { screen: 'Mosques', initial: false }) },
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
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
            <View style={s.dayToolIcon}><ToolGraphic tool={tool.icon} size={34} /></View>
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
            <View style={s.dayToolIcon}><ToolGraphic tool={tool.icon} size={34} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T(tool.label)}</Text>
              <Text style={s.meta}>{T(isCurrent ? 'Already here' : tool.open ? 'Opens a screen' : 'Counts where it stands')}</Text>
            </View>
            {ico(isCurrent ? 'checkmark-circle' : 'ellipse-outline', 20, isCurrent ? C.green : C.muted)}
          </Pressable>;
        })}

        {replacing === null && (
          <Pressable accessibilityRole="button" accessibilityLabel={T('See all tools')} onPress={onSeeAll} style={s.secondary}>
            <Text style={s.secondaryText}>{T('See all tools')}</Text>
          </Pressable>
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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Pilgrimage" size={74} />
      <Text style={s.dataTitle}>{T('What to take')}</Text>
      <Text style={s.intro}>{T('A list you can tick off, kept on this device. While you are in ihram, anything with perfume in it is best left at home.')}</Text>
      <View style={s.packingHead}>
        <Text style={s.packingCount}>{`${done} / ${total}`}</Text>
        <View style={s.packingTrack}><View style={[s.packingFill, { width: `${percent}%` }]} /></View>
        <Text style={s.packingPct}>{`${percent}%`}</Text>
      </View>
      {!!done && <Pressable accessibilityRole="button" accessibilityLabel={T('Clear the list')} onPress={clear} style={s.secondary}>
        <Text style={s.secondaryText}>{T('Clear the list')}</Text>
      </Pressable>}
      {PACKING_GROUPS.map((group) => <View key={group.title} style={s.packingGroup}>
        <Text style={s.packingGroupTitle}>{T(group.title)}</Text>
        {group.items.map((item) => {
          const checked = packed.includes(item);
          return <Pressable key={item} onPress={() => toggle(item)} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={T(item)} style={s.packingRow}>
            <View style={[s.packingBox, checked && s.packingBoxOn]}>{checked && ico('checkmark', 14, C.onAccent)}</View>
            <Text style={[s.packingItem, checked && s.packingItemOn]}>{T(item)}</Text>
          </Pressable>;
        })}
      </View>)}
    </ScrollView></Page>;
}

/**
 * The days of Hajj, in order. Everything here is fixed by the Sunnah rather
 * than by us: 8 to 13 Dhul-Hijjah, and Arafah is the day the pilgrimage
 * stands on — the Prophet ﷺ said Hajj is Arafah.
 */
const HAJJ_DAYS: { day: string; name: string; place: string; note: string; steps: string[] }[] = [
  { day: '8', name: 'Yawm at-Tarwiyah', place: 'Mina', note: 'The day of preparing', steps: [
    'Enter ihram where you are and make the intention for Hajj',
    'Begin the Talbiyah and keep it going until the stoning on the 10th',
    'Travel to Mina and pray Dhuhr, Asr, Maghrib and Isha there',
    'Spend the night in Mina',
  ]},
  { day: '9', name: 'Yawm al-Arafah', place: 'Arafah, then Muzdalifah', note: 'Hajj itself', steps: [
    'Pray Fajr in Mina, then head for Arafah after sunrise',
    'Hear the khutbah at Namirah, then pray Dhuhr and Asr together, shortened',
    'Stand in supplication from noon to sunset — this is the pillar of Hajj',
    'Leave for Muzdalifah after sunset without praying Maghrib at Arafah',
    'Pray Maghrib and Isha together in Muzdalifah and sleep under the sky',
  ]},
  { day: '10', name: 'Yawm an-Nahr', place: 'Mina, then Makkah', note: 'Eid al-Adha', steps: [
    'Pray Fajr in Muzdalifah and gather your pebbles',
    'Stone Jamarat al-Aqabah with seven pebbles, saying Allahu Akbar each time',
    'Offer the sacrifice',
    'Shave the head or trim the hair — shaving is better for men',
    'Tawaf al-Ifadah and Sa’i back in Makkah',
  ]},
  { day: '11', name: 'First day of Tashriq', place: 'Mina', note: 'All three jamarat', steps: [
    'After midday, stone the small, then the middle, then the large jamarah',
    'Seven pebbles each — twenty-one for the day',
    'Fill the rest of the day with dhikr, Qur’an and rest',
  ]},
  { day: '12', name: 'Second day of Tashriq', place: 'Mina', note: 'Most pilgrims leave today', steps: [
    'Stone all three jamarat again after midday',
    'You may leave Mina before sunset once every rite is done',
    'Stay another night only if you intend to stone on the 13th',
  ]},
  { day: '13', name: 'Last day of Tashriq', place: 'Mina', note: 'For those who stayed', steps: [
    'Stone all three jamarat after midday',
    'Leave Mina for Makkah once the stoning is finished',
    'Tawaf al-Wada, the farewell tawaf, before you leave Makkah',
  ]},
];

function makeHajjStyles() { return StyleSheet.create({

  /* Reserves the floating tab bar. This screen carries its own stylesheet, so
     it does not pick up the shared screen padding and has to leave the room
     itself - measured, 40px left the last of the page behind the bar. */
  wrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: BOTTOM_RESERVE },
  hero: { borderRadius: 26, padding: 22, marginBottom: 18, overflow: 'hidden' },
  overline: { color: 'rgba(255,255,255,.72)', fontSize: 10, fontFamily: 'DMSans_600SemiBold', letterSpacing: 1.2, marginBottom: 10 },
  countRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
  count: { color: C.white, fontSize: 62, fontFamily: 'Newsreader_600SemiBold', letterSpacing: -2, lineHeight: 64 },
  countUnit: { color: 'rgba(255,255,255,.8)', fontSize: 15, fontFamily: 'DMSans_600SemiBold', marginBottom: 12, marginStart: 10 },
  until: { color: C.white, fontSize: 17, fontFamily: 'DMSans_600SemiBold', marginBottom: 14 },
  meta: { color: 'rgba(255,255,255,.75)', fontSize: 12.5, fontFamily: 'DMSans_400Regular', lineHeight: 19 },
  sectionTitle: { color: C.ink, fontSize: 18, fontFamily: 'Newsreader_600SemiBold', letterSpacing: -.3, marginBottom: 4, marginTop: 8 },
  sectionNote: { color: C.muted, fontSize: 12.5, fontFamily: 'DMSans_400Regular', lineHeight: 19, marginBottom: 14 },
  dayCard: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.line },
  dayTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dayBadge: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.heroA, alignItems: 'center', justifyContent: 'center', marginEnd: 12 },
  dayNum: { color: C.white, fontSize: 16, fontFamily: 'DMSans_700Bold' },
  dayName: { color: C.ink, fontSize: 15.5, fontFamily: 'DMSans_600SemiBold', letterSpacing: -.2 },
  dayPlace: { color: C.green, fontSize: 11.5, fontFamily: 'DMSans_600SemiBold', marginTop: 2 },
  dayNote: { marginStart: 'auto', backgroundColor: C.mint, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  dayNoteText: { color: C.green, fontSize: 10.5, fontFamily: 'DMSans_600SemiBold' },
  step: { flexDirection: 'row', marginBottom: 7 },
  bullet: { color: C.green, fontSize: 13, lineHeight: 19, marginEnd: 8, marginTop: 1 },
  stepText: { flex: 1, color: C.body, fontSize: 13, fontFamily: 'DMSans_400Regular', lineHeight: 19 },
  note: { backgroundColor: C.mint, borderRadius: 16, padding: 14, marginTop: 6, marginBottom: 18 },
  noteText: { color: C.body, fontSize: 12.5, fontFamily: 'DMSans_400Regular', lineHeight: 19 },
  action: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.heroA, borderRadius: 18, padding: 15, marginBottom: 10 },
  actionText: { flex: 1, color: C.white, fontSize: 14, fontFamily: 'DMSans_600SemiBold' },
  actionSub: { color: 'rgba(255,255,255,.7)', fontSize: 11.5, fontFamily: 'DMSans_400Regular', marginTop: 2 }

});}
let hajjStyles: Record<string, any> = makeHajjStyles();


function HajjLiveScreen({ navigation }: any) {
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  const [count, setCount] = useState<HajjCountdown | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try { setCount(await getHajjCountdown()); }
    catch (e: any) { setError(e?.message || T('Could not reach the calendar')); }
  }, [T]);
  useEffect(() => { load(); }, [load]);
  const st = hajjStyles;

  return (
    <Page>
      <ScrollView contentContainerStyle={st.wrap} showsVerticalScrollIndicator={false}>
        <AppHeader />
        {!!error && <ErrorState message={error} retry={load} />}
        {!error && !count && <Spinner />}
        {!!count && (
          <LinearGradient colors={[C.heroA, C.green]} style={st.hero}>
            <Text style={st.overline}>{T(`HAJJ ${count.hijriYear} AH`)}</Text>
            <View style={st.countRow}>
              <Text style={st.count}>{count.daysToArafah}</Text>
              <Text style={st.countUnit}>{count.daysToArafah === 1 ? T('day') : T('days')}</Text>
            </View>
            <Text style={st.until}>{T('until Arafah, 9 Dhul-Hijjah')}</Text>
            <Text style={st.meta}>{count.arafahGregorian}</Text>
            <Text style={st.meta}>{T('Today')} · {count.todayHijri}</Text>
          </LinearGradient>
        )}

        <Text style={st.sectionTitle}>{T('The six days')}</Text>
        <Text style={st.sectionNote}>{T('What happens on each day of Hajj, from entering ihram to the farewell tawaf.')}</Text>
        {HAJJ_DAYS.map((d, i) => (
          <RiseIn key={d.day} delay={i * 45}>
            <View style={st.dayCard}>
              <View style={st.dayTop}>
                <View style={st.dayBadge}><Text style={st.dayNum}>{d.day}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.dayName}>{T(d.name)}</Text>
                  <Text style={st.dayPlace}>{T(d.place)}</Text>
                </View>
                <View style={st.dayNote}><Text style={st.dayNoteText}>{T(d.note)}</Text></View>
              </View>
              {d.steps.map((step) => (
                <View style={st.step} key={step}>
                  <Text style={st.bullet}>›</Text>
                  <Text style={st.stepText}>{T(step)}</Text>
                </View>
              ))}
            </View>
          </RiseIn>
        ))}

        <View style={st.note}>
          <Text style={st.noteText}>{T('Fasting on the day of Arafah expiates the sins of the year before it and the year after it. It is for those not standing at Arafah — the pilgrim does not fast that day.')}</Text>
        </View>

        <MotionPress style={st.action} onPress={() => navigation.navigate('Tools',{screen:'Holy site channels',params:{site:'Hajj'},initial:false})}>
          <View style={{ flex: 1 }}>
            <Text style={st.actionText}>{T('Hajj broadcast')}</Text>
            <Text style={st.actionSub}>{T('The Ministry of Hajj and Umrah channel — live during the days of Hajj')}</Text>
          </View>
          {ico('chevron-right', 18, 'rgba(255,255,255,.8)')}
        </MotionPress>
      </ScrollView>
    </Page>
  );
}

function ToolsHomeScreen({ navigation }: any) {
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <AppHeader/>
      <Text style={s.dataTitle}>{T('Tools')}</Text>
      <Text style={s.dataArabic}>أَدَوَاتٌ لِلْعِبَادَةِ</Text>
      <Text style={s.dataBody}>{T('What you work out, look up, keep track of, or watch — apart from the flow of the day.')}</Text>
      {TOOL_GROUPS.filter((group) => group.when !== 'womens' || womens.optedIn).map((group) => <View key={group.label}>
        <Text style={s.libraryKicker}>{T(group.label)}</Text>
        <Text style={s.libraryHeading}>{T(group.title)}</Text>
        <View style={s.exploreGrid}>{shown(group).map((item) => <MotionPress key={item.title} onPress={() => navigation.navigate(item.route, item.params)} style={s.exploreCard}>
          <View style={s.exploreCardInner}>
            <ToolGraphic tool={item.title} size={64} />
            <Text style={s.exploreTitle}>{T(item.title)}</Text>
            <Text style={s.exploreBody}>{T(item.caption)}</Text>
            <View style={s.exploreArrow}>{ico('arrow-forward', 15, C.green)}</View>
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
function HeroCountdown({ raw, rtl }: { raw: string; rtl: boolean }) {
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
  return <>{rtl ? `${hh} س ${mm} د ${pad(ss)} ث` : `${hh}h ${mm}m ${pad(ss)}s`}</>;
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
  const {rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const [snap,setSnap]=useState<PrayerSnapshot|null>(null); const [cached,setCached]=useState(false); const [error,setError]=useState(''); const [completed,setCompleted]=useState<string[]>([]);
  const dateKey=new Date().toISOString().slice(0,10); useEffect(()=>{loadPrayerCompletion(dateKey).then(setCompleted)},[dateKey]);
  const [history,setHistory]=useState<Record<string,string[]>>({}); useEffect(()=>{loadPrayerHistory().then(h=>setHistory(h||{}))},[completed]);
  /* The next-prayer card carries the same slow drift and passing highlight as
     the Home hero, so the two read as the same app. `still` parks both when
     reduced motion is on, and the scene is drawn twice - once for light, once
     for dark - rather than dimming one picture to serve both. */
  const {dark}=useTheme(); const still=useCalmMotion();
  const prayerZoom=useDrift(30000,1,1.07,still); const prayerSheen=useDrift(20000,-0.85,0.85,still);
  const {width:prayerW}=useWindowDimensions();
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
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/><View style={s.prayerHeader}><View><Text style={s.prayerOverline}>{cached?T('SAVED ON DEVICE'):T('TODAY')}</Text><Text style={s.prayerTitle}>{T('Prayer times')}</Text></View><ToolGraphic tool="Qibla" size={46}/></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayStripScroll}><View style={s.dayStrip}>{days.map((d,i)=><Pressable key={i} accessibilityRole="button" accessibilityState={{selected:i===dayIndex}} accessibilityLabel={`${d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'long'})} ${d.getDate()}`} onPress={()=>setDayIndex(i)} style={[s.day,i===dayIndex&&s.dayActive]}><Text style={[s.dayName,i===dayIndex&&s.dayText]}>{d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'short'})}</Text><Text style={[s.dayNum,i===dayIndex&&s.dayText]}>{d.getDate()}</Text>{!calendar.length&&i>0&&<View style={s.dayDot}/>}</Pressable>)}</View></ScrollView>
    {!!chosenDay && dayIndex>0 && <Text style={s.dayChosen}>{rtl?`${chosenDay.hijriDay} ${chosenDay.hijriMonthAr||chosenDay.hijriMonth} ${chosenDay.hijriYear} هـ`:`${chosenDay.weekday} ${chosenDay.gregorian} · ${chosenDay.hijriDay} ${chosenDay.hijriMonth} ${chosenDay.hijriYear} AH`}</Text>}
    {!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!snap?<Spinner/>:<><View style={s.nextCard}><Animated.View style={[StyleSheet.absoluteFill,{transform:[{scale:prayerZoom}]}]}><Image source={(dark?PRAYER_CARD_SCENE_DARK:PRAYER_CARD_SCENE)} resizeMode="cover" style={s.heroBg}/></Animated.View>{/* A scrim rather than a flat fill: the artwork shows through on the right and settles to near-solid behind the text on the left. */}<LinearGradient colors={['rgba(13,11,26,.95)','rgba(37,31,79,.74)','rgba(75,63,143,.26)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><HeroAura still={still}/><Animated.View pointerEvents="none" style={[s.heroSheen,{transform:[{translateX:Animated.multiply(prayerSheen,prayerW)},{skewX:'-16deg'}]}]}><LinearGradient colors={['rgba(255,255,255,0)','rgba(255,255,255,.16)','rgba(255,255,255,0)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/></Animated.View><View style={s.nextCardBody}>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.nextCardLabel}>{T('NEXT PRAYER')}</Text><Text style={s.nextCardName}>{next ? prayerName(rtl, next.name) : ''}</Text><Text style={s.nextCardTime}>{clockTime(rtl, next?.time || '')}</Text><View style={s.countPill}><Text style={s.countText}>{T('Begins in')} {next ? <PrayerCountdown raw={next.raw}/> : ''}</Text></View></View></View>
      <View style={s.prayerProgress}><View style={{flex:1}}><Text style={s.sourceTitle}>{T('Today’s Salah')}</Text><Text style={s.sourceBody}>{rtl?`${done} من 5 صلوات مؤداة`:`${done} of 5 prayers marked complete`}</Text></View><View style={s.progressTrack}><View style={[s.progressFill,{width:`${done*20}%`} as any]}/></View><Text style={s.progressCount}>{done}/5</Text></View>
      <Section title={T('Your consistency')}/>
      <PrayerConsistency history={history} T={T}/>
      <Section title={T('Today’s schedule')} action={rtl?`${PRAYER_METHODS.find(m=>m.id===settings.calculationMethod)?.ar||settings.calculationMethodName} · ${settings.madhab==='hanafi'?'الحنفي':'الشافعي'}`:`${settings.calculationMethodName} · ${T(settings.madhab==='hanafi'?'Hanafi':'Shafi')}`} onPress={()=>navigation.navigate('Settings')} />
      <View style={s.prayerList}>{listedPrayers.map((p,i)=>{const checked=listingToday&&completed.includes(p.name);return <Pressable accessibilityRole={!listingToday||p.name==='Sunrise'?undefined:'checkbox'} accessibilityState={!listingToday||p.name==='Sunrise'?undefined:{checked}} onPress={()=>listingToday&&togglePrayer(p.name)} key={p.name} style={[s.prayerRow,p.name===next?.name&&s.prayerRowLive]}><View style={[s.prayerSymbol,checked&&s.prayerSymbolDone]}>{checked ? ico('checkmark',21,C.white) : p.name === 'Sunrise' ? ico('sunny-outline',21,C.green) : <Image source={prayerIconFor(p.name, dark)} resizeMode="contain" style={{width:23,height:23}}/>}</View><View style={{flex:1}}><Text style={s.prayerName}>{prayerName(rtl, p.name)}</Text><Text style={s.meta}>{T(p.name==='Sunrise'?'Solar event':checked?'Completed':!listingToday?'':p.name===next?.name?'Up next':'Tap to mark complete')}</Text></View><Text style={s.prayerValue}>{clockTime(rtl, p.time)}</Text>{p.name!=='Sunrise'&&ico(checked?'checkmark-circle':'ellipse-outline',18,checked?C.green:C.muted)}</Pressable>})}</View>
      <View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T(cached?'Saved prayer schedule':'Live calculation')}</Text><Text style={s.sourceBody}>{rtl?`${PRAYER_METHODS.find(m=>m.id===settings.calculationMethod)?.ar||snap.method} · ${snap.timezone} · ${settings.timeFormat} ساعة`:`${snap.method} · ${snap.timezone} · ${settings.timeFormat}-hour`}</Text></View></View><Section title={T('More in Prayer')}/><View style={s.prayerToolsTwo}>{[['volume-high-outline','Adhan','Adhan'],['moon-outline','Ramadan','Ramadan']].map(([icon,label,screen]:any)=><MotionPress key={label} onPress={()=>navigation.navigate(screen)} style={s.prayerToolTwo}><View style={s.prayerToolInner}><ToolGraphic tool={label} size={54}/><Text style={s.prayerToolText}>{T(label)}</Text></View></MotionPress>)}</View></>}
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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  const makki = chapter.revelation_place === 'makkah';
  const memorized = hifz === 'memorized';
  const revising = hifz === 'revising';
  return <MotionPress accessibilityLabel={`${chapter.id}. ${chapter.name_simple}. ${chapter.translated_name?.name || ''}. ${chapter.verses_count} ${T('verses')}`}
    onPress={() => onOpen(chapter)} style={s.surahCard}>
    {/* MotionPress renders its children in a column, so the row has to be
        declared here or the number, the name and the Arabic stack up rather
        than sitting side by side. */}
    <View style={s.surahRowInner}>
      <View style={s.surahNum}><Text style={s.surahNumText}>{chapter.id}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={s.surahName} numberOfLines={1}>{chapter.name_simple}</Text>
        <Text style={s.meta} numberOfLines={1}>
          {chapter.translated_name?.name} · {chapter.verses_count} {T('verses')} · {T(makki ? 'Makki' : 'Madani')}
        </Text>
      </View>
      <View style={s.surahRight}>
        {(memorized || revising) && <View style={[s.surahRing, revising && s.surahRingHalf]}>
          {memorized ? ico('checkmark', 11, C.white) : <View style={s.surahRingDot} />}
        </View>}
        <Text style={s.surahAr}>{chapter.name_arabic}</Text>
      </View>
    </View>
  </MotionPress>;
});
function QuranHome({navigation}:any){const{dark}=useTheme();
 const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
 const{width}=useWindowDimensions();const wide=width>=760;const[chapters,setChapters]=useState<Chapter[]>([]);const[query,setQuery]=useState('');const[debounced,setDebounced]=useState('');const[expanded,setExpanded]=useState(false);const[error,setError]=useState('');const[position,setPosition]=useState<any>(null);const[bookmarkCount,setBookmarkCount]=useState(0);const[noteCount,setNoteCount]=useState(0);const[recent,setRecent]=useState<number[]>([]);const[plan,setPlanState]=useState<any>(null);const[hifz,setHifzState]=useState<Record<number,HifzStatus>>({});const[preload,setPreload]=useState(getPreloadState());const[gridW,setGridW]=useState(0);const{preferences}=useQuranPreferences();
 const load=()=>getChapters().then(setChapters).catch(e=>setError(T(e.message)));const hydrate=()=>Promise.all([loadReadingPosition().then(setPosition),loadBookmarks().then(x=>setBookmarkCount(x.length)),loadNotes().then(x=>setNoteCount(x.length)),loadRecentSurahs().then(setRecent),loadPlan().then(setPlanState),loadHifz().then(setHifzState),loadAudioSettings().then(value=>setAudioReciter(value.reciterName))]);useEffect(()=>{load();hydrate();resumeSavedQuranPreload();const unsubscribePreload=subscribePreload(setPreload);const unsubscribeFocus=navigation.addListener('focus',hydrate);return()=>{unsubscribePreload();unsubscribeFocus()}},[navigation]);useEffect(()=>{const id=setTimeout(()=>setDebounced(query.trim()),250);return()=>clearTimeout(id)},[query]);
 const shown=chapters.filter(c=>`${c.id} ${c.name_simple} ${c.name_arabic} ${c.translated_name?.name}`.toLowerCase().includes(debounced.toLowerCase()));const visible=expanded||debounced.length>0?shown:shown.slice(0,30);const openSurah=useCallback((chapter:Chapter)=>navigation.navigate('Reader',{chapter,mode:'both'}),[navigation]);const open=(chapter:Chapter,mode='both',focusVerse?:string)=>navigation.navigate('Reader',{chapter,mode,focusVerse});const featured={id:55,name_simple:'Ar-Rahman',name_arabic:'الرحمن',translated_name:{name:'The Most Merciful'},verses_count:78};const submit=()=>{const ref=query.match(/^(\d{1,3}):(\d{1,3})$/);if(ref){const chapter=chapters.find(c=>c.id===Number(ref[1]));if(chapter)return open(chapter,'both',query)}navigation.navigate('Quran Search',{initialQuery:query})};
 const[audioReciter,setAudioReciter]=useState(T('Choose a reciter'));const memorized=Object.values(hifz).filter(value=>value==='memorized').length;const contentWidth=Math.min(Math.max(width-36,280),980);
const gridGap=8;const gridCols=gridW>=640?10:4;const tileW=gridW?Math.floor((gridW-gridGap*(gridCols-1))/gridCols):0;
const exploreTools:{label:string;title:string;screen:string;tab?:string;params?:Record<string,any>}[]=[{label:'Quran Search',title:T('Search'),screen:'Quran Search'},{label:'30 Juz',title:T('Juz'),screen:'Juz Directory'},{label:'60 Hizb',title:T('Hizb'),screen:'Hizb Directory'},{label:'Quran Topics',title:T('Topics'),screen:'Quran Topics'},{label:'Translation Compare',title:T('Tafsir'),screen:'Tafsir Compare'},{label:'Tajweed',title:T('Tajweed'),screen:'Tajweed Study',tab:'Library'},{label:'Quran Vocabulary',title:T('Vocab'),screen:'Quran Vocabulary',tab:'Library'},{label:'Recitations',title:T('Audio'),screen:'Quran Audio'}];
const compactStats=[{label:'Bookmarks',title:T('Bookmarks'),value:String(bookmarkCount),screen:'Bookmarks',icon:'bookmark-outline'},{label:'Notes',title:T('Notes'),value:String(noteCount),screen:'Notes',icon:'create-outline'},{label:'Reading Plans',title:T('Plans'),value:plan?`${plan.days}d`:'—',screen:'Reading Plans',icon:'calendar-outline'},{label:'Hifz',title:T('Hifz'),value:String(memorized),screen:'Hifz',icon:'school-outline'},{label:'Offline Quran',title:T('Offline'),value:`${preload.cached}/114`,screen:'Quran Preload',icon:'download-outline'}];
 return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/>
 <View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput accessibilityLabel={T('Search the Quran')} value={query} onChangeText={setQuery} onSubmitEditing={submit} returnKeyType="search" style={s.searchInput} placeholder={T('Search Surah, meaning, or 2:255')} placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel={T('Clear Quran search')} onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}</View>
 {position&&<Pressable onPress={()=>{const chapter=chapters.find(c=>c.id===position.surahId);if(chapter)open(chapter,'both',position.verseKey)}} style={s.continueBar}><ToolGraphic tool="Quran Arabic" size={48}/><View style={{flex:1}}><Text style={s.dailyKicker}>{T('CONTINUE READING')}</Text><Text style={s.settingName}>{position.surahName} · {position.verseKey}</Text><Text style={s.meta}>{rtl ? `صفحة ${position.page || '—'} · محفوظ على هذا الجهاز` : `Page ${position.page || '—'} · saved locally`}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>}
 <View style={[s.quranHero,wide&&s.quranHeroWide]}><Image source={(dark?SCENE_QURAN_DARK:SCENE_QURAN)} resizeMode="cover" style={s.heroBg}/><LinearGradient colors={['rgba(41,37,80,.96)','rgba(89,65,139,.52)','transparent']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><Text style={s.quranArabic}>الرَّحْمَٰن</Text><Text style={s.quranHeroTitle}>{T('Read. Listen. Reflect.')}</Text><Text style={s.quranHeroMeta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text><View style={s.heroActions}><Pressable style={s.whiteButton} onPress={()=>open(featured)}><Text style={s.whiteButtonText}>{T('Start reading')}</Text>{ico('play',13,C.green)}</Pressable><Pressable style={s.ghostHeroButton} onPress={()=>navigation.navigate('Quran Audio')}><Text style={s.ghostHeroText}>{T('Listen')}</Text>{ico('headset-outline',13,C.white)}</Pressable></View></View>
 <Section title={T('Explore')}/>
 <View style={s.qTileGrid} onLayout={e=>setGridW(e.nativeEvent.layout.width)}>{exploreTools.map(item=><MotionPress key={item.label} testID={`qtile-${item.label}`} onPress={()=>item.tab?navigation.navigate(item.tab,{screen:item.screen,params:item.params||{}}):navigation.navigate(item.screen,item.params||{})} style={[s.qTile,tileW?{width:tileW}:{flex:1,minWidth:60}]}><ToolGraphic tool={item.label} size={36}/><Text numberOfLines={2} style={s.qTileLabel}>{item.title}</Text></MotionPress>)}</View>
 <Section title={T('Your Quran')}/>
 <View style={s.qStatRow}>{compactStats.map(item=><MotionPress key={item.label} testID={`qstat-${item.label}`} onPress={()=>navigation.navigate(item.screen)} style={s.qStat}><View style={s.qStatIcon}>{ico(item.icon,17,C.green)}</View><Text style={s.qStatValue}>{item.value}</Text><Text numberOfLines={1} style={s.qStatLabel}>{item.title}</Text></MotionPress>)}</View>
 <Section title={T('Reading preferences')}/>
 <View style={s.quranPreferenceRow}><Pressable onPress={()=>navigation.navigate('Reader Settings')} style={s.quranPreferenceCard}><ToolGraphic tool="Reader Settings" size={50}/><View style={{flex:1}}><Text style={s.settingName}>{T('Script & display')}</Text><Text numberOfLines={1} style={s.meta}>{T(preferences.scriptName)} · {T(QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.short || '')} · {preferences.fontSize}px</Text></View>{ico('arrow-forward',17,C.green)}</Pressable><Pressable onPress={()=>navigation.navigate('Translations')} style={s.quranPreferenceCard}><ToolGraphic tool="Translations" size={50}/><View style={{flex:1}}><Text style={s.settingName}>{T('Translation')}</Text><View style={s.metaRow}><Flag code={languageOf(preferences.translationEdition, preferences.translationLanguage)} size={12} /><Text numberOfLines={1} style={s.meta}>{T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text></View></View>{ico('arrow-forward',17,C.green)}</Pressable></View>
 
 {recent.length>0&&<><Section title={T('Recent Surahs')}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingRight: 16}}>{recent.map(id=>{const c=chapters.find(x=>x.id===id);return c?<Pressable key={id} onPress={()=>open(c)} style={s.recentChip}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.surahAr}>{c.name_arabic}</Text></Pressable>:null})}</ScrollView></>}
 <Section title={T('All surahs')} action={rtl ? `${shown.length} سورة` : `${shown.length} chapters`}/>{error?<ErrorState message={error} retry={load}/>:!chapters.length?<Spinner/>:<View style={s.surahList}>{visible.map(c=><SurahRow key={c.id} chapter={c} onOpen={openSurah} hifz={hifz[c.id]}/>)}{visible.length<shown.length&&<Pressable accessibilityRole="button" accessibilityLabel={T('Show all')} onPress={()=>setExpanded(true)} style={s.surahMore}><Text style={s.surahMoreText}>{T('Show all')} · {shown.length}</Text></Pressable>}</View>}</ScrollView></Page>
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
  const chapter:Chapter|undefined=route.params?.chapter;
  const section:'surah'|'juz'|'hizb'|'page'=route.params?.section||'surah';
  const juz:number=Math.max(1,Math.min(30,Number(route.params?.juz||1)));
  const hizb:number=Math.max(1,Math.min(60,Number(route.params?.hizb||1)));
  const initial=route.params?.mode||'both';
  const focusVerse=route.params?.focusVerse;
  const{preferences,update}=useQuranPreferences();
  /* "Mushaf page" is a script like Uthmani or IndoPak, not a separate screen. */
  const isMushaf=preferences.scriptEdition==='quran-mushaf';
  const[showArabic,setShowArabic]=useState(initial!=='english');
  const[showEnglish,setShowEnglish]=useState(initial!=='arabic'&&preferences.showTranslation);
  const[verses,setVerses]=useState<Verse[]>([]);
  const[page,setPage]=useState<number|null>(route.params?.page?Math.max(1,Math.min(604,Number(route.params.page))):null);
  const[input,setInput]=useState(String(route.params?.page||''));
  const[bookmarks,setBookmarks]=useState<QuranBookmark[]>([]);
  const[error,setError]=useState('');
  const[cached,setCached]=useState(false);
  const[progress,setProgress]=useState(0);
  const scrollRef=useRef<any>(null);
  const didRestore=useRef(false);
  const verseRefs=useRef<Record<string,any>>({});
  const scrollY=useRef(0);
  const{rtl}=useLanguage();
  const T=(text:string)=>tx(rtl,text);
  const[target,setTarget]=useState<string|null>(focusVerse||null);
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
    if(!target||!verses.length||didRestore.current)return;
    const node=verseRefs.current[target];
    if(!node)return;
    didRestore.current=true;
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
  const load=async()=>{setError('');setVerses([]);didRestore.current=false;setProgress(0);const o=opts();const local=await loadSurahCache(cacheKey) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=(isMushaf&&page!==null)?await getPageVerses(page,o):section==='juz'?await getJuzVerses(juz,o):section==='hizb'?await getHizbVerses(hizb,o):section==='page'?await getPageVerses(Number(route.params?.page||1),o):await getVerses(chapterId,o);setVerses(fresh);setCached(false);await saveSurahCache(cacheKey,fresh)}catch(e:any){if(!local)setError(T(e.message))}};
  useEffect(()=>{load();loadBookmarks().then(setBookmarks);if(section==='surah'&&!isMushaf)void logSurahOpen(chapterId);if(isMushaf&&page!==null)void logMushafPage(page)},[section,chapterId,juz,hizb,page,isMushaf,preferences.scriptEdition,preferences.translationEdition]);
  /* Entering the Mushaf script from a Surah, Juz or Hizb opens it on the page
     where that section begins. */
  useEffect(()=>{if(!isMushaf||page!==null||section==='page')return;let live=true;const o=opts();const p=section==='juz'?getJuzVerses(juz,o):section==='hizb'?getHizbVerses(hizb,o):getVerses(chapterId,o);p.then(v=>{if(live&&v.length)setPage(v[0].page||1)}).catch(()=>undefined);return()=>{live=false}},[isMushaf,page,section,chapterId,juz,hizb,preferences.scriptEdition,preferences.translationEdition]);
  useEffect(()=>{getChapters().then(setChapters)},[]);
  useEffect(()=>{if(focusVerse){setTarget(focusVerse);return}let live=true;loadReadingPosition().then(pos=>{if(live&&pos&&pos.surahId===chapterId)setTarget(pos.verseKey)});return()=>{live=false}},[chapterId,focusVerse]);
  useEffect(()=>{if(page!==null)setInput(String(page))},[page]);
  const bookmark=async(v:Verse)=>setBookmarks(await toggleBookmark({verseKey:v.verse_key,surahId:Number(v.verse_key.split(':')[0])||chapterId,surahName:v.surah_name||full.name_simple,arabic:v.text_uthmani,translation:v.translation,savedAt:Date.now()}));
  const isMarked=(v:Verse)=>savedPosition?.verseKey===v.verse_key;
  const mark=async(v:Verse)=>{const surahId=Number(v.verse_key.split(':')[0])||chapterId;await saveReadingPosition({surahId,surahName:v.surah_name||full.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});void logVerseRead(v.verse_key,surahId,v.page);setSavedPosition({surahId,surahName:v.surah_name||full.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});Alert.alert(T('Reading position saved'),`${v.surah_name||full.name_simple} ${v.verse_key}`)};
  const share=(v:Verse)=>Share.share({message:`${v.text_uthmani}\n\n${v.translation||''}\n\nQuran ${v.verse_key} · ${preferences.translationName}`});
  const toggle=(kind:'ar'|'en')=>{if(kind==='ar'){if(showArabic&&!showEnglish)return;setShowArabic(!showArabic)}else{if(showEnglish&&!showArabic)return;setShowEnglish(!showEnglish)}};
  const goPage=(value:number)=>setPage(Math.max(1,Math.min(604,value)));
  const title=section==='juz'?(rtl?`الجزء ${juz}`:`Juz ${juz}`):section==='hizb'?(rtl?`الحزب ${hizb}`:`Hizb ${hizb}`):section==='page'||isMushaf?(rtl?`صفحة المصحف ${page||1}`:`Mushaf page ${page||1}`):full.name_simple;
  const subtitle=(isMushaf||section==='page')?((cached?(rtl?'متاح دون اتصال · ':'Offline · '):'')+(verses.length?(verses[0].surah_name||''):'')):section==='juz'?(rtl?`الأرباع ${(juz-1)*8+1}–${juz*8}`:`HIZBS ${(juz-1)*2+1}–${juz*2}`):section==='hizb'?(rtl?`الأرباع ${(hizb-1)*4+1}–${hizb*4}`:`QUARTERS ${(hizb-1)*4+1}–${hizb*4}`):(cached?(rtl?'متاح دون اتصال · ':'Available offline · '):'')+`${full.verses_count}${rtl?' آية':' verses'}`;
  /* Stepper: Surah to Surah, Juz to Juz, Hizb to Hizb. The Mushaf script pages
     instead, using the controls above the page itself. */
  const step=(delta:number)=>{if(section==='juz')navigation.replace('Reader',{section:'juz',juz:juz+delta});else if(section==='hizb')navigation.replace('Reader',{section:'hizb',hizb:hizb+delta});else{const i=chapters.findIndex(c=>c.id===chapterId);const next=chapters[i+delta];if(next)navigation.replace('Reader',{chapter:next})}};
  const canStep=(delta:number)=>{if(section==='juz')return delta<0?juz>1:juz<30;if(section==='hizb')return delta<0?hizb>1:hizb<60;if(isMushaf||section==='page')return false;const i=chapters.findIndex(c=>c.id===chapterId);return i<0?false:!!chapters[i+delta]};
  const arStyle=[{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}];
  /* Both sheets go through the overlay layer so the floating tab bar and the
     mini player sit behind them instead of across their lower edge. */
  useOverlaySheet('verse-share', !!shareVerse, () => shareVerse
    ? <VerseShareSheet verse={shareVerse} chapter={full} rtl={rtl} T={T} onClose={()=>setShareVerse(null)}/>
    : null);
  useOverlaySheet('verse-note', !!noteVerse, () => noteVerse
    ? <VerseNoteSheet verse={noteVerse} chapter={full} rtl={rtl} T={T} onClose={()=>setNoteVerse(null)}/>
    : null);
  useOverlaySheet('verse-actions', !!actionsVerse, () => actionsVerse
    ? <VerseActionsSheet verse={actionsVerse} chapter={full} rtl={rtl} T={T} navigation={navigation} onClose={()=>setActionsVerse(null)}/>
    : null);
  return <Page><Animated.View style={[s.readerBar,{transform:[{translateY:chromeY}]}]}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/>{canStep(-1)?<Pressable accessibilityLabel={T('Previous section')} onPress={()=>step(-1)} style={s.surahStep}>{ico(rtl?'chevron-forward':'chevron-back',19,C.ink)}</Pressable>:<View style={s.surahStep}/>}<View style={{alignItems:'center',flex:1}}><Text style={s.readerName} numberOfLines={1}>{title}</Text><Text style={s.meta} numberOfLines={1}>{subtitle}</Text></View>{canStep(1)?<Pressable accessibilityLabel={T('Next section')} onPress={()=>step(1)} style={s.surahStep}>{ico(rtl?'chevron-back':'chevron-forward',19,C.ink)}</Pressable>:<View style={s.surahStep}/>}<View style={s.readerHeaderActions}>{section==='surah'&&<Pressable accessibilityLabel={T('Play this Surah')} onPress={()=>{void playSurahFromReader(full,rtl)}} style={s.iconBtn}>{ico('play-circle',20,C.ink)}</Pressable>}{section==='surah'&&<Pressable accessibilityLabel={T('Keep this Surah for offline')} onPress={()=>navigation.navigate('Downloads',{chapterId,surahName:full.name_simple})} style={s.iconBtn}>{ico('download-outline',20,C.ink)}</Pressable>}<Pressable accessibilityRole="switch" accessibilityState={{checked:focusOn}} accessibilityLabel={`${T('Focus mode')}: ${focusOn?T('On'):T('Off')}`} onPress={()=>update({focusMode:!focusOn})} style={s.iconBtn}>{ico(focusOn?'eye':'eye-outline',20,focusOn?C.gold:C.ink)}</Pressable><Pressable accessibilityLabel={T('Reader settings')} onPress={()=>navigation.navigate('Reader Settings')} style={s.iconBtn}>{ico('options-outline',20,C.ink)}</Pressable></View></Animated.View><View style={s.readerProgress}><View style={[s.preloadFill,{width:`${Math.round(progress*100)}%`} as any]}/></View>
  <ScrollView ref={scrollRef} contentContainerStyle={s.readerScroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={e=>{const{layoutMeasurement,contentOffset,contentSize}=e.nativeEvent;if(focusOn){const dy=contentOffset.y-scrollY.current;if(dy>4&&chromeShown)setChromeShown(false)}scrollY.current=contentOffset.y;const span=contentSize.height-layoutMeasurement.height;const next=span>0?Math.min(1,Math.max(0,contentOffset.y/span)):0;if(Math.abs(next-progress)>0.005)setProgress(next)}}>
  {isMushaf?<MushafPageView page={page||1} verses={verses} error={error} cached={cached} retry={load} preferences={preferences} rtl={rtl} T={T} input={input} setInput={setInput} goPage={goPage} navigation={navigation} arStyle={arStyle} bookmarks={bookmarks} savedPosition={savedPosition} onBookmark={(v:any)=>{void bookmark(v)}} onMark={(v:any)=>{void mark(v)}} onPlay={(v:any)=>{void playFromReader(full,v,rtl)}} onNote={(v:any)=>setNoteVerse(v)}/>
  :<>
  {section==='surah'&&<LinearGradient colors={[C.heroA,C.green]} style={s.surahHead}>{!!cached&&<LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.surahHeadAr}>{full.name_arabic}</Text><Text style={s.surahHeadEn}>{chapter?.translated_name?.name}</Text><Text style={s.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text></LinearGradient>}
  {section!=='page'&&<View style={s.readerModes}><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showArabic}} onPress={()=>toggle('ar')} style={[s.readerMode,showArabic&&s.readerModeActive]}><ToolGraphic tool="Arabic Quran" size={42}/><Text style={s.readerModeText}>{T('Arabic')}</Text></Pressable><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showEnglish}} onPress={()=>toggle('en')} style={[s.readerMode,showEnglish&&s.readerModeActive]}><ToolGraphic tool="English meaning" size={42}/><Text style={s.readerModeText}>{T('Translation')}</Text></Pressable></View>}
  {error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map((v,i)=>{const saved=bookmarks.some(x=>x.verseKey===v.verse_key);const prev=i>0?verses[i-1]:null;const newJuz=!!v.juz&&(!prev||prev.juz!==v.juz);const newHizb=!!hizbOf(v)&&(!prev||hizbOf(prev)!==hizbOf(v));return <View key={v.id||v.verse_key}>
  {newJuz&&<View style={s.sectionMarker}><View style={s.sectionRule}/><Text style={s.sectionMarkerText}>{rtl?`الجزء ${v.juz}`:`JUZ ${v.juz}`}</Text><View style={s.sectionRule}/></View>}
  {newHizb&&<View style={s.sectionMarker}><View style={s.sectionRule}/><Text style={s.sectionMarkerText}>{rtl?`الحزب ${hizbOf(v)}`:`HIZB ${hizbOf(v)}`}</Text><View style={s.sectionRule}/></View>}
  <Pressable ref={(node:any)=>{verseRefs.current[v.verse_key]=node}} delayLongPress={500} onLongPress={()=>setNoteVerse(v)} onPress={()=>revealChrome()} style={[s.ayah,preferences.readingMode==='continuous'&&s.ayahContinuous,focusVerse===v.verse_key&&s.ayahSelected]}>
  <View style={s.ayahTop}><Text style={s.ayahNo}>{v.verse_key}</Text><View style={s.ayahActions}>
    <VerseActionButton label={`${T('Play verse')} ${v.verse_key}`} name="play-circle" size={22} onPress={()=>{void playFromReader(full,v,rtl)}}/>
    <VerseActionButton label={`${T('Mark position at')} ${v.verse_key}`} name={isMarked(v)?'locate':'locate-outline'} size={19} active={isMarked(v)} onPress={()=>mark(v)} haptic="success"/>
    <VerseActionButton label={`${saved?T('Remove bookmark from'):T('Bookmark')} ${T('verse')} ${v.verse_key}`} name={saved?'bookmark':'bookmark-outline'} size={19} active={saved} onPress={()=>bookmark(v)}/>
    <VerseActionButton label={`${T('Share')} ${T('verse')} ${v.verse_key}`} name="share-outline" size={19} onPress={()=>setShareVerse(v)}/>
    <VerseActionButton label={`${T('More actions for verse')} ${v.verse_key}`} name="ellipsis-horizontal-circle-outline" size={20} onPress={()=>setActionsVerse(v)}/>
  </View></View>
  {(section!=='surah'||showArabic)&&(preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,...arStyle]}/>:<Text style={[s.ayahAr,...arStyle]}>{v.text_uthmani}</Text>)}
  {(section!=='surah'||showEnglish)&&v.translation?<Text style={[s.ayahTranslation,(!showArabic||section!=='surah')&&{borderTopWidth:0,marginTop:8,paddingTop:0}]}>{v.translation}</Text>:null}
  {section!=='surah'&&<Text style={s.dataMeta}>{v.surah_name}</Text>}
  <View style={s.ayahFooter}><Text style={s.ayahMeta}>{rtl?`الجزء ${v.juz} · صفحة ${v.page}`:`Juz ${v.juz} · Page ${v.page}`}{section==='hizb'?(rtl?` · الربع ${v.hizbQuarter}`:` · Quarter ${v.hizbQuarter}`):''} · {T(rtl?preferences.translationLanguage:preferences.translationName)}</Text></View></Pressable></View>})}
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
    kind: 'ayah' | 'hadith';
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
        <Pressable accessibilityRole="button" accessibilityLabel={T('Done')} onPress={onClose} style={s.primary}>
          <Text style={s.primaryText}>{T('Done')}</Text>
        </Pressable>
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
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
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
        placeholderTextColor="#929B96" style={s.reportInput} />

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
      <ScrollView style={s.reflectScroll} showsVerticalScrollIndicator={false}>
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
      {body.action && <Pressable accessibilityRole="button" accessibilityLabel={body.action.label}
        onPress={() => { body.action!.go(); onClose(); }} style={s.primary}>
        <Text style={s.primaryText}>{body.action.label}</Text>
      </Pressable>}
      <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetCancel}>
        <Text style={s.sheetCancelText}>{T('Close')}</Text>
      </Pressable>
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
    <Animated.View style={[s.verseSheet, {
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
        placeholderTextColor="#929B96"
        style={s.noteSheetInput}
      />
      <View style={s.noteSheetActions}>
        {!!existing && <Pressable accessibilityRole="button" accessibilityLabel={T('Delete note')}
          onPress={async () => { await deleteNote(verse.verse_key); onClose(); }} style={s.dangerButton}>
          <Text style={s.dangerText}>{T('Delete')}</Text>
        </Pressable>}
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" accessibilityLabel={T('Cancel')} onPress={onClose} style={s.secondary}>
          <Text style={s.secondaryText}>{T('Cancel')}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={T('Save note')} onPress={() => { void save(); }} style={s.primarySmall}>
          <Text style={s.primaryText}>{T('Save')}</Text>
        </Pressable>
      </View>
    </Animated.View>
  </View>;
}

function VerseShareSheet({ verse, chapter, rtl, T, onClose }: {
  verse: Verse; chapter: Chapter; rtl: boolean; T: (t: string) => string; onClose: () => void;
}) {
  const { preferences } = useQuranPreferences();
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
    arabicFontFamily: quranFont(preferences.arabicFont)
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
      <VerseShareCard viewRef={cardRef} {...cardData} />
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
        <Pressable key={option.key} accessibilityRole="button" accessibilityLabel={option.label}
          disabled={busy} onPress={() => { void option.onPress(); }} style={s.sheetOption}>
          <View style={s.sheetOptionIcon}>{ico(option.icon, 20, C.green)}</View>
          <View style={{ flex: 1 }}>
            <Text style={s.sheetOptionLabel}>{option.label}</Text>
            <Text style={s.sheetOptionDetail}>{option.detail}</Text>
          </View>
          {busy ? <ActivityIndicator color={C.green} /> : ico('arrow-forward', 17, C.muted)}
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" accessibilityLabel={T('Cancel')} onPress={onClose} style={s.sheetCancel}>
        <Text style={s.sheetCancelText}>{T('Cancel')}</Text>
      </Pressable>
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
    <View style={[s.mushafMenuBar, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
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
function MushafConnectionNote({ kind, rtl, T, page, cut, nextVerse }: {
  kind: PageConnection; rtl: boolean; T: (t: string) => string; page: number;
  cut: boolean; nextVerse?: { verse_key: string; surah_name?: string };
}) {
  const onward = kind === 'continues';
  const label = cut
    ? (onward
        ? (rtl ? `الآية ${toArabicDigits(nextVerse?.verse_key || '')} تكتمل في الصفحة ${toArabicDigits(page + 1)}`
               : `Verse ${nextVerse?.verse_key || ''} continues on page ${page + 1}`)
        : (rtl ? `تتمة الآية ${toArabicDigits(nextVerse?.verse_key || '')} من الصفحة ${toArabicDigits(page - 1)}`
               : `Verse ${nextVerse?.verse_key || ''} continued from page ${page - 1}`))
    : (onward
        ? (nextVerse
            ? (rtl ? `التالي: ${nextVerse.verse_key} · الصفحة ${toArabicDigits(page + 1)}`
                   : `Next: ${nextVerse.verse_key}${nextVerse.surah_name ? ` · ${nextVerse.surah_name}` : ''} on page ${page + 1}`)
            : (rtl ? `الصفحة ${toArabicDigits(page + 1)}` : `Page ${page + 1}`))
        : (nextVerse
            ? (rtl ? `السابق: ${nextVerse.verse_key} · الصفحة ${toArabicDigits(page - 1)}`
                   : `Before: ${nextVerse.verse_key}${nextVerse.surah_name ? ` · ${nextVerse.surah_name}` : ''} on page ${page - 1}`)
            : (rtl ? `الصفحة ${toArabicDigits(page - 1)}` : `Page ${page - 1}`)));

  return <View style={[s.mushafConnection, rtl && s.mushafConnectionRtl, cut && s.mushafConnectionCut]}>
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

function MushafPageView({page,verses,error,cached,retry,preferences,rtl,T,input,setInput,goPage,navigation,arStyle,bookmarks,savedPosition,onBookmark,onMark,onPlay,onNote}:any){
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
    <Pressable accessibilityLabel={T('Previous Mushaf page')} disabled={!canPrev} onPress={() => step(-1)} style={[s.stepButton, !canPrev && { opacity: .3 }]}>{ico('arrow-back', 20, C.green)}</Pressable>
    <View style={s.pageJump}>
      <Text style={s.dataMeta}>
        {T(cached ? 'OFFLINE PAGE' : 'MADINAH MUSHAF · 604 PAGES')}
      </Text>
      <TextInput accessibilityLabel={T('Mushaf page number')} keyboardType="number-pad" value={input} onChangeText={setInput} onSubmitEditing={() => goPage(Number(input))} style={s.pageInput} />
    </View>
    <Pressable accessibilityLabel={T('Next Mushaf page')} disabled={!canNext} onPress={() => step(1)} style={[s.stepButton, !canNext && { opacity: .3 }]}>{ico('arrow-forward', 20, C.green)}</Pressable>
  </View>
  <View style={s.pageProgress}><View style={[s.preloadFill, { width: `${page / 604 * 100}%` } as any]} /></View>

  {error ? <ErrorState message={error} retry={retry} /> : !verses.length ? <Spinner /> :
   <View style={s.mushafPageStack}>
     {!!preferences.showVerseConnections && page > 1 &&
       <MushafConnectionNote kind="continued" rtl={rtl} T={T} page={page} cut={startsContinued} nextVerse={neighbours.prev[neighbours.prev.length - 1]} />}
     <MushafPage page={page} verses={verses} width={layout.pageWidth} height={layout.pageHeight} before={neighbours.prev} {...pageProps} />
     {!!preferences.showVerseConnections && page < 604 &&
       <MushafConnectionNote kind="continues" rtl={rtl} T={T} page={page} cut={endsContinued} nextVerse={neighbours.next[0]} />}
   </View>}

  <View style={[s.mushafNav, s.mushafNavFoot]}>
    <Pressable onPress={() => step(-1)} disabled={!canPrev} style={s.secondary}><Text style={s.secondaryText}>{T('Previous')}</Text></Pressable>
    <Text style={s.meta}>
      {rtl
        ? `الجزء ${verses[0]?.juz || '—'} · صفحة ${toArabicDigits(page)}`
        : `Juz ${verses[0]?.juz || '—'} · Page ${page}`}
    </Text>
    <Pressable onPress={() => step(1)} disabled={!canNext} style={s.secondary}><Text style={s.secondaryText}>{T('Next')}</Text></Pressable>
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
function LanguagePickerSheet({ rtl, T, entries, selected, onPick, onClose }: {
  rtl: boolean; T: (t: string) => string; entries: LanguageEntry[];
  selected?: string; onPick: (code: string) => void; onClose: () => void;
}) {
  const rise = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  useEffect(() => {
    Animated.spring(rise, { toValue: 1, friction: 9, tension: 130, useNativeDriver: true }).start();
  }, [rise]);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.label.localeCompare(b.label, 'en')),
    [entries],
  );
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter((e) => e.label.toLowerCase().includes(needle) || e.code.includes(needle));
  }, [sorted, query]);

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel={T('Close')} onPress={onClose} style={s.sheetScrim} />
    <Animated.View style={[s.verseSheet, s.langSheet, {
      transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) }],
      opacity: rise,
    }]}>
      <View style={s.sheetGrip} />
      <Text style={s.sheetTitle}>{T('Language')}</Text>
      <Text style={s.sheetSub}>{entries.length} {T('languages, A to Z')}</Text>

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

      <ScrollView style={{ marginTop: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!shown.length && <Text style={s.onbCardNote}>{T('No language matches that.')}</Text>}
        {shown.map((entry) => {
          const active = entry.code === selected;
          return <Pressable key={entry.code}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${entry.label}, ${entry.count} ${entry.count === 1 ? T('version') : T('versions')}`}
            onPress={() => { onPick(entry.code); onClose(); }}
            style={[s.langRow, active && s.langRowOn]}>
            <Text style={s.langFlag}>{entry.flag}</Text>
            <Text style={[s.langName, active && s.langNameOn]} numberOfLines={1}>{entry.label}</Text>
            <Text style={s.langCount}>{entry.count}</Text>
            {active && ico('checkmark', 16, C.green)}
          </Pressable>;
        })}
        <View style={{ height: 8 }} />
      </ScrollView>
    </Animated.View>
  </View>;
}

function TranslationScreen({navigation}:any){const{preferences,update}=useQuranPreferences();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[editions,setEditions]=useState<IslamicEdition[]>([]);const[error,setError]=useState('');const[picking,setPicking]=useState(false);const load=()=>getEditions('quran').then(setEditions).catch(e=>setError(T(e.message)));useEffect(()=>{load()},[]);
  /* The language is chosen from a sheet holding all ninety-seven in
     alphabetical order, so the screen opens with one control: what language
     am I reading. The editions of that language sit underneath it. */
  const languages=useMemo(()=>languagesOf(editions),[editions]);
  const currentCode=(editions.find(e=>e.id===preferences.translationEdition)?.language)||'en';
  const current=useMemo(()=>languages.find(l=>l.code===currentCode),[languages,currentCode]);
  const[language,setLanguage]=useState(currentCode);
  useEffect(()=>{setLanguage(currentCode)},[currentCode]);

  return <Page><ToolBar title={T('Translation')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
    <ToolGraphic tool="Translations" size={76}/>
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

    {error?<ErrorState message={error} retry={load}/>:!editions.length?<Spinner/>:<EditionPicker C={C} editions={editions} category="quran" selectedId={preferences.translationEdition} initialLanguage={language} hideLanguageRow searchPlaceholder={T('Search translator or edition')} onPick={async(e)=>{
      await update({
        translationEdition:e.id,
        translationName:editionDisplayName(e),
        translationLanguage:languageLabel(e.language||'en'),
      });
      navigation.goBack();
    }}/>}
  </ScrollView>
  {picking&&<LanguagePickerSheet rtl={rtl} T={T} entries={languages} selected={language}
    onPick={(code)=>setLanguage(code)} onClose={()=>setPicking(false)}/>}
</Page>}

function QuranSearchScreen({route,navigation}:any){const{preferences}=useQuranPreferences();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[query,setQuery]=useState(route.params?.initialQuery||'');const[results,setResults]=useState<QuranSearchResult[]>([]);const[history,setHistory]=useState<string[]>([]);const[error,setError]=useState('');const[loading,setLoading]=useState(false);useEffect(()=>{loadSearchHistory().then(setHistory);if(route.params?.initialQuery)run(route.params.initialQuery)},[]);const run=async(value=query)=>{const q=value.trim();if(q.length<2)return;setLoading(true);setError('');try{const edition=/[\u0600-\u06ff]/.test(q)?preferences.scriptEdition:preferences.translationEdition;setResults((await searchQuran(q,edition)).slice(0,100));setHistory(await addSearchHistory(q))}catch(e:any){setError(T(e.message))}finally{setLoading(false)}};const open=(r:QuranSearchResult)=>navigation.navigate('Reader',{chapter:{id:r.surahId,name_simple:r.surahName,name_arabic:'',verses_count:0},focusVerse:r.verseKey});return <Page><ToolBar title={T('Quran search')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Quran Search" size={72}/><Text style={s.dataTitle}>{T('Search Arabic or translation')}</Text><View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput autoFocus value={query} onChangeText={setQuery} onSubmitEditing={()=>run()} returnKeyType="search" style={s.searchInput} placeholder={T('Mercy, الصبر, or 2:255')}/><Pressable onPress={()=>run()}>{ico('arrow-forward-circle',22,C.green)}</Pressable></View>{history.length>0&&<><View style={s.historyHead}><Text style={s.preferenceLabel}>{T('RECENT SEARCHES')}</Text><Pressable onPress={async()=>{await clearSearchHistory();setHistory([])}}><Text style={s.sectionAction}>{T('Clear')}</Text></Pressable></View><View style={s.historyWrap}>{history.map(item=><Pressable key={item} onPress={()=>{setQuery(item);run(item)}} onLongPress={async()=>setHistory(await removeSearchHistory(item))} style={s.historyChip}><Text style={s.meta}>{item}</Text></Pressable>)}</View></>}{error?<ErrorState message={error} retry={()=>run()}/>:loading?<Spinner/>:<View>{results.map(r=><Pressable key={`${r.verseKey}-${r.edition}`} onPress={()=>open(r)} style={s.searchResult}><Text style={s.dataMeta}>{r.surahName} · {r.verseKey}</Text><Text numberOfLines={4} style={/[\u0600-\u06ff]/.test(r.text)?s.dataArabic:s.dataBody}>{r.text}</Text><Text style={s.meta}>{r.edition}</Text></Pressable>)}</View>}</ScrollView></Page>}

function BookmarkScreen({navigation}:any){const[items,setItems]=useState<QuranBookmark[]>([]);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadBookmarks().then(setItems));loadBookmarks().then(setItems);return unsub},[navigation]);const[chapters,setChapters]=useState<Chapter[]>([]);useEffect(()=>{getChapters().then(setChapters)},[]);const openBookmark=(item:QuranBookmark)=>{const full=chapters.find(c=>c.id===item.surahId);navigation.navigate('Reader',{chapter:full||{id:item.surahId,name_simple:item.surahName,name_arabic:'',verses_count:0},focusVerse:item.verseKey})};return <Page><ToolBar title={T('Bookmarks')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Bookmarks" size={72}/><Text style={s.dataTitle}>{rtl?`${items.length} آية محفوظة`:`${items.length} saved verses`}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No bookmarks yet')}</Text><Text style={s.errorText}>{T('Use the bookmark action beside any verse.')}</Text></View>:items.map(item=><View key={item.verseKey} style={s.dataCard}><Pressable onPress={()=>openBookmark(item)} style={s.bookmarkMain}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text numberOfLines={3} style={s.dataArabic}>{item.arabic}</Text><Text numberOfLines={3} style={s.dataBody}>{item.translation}</Text></Pressable><Pressable accessibilityLabel={`${T('Remove bookmark')} ${item.verseKey}`} onPress={async()=>setItems(await toggleBookmark(item))} style={s.bookmarkRemove}>{ico('trash-outline',18,C.muted)}</Pressable></View>)}</ScrollView></Page>}
function NotesScreen({navigation}:any){const[items,setItems]=useState<QuranNote[]>([]);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadNotes().then(setItems));loadNotes().then(setItems);return unsub},[navigation]);return <Page><ToolBar title={T('Quran notes')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Notes" size={72}/><Text style={s.dataTitle}>{rtl?`${items.length} ملاحظة خاصة`:`${items.length} private notes`}</Text><Text style={s.intro}>{T('Notes remain on this device and are never added to diagnostics.')}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No notes yet')}</Text><Text style={s.errorText}>{T('Open verse actions to add a reflection.')}</Text></View>:items.map(item=><Pressable key={item.verseKey} onPress={()=>navigation.navigate('Note Editor',{verse:item,chapter:{id:item.surahId,name_simple:item.surahName}})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text style={s.noteText}>{item.note}</Text><Text style={s.meta}>{new Date(item.updatedAt).toLocaleDateString()}</Text></Pressable>)}</ScrollView></Page>}
/**
 * Three screens read their payload straight off `route.params`. In normal use
 * they are always opened with one, but a deep link, a restored stack or a
 * stale tab can arrive bare, and reading `.verse` off undefined takes the
 * whole navigator down. This shows a way back instead of a blank screen.
 */
function needsPayload(Inner: any, title: string) {
  return function Guarded(props: any) {
    const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
    const bare = !props.route?.params || Object.keys(props.route.params).length === 0;
    if (bare) return <Page><ToolBar title={T(title)} navigation={props.navigation}/><View style={s.dataPage}><View style={s.emptyWrap}>{ico('alert-circle-outline',34,C.muted)}<Text style={s.emptyTitle}>{T('Nothing to show here')}</Text><Text style={s.emptyBody}>{T('Open this page by choosing an item from the list before it.')}</Text></View></View></Page>;
    return <Inner {...props}/>;
  };
}

function NoteEditorScreen({route,navigation}:any){const verse:Verse=route.params.verse;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const chapter:Chapter=route.params.chapter;const[text,setText]=useState(route.params.verse.note||'');const save=async()=>{if(!text.trim()){if(route.params.verse.note){await deleteNote(verse.verse_key)}navigation.goBack();return}await saveNote({verseKey:verse.verse_key,surahId:chapter.id,surahName:chapter.name_simple,arabic:verse.text_uthmani,translation:verse.translation,note:text.trim(),savedAt:route.params.verse.savedAt||Date.now(),updatedAt:Date.now()});navigation.goBack()};return <Page><ToolBar title={`Note · ${verse.verse_key}`} navigation={navigation}/><View style={s.dataPage}><Text style={s.dataArabic}>{verse.text_uthmani}</Text><TextInput multiline autoFocus value={text} onChangeText={setText} placeholder={T('Write a private reflection…')} style={s.noteInput}/><View style={s.actionRow}><Pressable onPress={save} style={s.primary}><Text style={s.primaryText}>{T('Save note')}</Text></Pressable>{route.params.verse.note&&<Pressable onPress={async()=>{await deleteNote(verse.verse_key);navigation.goBack()}} style={s.dangerButton}><Text style={s.dangerText}>{T('Delete')}</Text></Pressable>}</View></View></Page>}

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
  const{rtl}=useLanguage(); const T=(text:string)=>tx(rtl,text);
  const{preferences,update}=useQuranPreferences();
  const rise=useRef(new Animated.Value(0)).current;
  const[picking,setPicking]=useState<null|'translation'|'transliteration'>(null);
  const[editions,setEditions]=useState<IslamicEdition[]>([]);
  const[transliterations,setTransliterations]=useState<IslamicEdition[]>([]);
  const[translitLanguage,setTranslitLanguage]=useState('en');

  useEffect(()=>{ Animated.spring(rise,{toValue:1,friction:9,tension:130,useNativeDriver:true}).start(); },[rise]);
  useEffect(()=>{
    getEditions('quran').then(setEditions).catch(()=>undefined);
    getEditions('transliteration').then(setTransliterations).catch(()=>undefined);
  },[]);

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

  /* Only the transliterations with a surah route are offered; the rest exist
     in the catalogue but answer nothing. */
  const translitPool=useMemo(()=>servableEditions(transliterations,'transliteration'),[transliterations]);
  const translitLanguages=useMemo(()=>languagesOf(translitPool),[translitPool]);

  const close=()=>navigation.goBack();
  const Switch=({on,label,detail,glyph,onPress}:{on:boolean;label:string;detail:string;glyph:string;onPress:()=>void})=>(
    <Pressable accessibilityRole="switch" accessibilityState={{checked:on}} onPress={onPress} style={s.setting}>
      <MotionGlyph name={glyph} size={19}/>
      <View style={{flex:1}}><Text style={s.settingName}>{T(label)}</Text><Text style={s.meta}>{T(detail)}</Text></View>
      {ico(on?'toggle':'toggle-outline',22,on?C.green:C.muted)}
    </Pressable>
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

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:12}}>
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
            <View style={s.stepper}><Pressable accessibilityLabel={T('Smaller Arabic')} onPress={()=>update({fontSize:Math.max(18,preferences.fontSize-2)})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={[s.previewArabic,{fontSize:preferences.fontSize}]}>ٱلْقُرْآنُ</Text><Pressable accessibilityLabel={T('Larger Arabic')} onPress={()=>update({fontSize:Math.min(40,preferences.fontSize+2)})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View>
            <Text style={s.preferenceLabel}>{T('LINE SPACING')}</Text>
            <View style={s.stepper}><Pressable accessibilityLabel={T('Tighter lines')} onPress={()=>update({lineHeight:Math.max(1.4,+(preferences.lineHeight-.1).toFixed(1))})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={s.settingName}>{preferences.lineHeight.toFixed(1)}×</Text><Pressable accessibilityLabel={T('Looser lines')} onPress={()=>update({lineHeight:Math.min(3,+(preferences.lineHeight+.1).toFixed(1))})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View>
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
              {!editions.length ? <Spinner/> : <EditionPicker C={C} editions={editions} category="quran"
                selectedId={preferences.translationEdition} initialLanguage={language} hideLanguageRow
                searchPlaceholder={T('Search translator or edition')}
                onPick={(e)=>{void update({translationEdition:e.id,translationName:editionDisplayName(e),translationLanguage:languageLabel(e.language||'en')})}}/>}
              <Text style={s.preferenceLabel}>{T('TRANSLATION SIZE')}</Text>
              <View style={s.stepper}><Pressable accessibilityLabel={T('Smaller translation')} onPress={()=>update({translationFontSize:Math.max(11,preferences.translationFontSize-1)})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={[s.settingName,{fontSize:Math.min(preferences.translationFontSize,22)}]}>{T('The meaning beside the Arabic')}</Text><Pressable accessibilityLabel={T('Larger translation')} onPress={()=>update({translationFontSize:Math.min(26,preferences.translationFontSize+1)})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View>
              <Text style={s.meta}>{T('The script and the meaning are set apart, because they are not read at the same speed or from the same distance.')}</Text>
            </>}
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('TRANSLITERATION')}</Text>
            <View style={s.settings}>
              <Switch on={!!preferences.showTransliteration} glyph="mic-outline"
                label={'Show the transliteration'} detail={'The Arabic sounded out in Latin letters. It is a guide to reciting, not a translation, and sits under the meaning.'}
                onPress={()=>update({showTransliteration:!preferences.showTransliteration})}/>
            </View>
            {!!preferences.showTransliteration && (translitPool.length
              ? <EditionPicker C={C} editions={translitPool} category="transliteration"
                  selectedId={preferences.transliterationEdition} initialLanguage={translitLanguage}
                  searchPlaceholder={T('Search a transliteration')}
                  onPick={(e)=>update({transliterationEdition:e.id,transliterationName:editionDisplayName(e)})}/>
              : <Spinner/>)}
          </View>

          <View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('READING MODE')}</Text>
            <View style={s.settings}><Pressable accessibilityRole="switch" accessibilityState={{checked:preferences.focusMode}} onPress={()=>update({focusMode:!preferences.focusMode})} style={s.setting}><MotionGlyph name={preferences.focusMode?'eye':'eye-outline'} size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Focus mode')}</Text><Text style={s.meta}>{T('Hide the top bar and the tab menu as you scroll. Tap a verse to bring them back.')}</Text></View>{ico(preferences.focusMode?'toggle':'toggle-outline',22,preferences.focusMode?C.green:C.muted)}</Pressable></View>
            <View style={s.choiceGrid}><ChoicePill label={T('Ayah cards')} selected={preferences.readingMode==='cards'} onPress={()=>update({readingMode:'cards'})}/><ChoicePill label={T('Continuous')} selected={preferences.readingMode==='continuous'} onPress={()=>update({readingMode:'continuous'})}/></View>
          </View>

          {preferences.scriptEdition==='quran-mushaf'&&<View style={s.rsGroup}>
            <Text style={s.rsGroupTitle}>{T('MUSHAF PAGE')}</Text>
            <Text style={s.rsGroupTitle}>{T('ON THE PAGE')}</Text>
            <View style={s.settings}>
              <Pressable accessibilityRole="switch" accessibilityState={{checked:!!preferences.mushafTranslation}} onPress={()=>update({mushafTranslation:!preferences.mushafTranslation})} style={s.setting}><MotionGlyph name={preferences.mushafTranslation?'text':'text-outline'} size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Show the meaning on the page')}</Text><Text style={s.meta}>{T('A printed page carries no translation. Turn this on to have the meaning under each verse.')}</Text></View>{ico(preferences.mushafTranslation?'toggle':'toggle-outline',22,preferences.mushafTranslation?C.green:C.muted)}</Pressable>
              <Pressable accessibilityRole="switch" accessibilityState={{checked:preferences.showVerseConnections!==false}} onPress={()=>update({showVerseConnections:preferences.showVerseConnections===false})} style={s.setting}><MotionGlyph name="git-compare-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Mark verses cut across a page')}</Text><Text style={s.meta}>{T('Notes where a verse runs on to the next page, so the sentence does not simply stop.')}</Text></View>{ico(preferences.showVerseConnections!==false?'toggle':'toggle-outline',22,preferences.showVerseConnections!==false?C.green:C.muted)}</Pressable>
            </View>
            <View style={s.rsDivider}/>
            <Text style={s.rsGroupTitle}>{T('DIVISION MARKS')}</Text>
            <View style={s.settings}>{MARKER_KINDS.map(kind=><Pressable key={kind} accessibilityRole="switch" accessibilityState={{checked:preferences.mushafMarkers[kind]!==false}} onPress={()=>update({mushafMarkers:{...preferences.mushafMarkers,[kind]:preferences.mushafMarkers[kind]===false}})} style={s.setting}><MotionGlyph name="bookmark-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?MARKER_LABELS[kind].ar:MARKER_LABELS[kind].en}</Text></View>{ico(preferences.mushafMarkers[kind]!==false?'toggle':'toggle-outline',22,preferences.mushafMarkers[kind]!==false?C.green:C.muted)}</Pressable>)}</View>
          </View>}
        </ScrollView>
      </Animated.View>

      {picking==='translation'&&<LanguagePickerSheet rtl={rtl} T={T} entries={languages} selected={language}
        onPick={(code)=>setLanguage(code)} onClose={()=>setPicking(null)}/>}
      {picking==='transliteration'&&<LanguagePickerSheet rtl={rtl} T={T} entries={translitLanguages} selected={translitLanguage}
        onPick={setTranslitLanguage} onClose={()=>setPicking(null)}/>}
    </View>
  ));
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
function VerseActionsSheet({ verse, chapter, rtl, T, navigation, onClose }: {
  verse: Verse; chapter: Chapter; rtl: boolean; T: (t: string) => string; navigation: any; onClose: () => void;
}) {
  const { preferences } = useQuranPreferences();
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
    arabicFontFamily: quranFont(preferences.arabicFont)
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
    rtl={rtl} T={T} appLanguage={rtl ? 'ar' : 'en'} onClose={() => setReporting(false)} />);

  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
    {/* captured into a PNG on native; the web path draws on a canvas instead */}
    {Platform.OS !== 'web' && <View style={s.offscreenCard} pointerEvents="none" aria-hidden>
      <VerseShareCard viewRef={cardRef} {...cardData} />
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
      <ScrollView style={{ maxHeight: Math.round(height * 0.44) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {options.map((option) => (
          <Pressable key={option.key} accessibilityRole="button" accessibilityLabel={option.label}
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
            {busy ? <ActivityIndicator color={C.green} /> : ico('arrow-forward', 17, C.muted)}
          </Pressable>
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

function TafsirScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[editions,setEditions]=useState<IslamicEdition[]>([]);const[chapters,setChapters]=useState<IslamicChapter[]>([]);const[picked,setPicked]=useState<IslamicEdition|null>(null);const[surah,setSurah]=useState(1);const[result,setResult]=useState<CachedSurah|null>(null);const[busy,setBusy]=useState(false);const[error,setError]=useState('');const load=()=>{  getEditions('tafsir').then(setEditions).catch(e=>setError(T(e.message)));  getWorkerChapters().then(setChapters).catch(()=>undefined);};useEffect(()=>{load()},[]);useEffect(()=>{  if(!picked)return;  let live=true;  setBusy(true);setError('');  getSurah('tafsir',picked.id,surah)    .then(r=>{if(live)setResult(r)})    .catch(e=>{if(live)setError(T(e.message))})    .finally(()=>{if(live)setBusy(false)});  return()=>{live=false};},[picked,surah]);const chapter=chapters.find(c=>c.number===surah);const title=chapter?(rtl?chapter.nameArabic:chapter.nameSimple):(rtl?`سورة ${surah}`:`Surah ${surah}`);if(!picked)return <Page><ToolBar title={T('Tafsir')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Tafsir" size={76}/><Text style={s.dataTitle}>{T('Choose a Tafsir')}</Text><Text style={s.intro}>{T('Commentary on the Quran, in the language you read it in. Tafsir is one scholar’s reading, not the text itself.')}</Text>{error&&!editions.length?<ErrorState message={error} retry={load}/>:!editions.length?<Spinner/>:<EditionPicker C={C} editions={editions} category="tafsir" searchPlaceholder={T('Search commentary')}  onPick={e=>setPicked(e)}/>}</ScrollView></Page>;return <Page><ToolBar title={T('Tafsir')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Pressable onPress={()=>setPicked(null)} style={s.editionChip}><Text style={{fontSize:20}}>{languageFlag(picked.language||'ar')}</Text><View style={{flex:1}}><Text style={s.settingName}>{editionDisplayName(picked)}</Text><Text style={s.meta}>{editionSubtitle(picked)}</Text></View><Text style={s.sectionAction}>{T('Change')}</Text></Pressable><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,marginTop:12}}>{chapters.map(c=><ChoicePill key={c.number} label={rtl?c.nameArabic:c.nameSimple} selected={c.number===surah} onPress={()=>setSurah(c.number)}/>)}</ScrollView>{busy&&!result?<Spinner/>:error?<ErrorState message={error}/>:result&&<View style={{marginTop:12}}>{result.rows.map(row=><View key={row.verseKey} style={s.dataCard}><Text style={s.dataMeta}>{title} · {T('AYAH')} {row.numberInSurah}</Text><Text style={s.dataBody}>{stripTafsirMarkup(row.text)}</Text></View>)}</View>}</ScrollView></Page>}
function TafsirCompareScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const verse:Verse=route.params?.verse||{verse_key:'2:255',text_uthmani:''};const[reference,setReference]=useState(verse.verse_key);const{preferences}=useQuranPreferences();const{width}=useWindowDimensions();const[mode,setMode]=useState<'translation'|'tafsir'>('translation');const[editions,setEditions]=useState<QuranEdition[]>([]);const[selected,setSelected]=useState<string[]>([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i));const[rows,setRows]=useState<any[]>([]);const[query,setQuery]=useState('');const[error,setError]=useState('');const loadEditions=()=>getQuranEditions(mode).then(setEditions).catch(e=>setError(T(e.message)));const load=async()=>{setError('');const ids=[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,...selected];const cacheKey=`${reference}:${ids.join(',')}`;const cached=mode==='tafsir'?await getCachedJson<any[]>('tafsir',cacheKey):null;if(cached)setRows(cached);try{const fresh=await getAyahEditions(reference,ids);setRows(fresh);if(mode==='tafsir')await setCachedJson('tafsir',cacheKey,fresh)}catch(e:any){if(!cached)setError(T(e.message))}};useEffect(()=>{loadEditions()},[mode]);useEffect(()=>{load()},[reference,selected.join('|'),preferences.scriptEdition]);useEffect(()=>{if(mode==='tafsir')setSelected(['ar.jalalayn']);else setSelected([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i))},[mode]);const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.length>1?current.filter(x=>x!==id):current:current.length<(mode==='translation'?3:1)?[...current,id]:current);const results=query.trim().length<2?[]:editions.filter(e=>`${e.englishName} ${e.name} ${e.language}`.toLowerCase().includes(query.toLowerCase())).slice(0,30);const arabic=rows[0];const compared=rows.slice(1);const wide=width>=760;const columnWidth=wide?Math.max(260,(Math.min(width-40,900)-12*(compared.length-1))/Math.max(1,compared.length)):0;return <Page><ToolBar title={T('Tafsir & comparison')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>
      {/* Where you are. The stepper moves one verse; the field takes a typed one. */}
      <View style={s.tcRefBar}>
        <Pressable accessibilityLabel={T('Previous verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${Math.max(1,v-1)}`)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable>
        <TextInput accessibilityLabel={T('Verse reference')} value={reference} onChangeText={setReference} onSubmitEditing={load} style={[s.referenceInput,{flex:1}]}/>
        <Pressable accessibilityLabel={T('Next verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${v+1}`)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable>
      </View>
      <View style={s.choiceRow}><ChoicePill label={T('Translations')} selected={mode==='translation'} onPress={()=>setMode('translation')}/><ChoicePill label={T('Tafsir')} selected={mode==='tafsir'} onPress={()=>setMode('tafsir')}/></View>

      {/* The verse first, so every column below has something to be read against. */}
      {!!arabic?.text && <View style={s.tcVerse}><Text style={s.dataMeta}>{T('ARABIC REFERENCE')} · {arabic?.name}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={arabic?.text||''} style={s.dataArabic}/>:<Text style={s.dataArabic}>{arabic?.text}</Text>}</View>}

      <Text style={s.tcSectionLabel}>{mode==='tafsir'?T('TAFSIR SOURCE'):T('COMPARING')}</Text>
      <View style={s.tcChosen}>{selected.map(id=>{const e=editions.find(x=>x.identifier===id);return <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${T('Remove')} ${e?.englishName||id}`} onPress={()=>toggle(id)} style={s.tcChip}><Flag code={e?.language||'en'} size={14}/><Text numberOfLines={1} style={s.tcChipText}>{e?.englishName||id}</Text>{ico('close',13,C.green)}</Pressable>})}</View>

      <View style={[s.search,{marginTop:10}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T(mode === 'translation' ? 'Search language or translator' : 'Search Tafsir source')} style={s.searchInput}/></View>
      {!!results.length && <View style={s.editionPicker}>{results.map(e=><Pressable accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(e.identifier)}} key={e.identifier} onPress={()=>toggle(e.identifier)} style={[s.editionChip,selected.includes(e.identifier)&&s.editionChipActive]}><Flag code={e.language} size={16} /><View style={{flex:1}}><Text numberOfLines={1} style={s.settingName}>{e.englishName}</Text><Text numberOfLines={1} style={s.meta}>{e.language.toUpperCase()} · {e.identifier}</Text></View>{ico(selected.includes(e.identifier)?'checkmark-circle':'add-circle-outline',19,selected.includes(e.identifier)?C.green:C.muted)}</Pressable>)}</View>}
      <Text style={s.comparisonHelp}>{T(mode === 'translation' ? 'Tap a chip to drop it, or search for another. Up to three at a time.' : 'Select a live Tafsir source and language.')}</Text>

      {error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<View style={[s.tcColumns,wide&&{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-start'}]}>
        {/* Stacked on a phone, side by side when the screen is wide enough for it. */}
        {compared.map(row=><View key={row.edition} style={[s.tcCard,wide&&{width:columnWidth}]}>
          <View style={s.tcCardHead}><Flag code={row.language} size={16} /><Text numberOfLines={1} style={s.tcCardName}>{row.name}</Text><Text style={s.tcCardLang}>{row.language.toUpperCase()}</Text></View>
          <Text style={row.language==='ar'?s.dataArabic:s.comparisonText}>{row.text}</Text>
        </View>)}
      </View>}
    </ScrollView></Page>}

function QuranTopicsScreen({navigation}:any){const[category,setCategory]=useState('All');const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[query,setQuery]=useState('');const shown=QURAN_TOPICS.filter(topic=>(category==='All'||topic.category===category)&&`${topic.title} ${topic.description} ${topic.titleAr} ${topic.descriptionAr}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title={T('Quran topics')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Topics" size={74}/><Text style={s.dataTitle}>{T('Explore the Quran by theme')}</Text><Text style={s.intro}>{T('Curated references open the Arabic text alongside your selected translation.')}</Text><View style={s.search}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T('Search faith, family, patience…')} style={s.searchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8,marginVertical: 12}}>{['All','Faith','Life','Spirituality'].map(item=><ChoicePill key={item} label={T(item)} selected={category===item} onPress={()=>setCategory(item)}/>)}</ScrollView><View style={s.topicGrid}>{shown.map(topic=><MotionPress key={topic.id} onPress={()=>navigation.navigate('Topic Detail',{topic})} style={s.topicWrap}><View style={s.topicCard}><Text style={s.libraryKicker}>{topicCategory(topic,rtl)}</Text><Text style={s.exploreTitle}>{topicTitle(topic,rtl)}</Text><Text style={s.exploreBody}>{topicDescription(topic,rtl)}</Text><Text style={s.dataMeta}>{rtl?`${topic.references.length} آيات`:`${topic.references.length} VERSES`}</Text></View></MotionPress>)}</View></ScrollView></Page>}


function TopicDetailScreen({route,navigation}:any){const topic=route.params.topic;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const load=()=>{setError('');return Promise.all(topic.references.map((ref:string)=>getAyahEditions(ref,[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,preferences.translationEdition]))).then(groups=>setRows(groups.map((items,i)=>({reference:topic.references[i],arabic:items[0],translation:items[1]})))).catch(e=>setError(T(e.message)))};useEffect(()=>{load()},[topic.id,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={topicTitle(topic,rtl)} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.libraryKicker}>{topicCategory(topic,rtl)}</Text><Text style={s.dataTitle}>{topicTitle(topic,rtl)}</Text><Text style={s.intro}>{topicDescription(topic,rtl)}</Text>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:rows.map(row=><Pressable key={row.reference} onPress={()=>{const[surah]=row.reference.split(':').map(Number);navigation.navigate('Reader',{chapter:{id:surah,name_simple:row.arabic?.name||`Surah ${surah}`,name_arabic:'',verses_count:0},focusVerse:row.reference})}} style={s.dataCard}><Text style={s.dataMeta}>{T('QURAN')} {row.reference}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={row.arabic.text} style={s.dataArabic}/>:<Text style={s.dataArabic}>{row.arabic.text}</Text>}<Text style={s.dataBody}>{row.translation.text}</Text><Text style={s.meta}>{row.translation.name}</Text></Pressable>)}</ScrollView></Page>}

function VocabularyScreen({navigation}:any){const[index,setIndex]=useState(0);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[revealed,setRevealed]=useState(false);const[progress,setProgress]=useState<{reviewed:string[];known:string[]}>({reviewed:[],known:[]});useEffect(()=>{loadVocabularyProgress().then(setProgress)},[]);const word=QURAN_VOCABULARY[index];const mark=async(known:boolean)=>{const value={reviewed:[...new Set([...progress.reviewed,word.id])],known:known?[...new Set([...progress.known,word.id])]:progress.known.filter(id=>id!==word.id)};setProgress(value);await saveVocabularyProgress(value);setRevealed(false);setIndex(valueIndex=>(valueIndex+1)%QURAN_VOCABULARY.length)};return <Page><ToolBar title={T('Quran vocabulary')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Vocabulary" size={74}/><Text style={s.dataTitle}>{T('Frequent Quranic words')}</Text><Text style={s.intro}>{T('A private flashcard review based on high-frequency lemmas and verbs documented by the Quranic Arabic Corpus.')}</Text><View style={s.vocabStats}><Text style={s.settingName}>{rtl?`${progress.known.length} محفوظة`:`${progress.known.length} known`}</Text><Text style={s.meta}>{rtl?`${progress.reviewed.length} مُراجَع · ${QURAN_VOCABULARY.length} بطاقة`:`${progress.reviewed.length} reviewed · ${QURAN_VOCABULARY.length} cards`}</Text></View><Pressable accessibilityLabel={`${word.arabic}. ${revealed?`${word.transliteration}, ${word.meaning}`:T('Tap to reveal meaning')}`} onPress={()=>setRevealed(value=>!value)} style={s.flashcard}><Text style={s.flashIndex}>{index+1} / {QURAN_VOCABULARY.length}</Text><Text style={s.flashArabic}>{word.arabic}</Text>{revealed?<><Text style={s.flashTransliteration}>{word.transliteration}</Text><Text style={s.flashMeaning}>{word.meaning}</Text>{word.root&&<Text style={s.meta}>{T('Root')} · {word.root}</Text>}</>:<Text style={s.flashHint}>{T('Tap to reveal')}</Text>}</Pressable>{revealed&&<View style={s.actionRow}><Pressable onPress={()=>mark(false)} style={s.secondary}><Text style={s.secondaryText}>{T('Review again')}</Text></Pressable><Pressable onPress={()=>mark(true)} style={s.primary}><Text style={s.primaryText}>{T('I know this')}</Text></Pressable></View>}<View style={s.mushafNav}><Pressable onPress={()=>{setRevealed(false);setIndex((index-1+QURAN_VOCABULARY.length)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable><Pressable onPress={()=>Linking.openURL('https://corpus.quran.com/lemmas.jsp')} style={s.sectionLink}><Text style={s.sectionAction}>{T('Frequency source')}</Text></Pressable><Pressable onPress={()=>{setRevealed(false);setIndex((index+1)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable></View></ScrollView></Page>}

function TajweedStudyScreen({navigation}:any){const[reference,setReference]=useState('2:255');const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const[showNormal,setShowNormal]=useState(false);const load=()=>{if(!/^([1-9]|[1-9]\d|1(?:0\d|1[0-4])):([1-9]\d*)$/.test(reference.trim())){setError(T('Enter a verse reference such as 2:255.'));return}setError('');setRows([]);getAyahEditions(reference.trim(),['quran-tajweed','quran-uthmani','en.sahih']).then(setRows).catch(e=>setError(T(e.message)))};useEffect(load,[]);return <Page><ToolBar title={T('Tajweed study')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Tajweed" size={74}/><Text style={s.dataTitle}>{T('Read the rules in colour')}</Text><Text style={s.intro}>{T('Each Tajweed rule is coloured where it applies. Colours are a learning aid and do not replace study with a qualified teacher.')}</Text><View style={s.search}><TextInput value={reference} onChangeText={setReference} onSubmitEditing={load} placeholder="2:255" style={s.searchInput}/><Pressable accessibilityLabel={T('Load this verse')} onPress={load} style={s.searchGo}>{ico('arrow-forward-circle',23,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label={T('Tajweed colour')} selected={!showNormal} onPress={()=>setShowNormal(false)}/><ChoicePill label={T('Normal text')} selected={showNormal} onPress={()=>setShowNormal(true)}/></View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<View style={s.tajweedPractice}><Text style={s.dataMeta}>{T('QURAN')} {reference}</Text>{showNormal?<Text style={s.dataArabic}>{rows[1]?.text}</Text>:<TajweedText text={rows[0]?.text||''} style={s.dataArabic}/>}<Text style={s.dataBody}>{rows[2]?.text}</Text></View>}<Section title={T('Colour legend')}/><View style={s.settings}>{TAJWEED_RULES.map(rule=><View key={rule.name} style={s.tajweedRule}><View style={[s.tajweedSwatch,{backgroundColor:rule.color}]}/><View style={{flex:1}}><Text style={s.settingName}>{tajweedName(rule,rtl)}</Text><Text style={s.meta}>{tajweedDetail(rule,rtl)}</Text></View></View>)}</View></ScrollView></Page>}

function JuzDirectoryScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <Page><ToolBar title={T('30 Juz')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="30 Juz" size={72}/><Text style={s.dataTitle}>{T('Read by Juz')}</Text><View style={s.juzGrid}>{Array.from({length:30},(_,i)=>i+1).map(juz=><Pressable key={juz} onPress={()=>navigation.navigate('Reader',{section:'juz',juz})} style={s.juzCard}><Text style={s.juzNo}>{juz}</Text><Text style={s.meta}>{T('JUZ')}</Text></Pressable>)}</View></ScrollView></Page>}
function HizbDirectoryScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <Page><ToolBar title={T('60 Hizb')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="60 Hizb" size={72}/><Text style={s.dataTitle}>{T('Read by Hizb')}</Text><Text style={s.intro}>{T('Each Hizb contains four quarter-Hizb sections.')}</Text><View style={s.juzGrid}>{Array.from({length:60},(_,i)=>i+1).map(hizb=><Pressable key={hizb} onPress={()=>navigation.navigate('Reader',{section:'hizb',hizb})} style={s.juzCard}><Text style={s.juzNo}>{hizb}</Text><Text style={s.meta}>{T('HIZB')}</Text></Pressable>)}</View></ScrollView></Page>}
function QuranPreloadScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[state,setState]=useState(getPreloadState());useEffect(()=>{const unsubscribe=subscribePreload(setState);refreshPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return unsubscribe},[preferences.scriptEdition,preferences.translationEdition]);const start=()=>startQuranPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return <Page><ToolBar title={T('Offline Quran')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Offline Quran" size={76}/><Text style={s.dataTitle}>{T('Prepare for offline reading')}</Text><Text style={s.intro}>{T('Downloads the Arabic script and translation you have selected, one Surah at a time. Preparation continues while you use other screens and prioritizes your current reading Surah.')}</Text><View style={s.preloadScore}><Text style={s.planDays}>{state.cached}</Text><Text style={s.settingName}>{T('of 114 Surahs cached')}</Text><View style={s.preloadTrack}><View style={[s.preloadFill,{width:`${state.cached/114*100}%`} as any]}/></View><Text style={s.meta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}{state.current?(rtl?` · يجهّز سورة ${state.current}`:` · Preparing Surah ${state.current}`):''}</Text>{state.usage&&<Text style={s.cacheUsage}>{rtl?`ذاكرة المصحف ${(state.usage.byNamespace.quran/1048576).toFixed(1)} ميغابايت · الحد ${(state.usage.limits.quran/1000000).toFixed(0)} ميغابايت · الإجمالي ${(state.usage.limits.total/1000000).toFixed(0)} ميغابايت`:`Quran cache ${(state.usage.byNamespace.quran/1048576).toFixed(1)} MB · limit ${(state.usage.limits.quran/1000000).toFixed(0)} MB · total limit ${(state.usage.limits.total/1000000).toFixed(0)} MB`}</Text>}</View>{state.error&&<ErrorState message={state.error} retry={start}/>}<View style={s.actionRow}>{!state.running?<Pressable onPress={start} style={s.primary}><Text style={s.primaryText}>{T(state.cached ? 'Resume preparation' : 'Preload all')}</Text></Pressable>:<Pressable onPress={pauseQuranPreload} style={s.secondary}><Text style={s.secondaryText}>{T('Pause')}</Text></Pressable>}<Pressable onPress={clearPreparedQuran} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear Quran cache')}</Text></Pressable></View><View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Managed low-priority preparation')}</Text><Text style={s.sourceBody}>{T('Cached Surahs open first, already-saved content is skipped, and bounded LRU storage prevents unlimited growth.')}</Text></View></View></ScrollView></Page>}
function ReadingPlansScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[plan,setPlan]=useState<any>(null);useEffect(()=>{loadPlan().then(setPlan)},[]);const start=async(days:number)=>{const next={days,startedAt:Date.now(),completed:[]};await savePlan(next);setPlan(next)};const today=plan?Math.min(plan.days,Math.floor((Date.now()-plan.startedAt)/86400000)+1):0;const toggle=async()=>{const completed=plan.completed.includes(today)?plan.completed.filter((x:number)=>x!==today):[...plan.completed,today];const next={...plan,completed};await savePlan(next);setPlan(next)};return <Page><ToolBar title={T('Reading plans')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Reading Plans" size={72}/><Text style={s.dataTitle}>{T('Complete the Quran')}</Text>{!plan?<><Text style={s.intro}>{T('Choose a private local plan. Progress stays on this device.')}</Text><View style={s.planGrid}>{[30,60,90,120].map(days=><Pressable key={days} onPress={()=>start(days)} style={s.planCard}><Text style={s.planDays}>{days}</Text><Text style={s.settingName}>{T('day plan')}</Text><Text style={s.meta}>{rtl?`${(604/days).toFixed(1)} صفحة يومياً`:`${(604/days).toFixed(1)} pages daily`}</Text></Pressable>)}</View></>:<><View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('CURRENT DAY')}</Text><Text style={s.zakatNo}>{today} / {plan.days}</Text></View><View><Text style={s.nextCardLabel}>{T('COMPLETED')}</Text><Text style={s.zakatNo}>{plan.completed.length}</Text></View></View><Pressable onPress={toggle} style={s.planToday}><Text style={s.settingName}>{rtl?`قراءة اليوم ${today}`:`Day ${today} reading`}</Text>{ico(plan.completed.includes(today)?'checkmark-circle':'ellipse-outline',28,C.green)}</Pressable><Pressable onPress={async()=>{await savePlan(null);setPlan(null)}} style={s.dangerButton}><Text style={s.dangerText}>{T('End current plan')}</Text></Pressable></>}</ScrollView></Page>}
function HifzScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[chapters,setChapters]=useState<Chapter[]>([]);const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[filter,setFilter]=useState<'all'|HifzStatus>('all');useEffect(()=>{getChapters().then(setChapters);loadHifz().then(setStatus)},[]);const cycle=async(id:number)=>{const current=status[id]||'not-started';const next:HifzStatus=current==='not-started'?'revising':current==='revising'?'memorized':'not-started';const value={...status,[id]:next};setStatus(value);await saveHifz(value)};const shown=chapters.filter(c=>filter==='all'||(status[c.id]||'not-started')===filter);const memorized=Object.values(status).filter(x=>x==='memorized').length;return <Page><ToolBar title={T('Hifz tracker')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={72}/><Text style={s.dataTitle}>{rtl?`حفظت ${memorized} من 114`:`${memorized} of 114 memorized`}</Text><Pressable onPress={()=>navigation.navigate('Memorize')} style={s.practiceLaunch}><View><Text style={s.settingName}>{T('Hide-and-peek recall')}</Text><Text style={s.meta}>{T('Test a verse from your revising or memorized Surahs')}</Text></View>{ico('play-circle',28,C.green)}</Pressable><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>{(['all','not-started','revising','memorized'] as const).map(value=><ChoicePill key={value} label={T(value.replace('-',' '))} selected={filter===value} onPress={()=>setFilter(value)}/>)}</ScrollView><View style={{height:13}}/><View style={s.settings}>{shown.map(c=><Pressable key={c.id} onPress={()=>cycle(c.id)} style={s.translationRow}><View style={s.surahNum}><Text style={s.surahNumText}>{c.id}</Text></View><View style={{flex:1}}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.meta}>{rtl?`${c.verses_count} آية`:`${c.verses_count} verses`}</Text></View><Text style={s.hifzStatus}>{T((status[c.id]||'not-started').replace('-',' '))}</Text></Pressable>)}</View></ScrollView></Page>}

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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
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
    <ScrollView contentContainerStyle={s.dataPage}>
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
      <Pressable onPress={() => open(undefined, T('Weak bank'))} style={s.practiceLaunch}>
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Weak bank')}</Text>
          <Text style={s.meta}>{bank.length
            ? T('What you have flagged, and whatever scores lowest')
            : T('Empty for now — flag a verse during practice and it waits here')}</Text>
        </View>
        {ico('play-circle', 28, C.green)}
      </Pressable>
      {working.length ? <View style={s.settings}>
        {working.map((chapter) => <Pressable key={chapter.id} onPress={() => open(chapter.id, chapter.name_simple)} style={s.memRow}>
          <View style={s.surahNum}><Text style={s.surahNumText}>{chapter.id}</Text></View>
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

      <Pressable onPress={() => { void clearMemorization(); }} style={s.dangerButton}>
        <Text style={s.dangerText}>{T('Erase all memorisation history')}</Text>
      </Pressable>
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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
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

  if (loading) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><Spinner /></Page>;
  if (error) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><ScrollView contentContainerStyle={s.dataPage}><ErrorState message={error} retry={load} /></ScrollView></Page>;
  if (!current || !verse) return <Page><ToolBar title={scopeLabel} navigation={navigation} /><View style={s.emptyWrap}>
    <Text style={s.emptyTitle}>{T('Nothing to test yet')}</Text>
    <Text style={s.emptyBody}>{surahId
      ? T('This Surah has no verses to hand at the moment.')
      : T('Flag a verse during practice and it will wait for you here.')}</Text>
    <Pressable onPress={() => navigation.goBack()} style={s.primary}><Text style={s.primaryText}>{T('Back')}</Text></Pressable>
  </View></Page>;

  const useTajweed = preferences.scriptEdition === 'quran-tajweed' && (open || !!answer);
  const live = mem.verses[current.verseKey];
  const percent = Math.round(confidenceOf(live || current) * 100);

  return <Page><ToolBar title={scopeLabel} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage}>
      <Text style={s.memTarget}>{current.surahName} · {current.verseKey}</Text>
      <Text style={s.meta}>{current.attempts
        ? T(`Asked ${current.attempts} times · ${percent}% remembered`)
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
        <Pressable onPress={() => { void mark('correct'); }} style={s.primary}><Text style={s.primaryText}>{T('I knew it')}</Text></Pressable>
        {settings.mode === 'progressive' && !open
          ? <Pressable onPress={() => setRevealed((value) => Math.min(total, value + settings.revealStep))} style={s.secondary}>
              {ico('add', 16, C.green)}<Text style={s.secondaryText}>{T('Show more')}</Text></Pressable>
          : null}
        {!open
          ? <Pressable onPress={() => setOpen(true)} style={s.secondary}>
              {ico('eye-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Show me')}</Text></Pressable>
          : <Pressable onPress={() => { void mark('wrong'); }} style={s.secondary}>
              {ico('close-outline', 16, C.coral)}<Text style={s.secondaryText}>{T('I didn’t know it')}</Text></Pressable>}
      </View>}

      {answer && <View style={s.memAnswerCard}>
        <Text style={s.memAnswerTitle}>{answer.result === 'correct' ? T('Marked as known') : T('Marked for review')}</Text>
        <Text style={s.memAnswerBody}>{T(`Counted with ${Math.round(answer.revealedRatio * 100)}% of the verse on screen. Now ${percent}% remembered.`)}</Text>
        <View style={s.memActions}>
          <Pressable onPress={() => { void demoteCurrent(); }} style={s.secondary}>
            {ico('arrow-down-circle-outline', 16, C.gold)}<Text style={s.secondaryText}>{T('Move to weak bank')}</Text></Pressable>
          <Pressable onPress={() => { void undoCurrent(); }} style={s.secondary}>
            {ico('arrow-undo-outline', 16, C.green)}<Text style={s.secondaryText}>{T('That was a mis-tap')}</Text></Pressable>
        </View>
        <Text style={[s.meta, { marginTop: 8 }]}>{T('Moving to the weak bank keeps the attempt and holds the verse there. Undoing stops it counting at all.')}</Text>
      </View>}

      {answer && <Pressable onPress={next} style={s.primary}><Text style={s.primaryText}>{T('Next verse')}</Text></Pressable>}
    </ScrollView>
  </Page>;
}

function QuranStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="QuranHome" component={QuranHome}/><Stack.Screen name="Downloads" component={DownloadsScreen}/><Stack.Screen name="Reader" component={ReaderScreen}/><Stack.Screen name="Translations" component={TranslationScreen}/><Stack.Screen name="Quran Search" component={QuranSearchScreen}/><Stack.Screen name="Bookmarks" component={BookmarkScreen}/><Stack.Screen name="Notes" component={NotesScreen}/><Stack.Screen name="Note Editor" component={needsPayload(NoteEditorScreen, 'Note')}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}
      options={{presentation:'transparentModal',animation:'slide_from_bottom',contentStyle:{backgroundColor:'transparent'}}}/>{/* 'Ayah Actions' was a screen; it is the verse actions sheet now. The route is
    gone on purpose - a restored stack naming it is dropped by the navigator. */}<Stack.Screen name="Tafsir" component={TafsirScreen}/><Stack.Screen name="Tafsir Compare" component={TafsirCompareScreen}/><Stack.Screen name="Quran Topics" component={QuranTopicsScreen}/><Stack.Screen name="Topic Detail" component={TopicDetailScreen}/><Stack.Screen name="Juz Directory" component={JuzDirectoryScreen}/><Stack.Screen name="Hizb Directory" component={HizbDirectoryScreen}/><Stack.Screen name="Reading Plans" component={ReadingPlansScreen}/><Stack.Screen name="Quran Preload" component={QuranPreloadScreen}/><Stack.Screen name="Hifz" component={HifzScreen}/><Stack.Screen name="Memorize" component={MemorizeHubScreen}/><Stack.Screen name="Memorize Test" component={MemorizeTestScreen}/><Stack.Screen name="Quran Audio" component={AudioCenterScreen}/><Stack.Screen name="Audio Player" component={AudioPlayerScreen}/></Stack.Navigator>}

/**
 * The library holds what you read, recite and learn. Nothing here calculates
 * or looks anything up — Zakat and Mosques moved to Tools, and recitation
 * moved to the Quran tab, where the audio screens already live.
 */
/** The guides that belong to Ramadan and the two Eids, kept together. */
const RAMADAN_GUIDE_IDS = ['Ramadan Guide', 'Fasting Guide', 'Laylatul Qadr', 'Zakat al-Fitr', 'Eid Prayer Guide', 'Taraweeh Guide'];

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
    { title: 'Quran Vocabulary', caption: 'Flashcards of the words you meet most', route: 'Quran Vocabulary' },
    { title: 'Tajweed', caption: 'Colour-coded reading rules', route: 'Tajweed Study' },
  ]},
  { label: 'REMEMBER', title: 'What you say', items: [
    { title: 'Duas', caption: 'Hisn al-Muslim by occasion', route: 'Duas' },
    { title: 'Adhkar', caption: 'Morning and evening remembrance', route: 'Adhkar' },
    { title: 'Shahada', caption: 'The declaration of faith', route: 'Guide Detail', params: { guide: WORSHIP_GUIDES.find((guide) => guide.id === 'Shahada') } },
  ]},
  { label: 'GUIDES', title: 'Step by step', items: [
    { title: 'Worship guides', caption: 'Wudu, Salah, Janazah and more', route: 'Worship Guides' },
    { title: 'Ramadan', caption: 'Fasting, Laylatul Qadr and Zakat al-Fitr', route: 'Worship Guides', params: { group: 'ramadan' } },
    { title: 'Umrah', caption: 'Ihram, Tawaf and Sa’i, rite by rite', route: 'Journey', params: { kind: 'umrah' } },
    { title: 'Hajj', caption: 'A day-by-day timeline of the journey', route: 'Journey', params: { kind: 'hajj' } },
    { title: 'Purity', caption: 'Step-by-step ghusl and the signs of tuhr', route: 'Purity' },
  ]},
];
/**
 * The library. Every card opens a screen in this stack, and a journey is
 * started on the way in so the journey screen always has one to show.
 */
function ExploreHome({navigation}:any){
  const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const journeys=useJourneys();
  const open=(item:LibraryItem)=>{
    const kind=item.params?.kind as JourneyKind|undefined;
    if(kind&&!journeys.active[kind])startJourney(kind,journeyMeta(kind,rtl).title);
    navigation.navigate(item.route,item.params);
  };
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/><Text style={s.intro}>{T('Remembrance, trusted learning and step-by-step guidance—organized by purpose rather than hidden in a feature grid.')}</Text>{libraryGroups.map(group=><View key={group.label}><Text style={s.libraryKicker}>{T(group.label)}</Text><Text style={s.libraryHeading}>{T(group.title)}</Text><View style={s.exploreGrid}>{group.items.map((item)=>{return <MotionPress key={item.title} onPress={()=>open(item)} style={s.exploreCard}><View style={s.exploreCardInner}><ToolGraphic tool={item.title} size={64}/><Text style={s.exploreTitle}>{T(item.title)}</Text><Text style={s.exploreBody}>{T(item.caption)}</Text><View style={s.exploreArrow}>{ico('arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></View>)}</ScrollView></Page>;}
function ToolBar({title,navigation}:any){const{rtl}=useLanguage();return <View style={s.readerBar}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/><Text style={s.readerName}>{title}</Text><View style={{width:44}}/></View>}
function QiblaScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{location}=useAppLocation();const[direction,setDirection]=useState<number|null>(null);const[error,setError]=useState('');const load=async()=>{if(!location)return;setDirection(null);setError('');try{setDirection(await getQibla(location.latitude,location.longitude))}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title={T('Qibla direction')} navigation={navigation}/>{!location?<View style={s.dataPage}><LocationPrompt compact/></View>:<View style={s.toolPage}><Text style={s.toolEyebrow}>{T(location.label)}</Text>{error?<ErrorState message={error} retry={load}/>:direction===null?<Spinner/>:<><View style={s.compass}><Text style={s.north}>N</Text><View style={[s.compassArrow,{transform:[{rotate:`${direction}deg`}]}]}>{ico('navigate',74,C.green)}</View><View style={s.kaaba}><View style={s.kaabaGold}/></View></View><Text style={s.direction}>{direction.toFixed(1)}°</Text><Text style={s.directionText}>{T('clockwise from true north')}</Text><Pressable onPress={load} style={s.primary}><Text style={s.primaryText}>{T('Refresh direction')}</Text></Pressable></>}</View>}</Page>}
function TasbihScreen({ navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
  return <Page><ToolBar title={T('Tasbih')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Tasbih" size={68} />
      <Text style={s.dataTitle}>{T('Dhikr counter')}</Text>
      <Text style={s.intro}>{T('Count privately on this device. Nothing is sent anywhere and no account is needed.')}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
        {DHIKR_PHRASES.map((item) => <ChoicePill key={item.id} label={rtl ? item.arabic : item.transliteration} selected={item.id === state.phraseId} onPress={() => { void setTasbihPhrase(item.id); }} />)}
      </ScrollView>

      <View style={s.tasbihCard}>
        <Text style={s.tasbihAr}>{phrase.arabic}</Text>
        <Text style={s.directionText}>{dhikrMeaning(phrase, rtl)}</Text>
        <Pressable accessibilityLabel={T('Count one dhikr')} onPress={tap} style={[s.counter, width < 360 && { width: width - 80, height: width - 80 }]}>
          <Animated.View style={{ transform: [{ scale: press }], alignItems: 'center' }}>
            <Text style={s.counterNo}>{state.count}</Text>
            <Text style={s.counterGoal}>{celebrated ? T('COMPLETE') : (rtl ? `الهدف · ${state.goal}` : `GOAL · ${state.goal}`)}</Text>
          </Animated.View>
        </Pressable>
        <View style={s.hadithTrack}><View style={[s.hadithFill, { width: `${progress}%` }]} /></View>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel={T('Reset the current count')} onPress={() => void resetTasbihCount()} style={s.secondary}>{ico('refresh-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Reset')}</Text></Pressable>
          <Pressable accessibilityLabel={T('Save this round to history')} onPress={() => void saveTasbihSession()} style={s.secondary}>{ico('checkmark-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Save round')}</Text></Pressable>
        </View>
      </View>

      <Section title={T('Goal')} />
      <View style={s.choiceRow}>
        {TASBIH_GOALS.map((goal) => <ChoicePill key={goal} label={`${goal}`} selected={goal === state.goal} onPress={() => { void setTasbihGoal(goal); }} />)}
      </View>

      <Section title={T('Today')} />
      <View style={s.dataCard}>
        <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{T('Counted today')}</Text><Text style={s.hadithProgressName}>{total}</Text></View>
        <Text style={s.meta}>{rtl ? `الجولات المكتملة لهذا الذكر: ${state.rounds}` : `Rounds completed on this phrase: ${state.rounds}`}</Text>
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
    </ScrollView></Page>}

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

function DuaCard({ dua }: { dua: Dua }) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const [openSource, setOpenSource] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = [dua.arabic, dua.transliteration, dua.translation].filter(Boolean).join('\n\n');
  const copy = async () => {
    try { await Clipboard.setStringAsync(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ }
  };
  const share = async () => {
    try { await Share.share({ message: `${text}${dua.reference ? `\n\n${dua.reference}` : ''}` }); } catch { /* sharing unavailable */ }
  };
  return <View style={s.dataCard}>
    <Text style={s.dataArabic}>{dua.arabic}</Text>
    {!!dua.transliteration && <>
      <Text style={s.duaKicker}>{T('TRANSLITERATION')}</Text>
      <Text style={s.duaTransliteration}>{dua.transliteration}</Text>
    </>}
    <Text style={s.duaKicker}>{T('MEANING')}</Text>
    <Text style={s.dataBody}>{dua.translation}</Text>
    {!!dua.reference && <Pressable accessibilityLabel={T('Show the source of this dua')} onPress={() => setOpenSource(!openSource)} style={s.sectionLink}>
      <Text style={s.duaRefToggle}>{openSource ? 'Hide source' : 'Source'}</Text>
      {openSource && <Text style={s.duaReference}>{dua.reference}</Text>}
    </Pressable>}
    <View style={s.actionRow}>
      <Pressable accessibilityLabel={T('Copy this dua')} onPress={copy} style={s.secondary}>{ico('copy-outline', 16, C.green)}<Text style={s.secondaryText}>{copied ? 'Copied' : 'Copy'}</Text></Pressable>
      <Pressable accessibilityLabel={T('Share this dua')} onPress={share} style={s.secondary}>{ico('share-outline', 16, C.green)}<Text style={s.secondaryText}>{T('Share')}</Text></Pressable>
    </View>
  </View>;
}

function DownloadsScreen({ route, navigation }: any) {
  const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
    label: rtl ? `${editionLabel} · السورة كاملة` : `${editionLabel} · full Surah`,
    url
  }));
  const keepText = () => run('text', () => downloadSurahText({
    chapterId: focusId as number,
    chapterName: focusName,
    script: preferences.scriptEdition === 'quran-indopak' ? 'quran-uthmani' : preferences.scriptEdition,
    translation: preferences.translationEdition,
    label: `${preferences.scriptName} · ${preferences.translationName}`
  }));
  const used = totalDownloadBytes();
  return <Page><ToolBar title={T('Downloads')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Offline Quran" size={68} />
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
          <Pressable accessibilityLabel={T('Keep the text for this Surah')} disabled={busy === 'text'} onPress={() => { void keepText(); }} style={[s.secondary, busy === 'text' && { opacity: 0.5 }]}><Text style={s.secondaryText}>{T(busy === 'text' ? 'Saving…' : 'Keep text')}</Text></Pressable>
        </View>
        {!url && !!source.note && <Text style={s.meta}>{source.note}</Text>}
        {!!url && <Text style={s.meta}>{T(settings.reciterMode === 'surah' ? 'One file for the whole Surah.' : 'Fetched in 4 MB pieces, checked against the size the source reports, then saved.')}</Text>}
      </View>}

      {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}

      <Section title={rtl ? `المحفوظ (${downloads.length})` : `Saved (${downloads.length})`} />
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
          {(item.status === 'failed' || item.status === 'paused') && <Pressable accessibilityLabel={`${T('Retry')} ${item.chapterName}`} onPress={() => { void retryDownload(item.id).catch((error: any) => setMessage(error?.message || 'The download could not be restarted.')); }} style={s.secondary}><Text style={s.secondaryText}>{T('Retry')}</Text></Pressable>}
          {item.status === 'downloading' && <Pressable accessibilityLabel={`${T('Pause')} ${item.chapterName}`} onPress={() => { void pauseDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>{T('Pause')}</Text></Pressable>}
          {item.status === 'paused' && <Pressable accessibilityLabel={`${T('Resume')} ${item.chapterName}`} onPress={() => { void resumeDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>{T('Resume')}</Text></Pressable>}
          <Pressable accessibilityLabel={`${T('Remove')} ${item.chapterName}`} onPress={() => { void removeDownload(item.id); }} style={s.secondary}>{ico('trash-outline', 15, C.coral)}<Text style={[s.secondaryText, { color: C.coral }]}>{T('Remove')}</Text></Pressable>
        </View>
      </View>)}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('How a download is verified')}</Text><Text style={s.apiText}>{T('Files are written to a temporary partial file first, checked against the size the server reported, and only then moved into place. A failed download is deleted rather than left half-written.')}</Text></View>
    </ScrollView></Page>}

function NamesScreen({ navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const { preferences } = useQuranPreferences();
  const [names, setNames] = useState<DivineName[]>([]);
  const [day, setDay] = useState<DivineName | null>(null);
  const [language, setLanguage] = useState('en');
  const [query, setQuery] = useState('');
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
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
  const meaning = (name: DivineName) => (rtl || language === 'ar' ? NAMES_MEANING_AR[name.number] : undefined) || name.meanings?.[language] || name.meanings?.en || name.meaning;
  const pickLanguage = async (code: string) => { setLanguage(code); await saveNameLanguage(code); };
  return <Page><ToolBar title={T('The Beautiful Names')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="99 Names" size={72} />
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

    <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search the Names')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search a Name')} placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel={T('Clear name search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!error && !names.length && <Spinner />}
    {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
    <Text style={s.meta}>{rtl ? `${shown.length} من ${names.length || 99} اسمًا` : `${shown.length} of ${names.length || 99} Names`}</Text>
    {shown.map((name) => <View key={name.number} style={s.nameRow}>
      <View style={s.nameNumber}><Text style={s.hadithNumberText}>{name.number}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={s.namesArabic}>{name.name}</Text>
        <Text style={s.namesTransliteration}>{name.transliteration}</Text>
        <Text style={s.dataBody}>{meaning(name)}</Text>
      </View>
    </View>)}
    {!!names.length && <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Kept on this device')}</Text><Text style={s.apiText}>{rtl?`يُخزَّن الدليل بعد أول زيارة، فتُقرأ الأسماء بلا اتصال. وترجمة القرآن التي تقرأ بها في موضع آخر (${preferences.translationEdition}) لا أثر لها على هذه المعاني.`:`The catalogue is stored after the first visit, so the Names can be read without a connection. The Qur'an translation you use elsewhere (${preferences.translationEdition}) does not affect these meanings.`}</Text></View>}
    <Pressable accessibilityLabel={T('Open the prophets catalogue')} onPress={() => navigation.navigate('Prophet Names')} style={s.secondary}><Text style={s.secondaryText}>{T("Prophets named in the Qur'an")}</Text></Pressable>
  </ScrollView></Page>}

function ProphetNamesScreen({ navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Names" size={68} />
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
                <Text style={s.dataBody}>{rtl ? prophet.noteAr : prophet.note}</Text>
              </View>
              {ico(isOpen ? 'chevron-down' : 'chevron-forward', 16, C.muted)}
            </View>
          </Pressable>
          {isOpen && <>
            <Text style={s.duaKicker}>{T('VERSE')} {prophet.reference}</Text>
            {!!error && <Text style={s.dataMeta}>{error}</Text>}
            {!error && !verse.length && <Spinner />}
            {verse.map((row) => <View key={row.edition}>
              {row.language === 'ar' ? <Text style={s.dataArabic}>{row.text}</Text> : <Text style={s.dataBody}>{row.text}</Text>}
            </View>)}
          </>}
        </View>;
      })}
    </ScrollView></Page>}

function DuasScreen({ navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
  return <Page><ToolBar title={T('Duas and Adhkar')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Duas" size={72} />
    <Text style={s.dataTitle}>{T('Duas and Adhkar')}</Text>
    
    <Text style={s.intro}>{T('Remembrance for 132 occasions, in Arabic with transliteration and meaning. Each entry keeps the reference the source gives for it.')}</Text>

    <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search occasions')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search an occasion')} placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel={T('Clear occasion search')} onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!payload && !error && <Spinner />}
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

function DuaCategoryScreen({ route, navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <Spinner />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)}
      {!!duas.length && <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Collection')}</Text><Text style={s.apiText}>{duas[0].category || label}</Text></View>}
    </ScrollView></Page>}

function AdhkarScreen({ route, navigation }: any) {const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const [category, setCategory] = useState(route.params?.initial || 'morning');
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool={active.graphic} size={72} />
      <Text style={s.dataTitle}>{active.title}</Text>
      <View style={s.choiceRow}>
        {tabs.map(tab => <ChoicePill key={tab.key} label={tab.label} selected={category === tab.key} onPress={() => setCategory(tab.key)} />)}
      </View>
      <View style={{ height: 12 }} />
      <Pressable accessibilityLabel={T('Browse every occasion')} onPress={() => navigation.navigate('Duas')} style={s.secondary}><Text style={s.secondaryText}>{T('All duas and occasions')}</Text></Pressable>
      <View style={{ height: 14 }} />
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <Spinner />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{T('Read from this device — the network is not reachable right now.')}</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)}
    </ScrollView></Page>}

function DataTool({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
 const {location}=useAppLocation(); const title=route.name; const[items,setItems]=useState<any[]>([]); const[error,setError]=useState(''); const[loaded,setLoaded]=useState(false);
 const load=async()=>{setError('');setLoaded(false);try{if(title==='Duas')setItems(await getDuas('morning'));else if(title==='99 Names')setItems(await getNames());else if(title==='Hadith')setItems([await getDailyHadith()]);else if(title==='Mosques'){if(!location){setItems([]);return}setItems(await getNearbyMosques(location.latitude,location.longitude));}}catch(e:any){setError(T(e.message))}finally{setLoaded(true)}};
 useEffect(()=>{load()},[title,location?.latitude,location?.longitude]);
 return <Page><ToolBar title={T(title)} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.dataTitle}>{title==='Duas'?T('Morning remembrance'):title==='99 Names'?'The Beautiful Names':title==='Hadith'?T('Hadith of the day'):T('Mosques near you')}</Text>{title==='Mosques'&&!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!loaded?<Spinner/>:!items.length?<View style={s.empty}><View style={s.errorIcon}>{ico('location-outline',24,C.green)}</View><Text style={s.errorTitle}>{T('No live records nearby')}</Text><Text style={s.errorText}>{T('The directory does not currently list a public mosque within 50 km of this location.')}</Text></View>:items.map((item:any,i)=><View key={item.number||item.slug||i} style={s.dataCard}>{title==='99 Names'?<><Text style={s.dataArabic}>{item.name}</Text><Text style={s.dataName}>{item.transliteration}</Text><Text style={s.dataBody}>{item.meaning}</Text></>:title==='Hadith'?<><Text style={s.dataBody}>{item.text}</Text><Text style={s.dataMeta}>{item.collection?.toUpperCase()} · {item.number}</Text></>:title==='Mosques'?<><Text style={s.dataName}>{item.name}</Text><Text style={s.dataBody}>{item.city}, {item.country}</Text><Text style={s.dataMeta}>{item.distance_km?.toFixed?.(1)} km · {item.source}</Text></>:<><Text style={s.dataArabic}>{item.arabic}</Text><Text style={s.dataBody}>{item.translation}</Text><Text style={s.dataMeta}>{item.category}</Text></>}</View>)}</ScrollView></Page>
}

const formatJourneyDay = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

function PilgrimageScreen({ navigation }: any) {
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const journeys = useJourneys();
  const meta = { umrah: journeyMeta('umrah', rtl), hajj: journeyMeta('hajj', rtl) } as typeof JOURNEY_META;
  const kinds: JourneyKind[] = ['umrah', 'hajj'];
  const openJourney = (kind: JourneyKind) => {
    if (!journeys.active[kind]) startJourney(kind, meta[kind].title);
    navigation.navigate('Journey', { kind });
  };
  return <Page><ToolBar title={T('Umrah and Hajj')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Pilgrimage" size={78} />
      <Text style={s.dataTitle}>{T('Umrah and Hajj')}</Text>
      <Text style={s.intro}>{T('A private checklist for every rite, the counts you need to keep, and the verses that speak about them. Nothing leaves this device.')}</Text>
      {kinds.map((kind) => {
        const journey = journeys.active[kind];
        const progress = journeyProgress(journey);
        return <Pressable key={kind} accessibilityRole="button" accessibilityLabel={meta[kind].title} onPress={() => openJourney(kind)} style={[s.journeyCard, ]}>
          <ToolGraphic tool="Pilgrimage" size={52} />
          <View style={{ flex: 1 }}>
            <View style={[s.journeyTitleRow, ]}>
              <Text style={s.settingName}>{rtl ? meta[kind].arabic : meta[kind].title}</Text>
              <Text style={s.journeyArabic}>{meta[kind].arabic}</Text>
            </View>
            <Text style={s.meta}>{meta[kind].intro}</Text>
            <View style={s.journeyBar}><View style={[s.journeyBarFill, { width: `${progress.percent}%` }]} /></View>
            <Text style={s.dataMeta}>{journey ? (rtl ? `${progress.done} من ${progress.total} من المناسك مؤداة · بدأت ${formatJourneyDay(journey.startedAt)}` : `${progress.done} OF ${progress.total} RITES DONE · STARTED ${formatJourneyDay(journey.startedAt).toUpperCase()}`) : T('NOT STARTED')}</Text>
          </View>
          {ico('arrow-forward', 17, C.chevron)}
        </Pressable>;
      })}
      <Section title={T('Holy site channels')} />
      <Pressable accessibilityRole="button" accessibilityLabel={T('Holy site channels')} onPress={() => navigation.navigate('Tools',{screen:'Holy site channels',initial:false})} style={[s.settings, s.dataSourceRow]}>
        <ToolGraphic tool="Holy site channels" size={40} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={s.settingName}>{rtl ? 'بثّ الحرمين' : 'Watch the Haramain live'}</Text>
          <Text style={s.meta}>{rtl ? 'القنوات الرسمية من مكة والمدينة' : 'The official channels from Makkah and Madinah'}</Text>
        </View>
        {ico('arrow-forward', 17, C.chevron)}
      </Pressable>
      <Section title={T('Completed journeys')} action={rtl?`${journeys.history.length} محفوظة`:`${journeys.history.length} kept`} />
      {!journeys.history.length ? <View style={s.empty}><Text style={s.errorText}>{rtl ? 'لا رحلات مسجلة بعد' : 'No completed journeys yet. Finish one and it is kept here.'}</Text></View>
        : journeys.history.map((journey) => <View key={journey.id} style={s.settings}>
          <ToolGraphic tool="Pilgrimage" size={40} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{meta[journey.kind].title} · {journey.label}</Text>
            <Text style={s.meta}>{rtl?`${journeyProgress(journey).done} من ${journeyProgress(journey).total} من المناسك · أُتمَّت ${formatJourneyDay(journey.completedAt || journey.startedAt)}`:`${journeyProgress(journey).done} of ${journeyProgress(journey).total} rites · completed ${formatJourneyDay(journey.completedAt || journey.startedAt)}`}</Text>
          </View>
        </View>)}
    </ScrollView>
  </Page>;
}

function JourneyScreenInner({ route, navigation }: any) {
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const kind: JourneyKind = route.params.kind;
  const { preferences } = useQuranPreferences();
  const journeys = useJourneys();
  const journey = journeys.active[kind];
  const steps = JOURNEY_STEPS[kind].map((step) => localizeJourneyStep(step, rtl));
  const progress = journeyProgress(journey);
  const [verseFor, setVerseFor] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [verses, setVerses] = useState<Record<string, { arabic: string; translation: string; reference: string }[]>>({});
  const [loadingVerse, setLoadingVerse] = useState<string | null>(null);
  const [verseError, setVerseError] = useState('');
  const wentBack = useRef(false);
  useEffect(() => {
    if (!journey && !wentBack.current) { wentBack.current = true; navigation.goBack(); }
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

  if (!journey) return <Page><ToolBar title={JOURNEY_META[kind].title} navigation={navigation} /><View style={s.loading}><Spinner /></View></Page>;

  return <Page><ToolBar title={rtl ? `رحلة ${JOURNEY_META[kind].arabic}` : `${JOURNEY_META[kind].title} journey`} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Pilgrimage" size={72} />
      <Text style={s.dataTitle}>{journeyMeta(kind, rtl).title}</Text>
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
        return <View key={step.id} style={[s.stepCard, checked && s.stepCardDone]}>
          <View style={[s.stepHead, ]}>
            <ToolGraphic tool={step.icon} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={s.stepIndex}>{rtl ? `المنسك ${index + 1}` : `RITE ${index + 1}`}</Text>
              <Text style={s.settingName}>{step.title}</Text>
              <Text style={s.meta}>{step.short}</Text>
            </View>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={`${T('Mark as done')} ${step.title}`}
              onPress={() => toggleStep(kind, step.id)} style={[s.stepCheck, checked && s.stepCheckDone]}>
              {!!checked && ico('checkmark', 16, C.white)}
            </Pressable>
          </View>
          <Text style={s.dataBody}>{step.detail}</Text>
          {!!step.counter && <View style={s.stepper}>
            <Pressable accessibilityLabel={`${T('One fewer')} ${step.counter.label}`} onPress={() => setStepCount(kind, step.id, count - 1, step.counter!.max)} style={s.stepButton}>{ico('remove', 20, C.green)}</Pressable>
            <View style={s.stepCountBox}>
              <Text style={s.stepCount}>{count}</Text>
              <Text style={s.stepCountLabel}>of {step.counter.max} {step.counter.label}</Text>
            </View>
            <Pressable accessibilityLabel={`${T('One more')} ${step.counter.label}`} onPress={() => setStepCount(kind, step.id, count + 1, step.counter!.max)} style={s.stepButton}>{ico('add', 20, C.green)}</Pressable>
          </View>}
          <View style={s.actionRow}>
            {!!step.verseKeys?.length && <Pressable accessibilityLabel={`${T('Read the verse for')} ${step.title}`} onPress={() => loadVerses(step)} style={s.secondary}>
              <Text style={s.secondaryText}>{T(verseFor === step.id ? 'Hide the verse' : 'Read the verse')}</Text>
            </Pressable>}
            <Pressable accessibilityLabel={`${T('Add a note for')} ${step.title}`} onPress={() => setNoteFor(noteFor === step.id ? null : step.id)} style={s.secondary}>
              <Text style={s.secondaryText}>{T(note ? 'Edit your note' : 'A note')}</Text>
            </Pressable>
          </View>
          {verseFor === step.id && <View style={s.verseBox}>
            {loadingVerse === step.id ? <Spinner /> : (verses[step.id] || []).map((entry) => <View key={entry.reference}>
              <Text style={s.dataMeta}>{T('QURAN')} {entry.reference}</Text>
              {!!entry.arabic && <Text style={s.verseArabic}>{entry.arabic}</Text>}
              {!!entry.translation && <Text style={s.dataBody}>{entry.translation}</Text>}
            </View>)}
            {!!verseError && <Text style={s.meta}>{verseError}</Text>}
          </View>}
          {noteFor === step.id && <TextInput accessibilityLabel={`${T('Note for')} ${step.title}`} value={note} onChangeText={(text) => setStepNote(kind, step.id, text)}
            placeholder={T('A reminder to yourself — kept only on this device')} placeholderTextColor={C.muted} style={s.searchInput} multiline />}
          {!!note && noteFor !== step.id && <Text style={s.stepNote}>{note}</Text>}
        </View>;
      })}

      <Section title={T('This journey')} />
      <View style={s.dataCard}>
        <Text style={s.dataBody}>{T(progress.done === progress.total ? 'Every rite is marked. You can keep the journey in your history, or start a fresh one the next time you go.' : 'Mark each rite as you complete it. Counts and notes are saved as you go.')}</Text>
        <View style={s.actionRow}>
          {progress.done === progress.total && <Pressable accessibilityLabel={T('Complete this journey')} onPress={() => { completeJourney(kind); navigation.goBack(); }} style={s.primary}><Text style={s.primaryText}>{T('Complete journey')}</Text></Pressable>}
          <Pressable accessibilityLabel={T('Start this journey again from the beginning')} onPress={() => { clearJourney(kind); startJourney(kind, JOURNEY_META[kind].title); }} style={s.secondary}><Text style={s.secondaryText}>{T('Start again')}</Text></Pressable>
        </View>
        <Pressable accessibilityLabel={T('Delete this journey')} onPress={() => { clearJourney(kind); navigation.goBack(); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Delete journey')}</Text></Pressable>
      </View>
      <View style={s.apiPanel}>
        <Text style={s.apiTitle}>{rtl ? 'تنبيه' : 'A note on the rites'}</Text>
        <Text style={s.apiText}>{rtl ? 'هذا تنظيم خاص، وليس فتوى. تختلف المذاهب في تفاصيل المناسك وما يفسدها وما يجب فيها، فاستفتِ عالماً موثوقاً في حالتك.' : 'This is a personal checklist, not a ruling. The schools differ on the details of the rites, on what breaks them and on what is due for them, so confirm your own case with a scholar you trust.'}</Text>
      </View>
    </ScrollView>
  </Page>;
}

function HolyChannelsScreen({ route, navigation }: any) {
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const [opened, setOpened] = useState('');
  const site = route?.params?.site;
  const channels = site ? HOLY_CHANNELS.filter((channel) => channel.site === site) : HOLY_CHANNELS;
  const heading = site === 'Madinah' ? 'Madinah Live' : site === 'Hajj' ? 'Hajj Live' : 'Makkah Live';
  const open = async (channel: (typeof HOLY_CHANNELS)[number]) => { setOpened(channel.id); await openChannel(channel); };
  return <Page><ToolBar title={site ? T(heading) : (rtl ? 'بثّ الحرمين' : 'Holy site channels')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Holy site channels" size={76} />
      <Text style={s.dataTitle}>{rtl ? 'بثّ الحرمين' : 'Holy site channels'}</Text>
      <Text style={s.intro}>{rtl ? 'البثّ الرسمي من مكة والمدينة على مدار الساعة.' : 'The official broadcasts from Makkah and Madinah, around the clock.'}</Text>
      {channels.map((channel) => <View key={channel.id} style={s.channelCard}>
        <View style={[s.channelHead, ]}>
          <ToolGraphic tool="Holy site channels" size={46} />
          <View style={{ flex: 1 }}>
            <Text style={s.dataMeta}>{channel.site.toUpperCase()} · {channel.channel.toUpperCase()}</Text>
            <Text style={s.settingName}>{channel.place}</Text>
            <Text style={s.channelArabic}>{channel.arabic}</Text>
          </View>
        </View>
        <Text style={s.dataBody}>{channel.detail}</Text>
        <Text style={s.meta}>{channel.broadcaster}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`${T('Watch live')} ${channel.channel}`} onPress={() => open(channel)} style={s.primary}>
          <Text style={s.primaryText}>{opened === channel.id ? 'Opening…' : 'Open live stream'}</Text>
        </Pressable>
      </View>)}
      <View style={s.apiPanel}>
        <Text style={s.apiTitle}>{rtl ? 'كيف يُفتح البثّ' : 'How the stream opens'}</Text>
        <Text style={s.apiText}>{rtl ? 'يُفتح البثّ خارج التطبيق في المتصفح أو تطبيق يوتيوب، لأن إعادة بثّه هنا تحتاج حقوقاً لا يملكها التطبيق.' : 'The stream opens outside this app, in your browser or the YouTube app, because re-broadcasting it here would need rights the app does not hold.'}</Text>
      </View>
    </ScrollView>
  </Page>;
}

function FastingScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const fasting=useFasting();
  const [message,setMessage]=useState('');
  const [reason,setReason]=useState<MissedReason>('travel');
  const summary=summariseFasting(fasting);
  const todayKey=new Date().toISOString().slice(0,10);
  const mark=(type:FastType,options?:{reason?:MissedReason})=>{void recordFast(type,options).then(()=>setMessage('Saved on this device.'))};
  const undo=()=>{void clearFastDay().then(()=>setMessage('Today’s record cleared.'))};
  const adjust=(delta:number)=>{void setFastingOwed(summary.owed+delta)};
  return <Page><ToolBar title={T('Fasting record')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Fasting" size={80}/>
    <Text style={s.dataTitle}>{T('Fasting record')}</Text>
    <Text style={s.intro}>{T('A private record of the days you fasted, the days you could not, and the make-up days that remain. Nothing leaves this device.')}</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('DAYS FASTED')}</Text><Text style={s.zakatNo}>{summary.completed}</Text><Text style={s.weekScoreBody}>{rtl?`${summary.ramadan} رمضان · ${summary.voluntary} تطوع`:`${summary.ramadan} Ramadan · ${summary.voluntary} voluntary`}</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>{T('CURRENT STREAK')}</Text><Text style={s.zakatNo}>{summary.streak} {T(summary.streak===1?'day':'days')}</Text><Text style={s.weekScoreBody}>{rtl?`${summary.thisWeek} في آخر 7 أيام`:`${summary.thisWeek} in the last 7 days`}</Text></View></View>
    <Section title={T('Today')} action={readableDate(todayKey)} />
    <View style={s.dataCard}>
      <Text style={s.dataMeta}>{summary.today?(rtl?`مُسجَّل · ${labelForEntry(summary.today, rtl)}`:`RECORDED · ${labelForEntry(summary.today, rtl)}`):T('NOT RECORDED YET')}</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel={T('Record today as a Ramadan fast')} onPress={()=>mark('ramadan')} style={s.secondary}><Text style={s.secondaryText}>{T('Ramadan fast')}</Text></Pressable>
        <Pressable accessibilityLabel={T('Record today as a voluntary fast')} onPress={()=>mark('voluntary')} style={s.secondary}><Text style={s.secondaryText}>{T('Voluntary')}</Text></Pressable>
        <Pressable accessibilityLabel={T('Record today as a make-up fast')} onPress={()=>mark('qada')} style={s.secondary}><Text style={s.secondaryText}>{T('Make-up day')}</Text></Pressable>
      </View>
      {!!summary.today && <Pressable accessibilityLabel={T('Clear today’s fasting record')} onPress={undo} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear today')}</Text></Pressable>}
    </View>
    <Section title={T('If today was not fasted')} />
    <View style={s.dataCard}>
      <Text style={s.dataBody}>{T('Recording a missed day adds one day to the make-up ledger below.')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8,marginTop: 12}}>{missedReasons(rtl).map(item=><ChoicePill key={item.id} label={item.label} selected={reason===item.id} onPress={()=>setReason(item.id)}/>)}</ScrollView>
      <Text style={s.meta}>{missedReasons(rtl).find(item=>item.id===reason)?.detail}</Text>
      <Pressable accessibilityLabel={T('Record today as not fasted')} onPress={()=>mark('missed',{reason})} style={s.primary}><Text style={s.primaryText}>{T('Record as not fasted')}</Text></Pressable>
    </View>
    <Section title={T('Make-up ledger')} action={rtl?`${summary.qada} مسوّاة`:`${summary.qada} settled`} />
    <View style={s.dataCard}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{T('Days owed')}</Text><Text style={s.hadithProgressName}>{summary.owed}</Text></View>
      <Text style={s.meta}>{rtl?`${summary.qada} يوم قضاء مسجل · ${summary.missed} يوم إفطار مسجل`:`${summary.qada} make-up days recorded · ${summary.missed} missed days recorded`}</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel={T('One fewer day owed')} onPress={()=>adjust(-1)} style={s.secondary}><Text style={s.secondaryText}>{T('− 1 day')}</Text></Pressable>
        <Pressable accessibilityLabel={T('One more day owed')} onPress={()=>adjust(1)} style={s.secondary}><Text style={s.secondaryText}>{T('+ 1 day')}</Text></Pressable>
      </View>
    </View>
    <Section title={T('Recent record')} action={rtl?`${fasting.entries.length} ${arNoun(fasting.entries.length,'يوم مسجَّل','يومان مسجَّلان','أيام مسجَّلة','يومًا مسجَّلًا')}`:`${fasting.entries.length} entries`} />
    {!fasting.entries.length && <View style={s.empty}><Text style={s.dataBody}>{T('Nothing recorded yet. Mark today above and your record starts here.')}</Text></View>}
    {!!fasting.entries.length && <View style={s.settings}>{summary.recent.map(entry=><View key={entry.date} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{readableDate(entry.date)}</Text><Text style={s.meta}>{labelForEntry(entry, rtl)}</Text></View><Pressable accessibilityLabel={`${T('Remove the fasting record for')} ${readableDate(entry.date)}`} onPress={()=>{void clearFastDay(entry.date)}}>{ico('trash-outline',17,C.coral)}</Pressable></View>)}</View>}
    {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}
    <View style={s.apiPanel}><Text style={s.apiTitle}>{T('A note on rulings')}</Text><Text style={s.apiText}>{T('This is a private record, not a ruling. What obliges a make-up fast, and what excuses a day, depends on your situation: travel, illness, pregnancy, the monthly cycle and post-natal bleeding each have their own rules. Please confirm your own case with a scholar or a trusted, sourced guide. Everything here stays on this device, and nothing is uploaded.')}</Text></View>
  </ScrollView></Page>;
}
function WeeklySummaryScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[history,setHistory]=useState<Record<string,string[]>>({});const[hifz,setHifz]=useState<Record<number,HifzStatus>>({});const[names,setNames]=useState<Record<number,string>>({});const log=useActivity();const tasbih=useTasbih();
 useEffect(()=>{loadPrayerHistory().then(setHistory);loadHifz().then(setHifz);getChapters().then(list=>{const map:Record<number,string>={};list.forEach(c=>{map[c.id]=c.name_simple});setNames(map)}).catch(()=>undefined)},[]);
 const week=buildWeeklySummary({activity:log,prayerHistory:history,tasbihDays:tasbih.days});
 const maxVerses=Math.max(1,...week.rows.map(r=>r.verses));const maxDhikr=Math.max(1,...week.rows.map(r=>r.dhikr));const maxHifz=Math.max(1,...week.rows.map(r=>r.hifz));
 const memorized=Object.values(hifz).filter(x=>x==='memorized').length;const revising=Object.values(hifz).filter(x=>x==='revising').length;
 const opened=Array.from(new Set(week.rows.flatMap(r=>log[r.key]?.surahs||[])));const total=week.totals;const active=total.prayers+total.verses+total.dhikr+total.hifz;
 return <Page><ToolBar title={T('Weekly summary')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Weekly Summary" size={78}/>
    <Text style={s.dataTitle}>{T('Your week in review')}</Text>
    <Text style={s.intro}>{T('Seven days of salah, reading, dhikr and memorisation, counted only from what you did in the app. Everything stays on this device.')}</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('LAST 7 DAYS')}</Text><Text style={s.zakatNo}>{total.prayers} / 35</Text><Text style={s.weekScoreBody}>{T('prayers marked')}</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>{T('STREAKS')}</Text><Text style={s.zakatNo}>{week.prayerStreak} {T(week.prayerStreak===1?'day':'days')}</Text><Text style={s.weekScoreBody}>{rtl?`${week.activeStreak} ${arNoun(week.activeStreak,'يوم نشط','يومان نشطان','أيام نشطة','يومًا نشطًا')}`:`${week.activeStreak} active ${week.activeStreak===1?'day':'days'}`}</Text></View></View>
    <View style={s.twoCol}>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>{T('VERSES MARKED')}</Text><Text style={s.weekStatValue}>{total.verses}</Text><Text style={s.meta}>{rtl?`${total.surahs} ${arNoun(total.surahs,'سورة','سورتان','سور','سورة')} · ${total.pages} ${arNoun(total.pages,'صفحة','صفحتان','صفحات','صفحة')}`:`${total.surahs} Surahs · ${total.pages} pages`}</Text></View>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>{T('DHIKR COUNTED')}</Text><Text style={s.weekStatValue}>{total.dhikr}</Text><Text style={s.meta}>{rtl?`${total.hifz} مراجعة حفظ`:`${total.hifz} hifz reviews`}</Text></View>
    </View>
    {!active && <View style={[s.empty,{marginTop:12}]}><Text style={s.dataBody}>{T('Nothing recorded in the last seven days yet. Mark a prayer, read a Surah, count dhikr or practise a verse and this page fills in.')}</Text></View>}
    <Section title={T('Daily salah')} action={week.bestDay && week.bestDay.prayers ? (rtl?`${T('Best')}: ${week.bestDay.label}`:`Best: ${week.bestDay.label}`) : ''} />
    <View style={s.settings}>{week.rows.map(day=><View key={day.key} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.summaryDots}>{Array.from({length:5}).map((_,i)=><View key={i} style={[s.summaryDot,i<day.prayers&&s.summaryDotDone]}/>)}</View><Text style={s.progressCount}>{day.prayers}/5</Text></View>)}</View>
    <Section title={T('Quran reading')} action={rtl?`${total.verses} ${arNoun(total.verses,'آية','آيتان','آيات','آية')}`:`${total.verses} verses`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`read-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{rtl?`${day.surahs} ${arNoun(day.surahs,'سورة','سورتان','سور','سورة')} · ${day.pages} ${arNoun(day.pages,'صفحة','صفحتان','صفحات','صفحة')}`:`${day.surahs} Surahs · ${day.pages} pages`}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.verses/maxVerses*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.verses}</Text></View>)}</View>
    {!!opened.length && <View style={s.dataCard}><Text style={s.dataMeta}>{T('SURAHS OPENED THIS WEEK')}</Text><Text style={s.dataBody}>{opened.slice(0,8).map(id=>names[id]||(rtl?`سورة ${id}`:`Surah ${id}`)).join(' · ')}</Text></View>}
    <Section title={T('Hifz')} action={rtl?`${memorized} محفوظة · ${revising} قيد المراجعة`:`${memorized} memorized · ${revising} revising`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`hifz-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.hifz/maxHifz*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.hifz}</Text></View>)}</View>
    <Section title={T('Dhikr')} action={rtl?`${total.dhikr} معدودة`:`${total.dhikr} counted`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`dhikr-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.dhikr/maxDhikr*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.dhikr}</Text></View>)}</View>
    <View style={s.apiPanel}><Text style={s.apiTitle}>{T('How these numbers are counted')}</Text><Text style={s.apiText}>{T('Salah counts the prayers you mark on the Prayer screen. Reading counts the verses you mark in the reader and the Mushaf pages you open. Dhikr comes from the Tasbih counter, and hifz from every verse you rate in recall practice. Thirty days are kept, on this device only, and nothing is uploaded.')}</Text></View>
  </ScrollView></Page>}

const CITY_PRESETS=[
 {label:'Dubai, United Arab Emirates',ar:'دبي، الإمارات العربية المتحدة',latitude:25.2048,longitude:55.2708},
 {label:'Makkah, Saudi Arabia',ar:'مكة المكرمة، المملكة العربية السعودية',latitude:21.3891,longitude:39.8579},
 {label:'Madinah, Saudi Arabia',ar:'المدينة المنورة، المملكة العربية السعودية',latitude:24.5247,longitude:39.5692},
 {label:'London, United Kingdom',ar:'لندن، المملكة المتحدة',latitude:51.5074,longitude:-.1278},
 {label:'New York, United States',ar:'نيويورك، الولايات المتحدة',latitude:40.7128,longitude:-74.006},
 {label:'Karachi, Pakistan',ar:'كراتشي، باكستان',latitude:24.8607,longitude:67.0011}
];
function LocationSetupScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
    navigation.goBack();
  };

  const saveManual=()=>{
    const latitude=Number(lat),longitude=Number(lng);
    if(!label.trim()||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){
      setError(T('Enter a name and valid latitude and longitude.'));return}
    haptic('success');
    loc.setManual({label:label.trim(),latitude,longitude});
    navigation.goBack();
  };

  return <Page><ToolBar title={T('Location')} navigation={navigation}/>
    <ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
      <Text style={s.dataTitle}>{T('Where are your prayer times?')}</Text>
      <Text style={s.intro}>{T('Prayer times, Qibla, Ramadan and nearby mosques all read from this one place. It is asked once and kept on this device.')}</Text>

      {!!loc.location&&<View style={s.cityCurrent}>
        <View style={{flex:1}}>
          <Text style={s.cityCurrentLabel}>{T('Currently using')}</Text>
          <Text style={s.cityCurrentName}>{loc.location.label}</Text>
          <Text style={s.meta}>{loc.location.latitude.toFixed(3)}, {loc.location.longitude.toFixed(3)}</Text>
        </View>
        <Pressable accessibilityLabel={T('Clear saved location')} onPress={loc.clear} style={s.ghostSmall}><Text style={s.ghostText}>{T('Clear')}</Text></Pressable>
      </View>}

      <Section title={T('Search for a city')}/>
      <View style={s.search}>{ico('search',19,C.muted)}
        <TextInput accessibilityLabel={T('Search for a city or place')} value={query} onChangeText={setQuery}
          style={s.searchInput} placeholder={T('Try Dubai, Makkah, London…')} placeholderTextColor="#929B96"
          returnKeyType="search" autoCorrect={false}/>
        {query.length>0&&<Pressable accessibilityLabel={T('Clear city search')} onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}
      </View>

      {searching&&<Spinner/>}

      {!searching&&query.trim().length>=2&&results.length===0&&<View style={s.empty}>
        <Text style={s.errorTitle}>{lookedOnline?T('Nothing found for that name'):T('No match in the offline list')}</Text>
        <Text style={s.errorText}>{lookedOnline
          ? T('Check the spelling, or add the place by its coordinates below.')
          : T('The list on this device did not have it and the connection could not be reached. You can add the place by its coordinates.')}</Text>
        <Pressable accessibilityLabel={T('Add coordinates manually')} onPress={()=>setManual(true)} style={s.primarySmall}>
          <Text style={s.primaryText}>{T('Add by coordinates')}</Text>
        </Pressable>
      </View>}

      {results.length>0&&<View style={s.cityResults}>
        {results.map(city=><Pressable key={`${city.ascii}-${city.country}-${city.latitude}`}
          accessibilityLabel={`${city.name}, ${city.countryName}`}
          onPress={()=>choose(city)} style={s.cityResultRow}>
          <View style={{flex:1}}>
            <Text style={s.cityResultName}>{city.name}</Text>
            <Text style={s.meta}>{city.countryName} · {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}</Text>
          </View>
          {city.source!=='device'&&<View style={s.citySourceTag}><Text style={s.citySourceText}>{city.source==='online'?T('online'):T('saved')}</Text></View>}
          {ico('arrow-forward',17,C.muted)}
        </Pressable>)}
        <Text style={s.cityFootnote}>{T('Not in the list? Add it by coordinates below.')}</Text>
      </View>}

      {lookedOnline&&results.length>0&&<Text style={s.cityFootnote}>{T('Found online — saved on this device for next time.')}</Text>}

      <Section title={T('Or enter coordinates')}/>
      {!manual
        ? <Pressable accessibilityRole="button" accessibilityLabel={T('Add coordinates manually')} onPress={()=>setManual(true)} style={s.secondary}>
            <Text style={s.secondaryText}>{T('Add a place by latitude and longitude')}</Text>
          </Pressable>
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
            <Pressable accessibilityRole="button" accessibilityLabel={T('Save location')} onPress={saveManual} style={s.primary}>
              <Text style={s.primaryText}>{T('Save this place')}</Text>
            </Pressable>
          </View>}

      <View style={s.sourceCard}>{ico('location-outline',20,C.green)}<View style={{flex:1}}>
        <Text style={s.sourceTitle}>{T('Stored only here')}</Text>
        <Text style={s.sourceBody}>{T('Your location never leaves this device. It is used to compute prayer times, Qibla and the fasting timetable, and you can clear it at any time.')}</Text>
      </View></View>
    </ScrollView></Page>}
function NotificationScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const{location}=useAppLocation();const{settings,update}=useWorshipSettings();
  const[health,setHealth]=useState<NotificationHealth>('undetermined');
  const[working,setWorking]=useState(false);
  const[queued,setQueued]=useState(0);
  const[battery,setBattery]=useState<BatteryState>('unknown');

  useEffect(()=>{getNotificationHealth().then(setHealth);void getScheduledCount().then(setQueued);void getBatteryOptimizationState().then(setBattery)},[]);

  const permission=async()=>{const next=await requestNotificationPermission(rtl);setHealth(next)};
  const sync=async()=>{
    if(!location)return Alert.alert(T('Location needed'),T('Choose a prayer location before scheduling reminders.'));
    setWorking(true);
    try{
      const value=await managedPrayerSnapshot(location,settings);
      const position=await loadReadingPosition().catch(()=>null);
      const result=await schedulePrayerNotifications(value.snapshot,settings,rtl,
        position?`${position.surahName} ${position.verseKey}`:undefined);
      setQueued(await getScheduledCount());
      Alert.alert(T(result.unsupported?'Saved for installed app':'Reminders updated'),
        T(result.unsupported?'Web browsers are not scheduled here. Your choices are saved and will apply in the installed iOS or Android app.'
          :rtl?`تمت جدولة ${result.scheduled} تنبيهًا.`:`${result.scheduled} notifications scheduled.`));
    }catch(e:any){Alert.alert(T('Could not schedule'),T(e.message))}finally{setWorking(false)}};

  const toggleAdhan=(name:string)=>update({adhanEnabled:{...settings.adhanEnabled,[name]:!settings.adhanEnabled[name]}});
  const togglePre=(name:string)=>update({prayerReminders:{...settings.prayerReminders,[name]:!settings.prayerReminders[name]}});
  const prayers=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
  const Row=({icon,title,subtitle,value,onChange}:any)=><View style={s.setting}>
    {icon?<MotionGlyph name={icon} size={19}/>:null}
    <View style={{flex:1}}><Text style={s.settingName}>{title}</Text>{!!subtitle&&<Text style={s.meta}>{subtitle}</Text>}</View>
    <View style={{direction:'ltr'} as any}><Switch value={value} onValueChange={onChange} trackColor={{true:C.green}}/></View>
  </View>;

  return <Page><ToolBar title={T('Prayer reminders')} navigation={navigation}/>
    <ScrollView contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Notifications" size={76}/>
      <Text style={s.dataTitle}>{T('Gentle, local reminders')}</Text>
      <Text style={s.intro}>{T('Permission and scheduling happen on your device. No notification profile is sent to us.')}</Text>

      <View style={s.healthCard}>
        <View style={[s.healthDot,{backgroundColor:health==='granted'?C.success:health==='denied'?C.coral:C.gold}]}/>
        <View style={{flex:1}}>
          <Text style={s.sourceTitle}>{T('Permission')}: {T(health)}</Text>
          <Text style={s.sourceBody}>{health==='unsupported'
            ? T('System scheduling is available in the installed mobile app.')
            : health==='denied'
              ? T('Declined earlier. Turn it on in the system settings for this app.')
              : queued?T(rtl?`${queued} تنبيهًا مجدولًا.`:`${queued} scheduled right now.`):T('You remain in control through system settings.')}</Text>
        </View>
        {health!=='granted'&&health!=='unsupported'&&<Pressable onPress={permission} style={s.ghostSmall}><Text style={s.ghostText}>{T('Allow')}</Text></Pressable>}
      </View>

      {/* ---- the adhan itself ---- */}
      <Section title={T('Adhan')}/>
      <View style={s.settings}>
        <Row icon="notifications-outline" title={T('Sound the adhan')}
          subtitle={T('At each prayer time, with buttons to silence it or to mark the prayer as prayed.')}
          value={settings.adhanEnabled?.Fajr||settings.adhanEnabled?.Isha?true:false}
          onChange={(v:boolean)=>update({adhanEnabled:Object.fromEntries(prayers.map(p=>[p,v]))})}/>
      </View>
      <Text style={s.preferenceLabel}>{T('WHICH ADHAN')}</Text>
      <View style={s.choiceRow}>
        {ADHAN_OPTIONS.map(option=><ChoicePill key={option.id}
          label={rtl?option.labelAr:option.label} selected={adhanOption(settings.adhanReciter).id===option.id}
          onPress={()=>update({adhanReciter:option.id})}/>)}
      </View>
      <View style={s.settings}>
        {prayers.map(name=><View key={name} style={s.setting}>
          <ToolGraphic tool="Notifications" size={42}/>
          <Text style={[s.settingName,{flex:1}]}>{prayerName(rtl, name)}</Text>
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
        {[5,10,15,30].map(value=><ChoicePill key={value} label={rtl?`${value} دقيقة`:`${value} min`}
          selected={settings.reminderOffset===value} onPress={()=>update({reminderOffset:value})}/>)}
      </View>
      <View style={s.settings}>
        {prayers.map(name=><View key={name} style={s.setting}>
          <ToolGraphic tool="Notifications" size={42}/>
          <Text style={[s.settingName,{flex:1}]}>{prayerName(rtl, name)}</Text>
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
          subtitle={settings.dailyVerseTime||'08:00'}
          value={!!settings.dailyVerseReminder} onChange={(v:boolean)=>update({dailyVerseReminder:v})}/>
      </View>
      <View style={s.choiceRow}>
        {['06:00','08:00','10:00','12:00'].map(time=><ChoicePill key={time} label={time}
          selected={settings.dailyVerseTime===time} onPress={()=>update({dailyVerseTime:time,dailyVerseReminder:true})}/>)}
      </View>
      <View style={[s.settings,{marginTop:10}]}>
        <Row icon="library-outline" title={T('Hadith of the day')}
          subtitle={settings.dailyHadithTime||'09:00'}
          value={!!settings.dailyHadithReminder} onChange={(v:boolean)=>update({dailyHadithReminder:v})}/>
      </View>
      <View style={s.choiceRow}>
        {['07:00','09:00','11:00','13:00'].map(time=><ChoicePill key={time} label={time}
          selected={settings.dailyHadithTime===time} onPress={()=>update({dailyHadithTime:time,dailyHadithReminder:true})}/>)}
      </View>

      {/* ---- before you sleep ---- */}
      <Section title={T('Before you sleep')}/>
      <View style={s.sleepHadith}>
        <Text style={s.sleepHadithAr}>
          {'إِنَّ سُورَةً مِنَ القُرآنِ ثَلاثُونَ آيَةً شَفَعَتْ لِصَاحِبِهَا حَتَّى غُفِرَ لَهُ، وَهِيَ سُورَةُ تَبَارَكَ'}
        </Text>
        <Text style={s.sleepHadithEn}>
          {T('“Indeed there is a Surah in the Qur’an of thirty Ayat, which intercedes for a man until he is forgiven. It is [Surah] Tabarak Alladhi Biyadihil-Mulk.”')}
        </Text>
        <Text style={s.sleepHadithRef}>{rtl ? SLEEP_SURAH.hadithAr : SLEEP_SURAH.hadith} · {rtl ? SLEEP_SURAH.practiceAr : SLEEP_SURAH.practice}</Text>
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
          </View>
        </View>
      </>}

      <View style={s.actionRow}>
        <Pressable onPress={sync} style={s.primary}><Text style={s.primaryText}>{working?T('Scheduling…'):T('Save & reschedule')}</Text></Pressable>
        <Pressable onPress={()=>sendTestNotification(rtl).catch(e=>Alert.alert(T('Test unavailable'),T(e.message)))} style={s.secondary}>
          <Text style={s.secondaryText}>{T('Test notification')}</Text>
        </Pressable>
      </View>
      <Text style={s.cityFootnote}>{T('Everything is rescheduled for you each day and whenever the location or these settings change.')}</Text>
    </ScrollView></Page>}


const ADHAN_TRACKS=[
 {id:'Makkah',titleAr:'أذان مكة',detailAr:'مضمّن للعمل دون اتصال · الملك العام',title:'Beautiful Adhan',detail:'Bundled offline · Public domain',source:require('./assets/audio/adhan-doha-public-domain.mp3')},
 {id:'Doha Fajr',titleAr:'أذان فجر الدوحة',detailAr:'الملك العام · أرشيف الإنترنت',title:'Doha Fajr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_01_Fajr_Adhan.mp3'},
 {id:'Doha Classic',titleAr:'أذان ظهر الدوحة',detailAr:'الملك العام · أرشيف الإنترنت',title:'Doha Dhuhr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_02_Dhuhr_Adhan.mp3'}
];
function AdhanScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{settings,update}=useWorshipSettings();const selected=ADHAN_TRACKS.find(x=>x.id===settings.adhanReciter)||ADHAN_TRACKS[0];const player=useAudioPlayer(selected.source);const status=useAudioPlayerStatus(player);const toggle=()=>status.playing?player.pause():player.play();useEffect(()=>()=>{player.pause()},[player]);return <Page><ToolBar title={T('Adhan')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Adhan" size={82}/><Text style={s.dataTitle}>{T('Choose an Adhan')}</Text><Text style={s.intro}>{T('Preview a recording and choose which prayers may use Adhan. The bundled selection works without a network connection.')}</Text><View style={s.audioPreview}><Pressable accessibilityLabel={status.playing?'Pause Adhan preview':'Play Adhan preview'} onPress={toggle} style={s.audioPlay}>{ico(status.playing?'pause':'play',25,C.white)}</Pressable><View style={{flex:1}}><Text style={s.profileName}>{rtl?selected.titleAr||selected.title:selected.title}</Text><Text style={s.profileSub}>{rtl?selected.detailAr||selected.detail:selected.detail}</Text></View><Pressable accessibilityLabel={T('Stop Adhan preview')} onPress={()=>{player.seekTo(0);player.pause()}} style={s.stopButton}>{ico('stop-circle-outline',26,C.white)}</Pressable></View><Section title={T('Recordings')}/><View style={s.settings}>{ADHAN_TRACKS.map(track=><Pressable accessibilityRole="radio" accessibilityState={{selected:track.id===selected.id}} key={track.id} onPress={()=>update({adhanReciter:track.id})} style={s.setting}><ToolGraphic tool="Adhan" size={44}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?track.titleAr||track.title:track.title}</Text><Text style={s.meta}>{rtl?track.detailAr||track.detail:track.detail}</Text></View>{ico(track.id===selected.id?'checkmark-circle':'ellipse-outline',20,track.id===selected.id?C.green:C.muted)}</Pressable>)}</View><Section title={T('Use Adhan for')}/><View style={s.settings}>{['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(name=><View key={name} style={s.setting}><Text style={[s.settingName,{flex:1}]}>{prayerName(rtl, name)}</Text><View style={{direction:'ltr'} as any}><Switch value={settings.adhanEnabled[name]} onValueChange={v=>update({adhanEnabled:{...settings.adhanEnabled,[name]:v}})} trackColor={{true:C.green}}/></View></View>)}</View><View style={s.sourceCard}>{ico('information-circle-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Audio rights')}</Text><Text style={s.sourceBody}>{T('Bundled and streamed Doha recordings: Internet Archive Public Domain Mark 1.0.')}</Text></View></View></ScrollView></Page>}

function GuideDirectory({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const group=route?.params?.group;const guides=group==='ramadan'?WORSHIP_GUIDES.filter((guide)=>RAMADAN_GUIDE_IDS.includes(guide.id)):WORSHIP_GUIDES;return <Page><ToolBar title={group==='ramadan'?T('Ramadan and Eid'):T('Worship guides')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Worship guides" size={78}/><Text style={s.dataTitle}>{T('Learn with references')}</Text><Text style={s.intro}>{T('Concise educational overviews with transparent Qur’an and Hadith references. Detailed rulings should be learned from a qualified local scholar.')}</Text><View style={s.guideGrid}>{guides.map(guide=>{const g=localizeGuide(guide,rtl);return <MotionPress key={guide.id} onPress={()=>navigation.navigate('Guide Detail',{guide})} style={s.guideCard}><View style={s.guideCardInner}><ToolGraphic tool={guide.id} size={62}/><Text style={s.exploreTitle}>{g.title}</Text><Text style={s.exploreBody}>{g.subtitle}</Text><View style={s.exploreArrow}>{ico('arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></ScrollView></Page>}
/**
 * The evidence for a guide, shown in full on the page rather than as a link
 * out. Both kinds are held on the device in guideSources, so a guide reads
 * the same with no connection, and tapping one opens it in the Hadith Library
 * or the Quran reader instead of a browser.
 */
function GuideReferences({ guide, navigation }: { guide: WorshipGuide; navigation: any }) {
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  return (<>
    <Section title={T('References')} />
    {guide.references.map((ref) => {
      if (ref.kind === 'hadith') {
        const h = GUIDE_HADITH[ref.ref];
        if (!h) return null;
        return (
          <MotionPress key={ref.ref} onPress={() => navigation.navigate('Hadith Detail', { slug: h.collection, number: h.number })} style={s.evidenceCard}>
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

function GuideDetailInner({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const guide:WorshipGuide=localizeGuide(route.params.guide,rtl);return <Page><ToolBar title={guide.title} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool={guide.id} size={82}/><Text style={s.dataTitle}>{guide.subtitle}</Text>{guide.arabic&&<Text style={s.guideArabic}>{guide.arabic}</Text>}<Text style={s.intro}>{guide.introduction}</Text><Section title={T('Step by step')}/><View style={s.settings}>{guide.steps.map((step,i)=><View key={step} style={s.guideStep}><View style={s.stepNo}><Text style={s.stepNoText}>{i+1}</Text></View><Text style={s.guideStepText}>{step}</Text></View>)}</View>{guide.note&&<View style={s.guideNote}><Text style={s.sourceTitle}>{T('Important note')}</Text><Text style={s.sourceBody}>{guide.note}</Text></View>}<GuideReferences guide={guide} navigation={navigation}/></ScrollView></Page>}

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
function daysUntilText(days: number, rtl: boolean): string {
  if (days <= 0) return rtl ? 'اليوم' : 'today';
  if (days === 1) return rtl ? 'غدًا' : 'tomorrow';
  return rtl ? `بعد ${days} ${arNoun(days, 'يوم', 'يومين', 'أيام', 'يومًا')}` : `in ${days} days`;
}

function HijriCalendarScreen({navigation}:any){
  const {rtl,language}=useLanguage(); const T=(text:string)=>tx(rtl,text);
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
  <ScrollView contentContainerStyle={s.dataPage}>
    {!location?<LocationPrompt compact/>:<>
      <View style={s.calendarIntro}>
        <Text style={s.calendarMonth}>{now.toLocaleDateString(language==='ar'?'ar-u-nu-latn':'en',{month:'long',year:'numeric'})}</Text>
        <Text style={s.calendarHijri}>{days.length?(rtl?`${days[0].hijriMonthAr||days[0].hijriMonth} – ${days[days.length-1].hijriMonthAr||days[days.length-1].hijriMonth} ${days[0].hijriYear} هـ`:`${days[0].hijriMonth} – ${days[days.length-1].hijriMonth} ${days[0].hijriYear} AH`):''}</Text>
      </View>

      {!!upcoming.length&&<>
        <Section title={T('Coming up')} action={T('Next 12 months')}/>
        <View style={s.settings}>
          {upcoming.map(({event,date,days:away,day})=>(
            <Pressable key={`${event.title}-${day.hijriYear}`} accessibilityRole="button"
              accessibilityLabel={`${T(event.title)}, ${daysUntilText(away,rtl)}`}
              onPress={()=>setSelected(day)} style={s.eventRow}>
              <View style={[s.eventDot,{ backgroundColor: EVENT_COLOURS[event.kind] }]}/>
              <View style={{flex:1}}>
                <Text style={s.settingName}>{rtl?event.titleAr:T(event.title)}</Text>
                <Text style={s.meta} numberOfLines={1}>
                  {rtl
                    ? `${day.hijriDay} ${day.hijriMonthAr||day.hijriMonth} ${day.hijriYear} هـ · ${date.toLocaleDateString('ar-u-nu-latn',{day:'numeric',month:'short'})}`
                    : `${day.hijriDay} ${day.hijriMonth} ${day.hijriYear} AH · ${date.toLocaleDateString('en',{day:'numeric',month:'short'})}`}
                </Text>
              </View>
              <View style={s.eventCountdown}><Text style={s.eventCountdownText}>{daysUntilText(away,rtl)}</Text></View>
            </Pressable>
          ))}
        </View>
      </>}

      {error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<>
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
                <Text style={s.dayDetailEventTitle}>{rtl?event.titleAr:T(event.title)}</Text>
                {!!event.note&&<Text style={s.sourceBody}>{T(rtl&&event.noteAr?event.noteAr:event.note!)}</Text>}
              </View>
            ))}
          </View>}
          <View style={s.dayDetailPrayers}>
            {selected.prayers.map(p=>(
              <View key={p.name} style={s.dayDetailPrayer}>
                <Text style={s.dayDetailPrayerName}>{prayerName(rtl,p.name)}</Text>
                <Text style={s.dayDetailPrayerTime}>{clockTime(rtl,p.time)}</Text>
              </View>
            ))}
          </View>
        </View>
      </>}
    </>}
  </ScrollView></Page>
}
function RamadanScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{location}=useAppLocation();const[days,setDays]=useState<CalendarDay[]>([]);const[year,setYear]=useState<number|null>(null);const[error,setError]=useState('');const load=async()=>{if(!location)return;setError('');setDays([]);try{const snap=await getPrayerSnapshot(location.latitude,location.longitude);const target=snap.hijriMonth>9?snap.hijriYear+1:snap.hijriYear;setYear(target);setDays(await getRamadanCalendar(location.latitude,location.longitude,target));}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title={T('Ramadan')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>{!location?<LocationPrompt compact/>:<><LinearGradient colors={[C.heroA,C.green]} style={s.ramadanHero}><Text style={s.ramadanArabic}>رَمَضَان</Text><Text style={s.ramadanTitle}>{T('Ramadan')} {year||''} {T('AH')}</Text><Text style={s.ramadanSub}>{T('A live 30-day Suhoor and Iftar timetable for')} {T(location.label)}.</Text></LinearGradient><Pressable onPress={()=>navigation.navigate('Tools',{screen:'Fasting',initial:false})} style={[s.sourceCard,{marginTop: 12}]}>{ico('create-outline',20,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Fasting record')}</Text><Text style={s.sourceBody}>{T('Mark each day and keep your make-up ledger')}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>{error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<><Section title={T('Fasting timetable')} action={rtl?`${days.length} يومًا`:`${days.length} days`}/><View style={s.ramadanList}>{days.map(d=>{const fajr=d.prayers.find(p=>p.name==='Fajr');const maghrib=d.prayers.find(p=>p.name==='Maghrib');return <View key={d.gregorian} style={s.ramadanRow}><View style={s.ramadanDay}><Text style={s.ramadanDayNo}>{d.hijriDay}</Text><Text style={s.ramadanDayLabel}>{T('RAM')}</Text></View><View style={{flex:1}}><Text style={s.ramadanDate}>{rtl ? d.weekdayAr || d.weekday : d.weekday} · {d.gregorian}</Text><Text style={s.meta}>{T(location.label)}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>{T('SUHOOR')}</Text><Text style={s.fastValue}>{clockTime(rtl, fajr?.time || '')}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>{T('IFTAR')}</Text><Text style={s.fastValue}>{maghrib?.time}</Text></View></View>})}</View></>}</>}</ScrollView></Page>}
/* ==================== Phase 4 · women's area ==================== */

// `title` is what is shown, so it is translated; `label` is what a screen reader
// and the QA scripts read, and it stays in English in both languages.
function PrivateRow({ title, caption, graphic, onPress, rtl, label }: { title: string; caption: string; graphic: string; onPress: () => void; rtl: boolean; label?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label ?? title} onPress={onPress} style={s.setting}>
    <ToolGraphic tool={graphic} size={44} />
    <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{title}</Text><Text style={s.meta}>{caption}</Text></View>
    {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
  </Pressable>;
}

function StatBox({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <View style={s.statBox}><Text style={s.statLabel}>{label}</Text><Text style={s.statValue}>{value}</Text>{!!hint && <Text style={s.meta}>{hint}</Text>}</View>;
}

function PinDots({ filled, error }: { filled: number; error?: boolean }) {
  return <View style={s.pinDots}>{Array.from({ length: 4 }, (_, i) => <View key={i} style={[s.pinDot, i < filled && s.pinDotFilled, !!error && s.pinDotError]} />)}</View>;
}

function PinKeypad({ onDigit, onDelete, onBiometric, biometric }: { onDigit: (digit: string) => void; onDelete: () => void; onBiometric?: (() => void) | null; biometric: BiometricInfo }) {
  const { rtl } = useLanguage();
  const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
  return <View style={s.pinPad}>
    {rows.map((row) => <View key={row.join('')} style={s.pinRow}>{row.map((digit) => <Pressable key={digit} accessibilityRole="button" accessibilityLabel={`${tx(rtl,'Digit')} ${digit}`} onPress={() => onDigit(digit)} style={({ pressed }) => [s.pinKey, pressed && s.press]}><Text style={s.pinKeyText}>{digit}</Text></Pressable>)}</View>)}
    <View style={s.pinRow}>
      {onBiometric ? <Pressable accessibilityRole="button" accessibilityLabel={`${tx(rtl,'Unlock with')} ${biometric.label}`} onPress={onBiometric} style={s.pinKey}>{ico(biometric.kind === 'face' ? 'scan-outline' : 'finger-print-outline', 22, C.green)}</Pressable> : <View style={s.pinKeyGhost} />}
      <Pressable accessibilityRole="button" accessibilityLabel={tx(rtl,'Digit 0')} onPress={() => onDigit('0')} style={({ pressed }) => [s.pinKey, pressed && s.press]}><Text style={s.pinKeyText}>0</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={tx(rtl,'Delete the last digit')} onPress={onDelete} style={s.pinKey}>{ico('backspace-outline', 20, C.ink)}</Pressable>
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
  const T = (text: string) => tx(rtl, text);
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
    <View style={s.pinPage}>
      <ToolGraphic tool="Privacy lock" size={78} />
      <Text style={s.dataTitle}>{T('Locked')}</Text>
      <Text style={s.intro}>{rtl ? 'تبقى هذه السجلات على هذا الجهاز. افتحيها بـ ' : 'These records stay on this device. Unlock with '}{info.available ? `${info.label}${rtl ? ' أو ' : ' or '}` : ''}{rtl ? 'الرمز لعرضها.' : 'your PIN to open them.'}</Text>
      <PinDots filled={pin.length} error={!!error} />
      <Text style={[s.pinHint, !!error && s.pinHintError]}>{error || (config.pinSet ? T('Enter your 4-digit PIN') : T('No PIN has been set yet'))}</Text>
      <PinKeypad onDigit={digit} onDelete={() => { setPin((value) => value.slice(0, -1)); setError(''); }} onBiometric={config.biometric && info.available ? withBiometrics : null} biometric={info} />
      {!config.pinSet && <Pressable accessibilityLabel={T('Set a PIN')} onPress={() => navigation.navigate('Privacy Lock')} style={s.sectionLink}><Text style={s.sectionAction}>{T('Set a PIN')}{rtl ? ' ←' : ' →'}</Text></Pressable>}
    </View>
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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
      <Pressable accessibilityLabel={T('Fewer')} onPress={dec} style={s.stepButton}>{ico('remove', 20, C.green)}</Pressable>
      <Text style={s.settingName}>{value === null ? T('Not sure') : `${value} ${T(unit)}`}</Text>
      <Pressable accessibilityLabel={T('More')} onPress={inc} style={s.stepButton}>{ico('add', 20, C.green)}</Pressable>
    </View>
  );

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Istihada')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Istihada" size={78} />
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
        {assessment.reasons.map((reason: string, index: number) => <Text key={index} style={[s.dataBody, index > 0 && { marginTop: 8 }]}>{T(reason)}</Text>)}
        {assessment.adah !== null && <Text style={[s.meta, { marginTop: 10 }]}>{T(`Your recorded pattern: about ${assessment.adah} days.`)}</Text>}
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
        <Pressable onPress={() => navigation.navigate('Cycle')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('Record these days so your own pattern stays accurate.')}</Text></View>
          {ico('arrow-forward', 18, C.green)}
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Qada')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Qada Fasts')}</Text><Text style={s.meta}>{T('Fast days that fall in hayd or nifas are owed, and are kept here.')}</Text></View>
          {ico('arrow-forward', 18, C.green)}
        </Pressable>
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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
      ? T(`Ramadan is under way — day ${Math.min(30, Math.abs(daysBetween(plan.start, today)) + 1)}`)
      : T(`Starts in ${plan.daysLeft} days`);

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
        accessibilityLabel={T(`Day ${day.ramadanDay}, ${RAMADAN_STATE_LABEL[day.state]}`)}
      >
        <Text style={[RAMADAN_CELL.cellNum, { color: numColour }]}>{day.ramadanDay}</Text>
      </View>
    );
  };

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Ramadan Planner')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Ramadan Planner" size={78} />
      <Text style={s.dataTitle}>{T('Ramadan through your cycle')}</Text>
      <Text style={s.intro}>{T('Thirty days, and the handful your cycle is likely to claim from them. The app counts forward from your own recorded pattern and marks the days it lands on, so the number you owe is known before the month begins rather than counted up at the end of it.')}</Text>

      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T(`Ramadan ${plan.hijriYear}`)}</Text>
        <Text style={s.dataName}>{formatLongDay(plan.start)}{T(' — ')}{formatLongDay(plan.end)}</Text>
        <Text style={s.meta}>{whenText}</Text>

        <Text style={RAMADAN_CELL.heroOwed}>{owedText}</Text>
        <Text style={RAMADAN_CELL.heroUnit}>
          {plan.hasPattern
            ? T(plan.owedHigh === plan.owedLow ? 'fasts likely to be owed' : 'fasts likely to be owed — the second figure if the timing shifts')
            : T('no projection yet')}
        </Text>

        {plan.hasPattern && (
          <Text style={[s.meta, { marginTop: 8 }]}>
            {T(`To make up before ${formatDay(plan.deadline)} — ${plan.daysUntilDeadline} days away.`)}
          </Text>
        )}
      </View>

      {!plan.hasPattern && (
        <View style={s.dataCard}>
          <Text style={s.dataName}>{T('What it needs from you')}</Text>
          <Text style={s.dataBody}>{T('This is counted from your own cycles, not from an average. Record two complete cycles — a start and an end for each — and the projection appears here. Until then the honest answer is no answer, and a number invented from someone else’s pattern would be worse than a blank.')}</Text>
          <Pressable onPress={() => navigation.navigate('Cycle')} style={[s.setting, { marginTop: 8, borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('Record a start and an end for each cycle.')}</Text></View>
            {ico('arrow-forward', 18, C.green)}
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
          <Text style={[s.meta, { marginTop: 6 }]}>{T(`Counted from your last ${plan.cycleCount} recorded cycles.`) }</Text>
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
        <Pressable onPress={() => navigation.navigate('Cycle')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Cycle Tracker')}</Text><Text style={s.meta}>{T('The projection is only as good as the record it is built on.')}</Text></View>
          {ico('arrow-forward', 18, C.green)}
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Qada')} style={s.setting}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Qada Fasts')}</Text><Text style={s.meta}>{T('Once a day is actually missed, keep it here.')}</Text></View>
          {ico('arrow-forward', 18, C.green)}
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Istihada')} style={[s.setting, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Istihada')}</Text><Text style={s.meta}>{T('When bleeding runs past your pattern, this is the question it raises.')}</Text></View>
          {ico('arrow-forward', 18, C.green)}
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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const womens = useWomens();
  const stats = cycleStats(womens);
  const nifas = nifasStats(womens);

  /* Where each open act actually lives in the app. Kept here, next to the
     screen, because routing is the screen's business and not the service's. */
  const GO: Record<TheseDaysAct['id'], () => void> = {
    listen: () => navigation.navigate('Quran', { screen: 'Audio Player', initial: false }),
    meaning: () => navigation.navigate('Quran', { screen: 'Tafsir Compare', initial: false }),
    vocabulary: () => navigation.navigate('Library', { screen: 'Quran Vocabulary', initial: false }),
    dhikr: () => navigation.navigate('Tasbih'),
    dua: () => navigation.navigate('Library', { screen: 'Duas', initial: false })
  };

  const onFlow = stats.status === 'flow' || stats.status === 'spotting' || nifas.active;
  const dayLine = nifas.active
    ? T(`Day ${nifas.day} of post-natal bleeding`)
    : stats.active
      ? T(`Day ${stats.dayOfCycle} of this cycle`)
      : null;

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('These Days')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="These Days" size={78} />
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
            {ico('arrow-forward', 18, C.green)}
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
  const T = (text: string) => tx(rtl, text);
  const womens = useWomens();
  const { config, info } = usePrivateGate();
  const stats = cycleStats(womens);
  const nifas = nifasStats(womens);
  const qada = qadaStats(womens);
  const today = dayKey();

  if (!womens.optedIn) return <Page><ToolBar title={T('Women’s worship')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage}>
      <ToolGraphic tool="Women’s worship" size={80} />
      <Text style={s.dataTitle}>{T('A private area')}</Text>
      <Text style={s.intro}>{T('Cycle and purity records, the days after childbirth, and the fasts owed because of them — kept only on this device. Nothing is uploaded and no account is involved.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('WHAT IT HOLDS')}</Text>
        <Text style={s.dataBody}>{T('Your own cycle lengths and averages, a prediction worked out from your history rather than an assumption, purity and ghusl guidance, the post-natal days, and a running scorecard of make-up fasts.')}</Text>
        <Text style={s.dataBody}>{T('You can put a PIN in front of it, or use the face or fingerprint unlock your phone already has.')}</Text>
        <Pressable accessibilityLabel={T('Turn on the women’s area')} onPress={() => void setOptedIn(true)} style={s.primary}><Text style={s.primaryText}>{T('Turn on this area')}</Text></Pressable>
      </View>
    </ScrollView>
  </Page>;

  const status = nifas.active ? rtl ? `النفاس · اليوم ${nifas.day}` : `Post-natal · day ${nifas.day}` : stats.status === 'flow' ? rtl ? `الدورة · اليوم ${stats.dayOfCycle}` : `Cycle · day ${stats.dayOfCycle}` : stats.status === 'spotting' ? T('Spotting') : stats.status === 'pure' ? T('Pure') : T('Nothing recorded today');
  const detail = nifas.active
    ? rtl ? `بقي ${LIMITS.nifasMaxDays - nifas.day} يومًا من الأربعين` : `${LIMITS.nifasMaxDays - nifas.day} days left inside the forty`
    : stats.active
      ? rtl ? `بدأت ${formatDay(stats.active.start, language)} · اليوم ${stats.dayOfCycle}` : `Started ${formatDay(stats.active.start, language)} · day ${stats.dayOfCycle}`
      : stats.nextStart
        ? rtl ? `الدورة القادمة المتوقعة بعد ${stats.daysToNext} يومًا` : `Next cycle expected in ${stats.daysToNext} days`
        : T('Record a cycle to see your averages');

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Women’s worship')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View style={{ flex: 1 }}><Text style={s.nextCardLabel}>{T('TODAY')} · {formatDay(today, language).toUpperCase()}</Text><Text style={s.zakatNo}>{status}</Text><Text style={s.weekScoreBody}>{detail}</Text></View>
      </LinearGradient>
      <View style={s.statGrid}>
        <StatBox label={T('AVERAGE CYCLE')} value={stats.averageCycle ? rtl ? `${stats.averageCycle} يومًا` : `${stats.averageCycle} days` : '—'} hint={stats.averageCycle ? rtl ? `من ${stats.cycleCount} دورات مسجَّلة` : `From ${stats.cycleCount} recorded cycles` : stats.cycleCount ? T('Two cycles needed') : T('No history yet')} />
        <StatBox label={T('NEXT EXPECTED')} value={stats.nextStart ? formatDay(stats.nextStart, language) : '—'} hint={stats.daysToNext !== null ? rtl ? `بعد ${stats.daysToNext} يومًا` : `In ${stats.daysToNext} days` : undefined} />
        <StatBox label={T('FASTS OWED')} value={`${qada.remaining}`} hint={rtl ? `قُضي ${qada.done}` : `${qada.done} settled`} />
        <StatBox label={T('POST-NATAL')} value={nifas.active ? rtl ? `اليوم ${nifas.day}` : `Day ${nifas.day}` : '—'} hint={nifas.active ? T('Active') : T('Not recorded')} />
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
        <PrivateRow rtl={rtl} graphic="Privacy lock" title={config.pinSet ? T('Lock and PIN') : T('Add a PIN')} label={config.pinSet ? 'Lock and PIN' : 'Add a PIN'} caption={config.pinSet ? (config.required ? (rtl ? `مقفل · ${config.biometric && info.available ? `${info.label} أو ` : ''}الرمز` : `Locked · ${config.biometric && info.available ? `${info.label} or ` : ''}PIN`) : T('PIN saved, lock is off')) : info.available ? T('Face and fingerprint unlock are ready on this device') : T('This device has no biometric unlock, so a PIN is used')} onPress={() => navigation.navigate('Privacy Lock')} />
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
  const T = (text: string) => tx(rtl, text);
  const womens = useWomens();
  const stats = cycleStats(womens);
  const today = dayKey();
  const chips = recentPurity(womens, today, 14);
  const cycle = (status: PurityStatus) => (status === 'flow' ? 'spotting' : status === 'spotting' ? 'pure' : 'flow') as PurityStatus;
  const statusWord: Record<string, string> = { flow: T('Flow'), spotting: T('Spotting'), pure: T('Pure') };

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Cycle')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Cycle" size={78} />
      <Text style={s.dataTitle}>{T('Your cycle')}</Text>
      <Text style={s.intro}>{T('Record the days as they come. The averages and the prediction are worked out from your own history — nothing is assumed about what your cycle should look like.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{stats.active ? (rtl ? `جارية · اليوم ${stats.dayOfCycle}` : `IN PROGRESS · DAY ${stats.dayOfCycle}`) : T('NO CYCLE IN PROGRESS')}</Text>
        <Text style={s.dataBody}>{stats.active ? (rtl ? `بدأت ${formatDay(stats.active.start, language)}. مضى ${stats.dayOfCycle} ${stats.dayOfCycle === 1 ? T('day') : T('days')}.` : `Started ${formatDay(stats.active.start, language)}. ${stats.dayOfCycle} ${stats.dayOfCycle === 1 ? T('day') : T('days')} so far.`) : T('When bleeding begins, start a cycle here and the count begins from that day.')}</Text>
        {stats.active ? <>
          <Text style={s.preferenceLabel}>{T('FLOW')}</Text>
          <View style={s.choiceRow}>{FLOW_LEVELS.map((level) => <ChoicePill key={level.id} label={T(level.label)} selected={stats.active?.flow === level.id} onPress={() => void setFlow(level.id)} />)}</View>
          <View style={s.actionRow}>
            <Pressable accessibilityLabel={T('Mark purity today')} onPress={() => void endCycle(today)} style={s.secondary}><Text style={s.secondaryText}>{T('Mark purity today')}</Text></Pressable>
          </View>
          <Text style={s.meta}>{T('Purity ends the cycle and starts the count towards the next one.')}</Text>
        </> : <Pressable accessibilityLabel={T('Start a cycle today')} onPress={() => void startCycle(today)} style={s.primary}><Text style={s.primaryText}>{T('Start a cycle today')}</Text></Pressable>}
      </View>
      <Section title={T('Your pattern')} />
      <View style={s.statGrid}>
        <StatBox label={T('AVERAGE CYCLE')} value={stats.averageCycle ? rtl ? `${stats.averageCycle} يومًا` : `${stats.averageCycle} days` : '—'} hint={stats.averageCycle ? T('From your last few cycles') : T('Two cycles needed')} />
        <StatBox label={T('AVERAGE LENGTH')} value={stats.averagePeriod ? rtl ? `${stats.averagePeriod} يومًا` : `${stats.averagePeriod} days` : '—'} hint={T('Bleeding days')} />
        <StatBox label={T('NEXT EXPECTED')} value={stats.nextStart ? formatDay(stats.nextStart, language) : '—'} hint={stats.daysToNext !== null ? rtl ? `بعد ${stats.daysToNext} يومًا` : `In ${stats.daysToNext} days` : undefined} />
        <StatBox label={T('FERTILE WINDOW')} value={stats.fertileStart ? `${formatDay(stats.fertileStart, language)} – ${formatDay(stats.fertileEnd as string, language)}` : '—'} hint={T('An estimate, not a certainty')} />
      </View>
      <Section title={T('Day by day')} action={T('Tap to change')} />
      <View style={s.dataCard}>
        <View style={s.purityRow}>{chips.map((chip) => <Pressable key={chip.date} accessibilityLabel={`${formatDay(chip.date, language)}: ${chip.status ? statusWord[chip.status] : T('not recorded')}`} onPress={() => void logPurity(chip.date, chip.status ? cycle(chip.status) : 'flow')} style={[s.purityChip, chip.status === 'flow' && s.purityFlow, chip.status === 'spotting' && s.puritySpotting, chip.status === 'pure' && s.purityPure, chip.date === today && s.purityToday]}><Text style={s.purityDay}>{Number(chip.date.slice(8, 10))}</Text><Text style={s.purityLabel}>{chip.status ? statusWord[chip.status].slice(0, 3) : '—'}</Text></Pressable>)}</View>
        <Text style={s.meta}>{T('The last fourteen days. Nothing is recorded until you tap a day.')}</Text>
      </View>
      <Section title={T('History')} />
      {!womens.cycles.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('No cycles recorded yet.')}</Text></View> : <View style={s.settings}>{womens.cycles.slice(0, 12).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.start, language)}{entry.end ? ` – ${formatDay(entry.end, language)}` : (rtl ? ' · مستمرة' : ' · ongoing')}</Text><Text style={s.meta}>{entry.end ? (rtl ? `${daysBetween(entry.start, entry.end) + 1} أيام` : `${daysBetween(entry.start, entry.end) + 1} days`) : (rtl ? `اليوم ${Math.max(1, daysBetween(entry.start, today) + 1)}` : `Day ${Math.max(1, daysBetween(entry.start, today) + 1)}`)} · {T(FLOW_LEVELS.find((level) => level.id === entry.flow)?.label || 'Flow')}</Text></View>
        <Pressable accessibilityLabel={T('Delete this cycle')} onPress={() => void deleteCycle(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Pressable>
      </View>)}</View>}
    </ScrollView>
  </Page></PrivateArea>;
}

function PurityScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Purity" size={78} />
      <Text style={s.dataTitle}>{T('Purity and ghusl')}</Text>
      <Text style={s.intro}>{T('What ends the bleeding, the washing that follows it, and the days after childbirth. The well-known positions are described here; the ruling for your case belongs with a scholar you trust.')}</Text>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View style={{ flex: 1 }}>
          <Text style={s.nextCardLabel}>{nifas.active ? T('POST-NATAL') : T('NIFAS NOT RECORDED')}</Text>
          <Text style={s.zakatNo}>{nifas.active ? rtl ? `اليوم ${nifas.day}` : `Day ${nifas.day}` : '—'}</Text>
          <Text style={s.weekScoreBody}>{nifas.active ? (nifas.pastLimit ? T('Past forty days — speak to a scholar and a doctor') : rtl ? `بقي ${nifas.remaining} يومًا من الأربعين` : `${nifas.remaining} days remain inside the forty`) : (rtl ? `يُعدّ دم ما بعد الولادة عادةً إلى ${LIMITS.nifasMaxDays} يومًا.` : `Bleeding after childbirth is commonly counted up to ${LIMITS.nifasMaxDays} days.`)}</Text>
        </View>
      </LinearGradient>
      <View style={s.dataCard}>
        {nifas.active ? <>
          <Text style={s.dataMeta}>{rtl ? 'بدأت' : 'STARTED'} {formatDay(nifas.active.start, language)}</Text>
          <View style={s.actionRow}>
            <Pressable accessibilityLabel={T('I am pure now')} onPress={() => void endNifas(dayKey())} style={s.primary}><Text style={s.primaryText}>{T('I am pure now')}</Text></Pressable>
          </View>
        </> : <>
          <Text style={s.dataBody}>{T('Record the birth when it happens and the counter follows the days. Purity is marked the day the bleeding stops.')}</Text>
          <Pressable accessibilityLabel={T('Record a birth')} onPress={() => void startNifas(dayKey())} style={s.primary}><Text style={s.primaryText}>{T('Record a birth today')}</Text></Pressable>
        </>}
      </View>
      {!!womens.nifas.filter((entry) => entry.end).length && <><Section title={T('Earlier births')} /><View style={s.settings}>{womens.nifas.filter((entry) => entry.end).slice(0, 6).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.start, language)} – {formatDay(entry.end as string, language)}</Text><Text style={s.meta}>{rtl?`${daysBetween(entry.start, entry.end as string) + 1} ${arNoun(daysBetween(entry.start, entry.end as string) + 1, 'يوم', 'يومان', 'أيام', 'يومًا')}`:`${daysBetween(entry.start, entry.end as string) + 1} days`}</Text></View>
        <Pressable accessibilityLabel={T('Delete this record')} onPress={() => void deleteNifas(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Pressable>
      </View>)}</View></>}
      <Section title={T('The verse on menstruation')} action={T('Quran 2:222')} />
      {verseError ? <ErrorState message={verseError} retry={load} /> : !verse ? <Spinner /> : <View style={s.dataCard}>
        <Text style={s.dataArabic}>{verse.arabic}</Text>
        <Text style={s.dataBody}>{verse.english}</Text>
      </View>}
      <Section title={T('Signs that bleeding has ended')} />
      <View style={s.settings}>{TUHR_SIGNS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('The ghusl — what is required')} />
      <View style={s.dataCard}>
        <Text style={s.dataArabic}>{BISMILLAH_ARABIC}</Text>
        <Text style={s.dataMeta}>{T('THE INTENTION, IN THE HEART AND ON THE TONGUE')}</Text>
        <Text style={s.dataArabic}>{NIYYAH_ARABIC}</Text>
        <Text style={s.dataBody}>{rtl ? `${NIYYAH_ARABIC} — ${NIYYAH_TRANSLITERATION}` : `${NIYYAH_TRANSLITERATION} — ${NIYYAH_MEANING}`}</Text>
      </View>
      <View style={s.settings}>{GHUSL_FARD.map((step, index) => <View key={step} style={s.setting}><View style={s.stepNo}><Text style={s.stepNoText}>{index + 1}</Text></View><Text style={[s.guideStepText, { flex: 1 }]}>{T(step)}</Text></View>)}</View>
      <Section title={T('The ghusl — as the Prophet ﷺ performed it')} />
      <View style={s.settings}>{GHUSL_SUNNAH.map((step, index) => <View key={step} style={s.setting}><View style={s.stepNo}><Text style={s.stepNoText}>{index + 1}</Text></View><Text style={[s.guideStepText, { flex: 1 }]}>{T(step)}</Text></View>)}</View>
      <Section title={T('Hayd, nifas and istihadha')} />
      <View style={s.settings}>{EXPLANATIONS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('BEFORE YOU RELY ON ANY OF THIS')}</Text><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

function QadaScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const womens = useWomens();
  const qada = qadaStats(womens);
  const [date, setDate] = useState(dayKey());
  const [reason, setReason] = useState<QadaReason>('menstruation');
  const owed = womens.qada.filter((entry) => !entry.done);
  const settled = womens.qada.filter((entry) => entry.done);

  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Qada fasts')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Qada fasts" size={78} />
      <Text style={s.dataTitle}>{T('Days owed')}</Text>
      <Text style={s.intro}>{T('Fast days missed through menstruation or the post-natal days are made up one for one, before the next Ramadan. This is the running count.')}</Text>
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View><Text style={s.nextCardLabel}>{T('STILL OWED')}</Text><Text style={s.zakatNo}>{qada.remaining}</Text><Text style={s.weekScoreBody}>{qada.total} {rtl ? 'مسجَّلة في المجموع' : 'recorded in total'}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={s.nextCardLabel}>{T('SETTLED')}</Text><Text style={s.zakatNo}>{qada.done}</Text><Text style={s.weekScoreBody}>{qada.percent}% {rtl ? 'مكتمل' : 'complete'}</Text></View>
      </LinearGradient>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${qada.percent}%` } as any]} /></View>
      <Section title={T('Add a missed day')} />
      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{T('THE DAY THAT WAS MISSED')}</Text>
        <View style={s.dayStepper}>
          <Pressable accessibilityLabel={T('One day earlier')} onPress={() => setDate((value) => addDays(value, -1))} style={s.stepButton}>{ico(rtl ? 'arrow-forward' : 'arrow-back', 19, C.green)}</Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}><Text style={s.settingName}>{formatLongDay(date, language)}</Text><Text style={s.meta}>{date}</Text></View>
          <Pressable accessibilityLabel={T('One day later')} onPress={() => setDate((value) => addDays(value, 1))} style={s.stepButton}>{ico(rtl ? 'arrow-back' : 'arrow-forward', 19, C.green)}</Pressable>
        </View>
        <Text style={s.preferenceLabel}>{T('WHY IT WAS MISSED')}</Text>
        <View style={s.choiceGrid}>{QADA_REASONS.map((item) => <ChoicePill key={item.id} label={T(item.label)} selected={reason === item.id} onPress={() => setReason(item.id)} />)}</View>
        <Pressable accessibilityLabel={T('Add this day to the ledger')} onPress={() => void addQada(date, reason)} style={s.primary}><Text style={s.primaryText}>{T('Add this day')}</Text></Pressable>
      </View>
      <Section title={T('Still owed')} action={`${owed.length}`} />
      {!owed.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('Nothing outstanding. Every recorded day has been settled.')}</Text></View> : <View style={s.settings}>{owed.map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <Pressable accessibilityLabel={`${T('Mark as settled')} ${formatDay(entry.date, language)}`} onPress={() => void toggleQada(entry.id)} style={s.stepCheck}>{entry.done ? ico('checkmark', 22, C.green) : null}</Pressable>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.date, language)}</Text><Text style={s.meta}>{T(QADA_REASONS.find((item) => item.id === entry.reason)?.label ?? '')}</Text></View>
        <Pressable accessibilityLabel={T('Delete this entry')} onPress={() => void deleteQada(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Pressable>
      </View>)}</View>}
      {!!settled.length && <><Section title={T('Settled')} action={`${settled.length}`} /><View style={s.settings}>{settled.slice(0, 20).map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <Pressable accessibilityLabel={`${T('Reopen')} ${formatDay(entry.date, language)}`} onPress={() => void toggleQada(entry.id)} style={[s.stepCheck, s.stepCheckDone]}>{ico('checkmark', 22, C.white)}</Pressable>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatDay(entry.date, language)}</Text><Text style={s.meta}>{rtl?`أُدِّيَ في ${entry.doneOn ? formatDay(entry.doneOn, language) : '—'}`:`Made up on ${entry.doneOn ? formatDay(entry.doneOn, language) : '—'}`}</Text></View>
        <Pressable accessibilityLabel={T('Delete this entry')} onPress={() => void deleteQada(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Pressable>
      </View>)}</View></>}
    </ScrollView>
  </Page></PrivateArea>;
}

function WomenGuidesScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  return <PrivateArea navigation={navigation}><Page><ToolBar title={T('Worship guidance')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Worship guides" size={78} />
      <Text style={s.dataTitle}>{T('Worship in these days')}</Text>
      <Text style={s.intro}>{T('What is lifted, what continues, and what is owed afterwards. These are the well-known positions, described plainly — the ruling for your situation belongs with a scholar you trust.')}</Text>
      <Section title={T('The acts of worship')} />
      <View style={s.settings}>{WORSHIP_GUIDANCE.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('The terms')} />
      <View style={s.settings}>{EXPLANATIONS.map((block) => <View key={block.title} style={s.guideBlock}><Text style={s.guideTitle}>{T(block.title)}</Text><Text style={s.dataBody}>{T(block.body)}</Text></View>)}</View>
      <Section title={T('References')} />
      <View style={s.settings}>{REFERENCES.map((reference) => <View key={reference} style={s.setting}><ToolGraphic tool="Quran" size={28} /><Text style={[s.settingName, { flex: 1, marginHorizontal: 12 }]}>{T(reference)}</Text></View>)}</View>
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('AND SEE A DOCTOR')}</Text><Text style={s.dataBody}>{T(ADVISORY)}</Text></View>
    </ScrollView>
  </Page></PrivateArea>;
}

function PrivacyLockScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <View style={s.pinPage}>
      <ToolGraphic tool="Privacy lock" size={78} />
      <Text style={s.dataTitle}>{stage === 'create' ? T('Choose a PIN') : T('Confirm it')}</Text>
      <Text style={s.intro}>{T('Four digits. There is no reset link and no recovery email — this code lives on this device only, so choose one you will remember.')}</Text>
      <PinDots filled={draft.length} error={!!error} />
      <Text style={[s.pinHint, !!error && s.pinHintError]}>{error || (stage === 'create' ? T('Enter four digits') : T('Enter the same four digits'))}</Text>
      <PinKeypad onDigit={digit} onDelete={() => { setDraft((value) => value.slice(0, -1)); setError(''); }} biometric={info} />
      <Pressable accessibilityLabel={T('Cancel')} onPress={() => { setStage('idle'); setDraft(''); setFirst(''); setError(''); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Cancel')}</Text></Pressable>
    </View>
  </Page>;

  return <Page><ToolBar title={T('Lock and PIN')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Privacy lock" size={78} />
      <Text style={s.dataTitle}>{T('Private by default')}</Text>
      <Text style={s.intro}>{T('The women’s screens can be put behind a gate. The PIN is stored as a salted digest, never as the digits themselves, and the face or fingerprint scan is handled entirely by your phone — this app is only told yes or no.')}</Text>
      <View style={s.dataCard}>
        <Text style={s.dataMeta}>{T('THE PIN')}</Text>
        <Text style={s.dataBody}>{config.pinSet ? T('A PIN is saved on this device.') : T('No PIN yet. Choose one to switch the lock on.')}</Text>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel={config.pinSet ? 'Change the PIN' : 'Set a PIN'} onPress={() => { setStage('create'); setDraft(''); setFirst(''); setError(''); setNote(''); }} style={s.primary}><Text style={s.primaryText}>{config.pinSet ? T('Change PIN') : T('Set a PIN')}</Text></Pressable>
          {config.pinSet && <Pressable accessibilityLabel={T('Remove the PIN')} onPress={() => void removePin().then(() => setNote(T('The PIN and the lock were removed.')))} style={s.secondary}><Text style={s.secondaryText}>{T('Remove PIN')}</Text></Pressable>}
        </View>
        {!!note && <Text style={s.dataMeta}>{T(note).toUpperCase()}</Text>}
      </View>
      {config.pinSet && <>
        <Section title={T('The gate')} />
        <View style={s.settings}>
          <View style={[s.setting, ]}>
            <ToolGraphic tool="Privacy lock" size={44} />
            <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{T('Lock the women’s area')}</Text><Text style={s.meta}>{T('Ask for the PIN whenever these screens are opened')}</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch accessibilityLabel={T('Lock the women’s area')} value={config.required} onValueChange={(value) => void updateLockSettings({ required: value })} trackColor={{ true: C.green }} /></View>
          </View>
          <View style={[s.setting, ]}>
            <ToolGraphic tool="Privacy lock" size={44} />
            <View style={{ flex: 1, marginHorizontal: 12 }}><Text style={s.settingName}>{info.available ? `Use ${info.label}` : T('Biometric unlock')}</Text><Text style={s.meta}>{info.available ? (info.enrolled ? T('Set up on this device') : T('Not enrolled on this device yet')) : T('This device cannot use face or fingerprint unlock, so the PIN is used')}</Text></View>
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
function ZakatScreen({ navigation }: any) {
  const { language, rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const zakat = useZakat();
  const market = useMarket();
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState('');
  const result = computeZakat(zakat);
  const live = livePrices(zakat.currency);
  const fresh = marketIsFresh();
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
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Zakat" size={78} />
      <Text style={s.dataTitle}>{T('Work out what is due')}</Text>
      <Text style={s.intro}>{T('List what you own, subtract what falls due, and compare what is left with the nisab. Prices and exchange rates are fetched live where they are reachable and kept on this device when they are not. This is arithmetic, not a ruling — take the details to a scholar.')}</Text>

      <Section title={T('Currency')} action={zakat.currency} />
      <View style={s.preferencePanel}>
        <View style={s.choiceGrid}>{CURRENCIES.map((currency) => <ChoicePill key={currency.code} label={currency.code} selected={zakat.currency === currency.code} onPress={() => void setCurrency(currency.code)} />)}</View>
        <Text style={s.meta}>{T(CURRENCIES.find((item) => item.code === zakat.currency)?.name ?? zakat.currency)} · {T('every figure below is shown in it.')}</Text>
      </View>

      <Section title={T('What you own')} />
      <View style={s.settings}>
        {zakat.assets.map((asset) => <View key={asset.id} style={[s.assetRow, ]}>
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Text style={s.settingName}>{T(asset.label)}</Text>
            {asset.kind === 'gold' || asset.kind === 'silver' ? <Text style={s.meta}>{formatMoney(Number(asset.amount) || 0, zakat.currency, 0)} {rtl ? 'بسعر' : 'at'} {formatMoney(metalPrice(asset.kind), zakat.currency)} {rtl ? 'للغرام' : 'per gram'}</Text> : <Text style={s.meta}>{asset.kind === 'cash' || asset.kind === 'bank' ? T('Balances on the day of your Zakat') : T('Market value today')}</Text>}
          </View>
          <TextInput accessibilityLabel={`${T('Amount of')} ${asset.label}`} keyboardType="numeric" value={asset.amount ? String(asset.amount) : ''} onChangeText={(value) => void setAssetAmount(asset.id, Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>)}
      </View>

      <Section title={T('What falls due')} />
      <View style={s.settings}>
        {zakat.liabilities.map((item) => <View key={item.id} style={[s.assetRow, ]}>
          <View style={{ flex: 1, marginHorizontal: 4 }}><Text style={s.settingName}>{T(item.label)}</Text><Text style={s.meta}>{T('Subtracted from the total above')}</Text></View>
          <TextInput accessibilityLabel={`${T('Amount of')} ${item.label}`} keyboardType="numeric" value={item.amount ? String(item.amount) : ''} onChangeText={(value) => void setLiabilityAmount(item.id, Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>)}
      </View>

      <Section title={T('Gold and silver prices')} />
      <View style={s.dataCard}>
        <Text style={s.preferenceLabel}>{rtl ? 'لكل غرام، بالعملة ' : 'PER GRAM, IN '}{zakat.currency}</Text>
        <View style={[s.metalRow, ]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Gold')}</Text><Text style={s.meta}>{rtl ? `النصاب ${NISAB_GOLD_GRAMS} غرامًا` : `Nisab is ${NISAB_GOLD_GRAMS} grams`}</Text></View>
          <TextInput accessibilityLabel={T('Gold price per gram')} keyboardType="numeric" value={result.goldPerGram ? String(Number(result.goldPerGram.toFixed(2))) : ''} onChangeText={(value) => void setMetalPrice('gold', Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>
        <View style={[s.metalRow, ]}>
          <View style={{ flex: 1 }}><Text style={s.settingName}>{T('Silver')}</Text><Text style={s.meta}>{rtl ? `النصاب ${NISAB_SILVER_GRAMS} غرامًا` : `Nisab is ${NISAB_SILVER_GRAMS} grams`}</Text></View>
          <TextInput accessibilityLabel={T('Silver price per gram')} keyboardType="numeric" value={result.silverPerGram ? String(Number(result.silverPerGram.toFixed(2))) : ''} onChangeText={(value) => void setMetalPrice('silver', Number(value.replace(/[^0-9.]/g, '')) || 0)} placeholder="0" placeholderTextColor={C.muted} style={s.assetInput} />
        </View>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel={T('Use live prices')} onPress={() => void useLiveMetalPrices()} style={s.secondary}><Text style={s.secondaryText}>{T('Use live prices')}</Text></Pressable>
          <Pressable accessibilityLabel={T('Refresh prices and rates')} onPress={refresh} style={s.secondary}><Text style={s.secondaryText}>{refreshing ? T('Refreshing…') : T('Refresh')}</Text></Pressable>
        </View>
        <Text style={s.meta}>{zakat.prices.custom ? T('You are using your own prices.') : fresh ? T('Prices and exchange rates were fetched within the last twelve hours.') : T('Prices and rates were last saved on this device.')}{market.fetchedAt ? ` ${rtl ? 'آخر تحديث' : 'Updated'} ${new Date(market.fetchedAt).toLocaleString(language === 'ar' ? 'ar-u-nu-latn' : language)}.` : ''}</Text>
      </View>

      <Section title={T('The nisab')} />
      <View style={s.dataCard}>
        <View style={s.choiceRow}><ChoicePill label={`${T('Gold')} · ${NISAB_GOLD_GRAMS}${rtl ? ' غ' : 'g'}`} selected={zakat.basis === 'gold'} onPress={() => void setBasis('gold')} /><ChoicePill label={`${T('Silver')} · ${NISAB_SILVER_GRAMS}${rtl ? ' غ' : 'g'}`} selected={zakat.basis === 'silver'} onPress={() => void setBasis('silver')} /></View>
        <View style={s.statGrid}>
          <StatBox label={T('GOLD NISAB')} value={formatMoney(NISAB_GOLD_GRAMS * result.goldPerGram, zakat.currency, 0)} hint={`${NISAB_GOLD_GRAMS} ${rtl ? 'غرامًا' : 'grams'}`} />
          <StatBox label={T('SILVER NISAB')} value={formatMoney(NISAB_SILVER_GRAMS * result.silverPerGram, zakat.currency, 0)} hint={`${NISAB_SILVER_GRAMS} ${rtl ? 'غرامًا' : 'grams'}`} />
        </View>
        <Text style={s.meta}>{T('Scholars differ on which of the two to measure against. The lower threshold brings more wealth into Zakat; take the choice to someone you trust.')}</Text>
      </View>

      <Section title={T('The result')} />
      <LinearGradient colors={[C.heroA, C.green]} style={s.summaryScore}>
        <View><Text style={s.nextCardLabel}>{T('ZAKAT DUE · 2.5%')}</Text><Text style={s.zakatNo}>{formatMoney(result.zakat, zakat.currency)}</Text><Text style={s.weekScoreBody}>{result.above ? T('Your net wealth is above the nisab') : T('Below the nisab — nothing is due')}</Text></View>
      </LinearGradient>
      <View style={s.statGrid}>
        <StatBox label={T('GROSS ASSETS')} value={formatMoney(result.gross, zakat.currency, 0)} hint={T('Everything listed above')} />
        <StatBox label={T('LIABILITIES')} value={formatMoney(result.liabilities, zakat.currency, 0)} hint={T('Subtracted')} />
        <StatBox label={T('NET WEALTH')} value={formatMoney(result.net, zakat.currency, 0)} hint={T('What Zakat is taken from')} />
        <StatBox label={T('NISAB')} value={formatMoney(result.nisab, zakat.currency, 0)} hint={zakat.basis === 'gold' ? T('Gold threshold') : T('Silver threshold')} />
      </View>
      <Pressable accessibilityLabel={T('Save this calculation')} onPress={() => void saveCalculation(result).then(() => setSaved(T('Saved on this device.')))} style={s.primary}><Text style={s.primaryText}>{T('Save this calculation')}</Text></Pressable>
      {!!saved && <Text style={s.dataMeta}>{saved.toUpperCase()}</Text>}

      <Section title={T('History')} action={zakat.history.length ? `${zakat.history.length} ${rtl ? 'محفوظة' : 'saved'}` : undefined} onPress={zakat.history.length ? () => void clearHistory() : undefined} />
      {!zakat.history.length ? <View style={s.dataCard}><Text style={s.dataBody}>{T('No saved calculations yet. Save one and it stays here on this device.')}</Text></View> : <View style={s.settings}>{zakat.history.map((entry) => <View key={entry.id} style={[s.setting, ]}>
        <View style={{ flex: 1 }}><Text style={s.settingName}>{formatMoney(entry.zakat, entry.currency)}</Text><Text style={s.meta}>{new Date(entry.at).toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : language)} · {rtl ? 'الصافي' : 'net'} {formatMoney(entry.net, entry.currency, 0)} · {entry.above ? (rtl ? 'فوق' : 'above') : (rtl ? 'دون' : 'below')} {rtl ? 'نصاب' : 'the'} {entry.basis === 'gold' ? T('Gold') : T('Silver')} {rtl ? '' : 'nisab'}</Text></View>
        <Pressable accessibilityLabel={T('Delete this calculation')} onPress={() => void deleteCalculation(entry.id)} style={s.stepButton}>{ico('trash-outline', 18, C.coral)}</Pressable>
      </View>)}</View>}
      <View style={s.dataCard}><Text style={s.dataMeta}>{T('BEFORE YOU PAY')}</Text><Text style={s.dataBody}>{T('What counts as zakatable, how business stock is valued and which debts may be deducted differ between schools and situations. This figure is a careful estimate to take to a scholar, and your Zakat year matters as much as the total.')}</Text></View>
    </ScrollView>
  </Page>;
}

function HadithProgressBars(){
  const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
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
    <Text style={s.dataTitle}>{rtl?`فُتح ${readTotal} من ${hadithTotal.toLocaleString()}`:`${readTotal} of ${hadithTotal.toLocaleString()} opened`}</Text>
    <View style={{marginTop:12,gap:10}}>{rows.map(row=><View key={row.collection.slug}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{rtl ? row.collection.arabicName : row.collection.name}</Text><Text style={s.meta}>{row.read} / {row.total.toLocaleString()}</Text></View>
      <View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${row.percent}%`}]}/></View>
    </View>)}</View>
  </View>;
}

function HadithScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const state=useHadithState();
  const [query,setQuery]=useState('');
  const loaded=getLoadedCollections();
  const results=query.trim().length>=3?searchLoadedCollections(query,60):[];
  const open=(slug:string,number?:number)=>navigation.navigate(number?'Hadith Detail':'Hadith Collection',number?{slug,number}:{slug});
  return <Page><ToolBar title={T('Hadith')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Hadith" size={72}/>
    <Text style={s.dataTitle}>{T('Hadith')}</Text>
    
    <Text style={s.intro}>{T('Ten verified collections with matched Arabic and English texts. Grading is shown where the source publishes it—Sahih al-Bukhari and Sahih Muslim carry no separate grade because the collection itself is the grading.')}</Text>

    <View style={s.search}>{ico('search',18,C.muted)}<TextInput accessibilityLabel={T('Search hadith in opened collections')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search opened collections')} placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel={T('Clear hadith search')} onPress={()=>setQuery('')}>{ico('close',16,C.muted)}</Pressable>}</View>

    {query.trim().length>=3?(results.length?<>
      <Text style={s.meta}>{rtl?`${results.length} ${arNoun(results.length, 'نتيجة', 'نتيجتان', 'نتائج', 'نتيجة')} في ${loaded.length} ${arNoun(loaded.length, 'مجموعة مفتوحة', 'مجموعتين مفتوحتين', 'مجموعات مفتوحة', 'مجموعة مفتوحة')}`:`${results.length} match${results.length===1?'':'es'} in ${loaded.length} opened collection${loaded.length===1?'':'s'}`}</Text>
      {results.map(hadith=>{const collection=HADITH_COLLECTIONS.find(item=>item.slug===hadith.slug);return <Pressable key={hadith.id} onPress={()=>open(hadith.slug,hadith.number)} style={s.dataCard}>
        <Text style={s.dataMeta}>{rtl ? collection?.arabicName || collection?.name : collection?.name} · {T('Hadith')} {hadith.number}</Text>
        <Text style={s.dataBody} numberOfLines={3}>{hadith.english||hadith.arabic}</Text>
      </Pressable>})}
    </>:<View style={s.empty}><Text style={s.dataBody}>{loaded.length?'No match in the collections you have opened yet.':'Open a collection once to search inside it.'}</Text></View>):<>
      {state.recent.length>0&&<>
        <Section title={T('Continue reading')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingRight:20}}>
          {state.recent.slice(0,8).map(item=>{const collection=HADITH_COLLECTIONS.find(entry=>entry.slug===item.slug);return <Pressable key={`${item.slug}-${item.number}`} onPress={()=>open(item.slug,item.number)} style={s.recentChipWide}>
            <Text style={s.dataMeta}>{rtl ? collection?.arabicName || collection?.name : collection?.name}</Text>
            <Text style={s.recentChipTitle}>{T('Hadith')} {item.number}</Text>
          </Pressable>})}
        </ScrollView>
      </>}
      {state.saved.length>0&&<>
        <Section title={T('Saved hadith')} action={T('See all')} onPress={()=>navigation.navigate('Hadith Saved')}/>
        {state.saved.slice(0,3).map(item=><Pressable key={item.id} onPress={()=>open(item.slug,item.number)} style={s.dataCard}>
          <Text style={s.dataMeta}>{item.collection} · {T('Hadith')} {item.number}</Text>
          <Text style={s.dataBody} numberOfLines={2}>{item.preview}</Text>
        </Pressable>)}
      </>}
      <HadithProgressBars/>
      <Section title={T('Collections')}/>
      {HADITH_COLLECTIONS.map(collection=>{
        const total=state.totals[collection.slug]||0;
        const read=(state.read[collection.slug]||[]).length;
        const percent=total?Math.min(100,Math.round(read/total*100)):0;
        return <Pressable key={collection.slug} accessibilityLabel={`${T('Open')} ${collection.name}`} onPress={()=>open(collection.slug)} style={s.hadithCollectionCard}>
          <View style={s.hadithCollectionTop}>
            <View style={{flex:1}}>
              <Text style={s.dataName}>{collection.name}</Text>
              <Text style={s.dataArabic}>{collection.arabicName}</Text>
              <Text style={s.meta}>{T(collection.author)} · {T(collection.kind)}{collection.graded ? (rtl ? ' · مصنّف' : ' · graded') : ''}{total ? ` · ${total.toLocaleString()} ${T('hadith')}` : ''}</Text>
            </View>
            {ico('chevron-forward',18,C.muted)}
          </View>
          {percent>0&&<View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${percent}%`}]}/></View>}
        </Pressable>;
      })}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Arabic and English together')}</Text><Text style={s.apiText}>{T('Each collection carries Arabic and English editions, so every hadith you read is shown in both. Nothing is paraphrased.')}</Text></View>
    </>}
  </ScrollView></Page>}

function HadithCollectionScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const slug=route.params?.slug||'bukhari';
  const collection=HADITH_COLLECTIONS.find(item=>item.slug===slug);
  const [data,setData]=useState<HadithCollectionData|null>(null);
  const [error,setError]=useState('');
  const [book,setBook]=useState<number|null>(null);
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(20);
  const load=()=>{setError('');return loadHadithCollection(slug).then(next=>{setData(next);void whenArabicReady(slug).then(ready=>ready&&setData(ready))}).catch((e:any)=>setError(T(e.message||'Please check your connection.')))};
  useEffect(()=>{void load()},[slug]);
  useEffect(()=>{setLimit(20)},[book,query]);
  const page=data?getHadithPage(data,{book,query,offset:0,limit}):{rows:[],total:0,offset:0,hasMore:false};
  const read=new Set(useHadithState().read[slug]||[]);
  return <Page><ToolBar title={rtl ? (collection?.arabicName || T('Hadith')) : (collection?.name || 'Hadith')} navigation={navigation}/>
    {!data&&!error&&<Spinner/>}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!data&&<>
      <View style={s.search}>{ico('search',18,C.muted)}<TextInput accessibilityLabel={T('Search this collection')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search Arabic, English or number')} placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel={T('Clear search')} onPress={()=>setQuery('')}>{ico('close',16,C.muted)}</Pressable>}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
        <ChoicePill label={T('All books')} selected={book===null} onPress={()=>setBook(null)}/>
        {data.books.map(entry=><ChoicePill key={entry.number} label={`${entry.number}. ${entry.name}`} selected={book===entry.number} onPress={()=>setBook(entry.number)}/>)}
      </ScrollView>
      <Text style={s.meta}>{rtl?`${page.total.toLocaleString()} ${arNoun(Number(page.total), 'حديث', 'حديثان', 'أحاديث', 'حديثًا')}${book!==null?' في هذا الكتاب':''} · يُعرض ${page.rows.length}${data.arabicReady?'':' · جارٍ تحميل النص العربي'}`:`${page.total.toLocaleString()} hadith${book!==null?' in this book':''} · showing ${page.rows.length}${data.arabicReady?'':' · Arabic text loading'}`}</Text>
      <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        {page.rows.map(hadith=><Pressable key={hadith.id} accessibilityLabel={`${T('Hadith')} ${hadith.number}`} onPress={()=>navigation.navigate('Hadith Detail',{slug,number:hadith.number})} style={s.dataCard}>
          <View style={s.hadithRowTop}>
            <View style={s.hadithNumber}><Text style={s.hadithNumberText}>{hadith.number}</Text></View>
            <View style={{flex:1}}>
              <Text style={s.dataMeta}>{hadith.book?(rtl?`الكتاب ${hadith.book} · ${hadith.bookName}`:`Book ${hadith.book} · ${hadith.bookName}`):hadith.bookName}{hadith.grades.length?` · ${hadith.grades[0].grade}`:''}{read.has(hadith.number)?(rtl?' · مقروء':' · read'):''}</Text>
              {!!hadith.arabic&&<Text style={s.dataArabic} numberOfLines={2}>{hadith.arabic}</Text>}
              <Text style={s.dataBody} numberOfLines={3}>{hadith.english}</Text>
            </View>
            {ico('chevron-forward',16,C.muted)}
          </View>
        </Pressable>)}
        {!page.rows.length&&<View style={s.empty}><Text style={s.dataBody}>{T('No hadith matches this filter.')}</Text></View>}
        {page.hasMore&&<Pressable accessibilityLabel={T('Load more hadith')} onPress={()=>setLimit(value=>value+20)} style={s.secondary}><Text style={s.secondaryText}>{T('Load more')}</Text></Pressable>}
        <View style={s.apiPanel}><Text style={s.apiTitle}>{data.name}</Text><Text style={s.apiText}>{rtl?`${data.books.length} ${arNoun(data.books.length, 'كتاب', 'كتابان', 'كتب', 'كتابًا')} · ${data.hadiths.length.toLocaleString()} ${arNoun(data.hadiths.length, 'حديث', 'حديثان', 'أحاديث', 'حديثًا')}`:`${data.books.length} books · ${data.hadiths.length.toLocaleString()} hadith`}</Text></View>
      </ScrollView>
    </>}
  </Page>}

function HadithDetailScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const slug=route.params?.slug||'bukhari';
  const number=Number(route.params?.number||1);
  const collection=HADITH_COLLECTIONS.find(item=>item.slug===slug);
  const [data,setData]=useState<HadithCollectionData|null>(null);
  const [hadith,setHadith]=useState<Hadith|null>(null);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [reporting,setReporting]=useState(false);
  const state=useHadithState();
  const saved=isHadithSaved(slug,number);
  const total=data?.hadiths.length||0;
  const load=async()=>{
    setError('');
    try{
      const loaded=await loadHadithCollection(slug);
      setData(loaded);
      const apply=(source:HadithCollectionData)=>{const found=getHadith(source,number);if(found)setHadith(found)};
      apply(loaded);
      if(!loaded.arabicReady){const ready=await whenArabicReady(slug);if(ready){setData(ready);apply(ready)}}
      else setError('This hadith is not in the loaded edition.');
    }catch(e:any){setError(T(e.message||'Please check your connection.'))}
  };
  useEffect(()=>{void load()},[slug,number]);
  useEffect(()=>{if(data)void markHadithRead(slug,number,data.hadiths.length)},[data,slug,number]);
  const neighbours=data?getNeighbours(data,number):{previous:undefined,next:undefined};
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
        rtl={rtl} T={T} appLanguage={rtl?'ar':'en'} onClose={()=>setReporting(false)}/>
    : null);
  return <Page><ToolBar title={rtl ? (collection?.arabicName || T('Hadith')) : (collection?.name || 'Hadith')} navigation={navigation}/>
    {!hadith&&!error&&<Spinner/>}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!hadith&&<ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      {/* The chapter this hadith belongs to, above the text rather than lost in
          a subtitle, so you always know where in the collection you are. */}
      <View style={s.hadithBreadcrumb}>
        <Text style={s.hadithCrumbMain}>{collection?.name}</Text>
        <Text style={s.hadithCrumbSub}>
          {hadith.book?(rtl?`الكتاب ${hadith.book} · ${hadith.bookName}`:`Book ${hadith.book} · ${hadith.bookName}`):T('General')}
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
        <Pressable accessibilityLabel={saved?'Remove hadith from saved':'Save this hadith'} onPress={()=>{if(collection)void toggleHadithSaved(collection,hadith)}} style={s.secondary}><Text style={s.secondaryText}>{saved?T('Saved'):T('Save')}</Text></Pressable>
        <Pressable accessibilityLabel={T('Copy hadith text')} onPress={copy} style={s.secondary}><Text style={s.secondaryText}>{copied?T('Copied'):T('Copy')}</Text></Pressable>
        <Pressable accessibilityLabel={T('Share hadith')} onPress={share} style={s.secondary}><Text style={s.secondaryText}>{T('Share')}</Text></Pressable>
        <Pressable accessibilityLabel={T('Report a correction')} onPress={()=>setReporting(true)} style={s.secondary}>{ico('flag-outline',15,C.green)}<Text style={s.secondaryText}>{T('Report')}</Text></Pressable>
      </View>
      <View style={s.hadithNav}>
        {neighbours.previous?<Pressable accessibilityLabel={T('Previous hadith')} onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.previous?.number})} style={s.hadithNavBtn}><Text style={s.hadithNavText}>← {neighbours.previous.number}</Text></Pressable>:<View style={s.hadithNavBtn}/>}
        {neighbours.next?<Pressable accessibilityLabel={T('Next hadith')} onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.next?.number})} style={[s.hadithNavBtn,{alignItems:'flex-end'}]}><Text style={s.hadithNavText}>{neighbours.next.number} →</Text></Pressable>:<View style={s.hadithNavBtn}/>}
      </View>
      <View style={s.apiPanel}><Text style={s.apiTitle}>{T('Source')}</Text><Text style={s.apiText}>{hadithReference(collection,hadith)}</Text></View>
    </ScrollView>}
  </Page>}

function HadithSavedScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const state=useHadithState();
  return <Page><ToolBar title={T('Saved hadith')} navigation={navigation}/>
    {!state.saved.length&&<View style={s.empty}><ToolGraphic tool="Hadith" size={54}/><Text style={s.dataTitle}>{T('Nothing saved yet')}</Text><Text style={s.dataBody}>{T('Save a hadith from any collection and it will appear here on this device only.')}</Text></View>}
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
function ChoicePill({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}){
  const press=usePressDepth();
  return <Animated.View style={{transform:[{scale:press.scale}]}}>
    <Pressable accessibilityRole="radio" accessibilityState={{selected}} onPress={onPress}
      onPressIn={press.onPressIn} onPressOut={press.onPressOut}
      style={[s.choicePill,selected&&s.choicePillActive]}>
      <Text style={[s.choiceText,selected&&s.choiceTextActive]}>{label}</Text>
    </Pressable>
  </Animated.View>;
}
const DATA_SOURCES: { name: string; ar: string; endpoint: string; detail: string; arDetail: string }[] = [
  { name: 'Al Quran Cloud', ar: 'القرآن السحابي', endpoint: 'api.alquran.cloud',
    detail: 'Arabic script editions — Uthmani, Imla’i simple, IndoPak and Tajweed — translations in many languages, Surah and Juz structure, and verse-by-verse audio editions.',
    arDetail: 'نصوص القرآن بعدة روايات وترجمات بلغات متعددة، مع ترتيب السور والأجزاء وملفات الصوت لكل آية.' },
  { name: 'Islamic.app', ar: 'تطبيق إسلاميك', endpoint: 'api.islamic.app',
    detail: 'The Beautiful Names with their meanings, the adhkar and duas of Hisn al-Muslim, and the hadith collections with Arabic and English editions.',
    arDetail: 'الأسماء الحسنى ومعانيها، وأذكار ودعوات حصن المسلم، ومجموعات الحديث بنصّها العربي وترجمتها الإنجليزية.' },
  { name: 'On your device', ar: 'على جهازك', endpoint: 'no network request',
    detail: 'Prayer times, the Hijri date and the Ramadan timetable are calculated on your device from your coordinates — the sun does not need the internet, and nothing about where you are is sent anywhere.',
    arDetail: 'تُحسب مواقيت الصلاة والتاريخ الهجري وجدول رمضان على جهازك من إحداثياتك، فالشمس لا تحتاج إلى إنترنت، ولا يُرسل أي شيء عن موقعك إلى أي جهة.' },
  { name: 'Gold and silver prices', ar: 'أسعار الذهب والفضة', endpoint: 'api.gold-api.com', detail: 'Spot gold and silver prices per troy ounce, converted to a price per gram for the nisab threshold.', arDetail: 'أسعار الذهب والفضة الفورية للأوقية، وتحوّل إلى سعر الغرام لحساب النصاب.' }, { name: 'Exchange rates', ar: 'أسعار الصرف', endpoint: 'open.er-api.com', detail: 'Daily reference exchange rates, used to show Zakat figures in the currency you choose.', arDetail: 'أسعار صرف مرجعية يومية، تُستخدم لعرض أرقام الزكاة بالعملة التي تختارها.' }, { name: 'MP3Quran', ar: 'إم بي 3 قرآن', endpoint: 'mp3quran.net',
    detail: 'Complete Surah recitations from published reciters, used when you play a whole Surah rather than verse by verse.',
    arDetail: 'تلاوات كاملة للسور من القرّاء المنشورين، وتُستخدم عند تشغيل السورة كاملة.' },
];

function DataSourcesScreen({ navigation }: any) {
  const { rtl } = useLanguage();
  return <Page><ToolBar title={rtl ? 'مصادر البيانات' : 'Data sources'} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran" size={72} />
      <Text style={s.dataTitle}>{rtl ? 'مصادر البيانات' : 'Data sources'}</Text>
      <Text style={s.dataBody}>{rtl ? 'كل ما يفتحه التطبيق يُجلب من هذه المصادر العامة المفتوحة، ولا يحتاج أي حساب أو مفتاح.' : 'Everything the app opens is fetched from these public, keyless sources. No account, and no key, is needed for any of them.'}</Text>
      {DATA_SOURCES.map((source) => <View key={source.name} style={s.apiPanel}>
        <Text style={s.apiTitle}>{rtl ? source.ar : source.name}</Text>
        <Text style={s.meta}>{source.endpoint}</Text>
        <Text style={s.apiText}>{rtl ? source.arDetail : source.detail}</Text>
      </View>)}
      <View style={s.apiPanel}><Text style={s.apiTitle}>{rtl ? 'محفوظ على جهازك' : 'Kept on this device'}</Text>
        <Text style={s.apiText}>{rtl ? 'ما تفتحه يُخزَّن على الجهاز ليُقرأ بلا اتصال، ولا يُرفع شيء منه.' : 'What you open is stored on this device so it can be read again without a connection. Nothing you record is uploaded anywhere.'}</Text>
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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <ToolBar title={rtl ? 'بلاغاتي' : 'My reports'} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <ToolGraphic tool="Corrections" size={76} />
      <Text style={s.dataTitle}>{rtl ? 'بلاغاتي' : 'My reports'}</Text>
      <Text style={s.intro}>
        {rtl
          ? 'كل تصحيح أرسلته، محفوظ هنا على جهازك. يمكنك إعادة إرساله أو نسخه أو حذفه.'
          : 'Every correction you have sent, kept here on your device. Resend it, copy it, or remove it.'}
      </Text>

      {reports.length === 0 ? <Text style={s.sourceBody}>
        {rtl ? 'لم تُرسل أي تصحيح بعد.' : 'You have not reported anything yet.'}
      </Text> : reports.map(report => <View key={report.id} style={s.reportCard}>
        <Text style={s.reportRef}>{report.reference}</Text>
        <Text style={s.reportFlag}>{issueLabel(report.issue)}</Text>
        {!!report.note && <Text style={s.reportBodyText}>{report.note}</Text>}
        {!!report.edition && <Text style={s.reportMeta}>{report.edition}</Text>}
        <Text style={s.reportMeta}>
          {report.sent ? (rtl ? 'أُرسل' : 'Sent') : (rtl ? 'لم يُرسل بعد' : 'Not sent yet')}
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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
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
      ? T(`Encrypted ${made.keys} records. Keep the file somewhere you will find it again.`)
      : T(`Encrypted ${made.keys} records, but this device would not open a share sheet. The file is in the app's cache.`));
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
    <ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled">
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
        {T(`Last backup ${new Date(backup.lastBackupAt).toLocaleDateString()}`)}</Text> : null}

      {!!notice && <View style={[s.backupNotice, s.backupNoticeGood]}><Text style={s.backupNoticeGoodText}>{notice}</Text></View>}
      {!!done && <View style={[s.backupNotice, s.backupNoticeGood]}>
        <Text style={s.backupNoticeGoodText}>
          {T(`Restored ${done.keys} records, from ${new Date(done.exportedAt).toLocaleDateString()}.`)}
        </Text>
      </View>}
      {!!error && <View style={s.backupNotice}><Text style={s.backupNoticeText}>{error}</Text></View>}
      {busy && <View style={s.backupBusy}><ActivityIndicator color={C.green} /><Text style={s.meta}>{busy}</Text></View>}

      {!backup.passwordSet && <View style={s.formCard}>
        <Text style={s.inputLabel}>{T('CHOOSE A PASSWORD')}</Text>
        {secretField(password, setPassword, 'At least 8 characters')}
        {secretField(confirm, setConfirm, 'The same password again')}
        <Pressable onPress={() => { void onSetPassword(); }} style={s.primary}><Text style={s.primaryText}>{T('Set password')}</Text></Pressable>
      </View>}

      {backup.passwordSet && !unlocked && <View style={s.formCard}>
        <Text style={s.inputLabel}>{T('YOUR PASSWORD')}</Text>
        {secretField(password, setPassword, 'Password')}
        <Pressable onPress={() => { void onUnlock(); }} style={s.primary}><Text style={s.primaryText}>{T('Unlock')}</Text></Pressable>
      </View>}

      {backup.passwordSet && unlocked && <>
        <Section title={T('Make a backup')} />
        <Pressable onPress={() => { void onCreate(); }} style={s.practiceLaunch}>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{T('Create and share a backup')}</Text>
            <Text style={s.meta}>{T('Sealed here before it leaves the device, then handed to whatever you save it with.')}</Text>
          </View>
          {ico('cloud-upload-outline', 28, C.green)}
        </Pressable>

        <Section title={T('Restore')} />
        {!pending && <>
          <Pressable onPress={() => { void onPick(); }} style={s.practiceLaunch}>
            <View style={{ flex: 1 }}>
              <Text style={s.settingName}>{T('Choose a backup file')}</Text>
              <Text style={s.meta}>{T('Everything on this device is replaced by what is in the file.')}</Text>
            </View>
            {ico('cloud-download-outline', 28, C.green)}
          </Pressable>
          <Pressable onPress={() => setPasteOpen((open) => !open)} style={s.backupLink}>
            <Text style={s.backupLinkText}>{T('Or paste one instead')}</Text>
          </Pressable>
          {pasteOpen && <>
            <TextInput value={pasted} onChangeText={setPasted} multiline
              placeholder={T('Paste the whole backup file here')} placeholderTextColor={C.muted}
              style={s.backupPaste} accessibilityLabel={T('Backup contents')} />
            <Pressable onPress={() => accept(pasted)} style={s.secondary}><Text style={s.secondaryText}>{T('Use this backup')}</Text></Pressable>
          </>}
        </>}

        {pending && <View style={s.formCard}>
          <Text style={s.inputLabel}>{T('OPENING THIS BACKUP')}</Text>
          <Text style={s.meta}>{T(`Made ${new Date(pending.summary.exportedAt).toLocaleDateString()}`)}</Text>
          {secretField(restorePassword, setRestorePassword, 'The password for this backup')}
          <View style={s.backupActions}>
            <Pressable onPress={() => { void onRestore(); }} style={s.primary}><Text style={s.primaryText}>{T('Restore and replace')}</Text></Pressable>
            <Pressable onPress={() => { setPending(null); setRestorePassword(''); }} style={s.secondary}><Text style={s.secondaryText}>{T('Cancel')}</Text></Pressable>
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
          <Pressable onPress={() => { void onChangePassword(); }} style={s.secondary}><Text style={s.secondaryText}>{T('Change password')}</Text></Pressable>
          <Pressable onPress={() => { void onRemove(); }} style={s.dangerButton}><Text style={s.dangerText}>{T('Remove the password')}</Text></Pressable>
          <Pressable onPress={() => lockBackup()} style={s.secondary}><Text style={s.secondaryText}>{T('Lock now')}</Text></Pressable>
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

function SettingsStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Settings" component={SettingsScreen}/><Stack.Screen name="Data sources" component={DataSourcesScreen}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}
      options={{presentation:'transparentModal',animation:'slide_from_bottom',contentStyle:{backgroundColor:'transparent'}}}/><Stack.Screen name="Privacy Lock" component={PrivacyLockScreen}/><Stack.Screen name="My Reports" component={ReportsScreen}/><Stack.Screen name="Backup" component={BackupScreen}/></Stack.Navigator>}

/**
 * The header of a settings card: a tile, a name, and what the choice does.
 *
 * Settings is a list of cards that do not otherwise resemble each other -
 * one holds pills, one holds switches, one is a single link. Giving them all
 * the same head is what makes the screen read as one page rather than five.
 */
function PanelHead({ tool, glyph, title, note }: { tool?: string; glyph?: string; title: string; note: string }) {
  return <View style={s.preferenceHead}>
    {tool
      ? <ToolGraphic tool={tool} size={54} />
      : <View style={s.prefIconTile}>{glyph ? <MotionGlyph name={glyph} size={22} /> : null}</View>}
    <View style={{ flex: 1 }}>
      <Text style={s.settingName}>{title}</Text>
      <Text style={s.meta}>{note}</Text>
    </View>
  </View>;
}

function SettingsScreen({navigation}:any){
  const { language, rtl, setLanguage } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const { mode: themeMode, setMode } = useTheme();
  const { settings, update } = useWorshipSettings();
  const { preferences } = useQuranPreferences();
  const womens = useWomens();
  const lock = useLockConfig();
  /* Shown under "Quran reading" so the row describes what is actually in
     force rather than a guess that drifts out of step with the reader. */
  const scriptLabel = preferences.scriptName || T('Uthmani');
  const translationLabel = preferences.translationName || T('Sahih International');
  return <Page>
    <ScrollView contentContainerStyle={s.scroll}>
      <View style={s.backRow}><IconButton name={rtl ? 'arrow-forward' : 'arrow-back'} onPress={() => navigation.goBack()} /></View>
      <TopBar overline={rtl ? 'خصوصية بلا حساب' : 'PRIVATE BY DESIGN'} title={rtl ? 'الإعدادات' : 'Settings'} right={<MotionGlyph name="shield-checkmark-outline" size={20} />} />
      <LinearGradient colors={[C.heroA, C.green]} style={s.privacyHero}>
        <MotionGlyph name="shield-checkmark-outline" size={25} inverse />
        <View style={{ flex: 1 }}>
          <Text style={s.profileName}>{rtl ? 'لا حساب. لا تتبع.' : 'No account. No tracking.'}</Text>
          <Text style={s.profileSub}>{rtl ? 'تبقى عبادتك خاصة وتظل تفضيلاتك على هذا الجهاز.' : 'Your worship stays private and your preferences remain on this device.'}</Text>
        </View>
      </LinearGradient>
      <View style={s.privacyPoints}>
        <View style={s.privacyPoint}>{ico('person-remove-outline', 19, C.green)}<Text style={s.privacyPointText}>{rtl ? 'دون تسجيل' : 'No sign-up'}</Text></View>
        <View style={s.privacyPoint}>{ico('cloud-offline-outline', 19, C.green)}<Text style={s.privacyPointText}>{rtl ? 'دون ملف سحابي' : 'No cloud profile'}</Text></View>
        <View style={s.privacyPoint}>{ico('analytics-outline', 19, C.green)}<Text style={s.privacyPointText}>{rtl ? 'دون تتبع إعلاني' : 'No ad tracking'}</Text></View>
      </View>

      <Section title={rtl ? 'أوقات الصلاة' : 'Prayer times'} />
      <View style={s.preferencePanel}>
        <PanelHead tool="Prayer" title={rtl ? 'طريقة الحساب' : 'Calculation method'} note={rtl ? 'تُحفظ على هذا الجهاز وتُطبق على جميع مواقيت الصلاة.' : 'Saved on this device and applied to every prayer time.'} />
        <View style={s.choiceGrid}>{PRAYER_METHODS.map(method => <ChoicePill key={method.id} label={rtl ? method.ar : method.name} selected={settings.calculationMethod === method.id} onPress={() => update({ calculationMethod: method.id, calculationMethodName: method.name })} />)}</View>
        <Text style={s.preferenceLabel}>{rtl ? 'المذهب لحساب العصر' : 'ASR MADHAB'}</Text>
        <View style={s.choiceRow}>
          <ChoicePill label={rtl ? 'الشافعي' : 'Shafi'} selected={settings.madhab === 'shafi'} onPress={() => update({ madhab: 'shafi' })} />
          <ChoicePill label={rtl ? 'الحنفي' : 'Hanafi'} selected={settings.madhab === 'hanafi'} onPress={() => update({ madhab: 'hanafi' })} />
        </View>
        <Text style={s.preferenceLabel}>{rtl ? 'تنسيق الوقت' : 'TIME FORMAT'}</Text>
        <View style={s.choiceRow}>
          <ChoicePill label={rtl ? '12 ساعة' : '12 hour'} selected={settings.timeFormat === '12'} onPress={() => update({ timeFormat: '12' })} />
          <ChoicePill label={rtl ? '24 ساعة' : '24 hour'} selected={settings.timeFormat === '24'} onPress={() => update({ timeFormat: '24' })} />
        </View>
      </View>

      <Section title={T('Appearance')} />
      <View style={s.preferencePanel}>
        <PanelHead glyph={themeMode === 'dark' ? 'moon-outline' : themeMode === 'light' ? 'sunny-outline' : 'contrast-outline'} title={T('Appearance')} note={T('Light, dark, or whatever the device is set to')} />
        <View style={s.choiceRow}>
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

      <Section title={rtl ? 'التفضيلات' : 'Preferences'} />
      <View style={s.settings}>
        <View style={s.setting}>
          <View style={s.prefIconTile}><MotionGlyph name="language-outline" size={22} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.settingName}>{rtl ? 'واجهة عربية' : 'Arabic interface'}</Text>
            <Text style={s.meta}>{rtl ? 'تخطيط من اليمين إلى اليسار' : 'Right-to-left layout throughout the app'}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch accessibilityLabel={T('Arabic interface')} value={language === 'ar'} onValueChange={v => setLanguage(v ? 'ar' : 'en')} trackColor={{ true: C.green }} />
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={T('Quran reading')}
          onPress={() => navigation.navigate('Reader Settings')} style={s.setting}>
          <ToolGraphic tool="Arabic Quran" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'قراءة القرآن' : 'Quran reading'}</Text>
            <Text style={s.meta}>{scriptLabel} · {translationLabel}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={rtl ? 'بلاغاتي' : 'My reports'}
          onPress={() => navigation.navigate('My Reports')} style={s.setting}>
          <ToolGraphic tool="Corrections" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'بلاغاتي' : 'My reports'}</Text>
            <Text style={s.meta}>{rtl ? 'التصحيحات التي أرسلتها، محفوظة على جهازك' : 'Corrections you have sent, kept on your device'}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Pressable>
        <View style={s.setting}>
          <ToolGraphic tool="Women’s worship" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'عبادة النساء' : 'Women’s worship'}</Text>
            <Text style={s.meta}>{rtl ? (womens.optedIn ? 'الدورة والطهارة والقضاء · على هذا الجهاز فقط' : 'مساحة خاصة للدورة والطهارة والقضاء') : (womens.optedIn ? 'Cycle, purity and Qada records · on this device only' : 'A private area for the cycle, purity and Qada records')}</Text>
          </View>
          <View style={{ direction: 'ltr' } as any}>
            <Switch accessibilityLabel={T('Women’s worship')} value={womens.optedIn} onValueChange={(value) => void setOptedIn(value)} trackColor={{ true: C.green }} />
          </View>
        </View>
        {womens.optedIn && <Pressable accessibilityRole="button" accessibilityLabel={T('Lock and PIN')} onPress={() => navigation.navigate('Privacy Lock')} style={s.setting}>
          <ToolGraphic tool="Privacy lock" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'القفل والرمز' : 'Lock and PIN'}</Text>
            <Text style={s.meta}>{rtl ? (lock.pinSet ? (lock.required ? 'مقفل' : 'الرمز محفوظ') : 'لا رمز بعد') : (lock.pinSet ? (lock.required ? 'Locked' : 'PIN saved, lock is off') : 'No PIN yet')}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Pressable>}
        <Pressable accessibilityRole="button" accessibilityLabel={T('Backup')} onPress={() => navigation.navigate('Backup')} style={s.setting}>
          <ToolGraphic tool="Backup" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'النسخة الاحتياطية' : 'Backup'}</Text>
            <Text style={s.meta}>{rtl ? 'نسخة مشفرة بكلمة سر تختارها' : 'An encrypted copy, sealed with a password you choose'}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </Pressable>
      </View>

      <Section title={rtl ? 'عن التطبيق' : 'About'} />
      <Pressable onPress={() => navigation.navigate('Data sources')} style={s.settings} accessibilityRole="button" accessibilityLabel={T('Data sources')}>
        <View style={s.setting}>
          <ToolGraphic tool="Quran" size={44} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.settingName}>{rtl ? 'مصادر البيانات' : 'Data sources'}</Text>
            <Text style={s.meta}>{rtl ? 'من أين يأتي نص القرآن والمواقيت والحديث والصوت' : 'Where the Quran text, prayer times, hadith and audio come from'}</Text>
          </View>
          {ico(rtl ? 'arrow-back' : 'arrow-forward', 17, C.chevron)}
        </View>
      </Pressable>
    </ScrollView>
  </Page>}
import { DEFAULT_RECITER, editionsForLanguage, LANGUAGES, Language, LanguageCode, languageByCode, isRtl, pickEdition } from './src/services/languages';

const navigationRef = createNavigationContainerRef<any>();
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
const AUDIO_RATES = [0.75, 1, 1.25, 1.5];

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
  const { rtl } = useLanguage();
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
  return <View accessibilityRole="adjustable" accessibilityLabel={tx(rtl,'Seek within the recitation')} onLayout={(event) => { width.current = event.nativeEvent.layout.width; }} {...responder.panHandlers} style={s.seekTrack}>
    <View style={[s.seekFill, { width: `${value * 100}%` }]} />
    <View style={[s.seekKnob, { left: `${value * 100}%` }]} />
  </View>;
}

function MiniPlayer() {
  const audio = useAudio();
  const { rtl } = useLanguage();
  if (!audio.track) return null;
  const bottom = MINI_PLAYER_BOTTOM;
  const open = () => { if (navigationRef.isReady()) (navigationRef as any).navigate('Quran', { screen: 'Audio Player' }); };
  return <View style={[s.miniPlayer, { bottom, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={tx(rtl,'Open the audio player')} onPress={open} style={s.miniBody}>
      <View style={s.miniArt}>{audio.buffering ? <ActivityIndicator color={C.green} /> : <ToolGraphic tool="Recitations" size={34} />}</View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={s.miniTitle}>{audio.track.title}</Text>
        <Text numberOfLines={1} style={s.miniMeta}>{audio.track.performer}{audio.buffering ? ' · buffering' : audio.playing ? ' · playing' : ''}</Text>
      </View>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={audio.playing ? 'Pause recitation' : 'Play recitation'} onPress={() => { void togglePlayback(); }} style={s.miniBtn}>{ico(audio.playing ? 'pause' : 'play', 19, C.white)}</Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={tx(rtl,'Close the player')} onPress={() => { void clearQueue(); }} style={s.miniGhost}>{ico('close', 17, C.muted)}</Pressable>
  </View>;
}

async function playFromReader(chapter: Chapter, verse: Verse, rtl = false) {
  try {
    const settings = getAudioSettings();
    const ayah = Number(String(verse.verse_key).split(':')[1] || 1);
    const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, settings);
    const index = queue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayah);
    await playQueue(queue, index < 0 ? 0 : index);
  } catch (e: any) { Alert.alert(tx(rtl,'Audio unavailable'),tx(rtl,e.message)); }
}

async function playSurahFromReader(chapter: Chapter, rtl = false) {
  try {
    const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, getAudioSettings());
    await playQueue(queue, 0);
  } catch (e: any) { Alert.alert(tx(rtl,'Audio unavailable'),tx(rtl,e.message)); }
}

function AudioCenterScreen({ navigation }: any) {
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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

  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title={T('Quran audio')} navigation={navigation} />
    
    <Text style={s.dataTitle}>{T('Listen by verse, Surah or playlist')}</Text>
    <Text style={s.intro}>{T('Recitation streams live from attributed public sources. Playback, recents and playlists stay on this device.')}</Text>

    {!!session && <Pressable onPress={() => { void resumeSession(); }} style={s.continueBar}>
      <ToolGraphic tool="Recitations" size={46} />
      <View style={{ flex: 1 }}><Text style={s.dailyKicker}>{T('CONTINUE LISTENING')}</Text><Text style={s.settingName}>{session.chapterName}</Text><Text style={s.meta}>{busy === 'resume' ? T('Preparing…') : (rtl?`طابور الآيات · حُفظ ${new Date(session.savedAt).toLocaleDateString()}`:`Verse queue · saved ${new Date(session.savedAt).toLocaleDateString()}`)}</Text></View>
      {ico('play-circle', 22, C.green)}
    </Pressable>}

    {!!audio.track && <Pressable onPress={() => navigation.navigate('Audio Player')} style={s.audioHero}>
      <View style={s.audioHeroRow}>
        <ToolGraphic tool="Recitations" size={54} />
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

    {loading ? <Spinner /> : !!error ? <ErrorState message={error} retry={load} /> : <>
      {tab === 'reciters' && <>
        <Section title={T('Recitation source')} />
        <View style={s.choiceRow}>
          <ChoicePill label={T('Verse by verse')} selected={settings.reciterMode === 'verse'} onPress={() => { void update({ reciterMode: 'verse' }); }} />
          <ChoicePill label={T('Full Surah')} selected={settings.reciterMode === 'surah'} onPress={() => { void update({ reciterMode: 'surah' }); }} />
        </View>
        <Text style={s.meta}>{T(settings.reciterMode === 'verse' ? 'Verse-by-verse files, one track per ayah, with translation audio and reader controls.' : 'Complete Surah recordings — one continuous track per Surah.')}</Text>
        <Section title={T(settings.reciterMode === 'verse' ? 'Arabic reciters' : 'Full-Surah reciters')} />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search reciters')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search a reciter')} placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel={T('Clear reciter search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{(settings.reciterMode === 'verse' ? reciters.map((edition) => <View key={edition.identifier} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.reciter === edition.identifier }} onPress={() => { void update({ reciter: edition.identifier, reciterName: edition.englishName }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{reciterLabel(edition.englishName, rtl)}</Text><Text style={s.meta}>{T('Verse by verse')} · {edition.identifier}</Text></View>
            {ico(settings.reciter === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.reciter === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play a sample from')} ${reciterLabel(edition.englishName, rtl)}`} onPress={() => { void sample(edition, 'arabic'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>) : surahReciters.filter((reciter) => reciter.name.toLowerCase().includes(needle)).map((reciter) => <View key={reciter.id} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.surahReciterId === reciter.id }} onPress={() => { void update({ surahReciterId: reciter.id, surahReciterName: reciter.name }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{reciter.name}</Text><Text style={s.meta}>{reciter.rewaya}{reciter.surahTotal ? (rtl ? ` · ${reciter.surahTotal} سورة` : ` · ${reciter.surahTotal} Surahs`) : ''}</Text></View>
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
            <ToolGraphic tool="Translations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{languageName(edition.language, rtl)}</Text><Text style={s.meta}>{edition.englishName}</Text></View>
            {ico(settings.translationEdition === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.translationEdition === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play a sample in')} ${(rtl ? AUDIO_LANGUAGES_AR : AUDIO_LANGUAGES)[edition.language] || edition.language}`} onPress={() => { void sample(edition, 'translation'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
        <View style={s.sourceCard}>{ico('information-circle', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Languages come from the source')}</Text><Text style={s.sourceBody}>{T('Only languages that are published are listed. Others are not shown rather than faked.')}</Text></View></View>
      </>}

      {tab === 'surah' && <>
        <Section title={T('Play a Surah')} />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel={T('Search Surahs')} value={query} onChangeText={setQuery} style={s.searchInput} placeholder={T('Search 114 Surahs')} placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel={T('Clear Surah search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{shownChapters.map((chapter) => <View key={chapter.id} style={s.audioRow}>
          <Pressable onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowMain}>
            <View style={s.surahNo}><Text style={s.surahNoText}>{chapter.id}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.settingName}>{chapter.name_simple}</Text><Text style={s.meta}>{rtl?`${chapter.verses_count} ${arNoun(chapter.verses_count, 'آية', 'آيتان', 'آيات', 'آية')} · ${chapter.translated_name?.name}`:`${chapter.verses_count} verses · ${chapter.translated_name?.name}`}</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`${T('Play')} ${chapter.name_simple}`} onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowAction}>{busy === `chapter-${chapter.id}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
      </>}

      {tab === 'saved' && <>
        <Section title={T('Recently played')} action={recent.length ? 'Clear' : undefined} onPress={recent.length ? () => { void clearRecentPlays().then(() => setRecent([])); } : undefined} />
        {!recent.length ? <Text style={s.meta}>{T('Nothing played yet.')}</Text> : recent.map((item, index) => <Pressable key={`${item.chapterId}-${item.edition}-${index}`} onPress={() => { const chapter = chapters.find((c) => c.id === item.chapterId); if (chapter) void startChapter(chapter, item.ayahNumber); }} style={s.queueRow}>
          <ToolGraphic tool="Recitations" size={38} />
          <View style={{ flex: 1 }}><Text style={s.settingName}>{rtl?`${item.chapterName} · آية ${item.ayahNumber}`:`${item.chapterName} · verse ${item.ayahNumber}`}</Text><Text style={s.meta}>{item.performer}</Text></View>
          {ico('play-circle', 20, C.green)}
        </Pressable>)}
        <Section title={T('Playlists')} />
        {!playlists.length ? <Text style={s.meta}>{T('Save the current queue to build a playlist.')}</Text> : playlists.map((playlist) => <View key={playlist.id} style={s.queueRow}>
          <Pressable onPress={() => { void playQueue(playlist.tracks, 0); }} style={s.audioRowMain}>
            <ToolGraphic tool="Audio" size={38} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{playlist.name}</Text><Text style={s.meta}>{rtl?`${playlist.tracks.length} ${arNoun(playlist.tracks.length, 'مقطع', 'مقطعان', 'مقاطع', 'مقطعًا')} · محفوظ على الجهاز`:`${playlist.tracks.length} tracks · saved locally`}</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`${T('Delete')} ${playlist.name}`} onPress={() => { void deletePlaylist(playlist.id).then(setPlaylists); }} style={s.audioRowAction}>{ico('trash', 19, C.coral)}</Pressable>
        </View>)}
        {!!audio.queue.length && <View style={s.formCard}>
          <Text style={s.preferenceLabel}>{T('SAVE CURRENT QUEUE')}</Text>
          <View style={s.fieldRow}>
            <TextInput accessibilityLabel={T('Playlist name')} value={playlistName} onChangeText={setPlaylistName} placeholder={audio.track ? audio.track.chapterName : 'Playlist name'} placeholderTextColor="#929B96" style={[s.textField, { flex: 1, marginTop: 0 }]} />
            <Pressable onPress={() => { void saveCurrentQueue(); }} style={s.primarySmall}><Text style={s.primaryText}>{T('Save')}</Text></Pressable>
          </View>
        </View>}
      </>}
    </>}

    <View style={s.sourceCard}>{ico('server', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>{T('Sources')}</Text><Text style={s.sourceBody}>{T('Verse-by-verse: one track for each ayah. Full-Surah: a complete recitation of the Surah.')}</Text></View></View>
    {settings.reciterMode === 'verse' ? (!!selectedReciter && <Text style={s.meta}>{rtl?`القارئ المختار: ${reciterLabel(selectedReciter.englishName, rtl)}`:`Selected reciter: ${selectedReciter.englishName}`}</Text>) : <Text style={s.meta}>{rtl?`قارئ السورة كاملة: ${reciterLabel(settings.surahReciterName || T('Choose from the list above'), rtl)} · ${surahReciters.length} متاح`:`Selected full-Surah reciter: ${settings.surahReciterName || T('Choose from the list above')} · ${surahReciters.length} available`}</Text>}
  </ScrollView></Page>;
}

function AudioPlayerScreen({ navigation }: any) {
  const audio = useAudio();
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
    <ToolGraphic tool="Recitations" size={78} />
    <Text style={s.dataTitle}>{T('Nothing is playing')}</Text>
    <Text style={s.intro}>{T('Choose a reciter and a Surah from the audio center to start listening.')}</Text>
    <Pressable onPress={() => navigation.goBack()} style={s.primary}><Text style={s.primaryText}>{T('Open audio center')}</Text></Pressable>
  </View></Page>;

  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title={T('Now playing')} navigation={navigation} />

    <LinearGradient colors={[C.heroA, C.green]} style={s.playerHero}>
      <PlayerAura />
      <View style={s.playerArtRing}><ToolGraphic tool="Recitations" size={98} /></View>
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
        {ico('arrow-forward', 18, C.green)}
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
      <Pressable accessibilityLabel={T('Stop playback')} onPress={() => { void stopPlayback(); }} style={s.secondary}>{ico('stop', 17, C.green)}<Text style={s.secondaryText}>{T('Stop')}</Text></Pressable>
      <Pressable accessibilityLabel={T('Clear the queue')} onPress={() => { void clearQueue(); }} style={s.secondary}>{ico('trash', 17, C.green)}<Text style={s.secondaryText}>{T('Clear queue')}</Text></Pressable>
    </View>

    <Text style={s.preferenceLabel}>{T('SPEED')}</Text>
    <View style={s.rateRow}>
      <Pressable accessibilityLabel={T('Slower')} onPress={() => { void stepPlaybackRate(false); }} style={s.stepButton}>{ico('remove', 19, C.green)}</Pressable>
      <Text style={s.rateValue}>{audio.rate.toFixed(2).replace(/0$/, '').replace(/\.$/, '')}×</Text>
      <Pressable accessibilityLabel={T('Faster')} onPress={() => { void stepPlaybackRate(true); }} style={s.stepButton}>{ico('add', 19, C.green)}</Pressable>
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
            <Pressable accessibilityLabel={T('Earlier start')} onPress={() => { const a = Math.max(1, settings.repeatRangeStart - 1); setSettingsState({ ...settings, repeatRangeStart: a }); void setRepeatRange(a, settings.repeatRangeEnd); }} style={s.stepButtonSmall}>{ico('remove', 15, C.green)}</Pressable>
            <Text style={s.rangeNumber}>{settings.repeatRangeStart}</Text>
            <Pressable accessibilityLabel={T('Later start')} onPress={() => { const a = Math.min(settings.repeatRangeEnd, settings.repeatRangeStart + 1); setSettingsState({ ...settings, repeatRangeStart: a }); void setRepeatRange(a, settings.repeatRangeEnd); }} style={s.stepButtonSmall}>{ico('add', 15, C.green)}</Pressable>
          </View>
        </View>
        <View style={s.rangeEnd}><Text style={s.meta}>{T('To')}</Text>
          <View style={s.stepperSmall}>
            <Pressable accessibilityLabel={T('Earlier end')} onPress={() => { const b = Math.max(settings.repeatRangeStart, settings.repeatRangeEnd - 1); setSettingsState({ ...settings, repeatRangeEnd: b }); void setRepeatRange(settings.repeatRangeStart, b); }} style={s.stepButtonSmall}>{ico('remove', 15, C.green)}</Pressable>
            <Text style={s.rangeNumber}>{settings.repeatRangeEnd}</Text>
            <Pressable accessibilityLabel={T('Later end')} onPress={() => { const b = settings.repeatRangeEnd + 1; setSettingsState({ ...settings, repeatRangeEnd: b }); void setRepeatRange(settings.repeatRangeStart, b); }} style={s.stepButtonSmall}>{ico('add', 15, C.green)}</Pressable>
          </View>
        </View>
      </View>
      <Text style={s.meta}>{rtl
        ? `من الآية ${settings.repeatRangeStart} إلى الآية ${settings.repeatRangeEnd}`
        : `Verses ${settings.repeatRangeStart} to ${settings.repeatRangeEnd}, both included.`}</Text>
    </View>}

    <Section title={T('When the Surah ends')} />
    <View style={s.settings}>
      <Pressable accessibilityRole="switch" accessibilityState={{ checked: !!settings.autoNextSurah }}
        onPress={() => { setSettingsState({ ...settings, autoNextSurah: !settings.autoNextSurah }); void setAutoNextSurah(!settings.autoNextSurah); }} style={s.setting}>
        <MotionGlyph name="play-skip-forward" size={19} />
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Carry on to the next Surah')}</Text>
          <Text style={s.meta}>{T('Rather than stopping at the end. Stops at An-Nas.')}</Text>
        </View>
        {ico(settings.autoNextSurah ? 'toggle' : 'toggle-outline', 22, settings.autoNextSurah ? C.green : C.muted)}
      </Pressable>
      <Pressable accessibilityRole="switch" accessibilityState={{ checked: settings.resumeOnStart !== false }}
        onPress={() => { setSettingsState({ ...settings, resumeOnStart: settings.resumeOnStart === false }); void setResumeOnStart(settings.resumeOnStart === false); }} style={s.setting}>
        <MotionGlyph name="refresh-outline" size={19} />
        <View style={{ flex: 1 }}>
          <Text style={s.settingName}>{T('Pick up where I left off')}</Text>
          <Text style={s.meta}>{T('Restores the Surah and the exact moment when the app opens, paused and ready.')}</Text>
        </View>
        {ico(settings.resumeOnStart !== false ? 'toggle' : 'toggle-outline', 22, settings.resumeOnStart !== false ? C.green : C.muted)}
      </Pressable>
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
        <TextInput accessibilityLabel={T('Playlist name')} value={name} onChangeText={setName} placeholder={track.chapterName} placeholderTextColor="#929B96" style={[s.textField, { flex: 1, marginTop: 0 }]} />
        <Pressable onPress={() => { void savePlaylist(name, audio.queue).then((next) => { setPlaylists(next); setName(''); }); }} style={s.primarySmall}><Text style={s.primaryText}>{T('Save')}</Text></Pressable>
      </View>
      {!!playlists.length && <Text style={s.meta}>{rtl?`${playlists.length} ${arNoun(playlists.length, 'قائمة', 'قائمتان', 'قوائم', 'قائمة')} محفوظة على هذا الجهاز.`:`${playlists.length} playlist${playlists.length > 1 ? 's' : ''} stored on this device.`}</Text>}
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

const TAB_ITEMS = [
  { name: 'Home', label: 'Home', ar: 'الرئيسية', icon: require('./assets/tool-icons/tab-home.png'), iconDark: require('./assets/tool-icons/tab-home-dark.png') },
  { name: 'Prayer', label: 'Prayer', ar: 'الصلاة', icon: require('./assets/tool-icons/salah-guide.png'), iconDark: require('./assets/tool-icons/salah-guide-dark.png') },
  { name: 'Quran', label: 'Quran', ar: 'القرآن', icon: require('./assets/tool-icons/quran.png'), iconDark: require('./assets/tool-icons/quran-dark.png') },
  { name: 'Library', label: 'Library', ar: 'المكتبة', icon: require('./assets/tool-icons/tab-library.png'), iconDark: require('./assets/tool-icons/tab-library-dark.png') },
  { name: 'Tools', label: 'Tools', ar: 'الأدوات', icon: require('./assets/tool-icons/tab-tools.png'), iconDark: require('./assets/tool-icons/tab-tools-dark.png') },
];

/** The menu floats above the content as a single capsule, always in reach. */
/**
 * One tab. A component of its own so each holds its own press value instead of
 * asking a hook to run inside a map.
 */
function TabButton({ route, focused, navigation, dark, rtl }: any) {
  const press = usePressDepth();
  const item = TAB_ITEMS.find((entry: any) => entry.name === route.name);
  const label = item ? (rtl ? item.ar : item.label) : route.name;
  return <Animated.View style={[s.floatItem, { transform: [{ scale: press.scale }] }]}>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={label}
      onPressIn={press.onPressIn} onPressOut={press.onPressOut}
      onPress={() => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
      }}>
      <Animated.View style={[s.floatPill, focused && s.floatPillActive]}>
        {item?.icon ? <Image source={dark ? item.iconDark || item.icon : item.icon} resizeMode="contain" style={{ width: 23, height: 23, opacity: focused ? 1 : 0.5 }} /> : ico('ellipse-outline', 20, focused ? C.green : C.chevron)}
        <Text numberOfLines={1} style={[s.floatLabel, focused && s.floatLabelActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  </Animated.View>;
}

function FloatingTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const { rtl } = useLanguage();
  const { dark } = useTheme();
  const hidden = useChromeHidden();
  const barWidth = Math.min(Math.max(width - 32, 300), 460);
  const drop = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(drop, { toValue: hidden ? 0 : 1, duration: 200, useNativeDriver: true }).start();
  }, [hidden, drop]);
  return <Animated.View pointerEvents="box-none" style={[s.floatBarWrap, {
    opacity: drop,
    transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [110, 0] }) }]
  }]}>
    <View style={[s.floatBar, { width: barWidth, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
      {state.routes.map((route: any, index: number) => (
        <TabButton key={route.key} route={route} focused={state.index === index}
          navigation={navigation} dark={dark} rtl={rtl} />
      ))}
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
function useBackIntegration(ref: any) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!ref.isReady() || !ref.canGoBack()) return false; /* nothing to pop: let it close */
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
      if (ref.isReady() && ref.canGoBack()) {
        ref.goBack();
        history.pushState({ deen: 'sentinel' }, ''); /* leave one behind for the next press */
      }
      /* At the root there is nothing to go back to, so the press is allowed
         to leave the app rather than being swallowed. */
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [ref]);
}

/*
 * reaches every screen; the navigation state is carried across that rebuild.
 */
function Root() {
  const { dark, tick } = useTheme();
  const [initial, setInitial] = useState<any>(undefined);
  const [ready, setReady] = useState(false);
  /* The palette is a module-level object, so a theme change remounts the
     navigator (via `key` below) to make every screen repaint. That remount
     re-runs `initialState`, which would otherwise restore the snapshot taken
     at app start and teleport the person back to it - wiping the stack they
     had built. Keeping the newest state in a ref means the remount restores
     exactly where they were, back stack and all. */
  const liveState = useRef<any>(undefined);
  useBackIntegration(navigationRef);
  useEffect(() => { void loadNavState().then((state) => { setInitial(state); setReady(true); }); }, []);
  if (!ready) return <SafeAreaView style={s.safe}><Spinner /></SafeAreaView>;
  return <NavigationContainer ref={navigationRef} key={(dark ? 'dark' : 'light') + ':' + tick} initialState={liveState.current ?? initial} onStateChange={(state: any) => { liveState.current = state; saveNavState(state); }}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Settings" component={SettingsStack} />
    </Stack.Navigator>
    <ExpoStatusBar style={dark ? 'light' : 'dark'} /><MiniPlayer /><OverlayHost />
  </NavigationContainer>;
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
 * The splash. The mark settles in, the wordmark follows it, and an aura drifts
 * behind them. It leaves the moment the app behind it is ready, and never
 * before it has held long enough to read as a beginning rather than a flash.
 */
function Splash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { dark } = useTheme();
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const still = useCalmMotion();
  const mark = useRef(new Animated.Value(.74)).current;
  const words = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const driftY = useDrift(9000, -26, 26, still);
  const driftX = useDrift(11000, 18, -18, still);
  const [held, setHeld] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    Animated.spring(mark, { toValue: 1, friction: 5, tension: 64, useNativeDriver: true }).start();
    Animated.timing(words, { toValue: 1, duration: 520, delay: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const timer = setTimeout(() => setHeld(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (still) { halo.setValue(.5); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(halo, { toValue: 1, duration: 1900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(halo, { toValue: 0, duration: 1900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [still]);

  useEffect(() => {
    if (ready) { progress.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      Animated.timing(progress, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [ready]);

  // It goes as soon as the app behind it is ready and the mark has had its moment.
  useEffect(() => {
    if (!ready || !held || leaving.current) return;
    leaving.current = true;
    Animated.timing(fade, { toValue: 0, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => onDone());
  }, [ready, held, onDone]);

  return <Animated.View style={[s.splashRoot, { opacity: fade }]}>
    <StatusBar barStyle="light-content" />
    <LinearGradient colors={dark ? [C.heroA, '#191531', C.deep] : [C.heroA, C.heroB, '#3A3280']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.splashFill} />
    <Animated.View style={[s.splashAuraA, { transform: [{ translateX: driftX }, { translateY: driftY }] }]} />
    <Animated.View style={[s.splashAuraB, { transform: [{ translateX: driftY }, { translateY: driftX }] }]} />
    <View style={s.splashStage}>
      <View style={s.splashMarkWrap}>
        <Animated.View style={[s.splashHalo, { opacity: halo, transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [.9, 1.22] }) }] }]} />
        <Animated.View style={{ transform: [{ scale: mark }] }}>
          <Image source={dark ? LOGO_MARK_DARK : LOGO_MARK} resizeMode="contain" style={s.splashMark} />
        </Animated.View>
      </View>
      <Animated.View style={[s.splashWords, { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
        <Text style={s.splashName}>{T('Islamic')}</Text>
        <Text style={s.splashTagline}>{T('Your Daily Companion')}</Text>
      </Animated.View>
    </View>
    <View style={s.splashTrack}>
      <Animated.View style={[s.splashBar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['12%', '76%'] }) }]} />
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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
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
        style={s.searchInput} placeholder={T('Search for your city')} placeholderTextColor="#929B96"
        returnKeyType="search" autoCorrect={false} />
      {query.length > 0 && <Pressable accessibilityLabel={T('Clear city search')} onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}
    </View>

    {searching && <Spinner />}

    {!searching && query.trim().length >= 2 && results.length === 0 && <View style={s.onbNote}>
      <Text style={s.onbNoteText}>{online
        ? T('No place found with that name. You can still continue — set it later in Settings, or enter coordinates there.')
        : T('Not in the offline list, and the connection could not be reached. Continue and set it in Settings, where coordinates can be entered by hand.')}</Text>
    </View>}

    {results.length > 0 && <View style={s.cityResults}>
      {results.map((city) => <Pressable key={`${city.ascii}-${city.country}-${city.latitude}`}
        accessibilityLabel={`${city.name}, ${city.countryName}`} onPress={() => choose(city)} style={s.cityResultRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.cityResultName}>{city.name}</Text>
          <Text style={s.meta}>{city.countryName}</Text>
        </View>
        {ico('arrow-forward', 17, C.muted)}
      </Pressable>)}
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
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  const [health, setHealth] = useState<NotificationHealth>('undetermined');
  const [asking, setAsking] = useState(false);

  useEffect(() => { void getNotificationHealth().then(setHealth); }, []);

  const ask = async () => {
    setAsking(true);
    const next = await requestNotificationPermission(rtl);
    setHealth(next);
    setAsking(false);
  };

  const granted = health === 'granted';

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
      : health === 'denied'
        ? <View style={s.onbNote}>
            <Text style={s.onbNoteText}>{T('Permission was declined earlier, so reminders stay off. You can turn them on in the system settings for this app at any time.')}</Text>
          </View>
        : <Pressable accessibilityLabel={T('Allow notifications')} onPress={() => { void ask(); }} style={[s.onbWideBtn, asking && { opacity: 0.6 }]}>
            {ico('notifications-outline', 19, C.green)}
            <Text style={s.onbWideBtnText}>{T('Allow notifications')}</Text>
          </Pressable>}

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
  const { rtl } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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
      <Text style={s.sleepHadithRef}>{rtl ? SLEEP_SURAH.hadithAr : SLEEP_SURAH.hadith}</Text>
    </View>

    <View style={s.onbPromise}>
      {ico('moon-outline', 22, C.green)}
      <View style={{ flex: 1 }}>
        <Text style={s.onbPromiseTitle}>{T('Recited before sleeping')}</Text>
        <Text style={s.onbPromiseBody}>
          {T('The Prophet (peace be upon him) would not sleep until he had recited As-Sajdah and Al-Mulk.')}
        </Text>
        <Text style={s.sleepHadithRef}>{rtl ? SLEEP_SURAH.practiceAr : SLEEP_SURAH.practice}</Text>
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

function Onboarding({ onFinish }: { onFinish: () => void }) {
  const { dark } = useTheme();
  const { rtl, language, setLanguage } = useLanguage();
  const T = (text: string) => tx(rtl, text);
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

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return languages;
    return languages.filter(
      (entry) => entry.label.toLowerCase().includes(needle) || entry.code.includes(needle),
    );
  }, [languages, query]);

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
  const active = steps[step];

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
      onFinish();
    } catch { setBusy(false); }
  };

  return <View style={s.safe}>
    <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
    <View style={s.onbTop}>
      <Image source={dark ? LOGO_MARK_DARK : LOGO_MARK} resizeMode="contain" style={s.appLogo} />
    </View>
    <ScrollView contentContainerStyle={s.onbScroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={[s.onbHead, { opacity: slide, transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [rtl ? -26 : 26, 0] }) }] }]}>
        <Text style={s.h1}>{active.title}</Text>
        <Text style={s.onbCaption}>{active.caption}</Text>
      </Animated.View>
      {step === 1 ? <View style={s.onbList} key="languages">
        {/* Keeping everything is the plainest way to say what this does, and
            the number is stated rather than implied: nobody should tick ninety
            seven boxes expecting nine to survive on a full phone. */}
        <View style={s.onbAllBar}>
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
        </View>

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

        {!editions.length && <Spinner />}
        {editions.length > 0 && !visible.length && <Text style={s.onbCardNote}>{T('No language matches that.')}</Text>}

        {visible.map((entry, index) => {
          const selected = chosen === entry.code;
          const list = byLanguage.get(entry.code) || [];
          const saved = hasLanguage(entry.code);
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
                {list.length ? <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={saved ? `${T('Stop keeping')} ${entry.label} ${T('offline')}` : `${T('Keep')} ${entry.label} ${T('for offline')}`}
                  onPress={() => toggleLanguage(entry.code)}
                  style={[s.onbDl, saved && s.onbDlOn]}>
                  {ico(saved ? 'checkmark' : 'download-outline', 17, saved ? C.onAccent : C.ink)}
                </Pressable> : null}
                <View style={[s.onbTick, selected && s.onbTickOn]}>{selected && ico('checkmark', 16, C.onAccent)}</View>
              </View>
              {saved && <View style={s.onbSavedRow}>
                {ico('cloud-done-outline', 12, C.success)}
                <Text style={s.onbSavedText}>{T('Saved for offline')}</Text>
              </View>}
            </MotionPress>
          </RiseIn>;
        })}
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
        <MotionPress style={[s.onbCta, busy && s.onbCtaOff]} onPress={() => { if (step < steps.length - 1) setStep(step + 1); else void finish(); }}>
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
  const { preferences, hydrated } = useQuranPreferences();
  const language = languageFromEditionId(preferences.translationEdition);
  useEffect(() => {
    if (!hydrated || !language) return;
    void syncAudioTranslationToLanguage(language).catch(() => undefined);
  }, [hydrated, language]);
}

function AppShell() {
  const { ready, rtl: rtlNow } = useLanguage();  /* rtlNow is a flag here, not a function */
  const { location } = useAppLocation();
  const { settings } = useWorshipSettings();
  const { hydrated } = useQuranPreferences();
  useAudioLanguageSync();
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
    if (!navigationRef.isReady()) return;
    const go = (name: string, params?: any) => (navigationRef as any).navigate(name, params);

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
      const position = await loadReadingPosition().catch(() => null);
      if (position?.surahId) {
        go('Quran', {
          screen: 'Reader',
          params: {
            chapter: {
              id: position.surahId,
              name_simple: position.surahName,
              name_arabic: '',
              verses_count: 0
            },
            focusVerse: position.verseKey
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

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = addNotificationResponseReceivedListener((response: NotificationResponse) => {
      const data: any = response?.notification?.request?.content?.data;
      const action = actionFromResponse(response);

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
    });
    return () => subscription.remove();
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
        value.snapshot, settings, rtlNow,
        position ? `${position.surahName} ${position.verseKey}` : undefined,
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

  return <View style={s.shellRoot}>
    <Root />
    {splash && <View style={s.shellLayer}><Splash ready={(ready && hydrated) || stalled} onDone={() => setSplash(false)} /></View>}
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
    loadReports(),
  ]).catch(() => undefined);
}

export default function App(){const[fontsLoaded]=useFonts({DMSans_400Regular,DMSans_600SemiBold,DMSans_700Bold,Newsreader_600SemiBold,NotoNaskhArabic_400Regular,NotoNaskhArabic_600SemiBold,Amiri_400Regular,KFGQPCUthmanicHafs,IBMPlexSansArabic_400Regular,IBMPlexSansArabic_600SemiBold});const restoreTick=useRestoreNonce();
useEffect(()=>{if(restoreTick>0){void reloadAllState()}},[restoreTick]);
useEffect(()=>{if(fontsLoaded){void loadOfflineSetup();void resumeSavedOfflineSetup();resumeSavedQuranPreload();void loadAudioSettings().then(() => restoreSavedSession());void loadHadithState();void loadTasbihState();void loadDownloads();void loadActivity();void loadFastingState();void loadJourneys();void loadWomensState();void loadZakatState();void loadLockConfig();void loadBackupSettings();void refreshMarket();startLockWatch();startBackupWatch()}},[fontsLoaded]);if(!fontsLoaded)return <SafeAreaView style={s.safe}><Spinner/></SafeAreaView>;return <ThemeProvider key={restoreTick}><LanguageProvider><QuranPreferencesProvider><WorshipSettingsProvider><LocationProvider><AppShell/></LocationProvider></WorshipSettingsProvider></QuranPreferencesProvider></LanguageProvider></ThemeProvider>}

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
 splashAuraA:{position:'absolute',top:-90,left:-70,width:320,height:320,borderRadius:160,backgroundColor:C.gold,opacity:.16},
 splashAuraB:{position:'absolute',bottom:-120,right:-90,width:360,height:360,borderRadius:180,backgroundColor:C.green,opacity:.24},
 splashStage:{alignItems:'center',justifyContent:'center',gap:26,paddingHorizontal:40},
 splashMarkWrap:{width:112,height:112,alignItems:'center',justifyContent:'center'},
 splashHalo:{position:'absolute',width:112,height:112,borderRadius:56,backgroundColor:C.gold,opacity:.22},
 splashMark:{width:88,height:88},
 splashWords:{alignItems:'center',gap:8},
 splashName:{color:C.onHero,fontSize:30,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6,textAlign:'center'},
 splashTagline:{color:'rgba(255,255,255,.68)',fontSize:13,fontFamily:'DMSans_400Regular',textAlign:'center',letterSpacing:.2},
 splashTrack:{position:'absolute',bottom:56,left:'22%',right:'22%',height:3,borderRadius:2,backgroundColor:'rgba(255,255,255,.22)',overflow:'hidden'},
 splashBar:{height:3,borderRadius:2,backgroundColor:C.onHero},
 onbTop:{paddingHorizontal:20,paddingTop:20,paddingBottom:4},
 onbScroll:{paddingHorizontal:20,paddingTop:8,paddingBottom:20},
 onbHead:{marginBottom:20},
 onbCaption:{color:C.muted,fontSize:14,fontFamily:'DMSans_400Regular',lineHeight:22,marginTop:10},
 onbList:{gap:10},
 onbCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line},
 onbCardOn:{borderColor:C.green,backgroundColor:C.mint},
 onbCardTop:{flexDirection:'row',alignItems:'center',gap:12},
 onbCardText:{flex:1,gap:2},
 onbCardName:{color:C.ink,fontSize:17,fontFamily:'DMSans_600SemiBold'},
 onbCardNameRtl:{textAlign:'right'},
 onbCardSub:{color:C.muted,fontSize:12,fontFamily:'DMSans_400Regular'},
 onbCardNote:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular',marginTop:8},
 onbTick:{width:26,height:26,borderRadius:13,backgroundColor:C.blue,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
 onbTickOn:{backgroundColor:C.green,borderColor:C.green},
 /* --- offline downloads on the language step --- */
 onbAllBar:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.mint,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line,marginBottom:12},
 onbAllText:{flex:1,gap:2},
 onbAllTitle:{color:C.ink,fontSize:15,fontFamily:'DMSans_600SemiBold'},
 onbAllSub:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular',lineHeight:16},
 onbAllBtn:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:C.green,borderRadius:14,paddingHorizontal:12,paddingVertical:9},
 onbAllBtnOn:{backgroundColor:C.success},
 onbAllBtnText:{color:C.onAccent,fontSize:12,fontFamily:'DMSans_600SemiBold'},
 onbCount:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular'},
 onbDl:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,backgroundColor:C.blue},
 onbDlOn:{backgroundColor:C.success,borderColor:C.success},
 onbDlBusy:{backgroundColor:C.blue,borderColor:C.green},
 onbFlag:{fontSize:20,marginRight:10},
 onbSearch:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.card,borderRadius:14,paddingHorizontal:12,paddingVertical:10,borderWidth:1,borderColor:C.line,marginBottom:10},
 onbSearchInput:{flex:1,color:C.ink,fontSize:14,fontFamily:'DMSans_400Regular',padding:0},
 onbSavedRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:6},
 onbSavedText:{color:C.success,fontSize:11,fontFamily:'DMSans_500Medium'},
 onbFoot:{paddingHorizontal:20,paddingTop:12,paddingBottom:24,gap:14,borderTopWidth:1,borderColor:C.line,backgroundColor:C.bg},
 onbDots:{flexDirection:'row',justifyContent:'center',gap:6},
 onbDot:{width:7,height:7,borderRadius:4,backgroundColor:C.line},
 onbDotOn:{width:24,backgroundColor:C.green},
 onbActions:{flexDirection:'row',gap:10},
 onbCta:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:52,borderRadius:18,backgroundColor:C.green},
 onbCtaOff:{opacity:.6},
 onbCtaText:{color:C.onAccent,fontSize:15,fontFamily:'DMSans_700Bold'},
 onbGhost:{flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:52,paddingHorizontal:22,borderRadius:18,borderWidth:1,borderColor:C.line},
 onbGhostText:{color:C.ink,fontSize:15,fontFamily:'DMSans_600SemiBold'},
  journeyCard:{flexDirection:'row',alignItems:'center',gap:CARD.gap,backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,...surface},
  journeyTitleRow:{flexDirection:'row',alignItems:'center',gap:SPACE.sm},
  journeyArabic:{color:C.green,fontSize:18,fontFamily:'KFGQPCUthmanicHafs',marginTop:SPACE.xs,marginBottom:SPACE.xs},
  journeyBar:{height:6,borderRadius:3,backgroundColor:C.mint,overflow:'hidden',marginTop:SPACE.sm,marginBottom:SPACE.xs},
  journeyBarFill:{height:6,borderRadius:3,backgroundColor:C.green},
  stepCard:{backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:CARD.gap,...surface},
  stepCardDone:{borderColor:'#BFD9CF',backgroundColor:'#FBFCFB'},
  stepHead:{flexDirection:'row',alignItems:'flex-start',gap:CARD.gap},
  stepIndex:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.4,marginBottom:SPACE.xs},
  stepCheck:{width:44,height:44,borderRadius:22,borderWidth:1.5,borderColor:C.line,alignItems:'center',justifyContent:'center'},
  stepCheckDone:{backgroundColor:C.accent,borderColor:C.green},
  stepCountBox:{alignItems:'center',minWidth:96},
  stepCount:{color:C.ink,fontSize:24,fontFamily:'Newsreader_600SemiBold'},
  stepCountLabel:{color:C.muted,fontSize:11,marginTop:SPACE.xs},
  verseBox:{backgroundColor:C.mint,borderRadius:RADIUS.lg,padding:CARD.padding,gap:SPACE.sm,borderWidth:1,borderColor:C.line},
  verseArabic:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:24,lineHeight:48,includeFontPadding:false},
  stepNote:{color:C.ink,fontSize:13,fontStyle:'italic',backgroundColor:C.mint,borderRadius:RADIUS.md,padding:SPACE.md},
  channelCard:{backgroundColor:C.card,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:SPACE.md,...surface},
  channelHead:{flexDirection:'row',alignItems:'center',gap:CARD.gap},
  channelArabic:{color:C.green,fontSize:18,fontFamily:'KFGQPCUthmanicHafs',marginTop:SPACE.xs},
  dataSourceRow:{marginTop:8},
  floatBarWrap:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:Platform.OS==='ios'?24:16,pointerEvents:'box-none'},
  floatBar:{height:66,borderRadius:33,backgroundColor:C.white,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'space-between',paddingHorizontal:8,...shadow},
  floatItem:{flex:1,alignItems:'center',justifyContent:'center',minHeight:54,borderRadius:28},
  floatPill:{alignItems:'center',justifyContent:'center',borderRadius:24,paddingHorizontal:12,paddingVertical:8,minWidth:58},
  floatPillActive:{backgroundColor:C.mint},
  floatLabel:{color:'#6B7180',fontFamily:'DMSans_600SemiBold',fontSize:10,letterSpacing:.2,marginTop:4},
  floatLabelActive:{color:C.green},
 safe:{flex:1,backgroundColor:C.bg,overflow:'hidden',paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0},page:{flex:1,backgroundColor:C.bg},pageWide:{width:'100%',maxWidth:1180,alignSelf:'center'},scroll:{width:'100%',maxWidth:980,alignSelf:'center',paddingHorizontal:20,paddingTop:20,paddingBottom:BOTTOM_RESERVE},row:{flexDirection:'row',alignItems:'center'},press:{opacity:.72,transform:[{scale:.98}]},loading:{padding:44,alignItems:'center',gap:12},loadingText:{color:C.muted,fontSize:12},error:{backgroundColor:'#F5EFEE',padding:24,borderRadius:24,alignItems:'center',marginVertical:12},errorIcon:{width:48,height:48,borderRadius:16,backgroundColor:'#EDE5E4',alignItems:'center',justifyContent:'center'},errorTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_600SemiBold',marginTop:12},errorText:{color:C.muted,textAlign:'center',fontSize:12,lineHeight:18,marginTop:4},retry:{backgroundColor:C.ink,paddingHorizontal:16,paddingVertical:8,borderRadius:12,marginTop:12},retryText:{color:C.onAccent,fontSize:11,fontFamily:'DMSans_600SemiBold'},
 topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 appHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 appHeaderBrand:{flexDirection:'row',alignItems:'center',gap:10,flexShrink:1},
 appLogo:{width:36,height:36},
 appName:{color:C.ink,fontSize:20,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,flexShrink:1},
 appHeaderActions:{flexDirection:'row',alignItems:'center',gap:6},
 headerBtn:{width:40,height:40,borderRadius:14},overline:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginBottom:4},h1:{color:C.ink,fontSize:32,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.8},iconBtn:{width:44,height:44,borderRadius:16,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},iconBtnDark:{backgroundColor:C.card,borderColor:C.line},section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:28,marginBottom:16},h2:{color:C.ink,fontSize:22,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.35},sectionAction:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
 graphicFrame:{alignItems:'center',justifyContent:'center',overflow:'hidden'},motionGlyph:{width:49,height:49,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},motionGlyphInverse:{backgroundColor:'rgba(255,255,255,.14)',borderColor:'rgba(255,255,255,.22)'},glyphDot:{position:'absolute',right:6,top:6,width:5,height:5,borderRadius:4,backgroundColor:C.gold},greeting:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16},salam:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:4},greetingTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},prayerHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:6,marginBottom:16},prayerOverline:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:5},prayerTitle:{color:C.ink,fontSize:27,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},
 aura:{position:'absolute',top:'-30%',left:'-20%',right:'-20%',height:'160%'},auraAlt:{position:'absolute',top:'-20%',left:'10%',right:'-25%',height:'140%',opacity:.8},heroSheen:{position:'absolute',top:'-20%',bottom:'-20%',width:'38%',left:'31%',opacity:.5},hero:{height:285,borderRadius:28,overflow:'hidden',padding:20,...shadow},heroWide:{height:310},heroBg:{position:'absolute',left:0,right:0,top:0,bottom:0,width:'100%',height:'100%'},locationPill:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',maxWidth:'72%',backgroundColor:'rgba(2,28,30,.62)',paddingHorizontal:12,paddingVertical:8,borderRadius:16},locationText:{color:C.onAccent,fontFamily:'DMSans_600SemiBold',fontSize:11,flexShrink:1},hijri:{color:'#D8D5E9',fontSize:11,marginTop:12},nextLabel:{color:'#FFE2A1',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginTop:36},heroTime:{color:C.onAccent,fontSize:42,fontFamily:'DMSans_700Bold',letterSpacing:-1.2,marginTop:2},heroFooter:{position:'absolute',left:20,right:20,bottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},countPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'rgba(255,255,255,.16)',paddingHorizontal:12,paddingVertical:8,borderRadius:16,borderWidth:1,borderColor:'rgba(255,255,255,.18)'},countText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_600SemiBold'},heroCta:{flexDirection:'row',alignItems:'center',gap:8},heroCtaText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold'},
 prayerRail:{marginHorizontal:8,marginTop:-1,backgroundColor:C.white,borderBottomLeftRadius:24,borderBottomRightRadius:24,flexDirection:'row',paddingHorizontal:8,paddingVertical:12,borderWidth:1,borderTopWidth:0,borderColor:C.line,...soft},railItem:{flex:1,alignItems:'center',paddingVertical:4,borderRadius:16},railItemActive:{backgroundColor:'#F0EDFF'},railIcon:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,.94)',borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center',marginBottom:8},railIconDone:{backgroundColor:'#E4F2EC',borderColor:C.green},
adhkarDuaCard:{marginHorizontal:8},
adhkarCount:{minWidth:38,paddingVertical:4,paddingHorizontal:9,borderRadius:11,backgroundColor:C.soft,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
adhkarCountText:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11},
adhkarDots:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:6,marginTop:12,marginBottom:2},
adhkarMore:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4,alignSelf:'center',marginTop:10,paddingVertical:5,paddingHorizontal:12,borderRadius:13,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF'},
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
roundIcon:{width:58,height:58,borderRadius:29,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDD6FF'},
roundLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:11,lineHeight:14,marginTop:8,textAlign:'center'},
depthCard:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderTopColor:depth.edge,...depth.ambient},
depthBody:{overflow:'hidden'},
depthVeil:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:depth.veil},railCheck:{position:'absolute',top:-2,right:-2,width:16,height:16,borderRadius:8,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.white},railName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},railTime:{color:C.ink,textAlign:'center',fontFamily:'DMSans_600SemiBold',fontSize:10,lineHeight:11,marginTop:2},
 sliderContent:{gap:12,paddingRight:28},sliderControls:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:8},sliderHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},sliderButtons:{flexDirection:'row',gap:8},sliderButton:{width:44,height:44,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:C.card,borderWidth:1,borderColor:C.line},sliderButtonDisabled:{opacity:.32},essentialSlide:{height:174,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},essentialTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},essentialArrow:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},essentialTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,marginTop:4},essentialBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},tool:{width:'33.33%',paddingVertical:12},
 homeProgress:{marginHorizontal:8,backgroundColor:C.card,borderBottomLeftRadius:20,borderBottomRightRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderTopWidth:0,borderColor:C.line},homeProgressRing:{width:43,height:43,borderRadius:24,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'#D7CFFF'},dailyKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:4},dailyArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,lineHeight:36,textAlign:'right',marginTop:8},weekWrap:{marginTop:12},
weekSurface:{backgroundColor:C.deep,borderColor:'transparent',borderTopColor:'rgba(255,255,255,.16)'},
weekBody:{padding:16,gap:14},weekSummaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:19},weekSummaryBody:{color:'#D9D3F3',fontSize:10,marginTop:4},
weekTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:10},
homeWeekRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:6},
homeWeekCol:{flex:1,alignItems:'center',gap:6},
homeWeekTrack:{width:'100%',height:38,justifyContent:'flex-end',alignItems:'center'},
homeWeekBar:{width:'100%',maxWidth:18,borderRadius:4,backgroundColor:C.gold},
homeWeekDay:{color:'#A79FD0',fontSize:9.5,fontFamily:'DMSans_600SemiBold'},
homeWeekDayOn:{color:C.onAccent},weekStatValue:{color:C.green,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:8},weekBar:{flex:1,height:8,borderRadius:4,backgroundColor:'#EAE6F0',overflow:'hidden',marginHorizontal:8},weekBarFill:{height:'100%',borderRadius:4,backgroundColor:C.green},weekScoreBody:{color:'#D9D3F3',fontSize:10,marginTop:4},readWrap:{height:205},
readSurface:{borderColor:'transparent'},
readPad:{padding:20,overflow:'hidden',borderRadius:28},readKicker:{color:'#CCEBDE',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5},readArabic:{color:C.onAccent,fontSize:29,marginTop:8},readTitle:{color:C.onAccent,fontSize:20,fontFamily:'DMSans_700Bold'},readMeta:{color:'#CAE4DB',fontSize:10,marginTop:4},whiteButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,alignSelf:'flex-start',backgroundColor:C.white,paddingHorizontal:12,paddingVertical:8,borderRadius:16,marginTop:12},whiteButtonText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},twoCol:{flexDirection:'row',gap:12,marginTop:12},liveBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',backgroundColor:'rgba(73,58,146,.90)',paddingHorizontal:8,paddingVertical:4,borderRadius:8} as any,liveDot:{width:5,height:5,borderRadius:4,backgroundColor:'#FF9A72'},liveText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:.5},hadithSurface:{padding:16},quote:{position:'absolute',right:18,top:2,color:'#E2EEE8',fontSize:72,fontFamily:'DMSans_700Bold'},hadithText:{color:C.ink,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:16},hadithFoot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:16,paddingTop:12,borderTopWidth:1,borderColor:C.line},metaRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:2},meta:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16},
 dayStripScroll:{paddingHorizontal:20,marginHorizontal:-20},dayStrip:{flexDirection:'row',gap:4,backgroundColor:C.card,padding:8,borderRadius:24,borderWidth:1,borderColor:C.line,...soft},dayChosen:{color:C.muted,fontSize:11,fontFamily:'DMSans_600SemiBold',textAlign:'center',marginTop:10},dayDot:{width:4,height:4,borderRadius:2,backgroundColor:C.line,marginTop:3},day:{width:47,alignItems:'center',paddingVertical:8,borderRadius:16},dayActive:{backgroundColor:C.accent},dayName:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},dayNum:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dayText:{color:C.onAccent},nextCard:{height:190,borderRadius:28,padding:20,marginTop:16,overflow:'hidden',...shadow},nextCardBody:{flex:1},nextCardLabel:{color:'#E1DCF7',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5,marginTop:20},nextCardName:{color:C.onAccent,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:4},nextCardTime:{color:C.onAccent,fontSize:17,fontFamily:'DMSans_600SemiBold',marginBottom:12},moonOrb:{position:'absolute',right:24,top:43,width:96,height:96,borderRadius:48,backgroundColor:'rgba(255,255,255,.13)',alignItems:'center',justifyContent:'center'},prayerList:{backgroundColor:C.card,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...surface},prayerRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,minHeight:68,borderBottomWidth:1,borderColor:C.line},prayerRowLive:{backgroundColor:'#F2EFFF'},prayerSymbol:{width:41,height:41,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},prayerName:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},prayerValue:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold',marginRight:8},prayerProgress:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line,...surface},progressTrack:{width:86,height:7,borderRadius:4,backgroundColor:'#EAE7F1',overflow:'hidden'},progressFill:{height:'100%',borderRadius:4,backgroundColor:C.green},progressCount:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},prayerSymbolDone:{backgroundColor:C.accent,borderColor:C.green},sourceCard:{flexDirection:'row',gap:12,alignItems:'center',backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:16},sourceTitle:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},sourceBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},
 search:{height:48,flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,borderWidth:1,borderColor:C.line,marginBottom:12,...soft},searchInput:{flex:1,color:C.ink,fontSize:12,outlineStyle:'none'} as any,quranHero:{height:225,borderRadius:28,overflow:'hidden',padding:20,...shadow},quranArabic:{color:C.onAccent,fontSize:28,marginTop:16},quranHeroTitle:{color:C.onAccent,fontSize:21,fontFamily:'DMSans_700Bold'},quranHeroMeta:{color:'#D8D4EA',fontFamily:'DMSans_400Regular',fontSize:11,marginTop:4},continueBar:{backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},quranHeroWide:{height:245},quranActionGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},quranPrimaryWrap:{flexGrow:1,flexBasis:'40%',minWidth:280},quranPrimaryAction:{height:142,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',overflow:'hidden',...soft},quranPrimaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:24,marginTop:8},quranPrimaryBody:{color:'#D9D5EC',fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:4},quranNavWrap:{flexGrow:1,flexBasis:'14%',minWidth:98},quranNavCard:{height:142,backgroundColor:C.card,borderRadius:20,padding:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...surface},quranNavTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:4},quranNavCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:14,marginTop:2,textAlign:'center'},quranStudyCard:{height:190,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},quranStudyTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},studyNumber:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},quranStudyTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:20,marginTop:8},quranStudyCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16,marginTop:4},quranPreferenceRow:{flexDirection:'row',flexWrap:'wrap',gap:12},qTileGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},qTile:{alignItems:'center',justifyContent:'center',backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingVertical:12,paddingHorizontal:4,...soft},qTileLabel:{marginTop:6,fontSize:11,fontFamily:'DMSans_600SemiBold',color:C.ink,textAlign:'center',lineHeight:14},qStatRow:{flexDirection:'row',gap:8},qStat:{flex:1,alignItems:'center',backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingVertical:12,paddingHorizontal:4,...soft},qStatIcon:{width:32,height:32,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center',marginBottom:7},qStatValue:{fontSize:16,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:1,textAlign:'center'},qStatLabel:{marginTop:2,fontSize:10,color:C.muted,fontFamily:'DMSans_600SemiBold',textAlign:'center',alignSelf:'stretch'},quranPreferenceCard:{flex:1,minWidth:260,minHeight:76,backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line,...surface},quranPersonalGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},quranPersonalWrap:{flexGrow:1,flexBasis:'18%',minWidth:130},quranPersonalCard:{minHeight:132,backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...surface},quranPersonalHead:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},quranPersonalValue:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:22},quranPersonalTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:8},quranPersonalCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,marginTop:4},recentChip:{minWidth:128,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line},surahList:{gap:CARD_GAP},surahMore:{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:16,borderRadius:RADIUS.lg,borderWidth:1,borderColor:C.line,borderStyle:'dashed'},surahMoreText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:13},surahChips:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:7},
surahChip:{paddingVertical:3,paddingHorizontal:8,borderRadius:9,backgroundColor:C.soft,borderWidth:1,borderColor:C.line},
surahChipText:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},
surahChipMakki:{backgroundColor:C.mint,borderColor:'#DDD6FF'},
surahChipMadani:{backgroundColor:'#FFF4E5',borderColor:'#F6E2C4'},
surahChipTextMakki:{color:C.green},
surahChipTextMadani:{color:'#A56A1C'},
surahArWrap:{alignItems:'flex-end',justifyContent:'center',paddingStart:4},surahRight:{alignItems:'flex-end',justifyContent:'center',gap:5},surahRing:{width:17,height:17,borderRadius:9,backgroundColor:C.gold,alignItems:'center',justifyContent:'center',marginBottom:3},surahRingHalf:{backgroundColor:'transparent',borderWidth:1.6,borderColor:C.gold},surahRingDot:{width:6,height:6,borderRadius:3,backgroundColor:C.gold},
surahCard:{width:'100%',minHeight:64,backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,paddingHorizontal:13,paddingVertical:9,...surface},surahRowInner:{flex:1,flexDirection:'row',alignItems:'center',gap:11},surahPlace:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,textTransform:'uppercase',marginTop:SPACE.xs},surahNum:{width:36,height:36,borderRadius:12,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},surahNumText:{color:C.green,fontSize:13,fontFamily:'Newsreader_700Bold'},surahName:{color:C.ink,fontSize:14.5,fontFamily:'DMSans_700Bold'},surahAr:{color:C.green,fontSize:20,fontFamily:'KFGQPCUthmanicHafs'},
 readerModes:{flexDirection:'row',gap:12,marginTop:12},readerMode:{flex:1,minHeight:56,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:C.white,borderRadius:20,borderWidth:1,borderColor:C.line},readerModeActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},readerModeText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},readerBar:{height:72,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line},surahStep:{width:32,height:32,alignItems:'center',justifyContent:'center',marginHorizontal:2},offscreenCard:{position:'absolute',top:-100000,left:0,opacity:0},readerName:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold'},readerProgress:{height:4,backgroundColor:'#E6E2EB',overflow:'hidden'},readerScroll:{width:'100%',maxWidth:860,alignSelf:'center',padding:16,paddingBottom:BOTTOM_RESERVE},surahHead:{borderRadius:28,padding:24,alignItems:'center',...shadow},surahHeadAr:{color:C.onAccent,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:38,marginTop:16},surahHeadEn:{color:'#C9E5DB',fontSize:10,marginTop:4},bismillah:{color:C.onAccent,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,marginTop:24},ayahContinuous:{marginTop:4,borderRadius:4,borderBottomWidth:1,shadowOpacity:0,elevation:0},ayahSelected:{borderColor:C.gold,borderWidth:2,backgroundColor:'#FFFDF5'},ayahActions:{flexDirection:'row',alignItems:'center',gap:6,marginLeft:-4},ayahFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12},ayah:{backgroundColor:C.white,borderRadius:24,padding:20,marginTop:12,borderWidth:1,borderColor:C.line,...soft},ayahTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},ayahNo:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',backgroundColor:C.mint,paddingHorizontal:8,paddingVertical:8,borderRadius:12},ayahAr:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:30,lineHeight:58,marginTop:16},ayahTranslation:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:20,marginTop:16,paddingTop:16,borderTopWidth:1,borderColor:C.line},ayahMeta:{color:C.muted,fontSize:10,marginTop:12},
 translationRow:{minHeight:67,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},languageBadge:{width:52,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:4},languageFlag:{fontSize:12},languageBadgeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},historyHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},historyWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:12},historyChip:{backgroundColor:C.mint,borderRadius:16,paddingHorizontal:12,paddingVertical:8},searchResult:{backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:8,borderWidth:1,borderColor:C.line},noteText:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:17,lineHeight:24,marginVertical:8},noteInput:{minHeight:180,backgroundColor:C.white,borderRadius:20,padding:16,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,stepper:{backgroundColor:C.white,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},stepButton:{width:44,height:44,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},fontPreview:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line},fontPreviewText:{color:C.ink,textAlign:'right',lineHeight:52,includeFontPadding:false},previewArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs'},referenceNavigator:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginBottom:12},referenceInput:{width:100,textAlign:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,color:C.ink,fontFamily:'DMSans_700Bold',outlineStyle:'none'} as any,comparisonHelp:{color:C.muted,fontSize:10,lineHeight:15,marginTop:8},editionPicker:{gap:8,marginTop:12},editionChip:{minHeight:58,backgroundColor:C.white,borderRadius:16,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line},editionChipActive:{borderColor:C.green,backgroundColor:C.mint},editionFlag:{fontSize:20},arabicReference:{backgroundColor:C.yellow,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:'#E5D4A6'},comparisonColumns:{gap:12,paddingVertical:12,paddingRight:20},comparisonText:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,marginTop:12},mushafPage:{width:'100%',maxWidth:900,alignSelf:'center',paddingHorizontal:18,paddingTop:22,paddingBottom:BOTTOM_RESERVE},mushafNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},mushafNavFoot:{marginTop:18},pageJump:{flex:1,minWidth:0,alignItems:'center'},pageInput:{minWidth:74,textAlign:'center',color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:28,borderBottomWidth:1,borderColor:C.line,paddingVertical:4,outlineStyle:'none'} as any,pageProgress:{height:5,borderRadius:4,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:16},mushafSheet:{backgroundColor:'#FFFDF8',borderRadius:24,padding:20,borderWidth:1,borderColor:'#DED7C9',...soft},
  /* long-press verse menu: sits entirely above the verse it belongs to, so it
     never covers the line you are reading */
  mushafMenu:{position:'absolute',left:0,right:0,bottom:'100%',zIndex:20,alignItems:'center',paddingBottom:6},
  mushafMenuBar:{backgroundColor:'#FFFDF8',borderRadius:18,paddingHorizontal:5,paddingVertical:4,borderWidth:1,borderColor:'#DED7C9',...shadow},
  mushafMenuItem:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10,paddingVertical:7,borderRadius:14},
  mushafMenuItemOn:{backgroundColor:'#FBF4E3'},
  mushafMenuLabel:{color:C.ink,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  mushafVerseMenuOverlay:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:6},
  mushafVerseOpen:{backgroundColor:'#FBF4E3',borderRadius:10},
  /* the share sheet: a scrim that dismisses, and a card that rises */
  /* The overlay is the last child of the navigation container, so it is above
     the floating tab bar and the mini player by order of drawing alone. The
     zIndex is belt and braces for the platforms that reorder on elevation. */
  overlayLayer:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:9000,elevation:9000},
  sheetScrim:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(20,18,32,.42)'},
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
  langSheet:{maxHeight:'62%'},
  langRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,paddingVertical:11,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.bg,marginBottom:7},
  langRowOn:{backgroundColor:C.mint,borderColor:C.green},
  langFlag:{fontSize:19,width:26,textAlign:'center'},
  langName:{flex:1,color:C.ink,fontSize:14,fontFamily:'DMSans_600SemiBold'},
  langNameOn:{color:C.green,fontFamily:'DMSans_700Bold'},
  langCount:{color:C.muted,fontSize:11,fontFamily:'DMSans_400Regular'},
  langIndex:{color:C.muted,fontSize:10,fontFamily:'DMSans_400Regular',width:16,textAlign:'center'},
  tsLangButton:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.mint,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line,marginBottom:14},
  sheetCancel:{alignItems:'center',paddingVertical:12,marginTop:4},
  sheetBtnBusy:{opacity:.55},
  sheetCancelText:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:13},
  sheetKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.4,textAlign:'center',marginBottom:14},
  reflectArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:25,lineHeight:44,textAlign:'right',direction:'rtl'} as any,
  reflectProse:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:14},
  reflectSource:{backgroundColor:C.bg,borderRadius:18,padding:14,marginTop:18,borderWidth:1,borderColor:C.line},
  reflectSourceHead:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2,marginBottom:10},
  reflectScroll:{maxHeight:210},
  reportQuote:{backgroundColor:C.bg,borderRadius:14,padding:12,marginTop:12,borderWidth:1,borderColor:C.line},
  reportQuoteAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_400Regular',fontSize:16,lineHeight:28,textAlign:'right',direction:'rtl'} as any,
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
  noteSheetArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17,lineHeight:30,textAlign:'right',marginBottom:12,direction:'rtl'} as any,
  noteSheetInput:{minHeight:104,maxHeight:170,backgroundColor:C.bg,borderRadius:18,padding:14,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,
  noteSheetActions:{flexDirection:'row',alignItems:'center',gap:9,marginTop:14},
mushafFrame:{backgroundColor:C.dark?'#211C2C':'#FFFDF8',borderRadius:8,borderWidth:MUSHAF_FRAME_BORDER,borderColor:C.gold,padding:MUSHAF_FRAME_PAD,marginTop:4,...soft,overflow:'hidden'},
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
mushafPageNoText:{color:C.green,fontFamily:'Newsreader_700Bold',fontSize:16},mushafAyah:{paddingVertical:12,borderBottomWidth:1,borderColor:'#E9E1D5'},mushafSurah:{textAlign:'center',color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:20,backgroundColor:C.mint,borderRadius:16,paddingVertical:8,marginBottom:12},verseMarker:{color:C.gold,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17},mushafTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:8},sectionMarker:{flexDirection:'row',alignItems:'center',gap:10,marginTop:18,marginBottom:6},sectionRule:{flex:1,height:1,backgroundColor:C.line},sectionMarkerText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,textTransform:'uppercase',letterSpacing:1},mushafPageLine:{color:C.ink,textAlign:'center',writingDirection:'rtl'},topicGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},topicWrap:{width:'48%'},topicCard:{minHeight:190,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},vocabStats:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},flashcard:{minHeight:330,backgroundColor:C.white,borderRadius:28,padding:24,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...shadow},flashIndex:{position:'absolute',top:18,right:18,color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},flashArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:58,lineHeight:86,textAlign:'center'},flashTransliteration:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:28,marginTop:12},flashMeaning:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:18,marginVertical:8,textAlign:'center'},flashHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:16},tajweedPractice:{backgroundColor:C.card,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:C.line,...surface},tajweedRule:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,padding:12,borderBottomWidth:1,borderColor:C.line},tajweedSwatch:{width:18,height:44,borderRadius:9},compareCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},
  tcRefBar:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14},
  tcVerse:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:14,borderWidth:1,borderColor:C.line},
  tcSectionLabel:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:20,marginBottom:8},
  tcChosen:{flexDirection:'row',flexWrap:'wrap',gap:8},
  tcChip:{flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:12,paddingVertical:8,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#CFC7EE'},
  tcChipText:{color:C.green,fontSize:12,fontFamily:'DMSans_600SemiBold',maxWidth:150},
  tcColumns:{gap:12,marginTop:16},
  tcCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},
  tcCardHead:{flexDirection:'row',alignItems:'center',gap:8,paddingBottom:10,marginBottom:10,borderBottomWidth:1,borderColor:C.line},
  tcCardName:{flex:1,color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},
  tcCardLang:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold'},juzGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},juzCard:{width:'22.8%',aspectRatio:1,backgroundColor:C.card,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...surface},juzNo:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:23},preloadScore:{backgroundColor:C.white,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line},cacheUsage:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:8},preloadTrack:{height:9,borderRadius:4,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:12},preloadFill:{height:'100%',backgroundColor:C.green,borderRadius:4},planGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},planCard:{width:'48%',minHeight:130,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},planDays:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:36},planToday:{backgroundColor:C.white,borderRadius:20,padding:16,marginTop:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},practiceLaunch:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#CFC7EE'},recallCard:{minHeight:340,backgroundColor:C.white,borderRadius:28,padding:20,borderWidth:1,borderColor:C.line,...shadow},recallPrompt:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,lineHeight:29,marginTop:28,textAlign:'center'},recallArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:32,lineHeight:58,textAlign:'right',marginTop:24,paddingTop:20,borderTopWidth:1,borderColor:C.line},revealArea:{flex:1,minHeight:110,alignItems:'center',justifyContent:'center',gap:8,marginTop:20,borderTopWidth:1,borderColor:C.line},hifzStatus:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,textTransform:'uppercase'},intro:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:19,marginTop:0,marginBottom:20},exploreGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},exploreCard:{flexGrow:1,flexBasis:'31%',minWidth:150},exploreCardInner:{minHeight:164,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},exploreTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold',marginTop:12},exploreBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:15,marginTop:4,flex:1},exploreArrow:{width:29,height:29,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'},apiPanel:{backgroundColor:C.deep,borderRadius:24,padding:20,marginTop:12},apiTitle:{color:C.onAccent,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:16},apiText:{color:'#D9D3F3',fontSize:10,marginTop:4},
 toolPage:{flex:1,width:'100%',maxWidth:780,alignSelf:'center',alignItems:'center',padding:24,paddingTop:32},toolEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:20},compass:{width:260,height:260,borderRadius:130,backgroundColor:C.white,borderWidth:12,borderColor:'#E4DFFA',alignItems:'center',justifyContent:'center',marginTop:32,...shadow},north:{position:'absolute',top:12,color:C.coral,fontSize:10,fontFamily:'DMSans_700Bold'},compassArrow:{alignItems:'center',justifyContent:'center'},kaaba:{position:'absolute',right:43,bottom:47,width:31,height:31,backgroundColor:'#111C18',borderRadius:4},kaabaGold:{height:5,backgroundColor:C.gold,marginTop:8},direction:{color:C.ink,fontSize:31,fontFamily:'DMSans_700Bold',marginTop:24},directionText:{color:C.muted,fontSize:11,marginTop:4},primary:{backgroundColor:C.accent,paddingHorizontal:20,paddingVertical:12,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:16,marginTop:20},primaryText:{color:C.onAccent,fontSize:11,fontFamily:'DMSans_700Bold'},tasbihAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:32,marginTop:16},counter:{width:205,height:205,borderRadius:103,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:12,borderColor:'#E4DEFA',marginVertical:32,...shadow},counterNo:{color:C.onAccent,fontSize:58,fontFamily:'DMSans_700Bold'},counterGoal:{color:'#DDD6FF',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.3},secondary:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,backgroundColor:C.white,paddingHorizontal:16,paddingVertical:12,borderRadius:16,borderWidth:1,borderColor:C.line,marginHorizontal:4},secondaryText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
 summaryScore:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',justifyContent:'space-between',...shadow,borderTopColor:depth.edge},summaryDay:{minHeight:66,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line},summaryDots:{flexDirection:'row',gap:4},summaryDot:{width:8,height:8,borderRadius:4,backgroundColor:'#E2DEE8'},summaryDotDone:{backgroundColor:C.green},cityGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},cityCard:{width:'48.5%',minHeight:76,backgroundColor:C.card,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...surface},cityCardActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},cityName:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},formCard:{backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},
  rsEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginBottom:10},
  rsPreview:{backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...surface},
  rsPreviewArabic:{color:C.ink,textAlign:'right',writingDirection:'rtl'} as any,
  rsPreviewTranslit:{color:C.muted,fontFamily:'DMSans_400Regular',fontStyle:'italic',marginTop:8,textAlign:'right'},
  rsPreviewMeaning:{color:C.muted,fontFamily:'DMSans_400Regular',lineHeight:22,marginTop:14},
  rsPreviewFoot:{flexDirection:'row',justifyContent:'space-between',marginTop:16,paddingTop:12,borderTopWidth:1,borderColor:C.line},
  rsPreviewMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
  rsGroup:{backgroundColor:C.card,borderRadius:24,padding:16,marginTop:16,borderWidth:1,borderColor:C.line,...surface},
  rsGroupTitle:{color:C.ink,fontSize:12,fontFamily:'DMSans_700Bold',letterSpacing:1.1,marginBottom:12},
  rsDivider:{height:1,backgroundColor:C.line,marginVertical:16},fieldRow:{flexDirection:'row',gap:12},textField:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,fontSize:13,color:C.ink,marginTop:8,outlineStyle:'none'} as any,dangerButton:{padding:16,alignItems:'center',marginTop:12},dangerText:{color:C.coral,fontFamily:'DMSans_700Bold',fontSize:11},healthCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,marginBottom:16,...surface},healthDot:{width:10,height:10,borderRadius:5},actionRow:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:8,marginTop:4},audioPreview:{backgroundColor:C.deep,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',gap:12},audioPlay:{width:48,height:48,borderRadius:24,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'},guideGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},guideCard:{flexGrow:1,flexBasis:'30%',minWidth:150},guideCardInner:{minHeight:180,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...surface},guideArabic:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:27,lineHeight:47,textAlign:'right',backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:16},guideStep:{flexDirection:'row',gap:12,padding:16,borderBottomWidth:1,borderColor:C.line,alignItems:'flex-start'},stepNo:{width:28,height:28,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},stepNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},guideStepText:{flex:1,color:C.ink,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:19},guideNote:{backgroundColor:C.yellow,borderRadius:20,padding:16,marginTop:16},referenceRow:{minHeight:54,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},evidenceCard:{backgroundColor:C.card,borderRadius:18,padding:15,marginBottom:11,borderWidth:1,borderColor:C.line},evidenceLabel:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold',letterSpacing:.4,marginBottom:9},evidenceArabic:{color:C.ink,fontSize:17,fontFamily:'NotoNaskhArabic_400Regular',lineHeight:31,marginBottom:8,writingDirection:'rtl',textAlign:'right'},evidenceBody:{color:C.body,fontSize:13,fontFamily:'DMSans_400Regular',lineHeight:20},evidenceVerse:{marginBottom:11},evidenceFoot:{flexDirection:'row',alignItems:'center',marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:C.line},evidenceLink:{flex:1,color:C.green,fontSize:12,fontFamily:'DMSans_600SemiBold'},emptyWrap:{alignItems:'center',justifyContent:'center',paddingVertical:60,gap:10,paddingHorizontal:24},emptyTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16,textAlign:'center'},emptyBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,textAlign:'center'},dataPage:{width:'100%',maxWidth:860,alignSelf:'center',padding:20,paddingBottom:BOTTOM_RESERVE},empty:{backgroundColor:C.white,borderRadius:24,padding:24,alignItems:'center',borderWidth:1,borderColor:C.line},dataTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,marginTop:16,marginBottom:8},dataCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},bookmarkMain:{flex:1},bookmarkRemove:{paddingStart:10,paddingVertical:4,justifyContent:'center'},dataArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:27,lineHeight:48,textAlign:'right'},dataName:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dataBody:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:18,marginTop:4},dataMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',marginTop:12,textTransform:'uppercase'},inputLabel:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:12},moneyInput:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:20,padding:16,fontSize:24,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:8,outlineStyle:'none'} as any,zakatResult:{borderRadius:24,padding:20,marginTop:12},zakatNo:{color:C.onAccent,fontSize:34,fontFamily:'DMSans_700Bold',marginTop:8},
 profileName:{color:C.onAccent,fontSize:18,fontFamily:'DMSans_700Bold'},profileSub:{color:'#C2DED3',fontSize:10,marginTop:4},privacyHero:{borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',gap:12,...shadow},privacyPoints:{flexDirection:'row',gap:8,marginTop:12},privacyPoint:{flex:1,backgroundColor:C.card,borderRadius:16,paddingVertical:12,alignItems:'center',gap:4,borderWidth:1,borderColor:C.line},privacyPointText:{color:C.ink,fontSize:10,fontFamily:'DMSans_700Bold',textAlign:'center'},preferencePanel:{backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},preferenceHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16},prefIconTile:{width:54,height:54,borderRadius:18,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},choiceRow:{flexDirection:'row',gap:8},choicePill:{minHeight:44,justifyContent:'center',minWidth:44,alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderRadius:12,backgroundColor:C.bg,borderWidth:1,borderColor:C.line},choicePillActive:{backgroundColor:C.accent,borderColor:C.green},choiceText:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},choiceTextActive:{color:C.onAccent},preferenceLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:16,marginBottom:8},settings:{backgroundColor:C.card,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...surface},setting:{minHeight:69,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},settingName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
 locationGate:{flexDirection:'row',gap:16,alignItems:'flex-start',backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...soft},locationGateNarrow:{flexDirection:'column',alignItems:'stretch'},locationGateTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16},locationGateBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},locationActions:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:16},locationActionsNarrow:{flexDirection:'column',alignItems:'stretch'},primarySmall:{backgroundColor:C.accent,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostSmall:{backgroundColor:C.mint,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
 prayerTools:{flexDirection:'row',flexWrap:'wrap',gap:8},prayerToolsTwo:{flexDirection:'row',gap:12,marginBottom:8},prayerToolTwo:{flex:1},prayerTool:{flexGrow:1,flexBasis:'30%',minWidth:220},prayerToolInner:{minHeight:86,flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line},prayerToolText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,flex:1},
 libraryKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.7,marginTop:24},libraryHeading:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:4,marginBottom:12},
 calendarIntro:{backgroundColor:C.deep,borderRadius:24,padding:20},calendarMonth:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:29,marginTop:16},calendarHijri:{color:'#D9D3F3',fontFamily:'DMSans_400Regular',fontSize:12,marginTop:4},weekHead:{flexDirection:'row',marginTop:16},weekLabel:{width:'14.285%',textAlign:'center',color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11},calendarGrid:{flexDirection:'row',flexWrap:'wrap',marginTop:8,backgroundColor:C.white,borderRadius:24,padding:8,borderWidth:1,borderColor:C.line},calendarCell:{width:'14.285%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderRadius:12},calendarToday:{backgroundColor:C.mint,borderWidth:1,borderColor:'#D7CFFF'},gregorianDay:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:15},hijriDay:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:2},calendarLegend:{flexDirection:'row',alignItems:'center',gap:8,marginTop:12},
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
eventCountdown:{backgroundColor:C.mint,borderRadius:11,paddingVertical:4,paddingHorizontal:10,borderWidth:1,borderColor:'#DDD6FF'},
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
 ramadanHero:{borderRadius:28,padding:20,...shadow},ramadanArabic:{color:'#FFE3A4',fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:36,marginTop:16},ramadanTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:27},ramadanSub:{color:'#E3DEF7',fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:8,maxWidth:390},ramadanList:{backgroundColor:C.white,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line},ramadanRow:{minHeight:78,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},ramadanDay:{width:43,height:48,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},ramadanDayNo:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:17},ramadanDayLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:9},ramadanDate:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},fastTime:{alignItems:'flex-end',minWidth:58},fastLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:9,letterSpacing:.7},fastValue:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:10,marginTop:4},
 
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
 audioHeroKicker:{color:'#FFE2A1',fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2},
 audioHeroTitle:{color:C.onAccent,fontFamily:'DMSans_700Bold',fontSize:13,marginTop:4},
 audioHeroMeta:{color:'#C7C2E4',fontSize:10,marginTop:2},
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
 playerPerformer:{color:'#C7C2E4',fontSize:11,marginTop:5},
 trackBadge:{marginTop:16,backgroundColor:'rgba(255,255,255,.14)',borderRadius:12,paddingHorizontal:12,paddingVertical:8},
 trackBadgeText:{color:'#FFE2A1',fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1},
 playerArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:26,lineHeight:46,textAlign:'right',marginTop:24,direction:'rtl'} as any,
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
 readerHeaderActions:{flexDirection:'row',alignItems:'center',gap:8},
 audioEntryInner:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...surface},
 surahNo:{width:40,height:40,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
 surahNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithProgressHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  hadithProgressName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  hadithTrack:{height:6,borderRadius:3,backgroundColor:C.line,marginTop:8,overflow:'hidden'},
  hadithFill:{height:'100%',borderRadius:4,backgroundColor:C.green},
  hadithCollectionCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...surface},
  hadithCollectionTop:{flexDirection:'row',alignItems:'center',gap:12},
  hadithRowTop:{flexDirection:'row',alignItems:'flex-start',gap:12},
  hadithNumber:{width:34,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  hadithNumberText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithNumberLarge:{width:46,height:46,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  hadithDetailHead:{flexDirection:'row',alignItems:'center',gap:12},
  hadithGrades:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:16},
  hadithGrade:{backgroundColor:C.mint,borderRadius:12,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderColor:'#DDD6FF'},
  hadithGradeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},
  hadithGradeSource:{color:C.muted,fontSize:10,marginTop:2},
  hadithNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,gap:12},
  hadithNavBtn:{flex:1,minHeight:44,justifyContent:'center'},
  hadithNavText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:12},
hadithBreadcrumb:{alignItems:'center',marginBottom:14},
hadithCrumbMain:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11,letterSpacing:1.2,textAlign:'center'},
hadithCrumbSub:{color:C.muted,fontSize:11,marginTop:4,textAlign:'center'},
hadithPage:{backgroundColor:C.dark?'#211C2C':'#FFFDF8',borderRadius:10,borderWidth:1.6,borderColor:C.gold,padding:12,...soft},
hadithPageInner:{borderRadius:5,borderWidth:.8,borderColor:C.gold,paddingHorizontal:16,paddingVertical:20},
hadithPageAr:{color:C.ink,fontFamily:'NotoNaskhArabic_400Regular',fontSize:24,lineHeight:46,textAlign:'right',direction:'rtl'} as any,
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
onbWideBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,backgroundColor:C.mint,borderRadius:14,borderWidth:1,borderColor:C.green,paddingVertical:13,marginBottom:12},
onbWideBtnText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:13},
onbChosen:{flexDirection:'row',alignItems:'center',gap:9,backgroundColor:C.mint,borderRadius:14,padding:12,marginBottom:12,borderWidth:1,borderColor:'#DDD6FF'},
onbChosenText:{color:C.ink,fontSize:13,flex:1},
onbNote:{backgroundColor:C.bg,borderRadius:12,padding:12,marginTop:8,borderWidth:1,borderColor:C.line},
onbNoteText:{color:C.muted,fontSize:11,lineHeight:17,marginTop:10},
onbPromise:{flexDirection:'row',gap:12,backgroundColor:C.card,borderRadius:16,padding:14,borderWidth:1,borderColor:C.line,marginBottom:10},
onbPromiseTitle:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13.5},
onbPromiseBody:{color:C.muted,fontSize:11.5,lineHeight:17,marginTop:3},
locationBanner:{flexDirection:'row',alignItems:'center',gap:11,backgroundColor:C.card,borderRadius:14,padding:12,borderWidth:1,borderColor:C.line,marginVertical:8,...surface},
locationBannerIcon:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
locationBannerTitle:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12.5},
sleepHadith:{backgroundColor:C.mint,borderRadius:16,padding:16,borderWidth:1,borderColor:'#DDD6FF',marginBottom:12},
sleepHadithAr:{color:C.ink,fontSize:15,lineHeight:28,textAlign:'center',marginBottom:10,fontFamily:'Amiri_400Regular'},
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
mushafMarkerName:{color:C.gold,fontSize:11,fontFamily:'NotoNaskhArabic_600SemiBold'},
mushafMarkerNum:{color:C.gold,fontSize:11,fontFamily:'NotoNaskhArabic_400Regular'},
mushafConnection:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,paddingVertical:5,paddingHorizontal:10,alignSelf:'center',backgroundColor:C.card,borderRadius:11,borderWidth:1,borderColor:C.line,marginVertical:3},
mushafConnectionRtl:{flexDirection:'row-reverse'},
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
  offlineNote:{backgroundColor:C.mint,borderRadius:16,padding:12,marginBottom:12,borderWidth:1,borderColor:'#DDD6FF'},
  offlineNoteText:{color:C.green,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  tasbihCard:{backgroundColor:C.card,borderRadius:20,padding:16,alignItems:'center',marginTop:16,borderWidth:1,borderColor:C.line,...surface},
  nameOfDayCard:{backgroundColor:C.deep,borderRadius:24,padding:20,alignItems:'center',marginTop:16,...shadow,borderTopColor:depth.edge},
  namesArabicLarge:{color:C.onAccent,fontFamily:'Amiri_400Regular',fontSize:38,marginTop:8,textAlign:'center'},
  namesTransliteration:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:8},
  namesArabic:{color:C.ink,fontFamily:'Amiri_400Regular',fontSize:24,textAlign:'right'},
  nameRow:{flexDirection:'row',alignItems:'flex-start',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line},
  nameNumber:{width:56,alignItems:'flex-end'},
backRow:{marginBottom:4,flexDirection:'row'},
  sectionLink:{paddingVertical: 16,marginVertical:-15,paddingHorizontal:12,marginHorizontal:-12},markLink:{flexDirection:'row',alignItems:'center',gap:5,paddingVertical:16,marginVertical:-15,paddingHorizontal:12,marginHorizontal:-12},stopButton:{width:44,height:44,alignItems:'center',justifyContent:'center'},verseAction:{width:31,height:31,alignItems:'center',justifyContent:'center'},verseActionGlow:{position:'absolute',width:26,height:26,borderRadius:13,backgroundColor:C.mint},verseActionOn:{position:'absolute',width:25,height:25,borderRadius:13,backgroundColor:'#FBF4E3',borderWidth:1,borderColor:'#EADCB8'},searchGo:{width:44,height:44,alignItems:'center',justifyContent:'center'},
pinPage:{flex:1,alignItems:'center',paddingHorizontal:24,paddingTop:4,paddingBottom:24},
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
purityFlow:{backgroundColor:'#F7EDF0',borderColor:'#E8CFD5'},
puritySpotting:{backgroundColor:'#FFF1DD',borderColor:'#F0DCBE'},
purityPure:{backgroundColor:C.mint,borderColor:'#CFC7EE'},
purityToday:{borderColor:C.green,borderWidth:1.5},
dayStepper:{flexDirection:'row',alignItems:'center',gap:12,marginTop:4},

assetRow:{minHeight:69,alignItems:'center',paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},
assetInput:{width:120,backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:14,paddingHorizontal:12,paddingVertical:8,fontSize:15,fontFamily:'DMSans_700Bold',color:C.ink,textAlign:'right',outlineStyle:'none'} as any,
metalRow:{alignItems:'center',minHeight:56,borderBottomWidth:1,borderColor:C.line},
memHero:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',gap:16,...shadow},
memScore:{color:C.onAccent,fontSize:38,fontFamily:'DMSans_700Bold'},
memScoreLabel:{color:C.onAccent,fontSize:13,fontFamily:'DMSans_700Bold'},
memHeroNote:{color:'#C7C2E4',fontSize:10,marginTop:3},
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
memAnswerCard:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:'#CFC7EE'},
memAnswerTitle:{color:C.green,fontSize:11,fontFamily:'DMSans_700Bold',letterSpacing:.6,textTransform:'uppercase'},
memAnswerBody:{color:'#474653',fontSize:12,lineHeight:18,marginTop:6},
memActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8,marginTop:14},
memRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},
memRowMain:{flex:1},
memRowRight:{alignItems:'flex-end',minWidth:56},
memKey:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
memConf:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
memFlag:{backgroundColor:C.yellow,borderRadius:8,paddingHorizontal:7,paddingVertical:2,marginTop:4},
memFlagText:{color:'#7A6320',fontSize:9,fontFamily:'DMSans_700Bold'},
memMiniBar:{height:4,borderRadius:2,backgroundColor:'#E6E2EB',overflow:'hidden',marginTop:6},
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
backupHeroText:{color:'#C7C2E4',fontSize:11,lineHeight:16,marginTop:3},
backupNotice:{backgroundColor:'#FDECEA',borderRadius:16,padding:14,marginTop:12,borderWidth:1,borderColor:'#F3C9C4'},
backupNoticeText:{color:'#8C2F21',fontSize:12,lineHeight:17},
backupNoticeGood:{backgroundColor:C.mint,borderColor:'#CFC7EE'},
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
homeReflectArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:28,lineHeight:46,textAlign:'right',marginTop:12},
homeReflectName:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:40,textAlign:'right',marginTop:14},
homeReflectBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:13.5,lineHeight:21,marginTop:10},
homeReflectFoot:{flexDirection:'row',alignItems:'center',gap:6,marginTop:16,paddingTop:14,borderTopWidth:1,borderTopColor:C.line},
homeReflectFootText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:12,flex:1},
dayToolIcon:{width:52,height:52,borderRadius:26,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDD6FF',marginRight:12}});
  return themeDark ? remapStyles(created) : created;
}
