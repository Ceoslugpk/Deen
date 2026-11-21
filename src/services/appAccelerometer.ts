import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';
import type { Acceleration } from './shakeDetection';

type Sensor = {
  setUpdateInterval: (milliseconds: number) => void;
  addListener: (listener: (sample: Acceleration) => void) => { remove: () => void };
};

/** One native subscription and one interval owner for Qibla and the optional
 * shortcut. The fastest *active* consumer wins; each removes only itself.
 * No removeAllListeners, no per-sample React updates, no hidden second rate. */
export function createAccelerometerBroker(sensor: Sensor) {
  const consumers = new Map<symbol, { interval: number; listener: (sample: Acceleration) => void }>();
  let subscription: { remove: () => void } | null = null;
  let interval: number | null = null;
  function updateRate() {
    if (!consumers.size) { interval = null; return; }
    const next = Math.min(...Array.from(consumers.values(), c => c.interval));
    if (next !== interval) { sensor.setUpdateInterval(next); interval = next; }
  }
  function subscribe(listener: (sample: Acceleration) => void, requestedInterval: number) {
    if (!Number.isFinite(requestedInterval) || requestedInterval < 20) throw new Error('Ordinary-rate accelerometer subscription required');
    const key = Symbol();
    consumers.set(key, { interval: requestedInterval, listener });
    try {
      updateRate();
      if (!subscription) subscription = sensor.addListener(sample => {
        for (const [id, consumer] of Array.from(consumers)) {
          if (consumers.has(id)) consumer.listener(sample);
        }
      });
    } catch (error) { consumers.delete(key); updateRate(); throw error; }
    let removed = false;
    return { remove() {
      if (removed) return;
      removed = true; consumers.delete(key);
      if (!consumers.size) {
        try { subscription?.remove(); } finally { subscription = null; interval = null; }
      } else updateRate();
    } };
  }
  return { subscribe };
}

const broker = createAccelerometerBroker(Accelerometer);
export const subscribeAppAccelerometer = broker.subscribe;

/** Never probes web DeviceMotion or asks for any permission. Failure/denial
 * leaves the manual reporting action usable. A timeout bounds startup. */
export async function isAppAccelerometerAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const available = Promise.all([Accelerometer.isAvailableAsync(), Accelerometer.getPermissionsAsync()])
      .then(([present, permission]) => present && permission.granted === true);
    return await Promise.race([available, new Promise<boolean>(resolve => { timer = setTimeout(() => resolve(false), 2_000); })]);
  } catch { return false; }
  finally { if (timer !== undefined) clearTimeout(timer); }
}
