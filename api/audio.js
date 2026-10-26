/**
 * Quran audio relay for the web app.
 *
 * The public audio CDNs stream perfectly to an <audio> element, but a browser
 * cannot read the bytes of a cross-origin file unless the host sends CORS
 * headers. `cdn.islamic.network` — the source of the full-Surah files for the
 * verse-by-verse reciters — does not, so the web build fetches its downloads
 * through this function instead. Nothing is stored here: every request is a
 * validated, range-forwarded pass-through to the same public file.
 *
 * Reachable hosts are fixed, and every value is checked, so this cannot be used
 * to proxy arbitrary traffic.
 */

const ALLOWED_HOSTS = new Set(['cdn.islamic.network', 'cdn.mp3quran.net']);
const PASS_THROUGH = [
  'content-type',
  'content-length',
  'content-range',
  'accept-ranges',
  'etag',
  'last-modified',
];

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
    try {
      parsed = new URL(server);
    } catch {
      return '';
    }
    if (!ALLOWED_HOSTS.has(parsed.hostname) || !parsed.pathname.startsWith('/audio/')) return '';
    const base = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${base}/${String(chapter).padStart(3, '0')}.mp3`;
  }
  return '';
}

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  response.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.status(405).json({ error: 'Only audio downloads are supported.' });
    return;
  }

  const url = new URL(request.url, 'https://deen.local');
  const target = upstreamFor(url.searchParams);
  if (!target) {
    response.status(400).json({ error: 'That is not a recognised Quran audio file.' });
    return;
  }

  const headers = { Accept: 'audio/mpeg,*/*', 'User-Agent': 'Deen Companion/1.0' };
  const range = request.headers.range;
  if (range) headers.Range = range;

  try {
    const upstream = await fetch(target, { headers, redirect: 'follow' });
    response.status(upstream.status);
    PASS_THROUGH.forEach((name) => {
      const value = upstream.headers.get(name);
      if (value) response.setHeader(name, value);
    });
    response.setHeader('Cache-Control', 'public, max-age=604800, immutable');

    if (request.method === 'HEAD' || !upstream.body) {
      response.end();
      return;
    }
    const { Readable } = await import('node:stream');
    Readable.fromWeb(upstream.body).pipe(response);
  } catch {
    response.status(502).json({ error: 'The audio source could not be reached.' });
  }
}

export const config = { maxDuration: 60 };
