-- ============================================
-- PREMIUM ÖZELLİĞİNİ KALDIR - MİGRATION
-- ============================================
-- Artık herkes sınırsız etkinlik oluşturabilir
-- is_premium kolonu kaldırılıyor

-- 1. profiles tablosundan is_premium kolonunu kaldır
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_premium;

-- 2. Trigger fonksiyonunu güncelle (eğer hala is_premium içeriyorsa)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    profile_photo,
    cover_photo,
    is_admin,
    email_visible,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NULL,
    FALSE,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(profiles.name, EXCLUDED.name),
    profile_photo = COALESCE(profiles.profile_photo, EXCLUDED.profile_photo),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- 3. Doğrulama - Tablo yapısını kontrol et
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND table_schema = 'public';

COMMENT ON TABLE public.profiles IS 'Kullanıcı profilleri - Premium özelliği kaldırıldı, herkes sınırsız etkinlik oluşturabilir';
