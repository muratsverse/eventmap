-- Fix admin_notifications RLS - Version 2
-- Supabase SQL Editor'de çalıştırın

-- Tüm mevcut policy'leri temizle
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admin_notifications')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON admin_notifications';
    END LOOP;
END $$;

-- RLS'i aç (eğer kapalıysa)
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- ÇOK BASIT POLICY: Herkes INSERT yapabilir
CREATE POLICY "allow_insert_notifications"
ON admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Herkes kendi notification'larını görebilir VEYA admin ise hepsini görebilir
CREATE POLICY "allow_select_notifications"
ON admin_notifications
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Adminler update edebilir
CREATE POLICY "allow_update_notifications"
ON admin_notifications
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Adminler delete edebilir
CREATE POLICY "allow_delete_notifications"
ON admin_notifications
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
