import { supabase } from '../../supabase'
import type { Household, Member } from '../../types'

// Transform database row to Household interface
function transformToHousehold(row: any): Household {
  return {
    id: row.id,
    name: row.name,
    status: row.status === 'active' ? 'active' : 'archived',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Transform database row to Member interface
function transformToMember(row: any): Member {
  return {
    id: row.id,
    userId: row.user_id,
    householdId: row.household_id,
    role: row.role === 'admin' ? 'Admin' : 'Member',
    joinedAt: row.joined_at,
  }
}

/**
 * Create a new household and add the current user as an admin member
 */
export async function createHousehold(name: string): Promise<Household> {
  // Validate input
  if (!name || name.trim().length === 0) {
    throw new Error('Household name is required')
  }

  if (name.trim().length < 2) {
    throw new Error('Household name must be at least 2 characters')
  }

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Create household
  const { data: household, error: householdError } = await supabase
    .from('households')
    .insert({
      name: name.trim(),
      status: 'active',
    })
    .select()
    .single()

  if (householdError || !household) {
    throw new Error(`Failed to create household: ${householdError?.message || 'Unknown error'}`)
  }

  // Check if this is user's first household
  const { data: existingMembers } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const isFirstHousehold = !existingMembers || existingMembers.length === 0

  // Add current user as admin member
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      user_id: user.id,
      household_id: household.id,
      role: 'admin',
      is_primary: isFirstHousehold, // Set as primary if first household
    })

  if (memberError) {
    // If member creation fails, try to clean up the household
    await supabase.from('households').delete().eq('id', household.id)
    throw new Error(`Failed to add user as member: ${memberError.message}`)
  }

  return transformToHousehold(household)
}

/**
 * Get all households for the current user
 */
export async function getUserHouseholds(): Promise<Household[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get households through members table
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('household_id')
    .eq('user_id', user.id)

  if (membersError) {
    throw new Error(`Failed to fetch user households: ${membersError.message}`)
  }

  if (!members || members.length === 0) {
    return []
  }

  const householdIds = members.map((m) => m.household_id)

  const { data: households, error: householdsError } = await supabase
    .from('households')
    .select('*')
    .in('id', householdIds)
    .order('created_at', { ascending: false })

  if (householdsError) {
    throw new Error(`Failed to fetch households: ${householdsError.message}`)
  }

  return (households || []).map(transformToHousehold)
}

/**
 * Get a specific household by ID
 */
export async function getHousehold(id: string): Promise<Household | null> {
  const { data: household, error } = await supabase
    .from('households')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    throw new Error(`Failed to fetch household: ${error.message}`)
  }

  return transformToHousehold(household)
}

/**
 * Update a household
 */
export async function updateHousehold(
  id: string,
  updates: Partial<Pick<Household, 'name' | 'status'>>
): Promise<Household> {
  // Validate input
  if (updates.name !== undefined && updates.name.trim().length < 2) {
    throw new Error('Household name must be at least 2 characters')
  }

  if (updates.status !== undefined && !['active', 'archived'].includes(updates.status)) {
    throw new Error('Invalid status value')
  }

  const updateData: any = {}
  if (updates.name !== undefined) {
    updateData.name = updates.name.trim()
  }
  if (updates.status !== undefined) {
    updateData.status = updates.status
  }

  const { data: household, error } = await supabase
    .from('households')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update household: ${error.message}`)
  }

  return transformToHousehold(household)
}

/**
 * Get members of a household
 */
export async function getHouseholdMembers(householdId: string): Promise<Member[]> {
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .eq('household_id', householdId)
    .order('joined_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`)
  }

  return (members || []).map(transformToMember)
}

/**
 * Get the current user's role in a household
 */
export async function getUserHouseholdRole(householdId: string): Promise<'Admin' | 'Member' | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  const { data: member, error } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (error || !member) {
    return null
  }

  return member.role === 'admin' ? 'Admin' : 'Member'
}

export interface HouseholdWithRole extends Household {
  role: 'Admin' | 'Member'
  isPrimary: boolean
}

/**
 * Get household with user's role and primary status
 */
export async function getHouseholdWithRole(householdId: string): Promise<HouseholdWithRole | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const { data: household, error: householdError } = await supabase
    .from('households')
    .select('*')
    .eq('id', householdId)
    .single()

  if (householdError) {
    if (householdError.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch household: ${householdError.message}`)
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role, is_primary')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member) {
    throw new Error('You do not have access to this household')
  }

  return {
    ...transformToHousehold(household),
    role: member.role === 'admin' ? 'Admin' : 'Member',
    isPrimary: member.is_primary || false,
  }
}

/**
 * Get all households for the current user with roles and primary status
 */
export async function getUserHouseholdsWithRoles(): Promise<HouseholdWithRole[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get households with member info
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(`
      household_id,
      role,
      is_primary,
      households (*)
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  if (membersError) {
    throw new Error(`Failed to fetch user households: ${membersError.message}`)
  }

  if (!members || members.length === 0) {
    return []
  }

  return members.map((member: any) => {
    const household = member.households
    return {
      ...transformToHousehold(household),
      role: member.role === 'admin' ? 'Admin' : 'Member',
      isPrimary: member.is_primary || false,
    }
  })
}

/**
 * Set a household as primary
 */
export async function setPrimaryHousehold(householdId: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Verify user has access to this household
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member) {
    throw new Error('You do not have access to this household')
  }

  // Unset all other primary households for this user
  const { error: unsetError } = await supabase
    .from('members')
    .update({ is_primary: false })
    .eq('user_id', user.id)
    .neq('household_id', householdId)

  if (unsetError) {
    throw new Error(`Failed to unset previous primary: ${unsetError.message}`)
  }

  // Set this household as primary
  const { error: setError } = await supabase
    .from('members')
    .update({ is_primary: true })
    .eq('id', member.id)

  if (setError) {
    throw new Error(`Failed to set primary household: ${setError.message}`)
  }
}

/**
 * Set last opened household in user's profile
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

/**
 * Get last opened household ID from user's profile
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
 * Rename a household (admin only)
 */
export async function renameHousehold(id: string, newName: string): Promise<Household> {
  if (!newName || newName.trim().length < 2) {
    throw new Error('Household name must be at least 2 characters')
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', id)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member || member.role !== 'admin') {
    throw new Error('Only admins can rename households')
  }

  return updateHousehold(id, { name: newName })
}

/**
 * Archive a household (admin only, soft delete)
 */
export async function archiveHousehold(id: string): Promise<Household> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', id)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member || member.role !== 'admin') {
    throw new Error('Only admins can archive households')
  }

  return updateHousehold(id, { status: 'archived' })
}
