import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeText } from './storage';
import { commandTasbihJson, nativeTasbihAvailable, readNativeTasbihJson, readSnapshotJson, lastPublishTime } from './widgetBridge';

/**
 * Phase 3 — Tasbih.
 *
 * A private counter: the count, the chosen phrase, the goal and the history never
 * leave the device, and no account is involved. Haptics are triggered by the caller
 * (the screen) because a service should not touch device feedback on its own.
 */

/** The meaning of each phrase in Arabic, for the Arabic interface. */
const MEANING_AR: Record<string, string> = {
  'Glory be to Allah': 'تنزيه الله عن كل نقص',
  'All praise is for Allah': 'الحمد لله على كل حال',
  'Allah is the Greatest': 'الله أكبر من كل شيء',
  'There is no god but Allah': 'لا معبود بحق إلا الله',
  'I seek forgiveness from Allah': 'أطلب مغفرة الله',
  'O Allah, send blessings upon Muhammad': 'اللهم صلِّ وسلِّم على نبينا محمد ﷺ',
  'There is no power except with Allah': 'لا حول ولا قوة إلا بالله',
  'Allah is sufficient for us': 'حسبنا الله ونعم الوكيل',
};


/** The same meanings in Persian and Turkish, for the same reason: a boolean
 *  cannot tell three right-to-left languages apart. */
const MEANING_FA: Record<string, string> = {
  'Glory be to Allah': 'خداوند از هر نقصی پاک و منزّه است',
  'All praise is for Allah': 'در هر حالی، سپاس از آنِ خداوند است',
  'Allah is the Greatest': 'خداوند از هر چیز بزرگ‌تر است',
  'There is no god but Allah': 'هیچ معبودی به‌حق جز الله نیست',
  'I seek forgiveness from Allah': 'از خداوند آمرزش می‌طلبم',
  'O Allah, send blessings upon Muhammad': 'بارخدایا، بر محمد صلی‌الله علیه و آله و سلم درود و سلام فرست',
  'There is no power except with Allah': 'هیچ نیرو و توانی جز به خداوند نیست',
  'Allah is sufficient for us': 'خداوند ما را بس است و او نیکو کارسازی است',
};

const MEANING_TR: Record<string, string> = {
  'Glory be to Allah': 'Allah her türlü eksiklikten münezzehtir',
  'All praise is for Allah': 'Her durumda hamd Allah’a mahsustur',
  'Allah is the Greatest': 'Allah her şeyden büyüktür',
  'There is no god but Allah': 'Allah’tan başka hak ilah yoktur',
  'I seek forgiveness from Allah': 'Allah’tan bağışlanma dilerim',
  'O Allah, send blessings upon Muhammad': 'Allah’ım, Muhammed’e salât ve selâm eyle',
  'There is no power except with Allah': 'Güç ve kuvvet yalnızca Allah’tandır',
  'Allah is sufficient for us': 'Allah bize yeter; O ne güzel vekîldir',
};

const MEANING_UR: Record<string, string> = {
  'Glory be to Allah': 'اللہ ہر نقص سے پاک ہے',
  'All praise is for Allah': 'ہر حال میں تعریف اللہ ہی کے لیے ہے',
  'Allah is the Greatest': 'اللہ سب سے بڑا ہے',
  'There is no god but Allah': 'اللہ کے سوا کوئی معبودِ برحق نہیں',
  'I seek forgiveness from Allah': 'میں اللہ سے بخشش مانگتا ہوں',
  'O Allah, send blessings upon Muhammad': 'اے اللہ، محمد صلی اللہ علیہ وسلم پر رحمتیں اور سلامتی نازل فرما',
  'There is no power except with Allah': 'گناہ سے بچنے کی طاقت اور نیکی کرنے کی توفیق اللہ ہی کی طرف سے ہے',
  'Allah is sufficient for us': 'اللہ ہمیں کافی ہے اور وہ بہترین کارساز ہے',
};

/* Indonesian. These are the meanings an Indonesian reciter is taught to hold
   in mind, so the idiom follows that teaching rather than a literal calque of
   the English: «la hawla» is rendered as the well-known Indonesian phrasing
   about the power to leave sin and the strength to obey, which is how the
   phrase is explained in Indonesian majelis, not as "tidak ada kekuatan". */
