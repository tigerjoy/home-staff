-- Remove permissions JSONB column from members table
-- This migration removes the old JSONB column since permissions are now stored
-- in the separate member_permissions table

-- Drop the permissions column from members table
ALTER TABLE public.members DROP COLUMN IF EXISTS permissions;
