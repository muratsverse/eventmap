# API Entegrasyonları Kurulum Rehberi

EventMap uygulaması için tüm API entegrasyonlarının kurulum talimatları.

## 📋 Genel Bakış

EventMap şu kaynaklardan etkinlik çeker:

| Platform | API Durumu | Maliyet | Öncelik |
|----------|------------|---------|---------|
| **Ticketmaster** | ✅ Resmi API | Ücretsiz | Yüksek |
| **Eventbrite** | ✅ Resmi API | Ücretsiz | Yüksek |
| **GetYourGuide** | ✅ Partner API | Ücretsiz (başvuru gerekli) | Orta |
| **Etkinlik.io** | ✅ REST API | Ücretli | Orta |
| **Facebook Events** | ⚠️ Kısıtlı | Ücretsiz | Düşük |
| **Instagram** | ⚠️ Kısıtlı | Ücretsiz | Düşük |
| **Web Scraping** | 🔧 Custom | Ücretsiz | Orta |

## 🔑 API Key Alma

### 1. Ticketmaster API

**Durum**: ✅ Halihazırda kodda var

**Başvuru**: https://developer.ticketmaster.com/

**Adımlar**:
1. Ticketmaster Developer hesabı oluşturun
2. Yeni uygulama ekleyin
3. Consumer Key'i kopyalayın
4. `.env` dosyasına ekleyin:
   ```
   VITE_TICKETMASTER_API_KEY=your_key_here
   ```

**Rate Limits**: 5000 request/gün

**Örnek Kullanım**:
```typescript
import { EventAPIService } from '@/services/eventApis';

const apiService = new EventAPIService();
const events = await apiService.fetchAllEvents();
```

---

### 2. Eventbrite API

**Durum**: ✅ Halihazırda kodda var

**Başvuru**: https://www.eventbrite.com/platform/

**Adımlar**:
1. Eventbrite hesabı oluşturun
2. "Account Settings" > "Developer Links" > "API Keys"
3. "Create API Key" tıklayın
4. Private Token'ı kopyalayın
5. `.env` dosyasına ekleyin:
   ```
   VITE_EVENTBRITE_API_KEY=your_private_token
   ```

**Rate Limits**: Tier'a göre değişir (standart: 1000/hour)

---

### 3. GetYourGuide API

**Durum**: ✅ Kod eklendi

**Başvuru**: https://partner.getyourguide.com/

**Adımlar**:
1. Partner Portal'a kaydolun
2. "Apply for API Access" formunu doldurun
3. Şirket bilgilerinizi ve use case'inizi açıklayın
4. Onay bekleyin (2-4 hafta)
5. API key aldıktan sonra `.env`'ye ekleyin:
   ```
   VITE_GETYOURGUIDE_API_KEY=your_api_key
   ```

**Maliyetler**: Ücretsiz (commission-based model)

**Rate Limits**: Tier'a göre değişir

**Kullanım**:
```typescript
import { getyourguideAPI } from '@/services/getyourguideApi';

const activities = await getyourguideAPI.fetchTurkishActivities();
```

---

### 4. Etkinlik.io API

**Durum**: ✅ Kod eklendi

**Başvuru**: https://etkinlik.io/api/bilgi veya https://rapidapi.com/etkinlik

**Adımlar**:

#### Option A: Direkt Başvuru
1. support@etkinlik.io'ya mail atın
2. Use case'inizi açıklayın
3. API token alın

#### Option B: RapidAPI (Önerilen)
1. RapidAPI hesabı oluşturun
2. "Etkinlik" API'sini arayın
3. Plan seçin (Basic: $0, Pro: $XX/ay)
4. API Key'i kopyalayın

**Ekleme**:
```env
VITE_ETKINLIKIO_API_TOKEN=your_token_here
```

**Rate Limits**: Plan'a göre

**Kullanım**:
```typescript
import { etkinlikioAPI } from '@/services/etkinlikioApi';

const events = await etkinlikioAPI.fetchAllTurkishEvents();
```

