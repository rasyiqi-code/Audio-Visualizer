import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface GridBackgroundProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity and detect beats
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
      
      beatPulseRef.current *= 0.85;

      const gridSize = 50;
      // BEAT-RESPONSIVE brightness!
      const baseAlpha = (intensity / 100) * 0.7;
      const alpha = baseAlpha * (1 + beatPulseRef.current * 0.5);
      
      // BEAT-RESPONSIVE scroll speed!
      const scrollSpeed = isBeat ? 3 : (0.5 * (1 + audioIntensity * 0.5));
      offsetRef.current += scrollSpeed;
      if (offsetRef.current >= gridSize) offsetRef.current = 0;

      // Draw vertical lines
      for (let x = offsetRef.current; x < canvas.width; x += gridSize) {
        const lineAlpha = alpha * (0.5 + audioIntensity * 0.5);
        
        // Gradient from top to bottom
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height);
        gradient.addColorStop(0, theme.primary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, theme.secondary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, theme.primary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2; // Thicker lines!
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offsetRef.current; y < canvas.height; y += gridSize) {
        const lineAlpha = alpha * (0.5 + audioIntensity * 0.5);
        
        // Gradient from left to right
        const gradient = ctx.createLinearGradient(0, y, canvas.width, y);
        gradient.addColorStop(0, theme.secondary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, theme.primary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, theme.secondary + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2; // Thicker lines!
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // BEAT-RESPONSIVE intersection points - EXPLOSION on beat!
      const dotChance = isBeat ? 0.5 : 0.9; // 50% chance on beat vs 10% normal
      for (let x = offsetRef.current; x < canvas.width; x += gridSize) {
        for (let y = offsetRef.current; y < canvas.height; y += gridSize) {
          if (Math.random() > dotChance) {
            // MASSIVE glow on beat!
            const glowSize = isBeat ? 40 : (10 + audioIntensity * 15);
            const dotSize = isBeat ? 6 : 3; // Bigger dots on beat!
            
            ctx.fillStyle = theme.highlight + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.shadowBlur = glowSize;
            ctx.shadowColor = theme.highlight;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.95 }} />;
};

export default GridBackground;

