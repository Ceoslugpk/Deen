/**
 * A queue that runs one pass at a time, keeping only the newest pending one.
 *
 * Rebuilding a schedule is a cancel-then-create operation, which is only safe
 * when nothing else is doing it at the same moment. Two overlapping passes
 * interleave as cancel, cancel, create, create — and the second set is laid
 * down after the cancel it was supposed to replace, so the device ends up
 * holding both. That is how a phone came to deliver two of every reminder and
 * three of every adhan.
 *
 * So passes are serialised. And they are coalesced rather than merely queued:
 * when several have piled up, only the newest is run, because it carries the
 * most recent settings and running the ones behind it would only redo work
 * whose result is about to be thrown away. Every caller still gets a result —
 * the result of the pass that actually ran — so nobody is left waiting on a
 * promise that never settles.
 *
 * Nothing here knows what a schedule is. It is a queue that runs one thing at
 * a time and keeps the last of anything that arrived in the meantime.
 */
export function createSerialQueue<T>() {
  let running = false;
  const waiting: {
    run: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
  }[] = [];

  async function drain() {
    if (running) return;
    running = true;
    try {
      while (waiting.length) {
        /* Taken as a batch so that everything which arrived while the last
           pass was running is answered by the one that follows it. */
        const batch = waiting.splice(0, waiting.length);
        const newest = batch[batch.length - 1];
        try {
          const result = await newest.run();
          for (const entry of batch) entry.resolve(result);
        } catch (error) {
          for (const entry of batch) entry.reject(error);
        }
      }
    } finally {
      running = false;
    }
  }

  return function enqueue(run: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      waiting.push({ run, resolve, reject });
      void drain();
    });
  };
}
