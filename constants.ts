import { Theme, Preset, BuiltInVisualization } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Neon Nights',
    background: '#0a0a0a',
    primary: '#00f2ea',
    secondary: '#ff00e5',
    highlight: '#ffffff',
  },
  {
    name: 'Sunset Groove',
    background: '#1a0d21',
    primary: '#ff8c00',
    secondary: '#ff007f',
    highlight: '#f0e68c',
  },
  {
    name: 'Forest Mist',
    background: '#122415',
    primary: '#0cff77',
    secondary: '#a0e8af',
    highlight: '#ffffff',
  },
  {
    name: 'Ocean Deep',
    background: '#03132B',
    primary: '#00aeff',
    secondary: '#00f2ea',
    highlight: '#ffffff',
  },
];

export const BUILT_IN_VISUALIZATIONS: BuiltInVisualization[] = [
    { name: 'Frequency Bars', type: 'BARS' },
    { name: 'Waveform', type: 'WAVEFORM' },
    { name: 'Circular Spectrum', type: 'CIRCLE' },
];

export const PRESETS: Preset[] = [
  {
    name: 'Deep Dive',
    visualizationName: 'Circular Spectrum',
    themeName: 'Ocean Deep',
  },
  {
    name: 'Retro Bars',
    visualizationName: 'Frequency Bars',
    themeName: 'Sunset Groove',
  },
  {
    name: 'Misty Waves',
    visualizationName: 'Waveform',
    themeName: 'Forest Mist',
  },
  {
    name: 'Neon Party',
    visualizationName: 'Frequency Bars',
    themeName: 'Neon Nights',
  }
];


export const FFT_SIZE = 2048;
