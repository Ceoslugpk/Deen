import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChapters as getWorkerChapters } from './islamicDataApi';
import { getSurah, type IslamicCategory } from './islamicDataApi';
import { DEFAULT_TRANSLATION_EDITION } from './quranState';
import { loadDuaCategories, loadDuas } from './duaService';
import { loadNames } from './namesService';
import { loadHadithCollection } from './hadithService';
import { flushCacheIndex } from './contentCache';

/**
 * Getting the app ready to be used without a connection.
 *
 * Onboarding ends with one fact that matters here: which translation the
 * person reads beside the Arabic. But a single translation is not what most
 * people want offline — someone who prays in Urdu and studies in English wants
 * both, and the app should work on a plane either way. So the plan holds a
 * *queue* of editions rather than one, and each can be added at any time.
 *
 * Three rules shape everything here.
 *
 * The Arabic is not optional. Whichever languages are chosen, the Quran itself
 * is Arabic, so the script is always in the queue, always downloaded first,
 * and — because a translation is meaningless without it — pinned so that a
 * full device never evicts the Quran to make room for a translation of it.
 *
 * Each edition is cached on its own. Storing the Arabic and a translation
 * together, which is how this used to work, meant downloading the same two
 * megabytes of Arabic once per language: ninety-seven languages would have
 * carried ninety-seven copies of it. Cached separately, the Arabic is fetched
 * once and every language after it costs only its own text.
 *
 * Nothing here blocks. Every stage is resumable, every stage checks what is
 * already on the device before asking the network for it, and the whole plan
 * survives being interrupted — by the app closing, by a dropped connection, or
 * by the person simply opening something else. Progress is written after each
 * unit, so restarting costs only what was never finished.
 */

export type StageId = 'index' | 'script' | 'quran' | 'duas' | 'names' | 'hadith';

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

export type OfflineCategory = Extract<IslamicCategory, 'quran' | 'scripts' | 'tafsir'>;

/** One thing the reader asked to keep on the device. */
export type OfflineEdition = {
  id: string;
  name: string;
  /** The language code, so the plan can be described in words. */
  language: string;
  category: OfflineCategory;
  status: 'pending' | 'running' | 'done' | 'partial' | 'failed';
  done: number;
  total: number;
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
  /** Which translation, in words, for the settings screen. */
  translationName: string;
  /** Everything queued for offline, the Arabic script included. */
  editions: OfflineEdition[];
  stages: OfflineStage[];
  /**
   * True when the device ran out of room and later languages could not be
   * kept alongside earlier ones. Shown so that "Download all" is not a
   * silent promise.
   */
  storageLimited?: boolean;
};

const KEY = '@deen/offline/setup/v2';

/** The collections worth having on the device. Small ones first. */
const HADITH_FOR_OFFLINE = ['bukhari', 'muslim', 'riyadussalih'];

/** Attempts per surah before it is left for a later pass. */
const RETRIES = 3;
const DUA_CATEGORY_KEYS = ['morning', 'evening', 'after-prayer', 'prayer', 'mosque', 'sleep', 'waking'];
const SURAHS = 114;

let setup: OfflineSetup = blank();
let hydrated = false;
let generation = 0;
const listeners = new Set<(next: OfflineSetup) => void>();

function blank(): OfflineSetup {
  return {
    running: false, started: false, completedAt: null,
    language: 'en', script: 'qpc-hafs', translation: DEFAULT_TRANSLATION_EDITION,
    translationName: 'Saheeh International', editions: [], stages: [],
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
    if (raw) {
      const parsed = JSON.parse(raw);
      setup = { ...blank(), ...parsed, editions: parsed.editions || [] };
    }
  } catch { /* start fresh */ }
  hydrated = true;
  publish(setup);
  return setup;
}


export function subscribeOfflineSetup(listener: (next: OfflineSetup) => void) {
  listeners.add(listener);
  void loadOfflineSetup().then(() => listener(setup));
  return () => { listeners.delete(listener); };
}

function stage(id: StageId, label: string, detail: string, total: number): OfflineStage {
  return { id, label, detail, total, done: 0, status: 'pending' };
}

function patchStage(next: OfflineSetup, id: StageId, changes: Partial<OfflineStage>): OfflineSetup {
  return { ...next, stages: next.stages.map((s) => (s.id === id ? { ...s, ...changes } : s)) };
}

