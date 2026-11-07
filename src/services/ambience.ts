/**
 * What, if anything, should be drifting across the Home screen today.
 *
 * Two calendars run through this app at once and this is where they meet.
 * The Hijri one carries the occasions — Ramadan, the two Eids, Muharram —
 * and it moves against the solar year, sliding through every season over a
 * lifetime. The Gregorian one carries the weather. Both are real, so both
 * get a say, and the occasion wins whenever the two disagree: on Eid you
 * get confetti and not snow, even when Eid falls in December.
 *
 * The order matters and is the whole of the design here.
 *
 * Muharram comes first and returns nothing. Ashura falls on its tenth. A
 * month that many Muslims spend in mourning should not have confetti
 * drifting over it, and the only way to guarantee that is to put it ahead
 * of everything else, including the two Eids.
 *
 * Then the Eids, then Ramadan, then the season. Everything after Muharram
 * can be outvoted by what is above it, and nothing can outvote Muharram.
 */

import { eidToday } from './eid';
import { hijriForDate } from './hijri';
import { seasonFor, type Season } from './season';

export type Ambience =
  /** The two Eids. A single burst, and the only one-shot here. */
  | 'confetti'
  /** The month of Ramadan. Slow warm light, falling. */
  | 'ramadan'
  /** December to February, away from the equator. */
  | 'snow'
  /** March to May. */
  | 'petals'
  /** June to August. Rises rather than falls — heat and light, not weather. */
  | 'motes'
  /** September to November. */
  | 'leaves';

const SEASON_AMBIENCE: Record<Season, Ambience> = {
  winter: 'snow',
  spring: 'petals',
  summer: 'motes',
  autumn: 'leaves',
};

/** True for the effects that loop for as long as the screen is up. */
export function isAmbient(kind: Ambience | null): boolean {
  return kind !== null && kind !== 'confetti';
}

export function ambienceFor(now: Date, latitude?: number | null): Ambience | null {
  const h = hijriForDate(now);
  if (!h) return null;

  if (h.month === 1) return null; // Muharram — Ashura falls on its tenth.
  if (eidToday(now)) return 'confetti';
  if (h.month === 9) return 'ramadan';

  const season = seasonFor(now, latitude);
  return season ? SEASON_AMBIENCE[season] : null;
}
