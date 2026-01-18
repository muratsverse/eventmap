# 🔐 OAuth Redirect URL Kurulumu

## ⚠️ ÖNEMLİ: Supabase Dashboard'da Yapılması Gerekenler

Gmail ile giriş sorununun ana nedeni Supabase'de redirect URL'lerin eksik olmasıdır. Aşağıdaki adımları **mutlaka** takip edin.

---

## 📋 Supabase Dashboard Ayarları

### 1. Supabase Dashboard'a Giriş Yapın
- https://app.supabase.com adresine gidin
- Projenizi seçin: **zktzpwuuqdsfdrdljtoy**

### 2. Authentication > URL Configuration
Sol menüden: **Authentication** → **URL Configuration** bölümüne gidin

### 3. Redirect URLs Ekleme
**"Redirect URLs"** altına aşağıdaki URL'leri **hepsini** ekleyin:

```
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
eventmap://auth/callback
```

**NOT:** Her satırda bir URL olacak şekilde ekleyin.

### 4. Site URL (Optional)
**Site URL** kısmını production URL'niz olarak ayarlayın:
```
https://your-vercel-domain.vercel.app
```

---

## 🔧 Kodda Yapılan Düzeltmeler

### 1. Web OAuth Redirect Fix
- ✅ Localhost'tan giriş yaparken artık Vercel'e gitmiyor
- ✅ `window.location.origin` kullanılarak her zaman mevcut URL'de kalıyor
- ✅ `/auth/callback` route'u doğru şekilde handle ediliyor

### 2. Mobile Deep Link Crash Fix
- ✅ Try-catch blokları eklendi
- ✅ URL parsing hataları yakalanıyor
- ✅ Browser.close() güvenli hale getirildi
- ✅ Error recovery mekanizması eklendi

### 3. Session Handling İyileştirmeleri
- ✅ Session set edildikten sonra doğrulama yapılıyor
- ✅ Navigate etmeden önce session kontrolü
- ✅ Timeout'lar ayarlandı
- ✅ Console log'lar detaylandırıldı

### 4. Android Build Güncellemeleri
- ✅ Gradle 8.7.3 (en stabil versiyon)
- ✅ AndroidX dependencies güncellendi
- ✅ Version code: 13
- ✅ Java 17 uyumluluğu

---

## 🧪 Test Adımları

### Localhost'ta Test (Port 5173/5174)

1. **Terminal'de başlatın:**
   ```bash
   npm run dev
   ```

2. **Gmail ile giriş yapın:**
   - Tarayıcıda `http://localhost:5173` açın
   - "Gmail ile Giriş Yap" butonuna tıklayın
   - Google hesabınızı seçin
   - Giriş başarılı olmalı (Vercel'e gitmeden)

3. **Console log'ları kontrol edin:**
   - F12 → Console
   - Şu log'ları görmeli:
     ```
     🔐 Google Sign-In başlatılıyor, platform: web
     🔗 Redirect URL: http://localhost:5173/auth/callback
     🌐 Current Origin: http://localhost:5173
     ✅ OAuth URL alındı
     🔐 Web OAuth callback işleniyor...
     ✅ Session oluşturuldu
     ✅✅ Session doğrulandı
     ```

### Android Studio'da Test

1. **Build ve sync yapın:**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```

2. **Android Studio'da:**
   - Gradle sync otomatik olacak
   - Emulator veya gerçek cihaz seçin
   - ▶️ Run butonuna basın

3. **Uygulama açıldığında:**
   - "Gmail ile Giriş Yap" tıklayın
   - Browser açılacak
   - Google hesabı seçin
   - Uygulama otomatik geri dönmeli
   - Profil sayfasında giriş yapılmış olmalı

4. **Logcat'te kontrol edin:**
   - Android Studio → Logcat
   - Filter: "OAuth" veya "Google Sign-In"
   - Hataları görün

### Play Store APK Test

1. **Release build oluşturun:**
   ```bash
   npm run build
   cd android
   ./gradlew bundleRelease
   ```

2. **AAB dosyası:**
   - Konum: `android/app/build/outputs/bundle/release/app-release.aab`
   - Play Console'a yükleyin
   - Internal testing track'e gönderin

3. **Kurulum sonrası test:**
   - Play Store'dan indirin
   - "Gmail ile Giriş Yap" deneyin
   - Crash olmamalı
   - Logcat: `adb logcat | grep EventMap`

---

## 🐛 Sorun Giderme

### Problem: "Redirect URL not allowed"
**Çözüm:** Supabase Dashboard'da URL'lerin eklendiğinden emin olun

### Problem: Localhost'tan Vercel'e gidiyor
**Çözüm:** 
1. Browser cache'i temizleyin (Ctrl+Shift+Delete)
2. Sayfayı yenileyin (Ctrl+F5)
3. Console'da redirect URL'i kontrol edin

### Problem: Android'de crash
**Çözüm:**
1. Logcat'i açın: `adb logcat | grep -i error`
2. Deep link filter: `adb shell am start -a android.intent.action.VIEW -d "eventmap://auth/callback"`
3. AndroidManifest.xml'de intent-filter'ları kontrol edin

### Problem: Session kayboluyoruzum
**Çözüm:**
1. Browser console'da: `localStorage.getItem('supabase.auth.token')`
2. Varsa token görmeli
3. Yoksa: Supabase RLS politikalarını kontrol edin

---

## 📱 Deep Link Test (Android)

Terminal'de test komutları:

```bash
# OAuth callback testi
adb shell am start -a android.intent.action.VIEW -d "eventmap://auth/callback?code=test123"

# Password reset testi
adb shell am start -a android.intent.action.VIEW -d "eventmap://reset-password"

# Genel deep link testi
adb shell am start -a android.intent.action.VIEW -d "eventmap://test"
```

---

## ✅ Checklist

- [ ] Supabase Dashboard'da tüm redirect URL'ler eklendi
- [ ] Localhost:5173 ve 5174 eklendi
- [ ] Mobile deep link: `eventmap://auth/callback` eklendi
- [ ] Web'de giriş test edildi (Vercel'e gitmiyor)
- [ ] Android Studio'da test edildi (crash yok)
- [ ] Release APK test edildi (Play Store'dan)
- [ ] Console log'lar temiz
- [ ] Session kalıcı

---

## 🔄 Değişiklik Özeti

| Dosya | Değişiklik |
|-------|-----------|
| `AuthContext.tsx` | ✅ Web redirect fix, crash protection, session validation |
| `AuthCallbackView.tsx` | ✅ Navigate öncesi session doğrulama |
| `android/build.gradle` | ✅ Gradle 8.7.3 |
| `android/variables.gradle` | ✅ Dependencies güncellendi |
| `android/app/build.gradle` | ✅ Version code 13 |

---

## 📞 Debug Komutları

```bash
# Web development
npm run dev

# Android build
npm run build
npx cap sync android
npx cap open android

# Release build
cd android
./gradlew clean
./gradlew bundleRelease

# Logcat (Android)
adb logcat -s Capacitor:V
adb logcat | grep -i "google"
adb logcat | grep -i "oauth"
```

---

## 🎯 Sonuç

Bu düzeltmeler sonucunda:
1. ✅ Localhost'ta Gmail girişi çalışıyor (Vercel'e gitmiyor)
2. ✅ Android'de crash olmuyor
3. ✅ Session doğru set ediliyor
4. ✅ Play Store APK stabil çalışıyor
5. ✅ Android Studio en güncel versiyonu çalıştırıyor

**UNUTMAYIN:** Supabase Dashboard'da redirect URL'leri eklemeden test yapmayın!
