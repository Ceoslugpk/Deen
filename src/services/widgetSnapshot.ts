/**
 * The snapshot the home-screen widgets read.
 *
 * A widget is not part of the app. It is drawn by the operating system, in a
 * process the app does not control, at moments the app cannot choose — which
 * means it cannot call anything, await anything, or read AsyncStorage. It gets
 * one thing: a plain value it can read synchronously. That is what this file
 * defines.
 *
 * Two rules keep it honest:
 *
 *   - Everything the widget draws is already formatted. Times arrive as
 *     "05:05", not as timestamps to be rendered. Formatting needs a locale and
 *     a clock style, and a widget that guesses at either will disagree with
 *     the app it came from.
 *   - Everything the widget needs to work out *where it is in the day* is
 *     still here as a number. Times are for showing; `at` is for comparing.
 *
 * The widget works out the current and next prayer itself, from `at` and its
 * own clock. It has to: it may be drawn hours after the app last ran, and a
 * "next prayer" decided then would be wrong by then.
 */

/** The six moments the Prayer screen lists, in the order it lists them. */
export const WIDGET_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export type WidgetPrayerName = (typeof WIDGET_PRAYERS)[number];

export type WidgetPrayer = {
  /** The stable English key: 'Fajr', 'Maghrib'. Never shown as-is. */
  name: WidgetPrayerName;
  /** Already localised and formatted — 'الفجر', 'Fajr'. */
  label: string;
  /** Already formatted for the user's clock — '05:05', '5:05 AM'. */
  time: string;
  /** Epoch milliseconds. This is what the widget compares against its clock. */
  at: number;
};

export type WidgetAyah = {
  /** '2:255' — the reference, shown small above the text. */
  ref: string;
  /** The Arabic, as it appears on the reader's own cards. */
  ar: string;
  /** The translation, or an empty string when the reader is showing none. */
  text: string;
  /** 'Al-Baqarah', so the reference reads as something rather than a number. */
  surah: string;
};

export type WidgetTasbih = {
  /** Where the counter stands right now. */
  count: number;
  /** The goal — 33, 99, or whatever was set. */
  target: number;
  /** 'Subhan Allah', or whatever is being counted. */
  label: string;
};

export type WidgetSnapshot = {
  /** Bumped if the shape ever changes, so an old app and a new widget part
      ways cleanly instead of crashing on a missing field. */
  v: 1;
  /** When the app last wrote this, epoch ms. The widget shows how stale it is. */
  updatedAt: number;
  place: string;
  method: string;
  /** '29 Jumādá al-ūlá 1448 AH'. */
  hijri: string;
  /** '29 Jumādá al-ūlá' — the small widget has no room for the year. */
  hijriShort: string;
  /** Today's six, Fajr first. Empty until the app has a location. */
  today: WidgetPrayer[];
  /** Tomorrow's six, so the widget can answer after Isha without guessing. */
  tomorrow: WidgetPrayer[];
  ayah: WidgetAyah | null;
  tasbih: WidgetTasbih | null;
  /** Which palette to draw with. The widget cannot read the app's theme. */
  theme: 'light' | 'dark';
};

/** What the widgets read when the app has nothing to say yet. */
export function emptySnapshot(): WidgetSnapshot {
  return {
    v: 1,
    updatedAt: 0,
    place: '',
    method: '',
    hijri: '',
    hijriShort: '',
    today: [],
    tomorrow: [],
    ayah: null,
    tasbih: null,
    theme: 'light',
  };
}

/**
 * Which prayer is happening, and which is coming.
 *
 * Written out longhand rather than compactly because this is the one piece of
 * logic the widgets cannot get wrong: Sunrise is in the list but is not a
 * prayer, and after Isha the "next" one belongs to a day that has not started.
 */
export function resolveNow(snap: WidgetSnapshot, now: number): {
  current: WidgetPrayer | null;
  next: WidgetPrayer | null;
  /** Milliseconds until `next`. Zero when there is no next. */
  until: number;
} {
  const all = [...snap.today, ...snap.tomorrow];
  if (!all.length) return { current: null, next: null, until: 0 };

  let current: WidgetPrayer | null = null;
  let next: WidgetPrayer | null = null;

  for (const p of all) {
    if (p.at <= now) current = p;
    else if (!next) next = p;
  }

  /* Before Fajr, `current` is Isha from yesterday's list — but we only hold
     today's and tomorrow's, so there is nothing to name. Leave it empty
     rather than announcing the wrong prayer. */
  if (current && !snap.today.includes(current)) current = null;

  return { current, next, until: next ? Math.max(0, next.at - now) : 0 };
}

/** '2h 14m', '48m', '3m' — the countdown under the next prayer. */
export function formatUntil(ms: number): string {
  if (ms <= 0) return '';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
}
