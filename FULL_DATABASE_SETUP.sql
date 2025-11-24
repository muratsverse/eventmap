-- =============================================
-- EVENTMAP COMPLETE DATABASE SETUP
-- =============================================
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın
-- Tüm tabloları, kolonları, admin sistemini ve storage'ı kurar

-- =============================================
-- STEP 1: EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
-- STEP 2: PROFILES TABLE (Kullanıcı profilleri)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_photo TEXT,
  cover_photo TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE  -- YENİ: Admin yetkisi
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- STEP 3: EVENTS TABLE (Etkinlikler - TÜM KOLONLAR)
-- =============================================

-- Önce mevcut tabloyu kontrol et, eksik kolonları ekle
DO $$
BEGIN
  -- address kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='address') THEN
    ALTER TABLE events ADD COLUMN address TEXT;
  END IF;

  -- end_time kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='end_time') THEN
    ALTER TABLE events ADD COLUMN end_time TEXT;
  END IF;

  -- status kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='status') THEN
    ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'inReview'
      CHECK (status IN ('draft', 'inReview', 'approved', 'rejected'));
  END IF;

  -- rejection_reason kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='rejection_reason') THEN
    ALTER TABLE events ADD COLUMN rejection_reason TEXT;
  END IF;

  -- submitted_at kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='submitted_at') THEN
    ALTER TABLE events ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- reviewed_at kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='reviewed_at') THEN
    ALTER TABLE events ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- reviewed_by kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='reviewed_by') THEN
    ALTER TABLE events ADD COLUMN reviewed_by UUID REFERENCES auth.users(id);
  END IF;

  -- report_count kolonu yoksa ekle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='events' AND column_name='report_count') THEN
    ALTER TABLE events ADD COLUMN report_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_creator ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_submitted_at ON events(submitted_at);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST (location_point);

-- RLS Policies - Mevcut politikaları kaldır ve yenilerini ekle
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

-- YENİ POLICY: Sadece onaylanmış etkinlikler herkese görünür
CREATE POLICY "Approved events are viewable by everyone" ON events
  FOR SELECT USING (
    status = 'approved' OR
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Kullanıcılar etkinlik oluşturabilir (otomatik inReview)
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Kullanıcılar kendi etkinliklerini güncelleyebilir
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Kullanıcılar kendi etkinliklerini silebilir
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- =============================================
-- STEP 4: EVENT REPORTS TABLE (Spam raporları)
-- =============================================
CREATE TABLE IF NOT EXISTS event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'fake', 'duplicate', 'other')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, reporter_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reports_event ON event_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reports_reporter ON event_reports(reporter_id);

ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;

-- Raporlar sadece adminler tarafından görülebilir
DROP POLICY IF EXISTS "Only admins can view reports" ON event_reports;
CREATE POLICY "Only admins can view reports" ON event_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Herkes rapor oluşturabilir
DROP POLICY IF EXISTS "Anyone can create reports" ON event_reports;
CREATE POLICY "Anyone can create reports" ON event_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- =============================================
-- STEP 5: ADMIN NOTIFICATIONS TABLE (Admin bildirimleri)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_event', 'report', 'update')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(is_read);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Sadece adminler bildirimleri görebilir
DROP POLICY IF EXISTS "Only admins can view notifications" ON admin_notifications;
CREATE POLICY "Only admins can view notifications" ON admin_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Adminler bildirimleri "okundu" olarak işaretleyebilir
DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- =============================================
-- STEP 6: FAVORITES TABLE (Favoriler)
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_id TEXT REFERENCES events ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, event_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove favorites" ON favorites;
CREATE POLICY "Users can remove favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- STEP 7: ATTENDANCES TABLE (Katılımlar)
-- =============================================
CREATE TABLE IF NOT EXISTS attendances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_id TEXT REFERENCES events ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, event_id)
);

ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own attendances" ON attendances;
CREATE POLICY "Users can view own attendances" ON attendances
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark attendance" ON attendances;
CREATE POLICY "Users can mark attendance" ON attendances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove attendance" ON attendances;
CREATE POLICY "Users can remove attendance" ON attendances
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- STEP 8: FUNCTIONS & TRIGGERS
-- =============================================

