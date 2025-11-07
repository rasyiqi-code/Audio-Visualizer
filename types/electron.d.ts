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
    electronAPI?: ElectronAPI;
  }
}

export {};

