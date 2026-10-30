import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCacheNamespace, getCachedJson, listCachedKeys, setCachedJson } from './contentCache';

export type QuranPreferences = {
  translationEdition: string;
  translationName: string;
  translationLanguage: string;
  /**
   * A transliteration is the Arabic sounded out in Latin letters. It is not a
   * translation and does not replace one: someone learning to recite wants it
   * *and* the meaning, side by side. So it is its own setting, on its own
   * switch, rather than a third option in the translation list.
   */
  transliterationEdition: string;
  transliterationName: string;
  showTransliteration: boolean;
  scriptEdition: string;
  scriptName: string;
  arabicFont: 'hafs' | 'scheherazade' | 'amiri-quran' | 'naskh' | 'kufi';
  fontSize: number;
  lineHeight: number;
  showTranslation: boolean;
  readingMode: 'cards' | 'continuous' | 'mushaf';
  /** Hides the reading chrome while you scroll down, so the page is all there is. */
  focusMode: boolean;

  /* ---- the mushaf page view ---- */

  /**
   * Whether to show one page or two facing pages.
   *
   * 'auto' is two wherever the screen is genuinely wide enough for them —
   * turned sideways, or on a tablet or an opened foldable — and one otherwise.
   * The other two override that outright, for the person who always wants the
   * spread or never does. It is a choice rather than a rule because people
   * turn their devices sideways for different reasons: some want the spread,
   * some only want the width.
   */

  /**
   * Which of the division marks to print.
   *
   * All five are on by default because they are what makes a mushaf a mushaf,
   * but somebody reading for meaning rather than by portion may want the page
   * quiet, so each can be turned off on its own.
   */
  mushafMarkers: Record<'juz' | 'hizb' | 'rub' | 'nisf' | 'thuluth', boolean>;

  /**
   * Whether to flag a verse cut across a page turn.
   *
   * On by default: without it a sentence that simply stops looks like a fault
   * in the app rather than the foot of a page.
   */
  showVerseConnections: boolean;

  /**
   * Whether the meaning appears on the mushaf page under the script.
   *
   * Off by default. A printed page carries no translation, and putting one on
   * it changes what the page is for — but somebody still building their
   * Arabic needs the meaning to hand, and opening a second screen to find it
   * breaks the reading. So it is offered, and off until asked for.
   */
  mushafTranslation: boolean;

  /**
   * The translation's own size, separate from the Arabic.
   *
   * The script and the meaning are not read at the same speed or from the same
   * distance, and one size for both forces a compromise that suits neither.
   */
  translationFontSize: number;
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
/**
 * The translation everyone starts on.
 *
 * These are the Worker's own edition ids, not the third-party ones the app
 * used to carry. `tr_en_saheeh_international` is the closest match to the
 * Sahih International that was the previous default, so a person who never
 * opened the translation screen reads the same book they were reading.
 */
/** The Arabic sounded out in Latin letters. Off until asked for. */
export const DEFAULT_TRANSLITERATION = {
  edition: 'translit_en_english_transliteration',
  name: 'English Transliteration',
} as { edition: string; name: string };

export const WORKER_DEFAULT_TRANSLATION: {
  translationEdition: string; translationName: string; translationLanguage: string;
} = {
  translationEdition: 'tr_en_saheeh_international',
  translationName: 'Saheeh International',
  translationLanguage: 'English',
};

/**
 * The edition id on its own, for the modules that only need to name one.
 *
 * Every request that used to default to a third-party identifier now defaults
 * here. Left as `en.sahih` in even one place, that place asks a server that
 * has never heard of the id and quietly comes back with no meaning in it.
 */
export const DEFAULT_TRANSLATION_EDITION = WORKER_DEFAULT_TRANSLATION.translationEdition;

export const DEFAULTS: QuranPreferences = {
  focusMode: false,
  mushafMarkers: { juz: true, hizb: true, rub: true, nisf: true, thuluth: true },
  showVerseConnections: true,
  mushafTranslation: false,
  translationFontSize: 16, ...WORKER_DEFAULT_TRANSLATION,
  transliterationEdition: DEFAULT_TRANSLITERATION.edition,
  transliterationName: DEFAULT_TRANSLITERATION.name,
  showTransliteration: false,
  scriptEdition: 'quran-uthmani', scriptName: 'Uthmani', arabicFont: 'hafs', fontSize: 30, lineHeight: 1.9, showTranslation: true, readingMode: 'cards' };
async function read<T>(key:string,fallback:T):Promise<T>{try{const v=await AsyncStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
const write=(key:string,value:unknown)=>AsyncStorage.setItem(key,JSON.stringify(value));

/**
 * One-time move onto the Worker's edition ids.
 *
 * The stored preference used to hold a third-party identifier such as
 * `en.sahih`. Those ids do not exist on the app's own server, so leaving them
 * in place would have every reader quietly asking for an edition the server
 * has never heard of. The choice made here is the plain one: put everyone on
 * the default translation and let them pick again.
 *
 * It runs once, by flag, rather than by inspecting the id. Guessing at the
 * shape of an id is how a migration ends up running twice on one person's
 * device and not at all on another's, and the flag cannot be got wrong -
 * either it has run or it has not.
 */
const MOVED_TO_WORKER_EDITIONS_KEY = '@deen/quran/moved-to-worker-editions/v1';

export async function loadQuranPreferences(): Promise<QuranPreferences> {
  const stored = await read<Partial<QuranPreferences>>(K.prefs, {});
  const merged = { ...DEFAULTS, ...stored };
  try {
    const moved = await AsyncStorage.getItem(MOVED_TO_WORKER_EDITIONS_KEY);
    if (!moved) {
      await AsyncStorage.setItem(MOVED_TO_WORKER_EDITIONS_KEY, '1');
      /* Only write back when there was something to move. A fresh install has
         the Worker defaults already, and touching storage there is pointless. */
      if (stored.translationEdition) {
        const next = { ...merged, ...WORKER_DEFAULT_TRANSLATION };
        await write(K.prefs, next);
        return next;
      }
    }
  } catch {
    /* A migration that cannot record itself must not stop the app reading. */
  }
  return merged;
}
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
/**
 * The key a cached surah is stored under.
 *
 * Anything that fills the cache and anything that reads it must agree on this
 * exactly, or the text lands on the device and the reader still cannot find
 * it — which looks to the person using it exactly like no download happened.
 * So the key is built here, once, and both sides call it.
 *
 * The juz, hizb and page slots stay in the key because the reader can be
 * pointed at a juz or a page instead of a surah; a plain surah read sends the
 * defaults, which is what `surahCacheKey` below does.
 */
export function readerCacheKey(options: {
  section: string; chapterId: number; juz?: number; hizb?: number;
  page?: number | null; script: string; translation: string;
}): string {
  return `${options.section}:${options.chapterId}:${options.juz ?? 1}:${options.hizb ?? 1}:${options.page ?? null}:${options.script}:${options.translation}`;
}

/** The key for one surah read on its own — what an offline download fills. */
export function surahCacheKey(chapterId: number, script: string, translation: string): string {
  return readerCacheKey({ section: 'surah', chapterId, script, translation });
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