---

### 5. Facebook Events API

**Durum**: ⚠️ Kısıtlı (2018'den beri public search yok)

**Başvuru**: https://developers.facebook.com/

**Önemli**: Facebook, public event search API'sini kaldırdı. Sadece şunlara erişebilirsiniz:
- Yönettiğiniz sayfaların etkinlikleri
- Davet edildiğiniz etkinlikler
- Kendi oluşturduğunuz etkinlikler

**Adımlar**:
1. Facebook Developer hesabı oluşturun
2. Yeni uygulama oluşturun
3. "Facebook Login" ürünü ekleyin
4. Access Token alın (User Token veya Page Token)
5. `.env`'ye ekleyin:
   ```
   VITE_FACEBOOK_ACCESS_TOKEN=your_access_token
   ```

**Alternatif**:
- Event organizer'larla ortaklık yapın
- Sayfa yöneticisi olmalarını isteyin

**Kullanım**:
```typescript
import { facebookEventsAPI } from '@/services/facebookEventsApi';

// Sadece yönettiğiniz sayfalar için
const events = await facebookEventsAPI.getPageEvents('page_id');
```

---

### 6. Instagram API

**Durum**: ⚠️ Event API yok

**Başvuru**: https://developers.facebook.com/docs/instagram-basic-display-api

**Önemli**: Instagram'da özel "Events" API'si yok. Sadece:
- Authorize edilmiş kullanıcıların post'ları
- Hashtag bazlı arama (Business API'de)
- Caption parsing ile event tespiti

**Adımlar**:
1. Facebook Developer'da Instagram ürünü ekleyin
2. Instagram Basic Display veya Instagram Graph API seçin
3. Access Token alın
4. `.env`'ye ekleyin:
   ```
   VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token
   ```

**Önerilen**: Instagram yerine diğer platformlara odaklanın.

---

## 🔄 Unified Sync Kullanımı

Tüm API'lerden aynı anda etkinlik çekmek için:

```typescript
import { useEventSync } from '@/hooks/useEventSync';

function AdminPanel() {
  const { syncAll, isSyncing, stats } = useEventSync();

  const handleSync = async () => {
    const result = await syncAll();
    console.log(`${result.total} etkinlik eklendi`);
  };

  return (
    <button onClick={handleSync} disabled={isSyncing}>
      {isSyncing ? 'Senkronize Ediliyor...' : 'Tüm Etkinlikleri Çek'}
    </button>
  );
}
```

### Seçici Sync

Sadece belirli kaynaklardan çekmek için:

```typescript
const { syncSources } = useEventSync();

// Sadece Ticketmaster ve Eventbrite
await syncSources(['ticketmaster', 'eventbrite']);

// Sadece GetYourGuide
await syncSources(['getyourguide']);
```

---

## 🤖 Otomatik Sync (Cron Job)

### Supabase ile

SQL Editor'da:

```sql
-- Her gün saat 03:00'te çalıştır
SELECT cron.schedule(
  'sync-external-events',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-app.com/api/sync-events',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_TOKEN')
  );
  $$
);
```

### Vercel Cron ile

`vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync-events",
    "schedule": "0 3 * * *"
  }]
}
```

---

## 💰 Maliyet Analizi

| Platform | Ücretsiz Limit | Ücretli Plan | EventMap İhtiyacı |
|----------|----------------|--------------|-------------------|
| Ticketmaster | 5000/gün | Yok | ✅ Yeterli |
| Eventbrite | 1000/saat | Özel fiyat | ✅ Yeterli |
| GetYourGuide | Sınırsız | Commission | ✅ Ücretsiz |
| Etkinlik.io | Değişken | ~$50/ay | ⚠️ Gerekirse |
| Facebook | Ücretsiz | - | ⚠️ Kısıtlı |
| Instagram | Ücretsiz | - | ⚠️ Kısıtlı |

**Tavsiye**: Ticketmaster + Eventbrite + User-generated content ile başlayın.

---

## 🔒 Güvenlik

### API Key Saklama

✅ **YAPILMASI GEREKENLER**:
- API key'leri `.env` dosyasında saklayın
- `.env`'yi `.gitignore`'a ekleyin
- Backend'den API çağrısı yapın (mümkünse)

❌ **YAPILMAMASI GEREKENLER**:
- API key'leri frontend koduna hard-code etmeyin
- Public repo'ya key push'lamayın
- Client-side'dan direkt API çağrısı yapmayın (key görünür)

### Rate Limiting

Her API için rate limit kontrolü:

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 100, // max 100 request
});

