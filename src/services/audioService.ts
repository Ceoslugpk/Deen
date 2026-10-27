import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { AudioEdition, getAudioEditions, getSurahAudio, getSurahReciters, SurahAudioAyah, SurahReciter } from './api';
import { getCachedJson, setCachedJson } from './contentCache';
import { localAudioUri } from './downloadService';

/**
 * Phase 3 — Quran audio foundation.
 *
 * Audio sources are live and attributed:
 *   - Reciter + translation-audio catalogue: Al Quran Cloud (api.alquran.cloud)
 *   - Audio files themselves: Islamic Network CDN (cdn.islamic.network), served by Al Quran Cloud ayah records
 * No audio is bundled and no placeholder URLs are generated. A track only exists
 * when the API returned a real URL for that ayah.
 */

export type AudioTrackKind = 'arabic' | 'translation';
export type RepeatMode = 'none' | 'one' | 'all';

export type AudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  chapterId: number;
  chapterName: string;
  ayahNumber: number;
  globalNumber: number;
  kind: AudioTrackKind;
  edition: string;
  performer: string;
  uri: string;
  text?: string;
};

export type AudioSettings = {
  reciterMode: 'verse' | 'surah';
  reciter: string;
  reciterName: string;
  surahReciterId: number | null;
  surahReciterName: string;
  translationAudioEnabled: boolean;
  translationEdition: string;
  translationName: string;
  sequential: boolean;
  repeat: RepeatMode;
  rate: number;
};

export type AudioState = {
  queue: AudioTrack[];
  index: number;
  track: AudioTrack | null;
  playing: boolean;
  buffering: boolean;
  position: number;
  duration: number;
  repeat: RepeatMode;
  rate: number;
  error: string | null;
};

export type RecentPlay = {
  chapterId: number;
  chapterName: string;
  ayahNumber: number;
  edition: string;
  performer: string;
  at: number;
};

export type Playlist = {
  id: string;
  name: string;
  createdAt: number;
  tracks: AudioTrack[];
};

export type AudioSession = {
  chapterId: number;
  chapterName: string;
  reciterMode: 'verse' | 'surah';
  surahReciterId: number | null;
  edition: string;
  translationEdition: string;
  sequential: boolean;
  index: number;
  position: number;
  savedAt: number;
};

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  reciterMode: 'verse',
  reciter: 'ar.alafasy',
  reciterName: 'Mishary Rashid Alafasy',
  surahReciterId: null,
  surahReciterName: '',
  translationAudioEnabled: false,
  translationEdition: 'en.walk',
  translationName: 'Ibrahim Walk',
  sequential: true,
  repeat: 'all',
  rate: 1,
};

const KEYS = {
  settings: '@deen/audio-settings/v1',
  recent: '@deen/audio-recent/v1',
  playlists: '@deen/audio-playlists/v1',
  session: '@deen/audio-session/v1',
};

