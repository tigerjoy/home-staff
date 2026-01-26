-- Update RLS Policies for New Function Signatures
-- This migration updates all RLS policies to use the new function signatures
-- that use auth.uid() internally (no need to pass auth.uid() as parameter)

-- ============================================================================
-- Update Households RLS Policies
-- ============================================================================

-- Drop and recreate SELECT policy
DROP POLICY IF EXISTS "Users can view households they belong to" ON public.households;

CREATE POLICY "Users can view households they belong to"
  ON public.households
  FOR SELECT
  USING (
    public.is_household_member_active(id) OR
    public.household_has_no_members(id)
  );

-- ============================================================================
-- Update Members RLS Policies
-- ============================================================================

-- Drop and recreate SELECT policy
DROP POLICY IF EXISTS "Users can view members of their households" ON public.members;

CREATE POLICY "Users can view members of their households"
  ON public.members
  FOR SELECT
  USING (
    public.is_household_member_active(household_id)
  );

-- Drop and recreate INSERT policy
DROP POLICY IF EXISTS "Users can add members to households" ON public.members;

CREATE POLICY "Users can add members to households"
  ON public.members
  FOR INSERT
  WITH CHECK (
    -- Can add themselves during onboarding (before member record exists)
    user_id = auth.uid() OR
    -- Or if they're an active admin adding others
    public.is_household_admin_active(household_id)
  );

-- Drop and recreate UPDATE policy
DROP POLICY IF EXISTS "Admins can update members" ON public.members;

CREATE POLICY "Admins can update members"
  ON public.members
  FOR UPDATE
  USING (
    public.is_household_admin_active(household_id)
  );

-- Drop and recreate DELETE policy
DROP POLICY IF EXISTS "Admins can delete members" ON public.members;

CREATE POLICY "Admins can delete members"
  ON public.members
  FOR DELETE
  USING (
    public.is_household_admin_active(household_id)
  );

-- ============================================================================
-- Update Employees RLS Policies
-- ============================================================================

-- Drop and recreate SELECT policy
DROP POLICY IF EXISTS "Users can view employees in their households" ON public.employees;

CREATE POLICY "Users can view employees in their households"
  ON public.employees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      WHERE e.employee_id = employees.id
      AND public.is_household_member_active(e.household_id)
    )
  );

-- Drop and recreate UPDATE policy
DROP POLICY IF EXISTS "Users can update employees in their households" ON public.employees;

CREATE POLICY "Users can update employees in their households"
  ON public.employees
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      WHERE e.employee_id = employees.id
      AND public.is_household_member_active(e.household_id)
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
      AND public.is_household_member_active(e.household_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_phone_numbers.employee_id
      AND public.is_household_member_active(e.household_id)
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
      AND public.is_household_member_active(e.household_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_addresses.employee_id
      AND public.is_household_member_active(e.household_id)
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
      AND public.is_household_member_active(e.household_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_documents.employee_id
      AND public.is_household_member_active(e.household_id)
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
      AND public.is_household_member_active(e.household_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_custom_properties.employee_id
      AND public.is_household_member_active(e.household_id)
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
      AND public.is_household_member_active(e.household_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      WHERE emp.id = employee_notes.employee_id
      AND public.is_household_member_active(e.household_id)
    )
  );

-- ============================================================================
-- Update Employments RLS Policies
-- ============================================================================

-- Drop and recreate all employment policies
DROP POLICY IF EXISTS "Users can view employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can create employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can update employments in their households" ON public.employments;
DROP POLICY IF EXISTS "Users can delete employments in their households" ON public.employments;

CREATE POLICY "Users can view employments in their households"
  ON public.employments
  FOR SELECT
  USING (
    public.is_household_member_active(household_id)
  );

CREATE POLICY "Users can create employments in their households"
  ON public.employments
  FOR INSERT
  WITH CHECK (
    public.is_household_member_active(household_id)
  );

CREATE POLICY "Users can update employments in their households"
  ON public.employments
  FOR UPDATE
  USING (
    public.is_household_member_active(household_id)
  );

CREATE POLICY "Users can delete employments in their households"
  ON public.employments
  FOR DELETE
  USING (
    public.is_household_member_active(household_id)
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
    public.is_household_member_active(household_id)
  );

CREATE POLICY "Admins can manage holiday rules"
  ON public.household_holiday_rules
  FOR ALL
  USING (
    public.is_household_admin_active(household_id)
  )
  WITH CHECK (
    public.is_household_admin_active(household_id)
  );

-- Update household_attendance_settings policies
DROP POLICY IF EXISTS "Users can view attendance settings of their households" ON public.household_attendance_settings;
DROP POLICY IF EXISTS "Admins can manage attendance settings" ON public.household_attendance_settings;

CREATE POLICY "Users can view attendance settings of their households"
  ON public.household_attendance_settings
  FOR SELECT
  USING (
    public.is_household_member_active(household_id)
  );

CREATE POLICY "Admins can manage attendance settings"
  ON public.household_attendance_settings
  FOR ALL
  USING (
    public.is_household_admin_active(household_id)
  )
  WITH CHECK (
    public.is_household_admin_active(household_id)
  );

-- ============================================================================
-- Update Invitations RLS Policies
-- ============================================================================

-- Update invitations SELECT policy
DROP POLICY IF EXISTS "Users can view invitations of their households" ON public.invitations;

CREATE POLICY "Users can view invitations of their households"
  ON public.invitations
  FOR SELECT
  USING (
    public.is_household_member_active(household_id)
  );

-- Note: INSERT, UPDATE, DELETE policies for invitations already use is_household_admin
-- which will now use the updated function that checks auth.uid() internally

-- ============================================================================
-- Update Households UPDATE Policy
-- ============================================================================

-- Update households UPDATE policy
DROP POLICY IF EXISTS "Admins can update households" ON public.households;

CREATE POLICY "Admins can update households"
  ON public.households
  FOR UPDATE
  USING (
    public.is_household_admin_active(id)
  );
