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
 * `quran` and `tafsir` are the large ones on purpose, and they are sized
 * apart from each other. Every translation the server carries comes to about
 * 725 MB; every tafsir to about 1,058 MB, because commentary runs roughly
 * eight times longer than a translation of the same verse. Sharing one
 * ceiling, a person who wanted all the translations — a third of the space —
 * would be competing with commentary they may never have asked for. Kept
 * separate, taking every translation does not require taking a gigabyte of
 * tafsir, and each can be offered on its own terms.
 *
 * Both are ceilings, not targets. Nobody is expected to hold 1.8 GB, and the
 * real limit is still half the free space on the device. What these numbers
 * buy is that a person who genuinely wants everything, on a phone with room
 * for it, is not refused by a limit written when the app held one translation.
 */
const LIMITS: Record<CacheNamespace, number> = Platform.OS === 'web'
  ? { quran: 300e6, tafsir: 400e6, hadith: 30e6, daily: 3e6, 'audio-meta': 2e6 }
  : { quran: 800e6, tafsir: 1100e6, hadith: 70e6, daily: 6e6, 'audio-meta': 4e6 };
const BASE_TOTAL = Object.values(LIMITS).reduce((sum, n) => sum + n, 0);

export type CacheBudget = {
  limits: Record<CacheNamespace, number>;
  total: number;
  /** True when the device is too full to grant the full table above. */
  constrained: boolean;
};

const NAMESPACES = Object.keys(LIMITS) as CacheNamespace[];

/* A readers-writer lock, not a single mutex.

   It used to be one FIFO queue for everything. That was fine when a download
   meant a couple of hundred writes. It stopped being fine the moment choosing
   a language began queuing every edition in that language: one language is
   ~6,600 surah writes, and every catalog read the UI made queued behind all
   of them. The screens looked frozen while the download ran, because they
   were - waiting their turn in a line that was twenty minutes long.

   So reads now share the index with each other and only wait for a writer,
   while writes still get it entirely to themselves. A writer never starts
   while readers are inside, and once a writer is at the front of the queue
   no new reader can slip ahead of it, so a steady stream of reads cannot
   starve a write. */

type LockKind = 'r' | 'w';
type Waiter = { kind: LockKind; start: () => void };

const lockQueue: Waiter[] = [];
let activeReaders = 0;
let writerRunning = false;

const pump = (): void => {
  if (writerRunning || lockQueue.length === 0) return;
  if (lockQueue[0].kind === 'w') {
    /* a writer is at the front: only run once every reader is out, and let
       no reader in behind it. */
    if (activeReaders > 0) return;
    const next = lockQueue.shift()!;
    writerRunning = true;
    next.start();
    return;
  }
  /* consecutive readers run together */
  while (lockQueue.length > 0 && lockQueue[0].kind === 'r') {
    const next = lockQueue.shift()!;
    activeReaders += 1;
    next.start();
  }
};

const withLock = <T>(kind: LockKind, operation: () => Promise<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    lockQueue.push({
      kind,
      start: () => {
        operation().then(resolve, reject).finally(() => {
          if (kind === 'w') writerRunning = false;
          else activeReaders -= 1;
          pump();
        });
      },
    });
    pump();
  });

/** Exclusive. For anything that changes the index or writes a payload. */
const serial = <T>(operation: () => Promise<T>): Promise<T> => withLock('w', operation);
/** Shared. For anything that only looks. */
const shared = <T>(operation: () => Promise<T>): Promise<T> => withLock('r', operation);

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
/**
 * Bytes held per namespace, kept up to date as entries come and go.
 *
 * Every write needs to know whether it fits. Measuring that by walking the
 * whole index costs one pass over every entry for every single surah — at
 * sixty-five thousand entries, sixty-five thousand walks. Held as a running
 * total instead, asking is free and only eviction, which is rare, scans.
 */
let nsTotals: Record<CacheNamespace, number> = NAMESPACES.reduce(
  (acc, ns) => { acc[ns] = 0; return acc; }, {} as Record<CacheNamespace, number>,
);
let totalBytes = 0;

function recount() {
  nsTotals = NAMESPACES.reduce((acc, ns) => { acc[ns] = 0; return acc; }, {} as Record<CacheNamespace, number>);
  totalBytes = 0;
  for (const entry of indexCache || []) {
    nsTotals[entry.namespace] = (nsTotals[entry.namespace] || 0) + entry.bytes;
    totalBytes += entry.bytes;
  }
}
const grandTotal = () => totalBytes;

let dirty = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_DELAY = 1200;

async function ensureIndex(): Promise<CacheEntry[]> {
  if (indexCache) return indexCache;
  let loaded: CacheEntry[];
  try { loaded = JSON.parse((await AsyncStorage.getItem(INDEX_KEY)) || '[]'); }
  catch { loaded = []; }
  indexCache = Array.isArray(loaded) ? loaded : [];
  recount();
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
  /* The common case is that there is room. That is decided from the running
     totals, so it costs nothing and copies nothing — the index is only
     duplicated when entries genuinely have to go. */
  if (nsTotals[namespace] + incomingBytes <= limits[namespace] && grandTotal() + incomingBytes <= totalLimit) {
    return index;
  }

  let next = [...index];
  let nsBytes = nsTotals[namespace];
  let total = grandTotal();
  const remove = async (entry: CacheEntry) => {
    await payloadDelete(storageKey(entry.namespace, entry.key));
    next = next.filter(x => !(x.namespace === entry.namespace && x.key === entry.key));
  };
  /* Pinned entries are never candidates: see `pinned` on CacheEntry. */
  const evictable = () => next.filter(x => !x.pinned);

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

function utf8Bytes(value:string){let bytes=0;for(let i=0;i<value.length;i++){const code=value.charCodeAt(i);if(code<0x80)bytes++;else if(code<0x800)bytes+=2;else if(code>=0xd800&&code<=0xdbff&&i+1<value.length&&value.charCodeAt(i+1)>=0xdc00&&value.charCodeAt(i+1)<=0xdfff){bytes+=4;i++}else bytes+=3}return bytes}

export async function getCachedJson<T>(namespace:CacheNamespace,key:string):Promise<T|null>{
  return shared(async()=>{
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
      recount();
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
    const existing=current.find(x=>x.namespace===namespace&&x.key===key);
    let index=existing?current.filter(x=>!(x.namespace===namespace&&x.key===key)):current;
    if(existing){nsTotals[namespace]-=existing.bytes;totalBytes-=existing.bytes}
    index=await evict(index,namespace,bytes,limits,totalLimit);
    await payloadSet(storageKey(namespace,key),text);
    index.push({key,namespace,bytes,lastAccess:Date.now(),createdAt:Date.now(),...(options.pinned?{pinned:true}:{})});
    indexCache=index;
    /* After an eviction the running totals are only a lower bound, so they are
       rebuilt from what is actually left. Rare, and cheaper than being wrong. */
    if(index.length!==current.length-(existing?1:0)) recount();
    else {nsTotals[namespace]+=bytes;totalBytes+=bytes}
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
    recount();
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
    byNamespace:{...nsTotals},
    constrained,
  };
}
