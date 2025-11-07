import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // File dialogs
  openAudioFile: () => ipcRenderer.invoke('dialog:openAudioFile'),
  saveVideoFile: (defaultName: string) => ipcRenderer.invoke('dialog:saveVideoFile', defaultName),
  
  // File system
  writeFile: (filePath: string, data: Buffer) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  
  // Platform detection
  platform: process.platform,
  isElectron: true,
});

// TypeScript type declaration for window object
export interface ElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  openAudioFile: () => Promise<{
    success: boolean;
    filePath?: string;
    fileName?: string;
    data?: string;
  }>;
  saveVideoFile: (defaultName: string) => Promise<{
    success: boolean;
    filePath?: string;
  }>;
  writeFile: (filePath: string, data: Buffer) => Promise<{
    success: boolean;
    error?: string;
  }>;
  platform: string;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

