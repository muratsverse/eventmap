# 📱 iOS Build Rehberi - GitHub Actions ile

Bu rehber, EventMap uygulamasını Windows bilgisayardan iOS App Store'a yüklemek için gerekli **TÜM** adımları içerir.

## ✅ YAPILAN İŞLER (Otomatik)

- ✅ iOS platformu eklendi
- ✅ Capacitor yapılandırıldı
- ✅ GitHub Actions workflow oluşturuldu
- ✅ Fastlane yapılandırıldı
- ✅ .gitignore güncellendi

---

## 📋 SİZİN YAPMANIZ GEREKENLER

### 🔴 ADIM 1: Apple Developer Hesabı (Ön Gereksinim)

#### 1.1 Apple Developer Program'a Kayıt

1. [developer.apple.com](https://developer.apple.com) adresine gidin
2. **"Account"** → **"Join the Apple Developer Program"**
3. **99$ yıllık ödeme** yapın (Kredi kartı gerekli)
4. Onay **24-48 saat** sürebilir

**Dikkat:** Bu adım olmadan devam edemezsiniz!

---

### 🔴 ADIM 2: App ID ve Bundle Identifier

#### 2.1 App ID Oluşturma

1. [developer.apple.com/account](https://developer.apple.com/account) → **Certificates, IDs & Profiles**
2. Sol menüden **"Identifiers"** → **"+"** (Yeni ekle)
3. **"App IDs"** seçin → **Continue**
4. **"App"** seçin → **Continue**
5. Bilgileri doldurun:
   - **Description:** EventMap
   - **Bundle ID:** `com.eventmap.app` (Explicit seçin)
   - **Capabilities:** İhtiyaç duyduğunuz özellikleri seçin
6. **Register** → Tamamlandı!

---

### 🔴 ADIM 3: GitHub Repository Oluşturma

#### 3.1 GitHub'da Ana Proje Repo'su

1. [github.com/new](https://github.com/new) adresine gidin
2. **Repository name:** `eventmap` (veya istediğiniz isim)
3. **Private** seçin (önerilen)
4. **Create repository**

#### 3.2 GitHub'da Sertifika Repo'su Oluşturma

**ÖNEMLİ:** Fastlane Match, sertifikaları ayrı bir repo'da saklar.

1. [github.com/new](https://github.com/new) adresine tekrar gidin
2. **Repository name:** `eventmap-certificates`
3. **MUTLAKA Private** seçin (güvenlik!)
4. **Create repository**

#### 3.3 GitHub Personal Access Token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → **Generate new token (classic)**
3. **Note:** `EventMap iOS Build`
4. **Expiration:** `No expiration` (veya 1 yıl)
5. **Scopes:** `repo` (tüm alt seçenekler) seçin
6. **Generate token**
7. **Token'ı kopyalayın ve güvenli bir yere kaydedin!** (Bir daha göremezsiniz)

---

### 🔴 ADIM 4: App-Specific Password (Apple)

GitHub Actions'ın Apple'a erişmesi için özel şifre gerekiyor.

1. [appleid.apple.com](https://appleid.apple.com) adresine gidin
2. **Sign-in and Security** → **App-Specific Passwords**
3. **Generate an app-specific password**
4. **Label:** `GitHub Actions EventMap`
5. Şifreyi kopyalayın ve kaydedin!

---

### 🔴 ADIM 5: Projeyi GitHub'a Yükleme

Terminal/PowerShell'de (proje klasöründe):

```powershell
# Git init (henüz yapılmadıysa)
git init

# Dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit with iOS build setup"

# GitHub repo'nuzu ekleyin (KULLANICI_ADINIZ ve REPO_ADINIZ değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/eventmap.git

# Ana branch
git branch -M main

# Push
git push -u origin main
```

**Önemli:** `KULLANICI_ADINIZ` ve `eventmap` kısımlarını kendi bilgilerinizle değiştirin!

---

### 🔴 ADIM 6: GitHub Secrets Ekleme

GitHub repo'nuzda:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** butonuna tıklayın

Aşağıdaki 4 secret'ı ekleyin:

#### Secret 1: APPLE_ID
- **Name:** `APPLE_ID`
- **Value:** Apple Developer hesabınızın email'i (ör: `muratveozturk@hotmail.com`)

#### Secret 2: APPLE_PASSWORD
- **Name:** `APPLE_PASSWORD`
- **Value:** Adım 4'te oluşturduğunuz App-Specific Password

#### Secret 3: MATCH_PASSWORD
- **Name:** `MATCH_PASSWORD`
- **Value:** Güçlü bir şifre oluşturun (ör: `EventMap2025!Secure#Pass`)
- **Not:** Bu şifreyi unutmayın! Sertifikaları şifrelemek için kullanılacak.

#### Secret 4: GIT_AUTHORIZATION
- **Name:** `GIT_AUTHORIZATION`
- **Value:** Base64 encoded GitHub token

Base64 token oluşturma:

**PowerShell'de:**
```powershell
$token = "ghp_SIZIN_GITHUB_TOKENINIZ"  # Adım 3.3'teki token
$bytes = [System.Text.Encoding]::UTF8.GetBytes($token)
$encoded = [System.Convert]::ToBase64String($bytes)
Write-Output $encoded
```

Çıkan değeri kopyalayın ve `GIT_AUTHORIZATION` secret'ına yapıştırın.

---

### 🔴 ADIM 7: Fastlane Match Kurulumu

Bu adım **MAC'te** yapılmalı. Eğer Mac'iniz varsa:

#### 7.1 Mac'te Terminal Açın

```bash
# Projeyi Mac'e kopyalayın (USB, GitHub, vb.)

# Proje klasörüne gidin
cd /path/to/Eventmap

# Node bağımlılıklarını yükleyin
npm install

# Build alın
npm run build

# iOS'u sync edin
npx cap sync ios

# iOS App klasörüne gidin
cd ios/App

# Ruby gem'lerini yükleyin
bundle install

# Fastlane Match'i başlatın
bundle exec fastlane match init

# "git" seçin
# Repo URL: https://github.com/KULLANICI_ADINIZ/eventmap-certificates.git
```

#### 7.2 Sertifikaları Oluşturun

```bash
# Hala ios/App klasöründeyken

# Environment variable'ları set edin
export MATCH_PASSWORD="ADIM_6_DAKI_MATCH_PASSWORD"
export FASTLANE_USER="APPLE_EMAIL_ADRESINIZ"
export FASTLANE_PASSWORD="APP_SPECIFIC_PASSWORD"

# Sertifikaları oluşturun
bundle exec fastlane match appstore
```

Bu komut:
- Apple Developer Portal'a bağlanacak
- Distribution certificate oluşturacak
- Provisioning profile oluşturacak
- Bunları şifreyip `eventmap-certificates` repo'suna yükleyecek

**Önemli:** Apple hesabınıza ait 2FA kodu istenirse girin.

---

### 🔴 ADIM 8: Matchfile Güncelleme

[ios/App/fastlane/Matchfile](ios/App/fastlane/Matchfile) dosyasını açın:

**Değiştirin:**
```ruby
git_url("https://github.com/GITHUB_USERNAME/eventmap-certificates")
```

**Şununla:**
```ruby
git_url("https://github.com/KULLANICI_ADINIZ/eventmap-certificates")
```

`KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın!

**Commit ve push:**
```powershell
git add ios/App/fastlane/Matchfile
git commit -m "Update Matchfile with correct repo URL"
git push
```

---

### 🔴 ADIM 9: App Store Connect'te Uygulama Oluşturma

#### 9.1 Uygulamayı Kaydet

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) adresine gidin
2. **My Apps** → **+** → **New App**
3. Bilgileri doldurun:
   - **Platform:** iOS
   - **Name:** EventMap
   - **Primary Language:** Turkish
   - **Bundle ID:** `com.eventmap.app` (Adım 2'de oluşturduğunuz)
   - **SKU:** `eventmap` (benzersiz bir kod)
   - **User Access:** Full Access

#### 9.2 Temel Bilgileri Doldurun

**App Information:**
- **Category:** Entertainment veya Social Networking
- **Content Rights:** Sahip olduğunuzu onaylayın

**Pricing and Availability:**
- **Price:** Free (veya fiyat belirleyin)
- **Availability:** Tüm ülkeler

#### 9.3 App Privacy

- **Privacy Policy URL:** (Hazırlamanız gerekiyor - zorunlu!)
- Veri toplama politikanızı belirtin

#### 9.4 Screenshots Hazırlama

**Gerekli boyutlar:**
- **6.7" (iPhone 14 Pro Max):** 1290 x 2796 px
- **5.5" (iPhone 8 Plus):** 1242 x 2208 px

En az **3 farklı ekran** gerekli:
- Liste görünümü
- Harita görünümü
- Profil görünümü

**Nasıl hazırlanır:**
1. Simulatör veya telefonda uygulamayı açın
2. Screenshot alın (iPhone: Power + Volume Up)
3. Boyutlandırın (Photoshop, Figma, veya online araçlarla)

---

### 🔴 ADIM 10: İlk Build'i Tetikleme

Artık her şey hazır! Build başlatmak için:

#### Otomatik (Push ile):
```powershell
# Herhangi bir değişiklik yapın
git add .
git commit -m "Trigger iOS build"
git push
```

Push yaptığınızda GitHub Actions otomatik başlayacak.

#### Manuel (GitHub'dan):
1. GitHub repo → **Actions** sekmesi
2. **iOS Build** workflow'u seçin
3. **Run workflow** → **Run workflow**

---

## 🔍 Build Durumunu Takip Etme

### GitHub Actions'da

1. Repo → **Actions** sekmesi
2. En son workflow run'a tıklayın
3. Adımları canlı izleyin

**Beklenen süre:** 15-30 dakika

### Olası Hatalar ve Çözümleri

#### ❌ "No matching code signing identity found"
**Çözüm:** Adım 7'yi Mac'te yapın (sertifikalar oluşturulmamış).

#### ❌ "Could not find a valid Gemfile"
**Çözüm:** `ios/App/Gemfile` dosyasının GitHub'da olduğundan emin olun.

#### ❌ "Authentication failed"
**Çözüm:**
- `APPLE_PASSWORD` secret'ını kontrol edin (App-Specific Password olmalı)
- `APPLE_ID` secret'ını kontrol edin

#### ❌ "Match repo not found"
**Çözüm:** Adım 8'i yapın (Matchfile güncellemesi).

---

## 📱 TestFlight'ta Test

Build başarılı olduktan sonra (10-30 dakika sonra):

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **TestFlight**
2. Build'iniz görünecek
3. **Internal Testing** → Kendinizi test kullanıcısı olarak ekleyin
4. iPhone'unuzda **TestFlight** uygulamasını indirin
5. Davet kabul edin ve test edin!

---

## 🚀 App Store'a Gönderme

TestFlight'ta sorunsuz çalıştıktan sonra:

1. **App Store Connect** → App'iniz → **App Store** sekmesi
2. **+ Version or Platform** → **iOS**
3. **Version:** 1.0.0
4. **What's New in This Version:** Güncelleme notları (Türkçe)
5. Build seçin (TestFlight'tan)
6. **Add for Review**
7. **Submit for Review**

**Review süresi:** 1-7 gün (ortalama 24-48 saat)

---

## 📞 Yardım Gerekirse

**Sık Sorulan Sorular:**

**S: Mac'im yok, ne yapabilirim?**
C: Adım 7 için bir arkadaşınızdan Mac ödünç alabilir veya MacStadium/MacinCloud gibi cloud Mac servislerini kullanabilirsiniz (saatlik ~$1).

**S: Build başarılı oldu ama App Store Connect'te görünmüyor?**
C: İşleme 10-30 dakika sürebilir. Ayrıca spam klasörünüzü kontrol edin, Apple email gönderir.

**S: Sertifika şifremi unuttum?**
C: `eventmap-certificates` repo'sunu silin, Adım 7'yi tekrarlayın ve yeni bir şifre belirleyin.

**S: GitHub Actions'ı tetikledim, hiç build başlamadı?**
C: Repo → Settings → Actions → **Allow all actions** seçeneğinin açık olduğundan emin olun.

---

## ✅ Kontrol Listesi

Göndermeden önce:

- [ ] Apple Developer hesabı aktif (99$ ödendi)
- [ ] App ID oluşturuldu
- [ ] GitHub'da 2 repo var (ana proje + sertifikalar)
- [ ] GitHub Secrets eklendi (4 adet)
- [ ] Fastlane Match kuruldu (Mac'te)
- [ ] Matchfile güncellendi
- [ ] App Store Connect'te uygulama oluşturuldu
- [ ] Screenshots hazırlandı (6.7" ve 5.5")
- [ ] Privacy Policy URL'si hazır
- [ ] TestFlight'ta test edildi
- [ ] Build başarılı

---

## 🎉 Tebrikler!

Artık EventMap uygulamanız App Store'da!

**Sonraki adımlar:**
- Kullanıcı feedback'lerini takip edin
- Düzenli güncellemeler yapın
- Analytics ekleyin (Firebase, Amplitude vb.)

---

**Not:** Bu rehber 2025 Ocak ayı için günceldir. Apple ve GitHub politikaları değişebilir.
