
import React, { useState, useRef, ChangeEvent } from 'react';
import { AudioSource, Theme, Visualization, Preset, CustomVisualization, VisualEffects, BackgroundImageSettings } from '../types';
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
  isCinemaMode: boolean;
  backgroundImage: BackgroundImageSettings;
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
  onCinemaModeToggle: () => void;
  onBackgroundImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackgroundImage: () => void;
  onBackgroundImageSettingChange: (key: keyof BackgroundImageSettings, value: number | string) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(active => active === menu ? null : menu);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleBackgroundImageButtonClick = () => {
    backgroundImageInputRef.current?.click();
  };

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-40 transition-all duration-500 ease-in-out"
      style={{
        transform: props.showControls ? 'translateY(0)' : 'translateY(150%)',
        opacity: props.showControls ? 1 : 0,
        pointerEvents: props.showControls ? 'auto' : 'none',
      }}
    >
      <div className="flex justify-center px-1 sm:px-0">
        <div className="bg-gray-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-gray-700 max-w-full overflow-x-auto custom-scrollbar">
          <div className="inline-flex items-center gap-2 sm:gap-2.5">
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
            className="w-20 sm:w-28 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer flex-shrink-0 border border-gray-600"
            title="Volume"
            style={{'accentColor': props.theme.primary} as React.CSSProperties}
          />

            <div className="hidden sm:block h-10 w-px bg-gray-500 mx-1 flex-shrink-0"></div>

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

            <div className="hidden sm:block h-10 w-px bg-gray-500 mx-1 flex-shrink-0"></div>

          <ControlButton
            title={props.isRecording ? 'Recording...' : 'Export to MP4'}
            onClick={props.onExportVideo}
            themeColor={props.theme.primary}
            disabled={props.audioSource === AudioSource.NONE || props.isRecording}
          >
            {props.isRecording ? <RecordingIcon /> : <VideoCameraIcon />}
          </ControlButton>
          
          <ControlButton 
            title={props.isCinemaMode ? "Exit Cinema Mode (ESC)" : "Cinema Mode (Hide UI)"}
            onClick={props.onCinemaModeToggle} 
            themeColor={props.theme.primary}
            isActive={props.isCinemaMode}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {props.isCinemaMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              )}
            </svg>
          </ControlButton>
          
          <ControlButton title="Fullscreen" onClick={props.onFullscreenClick} themeColor={props.theme.primary}>
            <FullscreenIcon />
          </ControlButton>
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={backgroundImageInputRef}
        className="hidden"
        accept="image/*"
        onChange={props.onBackgroundImageChange}
      />
      <SettingsMenus
        activeMenu={activeMenu}
        currentTheme={props.theme}
        currentVisualization={props.visualization}
        customVisualizations={props.customVisualizations}
        effects={props.effects}
        backgroundImage={props.backgroundImage}
        onThemeSelect={(name) => { props.onThemeSelect(name); setActiveMenu(null); }}
        onVisualizationSelect={(name) => { props.onVisualizationSelect(name); setActiveMenu(null); }}
        onPresetSelect={(preset) => { props.onPresetSelect(preset); setActiveMenu(null); }}
        onGenerateWithAiClick={() => { props.onGenerateWithAiClick(); setActiveMenu(null); }}
        onExportClick={props.onExportClick}
        onImportClick={props.onImportClick}
        onEffectToggle={props.onEffectToggle}
        onEffectIntensityChange={props.onEffectIntensityChange}
        onCustomThemeClick={() => { props.onCustomThemeClick(); setActiveMenu(null); }}
        onBackgroundImageUpload={handleBackgroundImageButtonClick}
        onRemoveBackgroundImage={props.onRemoveBackgroundImage}
        onBackgroundImageSettingChange={props.onBackgroundImageSettingChange}
      />
    </div>
  );
};

export default Controls;