const MEANING_ID: Record<string, string> = {
  'Glory be to Allah': 'Maha Suci Allah',
  'All praise is for Allah': 'Segala puji bagi Allah',
  'Allah is the Greatest': 'Allah Maha Besar',
  'There is no god but Allah': 'Tiada Tuhan selain Allah',
  'I seek forgiveness from Allah': 'Aku memohon ampun kepada Allah',
  'O Allah, send blessings upon Muhammad': 'Ya Allah, limpahkan selawat kepada Muhammad',
  'There is no power except with Allah': 'Tiada daya untuk menjauhi maksiat dan tiada kekuatan untuk berbuat taat kecuali dengan pertolongan Allah',
  'Allah is sufficient for us': 'Cukuplah Allah bagi kami, dan Dialah sebaik-baik pelindung',
};

const MEANING_TABLES: Record<string, Record<string, string>> = { fa: MEANING_FA, tr: MEANING_TR, ur: MEANING_UR, id: MEANING_ID, ar: MEANING_AR };

export function dhikrMeaning(phrase: DhikrPhrase, lang?: string | boolean) {
  const code = typeof lang === 'string' ? lang : lang === true ? 'ar' : 'en';
  const table = MEANING_TABLES[code];
  return (table && table[phrase.meaning]) || phrase.meaning;
}

export type DhikrPhrase = { id: string; arabic: string; transliteration: string; meaning: string };

