import { Platform } from 'react-native';
import {
  type AudioLockScreenOptions,
  type AudioMetadata,
  AudioPlayer,
  AudioPlaylist,
  createAudioPlayer,
  createAudioPlaylist,
  setAudioModeAsync,
} from 'expo-audio';
import type { AudioTrack } from './audioService';

/**
 * The transport: the thing that actually makes sound.
 *
 * Everything else — which ayah comes next, how many times it repeats, where
 * the listener was — belongs to the audio service. This file only knows how to
 * start, stop, and report on a piece of audio, so that the two halves can be
 * changed without either of them having to know much about the other.
 *
 * There are two transports, and which one runs is decided by where the app is
 * running:
 *
 *   - On a phone, an expo-audio playlist. A playlist rather than a single
 *     player, because the lock screen's next and previous are wired to the
 *     playlist: a lone player tells the system it has no next or previous to
 *     skip to, and then those buttons do nothing.
 *
 *   - On the web, an expo-audio player, one ayah at a time. There is no
 *     notification to keep in step with and the app is on screen driving
 *     every move itself, so a queue buys nothing there.
 *
 * Both are expo-audio now. The phone used to run react-native-track-player,
 * which bought the notification and the background service and cost the app
 * its boot: the player is imported at the top of this file, the top of this
 * file is reached from the app's own first import, and a module that fails
 * while it is being imported leaves nothing to catch it — the screen came up
 * grey and no JavaScript ever ran. expo-audio is an Expo module and does the
 * same two jobs, so the third-party player is gone.
 *
 * Both are kept behind one small interface so the service above does not have
 * to care which is in use.
 */

/** What the transport reports back. */
export type EngineStatus = {
  playing: boolean;
  position: number;
  duration: number;
  buffering: boolean;
  /**
   * The index of the track that has just finished, or null while one is
   * still playing. Given as an index rather than a flag because what happens
   * next depends on which ayah ended.
   */
  endedIndex: number | null;
};

