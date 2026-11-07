import { BRAND } from '../design/brand';
import type { Ambience } from '../services/ambience';

/**
 * The colours each effect is allowed to use, in the light theme and the
 * dark one.
 *
 * Two rules hold across both of them.
 *
 * Every colour is a brand colour. No novelty pinks, no Christmas red and
 * green, nothing that would make the app look like somebody else's product
 * for a fortnight. The brand is ten colours and they are enough.
 *
 * And each effect has its own list for each theme, because a colour that
 * sings on Pearl disappears on Midnight Ink. Bronze is the clearest case:
 * it is the darkest colour in the brand, it is beautiful on Pearl, and on
 * Midnight Ink it is nearly invisible, so it appears in the light sets and
 * is left out of the dark ones.
 */

export const PALETTES: Record<Ambience, { onLight: string[]; onDark: string[] }> = {
  confetti: {
    onLight: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.bronze, BRAND.royalIndigo, BRAND.violet, BRAND.lavender],
    onDark: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.mist, BRAND.pearl, BRAND.lavender],
  },
  ramadan: {
    onLight: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.bronze],
    onDark: [BRAND.radiantGold, BRAND.antiqueGold, BRAND.pearl],
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
