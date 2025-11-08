export enum AudioSource {
  NONE = 'NONE',
  FILE = 'FILE',
  MICROPHONE = 'MICROPHONE',
}

export interface BuiltInVisualization {
  name: string;
  type: 'BARS' | 'WAVEFORM' | 'CIRCLE' | 'MIRROR_BARS' | 'RADIAL_WAVE' | 'PARTICLE_FIELD' | 'DOUBLE_HELIX' | 'SPIRAL_GALAXY' | 'SOUND_PULSE' | 'OSCILLOSCOPE' | 'FREQUENCY_RINGS' | 'STARFIELD' | 'WAVE_CIRCLES' | 'FIREWORKS' | 'EQUALIZER' | 'LIGHTNING' | 'KALEIDOSCOPE' | 'BUBBLES' | 'RIPPLES' | 'SPECTRAL_BANDS' | 'VORTEX' | 'PYRAMID' | 'FLOWER' | 'PULSE_GRID' | 'DIAMOND' | 'WAVEFORM_BARS' | 'NEON_TUNNEL' | 'BINARY_RAIN' | 'POLYGON_MORPH' | 'SPECTRUM_WATERFALL' | 'DOUBLE_SIDED' | 'CRYSTAL_FORMATION' | 'SINE_WAVES' | 'RADAR_SCAN' | 'ENERGY_FIELD' | 'HEXAGON_GRID' | 'CIRCUIT_BOARD' | 'PULSE_BEAM';
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

export interface BackgroundImageSettings {
  imageUrl: string | null;
  opacity: number; // 0-100
  blur: number; // 0-20
  brightness: number; // 0-200
  scale: number; // 50-200 (percentage)
  position: 'center' | 'fill' | 'fit' | 'stretch';
}

// Effects
export interface EffectSettings {
  enabled: boolean;
  intensity: number;
}

export interface VisualEffects {
  // Background Effects
  animatedBackground: EffectSettings;
  waveBackground: EffectSettings;
  gridBackground: EffectSettings;
  auroraEffect: EffectSettings;
  floatingOrbs: EffectSettings;
  
  // Light Effects
  cornerSpotlights: EffectSettings;
  edgeGlow: EffectSettings;
  lightRays: EffectSettings;
  lensFlare: EffectSettings;
  
  // Overlay Effects
  floatingParticles: EffectSettings;
  musicNotation: EffectSettings;
  orbitingShapes: EffectSettings;
  scanLines: EffectSettings;
  
  // Screen Effects
  flashEffects: EffectSettings;
  vignetteEffect: EffectSettings;
  chromaticAberration: EffectSettings;
  screenShake: EffectSettings;
  reactiveBorder: EffectSettings;
}

export const DEFAULT_EFFECTS: VisualEffects = {
  // Background Effects
  animatedBackground: { enabled: true, intensity: 50 },
  waveBackground: { enabled: false, intensity: 60 },
  gridBackground: { enabled: false, intensity: 40 },
  auroraEffect: { enabled: false, intensity: 70 },
  floatingOrbs: { enabled: false, intensity: 50 },
  
  // Light Effects
  cornerSpotlights: { enabled: true, intensity: 60 },
  edgeGlow: { enabled: true, intensity: 70 },
  lightRays: { enabled: false, intensity: 50 },
  lensFlare: { enabled: false, intensity: 60 },
  
  // Overlay Effects
  floatingParticles: { enabled: true, intensity: 50 },
  musicNotation: { enabled: true, intensity: 60 },
  orbitingShapes: { enabled: false, intensity: 60 },
  scanLines: { enabled: false, intensity: 30 },
  
  // Screen Effects
  flashEffects: { enabled: true, intensity: 40 },
  vignetteEffect: { enabled: false, intensity: 50 },
  chromaticAberration: { enabled: false, intensity: 50 },
  screenShake: { enabled: false, intensity: 50 },
  reactiveBorder: { enabled: false, intensity: 60 },
};