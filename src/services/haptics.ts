import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * One place that decides whether a press is felt.
 *
 * Every pressable in the app funnels through here, which means the whole app
 * can be made silent from a single switch. That switch lives in Settings
 * because a phone that buzzes on every tap is not everybody's phone, and
 * haptics are the one thing a person cannot turn down at the system level
 * per-app.
 *
 * Nothing here may ever throw. A missed buzz must never cost somebody the
 * press that was supposed to come with it.
 */

export type HapticKind =
  | 'tap'          // a plain press - the default, and the quietest
  | 'select'       // picking one of several, like a tab or a segment
  | 'toggle'       // something switched on or off - carries a little more weight
  | 'count'        // a counter going up, as on the tasbih
  | 'success'
  | 'warning'
  | 'error';

/** Haptics are a physical device feature; the web has nothing to buzz. */
const SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'android';

let enabled = true;

export function setHapticsEnabled(next: boolean) {
  enabled = next !== false;
}

export function isHapticsEnabled() {
  return enabled && SUPPORTED;
}

/** Lets Settings explain itself on a platform that cannot buzz at all. */
export function isHapticsSupported() {
  return SUPPORTED;
}

export function haptic(kind: HapticKind = 'tap') {
  if (!enabled || !SUPPORTED) return;
  try {
    switch (kind) {
      case 'tap':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'select':
        void Haptics.selectionAsync();
        break;
      case 'toggle':
      case 'count':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    /* a nice-to-have, never the reason a button stops working */
  }
}

/**
 * Wraps a handler so the buzz lands on the same press that runs the work.
 * Returned undefined-safe, so callers can hand over an optional onPress.
 */
export function withHaptic<T extends ((...args: any[]) => any) | undefined>(
  onPress: T,
  kind: HapticKind = 'tap',
): T {
  if (typeof onPress !== 'function') return onPress;
  return ((...args: any[]) => {
    haptic(kind);
    return (onPress as (...a: any[]) => any)(...args);
  }) as T;
}
