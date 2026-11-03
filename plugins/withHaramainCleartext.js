/**
 * Lets the app open the Haramain live streams over plain HTTP.
 *
 * The broadcasts are published as `http://m.live.net.sa:1935/...` and there is
 * no HTTPS endpoint for them. From Android 9 onwards the system refuses
 * cleartext traffic unless an app asks for it, so without this the stream
 * fails on Android and works nowhere else that matters.
 *
 * The permission is scoped to that one host rather than being switched on for
 * the whole app. `usesCleartextTraffic="true"` is the shorter fix and it is
 * the wrong one: it would quietly allow every request the app makes to fall
 * back to unencrypted HTTP, including ones that were never meant to. A network
 * security config names the host instead, so the exception is exactly as wide
 * as the thing that needs it and no wider.
 *
 * Only the host these streams come from is listed. Nothing else in the app
 * speaks plain HTTP, and if something ever needs to, it should be added here
 * by name and for a reason.
 */
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/** The one host the app fetches over cleartext. */
const ALLOWED_HOST = 'm.live.net.sa';

const CONFIG_FILE = 'network_security_config.xml';

const XML = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <!-- Everything the app does is encrypted by default. -->
  <base-config cleartextTrafficPermitted="false" />
  <!-- Except the Haramain broadcast, which the broadcaster publishes over
       HTTP only. Scoped to this host name, not opened up app-wide. -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">${ALLOWED_HOST}</domain>
  </domain-config>
</network-security-config>
`;

module.exports = function withHaramainCleartext(config) {
  // 1. point the application at the config
  config = withAndroidManifest(config, (c) => {
    const manifest = c.modResults;
    const app = manifest.manifest.application?.[0];
    if (app) {
      app.$['android:networkSecurityConfig'] = `@xml/${CONFIG_FILE.replace('.xml', '')}`;
    }
    return c;
  });

  // 2. write the config file itself into the generated project
  return withDangerousMod(config, [
    'android',
    async (c) => {
      const resPath = await AndroidConfig.Paths.getResourceFolderAsync(c.modRequest.projectRoot);
      const xmlDir = path.join(resPath, 'xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(path.join(xmlDir, CONFIG_FILE), XML, 'utf8');
      return c;
    },
  ]);
};
