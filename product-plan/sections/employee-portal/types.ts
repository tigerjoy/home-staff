// =============================================================================
// Data Types
// =============================================================================

export type EmploymentType = 'monthly' | 'adhoc'
export type ActivityType = 'absence' | 'payment' | 'entitlement' | 'advance'

/**
 * The staff member's core identity for login.
 */
export interface Employee {
  id: string
  name: string
  phoneNumber: string
}

/**
 * Summary of an employment at a household.
 * Used in the household picker and switcher.
 */
export interface EmploymentSummary {
  id: string
  householdId: string
  householdName: string
  employmentType: EmploymentType
  role: string
  startDate: string
  /** Holiday balance (null for ad-hoc employees) */
  holidayBalance: number | null
  lastPaymentAmount: number | null
  lastPaymentDate: string | null
}

/**
 * Details of the currently selected employment.
 */
export interface SelectedEmploymentDetails {
  id: string
  householdName: string
  employmentType: EmploymentType
  role: string
  startDate: string
}

/**
 * Attendance metrics for Monthly employments.
 * Not shown for Ad-hoc employees.
 */
export interface AttendanceSummary {
  holidayBalance: number
  absencesThisMonth: number
  absencesThisYear: number
}

/**
 * Payment summary for Monthly employees.
 */
export interface MonthlyPaymentSummary {
  lastPaymentAmount: number | null
  lastPaymentDate: string | null
  outstandingAdvance: number
}

/**
 * Payment summary for Ad-hoc employees.
 */
export interface AdhocPaymentSummary {
  totalPayments: number
  totalAmount: number
  lastPaymentAmount: number | null
  lastPaymentDate: string | null
}

/**
 * Activity feed item (attendance or payment event).
 */
export interface ActivityItem {
  id: string
  type: ActivityType
  date: string
  title: string
  description: string
  /** For attendance events: impact on balance (e.g., "-1 day from balance") */
  impact?: string
  /** For payment events: amount received */
  amount?: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface EmployeePortalProps {
  /** The authenticated staff member's identity */
  employee?: Employee
  /** List of employments (households) this employee works for */
  employments: EmploymentSummary[]
  /** Currently selected employment ID */
  selectedEmploymentId?: string
  /** Details of the selected employment */
  selectedEmploymentDetails?: SelectedEmploymentDetails
  /** Attendance summary for Monthly employees (null for Ad-hoc) */
  attendanceSummary?: AttendanceSummary
  /** Payment summary (structure differs for Monthly vs Ad-hoc) */
  paymentSummary?: MonthlyPaymentSummary | AdhocPaymentSummary
  /** Activity feed for the selected household */
  activity: ActivityItem[]
  /** Whether the user is currently authenticating */
  isAuthenticating: boolean
  /** Error message if login fails */
  loginError?: string

  /** Called when the staff member enters their phone number to log in */
  onLogin?: (phoneNumber: string) => void
  /** Called when the staff member logs out */
  onLogout?: () => void
  /** Called when the staff member selects a different household */
  onSelectEmployment?: (employmentId: string) => void
  /** Called when the staff member wants to view more details for an activity item */
  onViewActivityDetail?: (id: string) => void
}
