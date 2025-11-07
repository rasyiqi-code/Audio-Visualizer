# 🔒 PERINGATAN KEAMANAN - API KEY

## ⚠️ API KEY EXPOSED

API key Anda (`AIzaSyAnnLlHgijm7D1c0wnbZVSL00N4j2-uGHE`) telah di-share di chat/log.

**WAJIB dilakukan SEGERA:**

---

## 🚨 Action Required: Regenerate API Key

### Step 1: Revoke Old Key

1. **Buka Google AI Studio:**
   ```
   https://aistudio.google.com/apikey
   ```

2. **Find your API key** (`AIzaSyAnnLlHgijm7D1c0wnbZVSL00N4j2-uGHE`)

3. **Delete/Revoke** the key

### Step 2: Generate New Key

1. Click **"Create API Key"**
2. Copy new key
3. **JANGAN share di chat/public lagi!**

### Step 3: Update Everywhere

**Local (.env):**
```powershell
cd G:\Audio-Visualizer
# Edit .env file manually, ganti dengan key baru
```

**Vercel:**
```powershell
# Delete old env
vercel env rm GEMINI_API_KEY production

# Add new key
vercel env add GEMINI_API_KEY production
# Paste NEW key (jangan share lagi!)

# Redeploy
vercel --prod
```

**Desktop App:**
Users perlu update `.env` mereka sendiri.

---

## 🛡️ Best Practices

### ❌ JANGAN:
- Share API keys di chat, Discord, Slack
- Commit API keys ke Git (`.env` harus di gitignore)
- Screenshot yang include API keys
- Share `.env` file

### ✅ LAKUKAN:
- Simpan API keys di environment variables
- Use secret managers (Vercel Env, AWS Secrets, etc)
- Rotate keys secara berkala
- Monitor API usage di dashboard

---

## 🔍 Check if Key Compromised

1. **Google AI Studio Dashboard:**
   - Check API usage
   - Look for unusual requests
   - Check quota usage

2. **Set Restrictions:**
   - Website restrictions (only your domain)
   - API restrictions (only Gemini API)
   - Quota limits

---

## 📝 Immediate Action Checklist

- [ ] Revoke exposed API key di Google AI Studio
- [ ] Generate new API key
- [ ] Update local `.env`
- [ ] Update Vercel env: `vercel env rm` → `vercel env add`
- [ ] Redeploy: `vercel --prod`
- [ ] Monitor API usage
- [ ] Set API restrictions
- [ ] Never share keys again

---

## 🔗 Links

- **Google AI Studio**: https://aistudio.google.com/apikey
- **Vercel Dashboard**: https://vercel.com/crediblemarks/audio-visualizer-pro/settings/environment-variables
- **API Security Best Practices**: https://cloud.google.com/docs/authentication/api-keys

---

**Lakukan ini SEGERA setelah deployment selesai!** 🔒

