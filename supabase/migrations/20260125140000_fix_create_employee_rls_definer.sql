-- Fix RLS violation: run create_employee_with_employment as SECURITY DEFINER,
-- enforce auth + household membership inside the function, then perform inserts.

CREATE OR REPLACE FUNCTION public.create_employee_with_employment(
  p_employee JSONB,
  p_employment JSONB,
  p_phone_numbers JSONB DEFAULT '[]'::JSONB,
  p_addresses JSONB DEFAULT '[]'::JSONB,
  p_documents JSONB DEFAULT '[]'::JSONB,
  p_custom_properties JSONB DEFAULT '[]'::JSONB,
  p_notes JSONB DEFAULT '[]'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_employee_id UUID;
  v_employment_type TEXT;
  v_holiday_balance INTEGER;
  v_household_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create employee';
  END IF;

  v_household_id := (p_employment->>'household_id')::UUID;
  IF NOT EXISTS (
    SELECT 1 FROM public.members
    WHERE household_id = v_household_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'User is not a member of the household';
  END IF;

  -- 1. Insert employee
  INSERT INTO public.employees (name, photo, status)
  VALUES (
    p_employee->>'name',
    NULLIF(TRIM(COALESCE(p_employee->>'photo', '')), ''),
    'active'
  )
  RETURNING id INTO v_employee_id;

  -- 2. Resolve holiday_balance: use value from payload, or default for monthly
  v_employment_type := p_employment->>'employment_type';
  v_holiday_balance := (p_employment->>'holiday_balance')::INTEGER;
  IF v_holiday_balance IS NULL AND v_employment_type = 'monthly' THEN
    v_holiday_balance := 0;
  END IF;

  -- 3. Insert employment
  INSERT INTO public.employments (
    employee_id,
    household_id,
    employment_type,
    role,
    start_date,
    end_date,
    status,
    holiday_balance,
    current_salary,
    payment_method
  )
  VALUES (
    v_employee_id,
    v_household_id,
    v_employment_type,
    p_employment->>'role',
    (p_employment->>'start_date')::DATE,
    NULLIF(TRIM(COALESCE(p_employment->>'end_date', '')), '')::DATE,
    'active',
    v_holiday_balance,
    (p_employment->>'current_salary')::NUMERIC(10, 2),
    p_employment->>'payment_method'
  );

  -- 4. Phone numbers
  INSERT INTO public.employee_phone_numbers (employee_id, number, label)
  SELECT
    v_employee_id,
    elem->>'number',
    elem->>'label'
  FROM jsonb_array_elements(p_phone_numbers) AS elem;

  -- 5. Addresses
  INSERT INTO public.employee_addresses (employee_id, address, label)
  SELECT
    v_employee_id,
    elem->>'address',
    elem->>'label'
  FROM jsonb_array_elements(p_addresses) AS elem;

  -- 6. Documents
  INSERT INTO public.employee_documents (employee_id, name, url, category, uploaded_at)
  SELECT
    v_employee_id,
    elem->>'name',
    elem->>'url',
    elem->>'category',
    COALESCE((elem->>'uploaded_at')::TIMESTAMPTZ, NOW())
  FROM jsonb_array_elements(p_documents) AS elem;

  -- 7. Custom properties
  INSERT INTO public.employee_custom_properties (employee_id, name, value)
  SELECT
    v_employee_id,
    elem->>'name',
    elem->>'value'
  FROM jsonb_array_elements(p_custom_properties) AS elem;

  -- 8. Notes
  INSERT INTO public.employee_notes (employee_id, content)
  SELECT
    v_employee_id,
    elem->>'content'
  FROM jsonb_array_elements(p_notes) AS elem;

  RETURN v_employee_id;
END;
$$;
