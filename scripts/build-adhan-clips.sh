#!/usr/bin/env bash
#
# Rebuild the adhan clips that ship inside the app.
#
# They exist because iOS will only sound a notification with an audio file
# that is inside the app bundle and under thirty seconds. Anything
# longer, or anything downloaded to the documents directory, is ignored and
# the system plays its own tone instead. So these eight recordings are the
# ones that can sound at prayer time on a phone.
#
# Android is unaffected either way: it plays the whole recording from the
# cache, through the alarm, so every track in the catalogue still works there
# at full length.
#
# Requires ffmpeg on PATH. Run from the project root:
#
#     ./scripts/build-adhan-clips.sh
#
set -euo pipefail

BASE="https://audio.islamicdata.uz/v1"
OUT="assets/sounds"
WORK="$(mktemp -d)"
# 29.5, not 30. Apple's rule is that a custom notification sound must be
# *under* thirty seconds, and what happens when it is not is the sound being
# silently replaced by the system tone - which is the exact failure these
# clips exist to prevent. Sitting on the limit is a bet on how the system
# rounds; half a second of silence at the end is not worth that bet. The fade
# ends with the clip rather than being cut off by it.
LENGTH=29.5
FADE_START=27.5
FADE_LEN=2

# kind, edition, output name
TRACKS=(
  "adhan mishary-rashid-alafasy          adhan_mishary"
  "adhan mansour-al-zahrani              adhan_mansour"
  "adhan hafiz-mustafa-ozcan-from-turkey adhan_ozcan"
  "adhan ahmad-al-nafees                 adhan_nafees"
  "adhan abdul-basit                     adhan_abdulbasit"
  "adhan minshawi                        adhan_minshawi"
  "fajr  mansour-al-zahrani              fajr_mansour"
  "fajr  traditional                     fajr_traditional"
)

mkdir -p "$OUT"

for entry in "${TRACKS[@]}"; do
  read -r kind edition name <<< "$entry"
  src="$WORK/$name.mp3"
  echo "fetching $name"
  curl -sSf --max-time 180 -o "$src" "$BASE/$kind/editions/$edition/audio"

  # -map 0:a:0 drops any embedded cover art, which some editions carry and
  # which otherwise makes ffmpeg try to write a video track into the .m4a.
  ffmpeg -y -v error -i "$src" \
    -map 0:a:0 \
    -t "$LENGTH" \
    -af "afade=t=out:st=$FADE_START:d=$FADE_LEN" \
    -ac 1 -ar 44100 -b:a 64k -c:a aac -movflags +faststart \
    "$OUT/$name.m4a"
done

echo
echo "written to $OUT:"
du -sh "$OUT"
ls -l "$OUT"

rm -rf "$WORK"
