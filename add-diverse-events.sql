-- Çeşitli küçük etkinlikler ekle (barlar, indirimler, atölyeler, vb.)

-- 1. Happy Hour - Bar İndirimi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Happy Hour - %50 İndirim',
  'Her Perşembe 18:00-20:00 arası tüm kokteyller yarı fiyatına! Canlı DJ performansı eşliğinde keyifli bir akşam geçirin.',
  'Moda Barlar Sokağı, No:15, Kadıköy',
  'İstanbul',
  40.9881,
  29.0256,
  (NOW() + INTERVAL '2 days')::date::text,
  '18:00',
  'nightlife',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  'EventMap',
  NOW()
);

-- 2. Trivia Night
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Trivia Night - Bilgi Yarışması',
  'Arkadaşlarınızla takım olun ve ödüller kazanmak için yarışın! Kategori: Genel Kültür, Pop Kültür, Spor. Giriş ücretsiz.',
  'The Beerhouse, Asmalımescit, Beyoğlu',
  'İstanbul',
  41.0311,
  28.9756,
  (NOW() + INTERVAL '3 days')::date::text,
  '20:00',
  'entertainment',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',
  'EventMap',
  NOW()
);

-- 3. Stand-Up Comedy Gösterisi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Stand-Up Comedy Gecesi',
  'Türkiye''nin en komik stand-up''çılarından oluşan muhteşem bir kadro! Sınırlı sayıda bilet. Erken rezervasyon yapın.',
  'Kumbaracı50, Kuloğlu Mah, Beyoğlu',
  'İstanbul',
  41.0339,
  28.9869,
  (NOW() + INTERVAL '5 days')::date::text,
  '21:00',
  'entertainment',
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
  'EventMap',
  NOW()
);

-- 4. Sabah Yoga Dersi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Sabah Yoga - Güne Enerjik Başlayın',
  'Deneyimli yoga eğitmeni eşliğinde sabah yogası. Tüm seviyeler katılabilir. Mat ve ekipman sağlanır. İlk ders ücretsiz!',
  'Maçka Parkı, Şişli',
  'İstanbul',
  41.0458,
  28.9928,
  (NOW() + INTERVAL '1 day')::date::text,
  '08:00',
  'sports',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  'EventMap',
  NOW()
);

-- 5. Resim Atölyesi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Sulu Boya Resim Atölyesi',
  'Hiç resim deneyimi olmayanlar için sulu boya atölyesi. Tüm malzemeler dahil. Kendi eserinizi yaratın ve eve götürün!',
  'Artsteps Atölye, Nişantaşı',
  'İstanbul',
  41.0486,
  28.9939,
  (NOW() + INTERVAL '4 days')::date::text,
  '14:00',
  'arts',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
  'EventMap',
  NOW()
);

-- 6. Film Gösterimi & Tartışma
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Klasik Film Gecesi: Casablanca',
  'Sinema severlerin buluşma noktası! Film sonrası yönetmen ve oyuncular hakkında sohbet. Ücretsiz patlamış mısır.',
  'Kadıköy Sineması, Kadıköy',
  'İstanbul',
  40.9892,
  29.0254,
  (NOW() + INTERVAL '6 days')::date::text,
  '19:00',
  'arts',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
  'EventMap',
  NOW()
);

-- 7. Kitap Kulübü Buluşması
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Kitap Kulübü: Ayın Kitabı Tartışması',
  'Bu ayki kitap: "Tutunamayanlar" - Oğuz Atay. Kahve eşliğinde kitap sohbeti. Yeni üyeler hoş geldiniz!',
  'Pandora Kitabevi Cafe, Beyoğlu',
  'İstanbul',
  41.0361,
  28.9833,
  (NOW() + INTERVAL '7 days')::date::text,
  '15:00',
  'education',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
  'EventMap',
  NOW()
);

