import { Platform, Share } from 'react-native';
/* The old call-style API lives at /legacy in this SDK. The bare entry point
   exports only Paths, File and Directory, so importing getInfoAsync from it
   yields undefined — which used to throw inside the guard below and quietly
   turn every picture share into a text share. */
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { CardTheme, cardPalette, documentFontsReady } from './shareCard';
import { captureRef } from 'react-native-view-shot';
import { arabicFontIdFor, ensureQuranFont, resolveArabicFamily } from './fonts';

/**
 * Turns the hadith of the day into a shareable image card.
 *
 * The same two renderers the verse card uses, for the same reason: native
 * photographs a real view with `react-native-view-shot`, and the web has no
 * view to photograph, so the card is drawn onto a canvas by hand. Canvas
 * `fillText` applies Arabic shaping and bidi for us, which an SVG-in-an-<img>
 * would not — fonts loaded in the document are invisible to an SVG rendered
 * as an image.
 *
 * A hadith differs from a verse in one way that matters here: the Arabic is
 * optional. The daily hadith is fetched in the reader's hadith language and
 * only carries the Arabic when that language is Arabic, so the card has to
 * read well with the Arabic block gone rather than leaving a hole where it
 * would have been.
 */

export type HadithCardData = {
  /** The Arabic original, when the day's hadith carries one. */
  arabic?: string;
  /** The hadith in the reader's language. */
  translation: string;
  /** The collection as it should be named on the card, already localized. */
  collection: string;
  /** Hadith number within the collection. */
  number: string;
  /** The Arabic family the reader is currently using, so the card matches it. */
  arabicFontFamily: string;
  /** Which colours the card wears. Defaults to the Islamic set. */
  theme?: CardTheme;
  /** The day it was the hadith of, already formatted for the reader. */
  date?: string;
};

/**
 * The day as the card should print it, in the reader's own language.
 *
 * A shared picture travels. It is saved to a camera roll, sent to someone, and
 * looked at weeks later, by which point "today" is no longer the day on it —
 * so the card carries the date rather than assuming the reader remembers.
 *
 * Every language the app speaks is handed straight to the platform, except
 * Arabic and Persian, which get their own month names but keep Latin digits —
 * swapping numbering systems halfway down a line reads as a mistake rather
 * than as a translation.
 *
 * That is deliberately wider than the app's own date map, which names eight
 * languages and leaves the rest to the device. A card is not a screen: it
 * leaves the app, so it cannot borrow the device's language the way a screen
 * quietly does. A Russian card reading "November 8, 2026" would be the only
 * English on it. A tag the platform will not accept falls back to English
 * rather than taking the whole card down with it.
 */
export function cardDateLabel(language?: string, on: Date = new Date()): string {
  const code =
    language === 'ar' ? 'ar-u-nu-latn'
    : language === 'fa' ? 'fa-u-nu-latn'
    : language;
  /* Short month rather than long. The footer line is the citation and the date
     sharing one row with the wordmark, and the longest collection name —
     "Forty Hadith of Shah Waliullah", set in capitals — plus a full
     "November 8, 2026" runs into the mark on the right. "Nov 8, 2026" leaves
     the row room to breathe in every language the app speaks. */
  const opts = { day: 'numeric', month: 'short', year: 'numeric' } as const;
  try {
    return on.toLocaleDateString(code, opts);
  } catch {
    return on.toLocaleDateString('en', opts);
  }
}

const W = 1080;
const PAD = 84;
const INNER = W - PAD * 2;

import {
  FALLBACK_ARABIC, fitArabic, font,
  loadBrandMark, roundRect, UI_STACK, wrapLines,
} from './shareCard';

/**
 * Draws the card and returns a PNG blob. Web only.
 */
