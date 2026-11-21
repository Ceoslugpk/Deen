/** Local, bounded-memory signal processing. Values are in g, never location.
 * These are conservative starting thresholds, not Instagram's algorithm or a
 * claim of physical-device calibration. No sample or gesture is persisted. */
export type Acceleration = { x: number; y: number; z: number };
export const SHAKE_SAMPLE_INTERVAL_MS = 40; // 25 Hz; no high-rate permission.
export const SHAKE_COOLDOWN_MS = 20_000;
const WARMUP_MS = 600;
const WINDOW_MS = 1_250;
const MIN_PEAK_GAP_MS = 110;
const HIGH_G = 1.6;
const LOW_G = 0.75;

type Peak = { at: number; direction: Acceleration };
export function createShakeDetector() {
  let gravity: Acceleration | null = null;
  let lastAt: number | null = null;
  let seededAt = 0;
  let armed = true;
  let peaks: Peak[] = [];
  function reset() { gravity = null; lastAt = null; seededAt = 0; armed = true; peaks = []; }
  function add(sample: Acceleration, at: number): boolean {
    const { x, y, z } = sample;
    const total = Math.hypot(x, y, z);
    if (![x, y, z, at].every(Number.isFinite) || total < 0.2 || total > 8) { reset(); return false; }
    if (!gravity || lastAt === null || at - lastAt > 300 || at < lastAt) {
      gravity = { x, y, z }; lastAt = seededAt = at; peaks = []; armed = true; return false;
    }
    const dt = at - lastAt;
    if (dt < 15) return false; // Duplicate/batched events cannot become peaks.
    lastAt = at;
    const alpha = dt / (250 + dt);
    gravity = { x: gravity.x + alpha * (x - gravity.x), y: gravity.y + alpha * (y - gravity.y), z: gravity.z + alpha * (z - gravity.z) };
    if (at - seededAt < WARMUP_MS) return false;
    const linear = { x: x - gravity.x, y: y - gravity.y, z: z - gravity.z };
    const magnitude = Math.hypot(linear.x, linear.y, linear.z);
    peaks = peaks.filter(p => at - p.at <= WINDOW_MS);
    if (magnitude < LOW_G) { armed = true; return false; }
    if (!armed || magnitude < HIGH_G) return false;
    armed = false;
    const previous = peaks[peaks.length - 1];
    if (previous && at - previous.at < MIN_PEAK_GAP_MS) return false;
    const direction = { x: linear.x / magnitude, y: linear.y / magnitude, z: linear.z / magnitude };
    if (previous) {
      const dot = previous.direction.x * direction.x + previous.direction.y * direction.y + previous.direction.z * direction.z;
      // Repeated bumps in one direction are not a back-and-forth shake.
      if (dot > -0.3) { peaks = [{ at, direction }]; return false; }
    }
    peaks.push({ at, direction });
    if (peaks.length < 4 || at - peaks[0].at < 400) return false;
    reset(); return true;
  }
  return { add, reset };
}
