import { supabase } from '../../supabase'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  timezone: string
  lastOpenedHouseholdId: string | null
}

/**
 * Get current user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    throw new Error(`Failed to fetch profile: ${profileError.message}`)
  }

  if (!profile) {
    throw new Error('Profile not found')
  }

  return {
    id: profile.id,
    name: profile.name,
    email: user.email || '',
    avatarUrl: profile.avatar_url,
    timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lastOpenedHouseholdId: profile.last_opened_household_id || null,
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  name?: string
  avatarUrl?: string | null
  timezone?: string
}): Promise<UserProfile> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const updateData: any = {}
  if (updates.name !== undefined) {
    updateData.name = updates.name.trim()
  }
  if (updates.avatarUrl !== undefined) {
    updateData.avatar_url = updates.avatarUrl
  }
  if (updates.timezone !== undefined) {
    updateData.timezone = updates.timezone
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single()

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  if (!profile) {
    throw new Error('Profile not found')
  }

  // Get updated user email
  const { data: { user: updatedUser } } = await supabase.auth.getUser()

  return {
    id: profile.id,
    name: profile.name,
    email: updatedUser?.email || '',
    avatarUrl: profile.avatar_url,
    timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lastOpenedHouseholdId: profile.last_opened_household_id || null,
  }
}

/**
 * Get user's last opened household ID
 */
export async function getLastOpenedHousehold(): Promise<string | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_opened_household_id')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile.last_opened_household_id || null
}

/**
 * Set user's last opened household ID
 */
export async function setLastOpenedHousehold(householdId: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Verify user has access to this household
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (!member) {
    throw new Error('You do not have access to this household')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ last_opened_household_id: householdId })
    .eq('id', user.id)

  if (error) {
    throw new Error(`Failed to update last opened household: ${error.message}`)
  }
}
