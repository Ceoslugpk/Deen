import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 4 — fasting record and Qada ledger.
 *
 * A private, on-device record: which days were fasted, why a day was missed, and
 * how many make-up days remain. Nothing is uploaded and no account is involved.
 * The missed-day reasons exist so the make-up ledger can be kept honest — not to
 * give rulings. Anything that depends on a person's situation belongs with a
 * scholar they trust, and the screen says so.
 */

/** The language dates are written in, so a Ramadan row reads in Arabic too. */
let dateLocale: string | undefined;
export function setFastingDateLocale(code?: string) { dateLocale = code; }

export type FastType = 'ramadan' | 'voluntary' | 'qada' | 'missed';
export type MissedReason = 'travel' | 'illness' | 'menstruation' | 'nifas' | 'other';

export type FastEntry = {
  date: string;
  type: FastType;
  reason?: MissedReason;
  note?: string;
  loggedAt: number;
};

export type FastingState = {
  entries: FastEntry[];
  owed: number;
};

export const MISSED_REASONS: { id: MissedReason; label: string; detail: string }[] = [
  { id: 'travel', label: 'Travelling', detail: 'A day missed while on a journey' },
  { id: 'illness', label: 'Illness', detail: 'A day missed through sickness' },
  { id: 'menstruation', label: 'Menstruation', detail: 'A day not fasted during the monthly cycle' },
  { id: 'nifas', label: 'Post-natal', detail: 'A day not fasted after childbirth' },
  { id: 'other', label: 'Other', detail: 'Any other reason' },
];

/** The same list in Arabic, for the Arabic interface. */
const MISSED_REASONS_AR: Record<string, { label: string; detail: string }> = {
  travel: { label: 'سفر', detail: 'يوم أُفطر في سفر' },
  illness: { label: 'مرض', detail: 'يوم أُفطر بسبب المرض' },
  menstruation: { label: 'الحيض', detail: 'يوم لم يُصم في فترة الحيض' },
  nifas: { label: 'النفاس', detail: 'يوم لم يُصم بعد الولادة' },
  other: { label: 'سبب آخر', detail: 'أي سبب آخر' },
};

/* Urdu, kept beside the Arabic for the reason that table exists at all: these
   are short and fixed, and read better written for the language than run
   through the general translator. */
const MISSED_REASONS_UR: Record<string, { label: string; detail: string }> = {
  travel: { label: 'سفر', detail: 'سفر کے دوران چھوڑا گیا دن' },
  illness: { label: 'بیماری', detail: 'بیماری سے چھوڑا گیا دن' },
  menstruation: { label: 'حیض', detail: 'ماہانہ ایام میں رکھا نہ گیا روزہ' },
  nifas: { label: 'نفاس', detail: 'ولادت کے بعد رکھا نہ گیا روزہ' },
  other: { label: 'کوئی اور وجہ', detail: 'کوئی اور وجہ' },
};

/* Persian and Turkish, beside the Arabic for the reason that table exists at
   all: these are short and fixed, and read better written for the language
   than run through the general translator. */
const MISSED_REASONS_FA: Record<string, { label: string; detail: string }> = {
  travel: { label: 'سفر', detail: 'روزی که در سفر افطار شد' },
  illness: { label: 'بیماری', detail: 'روزی که به سبب بیماری افطار شد' },
  menstruation: { label: 'عادت ماهانه', detail: 'روزی که در ایام عادت ماهانه روزه گرفته نشد' },
  nifas: { label: 'نفاس', detail: 'روزی که پس از زایمان روزه گرفته نشد' },
  other: { label: 'دلیل دیگر', detail: 'هر دلیل دیگر' },
};

const MISSED_REASONS_TR: Record<string, { label: string; detail: string }> = {
  travel: { label: 'Yolculuk', detail: 'Yolculuk sırasında tutulmayan gün' },
  illness: { label: 'Hastalık', detail: 'Hastalık sebebiyle tutulmayan gün' },
  menstruation: { label: 'Âdet', detail: 'Âdet döneminde tutulmayan oruç' },
  nifas: { label: 'Lohusalık', detail: 'Doğumdan sonra tutulmayan oruç' },
  other: { label: 'Başka', detail: 'Başka bir sebep' },
};

