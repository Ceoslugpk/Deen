import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A record of the notifications the app has sent you.
 *
 * The system does not keep a history — once a notification is dismissed it is
 * gone, and there is nothing to look back through. This keeps one.
 *
 * Two honest limits, because they change what this screen can claim:
 *
 *   1. Entries are written when a notification is *scheduled*, not when it
 *      fires. The system delivers it whether or not the app is running, and on
 *      a backgrounded app there is no callback to observe that moment. So an
 *      entry means "this was sent", not "this was seen".
 *   2. While the app *is* open, delivery and taps are observed directly and the
 *      entry is marked, so those two states are real rather than inferred.
 *
 * Anything scheduled for the future is replaced every time reminders are
 * re-scheduled: cancel and re-arm, and you should not end up with three copies
 * of tomorrow's Fajr. What has already fired is never touched.
 */

const KEY = '@deen/notifications/log/v1';

/** Enough to look back over months; an entry is a few hundred bytes. */
const MAX_ENTRIES = 500;

/** How near an entry has to be before a delivery is matched to it. */
const MATCH_WINDOW_MS = 6 * 60 * 60 * 1000;

export type NotificationKind =
  | 'adhan'
  | 'pre-adhan'
  | 'continue'
  | 'verse'
  | 'hadith'
  | 'sleep'
  | 'quran'
  | 'test';

export type NotificationRecord = {
  id: string;
  kind: string;
  title: string;
  body: string;
  prayer?: string;
  /** When the notification was due, epoch milliseconds. */
  fireAt: number;
  /** When the app wrote the entry down, epoch milliseconds. */
  loggedAt: number;
  /** Set only when delivery was actually observed (app in the foreground). */
  deliveredAt?: number;
  /** Set when it was tapped. */
  openedAt?: number;
};

export type PendingEntry = {
  kind: string;
  title: string;
  body: string;
  prayer?: string;
  fireAt: number;
};

let cache: NotificationRecord[] | null = null;

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadNotificationLog(): Promise<NotificationRecord[]> {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? (parsed as NotificationRecord[]) : [];
  } catch {
    cache = [];
  }
  return cache as NotificationRecord[];
}

async function persist(next: NotificationRecord[]) {
  const trimmed = next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
  cache = trimmed;
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* A history that cannot be saved is not worth failing a screen over. */
  }
}

/**
 * Store what has just been scheduled. Entries still in the future are replaced
 * wholesale, so re-arming does not stack duplicates; anything already past is
 * kept as it is.
 */
export async function recordScheduled(entries: PendingEntry[], at = Date.now()) {
  const existing = await loadNotificationLog();
  const past = existing.filter((entry) => entry.fireAt <= at);
  const future = entries
    .filter((entry) => Number.isFinite(entry.fireAt))
    .map((entry) => ({
      id: newId(),
      kind: entry.kind,
      title: entry.title,
      body: entry.body || '',
      prayer: entry.prayer,
      fireAt: entry.fireAt,
      loggedAt: at,
    }));
  await persist([...past, ...future].sort((a, b) => a.fireAt - b.fireAt));
}

/**
 * Mark the entry this notification belongs to as delivered, or add it if it
 * arrived without having been scheduled — a test notification, for instance.
 */
export async function markDelivered(
  content: { title?: string | null; body?: string | null; data?: Record<string, unknown> },
  at = Date.now(),
) {
  const log = await loadNotificationLog();
  const kind = (content.data?.kind as string) || '';
  const prayer = content.data?.prayer as string | undefined;

  const match = [...log]
    .reverse()
    .find(
      (entry) =>
        entry.fireAt <= at &&
        at - entry.fireAt < MATCH_WINDOW_MS &&
        !entry.deliveredAt &&
        (entry.kind === kind || (!kind && entry.title === content.title)),
    );

  if (match) {
    match.deliveredAt = at;
    await persist(log);
    return;
  }

  await persist([
    ...log,
    {
      id: newId(),
      kind: kind || 'test',
      title: content.title || '',
      body: content.body || '',
      prayer,
      fireAt: at,
      loggedAt: at,
      deliveredAt: at,
    },
  ]);
}

export async function markOpened(
  content: { title?: string | null; data?: Record<string, unknown> },
  at = Date.now(),
) {
  const log = await loadNotificationLog();
  const kind = (content.data?.kind as string) || '';
  const match = [...log].reverse().find((entry) => entry.kind === kind && entry.fireAt <= at);
  if (!match) return;
  match.openedAt = at;
  await persist(log);
}

export async function clearNotificationLog() {
  cache = [];
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Newest first — the order an inbox is read in. */
export function newestFirst(log: NotificationRecord[]): NotificationRecord[] {
  return [...log].sort((a, b) => b.fireAt - a.fireAt);
}
