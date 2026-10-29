import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChapters, getVerses } from './api';
import { loadSurahCacheIndex, saveSurahCache, surahCacheKey } from './quranState';
import { languageByCode, type LanguageCode } from './languages';
import { loadDuaCategories, loadDuas } from './duaService';
import { loadNames } from './namesService';
import { loadHadithCollection } from './hadithService';

/**
 * Getting the app ready to be used without a connection.
 *
 * The onboarding screen ends with two facts: which language the person reads,
 * and (from that) which translation or tafsir sits beside the Arabic. Those two
 * facts are enough to know exactly what to fetch, so the fetching should simply
 * happen — not wait behind a button on a screen most people never open.
 *
 * Two rules shape everything here.
 *
 * The Arabic is not optional. Whichever language is chosen, the Quran itself is
 * Arabic, so the Uthmani text is always in the plan and always downloads. The
 * translation rides along in the same request, because the reader fetches the
 * script and the translation together; caching them separately would double the
 * work for no gain.
 *
 * Nothing here blocks. Every stage is resumable, every stage checks what is
 * already on the device before asking the network for it, and the whole plan
 * survives being interrupted — by the app closing, by a dropped connection, or
 * by the person simply opening something else. Progress is written after each
 * unit, so restarting costs only what was never finished.
 */

export type StageId = 'index' | 'quran' | 'duas' | 'names' | 'hadith';

export type OfflineStage = {
  id: StageId;
  label: string;
  /** What this stage is fetching, for the progress line. */
  detail: string;
  total: number;
  done: number;
  status: 'pending' | 'running' | 'done' | 'partial' | 'failed';
  /** How many units of this stage could not be fetched. */
  failed?: number;
  error?: string;
};

export type OfflineSetup = {
  running: boolean;
  started: boolean;
  completedAt: number | null;
  language: string;
  script: string;
  translation: string;
  /** Which translation or tafsir, in words, for the settings screen. */
  translationName: string;
  stages: OfflineStage[];
};

const KEY = '@deen/offline/setup/v1';

/** The collections worth having on the device. Small ones first. */
const HADITH_FOR_OFFLINE = ['bukhari', 'muslim', 'riyadussalih'];

/** Attempts per surah before it is left for a later pass. */
const RETRIES = 3;
const DUA_CATEGORY_KEYS = ['morning', 'evening', 'after-prayer', 'prayer', 'mosque', 'sleep', 'waking'];

let setup: OfflineSetup = blank();
let hydrated = false;
let generation = 0;
const listeners = new Set<(next: OfflineSetup) => void>();

function blank(): OfflineSetup {
  return {
    running: false, started: false, completedAt: null,
    language: 'en', script: 'quran-uthmani', translation: 'en.sahih',
    translationName: 'Saheeh International', stages: [],
  };
}

function publish(next: OfflineSetup) {
  setup = next;
  listeners.forEach((listener) => listener(next));
}

async function persist(next: OfflineSetup) {
  publish(next);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* progress is a nicety, not a requirement */ }
}

export async function loadOfflineSetup(): Promise<OfflineSetup> {
  if (hydrated) return setup;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) setup = { ...blank(), ...JSON.parse(raw) };
  } catch { /* start fresh */ }
  hydrated = true;
  publish(setup);
  return setup;
}

export function getOfflineSetup(): OfflineSetup {
  return setup;
}

export function subscribeOfflineSetup(listener: (next: OfflineSetup) => void) {
  listeners.add(listener);
  void loadOfflineSetup().then(() => listener(setup));
  return () => { listeners.delete(listener); };
}

/**
 * The pair the reader will ask for: the Arabic script, and the translation or
 * tafsir that goes with the chosen language.
 *
 * A language with no text edition of its own (Kazakh, today) still gets the
 * Arabic, and falls back to English for the meaning rather than to nothing.
 */
