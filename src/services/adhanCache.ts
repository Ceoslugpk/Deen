/**
 * Keeps the adhan recordings on the device instead of inside the app.
 *
 * These used to be compiled into the app - 25 MB of audio in every install,
 * whether or not the person ever opened the adhan screen. Now they are fetched
 * once, after onboarding, and written to the app's documents directory, which
 * the system does not clear when it is short of space (the cache directory
 * does, and a recording that silently vanishes is worse than one that was
 * never there).
 *
 * Everything here is written to be safe to call at any time and from anywhere:
 * a file that is already the right size is left alone, a half-finished
 * download is thrown away rather than played, and a failure is reported
 * instead of being swallowed.
 */
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { Asset } from 'expo-asset';
import { ADHAN_TRACKS, FAJR_TRACKS, ALL_ADHAN_TRACKS, type AdhanTrack } from './adhanCatalog';

/**
 * The thirty-second clips that travel inside the app.
 *
 * These are not the recordings the cache holds. They are short enough to ship
 * and they exist for one reason: iOS will only sound a notification with an
 * audio file that is inside the app bundle and under thirty seconds, so
 * without these the adhan cannot sound on a phone at all.
 *
 * Required one by one rather than looked up by name, because Metro has to be
 * able to see every asset path when it builds.
 *
 * They double as instant previews: eight of the recordings can be heard
 * without waiting for anything to download, and with no connection at all.
 */
const CLIP_MODULES: Record<string, number> = {
  adhan_mishary: require('../../assets/sounds/adhan_mishary.m4a'),
  adhan_mansour: require('../../assets/sounds/adhan_mansour.m4a'),
  adhan_ozcan: require('../../assets/sounds/adhan_ozcan.m4a'),
  adhan_nafees: require('../../assets/sounds/adhan_nafees.m4a'),
  adhan_abdulbasit: require('../../assets/sounds/adhan_abdulbasit.m4a'),
  adhan_minshawi: require('../../assets/sounds/adhan_minshawi.m4a'),
  fajr_mansour: require('../../assets/sounds/fajr_mansour.m4a'),
  fajr_traditional: require('../../assets/sounds/fajr_traditional.m4a'),
};

/** The clip shipped for this track, as something a player can be pointed at. */
export function bundledClipUri(track: AdhanTrack): string | null {
  const module = track.clip ? CLIP_MODULES[track.clip] : undefined;
  if (!module) return null;
  try {
    return Asset.fromModule(module).uri ?? null;
  } catch {
    return null;
  }
}

const DIR_NAME = 'adhan';

/** `adhan:mishary-rashid-alafasy` -> `adhan_mishary_rashid_alafasy.mp3` */
function fileNameFor(track: AdhanTrack): string {
  return `${track.id.replace(/[^a-z0-9]+/gi, '_')}.mp3`;
}

let dirCache: Directory | null = null;
function adhanDirectory(): Directory {
  if (!dirCache) {
    dirCache = new Directory(Paths.document, DIR_NAME);
    if (!dirCache.exists) dirCache.create();
  }
  return dirCache;
}

function fileFor(track: AdhanTrack): File {
  return new File(adhanDirectory(), fileNameFor(track));
}

/**
 * Whether the recording is on the device and complete.
 *
 * Existence alone is not enough: a download interrupted at 40% leaves a file
 * that exists and plays about five seconds of silence before stopping. The
 * size is checked against the catalogue so a partial file is treated as
 * missing and fetched again.
 */
export function isAdhanCached(track: AdhanTrack): boolean {
  try {
    const file = fileFor(track);
    if (!file.exists) return false;
    const size = file.size ?? 0;
    return size > 0 && (track.bytes > 0 ? Math.abs(size - track.bytes) <= 1 : true);
  } catch {
    return false;
  }
}

/** The local URI to play, or null when it has not been fetched yet. */
export function cachedAdhanUri(track: AdhanTrack): string | null {
  return isAdhanCached(track) ? fileFor(track).uri : null;
}

/**
 * What to hand to a player: the local file once it is on the device, and the
 * network address while it is still arriving.
 *
 * On the web there is no documents directory to write into, so this is always
 * the remote address - the browser caches what it likes and the preview still
 * works.
 */
