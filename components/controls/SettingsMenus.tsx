
import React, { useState } from 'react';
import { Theme, Visualization, Preset, CustomVisualization, VisualEffects, BackgroundImageSettings } from '../../types';
import { THEMES, BUILT_IN_VISUALIZATIONS, PRESETS } from '../../constants';
import { AiIcon, ExportIcon, ImportIcon, ColorPaletteIcon, PresetIcon, EffectsIcon } from '../Icons';
import EffectCard from './EffectCard';

interface SettingsMenusProps {
  activeMenu: string | null;
  currentTheme: Theme;
  currentVisualization: Visualization;
  customVisualizations: CustomVisualization[];
  effects: VisualEffects;
  backgroundImage: BackgroundImageSettings;
  onThemeSelect: (themeName: string) => void;
  onVisualizationSelect: (visName: string) => void;
  onPresetSelect: (preset: Preset) => void;
  onGenerateWithAiClick: () => void;
  onExportClick: () => void;
  onImportClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEffectToggle: (effectName: keyof VisualEffects) => void;
  onEffectIntensityChange: (effectName: keyof VisualEffects, intensity: number) => void;
  onCustomThemeClick: () => void;
  onBackgroundImageUpload: () => void;
  onRemoveBackgroundImage: () => void;
  onBackgroundImageSettingChange: (key: keyof BackgroundImageSettings, value: number | string) => void;
}

