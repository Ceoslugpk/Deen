import { Platform } from 'react-native';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import TrackPlayer, { Capability, Event, RepeatMode as PlayerRepeatMode, State } from 'react-native-track-player';
import type { AudioTrack } from './audioService';
import { playbackService } from './playbackService';

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
 *   - On a phone, react-native-track-player. It is the only one of the two
 *     that can put controls in the notification and keep playing with the
 *     screen off, which is the whole point: a recitation is long enough that
 *     nobody holds the app open for all of it, and it is listened to with the
 *     phone out of sight.
 *
 *   - On the web, expo-audio. The track player does have a web
 *     implementation, but it plays through Shaka, and bundling Shaka for the
 *     web produced a chunk with no exports at all — playback died silently
 *     rather than reporting anything. There is no notification on the web to
 *     put controls into anyway, so nothing is lost by leaving the web on the
 *     player that already worked there.
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
  prepare(): Promise<void>;
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

function toPlayerTrack(track: AudioTrack) {
  return {
    url: track.uri,
    title: track.title,
    artist: track.performer,
    album: track.chapterName,
    /* Carried through so the notification, the lock screen, and the service
       that runs when the app does not can tell which ayah they are looking at
       without asking the app. */
    chapterId: track.chapterId,
    ayahNumber: track.ayahNumber,
    kind: track.kind,
  };
}

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
 * The phone transport, on react-native-track-player.
 *
 * Two things about how a recitation is listened to shape this. It is long
 * enough that nobody holds the app open for all of it, so it has to keep
 * playing with the screen off and with another app in front. And it is
 * listened to with the phone out of sight, so the controls have to be where
 * the hand already is — in the notification, not only on the screen.
 *
 * expo-audio cannot do either: it exposes a title and an artist for the lock
 * screen and nothing more, no buttons and no notification.
 */
