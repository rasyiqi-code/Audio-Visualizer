import React, { useEffect, useRef, useCallback } from 'react';
import { BackgroundImageSettings } from '../types';

interface BackgroundImageProps {
  settings: BackgroundImageSettings;
  isPlaying: boolean;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ settings, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number>(0);

  const renderImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    ctx.filter = `blur(${settings.blur}px) brightness(${settings.brightness}%)`;
    ctx.globalAlpha = settings.opacity / 100;

    // Calculate dimensions based on position mode
    let dx = 0, dy = 0, dw = canvas.width, dh = canvas.height;
    
    switch (settings.position) {
      case 'fill': {
        // Cover the entire canvas (crop if needed)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        if (canvasRatio > imgRatio) {
          // Canvas is wider
          dw = canvas.width;
          dh = canvas.width / imgRatio;
          dy = (canvas.height - dh) / 2;
        } else {
          // Canvas is taller
          dh = canvas.height;
          dw = canvas.height * imgRatio;
          dx = (canvas.width - dw) / 2;
        }
        break;
      }
      case 'fit': {
        // Contain the entire image (letterbox if needed)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        if (canvasRatio > imgRatio) {
          // Canvas is wider, fit to height
          dh = canvas.height;
          dw = canvas.height * imgRatio;
          dx = (canvas.width - dw) / 2;
        } else {
          // Canvas is taller, fit to width
          dw = canvas.width;
          dh = canvas.width / imgRatio;
          dy = (canvas.height - dh) / 2;
        }
        break;
      }
      case 'stretch': {
        // Stretch to fill entire canvas
        dx = 0;
        dy = 0;
        dw = canvas.width;
        dh = canvas.height;
        break;
      }
      case 'center':
      default: {
        // Center at original size (with scale)
        const scale = settings.scale / 100;
        dw = img.width * scale;
        dh = img.height * scale;
        dx = (canvas.width - dw) / 2;
        dy = (canvas.height - dh) / 2;
        break;
      }
    }

    // Apply scale for non-stretch modes
    if (settings.position !== 'stretch' && settings.position !== 'center') {
      const scale = settings.scale / 100;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      dw *= scale;
      dh *= scale;
      dx = centerX - dw / 2;
      dy = centerY - dh / 2;
    }

    // Draw image
    try {
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch (error) {
      console.error('Error drawing background image:', error);
    }

    // Reset filters
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  }, [settings.opacity, settings.blur, settings.brightness, settings.scale, settings.position]);

  useEffect(() => {
    if (!settings.imageUrl) {
      imageRef.current = null;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      return;
    }

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = settings.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      renderImage();
    };
    img.onerror = () => {
      console.error('Failed to load background image');
    };

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [settings.imageUrl, renderImage]);

  useEffect(() => {
    renderImage();
  }, [renderImage]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      renderImage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderImage]);

  if (!settings.imageUrl) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default BackgroundImage;

