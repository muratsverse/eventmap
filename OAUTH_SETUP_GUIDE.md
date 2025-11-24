# 🔐 OAuth & Şifre Sıfırlama Kurulum Rehberi

Bu rehber, EventMap uygulamasına Google, Facebook, Apple ve Twitter ile giriş özelliklerini ve şifre sıfırlama sistemini eklemeniz için adım adım talimatlar içerir.

---

## 📋 İçindekiler

1. [Email Confirmation'ı Kapatma](#1-email-confirmationı-kapatma)
2. [Google OAuth Kurulumu](#2-google-oauth-kurulumu)
3. [Facebook OAuth Kurulumu](#3-facebook-oauth-kurulumu)
4. [Apple OAuth Kurulumu](#4-apple-oauth-kurulumu)
5. [Twitter OAuth Kurulumu](#5-twitter-oauth-kurulumu)
6. [Şifre Sıfırlama Testi](#6-şifre-sıfırlama-testi)
7. [Sorun Giderme](#7-sorun-giderme)

---

## 1. Email Confirmation'ı Kapatma

### Neden Gerekli?
- Kullanıcılar email onayı beklemeden giriş yapabilsin
- Şifre sıfırlama email'leri çalışsın
- OAuth girişler sorunsuz çalışsın

### Adımlar

1. **Supabase Dashboard'a** gidin
2. Sol menüden **Authentication** seçeneğine tıklayın
3. **Settings** tab'ına tıklayın (üst menüde)
4. **"Enable email confirmations"** ayarını **KAPATIN** (toggle off)
5. **"Save"** butonuna tıklayın

✅ Şimdi kullanıcılar email onayı olmadan giriş yapabilir!

---

## 2. Google OAuth Kurulumu

### Adım 2.1: Google Cloud Console'da Proje Oluştur

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. **Create Project** butonuna tıklayın
3. Proje adı: `EventMap` (veya istediğiniz bir isim)
4. **Create** butonuna tıklayın

### Adım 2.2: OAuth Consent Screen Yapılandırması

1. Sol menüden **APIs & Services** → **OAuth consent screen** seçin
2. **External** seçeneğini seçin
3. **Create** butonuna tıklayın
4. Formu doldurun:
   - **App name**: EventMap
   - **User support email**: Kendi emailiniz
   - **Developer contact**: Kendi emailiniz
5. **Save and Continue** → **Save and Continue** → **Save and Continue**

### Adım 2.3: OAuth 2.0 Client ID Oluştur

1. Sol menüden **Credentials** seçin
2. **Create Credentials** → **OAuth client ID** seçin
3. **Application type**: Web application
4. **Name**: EventMap Web Client
5. **Authorized redirect URIs** ekleyin:
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
   ```
6. **Create** butonuna tıklayın
7. **Client ID** ve **Client Secret**'i kopyalayın

### Adım 2.4: Supabase'e Ekleyin

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** provider'ı bulun ve **Enable** edin
3. **Client ID** ve **Client Secret**'i yapıştırın
4. **Save** butonuna tıklayın

✅ Google ile giriş hazır!

---

## 3. Facebook OAuth Kurulumu

### Adım 3.1: Facebook Developer Hesabı Oluştur

1. [Facebook for Developers](https://developers.facebook.com/) adresine gidin
2. Sağ üstten **My Apps** → **Create App** tıklayın
3. **Use case**: Consumer → **Next**
4. **App name**: EventMap
5. **App contact email**: Kendi emailiniz
6. **Create App** butonuna tıklayın

### Adım 3.2: Facebook Login Ekleyin

1. Dashboard'da **Add Product** butonuna tıklayın
2. **Facebook Login** kartında **Set Up** butonuna tıklayın
3. **Web** platformunu seçin
4. **Site URL**: `http://localhost:5173` (şimdilik)
5. **Save** → **Continue**

### Adım 3.3: OAuth Redirect URI Ayarları

1. Sol menüden **Facebook Login** → **Settings** seçin
2. **Valid OAuth Redirect URIs** alanına ekleyin:
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
   ```
3. **Save Changes** butonuna tıklayın

### Adım 3.4: App ID ve Secret Alın

1. Sol menüden **Settings** → **Basic** seçin
2. **App ID** görünür olacak
3. **App Secret**'i görmek için **Show** butonuna tıklayın
4. İkisini de kopyalayın

### Adım 3.5: Supabase'e Ekleyin

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Facebook** provider'ı bulun ve **Enable** edin
3. **Client ID** (App ID) ve **Client Secret**'i yapıştırın
4. **Save** butonuna tıklayın

✅ Facebook ile giriş hazır!

---

## 4. Apple OAuth Kurulumu

### Ön Bilgi
Apple OAuth kurulumu daha karmaşık ve **Apple Developer Program** üyeliği gerektirir ($99/yıl).

### Adım 4.1: Apple Developer Console

1. [Apple Developer](https://developer.apple.com/) adresine gidin
2. **Certificates, Identifiers & Profiles** seçin
3. **Identifiers** → **+** (Add) butonuna tıklayın

### Adım 4.2: Service ID Oluştur

1. **Services IDs** seçin → **Continue**
2. **Description**: EventMap Sign In
3. **Identifier**: `com.eventmap.signin` (unique olmalı)
4. **Sign In with Apple** kutucuğunu işaretleyin
5. **Configure** butonuna tıklayın

### Adım 4.3: Domain ve Redirect URI

1. **Domains and Subdomains**: `zktzpwuuqdsfdrdljtoy.supabase.co`
2. **Return URLs**:
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
   ```
3. **Save** → **Continue** → **Register**

### Adım 4.4: Private Key Oluştur

1. **Keys** → **+** (Add) butonuna tıklayın
2. **Key Name**: EventMap Sign In Key
3. **Sign In with Apple** kutucuğunu işaretleyin
4. **Configure** → Service ID seçin → **Save**
5. **Continue** → **Register**
6. **Download** butonuna tıklayın (.p8 dosyası)
7. **Key ID**'yi not edin

### Adım 4.5: Supabase'e Ekleyin

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Apple** provider'ı bulun ve **Enable** edin
3. Bilgileri girin:
   - **Client ID**: Service ID (ör: com.eventmap.signin)
   - **Team ID**: Apple Developer hesabınızdan bulabilirsiniz
   - **Key ID**: Yukarıda not ettiğiniz
   - **Private Key**: .p8 dosyasının içeriği
4. **Save** butonuna tıklayın

✅ Apple ile giriş hazır!

---

## 5. Twitter OAuth Kurulumu

### Adım 5.1: Twitter Developer Hesabı

1. [Twitter Developer Portal](https://developer.twitter.com/) adresine gidin
2. **Sign Up** → Developer hesabı oluşturun
3. Kullanım amacını belirtin (hobbyist, professional, etc.)

### Adım 5.2: App Oluştur

1. Dashboard'da **Projects & Apps** → **Create App** tıklayın
2. **App name**: EventMap
3. **API Key** ve **API Secret Key**'i kopyalayın (bir daha gösterilmez!)

### Adım 5.3: OAuth 2.0 Ayarları

1. App ayarlarında **App Settings** seçin
2. **User authentication settings** → **Set up** tıklayın
3. **OAuth 2.0** kutucuğunu işaretleyin
4. **Type of App**: Web App
5. **Callback URI / Redirect URL**:
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
   ```
6. **Website URL**: `https://yourdomain.com` (şimdilik localhost ekleyebilirsiniz)
7. **Save** butonuna tıklayın

### Adım 5.4: Supabase'e Ekleyin

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Twitter** provider'ı bulun ve **Enable** edin
3. **API Key** ve **API Secret Key**'i yapıştırın
4. **Save** butonuna tıklayın

✅ Twitter ile giriş hazır!

---

## 6. Şifre Sıfırlama Testi

### Test Senaryosu

1. **Uygulamayı açın**: `http://localhost:5173`
2. **Profil** sekmesine gidin
3. **"Şifremi Unuttum"** linkine tıklayın
4. **Email adresinizi** girin
5. **"Sıfırlama Linki Gönder"** butonuna tıklayın
6. **Email kutunuzu** kontrol edin
7. Email'deki **linke tıklayın**
8. **Yeni şifrenizi** belirleyin
9. ✅ Yeni şifre ile giriş yapın!

### Email Şablonunu Özelleştirme

1. Supabase Dashboard → **Authentication** → **Email Templates**
2. **Reset password** template'ini seçin
3. Kendi tasarımınızı ekleyin
4. **Save** butonuna tıklayın

---

## 7. Sorun Giderme

### Google OAuth Çalışmıyor

**Sorun**: "redirect_uri_mismatch" hatası

**Çözüm**:
1. Google Cloud Console → Credentials
2. Redirect URI'nin **tam olarak** şu olduğundan emin olun:
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
   ```
3. Eğik çizgi (/) veya https:// eksik olmamalı
4. Değişiklikten sonra 5 dakika bekleyin (cache)

### Facebook OAuth Çalışmıyor

**Sorun**: "App not setup" hatası

**Çözüm**:
1. Facebook Developer Console → Settings → Basic
2. App'in **Live** modda olduğundan emin olun (Development değil)
3. **Valid OAuth Redirect URIs** doğru girilmiş olmalı
4. **Facebook Login** product'ı eklenmiş olmalı

### Apple OAuth Çalışmıyor

**Sorun**: "invalid_client" hatası

**Çözüm**:
1. Service ID'nin doğru olduğundan emin olun
2. Private Key (.p8) formatı doğru olmalı
3. Key ID ve Team ID eşleşmeli
4. Domain verification yapılmış olmalı

### Twitter OAuth Çalışmıyor

**Sorun**: "Unauthorized" hatası

**Çözüm**:
1. Twitter Developer Portal → App Settings
2. OAuth 2.0'ın **enabled** olduğundan emin olun
3. Callback URL doğru girilmiş olmalı
4. API Key ve Secret doğru kopyalanmış olmalı

### Şifre Sıfırlama Emaili Gelmiyor

**Sorun**: Email gelmiyor

**Çözüm**:
1. **Spam klasörünü** kontrol edin
2. Supabase Dashboard → Authentication → Settings
3. **SMTP settings** yapılandırılmış mı kontrol edin
4. Development'ta Supabase kendi SMTP'sini kullanır (limiti var)
5. Production için kendi SMTP'nizi ekleyin (Gmail, SendGrid, etc.)

### OAuth Butonu Tıklanınca Hiçbir Şey Olmuyor

**Sorun**: Console'da hata var mı?

**Çözüm**:
1. F12 → Console tab'ını açın
2. Kırmızı hataları kontrol edin
3. "Supabase yapılandırılmamış" hatası varsa `.env` dosyasını kontrol edin
4. Provider enabled değilse Supabase Dashboard'dan aktifleştirin

---

## 8. Production Hazırlık

### Redirect URI'leri Güncelle

Tüm OAuth provider'larda production domain'inizi ekleyin:

**Google, Facebook, Twitter, Apple:**
```
https://yourdomain.com
https://zktzpwuuqdsfdrdljtoy.supabase.co/auth/v1/callback
```

### SMTP Ayarları (Email için)

1. Supabase Dashboard → Project Settings → Auth
2. **SMTP Settings** bölümünü bulun
3. Kendi SMTP servisinizi ekleyin:
   - Gmail SMTP
   - SendGrid
   - AWS SES
   - Mailgun

Örnek (Gmail):
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: app-specific-password
```

### OAuth Consent Screen'i Production'a Al

**Google için:**
1. Google Cloud Console → OAuth consent screen
2. **Publishing status**: "In Production" yapın
3. Verification süreci gerekebilir (Google tarafından inceleme)

**Facebook için:**
1. Facebook Developer Console
2. **App Mode**: "Live" yapın
3. Privacy Policy ve Terms of Service URL'leri ekleyin

---

## 9. Güvenlik İpuçları

1. **API Keys ve Secrets**
   - Asla public repository'ye koymayın
   - `.env` dosyasını `.gitignore`'a ekleyin
   - Production'da environment variables kullanın

2. **CORS Ayarları**
   - Sadece bilinen domain'lere izin verin
   - Wildcard (*) kullanmayın production'da

3. **Rate Limiting**
   - OAuth isteklerini rate limit'e tabi tutun
   - Supabase'in kendi rate limitleri var

4. **Session Management**
   - Session timeout ayarlayın
   - Refresh token rotation kullanın

---

## 10. Test Checklist

Production'a geçmeden önce:

- [ ] Google OAuth test edildi
- [ ] Facebook OAuth test edildi
- [ ] Apple OAuth test edildi (varsa)
- [ ] Twitter OAuth test edildi
- [ ] Şifre sıfırlama test edildi
- [ ] Email confirmation kapalı
- [ ] Redirect URI'ler doğru
- [ ] Production domain'leri eklendi
- [ ] SMTP ayarları yapıldı
- [ ] Error handling test edildi

---

## 🎉 Tebrikler!

OAuth ve şifre sıfırlama sistemini başarıyla kurdunuz!

Kullanıcılar artık:
- ✅ Google ile giriş yapabilir
- ✅ Facebook ile giriş yapabilir
- ✅ Apple ile giriş yapabilir (kurduysanız)
- ✅ Twitter ile giriş yapabilir
- ✅ Şifrelerini sıfırlayabilir
- ✅ Email onayı beklemeden giriş yapabilir

---

## 📞 Destek

Sorun mu yaşıyorsunuz?

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [Apple Sign In Docs](https://developer.apple.com/sign-in-with-apple/)
- [Twitter OAuth Docs](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
