import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * Deciding how many pages to show, and how big each one should be.
 *
 * This is measured, not guessed at from a device name. Asking "is this a
 * tablet?" produces a list of models that goes stale every year, and a
 * foldable is a phone and a tablet and neither depending on whether it is
 * open. What actually matters is how much room there is and what shape it is,
 * so that is what is measured — and because it is read from
 * `useWindowDimensions`, rotating the device or unfolding it re-runs the whole
 * calculation on its own.
 *
 * A page is sized by a fixed proportion rather than by stretching to fill.
 * The Madinah mushaf page is close to 0.70 wide for every 1 tall; a page
 * stretched to whatever the screen happens to be stops looking like a page and
 * starts looking like a very wide paragraph. So each page keeps that shape and
 * is scaled to fit inside whatever space is available, the way a picture is
 * fitted rather than stretched.
 *
 * The useful consequence of sizing by height: in landscape, one page and two
 * pages come out the *same* size, because both are limited by the short
 * dimension. A spread is then strictly better — twice the reading, at no cost
 * in legibility — which is exactly why landscape is when you want it.
 */

/**
 * Width for each unit of height, taken from the printed page.
 *
 * 14.8 cm across, 21 cm down, which is the Madinah Mushaf's page.
 */
export const PAGE_ASPECT = 0.7;

/**
 * How much taller than its true proportions a page is allowed to become.
 *
 * Held upright, a phone is far taller than a page is wide, so a page at its
 * printed proportions uses the width and leaves a third of the height unused
 * — and it is the script, not the page, that pays for the waste. A page may
 * therefore be set taller than 0.70, down to this, when there is height going
 * begging. It is never set shorter: on a wide screen the true proportions are
 * kept exactly.
 */
export const MIN_PAGE_ASPECT = 0.6;

/** Total pages in the Madinah Mushaf. */
export const TOTAL_PAGES = 604;

/** Breathing room between the two pages of a spread. */
export const SPREAD_GUTTER = 14;

/**
 * Below this width, two pages would each be narrower than a pocket mushaf and
 * the script would be too small to read comfortably, so the spread is not
 * offered however the setting is worded.
 */
export const MIN_SPREAD_WIDTH = 640;

/**
 * Below this height there is not enough room for fifteen lines at a readable
 * size. 260 rather than 300 because a phone held sideways keeps its height
 * down around 290 once the chrome has taken its share, and refusing the spread
 * there would defeat the point of turning the device.
 */
export const MIN_SPREAD_HEIGHT = 260;

/** How the person wants the spread handled. */
export type SpreadMode = 'auto' | 'always' | 'never';

export const SPREAD_MODES: SpreadMode[] = ['auto', 'always', 'never'];

export function spreadModeLabel(mode: SpreadMode, rtl: boolean): string {
  if (rtl) {
    return mode === 'auto' ? 'تلقائي' : mode === 'always' ? 'دائمًا صفحتان' : 'صفحة واحدة';
  }
  return mode === 'auto' ? 'Automatic' : mode === 'always' ? 'Always two' : 'Single page';
}

export function spreadModeNote(mode: SpreadMode, rtl: boolean): string {
  if (rtl) {
    return mode === 'auto'
      ? 'صفحتان حيث تتسع الشاشة لهما — عادةً عند تدوير الجهاز أو على الجهاز اللوحي.'
      : mode === 'always'
        ? 'صفحتان دائمًا، حتى في الوضع الرأسي.'
        : 'صفحة واحدة دائمًا، حتى عند التدوير.';
  }
  return mode === 'auto'
    ? 'Two pages wherever the screen is wide enough — usually when turned sideways, or on a tablet.'
    : mode === 'always'
      ? 'Two pages always, even held upright.'
      : 'One page always, even when turned sideways.';
}

export type MushafLayout = {
  /** How many pages sit side by side. */
  columns: 1 | 2;
  /** Width of a single page in points. */
  pageWidth: number;
  /** Height of a single page in points. */
  pageHeight: number;
  /** True when the screen is wider than it is tall. */
  isLandscape: boolean;
  /** Whether the available room actually allows a comfortable spread. */
  canSpread: boolean;
  /** How the decision was reached, for the settings screen to explain itself. */
  reason: 'forced-on' | 'forced-off' | 'room-for-two' | 'not-wide-enough' | 'not-tall-enough';
  screenWidth: number;
  screenHeight: number;
};

