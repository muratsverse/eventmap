-- Profiles tablosu için RLS policies düzeltme
-- Bu SQL'i Supabase SQL Editor'da çalıştır

-- Önce mevcut policy'leri kontrol et
-- DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Public INSERT policy (yeni kullanıcılar için)
CREATE POLICY "Enable insert for authenticated users only" ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Public SELECT policy
CREATE POLICY "Enable read access for all users" ON profiles
FOR SELECT
TO public
USING (true);

-- UPDATE policy (sadece kendi profilini güncelleyebilir)
CREATE POLICY "Enable update for users based on id" ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- RLS'in aktif olduğundan emin ol
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
