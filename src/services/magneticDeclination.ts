/* Turning a magnetic reading into a true one.
 *
 * The compass in a phone is a magnetometer: it finds magnetic north. Every
 * bearing this app computes — every qibla bearing, every "clockwise from true
 * north" — is measured from true north. The difference is magnetic declination,
 * and it is not a rounding error. It is about 2 degrees in Dubai, 12 in New
 * York, 15 in Seattle, and it drifts a little every year.
 *
 * So there are two different norths in this app and they have to be reconciled
 * before anything is drawn. `trueHeading` below does that. Everything the user
 * sees should be a true heading; the magnetic number should never reach the
 * screen on its own, because a user comparing this app against a map or a
 * physical compass is comparing against true north.
 *
 * The correction is one addition: true = magnetic + declination (east positive,
 * so a west declination subtracts). The work is in knowing the declination,
 * which comes from the WMM coefficients in `wmmCoefficients.ts`.
 */

import {
  MAX_N,
  SIZE,
  WMM_EPOCH,
  WMM_VALID_UNTIL,
  gnmWmm,
  hnmWmm,
  gtnmWmm,
  htnmWmm,
} from './wmmCoefficients';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/* WGS84 ellipsoid, in kilometres. The WMM works on the ellipsoid rather than a
   sphere, and the difference is worth a few tenths of a degree at high
   latitudes — small, but it is free to do properly. */
const GLOBE = { a: 6378.137, b: 6356.7523142, r0: 6371.2 };

const zeros = (rows: number, cols: number) =>
  Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

const P = zeros(SIZE, SIZE);
const DP = zeros(SIZE, SIZE);
const gnm = zeros(SIZE, SIZE);
const hnm = zeros(SIZE, SIZE);
const sm = new Array<number>(SIZE).fill(0);
const cm = new Array<number>(SIZE).fill(0);
const root = new Array<number>(SIZE).fill(0);
const roots: [number, number][][] = zeros(SIZE, SIZE).map((row) =>
  row.map(() => [0, 0] as [number, number]),
);

for (let n = 2; n <= MAX_N; n++) root[n] = Math.sqrt((2.0 * n - 1) / (2.0 * n));
for (let m = 0; m <= MAX_N; m++) {
  const mm = m * m;
  for (let n = Math.max(m + 1, 2); n <= MAX_N; n++) {
    roots[m][n][0] = Math.sqrt((n - 1) * (n - 1) - mm);
    roots[m][n][1] = 1.0 / Math.sqrt(n * n - mm);
  }
}

let cachedYear = Number.NaN;

/** Year as a decimal, so 1 July 2026 is about 2026.5. */
function decimalYear(when?: Date | number): number {
  if (typeof when === 'number' && Number.isFinite(when)) return when;
  const date = when instanceof Date ? when : new Date();
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const now = Date.UTC(
    year,
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );
  return year + (now - start) / (end - start);
}

/* The coefficients are given at the 2025.0 epoch together with their predicted
   yearly drift, so for any other date we advance each one by the elapsed
   fraction. Cached because a compass calls this constantly and the value only
   changes meaningfully over months. */
function advanceCoefficients(year: number) {
  if (year === cachedYear) return;
  cachedYear = year;
  const elapsed = year - WMM_EPOCH;
  for (let n = 1; n <= MAX_N; n++) {
    for (let m = 0; m <= n; m++) {
      gnm[n][m] = gnmWmm[n][m] + elapsed * gtnmWmm[n][m];
      hnm[n][m] = hnmWmm[n][m] + elapsed * htnmWmm[n][m];
    }
  }
}

export type MagneticField = {
  /** Angle from true north to magnetic north, degrees. East positive. */
  declination: number;
  /** Angle the field makes with the horizontal, degrees. Downward positive. */
  inclination: number;
  /** Total field strength in nanoteslas. */
  intensity: number;
  /** Horizontal field strength in nanoteslas. */
  horizontal: number;
  year: number;
};

