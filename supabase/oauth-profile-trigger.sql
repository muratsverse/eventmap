-- ============================================
-- OAUTH PROFIL OLUSTURMA TRIGGER
-- ============================================
-- Gmail ile giris yapildiginda otomatik profil olusturur

-- 1. Trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Yeni kullanici icin profil olustur
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

-- 2. Trigger olustur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Mevcut auth kullanicilari icin profil olustur (varsa)
INSERT INTO public.profiles (
  id,
  email,
  name,
  profile_photo,
  is_admin,
  email_visible,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  raw_user_meta_data->>'avatar_url',
  FALSE,
  FALSE,
  created_at,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 4. Test - Yeni kullanici icin profil olusturulacak mi?
-- Manuel test: Yeni bir kullanici kayit olun veya Gmail ile giris yapin
-- Asagidaki query ile profil olusturuldugunu dogrulayin:
-- SELECT * FROM profiles WHERE email = 'test@example.com';

COMMENT ON FUNCTION public.handle_new_user() IS 'OAuth ile giris yapildiginda otomatik profil olusturur';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Yeni kullanici kaydinda profil olusturur';
