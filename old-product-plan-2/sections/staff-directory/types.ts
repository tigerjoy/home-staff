// =============================================================================
// Data Types
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
  /** Remaining holiday/leave days for the current period */
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
