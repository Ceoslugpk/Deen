/**
 * Builds the widget snapshot from the app's own state, and publishes it.
 *
 * The widgets need the times as *instants*, not as strings — a widget has to
 * work out for itself which prayer is next, because it may be drawn hours
 * after the app last ran and a "next" decided then would be wrong by then.
 * `PrayerSnapshot` carries strings, so the instants are recomputed here with
 * the same call the Prayer screen's calculation goes through. It is a handful
 * of arithmetic on the device and it means the two can never disagree.
 *
 * Tomorrow is published alongside today for one reason: after Isha there is no
 * "next" left in today's list, and a widget that answers "—" from Maghrib
 * until midnight is a widget that is wrong for a third of the day.
 */
import { computeDayDates, computeDayTimes, hijriLabel, methodName } from './prayerTimes';
import type { PrayerSnapshot } from './api';
import type { DailyAyah } from './api';
import {
  publishSnapshotJson,
  startActivity,
} from './widgetBridge';
import {
  resolveNow,
  WIDGET_PRAYERS,
  type WidgetSnapshot,
  type WidgetPrayer,
  type WidgetTasbih,
} from './widgetSnapshot';

export type WidgetSyncInput = {
  location: { latitude: number; longitude: number; label?: string; timezone?: string } | null;
  calculationMethod: number;
  madhab: 'shafi' | 'hanafi';
  timeFormat: '12' | '24';
  snapshot: PrayerSnapshot | null;
  ayah: DailyAyah | null;
  /** Localised: 'الفجر'. Falls back to the English key when not given. */
  labelFor?: (name: string) => string;
  tasbih?: WidgetTasbih | null;
  dark?: boolean;
  /** Whether to put the countdown on the Lock Screen. iOS only. */
  liveActivity?: boolean;
};

function displayTime(raw: string, timeFormat: '12' | '24'): string {
  if (!raw || raw === '--:--') return '--:--';
  const [h, m] = raw.split(':').map(Number);
  if (timeFormat === '24') return raw;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * One day's six, as instants and as strings.
 *
 * `computeDayDates` gives the real `Date`s the widget compares against its own
 * clock; `computeDayTimes` gives the strings it shows. Both come from the same
 * parameters, so the number and the label cannot drift apart.
 */
function day(
  latitude: number,
  longitude: number,
  date: Date,
  method: number,
  school: 'shafi' | 'hanafi',
  timeFormat: '12' | '24',
  labelFor: (name: string) => string,
): WidgetPrayer[] {
  const times = computeDayTimes(latitude, longitude, date, method, school);
  const dates = computeDayDates(latitude, longitude, date, method, school);
  return WIDGET_PRAYERS.map((name) => ({
    name,
    label: labelFor(name),
    time: displayTime(times[name], timeFormat),
    at: (dates[name] instanceof Date ? dates[name] : new Date(NaN)).getTime(),
  })).filter((p) => Number.isFinite(p.at));
}

/** '29 Jumādá al-ūlá 1448 AH' → '29 Jumādá al-ūlá'. */
function shortenHijri(full: string): string {
  return full.replace(/\s+\d{3,4}\s*(AH|هـ)\s*$/, '').trim();
}

export function buildWidgetSnapshot(input: WidgetSyncInput): WidgetSnapshot | null {
  const { location, snapshot } = input;
  if (!location || !snapshot) return null;

  const labelFor = input.labelFor ?? ((name: string) => name);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const today = day(
    location.latitude,
    location.longitude,
    now,
    input.calculationMethod,
    input.madhab,
    input.timeFormat,
    labelFor,
  );
  const next = day(
    location.latitude,
    location.longitude,
    tomorrow,
    input.calculationMethod,
    input.madhab,
    input.timeFormat,
    labelFor,
  );

  if (!today.length) return null;

  const ayah = input.ayah
    ? {
        ref: input.ayah.reference || '',
        ar: input.ayah.arabic || '',
        text: input.ayah.translation || '',
        // The reference the app shows is '2:255'; the surah name is the part
        // that makes it read as something. Taken from the reference itself
        // rather than looked up, so no extra fetch stands between the app and
        // a widget that has already been handed everything else.
        surah: '',
      }
    : null;

  return {
    v: 1,
    updatedAt: Date.now(),
    place: location.label || '',
    method: methodName(input.calculationMethod),
    hijri: snapshot.hijri || '',
    hijriShort: shortenHijri(snapshot.hijri || ''),
    today,
    tomorrow: next,
    ayah,
    tasbih: input.tasbih ?? null,
    theme: input.dark ? 'dark' : 'light',
  };
}

/**
 * Builds and publishes, and puts the countdown on the Lock Screen.
 *
 * One call, called from wherever the times or the ayah change. It is cheap:
 * a little arithmetic and one write to a preference file, guarded so that
 * publishing the same snapshot twice does not redraw the widgets twice.
 */
export async function syncWidgets(input: WidgetSyncInput): Promise<boolean> {
  const snap = buildWidgetSnapshot(input);
  if (!snap) return false;

  const published = await publishSnapshotJson(JSON.stringify(snap));
  if (!published) return false;

  if (input.liveActivity !== false) {
    const now = resolveNow(snap, Date.now());
    if (now.next) {
      await startActivity({
        name: now.next.label,
        time: now.next.time,
        nextAt: now.next.at,
        place: snap.place,
        method: snap.method,
      });
    }
  }
  return true;
}
