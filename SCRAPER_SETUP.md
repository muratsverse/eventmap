# Web Scraper Kurulum Rehberi

EventMap için Biletix, Bubilet ve Biletinial'dan otomatik etkinlik çekme sistemi.

## 🎯 Genel Bakış

Web scraper Supabase Edge Functions kullanarak çalışır:
- **Serverless**: Ayrı backend sunucuya gerek yok
- **Ücretsiz**: Aylık 500,000 istek limiti
- **CORS sorunsuz**: Backend'den scraping yapılır
- **Otomatik**: Cron job ile periyodik çalıştırma

## 📦 Gereksinimler

1. Supabase CLI kurulumu
2. Deno runtime (otomatik kurulur)
3. Supabase projesi

## 🚀 Kurulum Adımları

### 1. Supabase CLI Kurulumu

#### Windows:
```powershell
# Chocolatey ile
choco install supabase

# veya Scoop ile
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### macOS:
```bash
brew install supabase/tap/supabase
```

#### Linux:
```bash
# Doğrudan binary indir
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

### 2. Supabase Login

```bash
supabase login
```

Tarayıcıda açılan sayfadan token alıp terminale yapıştırın.

### 3. Proje Bağlantısı

Proje klasöründe:

```bash
cd "c:\Users\murat\OneDrive\Masaüstü\Eventmap"
supabase link --project-ref zktzpwuuqdsfdrdljtoy
```

Database şifrenizi girmeniz istenecek.

### 4. Edge Function Deploy

```bash
supabase functions deploy scrape-events
```

Bu komut:
- Edge function'ı Supabase'e yükler
- HTTPS endpoint oluşturur
- Environment variables'ı otomatik ayarlar

### 5. Test Etme

Edge function deploy olduktan sonra:

```bash
# Test call
supabase functions invoke scrape-events --method POST
```

## 🔧 Kullanım

### Manuel Çalıştırma (Frontend'den)

```typescript
import { useScraper } from '@/hooks/useScraper';

function AdminPanel() {
  const { scrapeEvents, isScraping, result } = useScraper();

  const handleScrape = async () => {
    const result = await scrapeEvents();
    console.log('Scraped:', result.stats);
  };

  return (
    <button onClick={handleScrape} disabled={isScraping}>
      {isScraping ? 'Çekiliyor...' : 'Etkinlikleri Çek'}
    </button>
  );
}
```

### Otomatik Çalıştırma (Cron Job)

Supabase Dashboard > Database > Cron Jobs:

```sql
-- Her gün saat 03:00'te çalıştır
SELECT cron.schedule(
  'scrape-events-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zktzpwuuqdsfdrdljtoy.supabase.co/functions/v1/scrape-events',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_ANON_KEY',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

## 📊 Monitoring

### Logs Görüntüleme

```bash
supabase functions logs scrape-events
```

### Dashboard'dan İzleme

1. Supabase Dashboard > Edge Functions
2. `scrape-events` fonksiyonuna tıklayın
3. "Logs" sekmesini açın
4. Real-time logları görün

## 🔐 Environment Variables

Edge function otomatik olarak şu değişkenlere erişebilir:

- `SUPABASE_URL`: Proje URL'i
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (otomatik inject edilir)

Ekstra değişken eklemek için:

```bash
supabase secrets set MY_SECRET=value
```

## 🐛 Troubleshooting

### "Function not found" hatası

```bash
# Function'ları listele
supabase functions list

# Tekrar deploy et
supabase functions deploy scrape-events
```

### CORS hatası

Edge function'dan scraping yapıyorsanız CORS sorunu olmaz. Frontend'den direkt fetch yapmayın.

### Rate limiting

Web siteleri rate limit koyabilir:
- User-Agent header kullanın
- İstekler arasında delay ekleyin
- Proxy servisleri kullanın (ScraperAPI, Apify)

### Parser hatası

Gerçek HTML parsing için:

```typescript
// Deno DOM parser
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'

const doc = new DOMParser().parseFromString(html, 'text/html')
const title = doc.querySelector('.event-title')?.textContent
```

## 💰 Maliyetler

Supabase Free Tier:
- ✅ 500,000 Edge Function invocations/ay
- ✅ 2GB veri transferi
- ✅ Unlimited read operations

Fazlası için Pro plan ($25/ay).

## 🔄 Gerçek Scraping İmplementasyonu

Şu anda mock data kullanılıyor. Gerçek scraping için:

1. Her platform için HTML selector'ları belirleyin
2. Deno DOM parser kullanın
3. Rate limiting ekleyin
4. Error handling güçlendirin

Örnek:

```typescript
async function scrapeBiletix(): Promise<ScrapedEvent[]> {
  const response = await fetch('https://www.biletix.com/...')
  const html = await response.text()

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const eventCards = doc.querySelectorAll('.event-card')

  return Array.from(eventCards).map(card => ({
    title: card.querySelector('.title')?.textContent || '',
    // ... diğer alanlar
  }))
}
```

## 📚 Daha Fazla Bilgi

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime](https://deno.land/)
- [Web Scraping Best Practices](https://www.scrapingbee.com/blog/web-scraping-best-practices/)

## 🎉 Özet

Artık sisteminiz:
- ✅ Biletix, Bubilet, Biletinial'dan etkinlik çekebilir
- ✅ Otomatik olarak veritabanına ekler
- ✅ Cron job ile günlük çalıştırılabilir
- ✅ Frontend'den manuel tetiklenebilir

**Not**: Mock data kullanıyor, production için gerçek HTML parsing ekleyin!
