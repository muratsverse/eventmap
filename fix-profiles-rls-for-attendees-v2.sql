-- Fix profiles RLS to allow viewing other users' profiles
-- This is needed for the attendees feature to work

-- First, check current policies (optional - you can skip this query)
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'profiles';

-- Drop the policy if it exists, then create it
DROP POLICY IF EXISTS "allow_select_all_profiles" ON profiles;

-- Allow authenticated users to view all profiles (for attendees list)
CREATE POLICY "allow_select_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ profiles RLS policy updated!';
  RAISE NOTICE '👥 Users can now see other users profiles for attendees list';
END $$;
