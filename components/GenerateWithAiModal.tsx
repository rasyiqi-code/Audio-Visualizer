import React, { useState, useCallback } from 'react';
import { FileUploadIcon } from './Icons';

interface GenerateWithAiModalProps {
    isOpen: boolean;
    isGenerating: boolean;
    error: string | null;
    onClose: () => void;
    onGenerate: (file: File) => void;
}

const GenerateWithAiModal: React.FC<GenerateWithAiModalProps> = ({ isOpen, isGenerating, error, onClose, onGenerate }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setPreviewUrl(null);
        }
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileChange(e.dataTransfer.files?.[0] || null);
    }, [handleFileChange]);

    const handleGenerateClick = () => {
        if (imageFile) {
            onGenerate(imageFile);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-4 sm:p-8 w-full max-w-md text-white border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Create Visualization with AI</h2>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Upload an image and our AI will generate a unique visualizer style inspired by its colors and mood.</p>
                
                <div 
                    className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 transition-colors touch-manipulation"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="ai-image-upload"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="ai-image-upload" className="cursor-pointer">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-md" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <FileUploadIcon />
                                <p className="mt-2 text-gray-400">Drag & drop an image here, or click to select</p>
                            </div>
                        )}
                    </label>
                </div>

                {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

                <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-4">
                    <button onClick={onClose} disabled={isGenerating} className="px-3 sm:px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm sm:text-base touch-manipulation">Cancel</button>
                    <button onClick={handleGenerateClick} disabled={!imageFile || isGenerating} className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm sm:text-base touch-manipulation">
                        {isGenerating && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isGenerating ? 'Generating...' : 'Generate Style'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateWithAiModal;