async function renderWeb(data: HadithCardData): Promise<Blob> {
  const pal = cardPalette(data.theme);
  /* The reader's chosen face, whichever form the caller had it in, fetched
     before anything is measured: an unloaded face is measured in the
     fallback's metrics and the Arabic is then set at the wrong size. */
  const arabicFamily = resolveArabicFamily(data.arabicFontFamily);
  const hasArabic = !!String(data.arabic || '').trim();
  if (hasArabic) await ensureQuranFont(arabicFontIdFor(arabicFamily));
  await documentFontsReady();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser did not give us a canvas to draw on.');

  // ---- measure pass (logical units) ----
  const arabic = hasArabic ? fitArabic(ctx, data.arabic as string, arabicFamily) : null;
  const arabicLine = arabic ? Math.round(arabic.size * 1.75) : 0;

  /* With no Arabic block above it, the meaning is the whole card and is set
     larger — a hadith is prose rather than revelation, but it is still the
     reason anyone shares this. */
  const BODY_SIZE = hasArabic ? 34 : 42;
  const BODY_LINE = hasArabic ? 52 : 62;
  ctx.font = font(BODY_SIZE, 400, UI_STACK);
  const BODY_CAP = hasArabic ? 40 : 52;
  const allBody = data.translation ? wrapLines(ctx, data.translation, INNER, 'ltr') : [];
  const bodyClipped = allBody.length > BODY_CAP;
  const bodyLines = bodyClipped ? allBody.slice(0, BODY_CAP) : allBody;

  const headerBlock = 150;
  const arabicBlock = hasArabic ? arabicLine * arabic!.lines.length : 0;
  const dividerBlock = hasArabic ? 96 : 32;
  const bodyBlock = BODY_LINE * bodyLines.length;
  const footerBlock = 92;

  const H = Math.round(
    PAD + headerBlock + arabicBlock + dividerBlock + bodyBlock + footerBlock + PAD,
  );

  // ---- draw pass ----
  const scale = 2; // retina-crisp output
  canvas.width = W * scale;
  canvas.height = H * scale;
  ctx.scale(scale, scale);

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, pal.heroA);
  bg.addColorStop(1, pal.heroB);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // a soft glow behind the text, so it sits on something
  const glow = ctx.createRadialGradient(W * 0.78, H * 0.24, 0, W * 0.78, H * 0.24, W * 0.62);
  glow.addColorStop(0, pal.glow);
  glow.addColorStop(1, pal.glowZero);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ---- the frame: a heavy outer rule and a hairline inside it, with a small
  // diamond set into each corner. One rule reads as a border; two read as a
  // page, which is what this is pretending to be.
  ctx.strokeStyle = pal.frame;
  ctx.lineWidth = 3;
  roundRect(ctx, 34, 34, W - 68, H - 68, 44);
  ctx.stroke();

  ctx.strokeStyle = pal.hairline;
  ctx.lineWidth = 1.5;
  roundRect(ctx, 54, 54, W - 108, H - 108, 32);
  ctx.stroke();

  ctx.fillStyle = pal.accentSoft;
  for (const [cx, cy] of [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 7, cy);
    ctx.lineTo(cx, cy + 7);
    ctx.lineTo(cx - 7, cy);
    ctx.closePath();
    ctx.fill();
  }

  // ---- header: the collection in a pill, the number beside it ----
  let y = PAD + 34;
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = pal.accent;
  ctx.font = font(26, 700, UI_STACK);
  const refText = `HADITH ${data.collection}`;
  const refW = ctx.measureText(refText).width;
  const pillH = 54;
  const pillY = y - 34;
  roundRect(ctx, PAD - 20, pillY, refW + 40, pillH, 27);
  ctx.strokeStyle = pal.frame;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = pal.hairline;
  ctx.fill();
  ctx.fillStyle = pal.accent;
  ctx.fillText(refText, PAD, y);

  ctx.textAlign = 'right';
  ctx.fillStyle = pal.body;
  ctx.font = font(30, 400, UI_STACK);
  ctx.fillText(data.number, W - PAD, y);

  y += 46;
  ctx.strokeStyle = pal.frame;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();

  // ---- the hadith, in Arabic when there is one ----
  if (arabic) {
    y += arabicLine - 18;
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = pal.ink;
    ctx.font = font(arabic.size, 400, `"${arabicFamily}",${FALLBACK_ARABIC}`);
    for (const line of arabic.lines) {
      ctx.fillText(line, W - PAD, y);
      y += arabicLine;
    }
  }

  // ---- divider with a diamond, only when there is something above to divide ----
  if (arabic && bodyLines.length) {
    y += 22;
    const midY = y + 12;
    ctx.strokeStyle = pal.frame;
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
    ctx.fillStyle = pal.accentSoft;
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
    y += 74;
  } else if (bodyLines.length) {
    y += 56;
  }

  // ---- the meaning ----
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = pal.body;
  ctx.font = font(BODY_SIZE, 400, UI_STACK);
  bodyLines.forEach((line, i) => {
    const last = i === bodyLines.length - 1;
    ctx.fillText(last && bodyClipped ? `${line}…` : line, PAD, y);
    y += BODY_LINE;
  });

  // ---- footer, above a hairline ----
  ctx.strokeStyle = pal.hairline;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, H - PAD - 58);
  ctx.lineTo(W - PAD, H - PAD - 58);
  ctx.stroke();

  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = pal.rule;
  ctx.font = font(26, 400, UI_STACK);
  /* The citation, and the day, when there is one. The date is the last thing
     in the line so the two read as one breath: what it is, then when. */
  ctx.fillText([`${data.collection} · ${data.number}`, data.date].filter(Boolean).join(' · '), PAD, H - PAD - 6);

  // ---- brand: the wordmark, and the same mark the app header wears ----
  const mark = await loadBrandMark();
  const MARK = 36;
  ctx.textAlign = 'right';
  ctx.fillStyle = pal.footer;
  ctx.font = font(26, 600, UI_STACK);
  ctx.fillText('Islamic', mark ? W - PAD - MARK - 16 : W - PAD, H - PAD - 6);
  if (mark) {
    // centred on the text baseline rather than sitting on it
    ctx.drawImage(mark, W - PAD - MARK, H - PAD - 6 - 13 - MARK / 2, MARK, MARK);
  }

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

