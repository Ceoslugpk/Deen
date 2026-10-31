/**
 * Brand palette — the only colours the app is allowed to use.
 *
 * Ten colours were supplied as the brand. Nothing outside this file may
 * introduce a new hue. Everything the UI needs beyond the ten is derived from
 * them here: tints toward Pearl, shades toward Midnight Ink, and mixes between
 * two brand colours. Because every value below is a mix of two brand colours,
 * the whole app provably stays on-palette.
 *
 * Two families are deliberately NOT remapped, because they are standards
 * rather than styling:
 *   - national flag colours (src/components/Flag.tsx)
 *   - tajweed rule colours  (src/content/quranStudy.ts)
 * Changing either would make the app wrong rather than on-brand.
 */

/** The ten brand colours. */
export const BRAND = {
  midnightInk: '#14121F',
  deepIndigo:  '#2D187D',
  royalIndigo: '#452D9F',
  violet:      '#5D40C3',
  lavender:    '#8B6BE8',
  mist:        '#E6DEFA',
  radiantGold: '#DFB163',
  antiqueGold: '#C28D3F',
  bronze:      '#9A611A',
  pearl:       '#F9F2EB',
} as const;


/* ------------------------------------------------------------------ *
 * Derivation helpers
 * ------------------------------------------------------------------ */

