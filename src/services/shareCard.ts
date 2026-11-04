import { Platform, Share } from 'react-native';
/* The old call-style API lives at /legacy in this SDK. The bare entry point
   exports only Paths, File and Directory, so importing getInfoAsync from it
   yields undefined — which used to throw inside the guard below and quietly
   turn every picture share into a text share. */
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

/**
 * The share-card painter, shared by every screen that turns what you are
 * reading into a picture.
 *
 * It started life inside the verse card. The Names and the Duas needed the
 * same artefact, and copying two hundred lines of canvas code three ways is
 * how the three drift apart — one gets a bug fixed, the others keep it. So the
 * parts that are not about verses live here now: the palette, the text
 * measuring, the rounded corners, the brand mark, and the business of actually
 * getting a PNG off the device.
 *
 * What each card *contains* is passed in. Nothing here knows what a name or a
 * supplication is.
 */

export type ShareCardData = {
  /** Small gold line at the top. What this is, and where it is from. */
  kicker: string;
  /** The Arabic, drawn large and right-aligned. Omitted for cards with none. */
  arabic?: string;
  /** The meaning or translation, in the reader's language. */
  body: string;
  /** Source, reference, or collection — the line at the bottom. */
  footer?: string;
  /** Arabic family the reader is using, so the card matches the app. */
  arabicFontFamily?: string;
  filename: string;
  shareTitle: string;
  /** Used if the image cannot be produced at all. */
  fallbackText: string;
  /** Which colours the card wears. Defaults to the Islamic set. */
  theme?: CardTheme;
};

export type ShareResult = 'shared' | 'saved' | 'dismissed' | 'text';

const W = 1080;
const PAD = 84;
const INNER = W - PAD * 2;

/* A share card is a brand artefact, so it is painted from the same ten
   colours as the rest of the app rather than its own set. */
export const GOLD = '#DFB163';                 // Radiant Gold
export const CREAM = '#F9F2EB';                // Pearl
export const CREAM_SOFT = 'rgba(249,242,235,0.72)';
export const HERO_A = '#2D187D';               // Deep Indigo
export const HERO_B = '#452D9F';               // Royal Indigo

/**
 * Which set of colours a card wears.
 *
 * A card that leaves the app is seen by people who may never open it, so it
 * carries the theme it was made in — a card made in the Palestine theme is
 * green and black, not indigo, the same way the screen it came from was.
 */
export type CardTheme = 'islamic' | 'palestine';

/**
 * The colours that go into a card, per theme.
 *
 * Every text entry here was measured against the light end of its own
 * gradient, which is the worst case, and clears 4.5:1. The two grounds are
 * not equally dark, which is why the two sets are not the same numbers with
 * different hues: the Palestine green is much lighter than the indigo, so
 * its body text has to run nearer solid white to stay readable on it.
 */
export type CardPalette = {
  /** Gradient, top-left to bottom-right. */
  heroA: string;
  heroB: string;
  /** The kicker and the reference — text, so it is a solid colour. */
  accent: string;
  /** Corner diamonds and divider dots. Decoration, not text, so it may be
      softer than the kicker: 3:1 is the bar here rather than 4.5:1. */
  accentSoft: string;
  /** Soft radial wash behind the text. */
  glow: string;
  /** The same wash faded to nothing, so the gradient ends on the right hue. */
  glowZero: string;
  /** Outer frame rule. */
  frame: string;
  /** Inner hairline, inside the outer rule. */
  hairline: string;
  /** The Arabic, set large. */
  ink: string;
  /** The meaning or translation. */
  body: string;
  /** The reference line at the foot. */
  footer: string;
  /** The vertical rule beside the reference. */
  rule: string;
};

