# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🎯 Planned Features
- Mobile app (React Native)
- VST plugin support
- Cloud sync for custom visualizations
- Streaming integration (Spotify, YouTube Music)
- Auto-update for desktop app

---

## [1.0.0] - 2025-11-07

### ✨ Added
- **Desktop Application Support**
  - Electron-based native desktop app for Windows, macOS, and Linux
  - Custom minimalist title bar with hover controls
  - Native file dialogs for audio and video files
  - Offline support (except AI features)
  - Hardware-accelerated rendering
  
- **Visual Effects Layer**
  - Aurora Effect - Northern lights inspired background
  - Floating Particles - Ambient particle system
  - Light Rays - Volumetric light beams
  - Lens Flare - Camera lens flare effect
  - Chromatic Aberration - Color separation effect
  - Grid Background - Animated grid patterns
  - Wave Background - Flowing wave patterns
  - Corner Spotlights - Dynamic corner lighting
  - Reactive Border - Audio-reactive borders
  - Scan Lines - Retro CRT effect
  - Vignette - Edge darkening effect
  - Flash Effects - Beat-reactive flashes
  - Floating Orbs - Animated orb system
  - Music Notation - Musical notes animation
  - Orbiting Shapes - Rotating geometric shapes
  - Edge Glow - Glowing edge effects
  - Screen Shake - Beat-reactive shake

- **Visualization Modes**
  - Wave - Classic waveform visualization
  - Circular - Circular frequency bars
  - Spiral - Spiral-shaped audio visualization
  - Particles - Dynamic particle system
  - Geometric - Abstract geometric patterns
  - Advanced - Complex multi-layer visualization
  - Mirror - Symmetrical mirrored effects

- **Themes**
  - 10+ built-in themes (Neon Dreams, Ocean Waves, Sunset Vibes, etc.)
  - Custom Theme Editor
  - Save and load custom themes

- **Core Features**
  - Video export to MP4/WebM with FFmpeg
  - Playlist support with multiple tracks
  - Microphone input for real-time visualization
  - AI-powered visualization generation with Gemini AI
  - Fullscreen mode
  - Custom watermark
  - Effects intensity controls

- **Documentation**
  - Comprehensive README with features and installation guide
  - Desktop application guide (ELECTRON.md, README-DESKTOP.md)
  - Icon setup guide
  - Contributing guidelines
  - Issue and PR templates

### 🔧 Changed
- Migrated to Bun as package manager
- Updated to React 19
- Improved performance with optimized rendering
- Better mobile responsiveness

### 🐛 Fixed
- Audio playback issues on certain browsers
- Memory leaks in visualization rendering
- Export video freezing on large files

### 📝 Documentation
- Added comprehensive README
- Added CONTRIBUTING.md
- Added LICENSE (MIT)
- Added GitHub issue and PR templates
- Added desktop application documentation

### 🏗️ Technical
- TypeScript for type safety
- Vite for fast development and building
- Electron for desktop application
- Web Audio API for audio processing
- Canvas API for visualization rendering
- Tailwind CSS for styling

---

## [0.1.0] - 2025-11-06

### ✨ Initial Release
- Basic audio visualization with waveform
- File upload support
- Play/pause controls
- Volume control
- Basic theme system

---

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

[Unreleased]: https://github.com/rasyiqi-code/Audio-Visualizer/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/rasyiqi-code/Audio-Visualizer/releases/tag/v1.0.0
[0.1.0]: https://github.com/rasyiqi-code/Audio-Visualizer/releases/tag/v0.1.0

