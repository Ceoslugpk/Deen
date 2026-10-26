function ExploreStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ExploreHome" component={ExploreHome}/><Stack.Screen name="Adhkar" component={AdhkarScreen}/><Stack.Screen name="99 Names" component={NamesScreen}/><Stack.Screen name="Prophet Names" component={ProphetNamesScreen}/><Stack.Screen name="Duas" component={DuasScreen}/><Stack.Screen name="Dua Category" component={DuaCategoryScreen}/><Stack.Screen name="Hadith" component={HadithScreen}/><Stack.Screen name="Hadith Collection" component={HadithCollectionScreen}/><Stack.Screen name="Hadith Detail" component={HadithDetailScreen}/><Stack.Screen name="Hadith Saved" component={HadithSavedScreen}/><Stack.Screen name="Worship Guides" component={GuideDirectory}/><Stack.Screen name="Guide Detail" component={GuideDetail}/></Stack.Navigator>}

function ToolsStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="ToolsHome" component={ToolsHomeScreen}/><Stack.Screen name="Prayer" component={PrayerScreen}/><Stack.Screen name="Qibla" component={QiblaScreen}/><Stack.Screen name="Location Setup" component={LocationSetupScreen}/><Stack.Screen name="Weekly Summary" component={WeeklySummaryScreen}/><Stack.Screen name="Notifications" component={NotificationScreen}/><Stack.Screen name="Adhan" component={AdhanScreen}/><Stack.Screen name="Hijri Calendar" component={HijriCalendarScreen}/><Stack.Screen name="Ramadan" component={RamadanScreen}/><Stack.Screen name="Fasting" component={FastingScreen}/><Stack.Screen name="Mosques" component={DataTool}/><Stack.Screen name="Zakat" component={ZakatScreen}/><Stack.Screen name="Tasbih" component={TasbihScreen}/></Stack.Navigator>}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, Image, ImageBackground, Linking, Platform, Pressable,
  I18nManager, RefreshControl, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Switch, Text, TextInput,
  PanResponder, useWindowDimensions, View,
} from 'react-native';
import { createNavigationContainerRef, NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
const KFGQPCUthmanicHafs = require('./assets/fonts/KFGQPCUthmanicHafs.ttf');
const IBMPlexSansArabic_400Regular = require('./assets/fonts/IBMPlexSansArabic-Regular.ttf');
const IBMPlexSansArabic_600SemiBold = require('./assets/fonts/IBMPlexSansArabic-SemiBold.ttf');
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomIcon, { iconTheme } from './src/components/CustomIcon';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/dm-sans/useFonts';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { Newsreader_600SemiBold } from '@expo-google-fonts/newsreader/600SemiBold';
import { NotoNaskhArabic_400Regular } from '@expo-google-fonts/noto-naskh-arabic/400Regular';
import { NotoNaskhArabic_600SemiBold } from '@expo-google-fonts/noto-naskh-arabic/600SemiBold';
import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import {
  AudioEdition, Chapter, DailyAyah, DailyHadith, DivineName, getAyahEditions, getAyahOfDay, getChapters, getDailyHadith, getDuas, getQuranEditions,
  getGregorianCalendar, getNameOfDay, getNames, getNearbyMosques, getPrayerSnapshot, getQibla, getRamadanCalendar,
  getHizbVerses, getJuzVerses, getPageVerses, getVerses, searchQuran, CalendarDay, Prayer, PrayerSnapshot, QuranEdition, QuranSearchResult, SurahReciter, Verse,
} from './src/services/api';
import {
  DEFAULT_WORSHIP_SETTINGS, loadDailyContent, loadPrayerCache, loadPrayerCompletion, loadPrayerHistory, loadQuickTasbih, loadStoredLocation, loadWorshipSettings,
  saveDailyContent, savePrayerCache, savePrayerCompletion, saveQuickTasbih, saveStoredLocation, saveWorshipSettings,
  WorshipSettings,
} from './src/services/localState';
import { getNotificationHealth, NotificationHealth, requestNotificationPermission, schedulePrayerNotifications, sendTestNotification } from './src/services/notifications';
import { WORSHIP_GUIDES, WorshipGuide } from './src/content/worshipGuides';
import { QURAN_TOPICS, QURAN_VOCABULARY, TAJWEED_RULES } from './src/content/quranStudy';
import { addSearchHistory, clearSearchHistory, clearSurahCache, deleteNote, HifzStatus, loadBookmarks, loadHifz, loadNotes, loadPlan, loadQuranPreferences, loadReadingPosition, loadRecentSurahs, loadSearchHistory, loadSurahCache, loadSurahCacheIndex, loadVocabularyProgress, QuranBookmark, QuranNote, QuranPreferences, removeSearchHistory, saveHifz, saveNote, savePlan, saveQuranPreferences, saveReadingPosition, saveSurahCache, saveVocabularyProgress, toggleBookmark } from './src/services/quranState';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Clipboard from 'expo-clipboard';
import { getCacheUsage, getCachedJson, setCachedJson } from './src/services/contentCache';
import { AudioSession, AudioSettings, AudioTrackKind, buildQueueForChapter, buildSurahQueue, loadSurahReciters, clearQueue, clearRecentPlays, deletePlaylist, formatClock, getAudioSettings, loadAudioEditions, loadAudioSession, loadAudioSettings, loadPlaylists, loadRecentPlays, nextTrack, playQueue, Playlist, previousTrack, RecentPlay, removeFromQueue, saveAudioSettings, savePlaylist, seekTo, selectQueueItem, setPlaybackRate, setRepeatMode, stopPlayback, togglePlayback, useAudio } from './src/services/audioService';
import { getHadithPage, getHadith, getLoadedCollections, getNeighbours, whenArabicReady, hadithReference, HADITH_COLLECTIONS, Hadith, HadithCollectionData, isHadithSaved, loadHadithCollection, loadHadithState, markHadithRead, removeHadithBookmark, searchLoadedCollections, toggleHadithSaved, useHadithState } from './src/services/hadithService';
import { loadDuaCategories, loadDuas } from './src/services/duaService';
import { loadNameLanguage, loadNameOfDay, loadNames, saveNameLanguage } from './src/services/namesService';
import { ARABIC_UI, ARABIC_UI_SEMIBOLD, ensureQuranFont, quranFontFamily as quranFont, QURAN_FONTS, useQuranFont } from './src/services/fonts';
import { clearFastDay, FastType, labelForEntry, loadFastingState, MISSED_REASONS, MissedReason, recordFast, readableDate, setFastingOwed, summariseFasting, useFasting } from './src/services/fastingService';
import { buildWeeklySummary, loadActivity, logHifzReview, logMushafPage, logSurahOpen, logVerseRead, useActivity } from './src/services/activityService';
import { downloadSurahAudio, loadDownloads, downloadSurahText, estimateFreeBytes, formatBytes, pauseDownload, removeDownload, resolveAudioSource, resumeDownload, retryDownload, totalDownloadBytes, useDownloads } from './src/services/downloadService';
import { NAME_LANGUAGES } from './src/services/api';
import { PROPHETS } from './src/content/prophets';
import { currentPhrase, DHIKR_PHRASES, loadTasbihState, removeTasbihSession, resetTasbihCount, saveTasbihSession, setTasbihGoal, setTasbihPhrase, TASBIH_GOALS, tapTasbih, todayTotal, useTasbih } from './src/services/tasbihService';
import { Dua, DuaCategory } from './src/services/api';
import { clearPreparedQuran, getPreloadState, pauseQuranPreload, refreshPreload, resumeSavedQuranPreload, startQuranPreload, subscribePreload } from './src/services/quranPreload';

const C = {
  bg: '#F7F5F2', card: '#FFFDF9', ink: '#25233A', muted: '#747381',
  green: '#5146A4', green2: '#665AB4', deep: '#292744', teal: '#2F6F73',
  mint: '#F2EFF8', blue: '#F1F0F5', peach: '#F4F0EE', lilac: '#F2EFF6',
  yellow: '#F5F0E4', cyan: '#EEF3F2', gold: '#B49352', line: '#E7E2E5',
  coral: '#8B5960', white: '#FFFFFF',
};
const shadow = { shadowColor: '#292750', shadowOffset: { width: 0, height: 10 }, shadowOpacity: .11, shadowRadius: 24, elevation: 5 };
const soft = { shadowColor: '#3B3568', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .07, shadowRadius: 14, elevation: 2 };
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
  const [location,setLocation]=useState<AppLocation|null>(null); const [locating,setLocating]=useState(false);
  useEffect(()=>{loadStoredLocation().then(saved=>saved&&setLocation(saved))},[]);
  const commit=(next:AppLocation|null)=>{setLocation(next);saveStoredLocation(next).catch(()=>{})};
  const useDubai=()=>commit({latitude:25.2048,longitude:55.2708,label:'Dubai, United Arab Emirates'});
  const useDevice=async()=>{setLocating(true);try{const permission=await Location.requestForegroundPermissionsAsync();if(permission.status!=='granted'){Alert.alert('Location permission','Location is used only when you request local prayer and Qibla information. You can select a manual location instead.');return}const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});const places=await Location.reverseGeocodeAsync(pos.coords);const place=places[0];commit({latitude:pos.coords.latitude,longitude:pos.coords.longitude,label:[place?.city,place?.country].filter(Boolean).join(', ')||'Current location'});}catch(e:any){Alert.alert('Location unavailable',e.message)}finally{setLocating(false)}};
  return <LocationContext.Provider value={{location,locating,useDevice,useDubai,setManual:commit,clear:()=>commit(null)}}>{children}</LocationContext.Provider>;
}
function useAppLocation(){const value=useContext(LocationContext);if(!value)throw new Error('Location provider missing');return value}
type AppLanguage='en'|'ar';
type LanguageState={language:AppLanguage;rtl:boolean;setLanguage:(language:AppLanguage)=>void};
const LanguageContext=createContext<LanguageState>({language:'en',rtl:false,setLanguage:()=>{}});
function LanguageProvider({children}:{children:React.ReactNode}){const[language,setLanguageState]=useState<AppLanguage>('en');const rtl=language==='ar';const setLanguage=(next:AppLanguage)=>{setLanguageState(next);I18nManager.allowRTL(true);if(Platform.OS!=='web'&&I18nManager.isRTL!==(next==='ar'))I18nManager.forceRTL(next==='ar')};useEffect(()=>{if(Platform.OS==='web'&&typeof document!=='undefined'){document.documentElement.dir='ltr';document.documentElement.lang=language;document.documentElement.dataset.appDirection=rtl?'rtl':'ltr'}},[rtl,language]);return <LanguageContext.Provider value={{language,rtl,setLanguage}}>{children}</LanguageContext.Provider>}
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
  const theme = iconTheme(String(name)); return <View style={[s.motionGlyph,!inverse&&{backgroundColor:theme.bg,borderColor:theme.border},inverse&&s.motionGlyphInverse]}><Animated.View style={{ transform: [{ scale: enter }, { translateY: lift }] }}>{ico(name,size,inverse?C.white:theme.fg)}</Animated.View><View style={[s.glyphDot,{backgroundColor:inverse?'#FFE09B':theme.accent}]} /></View>;
}
const TOOL_IMAGES:Record<string,any>={
  Quran:require('./assets/tool-icons/quran.png'),
  Qibla:require('./assets/tool-icons/qibla.png'),
  Prayer:require('./assets/tool-icons/salah-guide.png'),
  Tools:require('./assets/tool-icons/tab-tools.png'),
  Duas:require('./assets/tool-icons/duas.png'),
  Tasbih:require('./assets/tool-icons/tasbih.png'),
  Hijri:require('./assets/tool-icons/hijri.png'),
  'Hijri calendar':require('./assets/tool-icons/hijri.png'),
  Ramadan:require('./assets/tool-icons/ramadan.png'),
  Hadith:require('./assets/tool-icons/hadith.png'),
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
};
function ToolGraphic({tool,size=58}:{tool:string;size?:number}){const image=TOOL_IMAGES[tool];const enter=useRef(new Animated.Value(.78)).current;const fade=useRef(new Animated.Value(0)).current;useEffect(()=>{Animated.parallel([Animated.spring(enter,{toValue:1,friction:6,tension:75,useNativeDriver:true}),Animated.timing(fade,{toValue:1,duration:350,useNativeDriver:true})]).start()},[]);return <Animated.View accessibilityElementsHidden style={[s.graphicFrame,{width:size,height:size,opacity:fade,transform:[{scale:enter}]}]}>{image?<Image source={image} resizeMode="contain" style={{width:size-6,height:size-6}}/>:ico('sparkles-outline',size*.48,C.green)}</Animated.View>}
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
function Spinner() { return <View style={s.loading}><ActivityIndicator color={C.green} /><Text style={s.loadingText}>Loading live data…</Text></View>; }
function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <View style={s.error}><View style={s.errorIcon}>{ico('cloud-offline-outline', 24, C.coral)}</View><Text style={s.errorTitle}>Couldn’t load live data</Text><Text style={s.errorText}>{message}</Text>{retry && <Pressable onPress={retry} style={s.retry}><Text style={s.retryText}>Try again</Text></Pressable>}</View>; }
function TopBar({ overline, title, right }: { overline?: string; title: string; right?: React.ReactNode }) { return <View style={s.topbar}><View><Text style={s.overline}>{overline}</Text><Text style={s.h1}>{title}</Text></View>{right}</View>; }
function IconButton({ name, onPress, dark = false }: { name: any; onPress?: () => void; dark?: boolean }) { return <Pressable onPress={onPress} style={({pressed}) => [s.iconBtn, dark && s.iconBtnDark, pressed && s.press]}>{ico(name, 20, dark ? C.white : C.ink)}</Pressable>; }
function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {const{rtl}=useLanguage();return <View style={s.section}><Text style={s.h2}>{title}</Text>{action&&<Pressable onPress={onPress}><Text style={s.sectionAction}>{rtl?'←  ':''}{action}{rtl?'':'  →'}</Text></Pressable>}</View>}
function LiveBadge({ source }: { source: string }) { return <View style={s.liveBadge}><View style={s.liveDot} /><Text style={s.liveText}>LIVE · {source}</Text></View>; }
function LocationPrompt({compact=false}:{compact?:boolean}){const loc=useAppLocation();const navigation=useNavigation<any>();const{width}=useWindowDimensions();const manual=()=>{const names=navigation.getState()?.routeNames||[];names.includes('Location Setup')?navigation.navigate('Tools',{screen:'Location Setup'}):navigation.navigate('Tools',{screen:'Location Setup'})};return <View style={[s.locationGate,width<370&&s.locationGateNarrow,compact&&{marginVertical:14}]}><ToolGraphic tool="Location" size={54}/><View style={{flex:1,width:width<370?'100%':undefined}}><Text style={s.locationGateTitle}>Choose your prayer location</Text><Text style={s.locationGateBody}>No location is assumed. Use GPS once, select a city, or enter coordinates manually.</Text><View style={[s.locationActions,width<370&&s.locationActionsNarrow]}><Pressable accessibilityLabel="Use my current location" onPress={loc.useDevice} style={s.primarySmall}><Text style={s.primaryText}>{loc.locating?'Locating…':'Use my location'}</Text></Pressable><Pressable accessibilityLabel="Choose prayer location manually" onPress={manual} style={s.ghostSmall}><Text style={s.ghostText}>Choose manually</Text></Pressable></View></View></View>}

function SlidingCards<T>({label,items,cardWidth,renderItem}:{label:string;items:T[];cardWidth:number;renderItem:(item:T,index:number)=>React.ReactNode}){
  const ref=useRef<any>(null);const[active,setActive]=useState(0);const{rtl}=useLanguage();const stride=cardWidth+12;
  const go=(index:number)=>{const next=Math.max(0,Math.min(items.length-1,index));setActive(next);ref.current?.scrollTo({x:next*stride,animated:true})};
  return <View accessible accessibilityLabel={`${label}, card ${active+1} of ${items.length}`}>
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} snapToInterval={stride} snapToAlignment="start" decelerationRate="fast" directionalLockEnabled contentContainerStyle={s.sliderContent} style={{direction:'ltr'} as any} onMomentumScrollEnd={(event:any)=>setActive(Math.max(0,Math.min(items.length-1,Math.round(event.nativeEvent.contentOffset.x/stride))))}>
      {items.map((item,index)=><View key={index} style={{width:cardWidth,direction:rtl?'rtl':'ltr'} as any}>{renderItem(item,index)}</View>)}
    </ScrollView>
    <View style={s.sliderControls}><Text style={s.sliderHint}>{active+1} / {items.length} · Swipe or use arrows</Text><View style={s.sliderButtons}><Pressable accessibilityLabel={`Previous ${label} card`} accessibilityState={{disabled:active===0}} disabled={active===0} onPress={()=>go(active-1)} style={[s.sliderButton,active===0&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-forward':'arrow-back',16,C.ink)}</Pressable><Pressable accessibilityLabel={`Next ${label} card`} accessibilityState={{disabled:active===items.length-1}} disabled={active===items.length-1} onPress={()=>go(active+1)} style={[s.sliderButton,active===items.length-1&&s.sliderButtonDisabled]}>{ico(rtl?'arrow-back':'arrow-forward',16,C.ink)}</Pressable></View></View>
  </View>
}

type DailyContentCache={ayah:DailyAyah;hadith:DailyHadith;name:DivineName;dua:any};
function useHomeData() {
  const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const dateKey=new Date().toISOString().slice(0,10);
  const [snapshot,setSnapshot]=useState<PrayerSnapshot|null>(null); const[ayah,setAyah]=useState<DailyAyah|null>(null); const[hadith,setHadith]=useState<DailyHadith|null>(null); const[name,setName]=useState<DivineName|null>(null); const[dua,setDua]=useState<any>(null); const[cached,setCached]=useState(false); const[error,setError]=useState('');
  const applyDaily=(daily:DailyContentCache)=>{setAyah(daily.ayah);setHadith(daily.hadith);setName(daily.name);setDua(daily.dua)};
  const load=async()=>{if(!location)return;setError('');try{const[p,a,h,n,duas]=await Promise.all([managedPrayerSnapshot(location,settings),getAyahOfDay(),getDailyHadith(),getNameOfDay(),getDuas('morning')]);const daily={ayah:a,hadith:h,name:n,dua:duas[0]};setSnapshot(p.snapshot);setCached(p.cached);applyDaily(daily);await saveDailyContent(dateKey,daily);}catch(e:any){const saved=await loadDailyContent<DailyContentCache>(dateKey);if(saved){applyDaily(saved);setCached(true)}else setError(e.message||'Please check your connection.')}};
  useEffect(()=>{loadDailyContent<DailyContentCache>(dateKey).then(saved=>saved&&applyDaily(saved));setSnapshot(null);if(location)load()},[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
  return{snapshot,ayah,hadith,name,dua,location,cached,error,load};
}
function getNext(prayers: Prayer[]) {
  const d = new Date(); const now = d.getHours() * 60 + d.getMinutes();
  return prayers.find(p => { const [h,m] = p.raw.split(':').map(Number); return h*60+m > now; }) || prayers[0];
}
function untilPrayer(prayer?: Prayer) {
  if (!prayer) return '';
  const [h,m] = prayer.raw.split(':').map(Number); const now = new Date(); const target = new Date(); target.setHours(h,m,0,0); if (target < now) target.setDate(target.getDate()+1);
  const mins = Math.max(0, Math.floor((target.getTime()-now.getTime())/60000)); return `${Math.floor(mins/60)}h ${mins%60}m`;
}

function HomeScreen() {
  const hour=new Date().getHours();const greeting=hour<12?'A purposeful morning':hour<18?'A purposeful afternoon':'A peaceful evening'; const nav = useNavigation<any>(); const locationState=useAppLocation(); const { width } = useWindowDimensions(); const wide = width >= 760; const data = useHomeData(); const next = data.snapshot ? getNext(data.snapshot.prayers) : undefined; const dateKey=new Date().toISOString().slice(0,10); const[completed,setCompleted]=useState<string[]>([]);const[history,setHistory]=useState<Record<string,string[]>>({});const[quickCount,setQuickCount]=useState(0);const tasbih=useTasbih();const[quranPosition,setQuranPosition]=useState<any>(null);const[refreshing,setRefreshing]=useState(false);
  const hydrateLocal=()=>Promise.all([loadPrayerCompletion(dateKey).then(setCompleted),loadPrayerHistory().then(setHistory),loadQuickTasbih().then(setQuickCount),loadReadingPosition().then(setQuranPosition)]);useEffect(()=>{hydrateLocal()},[dateKey]);useFocusEffect(useCallback(()=>{void hydrateLocal()},[]));const togglePrayer=(name:string)=>setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).then(()=>loadPrayerHistory().then(setHistory));return next});const addQuick=async()=>{await tapTasbih();if(Platform.OS!=='web')Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)};const onRefresh=async()=>{setRefreshing(true);await Promise.all([data.load(),hydrateLocal()]);setRefreshing(false)};const weekTotal=Object.entries(history).filter(([key])=>Date.now()-new Date(key).getTime()<7*86400000).reduce((sum,[,items])=>sum+items.length,0);let streak=0;for(let i=0;i<60;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if((history[key]||[]).length>=5)streak++;else if(i>0||completed.length<5)break}
  const tools = [
    {label:'Quran',description:quranPosition?`Continue ${quranPosition.surahName} at ${quranPosition.verseKey}`:'Read with verified Arabic and translation',onPress:()=>nav.navigate('Quran')},
    {label:'Qibla',description:'Find the direction of the Kaaba',onPress:()=>nav.navigate('Tools',{screen:'Qibla'})},
    hour<13?{label:'Morning Adhkar',description:'Begin the day with authentic remembrance',onPress:()=>nav.navigate('Library',{screen:'Adhkar',params:{initial:'morning'}})}:{label:'Evening Adhkar',description:'Close the day with authentic remembrance',onPress:()=>nav.navigate('Library',{screen:'Adhkar',params:{initial:'evening'}})},
    {label:'Tasbih',description:`${quickCount} counted · saved privately`,onPress:()=>nav.navigate('Tools',{screen:'Tasbih'})},
    {label:'Audio',description:'Listen to Quran recitation and Adhan',onPress:()=>nav.navigate('Quran')},
  ];
  const contentWidth=Math.min(Math.max(width-36,280),980);const essentialCardWidth=wide?Math.min(300,(contentWidth-24)/3):Math.min(318,Math.max(260,width-66));const reflectionCardWidth=wide?Math.min(310,(contentWidth-24)/3):Math.min(318,Math.max(260,width-66));
  const reflections=[{id:'ayah'},{id:'name'},{id:'dua'},{id:'tasbih'}];
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green}/>}>
    <View style={s.greeting}><View><Text style={s.salam}>السَّلَامُ عَلَيْكُمْ</Text><Text style={s.greetingTitle}>{greeting}</Text></View><View style={s.avatar}>{ico('moon',19,C.white)}</View></View>
    {!data.location?<LocationPrompt/>:data.error && !data.snapshot ? <ErrorState message={data.error} retry={data.load} /> : <>
      <View style={[s.hero,wide&&s.heroWide]}><Image source={require('./assets/hero-mosque-scene.png')} resizeMode="cover" style={s.heroBg}/>
        <LinearGradient colors={['rgba(30,30,63,.92)','rgba(56,48,103,.54)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} />
        <Pressable onPress={locationState.clear} style={s.locationPill}>{ico('location',13,'#FFE5A5')}<Text numberOfLines={1} style={s.locationText}>{data.location?.label}</Text></Pressable>
        <Text style={s.hijri}>{data.snapshot?.hijri || 'Loading Hijri date…'} · {new Date().toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}{data.cached?' · CACHED':''}</Text>
        <Text style={s.nextLabel}>NEXT · {next?.name?.toUpperCase() || '—'}</Text><Text style={s.heroTime}>{next?.time || '—'}</Text>
        <View style={s.heroFooter}><View style={s.countPill}>{ico('time-outline',14,C.white)}<Text style={s.countText}>in {untilPrayer(next)}</Text></View><Pressable onPress={()=>nav.navigate('Tools',{screen:'Prayer'})} style={s.heroCta}><Text style={s.heroCtaText}>Prayer schedule</Text>{ico('arrow-forward',15,C.white)}</Pressable></View>
      </View>
      <View style={s.prayerRail}>{data.snapshot?.prayers.filter(p=>p.name!=='Sunrise').map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole="checkbox" accessibilityState={{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.railItem,p.name===next?.name&&s.railItemActive]}><View style={[s.railIcon,checked&&{backgroundColor:C.green}]}>{ico(checked?'checkmark':['moon-outline','sunny-outline','partly-sunny-outline','cloudy-night-outline','moon-outline'][i] as any,17,checked?C.white:C.green)}</View><Text style={s.railName}>{p.name}</Text><Text style={s.railTime}>{p.time.replace(' ','\n')}</Text></Pressable>})}</View><View style={s.homeProgress}><View><Text style={s.sourceTitle}>{completed.length}/5 prayers today</Text><Text style={s.sourceBody}>{streak} day streak · {weekTotal}/35 this week</Text></View><View style={s.homeProgressRing}><Text style={s.progressCount}>{completed.length*20}%</Text></View></View>
    </>}
    <Section title="For your day" action="All tools" onPress={()=>nav.navigate('Library')} />
    <SlidingCards label="Daily essentials" items={tools} cardWidth={essentialCardWidth} renderItem={(tool:any)=><MotionPress onPress={tool.onPress} style={{width:'100%'}}><View style={s.essentialSlide}><View style={s.essentialTop}><ToolGraphic tool={tool.label} size={66}/><View style={s.essentialArrow}>{ico('arrow-forward',16,C.green)}</View></View><Text style={s.essentialTitle}>{tool.label}</Text><Text style={s.essentialBody}>{tool.description}</Text></View></MotionPress>}/>
    <Section title="Daily reflection" action="Refresh" onPress={onRefresh}/>
    <SlidingCards label="Daily reflections" items={reflections} cardWidth={reflectionCardWidth} renderItem={(item:any)=>item.id==='ayah'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>AYAH OF THE DAY</Text><Text numberOfLines={3} style={s.dailyArabic}>{data.ayah?.arabic||'Loading verified Quran text…'}</Text><Text numberOfLines={4} style={s.dailyBody}>{data.ayah?.translation}</Text><Text style={s.dataMeta}>{data.ayah?.reference}</Text></View>:item.id==='name'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>NAME OF ALLAH</Text><Text style={s.nameOfDay}>{data.name?.name}</Text><Text style={s.dailyTitle}>{data.name?.transliteration}</Text><Text style={s.dailyBody}>{data.name?.meaning}</Text></View>:item.id==='dua'?<View style={s.reflectionSlide}><Text style={s.dailyKicker}>DUA OF THE DAY</Text><Text numberOfLines={3} style={s.dailyArabic}>{data.dua?.arabic||'Loading verified dua…'}</Text><Text numberOfLines={4} style={s.dailyBody}>{data.dua?.translation}</Text></View>:<Pressable accessibilityRole="button" accessibilityLabel={`Quick Tasbih, ${quickCount}. Tap to count`} onPress={addQuick} style={[s.reflectionSlide,s.quickTasbih]}><ToolGraphic tool="Tasbih" size={56}/><Text style={s.dailyKicker}>QUICK TASBIH</Text><Text style={s.quickCount}>{todayTotal(tasbih)}</Text><Text style={s.dailyBody}>{currentPhrase(tasbih).transliteration} · tap to count</Text></Pressable>}/>
    <Pressable onPress={()=>nav.navigate('Tools',{screen:'Weekly Summary'})} style={s.weekSummary}><View><Text style={s.weekSummaryTitle}>This week</Text><Text style={s.weekSummaryBody}>{weekTotal} of 35 prayers marked · {streak} day streak</Text></View>{ico('arrow-forward',18,C.white)}</Pressable>
    <Section title="Continue reading" action="Open Quran" onPress={()=>nav.navigate('Quran')} />
    <View style={s.readCard}><Image source={require('./assets/quran-scene.png')} resizeMode="cover" style={s.heroBg}/>
      <LinearGradient colors={['rgba(39,34,82,.95)','rgba(76,58,130,.55)','rgba(11,120,145,.08)']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill} />
      <Text style={s.readKicker}>{quranPosition?'CONTINUE READING':'FEATURED READING'}</Text><Text style={s.readArabic}>{quranPosition?'۝':'يس'}</Text><Text style={s.readTitle}>{quranPosition?quranPosition.surahName:'Surah Ya-Sin'}</Text><Text style={s.readMeta}>{quranPosition?`${quranPosition.verseKey} · Page ${quranPosition.page||'—'}`:'83 verses · Makkan'}</Text><Pressable onPress={()=>nav.navigate('Quran',{screen:'Reader',params:{chapter:quranPosition?{id:quranPosition.surahId,name_simple:quranPosition.surahName,name_arabic:'',verses_count:0}:{id:36,name_simple:'Ya-Sin',name_arabic:'يس',verses_count:83},focusVerse:quranPosition?.verseKey}})} style={s.whiteButton}><Text style={s.whiteButtonText}>{quranPosition?'Continue':'Read now'}</Text>{ico('arrow-forward',14,C.green)}</Pressable>
    </View>
    <Section title="Hadith of the day" />
    <View style={s.hadithCard}><Text style={s.quote}>“</Text><Text numberOfLines={6} style={s.hadithText}>{data.hadith?.text || 'Loading today’s authenticated hadith…'}</Text><View style={s.hadithFoot}><Text style={s.meta}>{data.hadith ? `${data.hadith.collection.toUpperCase()} · ${data.hadith.number}` : ''}</Text>{ico('bookmark-outline',20,C.green)}</View></View>
  </ScrollView></Page>;
}
const CARD_GREEN = { backgroundColor: '#EEEAFF' }; const CARD_GOLD = { backgroundColor: '#FFF1DD' };

