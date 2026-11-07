import Svg, { Path } from 'react-native-svg';

/**
 * The shapes the seasonal layer is made of.
 *
 * The first version of this drew everything as a plain view — a box with
 * rounded corners, or a circle when the corners went all the way round. Snow
 * was a dot and a leaf was a lozenge, and both looked like what they were:
 * geometry standing in for a thing. A spinning rounded rectangle does not
 * read as a leaf at ten points across, which is why it looked wrong.
 *
 * So these are drawn. Three of them, because three is what the four effects
 * need:
 *
 * - a snowflake, six arms with a fork at each tip, built by rotating one
 *   arm six times rather than by writing six sets of coordinates that would
 *   then disagree with each other;
 * - two leaves, a plain pointed one and a maple, so a fall of them is not
 *   fourteen copies of the same silhouette;
 * - a petal, pointed where it joined the flower and round at the outer edge.
 *
 * Summer and Ramadan stay as dots. They are light, not objects — dust in a
 * shaft of sun and a warm glow have no silhouette, and giving them one would
 * make them worse. They also stay cheap, because a dot is a view and the
 * rest of these are vector.
 *
 * Everything is drawn in a 24 by 24 box and scaled to whatever size the
 * effect asks for, so one set of paths serves every screen and every
 * density, and there is no sprite sheet to keep in step.
 */

export type FlakeShape = 'snow' | 'leaf' | 'petal' | 'dot';

/** Six arms, and a fork at the end of each. Built once, at module load. */
function buildSnowflake(): string {
  const cx = 12;
  const cy = 12;
  const reach = 9.1;
  const fork = 3.1;
  const parts: string[] = [];

  // Three diameters through the middle give the six arms.
  for (let deg = 0; deg < 180; deg += 60) {
    const rad = (deg * Math.PI) / 180;
    const dx = Math.sin(rad) * reach;
    const dy = -Math.cos(rad) * reach;
    parts.push(
      `M${(cx - dx).toFixed(2)} ${(cy - dy).toFixed(2)}` +
      `L${(cx + dx).toFixed(2)} ${(cy + dy).toFixed(2)}`,
    );
  }

  // A fork at each tip, splayed about fifty degrees off the arm.
  for (let deg = 0; deg < 360; deg += 60) {
    const rad = (deg * Math.PI) / 180;
    const tipX = cx + Math.sin(rad) * reach;
    const tipY = cy - Math.cos(rad) * reach;
    for (const spread of [-0.88, 0.88]) {
      const arm = rad + spread;
      parts.push(
        `M${tipX.toFixed(2)} ${tipY.toFixed(2)}` +
        `L${(tipX + Math.sin(arm) * fork).toFixed(2)} ${(tipY - Math.cos(arm) * fork).toFixed(2)}`,
      );
    }
  }

  return parts.join('');
}

const SNOWFLAKE = buildSnowflake();

/** A plain pointed leaf — the shape most people draw when asked for a leaf. */
const LEAF_POINTED =
  'M12 1.6C18.6 7 18.6 17 12 22.4C5.4 17 5.4 7 12 1.6Z';

/** A maple. Five lobes, and the last point runs down into the stem. */
const LEAF_MAPLE =
  'M12 1.5L13.2 5.8L16.8 4.6L15.6 8.2L20.6 8.6L18.4 11.4L22.2 14.6' +
  'L18.2 14.8L17.4 19.2L13.4 16.6L12 22.5L10.6 16.6L6.6 19.2L5.8 14.8' +
  'L1.8 14.6L5.6 11.4L3.4 8.6L8.4 8.2L7.2 4.6L10.8 5.8Z';

const LEAVES = [LEAF_POINTED, LEAF_MAPLE];
export const LEAF_VARIANTS = LEAVES.length;

/**
 * The centre vein. Drawn on both leaves rather than baked into either
 * outline, so it can be a shade of nothing in particular and the silhouette
 * stays a single clean shape.
 */
const LEAF_RIB = 'M12 5V18.6';

/** Pointed where it met the flower, round where it did not. */
const PETAL =
  'M12 1.8C15.4 6.2 18.6 11.4 18.6 15.2C18.6 18.6 15.6 21.4 12 21.4' +
  'C8.4 21.4 5.4 18.6 5.4 15.2C5.4 11.4 8.6 6.2 12 1.8Z';

export function Flake({
  shape,
  size,
  color,
  variant = 0,
}: {
  shape: FlakeShape;
  size: number;
  color: string;
  /** Which leaf to draw. Only the leaves have more than one. */
  variant?: number;
}) {
  if (shape === 'snow') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d={SNOWFLAKE}
          stroke={color}
          strokeWidth={2.1}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    );
  }

  if (shape === 'petal') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={PETAL} fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={LEAVES[variant % LEAVES.length]} fill={color} />
      <Path
        d={LEAF_RIB}
        stroke="#000000"
        strokeOpacity={0.16}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