-- 8. Board Game Night
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Masa Oyunları Gecesi',
  '100+ farklı masa oyunu! Catan, Monopoly, Cards Against Humanity ve daha fazlası. Yeni arkadaşlar edinin!',
  'Oyuncu Cafe, Kadıköy',
  'İstanbul',
  40.9902,
  29.0263,
  (NOW() + INTERVAL '3 days')::date::text,
  '19:00',
  'entertainment',
  'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
  'EventMap',
  NOW()
);

-- 9. Brunch Etkinliği
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Hafta Sonu Brunch Keyfi',
  'Sınırsız kahve ve çay eşliğinde zengin brunch menüsü. Rezervasyon zorunlu. Vejeteryan seçenekler mevcut.',
  'Kahvaltıcı, Cihangir, Beyoğlu',
  'İstanbul',
  41.0322,
  28.9814,
  (NOW() + INTERVAL '2 days')::date::text,
  '11:00',
  'food',
  'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800',
  'EventMap',
  NOW()
);

-- 10. Wine Tasting - Şarap Tadımı
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Şarap Tadım Gecesi - Anadolu Şarapları',
  'Uzman sommelier eşliğinde 6 farklı Türk şarabı tadımı. Peynir ve meze ikramı dahil. Başlangıç seviyesine uygun.',
  'Sensus Wine Bar, Nişantaşı',
  'İstanbul',
  41.0492,
  28.9944,
  (NOW() + INTERVAL '5 days')::date::text,
  '19:00',
  'food',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  'EventMap',
  NOW()
);

-- 11. Salsa Dans Dersi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Başlangıç Salsa Dans Dersi',
  'Latin danslarını öğrenin! Partnersiz gelebilirsiniz. Ders sonrası pratik için sosyal dans partisi.',
  'DanceLife Studio, Kadıköy',
  'İstanbul',
  40.9885,
  29.0242,
  (NOW() + INTERVAL '4 days')::date::text,
  '20:00',
  'sports',
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800',
  'EventMap',
  NOW()
);

-- 12. Fotoğrafçılık Workshop'u
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Sokak Fotoğrafçılığı Workshop',
  'Profesyonel fotoğrafçı ile İstanbul sokaklarında fotoğraf turu. Kompozisyon, ışık ve hikaye anlatımı teknikleri.',
  'Galata Kulesi Buluşma Noktası, Beyoğlu',
  'İstanbul',
  41.0256,
  28.9742,
  (NOW() + INTERVAL '6 days')::date::text,
  '10:00',
  'education',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
  'EventMap',
  NOW()
);

-- 13. Vintage Market
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Vintage Pazarı - 2. El & Antika',
  'Vintage kıyafetler, plaklar, kitaplar ve dekorasyon eşyaları. 50+ satıcı. Giriş ücretsiz!',
  'Kadıköy Rıhtım, Kadıköy',
  'İstanbul',
  40.9897,
  29.0281,
  (NOW() + INTERVAL '2 days')::date::text,
  '12:00',
  'entertainment',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
  'EventMap',
  NOW()
);

-- 14. Meditasyon Seansı
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Gün Batımı Meditasyonu',
  'Boğaz manzarası eşliğinde rehberli meditasyon. Stress ve kaygıdan arınma. Yoga matı getirin.',
  'Fethi Paşa Korusu, Üsküdar',
  'İstanbul',
  41.0211,
  29.0253,
  (NOW() + INTERVAL '3 days')::date::text,
  '18:30',
  'sports',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  'EventMap',
  NOW()
);

-- 15. Craft Beer Tasting
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, created_at)
VALUES (
  gen_random_uuid()::text,
  'Craft Beer Tadım Etkinliği',
  'Türkiye''nin en iyi craft bira üreticilerinden 8 farklı bira tadımı. Bira yapım süreci hakkında bilgilendirme.',
  'Taps Craft Beer Bar, Kadıköy',
  'İstanbul',
  40.9908,
  29.0268,
  (NOW() + INTERVAL '7 days')::date::text,
  '20:00',
  'food',
  'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800',
  'EventMap',
  NOW()
);
