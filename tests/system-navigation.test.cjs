const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('./helpers/load-typescript.cjs');

/** Render our real boundary and the safe-area library's JS adapter with
 * measured inset fixtures. This is composition coverage, not a native device. */
function renderBoundary(platform, insets) {
  const flatten = (style) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  const View = ({ children, style }) => React.createElement('div', { style: flatten(style) }, children);
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const mocks = {
    'react-native': { Platform: { OS: platform }, View, StyleSheet: { flatten } },
    './SafeAreaContext': { useSafeAreaInsets: () => insets },
  };
  const load = createLoader(mocks);
  const { SafeAreaView } = load('node_modules/react-native-safe-area-context/src/SafeAreaView.web.tsx');
  let boundaryProps;
  let contentFrame;
  mocks['react-native-safe-area-context'] = {
    SafeAreaView: (props) => {
      boundaryProps = props;
      return React.createElement(SafeAreaView, props);
    },
    useSafeAreaInsets: () => insets, useSafeAreaFrame: () => frame,
  };
  const { SystemNavigationBoundary, useSafeContentFrame } = load('src/components/SystemNavigationBoundary.tsx');
  function Probe() {
    contentFrame = useSafeContentFrame();
    return React.createElement('span', null, 'Tabs, player and overlays');
  }
  const html = renderToStaticMarkup(React.createElement(SystemNavigationBoundary, {
    style: { backgroundColor: '#faf5ed' }, children: React.createElement(Probe),
  }));
  return { tree: { props: boundaryProps }, html, frame: contentFrame };
}

for (const [label, bottom] of [['three-button navigation', 48], ['gesture navigation', 24], ['larger OEM keys', 64], ['no navigation inset', 0]]) {
  test(`Android ${label}: reserve the measured ${bottom}px inset exactly once`, () => {
    const { tree, html, frame } = renderBoundary('android', { top: 30, bottom, left: 0, right: 0 });
    assert.deepEqual(Array.from(tree.props.edges), ['top', 'left', 'right', 'bottom']);
    assert.match(html, new RegExp(`padding-bottom:${bottom === 0 ? '0' : `${bottom}px`}(?:;|\")`));
    assert.equal((html.match(/padding-bottom:/g) || []).length, 1);
    assert.match(html, /padding-top:30px/);
    assert.equal(frame.height, 844 - 30 - bottom);
  });
}

for (const edge of ['left', 'right']) {
  test(`Android landscape: ${edge}-hand system navigation is protected too`, () => {
    const { html, frame } = renderBoundary('android', { top: 0, bottom: 0, left: 0, right: 0, [edge]: 48 });
    assert.match(html, new RegExp(`padding-${edge}:48px`));
    assert.equal(frame.width, 342);
  });
}

test('absolute tabs, mini-player and sheets anchor to a separate unpadded content box', () => {
  const { tree } = renderBoundary('android', { top: 30, bottom: 48, left: 0, right: 0 });
  assert.equal(tree.props.children.props.style.flex, 1);
  assert.equal(tree.props.children.props.style.minWidth, 0);
  assert.equal(tree.props.children.props.style.overflow, 'hidden', 'Entering overlays stay inside the system-safe box');
  assert.equal(tree.props.children.props.style.paddingBottom, undefined);
  assert.equal(typeof tree.props.children.props.onLayout, 'function');
  assert.ok(tree.props.children.props.children.props.value, 'The safe content frame is shared with bars and sheets');
});

test('a window already fitted inside Android system bars does not get a second gap', () => {
  const { html, frame } = renderBoundary('android', { top: 0, bottom: 0, left: 0, right: 0 });
  assert.ok(!html.includes('padding-bottom:48px'));
  assert.equal(frame.height, 844);
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

for (const platform of ['android', 'ios', 'web']) {
  test(`${platform} native modal keeps its props and uses the appropriate window boundary`, () => {
    const NativeModal = () => null;
    const SafeAreaProvider = () => null;
    const SystemNavigationBoundary = () => null;
    const { SystemModal } = createLoader({
      'react-native': { Platform: { OS: platform }, Modal: NativeModal },
      'react-native-safe-area-context': { SafeAreaProvider },
      './SystemNavigationBoundary': { SystemNavigationBoundary },
    })('src/components/SystemModal.tsx');
    const onRequestClose = () => {};
    const child = React.createElement('span', null, 'Sheet controls');
    const tree = SystemModal({ children: child, visible: true, transparent: true, animationType: 'slide', onRequestClose });
    assert.equal(tree.type, NativeModal);
    assert.equal(tree.props.onRequestClose, onRequestClose);
    assert.equal(tree.props.transparent, true);
    if (platform === 'android') {
      assert.equal(tree.props.statusBarTranslucent, true);
      assert.equal(tree.props.navigationBarTranslucent, true);
      assert.equal(tree.props.children.type, SafeAreaProvider);
      assert.equal(tree.props.children.props.initialMetrics, undefined);
      assert.equal(tree.props.children.props.children.type, SystemNavigationBoundary);
      assert.equal(tree.props.children.props.children.props.children, child);
    } else {
      assert.equal(tree.props.children, child);
      assert.equal(tree.props.statusBarTranslucent, undefined);
    }
  });
}
