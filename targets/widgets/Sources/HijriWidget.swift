import SwiftUI
import WidgetKit

/**
 * Today's date in both calendars.
 *
 * The smallest of the four and the calmest: no countdown, nothing to tap, one
 * line of gold and one of Pearl. It exists because the Hijri date is the
 * question the app is asked that a Gregorian calendar cannot answer, and
 * because it is the one thing here that stays true all day — it needs no
 * redraw between midnight and midnight.
 *
 * The Gregorian line is formatted here rather than published by the app, on
 * purpose: it is the one string a widget can produce perfectly on its own,
 * from the device's own locale, and shipping it across the bridge would only
 * make it stale.
 */
struct HijriWidget: Widget {

    let kind = "HijriWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimeline()) { entry in
            HijriWidgetView(entry: entry)
        }
        .configurationDisplayName("Hijri date")
        .description("Today's date in the Hijri and Gregorian calendars.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct HijriWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: PrayerTimeline.PrayerEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            DeenTheme.eyebrow("TODAY")
            Spacer(minLength: 0)

            Text(entry.snapshot?.hijriShort.isEmpty == false ? (entry.snapshot?.hijriShort ?? "") : "—")
                .font(.system(size: family == .systemSmall ? 17 : 21, weight: .bold))
                .foregroundStyle(DeenTheme.onHero)
                .lineLimit(2)
                .minimumScaleFactor(0.7)

            Text(Self.gregorian(for: entry.date))
                .font(.system(size: family == .systemSmall ? 11 : 12))
                .foregroundStyle(DeenTheme.onHeroMuted)
                .lineLimit(1)

            Spacer(minLength: 0)

            if family != .systemSmall, let place = entry.snapshot?.place, !place.isEmpty {
                Text(place)
                    .font(.system(size: 10))
                    .foregroundStyle(DeenTheme.onHeroMuted)
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(14)
        .heroGround()
    }

    /// 'Mon 9 Nov 2026', in the device's own language.
    private static func gregorian(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.setLocalizedDateFormatFromTemplate("EEE d MMM y")
        return formatter.string(from: date)
    }
}