function createNativeEngine(): AudioEngine {
  let ready = false;
  let bound = false;
  let listener: ((status: EngineStatus) => void) | null = null;
  let queueLength = 0;

  /**
   * The transport reports our own moves back to us as though an ayah had
   * ended, and acting on that would skip an ayah every time the listener
   * pressed next. Recent moves are ours and are ignored.
   */
  let selfDrivenAt = 0;
  const QUIET_MS = 400;
  const wasSelfDriven = () => selfDrivenAt !== 0 && Date.now() - selfDrivenAt < QUIET_MS;

  async function selfDrive(action: () => Promise<void>) {
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

  /** The position and duration the transport is reporting, kept for `seek`. */
  let lastPosition = 0;
  let lastDuration = 0;

  async function prepare(): Promise<void> {
    if (ready) return;
    try {
      await TrackPlayer.setupPlayer({ waitForBuffer: true });
    } catch {
      /* Already set up. Not a failure, only information we did not need. */
    }

    /* On Android the service runs in its own context and is the only thing
       alive once the task is swiped away, so it has to be registered before
       the player is used. On iOS there is no second context and the handlers
       below already cover it, so registering it as well would answer every
       press twice. */
    if (Platform.OS === 'android') {
      try {
        TrackPlayer.registerPlaybackService(() => playbackService);
      } catch {
        /* registerPlaybackService throws if called twice; harmless */
      }
    }

    /* What the notification offers. Play and pause are the two that matter.
       Next and previous are there because a recitation is followed with the
       phone in a pocket. Seek is there because finding your place in a long
       surah by replaying it from the start is a poor trade. */
    const capabilities = [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ];
    try {
      await TrackPlayer.updateOptions({
        capabilities,
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        /* Once a second is often enough to keep the progress bar honest and
           rarely enough to be worth the wake-ups. */
        progressUpdateEventInterval: 1,
        stoppingAppPausesPlayback: true,
      });
    } catch {
      /* Nothing to update options on. Playback is unaffected. */
    }

    /* Repeating is the app's business, not the transport's. This one knows a
       queue; the app knows about repeating one ayah, or a passage, or a
       number of times. So the transport is told never to repeat, and every
       move is decided above, in the audio service. */
    try {
      await TrackPlayer.setRepeatMode(PlayerRepeatMode.Off);
    } catch {
      /* Not fatal: advancement is driven from above regardless. */
    }

    ready = true;
  }

  function bindEvents() {
    if (bound) return;
    bound = true;
    try {

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
      lastPosition = event.position;
      lastDuration = event.duration;
      listener?.({
        playing: true,
        position: event.position,
        duration: event.duration,
        buffering: event.buffered < event.position + 0.25,
        endedIndex: null,
      });
    });

    TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
      /* Playing reports itself through the progress event above, so this is
         only for the states that carry no position with them. */
      if (event.state === State.Playing) return;
      listener?.({
        playing: false,
        position: lastPosition,
        duration: lastDuration,
        buffering: event.state === State.Buffering || event.state === State.Loading,
        endedIndex: null,
      });
    });

    const ended = (index: number | null | undefined) => {
      if (wasSelfDriven()) return;
      if (typeof index !== 'number' || index < 0) return;
      listener?.({
        playing: false,
        position: lastPosition,
        duration: lastDuration,
        buffering: false,
        endedIndex: index,
      });
    };

    /* An ayah ended and the transport has moved on by itself. */
    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (event) => ended(event.track));
    /* The last ayah of the surah ended. */
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => ended(event.track));
    } catch {
      /* No transport to subscribe to. Progress simply stops being reported,
         which costs the progress bar and nothing else: play, pause and
         skipping are all commanded from here, not heard from here. */
    }
  }

  async function applyRate(rate: number) {
    try {
      await TrackPlayer.setRate(rate);
    } catch {
      /* rate control is unavailable on some platforms */
    }
  }

  async function applyVolume(volume: number) {
    try {
      await TrackPlayer.setVolume(volume);
    } catch {
      /* volume is unavailable in some browsers until playback starts */
    }
  }

  return {
    async prepare() {
      await prepare();
      bindEvents();
    },
    async loadQueue(queue, index, autoplay, rate, volume) {
      await prepare();
      bindEvents();
      queueLength = queue.length;
      await selfDrive(async () => {
        await TrackPlayer.reset();
        if (queue.length) await TrackPlayer.add(queue.map(toPlayerTrack));
        /* Rate and volume belong to the player, not the track, and are lost
           when it is reset. Re-applied here so a recitation does not come
           back at full speed and full volume after a new surah. */
        await applyRate(rate);
        await applyVolume(volume);
        if (queue.length) {
          await TrackPlayer.skip(index, 0);
          if (autoplay) await TrackPlayer.play();
        }
      });
    },
    async skipTo(index, autoplay, rate, volume) {
      await prepare();
      bindEvents();
      await selfDrive(async () => {
        await applyRate(rate);
        await applyVolume(volume);
        await TrackPlayer.skip(index, 0);
        if (autoplay) await TrackPlayer.play();
      });
    },
    async play() {
      try { await TrackPlayer.play(); } catch { /* nothing to play on */ }
    },
    async pause() {
      try { await TrackPlayer.pause(); } catch { /* nothing to pause */ }
    },
    async seek(seconds: number) {
      await selfDrive(async () => {
        await TrackPlayer.seekTo(Math.max(0, seconds));
      });
    },
    async stop() {
      await selfDrive(async () => {
        await TrackPlayer.pause();
        await TrackPlayer.seekTo(0);
      });
    },
    async reset() {
      await selfDrive(async () => {
        await TrackPlayer.reset();
      });
      queueLength = 0;
    },
    async setRate(rate: number) {
      await applyRate(rate);
    },
    async setVolume(volume: number) {
      await applyVolume(volume);
    },
    async getPosition() {
      try {
        return await TrackPlayer.getPosition();
      } catch {
        return lastPosition;
      }
    },
    async getDuration() {
      try {
        return await TrackPlayer.getDuration();
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
