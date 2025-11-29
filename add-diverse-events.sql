-- Çeşitli eğlenceli etkinlikler ekle - App Store screenshot'ları için

-- 1. Happy Hour - Bar İndirimi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Happy Hour - %50 İndirim',
  'Her Perşembe 18:00-20:00 arası tüm kokteyller yarı fiyatına! Canlı DJ performansı eşliğinde keyifli bir akşam geçirin. Craft biraları da indirimde!',
  'Moda Barlar Sokağı, No:15, Kadıköy',
  'İstanbul',
  40.9881,
  29.0256,
  (NOW() + INTERVAL '2 days')::date::text,
  '18:00',
  'nightlife',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 2. Trivia Night
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 3. Stand-Up Comedy Gösterisi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 4. Sabah Yoga Dersi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 5. Sulu Boya Atölyesi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 6. Film Gösterimi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 7. Kitap Kulübü
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 8. Masa Oyunları Gecesi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 9. Hafta Sonu Brunch
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 10. Şarap Tadım Gecesi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 11. Salsa Dans Dersi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 12. Fotoğrafçılık Workshop
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 13. Vintage Pazarı
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 14. Gün Batımı Meditasyonu
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 15. Craft Beer Tadımı
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
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
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 16. Akustik Konser
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Akustik Konser: Indie Rock',
  'Yerel indie müzisyenlerden akustik performanslar. Samimi bir atmosferde canlı müzik deneyimi. Sınırlı kontenjan!',
  'Babylon Bomonti, Şişli',
  'İstanbul',
  41.0582,
  28.9856,
  (NOW() + INTERVAL '8 days')::date::text,
  '21:00',
  'music',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 17. Pilates Dersi
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Mat Pilates - Temel Seviye',
  'Pilates instructoru eşliğinde mat pilates. Postür düzeltme ve core güçlendirme. Deneme dersi ücretsiz!',
  'Fit Life Studio, Levent',
  'İstanbul',
  41.0795,
  29.0114,
  (NOW() + INTERVAL '1 day')::date::text,
  '19:00',
  'sports',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 18. Sushi Workshop
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Sushi Yapım Workshop''u',
  'Japon şef eşliğinde sushi yapımını öğrenin. Maki, nigiri ve sashimi teknikleri. Yaptıklarınızı yiyebilirsiniz!',
  'Zuma Restaurant, Ortaköy',
  'İstanbul',
  41.0477,
  29.0276,
  (NOW() + INTERVAL '9 days')::date::text,
  '17:00',
  'food',
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 19. Rooftop Party
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Rooftop Sunset Party',
  'Çatı katında gün batımı partisi! DJ performansı, kokteyller ve Boğaz manzarası. Dress code: Smart Casual',
  '360 Istanbul, Beyoğlu',
  'İstanbul',
  41.0273,
  28.9775,
  (NOW() + INTERVAL '10 days')::date::text,
  '18:00',
  'nightlife',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 20. Open Mic Night
INSERT INTO events (id, title, description, location, city, latitude, longitude, date, time, category, image_url, organizer, creator_id, created_at)
VALUES (
  gen_random_uuid()::text,
  'Open Mic Night - Herkes Sahnede',
  'Müzik, şiir, stand-up... Sahnede yeteneklerini sergilemek isteyen herkes! İzleyiciler de ücretsiz.',
  'Arkaoda, Cihangir',
  'İstanbul',
  41.0328,
  28.9822,
  (NOW() + INTERVAL '4 days')::date::text,
  '20:30',
  'entertainment',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'EventMap',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);
