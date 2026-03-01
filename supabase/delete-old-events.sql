-- =============================================
-- ESKİ ETKİNLİKLERİ OTOMATİK SİLME
-- Etkinlik tarihi 7 gün geçmiş olanları siler
-- Her gün gece yarısı otomatik çalışır
-- =============================================

-- ADIM 1: pg_cron extension'ı etkinleştir
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ADIM 2: Eski etkinlikleri silen fonksiyonu oluştur
CREATE OR REPLACE FUNCTION delete_old_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Tarihi 7 gün geçmiş etkinlikleri sil
    DELETE FROM events
    WHERE date < NOW() - INTERVAL '7 days';

    -- Silinen satır sayısını al
    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADIM 3: Mevcut cron job varsa sil (hata önleme)
SELECT cron.unschedule('delete-old-events')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'delete-old-events'
);

-- ADIM 4: Her gün gece yarısı (00:00) çalışacak cron job oluştur
SELECT cron.schedule(
    'delete-old-events',
    '0 0 * * *',
    $$DELETE FROM events WHERE date < NOW() - INTERVAL '7 days'$$
);

-- =============================================
-- KONTROL KOMUTLARI (opsiyonel)
-- =============================================

-- Cron job'ların listesini gör:
-- SELECT * FROM cron.job;

-- Cron job çalışma geçmişini gör:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Manuel test için fonksiyonu çağır:
-- SELECT delete_old_events();

-- Şu an kaç eski etkinlik var:
-- SELECT COUNT(*) FROM events WHERE date < NOW() - INTERVAL '7 days';
