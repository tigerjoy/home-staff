-- Create SECURITY DEFINER function to validate invitation codes
-- This function bypasses RLS to allow users to validate codes before joining households
-- It only validates a specific code provided as a parameter, preventing enumeration of all codes

CREATE OR REPLACE FUNCTION public.validate_invitation_code(
  p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation RECORD;
  v_household_name TEXT;
  v_result JSONB;
BEGIN
  -- Find the invitation by code
  SELECT 
    i.id,
    i.household_id,
    i.status,
    i.expires_at,
    i.max_uses,
    i.current_uses,
    h.name as household_name
  INTO v_invitation
  FROM public.invitations i
  JOIN public.households h ON h.id = i.household_id
  WHERE i.code = p_code
  LIMIT 1;

  -- Check if invitation exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid invitation code'
    );
  END IF;

  -- Check if invitation is active
  IF v_invitation.status != 'active' THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invitation code is not active'
    );
  END IF;

  -- Check expiration
  IF v_invitation.expires_at IS NOT NULL AND v_invitation.expires_at < NOW() THEN
    -- Mark as expired
    UPDATE public.invitations
    SET status = 'expired'
    WHERE id = v_invitation.id;
    
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invitation code has expired'
    );
  END IF;

  -- Check max uses
  IF v_invitation.max_uses IS NOT NULL AND v_invitation.current_uses >= v_invitation.max_uses THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invitation code has reached maximum uses'
    );
  END IF;

  -- Code is valid
  RETURN jsonb_build_object(
    'valid', true,
    'householdId', v_invitation.household_id,
    'householdName', COALESCE(v_invitation.household_name, 'Unknown Household')
  );
END;
$$;

-- Create SECURITY DEFINER function to accept an invitation code
-- This function handles the entire acceptance flow in a transaction:
-- 1. Validates the code
-- 2. Checks if user is already a member
-- 3. Adds user as member with pending status
-- 4. Increments invitation usage count
-- 5. Revokes invitation if max uses reached
CREATE OR REPLACE FUNCTION public.accept_invitation_code(
  p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation RECORD;
  v_household_id UUID;
  v_user_id UUID;
  v_existing_member RECORD;
  v_existing_households INTEGER;
  v_is_first_household BOOLEAN;
  v_result JSONB;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Find and validate the invitation
  SELECT 
    i.id,
    i.household_id,
    i.status,
    i.expires_at,
    i.max_uses,
    i.current_uses
  INTO v_invitation
  FROM public.invitations i
  WHERE i.code = p_code
  LIMIT 1;

  -- Check if invitation exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid invitation code'
    );
  END IF;

  -- Check if invitation is active
  IF v_invitation.status != 'active' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invitation code is not active'
    );
  END IF;

  -- Check expiration
  IF v_invitation.expires_at IS NOT NULL AND v_invitation.expires_at < NOW() THEN
    -- Mark as expired
    UPDATE public.invitations
    SET status = 'expired'
    WHERE id = v_invitation.id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invitation code has expired'
    );
  END IF;

  -- Check max uses
  IF v_invitation.max_uses IS NOT NULL AND v_invitation.current_uses >= v_invitation.max_uses THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invitation code has reached maximum uses'
    );
  END IF;

  v_household_id := v_invitation.household_id;

  -- Check if user is already a member
  SELECT id INTO v_existing_member
  FROM public.members
  WHERE household_id = v_household_id
  AND user_id = v_user_id
  LIMIT 1;

  IF v_existing_member IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'You are already a member of this household'
    );
  END IF;

  -- Check if this is user's first household (to set as primary)
  SELECT COUNT(*) INTO v_existing_households
  FROM public.members
  WHERE user_id = v_user_id;

  v_is_first_household := v_existing_households = 0;

  -- Add user as member with 'pending' status (requires admin approval)
  INSERT INTO public.members (
    user_id,
    household_id,
    role,
    is_primary,
    status
  ) VALUES (
    v_user_id,
    v_household_id,
    'member',
    v_is_first_household,
    'pending'
  );

  -- Increment usage count
  UPDATE public.invitations
  SET current_uses = current_uses + 1
  WHERE id = v_invitation.id;

  -- Check if max uses reached and revoke if needed
  IF v_invitation.max_uses IS NOT NULL AND (v_invitation.current_uses + 1) >= v_invitation.max_uses THEN
    UPDATE public.invitations
    SET status = 'revoked'
    WHERE id = v_invitation.id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'householdId', v_household_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Failed to join household: ' || SQLERRM
    );
END;
$$;
