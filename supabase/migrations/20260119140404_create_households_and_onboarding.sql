-- Create households table
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create members table - Links users to households with roles
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, household_id)
);

-- Create onboarding_progress table - Tracks wizard progress per user
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_step_index INTEGER DEFAULT 0 NOT NULL,
  step_data JSONB DEFAULT '{}'::jsonb NOT NULL,
  last_saved_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create household_holiday_rules table - Default holiday rules per household (Google Calendar-style recurrence)
CREATE TABLE IF NOT EXISTS public.household_holiday_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('days_per_month', 'recurring', 'custom')),
  -- Recurrence Interval
  recurrence_interval_value INTEGER DEFAULT 1 NOT NULL,
  recurrence_interval_unit TEXT NOT NULL CHECK (recurrence_interval_unit IN ('day', 'week', 'month', 'year')),
  -- Repeat On (for weekly/monthly patterns)
  repeat_on_days_of_week INTEGER[] DEFAULT NULL, -- Array of day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
  repeat_on_day_of_month INTEGER DEFAULT NULL CHECK (repeat_on_day_of_month >= 1 AND repeat_on_day_of_month <= 31),
  days_per_month INTEGER DEFAULT NULL CHECK (days_per_month > 0),
  -- Ends Condition
  ends_type TEXT DEFAULT 'never' NOT NULL CHECK (ends_type IN ('never', 'on_date', 'after_occurrences')),
  ends_date DATE DEFAULT NULL,
  ends_occurrences INTEGER DEFAULT NULL CHECK (ends_occurrences > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create household_attendance_settings table - Default attendance settings per household
CREATE TABLE IF NOT EXISTS public.household_attendance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE UNIQUE,
  tracking_method TEXT NOT NULL CHECK (tracking_method IN ('present_by_default', 'manual_entry')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_holiday_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_attendance_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households
-- Users can view households they are members of
CREATE POLICY "Users can view households they belong to"
  ON public.households
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = households.id
      AND members.user_id = auth.uid()
    )
  );

-- Users can insert households (they'll be added as admin member separately)
CREATE POLICY "Users can create households"
  ON public.households
  FOR INSERT
  WITH CHECK (true);

-- Users can update households they are admin members of
CREATE POLICY "Admins can update households"
  ON public.households
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = households.id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- RLS Policies for members
-- Users can view members of households they belong to
CREATE POLICY "Users can view members of their households"
  ON public.members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.household_id = members.household_id
      AND m.user_id = auth.uid()
    )
  );

-- Users can insert members (for adding themselves during onboarding or inviting others)
CREATE POLICY "Users can add members to households"
  ON public.members
  FOR INSERT
  WITH CHECK (
    -- Can add themselves during onboarding, or if they're admin adding others
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.household_id = members.household_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

-- Admins can update members
CREATE POLICY "Admins can update members"
  ON public.members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.household_id = members.household_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

-- Admins can delete members
CREATE POLICY "Admins can delete members"
  ON public.members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.household_id = members.household_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

-- RLS Policies for onboarding_progress
-- Users can only view and manage their own onboarding progress
CREATE POLICY "Users can view their own onboarding progress"
  ON public.onboarding_progress
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own onboarding progress"
  ON public.onboarding_progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding progress"
  ON public.onboarding_progress
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own onboarding progress"
  ON public.onboarding_progress
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for household_holiday_rules
-- Users can view holiday rules for households they belong to
CREATE POLICY "Users can view holiday rules of their households"
  ON public.household_holiday_rules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_holiday_rules.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Admins can insert/update/delete holiday rules
CREATE POLICY "Admins can manage holiday rules"
  ON public.household_holiday_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_holiday_rules.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_holiday_rules.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- RLS Policies for household_attendance_settings
-- Users can view attendance settings for households they belong to
CREATE POLICY "Users can view attendance settings of their households"
  ON public.household_attendance_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_attendance_settings.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Admins can insert/update/delete attendance settings
CREATE POLICY "Admins can manage attendance settings"
  ON public.household_attendance_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_attendance_settings.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = household_attendance_settings.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_household_id ON public.members(household_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON public.onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_household_holiday_rules_household_id ON public.household_holiday_rules(household_id);
CREATE INDEX IF NOT EXISTS idx_household_attendance_settings_household_id ON public.household_attendance_settings(household_id);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_household_holiday_rules_updated_at
  BEFORE UPDATE ON public.household_holiday_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_household_attendance_settings_updated_at
  BEFORE UPDATE ON public.household_attendance_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
