import React from 'react';

export const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; isActive?: boolean; title: string, themeColor: string, disabled?: boolean }> = ({ onClick, children, isActive, title, themeColor, disabled }) => {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`
                min-w-[44px] min-h-[44px] 
                sm:min-w-[40px] sm:min-h-[40px]
                p-2 sm:p-2.5
                rounded-full 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 
                disabled:opacity-50 disabled:cursor-not-allowed 
                touch-manipulation 
                flex items-center justify-center
                flex-shrink-0
                hover:scale-110 active:scale-95
            `}
            style={{ 
              backgroundColor: isActive ? themeColor : 'rgba(255, 255, 255, 0.15)',
              color: isActive ? 'white' : themeColor,
              '--tw-ring-color': themeColor,
              border: isActive ? 'none' : `1px solid ${themeColor}40`
            } as React.CSSProperties}
        >
            {children}
        </button>
    );
};