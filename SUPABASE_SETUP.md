# Supabase Setup Guide

Bu rehber, EventMap uygulaması için Supabase backend'ini kurmanıza yardımcı olacaktır.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) adresine gidin ve hesap oluşturun
2. "New Project" butonuna tıklayın
3. Proje adı girin (örn: "eventmap")
4. Güçlü bir database şifresi oluşturun
5. Region olarak en yakın bölgeyi seçin (örn: "Europe (Frankfurt)")
6. "Create new project" butonuna tıklayın

## 2. Database Schema Oluşturma

Supabase Dashboard'da SQL Editor'e gidin ve aşağıdaki SQL'i çalıştırın:

```sql
-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table
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

-- Events table
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

-- Favorites table
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

-- Attendances table
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

-- Function to update location_point from lat/long
CREATE OR REPLACE FUNCTION update_event_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update location_point
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
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. Environment Variables Ayarlama

1. Supabase Dashboard'da Settings > API'ye gidin
2. "Project URL" ve "anon public" key'i kopyalayın
3. `.env` dosyanızı güncelleyin:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Storage Bucket Oluşturma (Opsiyonel)

Kullanıcı profil fotoğrafları ve etkinlik görselleri için:

1. Storage bölümüne gidin
2. "Create new bucket" butonuna tıklayın
3. Bucket adı: "event-images"
4. Public bucket olarak işaretleyin
5. "Create bucket" butonuna tıklayın

## 5. API Keys (Opsiyonel - Etkinlik Platformları)

### Ticketmaster API
1. [Ticketmaster Developer](https://developer.ticketmaster.com/) adresine gidin
2. Hesap oluşturun ve API key alın
3. `.env` dosyasına ekleyin:
   ```
   VITE_TICKETMASTER_API_KEY=your_api_key
   ```

### Eventbrite API
1. [Eventbrite Platform](https://www.eventbrite.com/platform/) adresine gidin
2. OAuth token alın
3. `.env` dosyasına ekleyin:
   ```
   VITE_EVENTBRITE_API_KEY=your_token
   ```

## 6. Test Etme

1. Uygulamayı başlatın: `npm run dev`
2. Kayıt ol/Giriş yap özelliklerini test edin
3. Etkinlik oluşturma özelliğini test edin (premium gerekli)
4. Favorilere ekleme ve katılım işaretleme özelliklerini test edin

## Önemli Notlar

- **Row Level Security (RLS)**: Tüm tablolar RLS ile korunmaktadır
- **PostGIS**: Yakınımdaki etkinlikler özelliği için PostGIS extension kullanılır
- **Real-time**: Supabase real-time özelliği etkinleştirilebilir
- **Storage**: Görseller için Supabase Storage kullanılabilir

## Sorun Giderme

### "relation does not exist" hatası
- SQL komutlarının tamamını çalıştırdığınızdan emin olun

### Authentication hataları
- Email confirmation ayarlarını kontrol edin (Settings > Auth > Email Auth)

### RLS policy hataları
- Policies'in doğru kullanıcı için çalıştığından emin olun
- `auth.uid()` fonksiyonunun doğru çalıştığını kontrol edin

## Yardım

Daha fazla bilgi için:
- [Supabase Documentation](https://supabase.com/docs)
- [PostGIS Documentation](https://postgis.net/docs/)
