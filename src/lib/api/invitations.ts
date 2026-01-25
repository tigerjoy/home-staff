import { supabase } from '../../supabase'

export interface InvitationCode {
  id: string
  householdId: string
  code: string
  createdBy: string
  expiresAt: string | null
  maxUses: number | null
  currentUses: number
  status: 'active' | 'expired' | 'revoked'
  createdAt: string
  updatedAt: string
}

export interface InvitationCodeOptions {
  expiresAt?: Date
  maxUses?: number
}

/**
 * Generate a random invitation code
 */
function generateInvitationCode(): string {
  // Generate a 8-character alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding similar-looking characters
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Create an invitation code for a household
 */
export async function createInvitationCode(
  householdId: string,
  options?: InvitationCodeOptions
): Promise<InvitationCode> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin of the household
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member || member.role !== 'admin') {
    throw new Error('Only admins can create invitation codes')
  }

  // Check if there's already an active invitation code
  const { data: existing } = await supabase
    .from('invitations')
    .select('id')
    .eq('household_id', householdId)
    .eq('status', 'active')
    .single()

  if (existing) {
    throw new Error('An active invitation code already exists for this household')
  }

  // Generate unique code
  let code = generateInvitationCode()
  let attempts = 0
  while (attempts < 10) {
    const { data: existingCode } = await supabase
      .from('invitations')
      .select('id')
      .eq('code', code)
      .single()

    if (!existingCode) {
      break
    }
    code = generateInvitationCode()
    attempts++
  }

  if (attempts >= 10) {
    throw new Error('Failed to generate unique invitation code')
  }

  // Create invitation
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .insert({
      household_id: householdId,
      code,
      created_by: user.id,
      expires_at: options?.expiresAt?.toISOString() || null,
      max_uses: options?.maxUses || null,
      current_uses: 0,
      status: 'active',
    })
    .select()
    .single()

  if (invitationError || !invitation) {
    throw new Error(`Failed to create invitation code: ${invitationError?.message || 'Unknown error'}`)
  }

  return {
    id: invitation.id,
    householdId: invitation.household_id,
    code: invitation.code,
    createdBy: invitation.created_by,
    expiresAt: invitation.expires_at,
    maxUses: invitation.max_uses,
    currentUses: invitation.current_uses,
    status: invitation.status,
    createdAt: invitation.created_at,
    updatedAt: invitation.updated_at,
  }
}

/**
 * Get the active invitation code for a household
 */
export async function getInvitationCode(householdId: string): Promise<InvitationCode | null> {
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('household_id', householdId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch invitation code: ${error.message}`)
  }

  if (!invitation) {
    return null
  }

  return {
    id: invitation.id,
    householdId: invitation.household_id,
    code: invitation.code,
    createdBy: invitation.created_by,
    expiresAt: invitation.expires_at,
    maxUses: invitation.max_uses,
    currentUses: invitation.current_uses,
    status: invitation.status,
    createdAt: invitation.created_at,
    updatedAt: invitation.updated_at,
  }
}

/**
 * Regenerate invitation code (revoke old and create new)
 */
export async function regenerateInvitationCode(householdId: string): Promise<InvitationCode> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member || member.role !== 'admin') {
    throw new Error('Only admins can regenerate invitation codes')
  }

  // Revoke existing active invitation
  const { error: revokeError } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('household_id', householdId)
    .eq('status', 'active')

  if (revokeError) {
    throw new Error(`Failed to revoke existing invitation: ${revokeError.message}`)
  }

  // Create new invitation code
  return createInvitationCode(householdId)
}

/**
 * Validate an invitation code and return household info
 */
export async function validateInvitationCode(code: string): Promise<{
  valid: boolean
  householdId?: string
  householdName?: string
  error?: string
}> {
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*, households(name)')
    .eq('code', code)
    .eq('status', 'active')
    .single()

  if (error || !invitation) {
    return { valid: false, error: 'Invalid invitation code' }
  }

  // Check expiration
  if (invitation.expires_at) {
    const expiresAt = new Date(invitation.expires_at)
    if (expiresAt < new Date()) {
      // Mark as expired
      await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id)
      return { valid: false, error: 'Invitation code has expired' }
    }
  }

  // Check max uses
  if (invitation.max_uses !== null && invitation.current_uses >= invitation.max_uses) {
    return { valid: false, error: 'Invitation code has reached maximum uses' }
  }

  const household = invitation.households as { name: string } | null

  return {
    valid: true,
    householdId: invitation.household_id,
    householdName: household?.name || 'Unknown Household',
  }
}

/**
 * Accept an invitation code and add current user to household
 */
export async function acceptInvitationCode(code: string): Promise<{
  success: boolean
  householdId?: string
  error?: string
}> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Validate code
  const validation = await validateInvitationCode(code)
  if (!validation.valid || !validation.householdId) {
    return { success: false, error: validation.error || 'Invalid invitation code' }
  }

  const householdId = validation.householdId

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('members')
    .select('id')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (existingMember) {
    return { success: false, error: 'You are already a member of this household' }
  }

  // Get invitation to determine role
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code)
    .eq('status', 'active')
    .single()

  if (invitationError || !invitation) {
    return { success: false, error: 'Invalid invitation code' }
  }

  // Check if this is user's first household (to set as primary)
  const { data: existingHouseholds } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const isFirstHousehold = !existingHouseholds || existingHouseholds.length === 0

  // Add user as member (default to 'member' role, admins can change later)
  // Note: The invitation doesn't store role, so we default to 'member'
  // If needed, we could add role to invitations table later
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      user_id: user.id,
      household_id: householdId,
      role: 'member',
      is_primary: isFirstHousehold, // Set as primary if first household
    })

  if (memberError) {
    return { success: false, error: `Failed to join household: ${memberError.message}` }
  }

  // Increment usage count
  const { error: updateError } = await supabase
    .from('invitations')
    .update({
      current_uses: invitation.current_uses + 1,
    })
    .eq('id', invitation.id)

  if (updateError) {
    // Log error but don't fail - member was added successfully
    console.error('Failed to update invitation usage:', updateError)
  }

  // Check if max uses reached
  if (invitation.max_uses !== null && invitation.current_uses + 1 >= invitation.max_uses) {
    await supabase
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('id', invitation.id)
  }

  return { success: true, householdId }
}

/**
 * Get invitation details for a household
 */
export async function getHouseholdInvitations(householdId: string): Promise<InvitationCode[]> {
  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch invitations: ${error.message}`)
  }

  return (invitations || []).map((invitation) => ({
    id: invitation.id,
    householdId: invitation.household_id,
    code: invitation.code,
    createdBy: invitation.created_by,
    expiresAt: invitation.expires_at,
    maxUses: invitation.max_uses,
    currentUses: invitation.current_uses,
    status: invitation.status,
    createdAt: invitation.created_at,
    updatedAt: invitation.updated_at,
  }))
}

/**
 * Revoke an invitation code
 */
export async function revokeInvitationCode(householdId: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !member || member.role !== 'admin') {
    throw new Error('Only admins can revoke invitation codes')
  }

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('household_id', householdId)
    .eq('status', 'active')

  if (error) {
    throw new Error(`Failed to revoke invitation code: ${error.message}`)
  }
}
