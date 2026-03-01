-- ============================================
-- SEED EVENTS - Ankara, İstanbul, Antalya
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- ==========================================
-- ANKARA ETKİNLİKLERİ
-- ==========================================

-- 1. Ankara Caz Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-001-' || extract(epoch from now())::text,
  'Ankara Caz Festivali',
  'Ankara''nın en prestijli caz festivali. Yerli ve yabancı caz sanatçılarının sahne alacağı bu festival, müzikseverlere unutulmaz bir gece vaat ediyor. Açık hava konseri olarak düzenlenecek etkinlikte birçok ünlü caz grubu yer alacak.',
  'Konser',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
  '15 Mart 2025',
  '20:00',
  '23:30',
  'CerModern Sanat Merkezi',
  'Altınsoy Cd. No:3, 06520 Çankaya/Ankara',
  'Ankara',
  150, 350,
  'Ankara Büyükşehir Belediyesi',
  0, 500,
  39.9255, 32.8537,
  false, 'admin-seed', 'approved', NOW()
);

-- 2. Başkent Tiyatro Günleri
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-002-' || extract(epoch from now())::text,
  'Başkent Tiyatro Günleri',
  'Türkiye''nin en iyi tiyatro toplulukları Ankara''da buluşuyor. Komedi, dram ve müzikal türlerinde birçok oyun sahnelenecek. Tiyatroseverler için kaçırılmayacak bir etkinlik.',
  'Tiyatro',
  'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
  '22 Mart 2025',
  '19:00',
  '21:30',
  'Ankara Devlet Tiyatrosu',
  'Opera Meydanı, Talatpaşa Blv., 06050 Ulus/Ankara',
  'Ankara',
  80, 200,
  'Devlet Tiyatroları Genel Müdürlüğü',
  0, 800,
  39.9427, 32.8560,
  false, 'admin-seed', 'approved', NOW()
);

-- 3. Ankara Startup Meetup
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-003-' || extract(epoch from now())::text,
  'Ankara Startup Meetup',
  'Girişimciler, yatırımcılar ve teknoloji tutkunları bir araya geliyor. Networking, pitch sunumları ve panel tartışmalarıyla dolu bir etkinlik. Kendi projenizi tanıtma fırsatı yakalayın!',
  'Meetup',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
  '10 Mart 2025',
  '18:30',
  '21:00',
  'ODTÜ Teknokent',
  'Üniversiteler Mah., İhsan Doğramacı Blv., 06800 Çankaya/Ankara',
  'Ankara',
  0, 0,
  'Ankara Startup Ekosistemi',
  0, 150,
  39.8910, 32.7784,
  false, 'admin-seed', 'approved', NOW()
);

-- 4. Anıtkabir Koşusu
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-004-' || extract(epoch from now())::text,
  'Anıtkabir Koşusu - 10K',
  'Başkent''in en güzel parkurunda 10 km koşu etkinliği. Anıtkabir çevresinde düzenlenecek yarışa her seviyeden koşucu katılabilir. Katılımcılara madalya ve tişört hediye edilecektir.',
  'Spor',
  'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop',
  '5 Nisan 2025',
  '08:00',
  '12:00',
  'Anıtkabir Çevresi',
  'Anıt Cd., Anıtkabir, 06570 Çankaya/Ankara',
  'Ankara',
  100, 100,
  'Ankara Atletizm Kulübü',
  0, 2000,
  39.9251, 32.8369,
  false, 'admin-seed', 'approved', NOW()
);

-- 5. Ankara Gastronomi Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-005-' || extract(epoch from now())::text,
  'Ankara Gastronomi Festivali',
  'Ankara''nın en lezzetli festivali! Yerel ve uluslararası mutfaklardan tatlar, şef gösterileri, yemek atölyeleri ve canlı müzik eşliğinde unutulmaz bir gastronomi deneyimi.',
  'Festival',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  '20 Mart 2025',
  '11:00',
  '22:00',
  'Kuğulu Park',
  'Kuğulu Park, Kavaklıdere Mah., 06680 Çankaya/Ankara',
  'Ankara',
  50, 50,
  'Ankara Gurme Derneği',
  0, NULL,
  39.9033, 32.8631,
  false, 'admin-seed', 'approved', NOW()
);

