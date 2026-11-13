import AppIntents
import SwiftUI
import WidgetKit

/**
 * A counter you can tap without opening the app.
 *
 * The count now exists in two places, and that is the part worth being careful
 * about. The app holds one; the widget writes another. If both were the truth,
 * a person could count to 33 on the home screen, open the app, and find 0.
 *
 * So the rule is last-write-wins, timestamped. Tapping the widget writes the
 * new count *and* the moment it was written. The app, when it next comes to
 * the front, compares that moment with the last time it published and adopts
 * whichever is newer. Nothing is merged, because two counters cannot be
 * merged — only one of them can be right.
 */
struct TasbihWidget: Widget {

    let kind = "TasbihWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimeline()) { entry in
            TasbihWidgetView(entry: entry)
        }
        .configurationDisplayName("Tasbih counter")
        .description("Count without opening the app.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct TasbihWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: PrayerTimeline.PrayerEntry

    var body: some View {
        Group {
            if let tasbih = entry.snapshot?.tasbih {
                content(count: tasbih.count, target: max(1, tasbih.target), label: tasbih.label)
            } else {
                content(count: 0, target: 33, label: "")
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(14)
        .heroGround()
    }

    private func content(count: Int, target: Int, label: String) -> some View {
        // Reaching the target is the moment the counter exists for.
        let complete = count > 0 && count % target == 0
        let isSmall = family == .systemSmall

        return VStack(alignment: .leading, spacing: 4) {
            DeenTheme.eyebrow("TASBIH")
            if !label.isEmpty {
                DeenTheme.body(label, size: 12)
            }
            Spacer(minLength: 0)

            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text("\(count)")
                    .font(.system(size: isSmall ? 34 : 44, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .foregroundStyle(complete ? DeenTheme.onHero : DeenTheme.onHeroBody)
                    .rollingNumbers()
                Text(" / \(target)")
                    .font(.system(size: isSmall ? 15 : 18, design: .rounded))
                    .foregroundStyle(DeenTheme.onHeroMuted)
            }

            Spacer(minLength: 0)

            if #available(iOSApplicationExtension 17.0, *) {
                HStack(spacing: 8) {
                    Button(intent: TasbihCountIntent()) {
                        Label("Count", systemImage: "plus")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(DeenTheme.midnightInk)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 7)
                            .background(DeenTheme.onHero, in: Capsule())
                    }
                    .buttonStyle(.plain)

                    Button(intent: TasbihResetIntent()) {
                        Image(systemName: "arrow.counterclockwise")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(DeenTheme.onHeroBody)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(DeenTheme.pill, in: Capsule())
                    }
                    .buttonStyle(.plain)
                }
            } else {
                /* Buttons in widgets arrived with iOS 17. Before it, tapping
                   the widget opens the app, which is the honest fallback. */
                DeenTheme.body("Tap to open", size: 11)
            }
        }
    }
}

// MARK: - The write the button performs

/**
 * Where the tap lands.
 *
 * The intent writes straight to the App Group rather than round-tripping
 * through the app, because the app may not be running — which is exactly when
 * somebody counts on their home screen. The stamp it leaves is what lets the
 * app pick the count up later without guessing.
 */
enum TasbihStore {
    static let suiteName = DeenWidgetData.suiteName
    static let snapshotKey = DeenWidgetData.snapshotKey
    static let stampKey = "tasbihAt"

    static func mutate(_ change: (Int) -> Int) {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let raw = defaults.string(forKey: snapshotKey),
              let data = raw.data(using: .utf8),
              var object = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
        else { return }

        let existing = object["tasbih"] as? [String: Any]
        let target = max(1, (existing?["target"] as? Int) ?? 33)
        let next = min(9999, max(0, change((existing?["count"] as? Int) ?? 0)))

        var tasbih: [String: Any] = existing ?? [:]
        tasbih["count"] = next
        tasbih["target"] = target
        tasbih["label"] = (existing?["label"] as? String) ?? ""
        object["tasbih"] = tasbih
        object[stampKey] = Date().timeIntervalSince1970 * 1000

        guard let out = try? JSONSerialization.data(withJSONObject: object),
              let string = String(data: out, encoding: .utf8)
        else { return }

        defaults.set(string, forKey: snapshotKey)
    }
}

@available(iOS 17.0, *)
struct TasbihCountIntent: AppIntent {
    static var title: LocalizedStringResource = "Count one"
    static var description = IntentDescription("Adds one to the tasbih counter.")

    init() {}

    func perform() async throws -> some IntentResult {
        TasbihStore.mutate { $0 + 1 }
        return .result()
    }
}

@available(iOS 17.0, *)
struct TasbihResetIntent: AppIntent {
    static var title: LocalizedStringResource = "Reset the counter"
    static var description = IntentDescription("Sets the tasbih counter back to zero.")

    init() {}

    func perform() async throws -> some IntentResult {
        TasbihStore.mutate { _ in 0 }
        return .result()
    }
}
