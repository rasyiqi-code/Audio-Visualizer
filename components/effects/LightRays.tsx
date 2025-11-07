import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface LightRaysProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const LightRays: React.FC<LightRaysProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const angleRef = useRef<number>(0);

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity
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

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const numRays = 12;
      const maxLength = Math.max(canvas.width, canvas.height);

      // Faster rotation
      angleRef.current += 0.01 * (1 + audioIntensity);

      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + angleRef.current;
        // ALWAYS render rays - minimum 50% length!
        const rayLength = maxLength * Math.max(0.5, audioIntensity);
        
        const gradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX + Math.cos(angle) * rayLength,
          centerY + Math.sin(angle) * rayLength
        );

        // MUCH higher alpha - 5x stronger!
        const baseAlpha = (intensity / 100) * 0.4; // Increased from 0.15
        const alpha = baseAlpha * Math.max(0.5, audioIntensity);
        const color = i % 2 === 0 ? theme.primary : theme.secondary;
        
        gradient.addColorStop(0, color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.3, color + Math.floor(alpha * 200).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.6, color + Math.floor(alpha * 100).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, color + '00');

        ctx.fillStyle = gradient;
        
        // Draw ray as triangle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, rayLength, angle - 0.1, angle + 0.1);
        ctx.closePath();
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 75, mixBlendMode: 'screen', opacity: 0.9 }} />;
};

export default LightRays;

