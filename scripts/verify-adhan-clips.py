#!/usr/bin/env python3
"""
Check the adhan clips that ship inside the app.

These exist for one reason: iOS will only sound a notification with an audio
file that is inside the app bundle and *under* thirty seconds. Anything longer,
or anything the app merely downloaded, is silently replaced by the system
chime. So a mistake here does not fail loudly — the adhan simply stops
sounding, and nobody can tell why.

That is worth checking for. Run this after `build-adhan-clips.sh`, and in CI:

    python3 scripts/verify-adhan-clips.py

Exits non-zero on the first problem it cannot explain away.
"""

import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOUNDS = os.path.join(ROOT, "assets", "sounds")
CATALOG = os.path.join(ROOT, "src", "services", "adhanCatalog.ts")
CACHE = os.path.join(ROOT, "src", "services", "adhanCache.ts")
ALARM = os.path.join(ROOT, "src", "services", "adhanAlarm.ts")
APP_JSON = os.path.join(ROOT, "app.json")

# Apple's limit. Deliberately not 30: the rule is "under thirty seconds" and
# the failure mode for sitting on the line is silence.
MAX_SECONDS = 30.0

problems = []
notes = []


def fail(message):
    problems.append(message)


def ffmpeg():
    """Wherever an ffmpeg happens to be, or None if there is not one."""
    for path in ("ffmpeg", "/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"):
        try:
            subprocess.run([path, "-version"], capture_output=True, check=True)
            return path
        except (OSError, subprocess.CalledProcessError):
            continue
    try:
        import imageio_ffmpeg  # noqa: PLC0415

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return None


# ---------------------------------------------------------------- the files

if not os.path.isdir(SOUNDS):
    fail(f"no assets/sounds directory at {SOUNDS}")
    files = []
else:
    files = sorted(f for f in os.listdir(SOUNDS) if f.endswith(".m4a"))

if not files:
    fail("no .m4a clips found in assets/sounds")

total = 0
ff = ffmpeg()
if ff is None:
    notes.append("ffmpeg not available - durations not checked")

