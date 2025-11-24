# 🚀 Hızlı Başlangıç: Ödeme ve Reklam Sistemi

EventMap'in monetization sistemini **5 adımda** aktif hale getir!

---

## ⚡ Hızlı Özet

### Ne Yaptık?
✅ Stripe ödeme sistemi entegre edildi (komisyon bazlı, aylık ücret yok)
✅ Google AdSense reklam sistemi hazır
✅ Supabase Edge Functions oluşturuldu
✅ Premium quota sistemi çalışıyor

### Ne Yapman Gerekiyor?
1. Stripe hesabı aç ve API key'leri al (5 dk)
2. Google AdSense hesabı aç (10 dk + onay süresi)
3. `.env` dosyasını doldur (2 dk)
4. Supabase functions'ları deploy et (5 dk)
5. Test et! (5 dk)

**Toplam Süre**: ~30 dakika + AdSense onayı (1-3 gün)

---

## 📋 5 ADIMDA KURULUM

### 1️⃣ Stripe Kurulumu (5 dakika)

1. **Hesap Aç**: https://dashboard.stripe.com/register
2. **API Keys Al**:
   - Dashboard > Developers > API keys
   - `Publishable key` (pk_test_...) kopyala
   - `Secret key` (sk_test_...) kopyala
3. **Products Oluştur**:
   - Dashboard > Products > Add Product
   - **Aylık**: ₺49/month → Price ID'yi kopyala
   - **Yıllık**: ₺399/year → Price ID'yi kopyala

### 2️⃣ Google AdSense Kurulumu (10 dakika)

1. **Hesap Aç**: https://www.google.com/adsense
2. **Domain Ekle**: `yourdomain.com`
3. **Ad Units Oluştur**:
   - Ads > Display ads > Create
   - **Horizontal** ad unit → Slot ID kopyala
   - **Square** ad unit → Slot ID kopyala
4. **Client ID Al**: `ca-pub-XXXXXXXXXXXXXXXX`

> ⚠️ AdSense onayı 1-3 gün sürebilir. Bu süre zarfında mock reklamlar gösterilecek.

### 3️⃣ Environment Variables (.env)

`.env` dosyasını aç ve şu satırları doldur:

```bash
# Stripe (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
VITE_STRIPE_PRICE_MONTHLY=price_1ABC123monthly...
VITE_STRIPE_PRICE_YEARLY=price_1ABC123yearly...

# Google AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_HORIZONTAL=1234567890
VITE_ADSENSE_SLOT_SQUARE=0987654321
```

### 4️⃣ Supabase Edge Functions Deploy (5 dakika)

```bash
# Supabase CLI kur (eğer yoksa)
npm install -g supabase

# Login
npx supabase login

# Project'i bağla
npx supabase link --project-ref zktzpwuuqdsfdrdljtoy

# Secrets ekle
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51ABC...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_ABC...  # Aşağıda anlatılıyor
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Functions'ları deploy et
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
```

**Webhook Secret Nereden Alınır?**
1. Stripe Dashboard > Developers > Webhooks > Add endpoint
2. URL: `https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/stripe-webhook`
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`
4. Add endpoint → Signing secret'i kopyala

### 5️⃣ Test Et! (5 dakika)

1. **Dev server'ı çalıştır**:
   ```bash
   npm run dev
   ```

2. **Premium Modal'ı Test Et**:
   - Uygulamada giriş yap
   - Profil > Premium'a Geç
   - Bir plan seç
   - Stripe test kartı: `4242 4242 4242 4242`, CVC: `123`, Date: `12/34`
   - Ödeme yap
   - Success sayfasına döneceksin

3. **Supabase'de Kontrol Et**:
   - Supabase Dashboard > Table Editor > profiles
   - Senin profile'ın `is_premium` = `true` olmalı

4. **Reklamları Test Et**:
   - Premium olmayan bir hesapla giriş yap
   - Liste, harita ve detay sayfalarında reklamları göreceksin
   - Premium yap > Reklamlar kaybolacak

---

## 🎯 PRODUCTION'A GEÇIŞ

Test ettikten sonra production'a geçmek için:

### 1. Stripe Live Mode
```bash
# .env dosyasında
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...  # pk_test yerine pk_live
VITE_STRIPE_PRICE_MONTHLY=price_live_monthly...
VITE_STRIPE_PRICE_YEARLY=price_live_yearly...

# Supabase secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_live...
```

### 2. Stripe Webhook (Live Mode)
- Stripe Dashboard'da Live Mode'a geç
- Webhook'u live mode'da yeniden oluştur
- Signing secret'i güncelle

### 3. AdSense
```bash
# .env dosyasında
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX  # Live client ID

