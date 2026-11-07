/**
 * Which season it is where this person actually is.
 *
 * Seasons are the one thing in this app that are not on the Hijri calendar.
 * Ramadan moves through all four of them over a lifetime; snow does not. So
 * this reads the Gregorian month, which is the calendar the weather is on,
 * and it is the only place in the app that does.
 *
 * Two things make it more than a lookup:
 *
 * The season is flipped below the equator. A fixed northern table would put
 * snow on Sydney in July, and the app already knows the latitude — it stores
 * one for prayer times — so there is no reason to get that wrong.
 *
 * Near the equator there is no season to show. Jakarta and Colombo do not
 * have a winter; they have a wet season and a dry one, and neither of those
 * has a picture that means anything. Showing snow there would be a lie about
 * the weather outside somebody's window, so it shows nothing instead. That
 * costs Indonesia and Malaysia their seasonal layer, which is a real loss,
 * and it is still the honest answer — Eid and Ramadan reach them either way,
 * because those are not weather.
 */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

/**
 * Below this the year has no thermal seasons, only wet and dry. Fifteen
 * degrees is generous on purpose: it keeps Colombo and Panama out while
 * leaving Cairo and Karachi in, and both of those do get a winter.
 */
const EQUATOR = 15;

export function seasonFor(now: Date, latitude?: number | null): Season | null {
  if (typeof latitude !== 'number' || !Number.isFinite(latitude)) return null;
  if (Math.abs(latitude) < EQUATOR) return null;

  const month = now.getMonth(); // 0 = January
  /* Six months out of phase in the southern half of the world. December in
     Auckland is July in London, moved on by half a year. */
  const index = latitude < 0 ? (month + 6) % 12 : month;

  // Northern reading: Dec Jan Feb / Mar Apr May / Jun Jul Aug / Sep Oct Nov.
  if (index === 11 || index <= 1) return 'winter';
  if (index <= 4) return 'spring';
  if (index <= 7) return 'summer';
  return 'autumn';
}
