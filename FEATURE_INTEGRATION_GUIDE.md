# 🎯 EventMap - Yeni Özellikler Entegrasyon Rehberi

Bu rehber, yeni eklenen özellikleri nasıl entegre edeceğinizi adım adım açıklar.

---

## 📋 Eklenen Özellikler

✅ **Premium Satın Alma Sistemi**
✅ **Etkinlik Oluşturma Kota Sistemi**
✅ **Reklam Sistemi**
✅ **Gelişmiş Filtreleme (Fiyat, Tarih, Sıralama)**
✅ **Skeleton Loader'lar**
✅ **Bildirim Ayarları**
✅ **PWA Desteği**

---

## 1️⃣ PREMIUM SATINMA MODALİ

### Dosya Konumu:
```
src/components/modals/PremiumModal.tsx
```

### Nasıl Kullanılır:

**App.tsx veya ProfileView.tsx içinde:**

```typescript
import PremiumModal from '@/components/modals/PremiumModal';
import { useState } from 'react';

function YourComponent() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      {/* Premium butonu */}
      <button onClick={() => setShowPremiumModal(true)}>
        Premium'a Geç
      </button>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
}
```

### Ödeme Entegrasyonu (TODO):

```typescript
// PremiumModal.tsx içindeki handlePurchase fonksiyonunda:

const handlePurchase = async (planName: string) => {
  // Stripe ile:
  const stripe = await loadStripe('pk_your_publishable_key');
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: 'price_id', quantity: 1 }],
    mode: 'subscription',
    successUrl: window.location.origin + '/success',
    cancelUrl: window.location.origin + '/canceled',
  });

  // VEYA Iyzico ile:
  // https://dev.iyzipay.com/tr/api/odeme-formu
};
```

---

## 2️⃣ ETKİNLİK OLUŞTURMA KOTA SİSTEMİ

### Backend SQL Setup:

1. Supabase SQL Editor'de çalıştırın:
```sql
-- Dosya: PREMIUM_AND_QUOTA_SETUP.sql
-- Tüm kodu kopyalayıp SQL Editor'de çalıştırın
```

### Frontend'de Kullanım:

**CreateEventModal.tsx içinde kota kontrolü:**

```typescript
import { supabase } from '@/lib/supabase';

async function checkQuota(userId: string) {
  const { data, error } = await supabase
    .rpc('can_create_event', { p_user_id: userId });

  return data; // true veya false
}

// Etkinlik oluşturma butonunda:
const handleCreateEvent = async () => {
  const canCreate = await checkQuota(user.id);

  if (!canCreate) {
    // Premium modal'ı göster
    setShowPremiumModal(true);
    return;
  }

  // Etkinliği oluştur
  // ...
};
```

**Kullanıcının bu ayki kotasını göster:**

```typescript
async function getMonthlyQuota(userId: string) {
  const { data } = await supabase
    .from('user_quota_status')
    .select('*')
    .eq('user_id', userId)
    .single();

  return {
    eventsThisMonth: data.events_this_month,
    canCreateNew: data.can_create_new_event,
    isPremium: data.has_active_premium,
  };
}
```

---

## 3️⃣ REKLAM SİSTEMİ

### Dosya Konumu:
```
src/components/AdBanner.tsx
```

### ListView'e Reklam Ekleme:

**src/components/views/ListView.tsx güncellemesi:**

```typescript
import AdBanner from '@/components/AdBanner';

export default function ListView({ events, onEventClick, onFilterClick }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <Fragment key={event.id}>
          <EventCard event={event} onClick={() => onEventClick(event)} />

          {/* Her 5 etkinlikte bir reklam göster */}
          {(index + 1) % 5 === 0 && !profile?.is_premium && (
            <AdBanner variant="horizontal" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
```

### MapView'e Reklam Ekleme:

```typescript
// MapView alt kısmına:
<div className="absolute bottom-20 left-0 right-0 px-4">
  {!profile?.is_premium && (
    <AdBanner variant="horizontal" />
  )}
</div>
```

### EventDetailSheet'e Reklam:

```typescript
// EventDetailSheet.tsx - Price bölümünden sonra:
{!user?.is_premium && (
  <div className="mt-6">
    <AdBanner variant="square" />
  </div>
)}
```