const PRAYER_TOOLS: [string, string, string][] = [
  ['Prayer', 'Today’s times, the next one, and what you completed', 'Prayer'],
  ['Qibla', 'Face the Kaaba from where you stand', 'Qibla'],
  ['Adhan', 'Which call plays, and how it is announced', 'Adhan'],
  ['Notifications', 'Reminders for each prayer and for dhikr', 'Notifications'],
  ['Location', 'Choose a city, coordinates, or let the phone decide', 'Location Setup'],
  ['Hijri Calendar', 'Dates, months, and the days that matter', 'Hijri Calendar'],
  ['Ramadan', 'Suhoor and Iftar for every day of the month', 'Ramadan'],
  ['Fasting', 'Your fasts, missed days, and make-up record', 'Fasting'],
  ['Weekly Summary', 'Seven days of worship in one page', 'Weekly Summary'],
];

const LIFE_TOOLS: [string, string, string][] = [
  ['Tasbih', 'A quiet counter for your dhikr', 'Tasbih'],
  ['Zakat', 'Work out what is due, and record what you gave', 'Zakat'],
  ['Mosques', 'Prayer spaces around you', 'Mosques'],
  ['Worship guides', 'Step-by-step references for each act of worship', 'Library'],
];

function ToolsHomeScreen({ navigation }: any) {
  const open = (route: string) => { if (route === 'Library') navigation.navigate('Library', { screen: 'Worship Guides' }); else navigation.navigate(route); };
  const row = ([title, caption, route]: [string, string, string]) => <Pressable key={title} onPress={() => open(route)} style={s.settings} accessibilityRole="button" accessibilityLabel={title}>
    <ToolGraphic tool={route === 'Library' ? 'Worship guides' : title} size={44} />
    <View style={{ flex: 1, marginHorizontal: 13 }}>
      <Text style={s.settingName}>{title}</Text>
      <Text style={s.meta}>{caption}</Text>
    </View>
    {ico('arrow-forward', 17, '#B9BEC9')}
  </Pressable>;
  return <Page><ToolBar title="Tools" navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Tools" size={74} />
      <Text style={s.dataTitle}>Tools</Text>
      <Text style={s.dataArabic}>أَدَوَاتٌ لِلْعِبَادَةِ</Text>
      <Text style={s.dataBody}>Everything that helps you keep a day of worship: the prayer times that move with the sun, the calendar that marks the month, and the records you keep for yourself.</Text>
      <Section title="Prayer" />{PRAYER_TOOLS.map(row)}
      <Section title="Daily life" />{LIFE_TOOLS.map(row)}
    </ScrollView>
  </Page>;
}

function PrayerScreen({navigation}:any) {
  const {location}=useAppLocation(); const {settings}=useWorshipSettings(); const [snap,setSnap]=useState<PrayerSnapshot|null>(null); const [cached,setCached]=useState(false); const [error,setError]=useState(''); const [completed,setCompleted]=useState<string[]>([]);
  const dateKey=new Date().toISOString().slice(0,10); useEffect(()=>{loadPrayerCompletion(dateKey).then(setCompleted)},[dateKey]);
  const togglePrayer=(name:string)=>{if(name==='Sunrise')return;setCompleted(current=>{const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];savePrayerCompletion(dateKey,next).catch(()=>{});return next})};
  const load=async()=>{if(!location)return;setError('');try{const value=await managedPrayerSnapshot(location,settings);setSnap(value.snapshot);setCached(value.cached);if(settings.remindersEnabled)schedulePrayerNotifications(value.snapshot,settings).catch(()=>{})}catch(e:any){setError(e.message)}}; useEffect(()=>{setSnap(null);load()},[location?.latitude,location?.longitude,settings.calculationMethod,settings.madhab,settings.timeFormat]);
  const next=snap?getNext(snap.prayers):undefined; const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d;}); const done=completed.length;
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><TopBar overline={cached?'SAVED ON DEVICE':'TODAY'} title="Prayer times" right={<ToolGraphic tool="Qibla" size={46}/>} />
    <View style={s.dayStrip}>{days.map((d,i)=><View key={i} style={[s.day,i===0&&s.dayActive]}><Text style={[s.dayName,i===0&&s.dayText]}>{d.toLocaleDateString('en',{weekday:'short'})}</Text><Text style={[s.dayNum,i===0&&s.dayText]}>{d.getDate()}</Text></View>)}</View>
    {!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!snap?<Spinner/>:<><LinearGradient colors={['#2A2849','#5146A4']} style={s.nextCard}><View>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.nextCardLabel}>NEXT PRAYER</Text><Text style={s.nextCardName}>{next?.name}</Text><Text style={s.nextCardTime}>{next?.time}</Text><View style={s.countPill}><Text style={s.countText}>Begins in {untilPrayer(next)}</Text></View></View><View style={s.moonOrb}>{ico('moon',42,'#FFE3A4')}</View></LinearGradient>
      <View style={s.prayerProgress}><View style={{flex:1}}><Text style={s.sourceTitle}>Today’s Salah</Text><Text style={s.sourceBody}>{done} of 5 prayers marked complete</Text></View><View style={s.progressTrack}><View style={[s.progressFill,{width:`${done*20}%`} as any]}/></View><Text style={s.progressCount}>{done}/5</Text></View>
      <Section title="Today’s schedule" action={`${settings.calculationMethodName} · ${settings.madhab==='hanafi'?'Hanafi':'Shafi'}`} onPress={()=>navigation.getParent()?.navigate('Settings')} />
      <View style={s.prayerList}>{snap.prayers.map((p,i)=>{const checked=completed.includes(p.name);return <Pressable accessibilityRole={p.name==='Sunrise'?undefined:'checkbox'} accessibilityState={p.name==='Sunrise'?undefined:{checked}} onPress={()=>togglePrayer(p.name)} key={p.name} style={[s.prayerRow,p.name===next?.name&&s.prayerRowLive]}><View style={[s.prayerSymbol,checked&&s.prayerSymbolDone]}>{ico(checked?'checkmark':'moon-outline',21,checked?C.white:C.green)}</View><View style={{flex:1}}><Text style={s.prayerName}>{p.name}</Text><Text style={s.meta}>{p.name==='Sunrise'?'Solar event':checked?'Completed':p.name===next?.name?'Up next':'Tap to mark complete'}</Text></View><Text style={s.prayerValue}>{p.time}</Text>{p.name!=='Sunrise'&&ico(checked?'checkmark-circle':'ellipse-outline',18,checked?C.green:C.muted)}</Pressable>})}</View>
      <View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>{cached?'Saved prayer schedule':'Live calculation'}</Text><Text style={s.sourceBody}>{snap.method} · {snap.timezone} · {settings.timeFormat}-hour</Text></View></View><Section title="Prayer tools"/><View style={s.prayerTools}>{[['compass-outline','Qibla','Qibla'],['location-outline','Location','Location Setup'],['notifications-outline','Notifications','Notifications'],['volume-high-outline','Adhan','Adhan'],['calendar-outline','Hijri calendar','Hijri Calendar'],['moon-outline','Fasting','Fasting'],['moon-outline','Ramadan','Ramadan'],['business-outline','Mosques','Mosques'],['book-outline','Worship guides','Worship Guides'],['stats-chart-outline','Weekly Summary','Weekly Summary']].map(([icon,label,screen]:any,i)=><MotionPress key={label} onPress={()=>navigation.navigate(screen)} style={s.prayerTool}><View style={s.prayerToolInner}><ToolGraphic tool={label} size={54}/><Text style={s.prayerToolText}>{label}</Text></View></MotionPress>)}</View></>}
  </ScrollView></Page>;
}

function QuranHome({navigation}:any){
 const{width}=useWindowDimensions();const wide=width>=760;const[chapters,setChapters]=useState<Chapter[]>([]);const[query,setQuery]=useState('');const[debounced,setDebounced]=useState('');const[error,setError]=useState('');const[position,setPosition]=useState<any>(null);const[bookmarkCount,setBookmarkCount]=useState(0);const[noteCount,setNoteCount]=useState(0);const[recent,setRecent]=useState<number[]>([]);const[plan,setPlanState]=useState<any>(null);const[hifz,setHifzState]=useState<Record<number,HifzStatus>>({});const[preload,setPreload]=useState(getPreloadState());const{preferences}=useQuranPreferences();
 const load=()=>getChapters().then(setChapters).catch(e=>setError(e.message));const hydrate=()=>Promise.all([loadReadingPosition().then(setPosition),loadBookmarks().then(x=>setBookmarkCount(x.length)),loadNotes().then(x=>setNoteCount(x.length)),loadRecentSurahs().then(setRecent),loadPlan().then(setPlanState),loadHifz().then(setHifzState),loadAudioSettings().then(value=>setAudioReciter(value.reciterName))]);useEffect(()=>{load();hydrate();resumeSavedQuranPreload();const unsubscribePreload=subscribePreload(setPreload);const unsubscribeFocus=navigation.addListener('focus',hydrate);return()=>{unsubscribePreload();unsubscribeFocus()}},[navigation]);useEffect(()=>{const id=setTimeout(()=>setDebounced(query.trim()),250);return()=>clearTimeout(id)},[query]);
 const shown=chapters.filter(c=>`${c.id} ${c.name_simple} ${c.name_arabic} ${c.translated_name?.name}`.toLowerCase().includes(debounced.toLowerCase()));const open=(chapter:Chapter,mode='both',focusVerse?:string)=>navigation.navigate('Reader',{chapter,mode,focusVerse});const featured={id:55,name_simple:'Ar-Rahman',name_arabic:'الرحمن',translated_name:{name:'The Most Merciful'},verses_count:78};const submit=()=>{const ref=query.match(/^(\d{1,3}):(\d{1,3})$/);if(ref){const chapter=chapters.find(c=>c.id===Number(ref[1]));if(chapter)return open(chapter,'both',query)}navigation.navigate('Quran Search',{initialQuery:query})};
 const[audioReciter,setAudioReciter]=useState('Choose a reciter');const memorized=Object.values(hifz).filter(value=>value==='memorized').length;const readActions=[{label:'Quran Search',title:'Search',caption:'Word or verse',screen:'Quran Search'},{label:'30 Juz',title:'Juz',caption:'30 sections',screen:'Juz Directory'},{label:'60 Hizb',title:'Hizb',caption:'60 divisions',screen:'Hizb Directory'}];const studyTools=[{label:'Quran Topics',title:'Quran topics',caption:'Explore faith, life and spirituality',screen:'Quran Topics'},{label:'Translation Compare',title:'Tafsir & compare',caption:'Study sources and 2–3 translations',screen:'Tafsir Compare'},{label:'Tajweed',title:'Tajweed study',caption:'Colour rules with normal-text fallback',screen:'Tajweed Study'},{label:'Quran Vocabulary',title:'Vocabulary',caption:'Review frequent Quranic words',screen:'Quran Vocabulary'}];const personalTools=[{label:'Bookmarks',value:String(bookmarkCount),caption:'saved verses',screen:'Bookmarks'},{label:'Notes',value:String(noteCount),caption:'private notes',screen:'Notes'},{label:'Reading Plans',value:plan?`${plan.days}d`:'—',caption:plan?'active plan':'choose a plan',screen:'Reading Plans'},{label:'Hifz',value:String(memorized),caption:'Surahs memorized',screen:'Hifz'},{label:'Offline Quran',value:`${preload.cached}/114`,caption:preload.running?'preparing now':'available offline',screen:'Quran Preload'}];const contentWidth=Math.min(Math.max(width-36,280),980);const studyCardWidth=wide?Math.min(302,(contentWidth-24)/3):Math.min(310,Math.max(258,width-68));
 return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><TopBar overline="THE NOBLE QURAN" title="The Noble Quran" right={<ToolGraphic tool="Quran" size={48}/>}/>
 <View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput accessibilityLabel="Search the Quran" value={query} onChangeText={setQuery} onSubmitEditing={submit} returnKeyType="search" style={s.searchInput} placeholder="Search Surah, meaning, or 2:255" placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel="Clear Quran search" onPress={()=>setQuery('')}>{ico('close-circle',18,C.muted)}</Pressable>}</View>
 {position&&<Pressable onPress={()=>{const chapter=chapters.find(c=>c.id===position.surahId);if(chapter)open(chapter,'both',position.verseKey)}} style={s.continueBar}><ToolGraphic tool="Quran Arabic" size={48}/><View style={{flex:1}}><Text style={s.dailyKicker}>CONTINUE READING</Text><Text style={s.settingName}>{position.surahName} · {position.verseKey}</Text><Text style={s.meta}>Page {position.page||'—'} · saved locally</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>}
 <View style={[s.quranHero,wide&&s.quranHeroWide]}><Image source={require('./assets/quran-scene.png')} resizeMode="cover" style={s.heroBg}/><LinearGradient colors={['rgba(41,37,80,.96)','rgba(89,65,139,.52)','transparent']} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFill}/><Text style={s.quranArabic}>الرَّحْمَٰن</Text><Text style={s.quranHeroTitle}>Read. Listen. Reflect.</Text><Text style={s.quranHeroMeta}>{preferences.scriptName} · {preferences.translationName}</Text><View style={s.heroActions}><Pressable style={s.whiteButton} onPress={()=>open(featured)}><Text style={s.whiteButtonText}>Start reading</Text>{ico('play',13,C.green)}</Pressable><Pressable style={s.ghostHeroButton} onPress={()=>navigation.navigate('Quran Audio')}><Text style={s.ghostHeroText}>Listen</Text>{ico('headset-outline',13,C.white)}</Pressable></View></View>
 <Section title="Read and navigate"/>
 <View style={s.quranActionGrid}><MotionPress onPress={()=>navigation.navigate('Mushaf Page',{page:position?.page||1,focusVerse:position?.verseKey})} style={[s.quranPrimaryWrap,wide&&s.quranPrimaryWrapWide]}><LinearGradient colors={['#292744','#474188']} style={s.quranPrimaryAction}><View style={{flex:1}}><Text style={s.readKicker}>{position?'RESUME YOUR MUSHAF':'MUSHAF READER'}</Text><Text style={s.quranPrimaryTitle}>{position?`Page ${position.page||1}`:'Open the Mushaf'}</Text><Text style={s.quranPrimaryBody}>{position?`${position.surahName} · ${position.verseKey}`:'A calm, page-first reading experience'}</Text></View><ToolGraphic tool="Mushaf Pages" size={76}/></LinearGradient></MotionPress>{readActions.map(item=><MotionPress key={item.label} onPress={()=>navigation.navigate(item.screen)} style={[s.quranNavWrap,wide&&s.quranNavWrapWide]}><View style={s.quranNavCard}><ToolGraphic tool={item.label} size={52}/><Text style={s.quranNavTitle}>{item.title}</Text><Text numberOfLines={1} style={s.quranNavCaption}>{item.caption}</Text></View></MotionPress>)}</View>
 <Section title="Listen and recite"/>
 <MotionPress onPress={()=>navigation.navigate('Downloads',{})} style={{width:'100%'}}><View style={s.audioEntryInner}><ToolGraphic tool="Offline Quran" size={62}/><View style={{flex:1}}><Text style={s.quranStudyTitle}>Downloads</Text><Text style={s.quranStudyCaption}>Keep Surah audio and text on this device for offline</Text></View>{ico('chevron-forward',18,C.green)}</View></MotionPress>
 <MotionPress onPress={()=>navigation.navigate('Quran Audio')} style={{width:'100%'}}><View style={s.audioEntryInner}><ToolGraphic tool="Recitations" size={62}/><View style={{flex:1}}><Text style={s.quranStudyTitle}>Quran audio</Text><Text style={s.quranStudyCaption}>{audioReciter} · verse-by-verse recitation, translation audio and playlists</Text></View>{ico('chevron-forward',18,C.green)}</View></MotionPress>

 <Section title="Study and understand"/>
 <SlidingCards label="Quran study tools" items={studyTools} cardWidth={studyCardWidth} renderItem={(item:any)=><MotionPress onPress={()=>navigation.navigate(item.screen)} style={{width:'100%'}}><View style={s.quranStudyCard}><View style={s.quranStudyTop}><ToolGraphic tool={item.label} size={67}/><View style={s.studyNumber}>{ico('arrow-forward',16,C.green)}</View></View><Text style={s.quranStudyTitle}>{item.title}</Text><Text style={s.quranStudyCaption}>{item.caption}</Text></View></MotionPress>}/>
 <Section title="Reading preferences"/>
 <View style={s.quranPreferenceRow}><Pressable onPress={()=>navigation.navigate('Reader Settings')} style={s.quranPreferenceCard}><ToolGraphic tool="Reader Settings" size={50}/><View style={{flex:1}}><Text style={s.settingName}>Script & display</Text><Text numberOfLines={1} style={s.meta}>{preferences.scriptName} · {QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.label} · {preferences.fontSize}px</Text></View>{ico('arrow-forward',17,C.green)}</Pressable><Pressable onPress={()=>navigation.navigate('Translations')} style={s.quranPreferenceCard}><ToolGraphic tool="Translations" size={50}/><View style={{flex:1}}><Text style={s.settingName}>Translation</Text><Text numberOfLines={1} style={s.meta}>{preferences.translationName}</Text></View>{ico('arrow-forward',17,C.green)}</Pressable></View>
 <Section title="Your Quran"/>
 <View style={s.quranPersonalGrid}>{personalTools.map(item=><MotionPress key={item.label} onPress={()=>navigation.navigate(item.screen)} style={[s.quranPersonalWrap,wide&&s.quranPersonalWrapWide]}><View style={s.quranPersonalCard}><View style={s.quranPersonalHead}><ToolGraphic tool={item.label} size={45}/><Text style={s.quranPersonalValue}>{item.value}</Text></View><Text style={s.quranPersonalTitle}>{item.label}</Text><Text numberOfLines={1} style={s.quranPersonalCaption}>{item.caption}</Text></View></MotionPress>)}</View>
 {recent.length>0&&<><Section title="Recent Surahs"/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingRight:18}}>{recent.map(id=>{const c=chapters.find(x=>x.id===id);return c?<Pressable key={id} onPress={()=>open(c)} style={s.recentChip}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.surahAr}>{c.name_arabic}</Text></Pressable>:null})}</ScrollView></>}
 <Section title="All surahs" action={`${shown.length} chapters`}/>{error?<ErrorState message={error} retry={load}/>:!chapters.length?<Spinner/>:<View style={s.surahList}>{shown.map(c=><Pressable key={c.id} onPress={()=>open(c)} style={s.surahRow}><View style={s.surahNum}><Text style={s.surahNumText}>{c.id}</Text></View><View style={{flex:1}}><Text style={s.surahName}>{c.name_simple}</Text><Text style={s.meta}>{c.translated_name?.name} · {c.verses_count} verses · {c.revelation_place}</Text></View><Text style={s.surahAr}>{c.name_arabic}</Text></Pressable>)}</View>}</ScrollView></Page>
}
function ReaderScreen({route,navigation}:any){
 const chapter:Chapter=route.params.chapter;const initial=route.params?.mode||'both';const focusVerse=route.params?.focusVerse;const{preferences,update}=useQuranPreferences();const[showArabic,setShowArabic]=useState(initial!=='english');const[showEnglish,setShowEnglish]=useState(initial!=='arabic'&&preferences.showTranslation);const[verses,setVerses]=useState<Verse[]>([]);const[bookmarks,setBookmarks]=useState<QuranBookmark[]>([]);const[error,setError]=useState('');const[cached,setCached]=useState(false);const scrollRef=useRef<any>(null);const didRestore=useRef(false);const{rtl}=useLanguage();const focusAyah=Number(focusVerse?.split(':')[1]||1);const cacheKey=`${chapter.id}:${preferences.scriptEdition}:${preferences.translationEdition}`;
 const load=async()=>{setError('');const local=await loadSurahCache(cacheKey) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=await getVerses(chapter.id,{script:preferences.scriptEdition,translation:preferences.translationEdition});setVerses(fresh);setCached(false);await saveSurahCache(cacheKey,fresh)}catch(e:any){if(!local)setError(e.message)}};useEffect(()=>{didRestore.current=false;load();loadBookmarks().then(setBookmarks);void logSurahOpen(chapter.id)},[chapter.id,preferences.scriptEdition,preferences.translationEdition]);useEffect(()=>{if(preferences.readingMode==='mushaf'&&verses.length){const selected=verses.find(v=>v.verse_key===focusVerse)||verses[0];navigation.replace('Mushaf Page',{page:selected.page||1,focusVerse})}},[preferences.readingMode,verses.length]);const toggle=(kind:'ar'|'en')=>{if(kind==='ar'){if(showArabic&&!showEnglish)return;setShowArabic(!showArabic)}else{if(showEnglish&&!showArabic)return;setShowEnglish(!showEnglish)}};
 const bookmark=async(v:Verse)=>setBookmarks(await toggleBookmark({verseKey:v.verse_key,surahId:chapter.id,surahName:chapter.name_simple,arabic:v.text_uthmani,translation:v.translation,savedAt:Date.now()}));const mark=async(v:Verse)=>{await saveReadingPosition({surahId:chapter.id,surahName:chapter.name_simple,verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page:v.page,updatedAt:Date.now()});void logVerseRead(v.verse_key,chapter.id,v.page);Alert.alert('Reading position saved',`${chapter.name_simple} ${v.verse_key}`)};const share=(v:Verse)=>Share.share({message:`${v.text_uthmani}\n\n${v.translation||''}\n\nQuran ${v.verse_key} · ${preferences.translationName}`});
 return <Page><View style={s.readerBar}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/><View style={{alignItems:'center'}}><Text style={s.readerName}>{chapter.name_simple}</Text><Text style={s.meta}>{cached?'Available offline · ':''}{chapter.verses_count} verses</Text></View><View style={s.readerHeaderActions}><Pressable accessibilityLabel="Play this Surah" onPress={()=>{void playSurahFromReader(chapter)}} style={s.iconBtn}>{ico('play-circle',20,C.ink)}</Pressable><Pressable accessibilityLabel="Keep this Surah for offline" onPress={()=>navigation.navigate('Downloads',{chapterId:chapter.id,chapterName:chapter.name_simple})} style={s.iconBtn}>{ico('download-outline',20,C.ink)}</Pressable><Pressable accessibilityLabel="Reader settings" onPress={()=>navigation.navigate('Reader Settings')} style={s.iconBtn}>{ico('options-outline',20,C.ink)}</Pressable></View></View><View style={s.readerProgress}><View style={[s.preloadFill,{width:`${Math.min(100,focusAyah/Math.max(1,chapter.verses_count)*100)}%`} as any]}/></View><ScrollView ref={scrollRef} contentContainerStyle={s.readerScroll} showsVerticalScrollIndicator={false}><LinearGradient colors={['#2A2849','#5146A4']} style={s.surahHead}>{!!cached && <LiveBadge source="SAVED ON DEVICE"/>}<Text style={s.surahHeadAr}>{chapter.name_arabic}</Text><Text style={s.surahHeadEn}>{chapter.translated_name?.name}</Text><Text style={s.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text></LinearGradient><View style={s.readerModes}><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showArabic}} onPress={()=>toggle('ar')} style={[s.readerMode,showArabic&&s.readerModeActive]}><ToolGraphic tool="Arabic Quran" size={42}/><Text style={s.readerModeText}>Arabic</Text></Pressable><Pressable accessibilityRole="checkbox" accessibilityState={{checked:showEnglish}} onPress={()=>toggle('en')} style={[s.readerMode,showEnglish&&s.readerModeActive]}><ToolGraphic tool="English meaning" size={42}/><Text style={s.readerModeText}>Translation</Text></Pressable></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=>{const saved=bookmarks.some(x=>x.verseKey===v.verse_key);return <View key={v.id} onLayout={event=>{if(focusVerse===v.verse_key&&!didRestore.current){didRestore.current=true;const y=event.nativeEvent.layout.y;setTimeout(()=>scrollRef.current?.scrollTo({y:Math.max(0,y-88),animated:false}),40)}}} style={[s.ayah,preferences.readingMode==='continuous'&&s.ayahContinuous,focusVerse===v.verse_key&&s.ayahSelected]}><View style={s.ayahTop}><Text style={s.ayahNo}>{v.verse_key}</Text><View style={s.ayahActions}><Pressable accessibilityLabel={`Play verse ${v.verse_key}`} onPress={()=>{void playFromReader(chapter,v)}}>{ico('play-circle',24,C.green)}</Pressable><Pressable accessibilityLabel={`${saved?'Remove bookmark from':'Bookmark'} verse ${v.verse_key}`} onPress={()=>bookmark(v)}>{ico(saved?'bookmark':'bookmark-outline',20,C.green)}</Pressable><Pressable accessibilityLabel={`More actions for verse ${v.verse_key}`} onPress={()=>navigation.navigate('Ayah Actions',{verse:v,chapter})}>{ico('ellipsis-horizontal-circle-outline',21,C.green)}</Pressable></View></View>{showArabic&&(preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>)}{showEnglish&&<Text style={[s.ayahTranslation,!showArabic&&{borderTopWidth:0,marginTop:8,paddingTop:0}]}>{v.translation}</Text>}<View style={s.ayahFooter}><Text style={s.ayahMeta}>Juz {v.juz} · Page {v.page} · {preferences.translationName}</Text><Pressable onPress={()=>mark(v)}><Text style={s.sectionAction}>Mark position</Text></Pressable></View></View>})}</ScrollView></Page>
}
function TranslationScreen({navigation}:any){const{preferences,update}=useQuranPreferences();const[editions,setEditions]=useState<QuranEdition[]>([]);const[query,setQuery]=useState('');const[language,setLanguage]=useState('en');const[error,setError]=useState('');useEffect(()=>{getQuranEditions().then(setEditions).catch(e=>setError(e.message))},[]);const languages=[['en','English'],['ur','Urdu'],['fr','French'],['tr','Turkish'],['id','Indonesian'],['ru','Russian'],['zh','Chinese']];const shown=editions.filter(e=>e.language===language&&`${e.englishName} ${e.name}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title="Translation" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Translations" size={76}/><Text style={s.dataTitle}>Choose a translation</Text><Text style={s.intro}>Translations explain meaning and do not replace the Arabic Quran. Edition attribution remains visible in the reader.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7}}>{languages.map(([code,name])=><ChoicePill key={code} label={name} selected={language===code} onPress={()=>setLanguage(code)}/>)}</ScrollView><View style={[s.search,{marginTop:13}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder="Search translator or edition" style={s.searchInput}/></View>{error?<ErrorState message={error}/>:!editions.length?<Spinner/>:<View style={s.settings}>{shown.map(e=><Pressable key={e.identifier} onPress={async()=>{await update({translationEdition:e.identifier,translationName:e.englishName,translationLanguage:languages.find(x=>x[0]===e.language)?.[1]||e.language});navigation.goBack()}} style={s.translationRow}><View style={s.languageBadge}><Text style={s.languageFlag}>{editionFlag(e.language)}</Text><Text style={s.languageBadgeText}>{e.language.toUpperCase()}</Text></View><View style={{flex:1}}><Text style={s.settingName}>{e.englishName}</Text><Text style={s.meta}>{e.name} · {e.identifier}</Text></View>{ico(preferences.translationEdition===e.identifier?'checkmark-circle':'ellipse-outline',20,preferences.translationEdition===e.identifier?C.green:C.muted)}</Pressable>)}</View>}</ScrollView></Page>}

function QuranSearchScreen({route,navigation}:any){const{preferences}=useQuranPreferences();const[query,setQuery]=useState(route.params?.initialQuery||'');const[results,setResults]=useState<QuranSearchResult[]>([]);const[history,setHistory]=useState<string[]>([]);const[error,setError]=useState('');const[loading,setLoading]=useState(false);useEffect(()=>{loadSearchHistory().then(setHistory);if(route.params?.initialQuery)run(route.params.initialQuery)},[]);const run=async(value=query)=>{const q=value.trim();if(q.length<2)return;setLoading(true);setError('');try{const edition=/[\u0600-\u06ff]/.test(q)?preferences.scriptEdition:preferences.translationEdition;setResults((await searchQuran(q,edition)).slice(0,100));setHistory(await addSearchHistory(q))}catch(e:any){setError(e.message)}finally{setLoading(false)}};const open=(r:QuranSearchResult)=>navigation.navigate('Reader',{chapter:{id:r.surahId,name_simple:r.surahName,name_arabic:'',verses_count:0},focusVerse:r.verseKey});return <Page><ToolBar title="Quran search" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} keyboardShouldPersistTaps="handled"><ToolGraphic tool="Quran Search" size={72}/><Text style={s.dataTitle}>Search Arabic or translation</Text><View style={s.search}>{ico('search-outline',19,C.muted)}<TextInput autoFocus value={query} onChangeText={setQuery} onSubmitEditing={()=>run()} returnKeyType="search" style={s.searchInput} placeholder="Mercy, الصبر, or 2:255"/><Pressable onPress={()=>run()}>{ico('arrow-forward-circle',22,C.green)}</Pressable></View>{history.length>0&&<><View style={s.historyHead}><Text style={s.preferenceLabel}>RECENT SEARCHES</Text><Pressable onPress={async()=>{await clearSearchHistory();setHistory([])}}><Text style={s.sectionAction}>Clear</Text></Pressable></View><View style={s.historyWrap}>{history.map(item=><Pressable key={item} onPress={()=>{setQuery(item);run(item)}} onLongPress={async()=>setHistory(await removeSearchHistory(item))} style={s.historyChip}><Text style={s.meta}>{item}</Text></Pressable>)}</View></>}{error?<ErrorState message={error} retry={()=>run()}/>:loading?<Spinner/>:<View>{results.map(r=><Pressable key={`${r.verseKey}-${r.edition}`} onPress={()=>open(r)} style={s.searchResult}><Text style={s.dataMeta}>{r.surahName} · {r.verseKey}</Text><Text numberOfLines={4} style={/[\u0600-\u06ff]/.test(r.text)?s.dataArabic:s.dataBody}>{r.text}</Text><Text style={s.meta}>{r.edition}</Text></Pressable>)}</View>}</ScrollView></Page>}

function BookmarkScreen({navigation}:any){const[items,setItems]=useState<QuranBookmark[]>([]);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadBookmarks().then(setItems));loadBookmarks().then(setItems);return unsub},[navigation]);return <Page><ToolBar title="Bookmarks" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Bookmarks" size={72}/><Text style={s.dataTitle}>{items.length} saved verses</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>No bookmarks yet</Text><Text style={s.errorText}>Use the bookmark action beside any verse.</Text></View>:items.map(item=><Pressable key={item.verseKey} onPress={()=>navigation.navigate('Reader',{chapter:{id:item.surahId,name_simple:item.surahName,name_arabic:'',verses_count:0},focusVerse:item.verseKey})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text numberOfLines={3} style={s.dataArabic}>{item.arabic}</Text><Text numberOfLines={3} style={s.dataBody}>{item.translation}</Text></Pressable>)}</ScrollView></Page>}
function NotesScreen({navigation}:any){const[items,setItems]=useState<QuranNote[]>([]);useEffect(()=>{const unsub=navigation.addListener('focus',()=>loadNotes().then(setItems));loadNotes().then(setItems);return unsub},[navigation]);return <Page><ToolBar title="Quran notes" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Notes" size={72}/><Text style={s.dataTitle}>{items.length} private notes</Text><Text style={s.intro}>Notes remain on this device and are never added to diagnostics.</Text>{!items.length?<View style={s.empty}><Text style={s.errorTitle}>No notes yet</Text><Text style={s.errorText}>Open verse actions to add a reflection.</Text></View>:items.map(item=><Pressable key={item.verseKey} onPress={()=>navigation.navigate('Note Editor',{verse:item,chapter:{id:item.surahId,name_simple:item.surahName}})} style={s.dataCard}><Text style={s.dataMeta}>{item.surahName} · {item.verseKey}</Text><Text style={s.noteText}>{item.note}</Text><Text style={s.meta}>{new Date(item.updatedAt).toLocaleDateString()}</Text></Pressable>)}</ScrollView></Page>}
function NoteEditor({route,navigation}:any){const verse:Verse=route.params.verse;const chapter:Chapter=route.params.chapter;const[text,setText]=useState(route.params.verse.note||'');const save=async()=>{if(!text.trim())return;await saveNote({verseKey:verse.verse_key,surahId:chapter.id,surahName:chapter.name_simple,arabic:verse.text_uthmani,translation:verse.translation,note:text.trim(),savedAt:route.params.verse.savedAt||Date.now(),updatedAt:Date.now()});navigation.goBack()};return <Page><ToolBar title={`Note · ${verse.verse_key}`} navigation={navigation}/><View style={s.dataPage}><Text style={s.dataArabic}>{verse.text_uthmani}</Text><TextInput multiline autoFocus value={text} onChangeText={setText} placeholder="Write a private reflection…" style={s.noteInput}/><View style={s.actionRow}><Pressable onPress={save} style={s.primary}><Text style={s.primaryText}>Save note</Text></Pressable>{route.params.verse.note&&<Pressable onPress={async()=>{await deleteNote(verse.verse_key);navigation.goBack()}} style={s.dangerButton}><Text style={s.dangerText}>Delete</Text></Pressable>}</View></View></Page>}

function ReaderSettingsScreen({navigation}:any){const{preferences,update}=useQuranPreferences();const scripts=[['quran-uthmani','Uthmani'],['quran-simple','Imla’i Simple'],['quran-indopak','IndoPak'],['quran-tajweed','Tajweed colour']];return <Page><ToolBar title="Reading settings" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Reader Settings" size={72}/><Section title="Arabic script"/><View style={s.choiceGrid}>{scripts.map(([id,name])=><ChoicePill key={id} label={name} selected={preferences.scriptEdition===id} onPress={()=>update({scriptEdition:id,scriptName:name})}/>)}</View><Section title="Arabic font" action={`${preferences.fontSize}px`}/><View style={s.choiceGrid}>{QURAN_FONTS.map(font=><ChoicePill key={font.id} label={font.label} selected={preferences.arabicFont===font.id} onPress={()=>{void ensureQuranFont(font.id);update({arabicFont:font.id})}}/>)}</View><Text style={[s.meta,{marginTop:9}]}>{QURAN_FONTS.find(font=>font.id===preferences.arabicFont)?.detail}</Text><View style={s.fontPreview}><Text style={[s.fontPreviewText,{fontFamily:quranFont(preferences.arabicFont),fontSize:Math.min(preferences.fontSize,30)}]}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text></View><Section title="Reading mode"/><View style={s.choiceGrid}><ChoicePill label="Ayah cards" selected={preferences.readingMode==='cards'} onPress={()=>update({readingMode:'cards'})}/><ChoicePill label="Continuous" selected={preferences.readingMode==='continuous'} onPress={()=>update({readingMode:'continuous'})}/><ChoicePill label="Mushaf pages" selected={preferences.readingMode==='mushaf'} onPress={()=>update({readingMode:'mushaf'})}/></View><Section title="Arabic size" action={`${preferences.fontSize}px`}/><View style={s.stepper}><Pressable onPress={()=>update({fontSize:Math.max(18,preferences.fontSize-2)})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={[s.previewArabic,{fontSize:preferences.fontSize}]}>ٱلْقُرْآنُ</Text><Pressable onPress={()=>update({fontSize:Math.min(40,preferences.fontSize+2)})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View><Section title="Line spacing" action={preferences.lineHeight.toFixed(1)}/><View style={s.stepper}><Pressable onPress={()=>update({lineHeight:Math.max(1.4,+(preferences.lineHeight-.1).toFixed(1))})} style={s.stepButton}>{ico('remove',20,C.green)}</Pressable><Text style={s.settingName}>{preferences.lineHeight.toFixed(1)}×</Text><Pressable onPress={()=>update({lineHeight:Math.min(3,+(preferences.lineHeight+.1).toFixed(1))})} style={s.stepButton}>{ico('add',20,C.green)}</Pressable></View><Pressable onPress={()=>navigation.navigate('Translations')} style={s.referenceRow}><View><Text style={s.settingName}>Translation</Text><Text style={s.meta}>{preferences.translationName}</Text></View>{ico('arrow-forward',18,C.green)}</Pressable></ScrollView></Page>}

function AyahActionsScreen({route,navigation}:any){const verse:Verse=route.params.verse;const chapter:Chapter=route.params.chapter;const{preferences}=useQuranPreferences();const actions=[['copy-outline','Copy Arabic',()=>Clipboard.setStringAsync(verse.text_uthmani)],['copy-outline','Copy translation',()=>Clipboard.setStringAsync(verse.translation||'')],['share-outline','Share verse',()=>Share.share({message:`${verse.text_uthmani}\n\n${verse.translation||''}\n\nQuran ${verse.verse_key}`})],['create-outline','Add or edit note',()=>navigation.navigate('Note Editor',{verse,chapter})],['library-outline','Tafsir & compare',()=>navigation.navigate('Tafsir Compare',{verse,chapter})],['bookmark-outline','Save reading position',()=>saveReadingPosition({surahId:chapter.id,surahName:chapter.name_simple,verseKey:verse.verse_key,ayah:Number(verse.verse_key.split(':')[1]),page:verse.page,updatedAt:Date.now()})]];return <Page><ToolBar title={`Verse ${verse.verse_key}`} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.dataArabic}>{verse.text_uthmani}</Text><Text style={s.dataBody}>{verse.translation}</Text><Text style={s.dataMeta}>{preferences.translationName}</Text><Section title="Actions"/><View style={s.settings}>{actions.map(([icon,label,action]:any)=><Pressable key={label} onPress={async()=>{await action();if(label.startsWith('Copy'))Alert.alert('Copied',label)}} style={s.setting}><MotionGlyph name={icon} size={19}/><Text style={[s.settingName,{flex:1}]}>{label}</Text>{ico('arrow-forward',17,C.muted)}</Pressable>)}</View></ScrollView></Page>}
const editionFlag=(language:string)=>({en:'🇬🇧',fr:'🇫🇷',ur:'🇵🇰',id:'🇮🇩',tr:'🇹🇷',ru:'🇷🇺',zh:'🇨🇳',ar:'◈'} as Record<string,string>)[language]||'◎';
function TafsirCompareScreen({route,navigation}:any){const verse:Verse=route.params?.verse||{verse_key:'2:255',text_uthmani:''};const[reference,setReference]=useState(verse.verse_key);const{preferences}=useQuranPreferences();const{width}=useWindowDimensions();const[mode,setMode]=useState<'translation'|'tafsir'>('translation');const[editions,setEditions]=useState<QuranEdition[]>([]);const[selected,setSelected]=useState<string[]>([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i));const[rows,setRows]=useState<any[]>([]);const[query,setQuery]=useState('');const[error,setError]=useState('');const loadEditions=()=>getQuranEditions(mode).then(setEditions).catch(e=>setError(e.message));const load=async()=>{setError('');const ids=[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,...selected];const cacheKey=`${reference}:${ids.join(',')}`;const cached=mode==='tafsir'?await getCachedJson<any[]>('tafsir',cacheKey):null;if(cached)setRows(cached);try{const fresh=await getAyahEditions(reference,ids);setRows(fresh);if(mode==='tafsir')await setCachedJson('tafsir',cacheKey,fresh)}catch(e:any){if(!cached)setError(e.message)}};useEffect(()=>{loadEditions()},[mode]);useEffect(()=>{load()},[reference,selected.join('|'),preferences.scriptEdition]);useEffect(()=>{if(mode==='tafsir')setSelected(['ar.jalalayn']);else setSelected([preferences.translationEdition,'en.pickthall'].filter((x,i,a)=>a.indexOf(x)===i))},[mode]);const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.length>1?current.filter(x=>x!==id):current:current.length<(mode==='translation'?3:1)?[...current,id]:current);const shown=query.trim().length<2?editions.filter(e=>selected.includes(e.identifier)):editions.filter(e=>`${e.englishName} ${e.name} ${e.language}`.toLowerCase().includes(query.toLowerCase())).slice(0,30);const arabic=rows[0];const compared=rows.slice(1);const columnWidth=width>=760?Math.max(230,(Math.min(width-36,860)-12*(compared.length-1))/Math.max(1,compared.length)):270;return <Page><ToolBar title="Tafsir & comparison" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool={mode==='tafsir'?'Tafsir':'Translation Compare'} size={72}/><Text style={s.dataTitle}>Quran {reference}</Text><View style={s.referenceNavigator}><Pressable accessibilityLabel="Previous verse" onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${Math.max(1,v-1)}`)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable><TextInput accessibilityLabel="Verse reference" value={reference} onChangeText={setReference} onSubmitEditing={load} style={s.referenceInput}/><Pressable accessibilityLabel="Next verse" onPress={()=>{const[a,v]=reference.split(':').map(Number);setReference(`${a}:${v+1}`)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label="Translations" selected={mode==='translation'} onPress={()=>setMode('translation')}/><ChoicePill label="Tafsir" selected={mode==='tafsir'} onPress={()=>setMode('tafsir')}/></View><View style={[s.search,{marginTop:13}]}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder={mode==='translation'?'Search language or translator':'Search Tafsir source'} style={s.searchInput}/></View><Text style={s.comparisonHelp}>{mode==='translation'?'Select two or three editions. Search to discover every live edition.':'Select a live Tafsir source and language.'}</Text><View style={s.editionPicker}>{shown.map(e=><Pressable accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(e.identifier)}} key={e.identifier} onPress={()=>toggle(e.identifier)} style={[s.editionChip,selected.includes(e.identifier)&&s.editionChipActive]}><Text style={s.editionFlag}>{editionFlag(e.language)}</Text><View style={{flex:1}}><Text numberOfLines={1} style={s.settingName}>{e.englishName}</Text><Text numberOfLines={1} style={s.meta}>{e.language.toUpperCase()} · {e.identifier}</Text></View>{ico(selected.includes(e.identifier)?'checkmark-circle':'add-circle-outline',19,selected.includes(e.identifier)?C.green:C.muted)}</Pressable>)}</View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<><View style={s.arabicReference}><Text style={s.dataMeta}>ARABIC REFERENCE · {arabic?.name}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={arabic?.text||''} style={s.dataArabic}/>:<Text style={s.dataArabic}>{arabic?.text}</Text>}</View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.comparisonColumns}>{compared.map(row=><View key={row.edition} style={[s.compareCard,{width:columnWidth}]}><Text style={s.editionFlag}>{editionFlag(row.language)}</Text><Text style={s.dataMeta}>{row.name} · {row.language.toUpperCase()}</Text><Text style={row.language==='ar'?s.dataArabic:s.comparisonText}>{row.text}</Text></View>)}</ScrollView></>}</ScrollView></Page>}

