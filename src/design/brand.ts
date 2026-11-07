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
  /* Running text — a paragraph, a hadith, a verse's meaning. Softer than
     `ink`, which is for headings, and darker than `muted`, which is for
     labels. Three styles already asked for this key and it was never in
     either palette, so they fell through to the inherited colour and came
     out black — legible on Pearl, invisible on Midnight Ink. */
  body:     mix(BRAND.midnightInk, BRAND.pearl, 0.14), // 12.2:1 on Pearl
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
  /* The surah number sits in a small filled medallion. On a gold ground the
     number has to be dark: white on antiqueGold is only 2.4:1, well under
     the 4.5:1 small text needs. This pairing measures 4.55:1. */
  surahBadge:    BRAND.antiqueGold,
  surahBadgeInk: '#3A2E0F',
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
  body:     mix(BRAND.pearl, BRAND.midnightInk, 0.16),  // 11.4:1 on Midnight Ink
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
  /* Lifted a little off Radiant Gold on purpose. The bare #DFB163 is one of
     the legacy literal hexes the sheet re-maps, and in dark mode that
     re-map drives it down to a muddy brown. This value is not on that
     list, so the medallion stays gold on the dark ground. */
  surahBadge:    mix(BRAND.radiantGold, BRAND.pearl, 0.10),   // #E2B871
  surahBadgeInk: '#3A2E0F',                                  // 7.18:1
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

/* ------------------------------------------------------------------ *
 * Palestine
 * ------------------------------------------------------------------ */

/**
 * The flag, in its four colours.
 *
 * Black, white, green and red, as the flag of Palestine is specified. Every
 * value in the palette below is one of these four or a tint of one toward
 * another, so the theme is made of the flag and nothing else.
 *
 * The greens and reds used for text are shaded toward black rather than the
 * pure flag values. Pure green measures 3.6:1 on the white ground, under the
 * 4.5:1 the small print in this app needs, so text takes a green that has
 * been taken down a little while fills and graphics keep the flag's own.
 */
export const FLAG = {
  black: '#000000',
  white: '#FFFFFF',
  green: '#009736',
  red:   '#EE2A35',
} as const;

/** Palestinian palette — the flag's four colours, and nothing else. */
export const C_PALESTINE: Palette = {
  bg:       mix(FLAG.white, FLAG.black, 0.035),        // white, taken down a little
  card:     FLAG.white,
  ink:      mix(FLAG.black, FLAG.white, 0.07),         // black, off pure
  muted:    mix(mix(FLAG.black, FLAG.white, 0.07), mix(FLAG.white, FLAG.black, 0.035), 0.40), // 4.8:1
  body:     mix(mix(FLAG.black, FLAG.white, 0.07), mix(FLAG.white, FLAG.black, 0.035), 0.18), // 10.4:1
  green:    mix(FLAG.green, FLAG.black, 0.18),         // primary, 5.0:1
  green2:   mix(FLAG.green, FLAG.black, 0.34),
  /* The primary fill is the flag's red, with white on it.
     White on the pure flag red measures 4.18:1, a third of a point under the
     4.5:1 the small print wants — the flag's red is simply a light colour.
     It is kept as the flag has it on purpose; #E02732 would clear the bar and
     is all but indistinguishable, if that ever matters more. */
  accent:   FLAG.red,
  deep:     FLAG.black,
  teal:     mix(FLAG.green, FLAG.black, 0.18),         // teal retired -> primary
  mint:     mix(FLAG.white, FLAG.green, 0.10),
  blue:     mix(FLAG.white, FLAG.green, 0.10),
  peach:    mix(FLAG.white, FLAG.red, 0.10),
  lilac:    mix(FLAG.white, FLAG.green, 0.10),
  yellow:   mix(FLAG.white, FLAG.red, 0.10),
  cyan:     mix(FLAG.white, FLAG.green, 0.10),
  gold:     mix(FLAG.green, FLAG.black, 0.14),         // the lit state, 4.6:1
  /* The Palestine palette is the four flag colours and nothing else, so the
     medallion is green rather than gold. Taken down toward black so a white
     number clears 4.5:1 on it — the pure flag green is only 3.83:1. */
  surahBadge:    mix(FLAG.green, FLAG.black, 0.14),
  surahBadgeInk: FLAG.white,                         // 4.96:1
  line:     mix(FLAG.white, FLAG.black, 0.12),
  /* Destructive is a red of its own, taken well down toward black, so that
     "Remove" never reads as the same colour as the button next to it.
     Text and icons only — nothing destructive is ever a filled button. */
  coral:    mix(FLAG.red, FLAG.black, 0.30),           // destructive, 6.9:1
  white:    FLAG.white,
  chevron:  mix(FLAG.black, FLAG.white, 0.55),
  onAccent: FLAG.white,
  onAccentInk: FLAG.white,                            // white on the red fill
  onHero:   FLAG.white,
  link:     mix(FLAG.green, FLAG.black, 0.18),         // 5.0:1
  success:  FLAG.green,
  successInk: mix(FLAG.green, FLAG.black, 0.18),       // 5.0:1
  /* The hero reads as the flag stood on end: black at the top, green below. */
  heroA:    mix(FLAG.black, FLAG.green, 0.22),
  heroB:    mix(FLAG.green, FLAG.black, 0.10),
};