/**
 * Keyed by language rather than by a direction.
 *
 * This used to take `rtl`, so it could only answer in one of two languages.
 * Urdu is right-to-left as well, so it was being handed the Arabic - which
 * it does not read.
 */
export function missedReasons(language?: string | boolean) {
  const table =
    language === 'fa'
      ? MISSED_REASONS_FA
      : language === 'tr'
        ? MISSED_REASONS_TR
        : language === 'ur'
          ? MISSED_REASONS_UR
      : language === true || language === 'ar'
        ? MISSED_REASONS_AR
        : undefined;
  return MISSED_REASONS.map((item) => {
    const t = table?.[item.id];
    return t ? { ...item, label: t.label, detail: t.detail } : item;
  });
}

const KEY = 'deen-fasting-v1';
const EMPTY: FastingState = { entries: [], owed: 0 };

let state: FastingState = EMPTY;
const listeners = new Set<(next: FastingState) => void>();

export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

function emit(next: FastingState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: FastingState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}


export function subscribeFasting(listener: (next: FastingState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFasting(): FastingState {
  const [value, setValue] = useState<FastingState>(state);
  useEffect(() => {
    setValue(state);
    return subscribeFasting(setValue);
  }, []);
  return value;
}

export async function loadFastingState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    state = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
    if (!Array.isArray(state.entries)) state.entries = [];
  } catch {
    state = { ...EMPTY };
  }
  emit(state);
  return state;
}


/** A missed day adds one to the make-up ledger; a make-up fast settles one. */
function owedAfter(type: FastType, current: number) {
  if (type === 'missed') return current + 1;
  if (type === 'qada') return Math.max(0, current - 1);
  return current;
}

export async function recordFast(type: FastType, options: { date?: string; reason?: MissedReason; note?: string } = {}) {
  const date = options.date || dayKey();
  const existing = state.entries.find((entry) => entry.date === date);
  const entries = state.entries.filter((entry) => entry.date !== date);
  let owed = state.owed;
  if (existing?.type === 'missed') owed = Math.max(0, owed - 1);
  if (existing?.type === 'qada') owed += 1;
  const entry: FastEntry = { date, type, reason: options.reason, note: options.note, loggedAt: Date.now() };
  await persist({ entries: [entry, ...entries].slice(0, 400), owed: owedAfter(type, owed) });
  return state;
}

export async function clearFastDay(date = dayKey()) {
  const existing = state.entries.find((entry) => entry.date === date);
  if (!existing) return state;
  const owed = state.owed + (existing.type === 'missed' ? -1 : 0) + (existing.type === 'qada' ? 1 : 0);
  await persist({ entries: state.entries.filter((entry) => entry.date !== date), owed: Math.max(0, owed) });
  return state;
}

export async function setFastingOwed(value: number) {
  const owed = Math.max(0, Math.min(365, Math.round(value)));
  await persist({ ...state, owed });
  return owed;
}

export type FastingSummary = {
  completed: number;
  ramadan: number;
  voluntary: number;
  qada: number;
  missed: number;
  owed: number;
  streak: number;
  thisWeek: number;
  today: FastEntry | null;
  recent: FastEntry[];
  /** The last six months on record, so the year reads at a glance. */
  months: FastMonth[];
};

/** One month of the record: how many days were fasted, and how many were not. */
export type FastMonth = { key: string; label: string; fasted: number; missed: number };

