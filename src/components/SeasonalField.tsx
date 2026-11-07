import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useCalmMotion } from '../design/useCalmMotion';
import type { Ambience } from '../services/ambience';
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

/** Seconds for one pass, the width and height in points, and so on. */
type Spec = {
  count: number;
  /** Seconds for one crossing. Slow on purpose. */
  span: number;
  width: [number, number];
  height: [number, number];
  /** Sideways travel at the widest point of the sway, in points. */
  sway: number;
  /** Total turn over one crossing, in degrees. */
  spin: number;
  opacity: [number, number];
  /** 1 falls, -1 rises. */
  direction: 1 | -1;
  shape: 'round' | 'ribbon' | 'mixed';
};

const SPECS: Record<Exclude<Ambience, 'confetti'>, Spec> = {
  /* Snow: small, round, barely turning, drifting. The fastest of the four
     because snow that crawls looks like dust. */
  snow: { count: 18, span: 15, width: [4, 8], height: [4, 8], sway: 26, spin: 40, opacity: [0.6, 0.9], direction: 1, shape: 'round' },
  /* Petals: elongated, and they turn as they go, so they catch the eye more
     than snow does at the same speed and are given fewer of them. */
  petals: { count: 14, span: 18, width: [5, 9], height: [7, 13], sway: 46, spin: 360, opacity: [0.5, 0.75], direction: 1, shape: 'ribbon' },
  /* Summer: the one effect that rises. Not a weather effect at all — heat
     and light have no picture, so this is dust in a shaft of sun, going up
     rather than coming down. The slowest and faintest of the four. */
  motes: { count: 14, span: 22, width: [3, 6], height: [3, 6], sway: 18, spin: 0, opacity: [0.35, 0.6], direction: -1, shape: 'round' },
  /* Autumn: the tumble. Wide sway, heavy spin, mid-size pieces. */
  leaves: { count: 14, span: 14, width: [7, 12], height: [7, 12], sway: 40, spin: 540, opacity: [0.6, 0.85], direction: 1, shape: 'mixed' },
  /* Ramadan: warm light settling, slower and rounder than the burst it sits
     beside for the rest of the year. */
  ramadan: { count: 14, span: 20, width: [4, 7], height: [4, 7], sway: 30, spin: 0, opacity: [0.45, 0.7], direction: 1, shape: 'round' },
};

type Piece = {
  key: number;
  left: number;
  delay: number;
  sway: number;
  spin: number;
  duration: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
  color: string;
  progress: Animated.Value;
};

function makePieces(spec: Spec, palette: string[]): Piece[] {
  return Array.from({ length: spec.count }, (_unused, key) => {
    const shape = spec.shape === 'mixed' ? (Math.random() < 0.45 ? 'round' : 'ribbon') : spec.shape;
    const width = rnd(spec.width[0], spec.width[1]);
    const height = shape === 'ribbon' ? rnd(spec.height[0], spec.height[1]) : width;
    return {
      key,
      left: rnd(0.02, 0.95),
      /* Spread across the whole pass, so the pieces do not arrive in a
         wave. Each also runs at its own pace, so any drift into step
         pulls itself apart within a pass or two. */
      delay: rnd(0, 1) * spec.span * 1000,
      sway: rnd(spec.sway * 0.4, spec.sway),
      spin: spec.spin ? rnd(spec.spin * 0.5, spec.spin * 1.5) : 0,
      duration: Math.round(spec.span * rnd(0.8, 1.25) * 1000),
      width,
      height,
      radius: shape === 'round' ? width / 2 : Math.min(width, height) / 2,
      opacity: rnd(spec.opacity[0], spec.opacity[1]),
      color: pick(palette),
      progress: new Animated.Value(0),
    };
  });
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
        const beyond = piece.height + 8;
        const from = spec.direction === 1 ? -beyond : height + beyond;
        const to = spec.direction === 1 ? height + beyond : -beyond;
        return (
          <Animated.View
            key={piece.key}
            style={{
              position: 'absolute',
              top: 0,
              left: piece.left * width,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.radius,
              backgroundColor: piece.color,
              opacity: piece.opacity,
              transform: [
                {
                  translateY: piece.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [from, to],
                  }),
                },
                {
                  /* Sampled rather than a second animation: out and back
                     and home again, so the loop joins itself without a
                     visible jump at the seam. */
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
              ],
            }}
          />
        );
      })}
    </View>
  );
}