-- 6. Dijital Sanat Sergisi
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-ankara-006-' || extract(epoch from now())::text,
  'Dijital Sanat Sergisi - Yeni Medya',
  'Türkiye''nin önde gelen dijital sanatçılarının eserlerinin sergileneceği interaktif sergi. VR deneyimleri, projeksiyon haritalama ve yapay zeka ile üretilmiş sanat eserleri izleyiciyi bekliyor.',
  'Sergi',
  'https://images.unsplash.com/photo-1594709220830-fce8369b0bcb?w=800&h=600&fit=crop',
  '1 Nisan 2025',
  '10:00',
  '18:00',
  'CerModern Sanat Merkezi',
  'Altınsoy Cd. No:3, 06520 Çankaya/Ankara',
  'Ankara',
  40, 80,
  'CerModern',
  0, 300,
  39.9255, 32.8537,
  false, 'admin-seed', 'approved', NOW()
);


-- ==========================================
-- İSTANBUL ETKİNLİKLERİ
-- ==========================================

-- 7. İstanbul Film Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-001-' || extract(epoch from now())::text,
  'İstanbul Film Festivali',
  'Türkiye''nin en büyük film festivali bu yıl da sinema tutkunlarını bir araya getiriyor. Yerli ve yabancı yapımların gösterildiği festivalin ardından yönetmen söyleşileri ve panel tartışmaları yer alacak.',
  'Festival',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
  '12 Nisan 2025',
  '14:00',
  '23:00',
  'Atlas 1948 Sineması',
  'İstiklal Cd. No:209, 34433 Beyoğlu/İstanbul',
  'Istanbul',
  100, 250,
  'İstanbul Kültür Sanat Vakfı',
  0, 400,
  41.0349, 28.9777,
  true, 'admin-seed', 'approved', NOW()
);

-- 8. Boğaziçi Rock Konseri
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-002-' || extract(epoch from now())::text,
  'Boğaziçi Rock Konseri',
  'İstanbul''un en güzel manzarasında rock müzik gecesi! Türkiye''nin en sevilen rock grupları sahne alacak. Açık hava konseri olarak düzenlenen etkinlikte Boğaz manzarası eşliğinde müzik keyfi.',
  'Konser',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
  '25 Mart 2025',
  '20:00',
  '01:00',
  'Harbiye Açıkhava Tiyatrosu',
  'Harbiye, Taşkışla Cd., 34367 Şişli/İstanbul',
  'Istanbul',
  200, 500,
  'Rock''n İstanbul Organizasyon',
  0, 3000,
  41.0450, 28.9925,
  false, 'admin-seed', 'approved', NOW()
);

-- 9. Kadıköy Yoga & Wellness Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-003-' || extract(epoch from now())::text,
  'Kadıköy Yoga & Wellness Festivali',
  'Deniz kenarında yoga, meditasyon ve sağlıklı yaşam festivali. Uzman yoga eğitmenleriyle açık hava seansları, organik yemek stantları ve wellness atölyeleri sizi bekliyor.',
  'Spor',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
  '30 Mart 2025',
  '09:00',
  '17:00',
  'Caddebostan Sahili',
  'Caddebostan Sahil Yolu, 34728 Kadıköy/İstanbul',
  'Istanbul',
  0, 50,
  'İstanbul Yoga Topluluğu',
  0, 200,
  40.9637, 29.0656,
  false, 'admin-seed', 'approved', NOW()
);

