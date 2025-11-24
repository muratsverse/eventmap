# 🎉 EventMap - Türkiye Etkinlik Platformu

Modern, mobil-first bir etkinlik keşif ve yönetim platformu. Türkiye'deki konserler, festivaller, spor etkinlikleri, tiyatro gösterileri ve daha fazlasını keşfedin!

## ✨ Özellikler

### 👤 Kullanıcı Özellikleri
- **📱 Liste Görünümü**: Etkinlikleri çekici kartlarla göster
- **🗺️ Harita Görünümü**: Etkinlikleri interaktif haritada gör (yakında)
- **🔍 Gelişmiş Arama**: Kategori, şehir ve anahtar kelime bazlı arama
- **🎯 Filtreleme**: Kategori ve şehir bazlı real-time filtreleme
- **👤 Kullanıcı Profili**: Giriş/kayıt, favoriler, katıldıklarım
- **💎 Premium Özellikler**: Etkinlik oluşturma ve yönetim yetkisi
- **📸 Görsel Yükleme**: Etkinlik görseli yükleme (Supabase Storage)

### 🔧 Admin Özellikleri (Premium)
- **🔄 Unified Event Sync**: Tek tıkla tüm kaynaklardan etkinlik çekme
- **🕷️ Web Scraping**: Biletix, Bubilet, Biletinial'dan otomatik çekme
- **🌐 API Entegrasyonları**:
  - Ticketmaster
  - Eventbrite
  - GetYourGuide
  - Etkinlik.io
  - Facebook Events (kısıtlı)
  - Instagram (kısıtlı)
- **📊 İstatistikler**: Sync başarı oranları ve detaylı raporlar
- **⚙️ Kaynak Seçimi**: Hangi platformlardan çekileceğini seçme

### 💻 Teknik Özellikler
- **React 18** + **TypeScript** (strict mode)
- **TailwindCSS v3.4** ile modern glassmorphism tasarımı
- **Vite** ile ultra-hızlı geliştirme
- **Supabase** backend (PostgreSQL + PostGIS + Auth + Storage)
- **React Query** ile akıllı caching ve state management
- **PWA** desteği (offline çalışma, yüklenebilir)
- **Mobil-first** responsive tasarım
- **Smooth animasyonlar** ve transitions

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd eventmap
```

### 2. Dependencies Yükleyin
```bash
npm install
```

### 3. Environment Variables (Opsiyonel)
`.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

**Demo Modu**: Supabase yapılandırılmadan da uygulama çalışır (mock data ile)

### 4. Geliştirme Sunucusu
```bash
npm run dev
```
Tarayıcınızda http://localhost:5173 adresini açın

### 5. Production Build
```bash
npm run build
npm run preview
```

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Database kurulumu ve SQL şemaları |
| [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) | Backend entegrasyon rehberi |
| [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) | Tüm API entegrasyonları için detaylı rehber |
| [SCRAPER_SETUP.md](./SCRAPER_SETUP.md) | Web scraper kurulumu ve Edge Functions |

## 🗂️ Proje Yapısı

```
eventmap/
├── src/
│   ├── components/
│   │   ├── views/              # Ana görünümler
│   │   │   ├── ListView.tsx    # Etkinlik listesi
│   │   │   ├── MapView.tsx     # Harita görünümü
│   │   │   ├── SearchView.tsx  # Arama sayfası
│   │   │   └── ProfileView.tsx # Profil ve admin paneli
│   │   ├── modals/             # Modal bileşenler
│   │   │   ├── EventDetailSheet.tsx
│   │   │   ├── FilterSheet.tsx
│   │   │   └── CreateEventModal.tsx
│   │   ├── AdminPanel.tsx      # Admin yönetim paneli
│   │   ├── SplashScreen.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   └── EventCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/
│   │   ├── useEvents.ts        # Event fetching
│   │   ├── useFavorites.ts     # Favorites & attendances
│   │   ├── useGeolocation.ts   # GPS features
│   │   ├── useCreateEvent.ts   # Event creation
│   │   ├── useScraper.ts       # Web scraping
│   │   └── useEventSync.ts     # Unified sync
│   ├── services/
│   │   ├── eventApis.ts        # Ticketmaster & Eventbrite
│   │   ├── getyourguideApi.ts  # GetYourGuide integration
│   │   ├── etkinlikioApi.ts    # Etkinlik.io integration
│   │   ├── facebookEventsApi.ts
│   │   ├── instagramApi.ts
│   │   ├── scraperService.ts   # Web scraper
│   │   └── unifiedEventSync.ts # Sync orchestrator
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts
│   ├── types/
│   │   ├── index.ts            # App types
│   │   └── database.ts         # Database types
│   ├── data/
│   │   └── mockData.ts         # Mock events
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── functions/
│       └── scrape-events/      # Edge function for scraping
├── public/
│   └── manifest.json           # PWA manifest
├── supabase-setup.sql          # Database schema
├── supabase-storage-setup.sql  # Storage setup
└── package.json
```

## 📦 Dependencies

### Core
- `react` & `react-dom`: ^18.3.1
- `typescript`: ^5.6.2
- `vite`: ^6.0.1

### UI
- `tailwindcss`: ^3.4.17
- `lucide-react`: ^0.469.0

### Backend
- `@supabase/supabase-js`: ^2.48.1
- `@tanstack/react-query`: ^5.62.14
- `axios`: ^1.7.9
- `date-fns`: ^4.1.0

### PWA
- `vite-plugin-pwa`: ^0.21.2

## 🎯 Kategoriler

