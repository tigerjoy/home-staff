import { supabase } from '../../supabase'
import type { Member } from '../../types'

export interface MemberWithProfile extends Member {
  name: string
  email: string
  avatarUrl: string | null
}

/**
 * Get all members of a household with their user profile data
 */
export async function getHouseholdMembers(householdId: string): Promise<MemberWithProfile[]> {
  // First get members
  const { data: members, error } = await supabase
    .from('members')
    .select('id, user_id, household_id, role, joined_at, is_primary')
    .eq('household_id', householdId)
    .order('joined_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`)
  }

  if (!members || members.length === 0) {
    return []
  }

  // Get user IDs
  const userIds = members.map((m) => m.user_id)

  // Fetch profiles for all users
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, email, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    throw new Error(`Failed to fetch profiles: ${profilesError.message}`)
  }

  // Create a map of user_id to profile
  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, p])
  )

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`)
  }

  return members.map((member) => {
    const profile = profileMap.get(member.user_id)
    return {
      id: member.id,
      userId: member.user_id,
      householdId: member.household_id,
      role: member.role === 'admin' ? 'Admin' : 'Member',
      joinedAt: member.joined_at,
      name: profile?.name || 'Unknown User',
      email: profile?.email || '',
      avatarUrl: profile?.avatar_url || null,
    }
  })
}


/**
 * Update a member's role
 */
export async function updateMemberRole(
  memberId: string,
  householdId: string,
  newRole: 'Admin' | 'Member'
): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if current user is admin
  const { data: currentMember, error: currentMemberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (currentMemberError || !currentMember || currentMember.role !== 'admin') {
    throw new Error('Only admins can change member roles')
  }

  // Check if this is the last admin
  const { data: adminCount } = await supabase
    .from('members')
    .select('id', { count: 'exact', head: true })
    .eq('household_id', householdId)
    .eq('role', 'admin')

  if (adminCount && adminCount === 1) {
    // Check if we're trying to change the last admin
    const { data: targetMember } = await supabase
      .from('members')
      .select('role')
      .eq('id', memberId)
      .single()

    if (targetMember?.role === 'admin' && newRole === 'Member') {
      throw new Error('Cannot change role of the last admin. Please assign another admin first.')
    }
  }

  const { error } = await supabase
    .from('members')
    .update({ role: newRole.toLowerCase() })
    .eq('id', memberId)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to update member role: ${error.message}`)
  }
}

/**
 * Remove a member from a household
 */
export async function removeMember(memberId: string, householdId: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if current user is admin
  const { data: currentMember, error: currentMemberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (currentMemberError || !currentMember || currentMember.role !== 'admin') {
    throw new Error('Only admins can remove members')
  }

  // Check if trying to remove the last admin
  const { data: adminCount } = await supabase
    .from('members')
    .select('id', { count: 'exact', head: true })
    .eq('household_id', householdId)
    .eq('role', 'admin')

  if (adminCount && adminCount === 1) {
    const { data: targetMember } = await supabase
      .from('members')
      .select('role')
      .eq('id', memberId)
      .single()

    if (targetMember?.role === 'admin') {
      throw new Error('Cannot remove the last admin. Please assign another admin first.')
    }
  }

  // Prevent removing yourself
  const { data: targetMember } = await supabase
    .from('members')
    .select('user_id')
    .eq('id', memberId)
    .single()

  if (targetMember?.user_id === user.id) {
    throw new Error('You cannot remove yourself from the household')
  }

  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to remove member: ${error.message}`)
  }
}

/**
 * Get current user's role in a household
 */
export async function getCurrentUserRole(householdId: string): Promise<'Admin' | 'Member' | null> {
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
