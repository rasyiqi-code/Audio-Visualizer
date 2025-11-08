/**
 * Frame Capture Recorder
 * Alternative to MediaRecorder - capture frames individually then assemble with FFmpeg
 * 
 * This method is MORE RELIABLE than MediaRecorder because:
 * 1. No real-time encoding pressure
 * 2. Full control over each frame
 * 3. No codec compatibility issues
 * 4. Perfect composite of all canvas layers
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface FrameCaptureOptions {
  width: number;
  height: number;
  fps: number;
  audioBitrate?: number;
}

export class FrameCaptureRecorder {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frames: Blob[] = [];
  private isCapturing: boolean = false;
  private frameCount: number = 0;
  private targetFPS: number;
  private frameInterval: number;
  private lastCaptureTime: number = 0;
  private captureLoopId: number = 0;
  
  constructor(options: FrameCaptureOptions) {
    this.targetFPS = options.fps;
    this.frameInterval = 1000 / options.fps;
    
    // Create offscreen canvas untuk compositing
    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    
    const ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: false,
      willReadFrequently: false
    });
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }
    
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Start capturing frames
   */
  public startCapture(backgroundColor: string, onProgress?: (frameNum: number) => void): void {
    this.isCapturing = true;
    this.frames = [];
    this.frameCount = 0;
    this.lastCaptureTime = performance.now();
    
    console.log(`🎬 Frame capture started @ ${this.targetFPS} FPS`);
    
    this.captureLoop(backgroundColor, onProgress);
  }

  /**
   * Stop capturing
   */
  public stopCapture(): void {
    this.isCapturing = false;
    if (this.captureLoopId) {
      cancelAnimationFrame(this.captureLoopId);
    }
    console.log(`🛑 Frame capture stopped. Total frames: ${this.frameCount}`);
  }

  /**
   * Get captured frames
   */
  public getFrames(): Blob[] {
    return this.frames;
  }

  /**
   * Get frame count
   */
  public getFrameCount(): number {
    return this.frameCount;
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.stopCapture();
    this.frames = [];
    this.frameCount = 0;
  }

  /**
   * Main capture loop
   */
  private captureLoop(backgroundColor: string, onProgress?: (frameNum: number) => void): void {
    if (!this.isCapturing) return;

    this.captureLoopId = requestAnimationFrame(() => this.captureLoop(backgroundColor, onProgress));

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastCaptureTime;

    // Frame throttling
    if (elapsed < this.frameInterval) {
      return;
    }

    this.lastCaptureTime = currentTime;

    try {
      // Composite all visible canvas elements
      this.compositeAllCanvases(backgroundColor);
      
      // Capture frame as blob (JPEG untuk smaller size, faster processing)
      this.canvas.toBlob((blob) => {
        if (blob && this.isCapturing) {
          this.frames.push(blob);
          this.frameCount++;
          
          if (onProgress) {
            onProgress(this.frameCount);
          }
          
          // Log every 30 frames (~1.5 seconds @ 20fps)
          if (this.frameCount % 30 === 0) {
            console.log(`🎞️ Captured ${this.frameCount} frames`);
          }
        }
      }, 'image/jpeg', 0.95); // 95% quality JPEG
      
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  }

  /**
   * Composite all canvas layers ke single frame
   */
  private compositeAllCanvases(backgroundColor: string): void {
    const { width, height } = this.canvas;
    
    // Clear with background
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, width, height);

    // Get all visible canvas elements
    const allCanvases = Array.from(document.querySelectorAll('canvas'))
      .filter(canvas => {
        if (canvas === this.canvas) return false;
        
        const style = window.getComputedStyle(canvas);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (canvas.width === 0 || canvas.height === 0) return false;
        
        return true;
      });

    // Sort by z-index
    const sortedCanvases = allCanvases
      .map(canvas => ({
        canvas,
        zIndex: parseInt(window.getComputedStyle(canvas).zIndex) || 0
      }))
      .filter(item => item.zIndex <= 20) // Skip UI
      .sort((a, b) => a.zIndex - b.zIndex);

    // Draw each layer
    for (const { canvas } of sortedCanvases) {
      try {
        const style = window.getComputedStyle(canvas);
        const blendMode = style.mixBlendMode || 'source-over';
        const opacity = parseFloat(style.opacity) || 1;

        if (opacity < 0.01) continue;

        this.ctx.save();
        
        // Safe blend modes only
        const safeBlendMode = (blendMode === 'screen' || blendMode === 'source-over') 
          ? blendMode 
          : 'source-over';
        
        this.ctx.globalCompositeOperation = safeBlendMode as GlobalCompositeOperation;
        this.ctx.globalAlpha = opacity;

        this.ctx.drawImage(canvas, 0, 0, width, height);

        this.ctx.restore();
      } catch (error) {
        // Skip problematic canvas
      }
    }
  }

  /**
   * Assemble frames menjadi video dengan FFmpeg
   */
  public async assembleVideo(
    audioBlob: Blob,
    outputFormat: 'mp4' | 'webm',
    onProgress?: (progress: number, message: string) => void
  ): Promise<Blob> {
    if (this.frames.length === 0) {
      throw new Error('No frames to assemble');
    }

    console.log(`🎬 Assembling ${this.frames.length} frames into video...`);
    onProgress?.(5, `Preparing ${this.frames.length} frames...`);

    const ffmpeg = new FFmpeg();
    
    try {
      // Load FFmpeg
      onProgress?.(10, 'Loading FFmpeg...');
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      onProgress?.(20, 'Writing frames to FFmpeg...');
      
      // Write all frames
      for (let i = 0; i < this.frames.length; i++) {
        const fileName = `frame${String(i).padStart(6, '0')}.jpg`;
        await ffmpeg.writeFile(fileName, await fetchFile(this.frames[i]));
        
        if (i % 50 === 0) {
          const progress = 20 + (i / this.frames.length) * 30;
          onProgress?.(progress, `Writing frames: ${i}/${this.frames.length}`);
        }
      }
      
      // Write audio
      onProgress?.(50, 'Writing audio...');
      await ffmpeg.writeFile('audio.mp3', await fetchFile(audioBlob));
      
      // Assemble video
      onProgress?.(60, 'Creating video...');
      
      const outputFile = outputFormat === 'mp4' ? 'output.mp4' : 'output.webm';
      
      await ffmpeg.exec([
        '-framerate', this.targetFPS.toString(),
        '-i', 'frame%06d.jpg',
        '-i', 'audio.mp3',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest',
        outputFile
      ]);
      
      onProgress?.(90, 'Reading output...');
      
      // Read output
      const data = await ffmpeg.readFile(outputFile);
      
      // Convert FileData to Blob - handle Uint8Array properly
      const videoBlob = new Blob([data as unknown as BlobPart], { 
        type: outputFormat === 'mp4' ? 'video/mp4' : 'video/webm' 
      });
      
      onProgress?.(100, 'Complete!');
      console.log(`✅ Video assembled: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
      
      return videoBlob;
      
    } catch (error) {
      console.error('Error assembling video:', error);
      throw error;
    }
  }
}

