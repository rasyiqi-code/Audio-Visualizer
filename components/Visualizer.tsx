import React, { useRef, useEffect } from 'react';
import { Visualization, Theme } from '../types';
import * as drawing from './visualizer/drawing';

// FIX: This file was missing. Implemented the Visualizer component.
// This component is responsible for rendering the audio visualization on a canvas
// using requestAnimationFrame for a smooth animation loop.
interface VisualizerProps {
  analyser: AnalyserNode | null;
  visualization: Visualization;
  theme: Theme;
  isPlaying: boolean;
  isRecording?: boolean;
}

// Store custom functions in a cache to avoid re-creating them on every render.
const customFunctionCache = new Map<string, Function>();

const Visualizer: React.FC<VisualizerProps> = ({ analyser, visualization, theme, isPlaying, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || (!isPlaying && !isRecording)) {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let customDrawFunction: Function | null = null;
    if ('isCustom' in visualization && visualization.isCustom) {
        if (customFunctionCache.has(visualization.code)) {
            customDrawFunction = customFunctionCache.get(visualization.code)!;
        } else {
            try {
                // Using new Function is safer than eval. It creates the function in the global scope.
                const newFunc = new Function('ctx', 'dataArray', 'bufferLength', 'width', 'height', 'theme', 'sensitivity', visualization.code);
                customFunctionCache.set(visualization.code, newFunc);
                customDrawFunction = newFunc;
            } catch (e) {
                console.error("Error creating custom visualization function:", e);
                // Optionally, we could show an error on the canvas here.
            }
        }
    }


    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const { width, height } = canvas; // Use canvas direct properties for rendering logic
      
      // Get data based on visualization type. Waveform uses time domain, others use frequency.
      if (visualization.type === 'WAVEFORM') {
          analyser.getByteTimeDomainData(dataArray);
      } else {
          analyser.getByteFrequencyData(dataArray);
      }

      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);

      const sensitivity = 1.2; // A slight boost to make visualizations more lively.

      if ('isCustom' in visualization && visualization.isCustom && customDrawFunction) {
        try {
          ctx.save();
          customDrawFunction(ctx, dataArray, bufferLength, width, height, theme, sensitivity);
          ctx.restore();
        } catch(e) {
            console.error("Error running custom visualization:", e);
            // Invalidate the function if it's faulty
            customFunctionCache.delete(visualization.code);
        }
      } else if (!('isCustom' in visualization)) {
        ctx.save();
        switch (visualization.type) {
          case 'BARS':
            drawing.drawBars(ctx, dataArray, bufferLength, width, height, theme, sensitivity);
            break;
          case 'WAVEFORM':
            drawing.drawWaveform(ctx, dataArray, bufferLength, width, height, theme, sensitivity);
            break;
          case 'CIRCLE':
            drawing.drawCircle(ctx, dataArray, bufferLength, width, height, theme, sensitivity);
            break;
        }
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, visualization, theme, isPlaying, isRecording]);

  // Effect for handling canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set initial size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx?.scale(dpr, dpr);

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx?.scale(dpr, dpr);
      }
    });
    resizeObserver.observe(canvas.parentElement!);
    return () => resizeObserver.disconnect();
  }, []);

  return <canvas ref={canvasRef} id="visualizer-canvas" className="absolute top-0 left-0 w-full h-full" />;
};

export default Visualizer;
