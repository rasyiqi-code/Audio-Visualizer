import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface ReactiveBorderProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const ReactiveBorder: React.FC<ReactiveBorderProps> = ({ theme, intensity, analyser, isPlaying }) => {
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

      // Always render border, but use audio data if available
      const segments = 20;
      const borderThickness = 10 + (intensity / 100) * 30; // Increased from 5+15 to 10+30 (max 40px)
      
      // Get audio data for each segment
      const segmentValues: number[] = [];
      if (analyser && isPlaying && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const dataStep = Math.floor(dataArray.length / segments);
        for (let i = 0; i < segments; i++) {
          const rawValue = (dataArray[i * dataStep] / 255);
          // Amplify the value for better visibility
          segmentValues.push(Math.min(rawValue * 1.5, 1));
        }
      } else {
        // ALWAYS visible even without audio - animated wave effect
        const time = Date.now() / 1000;
        for (let i = 0; i < segments; i++) {
          const wave = Math.sin(time * 2 + i * 0.3) * 0.3 + 0.7; // Animated wave 0.4-1.0
          segmentValues.push(wave);
        }
      }

      // Draw border segments with better visibility
      const drawSegment = (x: number, y: number, width: number, height: number, segmentIndex: number) => {
        const value = Math.max(segmentValues[segmentIndex] || 0.5, 0.3); // Minimum 0.3
        const actualThickness = borderThickness * (0.5 + value * 1.5);
        
        // Higher opacity - minimum 0.5, max 1.0
        const alpha = Math.floor(Math.max(0.5, value) * 255).toString(16).padStart(2, '0');
        
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, theme.primary + alpha);
        gradient.addColorStop(0.5, theme.secondary + alpha);
        gradient.addColorStop(1, theme.highlight + alpha);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
      };

      const segmentWidth = canvas.width / segments;
      const segmentHeight = canvas.height / segments;

      // Top border
      for (let i = 0; i < segments; i++) {
        drawSegment(i * segmentWidth, 0, segmentWidth, borderThickness, i);
      }

      // Bottom border
      for (let i = 0; i < segments; i++) {
        drawSegment(i * segmentWidth, canvas.height - borderThickness, segmentWidth, borderThickness, i);
      }

      // Left border
      for (let i = 0; i < segments; i++) {
        drawSegment(0, i * segmentHeight, borderThickness, segmentHeight, i);
      }

      // Right border
      for (let i = 0; i < segments; i++) {
        drawSegment(canvas.width - borderThickness, i * segmentHeight, borderThickness, segmentHeight, i);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }} />;
};

export default ReactiveBorder;

