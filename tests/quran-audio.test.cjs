const assert = require('node:assert/strict');
const test = require('node:test');
const { ayahs, tracks, tick, deferred, createAudioHarness } = require('./helpers/audio-harness.cjs');

const SESSION_KEY = '@deen/audio-session/v1';
function savedSession() {
  return { chapterId: 2, chapterName: 'Surah 2', reciterMode: 'verse',
    edition: 'ar.alafasy', translationEdition: 'en.walk', sequential: false,
    index: 0, position: 0, savedAt: 1 };
}

test('Android cold start: the FIRST tap plays the selected ayah, not ayah 1', async () => {
  const h = createAudioHarness();
  await h.service.playQueue(tracks(), 4);
  assert.equal(h.plays[0].uri, 'https://example.test/verse-5.mp3');
  assert.equal(h.playlists[0].initialSources.length, 7, 'Do not prepare an empty native playlist');
  assert.equal(h.snapshot().track.ayahNumber, 5);
  await h.service.clearQueue();
});

test('Android repeat tap still targets the same ayah', async () => {
  const h = createAudioHarness();
  await h.service.playQueue(tracks(), 4);
  await h.service.playQueue(tracks(), 4);
  assert.ok(h.plays.every((play) => play.uri === 'https://example.test/verse-5.mp3'));
  await h.service.clearQueue();
});

test('new Surah and a selected last ayah start at the requested index', async () => {
  const h = createAudioHarness();
  await h.service.playQueue(tracks(55), 2);
  await h.service.playQueue(tracks(2), 6);
  assert.deepEqual(h.plays.map((play) => play.index), [2, 6]);
  assert.equal(h.snapshot().track.chapterId, 2);
  await h.service.clearQueue();
});

test('native preparation without sources does not construct an empty playlist', async () => {
  const h = createAudioHarness();
  await h.engine.prepare();
  assert.equal(h.playlists.length, 0);
});

test('native queue rebuild events are not reported as a completed ayah', async () => {
  const h = createAudioHarness({ coldEmptySeek: false, finishOnClear: true });
  const ended = [];
  h.engine.bind((status) => { if (status.endedIndex !== null) ended.push(status.endedIndex); });
  await h.engine.loadQueue(tracks(), 3, true, 1, 1);
  await h.engine.loadQueue(tracks(2), 5, true, 1, 1);
  assert.deepEqual(ended, [], 'clear/rebuild must not trigger repeat-all back to ayah 1');
});

test('web first-tap selection remains unchanged', async () => {
  const h = createAudioHarness({ platform: 'web' });
  await h.service.playQueue(tracks(), 4);
  assert.equal(h.plays[0].uri, 'https://example.test/verse-5.mp3');
  await h.service.clearQueue();
});

test('iOS first-tap selection remains unchanged', async () => {
  const h = createAudioHarness({ platform: 'ios' });
  await h.service.playQueue(tracks(), 4);
  assert.equal(h.plays[0].uri, 'https://example.test/verse-5.mp3');
  await h.service.clearQueue();
});

test('a verse action bypasses a whole-Surah download and full-Surah preference', async () => {
  const h = createAudioHarness({ localUri: 'file:///saved-surah.mp3' });
  await h.service.saveAudioSettings({ reciterMode: 'surah', surahReciterId: 1 });
  await h.service.playVerse(55, 5, 'Ar-Rahman');
  assert.equal(h.plays[0].uri, 'https://example.test/verse-5.mp3');
  assert.equal(h.snapshot().track.ayahNumber, 5);
  assert.equal(h.localCalls.length, 0, 'A whole-Surah file has no per-ayah seek positions');
  assert.equal(h.service.getAudioSettings().reciterMode, 'surah', 'Keep the person\'s saved reciter preference');
  await h.service.clearQueue();
});

test('whole-Surah playback still prefers the downloaded file', async () => {
  const h = createAudioHarness({ localUri: 'file:///saved-surah.mp3' });
  const queue = await h.service.buildQueueForChapter(55, 'Ar-Rahman', h.service.getAudioSettings());
  assert.equal(queue.length, 1);
  assert.equal(queue[0].uri, 'file:///saved-surah.mp3');
});

test('a missing ayah never silently falls back to ayah 1', async () => {
  const h = createAudioHarness();
  await assert.rejects(h.service.playVerse(55, 99, 'Ar-Rahman'));
  assert.equal(h.plays.length, 0);
});

test('translation interleaving finds the Arabic track for the requested ayah', async () => {
  const h = createAudioHarness();
  await h.service.saveAudioSettings({ translationAudioEnabled: true, sequential: true });
  await h.service.playVerse(55, 5, 'Ar-Rahman');
  assert.equal(h.plays[0].index, 8, 'Arabic ayah 5 is index 8 in the interleaved queue');
  assert.equal(h.snapshot().track.kind, 'arabic');
  assert.equal(h.snapshot().track.ayahNumber, 5);
  await h.service.clearQueue();
});

test('a slow older verse request cannot overwrite a newer tap', async () => {
  const started = deferred();
  const gate = deferred();
  const h = createAudioHarness({ getSurahAudio: async (id) => {
    if (id === 2) { started.resolve(); return gate.promise; }
    return ayahs();
  } });
  const old = h.service.playVerse(2, 5);
  await started.promise;
  await h.service.playVerse(55, 3);
  gate.resolve(ayahs());
  await old;
  assert.equal(h.plays.length, 1);
  assert.equal(h.snapshot().track.chapterId, 55);
  assert.equal(h.snapshot().track.ayahNumber, 3);
  await h.service.clearQueue();
});

