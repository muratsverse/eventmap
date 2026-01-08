-- Fix admin_notifications RLS policy
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Önce mevcut policy'leri kaldır
DROP POLICY IF EXISTS "Users can insert admin notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON admin_notifications;

-- Yeni policy'ler ekle
-- 1. Kullanıcılar etkinlik oluşturduklarında notification oluşturabilir
CREATE POLICY "Users can create notifications for their events"
ON admin_notifications
FOR INSERT
WITH CHECK (true); -- Her kullanıcı notification oluşturabilir

-- 2. Sadece adminler notification'ları görebilir
CREATE POLICY "Admins can view all notifications"
ON admin_notifications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Adminler notification'ları güncelleyebilir (read/unread)
CREATE POLICY "Admins can update notifications"
ON admin_notifications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 4. Adminler notification'ları silebilir
CREATE POLICY "Admins can delete notifications"
ON admin_notifications
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
