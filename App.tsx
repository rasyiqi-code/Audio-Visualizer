import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AudioSource, Theme, Visualization, Preset, CustomVisualization, PlaylistItem, VisualEffects, DEFAULT_EFFECTS, BackgroundImageSettings } from './types';
import { THEMES, BUILT_IN_VISUALIZATIONS, PRESETS } from './constants';
import { getCustomVisualizations, saveCustomVisualization, exportVisualizations, importVisualizations } from './utils/localStorageManager';
import { fileToBase64 } from './utils/imageUtils';
import { OfflineRenderer } from './utils/offlineRenderer';

import Watermark from './components/Watermark';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import WelcomeScreen from './components/WelcomeScreen';
import GenerateWithAiModal from './components/GenerateWithAiModal';
import Playlist from './components/Playlist';
import ExportModal, { ExportConfig } from './components/ExportModal';
import EffectsLayer from './components/effects';
import CustomThemeEditor from './components/controls/CustomThemeEditor';
import BackgroundImage from './components/BackgroundImage';
import { useAudioVisualizer } from './hooks/useAudioVisualizer';

function App() {
  // State for UI and core functionality
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [visualization, setVisualization] = useState<Visualization>(BUILT_IN_VISUALIZATIONS[0]);
  const [customVisualizations, setCustomVisualizations] = useState<CustomVisualization[]>([]);
  const [audioSource, setAudioSource] = useState<AudioSource>(AudioSource.NONE);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionStatus, setConversionStatus] = useState<string>('');
  const currentTrackUrlRef = useRef<string>('');
  
  // Playlist state
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState<boolean>(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showCustomThemeEditor, setShowCustomThemeEditor] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [showCinemaModeIndicator, setShowCinemaModeIndicator] = useState<boolean>(false);

  // Visual effects state
  const [effects, setEffects] = useState<VisualEffects>(DEFAULT_EFFECTS);
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(0));

  // Background image state
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImageSettings>({
    imageUrl: null,
    opacity: 50,
    blur: 0,
    brightness: 100,
    scale: 100,
    position: 'fill'
  });

  // UI state for auto-hide controls
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for DOM elements and other objects
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const offlineRendererRef = useRef<OfflineRenderer | null>(null);

  const { analyser, sourceNode, audioContext, initializeAudioContext, setupAudioFromFile, setupAudioFromMic, disconnectSource, setVolume } = useAudioVisualizer();

  // Load custom visualizations from local storage on initial render
  useEffect(() => {
    setCustomVisualizations(getCustomVisualizations());
    
    // Load custom theme from localStorage
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error('Failed to load custom theme:', error);
      }
    }
  }, []);

  // Auto-hide controls after 3 seconds of inactivity (DISABLED in cinema mode)
  useEffect(() => {
    const handleMouseMove = () => {
      // Don't show controls if cinema mode active
      if (isCinemaMode) return;
      
      setShowControls(true);
      
      // Clear existing timer
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      
      // Set new timer to hide controls after 3 seconds
      hideControlsTimerRef.current = setTimeout(() => {
        // Don't hide if modal is open or not playing or cinema mode
        if (!isAiModalOpen && !isExportModalOpen && !showCustomThemeEditor && !isCinemaMode && (isPlaying || isRecording)) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      // Don't auto-hide in cinema mode
      if (isCinemaMode) return;
      
      // Start hide timer when mouse leaves window
      if ((isPlaying || isRecording) && !isAiModalOpen && !isExportModalOpen && !showCustomThemeEditor) {
        hideControlsTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [isPlaying, isRecording, isAiModalOpen, isExportModalOpen, showCustomThemeEditor, isCinemaMode]);

  // Control visibility logic (with cinema mode priority)
  useEffect(() => {
    // Cinema mode has absolute priority - always hide controls
    if (isCinemaMode) {
      setShowControls(false);
      return;
    }
    
    // Show controls when not playing or when modals are open
    if (!isPlaying && !isRecording) {
      setShowControls(true);
      return;
    }
    
    if (isAiModalOpen || isExportModalOpen || showCustomThemeEditor) {
      setShowControls(true);
      return;
    }
  }, [isPlaying, isRecording, isAiModalOpen, isExportModalOpen, showCustomThemeEditor, isCinemaMode]);

  // Auto-hide cinema mode indicator after 5 seconds
  useEffect(() => {
    if (isCinemaMode) {
      setShowCinemaModeIndicator(true);
      
      // Hide indicator after 5 seconds
      const timer = setTimeout(() => {
        setShowCinemaModeIndicator(false);
        console.log('ℹ️ Cinema mode indicator auto-hidden');
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowCinemaModeIndicator(false);
    }
  }, [isCinemaMode]);

  // Update audio data for effects continuously
  useEffect(() => {
    if (!analyser || (!isPlaying && !isRecording)) return;

    let animationId: number;
    const updateAudioData = () => {
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        audioDataRef.current = dataArray;
      }
      animationId = requestAnimationFrame(updateAudioData);
    };

    updateAudioData();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying, isRecording]);

  // Keyboard controls untuk cinema mode
  useEffect(() => {
    let spaceTimeout: NodeJS.Timeout | null = null;
    let lastSpacePress = 0;
    
    const handleKeyboard = (e: KeyboardEvent) => {
      // ESC: Exit cinema mode
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false);
        console.log('✅ Cinema mode disabled');
        return;
      }

      // Space: Only works in cinema mode
      if (e.key === ' ' && isCinemaMode) {
        e.preventDefault(); // Prevent page scroll
        
        const now = Date.now();
        const timeSinceLastPress = now - lastSpacePress;
        
        // Double press detection (< 300ms between presses)
        if (timeSinceLastPress < 300 && lastSpacePress !== 0) {
          // Double space: Restart lagu dari awal
          if (audioElementRef.current) {
            audioElementRef.current.currentTime = 0;
            if (audioElementRef.current.paused) {
              audioElementRef.current.play().catch(console.error);
            }
            console.log('⏮️ Restarted from beginning (double space)');
          }
          lastSpacePress = 0; // Reset
        } else {
          // Single space: Pause/Play
          if (audioElementRef.current) {
            if (audioElementRef.current.paused) {
              audioElementRef.current.play().catch(console.error);
              console.log('▶️ Playing (space)');
            } else {
              audioElementRef.current.pause();
              console.log('⏸️ Paused (space)');
            }
          }
          lastSpacePress = now;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      if (spaceTimeout) clearTimeout(spaceTimeout);
    };
  }, [isCinemaMode]);

  // Setup audio from file when the current track changes
  useEffect(() => {
    if (audioSource === AudioSource.FILE && audioElementRef.current) {
        setupAudioFromFile(audioElementRef.current);
    }
  }, [currentTrackIndex, audioSource, setupAudioFromFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    initializeAudioContext();
    const newPlaylistItems: PlaylistItem[] = Array.from(files).map((file: File) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name
    }));

    const newPlaylist = [...playlist, ...newPlaylistItems];
    setPlaylist(newPlaylist);
    setAudioSource(AudioSource.FILE);
    if(currentTrackIndex === -1) {
        setCurrentTrackIndex(playlist.length); // Play first of the new files
    }
    setIsPlaylistVisible(true);
  };
  
  const handleMicClick = async () => {
    if (audioSource === AudioSource.MICROPHONE) {
        micStreamRef.current?.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
        disconnectSource();
        setAudioSource(AudioSource.NONE);
        setIsPlaying(false);
    } else {
        initializeAudioContext();
        const stream = await setupAudioFromMic();
        if (stream) {
            micStreamRef.current = stream;
            setAudioSource(AudioSource.MICROPHONE);
            setIsPlaying(true); // Mic is always "playing"
            if (audioElementRef.current) audioElementRef.current.pause();
        }
    }
  };

  const handlePlayPauseClick = () => {
    const audio = audioElementRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };
  
  const handlePlayTrack = (index: number) => {
    setCurrentTrackIndex(index);
    // Let useEffect handle playing the track
  };

  const handleRemoveTrack = (id: string) => {
    const trackIndexToRemove = playlist.findIndex(track => track.id === id);
    if (trackIndexToRemove === -1) return;

    const newPlaylist = playlist.filter(track => track.id !== id);
    setPlaylist(newPlaylist);

    if (newPlaylist.length === 0) {
      setCurrentTrackIndex(-1);
      setAudioSource(AudioSource.NONE);
      if (audioElementRef.current) {
        audioElementRef.current.src = '';
        // Cleanup old URL
        if (currentTrackUrlRef.current) {
          URL.revokeObjectURL(currentTrackUrlRef.current);
          currentTrackUrlRef.current = '';
        }
      }
      setIsPlaying(false);
      return;
    }

    if (trackIndexToRemove < currentTrackIndex) {
      setCurrentTrackIndex(idx => idx - 1);
    } else if (trackIndexToRemove === currentTrackIndex) {
      const newIndex = currentTrackIndex % newPlaylist.length;
      if (newIndex !== currentTrackIndex) {
        setCurrentTrackIndex(newIndex);
      } else {
        // Force reload of the same index with a new track
        setCurrentTrackIndex(-1); // Briefly set to invalid index
        setTimeout(() => setCurrentTrackIndex(newIndex), 0);
      }
    }
  };


  const handleTrackEnded = useCallback(() => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prevIndex => prevIndex + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrackIndex, playlist.length]);

  const handleGenerateWithAi = async (imageFile: File) => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
        if (!process.env.API_KEY) {
          throw new Error("API_KEY environment variable not set.");
        }
        // FIX: Always use new GoogleGenAI({apiKey: process.env.API_KEY});.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const base64Image = await fileToBase64(imageFile);

        const schema = {
            type: Type.OBJECT,
            properties: {
                visualizationName: { type: Type.STRING, description: "A short, creative name for the visualization (e.g., 'Cosmic Swirl')." },
                visualizationCode: { type: Type.STRING, description: "The JavaScript code for the canvas drawing function body." },
            },
            required: ['visualizationName', 'visualizationCode'],
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "You are an expert in creative coding and the Canvas API. Your task is to generate a JavaScript function that creates a unique and visually appealing audio visualizer based on the provided image. Analyze the image's mood, color palette, and composition. The function signature MUST be `(ctx, dataArray, bufferLength, width, height, theme, sensitivity)`. DO NOT define the function signature, only provide the raw body of the function. The code must be self-contained and react to the audio data in `dataArray`." },
                    { inlineData: { mimeType: imageFile.type, data: base64Image } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        // FIX: Extract text output directly from `response.text`.
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        const newVis: CustomVisualization = {
            name: result.visualizationName,
            code: result.visualizationCode,
            isCustom: true
        };

        saveCustomVisualization(newVis);
        const updatedCustomVisualizations = getCustomVisualizations();
        setCustomVisualizations(updatedCustomVisualizations);
        setVisualization(newVis);
        setIsAiModalOpen(false);

    } catch (error) {
        console.error("AI Generation Error:", error);
        setAiError("Failed to generate visualization. Please try a different image or check your API key.");
    } finally {
        setIsGeneratingAi(false);
    }
  };

  const handleExportClick = () => exportVisualizations();

  const handleImportClick = (event: ChangeEvent<HTMLInputElement>) => {
    importVisualizations(event, () => {
        setCustomVisualizations(getCustomVisualizations());
    });
  };

  const handleBackgroundImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid');
      return;
    }

    // Create object URL for the image
    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const handleRemoveBackgroundImage = () => {
    if (backgroundImage.imageUrl) {
      URL.revokeObjectURL(backgroundImage.imageUrl);
    }
    setBackgroundImage(prev => ({
      ...prev,
      imageUrl: null
    }));
  };

  const handleBackgroundImageSettingChange = (key: keyof BackgroundImageSettings, value: number | string) => {
    setBackgroundImage(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleStartRecording = async (config: ExportConfig) => {
    // OFFLINE RENDERING METHOD
    // Render frame-by-frame (NOT real-time), then assemble with FFmpeg
    // This GUARANTEES all effects are included and perfect quality
    
    if (!audioElementRef.current) {
        alert("Tidak dapat memulai rendering. Silakan upload audio file.");
        return;
    }

    const audio = audioElementRef.current;
    const duration = audio.duration;

    if (!duration || duration === 0) {
        alert("Audio belum ready atau duration tidak valid.");
        return;
    }

    // Determine target resolution
    const resolutionMap = {
      '16:9': { '720p': { width: 1280, height: 720 }, '1080p': { width: 1920, height: 1080 } },
      '9:16': { '720p': { width: 720, height: 1280 }, '1080p': { width: 1080, height: 1920 } },
    };
    const targetResolution = resolutionMap[config.aspectRatio][config.resolution];

    try {
      console.log('🎬 Starting OFFLINE rendering (frame-by-frame)...');
      console.log(`📊 Duration: ${duration}s, Resolution: ${targetResolution.width}x${targetResolution.height}`);
      
      setIsRecording(true);
      setIsConverting(true);
      setConversionProgress(0);
      setConversionStatus('Initializing offline rendering...');

      // Create offline renderer dengan container reference
      if (!mainContainerRef.current) {
        throw new Error('Main container ref not available');
      }
      
      const renderer = new OfflineRenderer(mainContainerRef.current);
      offlineRendererRef.current = renderer;
      console.log('✅ OfflineRenderer created with container ref');

      // Render all frames dengan FPS lebih rendah untuk faster processing
      await renderer.renderVideo(audio, {
        fps: 15, // 15 FPS untuk faster rendering while still smooth
        duration: duration,
        width: targetResolution.width,
        height: targetResolution.height,
        audioBitrate: 128
      }, (progress, message) => {
        setConversionProgress(progress);
        setConversionStatus(message);
      });

      console.log('✅ Frame rendering complete!');
      setConversionStatus('Extracting audio...');

      // Get audio as blob (fetch dari audio src)
      const audioResponse = await fetch(audio.src);
      const audioBlob = await audioResponse.blob();
      console.log(`✅ Audio extracted: ${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`);

      // Assemble frames + audio dengan FFmpeg
      setConversionStatus('Assembling video with FFmpeg...');
      const videoBlob = await renderer.assembleVideo(
        audioBlob,
        {
          fps: 15, // Match rendering FPS
          duration: duration,
          width: targetResolution.width,
          height: targetResolution.height,
          audioBitrate: 128
        },
        config.format as 'mp4' | 'webm',
        (progress, message) => {
          setConversionProgress(progress);
          setConversionStatus(message);
        }
      );

      console.log('✅ Video assembled successfully!');
      
      // Download video
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      
      let fileName = config.fileName;
      if (!fileName.endsWith(`.${config.format}`)) {
        fileName = fileName.replace(/\.(mp4|webm)$/i, '') + `.${config.format}`;
      }
      a.download = fileName;
      
      console.log(`📥 Downloading: ${fileName} (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      setIsRecording(false);
      setIsConverting(false);
      setConversionProgress(0);
      setConversionStatus('');
      
      alert(`✅ Video berhasil di-export!\n\nFile: ${fileName}\nSize: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB\n\nSemua efek visual terecord sempurna!`);
      
      console.log('✅ Export complete!');

    } catch (error) {
      console.error("Error during offline rendering:", error);
      alert("Gagal render video: " + (error as Error).message);
      
      setIsRecording(false);
      setIsConverting(false);
      setConversionProgress(0);
      setConversionStatus('');
      
      if (offlineRendererRef.current) {
        offlineRendererRef.current.stopRendering();
        offlineRendererRef.current = null;
      }
    }
  };

  const handleStopRecording = () => {
    console.log('🛑 Stopping offline rendering...');
    if (offlineRendererRef.current) {
      offlineRendererRef.current.stopRendering();
      offlineRendererRef.current = null;
    }
    setIsRecording(false);
    setIsConverting(false);
  };

  const handleExportVideo = () => {
      if (isRecording) {
          handleStopRecording();
      } else {
          setIsExportModalOpen(true);
      }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        mainContainerRef.current?.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  const selectPreset = (preset: Preset) => {
    const newTheme = THEMES.find(t => t.name === preset.themeName) || theme;
    const newVis = BUILT_IN_VISUALIZATIONS.find(v => v.name === preset.visualizationName) || visualization;
    setTheme(newTheme);
    setVisualization(newVis);
  };
  
  // Cleanup old URL before creating new one
  useEffect(() => {
    if (currentTrackUrlRef.current) {
      URL.revokeObjectURL(currentTrackUrlRef.current);
    }
    if (currentTrackIndex > -1 && playlist[currentTrackIndex]) {
      currentTrackUrlRef.current = URL.createObjectURL(playlist[currentTrackIndex].file);
    } else {
      currentTrackUrlRef.current = '';
    }
  }, [currentTrackIndex, playlist]);

  // Cleanup background image URL on unmount
  useEffect(() => {
    return () => {
      if (backgroundImage.imageUrl) {
        URL.revokeObjectURL(backgroundImage.imageUrl);
      }
    };
  }, [backgroundImage.imageUrl]);

  const currentTrackUrl = currentTrackUrlRef.current;

  return (
    <div 
      ref={mainContainerRef} 
      className="relative w-screen h-screen overflow-hidden flex flex-col transition-all duration-300" 
      style={{ 
        backgroundColor: theme.background,
        cursor: (isCinemaMode || !showControls) ? 'none' : 'default' // Hide cursor in cinema mode or when controls hidden
      }}
    >
      <audio
        ref={audioElementRef}
        src={currentTrackUrl || undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnded}
        onLoadedData={() => audioElementRef.current?.play().catch(console.error)}
        crossOrigin="anonymous"
      />
      <main className="flex-grow relative" style={{ transition: 'transform 0.1s ease-out' }}>
        {/* Background Image */}
        <BackgroundImage settings={backgroundImage} isPlaying={isPlaying || isRecording} />
        
        {/* Watermark - hidden in cinema mode */}
        {!isCinemaMode && <Watermark theme={theme} isPlaying={isPlaying} audioData={audioDataRef.current} />}
        
        {/* Visual Effects Layer */}
        <EffectsLayer 
          theme={theme} 
          effects={effects} 
          analyser={analyser}
          isPlaying={isPlaying || isRecording}
          mainContainerRef={mainContainerRef}
        />
        
        {/* Main Visualizer */}
        <Visualizer analyser={analyser} visualization={visualization} theme={theme} isPlaying={isPlaying} isRecording={isRecording} />
        
        {audioSource === AudioSource.NONE && <WelcomeScreen theme={theme} />}
        
        {/* Recording Indicator - hidden in cinema mode */}
        {isRecording && !isCinemaMode && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-bold">RECORDING</span>
          </div>
        )}

        {/* Show Controls Indicator (when hidden) - hidden in cinema mode */}
        {!showControls && (isPlaying || isRecording) && !isCinemaMode && (
          <div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-1 animate-pulse"
            style={{ zIndex: 19 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>Move mouse to show controls</span>
          </div>
        )}
        
        {/* Cinema Mode Indicator - auto-hide after 5 seconds */}
        {isCinemaMode && showCinemaModeIndicator && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-lg transition-opacity duration-500"
            style={{ 
              zIndex: 45,
              opacity: showCinemaModeIndicator ? 1 : 0
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold">CINEMA MODE</span>
              </div>
              <div className="text-xs text-gray-300 flex flex-col items-center gap-1">
                <div>Press <kbd className="bg-gray-700 px-2 py-0.5 rounded">ESC</kbd> to exit</div>
                <div><kbd className="bg-gray-700 px-2 py-0.5 rounded">SPACE</kbd> to pause/play • Double <kbd className="bg-gray-700 px-2 py-0.5 rounded">SPACE</kbd> to restart</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Conversion Progress Modal */}
        {isConverting && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="animate-spin h-16 w-16 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mengkonversi ke MP4</h3>
                <p className="text-gray-400 mb-4">{conversionStatus}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${conversionProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">{conversionProgress}%</p>
                
                <p className="text-xs text-gray-500 mt-4">
                  Mohon tunggu, proses ini mungkin memakan waktu beberapa saat...
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {isPlaylistVisible && !isCinemaMode && (
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: showControls ? 'translateX(0)' : 'translateX(-100%)',
            opacity: showControls ? 1 : 0,
          }}
        >
          <Playlist 
            playlist={playlist}
            currentTrackIndex={currentTrackIndex}
            theme={theme}
            onPlayTrack={handlePlayTrack}
            onRemoveTrack={handleRemoveTrack}
          />
        </div>
      )}

      <Controls
        audioSource={audioSource}
        isPlaying={isPlaying}
        isRecording={isRecording}
        theme={theme}
        visualization={visualization}
        customVisualizations={customVisualizations}
        isPlaylistVisible={isPlaylistVisible}
        effects={effects}
        showControls={showControls}
        backgroundImage={backgroundImage}
        onFileChange={handleFileChange}
        onMicClick={handleMicClick}
        onPlayPauseClick={handlePlayPauseClick}
        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
        onFullscreenClick={handleFullscreen}
        onExportVideo={handleExportVideo}
        onThemeSelect={(name) => setTheme(THEMES.find(t => t.name === name) || theme)}
        onVisualizationSelect={(name) => setVisualization([...BUILT_IN_VISUALIZATIONS, ...customVisualizations].find(v => v.name === name) || visualization)}
        onPresetSelect={selectPreset}
        onGenerateWithAiClick={() => setIsAiModalOpen(true)}
        onExportClick={handleExportClick}
        onImportClick={handleImportClick}
        onEffectToggle={(effectName) => {
          setEffects(prev => ({
            ...prev,
            [effectName]: { ...prev[effectName], enabled: !prev[effectName].enabled }
          }));
        }}
        onEffectIntensityChange={(effectName, intensity) => {
          setEffects(prev => ({
            ...prev,
            [effectName]: { ...prev[effectName], intensity }
          }));
        }}
        onCustomThemeClick={() => setShowCustomThemeEditor(true)}
        togglePlaylist={() => setIsPlaylistVisible(v => !v)}
        onCinemaModeToggle={() => setIsCinemaMode(v => !v)}
        onBackgroundImageChange={handleBackgroundImageChange}
        onRemoveBackgroundImage={handleRemoveBackgroundImage}
        onBackgroundImageSettingChange={handleBackgroundImageSettingChange}
      />

      <GenerateWithAiModal
        isOpen={isAiModalOpen}
        isGenerating={isGeneratingAi}
        error={aiError}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleGenerateWithAi}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onStartRecording={handleStartRecording}
        theme={theme}
        visualization={visualization}
        audioElement={audioElementRef.current}
      />

      {showCustomThemeEditor && (
        <CustomThemeEditor
          theme={theme}
          onSave={(newTheme) => {
            setTheme(newTheme);
            localStorage.setItem('customTheme', JSON.stringify(newTheme));
            setShowCustomThemeEditor(false);
          }}
          onCancel={() => setShowCustomThemeEditor(false)}
        />
      )}
    </div>
  );
}

export default App;
