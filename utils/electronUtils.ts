/**
 * Utility functions untuk integrasi Electron
 */

/**
 * Check apakah aplikasi berjalan di Electron
 */
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI?.isElectron === true;
};

/**
 * Open audio file menggunakan Electron dialog atau fallback ke HTML input
 */
export const openAudioFileDialog = async (): Promise<File | null> => {
  if (isElectron() && window.electronAPI) {
    const result = await window.electronAPI.openAudioFile();
    
    if (result.success && result.data && result.fileName) {
      // Convert base64 to Blob
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
      
      // Create File from Blob
      const file = new File([blob], result.fileName, {
        type: getMimeType(result.fileName)
      });
      
      return file;
    }
  }
  
  return null;
};

/**
 * Save video file menggunakan Electron dialog
 */
export const saveVideoFileDialog = async (defaultName: string): Promise<string | null> => {
  if (isElectron() && window.electronAPI) {
    const result = await window.electronAPI.saveVideoFile(defaultName);
    
    if (result.success && result.filePath) {
      return result.filePath;
    }
  }
  
  return null;
};

/**
 * Write file to disk (Electron only)
 */
export const writeFileToDisk = async (filePath: string, data: Blob): Promise<boolean> => {
  if (isElectron() && window.electronAPI) {
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await window.electronAPI.writeFile(filePath, buffer);
    return result.success;
  }
  
  return false;
};

/**
 * Get MIME type from file name
 */
const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
    'm4a': 'audio/mp4',
    'aac': 'audio/aac',
    'wma': 'audio/x-ms-wma',
  };
  
  return mimeTypes[ext || ''] || 'audio/mpeg';
};

/**
 * Window controls untuk Electron
 */
export const electronWindowControls = {
  minimize: () => {
    if (isElectron() && window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  },
  maximize: () => {
    if (isElectron() && window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  },
  close: () => {
    if (isElectron() && window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  }
};

/**
 * Get platform info
 */
export const getPlatform = (): string => {
  if (isElectron() && window.electronAPI) {
    return window.electronAPI.platform;
  }
  return 'web';
};

