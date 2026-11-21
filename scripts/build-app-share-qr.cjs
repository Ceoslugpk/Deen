/* Fixed Play Store QR, generated offline at development time. `toqr` is
 * already provided by the locked Expo toolchain; no encoder/runtime dependency
 * or QR web service is shipped. Regenerate only when the public link changes.
 * node scripts/build-app-share-qr.cjs */
const fs = require('node:fs');
const path = require('node:path');
const { toQR } = require('toqr');
const url = 'https://play.google.com/store/apps/details?id=com.qashi.islamic';
const matrix = toQR(url, 3); // ISO QR error correction Q; do not decorate finder patterns.
const size = Math.sqrt(matrix.length);
if (!Number.isInteger(size)) throw new Error('Unexpected QR matrix');
const rows = Array.from({ length: size }, (_, y) => Array.from(matrix.slice(y * size, (y + 1) * size)).join(''));
const result = { url, errorCorrection: 'Q', quietZone: 4, size, rows };
fs.writeFileSync(path.join(__dirname, '../src/data/app-share-qr.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`Generated ${size}×${size} QR with four-module quiet zone: ${url}`);