const RECENT_LIMIT = 24;
const PLAYLIST_LIMIT = 12;
const PLAYLIST_TRACK_LIMIT = 300;
const EDITION_TTL = 7 * 24 * 60 * 60 * 1000;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? ({ ...fallback, ...(JSON.parse(value) as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — playback continues without persistence */
  }
}

/* ------------------------------------------------------------------ catalogue */

type EditionBundle = { savedAt: number; editions: AudioEdition[] };

export async function loadAudioEditions(force = false): Promise<{ arabic: AudioEdition[]; translation: AudioEdition[] }> {
  const cached = await getCachedJson<EditionBundle>('audio-meta', 'editions-v1');
  let editions = cached?.editions;
  const stale = !editions || force || Date.now() - (cached?.savedAt || 0) > EDITION_TTL;
  if (stale || !editions) {
    editions = await getAudioEditions();
    await setCachedJson('audio-meta', 'editions-v1', { savedAt: Date.now(), editions }).catch(() => undefined);
  }
  const arabic = editions.filter(
    (edition) => edition.language === 'ar' && (edition.type === 'versebyverse' || edition.type === 'translation'),
  );
  const translation = editions.filter((edition) => edition.language !== 'ar');
  return { arabic: arabic.length ? arabic : editions.filter((edition) => edition.language === 'ar'), translation };
}

export async function loadSurahReciters(force = false): Promise<SurahReciter[]> {
  const cached = await getCachedJson<EditionBundle & { reciters: SurahReciter[] }>('audio-meta', 'surah-reciters-v1');
  if (!force && cached?.reciters?.length && Date.now() - cached.savedAt < EDITION_TTL) return cached.reciters;
  const reciters = await getSurahReciters();
  await setCachedJson('audio-meta', 'surah-reciters-v1', { savedAt: Date.now(), editions: [], reciters }).catch(() => undefined);
  return reciters;
}

type SurahAudioBundle = { savedAt: number; ayahs: SurahAudioAyah[] };

export async function loadSurahAudio(chapterId: number, edition: string): Promise<SurahAudioAyah[]> {
  const key = `surah-${chapterId}-${edition}`;
  const cached = await getCachedJson<SurahAudioBundle>('audio-meta', key);
  if (cached?.ayahs?.length) return cached.ayahs;
  const ayahs = await getSurahAudio(chapterId, edition);
  if (!ayahs.length) throw new Error('This reciter has no audio for this Surah.');
  await setCachedJson('audio-meta', key, { savedAt: Date.now(), ayahs }).catch(() => undefined);
  return ayahs;
}

function trackFor(
  ayah: SurahAudioAyah,
  chapterId: number,
  chapterName: string,
  kind: AudioTrackKind,
  edition: string,
  performer: string,
): AudioTrack {
  const label = kind === 'translation' ? 'Translation' : 'Verse';
  return {
    id: `${kind}:${chapterId}:${ayah.numberInSurah}:${edition}`,
    title: `${chapterName} · ${label} ${ayah.numberInSurah}`,
    subtitle: performer,
    chapterId,
    chapterName,
    ayahNumber: ayah.numberInSurah,
    globalNumber: ayah.globalNumber,
    kind,
    edition,
    performer,
    uri: ayah.audio,
    text: ayah.text,
  };
}

export async function buildSurahQueue(
  chapterId: number,
  chapterName: string,
  settings: AudioSettings,
): Promise<AudioTrack[]> {
  const arabic = await loadSurahAudio(chapterId, settings.reciter);
  const queue = arabic.map((ayah) => trackFor(ayah, chapterId, chapterName, 'arabic', settings.reciter, settings.reciterName));
  if (!settings.translationAudioEnabled) return queue;
  const translated = await loadSurahAudio(chapterId, settings.translationEdition);
  const byAyah = new Map(translated.map((ayah) => [ayah.numberInSurah, ayah]));
  if (settings.sequential) {
    const merged: AudioTrack[] = [];
    queue.forEach((track) => {
      merged.push(track);
      const match = byAyah.get(track.ayahNumber);
      if (match) {
        merged.push(
          trackFor(match, chapterId, chapterName, 'translation', settings.translationEdition, settings.translationName),
        );
      }
    });
    return merged;
  }
  const extra = translated.map((ayah) =>
    trackFor(ayah, chapterId, chapterName, 'translation', settings.translationEdition, settings.translationName),
  );
  return [...queue, ...extra];
}

export async function buildSurahFileQueue(
  chapterId: number,
  chapterName: string,
  settings: AudioSettings,
): Promise<AudioTrack[]> {
  const reciters = await loadSurahReciters();
  const reciter = reciters.find((entry) => entry.id === settings.surahReciterId) || reciters[0];
  if (!reciter) throw new Error('The full-Surah reciter list is still loading. Try again in a moment.');
  const url = `${reciter.server}${String(chapterId).padStart(3, '0')}.mp3`;
  return [{
    id: `surah:${chapterId}:${reciter.id}`,
    title: `${chapterName} · full recitation`,
    subtitle: reciter.name,
    chapterId,
    chapterName,
    ayahNumber: 1,
    globalNumber: 0,
    kind: 'arabic',
    edition: `mp3quran-${reciter.id}`,
    performer: `${reciter.name} · ${reciter.rewaya || reciter.moshaf}`,
    uri: url,
  }];
}

/** A Surah kept on the device always wins: one verified local file beats a stream. */
export async function buildQueueForChapter(chapterId: number, chapterName: string, settings: AudioSettings): Promise<AudioTrack[]> {
  const edition = settings.reciterMode === 'surah' ? `mp3quran-${settings.surahReciterId ?? ''}` : settings.reciter;
  const local = await localAudioUri(chapterId, edition).catch(() => null);
  if (local) {
    return [{
      id: `local:${chapterId}:${edition}`,
      title: `${chapterName} · full recitation`,
      subtitle: 'Saved on this device',
      chapterId,
      chapterName,
      ayahNumber: 1,
      globalNumber: 0,
      kind: 'arabic',
      edition,
      performer: `${settings.reciterMode === 'surah' ? settings.surahReciterName || settings.reciterName : settings.reciterName} · saved on this device`,
      uri: local,
    }];
  }
  return settings.reciterMode === 'surah'
    ? buildSurahFileQueue(chapterId, chapterName, settings)
    : buildSurahQueue(chapterId, chapterName, settings);
}

/* -------------------------------------------------------------------- player */

let player: AudioPlayer | null = null;
let currentSource = '';
let state: AudioState = {
  queue: [],
  index: 0,
  track: null,
  playing: false,
  buffering: false,
  position: 0,
  duration: 0,
  repeat: DEFAULT_AUDIO_SETTINGS.repeat,
  rate: DEFAULT_AUDIO_SETTINGS.rate,
  error: null,
};

const listeners = new Set<(next: AudioState) => void>();
let settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };

