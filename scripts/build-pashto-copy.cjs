/**
 * Assembles src/services/pashtoCopy.ts from the translated batches.
 *
 * The batches live in scripts/pashto-batches/ as flat { english: pashto } maps.
 * Running this writes the table keyed by every English string the interface
 * can show, so a string nobody has translated yet is simply absent — and
 * `tx` falls back to the English source for it. That fallback is the whole
 * reason a partial batch is safe to ship.
 *
 *   node scripts/build-pashto-copy.cjs          # write the table
 *   node scripts/build-pashto-copy.cjs --report # coverage only
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'pashto-batches');
const KEYS = JSON.parse(fs.readFileSync(path.join(DIR, 'ps_keys.json'), 'utf8'));
const batchFiles = fs.readdirSync(DIR)
  .filter((f) => /^ps_batch_.*\.json$/.test(f))
  .sort((a, b) => {
    const na = Number((a.match(/_(\d+)\.json$/) || [])[1] || 0);
    const nb = Number((b.match(/_(\d+)\.json$/) || [])[1] || 0);
    return na - nb;
  });

const merged = {};
for (const f of batchFiles) {
  const part = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  for (const [k, v] of Object.entries(part)) merged[k] = v;
}

const translated = KEYS.filter((k) => merged[k]);
const pct = ((translated.length / KEYS.length) * 100).toFixed(1);

if (process.argv.includes('--report')) {
  console.log(`batches: ${batchFiles.length}`);
  console.log(`translated: ${translated.length} / ${KEYS.length}  (${pct}%)`);
  const unknown = Object.keys(merged).filter((k) => !KEYS.includes(k));
  if (unknown.length) console.log(`not a real key (${unknown.length}):`, unknown.slice(0, 10));
  process.exit(0);
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');

const lines = KEYS.filter((k) => merged[k]).map((k) => `  '${esc(k)}': '${esc(merged[k])}',`);

const out = `/**
 * Pashto interface copy.
 *
 * Keyed by the English source string rather than by an identifier, so a
 * string that has not been translated yet is simply missing and \`tx\` hands
 * back the English — a screen can be partly Pashto and partly English while
 * the work is in progress, which is why the language can ship before every
 * line is done. ${translated.length} of ${KEYS.length} strings are here.
 *
 * The Quran, hadith, adhkar and names content is not in this file. That is
 * content rather than interface, it is served in the language its source
 * published it in, and translating it is not ours to do.
 */
export const PS: Record<string, string> = {
${lines.join('\n')}
};
`;

fs.writeFileSync('src/services/pashtoCopy.ts', out);
console.log(`wrote ${lines.length} entries (${pct}% of ${KEYS.length})`);