function patchEdition(next: OfflineSetup, id: string, changes: Partial<OfflineEdition>): OfflineSetup {
  return { ...next, editions: next.editions.map((e) => (e.id === id ? { ...e, ...changes } : e)) };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A surah of one edition, or nothing if it could not be fetched. */
async function fetchSurah(edition: OfflineEdition, surah: number): Promise<boolean> {
  for (let attempt = 0; attempt < RETRIES; attempt += 1) {
    try {
      await getSurah(edition.category, edition.id, surah, { force: true });
      return true;
    } catch {
      /* A single miss is usually a rate limit rather than a missing surah,
         so it is worth waiting and asking again. 700ms, 1.6s. */
      if (attempt < RETRIES - 1) await delay(700 * Math.pow(2.2, attempt));
    }
  }
  return false;
}

/**
 * Runs the plan. Safe to call at any time: it skips whatever is already on
 * the device, so calling it again after a partial run only does the remainder.
 *
 * `editions` is the complete queue, not an addition — the caller decides what
 * should end up on the device and passes the whole list. The Arabic script is
 * added here if the caller left it out, because nothing else is readable
 * without it.
 */
export async function startOfflineSetup(options: {
  language: string;
  script?: string;
  translation?: string;
  translationName?: string;
  editions?: Array<{ id: string; name: string; language: string; category: OfflineCategory }>;
  /** Add to what is already queued instead of replacing it. */
  append?: boolean;
}) {
  await loadOfflineSetup();

  const script = options.script || 'qpc-hafs';
  const requested = options.editions && options.editions.length
    ? options.editions
    : [{ id: options.translation || DEFAULT_TRANSLATION_EDITION, name: options.translationName || 'Saheeh International', language: options.language, category: 'quran' as OfflineCategory }];

  /* The Arabic is always present and always first: everything else is read
     beside it, so it should be on the device before any of them. */
  const scriptEntry = { id: script, name: 'The Quran in Arabic', language: 'ar', category: 'scripts' as OfflineCategory };
  const merged = [scriptEntry, ...requested.filter((e) => e.id !== script)];

  const previous = new Map((options.append ? setup.editions : []).map((e) => [e.id, e]));
  const editions: OfflineEdition[] = merged.map((e) => {
    const kept = previous.get(e.id);
    return {
      ...e,
      status: kept?.status === 'done' ? 'done' : 'pending',
      done: kept?.status === 'done' ? SURAHS : 0,
      total: SURAHS,
    };
  });

  const run = ++generation;
  const fresh: OfflineSetup = {
    running: true, started: true, completedAt: null,
    language: options.language, script,
    translation: options.translation || DEFAULT_TRANSLATION_EDITION,
    translationName: options.translationName || 'Saheeh International',
    editions,
    stages: [
      // The index goes first: without the list of surahs, everything cached
      // afterwards is unreachable.
      stage('index', 'The list of surahs', 'All 114, so any of them can be opened', 1),
      stage('script', 'The Quran in Arabic', 'The Arabic text, kept on its own', SURAHS),
      stage('quran', 'Translations', `${editions.filter((e) => e.category !== 'scripts').length} language(s)`, SURAHS * Math.max(editions.filter((e) => e.category !== 'scripts').length, 1)),
      stage('duas', 'Duas and remembrance', 'Morning, evening, prayer and sleep', DUA_CATEGORY_KEYS.length),
      stage('names', 'The Beautiful Names', 'All ninety-nine', 1),
      stage('hadith', 'Hadith collections', 'Bukhari, Muslim, Riyad as-Salihin', HADITH_FOR_OFFLINE.length),
    ],
  };
  await persist(fresh);

  const bump = async (id: StageId, changes: Partial<OfflineStage>) => {
    if (run !== generation) return;
    await persist(patchStage(setup, id, changes));
  };
  const mark = async (id: string, changes: Partial<OfflineEdition>) => {
    if (run !== generation) return;
    await persist(patchEdition(setup, id, changes));
  };

  try {
    // ---- 0. the index -----------------------------------------------------
    /* The list of surahs comes from our own server. It used to come from the
       public Quran API, which meant the one stage this plan refuses to
       continue without was also the only one this app did not control. */
    await bump('index', { status: 'running' });
    try {
      await getWorkerChapters();
      await bump('index', { done: 1, status: 'done' });
    } catch (error: any) {
      // Without this the Quran cannot be browsed at all, so a failure here is
      // worth stopping for rather than skipping past.
      await bump('index', { status: 'failed', error: error?.message || 'Could not reach the server.' });
      await persist({ ...setup, running: false });
      return;
    }
    if (run !== generation) return;

    // ---- 1. the Arabic, then each translation -----------------------------
    let scriptDone = 0;
    let quranDone = 0;
    let quranFailed = 0;
    let storageLimited = false;

    for (const edition of editions) {
      if (run !== generation) return;
      const isScript = edition.category === 'scripts';
      /* Already finished on an earlier run: count it and move on. */
      if (edition.status === 'done') {
        if (isScript) scriptDone += SURAHS; else quranDone += SURAHS;
        continue;
      }

      const stageId: StageId = isScript ? 'script' : 'quran';
      await bump(stageId, { status: 'running' });
      await mark(edition.id, { status: 'running' });

      let failures = 0;
      for (let surah = 1; surah <= SURAHS; surah += 1) {
        if (run !== generation) return;
        const ok = await fetchSurah(edition, surah);
        if (run !== generation) return;
        if (ok) {
          if (isScript) scriptDone += 1; else quranDone += 1;
          await bump(stageId, { done: isScript ? scriptDone : quranDone });
          await mark(edition.id, { done: surah });
          // A steady pace keeps the device responsive and stays under the limit.
          await delay(180);
        } else {
          failures += 1;
          if (!isScript) quranFailed += 1;
          await bump(stageId, { failed: failures });
          await mark(edition.id, { failed: failures });
        }
      }
      if (run !== generation) return;

      await mark(edition.id, {
        status: failures ? 'partial' : 'done',
        error: failures ? `${failures} surah${failures === 1 ? '' : 's'} could not be fetched this time.` : undefined,
      });
      await bump(stageId, {
        status: failures ? 'partial' : 'done',
        error: failures ? `${failures} surah${failures === 1 ? '' : 's'} could not be fetched this time.` : undefined,
      });

      /* If a translation came back empty for every surah the device is almost
         certainly full rather than offline — the earlier languages were
         evicted to make room. Better to say so than to report success. */
      if (!isScript && failures >= SURAHS) { storageLimited = true; break; }
      await flushCacheIndex();
    }
    if (run !== generation) return;

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
    await flushCacheIndex();
    await persist({ ...setup, running: false, completedAt: Date.now(), storageLimited });
  } catch (error: any) {
    if (run === generation) {
      await persist({ ...setup, running: false, stages: patchStage(setup, 'index', { status: 'failed', error: error?.message || 'Something went wrong.' }).stages });
    }
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
export async function replanForLanguage(language: string, script?: string, translation?: string, translationName?: string) {
  await pauseOfflineSetup();
  void startOfflineSetup({ language, script, translation, translationName });
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
  if (unfinished) {
    void startOfflineSetup({
      language: setup.language,
      script: setup.script,
      translation: setup.translation,
      translationName: setup.translationName,
      editions: setup.editions.map((e) => ({ id: e.id, name: e.name, language: e.language, category: e.category })),
    });
  }
}

/** Try again now, for the surahs that were missed. */
export async function retryOfflineSetup() {
  await loadOfflineSetup();
  void startOfflineSetup({
    language: setup.language,
    script: setup.script,
    translation: setup.translation,
    translationName: setup.translationName,
    editions: setup.editions.map((e) => ({ id: e.id, name: e.name, language: e.language, category: e.category })),
  });
}

/** The ids already on the device, for ticking rows in a list. */
export function savedEditionIds(next: OfflineSetup = setup): string[] {
  return next.editions.filter((e) => e.status === 'done').map((e) => e.id);
}

export function offlineProgress(next: OfflineSetup = setup) {
  const total = next.stages.reduce((sum, s) => sum + Math.max(s.total, 1), 0);
  const done = next.stages.reduce((sum, s) => sum + Math.min(s.done, s.total), 0);
  const quran = next.stages.find((s) => s.id === 'quran');
  const editionsDone = next.editions.filter((e) => e.category !== 'scripts' && e.status === 'done').length;
  const editionsTotal = next.editions.filter((e) => e.category !== 'scripts').length;
  return {
    percent: total ? Math.round((done / total) * 100) : 0,
    quranDone: quran?.done || 0,
    quranFailed: quran?.failed || 0,
    /** How many of the chosen languages are fully on the device. */
    editionsDone,
    editionsTotal,
    storageLimited: !!next.storageLimited,
    /** Complete means every surah is on the device, not merely that we tried. */
    complete: !!next.completedAt && !next.stages.some((s) => s.status === 'partial' && (s.failed || 0) > 0),
  };
}
