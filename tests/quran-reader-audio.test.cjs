const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

/**
 * The reader following the recitation - without a second player.
 *
 * This file exists because of a mistake worth keeping: a bar was built inside
 * the reader before anyone looked at `MiniPlayer`, which already floats over
 * every screen whenever a track is playing. Two bars appeared at once.
 *
 * The rule: one player, one bar. The reader marks the sounding verse and may
 * move the page, and both of those are drawn by the reader and driven by the
 * bar that was already there.
 */

const source = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const reader = () => source.slice(source.indexOf('function ReaderScreen('), source.indexOf('function VerseActionButton('));
const mini = () => source.slice(source.indexOf('function MiniPlayer('), source.indexOf('async function playFromReader('));

test('there is exactly one player bar in the app', () => {
  const elements = source.match(/function MiniPlayer\(/g) || [];
  assert.equal(elements.length, 1, 'the app has one floating player');
  /* The duplicate that caused this file is gone, component, import and all. */
  assert.ok(!source.includes('ReaderAudioBar'), 'no second bar component is imported or drawn');
  assert.ok(!source.includes('readerAudioWrap'), 'and no second bar is laid out in the reader');
});

test('the reader does not open its own audio player', () => {
  const block = reader();
  assert.ok(block.includes('useAudio()'), 'it reads the shared state');
  assert.ok(!block.includes('useAudioPlayer('), 'and never opens a second player');
  assert.ok(!block.includes('expo-audio'), 'nor reaches for the audio engine directly');
});

test('the sounding verse is marked, and only within the surah on the page', () => {
  const block = reader();
  const derive = block.slice(block.indexOf('const audioVerseKey='), block.indexOf('const audioPlaying='));
  assert.ok(derive.includes("section==='surah'"), 'a surah is followed; a juz or page is not');
  assert.ok(derive.includes('audio.track.chapterId===chapterId'), 'the track must belong to this chapter');
  assert.ok(block.includes('audioVerseKey===v.verse_key&&s.ayahSounding'), 'and that verse is drawn as sounding');
});

test('the page follows on its own, with no switch to press', () => {
  const block = reader();
  const effect = block.slice(block.indexOf('if(!audioVerseKey||!verses.length)return;') - 40);
  assert.ok(effect.includes('setTarget(audioVerseKey)'), 'the page moves to the sounding verse');
  assert.ok(!effect.includes('followAudio'), 'and asks no permission first');
  /* A setting here would be a way to break the feature: the page and the sound
     would disagree, and the bar would have to explain the disagreement. */
  assert.ok(!source.includes('followRecitation'), 'there is no follow preference at all');
  assert.ok(!source.includes('followAudio'), 'and no local follow state either');
  assert.ok(!mini().includes("accessibilityRole=\"switch\""), 'the bar carries no follow switch');
});

test('following still cannot drag a reader across the book', () => {
  const block = reader();
  assert.ok(block.includes("verses.some(v=>v.verse_key===audioVerseKey)"), 'a verse off this page is not chased');
  const derive = block.slice(block.indexOf('const audioVerseKey='), block.indexOf('const audioPlaying='));
  assert.ok(derive.includes('audio.track.chapterId===chapterId'), 'and another surah never produces a target');
});

test('the bar names the verse being recited, not only the surah', () => {
  assert.ok(mini().includes('audio.track.chapterId}:${audio.track.ayahNumber'), 'the position is shown');
});

test('the sounding style is distinct from the bookmark style', () => {
  assert.ok(source.includes('ayahSounding:{borderColor:C.gold'), 'the verse in play has its own look');
  assert.ok(source.includes('ayahSelected:{borderColor:C.gold'), 'and bookmarks keep theirs');
  assert.notEqual(
    source.match(/ayahSounding:\{[^}]*\}/)[0],
    source.match(/ayahSelected:\{[^}]*\}/)[0],
    'they are not the same style',
  );
});
