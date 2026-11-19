const { createLoader } = require('./load-typescript.cjs');

const tick = () => new Promise((resolve) => setImmediate(resolve));
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function ayahs(count = 7) {
  return Array.from({ length: count }, (_, index) => ({
    numberInSurah: index + 1, globalNumber: index + 1,
    audio: `https://example.test/verse-${index + 1}.mp3`, text: '',
  }));
}
function tracks(chapterId = 55, count = 7) {
  return ayahs(count).map((ayah) => ({
    id: `arabic:${chapterId}:${ayah.numberInSurah}:ar.alafasy`,
    title: `Surah ${chapterId} · Verse ${ayah.numberInSurah}`,
    subtitle: 'Test reciter', chapterId, chapterName: `Surah ${chapterId}`,
    ayahNumber: ayah.numberInSurah, globalNumber: ayah.globalNumber,
    kind: 'arabic', edition: 'ar.alafasy', performer: 'Test reciter', uri: ayah.audio,
  }));
}

function createAudioHarness(options = {}) {
  const platform = options.platform || 'android';
  const storage = options.storage || new Map();
  const cache = new Map();
  const playlists = [];
  const plays = [];
  const seeks = [];
  const localCalls = [];
  const pauses = [], replacements = [];
  let snapshot;
  class FakePlaylist {
    constructor({ sources }) {
      this.initialSources = Array.from(sources);
      this.sources = Array.from(sources);
      this.currentIndex = 0;
      this.currentTime = 0;
      this.duration = 30;
      this.ready = sources.length > 0;
      this.listeners = new Map();
      this.playing = false;
      this.metadata = null;
      playlists.push(this);
    }
    addListener(name, callback) {
      if (!this.listeners.has(name)) this.listeners.set(name, []);
      this.listeners.get(name).push(callback);
      return { remove() {} };
    }
    emit(name, data) { for (const callback of this.listeners.get(name) || []) callback(data); }
    status(patch = {}) {
      this.emit('playlistStatusUpdate', {
        currentIndex: this.currentIndex, trackCount: this.sources.length,
        currentTime: this.currentTime, duration: this.duration,
        playing: this.playing, isBuffering: false, didJustFinish: false, ...patch,
      });
    }
    clear() {
      this.sources = [];
      this.currentIndex = 0;
      this.playing = false;
      this.status({ didJustFinish: !!options.finishOnClear });
    }
    add(source) { this.sources.push(source); }
    skipTo(index) {
      // Defensive native-contract model, NOT an Android device reproduction:
      // simulate the first seek being dropped on a timeline prepared empty.
      // The invariant is that production never constructs that empty timeline.
      if (platform === 'android' && options.coldEmptySeek !== false && !this.ready) return;
      const previousIndex = this.currentIndex;
      this.currentIndex = index;
      this.currentTime = 0;
      this.emit('trackChanged', { previousIndex, currentIndex: index });
    }
    play() {
      this.ready = true;
      this.playing = true;
      plays.push({ index: this.currentIndex, uri: this.sources[this.currentIndex]?.uri, metadata: this.metadata });
      this.status();
    }
    pause() { this.playing = false; pauses.push({ uri: this.sources[this.currentIndex]?.uri }); }
    async seekTo(position) {
      this.currentTime = position; seeks.push(position);
      if (options.beforeSeek) await options.beforeSeek(position);
    }
    setActiveForLockScreen(_active, metadata) { this.metadata = metadata; }
    updateLockScreenMetadata(metadata) { this.metadata = metadata; }
    clearLockScreenControls() {}
    destroy() {}
  }
  const webPlayer = {
    currentTime: 0, duration: 30, volume: 1, uri: '', playing: false,
    listener: null,
    addListener(_name, listener) { this.listener = listener; }, setPlaybackRate() {},
    replace(source) {
      this.uri = typeof source === 'string' ? source : source.uri;
      this.currentTime = 0; replacements.push(this.uri);
    },
    status(patch = {}) { this.listener?.({ playing: this.playing, currentTime: this.currentTime, duration: this.duration, isBuffering: false, didJustFinish: false, ...patch }); },
    play() { this.playing = true; plays.push({ uri: this.uri }); this.status(); },
    pause() { this.playing = false; pauses.push({ uri: this.uri }); },
    async seekTo(position) { this.currentTime = position; seeks.push(position); },
  };
  const api = {
    ayahAudioUrl: (edition, number) => `https://example.test/${edition}/${number}.mp3`,
    getSurahAudio: options.getSurahAudio || (async () => ayahs()),
    getAudioEditions: options.getAudioEditions || (async () => require('../../src/data/audio-editions.json').editions.map((entry) => ({ ...entry }))),
    getSurahReciters: async () => [{ id: 1, name: 'Test reciter', urlTemplate: 'https://example.test/full/{surahPadded3}.mp3' }],
  };
  const load = createLoader({
    'react-native': { Platform: { OS: platform } },
    'expo-audio': {
      setAudioModeAsync: async () => {},
      createAudioPlaylist: (configuration) => new FakePlaylist(configuration),
      createAudioPlayer: () => webPlayer,
    },
    '@react-native-async-storage/async-storage': {
      getItem: async (key) => options.getItem ? options.getItem(key, storage) : storage.get(key) ?? null,
      setItem: async (key, value) => storage.set(key, value),
      removeItem: async (key) => storage.delete(key),
    },
    './storage': {
      readText: async (key) => options.getItem ? options.getItem(key, storage) : storage.get(key) ?? null,
      writeText: async (key, value) => storage.set(key, value),
    },
    './api': api,
    './contentCache': {
      getCachedJson: async (group, key) => cache.get(`${group}/${key}`) ?? null,
      setCachedJson: async (group, key, value) => cache.set(`${group}/${key}`, value),
    },
    './downloadService': { localAudioUri: async (...args) => { localCalls.push(args); return options.localUri || null; } },
    '../content/surahNames': { surahName: (id) => `Surah ${id}` },
  });
  const service = load('src/services/audioService.ts');
  const { engine } = load('src/services/audioEngine.ts');
  service.subscribeAudio((value) => { snapshot = value; });
  return { service, engine, api, storage, playlists, plays, seeks, localCalls, pauses, replacements, webPlayer, snapshot: () => snapshot };
}

module.exports = { ayahs, tracks, tick, deferred, createAudioHarness };
