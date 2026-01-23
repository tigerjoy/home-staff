-- Fix RLS Policy Recursion in Members Table
-- This migration creates SECURITY DEFINER functions to check membership without triggering RLS recursion

-- Drop existing policies on members table
DROP POLICY IF EXISTS "Users can view members of their households" ON public.members;
DROP POLICY IF EXISTS "Users can add members to households" ON public.members;
DROP POLICY IF EXISTS "Admins can update members" ON public.members;
DROP POLICY IF EXISTS "Admins can delete members" ON public.members;

-- Create SECURITY DEFINER function to check if a user is a member of a household
-- This function bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION public.is_household_member(
  p_household_id UUID,
  p_user_id UUID
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
    AND user_id = p_user_id
  );
END;
$$;

-- Create SECURITY DEFINER function to check if a user is an admin member of a household
CREATE OR REPLACE FUNCTION public.is_household_admin(
  p_household_id UUID,
  p_user_id UUID
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
    AND user_id = p_user_id
    AND role = 'admin'
  );
END;
$$;

-- Recreate RLS Policies for members using the helper functions

-- Users can view members of households they belong to
CREATE POLICY "Users can view members of their households"
  ON public.members
  FOR SELECT
  USING (
    public.is_household_member(household_id, auth.uid())
  );

-- Users can insert members (for adding themselves during onboarding or inviting others)
CREATE POLICY "Users can add members to households"
  ON public.members
  FOR INSERT
  WITH CHECK (
    -- Can add themselves during onboarding
    user_id = auth.uid() OR
    -- Or if they're admin adding others
    public.is_household_admin(household_id, auth.uid())
  );

-- Admins can update members
CREATE POLICY "Admins can update members"
  ON public.members
  FOR UPDATE
  USING (
    public.is_household_admin(household_id, auth.uid())
  );

-- Admins can delete members
CREATE POLICY "Admins can delete members"
  ON public.members
  FOR DELETE
  USING (
    public.is_household_admin(household_id, auth.uid())
  );
