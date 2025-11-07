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

    // Check if browser supports recording
    const [recordingSupported, setRecordingSupported] = React.useState<boolean>(false);
    
    React.useEffect(() => {
        const supported = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') || 
                         MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ||
                         MediaRecorder.isTypeSupported('video/webm');
        setRecordingSupported(supported);
    }, []);

    const handleStart = () => {
        if (!audioElement) {
            alert("Mohon upload audio file terlebih dahulu.");
            return;
        }
        // No need to check if paused - we'll restart from beginning anyway
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
                <h2 className="text-2xl font-bold mb-4">Export Visualisasi ke Video MP4</h2>
                <p className="text-gray-400 mb-4">
                    Konfigurasi pengaturan export video. Audio akan otomatis diulang dari awal dan direkam sampai selesai bersama visualisasi aktif.
                </p>
                <div className="mb-6 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300 text-sm">
                    💡 <strong>Smart Recording:</strong> Jika browser mendukung MP4 native, video akan langsung direkam ke MP4 tanpa konversi (lebih cepat!). Jika tidak, video akan direkam dalam WebM lalu otomatis dikonversi ke MP4 (H.264) menggunakan FFmpeg.
                </div>
                
                {!recordingSupported && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-sm">
                        ⚠️ Browser Anda tidak mendukung recording video. Silakan gunakan Chrome atau Firefox.
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fileName" className="block text-sm font-medium text-gray-300">Nama File</label>
                        <input
                            type="text"
                            id="fileName"
                            value={config.fileName}
                            onChange={e => setConfig(c => ({...c, fileName: e.target.value }))}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            File akan disimpan dengan ekstensi .mp4 (H.264 codec)
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Rasio Aspek</label>
                        <div className="mt-1 grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setConfig(c => ({...c, aspectRatio: '16:9'}))}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${config.aspectRatio === '16:9' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                <SixteenNineIcon />
                                <span className="mt-2 text-sm font-medium">16:9 (Landscape)</span>
                            </button>
                            <button
                                onClick={() => setConfig(c => ({...c, aspectRatio: '9:16'}))}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${config.aspectRatio === '9:16' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                <NineSixteenIcon />
                                <span className="mt-2 text-sm font-medium">9:16 (Portrait)</span>
                            </button>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300">Resolusi</label>
                         <div className="mt-1 flex gap-4">
                             <button
                                onClick={() => setConfig(c => ({...c, resolution: '720p'}))}
                                className={`px-6 py-2 border-2 rounded-lg transition-colors font-medium ${config.resolution === '720p' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                720p
                            </button>
                            <button
                                onClick={() => setConfig(c => ({...c, resolution: '1080p'}))}
                                className={`px-6 py-2 border-2 rounded-lg transition-colors font-medium ${config.resolution === '1080p' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                1080p
                            </button>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">
                            Dimensi akhir: {dimensions[config.aspectRatio][config.resolution]}
                         </p>
                         <p className="text-xs text-blue-400 mt-1">
                            💡 Bitrate: 5 Mbps @ 30 FPS
                         </p>
                    </div>

                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors font-medium"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleStart} 
                        className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                        disabled={!audioElement || !recordingSupported}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="3" />
                        </svg>
                        Mulai Recording
                    </button>
                </div>
                 {!audioElement && (
                    <p className="text-yellow-400 mt-4 text-sm text-right">
                        ⚠️ Upload audio file terlebih dahulu untuk memulai recording.
                    </p>
                 )}
                 {audioElement && recordingSupported && (
                    <p className="text-blue-400 mt-2 text-xs text-right">
                        💡 Audio akan otomatis diulang dari awal saat recording dimulai
                    </p>
                 )}
                 {recordingSupported && (
                    <p className="text-green-400 mt-2 text-xs text-right">
                        ✓ Browser mendukung recording video • Konversi otomatis ke MP4
                    </p>
                 )}
            </div>
        </div>
    );
};

export default ExportModal;