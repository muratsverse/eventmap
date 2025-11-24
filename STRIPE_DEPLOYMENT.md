# Stripe Premium Ödemeleri - Deployment Rehberi

Bu rehber Stripe premium abonelik sistemini aktifleştirmek için gereken adımları içerir.

## ✅ Hazır Olan Dosyalar

1. ✅ `supabase/functions/create-checkout-session/index.ts` - Ödeme sayfası oluşturur
2. ✅ `supabase/functions/stripe-webhook/index.ts` - Stripe bildirimlerini işler
3. ✅ `src/components/modals/PremiumModal.tsx` - Premium modal güncellenmiş

## 📋 Gerekli Bilgiler

Elinizde şu bilgiler olmalı:

```
✅ Stripe Price ID: price_1SRCyZCOalGPl2j7dJOqK6wS
✅ Stripe Webhook Secret: whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh
✅ Supabase Service Role Key: sbp_ca670cfe3c94701e0e0d81a604f47ae6b6e8922a
❓ Stripe Publishable Key: pk_test_... (gerekli!)
❓ Stripe Secret Key: sk_test_... (gerekli!)
```

## 🔑 Adım 1: Stripe API Keys Alma

### Stripe Publishable Key ve Secret Key Almak İçin:

1. [Stripe Dashboard](https://dashboard.stripe.com/) → Giriş yapın
2. **Developers** → **API keys** sekmesine gidin
3. İki anahtarı kopyalayın:
   - **Publishable key** (pk_test_...) - Frontend için
   - **Secret key** (sk_test_...) - Backend için

⚠️ **ÖNEMLİ:** Test modunda (pk_test ve sk_test) başlayın!

---

## 🔧 Adım 2: Environment Variables Ekleyin

### 2.1 Frontend (.env dosyası)

`.env` dosyanızı açın ve şu değerleri ekleyin/güncelleyin:

```bash
# STRIPE (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SIZIN_PUBLISHABLE_KEYINIZ

# STRIPE PRICE IDs
VITE_STRIPE_PRICE_MONTHLY=price_1SRCyZCOalGPl2j7dJOqK6wS
```

### 2.2 Supabase Edge Functions Secrets

Terminal'de şu komutları çalıştırın:

```bash
# Supabase CLI kurulu değilse önce kurun
npm install -g supabase

# Supabase'e giriş yapın
npx supabase login

# Project'i bağlayın (Project ID'nizi Supabase Dashboard'dan alın)
npx supabase link --project-ref SIZIN_PROJECT_REF

# Secrets ekleyin
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_SIZIN_SECRET_KEYINIZ
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sbp_ca670cfe3c94701e0e0d81a604f47ae6b6e8922a
npx supabase secrets set SUPABASE_URL=SIZIN_SUPABASE_URL
```

**Not:** `SIZIN_PROJECT_REF` Supabase Dashboard'dan alınır (örn: `abcdefgh`)

---

## 🚀 Adım 3: Edge Functions Deploy Et

Terminal'de şu komutları çalıştırın:

```bash
cd C:\Users\murat\OneDrive\Masaüstü\Eventmap

# Checkout session fonksiyonunu deploy et
npx supabase functions deploy create-checkout-session

# Webhook handler'ı deploy et
npx supabase functions deploy stripe-webhook
```

Deploy sonrası şu URL'leri alacaksınız:
- `https://PROJE_ID.supabase.co/functions/v1/create-checkout-session`
- `https://PROJE_ID.supabase.co/functions/v1/stripe-webhook`

---

## 🔗 Adım 4: Stripe Webhook URL'sini Yapılandır

### 4.1 Webhook Endpoint Ekle

1. [Stripe Dashboard](https://dashboard.stripe.com/) → **Developers** → **Webhooks**
2. **Add endpoint** tıklayın
3. **Endpoint URL** girin:
   ```
   https://PROJE_ID.supabase.co/functions/v1/stripe-webhook
   ```
4. **Listen to** → **Events on your account** seçin
5. **Select events** → Şu event'leri ekleyin:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.payment_failed`
6. **Add endpoint** tıklayın

### 4.2 Webhook Secret Doğrulama

Webhook eklediğinizde yeni bir **Signing secret** (whsec_...) gösterilecek.

⚠️ **Dikkat:** Eğer bu yeni secret eski secret'tan farklıysa, secrets'ı güncelleyin:

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=yeni_whsec_...
```

---

## 🗄️ Adım 5: Database Schema Güncellemesi

Profiles tablosuna premium alanları ekleyin:

```sql
-- Supabase SQL Editor'da çalıştırın
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index ekleyin (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer
  ON profiles(stripe_customer_id);
```

---

## 🧪 Adım 6: Test Edin

### 6.1 Test Kartı ile Ödeme Testi

1. Uygulamanıza giriş yapın
2. **Premium'a Geç** butonuna basın
3. Stripe test kartını kullanın:
   ```
   Kart Numarası: 4242 4242 4242 4242
   CVC: Herhangi 3 rakam
   Tarih: Gelecekte herhangi bir tarih
   ```
4. Ödemeyi tamamlayın

### 6.2 Webhook Testi

1. [Stripe Dashboard](https://dashboard.stripe.com/) → **Developers** → **Webhooks**
2. Webhook endpoint'inize tıklayın
3. **Send test webhook** ile test edin
4. Event: `checkout.session.completed` seçin
5. Gönder

### 6.3 Logs Kontrol

```bash
# Edge function loglarını görmek için
npx supabase functions logs create-checkout-session
npx supabase functions logs stripe-webhook
```

---

## 🔍 Troubleshooting

### Problem 1: "STRIPE_SECRET_KEY not set" hatası

**Çözüm:**
```bash
# Secrets'ı tekrar set edin
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### Problem 2: Webhook 400 hatası veriyor

**Çözüm:**
- Webhook secret doğru mu kontrol edin
- Stripe Dashboard'dan webhook signing secret'ı kopyalayın
- `npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

### Problem 3: Frontend'de "Ödeme sistemi yüklenemedi" hatası

**Çözüm:**
- `.env` dosyasında `VITE_STRIPE_PUBLISHABLE_KEY` doğru mu?
- Development server'ı yeniden başlatın: `npm run dev`

### Problem 4: Ödeme sonrası premium aktif olmuyor

**Çözüm:**
- Webhook çalışıyor mu? → Stripe Dashboard → Webhooks → Events
- Database'de `is_premium` kolonu var mı?
- Edge function loglarını kontrol edin

---

## 🎯 Production'a Geçiş

Test ortamında her şey çalıştıktan sonra:

### 1. Stripe Production Keys Alın

[Stripe Dashboard](https://dashboard.stripe.com/) → **Developers** → **API keys**
- Live keys'i aktif edin (Production moda geçiş gerekebilir)
- `pk_live_...` ve `sk_live_...` keylerini alın

### 2. Production Price Oluşturun

1. **Products** → **Add product**
2. Name: "EventMap Premium"
3. Pricing: €3.99 / month
4. **Save** → Price ID'yi kopyalayın (price_...)

### 3. Secrets Güncelleyin

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_LIVE_SECRET
```

### 4. .env Güncelleyin

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_MONTHLY=price_LIVE_PRICE_ID
```

### 5. Webhook URL Güncelleyin

Stripe'da production webhook endpoint ekleyin.

---

## ✅ Checklist

Test için:
- [ ] Stripe test keys alındı (pk_test, sk_test)
- [ ] `.env` dosyasına VITE_STRIPE_PUBLISHABLE_KEY eklendi
- [ ] Supabase secrets set edildi (4 adet)
- [ ] Edge functions deploy edildi (2 adet)
- [ ] Database'e premium kolonları eklendi
- [ ] Stripe webhook endpoint eklendi
- [ ] Test kartı ile ödeme yapıldı
- [ ] Premium aktif oldu mu kontrol edildi

Production için:
- [ ] Stripe live keys alındı
- [ ] Production price oluşturuldu
- [ ] Secrets production keys ile güncellendi
- [ ] .env production keys ile güncellendi
- [ ] Webhook production URL ile yapılandırıldı

---

## 📞 Destek

Sorun yaşarsanız:
1. Edge function loglarını kontrol edin
2. Stripe Dashboard → Events → Failed events
3. Browser console hatalarını kontrol edin

---

**Hazırlayan:** Claude Code
**Tarih:** 2025-11-09
