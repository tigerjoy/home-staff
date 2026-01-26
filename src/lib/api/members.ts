import { supabase } from '../../supabase'
import { requirePermission, requireActiveMembership } from '../permissions/accessControl'
import { PERMISSIONS } from '../permissions/constants'
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
    .select('id, user_id, household_id, role, joined_at, is_primary, status')
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

  // Get member IDs for permission lookup
  const memberIds = members.map((m) => m.id)

  // Fetch permissions for all members
  const { data: permissions, error: permissionsError } = await supabase
    .from('member_permissions')
    .select('member_id, permission')
    .in('member_id', memberIds)

  if (permissionsError) {
    throw new Error(`Failed to fetch permissions: ${permissionsError.message}`)
  }

  // Create a map of member_id to permissions array
  const permissionsMap = new Map<string, string[]>()
  if (permissions) {
    permissions.forEach((p) => {
      const existing = permissionsMap.get(p.member_id) || []
      permissionsMap.set(p.member_id, [...existing, p.permission])
    })
  }

  // Create a map of user_id to profile
  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, p])
  )

  return members.map((member) => {
    const profile = profileMap.get(member.user_id)
    const memberPermissions = permissionsMap.get(member.id)
    
    return {
      id: member.id,
      userId: member.user_id,
      householdId: member.household_id,
      role: member.role === 'admin' ? 'Admin' : 'Member',
      joinedAt: member.joined_at,
      name: profile?.name || 'Unknown User',
      email: profile?.email || '',
      avatarUrl: profile?.avatar_url || null,
      status: member.status === 'pending' ? 'pending' : 'active',
      permissions: memberPermissions && memberPermissions.length > 0 ? memberPermissions : undefined,
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
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.MANAGE_MEMBERS)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
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
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.MANAGE_MEMBERS)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
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

/**
 * Approve a pending member (admin only)
 */
export async function approveMember(memberId: string, householdId: string): Promise<void> {
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
    throw new Error('Only admins can approve members')
  }

  // Update member status to active
  const { error } = await supabase
    .from('members')
    .update({ status: 'active' })
    .eq('id', memberId)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to approve member: ${error.message}`)
  }
}

/**
 * Reject a pending member (admin only)
 */
export async function rejectMember(memberId: string, householdId: string): Promise<void> {
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
    throw new Error('Only admins can reject members')
  }

  // Remove the member
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)
    .eq('household_id', householdId)

  if (error) {
    throw new Error(`Failed to reject member: ${error.message}`)
  }
}

/**
 * Update a member's permissions
 */
export async function updateMemberPermissions(
  memberId: string,
  householdId: string,
  permissions: string[]
): Promise<void> {
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.MANAGE_MEMBERS)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Verify the member belongs to the household
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('id', memberId)
    .eq('household_id', householdId)
    .single()

  if (memberError || !member) {
    throw new Error('Member not found in this household')
  }

  // Delete existing permissions for this member
  const { error: deleteError } = await supabase
    .from('member_permissions')
    .delete()
    .eq('member_id', memberId)

  if (deleteError) {
    throw new Error(`Failed to delete existing permissions: ${deleteError.message}`)
  }

  // Insert new permissions if any
  if (permissions.length > 0) {
    const permissionRows = permissions.map((permission) => ({
      member_id: memberId,
      permission,
    }))

    const { error: insertError } = await supabase
      .from('member_permissions')
      .insert(permissionRows)

    if (insertError) {
      throw new Error(`Failed to update member permissions: ${insertError.message}`)
    }
  }
}
