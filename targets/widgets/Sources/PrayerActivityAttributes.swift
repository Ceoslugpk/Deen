import ActivityKit
import Foundation

/**
 * What the Live Activity knows.
 *
 * This file is compiled into two targets: the app, which starts and updates
 * the activity, and the widget extension, which draws it. Both need the same
 * type, and the only way to guarantee they agree is for both to build it from
 * this one file — a copy that drifts would not fail to compile, it would fail
 * at runtime, with an activity the app starts and the extension cannot render.
 *
 * `ContentState` is what changes while the activity is up. `method` is fixed
 * for its lifetime, which is why it sits outside: it describes the activity,
 * not where it has got to.
 */

struct PrayerActivityAttributes: ActivityAttributes {

    public struct ContentState: Codable, Hashable {
        /// 'Asr' — already localised.
        var prayerName: String
        /// '15:42' — already formatted for the user's clock.
        var prayerTime: String
        /// Epoch milliseconds, so the countdown can be drawn by the system.
        var nextAt: Double
        var place: String

        var nextDate: Date { Date(timeIntervalSince1970: nextAt / 1000) }
    }

    /// Fixed for the life of the activity: it describes the activity, not its state.
    var method: String
}
