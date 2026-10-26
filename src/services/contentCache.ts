import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export type CacheNamespace = 'quran' | 'tafsir' | 'hadith' | 'daily' | 'audio-meta';
type CacheEntry = { key: string; namespace: CacheNamespace; bytes: number; lastAccess: number; createdAt: number };

const INDEX_KEY = '@deen/content-cache/index/v1';
const WEB_DB = 'deen-content-cache-v1';
const WEB_STORE = 'payloads';
const LIMITS: Record<CacheNamespace, number> = Platform.OS === 'web'
  ? { quran: 32e6, tafsir: 8e6, hadith: 5e6, daily: 2e6, 'audio-meta': 1e6 }
  : { quran: 120e6, tafsir: 35e6, hadith: 20e6, daily: 5e6, 'audio-meta': 3e6 };
const TOTAL_LIMIT = Platform.OS === 'web' ? 48e6 : 180e6;

let queue = Promise.resolve();
const serial = <T>(operation: () => Promise<T>): Promise<T> => {
  const next = queue.then(operation, operation);
  queue = next.then(() => undefined, () => undefined);
  return next;
};
async function readIndex(): Promise<CacheEntry[]> { try { return JSON.parse(await AsyncStorage.getItem(INDEX_KEY) || '[]'); } catch { return []; } }
async function writeIndex(index: CacheEntry[]) { await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index)); }
const storageKey = (namespace: CacheNamespace, key: string) => `${namespace}:${key}`;
const hash = (value: string) => { let h = 2166136261; for (let i=0;i<value.length;i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619); return (h>>>0).toString(36); };
const nativeDirectory = `${FileSystem.documentDirectory || FileSystem.cacheDirectory}deen-content-cache/`;

async function ensureNativeDirectory() {
  const info = await FileSystem.getInfoAsync(nativeDirectory);
  if (!info.exists) await FileSystem.makeDirectoryAsync(nativeDirectory, { intermediates: true });
}
function openWebDb(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{const request=indexedDB.open(WEB_DB,1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(WEB_STORE))request.result.createObjectStore(WEB_STORE)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
}
async function webGet(key:string){const db=await openWebDb();return new Promise<string|null>((resolve,reject)=>{const tx=db.transaction(WEB_STORE,'readonly');const request=tx.objectStore(WEB_STORE).get(key);request.onsuccess=()=>resolve(request.result??null);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close()})}
async function webSet(key:string,value:string){const db=await openWebDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(WEB_STORE,'readwrite');tx.objectStore(WEB_STORE).put(value,key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)})}
async function webDelete(key:string){const db=await openWebDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(WEB_STORE,'readwrite');tx.objectStore(WEB_STORE).delete(key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)})}
async function payloadGet(fullKey:string){if(Platform.OS==='web')return webGet(fullKey);await ensureNativeDirectory();const path=`${nativeDirectory}${hash(fullKey)}.json`;const info=await FileSystem.getInfoAsync(path);return info.exists?FileSystem.readAsStringAsync(path):null}
async function payloadSet(fullKey:string,value:string){if(Platform.OS==='web')return webSet(fullKey,value);await ensureNativeDirectory();return FileSystem.writeAsStringAsync(`${nativeDirectory}${hash(fullKey)}.json`,value)}
async function payloadDelete(fullKey:string){if(Platform.OS==='web')return webDelete(fullKey);const path=`${nativeDirectory}${hash(fullKey)}.json`;const info=await FileSystem.getInfoAsync(path);if(info.exists)await FileSystem.deleteAsync(path,{idempotent:true})}
async function evict(index:CacheEntry[], namespace:CacheNamespace, incomingBytes:number){let next=[...index];const remove=async(entry:CacheEntry)=>{await payloadDelete(storageKey(entry.namespace,entry.key));next=next.filter(x=>!(x.namespace===entry.namespace&&x.key===entry.key))};const nsBytes=()=>next.filter(x=>x.namespace===namespace).reduce((n,x)=>n+x.bytes,0);const total=()=>next.reduce((n,x)=>n+x.bytes,0);for(const entry of next.filter(x=>x.namespace===namespace).sort((a,b)=>a.lastAccess-b.lastAccess)){if(nsBytes()+incomingBytes<=LIMITS[namespace])break;await remove(entry)}for(const entry of [...next].sort((a,b)=>a.lastAccess-b.lastAccess)){if(total()+incomingBytes<=TOTAL_LIMIT)break;await remove(entry)}return next}

export async function getCachedJson<T>(namespace:CacheNamespace,key:string):Promise<T|null>{return serial(async()=>{const full=storageKey(namespace,key);const value=await payloadGet(full);if(!value)return null;const index=await readIndex();const entry=index.find(x=>x.namespace===namespace&&x.key===key);if(entry){entry.lastAccess=Date.now();await writeIndex(index)}try{return JSON.parse(value) as T}catch{await payloadDelete(full);await writeIndex(index.filter(x=>x!==entry));return null}})}
function utf8Bytes(value:string){let bytes=0;for(let i=0;i<value.length;i++){const code=value.charCodeAt(i);if(code<0x80)bytes++;else if(code<0x800)bytes+=2;else if(code>=0xd800&&code<=0xdbff&&i+1<value.length&&value.charCodeAt(i+1)>=0xdc00&&value.charCodeAt(i+1)<=0xdfff){bytes+=4;i++}else bytes+=3}return bytes}
export async function setCachedJson(namespace:CacheNamespace,key:string,value:unknown){return serial(async()=>{const text=JSON.stringify(value);const bytes=utf8Bytes(text);if(bytes>LIMITS[namespace])throw new Error(`This item is larger than the ${namespace} offline-cache limit.`);let index=(await readIndex()).filter(x=>!(x.namespace===namespace&&x.key===key));index=await evict(index,namespace,bytes);await payloadSet(storageKey(namespace,key),text);index.push({key,namespace,bytes,lastAccess:Date.now(),createdAt:Date.now()});await writeIndex(index)})}
export async function listCachedKeys(namespace:CacheNamespace){return (await readIndex()).filter(x=>x.namespace===namespace).map(x=>x.key)}
export async function clearCacheNamespace(namespace:CacheNamespace){return serial(async()=>{const index=await readIndex();await Promise.all(index.filter(x=>x.namespace===namespace).map(x=>payloadDelete(storageKey(namespace,x.key))));await writeIndex(index.filter(x=>x.namespace!==namespace))})}
export async function getCacheUsage(){const index=await readIndex();return {totalBytes:index.reduce((n,x)=>n+x.bytes,0),limits:{...LIMITS,total:TOTAL_LIMIT},byNamespace:Object.fromEntries(Object.keys(LIMITS).map(ns=>[ns,index.filter(x=>x.namespace===ns).reduce((n,x)=>n+x.bytes,0)]))}}
