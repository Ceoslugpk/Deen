import extra from '../data/widgetCopy.json';
import { loadCopy, prayerName, tx } from './arabicCopy';
export async function loadWidgetLanguage(language: string): Promise<void> { await loadCopy(language); }
export function widgetText(language: string) {
  const row = Object.hasOwn(extra, language) ? (extra as Record<string, string[]>)[language] : extra.en;
  return {
    prayer: tx(language, 'Prayer times'), ayah: tx(language, 'Ayah of the day'), tasbih: tx(language, 'Tasbih'),
    hijri: tx(language, 'Hijri Calendar'), next: tx(language, 'Next prayer'), today: tx(language, 'Today'),
    reset: tx(language, 'Reset'), now: row[7], failure: row[8],
    open: row[0], choose: row[1], expired: row[2], error: row[3], counter: row[4], saved: row[5], loading: row[6],
  };
}
export { prayerName };
export const widgetLanguages = Object.keys(extra);