function MushafPageScreen({route,navigation}:any){const{preferences}=useQuranPreferences();const initial=Math.max(1,Math.min(604,Number(route.params?.page)||1));const[page,setPage]=useState(initial);const[input,setInput]=useState(String(initial));const[verses,setVerses]=useState<Verse[]>([]);const[cached,setCached]=useState(false);const[error,setError]=useState('');const key=`page:${page}:${preferences.scriptEdition}:${preferences.translationEdition}`;const load=async()=>{setError('');setVerses([]);const local=await loadSurahCache(key) as Verse[]|null;if(local){setVerses(local);setCached(true)}try{const fresh=await getPageVerses(page,{script:preferences.scriptEdition,translation:preferences.translationEdition});setVerses(fresh);setCached(false);await saveSurahCache(key,fresh)}catch(e:any){if(!local)setError(e.message)}};useEffect(()=>{setInput(String(page));load();void logMushafPage(page)},[page,preferences.scriptEdition,preferences.translationEdition]);const go=(value:number)=>setPage(Math.max(1,Math.min(604,value)));return <Page><ToolBar title={`Mushaf page ${page}`} navigation={navigation}/><ScrollView contentContainerStyle={s.mushafPage}><View style={s.mushafNav}><Pressable accessibilityLabel="Previous Mushaf page" disabled={page===1} onPress={()=>go(page-1)} style={[s.stepButton,page===1&&{opacity:.3}]}>{ico('arrow-back',20,C.green)}</Pressable><View style={s.pageJump}><Text style={s.dataMeta}>{cached?'OFFLINE PAGE':'MADINAH MUSHAF · 604 PAGES'}</Text><TextInput accessibilityLabel="Mushaf page number" keyboardType="number-pad" value={input} onChangeText={setInput} onSubmitEditing={()=>go(Number(input))} style={s.pageInput}/></View><Pressable accessibilityLabel="Next Mushaf page" disabled={page===604} onPress={()=>go(page+1)} style={[s.stepButton,page===604&&{opacity:.3}]}>{ico('arrow-forward',20,C.green)}</Pressable></View><View style={s.pageProgress}><View style={[s.preloadFill,{width:`${page/604*100}%`} as any]}/></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:<View style={s.mushafSheet}>{verses.map((v,i)=><Pressable key={v.verse_key} onPress={()=>saveReadingPosition({surahId:Number(v.verse_key.split(':')[0]),surahName:v.surah_name||'',verseKey:v.verse_key,ayah:Number(v.verse_key.split(':')[1]),page,updatedAt:Date.now()})} style={[s.mushafAyah,route.params?.focusVerse===v.verse_key&&s.ayahSelected]}>{i===0||verses[i-1].surah_name!==v.surah_name?<Text style={s.mushafSurah}>{v.surah_name}</Text>:null}{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani} <Text style={s.verseMarker}>۝{v.verse_key.split(':')[1]}</Text></Text>}{preferences.showTranslation&&<Text style={s.mushafTranslation}>{v.translation}</Text>}</Pressable>)}</View>}<View style={s.mushafNav}><Pressable onPress={()=>go(page-1)} disabled={page===1} style={s.secondary}><Text style={s.secondaryText}>Previous</Text></Pressable><Text style={s.meta}>Juz {verses[0]?.juz||'—'} · Page {page}</Text><Pressable onPress={()=>go(page+1)} disabled={page===604} style={s.secondary}><Text style={s.secondaryText}>Next</Text></Pressable></View></ScrollView></Page>}

function QuranTopicsScreen({navigation}:any){const[category,setCategory]=useState('All');const[query,setQuery]=useState('');const shown=QURAN_TOPICS.filter(topic=>(category==='All'||topic.category===category)&&`${topic.title} ${topic.description}`.toLowerCase().includes(query.toLowerCase()));return <Page><ToolBar title="Quran topics" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Topics" size={74}/><Text style={s.dataTitle}>Explore the Quran by theme</Text><Text style={s.intro}>Curated references open the Arabic text alongside your selected translation.</Text><View style={s.search}>{ico('search-outline',18,C.muted)}<TextInput value={query} onChangeText={setQuery} placeholder="Search faith, family, patience…" style={s.searchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,marginVertical:14}}>{['All','Faith','Life','Spirituality'].map(item=><ChoicePill key={item} label={item} selected={category===item} onPress={()=>setCategory(item)}/>)}</ScrollView><View style={s.topicGrid}>{shown.map(topic=><MotionPress key={topic.id} onPress={()=>navigation.navigate('Topic Detail',{topic})} style={s.topicWrap}><View style={s.topicCard}><Text style={s.libraryKicker}>{topic.category.toUpperCase()}</Text><Text style={s.exploreTitle}>{topic.title}</Text><Text style={s.exploreBody}>{topic.description}</Text><Text style={s.dataMeta}>{topic.references.length} VERSES</Text></View></MotionPress>)}</View></ScrollView></Page>}
function TopicDetailScreen({route,navigation}:any){const topic=route.params.topic;const{preferences}=useQuranPreferences();const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const load=()=>{setError('');return Promise.all(topic.references.map((ref:string)=>getAyahEditions(ref,[preferences.scriptEdition==='quran-indopak'?'quran-uthmani':preferences.scriptEdition,preferences.translationEdition]))).then(groups=>setRows(groups.map((items,i)=>({reference:topic.references[i],arabic:items[0],translation:items[1]})))).catch(e=>setError(e.message))};useEffect(()=>{load()},[topic.id,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={topic.title} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.libraryKicker}>{topic.category.toUpperCase()}</Text><Text style={s.dataTitle}>{topic.title}</Text><Text style={s.intro}>{topic.description}</Text>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:rows.map(row=><Pressable key={row.reference} onPress={()=>{const[surah]=row.reference.split(':').map(Number);navigation.navigate('Reader',{chapter:{id:surah,name_simple:row.arabic?.name||`Surah ${surah}`,name_arabic:'',verses_count:0},focusVerse:row.reference})}} style={s.dataCard}><Text style={s.dataMeta}>QURAN {row.reference}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={row.arabic.text} style={s.dataArabic}/>:<Text style={s.dataArabic}>{row.arabic.text}</Text>}<Text style={s.dataBody}>{row.translation.text}</Text><Text style={s.meta}>{row.translation.name}</Text></Pressable>)}</ScrollView></Page>}

