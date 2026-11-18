# Tablet and unfolded-foldable screenshot pack

[Download the ZIP](Islamic-tablet-foldable-screenshots.zip) — **24 screenshots, 8 per category**.

| Folder inside the ZIP | Rendered viewport (CSS px) | Export size (px) | Shape |
| --- | --- | --- | --- |
| `tablet-7-inch/` | 720 × 1280 at 2× | **1440 × 2560** | Portrait, 9:16 |
| `tablet-10-inch/` | 900 × 1600 at 2× | **1800 × 3200** | Portrait, 9:16 |
| `foldable-unfolded/` | 920 × 1104 at 2× | **1840 × 2208** | Unfolded, 5:6 |

Each folder contains the same sequence:

1. Home, light mode
2. Prayer times
3. Qur'an home
4. Qur'an reader — Surah Ar-Rahman, Arabic and English
5. Library
6. Tools
7. Tasbih
8. Home, dark mode

The archive also contains `README.txt`, `screenshots.csv` with suggested alt text,
and `capture-manifest.json` with dimensions, checksums, viewport details, source
commit and the text used to verify the active screen before each capture.

## Capture method and limitations

These are **real captures of the running Expo web build**, independently rendered at
three large-screen viewports with Playwright Chromium. They are **not native Android
device or Android emulator screenshots**. The inch labels identify intended listing
categories; an image does not encode the physical diagonal of a screen.

- No resized phone images, synthetic mockups, device frames or marketing overlays.
- No application UI or layout changes were made for the captures.
- Images retain their captured pixel dimensions, encoded as RGB JPEG at quality 95
  with 4:4:4 sampling and no transparency. Each image is under 8 MB.
- A fresh browser profile used English, Dubai, the Islamic theme and a demonstration
  clock starting at **26 October 2026, 10:10, Asia/Dubai**. Only setup preferences
  were seeded; no personal progress or API content was fabricated.
- Fonts, artwork, scripture and other content were rendered by the app itself.
- Native Android rendering, sensors, split-screen behavior and fold/hinge transitions
  are **not validated** by these images. Check them against the Android release build
  before publishing them as final store-listing assets.

The tablet sets use the portrait **9:16** shape in Google's large-screen screenshot
guidance. The optional foldable set preserves its wider **5:6** unfolded viewport;
do not stretch it to fit a slot that requires 9:16. Use the tablet portrait exports
for such slots.

Official guidance: [Add preview assets to showcase your app](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en).

## Reproduce

Install the project's npm dependencies, Playwright Chromium and Python Pillow first.
From the repository root, export the web build:

```sh
CI=1 npx expo export --platform web --output-dir /tmp/islamic-store-export
```

Serve that export in a separate terminal:

```sh
python3 -m http.server 8100 --bind 0.0.0.0 --directory /tmp/islamic-store-export
```

Capture and package:

```sh
SCREENSHOT_URL=http://127.0.0.1:8100 \
SCREENSHOT_TIME=2026-10-26T10:10:00+04:00 \
node scripts/capture-store-screenshots.cjs

python3 scripts/package-store-screenshots.py
```

The browser's clock continues to advance normally so the app's transitions finish.
Raw PNG captures and the detailed capture report stay in the OS temporary directory;
only the ZIP is kept here, avoiding duplicate copies of large image sets.

The capture checks the **painted, active screen**, not hidden screens kept mounted by
the navigator. Packaging verifies all 24 images are distinct, the expected text was
visible, dimensions and image modes are correct, dark mode is dark, captures are not
blank, no page/console/HTTP/request errors were recorded, and ZIP CRCs and checksums
match after reading the archive back.
