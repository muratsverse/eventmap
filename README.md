# 🎉 Socia - Sosyal Etkinlik Platformu

Modern, mobil-first bir etkinlik keşif ve yönetim platformu. Türkiye'deki konserler, festivaller, spor etkinlikleri, tiyatro gösterileri ve daha fazlasını keşfedin!

## ✨ Özellikler

### 👤 Kullanıcı Özellikleri
- **📱 Liste Görünümü**: Etkinlikleri çekici kartlarla göster
- **🗺️ Harita Görünümü**: Etkinlikleri interaktif haritada gör
- **🔍 Gelişmiş Arama**: Kategori, şehir ve anahtar kelime bazlı arama
- **🎯 Filtreleme**: Kategori ve şehir bazlı real-time filtreleme
- **👤 Kullanıcı Profili**: Giriş/kayıt, favoriler, katıldıklarım
- **💎 Premium Özellikler**: Sınırsız etkinlik oluşturma ve reklamsız deneyim
- **📸 Görsel Yükleme**: Etkinlik görseli yükleme (Supabase Storage)
- **📊 Katılımcı Kapasitesi**: Etkinliklere maksimum katılımcı sayısı belirleme
- **🗑️ Hesap Yönetimi**: Hesabınızı tamamen silme imkanı

### 💰 Fiyatlandırma
- **Ücretsiz**: Ayda 5 etkinlik oluşturma hakkı
- **Premium**: ₺250/ay - Sınırsız etkinlik + reklamsız deneyim

### 💻 Teknik Özellikler
- **React 18** + **TypeScript** (strict mode)
- **TailwindCSS v3.4** ile modern glassmorphism tasarımı
- **Vite** ile ultra-hızlı geliştirme
- **Supabase** backend (PostgreSQL + PostGIS + Auth + Storage)
- **React Query** ile akıllı caching ve state management
- **Paddle** payment integration (₺250/month subscription)
- **PWA** desteği (offline çalışma, yüklenebilir)
- **Mobil-first** responsive tasarım
- **Capacitor 7** ile native mobile app (Android + iOS)

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/muratsverse/eventmap.git
cd eventmap
```

### 2. Dependencies Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

Gerekli environment variables:
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Paddle Payment
VITE_PADDLE_CLIENT_TOKEN=your_paddle_token
VITE_PADDLE_PRICE_ID=your_price_id
VITE_PADDLE_ENVIRONMENT=sandbox

# Optional APIs
VITE_TICKETMASTER_API_KEY=your_key
VITE_EVENTBRITE_API_KEY=your_key
```

### 4. Geliştirme Sunucusu
```bash
npm run dev
```
Tarayıcınızda http://localhost:5173 adresini açın

### 5. Mobile Build (Android)
```bash
npm run build
npx cap sync android
```
Android Studio'da projeyi açın ve APK/AAB oluşturun.

## 📱 Platform Desteği

- ✅ **Web**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)
- ✅ **Android**: Native app via Capacitor
- 🔄 **iOS**: Yakında (Capacitor hazır, test aşamasında)
- ✅ **PWA**: İndirilebilir, offline çalışma

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

## 💳 Payment Integration

**Paddle** ile güvenli ödeme altyapısı:
- Monthly subscription: ₺250/month
- Commission-based (no monthly fees to Paddle)
- Secure checkout overlay
- Subscription management
- Automatic renewals
- Refund policy support

## 🔐 Güvenlik

- ✅ Row Level Security (RLS) tüm tablolarda aktif
- ✅ API keyleri environment variables'da
- ✅ Supabase Storage güvenli (authenticated uploads)
- ✅ Input validation ve sanitization
- ✅ CORS yapılandırması
- ✅ Paddle PCI-compliant payment processing
- ✅ Account deletion with data purge

## 📊 Database Schema

```sql
-- Ana tablolar
✅ profiles          # Kullanıcı profilleri (is_premium, event_count)
✅ events            # Etkinlikler (PostGIS location, max_attendees)
✅ favorites         # Favoriler
✅ attendances       # Katılımlar

-- Özellikler
✅ PostGIS extension (geospatial queries)
✅ Triggers (auto-update location_point, profile creation)
✅ Functions (nearby_events, delete_user_account)
✅ Indexes (spatial index on location)
✅ RLS Policies (user-specific data access)
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#A855F7)
- **Secondary**: Pink (#EC4899)
- **Accent**: Blue (#3B82F6)
- **Background**: Dark (#111827)

### Effects
- **Glassmorphism**: backdrop-blur-md + bg-white/5
- **Gradients**: from-purple via-pink to-blue
- **Animations**: fade-in, slide-up, scale-in
- **Shadows**: Soft glows and elevations

## 📈 Roadmap

### v1.0 (Current - Released) ✅
- ✅ Mobil-first UI
- ✅ Liste ve harita görünümleri
- ✅ Kullanıcı authentication (Google OAuth)
- ✅ Favoriler ve katılımlar
- ✅ Etkinlik oluşturma (5 event limit for free)
- ✅ Premium subscription (Paddle)
- ✅ Hesap silme
- ✅ Android native app
- ✅ Etkinlik katılımcı kapasitesi

### v1.1 (In Progress)
- 🔄 iOS app testing
- 🔄 Push notifications
- 🔄 Etkinlik hatırlatıcıları
- 🔄 Sosyal paylaşım

### v2.0 (Planned)
- [ ] AI-powered öneriler
- [ ] Gelişmiş analytics
- [ ] Multi-language support
- [ ] Event check-in QR codes

## 🚀 Deployment

### Web (GitHub Pages)
Live at: https://muratsverse.github.io/eventmap/

```bash
# Automated via GitHub Actions
git push origin main
```

### Android (Google Play Store)
Status: **Closed Testing**

```bash
# Build AAB
cd android
./gradlew bundleRelease
```

Upload to Google Play Console → Closed Testing

### Environment Setup
GitHub Secrets required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PADDLE_CLIENT_TOKEN`
- `VITE_PADDLE_PRICE_ID`

## 📄 Legal Pages

- [Terms of Service](https://muratsverse.github.io/eventmap/terms)
- [Privacy Policy](https://muratsverse.github.io/eventmap/privacy)
- [Refund Policy](https://muratsverse.github.io/eventmap/refund)

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

- Supabase open-source backend
- Paddle payment platform
- Capacitor mobile framework
- React ve TypeScript topluluğu
- Türk etkinlik topluluğu

## 📞 İletişim

Sorular, öneriler veya bug raporları için:
- **Issues**: [GitHub Issues](https://github.com/muratsverse/eventmap/issues)
- **Website**: https://muratsverse.github.io/eventmap/

---

**Made with ❤️ in Turkey**

🎉 **Socia** - Sosyal etkinliklerin dijital evi!
