import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { getSurahAudio, getSurahReciters } from './api';
import { getCachedJson, setCachedJson } from './contentCache';

/**
 * Phase 3 — Quran downloads.
 *
 * A download is only ever a copy of something a public source served: full-Surah
 * audio from the Islamic Network CDN (for verse-by-verse reciters) or MP3Quran, and
 * Surah text from Al Quran Cloud. Every download is written to a temporary partial
 * file, validated, and only then moved into place, so an interrupted connection
 * never leaves a half file where a complete one is expected.
 *
 * On the web there is no filesystem, so "kept on this device" means the audio bytes
 * are stored in IndexedDB and the text in the existing Quran cache. The list, the
 * progress and the validation behave the same either way.
 *
 * One web detail matters: a browser refuses to read the bytes of a cross-origin
 * file unless the host allows it. MP3Quran does; the Islamic Network CDN does not.
 * So on the web the verse-by-verse reciters are fetched through the app's own
 * `/api/audio` relay (a range-forwarding pass-through to the same public file), in
 * 4 MB chunks, while native builds download straight from the CDN.
 */

export type DownloadKind = 'audio' | 'text';
export type DownloadStatus = 'downloading' | 'paused' | 'done' | 'failed';

export type DownloadItem = {
  id: string;
  kind: DownloadKind;
  chapterId: number;
  chapterName: string;
  edition: string;
  label: string;
  status: DownloadStatus;
  progress: number;
  bytes: number;
  expectedBytes: number;
  uri: string;
  error: string;
  createdAt: number;
  completedAt: number;
};

const KEY = 'quran-downloads-v1';
const WEB_DB = 'deen-downloads-v1';
const WEB_STORE = 'files';
const nativeDirectory = `${FileSystem.documentDirectory || FileSystem.cacheDirectory}deen-downloads/`;

let items: DownloadItem[] = [];
const listeners = new Set<(next: DownloadItem[]) => void>();
const resumables = new Map<string, any>();
let hydrated = false;

function emit(next: DownloadItem[]) {
  items = next;
  listeners.forEach((listener) => listener(items));
}

async function persist(next: DownloadItem[]) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

function patch(id: string, changes: Partial<DownloadItem>) {
  const next = items.map((item) => (item.id === id ? { ...item, ...changes } : item));
  void persist(next);
}

export function getDownloads() {
  return items;
}

export function subscribeDownloads(listener: (next: DownloadItem[]) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDownloads(): DownloadItem[] {
  const [value, setValue] = useState<DownloadItem[]>(items);
  useEffect(() => {
    const unsubscribe = subscribeDownloads(setValue);
    return () => {
      unsubscribe();
    };
  }, []);
  return value;
}

export async function loadDownloads() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    items = raw ? JSON.parse(raw) : [];
    // Anything left mid-flight from a previous session is a partial file, not a download.
    items = items.map((item) => (item.status === 'downloading' ? { ...item, status: 'paused' as DownloadStatus } : item));
  } catch {
    items = [];
  }
  hydrated = true;
  listeners.forEach((listener) => listener(items));
  return items;
}

/* ----------------------------------------------------------- storage helpers */

function openWebDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WEB_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(WEB_STORE)) request.result.createObjectStore(WEB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function webPut(key: string, data: ArrayBuffer) {
  const db = await openWebDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(WEB_STORE, 'readwrite');
    tx.objectStore(WEB_STORE).put(data, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function webGet(key: string): Promise<ArrayBuffer | null> {
  const db = await openWebDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(WEB_STORE, 'readonly');
    const request = tx.objectStore(WEB_STORE).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function webDelete(key: string) {
  const db = await openWebDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(WEB_STORE, 'readwrite');
    tx.objectStore(WEB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function ensureNativeDirectory() {
  const info = await FileSystem.getInfoAsync(nativeDirectory);
  if (!info.exists) await FileSystem.makeDirectoryAsync(nativeDirectory, { intermediates: true });
}

export async function estimateFreeBytes(): Promise<number> {
  try {
    if (Platform.OS === 'web') {
      const estimate = await (navigator as any).storage?.estimate?.();
      if (estimate && typeof estimate.quota === 'number') return Math.max(0, estimate.quota - (estimate.usage || 0));
      return Number.POSITIVE_INFINITY;
    }
    return await FileSystem.getFreeDiskStorageAsync();
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

/* ------------------------------------------------------------- audio sources */

const AUDIO_RELAY = '/api/audio';
const CHUNK = 4 * 1024 * 1024;
let reciterCache: { savedAt: number; list: { id: number; server: string; name: string }[] } | null = null;

async function loadReciters() {
  if (reciterCache && Date.now() - reciterCache.savedAt < 12 * 60 * 60 * 1000) return reciterCache.list;
  try {
    const list = await getSurahReciters();
    reciterCache = { savedAt: Date.now(), list };
    return reciterCache.list;
  } catch {
    return reciterCache?.list || [];
  }
}

export type AudioSource = { url: string; direct: string; note: string };

/**
 * Works out where a full-Surah file can be fetched from. MP3Quran serves one file
 * per Surah and allows the browser to read it directly; the verse-by-verse
 * reciters come from a host that does not, so the web reads those through the
 * app's own relay instead.
 */
export async function resolveAudioSource(edition: string, chapterId: number): Promise<AudioSource> {
  if (!edition) return { url: '', direct: '', note: 'Choose a reciter before keeping audio.' };
  if (!chapterId) return { url: '', direct: '', note: '' };

  if (edition.startsWith('mp3quran-')) {
    const id = Number(edition.slice('mp3quran-'.length));
    const reciters = await loadReciters();
    const reciter = reciters.find((entry) => entry.id === id) || (Number.isFinite(id) ? null : reciters[0]);
    if (!reciter?.server) {
      return { url: '', direct: '', note: 'The full-Surah reciter list is still loading. Try again in a moment.' };
    }
    const direct = `${reciter.server.endsWith('/') ? reciter.server : `${reciter.server}/`}${String(chapterId).padStart(3, '0')}.mp3`;
    return { url: direct, direct, note: '' };
  }

  const direct = `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${chapterId}.mp3`;
  if (Platform.OS !== 'web') return { url: direct, direct, note: '' };
  return { url: `${AUDIO_RELAY}?edition=${encodeURIComponent(edition)}&chapter=${chapterId}`, direct, note: '' };
}

async function probeBytes(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const length = Number(response.headers.get('content-length'));
    if (Number.isFinite(length) && length > 0) return length;
  } catch {
    /* fall through to a one byte range probe */
  }
  try {
    const response = await fetch(url, { headers: { Range: 'bytes=0-0' } });
    const range = response.headers.get('content-range') || '';
    const total = Number(range.split('/')[1]);
    return Number.isFinite(total) && total > 0 ? total : 0;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------- web (chunked) saving */

type WebPartial = { parts: Blob[]; received: number };
const webPartials = new Map<string, WebPartial>();
const webCancelled = new Set<string>();

/** Fetches the file in 4 MB ranges so progress is real, pausing is possible, and
 *  no single response is large enough to be cut off in transit. */
async function fetchInChunks(id: string, url: string, expected: number): Promise<Blob | null> {
  const partial = webPartials.get(id) || { parts: [], received: 0 };
  webPartials.set(id, partial);
  webCancelled.delete(id);

  for (;;) {
    if (webCancelled.has(id)) {
      webCancelled.delete(id);
      patch(id, { status: 'paused' });
      return null;
    }
    const start = partial.received;
    const end = expected ? Math.min(start + CHUNK, expected) - 1 : start + CHUNK - 1;
    const headers: Record<string, string> = {};
    if (expected || start > 0) headers.Range = `bytes=${start}-${end}`;
    const response = await fetch(url, { headers });
    if (response.status === 416) break;
    if (!response.ok && response.status !== 206) throw new Error(`Request failed (${response.status})`);
    const buffer = await response.arrayBuffer();
    if (!buffer.byteLength) break;
    partial.parts.push(new Blob([buffer], { type: 'audio/mpeg' }));
    partial.received += buffer.byteLength;
    patch(id, {
      progress: expected ? Math.min(1, partial.received / expected) : 0,
      bytes: partial.received,
      expectedBytes: expected || partial.received,
    });
    if (expected ? partial.received >= expected : buffer.byteLength < CHUNK) break;
  }

  if (webCancelled.has(id)) {
    webCancelled.delete(id);
    patch(id, { status: 'paused' });
    return null;
  }
  const blob = new Blob(partial.parts, { type: 'audio/mpeg' });
  if (!blob.size) throw new Error('The download finished empty.');
  if (expected && blob.size < expected * 0.95) throw new Error('The download was interrupted before it completed.');
  return blob;
}

async function storeWebAudio(id: string, blob: Blob) {
  await webPut(id, await blob.arrayBuffer());
  const saved = await webGet(id).catch(() => null);
  if (!saved || saved.byteLength < blob.size * 0.95) throw new Error('The saved file could not be verified.');
  webPartials.delete(id);
  patch(id, { status: 'done', progress: 1, bytes: blob.size, uri: `idb:${id}`, completedAt: Date.now(), error: '' });
}

/* ------------------------------------------------------------------ removing */

export async function removeDownload(id: string) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  try {
    if (Platform.OS === 'web') {
      await webDelete(id);
      const objectUrl = webUrls.get(id);
      if (objectUrl) { try { URL.revokeObjectURL(objectUrl); } catch { /* already gone */ } webUrls.delete(id); }
      if (item.kind === 'text') await AsyncStorage.removeItem(`quran-download-text-${id}`).catch(() => undefined);
    } else if (item.uri) {
      await FileSystem.deleteAsync(item.uri, { idempotent: true });
      await FileSystem.deleteAsync(`${item.uri}.part`, { idempotent: true });
    }
  } catch {
    /* a missing file is not an error when the goal is to remove it */
  }
  resumables.delete(id);
  webPartials.delete(id);
  webCancelled.delete(id);
  const next = items.filter((entry) => entry.id !== id);
  await persist(next);
}

/* ----------------------------------------------------------------- downloading */

async function finalizeNative(partial: string, final: string, expected: number) {
  const info = await FileSystem.getInfoAsync(partial);
  if (!info.exists || !info.size) throw new Error('The download finished empty.');
  if (expected && info.size < expected * 0.95) throw new Error('The download was interrupted before it completed.');
  await FileSystem.moveAsync({ from: partial, to: final });
  const moved = await FileSystem.getInfoAsync(final);
  if (!moved.exists || !moved.size) throw new Error('The file could not be saved.');
  await FileSystem.deleteAsync(partial, { idempotent: true });
  return moved.size;
}

export async function downloadSurahAudio(options: {
  chapterId: number;
  chapterName: string;
  edition: string;
  label: string;
  url: string;
}) {
  const { chapterId, chapterName, edition, label, url } = options;
  const id = `audio-${chapterId}-${edition}`;
  if (!hydrated) await loadDownloads();
  const existing = items.find((entry) => entry.id === id);
  if (existing?.status === 'done') return existing;

  const expected = await probeBytes(url);
  const free = await estimateFreeBytes();
  const needed = expected || 12 * 1024 * 1024;
  if (free !== Number.POSITIVE_INFINITY && needed > free * 0.9) {
    throw new Error('There is not enough free space on this device for this Surah.');
  }

  const record: DownloadItem = {
    id,
    kind: 'audio',
    chapterId,
    chapterName,
    edition,
    label,
    status: 'downloading',
    progress: 0,
    bytes: 0,
    expectedBytes: expected,
    uri: '',
    error: '',
    createdAt: existing?.createdAt || Date.now(),
    completedAt: 0,
  };
  await persist([record, ...items.filter((entry) => entry.id !== id)]);

  try {
    if (Platform.OS === 'web') {
      const blob = await fetchInChunks(id, url, expected);
      if (blob) await storeWebAudio(id, blob);
    } else {
      await ensureNativeDirectory();
      const final = `${nativeDirectory}${id}.mp3`;
      const partial = `${final}.part`;
      await FileSystem.deleteAsync(partial, { idempotent: true });
      const resumable = FileSystem.createDownloadResumable(url, partial, {}, (progress: any) => {
        const total = progress.totalBytesExpectedToWrite || expected || 0;
        patch(id, { progress: total ? Math.min(1, progress.totalBytesWritten / total) : 0, bytes: progress.totalBytesWritten });
      });
      resumables.set(id, resumable);
      const result = await resumable.downloadAsync();
      if (!result?.uri) throw new Error('The download did not complete.');
      const size = await finalizeNative(partial, final, expected);
      resumables.delete(id);
      patch(id, { status: 'done', progress: 1, bytes: size, uri: final, completedAt: Date.now(), error: '' });
    }
    return items.find((entry) => entry.id === id);
  } catch (error: any) {
    resumables.delete(id);
    patch(id, { status: 'failed', error: error?.message || 'The download could not be completed.' });
    throw error;
  }
}

export async function downloadSurahText(options: {
  chapterId: number;
  chapterName: string;
  script: string;
  translation: string;
  label: string;
}) {
  const { chapterId, chapterName, script, translation, label } = options;
  const id = `text-${chapterId}-${script}-${translation}`;
  if (!hydrated) await loadDownloads();
  const existing = items.find((entry) => entry.id === id);
  if (existing?.status === 'done') return existing;

  const record: DownloadItem = {
    id,
    kind: 'text',
    chapterId,
    chapterName,
    edition: `${script}+${translation}`,
    label,
    status: 'downloading',
    progress: 0.2,
    bytes: 0,
    expectedBytes: 0,
    uri: '',
    error: '',
    createdAt: existing?.createdAt || Date.now(),
    completedAt: 0,
  };
  await persist([record, ...items.filter((entry) => entry.id !== id)]);

  try {
    const [arabic, translated] = await Promise.all([getSurahAudio(chapterId, script), getSurahAudio(chapterId, translation)]);
    const payload = [
      { edition: script, ayahs: arabic },
      { edition: translation, ayahs: translated },
    ];
    if (!arabic?.length && !translated?.length) throw new Error('The Surah text could not be fetched.');
    const cacheKey = `surah-${chapterId}-${script}-${translation}`;
    await setCachedJson('quran', cacheKey, { savedAt: Date.now(), rows: payload });
    const stored = await getCachedJson<{ rows: unknown[] }>('quran', cacheKey);
    if (!stored || !Array.isArray(stored.rows) || !stored.rows.length) throw new Error('The saved text could not be verified.');
    patch(id, { status: 'done', progress: 1, bytes: JSON.stringify(payload).length, uri: `cache:${cacheKey}`, completedAt: Date.now(), error: '' });
    return items.find((entry) => entry.id === id);
  } catch (error: any) {
    patch(id, { status: 'failed', error: error?.message || 'The download could not be completed.' });
    throw error;
  }
}

export async function pauseDownload(id: string) {
  if (webPartials.has(id)) {
    webCancelled.add(id);
    return;
  }
  const resumable = resumables.get(id);
  if (!resumable) return;
  try {
    await resumable.pauseAsync();
    patch(id, { status: 'paused' });
  } catch {
    /* pausing is best effort */
  }
}

export async function resumeDownload(id: string) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  if (webPartials.has(id)) {
    const source = await resolveAudioSource(item.edition, item.chapterId);
    if (!source.url) {
      patch(id, { status: 'failed', error: source.note || 'This reciter has no full-Surah file to download.' });
      return;
    }
    patch(id, { status: 'downloading', error: '' });
    try {
      const blob = await fetchInChunks(id, source.url, item.expectedBytes);
      if (blob) await storeWebAudio(id, blob);
    } catch (error: any) {
      patch(id, { status: 'failed', error: error?.message || 'The download could not be resumed.' });
    }
    return;
  }
  const resumable = resumables.get(id);
  if (!resumable) return;
  patch(id, { status: 'downloading', error: '' });
  try {
    const result = await resumable.resumeAsync();
    if (Platform.OS !== 'web' && result?.uri) {
      const final = `${nativeDirectory}${id}.mp3`;
      const size = await finalizeNative(`${final}.part`, final, item.expectedBytes);
      resumables.delete(id);
      patch(id, { status: 'done', progress: 1, bytes: size, uri: final, completedAt: Date.now() });
    } else {
      patch(id, { status: 'done', progress: 1, completedAt: Date.now() });
    }
  } catch (error: any) {
    patch(id, { status: 'failed', error: error?.message || 'The download could not be resumed.' });
  }
}

export async function retryDownload(id: string) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  if (item.kind === 'text') {
    const [script, translation] = item.edition.split('+');
    await downloadSurahText({ chapterId: item.chapterId, chapterName: item.chapterName, script, translation, label: item.label });
    return;
  }
  webPartials.delete(id);
  webCancelled.delete(id);
  const source = await resolveAudioSource(item.edition, item.chapterId);
  if (!source.url) throw new Error(source.note || 'This reciter has no full-Surah file to download.');
  await downloadSurahAudio({ chapterId: item.chapterId, chapterName: item.chapterName, edition: item.edition, label: item.label, url: source.url });
}

/* ------------------------------------------------------------------- lookups */

export function findAudioDownload(chapterId: number, edition: string) {
  return items.find((entry) => entry.kind === 'audio' && entry.chapterId === chapterId && entry.edition === edition && entry.status === 'done');
}

let webUrls = new Map<string, string>();

export async function localAudioUri(chapterId: number, edition: string): Promise<string | null> {
  const item = findAudioDownload(chapterId, edition);
  if (!item) return null;
  if (Platform.OS !== 'web') return item.uri || null;
  if (!item.uri.startsWith('idb:')) return null;
  const key = item.uri.slice(4);
  const cachedUrl = webUrls.get(key);
  if (cachedUrl) return cachedUrl;
  const buffer = await webGet(key).catch(() => null);
  if (!buffer) return null;
  const url = URL.createObjectURL(new Blob([buffer], { type: 'audio/mpeg' }));
  webUrls.set(key, url);
  return url;
}

export function totalDownloadBytes() {
  return items.filter((item) => item.status === 'done').reduce((sum, item) => sum + item.bytes, 0);
}

export function formatBytes(bytes: number) {
  if (!bytes) return '0 MB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
