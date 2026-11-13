import { NativeModule, requireNativeModule } from 'expo';

import type { WidgetSnapshot } from '../../src/services/widgetSnapshot';

/**
 * The native half of the home-screen widgets.
 *
 * Kept as a local Expo module rather than files copied into the generated
 * native projects, because a copied file has to be registered by hand — a
 * pbxproj entry on iOS, a package registration on Android — and both are
 * rewritten on the next prebuild. Autolinking does that registering for us and
 * redoes it on every prebuild, which is the whole point.
 */
type DeenWidgetsNative = {
  publish(json: string): Promise<boolean>;
  refresh(): Promise<boolean>;
  read(): Promise<string | null>;
  clear(): Promise<boolean>;
  startActivity(
    name: string,
    time: string,
    nextAt: number,
    place: string,
    method: string,
  ): Promise<boolean>;
  stopActivity(): Promise<boolean>;
};

const native = requireNativeModule<DeenWidgetsNative>('DeenWidgetBridge');

export function publishSnapshotJson(json: string): Promise<boolean> {
  return native.publish(json);
}

export function refreshWidgets(): Promise<boolean> {
  return native.refresh();
}

export function readSnapshotJson(): Promise<string | null> {
  return native.read();
}

export function clearSnapshot(): Promise<boolean> {
  return native.clear();
}

/**
 * Puts the countdown on the Lock Screen and in the Dynamic Island.
 *
 * Returns false rather than throwing when the system will not have it — an
 * older iOS, an iPad, or a user who has switched Live Activities off. All
 * three are ordinary, and none of them should surface as a failure.
 */
export function startActivity(
  name: string,
  time: string,
  nextAt: number,
  place: string,
  method: string,
): Promise<boolean> {
  return native.startActivity(name, time, nextAt, place, method);
}

export function stopActivity(): Promise<boolean> {
  return native.stopActivity();
}

export type { WidgetSnapshot };
