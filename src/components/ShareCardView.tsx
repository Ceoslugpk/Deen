import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardTheme, cardPalette, ShareCardData } from '../services/shareCard';
import { resolveArabicFamily } from '../services/fonts';

/** The same mark the app header wears, in its light-on-dark variant:
    the card is a dark gradient, so the dark-background artwork is the
    one that reads.

    Both marks are required because the header's mark depends on the theme,
    and a card has to carry whichever one its reader's header is showing. */
const BRAND_MARK = require('../../assets/logo-mark.png');
const BRAND_MARK_PALESTINE = require('../../assets/logo-mark-palestine.png');

/**
 * The generic share card as a real view.
 *
 * `shareCard()` draws these on a canvas for the web. On native there is no
 * canvas to draw into, so the card has to exist as an actual view for
 * react-native-view-shot to capture. That is the whole reason this file
 * exists: without it every non-verse share had nothing to point the camera
 * at and quietly fell back to sharing plain text.
 *
 * It mirrors `renderShareCard` in src/services/shareCard.ts — same palette,
 * same order, same spacing ratios, so a card looks the same either way. If
 * you change one, change the other.
 */

const W = 1080;
const PAD = 84;

/* The colours come from the card palette in ../services/shareCard so that a
   card made in the Palestine theme is green and black rather than indigo.
   The canvas renderer there and this view are two ways of drawing the same
   card, and they must agree. */

/** Mirrors the ladder in fitArabic(), which walks 78 down to 38 and takes
    the first size whose wrapped block fits the card. There is no canvas
    here to measure against, so the same result is approximated by length. */
function arabicSizeFor(text: string) {
  const n = text.length;
  if (n <= 60) return 78;
  if (n <= 110) return 72;
  if (n <= 170) return 66;
  if (n <= 240) return 60;
  if (n <= 330) return 54;
  if (n <= 440) return 48;
  if (n <= 600) return 42;
  return 38;
}

export type ShareCardViewProps = ShareCardData & {
  /** Passed as a plain prop rather than through forwardRef, whose React 19
      types do not line up with the View instance captureRef expects. */
  viewRef?: any;
  /** Which colours the card wears. Defaults to the Islamic set. */
  theme?: CardTheme;
};

export function ShareCardView({
  kicker,
  arabic,
  body,
  footer,
  arabicFontFamily,
  viewRef,
  theme,
}: ShareCardViewProps) {
  const pal = cardPalette(theme);
  const arabicFamily = resolveArabicFamily(arabicFontFamily);
  const arabicSize = arabic ? arabicSizeFor(arabic) : 0;

  return (
    <View ref={viewRef} collapsable={false} style={[card.card, { backgroundColor: pal.heroA }]}>
      <LinearGradient
        colors={[pal.heroA, pal.heroB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* the gold wash, so a card with little text is not a flat rectangle */}
      <View style={[card.glow, { backgroundColor: pal.glow }]} />

      {!!kicker && (
        <Text style={[card.kicker, { color: pal.accent }]} numberOfLines={1}>
          {kicker.toUpperCase()}
        </Text>
      )}

      {!!arabic && (
        <Text
          style={[
            card.arabic,
            {
              color: pal.ink,
              fontFamily: arabicFamily,
              fontSize: arabicSize,
              lineHeight: Math.round(arabicSize * 1.75),
            },
          ]}
        >
          {arabic}
        </Text>
      )}

      {!!body && <Text style={[card.body, { color: pal.body }]}>{body}</Text>}

      {!!footer && (
        <View style={card.footerRow}>
          <View style={[card.footerRule, { backgroundColor: pal.rule }]} />
          <Text style={[card.footer, { color: pal.footer }]}>{footer}</Text>
        </View>
      )}

      <View style={card.brandRow}>
        <Image source={theme === 'palestine' ? BRAND_MARK_PALESTINE : BRAND_MARK} resizeMode="contain" style={card.brandMark} />
        <Text style={[card.brandText, { color: pal.footer }]}>Islamic · Your Daily Companion</Text>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  card: {
    width: W,
    paddingHorizontal: PAD,
    paddingTop: PAD,
    paddingBottom: PAD,
  },
  glow: {
    position: 'absolute',
    top: -260,
    right: -260,
    width: 900,
    height: 900,
    borderRadius: 450,
  },
  kicker: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 44,
  },
  body: {
    fontSize: 34,
    lineHeight: 52,
    fontFamily: 'DMSans_400Regular',
    marginTop: 40,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 28,
  },
  footerRule: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: 16,
  },
  footer: {
    flex: 1,
    fontSize: 26,
    lineHeight: 36,
    fontFamily: 'DMSans_400Regular',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 56,
  },
  brandMark: {
    width: 44,
    height: 44,
    marginRight: 14,
  },
  brandText: {
    fontSize: 24,
    fontFamily: 'DMSans_600SemiBold',
  },
});
