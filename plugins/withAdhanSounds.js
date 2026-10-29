/**
 * Copies the bundled adhan recordings into the places the operating system
 * looks for a notification sound.
 *
 * A notification cannot play an audio file the app happens to be carrying:
 * Android wants it as a raw resource compiled into the app, iOS wants it in
 * the bundle. Dropping an MP3 into `assets/audio` is not enough, which is why
 * the adhan would silently fall back to the system tone without this.
 *
 * Anything named `adhan-*.mp3` in `assets/audio` is copied. The resource name
 * is the filename with everything but letters and numbers turned into
 * underscores, so `adhan-doha-public-domain.mp3` becomes
 * `adhan_doha_public_domain`. That is the name the notification asks for.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'assets/audio';
const PATTERN = /^adhan-.*\.mp3$/i;

const resourceName = (filename) =>
  filename.replace(/\.mp3$/i, '').replace(/[^a-z0-9]/gi, '_').toLowerCase();

module.exports = function withAdhanSounds(config) {
  return withDangerousMod(config, [
    'android',
    async (c) => {
      const srcDir = path.join(c.modRequest.projectRoot, SOURCE_DIR);
      const rawDir = path.join(
        c.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res', 'raw',
      );
      if (!fs.existsSync(srcDir)) return c;
      const files = fs.readdirSync(srcDir).filter((f) => PATTERN.test(f));
      if (!files.length) return c;

      fs.mkdirSync(rawDir, { recursive: true });
      for (const file of files) {
        fs.copyFileSync(path.join(srcDir, file), path.join(rawDir, `${resourceName(file)}.mp3`));
      }
      console.log(`withAdhanSounds: copied ${files.length} adhan file(s) to res/raw`);
      return c;
    },
  ]);
};

module.exports.resourceName = resourceName;