export const CARD_PALETTES: Record<CardTheme, CardPalette> = {
  islamic: {
    heroA: '#2D187D',
    heroB: '#452D9F',
    accent: '#DFB163',                 // 4.98:1
    accentSoft: 'rgba(223,177,99,0.72)', // 3.26:1, decorative
    glow: 'rgba(223,177,99,0.20)',
    glowZero: 'rgba(223,177,99,0)',
    frame: 'rgba(223,177,99,0.34)',
    hairline: 'rgba(223,177,99,0.17)',
    ink: '#F9F2EB',
    body: 'rgba(249,242,235,0.72)',   // 5.41:1
    /* Lifted from 0.55, which measured 3.79:1 and so missed the 4.5:1 the
       small print wants. It is the same colour, just less of it let through. */
    footer: 'rgba(249,242,235,0.68)', // 4.56:1
    rule: 'rgba(223,177,99,0.86)',
  },
  palestine: {
    /* Near-black to deep green — the flag's own two dark colours. The green
       is taken down to 0.45 rather than the theme's 0.18 because a card is
       solid text laid over the ground, and at 0.18 the body text could not
       be made to clear 4.5:1 however it was mixed. */
    heroA: '#001508',
    heroB: '#00531E',
    /* White, not the flag's red. Red on this ground measures 2.2:1, under
       the 3:1 even a decorative rule needs, so the red stays on the flag
       and the card is dressed in white. */
    accent: '#FFFFFF',                  // 9.31:1
    accentSoft: 'rgba(255,255,255,0.80)',
    glow: 'rgba(255,255,255,0.10)',
    glowZero: 'rgba(255,255,255,0)',
    frame: 'rgba(255,255,255,0.30)',
    hairline: 'rgba(255,255,255,0.16)',
    ink: '#FFFFFF',                   // 9.31:1
    body: 'rgba(255,255,255,0.80)',   // 6.58:1
    footer: 'rgba(255,255,255,0.62)', // 4.61:1
    rule: 'rgba(255,255,255,0.70)',
  },
};

export function cardPalette(theme: CardTheme | undefined | null): CardPalette {
  return CARD_PALETTES[theme === 'palestine' ? 'palestine' : 'islamic'];
}

export function isPalestineCard(theme: CardTheme | undefined | null): boolean {
  return theme === 'palestine';
}

export const UI_STACK =
  '"IBMPlexSansArabic_400Regular","DMSans_400Regular",system-ui,-apple-system,"Segoe UI",sans-serif';
export const FALLBACK_ARABIC =
  '"NotoNaskhArabic_400Regular","Amiri_400Regular","Geeza Pro","Al Bayan",Tahoma,serif';

const BRAND_MARK = require('../../assets/logo-mark.png');

export function font(size: number, weight: number, stack: string) {
  return `${weight} ${size}px ${stack}`;
}

