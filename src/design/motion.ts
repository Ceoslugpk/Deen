/**
 * Motion.
 *
 * The app animates with React Native's own Animated API driving the native
 * thread, which is the right tool here: every animation below is a transform or
 * an opacity, so it runs at 60fps without the JS thread being involved, and it
 * costs no extra dependency. (Measured comparisons put plain Animated ahead of
 * Reanimated for a press-pop, which is most of what this app does. Reanimated
 * would only earn its weight for gesture-driven work, of which there is none.)
 *
 * The timings follow the convention that feedback answers a touch quickly and
 * context changes take longer: presses settle in ~150ms, entrances take ~320ms.
 *
 * Everything routes through `useCalmMotion`. When the system asks for reduced
 * motion the durations collapse to zero and the values jump straight to their
 * resting state, so nothing ever moves for someone who has asked it not to.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useCalmMotion } from './useCalmMotion';

/** Milliseconds. Short enough to feel like the button answered you. */
export const MOTION = {
  /** Finger down: the card starts sinking. */
  pressIn: 130,
  /** Finger up: it settles back, slower so the release reads as a release. */
  pressOut: 210,
  /** A card arriving on screen. */
  enter: 320,
  /** Gap between neighbours in a group arriving together. */
  stagger: 45,
  /** A state change that is not a press - a toggle, a tab. */
  context: 260,
} as const;

/** Easing that decelerates into place, so nothing arrives abruptly. */
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.sin);

/**
 * Press depth.
 *
 * A card is a physical object sitting on a surface, so pressing it should push
 * it into that surface rather than just shrinking it. Three things move
 * together: the card scales down a hair, it sinks by a pixel, and a veil of
 * tint fades in over it. All three are transform or opacity, so all three stay
 * on the native thread.
 *
 * The shadow itself cannot be animated this way, so the contact shadow lives on
 * a separate layer whose opacity is driven here instead.
 */
export function usePressDepth() {
  const still = useCalmMotion();
  const press = useRef(new Animated.Value(0)).current;

  const go = (toValue: number, duration: number) =>
    Animated.timing(press, {
      toValue,
      duration: still ? 0 : duration,
      easing: easeOut,
      useNativeDriver: true,
    }).start();

  return {
    /** Shrinks to 98.5% - enough to feel, not enough to notice. */
    scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] }),
    /** Sinks one pixel into the surface. */
    lift: press.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    /** The tint that comes up as the card goes down. */
    veil: press,
    /** The contact shadow tightens and darkens as the card sits down. */
    contact: press.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    onPressIn: () => go(1, MOTION.pressIn),
    onPressOut: () => go(0, MOTION.pressOut),
    still,
  };
}

/**
 * Entrance.
 *
 * Cards rise a short distance and fade in. The distance is deliberately small:
 * the point is that the screen assembles itself, not that things fly. Pass an
 * index to stagger a row or grid.
 */
export function useEntrance(index = 0, delay = 0) {
  const still = useCalmMotion();
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (still) {
      value.setValue(1);
      return;
    }
    value.setValue(0);
    const animation = Animated.timing(value, {
      toValue: 1,
      duration: MOTION.enter,
      delay: delay + Math.min(index, 8) * MOTION.stagger,
      easing: easeOut,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, index, still, value]);

  return {
    opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    translateY: value.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }),
  };
}
