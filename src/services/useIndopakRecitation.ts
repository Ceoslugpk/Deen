import { useSyncExternalStore } from 'react';
import { getAudioSnapshot, subscribeAudio } from './audioService';
import { indopakRecitingVerse } from './indopakPlayback';

const subscribe = (notify: () => void) => subscribeAudio(() => notify());
const snapshot = () => {
  const audio = getAudioSnapshot();
  return indopakRecitingVerse(audio.track, audio.error);
};

/** A primitive-key snapshot: position/buffering ticks do not repaint hundreds of Quran outlines. */
export function useIndopakRecitation(): string | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
