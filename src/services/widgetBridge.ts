/**
 * Talks to the native widget module.
 *
 * The widget never calls into the app; the app calls out to it. So every
 * change a widget shows has to be *published* — prayer times when they are
 * calculated, the counter when it is tapped, the theme when it flips. Nothing
 * here is polled, and nothing here is read back.
 *
 * The native module is a local Expo module (`modules/deen-widgets`), reached
 * through autolinking rather than through `NativeModules`, so it needs no
 * hand-written package registration that the next prebuild would delete.
 *
 * Everything is guarded, because this module does not exist on the web or in
 * Expo Go. A widget that is never told anything is a smaller problem than an
 * app that throws at startup because a native module was not linked.
 */

export type DeenWidgetsNative = {
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

let cached: DeenWidgetsNative | null | undefined;

/**
 * The module, or null where there isn't one.
 *
 * `requireNativeModule` throws rather than returning undefined when the module
 * is missing, and it is only ever missing in the same circumstances every
 * time — so the answer is worked out once and remembered.
 */
function nativeModule(): DeenWidgetsNative | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../../modules/deen-widgets');
    cached = (mod && (mod as typeof import('../../modules/deen-widgets'))) as unknown as DeenWidgetsNative;
  } catch {
    cached = null;
  }
  return cached;
}

let lastPublished = '';

/**
 * When the app last wrote, epoch ms.
 *
 * Kept so the two writers can be told apart. The widget stamps its own write;
 * the app compares that stamp with this one and keeps whichever is newer.
 * Without a stamp on both sides there is no way to know whether a stored
 * count is the app's own, or one the widget has moved on from.
 */
let lastPublishedAt = 0;

export function lastPublishTime(): number {
  return lastPublishedAt;
}

/**
 * Writes the snapshot and redraws the widgets.
 *
 * Identical snapshots skip the redraw. The counter can be tapped several times
 * a second, and each tap would otherwise wake the widget host and rebuild four
 * layouts — all to show a number that has moved by one.
 */
export async function publishSnapshotJson(json: string): Promise<boolean> {
  const native = nativeModule();
  if (!native) return false;
  const changed = json !== lastPublished;
  lastPublished = json;
  lastPublishedAt = Date.now();
  try {
    await native.publish(json);
    if (changed) await native.refresh();
    return true;
  } catch {
    /* A widget that keeps its old snapshot is not worth an exception. */
    return false;
  }
}

export async function refreshWidgets(): Promise<boolean> {
  const native = nativeModule();
  if (!native) return false;
  try {
    await native.refresh();
    return true;
  } catch {
    return false;
  }
}

/** The snapshot as the widget host last saw it, for picking up a home tap. */
export async function readSnapshotJson(): Promise<string | null> {
  const native = nativeModule();
  if (!native) return null;
  try {
    return await native.read();
  } catch {
    return null;
  }
}

export async function clearSnapshot(): Promise<boolean> {
  const native = nativeModule();
  lastPublished = '';
  lastPublishedAt = 0;
  if (!native) return false;
  try {
    return await native.clear();
  } catch {
    return false;
  }
}

/**
 * Puts the countdown on the Lock Screen and in the Dynamic Island.
 *
 * Returns false, quietly, wherever there is no Live Activity to put it on:
 * Android, an iOS before 16.1, an iPad, or a user who has switched them off.
 * All four are ordinary states and none of them is an error.
 */
export async function startActivity(input: {
  name: string;
  time: string;
  nextAt: number;
  place: string;
  method: string;
}): Promise<boolean> {
  const native = nativeModule();
  if (!native) return false;
  try {
    return await native.startActivity(
      input.name,
      input.time,
      input.nextAt,
      input.place,
      input.method,
    );
  } catch {
    return false;
  }
}

export async function stopActivity(): Promise<boolean> {
  const native = nativeModule();
  if (!native) return false;
  try {
    return await native.stopActivity();
  } catch {
    return false;
  }
}

export function widgetsAvailable(): boolean {
  return nativeModule() !== null;
}