function emit(patch: Partial<AudioState>) {
  state = { ...state, ...patch, track: patch.queue ? (patch.queue[patch.index ?? state.index] ?? null) : state.track };
  listeners.forEach((listener) => listener(state));
}

async function ensurePlayer(): Promise<AudioPlayer> {
  if (player) return player;
  if (Platform.OS !== 'web') {
    try {
      await setAudioModeAsync({ playsInSilentMode: true, shouldRouteThroughEarpiece: false });
    } catch {
      /* audio mode is best-effort on device */
    }
  }
  player = createAudioPlayer(null, { updateInterval: 500 });
  player.addListener('playbackStatusUpdate', (status) => {
    const track = state.track;
    if (status.didJustFinish && track) {
      const isLast = state.index >= state.queue.length - 1;
      if (state.repeat === 'one') {
        player?.seekTo(0);
        player?.play();
        return;
      }
      if (isLast && state.repeat === 'none') {
        emit({ playing: false, position: 0 });
        return;
      }
      goToIndex((state.index + 1) % Math.max(1, state.queue.length), true);
      return;
    }
    emit({
      playing: status.playing,
      position: status.currentTime,
      duration: status.duration,
      buffering: status.isBuffering,
    });
    if (track && Platform.OS !== 'web') {
      try {
        player?.updateLockScreenMetadata({ title: track.title, artist: track.performer });
      } catch {
        /* lock-screen artwork is unavailable until the track metadata is ready */
      }
    }
    if (track) void rememberSession(status.currentTime);
  });
  return player;
}

function applySource(track: AudioTrack | null, autoplay: boolean) {
  const nextPlayer = player;
  if (!nextPlayer || !track) return;
  if (currentSource !== track.uri) {
    currentSource = track.uri;
    nextPlayer.replace(track.uri);
  }
  try {
    nextPlayer.setPlaybackRate(state.rate);
  } catch {
    /* rate control is unavailable on some browsers */
  }
  if (autoplay) nextPlayer.play();
}

async function goToIndex(index: number, autoplay: boolean) {
  if (!state.queue.length) return;
  const safe = Math.max(0, Math.min(index, state.queue.length - 1));
  const track = state.queue[safe];
  const instance = await ensurePlayer();
  emit({ index: safe, track, position: 0, duration: 0, buffering: true, error: null });
  applySource(track, autoplay);
  if (Platform.OS !== 'web') {
    try {
      instance.setActiveForLockScreen(true, { title: track.title, artist: track.performer });
    } catch {
      /* lock-screen controls are unavailable on web and unsupported platforms */
    }
  }
  void rememberRecent(track);
  void rememberSession(0);
}

