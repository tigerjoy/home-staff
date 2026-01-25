// =============================================================================
// Data Types
// =============================================================================

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  timezone: string
}

export interface Household {
  id: string
  name: string
  role: 'Admin' | 'Member'
  status: 'active' | 'archived'
  isPrimary: boolean
}

export interface Member {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Member'
  joinedDate: string
  avatarUrl: string | null
}

export interface InvitationCode {
  id: string
  code: string
  expiresAt: string | null
  maxUses: number | null
  currentUses: number
  status: 'active' | 'expired' | 'revoked'
  sentDate: string
}

export interface PermissionsMap {
  Admin: string[]
  Member: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettingsAndAccessProps {
  /** The current user's profile */
  userProfile: UserProfile
  /** List of households the user belongs to */
  households: Household[]
  /** Members of the currently selected household */
  members: Member[]
  /** Active invitation code for the current household */
  invitationCode: InvitationCode | null
  /** Reference map of role permissions */
  permissions: PermissionsMap

  /** Called when user updates their personal profile */
  onUpdateProfile?: (updates: Partial<UserProfile>) => void
  /** Called when user switches to a different household */
  onSwitchHousehold?: (id: string) => void
  /** Called when user creates a new household */
  onCreateHousehold?: (name: string) => void
  /** Called when user renames a household */
  onRenameHousehold?: (id: string, newName: string) => void
  /** Called when an admin archives a household */
  onArchiveHousehold?: (id: string) => void
  /** Called when an admin regenerates invitation code */
  onRegenerateInvitationCode?: () => void
  /** Called when user enters invitation code to join household */
  onJoinHousehold?: (code: string) => void
  /** Called when an admin changes a member's role */
  onChangeMemberRole?: (id: string, newRole: Member['role']) => void
  /** Called when an admin removes a member */
  onRemoveMember?: (id: string) => void
  /** Called when user sets a household as primary */
  onSetPrimaryHousehold?: (id: string) => void
}
