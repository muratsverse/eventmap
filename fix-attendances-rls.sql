-- FIX attendances RLS policies
-- This allows users to view all attendances (needed for attendee counts and lists)

-- Step 1: Disable RLS temporarily
ALTER TABLE attendances DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'attendances')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON attendances';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies

-- Allow all authenticated users to VIEW all attendances
-- This is needed to show attendee counts and lists
CREATE POLICY "users_can_view_all_attendances"
ON attendances FOR SELECT
TO authenticated
USING (true);

-- Allow users to INSERT their own attendance
CREATE POLICY "users_can_insert_own_attendance"
ON attendances FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own attendance
CREATE POLICY "users_can_delete_own_attendance"
ON attendances FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Grant permissions
GRANT SELECT ON attendances TO authenticated;
GRANT INSERT ON attendances TO authenticated;
GRANT DELETE ON attendances TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ attendances RLS fixed!';
  RAISE NOTICE '👥 Users can now view all attendances (for counts and lists)';
  RAISE NOTICE '➕ Users can add their own attendance';
  RAISE NOTICE '➖ Users can remove their own attendance';
END $$;
