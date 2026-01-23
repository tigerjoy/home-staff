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

  // Add current user as admin member
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      user_id: user.id,
      household_id: household.id,
      role: 'admin',
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
