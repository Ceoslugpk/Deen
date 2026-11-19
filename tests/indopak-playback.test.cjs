const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { tracks, tick, createAudioHarness } = require('./helpers/audio-harness.cjs');
const load = createLoader();
const model = load('src/services/indopakMushaf.ts');
const playback = load('src/services/indopakPlayback.ts');
const plain = x => JSON.parse(JSON.stringify(x));
const ayah = (chapterId = 55, ayahNumber = 5) => ({ chapterId, ayahNumber, globalNumber: 4906, kind: 'arabic' });
const key = h => playback.indopakRecitingVerse(h.service.getAudioSnapshot().track, h.service.getAudioSnapshot().error);

test('recitation highlighting uses canonical audio-track keys for Arabic and spoken translations', () => {
  assert.equal(playback.indopakRecitingVerse(ayah()), '55:5');
  assert.equal(playback.indopakRecitingVerse({ ...ayah(), kind: 'translation' }), '55:5');
  assert.equal(playback.indopakRecitingVerse(ayah(114, 6)), '114:6');
});

test('absent/error/malformed and untimed full-Surah or downloaded tracks never invent a reciting ayah', () => {
  assert.equal(playback.indopakRecitingVerse(null), null);
  assert.equal(playback.indopakRecitingVerse(ayah(), 'Playback unavailable'), null);
  for (const patch of [{ globalNumber: 0 }, { globalNumber: -1 }, { globalNumber: NaN }, { globalNumber: 1.5 },
    { chapterId: 0 }, { chapterId: 115 }, { chapterId: 1.5 }, { chapterId: '55' },
    { ayahNumber: 0 }, { ayahNumber: 79 }, { ayahNumber: 5.5 }, { ayahNumber: '5' }, { kind: 'live' }]) {
    assert.equal(playback.indopakRecitingVerse({ ...ayah(), ...patch }), null, JSON.stringify(patch));
  }
});

test('all 6,236 recitation targets resolve to exact original word IDs in this 548-page edition', () => {
  let count = 0;
  for (const chapter of model.indopakMeta().chapters) for (let n = 1; n <= chapter.verses; n++) {
    const verse = `${chapter.id}:${n}`, target = playback.indopakRecitationTarget(verse, 1);
    assert.ok(target); const page = model.indopakPage(target.page);
    assert.equal(model.indopakVerseKey(page.words[target.wordId - page.firstWord]), verse);
    assert.ok(target.page >= 1 && target.page <= 548); count++;
  }
  assert.equal(count, 6236);
  assert.equal(playback.indopakRecitationTarget('55:5', 1).page, 478);
  assert.equal(playback.indopakRecitationTarget('2:5', 2).page, 3);
});

test('page-spanning recitation retains its visible later-page fragment instead of jumping backwards', () => {
  let split = 0;
  for (let n = 2; n <= 548; n++) {
    const page = model.indopakPage(n), verse = model.indopakVerseKey(page.words[0]);
    if (verse !== model.indopakVerseKey(model.indopakPage(n - 1).words.at(-1))) continue;
    assert.deepEqual(plain(playback.indopakRecitationTarget(verse, n)), { page: n, verse, wordId: page.firstWord });
    split++;
  }
  assert.ok(split > 0);
});

test('invalid recitation keys are ignored and invalid current pages fall back only to the authentic map', () => {
  for (const verse of [null, '', '0:1', '115:1', '2:287', '2:5:1', '01:01', ' 2:5']) assert.equal(playback.indopakRecitationTarget(verse, 274), null);
  for (const page of [0, 549, 604, NaN, Infinity]) assert.equal(playback.indopakRecitationTarget('55:5', page).page, 478);
});

test('already readable recitation anchors never reset the reader scroll, including centred paper', () => {
  const viewport = { width: 400, height: 600 }, size = { width: 1000, height: 1640 };
  assert.equal(playback.indopakRecitationOffset(viewport, size, { x: 350, y: 500 }, { x: 500, y: 700, width: 100, height: 60 }), null);
  assert.equal(playback.indopakRecitationOffset({ width: 800, height: 1000 }, { width: 400, height: 656 }, { x: 0, y: 0 },
    { x: 700, y: 1400, width: 100, height: 80 }), null);
});

test('offscreen recitation anchors reveal their real zoomed line with safe clamped offsets on both axes', () => {
  const offset = playback.indopakRecitationOffset({ width: 400, height: 600 }, { width: 1000, height: 1640 }, { x: 0, y: 0 },
    { x: 700, y: 1400, width: 100, height: 80 });
  assert.deepEqual(plain(offset), { x: 550, y: 1040 });
  const short = playback.indopakRecitationOffset({ width: 400, height: 140 }, { width: 1000, height: 1640 }, { x: 0, y: 0 },
    { x: 700, y: 1400, width: 100, height: 80 });
  assert.ok(1400 - short.y >= 6 && 1480 - short.y <= 134, 'Short panes reduce headroom instead of clipping a line that fits');
});

