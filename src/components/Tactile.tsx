import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { usePressDepth } from '../design/motion';

type Props = Omit<PressableProps, 'style' | 'onPressIn' | 'onPressOut'> & {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
};

/**
 * A pressable that answers the finger.
 *
 * Most of the app's tappable surfaces were plain Pressables. They worked, but
 * they gave nothing back, so a tap felt like it had missed and people pressed
 * twice. This is the same Pressable with the motion system's press depth
 * applied to it: the surface sinks a hair and settles back on release.
 *
 * It animates the Pressable itself rather than wrapping it in a View. That
 * matters more than it sounds. A wrapper takes part in layout, and several of
 * the styles that need this break the moment something sits around them:
 * `sectionLink` uses negative margins to widen its hit area beyond its own box,
 * so a wrapper collapses to the margin box and the child overflows it; others
 * are sized by their parent, so a wrapper takes the space and the Pressable
 * inside has nothing left to fill. Putting the transform on the Pressable means
 * the box in the layout tree is exactly the box that was there before.
 *
 * Reduced motion is handled inside `usePressDepth`: the value jumps straight to
 * its resting state, so nothing moves for somebody who asked it not to.
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tactile({ style, children, onPressIn, onPressOut, ...rest }: Props) {
  const press = usePressDepth();

  const handlePressIn = (event: GestureResponderEvent) => {
    press.onPressIn();
    onPressIn?.(event);
  };
  const handlePressOut = (event: GestureResponderEvent) => {
    press.onPressOut();
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      style={[style, { transform: [{ scale: press.scale }, { translateY: press.lift }] }] as any}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

export default Tactile;
