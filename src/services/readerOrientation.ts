/**
 * The opened mushaf: one window, two leaves.
 *
 * The first attempt turned the device and showed two pages in landscape. That
 * worked, but it asked the native binary to permit every orientation and then
 * relied on the app holding portrait everywhere else. One failure in that lock
 * and the whole app would rotate - a Quran reader that flips when you tilt it.
 *
 * So the page turns instead of the phone. The window stays upright, the two
 * leaves are drawn turned by a quarter circle, and the reader tilts their head
 * or their device as they would over any book lying open. Nothing outside this
 * screen changes, no native permission is asked for, and it works on the web
 * as well as on a phone - which is the only way the layout can be reviewed at
 * all, since a browser refuses to rotate in an iframe.
 *
 * The cost is honest: because the app cannot borrow the phone's own landscape
 * space (the home indicator and the status bar), the leaves are smaller than
 * they would be on a physically turned phone. They are as large as the window
 * allows and no larger.
 */
import { INDOPAK_PAGE_COUNT } from './indopakMushaf';

/** How far apart the two leaves sit, so they read as one book and not one page. */
export const SPREAD_GUTTER = 8;

/**
 * Whether the reader can be opened sideways.
 *
 * A spread needs more width than height even after turning, so a portrait
 * window that is much taller than wide cannot hold one: two quarter-turned
 * pages would be narrower than a single page at the same scale, which defeats
 * the point. This is a measurement, not a guess.
 */
export function canOpenSpread(width: number, height: number): boolean {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return false;
  if (width <= 0 || height <= 0) return false;
  /* The turned spread is `height` wide and `width` tall. It only helps if that
     is wider than the upright page - i.e. the window is taller than wide. */
  return height > width;
}

/**
 * The size of the whole turned block inside the window.
 *
 * The block is the two leaves side by side, so its width is twice a leaf plus
 * the gutter and its height is one leaf. Fitting it inside the window is a
 * plain aspect fit, which is why the pages never distort to fill space.
 */
export function spreadBlock(
  width: number,
  height: number,
  aspect: number,
  inset = 0,
): { width: number; height: number } {
  const usableWidth = Math.max(0, height - inset * 2);
  const usableHeight = Math.max(0, width - inset * 2);
  if (usableWidth <= 0 || usableHeight <= 0 || aspect <= 0) return { width: 0, height: 0 };
  /* Half the turned width per leaf, less half the gutter. */
  const leafWidth = Math.max(0, (usableWidth - SPREAD_GUTTER) / 2);
  const leafHeight = leafWidth / aspect;
  if (leafHeight > usableHeight) {
    return { width: usableHeight * aspect * 2 + SPREAD_GUTTER, height: usableHeight };
  }
  return { width: usableWidth, height: leafHeight };
}

/**
 * Which page sits on the right.
 *
 * A mushaf opens with page 1 on the right-hand leaf, so the odd page is always
 * the right one and the even page to its left. Every turn of a leaf moves both
 * by two, which is what makes "next page" mean "the next two surfaces" rather
 * than the next single page.
 */
export function spreadPages(page: number): { left: number; right: number | null; first: number } {
  const clamped = Math.max(1, Math.min(Math.round(Number(page) || 1), INDOPAK_PAGE_COUNT));
  const right = clamped % 2 === 1 ? clamped : clamped + 1;
  const left = right - 1;
  /* The book ends on an even page, so the last spread is page 548 alone on the
     right leaf and nothing beside it. `right` is null rather than clamped to
     548: an even page can never sit on a right leaf, and drawing one there
     would silently renumber the mushaf. */
  return {
    left: left >= 1 ? left : 0,
    right: right <= INDOPAK_PAGE_COUNT ? right : null,
    /* What the reader stores. The left leaf where there is one, so that
       returning to the page lands on the spread that was open. */
    first: left >= 1 ? left : right,
  };
}

/**
 * The page a turn of one leaf should land on.
 *
 * `forward` is the direction the reader asked for, not a comparison of page
 * numbers: swiping back twice from page 5 must not oscillate. The result is
 * always the first page of the next spread, clamped to the book.
 */
export function turnSpread(page: number, forward: boolean): number {
  const clamped = Math.max(1, Math.min(Math.round(Number(page) || 1), INDOPAK_PAGE_COUNT));
  /* The odd page of the spread currently open. This must round the same way
     `spreadPages` does - up, not down - or an even page would be attributed to
     the spread before it and every turn would land one page short. */
  const odd = clamped % 2 === 1 ? clamped : clamped + 1;
  const target = forward ? odd + 2 : odd - 2;
  const bounded = Math.max(1, Math.min(target, INDOPAK_PAGE_COUNT));
  /* Resolved back through `spreadPages`, so the turn always returns the page a
     spread is stored by and never an odd/even mismatch at the book's ends. */
  return spreadPages(bounded).first;
}

/**
 * The size of the folded surface for a turn.
 *
 * The single-page fold measures one page inside the viewport. A spread is not
 * that shape: the block is two leaves wide and sits turned inside an upright
 * window, so the fold has to span the block, not the window. Handing the fold
 * the block's own box keeps its paper, its crease and its shadow proportional
 * to what is actually being turned, and - because the fold is drawn inside the
 * rotated container - the whole animation is carried by the same quarter turn
 * that lays the book open. No second rotation to keep in sync.
 *
 * `scroll` is zero because the block is never scrolled: it is fitted to the
 * window, so the fold's clipping window has nothing to compensate for.
 */
export function spreadFoldFrame(width: number, height: number, inset = 0): {
  viewport: { width: number; height: number };
  size: { width: number; height: number };
  scroll: { x: number; y: number };
} {
  const w = Math.max(0, Math.round(width));
  const h = Math.max(0, Math.round(height));
  const safe = Math.max(0, Math.round(inset));
  return {
    viewport: { width: w, height: h },
    size: { width: Math.max(0, w - safe * 2), height: Math.max(0, h - safe * 2) },
    scroll: { x: 0, y: 0 },
  };
}