# index.html'de comment'i kaldır
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### 4. Deploy
```bash
npm run build
# Build output'u hosting'e yükle (Vercel, Netlify, vs.)
```

---

## 📊 GELİR TAKİBİ

### Stripe Dashboard
- Dashboard > **Payments** → Tüm ödemeler
- Dashboard > **Customers** → Müşteri listesi
- Dashboard > **Subscriptions** → Aktif abonelikler

### AdSense Dashboard
- **Home** → Günlük gelir özeti
- **Reports** → Detaylı istatistikler
- **Optimization** → Gelir artırma önerileri

---

## 🔧 SORUN GİDERME

### "Ödeme çalışmıyor"
1. `.env` dosyasında Stripe key'leri doğru mu?
2. Supabase functions deploy edildi mi?
3. Browser console'da hata var mı?

### "Webhook çalışmıyor"
1. Stripe Dashboard > Webhooks > Logs → Hataları kontrol et
2. Webhook URL doğru mu?
3. Webhook secret Supabase'e eklendi mi?

### "Premium açılmıyor"
1. Supabase > Logs > Edge Functions → Hataları kontrol et
2. `profiles` tablosuna `stripe_customer_id`, `stripe_subscription_id` alanları eklendi mi?
3. Webhook event'leri Stripe'dan geldi mi?

### "Reklamlar gösterilmiyor"
1. AdSense hesabı onaylandı mı?
2. `.env` dosyasında client ID var mı?
3. Ad blocker kapalı mı?

---

## 📚 Detaylı Dokümantasyon

Daha fazla detay için:
- **[PAYMENT_AND_ADS_SETUP.md](PAYMENT_AND_ADS_SETUP.md)** - Kapsamlı kurulum rehberi
- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Tüm özellikler listesi
- **[FEATURE_INTEGRATION_GUIDE.md](FEATURE_INTEGRATION_GUIDE.md)** - Kod örnekleri

---

## ✅ CHECKLIST

Kurulum tamamlandı mı?

### Stripe
- [ ] Hesap oluşturuldu
- [ ] API keys alındı
- [ ] Products oluşturuldu (Aylık + Yıllık)
- [ ] Price IDs `.env`'e eklendi
- [ ] Webhook ayarlandı
- [ ] Supabase secrets eklendi
- [ ] Functions deploy edildi
- [ ] Test kartıyla ödeme yapıldı
- [ ] Profile'da premium açıldığı görüldü

### AdSense
- [ ] Hesap oluşturuldu
- [ ] Domain eklendi
- [ ] Ad units oluşturuldu (Horizontal + Square)
- [ ] Client ID ve Slot IDs `.env`'e eklendi
- [ ] index.html'e script eklendi (comment kaldırıldı)
- [ ] Premium olmayan kullanıcıyla reklamlar test edildi

### Database
- [ ] `PREMIUM_AND_QUOTA_SETUP.sql` çalıştırıldı
- [ ] `profiles` tablosunda premium alanları var
- [ ] Quota sistemi çalışıyor (premium olmayan 2. etkinliği oluşturamıyor)

### Frontend
- [ ] Dev server çalışıyor
- [ ] Premium modal açılıyor
- [ ] Stripe Checkout'a yönlendiriliyor
- [ ] Reklamlar görünüyor (premium olmayanlara)
- [ ] Reklamlar gözükmüyor (premium üyelere)

---

## 🎉 Tebrikler!

EventMap artık **tam fonksiyonel bir monetization platformu**! 🚀

### Şimdi Ne Yapmalısın?

1. **Kullanıcı Topla**: Sosyal medya, SEO, influencer marketing
2. **A/B Test Yap**: Fiyatları test et (₺49 vs ₺59?)
3. **Analytics Ekle**: Google Analytics, Mixpanel
4. **Email Marketing**: Kullanıcılara premium avantajlarını anlat
5. **Content Marketing**: Blog yazıları, etkinlik rehberleri

### Başarı İpuçları

- 💰 **Premium conversion**: Hedef %2-5
- 📊 **Ad revenue**: CPM optimize et ($1-4)
- 🎯 **User retention**: Premium üyeler %80+ retention
- 📈 **Growth**: Viral loop oluştur (etkinlik paylaşımları)

---

İyi kazançlar! 💸

Sorularınız için: [PAYMENT_AND_ADS_SETUP.md](PAYMENT_AND_ADS_SETUP.md)
