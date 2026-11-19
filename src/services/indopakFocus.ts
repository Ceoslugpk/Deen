import { fitIndopakPage, INDOPAK_VIEWBOX } from './indopakMushaf';
import { INDOPAK_POPOVER, type indopakPopoverLayout } from './indopakSelection';

export const INDOPAK_FOCUS_UNLOCK = { size: 44, inset: 8, gap: 6 };

/** Whole, undistorted paper in the safe viewport; the one unlock target must never cover Quran ink. */
export function fitIndopakFocusPage(width: number, height: number) {
  const size = fitIndopakPage(width, height, 1);
  if (size.width <= 0 || size.height <= 0) return size;
  const control = INDOPAK_FOCUS_UNLOCK;
  const origin = { x: Math.max(0, (width - size.width) / 2), y: Math.max(0, (height - size.height) / 2) };
  // The authentic body starts at x=48, y=92 and ends at x=952 in the existing viewBox.
  // Most portrait/wide landscape panes already leave the corner clear. Near the
  // paper's aspect ratio, shrink only enough to put the first source row below it.
  const bodyRight = origin.x + 952 * size.width / INDOPAK_VIEWBOX.width;
  const bodyTop = origin.y + 92 * size.height / INDOPAK_VIEWBOX.height;
  const clear = control.inset + control.size + control.gap;
  if (bodyRight <= width - clear || bodyTop >= clear) return size;
  const maxHeight = Math.max(0, (height - clear * 2) / (1 - 184 / INDOPAK_VIEWBOX.height));
  const scale = Math.min(1, maxHeight / size.height);
  return { width: size.width * scale, height: size.height * scale };
}

/** Keep transient ayah actions and Unlock independently reachable; retain the above-ayah anchor when possible. */
export function clearIndopakFocusPopover(viewport: { width: number; height: number }, layout: ReturnType<typeof indopakPopoverLayout>) {
  if (!layout) return null;
  const clear = INDOPAK_FOCUS_UNLOCK.inset + INDOPAK_FOCUS_UNLOCK.size + INDOPAK_FOCUS_UNLOCK.gap;
  if (layout.y >= clear || layout.x + layout.width <= viewport.width - clear) return layout;
  const x = viewport.width - clear - layout.width;
  if (x >= INDOPAK_POPOVER.margin) {
    const centre = (layout.target.x + layout.target.right) / 2;
    return { ...layout, x, arrowX: Math.max(14, Math.min(layout.width - 14, centre - x)) };
  }
  // An exceptionally narrow pane cannot fit both targets side by side. Put the
  // popup below its actual ayah rather than cover either the ayah or Unlock.
  const y = Math.max(clear, layout.target.bottom + INDOPAK_POPOVER.gap);
  return y + layout.height <= viewport.height - INDOPAK_POPOVER.margin ? { ...layout, y, side: 'below' } : null;
}