export const DHIKR_PHRASES: DhikrPhrase[] = [
  { id: 'subhan-allah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'Subhan Allah', meaning: 'Glory be to Allah' },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', meaning: 'All praise is for Allah' },
  { id: 'allahu-akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest' },
  { id: 'la-ilaha-illa-allah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illa Allah', meaning: 'There is no god but Allah' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
  { id: 'salawat', arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allahumma salli \'ala Muhammad', meaning: 'O Allah, send blessings upon Muhammad' },
  { id: 'la-hawla', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', transliteration: 'La hawla wa la quwwata illa billah', meaning: 'There is no power except with Allah' },
  { id: 'hasbunallah', arabic: 'حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ', transliteration: 'Hasbunallahu wa ni\'mal wakeel', meaning: 'Allah is sufficient for us' },
];

export const TASBIH_GOALS = [33, 99, 100, 500, 1000];

export type TasbihSession = { id: string; phrase: string; count: number; goal: number; completedAt: number };

export type TasbihState = {
  phraseId: string;
  goal: number;
  count: number;
  rounds: number;
  days: Record<string, number>;
  sessions: TasbihSession[];
};

const KEY = 'tasbih-state-v1';
export const EMPTY_TASBIH: TasbihState = { phraseId: 'subhan-allah', goal: 33, count: 0, rounds: 0, days: {}, sessions: [] };

let state: TasbihState = EMPTY_TASBIH;
const listeners = new Set<(next: TasbihState) => void>();
export type TasbihFailureCode = 'TW_READ' | 'TW_IMPORT' | 'TW_COMMAND' | 'TW_DATA' | 'TW_BACKUP';
export type TasbihStatus = { phase: 'idle' | 'loading' | 'ready' | 'error'; code?: TasbihFailureCode };
let status: TasbihStatus = { phase: 'idle' };
const statusListeners = new Set<(next: TasbihStatus) => void>();
class TasbihFailure extends Error {
  constructor(readonly code: TasbihFailureCode, cause?: unknown) {
    super(typeof (cause as { message?: unknown })?.message === 'string' ? (cause as Error).message : code === 'TW_BACKUP' ? 'Counter could not be saved' : 'Saved counter unavailable');
  }
}
const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);
function notify<T>(subscribers: Set<(value: T) => void>, value: T) {
  // A failed screen subscriber cannot undo a durable native transaction.
  subscribers.forEach(listener => { try { listener(value); } catch { /* UI will adopt the next acknowledged state */ } });
}
function setStatus(next: TasbihStatus) { status = next; notify(statusListeners, next); }
function emit(next: TasbihState) { state = next; notify(listeners, state); }
function fail(code: TasbihFailureCode, cause: unknown): never {
  ready = false;
  const error = cause instanceof TasbihFailure ? cause : new TasbihFailure(code, cause);
  setStatus({ phase: 'error', code: error.code });
  throw error;
}
/** Validate BEFORE rendering or mirroring. Malformed records are retained in
 * their original stores, never replaced by a guessed zero/empty history. */
function parseState(raw: string): TasbihState {
  try {
    const value = JSON.parse(raw);
    const integer = (n: unknown) => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
    if (!value || Array.isArray(value) || typeof value !== 'object' || !integer(value.count) || !integer(value.goal) || value.goal < 1) throw Error('Invalid counter values');
    const next = { ...EMPTY_TASBIH, ...value };
    if (typeof next.phraseId !== 'string' || !integer(next.rounds) || !next.days || Array.isArray(next.days) || typeof next.days !== 'object'
      || !Object.values(next.days).every(integer) || !Array.isArray(next.sessions)
      || !next.sessions.every((session: TasbihSession) => session && typeof session.id === 'string' && typeof session.phrase === 'string'
        && integer(session.count) && integer(session.goal) && typeof session.completedAt === 'number' && Number.isFinite(session.completedAt))) throw Error('Invalid counter history');
    return next as TasbihState;
  } catch { throw new TasbihFailure('TW_DATA', new Error('Saved counter is invalid; original data retained')); }
}
async function persist(next: TasbihState, nativeCommitted = false) {
  if (nativeCommitted) emit(next);
  let saved = false;
  try { saved = await writeText(KEY, JSON.stringify(next)); } catch { /* handled below; native is still authoritative */ }
  // A failed/thrown backup mirror cannot undo an acknowledged native command.
  if (!saved && !nativeCommitted) throw new TasbihFailure('TW_BACKUP');
  if (!nativeCommitted) emit(next);
}
export function subscribeTasbih(listener: (next: TasbihState) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function subscribeTasbihStatus(listener: (next: TasbihStatus) => void) {
  statusListeners.add(listener);
  return () => { statusListeners.delete(listener); };
}
export function getTasbihStatus(): TasbihStatus { return status; }

// Android app and widgets use one transactional native authority. AsyncStorage
// remains a non-destructive backup/web/iOS mirror, not a competing counter.
let ready = false;
let operations: Promise<unknown> = Promise.resolve();
let commandNumber = 0;
const commandSession = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
function serial<T>(work: () => Promise<T>): Promise<T> {
  const result = operations.then(work);
  operations = result.catch(() => undefined);
  return result;
}
async function hydrate(restore = false) {
  setStatus({ phase: 'loading' });
  let stage: TasbihFailureCode = 'TW_READ';
  try {
    const native = nativeTasbihAvailable();
    if (native && !restore) {
      const existing = await readNativeTasbihJson();
      if (existing !== null) {
        await persist(parseState(existing), true);
        ready = true; setStatus({ phase: 'ready' });
        return state;
      }
    }
    let saved = state;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw !== null) saved = parseState(raw);
    } catch (error) {
      if (error instanceof TasbihFailure) throw error;
      throw new Error('Saved counter could not be read; original data retained');
    }
    if (native) {
      stage = 'TW_IMPORT';
      const raw = await commandTasbihJson(JSON.stringify({
        op: restore ? 'restore' : 'init', state: saved,
        label: currentPhrase(saved).transliteration,
        idempotencyKey: `${commandSession}-${++commandNumber}`,
      }));
      if (raw === null) throw new Error('Native counter did not acknowledge initialization');
      saved = parseState(raw);
    } else if (Platform.OS === 'ios' && !restore) {
      // Preserve the existing Swift/AppGroup timestamp contract.
      const raw = await readSnapshotJson();
      if (raw) {
        const widget = JSON.parse(raw) as { tasbihAt?: number; tasbih?: { count?: number } };
        const count = widget.tasbih?.count;
        if ((widget.tasbihAt || 0) > lastPublishTime() && typeof count === 'number' && Number.isFinite(count)) {
          saved = { ...saved, count: Math.max(0, Math.min(9999, Math.round(count))) };
        }
      }
    }
    await persist(saved, native);
    ready = true; setStatus({ phase: 'ready' });
    return state;
  } catch (error) { return fail(stage, error); }
}
/** A Retry/foreground read reconciles the saved state; it NEVER repeats an
 * uncertain tap. Restore=true is reserved for explicit backup restoration. */