/** `hadith-<collection>-<number>.png`, with anything unsafe for a filename taken out. */
function fileNameFor(data: HadithCardData) {
  const safe = (value: string) => String(value || '').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '');
  return `hadith-${safe(data.collection)}-${safe(data.number)}.png`;
}

/** The same text the card carries, for the fallback share and for captions. */
export function hadithCardText(data: HadithCardData): string {
  const parts = [
    data.arabic ? String(data.arabic).trim() : '',
    String(data.translation || '').trim(),
    `${data.collection} · ${data.number}`,
  ].filter(Boolean);
  return parts.join('\n\n');
}

/**
 * Shares the hadith as an image card.
 *
 * `viewRef` is the React Native card on native. On web it is unused and the
 * card is drawn directly to a canvas instead.
 */
export async function shareHadithCard(data: HadithCardData, viewRef?: any): Promise<ShareResult> {
  const filename = fileNameFor(data);

  if (Platform.OS === 'web') {
    try {
      const blob = await renderWeb(data);
      const file = new File([blob], filename, { type: 'image/png' });

      // `canShare` is the only reliable way to know whether the browser will
      // accept a file; calling share() without it rejects on most desktops.
      const nav = navigator as any;
      if (nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: `${data.collection} · ${data.number}` });
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
    /* Photograph the card, then hand the file to the system. The two steps are
       kept apart so that failing at one is not mistaken for failing at the
       other: a capture that throws is a capture problem, and a share sheet
       the reader closes is a dismissal, not a reason to send their hadith as
       plain text. */
    let uri: string | null = null;
    try {
      uri = await captureRef(viewRef, { format: 'png', quality: 1, result: 'tmpfile' });
    } catch {
      uri = null;
    }

    if (uri) {
      /* A capture that succeeded is not the same as a capture with a picture
         in it. If the view has not been laid out, or was still transparent,
         the read-back is a blank PNG a few hundred bytes long — and sharing
         that looks exactly like a bug in the share sheet. Weigh it first: a
         real card is tens of kilobytes. Anything smaller is treated as a
         failure and the hadith goes out as text instead, which is always
         readable.

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
              dialogTitle: `${data.collection} · ${data.number}`,
            });
            return 'shared';
          } catch {
            return 'dismissed';
          }
        }
        await Share.share({ url: uri, title: `${data.collection} · ${data.number}` });
        return 'shared';
      }
    }
  }

  await Share.share({ message: hadithCardText(data) });
  return 'text';
}
