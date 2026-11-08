/* eslint-disable */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/*
 * Write Arabic as Arabic.
 *
 * The minifier is asked to reduce the bundle to ASCII, which turns every
 * Arabic letter into a six-byte \uXXXX escape — three times the size of the
 * letter it replaces, and most of it is the Quran. The mushaf's printed
 * layout is a megabyte and a half of Arabic, and as escapes it costs four
 * and a half.
 *
 * Turning it off is safe here because every entry point is served and read as
 * UTF-8: index.html declares it, and Metro writes the bundle as UTF-8. The
 * saving is worth far more than the risk of a file being read as Latin-1,
 * which is the only thing this setting protects against.
 */
config.transformer.minifierConfig = {
  ...(config.transformer.minifierConfig || {}),
  output: {
    ...((config.transformer.minifierConfig || {}).output || {}),
    ascii_only: false,
  },
};

module.exports = config;
