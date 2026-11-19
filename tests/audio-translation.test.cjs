const assert = require('node:assert/strict');
const test = require('node:test');
const { createAudioHarness, ayahs, tracks, deferred, tick } = require('./helpers/audio-harness.cjs');
const { createLoader } = require('./helpers/load-typescript.cjs');
const SETTINGS = '@deen/audio-settings/v1', SESSION = '@deen/audio-session/v1';
const voice = id => ({ translationEdition: id, translationName: id === 'ur.khan' ? 'Shamshad Ali Khan' : id === 'fr.leclerc' ? 'Youssouf Leclerc' : 'Ibrahim Walk' });
const audioUri = (edition, number) => `https://example.test/${edition}/${number}.mp3`;
function harness(platform = 'android', options = {}) {
  return createAudioHarness({ platform, getSurahAudio: async (_chapter, edition) => ayahs().map(a => ({ ...a, audio: audioUri(edition, a.globalNumber) })), ...options });
}
async function start(h, index = 9, extra = {}) {
  await h.service.saveAudioSettings({ translationAudioEnabled: true, sequential: true, repeat: 'none', ...voice('en.walk'), ...extra });
  const queue = await h.service.buildSurahQueue(55, 'Ar-Rahman', h.service.getAudioSettings());
  await h.service.playQueue(queue, index);
  return queue;
}
function setPosition(h, position) {
  const player = h.playlists[0] || h.webPlayer;
  player.currentTime = position;
  player.status();
}
const currentUri = h => h.playlists[0]?.sources[h.playlists[0].currentIndex]?.uri || h.webPlayer.uri;

for (const platform of ['android', 'ios', 'web']) {
  test(`${platform}: a live language choice replaces the SAME translated ayah at zero without a second Play`, async () => {
    const h = harness(platform);
    await start(h);
    setPosition(h, 6.2);
    const plays = h.plays.length;
    await h.service.saveAudioSettings(voice('ur.khan'));
    assert.equal(h.snapshot().track.kind, 'translation');
    assert.equal(h.snapshot().track.ayahNumber, 5);
    assert.equal(h.snapshot().track.edition, 'ur.khan');
    assert.equal(currentUri(h), audioUri('ur.khan', 5));
    assert.equal(h.plays.length, plays + 1);
    assert.equal(h.snapshot().playing, true);
    assert.equal(h.playlists[0]?.currentTime ?? h.webPlayer.currentTime, 0, 'Different-language seconds are not interchangeable');
    assert.ok(h.pauses.some(p => p.uri === audioUri('en.walk', 5)), 'Stop the old recording before replacement');
    await h.service.clearQueue();
  });

  test(`${platform}: voice changes keep the active Arabic ayah and its playhead`, async () => {
    const h = harness(platform);
    await start(h, 8, { rate: 1.25, arabicVolume: .42, translationVolume: .63 });
    await h.service.setPlaybackRate(1.25);
    setPosition(h, 4.25);
    const replacements = h.replacements.length, plays = h.plays.length;
    await h.service.saveAudioSettings(voice('ur.khan'));
    assert.equal(h.snapshot().track.kind, 'arabic');
    assert.equal(h.snapshot().track.ayahNumber, 5);
    assert.equal(currentUri(h), audioUri('ar.alafasy', 5));
    assert.equal(h.playlists[0]?.currentTime ?? h.webPlayer.currentTime, 4.25);
    assert.ok(h.snapshot().queue.filter(t => t.kind === 'translation').every(t => t.edition === 'ur.khan'));
    if (platform === 'web') {
      assert.equal(h.replacements.length, replacements, 'No source replacement while Arabic is reciting');
      assert.equal(h.plays.length, plays, 'No unnecessary play call while Arabic is reciting');
      assert.equal(h.webPlayer.volume, .42);
    } else {
      assert.ok(h.seeks.includes(4.25), 'Native timeline rebuild restores the current Arabic position');
      assert.equal(h.playlists[0].playbackRate, 1.25);
      assert.equal(h.playlists[0].volume, .42);
    }
    await h.service.nextTrack();
    assert.equal(currentUri(h), audioUri('ur.khan', 5), 'The very next accompaniment has the new voice');
    assert.equal(h.playlists[0]?.volume ?? h.webPlayer.volume, .63);
    await h.service.clearQueue();
  });

  test(`${platform}: paused voice changes remain paused until an explicit Play`, async () => {
    const h = harness(platform);
    await start(h);
    await h.service.pause();
    const count = h.plays.length;
    await h.service.saveAudioSettings(voice('fr.leclerc'));
    assert.equal(h.snapshot().playing, false);
    assert.equal(h.plays.length, count);
    assert.equal(currentUri(h), audioUri('fr.leclerc', 5));
    await h.service.resume();
    assert.equal(h.plays.at(-1).uri, audioUri('fr.leclerc', 5));
    await h.service.clearQueue();
  });

  test(`${platform}: Off removes translation immediately; On reinstates it without resetting Arabic`, async () => {
    const h = harness(platform);
    await start(h);
    await h.service.saveAudioSettings({ translationAudioEnabled: false });
    assert.ok(h.snapshot().queue.every(t => t.kind === 'arabic'));
    assert.equal(h.snapshot().track.ayahNumber, 6, 'Continue after the disabled translation, not back to verse one');
    assert.equal(h.snapshot().playing, true);
    assert.equal(currentUri(h), audioUri('ar.alafasy', 6));
    setPosition(h, 2.75);
    await h.service.saveAudioSettings({ translationAudioEnabled: true });
    assert.equal(h.snapshot().queue.length, 14);
    assert.equal(h.snapshot().track.kind, 'arabic');
    assert.equal(h.snapshot().track.ayahNumber, 6);
    assert.equal(h.playlists[0]?.currentTime ?? h.webPlayer.currentTime, 2.75);
    await h.service.nextTrack();
    assert.equal(h.snapshot().track.kind, 'translation');
    assert.equal(h.snapshot().track.ayahNumber, 6);
    await h.service.clearQueue();
  });

  test(`${platform}: rapid language selections are last-choice-wins in settings AND the transport`, async () => {
    const h = harness(platform);
    await start(h);
    await Promise.all([
      h.service.saveAudioSettings(voice('fr.leclerc')),
      h.service.saveAudioSettings(voice('ur.khan')),
      h.service.saveAudioSettings(voice('en.walk')),
    ]);
    assert.equal(h.service.getAudioSettings().translationEdition, 'en.walk');
    assert.equal(h.snapshot().track.edition, 'en.walk');
    assert.equal(currentUri(h), audioUri('en.walk', 5));
    assert.equal(h.plays.at(-1).uri, audioUri('en.walk', 5));
    assert.equal(JSON.parse(h.storage.get(SETTINGS)).translationEdition, 'en.walk');
    await h.service.clearQueue();
  });
}

