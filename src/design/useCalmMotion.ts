/**
 * Whether this person has asked their device to reduce motion.
 *
 * Read from the platform's accessibility setting and kept up to date if it
 * changes while the app is open. Every animation in the app checks this first
 * and collapses to its resting state when it is true, so honouring the setting
 * is a property of the motion system rather than something each screen has to
 * remember to do.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useCalmMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((value: any) => {
      if (alive) setReduced(!!value);
    });
    const sub: any = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value: any) => setReduced(!!value));
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}
