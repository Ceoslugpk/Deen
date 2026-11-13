/**
 * The iOS widget extension, described for `@bacons/apple-targets`.
 *
 * Managed Expo generates the iOS project, which normally means anything added
 * to it by hand is lost on the next prebuild. A widget cannot be written in
 * React Native, and an extension target cannot be added from JavaScript — so
 * this file is the bridge: it tells the plugin to generate a real WidgetKit
 * extension, from these sources, with these entitlements, on every prebuild.
 *
 * `appleTeamId` is read from the environment because it is the one value here
 * that is neither app nor target but account. Set EXPO_APPLE_TEAM_ID in your
 * shell or in EAS secrets; without it the target is signed with a development
 * team the App Store will reject.
 */
module.exports = {
  type: 'widget',
  /* Required for the extension to be signed. Read from the environment
     because it belongs to the account, not to the app or the target: set
     EXPO_APPLE_TEAM_ID in your shell, or as an EAS secret. */
  appleTeamId: process.env.EXPO_APPLE_TEAM_ID,
  name: 'DeenWidgets',
  // What the widget picker and the Home Screen show.
  displayName: 'Islamic',
  // Reverse-DNS under the app's own bundle id, so provisioning is inherited.
  bundleIdentifier: 'com.qashi.islamic.widgets',
  deploymentTarget: '16.1',
  // Widgets are drawn by the system; they need no storyboard and no scenes.
  // `NSExtension` is filled in from `type: 'widget'` by the plugin.
  entitlements: {
    'com.apple.security.application-groups': ['group.com.qashi.islamic'],
  },
  // The sources. Everything in Sources/ is compiled into the extension.
  // `PrayerActivityAttributes.swift` is deliberately here *and* copied into
  // the app by plugins/widgets/withWidgets.js, because both targets must
  // build the same attributes type.
  frameworks: ['WidgetKit', 'SwiftUI', 'ActivityKit'],
  // Widgets must not be excluded from the app's own devices.
  // (No `excludedArchitectures`: the extension ships everywhere the app does.)
};
