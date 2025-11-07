
import React, { useState, useRef, ChangeEvent } from 'react';
import { AudioSource, Theme, Visualization, Preset, CustomVisualization, VisualEffects } from '../types';
import { FileUploadIcon, MicIcon, PlayIcon, PauseIcon, FullscreenIcon, SettingsIcon, ColorPaletteIcon, PresetIcon, PlaylistIcon, VideoCameraIcon, RecordingIcon, EffectsIcon } from './Icons';
import { ControlButton } from './controls/ControlButton';
import { SettingsMenus } from './controls/SettingsMenus';

interface ControlsProps {
  audioSource: AudioSource;
  isPlaying: boolean;
  isRecording: boolean;
  theme: Theme;
  visualization: Visualization;
  customVisualizations: CustomVisualization[];
  isPlaylistVisible: boolean;
  effects: VisualEffects;
  showControls: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMicClick: () => void;
  onPlayPauseClick: () => void;
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFullscreenClick: () => void;
  onExportVideo: () => void;
  onThemeSelect: (themeName: string) => void;
  onVisualizationSelect: (visName: string) => void;
  onPresetSelect: (preset: Preset) => void;
  onGenerateWithAiClick: () => void;
  onExportClick: () => void;
  onImportClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEffectToggle: (effectName: keyof VisualEffects) => void;
  onEffectIntensityChange: (effectName: keyof VisualEffects, intensity: number) => void;
  onCustomThemeClick: () => void;
  togglePlaylist: () => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(active => active === menu ? null : menu);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 z-20 transition-all duration-500 ease-in-out"
      style={{
        transform: props.showControls ? 'translateY(0)' : 'translateY(150%)',
        opacity: props.showControls ? 1 : 0,
        pointerEvents: props.showControls ? 'auto' : 'none',
      }}
    >
      <div className="flex justify-center px-2 sm:px-0">
        <div className="bg-black/50 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-2 shadow-lg max-w-full">
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            multiple
            onChange={props.onFileChange}
          />
          <ControlButton title="Upload Audio File(s)" onClick={handleFileButtonClick} themeColor={props.theme.primary} disabled={props.audioSource === AudioSource.MICROPHONE}>
            <FileUploadIcon />
          </ControlButton>

          <ControlButton title="Use Microphone" onClick={props.onMicClick} isActive={props.audioSource === AudioSource.MICROPHONE} themeColor={props.theme.primary}>
            <MicIcon />
          </ControlButton>
          
          <ControlButton title={props.isPlaying ? 'Pause' : 'Play'} onClick={props.onPlayPauseClick} themeColor={props.theme.primary} disabled={props.audioSource === AudioSource.NONE || props.audioSource === AudioSource.MICROPHONE}>
            {props.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </ControlButton>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={props.onVolumeChange}
            className="w-16 sm:w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            title="Volume"
            style={{'accentColor': props.theme.primary} as React.CSSProperties}
          />

          <div className="hidden sm:block h-8 w-px bg-gray-600 mx-2"></div>

          <ControlButton title="Playlist" onClick={props.togglePlaylist} themeColor={props.theme.primary} isActive={props.isPlaylistVisible}>
            <PlaylistIcon />
          </ControlButton>

          <ControlButton title="Visualizations" onClick={() => handleMenuClick('visualizations')} isActive={activeMenu === 'visualizations'} themeColor={props.theme.primary}>
            <ColorPaletteIcon />
          </ControlButton>

          <ControlButton title="Color Themes" onClick={() => handleMenuClick('themes')} isActive={activeMenu === 'themes'} themeColor={props.theme.primary}>
            <SettingsIcon />
          </ControlButton>

          <ControlButton title="Presets" onClick={() => handleMenuClick('presets')} isActive={activeMenu === 'presets'} themeColor={props.theme.primary}>
            <PresetIcon />
          </ControlButton>

          <ControlButton title="Visual Effects" onClick={() => handleMenuClick('effects')} isActive={activeMenu === 'effects'} themeColor={props.theme.primary}>
            <EffectsIcon />
          </ControlButton>

          <div className="hidden sm:block h-8 w-px bg-gray-600 mx-2"></div>

          <ControlButton
            title={props.isRecording ? 'Recording...' : 'Export to MP4'}
            onClick={props.onExportVideo}
            themeColor={props.theme.primary}
            disabled={props.audioSource === AudioSource.NONE || props.isRecording}
          >
            {props.isRecording ? <RecordingIcon /> : <VideoCameraIcon />}
          </ControlButton>
          
          <ControlButton title="Fullscreen" onClick={props.onFullscreenClick} themeColor={props.theme.primary}>
            <FullscreenIcon />
          </ControlButton>
        </div>
      </div>
      <SettingsMenus
        activeMenu={activeMenu}
        currentTheme={props.theme}
        currentVisualization={props.visualization}
        customVisualizations={props.customVisualizations}
        effects={props.effects}
        onThemeSelect={(name) => { props.onThemeSelect(name); setActiveMenu(null); }}
        onVisualizationSelect={(name) => { props.onVisualizationSelect(name); setActiveMenu(null); }}
        onPresetSelect={(preset) => { props.onPresetSelect(preset); setActiveMenu(null); }}
        onGenerateWithAiClick={() => { props.onGenerateWithAiClick(); setActiveMenu(null); }}
        onExportClick={props.onExportClick}
        onImportClick={props.onImportClick}
        onEffectToggle={props.onEffectToggle}
        onEffectIntensityChange={props.onEffectIntensityChange}
        onCustomThemeClick={() => { props.onCustomThemeClick(); setActiveMenu(null); }}
      />
    </div>
  );
};

export default Controls;
