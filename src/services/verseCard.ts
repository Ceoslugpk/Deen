import { Platform, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/**
 * Turns a verse into a shareable image card.
 *
 * Two renderers, because the two platforms can only do this their own way:
 *   - native  -> `react-native-view-shot` captures a real React Native view
 *   - web     -> there is no view capture, so the card is drawn onto a canvas
 *                by hand. Canvas `fillText` applies Arabic shaping and bidi
 *                for us, which an SVG-in-an-<img> would not (fonts loaded in
 *                the document are invisible to an SVG rendered as an image).
 */

export type VerseCardData = {
  arabic: string;
  translation: string;
  /** Verse key, e.g. `2:255`. */
  reference: string;
  surahName: string;
  translationName: string;
  /** The Arabic family the reader is currently using, so the card matches it. */
  arabicFontFamily: string;
};

const W = 1080;
const PAD = 84;
const INNER = W - PAD * 2;

const GOLD = '#D8BC80';
const CREAM = '#F7F3EA';
const CREAM_SOFT = 'rgba(247,243,234,0.72)';
const HERO_A = '#2A2849';
const HERO_B = '#5146A4';

const UI_STACK = '"IBMPlexSansArabic_400Regular","DMSans_400Regular",system-ui,-apple-system,"Segoe UI",sans-serif';
const FALLBACK_ARABIC = '"NotoNaskhArabic_400Regular","Amiri_400Regular","Geeza Pro","Al Bayan",Tahoma,serif';

function font(size: number, weight: number, stack: string) {
  return `${weight} ${size}px ${stack}`;
}

/** Greedy word wrap. Words longer than the measure are hard-split so they can never overflow. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, dir: 'rtl' | 'ltr') {
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

/** Largest Arabic size that keeps the verse inside a comfortable block. */
function fitArabic(ctx: CanvasRenderingContext2D, text: string, family: string) {
  const stack = `"${family}",${FALLBACK_ARABIC}`;
  for (const size of [78, 72, 66, 60, 54, 48, 42, 38]) {
    ctx.font = font(size, 400, stack);
    const lines = wrapLines(ctx, text, INNER, 'rtl');
    if (lines.length * Math.round(size * 1.75) <= 660) return { size, lines };
  }
  ctx.font = font(38, 400, stack);
  return { size: 38, lines: wrapLines(ctx, text, INNER, 'rtl') };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
 */
async function renderWeb(data: VerseCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser did not give us a canvas to draw on.');

  // ---- measure pass (logical units) ----
  const arabic = fitArabic(ctx, data.arabic, data.arabicFontFamily);
  const arabicLine = Math.round(arabic.size * 1.75);

  ctx.font = font(34, 400, UI_STACK);
  // Keep the whole meaning. The cap only guards against something pathological,
  // and when it does bite the last line is ellipsised rather than cut dead.
  const TRANSLATION_CAP = 40;
  const allTranslation = data.translation ? wrapLines(ctx, data.translation, INNER, 'ltr') : [];
  const translationClipped = allTranslation.length > TRANSLATION_CAP;
  const translationLines = translationClipped ? allTranslation.slice(0, TRANSLATION_CAP) : allTranslation;
  const translationLine = 52;

  const headerBlock = 150;
  const arabicBlock = arabic.lines.length * arabicLine;
  const dividerBlock = translationLines.length ? 96 : 32;
  const translationBlock = translationLines.length * translationLine;
  const footerBlock = 92;

  const H = Math.round(
    PAD + headerBlock + arabicBlock + dividerBlock + translationBlock + footerBlock + PAD,
  );

  // ---- draw pass ----
  const scale = 2; // retina-crisp output
  canvas.width = W * scale;
  canvas.height = H * scale;
  ctx.scale(scale, scale);

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, HERO_A);
  bg.addColorStop(1, HERO_B);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // a soft glow behind the verse, so the text sits on something
  const glow = ctx.createRadialGradient(W * 0.78, H * 0.24, 0, W * 0.78, H * 0.24, W * 0.62);
  glow.addColorStop(0, 'rgba(216,188,128,0.20)');
  glow.addColorStop(1, 'rgba(216,188,128,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ---- the frame: a heavy outer rule and a hairline inside it, with a small
  // diamond set into each corner. One rule reads as a border; two read as a
  // page, which is what this is pretending to be.
  ctx.strokeStyle = 'rgba(216,188,128,0.34)';
  ctx.lineWidth = 3;
  roundRect(ctx, 34, 34, W - 68, H - 68, 44);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(216,188,128,0.17)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 54, 54, W - 108, H - 108, 32);
  ctx.stroke();

  ctx.fillStyle = 'rgba(216,188,128,0.72)';
  for (const [cx, cy] of [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 7, cy);
    ctx.lineTo(cx, cy + 7);
    ctx.lineTo(cx - 7, cy);
    ctx.closePath();
    ctx.fill();
  }

  // ---- header: the reference in a pill, the surah beside it ----
  let y = PAD + 34;
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD;
  ctx.font = font(26, 700, UI_STACK);
  const refText = `QURAN ${data.reference}`;
  const refW = ctx.measureText(refText).width;
  const pillH = 54;
  const pillY = y - 34;
  roundRect(ctx, PAD - 20, pillY, refW + 40, pillH, 27);
  ctx.strokeStyle = 'rgba(216,188,128,0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(216,188,128,0.10)';
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.fillText(refText, PAD, y);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(247,243,234,0.78)';
  ctx.font = font(30, 400, UI_STACK);
  ctx.fillText(data.surahName, W - PAD, y);

  y += 46;
  ctx.strokeStyle = 'rgba(216,188,128,0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();

  // ---- the verse, in Arabic ----
  y += arabicLine - 18;
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillStyle = CREAM;
  ctx.font = font(arabic.size, 400, `"${data.arabicFontFamily}",${FALLBACK_ARABIC}`);
  for (const line of arabic.lines) {
    ctx.fillText(line, W - PAD, y);
    y += arabicLine;
  }

  if (translationLines.length) {
    // ---- divider with a diamond ----
    y += 22;
    const midY = y + 12;
    ctx.strokeStyle = 'rgba(216,188,128,0.32)';
    ctx.lineWidth = 2;
    const gap = 40;
    const cx = W / 2;
    ctx.beginPath();
    ctx.moveTo(PAD, midY);
    ctx.lineTo(cx - gap, midY);
    ctx.moveTo(cx + gap, midY);
    ctx.lineTo(W - PAD, midY);
    ctx.stroke();
    // a diamond flanked by two dots, rather than a diamond on its own
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.moveTo(cx, midY - 10);
    ctx.lineTo(cx + 10, midY);
    ctx.lineTo(cx, midY + 10);
    ctx.lineTo(cx - 10, midY);
    ctx.closePath();
    ctx.fill();
    for (const dx of [-24, 24]) {
      ctx.beginPath();
      ctx.arc(cx + dx, midY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- translation ----
    y += 74;
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = CREAM_SOFT;
    ctx.font = font(34, 400, UI_STACK);
    translationLines.forEach((line, i) => {
      const last = i === translationLines.length - 1;
      ctx.fillText(last && translationClipped ? `${line}\u2026` : line, PAD, y);
      y += translationLine;
    });
  }

  // ---- footer, above a hairline ----
  ctx.strokeStyle = 'rgba(216,188,128,0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, H - PAD - 58);
  ctx.lineTo(W - PAD, H - PAD - 58);
  ctx.stroke();

  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(216,188,128,0.86)';
  ctx.font = font(26, 400, UI_STACK);
  ctx.fillText(data.translationName || '', PAD, H - PAD - 6);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(247,243,234,0.62)';
  ctx.font = font(26, 600, UI_STACK);
  ctx.fillText('Deen', W - PAD, H - PAD - 6);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))), 'image/png');
  });
}