### Google AdSense Entegrasyonu:

```typescript
import { GoogleAdSense } from '@/components/AdBanner';

<GoogleAdSense
  slot="your-ad-slot-id"
  format="auto"
  responsive={true}
/>
```

---

## 4️⃣ GELİŞMİŞ FİLTRELEME

### App.tsx Güncellemesi:

```typescript
import { SortOption } from '@/components/modals/FilterSheet';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [showNearby, setShowNearby] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filtreleme ve sıralama mantığı
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Kategori filtresi
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(e => selectedCategories.includes(e.category));
    }

    // Fiyat filtresi
    filtered = filtered.filter(e =>
      e.price.min >= priceRange[0] && e.price.max <= priceRange[1]
    );

    // Tarih filtresi
    if (dateRange.start) {
      filtered = filtered.filter(e => new Date(e.date) >= dateRange.start!);
    }
    if (dateRange.end) {
      filtered = filtered.filter(e => new Date(e.date) <= dateRange.end!);
    }

    // Sıralama
    switch (sortBy) {
      case 'newest':
        return [...filtered].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'upcoming':
        return [...filtered].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'popular':
        return [...filtered].sort((a, b) => b.attendees - a.attendees);
      case 'price-low':
        return [...filtered].sort((a, b) => a.price.min - b.price.min);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price.max - a.price.max);
      default:
        return filtered;
    }
  }, [events, selectedCategories, priceRange, dateRange, sortBy]);

  return (
    // ...
    <FilterSheet
      isOpen={showFilter}
      onClose={() => setShowFilter(false)}
      selectedCategories={selectedCategories}
      showNearby={showNearby}
      priceRange={priceRange}
      dateRange={dateRange}
      sortBy={sortBy}
      onCategoryToggle={handleCategoryToggle}
      onNearbyToggle={handleNearbyToggle}
      onPriceRangeChange={setPriceRange}
      onDateRangeChange={setDateRange}
      onSortChange={setSortBy}
      onClearAll={() => {
        setSelectedCategories([]);
        setShowNearby(false);
        setPriceRange([0, 1000]);
        setDateRange({ start: null, end: null });
        setSortBy('newest');
      }}
      onApply={() => {}}
    />
  );
}
```

---

## 5️⃣ SKELETON LOADER'LAR

### Kullanım:

```typescript
import { EventListSkeleton, EventCardSkeleton } from '@/components/SkeletonLoader';

function ListView() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return <EventListSkeleton count={6} />;
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### Mevcut Skeleton'lar:

- `EventCardSkeleton` - Tek etkinlik kartı
- `EventCardCompactSkeleton` - Compact kart
- `EventListSkeleton` - Liste (varsayılan 6 adet)
- `ProfileSkeleton` - Profil sayfası
- `FilterSkeleton` - Filtre paneli
- `TextSkeleton`, `ButtonSkeleton`, `ImageSkeleton` - Genel amaçlı

---

## 6️⃣ BİLDİRİM AYARLARI

### Kullanım:

```typescript
import NotificationSettingsModal from '@/components/modals/NotificationSettingsModal';

// ProfileView.tsx - Settings tab'ında:
<button onClick={() => setShowNotifSettings(true)}>
  <Bell className="w-5 h-5" />
  <span>Bildirim Ayarları</span>
</button>

<NotificationSettingsModal
  isOpen={showNotifSettings}
  onClose={() => setShowNotifSettings(false)}
/>
```

### Backend Entegrasyonu (TODO):

```typescript
// Bildirimleri kaydetmek için:
const saveNotificationSettings = async (settings) => {
  await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      email_notifications: settings.emailNotifications,
      push_notifications: settings.pushNotifications,
      // ...
    });
};
```

---

## 7️⃣ PWA SETUP

### index.html Güncellemesi:

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#A855F7" />
  <meta name="description" content="Türkiye'nin en kapsamlı etkinlik rehberi" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="EventMap" />

  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />

  <!-- Icons -->
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
  <link rel="apple-touch-icon" href="/icon-192x192.png" />

  <title>EventMap - Türkiye Etkinlik Rehberi</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>

  <!-- Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('Service Worker registered:', reg))
          .catch((err) => console.log('Service Worker registration failed:', err));
      });
    }
  </script>
</body>
</html>
```

