/**
 * Permission Mapping Utility
 * 
 * Maps between database permission format (snake_case) and UI permission format (Title Case).
 * This allows the UI to display user-friendly permission names while the database stores
 * standardized permission identifiers.
 */

// Mapping from database format to UI format
const DB_TO_UI_MAP: Record<string, string> = {
  'view_staff_directory': 'View Staff Directory',
  'manage_staff_directory': 'Manage Staff Directory',
  'view_attendance': 'Track Attendance',
  'manage_attendance': 'Manage Attendance',
  'view_payroll': 'View Payroll & Finance',
  'manage_payroll': 'Manage Payroll & Finance',
  'invite_members': 'Invite & Remove Members',
  'manage_members': 'Manage Members',
  'edit_household_settings': 'Edit Household Settings',
  'archive_household': 'Archive Household',
}

// Reverse mapping from UI format to database format
const UI_TO_DB_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DB_TO_UI_MAP).map(([db, ui]) => [ui, db])
)

/**
 * Convert a database permission string to UI format
 */
export function dbToUiPermission(dbPermission: string): string {
  return DB_TO_UI_MAP[dbPermission] || dbPermission
}

/**
 * Convert a UI permission string to database format
 */
export function uiToDbPermission(uiPermission: string): string {
  return UI_TO_DB_MAP[uiPermission] || uiPermission
}

/**
 * Convert an array of database permissions to UI format
 */
export function dbToUiPermissions(dbPermissions: string[]): string[] {
  return dbPermissions.map(dbToUiPermission)
}

/**
 * Convert an array of UI permissions to database format
 */
export function uiToDbPermissions(uiPermissions: string[]): string[] {
  return uiPermissions.map(uiToDbPermission)
}

/**
 * Check if a permission string is in database format
 */
export function isDbFormat(permission: string): boolean {
  return permission.includes('_')
}

/**
 * Check if a permission string is in UI format
 */
export function isUiFormat(permission: string): boolean {
  return !isDbFormat(permission) && permission !== permission.toLowerCase()
}
