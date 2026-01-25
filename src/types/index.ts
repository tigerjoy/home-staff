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
  isPrimary?: boolean
}

export interface MemberWithProfile extends Member {
  name: string
  email: string
  avatarUrl: string | null
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

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  timezone: string
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

/**
 * UI-specific Employee type that includes household-specific data derived from Employment.
 * This is what the UI components expect.
 */
export interface UIEmployee extends Employee {
  /** Current employment status (from current Employment) */
  status: 'active' | 'archived'
  /** Employment history derived from Employment records */
  employmentHistory: EmploymentRecord[]
  /** Salary history derived from Employment records */
  salaryHistory: SalaryRecord[]
  /** Holiday balance from current Employment */
  holidayBalance: number
  /** Current household ID (from current Employment) */
  householdId: string
}

/**
 * Summary statistics for staff directory
 */
export interface Summary {
  totalStaff: number
  activeStaff: number
  archivedStaff: number
  monthlyStaff: number
  adhocStaff: number
  roleBreakdown: { [role: string]: number }
}

/**
 * Existing employee from another household that can be linked
 */
export interface ExistingEmployeeFromOtherHousehold {
  id: string
  name: string
  role: string
  householdName: string
  phoneNumber: string
}

/**
 * Employee form component props
 */
export interface EmployeeFormProps {
  /** Existing employee data when editing, undefined when creating */
  employee?: UIEmployee
  /** Current step in the wizard (0-4) */
  currentStep: number
  /** Whether we're linking an existing employee (some steps may be skipped) */
  isLinkingExisting?: boolean
  /** Called when user moves to a different step */
  onStepChange?: (step: number) => void
  /** Called when form is submitted */
  onSubmit?: (employee: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>) => void
  /** Called when user cancels the form */
  onCancel?: () => void
  /** Called when photo file changes (for new employees, to upload after creation) */
  onPhotoFileChange?: (file: File | null) => void
  /** Called when photo is uploaded (for existing employees, to persist immediately) */
  onPhotoUploaded?: (photoUrl: string) => Promise<void>
  /** Called when document files change (for new employees, to upload after creation) */
  onDocumentFilesChange?: (files: Map<string, { file: File; category: Document['category'] }>) => void
  /** Called when documents are uploaded (for existing employees, to persist immediately) */
  onDocumentUploaded?: (documents: Document[]) => Promise<void>
  /** Called when a document is renamed (for existing employees, to update database) */
  onRenameDocument?: (documentUrl: string, newName: string) => Promise<void>
  /** Called when a custom property is added (for existing employees, to persist immediately) */
  onCustomPropertyAdded?: (property: CustomProperty) => Promise<void>
  /** Called when a note is added (for existing employees, to persist immediately) */
  onNoteAdded?: (note: Note) => Promise<void>
  /** Called when user wants to save progress without closing the form (only used in edit mode) */
  onSaveProgress?: (employee: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>) => void
}

/**
 * Employee detail component props
 */
export interface EmployeeDetailProps {
  /** The employee to display */
  employee: UIEmployee
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
  /** Called when user renames a document */
  onRenameDocument?: (documentUrl: string, newName: string) => void
  /** Called when user adds a custom property */
  onAddCustomProperty?: (property: CustomProperty) => void
  /** Called when user removes a custom property */
  onRemoveCustomProperty?: (propertyName: string) => void
  /** Called when user adds a note */
  onAddNote?: (content: string) => void
  /** Called when user deletes a note */
  onDeleteNote?: (createdAt: string) => void
}

/**
 * Staff directory component props
 */
export interface StaffDirectoryProps {
  /** Summary statistics for dashboard cards */
  summary: Summary
  /** The list of employees to display */
  employees: UIEmployee[]
  /** Employees from other households that can be linked to this one */
  existingEmployeesFromOtherHouseholds?: ExistingEmployeeFromOtherHousehold[]
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
  /** Called when user wants to link an existing employee from another household */
  onLinkExisting?: (employeeId: string) => void
  /** Called when user wants to export the staff list */
  onExport?: (format: 'csv' | 'pdf') => void
  /** Called when user searches or filters the list */
  onSearch?: (query: string) => void
  /** Called when user filters by status */
  onFilterStatus?: (status: 'all' | 'active' | 'archived') => void
  /** Called when user filters by role */
  onFilterRole?: (role: string | null) => void
  /** Called when user filters by employment type */
  onFilterEmploymentType?: (type: EmploymentType | 'all') => void
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
// Household Defaults
// =============================================================================

/**
 * Household-level holiday rule with Google Calendar-style recurrence pattern
 */
export interface HouseholdHolidayRule {
  id: string
  householdId: string
  ruleType: 'days_per_month' | 'recurring' | 'custom'
  recurrenceIntervalValue: number
  recurrenceIntervalUnit: 'day' | 'week' | 'month' | 'year'
  repeatOnDaysOfWeek?: number[] // 0=Sunday, 1=Monday, ..., 6=Saturday
  repeatOnDayOfMonth?: number // 1-31
  daysPerMonth?: number
  endsType: 'never' | 'on_date' | 'after_occurrences'
  endsDate?: string
  endsOccurrences?: number
  createdAt: string
  updatedAt: string
}

export interface HouseholdHolidayRuleInput {
  ruleType: 'days_per_month' | 'recurring' | 'custom'
  recurrenceIntervalValue?: number
  recurrenceIntervalUnit?: 'day' | 'week' | 'month' | 'year'
  repeatOnDaysOfWeek?: number[]
  repeatOnDayOfMonth?: number
  daysPerMonth?: number
  endsType?: 'never' | 'on_date' | 'after_occurrences'
  endsDate?: string
  endsOccurrences?: number
}

export interface HouseholdAttendanceSettings {
  id: string
  householdId: string
  trackingMethod: 'present_by_default' | 'manual_entry'
  createdAt: string
  updatedAt: string
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