export function magneticField(
  latitude: number,
  longitude: number,
  when?: Date | number,
  altitudeKm = 0,
): MagneticField {
  const year = decimalYear(when);
  advanceCoefficients(year);

  const latRad = latitude * DEG_TO_RAD;
  const lonRad = longitude * DEG_TO_RAD;
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);

  const sr = Math.sqrt(GLOBE.a ** 2 * cosLat ** 2 + GLOBE.b ** 2 * sinLat ** 2);
  const theta = Math.atan2(
    cosLat * (altitudeKm * sr + GLOBE.a ** 2),
    sinLat * (altitudeKm * sr + GLOBE.b ** 2),
  );
  const r = Math.sqrt(
    altitudeKm ** 2 +
      2 * altitudeKm * sr +
      (GLOBE.a ** 4 - (GLOBE.a ** 4 - GLOBE.b ** 4) * sinLat ** 2) /
        (GLOBE.a ** 2 - (GLOBE.a ** 2 - GLOBE.b ** 2) * sinLat ** 2),
  );

  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const invS = 1 / (s + (s === 0 ? 1e-8 : 0));

  P[0][0] = 1;
  P[1][1] = s;
  DP[0][0] = 0;
  DP[1][1] = c;
  P[1][0] = c;
  DP[1][0] = -s;

  for (let n = 2; n <= MAX_N; n++) {
    P[n][n] = P[n - 1][n - 1] * s * root[n];
    DP[n][n] = (DP[n - 1][n - 1] * s + P[n - 1][n - 1] * c) * root[n];
  }

  for (let m = 0; m <= MAX_N; m++) {
    for (let n = Math.max(m + 1, 2); n <= MAX_N; n++) {
      P[n][m] = (P[n - 1][m] * c * (2 * n - 1) - P[n - 2][m] * roots[m][n][0]) * roots[m][n][1];
      DP[n][m] =
        ((DP[n - 1][m] * c - P[n - 1][m] * s) * (2 * n - 1) - DP[n - 2][m] * roots[m][n][0]) *
        roots[m][n][1];
    }
  }

  for (let m = 0; m <= MAX_N; m++) {
    sm[m] = Math.sin(m * lonRad);
    cm[m] = Math.cos(m * lonRad);
  }

  let bR = 0;
  let bTheta = 0;
  let bPhi = 0;
  const fn0 = GLOBE.r0 / r;
  let fn = fn0 ** 2;

  for (let n = 1; n <= MAX_N; n++) {
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    for (let m = 0; m <= n; m++) {
      const term = gnm[n][m] * cm[m] + hnm[n][m] * sm[m];
      c1 += term * P[n][m];
      c2 += term * DP[n][m];
      c3 += m * (gnm[n][m] * sm[m] - hnm[n][m] * cm[m]) * P[n][m];
    }
    fn *= fn0;
    bR += (n + 1) * c1 * fn;
    bTheta -= c2 * fn;
    bPhi += c3 * fn * invS;
  }

  const psi = theta - (Math.PI / 2 - latRad);
  const sinPsi = Math.sin(psi);
  const cosPsi = Math.cos(psi);
  const x = -bTheta * cosPsi - bR * sinPsi;
  const y = bPhi;
  const z = bTheta * sinPsi - bR * cosPsi;
  const horizontal = Math.hypot(x, y);

  return {
    declination: x !== 0 || y !== 0 ? Math.atan2(y, x) * RAD_TO_DEG : 0,
    inclination: horizontal !== 0 || z !== 0 ? Math.atan2(z, horizontal) * RAD_TO_DEG : 0,
    intensity: Math.hypot(horizontal, z),
    horizontal,
    year,
  };
}

/** Declination in degrees at a place and time. East positive, west negative. */
export function magneticDeclination(
  latitude: number,
  longitude: number,
  when?: Date | number,
): number {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return 0;
  return magneticField(latitude, longitude, when).declination;
}

/**
 * Magnetic heading in, true heading out. Angles in degrees, 0-360 both ways.
 * This is the only place the two norths are allowed to meet.
 */
export function trueHeading(magnetic: number, declination: number): number {
  if (!Number.isFinite(magnetic) || !Number.isFinite(declination)) return magnetic;
  return (magnetic + declination + 360) % 360;
}

/** Does the model still claim to describe today's field? */
export function wmmIsCurrent(when?: Date | number): boolean {
  const year = decimalYear(when);
  return year >= WMM_EPOCH && year < WMM_VALID_UNTIL;
}
