import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCacheNamespace, getCachedJson, listCachedKeys, setCachedJson } from './contentCache';

export type QuranPreferences = {
  translationEdition: string;
  translationName: string;
  translationLanguage: string;
  scriptEdition: string;
  scriptName: string;
  arabicFont: 'hafs' | 'scheherazade' | 'amiri-quran' | 'naskh' | 'kufi';
  fontSize: number;
  lineHeight: number;
  showTranslation: boolean;
  readingMode: 'cards' | 'continuous' | 'mushaf';
};
export type QuranBookmark = { verseKey: string; surahId: number; surahName: string; arabic: string; translation?: string; savedAt: number };
export type QuranNote = QuranBookmark & { note: string; updatedAt: number };
export type ReadingPosition = { surahId: number; surahName: string; verseKey: string; ayah: number; page?: number; updatedAt: number };
export type HifzStatus = 'not-started' | 'revising' | 'memorized';

const K = {
  prefs: '@deen/quran/preferences/v1', bookmarks: '@deen/quran/bookmarks/v1', notes: '@deen/quran/notes/v1',
  position: '@deen/quran/position/v1', recent: '@deen/quran/recent/v1', searches: '@deen/quran/searches/v1',
  hifz: '@deen/quran/hifz/v1', plan: '@deen/quran/plan/v1', vocabulary: '@deen/quran/vocabulary/v1',
};
const DEFAULTS: QuranPreferences = { translationEdition: 'en.sahih', translationName: 'Sahih International', translationLanguage: 'English', scriptEdition: 'quran-uthmani', scriptName: 'Uthmani', arabicFont: 'hafs', fontSize: 30, lineHeight: 1.9, showTranslation: true, readingMode: 'cards' };
async function read<T>(key:string,fallback:T):Promise<T>{try{const v=await AsyncStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
const write=(key:string,value:unknown)=>AsyncStorage.setItem(key,JSON.stringify(value));

export async function loadQuranPreferences(){return {...DEFAULTS,...await read<Partial<QuranPreferences>>(K.prefs,{})}}
export async function saveQuranPreferences(value:QuranPreferences){return write(K.prefs,value)}
export async function loadBookmarks(){return read<QuranBookmark[]>(K.bookmarks,[])}
export async function toggleBookmark(bookmark:QuranBookmark){const all=await loadBookmarks();const exists=all.some(x=>x.verseKey===bookmark.verseKey);const next=exists?all.filter(x=>x.verseKey!==bookmark.verseKey):[bookmark,...all];await write(K.bookmarks,next);return next}
export async function loadNotes(){return read<QuranNote[]>(K.notes,[])}
export async function saveNote(note:QuranNote){const all=await loadNotes();const next=[note,...all.filter(x=>x.verseKey!==note.verseKey)];await write(K.notes,next);return next}
export async function deleteNote(verseKey:string){const next=(await loadNotes()).filter(x=>x.verseKey!==verseKey);await write(K.notes,next);return next}
export async function loadReadingPosition(){return read<ReadingPosition|null>(K.position,null)}
export async function saveReadingPosition(value:ReadingPosition){await write(K.position,value);const recent=await read<number[]>(K.recent,[]);await write(K.recent,[value.surahId,...recent.filter(x=>x!==value.surahId)].slice(0,8))}
export async function loadRecentSurahs(){return read<number[]>(K.recent,[])}
export async function loadSearchHistory(){return read<string[]>(K.searches,[])}
export async function addSearchHistory(query:string){const all=await loadSearchHistory();const next=[query,...all.filter(x=>x!==query)].slice(0,10);await write(K.searches,next);return next}
export async function removeSearchHistory(query:string){const next=(await loadSearchHistory()).filter(x=>x!==query);await write(K.searches,next);return next}
export async function clearSearchHistory(){await write(K.searches,[])}
export async function loadHifz(){return read<Record<number,HifzStatus>>(K.hifz,{})}
export async function saveHifz(value:Record<number,HifzStatus>){return write(K.hifz,value)}
export async function loadPlan(){return read<{days:number;startedAt:number;completed:number[]}|null>(K.plan,null)}
export async function savePlan(value:{days:number;startedAt:number;completed:number[]}|null){return write(K.plan,value)}
export async function loadVocabularyProgress(){return read<{reviewed:string[];known:string[]}>(K.vocabulary,{reviewed:[],known:[]})}
export async function saveVocabularyProgress(value:{reviewed:string[];known:string[]}){return write(K.vocabulary,value)}
const LEGACY_CACHE = '@deen/quran/cache/v1';
const LEGACY_INDEX = '@deen/quran/cache-index/v1';
let legacyMigration: Promise<void> | null = null;
async function migrateLegacySurahCache(){
  if (legacyMigration) return legacyMigration;
  legacyMigration = (async()=>{
    const keys = await read<string[]>(LEGACY_INDEX,[]);
    const remaining:string[]=[];
    for(const key of keys){
      const storageKey=`${LEGACY_CACHE}:${key}`;
      try{
        const value=await AsyncStorage.getItem(storageKey);
        if(value) await setCachedJson('quran',key,JSON.parse(value));
        await AsyncStorage.removeItem(storageKey);
      }catch{remaining.push(key)}
    }
    if(remaining.length) await write(LEGACY_INDEX,remaining);
    else await AsyncStorage.removeItem(LEGACY_INDEX);
  })();
  return legacyMigration;
}
export async function loadSurahCache(key:string){await migrateLegacySurahCache();return getCachedJson<unknown>('quran',key)}
export async function saveSurahCache(key:string,value:unknown){await migrateLegacySurahCache();return setCachedJson('quran',key,value)}
export async function loadSurahCacheIndex(){await migrateLegacySurahCache();return listCachedKeys('quran')}
export async function clearSurahCache(){
  const legacyKeys=await read<string[]>(LEGACY_INDEX,[]);
  await Promise.all(legacyKeys.map(key=>AsyncStorage.removeItem(`${LEGACY_CACHE}:${key}`)));
  await AsyncStorage.removeItem(LEGACY_INDEX);
  await clearCacheNamespace('quran');
}
