import { readJson, writeJson } from './storage';

/** Separate from prayer settings: changing a reporting shortcut must not
 * rewrite a city, notification preference, bookmark or reading position. */
export const SHAKE_REPORT_KEY = '@deen/shake-report/v1';
export type ShakeReportPreference = { enabled: boolean; hydrated: boolean; saving: boolean; saveError: boolean };
export function createShakeReportPreferenceStore(storage = { readJson, writeJson }) {
  let value: ShakeReportPreference = { enabled: false, hydrated: false, saving: false, saveError: false };
  const listeners = new Set<(next: ShakeReportPreference) => void>();
  let hydration: Promise<void> | null = null;
  let revision = 0;
  function emit(patch: Partial<ShakeReportPreference>) { value = { ...value, ...patch }; listeners.forEach(fn => fn(value)); }
  function hydrate(): Promise<void> {
    if (!hydration) hydration = (async () => {
      const before = revision;
      let saved: unknown = false;
      try { saved = await storage.readJson(SHAKE_REPORT_KEY, false); } catch { /* fail closed */ }
      emit({ hydrated: true, ...(before === revision ? { enabled: saved === true } : {}) });
    })();
    return hydration;
  }
  async function setEnabled(enabled: boolean): Promise<boolean> {
    const change = ++revision;
    emit({ enabled: enabled === true, saving: true, saveError: false });
    let saved = false;
    try { saved = await storage.writeJson(SHAKE_REPORT_KEY, enabled === true); } catch { /* keep the session choice and explain */ }
    if (change === revision) emit({ saving: false, saveError: !saved });
    return saved;
  }
  return {
    getSnapshot: () => value,
    subscribe(listener: (next: ShakeReportPreference) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    hydrate, setEnabled,
  };
}
export const shakeReportPreference = createShakeReportPreferenceStore();
