/**
 * Local preview host for the exported web build.
 *
 * It serves `web-preview/` exactly as Vercel serves `web-build/`, and adds the
 * same `/api/audio` relay the production deployment runs (`api/audio.js`), so the
 * offline-download flow can be exercised in the sandbox preview before shipping.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const ROOT = path.join(__dirname, 'web-preview');
const PORT = Number(process.env.PORT || 4175);
const ALLOWED_HOSTS = new Set(['cdn.islamic.network', 'cdn.mp3quran.net']);
const PASS_THROUGH = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified'];
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
};

function upstreamFor(params) {
  const chapter = Number(params.get('chapter'));
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 114) return '';
  const edition = params.get('edition');
  if (edition) {
    if (!/^[a-z]{2,3}(?:\.[a-z0-9_-]+)?$/i.test(edition)) return '';
    return `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${chapter}.mp3`;
  }
  const server = params.get('server');
  if (server) {
    let parsed;
    try { parsed = new URL(server); } catch { return ''; }
    if (!ALLOWED_HOSTS.has(parsed.hostname) || !parsed.pathname.startsWith('/audio/')) return '';
    const base = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${base}/${String(chapter).padStart(3, '0')}.mp3`;
  }
  return '';
}

async function relay(req, res, target) {
  const headers = { Accept: 'audio/mpeg,*/*', 'User-Agent': 'Deen Companion/1.0' };
  if (req.headers.range) headers.Range = req.headers.range;
  try {
    const upstream = await fetch(target, { headers, redirect: 'follow' });
    res.writeHead(upstream.status, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Cache-Control': 'public, max-age=604800, immutable',
      ...Object.fromEntries(PASS_THROUGH.map((name) => [name, upstream.headers.get(name)]).filter(([, v]) => v)),
    });
    if (req.method === 'HEAD' || !upstream.body) { res.end(); return; }
    Readable.fromWeb(upstream.body).pipe(res);
  } catch {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'The audio source could not be reached.' }));
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/api/audio') {
    const target = upstreamFor(url.searchParams);
    if (!target) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'bad request' })); return; }
    relay(req, res, target);
    return;
  }
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, stat) => {
    if (err || stat.isDirectory()) file = path.join(ROOT, 'index.html');
    fs.readFile(file, (readErr, body) => {
      if (readErr) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(body);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`preview on http://0.0.0.0:${PORT}`));
