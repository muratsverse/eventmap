# 📅 Aylık Etkinlik Ekleme Rehberi

## 🚀 Hızlı Başlangıç

### Adım 1: Etkinlikleri Toplayın

Şu sitelerden etkinlikleri kontrol edin:
- 🎫 https://www.biletix.com
- 🎟️ https://www.bubilet.com.tr
- 📱 https://www.mobilet.com
- ⚽ https://www.passo.com.tr
- 🎭 https://www.zorlupsm.com
- 🎨 https://www.iksv.org

### Adım 2: events-data.json Dosyasını Düzenleyin

```json
[
  {
    "title": "Etkinlik Başlığı",
    "description": "Etkinlik açıklaması (kısa özet)",
    "category": "Konser",
    "imageUrl": "https://resim-url.jpg",
    "date": "15 Mart 2025",
    "time": "20:00",
    "location": "Mekan Adı",
    "city": "Istanbul",
    "address": "Tam Adres (opsiyonel)",
    "priceMin": 100,
    "priceMax": 500,
    "organizer": "Organizatör",
    "url": "https://biletix.com/link"
  }
]
```

### Adım 3: Scripti Çalıştırın

```bash
npx tsx import-events.ts
```

Hepsi bu kadar! ✅

---

## 📋 Kategori Listesi

**Kullanabileceğiniz kategoriler:**
- `Konser` - Müzik konserleri
- `Festival` - Festivaller
- `Tiyatro` - Tiyatro ve opera
- `Spor` - Spor etkinlikleri
- `Sergi` - Sergiler ve müzeler
- `Gastronomi` - Yemek etkinlikleri
- `Sinema` - Film gösterimleri
- `Meetup` - Buluşmalar ve workshoplar
- `Diğer` - Diğer etkinlikler

---

## 🏙️ Şehir Listesi

**Desteklenen şehirler:**
- `Istanbul`
- `Ankara`
- `Izmir`
- `Antalya`
- `Bursa`

---

## 📝 Etkinlik Şablonu (Kopyala-Yapıştır)

```json
{
  "title": "",
  "description": "",
  "category": "Konser",
  "imageUrl": "",
  "date": "1 Nisan 2025",
  "time": "20:00",
  "location": "",
  "city": "Istanbul",
  "address": "",
  "priceMin": 0,
  "priceMax": 0,
  "organizer": "",
  "url": ""
}
```

---

## 💡 İpuçları

### Görsel Bulma:
1. Etkinliğin kendi sitesinden kopyalayın
2. Yoksa Unsplash'ten benzer görsel:
   - Konser: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800`
   - Festival: `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800`
   - Tiyatro: `https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800`
   - Spor: `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800`

### Tarih Formatı:
- ✅ Doğru: `15 Mart 2025`, `20 Nisan 2025`
- ❌ Yanlış: `15/03/2025`, `2025-03-15`

### Zaman Formatı:
- ✅ Doğru: `20:00`, `19:30`, `14:00`
- ❌ Yanlış: `8 PM`, `20.00`

### Adres (Opsiyonel):
- Tam adres verirseniz, haritada doğru konumda görünür
- Vermezseniz, şehir merkezine yerleştirilir

---

## 🔧 Sorun Giderme

### RLS (Row Level Security) Hatası

Eğer "row-level security" hatası alırsanız:

1. Supabase Dashboard'a gidin
2. SQL Editor açın
3. Bu komutu çalıştırın:

```sql
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

### Dosya Bulunamadı Hatası

`events-data.json` dosyasının proje klasöründe olduğundan emin olun:
```
Eventmap/
  ├── events-data.json  ← Burası
  ├── import-events.ts
  └── ...
```

### CORS Hatası (Geocoding)

Google Maps API key yoksa, otomatik olarak şehir merkezini kullanır. Sorun değil!

---

## 📊 Örnek: Biletix'ten 10 Etkinlik Ekleme

### 1. Biletix'e Git
https://www.biletix.com

### 2. Etkinlikleri Listele
- Konserler
- Tiyatrolar
- Spor etkinlikleri

### 3. Her Biri İçin Şunu Doldurun:

