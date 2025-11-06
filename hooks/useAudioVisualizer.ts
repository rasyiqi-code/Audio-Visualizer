import { useState, useRef, useCallback } from 'react';
import { AudioVisualizerState } from '../types';
import { FFT_SIZE } from '../constants';

// FIX: This file was missing. Implemented a custom hook to encapsulate Web Audio API logic.
// This hook manages the AudioContext, AnalyserNode, and connections for different audio sources.
export const useAudioVisualizer = () => {
  const [audioState, setAudioState] = useState<AudioVisualizerState>({
    audioContext: null,
    analyser: null,
    sourceNode: null,
    gainNode: null,
  });
  
  // Use a ref to hold the AudioContext to avoid re-creation on re-renders
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return;
    }

    try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;

        const analyser = context.createAnalyser();
        analyser.fftSize = FFT_SIZE;

        const gainNode = context.createGain();
        gainNode.connect(context.destination);

        setAudioState(prevState => ({ ...prevState, audioContext: context, analyser, gainNode }));
    } catch (error) {
        console.error("Failed to create AudioContext", error);
        alert("Your browser does not support the Web Audio API, which is required for this application.");
    }
  }, []);

  const setupAudioFromFile = useCallback((audioElement: HTMLAudioElement) => {
    if (!audioContextRef.current || !audioState.analyser || !audioState.gainNode) {
        return;
    }
    const context = audioContextRef.current;

    if (audioState.sourceNode) {
      // Disconnect previous source if it exists
      if(audioState.sourceNode instanceof MediaElementAudioSourceNode && audioState.sourceNode.mediaElement === audioElement) {
        return; // Already connected
      }
      audioState.sourceNode.disconnect();
    }
    
    // Create source node from the <audio> element
    const source = context.createMediaElementSource(audioElement);
    source.connect(audioState.analyser);
    audioState.analyser.connect(audioState.gainNode);
    setAudioState(prevState => ({ ...prevState, sourceNode: source }));
  }, [audioState.analyser, audioState.gainNode, audioState.sourceNode]);

  const setupAudioFromMic = useCallback(async () => {
    if (!audioContextRef.current || !audioState.analyser) {
        return null;
    }
    const context = audioContextRef.current;
    
    if (audioState.sourceNode) {
      audioState.sourceNode.disconnect();
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = context.createMediaStreamSource(stream);
      source.connect(audioState.analyser);
      // We don't connect the microphone to the output (gainNode) to prevent audio feedback.
      setAudioState(prevState => ({ ...prevState, sourceNode: source }));
      return stream; 
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access was denied. Please allow microphone access in your browser settings to use this feature.');
      return null;
    }
  }, [audioState.analyser, audioState.sourceNode]);

  const disconnectSource = useCallback(() => {
      if (audioState.sourceNode) {
          audioState.sourceNode.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
          audioContextRef.current.suspend();
      }
      setAudioState(prevState => ({ ...prevState, sourceNode: null }));
  }, [audioState.sourceNode]);

  const setVolume = useCallback((volume: number) => {
    if (audioState.gainNode) {
        audioState.gainNode.gain.setValueAtTime(volume, audioState.gainNode.context.currentTime);
    }
  }, [audioState.gainNode]);

  return {
    analyser: audioState.analyser,
    initializeAudioContext,
    setupAudioFromFile,
    setupAudioFromMic,
    disconnectSource,
    setVolume,
  };
};