app.use('/api/', apiLimiter);
```

---

## 🧪 Testing

### API Health Check

```typescript
import { unifiedEventSync } from '@/services/unifiedEventSync';

// Test all APIs
async function testAPIs() {
  const service = new unifiedEventSync();

  console.log('Testing Ticketmaster...');
  const tm = await service.syncTicketmaster();
  console.log(tm);

  console.log('Testing Eventbrite...');
  const eb = await service.syncEventbrite();
  console.log(eb);

  // ... diğer API'ler
}
```

### Mock Mode

Development'ta gerçek API çağrısı yapmadan test:

```typescript
if (import.meta.env.DEV) {
  // Mock data kullan
  return mockEvents;
}
```

---

## 📊 Monitoring

### Log Tracking

```typescript
// services/logger.ts
export function logAPICall(source: string, success: boolean, count: number) {
  const log = {
    timestamp: new Date().toISOString(),
    source,
    success,
    count,
  };

  // Supabase'e log kaydet
  await supabase.from('api_logs').insert(log);
}
```

### Dashboard

Supabase Dashboard'da API call stats görüntüleyin:

```sql
SELECT
  source,
  DATE(created_at) as date,
  COUNT(*) as total_calls,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  SUM(count) as total_events
FROM api_logs
GROUP BY source, DATE(created_at)
ORDER BY date DESC;
```

---

## 🎯 Öncelik Sırası

1. **İlk Adım**: Ticketmaster + Eventbrite (zaten var)
2. **İkinci Adım**: User-generated content (oluşturuldu)
3. **Üçüncü Adım**: GetYourGuide (tur/aktiviteler)
4. **Opsiyonel**: Etkinlik.io (ücretliyse gerekirse)
5. **İhmal Edilebilir**: Facebook/Instagram (çok kısıtlı)

---

## 🚀 Quick Start

### 1. Minimum Setup

```env
# .env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_TICKETMASTER_API_KEY=your_ticketmaster_key
VITE_EVENTBRITE_API_KEY=your_eventbrite_key
```

### 2. Sync Çalıştır

```bash
# Frontend'de
npm run dev
```

Tarayıcıda console'da:

```javascript
import { unifiedEventSync } from './src/services/unifiedEventSync';
const stats = await unifiedEventSync.syncAll();
console.log(stats);
```

### 3. Cron Job Kur

Supabase SQL Editor'da cron job oluşturun (yukarıda anlatıldı).

---

## 📚 Daha Fazla Bilgi

- [Ticketmaster API Docs](https://developer.ticketmaster.com/)
- [Eventbrite API Docs](https://www.eventbrite.com/platform/api)
- [GetYourGuide Partner API](https://code.getyourguide.com/partner-api-spec/)
- [Etkinlik.io on RapidAPI](https://rapidapi.com/etkinlik/api/etkinlik)

---

## 🎉 Özet

Artık EventMap:
- ✅ 6 farklı kaynaktan etkinlik çekebilir
- ✅ Unified sync service ile tek tıkla sync
- ✅ Otomatik cron job desteği
- ✅ Rate limiting ve error handling
- ✅ Comprehensive logging

**Sonraki Adımlar**:
1. API key'leri alın
2. .env dosyasını doldurun
3. Sync'i test edin
4. Cron job kurun
5. Production'a deploy edin

İyi çalışmalar! 🚀
