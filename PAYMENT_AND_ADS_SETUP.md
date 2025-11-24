# 💳 Ödeme ve Reklam Entegrasyonu Rehberi

Bu rehber, EventMap uygulamasında **Stripe ödeme sistemi** ve **Google AdSense reklam** entegrasyonunun nasıl yapılacağını adım adım açıklar.

---

## 🎯 Genel Bakış

### ✅ Tamamlanan İşler
- ✅ Stripe React kütüphaneleri kuruldu (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- ✅ PremiumModal Stripe entegrasyonuna hazır
- ✅ Supabase Edge Functions oluşturuldu:
  - `create-checkout-session` - Ödeme sayfası oluşturur
  - `stripe-webhook` - Ödeme bildirimlerini işler
- ✅ AdBanner component AdSense desteğine hazır
- ✅ index.html AdSense script placeholder'ı eklendi

### 📋 Yapılması Gerekenler
1. Stripe hesabı oluştur ve API key'leri al
2. Google AdSense hesabı oluştur ve ad unit'leri ayarla
3. Environment variables'ları yapılandır
4. Supabase Edge Functions'ları deploy et
5. Test et!

---

## 💰 STRIPE ÖDEME ENTEGRASYONu

### 1. Stripe Hesabı Oluşturma

1. **Stripe'a kaydol**: https://dashboard.stripe.com/register
2. **Ücretsiz** - Sadece başarılı ödemelerde komisyon alır
   - Türkiye için: **2.9% + ₺1.50** (kartla)
   - Avrupa kartları: **2.9% + €0.30**
3. **Hesap Doğrulama**: İşletme bilgilerini doldur

### 2. Stripe Dashboard Ayarları

#### A. API Keys Al
1. Dashboard > **Developers** > **API keys**
2. İki key göreceksin:
   - **Publishable key** (pk_test_... veya pk_live_...)
   - **Secret key** (sk_test_... veya sk_live_...)
3. Bu key'leri kopyala - birazdan kullanacağız

#### B. Products & Prices Oluştur
1. Dashboard > **Products** > **Add Product**
2. **Aylık Plan Oluştur**:
   - Name: `EventMap Premium - Aylık`
   - Description: `Sınırsız etkinlik, reklamsız deneyim`
   - Pricing model: **Recurring**
   - Price: `₺49.00 TRY`
   - Billing period: **Monthly**
   - **Create product**
3. **Price ID'yi kopyala** (örn: `price_1Abc123...`) - .env'e ekleyeceğiz

4. **Yıllık Plan Oluştur**:
   - Name: `EventMap Premium - Yıllık`
   - Pricing model: **Recurring**
   - Price: `₺399.00 TRY`
   - Billing period: **Yearly**
   - **Create product**
5. **Price ID'yi kopyala**

#### C. Webhook Ayarla
1. Dashboard > **Developers** > **Webhooks** > **Add endpoint**
2. Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Önce Supabase'de deploy etmen gerekecek (aşağıda anlatılıyor)
3. **Events to send** seç:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.deleted`
   - ✅ `customer.subscription.updated`
   - ✅ `invoice.payment_failed`
4. **Add endpoint**
5. **Signing secret**'i kopyala (whsec_...) - .env'e ekleyeceğiz

### 3. Environment Variables

`.env` dosyasını güncelle:

```bash
# Mevcut Supabase keys
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# STRIPE KEYS (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...

# STRIPE KEYS (Backend - Supabase'e eklenecek)
STRIPE_SECRET_KEY=sk_test_51ABC123...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...

# STRIPE PRICE IDs
VITE_STRIPE_PRICE_MONTHLY=price_1ABC123monthly...
VITE_STRIPE_PRICE_YEARLY=price_1ABC123yearly...
```

### 4. PremiumModal'ı Güncelle

[src/components/modals/PremiumModal.tsx](src/components/modals/PremiumModal.tsx:30) dosyasını aç:

```typescript
const plans = [
  {
    name: 'Aylık',
    price: '₺49',
    period: '/ay',
    priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly',
    savings: null,
    recommended: false,
  },
  {
    name: 'Yıllık',
    price: '₺399',
    period: '/yıl',
    priceId: import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_yearly',
    savings: '%32 tasarruf',
    recommended: true,
  },
];
```

### 5. Supabase Edge Functions Deploy

#### A. Supabase CLI Kurulumu
```bash
# npm ile kur
npm install supabase --save-dev

# veya global
npm install -g supabase
```

#### B. Supabase Login
```bash
npx supabase login
```

#### C. Project Link
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
# Project ref: dashboard.supabase.com/project/[PROJECT_REF]
```

#### D. Secrets Ayarla
```bash
# Stripe secret key
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51ABC...

# Stripe webhook secret
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_ABC...

# Supabase service role key (Dashboard > Settings > API'den al)
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### E. Functions'ları Deploy Et
```bash
# Checkout session function
npx supabase functions deploy create-checkout-session

# Webhook handler function
npx supabase functions deploy stripe-webhook
```

#### F. Function URL'leri Al
Deploy sonrası URL'ler:
- Checkout: `https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session`
- Webhook: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`

### 6. Frontend'i Güncelle

[src/components/modals/PremiumModal.tsx](src/components/modals/PremiumModal.tsx:52) içindeki API endpoint'i güncelle:

```typescript
const response = await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId,
    userId: user.id,
    userEmail: user.email,
  }),
});
```

### 7. Stripe Webhook URL'ini Güncelle

Stripe Dashboard > Webhooks > endpoint'i güncelle:
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`

### 8. Test Et!

#### Test Mode (Development)
1. Premium modal'ı aç
2. Bir plan seç (Aylık veya Yıllık)
3. Stripe Checkout sayfasına yönlendirileceksin
4. Test kartı kullan: `4242 4242 4242 4242`
   - Expiry: Gelecekte herhangi bir tarih (örn: 12/34)
   - CVC: Herhangi bir 3 haneli sayı (örn: 123)
   - ZIP: Herhangi bir sayı (örn: 12345)
5. Ödeme sonrası success sayfasına döneceksin
6. Supabase'de `profiles` tablosunu kontrol et - `is_premium` = `true` olmalı

#### Production'a Geçiş
1. Stripe Dashboard'da **Activate your account** (doğrulama gerekecek)
2. Live API keys kullan (pk_live_... ve sk_live_...)
3. `.env` dosyasını güncelle
4. Supabase secrets'ı güncelle
5. Webhook'u live mode'da yeniden oluştur

---

## 📢 GOOGLE ADSENSE ENTEGRASYONu

### 1. AdSense Hesabı Oluştur

1. **AdSense'e kaydol**: https://www.google.com/adsense
2. **Ücretsiz** - Reklam gelirinden komisyon alır (genelde %32)
3. Website domain'i ekle: `yourdomain.com`
4. AdSense kodu al ve web sitenin `<head>` bölümüne ekle

### 2. AdSense Dashboard Ayarları

#### A. Ad Units Oluştur
1. **Ads** > **By ad unit** > **Display ads** > **Create new ad unit**

2. **Horizontal Ad (Liste ve Harita için)**:
   - Name: `EventMap - Horizontal Banner`
   - Ad size: **Responsive**
   - Ad type: **Display ads**
   - **Create**
   - Ad unit code'u kopyala (ca-pub-XXXXXXXXXXXXXXXX)

3. **Square Ad (Event Detail için)**:
   - Name: `EventMap - Square`
   - Ad size: **Responsive** veya **300x250**
   - **Create**
   - Ad unit code'u kopyala

#### B. Ads.txt Dosyası
1. AdSense Dashboard > **Account** > **Sites** > **Show details**
2. `ads.txt` dosyasını indir
3. Web sitenin root dizinine yükle: `https://yourdomain.com/ads.txt`

### 3. Environment Variables

`.env` dosyasına ekle:

```bash
# GOOGLE ADSENSE
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_HORIZONTAL=1234567890
VITE_ADSENSE_SLOT_SQUARE=0987654321
```

### 4. index.html'i Güncelle

[index.html](index.html:23) dosyasındaki comment'i kaldır:

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### 5. AdBanner Kullanımı

#### A. ListView'de (Horizontal)
```typescript
import AdBanner, { GoogleAdSense } from '@/components/AdBanner';

// Mock ad yerine gerçek AdSense kullan
{!isPremium && (index + 1) % 5 === 0 && (
  <GoogleAdSense
    slot={import.meta.env.VITE_ADSENSE_SLOT_HORIZONTAL}
    format="auto"
    responsive={true}
  />
)}
```

#### B. MapView'de (Horizontal)
```typescript
{!isPremium && events.length > 0 && (
  <div className="absolute bottom-20 left-0 right-0 px-4 z-10">
    <GoogleAdSense
      slot={import.meta.env.VITE_ADSENSE_SLOT_HORIZONTAL}
      format="horizontal"
      responsive={true}
    />
  </div>
)}
```

#### C. EventDetailSheet'te (Square)
```typescript
{!isPremium && (
  <div className="mb-6">
    <GoogleAdSense
      slot={import.meta.env.VITE_ADSENSE_SLOT_SQUARE}
      format="rectangle"
      responsive={false}
    />
  </div>
)}
```

### 6. AdSense Auto Ads (Opsiyonel)

Auto ads Google'ın otomatik reklam yerleştirmesi:

1. AdSense Dashboard > **Ads** > **By site**
2. Domain seç > **Auto ads** > **Enable**
3. Sayfa türlerini seç (Article, List, Search, etc.)
4. **Apply to site**

Not: Auto ads ile manuel ad placement'ı birlikte kullanabilirsin.

### 7. Test Et

#### Development'ta
- AdSense client ID olmadan placeholder gösterecek
- `.env` dosyasında `VITE_ADSENSE_CLIENT_ID` tanımla

#### Production'da
1. Web sitenin domain'i AdSense'e eklenmiş olmalı
2. AdSense onayı (review) beklemen gerekebilir (birkaç gün sürebilir)
3. Onaylandıktan sonra reklamlar görünmeye başlayacak

#### AdSense İpuçları
- ❌ Kendi reklamlarına tıklama (invalid traffic - hesap kapatılır!)
- ✅ Premium olmayan test kullanıcısı oluştur
- ✅ İlk 1-2 hafta düşük gelir normal (AdSense optimization süreci)
- ✅ Reklam yoğunluğu: Kullanıcı deneyimini bozmadan maksimum 3-4 ad/page

---

## 🗄️ DATABASE DEĞİŞİKLİKLERİ

### Premium İçin Profile Alanları

Eğer daha önce çalıştırmadıysan, `profiles` tablosuna şu alanları ekle:

```sql
-- Premium fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ;

-- İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer
ON profiles(stripe_customer_id);
```

Bu SQL'i Supabase SQL Editor'da çalıştır.

---

## 🧪 TEST SENARYOLARI

### Stripe Testi

#### 1. Ödeme Akışı
- [ ] Premium modal açılıyor
- [ ] Plan seçimi çalışıyor (Aylık/Yıllık)
- [ ] Stripe Checkout'a yönlendiriliyor
- [ ] Test kartıyla ödeme yapılabiliyor
- [ ] Success sayfasına dönülüyor
- [ ] Profile'da `is_premium` = true oluyor

#### 2. Webhook İşleme
- [ ] Checkout completed event alınıyor
- [ ] User'ın premium durumu güncelleniyor
- [ ] Subscription ID kaydediliyor
- [ ] İptal edilince premium kalkıyor

#### 3. Error Handling
- [ ] Ödeme başarısız olursa hata mesajı gösteriliyor
- [ ] Cancelled'de cancel sayfasına yönlendiriliyor
- [ ] Login olmadan premium almaya çalışınca uyarı

### AdSense Testi

#### 1. Ad Görüntüleme
- [ ] Premium olmayan kullanıcı reklamları görüyor
- [ ] Premium kullanıcı reklam görmüyor
- [ ] ListView'de her 5 etkinlikte bir reklam var
- [ ] MapView'de altta reklam var
- [ ] EventDetailSheet'te reklam var

#### 2. Responsive Davranış
- [ ] Horizontal ad'ler mobilde düzgün görünüyor
- [ ] Square ad'ler tablet'te düzgün görünüyor
- [ ] Auto ads sayfa layout'unu bozmuyor

---

## 📊 GELİR TAHMİNİ

### Stripe Komisyonları
- **Türk Kartları**: 2.9% + ₺1.50
- **Avrupa Kartları**: 2.9% + €0.30

**Örnek Hesap**:
- Aylık Plan: ₺49
- Stripe komisyon: ₺49 × 2.9% + ₺1.50 = ₺2.92
- **Net gelir**: ₺46.08

- Yıllık Plan: ₺399
- Stripe komisyon: ₺399 × 2.9% + ₺1.50 = ₺13.07
- **Net gelir**: ₺385.93

### AdSense Gelirleri
- **CPM** (1000 gösterim başına): $0.25 - $4.00 (ortalama $1.00)
- **CPC** (tıklama başına): $0.20 - $15.00 (ortalama $1.00)
- **CTR** (tıklama oranı): %0.5 - %2.0

**Örnek Hesap**:
- Günlük 1,000 kullanıcı (premium olmayan)
- Her kullanıcı 3 sayfa görüntülüyor = 3,000 page views
- Her sayfada 1 reklam = 3,000 ad impressions
- CPM $1.00 = **Günlük $3.00**
- Aylık: **$90** (≈₺2,700)

---

## 🚨 SORUN GİDERME

### Stripe Sorunları

#### "Invalid API Key"
- ✅ `.env` dosyasındaki key'leri kontrol et
- ✅ Test mode'da mısın? (pk_test_ vs pk_live_)
- ✅ Key'lerin başında/sonunda boşluk var mı?

#### Webhook Çalışmıyor
- ✅ Webhook URL doğru mu?
- ✅ Webhook secret doğru mu?
- ✅ Supabase function deploy edildi mi?
- ✅ Stripe Dashboard > Webhooks > Logs'u kontrol et

#### Premium Açılmıyor
- ✅ Supabase > Logs > Edge Functions'ı kontrol et
- ✅ profiles tablosuna manuel ekleyerek test et
- ✅ Webhook event'lerini Stripe Dashboard'dan kontrol et

### AdSense Sorunları

#### Reklamlar Gösterilmiyor
- ✅ AdSense hesabı onaylandı mı?
- ✅ `ads.txt` dosyası doğru mu?
- ✅ Ad units oluşturuldu mu?
- ✅ `.env` dosyasında client ID var mı?
- ✅ Browser'da ad blocker kapalı mı?

#### "Ads.txt file missing"
- ✅ `ads.txt` dosyasını root'a yükle
- ✅ `https://yourdomain.com/ads.txt` erişilebilir mi?
- ✅ AdSense'in crawl etmesi 24-48 saat sürebilir

#### Invalid Traffic Uyarısı
- ❌ ASLA kendi reklamlarına tıklama!
- ✅ Test için ayrı hesap kullan
- ✅ VPN kullanıyorsan kapat
- ✅ Botlardan koruma ekle

---

## ✅ DEPLOYMENT CHECKLİST

### Frontend (.env)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (live key)
- [ ] `VITE_STRIPE_PRICE_MONTHLY` (live price ID)
- [ ] `VITE_STRIPE_PRICE_YEARLY` (live price ID)
- [ ] `VITE_ADSENSE_CLIENT_ID`
- [ ] `VITE_ADSENSE_SLOT_HORIZONTAL`
- [ ] `VITE_ADSENSE_SLOT_SQUARE`

### Supabase (Secrets)
- [ ] `STRIPE_SECRET_KEY` (live key)
- [ ] `STRIPE_WEBHOOK_SECRET` (live webhook secret)
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Stripe
- [ ] Products & Prices oluşturuldu
- [ ] Webhook endpoint eklendi (live mode)
- [ ] Webhook events seçildi
- [ ] Test edildi

### AdSense
- [ ] Hesap onaylandı
- [ ] Domain eklendi
- [ ] Ad units oluşturuldu
- [ ] `ads.txt` yüklendi
- [ ] Script eklendi

### Supabase
- [ ] Edge Functions deploy edildi
- [ ] Secrets ayarlandı
- [ ] Database alanları eklendi
- [ ] RLS policies kontrolü yapıldı

---

## 📞 DESTEK

### Stripe Dokümantasyon
- React Integration: https://stripe.com/docs/stripe-js/react
- Subscriptions: https://stripe.com/docs/billing/subscriptions
- Webhooks: https://stripe.com/docs/webhooks
- Test Cards: https://stripe.com/docs/testing

### AdSense Dokümantasyon
- Get Started: https://support.google.com/adsense/answer/10162
- Ad Code: https://support.google.com/adsense/answer/7584263
- Policies: https://support.google.com/adsense/answer/48182

### Supabase Dokümantasyon
- Edge Functions: https://supabase.com/docs/guides/functions
- Environment Variables: https://supabase.com/docs/guides/functions/secrets

---

## 🎉 Tebrikler!

Artık EventMap'in tam özellikli bir **monetization sistemi** var! 🚀

- ✅ Stripe ile güvenli ödemeler
- ✅ Komisyon tabanlı (aylık ücret yok!)
- ✅ AdSense ile pasif gelir
- ✅ Premium modelle sürdürülebilir gelir

İyi kazançlar! 💰