/** Greedy word wrap. Words longer than the measure are hard-split so they can never overflow. */
export function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  dir: 'rtl' | 'ltr',
) {
  ctx.direction = dir;
  const tokens = String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => {
      if (ctx.measureText(word).width <= maxWidth) return [word];
      // A single unbreakable run: cut it into pieces that fit.
      const pieces: string[] = [];
      let piece = '';
      for (const char of word) {
        if (piece && ctx.measureText(piece + char).width > maxWidth) {
          pieces.push(piece);
          piece = char;
        } else {
          piece += char;
        }
      }
      if (piece) pieces.push(piece);
      return pieces;
    });

  const lines: string[] = [];
  let line = '';
  for (const token of tokens) {
    const candidate = line ? `${line} ${token}` : token;
    if (!line || ctx.measureText(candidate).width <= maxWidth) line = candidate;
    else {
      lines.push(line);
      line = token;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Largest Arabic size that keeps the text inside a comfortable block. */
export function fitArabic(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  maxWidth = INNER,
  maxHeight = 660,
) {
  const stack = `"${family}",${FALLBACK_ARABIC}`;
  for (const size of [78, 72, 66, 60, 54, 48, 42, 38]) {
    ctx.font = font(size, 400, stack);
    const lines = wrapLines(ctx, text, maxWidth, 'rtl');
    if (lines.length * Math.round(size * 1.75) <= maxHeight) return { size, lines };
  }
  ctx.font = font(38, 400, stack);
  return { size: 38, lines: wrapLines(ctx, text, maxWidth, 'rtl') };
}

/**
 * The header's mark, loaded so the canvas can draw it. The card is a dark
 * gradient, so this is the light-on-dark variant. If it cannot be decoded we
 * simply draw the wordmark without it rather than failing the whole share.
 */
export async function loadBrandMark(): Promise<HTMLImageElement | null> {
  try {
    const raw: any = BRAND_MARK;
    const src = typeof raw === 'string' ? raw : (raw?.default ?? raw?.uri ?? raw);
    if (!src || typeof src !== 'string') return null;
    const img = new Image();
    img.src = src;
    if (typeof (img as any).decode === 'function') await (img as any).decode();
    else
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('mark'));
      });
    return img;
  } catch {
    return null;
  }
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draws the card and returns a PNG blob. Web only.
 *
 * The card grows with its content rather than being fixed at a ratio: a short
 * name should not sit in the middle of a tall empty rectangle, and a long
 * supplication should not be squeezed to fit one.
 */
export async function renderShareCard(
  data: ShareCardData,
  theme: CardTheme = 'islamic',
): Promise<Blob> {
  const pal = cardPalette(theme);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser did not give us a canvas to draw on.');
  const mark = await loadBrandMark();

  // ---- measure ----
  ctx.font = font(34, 400, UI_STACK);
  const bodyLines = wrapLines(ctx, data.body || '', INNER, 'ltr');
  ctx.font = font(26, 400, UI_STACK);
  const footerLines = data.footer ? wrapLines(ctx, data.footer, INNER - 40, 'ltr') : [];

  const arabicBlock = data.arabic
    ? fitArabic(ctx, data.arabic, data.arabicFontFamily || 'NotoNaskhArabic_400Regular')
    : null;

  const KICKER_H = 46;
  const ARABIC_GAP = 44;
  const BODY_GAP = 40;
  const FOOTER_GAP = 28;

  let contentH = KICKER_H;
  if (arabicBlock) contentH += ARABIC_GAP + arabicBlock.lines.length * Math.round(arabicBlock.size * 1.75);
  contentH += BODY_GAP + bodyLines.length * 52;
  if (footerLines.length) contentH += FOOTER_GAP + footerLines.length * 36;

  const FOOT_BRAND = 120;
  const height = Math.max(720, Math.round(PAD + contentH + FOOT_BRAND + PAD));

  canvas.width = W;
  canvas.height = height;
  ctx.clearRect(0, 0, W, height);

  // ---- ground ----
  const grad = ctx.createLinearGradient(0, 0, W, height);
  grad.addColorStop(0, pal.heroA);
  grad.addColorStop(1, pal.heroB);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, height);

  // A soft gold wash, so a card with little text is not a flat rectangle.
  const aura = ctx.createRadialGradient(W * 0.82, height * 0.16, 0, W * 0.82, height * 0.16, W * 0.75);
  aura.addColorStop(0, pal.glow);
  aura.addColorStop(1, pal.glowZero);
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, W, height);

  let y = PAD;

  // ---- kicker ----
  ctx.font = font(24, 700, UI_STACK);
  ctx.fillStyle = pal.accent;
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText(data.kicker.toUpperCase(), PAD, y + 24);
  y += KICKER_H;

  // ---- arabic ----
  if (arabicBlock) {
    y += ARABIC_GAP;
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = pal.ink;
    ctx.font = font(arabicBlock.size, 400, `"${data.arabicFontFamily || 'NotoNaskhArabic_400Regular'}",${FALLBACK_ARABIC}`);
    const step = Math.round(arabicBlock.size * 1.75);
    for (const line of arabicBlock.lines) {
      ctx.fillText(line, W - PAD, y);
      y += step;
    }
  }

  // ---- body ----
  y += BODY_GAP;
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillStyle = pal.body;
  ctx.font = font(34, 400, UI_STACK);
  for (const line of bodyLines) {
    ctx.fillText(line, PAD, y);
    y += 52;
  }

  // ---- footer ----
  if (footerLines.length) {
    y += FOOTER_GAP;
    ctx.fillStyle = pal.footer;
    ctx.font = font(26, 400, UI_STACK);
    for (const line of footerLines) {
      ctx.fillText(line, PAD + 20, y);
      y += 36;
    }
    // A rule beside the reference rather than above it, so it reads as a note.
    ctx.fillStyle = pal.rule;
    ctx.fillRect(PAD, y - footerLines.length * 36 - 20, 4, footerLines.length * 36);
  }

  // ---- brand ----
  const brandY = height - PAD - 28;
  if (mark) {
    try {
      ctx.drawImage(mark, PAD, brandY - 34, 44, 44);
    } catch {
      /* the wordmark alone is enough */
    }
  }
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillStyle = pal.footer;
  ctx.font = font(24, 600, UI_STACK);
  ctx.fillText('Islamic · Your Daily Companion', PAD + (mark ? 58 : 0), brandY);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the card.'))), 'image/png');
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Shares `data` as an image card.
 *
 * `viewRef` is the React Native card on native. On web it is unused and the
 * card is drawn straight to a canvas instead.
 */
