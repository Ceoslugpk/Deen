export type ContentFrame = { width: number; height: number };
export type SystemInsets = { top: number; right: number; bottom: number; left: number };

export const FLOAT_BAR_PADDING = 8;
const TAB_TOUCH_WIDTH = 44;

const positive = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

/** Android's shell consumes all four measured system insets once. Use that
 * same content frame for height caps/initial sizing, not the whole display.
 * Other platforms retain their existing per-screen safe-area handling. */
export function systemContentFrame(frame: ContentFrame, insets: SystemInsets, platform: string): ContentFrame {
  const width = positive(frame.width);
  const height = positive(frame.height);
  return platform === 'android' ? {
    width: Math.max(0, width - positive(insets.left) - positive(insets.right)),
    height: Math.max(0, height - positive(insets.top) - positive(insets.bottom)),
  } : { width, height };
}

/** Preserve the existing capsule/gutters at normal sizes, but never force a
 * 300px bar into a narrower safe content box. On very narrow windows, reduce
 * only the outside gutter first so all five navigation targets keep room. */
export function floatingTabBarWidth(availableWidth: number, tabs = 5): number {
  const width = positive(availableWidth);
  const preferredMinimum = Math.max(1, tabs) * TAB_TOUCH_WIDTH + FLOAT_BAR_PADDING * 2 + 2;
  const gutter = Math.min(16, Math.max(0, (width - preferredMinimum) / 2));
  return Math.min(460, Math.max(0, width - gutter * 2));
}
