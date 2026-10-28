import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * The verse card as a real view. On native this is what gets captured into the
 * shared PNG; on web the card is drawn on a canvas instead (see
 * `src/services/verseCard.ts`), so this component is only rendered off-screen.
 *
 * It deliberately mirrors the canvas card: same palette, same order, same
 * spacing ratios, so a shared image looks the same on either platform.
 */

const W = 1080;
const PAD = 84;
const GOLD = '#D8BC80';
const CREAM = '#F7F3EA';

export type VerseShareCardProps = {
  arabic: string;
  translation: string;
  reference: string;
  surahName: string;
  translationName: string;
  arabicFontFamily: string;
  /** Passed as a plain prop rather than through forwardRef, whose React 19
      types do not line up with the View instance captureRef expects. */
  viewRef?: any;
};

function Divider() {
  return (
    <View style={cardStyles.dividerRow}>
      <View style={cardStyles.dividerLine} />
      <View style={cardStyles.diamond} />
      <View style={cardStyles.dividerLine} />
    </View>
  );
}

export function VerseShareCard({
  arabic,
  translation,
  reference,
  surahName,
  translationName,
  arabicFontFamily,
  viewRef,
}: VerseShareCardProps) {
  const arabicSize = arabic.length > 320 ? 54 : arabic.length > 160 ? 66 : 76;
  return (
    <View ref={viewRef} collapsable={false} style={cardStyles.card}>
      <LinearGradient colors={['#2A2849', '#5146A4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={cardStyles.glow} />

      <View style={cardStyles.header}>
        <Text style={cardStyles.kicker}>{`QURAN ${reference}`}</Text>
        <Text style={cardStyles.surah}>{surahName}</Text>
      </View>
      <View style={cardStyles.headerRule} />

      <Text style={[cardStyles.arabic, { fontFamily: arabicFontFamily, fontSize: arabicSize, lineHeight: Math.round(arabicSize * 1.75) }]}>
        {arabic}
      </Text>

      {!!translation && (
        <>
          <Divider />
          <Text style={cardStyles.translation}>{translation}</Text>
        </>
      )}

      <View style={cardStyles.footer}>
        <Text style={cardStyles.footerLeft}>{translationName}</Text>
        <Text style={cardStyles.footerRight}>Deen</Text>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: W,
    paddingHorizontal: PAD,
    paddingTop: PAD + 34,
    paddingBottom: PAD,
    backgroundColor: '#2A2849',
  },
  glow: {
    position: 'absolute',
    top: -180,
    right: -180,
    width: 700,
    height: 700,
    borderRadius: 350,
    backgroundColor: 'rgba(216,188,128,0.16)',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: GOLD, fontSize: 28, fontWeight: '700', letterSpacing: 1.5 },
  surah: { color: 'rgba(247,243,234,0.78)', fontSize: 30 },
  headerRule: { height: 2, backgroundColor: 'rgba(216,188,128,0.28)', marginTop: 40 },
  arabic: { color: CREAM, textAlign: 'right', marginTop: 56, writingDirection: 'rtl' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 64, marginBottom: 56 },
  dividerLine: { flex: 1, height: 2, backgroundColor: 'rgba(216,188,128,0.32)' },
  diamond: {
    width: 18,
    height: 18,
    marginHorizontal: 18,
    backgroundColor: GOLD,
    transform: [{ rotate: '45deg' }],
  },
  translation: { color: 'rgba(247,243,234,0.72)', fontSize: 34, lineHeight: 52 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 72 },
  footerLeft: { color: 'rgba(216,188,128,0.86)', fontSize: 26 },
  footerRight: { color: 'rgba(247,243,234,0.62)', fontSize: 26, fontWeight: '700' },
});
