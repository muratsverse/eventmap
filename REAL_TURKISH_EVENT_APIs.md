# Gerçek Türk Etkinlik Platformları API Rehberi

## 🔍 API Bulmak İçin Yöntem

Her platform, web sitelerinde etkinlikleri göstermek için bir API kullanır. Bunu bulma yöntemi:

### 1. Tarayıcı DevTools ile API Bulma

1. **Chrome/Edge DevTools'u açın** (F12)
2. **Network** sekmesine gidin
3. **Fetch/XHR** filtresi seçin
4. İlgili sayfayı yükleyin
5. JSON dönen istekleri inceleyin

---

## 📋 Türk Platformların API Durumu

### Biletix (biletix.com)

**Durum:** ✅ JSON API var (public)

**API Endpoint Örneği:**
```
https://www.biletix.com/api/v1/events/search?city=Istanbul
```

**Test Etmek İçin:**
1. https://www.biletix.com/solr/tr/select adresine gidin
2. DevTools > Network'e bakın
3. `solr` veya `search` içeren istekleri inceleyin

**Örnek Request:**
```javascript
fetch('https://www.biletix.com/api/events', {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0',
  }
})
```

**Notlar:**
- CORS korumalı olabilir (proxy gerekebilir)
- Rate limiting olabilir
- Public API değil, ToS'a aykırı olabilir

---

### Bubilet (bubilet.com.tr)

**Durum:** ✅ JSON API var

**Muhtemel Endpoint:**
```
https://api.bubilet.com.tr/events
https://www.bubilet.com.tr/api/events
```

**Test:**
1. https://www.bubilet.com.tr/etkinlikler adresine git
2. Network tab'ı aç
3. `api` veya `events` içeren istekleri bul

---

### Mobilet (mobilet.com)

**Durum:** ✅ JSON API var

**Endpoint:**
```
https://www.mobilet.com/api/events
```

---

### Passo (passo.com.tr)

**Durum:** ✅ Spor etkinlikleri için API

**Endpoint:**
```
https://www.passo.com.tr/api/events
```

---

## 🛠️ Pratik Uygulama

### CORS Proxy Kullanımı

API'ler CORS korumalıysa proxy gerekir:

```javascript
// Option 1: cors-anywhere (development)
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://www.biletix.com/api/events';

fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => console.log(data));

// Option 2: Your own proxy (production)
// Backend'de basit proxy:
app.get('/api/proxy/biletix', async (req, res) => {
  const response = await axios.get('https://www.biletix.com/api/events');
  res.json(response.data);
});
```

---

## 💻 Basit Web Scraper (Alternatif)

Eğer API bulamazsanız, basit scraper:

```typescript
// src/services/biletixScraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeBiletix() {
  try {
    // Fetch the events page
    const response = await axios.get('https://www.biletix.com/etkinlikler', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Parse HTML
    const $ = cheerio.load(response.data);

    const events = [];

    // Find event cards (inspect the page to find correct selectors)
    $('.event-card').each((i, elem) => {
      events.push({
        title: $(elem).find('.event-title').text().trim(),
        date: $(elem).find('.event-date').text().trim(),
        location: $(elem).find('.event-venue').text().trim(),
        image: $(elem).find('img').attr('src'),
        link: $(elem).find('a').attr('href'),
      });
    });

    return events;
  } catch (error) {
    console.error('Biletix scraping error:', error);
    return [];
  }
}
```

**Kurulum:**
```bash
npm install cheerio
```

---

## 🎯 En İyi Strateji (Şu An İçin)

### Adım 1: Sample Events Ekle (5 dakika) ⚡

```sql
-- Supabase SQL Editor'da çalıştır
-- (SETUP_INSTRUCTIONS.md dosyasındaki SQL'i kullan)
```

### Adım 2: User-Generated Content'e Güven (Zaten Var) ✅

Kullanıcılar şu anda etkinlik ekleyebiliyor:
- CreateEventModal.tsx kullanarak
- Biletix/Bubilet linklerini paylaşarak

### Adım 3: API'leri Test Et (30 dakika)

Browser console'da test et:

```javascript
// Biletix API'sini test et
fetch('https://www.biletix.com/api/events')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error('CORS error - proxy gerekli', e));
```

### Adım 4: Backend Proxy Kur (İlerisi İçin)

```javascript
// backend/server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/events/biletix', async (req, res) => {
  try {
    const response = await axios.get('https://www.biletix.com/api/events');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.listen(3000);
```

---

## ⚖️ Yasal Notlar

**Web Scraping Yasallığı:**
- ✅ Public data (robots.txt izin veriyorsa)
- ⚠️ ToS'a aykırı olabilir
- ❌ Ticari kullanım için izin gerekebilir
- ✅ Akademik/araştırma amaçlı genelde OK

**Öneriler:**
1. robots.txt'i kontrol et
2. Makul rate limiting uygula (1 req/sec)
3. User-Agent header ekle
4. Telif hakkı olan görsellere dikkat

**En Güvenli Yaklaşım:**
- Public API'ler kullan (Ticketmaster, Eventbrite)
- Platform'larla ortaklık kur
- User-generated content'e odaklan

---

## 🚀 Hemen Başlamak İçin

**5 Dakikalık Setup:**

1. **Sample events ekle:**
   - Supabase SQL Editor aç
   - SETUP_INSTRUCTIONS.md'deki SQL'i çalıştır

2. **Uygulamayı test et:**
   ```bash
   # Browser'da aç
   http://localhost:5173

   # 10 etkinlik görmeli
   # Haritada işaretleyiciler olmalı
   ```

3. **Kullanıcı etkinlik ekleme test et:**
   - "+" butonuna tıkla
   - Yeni etkinlik oluştur
   - Haritada görünmeli

**Sonuç:**
✅ Çalışan bir uygulama
✅ Sample data
✅ User-created events
⏳ Gerçek API'ler (valid key'ler gerekli)

---

## ❓ Soru: Ne Yapmak İstersiniz?

**A)** Sample events ekleyip uygulamayı hemen test edelim (5 dk) ⚡

**B)** Biletix/Bubilet API'lerini araştırıp bulalım (30 dk) 🔍

**C)** Basit web scraper yazalım (2 saat) 🛠️

**D)** Valid Ticketmaster/Eventbrite key alalım (30 dk) 🔑

**E)** Backend proxy service kuralım (1 gün) 🖥️

**Tavsiyem:** Önce A, sonra D, sonra B/C (kademeli)
