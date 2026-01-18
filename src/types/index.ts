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

export interface RoleBreakdown {
  [role: string]: number
}

export interface Summary {
  totalStaff: number
  activeStaff: number
  archivedStaff: number
  roleBreakdown: RoleBreakdown
}

// =============================================================================
// Component Props
// =============================================================================

export interface StaffDirectoryProps {
  /** Summary statistics for dashboard cards */
  summary: Summary
  /** The list of employees to display */
  employees: Employee[]
  /** Called when user wants to view an employee's full profile */
  onView?: (id: string) => void
  /** Called when user wants to edit an employee */
  onEdit?: (id: string) => void
  /** Called when user wants to archive an employee */
  onArchive?: (id: string) => void
  /** Called when user wants to restore an archived employee */
  onRestore?: (id: string) => void
  /** Called when user wants to create a new employee */
  onCreate?: () => void
  /** Called when user wants to export the staff list */
  onExport?: (format: 'csv' | 'pdf') => void
  /** Called when user searches or filters the list */
  onSearch?: (query: string) => void
  /** Called when user filters by status */
  onFilterStatus?: (status: 'all' | 'active' | 'archived') => void
  /** Called when user filters by role */
  onFilterRole?: (role: string | null) => void
}

export interface EmployeeDetailProps {
  /** The employee to display */
  employee: Employee
  /** Called when user wants to edit the employee */
  onEdit?: () => void
  /** Called when user wants to archive the employee */
  onArchive?: () => void
  /** Called when user wants to go back to the list */
  onBack?: () => void
  /** Called when user uploads a new document */
  onUploadDocument?: (file: File, category: Document['category']) => void
  /** Called when user deletes a document */
  onDeleteDocument?: (documentName: string) => void
  /** Called when user adds a custom property */
  onAddCustomProperty?: (property: CustomProperty) => void
  /** Called when user removes a custom property */
  onRemoveCustomProperty?: (propertyName: string) => void
  /** Called when user adds a note */
  onAddNote?: (content: string) => void
  /** Called when user deletes a note */
  onDeleteNote?: (createdAt: string) => void
}

export interface EmployeeFormProps {
  /** Existing employee data when editing, undefined when creating */
  employee?: Employee
  /** Current step in the wizard (0-4) */
  currentStep: number
  /** Called when user moves to a different step */
  onStepChange?: (step: number) => void
  /** Called when form is submitted */
  onSubmit?: (employee: Omit<Employee, 'id'>) => void
  /** Called when user cancels the form */
  onCancel?: () => void
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
