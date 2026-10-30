import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export type CacheNamespace = 'quran' | 'tafsir' | 'hadith' | 'daily' | 'audio-meta';
type CacheEntry = {
  key: string; namespace: CacheNamespace; bytes: number; lastAccess: number; createdAt: number;
  /**
   * Set for the Arabic text. It is the Quran itself, and every translation is
   * only meaningful next to it, so it is never offered up to make room for
   * something else — only clearing the cache removes it.
   */
  pinned?: boolean;
};

const INDEX_KEY = '@deen/content-cache/index/v1';
const WEB_DB = 'deen-content-cache-v1';
const WEB_STORE = 'payloads';

/**
 * How much room the offline text cache may use.
 *
 * These are ceilings, not reservations: nothing is written until it is
 * downloaded, and the real ceiling is whichever is smaller — this table or
 * half the free space on the device. The second half matters because audio
 * lives beside this cache rather than inside it, so a Quran cache that grew
 * without limit would crowd out the recitations a person had saved.
 *
 * `quran` is the large one on purpose. Offering every language the server
 * carries means the ceiling has to be able to hold all of them at once,
 * otherwise the oldest languages are quietly evicted as new ones arrive and
 * a person who downloaded twenty finds they now have six.
 */
const LIMITS: Record<CacheNamespace, number> = Platform.OS === 'web'
  ? { quran: 60e6, tafsir: 12e6, hadith: 30e6, daily: 3e6, 'audio-meta': 2e6 }
  : { quran: 150e6, tafsir: 45e6, hadith: 70e6, daily: 6e6, 'audio-meta': 4e6 };
const BASE_TOTAL = Object.values(LIMITS).reduce((sum, n) => sum + n, 0);

export type CacheBudget = {
  limits: Record<CacheNamespace, number>;
  total: number;
  /** True when the device is too full to grant the full table above. */
  constrained: boolean;
};

const NAMESPACES = Object.keys(LIMITS) as CacheNamespace[];

let queue = Promise.resolve();
const serial = <T>(operation: () => Promise<T>): Promise<T> => {
  const next = queue.then(operation, operation);
  queue = next.then(() => undefined, () => undefined);
  return next;
};

/**
 * The index, held in memory.
 *
 * It used to be read from storage and written back on every single call,
 * including reads — a read only wanted to record that an entry had been
 * touched, but it paid a whole-index rewrite to say so. That is invisible
 * with a hundred entries and crushing with eleven thousand: the cost of one
 * operation grew with the number of everything else.
 *
 * So the index is loaded once and kept here. Changes are marked dirty and
 * written back on a short delay, which means a burst of a thousand writes
 * costs one serialisation instead of a thousand. A crash between flushes can
 * lose the ordering of `lastAccess`, which decides what is evicted first and
 * nothing more — the payloads themselves are already on disk.
 */
let indexCache: CacheEntry[] | null = null;
let dirty = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_DELAY = 1200;

async function ensureIndex(): Promise<CacheEntry[]> {
  if (indexCache) return indexCache;
  let loaded: CacheEntry[];
  try { loaded = JSON.parse((await AsyncStorage.getItem(INDEX_KEY)) || '[]'); }
  catch { loaded = []; }
  indexCache = Array.isArray(loaded) ? loaded : [];
  return indexCache;
}

function markDirty() {
  dirty = true;
  if (flushTimer) return;
  flushTimer = setTimeout(() => { flushTimer = null; void flushCacheIndex(); }, FLUSH_DELAY);
}

/* The write itself, without taking the queue. Callers already inside `serial`
   must use this — going through `flushCacheIndex` there would wait on a queue
   they are themselves holding, and neither would ever finish. */
async function writeNow(): Promise<void> {
  if (!dirty || !indexCache) return;
  const snapshot = JSON.stringify(indexCache);
  try { await AsyncStorage.setItem(INDEX_KEY, snapshot); dirty = false; } catch { /* retried on the next mark */ }
}

/** Write the index back now. Call when a batch finishes or the app goes to rest. */
export async function flushCacheIndex(): Promise<void> {
  return serial(writeNow);
}

/** Forget the in-memory copy and read it back from storage. */
export async function reloadCacheIndex(): Promise<void> {
  return serial(async () => { indexCache = null; dirty = false; await ensureIndex(); });
}

async function estimateFreeBytes(): Promise<number> {
  try {
    if (Platform.OS === 'web') {
      const estimate = await (navigator as any).storage?.estimate?.();
      if (estimate && typeof estimate.quota === 'number') return Math.max(0, estimate.quota - (estimate.usage || 0));
      return Number.POSITIVE_INFINITY;
    }
    return await FileSystem.getFreeDiskStorageAsync();
  } catch { return Number.POSITIVE_INFINITY; }
}

function resolveBudget(freeBytes: number): CacheBudget {
  if (!Number.isFinite(freeBytes) || freeBytes <= 0) {
    return { limits: { ...LIMITS }, total: BASE_TOTAL, constrained: false };
  }
  /* Half the free space, with a floor so that one low reading does not
     cripple the cache for good. The floor is itself capped below the free
     space: an unconditional floor would grant a budget larger than the
     device actually has, and the cache would try to spend room that is not
     there. */
  const floor = Math.min(20e6, freeBytes * 0.8);
  const allowed = Math.min(BASE_TOTAL, Math.max(floor, freeBytes * 0.5));
  if (allowed >= BASE_TOTAL) return { limits: { ...LIMITS }, total: BASE_TOTAL, constrained: false };
  const scale = allowed / BASE_TOTAL;
  const limits = NAMESPACES.reduce((acc, ns) => { acc[ns] = Math.floor(LIMITS[ns] * scale); return acc; }, {} as Record<CacheNamespace, number>);
  return { limits, total: allowed, constrained: true };
}

