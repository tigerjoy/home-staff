import { supabase } from '../supabase/client'
import { PERMISSIONS, type Permission, hasPermission } from './constants'

/**
 * Access Control Service
 * 
 * Provides functions to check household access and permissions.
 * All functions fetch from the database to ensure real-time accuracy.
 */

export interface MemberInfo {
  isMember: boolean
  isActive: boolean
  role: 'admin' | 'member' | null
  status: 'active' | 'pending' | null
  permissions: string[]
}

export interface AccessCheckResult {
  hasAccess: boolean
  isPending: boolean
  role: 'Admin' | 'Member' | null
  permissions: string[]
  error?: string
}

/**
 * Check if user has active membership in a household
 */
export async function checkHouseholdAccess(householdId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_household_member_active', {
      p_household_id: householdId,
    })

    if (error) {
      console.error('Error checking household access:', error)
      return false
    }

    return data === true
  } catch (err) {
    console.error('Error checking household access:', err)
    return false
  }
}

/**
 * Get member information for a household
 */
export async function getMemberInfo(householdId: string): Promise<MemberInfo> {
  try {
    const { data, error } = await supabase.rpc('get_member_info', {
      p_household_id: householdId,
    })

    if (error || !data) {
      return {
        isMember: false,
        isActive: false,
        role: null,
        status: null,
        permissions: [],
      }
    }

    const memberInfo = data as {
      is_member: boolean
      is_active: boolean
      role: 'admin' | 'member' | null
      status: 'active' | 'pending' | null
      permissions: string[] | null
    }

    // Get effective permissions
    const permissions = await getUserPermissions(householdId)

    return {
      isMember: memberInfo.is_member,
      isActive: memberInfo.is_active,
      role: memberInfo.role,
      status: memberInfo.status,
      permissions,
    }
  } catch (err) {
    console.error('Error getting member info:', err)
    return {
      isMember: false,
      isActive: false,
      role: null,
      status: null,
      permissions: [],
    }
  }
}

/**
 * Get user's effective permissions for a household
 * Combines role defaults with custom overrides
 */
export async function getUserPermissions(householdId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc('get_member_permissions', {
      p_household_id: householdId,
    })

    if (error || !data) {
      return []
    }

    return data as string[]
  } catch (err) {
    console.error('Error getting user permissions:', err)
    return []
  }
}

/**
 * Check if user has a specific permission
 */
export async function checkPermission(
  householdId: string,
  permission: Permission
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_permission', {
      p_household_id: householdId,
      p_permission: permission,
    })

    if (error) {
      console.error('Error checking permission:', error)
      return false
    }

    return data === true
  } catch (err) {
    console.error('Error checking permission:', err)
    return false
  }
}

/**
 * Comprehensive access check for a household
 * Returns access status, pending status, role, and permissions
 */
export async function canAccessHousehold(householdId: string): Promise<AccessCheckResult> {
  try {
    const memberInfo = await getMemberInfo(householdId)

    if (!memberInfo.isMember) {
      return {
        hasAccess: false,
        isPending: false,
        role: null,
        permissions: [],
        error: 'You are not a member of this household',
      }
    }

    if (!memberInfo.isActive) {
      return {
        hasAccess: false,
        isPending: memberInfo.status === 'pending',
        role: memberInfo.role === 'admin' ? 'Admin' : memberInfo.role === 'member' ? 'Member' : null,
        permissions: [],
        error: memberInfo.status === 'pending'
          ? 'Your membership is pending approval from an admin'
          : 'Your membership is not active',
      }
    }

    return {
      hasAccess: true,
      isPending: false,
      role: memberInfo.role === 'admin' ? 'Admin' : memberInfo.role === 'member' ? 'Member' : null,
      permissions: memberInfo.permissions,
    }
  } catch (err) {
    console.error('Error checking household access:', err)
    return {
      hasAccess: false,
      isPending: false,
      role: null,
      permissions: [],
      error: 'Failed to check access',
    }
  }
}

/**
 * Check if user can perform an action requiring a specific permission
 */
export async function canPerformAction(
  householdId: string,
  permission: Permission
): Promise<{ allowed: boolean; reason?: string }> {
  const accessCheck = await canAccessHousehold(householdId)

  if (!accessCheck.hasAccess) {
    return {
      allowed: false,
      reason: accessCheck.error || 'Access denied',
    }
  }

  const hasPerm = await checkPermission(householdId, permission)
  if (!hasPerm) {
    return {
      allowed: false,
      reason: `You do not have permission to perform this action. Required: ${permission}`,
    }
  }

  return { allowed: true }
}

/**
 * Require a specific permission, throwing an error if not available
 */
export async function requirePermission(
  householdId: string,
  permission: Permission
): Promise<void> {
  const result = await canPerformAction(householdId, permission)
  if (!result.allowed) {
    throw new Error(result.reason || 'Permission denied')
  }
}

/**
 * Require active membership, throwing an error if not available
 */
export async function requireActiveMembership(householdId: string): Promise<void> {
  const accessCheck = await canAccessHousehold(householdId)
  if (!accessCheck.hasAccess) {
    throw new Error(accessCheck.error || 'Access denied')
  }
}
