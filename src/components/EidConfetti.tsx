import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useCalmMotion } from '../design/useCalmMotion';
import { paletteFor, pick, rnd } from './particles';

/**
 * One burst of confetti, for the day of Eid.
 *
 * This is the whole of the celebration: it falls once, it takes under three
 * seconds, and it does not come back until the next Eid. It is deliberately
 * not an always-on effect. The rest of the app is quiet, and a screen people
 * open to pray should not be drifting particles all year round. Two mornings
 * a year is a greeting; every morning is wallpaper.
 *
 * Three things keep it cheap:
 *
 * - It runs entirely on the native driver, so nothing touches the JS thread
 *   while it falls.
 * - It renders nothing at all unless it is firing. There is no permanent
 *   transparent layer sitting over the screen.
 * - It disappears for anyone who has asked their device to reduce motion.
 *   That is read fresh from the platform every time rather than remembered,
 *   because the preference belongs to the person and not to the app's memory
 *   of them — someone who turns it on mid-morning should see the effect go.
 *
 * Pieces start above the top edge and fall past the bottom, each with its own
 * drift, spin, delay and distance, so no two fall alike and the whole thing
 * reads as paper rather than as a grid.
 */

const COUNT = 26;
const DURATION = 2600;

type Piece = {
  key: number;
  /** Fraction across the width, 0–1. */
  left: number;
  /** Milliseconds before this piece begins to fall. */
  delay: number;
  /** Sideways travel in pixels across the whole fall. */
  drift: number;
  /** Total spin in degrees. */
  spin: number;
  /** How far it falls, as a multiple of the screen height. */
  reach: number;
  /** How long the fall takes, as a multiple of the base duration. */
  pace: number;
  width: number;
  height: number;
  radius: number;
  color: string;
  progress: Animated.Value;
};

function makePieces(palette: string[]): Piece[] {
  return Array.from({ length: COUNT }, (_unused, key) => {
    /* Squares, circles and short ribbons, so the fall has some shape to it
       rather than being twenty-six of the same rectangle. */
    const square = Math.random() < 0.4;
    const width = square ? rnd(6, 9) : rnd(5, 8);
    const height = square ? width : rnd(10, 17);
    return {
      key,
      left: rnd(0.02, 0.95),
      delay: rnd(0, 620),
      drift: rnd(-70, 70),
      spin: rnd(-540, 540),
      reach: rnd(0.9, 1.4),
      pace: rnd(0.75, 1.25),
      width,
      height,
      radius: square ? (Math.random() < 0.5 ? 0 : width / 2) : Math.min(width, height) / 2,
      color: pick(palette),
      progress: new Animated.Value(0),
    };
  });
}

export function EidConfetti({ fire, dark }: { fire: string | null; dark: boolean }) {
  const still = useCalmMotion();
  const { width, height } = useWindowDimensions();

  /* Rebuilt each time `fire` changes, so tapping the preview twice does not
     show the identical fall. Held in a memo rather than state because the
     pieces carry their own animated values and must not be recreated on
     every re-render of the screen behind them. */
  const pieces = useMemo(() => makePieces(paletteFor('confetti', dark)), [fire, dark]);

  useEffect(() => {
    if (!fire || still) return;
    for (const piece of pieces) piece.progress.setValue(0);
    const run = Animated.parallel(
      pieces.map((piece) =>
        Animated.timing(piece.progress, {
          toValue: 1,
          duration: Math.round(DURATION * piece.pace),
          delay: Math.round(piece.delay),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    );
    run.start();
    return () => {
      run.stop();
    };
  }, [fire, still, pieces]);

  if (!fire || still) return null;

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {pieces.map((piece) => {
        const travel = height * piece.reach;
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
              opacity: piece.progress.interpolate({
                inputRange: [0, 0.06, 0.78, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  /* Gravity. The clock itself is linear; the curve lives
                     here, so each piece accelerates the way paper does. */
                  translateY: piece.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-piece.height - 8, travel],
                    easing: Easing.in(Easing.quad),
                  }),
                },
                {
                  translateX: piece.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, piece.drift],
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
