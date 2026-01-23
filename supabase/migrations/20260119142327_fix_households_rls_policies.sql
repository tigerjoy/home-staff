-- Fix Households RLS Policies for Creation
-- This migration updates households policies to use helper functions and allow viewing newly created households

-- Create SECURITY DEFINER function to check if a household has no members yet
-- This allows users to view households they just created (before member record exists)
CREATE OR REPLACE FUNCTION public.household_has_no_members(
  p_household_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.members
    WHERE household_id = p_household_id
  );
END;
$$;

-- Drop existing SELECT and UPDATE policies on households
DROP POLICY IF EXISTS "Users can view households they belong to" ON public.households;
DROP POLICY IF EXISTS "Admins can update households" ON public.households;

-- Recreate SELECT policy using helper functions
-- Users can view households where they're a member OR households with no members yet (newly created)
CREATE POLICY "Users can view households they belong to"
  ON public.households
  FOR SELECT
  USING (
    public.is_household_member(id, auth.uid()) OR
    public.household_has_no_members(id)
  );

-- Recreate UPDATE policy using helper function (avoids recursion)
CREATE POLICY "Admins can update households"
  ON public.households
  FOR UPDATE
  USING (
    public.is_household_admin(id, auth.uid())
  );
