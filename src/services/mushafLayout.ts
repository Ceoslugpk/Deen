import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * How big one page of the mushaf should be.
 *
 * A page keeps the proportions of the printed Madinah mushaf: 14.8 cm across
 * for every 21 cm down. It is fitted to the room it is given the way a picture
 * is fitted rather than stretched — the width and the height are both tried and
 * the smaller of the two wins, so a page never overflows in either direction.
 *
 * There is one page. Not two side by side, and not a spread that appears when
 * the screen happens to be wide enough: someone reading on a phone and someone
 * reading on a tablet are reading the same page, and a page that changes its
 * shape with the device is not a page.
 */

/** Width for each unit of height, taken from the printed page. */
export const PAGE_ASPECT = 0.7;

/** Total pages in the Madinah Mushaf. */
export const TOTAL_PAGES = 604;

export type MushafLayout = {
  /** Width of the page in points. */
  pageWidth: number;
  /** Height of the page in points. */
  pageHeight: number;
};

/**
 * Work out the page size.
 *
 * `availableHeight` is what is left once the reading chrome has taken its
 * share, because a page sized to the full screen sits half under the top bar.
 */
export function computeMushafLayout(availWidth: number, availHeight: number): MushafLayout {
  const height = Math.min(availWidth / PAGE_ASPECT, availHeight);
  return {
    pageWidth: Math.floor(height * PAGE_ASPECT),
    pageHeight: Math.floor(height),
  };
}

/**
 * The layout as a hook, so it re-runs when the screen changes.
 *
 * `reserve` is the vertical space the surrounding chrome occupies: the top bar,
 * the page navigation, the progress rule.
 */
export function useMushafLayout(reserve?: number): MushafLayout {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const used = reserve ?? (isLandscape ? 96 : 190);
  return useMemo(
    () => computeMushafLayout(width, Math.max(200, height - used)),
    [width, height, used],
  );
}
