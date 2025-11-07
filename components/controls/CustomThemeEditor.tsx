import React, { useState } from 'react';
import { Theme } from '../../types';

interface CustomThemeEditorProps {
  theme: Theme;
  onSave: (theme: Theme) => void;
  onCancel: () => void;
}

const CustomThemeEditor: React.FC<CustomThemeEditorProps> = ({ theme, onSave, onCancel }) => {
  const [customTheme, setCustomTheme] = useState<Theme>({
    ...theme,
    name: theme.name === 'Custom' ? theme.name : 'Custom'
  });

  const handleColorChange = (key: keyof Omit<Theme, 'name'>, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(customTheme);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/10"
        style={{
          boxShadow: `0 0 40px ${customTheme.primary}40`
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Custom Color Theme
        </h2>

        <div className="space-y-5">
          {/* Background Color */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-300 flex-1">Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customTheme.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: customTheme.background }}
              />
              <input
                type="text"
                value={customTheme.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-white/30"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Primary Color */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-300 flex-1">Primary</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customTheme.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: customTheme.primary }}
              />
              <input
                type="text"
                value={customTheme.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-white/30"
                placeholder="#FF0000"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-300 flex-1">Secondary</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customTheme.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: customTheme.secondary }}
              />
              <input
                type="text"
                value={customTheme.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-white/30"
                placeholder="#00FF00"
              />
            </div>
          </div>

          {/* Highlight Color */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-300 flex-1">Highlight</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customTheme.highlight}
                onChange={(e) => handleColorChange('highlight', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: customTheme.highlight }}
              />
              <input
                type="text"
                value={customTheme.highlight}
                onChange={(e) => handleColorChange('highlight', e.target.value)}
                className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-white/30"
                placeholder="#0000FF"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg border border-white/10" style={{ backgroundColor: customTheme.background }}>
            <p className="text-xs text-gray-400 mb-2">Preview:</p>
            <div className="flex gap-2">
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: customTheme.primary }}></div>
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: customTheme.secondary }}></div>
              <div className="flex-1 h-8 rounded" style={{ backgroundColor: customTheme.highlight }}></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${customTheme.primary}, ${customTheme.secondary})`,
              boxShadow: `0 4px 20px ${customTheme.primary}40`
            }}
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomThemeEditor;

