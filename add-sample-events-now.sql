-- Delete existing sample events to avoid duplicates
DELETE FROM events WHERE id IN ('1', '2', '3', '4', '5');

-- Insert fresh sample events
INSERT INTO events (id, title, description, category, image_url, date, time, location, city, price_min, price_max, organizer, attendees, latitude, longitude, source)
VALUES
  ('1', 'Istanbul Jazz Festival', 'Dünyanın en ünlü caz sanatçılarını ağırlayan prestijli festival. Zorlu PSM''de 3 gün boyunca unutulmaz bir müzik şöleni.', 'Festival', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop', '15 Kasım', '20:00', 'Zorlu PSM', 'Istanbul', 350, 800, 'Istanbul Kültür Sanat Vakfı', 1250, 41.0661, 29.0128, 'biletix'),

  ('2', 'Galatasaray vs Fenerbahçe', 'Türkiye''nin en büyük derbisi! Sarı-kırmızı ve sarı-lacivertli takımlar arasındaki tarihi rekabet.', 'Spor', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop', '20 Kasım', '19:00', 'Türk Telekom Stadyumu', 'Istanbul', 500, 1500, 'Galatasaray SK', 45000, 41.1039, 28.9901, 'passo'),

  ('3', 'React & TypeScript Workshop', 'Modern web geliştirme teknikleri üzerine interaktif workshop. Hands-on projeler ve networking fırsatı.', 'Meetup', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', '18 Kasım', '14:00', 'Impact Hub', 'Istanbul', 0, 0, 'Istanbul Tech Community', 85, 41.0082, 28.9784, 'meetup'),

  ('4', 'Devlet Tiyatroları - Hamlet', 'Shakespeare''in ölümsüz eseri Hamlet, modern yorumuyla sahnede. Usta oyuncularla unutulmaz bir gece.', 'Tiyatro', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop', '22 Kasım', '20:30', 'Atatürk Kültür Merkezi', 'Istanbul', 150, 400, 'Devlet Tiyatroları', 320, 41.0370, 28.9870, 'biletinial'),

  ('5', 'Sertab Erener Konseri', 'Pop müziğin kraliçesi Sertab Erener, sevilen şarkılarıyla unutulmaz bir konser verecek.', 'Konser', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop', '25 Kasım', '21:00', 'Ankara Arena', 'Ankara', 400, 1200, 'Live Nation Turkey', 2800, 39.9334, 32.8597, 'biletix');

-- Verify insertion
SELECT COUNT(*) as total_events FROM events;
SELECT id, title, city FROM events LIMIT 5;
