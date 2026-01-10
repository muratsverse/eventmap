-- Add soft delete columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Create index for faster queries on deleted accounts
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- Update RLS policies to exclude soft-deleted profiles
-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Recreate policy excluding soft-deleted profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (
  auth.uid() = id
  AND deleted_at IS NULL
);

-- Update other policies similarly
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (
  auth.uid() = id
  AND deleted_at IS NULL
);

-- Function to permanently delete old soft-deleted accounts (30+ days)
CREATE OR REPLACE FUNCTION cleanup_old_deleted_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete profiles that were soft-deleted more than 30 days ago
  DELETE FROM profiles
  WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - INTERVAL '30 days';

  -- Note: This will cascade delete related data (events, favorites, attendances)
  -- due to foreign key constraints
END;
$$;

-- Function to restore a soft-deleted account
CREATE OR REPLACE FUNCTION restore_account(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Restore the account by clearing deleted_at
  UPDATE profiles
  SET
    deleted_at = NULL,
    deletion_reason = NULL,
    updated_at = NOW()
  WHERE id = p_user_id
  AND deleted_at IS NOT NULL;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_old_deleted_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION restore_account(UUID) TO authenticated;

COMMENT ON COLUMN profiles.deleted_at IS 'Timestamp when account was soft-deleted. NULL means active account.';
COMMENT ON COLUMN profiles.deletion_reason IS 'Optional reason why account was deleted';
COMMENT ON FUNCTION cleanup_old_deleted_accounts() IS 'Permanently deletes accounts that were soft-deleted more than 30 days ago';
COMMENT ON FUNCTION restore_account(UUID) IS 'Restores a soft-deleted account';
