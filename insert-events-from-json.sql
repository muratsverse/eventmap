-- Manuel Etkinlik Ekleme SQL Script
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- events-data.json'dan alınan 8 etkinlik

-- Önce RLS'yi kapat (geçici)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Eski manual etkinlikleri temizle (opsiyonel)
DELETE FROM events WHERE source = 'manual';

-- Yeni etkinlikleri ekle
INSERT INTO events (id, title, description, category, image_url, date, time, location, address, city, price_min, price_max, organizer, attendees, latitude, longitude, is_premium, source)
VALUES
  (
    'manual-sezen-aksu-50-sanat-yili-konseri-' || floor(random() * 1000000),
    'Sezen Aksu - 50. Sanat Yılı Konseri',
    'Türk pop müziğinin divası Sezen Aksu, 50. sanat yılı özel konseriyle İstanbul''da! Sevilen şarkılarıyla dolu unutulmaz bir gece.',
    'Konser',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    '15 Nisan 2025',
    '21:00',
    'Zorlu PSM',
    'Levazım Mahallesi, Koru Sokağı No:2 Beşiktaş',
    'Istanbul',
    450,
    1200,
    'Zorlu PSM',
    0,
    41.0661,
    29.0128,
    false,
    'manual'
  ),
  (
    'manual-galatasaray-fenerbahce-super-lig-derbisi-' || floor(random() * 1000000),
    'Galatasaray - Fenerbahçe Süper Lig Derbisi',
    'Türkiye''nin en büyük futbol derbisi! Sarı-kırmızılılar ile sarı-lacivertliler Türk Telekom Stadyumu''nda karşı karşıya.',
    'Spor',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    '20 Nisan 2025',
    '19:00',
    'Türk Telekom Stadyumu',
    'Huzur Mahallesi, Ali Sami Yen Sokak, Sarıyer',
    'Istanbul',
    600,
    2000,
    'Galatasaray SK',
    0,
    41.1039,
    28.9901,
    true,
    'manual'
  ),
  (
    'manual-istanbul-coffee-festival-2025-' || floor(random() * 1000000),
    'Istanbul Coffee Festival 2025',
    'Türkiye''nin en büyük kahve festivali! Dünya kahvelerini tadın, barista workshoplarına katılın, kahve kültürünü keşfedin.',
    'Festival',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    '25 Nisan 2025',
    '10:00',
    'Istanbul Kongre Merkezi',
    'Harbiye Mahallesi, Darülbedayi Caddesi, Şişli',
    'Istanbul',
    150,
    300,
    'Istanbul Coffee Festival',
    0,
    41.0425,
    28.9865,
    false,
    'manual'
  ),
  (
    'manual-devlet-tiyatrolari-hamlet-' || floor(random() * 1000000),
    'Devlet Tiyatroları - Hamlet',
    'Shakespeare''in ölümsüz eseri Hamlet, modern yorumuyla Atatürk Kültür Merkezi''nde. Usta oyuncularla unutulmaz bir tiyatro deneyimi.',
    'Tiyatro',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
    '18 Nisan 2025',
    '20:30',
    'Atatürk Kültür Merkezi',
    'Taksim Meydanı, Beyoğlu',
    'Istanbul',
    120,
    350,
    'Devlet Tiyatroları',
    0,
    41.037,
    28.987,
    false,
    'manual'
  ),
  (
    'manual-van-gogh-the-immersive-experience-' || floor(random() * 1000000),
    'Van Gogh: The Immersive Experience',
    'Van Gogh''un muhteşem eserlerini 360 derece projeksiyon teknolojisiyle deneyimleyin. Sanatın içine dalın!',
    'Sergi',
    'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=600&fit=crop',
    '10 Nisan 2025',
    '11:00',
    'Uniq İstanbul',
    'Maslak Mahallesi, Ahi Evran Caddesi, Sarıyer',
    'Istanbul',
    200,
    400,
    'Immersive Arts',
    0,
    41.0039,
    28.7719,
    true,
    'manual'
  ),
  (
    'manual-ankara-jazz-festival-' || floor(random() * 1000000),
    'Ankara Jazz Festival',
    'Başkent''in en prestijli müzik festivali! Dünyanın en iyi caz sanatçıları Ankara''da buluşuyor.',
    'Festival',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    '5 Mayıs 2025',
    '19:00',
    'CSO Konser Salonu',
    'Atatürk Bulvarı, Opera, Çankaya',
    'Ankara',
    250,
    600,
    'Ankara Büyükşehir Belediyesi',
    0,
    39.9334,
    32.8597,
    false,
    'manual'
  ),
  (
    'manual-tech-summit-istanbul-2025-' || floor(random() * 1000000),
    'Tech Summit Istanbul 2025',
    'Türkiye''nin en büyük teknoloji konferansı. Startuplar, yatırımcılar ve girişimciler bir araya geliyor. Networking ve workshoplar.',
    'Meetup',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    '12 Nisan 2025',
    '09:00',
    'Istanbul Convention Center',
    'Ataşehir Bulvarı, Ataşehir',
    'Istanbul',
    0,
    0,
    'Tech Community Istanbul',
    0,
    41.0082,
    28.9784,
    false,
    'manual'
  ),
  (
    'manual-izmir-opera-la-traviata-' || floor(random() * 1000000),
    'İzmir Opera - La Traviata',
    'Verdi''nin ölümsüz operası La Traviata, İzmir Devlet Opera ve Balesi sahnelerinde.',
    'Tiyatro',
    'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=800&h=600&fit=crop',
    '22 Nisan 2025',
    '20:00',
    'İzmir Devlet Opera ve Balesi',
    'Mimar Sinan Mahallesi, Mithatpaşa Caddesi, Konak',
    'Izmir',
    100,
    300,
    'İzmir DOB',
    0,
    38.4192,
    27.1287,
    false,
    'manual'
  );

-- Kontrol et
SELECT COUNT(*) as total_manual_events FROM events WHERE source = 'manual';
SELECT id, title, city, date, time, address FROM events WHERE source = 'manual' ORDER BY date;
