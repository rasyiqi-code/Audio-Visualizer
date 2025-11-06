import React from 'react';
import { Theme } from '../types';

interface WelcomeScreenProps {
    theme: Theme;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ theme }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-8 bg-black bg-opacity-50 rounded-lg">
                <h2 className="text-3xl font-bold mb-2" style={{ color: theme.highlight }}>Welcome!</h2>
                <p className="text-lg" style={{ color: theme.highlight }}>Upload an audio file or use your microphone to begin.</p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
