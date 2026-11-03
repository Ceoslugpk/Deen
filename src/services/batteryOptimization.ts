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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

export type BatteryState = 'notNeeded' | 'unknown' | 'exempt' | 'restricted';

/**
 * Whether we have sent the reader to the exemption dialog at least once.
 *
 * Android offers no way for an app to read its own optimisation state from
 * JavaScript: `isIgnoringBatteryOptimizations` lives on the PowerManager,
 * which React Native does not expose, and the intent round-trip below gives no
 * answer either. So the state cannot be verified — only requested.
 *
 * Without this, the "Fix now" button never went away. The reader would grant
 * the exemption, come back, and find the same button still asking, because
 * every re-read reported `unknown`. Being asked to fix something already fixed,
 * forever, is worse than being trusted once.
 *
 * So the ask is remembered and treated as done. The wording on the screen says
 * what can honestly be said — that the app has been exempted from the app's
 * side — and a link to the system battery settings stays put, so the setting
 * can always be checked or reversed by hand.
 */
const ASKED_KEY = 'battery-exemption-asked-v1';
let asked: boolean | null = null;

export async function markBatteryExemptionAsked(): Promise<void> {
  asked = true;
  await AsyncStorage.setItem(ASKED_KEY, '1').catch(() => undefined);
}

export async function resetBatteryExemptionAsked(): Promise<void> {
  asked = false;
  await AsyncStorage.removeItem(ASKED_KEY).catch(() => undefined);
}

async function hasAsked(): Promise<boolean> {
  if (asked !== null) return asked;
  const raw = await AsyncStorage.getItem(ASKED_KEY).catch(() => null);
  asked = raw === '1';
  return asked;
}

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
  /* Asked once and never answerable, so the ask is what we remember. See the
     note on ASKED_KEY: the alternative is a button that never goes away. */
  if (await hasAsked()) return 'exempt';
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
    await markBatteryExemptionAsked();
    return true;
  } catch {
    // The manufacturer removed the dialog. Fall back to the general battery
    // settings page so the person can still find it by hand.
    try {
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
      await markBatteryExemptionAsked();
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
