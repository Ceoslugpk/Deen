import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVerses } from './api';
import { clearSurahCache, DEFAULT_TRANSLATION_EDITION, loadReadingPosition, loadSurahCacheIndex, saveSurahCache, surahCacheKey } from './quranState';
import { getCacheUsage } from './contentCache';

export type PreloadState={running:boolean;enabled:boolean;current:number;cached:number;error:string;usage:any|null;script:string;translation:string};
type Options={script:string;translation:string};
const CONFIG='@deen/quran/preload/v1';
let state:PreloadState={running:false,enabled:false,current:0,cached:0,error:'',usage:null,script:'quran-uthmani',translation:DEFAULT_TRANSLATION_EDITION};
let generation=0;
const listeners=new Set<(state:PreloadState)=>void>();
const publish=(next:Partial<PreloadState>)=>{state={...state,...next};listeners.forEach(listener=>listener(state))};
const delay=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
export const getPreloadState=()=>state;
export const subscribePreload=(listener:(state:PreloadState)=>void)=>{listeners.add(listener);listener(state);return()=>{listeners.delete(listener)}};
export async function refreshPreload(options:Options){const index=await loadSurahCacheIndex();const suffix=`:${options.script}:${options.translation}`;publish({cached:index.filter(key=>/^\d+:/.test(key)&&key.endsWith(suffix)).length,usage:await getCacheUsage(),script:options.script,translation:options.translation});}
export async function startQuranPreload(options:Options,prioritySurah?:number){if(state.running&&state.script===options.script&&state.translation===options.translation)return;generation++;const run=generation;await AsyncStorage.setItem(CONFIG,JSON.stringify({...options,enabled:true}));await refreshPreload(options);publish({running:true,enabled:true,current:0,error:'',script:options.script,translation:options.translation});const index=await loadSurahCacheIndex();const priority=prioritySurah||(await loadReadingPosition())?.surahId;const order=[...(priority?[priority]:[]),...Array.from({length:114},(_,i)=>i+1)].filter((id,i,a)=>a.indexOf(id)===i);try{for(const id of order){if(run!==generation)break;const key=surahCacheKey(id,options.script,options.translation);if(index.includes(key))continue;publish({current:id});const verses=await getVerses(id,{script:options.script,translation:options.translation});if(run!==generation)break;await saveSurahCache(key,verses);index.push(key);publish({cached:state.cached+1,usage:await getCacheUsage()});await delay(180)}}catch(error:any){publish({error:error.message||'Quran preparation stopped because live data could not be reached.'})}finally{if(run===generation){const complete=state.cached>=114;publish({running:false,current:0,enabled:!complete});await AsyncStorage.setItem(CONFIG,JSON.stringify({...options,enabled:!complete}))}}}
export async function pauseQuranPreload(){generation++;publish({running:false,enabled:false,current:0});await AsyncStorage.setItem(CONFIG,JSON.stringify({script:state.script,translation:state.translation,enabled:false}))}
export async function resumeSavedQuranPreload(){try{const saved=JSON.parse(await AsyncStorage.getItem(CONFIG)||'null');if(saved?.enabled)startQuranPreload({script:saved.script,translation:saved.translation})}catch{}}
export async function clearPreparedQuran(){await pauseQuranPreload();await clearSurahCache();publish({cached:0,usage:await getCacheUsage(),error:''})}