export function adhanPlaybackSource(track: AdhanTrack): string {
  if (PlatformIsWeb()) return track.url;
  /* Which of the two to preview depends on which one is going to sound at the
     prayer time, and that is different on the two platforms.
     On iOS the clip is the only thing that can ever sound - a notification
     there will not touch a downloaded file - so previewing the clip is
     previewing exactly what will be heard.
     On Android the alarm plays the whole recording from the cache, so the full
     recording is what should be heard when it is there. The clip is kept as
     the fallback for when nothing has been fetched yet, because hearing a
     voice at once beats waiting for a download to find out what it is. */
  if (Platform.OS === 'ios') {
    return bundledClipUri(track) ?? cachedAdhanUri(track) ?? track.url;
  }
  return cachedAdhanUri(track) ?? bundledClipUri(track) ?? track.url;
}

function PlatformIsWeb(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Fetches one recording, skipping any that is already complete.
 * Resolves to the local URI, or to the remote URL if the fetch failed.
 */
export async function ensureAdhanTrack(track: AdhanTrack): Promise<string> {
  if (PlatformIsWeb()) return track.url;
  if (isAdhanCached(track)) return fileFor(track).uri;
  const file = fileFor(track);
  /* A partial download from an earlier attempt would never be recognised as
     complete, so it is removed before the retry rather than after. */
  if (file.exists) file.delete();
  try {
    const result = await File.downloadFileAsync(track.url, file);
    if (!result.exists) throw new Error('download produced no file');
    if (track.bytes > 0 && result.size > 0 && Math.abs(result.size - track.bytes) > 1) {
      result.delete();
      throw new Error(`incomplete download: ${result.size} of ${track.bytes} bytes`);
    }
    bump();
    return result.uri;
  } catch (error) {
    bump();
    throw error;
  }
}

export type AdhanCacheProgress = { done: number; total: number };

export type AdhanCacheState = {
  cached: number;
  total: number;
  bytes: number;
  totalBytes: number;
  /** Set while a fetch is running, so the UI can say what is happening. */
  running: boolean;
  /** Set when the last fetch hit a problem; cleared on the next success. */
  error: string | null;
};

let state: AdhanCacheState = {
  cached: 0,
  total: ALL_ADHAN_TRACKS.length,
  bytes: 0,
  totalBytes: ALL_ADHAN_TRACKS.reduce((sum, t) => sum + t.bytes, 0),
  running: false,
  error: null,
};
const listeners = new Set<(next: AdhanCacheState) => void>();
function bump() { listeners.forEach((fn) => fn(state)); }
function set(patch: Partial<AdhanCacheState>) { state = { ...state, ...patch }; bump(); }

export function getAdhanCacheState(): AdhanCacheState { return state; }
export function subscribeAdhanCache(fn: (next: AdhanCacheState) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Recounts what is actually on the device. Cheap; safe to call often. */
export function refreshAdhanCache(): AdhanCacheState {
  let cached = 0;
  let bytes = 0;
  for (const track of ALL_ADHAN_TRACKS) {
    if (isAdhanCached(track)) { cached += 1; bytes += track.bytes; }
  }
  set({ cached, bytes });
  return state;
}

/**
 * Fetches every recording that is not on the device yet.
 *
 * This is what runs once onboarding finishes. It is deliberately quiet: it
 * fetches in the background, it never blocks a screen, and a recording that
 * fails is simply left for the next attempt rather than interrupting anyone.
 */
export async function downloadAllAdhanTracks(
  onProgress?: (progress: AdhanCacheProgress) => void,
): Promise<AdhanCacheState> {
  if (PlatformIsWeb()) { refreshAdhanCache(); return state; }
  if (state.running) return state;
  set({ running: true, error: null });
  const pending = ALL_ADHAN_TRACKS.filter((track) => !isAdhanCached(track));
  let done = 0;
  let firstError: string | null = null;
  for (const track of pending) {
    try {
      await ensureAdhanTrack(track);
    } catch (error) {
      /* One missing recording should not stop the other nineteen, and it
         should not stop the person using the app either. */
      if (!firstError) firstError = error instanceof Error ? error.message : String(error);
    }
    done += 1;
    onProgress?.({ done, total: pending.length });
    refreshAdhanCache();
  }
  set({ running: false, error: firstError });
  refreshAdhanCache();
  return state;
}

/** Removes every fetched recording and frees the space. */
export function clearAdhanCache(): void {
  try {
    const dir = adhanDirectory();
    if (dir.exists) dir.delete();
  } catch { /* nothing to clear */ }
  dirCache = null;
  refreshAdhanCache();
}

/** True once every recording is on the device. */
export function isAdhanCacheComplete(): boolean {
  return ALL_ADHAN_TRACKS.every(isAdhanCached);
}

export const ADHAN_CACHE_TRACK_COUNT = ALL_ADHAN_TRACKS.length;
export { ADHAN_TRACKS, FAJR_TRACKS };
