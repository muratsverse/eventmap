-- FINAL FIX for admin_notifications RLS
-- This fixes the trigger function to bypass RLS

-- Solution 1: Make the trigger function run with SECURITY DEFINER
-- This allows it to bypass RLS policies
CREATE OR REPLACE FUNCTION notify_admin_new_event()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'inReview' THEN
    INSERT INTO admin_notifications (event_id, type, title, message, creator_id)
    VALUES (
      NEW.id,
      'new_event',
      'Yeni Etkinlik Onay Bekliyor',
      'Yeni bir etkinlik oluşturuldu: ' || NEW.title,
      NEW.creator_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Solution 2: Also update RLS policies to be safe
ALTER TABLE admin_notifications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_insert_notifications" ON admin_notifications;
DROP POLICY IF EXISTS "allow_select_notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admin_notifications;
DROP POLICY IF EXISTS "Enable read access for users" ON admin_notifications;
DROP POLICY IF EXISTS "authenticated_users_can_insert" ON admin_notifications;
DROP POLICY IF EXISTS "users_can_select_own" ON admin_notifications;
DROP POLICY IF EXISTS "admins_can_select_all" ON admin_notifications;

-- Re-enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
-- INSERT: Allow all authenticated users (backup, in case SECURITY DEFINER doesn't work)
CREATE POLICY "allow_all_insert"
ON admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- SELECT: Users can see their own, admins can see all
CREATE POLICY "allow_select"
ON admin_notifications
FOR SELECT
TO authenticated
USING (
  auth.uid() = creator_id
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Grant permissions
GRANT INSERT ON admin_notifications TO authenticated;
GRANT SELECT ON admin_notifications TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ admin_notifications RLS fixed successfully!';
  RAISE NOTICE '📝 The notify_admin_new_event() function now runs with SECURITY DEFINER';
  RAISE NOTICE '🔒 RLS policies updated to allow inserts from authenticated users';
END $$;
