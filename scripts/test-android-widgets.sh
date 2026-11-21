#!/usr/bin/env bash
# Compiles real production widgets, NOT a full Expo or Play release build.
# Running JUnit only after Gradle exits avoids overlapping Android/build JVMs.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HARNESS="$ROOT/tests/android-widgets"
GRADLE="${GRADLE:-gradle}"
JAVA="${JAVA_HOME:+$JAVA_HOME/bin/}java"
# /tmp can be a small RAM disk. Keep large Robolectric downloads/native
# extraction on ordinary disk, outside the persisted repository snapshot.
SCRATCH="${WIDGET_TEST_TMPDIR:-${XDG_CACHE_HOME:-$HOME/.cache}/islamic-widget-tests/tmp}"
mkdir -p "$SCRATCH"
export JAVA_TOOL_OPTIONS="${JAVA_TOOL_OPTIONS:-} -XX:ActiveProcessorCount=2 -Djava.io.tmpdir=\"$SCRATCH\""
"$GRADLE" --no-daemon --console=plain -p "$HARNESS" exportDebugUnitTestClasspath
cd "$HARNESS"
"$JAVA" -Xmx256m -XX:MaxMetaspaceSize=192m -XX:ActiveProcessorCount=2 -Xss512k \
  -Drobolectric.dependency.repo.url=https://repo.maven.apache.org/maven2 \
  -cp "$(cat .gradle/widget-test-classpath.txt)" \
  org.junit.runner.JUnitCore com.deen.widgets.WidgetNativeTest
