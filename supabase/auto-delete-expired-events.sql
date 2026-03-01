-- =====================================================
-- Tarihi Geçmiş Etkinlikleri Otomatik Silme
-- Etkinlik tarihi + 10 gün geçtikten sonra siler
-- =====================================================

-- 1. Silme fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION delete_expired_events()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Tarihi 10 günden fazla geçmiş etkinlikleri sil
  WITH deleted AS (
    DELETE FROM events
    WHERE date < (CURRENT_DATE - INTERVAL '10 days')
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  -- Log kaydı (opsiyonel - eğer log tablosu varsa)
  -- INSERT INTO system_logs (action, details, created_at)
  -- VALUES ('delete_expired_events', format('Deleted %s expired events', deleted_count), NOW());

  RETURN deleted_count;
END;
$$;

-- 2. Fonksiyona yetki ver
GRANT EXECUTE ON FUNCTION delete_expired_events() TO service_role;

-- =====================================================
-- CRON JOB KURULUMU (pg_cron extension gerekli)
-- =====================================================

-- pg_cron extension'ı etkinleştir (Supabase Dashboard'dan yapılmalı)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Her gece saat 03:00'te çalışacak cron job
-- SELECT cron.schedule(
--   'delete-expired-events',           -- job adı
--   '0 3 * * *',                        -- her gün saat 03:00
--   'SELECT delete_expired_events()'   -- çalışacak komut
-- );

-- =====================================================
-- ALTERNATİF: Supabase Edge Function ile
-- =====================================================
-- Eğer pg_cron kullanılamıyorsa, Supabase Edge Function +
-- external cron service (cron-job.org, GitHub Actions) kullanılabilir

-- =====================================================
-- MANUEL TEST
-- =====================================================
-- Fonksiyonu manuel çalıştırmak için:
-- SELECT delete_expired_events();

-- Silinecek etkinlikleri önizlemek için:
-- SELECT id, title, date
-- FROM events
-- WHERE date < (CURRENT_DATE - INTERVAL '10 days');

-- =====================================================
-- ÖNEMLİ NOTLAR
-- =====================================================
-- 1. Bu SQL'i Supabase SQL Editor'de çalıştırın
-- 2. pg_cron için: Dashboard > Database > Extensions > pg_cron'u etkinleştirin
-- 3. Cron job'ı etkinleştirmek için yukarıdaki SELECT cron.schedule(...) satırını uncomment edin
-- 4. Silinen etkinliklerin image'larını da temizlemek için ayrı bir fonksiyon gerekebilir
