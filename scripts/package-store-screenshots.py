#!/usr/bin/env python3
"""Validate live captures and package original-size RGB JPEGs for store listing use."""
import argparse
import csv
import hashlib
import io
import json
from pathlib import Path
import zipfile

from PIL import Image, ImageStat

SCREENS = {
    '01-home-light.png': 'Home in light mode with the next prayer in Dubai and daily remembrance.',
    '02-prayer-times.png': 'Prayer timetable for Dubai with the next prayer countdown and daily prayer tracking.',
    '03-quran-home.png': 'Quran library with reading, recitation, study tools and reading preferences.',
    '04-quran-reader.png': 'Surah Ar-Rahman with Arabic verses, English translation and verse actions.',
    '05-library.png': 'Library of hadith, names, duas, remembrance and step-by-step worship guides.',
    '06-tools.png': 'Prayer, fasting, Zakat and other private trackers and calculators.',
    '07-tasbih.png': 'Private dhikr counter with remembrance phrases, a counting ring and daily totals.',
    '08-home-dark.png': 'Home in dark mode with the next prayer in Dubai and daily remembrance.',
}
EXPECTED = {
    'tablet-7-inch': (1440, 2560),
    'tablet-10-inch': (1800, 3200),
    'foldable-unfolded': (1840, 2208),
}
ROOT = 'Islamic-tablet-foldable-screenshots'
README = """ISLAMIC - TABLET AND UNFOLDED FOLDABLE SCREENSHOTS

24 screenshots: 8 per folder, ordered 01-08.

  tablet-7-inch/       1440 x 2560 pixels, portrait 9:16
  tablet-10-inch/      1800 x 3200 pixels, portrait 9:16
  foldable-unfolded/   1840 x 2208 pixels, unfolded 5:6

Each set contains Home (light), Prayer times, Quran home, Quran reader,
Library, Tools, Tasbih and Home (dark).

IMAGE FORMAT
RGB JPEG, quality 95, 4:4:4 chroma, no transparency, under 8 MB each.
Captured at these pixel dimensions; not upscaled or resized phone images.
There are no device frames, marketing overlays or altered UI layouts.

IMPORTANT - CAPTURE METHOD
These are real captures of the running Expo WEB BUILD in Playwright Chromium,
using independently rendered tablet-sized and unfolded-foldable viewports.
They are NOT native Android device or Android emulator screenshots.
Physical diagonal size is not encoded in an image: the inch labels identify
intended listing categories, not a claim that a physical device was used.

The browser used English, Dubai and the Islamic theme. It ran in a fresh,
isolated browser profile. Only onboarding, location and language preferences
were seeded; no personal progress or content API responses were fabricated.
The demonstration clock started at 26 October 2026, 10:10 Dubai time.
All scripture and other content was displayed by the app itself.

Native Android rendering, sensor availability and fold/hinge transitions
are NOT validated by these images. Check the built Android app before using
these as final store-listing evidence for native device support.

UPLOAD NOTES
Unzip first, then select the 8 images in the matching tablet folder in
Play Console. The tablet sets use portrait 9:16 at high resolution.
The foldable set retains the unfolded 5:6 viewport: do not stretch it to fit
a slot that demands 9:16. Use the portrait tablet set for such a slot.

screenshots.csv contains filenames, dimensions and suggested alt text.
capture-manifest.json contains source commit, viewport details, checksums,
image checks and the text used to verify each active screen before capture.

Google's preview asset guidance:
https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, default=Path('/tmp/islamic-store-screenshots'))
    parser.add_argument('--output', type=Path, default=Path('docs/store-assets/Islamic-tablet-foldable-screenshots.zip'))
    args = parser.parse_args()
    report = json.loads((args.input / 'capture-report.json').read_text())
    assert {p['folder'] for p in report['profiles']} == set(EXPECTED), 'All three profiles must be captured'
    manifest = {key: value for key, value in report.items() if key != 'profiles'}
    manifest['encoding'] = 'RGB JPEG, quality 95, 4:4:4, original dimensions, no alpha'
    manifest['profiles'] = []
    rows = []
    payloads = {}
    pixel_hashes = set()
    for profile in report['profiles']:
        folder = profile['folder']
        captures = profile['screenshots']
        assert len(captures) == 8, f'{folder}: exactly 8 captures required'
        assert {Path(c['file']).name for c in captures} == set(SCREENS), f'{folder}: unexpected or missing screen'
        assert not any(profile['errors'].values()), f'{folder}: capture errors must be resolved'
        packaged_profile = {key: value for key, value in profile.items() if key != 'screenshots'}
        packaged_profile['screenshots'] = []
        brightness = {}
        for capture in captures:
            original = args.input / capture['file']
            with Image.open(original) as image:
                image = image.convert('RGB')
                width, height = image.size
                assert image.size == EXPECTED[folder], f'{original}: unexpected dimensions'
                assert min(width, height) >= 1080 and max(width, height) <= 3840
                assert max(width, height) <= 2 * min(width, height)
                if folder.startswith('tablet-'):
                    assert width * 16 == height * 9, f'{original}: tablet images must be portrait 9:16'
                pixel_hash = hashlib.sha256(image.tobytes()).hexdigest()
                assert pixel_hash not in pixel_hashes, f'{original}: duplicate capture'
                pixel_hashes.add(pixel_hash)
                stat = ImageStat.Stat(image.convert('L'))
                assert stat.stddev[0] > 12, f'{original}: blank or near-blank capture'
                brightness[original.name] = stat.mean[0]
                output = io.BytesIO()
                image.save(output, format='JPEG', quality=95, subsampling=0, optimize=True)
            data = output.getvalue()
            assert len(data) < 8_000_000, f'{original}: exceeds image size limit'
            with Image.open(io.BytesIO(data)) as check:
                check.load()
                assert check.mode == 'RGB' and check.size == (width, height)
                assert check.format == 'JPEG'
                assert check.layer and all(layer[1:3] == (1, 1) for layer in check.layer), '4:4:4 sampling required'
            relative = f'{folder}/{original.stem}.jpg'
            payloads[f'{ROOT}/{relative}'] = data
            alt = SCREENS[original.name]
            assert len(alt) <= 140
            rows.append([relative, width, height, len(data), alt])
            packaged_profile['screenshots'].append({
                'file': relative, 'width': width, 'height': height, 'bytes': len(data),
                'sha256': hashlib.sha256(data).hexdigest(), 'altText': alt,
                'verifiedOnScreenText': capture['requiredText'],
                'meanLuminance': round(stat.mean[0], 2),
                'luminanceStdDev': round(stat.stddev[0], 2),
            })
        assert brightness['08-home-dark.png'] < 100
        assert brightness['08-home-dark.png'] < brightness['01-home-light.png'] * 0.65
        manifest['profiles'].append(packaged_profile)

    assert len(payloads) == 24 and len(pixel_hashes) == 24
    csv_buffer = io.StringIO(newline='')
    writer = csv.writer(csv_buffer)
    writer.writerow(['file', 'width_px', 'height_px', 'bytes', 'suggested_alt_text'])
    writer.writerows(rows)
    payloads[f'{ROOT}/README.txt'] = README.encode('utf-8')
    payloads[f'{ROOT}/screenshots.csv'] = csv_buffer.getvalue().encode('utf-8')
    payloads[f'{ROOT}/capture-manifest.json'] = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode('utf-8')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(payloads.items()):
            archive.writestr(name, data)
    with zipfile.ZipFile(args.output) as archive:
        assert archive.testzip() is None, 'ZIP integrity check failed'
        assert len(archive.namelist()) == 27
        for name, data in payloads.items():
            assert hashlib.sha256(archive.read(name)).digest() == hashlib.sha256(data).digest()
    print(f'Created {args.output} ({args.output.stat().st_size / 1024**2:.2f} MiB)')
    print('Validated: 24 distinct images, 8 per category; all expected screen text confirmed.')
    print('Validated: original dimensions, RGB, 4:4:4 JPEG, no alpha, <8 MB/image, tablet 9:16.')
    print('Validated: dark-mode luminance, no blank images, capture errors empty, ZIP checksums and CRC.')


if __name__ == '__main__':
    main()
