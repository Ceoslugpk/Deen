import ActivityKit
import SwiftUI
import WidgetKit

/**
 * The prayer countdown as a Live Activity.
 *
 * This is the answer to "can the widget animate". Home screen widgets cannot:
 * WidgetKit hands the system a static view and a timeline, and the system
 * decides when to move. A Live Activity is different in kind — it is a view
 * the system keeps live, updating continuously, that can sit on the Lock
 * Screen and fill the Dynamic Island.
 *
 * So this is where a countdown that visibly counts belongs. The timer below is
 * redrawn by the system roughly every second, and the Dynamic Island's
 * compact presentation ticks with it.
 *
 * It is iOS-only and iPhone 14 Pro and later for the Island; on everything
 * else it degrades to the Lock Screen presentation, which is still live.
 */
@available(iOS 16.1, *)
struct PrayerLiveActivity: Widget {

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PrayerActivityAttributes.self) { context in
            LockScreenPrayer(state: context.state)
                // Opens the Prayer screen, not the app's root.
                .widgetURL(URL(string: "islamic://prayer"))
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .leading, spacing: 1) {
                        Text("NEXT")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(DeenTheme.onHero)
                        Text(context.state.prayerName)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(DeenTheme.onHeroBody)
                            .lineLimit(1)
                    }
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.prayerTime)
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .monospacedDigit()
                        .foregroundStyle(DeenTheme.onHeroBody)
                }

                DynamicIslandExpandedRegion(.center) {
                    // Empty on purpose: leading and trailing carry the content,
                    // and a third cluster would crowd the Island.
                    EmptyView()
                }

                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        Image(systemName: "clock")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundStyle(DeenTheme.onHero)
                        Text(timerInterval: Date()...context.state.nextDate, countsDown: true)
                            .font(.system(size: 14, weight: .medium))
                            .monospacedDigit()
                            .foregroundStyle(DeenTheme.onHeroBody)
                        Spacer(minLength: 8)
                        Text(context.state.place)
                            .font(.system(size: 11))
                            .foregroundStyle(DeenTheme.onHeroMuted)
                            .lineLimit(1)
                    }
                    .padding(.horizontal, 4)
                }
            } compactLeading: {
                // What is visible beside the camera when the Island is idle.
                Image(systemName: "moon.stars.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(DeenTheme.onHero)
            } compactTrailing: {
                Text(timerInterval: Date()...context.state.nextDate, countsDown: true)
                    .font(.system(size: 12, weight: .semibold))
                    .monospacedDigit()
                    .foregroundStyle(DeenTheme.onHeroBody)
                    .frame(width: 54)
            } minimal: {
                Image(systemName: "moon.stars.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(DeenTheme.onHero)
            }
            .widgetURL(URL(string: "islamic://prayer"))
        }
    }
}

/** The Lock Screen presentation: the full card, with the live countdown. */
@available(iOS 16.1, *)
private struct LockScreenPrayer: View {
    let state: PrayerActivityAttributes.ContentState

    var body: some View {
        HStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 2) {
                Text("NEXT · \(state.prayerName.uppercased())")
                    .font(.system(size: 10, weight: .bold))
                    .tracking(0.8)
                    .foregroundStyle(DeenTheme.onHero)
                    .lineLimit(1)
                Text(state.prayerTime)
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .foregroundStyle(DeenTheme.onHeroBody)
                    .lineLimit(1)
                if !state.place.isEmpty {
                    Text(state.place)
                        .font(.system(size: 11))
                        .foregroundStyle(DeenTheme.onHeroMuted)
                        .lineLimit(1)
                }
            }
            Spacer(minLength: 0)
            VStack(alignment: .trailing, spacing: 4) {
                Image(systemName: "clock")
                    .font(.system(size: 13))
                    .foregroundStyle(DeenTheme.onHero)
                Text(timerInterval: Date()...state.nextDate, countsDown: true)
                    .font(.system(size: 15, weight: .semibold))
                    .monospacedDigit()
                    .foregroundStyle(DeenTheme.onHeroBody)
                    .lineLimit(1)
            }
        }
        .padding(14)
        .activityBackgroundTint(DeenTheme.deepIndigo)
        .activitySystemActionForegroundColor(DeenTheme.onHeroBody)
    }
}
