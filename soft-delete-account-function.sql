-- Replace hard delete with soft delete function
CREATE OR REPLACE FUNCTION soft_delete_user_account(
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Soft delete: Mark account as deleted instead of removing it
  UPDATE profiles
  SET
    deleted_at = NOW(),
    deletion_reason = p_reason,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Note: Data is preserved for 30 days
  -- User can restore their account within this period
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION soft_delete_user_account(UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION soft_delete_user_account(UUID, TEXT) IS 'Soft deletes user account. Account can be restored within 30 days.';
