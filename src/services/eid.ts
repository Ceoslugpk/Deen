/**
 * Whether today is one of the two Eids.
 *
 * Both are fixed days of the Hijri year: Eid al-Fitr is the first of Shawwal
 * and Eid al-Adha is the tenth of Dhu al-Hijjah. The app already carries an
 * Umm al-Qura table good through 1461, so this is a lookup and not a
 * calculation, and it needs no connection — which matters here for the same
 * reason it matters for prayer times. A day that does not wait for a signal
 * should not depend on one.
 *
 * Only the day itself counts, not the days of celebration around it. Eid is
 * a season in practice, but the burst is a greeting: it lands once, on the
 * morning, and leaves the rest of the days alone. Widening it to the three
 * days of Shawwal or the four of Dhu al-Hijjah is a change to the two tests
 * below and nothing else.
 *
 * The `id` is what makes the greeting fire once. It names the Eid rather
 * than the day, so opening the app ten times on Eid morning does not start
 * ten bursts, and it changes on its own when the next Eid comes round — no
 * date arithmetic, no expiry, no cleanup.
 */

import { hijriForDate } from './hijri';

export type Eid = {
  /** Stable for one Eid, e.g. "1447-fitr". Changes only when the Eid does. */
  id: string;
  kind: 'fitr' | 'adha';
};

/**
 * The Eid falling on this day, or null when it is an ordinary one.
 *
 * `now` is a parameter because the only honest test of this is a test that
 * can name its own day.
 */
export function eidToday(now: Date = new Date()): Eid | null {
  const h = hijriForDate(now);
  if (!h) return null;
  if (h.month === 10 && h.day === 1) return { id: `${h.year}-fitr`, kind: 'fitr' };
  if (h.month === 12 && h.day === 10) return { id: `${h.year}-adha`, kind: 'adha' };
  return null;
}
