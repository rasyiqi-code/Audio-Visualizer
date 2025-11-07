import React, { useEffect, useRef, useState } from 'react';
import { Theme } from '../types';

interface WatermarkProps {
  theme: Theme;
  isPlaying?: boolean;
  audioData?: Uint8Array;
}

const Watermark: React.FC<WatermarkProps> = ({ theme, isPlaying = false, audioData }) => {
  const [position, setPosition] = useState({ top: 6, left: 6 });
  const [opacity, setOpacity] = useState(0.6);
  const animationRef = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const isFading = useRef<boolean>(false);

  useEffect(() => {
    if (!isPlaying) {
      // Reset to default position when not playing
      setPosition({ top: 6, left: 6 });
      setOpacity(0.6);
      return;
    }

    const animate = () => {
      const now = Date.now();
      
      // Move watermark every 25 seconds
      if (now - lastMoveTime.current > 25000 && !isFading.current) {
        isFading.current = true;
        
        // Fade out
        setOpacity(0);
        
        // After fade out, move to new position and fade in
        setTimeout(() => {
          // Calculate new random position
          const maxTop = window.innerHeight - 120; // Avoid bottom controls
          const maxLeft = window.innerWidth - 320; // Width of watermark
          
          const newTop = Math.random() * (maxTop - 60) + 30;
          const newLeft = Math.random() * (maxLeft - 60) + 30;
          
          setPosition({
            top: newTop,
            left: newLeft
          });
          
          // Fade in at new position
          setTimeout(() => {
            setOpacity(0.6);
            isFading.current = false;
            lastMoveTime.current = now;
          }, 100);
        }, 600); // Wait for fade out to complete
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioData]);

  return (
    <div 
      className="absolute z-50 flex items-center gap-3 pointer-events-none select-none"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: opacity,
        transition: 'top 0.8s ease-in-out, left 0.8s ease-in-out, opacity 0.6s ease-in-out',
      }}
    >
      {/* AV Logo with SVG */}
      <div className="relative group">
        <svg width="40" height="40" viewBox="0 0 48 48" className="drop-shadow-lg opacity-90">
          <defs>
            <linearGradient id="avGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: theme.primary, stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: theme.secondary, stopOpacity: 0.9 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer glow circle */}
          <circle 
            cx="24" 
            cy="24" 
            r="22" 
            fill="url(#avGradient)" 
            opacity="0.2"
          />
          
          {/* Main circle */}
          <circle 
            cx="24" 
            cy="24" 
            r="20" 
            fill="url(#avGradient)"
            filter="url(#glow)"
          />
          
          {/* AV Text */}
          <text 
            x="24" 
            y="30" 
            textAnchor="middle" 
            fill="white" 
            fontSize="18" 
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            filter="url(#glow)"
          >
            AV
          </text>
          
          {/* Decorative arc */}
          <path
            d="M 8 24 Q 24 8, 40 24"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col gap-0 leading-tight">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span 
            className="text-xl font-black tracking-tight drop-shadow-lg"
            style={{ 
              color: 'white',
              textShadow: `0 0 8px ${theme.primary}60, 0 0 16px ${theme.secondary}30`,
            }}
          >
            Audio Visualizer
          </span>
          <span 
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: theme.secondary + '40',
              color: theme.highlight,
              border: `1px solid ${theme.secondary}60`,
            }}
          >
            free
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="text-[11px] font-normal opacity-60"
            style={{ color: theme.primary }}
          >
            by breaktool.com
          </span>
          <span className="text-gray-500 opacity-40 text-xs">•</span>
          <span 
            className="text-[10px] font-normal opacity-50 italic"
            style={{ color: theme.highlight }}
          >
            get pro to remove me
          </span>
        </div>
      </div>
    </div>
  );
};

export default Watermark;

