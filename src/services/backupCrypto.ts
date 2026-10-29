/**
 * The cryptography behind an encrypted backup.
 *
 * Nothing here is invented. Every primitive is a published standard, and the
 * parameters are the ones currently recommended for them:
 *
 *  - **PBKDF2-HMAC-SHA256**, 210,000 iterations, 16-byte random salt, to turn
 *    a password into a key. The iteration count is the whole defence against
 *    somebody who steals the file and guesses passwords for a living, so it is
 *    stored *in* the file rather than baked into the app — a future version can
 *    raise it without making old backups unreadable.
 *  - **AES-256-GCM** for the data itself, with the file header bound in as
 *    additional authenticated data, so the parameters cannot be swapped for
 *    weaker ones without the decryption failing.
 *
 * The one thing here that is not a call into the platform is SHA-256. The
 * platform's own PBKDF2 is used whenever it exists, because it is fast and
 * audited; but Hermes does not guarantee it, and a backup that only works on
 * some devices is worse than no backup. So SHA-256 is implemented here as a
 * fallback, verified against the FIPS 180-4 vectors in the tests.
 */

/* ------------------------------------------------------------------ base64 */

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const B64_LOOKUP = (() => {
  const table = new Int16Array(256).fill(-1);
  for (let i = 0; i < B64_CHARS.length; i += 1) table[B64_CHARS.charCodeAt(i)] = i;
  return table;
})();

/**
 * Base64 in our own hands rather than `btoa`.
 *
 * `btoa` throws on any character outside Latin-1, and these values are
 * arbitrary bytes. It is also absent on some Hermes builds.
 */
export function toBase64(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += B64_CHARS[(n >> 18) & 63] + B64_CHARS[(n >> 12) & 63] + B64_CHARS[(n >> 6) & 63] + B64_CHARS[n & 63];
  }
  const left = bytes.length - i;
  if (left === 1) {
    const n = bytes[i] << 16;
    out += B64_CHARS[(n >> 18) & 63] + B64_CHARS[(n >> 12) & 63] + '==';
  } else if (left === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out += B64_CHARS[(n >> 18) & 63] + B64_CHARS[(n >> 12) & 63] + B64_CHARS[(n >> 6) & 63] + '=';
  }
  return out;
}

export function fromBase64(text: string): Uint8Array {
  const clean = text.replace(/[^A-Za-z0-9+/]/g, '');
  /* Whole groups of four decode cleanly; a trailing pair or trio carries the
     last one or two bytes, and a lone trailing character is not valid. */
  const remainder = clean.length % 4;
  const groups = (clean.length - remainder) / 4;
  const out = new Uint8Array(groups * 3 + (remainder === 2 ? 1 : remainder === 3 ? 2 : 0));

  let at = 0;
  let pos = 0;
  for (let group = 0; group < groups; group += 1) {
    const a = B64_LOOKUP[clean.charCodeAt(at++)];
    const b = B64_LOOKUP[clean.charCodeAt(at++)];
    const c = B64_LOOKUP[clean.charCodeAt(at++)];
    const d = B64_LOOKUP[clean.charCodeAt(at++)];
    out[pos++] = (a << 2) | (b >> 4);
    out[pos++] = ((b & 15) << 4) | (c >> 2);
    out[pos++] = ((c & 3) << 6) | d;
  }
  if (remainder === 2) {
    const a = B64_LOOKUP[clean.charCodeAt(at++)];
    const b = B64_LOOKUP[clean.charCodeAt(at++)];
    out[pos++] = (a << 2) | (b >> 4);
  } else if (remainder === 3) {
    const a = B64_LOOKUP[clean.charCodeAt(at++)];
    const b = B64_LOOKUP[clean.charCodeAt(at++)];
    const c = B64_LOOKUP[clean.charCodeAt(at++)];
    out[pos++] = (a << 2) | (b >> 4);
    out[pos++] = ((b & 15) << 4) | (c >> 2);
  }
  return out;
}

/* ------------------------------------------------------------------- utf-8 */

const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;
const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined;

