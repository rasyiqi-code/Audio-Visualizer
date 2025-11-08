import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface OrbitingShapesProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'square' | 'triangle';
  colorIndex: number;
}

const OrbitingShapes: React.FC<OrbitingShapesProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastBeatTime = useRef<number>(0);
  const beatPulseRef = useRef<number>(0);
  const shapesRef = useRef<Shape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    // Initialize bouncing shapes - DEFINE FIRST before using in resize!
    const initShapes = () => {
      shapesRef.current = [];
      const numShapes = 6;
      const shapeTypes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
      
      for (let i = 0; i < numShapes; i++) {
        shapesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4, // -2 to +2 pixels per frame
          vy: (Math.random() - 0.5) * 4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          type: shapeTypes[i % shapeTypes.length],
          colorIndex: i % 2
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize shapes on resize
      initShapes();
    };
    
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity and detect beats
      let audioIntensity = 0.5; // Higher default for visibility
      let bassIntensity = 0;
      let isBeat = false;
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          // Overall audio intensity
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
          
          // Bass detection for beat
          let bassSum = 0;
          const bassRange = Math.floor(dataArray.length / 8);
          for (let i = 0; i < bassRange; i++) {
            bassSum += dataArray[i];
          }
          bassIntensity = (bassSum / bassRange) / 255;
          
          // Beat detection
          const now = Date.now();
          const timeSinceLastBeat = now - lastBeatTime.current;
          if (bassIntensity > 0.65 && timeSinceLastBeat > 200) {
            isBeat = true;
            lastBeatTime.current = now;
            beatPulseRef.current = 1.0; // Full pulse on beat
          }
        }
      }
      
      // Decay beat pulse smoothly
      beatPulseRef.current *= 0.85;

      // Update and draw bouncing shapes
      shapesRef.current.forEach((shape, i) => {
        // Beat-responsive speed boost!
        const speedMultiplier = isBeat ? 2 : (1 + audioIntensity * 0.5);
        
        // Update position
        shape.x += shape.vx * speedMultiplier;
        shape.y += shape.vy * speedMultiplier;
        
        // Beat-responsive rotation
        const rotationBoost = isBeat ? 3 : 1;
        shape.rotation += shape.rotationSpeed * rotationBoost;
        
        // Bounce off edges with margin for shape size
        const margin = 80; // Account for max shape size
        
        if (shape.x < margin) {
          shape.x = margin;
          shape.vx = Math.abs(shape.vx); // Reverse to move right
          if (isBeat) shape.vx *= 1.5; // Extra speed on beat bounce
        } else if (shape.x > canvas.width - margin) {
          shape.x = canvas.width - margin;
          shape.vx = -Math.abs(shape.vx); // Reverse to move left
          if (isBeat) shape.vx *= 1.5;
        }
        
        if (shape.y < margin) {
          shape.y = margin;
          shape.vy = Math.abs(shape.vy); // Reverse to move down
          if (isBeat) shape.vy *= 1.5;
        } else if (shape.y > canvas.height - margin) {
          shape.y = canvas.height - margin;
          shape.vy = -Math.abs(shape.vy); // Reverse to move up
          if (isBeat) shape.vy *= 1.5;
        }
        
        const x = shape.x;
        const y = shape.y;
        
        // BEAT-RESPONSIVE SIZE - HUGE PULSE on beat!
        const baseSize = 30 + (intensity / 100) * 30; // 30-60px base
        const audioSize = baseSize + audioIntensity * 20; // up to 80px with audio
        const beatPulse = 1 + (beatPulseRef.current * 0.5); // Up to 50% bigger on beat!
        const size = audioSize * beatPulse;
        
        // BEAT-RESPONSIVE OPACITY - Flash brighter on beat!
        const baseAlpha = Math.max(0.7, (intensity / 100) * 0.9);
        const alpha = Math.min(baseAlpha + (beatPulseRef.current * 0.3), 1.0);
        
        // BEAT-RESPONSIVE COLOR - Flash highlight color on beat!
        let color = shape.colorIndex === 0 ? theme.primary : theme.secondary;
        if (beatPulseRef.current > 0.7) {
          color = theme.highlight; // Flash highlight color on strong beat
        }
        
        // MASSIVE glow on beat!
        const glowSize = isBeat ? 60 : (20 + (audioIntensity * 25));
        ctx.shadowBlur = glowSize + (beatPulseRef.current * 30);
        ctx.shadowColor = color;
        
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.strokeStyle = theme.highlight + Math.floor(Math.min(alpha * 1.2, 1) * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 4; // Even thicker stroke

        ctx.save();
        ctx.translate(x, y);
        
        // Use shape's own rotation
        ctx.rotate(shape.rotation);

        if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Add inner glow circle
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (shape.type === 'square') {
          ctx.fillRect(-size, -size, size * 2, size * 2);
          ctx.strokeRect(-size, -size, size * 2, size * 2);
          
          // Add inner outline
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(-size + 3, -size + 3, size * 2 - 6, size * 2 - 6);
        } else if (shape.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, size);
          ctx.lineTo(-size, size);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Add inner outline
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -size + 5);
          ctx.lineTo(size - 5, size - 3);
          ctx.lineTo(-size + 5, size - 3);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.shadowBlur = 0; // Reset shadow
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 14 }} />;
};

export default OrbitingShapes;

