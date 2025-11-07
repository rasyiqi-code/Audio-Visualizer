import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface AnimatedBackgroundProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const angleRef = useRef<number>(0);
  const lastBeatTime = useRef<number>(0);
  const beatPulseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Ensure theme colors are defined
      if (!theme.primary || !theme.secondary || !theme.highlight) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Get fresh audio data and detect beats
      let audioIntensity = 0.6;
      let bassIntensity = 0;
      let isBeat = false;
      
      if (analyser && isPlaying && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
          
          // Beat detection
          let bassSum = 0;
          const bassRange = Math.floor(dataArray.length / 8);
          for (let i = 0; i < bassRange; i++) {
            bassSum += dataArray[i];
          }
          bassIntensity = (bassSum / bassRange) / 255;
          
          const now = Date.now();
          const timeSinceLastBeat = now - lastBeatTime.current;
          if (bassIntensity > 0.65 && timeSinceLastBeat > 200) {
            isBeat = true;
            lastBeatTime.current = now;
            beatPulseRef.current = 1.0;
          }
        }
      }
      
      beatPulseRef.current *= 0.9;

      // BEAT-RESPONSIVE rotation - SPIN FAST on beat!
      const rotationSpeed = isBeat ? 0.05 : (0.003 * (intensity / 50) * (1 + audioIntensity));
      angleRef.current += rotationSpeed;

      // Create animated gradient
      const gradient = ctx.createLinearGradient(
        canvas.width / 2 + Math.cos(angleRef.current) * canvas.width,
        canvas.height / 2 + Math.sin(angleRef.current) * canvas.height,
        canvas.width / 2 + Math.cos(angleRef.current + Math.PI) * canvas.width,
        canvas.height / 2 + Math.sin(angleRef.current + Math.PI) * canvas.height
      );

      // BEAT-RESPONSIVE brightness!
      const baseAlpha = (intensity / 100) * 0.6 * Math.max(0.7, audioIntensity);
      const alpha = baseAlpha * (1 + beatPulseRef.current * 0.5); // +50% brighter on beat!
      gradient.addColorStop(0, theme.primary + Math.floor(alpha * 200).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.25, theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, theme.highlight + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.75, theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, theme.primary + Math.floor(alpha * 200).toString(16).padStart(2, '0'));

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.85 }} />;
};

export default AnimatedBackground;

