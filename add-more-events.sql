-- Add More Sample Events to EventMap Database
-- Copy and paste this into Supabase SQL Editor

INSERT INTO events (id, title, description, category, image_url, date, time, location, city, price_min, price_max, organizer, attendees, latitude, longitude, source)
VALUES
  -- Istanbul Events
  ('6', 'Tarkan - Yeni Yıl Konseri', 'Türk pop müziğinin efsanevi ismi Tarkan, yeni yılı muhteşem bir konserle karşılıyor. Unutulmaz şarkılar ve özel performanslar.', 'Konser', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop', '31 Aralık', '22:00', 'Volkswagen Arena', 'Istanbul', 600, 2000, 'Live Nation Turkey', 8000, 41.1039, 28.9901, 'biletix'),

  ('7', 'Istanbul Art Fair 2025', 'Türkiye ve dünyanın önde gelen galerileri ve sanatçıları ile çağdaş sanat fuarı. 150+ galeri, 500+ sanatçı.', 'Sergi', 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop', '10 Ocak', '10:00', 'Haliç Kongre Merkezi', 'Istanbul', 200, 200, 'Istanbul Foundation for Culture and Arts', 2500, 41.0433, 28.9456, 'biletinial'),

  ('8', 'Beşiktaş vs Trabzonspor', 'Süper Lig''in iddialı takımları arasındaki heyecan dolu maç. Karakartalların evinde kritik 3 puan mücadelesi.', 'Spor', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop', '8 Ocak', '19:00', 'Vodafone Park', 'Istanbul', 400, 1200, 'Beşiktaş JK', 38000, 41.0391, 29.0029, 'passo'),

  ('9', 'Tech Summit Istanbul 2025', 'Teknoloji liderleri, startup''lar ve yatırımcılar bir araya geliyor. AI, Blockchain, Fintech konuşmaları.', 'Meetup', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop', '25 Ocak', '09:00', 'Istanbul Congress Center', 'Istanbul', 0, 0, 'Techcrunch Turkey', 1500, 41.0430, 28.9869, 'meetup'),

  ('10', 'Müslüm Gürses - Anma Konseri', 'Müslüm Babanın unutulmaz şarkıları, sevilen sanatçılar tarafından seslendirilecek. Duygusal bir gece.', 'Konser', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop', '15 Ocak', '20:30', 'Cemil Topuzlu Açıkhava Tiyatrosu', 'Istanbul', 250, 600, 'Harbiye Production', 3500, 41.0474, 29.0086, 'biletix'),

  -- Ankara Events
  ('11', 'Ankara Uluslararası Film Festivali', 'Dünya sinemasından seçkin filmler, yönetmen söyleşileri ve kırmızı halı gecesi. 7 gün film şöleni.', 'Festival', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop', '20 Ocak', '18:00', 'Kültür ve Kongre Merkezi', 'Ankara', 150, 400, 'Ankara Büyükşehir Belediyesi', 850, 39.9046, 32.8598, 'biletinial'),

  ('12', 'MKE Ankaragücü vs Samsunspor', 'Ankara''nın köklü takımı evinde önemli bir karşılaşmaya çıkıyor. Sarı-lacivertli taraftarlar tribünde.', 'Spor', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop', '12 Ocak', '16:00', 'Eryaman Stadyumu', 'Ankara', 200, 500, 'MKE Ankaragücü', 15000, 39.9739, 32.6914, 'passo'),

  ('13', 'Startup Weekend Ankara', 'Girişimcilik tutkunu gençler için 54 saatlik yoğun hackathon. Fikir aşamasından MVP''ye.', 'Meetup', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop', '2 Şubat', '17:00', 'METU Teknokent', 'Ankara', 0, 0, 'Techstars Ankara', 200, 39.8938, 32.7803, 'meetup'),

  ('14', 'Romeo ve Juliet - Bale Gösterisi', 'Ankara Devlet Opera ve Balesi''nin muhteşem yorumuyla klasik aşk hikayesi. Ödüllü koreografi.', 'Tiyatro', 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop', '28 Ocak', '20:00', 'Ankara Opera Binası', 'Ankara', 180, 450, 'Ankara Devlet Opera ve Balesi', 680, 39.9334, 32.8597, 'biletinial'),

  -- Izmir Events
  ('15', 'Izmir Avrupa Caz Festivali', 'Akdeniz''in incisinde dünya müziği ve caz. Yaz akşamlarında müzik keyfi. Deniz manzaralı sahne.', 'Festival', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', '5 Temmuz', '21:00', 'Açıkhava Tiyatrosu', 'Izmir', 300, 700, 'Izmir Kültür Platformu', 1200, 38.4237, 27.1428, 'biletix'),

  ('16', 'Göztepe vs Konyaspor', 'Göztepe''nin son yıllarda yükselen grafiği devam ediyor. Gürsel Aksel''de kritik maç.', 'Spor', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop', '18 Ocak', '14:00', 'Gürsel Aksel Stadyumu', 'Izmir', 250, 600, 'Göztepe SK', 12000, 38.4188, 27.1281, 'passo'),

  ('17', 'Demir Demirkan Akustik', 'Rock müziğin usta ismi Demir Demirkan, sevilen şarkılarını akustik yorumlarla seslendiriyor.', 'Konser', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop', '22 Ocak', '21:00', 'Bostanlı Suat Taşer Açıkhava', 'Izmir', 350, 800, 'Live Production', 2000, 38.4638, 27.0744, 'biletix'),

  ('18', 'React Native Workshop - Izmir', 'Mobil uygulama geliştirme workshop''u. Sıfırdan React Native ile cross-platform app geliştirin.', 'Meetup', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop', '30 Ocak', '13:00', 'Izmir Ekonomi Üniversitesi', 'Izmir', 0, 0, 'Izmir Developer Community', 120, 38.3687, 27.2191, 'meetup'),

  -- Antalya Events
  ('19', 'Antalya Uluslararası Film Festivali', 'Akdeniz''in kalbinde sinema şöleni. Ulusal ve uluslararası yarışma kategorileri, jüri özel ödülleri.', 'Festival', 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=800&h=600&fit=crop', '15 Şubat', '19:00', 'Antalya Kültür Merkezi', 'Antalya', 200, 500, 'Antalya Film Derneği', 600, 36.8969, 30.7133, 'biletinial'),

  ('20', 'Alanyaspor vs Kasımpaşa', 'Akdeniz''in güneşi altında futbol keyfi. Alanyaspor evinde galibiyeti hedefliyor.', 'Spor', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop', '26 Ocak', '17:00', 'Bahçeşehir Okulları Stadyumu', 'Antalya', 200, 450, 'Alanyaspor', 8500, 36.5465, 31.9948, 'passo'),

  -- Bursa Events
  ('21', 'Bursa Uluslararası Bale Festivali', 'Dünyanın önde gelen bale toplulukları Bursa''da buluşuyor. Klasik ve modern bale gösterileri.', 'Festival', 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop', '10 Şubat', '20:00', 'Bursa Uludağ Kongre Merkezi', 'Bursa', 250, 600, 'Bursa Büyükşehir Belediyesi', 450, 40.1826, 29.0665, 'biletinial'),

  ('22', 'Bursaspor vs Adanaspor', 'Yeşil beyazlı takımın Timsah Arena''daki coşkulu maçı. Bursa taraftarı tribünlerde.', 'Spor', 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=800&h=600&fit=crop', '2 Şubat', '19:00', 'Timsah Arena', 'Bursa', 180, 400, 'Bursaspor', 20000, 40.2332, 28.7806, 'passo'),

  -- Adana Events
  ('23', 'Adana Lezzet Festivali', 'Adana mutfağının en lezzetli örnekleri, masterclass''lar ve şef sunumları. Kebap şöleni!', 'Festival', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', '20 Mart', '11:00', 'Merkez Park', 'Adana', 0, 0, 'Adana Büyükşehir Belediyesi', 5000, 37.0000, 35.3213, 'meetup'),

  ('24', 'Adana Demirspor vs Giresunspor', 'Mavi şimşeklerin evinde kritik lig maçı. Yeni Adana Stadyumu''nda heyecan.', 'Spor', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop', '9 Şubat', '16:00', 'Yeni Adana Stadyumu', 'Adana', 150, 350, 'Adana Demirspor', 22000, 37.0074, 35.3305, 'passo'),

  -- Konya Events
  ('25', 'Mevlana Anma Törenleri ve Şeb-i Arus', 'Mevlana''nın vuslat yıldönümü anısına sema gösterileri ve dini törenler. Mistik bir hafta.', 'Tiyatro', 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop', '17 Aralık', '19:00', 'Mevlana Kültür Merkezi', 'Konya', 0, 0, 'Konya Büyükşehir Belediyesi', 3000, 37.8746, 32.4932, 'biletinial'),

  ('26', 'Konyaspor vs Kayserispor', 'Anadolu derbisi! Yeşil beyazlılar Konya Büyükşehir Stadyumu''nda avantaj arıyor.', 'Spor', 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&h=600&fit=crop', '16 Şubat', '16:00', 'Konya Büyükşehir Belediye Stadyumu', 'Konya', 150, 400, 'Konyaspor', 28000, 37.9405, 32.5258, 'passo'),

  -- Gaziantep Events
  ('27', 'Gaziantep Film Festivali', 'Genç sinemacıların ve bağımsız yapımcıların buluşma noktası. Ulusal yarışma ve workshoplar.', 'Festival', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop', '5 Mart', '18:00', 'Gaziantep Sanat Merkezi', 'Gaziantep', 100, 250, 'Gaziantep Sinema Derneği', 400, 37.0662, 37.3833, 'biletinial'),

  ('28', 'Gaziantep FK vs Rizespor', 'Güneydoğu''nun gözbebeği takımı evinde galibiyeti hedefliyor. Kalyon Stadyumu''nda heyecan.', 'Spor', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop', '23 Şubat', '14:00', 'Kalyon Stadyumu', 'Gaziantep', 150, 350, 'Gaziantep FK', 16000, 37.0375, 37.3564, 'passo'),

  -- Eskişehir Events
  ('29', 'Eskişehir Uluslararası Festivali', 'Sanat, kültür ve müziğin buluştuğu renkli festival. Sokak gösterileri ve konserler.', 'Festival', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop', '1 Mayıs', '14:00', 'Sazova Bilim ve Sanat Parkı', 'Eskişehir', 0, 0, 'Eskişehir Büyükşehir Belediyesi', 10000, 39.7767, 30.5206, 'meetup'),

  ('30', 'Eskişehirspor vs Boluspor', 'Kırmızı siyahlılar evinde galibiyetle çıkış arıyor. Eski Eskişehir Atatürk Stadyumu''nda maç.', 'Spor', 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&h=600&fit=crop', '3 Mart', '15:00', 'Eskişehir Atatürk Stadyumu', 'Eskişehir', 120, 300, 'Eskişehirspor', 9000, 39.7659, 30.5256, 'passo')

ON CONFLICT (id) DO NOTHING;

-- Update attendee counts randomly for more realistic data
UPDATE events SET attendees = FLOOR(RANDOM() * (price_max - price_min + 1000) + 200)::INTEGER
WHERE id IN ('6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully added 25 more events!';
  RAISE NOTICE 'Total events in database: 30';
  RAISE NOTICE 'Cities covered: Istanbul, Ankara, Izmir, Antalya, Bursa, Adana, Konya, Gaziantep, Eskişehir';
  RAISE NOTICE 'Categories: Konser, Festival, Spor, Tiyatro, Meetup, Sergi';
END $$;
