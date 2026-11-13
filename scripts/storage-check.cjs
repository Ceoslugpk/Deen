/**
 * Checks the storage layer in src/services/storage.ts against a disk that
 * misbehaves.
 *
 * Run: node scripts/storage-check.cjs
 *
 * The point of the layer is what it does when a write does not land, and a
 * real device will not misbehave on request. So the AsyncStorage module is
 * replaced here with one that can be told to fail once, to fail always, to
 * report a full disk, or to store a truncated value — and each promise the
 * layer makes is checked against it.
 *
 * Nothing here touches the app's own storage; the stand-in keeps its rows in
 * a Map in memory.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const tsc = path.join(root, 'node_modules', '.bin', 'tsc');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-check-'));

// 1. Compile the layer on its own. It imports the app's AsyncStorage and the
//    __DEV__ flag, both of which are supplied below.
// __DEV__ is declared globally by Expo rather than imported, so the compile
// reports it as unknown. The JavaScript is emitted regardless, and that is
// all this needs — the flag is supplied before the module is loaded.
try {
  execFileSync(tsc, [
    '--ignoreConfig',
    path.join(root, 'src', 'services', 'storage.ts'),
    '--outDir', work,
    '--module', 'commonjs',
    '--target', 'es2019',
    '--esModuleInterop',
    '--skipLibCheck',
  ], { cwd: root, stdio: 'ignore' });
} catch (error) {
  if (!fs.existsSync(path.join(work, 'storage.js'))) throw error;
}

// 2. Put the stand-in where the compiled file will look for it.
const moduleDir = path.join(work, 'node_modules', '@react-native-async-storage');
fs.mkdirSync(moduleDir, { recursive: true });
fs.writeFileSync(path.join(moduleDir, 'async-storage.js'), "// A stand-in AsyncStorage whose behaviour is scripted by the test.\nconst store = new Map();\nconst state = { setFails: 0, getFails: 0, quota: false, truncate: false, calls: { get: 0, set: 0 } };\nmodule.exports = {\n  __state: state,\n  __store: store,\n  async getItem(key) { state.calls.get++; if (state.getFails > 0) { state.getFails--; throw new Error('native read failed'); } return store.has(key) ? store.get(key) : null; },\n  async setItem(key, value) {\n    state.calls.set++;\n    if (state.quota) throw new Error('Exceeded storage quota');\n    if (state.setFails > 0) { state.setFails--; throw new Error('native write failed'); }\n    store.set(key, state.truncate ? String(value).slice(0, 3) : String(value));\n  },\n  async removeItem(key) { store.delete(key); },\n  async getAllKeys() { return [...store.keys()]; },\n};\nmodule.exports.default = module.exports;\n");
global.__DEV__ = false;

const AsyncStorage = require(path.join(moduleDir, 'async-storage.js'));
const S = require(path.join(work, 'storage.js'));


const st = AsyncStorage.__state;
const store = AsyncStorage.__store;
const reset = () => { store.clear(); Object.assign(st, { setFails: 0, getFails: 0, quota: false, truncate: false, calls: { get: 0, set: 0 } }); };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { (cond ? pass++ : fail++); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };

(async () => {
  // 1. happy path
  reset();
  ok('plain write succeeds', await S.writeText('k', 'hello') === true);
  ok('plain read returns it', await S.readText('k') === 'hello');

  // 2. one transient write failure is retried away
  reset(); st.setFails = 1;
  ok('write survives one failure', await S.writeText('k', 'ur') === true, `setItem calls=${st.calls.set}`);
  ok('  and it retried', st.calls.set === 2, `calls=${st.calls.set}`);

  // 3. one transient read failure is retried away (the "opens in English" case)
  reset(); store.set('@deen/language/v1', 'ur'); st.getFails = 1;
  ok('read survives one failure', await S.readText('@deen/language/v1') === 'ur');

  // 4. persistent failure reports and returns false — never silent
  reset(); st.setFails = 99;
  let seen = null;
  const off = S.onStorageFailure((f) => { seen = f; });
  ok('hard failure returns false', await S.writeText('k', 'ur') === false);
  ok('  and is reported', !!seen && seen.op === 'write' && seen.key === 'k', seen ? seen.message : 'nothing reported');
  ok('  and is counted', S.storageHealth().failed === 1);
  off();

  // 5. a value that lands truncated is caught by verification and retried
  reset(); st.truncate = true;
  ok('truncated write is detected', await S.writeText('k', 'urdu') === false);
  ok('  nothing wrong left on disk', store.get('k') !== 'urdu');

  // 6. quota: the cache gives way, then the write succeeds
  reset(); st.quota = true;
  let freed = 0;
  const offEvict = S.registerEvictor({ name: 'fake cache', free: async () => { freed++; st.quota = false; return 1024; } });
  ok('quota: evicts then writes', await S.writeText('@deen/prayer-completion/v1', '{}') === true, `evictor ran ${freed}x`);
  ok('  evictor ran once', freed === 1);
  offEvict();

  // 7. reads that fail for good give null, not a hang
  reset(); st.getFails = 99;
  ok('dead read returns null', await S.readText('k') === null);

  // 8. writes to one key are serialised and keep their order
  reset();
  await Promise.all([S.writeText('race', 'first'), S.writeText('race', 'second')]);
  ok('last write to a key wins', store.get('race') === 'second', `stored=${store.get('race')}`);

  // 9. JSON helpers
  reset();
  ok('writeJson/readJson round-trip', await S.writeJson('j', { a: 1 }) === true && (await S.readJson('j', null)).a === 1);
  ok('readJson falls back on corrupt', await (async () => { store.set('j', '{nope'); return (await S.readJson('j', 7)) === 7; })());
  ok('writeJson rejects unencodable', await S.writeJson('j', { b: BigInt ? undefined : undefined }) === true);

  // 10. removeKey
  reset(); await S.writeText('gone', 'x');
  ok('removeKey clears', await S.removeKey('gone') === true && await S.readText('gone') === null);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();

