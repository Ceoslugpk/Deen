/** Native React Native has its own current list scheduler. Its removed
 * InteractionManager API must never be accessed here. Metro selects the
 * web-only implementation for the older scheduler in React Native Web. */
export function configureUiScheduling(): void {}
