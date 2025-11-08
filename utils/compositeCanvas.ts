/**
 * Composite Canvas Recorder
 * Menggabungkan semua canvas layer (efek + visualizer) menjadi 1 canvas untuk recording
 */

export class CompositeCanvasRecorder {
  private compositeCanvas: HTMLCanvasElement;
  private compositeCtx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private isRecording: boolean = false;
  private targetFPS: number = 24;
  private frameInterval: number = 1000 / 24; // 24 FPS for stability
  private lastFrameTime: number = 0;
  private frameCount: number = 0;

  constructor(width: number, height: number) {
    this.compositeCanvas = document.createElement('canvas');
    this.compositeCanvas.width = width;
    this.compositeCanvas.height = height;
    
    // Use standard 2D context with performance optimizations
    const ctx = this.compositeCanvas.getContext('2d', {
      alpha: false,
      desynchronized: false, // Changed to false for better sync
      willReadFrequently: false
    });
    
    if (!ctx) {
      throw new Error('Failed to get 2D context for composite canvas');
    }
    
    // Disable image smoothing for crisp output
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    this.compositeCtx = ctx;
  }

  /**
   * Mulai compositing loop
   */
  public startCompositing(backgroundColor: string = '#000000'): void {
    this.isRecording = true;
    this.lastFrameTime = performance.now();
    this.compositeFrame(backgroundColor);
  }

  /**
   * Stop compositing loop
   */
  public stopCompositing(): void {
    this.isRecording = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  /**
   * Get stream dari composite canvas
   */
  public getStream(frameRate: number = 24): MediaStream {
    // Use consistent frame rate
    const stream = this.compositeCanvas.captureStream(frameRate);
    console.log(`📹 Canvas stream created @ ${frameRate} FPS`);
    return stream;
  }
  
  /**
   * Get frame count untuk debugging
   */
  public getFrameCount(): number {
    return this.frameCount;
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.stopCompositing();
    // @ts-ignore
    this.compositeCanvas = null;
    // @ts-ignore
    this.compositeCtx = null;
  }

  /**
   * Composite semua canvas layers menjadi 1 frame
   */
  private compositeFrame(backgroundColor: string): void {
    if (!this.isRecording) return;

    // Request next frame FIRST untuk ensure consistent timing
    this.animationFrameId = requestAnimationFrame(() => this.compositeFrame(backgroundColor));

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;

    // Frame throttling - maintain consistent frame rate
    if (elapsed < this.frameInterval) {
      return;
    }

    this.lastFrameTime = currentTime;
    this.frameCount++;

    // Log setiap 60 frames (2.5 seconds @ 24fps)
    if (this.frameCount % 60 === 0) {
      console.log(`🎞️ Frame ${this.frameCount} rendered`);
    }

    try {
      const { width, height } = this.compositeCanvas;
      const ctx = this.compositeCtx;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Get all canvas elements yang akan di-composite
      const allCanvases = Array.from(document.querySelectorAll('canvas'))
        .filter(canvas => {
          if (canvas === this.compositeCanvas) return false;
          
          // Check if canvas is visible dan has content
          const style = window.getComputedStyle(canvas);
          const display = style.display;
          const visibility = style.visibility;
          
          if (display === 'none' || visibility === 'hidden') return false;
          if (canvas.width === 0 || canvas.height === 0) return false;
          
          return true;
        });

      // Sort by z-index untuk correct layering
      const sortedCanvases = allCanvases
        .map(canvas => ({
          canvas,
          zIndex: parseInt(window.getComputedStyle(canvas).zIndex) || 0
        }))
        .filter(item => item.zIndex <= 20) // Skip UI elements
        .sort((a, b) => a.zIndex - b.zIndex);

      // Render each canvas layer dengan extra safety checks
      for (const { canvas, zIndex } of sortedCanvases) {
        try {
          // Validate canvas before drawing
          if (!canvas || !canvas.getContext) continue;
          if (canvas.width === 0 || canvas.height === 0) continue;
          
          // Try to access canvas data to check if tainted
          try {
            const testCtx = canvas.getContext('2d');
            if (!testCtx) continue;
            // This will throw if canvas is tainted
            testCtx.getImageData(0, 0, 1, 1);
          } catch (taintError) {
            console.warn(`⚠️ Canvas tainted, skipping (z-${zIndex})`);
            continue;
          }

          const style = window.getComputedStyle(canvas);
          const blendMode = style.mixBlendMode || 'source-over';
          const opacity = parseFloat(style.opacity) || 1;

          // Skip if completely transparent atau blend mode complex
          if (opacity < 0.01) continue;

          ctx.save();
          
          // Use safe blend modes only
          const safeBlendMode = (blendMode === 'screen' || blendMode === 'source-over') 
            ? blendMode 
            : 'source-over';
          
          ctx.globalCompositeOperation = safeBlendMode as GlobalCompositeOperation;
          ctx.globalAlpha = Math.min(opacity, 1);

          // Draw canvas dengan error handling
          try {
            ctx.drawImage(canvas, 0, 0, width, height);
          } catch (drawError) {
            console.warn(`⚠️ drawImage failed for canvas (z-${zIndex})`);
          }

          ctx.restore();
        } catch (error) {
          console.warn(`⚠️ Error processing canvas (z-index ${zIndex}):`, error);
        }
      }
      
    } catch (error) {
      console.error('❌ Critical error in composite frame:', error);
    }
  }

  /**
   * Update resolution (untuk aspect ratio changes)
   */
  public updateResolution(width: number, height: number): void {
    this.compositeCanvas.width = width;
    this.compositeCanvas.height = height;
  }
}

