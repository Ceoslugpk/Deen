import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

function emit(next: TasbihState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

async function persist(next: TasbihState) {
  emit(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}


export function subscribeTasbih(listener: (next: TasbihState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function loadTasbihState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    state = raw ? { ...EMPTY_TASBIH, ...JSON.parse(raw) } : EMPTY_TASBIH;
  } catch {
    state = EMPTY_TASBIH;
  }
  listeners.forEach((listener) => listener(state));
  return state;
}

export function useTasbih(): TasbihState {
  const [value, setValue] = useState<TasbihState>(state);
  useEffect(() => {
    const unsubscribe = subscribeTasbih(setValue);
    return () => {
      unsubscribe();
    };
  }, []);
  return value;
}

export function currentPhrase(next: TasbihState = state) {
  return DHIKR_PHRASES.find((phrase) => phrase.id === next.phraseId) || DHIKR_PHRASES[0];
}

export function todayTotal(next: TasbihState = state) {
  return next.days[dayKey()] || 0;
}

export async function tapTasbih() {
  const key = dayKey();
  const count = state.count + 1;
  const rounds = count >= state.goal ? state.rounds + 1 : state.rounds;
  const next: TasbihState = {
    ...state,
    count: count >= state.goal ? 0 : count,
    rounds,
    days: { ...state.days, [key]: (state.days[key] || 0) + 1 },
  };
  await persist(next);
  return count >= state.goal;
}

export async function setTasbihPhrase(phraseId: string) {
  await persist({ ...state, phraseId, count: 0 });
}

export async function setTasbihGoal(goal: number) {
  await persist({ ...state, goal, count: 0 });
}

export async function resetTasbihCount() {
  await persist({ ...state, count: 0 });
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

export async function saveTasbihSession() {
  if (!state.count) return;
  const session: TasbihSession = {
    id: `${Date.now()}`,
    phrase: currentPhrase().transliteration,
    count: state.count,
    goal: state.goal,
    completedAt: Date.now(),
  };
  await persist({ ...state, sessions: [session, ...state.sessions].slice(0, 60), count: 0 });
}

export async function removeTasbihSession(id: string) {
  await persist({ ...state, sessions: state.sessions.filter((session) => session.id !== id) });
}
