# 🚀 EventMap Production Deployment Rehberi

## 📋 ADIM 1: GitHub'a Yükle

### 1.1 Git Initialize ve Push

```bash
# Git başlat (henüz yapmadıysan)
git init

# Tüm dosyaları ekle (.gitignore otomatik ignore edecek)
git add .

# İlk commit
git commit -m "Production ready - EventMap v1.0"

# GitHub'da yeni repo oluştur: https://github.com/new
# Repo adı: eventmap

# Remote ekle (KULLANICI_ADIN yerine GitHub kullanıcı adını yaz)
git remote add origin https://github.com/KULLANICI_ADIN/eventmap.git

# Push
git branch -M main
git push -u origin main
```

---

## 📋 ADIM 2: Vercel'de Deploy

### 2.1 Web Üzerinden (EN KOLAY)

1. [https://vercel.com](https://vercel.com) → GitHub ile giriş yap
2. **New Project** butonuna tıkla
3. GitHub repository'ni seç: **eventmap**
4. **Import** tıkla

### 2.2 Environment Variables Ekle

**Vercel Dashboard → Project Settings → Environment Variables**

Şu değişkenleri ekle:

```env
VITE_SUPABASE_URL=https://zktzpwuuqdsfdrdljtoy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdHpwd3V1cWRzZmRyZGxqdG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzgxMjcsImV4cCI6MjA3NzYxNDEyN30.uUuVohzjtFzroEqxhc5hCHLWx3WDE0Nzk7tg2oB4170
VITE_TICKETMASTER_API_KEY=IkvdfAbaqoEvdAQwtGNDRBLHhfShJ55d
VITE_EVENTBRITE_API_KEY=52OTVYOXXUNPFVFRNX
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SRCsSCOalGPl2j7duoX0FvcGig0qi2gdhEU8TgF1fUMU2FT3PKyAZ4zS0lxsmG5fZfktZV0rdfGGjsGV1vB9zsD00mQzx4u2L
VITE_STRIPE_PRICE_MONTHLY=price_1SRCyZCOalGPl2j7dJOqK6wS
```

### 2.3 Deploy

**Deploy** butonuna bas → 2-3 dakika bekle

✅ **HAZIR!** URL alacaksın: `https://eventmap-xxxx.vercel.app`

---

## 📋 ADIM 3: Supabase URL Configuration

### 3.1 Vercel URL'i Ekle

1. [Supabase Dashboard](https://supabase.com/dashboard/project/zktzpwuuqdsfdrdljtoy/auth/url-configuration)
2. **URL Configuration** sayfasına git

**Site URL:**
```
https://eventmap-xxxx.vercel.app
```
(xxxx yerine kendi Vercel URL'in)

**Redirect URLs** ekle:
```
https://eventmap-xxxx.vercel.app/**
https://eventmap-xxxx.vercel.app/premium-success
https://eventmap-xxxx.vercel.app/premium-cancelled
```

**Save** butonuna bas

---

## 📋 ADIM 4: Test Production Deploy (Test Mode ile)

✅ **Şu anda:** Test mode Stripe ile production'da çalışıyor

Vercel URL'ine git → Test et:
- ✅ Giriş/Kayıt çalışıyor mu?
- ✅ Etkinlikler görünüyor mu?
- ✅ Premium buton çalışıyor mu?
- ✅ Test kartı (4242 4242 4242 4242) ile ödeme yapılıyor mu?

---

## 📋 ADIM 5: Stripe LIVE MODE'a Geçiş (Gerçek Ödemeler)

**⚠️ UYARI:** Bu adımdan sonra GERÇEK ödemeler alınacak!

### 5.1 Stripe Dashboard'da Live Mode Aç

1. [Stripe Dashboard](https://dashboard.stripe.com)
2. Sağ üstte **Test Mode** → **Live Mode** seç

### 5.2 Live API Keys Al

**Developers → API Keys:**

- **Publishable key kopyala:** `pk_live_...`
- **Secret key kopyala (Reveal):** `sk_live_...`

### 5.3 Live Product ve Price Oluştur

1. **Products** → **Create Product**
2. **Name:** Premium Üyelik
3. **Pricing:** €3.99 / month (recurring)
4. **Save**
5. **Price ID kopyala:** `price_1XXX...` (Live mode price ID)

### 5.4 Live Webhook Ekle

1. **Developers** → **Webhooks** → **Add Endpoint**
2. **Endpoint URL:**
   ```
   https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/stripe-webhook
   ```
3. **Select events:**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.payment_failed`
4. **Add Endpoint**
5. **Signing Secret kopyala:** `whsec_...`

---

## 📋 ADIM 6: Environment Variables Live Mode'a Güncelle

### 6.1 Vercel Environment Variables

**Vercel Dashboard → Project Settings → Environment Variables:**

**Güncelle:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXX (Adım 5.2'den aldığın)
VITE_STRIPE_PRICE_MONTHLY=price_1XXXXXX (Adım 5.3'den aldığın)
```

**Save** → **Redeploy** gerekebilir (Vercel otomatik redeploy yapar)

### 6.2 Supabase Secrets Güncelle

**Terminal'de:**

```bash
# Live Stripe Secret Key
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_XXXXXXXX --project-ref zktzpwuuqdsfdrdljtoy

# Live Webhook Secret
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX --project-ref zktzpwuuqdsfdrdljtoy
```

(XXXXXXXX yerine Adım 5'ten aldığın live key'leri yaz)

✅ **Secrets güncellendi!**

---

## 📋 ADIM 7: Production Test (GERÇEK ÖDEMELER)

⚠️ **DİKKAT:** Artık gerçek kartlarla ödeme alacaksın!

1. Vercel URL'ine git
2. Giriş yap
3. **Premium'a Geç** tıkla
4. **GERÇEK kart bilgilerini gir** (Test kartı çalışmaz!)
5. Ödeme yap → Premium badge gelmeli ✅

---

## 📋 ADIM 8: Custom Domain (İsteğe Bağlı)

### 8.1 Domain Satın Al

- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- Örnek: `eventmap.com` veya `eventmaps.com`

### 8.2 Vercel'de Domain Ekle

1. Vercel Dashboard → **Domains** → **Add Domain**
2. Domain adını gir: `eventmap.com`
3. DNS ayarlarını kopyala (Vercel vereceğit)

### 8.3 DNS Ayarları (Domain Satın Aldığın Yerde)

**A Record:**
```
Host: @
Value: 76.76.21.21 (Vercel IP)
```

**CNAME Record:**
```
Host: www
Value: cname.vercel-dns.com
```

### 8.4 Supabase URL'i Güncelle

Supabase Dashboard → URL Configuration:
```
https://eventmap.com
```

**Redirect URLs:**
```
https://eventmap.com/**
https://www.eventmap.com/**
```

---

## 📋 ADIM 9: Mobile App Hazırlığı (Gelecek Ay)

### iOS (Apple):
- **Apple Developer Account** gerekli ($99/yıl)
- **Capacitor** ile React web app → iOS native app
- **App Store** submission

### Android (Google):
- **Google Play Console** gerekli ($25 one-time)
- **Capacitor** ile React web app → Android native app
- **Play Store** submission

**Şimdilik:** Web app production'da, kullanıcılar browser'dan kullanabilir!

---

## ✅ Production Checklist

- [ ] GitHub'a push edildi
- [ ] Vercel'de deploy edildi
- [ ] Environment variables eklendi
- [ ] Supabase URL configuration güncellendi
- [ ] Production test edildi (Test Mode)
- [ ] Stripe Live Mode'a geçildi
- [ ] Live API keys eklendi
- [ ] Live webhook eklendi
- [ ] Gerçek ödeme test edildi
- [ ] (İsteğe Bağlı) Custom domain eklendi

---

## 🚨 Sorun Giderme

### "Unauthorized" Hatası
- Supabase URL configuration kontrol et
- Redirect URLs'leri ekle

### Stripe Ödeme Çalışmıyor
- Webhook URL doğru mu?
- Webhook secret doğru mu?
- Events seçili mi? (checkout.session.completed vb.)

### Premium Badge Gelmiyor
- Stripe Dashboard → Webhooks → Events → Failed events kontrol et
- Supabase Edge Function logs:
  ```bash
  npx supabase functions logs stripe-webhook --project-ref zktzpwuuqdsfdrdljtoy
  ```

---

## 📞 Destek

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs

---

**Hazırlayan:** Claude Code
**Tarih:** 2025-11-09
**Proje:** EventMap Production
**Status:** ✅ Ready for Production
