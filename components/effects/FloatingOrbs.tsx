import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  pulsePhase: number;
}

interface FloatingOrbsProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
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

    // Initialize orbs - always spawn minimum orbs!
    const numOrbs = Math.max(6, Math.floor((intensity / 100) * 10) + 4); // Minimum 6 orbs
    orbsRef.current = [];
    for (let i = 0; i < numOrbs; i++) {
      orbsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1, // Faster movement
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 100 + 80, // MUCH bigger orbs! 80-180px
        color: [theme.primary, theme.secondary, theme.highlight][Math.floor(Math.random() * 3)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

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

      // Update and draw orbs
      orbsRef.current.forEach((orb) => {
        // BEAT-RESPONSIVE speed!
        const speedBoost = isBeat ? 2.5 : (1 + audioIntensity * 0.5);
        orb.x += orb.vx * speedBoost;
        orb.y += orb.vy * speedBoost;
        
        // BEAT-RESPONSIVE pulse speed!
        const pulseSpeed = isBeat ? 0.15 : (0.03 * (1 + audioIntensity));
        orb.pulsePhase += pulseSpeed;

        // Bounce off edges with margin
        const margin = 200; // Account for orb size
        if (orb.x < margin || orb.x > canvas.width - margin) orb.vx *= -1;
        if (orb.y < margin || orb.y > canvas.height - margin) orb.vy *= -1;

        // Keep in bounds
        orb.x = Math.max(margin, Math.min(canvas.width - margin, orb.x));
        orb.y = Math.max(margin, Math.min(canvas.height - margin, orb.y));

        // BEAT-RESPONSIVE SIZE - HUGE PULSE on beat!
        const normalPulse = 1 + Math.sin(orb.pulsePhase) * 0.3 + audioIntensity * 0.5;
        const beatBoost = 1 + beatPulseRef.current * 0.6; // +60% on beat!
        const actualSize = orb.size * normalPulse * beatBoost;

        // Create MUCH stronger radial gradient for dark backgrounds
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, actualSize);
        
        const alpha = (intensity / 100) * 0.95; // VERY high alpha!
        gradient.addColorStop(0, orb.color + 'FF'); // Fully opaque center!
        gradient.addColorStop(0.3, orb.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.6, orb.color + Math.floor(alpha * 180).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.8, orb.color + Math.floor(alpha * 100).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, orb.color + '20');

        // Draw main orb - NO blur for better visibility on dark bg
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, actualSize, 0, Math.PI * 2);
        ctx.fill();
        
        // BEAT-RESPONSIVE MASSIVE glow layer!
        const glowBase = 60 + audioIntensity * 60;
        const glowSize = isBeat ? 150 : glowBase; // EXPLOSION on beat!
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = orb.color;
        ctx.fillStyle = orb.color + Math.floor(alpha * 200).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, actualSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Second glow layer for ultra softness
        ctx.shadowBlur = 100;
        ctx.fillStyle = orb.color + Math.floor(alpha * 120).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, actualSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

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

export default FloatingOrbs;