test('startup session restore cannot overwrite the ayah the user just selected', async () => {
  const started = deferred();
  const gate = deferred();
  const h = createAudioHarness({ getSurahAudio: async () => { started.resolve(); return gate.promise; } });
  h.storage.set(SESSION_KEY, JSON.stringify(savedSession()));
  const restoring = h.service.restoreSavedSession();
  await started.promise;
  await h.service.playQueue(tracks(55), 4);
  gate.resolve(ayahs());
  assert.equal(await restoring, false);
  assert.equal(h.snapshot().track.chapterId, 55);
  assert.equal(h.snapshot().track.ayahNumber, 5);
  await h.service.clearQueue();
});

test('clearing playback cancels an in-flight startup restore', async () => {
  const started = deferred();
  const gate = deferred();
  const h = createAudioHarness({ getSurahAudio: async () => { started.resolve(); return gate.promise; } });
  h.storage.set(SESSION_KEY, JSON.stringify(savedSession()));
  const restoring = h.service.restoreSavedSession();
  await started.promise;
  await h.service.clearQueue();
  gate.resolve(ayahs());
  assert.equal(await restoring, false);
  assert.equal(h.snapshot().track, null);
});

test('a delayed saved-position seek cannot move a newly selected ayah', async () => {
  const h = createAudioHarness();
  const gate = deferred();
  h.engine.getDuration = () => gate.promise;
  h.storage.set(SESSION_KEY, JSON.stringify({ ...savedSession(), position: 19 }));
  assert.equal(await h.service.restoreSavedSession(), true);
  await h.service.playQueue(tracks(55), 4);
  gate.resolve(30);
  await tick();
  assert.ok(!h.seeks.includes(19), 'Old restore must not seek inside the newly selected verse');
  await h.service.clearQueue();
});

test('normal native completion is still reported after a selection settles', async () => {
  const h = createAudioHarness();
  const ended = [];
  h.engine.bind((status) => { if (status.endedIndex !== null) ended.push(status.endedIndex); });
  await h.engine.loadQueue(tracks(), 4, true, 1, 1);
  await new Promise((resolve) => setTimeout(resolve, 450));
  h.playlists[0].status({ didJustFinish: true });
  assert.deepEqual(ended, [4]);
});

test('a genuine completion just after seeking near the end is not swallowed', async () => {
  const h = createAudioHarness();
  const ended = [];
  h.engine.bind((status) => { if (status.endedIndex !== null) ended.push(status.endedIndex); });
  await h.engine.loadQueue(tracks(), 4, true, 1, 1);
  await new Promise((resolve) => setTimeout(resolve, 450));
  await h.engine.seek(29.9);
  h.playlists[0].status({ didJustFinish: true, currentTime: 30 });
  assert.deepEqual(ended, [4]);
});

test('a delayed ended status from clearing the old timeline is ignored', async () => {
  const h = createAudioHarness();
  const ended = [];
  h.engine.bind((status) => { if (status.endedIndex !== null) ended.push(status.endedIndex); });
  await h.engine.loadQueue(tracks(), 4, true, 1, 1);
  await new Promise((resolve) => setTimeout(resolve, 450));
  h.playlists[0].status({ didJustFinish: true, currentIndex: 0 });
  assert.deepEqual(ended, []);
});

test('a stale clear event cannot relabel the selected ayah as ayah 1', async () => {
  const h = createAudioHarness();
  const ended = [];
  h.engine.bind((status) => { if (status.endedIndex !== null) ended.push(status.endedIndex); });
  await h.engine.loadQueue(tracks(), 4, true, 1, 1);
  h.playlists[0].emit('trackChanged', { previousIndex: 4, currentIndex: 0 });
  await new Promise((resolve) => setTimeout(resolve, 450));
  h.playlists[0].status({ didJustFinish: true });
  assert.deepEqual(ended, [4]);
});

test('overlapping native loads share one prepared playlist and keep the latest sources', async () => {
  const h = createAudioHarness();
  const second = tracks(2).map((track) => ({ ...track, uri: track.uri.replace('/verse-', '/surah2-verse-') }));
  await Promise.all([
    h.engine.loadQueue(tracks(55), 4, true, 1, 1),
    h.engine.loadQueue(second, 2, true, 1, 1),
  ]);
  assert.equal(h.playlists.length, 1);
  assert.equal(h.plays.at(-1).uri, 'https://example.test/surah2-verse-3.mp3');
});

test('a saved session restores paused at its saved ayah, never autoplaying', async () => {
  const h = createAudioHarness();
  h.storage.set(SESSION_KEY, JSON.stringify({ ...savedSession(), index: 3 }));
  assert.equal(await h.service.restoreSavedSession(), true);
  assert.equal(h.snapshot().track.ayahNumber, 4);
  assert.equal(h.plays.length, 0);
  await h.service.clearQueue();
});

test('playback changes do not alter prayer records, notes or downloaded files', async () => {
  const h = createAudioHarness({ localUri: 'file:///saved-surah.mp3' });
  const kept = {
    '@deen/prayer-completion/v1': '{"2026-10-26":["Fajr"]}',
    '@deen/quran-notes/v1': '[{"verseKey":"55:5","note":"Keep this note"}]',
    '@deen/downloads/v1': '[{"uri":"file:///saved-surah.mp3"}]',
  };
  for (const [key, value] of Object.entries(kept)) h.storage.set(key, value);
  await h.service.playVerse(55, 5);
  await h.service.clearQueue();
  for (const [key, value] of Object.entries(kept)) assert.equal(h.storage.get(key), value);
});