let budget: CacheBudget = { limits: { ...LIMITS }, total: BASE_TOTAL, constrained: false };
let budgetAt = 0;
const BUDGET_TTL = 5 * 60 * 1000;

/** The current ceilings, scaled down when the device is short of room. */
export async function cacheBudget(force = false): Promise<CacheBudget> {
  if (!force && budgetAt && Date.now() - budgetAt < BUDGET_TTL) return budget;
  budget = resolveBudget(await estimateFreeBytes());
  budgetAt = Date.now();
  return budget;
}

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

/**
 * Make room for `incomingBytes`.
 *
 * The common case is that there is already room, so that is tested first and
 * costs one pass over the index. Only when the namespace really is full does
 * it sort by age to decide what goes — sorting unconditionally meant every
 * write paid to plan an eviction it almost never performed.
 */
async function evict(index: CacheEntry[], namespace: CacheNamespace, incomingBytes: number, limits: Record<CacheNamespace, number>, totalLimit: number) {
  let next = [...index];
  const remove = async (entry: CacheEntry) => {
    await payloadDelete(storageKey(entry.namespace, entry.key));
    next = next.filter(x => !(x.namespace === entry.namespace && x.key === entry.key));
  };
  /* Pinned entries are never candidates: see `pinned` on CacheEntry. */
  const evictable = () => next.filter(x => !x.pinned);
  let nsBytes = next.filter(x => x.namespace === namespace).reduce((n, x) => n + x.bytes, 0);
  let total = next.reduce((n, x) => n + x.bytes, 0);
  if (nsBytes + incomingBytes <= limits[namespace] && total + incomingBytes <= totalLimit) return next;

  for (const entry of evictable().filter(x => x.namespace === namespace).sort((a, b) => a.lastAccess - b.lastAccess)) {
    if (nsBytes + incomingBytes <= limits[namespace]) break;
    nsBytes -= entry.bytes; total -= entry.bytes;
    await remove(entry);
  }
  for (const entry of evictable().sort((a, b) => a.lastAccess - b.lastAccess)) {
    if (total + incomingBytes <= totalLimit) break;
    if (entry.namespace === namespace) { nsBytes -= entry.bytes; }
    total -= entry.bytes;
    await remove(entry);
  }
  return next;
}

/** Bytes held per namespace, kept current as entries are added and removed. */
function nsTotals(index: CacheEntry[]) {
  const totals = NAMESPACES.reduce((acc, ns) => { acc[ns] = 0; return acc; }, {} as Record<CacheNamespace, number>);
  for (const entry of index) totals[entry.namespace] = (totals[entry.namespace] || 0) + entry.bytes;
  return totals;
}

function utf8Bytes(value:string){let bytes=0;for(let i=0;i<value.length;i++){const code=value.charCodeAt(i);if(code<0x80)bytes++;else if(code<0x800)bytes+=2;else if(code>=0xd800&&code<=0xdbff&&i+1<value.length&&value.charCodeAt(i+1)>=0xdc00&&value.charCodeAt(i+1)<=0xdfff){bytes+=4;i++}else bytes+=3}return bytes}

export async function getCachedJson<T>(namespace:CacheNamespace,key:string):Promise<T|null>{
  return serial(async()=>{
    const full=storageKey(namespace,key);
    const value=await payloadGet(full);
    if(!value)return null;
    const index=await ensureIndex();
    const entry=index.find(x=>x.namespace===namespace&&x.key===key);
    /* Recording the touch in memory only. Persisting it would mean rewriting
       the whole index to say that one entry was read. */
    if(entry)entry.lastAccess=Date.now();
    try{return JSON.parse(value) as T}
    catch{
      indexCache=index.filter(x=>x!==entry);
      await payloadDelete(full);
      markDirty();
      return null;
    }
  });
}

/** `pinned` protects an entry from eviction. Used for the Arabic text. */
export async function setCachedJson(namespace:CacheNamespace,key:string,value:unknown,options:{pinned?:boolean}={}){
  return serial(async()=>{
    const { limits, total: totalLimit } = await cacheBudget();
    const text=JSON.stringify(value);
    const bytes=utf8Bytes(text);
    if(bytes>limits[namespace])throw new Error(`This item is larger than the ${namespace} offline-cache limit.`);
    const current=await ensureIndex();
    let index=current.filter(x=>!(x.namespace===namespace&&x.key===key));
    index=await evict(index,namespace,bytes,limits,totalLimit);
    await payloadSet(storageKey(namespace,key),text);
    index.push({key,namespace,bytes,lastAccess:Date.now(),createdAt:Date.now(),...(options.pinned?{pinned:true}:{})});
    indexCache=index;
    markDirty();
  });
}

export async function listCachedKeys(namespace:CacheNamespace){
  return (await ensureIndex()).filter(x=>x.namespace===namespace).map(x=>x.key);
}

export async function clearCacheNamespace(namespace:CacheNamespace){
  return serial(async()=>{
    const index=await ensureIndex();
    await Promise.all(index.filter(x=>x.namespace===namespace).map(x=>payloadDelete(storageKey(namespace,x.key))));
    indexCache=index.filter(x=>x.namespace!==namespace);
    dirty=true;
    await writeNow();
  });
}

export async function getCacheUsage(){
  const index=await ensureIndex();
  const { limits, total, constrained }=await cacheBudget();
  return {
    totalBytes:index.reduce((n,x)=>n+x.bytes,0),
    limits:{...limits,total},
    byNamespace:nsTotals(index),
    constrained,
  };
}
