const assert = require('node:assert/strict');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');

/**
 * The repetition counter for Hisn al-Muslim.
 *
 * Hisn al-Muslim does not carry a repeat count as a field in our corpus; the
 * count is written into the sentence. These tests fix the rule that decides
 * when it is safe to show one, and - more importantly - every case where it
 * is not.
 *
 * The count is never invented: it is either stated at the end of the row in
 * the row's own words, or there is no counter.
 */
const load = () => createLoader({}, { process: { env: {} }, __DEV__: false })('src/services/duaRepetition.ts');

test('a count stated at the end of the dua is read', () => {
  const { repetitionOf } = load();
  const rep = repetitionOf(
    'Subḥāna Rabbiyal-`Aẓīm. Glory to my Lord the Exalted (Recite three times in Arabic.)',
    'سُبْحَانَ رَبِّيَ الْعَظِيمِ (ثلاث مرات)',
  );
  assert.equal(rep.count, 3);
  assert.equal(rep.statedIn, 'both');
});

test('numbers written as words and as digits are both read', () => {
  const { repetitionOf } = load();
  assert.equal(repetitionOf('... (Recite seven times in Arabic.)', '').count, 7);
  assert.equal(repetitionOf('... (Recite 100 times in Arabic upon rising in the morning).', '').count, 100);
  assert.equal(repetitionOf('... (Recite one hundred times in Arabic).', '').count, 100);
  assert.equal(repetitionOf('... (Recite thirty-three times after each prayer.)', '').count, 33);
});

test('an Arabic count with no English one is still read', () => {
  const { repetitionOf } = load();
  const rep = repetitionOf('Glory is to my Lord, the Most High. (This is said three times in Arabic.)', 'سُبْحَانَ رَبِّيَ الأَعْلَى (ثلاثاً)');
  assert.equal(rep.count, 3);
  assert.equal(rep.statedIn, 'arabic');
});

test('a narration about the Prophet is not an instruction to the reader', () => {
  const { repetitionOf } = load();
  /* "He used to repeat a hundred times in one sitting" - a virtue, not a task. */
  assert.equal(repetitionOf("Ibn Umar (ra) said: Allah's Messenger used to repeat in a single sitting: Rabbigh'fir li... one hundred times a day.", 'كان يعد لرسول الله صلى الله عليه وسلم في المجلس الواحد مائة مرة'), null);
  assert.equal(repetitionOf('He would seek forgiveness a hundred times a day.', ''), null);
  assert.equal(repetitionOf('Whoever says this a hundred times will have a reward.', ''), null);
});

test('a count that governs several phrases is not one number for the row', () => {
  const { repetitionOf } = load();
  /* Thirty-three of this, thirty-three of that, thirty-four of the third. */
  assert.equal(repetitionOf('Glory to Allah (thirty-three times), praise to Allah (thirty-three times), Allah is the Greatest (thirty-four times).', ''), null);
  assert.equal(repetitionOf('Recite these three times each in Arabic.', 'ثلاث مرات كل واحدة'), null);
});

test('a count in the middle of a passage does not become a counter for the whole card', () => {
  const { repetitionOf } = load();
  /* The count governs the four words before it; the dua carries on. */
  assert.equal(repetitionOf('Astaghfirullāh (three times) Allāhumma antas-salām, wa minkas-salām, tabārakta yā dhal-Jalāli wal-Ikrām.', ''), null);
  assert.equal(repetitionOf('From every elevated point say Allāhu Akbar (three times), and then recite: Lā ilāha illallāh, waḥdahu lā sharīka lah.', ''), null);
});

test('an idiom is not a number', () => {
  const { repetitionOf } = load();
  assert.equal(repetitionOf('I thank you for the word of truth in times of contentment and in times of hardship.', ''), null);
});

test('a citation is never read as a count', () => {
  const { repetitionOf } = load();
  /* The reference line is passed separately and must not reach the counter. */
  assert.equal(repetitionOf('All praise is to Allah who gives us life after having taken it from us.', 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور'), null);
});

test('a count of one gets no counter', () => {
  const { repetitionOf } = load();
  assert.equal(repetitionOf('... (Recite once in Arabic.)', ''), null);
});

test('where the two languages disagree, neither is trusted', () => {
  const { repetitionOf } = load();
  const rep = repetitionOf('...(Recite seven times in Arabic.)', 'فقل (ثلاث مرات)');
  assert.equal(rep, null);
});

test('every row the counter appears on states that number in its own text', async () => {
  const { repetitionOf } = load();
  const data = require('../src/data/adhkar.json');
  const plain = (v = '') => String(v).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const stripRef = (b = '') => String(b).replace(/<span class="hisn_english_reference">[\s\S]*?<\/span>/gi, '');
  let counted = 0;
  for (const key of Object.keys(data.byKey)) {
    if (!/^\d+$/.test(key)) continue;
    for (const row of data.byKey[key].duas || []) {
      const ar = plain(row.ar?.text || row.ar?.body || '');
      const en = plain(stripRef(row.en?.body || '')) || plain(row.en?.text || '');
      const rep = repetitionOf(en, ar);
      if (!rep) continue;
      counted += 1;
      /* The number is present in the wording itself - as a word or a digit. */
      const words = { 2: 'two|twice', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 100: 'hundred' };
      const asWord = words[rep.count];
      const pattern = asWord ? new RegExp(`\\b(?:${asWord})\\b|\\b${rep.count}\\b`, 'i') : new RegExp(`\\b${rep.count}\\b`);
      assert.ok(pattern.test(en) || pattern.test(ar), `${key}:${row.number} shows ×${rep.count} but its text does not state it`);
    }
  }
  assert.ok(counted >= 12, `expected the stated counts to be found (got ${counted})`);
  assert.ok(counted <= 40, 'the counter stays the exception, not the rule');
});

test('the card keeps its data when there is no counter', () => {
  const data = require('../src/data/adhkar.json');
  const rows = data.byKey['1'].duas;
  assert.ok(rows.every((r) => (r.ar?.text || r.ar?.body) && r.en?.body), 'every row still carries its Arabic and English');
});
