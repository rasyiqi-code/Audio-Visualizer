import React from 'react';

// FIX: Add 'disabled' prop to the component's props interface to fix the TypeScript error.
export const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; isActive?: boolean; title: string, themeColor: string, disabled?: boolean }> = ({ onClick, children, isActive, title, themeColor, disabled }) => {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
            style={{ 
              backgroundColor: isActive ? themeColor : 'rgba(255, 255, 255, 0.1)',
              color: isActive ? 'white' : themeColor,
              '--tw-ring-color': themeColor
            } as React.CSSProperties}
        >
            {children}
        </button>
    );
};