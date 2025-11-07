import React, { useEffect, useRef } from 'react';

interface FlashEffectsProps {
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const FlashEffects: React.FC<FlashEffectsProps> = ({ intensity, analyser, isPlaying }) => {
  const flashRef = useRef<HTMLDivElement>(null);
  const lastBeatTime = useRef<number>(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!flashRef.current) return;

      // Only animate if audio is playing
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data
        analyser.getByteFrequencyData(dataArray);

        // Detect beat (simple bass detection)
        const bassSum = dataArray.slice(0, Math.floor(dataArray.length / 8)).reduce((a, b) => a + b, 0);
        const bassAvg = bassSum / Math.floor(dataArray.length / 8);
        const bassIntensity = bassAvg / 255;

        const now = Date.now();
        const timeSinceLastBeat = now - lastBeatTime.current;

        // Trigger flash on strong bass (with cooldown) - lowered threshold
        if (bassIntensity > 0.6 && timeSinceLastBeat > 180) {
          lastBeatTime.current = now;
          
          // Flash effect - increased opacity for better visibility
          const flashOpacity = (intensity / 100) * bassIntensity * 0.6;
          flashRef.current.style.opacity = flashOpacity.toString();
          
          // Fade out
          setTimeout(() => {
            if (flashRef.current) {
              flashRef.current.style.opacity = '0';
            }
          }, 60);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity, analyser, isPlaying]);

  return (
    <div
      ref={flashRef}
      className="absolute inset-0 pointer-events-none bg-white"
      style={{
        zIndex: 5,
        opacity: 0,
        transition: 'opacity 0.05s ease-out',
      }}
    />
  );
};

export default FlashEffects;

