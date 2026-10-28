function ExploreStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ExploreHome" component={ExploreHome}/><Stack.Screen name="Adhkar" component={AdhkarScreen}/><Stack.Screen name="99 Names" component={NamesScreen}/><Stack.Screen name="Prophet Names" component={ProphetNamesScreen}/><Stack.Screen name="Duas" component={DuasScreen}/><Stack.Screen name="Dua Category" component={DuaCategoryScreen}/><Stack.Screen name="Hadith" component={HadithScreen}/><Stack.Screen name="Hadith Collection" component={HadithCollectionScreen}/><Stack.Screen name="Hadith Detail" component={HadithDetailScreen}/><Stack.Screen name="Hadith Saved" component={HadithSavedScreen}/><Stack.Screen name="Worship Guides" component={GuideDirectory}/><Stack.Screen name="Guide Detail" component={GuideDetail}/><Stack.Screen name="Quran Vocabulary" component={VocabularyScreen}/><Stack.Screen name="Tajweed Study" component={TajweedStudyScreen}/><Stack.Screen name="Pilgrimage" component={PilgrimageScreen}/><Stack.Screen name="Journey" component={JourneyScreen}/><Stack.Screen name="Purity" component={PurityScreen}/></Stack.Navigator>}

/**
 * The prayer tab: keeping the day. The times, the direction, the call, the
 * reminders, the location they are worked out from, and the calendar and
 * fasts that hang on them.
 */
function PrayerStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Prayer" component={PrayerScreen}/><Stack.Screen name="Adhan" component={AdhanScreen}/><Stack.Screen name="Ramadan" component={RamadanScreen}/></Stack.Navigator>}
/** The tools tab: what you calculate, look up, travel for, or record. */
function ToolsStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ToolsHome" component={ToolsHomeScreen}/><Stack.Screen name="Zakat" component={ZakatScreen}/><Stack.Screen name="Mosques" component={DataTool}/><Stack.Screen name="Holy site channels" component={HolyChannelsScreen}/><Stack.Screen name="Women" component={WomenHubScreen}/><Stack.Screen name="Cycle" component={CycleScreen}/><Stack.Screen name="Qada" component={QadaScreen}/><Stack.Screen name="Women Guides" component={WomenGuidesScreen}/><Stack.Screen name="Privacy Lock" component={PrivacyLockScreen}/><Stack.Screen name="Fasting" component={FastingScreen}/><Stack.Screen name="Weekly Summary" component={WeeklySummaryScreen}/><Stack.Screen name="Qibla" component={QiblaScreen}/><Stack.Screen name="Location Setup" component={LocationSetupScreen}/><Stack.Screen name="Notifications" component={NotificationScreen}/><Stack.Screen name="Hijri Calendar" component={HijriCalendarScreen}/><Stack.Screen name="Tasbih" component={TasbihScreen}/><Stack.Screen name="Umrah Packing" component={UmrahPackingScreen}/><Stack.Screen name="Hajj Live" component={HajjLiveScreen}/></Stack.Navigator>}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, Alert, Animated, Easing, Image, ImageBackground, Linking, Platform, Pressable,
  I18nManager, RefreshControl, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput,
  PanResponder, useColorScheme, useWindowDimensions, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  AudioEdition, Chapter, DailyAyah, DailyHadith, DivineName, getAyahEditions, getAyahOfDay, getChapters, getDailyHadith, getDuas, getQuranEditions,
  getGregorianCalendar, getNameOfDay, getNames, getNearbyMosques, getPrayerSnapshot, getQibla, getRamadanCalendar,
  getHizbVerses, getJuzVerses, getPageVerses, getVerses, searchQuran, CalendarDay, Prayer, PrayerSnapshot, QuranEdition, QuranSearchResult, SurahReciter, Verse,
  HajjCountdown, getHajjCountdown,
} from './src/services/api';
import {
  DEFAULT_WORSHIP_SETTINGS, loadDailyContent, loadPrayerCache, loadPrayerCompletion, loadPrayerHistory, loadQuickTasbih, loadStoredLocation, loadWorshipSettings,
  saveDailyContent, savePrayerCache, savePrayerCompletion, saveQuickTasbih, saveStoredLocation, saveWorshipSettings,
  WorshipSettings, loadOnboarding, saveOnboarding, loadLanguage, saveLanguage,
} from './src/services/localState';
import { getNotificationHealth, NotificationHealth, requestNotificationPermission, schedulePrayerNotifications, sendTestNotification } from './src/services/notifications';
import { localizeGuide, WORSHIP_GUIDES, WorshipGuide } from './src/content/worshipGuides';
import { QURAN_TOPICS, QURAN_VOCABULARY, TAJWEED_RULES, topicTitle, topicDescription, topicCategory, tajweedName, tajweedDetail } from './src/content/quranStudy';
import { addSearchHistory, clearSearchHistory, clearSurahCache, deleteNote, HifzStatus, loadBookmarks, loadHifz, loadNotes, loadPlan, loadQuranPreferences, loadReadingPosition, loadRecentSurahs, loadSearchHistory, loadSurahCache, loadSurahCacheIndex, loadVocabularyProgress, QuranBookmark, QuranNote, QuranPreferences, removeSearchHistory, saveHifz, saveNote, savePlan, saveQuranPreferences, saveReadingPosition, saveSurahCache, saveVocabularyProgress, toggleBookmark } from './src/services/quranState';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Clipboard from 'expo-clipboard';
import { getCacheUsage, getCachedJson, setCachedJson } from './src/services/contentCache';
import { AudioSession, AudioSettings, AudioTrackKind, buildQueueForChapter, buildSurahQueue, loadSurahReciters, clearQueue, clearRecentPlays, deletePlaylist, formatClock, getAudioSettings, loadAudioEditions, loadAudioSession, loadAudioSettings, loadPlaylists, loadRecentPlays, nextTrack, playQueue, Playlist, previousTrack, RecentPlay, removeFromQueue, saveAudioSettings, savePlaylist, seekTo, selectQueueItem, setPlaybackRate, setRepeatMode, reciterLabel, stopPlayback, togglePlayback, useAudio } from './src/services/audioService';
import { getHadithPage, getHadith, getLoadedCollections, getNeighbours, whenArabicReady, hadithReference, hadithSourceLabel, HADITH_COLLECTIONS, Hadith, HadithCollectionData, isHadithSaved, loadHadithCollection, loadHadithState, markHadithRead, removeHadithBookmark, searchLoadedCollections, toggleHadithSaved, useHadithState } from './src/services/hadithService';
import { loadDuaCategories, loadDuas } from './src/services/duaService';
import { loadNameLanguage, loadNameOfDay, loadNames, saveNameLanguage } from './src/services/namesService';
import { ARABIC_UI, ARABIC_UI_SEMIBOLD, ensureQuranFont, quranFontFamily as quranFont, QURAN_FONTS, useQuranFont } from './src/services/fonts';
import { CARD, CARD_GAP, RADIUS, SPACE } from './src/design/tokens';
import { completeJourney, clearJourney, journeyMeta, JOURNEY_META, JOURNEY_STEPS, localizeJourneyStep, JourneyKind, JourneyStep, journeyProgress, setStepCount, setStepNote, startJourney, toggleStep, useJourneys, loadJourneys, setJourneyDateLocale } from './src/services/journeyService';
import { HOLY_CHANNELS, openChannel } from './src/services/holyChannels';
import { clearFastDay, FastType, labelForEntry, loadFastingState, missedReasons, MISSED_REASONS, MissedReason, recordFast, readableDate, setFastingOwed, summariseFasting, useFasting, setFastingDateLocale } from './src/services/fastingService';
import { buildWeeklySummary, loadActivity, logHifzReview, logMushafPage, logSurahOpen, logVerseRead, useActivity, setActivityDateLocale } from './src/services/activityService';
import { addDays, addQada, ADVISORY, BISMILLAH_ARABIC, cycleStats, dayKey, daysBetween, deleteCycle, deleteNifas, deleteQada, endCycle, endNifas, EXPLANATIONS, FLOW_LEVELS, formatDay, formatLongDay, GHUSL_FARD, GHUSL_SUNNAH, LIMITS, loadWomensState, logPurity, nifasStats, NIYYAH_ARABIC, NIYYAH_MEANING, NIYYAH_TRANSLITERATION, PurityStatus, QadaReason, QADA_REASONS, qadaStats, recentPurity, REFERENCES, setFlow, setOptedIn, startCycle, startNifas, toggleQada, TUHR_SIGNS, useWomens, WORSHIP_GUIDANCE } from './src/services/womensService';
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
  link: '#0B7891', success: '#3A8A72', heroA: '#2A2849', heroB: '#5146A4',
};
/** The dark palette: the same hues, resting on a deep warm ink. */
const C_DARK: Record<string, string> = {
  bg: '#12111A', card: '#1B1926', ink: '#F1EDE6', muted: '#9C98AB',
  green: '#A79AEA', green2: '#BCAFE6', deep: '#0C0B12', teal: '#7EC0C3',
  mint: '#241F33', blue: '#1F1D2B', peach: '#2A2320', lilac: '#251F33',
  yellow: '#292518', cyan: '#1B2726', gold: '#D8BC80', line: '#2E2A3C',
  coral: '#D08F97', white: '#1B1926',
  chevron: '#7A768C', onAccent: '#F6F2EC', onHero: '#F3DCA8', accent: '#4B3F8F',
  link: '#67C7DE', success: '#6FC5A8', heroA: '#191531', heroB: '#4B3F8F',
};
/** The palette in use. It is swapped in place when the theme changes. */
let C: Record<string, string> = { ...C_LIGHT };
/** True while the dark palette is the one in use. */
let themeDark = false;
let shadow: any = { shadowColor: '#292750', shadowOffset: { width: 0, height: 10 }, shadowOpacity: .11, shadowRadius: 24, elevation: 5 };
let soft: any = { shadowColor: '#3B3568', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .07, shadowRadius: 14, elevation: 2 };

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
  soft = { ...soft, shadowColor: dark ? '#000000' : '#3B3568', shadowOpacity: dark ? 0.4 : 0.07 };
  CARD_GREEN.backgroundColor = C.mint;
  CARD_GOLD.backgroundColor = C.peach;
  s = makeStyles();
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
type QuranPreferencesState={preferences:QuranPreferences;hydrated:boolean;update:(patch:Partial<QuranPreferences>)=>Promise<void>};
const DEFAULT_QURAN_PREFERENCES:QuranPreferences={translationEdition:'en.sahih',translationName:'Sahih International',translationLanguage:'English',scriptEdition:'quran-uthmani',scriptName:'Uthmani',arabicFont:'naskh',fontSize:30,lineHeight:1.9,showTranslation:true,readingMode:'cards'};
const QuranPreferencesContext=createContext<QuranPreferencesState>({preferences:DEFAULT_QURAN_PREFERENCES,hydrated:false,update:async()=>{}});
function QuranPreferencesProvider({children}:{children:React.ReactNode}){const[preferences,setPreferences]=useState(DEFAULT_QURAN_PREFERENCES);const[hydrated,setHydrated]=useState(false);useEffect(()=>{loadQuranPreferences().then(value=>{setPreferences(value);setHydrated(true)})},[]);const update=async(patch:Partial<QuranPreferences>)=>{const next={...preferences,...patch};setPreferences(next);await saveQuranPreferences(next)};return <QuranPreferencesContext.Provider value={{preferences,hydrated,update}}>{children}</QuranPreferencesContext.Provider>}
function useQuranPreferences(){return useContext(QuranPreferencesContext)}
type WorshipSettingsState={settings:WorshipSettings;hydrated:boolean;update:(patch:Partial<WorshipSettings>)=>Promise<void>};
const WorshipSettingsContext=createContext<WorshipSettingsState>({settings:DEFAULT_WORSHIP_SETTINGS,hydrated:false,update:async()=>{}});
function WorshipSettingsProvider({children}:{children:React.ReactNode}){const[settings,setSettings]=useState(DEFAULT_WORSHIP_SETTINGS);const[hydrated,setHydrated]=useState(false);useEffect(()=>{loadWorshipSettings().then(value=>{setSettings(value);setHydrated(true)})},[]);const update=async(patch:Partial<WorshipSettings>)=>{const next={...settings,...patch};setSettings(next);await saveWorshipSettings(next)};return <WorshipSettingsContext.Provider value={{settings,hydrated,update}}>{children}</WorshipSettingsContext.Provider>}
function useWorshipSettings(){return useContext(WorshipSettingsContext)}
async function managedPrayerSnapshot(location:AppLocation,settings:WorshipSettings){try{const snapshot=await getPrayerSnapshot(location.latitude,location.longitude,{method:settings.calculationMethod,school:settings.madhab,timeFormat:settings.timeFormat});await savePrayerCache(location.latitude,location.longitude,settings.calculationMethod,settings.madhab,snapshot);return{snapshot,cached:false}}catch(error){const cached=await loadPrayerCache(location.latitude,location.longitude,settings.calculationMethod,settings.madhab);if(cached)return{snapshot:cached.snapshot,cached:true};throw error}}
type AppLocation = { latitude: number; longitude: number; label: string };
type LocationState = { location: AppLocation | null; locating: boolean; useDevice: () => Promise<void>; useDubai: () => void; setManual: (location:AppLocation)=>void; clear: () => void };
const LocationContext = createContext<LocationState | null>(null);
function LocationProvider({children}:{children:React.ReactNode}) {
  const {rtl}=useLanguage();
  const [location,setLocation]=useState<AppLocation|null>(null); const [locating,setLocating]=useState(false);
  useEffect(()=>{loadStoredLocation().then(saved=>saved&&setLocation(saved))},[]);
  const commit=(next:AppLocation|null)=>{setLocation(next);saveStoredLocation(next).catch(()=>{})};
  const useDubai=()=>commit({latitude:25.2048,longitude:55.2708,label:'Dubai, United Arab Emirates'});
  const useDevice=async()=>{setLocating(true);try{const permission=await Location.requestForegroundPermissionsAsync();if(permission.status!=='granted'){Alert.alert(tx(rtl,'Location permission'),tx(rtl,'Location is used only when you request local prayer and Qibla information. You can select a manual location instead.'));return}const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});const places=await Location.reverseGeocodeAsync(pos.coords);const place=places[0];commit({latitude:pos.coords.latitude,longitude:pos.coords.longitude,label:[place?.city,place?.country].filter(Boolean).join(', ')||'Current location'});}catch(e:any){Alert.alert(tx(rtl,'Location unavailable'),tx(rtl,e.message))}finally{setLocating(false)}};
  return <LocationContext.Provider value={{location,locating,useDevice,useDubai,setManual:commit,clear:()=>commit(null)}}>{children}</LocationContext.Provider>;
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
  'Hajj Live':require('./assets/tool-icons/holy-sites.png'),
  'Madinah Live':require('./assets/tool-icons/holy-sites.png'),
  'Makkah Live':require('./assets/tool-icons/holy-sites.png'),
  'Salah Tracker':require('./assets/tool-icons/prayer-fajr.png'),
};
/** The same icons, re-toned for the dark palette. */
const TOOL_IMAGES_DARK:Record<string,any>={
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
  'Hajj Live':require('./assets/tool-icons/holy-sites-dark.png'),
  'Madinah Live':require('./assets/tool-icons/holy-sites-dark.png'),
  'Makkah Live':require('./assets/tool-icons/holy-sites-dark.png'),
  'Salah Tracker':require('./assets/tool-icons/prayer-fajr-dark.png'),
};
function ToolGraphic({tool,size=58}:{tool:string;size?:number}){const{dark}=useTheme();const image=dark?(TOOL_IMAGES_DARK[tool]||TOOL_IMAGES[tool]):TOOL_IMAGES[tool];const enter=useRef(new Animated.Value(.78)).current;const fade=useRef(new Animated.Value(0)).current;useEffect(()=>{Animated.parallel([Animated.spring(enter,{toValue:1,friction:6,tension:75,useNativeDriver:true}),Animated.timing(fade,{toValue:1,duration:350,useNativeDriver:true})]).start()},[]);return <Animated.View accessibilityElementsHidden style={[s.graphicFrame,{width:size,height:size,opacity:fade,transform:[{scale:enter}]}]}>{image?<Image source={image} resizeMode="contain" style={{width:size-6,height:size-6}}/>:ico('sparkles-outline',size*.48,C.green)}</Animated.View>}
/** Hadith bodies arrive with markup; the card shows them as plain text. */
const stripTags=(value:string)=>value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const plainTajweed=(value:string)=>value.replace(/\[([a-z])(?::\d+)?\[([^\]]*)\]/g,'$2');
function TajweedText({text,style}:{text:string;style?:any}){const parts:React.ReactNode[]=[];const regex=/\[([a-z])(?::\d+)?\[([^\]]*)\]/g;let cursor=0;let match:RegExpExecArray|null;while((match=regex.exec(text))){if(match.index>cursor)parts.push(text.slice(cursor,match.index));const rule=TAJWEED_RULES.find(item=>item.codes.includes(match![1]));parts.push(<Text key={`${match.index}-${match[1]}`} style={{color:rule?.color||C.ink}}>{match[2]}</Text>);cursor=regex.lastIndex}if(cursor<text.length)parts.push(text.slice(cursor));return <Text accessibilityLabel={plainTajweed(text)} style={style}>{parts}</Text>}
function MotionPress({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => Animated.spring(scale, { toValue, friction: 6, tension: 180, useNativeDriver: true }).start();
  return <Animated.View style={[style, { transform: [{ scale }] }]}><Pressable onPress={onPress} onPressIn={() => animate(.96)} onPressOut={() => animate(1)}>{children}</Pressable></Animated.View>;
}

function Page({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions(); const {rtl}=useLanguage();
  const audio=useAudio();
  const playerInset = audio.track ? (Platform.OS==='ios'?96:82) : 0;
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
function AppHeader() {
  const { rtl } = useLanguage();
  const { dark, setMode } = useTheme();
  const navigation = useNavigation<any>();
  const T = (text: string) => tx(rtl, text);
  return <View style={s.appHeader}>
    <View style={s.appHeaderBrand}>
      <Image source={dark ? LOGO_MARK_DARK : LOGO_MARK} resizeMode="contain" style={s.appLogo} />
      <Text style={s.appName} numberOfLines={1}>{T('Deen Companion')}</Text>
    </View>
    <View style={s.appHeaderActions}>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Notifications')}
        onPress={() => navigation.navigate('Prayer', { screen: 'Notifications' })}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        {ico('notifications-outline', 19, dark ? C.white : C.ink)}
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={dark ? T('Show the light theme') : T('Show the dark theme')}
        onPress={() => setMode(dark ? 'light' : 'dark')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        {ico(dark ? 'sunny-outline' : 'moon-outline', 19, dark ? C.white : C.ink)}
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={T('Settings')}
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => [s.iconBtn, s.headerBtn, dark && s.iconBtnDark, pressed && s.press]}>
        {ico('settings-outline', 19, dark ? C.white : C.ink)}
      </Pressable>
    </View>
  </View>;
}

function IconButton({ name, onPress, dark = false, label = 'Go back' }: { name: any; onPress?: () => void; dark?: boolean; label?: string }) { return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed}) => [s.iconBtn, dark && s.iconBtnDark, pressed && s.press]}>{ico(name, 20, dark ? C.white : C.ink)}</Pressable>; }
function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {const{rtl}=useLanguage();return <View style={s.section}><Text style={s.h2}>{title}</Text>{action&&<Pressable onPress={onPress} style={s.sectionLink}><Text style={s.sectionAction}>{rtl?'←  ':''}{action}{rtl?'':'  →'}</Text></Pressable>}</View>}
function LiveBadge({ source }: { source: string }) {
  const { rtl } = useLanguage();
  return <View style={s.liveBadge}><View style={s.liveDot} /><Text style={s.liveText}>{rtl ? `مباشر · ${tx(rtl, source)}` : `LIVE · ${source}`}</Text></View>;
}
function LocationPrompt({compact=false}:{compact?:boolean}){const loc=useAppLocation();const navigation=useNavigation<any>();const{width}=useWindowDimensions();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const manual=()=>{const names=navigation.getState()?.routeNames||[];names.includes('Location Setup')?navigation.navigate('Tools',{screen:'Location Setup'}):navigation.navigate('Tools',{screen:'Location Setup'})};return <View style={[s.locationGate,width<370&&s.locationGateNarrow,compact&&{marginVertical: 12}]}><ToolGraphic tool="Location" size={54}/><View style={{flex:1,width:width<370?'100%':undefined}}><Text style={s.locationGateTitle}>{T('Choose your prayer location')}</Text><Text style={s.locationGateBody}>{T('No location is assumed. Use GPS once, select a city, or enter coordinates manually.')}</Text><View style={[s.locationActions,width<370&&s.locationActionsNarrow]}><Pressable accessibilityLabel={T('Use my current location')} onPress={loc.useDevice} style={s.primarySmall}><Text style={s.primaryText}>{T(loc.locating ? 'Locating…' : 'Use my location')}</Text></Pressable><Pressable accessibilityLabel={T('Choose prayer location manually')} onPress={manual} style={s.ghostSmall}><Text style={s.ghostText}>{T('Choose manually')}</Text></Pressable></View></View></View>}

function SlidingCards<T>({label,items,cardWidth,renderItem}:{label:string;items:T[];cardWidth:number;renderItem:(item:T,index:number)=>React.ReactNode}){
  const ref=useRef<any>(null);const[active,setActive]=useState(0);const{rtl}=useLanguage();const stride=cardWidth+12;
  const go=(index:number)=>{const next=Math.max(0,Math.min(items.length-1,index));setActive(next);ref.current?.scrollTo({x:next*stride,animated:true})};
  return <View accessible accessibilityLabel={`${label}، ${tx(rtl,'card')} ${active+1} ${tx(rtl,'of')} ${items.length}`}>
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} snapToInterval={stride} snapToAlignment="start" decelerationRate="fast" directionalLockEnabled contentContainerStyle={s.sliderContent} style={{direction:'ltr'} as any} onMomentumScrollEnd={(event:any)=>setActive(Math.max(0,Math.min(items.length-1,Math.round(event.nativeEvent.contentOffset.x/stride))))}>
      {items.map((item,index)=><View key={index} style={{width:cardWidth,direction:rtl?'rtl':'ltr'} as any}>{renderItem(item,index)}</View>)}
    </ScrollView>
    <View style={s.sliderControls}><Text style={s.sliderHint}>{active+1} / {items.length}{rtl ? ' · اسحب أو استخدم الأسهم' : ' · Swipe or use arrows'}</Text><View style={s.sliderButtons}><Pressable accessibilityLabel={`${tx(rtl,'Previous')} ${label}`} accessibilityState={{disabled:active===0}} disabled={active===0} onPress={()=>go(active-1)} style={[s.sliderButton,active===0&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-forward':'arrow-back',16,C.ink)}</Pressable><Pressable accessibilityLabel={`${tx(rtl,'Next')} ${label}`} accessibilityState={{disabled:active===items.length-1}} disabled={active===items.length-1} onPress={()=>go(active+1)} style={[s.sliderButton,active===items.length-1&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-back':'arrow-forward',16,C.ink)}</Pressable></View></View>
  </View>
}

