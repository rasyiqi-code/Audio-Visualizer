import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';

interface MusicNote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
  size: number;
  opacity: number;
  color: string;
}

interface MusicNotationProps {
  theme: Theme;
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

// Music notation symbols (Unicode) - Moved outside component for stability
const NOTE_SYMBOLS = [
  '♩', // Quarter note
  '♪', // Eighth note
  '♫', // Beamed eighth notes
  '♬', // Beamed sixteenth notes
  '♭', // Flat
  '♮', // Natural
  '♯', // Sharp
  '𝄞', // Treble clef
  '𝄢', // Bass clef
  '𝅝', // Half note
  '𝅗𝅥', // Quarter note (alternative)
  '𝅘𝅥', // Eighth note (alternative)
  '𝅘𝅥𝅮', // Sixteenth note
  '𝄽', // Common time
  '♩♪', // Combined notes
];

const MusicNotation: React.FC<MusicNotationProps> = ({ theme, intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const notesRef = useRef<MusicNote[]>([]);
  const lastSpawnTime = useRef<number>(0);
  const lastBeatTime = useRef<number>(0);

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

    // Clear existing notes when effect is re-initialized
    notesRef.current = [];
    lastSpawnTime.current = 0;

    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    // Spawn initial notes immediately for visibility
    const spawnInitialNotes = () => {
      // Always spawn minimum 8 notes even at low intensity
      const initialCount = Math.max(8, Math.floor((intensity / 100) * 15) + 5);
      for (let i = 0; i < initialCount; i++) {
        const spawnSide = Math.random();
        let startX, startY, vx, vy;
        
        if (spawnSide < 0.4) {
          startX = Math.random() * canvas.width;
          startY = Math.random() * canvas.height * 0.3; // Start in upper area
          vx = (Math.random() - 0.5) * 1.5; // Slower horizontal
          vy = Math.random() * 1.5 + 0.8; // Slower falling
        } else if (spawnSide < 0.7) {
          startX = Math.random() * canvas.width * 0.3;
          startY = Math.random() * canvas.height;
          vx = Math.random() * 1.5 + 0.8; // Slower moving right
          vy = (Math.random() - 0.5) * 0.8;
        } else {
          startX = canvas.width * 0.7 + Math.random() * canvas.width * 0.3;
          startY = Math.random() * canvas.height;
          vx = -(Math.random() * 1.5 + 0.8); // Slower moving left
          vy = (Math.random() - 0.5) * 0.8;
        }
        
        notesRef.current.push({
          x: startX,
          y: startY,
          vx: vx,
          vy: vy,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
          size: Math.random() * 50 + 40, // Larger notes (40-90px)
          opacity: Math.random() * 0.3 + 0.7, // Higher opacity (0.7-1.0)
          color: Math.random() > 0.5 ? theme.primary : theme.secondary,
        });
      }
    };

    // Spawn initial notes
    spawnInitialNotes();

    const spawnNote = () => {
      // Always spawn minimum 2 notes even at low intensity
      const noteCount = Math.max(2, Math.floor((intensity / 100) * 4) + 1);
      
      for (let i = 0; i < noteCount; i++) {
        const spawnSide = Math.random();
        let startX, startY, vx, vy;
        
        if (spawnSide < 0.4) {
          // Spawn from top (falling down)
          startX = Math.random() * canvas.width;
          startY = -50;
          vx = (Math.random() - 0.5) * 1.5; // Slower horizontal
          vy = Math.random() * 1.5 + 0.8; // Slower falling
        } else if (spawnSide < 0.7) {
          // Spawn from left (moving right)
          startX = -50;
          startY = Math.random() * canvas.height;
          vx = Math.random() * 1.5 + 0.8; // Slower moving right
          vy = (Math.random() - 0.5) * 0.8;
        } else {
          // Spawn from right (moving left)
          startX = canvas.width + 50;
          startY = Math.random() * canvas.height;
          vx = -(Math.random() * 1.5 + 0.8); // Slower moving left
          vy = (Math.random() - 0.5) * 0.8;
        }
        
        notesRef.current.push({
          x: startX,
          y: startY,
          vx: vx,
          vy: vy,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
          size: Math.random() * 50 + 40, // Larger notes (40-90px)
          opacity: Math.random() * 0.3 + 0.7, // Higher opacity (0.7-1.0)
          color: Math.random() > 0.5 ? theme.primary : theme.secondary,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Ensure canvas has correct dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get audio intensity and detect beats
      let audioIntensity = 0.3; // Default (more spawning)
      let bassIntensity = 0;
      let isBeat = false;
      
      if (analyser && isPlaying && dataArray) {
        // Get fresh audio data
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          // Overall audio intensity
          let sum = 0;
          for (let i = 0; i < Math.min(dataArray.length, 50); i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / Math.min(dataArray.length, 50)) / 255;
          
          // Bass detection for beat
          let bassSum = 0;
          const bassRange = Math.floor(dataArray.length / 8);
          for (let i = 0; i < bassRange; i++) {
            bassSum += dataArray[i];
          }
          bassIntensity = (bassSum / bassRange) / 255;
          
          // Beat detection - strong bass with cooldown
          const now = Date.now();
          const timeSinceLastBeat = now - lastBeatTime.current;
          if (bassIntensity > 0.6 && timeSinceLastBeat > 200) {
            isBeat = true;
            lastBeatTime.current = now;
          }
        }
      }

      // Beat-responsive spawning
      let now = Date.now();
      
      // Spawn EXTRA notes on beat!
      if (isBeat && intensity > 0) {
        // Spawn burst of notes on beat (3-6 notes)
        const beatBurst = Math.floor(Math.random() * 4) + 3;
        for (let i = 0; i < beatBurst; i++) {
          spawnNote();
        }
        lastSpawnTime.current = now; // Reset timer
      }
      
      // Regular spawning between beats
      const spawnInterval = 600 - (audioIntensity * 400); // Range: 200-600ms
      if (now - lastSpawnTime.current > spawnInterval && intensity > 0) {
        spawnNote();
        lastSpawnTime.current = now;
      }
      
      // If no notes visible, force spawn some
      if (notesRef.current.length === 0 && intensity > 0) {
        spawnInitialNotes();
      }

      // Update and draw notes
      notesRef.current = notesRef.current.filter(note => {
        // Beat-responsive movement boost
        const speedBoost = isBeat ? 1.5 : (1 + audioIntensity * 0.5);
        
        // Update position with beat boost
        note.x += note.vx * speedBoost;
        note.y += note.vy * speedBoost;
        
        // Faster rotation on beat
        note.rotation += note.rotationSpeed * (isBeat ? 2 : 1);

        // Remove if off screen (any direction)
        if (note.y > canvas.height + 100 || 
            note.y < -100 || 
            note.x > canvas.width + 100 || 
            note.x < -100) {
          return false;
        }

        // Draw note with enhanced styling
        ctx.save();
        ctx.translate(note.x, note.y);
        ctx.rotate(note.rotation);
        
        // Beat-responsive size pulse
        const sizePulse = isBeat ? 1.3 : 1;
        const displaySize = note.size * sizePulse;
        
        // Use better font for music symbols with beat-responsive size
        ctx.font = `bold ${displaySize}px "Segoe UI Symbol", "Arial Unicode MS", Arial`;
        
        // Beat-responsive opacity boost
        const opacityBoost = isBeat ? Math.min(note.opacity * 1.3, 1) : note.opacity;
        ctx.fillStyle = note.color + Math.floor(opacityBoost * 255).toString(16).padStart(2, '0');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // No glow/shadow effects - clean rendering
        ctx.shadowBlur = 0;
        ctx.fillText(note.symbol, 0, 0);
        
        ctx.restore();

        return true;
      });

      // Increase limit number of notes
      if (notesRef.current.length > 80) {
        notesRef.current = notesRef.current.slice(-80);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme, intensity, analyser, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        zIndex: 10, // Effect layer - below controls
        opacity: 1,
        display: intensity > 0 ? 'block' : 'none'
      }} 
    />
  );
};

export default MusicNotation;