export function editionForLanguage(language: string, script = 'quran-uthmani') {
  const entry = languageByCode(language as LanguageCode);
  const text = entry?.text;
  return {
    script,
    translation: text?.identifier || 'en.sahih',
    translationName: text?.name || 'Saheeh International',
    kind: text?.kind || 'translation',
  };
}

function stage(id: StageId, label: string, detail: string, total: number): OfflineStage {
  return { id, label, detail, total, done: 0, status: 'pending' };
}

function patchStage(next: OfflineSetup, id: StageId, changes: Partial<OfflineStage>): OfflineSetup {
  return { ...next, stages: next.stages.map((s) => (s.id === id ? { ...s, ...changes } : s)) };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs the plan. Safe to call at any time: it skips whatever is already on the
 * device, so calling it again after a partial run only does the remainder.
 */
export async function startOfflineSetup(options: { language: string; script?: string }) {
  const { script, translation, translationName } = editionForLanguage(options.language, options.script);
  await loadOfflineSetup();

  // A second call for the same pair while one is in flight should not start a
  // second download of the same thing.
  if (setup.running && setup.script === script && setup.translation === translation) return;

  const run = ++generation;
  const index = await loadSurahCacheIndex();
  const quranTotal = 114;
  const already = new Set(index.filter((k) => k.endsWith(`:${script}:${translation}`)));

  const fresh: OfflineSetup = {
    running: true, started: true, completedAt: null,
    language: options.language, script, translation, translationName,
    stages: [
      // The index goes first: without the list of surahs, everything cached
      // afterwards is unreachable.
      stage('index', 'The list of surahs', 'All 114, so any of them can be opened', 1),
      stage('quran', 'The Quran', `${translationName} with the Arabic`, quranTotal),
      stage('duas', 'Duas and remembrance', 'Morning, evening, prayer and sleep', DUA_CATEGORY_KEYS.length),
      stage('names', 'The Beautiful Names', 'All ninety-nine', 1),
      stage('hadith', 'Hadith collections', 'Bukhari, Muslim, Riyad as-Salihin', HADITH_FOR_OFFLINE.length),
    ],
  };
  // Anything already cached counts immediately, so the bar reflects reality.
  fresh.stages = patchStage(fresh, 'quran', { done: Math.min(already.size, quranTotal) }).stages;
  await persist(fresh);

  const bump = async (id: StageId, changes: Partial<OfflineStage>) => {
    if (run !== generation) return;
    await persist(patchStage(setup, id, changes));
  };

  try {
    // ---- 0. the index -----------------------------------------------------
    await bump('index', { status: 'running' });
    try {
      await getChapters();
      await bump('index', { done: 1, status: 'done' });
    } catch (error: any) {
      // Without this the Quran cannot be browsed at all, so a failure here is
      // worth stopping for rather than skipping past.
      await bump('index', { status: 'failed', error: error?.message || 'Could not reach the server.' });
      await persist({ ...setup, running: false });
      return;
    }
    if (run !== generation) return;

    // ---- 1. the Quran, surah by surah -------------------------------------
    /* The public Quran API rate-limits bursts, and when it does it answers
       without CORS headers — which the browser reports as a network failure
       rather than a 429. So a single miss is not evidence that a surah is
       unavailable; it is usually evidence that we asked too quickly. Each
       surah therefore gets a few attempts with the gaps widening, and only a
       surah that fails every attempt is left for later. */
    await bump('quran', { status: 'running', failed: 0 });
    let failures = 0;
    for (let id = 1; id <= 114; id += 1) {
      if (run !== generation) return;
      const key = surahCacheKey(id, script, translation);
      if (already.has(key)) continue;

      let stored = false;
      for (let attempt = 0; attempt < RETRIES && !stored; attempt += 1) {
        if (run !== generation) return;
        try {
          const verses = await getVerses(id, { script, translation });
          if (run !== generation) return;
          await saveSurahCache(key, verses);
          already.add(key);
          stored = true;
        } catch {
          // Back off, then try once more. 700ms, 1.6s, 3.5s.
          if (attempt < RETRIES - 1) await delay(700 * Math.pow(2.2, attempt));
        }
      }

      if (stored) {
        const done = setup.stages.find((s) => s.id === 'quran')?.done || 0;
        await bump('quran', { done: done + 1 });
        // A steady pace keeps the device responsive and stays under the limit.
        await delay(220);
      } else {
        failures += 1;
        await bump('quran', { failed: failures });
      }
    }
    if (run !== generation) return;
    await bump('quran', {
      status: failures ? 'partial' : 'done',
      error: failures ? `${failures} surah${failures === 1 ? '' : 's'} could not be fetched this time.` : undefined,
    });

    // ---- 2. duas -----------------------------------------------------------
    await bump('duas', { status: 'running' });
    let duaDone = 0;
    for (const key of DUA_CATEGORY_KEYS) {
      if (run !== generation) return;
      try { await loadDuas(key); } catch { /* optional: skip silently */ }
      duaDone += 1;
      await bump('duas', { done: duaDone });
    }
    try { await loadDuaCategories(); } catch { /* optional */ }
    if (run !== generation) return;
    await bump('duas', { status: 'done' });

    // ---- 3. the names ------------------------------------------------------
    await bump('names', { status: 'running' });
    try { await loadNames(); } catch { /* optional */ }
    if (run !== generation) return;
    await bump('names', { done: 1, status: 'done' });

    // ---- 4. hadith ---------------------------------------------------------
    await bump('hadith', { status: 'running' });
    let hadithDone = 0;
    for (const slug of HADITH_FOR_OFFLINE) {
      if (run !== generation) return;
      try { await loadHadithCollection(slug); } catch { /* optional */ }
      hadithDone += 1;
      await bump('hadith', { done: hadithDone });
    }
    if (run !== generation) return;
    await bump('hadith', { status: 'done' });

    if (run !== generation) return;
    await persist({ ...setup, running: false, completedAt: Date.now() });
  } catch (error: any) {
    if (run === generation) await persist({ ...setup, running: false });
  }
}

export async function pauseOfflineSetup() {
  generation += 1;
  await persist({ ...setup, running: false });
}

/**
 * Called when the language changes after onboarding: the plan is rebuilt for
 * the new pair, but what is already cached for the old one stays — storage is
 * reclaimed per surah only when space runs short.
 */
export async function replanForLanguage(language: string, script?: string) {
  await pauseOfflineSetup();
  void startOfflineSetup({ language, script });
}

/**
 * Restart whatever did not finish the last time the app ran.
 *
 * A stage left 'partial' counts as unfinished: those surahs are simply the ones
 * the network refused, and another pass usually collects them. The cache is
 * checked first, so a retry costs nothing for what already arrived.
 */
export async function resumeSavedOfflineSetup() {
  await loadOfflineSetup();
  if (!setup.started || setup.completedAt) return;
  const unfinished = setup.stages.some(
    (s) => s.status === 'running' || s.status === 'pending' || s.status === 'partial',
  );
  if (unfinished) void startOfflineSetup({ language: setup.language, script: setup.script });
}

/** Try again now, for the surahs that were missed. */
export async function retryOfflineSetup() {
  await loadOfflineSetup();
  void startOfflineSetup({ language: setup.language, script: setup.script });
}

export function offlineProgress(next: OfflineSetup = setup) {
  const total = next.stages.reduce((sum, s) => sum + Math.max(s.total, 1), 0);
  const done = next.stages.reduce((sum, s) => sum + Math.min(s.done, s.total), 0);
  const quran = next.stages.find((s) => s.id === 'quran');
  return {
    percent: total ? Math.round((done / total) * 100) : 0,
    quranDone: quran?.done || 0,
    quranFailed: quran?.failed || 0,
    /** Complete means every surah is on the device, not merely that we tried. */
    complete: !!next.completedAt && !next.stages.some((s) => s.status === 'partial' && (s.failed || 0) > 0),
  };
}
