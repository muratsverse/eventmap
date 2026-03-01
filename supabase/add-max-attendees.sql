-- =====================================================
-- MAX ATTENDEES (Maksimum Katılımcı) Sütunu Ekleme
-- =====================================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştır
-- =====================================================

-- 1. events tablosuna max_attendees sütunu ekle
ALTER TABLE events
ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT NULL;

-- 2. Yorum ekle (opsiyonel)
COMMENT ON COLUMN events.max_attendees IS 'Etkinliğin maksimum katılımcı kapasitesi. NULL = sınırsız';

-- =====================================================
-- AÇIKLAMA:
-- - max_attendees NULL ise = Sınırsız katılım
-- - max_attendees bir sayı ise = O kadar kişi katılabilir
-- =====================================================