test('voice-only remapping preserves a custom queue, omitted translations, Arabic sources and order', async () => {
  const h = harness();
  const original = await start(h);
  const custom = [original[4], original[5], original[12]];
  await h.service.playQueue(custom, 1);
  await h.service.saveAudioSettings(voice('ur.khan'));
  assert.equal(h.snapshot().queue.length, 3);
  assert.equal(h.snapshot().queue[0], custom[0]);
  assert.equal(h.snapshot().queue[2], custom[2]);
  assert.deepEqual(h.snapshot().queue.map(t => t.ayahNumber), [3, 3, 7]);
  assert.equal(currentUri(h), audioUri('ur.khan', 3));
  await h.service.clearQueue();
});

test('a language choice while Off does not silently enable translation or change the Arabic playhead', async () => {
  const h = harness('web');
  await start(h, 8);
  await h.service.saveAudioSettings({ translationAudioEnabled: false });
  setPosition(h, 3.8);
  const count = h.plays.length;
  await h.service.saveAudioSettings(voice('ur.khan'));
  assert.equal(h.service.getAudioSettings().translationAudioEnabled, false);
  assert.equal(h.snapshot().queue.length, 7);
  assert.equal(h.webPlayer.currentTime, 3.8);
  assert.equal(h.plays.length, count);
  await h.service.saveAudioSettings({ translationAudioEnabled: true });
  assert.ok(h.snapshot().queue.filter(t => t.kind === 'translation').every(t => t.edition === 'ur.khan'));
  await h.service.clearQueue();
});

test('non-sequential queues change voice even though the first Arabic source and queue length are identical', async () => {
  const h = harness();
  await start(h, 9, { sequential: false }); // Translation ayah 3, after 7 Arabic tracks.
  await h.service.saveAudioSettings(voice('ur.khan'));
  assert.equal(h.snapshot().track.ayahNumber, 3);
  assert.equal(h.snapshot().queue[0].edition, 'ar.alafasy');
  assert.equal(h.snapshot().queue.length, 14);
  assert.equal(currentUri(h), audioUri('ur.khan', 3));
  await h.service.clearQueue();
});