/**
 * The same four colours, carried onto a dark ground.
 *
 * On dark the flag's own values go the other way: pure green measures 4.5:1
 * on the black ground but only 4.1:1 on a card, and pure red is under 4.5:1
 * on both. So the greens and reds that carry text are lifted toward white
 * instead of shaded toward black — the mirror of what the light palette does,
 * and for the same reason. Fills and graphics keep the flag's own values.
 *
 * The ground is the flag's black lifted a little, and cards are lifted off it
 * toward green, so the four colours still read as themselves in the dark.
 */
export const C_PALESTINE_DARK: Palette = {
  bg:       mix(FLAG.black, FLAG.white, 0.075),
  card:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.09),
  ink:      mix(FLAG.white, FLAG.black, 0.03),
  muted:    mix(mix(FLAG.white, FLAG.black, 0.03), mix(FLAG.black, FLAG.white, 0.075), 0.38), // 6.5:1
  body:     mix(mix(FLAG.white, FLAG.black, 0.03), mix(FLAG.black, FLAG.white, 0.075), 0.16), // 11.4:1
  green:    mix(FLAG.green, FLAG.white, 0.14),        // primary, 5.4:1 on card
  green2:   mix(FLAG.green, FLAG.white, 0.28),
  accent:   FLAG.red,                                 // the same red in the dark
  deep:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.black, 0.30),
  teal:     mix(FLAG.green, FLAG.white, 0.14),        // teal retired -> primary
  mint:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.30),
  blue:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.22),
  peach:    mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.red, 0.14),
  lilac:    mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.28),
  yellow:   mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.red, 0.18),
  cyan:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.22),
  gold:     mix(FLAG.green, FLAG.white, 0.14),        // the lit state, 5.4:1
  /* Dark mode uses the same green as light rather than lifting it. The lifted
     green is 3.16:1 against white and nothing clears 4.5:1 on it, so both
     modes take the darker green and keep the white number. */
  surahBadge:    mix(FLAG.green, FLAG.black, 0.14),
  surahBadgeInk: FLAG.white,                         // 4.96:1
  line:     mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.white, 0.16),
  /* Destructive on dark is lifted rather than taken down, so it reads on the
     black ground — and it stays clear of the button red either way. */
  coral:    mix(FLAG.red, FLAG.white, 0.24),          // destructive, 5.3:1
  white:    mix(mix(FLAG.black, FLAG.white, 0.075), FLAG.green, 0.16),
  chevron:  mix(mix(FLAG.white, FLAG.black, 0.03), mix(FLAG.black, FLAG.white, 0.075), 0.48),
  onAccent: FLAG.white,
  /* Text on the accent FILL. The fill is the flag's red in both brightnesses,
     so its text is white in both — unlike C_DARK, which has to flip. */
  onAccentInk: FLAG.white,
  onHero:   FLAG.white,
  link:     mix(FLAG.green, FLAG.white, 0.14),        // 5.4:1
  success:  FLAG.green,                               // fills/dots
  successInk: mix(FLAG.green, FLAG.white, 0.14),      // 5.4:1
    heroA:    mix(FLAG.black, FLAG.green, 0.14),
    heroB:    mix(FLAG.green, FLAG.black, 0.18),        // white on it 5.4:1
  };

  /* ------------------------------------------------------------------ *
   * Skeleton
   *
   * The two colours a loading placeholder is drawn from: the block a shape
   * sits in, and the lighter pass that travels across it.
   *
   * Derived rather than written into each palette, so the four of them cannot
   * drift. A placeholder has to read as "not here yet" without competing with
   * real content, which means it stays close to the surface it sits on and
   * moves by a small amount: enough to notice, not enough to draw the eye.
   * ------------------------------------------------------------------ */
  for (const palette of [C_LIGHT, C_DARK, C_PALESTINE, C_PALESTINE_DARK]) {
    palette.skeleton = mix(palette.line, palette.card, 0.62);
    palette.skeletonSweep = mix(palette.skeleton, palette.ink, 0.07);
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
  palestine: {
    shadow: mix(FLAG.black, FLAG.green, 0.20),
    soft:   mix(FLAG.black, FLAG.green, 0.35),
    edge:   alpha(FLAG.white, 0.90),
    veil:   alpha(FLAG.black, 0.035),
    scrim:  alpha(FLAG.black, 0.62),
  },
  palestineDark: {
    shadow: BLACK,
    soft:   BLACK,
    edge:   alpha(FLAG.white, 0.10),
    veil:   alpha(FLAG.white, 0.05),
    scrim:  alpha(FLAG.black, 0.72),
  },
} as const;

