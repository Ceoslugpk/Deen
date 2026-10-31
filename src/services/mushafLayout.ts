import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * How big one page of the mushaf should be.
 *
 * A page keeps the proportions of the printed Madinah mushaf: fourteen
 * centimetres across for every twenty-one down, which is the standard size the
 * King Fahd Complex prints. It is fitted to the room it is given the way a
 * picture is fitted rather than stretched — the width and the height are both
 * tried and the smaller of the two wins, so a page never overflows in either
 * direction.
 *
 * There is one page. Not two side by side, and not a spread that appears when
 * the screen happens to be wide enough: someone reading on a phone and someone
 * reading on a tablet are reading the same page, and a page that changes its
 * shape with the device is not a page.
 */

/** Width for each unit of height, taken from the printed page: 14 cm / 20 cm. */
export const PAGE_ASPECT = 14 / 20;

/**
 * The same page in the taller size the Complex also prints: fourteen across
 * for twenty-one down. Where a screen is taller than the standard page
 * allows, this is the shape the page takes instead, and the script is the
 * larger for it.
 */
export const PAGE_ASPECT_TALL = 14 / 21;


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
  /* Which of the two printed proportions the page takes.
     A screen taller than the standard page allows leaves height beside the
     page going unused, so the page takes the taller proportion and grows into
     it. A screen stubbier than the page — a small phone held upright — is
     already giving the page all the height it has, and asking for a taller
     page there would only make it narrower, so it keeps the standard shape.
     Either way the page is one the Complex prints. */
  const aspect = Math.max(PAGE_ASPECT_TALL, Math.min(PAGE_ASPECT, availWidth / availHeight));
  const height = Math.min(availWidth / aspect, availHeight);
  return {
    pageWidth: Math.floor(height * aspect),
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
