/** A busy animated page can indefinitely starve requestIdleCallback. RN Web's
 * public deadline option schedules its deferred list batches with a bounded
 * timer instead, while retaining an eight-millisecond yield budget. Real
 * interactions are still respected; decorative loops must be non-interactive.
 * Keep this web-only: React Native 0.88 removed InteractionManager entirely. */
export const WEB_INTERACTION_BUDGET_MS = 8;

export function configureUiScheduling(): void {
  const { InteractionManager } = require('react-native-web') as {
    InteractionManager: { setDeadline: (budgetMs: number) => void };
  };
  InteractionManager.setDeadline(WEB_INTERACTION_BUDGET_MS);
}
