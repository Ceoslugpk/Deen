import SwiftUI
import WidgetKit

/**
 * The four widgets, and the Live Activity.
 *
 * One bundle, because iOS gives an extension one entry point and finds
 * everything it offers through the bundle. Nothing here is configuration —
 * it is a list of what exists.
 */
@main
struct DeenWidgetBundle: WidgetBundle {

    var body: some Widget {
        PrayerWidget()
        AyahWidget()
        TasbihWidget()
        HijriWidget()
        PrayerLiveActivity()
    }
}
