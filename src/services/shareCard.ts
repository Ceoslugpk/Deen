import { Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
export async function renderShareCard(data: ShareCardData): Promise<Blob> {
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
  grad.addColorStop(0, HERO_A);
  grad.addColorStop(1, HERO_B);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, height);

  // A soft gold wash, so a card with little text is not a flat rectangle.
  const aura = ctx.createRadialGradient(W * 0.82, height * 0.16, 0, W * 0.82, height * 0.16, W * 0.75);
  aura.addColorStop(0, 'rgba(223,177,99,0.20)');
  aura.addColorStop(1, 'rgba(223,177,99,0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, W, height);

  let y = PAD;

  // ---- kicker ----
  ctx.font = font(24, 700, UI_STACK);
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText(data.kicker.toUpperCase(), PAD, y + 24);
  y += KICKER_H;

  // ---- arabic ----
  if (arabicBlock) {
    y += ARABIC_GAP;
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = CREAM;
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
  ctx.fillStyle = CREAM_SOFT;
  ctx.font = font(34, 400, UI_STACK);
  for (const line of bodyLines) {
    ctx.fillText(line, PAD, y);
    y += 52;
  }

  // ---- footer ----
  if (footerLines.length) {
    y += FOOTER_GAP;
    ctx.fillStyle = 'rgba(249,242,235,0.55)';
    ctx.font = font(26, 400, UI_STACK);
    for (const line of footerLines) {
      ctx.fillText(line, PAD + 20, y);
      y += 36;
    }
    // A rule beside the reference rather than above it, so it reads as a note.
    ctx.fillStyle = GOLD;
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
  ctx.fillStyle = 'rgba(249,242,235,0.62)';
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
      const blob = await renderShareCard(data);
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
    try {
      const uri = await captureRef(viewRef, { format: 'png', quality: 1, result: 'tmpfile' });
      /* Weighed for the same reason as the verse card: a blank read-back is a
         PNG of a few hundred bytes, and forwarding that to someone is worse
         than forwarding the words. */
      const info = await FileSystem.getInfoAsync(uri).catch(() => null as any);
      const size = typeof info?.size === 'number' ? info.size : 0;
      if (size > 4096) {
        await Share.share({ url: uri, title: data.shareTitle });
        return 'shared';
      }
    } catch {
      // fall through to the text share below
    }
  }

  await Share.share({ message: data.fallbackText });
  return 'text';
}

export { FileSystem };
