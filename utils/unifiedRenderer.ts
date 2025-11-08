/**
 * Unified Canvas Renderer
 * Render SEMUA efek + visualizer ke SATU canvas untuk perfect export
 * 
 * Strategy: Instead of multiple canvases, render everything to one canvas
 * This ensures MediaRecorder captures everything without compositing overhead
 */

import { Theme, VisualEffects } from '../types';

interface CanvasLayer {
  render: (ctx: CanvasRenderingContext2D, width: number, height: number, audioData: Uint8Array, theme: Theme, deltaTime: number) => void;
  zIndex: number;
  blendMode?: GlobalCompositeOperation;
  opacity?: number;
}

export class UnifiedRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: CanvasLayer[] = [];
  private lastTime: number = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });
    
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    
    this.ctx = ctx;
  }

  /**
   * Render single frame dengan semua layers
   */
  public renderFrame(
    audioData: Uint8Array,
    theme: Theme,
    effects: VisualEffects,
    visualizerRender: (ctx: CanvasRenderingContext2D) => void
  ): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const { width, height } = this.canvas;
    
    // Clear with background
    this.ctx.fillStyle = theme.background;
    this.ctx.fillRect(0, 0, width, height);

    // Render layers in z-index order
    // Layer 0: Background effects
    // Layer 1: Main visualizer
    // Layer 2: Overlay effects
    
    this.ctx.save();
    
    // Background effects would go here (simplified for now)
    // In production, call individual effect render functions
    
    // Main visualizer
    visualizerRender(this.ctx);
    
    // Overlay effects would go here
    
    this.ctx.restore();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}

