# Backend Entegrasyonu Rehberi

EventMap uygulaması artık tam fonksiyonel backend desteğine sahip! Bu rehber, yeni eklenen özellikleri kullanmanıza yardımcı olacaktır.

## ✅ Eklenen Özellikler

### 1. Authentication (Kimlik Doğrulama)
- ✅ **Supabase Auth** entegrasyonu
- ✅ Email/Password giriş sistemi
- ✅ Otomatik profil oluşturma
- ✅ Session yönetimi
- ✅ **Demo Modu**: Supabase yapılandırılmamışsa mock authentication

**Kullanım:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) console.error(error);
  };
}
```

### 2. Events Service
- ✅ **useEvents** hook ile etkinlik yönetimi
- ✅ Kategori ve şehir bazlı filtreleme
- ✅ Supabase + Mock data desteği
- ✅ Etkinlik oluşturma (premium üyeler için)

**Kullanım:**
```typescript
import { useEvents } from '@/hooks/useEvents';

function EventList() {
  const { data: events, isLoading } = useEvents({
    categories: ['Konser', 'Festival'],
    cities: ['Istanbul']
  });
}
```

### 3. Favorites & Attendances
- ✅ **useFavorites** hook
- ✅ **useAttendances** hook
- ✅ Toggle favorileme
- ✅ Katılım işaretleme
- ✅ Real-time sync

**Kullanım:**
```typescript
import { useFavorites, useAttendances } from '@/hooks/useFavorites';

function EventCard({ event }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAttending, toggleAttendance } = useAttendances();

  return (
    <button onClick={() => toggleFavorite(event.id)}>
      {isFavorite(event.id) ? '❤️' : '🤍'}
    </button>
  );
}
```

### 4. Geolocation
- ✅ **useGeolocation** hook
- ✅ GPS konumu alma
- ✅ Yakınımdaki etkinlikler (PostGIS)
- ✅ Mesafe hesaplama

**Kullanım:**
```typescript
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyEvents } from '@/hooks/useEvents';

function NearbyEvents() {
  const { latitude, longitude } = useGeolocation();
  const { data: nearby } = useNearbyEvents(latitude, longitude, 10); // 10km
}
```

### 5. External Event APIs
- ✅ **Ticketmaster API** entegrasyonu
- ✅ **Eventbrite API** entegrasyonu
- ✅ Otomatik API sync
- ✅ Event normalization

**Kullanım:**
```typescript
import { EventAPIService } from '@/services/eventApis';

const apiService = new EventAPIService();
const events = await apiService.fetchAllEvents({
  city: 'Istanbul',
  category: 'Konser'
});
```

## 📦 Kurulum

### 1. Dependencies Yüklendi
```bash
npm install @supabase/supabase-js @tanstack/react-query axios date-fns
```

### 2. Environment Variables
`.env` dosyanızı doldurun:
```env
# Supabase (Zorunlu - Production için)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Event APIs (Opsiyonel)
VITE_TICKETMASTER_API_KEY=your-key
VITE_EVENTBRITE_API_KEY=your-key
```

### 3. Supabase Database Setup
[SUPABASE_SETUP.md](./SUPABASE_SETUP.md) dosyasındaki talimatları takip edin.

## 🎯 Özellik Kullanımı

### Profil Sayfası
- ✅ Giriş/Çıkış işlemleri
- ✅ Favoriler listesi
- ✅ Katılacaklarım listesi
- ✅ Ayarlar (bildirimler, premium durum)

### Etkinlik Detay
- ✅ Favoriye ekleme butonu
- ✅ "Bilet Al" / "Katılıyorsunuz" durumu
- ✅ Sosyal paylaşım

### Filtreleme
- ✅ Kategori filtreleri (real-time)
- ✅ Şehir filtreleri (real-time)
- ✅ Veritabanı sorgulaması

## 🔄 Data Flow

```
User Action
    ↓
React Hook (useEvents, useFavorites, etc.)
    ↓
React Query Cache
    ↓
Supabase Client
    ↓
PostgreSQL Database (with PostGIS)
    ↓
Real-time Subscription (optional)
    ↓
