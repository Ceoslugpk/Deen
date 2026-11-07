import { BRAND } from '../design/brand';
import type { Ambience } from '../services/ambience';

/**
 * The colours each effect is allowed to use, in the light theme and the
 * dark one.
 *
 * Two rules hold across all of them.
 *
 * Every colour is a brand colour. No novelty pinks, no Christmas red and
 * green, nothing that would make the app look like somebody else's product
 * for a fortnight. The brand is ten colours and they are enough — the
 * autumn leaves in antique gold and bronze are the proof, because they look
 * like they were always meant to be there.
 *
 * And each effect has its own list for each theme, because a colour that
 * sings on Pearl disappears on Midnight Ink. Bronze is the clearest case:
 * it is the darkest colour in the brand, it is beautiful on Pearl, and on
 * Midnight Ink it is nearly invisible, so it appears in the light sets and
 * is left out of the dark ones. Snow has the same problem inverted — white
 * is the only sensible colour for it, and on Pearl it needs the pale
 * lavender of Mist alongside it or it simply cannot be seen.
 */

const WHITE = '#FFFFFF';

export const PALETTES: Record<Ambience, { onLight: string[]; onDark: string[] }> = {
  confetti: {
    onLight: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.bronze, BRAND.royalIndigo, BRAND.violet, BRAND.lavender],
    onDark: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.mist, BRAND.pearl, BRAND.lavender],
  },
  ramadan: {
    onLight: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.bronze],
    onDark: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.pearl],
  },
  snow: {
    onLight: [WHITE, BRAND.mist],
    onDark: [BRAND.pearl, BRAND.mist],
  },
  petals: {
    onLight: [WHITE, BRAND.mist, BRAND.lavender],
    onDark: [BRAND.pearl, BRAND.mist, BRAND.lavender],
  },
  motes: {
    onLight: [BRAND.radiantGold, BRAND.antiqueGold],
    onDark: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.pearl],
  },
  leaves: {
    onLight: [BRAND.antiqueGold, BRAND.bronze, BRAND.radiantGold],
    onDark: [BRAND.antiqueGold, BRAND.radiantGold, BRAND.bronze],
  },
};

export function paletteFor(kind: Ambience, dark: boolean): string[] {
  const set = PALETTES[kind];
  return dark ? set.onDark : set.onLight;
}

export function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
