-- Çeşitli küçük etkinlikler ekle (barlar, indirimler, atölyeler, vb.)

-- 1. Happy Hour - Bar İndirimi
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Happy Hour - %50 İndirim',
  'Her Perşembe 18:00-20:00 arası tüm kokteyller yarı fiyatına! Canlı DJ performansı eşliğinde keyifli bir akşam geçirin.',
  'Moda Barlar Sokağı, No:15, Kadıköy, İstanbul',
  40.9881,
  29.0256,
  NOW() + INTERVAL '2 days' + INTERVAL '18 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '20 hours',
  'nightlife',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 2. Trivia Night
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Trivia Night - Bilgi Yarışması',
  'Arkadaşlarınızla takım olun ve ödüller kazanmak için yarışın! Kategori: Genel Kültür, Pop Kültür, Spor. Giriş ücretsiz.',
  'The Beerhouse, Asmalımescit, Beyoğlu, İstanbul',
  41.0311,
  28.9756,
  NOW() + INTERVAL '3 days' + INTERVAL '20 hours',
  NOW() + INTERVAL '3 days' + INTERVAL '23 hours',
  'entertainment',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 3. Stand-Up Comedy Gösterisi
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Stand-Up Comedy Gecesi',
  'Türkiye''nin en komik stand-up''çılarından oluşan muhteşem bir kadro! Sınırlı sayıda bilet. Erken rezervasyon yapın.',
  'Kumbaracı50, Kuloğlu Mah, Beyoğlu, İstanbul',
  41.0339,
  28.9869,
  NOW() + INTERVAL '5 days' + INTERVAL '21 hours',
  NOW() + INTERVAL '5 days' + INTERVAL '23 hours 30 minutes',
  'entertainment',
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 4. Sabah Yoga Dersi
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Sabah Yoga - Güne Enerjik Başlayın',
  'Deneyimli yoga eğitmeni eşliğinde sabah yogası. Tüm seviyeler katılabilir. Mat ve ekipman sağlanır. İlk ders ücretsiz!',
  'Maçka Parkı, Şişli, İstanbul',
  41.0458,
  28.9928,
  NOW() + INTERVAL '1 day' + INTERVAL '8 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '9 hours 30 minutes',
  'sports',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 5. Resim Atölyesi
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Sulu Boya Resim Atölyesi',
  'Hiç resim deneyimi olmayanlar için sulu boya atölyesi. Tüm malzemeler dahil. Kendi eserinizi yaratın ve eve götürün!',
  'Artsteps Atölye, Nişantaşı, İstanbul',
  41.0486,
  28.9939,
  NOW() + INTERVAL '4 days' + INTERVAL '14 hours',
  NOW() + INTERVAL '4 days' + INTERVAL '17 hours',
  'arts',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 6. Film Gösterimi & Tartışma
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Klasik Film Gecesi: Casablanca',
  'Sinema severlerin buluşma noktası! Film sonrası yönetmen ve oyuncular hakkında sohbet. Ücretsiz patlamış mısır.',
  'Kadıköy Sineması, Kadıköy, İstanbul',
  40.9892,
  29.0254,
  NOW() + INTERVAL '6 days' + INTERVAL '19 hours',
  NOW() + INTERVAL '6 days' + INTERVAL '22 hours',
  'arts',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 7. Kitap Kulübü Buluşması
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Kitap Kulübü: Ayın Kitabı Tartışması',
  'Bu ayki kitap: "Tutunamayanlar" - Oğuz Atay. Kahve eşliğinde kitap sohbeti. Yeni üyeler hoş geldiniz!',
  'Pandora Kitabevi Cafe, Beyoğlu, İstanbul',
  41.0361,
  28.9833,
  NOW() + INTERVAL '7 days' + INTERVAL '15 hours',
  NOW() + INTERVAL '7 days' + INTERVAL '17 hours',
  'education',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 8. Board Game Night
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Masa Oyunları Gecesi',
  '100+ farklı masa oyunu! Catan, Monopoly, Cards Against Humanity ve daha fazlası. Yeni arkadaşlar edinin!',
  'Oyuncu Cafe, Kadıköy, İstanbul',
  40.9902,
  29.0263,
  NOW() + INTERVAL '3 days' + INTERVAL '19 hours',
  NOW() + INTERVAL '3 days' + INTERVAL '23 hours 30 minutes',
  'entertainment',
  'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 9. Brunch Etkinliği
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Hafta Sonu Brunch Keyfi',
  'Sınırsız kahve ve çay eşliğinde zengin brunch menüsü. Rezervasyon zorunlu. Vejeteryan seçenekler mevcut.',
  'Kahvaltıcı, Cihangir, Beyoğlu, İstanbul',
  41.0322,
  28.9814,
  NOW() + INTERVAL '2 days' + INTERVAL '11 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '15 hours',
  'food',
  'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 10. Wine Tasting - Şarap Tadımı
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Şarap Tadım Gecesi - Anadolu Şarapları',
  'Uzman sommelier eşliğinde 6 farklı Türk şarabı tadımı. Peynir ve meze ikramı dahil. Başlangıç seviyesine uygun.',
  'Sensus Wine Bar, Nişantaşı, İstanbul',
  41.0492,
  28.9944,
  NOW() + INTERVAL '5 days' + INTERVAL '19 hours',
  NOW() + INTERVAL '5 days' + INTERVAL '21 hours 30 minutes',
  'food',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 11. Salsa Dans Dersi
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Başlangıç Salsa Dans Dersi',
  'Latin danslarını öğrenin! Partnersiz gelebilirsiniz. Ders sonrası pratik için sosyal dans partisi.',
  'DanceLife Studio, Kadıköy, İstanbul',
  40.9885,
  29.0242,
  NOW() + INTERVAL '4 days' + INTERVAL '20 hours',
  NOW() + INTERVAL '4 days' + INTERVAL '22 hours',
  'sports',
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 12. Fotoğrafçılık Workshop'u
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Sokak Fotoğrafçılığı Workshop',
  'Profesyonel fotoğrafçı ile İstanbul sokaklarında fotoğraf turu. Kompozisyon, ışık ve hikaye anlatımı teknikleri.',
  'Galata Kulesi Buluşma Noktası, Beyoğlu, İstanbul',
  41.0256,
  28.9742,
  NOW() + INTERVAL '6 days' + INTERVAL '10 hours',
  NOW() + INTERVAL '6 days' + INTERVAL '14 hours',
  'education',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 13. Vintage Market
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Vintage Pazarı - 2. El & Antika',
  'Vintage kıyafetler, plaklar, kitaplar ve dekorasyon eşyaları. 50+ satıcı. Giriş ücretsiz!',
  'Kadıköy Rıhtım, Kadıköy, İstanbul',
  40.9897,
  29.0281,
  NOW() + INTERVAL '2 days' + INTERVAL '12 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '19 hours',
  'entertainment',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 14. Meditasyon Seansı
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Gün Batımı Meditasyonu',
  'Boğaz manzarası eşliğinde rehberli meditasyon. Stress ve kaygıdan arınma. Yoga matı getirin.',
  'Fethi Paşa Korusu, Üsküdar, İstanbul',
  41.0211,
  29.0253,
  NOW() + INTERVAL '3 days' + INTERVAL '18 hours 30 minutes',
  NOW() + INTERVAL '3 days' + INTERVAL '19 hours 30 minutes',
  'sports',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- 15. Craft Beer Tasting
INSERT INTO events (title, description, location, latitude, longitude, start_date, end_date, category, image_url, organizer_id, created_at)
VALUES (
  'Craft Beer Tadım Etkinliği',
  'Türkiye''nin en iyi craft bira üreticilerinden 8 farklı bira tadımı. Bira yapım süreci hakkında bilgilendirme.',
  'Taps Craft Beer Bar, Kadıköy, İstanbul',
  40.9908,
  29.0268,
  NOW() + INTERVAL '7 days' + INTERVAL '20 hours',
  NOW() + INTERVAL '7 days' + INTERVAL '22 hours',
  'food',
  'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);
