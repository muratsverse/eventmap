# En İyi Etkinlik Kaynakları Stratejisi

## Durum Analizi

### ❌ Çalışmayan Kaynaklar:
1. **Facebook Events API** - 2018'den beri public search yok
2. **Instagram API** - Sadece kendi hesabınızın verileri
3. **Ticketmaster** - API key'iniz geçersiz
4. **Eventbrite** - API key'iniz çalışmıyor

### ⚠️ API Olmayan Türk Platformlar:
- **Biletix** - Public API yok (web scraping gerekli)
- **Bubilet** - Public API yok
- **Mobilet** - Public API yok
- **Passo** - Public API yok
- **Etkinlik.io** - API durumu belirsiz

---

## 💡 Önerilen Çözümler

### Çözüm 1: Kullanıcı-Odaklı Sistem (ÖNERİLEN) 🌟

**Avantajları:**
- API key gerektirmez
- Herkes etkinlik ekleyebilir
- Community-driven, organik büyüme
- Moderasyon ile kaliteli içerik

**Nasıl Çalışır:**
1. Kullanıcılar etkinlik URL'si paylaşır (Biletix, Bubilet, vb.)
2. Sistem otomatik olarak platform'u tespit eder
3. Kullanıcı detayları girer veya sistem scrape eder
4. Moderasyon sonrası yayınlanır

**Zaten Var:** ✅ CreateEventModal.tsx

---

### Çözüm 2: Web Scraping (Backend Gerekli)

**Biletix, Bubilet gibi siteleri otomatik tarar**

**Gereksinimler:**
- Node.js backend service
- Puppeteer/Playwright (headless browser)
- Proxy (IP ban engellemek için)
- Düzenli cron job

**Avantajları:**
- Otomatik veri çekme
- Güncel etkinlikler
- Kapsamlı kapsama

**Dezavantajları:**
- Terms of Service ihlali riski
- IP ban riski
- Bakım gerektirir
- Yavaş (her site 10-30 saniye)

**Tahmini Maliyet:** $20-50/ay (proxy + hosting)

---

### Çözüm 3: RSS/JSON Feeds

**Bazı kurumlar RSS feed sağlar:**

```javascript
// Örnek RSS kaynaklarından çekme
const rssFeeds = [
  'https://www.iksv.org/tr/rss',
  'https://www.zorlupsm.com/rss',
  'https://www.crrkonsersalonu.org/rss',
];
```

**Avantajları:**
- Yasal ve resmi
- Güvenilir
- API key gerektirmez

**Dezavantajları:**
- Sınırlı kaynak
- Her venue RSS sağlamaz

---

### Çözüm 4: API Partnership (Uzun Vadeli)

**Doğrudan platformlarla anlaşma yapma**

Şu platformlara API access başvurusu:
1. **Biletix** - En büyük platform
2. **Bubilet** - İkinci büyük
3. **Passo** - Spor etkinlikleri
4. **Etkinlik.io** - Aggregator

**Nasıl Başvurulur:**
```
Konu: API Entegrasyon Talebi

Merhaba [Platform] ekibi,

EventMap adlı bir etkinlik keşif platformu geliştiriyoruz.
Kullanıcılarımıza [Platform] etkinliklerini göstermek
istiyoruz.

API entegrasyonu için:
- Size trafik göndereceğiz (referral)
- Platformunuzu tanıtacağız
- Bilet satışlarını artıracağız

API dokümantasyonu ve access için yardımcı olabilir misiniz?

Teşekkürler,
[İsminiz]
```

---

### Çözüm 5: Valid API Keys (HIZLI ÇÖZÜM) ⚡

**Doğru API key'leri alın:**

#### Ticketmaster API Key Alma:
1. https://developer.ticketmaster.com/ adresine gidin
2. "Get Your API Key" tıklayın
3. Ücretsiz hesap oluşturun
4. "Consumer Key" kopyalayın

#### Eventbrite API Key Alma:
1. https://www.eventbrite.com/platform/ adresine gidin
2. Eventbrite hesabınızla giriş yapın
3. "Create App" butonuna tıklayın
4. OAuth Token'ı kopyalayın

#### GetYourGuide API:
1. https://partner.getyourguide.com/ adresine başvurun
2. Partner program için başvurun
3. API key alın

---

## 🎯 Önerilen Strateji (Kademeli Yaklaşım)

### Aşama 1: Hemen (1-2 gün)
1. ✅ **Sample events ekle** (SETUP_INSTRUCTIONS.md'deki SQL)
2. ✅ **User-created events** (zaten var)
3. ⏳ **Valid API keys al** (Ticketmaster + Eventbrite)

### Aşama 2: Kısa Vadeli (1 hafta)
1. RSS feed parser ekle
2. İKSV, Zorlu PSM gibi kurumlardan otomatik çek
3. Community moderation sistemi

### Aşama 3: Orta Vadeli (1 ay)
1. Backend service oluştur (Express.js)
2. Basit web scraper (Biletix, Bubilet)
3. Cron job ile günlük sync

### Aşama 4: Uzun Vadeli (3-6 ay)
1. Platform'larla API partnership
2. Premium özellikler (öne çıkan etkinlikler)
3. Monetization (affiliate links)

---

## 💻 Kod Örnekleri

### RSS Feed Parser Ekleyelim mi?

```typescript
// src/services/rssFeedParser.ts
import Parser from 'rss-parser';

const parser = new Parser();

async function fetchRSSEvents() {
  const feeds = [
    'https://www.iksv.org/tr/rss',
    'https://www.zorlupsm.com/rss',
  ];

  const events = [];

  for (const feedUrl of feeds) {
    const feed = await parser.parseURL(feedUrl);

    feed.items.forEach(item => {
      events.push({
        id: `rss-${item.guid}`,
        title: item.title,
        description: item.contentSnippet,
        date: new Date(item.pubDate).toLocaleDateString('tr-TR'),
        link: item.link,
        // ...
      });
    });
  }

  return events;
}
```

### Web Scraper (Backend Gerekli)

```typescript
// backend/scrapers/biletix.ts
import puppeteer from 'puppeteer';

async function scrapeBiletix() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.biletix.com/etkinlikler');

  const events = await page.evaluate(() => {
    // Extract event data from DOM
    return Array.from(document.querySelectorAll('.event-card')).map(card => ({
      title: card.querySelector('.title')?.textContent,
      date: card.querySelector('.date')?.textContent,
      // ...
    }));
  });

  await browser.close();
  return events;
}
```

---

## ❓ Sizin İçin En İyi Yaklaşım Hangisi?

**Sorular:**
1. Backend service kurabilir misiniz? (Node.js sunucu)
2. Web scraping yasal riskleri kabul eder misiniz?
3. Kullanıcı-odaklı bir sistem yeterli mi?
4. Ticketmaster/Eventbrite valid key alabilir misiniz?

**Hızlı başlamak için:** Sample events + User-created events + Valid API keys

**Uzun vadeli başarı için:** RSS feeds + Backend scraper + Platform partnerships

---

## 🚀 Şimdi Ne Yapmalıyız?

Hangi çözümü tercih edersiniz?

**A)** Sample events ekle, user-created events kullan (5 dakika) ⚡
**B)** Valid Ticketmaster/Eventbrite keys al (30 dakika)
**C)** RSS feed parser ekle (1-2 saat)
**D)** Backend web scraper kur (1-2 gün)
**E)** Hepsi (kademeli yaklaşım)

Ben size **A + B + C** öneriyorum. Hemen çalışan bir sistem + gelecek için temel.
