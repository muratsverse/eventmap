# 🚀 Hızlı Başlangıç - OAuth Test

## ⚡ 3 Dakikada Test Et

### 1️⃣ Supabase Ayarları (1 dakika)

1. Tarayıcıda aç:
   ```
   https://app.supabase.com/project/zktzpwuuqdsfdrdljtoy/auth/url-configuration
   ```

2. **Redirect URLs** kısmına ekle:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5174/auth/callback
   eventmap://auth/callback
   ```

3. **Save** butonuna bas

✅ Bitti! Supabase hazır.

---

### 2️⃣ Web Test (1 dakika)

```bash
# Terminal aç
npm run dev
```

Tarayıcıda:
- http://localhost:5173 aç
- "Gmail ile Giriş Yap" tıkla
- Google hesabını seç
- ✅ Localhost'ta kalmalı (Vercel'e gitmemeli)
- ✅ Profil sayfasında giriş yapılmış görünmeli

**Console'da görmeli:**
```
🔐 Google Sign-In başlatılıyor
🔗 Redirect URL: http://localhost:5173/auth/callback
✅ Session doğrulandı
```

---

### 3️⃣ Android Test (1 dakika)

#### Hızlı Yol (Otomatik Script)
```bash
oauth-test.bat
```
Menüden: **[3] Android Build ve Sync**

#### Manuel Yol
```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio'da:
- ▶️ Run butonuna bas
- "Gmail ile Giriş Yap" dene
- ✅ Crash olmamalı
- ✅ Giriş başarılı olmalı

---

## 🐛 Hata Varsa

### Web'de Vercel'e gidiyorsa:
```
1. Ctrl+Shift+Delete (Cache temizle)
2. Ctrl+F5 (Hard refresh)
3. Incognito modda dene
```

### Android'de crash oluyorsa:
```bash
# Logcat aç
adb logcat -s Capacitor:V

# Deep link test et
adb shell am start -a android.intent.action.VIEW -d "eventmap://auth/callback"
```

### Session kayboluyorsa:
```javascript
// Console'da kontrol et
localStorage.getItem('supabase.auth.token')
```

---

## 📱 Release APK İçin

```bash
oauth-test.bat
# Menüden [4] Release APK/AAB Oluştur
```

Dosya: `android/app/build/outputs/bundle/release/app-release.aab`

---

## ✅ Başarı Kriterleri

- [ ] Localhost'ta Gmail girişi çalışıyor
- [ ] Vercel'e gitmiyor
- [ ] Android'de crash yok
- [ ] Session kalıcı
- [ ] Console'da error yok

---

**Sorun mu var?** Detaylı rehber: `OAUTH_FIX_SUMMARY.md`
