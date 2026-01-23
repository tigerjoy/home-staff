-- Drop existing employee tables if they exist (they use BIGINT and don't follow Employee/Employment model)
DROP TABLE IF EXISTS public.employee_notes CASCADE;
DROP TABLE IF EXISTS public.employee_custom_properties CASCADE;
DROP TABLE IF EXISTS public.employee_documents CASCADE;
DROP TABLE IF EXISTS public.salary_history CASCADE;
DROP TABLE IF EXISTS public.employment_history CASCADE;
DROP TABLE IF EXISTS public.employee_addresses CASCADE;
DROP TABLE IF EXISTS public.employee_phone_numbers CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;

-- Create employees table - Core employee identity (shared across households)
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo TEXT,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employee_phone_numbers table
CREATE TABLE IF NOT EXISTS public.employee_phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employee_addresses table
CREATE TABLE IF NOT EXISTS public.employee_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employee_documents table
CREATE TABLE IF NOT EXISTS public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ID', 'Contract', 'Certificate')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employee_custom_properties table
CREATE TABLE IF NOT EXISTS public.employee_custom_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employee_notes table
CREATE TABLE IF NOT EXISTS public.employee_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create employments table - Links employees to households with household-specific data
CREATE TABLE IF NOT EXISTS public.employments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('monthly', 'adhoc')),
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'archived')),
  holiday_balance INTEGER,
  current_salary NUMERIC(10, 2),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Bank Transfer', 'UPI', 'Cheque')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(employee_id, household_id, start_date)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_custom_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
-- Users can view employees that have employments in their households
CREATE POLICY "Users can view employees in their households"
  ON public.employees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      JOIN public.members m ON m.household_id = e.household_id
      WHERE e.employee_id = employees.id
      AND m.user_id = auth.uid()
    )
  );

-- Users can create employees (they'll be linked via employment)
CREATE POLICY "Users can create employees"
  ON public.employees
  FOR INSERT
  WITH CHECK (true);

-- Users can update employees in their households
CREATE POLICY "Users can update employees in their households"
  ON public.employees
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employments e
      JOIN public.members m ON m.household_id = e.household_id
      WHERE e.employee_id = employees.id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employee_phone_numbers
CREATE POLICY "Users can manage phone numbers for employees in their households"
  ON public.employee_phone_numbers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_phone_numbers.employee_id
      AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_phone_numbers.employee_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employee_addresses
CREATE POLICY "Users can manage addresses for employees in their households"
  ON public.employee_addresses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_addresses.employee_id
      AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_addresses.employee_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employee_documents
CREATE POLICY "Users can manage documents for employees in their households"
  ON public.employee_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_documents.employee_id
      AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_documents.employee_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employee_custom_properties
CREATE POLICY "Users can manage custom properties for employees in their households"
  ON public.employee_custom_properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_custom_properties.employee_id
      AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_custom_properties.employee_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employee_notes
CREATE POLICY "Users can manage notes for employees in their households"
  ON public.employee_notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_notes.employee_id
      AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees emp
      JOIN public.employments e ON e.employee_id = emp.id
      JOIN public.members m ON m.household_id = e.household_id
      WHERE emp.id = employee_notes.employee_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policies for employments
-- Users can view employments in their households
CREATE POLICY "Users can view employments in their households"
  ON public.employments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = employments.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Users can create employments in their households
CREATE POLICY "Users can create employments in their households"
  ON public.employments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = employments.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Users can update employments in their households
CREATE POLICY "Users can update employments in their households"
  ON public.employments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = employments.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Users can delete employments in their households
CREATE POLICY "Users can delete employments in their households"
  ON public.employments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = employments.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employee_phone_numbers_employee_id ON public.employee_phone_numbers(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_addresses_employee_id ON public.employee_addresses(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_documents_employee_id ON public.employee_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_custom_properties_employee_id ON public.employee_custom_properties(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_notes_employee_id ON public.employee_notes(employee_id);
CREATE INDEX IF NOT EXISTS idx_employments_employee_id ON public.employments(employee_id);
CREATE INDEX IF NOT EXISTS idx_employments_household_id ON public.employments(household_id);
CREATE INDEX IF NOT EXISTS idx_employments_status ON public.employments(status);
CREATE INDEX IF NOT EXISTS idx_employments_household_status ON public.employments(household_id, status);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_phone_numbers_updated_at
  BEFORE UPDATE ON public.employee_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_addresses_updated_at
  BEFORE UPDATE ON public.employee_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_documents_updated_at
  BEFORE UPDATE ON public.employee_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_custom_properties_updated_at
  BEFORE UPDATE ON public.employee_custom_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employee_notes_updated_at
  BEFORE UPDATE ON public.employee_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_employments_updated_at
  BEFORE UPDATE ON public.employments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
