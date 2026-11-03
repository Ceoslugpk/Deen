import TrackPlayer, { Event } from 'react-native-track-player';

/**
 * What runs when the app itself is not.
 *
 * The notification controls have to work with the screen off, with another app
 * in front, and — on Android — after the task has been swiped away. In that
 * last case this is the only JavaScript still alive, so it cannot reach into
 * the rest of the app: it runs in its own context, with its own copy of every
 * module, and the queue it can see is the one living inside the track player.
 *
 * That is the reason the whole surah is handed to the player rather than one
 * ayah at a time. Here there is no app state to consult, no repeat setting, no
 * saved position — only the queue. So next and previous do the honest thing
 * and move along the queue, and play and pause do what they say.
 *
 * Everything with a setting attached to it — repeating one ayah, repeating a
 * passage, carrying on into the next surah — belongs to the app, and is
 * handled there while it is running. This is the fallback for when it is not.
 */
export async function playbackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    void TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    void TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    void TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    void TrackPlayer.seekTo(event.position);
  });
}
