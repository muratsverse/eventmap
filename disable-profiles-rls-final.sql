-- PROFILES RLS'İ TAMAMEN KAPAT
-- Bu SQL'i Supabase SQL Editor'da çalıştır

-- 1. Önce tüm mevcut policy'leri sil
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;

-- 2. RLS'i TAMAMEN KAPAT
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Kontrol et (bu sorgu false dönmeli)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
