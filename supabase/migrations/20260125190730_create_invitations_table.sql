-- Create invitations table for invitation code-based system
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_invitations_household_id ON public.invitations(household_id);
CREATE INDEX IF NOT EXISTS idx_invitations_code ON public.invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- Enable Row Level Security
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
-- Users can view invitations for households they belong to
CREATE POLICY "Users can view invitations of their households"
  ON public.invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = invitations.household_id
      AND members.user_id = auth.uid()
    )
  );

-- Admins can create invitations for their households
CREATE POLICY "Admins can create invitations"
  ON public.invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = invitations.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- Admins can update invitations for their households
CREATE POLICY "Admins can update invitations"
  ON public.invitations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = invitations.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = invitations.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- Admins can delete invitations for their households
CREATE POLICY "Admins can delete invitations"
  ON public.invitations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.household_id = invitations.household_id
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
