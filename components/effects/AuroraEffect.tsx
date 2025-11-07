import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface AuroraEffectProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const AuroraEffect: React.FC<AuroraEffectProps> = ({ theme, intensity, analyser, isPlaying }) => {
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
      let audioIntensity = 0.6; // MUCH higher default!
      let bassIntensity = 0;
      let isBeat = false;
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data
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
      
      // Decay beat pulse
      beatPulseRef.current *= 0.9;

      // SPEED BOOST on beat!
      const speedBoost = isBeat ? 3 : (1 + audioIntensity * 0.5);
      timeRef.current += 0.01 * speedBoost;

      // Draw multiple aurora layers - FULL SCREEN COVERAGE!
      const numLayers = 5; // Even more layers!
      for (let layer = 0; layer < numLayers; layer++) {
        ctx.beginPath();
        
        // Spread layers across entire height
        const yOffset = canvas.height * (0.15 + layer * 0.17);
        // BEAT-RESPONSIVE amplitude - EXPLOSION on beat!
        const baseAmplitude = 150 + audioIntensity * 200;
        const amplitude = baseAmplitude * (1 + beatPulseRef.current * 0.6); // +60% on beat!
        const points = 150; // Smoother curves
        
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * canvas.width;
          // Multiple overlapping waves for organic aurora look
          const wave1 = Math.sin((i / points) * Math.PI * 3 + timeRef.current + layer) * amplitude;
          const wave2 = Math.sin((i / points) * Math.PI * 2 - timeRef.current * 0.5 + layer) * amplitude * 0.6;
          const wave3 = Math.cos((i / points) * Math.PI * 5 + timeRef.current * 0.7 + layer) * amplitude * 0.3;
          const y = yOffset + wave1 + wave2 + wave3;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // ULTRA strong gradient for dark backgrounds + BEAT PULSE!
        const gradient = ctx.createLinearGradient(0, yOffset - amplitude * 0.5, 0, yOffset + amplitude);
        const baseAlpha = (intensity / 100) * 0.9;
        const alpha = Math.min(baseAlpha + (beatPulseRef.current * 0.3), 1.0); // Brighter on beat!
        
        // Ensure colors are defined with fallbacks
        const colors = [
          theme.primary || '#FF0066', 
          theme.secondary || '#00FFFF', 
          theme.highlight || '#FFFF00', 
          theme.primary || '#FF0066'
        ];
        const color = colors[layer % colors.length];
        
        // Much more opaque colors!
        gradient.addColorStop(0, color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.3, color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.6, color + Math.floor(alpha * 200).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, color + '20'); // Slight base instead of 00
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glow effect for extra visibility
        ctx.strokeStyle = color + Math.floor(alpha * 150).toString(16).padStart(2, '0');
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 1 }} />;
};

export default AuroraEffect;
