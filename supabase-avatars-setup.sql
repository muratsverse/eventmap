-- Avatars Storage Bucket ve Policies Kurulumu
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. Avatars bucket'ını oluştur (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Herkes bucket'daki dosyaları görebilir (public bucket)
CREATE POLICY "Anyone can view avatar images" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 3. Authenticated kullanıcılar kendi dosyalarını yükleyebilir
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'profiles'
);

-- 4. Kullanıcılar kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'profiles'
);

-- 5. Kullanıcılar kendi dosyalarını silebilir
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'profiles'
);
