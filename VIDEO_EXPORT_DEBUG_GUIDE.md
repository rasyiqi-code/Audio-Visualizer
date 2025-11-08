# 🔍 Video Export Debug Guide

## Issue: Video Tidak Terdownload

User melaporkan setelah recording, **tidak ada file video yang terdownload**.

---

## Diagnostic Steps

### Step 1: Test dengan Console Terbuka

```bash
bun run dev
```

**IMPORTANT:** 
1. Buka browser **Chrome** (WAJIB!)
2. Press **F12** untuk open DevTools
3. Go to **Console** tab
4. **Jangan close** DevTools selama test

---

### Step 2: Simple Test Recording

**Settings:**
1. Upload audio **pendek** (~10-30 detik)
2. **JANGAN aktifkan efek apapun** dulu
3. Use visualization **Bars** (paling simple)
4. Click **Export to MP4**
5. Pilih **720p** + **16:9**
6. Click **Start Recording**

**Watch Console - Harus Muncul:**

```
✅ Marks to look for:

🎵 Resetting audio to beginning...
▶️ Starting audio playback...
✅ Audio playing successfully
✅ Audio ready for recording. Duration: 30.5

🎬 Initializing composite canvas recorder...
✅ Composite canvas started
✅ Warmup complete                    ← CRITICAL!
📹 Canvas stream created @ 20 FPS

✅ Audio stream split from source node (perfect sync)  ← CRITICAL!
✅ Browser mendukung MP4 native: video/mp4;codecs=h264,aac
✅ MediaRecorder created: video/mp4;codecs=h264,aac @ 1.5 Mbps

🎥 Recording started with ALL effects!
📊 MediaRecorder state: recording     ← Must be "recording"
📊 Video tracks: 1                    ← Must be 1
📊 Audio tracks: 1                    ← Must be 1

📦 Chunk #1: 245.67 KB               ← Chunks arriving!
📦 Chunk #2: 238.12 KB
🎞️ Frame 60 rendered
📦 Chunk #3: 242.89 KB
⏱️ Recording... State: recording, Chunks so far: 3  ← Every 5 sec
📦 Chunk #4: 241.23 KB
🎞️ Frame 120 rendered
📦 Chunk #5: 239.45 KB

🎬 Audio ended, stopping recording...
📊 Final state: inactive

🛑 Recording stopped, processing...
📦 Total chunks collected: 5          ← Must be > 0!
📊 Total recorded: 1.23 MB            ← Must be > 0!
✅ Audio destination disconnected
✅ Composite recorder cleaned up

📥 Downloading native MP4 file directly
💾 Creating download link...
📥 Downloading: audiovisualizer-2025-11-08.mp4 (1.23 MB)
✅ Download triggered successfully!

[Browser should show download]
```

---

### Step 3: Identify Where It Fails

Copy ALL console logs dan identify which message is **MISSING**:

#### Scenario A: No Chunks Received

```
✅ Recording started...
📊 MediaRecorder state: recording
(NO 📦 Chunk messages appear!)    ← PROBLEM HERE!
```

**Diagnosis:** MediaRecorder not capturing data  
**Fix:** See "Fix A" below

#### Scenario B: onstop Not Triggered

```
✅ Recording started...
📦 Chunk #1: 245 KB
📦 Chunk #2: 238 KB
🎬 Audio ended, stopping recording...
📊 Final state: inactive
(NO 🛑 Recording stopped message!) ← PROBLEM HERE!
```

**Diagnosis:** onstop callback not firing  
**Fix:** See "Fix B" below

#### Scenario C: Zero Blob Size

```
🛑 Recording stopped, processing...
📦 Total chunks collected: 3
📊 Total recorded: 0.00 MB          ← SIZE IS ZERO!
❌ Blob size is 0! Recording failed.
```

**Diagnosis:** Chunks collected but blob empty  
**Fix:** See "Fix C" below

