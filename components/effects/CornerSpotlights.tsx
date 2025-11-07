import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface CornerSpotlightsProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const CornerSpotlights: React.FC<CornerSpotlightsProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

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

      // Get frequency data for each corner - ALWAYS have minimum values!
      let bass = 0.5, mid = 0.5, treble = 0.5, high = 0.5; // Higher defaults
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data every frame
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          const third = Math.floor(dataArray.length / 3);
          bass = Math.max(0.5, dataArray[Math.floor(third * 0.2)] / 255); // Minimum 0.5
          mid = Math.max(0.5, dataArray[Math.floor(third * 1)] / 255);
          treble = Math.max(0.5, dataArray[Math.floor(third * 1.8)] / 255);
          high = Math.max(0.5, dataArray[Math.floor(third * 2.5)] / 255);
        }
      }

      const baseRadius = Math.max(canvas.width, canvas.height) * 0.4;
      const alpha = intensity / 100;

      // Top-left (bass) - PRIMARY color
      const radiusTL = baseRadius * (0.5 + bass * 0.5); // Always at least 50% radius
      const gradientTL = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusTL);
      gradientTL.addColorStop(0, theme.primary + Math.floor(alpha * 200 * bass).toString(16).padStart(2, '0'));
      gradientTL.addColorStop(0.5, theme.primary + Math.floor(alpha * 100 * bass).toString(16).padStart(2, '0'));
      gradientTL.addColorStop(1, theme.primary + '00');
      ctx.fillStyle = gradientTL;
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Top-right (mid) - SECONDARY color
      const radiusTR = baseRadius * (0.5 + mid * 0.5);
      const gradientTR = ctx.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, radiusTR);
      gradientTR.addColorStop(0, theme.secondary + Math.floor(alpha * 200 * mid).toString(16).padStart(2, '0'));
      gradientTR.addColorStop(0.5, theme.secondary + Math.floor(alpha * 100 * mid).toString(16).padStart(2, '0'));
      gradientTR.addColorStop(1, theme.secondary + '00');
      ctx.fillStyle = gradientTR;
      ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);

      // Bottom-left (treble) - HIGHLIGHT color
      const radiusBL = baseRadius * (0.5 + treble * 0.5);
      const gradientBL = ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, radiusBL);
      gradientBL.addColorStop(0, theme.highlight + Math.floor(alpha * 200 * treble).toString(16).padStart(2, '0'));
      gradientBL.addColorStop(0.5, theme.highlight + Math.floor(alpha * 100 * treble).toString(16).padStart(2, '0'));
      gradientBL.addColorStop(1, theme.highlight + '00');
      ctx.fillStyle = gradientBL;
      ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

      // Bottom-right (high) - Mix color
      const radiusBR = baseRadius * (0.5 + high * 0.5);
      const gradientBR = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, radiusBR);
      gradientBR.addColorStop(0, theme.primary + Math.floor(alpha * 200 * high).toString(16).padStart(2, '0'));
      gradientBR.addColorStop(0.5, theme.secondary + Math.floor(alpha * 100 * high).toString(16).padStart(2, '0'));
      gradientBR.addColorStop(1, theme.highlight + '00');
      ctx.fillStyle = gradientBR;
      ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 80, mixBlendMode: 'screen' }} />;
};

export default CornerSpotlights;

