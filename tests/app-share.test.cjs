const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const target = 'https://play.google.com/store/apps/details?id=com.qashi.islamic';
const root = path.resolve(__dirname, '..');
const qr = require('../src/data/app-share-qr.json');
const plain = value => JSON.parse(JSON.stringify(value));
function harness(os = 'android', { webShare, result = { action: 'sharedAction' }, error, clipboard = true, clipboardError, noNavigator = false } = {}) {
  const calls = { share: [], clipboard: [] };
  const load = createLoader({
    'react-native': { Platform: { OS: os }, Share: { dismissedAction: 'dismissedAction', share: async content => {
      calls.share.push(plain(content)); if (error) throw error; return result;
    } } },
  }, noNavigator ? {} : { navigator: { ...(webShare ? { share() {} } : {}), ...(clipboard ? { clipboard: { writeText: async text => {
    calls.clipboard.push(text); if (clipboardError) throw clipboardError;
  } } } : {}) } });
  return { api: load('src/services/appShare.ts'), calls };
}

test('one immutable Play Store destination drives the static QR, visible link and share message', () => {
  const h = harness();
  assert.equal(qr.url, target); assert.equal(h.api.APP_PLAY_STORE_URL, target);
  assert.equal(h.api.APP_SHARE_MESSAGE, `Islamic Companion\n${target}`);
  assert.equal(qr.errorCorrection, 'Q'); assert.equal(qr.quietZone, 4);
});

test('the checked-in offline QR is reproducible with the locked development encoder', () => {
  const { toQR } = require('toqr'); const matrix = toQR(target, 3);
  assert.equal(qr.size, 41); assert.equal(qr.rows.length, qr.size);
  assert.ok(qr.rows.every(row => row.length === qr.size && /^[01]+$/.test(row)));
  assert.equal(qr.rows.join(''), Array.from(matrix).join(''));
  for (const [x, y] of [[0, 0], [qr.size - 7, 0], [0, qr.size - 7]]) {
    assert.equal(qr.rows[y].slice(x, x + 7), '1111111');
    assert.equal(qr.rows[y + 3].slice(x, x + 7), '1011101');
  }
});

test('Android sharing passes the exact Play Store link once, with no clipboard side effects', async () => {
  const { api, calls } = harness(); assert.equal(await api.shareAppLink('en'), 'shared');
  assert.deepEqual(calls.share, [{ title: 'Share app', message: `Islamic Companion\n${target}` }]);
  assert.deepEqual(calls.clipboard, []);
});

test('iOS dismissal is not reported as sharing and never silently copies', async () => {
  const { api, calls } = harness('ios', { result: { action: 'dismissedAction' } });
  assert.equal(await api.shareAppLink('ur'), 'dismissed'); assert.equal(calls.share.length, 1); assert.deepEqual(calls.clipboard, []);
  assert.notEqual(calls.share[0].title, 'Share app'); assert.equal(calls.share[0].message.split(target).length, 2);
});

test('Web Share may resolve with no React Native action object', async () => {
  const { api, calls } = harness('web', { webShare: true, result: null });
  assert.equal(await api.shareAppLink('ar'), 'shared'); assert.equal(calls.share.length, 1); assert.deepEqual(calls.clipboard, []);
});

test('a cancelled browser sheet is silent and must not copy without consent', async () => {
  const error = Object.assign(new Error('Cancelled'), { name: 'AbortError' });
  const { api, calls } = harness('web', { webShare: true, error });
  assert.equal(await api.shareAppLink('en'), 'dismissed'); assert.deepEqual(calls.clipboard, []);
});

test('native sharing errors propagate for the page to show an honest error', async () => {
  const error = new Error('No sharing target'); const { api, calls } = harness('android', { error });
  await assert.rejects(api.shareAppLink('en'), e => e === error); assert.deepEqual(calls.clipboard, []);
});

test('a Web Share failure is not disguised as successful sharing or a clipboard fallback', async () => {
  const error = Object.assign(new Error('Denied'), { name: 'NotAllowedError' });
  const { api, calls } = harness('web', { webShare: true, error });
  await assert.rejects(api.shareAppLink('en'), e => e === error); assert.deepEqual(calls.clipboard, []);
});

