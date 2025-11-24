-- Email görünürlük ayarı ekle
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_visible BOOLEAN DEFAULT false;

-- Mevcut kullanıcılar için email'i gizli yap
UPDATE profiles
SET email_visible = false
WHERE email_visible IS NULL;
