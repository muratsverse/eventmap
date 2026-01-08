-- Complete Fix for admin_notifications RLS
-- This script completely resets and reconfigures RLS policies

-- Step 1: Disable RLS temporarily
ALTER TABLE admin_notifications DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (force drop)
DROP POLICY IF EXISTS "allow_insert_notifications" ON admin_notifications;
DROP POLICY IF EXISTS "allow_select_notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON admin_notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admin_notifications;
DROP POLICY IF EXISTS "Enable read access for users" ON admin_notifications;

-- Step 3: Re-enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new comprehensive policies

-- Policy 1: Allow ALL authenticated users to INSERT notifications
-- This is needed when users create events and need to notify admins
CREATE POLICY "authenticated_users_can_insert"
ON admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Users can SELECT their own notifications
CREATE POLICY "users_can_select_own"
ON admin_notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Admins can SELECT all notifications
CREATE POLICY "admins_can_select_all"
ON admin_notifications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Step 5: Grant necessary permissions
GRANT INSERT ON admin_notifications TO authenticated;
GRANT SELECT ON admin_notifications TO authenticated;

-- Verification query (run this to check policies)
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'admin_notifications';
