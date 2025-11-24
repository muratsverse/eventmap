# Değişiklikler Özeti

## 1. Database (Supabase)

### ✅ Address Kolonu Ekleme
```sql
-- add-address-column.sql dosyasını Supabase SQL Editor'da çalıştırın
ALTER TABLE events ADD COLUMN IF NOT EXISTS address TEXT;
```

## 2. Frontend Değişiklikleri

### CreateEventModal.tsx
**Değişiklikler:**
- ✅ `address` alanı eklendi (tam adres için)
- ✅ `latitude`, `longitude` state'e eklendi
- ✅ `showMap` state eklendi (harita göster/gizle)
- ⏳ Harita seçimi komponenti eklenecek
- ⏳ Form'da adres alanı gösterilecek

### EventFilters Bileşeni
**Değişiklikler:**
- ❌ Location dropdown kaldırılacak
- ✅ Sadece "Yakınımdakiler" toggle butonu
- ✅ Yakınımdakiler = kullanıcının şehrindeki etkinlikler

## 3. Test Akışı

1. Supabase'de `add-address-column.sql` çalıştır
2. Frontend değişikliklerini uygula
3. Yeni etkinlik oluştur → Tam adres yaz
4. Filtrede "Yakınımdakiler" seç → Aynı şehir etkinlikleri göster
5. Haritadan konum seç → Koordinatlar otomatik dolsun

## 4. Sıradaki Adım

**ŞU AN:**
- Supabase SQL çalıştırılıyor
- Frontend kodları hazırlanıyor

**SONRA:**
- Etkinlik listesi eklenecek
- Import script'i çalıştırılacak