test('the reading-language sync also changes a live spoken translation, without touching Quran text preferences', async () => {
  const h = harness('web');
  await start(h);
  h.storage.set('@deen/quran/preferences/v1', '{"translationEdition":"kept-text","fontSize":34}');
  await h.service.syncAudioTranslationToLanguage('ur');
  assert.equal(currentUri(h), audioUri('ur.khan', 5));
  assert.equal(h.storage.get('@deen/quran/preferences/v1'), '{"translationEdition":"kept-text","fontSize":34}');
  await h.service.clearQueue();
});

for (const repeat of ['none', 'one', 'all', 'range']) {
  test(`disabling the last translation honours the existing ${repeat} repeat/end policy`, async () => {
    const h = harness();
    await start(h, 13, { repeat, repeatCount: 0, repeatRangeStart: 3, repeatRangeEnd: 7 });
    await h.service.saveAudioSettings({ translationAudioEnabled: false });
    assert.equal(h.snapshot().track.kind, 'arabic');
    assert.equal(h.snapshot().track.ayahNumber, repeat === 'all' ? 1 : repeat === 'range' ? 3 : 7);
    assert.equal(h.snapshot().playing, repeat !== 'none');
    await h.service.clearQueue();
  });
}

test('translation-only samples can switch language and stop honestly when translation is disabled', async () => {
  const h = harness();
  const original = await start(h);
  await h.service.playQueue([original[9]]);
  await h.service.saveAudioSettings(voice('ur.khan'));
  assert.equal(currentUri(h), audioUri('ur.khan', 5));
  h.storage.set('@deen/audio-playlists/v1', '[{"id":"kept","tracks":[]}]');
  await h.service.saveAudioSettings({ translationAudioEnabled: false });
  assert.equal(h.snapshot().track, null);
  assert.equal(h.playlists[0].playing, false);
  assert.equal(h.storage.get('@deen/audio-playlists/v1'), '[{"id":"kept","tracks":[]}]');
});

test('untimed downloaded/full-Surah recordings stay on their original URI and time', async () => {
  const h = harness('web');
  const whole = { ...tracks()[0], globalNumber: 0, uri: 'file:///kept-full-surah.mp3' };
  await h.service.playQueue([whole]);
  setPosition(h, 35);
  const count = h.plays.length;
  await h.service.saveAudioSettings({ translationAudioEnabled: true, ...voice('ur.khan') });
  assert.equal(h.snapshot().track, whole);
  assert.equal(h.webPlayer.currentTime, 35);
  assert.equal(h.webPlayer.uri, whole.uri);
  assert.equal(h.plays.length, count);
  await h.service.clearQueue();
});

for (const action of ['pause', 'stopPlayback', 'clearQueue', 'newSurah', 'newVoice']) {
  test(`a delayed native position-restore cannot override a newer ${action}`, async () => {
    const gate = deferred(), started = deferred();
    let delay = false;
    const h = harness('ios', { beforeSeek: async () => { if (delay) { delay = false; started.resolve(); await gate.promise; } } });
    await start(h, 8);
    setPosition(h, 4.5);
    delay = true;
    const pending = h.service.saveAudioSettings(voice('fr.leclerc'));
    await started.promise;
    const count = h.plays.length;
    if (action === 'newSurah') await h.service.playQueue(tracks(2), 2);
    else if (action === 'newVoice') await h.service.saveAudioSettings(voice('ur.khan'));
    else await h.service[action]();
    gate.resolve();
    await pending;
    await tick();
    if (action === 'clearQueue') assert.equal(h.snapshot().track, null);
    else if (action === 'newSurah') assert.equal(h.snapshot().track.chapterId, 2);
    else if (action === 'newVoice') assert.ok(h.snapshot().queue.filter(t => t.kind === 'translation').every(t => t.edition === 'ur.khan'));
    else {
      assert.equal(h.snapshot().playing, false);
      assert.equal(h.plays.length, count, 'The stale native completion must not autoplay');
      await h.service.resume();
      assert.equal(h.snapshot().track.ayahNumber, 5);
      assert.equal(h.snapshot().track.kind, 'arabic');
    }
    await h.service.clearQueue();
  });
}

test('unknown/text-only editions cannot fabricate playable translation URLs', async () => {
  const h = harness();
  await start(h);
  const before = h.plays.length;
  await h.service.saveAudioSettings(voice('tr_ps_fake_translation'));
  assert.equal(h.plays.length, before);
  assert.equal(h.snapshot().error, 'This translation audio is unavailable.');
  assert.ok(!h.snapshot().queue.some(t => t.uri.includes('fake')));
  await h.service.clearQueue();
});