-- 10. Contemporary İstanbul Sanat Fuarı
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-004-' || extract(epoch from now())::text,
  'Contemporary İstanbul Sanat Fuarı',
  'Türkiye''nin en önemli çağdaş sanat fuarı. Yüzlerce galeriden binlerce eser sergileniyor. Sanat koleksiyonerleri ve meraklıları için kaçırılmaz bir etkinlik.',
  'Sergi',
  'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop',
  '18 Nisan 2025',
  '10:00',
  '20:00',
  'İstanbul Kongre Merkezi',
  'Darülbedai Cd. No:5, 34367 Şişli/İstanbul',
  'Istanbul',
  120, 200,
  'Contemporary Istanbul',
  0, 1000,
  41.0467, 28.9897,
  true, 'admin-seed', 'approved', NOW()
);

-- 11. Tech İstanbul Konferansı
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-005-' || extract(epoch from now())::text,
  'Tech İstanbul Konferansı',
  'Yapay zeka, blockchain ve siber güvenlik konularında Türkiye''nin en büyük teknoloji konferansı. Sektör liderlerinden sunumlar, workshop''lar ve networking fırsatları.',
  'Meetup',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
  '8 Nisan 2025',
  '09:00',
  '18:00',
  'Haliç Kongre Merkezi',
  'Sütlüce Mah., İmrahor Cd. No:28, 34445 Beyoğlu/İstanbul',
  'Istanbul',
  0, 150,
  'Tech İstanbul',
  0, 500,
  41.0560, 28.9497,
  false, 'admin-seed', 'approved', NOW()
);

-- 12. Beşiktaş Sahne - Stand-up Gecesi
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-istanbul-006-' || extract(epoch from now())::text,
  'Beşiktaş Sahne - Stand-up Gecesi',
  'Türkiye''nin en komik komedyenleri aynı sahnede! Kahkaha dolu bir gece için biletinizi alın. Her hafta farklı komedyenlerin sahne aldığı stand-up gecesine davetlisiniz.',
  'Tiyatro',
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop',
  '28 Mart 2025',
  '21:00',
  '23:00',
  'BKM Mutfak Beşiktaş',
  'Sinanpaşa Mah., Ihlamur Nişantaşı Cd. No:16, 34353 Beşiktaş/İstanbul',
  'Istanbul',
  150, 250,
  'BKM Mutfak',
  0, 250,
  41.0459, 29.0004,
  false, 'admin-seed', 'approved', NOW()
);


-- ==========================================
-- ANTALYA ETKİNLİKLERİ
-- ==========================================

-- 13. Antalya Altın Portakal Film Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-001-' || extract(epoch from now())::text,
  'Antalya Altın Portakal Film Festivali',
  'Türk sinemasının en önemli organizasyonu olan Altın Portakal Film Festivali, bu yıl da yerli ve yabancı sinema dünyasının önde gelen isimlerini ağırlıyor. Film gösterimleri, söyleşiler ve ödül töreni.',
  'Festival',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop',
  '5 Nisan 2025',
  '15:00',
  '23:00',
  'Antalya Kültür Merkezi',
  '100. Yıl Blv., 07050 Muratpaşa/Antalya',
  'Antalya',
  50, 200,
  'Antalya Büyükşehir Belediyesi',
  0, 1500,
  36.8844, 30.6895,
  true, 'admin-seed', 'approved', NOW()
);

-- 14. Konyaaltı Plaj Voleybolu Turnuvası
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-002-' || extract(epoch from now())::text,
  'Konyaaltı Plaj Voleybolu Turnuvası',
  'Akdeniz''in masmavi sularında plaj voleybolu heyecanı! 2 kişilik takımlar halinde katılabileceğiniz turnuvada ödüller sahiplerini bulacak. İzleyiciler ücretsiz katılabilir.',
  'Spor',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
  '12 Nisan 2025',
  '10:00',
  '18:00',
  'Konyaaltı Plajı',
  'Konyaaltı Plajı, 07070 Konyaaltı/Antalya',
  'Antalya',
  0, 0,
  'Antalya Spor İl Müdürlüğü',
  0, 64,
  36.8628, 30.6380,
  false, 'admin-seed', 'approved', NOW()
);