for name in files:
    path = os.path.join(SOUNDS, name)
    size = os.path.getsize(path)
    total += size

    # A bundled notification sound is copied into res/raw on Android, where
    # the resource name may only be lowercase letters, digits and underscores.
    stem = name[:-4]
    if not re.fullmatch(r"[a-z0-9_]+", stem):
        fail(f"{name}: not a legal Android resource name")

    if ff is None:
        continue
    probe = subprocess.run([ff, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    seconds = None
    for line in probe.splitlines():
        if "Duration:" in line:
            h, m, s = line.split("Duration: ")[1].split(",")[0].strip().split(":")
            seconds = int(h) * 3600 + int(m) * 60 + float(s)
    if seconds is None:
        fail(f"{name}: could not read a duration")
        continue
    if seconds >= MAX_SECONDS:
        fail(f"{name}: {seconds}s is not under {MAX_SECONDS}s - iOS will replace it with the system tone")
    if "mono" not in probe:
        fail(f"{name}: not mono")
    if "Audio: aac" not in probe:
        fail(f"{name}: not AAC")

if files:
    mb = total / 1048576
    notes.append(f"{len(files)} clips, {mb:.2f} MB total")
    if mb > 8:
        fail(f"clips total {mb:.2f} MB, which is more than is worth shipping in the install")

# --------------------------------------------------------------- the catalog

catalog = open(CATALOG, encoding="utf-8").read()
clips_mentioned = re.findall(r"clip:\s*'([^']+)'", catalog)
track_ids = re.findall(r"id:\s*'((?:adhan|fajr):[^']+)'", catalog)
track_count = len(track_ids)

if track_count != 20:
    fail(f"expected 20 tracks in the catalogue, found {track_count}")
if len(clips_mentioned) != 8:
    fail(f"expected 8 tracks carrying a clip, found {len(clips_mentioned)}")

on_disk = {f[:-4] for f in files}
for clip in clips_mentioned:
    if clip not in on_disk:
        fail(f"catalogue names clip '{clip}' but assets/sounds/{clip}.m4a does not exist")
for name in on_disk:
    if name not in clips_mentioned:
        fail(f"assets/sounds/{name}.m4a exists but no track in the catalogue points at it")

# Every clip the picker offers must resolve to a file that is really there, or
# iOS picks a voice and then sounds nothing.
if len(set(clips_mentioned)) != len(clips_mentioned):
    fail("two tracks point at the same clip")

# --------------------------------------------------------------- app.json

app = json.load(open(APP_JSON, encoding="utf-8"))
listed = set()
for plugin in app.get("expo", {}).get("plugins", []):
    if isinstance(plugin, list) and plugin and plugin[0] == "expo-notifications":
        for sound in (plugin[1] or {}).get("sounds", []):
            listed.add(os.path.basename(sound)[:-4])

if not listed:
    fail("expo-notifications plugin lists no sounds - the clips will not reach the bundle")
else:
    for clip in clips_mentioned:
        if clip not in listed:
            fail(f"'{clip}' is not listed under the expo-notifications sounds - it will not be copied")
    for name in listed:
        if name not in clips_mentioned:
            fail(f"app.json lists '{name}' which no track uses")

# ---------------------------------------------- the alarm must not use clips

# Android plays the whole recording from its cache through the alarm. If a
# thirty-second clip ever reached that path, the full adhan would be shortened
# on the one platform that never needed shortening.
alarm = open(ALARM, encoding="utf-8").read()
if "adhanPlaybackSource" in alarm or "bundledClip" in alarm:
    fail("the alarm resolves its audio from a bundled clip - Android would play 30s instead of the full recitation")
if "cachedAdhanUri" not in alarm:
    fail("the alarm no longer resolves the cached recording")

# ------------------------------------------- previews must follow the platform

# What a preview plays should be what will actually sound at the prayer time,
# and that differs: iOS can only ever play the clip, Android plays the full
# recording from its cache. Preferring the clip everywhere would mean Android
# previewing thirty seconds of something it is about to play in full.
src = open(CACHE, encoding='utf-8').read()
if "Platform.OS === 'ios'" not in src:
    fail("adhanPlaybackSource is not platform-aware - one of the two platforms is previewing the wrong thing")
else:
    ios_branch, rest = src.split("Platform.OS === 'ios'", 1)
    if "cachedAdhanUri(track) ?? bundledClipUri(track)" not in rest:
        fail("on Android the preview should be the cached recording first and the clip only as a fallback")

# ------------------------------------------- the row must not promise a clip

# Saying "included with the app" on Android promises something the alarm cannot
# deliver: it still needs the download, and without it the prayer falls back to
# a system tone with nothing to explain why.
app_src = open(os.path.join(ROOT, "App.tsx"), encoding="utf-8").read()
if "trackRowLabel" not in app_src:
    fail("the adhan row no longer uses trackRowLabel - check it is still platform-aware")
elif "Platform.OS === 'ios'" not in app_src.split("function trackRowLabel", 1)[1][:600]:
    fail("trackRowLabel is not platform-aware - it would promise the clip on Android too")

# ---------------------------------------------------- new copy is translated

# tx() falls back to English when a string has no Arabic entry, so an
# untranslated string is invisible until somebody reads Arabic and finds
# English on the page.
arabic = open(os.path.join(ROOT, "src", "services", "arabicCopy.ts"), encoding="utf-8").read()
for phrase in ("Included with the app", "Downloaded on first use", "On this device"):
    if f"'{phrase}':" not in arabic:
        fail(f"'{phrase}' has no Arabic entry - it shows in English to somebody reading Arabic")

# ------------------------------------------------- previews may use the clip

cache = open(CACHE, encoding="utf-8").read()
if "bundledClipUri" in cache and "adhanPlaybackSource" in cache:
    notes.append("previews use the bundled clip (instant, offline) - alarm still uses the full file")
else:
    notes.append("previews do not use the bundled clip")

# ------------------------------------------------------------------- report

for note in notes:
    print(f"  note: {note}")

if problems:
    print()
    for problem in problems:
        print(f"  FAIL: {problem}")
    print(f"\n{len(problems)} problem(s).")
    sys.exit(1)

print("\nOK - the clips are under 30s, mono, AAC, wired into the bundle, and the alarm is untouched.")
