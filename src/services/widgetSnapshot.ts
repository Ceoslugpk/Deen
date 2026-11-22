/** Version-one fields remain readable by the existing iOS extension. Android
 * uses the additive calendar/config fields; no saved app records are deleted. */
export const WIDGET_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type WidgetPrayerName = typeof WIDGET_PRAYERS[number];
export type WidgetPrayer = { name: WidgetPrayerName; label: string; time: string; at: number };
export type WidgetAyah = { ref: string; ar: string; text: string; surah: string };
export type WidgetTasbih = { count: number; target: number; label: string };
export type WidgetDay = { date: string; hijri: string; hijriShort: string; gregorian: string; prayers: WidgetPrayer[]; ayah: WidgetAyah | null };
export type WidgetThemeFamily = 'islamic' | 'palestine';
export type WidgetConfig = {
  location: { latitude: number; longitude: number; label?: string; timezone?: string } | null;
  calculationMethod: number; madhab: 'shafi' | 'hanafi'; timeFormat: '12' | '24'; language: string; dark: boolean;
  /** Additive Android appearance. Missing in v1/older v2 means Islamic.
   * Keep `WidgetSnapshot.theme` as light/dark for the unchanged Swift reader. */
  themeFamily?: WidgetThemeFamily;
};
export type WidgetSnapshot = {
  v: 1; updatedAt: number; place: string; method: string; hijri: string; hijriShort: string;
  today: WidgetPrayer[]; tomorrow: WidgetPrayer[]; ayah: WidgetAyah | null; tasbih: WidgetTasbih | null; theme: 'light' | 'dark';
  schema?: 2; timezone?: string; language?: string; date?: string; days?: WidgetDay[]; config?: WidgetConfig; expectedConfig?: string;
};
export function emptySnapshot(): WidgetSnapshot {
  return { v: 1, updatedAt: 0, place: '', method: '', hijri: '', hijriShort: '', today: [], tomorrow: [], ayah: null, tasbih: null, theme: 'light' };
}
export function dateInZone(now: Date, timezone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const part = (key: string) => parts.find(p => p.type === key)?.value || '';
    return `${part('year')}-${part('month')}-${part('day')}`;
  } catch {
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }
}
export function resolveNow(snap: WidgetSnapshot, now: number): { current: WidgetPrayer | null; next: WidgetPrayer | null; until: number } {
  const date = dateInZone(new Date(now), snap.timezone);
  const active = snap.days?.find(day => day.date === date);
  const all = (snap.days?.length ? snap.days.flatMap(day => day.prayers) : [...snap.today, ...snap.tomorrow])
    .filter(p => Number.isFinite(p.at)).sort((a,b) => a.at-b.at);
  // Sunrise remains visible in the schedule; it is not a sixth Salah.
  const next = all.find(p => p.at > now && p.name !== 'Sunrise') ?? null;
  const today = active?.prayers ?? (snap.date && snap.date !== date ? [] : snap.today);
  const current = [...today].reverse().find(p => p.at <= now && p.name !== 'Sunrise') ?? null;
  return { current, next, until: next ? next.at-now : 0 };
}
export function formatUntil(ms: number): string {
  if (ms <= 0) return '';
  const total = Math.floor(ms/60000), h = Math.floor(total/60), m = total%60;
  return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m` : 'now';
}
