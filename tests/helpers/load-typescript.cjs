const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');

/** Execute the actual TS source with explicit native-module test doubles. */
function createLoader(mocks = {}, globals = {}) {
  const cache = new Map();
  const root = path.resolve(__dirname, '../..');
  function load(relative) {
    let filename = path.resolve(root, relative);
    if (!path.extname(filename)) {
      filename = [
        ...['.ts', '.tsx', '.js', '.json'].map((ext) => filename + ext),
        ...['index.ts', 'index.tsx', 'index.js', 'index.json'].map((entry) => path.join(filename, entry)),
      ].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    }
    if (!filename) throw new Error(`Module not found: ${relative}`);
    if (cache.has(filename)) return cache.get(filename).exports;
    const nativeRequire = createRequire(filename);
    if (filename.endsWith('.json')) return nativeRequire(filename);
    const module = { exports: {} };
    cache.set(filename, module);
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const requireMock = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), name));
      return nativeRequire(name);
    };
    vm.runInNewContext(source, {
      module, exports: module.exports, require: requireMock,
      __dirname: path.dirname(filename), __filename: filename,
      console, setTimeout, clearTimeout, setInterval, clearInterval, ...globals,
    }, { filename });
    return module.exports;
  }
  return load;
}

module.exports = { createLoader };
