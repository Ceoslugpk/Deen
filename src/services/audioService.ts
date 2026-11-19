import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readText, writeText } from './storage';
import { translationAudioForLanguage } from './translationPreferences';
import { translatedQueue } from './audioTranslation';
import { engine, type EngineStatus } from './audioEngine';
import { AudioEdition, getAudioEditions, getSurahAudio, getSurahReciters, SurahAudioAyah, SurahReciter } from './api';
import { getCachedJson, setCachedJson } from './contentCache';
import { localAudioUri } from './downloadService';
import { surahName } from '../content/surahNames';

/**
 * Phase 3 — Quran audio foundation.
 *
 * Audio sources are live and attributed:
 *   - Reciter + translation-audio catalogue: bundled with the app, every
 *     entry checked against the CDN before shipping, so a reciter is never
 *     offered whose audio will not play.
 *   - Audio files themselves: Islamic Network CDN (cdn.islamic.network),
 *     addressed by the ayah's position in the whole book.
 * No placeholder URLs are generated: a track's URL is built from the reciter
 * and the ayah number, and both are known before the track exists.
 */

export type AudioTrackKind = 'arabic' | 'translation';
/**
 * What plays again, and how many times.
 *
 * 'one' repeats the single ayah under the finger. 'range' repeats a stretch —
 * a passage being committed to memory. 'all' repeats the surah. 'none' plays
 * straight through and stops.
 *
 * The distinction that matters is between a range and a surah: somebody
 * learning a passage does not want the whole surah, and making them sit
 * through it to get back to their ten verses is what sends them elsewhere.
 */
export type RepeatMode = 'none' | 'one' | 'range' | 'all';

/**
 * Zero means without end.
 *
 * Repeat-forever is the right default for memorisation — you stop when you
 * know it, not when a counter runs out — but some people want the passage
 * three times and then to move on, so the count is theirs to set.
 */
export const REPEAT_FOREVER = 0;

export const REPEAT_COUNT_CHOICES = [0, 2, 3, 5, 10];

/** Slowest and fastest the recitation can be played. */
export const MIN_RATE = 0.5;
export const MAX_RATE = 2;
/**
 * The steps offered between the two.
 * Fine enough to find a comfortable pace, coarse enough to hit one by finger.
 */
