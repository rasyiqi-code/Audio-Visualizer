# 🚀 Deploy ke Vercel - Audio Visualizer Pro

## ✅ Status PWA

PWA sudah dikonfigurasi dan siap deploy!

---

## 📸 Step 1: Generate & Save PWA Icons (WAJIB)

### Generate Icons:

Script generator sudah dibuka di browser! 

**Download 3 icons:**
1. Click **"Download 192x192"** → Save sebagai `pwa-192x192.png`
2. Click **"Download 512x512"** → Save sebagai `pwa-512x512.png`  
3. Click **"Download Apple Icon"** → Save sebagai `apple-touch-icon.png`

### Save Icons:

**Copy semua 3 PNG files ke:**
```
G:\Audio-Visualizer\public\
```

Struktur akhir:
```
public/
├── pwa-192x192.png       ⭐ NEW
├── pwa-512x512.png       ⭐ NEW
├── apple-touch-icon.png  ⭐ NEW
├── favicon.ico
├── favicon.svg
└── robots.txt
```

---

## 🧪 Step 2: Test Build Locally

```powershell
cd G:\Audio-Visualizer

# Build untuk production
bun run build

# Test build
bun run preview
```

**Verify di Chrome:**
1. Buka http://localhost:4173
2. DevTools (F12) → **Application tab**
3. Check **Manifest** section - harus ada icons ✅
4. Check **Service Workers** - harus registered ✅

---

## 🚀 Step 3: Deploy ke Vercel

### Install Vercel CLI (jika belum):

```powershell
bun add -g vercel
```

### Login Vercel:

```powershell
vercel login
```

Pilih email atau GitHub authentication.

### Deploy:

```powershell
cd G:\Audio-Visualizer

# Deploy
vercel
```

**Jawab prompt:**
- Set up and deploy? **Y**
- Which scope? Pilih account Anda
- Link to existing project? **N**
- Project name? **audio-visualizer-pro** (atau nama lain)
- Directory? `.` (tekan Enter)
- Override settings? **N**

Wait ~2-3 menit untuk build selesai.

### Production Deploy:

Setelah preview berhasil:

```powershell
vercel --prod
```

---

## 🔑 Step 4: Setup Environment Variables

### Via CLI:

```powershell
# Add GEMINI_API_KEY
vercel env add GEMINI_API_KEY

# Paste your API key when prompted
# Select: Production, Preview, Development
```

### Via Dashboard:

1. Go to: https://vercel.com/dashboard
2. Pilih project **audio-visualizer-pro**
3. Settings → Environment Variables
4. Add variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: your_api_key_here
   - **Environment**: Production, Preview, Development
5. Save
6. Redeploy: `vercel --prod`

---

## 🧪 Step 5: Test PWA di Production

### Desktop Testing:

1. **Open di Chrome**: https://your-app.vercel.app
2. **Install prompt** harus muncul di address bar
3. **Click install** → App akan install ke desktop
4. **Launch PWA** dari Apps menu
5. **Test offline**: 
   - DevTools → Network → Offline
   - Refresh → App should work!

### Mobile Testing:

**Android (Chrome):**
1. Open app di Chrome mobile
2. Menu (⋮) → **"Install App"** atau **"Add to Home Screen"**
3. Launch dari home screen
4. Feels like native app!

**iOS (Safari):**
1. Open app di Safari
2. Share button → **"Add to Home Screen"**
3. Launch dari home screen
4. Full screen experience!

---

## 📊 Verify PWA

### Lighthouse Audit:

```bash
# Chrome DevTools
# Lighthouse tab → Generate Report
```

Target scores:
- ✅ PWA: 90+
- ✅ Performance: 85+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+

### PWA Checklist:

- [ ] ✅ Manifest file exists
- [ ] ✅ Service Worker registered
- [ ] ✅ Icons 192x192 & 512x512
- [ ] ✅ Apple touch icon
- [ ] ✅ Theme color set
- [ ] ✅ HTTPS enabled (Vercel default)
- [ ] ✅ Offline fallback
- [ ] ✅ Installable prompt

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain:

1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add domain: `audiovisualizer.com` (contoh)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~5-10 minutes)

### Update URLs:

After domain active, update:
- README.md → Demo link
- package.json → homepage
- Social media links

---

## 🔄 Redeploy (setelah perubahan)

```powershell
# Auto deploy on git push
git push origin main

# Manual deploy
vercel --prod
```

Vercel akan auto-deploy setiap kali ada push ke main branch!

---

## 📝 Vercel Configuration

File `vercel.json` sudah dikonfigurasi dengan:
- ✅ Custom build command (bun)
- ✅ Output directory (dist)
- ✅ Environment variables
- ✅ Security headers
- ✅ Service Worker headers
- ✅ SPA rewrites

---

## 🐛 Troubleshooting

### Build Gagal di Vercel

**Error: Bun not found**
Vercel support Bun, tapi jika error, fallback ke npm:
```json
{
  "buildCommand": "npm install && npm run build"
}
```

**Error: Out of memory**
```json
{
  "buildCommand": "NODE_OPTIONS='--max-old-space-size=4096' bun run build"
}
```

### PWA Not Working

**Manifest not found:**
- Check icons ada di `public/`
- Rebuild: `bun run build`
- Clear cache & hard refresh

**Service Worker not registering:**
- Check console errors
- Verify HTTPS (required for PWA)
- Check browser compatibility

### Environment Variables Not Working

```bash
# List current env vars
vercel env ls

# Pull env vars to local
vercel env pull

# Add missing var
vercel env add GEMINI_API_KEY
```

---

## 📊 Deployment Stats

**Build Time:** ~2-3 minutes  
**Bundle Size:** ~530 KB (gzipped: ~132 KB)  
**Service Worker:** Auto-generated  
**Caching:** Aggressive caching for assets  
**CDN:** Global edge network  

---

## 🎯 Quick Deployment Commands

```powershell
# 1. Generate icons (di browser yang sudah buka)
# Download 3 icons → Save ke public/

# 2. Verify icons
cd G:\Audio-Visualizer\public
dir *.png

# 3. Build & test
cd G:\Audio-Visualizer
bun run build
bun run preview

# 4. Deploy to Vercel
vercel login
vercel

# 5. Add API key
vercel env add GEMINI_API_KEY

# 6. Production deploy
vercel --prod
```

---

## 🌟 After Deployment

### Update README:

```markdown
## 🌐 Live Demo

🔗 **Web App**: https://your-app.vercel.app
📱 **Install as PWA**: Available on web
💻 **Desktop App**: [Download](https://github.com/rasyiqi-code/Audio-Visualizer/releases)
```

### Share Your App:

- Tweet with demo link
- Post on r/webdev
- Share on Discord
- Add to portfolio

---

## 🏆 Success Checklist

- [ ] PWA icons generated & saved di public/
- [ ] Build locally tested
- [ ] Deployed to Vercel
- [ ] GEMINI_API_KEY added
- [ ] Production deployed
- [ ] PWA tested on mobile
- [ ] Custom domain added (optional)
- [ ] README updated with demo link

---

**Ready to deploy! Follow steps above! 🚀**

