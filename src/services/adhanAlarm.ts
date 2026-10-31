/**
 * Plays the chosen adhan at the prayer times.
 *
 * A notification cannot do this any more. It used to, but a notification can
 * only play a sound compiled into the app, which is why 25 MB of recordings
 * were shipped inside the install until now. Moving them to the device cache
 * means the sound has to be played by the app instead - so the prayer time is
 * handed to the operating system as an alarm, and a small foreground service
 * plays the file when it goes off.
 *
 * This module is the JavaScript half. It only ever asks the system to
 * schedule; the playing is `DeenAdhanAlarm` on Android. Where that module is
 * not present - the web, iOS, and Expo Go - every call here is a no-op and
 * returns false, and the caller keeps using an ordinary notification sound.
 * That is a smaller failure than an alarm that never fires: the reminder still
 * arrives, just with the device's own tone.
 */
import { Platform } from 'react-native';
import { adhanTrack, type AdhanTrack } from './adhanCatalog';
import { isAdhanCached, cachedAdhanUri } from './adhanCache';

type AlarmScheduleItem = {
  /** Milliseconds since the epoch. */
  at: number;
  /** Which prayer, so two alarms never share an id. */
  prayer: string;
  /** Absolute path of the recording on the device. */
  file: string;
  /** Shown on the notification the service must display while playing. */
  title: string;
};

type AlarmBridge = {
  /** Takes a JSON string rather than an array: simpler across the bridge. */
  schedule(itemsJson: string): Promise<boolean>;
  cancel(): Promise<boolean>;
  /** Whether exact alarms are allowed on this device right now. */
  canScheduleExact(): Promise<boolean>;
};

/**
 * Reaches the native module without making it a hard dependency.
 *
 * `expo` cannot be imported on the web, and the module does not exist in Expo
 * Go, so this is looked up lazily and allowed to be missing.
 */
function bridge(): AlarmBridge | null {
  if (Platform.OS !== 'android') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { requireNativeModule } = require('expo');
    const mod = requireNativeModule('DeenAdhanAlarm');
    if (!mod) return null;
    return {
      schedule: (itemsJson) => mod.schedule(itemsJson),
      cancel: () => mod.cancel(),
      canScheduleExact: () => mod.canScheduleExact(),
    };
  } catch {
    return null;
  }
}

export function isAdhanAlarmAvailable(): boolean {
  return bridge() !== null;
}

/**
 * Hands the prayer times to the system.
 *
 * A prayer whose recording is not on the device yet is skipped rather than
 * scheduled: an alarm that fires and plays nothing is worse than a reminder
 * with the system tone, which is what the notification then falls back to.
 */
export async function scheduleAdhanAlarms(
  entries: { at: number; prayerName: string; fajrId: string; adhanId: string; title: string }[],
): Promise<{ scheduled: number; skipped: number }> {
  const native = bridge();
  if (!native) return { scheduled: 0, skipped: entries.length };

  const items: AlarmScheduleItem[] = [];
  let skipped = 0;
  for (const entry of entries) {
    const track: AdhanTrack = entry.prayerName === 'Fajr'
      ? adhanTrack(entry.fajrId, adhanTrack('fajr:traditional', undefined as any))
      : adhanTrack(entry.adhanId, adhanTrack('adhan:mishary-rashid-alafasy', undefined as any));
    const file = track && isAdhanCached(track) ? cachedAdhanUri(track) : null;
    if (!file || !track) { skipped += 1; continue; }
    items.push({ at: entry.at, prayer: entry.prayerName, file, title: entry.title });
  }
  if (!items.length) return { scheduled: 0, skipped };

  try {
    const ok = await native.schedule(JSON.stringify(items));
    return { scheduled: ok ? items.length : 0, skipped: ok ? skipped : skipped + items.length };
  } catch {
    return { scheduled: 0, skipped: entries.length };
  }
}

/** Drops every scheduled alarm. Called when adhan is switched off. */
export async function cancelAdhanAlarms(): Promise<void> {
  const native = bridge();
  if (!native) return;
  try { await native.cancel(); } catch { /* nothing scheduled */ }
}

/**
 * Whether this device will let us use exact alarms.
 *
 * Android 12+ grants `SCHEDULE_EXACT_ALARM` by default but lets the user take
 * it away, and some manufacturers refuse it outright. When it is missing the
 * alarm would be late or dropped, so the caller is told and can keep the
 * notification sounding instead.
 */
export async function canScheduleExactAlarms(): Promise<boolean> {
  const native = bridge();
  if (!native) return false;
  try { return await native.canScheduleExact(); } catch { return false; }
}
