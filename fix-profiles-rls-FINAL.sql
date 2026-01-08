-- FINAL FIX for profiles RLS
-- This completely resets and fixes the RLS policies

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on profiles table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, permissive policies

-- Allow users to view their own profile
CREATE POLICY "users_can_view_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to view ALL other profiles (needed for attendees list)
CREATE POLICY "users_can_view_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "users_can_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "users_can_insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 5: Grant permissions
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;
GRANT INSERT ON profiles TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Profiles RLS completely fixed!';
  RAISE NOTICE '👥 All authenticated users can now view all profiles';
  RAISE NOTICE '🔒 Users can only edit their own profile';
END $$;
