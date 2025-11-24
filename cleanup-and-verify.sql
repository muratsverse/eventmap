-- ============================================
-- CLEANUP AND VERIFY SCRIPT FOR LOCALHOST TESTING
-- ============================================

-- STEP 1: Verify the profile creation trigger exists
-- Run this first to make sure automatic profile creation is enabled

SELECT
  tgname as trigger_name,
  tgtype,
  tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- If the trigger doesn't exist, create it:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE)
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicates
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- STEP 2: Delete test users (test123@gmail.com, etc.)
-- ============================================

-- First, check what test users exist
SELECT
  u.id,
  u.email,
  u.created_at,
  p.name,
  p.is_premium
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE '%test%@gmail.com'
   OR u.email LIKE '%newtest%@gmail.com'
ORDER BY u.created_at DESC;


-- Delete test users (CAREFUL: This deletes ALL data for these users)
-- Run this ONLY if you want to delete test accounts

-- Delete from profiles first
DELETE FROM public.profiles
WHERE email LIKE '%test%@gmail.com'
   OR email LIKE '%newtest%@gmail.com';

-- Delete from auth.users (requires admin privileges or service role)
-- You need to run this in Supabase SQL Editor with admin privileges
DELETE FROM auth.users
WHERE email LIKE '%test%@gmail.com'
   OR email LIKE '%newtest%@gmail.com';


-- ============================================
-- STEP 3: Verify cleanup was successful
-- ============================================

-- Check if test users are deleted
SELECT COUNT(*) as remaining_test_users
FROM auth.users
WHERE email LIKE '%test%@gmail.com'
   OR email LIKE '%newtest%@gmail.com';

-- Should return 0 if cleanup was successful


-- ============================================
-- STEP 4: Create a fresh test user (Optional)
-- ============================================

-- This will be done through the app's registration form
-- Just verify the trigger works by checking:

SELECT * FROM auth.users WHERE email = 'yournewemail@gmail.com';
SELECT * FROM public.profiles WHERE email = 'yournewemail@gmail.com';

-- Both should have matching records after registration
