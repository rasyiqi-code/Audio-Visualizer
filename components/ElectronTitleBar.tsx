import React, { useEffect, useState } from 'react';
import { isElectron, electronWindowControls } from '../utils/electronUtils';

const ElectronTitleBar: React.FC = () => {
  const [showTitleBar, setShowTitleBar] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setShowTitleBar(isElectron());
  }, []);

  if (!showTitleBar) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-8 flex items-center justify-end pr-2 z-50 select-none group"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Window Controls - Only visible on hover */}
      <div 
        className={`flex items-center gap-0.5 transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Minimize Button */}
        <button
          onClick={electronWindowControls.minimize}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded"
          title="Minimize"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
          </svg>
        </button>

        {/* Maximize Button */}
        <button
          onClick={electronWindowControls.maximize}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded"
          title="Maximize"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={electronWindowControls.close}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors rounded"
          title="Close"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ElectronTitleBar;

