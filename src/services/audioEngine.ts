import { Platform } from 'react-native';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
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
/**
 * DIAGNOSTIC BUILD - the track player is stubbed out.
 *
 * This branch exists to answer one question: does the app boot on Android
 * without react-native-track-player in it? The native module went in at
 * db15884 and the grey screen started with the first build that linked it,
 * so this removes every trace of it from the bundle.
 *
 * Audio does not work in this build and is not meant to. Every method
 * resolves and reports silence, so nothing that waits on the transport
 * hangs and nothing that asks it for a position is given a lie. If the app
 * boots, the track player is the cause; if it is still grey, it is not.
 */
function createNativeEngine(): AudioEngine {
  let listener: ((status: EngineStatus) => void) | null = null;
  const idle = (): EngineStatus => ({
    playing: false, position: 0, duration: 0, buffering: false, endedIndex: null,
  });
  const report = () => { listener?.(idle()); };
  const noop = async () => { report(); };

  return {
    prepare: noop,
    loadQueue: noop,
    skipTo: noop,
    play: noop,
    pause: noop,
    seek: noop,
    stop: noop,
    reset: noop,
    setRate: noop,
    setVolume: noop,
    getPosition: async () => 0,
    getDuration: async () => 0,
    bind(next) { listener = next; },
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
