/**
 * Permission Constants
 * 
 * Defines all available permissions in the system and default permission
 * mappings for Admin and Member roles.
 */

// ============================================================================
// Permission String Constants
// ============================================================================

export const PERMISSIONS = {
  // Staff Directory
  VIEW_STAFF_DIRECTORY: 'view_staff_directory',
  MANAGE_STAFF_DIRECTORY: 'manage_staff_directory',

  // Attendance
  VIEW_ATTENDANCE: 'view_attendance',
  MANAGE_ATTENDANCE: 'manage_attendance',

  // Payroll & Finance
  VIEW_PAYROLL: 'view_payroll',
  MANAGE_PAYROLL: 'manage_payroll',

  // Members & Access
  INVITE_MEMBERS: 'invite_members',
  MANAGE_MEMBERS: 'manage_members',

  // Household Settings
  EDIT_HOUSEHOLD_SETTINGS: 'edit_household_settings',
  ARCHIVE_HOUSEHOLD: 'archive_household',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// ============================================================================
// Default Permission Maps
// ============================================================================

/**
 * Default permissions for Admin role
 * Admins have all permissions by default
 */
export const ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS.VIEW_STAFF_DIRECTORY,
  PERMISSIONS.MANAGE_STAFF_DIRECTORY,
  PERMISSIONS.VIEW_ATTENDANCE,
  PERMISSIONS.MANAGE_ATTENDANCE,
  PERMISSIONS.VIEW_PAYROLL,
  PERMISSIONS.MANAGE_PAYROLL,
  PERMISSIONS.INVITE_MEMBERS,
  PERMISSIONS.MANAGE_MEMBERS,
  PERMISSIONS.EDIT_HOUSEHOLD_SETTINGS,
  PERMISSIONS.ARCHIVE_HOUSEHOLD,
]

/**
 * Default permissions for Member role
 * Members have read-only access by default
 */
export const MEMBER_PERMISSIONS: Permission[] = [
  PERMISSIONS.VIEW_STAFF_DIRECTORY,
  PERMISSIONS.VIEW_ATTENDANCE,
  PERMISSIONS.VIEW_PAYROLL,
]

// ============================================================================
// Permission Maps by Role
// ============================================================================

export const DEFAULT_PERMISSIONS: Record<'Admin' | 'Member', Permission[]> = {
  Admin: ADMIN_PERMISSIONS,
  Member: MEMBER_PERMISSIONS,
}

// ============================================================================
// Permission Checking Utilities
// ============================================================================

/**
 * Check if a permission is valid
 */
export function isValidPermission(permission: string): permission is Permission {
  return Object.values(PERMISSIONS).includes(permission as Permission)
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(role: 'Admin' | 'Member'): Permission[] {
  return DEFAULT_PERMISSIONS[role]
}

/**
 * Check if an array of permissions includes a specific permission
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission)
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((perm) => userPermissions.includes(perm))
}

/**
 * Check if user has all of the required permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((perm) => userPermissions.includes(perm))
}