test('unsupported desktop sharing copies the app name and link, and reports copied instead of shared', async () => {
  const { api, calls } = harness('web'); assert.equal(await api.shareAppLink('en'), 'copied');
  assert.deepEqual(calls.share, []); assert.deepEqual(calls.clipboard, [`Islamic Companion\n${target}`]);
});

test('unavailable navigator fails safely instead of claiming the link was copied', async () => {
  const { api, calls } = harness('web', { noNavigator: true }); await assert.rejects(api.shareAppLink('en'), /Clipboard unavailable/);
  assert.equal(calls.clipboard.length, 0); assert.deepEqual(calls.share, []);
});

test('an unavailable modern clipboard cannot produce a false copied confirmation via a broken legacy fallback', async () => {
  const { api } = harness('web', { clipboard: false }); await assert.rejects(api.shareAppLink('en'), /Clipboard unavailable/);
});

test('clipboard rejection propagates instead of claiming success', async () => {
  const error = new Error('Clipboard denied'); const { api } = harness('web', { clipboardError: error });
  await assert.rejects(api.shareAppLink('en'), e => e === error);
});

test('all newly introduced page labels are localized in all 22 UI languages, including Cyrillic Uzbek and Kazakh', () => {
  const { appShareText: copy } = createLoader()('src/services/appShareCopy.ts');
  for (const language of ['en','ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml']) {
    for (const key of ['title', 'scan', 'button', 'open', 'copied', 'error']) {
      const value = copy(language, key); assert.ok(value?.trim(), `${language}/${key}`);
      if (language !== 'en') assert.notEqual(value, copy('en', key), `${language}/${key}`);
      if (['uz', 'kk'].includes(language)) assert.match(value, /[А-Яа-яҚқЎўҒғҲҳӘәІіҢңҮүҰұӨө]/);
    }
  }
  assert.equal(copy('en', 'button'), 'Share app with your friends and family');
  assert.equal(copy('unknown', 'title'), 'Share app');
});

test('Share app is placed below privacy/legal pages and its independent route has Back, real sharing and an accessible selectable fallback', () => {
  const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
  const settings = app.slice(app.indexOf('function SettingsScreen('), app.indexOf('const navigationRef'));
  assert.ok(settings.indexOf('settings-share-app') > settings.indexOf("['datasafety', T('Data Safety')]"));
  assert.ok(settings.indexOf('settings-share-app') < settings.indexOf('style={s.madeWith}'));
  assert.ok(app.includes('<Stack.Screen name="Share App" component={ShareAppScreen}/>'));
  const page = app.slice(app.indexOf('function ShareAppScreen('), app.indexOf('function SettingsScreen('));
  assert.ok(page.includes('<ToolBar title={copy(\'title\')} navigation={navigation}'));
  assert.ok(page.includes('await shareAppLink(language)')); assert.ok(page.includes('if (sharing.current) return'));
  assert.ok(page.includes('result === \'copied\'')); assert.ok(page.includes("catch { setNote('error'); }"));
  assert.ok(page.includes('Linking.openURL(APP_PLAY_STORE_URL).catch'));
  assert.ok(page.includes('testID="app-share-url" selectable'));
  assert.ok(page.includes('accessibilityLiveRegion="polite"')); assert.ok(page.includes('minHeight: 48'));
});

test('QR is bundled, undecorated and black-on-white in both themes, with a four-module quiet zone and no runtime encoder/service', () => {
  const component = fs.readFileSync(path.join(root, 'src/components/AppShareQr.tsx'), 'utf8');
  assert.ok(component.includes('qr.quietZone * 2')); assert.ok(component.includes('fill="#fff"')); assert.ok(component.includes('fill="#000"'));
  assert.ok(component.includes('Math.floor(Math.min(294, availableWidth) / extent) * extent'));
  for (const forbidden of ['https://', 'fetch(', "from 'toqr'", '<Image', 'dark ?']) assert.ok(!component.includes(forbidden), forbidden);
});
