import React, { useState } from 'react';
import { Theme, Visualization } from '../types';
import { SixteenNineIcon, NineSixteenIcon } from './Icons';

export interface ExportConfig {
    fileName: string;
    format: 'mp4' | 'webm';
    resolution: '720p' | '1080p';
    aspectRatio: '16:9' | '9:16';
}

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartRecording: (config: ExportConfig) => void;
    theme: Theme;
    visualization: Visualization;
    audioElement: HTMLAudioElement | null;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onStartRecording, audioElement }) => {
    const [config, setConfig] = useState<ExportConfig>({
        fileName: `audiovisualizer-${new Date().toISOString().slice(0,10)}.mp4`,
        format: 'mp4',
        resolution: '720p',
        aspectRatio: '16:9',
    });

    const handleStart = () => {
        if (!audioElement || audioElement.paused) {
            alert("Please play an audio file before exporting.");
            return;
        }
        onStartRecording(config);
        onClose();
    };

    if (!isOpen) return null;
    
    const dimensions = {
        '16:9': { '720p': '1280x720', '1080p': '1920x1080' },
        '9:16': { '720p': '720x1280', '1080p': '1080x1920' },
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg text-white border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Export Visualization as Video</h2>
                <p className="text-gray-400 mb-6">
                    Configure your video export settings. The current audio track will be recorded with the active visualization.
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fileName" className="block text-sm font-medium text-gray-300">File Name</label>
                        <input
                            type="text"
                            id="fileName"
                            value={config.fileName}
                            onChange={e => setConfig(c => ({...c, fileName: e.target.value }))}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Aspect Ratio</label>
                        <div className="mt-1 grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setConfig(c => ({...c, aspectRatio: '16:9'}))}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${config.aspectRatio === '16:9' ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                <SixteenNineIcon />
                                <span className="mt-2 text-sm">16:9 (Landscape)</span>
                            </button>
                            <button
                                onClick={() => setConfig(c => ({...c, aspectRatio: '9:16'}))}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${config.aspectRatio === '9:16' ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                <NineSixteenIcon />
                                <span className="mt-2 text-sm">9:16 (Portrait)</span>
                            </button>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300">Resolution</label>
                         <div className="mt-1 flex gap-4">
                             <button
                                onClick={() => setConfig(c => ({...c, resolution: '720p'}))}
                                className={`px-4 py-2 border-2 rounded-lg transition-colors ${config.resolution === '720p' ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                720p
                            </button>
                            <button
                                onClick={() => setConfig(c => ({...c, resolution: '1080p'}))}
                                className={`px-4 py-2 border-2 rounded-lg transition-colors ${config.resolution === '1080p' ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                1080p
                            </button>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">
                            Final dimensions: {dimensions[config.aspectRatio][config.resolution]}
                         </p>
                    </div>

                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                    <button 
                        onClick={handleStart} 
                        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        disabled={!audioElement || audioElement.paused}
                    >
                        Start Recording
                    </button>
                </div>
                 {(!audioElement || audioElement.paused) && (
                    <p className="text-yellow-400 mt-4 text-sm text-right">
                        You must be playing an audio file to start recording.
                    </p>
                 )}
            </div>
        </div>
    );
};

export default ExportModal;