/**
 * What, if anything, should be drifting across the Home screen today.
 *
 * Only the Hijri calendar reaches this screen now. The seasonal layer is
 * gone. Reading the weather meant carrying a table that put snow on one
 * half of the world and nothing at all on the other, and the weather
 * outside somebody's window was never this app's business.
 *
 * What is left is the calendar's own.
 *
 * Muharram comes first and returns nothing. Ashura falls on its tenth. A
 * month that many Muslims spend in mourning should not have confetti
 * drifting over it, and the only way to guarantee that is to put it ahead
 * of everything else, including the two Eids.
 *
 * Then the Eids, then Ramadan. What used to come last — the season — was
 * the only thing that depended on where a person was standing, and with it
 * gone this needs no latitude at all.
 */

import { eidToday } from './eid';
import { hijriForDate } from './hijri';

export type Ambience =
  /** The two Eids. A single burst, and the only one-shot here. */
  | 'confetti'
  /** The month of Ramadan. Slow warm light, falling. */
  | 'ramadan';

export function ambienceFor(now: Date): Ambience | null {
  const h = hijriForDate(now);
  if (!h) return null;

  if (h.month === 1) return null; // Muharram — Ashura falls on its tenth.
  if (eidToday(now)) return 'confetti';
  if (h.month === 9) return 'ramadan';

  return null;
}