export const RATE_STEPS = [0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];

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
  /**
   * The reading language the spoken translation was last matched to.
   *
   * Without it the sync runs again on every launch and on every re-render
   * that touches preferences, and a person who deliberately chose a
   * different voice in the player would find it silently put back.
   */
  translationSyncedLanguage: string | null;
  /**
   * Set when the sync switched the spoken translation off because nothing is
   * spoken in the new language, and cleared when a language with a voice
   * comes back.
   *
   * Without it, one move to a language with no audio would leave the switch
   * off for good: the next language would find it off and take that for a
   * preference, when in fact nobody had asked for it. Now only a mute this
   * app performed is lifted, and a mute the person chose is left alone.
   */
  translationAutoMuted: boolean;
  sequential: boolean;
  repeat: RepeatMode;
  rate: number;
  /* ---- repetition ---- */
  /** How many times the repeated unit plays. Zero is without end. */
  repeatCount: number;
  /** The stretch repeated in 'range' mode, as ayah numbers, both ends included. */
  repeatRangeStart: number;
  repeatRangeEnd: number;
  /** Carry on into the next surah when this one ends, rather than stopping. */
  autoNextSurah: boolean;
  /* ---- volume ---- */
  /**
   * Separate levels for the recitation and for the translation.
   *
   * They are not listened to the same way. The Arabic is the thing being
   * recited and is usually wanted forward; the translation is there to be
   * understood and is often wanted quieter underneath. One volume for both
   * means either straining to hear the meaning or having it fight the
   * recitation.
   */
  arabicVolume: number;
  translationVolume: number;
  /* ---- interruptions ---- */
  /** Offer to pick up where a session was left when the app next opens. */
  resumeOnStart: boolean;
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
  translationAudioEnabled?: boolean;
  sequential: boolean;
  trackKind?: AudioTrackKind;
  ayahNumber?: number;
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
  translationSyncedLanguage: null,
  translationAutoMuted: false,
  sequential: true,
  repeat: 'all',
  rate: 1,
  repeatCount: REPEAT_FOREVER,
  repeatRangeStart: 1,
  repeatRangeEnd: 7,
  autoNextSurah: false,
  arabicVolume: 1,
  translationVolume: 0.85,
  resumeOnStart: true,
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
    const value = await readText(key);
    return value ? ({ ...fallback, ...(JSON.parse(value) as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await writeText(key, JSON.stringify(value));
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
    await setCachedJson('audio-meta', 'editions-v1', { savedAt: Date.now(), editions });
  }
  const arabic = editions.filter(
    (edition) => edition.language === 'ar' && (edition.type === 'versebyverse' || edition.type === 'translation'),
  );
  const translation = editions.filter((edition) => edition.language !== 'ar');
  return { arabic: arabic.length ? arabic : editions.filter((edition) => edition.language === 'ar'), translation };
}

/**
 * The spoken translation that belongs to a reading language, if there is one.
 *
 * Verse-by-verse wins over a whole-Surah file, because a verse-by-verse
 * translation can be interleaved with the Arabic ayah by ayah, which is the
 * only way the two are any use together. A single Surah-long file would have
 * to be played after the recitation instead of alongside it.
 */
export function audioEditionForLanguage(
  editions: AudioEdition[],
  language: string,
): AudioEdition | null {
  const want = (language || '').toLowerCase();
  if (!want) return null;
  const pool = editions.filter((edition) => (edition.language || '').toLowerCase() === want);
  if (!pool.length) return null;
  return pool.find((edition) => edition.type === 'versebyverse') || pool[0];
}

/** Select a real recording in the text-translation language, or English
 * when none exists. This works offline from the verified shipped catalogue.
 * Keep the person's audio switch, volumes and reciter. Only undo a mute that
 * the old no-audio policy applied automatically, never an explicit mute. */
export async function syncAudioTranslationToLanguage(language: string): Promise<AudioSettings> {
  const revision = ++translationSyncRevision;
  const code = (language || '').trim().toLowerCase();
  if (!code) return settings;
  if (!settingsLoaded || loadingSettings) await loadAudioSettings();
  if (revision !== translationSyncRevision) return settings;
  if (settings.translationSyncedLanguage === code && !settings.translationAutoMuted) return settings;

  const match = translationAudioForLanguage(code);
  if (!match) return settings;
  return saveAudioSettings({
    translationSyncedLanguage: code,
    translationEdition: match.identifier,
    translationName: match.englishName,
    translationAutoMuted: false,
    ...(settings.translationAutoMuted ? { translationAudioEnabled: true } : {}),
  });
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

  /**
   * The spoken translation is an accompaniment, so a voice that turns out to
   * have no audio for this Surah must not take the recitation down with it.
   *
   * The default (`en.walk`) is a real shipped 192 kbps recording. A provider
   * failure or an older saved text-only identifier can still fail to load,
   * so the Arabic remains playable rather than taking the whole queue down.
   */
  const translated = await loadSurahAudio(chapterId, settings.translationEdition).catch(() => [] as SurahAudioAyah[]);
  if (!translated.length) return queue;
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
  /* The Worker hands back a template rather than a folder, because a
     recording can live under any path shape it likes. */
  const url = reciter.urlTemplate.replace('{surahPadded3}', String(chapterId).padStart(3, '0'));
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

/** Whether the transport has been bound to this service's status handler. */
let engineBound = false;
/** Queue identity includes every translation source, not just the first Arabic
 * edition and length: two languages otherwise looked like the same timeline. */
let loadedQueue: AudioTrack[] | null = null;
/** A user selection or close supersedes any older asynchronous restore/load. */
let playbackRevision = 0;
/** Last transport command wins, including rapid voice choices and pause/stop. */
let transportRevision = 0;
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
let settingsLoaded = false;
let loadingSettings: Promise<AudioSettings> | null = null;
let translationSyncRevision = 0;
const settingsListeners = new Set<(next: AudioSettings) => void>();
function emitSettings() { settingsListeners.forEach((listener) => listener(settings)); }

export function subscribeAudioSettings(listener: (next: AudioSettings) => void) {
  settingsListeners.add(listener);
  listener(settings);
  return () => { settingsListeners.delete(listener); };
}

function emit(patch: Partial<AudioState>) {
  // Advancing within a loaded queue changes its index, not the queue itself.
  // Always derive the current track from both, or subscribers keep the first
  // selected ayah even while the transport is already reciting the next one.
  const queue = patch.queue ?? state.queue, index = patch.index ?? state.index;
  state = { ...state, ...patch, track: queue[index] ?? null };
  listeners.forEach((listener) => listener(state));
}

/**
 * What the transport tells us.
 *
 * One handler for both transports, so the rules about what happens when an
 * ayah ends live in exactly one place no matter which of them is running.
 */
function handleEngineStatus(status: EngineStatus) {
  const track = state.track;
  if (status.error) {
    intendedPlaying = false;
    loadedQueue = null;
    clearResume();
    emit({ playing: false, buffering: false, error: track?.kind === 'translation'
      ? 'This translation audio is unavailable.' : 'Audio unavailable' });
    return;
  }

  /* An ayah finished. Which one is given, because what happens next depends
     on it — and the rules for that are kept pure in `nextIndexAfterFinish`. */
  if (status.endedIndex !== null) {
    const plan = nextIndexAfterFinish(state.queue, status.endedIndex, settings, timesPlayed);
    if (plan.advanceCount) timesPlayed += 1;

    if (plan.next !== null) {
      void goToIndex(plan.next, true);
      return;
    }

    /* Nothing left in this surah. Either carry on into the next one, or stop
       honestly rather than looping on silence. */
    resetRepeatProgress();
    const finished = state.queue[status.endedIndex];
    if (settings.autoNextSurah && finished && finished.chapterId < 114) {
      void playChapter(finished.chapterId + 1, true);
      return;
    }
    emit({ playing: false, position: 0 });
    return;
  }

  /* Something else took the audio away. Give it a moment to give it back,
     then carry on — up to a few tries, so a Bluetooth headset dropping out
     does not leave a recitation stalled for the rest of the surah. */
  if (intendedPlaying && !status.playing && !status.buffering) {
    scheduleResume();
  } else if (status.playing) {
    clearResume();
  }

  emit({
    playing: status.playing,
    position: status.position,
    duration: status.duration,
    buffering: status.buffering,
  });
  if (track) void rememberSession(status.position);
}

/** Bind once; loadQueue prepares the native transport with real sources. */
async function ensurePlayer(): Promise<void> {
  if (engineBound) return;
  engine.bind(handleEngineStatus);
  engineBound = true;
  // Do not call prepare() here: on Android that used to create an empty
  // playlist before the tapped ayah's queue was available.
}

/**
 * Where to go when the current track finishes.
 *
 * Kept as a pure function of the queue and the settings rather than folded
 * into the status listener, because the rules are what people get wrong —
 * off-by-one on a repeat count, or a range that silently excludes its last
 * verse — and a pure function can be reasoned about and tested on its own.
 *
 * Returns the index to move to, or null to stop.
 */
export function nextIndexAfterFinish(
  queue: AudioTrack[],
  index: number,
  settings: AudioSettings,
  timesPlayed: number,
): { next: number | null; advanceCount: boolean; completed: boolean } {
  if (!queue.length) return { next: null, advanceCount: false, completed: true };
  const last = queue.length - 1;
  const endless = (settings.repeatCount ?? REPEAT_FOREVER) === REPEAT_FOREVER;
  const done = endless ? false : timesPlayed + 1 >= (settings.repeatCount ?? 1);

  /* One ayah, over and over. */
  if (settings.repeat === 'one') {
    if (!done) return { next: index, advanceCount: true, completed: false };
    return { next: index >= last ? null : index + 1, advanceCount: false, completed: index >= last };
  }

  /* A stretch of ayahs, over and over. Both ends included, because somebody
     who asks for verses 1 to 7 means seven verses, not six. */
  if (settings.repeat === 'range') {
    const start = Math.max(1, Math.min(settings.repeatRangeStart, settings.repeatRangeEnd));
    const end = Math.max(settings.repeatRangeStart, settings.repeatRangeEnd);
    const inside = queue
      .map((track, position) => ({ track, position }))
      .filter(({ track }) => track.ayahNumber >= start && track.ayahNumber <= end)
      .map(({ position }) => position);

    if (inside.length) {
      const at = inside.indexOf(index);
      if (at > -1) {
        if (at < inside.length - 1) return { next: inside[at + 1], advanceCount: false, completed: false };
        // End of the stretch: go round again, or step out of it.
        if (!done) return { next: inside[0], advanceCount: true, completed: false };
        const after = inside[inside.length - 1] + 1;
        return { next: after > last ? null : after, advanceCount: false, completed: after > last };
      }
    }
    /* Not currently inside the stretch — fall through and play normally. */
  }

  /* The whole surah. */
  if (settings.repeat === 'all' && index >= last) {
    if (!done) return { next: 0, advanceCount: true, completed: false };
    return { next: null, advanceCount: false, completed: true };
  }

  if (index >= last) return { next: null, advanceCount: false, completed: true };
  return { next: index + 1, advanceCount: false, completed: false };
}

/** How many times the current repeat unit has played, kept across tracks. */
let timesPlayed = 0;

/**
 * Whether we meant to be playing.
 *
 * The transport reports that the player has stopped but not why, and there is
 * no interruption event to listen for. So the difference between "the person
 * pressed pause" and "a phone call took the audio away" is tracked here: if we
 * intended to be playing and the player reports it is not, without having
 * finished, something else stopped us — and once whatever it was has passed,
 * the recitation should carry on by itself rather than sitting there silently.
 */
let intendedPlaying = false;
let resumeAttempts = 0;
let resumeTimer: ReturnType<typeof setTimeout> | null = null;

const RESUME_GRACE_MS = 900;
const MAX_RESUME_ATTEMPTS = 3;

function scheduleResume() {
  if (resumeTimer) return;
  if (resumeAttempts >= MAX_RESUME_ATTEMPTS) return;
  resumeAttempts += 1;
  resumeTimer = setTimeout(() => {
    resumeTimer = null;
    if (!intendedPlaying || !state.track) return;
    void engine.play().catch(() => {
      /* nothing to resume into */
    });
  }, RESUME_GRACE_MS * resumeAttempts);
}

function clearResume() {
  if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
  resumeAttempts = 0;
}

function resetRepeatProgress() { timesPlayed = 0; }

/** The volume this track should play at, from the kind of track it is. */
function volumeFor(track: AudioTrack | null, settings: AudioSettings) {
  if (!track) return settings.arabicVolume ?? 1;
  return (track.kind === 'translation' ? settings.translationVolume : settings.arabicVolume) ?? 1;
}

/**
 * Hand the surah to the transport and begin at one ayah in it.
 *
 * The whole surah is handed over rather than one ayah at a time, because the
 * notification's next and previous have to work when the app is not running,
 * and then there is no app state to consult — only the queue living inside
 * the transport. The queue is only rebuilt when the surah has actually
 * changed; moving to another ayah within it is a skip.
 */
async function applySource(track: AudioTrack, autoplay: boolean, queue: AudioTrack[], index: number) {
  if (queue !== loadedQueue) {
    loadedQueue = queue;
    await engine.loadQueue(queue, index, autoplay, state.rate, volumeFor(track, settings));
    return;
  }
  await engine.skipTo(index, autoplay, state.rate, volumeFor(track, settings));
}

async function goToIndex(index: number, autoplay: boolean) {
  if (!state.queue.length) return;
  const revision = ++transportRevision, queue = state.queue;
  const safe = Math.max(0, Math.min(index, queue.length - 1));
  const track = queue[safe];
  await ensurePlayer();
  if (revision !== transportRevision || state.queue !== queue) return;
  emit({ index: safe, track, position: 0, duration: 0, buffering: autoplay, error: null });
  intendedPlaying = autoplay;
  await applySource(track, autoplay, queue, safe);
  if (revision !== transportRevision) return;
  void rememberRecent(track);
  void rememberSession(0);
}

/** Apply a voice/on-off change to the timeline already in the transport, not
 * just the next Surah. Pure URL remapping avoids a text/network round-trip.
 * Switching a translated ayah starts its NEW recording at zero: recordings
 * in different languages do not have interchangeable second offsets. */
async function updateActiveTranslation(previous: AudioSettings, next: AudioSettings): Promise<void> {
  if (!state.track || !state.queue.length) return;
  let replacement: ReturnType<typeof translatedQueue>;
  try { replacement = translatedQueue(state.queue, previous, next); }
  catch (error) {
    emit({ error: error instanceof Error ? error.message : 'This translation audio is unavailable.' });
    return;
  }
  const { queue, origins } = replacement;
  if (queue.length === state.queue.length && queue.every((track, i) => track === state.queue[i])) return;
  if (!queue.length) { await clearQueue(); return; }
  const oldTrack = state.track, oldIndex = state.index;
  let index = origins.indexOf(oldIndex), autoplay = intendedPlaying || state.playing;
  if (index < 0) {
    // The translation under the finger was switched off. Continue according
    // to the existing repeat/range/end policy, never leave a muted old voice.
    let before = -1;
    origins.forEach((origin, i) => { if (origin >= 0 && origin < oldIndex) before = i; });
    const plan = before < 0 ? { next: 0, advanceCount: false } : nextIndexAfterFinish(queue, before, next, timesPlayed);
    if (plan.advanceCount) timesPlayed += 1;
    index = plan.next ?? Math.max(0, before);
    if (plan.next === null) autoplay = false;
  }
  const track = queue[index], preserve = track.uri === oldTrack.uri;
  const revision = ++transportRevision;
  playbackRevision += 1;
  clearResume();
  // Call pause before the first await, so an old language cannot keep speaking
  // while its replacement is being prepared. Arabic itself is not interrupted.
  if (!preserve) void engine.pause().catch(() => undefined);
  intendedPlaying = autoplay;
  emit({ queue, index, position: preserve ? state.position : 0, duration: preserve ? state.duration : 0,
    playing: preserve && state.playing, buffering: !preserve && autoplay, error: null });
  try {
    await ensurePlayer();
    if (revision !== transportRevision) return;
    await engine.updateQueue(queue, index, autoplay, state.rate, volumeFor(track, settings));
    if (revision !== transportRevision || state.error) return;
    loadedQueue = queue;
    clearResume();
    void rememberRecent(track);
    void rememberSession(state.position, true);
  } catch {
    if (revision !== transportRevision) return;
    loadedQueue = null;
    intendedPlaying = false;
    clearResume();
    void engine.pause().catch(() => undefined);
    emit({ playing: false, buffering: false, error: 'This translation audio is unavailable.' });
  }
}

export async function playQueue(queue: AudioTrack[], startIndex = 0) {
  if (!queue.length) return;
  const revision = ++playbackRevision;
  await ensurePlayer();
  if (revision !== playbackRevision) return;
  /* A different surah is being loaded, so whatever the transport is holding
     is now stale and has to be replaced — otherwise the first ayah would be
     skipped because the key happened to match. */
  loadedQueue = null;
  emit({ queue, index: Math.max(0, Math.min(startIndex, queue.length - 1)), error: null });
  await goToIndex(Math.max(0, Math.min(startIndex, queue.length - 1)), true);
}

/**
 * A verse action always uses per-ayah tracks. A downloaded/full-Surah file
 * contains no timing map, so treating it as an ayah queue silently plays
 * verse 1. Keep whole-file playback in playChapter/buildQueueForChapter.
 */
export async function playVerse(chapterId: number, ayahNumber: number, chapterName = surahName(chapterId)) {
  const revision = ++playbackRevision;
  const queue = await buildSurahQueue(chapterId, chapterName, settings);
  if (revision !== playbackRevision) return;
  const index = queue.findIndex((track) => track.kind === 'arabic' && track.ayahNumber === ayahNumber);
  if (index < 0) throw new Error('This reciter has no audio for this Surah.');
  resetRepeatProgress();
  await playQueue(queue, index);
}

/**
 * Start a chapter from its number alone.
 *
 * Needed by auto-next, which knows only that surah 2 has ended and surah 3
 * should follow. The name is looked up from the chapter list rather than
 * passed in, because the caller genuinely does not have it.
 */
export async function playChapter(chapterId: number, autoplay = true) {
  if (chapterId < 1 || chapterId > 114) return;
  const name = surahName(chapterId);
  const queue = await buildQueueForChapter(chapterId, name, settings);
  resetRepeatProgress();
  await playQueue(queue, 0);
  if (!autoplay) await pause();
}

export async function playTrack(track: AudioTrack) {
  await playQueue([track], 0);
}

export async function resume() {
  const revision = ++transportRevision;
  await ensurePlayer();
  if (!state.track || revision !== transportRevision) return;
  intendedPlaying = true;
  clearResume();
  emit({ error: null });
  try {
    if (loadedQueue !== state.queue) {
      const queue = state.queue;
      await engine.updateQueue(queue, state.index, true, state.rate, volumeFor(state.track, settings));
      if (revision === transportRevision && !state.error) loadedQueue = queue;
    } else await engine.play();
  } catch {
    if (revision !== transportRevision) return;
    void engine.pause().catch(() => undefined);
    handleEngineStatus({ playing: false, buffering: false, position: state.position, duration: state.duration,
      endedIndex: null, error: 'Source unavailable' });
  }
}

export async function pause() {
  /* Said out loud, so an unasked-for stop is not mistaken for this. */
  const revision = ++transportRevision;
  intendedPlaying = false;
  clearResume();
  await engine.pause().catch(() => undefined);
  if (revision === transportRevision) emit({ playing: false, buffering: false });
}

export async function togglePlayback() {
  if (!state.track) return;
  if (state.playing) await pause();
  else await resume();
}

export async function nextTrack() {
  playbackRevision += 1;
  if (!state.queue.length) return;
  await goToIndex((state.index + 1) % state.queue.length, true);
}

export async function previousTrack() {
  playbackRevision += 1;
  if (!state.queue.length) return;
  /* A few seconds into an ayah, "previous" means the start of this one, not
     the ayah before it — otherwise going back is impossible once you have
     begun, which is when you are most likely to want it. */
  const position = await engine.getPosition().catch(() => state.position);
  if (position > 3 || state.index === 0) {
    await seekTo(0);
    return;
  }
  await goToIndex(Math.max(0, state.index - 1), true);
}

export async function seekTo(seconds: number) {
  await ensurePlayer();
  const target = Math.max(0, seconds);
  await engine.seek(target);
  emit({ position: target });
}

export async function stopPlayback() {
  playbackRevision += 1;
  const revision = ++transportRevision;
  intendedPlaying = false;
  clearResume();
  await engine.stop().catch(() => undefined);
  if (revision === transportRevision) emit({ playing: false, buffering: false, position: 0 });
}

export async function clearQueue() {
  const stopping = stopPlayback(), revision = transportRevision;
  await stopping;
  if (revision !== transportRevision) return;
  emit({ queue: [], index: 0, track: null, duration: 0 });
  loadedQueue = null;
  await engine.reset().catch(() => undefined);
  if (revision !== transportRevision) return;
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
    void goToIndex(nextIndex, state.playing);
    return;
  }
  emit({ queue, index: index < state.index ? state.index - 1 : state.index });
}

export async function selectQueueItem(index: number) {
  playbackRevision += 1;
  await goToIndex(index, true);
}

export async function setPlaybackRate(rate: number) {
  const safe = Math.max(MIN_RATE, Math.min(MAX_RATE, rate));
  try {
    await engine.setRate(safe);
  } catch {
    /* rate control is unavailable on some browsers */
  }
  emit({ rate: safe });
  void saveAudioSettings({ rate: safe });
}

/** Nudge the speed to the next step, up or down. */
export async function stepPlaybackRate(up: boolean) {
  const current = state.rate;
  const next = up
    ? RATE_STEPS.find((step) => step > current + 0.001)
    : [...RATE_STEPS].reverse().find((step) => step < current - 0.001);
  await setPlaybackRate(next ?? current);
  return state.rate;
}

export async function setRepeatMode(mode: RepeatMode, count?: number) {
  resetRepeatProgress();
  emit({ repeat: mode });
  void saveAudioSettings(count === undefined ? { repeat: mode } : { repeat: mode, repeatCount: count });
}

export async function setRepeatCount(count: number) {
  resetRepeatProgress();
  void saveAudioSettings({ repeatCount: Math.max(0, Math.round(count)) });
}

/** The verses repeated in 'range' mode. Ordered, so either end can be given first. */
export async function setRepeatRange(start: number, end: number) {
  resetRepeatProgress();
  const lo = Math.max(1, Math.min(start, end));
  const hi = Math.max(start, end);
  void saveAudioSettings({ repeatRangeStart: lo, repeatRangeEnd: hi, repeat: 'range' });
  emit({ repeat: 'range' });
}

export async function setAutoNextSurah(on: boolean) {
  void saveAudioSettings({ autoNextSurah: on });
}

/**
 * Set one of the two volumes.
 *
 * Applied immediately if the matching kind of track is the one playing, so
 * dragging the slider is audible as it happens rather than only on the next
 * ayah.
 */
export async function setVolume(kind: AudioTrackKind, value: number) {
  const safe = Math.max(0, Math.min(1, value));
  const patch = kind === 'translation' ? { translationVolume: safe } : { arabicVolume: safe };
  settings = { ...settings, ...patch };
  if (state.track && state.track.kind === kind) {
    try {
      await engine.setVolume(safe);
    } catch {
      /* volume is unavailable in some browsers until playback starts */
    }
  }
  void saveAudioSettings(patch);
}

export async function setResumeOnStart(on: boolean) {
  void saveAudioSettings({ resumeOnStart: on });
}


/** Read-only external-store snapshot; observing a reader never changes playback or persistence. */
export function getAudioSnapshot(): Readonly<AudioState> { return state; }

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
  if (!loadingSettings) {
    loadingSettings = readJson<AudioSettings>(KEYS.settings, DEFAULT_AUDIO_SETTINGS).then((saved) => {
      settings = saved;
      settingsLoaded = true;
      emitSettings();
      emit({ repeat: settings.repeat, rate: settings.rate });
      return settings;
    }).finally(() => { loadingSettings = null; });
  }
  return loadingSettings;
}

