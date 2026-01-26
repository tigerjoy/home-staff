import { supabase } from '../../supabase'
import { requirePermission, requireActiveMembership } from '../permissions/accessControl'
import { PERMISSIONS } from '../permissions/constants'

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
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.INVITE_MEMBERS)

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
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.INVITE_MEMBERS)

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
 * Uses a SECURITY DEFINER database function to bypass RLS restrictions
 */
export async function validateInvitationCode(code: string): Promise<{
  valid: boolean
  householdId?: string
  householdName?: string
  error?: string
}> {
  const { data, error } = await supabase.rpc('validate_invitation_code', {
    p_code: code,
  })

  if (error) {
    return { valid: false, error: 'Invalid invitation code' }
  }

  if (!data) {
    return { valid: false, error: 'Invalid invitation code' }
  }

  // Parse the JSONB response from the database function
  const result = data as {
    valid: boolean
    householdId?: string
    householdName?: string
    error?: string
  }

  return {
    valid: result.valid,
    householdId: result.householdId,
    householdName: result.householdName,
    error: result.error,
  }
}

/**
 * Accept an invitation code and add current user to household
 * Uses a SECURITY DEFINER database function to handle the entire acceptance flow
 * in a transaction, bypassing RLS restrictions
 */
export async function acceptInvitationCode(code: string): Promise<{
  success: boolean
  householdId?: string
  error?: string
}> {
  const { data, error } = await supabase.rpc('accept_invitation_code', {
    p_code: code,
  })

  if (error) {
    return { success: false, error: 'Failed to join household' }
  }

  if (!data) {
    return { success: false, error: 'Failed to join household' }
  }

  // Parse the JSONB response from the database function
  const result = data as {
    success: boolean
    householdId?: string
    error?: string
  }

  return {
    success: result.success,
    householdId: result.householdId,
    error: result.error,
  }
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
  // Check access and permission
  await requireActiveMembership(householdId)
  await requirePermission(householdId, PERMISSIONS.INVITE_MEMBERS)

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('household_id', householdId)
    .eq('status', 'active')

  if (error) {
    throw new Error(`Failed to revoke invitation code: ${error.message}`)
  }
}
