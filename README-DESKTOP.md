# 🎵 Audio Visualizer Pro - Desktop Edition

Aplikasi Audio Visualizer Pro yang telah dikonversi menjadi aplikasi desktop menggunakan Electron. Sekarang Anda dapat menikmati visualisasi audio yang menakjubkan tanpa perlu browser!

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Instalasi](#instalasi)
- [Cara Menggunakan](#cara-menggunakan)
- [Development](#development)
- [Build & Packaging](#build--packaging)
- [Struktur Project](#struktur-project)
- [Troubleshooting](#troubleshooting)

## ✨ Fitur

### Fitur Utama
- ✅ **Aplikasi Desktop Native** - Berjalan sebagai aplikasi standalone tanpa browser
- ✅ **Cross-Platform** - Support Windows, macOS, dan Linux
- ✅ **Native File Dialogs** - Buka dan simpan file menggunakan dialog sistem operasi
- ✅ **Custom Title Bar** - Kontrol window yang terintegrasi dengan UI
- ✅ **Better Performance** - Hardware acceleration untuk rendering optimal
- ✅ **Offline Support** - Bekerja sepenuhnya offline (kecuali fitur AI)

### Fitur Audio Visualizer
- 🎨 Multiple visualization modes (Wave, Circular, Spiral, Particles, dll)
- 🌈 Custom themes dan color schemes
- 🎬 Export ke video (MP4/WebM)
- 🎵 Playlist support
- 🎤 Microphone input support
- ⚡ Visual effects layer (Aurora, Particles, Light Rays, dll)
- 🤖 AI-powered visualization generation

## 📥 Instalasi

### Prasyarat
- [Bun](https://bun.sh) v1.0 atau lebih tinggi
- Node.js v18 atau lebih tinggi (optional, jika tidak menggunakan Bun)

### Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd Audio-Visualizer

# Install dependencies
bun install
```

## 🚀 Cara Menggunakan

### Development Mode

```bash
bun run dev:electron
```

Aplikasi akan otomatis:
1. Start Vite development server
2. Launch Electron window
3. Enable hot-reload untuk perubahan kode

### Production Build

```bash
# Build untuk Windows
bun run build:win

# Build untuk macOS
bun run build:mac

# Build untuk Linux
bun run build:linux

# Build untuk semua platform
bun run build
```

Hasil build akan tersimpan di folder `release/`.

## 🛠️ Development

### File Structure

```
Audio-Visualizer/
├── electron/              # Electron source files
│   ├── main.ts           # Main process (window management, IPC)
│   ├── preload.ts        # Preload script (secure IPC bridge)
│   └── tsconfig.json     # TypeScript config untuk Electron
├── components/           # React components
├── utils/
│   └── electronUtils.ts  # Utility functions untuk Electron API
├── types/
│   └── electron.d.ts     # TypeScript definitions untuk Electron API
├── dist/                 # Built web app (generated)
├── dist-electron/        # Built electron files (generated)
└── release/              # Final installers/packages (generated)
```

### Scripts Available

```bash
# Development
bun run dev              # Start Vite dev server only
bun run dev:electron     # Start Electron app dengan dev server

# Build
bun run build            # Build web app + create installer
bun run build:win        # Build Windows installer (NSIS)
bun run build:mac        # Build macOS DMG
bun run build:linux      # Build Linux AppImage & DEB
bun run build:dir        # Build unpacked (untuk testing)

# Preview
bun run preview          # Preview production build (web only)
```

### Hot Reload

- **React Components**: Hot reload otomatis ✅
- **Main Process**: Perlu restart manual ⚠️
- **Preload Script**: Reload otomatis ✅

### Debugging

Development mode otomatis membuka DevTools. Untuk production:

1. Edit `electron/main.ts`
2. Uncomment baris:
   ```typescript
   mainWindow.webContents.openDevTools();
   ```

## 📦 Build & Packaging

### Konfigurasi Build

File `electron-builder.yml` dan section `build` di `package.json` mengatur:

- **App ID**: `com.audiovisualizer.app`
- **Product Name**: `Audio Visualizer Pro`
- **Icons**: `public/favicon.svg`
- **Output Directory**: `release/`

### Platform-Specific

#### Windows (NSIS Installer)
```bash
bun run build:win
```
Output: `release/Audio Visualizer Pro-1.0.0-Setup.exe`

Features:
- Custom installation directory
- Desktop shortcut
- Start menu shortcut
- Uninstaller

#### macOS (DMG)
```bash
bun run build:mac
```
Output: `release/Audio Visualizer Pro-1.0.0.dmg`

Features:
- Drag & drop installer
- Code signing ready (perlu developer certificate)

#### Linux (AppImage & DEB)
```bash
bun run build:linux
```
Output:
- `release/Audio Visualizer Pro-1.0.0.AppImage`
- `release/Audio Visualizer Pro-1.0.0.deb`

### Icon Requirements

Untuk hasil terbaik, siapkan icon dalam berbagai ukuran:

- **Windows**: `icon.ico` (256x256, 128x128, 64x64, 48x48, 32x32, 16x16)
- **macOS**: `icon.icns` (1024x1024, 512x512, 256x256, 128x128, 64x64, 32x32, 16x16)
- **Linux**: `icon.png` (512x512)

Letakkan di folder `public/` dan update path di `electron-builder.yml`.

## 🏗️ Struktur Project

### Main Process (`electron/main.ts`)

Menangani:
- Window creation & management
- IPC handlers untuk file dialogs
- File system operations
- App lifecycle events

### Preload Script (`electron/preload.ts`)

Menyediakan:
- Secure bridge antara main dan renderer process
- Type-safe API untuk renderer
- Context isolation

### Electron Utils (`utils/electronUtils.ts`)

Helper functions:
- `isElectron()`: Deteksi apakah berjalan di Electron
- `openAudioFileDialog()`: Buka file dialog native
- `saveVideoFileDialog()`: Save file dialog native
- `writeFileToDisk()`: Write file ke disk
- `electronWindowControls`: Window control functions

### Type Definitions (`types/electron.d.ts`)

TypeScript definitions untuk:
- Window.electronAPI interface
- IPC communication types
- Return types untuk semua API calls

## 🔧 Troubleshooting

### Build Gagal

**Problem**: Error saat building
```bash
# Solution 1: Clear cache
rm -rf dist dist-electron release node_modules
bun install

# Solution 2: Build step by step
bun run dev              # Test web build first
bun run build:dir        # Test packaging without installer
```

**Problem**: Icon tidak muncul
```bash
# Solution: Convert SVG to PNG/ICO
# Gunakan online converter atau ImageMagick
# Update path di electron-builder.yml
```

### Runtime Errors

**Problem**: White screen saat launch
```bash
# Check console untuk errors
# Pastikan dist/ folder tergenerate dengan benar
# Coba rebuild: bun run build
```

**Problem**: File dialog tidak berfungsi
```bash
# Pastikan IPC handlers terdaftar di main.ts
# Check console untuk errors
# Verify preload script loaded correctly
```

**Problem**: DevTools tidak muncul
```bash
# Edit electron/main.ts
# Uncomment: mainWindow.webContents.openDevTools();
```

### Performance Issues

**Problem**: Aplikasi lambat
```bash
# Disable hardware acceleration jika perlu
# Edit electron/main.ts, uncomment:
# app.disableHardwareAcceleration();
```

**Problem**: Video export lambat
```bash
# Normal untuk file besar
# FFmpeg conversion memakan waktu
# Gunakan format WebM untuk speed
```

## 🌐 Web vs Desktop

### Perbedaan

| Feature | Web Version | Desktop Version |
|---------|-------------|-----------------|
| File Access | HTML Input | Native Dialogs |
| Save File | Download | Direct File Write |
| Performance | Browser Engine | Chromium + Node |
| Offline | Limited | Full Support |
| Updates | Auto | Manual Install |
| Size | ~5MB | ~150MB |

### Kompatibilitas

Aplikasi desktop tetap kompatibel dengan versi web. Anda bisa:
- Run web version: `bun run dev`
- Run desktop version: `bun run dev:electron`

## 📝 Notes

- Aplikasi menggunakan **Vite** untuk bundling
- **Electron Builder** untuk packaging
- **IPC** untuk komunikasi main-renderer process
- **Context isolation** enabled untuk keamanan
- **Sandbox** disabled untuk akses file system

## 🤝 Contributing

Untuk kontribusi:
1. Fork repository
2. Create feature branch
3. Test di desktop dan web version
4. Submit pull request

## 📄 License

[Your License Here]

## 🔗 Links

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Plugin Electron](https://github.com/electron-vite/vite-plugin-electron)
- [Electron Builder](https://www.electron.build/)

---

**Made with ❤️ using Electron + React + Vite**

