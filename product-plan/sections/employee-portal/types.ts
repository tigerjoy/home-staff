// =============================================================================
// Data Types
// =============================================================================

export interface StaffProfile {
  id: string
  name: string
  role: string
  phoneNumber: string
  joinDate: string
  householdName: string
}

export interface StaffSummary {
  holidayBalance: number
  totalAbsencesYear: number
  lastPaymentAmount: number
  lastPaymentDate: string
  outstandingAdvance: number
}

export interface ActivityItem {
  id: string
  type: 'absence' | 'payment' | 'entitlement' | 'advance'
  date: string
  title: string
  description: string
  impact?: string
  amount?: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface EmployeePortalProps {
  /** The staff member's profile details */
  staff?: StaffProfile
  /** Summary metrics for the dashboard */
  summary?: StaffSummary
  /** Combined timeline of attendance and financial events */
  activity: ActivityItem[]
  /** Whether the user is currently authenticating */
  isAuthenticating: boolean
  /** Error message if login fails */
  loginError?: string

  /** Called when the staff member enters their phone number to log in */
  onLogin?: (phoneNumber: string) => void
  /** Called when the staff member logs out */
  onLogout?: () => void
  /** Called when the staff member wants to view more details for an activity item */
  onViewActivityDetail?: (id: string) => void
}
