import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

/**
 * Arabic typography.
 *
 * Quran text and Arabic interface text are different jobs. For recitation and
 * reading, the Mushaf script (KFGQPC Uthmanic Script Hafs, the King Fahd Complex
 * hand) is the default, with three more book hands available for anyone who reads
 * more comfortably in them. For interface Arabic — buttons, Surah names, headings —
 * IBM Plex Sans Arabic carries small sizes far better than a Quranic face.
 *
 * The heavier Quran faces are fetched the first time someone picks them, so the
 * app opens on the default face without paying for all five up front.
 */

export type QuranFontId = 'hafs' | 'scheherazade' | 'amiri-quran' | 'naskh' | 'kufi';

export const QURAN_FONTS: { id: QuranFontId; label: string; short: string; detail: string; family: string }[] = [
  { id: 'hafs', label: 'Madinah Mushaf', short: 'Mushaf', detail: 'The printed Mushaf hand, with full Quranic marks', family: 'KFGQPCUthmanicHafs' },
  { id: 'scheherazade', label: 'Scheherazade New', short: 'Scheherazade', detail: 'An open Naskh with generous, clear diacritics', family: 'ScheherazadeNew-Regular' },
  { id: 'amiri-quran', label: 'Amiri Quran', short: 'Amiri', detail: 'A classical book hand cut for Quranic text', family: 'AmiriQuran-Regular' },
  { id: 'naskh', label: 'Noto Naskh', short: 'Naskh', detail: 'A plain, familiar Naskh', family: 'NotoNaskhArabic_400Regular' },
  { id: 'kufi', label: 'Noto Kufi', short: 'Kufi', detail: 'A geometric Kufi for a plainer page', family: 'NotoKufiArabic-Regular' },
];

export const ARABIC_UI = 'IBMPlexSansArabic_400Regular';
export const ARABIC_UI_SEMIBOLD = 'IBMPlexSansArabic_600SemiBold';
export const DEFAULT_QURAN_FONT: QuranFontId = 'hafs';

const ASSETS: Partial<Record<QuranFontId, any>> = {
  hafs: require('../../assets/fonts/KFGQPCUthmanicHafs.ttf'),
  scheherazade: require('../../assets/fonts/ScheherazadeNew-Regular.ttf'),
  'amiri-quran': require('../../assets/fonts/AmiriQuran-Regular.ttf'),
  kufi: require('../../assets/fonts/NotoKufiArabic-Regular.ttf'),
};

/** Faces already present at launch; the rest are fetched on demand. */
const ready = new Set<QuranFontId>(['hafs', 'naskh']);
const inFlight = new Map<QuranFontId, Promise<boolean>>();

export function quranFontFamily(id?: QuranFontId | string) {
  const match = QURAN_FONTS.find((font) => font.id === id);
  return match ? match.family : QURAN_FONTS[0].family;
}


export async function ensureQuranFont(id: QuranFontId = DEFAULT_QURAN_FONT): Promise<boolean> {
  if (ready.has(id)) return true;
  const asset = ASSETS[id];
  if (!asset) return false;
  const running = inFlight.get(id);
  if (running) return running;
  const task = Font.loadAsync({ [quranFontFamily(id)]: asset })
    .then(() => {
      ready.add(id);
      inFlight.delete(id);
      return true;
    })
    .catch(() => {
      inFlight.delete(id);
      return false;
    });
  inFlight.set(id, task);
  return task;
}

export function useQuranFont(id?: QuranFontId | string): string {
  const resolved = (id as QuranFontId) || DEFAULT_QURAN_FONT;
  const [family, setFamily] = useState(() => (ready.has(resolved) ? quranFontFamily(resolved) : quranFontFamily(DEFAULT_QURAN_FONT)));
  useEffect(() => {
    let alive = true;
    if (ready.has(resolved)) {
      setFamily(quranFontFamily(resolved));
      return;
    }
    void ensureQuranFont(resolved).then((ok) => {
      if (alive && ok) setFamily(quranFontFamily(resolved));
    });
    return () => {
      alive = false;
    };
  }, [resolved]);
  return family;
}
