import SwiftUI
import WidgetKit

/**
 * The ayah of the day, drawn as the reader draws a verse.
 *
 * This is the one widget that is not on the indigo hero. A verse is read, not
 * glanced at, and the app reads verses on Pearl with Midnight Ink text — so
 * this is a card rather than a hero, and the only one of the four that answers
 * the light/dark setting, because it is the only one whose ground is light.
 *
 * The Arabic is the point of it and is never squeezed: small shows the
 * reference and as much Arabic as fits, larger sizes add the translation
 * underneath.
 */
struct AyahWidget: Widget {

    let kind = "AyahWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimeline()) { entry in
            AyahWidgetView(entry: entry)
        }
        .configurationDisplayName("Ayah of the day")
        .description("Today's verse, as it appears in the reader.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct AyahWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: PrayerTimeline.PrayerEntry

    private var dark: Bool { entry.snapshot?.isDark ?? false }

    var body: some View {
        Group {
            if let ayah = entry.snapshot?.ayah {
                content(for: ayah)
            } else {
                emptyState
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(14)
        .widgetBackground(dark ? DeenTheme.midnightInk : DeenTheme.lightCard)
    }

    private func content(for ayah: DeenWidgetData.Ayah) -> some View {
        let ink = dark ? DeenTheme.pearl : DeenTheme.lightInk
        let muted = dark ? DeenTheme.onHeroMuted : DeenTheme.lightMuted
        let gold = dark ? DeenTheme.radiantGold : DeenTheme.antiqueGold
        let isSmall = family == .systemSmall

        return VStack(alignment: .leading, spacing: 8) {
            Text([ayah.surah, ayah.ref].filter { !$0.isEmpty }.joined(separator: " · "))
                .font(.system(size: 10, weight: .bold))
                .tracking(0.6)
                .foregroundStyle(gold)
                .lineLimit(1)

            Text(ayah.ar)
                .font(.system(size: isSmall ? 15 : 17))
                /* Right-aligned and given every line it does not use: it is
                   the reason this widget exists. */
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .foregroundStyle(ink)
                .lineLimit(isSmall ? 4 : 6)

            if !isSmall && !ayah.text.isEmpty {
                Text(ayah.text)
                    .font(.system(size: 11))
                    .foregroundStyle(muted)
                    .lineLimit(family == .systemLarge ? 6 : 3)
            }
            Spacer(minLength: 0)
        }
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("AYAH OF THE DAY")
                .font(.system(size: 10, weight: .bold))
                .tracking(0.8)
                .foregroundStyle(dark ? DeenTheme.onHero : DeenTheme.antiqueGold)
            Text("Open Islamic for today's ayah")
                .font(.system(size: 12))
                .foregroundStyle(dark ? DeenTheme.onHeroMuted : DeenTheme.lightMuted)
                .lineLimit(2)
            Spacer(minLength: 0)
        }
    }
}

extension View {
    /** The card ground, for the one widget that is not a hero. */
    @ViewBuilder
    func widgetBackground(_ color: Color) -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(color, for: .widget)
        } else {
            self.background(color)
        }
    }
}
