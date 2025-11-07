import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isFFmpegLoaded = false;

export const loadFFmpeg = async (onProgress?: (progress: number, message: string) => void) => {
  if (isFFmpegLoaded && ffmpeg) {
    return ffmpeg;
  }

  try {
    ffmpeg = new FFmpeg();
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    onProgress?.(10, 'Loading FFmpeg core...');
    
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    isFFmpegLoaded = true;
    onProgress?.(30, 'FFmpeg loaded successfully');
    
    return ffmpeg;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw new Error('Failed to load FFmpeg. Please check your internet connection.');
  }
};

export const convertWebMToMP4 = async (
  webmBlob: Blob,
  onProgress?: (progress: number, message: string) => void
): Promise<Blob> => {
  try {
    onProgress?.(35, 'Initializing FFmpeg...');
    
    const ffmpegInstance = await loadFFmpeg(onProgress);
    if (!ffmpegInstance) {
      throw new Error('FFmpeg not initialized');
    }

    onProgress?.(40, 'Reading video file...');
    
    // Write input file
    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp4';
    
    await ffmpegInstance.writeFile(inputFileName, await fetchFile(webmBlob));
    
    onProgress?.(50, 'Converting to MP4...');
    
    // Convert with progress tracking
    ffmpegInstance.on('progress', ({ progress }) => {
      const convertProgress = 50 + Math.floor(progress * 40); // 50% to 90%
      onProgress?.(convertProgress, 'Converting to MP4...');
    });
    
    // Run FFmpeg conversion
    await ffmpegInstance.exec([
      '-i', inputFileName,
      '-c:v', 'libx264',        // Video codec H.264
      '-preset', 'fast',         // Encoding speed
      '-crf', '23',              // Quality (lower = better, 18-28 is good range)
      '-c:a', 'aac',             // Audio codec AAC
      '-b:a', '192k',            // Audio bitrate
      '-movflags', '+faststart', // Enable web playback optimization
      outputFileName
    ]);
    
    onProgress?.(95, 'Reading converted file...');
    
    // Read the output file
    const data = await ffmpegInstance.readFile(outputFileName);
    const mp4Blob = new Blob([data], { type: 'video/mp4' });
    
    // Cleanup
    await ffmpegInstance.deleteFile(inputFileName);
    await ffmpegInstance.deleteFile(outputFileName);
    
    onProgress?.(100, 'Conversion complete!');
    
    return mp4Blob;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert video: ${(error as Error).message}`);
  }
};