export function getAudioSettings() {
  return settings;
}

export async function saveAudioSettings(patch: Partial<AudioSettings>) {
  // A manual voice choice supersedes a sync waiting for hydration. Merely
  // toggling audio must not cancel matching the voice to the selected text.
  if (patch.translationEdition !== undefined) translationSyncRevision += 1;
  if (!settingsLoaded || loadingSettings) await loadAudioSettings();
  const previous = settings;
  settings = { ...settings, ...patch,
    ...(patch.translationAudioEnabled !== undefined && patch.translationAutoMuted === undefined
      ? { translationAutoMuted: false } : {}),
  };
  emitSettings();
  const next = settings;
  const translationChanged = previous.translationAudioEnabled !== next.translationAudioEnabled
    || previous.translationEdition !== next.translationEdition || previous.translationName !== next.translationName
    || previous.sequential !== next.sequential;
  // Playback never waits for disk. Both the center and player use this path,
  // including automatic language sync; UI-only selection cannot leave old audio.
  const playback = translationChanged ? updateActiveTranslation(previous, next) : Promise.resolve();
  await Promise.all([writeJson(KEYS.settings, next), playback]);
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
async function rememberSession(position: number, force = false) {
  const track = state.track;
  if (!track) return;
  const now = Date.now();
  if (!force && now - lastSessionWrite < 4000) return;
  lastSessionWrite = now;
  const session: AudioSession = {
    chapterId: track.chapterId,
    chapterName: track.chapterName,
    reciterMode: track.globalNumber > 0 ? 'verse' : settings.reciterMode,
    surahReciterId: settings.surahReciterId,
    edition: track.kind === 'arabic' ? track.edition : settings.reciter,
    translationEdition: settings.translationEdition,
    translationAudioEnabled: state.queue.some(item => item.kind === 'translation'),
    sequential: settings.sequential,
    trackKind: track.kind,
    ayahNumber: track.ayahNumber,
    index: state.index,
    position,
    savedAt: now,
  };
  await writeJson(KEYS.session, session);
}

/**
 * Put a saved session back, paused and in the right place.
 *
 * Called when the app opens. Deliberately does not start playing: a recitation
 * that begins by itself the moment the app is opened is alarming, and whoever
 * is opening it may be in a library. What it does instead is make the session
 * real again — the queue rebuilt, the position restored, the track in the
 * player — so the recitation is one press from continuing rather than needing
 * to be found again from scratch.
 *
 * The position is held until the track reports a duration, because seeking on
 * a source that has not loaded yet is silently ignored, and the recitation
 * would then begin from the start of the ayah instead of where it stopped.
 */
export async function restoreSavedSession(): Promise<boolean> {
  if (!settings.resumeOnStart) return false;
  const revision = playbackRevision;
  const session = await loadAudioSession();
  if (!session || state.queue.length || revision !== playbackRevision) return false;

  try {
    const queue = await buildQueueForChapter(session.chapterId, session.chapterName, {
      ...settings,
      reciterMode: session.reciterMode || 'verse',
      surahReciterId: session.surahReciterId ?? settings.surahReciterId,
      reciter: session.edition,
      translationEdition: session.translationEdition,
      sequential: session.sequential,
      translationAudioEnabled: session.translationAudioEnabled ?? session.sequential,
    });
    if (!queue.length || state.queue.length || revision !== playbackRevision) return false;

    await ensurePlayer();
    if (state.queue.length || revision !== playbackRevision) return false;
    const matching = session.trackKind && session.ayahNumber
      ? queue.findIndex(track => track.kind === session.trackKind && track.ayahNumber === session.ayahNumber) : -1;
    const index = matching >= 0 ? matching : Math.max(0, Math.min(session.index, queue.length - 1));
    emit({ queue, index, error: null });
    await goToIndex(index, false);

    if (session.position > 1) {
      const target = session.position;
      let attempts = 0;
      const trySeek = async (): Promise<void> => {
        if (attempts++ > 12 || revision !== playbackRevision || state.queue !== queue) return;
        /* The duration is not known until the file has been probed, and a
           seek issued before then is silently dropped — the recitation would
           start from the beginning of the ayah instead of where it was left.
           So wait for the transport to know how long the ayah is. */
        const duration = await engine.getDuration().catch(() => 0);
        if (revision !== playbackRevision || state.queue !== queue) return;
        if (!(duration > 0) && !(state.duration > 0)) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          return trySeek();
        }
        try {
          await seekTo(target);
        } catch {
          /* a seek that fails leaves the ayah at its start, which is survivable */
        }
      };
      void trySeek();
    }
    return true;
  } catch {
    return false;
  }
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