type DailyContentCache={ayah:DailyAyah;hadith:DailyHadith;name:DivineName;dua:any};
function useHomeData() {
  const {rtl}=useLanguage(); const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const dateKey=new Date().toISOString().slice(0,10);
  const [snapshot,setSnapshot]=useState<PrayerSnapshot|null>(null); const[ayah,setAyah]=useState<DailyAyah|null>(null); const[hadith,setHadith]=useState<DailyHadith|null>(null); const[name,setName]=useState<DivineName|null>(null); const[dua,setDua]=useState<any>(null); const[cached,setCached]=useState(false); const[error,setError]=useState('');
  const applyDaily=(daily:DailyContentCache)=>{setAyah(daily.ayah);setHadith(daily.hadith);setName(daily.name);setDua(daily.dua)};
  const load=async()=>{if(!location)return;setError('');try{const[p,a,h,n,duas]=await Promise.all([managedPrayerSnapshot(location,settings),getAyahOfDay(),getDailyHadith(),getNameOfDay(),getDuas('morning')]);const daily={ayah:a,hadith:h,name:n,dua:duas[0]};setSnapshot(p.snapshot);setCached(p.cached);applyDaily(daily);await saveDailyContent(dateKey,daily);}catch(e:any){const saved=await loadDailyContent<DailyContentCache>(dateKey);if(saved){applyDaily(saved);setCached(true)}else setError(tx(rtl,e.message||'Please check your connection.'))}};
  useEffect(()=>{loadDailyContent<DailyContentCache>(dateKey).then(saved=>saved&&applyDaily(saved));setSnapshot(null);if(location)load()},[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
  return{snapshot,ayah,hadith,name,dua,location,cached,error,load};
}
function getNext(prayers: Prayer[]) {
  const d = new Date(); const now = d.getHours() * 60 + d.getMinutes();
  return prayers.find(p => { const [h,m] = p.raw.split(':').map(Number); return h*60+m > now; }) || prayers[0];
}
function untilPrayer(prayer?: Prayer, rtl = false) {
  if (!prayer) return '';
  const [h,m] = prayer.raw.split(':').map(Number); const now = new Date(); const target = new Date(); target.setHours(h,m,0,0); if (target < now) target.setDate(target.getDate()+1);
  const mins = Math.max(0, Math.floor((target.getTime()-now.getTime())/60000)); return rtl ? `${Math.floor(mins/60)} س ${mins%60} د` : `${Math.floor(mins/60)}h ${mins%60}m`;
}

const PRAYER_ICONS: Record<string, any> = {
  Fajr: require('./assets/tool-icons/prayer-fajr.png'),
  Dhuhr: require('./assets/tool-icons/prayer-dhuhr.png'),
  Asr: require('./assets/tool-icons/prayer-asr.png'),
  Maghrib: require('./assets/tool-icons/prayer-maghrib.png'),
  Isha: require('./assets/tool-icons/prayer-isha.png'),
};

/** Honour the system setting: when reduce motion is on, everything sits still. */
function useCalmMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((value: any) => { if (alive) setReduced(!!value); });
    const sub: any = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value: any) => setReduced(!!value));
    return () => { alive = false; sub?.remove?.(); };
  }, []);
  return reduced;
}

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
  const hour=new Date().getHours();const still=useCalmMotion();const scrollY=useRef(new Animated.Value(0)).current;const heroShift=scrollY.interpolate({inputRange:[0,300],outputRange:[0,54],extrapolate:'clamp'});const heroZoom=useDrift(30000,1,1.07,still);const sheenShift=useDrift(20000,-0.85,0.85,still);const greeting=T(hour<12?'A purposeful morning':hour<18?'A purposeful afternoon':'A peaceful evening'); const nav = useNavigation<any>(); const locationState=useAppLocation(); const { width } = useWindowDimensions(); const wide = width >= 760; const data = useHomeData(); const next = data.snapshot ? getNext(data.snapshot.prayers) : undefined; const dateKey=new Date().toISOString().slice(0,10); const[completed,setCompleted]=useState<string[]>([]);const[history,setHistory]=useState<Record<string,string[]>>({});const[quickCount,setQuickCount]=useState(0);const tasbih=useTasbih();const[quranPosition,setQuranPosition]=useState<any>(null);const[refreshing,setRefreshing]=useState(false);
  const hydrateLocal=()=>Promise.all([loadPrayerCompletion(dateKey).then(setCompleted),loadPrayerHistory().then(setHistory),loadQuickTasbih().then(setQuickCount),loadReadingPosition().then(setQuranPosition)]);useEffect(()=>{hydrateLocal()},[dateKey]);useFocusEffect(useCallback(()=>{void hydrateLocal()},[]));const togglePrayer=(name:string)=>setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).then(()=>loadPrayerHistory().then(setHistory));return next});const addQuick=async()=>{await tapTasbih();if(Platform.OS!=='web')Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)};const onRefresh=async()=>{setRefreshing(true);await Promise.all([data.load(),hydrateLocal()]);setRefreshing(false)};const weekTotal=Object.entries(history).filter(([key])=>Date.now()-new Date(key).getTime()<7*86400000).reduce((sum,[,items])=>sum+items.length,0);let streak=0;for(let i=0;i<60;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if((history[key]||[]).length>=5)streak++;else if(i>0||completed.length<5)break}
  const tools = [
    {label:'Quran',title:T('Quran'),description:quranPosition?(rtl?`تابع ${quranPosition.surahName} من ${quranPosition.verseKey}`:`Continue ${quranPosition.surahName} at ${quranPosition.verseKey}`):T('Read with verified Arabic and translation'),onPress:()=>nav.navigate('Quran')},
    {label:'Qibla',title:T('Qibla'),description:T('Find the direction of the Kaaba'),onPress:()=>nav.navigate('Tools',{screen:'Qibla'})},
    hour<13?{label:'Morning Adhkar',title:T('Morning Adhkar'),description:T('Begin the day with authentic remembrance'),onPress:()=>nav.navigate('Library',{screen:'Adhkar',params:{initial:'morning'}})}:{label:'Evening Adhkar',title:T('Evening Adhkar'),description:T('Close the day with authentic remembrance'),onPress:()=>nav.navigate('Library',{screen:'Adhkar',params:{initial:'evening'}})},
    {label:'Tasbih',title:T('Tasbih'),description:rtl?`${quickCount} معدودة · محفوظة على جهازك`:`${quickCount} counted · saved privately`,onPress:()=>nav.navigate('Tools',{screen:'Tasbih'})},
    {label:'Audio',title:T('Audio'),description:T('Listen to Quran recitation and Adhan'),onPress:()=>nav.navigate('Quran')},
  ];
  const contentWidth=Math.min(Math.max(width-36,280),980);const essentialCardWidth=wide?Math.min(300,(contentWidth-24)/3):Math.min(318,Math.max(260,width-66));const reflectionCardWidth=wide?Math.min(310,(contentWidth-24)/3):Math.min(318,Math.max(260,width-66));
  const reflections=[{id:'ayah'},{id:'name'},{id:'dua'},{id:'tasbih'}];
  return <Page><Animated.ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:false})} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green}/>}>
    <AppHeader/>
    <View style={s.greeting}><View><Text style={s.salam}>السَّلَامُ عَلَيْكُمْ</Text><Text style={s.greetingTitle}>{greeting}</Text></View></View>
    {!data.location?<LocationPrompt/>:data.error && !data.snapshot ? <ErrorState message={data.error} retry={data.load} /> : <>
      <View style={[s.hero,wide&&s.heroWide]}><Animated.View style={[StyleSheet.absoluteFill,{transform:[{translateY:heroShift},{scale:heroZoom}]}]}><Image source={(dark?SCENE_MOSQUE_DARK:SCENE_MOSQUE)} resizeMode="cover" style={s.heroBg}/></Animated.View>
        <LinearGradient colors={['rgba(30,30,63,.92)','rgba(56,48,103,.54)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} /> <HeroAura still={still}/> <Animated.View pointerEvents="none" style={[s.heroSheen,{transform:[{translateX:Animated.multiply(sheenShift,width)},{skewX:'-16deg'}]}]}><LinearGradient colors={['rgba(255,255,255,0)','rgba(255,255,255,.16)','rgba(255,255,255,0)']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/></Animated.View> 
        <Pressable onPress={locationState.clear} style={s.locationPill}>{ico('location',13,C.onHero)}<Text numberOfLines={1} style={s.locationText}>{T(data.location?.label || '')}</Text></Pressable>
        <Text style={s.hijri}>{(rtl ? data.snapshot?.hijriAr || data.snapshot?.hijri : data.snapshot?.hijri) || T('Loading Hijri date…')} · {new Date().toLocaleDateString(rtl ? 'ar-u-nu-latn' : undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{data.cached ? (rtl ? ' · مخزَّن' : ' · CACHED') : ''}</Text>
        <Text style={s.nextLabel}>{rtl ? 'التالي · ' : 'NEXT · '}{next ? prayerName(rtl, next.name) : '—'}</Text><Text style={s.heroTime}>{next?.time || '—'}</Text>
        <View style={s.heroFooter}><View style={s.countPill}>{ico('time-outline',14,C.white)}<Text style={s.countText}>{rtl ? 'بعد ' : 'in '}{untilPrayer(next, rtl)}</Text></View><Pressable onPress={()=>nav.navigate('Prayer')} style={s.heroCta}><Text style={s.heroCtaText}>{T('Prayer schedule')}</Text>{ico('arrow-forward',15,C.white)}</Pressable></View>
      </View>
      <View style={s.prayerRail}>{data.snapshot?.prayers.filter(p=>p.name!=='Sunrise').map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole="checkbox" accessibilityState={{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.railItem,p.name===next?.name&&s.railItemActive]}><View style={[s.railIcon,checked&&s.railIconDone]}><Image source={PRAYER_ICONS[p.name] || PRAYER_ICONS.Fajr} resizeMode="contain" style={{width:26,height:26,opacity:checked?1:.7}}/>{!!checked && <View style={s.railCheck}>{ico('checkmark',10,C.white)}</View>}</View><Text style={s.railName}>{prayerName(rtl, p.name)}</Text><Text style={s.railTime}>{p.time.replace(' ','\n')}</Text></Pressable>})}</View><View style={s.homeProgress}><View><Text style={s.sourceTitle}>{completed.length}/5 {rtl ? 'صلاة اليوم' : 'prayers today'}</Text><Text style={s.sourceBody}>{rtl ? `${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')} · ${weekTotal}/35 هذا الأسبوع` : `${streak} day streak · ${weekTotal}/35 this week`}</Text></View><View style={s.homeProgressRing}><Text style={s.progressCount}>{completed.length*20}%</Text></View></View>
    </>}
    <Section title={T('For your day')} action={T('All tools')} onPress={()=>nav.navigate('Library')} />
    <SlidingCards label={T('Daily essentials')} items={tools} cardWidth={essentialCardWidth} renderItem={(tool:any)=><MotionPress onPress={tool.onPress} style={{width:'100%'}}><View style={s.essentialSlide}><View style={s.essentialTop}><ToolGraphic tool={tool.label} size={66}/><View style={s.essentialArrow}>{ico('arrow-forward',16,C.green)}</View></View><Text style={s.essentialTitle}>{tool.title}</Text><Text style={s.essentialBody}>{tool.description}</Text></View></MotionPress>}/>
    <Section title={T('Daily reflection')} action={T('Refresh')} onPress={onRefresh}/>
    <SlidingCards label={T('Daily reflections')} items={reflections} cardWidth={reflectionCardWidth} renderItem={(item:any)=>item.id==='ayah'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>{T('AYAH OF THE DAY')}</Text><Text numberOfLines={3} style={s.dailyArabic}>{data.ayah?.arabic||T('Loading verified Quran text…')}</Text>{!rtl && <Text numberOfLines={4} style={s.dailyBody}>{data.ayah?.translation}</Text>}<Text style={s.dataMeta}>{rtl ? data.ayah?.arabicReference || data.ayah?.reference : data.ayah?.reference}</Text></View>:item.id==='name'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>{T('NAME OF ALLAH')}</Text><Text style={s.nameOfDay}>{data.name?.name}</Text>{rtl ? <Text style={s.dailyTitle}>{data.name?.name}</Text> : <Text style={s.dailyTitle}>{data.name?.transliteration}</Text>}{!rtl && <Text style={s.dailyBody}>{data.name?.meaning}</Text>}</View>:item.id==='dua'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>{T('DUA OF THE DAY')}</Text><Text numberOfLines={3} style={s.dailyArabic}>{data.dua?.arabic||T('Loading verified dua…')}</Text>{!rtl && <Text numberOfLines={4} style={s.dailyBody}>{data.dua?.translation}</Text>}</View>:<Pressable accessibilityRole="button" accessibilityLabel={`${T('Quick Tasbih')}: ${quickCount}. ${T('Tap to count')}`} onPress={addQuick} style={[s.reflectionSlide,s.quickTasbih]}><ToolGraphic tool="Tasbih" size={56}/><Text style={s.dailyKicker}>{T('QUICK TASBIH')}</Text><Text style={s.quickCount}>{todayTotal(tasbih)}</Text><Text style={s.dailyBody}>{rtl ? currentPhrase(tasbih).arabic : currentPhrase(tasbih).transliteration}{rtl ? ' · اضغط للعد' : ' · tap to count'}</Text></Pressable>}/>
    <Pressable onPress={()=>nav.navigate('Tools',{screen:'Weekly Summary'})} style={s.weekSummary}><View><Text style={s.weekSummaryTitle}>{T('This week')}</Text><Text style={s.weekSummaryBody}>{rtl ? `${weekTotal} من 35 صلاة مؤداة · ${streak} ${arNoun(streak,'يوم متتابع','يومان متتابعان','أيام متتابعة','يومًا متتابعًا')}` : `${weekTotal} of 35 prayers marked · ${streak} day streak`}</Text></View>{ico('arrow-forward',18,C.white)}</Pressable>
    <Section title={T('Continue reading')} action={T('Open Quran')} onPress={()=>nav.navigate('Quran')} />
    <View style={s.readCard}><Image source={(dark?SCENE_QURAN_DARK:SCENE_QURAN)} resizeMode="cover" style={s.heroBg}/>
      <LinearGradient colors={['rgba(39,34,82,.95)','rgba(76,58,130,.55)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} />
      <Text style={s.readKicker}>{T(quranPosition ? 'CONTINUE READING' : 'FEATURED READING')}</Text><Text style={s.readArabic}>{quranPosition?'۝':'يس'}</Text><Text style={s.readTitle}>{quranPosition ? quranPosition.surahName : T('Surah Ya-Sin')}</Text><Text style={s.readMeta}>{quranPosition ? `${quranPosition.verseKey} · ${rtl ? 'صفحة' : 'Page'} ${quranPosition.page || '—'}` : (rtl ? '83 آية · مكية' : '83 verses · Makkan')}</Text><Pressable onPress={()=>nav.navigate('Quran',{screen:'Reader',params:{chapter:quranPosition?{id:quranPosition.surahId,name_simple:quranPosition.surahName,name_arabic:'',verses_count:0}:{id:36,name_simple:'Ya-Sin',name_arabic:'يس',verses_count:83},focusVerse:quranPosition?.verseKey}})} style={s.whiteButton}><Text style={s.whiteButtonText}>{T(quranPosition ? 'Continue' : 'Read now')}</Text>{ico('arrow-forward',14,C.green)}</Pressable>
    </View>
    <Section title={T('Hadith of the day')} />
    <View style={s.hadithCard}><Text style={s.quote}>“</Text><Text numberOfLines={6} style={s.hadithText}>{data.hadith ? (rtl && data.hadith.arabic ? stripTags(data.hadith.arabic) : data.hadith.text) : T('Loading today’s authenticated hadith…')}</Text><View style={s.hadithFoot}><Text style={s.meta}>{data.hadith ? `${hadithSourceLabel(rtl, data.hadith.collection)} · ${data.hadith.number}` : ''}</Text>{ico('bookmark-outline',20,C.green)}</View></View>
  </Animated.ScrollView></Page>;
}
let CARD_GREEN: any = { backgroundColor: C.mint }; let CARD_GOLD: any = { backgroundColor: C.peach };

/**
 * Tools is what you calculate, look up, travel for, or record. The prayer
 * cluster — times, Qibla, Adhan, reminders, location, the calendar, the
 * fasts, the week — now has its own tab and is not repeated here.
 */
type ToolItem = { title: string; caption: string; route: string; params?: any };

/**
 * Tools is what you work out, keep track of, or watch. Three groups, and
 * every card opens a screen inside this stack so the back button returns
 * here rather than leaving you in another tab.
 */
const TOOL_GROUPS: { label: string; title: string; items: ToolItem[] }[] = [
  { label: 'TRACK', title: 'Trackers and calculators', items: [
    { title: 'Salah Tracker', caption: 'The five prayers, and the run you are on', route: 'Prayer' },
    { title: 'Fasting', caption: 'Ramadan, voluntary and missed fasts', route: 'Fasting' },
    { title: 'Qada Fasts', caption: 'What you owe, and what you have made up', route: 'Qada' },
    { title: 'Zakat', caption: 'Gold, silver, cash and investments', route: 'Zakat' },
    { title: 'Cycle Tracker', caption: 'Period logging and predictions', route: 'Cycle' },
    { title: 'Tasbih', caption: 'A quiet, tactile dhikr counter', route: 'Tasbih' },
    { title: 'Weekly Summary', caption: 'Your past seven days at a glance', route: 'Weekly Summary' },
  ]},
  { label: 'FIND', title: 'Utilities and location', items: [
    { title: 'Qibla', caption: 'Direction to the Ka‘bah', route: 'Qibla' },
    { title: 'Mosques', caption: 'Nearby prayer spaces, with directions', route: 'Mosques' },
    { title: 'Location', caption: 'Automatic GPS, or coordinates you set', route: 'Location Setup' },
    { title: 'Hijri Calendar', caption: 'Islamic dates and the month grid', route: 'Hijri Calendar' },
    { title: 'Prayer Reminders', caption: 'Adhan alerts and their toggles', route: 'Notifications' },
    { title: 'Umrah Resources', caption: 'A packing checklist you can tick off', route: 'Umrah Packing' },
  ]},
  { label: 'WATCH', title: 'Live broadcasts', items: [
    { title: 'Makkah Live', caption: 'Al-Masjid al-Haram, around the clock', route: 'Holy site channels', params: { site: 'Makkah' } },
    { title: 'Madinah Live', caption: 'Al-Masjid an-Nabawi, around the clock', route: 'Holy site channels', params: { site: 'Madinah' } },
    { title: 'Hajj Live', caption: 'The days of Hajj, and the countdown to Arafah', route: 'Hajj Live' },
  ]},
];

/**
 * What to take for Umrah. Grouped in the order you would think of it, not
 * alphabetically, and ticked off on the device rather than on a web page.
 */
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

const hajjStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
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
  actionSub: { color: 'rgba(255,255,255,.7)', fontSize: 11.5, fontFamily: 'DMSans_400Regular', marginTop: 2 },
});

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

        <MotionPress style={st.action} onPress={() => navigation.navigate('Holy site channels', { site: 'Hajj' })}>
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
  const shown = (group: typeof TOOL_GROUPS[number]) => group.items.filter((item) => item.route !== 'Women' || womens.optedIn);
  return <Page><AppHeader/>
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <Text style={s.dataTitle}>{T('Tools')}</Text>
      <Text style={s.dataArabic}>أَدَوَاتٌ لِلْعِبَادَةِ</Text>
      <Text style={s.dataBody}>{T('What you work out, look up, keep track of, or watch — apart from the flow of the day.')}</Text>
      {TOOL_GROUPS.map((group) => <View key={group.label}>
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

function PrayerScreen({navigation}:any) {
  const {rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
  const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const [snap,setSnap]=useState<PrayerSnapshot|null>(null); const [cached,setCached]=useState(false); const [error,setError]=useState(''); const [completed,setCompleted]=useState<string[]>([]);
  const dateKey=new Date().toISOString().slice(0,10); useEffect(()=>{loadPrayerCompletion(dateKey).then(setCompleted)},[dateKey]);
  const togglePrayer=(name:string)=>{if(name==='Sunrise')return;setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).catch(()=>{});return next})};
  const load=async()=>{if(!location)return;setError('');try{const value=await managedPrayerSnapshot(location,settings);setSnap(value.snapshot);setCached(value.cached);if(settings.remindersEnabled)schedulePrayerNotifications(value.snapshot,settings,rtl).catch(()=>{})}catch(e:any){setError(T(e.message))}}; useEffect(()=>{setSnap(null);load()},[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
  const next=snap?getNext(snap.prayers):undefined; const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d;}); const done=completed.length;
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/><View style={s.prayerHeader}><View><Text style={s.prayerOverline}>{cached?T('SAVED ON DEVICE'):T('TODAY')}</Text><Text style={s.prayerTitle}>{T('Prayer times')}</Text></View><ToolGraphic tool="Qibla" size={46}/></View>
    <View style={s.dayStrip}>{days.map((d,i)=><View key={i} style={[s.day,i===0&&s.dayActive]}><Text style={[s.dayName,i===0&&s.dayText]}>{d.toLocaleDateString(rtl?'ar-u-nu-latn':'en',{weekday:'short'})}</Text><Text style={[s.dayNum,i===0&&s.dayText]}>{d.getDate()}</Text></View>)}</View>
    {!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!snap?<Spinner/>:<><LinearGradient colors={[C.heroA,C.green]} style={s.nextCard}><View>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.nextCardLabel}>{T('NEXT PRAYER')}</Text><Text style={s.nextCardName}>{next ? prayerName(rtl, next.name) : ''}</Text><Text style={s.nextCardTime}>{clockTime(rtl, next?.time || '')}</Text><View style={s.countPill}><Text style={s.countText}>{T('Begins in')} {untilPrayer(next, rtl)}</Text></View></View><View style={s.moonOrb}>{ico('moon',42,C.onHero)}</View></LinearGradient>
      <View style={s.prayerProgress}><View style={{flex:1}}><Text style={s.sourceTitle}>{T('Today’s Salah')}</Text><Text style={s.sourceBody}>{rtl?`${done} من 5 صلوات مؤداة`:`${done} of 5 prayers marked complete`}</Text></View><View style={s.progressTrack}><View style={[s.progressFill,{width:`${done*20}%`} as any]}/></View><Text style={s.progressCount}>{done}/5</Text></View>
      <Section title={T('Today’s schedule')} action={rtl?`${PRAYER_METHODS.find(m=>m.id===settings.calculationMethod)?.ar||settings.calculationMethodName} · ${settings.madhab==='hanafi'?'الحنفي':'الشافعي'}`:`${settings.calculationMethodName} · ${T(settings.madhab==='hanafi'?'Hanafi':'Shafi')}`} onPress={()=>navigation.navigate('Settings')} />
      <View style={s.prayerList}>{snap.prayers.map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole={p.name==='Sunrise'?undefined:'checkbox'} accessibilityState={p.name==='Sunrise'?undefined:{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.prayerRow,p.name===next?.name&&s.prayerRowLive]}><View style={[s.prayerSymbol,checked&&s.prayerSymbolDone]}>{ico(checked?'checkmark':'moon-outline',21,checked?C.white:C.green)}</View><View style={{flex:1}}><Text style={s.prayerName}>{prayerName(rtl, p.name)}</Text><Text style={s.meta}>{T(p.name==='Sunrise'?'Solar event':checked?'Completed':p.name===next?.name?'Up next':'Tap to mark complete')}</Text></View><Text style={s.prayerValue}>{clockTime(rtl, p.time)}</Text>{p.name!=='Sunrise'&&ico(checked?'checkmark-circle':'ellipse-outline',18,checked?C.green:C.muted)}</Pressable>})}</View>
      <View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T(cached?'Saved prayer schedule':'Live calculation')}</Text><Text style={s.sourceBody}>{rtl?`${PRAYER_METHODS.find(m=>m.id===settings.calculationMethod)?.ar||snap.method} · ${snap.timezone} · ${settings.timeFormat} ساعة`:`${snap.method} · ${snap.timezone} · ${settings.timeFormat}-hour`}</Text></View></View><Section title={T('Prayer tools')}/><View style={s.prayerTools}>{[['compass-outline','Qibla','Qibla'],['location-outline','Location','Location Setup'],['notifications-outline','Notifications','Notifications'],['volume-high-outline','Adhan','Adhan'],['calendar-outline','Hijri calendar','Hijri Calendar'],['moon-outline','Fasting','Fasting'],['moon-outline','Ramadan','Ramadan'],['stats-chart-outline','Weekly Summary','Weekly Summary']].map(([icon,label,screen]:any,i)=><MotionPress key={label} onPress={()=>navigation.navigate(screen)} style={s.prayerTool}><View style={s.prayerToolInner}><ToolGraphic tool={label} size={54}/><Text style={s.prayerToolText}>{T(label)}</Text></View></MotionPress>)}</View></>}
  </ScrollView></Page>;
}

