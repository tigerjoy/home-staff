-- Fix Access Functions to Use auth.uid() Internally
-- This migration updates all access control functions to use auth.uid() directly
-- instead of accepting p_user_id as a parameter, making them more secure and simpler

-- Update is_household_member_active to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.is_household_member_active(
  p_household_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.members
    WHERE household_id = p_household_id
    AND user_id = auth.uid()
    AND status = 'active'
  );
END;
$$;

-- Update is_household_admin_active to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.is_household_admin_active(
  p_household_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.members
    WHERE household_id = p_household_id
    AND user_id = auth.uid()
    AND role = 'admin'
    AND status = 'active'
  );
END;
$$;

-- Update get_member_permissions to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.get_member_permissions(
  p_household_id UUID
)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member RECORD;
  v_role TEXT;
  v_custom_permissions JSONB;
  v_permissions TEXT[];
BEGIN
  -- Get member record using auth.uid()
  SELECT role, permissions INTO v_member
  FROM public.members
  WHERE household_id = p_household_id
  AND user_id = auth.uid()
  AND status = 'active'
  LIMIT 1;

  -- If not an active member, return empty array
  IF NOT FOUND THEN
    RETURN ARRAY[]::TEXT[];
  END IF;

  v_role := v_member.role;
  v_custom_permissions := v_member.permissions;

  -- Admins always have all permissions
  IF v_role = 'admin' THEN
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
  END IF;

  -- For members, start with default permissions
  v_permissions := ARRAY[
    'view_staff_directory',
    'view_attendance',
    'view_payroll'
  ];

  -- If custom permissions exist, use them instead of defaults
  IF v_custom_permissions IS NOT NULL THEN
    -- Convert JSONB array to TEXT array
    SELECT ARRAY(SELECT jsonb_array_elements_text(v_custom_permissions))
    INTO v_permissions;
  END IF;

  RETURN v_permissions;
END;
$$;

-- Update has_permission to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.has_permission(
  p_household_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_permissions TEXT[];
BEGIN
  -- Get user's permissions using auth.uid()
  v_permissions := public.get_member_permissions(p_household_id);

  -- Check if permission is in the array
  RETURN p_permission = ANY(v_permissions);
END;
$$;

-- Update get_member_info to use auth.uid() internally
CREATE OR REPLACE FUNCTION public.get_member_info(
  p_household_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member RECORD;
BEGIN
  -- Get member record using auth.uid()
  SELECT role, status, permissions INTO v_member
  FROM public.members
  WHERE household_id = p_household_id
  AND user_id = auth.uid()
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'is_member', false,
      'is_active', false,
      'role', NULL,
      'status', NULL
    );
  END IF;

  RETURN jsonb_build_object(
    'is_member', true,
    'is_active', v_member.status = 'active',
    'role', v_member.role,
    'status', v_member.status,
    'permissions', v_member.permissions
  );
END;
$$;
