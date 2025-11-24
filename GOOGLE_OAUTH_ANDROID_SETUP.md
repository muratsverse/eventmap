# Google OAuth Android Kurulum Rehberi

## 1️⃣ Supabase SQL - RLS'i Devre Dışı Bırak

1. Supabase Dashboard'a git: https://supabase.com/dashboard
2. Sol menüden **SQL Editor** seç
3. `disable-profiles-rls-final.sql` dosyasındaki SQL'i kopyala yapıştır
4. **RUN** butonuna bas
5. Sonuçta `rowsecurity: false` görmelisin

---

## 2️⃣ Google Cloud Console - OAuth Client ID Oluştur

### A. Google Cloud Console'a Git
https://console.cloud.google.com

### B. Yeni Proje Oluştur (veya mevcut projeyi seç)
1. Üst menüden proje seç/oluştur
2. Proje adı: **EventMap**

### C. OAuth Consent Screen Yapılandır
1. Sol menü → **APIs & Services** → **OAuth consent screen**
2. User Type: **External** seç → **CREATE**
3. Bilgileri doldur:
   - App name: `EventMap`
   - User support email: Kendi emailin
   - Developer contact: Kendi emailin
4. **SAVE AND CONTINUE**
5. Scopes → **SAVE AND CONTINUE** (default scopes yeterli)
6. Test users → **SAVE AND CONTINUE**
7. **BACK TO DASHBOARD**

### D. OAuth Client ID Oluştur
1. Sol menü → **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**

#### Web Application (Supabase için)
- Application type: **Web application**
- Name: `EventMap Web`
- Authorized redirect URIs → **+ ADD URI**:
  ```
  https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
  ```
- **CREATE**
- **Client ID** ve **Client Secret**'i kopyala (sonra kullanacağız)

#### Android Application (Mobil için)
- **+ CREATE CREDENTIALS** → **OAuth client ID** (tekrar)
- Application type: **Android**
- Name: `EventMap Android`
- Package name: `com.eventmap.app`
- SHA-1 certificate fingerprint almak için:

**Debug SHA-1 (test için):**
```bash
cd android
gradlew signingReport
```
Çıktıda `SHA1` satırını bul ve kopyala (örnek: `A1:B2:C3...`)

**Release SHA-1 (üretim için - şimdilik skip et):**
Keystore oluşturduğunda alacaksın

- **CREATE**
- **Client ID**'yi kopyala

---

## 3️⃣ Supabase - Google Provider Yapılandır

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** provider'ı bul
3. **Enabled** toggle'ını aç
4. Google Cloud Console'dan aldığın bilgileri gir:
   - **Client ID (Web)**: Web application client ID
   - **Client Secret**: Web application client secret
5. **Authorized Client IDs** (mobil için):
   ```
   <ANDROID_CLIENT_ID_BURAYA>
   ```
   Android OAuth client ID'yi buraya ekle
6. **Save**

---

## 4️⃣ Redirect URL'leri Kontrol Et

Supabase Dashboard → **Authentication** → **URL Configuration**:

**Redirect URLs** listesine ekle:
```
eventmap://auth/callback
```

---

## 5️⃣ Android Studio'da Test Et

1. Uygulamayı yeniden derle:
```bash
npm run android:sync
```

2. Android Studio'da Run ▶

3. **Google ile Giriş Yap** butonuna bas

4. Google hesap seçimi açılmalı

---

## ⚠️ Olası Hatalar ve Çözümler

### "Google Sign In Error: 10"
- SHA-1 fingerprint yanlış veya eksik
- `gradlew signingReport` ile doğru SHA-1'i al

### "redirect_uri_mismatch"
- Supabase callback URL'i Google Cloud Console'a eklenmemiş
- Yukarıdaki adım 2D'yi kontrol et

### "Invalid client"
- Supabase'deki Client ID/Secret yanlış
- Google Cloud Console'dan kopyala yapıştır yap

---

## 📝 Özet Checklist

- [ ] SQL çalıştırıldı (RLS disabled)
- [ ] Google Cloud Console'da proje oluşturuldu
- [ ] OAuth Consent Screen yapılandırıldı
- [ ] Web OAuth client ID oluşturuldu
- [ ] Android OAuth client ID oluşturuldu (SHA-1 ile)
- [ ] Supabase'de Google provider enabled
- [ ] Client ID ve Secret Supabase'e eklendi
- [ ] Android Client ID "Authorized Client IDs"a eklendi
- [ ] Redirect URLs eklendi (`eventmap://auth/callback`)
- [ ] App yeniden build edildi ve test edildi