function VocabularyScreen({navigation}:any){const[index,setIndex]=useState(0);const[revealed,setRevealed]=useState(false);const[progress,setProgress]=useState<{reviewed:string[];known:string[]}>({reviewed:[],known:[]});useEffect(()=>{loadVocabularyProgress().then(setProgress)},[]);const word=QURAN_VOCABULARY[index];const mark=async(known:boolean)=>{const value={reviewed:[...new Set([...progress.reviewed,word.id])],known:known?[...new Set([...progress.known,word.id])]:progress.known.filter(id=>id!==word.id)};setProgress(value);await saveVocabularyProgress(value);setRevealed(false);setIndex(valueIndex=>(valueIndex+1)%QURAN_VOCABULARY.length)};return <Page><ToolBar title="Quran vocabulary" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Quran Vocabulary" size={74}/><Text style={s.dataTitle}>Frequent Quranic words</Text><Text style={s.intro}>A private flashcard review based on high-frequency lemmas and verbs documented by the Quranic Arabic Corpus.</Text><View style={s.vocabStats}><Text style={s.settingName}>{progress.known.length} known</Text><Text style={s.meta}>{progress.reviewed.length} reviewed · {QURAN_VOCABULARY.length} cards</Text></View><Pressable accessibilityLabel={`${word.arabic}. ${revealed?`${word.transliteration}, ${word.meaning}`:'Tap to reveal meaning'}`} onPress={()=>setRevealed(value=>!value)} style={s.flashcard}><Text style={s.flashIndex}>{index+1} / {QURAN_VOCABULARY.length}</Text><Text style={s.flashArabic}>{word.arabic}</Text>{revealed?<><Text style={s.flashTransliteration}>{word.transliteration}</Text><Text style={s.flashMeaning}>{word.meaning}</Text>{word.root&&<Text style={s.meta}>Root · {word.root}</Text>}</>:<Text style={s.flashHint}>Tap to reveal</Text>}</Pressable>{revealed&&<View style={s.actionRow}><Pressable onPress={()=>mark(false)} style={s.secondary}><Text style={s.secondaryText}>Review again</Text></Pressable><Pressable onPress={()=>mark(true)} style={s.primary}><Text style={s.primaryText}>I know this</Text></Pressable></View>}<View style={s.mushafNav}><Pressable onPress={()=>{setRevealed(false);setIndex((index-1+QURAN_VOCABULARY.length)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-back',19,C.green)}</Pressable><Pressable onPress={()=>Linking.openURL('https://corpus.quran.com/lemmas.jsp')}><Text style={s.sectionAction}>Frequency source</Text></Pressable><Pressable onPress={()=>{setRevealed(false);setIndex((index+1)%QURAN_VOCABULARY.length)}} style={s.stepButton}>{ico('arrow-forward',19,C.green)}</Pressable></View></ScrollView></Page>}

function TajweedStudyScreen({navigation}:any){const[reference,setReference]=useState('2:255');const[rows,setRows]=useState<any[]>([]);const[error,setError]=useState('');const[showNormal,setShowNormal]=useState(false);const load=()=>{if(!/^([1-9]|[1-9]\d|1(?:0\d|1[0-4])):([1-9]\d*)$/.test(reference.trim())){setError('Enter a verse reference such as 2:255.');return}setError('');setRows([]);getAyahEditions(reference.trim(),['quran-tajweed','quran-uthmani','en.sahih']).then(setRows).catch(e=>setError(e.message))};useEffect(load,[]);return <Page><ToolBar title="Tajweed study" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Tajweed" size={74}/><Text style={s.dataTitle}>Read the rules in colour</Text><Text style={s.intro}>Each Tajweed rule is coloured where it applies. Colours are a learning aid and do not replace study with a qualified teacher.</Text><View style={s.search}><TextInput value={reference} onChangeText={setReference} onSubmitEditing={load} placeholder="2:255" style={s.searchInput}/><Pressable onPress={load}>{ico('arrow-forward-circle',23,C.green)}</Pressable></View><View style={s.choiceRow}><ChoicePill label="Tajweed colour" selected={!showNormal} onPress={()=>setShowNormal(false)}/><ChoicePill label="Normal text" selected={showNormal} onPress={()=>setShowNormal(true)}/></View>{error?<ErrorState message={error} retry={load}/>:!rows.length?<Spinner/>:<View style={s.tajweedPractice}><Text style={s.dataMeta}>QURAN {reference}</Text>{showNormal?<Text style={s.dataArabic}>{rows[1]?.text}</Text>:<TajweedText text={rows[0]?.text||''} style={s.dataArabic}/>}<Text style={s.dataBody}>{rows[2]?.text}</Text></View>}<Section title="Colour legend"/><View style={s.settings}>{TAJWEED_RULES.map(rule=><View key={rule.name} style={s.tajweedRule}><View style={[s.tajweedSwatch,{backgroundColor:rule.color}]}/><View style={{flex:1}}><Text style={s.settingName}>{rule.name}</Text><Text style={s.meta}>{rule.detail}</Text></View></View>)}</View></ScrollView></Page>}

function JuzDirectoryScreen({navigation}:any){return <Page><ToolBar title="30 Juz" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="30 Juz" size={72}/><Text style={s.dataTitle}>Read by Juz</Text><View style={s.juzGrid}>{Array.from({length:30},(_,i)=>i+1).map(juz=><Pressable key={juz} onPress={()=>navigation.navigate('Juz Reader',{juz})} style={s.juzCard}><Text style={s.juzNo}>{juz}</Text><Text style={s.meta}>JUZ</Text></Pressable>)}</View></ScrollView></Page>}
function JuzReaderScreen({route,navigation}:any){const juz=route.params.juz;const{preferences}=useQuranPreferences();const[verses,setVerses]=useState<Verse[]>([]);const[error,setError]=useState('');const load=()=>getJuzVerses(juz,{script:preferences.scriptEdition,translation:preferences.translationEdition}).then(setVerses).catch(e=>setError(e.message));useEffect(()=>{load()},[juz,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={`Juz ${juz}`} navigation={navigation}/><ScrollView contentContainerStyle={s.readerScroll}>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=><View key={v.id} style={s.ayah}><Text style={s.dataMeta}>{v.surah_name} · {v.verse_key}</Text><Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>{preferences.showTranslation&&<Text style={s.ayahTranslation}>{v.translation}</Text>}</View>)}</ScrollView></Page>}

function HizbDirectoryScreen({navigation}:any){return <Page><ToolBar title="60 Hizb" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="60 Hizb" size={72}/><Text style={s.dataTitle}>Read by Hizb</Text><Text style={s.intro}>Each Hizb contains four quarter-Hizb sections.</Text><View style={s.juzGrid}>{Array.from({length:60},(_,i)=>i+1).map(hizb=><Pressable key={hizb} onPress={()=>navigation.navigate('Hizb Reader',{hizb})} style={s.juzCard}><Text style={s.juzNo}>{hizb}</Text><Text style={s.meta}>HIZB</Text></Pressable>)}</View></ScrollView></Page>}
function HizbReaderScreen({route,navigation}:any){const hizb=route.params.hizb;const{preferences}=useQuranPreferences();const[verses,setVerses]=useState<Verse[]>([]);const[error,setError]=useState('');const load=()=>getHizbVerses(hizb,{script:preferences.scriptEdition,translation:preferences.translationEdition}).then(setVerses).catch(e=>setError(e.message));useEffect(()=>{load()},[hizb,preferences.scriptEdition,preferences.translationEdition]);return <Page><ToolBar title={`Hizb ${hizb}`} navigation={navigation}/><ScrollView contentContainerStyle={s.readerScroll}><View style={s.mushafNav}><Pressable disabled={hizb===1} onPress={()=>navigation.replace('Hizb Reader',{hizb:hizb-1})} style={[s.stepButton,hizb===1&&{opacity:.3}]}>{ico('arrow-back',19,C.green)}</Pressable><Text style={s.dataMeta}>QUARTERS {(hizb-1)*4+1}–{hizb*4}</Text><Pressable disabled={hizb===60} onPress={()=>navigation.replace('Hizb Reader',{hizb:hizb+1})} style={[s.stepButton,hizb===60&&{opacity:.3}]}>{ico('arrow-forward',19,C.green)}</Pressable></View>{error?<ErrorState message={error} retry={load}/>:!verses.length?<Spinner/>:verses.map(v=><View key={v.verse_key} style={s.ayah}><Text style={s.dataMeta}>{v.surah_name} · {v.verse_key} · QUARTER {v.hizbQuarter}</Text>{preferences.scriptEdition==='quran-tajweed'?<TajweedText text={v.text_uthmani} style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}/>:<Text style={[s.ayahAr,{fontSize:preferences.fontSize,lineHeight:preferences.fontSize*preferences.lineHeight,fontFamily:quranFont(preferences.arabicFont),includeFontPadding:false}]}>{v.text_uthmani}</Text>}{preferences.showTranslation&&<Text style={s.ayahTranslation}>{v.translation}</Text>}</View>)}</ScrollView></Page>}

function QuranPreloadScreen({navigation}:any){const{preferences}=useQuranPreferences();const[state,setState]=useState(getPreloadState());useEffect(()=>{const unsubscribe=subscribePreload(setState);refreshPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return unsubscribe},[preferences.scriptEdition,preferences.translationEdition]);const start=()=>startQuranPreload({script:preferences.scriptEdition,translation:preferences.translationEdition});return <Page><ToolBar title="Offline Quran" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Offline Quran" size={76}/><Text style={s.dataTitle}>Prepare for offline reading</Text><Text style={s.intro}>Downloads the Arabic script and translation you have selected, one Surah at a time. Preparation continues while you use other screens and prioritizes your current reading Surah.</Text><View style={s.preloadScore}><Text style={s.planDays}>{state.cached}</Text><Text style={s.settingName}>of 114 Surahs cached</Text><View style={s.preloadTrack}><View style={[s.preloadFill,{width:`${state.cached/114*100}%`} as any]}/></View><Text style={s.meta}>{preferences.scriptName} · {preferences.translationName}{state.current?` · Preparing Surah ${state.current}`:''}</Text>{state.usage&&<Text style={s.cacheUsage}>Quran cache {(state.usage.byNamespace.quran/1048576).toFixed(1)} MB · limit {(state.usage.limits.quran/1000000).toFixed(0)} MB · total limit {(state.usage.limits.total/1000000).toFixed(0)} MB</Text>}</View>{state.error&&<ErrorState message={state.error} retry={start}/>}<View style={s.actionRow}>{!state.running?<Pressable onPress={start} style={s.primary}><Text style={s.primaryText}>{state.cached?'Resume preparation':'Preload all'}</Text></Pressable>:<Pressable onPress={pauseQuranPreload} style={s.secondary}><Text style={s.secondaryText}>Pause</Text></Pressable>}<Pressable onPress={clearPreparedQuran} style={s.dangerButton}><Text style={s.dangerText}>Clear Quran cache</Text></Pressable></View><View style={s.sourceCard}>{ico('shield-checkmark-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>Managed low-priority preparation</Text><Text style={s.sourceBody}>Cached Surahs open first, already-saved content is skipped, and bounded LRU storage prevents unlimited growth.</Text></View></View></ScrollView></Page>}
function ReadingPlansScreen({navigation}:any){const[plan,setPlan]=useState<any>(null);useEffect(()=>{loadPlan().then(setPlan)},[]);const start=async(days:number)=>{const next={days,startedAt:Date.now(),completed:[]};await savePlan(next);setPlan(next)};const today=plan?Math.min(plan.days,Math.floor((Date.now()-plan.startedAt)/86400000)+1):0;const toggle=async()=>{const completed=plan.completed.includes(today)?plan.completed.filter((x:number)=>x!==today):[...plan.completed,today];const next={...plan,completed};await savePlan(next);setPlan(next)};return <Page><ToolBar title="Reading plans" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Reading Plans" size={72}/><Text style={s.dataTitle}>Complete the Quran</Text>{!plan?<><Text style={s.intro}>Choose a private local plan. Progress stays on this device.</Text><View style={s.planGrid}>{[30,60,90,120].map(days=><Pressable key={days} onPress={()=>start(days)} style={s.planCard}><Text style={s.planDays}>{days}</Text><Text style={s.settingName}>day plan</Text><Text style={s.meta}>{(604/days).toFixed(1)} pages daily</Text></Pressable>)}</View></>:<><View style={s.summaryScore}><View><Text style={s.nextCardLabel}>CURRENT DAY</Text><Text style={s.zakatNo}>{today} / {plan.days}</Text></View><View><Text style={s.nextCardLabel}>COMPLETED</Text><Text style={s.zakatNo}>{plan.completed.length}</Text></View></View><Pressable onPress={toggle} style={s.planToday}><Text style={s.settingName}>Day {today} reading</Text>{ico(plan.completed.includes(today)?'checkmark-circle':'ellipse-outline',28,C.green)}</Pressable><Pressable onPress={async()=>{await savePlan(null);setPlan(null)}} style={s.dangerButton}><Text style={s.dangerText}>End current plan</Text></Pressable></>}</ScrollView></Page>}
function HifzScreen({navigation}:any){const[chapters,setChapters]=useState<Chapter[]>([]);const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[filter,setFilter]=useState<'all'|HifzStatus>('all');useEffect(()=>{getChapters().then(setChapters);loadHifz().then(setStatus)},[]);const cycle=async(id:number)=>{const current=status[id]||'not-started';const next:HifzStatus=current==='not-started'?'revising':current==='revising'?'memorized':'not-started';const value={...status,[id]:next};setStatus(value);await saveHifz(value)};const shown=chapters.filter(c=>filter==='all'||(status[c.id]||'not-started')===filter);const memorized=Object.values(status).filter(x=>x==='memorized').length;return <Page><ToolBar title="Hifz tracker" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={72}/><Text style={s.dataTitle}>{memorized} of 114 memorized</Text><Pressable onPress={()=>navigation.navigate('Hifz Practice')} style={s.practiceLaunch}><View><Text style={s.settingName}>Hide-and-peek recall</Text><Text style={s.meta}>Test a verse from your revising or memorized Surahs</Text></View>{ico('play-circle',28,C.green)}</Pressable><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7}}>{(['all','not-started','revising','memorized'] as const).map(value=><ChoicePill key={value} label={value.replace('-',' ')} selected={filter===value} onPress={()=>setFilter(value)}/>)}</ScrollView><View style={{height:13}}/><View style={s.settings}>{shown.map(c=><Pressable key={c.id} onPress={()=>cycle(c.id)} style={s.translationRow}><View style={s.surahNum}><Text style={s.surahNumText}>{c.id}</Text></View><View style={{flex:1}}><Text style={s.settingName}>{c.name_simple}</Text><Text style={s.meta}>{c.verses_count} verses</Text></View><Text style={s.hifzStatus}>{(status[c.id]||'not-started').replace('-',' ')}</Text></Pressable>)}</View></ScrollView></Page>}

function HifzPracticeScreen({navigation}:any){const{preferences}=useQuranPreferences();const[status,setStatus]=useState<Record<number,HifzStatus>>({});const[verses,setVerses]=useState<Verse[]>([]);const[index,setIndex]=useState(0);const[revealed,setRevealed]=useState(false);const[error,setError]=useState('');const[surah,setSurah]=useState(112);const load=async()=>{setError('');try{const saved=await loadHifz();setStatus(saved);const candidates=Object.keys(saved).map(Number).filter(id=>saved[id]!=='not-started');const id=candidates.length?candidates[Math.floor(Math.random()*candidates.length)]:112;setSurah(id);setVerses(await getVerses(id,{script:preferences.scriptEdition,translation:preferences.translationEdition}));setIndex(0);setRevealed(false)}catch(e:any){setError(e.message)}};useEffect(()=>{load()},[]);const next=()=>{setRevealed(false);setIndex(value=>value+1<verses.length?value+1:0)};const mark=async(value:HifzStatus)=>{const updated={...status,[surah]:value};setStatus(updated);await saveHifz(updated);void logHifzReview();next()};const verse=verses[index];return <Page><ToolBar title="Hifz recall practice" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Hifz" size={72}/><Text style={s.dataTitle}>Recall before you reveal</Text><Text style={s.intro}>Read the meaning and reference, recite from memory, then reveal the verified Arabic text.</Text>{error?<ErrorState message={error} retry={load}/>:!verse?<Spinner/>:<><View style={s.recallCard}><Text style={s.dataMeta}>QURAN {verse.verse_key} · VERSE {index+1} OF {verses.length}</Text><Text style={s.recallPrompt}>{verse.translation}</Text>{revealed?(preferences.scriptEdition==='quran-tajweed'?<TajweedText text={verse.text_uthmani} style={s.recallArabic}/>:<Text style={s.recallArabic}>{verse.text_uthmani}</Text>):<Pressable accessibilityLabel="Reveal Arabic verse" onPress={()=>setRevealed(true)} style={s.revealArea}>{ico('eye-outline',27,C.green)}<Text style={s.sectionAction}>Reveal Arabic</Text></Pressable>}</View>{revealed&&<View style={s.actionRow}><Pressable onPress={()=>mark('revising')} style={s.secondary}><Text style={s.secondaryText}>Review again</Text></Pressable><Pressable onPress={()=>mark('memorized')} style={s.primary}><Text style={s.primaryText}>Remembered</Text></Pressable><Pressable onPress={next} style={s.secondary}><Text style={s.secondaryText}>Skip</Text></Pressable></View>}</>}</ScrollView></Page>}

function QuranStack(){return <Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="QuranHome" component={QuranHome}/><Stack.Screen name="Downloads" component={DownloadsScreen}/><Stack.Screen name="Reader" component={ReaderScreen}/><Stack.Screen name="Translations" component={TranslationScreen}/><Stack.Screen name="Quran Search" component={QuranSearchScreen}/><Stack.Screen name="Bookmarks" component={BookmarkScreen}/><Stack.Screen name="Notes" component={NotesScreen}/><Stack.Screen name="Note Editor" component={NoteEditor}/><Stack.Screen name="Reader Settings" component={ReaderSettingsScreen}/><Stack.Screen name="Ayah Actions" component={AyahActionsScreen}/><Stack.Screen name="Tafsir Compare" component={TafsirCompareScreen}/><Stack.Screen name="Mushaf Page" component={MushafPageScreen}/><Stack.Screen name="Quran Topics" component={QuranTopicsScreen}/><Stack.Screen name="Topic Detail" component={TopicDetailScreen}/><Stack.Screen name="Quran Vocabulary" component={VocabularyScreen}/><Stack.Screen name="Tajweed Study" component={TajweedStudyScreen}/><Stack.Screen name="Juz Directory" component={JuzDirectoryScreen}/><Stack.Screen name="Juz Reader" component={JuzReaderScreen}/><Stack.Screen name="Hizb Directory" component={HizbDirectoryScreen}/><Stack.Screen name="Hizb Reader" component={HizbReaderScreen}/><Stack.Screen name="Reading Plans" component={ReadingPlansScreen}/><Stack.Screen name="Quran Preload" component={QuranPreloadScreen}/><Stack.Screen name="Hifz" component={HifzScreen}/><Stack.Screen name="Hifz Practice" component={HifzPracticeScreen}/><Stack.Screen name="Quran Audio" component={AudioCenterScreen}/><Stack.Screen name="Audio Player" component={AudioPlayerScreen}/></Stack.Navigator>}

const libraryGroups=[
  {label:'REMEMBER',title:'Daily remembrance',items:[['hand-left-outline','Duas','Hisn al-Muslim by occasion'],['radio-outline','Tasbih','A quiet, tactile dhikr counter'],['sparkles-outline','99 Names','Learn and reflect on the Beautiful Names']]},
  {label:'LISTEN',title:'Recitation and audio',items:[['radio-outline','Quran Audio','Reciters, translation audio and playlists']]},
  {label:'LEARN',title:'Knowledge with sources',items:[['chatbubble-ellipses-outline','Hadith','Daily teaching with collection reference'],['sparkles-outline','Prophet Names','The twenty-five prophets named in the Qur\'an']]},
  {label:'PLAN & NEARBY',title:'Practical tools',items:[['calculator-outline','Zakat','Estimate eligible wealth with clarity'],['business-outline','Mosques','Search the live public directory']]},
];
function ExploreHome({navigation}:any){const {width}=useWindowDimensions();const wide=width>=850;let index=0;return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}><TopBar overline="REMEMBRANCE AND LEARNING" title="Library" right={<MotionGlyph name="sparkles-outline" size={20}/>}/><Text style={s.intro}>Remembrance, trusted learning and practical tools—organized by purpose rather than hidden in a feature grid.</Text>{libraryGroups.map(group=><View key={group.label}><Text style={s.libraryKicker}>{group.label}</Text><Text style={s.libraryHeading}>{group.title}</Text><View style={s.exploreGrid}>{group.items.map(([iconName,title,desc]:any)=>{const delay=index++*40;return <MotionPress key={title} onPress={()=>{const cross:any=({'Quran Audio':()=>navigation.navigate('Quran',{screen:'Quran Audio'})} as any)[title];if(cross)cross();else navigation.navigate(title)}} style={[s.exploreCard,wide&&s.exploreCardWide]}><View style={s.exploreCardInner}><ToolGraphic tool={title} size={64}/><Text style={s.exploreTitle}>{title}</Text><Text style={s.exploreBody}>{desc}</Text><View style={s.exploreArrow}>{ico('arrow-forward',15,C.green)}</View></View></MotionPress>})}</View></View>)}<Pressable onPress={()=>navigation.navigate('Data sources')} style={[s.settings,s.dataSourceRow]} accessibilityRole="button" accessibilityLabel="Data sources"><ToolGraphic tool="Quran" size={40}/><View style={{flex:1,marginHorizontal:13}}><Text style={s.settingName}>Data sources</Text><Text style={s.meta}>Where the app gets Quran text, prayer times, hadith and audio</Text></View>{ico('arrow-forward',17,'#B9BEC9')}</Pressable></ScrollView></Page>}
function ToolBar({title,navigation}:any){const{rtl}=useLanguage();return <View style={s.readerBar}><IconButton name={rtl?'arrow-forward':'arrow-back'} onPress={()=>navigation.goBack()}/><Text style={s.readerName}>{title}</Text><View style={{width:44}}/></View>}
function QiblaScreen({navigation}:any){const{location}=useAppLocation();const[direction,setDirection]=useState<number|null>(null);const[error,setError]=useState('');const load=async()=>{if(!location)return;setDirection(null);setError('');try{setDirection(await getQibla(location.latitude,location.longitude))}catch(e:any){setError(e.message)}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title="Qibla direction" navigation={navigation}/>{!location?<View style={s.dataPage}><LocationPrompt compact/></View>:<View style={s.toolPage}><Text style={s.toolEyebrow}>{location.label}</Text>{error?<ErrorState message={error} retry={load}/>:direction===null?<Spinner/>:<><View style={s.compass}><Text style={s.north}>N</Text><View style={[s.compassArrow,{transform:[{rotate:`${direction}deg`}]}]}>{ico('navigate',74,C.green)}</View><View style={s.kaaba}><View style={s.kaabaGold}/></View></View><Text style={s.direction}>{direction.toFixed(1)}°</Text><Text style={s.directionText}>clockwise from true north</Text><Pressable onPress={load} style={s.primary}><Text style={s.primaryText}>Refresh direction</Text></Pressable></>}</View>}</Page>}
function TasbihScreen({ navigation }: any) {
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
  return <Page><ToolBar title="Tasbih" navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Tasbih" size={68} />
      <Text style={s.dataTitle}>Dhikr counter</Text>
      <Text style={s.intro}>Count privately on this device. Nothing is sent anywhere and no account is needed.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
        {DHIKR_PHRASES.map((item) => <ChoicePill key={item.id} label={item.transliteration} selected={item.id === state.phraseId} onPress={() => { void setTasbihPhrase(item.id); }} />)}
      </ScrollView>

      <View style={s.tasbihCard}>
        <Text style={s.tasbihAr}>{phrase.arabic}</Text>
        <Text style={s.directionText}>{phrase.meaning}</Text>
        <Pressable accessibilityLabel="Count one dhikr" onPress={tap} style={[s.counter, width < 360 && { width: width - 80, height: width - 80 }]}>
          <Animated.View style={{ transform: [{ scale: press }], alignItems: 'center' }}>
            <Text style={s.counterNo}>{state.count}</Text>
            <Text style={s.counterGoal}>{celebrated ? 'COMPLETE' : `GOAL · ${state.goal}`}</Text>
          </Animated.View>
        </Pressable>
        <View style={s.hadithTrack}><View style={[s.hadithFill, { width: `${progress}%` }]} /></View>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel="Reset the current count" onPress={() => void resetTasbihCount()} style={s.secondary}>{ico('refresh-outline', 16, C.green)}<Text style={s.secondaryText}>Reset</Text></Pressable>
          <Pressable accessibilityLabel="Save this round to history" onPress={() => void saveTasbihSession()} style={s.secondary}>{ico('checkmark-outline', 16, C.green)}<Text style={s.secondaryText}>Save round</Text></Pressable>
        </View>
      </View>

      <Section title="Goal" />
      <View style={s.choiceRow}>
        {TASBIH_GOALS.map((goal) => <ChoicePill key={goal} label={`${goal}`} selected={goal === state.goal} onPress={() => { void setTasbihGoal(goal); }} />)}
      </View>

      <Section title="Today" />
      <View style={s.dataCard}>
        <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>Counted today</Text><Text style={s.hadithProgressName}>{total}</Text></View>
        <Text style={s.meta}>Rounds completed on this phrase: {state.rounds}</Text>
      </View>

      <Section title="History" />
      {!state.sessions.length && <View style={s.empty}><Text style={s.dataBody}>Saved rounds will appear here.</Text></View>}
      {state.sessions.slice(0, 12).map((session) => <View key={session.id} style={s.dataCard}>
        <View style={s.hadithProgressHead}>
          <Text style={s.hadithProgressName}>{session.phrase}</Text>
          <Text style={s.meta}>{new Date(session.completedAt).toLocaleDateString()}</Text>
        </View>
        <Text style={s.dataBody}>{session.count} of {session.goal}</Text>
        <Pressable accessibilityLabel="Remove this saved round" onPress={() => void removeTasbihSession(session.id)} style={{ marginTop: 8, alignSelf: 'flex-start' }}><Text style={s.dangerText}>Remove</Text></Pressable>
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

function DuaCard({ dua }: { dua: Dua }) {
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
      <Text style={s.duaKicker}>TRANSLITERATION</Text>
      <Text style={s.duaTransliteration}>{dua.transliteration}</Text>
    </>}
    <Text style={s.duaKicker}>MEANING</Text>
    <Text style={s.dataBody}>{dua.translation}</Text>
    {!!dua.reference && <Pressable accessibilityLabel="Show the source of this dua" onPress={() => setOpenSource(!openSource)}>
      <Text style={s.duaRefToggle}>{openSource ? 'Hide source' : 'Source'}</Text>
      {openSource && <Text style={s.duaReference}>{dua.reference}</Text>}
    </Pressable>}
    <View style={s.actionRow}>
      <Pressable accessibilityLabel="Copy this dua" onPress={copy} style={s.secondary}>{ico('copy-outline', 16, C.green)}<Text style={s.secondaryText}>{copied ? 'Copied' : 'Copy'}</Text></Pressable>
      <Pressable accessibilityLabel="Share this dua" onPress={share} style={s.secondary}>{ico('share-outline', 16, C.green)}<Text style={s.secondaryText}>Share</Text></Pressable>
    </View>
  </View>;
}

function DownloadsScreen({ route, navigation }: any) {
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
  const editionLabel = settings.reciterMode === 'surah' ? settings.surahReciterName || 'Full-Surah reciter' : settings.reciterName;
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
      setMessage(error?.message || 'The download could not be completed.');
    } finally {
      setBusy('');
    }
  };
  const keepAudio = () => run('audio', () => downloadSurahAudio({
    chapterId: focusId as number,
    chapterName: focusName,
    edition,
    label: `${editionLabel} · full Surah`,
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
  return <Page><ToolBar title="Downloads" navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Offline Quran" size={68} />
      <Text style={s.dataTitle}>Kept on this device</Text>
      <View style={s.dataCard}>
        <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>Stored</Text><Text style={s.hadithProgressName}>{formatBytes(used)}</Text></View>
        <Text style={s.meta}>Free space: {free === Number.POSITIVE_INFINITY ? 'unknown on this browser' : formatBytes(free)}</Text>
      </View>

      {!!focusId && <View style={s.dataCard}>
        <Text style={s.dataMeta}>KEEP THIS SURAH</Text>
        <Text style={s.dataName}>{focusName}</Text>
        <Text style={s.meta}>Audio: {editionLabel}{settings.reciterMode === 'surah' ? ' (file per Surah)' : ' (full-Surah file)'}</Text>
        <Text style={s.meta}>Text: {preferences.scriptName} · {preferences.translationName}</Text>
        <View style={s.actionRow}>
          <Pressable accessibilityLabel="Keep the audio for this Surah" disabled={!url || busy === 'audio'} onPress={() => { void keepAudio(); }} style={[s.secondary, (!url || busy === 'audio') && { opacity: 0.5 }]}><Text style={s.secondaryText}>{busy === 'audio' ? 'Downloading…' : 'Keep audio'}</Text></Pressable>
          <Pressable accessibilityLabel="Keep the text for this Surah" disabled={busy === 'text'} onPress={() => { void keepText(); }} style={[s.secondary, busy === 'text' && { opacity: 0.5 }]}><Text style={s.secondaryText}>{busy === 'text' ? 'Saving…' : 'Keep text'}</Text></Pressable>
        </View>
        {!url && !!source.note && <Text style={s.meta}>{source.note}</Text>}
        {!!url && <Text style={s.meta}>{settings.reciterMode === 'surah' ? 'One file for the whole Surah.' : 'Fetched in 4 MB pieces, checked against the size the source reports, then saved.'}</Text>}
      </View>}

      {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}

      <Section title={`Saved (${downloads.length})`} />
      {!downloads.length && <View style={s.empty}><Text style={s.dataBody}>Nothing saved yet. Open a Surah and choose what to keep.</Text></View>}
      {downloads.map((item) => <View key={item.id} style={s.dataCard}>
        <View style={s.hadithProgressHead}>
          <Text style={s.hadithProgressName}>{item.chapterName}</Text>
          <Text style={s.meta}>{item.kind === 'audio' ? 'Audio' : 'Text'} · {item.status === 'done' ? formatBytes(item.bytes) : item.status}</Text>
        </View>
        <Text style={s.dataBody}>{item.label}</Text>
        {item.status === 'downloading' && <View style={s.hadithTrack}><View style={[s.hadithFill, { width: `${Math.round(item.progress * 100)}%` }]} /></View>}
        {!!item.error && <Text style={s.duaReference}>{item.error}</Text>}
        <View style={s.actionRow}>
          {(item.status === 'failed' || item.status === 'paused') && <Pressable accessibilityLabel={`Retry ${item.chapterName}`} onPress={() => { void retryDownload(item.id).catch((error: any) => setMessage(error?.message || 'The download could not be restarted.')); }} style={s.secondary}><Text style={s.secondaryText}>Retry</Text></Pressable>}
          {item.status === 'downloading' && <Pressable accessibilityLabel={`Pause ${item.chapterName}`} onPress={() => { void pauseDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>Pause</Text></Pressable>}
          {item.status === 'paused' && <Pressable accessibilityLabel={`Resume ${item.chapterName}`} onPress={() => { void resumeDownload(item.id); }} style={s.secondary}><Text style={s.secondaryText}>Resume</Text></Pressable>}
          <Pressable accessibilityLabel={`Remove ${item.chapterName}`} onPress={() => { void removeDownload(item.id); }} style={s.secondary}>{ico('trash-outline', 15, C.coral)}<Text style={[s.secondaryText, { color: C.coral }]}>Remove</Text></Pressable>
        </View>
      </View>)}
      <View style={s.apiPanel}><Text style={s.apiTitle}>How a download is verified</Text><Text style={s.apiText}>Files are written to a temporary partial file first, checked against the size the server reported, and only then moved into place. A failed download is deleted rather than left half-written.</Text></View>
    </ScrollView></Page>}

function NamesScreen({ navigation }: any) {
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
      .catch((e: any) => setError(e.message || 'Please check your connection.'));
  };
  useEffect(() => { void load(); }, []);
  const soften = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]/g, '').replace(/aa/g, 'a');
  const needle = soften(query.trim());
  const shown = names.filter((name) => soften(`${name.number} ${name.transliteration} ${name.meaning} ${Object.values(name.meanings || {}).join(' ')} ${name.name}`).includes(needle));
  const meaning = (name: DivineName) => name.meanings?.[language] || name.meanings?.en || name.meaning;
  const pickLanguage = async (code: string) => { setLanguage(code); await saveNameLanguage(code); };
  return <Page><ToolBar title="The Beautiful Names" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="99 Names" size={72} />
    <Text style={s.dataTitle}>The Beautiful Names</Text>
    
    <Text style={s.intro}>Ninety-nine Names with their Arabic, transliteration and meaning. Choose the language the meaning is shown in.</Text>

    {!!day && <View style={s.nameOfDayCard}>
      <Text style={s.duaKicker}>NAME OF THE DAY</Text>
      <Text style={s.namesArabicLarge}>{day.name}</Text>
      <Text style={s.namesTransliteration}>{day.transliteration}</Text>
      <Text style={s.dataBody}>{meaning(day)}</Text>
    </View>}

    <Section title="Meaning language" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
      {NAME_LANGUAGES.map((entry) => <ChoicePill key={entry.code} label={entry.label} selected={entry.code === language} onPress={() => { void pickLanguage(entry.code); }} />)}
    </ScrollView>

    <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel="Search the Names" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search a Name" placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel="Clear name search" onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!error && !names.length && <Spinner />}
    {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>Read from this device — the network is not reachable right now.</Text></View>}
    <Text style={s.meta}>{shown.length} of {names.length || 99} Names</Text>
    {shown.map((name) => <View key={name.number} style={s.nameRow}>
      <View style={s.nameNumber}><Text style={s.hadithNumberText}>{name.number}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={s.namesArabic}>{name.name}</Text>
        <Text style={s.namesTransliteration}>{name.transliteration}</Text>
        <Text style={s.dataBody}>{meaning(name)}</Text>
      </View>
    </View>)}
    {!!names.length && <View style={s.apiPanel}><Text style={s.apiTitle}>Kept on this device</Text><Text style={s.apiText}>The catalogue is stored after the first visit, so the Names can be read without a connection. The Qur'an translation you use elsewhere ({preferences.translationEdition}) does not affect these meanings.</Text></View>}
    <Pressable accessibilityLabel="Open the prophets catalogue" onPress={() => navigation.navigate('Prophet Names')} style={s.secondary}><Text style={s.secondaryText}>Prophets named in the Qur'an</Text></Pressable>
  </ScrollView></Page>}

function ProphetNamesScreen({ navigation }: any) {
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
      .catch((e: any) => setError(e.message || 'Please check your connection.'));
  }, [open, preferences.scriptEdition, preferences.translationEdition]);
  return <Page><ToolBar title="Prophets" navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool="Names" size={68} />
      <Text style={s.dataTitle}>Prophets in the Qur'an</Text>
      <Text style={s.intro}>Twenty-five prophets are named in the Qur'an. Open one to read the verse the reference points to.</Text>
      {PROPHETS.map((prophet) => {
        const isOpen = open === prophet.id;
        return <View key={prophet.id} style={s.dataCard}>
          <Pressable accessibilityLabel={`Open ${prophet.english}`} onPress={() => setOpen(isOpen ? null : prophet.id)}>
            <View style={s.nameRow}>
              <View style={s.nameNumber}><Text style={s.namesArabic}>{prophet.arabic}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.namesTransliteration}>{prophet.transliteration} · {prophet.english}</Text>
                <Text style={s.dataBody}>{prophet.note}</Text>
              </View>
              {ico(isOpen ? 'chevron-down' : 'chevron-forward', 16, C.muted)}
            </View>
          </Pressable>
          {isOpen && <>
            <Text style={s.duaKicker}>VERSE {prophet.reference}</Text>
            {!!error && <Text style={s.dataMeta}>{error}</Text>}
            {!error && !verse.length && <Spinner />}
            {verse.map((row) => <View key={row.edition}>
              {row.language === 'ar' ? <Text style={s.dataArabic}>{row.text}</Text> : <Text style={s.dataBody}>{row.text}</Text>}
            </View>)}
          </>}
        </View>;
      })}
    </ScrollView></Page>}

function DuasScreen({ navigation }: any) {
  const [payload, setPayload] = useState<{ shortcuts: string[]; categories: DuaCategory[] } | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const load = () => {
    setError('');
    return loadDuaCategories()
      .then((next) => setPayload({ shortcuts: next.shortcuts, categories: next.categories }))
      .catch((e: any) => setError(e.message || 'Please check your connection.'));
  };
  useEffect(() => { void load(); }, []);
  const categories = (payload?.categories || []).filter((category) => `${category.en} ${category.ar}`.toLowerCase().includes(query.trim().toLowerCase()));
  const shortcuts = payload?.shortcuts || [];
  return <Page><ToolBar title="Duas and Adhkar" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Duas" size={72} />
    <Text style={s.dataTitle}>Duas and Adhkar</Text>
    
    <Text style={s.intro}>Remembrance for 132 occasions, in Arabic with transliteration and meaning. Each entry keeps the reference the source gives for it.</Text>

    <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel="Search occasions" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search an occasion" placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel="Clear occasion search" onPress={() => setQuery('')}>{ico('close', 16, C.muted)}</Pressable>}</View>

    {!!error && <ErrorState message={error} retry={load} />}
    {!payload && !error && <Spinner />}
    {!!payload && <>
      <Section title="Daily moments" />
      <View style={s.duaShortcutGrid}>{shortcuts.map((key) => {
        const category = payload.categories.find((entry) => entry.key === key);
        return <Pressable key={key} accessibilityLabel={`Open ${DUA_SHORTCUT_LABELS[key] || key}`} onPress={() => navigation.navigate('Dua Category', { key, label: DUA_SHORTCUT_LABELS[key] || key })} style={s.duaShortcut}>
          <Text style={s.duaShortcutLabel}>{DUA_SHORTCUT_LABELS[key] || key}</Text>
          <Text style={s.meta}>{category ? `${category.count} ${category.count === 1 ? 'dua' : 'duas'}` : 'Open'}</Text>
        </Pressable>;
      })}</View>
      <Section title="All occasions" />
      <View style={s.duaCategoryGrid}>{categories.map((category) => <Pressable key={category.key} accessibilityLabel={`Open ${category.en}`} onPress={() => navigation.navigate('Dua Category', { key: category.key, label: category.en })} style={s.duaCategoryCard}>
        <Text style={s.duaCategoryNo}>{category.number}</Text>
        <Text style={s.duaCategoryName}>{category.en}</Text>
        <Text style={s.meta}>{category.count} {category.count === 1 ? 'dua' : 'duas'}</Text>
      </Pressable>)}</View>
      {!categories.length && <View style={s.empty}><Text style={s.dataBody}>No occasion matches that word.</Text></View>}
      <View style={s.apiPanel}><Text style={s.apiTitle}>Kept on this device</Text><Text style={s.apiText}>Every occasion you open is stored locally, so it can be read again without a connection.</Text></View>
    </>}
  </ScrollView></Page>}

function DuaCategoryScreen({ route, navigation }: any) {
  const key = String(route.params?.key || 'morning');
  const label = route.params?.label || 'Adhkar';
  const [duas, setDuas] = useState<Dua[]>([]);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    return loadDuas(key)
      .then((result) => { setDuas(result.duas); setOffline(result.cached); })
      .catch((e: any) => setError(e.message || 'Please check your connection.'));
  };
  useEffect(() => { void load(); }, [key]);
  return <Page><ToolBar title={label} navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <Spinner />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>Read from this device — the network is not reachable right now.</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)}
      {!!duas.length && <View style={s.apiPanel}><Text style={s.apiTitle}>Collection</Text><Text style={s.apiText}>{duas[0].category || label}</Text></View>}
    </ScrollView></Page>}

