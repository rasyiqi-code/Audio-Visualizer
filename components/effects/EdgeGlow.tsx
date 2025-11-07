import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface EdgeGlowProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const EdgeGlow: React.FC<EdgeGlowProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const animationRef = useRef<number>(0);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!glowRef.current) return;

      // Calculate average audio intensity
      let audioIntensity = 0.6; // MUCH higher default!
      
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

      // MUCH stronger glow - always visible!
      const baseGlow = (intensity / 100) * 0.5; // Minimum 50% at 100%
      const glowIntensity = baseGlow + (audioIntensity * 0.5);
      const shadowSize = 80 + (audioIntensity * 120); // 80-200px glow!

      glowRef.current.style.boxShadow = `
        inset 0 0 ${shadowSize}px ${theme.primary}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')},
        inset 0 0 ${shadowSize * 1.5}px ${theme.secondary}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')},
        inset 0 0 ${shadowSize * 2}px ${theme.highlight}${Math.floor(glowIntensity * 200).toString(16).padStart(2, '0')}
      `;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return (
    <div
      ref={glowRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 85,
        transition: 'box-shadow 0.1s ease-out',
        opacity: intensity > 0 ? 1 : 0,
      }}
    />
  );
};

export default EdgeGlow;

