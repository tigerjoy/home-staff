// =============================================================================
// Core Entities
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  timezone: string
}

export interface Household {
  id: string
  name: string
  status: 'active' | 'archived'
  isPrimary: boolean
}

export interface Member {
  id: string
  userId: string
  householdId: string
  name: string
  email: string
  role: 'Admin' | 'Member'
  joinedDate: string
  avatarUrl: string | null
}

export interface Invitation {
  id: string
  householdId: string
  email: string
  role: 'Admin' | 'Member'
  sentDate: string
  status: 'pending' | 'expired' | 'accepted'
}

// =============================================================================
// Employee & Staff Directory
// =============================================================================

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

export interface Employee {
  id: string
  householdId: string
  name: string
  photo: string | null
  status: 'active' | 'archived'
  phoneNumbers: PhoneNumber[]
  addresses: Address[]
  employmentHistory: EmploymentRecord[]
  salaryHistory: SalaryRecord[]
  documents: Document[]
  customProperties: CustomProperty[]
  notes: Note[]
  holidayBalance: number
}

// =============================================================================
// Attendance & Holidays
// =============================================================================

export type LeaveType = 'sick' | 'casual' | 'paid' | 'unpaid' | 'other'
export type HolidayType = 'public' | 'festival' | 'other'

export interface LeaveRecord {
  id: string
  employeeId: string
  date: string
  type: LeaveType
  notes?: string
}

export interface Holiday {
  id: string
  householdId: string
  date: string
  name: string
  type: HolidayType
}

export interface HolidayRule {
  id: string
  employeeId: string
  type: 'fixed' | 'recurring'
  monthlyAllowance?: number
  weeklyOffDays?: number[]
  autoMarkAbsence: boolean
}

export interface InactivityPeriod {
  id: string
  employeeId: string
  startDate: string
  endDate?: string
  reason?: string
}

// =============================================================================
// Payroll & Finance
// =============================================================================

export interface PaymentReceipt {
  id: string
  url: string
  fileName: string
  fileType: 'image' | 'pdf'
  uploadedAt: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  month: string // YYYY-MM format
  baseSalary: number
  bonuses: number
  penalties: number
  encashments: number
  advanceRepayment: number
  netPayable: number
  status: 'draft' | 'calculated' | 'pending_settlement' | 'paid'
  holidayImbalance: number
}

export interface Advance {
  id: string
  employeeId: string
  amount: number
  date: string
  repaidAmount: number
  status: 'active' | 'repaid' | 'cancelled'
}

export interface LedgerEntry {
  id: string
  employeeId: string
  date: string
  type: 'Salary' | 'Advance' | 'Bonus' | 'Penalty' | 'Encashment'
  amount: number
  status: 'Paid' | 'Disbursed' | 'Pending'
  reference: string
  receipts?: PaymentReceipt[]
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
