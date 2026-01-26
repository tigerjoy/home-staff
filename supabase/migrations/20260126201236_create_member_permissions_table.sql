-- Create member_permissions table
-- This migration refactors permissions from JSONB column to a normalized table structure
-- Each row represents a single permission for a member

-- Create member_permissions table
CREATE TABLE IF NOT EXISTS public.member_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(member_id, permission)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_member_permissions_member_id ON public.member_permissions(member_id);
CREATE INDEX IF NOT EXISTS idx_member_permissions_member_permission ON public.member_permissions(member_id, permission);

-- Enable Row Level Security
ALTER TABLE public.member_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view permissions for members in their households
CREATE POLICY "Users can view permissions of members in their households"
  ON public.member_permissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m2.id = member_permissions.member_id
    )
  );

-- RLS Policy: Admins can insert permissions for members in their households
CREATE POLICY "Admins can insert permissions for members in their households"
  ON public.member_permissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m1.role = 'admin'
      AND m1.status = 'active'
      AND m2.id = member_permissions.member_id
    )
  );

-- RLS Policy: Admins can update permissions for members in their households
CREATE POLICY "Admins can update permissions for members in their households"
  ON public.member_permissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m1.role = 'admin'
      AND m1.status = 'active'
      AND m2.id = member_permissions.member_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m1.role = 'admin'
      AND m1.status = 'active'
      AND m2.id = member_permissions.member_id
    )
  );

-- RLS Policy: Admins can delete permissions for members in their households
CREATE POLICY "Admins can delete permissions for members in their households"
  ON public.member_permissions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m1.role = 'admin'
      AND m1.status = 'active'
      AND m2.id = member_permissions.member_id
    )
  );

-- Update get_member_permissions to use the new table
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
  v_permissions TEXT[];
BEGIN
  -- Get member record using auth.uid()
  SELECT role INTO v_member
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

  -- For members, get permissions from member_permissions table
  SELECT COALESCE(ARRAY_AGG(permission ORDER BY permission), ARRAY[]::TEXT[])
  INTO v_permissions
  FROM public.member_permissions
  WHERE member_id = (
    SELECT id FROM public.members
    WHERE household_id = p_household_id
    AND user_id = auth.uid()
    AND status = 'active'
    LIMIT 1
  );

  -- If no custom permissions exist, return default member permissions
  IF v_permissions IS NULL OR array_length(v_permissions, 1) IS NULL THEN
    RETURN ARRAY[
      'view_staff_directory',
      'view_attendance',
      'view_payroll'
    ];
  END IF;

  RETURN v_permissions;
END;
$$;

-- Update has_permission to use the new table
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
  v_member RECORD;
  v_role TEXT;
BEGIN
  -- Get member record using auth.uid()
  SELECT role INTO v_member
  FROM public.members
  WHERE household_id = p_household_id
  AND user_id = auth.uid()
  AND status = 'active'
  LIMIT 1;

  -- If not an active member, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  v_role := v_member.role;

  -- Admins always have all permissions
  IF v_role = 'admin' THEN
    RETURN true;
  END IF;

  -- For members, check if permission exists in member_permissions table
  -- If no rows exist, check against default member permissions
  RETURN EXISTS (
    SELECT 1 FROM public.member_permissions
    WHERE member_id = (
      SELECT id FROM public.members
      WHERE household_id = p_household_id
      AND user_id = auth.uid()
      AND status = 'active'
      LIMIT 1
    )
    AND permission = p_permission
  ) OR (
    -- If no custom permissions exist, check default permissions
    NOT EXISTS (
      SELECT 1 FROM public.member_permissions
      WHERE member_id = (
        SELECT id FROM public.members
        WHERE household_id = p_household_id
        AND user_id = auth.uid()
        AND status = 'active'
        LIMIT 1
      )
    )
    AND p_permission = ANY(ARRAY[
      'view_staff_directory',
      'view_attendance',
      'view_payroll'
    ])
  );
END;
$$;

-- Update get_member_info to remove permissions from JSONB response
-- (permissions are now queried separately via get_member_permissions)
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
  SELECT role, status INTO v_member
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
    'status', v_member.status
  );
END;
$$;

-- Set default permissions for existing members with role='member'
-- Only insert if they don't already have permissions set
INSERT INTO public.member_permissions (member_id, permission)
SELECT 
  m.id,
  perm.permission
FROM public.members m
CROSS JOIN (
  VALUES 
    ('view_staff_directory'),
    ('view_attendance'),
    ('view_payroll')
) AS perm(permission)
WHERE m.role = 'member'
AND m.status = 'active'
AND NOT EXISTS (
  SELECT 1 FROM public.member_permissions mp
  WHERE mp.member_id = m.id
)
ON CONFLICT (member_id, permission) DO NOTHING;