| Kategori | İkon | Açıklama |
|----------|------|----------|
| 🎵 **Konser** | Müzik notu | Canlı müzik performansları |
| ⚽ **Spor** | Futbol topu | Maçlar ve spor etkinlikleri |
| 🎭 **Tiyatro** | Tiyatro maskesi | Tiyatro oyunları ve stand-up |
| 🎪 **Festival** | Çadır | Müzik, sanat ve kültür festivalleri |
| 🤝 **Meetup** | El sıkışma | Topluluk buluşmaları |
| 🎨 **Sergi** | Palet | Sanat sergileri ve müze etkinlikleri |

## 🌍 Desteklenen Şehirler

- 🏙️ Istanbul
- 🏛️ Ankara
- 🌊 Izmir
- 🏖️ Antalya
- 🌳 Bursa

## 🔌 API Entegrasyonları

### ✅ Aktif
| Platform | Durum | API Key Gerekli | Dokümantasyon |
|----------|-------|-----------------|---------------|
| **Ticketmaster** | ✅ Çalışıyor | ✅ Evet | [Docs](https://developer.ticketmaster.com/) |
| **Eventbrite** | ✅ Çalışıyor | ✅ Evet | [Docs](https://www.eventbrite.com/platform/) |
| **GetYourGuide** | ✅ Hazır | ✅ Evet (Başvuru) | [Docs](https://code.getyourguide.com/) |
| **Etkinlik.io** | ✅ Hazır | ✅ Evet | [RapidAPI](https://rapidapi.com/etkinlik) |

### ⚠️ Kısıtlı
| Platform | Durum | Not |
|----------|-------|-----|
| **Facebook Events** | ⚠️ Kısıtlı | Sadece yönetilen sayfalar |
| **Instagram** | ⚠️ Kısıtlı | Event API yok, hashtag parsing |

### 🕷️ Web Scraping
| Platform | Durum | Metod |
|----------|-------|-------|
| **Biletix** | 🔧 Mock | Edge Function + HTML parsing |
| **Bubilet** | 🔧 Mock | Edge Function + HTML parsing |
| **Biletinial** | 🔧 Mock | Edge Function + HTML parsing |

## 🚀 Deployment

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# dist/ klasörünü Netlify'a yükleyin
```

### Environment Variables (Production)
```env
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_TICKETMASTER_API_KEY=your_key
VITE_EVENTBRITE_API_KEY=your_key
# ... diğer API keyler
```

## 🔐 Güvenlik

- ✅ Row Level Security (RLS) tüm tablolarda aktif
- ✅ API keyleri environment variables'da
- ✅ Supabase Storage güvenli (authenticated uploads)
- ✅ Input validation ve sanitization
- ✅ CORS yapılandırması
- ✅ Rate limiting (API seviyesinde)

## 📊 Database Schema

```sql
-- Ana tablolar
✅ profiles          # Kullanıcı profilleri
✅ events            # Etkinlikler (PostGIS location)
✅ favorites         # Favoriler
✅ attendances       # Katılımlar

-- Özellikler
✅ PostGIS extension (geospatial queries)
✅ Triggers (auto-update location_point)
✅ Functions (nearby_events, auto-profile)
✅ Indexes (spatial index on location)
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Pink (#EC4899)
- **Accent**: Blue (#3B82F6)
- **Background**: Dark (#111827)

### Effects
- **Glassmorphism**: backdrop-blur-md + bg-white/5
- **Gradients**: from-purple via-pink to-blue
- **Animations**: fade-in, slide-up, scale-in
- **Shadows**: Soft glows and elevations

## 🧪 Testing

```bash
# Unit tests (gelecek)
npm test

# E2E tests (gelecek)
npm run test:e2e

# Type checking
npm run type-check

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Problem: "Supabase not configured"
**Çözüm**: .env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ayarlayın.

### Problem: "API rate limit exceeded"
**Çözüm**: API key limitlerini kontrol edin. Ticketmaster: 5000/gün, Eventbrite: 1000/saat.

### Problem: "Storage upload failed"
**Çözüm**: Supabase Storage bucket'ının oluşturulduğundan ve policy'lerin doğru olduğundan emin olun.

### Problem: Dev server çalışmıyor
**Çözüm**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📈 Roadmap

### v1.0 (Mevcut)
- ✅ Mobil-first UI
- ✅ Liste ve harita görünümleri
- ✅ Kullanıcı authentication
- ✅ Favoriler ve katılımlar
- ✅ Etkinlik oluşturma
- ✅ Admin paneli
- ✅ API entegrasyonları
- ✅ Web scraping

### v1.1 (Yakında)
- [ ] Push notifications
- [ ] Etkinlik hatırlatıcıları
- [ ] Sosyal paylaşım
- [ ] QR kod entegrasyonu
- [ ] Kişiselleştirilmiş öneriler

### v2.0 (Gelecek)
- [ ] Mobil app (React Native)
- [ ] AI-powered öneriler
- [ ] Venue partnerships
- [ ] Ticketing integration
- [ ] Analytics dashboard

## 🤝 Contributing

Katkıda bulunmak isterseniz:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👏 Teşekkürler

- Figma tasarımları için özel teşekkürler
- Supabase open-source backend
- Unsplash görselleri
- Türk etkinlik topluluğu

## 📞 İletişim

Sorular, öneriler veya bug raporları için:
- **Issues**: GitHub Issues kullanın
- **Email**: [email]
- **Twitter**: [@eventmap_tr]

---

**Made with ❤️ in Turkey**

🎉 **EventMap** - Etkinliklerin dijital haritası!
