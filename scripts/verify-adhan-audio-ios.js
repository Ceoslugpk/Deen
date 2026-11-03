#!/usr/bin/env node
/**
 * Check how the adhan is reported on iOS.
 *
 * The settings screen and the scheduling pass used to answer this question
 * differently. The screen knew about the clips bundled inside the app; the
 * schedule did not. So on a phone it read correctly on arrival and then, the
 * moment somebody pressed Save, flipped to a message about the "installed
 * Android app" not running — on a device that has never had an Android app,
 * telling somebody the adhan will not sound when it is about to.
 *
 * Both now ask the same function. This checks that function, by pulling the
 * real source out of notifications.ts and running it, rather than testing a
 * copy that could drift.
 *
 *     node scripts/verify-adhan-audio-ios.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'src', 'services', 'notifications.ts');

const src = fs.readFileSync(FILE, 'utf8');
const marker = 'function adhanAudioForIos(';
const start = src.indexOf(marker);
if (start < 0) {
  console.error('FAIL: adhanAudioForIos is gone from notifications.ts');
  console.error('      the two paths have probably diverged again.');
  process.exit(1);
}
// This file closes top-level functions with '}' at column 0.
const end = src.indexOf('\n}\n', start) + 3;
let fn = src.slice(start, end)
  .replace(': AdhanAudio | null', '')
  .replace(/settings: \{[^}]*\}/, 'settings')
  .replace('settings.adhanEnabled?.[name]', 'settings.adhanEnabled[name]');

/* ---- stubs, standing in for the modules the real file imports ---- */
let OS = 'ios';
global.Platform = {};
Object.defineProperty(global.Platform, 'OS', { get: () => OS });

// Which reciters have a clip is read from the catalogue, so this cannot drift.
// Split into one block per track first: a single regex spanning entries would
// happily pair one track's `id` with the next track's `clip`.
const catalog = fs.readFileSync(path.join(ROOT, 'src', 'services', 'adhanCatalog.ts'), 'utf8');
const blocks = catalog.split(/\n {2}\{\n/).slice(1);
const withClip = new Set();
const idsWithClip = new Set();
for (const block of blocks) {
  const id = block.match(/id:\s*'([^']+)'/);
  if (!id) continue;
  const clip = block.match(/clip:\s*'([^']+)'/);
  if (clip) {
    if (withClip.has(clip[1])) {
      console.error(`FAIL: two tracks claim the clip '${clip[1]}'`);
      process.exit(1);
    }
    withClip.add(clip[1]);
    idsWithClip.add(id[1]);
  }
}
if (!idsWithClip.size) {
  console.error('FAIL: found no clips in the catalogue - the extraction above is wrong');
  process.exit(1);
}

global.adhanTrackFor = (prayerName, settings) => {
  const id = prayerName === 'Fajr'
    ? settings.adhanFajrReciter || 'fajr:traditional'
    : settings.adhanReciter || 'adhan:mishary-rashid-alafasy';
  return { id, clip: idsWithClip.has(id) ? 'clip' : undefined };
};
global.adhanSoundName = (track) => (track && track.clip ? track.clip : null);

// eslint-disable-next-line no-eval
const adhanAudioForIos = eval(`(() => { ${fn}; return adhanAudioForIos; })()`);

/* ------------------------------------------------------------- scenarios */

const clipped = 'adhan:mishary-rashid-alafasy';
const unclipped = 'adhan:karl-jenkins';
const fajrClipped = [...idsWithClip].find((id) => id.startsWith('fajr:'));
const fajrUnclipped = 'fajr:not-a-real-reciter';

const cases = [
  ['iOS, every prayer on a bundled reciter', 'ios',
    { adhanEnabled: { Fajr: 1, Dhuhr: 1, Asr: 1, Maghrib: 1, Isha: 1 }, adhanReciter: clipped, adhanFajrReciter: fajrClipped },
    { willPlay: true, reason: null, scheduled: 5, skipped: 0 }],

  ['iOS, no chosen recording has a clip', 'ios',
    { adhanEnabled: { Fajr: 1, Dhuhr: 1 }, adhanReciter: unclipped, adhanFajrReciter: fajrUnclipped },
    { willPlay: false, reason: 'ios-no-clip', scheduled: 0, skipped: 2 }],

  ['iOS, Fajr bundled and the rest not', 'ios',
    { adhanEnabled: { Fajr: 1, Dhuhr: 1, Asr: 1 }, adhanReciter: unclipped, adhanFajrReciter: fajrClipped },
    { willPlay: true, reason: null, scheduled: 1, skipped: 2 }],

  ['iOS, the adhan is switched off', 'ios',
    { adhanEnabled: {}, adhanReciter: clipped, adhanFajrReciter: fajrClipped },
    { willPlay: false, reason: 'no-adhan-enabled', scheduled: 0, skipped: 0 }],

  // Android must fall through, so the alarm decides. If it answered here, the
  // full recording would be judged by whether a thirty-second clip exists.
  ['Android falls through to the alarm', 'android',
    { adhanEnabled: { Fajr: 1, Dhuhr: 1 }, adhanReciter: clipped, adhanFajrReciter: fajrClipped },
    null],
];

let passed = 0;
const failures = [];
for (const [name, os, settings, want] of cases) {
  OS = os;
  const got = adhanAudioForIos(settings);
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) {
    passed += 1;
    console.log(`  pass  ${name}`);
  } else {
    failures.push(name);
    console.log(`  FAIL  ${name}`);
    console.log(`          wanted ${JSON.stringify(want)}`);
    console.log(`          got    ${JSON.stringify(got)}`);
  }
}

console.log(`\n  ${withClip.size} clips in the catalogue, ${idsWithClip.size} reciters carry one`);
if (failures.length) {
  console.log(`\n${failures.length} of ${cases.length} failed.`);
  process.exit(1);
}
console.log(`\nOK - all ${passed} agree, and Android still falls through to the alarm.`);