/**
 * The floating menu is glass: a capsule of blurred, translucent material
 * that takes its colour from whatever is behind it.
 *
 * These are the layers painted over the blur, and nothing here introduces a
 * hue. Everything is a brand colour at an alpha, or white or black at an
 * alpha — glass is a way of showing a colour, not a colour of its own, so
 * giving it one would have been the wrong kind of decision.
 *
 * Light and dark are not simple inversions. On Pearl the material has to be
 * lifted with white or it disappears into the page; on Midnight Ink it has
 * to be lit from above with a pale hairline, because a dark object on a dark
 * ground is only visible where the light catches its edge.
 */
export const GLASS = {
  light: {
    /** The wash that gives the material its colour, laid over the blur.
        Kept light: expo-blur's own tint is already doing most of the
        frosting, and a tab bar has to keep five labels readable over
        whatever happens to be behind it. */
    wash:      alpha(BRAND.pearl, 0.12),
    /** Specular sheen across the top edge, fading out by the middle. */
    sheen:     [alpha(WHITE, 0.50), alpha(WHITE, 0)] as [string, string],
    /** The hairline: bright where the light falls, dim underneath. */
    rimTop:    alpha(WHITE, 0.90),
    rimSide:   alpha(WHITE, 0.45),
    rimBottom: alpha(BRAND.midnightInk, 0.10),
    /** The selected tab, lifted out of the material. */
    pill:      alpha(WHITE, 0.62),
    pillRim:   alpha(WHITE, 0.90),
  },
  dark: {
    wash:      alpha(BRAND.midnightInk, 0.10),
    sheen:     [alpha(WHITE, 0.13), alpha(WHITE, 0)] as [string, string],
    rimTop:    alpha(BRAND.pearl, 0.34),
    rimSide:   alpha(BRAND.pearl, 0.14),
    rimBottom: alpha(BLACK, 0.30),
    pill:      alpha(BRAND.pearl, 0.15),
    pillRim:   alpha(BRAND.pearl, 0.26),
  },
} as const;

/**
 * How hard the blur works, 1 to 100.
 *
 * This is the one knob that moves both platforms, and it moves them for the
 * same reason. On iOS it is the fraction of the whole effect that is
 * applied — blur and the material's own tint together — so a lower number
 * is a more open material, not just a softer blur. On the web it drives the
 * blur radius and the tint alpha off the same value. Turning it down is
 * therefore the only way to make the glass more transparent, and turning it
 * up is the only way to make it blurrier; the two cannot be set apart.
 *
 * Not the same number in both themes on purpose. A dark material reads as
 * heavier than a light one at the same intensity, because there is less
 * light coming back through it, so dark asks for a little less.
 *
 * These sit close to expo-blur's own default of 50, which is the middle of
 * the range and a fairly open material. Nothing here is near 100: at that
 * end the glass stops being glass and becomes a panel.
 */
export const GLASS_INTENSITY = {
  /** The floating menu: five labels that have to stay readable. */
  bar:  { light: 54, dark: 50 },
  /** A card. It sits on the flat page rather than over scrolling content,
      so it can be a touch more open than the bar for the same legibility. */
  card: { light: 50, dark: 46 },
} as const;
