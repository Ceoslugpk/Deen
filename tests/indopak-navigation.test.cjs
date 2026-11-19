const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const load = createLoader();
const nav = load('src/services/indopakNavigation.ts');
const copy = load('src/services/indopakCopy.ts');
const plain = value => JSON.parse(JSON.stringify(value));
const reader = fs.readFileSync(path.join(__dirname, '../src/components/IndopakMushafReader.tsx'), 'utf8');

test('Go to groups exactly Surah, Juz and current-page Verse; Page/Bookmarks and Sources remain separate', () => {
  for (const kind of ['surah', 'juz', 'verse']) assert.deepEqual(plain(nav.indopakPickerTabs(kind)), ['surah', 'juz', 'verse']);
  for (const kind of ['page', 'bookmarks']) assert.deepEqual(plain(nav.indopakPickerTabs(kind)), ['page', 'bookmarks']);
  assert.deepEqual(plain(nav.indopakPickerTabs('sources')), []);
});

test('only the three directory tabs can change the temporary last-used Go to tab', () => {
  for (const kind of ['surah', 'juz', 'verse']) assert.equal(nav.isIndopakDirectory(kind), true);
  for (const kind of ['page', 'bookmarks', 'sources', null]) assert.equal(nav.isIndopakDirectory(kind), false);
  assert.ok(reader.includes("useState<IndopakDirectory>('surah')"));
  assert.ok(reader.includes('if (isIndopakDirectory(kind)) setDirectory(kind)'));
  assert.ok(reader.includes("() => setPicker(directory)"));
});

test('physical arrow keys follow each tab group in LTR/RTL and wrap without crossing into another group', () => {
  for (const group of [['surah', 'juz', 'verse'], ['page', 'bookmarks']]) for (let i = 0; i < group.length; i++) {
    const forward = group[(i + 1) % group.length], back = group[(i - 1 + group.length) % group.length];
    assert.equal(nav.indopakPickerKey(group[i], 'ArrowRight'), forward);
    assert.equal(nav.indopakPickerKey(group[i], 'ArrowLeft'), back);
    assert.equal(nav.indopakPickerKey(group[i], 'ArrowRight', true), back);
    assert.equal(nav.indopakPickerKey(group[i], 'ArrowLeft', true), forward);
  }
});

test('wrapped tabs support Home/End and vertical arrows, ignoring other keys and source-only panels', () => {
  for (const kind of ['surah', 'juz', 'verse']) {
    for (const rtl of [false, true]) {
      assert.equal(nav.indopakPickerKey(kind, 'Home', rtl), 'surah'); assert.equal(nav.indopakPickerKey(kind, 'End', rtl), 'verse');
      assert.equal(nav.indopakPickerKey(kind, 'ArrowDown', rtl), nav.indopakPickerKey(kind, 'ArrowRight'));
      assert.equal(nav.indopakPickerKey(kind, 'ArrowUp', rtl), nav.indopakPickerKey(kind, 'ArrowLeft'));
    }
    for (const key of ['Tab', 'Escape', 'Enter', ' ', 'a']) assert.equal(nav.indopakPickerKey(kind, key), null);
  }
  for (const key of ['Home', 'End', 'ArrowRight', 'ArrowDown']) assert.equal(nav.indopakPickerKey('sources', key), null);
});

test('Go to is feature-localized in all 22 supported languages without changing previous positional copy keys', async () => {
  const shared = load('src/services/arabicCopy.ts');
  for (const language of ['en', 'ar', 'ur', 'fa', 'ps', 'fr', 'tr', 'ru', 'uz', 'kk', 'zh', 'vi', 'az', 'bs', 'bg', 'si', 'bn', 'hi', 'id', 'ms', 'ta', 'ml']) {
    await shared.loadCopy(language);
    const label = copy.indopakText(language, 'goTo'); assert.ok(label.trim());
    if (language !== 'en') assert.notEqual(label, 'Go to', language);
    // These established loanwords are intentionally identical to the English key.
    const loanwords = new Set(['fr/Juz', 'vi/Juz', 'id/Surah', 'id/Juz', 'ms/Surah']);
    for (const key of ['Surah', 'Juz', 'Verse']) {
      assert.ok(shared.tx(language, key).trim());
      if (language !== 'en' && !loanwords.has(`${language}/${key}`)) assert.notEqual(shared.tx(language, key), key, `${language}/${key}`);
    }
    assert.ok(copy.indopakText(language, 'pageError', { total: 548 }).includes('548'));
    assert.ok(!copy.indopakText(language, 'swipeHint').includes('Go to'));
  }
  assert.match(copy.indopakText('uz', 'goTo'), /[А-Яа-яЎў]/); assert.match(copy.indopakText('kk', 'goTo'), /[А-Яа-яӨө]/);
  assert.notEqual(copy.indopakText('ms', 'goTo'), copy.indopakText('id', 'goTo'));
});

test('the toolbar has one labelled Go to entry, natural-height wrapping and no squeezed standalone directory controls', () => {
  const top = reader.slice(reader.indexOf('!focusMode && <View testID="indopak-top-controls"'), reader.indexOf('testID="indopak-page-viewport"'));
  assert.equal((top.match(/testID: 'indopak-go-to'/g) || []).length, 1);
  assert.ok(top.includes("text: copy('goTo')"));
  for (const id of ['indopak-surah', 'indopak-juz', 'indopak-verse-list']) assert.ok(!reader.includes(id));
  assert.ok(reader.includes("tools: { flexDirection: 'row', flexWrap: 'wrap'"));
  assert.ok(reader.includes("minHeight: 44, maxWidth: '100%', flexShrink: 0"));
  assert.ok(!reader.includes('numberOfLines={2}'));
  for (const id of ['indopak-page-select', 'indopak-save-page', 'indopak-focus', 'indopak-sources']) assert.ok(top.includes(id));
});

test('picker tabs are semantic, wrap without a line cap, keep search/list scrollable and retain an independent close action', () => {
  const modal = reader.slice(reader.indexOf('function IndopakNavigator('));
  assert.ok(modal.includes('indopakPickerTabs(kind)')); assert.ok(modal.includes('accessibilityRole="tablist"')); assert.ok(modal.includes('accessibilityRole="tab"'));
  assert.ok(modal.includes('tabIndex: value === kind ? 0 : -1')); assert.ok(modal.includes('activeTab.current?.focus()'));
  assert.ok(modal.includes("indopakPickerKey(kind, event.nativeEvent.key, rtl)"));
  assert.ok(modal.includes('ListHeaderComponent={<View style={styles.modalHeading}>'));
  assert.ok(modal.includes('testID="indopak-directory-search"')); assert.ok(modal.includes('testID="indopak-verse-page"'));
  assert.ok(modal.includes('testID="indopak-navigator-close"')); assert.ok(modal.includes('onAccessibilityEscape={close}'));
  assert.ok(!modal.includes('saveIndopakState(')); assert.ok(!modal.includes('AsyncStorage')); assert.ok(!modal.includes('playFromReader('));
});
