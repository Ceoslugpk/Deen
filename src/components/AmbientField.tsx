import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useCalmMotion } from '../design/useCalmMotion';
import type { Ambience } from '../services/ambience';
import { paletteFor, pick, rnd } from './particles';

/**
 * The quiet layer: warm light settling across the Home screen in Ramadan.
 *
 * This is the opposite of the Eid burst in every way that matters. That one
 * is an event — it arrives, it is over in under three seconds, it happens
 * twice a year. This one runs for a month, so every decision here is about
 * what it is like to have it around for a long time.
 *
 * It is slow. A single pass takes about twenty seconds, against the burst's
 * two and a half. Anything faster reads as activity rather than as
 * stillness, and activity is tiring to sit next to.
 *
 * It is few. Fourteen pieces, against the burst's twenty-six, because the
 * burst is over before you can tire of it and this is not.
 *
 * The pieces are dots. Light has no silhouette, so a shape would be a lie,
 * and it would put the whole field on the vector renderer to no gain.
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
 * running behind something else. It also stands down entirely outside
 * Ramadan, and on an Eid, when the burst has the screen.
 */

const COUNT = 14;
/** Seconds for one crossing. Slow on purpose. */
const SPAN = 20;
const SIZE: [number, number] = [4, 7];
/** Sideways travel at the widest point of the sway, in points. */
const SWAY = 30;
const OPACITY: [number, number] = [0.45, 0.7];

type Piece = {
  key: number;
  left: number;
  delay: number;
  sway: number;
  duration: number;
  size: number;
  opacity: number;
  color: string;
  progress: Animated.Value;
};

function makePieces(palette: string[]): Piece[] {
  return Array.from({ length: COUNT }, (_unused, key) => ({
    key,
    left: rnd(0.02, 0.95),
    /* Spread across the whole pass, so the pieces do not arrive in a wave.
       Each also runs at its own pace, so any drift into step pulls itself
       apart within a pass or two. */
    delay: rnd(0, 1) * SPAN * 1000,
    sway: rnd(SWAY * 0.4, SWAY),
    duration: Math.round(SPAN * rnd(0.8, 1.25) * 1000),
    size: rnd(SIZE[0], SIZE[1]),
    opacity: rnd(OPACITY[0], OPACITY[1]),
    color: pick(palette),
    progress: new Animated.Value(0),
  }));
}

export function AmbientField({
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
    () => (kind ? makePieces(paletteFor(kind, dark)) : []),
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

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {pieces.map((piece) => {
        const beyond = piece.size + 8;
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
              transform: [
                {
                  translateY: piece.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-beyond, height + beyond],
                  }),
                },
                {
                  /* Sampled rather than a second animation: out and back and
                     home again, so the loop joins itself without a seam. */
                  translateX: piece.progress.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: [0, piece.sway, 0, -piece.sway, 0],
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
