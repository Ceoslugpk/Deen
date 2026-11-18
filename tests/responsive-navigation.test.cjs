const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { createLoader } = require('./helpers/load-typescript.cjs');
const { systemContentFrame, floatingTabBarWidth, FLOAT_BAR_PADDING } = createLoader()('src/services/systemLayout.ts');

const app = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const boundary = fs.readFileSync(path.join(__dirname, '../src/components/SystemNavigationBoundary.tsx'), 'utf8');
const size = (value) => ({ width: value.width, height: value.height });

for (const [name, insets, expected] of [
  ['full-screen gestures', { top: 30, bottom: 24, left: 0, right: 0 }, { width: 390, height: 790 }],
  ['classic three-section buttons', { top: 30, bottom: 48, left: 0, right: 0 }, { width: 390, height: 766 }],
  ['larger navigation keys', { top: 30, bottom: 64, left: 0, right: 0 }, { width: 390, height: 750 }],
  ['hidden system bars', { top: 0, bottom: 0, left: 0, right: 0 }, { width: 390, height: 844 }],
  ['left side navigation', { top: 0, bottom: 0, left: 48, right: 0 }, { width: 342, height: 844 }],
  ['right side navigation and a cutout', { top: 24, bottom: 0, left: 32, right: 48 }, { width: 310, height: 820 }],
]) {
  test(`content frame follows Android ${name} without a guessed navigation height`, () => {
    assert.deepEqual(size(systemContentFrame({ width: 390, height: 844 }, insets, 'android')), expected);
  });
}

for (const platform of ['ios', 'web']) {
  test(`${platform} content frame preserves the existing per-screen layout`, () => {
    assert.deepEqual(size(systemContentFrame({ width: 390, height: 844 }, { top: 44, bottom: 34, left: 0, right: 0 }, platform)), { width: 390, height: 844 });
  });
}

test('live changes between gestures, buttons, side keys and split-screen use the current geometry', () => {
  const fixtures = [
    [{ width: 390, height: 844 }, { top: 24, bottom: 24, left: 0, right: 0 }],
    [{ width: 390, height: 844 }, { top: 24, bottom: 48, left: 0, right: 0 }],
    [{ width: 844, height: 390 }, { top: 24, bottom: 0, left: 0, right: 48 }],
    [{ width: 280, height: 720 }, { top: 24, bottom: 48, left: 0, right: 0 }],
  ];
  for (const [frame, insets] of fixtures) {
    const safe = systemContentFrame(frame, insets, 'android');
    const bar = floatingTabBarWidth(safe.width);
    assert.ok(bar <= safe.width);
    assert.ok(safe.height + insets.top + insets.bottom <= frame.height);
  }
});

for (const width of [0, 180, 220, 240, 256, 272, 280, 300, 320, 360, 390, 600, 800, 1200, 1840]) {
  test(`footer fits an actual ${width}px safe content box`, () => {
    const bar = floatingTabBarWidth(width);
    assert.ok(bar >= 0 && bar <= width);
    assert.ok(bar <= 460);
    if (width >= 238) assert.ok((bar - 2 * FLOAT_BAR_PADDING - 2) / 5 >= 44);
  });
}

test('the normal phone and tablet capsule sizes are unchanged', () => {
  assert.equal(floatingTabBarWidth(390), 358);
  assert.equal(floatingTabBarWidth(360), 328);
  assert.equal(floatingTabBarWidth(900), 460);
});

test('invalid or transient zero geometry cannot produce a negative-size capsule', () => {
  for (const width of [-1, NaN, Infinity]) assert.equal(floatingTabBarWidth(width), 0);
  assert.deepEqual(size(systemContentFrame({ width: 10, height: 10 }, { top: 20, bottom: 20, left: 20, right: 20 }, 'android')), { width: 0, height: 0 });
});

test('the Android shell owns top, side and bottom system insets', () => {
  assert.match(boundary, /\['top', 'left', 'right', 'bottom'\]/);
  assert.ok(!app.includes("paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0"), 'A startup-only status-bar height must not be added again on every page');
});

test('the capsule measures its own safe parent, not only the device window', () => {
  const start = app.indexOf('function FloatingTabBar(');
  const code = app.slice(start, app.indexOf('\nfunction Tabs()', start));
  assert.match(code, /onLayout=/);
  assert.match(code, /floatingTabBarWidth\(/);
  assert.ok(code.includes('width: Math.max(0, slot - 6)'), 'A transient zero-size window must not create a negative indicator');
  assert.ok(!code.includes('Math.max(width - 32, 300)'), 'A minimum width must not overflow a side-inset or narrow window');
});

test('sheet height caps use the same safe content frame as the header/footer', () => {
  for (const name of ['DayToolSheet', 'CorrectionSheet', 'VerseActionsSheet']) {
    const start = app.indexOf(`function ${name}(`);
    const next = app.indexOf('\nfunction ', start + 1);
    assert.match(app.slice(start, next < 0 ? undefined : next), /useSafeContentFrame\(/, name);
  }
});

test('native modal sheets use their own window-safe wrapper', () => {
  assert.ok(app.includes("import { SystemModal as Modal } from './src/components/SystemModal'"), 'Native modals must use the window-safe wrapper');
  const file = path.join(__dirname, '../src/components/SystemModal.tsx');
  assert.ok(fs.existsSync(file));
  const modal = fs.readFileSync(file, 'utf8');
  assert.match(modal, /<SafeAreaProvider>/);
  assert.match(modal, /<SystemNavigationBoundary>/);
  assert.ok(!modal.includes('initialWindowMetrics'), 'Root-window initial metrics are not valid for a new modal window');
});


test('sheet entrance springs cannot overshoot into the status/header area', () => {
  const entrances = [...app.matchAll(/rise\.interpolate\(\{[^}]+\}\)/g)];
  assert.equal(entrances.length, 9);
  for (const [entrance] of entrances) assert.match(entrance, /extrapolate:\s*['"]clamp['"]/);
  const springs = [...app.matchAll(/Animated\.spring\(rise,\s*\{[^}]+\}/g)];
  assert.equal(springs.length, 9);
  for (const [spring] of springs) assert.match(spring, /overshootClamping:\s*true/);
});