export const SettingsMenus: React.FC<SettingsMenusProps> = ({
  activeMenu,
  currentTheme,
  currentVisualization,
  customVisualizations,
  effects,
  backgroundImage,
  onThemeSelect,
  onVisualizationSelect,
  onPresetSelect,
  onGenerateWithAiClick,
  onExportClick,
  onImportClick,
  onEffectToggle,
  onEffectIntensityChange,
  onCustomThemeClick,
  onBackgroundImageUpload,
  onRemoveBackgroundImage,
  onBackgroundImageSettingChange
}) => {
  if (!activeMenu) return null;

  const allVisualizations = [...BUILT_IN_VISUALIZATIONS, ...customVisualizations];

  return (
    <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-full max-w-sm bg-black/70 backdrop-blur-md rounded-lg shadow-lg text-white animate-fade-in-up">
      {activeMenu === 'visualizations' && (
        <div className="p-3 sm:p-4 max-h-[60vh] sm:max-h-[70vh] flex flex-col">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 sticky top-0 bg-black/90 py-2 z-10">
            <ColorPaletteIcon/>
            Visualizations <span className="text-sm font-normal text-gray-400">({allVisualizations.length})</span>
          </h3>
          
          {/* Scrollable visualization list */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <div className="space-y-1">
              {allVisualizations.map((vis) => (
                <button
                  key={vis.name}
                  onClick={() => onVisualizationSelect(vis.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 flex items-center justify-between group ${
                    currentVisualization.name === vis.name 
                      ? 'font-bold shadow-lg' 
                      : 'hover:bg-white/10 hover:translate-x-1'
                  }`}
                  style={{ 
                    backgroundColor: currentVisualization.name === vis.name ? currentTheme.primary + '20' : 'transparent',
                    borderLeft: currentVisualization.name === vis.name ? `3px solid ${currentTheme.primary}` : '3px solid transparent',
                    color: currentVisualization.name === vis.name ? currentTheme.primary : 'white' 
                  }}
                >
                  <span>{vis.name}</span>
                  {currentVisualization.name === vis.name && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action buttons - sticky at bottom */}
          <div className="mt-3 pt-3 border-t border-white/20 space-y-2 sticky bottom-0 bg-black/90">
            <button 
              onClick={onGenerateWithAiClick} 
              className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <AiIcon/> Create with AI...
            </button>
            <label 
              htmlFor="import-vis" 
              className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ImportIcon /> Import Styles
            </label>
            <input type="file" id="import-vis" className="hidden" accept=".json" onChange={onImportClick} />
            <button 
              onClick={onExportClick} 
              className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <ExportIcon /> Export Custom Styles
            </button>
          </div>
        </div>
      )}
      {activeMenu === 'themes' && (
        <div className="p-3 sm:p-4 max-h-[60vh] sm:max-h-[70vh] flex flex-col">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 sticky top-0 bg-black/90 py-2 z-10">
            <ColorPaletteIcon/>
            Color Themes <span className="text-sm font-normal text-gray-400">({THEMES.length})</span>
          </h3>
          
          {/* Background Image Section */}
          <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Background Image
              </h4>
            </div>
            
            {!backgroundImage.imageUrl ? (
              <button
                onClick={onBackgroundImageUpload}
                className="w-full px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Image
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={onRemoveBackgroundImage}
                  className="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Image
                </button>
                
                {/* Image Settings */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Opacity: {backgroundImage.opacity}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={backgroundImage.opacity}
                      onChange={(e) => onBackgroundImageSettingChange('opacity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{'accentColor': currentTheme.primary} as React.CSSProperties}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Blur: {backgroundImage.blur}px</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={backgroundImage.blur}
                      onChange={(e) => onBackgroundImageSettingChange('blur', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{'accentColor': currentTheme.primary} as React.CSSProperties}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Brightness: {backgroundImage.brightness}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={backgroundImage.brightness}
                      onChange={(e) => onBackgroundImageSettingChange('brightness', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{'accentColor': currentTheme.primary} as React.CSSProperties}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Scale: {backgroundImage.scale}%</label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={backgroundImage.scale}
                      onChange={(e) => onBackgroundImageSettingChange('scale', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{'accentColor': currentTheme.primary} as React.CSSProperties}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Position Mode</label>
                    <div className="grid grid-cols-2 gap-1">
                      {(['fill', 'fit', 'center', 'stretch'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => onBackgroundImageSettingChange('position', mode)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            backgroundImage.position === mode
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Theme Button */}
          <button
            onClick={onCustomThemeClick}
            className="w-full mb-3 px-4 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Custom Theme
          </button>
          
          {/* Scrollable themes list */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <div className="space-y-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => onThemeSelect(theme.name)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-all duration-200 flex items-center justify-between group ${
                    currentTheme.name === theme.name 
                      ? 'font-bold shadow-lg' 
                      : 'hover:bg-white/10 hover:translate-x-1'
                  }`}
                  style={{ 
                    backgroundColor: currentTheme.name === theme.name ? theme.primary + '20' : 'transparent',
                    borderLeft: currentTheme.name === theme.name ? `3px solid ${theme.primary}` : '3px solid transparent',
                    color: currentTheme.name === theme.name ? theme.primary : 'white' 
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Color preview */}
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30" 
                        style={{ backgroundColor: theme.primary }}
                        title="Primary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30" 
                        style={{ backgroundColor: theme.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30" 
                        style={{ backgroundColor: theme.highlight }}
                        title="Highlight"
                      />
                    </div>
                    <span>{theme.name}</span>
                  </div>
                  {currentTheme.name === theme.name && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeMenu === 'presets' && (
        <div className="p-3 sm:p-4 max-h-[60vh] sm:max-h-[70vh] flex flex-col">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 sticky top-0 bg-black/90 py-2 z-10">
            <PresetIcon /> 
            Presets <span className="text-sm font-normal text-gray-400">({PRESETS.length})</span>
          </h3>
          
          {/* Scrollable presets list */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <div className="space-y-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPresetSelect(preset)}
                  className="w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 hover:bg-white/10 hover:translate-x-1 flex items-center justify-between group"
                  style={{
                    borderLeft: '3px solid transparent'
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-gray-400">
                      {preset.visualizationName} • {preset.themeName}
                    </span>
                  </div>
                  <svg 
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeMenu === 'effects' && (
        <div className="p-3 sm:p-4 max-h-[60vh] sm:max-h-[70vh] flex flex-col">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 sticky top-0 bg-black/90 py-2 z-10">
            <EffectsIcon />
            Visual Effects <span className="text-sm font-normal text-gray-400">(18)</span>
          </h3>
          
          {/* Scrollable effects list */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <div className="space-y-3">
              
              {/* Category: Background Effects */}
              <div className="text-xs font-bold text-green-400 mt-2 mb-1 px-2">🌌 BACKGROUND EFFECTS</div>
              
              <EffectCard
                title="Animated Gradient"
                description="Rotating gradient background"
                effectName="animatedBackground"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="background"
              />
              
              <EffectCard
                title="Wave Background"
                description="Flowing wave layers"
                effectName="waveBackground"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="background"
              />
              
              <EffectCard
                title="Grid/Matrix"
                description="Cyberpunk grid lines"
                effectName="gridBackground"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="background"
              />
              
              <EffectCard
                title="Aurora Borealis"
                description="Northern lights waves"
                effectName="auroraEffect"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="background"
              />
              
              <EffectCard
                title="Floating Orbs"
                description="Soft glowing orbs"
                effectName="floatingOrbs"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="background"
              />

              {/* Category: Light Effects */}
              <div className="text-xs font-bold text-yellow-400 mt-4 mb-1 px-2">💡 LIGHT EFFECTS</div>
              
              <EffectCard
                title="Corner Spotlights"
                description="4 reactive corner lights"
                effectName="cornerSpotlights"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="light"
              />
              
              <EffectCard
                title="Edge Glow"
                description="Glowing screen frame"
                effectName="edgeGlow"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="light"
              />
              
              <EffectCard
                title="Light Rays"
                description="Rotating stage lights"
                effectName="lightRays"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="light"
              />
              
              <EffectCard
                title="Lens Flare"
                description="Peak audio flares"
                effectName="lensFlare"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="light"
              />

              {/* Category: Overlay Effects */}
              <div className="text-xs font-bold text-purple-400 mt-4 mb-1 px-2">✨ OVERLAY EFFECTS</div>
              
              <EffectCard
                title="Floating Particles"
                description="Starfield particles"
                effectName="floatingParticles"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="overlay"
              />
              
              <EffectCard
                title="Music Notation ♪♫"
                description="Floating musical symbols"
                effectName="musicNotation"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="overlay"
              />
              
              <EffectCard
                title="Orbiting Shapes"
                description="Rotating geometric shapes"
                effectName="orbitingShapes"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="overlay"
              />
              
              <EffectCard
                title="Scan Lines"
                description="Retro CRT effect"
                effectName="scanLines"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="overlay"
              />

              {/* Category: Screen Effects */}
              <div className="text-xs font-bold text-red-400 mt-4 mb-1 px-2">📺 SCREEN EFFECTS</div>
              
              <EffectCard
                title="Flash Effects"
                description="Bass drop flashes"
                effectName="flashEffects"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="screen"
              />
              
              <EffectCard
                title="Vignette"
                description="Edge darkening effect"
                effectName="vignetteEffect"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="screen"
              />
              
              <EffectCard
                title="Chromatic Aberration"
                description="RGB split glitch"
                effectName="chromaticAberration"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="screen"
              />
              
              <EffectCard
                title="Screen Shake"
                description="Bass impact shake"
                effectName="screenShake"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="screen"
              />
              
              <EffectCard
                title="Reactive Border"
                description="Audio frequency border"
                effectName="reactiveBorder"
                effects={effects}
                themeColor={currentTheme.primary}
                onToggle={onEffectToggle}
                onIntensityChange={onEffectIntensityChange}
                category="screen"
              />
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
