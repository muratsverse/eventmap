-- Check attendances table data and RLS policies

-- 1. Check if there's any data in attendances table
SELECT
  'Total attendances' as info,
  COUNT(*) as count
FROM attendances;

-- 2. Check attendances for specific events
SELECT
  event_id,
  COUNT(*) as attendee_count
FROM attendances
GROUP BY event_id
ORDER BY attendee_count DESC
LIMIT 10;

-- 3. Check RLS policies on attendances table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'attendances';

-- 4. Check if RLS is enabled on attendances
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'attendances';

-- If you see NO DATA or rls_enabled = false, that's the problem!
