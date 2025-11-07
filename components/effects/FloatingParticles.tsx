import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface FloatingParticlesProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

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

    // Initialize particles
    const particleCount = Math.floor((intensity / 100) * 100);
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5 ? theme.primary : theme.secondary,
      });
    }

    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity
      let audioIntensity = 0.3; // Default
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data every frame
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position with audio boost
        const speedMultiplier = 1 + audioIntensity * 1.5;
        particle.x += particle.vx * speedMultiplier;
        particle.y += particle.vy * speedMultiplier;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulse size with audio - more dramatic
        const pulsedSize = particle.size * (1 + audioIntensity * 1.2);

        // Draw particle with enhanced glow
        const glowSize = 15 + (audioIntensity * 20);
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = particle.color;
        
        // Increase opacity for better visibility
        const finalOpacity = Math.min(particle.opacity * (1 + audioIntensity * 0.5), 1);
        ctx.fillStyle = particle.color + Math.floor(finalOpacity * 255).toString(16).padStart(2, '0');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulsedSize, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 4, opacity: 0.8 }} />;
};

export default FloatingParticles;