export function utf8(text: string): Uint8Array {
  if (encoder) return encoder.encode(text);
  /* Manual encoding, for a runtime without TextEncoder. Surrogate pairs are
     written out as their code points, which is what UTF-8 actually wants. */
  const out: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
        i += 1;
      }
    }
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >> 6), 0x80 | (code & 63));
    else if (code < 0x10000) out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
    else out.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 63), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
  }
  return new Uint8Array(out);
}

export function fromUtf8(bytes: Uint8Array): string {
  if (decoder) return decoder.decode(bytes);
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    let code: number;
    let extra: number;
    if (b < 0x80) { code = b; extra = 0; }
    else if (b < 0xe0) { code = b & 31; extra = 1; }
    else if (b < 0xf0) { code = b & 15; extra = 2; }
    else { code = b & 7; extra = 3; }
    for (let j = 1; j <= extra; j += 1) code = (code << 6) | (bytes[i + j] & 63);
    i += extra + 1;
    if (code > 0xffff) {
      code -= 0x10000;
      out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 1023));
    } else {
      out += String.fromCharCode(code);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ sha-256 */

/** FIPS 180-4, section 4.2.2 — the sixty-four constants of SHA-256. */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

/* Reused across calls. A hash per PBKDF2 round means hundreds of thousands of
   calls, and allocating the working set each time is what makes a hand-written
   version feel slow. */
let schedule = new Uint32Array(64);
let chain = new Uint32Array(8);
let padBuffer = new Uint8Array(128);

/**
 * SHA-256, verified against the FIPS 180-4 examples.
 *
 * Written out rather than pulled from a dependency so that key derivation
 * works on every runtime this app can be launched on, including ones with no
 * Web Crypto and no native crypto module.
 */
export function sha256(input: Uint8Array): Uint8Array {
  const out = new Uint8Array(32);
  sha256Into(input, out);
  return out;
}

function sha256Into(input: Uint8Array, out: Uint8Array): void {
  const length = input.length;
  const padded = ((length + 8) >> 6) + 1 << 6;
  if (padBuffer.length < padded) padBuffer = new Uint8Array(padded);
  const buffer = padBuffer;
  buffer.fill(0, 0, padded);
  buffer.set(input.subarray(0, length), 0);
  buffer[length] = 0x80;
  /* Length in bits, big-endian. Written byte by byte so that a message longer
     than 2^32 bits does not need a 64-bit integer this runtime may not have. */
  const bits = length * 8;
  buffer[padded - 1] = bits & 255;
  buffer[padded - 2] = (bits / 256) & 255;
  buffer[padded - 3] = (bits / 65536) & 255;
  buffer[padded - 4] = (bits / 16777216) & 255;

  chain[0] = 0x6a09e667; chain[1] = 0xbb67ae85; chain[2] = 0x3c6ef372; chain[3] = 0xa54ff53a;
  chain[4] = 0x510e527f; chain[5] = 0x9b05688c; chain[6] = 0x1f83d9ab; chain[7] = 0x5be0cd19;

  for (let offset = 0; offset < padded; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      const at = offset + i * 4;
      schedule[i] = (buffer[at] << 24) | (buffer[at + 1] << 16) | (buffer[at + 2] << 8) | buffer[at + 3];
    }
    for (let i = 16; i < 64; i += 1) {
      const w15 = schedule[i - 15];
      const w2 = schedule[i - 2];
      const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
      const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
      schedule[i] = (schedule[i - 16] + s0 + schedule[i - 7] + s1) >>> 0;
    }

    let a = chain[0]; let b = chain[1]; let c = chain[2]; let d = chain[3];
    let e = chain[4]; let f = chain[5]; let g = chain[6]; let h = chain[7];

    for (let i = 0; i < 64; i += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + schedule[i]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }

    chain[0] = (chain[0] + a) >>> 0; chain[1] = (chain[1] + b) >>> 0;
    chain[2] = (chain[2] + c) >>> 0; chain[3] = (chain[3] + d) >>> 0;
    chain[4] = (chain[4] + e) >>> 0; chain[5] = (chain[5] + f) >>> 0;
    chain[6] = (chain[6] + g) >>> 0; chain[7] = (chain[7] + h) >>> 0;
  }

  for (let i = 0; i < 8; i += 1) {
    const word = chain[i];
    out[i * 4] = (word >>> 24) & 255;
    out[i * 4 + 1] = (word >>> 16) & 255;
    out[i * 4 + 2] = (word >>> 8) & 255;
    out[i * 4 + 3] = word & 255;
  }
}

