import React, { useEffect, useRef } from 'react';

interface ScreenShakeWrapperProps {
  intensity: number;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const ScreenShakeWrapper: React.FC<ScreenShakeWrapperProps> = ({ intensity, analyser, isPlaying }) => {
  const animationRef = useRef<number>(0);
  const lastShakeTime = useRef<number>(0);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement || intensity === 0) return;

    let dataArray: Uint8Array | null = null;
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!analyser || !isPlaying || !dataArray) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Get fresh audio data
      analyser.getByteFrequencyData(dataArray);

      // Detect bass hits for shake trigger
      const bassSum = dataArray.slice(0, Math.floor(dataArray.length / 10)).reduce((a, b) => a + b, 0);
      const bassAvg = bassSum / Math.floor(dataArray.length / 10);
      const bassIntensity = bassAvg / 255;

      const now = Date.now();
      const timeSinceLastShake = now - lastShakeTime.current;

      // Trigger shake on bass hits - lower threshold, MUCH stronger shake!
      if (bassIntensity > 0.55 && timeSinceLastShake > 200) {
        lastShakeTime.current = now;
        
        // MASSIVE shake amount - up to 30px at 100% intensity!
        const baseShake = (intensity / 100) * 30;
        const shakeAmount = baseShake * (0.5 + bassIntensity * 0.5); // Scale with bass
        const shakeX = (Math.random() - 0.5) * shakeAmount * 2;
        const shakeY = (Math.random() - 0.5) * shakeAmount * 2;
        
        (mainElement as HTMLElement).style.transform = `translate(${shakeX}px, ${shakeY}px)`;
        
        // Return to normal position with slight bounce
        setTimeout(() => {
          if (mainElement) {
            (mainElement as HTMLElement).style.transform = `translate(${shakeX * 0.3}px, ${shakeY * 0.3}px)`;
          }
        }, 40);
        
        setTimeout(() => {
          if (mainElement) {
            (mainElement as HTMLElement).style.transform = 'translate(0, 0)';
          }
        }, 100);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      (mainElement as HTMLElement).style.transform = 'translate(0, 0)';
    };
  }, [intensity, analyser, isPlaying]);

  return null;
};

export default ScreenShakeWrapper;


