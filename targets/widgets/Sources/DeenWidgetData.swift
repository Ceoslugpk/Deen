import Foundation
import WidgetKit

/**
 * The snapshot the app published, read back by the widgets.
 *
 * The store is an App Group's `UserDefaults`. It has to be: a widget extension
 * is a separate process with its own sandbox, and the ordinary
 * `UserDefaults.standard` inside it is empty and always will be. The App Group
 * is the one place the app and the extension can both reach.
 *
 * That is also why the group identifier appears here and in the entitlements
 * and nowhere else. If those three ever disagree the widget does not crash —
 * it silently reads nothing, which is the harder failure to notice.
 */
struct DeenWidgetData {

    static let suiteName = "group.com.qashi.islamic"
    static let snapshotKey = "snapshot"

    struct Prayer: Codable {
        /// 'Fajr', 'Maghrib' — the stable English key.
        let name: String
        /// Already localised: 'الفجر'.
        let label: String
        /// Already formatted: '05:05'.
        let time: String
        /// Epoch milliseconds.
        let at: Double

        var date: Date { Date(timeIntervalSince1970: at / 1000) }
    }

    struct Ayah: Codable {
        let ref: String
        let ar: String
        let text: String
        let surah: String
    }

    struct Tasbih: Codable {
        let count: Int
        let target: Int
        let label: String
    }

    struct Snapshot: Codable {
        let v: Int
        let updatedAt: Double
        let place: String
        let method: String
        let hijri: String
        let hijriShort: String
        let today: [Prayer]
        let tomorrow: [Prayer]
        let ayah: Ayah?
        let tasbih: Tasbih?
        let theme: String

        var isEmpty: Bool { today.isEmpty }
        var isDark: Bool { theme == "dark" }
        var updated: Date { Date(timeIntervalSince1970: updatedAt / 1000) }
    }

    static func read() -> Snapshot? {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let raw = defaults.string(forKey: snapshotKey),
              let data = raw.data(using: .utf8)
        else { return nil }
        return try? JSONDecoder().decode(Snapshot.self, from: data)
    }

    /// Where we are in the day, worked out from the widget's own clock.
    struct Now {
        let current: Prayer?
        let next: Prayer?
        let until: TimeInterval
    }

    static func resolveNow(_ snap: Snapshot, now: Date = Date()) -> Now {
        var current: Prayer?
        var next: Prayer?
        for p in snap.today {
            if p.date <= now { current = p }
            else if next == nil { next = p }
        }
        // After Isha the next prayer belongs to a day that has not begun.
        if next == nil { next = snap.tomorrow.first }
        return Now(
            current: current,
            next: next,
            until: next.map { max(0, $0.date.timeIntervalSince(now)) } ?? 0
        )
    }

    /// Sunrise is in the list because the app lists it; it is not a prayer.
    static func isPrayer(_ key: String) -> Bool { key != "Sunrise" }
}

/**
 * The timeline that drives every widget here.
 *
 * An entry is written at each prayer time, and nowhere else. That is the whole
 * trick: WidgetKit redraws when an entry becomes current, so the widget moves
 * from "Dhuhr is next" to "Asr is next" at the exact moment it becomes true,
 * with the transition the system uses — and it does not redraw in between,
 * which is what keeps it off the battery.
 *
 * The countdown inside the entry ticks on its own: `Text(date, style: .timer)`
 * is redrawn by the system every second without a new entry.
 */
struct PrayerTimeline: TimelineProvider {

    typealias Entry = PrayerEntry

    struct PrayerEntry: TimelineEntry {
        let date: Date
        let snapshot: DeenWidgetData.Snapshot?
    }

    func placeholder(in context: Context) -> PrayerEntry {
        PrayerEntry(date: Date(), snapshot: DeenWidgetData.read())
    }

    /// Shown while the widget is being previewed in the picker.
    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        completion(PrayerEntry(date: Date(), snapshot: DeenWidgetData.read()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let snap = DeenWidgetData.read()
        let now = Date()
        var entries: [PrayerEntry] = [PrayerEntry(date: now, snapshot: snap)]

        guard let snap = snap, !snap.isEmpty else {
            // No times yet: ask again in fifteen minutes. Short, because the
            // most likely reason is that the app is about to publish some.
            completion(Timeline(entries: entries, policy: .after(now.addingTimeInterval(15 * 60))))
            return
        }

        // One entry at each prayer boundary, today and tomorrow.
        let boundaries = (snap.today + snap.tomorrow)
            .map(\.date)
            .filter { $0 > now }
            .prefix(14)

        entries.append(contentsOf: boundaries.map { PrayerEntry(date: $0, snapshot: snap) })

        /* Reload once the list runs out. A day is the natural unit: the app
           writes tomorrow's times alongside today's, so a widget left alone
           for a day still has something true to show. */
        let reload = Calendar.current.startOfDay(for: now.addingTimeInterval(24 * 60 * 60))
        completion(Timeline(entries: entries, policy: .after(reload)))
    }
}
