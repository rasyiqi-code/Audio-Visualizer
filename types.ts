export enum AudioSource {
  NONE = 'NONE',
  FILE = 'FILE',
  MICROPHONE = 'MICROPHONE',
}

export interface BuiltInVisualization {
  name: string;
  type: 'BARS' | 'WAVEFORM' | 'CIRCLE';
}

export interface CustomVisualization {
  name: string;
  code: string; // The AI-generated JS function as a string
  isCustom: true;
}

export type Visualization = BuiltInVisualization | CustomVisualization;


export interface Theme {
  name: string;
  background: string;
  primary: string;
  secondary: string;
  highlight: string;
}

export interface AudioVisualizerState {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  sourceNode: AudioNode | null;
  gainNode: GainNode | null;
}

export interface Preset {
  name: string;
  visualizationName: string;
  themeName: string;
}

export interface PlaylistItem {
  id: string;
  file: File;
  name: string;
}