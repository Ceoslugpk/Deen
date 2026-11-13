import SwiftUI
import WidgetKit

/**
 * The prayer widget, in three sizes.
 *
 * Small makes one promise and keeps it: the next prayer, when, and how long.
 * Medium adds today's six, so the day can be read without opening anything.
 * Large adds the place and the calculation method — because a time nobody can
 * trace to a method is a time that cannot be checked.
 *
 * The countdown is the only thing here that moves, and it moves by being left
 * alone: `Text(date, style: .timer)` is redrawn by the system once a second
 * without a single timeline entry. Everything else changes only when an entry
 * does — that is, at the moment a prayer time actually arrives.
 */
struct PrayerWidget: Widget {

    let kind = "PrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimeline()) { entry in
            PrayerWidgetView(entry: entry)
        }
        .configurationDisplayName("Prayer times")
        .description("The next prayer, and today's schedule.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct PrayerWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: PrayerTimeline.PrayerEntry

    var body: some View {
        Group {
            if let snap = entry.snapshot, !snap.isEmpty {
                content(for: snap)
            } else {
                WidgetEmptyState(message: "Open Islamic to set your location")
            }
        }
        .heroGround()
    }

    @ViewBuilder
    private func content(for snap: DeenWidgetData.Snapshot) -> some View {
        let now = DeenWidgetData.resolveNow(snap, now: entry.date)
        switch family {
        case .systemSmall:
            SmallPrayer(snap: snap, now: now)
        case .systemLarge:
            LargePrayer(snap: snap, now: now)
        default:
            MediumPrayer(snap: snap, now: now)
        }
    }
}

// MARK: - Small

/**
 * Small: the next prayer, the time, and a live countdown.
 *
 * No schedule. Six rows squeezed into 158 points is not a schedule, it is a
 * blur — and the small widget's whole job is to answer one question at a
 * glance.
 */
private struct SmallPrayer: View {
    let snap: DeenWidgetData.Snapshot
    let now: DeenWidgetData.Now

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            DeenTheme.eyebrow("NEXT ·")
            DeenTheme.headline(now.next?.label ?? "—", size: 17)
            Spacer(minLength: 0)
            DeenTheme.bigTime(now.next?.time ?? "—", size: 26)
            if let next = now.next {
                LiveCountdown(to: next.date)
                    .padding(.top, 2)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(14)
    }
}

// MARK: - Medium

/** Medium: the next prayer beside today's six. */
private struct MediumPrayer: View {
    let snap: DeenWidgetData.Snapshot
    let now: DeenWidgetData.Now

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            VStack(alignment: .leading, spacing: 2) {
                DeenTheme.eyebrow("NEXT ·")
                DeenTheme.headline(now.next?.label ?? "—", size: 19)
                Spacer(minLength: 2)
                DeenTheme.bigTime(now.next?.time ?? "—", size: 30)
                if let next = now.next {
                    LiveCountdown(to: next.date)
                        .padding(.top, 4)
                }
                Spacer(minLength: 0)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            ScheduleColumn(snap: snap, now: now, compact: true)
                .frame(width: 118)
        }
        .padding(14)
    }
}

// MARK: - Large

/** Large: the schedule takes the width, and the method gets a line. */
private struct LargePrayer: View {
    let snap: DeenWidgetData.Snapshot
    let now: DeenWidgetData.Now

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            VStack(alignment: .leading, spacing: 2) {
                DeenTheme.eyebrow("NEXT ·")
                DeenTheme.headline(now.next?.label ?? "—", size: 21)
                HStack(alignment: .firstTextBaseline, spacing: 10) {
                    DeenTheme.bigTime(now.next?.time ?? "—", size: 36)
                    if let next = now.next {
                        LiveCountdown(to: next.date)
                    }
                }
            }
            Divider().background(DeenTheme.rule)
            ScheduleColumn(snap: snap, now: now, compact: false)
            Spacer(minLength: 0)
            Footnote(snap: snap)
        }
        .padding(14)
    }
}

// MARK: - Shared parts

/**
 * The countdown, drawn by the system rather than by us.
 *
 * `style: .timer` is the reason this widget needs no per-minute timeline
 * entries: WidgetKit redraws it every second on its own, so the countdown is
 * always live even though the widget's content is not.
 */
private struct LiveCountdown: View {
    let to: Date

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: "clock")
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(DeenTheme.onHero)
            Text(timerInterval: Date()...to, countsDown: true)
                .font(.system(size: 13, weight: .medium))
                .monospacedDigit()
                .foregroundStyle(DeenTheme.onHeroBody)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(DeenTheme.pill, in: Capsule())
    }
}

/**
 * Today's six, with the one that is due marked.
 *
 * Sunrise is listed because the app lists it, but it is never highlighted —
 * it is a time to know, not a prayer that is due.
 */
private struct ScheduleColumn: View {
    let snap: DeenWidgetData.Snapshot
    let now: DeenWidgetData.Now
    let compact: Bool

    var body: some View {
        VStack(spacing: compact ? 2 : 6) {
            ForEach(Array(snap.today.enumerated()), id: \.offset) { _, prayer in
                let isNext = now.next?.name == prayer.name
                let isCurrent = now.current?.name == prayer.name
                HStack {
                    Text(prayer.label)
                        .font(.system(size: compact ? 11 : 13,
                                      weight: isNext || isCurrent ? .semibold : .regular))
                        .foregroundStyle(isNext ? DeenTheme.onHeroBody : DeenTheme.onHeroMuted)
                        .lineLimit(1)
                    Spacer(minLength: 8)
                    Text(prayer.time)
                        .font(.system(size: compact ? 11 : 13,
                                      weight: isNext ? .semibold : .medium,
                                      design: .rounded))
                        .monospacedDigit()
                        .foregroundStyle(isNext ? DeenTheme.onHero : DeenTheme.onHeroMuted)
                        .lineLimit(1)
                }
                /* The row that is due is lifted onto a chip, the way the app's
                   own Prayer screen lifts the current prayer. */
                .padding(.horizontal, isNext ? 6 : 0)
                .padding(.vertical, isNext ? 3 : 0)
                .background(
                    RoundedRectangle(cornerRadius: 8, style: .continuous)
                        .fill(isNext ? DeenTheme.pill : Color.clear)
                )
            }
        }
    }
}

/**
 * Where the times came from.
 *
 * Deliberately the last line and the smallest text in the widget. It is for
 * the person who has checked a time against another source and wants to know
 * why the two disagree — not for anyone glancing at their home screen.
 */
private struct Footnote: View {
    let snap: DeenWidgetData.Snapshot

    var body: some View {
        let parts = [snap.place, snap.method].filter { !$0.isEmpty }
        if !parts.isEmpty {
            Text(parts.joined(separator: " · "))
                .font(.system(size: 10))
                .foregroundStyle(DeenTheme.onHeroMuted)
                .lineLimit(1)
        }
    }
}

/** A widget with nothing to say still has to look deliberate. */
struct WidgetEmptyState: View {
    let message: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            DeenTheme.eyebrow("PRAYER")
            Text(message)
                .font(.system(size: 12))
                .foregroundStyle(DeenTheme.onHeroMuted)
                .lineLimit(2)
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(14)
    }
}