export async function playQueue(queue: AudioTrack[], startIndex = 0) {
  if (!queue.length) return;
  await ensurePlayer();
  emit({ queue, index: Math.max(0, Math.min(startIndex, queue.length - 1)), error: null });
  await goToIndex(Math.max(0, Math.min(startIndex, queue.length - 1)), true);
}

export async function playTrack(track: AudioTrack) {
  await playQueue([track], 0);
}

export async function resume() {
  const instance = await ensurePlayer();
  if (!state.track) return;
  instance.play();
}

export async function pause() {
  player?.pause();
  emit({ playing: false });
}

export async function togglePlayback() {
  if (!state.track) return;
  if (state.playing) await pause();
  else await resume();
}

export async function nextTrack() {
  if (!state.queue.length) return;
  await goToIndex((state.index + 1) % state.queue.length, true);
}

export async function previousTrack() {
  if (!state.queue.length) return;
  const instance = player;
  if (instance && (state.position > 3 || state.index === 0)) {
    await instance.seekTo(0);
    emit({ position: 0 });
    return;
  }
  await goToIndex(Math.max(0, state.index - 1), true);
}

export async function seekTo(seconds: number) {
  const instance = await ensurePlayer();
  const target = Math.max(0, seconds);
  await instance.seekTo(target);
  emit({ position: target });
}

export async function stopPlayback() {
  player?.pause();
  if (player) await player.seekTo(0);
  emit({ playing: false, position: 0 });
}

export async function clearQueue() {
  await stopPlayback();
  emit({ queue: [], index: 0, track: null, duration: 0 });
  currentSource = '';
  await AsyncStorage.removeItem(KEYS.session).catch(() => undefined);
}

export function enqueueTrack(track: AudioTrack, position: 'next' | 'end' = 'end') {
  const queue = [...state.queue];
  const insertAt = position === 'next' ? state.index + 1 : queue.length;
  queue.splice(insertAt, 0, track);
  emit({ queue, index: state.track ? state.index : 0, track: state.track ?? null });
}

export function removeFromQueue(index: number) {
  if (index < 0 || index >= state.queue.length) return;
  const queue = state.queue.filter((_, position) => position !== index);
  if (!queue.length) {
    void clearQueue();
    return;
  }
  if (index === state.index) {
    const nextIndex = Math.min(index, queue.length - 1);
    emit({ queue, index: nextIndex, track: queue[nextIndex] });
    applySource(queue[nextIndex], state.playing);
    return;
  }
  emit({ queue, index: index < state.index ? state.index - 1 : state.index });
}

export async function selectQueueItem(index: number) {
  await goToIndex(index, true);
}

export function setRepeatMode(mode: RepeatMode) {
  emit({ repeat: mode });
  void saveAudioSettings({ repeat: mode });
}

export async function setPlaybackRate(rate: number) {
  try {
    player?.setPlaybackRate(rate);
  } catch {
    /* rate control is unavailable on some browsers */
  }
  emit({ rate });
  void saveAudioSettings({ rate });
}

export function getAudioState() {
  return state;
}

export function subscribeAudio(listener: (next: AudioState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAudio(): AudioState {
  const [value, setValue] = useState<AudioState>(state);
  useEffect(() => {
    const unsubscribe = subscribeAudio(setValue);
    return () => {
      unsubscribe();
    };
  }, []);
  return value;
}

/* ---------------------------------------------------------------- persistence */

export async function loadAudioSettings(): Promise<AudioSettings> {
  settings = await readJson<AudioSettings>(KEYS.settings, DEFAULT_AUDIO_SETTINGS);
  emit({ repeat: settings.repeat, rate: settings.rate });
  return settings;
}

export function getAudioSettings() {
  return settings;
}

export async function saveAudioSettings(patch: Partial<AudioSettings>) {
  settings = { ...settings, ...patch };
  await writeJson(KEYS.settings, settings);
  return settings;
}

export async function loadRecentPlays(): Promise<RecentPlay[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(KEYS.recent)) || '[]') as RecentPlay[];
  } catch {
    return [];
  }
}

