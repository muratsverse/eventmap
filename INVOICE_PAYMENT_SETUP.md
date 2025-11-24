# Invoice Payment (Faturaya Yansıt) Kurulum Rehberi

## 🎯 Özet

"Faturaya Yansıt" özelliği kullanıcıların kredi kartı girişi yapmadan email ile fatura almasını ve ödeme linkine tıklayarak ödeme yapmasını sağlar.

---

## 📋 Özellikler

✅ Email ile otomatik fatura gönderimi
✅ 7 gün içinde ödeme yapılabilir
✅ Kredi kartı bilgisi gerektirmez
✅ Stripe'ın güvenli hosted invoice sayfası
✅ Otomatik hatırlatma emailleri

---

## 🛠️ Backend Kurulumu (Supabase Edge Function)

### 1. Edge Function Deploy Et

Edge function zaten oluşturuldu: `supabase/functions/create-invoice-session/index.ts`

Deploy etmek için:

```bash
# Supabase CLI ile deploy
npx supabase functions deploy create-invoice-session --no-verify-jwt

# Veya Supabase Dashboard'dan:
# 1. Dashboard → Functions → Deploy new function
# 2. Function name: create-invoice-session
# 3. index.ts içeriğini kopyala yapıştır
# 4. Deploy
```

### 2. Environment Variables Kontrol Et

Supabase Dashboard → Settings → Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_live_... (veya sk_test_...)
SUPABASE_URL=https://zktzpwuuqdsfdrdljtoy.supabase.co
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Stripe Dashboard Ayarları

### 1. Invoice Settings

Stripe Dashboard → Settings → Invoices:

- ✅ **Send emails**: Enabled
- ✅ **Reminder emails**: 3 days before due date
- ✅ **Overdue emails**: Enabled
- ✅ **Collect tax IDs**: Optional (müşteri bilgisi için)

### 2. Email Template Customization

Stripe Dashboard → Settings → Emails → Invoices:

- **Invoice finalized email**: Customize (opsiyonel)
- **Invoice reminder email**: Customize (opsiyonel)
- **Add your logo**: EventMap logosu ekle

### 3. Payment Methods

Stripe Dashboard → Settings → Payment methods:

Invoice için desteklenen ödeme metodları:
- ✅ Cards (kredi/banka kartı)
- ✅ Bank transfers (SEPA, ACH)
- ✅ iDEAL (Hollanda)
- ✅ Bancontact (Belçika)

---

## 💻 Frontend Kullanımı

### Premium Modal'de Ödeme Metodu Seçimi

```typescript
const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');

const handlePurchase = async (priceId: string) => {
  const endpoint = paymentMethod === 'invoice'
    ? 'create-invoice-session'
    : 'create-checkout-session';

  const functionUrl = `${supabaseUrl}/functions/v1/${endpoint}`;

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      priceId,
      userId: user.id,
      userEmail: user.email,
      paymentMethod,
    }),
  });

  const data = await response.json();

  if (paymentMethod === 'invoice') {
    alert(`Fatura email adresinize gönderildi: ${user.email}`);
  } else {
    window.location.href = data.url;
  }
};
```

---

## 📧 Müşteri Deneyimi

### 1. Kullanıcı "Faturaya Yansıt" Seçer

- Premium Modal'de "Faturaya Yansıt" butonuna tıklar
- "Fatura Gönder" butonuna tıklar

### 2. Backend Fatura Oluşturur

- Müşteri yoksa Stripe'da oluşturulur
- Invoice item oluşturulur (€3.99/ay)
- Invoice finalize edilir
- Email otomatik gönderilir

### 3. Müşteri Email Alır

Email'de:
- Fatura detayları (€3.99/ay)
- Ödeme linki ("View and Pay Invoice")
- Vade tarihi (7 gün)
- EventMap logosu ve bilgileri

### 4. Müşteri Ödeme Yapar

- Email'deki linke tıklar
- Stripe'ın hosted invoice sayfası açılır
- Kart bilgilerini girer veya banka transferi seçer
- Ödeme tamamlanır

