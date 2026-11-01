/**
 * Screen transitions.
 *
 * The app is mostly read, so screens should change under the person rather
 * than announce themselves. A full-width push is a lot of movement for
 * something as ordinary as opening a setting, so every stack uses a short
 * slide combined with a fade: the new screen rises a little and settles as
 * the old one dims, and neither travels the whole width of the device.
 *
 * `fade_from_bottom` is the closest the native stack gets to that without
 * taking on a JavaScript-driven interpolator, and it is what the platform
 * draws itself, so it stays smooth under load.
 *
 * Bottom sheets opt out at the screen level and keep `slide_from_bottom`;
 * screen options win over these, so a sheet still arrives as a sheet.
 *
 * Reduced motion is honoured here rather than at each call site: when the
 * system asks for less movement the animation is removed outright, so
 * navigation becomes an instant swap.
 */

import { useMemo } from 'react';
import { MOTION } from './motion';
import { useCalmMotion } from './useCalmMotion';

/**
 * Milliseconds for one screen giving way to the next. A little longer than
 * the default push, which is what makes it read as calm rather than slow.
 */
const TRANSITION_MS = MOTION.context;

/** Options to spread into a native stack's `screenOptions`. */
export function useSubtleTransitions() {
  const reduced = useCalmMotion();
  return useMemo(
    () => ({
      headerShown: false,
      animation: (reduced ? 'none' : 'fade_from_bottom') as 'none' | 'fade_from_bottom',
      animationDuration: TRANSITION_MS,
    }),
    [reduced],
  );
}
