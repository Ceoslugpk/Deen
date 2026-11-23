const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Focus mode, and what "focused" is allowed to mean.
 *
 * Before this, focus mode hid the header and the tab bar and stopped there. A
 * verse in continuous mode still carried its number, five action buttons, a
 * Juz/Page/edition footer and a commentary chip - seven pieces of apparatus
 * per verse, on a page meant for reading. Continuous had flattened the card
 * and nothing else.
 *
 * The rule now: in focus mode a verse is its text. The tools are not removed -
 * one tap on the verse brings them back for that verse - but they are at rest.
 */

const app = () => fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const reader = () => {
  const source = app();
  return source.slice(source.indexOf('function ReaderScreen('), source.indexOf('function VerseActionButton('));
};

const quietFlag = () => {
  const block = reader();
  const line = block.slice(block.indexOf('const quiet='), block.indexOf('\n', block.indexOf('const quiet=')));
  return line;
};

test('a verse at rest shows its text and nothing else', () => {
  const source = reader();
  /* Each of these was on screen in focus mode before. The ayah number row,
     its five buttons, the Juz/Page footer and the commentary chip are all
     wrapped so that a quiet verse does not draw them. */
  assert.ok(/\{quiet\?<Text style=\{s\.ayahQuietNo\}>/.test(source), 'a quiet verse draws the small number instead of the toolbar row');
  assert.ok(/\{quiet\?null:<View style=\{s\.ayahFooter\}>/.test(source), 'the Juz/Page/edition footer is hidden');
  assert.ok(/\{quiet\?null:<TafsirPanel/.test(source), 'the commentary chip is hidden');
  /* And the toolbar row only exists in the non-quiet branch of the same
     ternary, so it cannot be drawn for a quiet verse. */
  const quietLine = source.slice(source.indexOf('{quiet?<Text style={s.ayahQuietNo}>'));
  const ternary = quietLine.slice(0, quietLine.indexOf('</>}') + 3);
  assert.ok(ternary.includes('s.ayahTop'), 'the number row lives in the branch a quiet verse does not take');
  assert.ok(!ternary.slice(0, ternary.indexOf(':')).includes('ayahActions'), 'and so do the buttons');
});

test('the ayah number stays, as a small marker rather than a key', () => {
  const source = reader();
  assert.ok(source.includes('s.ayahQuietNo'), 'a quiet verse still says which verse it is');
  /* `2:255` is a database key. A mushaf prints ٢٥٥. The app already converts
     for its page markers, so this uses the same function rather than a second
     one that could drift. */
  assert.ok(source.includes("toArabicDigits(String(v.verse_key).split(':')[1]"), 'and prints the ayah number as digits');
});

test('nothing has been taken away, only put down', () => {
  const source = reader();
  /* The tap that brings the header back also opens this verse's tools, and
     closes them again if they were open. Focus mode hides; it does not
     disable, and every action remains one tap from the verse it belongs to. */
  assert.ok(source.includes('if(focusOn)setQuietOpen(prev=>prev===v.verse_key?null:v.verse_key)'), 'a tap toggles one verse’s tools');
  assert.ok(source.includes('const[quietOpen,setQuietOpen]=useState<string|null>(null)'), 'tracked per verse, not as one global switch');
});

test('leaving focus mode restores every verse', () => {
  const source = reader();
  assert.ok(source.includes('setQuietOpen(null)'), 'the open verse is forgotten when focus mode ends');
  /* Otherwise a verse opened in focus mode would still be open, with no
     toolbar, after focus mode was switched off — a worse state than either. */
  const effect = source.slice(source.indexOf('if(!focusOn){setChromeShown(true)'), source.indexOf('}', source.indexOf('if(!focusOn){setChromeShown(true)')));
  assert.ok(effect.includes('setQuietOpen(null)'), 'inside the focus-mode effect');
});

test('a quiet verse is still a verse: the reading body is untouched', () => {
  const source = reader();
  const body = source.slice(source.indexOf('const quiet='), source.indexOf('<TafsirPanel'));
  /* What must survive: the Arabic, the transliteration and the translation.
     Stripping the apparatus is not stripping the Quran. */
  assert.ok(body.includes('v.text_uthmani'), 'the Arabic is still drawn');
  assert.ok(body.includes('v.translation'), 'the translation is still drawn');
  assert.ok(body.includes('v.transliteration'), 'so is the transliteration');
  assert.ok(!/quiet[^?]*\?\s*null\s*:\s*<Text style=\{\[s\.ayahAr/.test(body), 'the verse text is never conditional on being quiet');
});

test('focus and continuous stay independent', () => {
  const source = app();
  /* Two separate switches, as chosen: focus mode is useful on cards and
     continuous mode is useful without it. Linking them would take a setting
     decision out of the reader's hands. */
  const toggles = source.slice(source.indexOf("READING MODE"));
  assert.ok(toggles.includes('update({focusMode:!preferences.focusMode})'), 'focus mode has its own switch');
  assert.ok(toggles.includes("update({readingMode:'continuous'})"), 'and continuous has its own');
  assert.ok(!source.includes("update({focusMode:true,readingMode:'continuous'})"), 'one does not force the other');
});

test('the audio bar is not hidden by focus mode', () => {
  const source = app();
  const mini = source.slice(source.indexOf('function MiniPlayer('), source.indexOf('async function playFromReader('));
  /* The one bar the reader can reach audio from. Hiding it, as the IndoPak
     mushaf does through its focus context, would mean two taps to pause. */
  assert.ok(mini.includes('if (!audio.track'), 'it hides when nothing is playing');
  assert.ok(!mini.includes('preferences.focusMode'), 'and not because focus mode is on');
});

test('the reader still remembers where the reader was', () => {
  const source = reader();
  /* Focus mode hides chrome; it must not stop the position being saved, or a
     person who reads in focus mode loses their place every time. */
  assert.ok(source.includes('rememberPosition'), 'position is still remembered');
});