async function rememberRecent(track: AudioTrack) {
  const recent = await loadRecentPlays();
  const entry: RecentPlay = {
    chapterId: track.chapterId,
    chapterName: track.chapterName,
    ayahNumber: track.ayahNumber,
    edition: track.edition,
    performer: track.performer,
    at: Date.now(),
  };
  const next = [entry, ...recent.filter((item) => !(item.chapterId === entry.chapterId && item.edition === entry.edition))];
  await writeJson(KEYS.recent, next.slice(0, RECENT_LIMIT));
}

export async function clearRecentPlays() {
  await AsyncStorage.removeItem(KEYS.recent).catch(() => undefined);
}

export async function loadPlaylists(): Promise<Playlist[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(KEYS.playlists)) || '[]') as Playlist[];
  } catch {
    return [];
  }
}

export async function savePlaylist(name: string, tracks: AudioTrack[]): Promise<Playlist[]> {
  const playlists = await loadPlaylists();
  const entry: Playlist = {
    id: `pl-${Date.now()}`,
    name: name.trim() || `Playlist ${playlists.length + 1}`,
    createdAt: Date.now(),
    tracks: tracks.slice(0, PLAYLIST_TRACK_LIMIT),
  };
  const next = [entry, ...playlists].slice(0, PLAYLIST_LIMIT);
  await writeJson(KEYS.playlists, next);
  return next;
}

export async function deletePlaylist(id: string): Promise<Playlist[]> {
  const next = (await loadPlaylists()).filter((playlist) => playlist.id !== id);
  await writeJson(KEYS.playlists, next);
  return next;
}

export async function loadAudioSession(): Promise<AudioSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.session);
    return raw ? (JSON.parse(raw) as AudioSession) : null;
  } catch {
    return null;
  }
}

let lastSessionWrite = 0;
async function rememberSession(position: number) {
  const track = state.track;
  if (!track) return;
  const now = Date.now();
  if (now - lastSessionWrite < 4000) return;
  lastSessionWrite = now;
  const session: AudioSession = {
    chapterId: track.chapterId,
    chapterName: track.chapterName,
    reciterMode: settings.reciterMode,
    surahReciterId: settings.surahReciterId,
    edition: track.kind === 'arabic' ? track.edition : settings.reciter,
    translationEdition: settings.translationEdition,
    sequential: settings.sequential,
    index: state.index,
    position,
    savedAt: now,
  };
  await writeJson(KEYS.session, session);
}

export async function clearAudioSession() {
  await AsyncStorage.removeItem(KEYS.session).catch(() => undefined);
}

export function formatClock(seconds: number) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(safe % 60).padStart(2, '0')}`;
}

/* The recitation catalogue carries names in Latin script only, so the Arabic
   names are kept here and shown when the app is in Arabic. */
const RECITER_AR: Record<string, string> = {
  'Abdul Basit': 'عبد الباسط عبد الصمد',
  'Abdul Samad': 'عبد الصمد',
  'Abdullah Basfar': 'عبد الله بصفر',
  'Abdurrahmaan As-Sudais': 'عبد الرحمن السديس',
  'Abu Bakr Ash-Shaatree': 'أبو بكر الشاطري',
  'Ahmed ibn Ali al-Ajamy': 'أحمد بن علي العجمي',
  'Alafasy': 'مشاري العفاسي',
  'Ayman Sowaid': 'أيمن سويد',
  'Hani Rifai': 'هاني الرفاعي',
  'Hudhaify': 'علي الحذيفي',
  'Husary': 'محمود خليل الحصري',
  'Husary (Mujawwad)': 'محمود خليل الحصري (مجوّد)',
  'Ibrahim Akhdar': 'إبراهيم الأخضر',
  'Maher Al Muaiqly': 'ماهر المعيقلي',
  'Minshawi': 'محمد صديق المنشاوي',
  'Minshawy (Mujawwad)': 'محمد صديق المنشاوي (مجوّد)',
  'Muhammad Ayyoub': 'محمد أيوب',
  'Muhammad Jibreel': 'محمد جبريل',
  'Parhizgar': 'شهريار برهيزغار',
  'Saood bin Ibraaheem Ash-Shuraym': 'سعود بن إبراهيم الشريم',
};

export function reciterLabel(name: string, rtl: boolean): string {
  if (!rtl) return name;
  return RECITER_AR[name] ?? name;
}
