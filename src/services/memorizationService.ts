import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * Memorisation, kept entirely on the device.
 *
 * The word "private" in the name is doing work. Somebody learning the Quran
 * is wrong about things constantly and by design — that is what practising
 * is — and a record of every stumble is not something to send anywhere. So
 * nothing here leaves the device, there is no account, and the whole history
 * can be wiped from the settings.
 *
 * The central idea is that confidence is *computed*, never stored. A stored
 * score drifts out of step with the evidence the moment somebody corrects a
 * mistake, and then the app goes on recommending verses they have clearly
 * forgotten. Deriving it from the attempt history means correcting that
 * history — demoting a verse, undoing a mis-tap — changes the score
 * immediately, everywhere, with nothing to keep in sync.
 */

const KEY = '@deen/memorization/v1';
const HISTORY_LIMIT = 600;

/** How a verse is presented while being tested. */
export type MemorizationMode =
  /** The whole verse is hidden until asked for. */
  | 'hide-ayah'
  /** Some of the words are blanked out, the rest shown. */
  | 'hide-words'
  /** Words appear one group at a time. */
  | 'progressive'
  /** A verse chosen at random from the current set. */
  | 'random';

export const MODE_LABELS: Record<MemorizationMode, { en: string; ar: string; note: string; noteAr: string }> = {
  'hide-ayah': {
    en: 'Hide the verse', ar: 'إخفاء الآية',
    note: 'Nothing shown. Say it, then check.',
    noteAr: 'لا يظهر شيء. قلها ثم تحقق.',
  },
  'hide-words': {
    en: 'Hide some words', ar: 'إخفاء بعض الكلمات',
    note: 'Part of the verse is blanked, the rest guides you.',
    noteAr: 'جزء من الآية مخفي والباقي يرشدك.',
  },
  progressive: {
    en: 'Reveal gradually', ar: 'كشف تدريجي',
    note: 'More appears each time you ask, so you are never fully stuck.',
    noteAr: 'يظهر المزيد مع كل طلب، فلا تتعثر تمامًا.',
  },
  random: {
    en: 'Random verse', ar: 'آية عشوائية',
    note: 'Drawn at random from what you are working on.',
    noteAr: 'تُختار عشوائيًا مما تعمل عليه.',
  },
};

export type AttemptResult = 'correct' | 'wrong';

/**
 * One look at one verse.
 *
 * `kind` distinguishes three different things that all land in the same list.
 * An ordinary attempt is a fact about recall. A demote is somebody saying "I
 * was given credit for this and should not have been" — it is new evidence,
 * not a correction of the old. An undo says the attempt should never have
 * counted at all, usually a mis-tap, and is excluded from scoring rather
 * than deleted, so the record of what happened survives the correction.
 */
export type Attempt = {
  id: string;
  verseKey: string;
  surahId: number;
  surahName: string;
  ayah: number;
  at: number;
  result: AttemptResult;
  mode: MemorizationMode;
  /**
   * How much of the verse was on screen when they answered.
   * A correct answer with the whole verse showing means very little, and
   * treating it the same as one from memory is how a score comes to claim
   * somebody knows something they have only just read.
   */
  revealedRatio: number;
  kind: 'attempt' | 'demote' | 'undo';
  /** For an undo, the attempt being reversed; for a demote, what triggered it. */
  corrects?: string;
};

/** Everything known about one verse, as raw counts. Confidence is derived. */
export type VerseRecord = {
  verseKey: string;
  surahId: number;
  surahName: string;
  ayah: number;
  attempts: number;
  correct: number;
  wrong: number;
  /** Consecutive correct answers, ending at the last attempt. */
  streak: number;
  lastSeen?: number;
  lastResult?: AttemptResult;
  /** Put in the weak bank by the person, not by the score. Stays there until they take it out. */
  flaggedWeak?: boolean;
  flaggedAt?: number;
};

export type MemorizationSettings = {
  mode: MemorizationMode;
  /** Fraction of words blanked in 'hide-words'. */
  hideRatio: number;
  /** Words uncovered per press in 'progressive'. */
  revealStep: number;
  /** Below this confidence a verse is treated as weak. */
  weakThreshold: number;
};

export type MemorizationState = {
  verses: Record<string, VerseRecord>;
  attempts: Attempt[];
  settings: MemorizationSettings;
};

export const DEFAULT_MEM_SETTINGS: MemorizationSettings = {
  mode: 'hide-ayah',
  hideRatio: 0.4,
  revealStep: 2,
  weakThreshold: 0.6,
};

