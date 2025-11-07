# 🚀 Quick Icon Setup - 5 Menit!

## Cara Tercepat (Pilih salah satu):

### ✅ Opsi 1: Generate Icon (1 menit)

1. Buka file: `scripts/generate-icon.html` di browser
2. Klik "Download as PNG"
3. Buka: https://convertio.co/png-ico/
4. Upload PNG yang baru didownload
5. Download `icon.ico`
6. Pindahkan ke: `G:\Audio-Visualizer\public\icon.ico`

### ✅ Opsi 2: Download Icon Siap Pakai (2 menit)

**Website Icon Gratis:**
1. https://flaticon.com/search?word=music+wave
2. https://icons8.com/icons/set/music
3. https://iconmonstr.com/ (cari "audio" atau "music")

**Langkah:**
1. Download icon format PNG (512x512 atau lebih)
2. Convert ke ICO: https://convertio.co/png-ico/
   - ✅ Check boxes: 256, 128, 64, 48, 32, 16
3. Save sebagai `icon.ico` di folder `public/`

### ✅ Opsi 3: Gunakan Emoji (30 detik)

1. Buka: https://favicon.io/emoji-favicons/
2. Search: "🎵" atau "🎧" atau "📻"
3. Generate & Download
4. Extract file, rename ke `icon.ico`
5. Copy ke `public/` folder

## 📝 Setelah Icon Siap

Update `package.json`:

```json
{
  "build": {
    "win": {
      "icon": "public/icon.ico"
    }
  }
}
```

## 🧪 Test Icon

```bash
# Build aplikasi
bun run build:dir

# Check icon di:
# G:\Audio-Visualizer\release\win-unpacked\AudioVisualizerPro.exe
```

## ⚠️ Troubleshooting

**Icon tidak muncul di EXE:**
- Pastikan `icon.ico` ada di `public/` folder
- File size tidak boleh lebih dari 256KB
- Format harus .ico, bukan .png

**Icon pecah/blur:**
- Gunakan PNG minimal 512x512 sebagai source
- Pastikan convert ke ICO dengan multiple sizes (256, 128, 64, 48, 32, 16)

## 🎨 Recommended Design

Untuk Audio Visualizer, icon yang bagus:
- ✅ Sound wave / waveform
- ✅ Equalizer bars
- ✅ Music note dengan wave
- ✅ Gradient purple/blue (modern)
- ❌ Terlalu complex (tidak clear di size kecil)

## ⚡ Super Quick (Gunakan Favicon Generator)

Jika sangat terburu-buru:

1. Buka: https://realfavicongenerator.net/
2. Upload logo/image apapun
3. Download package
4. Ambil file `favicon.ico`, rename ke `icon.ico`
5. Done! ✨

