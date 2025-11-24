# 🚀 EventMap Backend Kurulum Rehberi

Bu rehber, EventMap uygulamasının backend sistemini **sıfırdan** kurmanız için **adım adım** talimatlar içerir.

---

## 📋 İçindekiler

1. [Supabase Dashboard'a Giriş](#1-supabase-dashboarda-giriş)
2. [Veritabanı Kurulumu](#2-veritabanı-kurulumu)
3. [Admin Kullanıcısı Oluşturma](#3-admin-kullanıcısı-oluşturma)
4. [Storage (Görsel Depolama) Kurulumu](#4-storage-görsel-depolama-kurulumu)
5. [Test ve Doğrulama](#5-test-ve-doğrulama)
6. [ReCAPTCHA Kurulumu (Opsiyonel)](#6-recaptcha-kurulumu-opsiyonel)
7. [Sorun Giderme](#7-sorun-giderme)

---

## 1. Supabase Dashboard'a Giriş

### Adım 1.1: Supabase'e Giriş Yapın

1. Tarayıcınızda [https://supabase.com](https://supabase.com) adresine gidin
2. Sağ üst köşede **"Sign In"** butonuna tıklayın
3. Email ve şifrenizi girerek giriş yapın

### Adım 1.2: Projenizi Seçin

1. Dashboard'da projeler listesinde **projenizi bulun**
2. Proje adı: `zktzpwuuqdsfdrdljtoy` olan projeye tıklayın
3. Sol menüden **"SQL Editor"** seçeneğine tıklayın

---

## 2. Veritabanı Kurulumu

### Adım 2.1: SQL Editor'ü Açın

1. Sol menüden **"SQL Editor"** seçeneğine tıklayın
2. Sağ üst köşede **"New Query"** butonuna tıklayın

### Adım 2.2: SQL Scriptini Kopyalayın

1. Projenizde bulunan **`FULL_DATABASE_SETUP.sql`** dosyasını bir metin editörüyle açın
2. **Tüm içeriği** kopyalayın (Ctrl+A, sonra Ctrl+C)

### Adım 2.3: Admin Email'inizi Değiştirin

SQL scriptinde şu satırı bulun (yaklaşık 280. satır):

```sql
admin_email TEXT := 'murat@example.com';  -- BURAYA KENDİ EMAİLİNİZİ YAZIN
```

**ÖNEMLİ:** `murat@example.com` yerine **uygulama kayıt olacağınız email adresinizi** yazın!

Örnek:
```sql
admin_email TEXT := 'benim.emailim@gmail.com';
```

### Adım 2.4: SQL Scriptini Çalıştırın

1. Kopyaladığınız SQL scriptini Supabase SQL Editor'e **yapıştırın**
2. Sağ alt köşedeki **"Run"** (veya F5) butonuna tıklayın
3. Script çalışmaya başlayacak (5-10 saniye sürer)

### Adım 2.5: Başarı Mesajlarını Kontrol Edin

Alt kısımda şu mesajları göreceksiniz:

```
✅ Veritabanı kurulumu tamamlandı!
📊 Tablolar: profiles, events, event_reports, admin_notifications, favorites, attendances
🔐 RLS policies aktif
📁 Storage bucket: event-images
👤 Admin sistemi hazır

⚠️ ÖNEMLİ: Yukarıdaki admin_email değişkenini kendi emailinizle değiştirmeyi unutmayın!
📝 Sonraki adım: Uygulamadan kayıt olun, sonra bu scripti tekrar çalıştırın
```

**HATA ALDIYSAN IZ:** [Sorun Giderme](#7-sorun-giderme) bölümüne bakın

---

## 3. Admin Kullanıcısı Oluşturma

### Adım 3.1: Uygulamadan Kayıt Olun

1. Tarayıcınızda uygulamanızı açın: `http://localhost:5173`
2. Sağ alttaki **"Profil"** sekmesine tıklayın
3. **Email ve şifrenizi** girin (SQL scriptinde yazdığınız email ile aynı olmalı!)
4. **"Hesap Oluştur"** butonuna tıklayın
5. Kayıt başarılı olduğunda, uygulamaya giriş yapmış olacaksınız

**ÖNEMLİ:** Email adresinizi doğrulamanız gerekebilir. Supabase size bir doğrulama emaili gönderecek.

### Adım 3.2: Admin Yetkisi Verin (Manuel Yöntem)

Eğer SQL scriptindeki admin_email kısmını değiştirmeyi unuttuysanız, manuel olarak da yapabilirsiniz:

1. Supabase Dashboard'da **"Table Editor"** seçeneğine tıklayın
2. Sol menüden **"profiles"** tablosunu seçin
3. Kendi kaydınızı **bulun** (email adresinize bakın)
4. **"is_admin"** kolonunu bulun ve **"false"** olan değeri **"true"** yapın
5. Değişikliği **kaydedin**

### Adım 3.3: Admin Panelini Kontrol Edin

1. Uygulamada **"Profil"** sekmesine gidin
2. Şimdi üstte **4 tab** görmelisiniz:
   - ❤️ Favoriler
   - 📅 Katılıyorum
   - 🛡️ **Admin** ← YENİ!
   - ⚙️ Ayarlar
3. **"Admin"** sekmesine tıklayın
4. Admin panelini göreceksiniz! 🎉

---

## 4. Storage (Görsel Depolama) Kurulumu

Storage bucket zaten SQL scriptinde oluşturuldu, ama ayarlarını kontrol etmeliyiz.

### Adım 4.1: Storage Sayfasına Gidin

1. Supabase Dashboard'da sol menüden **"Storage"** seçeneğine tıklayın
2. **"event-images"** bucket'ını göreceksiniz

### Adım 4.2: Bucket Ayarlarını Yapın

1. **"event-images"** satırının sağındaki **⚙️ (Settings)** ikonuna tıklayın
2. Şu ayarları yapın:

   **File size limit:**
   ```
   5242880
   ```
   *(Bu 5MB demek)*

   **Allowed MIME types:**
   ```
   image/jpeg
   image/jpg
   image/png
   image/webp
   ```
   *(Virgülle ayırarak yazın)*

3. **"Save"** butonuna tıklayın

### Adım 4.3: Public Access Kontrolü

1. Bucket listesinde **"event-images"** satırına bakın
2. **"Public"** kolonunda **yeşil tik** olmalı ✅
3. Eğer kırmızı çarpı ❌ varsa:
   - Bucket satırına tıklayın
   - Sağ üstteki **"Settings"** seçeneğine tıklayın
   - **"Public bucket"** kutucuğunu işaretleyin
   - **"Save"** butonuna tıklayın

---

## 5. Test ve Doğrulama

### Test 1: Etkinlik Oluşturma

1. Uygulamada sağ alttaki **➕ (Plus)** butonuna tıklayın
2. Bir etkinlik oluşturun:
   - Başlık: "Test Etkinliği"
   - Kategori: Herhangi biri
   - Şehir: Istanbul
   - Tarih ve saat seçin
   - Konum bilgilerini doldurun
3. **Görsel yükleyin** (opsiyonel ama test için iyi)
4. **"Etkinliği Oluştur"** butonuna tıklayın
5. ✅ **"Etkinlik başarıyla oluşturuldu!"** mesajı görmelisiniz

### Test 2: Admin Onay Sistemi

1. **"Profil"** → **"Admin"** sekmesine gidin
2. **"Onay Bekleyen Etkinlikler"** bölümünde oluşturduğunuz etkinliği göreceksiniz
3. Etkinliğe tıklayın ve **"Detayları Gör"** butonuna tıklayın
4. **"Onayla"** butonuna tıklayın
5. ✅ Etkinlik onaylandı!
6. **"Liste"** sekmesine dönün, etkinliğinizi göreceksiniz

### Test 3: Görsel Yükleme

1. Yeni bir etkinlik oluşturun
2. **"Görsel Yükle"** butonuna tıklayın
3. Bir JPEG veya PNG dosyası seçin
4. Önizleme görünmelisiniz
5. Etkinliği oluşturun
6. Admin panelinde etkinliğin görselini göreceksiniz ✅

### Test 4: Geocoding (Adres → Koordinat)

1. Yeni etkinlik oluştururken:
2. **Şehir** seçin (ör: Istanbul)
3. **Adres** girin (ör: "Taksim Meydanı")
4. **"🔍 Adresten Konum Bul"** butonuna tıklayın
5. ✅ "Konum bulundu!" mesajı görmelisiniz
6. Harita üzerinde marker otomatik güncellenecek

---

## 6. ReCAPTCHA Kurulumu (Opsiyonel)

ReCAPTCHA spam koruması için Google hesabınızla kayıt yapmanız gerekiyor.

### Adım 6.1: Google ReCAPTCHA'ya Kayıt Olun

1. [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) adresine gidin
2. **"+"** (Yeni site oluştur) butonuna tıklayın
3. Formu doldurun:
   - **Label:** EventMap
   - **reCAPTCHA type:** "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains:**
     ```
     localhost
     ```
     *(Şimdilik sadece localhost. Production için alan adınızı da ekleyin)*
4. **"Submit"** butonuna tıklayın

### Adım 6.2: Site Key'i Kopyalayın

1. Başarılı kayıt sonrası iki key göreceksiniz:
   - **Site Key** (public)
   - **Secret Key** (private)

2. **Site Key**'i kopyalayın

### Adım 6.3: .env Dosyasına Ekleyin

1. Proje klasörünüzde `.env` dosyasını açın
2. Şu satırı **ekleyin**:
   ```env
   VITE_RECAPTCHA_SITE_KEY=your_site_key_here
   ```
3. `your_site_key_here` yerine kopyaladığınız Site Key'i **yapıştırın**
4. Dosyayı **kaydedin**

### Adım 6.4: Uygulamayı Yeniden Başlatın

1. Terminal'de `Ctrl+C` ile uygulamayı **durdurun**
2. `npm run dev` ile **yeniden başlatın**
3. Artık etkinlik oluşturma formunda **ReCAPTCHA** göreceksiniz! 🤖

**NOT:** Backend verification için detaylı talimatlar `RECAPTCHA_SETUP.md` dosyasında.

---

## 7. Sorun Giderme

### Sorun 1: "relation events does not exist" Hatası

**Sebep:** Temel veritabanı şeması oluşturulmamış.

**Çözüm:**
1. İlk olarak `supabase-setup.sql` dosyasını çalıştırın
2. Sonra `FULL_DATABASE_SETUP.sql` dosyasını çalıştırın

### Sorun 2: "Admin" Sekmesi Görünmüyor

**Sebep:** `is_admin` yetkisi verilmemiş.

**Çözüm:**
1. Supabase Dashboard → Table Editor → profiles
2. Kendi kaydınızı bulun
3. `is_admin` kolonunu `true` yapın
4. Uygulamayı **yenileyin** (F5)

### Sorun 3: Görseller Yüklenmiyor

**Sebep:** Storage bucket public değil veya RLS policies yanlış.

**Çözüm:**
1. Supabase → Storage → event-images
2. Settings → "Public bucket" kutucuğunu işaretleyin
3. SQL Editor'de şu komutu çalıştırın:
   ```sql
   -- Tüm storage policies'i temizle ve yeniden oluştur
   DROP POLICY IF EXISTS "Users can upload images to their own folder" ON storage.objects;
   DROP POLICY IF EXISTS "Public read access to event images" ON storage.objects;

   CREATE POLICY "Users can upload images to their own folder"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'event-images' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   CREATE POLICY "Public read access to event images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'event-images');
   ```

### Sorun 4: "Supabase yapılandırılmamış" Hatası

**Sebep:** `.env` dosyasında Supabase bilgileri yok.

**Çözüm:**
1. `.env` dosyasını açın
2. Şu satırların olduğundan emin olun:
   ```env
   VITE_SUPABASE_URL=https://zktzpwuuqdsfdrdljtoy.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Terminal'de uygulamayı yeniden başlatın: `npm run dev`

### Sorun 5: Geocoding Çalışmıyor

**Sebep:** Rate limiting (1 istek/saniye) veya Nominatim API erişim sorunu.

**Çözüm:**
1. **Konsolu kontrol edin** (F12 → Console tab)
2. Eğer **"429 Too Many Requests"** hatası varsa: 1 saniye bekleyip tekrar deneyin
3. Eğer **CORS** hatası varsa: Tarayıcı cache'ini temizleyin veya incognito modda deneyin
4. **Manuel konum seçimi:** "Haritadan Seç" butonunu kullanın

### Sorun 6: Admin Bildirimleri Gelmiyor

**Sebep:** Trigger fonksiyonları çalışmıyor.

**Çözüm:**
1. SQL Editor'de şu komutu çalıştırın:
   ```sql
   -- Trigger'ları kontrol et
   SELECT * FROM information_schema.triggers
   WHERE trigger_name LIKE '%admin%';
   ```
2. Eğer trigger yoksa, `FULL_DATABASE_SETUP.sql` scriptini **yeniden çalıştırın**

### Sorun 7: Email Doğrulama Maili Gelmiyor

**Sebep:** Supabase email settings varsayılan ayarlarda.

**Çözüm:**
1. Supabase Dashboard → Authentication → Email Templates
2. "Confirm signup" template'ini kontrol edin
3. **Geliştirme için:** Dashboard → Authentication → Settings → Email Auth
4. **"Enable email confirmations"** kutucuğunu **kapatın** (sadece test için!)

---

## 8. Sistem Mimarisi Özeti

### Veritabanı Tabloları

| Tablo | Açıklama |
|-------|----------|
| `profiles` | Kullanıcı profilleri (is_admin dahil) |
| `events` | Etkinlikler (status: draft/inReview/approved/rejected) |
| `event_reports` | Spam/uygunsuzluk raporları |
| `admin_notifications` | Admin bildirimleri |
| `favorites` | Favori etkinlikler |
| `attendances` | Katılım listesi |

### RLS (Row Level Security) Politikaları

- ✅ Sadece **onaylanmış** etkinlikler herkese görünür
- ✅ Kullanıcılar **kendi** etkinliklerini düzenleyebilir/silebilir
- ✅ **Adminler** tüm etkinlikleri görebilir/düzenleyebilir
- ✅ Storage'da kullanıcılar sadece **kendi klasörlerine** yükleme yapabilir

### Trigger Fonksiyonları

1. **Yeni etkinlik → Admin bildirimi**
2. **3+ rapor → Admin uyarısı**
3. **Koordinat değişimi → location_point güncelleme**
4. **Yeni kullanıcı → Otomatik profil oluşturma**

---

## 9. Sonraki Adımlar

✅ Veritabanı kurulumu tamamlandı!
✅ Admin paneli çalışıyor!
✅ Görsel yükleme aktif!
✅ Geocoding hazır!

### İsteğe Bağlı Geliştirmeler:

1. **Email Bildirimleri:** Etkinlik onaylandığında kullanıcıya email gönder
2. **Push Notifications:** Mobil bildirimleri ekle
3. **Analytics Dashboard:** Admin için istatistikler
4. **Scheduled Jobs:** Eski etkinlikleri otomatik temizle
5. **Advanced Search:** Full-text search ile gelişmiş arama

---

## 10. Destek

Sorun mu yaşıyorsunuz?

1. **Console'u kontrol edin** (F12 → Console)
2. **Network tab'ı kontrol edin** (F12 → Network)
3. **Supabase Logs:** Dashboard → Logs
4. **Bu dosyadaki** [Sorun Giderme](#7-sorun-giderme) bölümüne bakın

---

**🎉 Tebrikler! Backend kurulumunu tamamladınız!**

Artık EventMap uygulamanız tamamen fonksiyonel ve production-ready!
