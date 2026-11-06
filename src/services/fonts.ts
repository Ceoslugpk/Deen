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

/**
 * Accepts either and always returns a family name.
 *
 * A share card is handed whichever of the two the caller happens to have:
 * the reader's preference is an id like 'hafs', while the Quran screens
 * resolve it first and pass 'KFGQPCUthmanicHafs'. An id is not a family
 * name, so a card that was given one falls back to a default face and the
 * reader's choice quietly fails to appear on the card they send.
 *
 * Resolving here rather than at each call site means a card cannot get this
 * wrong, whichever way it is called.
 */
export function resolveArabicFamily(value?: string | null): string {
  if (!value) return quranFontFamily(DEFAULT_QURAN_FONT);
  const byId = QURAN_FONTS.find((font) => font.id === value);
  if (byId) return byId.family;
  // Already a family name? Keep it, so a caller that resolved early still wins.
  const byFamily = QURAN_FONTS.find((font) => font.family === value);
  if (byFamily) return byFamily.family;
  return quranFontFamily(DEFAULT_QURAN_FONT);
}

/** The id a family name belongs to, or undefined if it is not one of ours. */
export function arabicFontIdFor(family: string): QuranFontId | undefined {
  return QURAN_FONTS.find((font) => font.family === family)?.id;
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

/**
 * The Latin face used for Vietnamese.
 *
 * The interface is set in DM Sans, which ships only the `latin` and
 * `latin-ext` subsets — it has no Vietnamese at all. It is missing the horned
 * vowels ơ and ư and roughly half the tone-marked vowels, so Vietnamese in DM
 * Sans renders as a mixture: most letters come from DM Sans and the rest fall
 * back to whatever the system font happens to be, often inside a single word.
 * Roughly three words in five are affected.
 *
 * That is different from the scripts this app already handles. DM Sans has no
 * Cyrillic, Arabic or CJK either, but a language written in those falls back
 * entirely and so renders in one consistent face. Vietnamese falls back
 * partially, which is the one case that looks wrong.
 *
 * Be Vietnam Pro is used instead whenever the interface is in Vietnamese: full
 * Vietnamese coverage, and a superset of DM Sans for every other Latin
 * language this app ships. It is fetched the first time Vietnamese is chosen
 * rather than at launch, so nobody who never reads Vietnamese pays for it.
 */
const VIETNAMESE_FACE_ASSETS: Record<string, any> = {
  DMSans_400Regular: require('../../assets/fonts/BeVietnamPro-Regular.ttf'),
  DMSans_500Medium: require('../../assets/fonts/BeVietnamPro-Medium.ttf'),
  DMSans_600SemiBold: require('../../assets/fonts/BeVietnamPro-SemiBold.ttf'),
  DMSans_700Bold: require('../../assets/fonts/BeVietnamPro-Bold.ttf'),
};

/** DM Sans family name to its Be Vietnam Pro counterpart, by weight. */
export const VIETNAMESE_FACE_MAP: Record<string, string> = {
  DMSans_400Regular: 'BeVietnamPro_400Regular',
  DMSans_500Medium: 'BeVietnamPro_500Medium',
  DMSans_600SemiBold: 'BeVietnamPro_600SemiBold',
  DMSans_700Bold: 'BeVietnamPro_700Bold',
};

/** The DM Sans families, i.e. every family the Vietnamese face stands in for. */
export const LATIN_UI_FACES = Object.keys(VIETNAMESE_FACE_MAP);

let vietnameseReady = false;
let vietnameseTask: Promise<boolean> | null = null;

/**
 * Load the Vietnamese face once, and report whether it can be used.
 *
 * Resolves false on a device that cannot read the assets, in which case the
 * app stays on DM Sans rather than pointing at a family that was never
 * registered — an unregistered family name renders as no text at all, which
 * is far worse than the fallback it was meant to replace.
 */
export async function ensureVietnameseFont(): Promise<boolean> {
  if (vietnameseReady) return true;
  if (vietnameseTask) return vietnameseTask;
  const request: Record<string, any> = {};
  LATIN_UI_FACES.forEach((family) => {
    request[VIETNAMESE_FACE_MAP[family]] = VIETNAMESE_FACE_ASSETS[family];
  });
  vietnameseTask = Font.loadAsync(request)
    .then(() => {
      vietnameseReady = true;
      vietnameseTask = null;
      return true;
    })
    .catch(() => {
      vietnameseTask = null;
      return false;
    });
  return vietnameseTask;
}

/** Whether the Vietnamese face is already in memory, without loading it. */
export function vietnameseFontReady(): boolean {
  return vietnameseReady;
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
