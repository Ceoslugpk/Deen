const assert = require('node:assert/strict');
const test = require('node:test');
const { expo } = require('../../app.json');
const withOptionalPortrait = require('../withOptionalPortrait');

const PORTRAIT_FEATURE = 'android.hardware.screen.portrait';
const OPTIONAL_PORTRAIT = {
  $: { 'android:name': PORTRAIT_FEATURE, 'android:required': 'false' },
};

async function applyPlugin(manifest) {
  const config = withOptionalPortrait({
    name: 'Manifest test',
    slug: 'manifest-test',
    orientation: 'portrait',
  });
  return config.mods.android.manifest({
    ...config,
    modRequest: {},
    modResults: structuredClone(manifest),
  });
}

test('adds an explicit optional portrait feature at the manifest root', async () => {
  const result = await applyPlugin({ manifest: { application: [{}] } });
  assert.deepEqual(result.modResults.manifest['uses-feature'], [OPTIONAL_PORTRAIT]);
  assert.equal(result.modResults.manifest.application[0]['uses-feature'], undefined);
});

test('overrides an existing required portrait declaration', async () => {
  const result = await applyPlugin({
    manifest: {
      'uses-feature': [
        { $: { 'android:name': PORTRAIT_FEATURE, 'android:required': 'true' } },
      ],
    },
  });
  assert.deepEqual(result.modResults.manifest['uses-feature'], [OPTIONAL_PORTRAIT]);
});

test('overrides the default requirement when required is omitted', async () => {
  const result = await applyPlugin({
    manifest: { 'uses-feature': [{ $: { 'android:name': PORTRAIT_FEATURE } }] },
  });
  assert.deepEqual(result.modResults.manifest['uses-feature'], [OPTIONAL_PORTRAIT]);
});

test('preserves other features, permissions and portrait activity orientation', async () => {
  const input = {
    manifest: {
      $: { 'xmlns:android': 'http://schemas.android.com/apk/res/android' },
      'uses-feature': [
        { $: { 'android:name': 'android.hardware.sensor.compass', 'android:required': 'false' } },
        { $: { 'android:glEsVersion': '0x00020000', 'android:required': 'true' } },
      ],
      'uses-permission': [{ $: { 'android:name': 'android.permission.INTERNET' } }],
      application: [{
        activity: [{ $: { 'android:name': '.MainActivity', 'android:screenOrientation': 'portrait' } }],
      }],
    },
  };
  const expected = structuredClone(input);
  expected.manifest['uses-feature'].push(OPTIONAL_PORTRAIT);

  const result = await applyPlugin(input);
  assert.deepEqual(result.modResults, expected);
  assert.equal(result.orientation, 'portrait');
});

test('is idempotent when the plugin runs again', async () => {
  const first = await applyPlugin({ manifest: {} });
  const second = await applyPlugin(first.modResults);
  assert.deepEqual(second.modResults, first.modResults);
});

test('normalises duplicate portrait declarations to one optional feature', async () => {
  const result = await applyPlugin({
    manifest: {
      'uses-feature': [
        OPTIONAL_PORTRAIT,
        { $: { 'android:name': PORTRAIT_FEATURE, 'android:required': 'true' } },
      ],
    },
  });
  assert.deepEqual(result.modResults.manifest['uses-feature'], [OPTIONAL_PORTRAIT]);
});

test('is registered in the app without changing the portrait preference', () => {
  assert.ok(expo.plugins.includes('./plugins/withOptionalPortrait.js'));
  assert.equal(expo.orientation, 'portrait');
});
