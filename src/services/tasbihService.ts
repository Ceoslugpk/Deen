import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Phase 3 — Tasbih.
 *
 * A private counter: the count, the chosen phrase, the goal and the history never
 * leave the device, and no account is involved. Haptics are triggered by the caller
 * (the screen) because a service should not touch device feedback on its own.
 */

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

export function getTasbihState() {
  return state;
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