-- Function: location_point güncelleme
CREATE OR REPLACE FUNCTION update_event_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_location_point_trigger ON events;
CREATE TRIGGER update_event_location_point_trigger
  BEFORE INSERT OR UPDATE OF latitude, longitude ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_location_point();

-- Function: Yakındaki etkinlikleri bul
CREATE OR REPLACE FUNCTION nearby_events(
  lat NUMERIC,
  long NUMERIC,
  distance_km NUMERIC DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  distance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    ROUND(
      ST_Distance(
        e.location_point,
        ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography
      ) / 1000
    ) AS distance
  FROM events e
  WHERE ST_DWithin(
    e.location_point,
    ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
    distance_km * 1000
  )
  AND e.status = 'approved'  -- Sadece onaylı etkinlikler
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function: Yeni kullanıcı kaydında otomatik profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Etkinlik oluşturulduğunda admin bildirimi gönder
CREATE OR REPLACE FUNCTION notify_admin_new_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'inReview' THEN
    INSERT INTO admin_notifications (event_id, type, title, message, creator_id)
    VALUES (
      NEW.id,
      'new_event',
      'Yeni Etkinlik Onay Bekliyor',
      'Yeni bir etkinlik oluşturuldu: ' || NEW.title,
      NEW.creator_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_admin_on_event_create ON events;
CREATE TRIGGER notify_admin_on_event_create
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_event();

-- Function: Rapor sayısını güncelle
CREATE OR REPLACE FUNCTION increment_report_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET report_count = report_count + 1
  WHERE id = NEW.event_id;

  -- 3 rapor alınca admin bildirimi gönder
  IF (SELECT report_count FROM events WHERE id = NEW.event_id) >= 3 THEN
    INSERT INTO admin_notifications (event_id, type, title, message, creator_id)
    VALUES (
      NEW.event_id,
      'report',
      'Etkinlik Çok Rapor Aldı',
      'Bu etkinlik 3 veya daha fazla rapor aldı. İnceleme gerekli.',
      NEW.reporter_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_report_count_trigger ON event_reports;
CREATE TRIGGER increment_report_count_trigger
  AFTER INSERT ON event_reports
  FOR EACH ROW
  EXECUTE FUNCTION increment_report_count();

-- =============================================
-- STEP 9: STORAGE BUCKET & POLICIES
-- =============================================

-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies - önce mevcut olanları temizle
DROP POLICY IF EXISTS "Users can upload images to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Yeni policies
CREATE POLICY "Users can upload images to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public read access to event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================
-- STEP 10: ADMIN KULLANICISINI OLUŞTUR
-- =============================================

-- NOT: İlk admin kullanıcısını manuel olarak eklemelisiniz
-- Kendi email adresinizi buraya yazın ve bu scripti çalıştırın

DO $$
DECLARE
  admin_email TEXT := 'murat@example.com';  -- BURAYA KENDİ EMAİLİNİZİ YAZIN
  admin_user_id UUID;
BEGIN
  -- Email'e göre kullanıcı ID'sini bul
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- Eğer kullanıcı bulunduysa admin yap
  IF admin_user_id IS NOT NULL THEN
    UPDATE profiles
    SET is_admin = TRUE
    WHERE id = admin_user_id;

    RAISE NOTICE 'Admin kullanıcı oluşturuldu: %', admin_email;
  ELSE
    RAISE NOTICE 'UYARI: % email adresiyle kayıtlı kullanıcı bulunamadı. Önce uygulamadan kayıt olun.', admin_email;
  END IF;
END $$;

-- =============================================
-- BAŞARI MESAJI
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Veritabanı kurulumu tamamlandı!';
  RAISE NOTICE '📊 Tablolar: profiles, events, event_reports, admin_notifications, favorites, attendances';
  RAISE NOTICE '🔐 RLS policies aktif';
  RAISE NOTICE '📁 Storage bucket: event-images';
  RAISE NOTICE '👤 Admin sistemi hazır';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  ÖNEMLİ: Yukarıdaki admin_email değişkenini kendi emailinizle değiştirmeyi unutmayın!';
  RAISE NOTICE '📝 Sonraki adım: Uygulamadan kayıt olun, sonra bu scripti tekrar çalıştırın';
END $$;