export function summariseFasting(next: FastingState = state): FastingSummary {
  const entries = next.entries;
  const fasted = entries.filter((entry) => entry.type !== 'missed');
  const counts = {
    ramadan: fasted.filter((entry) => entry.type === 'ramadan').length,
    voluntary: fasted.filter((entry) => entry.type === 'voluntary').length,
    qada: fasted.filter((entry) => entry.type === 'qada').length,
    missed: entries.filter((entry) => entry.type === 'missed').length,
  };

  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    const entry = entries.find((item) => item.date === key);
    const fastedThatDay = !!entry && entry.type !== 'missed';
    if (fastedThatDay) streak += 1;
    else if (i > 0) break;
    else if (!entry) continue; // today is not decided yet — do not break the streak
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weekKey = dayKey(weekStart);
  return {
    completed: fasted.length,
    ...counts,
    owed: next.owed,
    streak,
    thisWeek: fasted.filter((entry) => entry.date >= weekKey).length,
    today: entries.find((entry) => entry.date === dayKey()) || null,
    recent: [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 21),
    months: summariseMonths(entries),
  };
}

/**
 * The last six calendar months, newest last. Months with nothing recorded still
 * appear, so a gap in the record reads as a gap rather than vanishing.
 */
function summariseMonths(entries: FastEntry[]): FastMonth[] {
  const now = new Date();
  const out: FastMonth[] = [];
  for (let back = 5; back >= 0; back -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const own = entries.filter((entry) => entry.date.slice(0, 7) === key);
    out.push({
      key,
      label: d.toLocaleDateString(dateLocale ?? 'en-US', { month: 'short' }),
      fasted: own.filter((entry) => entry.type !== 'missed').length,
      missed: own.filter((entry) => entry.type === 'missed').length,
    });
  }
  return out;
}

/**
 * The entry label in the language of the interface.
 *
 * Takes the language rather than a direction. Urdu is right-to-left as well,
 * so a two-way switch handed it the Arabic and never its own words.
 */
/* The few fixed words the entry label needs, in each language. Kept as a table
   rather than chained ternaries so adding a language is one row. */
const ENTRY_WORDS: Record<string, { missed: string; recorded: string; qada: string; voluntary: string; ramadan: string }> = {
  fa: { missed: 'افطار', recorded: 'ثبت‌شده', qada: 'روزهٔ قضا', voluntary: 'روزهٔ مستحب', ramadan: 'روزهٔ رمضان' },
  tr: { missed: 'Tutulmadı', recorded: 'kayıtlı', qada: 'Kaza orucu', voluntary: 'Nafile oruç', ramadan: 'Ramazan orucu' },
  ur: { missed: 'افطار', recorded: 'درج', qada: 'قضا روزہ', voluntary: 'نفلی روزہ', ramadan: 'رمضان کا روزہ' },
  ar: { missed: 'أُفطر', recorded: 'مسجل', qada: 'صيام قضاء', voluntary: 'صيام تطوع', ramadan: 'صيام رمضان' },
  en: { missed: 'Missed', recorded: 'recorded', qada: 'Make-up fast', voluntary: 'Voluntary fast', ramadan: 'Ramadan fast' },
};

export function labelForEntry(entry: FastEntry, language?: string | boolean) {
  const code = typeof language === 'string' ? language : language === true ? 'ar' : 'en';
  const w = ENTRY_WORDS[code] || ENTRY_WORDS.en;
  if (entry.type === 'missed') {
    const reason = MISSED_REASONS.find((item) => item.id === entry.reason);
    const table = missedReasonTable(language);
    const own = table?.[entry.reason || ''];
    const label = own?.label || reason?.label || w.recorded;
    return `${w.missed} · ${label}`;
  }
  if (entry.type === 'qada') return w.qada;
  if (entry.type === 'voluntary') return w.voluntary;
  return w.ramadan;
}

function missedReasonTable(language?: string | boolean) {
  if (language === 'fa') return MISSED_REASONS_FA;
  if (language === 'tr') return MISSED_REASONS_TR;
  if (language === 'ur') return MISSED_REASONS_UR;
  return language === true || language === 'ar' ? MISSED_REASONS_AR : undefined;
}

export function readableDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(dateLocale, { weekday: 'short', day: 'numeric', month: 'short' });
}
