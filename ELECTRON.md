# Audio Visualizer Pro - Desktop Application

Aplikasi Audio Visualizer telah dikonversi menjadi aplikasi desktop menggunakan Electron.

## 🚀 Cara Menjalankan Development

```bash
# Install dependencies (jika belum)
bun install

# Jalankan aplikasi dalam mode development
bun run dev:electron
```

Aplikasi akan otomatis membuka window Electron dengan fitur hot-reload aktif.

## 📦 Build Aplikasi Desktop

> **⚠️ PENTING**: Jika Anda mengalami error saat build (ENOENT: electron.exe), ini biasanya disebabkan oleh:
> - Antivirus memblock file electron.exe
> - Windows Defender SmartScreen
> 
> **Solusi**: Tambahkan folder `G:\Audio-Visualizer\node_modules\electron` dan `G:\Audio-Visualizer\release` ke exclusion list antivirus Anda.

### Build untuk Windows (NSIS Installer)
```bash
bun run build:win
```
Output: `release/AudioVisualizerPro-1.0.0-Setup.exe`

### Build untuk macOS (DMG)
```bash
bun run build:mac
```
Output: `release/Audio Visualizer Pro-1.0.0.dmg`

### Build untuk Linux (AppImage & DEB)
```bash
bun run build:linux
```
Output: 
- `release/Audio Visualizer Pro-1.0.0.AppImage`
- `release/Audio Visualizer Pro-1.0.0.deb`

### Build untuk Semua Platform
```bash
bun run build
```

### Build Unpacked (untuk testing)
```bash
bun run build:dir
```

## ✨ Fitur Electron

### 1. **Native File Dialogs**
- Buka file audio menggunakan dialog sistem operasi native
- Save video dengan dialog save file native

### 2. **Window Controls**
- Custom title bar dengan kontrol minimize, maximize, close
- Support untuk fullscreen mode

### 3. **Better Performance**
- Hardware acceleration untuk rendering
- Native audio processing
- Optimized untuk desktop environment

### 4. **Offline Support**
- Aplikasi berjalan sepenuhnya offline (kecuali fitur AI)
- Tidak memerlukan browser

## 🔧 Konfigurasi

### Electron Builder Configuration
File `electron-builder.yml` dan section `build` di `package.json` mengatur:
- App ID dan product name
- Icon aplikasi
- Target platform dan format installer
- File yang di-include dalam build

### Main Process
File `electron/main.ts` menangani:
- Window creation dan management
- IPC communication
- File system operations
- Dialog handlers

### Preload Script
File `electron/preload.ts` menyediakan:
- Secure IPC bridge antara main dan renderer process
- Type-safe API untuk renderer

## 📁 Struktur Folder

```
Audio-Visualizer/
├── electron/           # Electron source files
│   ├── main.ts        # Main process
│   └── preload.ts     # Preload script
├── dist/              # Built web app
├── dist-electron/     # Built electron files
├── release/           # Final installers/packages
└── types/
    └── electron.d.ts  # TypeScript types untuk Electron API
```

## 🛠️ Troubleshooting

### Dev Tools tidak muncul
Edit `electron/main.ts` line 37 untuk mengaktifkan:
```typescript
mainWindow.webContents.openDevTools();
```

### Icon tidak muncul
Pastikan file `public/favicon.svg` exists atau ganti dengan format `.png` atau `.ico`

### Build gagal dengan error "ENOENT: electron.exe"

Ini adalah masalah umum di Windows. Solusi:

**Solusi 1: Disable Antivirus Sementara**
```powershell
# Tambahkan exclusions di Windows Defender
Add-MpPreference -ExclusionPath "G:\Audio-Visualizer\node_modules\electron"
Add-MpPreference -ExclusionPath "G:\Audio-Visualizer\release"
```

**Solusi 2: Reinstall Electron**
```bash
Remove-Item node_modules\electron -Recurse -Force
bun add -D electron
```

**Solusi 3: Build Manual (Portable)**
```bash
# Build web app
bun run build

# Copy electron manual
# Aplikasi akan jalan dari folder dist
```

### Build gagal (umum)
1. Pastikan semua dependencies terinstall: `bun install`
2. Clear cache: `Remove-Item node_modules\.cache -Recurse -Force`
3. Cek log error di console

### Error saat running
1. Clear cache: hapus folder `dist` dan `dist-electron`
2. Reinstall dependencies: `rm -rf node_modules && bun install`
3. Rebuild: `bun run dev:electron`

## 🌟 Tips

1. **Development**: Gunakan `bun run dev:electron` untuk development dengan hot-reload
2. **Testing Build**: Gunakan `bun run build:dir` untuk test build tanpa membuat installer
3. **Production**: Gunakan `bun run build:win` untuk membuat installer production-ready

## 📝 Notes

- Aplikasi menggunakan Vite untuk bundling
- Hot reload bekerja untuk perubahan kode React
- Main process perlu restart manual jika ada perubahan di `electron/main.ts`