UI Update
```

## 🌐 API Entegrasyonları

### Ticketmaster
```typescript
const ticketmaster = new TicketmasterAPI(apiKey);
const events = await ticketmaster.searchEvents({
  city: 'Istanbul',
  category: 'Music',
  startDate: '2025-01-01T00:00:00Z'
});
```

### Eventbrite
```typescript
const eventbrite = new EventbriteAPI(apiKey);
const events = await eventbrite.searchEvents({
  location: 'Istanbul, Turkey',
  startDate: '2025-01-01T00:00:00Z'
});
```

### Tümünü Birlikte
```typescript
const apiService = new EventAPIService();
const allEvents = await apiService.fetchAllEvents();

// Supabase'e sync et
await apiService.syncEventsToDatabase(allEvents, supabase);
```

## 📍 Geolocation Özellikleri

### Konum İzinleri
```typescript
const { latitude, longitude, error, requestLocation } = useGeolocation();

// Manuel konum isteme
requestLocation();
```

### Yakınımdaki Etkinlikler
```typescript
const { data: nearbyEvents } = useNearbyEvents(
  latitude,
  longitude,
  10 // 10km radius
);
```

### Mesafe Hesaplama
```typescript
import { calculateDistance } from '@/hooks/useGeolocation';

const distance = calculateDistance(
  41.0082, 28.9784, // Istanbul
  39.9334, 32.8597  // Ankara
); // ~350 km
```

## 🔐 Security & RLS

Tüm tablolar Row Level Security (RLS) ile korunur:

- ✅ **Profiles**: Herkes görebilir, sadece sahibi düzenleyebilir
- ✅ **Events**: Herkes görebilir, sadece oluşturan düzenleyebilir
- ✅ **Favorites**: Sadece kullanıcının kendi favorileri
- ✅ **Attendances**: Sadece kullanıcının kendi katılımları

## 🚀 Production Deployment

### 1. Supabase Projesini Hazırlayın
- Database şemasını oluşturun
- Row Level Security policies'i aktifleştirin
- Storage bucket'ları oluşturun (profil fotoğrafları için)

### 2. Environment Variables
Production ortamında doğru değerleri kullanın:
```env
VITE_SUPABASE_URL=https://production-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-anon-key
```

### 3. Build & Deploy
```bash
npm run build
# dist/ klasörünü deploy edin
```

## 🔄 Otomatik API Sync (Gelecek İyileştirme)

Cron job ile günlük etkinlik sync'i:

```typescript
// Supabase Edge Function veya Backend Service
import { EventAPIService } from './services/eventApis';

export async function syncDailyEvents() {
  const apiService = new EventAPIService();

  const events = await apiService.fetchAllEvents({
    startDate: new Date().toISOString()
  });

  await apiService.syncEventsToDatabase(events, supabase);

  console.log(`Synced ${events.length} events`);
}

// Her gün saat 03:00'te çalıştır
```

## 📱 Push Notifications (Gelecek)

PWA Service Worker ile:
```typescript
// Bildirim izni iste
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  // Supabase'den real-time subscription
  supabase
    .channel('events')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'events'
    }, (payload) => {
      new Notification('Yeni Etkinlik!', {
        body: payload.new.title,
        icon: payload.new.image_url
      });
    })
    .subscribe();
}
```

## 🐛 Troubleshooting

### "Invalid JWT" hatası
- Supabase anon key'inizi kontrol edin
- Session'ın expire olmadığından emin olun

### Favorites çalışmıyor
- User'ın login olduğundan emin olun
- RLS policies'i kontrol edin

### Geolocation çalışmıyor
- HTTPS üzerinden servis edildiğinden emin olun
- Tarayıcı izinlerini kontrol edin

### API rate limits
- Ticketmaster: 5000 request/gün
- Eventbrite: Tier'a göre değişir
- Cache kullanarak request sayısını azaltın

## 📚 Daha Fazla Bilgi

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Ticketmaster API](https://developer.ticketmaster.com/)
- [Eventbrite API](https://www.eventbrite.com/platform/)

## 🎉 Özet

Artık EventMap uygulamanız:
- ✅ Tam fonksiyonel authentication
- ✅ Gerçek zamanlı favoriler ve katılımlar
- ✅ GPS tabanlı yakınımdaki etkinlikler
- ✅ Harici API entegrasyonları
- ✅ Supabase backend desteği

**Demo Modu**: Supabase yapılandırılmamışsa uygulama mock data ile çalışmaya devam eder!
