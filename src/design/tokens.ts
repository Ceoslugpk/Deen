/**
 * Design tokens.
 *
 * Layout runs on an 8pt grid; components use the 4pt sub-grid inside it. Every
 * card carries the same internal padding (16) and the same corner radius family,
 * so a screen reads as one set rather than a pile of different objects.
 */

/** Spacing — 4pt steps. Use 16 or 20 for screen edges, 12–16 for gutters. */
export const SPACE = {
  hairline: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
  block: 48,
} as const;

/** Corner radii — 4pt steps. Radii that close a circle (half the side) are free. */
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

/** The standard card: one padding, one radius, one shadow. */
export const CARD = {
  padding: 16,
  radius: 20,
  gap: 12,
} as const;

export const CARD_GAP = 12;

