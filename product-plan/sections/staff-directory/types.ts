// =============================================================================
// Data Types
// =============================================================================

export type EmploymentType = 'monthly' | 'adhoc'
export type EmploymentStatus = 'active' | 'archived'
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'
export type DocumentCategory = 'ID' | 'Contract' | 'Certificate'

export interface PhoneNumber {
  number: string
  label: string
}

export interface Address {
  address: string
  label: string
}

export interface Document {
  name: string
  url: string
  category: DocumentCategory
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

/**
 * Employment represents the working relationship between an Employee and a Household.
 * Contains household-specific data like employment type, salary, and holiday balance.
 */
export interface Employment {
  /** 'monthly' for regular salaried staff; 'adhoc' for irregular workers */
  employmentType: EmploymentType
  /** Current role in this household */
  role: string
  /** When employment at this household began */
  startDate: string
  /** When employment ended (only for archived employments) */
  endDate?: string
  /** Whether the employment is active or archived at this household */
  status: EmploymentStatus
  /** Remaining holiday days for this household (null for adhoc employees) */
  holidayBalance: number | null
  /** Current salary amount (null for adhoc employees) */
  currentSalary: number | null
  /** How this employee is paid */
  paymentMethod: PaymentMethod
}

/**
 * Historical employment record (role changes over time).
 */
export interface EmploymentRecord {
  role: string
  department: string
  startDate: string
  endDate: string | null
}

/**
 * Historical salary record (salary changes over time).
 */
export interface SalaryRecord {
  amount: number
  paymentMethod: PaymentMethod
  effectiveDate: string
}

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
  /** Household-specific employment details for the current household */
  employment: Employment
  /** Historical employment records (role changes over time) - used in forms */
  employmentHistory?: EmploymentRecord[]
  /** Historical salary records (salary changes over time) - used in forms */
  salaryHistory?: SalaryRecord[]
  /** Employment status - used for archive/restore (derived from employment.status) */
  status?: EmploymentStatus
  /** Holiday balance - used in detail view (derived from employment.holidayBalance) */
  holidayBalance?: number | null
}

/**
 * Existing employee from another household that can be linked.
 */
export interface ExistingEmployeeFromOtherHousehold {
  id: string
  name: string
  role: string
  householdName: string
  phoneNumber: string
}

export interface RoleBreakdown {
  [role: string]: number
}

export interface Summary {
  totalStaff: number
  activeStaff: number
  archivedStaff: number
  monthlyStaff: number
  adhocStaff: number
  roleBreakdown: RoleBreakdown
}

// =============================================================================
// Component Props
// =============================================================================

export interface StaffDirectoryProps {
  /** Summary statistics for dashboard cards */
  summary: Summary
  /** The list of employees with their employment in the current household */
  employees: Employee[]
  /** Employees from other households that can be linked to this one */
  existingEmployeesFromOtherHouseholds?: ExistingEmployeeFromOtherHousehold[]
  /** Called when user wants to view an employee's full profile */
  onView?: (id: string) => void
  /** Called when user wants to edit an employee */
  onEdit?: (id: string) => void
  /** Called when user wants to archive an employment */
  onArchive?: (id: string) => void
  /** Called when user wants to restore an archived employment */
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
  /** Called when user toggles between card grid and table view */
  onToggleView?: (view: 'grid' | 'table') => void
}

export interface EmployeeDetailProps {
  /** The employee to display */
  employee: Employee
  /** Called when user wants to edit the employee */
  onEdit?: () => void
  /** Called when user wants to archive the employment */
  onArchive?: () => void
  /** Called when user wants to go back to the list */
  onBack?: () => void
  /** Called when user uploads a new document */
  onUploadDocument?: (file: File, category: DocumentCategory) => void
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
  /** Current step in the wizard (0-4): Basic Info, Role, Documents, Salary, Custom Fields */
  currentStep: number
  /** Whether we're linking an existing employee (some steps may be skipped) */
  isLinkingExisting?: boolean
  /** Called when user moves to a different step */
  onStepChange?: (step: number) => void
  /** Called when form is submitted */
  onSubmit?: (employee: Omit<Employee, 'id'>) => void
  /** Called when user cancels the form */
  onCancel?: () => void
  /** Called when employment type changes (affects which fields are shown) */
  onEmploymentTypeChange?: (type: EmploymentType) => void
}