#### Scenario D: Download Link Not Working

```
✅ Download triggered successfully!
(NO browser download shown)         ← PROBLEM HERE!
```

**Diagnosis:** Browser blocking download  
**Fix:** See "Fix D" below

---

## Fixes

### Fix A: No Chunks Received

**Problem:** MediaRecorder starts but never receives data

**Possible Causes:**
1. Video/audio track not available
2. Browser security policy
3. Composite canvas not rendering

**Solution:**
```typescript
// Check in console (paste this):
const recorder = mediaRecorderRef.current;
console.log('Recorder:', recorder);
console.log('State:', recorder?.state);
console.log('Stream:', recorder?.stream);
console.log('Video tracks:', recorder?.stream.getVideoTracks());
console.log('Audio tracks:', recorder?.stream.getAudioTracks());

// If tracks are empty, composite canvas failed
```

**Action:**
1. Disable ALL effects
2. Use simple visualization (Bars)
3. Try again
4. If still fails, report console logs

### Fix B: onstop Not Triggered

**Problem:** Recording stops but callback doesn't fire

**Possible Causes:**
1. mediaRecorder already disposed
2. Error in stop() call
3. Browser bug

**Solution:**
```typescript
// Manually trigger stop dan check:
if (mediaRecorderRef.current) {
  console.log('Manual stop initiated');
  console.log('State before stop:', mediaRecorderRef.current.state);
  mediaRecorderRef.current.stop();
  
  // Wait 2 seconds
  setTimeout(() => {
    console.log('State after stop:', mediaRecorderRef.current?.state);
    console.log('Did onstop fire? Check for "🛑 Recording stopped" above');
  }, 2000);
}
```

**Action:**
1. Restart browser
2. Try recording lagi dengan 10 detik audio
3. Manually click stop button
4. Check if onstop fires

### Fix C: Zero Blob Size

**Problem:** Chunks collected but Blob size = 0

**Possible Causes:**
1. Chunks contain empty data
2. Mismatch mime type
3. Codec not supported

**Solution:**
```typescript
// Check chunk contents (paste in console while recording):
const testChunk = chunks[0];
console.log('First chunk:', testChunk);
console.log('Size:', testChunk?.size);
console.log('Type:', testChunk?.type);

// Should show:
// Size: 250000+ (>200 KB)
// Type: video/mp4 or video/webm
```

**Action:**
1. Try WebM format instead of MP4
2. Use lower resolution (720p)
3. Disable efek completely

### Fix D: Download Link Not Working

**Problem:** File ready but browser doesn't download

**Possible Causes:**
1. Browser popup blocker
2. Download permission denied
3. Filename invalid characters

**Solution:**
```typescript
// Check browser download settings:
1. chrome://settings/downloads
2. Ensure "Ask where to save each file" is OFF
3. Check if popup blocked (icon in address bar)
4. Try different filename (simple ASCII only)
```

**Action:**
1. Check browser downloads page (Ctrl+J)
2. Look for blocked downloads
3. Allow downloads from localhost
4. Try again

---

## Testing Workflow

### Test 1: Minimal Setup

```bash
bun run dev
```

**Configuration:**
- Audio: 10-15 detik (SANGAT PENDEK!)
- Visualization: **Bars** (simplest)
- Effects: **NONE** (disable semua!)
- Resolution: **720p**
- Browser: **Chrome** (WAJIB!)
- DevTools: **OPEN** (F12)

**Execute:**
1. Upload audio 10 detik
2. Start recording
3. **Wait 10 detik** sampai audio selesai
4. **WATCH CONSOLE** - copy ALL logs
5. Check Downloads folder (Ctrl+J)