/**
 * Work out the page size and how many of them fit.
 *
 * `availableHeight` is what is left once the reading chrome has taken its
 * share, because a page sized to the full screen will sit half underneath the
 * top bar.
 */
export function computeMushafLayout(
  screenWidth: number,
  screenHeight: number,
  availableHeight: number,
  mode: SpreadMode,
): MushafLayout {
  const isLandscape = screenWidth > screenHeight;

  // The room one page, or two, would have to sit in.
  const single = fit(1, screenWidth, availableHeight);
  const pair = fit(2, screenWidth, availableHeight);

  const tooNarrow = screenWidth < MIN_SPREAD_WIDTH;
  const tooShort = availableHeight < MIN_SPREAD_HEIGHT;
  const canSpread = !tooNarrow && !tooShort;

  let columns: 1 | 2;
  let reason: MushafLayout['reason'];

  if (mode === 'always') {
    columns = 2;
    reason = 'forced-on';
  } else if (mode === 'never') {
    columns = 1;
    reason = 'forced-off';
  } else if (tooNarrow) {
    columns = 1;
    reason = 'not-wide-enough';
  } else if (tooShort) {
    columns = 1;
    reason = 'not-tall-enough';
  } else {
    columns = 2;
    reason = 'room-for-two';
  }

  const size = columns === 2 ? pair : single;
  return {
    columns,
    pageWidth: Math.floor(size.width),
    pageHeight: Math.floor(size.height),
    isLandscape,
    canSpread,
    reason,
    screenWidth,
    screenHeight,
  };
}

/**
 * Scale `count` pages, in their true proportions, into the space available.
 *
 * Both the width and the height are tried and the smaller of the two wins, so
 * a page never overflows in either direction.
 */
function fit(count: number, availWidth: number, availHeight: number) {
  const gutter = count > 1 ? SPREAD_GUTTER * (count - 1) : 0;
  const usableWidth = Math.max(0, availWidth - gutter) / count;

  // The height this page would have at its printed proportions.
  const trueHeight = usableWidth / PAGE_ASPECT;

  if (trueHeight > availHeight) {
    // Not enough height for the true proportions: the page shrinks, keeping
    // them. This is the landscape case, where a spread costs nothing.
    return { width: availHeight * PAGE_ASPECT, height: availHeight };
  }
  // Height to spare: the page takes as much of it as it is allowed, so the
  // script does not have to shrink into a shape the screen did not need.
  return {
    width: usableWidth,
    height: Math.min(availHeight, usableWidth / MIN_PAGE_ASPECT),
  };
}

/**
 * The layout as a hook, so it re-runs when the screen changes.
 *
 * `reserve` is the vertical space the surrounding chrome occupies: the top
 * bar, the page navigation, the progress rule. Passing it in keeps this module
 * free of any knowledge about how the reader is put together.
 */
export function useMushafLayout(mode: SpreadMode, reserve?: number): MushafLayout {
  const { width, height } = useWindowDimensions();
  /* Held sideways there is very little height to give, so the surrounding
     chrome has to give more of it back: the top bar tucks away and the page
     navigation thins down. Passing `reserve` explicitly overrides this. */
  const isLandscape = width > height;
  const used = reserve ?? (isLandscape ? 96 : 190);
  return useMemo(
    () => computeMushafLayout(width, height, Math.max(200, height - used), mode),
    [width, height, used, mode],
  );
}

/**
 * Which two pages make up a spread, and in what order.
 *
 * In a mushaf the pages run right to left: page 1 sits on the right, page 2 on
 * the left, page 3 on the right of the next opening. So an opening always
 * pairs an odd page with the even one after it, and which side each falls on
 * is fixed rather than chosen.
 */
export function spreadFor(page: number): { right: number; left: number | null } {
  const odd = page % 2 === 1 ? page : page - 1;
  return { right: Math.max(1, odd), left: odd + 1 <= TOTAL_PAGES ? odd + 1 : null };
}

/** The page a reader moving one spread at a time should land on. */
export function stepSpread(page: number, delta: number): number {
  const { right } = spreadFor(page);
  const next = right + delta * 2;
  return Math.max(1, Math.min(TOTAL_PAGES, next));
}
