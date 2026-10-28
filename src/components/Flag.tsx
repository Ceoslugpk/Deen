import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

/**
 * Flags drawn rather than typed.
 *
 * Emoji flags are the obvious way to do this and they are wrong here: Windows
 * has never rendered them, and they come out of the font at whatever size and
 * colour the platform decides. A flag that is missing on one machine in three
 * is worse than no flag at all. So each one is drawn in a 30x20 viewBox and
 * scales with the `size` you pass.
 *
 * These are small. At 18px a flag is a pattern of colour, not a document, so
 * the detail is kept to what survives at that size: the stripes, the canton,
 * the crescent. The shahada on the Saudi flag is suggested by a single
 * calligraphic line rather than written - setting the words in anything other
 * than real calligraphy would be worse than not setting them.
 */

const W = 30;
const H = 20;

/** A five-pointed (or n-pointed) star centred on cx,cy. */
function starPath(cx: number, cy: number, outer: number, inner: number, points = 5): string {
  let d = '';
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

/** Evenly spaced horizontal stripes, first colour on top. */
function stripes(colors: string[]): React.ReactNode {
  const band = H / colors.length;
  return colors.map((c, i) => (
    <Rect key={i} x={0} y={i * band} width={W} height={band + 0.03} fill={c} />
  ));
}

/** Evenly spaced vertical stripes, first colour on the hoist side. */
function columns(colors: string[]): React.ReactNode {
  const band = W / colors.length;
  return colors.map((c, i) => (
    <Rect key={i} x={i * band} y={0} width={band + 0.03} height={H} fill={c} />
  ));
}

/**
 * A crescent: a filled disc with a second disc in the field colour knocked out
 * of it, offset towards the fly.
 */
function crescent(cx: number, cy: number, r: number, field: string, fill = '#FFFFFF'): React.ReactNode {
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={fill} />
      <Circle cx={cx + r * 0.34} cy={cy} r={r * 0.86} fill={field} />
    </G>
  );
}

const RED = '#B22234';
const NAVY = '#3C3B6E';

/** The fifty stars of the United States, nine rows alternating six and five. */
function usStars(): React.ReactNode {
  const out: React.ReactNode[] = [];
  for (let row = 0; row < 9; row += 1) {
    const count = row % 2 ? 5 : 6;
    for (let i = 0; i < count; i += 1) {
      const x = row % 2 ? 2 + i * 2 : 1 + i * 2;
      out.push(<Circle key={`${row}-${i}`} cx={x} cy={1.3 + row * 1.05} r={0.36} fill="#FFFFFF" />);
    }
  }
  return out;
}

