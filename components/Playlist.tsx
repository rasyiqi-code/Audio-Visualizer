import React from 'react';
import { PlaylistItem, Theme } from '../types';
import { PlayIcon, RemoveIcon } from './Icons';

interface PlaylistProps {
    playlist: PlaylistItem[];
    currentTrackIndex: number;
    theme: Theme;
    onPlayTrack: (index: number) => void;
    onRemoveTrack: (id: string) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist, currentTrackIndex, theme, onPlayTrack, onRemoveTrack }) => {
    if (playlist.length === 0) return null;

    return (
        <div className="absolute top-0 left-0 sm:left-auto right-0 m-2 sm:m-4 mt-12 sm:mt-20 bg-black bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg w-[calc(100%-1rem)] sm:w-full max-w-sm max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-12rem)] overflow-y-auto z-35">
            <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3" style={{ color: theme.highlight }}>Playlist</h3>
                <ul>
                    {playlist.map((track, index) => (
                        <li 
                            key={track.id} 
                            className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 ${
                                index === currentTrackIndex ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <button 
                                    onClick={() => onPlayTrack(index)} 
                                    className="flex-shrink-0"
                                    title={`Play ${track.name}`}
                                    style={{ color: index === currentTrackIndex ? theme.primary : theme.secondary }}
                                >
                                    <PlayIcon />
                                </button>
                                <span className="truncate" style={{ color: index === currentTrackIndex ? theme.primary : 'white' }}>
                                    {track.name}
                                </span>
                            </div>
                            <button 
                                onClick={() => onRemoveTrack(track.id)} 
                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                title={`Remove ${track.name}`}
                            >
                                <RemoveIcon />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Playlist;