export function loadTasbihState(restore = false): Promise<TasbihState> {
  return serial(() => hydrate(restore));
}
async function ensureReady() {
  // Stop queued mutations after a failure until a read/Retry succeeds. They
  // must not blindly continue with new IDs after an ambiguous native write.
  if (status.phase === 'error') throw new TasbihFailure(status.code || 'TW_READ');
  if (!ready) await hydrate();
}
async function applyCommand(command: Record<string, unknown>, reduce: () => TasbihState) {
  await ensureReady();
  try {
    if (nativeTasbihAvailable()) {
      const raw = await commandTasbihJson(JSON.stringify({ ...command, idempotencyKey: `${commandSession}-${++commandNumber}` }));
      if (raw === null) throw new Error('Native counter did not acknowledge command');
      await persist(parseState(raw), true);
    } else await persist(reduce());
  } catch (error) { fail('TW_COMMAND', error); }
}

export function useTasbih(): TasbihState {
  const [value, setValue] = useState<TasbihState>(state);
  useEffect(() => { const unsubscribe = subscribeTasbih(setValue); setValue(state); return unsubscribe; }, []);
  return value;
}
export function useTasbihStatus(): TasbihStatus {
  const [value, setValue] = useState<TasbihStatus>(status);
  useEffect(() => { const unsubscribe = subscribeTasbihStatus(setValue); setValue(status); return unsubscribe; }, []);
  return value;
}

export function currentPhrase(next: TasbihState = state) {
  return DHIKR_PHRASES.find((phrase) => phrase.id === next.phraseId) || DHIKR_PHRASES[0];
}

export function todayTotal(next: TasbihState = state) {
  return next.days[dayKey()] || 0;
}

export function tapTasbih(): Promise<boolean> {
  return serial(async () => {
    await ensureReady();
    const before = state.rounds;
    await applyCommand({ op: 'tap' }, () => {
      const key = dayKey(); const count = state.count + 1; const complete = count >= state.goal;
      return { ...state, count: complete ? 0 : count, rounds: state.rounds + (complete ? 1 : 0), days: { ...state.days, [key]: (state.days[key] || 0) + 1 } };
    });
    return state.rounds > before;
  });
}
export function setTasbihPhrase(phraseId: string): Promise<void> {
  const label = DHIKR_PHRASES.find(phrase => phrase.id === phraseId)?.transliteration || '';
  return serial(() => applyCommand({ op: 'phrase', phraseId, label }, () => ({ ...state, phraseId, count: 0 })));
}
export function setTasbihGoal(goal: number): Promise<void> {
  return serial(() => applyCommand({ op: 'goal', goal }, () => ({ ...state, goal, count: 0 })));
}
export function resetTasbihCount(): Promise<void> {
  return serial(() => applyCommand({ op: 'reset' }, () => ({ ...state, count: 0 })));
}
/** Legacy iOS count reconciliation; Android instead adopts complete native
 * state including real widget-created history via loadTasbihState(). */
export function setTasbihCount(count: number): Promise<void> {
  return serial(async () => {
    if (nativeTasbihAvailable()) { await hydrate(); return; }
    const next = Math.max(0, Math.min(9999, Math.round(count)));
    await persist({ ...state, count: next });
  });
}

/**
 * Every count you have ever made, all phrases together.
 *
 * Nothing new is stored for this — `days` already holds one tally per day and
 * has since the counter first ran, so the lifetime figure is simply that map
 * added up. It is a sum rather than a stored total because a stored total can
 * drift from the days it claims to summarise, and a sum cannot.
 */
export function tasbihLifetime(value: TasbihState = state) {
  return Object.values(value.days || {}).reduce((sum, count) => sum + (count || 0), 0);
}

/** The number of distinct days anything was counted on. */
export function tasbihDays(value: TasbihState = state) {
  return Object.keys(value.days || {}).filter((key) => (value.days[key] || 0) > 0).length;
}

export function saveTasbihSession(): Promise<void> {
  return serial(async () => {
    await ensureReady();
    await applyCommand({ op: 'saveSession', label: currentPhrase().transliteration }, () => {
      if (!state.count) return state;
      const session: TasbihSession = { id: `${Date.now()}`, phrase: currentPhrase().transliteration, count: state.count, goal: state.goal, completedAt: Date.now() };
      return { ...state, sessions: [session, ...state.sessions], count: 0 };
    });
  });
}
export function removeTasbihSession(id: string): Promise<void> {
  return serial(() => applyCommand({ op: 'removeSession', id }, () => ({ ...state, sessions: state.sessions.filter(session => session.id !== id) })));
}