const EMPTY: MemorizationState = { verses: {}, attempts: [], settings: { ...DEFAULT_MEM_SETTINGS } };

let state: MemorizationState = { ...EMPTY };
let loaded = false;
const listeners = new Set<(next: MemorizationState) => void>();

function publish(next: MemorizationState) {
  state = next;
  listeners.forEach((listener) => listener(next));
}

async function persist(next: MemorizationState) {
  publish(next);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* a practice session still works without being written down */
  }
}

export async function loadMemorization(): Promise<MemorizationState> {
  if (loaded) return state;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MemorizationState>;
      state = {
        verses: parsed.verses || {},
        attempts: parsed.attempts || [],
        settings: { ...DEFAULT_MEM_SETTINGS, ...(parsed.settings || {}) },
      };
    }
  } catch {
    state = { ...EMPTY };
  }
  loaded = true;
  publish(state);
  return state;
}

export function getMemorization(): MemorizationState {
  return state;
}

export function subscribeMemorization(listener: (next: MemorizationState) => void): () => void {
  listeners.add(listener);
  /* Wrapped in a block so the unsubscribe returns nothing. Set#delete hands
     back a boolean, and a cleanup function that returns one is not a cleanup
     function as far as useEffect is concerned. */
  return () => { listeners.delete(listener); };
}

/**
 * The memorisation state, kept in step with the store.
 *
 * Screens read the derived numbers (confidence, the weak bank) straight from
 * the module rather than out of this value, so a correction made in one place
 * re-scores everything immediately. This exists to make the screen re-render
 * when that happens.
 */
export function useMemorization(): MemorizationState {
  const [value, setValue] = useState<MemorizationState>(state);
  useEffect(() => {
    void loadMemorization();
    return subscribeMemorization(setValue);
  }, []);
  return value;
}

export async function saveMemSettings(patch: Partial<MemorizationSettings>) {
  await persist({ ...state, settings: { ...state.settings, ...patch } });
}

export async function clearMemorization() {
  await persist({ verses: {}, attempts: [], settings: { ...DEFAULT_MEM_SETTINGS } });
}

/* -------------------------------------------------------------- confidence */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * How well a verse is known, from 0 to 1.
 *
 * Three things feed it, and each is there for a reason:
 *
 *  - **Accuracy**, weighted by how much was on screen at the time. A correct
 *    answer given with the whole verse visible is discounted heavily,
 *    otherwise reading along scores the same as recalling.
 *  - **Streak**, because ten in a row is stronger evidence than ten spread
 *    out with failures between them.
 *  - **Recency**, as a gentle decay. A verse not looked at for a month is
 *    not known the way it was the day it was learned, and pretending
 *    otherwise is how people discover a gap halfway through a recitation.
 *
 * Being flagged weak by the person scales the whole thing down. That is
 * deliberate: their judgement outranks the arithmetic. The app counts, but
 * they know.
 *
 * Decay is capped so a verse never falls to nothing simply through neglect —
 * something once known solidly is not the same as something never learned.
 */
export function confidenceOf(record: VerseRecord | undefined, now = Date.now()): number {
  if (!record || !record.attempts) return 0;

  const accuracy = record.correct / record.attempts;
  const streakBonus = Math.min(0.15, record.streak * 0.05);

  const days = record.lastSeen ? Math.max(0, (now - record.lastSeen) / 86_400_000) : 0;
  /* Falls to about 0.7 of its value after three weeks, and no lower than 0.6
     however long it has been. */
  const recency = 0.6 + 0.4 * Math.exp(-days / 30);

  const flagged = record.flaggedWeak ? 0.7 : 1;

  return clamp01((accuracy * 0.85 + streakBonus) * recency * flagged);
}

/** Whether the verse counts as weak: flagged by the person, or scoring low. */
export function isWeak(record: VerseRecord | undefined, now = Date.now()): boolean {
  if (!record) return false;
  if (record.flaggedWeak) return true;
  return confidenceOf(record, now) < state.settings.weakThreshold;
}

/**
 * Every verse in the weak bank, worst first.
 *
 * Worst first, because the point of a weak bank is to spend the limited
 * minutes you have on what needs them most — not to work politely through
 * the list in the order it happened to be built.
 */
export function weakBank(now = Date.now()): VerseRecord[] {
  return Object.values(state.verses)
    .filter((record) => isWeak(record, now))
    .sort((a, b) => confidenceOf(a, now) - confidenceOf(b, now));
}

/** The verses being worked on at all, strongest first. */
export function practicedVerses(): VerseRecord[] {
  return Object.values(state.verses).filter((record) => record.attempts > 0);
}

