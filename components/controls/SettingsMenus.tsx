
import React from 'react';
import { Theme, Visualization, Preset, CustomVisualization } from '../../types';
import { THEMES, BUILT_IN_VISUALIZATIONS, PRESETS } from '../../constants';
import { AiIcon, ExportIcon, ImportIcon, ColorPaletteIcon, PresetIcon } from '../Icons';

interface SettingsPanelProps {
  items: { name: string }[];
  title: string;
  activeItemName: string;
  onItemSelect: (name: string) => void;
  themeColor: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ items, title, activeItemName, onItemSelect, themeColor }) => (
  <div className="p-4">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          <button
            onClick={() => onItemSelect(item.name)}
            className={`w-full text-left p-2 rounded-md transition-colors ${activeItemName === item.name ? 'font-bold' : 'hover:bg-white/10'}`}
            style={{ color: activeItemName === item.name ? themeColor : 'white' }}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

interface SettingsMenusProps {
  activeMenu: string | null;
  currentTheme: Theme;
  currentVisualization: Visualization;
  customVisualizations: CustomVisualization[];
  onThemeSelect: (themeName: string) => void;
  onVisualizationSelect: (visName: string) => void;
  onPresetSelect: (preset: Preset) => void;
  onGenerateWithAiClick: () => void;
  onExportClick: () => void;
  onImportClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsMenus: React.FC<SettingsMenusProps> = ({
  activeMenu,
  currentTheme,
  currentVisualization,
  customVisualizations,
  onThemeSelect,
  onVisualizationSelect,
  onPresetSelect,
  onGenerateWithAiClick,
  onExportClick,
  onImportClick
}) => {
  if (!activeMenu) return null;

  const allVisualizations = [...BUILT_IN_VISUALIZATIONS, ...customVisualizations];

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-sm bg-black/70 backdrop-blur-md rounded-lg shadow-lg text-white animate-fade-in-up">
      {activeMenu === 'visualizations' && (
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <ColorPaletteIcon/>
            Visualizations
            </h3>
          <ul>
            {allVisualizations.map((vis) => (
              <li key={vis.name}>
                <button
                  onClick={() => onVisualizationSelect(vis.name)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${currentVisualization.name === vis.name ? 'font-bold' : 'hover:bg-white/10'}`}
                  style={{ color: currentVisualization.name === vis.name ? currentTheme.primary : 'white' }}
                >
                  {vis.name}
                </button>
              </li>
            ))}
            <li className="mt-2 border-t border-white/20 pt-2">
                 <button onClick={onGenerateWithAiClick} className="w-full text-left p-2 rounded-md hover:bg-white/10 flex items-center gap-2">
                    <AiIcon/> Create with AI...
                 </button>
            </li>
            <li className="border-t border-white/20 pt-2 mt-2">
                <label htmlFor="import-vis" className="w-full text-left p-2 rounded-md hover:bg-white/10 flex items-center gap-2 cursor-pointer">
                    <ImportIcon /> Import Styles
                </label>
                <input type="file" id="import-vis" className="hidden" accept=".json" onChange={onImportClick} />
            </li>
            <li>
                <button onClick={onExportClick} className="w-full text-left p-2 rounded-md hover:bg-white/10 flex items-center gap-2">
                    <ExportIcon /> Export Custom Styles
                </button>
            </li>
          </ul>
        </div>
      )}
      {activeMenu === 'themes' && (
        <SettingsPanel
          items={THEMES}
          title="Color Themes"
          activeItemName={currentTheme.name}
          onItemSelect={onThemeSelect}
          themeColor={currentTheme.primary}
        />
      )}
      {activeMenu === 'presets' && (
        <div className="p-4">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><PresetIcon /> Presets</h3>
            <ul>
            {PRESETS.map((preset) => (
                <li key={preset.name}>
                <button
                    onClick={() => onPresetSelect(preset)}
                    className="w-full text-left p-2 rounded-md transition-colors hover:bg-white/10"
                >
                    {preset.name}
                </button>
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
};
