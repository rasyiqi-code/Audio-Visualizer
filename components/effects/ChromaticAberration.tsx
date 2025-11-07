import React, { useEffect, useRef } from 'react';

interface ChromaticAberrationProps {
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({ intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || intensity === 0) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

      const visualizerCanvas = document.getElementById('visualizer-canvas') as HTMLCanvasElement;
      if (!visualizerCanvas) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity for peaks
      let audioIntensity = 0;
      
      if (analyser && isPlaying && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          const bassRange = Math.floor(dataArray.length / 8);
          for (let i = 0; i < bassRange; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / bassRange) / 255;
        }
      }

      // Calculate offset - ALWAYS visible at intensity > 0
      let offset = Math.max((intensity / 100) * 8, 3); // Minimum 3px
      let opacity = 0.5;
      
      if (analyser && isPlaying && audioIntensity > 0.1) {
        offset = (intensity / 100) * Math.max(audioIntensity * 30, 8);
        opacity = Math.min(0.5 + audioIntensity * 0.4, 0.9);
      }

      // Draw RED channel (shifted right)
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = opacity;
      try {
        ctx.drawImage(visualizerCanvas, offset, 0);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // Fallback if drawImage fails
      }

      // Draw CYAN channel (shifted left)
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = opacity;
      try {
        ctx.drawImage(visualizerCanvas, -offset, 0);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgb(0, 255, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // Fallback if drawImage fails
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 3, mixBlendMode: 'screen' }}
    />
  );
};

export default ChromaticAberration;

