import type { AudioEdition } from './api';
import type { IslamicEdition } from './islamicDataApi';
import { LANGUAGE_NAMES } from './languageFlags';

// Use the shipped, playable catalogue, including each voice's real bitrate.
// Text catalogue entries are not evidence that a recording exists.
const AUDIO: AudioEdition[] = require('../data/audio-editions.json').editions;

/** Resolve a saved choice before a remote catalogue has loaded, including
 * Worker ids, older dotted ids and display-language names. */
export function translationLanguageCode(
  identifier = '',
  language = '',
  editions: readonly Pick<IslamicEdition, 'id' | 'language'>[] = [],
): string {
  const fromCatalogue = editions.find((entry) => entry.id === identifier)?.language;
  if (fromCatalogue) return fromCatalogue.trim().toLowerCase();
  const id = identifier.trim().toLowerCase();
  const worker = /^(?:tr|tafsir|translit)_([a-z]{2,3})_/.exec(id);
  if (worker) return worker[1];
  const dotted = /^([a-z]{2,3})\./.exec(id);
  if (dotted) return dotted[1];
  const label = language.trim().toLowerCase();
  if (/^[a-z]{2,3}$/.test(label)) return label;
  return Object.entries(LANGUAGE_NAMES).find(([, name]) => name.toLowerCase() === label)?.[0] || '';
}

/** Match only a real translation recording; Arabic reciters are separate.
 * English is the fallback, not a fabricated voice for an unsupported language.
 * `fallbackToEnglish=false` is used when describing actual availability. */
export function translationAudioForLanguage(language: string, fallbackToEnglish = true): AudioEdition | null {
  const code = language.trim().toLowerCase();
  const translations = AUDIO.filter((entry) => entry.language !== 'ar');
  const pool = translations.filter((entry) => entry.language.toLowerCase() === code);
  const match = pool.find((entry) => entry.type === 'versebyverse') || pool[0];
  return match || (fallbackToEnglish ? translations.find((entry) => entry.language === 'en') || null : null);
}
