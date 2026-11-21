import { createShakeDetector, SHAKE_COOLDOWN_MS, type Acceleration } from './shakeDetection';

export type ShakeReportPolicy = { enabled: boolean; active: boolean; blocked: boolean; contextKey: string };
export type ShakeReportSnapshot = { visible: boolean; busy: boolean; error: boolean; unavailable: boolean };
type Dependencies = {
  available: () => Promise<boolean>;
  subscribe: (listener: (sample: Acceleration) => void) => { remove: () => void };
  canPresent: () => boolean;
  openForm: () => Promise<void>;
  changed: (next: ShakeReportSnapshot) => void;
  now?: () => number;
  schedule?: (fn: () => void, ms: number) => any;
  unschedule?: (id: any) => void;
};

/** Lifecycle/confirmation state machine, separated from native bridges so
 * cancellation, background races and browser errors can be tested exactly. */
export function createShakeReportController(deps: Dependencies) {
  const now = deps.now || Date.now;
  const schedule = deps.schedule || setTimeout;
  const unschedule = deps.unschedule || clearTimeout;
  const detector = createShakeDetector();
  let policy: ShakeReportPolicy = { enabled: false, active: false, blocked: true, contextKey: '' };
  let snapshot: ShakeReportSnapshot = { visible: false, busy: false, error: false, unavailable: false };
  let subscription: { remove: () => void } | null = null;
  let timer: any = null, watchdog: any = null;
  let checking = false, disposed = false, opening = false;
  let generation = 0, cooldownUntil = 0;
  const eligible = () => !disposed && policy.enabled && policy.active && !policy.blocked && deps.canPresent();
  function emit(patch: Partial<ShakeReportSnapshot>) {
    if (disposed) return;
    const next = { ...snapshot, ...patch };
    if (Object.keys(next).every(k => next[k as keyof ShakeReportSnapshot] === snapshot[k as keyof ShakeReportSnapshot])) return;
    snapshot = next; deps.changed(snapshot);
  }
  function stop() {
    generation++; checking = false; detector.reset();
    if (timer !== null) unschedule(timer);
    if (watchdog !== null) unschedule(watchdog);
    timer = watchdog = null;
    const old = subscription; subscription = null;
    try { old?.remove(); } catch { /* a missing sensor must not take down the app */ }
  }
  function close() {
    if (snapshot.visible) cooldownUntil = now() + SHAKE_COOLDOWN_MS;
    emit({ visible: false, error: false });
  }
  function reconcile() {
    if (!eligible()) { stop(); close(); return; }
    if (snapshot.visible || opening || checking || subscription || snapshot.unavailable || timer !== null) return;
    const remaining = cooldownUntil - now();
    if (remaining > 0) { timer = schedule(() => { timer = null; reconcile(); }, remaining); return; }
    checking = true;
    const attempt = ++generation;
    void (async () => {
      let available = false;
      try { available = await deps.available(); } catch { /* no sensor */ }
      if (disposed || attempt !== generation) return;
      checking = false;
      if (!eligible()) { stop(); return; }
      if (!available) { emit({ unavailable: true }); return; }
      try {
        subscription = deps.subscribe(sample => {
          if (attempt !== generation || disposed) return;
          if (!eligible()) { reconcile(); return; }
          if (watchdog !== null) { unschedule(watchdog); watchdog = null; }
          if (!detector.add(sample, now())) return;
          // Pause sampling while asking. A shake never opens the browser.
          stop(); cooldownUntil = now() + SHAKE_COOLDOWN_MS;
          emit({ visible: true, error: false });
        });
        // Some devices advertise a sensor but never deliver a sample.
        watchdog = schedule(() => { watchdog = null; stop(); emit({ unavailable: true }); }, 5_000);
      } catch { stop(); emit({ unavailable: true }); }
    })();
  }
  function update(next: ShakeReportPolicy) {
    if (disposed) return;
    const changed = Object.keys(next).some(k => next[k as keyof ShakeReportPolicy] !== policy[k as keyof ShakeReportPolicy]);
    if (changed) {
      stop();
      const leftContext = policy.contextKey !== next.contextKey;
      policy = next;
      if (leftContext || !eligible()) close();
      emit({ unavailable: false }); // Retry only after a real lifecycle/setting change.
    }
    reconcile();
  }
  function cancel() { if (disposed) return; close(); reconcile(); }
  async function confirm() {
    if (disposed || opening || !snapshot.visible) return;
    if (!eligible()) { reconcile(); return; }
    opening = true; emit({ busy: true, error: false });
    const contextKey = policy.contextKey;
    try { await deps.openForm(); close(); }
    catch {
      // A late failure cannot resurrect a prompt over a lock or another screen.
      if (eligible() && contextKey === policy.contextKey && snapshot.visible) emit({ error: true });
    }
    finally { opening = false; emit({ busy: false }); reconcile(); }
  }
  function dispose() { if (disposed) return; stop(); disposed = true; }
  return { update, cancel, confirm, dispose, getSnapshot: () => snapshot };
}