/**
 * A score for the whole set, 0 to 1.
 *
 * The mean of the confidences, not the share of correct answers: a person
 * who knows nine verses and is shaky on a tenth is doing well, and saying
 * "90% correct" would describe the same situation very differently.
 */
export function overallConfidence(now = Date.now()): number {
  const all = practicedVerses();
  if (!all.length) return 0;
  return all.reduce((sum, record) => sum + confidenceOf(record, now), 0) / all.length;
}

/* ---------------------------------------------------------------- recording */

const newId = () => `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function blankRecord(verseKey: string, surahId: number, surahName: string, ayah: number): VerseRecord {
  return { verseKey, surahId, surahName, ayah, attempts: 0, correct: 0, wrong: 0, streak: 0 };
}

/**
 * Record a look at a verse.
 *
 * `revealedRatio` is how much was showing when they answered, from 0 (nothing)
 * to 1 (the whole verse). It shapes how much the answer is worth, and it is
 * the reason a session spent reading along cannot quietly inflate the score.
 */
/**
 * How much a correct answer is worth, given how much was on screen.
 *
 * Nothing showing earns a full mark. Everything showing still earns a
 * quarter, because following a verse with the text in front of you is not
 * recall but it is not nothing either — and scoring it zero would mean a
 * person who is honestly rebuilding a half-forgotten page would watch their
 * standing fall every time they opened it.
 */
export function creditFor(revealedRatio: number): number {
  return 0.25 + 0.75 * clamp01(1 - clamp01(revealedRatio));
}

export async function recordAttempt(
  verseKey: string,
  surahId: number,
  surahName: string,
  ayah: number,
  result: AttemptResult,
  mode: MemorizationMode,
  revealedRatio = 0,
) {
  const previous = state.verses[verseKey] || blankRecord(verseKey, surahId, surahName, ayah);

  const credit = creditFor(revealedRatio);

  const next: VerseRecord = {
    ...previous,
    attempts: previous.attempts + 1,
    correct: previous.correct + (result === 'correct' ? credit : 0),
    wrong: previous.wrong + (result === 'correct' ? 0 : 1),
    streak: result === 'correct' ? previous.streak + 1 : 0,
    lastSeen: Date.now(),
    lastResult: result,
  };

  const attempt: Attempt = {
    id: newId(), verseKey, surahId, surahName, ayah,
    at: Date.now(), result, mode, revealedRatio, kind: 'attempt',
  };

  await persist({
    ...state,
    verses: { ...state.verses, [verseKey]: next },
    attempts: [attempt, ...state.attempts].slice(0, HISTORY_LIMIT),
  });
  return attempt;
}

/**
 * Demote a verse the app credited too generously.
 *
 * This is the correction that matters most and is least often offered. The
 * app marks a verse known because it was answered correctly — perhaps with
 * the verse mostly visible, perhaps on a good day — and then keeps treating
 * it as known while the person quietly knows it is not. Demoting says so,
 * once, and the verse goes into the weak bank and stays there until taken
 * out, because a single correction should not be undone by one lucky pass.
 *
 * It is recorded rather than silently adjusting numbers, so the history shows
 * what happened and when.
 */
export async function demoteVerse(verseKey: string, surahId: number, surahName: string, ayah: number) {
  const previous = state.verses[verseKey] || blankRecord(verseKey, surahId, surahName, ayah);
  const now = Date.now();

  const next: VerseRecord = {
    ...previous,
    flaggedWeak: true,
    flaggedAt: now,
    /* The streak is what made the app over-confident, so it is the streak
       that goes. The counts stay: they are the truth of what happened. */
    streak: 0,
  };

  const attempt: Attempt = {
    id: newId(), verseKey, surahId, surahName, ayah,
    at: now, result: 'wrong', mode: 'hide-ayah', revealedRatio: 0, kind: 'demote',
  };

  await persist({
    ...state,
    verses: { ...state.verses, [verseKey]: next },
    attempts: [attempt, ...state.attempts].slice(0, HISTORY_LIMIT),
  });
  return attempt;
}

/** Take a verse back out of the weak bank, leaving its history intact. */
export async function unflagVerse(verseKey: string) {
  const previous = state.verses[verseKey];
  if (!previous) return;
  const { flaggedWeak: _dropped, flaggedAt: _at, ...rest } = previous;
  await persist({ ...state, verses: { ...state.verses, [verseKey]: rest as VerseRecord } });
}

/**
 * Undo an attempt, as though it had never been counted.
 *
 * For the mis-tap: the finger landed on "I knew it" on the way to something
 * else, and now the app believes something untrue. Undoing subtracts the
 * attempt and restores the streak to what it was before, rather than merely
 * logging a failure — logging a failure would record the opposite of what
 * happened, and the person would be penalised for the app's own interface.
 *
 * The attempt is marked rather than deleted so the history still shows it
 * was made and reversed, but it stops counting towards anything.
 */
export async function undoAttempt(attemptId: string): Promise<boolean> {
  const attempt = state.attempts.find((entry) => entry.id === attemptId);
  if (!attempt || attempt.kind !== 'attempt') return false;

  const record = state.verses[attempt.verseKey];
  if (!record) return false;

  const credit = creditFor(attempt.revealedRatio);
  const next: VerseRecord = {
    ...record,
    attempts: Math.max(0, record.attempts - 1),
    correct: Math.max(0, record.correct - (attempt.result === 'correct' ? credit : 0)),
    wrong: Math.max(0, record.wrong - (attempt.result === 'correct' ? 0 : 1)),
    /* The streak before this attempt: a correct attempt extended it by one,
       a wrong one reset it to zero and lost whatever it had been. Only the
       first can be reversed precisely, so a reset streak goes back to the
       count of correct answers in a row it replaced — unknown, so it is
       restored conservatively from the record of correct minus wrong. */
    streak: attempt.result === 'correct'
      ? Math.max(0, record.streak - 1)
      : Math.max(0, Math.round(record.correct - record.wrong)),
  };

  const marker: Attempt = { ...attempt, id: newId(), at: Date.now(), kind: 'undo', corrects: attemptId };

  await persist({
    ...state,
    verses: { ...state.verses, [attempt.verseKey]: next },
    attempts: [marker, ...state.attempts.map((entry) => entry.id === attemptId ? { ...entry, kind: 'undo' as const } : entry)].slice(0, HISTORY_LIMIT),
  });
  return true;
}


/** The most recent attempts across everything, newest first. */
export function recentAttempts(limit = 40): Attempt[] {
  return state.attempts.filter((entry) => entry.kind !== 'undo').slice(0, limit);
}

/**
 * Pick the next verse to test.
 *
 * Weak verses come first — that is the entire point of a weak bank — but not
 * so absolutely that nothing else is ever revisited, so a quarter of the time
 * an ordinary verse is drawn at random instead. Never the same verse twice
 * running, because being asked the identical thing twice in a row tells you
 * nothing the first time did not.
 */
export function pickNext(pool: VerseRecord[], avoidKey?: string, now = Date.now()): VerseRecord | null {
  const usable = pool.filter((record) => record.verseKey !== avoidKey);
  if (!usable.length) return null;

  const weak = usable.filter((record) => isWeak(record, now));
  const drawFrom = weak.length && Math.random() > 0.25 ? weak : usable;
  return drawFrom[Math.floor(Math.random() * drawFrom.length)];
}

/* ------------------------------------------------------------------ masking */

/**
 * Split a verse into words.
 *
 * Split on whitespace and keep the separators, so the result can be put back
 * together exactly as it was. Rejoining with a plain space loses the original
 * spacing and, in some scripts, changes the text.
 */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function isWord(part: string): boolean {
  return !/^\s+$/.test(part);
}

/**
 * Which words to blank out.
 *
 * Hidden words are spread across the verse rather than taken from one end.
 * Blank the first half and the task becomes completing a phrase you have
 * already started; blank at random and only the first few words are ever
 * unknown, because by the end the shape of the sentence has given it away.
 *
 * Deterministic for a given verse and ratio, so the same verse does not
 * shuffle its blanks every time the screen re-renders — which would be
 * disorienting and would quietly make the test easier by letting you wait
 * for a favourable arrangement.
 */
export function hiddenIndexes(parts: string[], ratio: number, seed: string): number[] {
  const words: number[] = [];
  parts.forEach((part, index) => { if (isWord(part)) words.push(index); });
  if (!words.length) return [];

  const wanted = Math.min(words.length, Math.max(1, Math.round(words.length * ratio)));

  /* A seeded shuffle — Fisher-Yates driven by mulberry32. Mixing matters:
     folding the seed into each sort key with a plain hash leaves neighbouring
     verse keys producing near-identical orderings, so every verse blanked the
     same words. A real PRNG spreads them properly. */
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let prng = hash >>> 0;
  const random = () => {
    prng = (prng + 0x6d2b79f5) >>> 0;
    let t = prng;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const pool = words.slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;
  }

  return pool.slice(0, wanted).sort((a, b) => a - b);
}
