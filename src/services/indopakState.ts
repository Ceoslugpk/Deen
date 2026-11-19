import { readJson, writeJson } from './storage';
import { INDOPAK_EDITION, validIndopakPage } from './indopakMushaf';

/** Independent edition-specific position/page bookmarks. Existing Quran data is never migrated or cleared. */
export const INDOPAK_STATE_KEY = '@deen/quran/indopak-taj-16/state/v1';
export type IndopakState = { version: 1; edition: typeof INDOPAK_EDITION; page: number; zoom: number; savedPages: number[] };
export function defaultIndopakState(): IndopakState {
  return { version: 1, edition: INDOPAK_EDITION, page: 1, zoom: 1, savedPages: [] };
}
export function normalizeIndopakState(raw: unknown): IndopakState {
  if (!raw || typeof raw !== 'object') return defaultIndopakState();
  const value = raw as Partial<IndopakState>;
  if (value.edition !== INDOPAK_EDITION || value.version !== 1) return defaultIndopakState();
  return { version: 1, edition: INDOPAK_EDITION, page: validIndopakPage(value.page) ? value.page : 1,
    zoom: typeof value.zoom === 'number' && [1, 1.5, 2].includes(value.zoom) ? value.zoom : 1,
    savedPages: Array.isArray(value.savedPages) ? [...new Set(value.savedPages.filter(validIndopakPage))].sort((a, b) => a - b) : [] };
}
export async function loadIndopakState(): Promise<IndopakState> {
  return normalizeIndopakState(await readJson<unknown>(INDOPAK_STATE_KEY, null));
}
/** Only explicit reader actions write; opening this screen never rewrites saved data. */
export function saveIndopakState(value: IndopakState): Promise<boolean> {
  return writeJson(INDOPAK_STATE_KEY, normalizeIndopakState(value));
}
