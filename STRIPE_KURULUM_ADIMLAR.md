# Stripe Premium Kurulum - Adım Adım

## ✅ Hazır Olanlar
- ✅ .env dosyası güncel (Publishable Key eklendi)
- ✅ Edge Functions kodları hazır
- ✅ Frontend kodu hazır

---

## 🔧 ADIM 1: Supabase CLI Kur ve Giriş Yap

### Terminal'i açın (PowerShell veya CMD)

```bash
# 1. Supabase CLI'yi global olarak kurun
npm install -g supabase

# 2. Kurulum kontrolü
supabase --version
```

Eğer version görüyorsanız ✅ devam edin.

---

## 🔐 ADIM 2: Supabase'e Giriş Yapın

```bash
# Supabase'e login olun
npx supabase login
```

- Browser açılacak
- Supabase hesabınızla giriş yapın
- Terminal'de "Logged in successfully" göreceksiniz

---

## 🔗 ADIM 3: Projeyi Bağlayın

```bash
# Project Reference ID: zktzpwuuqdsfdrdljtoy (URL'inizden aldık)
npx supabase link --project-ref zktzpwuuqdsfdrdljtoy
```

Şifrenizi sorarsa Supabase database şifrenizi girin.

---

## 🔑 ADIM 4: Secrets Ayarlayın

Her komutu **TEK TEK** çalıştırın:

```bash
# 1. Stripe Secret Key
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51SRCsSCOalGPl2j7467BSDo1xJHfJ8Xz6sMhNCp06VQxFzCJBo4NM2RsyqsSrWvA0PWu4l2HOIEswBgwh5Zn2h0800cl9wsoAx
```

Bekleyin, "Successfully set secret" göreceksiniz ✅

```bash
# 2. Webhook Secret
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh
```

✅ Başarılı

```bash
# 3. Service Role Key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sbp_ca670cfe3c94701e0e0d81a604f47ae6b6e8922a
```

✅ Başarılı

```bash
# 4. Supabase URL
npx supabase secrets set SUPABASE_URL=https://zktzpwuuqdsfdrdljtoy.supabase.co
```

✅ Başarılı - 4 secret ayarlandı!

---

## 🚀 ADIM 5: Edge Functions Deploy Edin

Şimdi 2 Edge Function deploy edeceğiz:

```bash
# 1. Checkout Session Function
npx supabase functions deploy create-checkout-session
```

Bekleyin... Deploy tamamlanınca şöyle bir URL göreceksiniz:
```
✅ https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/create-checkout-session
```

```bash
# 2. Webhook Handler Function
npx supabase functions deploy stripe-webhook
```

Deploy tamamlanınca şöyle bir URL göreceksiniz:
```
✅ https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/stripe-webhook
```

**ÖNEMLİ:** Bu ikinci URL'i (stripe-webhook) kopyalayın! Stripe'da kullanacağız.

---

## 🗄️ ADIM 6: Database Güncelleyin

1. [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**'a gidin
2. "New query" tıklayın
3. Şu SQL'i yapıştırın:

```sql
-- Premium kolonlarını ekle
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer
  ON profiles(stripe_customer_id);
```

4. **RUN** butonuna basın
5. "Success. No rows returned" göreceksiniz ✅

---

## 🔗 ADIM 7: Stripe Webhook Ekleyin

1. [Stripe Dashboard](https://dashboard.stripe.com/) → Giriş yapın
2. Sol menüden **Developers** → **Webhooks** tıklayın
3. Sağ üstten **Add endpoint** butonuna basın

### Webhook URL'i girin:
```
https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/stripe-webhook
```

### Events seçin:

**"Select events"** butonuna basın, şunları seçin:

✅ `checkout.session.completed`
✅ `customer.subscription.deleted`
✅ `customer.subscription.updated`
✅ `invoice.payment_failed`

### Add endpoint tıklayın

**ÖNEMLİ:** Webhook eklendikten sonra **Signing secret** (whsec_...) gösterilecek.

Eğer bu yeni secret **farklıysa** (mevcut: whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh):

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=yeni_whsec_değeri
```

---

## 🧪 ADIM 8: Test Edin

1. **Development server'ı yeniden başlatın:**

```bash
# Mevcut npm run dev'i durdurun (Ctrl+C)
# Sonra yeniden başlatın:
npm run dev
```

2. **Tarayıcıda açın:** http://localhost:5173

3. **Giriş yapın** (veya yeni hesap oluşturun)

4. **Premium'a Geç** butonuna basın

5. **Test kartı kullanın:**
   - Kart numarası: `4242 4242 4242 4242`
   - CVC: `123`
   - Tarih: `12/34` (gelecekte herhangi bir tarih)
   - İsim: Herhangi bir isim

6. **Complete payment** tıklayın

7. Ödeme tamamlanınca otomatik geri döneceksiniz

8. **Profil sayfanızı kontrol edin** - Premium badge görmelisiniz!

---

## ✅ Kontrol Listesi

Her adımı tamamladıkça işaretleyin:

- [ ] Supabase CLI kuruldu
- [ ] Supabase'e giriş yapıldı
- [ ] Proje bağlandı (link)
- [ ] 4 secret ayarlandı
- [ ] create-checkout-session deploy edildi
- [ ] stripe-webhook deploy edildi
- [ ] Database güncellendi (SQL çalıştırıldı)
- [ ] Stripe webhook endpoint eklendi
- [ ] Development server yeniden başlatıldı
- [ ] Test kartı ile ödeme yapıldı
- [ ] Premium aktif oldu ✅

---

## ❌ Sorun Giderme

### "command not found: supabase"
```bash
npm install -g supabase
```

### "Error: Project not linked"
```bash
npx supabase link --project-ref zktzpwuuqdsfdrdljtoy
```

### "Webhook 400 hatası veriyor"
- Webhook secret'ı kontrol edin
- Stripe Dashboard'dan doğru secret'ı kopyalayın
- `npx supabase secrets set STRIPE_WEBHOOK_SECRET=...` ile güncelleyin

### "Premium aktif olmuyor"
1. Stripe Dashboard → Webhooks → Events kontrol edin
2. `checkout.session.completed` eventi geldi mi?
3. Edge function loglarını kontrol edin:
```bash
npx supabase functions logs stripe-webhook
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Terminal hatalarını kopyalayın
2. Stripe Dashboard → Webhooks → Events → Failed events kontrol edin
3. Browser console'u kontrol edin (F12)

---

**Hazırlayan:** Claude Code
**Tarih:** 2025-11-09
**Proje:** EventMap