export type AudioEngine = {
  /** Bring the transport up. Safe to call more than once. */
  /** Sources the transport should be built with, where it takes them at construction. */
  prepare(sources?: { uri: string }[]): Promise<void>;
  /**
   * Load a surah and begin at `index`.
   *
   * The whole queue is handed over rather than one ayah at a time, because
   * the notification's next and previous have to work when the app is not
   * running, and then there is no app state to consult — only the queue
   * living inside the transport.
   */
  loadQueue(
    queue: AudioTrack[],
    index: number,
    autoplay: boolean,
    rate: number,
    volume: number,
  ): Promise<void>;
  /** Move to another ayah in the surah already loaded. */
  skipTo(index: number, autoplay: boolean, rate: number, volume: number): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  /** Stop and rewind. */
  stop(): Promise<void>;
  /** Drop the queue entirely. */
  reset(): Promise<void>;
  setRate(rate: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  getPosition(): Promise<number>;
  getDuration(): Promise<number>;
  /** Attach the one listener. Called once, before anything is loaded. */
  bind(listener: (status: EngineStatus) => void): void;
};

/* ------------------------------------------------------------------- common */

/* --------------------------------------------------------------- web engine */

/**
 * The web transport, on expo-audio.
 *
 * Plays one ayah at a time, which is what it has always done and is fine here:
 * there is no notification to keep in step with, and the app is on screen and
 * driving every move itself.
 */
function createWebEngine(): AudioEngine {
  let player: AudioPlayer | null = null;
  let listener: ((status: EngineStatus) => void) | null = null;
  let currentUri = '';
  let currentQueue: AudioTrack[] = [];
  let index = 0;

  async function prepare(): Promise<void> {
    if (player) return;
    try {
      /* Three separate things, and all three are needed.
         `playsInSilentMode` so a recitation is not swallowed by the ringer
         switch. `shouldPlayInBackground` so leaving for another app does not
         cut the recitation off. `doNotMix` asks that other audio yield, so a
         notification does not talk over the Quran. */
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
    } catch {
      /* audio mode is best-effort on device, and some browsers reject it */
    }
    /* `keepAudioSessionActive` belongs to the player, not the audio mode: it
       keeps the session alive across a pause so that resuming does not have to
       re-establish it, which is what makes a resume stutter or start late. */
    player = createAudioPlayer(null, { updateInterval: 500, keepAudioSessionActive: true });
    player.addListener('playbackStatusUpdate', (status) => {
      listener?.({
        playing: status.playing,
        position: status.currentTime,
        duration: status.duration,
        buffering: status.isBuffering,
        endedIndex: status.didJustFinish ? index : null,
      });
    });
  }

  async function apply(uri: string, autoplay: boolean, rate: number, volume: number) {
    const instance = player;
    if (!instance) return;
    if (currentUri !== uri) {
      currentUri = uri;
      instance.replace(uri);
    }
    /* Rate and volume have to be re-applied on every source change, not only
       when the user changes them: the player resets both when a new track is
       loaded, and a recitation that comes back at full speed and full volume
       after every ayah has not really remembered the settings at all. */
    try {
      instance.setPlaybackRate(rate, 'high');
    } catch {
      /* rate control is unavailable on some browsers */
    }
    try {
      instance.volume = volume;
    } catch {
      /* volume is unavailable in some browsers until playback starts */
    }
    if (autoplay) instance.play();
  }

  return {
    prepare,
    async loadQueue(queue, startIndex, autoplay, rate, volume) {
      await prepare();
      currentQueue = queue;
      index = startIndex;
      currentUri = '';
      const track = queue[startIndex];
      if (!track) return;
      await apply(track.uri, autoplay, rate, volume);
    },
    async skipTo(nextIndex, autoplay, rate, volume) {
      await prepare();
      index = nextIndex;
      const track = currentQueue[nextIndex];
      if (!track) return;
      await apply(track.uri, autoplay, rate, volume);
    },
    async play() {
      player?.play();
    },
    async pause() {
      player?.pause();
    },
    async seek(seconds: number) {
      await player?.seekTo(Math.max(0, seconds));
    },
    async stop() {
      player?.pause();
      if (player) await player.seekTo(0);
    },
    async reset() {
      await this.stop();
      currentUri = '';
      currentQueue = [];
    },
    async setRate(rate: number) {
      try {
        player?.setPlaybackRate(rate, 'high');
      } catch {
        /* rate control is unavailable on some browsers */
      }
    },
    async setVolume(volume: number) {
      try {
        if (player) player.volume = volume;
      } catch {
        /* volume is unavailable in some browsers until playback starts */
      }
    },
    async getPosition() {
      return player?.currentTime ?? 0;
    },
    async getDuration() {
      return player?.duration ?? 0;
    },
    bind(next) {
      listener = next;
    },
  };
}

/* ------------------------------------------------------------ native engine */

/**
 * The phone transport, on an expo-audio playlist.
 *
 * Two things about how a recitation is listened to shape this. It is long
 * enough that nobody holds the app open for all of it, so it has to keep
 * playing with the screen off and with another app in front. And it is
 * listened to with the phone out of sight, so the controls have to be where
 * the hand already is — in the notification, not only on the screen.
 *
 * Both now come from expo-audio rather than from a third-party player:
 *
 *   - Background playback is declared by the expo-audio config plugin
 *     (`enableBackgroundPlayback`), which is what lets Android run a media
 *     foreground service. Without it Android stops the audio after roughly
 *     three minutes whether or not the app asked to play in the background.
 *
 *   - The controls come from `setActiveForLockScreen`, which hands this
 *     playlist to the system's own media session. They are handled there, in
 *     the system, not here: pressing next on the lock screen moves along the
 *     queue with no JavaScript running at all, which is the only thing that
 *     can work once the task has been swiped away.
 *
 * The playlist is the reason next and previous do anything. expo-audio gives
 * a lone player no next and no previous to skip to — it reports them as
 * unsupported and the buttons sit dead — so holding the whole surah is not an
 * optimisation here, it is what makes the buttons work.
 *
 * Repeating is the app's business, not the transport's, so the playlist is
 * told never to loop and every move is decided above, in the audio service.
 */
function createNativeEngine(): AudioEngine {
  let playlist: AudioPlaylist | null = null;
  let listener: ((status: EngineStatus) => void) | null = null;
  let bound = false;
  let currentQueue: AudioTrack[] = [];
  let index = 0;
  let lastPosition = 0;
  let lastDuration = 0;

  /**
   * The transport reports our own moves back to us as though an ayah had
   * ended, and acting on that would skip an ayah every time the listener
   * pressed next. Recent moves are ours and are ignored.
   */
  let selfDrivenAt = 0;
  const QUIET_MS = 400;
  const wasSelfDriven = () => selfDrivenAt !== 0 && Date.now() - selfDrivenAt < QUIET_MS;

  async function selfDrive(action: () => void | Promise<void>) {
    selfDrivenAt = Date.now();
    try {
      await action();
    } catch {
      /* The transport did not do it. Reported rather than thrown: every
         caller of this is a listener's own move, and a rejection here would
         surface as an unhandled promise rather than a pause button that
         simply did nothing. */
    } finally {
      /* Not cleared immediately: the event for this move arrives
         asynchronously, and clearing the flag now would let it straight back
         in. */
      setTimeout(() => {
        if (Date.now() - selfDrivenAt >= QUIET_MS) selfDrivenAt = 0;
      }, QUIET_MS);
    }
  }

  /** What the notification and the lock screen show for this ayah. */
  function metadataFor(track: AudioTrack | undefined): AudioMetadata {
    return {
      title: track?.title ?? '',
      artist: track?.performer ?? '',
      albumTitle: track?.chapterName ?? '',
    };
  }

  /**
   * Play and pause are the two that matter. Next and previous are there
   * because a recitation is followed with the phone in a pocket. Seek is
   * there because finding your place in a long surah by replaying it from the
   * start is a poor trade.
   */
  const LOCK_OPTIONS: AudioLockScreenOptions = {
    showNextTrack: true,
    showPreviousTrack: true,
    showSeekForward: true,
    showSeekBackward: true,
    seekForwardIntervalSeconds: 10,
    seekBackwardIntervalSeconds: 10,
  };

  function applyRate(rate: number) {
    try {
      if (playlist) playlist.playbackRate = rate;
    } catch {
      /* rate control is unavailable on some platforms */
    }
  }

  function applyVolume(volume: number) {
    try {
      if (playlist) playlist.volume = volume;
    } catch {
      /* volume is unavailable until playback starts on some platforms */
    }
  }

  /**
   * Built once, with the first queue already in it.
   *
   * The sources have to be there at construction rather than added after.
   * `loadInitialPlaylist` is the only thing that calls `prepare()`, and it
   * runs inside the constructor: a playlist built empty prepares against
   * nothing and sits in the idle state, and `add` does not prepare again.
   * From idle, neither `skipTo` nor `play` is guaranteed to start it, so
   * the queue has to be present before the playlist exists.
   *
   * Later queues are a different matter: by then the transport is prepared,
   * and clearing and refilling a prepared playlist is ordinary.
   */
  async function prepare(sources: { uri: string }[] = []): Promise<void> {
    if (playlist) return;
    try {
      /* Three separate things, and all three are needed.
         `playsInSilentMode` so a recitation is not swallowed by the ringer
         switch. `shouldPlayInBackground` so leaving for another app does not
         cut the recitation off. `doNotMix` asks that other audio yield, so a
         notification does not talk over the Quran — and it is also the mode
         the lock screen controls require, without which the system may never
         associate them with this playlist at all. */
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
    } catch {
      /* audio mode is best-effort on device */
    }
    playlist = createAudioPlaylist({ sources, updateInterval: 500, loop: 'none' });
    bindEvents();
  }

  function bindEvents() {
    if (bound || !playlist) return;
    bound = true;
    try {
      playlist.addListener('playlistStatusUpdate', (status) => {
        lastPosition = status.currentTime;
        lastDuration = status.duration;
        listener?.({
          playing: status.playing,
          position: status.currentTime,
          duration: status.duration,
          buffering: status.isBuffering,
          endedIndex: status.didJustFinish ? index : null,
        });
      });

      playlist.addListener('trackChanged', (data) => {
        /* An ayah ended and the transport moved on by itself. The one that
           ended is the one we have left, not the one we have arrived at. */
        index = data.currentIndex;
        try {
          playlist?.updateLockScreenMetadata(metadataFor(currentQueue[index]));
        } catch {
          /* metadata is a nicety, not a requirement */
        }
        if (wasSelfDriven()) return;
        listener?.({
          playing: false,
          position: lastPosition,
          duration: lastDuration,
          buffering: false,
          endedIndex: data.previousIndex,
        });
      });
    } catch {
      /* No transport to subscribe to. Progress simply stops being reported,
         which costs the progress bar and nothing else: play, pause and
         skipping are all commanded from here, not heard from here. */
    }
  }

  return {
    prepare,
    async loadQueue(queue, startIndex, autoplay, rate, volume) {
      /* An AudioSource, not a bare string.

         expo-audio patches `AudioPlayer.replace` to run a string through
         `resolveSource` first, so the web engine — which uses the single
         player — has always been able to hand it a URI and be understood.
         There is no such patch on `AudioPlaylist.add`: the string goes
         straight to Kotlin, where AudioSource is a Record with a `uri`
         field and a String cannot be converted into one.

         It threw, and selfDrive below swallows what it is given, so the
         queue stayed empty. Nothing was ever added, nothing was ever
         played, and the player sat at the bottom of the screen reporting
         buffering — on Android only, because web never took this path. */
      const sources = queue.map((track) => ({ uri: track.uri }));
      const built = !playlist;
      await prepare(sources);
      currentQueue = queue;
      index = startIndex;
      await selfDrive(() => {
        const p = playlist;
        if (!p) return;
        /* Only a rebuild. On the first call the sources were handed to the
           constructor, which prepared the transport with them in place;
           clearing and re-adding here would throw that preparation away and
           leave the player idle. */
        if (!built) {
          p.clear();
          for (const source of sources) p.add(source);
        }
        /* Rate and volume belong to the player, not the track, and are lost
           when the queue is rebuilt. Re-applied here so a recitation does not
           come back at full speed and full volume after a new surah. */
        applyRate(rate);
        applyVolume(volume);
        if (!queue.length) return;
        p.skipTo(startIndex);
        /* Registered only once there is something loaded: until then there is
           nothing for the system to show, and nothing to skip between. */
        p.setActiveForLockScreen(true, metadataFor(queue[startIndex]), LOCK_OPTIONS);
        if (autoplay) p.play();
      });
    },
    async skipTo(nextIndex, autoplay, rate, volume) {
      await prepare(currentQueue.map((track) => ({ uri: track.uri })));
      index = nextIndex;
      await selfDrive(() => {
        const p = playlist;
        if (!p) return;
        applyRate(rate);
        applyVolume(volume);
        p.skipTo(nextIndex);
        p.updateLockScreenMetadata(metadataFor(currentQueue[nextIndex]));
        if (autoplay) p.play();
      });
    },
    async play() {
      try { playlist?.play(); } catch { /* nothing to play on */ }
    },
    async pause() {
      try { playlist?.pause(); } catch { /* nothing to pause */ }
    },
    async seek(seconds: number) {
      await selfDrive(async () => {
        await playlist?.seekTo(Math.max(0, seconds));
      });
    },
    async stop() {
      await selfDrive(async () => {
        playlist?.pause();
        await playlist?.seekTo(0);
      });
    },
    async reset() {
      await selfDrive(() => {
        playlist?.clear();
        playlist?.clearLockScreenControls();
      });
      currentQueue = [];
    },
    async setRate(rate: number) {
      applyRate(rate);
    },
    async setVolume(volume: number) {
      applyVolume(volume);
    },
    async getPosition() {
      try {
        return playlist?.currentTime ?? lastPosition;
      } catch {
        return lastPosition;
      }
    },
    async getDuration() {
      try {
        return playlist?.duration ?? lastDuration;
      } catch {
        return lastDuration;
      }
    },
    bind(next) {
      listener = next;
    },
  };
}

/**
 * The transport in use.
 *
 * Chosen once, when this module is first loaded, because the platform cannot
 * change while the app is running.
 */
export const engine: AudioEngine =
  Platform.OS === 'web' ? createWebEngine() : createNativeEngine();
