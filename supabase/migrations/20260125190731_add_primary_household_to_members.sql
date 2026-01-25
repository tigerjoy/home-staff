-- Add is_primary column to members table
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE NOT NULL;

-- Create unique partial index to ensure only one primary household per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_members_user_primary
ON public.members(user_id)
WHERE is_primary = TRUE;

-- Create function to ensure only one primary household per user
CREATE OR REPLACE FUNCTION public.ensure_single_primary_household()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a new primary, unset all other primaries for this user
  IF NEW.is_primary = TRUE THEN
    UPDATE public.members
    SET is_primary = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_primary = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single primary household
DROP TRIGGER IF EXISTS trigger_ensure_single_primary ON public.members;
CREATE TRIGGER trigger_ensure_single_primary
  BEFORE INSERT OR UPDATE ON public.members
  FOR EACH ROW
  WHEN (NEW.is_primary = TRUE)
  EXECUTE FUNCTION public.ensure_single_primary_household();
