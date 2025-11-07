import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AudioSource, Theme, Visualization, Preset, CustomVisualization, PlaylistItem, VisualEffects, DEFAULT_EFFECTS } from './types';
import { THEMES, BUILT_IN_VISUALIZATIONS, PRESETS } from './constants';
import { getCustomVisualizations, saveCustomVisualization, exportVisualizations, importVisualizations } from './utils/localStorageManager';
import { fileToBase64 } from './utils/imageUtils';
import { convertWebMToMP4 } from './utils/ffmpegConverter';

import Watermark from './components/Watermark';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import WelcomeScreen from './components/WelcomeScreen';
import GenerateWithAiModal from './components/GenerateWithAiModal';
import Playlist from './components/Playlist';
import ExportModal, { ExportConfig } from './components/ExportModal';
import EffectsLayer from './components/effects';
import CustomThemeEditor from './components/controls/CustomThemeEditor';
import ElectronTitleBar from './components/ElectronTitleBar';
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

  // Visual effects state
  const [effects, setEffects] = useState<VisualEffects>(DEFAULT_EFFECTS);
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(0));

  // UI state for auto-hide controls
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for DOM elements and other objects
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const { analyser, initializeAudioContext, setupAudioFromFile, setupAudioFromMic, disconnectSource, setVolume } = useAudioVisualizer();

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

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      // Clear existing timer
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      
      // Set new timer to hide controls after 3 seconds
      hideControlsTimerRef.current = setTimeout(() => {
        // Don't hide if modal is open or not playing
        if (!isAiModalOpen && !isExportModalOpen && !showCustomThemeEditor && (isPlaying || isRecording)) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
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
  }, [isPlaying, isRecording, isAiModalOpen, isExportModalOpen, showCustomThemeEditor]);

  // Always show controls when not playing or when modals are open
  useEffect(() => {
    if (!isPlaying && !isRecording) {
      setShowControls(true);
    }
    if (isAiModalOpen || isExportModalOpen || showCustomThemeEditor) {
      setShowControls(true);
    }
  }, [isPlaying, isRecording, isAiModalOpen, isExportModalOpen, showCustomThemeEditor]);

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
  
  const handleStartRecording = async (config: ExportConfig) => {
    const canvas = document.getElementById('visualizer-canvas') as HTMLCanvasElement;
    if (!canvas || (!audioElementRef.current && !micStreamRef.current)) {
        alert("Tidak dapat memulai recording. Tidak ada audio source atau canvas visualizer.");
        return;
    }

    // Reset audio to beginning for full duration recording
    if (audioSource === AudioSource.FILE && audioElementRef.current) {
        const audio = audioElementRef.current;
        console.log("🎵 Resetting audio to beginning...");
        console.log("Current time before reset:", audio.currentTime);
        
        audio.currentTime = 0;
        console.log("Current time after reset:", audio.currentTime);
        
        // Ensure audio is playing and wait for it to actually start
        try {
            console.log("▶️ Starting audio playback...");
            await audio.play();
            // Wait a bit for audio to stabilize
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log("✅ Audio playing successfully");
        } catch (error) {
            console.error("❌ Error playing audio:", error);
            alert("Gagal memutar audio. Silakan coba lagi.");
            return;
        }
        
        // Verify audio is actually playing
        if (audio.paused) {
            console.error("❌ Audio is paused after play attempt");
            alert("Audio tidak dapat diputar. Silakan coba lagi.");
            return;
        }
        
        console.log("✅ Audio ready for recording. Duration:", audio.duration);
    }

    // Store original canvas size to restore later
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Set canvas resolution based on config
    const resolutionMap = {
      '16:9': { '720p': { width: 1280, height: 720 }, '1080p': { width: 1920, height: 1080 } },
      '9:16': { '720p': { width: 720, height: 1280 }, '1080p': { width: 1080, height: 1920 } },
    };
    const targetResolution = resolutionMap[config.aspectRatio][config.resolution];
    canvas.width = targetResolution.width;
    canvas.height = targetResolution.height;

    // Capture video stream from canvas
    const videoStream = canvas.captureStream(30); // 30 FPS
    let audioStream: MediaStream | null = null;
    let audioDestNode: MediaStreamAudioDestinationNode | null = null;

    try {
      if (audioSource === AudioSource.FILE && audioElementRef.current && analyser) {
        // Use existing audio context instead of creating new one
        const audioCtx = analyser.context as AudioContext;
        audioDestNode = audioCtx.createMediaStreamDestination();
        
        // Connect the current audio path to destination
        analyser.connect(audioDestNode);
        audioStream = audioDestNode.stream;
      } else if (audioSource === AudioSource.MICROPHONE && micStreamRef.current) {
        audioStream = micStreamRef.current;
      } else {
        alert("Tidak ada audio source yang valid untuk direkam.");
        // Restore canvas size
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        return;
      }
      
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...(audioStream?.getAudioTracks() || [])
      ]);

      // Determine best supported mime type - prioritize MP4 if available
      let mimeType = '';
      let fileExtension = '';
      let isNativeMP4 = false;
      
      // Try MP4 codecs first (native support = no conversion needed!)
      const mp4CodecsToTry = [
        'video/mp4;codecs=h264,aac',
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4'
      ];
      
      for (const codec of mp4CodecsToTry) {
        if (MediaRecorder.isTypeSupported(codec)) {
          mimeType = codec;
          fileExtension = '.mp4';
          isNativeMP4 = true;
          console.log('✅ Browser mendukung MP4 native:', codec);
          break;
        }
      }
      
      // Fallback to WebM if MP4 not supported
      if (!mimeType) {
        const webmCodecsToTry = [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus', 
          'video/webm;codecs=h264,opus',
          'video/webm'
        ];

        for (const codec of webmCodecsToTry) {
          if (MediaRecorder.isTypeSupported(codec)) {
            mimeType = codec;
            fileExtension = '.webm';
            console.log('⚠️ Browser tidak support MP4 native, menggunakan WebM:', codec);
            break;
          }
        }
      }

      if (!mimeType) {
        alert("Browser Anda tidak mendukung recording video. Silakan gunakan browser modern seperti Chrome atau Firefox.");
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        return;
      }

      const options = { mimeType, videoBitsPerSecond: 5000000 }; // 5 Mbps
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
      
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const recordedBlob = new Blob(chunks, { type: mimeType });
        
        // Cleanup audio node immediately
        if (audioDestNode) {
          audioDestNode.disconnect();
        }
        
        // Restore original canvas size
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        
        setIsRecording(false);
        
        // Check if we need to convert to MP4 (only if recorded in WebM and user wants MP4)
        const needsConversion = !isNativeMP4 && config.format === 'mp4';
        
        if (needsConversion) {
          console.log('🔄 Converting WebM to MP4...');
          try {
            setIsConverting(true);
            setConversionProgress(0);
            setConversionStatus('Initializing conversion...');
            
            // Convert webm to mp4
            const mp4Blob = await convertWebMToMP4(
              recordedBlob,
              (progress, message) => {
                setConversionProgress(progress);
                setConversionStatus(message);
              }
            );
            
            // Download converted MP4
            const url = URL.createObjectURL(mp4Blob);
            const a = document.createElement('a');
            a.href = url;
            
            let fileName = config.fileName;
            if (!fileName.endsWith('.mp4')) {
              fileName = fileName.replace(/\.(mp4|webm)$/i, '') + '.mp4';
            }
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            
            setIsConverting(false);
            setConversionProgress(0);
            setConversionStatus('');
            console.log('✅ Conversion complete!');
          } catch (error) {
            console.error('❌ Conversion error:', error);
            setIsConverting(false);
            setConversionProgress(0);
            setConversionStatus('');
            
            // Fallback: download original webm
            alert(`Konversi ke MP4 gagal: ${(error as Error).message}\n\nFile akan disimpan dalam format WebM.`);
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            let fileName = config.fileName.replace(/\.mp4$/i, '.webm');
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          }
        } else {
          // Download directly without conversion (native MP4 or user wants WebM)
          console.log(`✅ Downloading ${isNativeMP4 ? 'native MP4' : 'WebM'} file directly (no conversion needed)`);
          const url = URL.createObjectURL(recordedBlob);
          const a = document.createElement('a');
          a.href = url;
          
          let fileName = config.fileName;
          if (!fileName.endsWith(fileExtension)) {
            fileName = fileName.replace(/\.(mp4|webm)$/i, '') + fileExtension;
          }
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        alert("Terjadi error saat recording. Silakan coba lagi.");
        
        // Cleanup on error
        if (audioDestNode) {
          audioDestNode.disconnect();
        }
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        setIsRecording(false);
      };

      mediaRecorderRef.current.start(100); // Capture data every 100ms
      setIsRecording(true);
      
      // Auto-stop when audio ends
      if(audioElementRef.current) {
        const handleAudioEnd = () => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        };
        audioElementRef.current.addEventListener('ended', handleAudioEnd, { once: true });
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Gagal memulai recording: " + (error as Error).message);
      
      // Cleanup on error
      if (audioDestNode) {
        audioDestNode.disconnect();
      }
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
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

  const currentTrackUrl = currentTrackUrlRef.current;

  return (
    <div 
      ref={mainContainerRef} 
      className="relative w-screen h-screen overflow-hidden flex flex-col transition-all duration-300" 
      style={{ 
        backgroundColor: theme.background,
        cursor: showControls ? 'default' : 'none' // Hide cursor when controls hidden
      }}
    >
      {/* Electron Title Bar (only shows in desktop app) */}
      <ElectronTitleBar />
      
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
        {/* Watermark */}
        <Watermark theme={theme} isPlaying={isPlaying} audioData={audioDataRef.current} />
        
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
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-bold">RECORDING</span>
          </div>
        )}

        {/* Show Controls Indicator (when hidden) */}
        {!showControls && (isPlaying || isRecording) && (
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

      {isPlaylistVisible && (
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
