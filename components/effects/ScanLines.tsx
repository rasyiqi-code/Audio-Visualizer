import React, { useEffect, useRef } from 'react';

interface ScanLinesProps {
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const ScanLines: React.FC<ScanLinesProps> = ({ intensity, analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

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

      // Get audio intensity
      let audioIntensity = 0.3; // Default
      
      if (analyser && isPlaying && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        
        if (dataArray.length > 0) {
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          audioIntensity = (sum / dataArray.length) / 255;
        }
      }

      const lineSpacing = 4;
      // Increase base alpha and make it pulse with audio
      const baseAlpha = (intensity / 100) * 0.3;
      const alpha = baseAlpha * (1 + audioIntensity * 0.7);
      
      // Speed up scroll with audio
      offsetRef.current += 0.5 * (1 + audioIntensity * 0.5);
      if (offsetRef.current >= lineSpacing) offsetRef.current = 0;

      // Draw horizontal scan lines with audio-reactive brightness
      for (let y = -lineSpacing + offsetRef.current; y < canvas.height; y += lineSpacing) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, y, canvas.width, 1);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, analyser, isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }} />;
};

export default ScanLines;