```json
{
  "title": "Sezen Aksu Konseri",
  "description": "Türk pop müziğinin divası Sezen Aksu, sevilen şarkılarıyla İstanbul'da",
  "category": "Konser",
  "imageUrl": "https://cdn.biletix.com/...",
  "date": "25 Nisan 2025",
  "time": "21:00",
  "location": "Zorlu PSM",
  "city": "Istanbul",
  "address": "Levazım Mahallesi, Koru Sokağı No:2 Beşiktaş",
  "priceMin": 450,
  "priceMax": 1200,
  "organizer": "Zorlu PSM",
  "url": "https://www.biletix.com/etkinlik/xyz"
}
```

### 4. Çalıştır:
```bash
npx tsx import-events.ts
```

### 5. Kontrol Et:
http://localhost:5173

---

## 🎯 Aylık Rutin (30 Dakika)

### Her Ayın 1'inde:

**1. Siteleri Kontrol Et (10 dk):**
- Biletix yeni etkinlikler
- Bubilet popüler etkinlikler
- Zorlu PSM programı
- İKSV takvimi

**2. Listeyi Hazırla (15 dk):**
- events-data.json'a ekle
- 10-20 öne çıkan etkinlik

**3. Import Et (5 dk):**
```bash
npx tsx import-events.ts
```

**4. Test Et:**
- Siteyi aç
- Etkinlikleri kontrol et
- Haritada konumları doğrula

---

## 📅 Şablon: Mart 2025 Etkinlikleri

```json
[
  {
    "title": "Istanbul Jazz Festival 2025",
    "description": "Dünyanın en ünlü caz sanatçılarını ağırlayan prestijli festival",
    "category": "Festival",
    "imageUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    "date": "15 Mart 2025",
    "time": "19:00",
    "location": "Zorlu PSM",
    "city": "Istanbul",
    "address": "Levazım Mahallesi, Koru Sokağı No:2 Beşiktaş",
    "priceMin": 350,
    "priceMax": 800,
    "organizer": "İKSV",
    "url": "https://www.biletix.com/etkinlik/xyz"
  },
  {
    "title": "Galatasaray vs Fenerbahçe",
    "description": "Türkiye'nin en büyük derbisi",
    "category": "Spor",
    "imageUrl": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    "date": "22 Mart 2025",
    "time": "19:00",
    "location": "Türk Telekom Stadyumu",
    "city": "Istanbul",
    "address": "Huzur Mahallesi, Ali Sami Yen Sokak, Sarıyer",
    "priceMin": 500,
    "priceMax": 1500,
    "organizer": "Galatasaray SK",
    "url": "https://www.passo.com.tr/etkinlik/xyz"
  }
]
```

---

## ✅ Checklist

Her ay etkinlik eklerken:

- [ ] Biletix kontrolü
- [ ] Bubilet kontrolü
- [ ] Zorlu PSM programı
- [ ] İKSV takvimi
- [ ] Passo spor etkinlikleri
- [ ] events-data.json güncellendi
- [ ] Script çalıştırıldı
- [ ] Web sitesinde test edildi
- [ ] Harita konumları doğru
- [ ] Görseller yükleniyor

---

## 🚨 Önemli Notlar

1. **Örnek etkinliği silin** - "Örnek Etkinlik" başlıklı satırı kaldırın
2. **Tarihleri güncel tutun** - Geçmiş etkinlikleri eklemeyin
3. **Görsellere dikkat** - Telif hakkı olan görseller kullanmayın
4. **Fiyatları kontrol edin** - priceMin ve priceMax doğru olsun
5. **Koordinatlar otomatik** - Adres verirseniz sistem halleder

---

## 💬 Yardım

Sorun mu var?

1. Script çalışmıyor → RLS'yi kapatın (yukarıda SQL)
2. Koordinatlar yanlış → Tam adres verin
3. Görsel gözükmüyor → URL'yi kontrol edin
4. Tarih formatı → "15 Mart 2025" şeklinde

---

## 🎉 Başarıyla Tamamlandı!

Artık her ay 30 dakikada yüzlerce etkinliği ekleyebilirsiniz!
