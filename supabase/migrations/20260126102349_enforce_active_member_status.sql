-- Enforce Active Member Status in All RLS Policies
-- This migration updates all RLS policies to require active member status
-- Pending members will not be able to access any household data

-- ============================================================================
-- Update Households RLS Policies
-- ============================================================================

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view households they belong to" ON public.households;

-- Recreate SELECT policy using active member check
CREATE POLICY "Users can view households they belong to"
  ON public.households
  FOR SELECT
  USING (
    public.is_household_member_active(id, auth.uid()) OR
    public.household_has_no_members(id)
  );

-- ============================================================================
-- Update Members RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view members of their households" ON public.members;

-- Recreate SELECT policy - users can view members if they are active members
CREATE POLICY "Users can view members of their households"
  ON public.members
  FOR SELECT
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

-- Update INSERT policy - only active admins can add members
DROP POLICY IF EXISTS "Users can add members to households" ON public.members;
CREATE POLICY "Users can add members to households"
  ON public.members
  FOR INSERT
  WITH CHECK (
    -- Can add themselves during onboarding (before member record exists)
    user_id = auth.uid() OR
    -- Or if they're an active admin adding others
    public.is_household_admin_active(household_id, auth.uid())
  );

-- Update UPDATE policy - only active admins can update members
DROP POLICY IF EXISTS "Admins can update members" ON public.members;
CREATE POLICY "Admins can update members"
  ON public.members
  FOR UPDATE
  USING (
    public.is_household_admin_active(household_id, auth.uid())
  );

-- Update DELETE policy - only active admins can delete members
DROP POLICY IF EXISTS "Admins can delete members" ON public.members;
CREATE POLICY "Admins can delete members"
  ON public.members
  FOR DELETE
  USING (
    public.is_household_admin_active(household_id, auth.uid())
  );

-- ============================================================================
-- Update Employees RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view employees in their households" ON public.employees;
DROP POLICY IF EXISTS "Users can update employees in their households" ON public.employees;

-- Recreate SELECT policy - only active members can view employees
CREATE POLICY "Users can view employees in their households"
  ON public.employees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      WHERE e.employee_id = employees.id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- Recreate UPDATE policy - only active members can update employees
CREATE POLICY "Users can update employees in their households"
  ON public.employees
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      WHERE e.employee_id = employees.id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- ============================================================================
-- Update Employee Related Tables RLS Policies
-- ============================================================================

-- Drop and recreate employee_phone_numbers policy
DROP POLICY IF EXISTS "Users can manage phone numbers for employees in their households" ON public.employee_phone_numbers;
CREATE POLICY "Users can manage phone numbers for employees in their households"
  ON public.employee_phone_numbers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_phone_numbers.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_phone_numbers.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- Drop and recreate employee_addresses policy
DROP POLICY IF EXISTS "Users can manage addresses for employees in their households" ON public.employee_addresses;
CREATE POLICY "Users can manage addresses for employees in their households"
  ON public.employee_addresses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_addresses.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_addresses.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- Drop and recreate employee_documents policy
DROP POLICY IF EXISTS "Users can manage documents for employees in their households" ON public.employee_documents;
CREATE POLICY "Users can manage documents for employees in their households"
  ON public.employee_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_documents.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_documents.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- Drop and recreate employee_custom_properties policy
DROP POLICY IF EXISTS "Users can manage custom properties for employees in their households" ON public.employee_custom_properties;
CREATE POLICY "Users can manage custom properties for employees in their households"
  ON public.employee_custom_properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_custom_properties.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_custom_properties.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- Drop and recreate employee_notes policy
DROP POLICY IF EXISTS "Users can manage notes for employees in their households" ON public.employee_notes;
CREATE POLICY "Users can manage notes for employees in their households"
  ON public.employee_notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_notes.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_notes.employee_id
      AND public.is_household_member_active(e.household_id, auth.uid())
    )
  );

-- ============================================================================
-- Update Employments RLS Policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can create employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can update employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can delete employments in their households" ON public.employments;

-- Recreate all employment policies with active member check
CREATE POLICY "Users can view employments in their households"
  ON public.employments
  FOR SELECT
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

CREATE POLICY "Users can create employments in their households"
  ON public.employments
  FOR INSERT
  WITH CHECK (
    public.is_household_member_active(household_id, auth.uid())
  );

CREATE POLICY "Users can update employments in their households"
  ON public.employments
  FOR UPDATE
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

CREATE POLICY "Users can delete employments in their households"
  ON public.employments
  FOR DELETE
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

-- ============================================================================
-- Update Household Settings RLS Policies
-- ============================================================================

-- Update household_holiday_rules policies
DROP POLICY IF EXISTS "Users can view holiday rules of their households" ON public.household_holiday_rules;
DROP POLICY IF EXISTS "Admins can manage holiday rules" ON public.household_holiday_rules;

CREATE POLICY "Users can view holiday rules of their households"
  ON public.household_holiday_rules
  FOR SELECT
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

CREATE POLICY "Admins can manage holiday rules"
  ON public.household_holiday_rules
  FOR ALL
  USING (
    public.is_household_admin_active(household_id, auth.uid())
  )
  WITH CHECK (
    public.is_household_admin_active(household_id, auth.uid())
  );

-- Update household_attendance_settings policies
DROP POLICY IF EXISTS "Users can view attendance settings of their households" ON public.household_attendance_settings;
DROP POLICY IF EXISTS "Admins can manage attendance settings" ON public.household_attendance_settings;

CREATE POLICY "Users can view attendance settings of their households"
  ON public.household_attendance_settings
  FOR SELECT
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

CREATE POLICY "Admins can manage attendance settings"
  ON public.household_attendance_settings
  FOR ALL
  USING (
    public.is_household_admin_active(household_id, auth.uid())
  )
  WITH CHECK (
    public.is_household_admin_active(household_id, auth.uid())
  );

-- ============================================================================
-- Update Invitations RLS Policies
-- ============================================================================

-- Update invitations policies to require active membership
DROP POLICY IF EXISTS "Users can view invitations of their households" ON public.invitations;

CREATE POLICY "Users can view invitations of their households"
  ON public.invitations
  FOR SELECT
  USING (
    public.is_household_member_active(household_id, auth.uid())
  );

-- Note: INSERT, UPDATE, DELETE policies for invitations already check for admin role
-- They will automatically use the updated is_household_admin function which now checks active status
