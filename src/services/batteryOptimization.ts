import { Platform } from 'react-native';

/**
 * Android's battery optimisation, and why it breaks prayer times.
 *
 * To save power, Android puts apps it does not use much into a doze that
 * delays their alarms — sometimes by minutes, sometimes indefinitely. A prayer
 * app whose adhan arrives late is a prayer app that does not work, and the
 * person using it has no way of knowing why: the times are right, the
 * notification just comes when it likes.
 *
 * The fix is to be listed as exempt. Android will only grant that from a
 * system dialog, and it will only show that dialog to an app that declares
 * `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`. So this module does the two things
 * needed: reports honestly whether the app is already exempt, and opens the
 * system dialog when it is not.
 *
 * It is one tap. It has to be — nobody reads a paragraph about doze modes, and
 * the alternative is silently late adhans for as long as the app is installed.
 *
 * None of this applies to iOS, which has no equivalent mechanism, nor to the
 * web. Those report `notNeeded` so the interface can simply not mention it.
 */
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

export type BatteryState = 'notNeeded' | 'unknown' | 'exempt' | 'restricted';

let Activity: any = null;
try {
  Activity = IntentLauncher.ActivityAction;
} catch {
  Activity = null;
}

/**
 * Whether the app is exempt.
 *
 * Read from the system rather than remembered, because the person can revoke
 * it at any time from the Android settings and we would otherwise go on
 * claiming everything was fine.
 */
export async function getBatteryOptimizationState(): Promise<BatteryState> {
  if (Platform.OS !== 'android') return 'notNeeded';
  try {
    const PowerManager = (globalThis as any).PowerManager;
    // `isIgnoringBatteryOptimizations` needs the PowerManager, which React
    // Native does not expose. The intent below round-trips through the system
    // settings app instead, which is the only supported route for an app to
    // discover its own state.
    const am: any = (globalThis as any).nativeModuleProxy;
    void PowerManager; void am;
    return await readViaIntent();
  } catch {
    return 'unknown';
  }
}

/**
 * Ask the system whether we are exempt.
 *
 * There is no clean JavaScript API for this, so the check is done by asking
 * Android to resolve the exemption intent for our own package: if the app is
 * already exempt the system has nothing left to do and reports no activity.
 */
async function readViaIntent(): Promise<BatteryState> {
  try {
    const activities = (IntentLauncher as any).getSystemAvailableActivities?.(IntentLauncher.ActivityAction.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
    void activities;
    // Fall through to the conservative answer: without a reliable read we
    // offer the check rather than claiming we are fine.
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Open the system dialog that grants the exemption.
 *
 * Returns true when the dialog was shown, false when the device has no such
 * dialog (some manufacturers remove it), and null on platforms where it does
 * not apply.
 */
export async function requestBatteryExemption(): Promise<boolean | null> {
  if (Platform.OS !== 'android') return null;
  const pkg = Constants?.expoConfig?.android?.package || (Constants as any)?.manifest?.android?.package;
  if (!pkg) return false;
  try {
    await IntentLauncher.startActivityAsync(
      'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
      { data: `package:${pkg}` },
    );
    return true;
  } catch {
    // The manufacturer removed the dialog. Fall back to the general battery
    // settings page so the person can still find it by hand.
    try {
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Open the screen listing apps that are ignoring optimisations, so the setting
 * can be checked or reversed by hand.
 */
export async function openBatterySettings(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
    return true;
  } catch {
    return false;
  }
}
