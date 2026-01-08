-- Fix profiles RLS to allow viewing other users' profiles
-- This is needed for the attendees feature to work

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- Allow authenticated users to view all profiles (for attendees list)
CREATE POLICY IF NOT EXISTS "allow_select_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: This allows users to see other users' basic profile info (name, email, photo)
-- This is necessary for the attendees feature
-- If you want to hide certain fields, you can use Row-Level Security with specific columns

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ profiles RLS policy updated!';
  RAISE NOTICE '👥 Users can now see other users profiles for attendees list';
END $$;
