# Web Quran reader stops at 12 ayahs with normal motion — R107

## What the follow-up exposed

The user's report was correct. Vercel's production alias was already serving R106 (`b773197a5dea9f0ebd0643c2f681813737c5d368`), so this was **not dismissed as an outdated deployment or corrupt user data**.

The live site was tested using real wheel input from a cold reader:

- With reduced motion, Ar-Rahman could reach ayah 78.
- With **normal motion**, the same deployed bundle stopped at exactly **12 mounted ayahs**, with the viewport at the end of that first batch. The committed regression reproduced this against the public production URL.
- R106 correctly removed the false fixed row geometry, but its scan profiles all used reduced motion. That left this second scheduling failure untested. R106's historical reports and screenshots remain unchanged; its completion claim was incomplete for normal-motion web use.

## Cause and correction

Two things must be addressed together:

1. **Repeating decorative animations cannot count as user interactions.** The globally mounted skeleton shimmer, hero drift and player aura now explicitly use `isInteraction: false` for every repeating step. The shimmer's 420ms hold is preserved without `Animated.delay`'s default interaction handle. No visual animation, artwork, timing or reduced-motion choice was removed.
2. **A busy animated web page must not wait forever for an idle callback before rendering more rows.** The web-only scheduler uses React Native Web's public `InteractionManager.setDeadline(8)` option. This schedules deferred batches through bounded timers with an eight-millisecond yield budget rather than relying on an unbounded idle-frame opportunity. Actual interactions are still respected.

An intermediate diagnostic confirmed why changing animation flags alone was insufficient: after returning to the Quran list and opening Al-Baqarah, all 286 items existed and the first 12 rows were measured, but deferred work remained queued even with no active interaction handles. A diagnostic queue flush released the next batch. That diagnostic instrumentation is **not** part of the app or the final tests.

`uiScheduling.web.ts` is selected only for web. Native uses a no-op `uiScheduling.ts`; it never accesses the InteractionManager API removed from React Native 0.88. The normal reader component, measured restoration logic, seven-screen virtualization window, 12 initial rows and eight-row rendering batches are unchanged. This does **not** increase the initial batch to 286 or disable virtualization.

## Corrected regression coverage

The current browser runner defaults to **normal motion** and scrolls with real wheel input, not programmatic offsets. A separate reduced-motion control remains. It waits for actual surah content before beginning the scan and retains strict stopped-tail, blank-window and complete-text assertions.

| Current production-web export check | Result |
| --- | --- |
| English phone, normal motion | Ar-Rahman **78/78**, Al-Baqarah **286/286** visibly traversed |
| Urdu RTL, 36px Arabic, normal motion | Ar-Rahman **78/78** |
| Large-screen, 44px Arabic, continuous mode, normal motion | Ar-Rahman **78/78** |
| Separate reduced-motion phone control | Ar-Rahman **78/78** |
| Total | **598 ayahs visibly traversed**, five full walks, **473 viewport samples**, four fresh contexts |
| Text integrity | Full rendered Arabic compared against unmodified live script responses |
| Distant jumps | **2:156, 2:255, 2:282 and 2:286** reached their visible controls with normal motion |
| Continue Reading | Marked 2:156, left, used Continue Reading and returned to that ayah |
| Fast flick / rotation | Settled on rendered ayahs |
| Rendering bounds | Maximum simultaneously mounted rows **34 / 28 / 34 / 48 / 34**, not entire long surahs |
| Runtime errors | Empty page, console, HTTP and failed-request arrays in all four passing scan contexts |
| Existing data | Notes, separate IndoPak reading point/bookmarks and audio preferences remained byte-identical |
| Unit/regression suite | **274/274 passed**, including seven new animation/scheduler guards |
| TypeScript / production web export | Passed |

[Machine-readable evidence, source hashes and rollout checks](quran-normal-motion-r107.json) distinguish the live before state, intermediate diagnostic, passing final export and post-push verification.

## Actual screenshots

[Open the self-contained offline gallery](quran-normal-motion-r107-gallery.html).

- [Before: live site stopped at ayah 12 with normal motion](screenshots/reader-motion-before-r107.png)
- [After: Ar-Rahman through ayah 78 with normal motion](screenshots/reader-motion-55-end-r107.png)
- [After: Al-Baqarah through ayah 286 with normal motion](screenshots/reader-motion-2-end-r107.png)
- [After: Urdu RTL through ayah 78 with normal motion](screenshots/reader-motion-ur-end-r107.png)

All captures are unaltered running production-web / Chromium screenshots, not generated artwork or installed-device captures. The before capture comes from the actual public Vercel alias; the initial after captures come from the tested production export. Rollout verification records the live bundle separately.

## Reproduction

```sh
NODE=node_modules/node/bin/node
"$NODE" --test tests/ambient-list-rendering.test.cjs

# Normal animations are ON by default; the runner also covers reduced motion.
READER_URL=http://127.0.0.1:8116 \
READER_ARTIFACTS_DIR=/tmp/islamic-r107-reader \
  "$NODE" tests/verify-quran-reader-web.cjs
```

The local address is a test-runner URL, not an application API destination. Installed Android/iOS rendering and device performance remain physical-device QA; browser fixtures and exports do not establish them. No account, contact access, dependencies, data reset, app-store submission, project-setting/domain changes, Tajweed or Mufahras work is part of this correction.