/** Downloads the PNG on browsers that cannot open a native share sheet. */
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

export type ShareResult = 'shared' | 'saved' | 'dismissed' | 'text';

/**
 * Shares the verse as an image card.
 *
 * `viewRef` is the React Native card on native. On web it is unused and the
 * card is drawn directly to a canvas instead.
 */
export async function shareVerseCard(data: VerseCardData, viewRef?: any): Promise<ShareResult> {
  const filename = `quran-${data.reference.replace(':', '-')}.png`;

  if (Platform.OS === 'web') {
    try {
      const blob = await renderWeb(data);
      const file = new File([blob], filename, { type: 'image/png' });

      // `canShare` is the only reliable way to know whether the browser will
      // accept a file; calling share() without it rejects on most desktops.
      const nav = navigator as any;
      if (nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: `Quran ${data.reference}` });
          return 'shared';
        } catch (error: any) {
          if (error?.name === 'AbortError') return 'dismissed';
        }
      }
      downloadBlob(blob, filename);
      return 'saved';
    } catch {
      // fall through to the text share below
    }
  } else if (viewRef?.current) {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await Share.share({ url: uri, title: `Quran ${data.reference}` });
      return 'shared';
    } catch {
      // fall through to the text share below
    }
  }

  await Share.share({
    message: `${data.arabic}\n\n${data.translation}\n\nQuran ${data.reference} · ${data.surahName}`,
  });
  return 'text';
}
