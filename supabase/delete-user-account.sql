-- =============================================
-- KULLANICI HESABI KALICI SİLME
-- Apple App Store kurallarına uygun
-- Tüm kullanıcı verilerini kalıcı olarak siler
-- =============================================

-- ADIM 1: Soft delete fonksiyonu (30 gün geri yükleme imkanı)
CREATE OR REPLACE FUNCTION soft_delete_user_account(
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Profili silinmiş olarak işaretle
    UPDATE profiles
    SET
        deleted_at = NOW(),
        deletion_reason = p_reason,
        deletion_scheduled_at = NOW() + INTERVAL '30 days'
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADIM 2: Hesabı geri yükleme fonksiyonu
CREATE OR REPLACE FUNCTION restore_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles
    SET
        deleted_at = NULL,
        deletion_reason = NULL,
        deletion_scheduled_at = NULL
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADIM 3: Kalıcı silme fonksiyonu (tüm verileri siler)
CREATE OR REPLACE FUNCTION permanently_delete_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- 1. Kullanıcının oluşturduğu etkinliklerin katılımcılarını sil
    DELETE FROM event_attendees
    WHERE event_id IN (SELECT id FROM events WHERE creator_id = p_user_id);

    -- 2. Kullanıcının oluşturduğu etkinliklerin favorilerini sil
    DELETE FROM favorites
    WHERE event_id IN (SELECT id FROM events WHERE creator_id = p_user_id);

    -- 3. Kullanıcının oluşturduğu etkinlikleri sil
    DELETE FROM events WHERE creator_id = p_user_id;

    -- 4. Kullanıcının katılımlarını sil
    DELETE FROM event_attendees WHERE user_id = p_user_id;

    -- 5. Kullanıcının favorilerini sil
    DELETE FROM favorites WHERE user_id = p_user_id;

    -- 6. Kullanıcının profilini sil
    DELETE FROM profiles WHERE id = p_user_id;

    -- 7. Auth tablosundan kullanıcıyı sil (admin yetkisi gerekir)
    -- Bu işlem Supabase Dashboard'dan veya Edge Function ile yapılmalı
    -- DELETE FROM auth.users WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADIM 4: 30 günü geçmiş silinmiş hesapları kalıcı olarak silen cron job
CREATE OR REPLACE FUNCTION cleanup_deleted_accounts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- 30 günü geçmiş soft-deleted hesapları bul
    FOR user_record IN
        SELECT id FROM profiles
        WHERE deleted_at IS NOT NULL
        AND deletion_scheduled_at < NOW()
    LOOP
        -- Her kullanıcı için kalıcı silme yap
        PERFORM permanently_delete_user_account(user_record.id);
        deleted_count := deleted_count + 1;
    END LOOP;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADIM 5: Profil tablosuna gerekli kolonları ekle (yoksa)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT,
ADD COLUMN IF NOT EXISTS deletion_scheduled_at TIMESTAMPTZ;

-- ADIM 6: Her gün gece yarısı cleanup çalıştır (pg_cron gerekli)
-- SELECT cron.schedule(
--     'cleanup-deleted-accounts',
--     '0 1 * * *',
--     'SELECT cleanup_deleted_accounts()'
-- );

-- =============================================
-- MANUEL KULLANIM
-- =============================================

-- Soft delete (kullanıcı silme isteği):
-- SELECT soft_delete_user_account('USER_UUID_HERE');

-- Hesabı geri yükle:
-- SELECT restore_user_account('USER_UUID_HERE');

-- Kalıcı silme (dikkatli kullan!):
-- SELECT permanently_delete_user_account('USER_UUID_HERE');

-- Silinmiş hesapları temizle:
-- SELECT cleanup_deleted_accounts();