test('session snapshots record the actual audio switch and same-ayah identity after a language change', async () => {
  const h = harness();
  await start(h, 9, { sequential: false });
  await h.service.saveAudioSettings(voice('ur.khan'));
  await tick();
  const session = JSON.parse(h.storage.get(SESSION));
  assert.equal(session.translationAudioEnabled, true);
  assert.equal(session.sequential, false);
  assert.equal(session.trackKind, 'translation');
  assert.equal(session.ayahNumber, 3);
  const reopened = harness('android', { storage: new Map(h.storage) });
  await reopened.service.loadAudioSettings();
  assert.equal(await reopened.service.restoreSavedSession(), true);
  assert.equal(reopened.snapshot().track.edition, 'ur.khan');
  assert.equal(reopened.snapshot().track.ayahNumber, 3);
  assert.equal(reopened.snapshot().playing, false);
  await reopened.service.clearQueue();
  await h.service.clearQueue();
});

test('restoring an explicitly Off sequential session does not turn translation back on', async () => {
  const h = harness();
  await start(h, 8);
  await h.service.saveAudioSettings({ translationAudioEnabled: false });
  await tick();
  const reopened = harness('android', { storage: new Map(h.storage) });
  await reopened.service.loadAudioSettings();
  assert.equal(await reopened.service.restoreSavedSession(), true);
  assert.equal(reopened.snapshot().queue.length, 7);
  assert.equal(reopened.snapshot().track.ayahNumber, 5);
  assert.equal(reopened.snapshot().playing, false);
  await reopened.service.clearQueue();
  await h.service.clearQueue();
});

test('a failed web recording stops honestly, does not auto-resume, and explicit Play reloads that same chosen source', async () => {
  const h = harness('web');
  await start(h);
  await h.service.saveAudioSettings(voice('ur.khan'));
  h.webPlayer.playing = false;
  h.webPlayer.status({ playing: false, error: 'Network source unavailable' });
  assert.equal(h.snapshot().playing, false);
  assert.equal(h.snapshot().buffering, false);
  assert.equal(h.snapshot().error, 'This translation audio is unavailable.');
  const count = h.plays.length, replacements = h.replacements.length;
  await new Promise(resolve => setTimeout(resolve, 1000));
  assert.equal(h.plays.length, count, 'A media error is not a transient interruption');
  await h.service.resume();
  assert.equal(h.replacements.length, replacements + 1, 'Retry must reload an errored media element');
  assert.equal(h.plays.at(-1).uri, audioUri('ur.khan', 5));
  assert.equal(h.snapshot().error, null);
  await h.service.clearQueue();
});

test('new player hints are available in all 22 interface languages; unsupported voices remain unavailable', () => {
  const load = createLoader();
  const { audioPlayerLanguage, audioPlayerText } = load('src/services/audioPlayerCopy.ts');
  const { translationAudioEdition } = load('src/services/translationPreferences.ts');
  for (const language of ['en','ar','ur','fa','ps','fr','tr','ru','uz','kk','zh','vi','az','bs','bg','si','bn','hi','id','ms','ta','ml']) {
    for (const key of ['wholeSurah','unavailable']) {
      assert.ok(audioPlayerText(language, key).trim().length > 0, `${language}/${key}`);
      if (language !== 'en') assert.notEqual(audioPlayerText(language, key), audioPlayerText('en', key));
    }
    for (const code of ['fr','kk','ru','tr','uz','zh','en','fa','ur','az','bs']) {
      assert.ok(audioPlayerLanguage(language, code)?.length > 0, `${language}/${code} has a language label`);
      assert.notEqual(audioPlayerLanguage(language, code), code, 'Do not expose a raw language code');
    }
  }
  assert.equal(audioPlayerLanguage('ar', 'az'), 'الأذربيجانية');
  assert.equal(audioPlayerLanguage('ur', 'bs'), 'بوسنیائی');
  assert.equal(audioPlayerLanguage('uz', 'uz'), 'Ўзбекча');
  assert.equal(audioPlayerLanguage('kk', 'kk'), 'Қазақ тілі');
  assert.equal(translationAudioEdition('ar.alafasy'), null);
  assert.equal(translationAudioEdition('ps.fake'), null);
  assert.equal(translationAudioEdition('ta.fake'), null);
  assert.equal(translationAudioEdition('ur.khan').bitrate, 64);
});
