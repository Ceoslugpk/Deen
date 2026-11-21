/** Variable-height ayahs must be measured by FlatList. An average is safe
 * only as a coarse scroll destination after onScrollToIndexFailed, never as
 * getItemLayout's supposedly exact row length/offset. */
export type ReaderScrollFailure = {
  index: number;
  highestMeasuredFrameIndex?: number;
  averageItemLength?: number;
};
type ReaderList = {
  scrollToIndex(options: { index: number; viewPosition: number; viewOffset: number; animated: boolean }): void;
  scrollToOffset(options: { offset: number; animated: boolean }): void;
};
export const READER_SCROLL_RETRY_MS = 80;
export const READER_SCROLL_MAX_ATTEMPTS = 96;

/** A bounded, cancellable restoration chase. Without fake exact geometry the
 * list may first need to measure its way to a distant search/bookmark/Continue
 * target. FlatList clamps its unmeasured tail; retrying near that frontier
 * lets the next batch mount without keeping the entire surah on screen. */
export function createMeasuredVerseScroll(options: {
  getList: () => ReaderList | null | undefined;
  getItemCount: () => number;
  schedule?: typeof setTimeout;
  unschedule?: typeof clearTimeout;
}) {
  const schedule = options.schedule || setTimeout;
  const unschedule = options.unschedule || clearTimeout;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let task: { index: number; attempts: number; failed: boolean; refined: boolean } | null = null;
  const valid = (index: number) => Number.isInteger(index) && index >= 0 && index < options.getItemCount();
  const clearTimer = () => { if (timer !== null) { unschedule(timer); timer = null; } };
  const cancel = () => { const pending = task !== null; clearTimer(); task = null; return pending; };
  const queue = (delay: number) => { clearTimer(); timer = schedule(attempt, delay); };
  function attempt() {
    timer = null;
    const current = task, list = options.getList();
    if (!current || !list || !valid(current.index)) { cancel(); return; }
    current.attempts += 1;
    current.failed = false;
    // FlatList calls failed() synchronously when it has no measured frame.
    list.scrollToIndex({ index: current.index, viewPosition: 0, viewOffset: 88, animated: false });
    if (task !== current || current.failed) return;
    // A coarse jump can mount the actual target. Refine once using its newly
    // measured frame; do not run a lingering chain of repeated scrolls.
    if (!current.refined) { current.refined = true; queue(READER_SCROLL_RETRY_MS); }
    else cancel();
  }
  const failed = (info: ReaderScrollFailure) => {
    const current = task;
    if (!current || info.index !== current.index) return;
    current.failed = true;
    if (!valid(current.index) || current.attempts >= READER_SCROLL_MAX_ATTEMPTS) { cancel(); return; }
    const average = Number.isFinite(info.averageItemLength) && info.averageItemLength! > 0 ? info.averageItemLength! : 0;
    options.getList()?.scrollToOffset({ offset: average * current.index, animated: false });
    queue(READER_SCROLL_RETRY_MS);
  };
  return {
    start(index: number) {
      cancel();
      if (!valid(index)) return false;
      task = { index, attempts: 0, failed: false, refined: false };
      queue(120);
      return true;
    },
    failed,
    cancel,
    isPending: () => task !== null,
  };
}
