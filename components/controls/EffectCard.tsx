import React from 'react';
import { VisualEffects } from '../../types';

interface EffectCardProps {
  title: string;
  description?: string;
  effectName: keyof VisualEffects;
  effects: VisualEffects;
  themeColor: string;
  onToggle: (effectName: keyof VisualEffects) => void;
  onIntensityChange: (effectName: keyof VisualEffects, intensity: number) => void;
  category?: 'background' | 'light' | 'overlay' | 'screen';
}

const EffectCard: React.FC<EffectCardProps> = ({
  title,
  description,
  effectName,
  effects,
  themeColor,
  onToggle,
  onIntensityChange,
  category
}) => {
  const effect = effects[effectName];
  
  const categoryColors = {
    background: '#4ade80',
    light: '#fbbf24',
    overlay: '#a78bfa',
    screen: '#f87171',
  };
  
  const borderColor = category ? categoryColors[category] : themeColor;

  return (
    <div 
      className="bg-white/5 rounded-lg p-3 transition-all hover:bg-white/10" 
      style={{ borderLeft: `2px solid ${borderColor}40` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="font-medium text-sm">{title}</span>
          {description && <span className="text-xs text-gray-400">{description}</span>}
        </div>
        <button
          onClick={() => onToggle(effectName)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
            effect.enabled ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              effect.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {effect.enabled && (
        <div className="mt-2">
          <label className="text-xs text-gray-400 mb-1 block">
            Intensity: {effect.intensity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={effect.intensity}
            onChange={(e) => onIntensityChange(effectName, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${effect.intensity}%, #374151 ${effect.intensity}%, #374151 100%)`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EffectCard;