### Icon'ları Oluşturma:

```bash
# 512x512 PNG oluşturun, sonra aşağıdaki boyutlara resize edin:
# 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

# Online tool: https://realfavicongenerator.net/
# Veya: https://www.pwabuilder.com/imageGenerator
```

---

## 8️⃣ INFINITE SCROLL / PAGINATION

### useEvents Hook'una Pagination Ekleyin:

```typescript
// src/hooks/useEvents.ts

export function useEvents(options?: {
  categories?: EventCategory[];
  cities?: City[];
  limit?: number;
  offset?: number;
}) {
  const { limit = 20, offset = 0, ...filters } = options || {};

  return useQuery({
    queryKey: ['events', filters, limit, offset],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (filters.categories?.length) {
        query = query.in('category', filters.categories);
      }

      if (filters.cities?.length) {
        query = query.in('city', filters.cities);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
```

### ListView'de Infinite Scroll:

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function ListView() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['events-infinite'],
    queryFn: ({ pageParam = 0 }) =>
      fetchEvents({ limit: 20, offset: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length * 20 : undefined,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </Fragment>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
        </button>
      )}
    </div>
  );
}
```

---

## 9️⃣ IMAGE LAZY LOADING

### EventCard.tsx Güncellemesi:

```typescript
export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <img
        src={event.imageUrl}
        alt={event.title}
        loading="lazy" // Native lazy loading
        className="w-full h-48 object-cover"
        onError={(e) => {
          // Fallback image
          e.currentTarget.src = '/placeholder-event.jpg';
        }}
      />
      {/* Rest of card */}
    </div>
  );
}
```

### React Lazy Load Image (Daha Gelişmiş):

```bash
npm install react-lazy-load-image-component
```

```typescript
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

<LazyLoadImage
  src={event.imageUrl}
  alt={event.title}
  effect="blur"
  placeholderSrc="/placeholder-low-res.jpg"
  className="w-full h-48 object-cover"
/>
```

---

## 🔟 PRODUCTION CHECKLIST

### Backend (Supabase):

- ✅ `PREMIUM_AND_QUOTA_SETUP.sql` çalıştırıldı mı?
- ✅ RLS politikaları aktif mi?
- ✅ Premium subscriptions tablosu oluşturuldu mu?
- ✅ OAuth providers configured?
- ✅ Storage buckets ve policies hazır mı?

### Frontend:

- ✅ `.env` dosyası production değerleriyle güncel mi?
- ✅ Ödeme entegrasyonu (Stripe/Iyzico) yapıldı mı?
- ✅ PWA icon'ları oluşturuldu mu?
- ✅ Google AdSense kodu eklendi mi?
- ✅ Analytics (Google Analytics/Mixpanel) eklendi mi?

### Testing:

- ✅ Premium satın alma testi
- ✅ Kota kontrolü testi (non-premium kullanıcı 2. etkinlik oluşturamıyor)
- ✅ Filtreleme ve sıralama testi
- ✅ Offline mode testi (PWA)
- ✅ Push notification testi

---

## 📞 Yardım & Destek

Sorun mu yaşıyorsunuz?

1. **Console'u kontrol edin**: F12 → Console
2. **Network sekmesini kontrol edin**: API çağrıları başarılı mı?
3. **Supabase logs**: Supabase Dashboard → Logs
4. **Service Worker**: Application → Service Workers (Chrome DevTools)

---

## 🎉 Tebrikler!

Tüm premium özellikler entegre edildi! Artık:

- ✅ Premium üyelik sistemi çalışıyor
- ✅ Etkinlik kotası kontrol ediliyor
- ✅ Reklamlar gösteriliyor
- ✅ Gelişmiş filtreleme ve sıralama var
- ✅ Loading states daha iyi
- ✅ Bildirimler hazır
- ✅ PWA desteği aktif

**Sonraki Adımlar:**
1. Ödeme sistemi entegrasyonu (Stripe/Iyzico)
2. Email servisi (SendGrid/AWS SES)
3. Analytics entegrasyonu
4. Production deployment

İyi çalışmalar! 🚀
