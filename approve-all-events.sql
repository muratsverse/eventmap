-- Tüm etkinlikleri onayla ve görünür yap
UPDATE events
SET status = 'approved'
WHERE status IS NULL OR status != 'approved';

-- Kaç etkinlik güncellendi göster
SELECT COUNT(*) as approved_events FROM events WHERE status = 'approved';
