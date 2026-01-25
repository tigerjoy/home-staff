-- Add last_opened_household_id column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_opened_household_id UUID REFERENCES public.households(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_opened_household_id ON public.profiles(last_opened_household_id);

-- Note: RLS policies for profiles already exist and will cover this column
-- Users can only view/update their own profile, which includes last_opened_household_id
