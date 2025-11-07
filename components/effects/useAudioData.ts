import { useEffect, useRef } from 'react';

/**
 * Custom hook to get audio data from analyser
 * Returns a ref that's continuously updated with fresh audio data
 */
export const useAudioData = (analyser: AnalyserNode | null, isPlaying: boolean) => {
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(0));
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        audioDataRef.current = dataArray;
        animationRef.current = requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return audioDataRef;
};

