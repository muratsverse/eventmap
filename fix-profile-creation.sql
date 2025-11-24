-- ============================================
-- FIX: Profil Oluşturma Trigger & RLS
-- ============================================

-- STEP 1: RLS'i kapat (profil oluşturulabilmesi için)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Trigger fonksiyonu oluştur (güvenli şekilde)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- ZORUNLU: Trigger'ın admin yetkisiyle çalışması için
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Yeni kullanıcı için profil oluştur
  INSERT INTO public.profiles (id, email, is_admin, is_premium)
  VALUES (NEW.id, NEW.email, FALSE, FALSE)
  ON CONFLICT (id) DO NOTHING; -- Zaten varsa hata verme

  RETURN NEW;
END;
$$;

-- STEP 3: Trigger'ı oluştur veya güncelle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 4: Mevcut kullanıcılar için profil oluştur (eksik olanlar için)
INSERT INTO public.profiles (id, email, is_admin, is_premium)
SELECT
  u.id,
  u.email,
  FALSE as is_admin,
  FALSE as is_premium
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- STEP 5: Trigger'ın çalışıp çalışmadığını kontrol et
SELECT
  tgname as trigger_name,
  tgenabled as enabled,
  tgtype,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';

-- STEP 6: Profil sayısını kontrol et
SELECT
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  (SELECT COUNT(*) FROM auth.users u
   LEFT JOIN public.profiles p ON u.id = p.id
   WHERE p.id IS NULL) as missing_profiles;

-- Eğer missing_profiles > 0 ise, yukarıdaki INSERT komutunu tekrar çalıştır
