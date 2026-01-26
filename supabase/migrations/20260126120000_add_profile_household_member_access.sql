-- Add RLS policy to allow household members to view profiles of co-members
-- This fixes the "Unknown User" display issue when viewing pending members
-- 
-- Problem: When an admin views members of their household, they cannot see
-- profile information (name, email, avatar) for pending members because the
-- existing RLS policy only allows users to view their own profile.
--
-- Solution: Add a policy that allows users to view profiles of other users
-- who are members of at least one shared household (both active and pending).

CREATE POLICY "Household members can view profiles of co-members"
  ON public.profiles
  FOR SELECT
  USING (
    -- Allow viewing own profile (existing behavior preserved)
    auth.uid() = id OR
    -- Allow viewing profiles of users who share at least one household
    EXISTS (
      SELECT 1 FROM public.members m1
      INNER JOIN public.members m2 ON m1.household_id = m2.household_id
      WHERE m1.user_id = auth.uid()
      AND m2.user_id = profiles.id
    )
  );