export async function shareCard(data: ShareCardData, viewRef?: any): Promise<ShareResult> {
  if (Platform.OS === 'web') {
    try {
      const blob = await renderShareCard(data, data.theme);
      const file = new File([blob], data.filename, { type: 'image/png' });

      // `canShare` is the only reliable way to know whether the browser will
      // accept a file; calling share() without it rejects on most desktops.
      const nav = navigator as any;
      if (nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: data.shareTitle });
          return 'shared';
        } catch (error: any) {
          if (error?.name === 'AbortError') return 'dismissed';
        }
      }
      downloadBlob(blob, data.filename);
      return 'saved';
    } catch {
      // fall through to the text share below
    }
  } else if (viewRef?.current) {
    /* Photograph the card, then hand the file to the system. The two steps are
       kept apart so that failing at one is not mistaken for failing at the
       other: a capture that throws is a capture problem, and a share sheet
       the reader closes is a dismissal, not a reason to send their verse as
       plain text. */
    let uri: string | null = null;
    try {
      uri = await captureRef(viewRef, { format: 'png', quality: 1, result: 'tmpfile' });
    } catch {
      uri = null;
    }

    if (uri) {
      /* Weighed because a capture that succeeded is not always a capture with
         a picture in it: if the view had not been laid out, the read-back is
         a blank PNG a few hundred bytes long, and forwarding that looks like
         a bug in the share sheet.

         null means the file could not be weighed at all. That is not the same
         as a file that weighed in blank, and it must not cost the reader
         their picture: an unmeasured card is shared, not downgraded. */
      const info = await FileSystem.getInfoAsync(uri).catch(() => null as any);
      const size = typeof info?.size === 'number' ? info.size : null;
      if (size === null || size > 4096) {
        /* expo-sharing is what the backup export already uses. It passes the
           file out through a content URI, which a bare file:// path is not
           allowed to do on a modern Android, where handing one over throws. */
        if (await Sharing.isAvailableAsync()) {
          try {
            await Sharing.shareAsync(uri, {
              mimeType: 'image/png',
              dialogTitle: data.shareTitle,
            });
            return 'shared';
          } catch {
            return 'dismissed';
          }
        }
        await Share.share({ url: uri, title: data.shareTitle });
        return 'shared';
      }
    }
  }

  await Share.share({ message: data.fallbackText });
  return 'text';
}

export { FileSystem };