**Expected Console Log:**
```
🎵 Resetting audio...
✅ Audio ready. Duration: 10.2
🎬 Initializing composite canvas...
✅ Composite canvas started
✅ Warmup complete
📹 Canvas stream created @ 20 FPS
✅ Audio stream split from source node
✅ MediaRecorder created: video/mp4 @ 1.5 Mbps
🎥 Recording started!
📊 MediaRecorder state: recording
📊 Video tracks: 1
📊 Audio tracks: 1
📦 Chunk #1: 245 KB
📦 Chunk #2: 238 KB
⏱️ Recording... State: recording, Chunks so far: 2
📦 Chunk #3: 242 KB
🎬 Audio ended, stopping recording...
📊 Final state: inactive
🛑 Recording stopped, processing...
📦 Total chunks collected: 3
📊 Total recorded: 0.72 MB
✅ Audio destination disconnected
✅ Composite recorder cleaned up
📥 Downloading native MP4 file directly
💾 Creating download link...
📥 Downloading: audiovisualizer-2025-11-08.mp4 (0.72 MB)
✅ Download triggered successfully!
```

**Then:**
- ✅ Alert popup: "Video berhasil di-export!"
- ✅ File muncul di Downloads folder
- ✅ File size ~0.7 MB
- ✅ Play di VLC → smooth 10 detik

---

### Test 2: If Test 1 Success

**Add complexity gradually:**

1. Same settings tapi **enable 1 efek** (Floating Particles)
2. Test lagi, check console
3. If success, **add 2nd efek** (Flash Effects)
4. Test lagi
5. Continue adding efek one by one

**Stop adding if:**
- ❌ Chunks stop coming
- ❌ onstop not fired
- ❌ File not downloaded
- ❌ Video corrupt

**Report which efek caused issue!**

---

## Common Issues & What Console Shows

### Issue 1: AudioContext Suspended

```
❌ Audio context state: suspended
```

**Fix:**
```typescript
// In console:
audioContext.resume();
```

### Issue 2: No Video Track

```
📊 Video tracks: 0  ← SHOULD BE 1!
```

**Diagnosis:** Composite canvas failed  
**Fix:**
- Restart browser
- Clear cache (Ctrl+Shift+Del)
- Try again

### Issue 3: MediaRecorder State "inactive"

```
📊 MediaRecorder state: inactive  ← SHOULD BE "recording"!
```

**Diagnosis:** start() failed silently  
**Fix:**
- Check if mimeType supported
- Try different codec
- Use WebM instead of MP4

### Issue 4: Chunks but No Download

```
📦 Total chunks collected: 5
📊 Total recorded: 1.23 MB
✅ Composite recorder cleaned up
(STOPS HERE - no download messages!)
```

**Diagnosis:** Error in download code  
**Fix:** Check browser console for red errors

---

## What to Report

**Please copy dan send ke saya:**

### 1. Complete Console Log

```
From:
🎵 Resetting audio...

To:
✅ Download triggered (or where it stops)
```

### 2. Browser Info

```
Browser: Chrome/Edge/Firefox?
Version: (chrome://version)
OS: Windows 10/11?
```

### 3. Settings Used

```
Audio duration: X detik
Visualization: ?
Effects enabled: List all
Resolution: 720p/1080p?
```

### 4. What Happened

```
- Recording started? (YES/NO)
- Chunks received? (YES/NO - how many?)
- onstop fired? (YES/NO - saw "🛑 Recording stopped"?)
- Download triggered? (YES/NO - saw "📥 Downloading"?)
- Alert popup? (YES/NO - saw success message?)
- File in Downloads? (YES/NO - check Ctrl+J)
```

### 5. Screenshot

- Screenshot console logs
- Screenshot Downloads page (Ctrl+J)

---

## Quick Checklist Before Recording

- [ ] Browser: Chrome (NOT Firefox, NOT Safari)
- [ ] DevTools Open (F12)
- [ ] Console tab visible
- [ ] Audio file uploaded dan playing
- [ ] Network stable (not on VPN)
- [ ] Disk space available (>500 MB free)
- [ ] No browser extensions interfering (try Incognito mode)
- [ ] Downloads folder accessible
- [ ] No antivirus blocking (pause temporarily)

