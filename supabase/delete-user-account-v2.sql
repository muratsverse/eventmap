-- =============================================
-- KULLANICI HESABI SİLME SİSTEMİ V2
-- Soft delete: Veriler gizlenir, 30 gün içinde geri yüklenebilir
-- Hard delete: 30 gün sonra veriler kalıcı olarak silinir
-- =============================================

-- ADIM 1: Gerekli kolonları ekle
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT,
ADD COLUMN IF NOT EXISTS deletion_scheduled_at TIMESTAMPTZ;

-- Event attendees tablosuna soft delete kolonu
ALTER TABLE event_attendees
ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;

-- Favorites tablosuna soft delete kolonu
ALTER TABLE favorites
ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;

-- Events tablosuna soft delete kolonu
ALTER TABLE events
ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ;

-- =============================================
-- ADIM 2: Soft Delete - Verileri Gizle
-- =============================================
DROP FUNCTION IF EXISTS soft_delete_user_account(uuid, text);
CREATE OR REPLACE FUNCTION soft_delete_user_account(
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- 1. Profili silinmiş olarak işaretle
    UPDATE profiles
    SET
        deleted_at = NOW(),
        deletion_reason = p_reason,
        deletion_scheduled_at = NOW() + INTERVAL '30 days'
    WHERE id = p_user_id;

    -- 2. Kullanıcının katılımlarını gizle
    UPDATE event_attendees
    SET hidden_at = NOW()
    WHERE user_id = p_user_id;

    -- 3. Kullanıcının favorilerini gizle
    UPDATE favorites
    SET hidden_at = NOW()
    WHERE user_id = p_user_id;

    -- 4. Kullanıcının oluşturduğu etkinlikleri gizle
    UPDATE events
    SET hidden_at = NOW()
    WHERE creator_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ADIM 3: Hesabı Geri Yükle - Verileri Göster
-- =============================================
DROP FUNCTION IF EXISTS restore_user_account(uuid);
CREATE OR REPLACE FUNCTION restore_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- 1. Profili geri yükle
    UPDATE profiles
    SET
        deleted_at = NULL,
        deletion_reason = NULL,
        deletion_scheduled_at = NULL
    WHERE id = p_user_id;

    -- 2. Kullanıcının katılımlarını göster
    UPDATE event_attendees
    SET hidden_at = NULL
    WHERE user_id = p_user_id;

    -- 3. Kullanıcının favorilerini göster
    UPDATE favorites
    SET hidden_at = NULL
    WHERE user_id = p_user_id;

    -- 4. Kullanıcının oluşturduğu etkinlikleri göster
    UPDATE events
    SET hidden_at = NULL
    WHERE creator_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ADIM 4: Kalıcı Silme (30 gün sonra)
-- =============================================
DROP FUNCTION IF EXISTS permanently_delete_user_account(uuid);
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

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ADIM 5: Otomatik Temizlik (30 günü geçenler)
-- =============================================
DROP FUNCTION IF EXISTS cleanup_deleted_accounts();
CREATE OR REPLACE FUNCTION cleanup_deleted_accounts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    user_record RECORD;
BEGIN
    FOR user_record IN
        SELECT id FROM profiles
        WHERE deleted_at IS NOT NULL
        AND deletion_scheduled_at < NOW()
    LOOP
        PERFORM permanently_delete_user_account(user_record.id);
        deleted_count := deleted_count + 1;
    END LOOP;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ADIM 6: RLS Politikalarını Güncelle
-- Silinmiş/gizli verileri gösterme
-- =============================================

-- Event Attendees için policy güncelle
DROP POLICY IF EXISTS "Hidden attendees are not visible" ON event_attendees;
CREATE POLICY "Hidden attendees are not visible" ON event_attendees
    FOR SELECT
    USING (hidden_at IS NULL);

-- Favorites için policy güncelle
DROP POLICY IF EXISTS "Hidden favorites are not visible" ON favorites;
CREATE POLICY "Hidden favorites are not visible" ON favorites
    FOR SELECT
    USING (hidden_at IS NULL);

-- Events için policy güncelle (gizli etkinlikleri gösterme)
DROP POLICY IF EXISTS "Hidden events are not visible" ON events;
CREATE POLICY "Hidden events are not visible" ON events
    FOR SELECT
    USING (hidden_at IS NULL);

-- =============================================
-- ADIM 7: Cron Job (Her gün gece 01:00)
-- =============================================
-- Supabase'de pg_cron etkinse:
-- SELECT cron.schedule(
--     'cleanup-deleted-accounts',
--     '0 1 * * *',
--     'SELECT cleanup_deleted_accounts()'
-- );

-- =============================================
-- TEST KOMUTLARI
-- =============================================
-- Soft delete test:
-- SELECT soft_delete_user_account('USER_UUID');

-- Geri yükleme test:
-- SELECT restore_user_account('USER_UUID');

-- Silinmiş hesapları listele:
-- SELECT id, email, deleted_at, deletion_scheduled_at FROM profiles WHERE deleted_at IS NOT NULL;

-- Manuel temizlik:
-- SELECT cleanup_deleted_accounts();
