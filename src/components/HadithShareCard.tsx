import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardPalette, CardTheme, cardPalette } from '../services/shareCard';
import { resolveArabicFamily } from '../services/fonts';

/** The same mark the app header wears, in its light-on-dark variant:
    the card is a dark gradient, so the dark-background artwork is the
    one that reads. */
const BRAND_MARK = require('../../assets/logo-mark.png');

/**
 * The hadith card as a real view. On native this is what gets captured into the
 * shared PNG; on web the card is drawn on a canvas instead (see
 * `src/services/hadithCard.ts`), so this component is only rendered off-screen.
 *
 * It deliberately mirrors the canvas card: same palette, same order, same
 * spacing ratios, so a shared image looks the same on either platform. If you
 * change one, change the other.
 *
 * The Arabic block is optional and the layout is built to close up around its
 * absence, because the daily hadith only carries the Arabic when the reader's
 * hadith language is Arabic.
 */

const W = 1080;
const PAD = 84;

export type HadithShareCardProps = {
  arabic?: string;
  translation: string;
  collection: string;
  number: string;
  arabicFontFamily: string;
  /** Passed as a plain prop rather than through forwardRef, whose React 19
      types do not line up with the View instance captureRef expects. */
  viewRef?: any;
  /** Which colours the card wears. Defaults to the Islamic set. */
  theme?: CardTheme;
};

/* Built from the palette rather than written out once, so that a card made
   in the Palestine theme is green and black instead of indigo. A shared
   picture leaves the app, and it should look like the app it came from. */
function makeStyles(pal: CardPalette) {
  return StyleSheet.create({
    card: {
      width: W,
      paddingHorizontal: PAD,
      paddingTop: PAD + 34,
      paddingBottom: PAD,
      backgroundColor: pal.heroA,
    },
    glow: {
      position: 'absolute',
      top: -180,
      right: -180,
      width: 700,
      height: 700,
      borderRadius: 350,
      backgroundColor: pal.glow,
    },
    frameOuter: {
      position: 'absolute',
      top: 34, left: 34, right: 34, bottom: 34,
      borderRadius: 44,
      borderWidth: 3,
      borderColor: pal.frame,
    },
    frameInner: {
      position: 'absolute',
      top: 54, left: 54, right: 54, bottom: 54,
      borderRadius: 32,
      borderWidth: 1.5,
      borderColor: pal.hairline,
    },
    corner: {
      position: 'absolute',
      width: 14,
      height: 14,
      backgroundColor: pal.accentSoft,
      transform: [{ rotate: '45deg' }],
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pill: {
      borderWidth: 2,
      borderColor: pal.frame,
      backgroundColor: pal.hairline,
      borderRadius: 27,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    kicker: { color: pal.accent, fontSize: 26, fontWeight: '700', letterSpacing: 1.4 },
    number: { color: pal.body, fontSize: 30 },
    headerRule: { height: 2, backgroundColor: pal.frame, marginTop: 40 },
    arabic: { color: pal.ink, textAlign: 'right', marginTop: 56, writingDirection: 'rtl' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 64, marginBottom: 56 },
    dividerLine: { flex: 1, height: 2, backgroundColor: pal.frame },
    dividerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: pal.accentSoft, marginHorizontal: 16 },
    diamond: {
      width: 20,
      height: 20,
      backgroundColor: pal.accentSoft,
      transform: [{ rotate: '45deg' }],
    },
    body: { color: pal.body, fontSize: 34, lineHeight: 52 },
    bodySolo: { color: pal.body, fontSize: 42, lineHeight: 62, marginTop: 56 },
    footerRule: { height: 1.5, backgroundColor: pal.hairline, marginTop: 72 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 26 },
    footerLeft: { color: pal.rule, fontSize: 26 },
    footerRight: { color: pal.footer, fontSize: 26, fontWeight: '700' },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    brandMark: { width: 40, height: 40 },
  });
}

/** A diamond with a dot either side: the break between Arabic and meaning. */
function Divider({ styles }: { styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerDot} />
      <View style={styles.diamond} />
      <View style={styles.dividerDot} />
      <View style={styles.dividerLine} />
    </View>
  );
}

export function HadithShareCard({
  arabic,
  translation,
  collection,
  number,
  arabicFontFamily,
  viewRef,
  theme,
}: HadithShareCardProps) {
  const pal = cardPalette(theme);
  const styles = React.useMemo(() => makeStyles(pal), [pal]);
  const arabicFamily = resolveArabicFamily(arabicFontFamily);
  const hasArabic = !!String(arabic || '').trim();
  const arabicSize = arabic && arabic.length > 320 ? 54 : arabic && arabic.length > 160 ? 66 : 76;
  return (
    <View ref={viewRef} collapsable={false} style={styles.card}>
      <LinearGradient colors={[pal.heroA, pal.heroB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      {/* two rules, not one, with a diamond set into each corner */}
      <View style={styles.frameOuter} />
      <View style={styles.frameInner} />
      <View style={[styles.corner, { top: 62, left: 62 }]} />
      <View style={[styles.corner, { top: 62, right: 62 }]} />
      <View style={[styles.corner, { bottom: 62, left: 62 }]} />
      <View style={[styles.corner, { bottom: 62, right: 62 }]} />

      <View style={styles.header}>
        <View style={styles.pill}>
          <Text style={styles.kicker}>{`HADITH ${collection}`}</Text>
        </View>
        <Text style={styles.number}>{number}</Text>
      </View>
      <View style={styles.headerRule} />

      {hasArabic && (
        <Text style={[styles.arabic, { fontFamily: arabicFamily, fontSize: arabicSize, lineHeight: Math.round(arabicSize * 1.75) }]}>
          {arabic}
        </Text>
      )}

      {!!translation && (
        <>
          {hasArabic && <Divider styles={styles} />}
          <Text style={hasArabic ? styles.body : styles.bodySolo}>{translation}</Text>
        </>
      )}

      <View style={styles.footerRule} />
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>{`${collection} · ${number}`}</Text>
        <View style={styles.brand}>
          <Text style={styles.footerRight}>Islamic</Text>
          <Image source={BRAND_MARK} resizeMode="contain" style={styles.brandMark} />
        </View>
      </View>
    </View>
  );
}