---

## Alternative: Manual Download Trigger

Jika automated download gagal, coba manual trigger:

```javascript
// 1. After recording stops, paste in console:
const blob = new Blob(chunks, { type: 'video/mp4' });
console.log('Blob size:', blob.size);

// 2. Create URL:
const url = URL.createObjectURL(blob);
console.log('URL:', url);

// 3. Open in new tab:
window.open(url, '_blank');

// 4. Right-click video → Save As
```

---

## Expected Behavior

### Normal Flow:

```
User clicks "Export"
    ↓
Modal opens
    ↓
User configures settings
    ↓
User clicks "Start Recording"
    ↓
Audio resets to 0:00 and plays
    ↓
Composite canvas starts
    ↓
MediaRecorder starts
    ↓
Chunks arrive every 500ms
    ↓
Audio ends
    ↓
MediaRecorder stops
    ↓
onstop callback fires
    ↓
Blob created from chunks
    ↓
Download link created
    ↓
a.click() triggered
    ↓
Browser downloads file
    ↓
Alert shows success message
    ↓
✅ File in Downloads folder!
```

### Where It Can Fail:

```
1. ❌ Audio doesn't play → No recording starts
2. ❌ Composite canvas fails → No video track
3. ❌ MediaRecorder doesn't start → No chunks
4. ❌ Chunks not received → Empty blob
5. ❌ onstop doesn't fire → Stuck "recording"
6. ❌ Blob size = 0 → No file
7. ❌ Download blocked → File ready but not saved
8. ❌ Filename invalid → Download fails
```

---

## Emergency: Fallback Method

Jika masih gagal setelah semua troubleshooting, gunakan Screen Recording:

### Windows 11:
```
1. Win + G (Xbox Game Bar)
2. Click "Capture" → "Start Recording"
3. Play audio di visualizer
4. Win + Alt + R untuk stop
5. Video saved to: Videos\Captures\
```

### External Tool:
```
1. Download OBS Studio (free)
2. Add "Display Capture" source
3. Add "Audio Output Capture"
4. Record browser window
5. High quality output
```

**Note:** Ini adalah LAST RESORT jika internal export benar-benar tidak work.

---

## Comprehensive Test Log Template

Copy ini dan fill in saat test:

```
=== VIDEO EXPORT TEST LOG ===
Date: 2025-11-08
Browser: Chrome / Edge / Firefox (circle one)
Version: _______

Audio Duration: _____ seconds
Visualization: _______
Effects Enabled: (list)
Resolution: 720p / 1080p

=== CONSOLE LOGS ===
(paste ALL logs from 🎵 to ✅ or where it stops)

=== RESULTS ===
Recording Started? YES / NO
Chunks Received? YES (___) / NO
onstop Fired? YES / NO
Download Triggered? YES / NO
Alert Shown? YES / NO
File Downloaded? YES / NO
File Size: _____ MB
Video Playable? YES / NO / N/A

=== ISSUES ===
(describe what went wrong)

=== SCREENSHOTS ===
- Console logs
- Downloads page (Ctrl+J)
- Any error messages
```

---

## Next Steps

1. **Test with Step 1 & 2** (simple test, 10 second audio, no effects)
2. **Copy console logs** - ALL of them!
3. **Check Downloads folder** (Ctrl+J di Chrome)
4. **Report back with:**
   - Console logs
   - What happened
   - At which step it failed
   - Screenshots if possible

Dengan informasi ini saya bisa diagnose exact issue dan berikan fix yang tepat!

---

**IMPORTANT:** 
- Gunakan **Chrome** (bukan Firefox/Safari)
- **DevTools HARUS terbuka** (F12)
- **Audio pendek** (10-30 detik)
- **NO EFFECTS** untuk first test
- **Copy ALL console logs**

Setelah test, report hasilnya ke saya! 🔍

