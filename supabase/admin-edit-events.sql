-- Mevcut update policy'yi kaldır ve yenisini ekle
-- Artık hem etkinlik sahibi hem de adminler düzenleyebilir

DROP POLICY IF EXISTS "Users can update own events" ON events;

CREATE POLICY "Users can update own events or admin can update any" ON events
  FOR UPDATE USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );
