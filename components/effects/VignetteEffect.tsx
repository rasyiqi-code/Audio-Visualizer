import React, { useEffect, useRef } from 'react';

interface VignetteEffectProps {
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  inverted?: boolean;
}

const VignetteEffect: React.FC<VignetteEffectProps> = ({ intensity, analyser, isPlaying, inverted = false }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!divRef.current) return;

      // Get audio intensity
      let audioIntensity = 0.5; // Higher default for better visibility
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
        }
      }

      // MUCH stronger vignette - ALWAYS visible!
      const baseStrength = (intensity / 100) * 0.6; // Minimum 60% at 100%
      const vignetteStrength = baseStrength + (audioIntensity * 0.4); // Up to 100%
      
      if (inverted) {
        // Bright vignette - stronger gradient
        divRef.current.style.background = `radial-gradient(circle at center, transparent 20%, rgba(255, 255, 255, ${vignetteStrength}) 90%)`;
      } else {
        // Dark vignette - MUCH stronger gradient
        divRef.current.style.background = `radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, ${vignetteStrength}) 90%)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity, analyser, isPlaying, inverted]);

  return (
    <div
      ref={divRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 90,
        opacity: intensity > 0 ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default VignetteEffect;