function AdhkarScreen({ route, navigation }: any) {
  const [category, setCategory] = useState(route.params?.initial || 'morning');
  const [duas, setDuas] = useState<Dua[]>([]);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    return loadDuas(category)
      .then((result) => { setDuas(result.duas); setOffline(result.cached); })
      .catch((e: any) => setError(e.message || 'Please check your connection.'));
  };
  useEffect(() => { void load(); }, [category]);
  const morning = category === 'morning';
  return <Page><ToolBar title="Daily Adhkar" navigation={navigation} />
    <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <ToolGraphic tool={morning ? 'Morning Adhkar' : 'Evening Adhkar'} size={72} />
      <Text style={s.dataTitle}>{morning ? 'Morning remembrance' : 'Evening remembrance'}</Text>
      <View style={s.choiceRow}>
        <ChoicePill label="Morning" selected={morning} onPress={() => setCategory('morning')} />
        <ChoicePill label="Evening" selected={!morning} onPress={() => setCategory('evening')} />
      </View>
      <View style={{ height: 12 }} />
      <Pressable accessibilityLabel="Browse every occasion" onPress={() => navigation.navigate('Duas')} style={s.secondary}><Text style={s.secondaryText}>All duas and occasions</Text></Pressable>
      <View style={{ height: 14 }} />
      {!!error && <ErrorState message={error} retry={load} />}
      {!error && !duas.length && <Spinner />}
      {offline && <View style={s.offlineNote}><Text style={s.offlineNoteText}>Read from this device — the network is not reachable right now.</Text></View>}
      {duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)}
    </ScrollView></Page>}

function DataTool({route,navigation}:any){
 const {location}=useAppLocation(); const title=route.name; const[items,setItems]=useState<any[]>([]); const[error,setError]=useState(''); const[loaded,setLoaded]=useState(false);
 const load=async()=>{setError('');setLoaded(false);try{if(title==='Duas')setItems(await getDuas('morning'));else if(title==='99 Names')setItems(await getNames());else if(title==='Hadith')setItems([await getDailyHadith()]);else if(title==='Mosques'){if(!location){setItems([]);return}setItems(await getNearbyMosques(location.latitude,location.longitude));}}catch(e:any){setError(e.message)}finally{setLoaded(true)}};
 useEffect(()=>{load()},[title,location?.latitude,location?.longitude]);
 return <Page><ToolBar title={title} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><Text style={s.dataTitle}>{title==='Duas'?'Morning remembrance':title==='99 Names'?'The Beautiful Names':title==='Hadith'?'Hadith of the day':'Mosques near you'}</Text>{title==='Mosques'&&!location?<LocationPrompt compact/>:error?<ErrorState message={error} retry={load}/>:!loaded?<Spinner/>:!items.length?<View style={s.empty}><View style={s.errorIcon}>{ico('location-outline',24,C.green)}</View><Text style={s.errorTitle}>No live records nearby</Text><Text style={s.errorText}>The directory does not currently list a public mosque within 50 km of this location.</Text></View>:items.map((item:any,i)=><View key={item.number||item.slug||i} style={s.dataCard}>{title==='99 Names'?<><Text style={s.dataArabic}>{item.name}</Text><Text style={s.dataName}>{item.transliteration}</Text><Text style={s.dataBody}>{item.meaning}</Text></>:title==='Hadith'?<><Text style={s.dataBody}>{item.text}</Text><Text style={s.dataMeta}>{item.collection?.toUpperCase()} · {item.number}</Text></>:title==='Mosques'?<><Text style={s.dataName}>{item.name}</Text><Text style={s.dataBody}>{item.city}, {item.country}</Text><Text style={s.dataMeta}>{item.distance_km?.toFixed?.(1)} km · {item.source}</Text></>:<><Text style={s.dataArabic}>{item.arabic}</Text><Text style={s.dataBody}>{item.translation}</Text><Text style={s.dataMeta}>{item.category}</Text></>}</View>)}</ScrollView></Page>
}

function FastingScreen({navigation}:any){
  const fasting=useFasting();
  const [message,setMessage]=useState('');
  const [reason,setReason]=useState<MissedReason>('travel');
  const summary=summariseFasting(fasting);
  const todayKey=new Date().toISOString().slice(0,10);
  const mark=(type:FastType,options?:{reason?:MissedReason})=>{void recordFast(type,options).then(()=>setMessage('Saved on this device.'))};
  const undo=()=>{void clearFastDay().then(()=>setMessage('Today’s record cleared.'))};
  const adjust=(delta:number)=>{void setFastingOwed(summary.owed+delta)};
  return <Page><ToolBar title="Fasting record" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Fasting" size={80}/>
    <Text style={s.dataTitle}>Fasting record</Text>
    <Text style={s.intro}>A private record of the days you fasted, the days you could not, and the make-up days that remain. Nothing leaves this device.</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>DAYS FASTED</Text><Text style={s.zakatNo}>{summary.completed}</Text><Text style={s.weekScoreBody}>{summary.ramadan} Ramadan · {summary.voluntary} voluntary</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>CURRENT STREAK</Text><Text style={s.zakatNo}>{summary.streak} {summary.streak===1?'day':'days'}</Text><Text style={s.weekScoreBody}>{summary.thisWeek} in the last 7 days</Text></View></View>
    <Section title="Today" action={readableDate(todayKey)} />
    <View style={s.dataCard}>
      <Text style={s.dataMeta}>{summary.today?`RECORDED · ${labelForEntry(summary.today)}`:'NOT RECORDED YET'}</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel="Record today as a Ramadan fast" onPress={()=>mark('ramadan')} style={s.secondary}><Text style={s.secondaryText}>Ramadan fast</Text></Pressable>
        <Pressable accessibilityLabel="Record today as a voluntary fast" onPress={()=>mark('voluntary')} style={s.secondary}><Text style={s.secondaryText}>Voluntary</Text></Pressable>
        <Pressable accessibilityLabel="Record today as a make-up fast" onPress={()=>mark('qada')} style={s.secondary}><Text style={s.secondaryText}>Make-up day</Text></Pressable>
      </View>
      {!!summary.today && <Pressable accessibilityLabel="Clear today’s fasting record" onPress={undo} style={[s.dangerButton]}><Text style={s.dangerText}>Clear today</Text></Pressable>}
    </View>
    <Section title="If today was not fasted" />
    <View style={s.dataCard}>
      <Text style={s.dataBody}>Recording a missed day adds one day to the make-up ledger below.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,marginTop:11}}>{MISSED_REASONS.map(item=><ChoicePill key={item.id} label={item.label} selected={reason===item.id} onPress={()=>setReason(item.id)}/>)}</ScrollView>
      <Text style={s.meta}>{MISSED_REASONS.find(item=>item.id===reason)?.detail}</Text>
      <Pressable accessibilityLabel="Record today as not fasted" onPress={()=>mark('missed',{reason})} style={[s.primary]}><Text style={s.primaryText}>Record as not fasted</Text></Pressable>
    </View>
    <Section title="Make-up ledger" action={`${summary.qada} settled`} />
    <View style={s.dataCard}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>Days owed</Text><Text style={s.hadithProgressName}>{summary.owed}</Text></View>
      <Text style={s.meta}>{summary.qada} make-up days recorded · {summary.missed} missed days recorded</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel="One fewer day owed" onPress={()=>adjust(-1)} style={s.secondary}><Text style={s.secondaryText}>− 1 day</Text></Pressable>
        <Pressable accessibilityLabel="One more day owed" onPress={()=>adjust(1)} style={s.secondary}><Text style={s.secondaryText}>+ 1 day</Text></Pressable>
      </View>
    </View>
    <Section title="Recent record" action={`${fasting.entries.length} entries`} />
    {!fasting.entries.length && <View style={s.empty}><Text style={s.dataBody}>Nothing recorded yet. Mark today above and your record starts here.</Text></View>}
    {!!fasting.entries.length && <View style={s.settings}>{summary.recent.map(entry=><View key={entry.date} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{readableDate(entry.date)}</Text><Text style={s.meta}>{labelForEntry(entry)}</Text></View><Pressable accessibilityLabel={`Remove the fasting record for ${readableDate(entry.date)}`} onPress={()=>{void clearFastDay(entry.date)}}>{ico('trash-outline',17,C.coral)}</Pressable></View>)}</View>}
    {!!message && <View style={s.offlineNote}><Text style={s.offlineNoteText}>{message}</Text></View>}
    <View style={s.apiPanel}><Text style={s.apiTitle}>A note on rulings</Text><Text style={s.apiText}>This is a private record, not a ruling. What obliges a make-up fast, and what excuses a day, depends on your situation: travel, illness, pregnancy, the monthly cycle and post-natal bleeding each have their own rules. Please confirm your own case with a scholar or a trusted, sourced guide. Everything here stays on this device, and nothing is uploaded.</Text></View>
  </ScrollView></Page>;
}
function WeeklySummaryScreen({navigation}:any){const[history,setHistory]=useState<Record<string,string[]>>({});const[hifz,setHifz]=useState<Record<number,HifzStatus>>({});const[names,setNames]=useState<Record<number,string>>({});const log=useActivity();const tasbih=useTasbih();
 useEffect(()=>{loadPrayerHistory().then(setHistory);loadHifz().then(setHifz);getChapters().then(list=>{const map:Record<number,string>={};list.forEach(c=>{map[c.id]=c.name_simple});setNames(map)}).catch(()=>undefined)},[]);
 const week=buildWeeklySummary({activity:log,prayerHistory:history,tasbihDays:tasbih.days});
 const maxVerses=Math.max(1,...week.rows.map(r=>r.verses));const maxDhikr=Math.max(1,...week.rows.map(r=>r.dhikr));const maxHifz=Math.max(1,...week.rows.map(r=>r.hifz));
 const memorized=Object.values(hifz).filter(x=>x==='memorized').length;const revising=Object.values(hifz).filter(x=>x==='revising').length;
 const opened=Array.from(new Set(week.rows.flatMap(r=>log[r.key]?.surahs||[])));const total=week.totals;const active=total.prayers+total.verses+total.dhikr+total.hifz;
 return <Page><ToolBar title="Weekly summary" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Weekly Summary" size={78}/>
    <Text style={s.dataTitle}>Your week in review</Text>
    <Text style={s.intro}>Seven days of salah, reading, dhikr and memorisation, counted only from what you did in the app. Everything stays on this device.</Text>
    <View style={s.summaryScore}><View><Text style={s.nextCardLabel}>LAST 7 DAYS</Text><Text style={s.zakatNo}>{total.prayers} / 35</Text><Text style={s.weekScoreBody}>prayers marked</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.nextCardLabel}>STREAKS</Text><Text style={s.zakatNo}>{week.prayerStreak} {week.prayerStreak===1?'day':'days'}</Text><Text style={s.weekScoreBody}>{week.activeStreak} active {week.activeStreak===1?'day':'days'}</Text></View></View>
    <View style={s.twoCol}>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>VERSES MARKED</Text><Text style={s.weekStatValue}>{total.verses}</Text><Text style={s.meta}>{total.surahs} Surahs · {total.pages} pages</Text></View>
      <View style={[s.dataCard,{flex:1,marginBottom:0}]}><Text style={s.dataMeta}>DHIKR COUNTED</Text><Text style={s.weekStatValue}>{total.dhikr}</Text><Text style={s.meta}>{total.hifz} hifz reviews</Text></View>
    </View>
    {!active && <View style={[s.empty,{marginTop:12}]}><Text style={s.dataBody}>Nothing recorded in the last seven days yet. Mark a prayer, read a Surah, count dhikr or practise a verse and this page fills in.</Text></View>}
    <Section title="Daily salah" action={week.bestDay && week.bestDay.prayers ? `Best: ${week.bestDay.label}` : ''} />
    <View style={s.settings}>{week.rows.map(day=><View key={day.key} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.summaryDots}>{Array.from({length:5}).map((_,i)=><View key={i} style={[s.summaryDot,i<day.prayers&&s.summaryDotDone]}/>)}</View><Text style={s.progressCount}>{day.prayers}/5</Text></View>)}</View>
    <Section title="Quran reading" action={`${total.verses} verses`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`read-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.surahs} Surahs · {day.pages} pages</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.verses/maxVerses*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.verses}</Text></View>)}</View>
    {!!opened.length && <View style={s.dataCard}><Text style={s.dataMeta}>SURAHS OPENED THIS WEEK</Text><Text style={s.dataBody}>{opened.slice(0,8).map(id=>names[id]||`Surah ${id}`).join(' · ')}</Text></View>}
    <Section title="Hifz" action={`${memorized} memorized · ${revising} revising`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`hifz-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.hifz/maxHifz*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.hifz}</Text></View>)}</View>
    <Section title="Dhikr" action={`${total.dhikr} counted`} />
    <View style={s.settings}>{week.rows.map(day=><View key={`dhikr-${day.key}`} style={s.summaryDay}><View style={{flex:1}}><Text style={s.settingName}>{day.label}</Text><Text style={s.meta}>{day.short}</Text></View><View style={s.weekBar}><View style={[s.weekBarFill,{width:`${Math.round(day.dhikr/maxDhikr*100)}%`} as any]}/></View><Text style={s.progressCount}>{day.dhikr}</Text></View>)}</View>
    <View style={s.apiPanel}><Text style={s.apiTitle}>How these numbers are counted</Text><Text style={s.apiText}>Salah counts the prayers you mark on the Prayer screen. Reading counts the verses you mark in the reader and the Mushaf pages you open. Dhikr comes from the Tasbih counter, and hifz from every verse you rate in recall practice. Thirty days are kept, on this device only, and nothing is uploaded.</Text></View>
  </ScrollView></Page>}

