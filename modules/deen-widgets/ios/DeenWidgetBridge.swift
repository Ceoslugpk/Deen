import ActivityKit
import Foundation
import WidgetKit

/**
 * The JavaScript side of the widgets and the Live Activity.
 *
 * The group identifier appears here, in the app's entitlements, and in the
 * widget extension's entitlements. All three must agree. When they do not,
 * nothing crashes — the widget simply reads an empty store forever, which is
 * the harder failure to notice, so it is worth saying out loud.
 */
@objc(DeenWidgetBridge)
class DeenWidgetBridge: NSObject {

    private static let suiteName = "group.com.qashi.islamic"
    private static let snapshotKey = "snapshot"

    @objc static func requiresMainQueueSetup() -> Bool { false }

    private var store: UserDefaults? { UserDefaults(suiteName: Self.suiteName) }

    // ---- the snapshot ----------------------------------------------------

    /// Store the snapshot. Does not redraw — call `refresh` for that.
    @objc func publish(
        _ json: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        store?.set(json, forKey: Self.snapshotKey)
        resolve(true)
    }

    /**
     * Redraw every widget.
     *
     * `reloadAllTimelines` asks each widget for a new timeline rather than
     * pushing new content at it. That is the correct direction: the widget
     * decides what to draw and when, and the app only says "something
     * changed".
     */
    @objc func refresh(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        WidgetCenter.shared.reloadAllTimelines()
        resolve(true)
    }

    /// Hand the snapshot back, so the app can pick up a home-screen tap.
    @objc func read(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        resolve(store?.string(forKey: Self.snapshotKey))
    }

    @objc func clear(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        store?.removeObject(forKey: Self.snapshotKey)
        WidgetCenter.shared.reloadAllTimelines()
        resolve(true)
    }

    // ---- the Live Activity -----------------------------------------------

    /**
     * Put the countdown on the Lock Screen and in the Dynamic Island.
     *
     * Asked for by name and time rather than by a snapshot, because an
     * activity is a single promise — "Asr is at 15:42" — and rebuilding it
     * from the whole snapshot would mean the extension and the app agreeing
     * on a shape they only partly share.
     *
     * Refuses quietly when the system will not have it, which covers three
     * real cases: an iOS version before 16.1, an iPad, and a user who has
     * turned Live Activities off in Settings. None of those are errors, and
     * none of them should surface as one.
     */
    @objc func startActivity(
        _ name: String,
        time: String,
        nextAt: Double,
        place: String,
        method: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        guard #available(iOS 16.1, *) else {
            resolve(false)
            return
        }
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            resolve(false)
            return
        }

        let attributes = PrayerActivityAttributes(method: method)
        let state = PrayerActivityAttributes.ContentState(
            prayerName: name,
            prayerTime: time,
            nextAt: nextAt,
            place: place
        )

        /* `update` is asynchronous, and an @objc method cannot be — so the
           work is handed to a task and the promise resolves inside it. */
        Task {
            do {
                if let existing = Self.currentActivity {
                    /* Called again with a new "next prayer". Update in place:
                       a second activity would leave two countdowns on the
                       Lock Screen, counting down to the same moment. */
                    await existing.update(.init(state: state, staleDate: nil))
                } else {
                    let activity = try Activity.request(
                        attributes: attributes,
                        content: .init(state: state, staleDate: nil),
                        pushType: nil
                    )
                    Self.currentActivity = activity
                }
                resolve(true)
            } catch {
                resolve(false)
            }
        }
    }

    /// Take it down — the day's last prayer has passed, or the user asked.
    @objc func stopActivity(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        guard #available(iOS 16.1, *) else {
            resolve(false)
            return
        }
        Task {
            for activity in Activity<PrayerActivityAttributes>.activities {
                await activity.end(nil, dismissalPolicy: .immediate)
            }
            await MainActor.run { Self.boxedActivity = nil }
            resolve(true)
        }
    }

    /**
     * The running activity, kept so that a later call updates it rather than
     * stacking a second one on top of it.
     *
     * Gated on the OS version because the type itself does not exist before
     * iOS 16.1, and a stored property cannot be conditionally available —
     * hence the untyped box.
     */
    private static var boxedActivity: Any?

    @available(iOS 16.1, *)
    private static var currentActivity: Activity<PrayerActivityAttributes>? {
        get { boxedActivity as? Activity<PrayerActivityAttributes> }
        set { boxedActivity = newValue }
    }
}