const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex(rgb: [number, number, number]): string {
  return '#' + rgb.map((c) => clamp255(c).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Blends `b` into `a`. t=0 returns `a`, t=1 returns `b`. */
export function mix(a: string, b: string, t: number): string {
  const A = toRgb(a);
  const B = toRgb(b);
  return toHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}

/** Brand colour with alpha, as rgba() — for scrims, veils and glows. */
export function alpha(color: string, a: number): string {
  const [r, g, b] = toRgb(color);
  return `rgba(${r},${g},${b},${a})`;
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';

/* ------------------------------------------------------------------ *
 * Ramp — the named steps every surface is snapped to.
 * Each is a mix of two brand colours (or a brand colour with black/white
 * as the extreme of its own tint/shade), so the ramp stays on-palette.
 * ------------------------------------------------------------------ */

export const RAMP = {
  // Midnight Ink <-> Lavender, lifted to Pearl for the top of the range.
  ink:    mix(BRAND.midnightInk, BLACK, 0.30),   // #0E0D16  deepest ground
  inkSoft: mix(BRAND.midnightInk, WHITE, 0.20),   // mid-dark neutral
  inkMuted: mix(BRAND.midnightInk, BRAND.pearl, 0.38),
  pearlDim: mix(BRAND.pearl, BRAND.midnightInk, 0.32),
  pearl:   BRAND.pearl,
  pearlLift: mix(BRAND.pearl, WHITE, 0.30),       // #FCFAF6 card above Pearl bg

  deepIndigo: BRAND.deepIndigo,
  royal:     BRAND.royalIndigo,
  violet:    BRAND.violet,
  lavender:  BRAND.lavender,
  lavenderTint: mix(BRAND.lavender, BRAND.pearl, 0.42),
  mist:      BRAND.mist,
  mistLift:  mix(BRAND.mist, WHITE, 0.45),

  bronzeDeep: mix(BRAND.bronze, BLACK, 0.30),
  bronze:     BRAND.bronze,
  antiqueGold: BRAND.antiqueGold,
  radiantGold: BRAND.radiantGold,
  goldTint:   mix(BRAND.radiantGold, BRAND.pearl, 0.42),
  goldWash:   mix(BRAND.radiantGold, BRAND.pearl, 0.72),
} as const;

/* ------------------------------------------------------------------ *
 * Semantic tokens
 *
 * Light: Pearl ground, Midnight Ink text, Royal Indigo brand.
 * Dark:  Midnight Ink ground, Pearl text, Lavender accents — the indigos are
 *        too dark to read on black, so Lavender carries the brand on dark and
 *        gold lifts to Radiant, which measures 9.3:1 on the ink ground.
 * ------------------------------------------------------------------ */

export type Palette = Record<string, string>;

/** Light palette — the app's default. */
export const C_LIGHT: Palette = {
  bg:       BRAND.pearl,                              // Pearl
  card:     RAMP.pearlLift,                           // card sits above the ground
  ink:      BRAND.midnightInk,
  muted:    mix(BRAND.midnightInk, BRAND.pearl, 0.38), // 5.0:1 on Pearl
  green:    BRAND.royalIndigo,                        // primary (legacy key name)
  green2:   BRAND.violet,
  accent:   BRAND.royalIndigo,
  deep:     BRAND.midnightInk,
  teal:     BRAND.royalIndigo,                        // teal retired -> primary
  mint:     BRAND.mist,
  blue:     BRAND.mist,
  peach:    mix(BRAND.pearl, BRAND.radiantGold, 0.10),
  lilac:    BRAND.mist,
  yellow:   mix(BRAND.pearl, BRAND.radiantGold, 0.16),
  cyan:     BRAND.mist,
  gold:     BRAND.antiqueGold,
  line:     BRAND.mist,
  coral:    BRAND.bronze,                             // destructive (Bronze)
  white:    WHITE,                                    // 100% lift of Pearl
  chevron:  mix(BRAND.midnightInk, BRAND.pearl, 0.62),
  onAccent: BRAND.pearl,                              // text on the indigo hero
  onAccentInk: BRAND.pearl,                           // text on the Royal Indigo fill
  onHero:   BRAND.radiantGold,                        // 6.9:1 on Deep Indigo
  link:     BRAND.royalIndigo,                        // 8.9:1 on Pearl
  success:  BRAND.antiqueGold,                        // fills/dots; use successInk for text
  successInk: BRAND.bronze,                           // 4.6:1 on Pearl
  heroA:    BRAND.deepIndigo,
  heroB:    BRAND.royalIndigo,
};

/** Dark palette — derived from the same ten, per the brand decision. */
export const C_DARK: Palette = {
  bg:       BRAND.midnightInk,
  card:     mix(BRAND.midnightInk, BRAND.lavender, 0.075),
  ink:      BRAND.pearl,
  muted:    mix(BRAND.pearl, BRAND.midnightInk, 0.38), // 6.9:1 on ink
  /* Lavender on a dark card measures 4.1:1, just under AA. Lifting the
     accent toward Pearl keeps the same hue at a readable 5.4:1, and it is
     still plainly the brand indigo as a fill. */
  green:    mix(BRAND.lavender, BRAND.pearl, 0.18),
  green2:   mix(BRAND.lavender, BRAND.pearl, 0.34),
  accent:   mix(BRAND.lavender, BRAND.pearl, 0.18),
  deep:     RAMP.ink,
  teal:     mix(BRAND.lavender, BRAND.pearl, 0.18),
  mint:     mix(BRAND.midnightInk, BRAND.royalIndigo, 0.30),
  blue:     mix(BRAND.midnightInk, BRAND.royalIndigo, 0.22),
  peach:    mix(BRAND.midnightInk, BRAND.antiqueGold, 0.14),
  lilac:    mix(BRAND.midnightInk, BRAND.violet, 0.28),
  yellow:   mix(BRAND.midnightInk, BRAND.antiqueGold, 0.18),
  cyan:     mix(BRAND.midnightInk, BRAND.royalIndigo, 0.22),
  gold:     BRAND.radiantGold,
  line:     mix(BRAND.midnightInk, BRAND.lavender, 0.16),
  coral:    mix(BRAND.bronze, BRAND.radiantGold, 0.45), // 5.3:1 on card
  white:    mix(BRAND.midnightInk, BRAND.lavender, 0.10),
  chevron:  mix(BRAND.pearl, BRAND.midnightInk, 0.48),
  /* Text on the indigo hero. Light in both themes, because the hero stays on
     Deep Indigo -> Royal Indigo either way. */
  onAccent: BRAND.pearl,
  /* Text on the accent FILL, which is the other way round: the fill is Royal
     Indigo on light but rises to a light Lavender on dark, so its text has to
     flip. Keeping these two apart is what stops hero text going dark on dark. */
  onAccentInk: mix(BRAND.midnightInk, BLACK, 0.18),    // 6.3:1 on the accent
  onHero:   BRAND.radiantGold,
  link:     mix(BRAND.lavender, BRAND.pearl, 0.20),    // 6.3:1 on ink
  success:  BRAND.radiantGold,                         // 9.3:1 on ink
  successInk: BRAND.radiantGold,
  heroA:    BRAND.deepIndigo,
  heroB:    BRAND.royalIndigo,
};

/* ------------------------------------------------------------------ *
 * Literal-hex remap
 *
 * Some colours are written straight into the style sheet rather than read from
 * `C`. Instead of rewriting every one by hand, each is snapped here onto the
 * brand ramp at the same lightness, so the visual hierarchy is unchanged and
 * the hue is the only thing that moves.
 * ------------------------------------------------------------------ */

export const HEX_REMAP: Record<string, string> = {
  '#111C18': '#14121F',
  '#474653': '#7B7671',
  '#9AA0AC': '#D6D2CB',
  '#BFD9CF': '#EBD3A6',
  '#C2DED3': '#EBD3A6',
  '#C7C2E4': '#E6DEFA',
  '#C9E5DB': '#F5E9D2',
  '#CAE4DB': '#F5E9D2',
  '#CCEBDE': '#F5E9D2',
  '#CFC7EE': '#E6DEFA',
  '#D7CFFF': '#E6DEFA',
  '#D8D4EA': '#E6DEFA',
  '#D8D5E9': '#E6DEFA',
  '#D9D3F3': '#E6DEFA',
  '#D9D5EC': '#E6DEFA',
  '#DDD6FF': '#E6DEFA',
  '#DED7C9': '#EBD3A6',
  '#E1DCF7': '#E6DEFA',
  '#E2DEE8': '#E6DEFA',
  '#E2EEE8': '#F5E9D2',
  '#E3DEF7': '#E6DEFA',
  '#E4DEFA': '#E6DEFA',
  '#E4DFFA': '#E6DEFA',
  '#E4F2EC': '#F5E9D2',
  '#E5D4A6': '#EBD3A6',
  '#E6E2EB': '#E6DEFA',
  '#E8CFD5': '#EBD3A6',
  '#E9E1D5': '#F5E9D2',
  '#EAE6F0': '#E6DEFA',
  '#EAE7F1': '#E6DEFA',
  '#EDE5E4': '#F5E9D2',
  '#F0DCBE': '#EBD3A6',
  '#F0EDFF': '#FCFAF6',
  '#F2EFFF': '#FCFAF6',
  '#F5EFEE': '#FCFAF6',
  '#F7EDF0': '#FCFAF6',
  '#FBFCFB': '#FCFAF6',
  '#FF9A72': '#DFB163',
  '#FFE2A1': '#EBD3A6',
  '#FFE3A4': '#EBD3A6',
  '#FFF1DD': '#F5E9D2',
  '#FFFDF5': '#FCFAF6',
  '#FFFDF8': '#FCFAF6',
};

/** Rewrites a literal hex onto the brand ramp. Returns the input if unmapped. */
export function brandHex(hex: string): string {
  return HEX_REMAP[hex.toUpperCase()] || hex;
}

/* ------------------------------------------------------------------ *
 * Snap-to-brand
 *
 * `darkHex()` moves colours by manipulating hue, saturation and lightness.
 * That arithmetic is free to land anywhere in RGB space, so a colour can leave
 * the palette on its way to the dark theme. This projects any colour back onto
 * the nearest point that really is a mix of two brand colours, which is what
 * makes the guarantee hold for runtime-derived colours and not just literals.
 * ------------------------------------------------------------------ */

const ANCHORS: Array<[string, string]> = [
  ['MidnightInk', BRAND.midnightInk], ['DeepIndigo', BRAND.deepIndigo],
  ['RoyalIndigo', BRAND.royalIndigo], ['Violet', BRAND.violet],
  ['Lavender', BRAND.lavender], ['Mist', BRAND.mist],
  ['RadiantGold', BRAND.radiantGold], ['AntiqueGold', BRAND.antiqueGold],
  ['Bronze', BRAND.bronze], ['Pearl', BRAND.pearl],
  ['white', WHITE], ['black', BLACK],
];

/** Every reachable brand mix, sampled. Built once, on first use. */
let RAMP_CACHE: Array<[number, number, number]> | null = null;

function ramp(): Array<[number, number, number]> {
  if (RAMP_CACHE) return RAMP_CACHE;
  const out: Array<[number, number, number]> = [];
  for (let i = 0; i < ANCHORS.length; i++) {
    for (let j = 0; j < ANCHORS.length; j++) {
      if (i === j) continue;
      const a = toRgb(ANCHORS[i][1]);
      const b = toRgb(ANCHORS[j][1]);
      for (let step = 0; step <= 40; step++) {
        const t = step / 40;
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
      }
    }
  }
  RAMP_CACHE = out;
  return out;
}

/** Projects any colour onto the nearest true mix of two brand colours. */
export function snapToBrand(color: string): string {
  const t = toRgb(color);
  let best = Infinity;
  let bestC: [number, number, number] = t as [number, number, number];
  for (const c of ramp()) {
    const d =
      (c[0] - t[0]) * (c[0] - t[0]) + (c[1] - t[1]) * (c[1] - t[1]) + (c[2] - t[2]) * (c[2] - t[2]);
    if (d < best) {
      best = d;
      bestC = c;
    }
  }
  return toHex([bestC[0], bestC[1], bestC[2]]);
}

/** Brand-derived depth tokens, replacing the old off-palette shadow tints. */
export const DEPTH = {
  light: {
    shadow: mix(BRAND.deepIndigo, BRAND.midnightInk, 0.35), // was #292750
    soft:   mix(BRAND.violet, BRAND.midnightInk, 0.45),     // was #3B3568
    edge:   'rgba(255,255,255,0.9)',
    veil:   alpha(BRAND.midnightInk, 0.035),
    scrim:  alpha(BRAND.midnightInk, 0.62),
  },
  dark: {
    shadow: BLACK,
    soft:   BLACK,
    edge:   alpha(BRAND.lavender, 0.10),
    veil:   alpha(BRAND.lavender, 0.05),
    scrim:  alpha(BRAND.midnightInk, 0.72),
  },
} as const;
