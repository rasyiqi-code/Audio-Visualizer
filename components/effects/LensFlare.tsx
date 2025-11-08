import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface LensFlareProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const LensFlare: React.FC<LensFlareProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const flarePositions = useRef<Array<{ x: number; y: number; lastTrigger: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Update flare positions on resize
      flarePositions.current = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, lastTrigger: 0 },
        { x: canvas.width * 0.8, y: canvas.height * 0.3, lastTrigger: 0 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, lastTrigger: 0 },
        { x: canvas.width * 0.3, y: canvas.height * 0.7, lastTrigger: 0 },
        { x: canvas.width * 0.7, y: canvas.height * 0.7, lastTrigger: 0 },
      ];
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

      // Always animate, show flares!
      const now = Date.now();
      
      // Get audio data if available
      let audioIntensity = 0.5; // Higher default
      if (analyser && isPlaying && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
        }
      }

      const third = dataArray ? Math.floor(dataArray.length / 3) : 100;

      flarePositions.current.forEach((flare, index) => {
        const dataIndex = Math.min(index * third, dataArray ? dataArray.length - 1 : 0);
        const value = dataArray ? (dataArray[dataIndex] / 255) : audioIntensity;
        const timeSinceLast = now - flare.lastTrigger;

        // Trigger flare more easily - lower threshold!
        if (value > 0.5 && timeSinceLast > 400) {
          flare.lastTrigger = now;
        }

        // Calculate fade based on time since trigger
        const fadeTime = 1000; // Longer fade
        const fade = Math.max(0, 1 - timeSinceLast / fadeTime);

        // ALWAYS show subtle flare, bigger on trigger
        const baseFade = Math.max(fade, 0.2); // Minimum 20% always visible
        if (baseFade > 0) {
          const alpha = (intensity / 100) * baseFade * 0.9; // Increased from 0.8
          const flareSize = Math.max(150 * baseFade, 60); // Minimum 60px size!

          // Main flare
          const gradient = ctx.createRadialGradient(flare.x, flare.y, 0, flare.x, flare.y, flareSize);
          gradient.addColorStop(0, theme.highlight + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
          gradient.addColorStop(0.3, theme.primary + Math.floor(alpha * 200).toString(16).padStart(2, '0'));
          gradient.addColorStop(0.6, theme.secondary + Math.floor(alpha * 100).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, theme.secondary + '00');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(flare.x, flare.y, flareSize, 0, Math.PI * 2);
          ctx.fill();

          // Secondary flares (hexagonal pattern)
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const distance = flareSize * 0.6;
            const x = flare.x + Math.cos(angle) * distance;
            const y = flare.y + Math.sin(angle) * distance;
            const secondarySize = flareSize * 0.3;

            const secGradient = ctx.createRadialGradient(x, y, 0, x, y, secondarySize);
            const secAlpha = alpha * 0.5;
            secGradient.addColorStop(0, theme.primary + Math.floor(secAlpha * 255).toString(16).padStart(2, '0'));
            secGradient.addColorStop(1, theme.secondary + '00');

            ctx.fillStyle = secGradient;
            ctx.beginPath();
            ctx.arc(x, y, secondarySize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 13, mixBlendMode: 'screen' }} />;
};

export default LensFlare;

