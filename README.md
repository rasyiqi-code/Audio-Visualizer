# 🎵 Audio Visualizer Pro

<div align="center">

![Audio Visualizer Pro](https://img.shields.io/badge/Audio-Visualizer-purple?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Professional Audio Visualizer with Real-time Effects & Desktop Support**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Desktop App](#-desktop-app) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

Audio Visualizer Pro adalah aplikasi visualisasi audio yang powerful dan modern, tersedia sebagai **Web App** dan **Desktop Application**. Dengan 20+ visual effects, multiple themes, dan AI-powered generation, aplikasi ini memberikan pengalaman visualisasi audio yang menakjubkan.

### ✨ Key Features

- 🎨 **8+ Visualization Modes** - Wave, Circular, Spiral, Particles, Geometric, dan lainnya
- 🌈 **Multiple Themes** - 10+ built-in themes dengan custom theme editor
- ⚡ **20+ Visual Effects** - Aurora, Floating Particles, Light Rays, Lens Flare, dan banyak lagi
- 🎬 **Video Export** - Export visualisasi ke MP4/WebM
- 🎵 **Playlist Support** - Kelola multiple tracks dengan mudah
- 🎤 **Microphone Input** - Real-time visualization dari microphone
- 🤖 **AI-Powered Generation** - Generate custom visualizations dengan Gemini AI
- 💻 **Desktop App** - Native Windows/macOS/Linux application dengan Electron
- 📱 **Responsive** - Works on desktop dan mobile browsers

---

## 🚀 Quick Start

### Web Application

```bash
# Install dependencies
bun install

# Set your Gemini API key in .env
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run development server
bun run dev

# Build for production
bun run build
```

Visit `http://localhost:3000` to see the app!

### Desktop Application

```bash
# Install dependencies (if not already)
bun install

# Run desktop app in development mode
bun run dev:electron

# Build desktop app
bun run package
```

The executable will be in `release/AudioVisualizerPro-win32-x64/AudioVisualizerPro.exe`

📚 **Full desktop documentation:** [README-DESKTOP.md](README-DESKTOP.md)

---

## 🎯 Features

### 🎨 Visualization Modes

| Mode | Description |
|------|-------------|
| **Wave** | Classic waveform visualization |
| **Circular** | Circular frequency bars |
| **Spiral** | Spiral-shaped audio visualization |
| **Particles** | Dynamic particle system |
| **Geometric** | Abstract geometric patterns |
| **Advanced** | Complex multi-layer visualization |
| **Mirror** | Symmetrical mirrored effects |
| **Custom** | AI-generated custom visualizations |

### ⚡ Visual Effects

<details>
<summary>Click to see all effects</summary>

- 🌌 **Aurora Effect** - Northern lights inspired background
- ✨ **Floating Particles** - Ambient particle system
- 🔆 **Light Rays** - Volumetric light beams
- 💫 **Lens Flare** - Camera lens flare effect
- 🎭 **Chromatic Aberration** - Color separation effect
- 📐 **Grid Background** - Animated grid patterns
- 🌊 **Wave Background** - Flowing wave patterns
- 🎯 **Corner Spotlights** - Dynamic corner lighting
- 🔲 **Reactive Border** - Audio-reactive borders
- 📺 **Scan Lines** - Retro CRT effect
- 🌑 **Vignette** - Edge darkening effect
- 💥 **Flash Effects** - Beat-reactive flashes
- 🎪 **Floating Orbs** - Animated orb system
- 🎼 **Music Notation** - Musical notes animation
- 🔄 **Orbiting Shapes** - Rotating geometric shapes
- 🌟 **Edge Glow** - Glowing edge effects
- 📺 **Screen Shake** - Beat-reactive shake
- And more!

</details>

### 🎨 Themes

- **Neon Dreams** - Vibrant neon colors
- **Ocean Waves** - Cool ocean blues
- **Sunset Vibes** - Warm sunset gradients
- **Forest Twilight** - Nature-inspired greens
- **Purple Haze** - Deep purple tones
- **Fire & Ice** - Contrasting warm/cool
- **Midnight City** - Dark cyberpunk
- **Tropical Paradise** - Bright tropical colors
- **Monochrome** - Classic black & white
- **Candy Pop** - Playful candy colors
- **Custom Theme** - Create your own!

---

## 💻 Desktop App

Audio Visualizer Pro tersedia sebagai **native desktop application** untuk Windows, macOS, dan Linux!

### Desktop Features

✅ **Native Performance** - Hardware-accelerated rendering  
✅ **Custom Title Bar** - Minimalist hover controls  
✅ **Native File Dialogs** - System file pickers  
✅ **Offline Support** - Works without internet (except AI features)  
✅ **Fullscreen Mode** - Immersive visualization experience  
✅ **Auto-updates** - Keep your app up to date (coming soon)

### Download

📥 **Latest Release:** Check [Releases](https://github.com/rasyiqi-code/Audio-Visualizer/releases) page

Or build from source:
```bash
bun run package
```

📖 **Complete Guide:** [ELECTRON.md](ELECTRON.md) | [README-DESKTOP.md](README-DESKTOP.md)

---

## 🛠️ Tech Stack

### Core Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Bun** - Package manager & runtime

### Desktop (Electron)

- **Electron 39** - Desktop framework
- **electron-packager** - Application bundler
- **IPC** - Secure inter-process communication

### APIs & Libraries

- **Web Audio API** - Audio processing
- **Canvas API** - Visualization rendering
- **Google Gemini AI** - AI-powered generation
- **FFmpeg.js** - Video encoding
- **Tailwind CSS** - Styling

---

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh) v1.0+ (or Node.js 18+)
- Modern web browser (Chrome, Firefox, Edge, Safari)
- For desktop: Windows 10+, macOS 10.13+, or Linux

### Web Development

```bash
# Clone repository
git clone https://github.com/rasyiqi-code/Audio-Visualizer.git
cd Audio-Visualizer

# Install dependencies
bun install

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start development server
bun run dev
```

### Desktop Development

```bash
# After web setup, run:
bun run dev:electron
```

### Production Build

```bash
# Web build
bun run build

# Desktop build (Windows)
bun run package

# Desktop build (all platforms)
bun run package:all
```

---

## 🎮 Usage

### Basic Usage

1. **Upload Audio** - Click upload button or drag & drop audio file
2. **Select Visualization** - Choose from 8+ visualization modes
3. **Choose Theme** - Pick a theme or create custom
4. **Add Effects** - Toggle and adjust visual effects
5. **Enjoy!** - Watch your music come to life

### Advanced Features

#### 🎬 Export Video

1. Click the video camera icon
2. Configure export settings (resolution, format, duration)
3. Click "Start Recording"
4. Wait for processing
5. Download your video!

#### 🤖 AI Generation

1. Click "Generate with AI" button
2. Describe your desired visualization
3. Wait for AI to generate code
4. Save and use your custom visualization!

#### 🎵 Playlist

1. Upload multiple audio files
2. Manage tracks in playlist panel
3. Auto-play next track when finished

#### 🎤 Microphone Input

1. Click microphone icon
2. Allow microphone access
3. Real-time visualization from your mic!

---

## 📁 Project Structure

```
Audio-Visualizer/
├── components/           # React components
│   ├── controls/        # Control panel components
│   ├── effects/         # Visual effects
│   ├── visualizer/      # Visualization renderers
│   ├── ElectronTitleBar.tsx
│   └── ...
├── electron/            # Electron main & preload
│   ├── main.ts         # Main process
│   └── preload.ts      # Preload script
├── utils/              # Utility functions
│   ├── electronUtils.ts
│   ├── ffmpegConverter.ts
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── public/             # Static assets
├── dist/               # Web build output
├── dist-electron/      # Electron build output
└── release/            # Desktop app builds
```

---

## 🎨 Customization

### Create Custom Theme

1. Open the app
2. Click theme selector
3. Choose "Custom Theme"
4. Adjust colors:
   - Primary color
   - Secondary color
   - Background color
   - Accent colors
5. Save your theme!

### Create Custom Visualization

1. Click "Generate with AI"
2. Describe your visualization in detail
3. Review generated code
4. Test and adjust
5. Save to library

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📝 Documentation

- **[ELECTRON.md](ELECTRON.md)** - Electron desktop app guide
- **[README-DESKTOP.md](README-DESKTOP.md)** - Complete desktop documentation
- **[QUICK-ICON-GUIDE.md](QUICK-ICON-GUIDE.md)** - Icon setup guide
- **[ICON-SETUP.md](ICON-SETUP.md)** - Detailed icon configuration
- **[BERHASIL-BUILD.md](BERHASIL-BUILD.md)** - Build success guide
- **[DESKTOP-APP-SUMMARY.md](DESKTOP-APP-SUMMARY.md)** - Desktop features summary

---

## 🐛 Known Issues

- Build with electron-builder may fail on some Windows systems (use electron-packager instead)
- FFmpeg conversion may be slow for large files
- Some effects may impact performance on low-end devices

See [Issues](https://github.com/rasyiqi-code/Audio-Visualizer/issues) for full list.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] VST plugin support
- [ ] Cloud sync for custom visualizations
- [ ] Real-time collaboration
- [ ] Streaming integration (Spotify, YouTube Music)
- [ ] More AI-powered features
- [ ] Plugin system for custom effects
- [ ] Performance optimizations
- [ ] Auto-update for desktop app

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - AI-powered features
- **Electron** - Desktop application framework
- **React Team** - Amazing UI framework
- **Vite Team** - Lightning-fast build tool
- **FFmpeg.js** - Video encoding support
- **Open Source Community** - Inspiration and resources

---

## 📧 Contact

**Project Link:** [https://github.com/rasyiqi-code/Audio-Visualizer](https://github.com/rasyiqi-code/Audio-Visualizer)

**Issues:** [Report Bug](https://github.com/rasyiqi-code/Audio-Visualizer/issues) | [Request Feature](https://github.com/rasyiqi-code/Audio-Visualizer/issues)

---

<div align="center">

**Made with ❤️ using React, Electron, and Gemini AI**

⭐ Star this repo if you find it useful!

[⬆ Back to Top](#-audio-visualizer-pro)

</div>
