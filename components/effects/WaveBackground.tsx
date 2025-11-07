import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface WaveBackgroundProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
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
      
      beatPulseRef.current *= 0.88;

      // BEAT BOOST on speed!
      const speedBoost = isBeat ? 4 : (1 + audioIntensity);
      timeRef.current += 0.03 * speedBoost;

      // Draw multiple wave layers
      const numLayers = 5; // More layers!
      for (let layer = 0; layer < numLayers; layer++) {
        ctx.beginPath();
        
        const layerHeight = canvas.height * (0.2 + layer * 0.18);
        // BEAT-RESPONSIVE wave height!
        const baseAmplitude = 80 + audioIntensity * 150;
        const amplitude = baseAmplitude * (1 + beatPulseRef.current * 0.7); // +70% on beat!
        const frequency = 0.01 + layer * 0.002;
        const phase = timeRef.current + layer * Math.PI / 2;
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = layerHeight + Math.sin(x * frequency + phase) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // BEAT-RESPONSIVE alpha - brighter on beat!
        const baseAlpha = (intensity / 100) * 0.45 * (1 - layer / numLayers * 0.4);
        const alpha = baseAlpha * (1 + beatPulseRef.current * 0.5);
        const colors = [theme.primary, theme.secondary, theme.highlight, theme.primary, theme.secondary];
        const color = colors[layer];
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.9 }} />;
};

export default WaveBackground;
