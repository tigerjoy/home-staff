-- Allow Pending Members to View Their Own Records
-- This migration updates RLS policies to allow users to see their own member records
-- and households even when their membership status is 'pending'
-- This enables pending household requests to appear in the Settings page

-- ============================================================================
-- Update Members RLS Policy
-- ============================================================================

-- Drop and recreate SELECT policy to allow users to see their own member record
-- regardless of status (active or pending)
DROP POLICY IF EXISTS "Users can view members of their households" ON public.members;

CREATE POLICY "Users can view members of their households"
  ON public.members
  FOR SELECT
  USING (
    -- Allow users to see their own member record (even if pending)
    user_id = auth.uid() OR
    -- Or if they're an active member viewing other members
    public.is_household_member_active(household_id)
  );

-- ============================================================================
-- Update Households RLS Policy
-- ============================================================================

-- Drop and recreate SELECT policy to allow users to see households where they have
-- any member record (active or pending)
DROP POLICY IF EXISTS "Users can view households they belong to" ON public.households;

CREATE POLICY "Users can view households they belong to"
  ON public.households
  FOR SELECT
  USING (
    -- Allow if user is an active member
    public.is_household_member_active(id) OR
    -- Or if user has any member record (including pending) for this household
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = households.id
      AND members.user_id = auth.uid()
    ) OR
    -- Or if household has no members (for edge cases)
    public.household_has_no_members(id)
  );