-- 15. Kaleiçi Müzik Gecesi
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-003-' || extract(epoch from now())::text,
  'Kaleiçi Müzik Gecesi',
  'Antalya''nın tarihi Kaleiçi semtinde açık hava müzik gecesi. Akustik performanslar, yerel sanatçılar ve deniz manzarası eşliğinde unutulmaz bir akşam. Türk müziğinden caza geniş bir repertuvar.',
  'Konser',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
  '22 Mart 2025',
  '20:30',
  '00:00',
  'Kaleiçi Marina',
  'Selçuk Mah., Kaleiçi, 07100 Muratpaşa/Antalya',
  'Antalya',
  100, 200,
  'Antalya Müzik Derneği',
  0, 300,
  36.8856, 30.7036,
  false, 'admin-seed', 'approved', NOW()
);

-- 16. Antalya Yoga Kampı
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-004-' || extract(epoch from now())::text,
  'Antalya Yoga Kampı - Hafta Sonu',
  'Doğayla iç içe yoga ve meditasyon kampı. Sabah yoga seansları, nefes çalışmaları ve doğa yürüyüşleri ile huzurlu bir hafta sonu geçirin. Konaklama ve organik yemekler dahil.',
  'Spor',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
  '29 Mart 2025',
  '07:00',
  '19:00',
  'Olympos Bungalov',
  'Olympos, Kumluca, 07370 Antalya',
  'Antalya',
  500, 800,
  'Antalya Yoga Akademisi',
  0, 40,
  36.3977, 30.4719,
  false, 'admin-seed', 'approved', NOW()
);

-- 17. Antalya Tiyatro Festivali
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-005-' || extract(epoch from now())::text,
  'Antalya Uluslararası Tiyatro Festivali',
  'Aspendos Antik Tiyatrosu''nda gerçekleşecek uluslararası tiyatro festivali. 2000 yıllık tarihi mekanda dünya tiyatrosunun en seçkin yapımları sahnelenecek.',
  'Tiyatro',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
  '15 Nisan 2025',
  '20:00',
  '22:30',
  'Aspendos Antik Tiyatrosu',
  'Aspendos, Serik, 07500 Antalya',
  'Antalya',
  150, 400,
  'Antalya Kültür ve Turizm Müdürlüğü',
  0, 1000,
  36.9390, 31.1712,
  true, 'admin-seed', 'approved', NOW()
);

-- 18. Side Fotoğraf Sergisi
INSERT INTO events (
  id, title, description, category, image_url, date, time, end_time,
  location, address, city, price_min, price_max, organizer, attendees,
  max_attendees, latitude, longitude, is_premium, source, status, submitted_at
) VALUES (
  'seed-antalya-006-' || extract(epoch from now())::text,
  'Side Antik Kent Fotoğraf Sergisi',
  'Antalya''nın tarihi ve doğal güzelliklerini anlatan fotoğraf sergisi. Profesyonel fotoğrafçıların gözünden Akdeniz, antik kentler ve yerel yaşam. Sergi süresince fotoğraf atölyeleri de düzenlenecek.',
  'Sergi',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop',
  '8 Nisan 2025',
  '10:00',
  '19:00',
  'Side Müzesi',
  'Side, Manavgat, 07330 Antalya',
  'Antalya',
  30, 30,
  'Antalya Fotoğrafçılar Derneği',
  0, 200,
  36.7672, 31.3901,
  false, 'admin-seed', 'approved', NOW()
);


-- ==========================================
-- DOĞRULAMA
-- ==========================================
SELECT
  city,
  count(*) as etkinlik_sayisi
FROM events
WHERE source = 'admin-seed'
GROUP BY city
ORDER BY city;
