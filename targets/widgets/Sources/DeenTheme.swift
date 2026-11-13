import SwiftUI

/**
 * The app's own ten brand colours, and the type scale the widgets draw with.
 *
 * Copied rather than shared. A widget extension cannot see the app's design
 * tokens, and a home screen widget that is nearly the right indigo reads as a
 * different app. These are the brand's own hexes; anything needed beyond them
 * is mixed here from two brand colours.
 *
 * If the brand changes, this file and `src/design/brand.ts` move together.
 */
enum DeenTheme {

    // ---- the ten brand colours -------------------------------------------
    static let midnightInk = Color(hex: 0x14121F)
    static let deepIndigo  = Color(hex: 0x2D187D)
    static let royalIndigo = Color(hex: 0x452D9F)
    static let violet      = Color(hex: 0x5D40C3)
    static let lavender    = Color(hex: 0x8B6BE8)
    static let mist        = Color(hex: 0xE6DEFA)
    static let radiantGold = Color(hex: 0xDFB163)
    static let antiqueGold = Color(hex: 0xC28D3F)
    static let bronze      = Color(hex: 0x9A611A)
    static let pearl       = Color(hex: 0xF9F2EB)

    // ---- how they are used -----------------------------------------------

    /// The hero ground. Every widget but the ayah card sits on this.
    static let hero = deepIndigo
    /// Accents on the hero — the gold the app uses on its own indigo.
    static let onHero = radiantGold
    /// Body copy on the hero. Pearl, 12:1 on Deep Indigo.
    static let onHeroBody = pearl
    /// Labels and secondary lines. Dimmed Pearl, still 5:1 on the hero.
    static let onHeroMuted = Color(hex: 0xB9AEE0)
    /// The chip the countdown sits in.
    static let pill = royalIndigo
    /// A hairline between schedule rows.
    static let rule = Color(hex: 0x3A2A78)

    /// The ayah card, which is light, because the app reads verses on Pearl.
    static let lightCard = Color(hex: 0xFDFAF6)
    static let lightInk = midnightInk
    static let lightMuted = Color(hex: 0x6B6478)

    static let cardRadius: CGFloat = 20

    // ---- type ------------------------------------------------------------

    /// 'NEXT ·', 'TODAY' — tracked out, because at 10pt caps need the air.
    static func eyebrow(_ text: String) -> some View {
        Text(LocalizedStringKey(text))
            .font(.system(size: 10, weight: .bold))
            .tracking(0.8)
            .foregroundStyle(onHero)
            .lineLimit(1)
    }

    static func headline(_ text: String, size: CGFloat = 20) -> some View {
        Text(text)
            .font(.system(size: size, weight: .bold))
            .foregroundStyle(onHeroBody)
            .lineLimit(1)
            .minimumScaleFactor(0.7)
    }

    static func bigTime(_ text: String, size: CGFloat = 34) -> some View {
        Text(text)
            .font(.system(size: size, weight: .bold, design: .rounded))
            /* Monospaced digits, so the clock does not shiver as the minutes
               change — the one motion a countdown must never have. */
            .monospacedDigit()
            .foregroundStyle(onHeroBody)
            .lineLimit(1)
            .minimumScaleFactor(0.6)
    }

    static func body(_ text: String, size: CGFloat = 12, lines: Int = 1) -> some View {
        Text(text)
            .font(.system(size: size))
            .foregroundStyle(onHeroMuted)
            .lineLimit(lines)
    }

    /// The countdown chip, matching the pill under the Prayer screen's clock.
    static func pill(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 12, weight: .medium))
            .monospacedDigit()
            .foregroundStyle(onHeroBody)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(pill, in: Capsule())
    }
}

extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: alpha
        )
    }
}

extension View {
    /**
     * The hero ground.
     *
     * `containerBackground` is the iOS 17 way of saying "fill the widget";
     * before it, a plain background was the whole answer. Both are kept
     * because a widget that draws no ground on an older phone is a
     * transparent rectangle, and the deployment target is set by the app,
     * not by us.
     */
    @ViewBuilder
    func heroGround() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(DeenTheme.hero, for: .widget)
        } else {
            self.background(DeenTheme.hero)
        }
    }

    /**
     * Animates a number that changes rather than swapping it.
     *
     * This is the one piece of real motion a widget is allowed: as the
     * countdown crosses a minute, the digits roll instead of jumping.
     * Everything else in these widgets is static between timeline entries,
     * because that is all WidgetKit will give us.
     */
    @ViewBuilder
    func rollingNumbers() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.contentTransition(.numericText(countsDown: true))
        } else {
            self
        }
    }
}
