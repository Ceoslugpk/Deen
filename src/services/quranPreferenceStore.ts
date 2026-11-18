import { DEFAULTS, loadQuranPreferences, saveQuranPreferences, type QuranPreferences } from './quranState';

export type QuranPreferenceSnapshot = { preferences: QuranPreferences; hydrated: boolean };

/** One provider's state. Patch against the latest snapshot, not a render's
 * captured preferences; hydrate once and merge any choices made during the
 * read. Persist only after that read, so a fast tap cannot replace saved
 * unrelated settings with defaults. Disk writes use storage.ts's per-key queue. */
export function createQuranPreferenceStore(settle: (value: QuranPreferences) => QuranPreferences = (value) => value) {
  let snapshot: QuranPreferenceSnapshot = { preferences: settle(DEFAULTS), hydrated: false };
  let pending: Partial<QuranPreferences> = {};
  let hydration: Promise<void> | null = null;
  const listeners = new Set<(value: QuranPreferenceSnapshot) => void>();

  function publish(preferences: QuranPreferences, hydrated = snapshot.hydrated) {
    snapshot = { preferences: settle(preferences), hydrated };
    listeners.forEach((listener) => listener(snapshot));
  }

  function hydrate(): Promise<void> {
    if (!hydration) {
      hydration = loadQuranPreferences().then((stored) => {
        const merged = { ...stored, ...pending };
        pending = {};
        publish(merged, true);
      });
    }
    return hydration;
  }

  return {
    getSnapshot: () => snapshot,
    hydrate,
    subscribe(listener: (value: QuranPreferenceSnapshot) => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    async update(patch: Partial<QuranPreferences>): Promise<void> {
      if (!snapshot.hydrated) pending = { ...pending, ...patch };
      publish({ ...snapshot.preferences, ...patch });
      await hydrate();
      await saveQuranPreferences(snapshot.preferences);
    },
  };
}