const CITY_PRESETS=[
 {label:'Dubai, United Arab Emirates',latitude:25.2048,longitude:55.2708},{label:'Makkah, Saudi Arabia',latitude:21.3891,longitude:39.8579},{label:'Madinah, Saudi Arabia',latitude:24.5247,longitude:39.5692},{label:'London, United Kingdom',latitude:51.5074,longitude:-.1278},{label:'New York, United States',latitude:40.7128,longitude:-74.006},{label:'Karachi, Pakistan',latitude:24.8607,longitude:67.0011}
];
function LocationSetupScreen({navigation}:any){const loc=useAppLocation();const[label,setLabel]=useState('');const[lat,setLat]=useState('');const[lng,setLng]=useState('');const save=()=>{const latitude=Number(lat),longitude=Number(lng);if(!label.trim()||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){Alert.alert('Check location','Enter a label and valid latitude/longitude values.');return}loc.setManual({label:label.trim(),latitude,longitude});navigation.navigate('Tools',{screen:'Prayer'})};return <Page><ToolBar title="Location setup" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Location" size={76}/><Text style={s.dataTitle}>Choose explicitly</Text><Text style={s.intro}>Prayer, Qibla, Ramadan, and mosque tools share this saved location. It stays on this device.</Text><Pressable onPress={loc.useDevice} style={s.primary}><Text style={s.primaryText}>{loc.locating?'Locating…':'Use current GPS location'}</Text></Pressable><Section title="City shortcuts"/><View style={s.cityGrid}>{CITY_PRESETS.map(city=><Pressable key={city.label} onPress={()=>{loc.setManual(city);navigation.navigate('Tools',{screen:'Prayer'})}} style={[s.cityCard,loc.location?.label===city.label&&s.cityCardActive]}><Text style={s.cityName}>{city.label}</Text><Text style={s.meta}>{city.latitude.toFixed(3)}, {city.longitude.toFixed(3)}</Text></Pressable>)}</View><Section title="Manual coordinates"/><View style={s.formCard}><Text style={s.inputLabel}>LOCATION LABEL</Text><TextInput value={label} onChangeText={setLabel} placeholder="e.g. Home, Abu Dhabi" style={s.textField}/><View style={s.fieldRow}><View style={{flex:1}}><Text style={s.inputLabel}>LATITUDE</Text><TextInput value={lat} onChangeText={setLat} keyboardType="numbers-and-punctuation" placeholder="24.4539" style={s.textField}/></View><View style={{flex:1}}><Text style={s.inputLabel}>LONGITUDE</Text><TextInput value={lng} onChangeText={setLng} keyboardType="numbers-and-punctuation" placeholder="54.3773" style={s.textField}/></View></View><Pressable onPress={save} style={s.primary}><Text style={s.primaryText}>Save manual location</Text></Pressable></View>{loc.location&&<Pressable onPress={loc.clear} style={s.dangerButton}><Text style={s.dangerText}>Clear saved location</Text></Pressable>}</ScrollView></Page>}

function NotificationScreen({navigation}:any){const{location}=useAppLocation();const{settings,update}=useWorshipSettings();const[health,setHealth]=useState<NotificationHealth>('undetermined');const[working,setWorking]=useState(false);useEffect(()=>{getNotificationHealth().then(setHealth)},[]);const permission=async()=>setHealth(await requestNotificationPermission());const sync=async()=>{if(!location)return Alert.alert('Location needed','Choose a prayer location before scheduling reminders.');setWorking(true);try{const value=await managedPrayerSnapshot(location,settings);const result=await schedulePrayerNotifications(value.snapshot,settings);Alert.alert(result.unsupported?'Saved for installed app':'Reminders updated',result.unsupported?'Web browsers are not scheduled here. Your choices are saved and will apply in the installed iOS or Android app.':`${result.scheduled} notifications scheduled.`)}catch(e:any){Alert.alert('Could not schedule',e.message)}finally{setWorking(false)}};const togglePrayer=(name:string)=>update({prayerReminders:{...settings.prayerReminders,[name]:!settings.prayerReminders[name]}});return <Page><ToolBar title="Prayer reminders" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Notifications" size={76}/><Text style={s.dataTitle}>Gentle, local reminders</Text><Text style={s.intro}>Permission and scheduling happen on your device. No notification profile is sent to us.</Text><View style={s.healthCard}><View style={[s.healthDot,{backgroundColor:health==='granted'?'#3A8A72':health==='denied'?C.coral:C.gold}]}/><View style={{flex:1}}><Text style={s.sourceTitle}>Permission: {health}</Text><Text style={s.sourceBody}>{health==='unsupported'?'System scheduling is available in the installed mobile app.':'You remain in control through system settings.'}</Text></View>{health!=='granted'&&health!=='unsupported'&&<Pressable onPress={permission} style={s.ghostSmall}><Text style={s.ghostText}>Allow</Text></Pressable>}</View><View style={s.settings}><View style={s.setting}><MotionGlyph name="notifications-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>Prayer reminders</Text><Text style={s.meta}>Master schedule switch</Text></View><View style={{direction:'ltr'} as any}><Switch value={settings.remindersEnabled} onValueChange={v=>update({remindersEnabled:v})} trackColor={{true:C.green}}/></View></View></View><Text style={s.preferenceLabel}>REMIND ME BEFORE PRAYER</Text><View style={s.choiceRow}>{[0,5,10,15,30].map(value=><ChoicePill key={value} label={value?`${value} min`:'At time'} selected={settings.reminderOffset===value} onPress={()=>update({reminderOffset:value})}/>)}</View><Section title="Per-prayer reminders"/><View style={s.settings}>{['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(name=><View key={name} style={s.setting}><ToolGraphic tool="Notifications" size={42}/><Text style={[s.settingName,{flex:1}]}>{name}</Text><View style={{direction:'ltr'} as any}><Switch value={settings.prayerReminders[name]} onValueChange={()=>togglePrayer(name)} trackColor={{true:C.green}}/></View></View>)}</View><Section title="Quran reminder"/><View style={s.settings}><View style={s.setting}><ToolGraphic tool="Quran" size={42}/><View style={{flex:1}}><Text style={s.settingName}>Daily reading reminder</Text><Text style={s.meta}>{settings.quranReminderTime}</Text></View><View style={{direction:'ltr'} as any}><Switch value={settings.quranReminderEnabled} onValueChange={v=>update({quranReminderEnabled:v})} trackColor={{true:C.green}}/></View></View></View><Text style={s.preferenceLabel}>READING REMINDER TIME</Text><View style={s.choiceRow}>{['06:30','12:30','20:00','22:00'].map(time=><ChoicePill key={time} label={time} selected={settings.quranReminderTime===time} onPress={()=>update({quranReminderTime:time})}/>)}</View><View style={s.actionRow}><Pressable onPress={sync} style={s.primary}><Text style={s.primaryText}>{working?'Scheduling…':'Save & reschedule'}</Text></Pressable><Pressable onPress={()=>sendTestNotification().catch(e=>Alert.alert('Test unavailable',e.message))} style={s.secondary}><Text style={s.secondaryText}>Test notification</Text></Pressable></View></ScrollView></Page>}

const ADHAN_TRACKS=[
 {id:'Makkah',title:'Beautiful Adhan',detail:'Bundled offline · Public domain',source:require('./assets/audio/adhan-doha-public-domain.mp3')},
 {id:'Doha Fajr',title:'Doha Fajr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_01_Fajr_Adhan.mp3'},
 {id:'Doha Classic',title:'Doha Dhuhr Adhan',detail:'Public domain · Internet Archive',source:'https://archive.org/download/adhan.recordings.from.doha.qatar/Adhan_Doha_Qatar_02_Dhuhr_Adhan.mp3'}
];
function AdhanScreen({navigation}:any){const{settings,update}=useWorshipSettings();const selected=ADHAN_TRACKS.find(x=>x.id===settings.adhanReciter)||ADHAN_TRACKS[0];const player=useAudioPlayer(selected.source);const status=useAudioPlayerStatus(player);const toggle=()=>status.playing?player.pause():player.play();useEffect(()=>()=>{player.pause()},[player]);return <Page><ToolBar title="Adhan" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Adhan" size={82}/><Text style={s.dataTitle}>Choose an Adhan</Text><Text style={s.intro}>Preview a recording and choose which prayers may use Adhan. The bundled selection works without a network connection.</Text><View style={s.audioPreview}><Pressable accessibilityLabel={status.playing?'Pause Adhan preview':'Play Adhan preview'} onPress={toggle} style={s.audioPlay}>{ico(status.playing?'pause':'play',25,C.white)}</Pressable><View style={{flex:1}}><Text style={s.profileName}>{selected.title}</Text><Text style={s.profileSub}>{selected.detail}</Text></View><Pressable onPress={()=>{player.seekTo(0);player.pause()}}>{ico('stop-circle-outline',26,C.white)}</Pressable></View><Section title="Recordings"/><View style={s.settings}>{ADHAN_TRACKS.map(track=><Pressable accessibilityRole="radio" accessibilityState={{selected:track.id===selected.id}} key={track.id} onPress={()=>update({adhanReciter:track.id})} style={s.setting}><ToolGraphic tool="Adhan" size={44}/><View style={{flex:1}}><Text style={s.settingName}>{track.title}</Text><Text style={s.meta}>{track.detail}</Text></View>{ico(track.id===selected.id?'checkmark-circle':'ellipse-outline',20,track.id===selected.id?C.green:C.muted)}</Pressable>)}</View><Section title="Use Adhan for"/><View style={s.settings}>{['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(name=><View key={name} style={s.setting}><Text style={[s.settingName,{flex:1}]}>{name}</Text><View style={{direction:'ltr'} as any}><Switch value={settings.adhanEnabled[name]} onValueChange={v=>update({adhanEnabled:{...settings.adhanEnabled,[name]:v}})} trackColor={{true:C.green}}/></View></View>)}</View><View style={s.sourceCard}>{ico('information-circle-outline',21,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>Audio rights</Text><Text style={s.sourceBody}>Bundled and streamed Doha recordings: Internet Archive Public Domain Mark 1.0.</Text></View></View></ScrollView></Page>}

function GuideDirectory({navigation}:any){return <Page><ToolBar title="Worship guides" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool="Worship guides" size={78}/><Text style={s.dataTitle}>Learn with references</Text><Text style={s.intro}>Concise educational overviews with transparent Qur’an and Hadith references. Detailed rulings should be learned from a qualified local scholar.</Text><View style={s.guideGrid}>{WORSHIP_GUIDES.map(guide=><MotionPress key={guide.id} onPress={()=>navigation.navigate('Guide Detail',{guide})} style={s.guideCard}><View style={s.guideCardInner}><ToolGraphic tool={guide.id} size={62}/><Text style={s.exploreTitle}>{guide.title}</Text><Text style={s.exploreBody}>{guide.subtitle}</Text><View style={s.exploreArrow}>{ico('arrow-forward',15,C.green)}</View></View></MotionPress>)}</View></ScrollView></Page>}
function GuideDetail({route,navigation}:any){const guide:WorshipGuide=route.params.guide;return <Page><ToolBar title={guide.title} navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}><ToolGraphic tool={guide.id} size={82}/><Text style={s.dataTitle}>{guide.subtitle}</Text>{guide.arabic&&<Text style={s.guideArabic}>{guide.arabic}</Text>}<Text style={s.intro}>{guide.introduction}</Text><Section title="Step by step"/><View style={s.settings}>{guide.steps.map((step,i)=><View key={step} style={s.guideStep}><View style={s.stepNo}><Text style={s.stepNoText}>{i+1}</Text></View><Text style={s.guideStepText}>{step}</Text></View>)}</View>{guide.note&&<View style={s.guideNote}><Text style={s.sourceTitle}>Important note</Text><Text style={s.sourceBody}>{guide.note}</Text></View>}<Section title="References"/>{guide.references.map(ref=><Pressable key={ref.url} onPress={()=>Linking.openURL(ref.url)} style={s.referenceRow}><Text style={s.settingName}>{ref.label}</Text>{ico('open-outline',18,C.green)}</Pressable>)}</ScrollView></Page>}

function HijriCalendarScreen({navigation}:any){const{location}=useAppLocation();const[days,setDays]=useState<CalendarDay[]>([]);const[error,setError]=useState('');const now=new Date();const load=async()=>{if(!location)return;setError('');setDays([]);try{setDays(await getGregorianCalendar(location.latitude,location.longitude,now.getMonth()+1,now.getFullYear()))}catch(e:any){setError(e.message)}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);const first=days[0]?.gregorian.split('-').map(Number);const offset=first?new Date(first[2],first[1]-1,first[0]).getDay():0;return <Page><ToolBar title="Hijri calendar" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>{!location?<LocationPrompt compact/>:<><View style={s.calendarIntro}><Text style={s.calendarMonth}>{now.toLocaleDateString('en',{month:'long',year:'numeric'})}</Text><Text style={s.calendarHijri}>{days.length?`${days[0].hijriMonth} – ${days[days.length-1].hijriMonth} ${days[0].hijriYear} AH`:''}</Text></View>{error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<><View style={s.weekHead}>{['S','M','T','W','T','F','S'].map((d,i)=><Text key={i} style={s.weekLabel}>{d}</Text>)}</View><View style={s.calendarGrid}>{Array.from({length:offset}).map((_,i)=><View key={`e${i}`} style={s.calendarCell}/>) }{days.map((d,i)=><View key={d.gregorian} style={[s.calendarCell,d.gregorian.startsWith(String(now.getDate()).padStart(2,'0'))&&s.calendarToday]}><Text style={s.gregorianDay}>{i+1}</Text><Text style={s.hijriDay}>{d.hijriDay}</Text></View>)}</View><View style={s.calendarLegend}><View style={s.legendDot}/><Text style={s.sourceBody}>Large number: Gregorian · Small number: Hijri</Text></View></>}</>}</ScrollView></Page>}
function RamadanScreen({navigation}:any){const{location}=useAppLocation();const[days,setDays]=useState<CalendarDay[]>([]);const[year,setYear]=useState<number|null>(null);const[error,setError]=useState('');const load=async()=>{if(!location)return;setError('');setDays([]);try{const snap=await getPrayerSnapshot(location.latitude,location.longitude);const target=snap.hijriMonth>9?snap.hijriYear+1:snap.hijriYear;setYear(target);setDays(await getRamadanCalendar(location.latitude,location.longitude,target));}catch(e:any){setError(e.message)}};useEffect(()=>{load()},[location?.latitude,location?.longitude]);return <Page><ToolBar title="Ramadan" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage}>{!location?<LocationPrompt compact/>:<><LinearGradient colors={['#2A2849','#5146A4']} style={s.ramadanHero}><Text style={s.ramadanArabic}>رَمَضَان</Text><Text style={s.ramadanTitle}>Ramadan {year||''} AH</Text><Text style={s.ramadanSub}>A live 30-day Suhoor and Iftar timetable for {location.label}.</Text></LinearGradient><Pressable onPress={()=>navigation.navigate('Tools',{screen:'Fasting'})} style={[s.sourceCard,{marginTop:13}]}>{ico('create-outline',20,C.green)}<View style={{flex:1}}><Text style={s.sourceTitle}>Fasting record</Text><Text style={s.sourceBody}>Mark each day and keep your make-up ledger</Text></View>{ico('arrow-forward',18,C.green)}</Pressable>{error?<ErrorState message={error} retry={load}/>:!days.length?<Spinner/>:<><Section title="Fasting timetable" action={`${days.length} days`}/><View style={s.ramadanList}>{days.map(d=>{const fajr=d.prayers.find(p=>p.name==='Fajr');const maghrib=d.prayers.find(p=>p.name==='Maghrib');return <View key={d.gregorian} style={s.ramadanRow}><View style={s.ramadanDay}><Text style={s.ramadanDayNo}>{d.hijriDay}</Text><Text style={s.ramadanDayLabel}>RAM</Text></View><View style={{flex:1}}><Text style={s.ramadanDate}>{d.weekday} · {d.gregorian}</Text><Text style={s.meta}>{location.label}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>SUHOOR</Text><Text style={s.fastValue}>{fajr?.time}</Text></View><View style={s.fastTime}><Text style={s.fastLabel}>IFTAR</Text><Text style={s.fastValue}>{maghrib?.time}</Text></View></View>})}</View></>}</>}</ScrollView></Page>}
function ZakatScreen({navigation}:any){const[value,setValue]=useState('');const total=Number(value.replace(/,/g,''))||0;return <Page><ToolBar title="Zakat calculator" navigation={navigation}/><View style={s.dataPage}><Text style={s.dataTitle}>Calculate with clarity</Text><Text style={s.intro}>Enter your eligible wealth after deductible liabilities. Confirm the nisab threshold with a qualified local scholar.</Text><Text style={s.inputLabel}>ZAKATABLE WEALTH</Text><TextInput keyboardType="numeric" value={value} onChangeText={setValue} placeholder="0.00" style={s.moneyInput}/><LinearGradient colors={['#2A2849','#5146A4']} style={s.zakatResult}><Text style={s.nextCardLabel}>ESTIMATED ZAKAT · 2.5%</Text><Text style={s.zakatNo}>{(total*.025).toLocaleString(undefined,{maximumFractionDigits:2})}</Text></LinearGradient></View></Page>}
function HadithProgressBars(){
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
    <Text style={s.dataMeta}>READING PROGRESS</Text>
    <Text style={s.dataTitle}>{readTotal} of {hadithTotal.toLocaleString()} opened</Text>
    <View style={{marginTop:12,gap:10}}>{rows.map(row=><View key={row.collection.slug}>
      <View style={s.hadithProgressHead}><Text style={s.hadithProgressName}>{row.collection.name}</Text><Text style={s.meta}>{row.read} / {row.total.toLocaleString()}</Text></View>
      <View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${row.percent}%`}]}/></View>
    </View>)}</View>
  </View>;
}

function HadithScreen({navigation}:any){
  const state=useHadithState();
  const [query,setQuery]=useState('');
  const loaded=getLoadedCollections();
  const results=query.trim().length>=3?searchLoadedCollections(query,60):[];
  const open=(slug:string,number?:number)=>navigation.navigate(number?'Hadith Detail':'Hadith Collection',number?{slug,number}:{slug});
  return <Page><ToolBar title="Hadith" navigation={navigation}/><ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
    <ToolGraphic tool="Hadith" size={72}/>
    <Text style={s.dataTitle}>Hadith</Text>
    
    <Text style={s.intro}>Ten verified collections with matched Arabic and English texts. Grading is shown where the source publishes it—Sahih al-Bukhari and Sahih Muslim carry no separate grade because the collection itself is the grading.</Text>

    <View style={s.search}>{ico('search',18,C.muted)}<TextInput accessibilityLabel="Search hadith in opened collections" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search opened collections" placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel="Clear hadith search" onPress={()=>setQuery('')}>{ico('close',16,C.muted)}</Pressable>}</View>

    {query.trim().length>=3?(results.length?<>
      <Text style={s.meta}>{results.length} match{results.length===1?'':'es'} in {loaded.length} opened collection{loaded.length===1?'':'s'}</Text>
      {results.map(hadith=>{const collection=HADITH_COLLECTIONS.find(item=>item.slug===hadith.slug);return <Pressable key={hadith.id} onPress={()=>open(hadith.slug,hadith.number)} style={s.dataCard}>
        <Text style={s.dataMeta}>{collection?.name} · Hadith {hadith.number}</Text>
        <Text style={s.dataBody} numberOfLines={3}>{hadith.english||hadith.arabic}</Text>
      </Pressable>})}
    </>:<View style={s.empty}><Text style={s.dataBody}>{loaded.length?'No match in the collections you have opened yet.':'Open a collection once to search inside it.'}</Text></View>):<>
      {state.recent.length>0&&<>
        <Section title="Continue reading"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingRight:20}}>
          {state.recent.slice(0,8).map(item=>{const collection=HADITH_COLLECTIONS.find(entry=>entry.slug===item.slug);return <Pressable key={`${item.slug}-${item.number}`} onPress={()=>open(item.slug,item.number)} style={s.recentChipWide}>
            <Text style={s.dataMeta}>{collection?.name}</Text>
            <Text style={s.recentChipTitle}>Hadith {item.number}</Text>
          </Pressable>})}
        </ScrollView>
      </>}
      {state.saved.length>0&&<>
        <Section title="Saved hadith" action="See all" onPress={()=>navigation.navigate('Hadith Saved')}/>
        {state.saved.slice(0,3).map(item=><Pressable key={item.id} onPress={()=>open(item.slug,item.number)} style={s.dataCard}>
          <Text style={s.dataMeta}>{item.collection} · Hadith {item.number}</Text>
          <Text style={s.dataBody} numberOfLines={2}>{item.preview}</Text>
        </Pressable>)}
      </>}
      <HadithProgressBars/>
      <Section title="Collections"/>
      {HADITH_COLLECTIONS.map(collection=>{
        const total=state.totals[collection.slug]||0;
        const read=(state.read[collection.slug]||[]).length;
        const percent=total?Math.min(100,Math.round(read/total*100)):0;
        return <Pressable key={collection.slug} accessibilityLabel={`Open ${collection.name}`} onPress={()=>open(collection.slug)} style={s.hadithCollectionCard}>
          <View style={s.hadithCollectionTop}>
            <View style={{flex:1}}>
              <Text style={s.dataName}>{collection.name}</Text>
              <Text style={s.dataArabic}>{collection.arabicName}</Text>
              <Text style={s.meta}>{collection.author} · {collection.kind}{collection.graded?' · graded':''}{total?` · ${total.toLocaleString()} hadith`:''}</Text>
            </View>
            {ico('chevron-forward',18,C.muted)}
          </View>
          {percent>0&&<View style={s.hadithTrack}><View style={[s.hadithFill,{width:`${percent}%`}]}/></View>}
        </Pressable>;
      })}
      <View style={s.apiPanel}><Text style={s.apiTitle}>Arabic and English together</Text><Text style={s.apiText}>Each collection carries Arabic and English editions, so every hadith you read is shown in both. Nothing is paraphrased.</Text></View>
    </>}
  </ScrollView></Page>}

function HadithCollectionScreen({route,navigation}:any){
  const slug=route.params?.slug||'bukhari';
  const collection=HADITH_COLLECTIONS.find(item=>item.slug===slug);
  const [data,setData]=useState<HadithCollectionData|null>(null);
  const [error,setError]=useState('');
  const [book,setBook]=useState<number|null>(null);
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(20);
  const load=()=>{setError('');return loadHadithCollection(slug).then(next=>{setData(next);void whenArabicReady(slug).then(ready=>ready&&setData(ready))}).catch((e:any)=>setError(e.message||'Please check your connection.'))};
  useEffect(()=>{void load()},[slug]);
  useEffect(()=>{setLimit(20)},[book,query]);
  const page=data?getHadithPage(data,{book,query,offset:0,limit}):{rows:[],total:0,offset:0,hasMore:false};
  const read=new Set(useHadithState().read[slug]||[]);
  return <Page><ToolBar title={collection?.name||'Hadith'} navigation={navigation}/>
    {!data&&!error&&<Spinner/>}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!data&&<>
      <View style={s.search}>{ico('search',18,C.muted)}<TextInput accessibilityLabel="Search this collection" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search Arabic, English or number" placeholderTextColor="#929B96"/>{query.length>0&&<Pressable accessibilityLabel="Clear search" onPress={()=>setQuery('')}>{ico('close',16,C.muted)}</Pressable>}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
        <ChoicePill label="All books" selected={book===null} onPress={()=>setBook(null)}/>
        {data.books.map(entry=><ChoicePill key={entry.number} label={`${entry.number}. ${entry.name}`} selected={book===entry.number} onPress={()=>setBook(entry.number)}/>)}
      </ScrollView>
      <Text style={s.meta}>{page.total.toLocaleString()} hadith{book!==null?' in this book':''} · showing {page.rows.length}{data.arabicReady?'':' · Arabic text loading'}</Text>
      <ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
        {page.rows.map(hadith=><Pressable key={hadith.id} accessibilityLabel={`Hadith ${hadith.number}`} onPress={()=>navigation.navigate('Hadith Detail',{slug,number:hadith.number})} style={s.dataCard}>
          <View style={s.hadithRowTop}>
            <View style={s.hadithNumber}><Text style={s.hadithNumberText}>{hadith.number}</Text></View>
            <View style={{flex:1}}>
              <Text style={s.dataMeta}>{hadith.book?`Book ${hadith.book} · ${hadith.bookName}`:hadith.bookName}{hadith.grades.length?` · ${hadith.grades[0].grade}`:''}{read.has(hadith.number)?' · read':''}</Text>
              {!!hadith.arabic&&<Text style={s.dataArabic} numberOfLines={2}>{hadith.arabic}</Text>}
              <Text style={s.dataBody} numberOfLines={3}>{hadith.english}</Text>
            </View>
            {ico('chevron-forward',16,C.muted)}
          </View>
        </Pressable>)}
        {!page.rows.length&&<View style={s.empty}><Text style={s.dataBody}>No hadith matches this filter.</Text></View>}
        {page.hasMore&&<Pressable accessibilityLabel="Load more hadith" onPress={()=>setLimit(value=>value+20)} style={s.secondary}><Text style={s.secondaryText}>Load more</Text></Pressable>}
        <View style={s.apiPanel}><Text style={s.apiTitle}>{data.name}</Text><Text style={s.apiText}>{data.books.length} books · {data.hadiths.length.toLocaleString()} hadith</Text></View>
      </ScrollView>
    </>}
  </Page>}

function HadithDetailScreen({route,navigation}:any){
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
    }catch(e:any){setError(e.message||'Please check your connection.')}
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
  return <Page><ToolBar title={collection?.name||'Hadith'} navigation={navigation}/>
    {!hadith&&!error&&<Spinner/>}
    {!!error&&<ErrorState message={error} retry={load}/>}
    {!!hadith&&<ScrollView contentContainerStyle={s.dataPage} showsVerticalScrollIndicator={false}>
      <View style={s.hadithDetailHead}>
        <View style={s.hadithNumberLarge}><Text style={s.hadithNumberText}>{hadith.number}</Text></View>
        <View style={{flex:1}}>
          <Text style={s.dataName}>{collection?.name}</Text>
          <Text style={s.meta}>{hadith.book?`Book ${hadith.book} · ${hadith.bookName}`:'General'}</Text>
        </View>
      </View>
      {hadith.grades.length>0&&<View style={s.hadithGrades}>{hadith.grades.map((grade,index)=><View key={`${grade.name}-${index}`} style={s.hadithGrade}><Text style={s.hadithGradeText}>{grade.grade}</Text><Text style={s.hadithGradeSource}>{grade.name}</Text></View>)}</View>}
      {!!hadith.arabic&&<Text style={[s.dataArabic,{fontSize:23,lineHeight:44}]}>{hadith.arabic}</Text>}
      <Text style={[s.dataBody,{fontSize:15,lineHeight:26,marginTop:16}]}>{hadith.english}</Text>
      <View style={s.actionRow}>
        <Pressable accessibilityLabel={saved?'Remove hadith from saved':'Save this hadith'} onPress={()=>{if(collection)void toggleHadithSaved(collection,hadith)}} style={s.secondary}><Text style={s.secondaryText}>{saved?'Saved':'Save'}</Text></Pressable>
        <Pressable accessibilityLabel="Copy hadith text" onPress={copy} style={s.secondary}><Text style={s.secondaryText}>{copied?'Copied':'Copy'}</Text></Pressable>
        <Pressable accessibilityLabel="Share hadith" onPress={share} style={s.secondary}><Text style={s.secondaryText}>Share</Text></Pressable>
      </View>
      <View style={s.hadithNav}>
        {neighbours.previous?<Pressable accessibilityLabel="Previous hadith" onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.previous?.number})} style={s.hadithNavBtn}><Text style={s.hadithNavText}>← {neighbours.previous.number}</Text></Pressable>:<View style={s.hadithNavBtn}/>}
        {neighbours.next?<Pressable accessibilityLabel="Next hadith" onPress={()=>navigation.replace('Hadith Detail',{slug,number:neighbours.next?.number})} style={[s.hadithNavBtn,{alignItems:'flex-end'}]}><Text style={s.hadithNavText}>{neighbours.next.number} →</Text></Pressable>:<View style={s.hadithNavBtn}/>}
      </View>
      <View style={s.apiPanel}><Text style={s.apiTitle}>Source</Text><Text style={s.apiText}>{hadithReference(collection,hadith)}</Text></View>
    </ScrollView>}
  </Page>}

function HadithSavedScreen({navigation}:any){
  const state=useHadithState();
  return <Page><ToolBar title="Saved hadith" navigation={navigation}/>
    {!state.saved.length&&<View style={s.empty}><ToolGraphic tool="Hadith" size={54}/><Text style={s.dataTitle}>Nothing saved yet</Text><Text style={s.dataBody}>Save a hadith from any collection and it will appear here on this device only.</Text></View>}
    {state.saved.map(item=><View key={item.id} style={s.dataCard}>
      <Pressable onPress={()=>navigation.navigate('Hadith Detail',{slug:item.slug,number:item.number})}>
        <Text style={s.dataMeta}>{item.collection} · Hadith {item.number}</Text>
        <Text style={s.dataBody} numberOfLines={4}>{item.preview}</Text>
      </Pressable>
      <Pressable accessibilityLabel="Remove saved hadith" onPress={()=>void removeHadithBookmark(item.id)} style={{marginTop:10,alignSelf:'flex-start'}}><Text style={s.dangerText}>Remove</Text></Pressable>
    </View>)}
  </Page>}

const PRAYER_METHODS=[{id:8,name:'Gulf Region'},{id:4,name:'Umm al-Qura'},{id:3,name:'Muslim World League'},{id:5,name:'Egyptian Authority'},{id:1,name:'Karachi'},{id:2,name:'North America'}];
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
  { name: 'MP3Quran', ar: 'إم بي 3 قرآن', endpoint: 'mp3quran.net',
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

function SettingsScreen(){const{language,rtl,setLanguage}=useLanguage();const{settings,update}=useWorshipSettings();return <Page><ScrollView contentContainerStyle={s.scroll}><TopBar overline={rtl?'خصوصية بلا حساب':'PRIVATE BY DESIGN'} title={rtl?'الإعدادات':'Settings'} right={<MotionGlyph name="shield-checkmark-outline" size={20}/>}/><LinearGradient colors={['#2A2849','#5146A4']} style={s.privacyHero}><MotionGlyph name="shield-checkmark-outline" size={25} inverse/><View style={{flex:1}}><Text style={s.profileName}>{rtl?'لا حساب. لا تتبع.':'No account. No tracking.'}</Text><Text style={s.profileSub}>{rtl?'تبقى عبادتك خاصة وتظل تفضيلاتك على هذا الجهاز.':'Your worship stays private and your preferences remain on this device.'}</Text></View></LinearGradient><View style={s.privacyPoints}><View style={s.privacyPoint}>{ico('person-remove-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون تسجيل':'No sign-up'}</Text></View><View style={s.privacyPoint}>{ico('cloud-offline-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون ملف سحابي':'No cloud profile'}</Text></View><View style={s.privacyPoint}>{ico('analytics-outline',19,C.green)}<Text style={s.privacyPointText}>{rtl?'دون تتبع إعلاني':'No ad tracking'}</Text></View></View>
<Section title={rtl?'حساب أوقات الصلاة':'Prayer calculation'}/><View style={s.preferencePanel}><View style={s.preferenceHead}><ToolGraphic tool="Qibla" size={54}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'طريقة الحساب':'Calculation method'}</Text><Text style={s.meta}>{rtl?'تُحفظ على هذا الجهاز وتُطبق على جميع مواقيت الصلاة.':'Saved on this device and applied throughout the app.'}</Text></View></View><View style={s.choiceGrid}>{PRAYER_METHODS.map(method=><ChoicePill key={method.id} label={method.name} selected={settings.calculationMethod===method.id} onPress={()=>update({calculationMethod:method.id,calculationMethodName:method.name})}/>)}</View><Text style={s.preferenceLabel}>{rtl?'المذهب لحساب العصر':'ASR MADHAB'}</Text><View style={s.choiceRow}><ChoicePill label="Shafi" selected={settings.madhab==='shafi'} onPress={()=>update({madhab:'shafi'})}/><ChoicePill label="Hanafi" selected={settings.madhab==='hanafi'} onPress={()=>update({madhab:'hanafi'})}/></View><Text style={s.preferenceLabel}>{rtl?'تنسيق الوقت':'TIME FORMAT'}</Text><View style={s.choiceRow}><ChoicePill label="12 hour" selected={settings.timeFormat==='12'} onPress={()=>update({timeFormat:'12'})}/><ChoicePill label="24 hour" selected={settings.timeFormat==='24'} onPress={()=>update({timeFormat:'24'})}/></View></View>
<Section title={rtl?'التفضيلات':'Preferences'}/><View style={s.settings}><View style={s.setting}><MotionGlyph name="language-outline" size={19}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'English interface':'Arabic interface'}</Text><Text style={s.meta}>{rtl?'Left-to-right layout':'واجهة عربية من اليمين إلى اليسار'}</Text></View><View style={{direction:'ltr'} as any}><Switch value={language==='ar'} onValueChange={v=>setLanguage(v?'ar':'en')} trackColor={{true:C.green}}/></View></View><View style={s.setting}><ToolGraphic tool="Arabic Quran" size={44}/><View style={{flex:1}}><Text style={s.settingName}>{rtl?'قراءة القرآن':'Quran reading'}</Text><Text style={s.meta}>{rtl?'النص العثماني · صحيح إنترناشيونال':'Uthmani Arabic · Sahih International English'}</Text></View></View></View><View style={s.sourceCard}>{ico('server-outline',21,C.green)}<View><Text style={s.sourceTitle}>{rtl?'مصادر بيانات مباشرة بلا مفاتيح':'Live, keyless data sources'}</Text><Text style={s.sourceBody}>{rtl?'القائمة الكاملة في صفحة مصادر البيانات':'The full list is on the Data sources page.'}</Text></View></View></ScrollView></Page>}
const navigationRef = createNavigationContainerRef<any>();
const AUDIO_LANGUAGES: Record<string, string> = {
  en: 'English', ur: 'Urdu', zh: 'Chinese', fr: 'French', ru: 'Russian',
  kk: 'Kazakh', tr: 'Turkish', fa: 'Persian', uz: 'Uzbek', my: 'Burmese',
};
const AUDIO_RATES = [0.75, 1, 1.25, 1.5];

function SeekBar({ position, duration, onSeek }: { position: number; duration: number; onSeek: (value: number) => void }) {
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
  return <View accessibilityRole="adjustable" accessibilityLabel="Seek within the recitation" onLayout={(event) => { width.current = event.nativeEvent.layout.width; }} {...responder.panHandlers} style={s.seekTrack}>
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
    <Pressable accessibilityRole="button" accessibilityLabel="Open the audio player" onPress={open} style={s.miniBody}>
      <View style={s.miniArt}>{audio.buffering ? <ActivityIndicator color={C.green} /> : <ToolGraphic tool="Recitations" size={34} />}</View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={s.miniTitle}>{audio.track.title}</Text>
        <Text numberOfLines={1} style={s.miniMeta}>{audio.track.performer}{audio.buffering ? ' · buffering' : audio.playing ? ' · playing' : ''}</Text>
      </View>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={audio.playing ? 'Pause recitation' : 'Play recitation'} onPress={() => { void togglePlayback(); }} style={s.miniBtn}>{ico(audio.playing ? 'pause' : 'play', 19, C.white)}</Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Close the player" onPress={() => { void clearQueue(); }} style={s.miniGhost}>{ico('close', 17, C.muted)}</Pressable>
  </View>;
}

async function playFromReader(chapter: Chapter, verse: Verse) {
  try {
    const settings = getAudioSettings();
    const ayah = Number(String(verse.verse_key).split(':')[1] || 1);
    const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, settings);
    const index = queue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayah);
    await playQueue(queue, index < 0 ? 0 : index);
  } catch (e: any) { Alert.alert('Audio unavailable', e.message); }
}

async function playSurahFromReader(chapter: Chapter) {
  try {
    const queue = await buildQueueForChapter(chapter.id, chapter.name_simple, getAudioSettings());
    await playQueue(queue, 0);
  } catch (e: any) { Alert.alert('Audio unavailable', e.message); }
}

function AudioCenterScreen({ navigation }: any) {
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
      .catch((e: any) => setError(e.message))
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
    } catch (e: any) { Alert.alert('Audio unavailable', e.message); } finally { setBusy(''); }
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
    } catch (e: any) { Alert.alert('Sample unavailable', e.message); } finally { setBusy(''); }
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
    } catch (e: any) { Alert.alert('Could not resume', e.message); } finally { setBusy(''); }
  };

  const saveCurrentQueue = async () => {
    if (!audio.queue.length) return;
    setPlaylists(await savePlaylist(playlistName, audio.queue));
    setPlaylistName('');
  };

  const needle = query.trim().toLowerCase();
  const reciters = editions.arabic.filter((edition) => `${edition.englishName} ${edition.identifier}`.toLowerCase().includes(needle));
  const translations = editions.translation.filter((edition) => `${edition.englishName} ${AUDIO_LANGUAGES[edition.language] || edition.language}`.toLowerCase().includes(needle));
  const shownChapters = chapters.filter((chapter) => `${chapter.id} ${chapter.name_simple} ${chapter.translated_name?.name || ''}`.toLowerCase().includes(needle));
  const selectedReciter = editions.arabic.find((edition) => edition.identifier === settings.reciter);

  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title="Quran audio" navigation={navigation} />
    
    <Text style={s.dataTitle}>Listen by verse, Surah or playlist</Text>
    <Text style={s.intro}>Recitation streams live from attributed public sources. Playback, recents and playlists stay on this device.</Text>

    {!!session && <Pressable onPress={() => { void resumeSession(); }} style={s.continueBar}>
      <ToolGraphic tool="Recitations" size={46} />
      <View style={{ flex: 1 }}><Text style={s.dailyKicker}>CONTINUE LISTENING</Text><Text style={s.settingName}>{session.chapterName}</Text><Text style={s.meta}>{busy === 'resume' ? 'Preparing…' : `Verse queue · saved ${new Date(session.savedAt).toLocaleDateString()}`}</Text></View>
      {ico('play-circle', 22, C.green)}
    </Pressable>}

    {!!audio.track && <Pressable onPress={() => navigation.navigate('Audio Player')} style={s.audioHero}>
      <View style={s.audioHeroRow}>
        <ToolGraphic tool="Recitations" size={54} />
        <View style={{ flex: 1 }}><Text style={s.audioHeroKicker}>NOW PLAYING</Text><Text numberOfLines={1} style={s.audioHeroTitle}>{audio.track.title}</Text><Text numberOfLines={1} style={s.audioHeroMeta}>{audio.track.performer}</Text></View>
        {ico('chevron-forward', 20, C.white)}
      </View>
    </Pressable>}

    <View style={s.choiceRow}>
      <ChoicePill label="Reciters" selected={tab === 'reciters'} onPress={() => { setTab('reciters'); setQuery(''); }} />
      <ChoicePill label="Translation" selected={tab === 'translation'} onPress={() => { setTab('translation'); setQuery(''); }} />
      <ChoicePill label="Surahs" selected={tab === 'surah'} onPress={() => { setTab('surah'); setQuery(''); }} />
      <ChoicePill label="Saved" selected={tab === 'saved'} onPress={() => { setTab('saved'); setQuery(''); }} />
    </View>

    {loading ? <Spinner /> : !!error ? <ErrorState message={error} retry={load} /> : <>
      {tab === 'reciters' && <>
        <Section title="Recitation source" />
        <View style={s.choiceRow}>
          <ChoicePill label="Verse by verse" selected={settings.reciterMode === 'verse'} onPress={() => { void update({ reciterMode: 'verse' }); }} />
          <ChoicePill label="Full Surah" selected={settings.reciterMode === 'surah'} onPress={() => { void update({ reciterMode: 'surah' }); }} />
        </View>
        <Text style={s.meta}>{settings.reciterMode === 'verse' ? 'Verse-by-verse files, one track per ayah, with translation audio and reader controls.' : 'Complete Surah recordings — one continuous track per Surah.'}</Text>
        <Section title={settings.reciterMode === 'verse' ? 'Arabic reciters' : 'Full-Surah reciters'} />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel="Search reciters" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search a reciter" placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel="Clear reciter search" onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{(settings.reciterMode === 'verse' ? reciters.map((edition) => <View key={edition.identifier} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.reciter === edition.identifier }} onPress={() => { void update({ reciter: edition.identifier, reciterName: edition.englishName }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{edition.englishName}</Text><Text style={s.meta}>Verse by verse · {edition.identifier}</Text></View>
            {ico(settings.reciter === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.reciter === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`Play a sample from ${edition.englishName}`} onPress={() => { void sample(edition, 'arabic'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>) : surahReciters.filter((reciter) => reciter.name.toLowerCase().includes(needle)).map((reciter) => <View key={reciter.id} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.surahReciterId === reciter.id }} onPress={() => { void update({ surahReciterId: reciter.id, surahReciterName: reciter.name }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Recitations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{reciter.name}</Text><Text style={s.meta}>{reciter.rewaya}{reciter.surahTotal ? ` · ${reciter.surahTotal} Surahs` : ''}</Text></View>
            {ico(settings.surahReciterId === reciter.id ? 'checkmark-circle' : 'ellipse', 20, settings.surahReciterId === reciter.id ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`Play a sample from ${reciter.name}`} onPress={() => { void startChapter({ id: 1, name_simple: 'Al-Fatihah', name_arabic: 'الفاتحة', verses_count: 7 } as Chapter, 1); }} style={s.audioRowAction}>{busy === 'chapter-1' ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>))}</View>
      </>}

      {tab === 'translation' && <>
        <Section title="Translation audio" />
        <View style={s.settings}>
          <View style={s.setting}>
            <MotionGlyph name="language-outline" size={19} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>Translation audio</Text><Text style={s.meta}>Play the meaning after each verse</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch value={settings.translationAudioEnabled} onValueChange={(value) => { void update({ translationAudioEnabled: value }); }} trackColor={{ true: C.green }} /></View>
          </View>
          {settings.translationAudioEnabled && <View style={s.setting}>
            <MotionGlyph name="layers-outline" size={19} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>Arabic then translation</Text><Text style={s.meta}>Keep both sections in one queue</Text></View>
            <View style={{ direction: 'ltr' } as any}><Switch value={settings.sequential} onValueChange={(value) => { void update({ sequential: value }); }} trackColor={{ true: C.green }} /></View>
          </View>}
        </View>
        <Text style={s.preferenceLabel}>AVAILABLE LANGUAGES</Text>
        <View style={s.settings}>{translations.map((edition) => <View key={edition.identifier} style={s.audioRow}>
          <Pressable accessibilityRole="radio" accessibilityState={{ selected: settings.translationEdition === edition.identifier }} onPress={() => { void update({ translationEdition: edition.identifier, translationName: edition.englishName }); }} style={s.audioRowMain}>
            <ToolGraphic tool="Translations" size={42} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{AUDIO_LANGUAGES[edition.language] || edition.language.toUpperCase()}</Text><Text style={s.meta}>{edition.englishName}</Text></View>
            {ico(settings.translationEdition === edition.identifier ? 'checkmark-circle' : 'ellipse', 20, settings.translationEdition === edition.identifier ? C.green : C.muted)}
          </Pressable>
          <Pressable accessibilityLabel={`Play a ${AUDIO_LANGUAGES[edition.language] || edition.language} sample`} onPress={() => { void sample(edition, 'translation'); }} style={s.audioRowAction}>{busy === `sample-${edition.identifier}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
        <View style={s.sourceCard}>{ico('information-circle', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>Languages come from the source</Text><Text style={s.sourceBody}>Only languages that are published are listed. Others are not shown rather than faked.</Text></View></View>
      </>}

      {tab === 'surah' && <>
        <Section title="Play a Surah" />
        <View style={s.search}>{ico('search', 18, C.muted)}<TextInput accessibilityLabel="Search Surahs" value={query} onChangeText={setQuery} style={s.searchInput} placeholder="Search 114 Surahs" placeholderTextColor="#929B96" />{query.length > 0 && <Pressable accessibilityLabel="Clear Surah search" onPress={() => setQuery('')}>{ico('close-circle', 18, C.muted)}</Pressable>}</View>
        <View style={s.settings}>{shownChapters.map((chapter) => <View key={chapter.id} style={s.audioRow}>
          <Pressable onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowMain}>
            <View style={s.surahNo}><Text style={s.surahNoText}>{chapter.id}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.settingName}>{chapter.name_simple}</Text><Text style={s.meta}>{chapter.verses_count} verses · {chapter.translated_name?.name}</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`Play ${chapter.name_simple}`} onPress={() => { void startChapter(chapter, 1); }} style={s.audioRowAction}>{busy === `chapter-${chapter.id}` ? <ActivityIndicator color={C.green} /> : ico('play-circle', 22, C.green)}</Pressable>
        </View>)}</View>
      </>}

      {tab === 'saved' && <>
        <Section title="Recently played" action={recent.length ? 'Clear' : undefined} onPress={recent.length ? () => { void clearRecentPlays().then(() => setRecent([])); } : undefined} />
        {!recent.length ? <Text style={s.meta}>Nothing played yet.</Text> : recent.map((item, index) => <Pressable key={`${item.chapterId}-${item.edition}-${index}`} onPress={() => { const chapter = chapters.find((c) => c.id === item.chapterId); if (chapter) void startChapter(chapter, item.ayahNumber); }} style={s.queueRow}>
          <ToolGraphic tool="Recitations" size={38} />
          <View style={{ flex: 1 }}><Text style={s.settingName}>{item.chapterName} · verse {item.ayahNumber}</Text><Text style={s.meta}>{item.performer}</Text></View>
          {ico('play-circle', 20, C.green)}
        </Pressable>)}
        <Section title="Playlists" />
        {!playlists.length ? <Text style={s.meta}>Save the current queue to build a playlist.</Text> : playlists.map((playlist) => <View key={playlist.id} style={s.queueRow}>
          <Pressable onPress={() => { void playQueue(playlist.tracks, 0); }} style={s.audioRowMain}>
            <ToolGraphic tool="Audio" size={38} />
            <View style={{ flex: 1 }}><Text style={s.settingName}>{playlist.name}</Text><Text style={s.meta}>{playlist.tracks.length} tracks · saved locally</Text></View>
          </Pressable>
          <Pressable accessibilityLabel={`Delete ${playlist.name}`} onPress={() => { void deletePlaylist(playlist.id).then(setPlaylists); }} style={s.audioRowAction}>{ico('trash', 19, C.coral)}</Pressable>
        </View>)}
        {!!audio.queue.length && <View style={s.formCard}>
          <Text style={s.preferenceLabel}>SAVE CURRENT QUEUE</Text>
          <View style={s.fieldRow}>
            <TextInput accessibilityLabel="Playlist name" value={playlistName} onChangeText={setPlaylistName} placeholder={audio.track ? audio.track.chapterName : 'Playlist name'} placeholderTextColor="#929B96" style={[s.textField, { flex: 1, marginTop: 0 }]} />
            <Pressable onPress={() => { void saveCurrentQueue(); }} style={s.primarySmall}><Text style={s.primaryText}>Save</Text></Pressable>
          </View>
        </View>}
      </>}
    </>}

    <View style={s.sourceCard}>{ico('server', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>Sources</Text><Text style={s.sourceBody}>Verse-by-verse: one track for each ayah. Full-Surah: a complete recitation of the Surah.</Text></View></View>
    {settings.reciterMode === 'verse' ? (!!selectedReciter && <Text style={s.meta}>Selected reciter: {selectedReciter.englishName}</Text>) : <Text style={s.meta}>Selected full-Surah reciter: {settings.surahReciterName || 'Choose from the list above'} · {surahReciters.length} available</Text>}
  </ScrollView></Page>;
}

function AudioPlayerScreen({ navigation }: any) {
  const audio = useAudio();
  const { rtl } = useLanguage();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  useEffect(() => { void loadPlaylists().then(setPlaylists); }, []);
  const track = audio.track;
  if (!track) return <Page><ToolBar title="Audio player" navigation={navigation} /><View style={s.dataPage}>
    <ToolGraphic tool="Recitations" size={78} />
    <Text style={s.dataTitle}>Nothing is playing</Text>
    <Text style={s.intro}>Choose a reciter and a Surah from the audio center to start listening.</Text>
    <Pressable onPress={() => navigation.goBack()} style={s.primary}><Text style={s.primaryText}>Open audio center</Text></Pressable>
  </View></Page>;
  const upcoming = audio.queue.slice(audio.index + 1, audio.index + 6);
  return <Page><ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <ToolBar title="Now playing" navigation={navigation} />
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
      <Pressable accessibilityLabel="Previous verse" onPress={() => { void previousTrack(); }} style={s.audioControlBtn}>{ico('play-skip-back', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={audio.playing ? 'Pause' : 'Play'} onPress={() => { void togglePlayback(); }} style={s.audioControlMain}>{audio.playing ? ico('pause', 26, C.white) : ico('play', 26, C.white)}</Pressable>
      <Pressable accessibilityLabel="Next verse" onPress={() => { void nextTrack(); }} style={s.audioControlBtn}>{ico('play-skip-forward', 20, C.green)}</Pressable>
      <Pressable accessibilityLabel={`Repeat mode: ${audio.repeat}`} onPress={() => setRepeatMode(audio.repeat === 'none' ? 'all' : audio.repeat === 'all' ? 'one' : 'none')} style={s.audioControlBtn}>{ico('repeat', 19, audio.repeat === 'none' ? C.muted : C.green)}<Text style={s.rateText}>{audio.repeat === 'one' ? '1' : audio.repeat === 'all' ? '∞' : '—'}</Text></Pressable>
    </View>
    <View style={s.row}>
      <Pressable accessibilityLabel="Stop playback" onPress={() => { void stopPlayback(); }} style={s.secondary}>{ico('stop', 17, C.green)}<Text style={s.secondaryText}>Stop</Text></Pressable>
      <Pressable accessibilityLabel="Clear the queue" onPress={() => { void clearQueue(); }} style={s.secondary}>{ico('trash', 17, C.green)}<Text style={s.secondaryText}>Clear queue</Text></Pressable>
    </View>
    <Text style={s.preferenceLabel}>SPEED</Text>
    <View style={s.choiceRow}>{AUDIO_RATES.map((rate) => <ChoicePill key={rate} label={`${rate}×`} selected={audio.rate === rate} onPress={() => { void setPlaybackRate(rate); }} />)}</View>
    <Section title={`Queue · ${audio.queue.length} tracks`} />
    {audio.queue.map((item, index) => <Pressable key={`${item.id}-${index}`} onPress={() => { void selectQueueItem(index); }} style={[s.queueRow, index === audio.index && s.queueRowActive]}>
      <Text style={s.queueIndex}>{index + 1}</Text>
      <View style={{ flex: 1 }}><Text numberOfLines={1} style={s.settingName}>{item.title}</Text><Text style={s.meta}>{item.performer}</Text></View>
      <Pressable accessibilityLabel={`Remove ${item.title} from the queue`} onPress={() => removeFromQueue(index)} style={s.audioRowAction}>{ico('close', 16, C.muted)}</Pressable>
    </Pressable>)}
    <View style={s.formCard}>
      <Text style={s.preferenceLabel}>SAVE QUEUE AS PLAYLIST</Text>
      <View style={s.fieldRow}>
        <TextInput accessibilityLabel="Playlist name" value={name} onChangeText={setName} placeholder={track.chapterName} placeholderTextColor="#929B96" style={[s.textField, { flex: 1, marginTop: 0 }]} />
        <Pressable onPress={() => { void savePlaylist(name, audio.queue).then((next) => { setPlaylists(next); setName(''); }); }} style={s.primarySmall}><Text style={s.primaryText}>Save</Text></Pressable>
      </View>
      {!!playlists.length && <Text style={s.meta}>{playlists.length} playlist{playlists.length > 1 ? 's' : ''} stored on this device.</Text>}
    </View>
    <View style={s.sourceCard}>{ico('server', 21, C.green)}<View style={{ flex: 1 }}><Text style={s.sourceTitle}>Now playing</Text><Text style={s.sourceBody}>{track.performer}</Text></View></View>
    <View style={{ height: 40 }} />
  </ScrollView></Page>;
}

const TAB_ITEMS = [
  { name: 'Home', label: 'Home', ar: 'الرئيسية', icon: require('./assets/tool-icons/tab-home.png') },
  { name: 'Quran', label: 'Quran', ar: 'القرآن', icon: require('./assets/tool-icons/quran.png') },
  { name: 'Library', label: 'Library', ar: 'المكتبة', icon: require('./assets/tool-icons/tab-library.png') },
  { name: 'Tools', label: 'Tools', ar: 'الأدوات', icon: require('./assets/tool-icons/tab-tools.png') },
  { name: 'Settings', label: 'Settings', ar: 'الإعدادات', icon: require('./assets/tool-icons/tab-settings.png') },
];

/** The menu floats above the content as a single capsule, always in reach. */
function FloatingTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const { rtl } = useLanguage();
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
            {item?.icon ? <Image source={item.icon} resizeMode="contain" style={{ width: 23, height: 23, opacity: focused ? 1 : 0.5 }} /> : ico('ellipse-outline', 20, focused ? C.green : '#8B909D')}
            <Text numberOfLines={1} style={[s.floatLabel, focused && s.floatLabelActive]}>{label}</Text>
          </Animated.View>
        </Pressable>;
      })}
    </View>
  </View>;
}

function Tabs(){return <Tab.Navigator screenOptions={{headerShown:false,tabBarHideOnKeyboard:true}} tabBar={(props:any)=><FloatingTabBar {...props}/>}><Tab.Screen name="Home" component={HomeScreen}/><Tab.Screen name="Quran" component={QuranStack}/><Tab.Screen name="Library" component={ExploreStack}/><Tab.Screen name="Tools" component={ToolsStack}/><Tab.Screen name="Settings" component={SettingsStack}/></Tab.Navigator>}
export default function App(){const[fontsLoaded]=useFonts({DMSans_400Regular,DMSans_600SemiBold,DMSans_700Bold,Newsreader_600SemiBold,NotoNaskhArabic_400Regular,NotoNaskhArabic_600SemiBold,Amiri_400Regular,KFGQPCUthmanicHafs,IBMPlexSansArabic_400Regular,IBMPlexSansArabic_600SemiBold});useEffect(()=>{if(fontsLoaded){resumeSavedQuranPreload();void loadAudioSettings();void loadHadithState();void loadTasbihState();void loadDownloads();void loadActivity();void loadFastingState()}},[fontsLoaded]);if(!fontsLoaded)return <SafeAreaView style={s.safe}><Spinner/></SafeAreaView>;return <LanguageProvider><QuranPreferencesProvider><WorshipSettingsProvider><LocationProvider><NavigationContainer ref={navigationRef}><ExpoStatusBar style="dark"/><Tabs/><MiniPlayer/></NavigationContainer></LocationProvider></WorshipSettingsProvider></QuranPreferencesProvider></LanguageProvider>}

const s=StyleSheet.create({
  dataSourceRow:{marginTop:6},
  floatBarWrap:{position:'absolute',left:0,right:0,bottom:0,alignItems:'center',paddingBottom:Platform.OS==='ios'?24:16,pointerEvents:'box-none'},
  floatBar:{height:66,borderRadius:33,backgroundColor:C.white,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'space-between',paddingHorizontal:6,...shadow},
  floatItem:{flex:1,alignItems:'center',justifyContent:'center',minHeight:54,borderRadius:27},
  floatPill:{alignItems:'center',justifyContent:'center',borderRadius:22,paddingHorizontal:11,paddingVertical:6,minWidth:58},
  floatPillActive:{backgroundColor:C.mint},
  floatLabel:{color:'#9AA0AC',fontFamily:'DMSans_600SemiBold',fontSize:10,letterSpacing:.2,marginTop:3},
  floatLabelActive:{color:C.green},
 safe:{flex:1,backgroundColor:C.bg,overflow:'hidden',paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0},page:{flex:1,backgroundColor:C.bg},pageWide:{width:'100%',maxWidth:1180,alignSelf:'center'},scroll:{width:'100%',maxWidth:980,alignSelf:'center',paddingHorizontal:18,paddingTop:20,paddingBottom:112},row:{flexDirection:'row',alignItems:'center'},press:{opacity:.72,transform:[{scale:.98}]},loading:{padding:42,alignItems:'center',gap:10},loadingText:{color:C.muted,fontSize:12},error:{backgroundColor:'#F5EFEE',padding:22,borderRadius:22,alignItems:'center',marginVertical:12},errorIcon:{width:48,height:48,borderRadius:16,backgroundColor:'#EDE5E4',alignItems:'center',justifyContent:'center'},errorTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_600SemiBold',marginTop:10},errorText:{color:C.muted,textAlign:'center',fontSize:12,lineHeight:18,marginTop:4},retry:{backgroundColor:C.ink,paddingHorizontal:15,paddingVertical:9,borderRadius:12,marginTop:12},retryText:{color:C.white,fontSize:11,fontFamily:'DMSans_600SemiBold'},
 topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},overline:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginBottom:5},h1:{color:C.ink,fontSize:32,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.8},iconBtn:{width:44,height:44,borderRadius:16,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},iconBtnDark:{backgroundColor:C.deep,borderColor:C.deep},section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:28,marginBottom:14},h2:{color:C.ink,fontSize:22,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.35},sectionAction:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11},
 graphicFrame:{alignItems:'center',justifyContent:'center',overflow:'hidden'},motionGlyph:{width:49,height:49,borderRadius:17,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},motionGlyphInverse:{backgroundColor:'rgba(255,255,255,.14)',borderColor:'rgba(255,255,255,.22)'},glyphDot:{position:'absolute',right:6,top:6,width:5,height:5,borderRadius:3,backgroundColor:C.gold},greeting:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:17},salam:{color:C.green,fontSize:10,fontFamily:'DMSans_600SemiBold',letterSpacing:1.2,marginBottom:4},greetingTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.6},avatar:{width:45,height:45,borderRadius:17,backgroundColor:C.green,alignItems:'center',justifyContent:'center'},online:{position:'absolute',right:-1,bottom:2,width:10,height:10,borderRadius:5,backgroundColor:'#52D996',borderWidth:2,borderColor:C.bg},
 hero:{height:285,borderRadius:28,overflow:'hidden',padding:20,...shadow},heroWide:{height:310},heroImage:{borderRadius:28},heroBg:{position:'absolute',left:0,right:0,top:0,bottom:0,width:'100%',height:'100%'},locationPill:{flexDirection:'row',alignItems:'center',gap:5,alignSelf:'flex-start',maxWidth:'72%',backgroundColor:'rgba(2,28,30,.62)',paddingHorizontal:10,paddingVertical:7,borderRadius:14},locationText:{color:C.white,fontFamily:'DMSans_600SemiBold',fontSize:11,flexShrink:1},hijri:{color:'#D8D5E9',fontSize:11,marginTop:10},nextLabel:{color:'#FFE2A1',fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.8,marginTop:34},heroTime:{color:C.white,fontSize:42,fontFamily:'DMSans_700Bold',letterSpacing:-1.2,marginTop:2},heroFooter:{position:'absolute',left:20,right:20,bottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},countPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'rgba(255,255,255,.16)',paddingHorizontal:10,paddingVertical:7,borderRadius:14,borderWidth:1,borderColor:'rgba(255,255,255,.18)'},countText:{color:C.white,fontSize:10,fontFamily:'DMSans_600SemiBold'},heroCta:{flexDirection:'row',alignItems:'center',gap:6},heroCtaText:{color:C.white,fontSize:10,fontFamily:'DMSans_700Bold'},
 prayerRail:{marginHorizontal:9,marginTop:-1,backgroundColor:C.white,borderBottomLeftRadius:24,borderBottomRightRadius:24,flexDirection:'row',paddingHorizontal:8,paddingVertical:13,borderWidth:1,borderTopWidth:0,borderColor:C.line,...soft},railItem:{flex:1,alignItems:'center',paddingVertical:5,borderRadius:15},railItemActive:{backgroundColor:'#F0EDFF'},railIcon:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center',marginBottom:5},railName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},railTime:{color:C.ink,textAlign:'center',fontFamily:'DMSans_600SemiBold',fontSize:9,lineHeight:11,marginTop:2},
 sliderContent:{gap:12,paddingRight:28},sliderControls:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:8},sliderHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},sliderButtons:{flexDirection:'row',gap:8},sliderButton:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:C.card,borderWidth:1,borderColor:C.line},sliderButtonDisabled:{opacity:.32},essentialSlide:{height:174,backgroundColor:C.card,borderRadius:24,padding:17,borderWidth:1,borderColor:C.line,...soft},essentialTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},essentialArrow:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},essentialTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,marginTop:5},essentialBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:3},reflectionSlide:{height:220,backgroundColor:C.white,borderRadius:24,padding:17,borderWidth:1,borderColor:C.line,...soft},toolGrid:{backgroundColor:C.card,borderRadius:25,flexDirection:'row',flexWrap:'wrap',paddingVertical:13,borderWidth:1,borderColor:C.line,...soft},tool:{width:'33.33%',paddingVertical:11},toolWide:{width:'16.666%'},toolInner:{alignItems:'center'},toolIcon:{width:49,height:49,borderRadius:17,alignItems:'center',justifyContent:'center',marginBottom:7},toolLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:11},
 homeProgress:{marginHorizontal:9,backgroundColor:C.card,borderBottomLeftRadius:20,borderBottomRightRadius:20,padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderTopWidth:0,borderColor:C.line},homeProgressRing:{width:43,height:43,borderRadius:22,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'#D7CFFF'},dailyGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},dailyCard:{width:'48%',minHeight:190,backgroundColor:C.white,borderRadius:22,padding:15,borderWidth:1,borderColor:C.line,...soft},dailyKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:8,letterSpacing:1.1,marginTop:5},dailyArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,lineHeight:36,textAlign:'right',marginTop:8},dailyBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:5},dailyTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:14,marginTop:6},nameOfDay:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:34,textAlign:'right',marginTop:13},quickTasbih:{alignItems:'center'},quickCount:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:38,marginTop:3},quickReset:{padding:7,marginTop:4},weekSummary:{backgroundColor:C.deep,borderRadius:20,padding:17,marginTop:11,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},weekSummaryTitle:{color:C.white,fontFamily:'Newsreader_600SemiBold',fontSize:19},weekSummaryBody:{color:'#D9D3F3',fontSize:10,marginTop:3},weekStatValue:{color:C.green,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:6},weekBar:{flex:1,height:8,borderRadius:4,backgroundColor:'#EAE6F0',overflow:'hidden',marginHorizontal:9},weekBarFill:{height:'100%',borderRadius:4,backgroundColor:C.green},weekScoreBody:{color:'#D9D3F3',fontSize:10,marginTop:3},readCard:{height:205,borderRadius:27,overflow:'hidden',padding:20,...shadow},readImage:{borderRadius:27},readKicker:{color:'#CCEBDE',fontSize:8,fontFamily:'DMSans_700Bold',letterSpacing:1.5},readArabic:{color:C.white,fontSize:29,marginTop:8},readTitle:{color:C.white,fontSize:20,fontFamily:'DMSans_700Bold'},readMeta:{color:'#CAE4DB',fontSize:10,marginTop:3},whiteButton:{flexDirection:'row',alignItems:'center',gap:6,alignSelf:'flex-start',backgroundColor:C.white,paddingHorizontal:13,paddingVertical:8,borderRadius:14,marginTop:13},whiteButtonText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},twoCol:{flexDirection:'row',gap:10,marginTop:12},insight:{flex:1,minHeight:158,borderRadius:22,padding:15},nameArabic:{color:C.green,fontSize:24,textAlign:'right',marginTop:16},insightTitle:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold',marginTop:5},insightBody:{color:C.muted,fontSize:10,lineHeight:15,marginTop:3},insightIcon:{width:37,height:37,borderRadius:13,backgroundColor:'rgba(255,255,255,.55)',alignItems:'center',justifyContent:'center'},insightNumber:{color:C.gold,fontSize:32,fontFamily:'DMSans_700Bold',marginTop:13},liveBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',backgroundColor:'rgba(73,58,146,.90)',paddingHorizontal:7,paddingVertical:4,borderRadius:9} as any,liveDot:{width:5,height:5,borderRadius:3,backgroundColor:'#FF9A72'},liveText:{color:C.white,fontSize:9,fontFamily:'DMSans_700Bold',letterSpacing:.5},hadithCard:{backgroundColor:C.white,borderRadius:25,padding:20,borderWidth:1,borderColor:C.line,...soft},quote:{position:'absolute',right:18,top:2,color:'#E2EEE8',fontSize:72,fontFamily:'DMSans_700Bold'},hadithText:{color:C.ink,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:22,marginTop:17},hadithFoot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:17,paddingTop:13,borderTopWidth:1,borderColor:C.line},meta:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16},
 dayStrip:{flexDirection:'row',justifyContent:'space-between',backgroundColor:C.white,padding:8,borderRadius:22,borderWidth:1,borderColor:C.line,...soft},day:{width:47,alignItems:'center',paddingVertical:9,borderRadius:15},dayActive:{backgroundColor:C.green},dayName:{color:C.muted,fontSize:10,fontFamily:'DMSans_600SemiBold'},dayNum:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:5},dayText:{color:C.white},nextCard:{height:190,borderRadius:27,padding:20,marginTop:14,overflow:'hidden',...shadow},nextCardLabel:{color:'#E1DCF7',fontSize:9,fontFamily:'DMSans_700Bold',letterSpacing:1.5,marginTop:18},nextCardName:{color:C.white,fontSize:29,fontFamily:'DMSans_700Bold',marginTop:3},nextCardTime:{color:C.white,fontSize:17,fontFamily:'DMSans_600SemiBold',marginBottom:12},moonOrb:{position:'absolute',right:24,top:43,width:93,height:93,borderRadius:47,backgroundColor:'rgba(255,255,255,.13)',alignItems:'center',justifyContent:'center'},prayerList:{backgroundColor:C.white,borderRadius:25,overflow:'hidden',borderWidth:1,borderColor:C.line,...soft},prayerRow:{flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13,minHeight:68,borderBottomWidth:1,borderColor:C.line},prayerRowLive:{backgroundColor:'#F2EFFF'},prayerSymbol:{width:41,height:41,borderRadius:14,backgroundColor:C.mint,borderWidth:1,borderColor:'#DDD6FF',alignItems:'center',justifyContent:'center'},prayerName:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},prayerValue:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold',marginRight:8},prayerProgress:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:C.white,borderRadius:20,padding:15,marginTop:13,borderWidth:1,borderColor:C.line,...soft},progressTrack:{width:86,height:7,borderRadius:4,backgroundColor:'#EAE7F1',overflow:'hidden'},progressFill:{height:'100%',borderRadius:4,backgroundColor:C.green},progressCount:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},prayerSymbolDone:{backgroundColor:C.green,borderColor:C.green},sourceCard:{flexDirection:'row',gap:11,alignItems:'center',backgroundColor:C.mint,borderRadius:18,padding:15,marginTop:15},sourceTitle:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},sourceBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,marginTop:2},
 search:{height:48,flexDirection:'row',alignItems:'center',gap:9,backgroundColor:C.white,borderRadius:16,paddingHorizontal:14,borderWidth:1,borderColor:C.line,marginBottom:13,...soft},searchInput:{flex:1,color:C.ink,fontSize:12,outlineStyle:'none'} as any,quranHero:{height:225,borderRadius:27,overflow:'hidden',padding:20,...shadow},quranArabic:{color:C.white,fontSize:28,marginTop:16},quranHeroTitle:{color:C.white,fontSize:21,fontFamily:'DMSans_700Bold'},quranHeroMeta:{color:'#D8D4EA',fontFamily:'DMSans_400Regular',fontSize:11,marginTop:4},continueBar:{backgroundColor:C.white,borderRadius:19,padding:12,flexDirection:'row',alignItems:'center',gap:10,marginBottom:12,borderWidth:1,borderColor:C.line,...soft},quranHeroWide:{height:245},quranActionGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},quranPrimaryWrap:{width:'100%'},quranPrimaryWrapWide:{width:'48.4%'},quranPrimaryAction:{height:142,borderRadius:23,padding:17,flexDirection:'row',alignItems:'center',overflow:'hidden',...soft},quranPrimaryTitle:{color:C.white,fontFamily:'Newsreader_600SemiBold',fontSize:24,marginTop:8},quranPrimaryBody:{color:'#D9D5EC',fontFamily:'DMSans_400Regular',fontSize:10,lineHeight:15,marginTop:3},quranNavWrap:{width:'30.5%'},quranNavWrapWide:{width:'15.4%'},quranNavCard:{height:142,backgroundColor:C.card,borderRadius:21,padding:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},quranNavTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:4},quranNavCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:8,marginTop:2,textAlign:'center'},quranStudyCard:{height:190,backgroundColor:C.card,borderRadius:24,padding:17,borderWidth:1,borderColor:C.line,...soft},quranStudyTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},studyNumber:{width:34,height:34,borderRadius:17,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},quranStudyTitle:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:20,marginTop:7},quranStudyCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:16,marginTop:3},quranPreferenceRow:{flexDirection:'row',flexWrap:'wrap',gap:10},quranPreferenceCard:{flex:1,minWidth:280,minHeight:76,backgroundColor:C.card,borderRadius:20,padding:12,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:C.line,...soft},quranPersonalGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},quranPersonalWrap:{width:'47.5%'},quranPersonalWrapWide:{width:'18.8%'},quranPersonalCard:{minHeight:132,backgroundColor:C.card,borderRadius:20,padding:13,borderWidth:1,borderColor:C.line,...soft},quranPersonalHead:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},quranPersonalValue:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:22},quranPersonalTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11,marginTop:7},quranPersonalCaption:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:9,marginTop:3},recentChip:{minWidth:128,backgroundColor:C.white,borderRadius:17,padding:12,borderWidth:1,borderColor:C.line},quranShortcuts:{flexDirection:'row',gap:8,marginTop:11,flexWrap:'wrap'},quranShortcutWrap:{flex:1,minWidth:100},shortcut:{minHeight:64,flexDirection:'row',alignItems:'center',gap:5,backgroundColor:C.white,paddingHorizontal:8,paddingVertical:8,borderRadius:15,borderWidth:1,borderColor:C.line},shortcutText:{color:C.ink,fontSize:9,fontFamily:'DMSans_600SemiBold',flexShrink:1},surahList:{backgroundColor:C.white,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:C.line,...soft},surahRow:{flexDirection:'row',alignItems:'center',gap:11,minHeight:70,paddingHorizontal:14,borderBottomWidth:1,borderColor:C.line},surahNum:{width:38,height:38,borderRadius:19,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},surahNumText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},surahName:{color:C.ink,fontSize:13,fontFamily:'DMSans_700Bold'},surahAr:{color:C.green,fontSize:18},
 readerModes:{flexDirection:'row',gap:10,marginTop:12},readerMode:{flex:1,minHeight:56,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,backgroundColor:C.white,borderRadius:18,borderWidth:1,borderColor:C.line},readerModeActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},readerModeText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},readerBar:{height:72,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:17,borderBottomWidth:1,borderColor:C.line},readerName:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold'},readerProgress:{height:4,backgroundColor:'#E6E2EB',overflow:'hidden'},readerScroll:{width:'100%',maxWidth:860,alignSelf:'center',padding:16,paddingBottom:50},surahHead:{borderRadius:26,padding:22,alignItems:'center',...shadow},surahHeadAr:{color:C.white,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:38,marginTop:15},surahHeadEn:{color:'#C9E5DB',fontSize:10,marginTop:4},bismillah:{color:C.white,fontFamily:'KFGQPCUthmanicHafs',fontSize:22,marginTop:22},ayahContinuous:{marginTop:0,borderRadius:0,borderBottomWidth:1,shadowOpacity:0,elevation:0},ayahSelected:{borderColor:C.gold,borderWidth:2,backgroundColor:'#FFFDF5'},ayahActions:{flexDirection:'row',alignItems:'center',gap:14},ayahFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12},ayah:{backgroundColor:C.white,borderRadius:22,padding:18,marginTop:11,borderWidth:1,borderColor:C.line,...soft},ayahTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},ayahNo:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',backgroundColor:C.mint,paddingHorizontal:9,paddingVertical:6,borderRadius:10},ayahAr:{color:C.ink,textAlign:'right',fontFamily:'KFGQPCUthmanicHafs',fontSize:30,lineHeight:58,marginTop:17},ayahTranslation:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:20,marginTop:15,paddingTop:14,borderTopWidth:1,borderColor:C.line},ayahMeta:{color:C.muted,fontSize:10,marginTop:12},
 translationRow:{minHeight:67,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13,borderBottomWidth:1,borderColor:C.line},languageBadge:{width:52,height:34,borderRadius:10,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:3},languageFlag:{fontSize:12},languageBadgeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:8},historyHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},historyWrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12},historyChip:{backgroundColor:C.mint,borderRadius:14,paddingHorizontal:11,paddingVertical:8},searchResult:{backgroundColor:C.white,borderRadius:19,padding:15,marginBottom:9,borderWidth:1,borderColor:C.line},noteText:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:17,lineHeight:24,marginVertical:8},noteInput:{minHeight:180,backgroundColor:C.white,borderRadius:20,padding:16,textAlignVertical:'top',fontFamily:'DMSans_400Regular',fontSize:14,color:C.ink,borderWidth:1,borderColor:C.line,outlineStyle:'none'} as any,stepper:{backgroundColor:C.white,borderRadius:18,padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},stepButton:{width:42,height:42,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},fontPreview:{backgroundColor:C.mint,borderRadius:18,padding:16,marginTop:11,borderWidth:1,borderColor:C.line},fontPreviewText:{color:C.ink,textAlign:'right',lineHeight:52,includeFontPadding:false},previewArabic:{color:C.ink,fontFamily:'KFGQPCUthmanicHafs'},referenceNavigator:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginBottom:13},referenceInput:{width:100,textAlign:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:14,padding:11,color:C.ink,fontFamily:'DMSans_700Bold',outlineStyle:'none'} as any,comparisonHelp:{color:C.muted,fontSize:10,lineHeight:15,marginTop:8},editionPicker:{gap:8,marginTop:10},editionChip:{minHeight:58,backgroundColor:C.white,borderRadius:17,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:C.line},editionChipActive:{borderColor:C.green,backgroundColor:C.mint},editionFlag:{fontSize:20},arabicReference:{backgroundColor:C.yellow,borderRadius:22,padding:18,marginTop:15,borderWidth:1,borderColor:'#E5D4A6'},comparisonColumns:{gap:12,paddingVertical:13,paddingRight:20},comparisonText:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:20,marginTop:10},mushafPage:{width:'100%',maxWidth:900,alignSelf:'center',padding:18,paddingBottom:60},mushafNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},pageJump:{flex:1,minWidth:0,alignItems:'center'},pageInput:{minWidth:74,textAlign:'center',color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:28,borderBottomWidth:1,borderColor:C.line,paddingVertical:3,outlineStyle:'none'} as any,pageProgress:{height:5,borderRadius:3,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:14},mushafSheet:{backgroundColor:'#FFFDF8',borderRadius:25,padding:18,borderWidth:1,borderColor:'#DED7C9',...soft},mushafAyah:{paddingVertical:13,borderBottomWidth:1,borderColor:'#E9E1D5'},mushafSurah:{textAlign:'center',color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:20,backgroundColor:C.mint,borderRadius:14,paddingVertical:8,marginBottom:10},verseMarker:{color:C.gold,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:17},mushafTranslation:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:8},topicGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},topicWrap:{width:'48%'},topicCard:{minHeight:190,backgroundColor:C.white,borderRadius:22,padding:17,borderWidth:1,borderColor:C.line,...soft},vocabStats:{backgroundColor:C.mint,borderRadius:18,padding:15,marginBottom:13,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},flashcard:{minHeight:330,backgroundColor:C.white,borderRadius:28,padding:22,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...shadow},flashIndex:{position:'absolute',top:18,right:18,color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:10},flashArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:58,lineHeight:86,textAlign:'center'},flashTransliteration:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:28,marginTop:12},flashMeaning:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:18,marginVertical:8,textAlign:'center'},flashHint:{color:C.muted,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:16},tajweedPractice:{backgroundColor:C.white,borderRadius:23,padding:18,marginTop:14,borderWidth:1,borderColor:C.line,...soft},tajweedRule:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,padding:13,borderBottomWidth:1,borderColor:C.line},tajweedSwatch:{width:18,height:44,borderRadius:9},compareCard:{backgroundColor:C.white,borderRadius:20,padding:17,marginBottom:10,borderWidth:1,borderColor:C.line},juzGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},juzCard:{width:'22.8%',aspectRatio:1,backgroundColor:C.white,borderRadius:17,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},juzNo:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:23},preloadScore:{backgroundColor:C.white,borderRadius:22,padding:18,borderWidth:1,borderColor:C.line},cacheUsage:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:10,marginTop:8},preloadTrack:{height:9,borderRadius:5,backgroundColor:'#E6E2EB',overflow:'hidden',marginVertical:12},preloadFill:{height:'100%',backgroundColor:C.green,borderRadius:5},planGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},planCard:{width:'48%',minHeight:130,backgroundColor:C.white,borderRadius:21,padding:17,borderWidth:1,borderColor:C.line},planDays:{color:C.green,fontFamily:'Newsreader_600SemiBold',fontSize:36},planToday:{backgroundColor:C.white,borderRadius:18,padding:17,marginTop:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},practiceLaunch:{backgroundColor:C.mint,borderRadius:19,padding:15,marginBottom:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#CFC7EE'},recallCard:{minHeight:340,backgroundColor:C.white,borderRadius:27,padding:21,borderWidth:1,borderColor:C.line,...shadow},recallPrompt:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:21,lineHeight:29,marginTop:28,textAlign:'center'},recallArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:32,lineHeight:58,textAlign:'right',marginTop:24,paddingTop:18,borderTopWidth:1,borderColor:C.line},revealArea:{flex:1,minHeight:110,alignItems:'center',justifyContent:'center',gap:8,marginTop:18,borderTopWidth:1,borderColor:C.line},hifzStatus:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9,textTransform:'uppercase'},intro:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:14,lineHeight:19,marginTop:-7,marginBottom:18},exploreGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},exploreCard:{width:'48%'},exploreCardWide:{width:'32.3%'},exploreCardInner:{minHeight:164,backgroundColor:C.white,borderRadius:23,padding:16,borderWidth:1,borderColor:C.line,...soft},exploreIcon:{width:49,height:49,borderRadius:17,alignItems:'center',justifyContent:'center'},exploreTitle:{color:C.ink,fontSize:16,fontFamily:'DMSans_700Bold',marginTop:13},exploreBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:11,lineHeight:15,marginTop:4,flex:1},exploreArrow:{width:29,height:29,borderRadius:15,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'},apiPanel:{backgroundColor:C.deep,borderRadius:22,padding:18,marginTop:12},apiTitle:{color:C.white,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:15},apiText:{color:'#D9D3F3',fontSize:9,marginTop:4},
 toolPage:{flex:1,width:'100%',maxWidth:780,alignSelf:'center',alignItems:'center',padding:22,paddingTop:30},toolEyebrow:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:18},compass:{width:260,height:260,borderRadius:130,backgroundColor:C.white,borderWidth:12,borderColor:'#E4DFFA',alignItems:'center',justifyContent:'center',marginTop:30,...shadow},north:{position:'absolute',top:12,color:C.coral,fontSize:10,fontFamily:'DMSans_700Bold'},compassArrow:{alignItems:'center',justifyContent:'center'},kaaba:{position:'absolute',right:43,bottom:47,width:31,height:31,backgroundColor:'#111C18',borderRadius:3},kaabaGold:{height:5,backgroundColor:C.gold,marginTop:7},direction:{color:C.ink,fontSize:31,fontFamily:'DMSans_700Bold',marginTop:25},directionText:{color:C.muted,fontSize:11,marginTop:3},primary:{backgroundColor:C.green,paddingHorizontal:21,paddingVertical:13,borderRadius:15,marginTop:21},primaryText:{color:C.white,fontSize:11,fontFamily:'DMSans_700Bold'},tasbihAr:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:32,marginTop:17},counter:{width:205,height:205,borderRadius:103,backgroundColor:C.green,alignItems:'center',justifyContent:'center',borderWidth:12,borderColor:'#E4DEFA',marginVertical:31,...shadow},counterPress:{transform:[{scale:.97}]},counterNo:{color:C.white,fontSize:58,fontFamily:'DMSans_700Bold'},counterGoal:{color:'#DDD6FF',fontSize:8,fontFamily:'DMSans_700Bold',letterSpacing:1.3},secondary:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:C.white,paddingHorizontal:14,paddingVertical:11,borderRadius:14,borderWidth:1,borderColor:C.line,marginHorizontal:5},secondaryText:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold'},
 summaryScore:{backgroundColor:C.deep,borderRadius:24,padding:20,flexDirection:'row',justifyContent:'space-between',...shadow},summaryDay:{minHeight:66,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14,borderBottomWidth:1,borderColor:C.line},summaryDots:{flexDirection:'row',gap:4},summaryDot:{width:8,height:8,borderRadius:4,backgroundColor:'#E2DEE8'},summaryDotDone:{backgroundColor:C.green},cityGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},cityCard:{width:'48.5%',minHeight:76,backgroundColor:C.white,borderRadius:17,padding:13,borderWidth:1,borderColor:C.line},cityCardActive:{backgroundColor:C.mint,borderColor:'#CFC7EE'},cityName:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},formCard:{backgroundColor:C.white,borderRadius:22,padding:16,borderWidth:1,borderColor:C.line},fieldRow:{flexDirection:'row',gap:10},textField:{backgroundColor:C.bg,borderWidth:1,borderColor:C.line,borderRadius:14,padding:13,fontSize:13,color:C.ink,marginTop:6,outlineStyle:'none'} as any,dangerButton:{padding:14,alignItems:'center',marginTop:12},dangerText:{color:C.coral,fontFamily:'DMSans_700Bold',fontSize:11},healthCard:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:C.white,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line,marginBottom:14},healthDot:{width:10,height:10,borderRadius:5},actionRow:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:8,marginTop:5},audioPreview:{backgroundColor:C.deep,borderRadius:23,padding:17,flexDirection:'row',alignItems:'center',gap:12},audioPlay:{width:48,height:48,borderRadius:24,backgroundColor:C.green,alignItems:'center',justifyContent:'center'},guideGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},guideCard:{width:'48%'},guideCardInner:{minHeight:180,backgroundColor:C.white,borderRadius:22,padding:15,borderWidth:1,borderColor:C.line,...soft},guideArabic:{color:C.green,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:27,lineHeight:47,textAlign:'right',backgroundColor:C.white,borderRadius:20,padding:17,marginBottom:15},guideStep:{flexDirection:'row',gap:11,padding:14,borderBottomWidth:1,borderColor:C.line,alignItems:'flex-start'},stepNo:{width:28,height:28,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},stepNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},guideStepText:{flex:1,color:C.ink,fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:19},guideNote:{backgroundColor:C.yellow,borderRadius:18,padding:15,marginTop:14},referenceRow:{minHeight:54,backgroundColor:C.white,borderRadius:16,paddingHorizontal:15,marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:C.line},dataPage:{width:'100%',maxWidth:860,alignSelf:'center',padding:18,paddingBottom:154},empty:{backgroundColor:C.white,borderRadius:22,padding:24,alignItems:'center',borderWidth:1,borderColor:C.line},dataTitle:{color:C.ink,fontSize:29,fontFamily:'Newsreader_600SemiBold',letterSpacing:-.5,marginTop:16,marginBottom:15},dataCard:{backgroundColor:C.white,borderRadius:21,padding:18,marginBottom:10,borderWidth:1,borderColor:C.line,...soft},dataArabic:{color:C.green,fontFamily:'KFGQPCUthmanicHafs',fontSize:27,lineHeight:48,textAlign:'right'},dataName:{color:C.ink,fontSize:14,fontFamily:'DMSans_700Bold',marginTop:4},dataBody:{color:'#474653',fontFamily:'DMSans_400Regular',fontSize:13,lineHeight:18,marginTop:5},dataMeta:{color:C.green,fontSize:10,fontFamily:'DMSans_700Bold',marginTop:10,textTransform:'uppercase'},inputLabel:{color:C.green,fontSize:9,fontFamily:'DMSans_700Bold',letterSpacing:1.2,marginTop:10},moneyInput:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:18,padding:17,fontSize:24,fontFamily:'DMSans_700Bold',color:C.ink,marginTop:8,outlineStyle:'none'} as any,zakatResult:{borderRadius:23,padding:20,marginTop:13},zakatNo:{color:C.white,fontSize:34,fontFamily:'DMSans_700Bold',marginTop:7},
 profileHero:{borderRadius:24,padding:19,flexDirection:'row',alignItems:'center',gap:13,...shadow},profileAvatar:{width:53,height:53,borderRadius:18,backgroundColor:C.white,alignItems:'center',justifyContent:'center'},profileName:{color:C.white,fontSize:18,fontFamily:'DMSans_700Bold'},profileSub:{color:'#C2DED3',fontSize:10,marginTop:3},privacyHero:{borderRadius:24,padding:18,flexDirection:'row',alignItems:'center',gap:13,...shadow},privacyPoints:{flexDirection:'row',gap:8,marginTop:11},privacyPoint:{flex:1,backgroundColor:C.white,borderRadius:15,paddingVertical:12,alignItems:'center',gap:5,borderWidth:1,borderColor:C.line},privacyPointText:{color:C.ink,fontSize:10,fontFamily:'DMSans_700Bold',textAlign:'center'},preferencePanel:{backgroundColor:C.white,borderRadius:23,padding:16,borderWidth:1,borderColor:C.line,...soft},preferenceHead:{flexDirection:'row',alignItems:'center',gap:11,marginBottom:14},choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:7},choiceRow:{flexDirection:'row',gap:8},choicePill:{minHeight:42,justifyContent:'center',paddingHorizontal:12,paddingVertical:8,borderRadius:13,backgroundColor:C.bg,borderWidth:1,borderColor:C.line},choicePillActive:{backgroundColor:C.green,borderColor:C.green},choiceText:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:10},choiceTextActive:{color:C.white},preferenceLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:8,letterSpacing:1.1,marginTop:17,marginBottom:8},settings:{backgroundColor:C.white,borderRadius:23,overflow:'hidden',borderWidth:1,borderColor:C.line,...soft},setting:{minHeight:69,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:13,borderBottomWidth:1,borderColor:C.line},settingIcon:{width:39,height:39,borderRadius:13,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},settingName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13},
 locationGate:{flexDirection:'row',gap:14,alignItems:'flex-start',backgroundColor:C.card,borderRadius:24,padding:18,borderWidth:1,borderColor:C.line,...soft},locationGateNarrow:{flexDirection:'column',alignItems:'stretch'},locationGateTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:16},locationGateBody:{color:C.muted,fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:4},locationActions:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:14},locationActionsNarrow:{flexDirection:'column',alignItems:'stretch'},primarySmall:{backgroundColor:C.green,paddingHorizontal:14,paddingVertical:11,borderRadius:13,minHeight:44,justifyContent:'center'},ghostSmall:{backgroundColor:C.mint,paddingHorizontal:14,paddingVertical:11,borderRadius:13,minHeight:44,justifyContent:'center'},ghostText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
 prayerTools:{flexDirection:'row',flexWrap:'wrap',gap:9},prayerTool:{width:'48.7%'},prayerToolInner:{minHeight:86,flexDirection:'row',alignItems:'center',gap:11,backgroundColor:C.white,borderRadius:20,padding:14,borderWidth:1,borderColor:C.line},prayerToolText:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,flex:1},
 libraryKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10,letterSpacing:1.7,marginTop:23},libraryHeading:{color:C.ink,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:4,marginBottom:12},
 calendarIntro:{backgroundColor:C.deep,borderRadius:25,padding:20},calendarMonth:{color:C.white,fontFamily:'Newsreader_600SemiBold',fontSize:29,marginTop:17},calendarHijri:{color:'#D9D3F3',fontFamily:'DMSans_400Regular',fontSize:12,marginTop:3},weekHead:{flexDirection:'row',marginTop:17},weekLabel:{width:'14.285%',textAlign:'center',color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11},calendarGrid:{flexDirection:'row',flexWrap:'wrap',marginTop:7,backgroundColor:C.white,borderRadius:22,padding:7,borderWidth:1,borderColor:C.line},calendarCell:{width:'14.285%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderRadius:13},calendarToday:{backgroundColor:C.mint,borderWidth:1,borderColor:'#D7CFFF'},gregorianDay:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:15},hijriDay:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:9,marginTop:2},calendarLegend:{flexDirection:'row',alignItems:'center',gap:7,marginTop:12},legendDot:{width:8,height:8,borderRadius:4,backgroundColor:C.green},
 ramadanHero:{borderRadius:27,padding:21,...shadow},ramadanArabic:{color:'#FFE3A4',fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:36,marginTop:16},ramadanTitle:{color:C.white,fontFamily:'Newsreader_600SemiBold',fontSize:27},ramadanSub:{color:'#E3DEF7',fontFamily:'DMSans_400Regular',fontSize:12,lineHeight:18,marginTop:6,maxWidth:390},ramadanList:{backgroundColor:C.white,borderRadius:23,overflow:'hidden',borderWidth:1,borderColor:C.line},ramadanRow:{minHeight:78,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,borderBottomWidth:1,borderColor:C.line},ramadanDay:{width:43,height:48,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},ramadanDayNo:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:17},ramadanDayLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:7},ramadanDate:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:11},fastTime:{alignItems:'flex-end',minWidth:58},fastLabel:{color:C.muted,fontFamily:'DMSans_700Bold',fontSize:7,letterSpacing:.7},fastValue:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:10,marginTop:3},
 tabbar:{position:'absolute',left:12,right:12,bottom:10,height:Platform.OS==='ios'?82:67,paddingTop:8,paddingBottom:Platform.OS==='ios'?19:8,backgroundColor:C.card,borderTopWidth:1,borderWidth:1,borderColor:C.line,borderRadius:24,...shadow},tabLabel:{fontSize:10,fontFamily:'DMSans_600SemiBold',marginTop:2},
 seekTrack:{height:26,justifyContent:'center',marginTop:6},
 seekFill:{position:'absolute',left:0,height:5,borderRadius:3,backgroundColor:C.green},
 seekKnob:{position:'absolute',top:7,width:13,height:13,borderRadius:7,backgroundColor:C.white,borderWidth:2,borderColor:C.green,marginLeft:-6},
 miniPlayer:{position:'absolute',left:12,right:12,backgroundColor:C.card,borderRadius:20,paddingHorizontal:12,paddingVertical:9,alignItems:'center',borderWidth:1,borderColor:C.line,...shadow},
 miniBody:{flex:1,flexDirection:'row',alignItems:'center',gap:10},
 miniArt:{width:40,height:40,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center',overflow:'hidden'},
 miniTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12},
 miniMeta:{color:C.muted,fontSize:10,marginTop:2},
 miniBtn:{width:44,height:44,borderRadius:22,backgroundColor:C.green,alignItems:'center',justifyContent:'center',marginLeft:8},
 miniGhost:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',marginLeft:2},
 audioRow:{flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:C.line},
 audioRowMain:{flex:1,flexDirection:'row',alignItems:'center',gap:11,paddingVertical:11},
 audioRowAction:{width:46,height:46,alignItems:'center',justifyContent:'center'},
 audioHero:{backgroundColor:C.deep,borderRadius:22,padding:15,marginTop:16,...soft},
 audioHeroRow:{flexDirection:'row',alignItems:'center',gap:12},
 audioHeroKicker:{color:'#FFE2A1',fontFamily:'DMSans_700Bold',fontSize:8,letterSpacing:1.2},
 audioHeroTitle:{color:C.white,fontFamily:'DMSans_700Bold',fontSize:13,marginTop:3},
 audioHeroMeta:{color:'#C7C2E4',fontSize:10,marginTop:2},
 playerArt:{backgroundColor:C.deep,borderRadius:26,padding:22,alignItems:'center',...shadow},
 playerTitle:{color:C.white,fontFamily:'Newsreader_600SemiBold',fontSize:23,marginTop:12,textAlign:'center'},
 playerPerformer:{color:'#C7C2E4',fontSize:11,marginTop:4},
 trackBadge:{marginTop:12,backgroundColor:'rgba(255,255,255,.14)',borderRadius:12,paddingHorizontal:11,paddingVertical:6},
 trackBadgeText:{color:'#FFE2A1',fontFamily:'DMSans_700Bold',fontSize:8,letterSpacing:1.1},
 playerArabic:{color:C.ink,fontFamily:'IBMPlexSansArabic_600SemiBold',fontSize:26,lineHeight:46,textAlign:'right',marginTop:18,direction:'rtl'} as any,
 audioTimes:{flexDirection:'row',justifyContent:'space-between',marginTop:16},
 audioControls:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14,marginTop:14},
 audioControlBtn:{width:52,height:52,borderRadius:26,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,...soft},
 audioControlMain:{width:72,height:72,borderRadius:36,backgroundColor:C.green,alignItems:'center',justifyContent:'center',...shadow},
 rateText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9,marginTop:-2},
 queueRow:{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:11,borderBottomWidth:1,borderColor:C.line},
 queueRowActive:{backgroundColor:C.mint,borderRadius:14,paddingHorizontal:8},
 queueIndex:{width:24,color:C.muted,fontFamily:'DMSans_700Bold',fontSize:11,textAlign:'center'},
 heroActions:{flexDirection:'row',alignItems:'center',gap:9,marginTop:14},
 ghostHeroButton:{flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:'rgba(255,255,255,.42)',paddingHorizontal:13,paddingVertical:10,borderRadius:14},
 ghostHeroText:{color:C.white,fontSize:10,fontFamily:'DMSans_700Bold'},
 readerHeaderActions:{flexDirection:'row',alignItems:'center',gap:8},
 audioEntryInner:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.card,borderRadius:22,padding:15,borderWidth:1,borderColor:C.line,...soft},
 surahNo:{width:40,height:40,borderRadius:14,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
 surahNoText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithProgressHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  hadithProgressName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  hadithTrack:{height:6,borderRadius:3,backgroundColor:C.line,marginTop:6,overflow:'hidden'},
  hadithFill:{height:'100%',borderRadius:3,backgroundColor:C.green},
  hadithCollectionCard:{backgroundColor:C.card,borderRadius:20,padding:15,marginBottom:10,borderWidth:1,borderColor:C.line,...soft},
  hadithCollectionTop:{flexDirection:'row',alignItems:'center',gap:10},
  hadithRowTop:{flexDirection:'row',alignItems:'flex-start',gap:11},
  hadithNumber:{width:34,height:34,borderRadius:12,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  hadithNumberText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12},
  hadithNumberLarge:{width:46,height:46,borderRadius:16,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},
  hadithDetailHead:{flexDirection:'row',alignItems:'center',gap:12},
  hadithGrades:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:14},
  hadithGrade:{backgroundColor:C.mint,borderRadius:12,paddingHorizontal:11,paddingVertical:7,borderWidth:1,borderColor:'#DDD6FF'},
  hadithGradeText:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:10},
  hadithGradeSource:{color:C.muted,fontSize:9,marginTop:2},
  hadithNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:18,gap:10},
  hadithNavBtn:{flex:1,minHeight:44,justifyContent:'center'},
  hadithNavText:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:12},
  recentChipWide:{minWidth:150,backgroundColor:C.white,borderRadius:16,padding:12,borderWidth:1,borderColor:C.line,...soft},
  recentChipTitle:{color:C.ink,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:4},
  duaKicker:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:9,letterSpacing:1.2,marginTop:12,marginBottom:4},
  duaTransliteration:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:13,lineHeight:22,fontStyle:'italic'},
  duaRefToggle:{color:C.green,fontFamily:'DMSans_600SemiBold',fontSize:11,marginTop:12},
  duaReference:{color:C.muted,fontSize:11,lineHeight:18,marginTop:6},
  duaShortcutGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},
  duaShortcut:{width:'48.7%',backgroundColor:C.card,borderRadius:18,padding:13,borderWidth:1,borderColor:C.line,...soft},
  duaShortcutLabel:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12},
  duaCategoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginTop:4},
  duaCategoryCard:{width:'48.7%',minHeight:88,backgroundColor:C.card,borderRadius:18,padding:13,borderWidth:1,borderColor:C.line,...soft},
  duaCategoryNo:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:11},
  duaCategoryName:{color:C.ink,fontFamily:'DMSans_600SemiBold',fontSize:12,marginTop:5},
  offlineNote:{backgroundColor:C.mint,borderRadius:14,padding:11,marginBottom:12,borderWidth:1,borderColor:'#DDD6FF'},
  offlineNoteText:{color:C.green,fontSize:11,fontFamily:'DMSans_600SemiBold'},
  tasbihCard:{backgroundColor:C.card,borderRadius:24,padding:18,alignItems:'center',marginTop:14,borderWidth:1,borderColor:C.line,...soft},
  nameOfDayCard:{backgroundColor:C.deep,borderRadius:24,padding:20,alignItems:'center',marginTop:14,...shadow},
  namesArabicLarge:{color:C.white,fontFamily:'Amiri_400Regular',fontSize:38,marginTop:8,textAlign:'center'},
  namesTransliteration:{color:C.green,fontFamily:'DMSans_700Bold',fontSize:12,marginTop:6},
  namesArabic:{color:C.ink,fontFamily:'Amiri_400Regular',fontSize:24,textAlign:'right'},
  nameRow:{flexDirection:'row',alignItems:'flex-start',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line},
  nameNumber:{width:56,alignItems:'flex-end'},

});
