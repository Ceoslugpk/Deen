import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useCalmMotion } from '../design/useCalmMotion';
import type { Ambience } from '../services/ambience';
import { Flake, type FlakeShape } from './FlakeShape';
import { paletteFor, pick, rnd } from './particles';

/**
 * The quiet layer: something drifting across the Home screen, all year.
 *
 * This is the opposite of the Eid burst in every way that matters. That one
 * is an event — it arrives, it is over in under three seconds, it happens
 * twice a year. This one is weather. It never finishes, so every decision
 * here is about what it is like to have it around for a long time.
 *
 * It is slow. A single pass across the screen takes between fourteen and
 * twenty-two seconds depending on the effect, against the burst's two and a
 * half. Anything faster reads as activity rather than as weather, and
 * activity is tiring to sit next to.
 *
 * It is few. Fourteen to eighteen pieces, against the burst's twenty-six,
 * because the burst is over before you can tire of it and this is not.
 *
 * It costs one animated value per piece. Sway is folded into the same value
 * that drives the fall, sampled at five points so it returns to where it
 * started — rather than a second animation per piece running alongside.
 * Everything runs on the native driver, so the JS thread is not involved in
 * keeping it moving.
 *
 * Nothing fades in or out. Each piece begins and ends beyond the edge of the
 * screen, so the moment the loop restarts is a moment you cannot see, and
 * there is no need to hide it.
 *
 * And it stops. When the screen is not the one being looked at, or the app
 * has gone to the background, the animations are torn down rather than left
 * running behind something else. An effect this slow can still cost a
 * battery over a day of being open, and there is no reason to pay that for
 * a screen nobody is on.
 */

type Spec = {
  count: number;
  /** Seconds for one crossing. Slow on purpose. */
  span: number;
  /** Points across. Big enough that the shape can be read, not just seen. */
  size: [number, number];
  /** Sideways travel at the widest point of the sway, in points. */
  sway: number;
  /** Total turn over one crossing, in degrees. */
  spin: number;
  opacity: [number, number];
  /** 1 falls, -1 rises. */
  direction: 1 | -1;
  shape: FlakeShape;
};

const SPECS: Record<Exclude<Ambience, 'confetti'>, Spec> = {
  /* Snow: a real flake, and it is given room to be one — at four points a
     snowflake is a dot and might as well be a circle. It barely turns,
     because snow does not. */
  snow: { count: 18, span: 15, size: [7, 13], sway: 26, spin: 40, opacity: [0.6, 0.9], direction: 1, shape: 'snow' },
  /* Petals: pointed at one end, round at the other, and they turn as they
     go. Fewer of them than snow because they catch the eye more. */
  petals: { count: 14, span: 18, size: [9, 15], sway: 46, spin: 360, opacity: [0.5, 0.75], direction: 1, shape: 'petal' },
  /* Summer: the one effect that rises. Not weather at all — heat and light
     have no silhouette, so this is dust in a shaft of sun, going up rather
     than coming down. A dot, and the slowest and faintest of the four. */
  motes: { count: 14, span: 22, size: [3, 6], sway: 18, spin: 0, opacity: [0.35, 0.6], direction: -1, shape: 'dot' },
  /* Autumn: two leaf shapes, so a fall of them is not fourteen copies of
     one silhouette, and a wide tumble to carry them down. */
  leaves: { count: 14, span: 14, size: [10, 17], sway: 40, spin: 540, opacity: [0.6, 0.85], direction: 1, shape: 'leaf' },
  /* Ramadan: warm light settling. A dot again, because light has no shape. */
  ramadan: { count: 14, span: 20, size: [4, 7], sway: 30, spin: 0, opacity: [0.45, 0.7], direction: 1, shape: 'dot' },
};

type Piece = {
  key: number;
  left: number;
  delay: number;
  sway: number;
  spin: number;
  duration: number;
  size: number;
  opacity: number;
  color: string;
  /** Which leaf, when there is more than one. */
  variant: number;
  progress: Animated.Value;
};

function makePieces(spec: Spec, palette: string[]): Piece[] {
  return Array.from({ length: spec.count }, (_unused, key) => ({
    key,
    left: rnd(0.02, 0.95),
    /* Spread across the whole pass, so the pieces do not arrive in a wave.
       Each also runs at its own pace, so any drift into step pulls itself
       apart within a pass or two. */
    delay: rnd(0, 1) * spec.span * 1000,
    sway: rnd(spec.sway * 0.4, spec.sway),
    spin: spec.spin ? rnd(spec.spin * 0.5, spec.spin * 1.5) : 0,
    duration: Math.round(spec.span * rnd(0.8, 1.25) * 1000),
    size: rnd(spec.size[0], spec.size[1]),
    opacity: rnd(spec.opacity[0], spec.opacity[1]),
    color: pick(palette),
    variant: Math.floor(Math.random() * 2),
    progress: new Animated.Value(0),
  }));
}

export function SeasonalField({
  kind,
  dark,
  active,
}: {
  kind: Exclude<Ambience, 'confetti'> | null;
  dark: boolean;
  /** False when the screen is not the one in front of the person. */
  active: boolean;
}) {
  const still = useCalmMotion();
  const { width, height } = useWindowDimensions();

  const pieces = useMemo(
    () => (kind ? makePieces(SPECS[kind], paletteFor(kind, dark)) : []),
    [kind, dark],
  );

  useEffect(() => {
    if (!kind || still || !active) return;
    const runs = pieces.map((piece) => {
      piece.progress.setValue(0);
      return Animated.loop(
        Animated.timing(piece.progress, {
          toValue: 1,
          duration: piece.duration,
          delay: piece.delay,
          /* Linear, and it matters: the default is an ease in and out, which
             would slow every piece at the top and bottom of its pass and
             make a continuous fall stutter twice a cycle. */
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
    });
    const group = Animated.parallel(runs);
    group.start();
    return () => {
      group.stop();
    };
  }, [kind, still, active, pieces]);

  if (!kind || still || !active) return null;

  const spec = SPECS[kind];

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {pieces.map((piece) => {
        const beyond = piece.size + 8;
        const from = spec.direction === 1 ? -beyond : height + beyond;
        const to = spec.direction === 1 ? height + beyond : -beyond;
        const motion = [
          {
            translateY: piece.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [from, to],
            }),
          },
          {
            /* Sampled rather than a second animation: out and back and home
               again, so the loop joins itself without a visible seam. */
            translateX: piece.progress.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, piece.sway, 0, -piece.sway, 0],
            }),
          },
          {
            rotate: piece.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', `${piece.spin}deg`],
            }),
          },
        ];

        /* A dot is a view and stays one. Giving summer and Ramadan a
           silhouette would be worse, and this keeps two of the five effects
           off the vector renderer entirely. */
        if (spec.shape === 'dot') {
          return (
            <Animated.View
              key={piece.key}
              style={{
                position: 'absolute',
                top: 0,
                left: piece.left * width,
                width: piece.size,
                height: piece.size,
                borderRadius: piece.size / 2,
                backgroundColor: piece.color,
                opacity: piece.opacity,
                transform: motion,
              }}
            />
          );
        }

        return (
          <Animated.View
            key={piece.key}
            style={{
              position: 'absolute',
              top: 0,
              left: piece.left * width,
              width: piece.size,
              height: piece.size,
              opacity: piece.opacity,
              transform: motion,
            }}
          >
            <Flake shape={spec.shape} size={piece.size} color={piece.color} variant={piece.variant} />
          </Animated.View>
        );
      })}
    </View>
  );
}
