-- EventMap Database Schema
-- Copy and paste this entire file into Supabase SQL Editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_photo TEXT,
  cover_photo TEXT,
  is_premium BOOLEAN DEFAULT FALSE
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  price_min NUMERIC DEFAULT 0,
  price_max NUMERIC DEFAULT 0,
  organizer TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  location_point GEOGRAPHY(POINT, 4326),
  is_premium BOOLEAN DEFAULT FALSE,
  source TEXT,
  creator_id UUID REFERENCES auth.users ON DELETE SET NULL
);

-- Create spatial index
CREATE INDEX IF NOT EXISTS events_location_idx ON events USING GIST (location_point);

-- Enable RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = creator_id);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_id TEXT REFERENCES events ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Enable RLS for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- ATTENDANCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS attendances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_id TEXT REFERENCES events ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Enable RLS for attendances
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Policies for attendances
CREATE POLICY "Users can view own attendances" ON attendances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark attendance" ON attendances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove attendance" ON attendances
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update location_point from lat/long
CREATE OR REPLACE FUNCTION update_event_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update location_point
DROP TRIGGER IF EXISTS update_event_location_point_trigger ON events;
CREATE TRIGGER update_event_location_point_trigger
  BEFORE INSERT OR UPDATE OF latitude, longitude ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_location_point();

-- Function to find nearby events
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
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample events
INSERT INTO events (id, title, description, category, image_url, date, time, location, city, price_min, price_max, organizer, attendees, latitude, longitude, source)
VALUES
  ('1', 'Istanbul Jazz Festival', 'Dünyanın en ünlü caz sanatçılarını ağırlayan prestijli festival. Zorlu PSM''de 3 gün boyunca unutulmaz bir müzik şöleni.', 'Festival', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop', '15 Kasım', '20:00', 'Zorlu PSM', 'Istanbul', 350, 800, 'Istanbul Kültür Sanat Vakfı', 1250, 41.0661, 29.0128, 'biletix'),

  ('2', 'Galatasaray vs Fenerbahçe', 'Türkiye''nin en büyük derbisi! Sarı-kırmızı ve sarı-lacivertli takımlar arasındaki tarihi rekabet.', 'Spor', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop', '20 Kasım', '19:00', 'Türk Telekom Stadyumu', 'Istanbul', 500, 1500, 'Galatasaray SK', 45000, 41.1039, 28.9901, 'passo'),

  ('3', 'React & TypeScript Workshop', 'Modern web geliştirme teknikleri üzerine interaktif workshop. Hands-on projeler ve networking fırsatı.', 'Meetup', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', '18 Kasım', '14:00', 'Impact Hub', 'Istanbul', 0, 0, 'Istanbul Tech Community', 85, 41.0082, 28.9784, 'meetup'),

  ('4', 'Devlet Tiyatroları - Hamlet', 'Shakespeare''in ölümsüz eseri Hamlet, modern yorumuyla sahnede. Usta oyuncularla unutulmaz bir gece.', 'Tiyatro', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop', '22 Kasım', '20:30', 'Atatürk Kültür Merkezi', 'Istanbul', 150, 400, 'Devlet Tiyatroları', 320, 41.0370, 28.9870, 'biletinial'),

  ('5', 'Sertab Erener Konseri', 'Pop müziğin kraliçesi Sertab Erener, sevilen şarkılarıyla unutulmaz bir konser verecek.', 'Konser', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop', '25 Kasım', '21:00', 'Ankara Arena', 'Ankara', 400, 1200, 'Live Nation Turkey', 2800, 39.9334, 32.8597, 'biletix')
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Sample events added!';
  RAISE NOTICE 'You can now use the application with real backend.';
END $$;
