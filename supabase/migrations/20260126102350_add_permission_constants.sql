-- Add Permission Constants
-- This migration creates a function to return default permissions for roles
-- This ensures consistency between database and client-side permission definitions

-- Function to get default permissions for a role
CREATE OR REPLACE FUNCTION public.get_default_permissions(
  p_role TEXT
)
RETURNS TEXT[]
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE p_role
    WHEN 'admin' THEN
      RETURN ARRAY[
        'view_staff_directory',
        'manage_staff_directory',
        'view_attendance',
        'manage_attendance',
        'view_payroll',
        'manage_payroll',
        'invite_members',
        'manage_members',
        'edit_household_settings',
        'archive_household'
      ];
    WHEN 'member' THEN
      RETURN ARRAY[
        'view_staff_directory',
        'view_attendance',
        'view_payroll'
      ];
    ELSE
      RETURN ARRAY[]::TEXT[];
  END CASE;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION public.get_default_permissions(TEXT) IS 
'Returns default permissions for a given role. Admins have all permissions, Members have read-only access.';
