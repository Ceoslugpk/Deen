const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('./helpers/load-typescript.cjs');

/** Render the real boundary and safe-area library's JS adapter with measured
 * inset fixtures. This checks our composition, not a native Android device. */
function renderBoundary(platform, insets) {
  const flatten = (style) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  const View = ({ children, style }) => React.createElement('div', { style: flatten(style) }, children);
  const mocks = {
    'react-native': { Platform: { OS: platform }, View, StyleSheet: { flatten } },
    './SafeAreaContext': { useSafeAreaInsets: () => insets },
  };
  const load = createLoader(mocks);
  const { SafeAreaView } = load('node_modules/react-native-safe-area-context/src/SafeAreaView.web.tsx');
  mocks['react-native-safe-area-context'] = { SafeAreaView };
  const { SystemNavigationBoundary } = load('src/components/SystemNavigationBoundary.tsx');
  const tree = SystemNavigationBoundary({
    style: { backgroundColor: '#faf5ed' },
    children: React.createElement('span', null, 'Tabs, player and overlays'),
  });
  return { tree, html: renderToStaticMarkup(tree) };
}

for (const [label, bottom] of [['three-button navigation', 48], ['gesture navigation', 24], ['no navigation inset', 0]]) {
  test(`Android ${label}: reserve the measured ${bottom}px inset exactly once`, () => {
    const { tree, html } = renderBoundary('android', { top: 30, bottom, left: 0, right: 0 });
    assert.deepEqual(Array.from(tree.props.edges), ['left', 'right', 'bottom']);
    assert.match(html, new RegExp(`padding-bottom:${bottom === 0 ? '0' : `${bottom}px`}(?:;|\")`));
    assert.equal((html.match(/padding-bottom:/g) || []).length, 1);
    assert.ok(!html.includes('padding-top:30px'), 'Existing status-bar spacing is unchanged');
  });
}

test('Android landscape: side system navigation is protected too', () => {
  const { html } = renderBoundary('android', { top: 0, bottom: 0, left: 0, right: 48 });
  assert.match(html, /padding-right:48px/);
});

test('absolute tabs, mini-player and sheets anchor to a separate unpadded content box', () => {
  const { tree } = renderBoundary('android', { top: 30, bottom: 48, left: 0, right: 0 });
  assert.equal(tree.props.children.props.style.flex, 1);
  assert.equal(tree.props.children.props.style.paddingBottom, undefined);
  assert.equal(tree.props.children.props.children.props.children, 'Tabs, player and overlays');
});

for (const platform of ['ios', 'web']) {
  test(`${platform} keeps the existing shell spacing`, () => {
    const { tree, html } = renderBoundary(platform, { top: 44, bottom: 34, left: 0, right: 0 });
    assert.equal(tree.props.edges.length, 0);
    assert.ok(!html.includes('padding-bottom:34px'));
    assert.ok(!html.includes('padding-top:44px'));
  });
}

test('the app mounts one explicit root provider and the safe shell boundary', () => {
  const source = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
  assert.equal((source.match(/<SafeAreaProvider\b/g) || []).length, 1);
  assert.match(source, /<SafeAreaProvider initialMetrics=\{initialWindowMetrics\}/);
  assert.match(source, /return <SystemNavigationBoundary style=\{/);
  assert.match(source, /<\/SystemNavigationBoundary>/);
});
