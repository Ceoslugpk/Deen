/** Widgets use the existing prayer calculator and Hijri table. No network,
 * location sensor, second calculation method, or Home-screen dependency. */
import { Platform } from 'react-native';
import { computeDayDates, computeDayTimes, methodName } from './prayerTimes';
import { hijriForDate } from './hijri';
import { tx } from './arabicCopy';
import { loadDailyContent } from './localState';
import type { DailyAyah, PrayerSnapshot } from './api';
import { loadWidgetLanguage, prayerName } from './widgetCopy';
import { publishSnapshotJson, readSnapshotJson, startActivity, widgetsAvailable } from './widgetBridge';
import { dateInZone, resolveNow, WIDGET_PRAYERS, type WidgetSnapshot, type WidgetDay, type WidgetAyah, type WidgetTasbih, type WidgetConfig } from './widgetSnapshot';

export const WIDGET_HORIZON_DAYS = 32;
export type WidgetSyncInput = Omit<WidgetConfig, 'language' | 'dark'> & {
  language?: string; dark?: boolean; snapshot?: PrayerSnapshot | null; ayah?: DailyAyah | null;
  ayahDate?: string; labelFor?: (name: string) => string; tasbih?: WidgetTasbih | null; liveActivity?: boolean;
  daily?: Record<string, DailyAyah | undefined>; expectedConfig?: string;
};
function zone(input: WidgetSyncInput): string {
  const requested = input.location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  try { new Intl.DateTimeFormat('en', { timeZone: requested }).format(); return requested; } catch { return 'UTC'; }
}
function ayahValue(value?: DailyAyah | null): WidgetAyah | null {
  if (!value || (!value.arabic && !value.translation)) return null;
  return { ref: value.reference || '', ar: value.arabic || '', text: value.translation || '', surah: '' };
}
function time(raw: string, format: '12' | '24', language: string): string {
  if (!raw || raw === '--:--') return '--:--';
  if (format === '24') return raw;
  const [h,m] = raw.split(':').map(Number);
  return `${h%12 || 12}:${String(m).padStart(2,'0')} ${tx(language, h>=12 ? 'PM' : 'AM')}`;
}
let calendarCache: { key: string; days: WidgetDay[]; builtAt: number } | undefined;
export function buildWidgetSnapshot(input: WidgetSyncInput, now = new Date()): WidgetSnapshot {
  const timezone = zone(input), language = input.language || 'en', date = dateInZone(now, timezone);
  const config: WidgetConfig = { location: input.location, calculationMethod: input.calculationMethod, madhab: input.madhab, timeFormat: input.timeFormat, language, dark: input.dark === true };
  const key = JSON.stringify({ ...config, date, timezone });
  if (calendarCache?.key !== key) {
    const [y,m,d] = date.split('-').map(Number);
    const valid = input.location && Number.isFinite(input.location.latitude) && Number.isFinite(input.location.longitude)
      && Math.abs(input.location.latitude)<=90 && Math.abs(input.location.longitude)<=180;
    const days: WidgetDay[] = [];
    for (let offset=0; offset<WIDGET_HORIZON_DAYS; offset++) {
      // Calculator reads local Y/M/D. Construct the selected city's calendar
      // day in the device zone, NOT midnight UTC and not now in the phone zone.
      const day = new Date(y,m-1,d+offset,12), key = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
      const h = hijriForDate(day), month = h ? tx(language, h.monthName) : '';
      const hijriShort = h ? `${h.day} ${month}` : '';
      const times = valid ? computeDayTimes(input.location!.latitude,input.location!.longitude,day,input.calculationMethod,input.madhab,timezone) : null;
      const dates = valid ? computeDayDates(input.location!.latitude,input.location!.longitude,day,input.calculationMethod,input.madhab) : null;
      let gregorian: string;
      try { gregorian = new Intl.DateTimeFormat(language==='uz'?'uz-Cyrl':language==='kk'?'kk-Cyrl':language,{weekday:'short',day:'numeric',month:'long',year:'numeric'}).format(day); } catch { gregorian=key; }
      days.push({date:key,hijri:h ? `${hijriShort} ${h.year}` : '',hijriShort,gregorian,ayah:null,
        prayers: times && dates ? WIDGET_PRAYERS.map(name=>({name,label:input.labelFor?.(name) ?? prayerName(language,name),time:time(times[name],input.timeFormat,language),at:dates[name].getTime()})).filter(p=>Number.isFinite(p.at)) : []});
    }
    calendarCache = {key,days,builtAt:now.getTime()};
  }
  const days = calendarCache.days.map(day=>({...day,ayah:ayahValue(input.daily?.[day.date] ?? (day.date===(input.ayahDate || date) ? input.ayah : null))}));
  return {v:1,schema:2,...(input.expectedConfig ? {expectedConfig:input.expectedConfig} : {}),updatedAt:calendarCache.builtAt,place:input.location?.label || '',method:tx(language,methodName(input.calculationMethod)),
    hijri:days[0].hijri,hijriShort:days[0].hijriShort,today:days[0].prayers,tomorrow:days[1].prayers,
    ayah:days[0].ayah,tasbih:input.tasbih ?? null,theme:input.dark ? 'dark' : 'light',timezone,language,date,days,config};
}
let lastInput: WidgetSyncInput | undefined;
let syncQueue: Promise<unknown> = Promise.resolve();
export function syncWidgets(input: WidgetSyncInput): Promise<boolean> {
  if (!input.expectedConfig) lastInput = input;
  const work = syncQueue.then(async()=>{
    if (!widgetsAvailable()) return false;
    await loadWidgetLanguage(input.language || 'en');
    const daily: Record<string, DailyAyah | undefined> = {};
    const skeleton = buildWidgetSnapshot(input);
    // localState stores one dated daily-content envelope, not 32 files.
    // Read it once; native retains a genuinely older verse as "Saved ayah".
    const cached = await loadDailyContent<{ayah?:DailyAyah}>(skeleton.date!).catch(()=>null);
    if (cached?.ayah) daily[skeleton.date!] = cached.ayah;
    let counter = input.tasbih;
    if (Platform.OS === 'ios') {
      // Swift keeps its established timestamped AppGroup counter contract.
      // Even a Home Ayah/theme publication must adopt it before rewriting the
      // full v1 snapshot; Android uses the independent native state instead.
      const { loadTasbihState, currentPhrase } = require('./tasbihService') as typeof import('./tasbihService');
      const adopted = await loadTasbihState();
      counter = {count:adopted.count,target:adopted.goal,label:currentPhrase(adopted).transliteration};
    }
    const snap = buildWidgetSnapshot({...input,tasbih:counter,daily:{...daily,...input.daily}});
    const published = await publishSnapshotJson(JSON.stringify(snap));
    if (published && input.liveActivity !== false) {
      const {next} = resolveNow(snap,Date.now());
      if (next) await startActivity({name:next.label,time:next.time,nextAt:next.at,place:snap.place,method:snap.method});
    }
    return published;
  }).catch(()=>false);
  syncQueue = work;
  return work;
}
/** Home only supplies new daily content; prayer publication never waits on it. */
export async function syncWidgetAyah(ayah: DailyAyah, date: string): Promise<boolean> {
  if (!lastInput) return false;
  return syncWidgets({...lastInput,ayah,ayahDate:date});
}
/** Registered background task reuses exactly the same JS calculator/table. */
export async function refreshStoredWidgets(): Promise<boolean> {
  const raw = await readSnapshotJson();
  if (!raw) return false;
  try {
    const previous = JSON.parse(raw) as WidgetSnapshot;
    if (!previous.config) return false;
    return await syncWidgets({...previous.config,tasbih:previous.tasbih,liveActivity:false,expectedConfig:JSON.stringify(previous.config)});
  } catch { return false; }
}
