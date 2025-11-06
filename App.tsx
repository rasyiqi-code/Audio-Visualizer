import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AudioSource, Theme, Visualization, Preset, CustomVisualization, PlaylistItem } from './types';
import { THEMES, BUILT_IN_VISUALIZATIONS, PRESETS } from './constants';
import { getCustomVisualizations, saveCustomVisualization, exportVisualizations, importVisualizations } from './utils/localStorageManager';
import { fileToBase64 } from './utils/imageUtils';

import Header from './components/Header';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import WelcomeScreen from './components/WelcomeScreen';
import GenerateWithAiModal from './components/GenerateWithAiModal';
import Playlist from './components/Playlist';
import ExportModal, { ExportConfig } from './components/ExportModal';
import { useAudioVisualizer } from './hooks/useAudioVisualizer';

function App() {
  // State for UI and core functionality
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [visualization, setVisualization] = useState<Visualization>(BUILT_IN_VISUALIZATIONS[0]);
  const [customVisualizations, setCustomVisualizations] = useState<CustomVisualization[]>([]);
  const [audioSource, setAudioSource] = useState<AudioSource>(AudioSource.NONE);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  // Playlist state
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState<boolean>(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Refs for DOM elements and other objects
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const { analyser, initializeAudioContext, setupAudioFromFile, setupAudioFromMic, disconnectSource, setVolume } = useAudioVisualizer();

  // Load custom visualizations from local storage on initial render
  useEffect(() => {
    setCustomVisualizations(getCustomVisualizations());
  }, []);

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
    const newPlaylistItems: PlaylistItem[] = Array.from(files).map(file => ({
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
      if (audioElementRef.current) audioElementRef.current.src = '';
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
        alert("Cannot start recording. No audio source or visualizer canvas found.");
        return;
    }

    const videoStream = canvas.captureStream(30); // 30 FPS
    let audioStream;

    if (audioSource === AudioSource.FILE && audioElementRef.current) {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audioElementRef.current);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        audioStream = dest.stream;
    } else if (audioSource === AudioSource.MICROPHONE && micStreamRef.current) {
        audioStream = micStreamRef.current;
    } else {
        alert("No valid audio source to record.");
        return;
    }
    
    const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ]);

    const mimeType = config.format === 'mp4' ? 'video/mp4' : 'video/webm; codecs=vp9,opus';
    const options = { mimeType };
    mediaRecorderRef.current = new MediaRecorder(combinedStream, options);
    
    const chunks: Blob[] = [];
    mediaRecorderRef.current.ondataavailable = (event) => chunks.push(event.data);
    mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = config.fileName;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    if(audioElementRef.current) {
        audioElementRef.current.addEventListener('ended', () => mediaRecorderRef.current?.stop(), { once: true });
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
  
  const currentTrackUrl = currentTrackIndex > -1 && playlist[currentTrackIndex] ? URL.createObjectURL(playlist[currentTrackIndex].file) : '';

  return (
    <div ref={mainContainerRef} className="relative w-screen h-screen overflow-hidden bg-black flex flex-col" style={{ backgroundColor: theme.background }}>
      <audio
        ref={audioElementRef}
        src={currentTrackUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnded}
        onLoadedData={() => audioElementRef.current?.play().catch(console.error)}
        crossOrigin="anonymous"
      />
      <Header theme={theme} />
      
      <main className="flex-grow relative">
        <Visualizer analyser={analyser} visualization={visualization} theme={theme} isPlaying={isPlaying} isRecording={isRecording} />
        {audioSource === AudioSource.NONE && <WelcomeScreen theme={theme} />}
      </main>

      {isPlaylistVisible && <Playlist 
        playlist={playlist}
        currentTrackIndex={currentTrackIndex}
        theme={theme}
        onPlayTrack={handlePlayTrack}
        onRemoveTrack={handleRemoveTrack}
      />}

      <Controls
        audioSource={audioSource}
        isPlaying={isPlaying}
        isRecording={isRecording}
        theme={theme}
        visualization={visualization}
        customVisualizations={customVisualizations}
        isPlaylistVisible={isPlaylistVisible}
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
    </div>
  );
}

export default App;