/* --------------------------------------------------------------------- hmac */

/** HMAC-SHA256 (RFC 2104). Exported for the tests. */
export function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const seed = key.length > 64 ? sha256(key) : key;
  const innerPad = new Uint8Array(64).fill(0x36);
  const outerPad = new Uint8Array(64).fill(0x5c);
  for (let i = 0; i < 64; i += 1) {
    const byte = seed[i] || 0;
    innerPad[i] ^= byte;
    outerPad[i] ^= byte;
  }
  return hmacWithPads(innerPad, outerPad, message);
}

function hmacWithPads(innerPad: Uint8Array, outerPad: Uint8Array, message: Uint8Array): Uint8Array {
  const inner = new Uint8Array(64 + message.length);
  inner.set(innerPad, 0);
  inner.set(message, 64);
  const innerHash = sha256(inner);

  const outer = new Uint8Array(64 + 32);
  outer.set(outerPad, 0);
  outer.set(innerHash, 64);
  return sha256(outer);
}

/* ------------------------------------------------------------------- pbkdf2 */

/** PBKDF2-HMAC-SHA256, computed here rather than by the platform. */
export function pbkdf2Sha256Local(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  dkLength = 32,
): Uint8Array {
  const hLength = 32;
  const blocks = Math.ceil(dkLength / hLength);
  const out = new Uint8Array(blocks * hLength);

  const seed = password.length > 64 ? sha256(password) : password;
  const innerPad = new Uint8Array(64).fill(0x36);
  const outerPad = new Uint8Array(64).fill(0x5c);
  for (let i = 0; i < 64; i += 1) {
    const byte = seed[i] || 0;
    innerPad[i] ^= byte;
    outerPad[i] ^= byte;
  }

  /* salt || INT_32_BE(block) — only the counter changes between blocks, so the
     buffer is built once and the last four bytes rewritten. */
  const counter = new Uint8Array(64 + salt.length + 4);
  counter.set(innerPad, 0);
  counter.set(salt, 64);

  for (let block = 1; block <= blocks; block += 1) {
    const at = 64 + salt.length;
    counter[at] = (block >>> 24) & 255;
    counter[at + 1] = (block >>> 16) & 255;
    counter[at + 2] = (block >>> 8) & 255;
    counter[at + 3] = block & 255;

    let u = hmacWithPads(innerPad, outerPad, counter.subarray(64));
    const t = u.slice();
    for (let round = 1; round < iterations; round += 1) {
      u = hmacWithPads(innerPad, outerPad, u);
      for (let j = 0; j < hLength; j += 1) t[j] ^= u[j];
    }
    out.set(t, (block - 1) * hLength);
  }

  return out.subarray(0, dkLength).slice();
}

/**
 * PBKDF2-HMAC-SHA256, using the platform's implementation when it has one.
 *
 * The platform version is both faster and better reviewed than this file's, so
 * it is preferred. The difference is not academic: measured on a desktop, the
 * platform takes about 45ms for the iteration count used here, where the
 * JavaScript path takes a couple of seconds. Both produce the same key — the
 * tests assert that they agree, because a backup readable on one device and not
 * another would be worse than no backup at all.
 */
export async function pbkdf2Sha256(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  dkLength = 32,
): Promise<Uint8Array> {
  const subtle = (globalThis as any)?.crypto?.subtle;
  if (subtle && typeof subtle.importKey === 'function' && typeof subtle.deriveBits === 'function') {
    try {
      const material = await subtle.importKey('raw', password, 'PBKDF2', false, ['deriveBits']);
      const bits = await subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
        material,
        dkLength * 8,
      );
      return new Uint8Array(bits);
    } catch {
      /* Fall through: an unavailable or refusing Web Crypto is not an error,
         it just means doing the work here instead. */
    }
  }
  return pbkdf2Sha256Local(password, salt, iterations, dkLength);
}