### 5. Webhook Premium Aktif Eder

- `invoice.paid` event gelir
- Webhook user'ı premium yapar
- Müşteri uygulamada premium özelliklere erişir

---

## 🧪 Test Etme

### Test Senaryosu 1: Invoice Gönderimi

1. Localhost'ta uygulamayı çalıştır
2. Giriş yap veya kayıt ol
3. Premium'a Geç modalını aç
4. "Faturaya Yansıt" seç
5. "Fatura Gönder"e tıkla
6. Console'da şu log'ları gör:
   ```
   🔄 Ödeme isteği gönderiliyor: { endpoint: "create-invoice-session", ... }
   ✅ Başarılı yanıt: { success: true, invoiceId: "in_...", ... }
   ```
7. Email kutunu kontrol et (Stripe test mode'da gerçek email gönderir!)

### Test Senaryosu 2: Test Kartı ile Ödeme

Email'deki linke tıklayıp Stripe test kartlarını kullan:

**Başarılı Ödeme:**
```
4242 4242 4242 4242
12/34
123
```

**Başarısız Ödeme:**
```
4000 0000 0000 0002
12/34
123
```

---

## ⚠️ Önemli Notlar

### 1. Production'da Test Etme

Test mode'dan live mode'a geçerken:
- ✅ Stripe secret key'i live'a çevir
- ✅ Webhook URL'ini production URL ile değiştir
- ✅ Price ID'leri live price ID'lere çevir

### 2. Vergi ve Fatura Bilgileri

Türkiye'de işletme ise:
- Stripe Dashboard → Settings → Business details
- Vergi numarası ve adres ekle
- Invoice'larda otomatik görünür

### 3. Email Deliverability

Email'lerin spam'e düşmemesi için:
- Stripe Dashboard'da doğrulanmış domain kullan
- SPF, DKIM ayarları yapılandır
- Test emaillerini ilk önce kendi adresine gönder

---

## 🎯 Avantajları vs Dezavantajları

### ✅ Avantajlar:
- Anında kart bilgisi gerektirmez
- Müşteri istediği zaman ödeyebilir
- Banka transferi gibi alternatif ödeme metodları
- Profesyonel fatura görünümü
- Otomatik hatırlatmalar

### ⚠️ Dezavantajlar:
- Anında aktif olmaz (ödeme bekler)
- 7 gün içinde ödenmezse expired olur
- Manual takip gerektirebilir
- Kart ödemesinden daha az conversion rate

---

## 📊 Karşılaştırma

| Özellik | Kredi Kartı | Faturaya Yansıt |
|---------|-------------|-----------------|
| Anında aktif | ✅ Evet | ❌ Ödeme sonrası |
| Kart bilgisi | ✅ Gerekli | ❌ Gerekmez |
| Ödeme süresi | Anında | 7 güne kadar |
| Ödeme metodları | Sadece kart | Kart, banka, iDEAL |
| Email gönderimi | ❌ Hayır | ✅ Evet |
| Profesyonel görünüm | Stripe Checkout | Hosted Invoice |

---

## 🔗 Faydalı Linkler

- [Stripe Invoice API Docs](https://stripe.com/docs/invoicing)
- [Stripe Hosted Invoice](https://stripe.com/docs/invoicing/hosted-invoice-page)
- [Invoice Email Customization](https://stripe.com/docs/invoicing/customize-email)

---

## ✅ Kurulum Checklist

- [x] Edge function oluşturuldu (`create-invoice-session`)
- [ ] Edge function deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Stripe Invoice settings aktif edildi
- [ ] Email template customize edildi (opsiyonel)
- [ ] Test email gönderildi ve alındı
- [ ] Test kartı ile ödeme yapıldı
- [ ] Webhook `invoice.paid` event'i test edildi
- [ ] Production'da test edildi

Tüm adımlar tamamlandığında invoice payment sistemi kullanıma hazır! 🎉
