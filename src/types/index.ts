// =============================================================================
// Core Entities
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  authProvider: 'email' | 'google' | 'facebook'
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Household {
  id: string
  name: string
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  userId: string
  householdId: string
  role: 'Admin' | 'Member'
  joinedAt: string
}

export interface Invitation {
  id: string
  householdId: string
  email: string
  role: 'Admin' | 'Member'
  status: 'pending' | 'accepted' | 'expired'
  sentAt: string
  expiresAt: string
}

// =============================================================================
// Employee Management
// =============================================================================

/**
 * Employee represents a domestic staff member's core identity.
 * The profile information is shared across households.
 */
export interface Employee {
  id: string
  name: string
  photo: string | null
  phoneNumbers: PhoneNumber[]
  addresses: Address[]
  documents: Document[]
  customProperties: CustomProperty[]
  notes: Note[]
  createdAt: string
  updatedAt: string
}

export type EmploymentType = 'monthly' | 'adhoc'
export type EmploymentStatus = 'active' | 'archived'

/**
 * Employment represents the working relationship between an Employee and a Household.
 * Contains household-specific data like employment type, salary, and holiday balance.
 *
 * Employment Types:
 * - 'monthly': Regular employees on a fixed salary with full attendance/holiday tracking
 * - 'adhoc': Irregular workers with only payment records (no attendance/holiday tracking)
 */
export interface Employment {
  id: string
  employeeId: string
  householdId: string
  employmentType: EmploymentType
  role: string
  startDate: string
  endDate?: string
  status: EmploymentStatus
  /** Running holiday balance (null for adhoc employees) */
  holidayBalance: number | null
  /** Current salary amount (null for adhoc employees) */
  currentSalary: number | null
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'
  createdAt: string
  updatedAt: string
}

export interface PhoneNumber {
  number: string
  label: string
}

export interface Address {
  address: string
  label: string
}

export interface EmploymentRecord {
  role: string
  department: string
  startDate: string
  endDate: string | null
}

export interface SalaryRecord {
  amount: number
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'
  effectiveDate: string
}

export interface Document {
  name: string
  url: string
  category: 'ID' | 'Contract' | 'Certificate'
  uploadedAt: string
}

export interface CustomProperty {
  name: string
  value: string
}

export interface Note {
  content: string
  createdAt: string
}

// =============================================================================
// Attendance & Holidays
// =============================================================================

/**
 * Attendance records are linked to Employment (not Employee) since attendance
 * is tracked per-household. Only Monthly employments have attendance tracking.
 */
export interface AttendanceRecord {
  id: string
  employmentId: string
  date: string
  reason?: string
  /** Whether this absence was also applied to other households */
  appliedToOtherHouseholds: boolean
  createdAt: string
}

export interface InactivityPeriod {
  id: string
  employmentId: string
  startDate: string
  endDate?: string
  reason?: string
  /** Whether this inactivity was also applied to other households */
  appliedToOtherHouseholds: boolean
  createdAt: string
}

export type HolidayRuleType = 'fixed' | 'recurring'

export interface HolidayRule {
  id: string
  employmentId: string
  type: HolidayRuleType
  /** For 'fixed' type: number of days credited per month */
  monthlyAllowance: number | null
  /** For 'recurring' type: days of week that are off (0=Sunday, 6=Saturday) */
  weeklyOffDays: number[]
  /** Automatically record absences on scheduled off-days when employee works */
  autoMarkAbsence: boolean
  createdAt: string
}

export interface PublicHoliday {
  id: string
  householdId: string
  date: string
  name: string
}

// =============================================================================
// Payroll & Finance
// =============================================================================

/**
 * Payroll items are linked to Employment (not Employee) since payroll
 * is tracked per-household. Each household maintains independent salary
 * and payment history.
 */
export type PayrollItemType = 'Salary' | 'Advance' | 'Bonus' | 'Penalty' | 'Encashment' | 'AdhocPayment'

export interface PayrollItem {
  id: string
  employmentId: string
  date: string
  type: PayrollItemType
  amount: number
  status: 'Pending' | 'Paid' | 'Cancelled'
  reference?: string
  receipts?: PaymentReceipt[]
  createdAt: string
}

export interface PaymentReceipt {
  id: string
  url: string
  fileName: string
  fileType: 'image' | 'pdf'
  uploadedAt: string
}

export interface Advance {
  id: string
  employmentId: string
  amount: number
  date: string
  repaidAmount: number
  monthlyDeduction: number
  reason?: string
  status: 'active' | 'repaid' | 'cancelled'
  createdAt: string
}

// =============================================================================
// Onboarding
// =============================================================================

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  status: 'pending' | 'in_progress' | 'completed'
}

export interface OnboardingConfig {
  userId: string
  currentStepIndex: number
  totalSteps: number
  isCompleted: boolean
  lastSavedAt: string
}

// =============================================================================
// Employee Portal
// =============================================================================

export interface ActivityItem {
  id: string
  type: 'absence' | 'payment' | 'entitlement' | 'advance'
  date: string
  title: string
  description: string
  impact?: string
  amount?: number
}