/**
 * One surah in the list. Memoised, because the search field that filters it
 * lives in the same component: without this, every keystroke redraws the lot.
 */
const SurahRow = React.memo(function SurahRow({ chapter, onOpen }: { chapter: Chapter; onOpen: (chapter: Chapter) => void }) {
  const { rtl } = useLanguage(); const T = (text: string) => tx(rtl, text);
  return <MotionPress onPress={() => onOpen(chapter)} style={s.surahCard}><View style={s.surahNum}><Text style={s.surahNumText}>{chapter.id}</Text></View><View style={{ flex: 1 }}><Text style={s.surahName}>{chapter.name_simple}</Text><Text style={s.meta} numberOfLines={1}>{rtl ? `${chapter.verses_count} آيات` : `${chapter.translated_name?.name} · ${chapter.verses_count} verses`}</Text><Text style={s.surahPlace}>{T(chapter.revelation_place === 'makkah' ? 'Makki' : 'Madani')}</Text></View><Text style={s.surahAr}>{chapter.name_arabic}</Text></MotionPress>;
});
function QuranHome({navigation}:any){const{dark}=useTheme();
 const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);
 const{width}=useWindowDimensions();const wide=width>=760;const[chapters,setChapters]=useState<Chapter[]>([]);const[query,setQuery]=useState('');const[debounced,setDebounced]=useState('');const[expanded,setExpanded]=useState(false);const[error,setError]=useState('');const[position,setPosition]=useState<any>(null);const[bookmarkCount,setBookmarkCount]=useState(0);const[noteCount,setNoteCount]=useState(0);const[recent,setRecent]=useState<number[]>([]);const[plan,setPlanState]=useState<any>(null);const[hifz,setHifzState]=useState<Record<number,HifzStatus>>({});const[preload,setPreload]=useState(getPreloadState());const{preferences}=useQuranPreferences();
 const load=()=>getChapters().then(setChapters).catch(e=>setError(T(e.message)));const hydrate=()=>Promise.all([loadReadingPosition().then(setPosition),loadBookmarks().then(x=>setBookmarkCount(x.length)),loadNotes().then(x=>setNoteCount(x.length)),loadRecentSurahs().then(setRecent),loadPlan().then(setPlanState),loadHifz().then(setHifzState),loadAudioSettings().then(value=>setAudioReciter(value.reciterName))]);useEffect(()=>{load();hydrate();resumeSavedQuranPreload();const unsubscribePreload=subscribePreload(setPreload);const unsubscribeFocus=navigation.addListener('focus',hydrate);return()=>{unsubscribePreload();unsubscribeFocus()}},[navigation]);useEffect(()=>{const id=setTimeout(()=>setDebounced(query.trim()),250);return()=>clearTimeout(id)},[query]);
 const shown=chapters.filter(c=>`${c.id} ${c.name_simple} ${c.name_arabic} ${c.translated_name?.name}`.toLowerCase().includes(debounced.toLowerCase()));const visible=expanded||debounced.length>0?shown:shown.slice(0,30);const openSurah=useCallback((chapter:Chapter)=>navigation.navigate('Reader',{chapter,mode:'both'}),[navigation]);const open=(chapter:Chapter,mode='both',focusVerse?:string)=>navigation.navigate('Reader',{chapter,mode,focusVerse});const featured={id:55,name_simple:'Ar-Rahman',name_arabic:'الرحمن',translated_name:{name:'The Most Merciful'},verses_count:78};const submit=()=>{const ref=query.match(/^(\d{1,3}):(\d{1,3})$/);if(ref){const chapter=chapters.find(c=>c.id===Number(ref[1]));if(chapter)return open(chapter,'both',query)}navigation.navigate('Quran Search',{initialQuery:query})};
 const[audioReciter,setAudioReciter]=useState(T('Choose a reciter'));const memorized=Object.values(hifz).filter(value=>value==='memorized').length;const readActions=[{label:'Quran Search',title:T('Search'),caption:T('Word or verse'),screen:'Quran Search'},{label:'30 Juz',title:T('Juz'),caption:T('30 sections'),screen:'Juz Directory'},{label:'60 Hizb',title:T('Hizb'),caption:T('60 divisions'),screen:'Hizb Directory'}];const studyTools=[{label:'Quran Topics',title:T('Quran topics'),caption:T('Explore faith, life and spirituality'),screen:'Quran Topics'},{label:'Translation Compare',title:T('Tafsir & compare'),caption:T('Study sources and 2–3 translations'),screen:'Tafsir Compare'},{label:'Tajweed',title:T('Tajweed study'),caption:T('Colour rules with normal-text fallback'),screen:'Tajweed Study'},{label:'Quran Vocabulary',title:T('Vocabulary'),caption:T('Review frequent Quranic words'),screen:'Quran Vocabulary'}];const personalTools=[{label:'Bookmarks',title:T('Bookmarks'),value:String(bookmarkCount),caption:T('saved verses'),screen:'Bookmarks'},{label:'Notes',title:T('Notes'),value:String(noteCount),caption:T('private notes'),screen:'Notes'},{label:'Reading Plans',value:plan?`${plan.days}d`:'—',title:T('Reading Plans'),caption:plan?T('active plan'):T('choose a plan'),screen:'Reading Plans'},{label:'Hifz',title:T('Hifz'),value:String(memorized),caption:T('Surahs memorized'),screen:'Hifz'},{label:'Offline Quran',title:T('Offline Quran'),value:`${preload.cached}/114`,caption:preload.running?T('preparing now'):T('available offline'),screen:'Quran Preload'}];const contentWidth=Math.min(Math.max(width-36,280),980);const studyCardWidth=wide?Math.min(302,(contentWidth-24)/3):Math.min(310,Math.max(258,width-68));
 return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><AppHeader/>
 <View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput accessibilityLabel={T('Search the Quran')} value={query} onChangeText={setQuery} onSubmitEditing={submit} returnKeyType="search" style={s.searchInput} placeholder={T('Search Surah, meaning, or 2:255')} placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel={T('Clear Quran search')} onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}</View>
 {position&&<Pressable onPress={()=>{const chapter=chapters.find(c=>c.id===position.surahId);if(chapter)open(chapter,'both',position.verseKey)}} style={s.continueBar}><ToolGraphic tool="Quran Arabic" size={48}/><View style={{flex:1}}><Text style={s.dailyKicker}>{T('CONTINUE READING')}</Text><Text style={s.settingName}>{position.surahName} · {position.verseKey}</Text><Text style={s.meta}>{rtl ? `صفحة ${position.page || '—'} · محفوظ على هذا الجهاز` : `Page ${position.page || '—'} · saved locally`}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>}
 <View style={[s.quranHero,wide&&s.quranHeroWide]}><Image source={(dark?SCENE_QURAN_DARK:SCENE_QURAN)} resizeMode="cover" style={s.heroBg}/><LinearGradient colors={['rgba(41,37,80,.96)','rgba(89,65,139,.52)','transparent']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><Text style={s.quranArabic}>الرَّحْمَٰن</Text><Text style={s.quranHeroTitle}>{T('Read. Listen. Reflect.')}</Text><Text style={s.quranHeroMeta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text><View style={s.heroActions}><Pressable style={s.whiteButton} onPress={()=>open(featured)}><Text style={s.whiteButtonText}>{T('Start reading')}</Text>{ico('play',13,C.green)}</Pressable><Pressable style={s.ghostHeroButton} onPress={()=>navigation.navigate('Quran Audio')}><Text style={s.ghostHeroText}>{T('Listen')}</Text>{ico('headset-outline',13,C.white)}</Pressable></View></View>
 <Section title={T('Read and navigate')}/>
 <View style={s.quranActionGrid}><MotionPress onPress={()=>navigation.navigate('Mushaf Page',{page:position?.page||1,focusVerse:position?.verseKey})} style={s.quranPrimaryWrap}><LinearGradient colors={[C.deep,C.green]} style={s.quranPrimaryAction}><View style={{flex:1}}><Text style={s.readKicker}>{T(position ? 'RESUME YOUR MUSHAF' : 'MUSHAF READER')}</Text><Text style={s.quranPrimaryTitle}>{position ? (rtl ? `صفحة ${position.page || 1}` : `Page ${position.page || 1}`) : T('Open the Mushaf')}</Text><Text style={s.quranPrimaryBody}>{position ? `${position.surahName} · ${position.verseKey}` : T('A calm, page-first reading experience')}</Text></View><ToolGraphic tool="Mushaf Pages" size={76}/></LinearGradient></MotionPress>{readActions.map(item=><MotionPress key={item.label} onPress={()=>navigation.navigate(item.screen)} style={s.quranNavWrap}><View style={s.quranNavCard}><ToolGraphic tool={item.label} size={52}/><Text style={s.quranNavTitle}>{item.title}</Text><Text style={s.quranNavCaption}>{item.caption}</Text></View></MotionPress>)}</View>
 <Section title={T('Listen and recite')}/>
 <MotionPress onPress={()=>navigation.navigate('Downloads',{})} style={{width:'100%'}}><View style={s.audioEntryInner}><ToolGraphic tool="Offline Quran" size={62}/><View style={{flex:1}}><Text style={s.quranStudyTitle}>{T('Downloads')}</Text><Text style={s.quranStudyCaption}>{T('Keep Surah audio and text on this device for offline')}</Text></View>{ico('chevron-forward',18,C.green)}</View></MotionPress>
 <MotionPress onPress={()=>navigation.navigate('Quran Audio')} style={{width:'100%'}}><View style={s.audioEntryInner}><ToolGraphic tool="Recitations" size={62}/><View style={{flex:1}}><Text style={s.quranStudyTitle}>{T('Quran audio')}</Text><Text style={s.quranStudyCaption}>{audioReciter} · {T('verse-by-verse recitation, translation audio and playlists')}</Text></View>{ico('chevron-forward',18,C.green)}</View></MotionPress>

 <Section title={T('Study and understand')}/>
 <SlidingCards label={T('Quran study tools')} items={studyTools} cardWidth={studyCardWidth} renderItem={(item:any)=><MotionPress onPress={()=>navigation.navigate(item.screen)} style={{width:'100%'}}><View style={s.quranStudyCard}><View style={s.quranStudyTop}><ToolGraphic tool={item.label} size={67}/><View style={s.studyNumber}>{ico('arrow-forward',16,C.green)}</View></View><Text style={s.quranStudyTitle}>{item.title}</Text><Text style={s.quranStudyCaption}>{item.caption}</Text></View></MotionPress>}/>
 <Section title={T('Reading preferences')}/>
 <View style={s.quranPreferenceRow}><Pressable onPress={()=>navigation.navigate('Reader Settings')} style={s.quranPreferenceCard}><ToolGraphic tool="Reader Settings" size={50}/><View style={{flex:1}}><Text style={s.settingName}>{T('Script & display')}</Text><Text numberOfLines={1} style={s.meta}>{T(preferences.scriptName)} · {T(QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.short || '')} · {preferences.fontSize}px</Text></View>{ico('arrow-forward',17,C.green)}</Pressable><Pressable onPress={()=>navigation.navigate('Translations')} style={s.quranPreferenceCard}><ToolGraphic tool="Translations" size={50}/><View style={{flex:1}}><Text style={s.settingName}>{T('Translation')}</Text><Text numberOfLines={1} style={s.meta}>{T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text></View>{ico('arrow-forward',17,C.green)}</Pressable></View>
 <Section title={T('Your Quran')}/>
 <View style={s.quranPersonalGrid}>{personalTools.map(item=><MotionPress key={item.label} onPress={()=>navigation.navigate(item.screen)} style={s.quranPersonalWrap}><View style={s.quranPersonalCard}><View style={s.quranPersonalHead}><ToolGraphic tool={item.label} size={45}/><Text style={s.quranPersonalValue}>{item.value}</Text></View><Text style={s.quranPersonalTitle}>{item.title || item.label}</Text><Text numberOfLines={1} style={s.quranPersonalCaption}>{item.caption}</Text></View></MotionPress>)}</View>
 {recent.length>0&&<><Section title={T('Recent Surahs')}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingRight: 16}}>{recent.map(id=>{const c=chapters.find(x=>x.id===id);return c?<Pressable key={id} onPress={()=>open(c)} style={s.recentChip}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.surahAr}>{c.name_arabic}</Text></Pressable>:null})}</ScrollView></>}
 <Section title={T('All surahs')} action={rtl ? `${shown.length} سورة` : `${shown.length} chapters`}/>{error?<ErrorState message={error} retry={load}/>:!chapters.length?<Spinner/>:<View style={s.surahList}>{visible.map(c=><SurahRow key={c.id} chapter={c} onOpen={openSurah}/>)}{visible.length<shown.length&&<Pressable accessibilityRole="button" accessibilityLabel={T('Show all')} onPress={()=>setExpanded(true)} style={s.surahMore}><Text style={s.surahMoreText}>{T('Show all')} · {shown.length}</Text></Pressable>}</View>}</ScrollView></Page>
}
function ReaderScreen({route,navigation}:any){
 const chapter:Chapter=route.params.chapter;const initial=route.params?.mode||'both';const focusVerse=route.params?.focusVerse;const{preferences,update}=useQuranPreferences();const[showArabic,setShowArabic]=useState(initial!=='english');const[showEnglish,setShowEnglish]=useState(initial!=='arabic'&&preferences.showTranslation);const[verses,setVerses]=useState<Verse[]>([]);const[bookmarks,setBookmarks]=useState<QuranBookmark[]>([]);const[error,setError]=useState('');const[cached,setCached]=useState(false);const scrollRef=useRef<any>(null);const didRestore=useRef(false);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const focusAyah=Number(focusVerse?.split(':')[1]||1);const cacheKey=`${chapter.id}:${preferences.scriptEdition}:${preferences.translationEdition}`;
 const load=async()=>{setError('');const local=await loadSurahCache(cacheKey) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=await getVerses(chapter.id,{script:preferences.scriptEdition,translation:preferences.translationEdition});setVerses(fresh);setCached(false);await saveSurahCache(cacheKey,fresh)}catch(e:any){if(!local)setError(T(e.message))}};useEffect(()=>{didRestore.current=false;load();loadBookmarks().then(setBookmarks);void logSurahOpen(chapter.id)},[chapter.id,preferences.scriptEdition,preferences.translationEdition]);useEffect(()=>{if(preferences.readingMode==='mushaf'&&verses.length){const selected=verses.find(v=>v.verse_key===focusVerse)||verses[0];navigation.replace('Mushaf Page',{page:selected.page||1,focusVerse})}},[preferences.readingMode,verses.length]);const toggle=(kind:'ar'|'en')=>{if(kind==='ar'){if(showArabic&&!showEnglish)return;setShowArabic(!showArabic)}else{if(showEnglish&&!showArabic)return;setShowEnglish(!showEnglish)}};
 const bookmark=async(v:Verse)=>setBookmarks(await toggleBookmark({verseKey:v.verse_key,surahId:chapter.id,surahName:chapter.name_simple,arabic:v.text_uthmani,translation:v.translation,savedAt:Date.now()}));const mark=async(v:Verse)=>{await saveReadingPosition({surahId:chapter.id,surahName:chapter.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});void logVerseRead(v.verse_key,chapter.id,v.page);Alert.alert(T('Reading position saved'),`${chapter.name_simple} ${v.verse_key}`)};const share=(v:Verse)=>Share.share({message:`${v.text_uthmani}\n\n${v.translation||''}\n\nQuran ${v.verse_key} · ${preferences.translationName}`});
 return <Page><View style={s.readerBar}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/><View style={{alignItems:'center'}}><Text style={s.readerName}>{chapter.name_simple}</Text><Text style={s.meta}>{cached ? (rtl ? 'متاح دون اتصال · ' : 'Available offline · ') : ''}{chapter.verses_count}{rtl ? ' آية' : ' verses'}</Text></View><View style={s.readerHeaderActions}><Pressable accessibilityLabel={T('Play this Surah')} onPress={()=>{void playSurahFromReader(chapter,rtl)}} style={s.iconBtn}>{ico('play-circle',20,C.ink)}</Pressable><Pressable accessibilityLabel={T('Keep this Surah for offline')} onPress={()=>navigation.navigate('Downloads',{chapterId:chapter.id,chapterName:chapter.name_simple})} style={s.iconBtn}>{ico('download-outline',20,C.ink)}</Pressable><Pressable accessibilityLabel={T('Reader settings')} onPress={()=>navigation.navigate('Reader Settings')} style={s.iconBtn}>{ico('options-outline',20,C.ink)}</Pressable></View></View><View style={s.readerProgress}><View style={[s.preloadFill,{width:`${Math.min(100,focusAyah/Math.max(1,chapter.verses_count)*100)}%`} as any]}/></View><ScrollView ref={scrollRef} contentContainerStyle={s.readerScroll} showsVerticalScrollIndicator={false}><LinearGradient colors={[C.heroA,C.green]} style={s.surahHead}>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.surahHeadAr}>{chapter.name_arabic}</Text><Text style={s.surahHeadEn}>{chapter.translated_name?.name}</Text><Text style={s.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text></LinearGradient><View style={s.readerModes}><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showArabic}} onPress={()=>toggle('ar')} style={[s.readerMode,showArabic&&s.readerModeActive]}><ToolGraphic tool="Arabic Quran" size={42}/><Text style={s.readerModeText}>{T('Arabic')}</Text></Pressable><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showEnglish}} onPress={()=>toggle('en')} style={[s.readerMode,showEnglish&&s.readerModeActive]}><ToolGraphic tool="English meaning" size={42}/><Text style={s.readerModeText}>{T('Translation')}</Text></Pressable></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=>{const saved=bookmarks.some(x=>x.verseKey===v.verse_key);return <View key={v.id} onLayout={event=>{if(focusVerse===v.verse_key&&!didRestore.current){didRestore.current=true;const y=event.nativeEvent.layout.y;setTimeout(()=>scrollRef.current?.scrollTo({y:Math.max(0,y-88),animated:false}),40)}}} style={[s.ayah,preferences.readingMode==='continuous'&&s.ayahContinuous,focusVerse===v.verse_key&&s.ayahSelected]}><View style={s.ayahTop}><Text style={s.ayahNo}>{v.verse_key}</Text><View style={s.ayahActions}><Pressable accessibilityLabel={`${T('Play verse')} ${v.verse_key}`} onPress={()=>{void playFromReader(chapter,v,rtl)}} style={s.verseAction}>{ico('play-circle',24,C.green)}</Pressable><Pressable accessibilityLabel={`${saved?T('Remove bookmark from'):T('Bookmark')} ${T('verse')} ${v.verse_key}`} onPress={()=>bookmark(v)} style={s.verseAction}>{ico(saved?'bookmark':'bookmark-outline',20,C.green)}</Pressable><Pressable accessibilityLabel={`${T('More actions for verse')} ${v.verse_key}`} onPress={()=>navigation.navigate('Ayah Actions',{verse:v,chapter})} style={s.verseAction}>{ico('ellipsis-horizontal-circle-outline',21,C.green)}</Pressable></View></View>{showArabic&&(preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>)}{showEnglish&&<Text style={[s.ayahTranslation,!showArabic&&{borderTopWidth:0,marginTop:8,paddingTop:0}]}>{v.translation}</Text>}<View style={s.ayahFooter}><Text style={s.ayahMeta}>{rtl ? `الجزء ${v.juz} · صفحة ${v.page}` : `Juz ${v.juz} · Page ${v.page}`} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text><Pressable accessibilityLabel={T('Mark your position here')} onPress={()=>mark(v)} style={s.sectionLink}><Text style={s.sectionAction}>{T('Mark position')}</Text></Pressable></View></View>})}</ScrollView></Page>
}
function TranslationScreen({navigation}:any){const{preferences,update}=useQuranPreferences();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[editions,setEditions]=useState<QuranEdition[]>([]);const[query,setQuery]=useState('');const[language,setLanguage]=useState('en');const[error,setError]=useState('');useEffect(()=>{getQuranEditions().then(setEditions).catch(e=>setError(T(e.message)))},[]);const languages=[['en','English'],['ur','Urdu'],['fr','French'],['tr','Turkish'],['id','Indonesian'],['ru','Russian'],['zh','Chinese']];const shown=editions.filter(e=>e.language===language&&`${e.englishName} ${e.name}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title={T('Translation')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Translations" size={76}/><Text style={s.dataTitle}>{T('Choose a translation')}</Text><Text style={s.intro}>{T('Translations explain meaning and do not replace the Arabic Quran. Edition attribution remains visible in the reader.')}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>{languages.map(([code,name])=><ChoicePill key={code} label={name} selected={language===code} onPress={()=>setLanguage(code)}/>)}</ScrollView><View style={[s.search,{marginTop: 12}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T('Search translator or edition')} style={s.searchInput}/></View>{error?<ErrorState message={error}/>:!editions.length?<Spinner/>:<View style={s.settings}>{shown.map(e=><Pressable key={e.identifier} onPress={async()=>{await update({translationEdition:e.identifier,translationName:e.englishName,translationLanguage:languages.find(x=>x[0]===e.language)?.[1]||e.language});navigation.goBack()}} style={s.translationRow}><View style={s.languageBadge}><Text style={s.languageFlag}>{editionFlag(e.language)}</Text><Text style={s.languageBadgeText}>{e.language.toUpperCase()}</Text></View><View style={{flex:1}}><Text style={s.settingName}>{e.englishName}</Text><Text style={s.meta}>{e.name} · {e.identifier}</Text></View>{ico(preferences.translationEdition===e.identifier?'checkmark-circle':'ellipse-outline',20,preferences.translationEdition===e.identifier?C.green:C.muted)}</Pressable>)}</View>}</ScrollView></Page>}

function QuranSearchScreen({route,navigation}:any){const{preferences}=useQuranPreferences();const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[query,setQuery]=useState(route.params?.initialQuery||'');const[results,setResults]=useState<QuranSearchResult[]>([]);const[history,setHistory]=useState<string[]>([]);const[error,setError]=useState('');const[loading,setLoading]=useState(false);useEffect(()=>{loadSearchHistory().then(setHistory);if(route.params?.initialQuery)run(route.params.initialQuery)},[]);const run=async(value=query)=>{const q=value.trim();if(q.length<2)return;setLoading(true);setError('');try{const edition=/[\u0600-\u06ff]/.test(q)?preferences.scriptEdition:preferences.translationEdition;setResults((await searchQuran(q,edition)).slice(0,100));setHistory(await addSearchHistory(q))}catch(e:any){setError(T(e.message))}finally{setLoading(false)}};const open=(r:QuranSearchResult)=>navigation.navigate('Reader',{chapter:{id:r.surahId,name_simple:r.surahName,name_arabic:'',verses_count:0},focusVerse:r.verseKey});return <Page><ToolBar title={T('Quran search')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Quran Search" size={72}/><Text style={s.dataTitle}>{T('Search Arabic or translation')}</Text><View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput autoFocus value={query} onChangeText={setQuery} onSubmitEditing={()=>run()} returnKeyType="search" style={s.searchInput} placeholder={T('Mercy, الصبر, or 2:255')}/><Pressable onPress={()=>run()}>{ico('arrow-forward-circle',22,C.green)}</Pressable></View>{history.length>0&&<><View style={s.historyHead}><Text style={s.preferenceLabel}>{T('RECENT SEARCHES')}</Text><Pressable onPress={async()=>{await clearSearchHistory();setHistory([])}}><Text style={s.sectionAction}>{T('Clear')}</Text></Pressable></View><View style={s.historyWrap}>{history.map(item=><Pressable key={item} onPress={()=>{setQuery(item);run(item)}} onLongPress={async()=>setHistory(await removeSearchHistory(item))} style={s.historyChip}><Text style={s.meta}>{item}</Text></Pressable>)}</View></>}{error?<ErrorState message={error} retry={()=>run()}/>:loading?<Spinner/>:<View>{results.map(r=><Pressable key={`${r.verseKey}-${r.edition}`} onPress={()=>open(r)} style={s.searchResult}><Text style={s.dataMeta}>{r.surahName} · {r.verseKey}</Text><Text numberOfLines={4} style={/[\u0600-\u06ff]/.test(r.text)?s.dataArabic:s.dataBody}>{r.text}</Text><Text style={s.meta}>{r.edition}</Text></Pressable>)}</View>}</ScrollView></Page>}

function BookmarkScreen({navigation}:any){const[items,setItems]=useState<QuranBookmark[]>([]);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadBookmarks().then(setItems));loadBookmarks().then(setItems);return unsub},[navigation]);return <Page><ToolBar title={T('Bookmarks')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Bookmarks" size={72}/><Text style={s.dataTitle}>{rtl?`${items.length} آية محفوظة`:`${items.length} saved verses`}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No bookmarks yet')}</Text><Text style={s.errorText}>{T('Use the bookmark action beside any verse.')}</Text></View>:items.map(item=><Pressable key={item.verseKey} onPress={()=>navigation.navigate('Reader',{chapter:{id:item.surahId,name_simple:item.surahName,name_arabic:'',verses_count:0},focusVerse:item.verseKey})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text numberOfLines={3} style={s.dataArabic}>{item.arabic}</Text><Text numberOfLines={3} style={s.dataBody}>{item.translation}</Text></Pressable>)}</ScrollView></Page>}
function NotesScreen({navigation}:any){const[items,setItems]=useState<QuranNote[]>([]);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadNotes().then(setItems));loadNotes().then(setItems);return unsub},[navigation]);return <Page><ToolBar title={T('Quran notes')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Notes" size={72}/><Text style={s.dataTitle}>{rtl?`${items.length} ملاحظة خاصة`:`${items.length} private notes`}</Text><Text style={s.intro}>{T('Notes remain on this device and are never added to diagnostics.')}</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>{T('No notes yet')}</Text><Text style={s.errorText}>{T('Open verse actions to add a reflection.')}</Text></View>:items.map(item=><Pressable key={item.verseKey} onPress={()=>navigation.navigate('Note Editor',{verse:item,chapter:{id:item.surahId,name_simple:item.surahName}})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text style={s.noteText}>{item.note}</Text><Text style={s.meta}>{new Date(item.updatedAt).toLocaleDateString()}</Text></Pressable>)}</ScrollView></Page>}
function NoteEditor({route,navigation}:any){const verse:Verse=route.params.verse;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const chapter:Chapter=route.params.chapter;const[text,setText]=useState(route.params.verse.note||'');const save=async()=>{if(!text.trim())return;await saveNote({verseKey:verse.verse_key,surahId:chapter.id,surahName:chapter.name_simple,arabic:verse.text_uthmani,translation:verse.translation,note:text.trim(),savedAt:route.params.verse.savedAt||Date.now(),updatedAt:Date.now()});navigation.goBack()};return <Page><ToolBar title={`Note · ${verse.verse_key}`} navigation={navigation}/><View style={s.dataPage}><Text style={s.dataArabic}>{verse.text_uthmani}</Text><TextInput multiline autoFocus value={text} onChangeText={setText} placeholder={T('Write a private reflection…')} style={s.noteInput}/><View style={s.actionRow}><Pressable onPress={save} style={s.primary}><Text style={s.primaryText}>{T('Save note')}</Text></Pressable>{route.params.verse.note&&<Pressable onPress={async()=>{await deleteNote(verse.verse_key);navigation.goBack()}} style={s.dangerButton}><Text style={s.dangerText}>{T('Delete')}</Text></Pressable>}</View></View></Page>}

function ReaderSettingsScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences,update}=useQuranPreferences();const scripts=[['quran-uthmani','Uthmani'],['quran-simple','Imla’i Simple'],['quran-indopak','IndoPak'],['quran-tajweed','Tajweed colour']];return <Page><ToolBar title={T('Reading settings')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Reader Settings" size={72}/><Section title={T('Arabic script')}/><View style={s.choiceGrid}>{scripts.map(([id,name])=><ChoicePill key={id} label={T(name)} selected={preferences.scriptEdition===id} onPress={()=>update({scriptEdition:id,scriptName:name})}/>)}</View><Section title={T('Arabic font')} action={`${preferences.fontSize}px`}/><View style={s.choiceGrid}>{QURAN_FONTS.map(font=><ChoicePill key={font.id} label={T(font.label)} selected={preferences.arabicFont===font.id} onPress={()=>{void ensureQuranFont(font.id);update({arabicFont:font.id})}}/>)}</View><Text style={[s.meta,{marginTop: 8}]}>{T(QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.detail || '')}</Text><View style={s.fontPreview}><Text style={[s.fontPreviewText,{fontFamily:quranFont(preferences.arabicFont),fontSize:Math.min(preferences.fontSize,30)}]}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text></View><Section title={T('Reading mode')}/><View style={s.choiceGrid}><ChoicePill label={T('Ayah cards')} selected={preferences.readingMode==='cards'} onPress={()=>update({readingMode:'cards'})}/><ChoicePill label={T('Continuous')} selected={preferences.readingMode==='continuous'} onPress={()=>update({readingMode:'continuous'})}/><ChoicePill label={T('Mushaf pages')} selected={preferences.readingMode==='mushaf'} onPress={()=>update({readingMode:'mushaf'})}/></View><Section title={T('Arabic size')} action={`${preferences.fontSize}px`}/><View style={s.stepper}><Pressable onPress={()=>update({fontSize:Math.max(18,preferences.fontSize-2)})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={[s.previewArabic,{fontSize:preferences.fontSize}]}>ٱلْقُرْآنُ</Text><Pressable onPress={()=>update({fontSize:Math.min(40,preferences.fontSize+2)})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View><Section title={T('Line spacing')} action={preferences.lineHeight.toFixed(1)}/><View style={s.stepper}><Pressable onPress={()=>update({lineHeight:Math.max(1.4,+(preferences.lineHeight-.1).toFixed(1))})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={s.settingName}>{preferences.lineHeight.toFixed(1)}×</Text><Pressable onPress={()=>update({lineHeight:Math.min(3,+(preferences.lineHeight+.1).toFixed(1))})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View><Pressable onPress={()=>navigation.navigate('Translations')} style={s.referenceRow}><View><Text style={s.settingName}>{T('Translation')}</Text><Text style={s.meta}>{T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable></ScrollView></Page>}

function AyahActionsScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const verse:Verse=route.params.verse;const chapter:Chapter=route.params.chapter;const{preferences}=useQuranPreferences();const actions=[['copy-outline',T('Copy Arabic'),()=>Clipboard.setStringAsync(verse.text_uthmani)],['copy-outline',T('Copy translation'),()=>Clipboard.setStringAsync(verse.translation||'')],['share-outline',T('Share verse'),()=>Share.share({message:`${verse.text_uthmani}\n\n${verse.translation||''}\n\nQuran ${verse.verse_key}`})],['create-outline',T('Add or edit note'),()=>navigation.navigate('Note Editor',{verse,chapter})],['library-outline',T('Tafsir & compare'),()=>navigation.navigate('Tafsir Compare',{verse,chapter})],['bookmark-outline',T('Save reading position'),()=>saveReadingPosition({surahId:chapter.id,surahName:chapter.name_simple,verseKey:verse.verse_key,ayah:Number(verse.verse_key.split(':')[1]),page:verse.page,updatedAt:Date.now()})]];return <Page><ToolBar title={`Verse ${verse.verse_key}`} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.dataArabic}>{verse.text_uthmani}</Text><Text style={s.dataBody}>{verse.translation}</Text><Text style={s.dataMeta}>{T(rtl ? preferences.translationLanguage : preferences.translationName)}</Text><Section title={T('Actions')}/><View style={s.settings}>{actions.map(([icon,label,action]:any)=><Pressable key={label} onPress={async()=>{await action();if(label.startsWith('Copy'))Alert.alert(T('Copied'),label)}} style={s.setting}><MotionGlyph name={icon} size={19}/><Text style={[s.settingName,{flex:1}]}>{label}</Text>{ico('arrow-forward',17,C.muted)}</Pressable>)}</View></ScrollView></Page>}
const editionFlag=(language:string)=>({en:'🇬🇧',fr:'🇫🇷',ur:'🇵🇰',id:'🇮🇩',tr:'🇹🇷',ru:'🇷🇺',zh:'🇨🇳',ar:'◈'} as Record<string,string>)[language]||'◎';
function TafsirCompareScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const verse:Verse=route.params?.verse||{verse_key:'2:255',text_uthmani:''};const[reference,setReference]=useState(verse.verse_key);const{preferences}=useQuranPreferences();const{width}=useWindowDimensions();const[mode,setMode]=useState<'translation'|'tafsir'>('translation');const[editions,setEditions]=useState<QuranEdition[]>([]);const[selected,setSelected]=useState<string[]>([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i));const[rows,setRows]=useState<any[]>([]);const[query,setQuery]=useState('');const[error,setError]=useState('');const loadEditions=()=>getQuranEditions(mode).then(setEditions).catch(e=>setError(T(e.message)));const load=async()=>{setError('');const ids=[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,...selected];const cacheKey=`${reference}:${ids.join(',')}`;const cached=mode==='tafsir'?await getCachedJson<any[]>('tafsir',cacheKey):null;if(cached)setRows(cached);try{const fresh=await getAyahEditions(reference,ids);setRows(fresh);if(mode==='tafsir')await setCachedJson('tafsir',cacheKey,fresh)}catch(e:any){if(!cached)setError(T(e.message))}};useEffect(()=>{loadEditions()},[mode]);useEffect(()=>{load()},[reference,selected.join('|'),preferences.scriptEdition]);useEffect(()=>{if(mode==='tafsir')setSelected(['ar.jalalayn']);else setSelected([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i))},[mode]);const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.length>1?current.filter(x=>x!==id):current:current.length<(mode==='translation'?3:1)?[...current,id]:current);const shown=query.trim().length<2?editions.filter(e=>selected.includes(e.identifier)):editions.filter(e=>`${e.englishName} ${e.name} ${e.language}`.toLowerCase().includes(query.toLowerCase())).slice(0,30);const arabic=rows[0];const compared=rows.slice(1);const columnWidth=width>=760?Math.max(230,(Math.min(width-36,860)-12*(compared.length-1))/Math.max(1,compared.length)):270;return <Page><ToolBar title={T('Tafsir & comparison')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool={mode==='tafsir'?'Tafsir':'Translation Compare'} size={72}/><Text style={s.dataTitle}>{T('QURAN')} {reference}</Text><View style={s.referenceNavigator}><Pressable accessibilityLabel={T('Previous verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${Math.max(1,v-1)}`)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable><TextInput accessibilityLabel={T('Verse reference')} value={reference} onChangeText={setReference} onSubmitEditing={load} style={s.referenceInput}/><Pressable accessibilityLabel={T('Next verse')} onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${v+1}`)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label={T('Translations')} selected={mode==='translation'} onPress={()=>setMode('translation')}/><ChoicePill label={T('Tafsir')} selected={mode==='tafsir'} onPress={()=>setMode('tafsir')}/></View><View style={[s.search,{marginTop: 12}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T(mode === 'translation' ? 'Search language or translator' : 'Search Tafsir source')} style={s.searchInput}/></View><Text style={s.comparisonHelp}>{T(mode === 'translation' ? 'Select two or three editions. Search to discover every live edition.' : 'Select a live Tafsir source and language.')}</Text><View style={s.editionPicker}>{shown.map(e=><Pressable accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(e.identifier)}} key={e.identifier} onPress={()=>toggle(e.identifier)} style={[s.editionChip,selected.includes(e.identifier)&&s.editionChipActive]}><Text style={s.editionFlag}>{editionFlag(e.language)}</Text><View style={{flex:1}}><Text numberOfLines={1} style={s.settingName}>{e.englishName}</Text><Text numberOfLines={1} style={s.meta}>{e.language.toUpperCase()} · {e.identifier}</Text></View>{ico(selected.includes(e.identifier)?'checkmark-circle':'add-circle-outline',19,selected.includes(e.identifier)?C.green:C.muted)}</Pressable>)}</View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<><View style={s.arabicReference}><Text style={s.dataMeta}>{T('ARABIC REFERENCE')} · {arabic?.name}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={arabic?.text||''} style={s.dataArabic}/>:<Text style={s.dataArabic}>{arabic?.text}</Text>}</View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.comparisonColumns}>{compared.map(row=><View key={row.edition} style={[s.compareCard,{width:columnWidth}]}><Text style={s.editionFlag}>{editionFlag(row.language)}</Text>{row.name} · {row.language.toUpperCase()}<Text style={row.language==='ar'?s.dataArabic:s.comparisonText}>{row.text}</Text></View>)}</ScrollView></>}</ScrollView></Page>}

function MushafPageScreen({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const initial=Math.max(1,Math.min(604,Number(route.params?.page)||1));const[page,setPage]=useState(initial);const[input,setInput]=useState(String(initial));const[verses,setVerses]=useState<Verse[]>([]);const[cached,setCached]=useState(false);const[error,setError]=useState('');const key=`page:${page}:${preferences.scriptEdition}:${preferences.translationEdition}`;const load=async()=>{setError('');setVerses([]);const local=await loadSurahCache(key) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=await getPageVerses(page,{script:preferences.scriptEdition,translation:preferences.translationEdition});setVerses(fresh);setCached(false);await saveSurahCache(key,fresh)}catch(e:any){if(!local)setError(T(e.message))}};useEffect(()=>{setInput(String(page));load();void logMushafPage(page)},[page,preferences.scriptEdition,preferences.translationEdition]);const go=(value:number)=>setPage(Math.max(1,Math.min(604,value)));return <Page><ToolBar title={rtl?`صفحة المصحف ${page}`:`Mushaf page ${page}`} navigation={navigation}/><ScrollView contentContainerStyle={s.mushafPage}><View style={s.mushafNav}><Pressable accessibilityLabel={T('Previous Mushaf page')} disabled={page===1} onPress={()=>go(page-1)} style={[s.stepButton,page===1&&{opacity:.3}]}>{ico('arrow-back',20,C.green)}</Pressable><View style={s.pageJump}><Text style={s.dataMeta}>{T(cached ? 'OFFLINE PAGE' : 'MADINAH MUSHAF · 604 PAGES')}</Text><TextInput accessibilityLabel={T('Mushaf page number')} keyboardType="number-pad" value={input} onChangeText={setInput} onSubmitEditing={()=>go(Number(input))} style={s.pageInput}/></View><Pressable accessibilityLabel={T('Next Mushaf page')} disabled={page===604} onPress={()=>go(page+1)} style={[s.stepButton,page===604&&{opacity:.3}]}>{ico('arrow-forward',20,C.green)}</Pressable></View><View style={s.pageProgress}><View style={[s.preloadFill,{width:`${page/604*100}%`} as any]}/></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:<View style={s.mushafSheet}>{verses.map((v,i)=><Pressable key={v.verse_key} onPress={()=>saveReadingPosition({surahId:Number(v.verse_key.split(':')[0]),surahName:v.surah_name||'',verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page,updatedAt:Date.now()})} style={[s.mushafAyah,route.params?.focusVerse===v.verse_key&&s.ayahSelected]}>{i===0||verses[i-1].surah_name!==v.surah_name?<Text style={s.mushafSurah}>{v.surah_name}</Text>:null}{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani} <Text style={s.verseMarker}>۝{v.verse_key.split(':')[1]}</Text></Text>}{preferences.showTranslation&&<Text style={s.mushafTranslation}>{v.translation}</Text>}</Pressable>)}</View>}<View style={s.mushafNav}><Pressable onPress={()=>go(page-1)} disabled={page===1} style={s.secondary}><Text style={s.secondaryText}>{T('Previous')}</Text></Pressable><Text style={s.meta}>{rtl?`الجزء ${verses[0]?.juz||'—'} · صفحة ${page}`:`Juz ${verses[0]?.juz||'—'} · Page ${page}`}</Text><Pressable onPress={()=>go(page+1)} disabled={page===604} style={s.secondary}><Text style={s.secondaryText}>{T('Next')}</Text></Pressable></View></ScrollView></Page>}

function QuranTopicsScreen({navigation}:any){const[category,setCategory]=useState('All');const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[query,setQuery]=useState('');const shown=QURAN_TOPICS.filter(topic=>(category==='All'||topic.category===category)&&`${topic.title} ${topic.description} ${topic.titleAr} ${topic.descriptionAr}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title={T('Quran topics')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Topics" size={74}/><Text style={s.dataTitle}>{T('Explore the Quran by theme')}</Text><Text style={s.intro}>{T('Curated references open the Arabic text alongside your selected translation.')}</Text><View style={s.search}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={T('Search faith, family, patience…')} style={s.searchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8,marginVertical: 12}}>{['All','Faith','Life','Spirituality'].map(item=><ChoicePill key={item} label={T(item)} selected={category===item} onPress={()=>setCategory(item)}/>)}</ScrollView><View style={s.topicGrid}>{shown.map(topic=><MotionPress key={topic.id} onPress={()=>navigation.navigate('Topic Detail',{topic})} style={s.topicWrap}><View style={s.topicCard}><Text style={s.libraryKicker}>{topicCategory(topic,rtl)}</Text><Text style={s.exploreTitle}>{topicTitle(topic,rtl)}</Text><Text style={s.exploreBody}>{topicDescription(topic,rtl)}</Text><Text style={s.dataMeta}>{rtl?`${topic.references.length} آيات`:`${topic.references.length} VERSES`}</Text></View></MotionPress>)}</View></ScrollView></Page>}
function TopicDetailScreen({route,navigation}:any){const topic=route.params.topic;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const load=()=>{setError('');return Promise.all(topic.references.map((ref:string)=>getAyahEditions(ref,[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,preferences.translationEdition]))).then(groups=>setRows(groups.map((items,i)=>({reference:topic.references[i],arabic:items[0],translation:items[1]})))).catch(e=>setError(T(e.message)))};useEffect(()=>{load()},[topic.id,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={topicTitle(topic,rtl)} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.libraryKicker}>{topicCategory(topic,rtl)}</Text><Text style={s.dataTitle}>{topicTitle(topic,rtl)}</Text><Text style={s.intro}>{topicDescription(topic,rtl)}</Text>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:rows.map(row=><Pressable key={row.reference} onPress={()=>{const[surah]=row.reference.split(':').map(Number);navigation.navigate('Reader',{chapter:{id:surah,name_simple:row.arabic?.name||`Surah ${surah}`,name_arabic:'',verses_count:0},focusVerse:row.reference})}} style={s.dataCard}><Text style={s.dataMeta}>{T('QURAN')} {row.reference}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={row.arabic.text} style={s.dataArabic}/>:<Text style={s.dataArabic}>{row.arabic.text}</Text>}<Text style={s.dataBody}>{row.translation.text}</Text><Text style={s.meta}>{row.translation.name}</Text></Pressable>)}</ScrollView></Page>}

function VocabularyScreen({navigation}:any){const[index,setIndex]=useState(0);const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[revealed,setRevealed]=useState(false);const[progress,setProgress]=useState<{reviewed:string[];known:string[]}>({reviewed:[],known:[]});useEffect(()=>{loadVocabularyProgress().then(setProgress)},[]);const word=QURAN_VOCABULARY[index];const mark=async(known:boolean)=>{const value={reviewed:[...new Set([...progress.reviewed,word.id])],known:known?[...new Set([...progress.known,word.id])]:progress.known.filter(id=>id!==word.id)};setProgress(value);await saveVocabularyProgress(value);setRevealed(false);setIndex(valueIndex=>(valueIndex+1)%QURAN_VOCABULARY.length)};return <Page><ToolBar title={T('Quran vocabulary')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Vocabulary" size={74}/><Text style={s.dataTitle}>{T('Frequent Quranic words')}</Text><Text style={s.intro}>{T('A private flashcard review based on high-frequency lemmas and verbs documented by the Quranic Arabic Corpus.')}</Text><View style={s.vocabStats}><Text style={s.settingName}>{rtl?`${progress.known.length} محفوظة`:`${progress.known.length} known`}</Text><Text style={s.meta}>{rtl?`${progress.reviewed.length} مُراجَع · ${QURAN_VOCABULARY.length} بطاقة`:`${progress.reviewed.length} reviewed · ${QURAN_VOCABULARY.length} cards`}</Text></View><Pressable accessibilityLabel={`${word.arabic}. ${revealed?`${word.transliteration}, ${word.meaning}`:T('Tap to reveal meaning')}`} onPress={()=>setRevealed(value=>!value)} style={s.flashcard}><Text style={s.flashIndex}>{index+1} / {QURAN_VOCABULARY.length}</Text><Text style={s.flashArabic}>{word.arabic}</Text>{revealed?<><Text style={s.flashTransliteration}>{word.transliteration}</Text><Text style={s.flashMeaning}>{word.meaning}</Text>{word.root&&<Text style={s.meta}>{T('Root')} · {word.root}</Text>}</>:<Text style={s.flashHint}>{T('Tap to reveal')}</Text>}</Pressable>{revealed&&<View style={s.actionRow}><Pressable onPress={()=>mark(false)} style={s.secondary}><Text style={s.secondaryText}>{T('Review again')}</Text></Pressable><Pressable onPress={()=>mark(true)} style={s.primary}><Text style={s.primaryText}>{T('I know this')}</Text></Pressable></View>}<View style={s.mushafNav}><Pressable onPress={()=>{setRevealed(false);setIndex((index-1+QURAN_VOCABULARY.length)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable><Pressable onPress={()=>Linking.openURL('https://corpus.quran.com/lemmas.jsp')} style={s.sectionLink}><Text style={s.sectionAction}>{T('Frequency source')}</Text></Pressable><Pressable onPress={()=>{setRevealed(false);setIndex((index+1)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable></View></ScrollView></Page>}

function TajweedStudyScreen({navigation}:any){const[reference,setReference]=useState('2:255');const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const[showNormal,setShowNormal]=useState(false);const load=()=>{if(!/^([1-9]|[1-9]\d|1(?:0\d|1[0-4])):([1-9]\d*)$/.test(reference.trim())){setError(T('Enter a verse reference such as 2:255.'));return}setError('');setRows([]);getAyahEditions(reference.trim(),['quran-tajweed','quran-uthmani','en.sahih']).then(setRows).catch(e=>setError(T(e.message)))};useEffect(load,[]);return <Page><ToolBar title={T('Tajweed study')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Tajweed" size={74}/><Text style={s.dataTitle}>{T('Read the rules in colour')}</Text><Text style={s.intro}>{T('Each Tajweed rule is coloured where it applies. Colours are a learning aid and do not replace study with a qualified teacher.')}</Text><View style={s.search}><TextInput value={reference} onChangeText={setReference} onSubmitEditing={load} placeholder="2:255" style={s.searchInput}/><Pressable accessibilityLabel={T('Load this verse')} onPress={load} style={s.searchGo}>{ico('arrow-forward-circle',23,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label={T('Tajweed colour')} selected={!showNormal} onPress={()=>setShowNormal(false)}/><ChoicePill label={T('Normal text')} selected={showNormal} onPress={()=>setShowNormal(true)}/></View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<View style={s.tajweedPractice}><Text style={s.dataMeta}>{T('QURAN')} {reference}</Text>{showNormal?<Text style={s.dataArabic}>{rows[1]?.text}</Text>:<TajweedText text={rows[0]?.text||''} style={s.dataArabic}/>}<Text style={s.dataBody}>{rows[2]?.text}</Text></View>}<Section title={T('Colour legend')}/><View style={s.settings}>{TAJWEED_RULES.map(rule=><View key={rule.name} style={s.tajweedRule}><View style={[s.tajweedSwatch,{backgroundColor:rule.color}]}/><View style={{flex:1}}><Text style={s.settingName}>{tajweedName(rule,rtl)}</Text><Text style={s.meta}>{tajweedDetail(rule,rtl)}</Text></View></View>)}</View></ScrollView></Page>}

function JuzDirectoryScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <Page><ToolBar title={T('30 Juz')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="30 Juz" size={72}/><Text style={s.dataTitle}>{T('Read by Juz')}</Text><View style={s.juzGrid}>{Array.from({length:30},(_,i)=>i+1).map(juz=><Pressable key={juz} onPress={()=>navigation.navigate('Juz Reader',{juz})} style={s.juzCard}><Text style={s.juzNo}>{juz}</Text><Text style={s.meta}>{T('JUZ')}</Text></Pressable>)}</View></ScrollView></Page>}
function JuzReaderScreen({route,navigation}:any){const juz=route.params.juz;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[verses,setVerses]=useState<Verse[]>([]);const[error,setError]=useState('');const load=()=>getJuzVerses(juz,{script:preferences.scriptEdition,translation:preferences.translationEdition}).then(setVerses).catch(e=>setError(T(e.message)));useEffect(()=>{load()},[juz,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={rtl?`الجزء ${juz}`:`Juz ${juz}`} navigation={navigation}/><ScrollView contentContainerStyle={s.readerScroll}>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=><View key={v.id} style={s.ayah}><Text style={s.dataMeta}>{v.surah_name} · {v.verse_key}</Text><Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>{preferences.showTranslation&&<Text style={s.ayahTranslation}>{v.translation}</Text>}</View>)}</ScrollView></Page>}

function HizbDirectoryScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);return <Page><ToolBar title={T('60 Hizb')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="60 Hizb" size={72}/><Text style={s.dataTitle}>{T('Read by Hizb')}</Text><Text style={s.intro}>{T('Each Hizb contains four quarter-Hizb sections.')}</Text><View style={s.juzGrid}>{Array.from({length:60},(_,i)=>i+1).map(hizb=><Pressable key={hizb} onPress={()=>navigation.navigate('Hizb Reader',{hizb})} style={s.juzCard}><Text style={s.juzNo}>{hizb}</Text><Text style={s.meta}>{T('HIZB')}</Text></Pressable>)}</View></ScrollView></Page>}
function HizbReaderScreen({route,navigation}:any){const hizb=route.params.hizb;const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[verses,setVerses]=useState<Verse[]>([]);const[error,setError]=useState('');const load=()=>getHizbVerses(hizb,{script:preferences.scriptEdition,translation:preferences.translationEdition}).then(setVerses).catch(e=>setError(T(e.message)));useEffect(()=>{load()},[hizb,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={rtl?`الحزب ${hizb}`:`Hizb ${hizb}`} navigation={navigation}/><ScrollView contentContainerStyle={s.readerScroll}><View style={s.mushafNav}><Pressable disabled={hizb===1} onPress={()=>navigation.replace('Hizb Reader',{hizb:hizb-1})} style={[s.stepButton,hizb===1&&{opacity:.3}]}>{ico('arrow-back',19,C.green)}</Pressable><Text style={s.dataMeta}>{rtl?`الأرباع ${(hizb-1)*4+1}–${hizb*4}`:`QUARTERS ${(hizb-1)*4+1}–${hizb*4}`}</Text><Pressable disabled={hizb===60} onPress={()=>navigation.replace('Hizb Reader',{hizb:hizb+1})} style={[s.stepButton,hizb===60&&{opacity:.3}]}>{ico('arrow-forward',19,C.green)}</Pressable></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=><View key={v.verse_key} style={s.ayah}><Text style={s.dataMeta}>{v.surah_name} · {v.verse_key} · {rtl?`الربع ${v.hizbQuarter}`:`QUARTER ${v.hizbQuarter}`}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>}{preferences.showTranslation&&<Text style={s.ayahTranslation}>{v.translation}</Text>}</View>)}</ScrollView></Page>}

function QuranPreloadScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[state,setState]=useState(getPreloadState());useEffect(()=>{const unsubscribe=subscribePreload(setState);refreshPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return unsubscribe},[preferences.scriptEdition,preferences.translationEdition]);const start=()=>startQuranPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return <Page><ToolBar title={T('Offline Quran')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Offline Quran" size={76}/><Text style={s.dataTitle}>{T('Prepare for offline reading')}</Text><Text style={s.intro}>{T('Downloads the Arabic script and translation you have selected, one Surah at a time. Preparation continues while you use other screens and prioritizes your current reading Surah.')}</Text><View style={s.preloadScore}><Text style={s.planDays}>{state.cached}</Text><Text style={s.settingName}>{T('of 114 Surahs cached')}</Text><View style={s.preloadTrack}><View style={[s.preloadFill,{width:`${state.cached/114*100}%`} as any]}/></View><Text style={s.meta}>{T(preferences.scriptName)} · {T(rtl ? preferences.translationLanguage : preferences.translationName)}{state.current?(rtl?` · يجهّز سورة ${state.current}`:` · Preparing Surah ${state.current}`):''}</Text>{state.usage&&<Text style={s.cacheUsage}>{rtl?`ذاكرة المصحف ${(state.usage.byNamespace.quran/1048576).toFixed(1)} ميغابايت · الحد ${(state.usage.limits.quran/1000000).toFixed(0)} ميغابايت · الإجمالي ${(state.usage.limits.total/1000000).toFixed(0)} ميغابايت`:`Quran cache ${(state.usage.byNamespace.quran/1048576).toFixed(1)} MB · limit ${(state.usage.limits.quran/1000000).toFixed(0)} MB · total limit ${(state.usage.limits.total/1000000).toFixed(0)} MB`}</Text>}</View>{state.error&&<ErrorState message={state.error} retry={start}/>}<View style={s.actionRow}>{!state.running?<Pressable onPress={start} style={s.primary}><Text style={s.primaryText}>{T(state.cached ? 'Resume preparation' : 'Preload all')}</Text></Pressable>:<Pressable onPress={pauseQuranPreload} style={s.secondary}><Text style={s.secondaryText}>{T('Pause')}</Text></Pressable>}<Pressable onPress={clearPreparedQuran} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear Quran cache')}</Text></Pressable></View><View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Managed low-priority preparation')}</Text><Text style={s.sourceBody}>{T('Cached Surahs open first, already-saved content is skipped, and bounded LRU storage prevents unlimited growth.')}</Text></View></View></ScrollView></Page>}
function ReadingPlansScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[plan,setPlan]=useState<any>(null);useEffect(()=>{loadPlan().then(setPlan)},[]);const start=async(days:number)=>{const next={days,startedAt:Date.now(),completed:[]};await savePlan(next);setPlan(next)};const today=plan?Math.min(plan.days,Math.floor((Date.now()-plan.startedAt)/86400000)+1):0;const toggle=async()=>{const completed=plan.completed.includes(today)?plan.completed.filter((x:number)=>x!==today):[...plan.completed,today];const next={...plan,completed};await savePlan(next);setPlan(next)};return <Page><ToolBar title={T('Reading plans')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Reading Plans" size={72}/><Text style={s.dataTitle}>{T('Complete the Quran')}</Text>{!plan?<><Text style={s.intro}>{T('Choose a private local plan. Progress stays on this device.')}</Text><View style={s.planGrid}>{[30,60,90,120].map(days=><Pressable key={days} onPress={()=>start(days)} style={s.planCard}><Text style={s.planDays}>{days}</Text><Text style={s.settingName}>{T('day plan')}</Text><Text style={s.meta}>{rtl?`${(604/days).toFixed(1)} صفحة يومياً`:`${(604/days).toFixed(1)} pages daily`}</Text></Pressable>)}</View></>:<><View style={s.summaryScore}><View><Text style={s.nextCardLabel}>{T('CURRENT DAY')}</Text><Text style={s.zakatNo}>{today} / {plan.days}</Text></View><View><Text style={s.nextCardLabel}>{T('COMPLETED')}</Text><Text style={s.zakatNo}>{plan.completed.length}</Text></View></View><Pressable onPress={toggle} style={s.planToday}><Text style={s.settingName}>{rtl?`قراءة اليوم ${today}`:`Day ${today} reading`}</Text>{ico(plan.completed.includes(today)?'checkmark-circle':'ellipse-outline',28,C.green)}</Pressable><Pressable onPress={async()=>{await savePlan(null);setPlan(null)}} style={s.dangerButton}><Text style={s.dangerText}>{T('End current plan')}</Text></Pressable></>}</ScrollView></Page>}
function HifzScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const[chapters,setChapters]=useState<Chapter[]>([]);const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[filter,setFilter]=useState<'all'|HifzStatus>('all');useEffect(()=>{getChapters().then(setChapters);loadHifz().then(setStatus)},[]);const cycle=async(id:number)=>{const current=status[id]||'not-started';const next:HifzStatus=current==='not-started'?'revising':current==='revising'?'memorized':'not-started';const value={...status,[id]:next};setStatus(value);await saveHifz(value)};const shown=chapters.filter(c=>filter==='all'||(status[c.id]||'not-started')===filter);const memorized=Object.values(status).filter(x=>x==='memorized').length;return <Page><ToolBar title={T('Hifz tracker')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={72}/><Text style={s.dataTitle}>{rtl?`حفظت ${memorized} من 114`:`${memorized} of 114 memorized`}</Text><Pressable onPress={()=>navigation.navigate('Hifz Practice')} style={s.practiceLaunch}><View><Text style={s.settingName}>{T('Hide-and-peek recall')}</Text><Text style={s.meta}>{T('Test a verse from your revising or memorized Surahs')}</Text></View>{ico('play-circle',28,C.green)}</Pressable><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>{(['all','not-started','revising','memorized'] as const).map(value=><ChoicePill key={value} label={T(value.replace('-',' '))} selected={filter===value} onPress={()=>setFilter(value)}/>)}</ScrollView><View style={{height:13}}/><View style={s.settings}>{shown.map(c=><Pressable key={c.id} onPress={()=>cycle(c.id)} style={s.translationRow}><View style={s.surahNum}><Text style={s.surahNumText}>{c.id}</Text></View><View style={{flex:1}}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.meta}>{rtl?`${c.verses_count} آية`:`${c.verses_count} verses`}</Text></View><Text style={s.hifzStatus}>{T((status[c.id]||'not-started').replace('-',' '))}</Text></Pressable>)}</View></ScrollView></Page>}

function HifzPracticeScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{preferences}=useQuranPreferences();const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[verses,setVerses]=useState<Verse[]>([]);const[index,setIndex]=useState(0);const[revealed,setRevealed]=useState(false);const[error,setError]=useState('');const[surah,setSurah]=useState(112);const load=async()=>{setError('');try{const saved=await loadHifz();setStatus(saved);const candidates=Object.keys(saved).map(Number).filter(id=>saved[id]!=='not-started');const id=candidates.length?candidates[Math.floor(Math.random()*candidates.length)]:112;setSurah(id);setVerses(await getVerses(id,{script:preferences.scriptEdition,translation:preferences.translationEdition}));setIndex(0);setRevealed(false)}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[]);const next=()=>{setRevealed(false);setIndex(value=>value+1<verses.length?value+1:0)};const mark=async(value:HifzStatus)=>{const updated={...status,[surah]:value};setStatus(updated);await saveHifz(updated);void logHifzReview();next()};const verse=verses[index];return <Page><ToolBar title={T('Hifz recall practice')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={72}/><Text style={s.dataTitle}>{T('Recall before you reveal')}</Text><Text style={s.intro}>{T('Read the meaning and reference, recite from memory, then reveal the verified Arabic text.')}</Text>{error?<ErrorState message={error} retry={load}/>:!verse?<Spinner/>:<><View style={s.recallCard}><Text style={s.dataMeta}>{rtl?`القرآن ${verse.verse_key} · الآية ${index+1} من ${verses.length}`:`QURAN ${verse.verse_key} · VERSE ${index+1} OF ${verses.length}`}</Text><Text style={s.recallPrompt}>{verse.translation}</Text>{revealed?(preferences.scriptEdition==='quran-tajweed'?<TajweedText text={verse.text_uthmani} style={s.recallArabic}/>:<Text style={s.recallArabic}>{verse.text_uthmani}</Text>):<Pressable accessibilityLabel={T('Reveal Arabic verse')} onPress={()=>setRevealed(true)} style={s.revealArea}>{ico('eye-outline',27,C.green)}<Text style={s.sectionAction}>{T('Reveal Arabic')}</Text></Pressable>}</View>{revealed&&<View style={s.actionRow}><Pressable onPress={()=>mark('revising')} style={s.secondary}><Text style={s.secondaryText}>{T('Review again')}</Text></Pressable><Pressable onPress={()=>mark('memorized')} style={s.primary}><Text style={s.primaryText}>{T('Remembered')}</Text></Pressable><Pressable onPress={next} style={s.secondary}><Text style={s.secondaryText}>{T('Skip')}</Text></Pressable></View>}</>}</ScrollView></Page>}

function QuranStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="QuranHome" component={QuranHome}/><Stack.Screen name="Downloads" component={DownloadsScreen}/><Stack.Screen name="Reader" component={ReaderScreen}/><Stack.Screen name="Translations" component={TranslationScreen}/><Stack.Screen name="Quran Search" component={QuranSearchScreen}/><Stack.Screen name="Bookmarks" component={BookmarkScreen}/><Stack.Screen name="Notes" component={NotesScreen}/><Stack.Screen name="Note Editor" component={NoteEditor}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}/><Stack.Screen name="Ayah Actions" component={AyahActionsScreen}/><Stack.Screen name="Tafsir Compare" component={TafsirCompareScreen}/><Stack.Screen name="Mushaf Page" component={MushafPageScreen}/><Stack.Screen name="Quran Topics" component={QuranTopicsScreen}/><Stack.Screen name="Topic Detail" component={TopicDetailScreen}/><Stack.Screen name="Juz Directory" component={JuzDirectoryScreen}/><Stack.Screen name="Juz Reader" component={JuzReaderScreen}/><Stack.Screen name="Hizb Directory" component={HizbDirectoryScreen}/><Stack.Screen name="Hizb Reader" component={HizbReaderScreen}/><Stack.Screen name="Reading Plans" component={ReadingPlansScreen}/><Stack.Screen name="Quran Preload" component={QuranPreloadScreen}/><Stack.Screen name="Hifz" component={HifzScreen}/><Stack.Screen name="Hifz Practice" component={HifzPracticeScreen}/><Stack.Screen name="Quran Audio" component={AudioCenterScreen}/><Stack.Screen name="Audio Player" component={AudioPlayerScreen}/></Stack.Navigator>}

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
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const completed = await tapTasbih();
    if (completed) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
  hajj: 'Hajj and Umrah',
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
    url,
  }));
  const keepText = () => run('text', () => downloadSurahText({
    chapterId: focusId as number,
    chapterName: focusName,
    script: preferences.scriptEdition === 'quran-indopak' ? 'quran-uthmani' : preferences.scriptEdition,
    translation: preferences.translationEdition,
    label: `${preferences.scriptName} · ${preferences.translationName}`,
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
  const morning = category === 'morning';
  return <Page><ToolBar title={T('Daily Adhkar')} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool={morning ? 'Morning Adhkar' : 'Evening Adhkar'} size={72} />
      <Text style={s.dataTitle}>{morning ? 'Morning remembrance' : 'Evening remembrance'}</Text>
      <View style={s.choiceRow}>
        <ChoicePill label={T('Morning')} selected={morning} onPress={() => setCategory('morning')} />
        <ChoicePill label={T('Evening')} selected={!morning} onPress={() => setCategory('evening')} />
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
      <Pressable accessibilityRole="button" accessibilityLabel={T('Holy site channels')} onPress={() => navigation.navigate('Holy site channels')} style={[s.settings, s.dataSourceRow]}>
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

function JourneyScreen({ route, navigation }: any) {
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
function LocationSetupScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const loc=useAppLocation();const[label,setLabel]=useState('');const[lat,setLat]=useState('');const[lng,setLng]=useState('');const save=()=>{const latitude=Number(lat),longitude=Number(lng);if(!label.trim()||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){Alert.alert(T('Check location'),T('Enter a label and valid latitude/longitude values.'));return}loc.setManual({label:label.trim(),latitude,longitude});navigation.navigate('Prayer')};return <Page><ToolBar title={T('Location setup')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Location" size={76}/><Text style={s.dataTitle}>{T('Choose explicitly')}</Text><Text style={s.intro}>{T('Prayer, Qibla, Ramadan, and mosque tools share this saved location. It stays on this device.')}</Text><Pressable onPress={loc.useDevice} style={s.primary}><Text style={s.primaryText}>{loc.locating?T('Locating…'):T('Use current GPS location')}</Text></Pressable><Section title={T('City shortcuts')}/><View style={s.cityGrid}>{CITY_PRESETS.map(city=><Pressable key={city.label} onPress={()=>{loc.setManual({...city,label:rtl?city.ar:city.label});navigation.navigate('Prayer')}} style={[s.cityCard,loc.location?.label===city.label&&s.cityCardActive]}><Text style={s.cityName}>{rtl ? city.ar : city.label}</Text><Text style={s.meta}>{city.latitude.toFixed(3)}, {city.longitude.toFixed(3)}</Text></Pressable>)}</View><Section title={T('Manual coordinates')}/><View style={s.formCard}><Text style={s.inputLabel}>{T('LOCATION LABEL')}</Text><TextInput value={label} onChangeText={setLabel} placeholder={T('e.g. Home, Abu Dhabi')} style={s.textField}/><View style={s.fieldRow}><View style={{flex:1}}><Text style={s.inputLabel}>{T('LATITUDE')}</Text><TextInput value={lat} onChangeText={setLat} keyboardType="numbers-and-punctuation" placeholder="24.4539" style={s.textField}/></View><View style={{flex:1}}><Text style={s.inputLabel}>{T('LONGITUDE')}</Text><TextInput value={lng} onChangeText={setLng} keyboardType="numbers-and-punctuation" placeholder="54.3773" style={s.textField}/></View></View><Pressable onPress={save} style={s.primary}><Text style={s.primaryText}>{T('Save manual location')}</Text></Pressable></View>{loc.location&&<Pressable onPress={loc.clear} style={s.dangerButton}><Text style={s.dangerText}>{T('Clear saved location')}</Text></Pressable>}</ScrollView></Page>}

function NotificationScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{location}=useAppLocation();const{settings,update}=useWorshipSettings();const[health,setHealth]=useState<NotificationHealth>('undetermined');const[working,setWorking]=useState(false);useEffect(()=>{getNotificationHealth().then(setHealth)},[]);const permission=async()=>setHealth(await requestNotificationPermission(rtl));const sync=async()=>{if(!location)return Alert.alert(T('Location needed'),T('Choose a prayer location before scheduling reminders.'));setWorking(true);try{const value=await managedPrayerSnapshot(location,settings);const result=await schedulePrayerNotifications(value.snapshot,settings,rtl);Alert.alert(T(result.unsupported?'Saved for installed app':'Reminders updated'),T(result.unsupported?'Web browsers are not scheduled here. Your choices are saved and will apply in the installed iOS or Android app.':rtl?`تمت جدولة ${result.scheduled} تنبيهًا.`:`${result.scheduled} notifications scheduled.`))}catch(e:any){Alert.alert(T('Could not schedule'),T(e.message))}finally{setWorking(false)}};const togglePrayer=(name:string)=>update({prayerReminders:{...settings.prayerReminders,[name]:!settings.prayerReminders[name]}});return <Page><ToolBar title={T('Prayer reminders')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Notifications" size={76}/><Text style={s.dataTitle}>{T('Gentle, local reminders')}</Text><Text style={s.intro}>{T('Permission and scheduling happen on your device. No notification profile is sent to us.')}</Text><View style={s.healthCard}><View style={[s.healthDot,{backgroundColor:health==='granted'?C.success:health==='denied'?C.coral:C.gold}]}/><View style={{flex:1}}><Text style={s.sourceTitle}>{T('Permission')}: {T(health)}</Text><Text style={s.sourceBody}>{health==='unsupported'?T('System scheduling is available in the installed mobile app.'):'You remain in control through system settings.'}</Text></View>{health!=='granted'&&health!=='unsupported'&&<Pressable onPress={permission} style={s.ghostSmall}><Text style={s.ghostText}>{T('Allow')}</Text></Pressable>}</View><View style={s.settings}><View style={s.setting}><MotionGlyph name="notifications-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Prayer reminders')}</Text><Text style={s.meta}>{T('Master schedule switch')}</Text></View><View style={{direction:'ltr'} as any}><Switch value={settings.remindersEnabled} onValueChange={v=>update({remindersEnabled:v})} trackColor={{true:C.green}}/></View></View></View><Text style={s.preferenceLabel}>{T('REMIND ME BEFORE PRAYER')}</Text><View style={s.choiceRow}>{[0,5,10,15,30].map(value=><ChoicePill key={value} label={value?(rtl?`${value} دقيقة`:`${value} min`):T('At time')} selected={settings.reminderOffset===value} onPress={()=>update({reminderOffset:value})}/>)}</View><Section title={T('Per-prayer reminders')}/><View style={s.settings}>{['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(name=><View key={name} style={s.setting}><ToolGraphic tool="Notifications" size={42}/><Text style={[s.settingName,{flex:1}]}>{prayerName(rtl, name)}</Text><View style={{direction:'ltr'} as any}><Switch value={settings.prayerReminders[name]} onValueChange={()=>togglePrayer(name)} trackColor={{true:C.green}}/></View></View>)}</View><Section title={T('Quran reminder')}/><View style={s.settings}><View style={s.setting}><ToolGraphic tool="Quran" size={42}/><View style={{flex:1}}><Text style={s.settingName}>{T('Daily reading reminder')}</Text><Text style={s.meta}>{settings.quranReminderTime}</Text></View><View style={{direction:'ltr'} as any}><Switch value={settings.quranReminderEnabled} onValueChange={v=>update({quranReminderEnabled:v})} trackColor={{true:C.green}}/></View></View></View><Text style={s.preferenceLabel}>{T('READING REMINDER TIME')}</Text><View style={s.choiceRow}>{['06:30','12:30','20:00','22:00'].map(time=><ChoicePill key={time} label={time} selected={settings.quranReminderTime===time} onPress={()=>update({quranReminderTime:time})}/>)}</View><View style={s.actionRow}><Pressable onPress={sync} style={s.primary}><Text style={s.primaryText}>{working?T('Scheduling…'):T('Save & reschedule')}</Text></Pressable><Pressable onPress={()=>sendTestNotification(rtl).catch(e=>Alert.alert(T('Test unavailable'),T(e.message)))} style={s.secondary}><Text style={s.secondaryText}>{T('Test notification')}</Text></Pressable></View></ScrollView></Page>}

const ADHAN_TRACKS=[
 {id:'Makkah',titleAr:'أذان مكة',detailAr:'مضمّن للعمل دون اتصال · الملك العام',title:'Beautiful Adhan',detail:'Bundled offline · Public domain',source:require('./assets/audio/adhan-doha-public-domain.mp3')},
 {id:'Doha Fajr',titleAr:'أذان فجر الدوحة',detailAr:'الملك العام · أرشيف الإنترنت',title:'Doha Fajr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_01_Fajr_Adhan.mp3'},
 {id:'Doha Classic',titleAr:'أذان ظهر الدوحة',detailAr:'الملك العام · أرشيف الإنترنت',title:'Doha Dhuhr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_02_Dhuhr_Adhan.mp3'}
];
function AdhanScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{settings,update}=useWorshipSettings();const selected=ADHAN_TRACKS.find(x=>x.id===settings.adhanReciter)||ADHAN_TRACKS[0];const player=useAudioPlayer(selected.source);const status=useAudioPlayerStatus(player);const toggle=()=>status.playing?player.pause():player.play();useEffect(()=>()=>{player.pause()},[player]);return <Page><ToolBar title={T('Adhan')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Adhan" size={82}/><Text style={s.dataTitle}>{T('Choose an Adhan')}</Text><Text style={s.intro}>{T('Preview a recording and choose which prayers may use Adhan. The bundled selection works without a network connection.')}</Text><View style={s.audioPreview}><Pressable accessibilityLabel={status.playing?'Pause Adhan preview':'Play Adhan preview'} onPress={toggle} style={s.audioPlay}>{ico(status.playing?'pause':'play',25,C.white)}</Pressable><View style={{flex:1}}><Text style={s.profileName}>{rtl?selected.titleAr||selected.title:selected.title}</Text><Text style={s.profileSub}>{rtl?selected.detailAr||selected.detail:selected.detail}</Text></View><Pressable accessibilityLabel={T('Stop Adhan preview')} onPress={()=>{player.seekTo(0);player.pause()}} style={s.stopButton}>{ico('stop-circle-outline',26,C.white)}</Pressable></View><Section title={T('Recordings')}/><View style={s.settings}>{ADHAN_TRACKS.map(track=><Pressable accessibilityRole="radio" accessibilityState={{selected:track.id===selected.id}} key={track.id} onPress={()=>update({adhanReciter:track.id})} style={s.setting}><ToolGraphic tool="Adhan" size={44}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?track.titleAr||track.title:track.title}</Text><Text style={s.meta}>{rtl?track.detailAr||track.detail:track.detail}</Text></View>{ico(track.id===selected.id?'checkmark-circle':'ellipse-outline',20,track.id===selected.id?C.green:C.muted)}</Pressable>)}</View><Section title={T('Use Adhan for')}/><View style={s.settings}>{['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(name=><View key={name} style={s.setting}><Text style={[s.settingName,{flex:1}]}>{prayerName(rtl, name)}</Text><View style={{direction:'ltr'} as any}><Switch value={settings.adhanEnabled[name]} onValueChange={v=>update({adhanEnabled:{...settings.adhanEnabled,[name]:v}})} trackColor={{true:C.green}}/></View></View>)}</View><View style={s.sourceCard}>{ico('information-circle-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Audio rights')}</Text><Text style={s.sourceBody}>{T('Bundled and streamed Doha recordings: Internet Archive Public Domain Mark 1.0.')}</Text></View></View></ScrollView></Page>}

function GuideDirectory({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const group=route?.params?.group;const guides=group==='ramadan'?WORSHIP_GUIDES.filter((guide)=>RAMADAN_GUIDE_IDS.includes(guide.id)):WORSHIP_GUIDES;return <Page><ToolBar title={group==='ramadan'?T('Ramadan and Eid'):T('Worship guides')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Worship guides" size={78}/><Text style={s.dataTitle}>{T('Learn with references')}</Text><Text style={s.intro}>{T('Concise educational overviews with transparent Qur’an and Hadith references. Detailed rulings should be learned from a qualified local scholar.')}</Text><View style={s.guideGrid}>{guides.map(guide=>{const g=localizeGuide(guide,rtl);return <MotionPress key={guide.id} onPress={()=>navigation.navigate('Guide Detail',{guide})} style={s.guideCard}><View style={s.guideCardInner}><ToolGraphic tool={guide.id} size={62}/><Text style={s.exploreTitle}>{g.title}</Text><Text style={s.exploreBody}>{g.subtitle}</Text><View style={s.exploreArrow}>{ico('arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></ScrollView></Page>}
function GuideDetail({route,navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const guide:WorshipGuide=localizeGuide(route.params.guide,rtl);return <Page><ToolBar title={guide.title} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool={guide.id} size={82}/><Text style={s.dataTitle}>{guide.subtitle}</Text>{guide.arabic&&<Text style={s.guideArabic}>{guide.arabic}</Text>}<Text style={s.intro}>{guide.introduction}</Text><Section title={T('Step by step')}/><View style={s.settings}>{guide.steps.map((step,i)=><View key={step} style={s.guideStep}><View style={s.stepNo}><Text style={s.stepNoText}>{i+1}</Text></View><Text style={s.guideStepText}>{step}</Text></View>)}</View>{guide.note&&<View style={s.guideNote}><Text style={s.sourceTitle}>{T('Important note')}</Text><Text style={s.sourceBody}>{guide.note}</Text></View>}<Section title={T('References')}/>{guide.references.map(ref=><Pressable key={ref.url} onPress={()=>Linking.openURL(ref.url)} style={s.referenceRow}><Text style={s.settingName}>{ref.label}</Text>{ico('open-outline',18,C.green)}</Pressable>)}</ScrollView></Page>}

function HijriCalendarScreen({navigation}:any){const{rtl,language}=useLanguage();const T=(text:string)=>tx(rtl,text);const{location}=useAppLocation();const[days,setDays]=useState<CalendarDay[]>([]);const[error,setError]=useState('');const now=new Date();const load=async()=>{if(!location)return;setError('');setDays([]);try{setDays(await getGregorianCalendar(location.latitude,location.longitude,now.getMonth()+1,now.getFullYear()))}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);const first=days[0]?.gregorian.split('-').map(Number);const offset=first?new Date(first[2],first[1]-1,first[0]).getDay():0;return <Page><ToolBar title={T('Hijri calendar')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>{!location?<LocationPrompt compact/>:<><View style={s.calendarIntro}><Text style={s.calendarMonth}>{now.toLocaleDateString(language==='ar'?'ar-u-nu-latn':'en',{month:'long',year:'numeric'})}</Text><Text style={s.calendarHijri}>{days.length?(rtl?`${days[0].hijriMonthAr||days[0].hijriMonth} – ${days[days.length-1].hijriMonthAr||days[days.length-1].hijriMonth} ${days[0].hijriYear} هـ`:`${days[0].hijriMonth} – ${days[days.length-1].hijriMonth} ${days[0].hijriYear} AH`):''}</Text></View>{error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<><View style={s.weekHead}>{['ح','ن','ث','ر','خ','ج','س'].map((d,i)=><Text key={i} style={s.weekLabel}>{rtl?d:['S','M','T','W','T','F','S'][i]}</Text>)}</View><View style={s.calendarGrid}>{Array.from({length:offset}).map((_,i)=><View key={`e${i}`} style={s.calendarCell}/>) }{days.map((d,i)=><View key={d.gregorian} style={[s.calendarCell,d.gregorian.startsWith(String(now.getDate()).padStart(2,'0'))&&s.calendarToday]}><Text style={s.gregorianDay}>{i+1}</Text><Text style={s.hijriDay}>{d.hijriDay}</Text></View>)}</View><View style={s.calendarLegend}><View style={s.legendDot}/><Text style={s.sourceBody}>{T('Large number: Gregorian · Small number: Hijri')}</Text></View></>}</>}</ScrollView></Page>}
function RamadanScreen({navigation}:any){const{rtl}=useLanguage();const T=(text:string)=>tx(rtl,text);const{location}=useAppLocation();const[days,setDays]=useState<CalendarDay[]>([]);const[year,setYear]=useState<number|null>(null);const[error,setError]=useState('');const load=async()=>{if(!location)return;setError('');setDays([]);try{const snap=await getPrayerSnapshot(location.latitude,location.longitude);const target=snap.hijriMonth>9?snap.hijriYear+1:snap.hijriYear;setYear(target);setDays(await getRamadanCalendar(location.latitude,location.longitude,target));}catch(e:any){setError(T(e.message))}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title={T('Ramadan')} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>{!location?<LocationPrompt compact/>:<><LinearGradient colors={[C.heroA,C.green]} style={s.ramadanHero}><Text style={s.ramadanArabic}>رَمَضَان</Text><Text style={s.ramadanTitle}>{T('Ramadan')} {year||''} {T('AH')}</Text><Text style={s.ramadanSub}>{T('A live 30-day Suhoor and Iftar timetable for')} {T(location.label)}.</Text></LinearGradient><Pressable onPress={()=>navigation.navigate('Tools',{screen:'Fasting'})} style={[s.sourceCard,{marginTop: 12}]}>{ico('create-outline',20,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{T('Fasting record')}</Text><Text style={s.sourceBody}>{T('Mark each day and keep your make-up ledger')}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>{error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<><Section title={T('Fasting timetable')} action={rtl?`${days.length} يومًا`:`${days.length} days`}/><View style={s.ramadanList}>{days.map(d=>{const fajr=d.prayers.find(p=>p.name==='Fajr');const maghrib=d.prayers.find(p=>p.name==='Maghrib');return <View key={d.gregorian} style={s.ramadanRow}><View style={s.ramadanDay}><Text style={s.ramadanDayNo}>{d.hijriDay}</Text><Text style={s.ramadanDayLabel}>{T('RAM')}</Text></View><View style={{flex:1}}><Text style={s.ramadanDate}>{rtl ? d.weekdayAr || d.weekday : d.weekday} · {d.gregorian}</Text><Text style={s.meta}>{T(location.label)}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>{T('SUHOOR')}</Text><Text style={s.fastValue}>{clockTime(rtl, fajr?.time || '')}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>{T('IFTAR')}</Text><Text style={s.fastValue}>{maghrib?.time}</Text></View></View>})}</View></>}</>}</ScrollView></Page>}
/* ==================== Phase 4 · women's area ==================== */
function haptic(kind: 'tap' | 'error' = 'tap') {
  try {
    if (kind === 'error') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else void Haptics.selectionAsync();
  } catch (error) {
    /* haptics are unavailable on some devices and on the web */
  }
}

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
        <PrivateRow rtl={rtl} graphic="Purity" title={T('Purity and ghusl')} label={T('Purity and ghusl')} caption={T('The signs of tuhr, the ghusl, and the post-natal days')} onPress={() => navigation.navigate('Purity')} />
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
  const state=useHadithState();
  const saved=isHadithSaved(slug,number);
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
  return <Page><ToolBar title={rtl ? (collection?.arabicName || T('Hadith')) : (collection?.name || 'Hadith')} navigation={navigation}/>
    {!hadith&&!error&&<Spinner/>}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!hadith&&<ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <View style={s.hadithDetailHead}>
        <View style={s.hadithNumberLarge}><Text style={s.hadithNumberText}>{hadith.number}</Text></View>
        <View style={{flex:1}}>
          <Text style={s.dataName}>{collection?.name}</Text>
          <Text style={s.meta}>{hadith.book?(rtl?`الكتاب ${hadith.book} · ${hadith.bookName}`:`Book ${hadith.book} · ${hadith.bookName}`):T('General')}</Text>
        </View>
      </View>
      {hadith.grades.length>0&&<View style={s.hadithGrades}>{hadith.grades.map((grade,index)=><View key={`${grade.name}-${index}`} style={s.hadithGrade}><Text style={s.hadithGradeText}>{grade.grade}</Text><Text style={s.hadithGradeSource}>{grade.name}</Text></View>)}</View>}
      {!!hadith.arabic&&<Text style={[s.dataArabic,{fontSize:23,lineHeight:44}]}>{hadith.arabic}</Text>}
      <Text style={[s.dataBody,{fontSize:15,lineHeight:26,marginTop:16}]}>{hadith.english}</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel={saved?'Remove hadith from saved':'Save this hadith'} onPress={()=>{if(collection)void toggleHadithSaved(collection,hadith)}} style={s.secondary}><Text style={s.secondaryText}>{saved?'Saved':'Save'}</Text></Pressable>
        <Pressable accessibilityLabel={T('Copy hadith text')} onPress={copy} style={s.secondary}><Text style={s.secondaryText}>{copied?'Copied':'Copy'}</Text></Pressable>
        <Pressable accessibilityLabel={T('Share hadith')} onPress={share} style={s.secondary}><Text style={s.secondaryText}>{T('Share')}</Text></Pressable>
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
function ChoicePill({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}){return <Pressable accessibilityRole="radio" accessibilityState={{selected}} onPress={onPress} style={[s.choicePill,selected&&s.choicePillActive]}><Text style={[s.choiceText,selected&&s.choiceTextActive]}>{label}</Text></Pressable>}
const DATA_SOURCES: { name: string; ar: string; endpoint: string; detail: string; arDetail: string }[] = [
  { name: 'Al Quran Cloud', ar: 'القرآن السحابي', endpoint: 'api.alquran.cloud',
    detail: 'Arabic script editions — Uthmani, Imla’i simple, IndoPak and Tajweed — translations in many languages, Surah and Juz structure, and verse-by-verse audio editions.',
    arDetail: 'نصوص القرآن بعدة روايات وترجمات بلغات متعددة، مع ترتيب السور والأجزاء وملفات الصوت لكل آية.' },
  { name: 'Islamic.app', ar: 'تطبيق إسلاميك', endpoint: 'api.islamic.app',
    detail: 'The Beautiful Names with their meanings, the adhkar and duas of Hisn al-Muslim, and the hadith collections with Arabic and English editions.',
    arDetail: 'الأسماء الحسنى ومعانيها، وأذكار ودعوات حصن المسلم، ومجموعات الحديث بنصّها العربي وترجمتها الإنجليزية.' },
  { name: 'AlAdhan', ar: 'الأذان', endpoint: 'api.aladhan.com',
    detail: 'Prayer times by calculation method for any coordinate, the Hijri calendar, and the Ramadan timetable for suhoor and iftar.',
    arDetail: 'مواقيت الصلاة حسب طريقة الحساب لأي موقع، والتقويم الهجري، وجدول رمضان للإمساك والإفطار.' },
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

function SettingsStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Settings" component={SettingsScreen}/><Stack.Screen name="Data sources" component={DataSourcesScreen}/></Stack.Navigator>}

function SettingsScreen({navigation}:any){const{language,rtl,setLanguage}=useLanguage();const T=(text:string)=>tx(rtl,text);const{mode:themeMode,setMode}=useTheme();const{settings,update}=useWorshipSettings();const womens=useWomens();const lock=useLockConfig();return <Page><ScrollView contentContainerStyle={s.scroll}><View style={s.backRow}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/></View><TopBar overline={rtl?'خصوصية بلا حساب':'PRIVATE BY DESIGN'} title={rtl?'الإعدادات':'Settings'} right={<MotionGlyph name="shield-checkmark-outline" size={20}/>}/><LinearGradient colors={[C.heroA,C.green]} style={s.privacyHero}><MotionGlyph name="shield-checkmark-outline" size={25} inverse/><View style={{flex:1}}><Text style={s.profileName}>{rtl?'لا حساب. لا تتبع.':'No account. No tracking.'}</Text><Text style={s.profileSub}>{rtl?'تبقى عبادتك خاصة وتظل تفضيلاتك على هذا الجهاز.':'Your worship stays private and your preferences remain on this device.'}</Text></View></LinearGradient><View style={s.privacyPoints}><View style={s.privacyPoint}>{ico('person-remove-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون تسجيل':'No sign-up'}</Text></View><View style={s.privacyPoint}>{ico('cloud-offline-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون ملف سحابي':'No cloud profile'}</Text></View><View style={s.privacyPoint}>{ico('analytics-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون تتبع إعلاني':'No ad tracking'}</Text></View></View>
<Section title={rtl?'حساب أوقات الصلاة':'Prayer calculation'}/><View style={s.preferencePanel}><View style={s.preferenceHead}><ToolGraphic tool="Qibla" size={54}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'طريقة الحساب':'Calculation method'}</Text><Text style={s.meta}>{rtl?'تُحفظ على هذا الجهاز وتُطبق على جميع مواقيت الصلاة.':'Saved on this device and applied throughout the app.'}</Text></View></View><View style={s.choiceGrid}>{PRAYER_METHODS.map(method=><ChoicePill key={method.id} label={rtl?method.ar:method.name} selected={settings.calculationMethod===method.id} onPress={()=>update({calculationMethod:method.id,calculationMethodName:method.name})}/>)}</View><Text style={s.preferenceLabel}>{rtl?'المذهب لحساب العصر':'ASR MADHAB'}</Text><View style={s.choiceRow}><ChoicePill label={rtl?'الشافعي':'Shafi'} selected={settings.madhab==='shafi'} onPress={()=>update({madhab:'shafi'})}/><ChoicePill label={rtl?'الحنفي':'Hanafi'} selected={settings.madhab==='hanafi'} onPress={()=>update({madhab:'hanafi'})}/></View><Text style={s.preferenceLabel}>{rtl?'تنسيق الوقت':'TIME FORMAT'}</Text><View style={s.choiceRow}><ChoicePill label={rtl?'12 ساعة':'12 hour'} selected={settings.timeFormat==='12'} onPress={()=>update({timeFormat:'12'})}/><ChoicePill label={rtl?'24 ساعة':'24 hour'} selected={settings.timeFormat==='24'} onPress={()=>update({timeFormat:'24'})}/></View></View>
<Section title={T('Appearance')}/><View style={s.settings}><View style={s.setting}><MotionGlyph name="moon-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{T('Appearance')}</Text><Text style={s.meta}>{T('Light, dark, or whatever the device is set to')}</Text></View></View><View style={s.choiceRow}><ChoicePill label={T('System')} selected={themeMode==='system'} onPress={()=>setMode('system')}/><ChoicePill label={T('Light')} selected={themeMode==='light'} onPress={()=>setMode('light')}/><ChoicePill label={T('Dark')} selected={themeMode==='dark'} onPress={()=>setMode('dark')}/></View></View><Section title={rtl?'التفضيلات':'Preferences'}/><View style={s.settings}><View style={s.setting}><MotionGlyph name="language-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'واجهة عربية':'English interface'}</Text><Text style={s.meta}>{rtl?'تخطيط من اليمين إلى اليسار':'Left-to-right layout'}</Text></View><View style={{direction:'ltr'} as any}><Switch accessibilityLabel={rtl?'Arabic interface':'Arabic interface'} value={language==='ar'} onValueChange={v=>setLanguage(v?'ar':'en')} trackColor={{true:C.green}}/></View></View><View style={s.setting}><ToolGraphic tool="Arabic Quran" size={44}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'قراءة القرآن':'Quran reading'}</Text><Text style={s.meta}>{rtl?'النص العثماني · صحيح إنترناشيونال':'Uthmani Arabic · Sahih International English'}</Text></View></View><View style={s.setting}><ToolGraphic tool="Women’s worship" size={44}/><View style={{flex:1,marginHorizontal: 12}}><Text style={s.settingName}>{rtl?'عبادة النساء':'Women’s worship'}</Text><Text style={s.meta}>{rtl?(womens.optedIn?'الدورة والطهارة والقضاء · على هذا الجهاز فقط':'مساحة خاصة للدورة والطهارة والقضاء'):(womens.optedIn?'Cycle, purity and Qada records · on this device only':'A private area for the cycle, purity and Qada records')}</Text></View><View style={{direction:'ltr'} as any}><Switch accessibilityLabel={T('Women’s worship')} value={womens.optedIn} onValueChange={(value)=>void setOptedIn(value)} trackColor={{true:C.green}}/></View></View>{womens.optedIn&&<Pressable accessibilityRole="button" accessibilityLabel={T('Lock and PIN')} onPress={()=>navigation.navigate('Tools',{screen:'Privacy Lock'})} style={s.setting}><ToolGraphic tool="Privacy lock" size={44}/><View style={{flex:1,marginHorizontal: 12}}><Text style={s.settingName}>{rtl?'القفل والرمز':'Lock and PIN'}</Text><Text style={s.meta}>{rtl?(lock.pinSet?(lock.required?'مقفل':'الرمز محفوظ'):'لا رمز بعد'):(lock.pinSet?(lock.required?'Locked':'PIN saved, lock is off'):'No PIN yet')}</Text></View>{ico(rtl?'arrow-back':'arrow-forward',17,C.chevron)}</Pressable>}</View><Pressable onPress={()=>navigation.navigate('Data sources')} style={[s.settings,s.dataSourceRow]} accessibilityRole="button" accessibilityLabel={T('Data sources')}><ToolGraphic tool="Quran" size={40}/><View style={{flex:1,marginHorizontal: 12}}><Text style={s.settingName}>{rtl?'مصادر البيانات':'Data sources'}</Text><Text style={s.meta}>{rtl?'من أين يأتي نص القرآن والمواقيت والحديث والصوت':'Where the Quran text, prayer times, hadith and audio come from'}</Text></View>{ico('arrow-forward',17,C.chevron)}</Pressable></ScrollView></Page>}
import { DEFAULT_RECITER, LANGUAGES, Language, LanguageCode, languageByCode, isRtl } from './src/services/languages';

const navigationRef = createNavigationContainerRef<any>();
const AUDIO_LANGUAGES: Record<string, string> = {
  en: 'English', ur: 'Urdu', zh: 'Chinese', fr: 'French', ru: 'Russian',
  kk: 'Kazakh', tr: 'Turkish', fa: 'Persian', uz: 'Uzbek', my: 'Burmese',
};
const AUDIO_LANGUAGES_AR: Record<string, string> = {
  en: 'الإنجليزية', ur: 'الأردية', zh: 'الصينية', fr: 'الفرنسية', ru: 'الروسية',
  kk: 'الكازاخية', tr: 'التركية', fa: 'الفارسية', uz: 'الأوزبكية', my: 'البورمية',
};
const languageName = (code: string, rtl: boolean) =>
  (rtl ? AUDIO_LANGUAGES_AR : AUDIO_LANGUAGES)[code] || code;
const AUDIO_RATES = [0.75, 1, 1.25, 1.5];

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
    onPanResponderRelease: (event) => { const next = clamp(event.nativeEvent.locationX / (width.current || 1)); setDrag(null); onSeek(next * duration); },
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
  const bottom = Platform.OS === 'ios' ? 112 : 96;
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
        translationAudioEnabled: session.sequential,
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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  useEffect(() => { void loadPlaylists().then(setPlaylists); }, []);
  const track = audio.track;
  if (!track) return <Page><ToolBar title={T('Audio player')} navigation={navigation} /><View style={s.dataPage}>
    <ToolGraphic tool="Recitations" size={78} />
    <Text style={s.dataTitle}>{T('Nothing is playing')}</Text>
    <Text style={s.intro}>{T('Choose a reciter and a Surah from the audio center to start listening.')}</Text>
    <Pressable onPress={() => navigation.goBack()} style={s.primary}><Text style={s.primaryText}>{T('Open audio center')}</Text></Pressable>
  </View></Page>;
  const upcoming = audio.queue.slice(audio.index + 1, audio.index + 6);
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title={T('Now playing')} navigation={navigation} />
    <View style={s.playerArt}>
      <ToolGraphic tool="Recitations" size={92} />
      <Text style={s.playerTitle}>{track.title}</Text>
      <Text style={s.playerPerformer}>{track.performer}</Text>
      <View style={s.trackBadge}><Text style={s.trackBadgeText}>{track.kind === 'translation' ? 'TRANSLATION' : 'ARABIC RECITATION'}</Text></View>
    </View>
    {!!track.text && <Text style={s.playerArabic}>{track.text}</Text>}
    <View style={s.audioTimes}>
      <Text style={s.meta}>{formatClock(audio.position)}</Text>
      <Text style={s.meta}>{audio.buffering ? 'Buffering…' : formatClock(audio.duration)}</Text>
    </View>
    <SeekBar position={audio.position} duration={audio.duration} onSeek={(value) => { void seekTo(value); }} />
    <View style={s.audioControls}>
      <Pressable accessibilityLabel={T('Previous verse')} onPress={() => { void previousTrack(); }} style={s.audioControlBtn}>{ico('play-skip-back', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={audio.playing ? 'Pause' : 'Play'} onPress={() => { void togglePlayback(); }} style={s.audioControlMain}>{audio.playing ? ico('pause', 26, C.white) : ico('play', 26, C.white)}</Pressable>
      <Pressable accessibilityLabel={T('Next verse')} onPress={() => { void nextTrack(); }} style={s.audioControlBtn}>{ico('play-skip-forward', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={`${T('Repeat mode')}: ${T(audio.repeat === 'one' ? 'Repeat one' : audio.repeat === 'all' ? 'Repeat all' : 'Repeat off')}`} onPress={() => setRepeatMode(audio.repeat === 'none' ? 'all' : audio.repeat === 'all' ? 'one' : 'none')} style={s.audioControlBtn}>{ico('repeat', 19, audio.repeat === 'none' ? C.muted : C.green)}<Text style={s.rateText}>{audio.repeat === 'one' ? '1' : audio.repeat === 'all' ? '∞' : '—'}</Text></Pressable>
    </View>
    <View style={s.row}>
      <Pressable accessibilityLabel={T('Stop playback')} onPress={() => { void stopPlayback(); }} style={s.secondary}>{ico('stop', 17, C.green)}<Text style={s.secondaryText}>{T('Stop')}</Text></Pressable>
      <Pressable accessibilityLabel={T('Clear the queue')} onPress={() => { void clearQueue(); }} style={s.secondary}>{ico('trash', 17, C.green)}<Text style={s.secondaryText}>{T('Clear queue')}</Text></Pressable>
    </View>
    <Text style={s.preferenceLabel}>{T('SPEED')}</Text>
    <View style={s.choiceRow}>{AUDIO_RATES.map((rate) => <ChoicePill key={rate} label={`${rate}×`} selected={audio.rate === rate} onPress={() => { void setPlaybackRate(rate); }} />)}</View>
    <Section title={`Queue · ${audio.queue.length} tracks`} />
    {audio.queue.map((item, index) => <Pressable key={`${item.id}-${index}`} onPress={() => { void selectQueueItem(index); }} style={[s.queueRow, index === audio.index && s.queueRowActive]}>
      <Text style={s.queueIndex}>{index + 1}</Text>
      <View style={{ flex: 1 }}><Text numberOfLines={1} style={s.settingName}>{item.title}</Text><Text style={s.meta}>{item.performer}</Text></View>
      <Pressable accessibilityLabel={`${T('Remove from the queue')} ${item.title}`} onPress={() => removeFromQueue(index)} style={s.audioRowAction}>{ico('close', 16, C.muted)}</Pressable>
    </Pressable>)}
    <View style={s.formCard}>
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

const TAB_ITEMS = [
  { name: 'Home', label: 'Home', ar: 'الرئيسية', icon: require('./assets/tool-icons/tab-home.png'), iconDark: require('./assets/tool-icons/tab-home-dark.png') },
  { name: 'Prayer', label: 'Prayer', ar: 'الصلاة', icon: require('./assets/tool-icons/salah-guide.png'), iconDark: require('./assets/tool-icons/salah-guide-dark.png') },
  { name: 'Quran', label: 'Quran', ar: 'القرآن', icon: require('./assets/tool-icons/quran.png'), iconDark: require('./assets/tool-icons/quran-dark.png') },
  { name: 'Library', label: 'Library', ar: 'المكتبة', icon: require('./assets/tool-icons/tab-library.png'), iconDark: require('./assets/tool-icons/tab-library-dark.png') },
  { name: 'Tools', label: 'Tools', ar: 'الأدوات', icon: require('./assets/tool-icons/tab-tools.png'), iconDark: require('./assets/tool-icons/tab-tools-dark.png') },
];

/** The menu floats above the content as a single capsule, always in reach. */
function FloatingTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const { rtl } = useLanguage();
  const { dark } = useTheme();
  const barWidth = Math.min(Math.max(width - 32, 300), 460);
  return <View pointerEvents="box-none" style={s.floatBarWrap}>
    <View style={[s.floatBar, { width: barWidth, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const item = TAB_ITEMS.find((entry) => entry.name === route.name);
        const label = item ? (rtl ? item.ar : item.label) : route.name;
        return <Pressable key={route.key} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={label}
          onPress={() => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!focused && !event.defaultPrevented) navigation.navigate(route.name); }}
          style={s.floatItem}>
          <Animated.View style={[s.floatPill, focused && s.floatPillActive]}>
            {item?.icon ? <Image source={dark ? item.iconDark || item.icon : item.icon} resizeMode="contain" style={{ width: 23, height: 23, opacity: focused ? 1 : 0.5 }} /> : ico('ellipse-outline', 20, focused ? C.green : C.chevron)}
            <Text numberOfLines={1} style={[s.floatLabel, focused && s.floatLabelActive]}>{label}</Text>
          </Animated.View>
        </Pressable>;
      })}
    </View>
  </View>;
}

function Tabs(){return <Tab.Navigator screenOptions={{headerShown:false,tabBarHideOnKeyboard:true}} tabBar={(props:any)=><FloatingTabBar {...props}/>}><Tab.Screen name="Home" component={HomeScreen}/><Tab.Screen name="Prayer" component={PrayerStack}/><Tab.Screen name="Quran" component={QuranStack}/><Tab.Screen name="Library" component={ExploreStack}/><Tab.Screen name="Tools" component={ToolsStack}/></Tab.Navigator>}
/**
 * The navigation tree. It is rebuilt when the theme changes, so the palette
 * reaches every screen; the navigation state is carried across that rebuild.
 */
function Root() {
  const { dark, tick } = useTheme();
  const [initial, setInitial] = useState<any>(undefined);
  const [ready, setReady] = useState(false);
  useEffect(() => { void loadNavState().then((state) => { setInitial(state); setReady(true); }); }, []);
  if (!ready) return <SafeAreaView style={s.safe}><Spinner /></SafeAreaView>;
  return <NavigationContainer ref={navigationRef} key={(dark ? 'dark' : 'light') + ':' + tick} initialState={initial} onStateChange={saveNavState}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Settings" component={SettingsStack} />
    </Stack.Navigator>
    <ExpoStatusBar style={dark ? 'light' : 'dark'} /><MiniPlayer />
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
        <Text style={s.splashName}>{T('Deen Companion')}</Text>
        <Text style={s.splashTagline}>{T('Your day, kept with care')}</Text>
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
function Onboarding({ onFinish }: { onFinish: () => void }) {
  const { dark } = useTheme();
  const { rtl, language, setLanguage } = useLanguage();
  const T = (text: string) => tx(rtl, text);
  const { update } = useQuranPreferences();
  const [step, setStep] = useState(0);
  const [app, setApp] = useState<LanguageCode>(language);
  const [text, setText] = useState<LanguageCode>(language);
  const [voice, setVoice] = useState<LanguageCode>(language);
  const [busy, setBusy] = useState(false);
  const slide = useRef(new Animated.Value(0)).current;

  // Each step arrives from the side rather than simply appearing.
  useEffect(() => {
    slide.setValue(0);
    Animated.timing(slide, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [step]);

  // One choice moves the rest with it.
  const chooseApp = (code: LanguageCode) => { setApp(code); setLanguage(code); setText(code); setVoice(code); };
  const chosen: LanguageCode = step === 0 ? app : step === 1 ? text : voice;
  const pick = (code: LanguageCode) => { if (step === 0) chooseApp(code); else if (step === 1) setText(code); else setVoice(code); };

  const steps = [
    { title: T('How should the app speak to you?'), caption: T('This sets the words on every screen, and it carries the Quran text and the voice with it. You can change either of those next.') },
    { title: T('Which meaning beside the Arabic?'), caption: T('The Quran is always shown in Arabic. This is the text you read next to it.') },
    { title: T('Which voice with the recitation?'), caption: T('Recitation stays the Arabic Qur’an. This adds a voice in your own language underneath it.') },
  ];
  const active = steps[step];

  /** A short line under a card saying honestly what that choice can offer. */
  const hint = (entry: Language) => {
    if (step === 0) return entry.uiReady ? null : T('Interface stays in English');
    if (step === 1) return !entry.text ? T('Text stays in English') : entry.text.kind === 'tafsir' ? T('A tafsir, not a translation') : null;
    return entry.voice ? null : T('Recitation only');
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      setLanguage(app);
      const textEntry = languageByCode(text);
      const voiceEntry = languageByCode(voice);
      // The text read beside the Arabic.
      if (textEntry?.text) await update({ translationEdition: textEntry.text.identifier, translationName: textEntry.text.name, translationLanguage: textEntry.english });
      // The voice heard under the recitation. Arabic has none: for Arabic the
      // audio *is* the recitation.
      await saveAudioSettings(voiceEntry?.voice
        ? { reciter: DEFAULT_RECITER.identifier, reciterName: DEFAULT_RECITER.name, translationAudioEnabled: true, translationEdition: voiceEntry.voice.identifier, translationName: voiceEntry.voice.name }
        : { reciter: DEFAULT_RECITER.identifier, reciterName: DEFAULT_RECITER.name, translationAudioEnabled: false });
      await saveOnboarding({ completed: true, app, text, voice, at: Date.now() });
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
      <View style={s.onbList} key={step}>
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
      </View>
    </ScrollView>
    <View style={s.onbFoot}>
      <View style={s.onbDots}>{steps.map((_, index) => <View key={index} style={[s.onbDot, index === step && s.onbDotOn]} />)}</View>
      <View style={s.onbActions}>
        {step > 0 && <MotionPress style={s.onbGhost} onPress={() => setStep(step - 1)}><Text style={s.onbGhostText}>{T('Back')}</Text></MotionPress>}
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
function AppShell() {
  const { ready } = useLanguage();
  const { hydrated } = useQuranPreferences();
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

  return <View style={s.shellRoot}>
    <Root />
    {splash && <View style={s.shellLayer}><Splash ready={(ready && hydrated) || stalled} onDone={() => setSplash(false)} /></View>}
    {!splash && onboarding === true && <View style={s.shellLayer}><Onboarding onFinish={() => setOnboarding(false)} /></View>}
  </View>;
}

export default function App(){const[fontsLoaded]=useFonts({DMSans_400Regular,DMSans_600SemiBold,DMSans_700Bold,Newsreader_600SemiBold,NotoNaskhArabic_400Regular,NotoNaskhArabic_600SemiBold,Amiri_400Regular,KFGQPCUthmanicHafs,IBMPlexSansArabic_400Regular,IBMPlexSansArabic_600SemiBold});useEffect(()=>{if(fontsLoaded){resumeSavedQuranPreload();void loadAudioSettings();void loadHadithState();void loadTasbihState();void loadDownloads();void loadActivity();void loadFastingState();void loadJourneys();void loadWomensState();void loadZakatState();void loadLockConfig();void refreshMarket();startLockWatch()}},[fontsLoaded]);if(!fontsLoaded)return <SafeAreaView style={s.safe}><Spinner/></SafeAreaView>;return <ThemeProvider><LanguageProvider><QuranPreferencesProvider><WorshipSettingsProvider><LocationProvider><AppShell/></LocationProvider></WorshipSettingsProvider></QuranPreferencesProvider></LanguageProvider></ThemeProvider>}

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
  journeyCard:{flexDirection:'row',alignItems:'center',gap:CARD.gap,backgroundColor:C.white,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,...soft},
  journeyTitleRow:{flexDirection:'row',alignItems:'center',gap:SPACE.sm},
  journeyArabic:{color:C.green,fontSize:18,fontFamily:'KFGQPCUthmanicHafs',marginTop:SPACE.xs,marginBottom:SPACE.xs},
  journeyBar:{height:6,borderRadius:3,backgroundColor:C.mint,overflow:'hidden',marginTop:SPACE.sm,marginBottom:SPACE.xs},
  journeyBarFill:{height:6,borderRadius:3,backgroundColor:C.green},
  stepCard:{backgroundColor:C.white,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:CARD.gap,...soft},
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
  channelCard:{backgroundColor:C.white,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,marginBottom:CARD_GAP,gap:SPACE.md,...soft},
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
 safe:{flex:1,backgroundColor:C.bg,overflow:'hidden',paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0},page:{flex:1,backgroundColor:C.bg},pageWide:{width:'100%',maxWidth:1180,alignSelf:'center'},scroll:{width:'100%',maxWidth:980,alignSelf:'center',paddingHorizontal:20,paddingTop:20,paddingBottom:112},row:{flexDirection:'row',alignItems:'center'},press:{opacity:.72,transform:[{scale:.98}]},loading:{padding:44,alignItems:'center',gap:12},loadingText:{color:C.muted,fontSize:12},error:{backgroundColor:'#F5EFEE',padding:24,borderRadius:24,alignItems:'center',marginVertical:12},errorIcon:{width:48,height:48,borderRadius:16,backgroundColor:'#EDE5E4',alignItems:'center',justifyContent:'center'},errorTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_600SemiBold',marginTop:12},errorText:{color:C.muted,textAlign:'center',fontSize:12,lineHeight:18,marginTop:4},retry:{backgroundColor:C.ink,paddingHorizontal:16,paddingVertical:8,borderRadius:12,marginTop:12},retryText:{color:C.onAccent,fontSize:11,fontFamily:'DMSans_600SemiBold'},
 topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 appHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
 appHeaderBrand:{flexDirection:'row',alignItems:'center',gap:10,flexShrink:1},
 appLogo:{width:36,height:36},
 appName:{color:C.ink,fontSize:20,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,flexShrink:1},
 appHeaderActions:{flexDirection:'row',alignItems:'center',gap:6},
 headerBtn:{width:40,height:40,borderRadius:14},overline:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginBottom:4},h1:{color:C.ink,fontSize:32,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.8},iconBtn:{width:44,height:44,borderRadius:16,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},iconBtnDark:{backgroundColor:C.deep,borderColor:C.deep},section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:28,marginBottom:16},h2:{color:C.ink,fontSize:22,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.35},sectionAction:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
 graphicFrame:{alignItems:'center',justifyContent:'center',overflow:'hidden'},motionGlyph:{width:49,height:49,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},motionGlyphInverse:{backgroundColor:'rgba(255,255,255,.14)',borderColor:'rgba(255,255,255,.22)'},glyphDot:{position:'absolute',right:6,top:6,width:5,height:5,borderRadius:4,backgroundColor:C.gold},greeting:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16},salam:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:4},greetingTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},prayerHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:6,marginBottom:16},prayerOverline:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:5},prayerTitle:{color:C.ink,fontSize:27,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},
 aura:{position:'absolute',top:'-30%',left:'-20%',right:'-20%',height:'160%'},auraAlt:{position:'absolute',top:'-20%',left:'10%',right:'-25%',height:'140%',opacity:.8},heroSheen:{position:'absolute',top:'-20%',bottom:'-20%',width:'38%',left:'31%',opacity:.5},hero:{height:285,borderRadius:28,overflow:'hidden',padding:20,...shadow},heroWide:{height:310},heroBg:{position:'absolute',left:0,right:0,top:0,bottom:0,width:'100%',height:'100%'},locationPill:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',maxWidth:'72%',backgroundColor:'rgba(2,28,30,.62)',paddingHorizontal:12,paddingVertical:8,borderRadius:16},locationText:{color:C.onAccent,fontFamily:'DMSans_600SemiBold',fontSize:11,flexShrink:1},hijri:{color:'#D8D5E9',fontSize:11,marginTop:12},nextLabel:{color:'#FFE2A1',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginTop:36},heroTime:{color:C.onAccent,fontSize:42,fontFamily:'DMSans_700Bold',letterSpacing:-1.2,marginTop:2},heroFooter:{position:'absolute',left:20,right:20,bottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},countPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'rgba(255,255,255,.16)',paddingHorizontal:12,paddingVertical:8,borderRadius:16,borderWidth:1,borderColor:'rgba(255,255,255,.18)'},countText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_600SemiBold'},heroCta:{flexDirection:'row',alignItems:'center',gap:8},heroCtaText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold'},
 prayerRail:{marginHorizontal:8,marginTop:-1,backgroundColor:C.white,borderBottomLeftRadius:24,borderBottomRightRadius:24,flexDirection:'row',paddingHorizontal:8,paddingVertical:12,borderWidth:1,borderTopWidth:0,borderColor:C.line,...soft},railItem:{flex:1,alignItems:'center',paddingVertical:4,borderRadius:16},railItemActive:{backgroundColor:'#F0EDFF'},railIcon:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,.94)',borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center',marginBottom:8},railIconDone:{backgroundColor:'#E4F2EC',borderColor:C.green},railCheck:{position:'absolute',top:-2,right:-2,width:16,height:16,borderRadius:8,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.white},railName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},railTime:{color:C.ink,textAlign:'center',fontFamily:'DMSans_600SemiBold',fontSize:10,lineHeight:11,marginTop:2},
 sliderContent:{gap:12,paddingRight:28},sliderControls:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:8},sliderHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},sliderButtons:{flexDirection:'row',gap:8},sliderButton:{width:44,height:44,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:C.card,borderWidth:1,borderColor:C.line},sliderButtonDisabled:{opacity:.32},essentialSlide:{height:174,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...soft},essentialTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},essentialArrow:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},essentialTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,marginTop:4},essentialBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},reflectionSlide:{height:220,backgroundColor:C.white,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...soft},tool:{width:'33.33%',paddingVertical:12},
 homeProgress:{marginHorizontal:8,backgroundColor:C.card,borderBottomLeftRadius:20,borderBottomRightRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderTopWidth:0,borderColor:C.line},homeProgressRing:{width:43,height:43,borderRadius:24,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'#D7CFFF'},dailyKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:4},dailyArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,lineHeight:36,textAlign:'right',marginTop:8},dailyBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:4},dailyTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:14,marginTop:8},nameOfDay:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:34,textAlign:'right',marginTop:12},quickTasbih:{alignItems:'center'},quickCount:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:38,marginTop:4},weekSummary:{backgroundColor:C.deep,borderRadius:20,padding:16,marginTop:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},weekSummaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:19},weekSummaryBody:{color:'#D9D3F3',fontSize:10,marginTop:4},weekStatValue:{color:C.green,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:8},weekBar:{flex:1,height:8,borderRadius:4,backgroundColor:'#EAE6F0',overflow:'hidden',marginHorizontal:8},weekBarFill:{height:'100%',borderRadius:4,backgroundColor:C.green},weekScoreBody:{color:'#D9D3F3',fontSize:10,marginTop:4},readCard:{height:205,borderRadius:28,overflow:'hidden',padding:20,...shadow},readKicker:{color:'#CCEBDE',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5},readArabic:{color:C.onAccent,fontSize:29,marginTop:8},readTitle:{color:C.onAccent,fontSize:20,fontFamily:'DMSans_700Bold'},readMeta:{color:'#CAE4DB',fontSize:10,marginTop:4},whiteButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,alignSelf:'flex-start',backgroundColor:C.white,paddingHorizontal:12,paddingVertical:8,borderRadius:16,marginTop:12},whiteButtonText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},twoCol:{flexDirection:'row',gap:12,marginTop:12},liveBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',backgroundColor:'rgba(73,58,146,.90)',paddingHorizontal:8,paddingVertical:4,borderRadius:8} as any,liveDot:{width:5,height:5,borderRadius:4,backgroundColor:'#FF9A72'},liveText:{color:C.onAccent,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:.5},hadithCard:{backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},quote:{position:'absolute',right:18,top:2,color:'#E2EEE8',fontSize:72,fontFamily:'DMSans_700Bold'},hadithText:{color:C.ink,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:16},hadithFoot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:16,paddingTop:12,borderTopWidth:1,borderColor:C.line},meta:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16},
 dayStrip:{flexDirection:'row',justifyContent:'space-between',backgroundColor:C.white,padding:8,borderRadius:24,borderWidth:1,borderColor:C.line,...soft},day:{width:47,alignItems:'center',paddingVertical:8,borderRadius:16},dayActive:{backgroundColor:C.accent},dayName:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},dayNum:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dayText:{color:C.onAccent},nextCard:{height:190,borderRadius:28,padding:20,marginTop:16,overflow:'hidden',...shadow},nextCardLabel:{color:'#E1DCF7',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.5,marginTop:20},nextCardName:{color:C.onAccent,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:4},nextCardTime:{color:C.onAccent,fontSize:17,fontFamily:'DMSans_600SemiBold',marginBottom:12},moonOrb:{position:'absolute',right:24,top:43,width:96,height:96,borderRadius:48,backgroundColor:'rgba(255,255,255,.13)',alignItems:'center',justifyContent:'center'},prayerList:{backgroundColor:C.white,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...soft},prayerRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,minHeight:68,borderBottomWidth:1,borderColor:C.line},prayerRowLive:{backgroundColor:'#F2EFFF'},prayerSymbol:{width:41,height:41,borderRadius:16,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},prayerName:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},prayerValue:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold',marginRight:8},prayerProgress:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.white,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line,...soft},progressTrack:{width:86,height:7,borderRadius:4,backgroundColor:'#EAE7F1',overflow:'hidden'},progressFill:{height:'100%',borderRadius:4,backgroundColor:C.green},progressCount:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},prayerSymbolDone:{backgroundColor:C.accent,borderColor:C.green},sourceCard:{flexDirection:'row',gap:12,alignItems:'center',backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:16},sourceTitle:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},sourceBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},
 search:{height:48,flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,borderWidth:1,borderColor:C.line,marginBottom:12,...soft},searchInput:{flex:1,color:C.ink,fontSize:12,outlineStyle:'none'} as any,quranHero:{height:225,borderRadius:28,overflow:'hidden',padding:20,...shadow},quranArabic:{color:C.onAccent,fontSize:28,marginTop:16},quranHeroTitle:{color:C.onAccent,fontSize:21,fontFamily:'DMSans_700Bold'},quranHeroMeta:{color:'#D8D4EA',fontFamily:'DMSans_400Regular',fontSize:11,marginTop:4},continueBar:{backgroundColor:C.white,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,marginBottom:12,borderWidth:1,borderColor:C.line,...soft},quranHeroWide:{height:245},quranActionGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},quranPrimaryWrap:{flexGrow:1,flexBasis:'40%',minWidth:280},quranPrimaryAction:{height:142,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',overflow:'hidden',...soft},quranPrimaryTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:24,marginTop:8},quranPrimaryBody:{color:'#D9D5EC',fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:4},quranNavWrap:{flexGrow:1,flexBasis:'14%',minWidth:98},quranNavCard:{height:142,backgroundColor:C.card,borderRadius:20,padding:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},quranNavTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:4},quranNavCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:14,marginTop:2,textAlign:'center'},quranStudyCard:{height:190,backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},quranStudyTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},studyNumber:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},quranStudyTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:20,marginTop:8},quranStudyCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16,marginTop:4},quranPreferenceRow:{flexDirection:'row',flexWrap:'wrap',gap:12},quranPreferenceCard:{flex:1,minWidth:260,minHeight:76,backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line,...soft},quranPersonalGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},quranPersonalWrap:{flexGrow:1,flexBasis:'18%',minWidth:130},quranPersonalCard:{minHeight:132,backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...soft},quranPersonalHead:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},quranPersonalValue:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:22},quranPersonalTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:8},quranPersonalCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,marginTop:4},recentChip:{minWidth:128,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line},surahList:{flexDirection:'row',flexWrap:'wrap',gap:CARD_GAP},surahMore:{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:16,borderRadius:RADIUS.lg,borderWidth:1,borderColor:C.line,borderStyle:'dashed'},surahMoreText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:13},surahCard:{flexGrow:1,flexBasis:'31%',minWidth:250,flexDirection:'row',alignItems:'center',gap:CARD.gap,backgroundColor:C.white,borderRadius:RADIUS.xl,borderWidth:1,borderColor:C.line,padding:CARD.padding,...soft},surahPlace:{color:C.muted,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,textTransform:'uppercase',marginTop:SPACE.xs},surahNum:{width:44,height:44,borderRadius:22,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},surahNumText:{color:C.green,fontSize:13,fontFamily:'Newsreader_600SemiBold'},surahName:{color:C.ink,fontSize:15,fontFamily:'DMSans_700Bold',marginBottom:SPACE.xs},surahAr:{color:C.green,fontSize:21,fontFamily:'KFGQPCUthmanicHafs'},
 readerModes:{flexDirection:'row',gap:12,marginTop:12},readerMode:{flex:1,minHeight:56,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:C.white,borderRadius:20,borderWidth:1,borderColor:C.line},readerModeActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},readerModeText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},readerBar:{height:72,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line},readerName:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold'},readerProgress:{height:4,backgroundColor:'#E6E2EB',overflow:'hidden'},readerScroll:{width:'100%',maxWidth:860,alignSelf:'center',padding:16,paddingBottom:52},surahHead:{borderRadius:28,padding:24,alignItems:'center',...shadow},surahHeadAr:{color:C.onAccent,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:38,marginTop:16},surahHeadEn:{color:'#C9E5DB',fontSize:10,marginTop:4},bismillah:{color:C.onAccent,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,marginTop:24},ayahContinuous:{marginTop:4,borderRadius:4,borderBottomWidth:1,shadowOpacity:0,elevation:0},ayahSelected:{borderColor:C.gold,borderWidth:2,backgroundColor:'#FFFDF5'},ayahActions:{flexDirection:'row',alignItems:'center',gap:16},ayahFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12},ayah:{backgroundColor:C.white,borderRadius:24,padding:20,marginTop:12,borderWidth:1,borderColor:C.line,...soft},ayahTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},ayahNo:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',backgroundColor:C.mint,paddingHorizontal:8,paddingVertical:8,borderRadius:12},ayahAr:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:30,lineHeight:58,marginTop:16},ayahTranslation:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:20,marginTop:16,paddingTop:16,borderTopWidth:1,borderColor:C.line},ayahMeta:{color:C.muted,fontSize:10,marginTop:12},
 translationRow:{minHeight:67,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},languageBadge:{width:52,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:4},languageFlag:{fontSize:12},languageBadgeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},historyHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},historyWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:12},historyChip:{backgroundColor:C.mint,borderRadius:16,paddingHorizontal:12,paddingVertical:8},searchResult:{backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:8,borderWidth:1,borderColor:C.line},noteText:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:17,lineHeight:24,marginVertical:8},noteInput:{minHeight:180,backgroundColor:C.white,borderRadius:20,padding:16,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,stepper:{backgroundColor:C.white,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},stepButton:{width:44,height:44,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},fontPreview:{backgroundColor:C.mint,borderRadius:20,padding:16,marginTop:12,borderWidth:1,borderColor:C.line},fontPreviewText:{color:C.ink,textAlign:'right',lineHeight:52,includeFontPadding:false},previewArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs'},referenceNavigator:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginBottom:12},referenceInput:{width:100,textAlign:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,color:C.ink,fontFamily:'DMSans_700Bold',outlineStyle:'none'} as any,comparisonHelp:{color:C.muted,fontSize:10,lineHeight:15,marginTop:8},editionPicker:{gap:8,marginTop:12},editionChip:{minHeight:58,backgroundColor:C.white,borderRadius:16,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line},editionChipActive:{borderColor:C.green,backgroundColor:C.mint},editionFlag:{fontSize:20},arabicReference:{backgroundColor:C.yellow,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:'#E5D4A6'},comparisonColumns:{gap:12,paddingVertical:12,paddingRight:20},comparisonText:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,marginTop:12},mushafPage:{width:'100%',maxWidth:900,alignSelf:'center',padding:20,paddingBottom:60},mushafNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},pageJump:{flex:1,minWidth:0,alignItems:'center'},pageInput:{minWidth:74,textAlign:'center',color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:28,borderBottomWidth:1,borderColor:C.line,paddingVertical:4,outlineStyle:'none'} as any,pageProgress:{height:5,borderRadius:4,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:16},mushafSheet:{backgroundColor:'#FFFDF8',borderRadius:24,padding:20,borderWidth:1,borderColor:'#DED7C9',...soft},mushafAyah:{paddingVertical:12,borderBottomWidth:1,borderColor:'#E9E1D5'},mushafSurah:{textAlign:'center',color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:20,backgroundColor:C.mint,borderRadius:16,paddingVertical:8,marginBottom:12},verseMarker:{color:C.gold,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17},mushafTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:8},topicGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},topicWrap:{width:'48%'},topicCard:{minHeight:190,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},vocabStats:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},flashcard:{minHeight:330,backgroundColor:C.white,borderRadius:28,padding:24,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...shadow},flashIndex:{position:'absolute',top:18,right:18,color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},flashArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:58,lineHeight:86,textAlign:'center'},flashTransliteration:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:28,marginTop:12},flashMeaning:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:18,marginVertical:8,textAlign:'center'},flashHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:16},tajweedPractice:{backgroundColor:C.white,borderRadius:24,padding:20,marginTop:16,borderWidth:1,borderColor:C.line,...soft},tajweedRule:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,padding:12,borderBottomWidth:1,borderColor:C.line},tajweedSwatch:{width:18,height:44,borderRadius:9},compareCard:{backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...soft},juzGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},juzCard:{width:'22.8%',aspectRatio:1,backgroundColor:C.white,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},juzNo:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:23},preloadScore:{backgroundColor:C.white,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line},cacheUsage:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:8},preloadTrack:{height:9,borderRadius:4,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:12},preloadFill:{height:'100%',backgroundColor:C.green,borderRadius:4},planGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},planCard:{width:'48%',minHeight:130,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},planDays:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:36},planToday:{backgroundColor:C.white,borderRadius:20,padding:16,marginTop:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},practiceLaunch:{backgroundColor:C.mint,borderRadius:20,padding:16,marginBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#CFC7EE'},recallCard:{minHeight:340,backgroundColor:C.white,borderRadius:28,padding:20,borderWidth:1,borderColor:C.line,...shadow},recallPrompt:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,lineHeight:29,marginTop:28,textAlign:'center'},recallArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:32,lineHeight:58,textAlign:'right',marginTop:24,paddingTop:20,borderTopWidth:1,borderColor:C.line},revealArea:{flex:1,minHeight:110,alignItems:'center',justifyContent:'center',gap:8,marginTop:20,borderTopWidth:1,borderColor:C.line},hifzStatus:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,textTransform:'uppercase'},intro:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:19,marginTop:0,marginBottom:20},exploreGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},exploreCard:{flexGrow:1,flexBasis:'31%',minWidth:150},exploreCardInner:{minHeight:164,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},exploreTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold',marginTop:12},exploreBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:15,marginTop:4,flex:1},exploreArrow:{width:29,height:29,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'},apiPanel:{backgroundColor:C.deep,borderRadius:24,padding:20,marginTop:12},apiTitle:{color:C.onAccent,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:16},apiText:{color:'#D9D3F3',fontSize:10,marginTop:4},
 toolPage:{flex:1,width:'100%',maxWidth:780,alignSelf:'center',alignItems:'center',padding:24,paddingTop:32},toolEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:20},compass:{width:260,height:260,borderRadius:130,backgroundColor:C.white,borderWidth:12,borderColor:'#E4DFFA',alignItems:'center',justifyContent:'center',marginTop:32,...shadow},north:{position:'absolute',top:12,color:C.coral,fontSize:10,fontFamily:'DMSans_700Bold'},compassArrow:{alignItems:'center',justifyContent:'center'},kaaba:{position:'absolute',right:43,bottom:47,width:31,height:31,backgroundColor:'#111C18',borderRadius:4},kaabaGold:{height:5,backgroundColor:C.gold,marginTop:8},direction:{color:C.ink,fontSize:31,fontFamily:'DMSans_700Bold',marginTop:24},directionText:{color:C.muted,fontSize:11,marginTop:4},primary:{backgroundColor:C.accent,paddingHorizontal:20,paddingVertical:12,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:16,marginTop:20},primaryText:{color:C.onAccent,fontSize:11,fontFamily:'DMSans_700Bold'},tasbihAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:32,marginTop:16},counter:{width:205,height:205,borderRadius:103,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',borderWidth:12,borderColor:'#E4DEFA',marginVertical:32,...shadow},counterNo:{color:C.onAccent,fontSize:58,fontFamily:'DMSans_700Bold'},counterGoal:{color:'#DDD6FF',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.3},secondary:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,backgroundColor:C.white,paddingHorizontal:16,paddingVertical:12,borderRadius:16,borderWidth:1,borderColor:C.line,marginHorizontal:4},secondaryText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
 summaryScore:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',justifyContent:'space-between',...shadow},summaryDay:{minHeight:66,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,borderBottomWidth:1,borderColor:C.line},summaryDots:{flexDirection:'row',gap:4},summaryDot:{width:8,height:8,borderRadius:4,backgroundColor:'#E2DEE8'},summaryDotDone:{backgroundColor:C.green},cityGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},cityCard:{width:'48.5%',minHeight:76,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...soft},cityCardActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},cityName:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},formCard:{backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},fieldRow:{flexDirection:'row',gap:12},textField:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:16,padding:12,fontSize:13,color:C.ink,marginTop:8,outlineStyle:'none'} as any,dangerButton:{padding:16,alignItems:'center',marginTop:12},dangerText:{color:C.coral,fontFamily:'DMSans_700Bold',fontSize:11},healthCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,marginBottom:16,...soft},healthDot:{width:10,height:10,borderRadius:5},actionRow:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:8,marginTop:4},audioPreview:{backgroundColor:C.deep,borderRadius:24,padding:16,flexDirection:'row',alignItems:'center',gap:12},audioPlay:{width:48,height:48,borderRadius:24,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'},guideGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},guideCard:{flexGrow:1,flexBasis:'30%',minWidth:150},guideCardInner:{minHeight:180,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},guideArabic:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:27,lineHeight:47,textAlign:'right',backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:16},guideStep:{flexDirection:'row',gap:12,padding:16,borderBottomWidth:1,borderColor:C.line,alignItems:'flex-start'},stepNo:{width:28,height:28,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},stepNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},guideStepText:{flex:1,color:C.ink,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:19},guideNote:{backgroundColor:C.yellow,borderRadius:20,padding:16,marginTop:16},referenceRow:{minHeight:54,backgroundColor:C.white,borderRadius:16,paddingHorizontal:16,marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},dataPage:{width:'100%',maxWidth:860,alignSelf:'center',padding:20,paddingBottom:156},empty:{backgroundColor:C.white,borderRadius:24,padding:24,alignItems:'center',borderWidth:1,borderColor:C.line},dataTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,marginTop:16,marginBottom:8},dataCard:{backgroundColor:C.white,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...soft},dataArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:27,lineHeight:48,textAlign:'right'},dataName:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dataBody:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:18,marginTop:4},dataMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',marginTop:12,textTransform:'uppercase'},inputLabel:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:12},moneyInput:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:20,padding:16,fontSize:24,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:8,outlineStyle:'none'} as any,zakatResult:{borderRadius:24,padding:20,marginTop:12},zakatNo:{color:C.onAccent,fontSize:34,fontFamily:'DMSans_700Bold',marginTop:8},
 profileName:{color:C.onAccent,fontSize:18,fontFamily:'DMSans_700Bold'},profileSub:{color:'#C2DED3',fontSize:10,marginTop:4},privacyHero:{borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',gap:12,...shadow},privacyPoints:{flexDirection:'row',gap:8,marginTop:12},privacyPoint:{flex:1,backgroundColor:C.white,borderRadius:16,paddingVertical:12,alignItems:'center',gap:4,borderWidth:1,borderColor:C.line},privacyPointText:{color:C.ink,fontSize:10,fontFamily:'DMSans_700Bold',textAlign:'center'},preferencePanel:{backgroundColor:C.white,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...soft},preferenceHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16},choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},choiceRow:{flexDirection:'row',gap:8},choicePill:{minHeight:44,justifyContent:'center',minWidth:44,alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderRadius:12,backgroundColor:C.bg,borderWidth:1,borderColor:C.line},choicePillActive:{backgroundColor:C.accent,borderColor:C.green},choiceText:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},choiceTextActive:{color:C.onAccent},preferenceLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1,marginTop:16,marginBottom:8},settings:{backgroundColor:C.white,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...soft},setting:{minHeight:69,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},settingName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
 locationGate:{flexDirection:'row',gap:16,alignItems:'flex-start',backgroundColor:C.card,borderRadius:24,padding:20,borderWidth:1,borderColor:C.line,...soft},locationGateNarrow:{flexDirection:'column',alignItems:'stretch'},locationGateTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16},locationGateBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},locationActions:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:16},locationActionsNarrow:{flexDirection:'column',alignItems:'stretch'},primarySmall:{backgroundColor:C.accent,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostSmall:{backgroundColor:C.mint,paddingHorizontal:16,paddingVertical:12,borderRadius:12,minHeight:44,justifyContent:'center'},ghostText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
 prayerTools:{flexDirection:'row',flexWrap:'wrap',gap:8},prayerTool:{flexGrow:1,flexBasis:'30%',minWidth:220},prayerToolInner:{minHeight:86,flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.white,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line},prayerToolText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,flex:1},
 libraryKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.7,marginTop:24},libraryHeading:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:4,marginBottom:12},
 calendarIntro:{backgroundColor:C.deep,borderRadius:24,padding:20},calendarMonth:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:29,marginTop:16},calendarHijri:{color:'#D9D3F3',fontFamily:'DMSans_400Regular',fontSize:12,marginTop:4},weekHead:{flexDirection:'row',marginTop:16},weekLabel:{width:'14.285%',textAlign:'center',color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11},calendarGrid:{flexDirection:'row',flexWrap:'wrap',marginTop:8,backgroundColor:C.white,borderRadius:24,padding:8,borderWidth:1,borderColor:C.line},calendarCell:{width:'14.285%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderRadius:12},calendarToday:{backgroundColor:C.mint,borderWidth:1,borderColor:'#D7CFFF'},gregorianDay:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:15},hijriDay:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:2},calendarLegend:{flexDirection:'row',alignItems:'center',gap:8,marginTop:12},legendDot:{width:8,height:8,borderRadius:4,backgroundColor:C.green},
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
 playerTitle:{color:C.onAccent,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:12,textAlign:'center'},
 playerPerformer:{color:'#C7C2E4',fontSize:11,marginTop:4},
 trackBadge:{marginTop:12,backgroundColor:'rgba(255,255,255,.14)',borderRadius:12,paddingHorizontal:12,paddingVertical:8},
 trackBadgeText:{color:'#FFE2A1',fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.1},
 playerArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:26,lineHeight:46,textAlign:'right',marginTop:20,direction:'rtl'} as any,
 audioTimes:{flexDirection:'row',justifyContent:'space-between',marginTop:16},
 audioControls:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:16,marginTop:16},
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
 audioEntryInner:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:24,padding:16,borderWidth:1,borderColor:C.line,...soft},
 surahNo:{width:40,height:40,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
 surahNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithProgressHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  hadithProgressName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  hadithTrack:{height:6,borderRadius:3,backgroundColor:C.line,marginTop:8,overflow:'hidden'},
  hadithFill:{height:'100%',borderRadius:4,backgroundColor:C.green},
  hadithCollectionCard:{backgroundColor:C.card,borderRadius:20,padding:16,marginBottom:12,borderWidth:1,borderColor:C.line,...soft},
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
  recentChipWide:{minWidth:150,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...soft},
  recentChipTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:4},
  duaKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.2,marginTop:12,marginBottom:4},
  duaTransliteration:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13,lineHeight:22,fontStyle:'italic'},
  duaRefToggle:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:12},
  duaReference:{color:C.muted,fontSize:11,lineHeight:18,marginTop:8},
  duaShortcutGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  duaShortcut:{width:'48.7%',backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...soft},
  duaShortcutLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  duaCategoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4},
  duaCategoryCard:{width:'48.7%',minHeight:88,backgroundColor:C.card,borderRadius:20,padding:12,borderWidth:1,borderColor:C.line,...soft},
  duaCategoryNo:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
  duaCategoryName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12,marginTop:4},
  offlineNote:{backgroundColor:C.mint,borderRadius:16,padding:12,marginBottom:12,borderWidth:1,borderColor:'#DDD6FF'},
  offlineNoteText:{color:C.green,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  tasbihCard:{backgroundColor:C.card,borderRadius:20,padding:16,alignItems:'center',marginTop:16,borderWidth:1,borderColor:C.line,...soft},
  nameOfDayCard:{backgroundColor:C.deep,borderRadius:24,padding:20,alignItems:'center',marginTop:16,...shadow},
  namesArabicLarge:{color:C.onAccent,fontFamily:'Amiri_400Regular',fontSize:38,marginTop:8,textAlign:'center'},
  namesTransliteration:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:8},
  namesArabic:{color:C.ink,fontFamily:'Amiri_400Regular',fontSize:24,textAlign:'right'},
  nameRow:{flexDirection:'row',alignItems:'flex-start',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line},
  nameNumber:{width:56,alignItems:'flex-end'},