test('the reader subscription compares primitive ayah keys, not 500ms progress/buffering snapshots', () => {
  let audio = { track: ayah(), error: null }, observer, subscriptions = 0, disposed = false;
  const hook = createLoader({
    react: { useSyncExternalStore: (subscribe, getSnapshot, serverSnapshot) => { observer = { subscribe, getSnapshot, serverSnapshot }; return getSnapshot(); } },
    './audioService': { getAudioSnapshot: () => audio, subscribeAudio: fn => { subscriptions++; return () => { disposed = true; }; } },
  })('src/services/useIndopakRecitation.ts');
  assert.equal(hook.useIndopakRecitation(), '55:5');
  const unsubscribe = observer.subscribe(() => {}); assert.equal(subscriptions, 1);
  assert.equal(observer.serverSnapshot(), null);
  for (let position = 0; position < 10; position++) {
    audio = { ...audio, position, playing: position % 2 === 0, buffering: position % 3 === 0 };
    assert.equal(observer.getSnapshot(), '55:5');
  }
  audio = { ...audio, track: { ...ayah(), kind: 'translation' } }; assert.equal(observer.getSnapshot(), '55:5');
  audio = { ...audio, track: ayah(55, 6) }; assert.equal(observer.getSnapshot(), '55:6');
  audio = { ...audio, track: null }; assert.equal(observer.getSnapshot(), null);
  unsubscribe(); assert.equal(disposed, true);
});

for (const platform of ['android', 'ios']) test(`${platform} transport completion, not elapsed time, changes the authoritative highlight across a printed page boundary`, async () => {
  const h = createAudioHarness({ platform });
  await h.service.playQueue(tracks(2, 17), 3);
  try {
    assert.equal(key(h), '2:4');
    const snapshot = h.service.getAudioSnapshot(); assert.equal(snapshot, h.snapshot()); assert.equal(h.service.getAudioSnapshot(), snapshot);
    h.playlists[0].status({ currentTime: 29.9, duration: 30 });
    assert.equal(key(h), '2:4', 'Near the end is not the next ayah');
    h.playlists[0].status({ didJustFinish: true, currentTime: 30 }); await tick();
    assert.equal(key(h), '2:5'); assert.equal(playback.indopakRecitationTarget(key(h), 2).page, 3);
    await h.service.pause(); assert.equal(key(h), '2:5', 'Pause retains the current ayah');
    await h.service.resume(); assert.equal(key(h), '2:5');
    await h.service.seekTo(0); assert.equal(key(h), '2:5');
    await h.service.previousTrack(); assert.equal(key(h), '2:4');
    await h.service.nextTrack(); assert.equal(key(h), '2:5');
    await new Promise(resolve => setTimeout(resolve, 450));
    h.playlists[0].currentIndex = 5;
    h.playlists[0].emit('trackChanged', { previousIndex: 4, currentIndex: 5 }); await tick();
    assert.equal(key(h), '2:6', 'Native automatic playlist moves publish the new track too');
  } finally { await h.service.clearQueue(); }
  assert.equal(key(h), null, 'Closing the player clears only the recitation highlight');
});

test('sequential translation and repeat-one keep the same highlighted ayah until the real queue advances', async () => {
  const h = createAudioHarness();
  const [first, second] = tracks(2, 2);
  const translation = { ...first, id: 'translation:2:1:en.test', kind: 'translation', edition: 'en.test' };
  try {
    await h.service.playQueue([first, translation, second]); assert.equal(key(h), '2:1');
    h.playlists[0].status({ didJustFinish: true }); await tick();
    assert.equal(h.snapshot().track.kind, 'translation'); assert.equal(key(h), '2:1');
    h.playlists[0].status({ didJustFinish: true }); await tick(); assert.equal(key(h), '2:2');
    await h.service.saveAudioSettings({ repeat: 'one', repeatCount: 2 });
    await h.service.playQueue([first, second]);
    h.playlists[0].status({ didJustFinish: true }); await tick(); assert.equal(key(h), '2:1');
    h.playlists[0].status({ didJustFinish: true }); await tick(); assert.equal(key(h), '2:2');
  } finally { await h.service.clearQueue(); }
});

test('following stays focus/interaction-gated, manual browsing opts out, and the saved marker is separate', () => {
  const root = path.resolve(__dirname, '..');
  const reader = fs.readFileSync(path.join(root, 'src/components/IndopakMushafReader.tsx'), 'utf8');
  const canvas = fs.readFileSync(path.join(root, 'src/components/IndopakPageCanvas.tsx'), 'utf8');
  assert.ok(reader.includes('!audioFollow || !focused')); assert.ok(reader.includes('picker || selection || pendingReveal || wordPressing || pageTouching'));
  assert.ok(reader.includes("if (!followingAudio) { setAudioFollow(null); lastFollowed.current = ''; }"));
  assert.ok(reader.includes('goPage(target.page, true)')); assert.ok(reader.includes('recitingVerse={recitingVerse}'));
  assert.ok(canvas.includes('s.verse === recitingVerse')); assert.ok(canvas.includes('s.verse === readingPoint'));
  const effect = reader.slice(reader.indexOf('if (!audioFollow || !focused'), reader.indexOf('const swipeFrom'));
  assert.ok(!effect.includes('readingPoint:')); assert.ok(!effect.includes('setSelection('));
});