const BODIES: Record<string, () => React.ReactNode> = {
  /** United States - chosen over the Union flag for English. */
  us: () => (
    <G>
      {Array.from({ length: 13 }).map((_, i) => (
        <Rect key={i} x={0} y={(i * H) / 13} width={W} height={H / 13 + 0.03} fill={i % 2 ? '#FFFFFF' : RED} />
      ))}
      <Rect x={0} y={0} width={12.6} height={(H * 7) / 13} fill={NAVY} />
      {usStars()}
    </G>
  ),

  /** Saudi Arabia - chosen for Arabic; the Mushaf standard is printed there. */
  sa: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H} fill="#006C35" />
      {/* the shahada, carried by one calligraphic stroke rather than written */}
      <Path
        d="M7 9.6 q1.7 -1.5 3.4 -0.1 t3.4 -0.25 t3.4 0.2 t3.5 -0.3"
        stroke="#FFFFFF" strokeWidth={1.15} fill="none" strokeLinecap="round"
      />
      <Path d="M9.5 11.9 h11.6" stroke="#FFFFFF" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M22.4 7.6 l0.9 -1.5 -0.9 -0.4" stroke="#FFFFFF" strokeWidth={0.75} fill="none" strokeLinecap="round" />
    </G>
  ),

  pk: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H} fill="#01411C" />
      <Rect x={0} y={0} width={6.5} height={H} fill="#FFFFFF" />
      {crescent(18.5, 10, 4.3, '#01411C')}
      <Path d={starPath(21.6, 7.6, 2.1, 0.85)} fill="#FFFFFF" />
    </G>
  ),

  fr: () => <G>{columns(['#0055A4', '#FFFFFF', '#EF4135'])}</G>,

  tr: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H} fill="#E30A17" />
      {crescent(11.6, 10, 4.4, '#E30A17')}
      <Path d={starPath(17.4, 10, 2.4, 0.98)} fill="#FFFFFF" />
    </G>
  ),

  id: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H / 2} fill="#CE1126" />
      <Rect x={0} y={H / 2} width={W} height={H / 2} fill="#FFFFFF" />
    </G>
  ),

  ru: () => <G>{stripes(['#FFFFFF', '#0039A6', '#D52B1E'])}</G>,

  zh: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H} fill="#EE1C25" />
      <Path d={starPath(6.6, 5.2, 3.1, 1.25)} fill="#FFDE00" />
      {[[11.8, 1.9], [13.9, 4.1], [13.9, 7.1], [11.8, 9.3]].map(([x, y], i) => (
        <Path key={i} d={starPath(x, y, 1.05, 0.42)} fill="#FFDE00" />
      ))}
    </G>
  ),

  ir: () => (
    <G>
      {stripes(['#239F40', '#FFFFFF', '#DA0000'])}
      <Circle cx={15} cy={10} r={2.5} stroke="#DA0000" strokeWidth={0.7} fill="none" />
      <Path d="M13.4 10 h3.2 M15 8.4 v3.2" stroke="#DA0000" strokeWidth={0.6} strokeLinecap="round" />
    </G>
  ),

  uz: () => (
    <G>
      {stripes(['#0099B5', '#FFFFFF', '#1EB53A'])}
      <Rect x={0} y={6.6} width={W} height={0.5} fill="#CE1126" />
      <Rect x={0} y={12.9} width={W} height={0.5} fill="#CE1126" />
      {crescent(10, 3.4, 2.1, '#0099B5')}
      {[[13.4, 2.6], [15, 3.4], [13.4, 4.2]].map(([x, y], i) => (
        <Path key={i} d={starPath(x, y, 0.85, 0.34)} fill="#FFFFFF" />
      ))}
    </G>
  ),

  kz: () => (
    <G>
      <Rect x={0} y={0} width={W} height={H} fill="#00AFCA" />
      <Rect x={0} y={0} width={2.6} height={H} fill="#FEC50C" />
      {/* the sun: a disc with short rays, which is all that reads this small */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return (
          <Path
            key={i}
            d={`M${15 + Math.cos(a) * 2.6} ${8.4 + Math.sin(a) * 2.6}L${15 + Math.cos(a) * 4.1} ${8.4 + Math.sin(a) * 4.1}`}
            stroke="#FEC50C" strokeWidth={0.8} strokeLinecap="round"
          />
        );
      })}
      <Circle cx={15} cy={8.4} r={2.5} fill="#FEC50C" />
      {/* the steppe eagle, reduced to the sweep of a wing */}
      <Path d="M10.5 16.4 q4.5 -3.6 9 0 q-4.5 -1.5 -9 0Z" fill="#FEC50C" />
    </G>
  ),

  my: () => (
    <G>
      {Array.from({ length: 14 }).map((_, i) => (
        <Rect key={i} x={0} y={(i * H) / 14} width={W} height={H / 14 + 0.03} fill={i % 2 ? '#FFFFFF' : '#CC0000'} />
      ))}
      <Rect x={0} y={0} width={13} height={(H * 8) / 14} fill="#010066" />
      {crescent(5.6, 5.4, 3.1, '#010066', '#FFCC00')}
      <Path d={starPath(7.6, 5.2, 2.4, 0.8, 14)} fill="#FFCC00" />
    </G>
  ),

  /** Fallback for a code we do not draw: a neutral plate with the code on it. */
  unknown: () => <Rect x={0} y={0} width={W} height={H} fill="#DDD8E8" />,
};

/**
 * Language code to the flag that carries it. Two decisions are worth naming.
 * English is the Stars and Stripes, not the Union flag, because the app's
 * default translation is American. Arabic is Saudi, because the Uthmani text
 * the reader prints follows the Mushaf printed there.
 */
const CODE_TO_FLAG: Record<string, string> = {
  en: 'us', ar: 'sa', ur: 'pk', fr: 'fr', tr: 'tr', id: 'id',
  ru: 'ru', zh: 'zh', fa: 'ir', uz: 'uz', kk: 'kz', my: 'my',
  // editions are tagged by language; a few arrive under other codes
  ms: 'my', ps: 'pk', ku: 'iq', bn: 'bd', hi: 'in', de: 'de',
  es: 'es', nl: 'nl', it: 'it', pt: 'pt', sw: 'ke', so: 'so',
  sq: 'al', bs: 'ba', tg: 'tj', ky: 'kg', az: 'az', tt: 'ru',
};

export function flagFor(code: string): string {
  return CODE_TO_FLAG[(code || '').toLowerCase().split(/[-_]/)[0]] || 'unknown';
}

export default function Flag({
  code, size = 18, radius = 3, style,
}: {
  code: string; size?: number; radius?: number; style?: any;
}) {
  const key = flagFor(code);
  const body = (BODIES[key] || BODIES.unknown)();
  return (
    <View
      style={[{
        width: size * (W / H), height: size, borderRadius: radius,
        overflow: 'hidden', borderWidth: 0.5, borderColor: 'rgba(15,23,42,.16)',
      }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {body}
      </Svg>
    </View>
  );
}