backRow:{marginBottom:4,flexDirection:'row'},
  sectionLink:{paddingVertical: 16,marginVertical:-15,paddingHorizontal:12,marginHorizontal:-12},stopButton:{width:44,height:44,alignItems:'center',justifyContent:'center'},verseAction:{width:36,height:36,alignItems:'center',justifyContent:'center'},searchGo:{width:44,height:44,alignItems:'center',justifyContent:'center'},
pinPage:{flex:1,alignItems:'center',paddingHorizontal:24,paddingTop:4,paddingBottom:24},
pinDots:{flexDirection:'row',gap: 12,marginTop:24},
pinDot:{width:14,height:14,borderRadius:7,borderWidth:1.5,borderColor:C.line},
pinDotFilled:{backgroundColor:C.accent,borderColor:C.green},
pinDotError:{backgroundColor:C.coral,borderColor:C.coral},
pinPad:{width:'100%',maxWidth:340,gap:12,marginTop:20},
pinRow:{flexDirection:'row',gap:12},
pinKey:{flex:1,height:64,borderRadius:20,backgroundColor:C.card,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},
pinKeyGhost:{flex:1,height:64},
pinKeyText:{color:C.ink,fontSize:22,fontFamily:'DMSans_700Bold'},
pinHint:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,marginTop: 12,textAlign:'center',minHeight:20},
pinHintError:{color:C.coral},
statGrid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12},
statBox:{width:'47%',backgroundColor:C.card,borderRadius:20,padding:16,borderWidth:1,borderColor:C.line,...soft},
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
metalRow:{alignItems:'center',minHeight:56,borderBottomWidth:1,borderColor:C.line}});
  return themeDark ? remapStyles(created) : created;
}
