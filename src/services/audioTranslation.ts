import { ayahAudioUrl } from './api';
import { translationAudioEdition } from './translationPreferences';
import type { AudioSettings, AudioTrack } from './audioService';

export type TranslationQueue = { queue: AudioTrack[]; origins: number[] };
const verseKey = (track: AudioTrack) => `${track.chapterId}:${track.ayahNumber}`;

/** Change the accompaniment, never the Arabic reciter, playlist order or Quran text.
 * URLs come from the same verified catalogue/bitrate resolver as ordinary playback.
 * No catalogue/text request needs to finish before a new voice can be heard.
 * Whole-Surah files have no ayah timings and must not be treated as verse one. */
export function translatedQueue(queue: AudioTrack[], previous: AudioSettings, next: AudioSettings): TranslationQueue {
  const voice = translationAudioEdition(next.translationEdition);
  if (next.translationAudioEnabled && !voice) throw new Error('This translation audio is unavailable.');
  const translate = (track: AudioTrack): AudioTrack => ({
    ...track, id: `translation:${track.chapterId}:${track.ayahNumber}:${voice!.identifier}`,
    title: `${track.chapterName} · Translation ${track.ayahNumber}`,
    subtitle: voice!.englishName, kind: 'translation', edition: voice!.identifier, performer: voice!.englishName,
    uri: ayahAudioUrl(voice!.identifier, track.globalNumber), text: undefined,
  });
  const entries = queue.map((track, origin) => ({ track, origin }));
  if (!next.translationAudioEnabled) {
    const kept = entries.filter(entry => entry.track.kind !== 'translation');
    return { queue: kept.map(entry => entry.track), origins: kept.map(entry => entry.origin) };
  }

  // An existing translation queue (including a sample or saved playlist) keeps
  // its exact ordering on a voice-only change. Do not reintroduce removed ayahs.
  const hasTranslations = queue.some(track => track.kind === 'translation');
  if (hasTranslations && previous.translationAudioEnabled && previous.sequential === next.sequential) {
    return { queue: queue.map(track => track.kind === 'translation' && track.globalNumber > 0 ? translate(track) : track),
      origins: entries.map(entry => entry.origin) };
  }
  const arabic = entries.filter(entry => entry.track.kind === 'arabic');
  if (!arabic.some(entry => entry.track.globalNumber > 0)) {
    // A translation-only sample may still be switched. An untimed full-Surah
    // recording is left completely alone; selecting a voice is a future setting.
    return { queue: queue.map(track => track.kind === 'translation' && track.globalNumber > 0 ? translate(track) : track),
      origins: entries.map(entry => entry.origin) };
  }

  const existing = new Map<string, typeof entries>();
  for (const entry of entries.filter(entry => entry.track.kind === 'translation')) {
    const key = verseKey(entry.track);
    existing.set(key, [...(existing.get(key) || []), entry]);
  }
  const output: typeof entries = [], extras: typeof entries = [];
  for (const entry of arabic) {
    output.push(entry);
    if (entry.track.globalNumber <= 0) continue;
    const original = existing.get(verseKey(entry.track))?.shift();
    const translated = { track: translate(entry.track), origin: original?.origin ?? -1 };
    (next.sequential ? output : extras).push(translated);
  }
  // Keep standalone spoken items in mixed playlists rather than dropping them.
  for (const list of existing.values()) for (const entry of list) {
    extras.push({ track: entry.track.globalNumber > 0 ? translate(entry.track) : entry.track, origin: entry.origin });
  }
  output.push(...extras);
  return { queue: output.map(entry => entry.track), origins: output.map(entry => entry.origin) };
}
