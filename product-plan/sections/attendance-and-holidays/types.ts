// =============================================================================
// Data Types
// =============================================================================

export type EmploymentType = 'monthly' | 'adhoc'
export type EmploymentStatus = 'active' | 'inactive'
export type HolidayRuleType = 'fixed' | 'recurring'

/**
 * Reference to another household where the employee also works.
 * Used for cross-household absence/inactivity prompts.
 */
export interface OtherHousehold {
  id: string
  name: string
}

/**
 * A Monthly employment in the current household for attendance tracking.
 * Ad-hoc employees are not included in attendance tracking.
 */
export interface AttendanceEmployment {
  id: string
  employeeId: string
  name: string
  role: string
  avatar: string | null
  employmentType: 'monthly'
  status: EmploymentStatus
  startDate: string
  /** Running holiday balance for this household */
  holidayBalance: number
  /** Other households where this employee has Monthly employment */
  otherHouseholds: OtherHousehold[]
}

/**
 * Alias for AttendanceEmployment used in modal components.
 * Represents an employee with their employment information.
 */
export type Employee = AttendanceEmployment

/**
 * Record of a specific date when an employee was absent.
 * The system is "present by default" — if no absence record exists, employee was present.
 */
export interface AbsenceRecord {
  id: string
  employmentId: string
  date: string
  reason?: string
  /** Whether this absence was also applied to other households */
  appliedToOtherHouseholds: boolean
}

/**
 * A period of extended inactivity (e.g., gone home for months).
 * No attendance tracking occurs during inactivity periods.
 */
export interface InactivityPeriod {
  id: string
  employmentId: string
  startDate: string
  endDate?: string
  reason?: string
  /** Whether this inactivity was also applied to other households */
  appliedToOtherHouseholds: boolean
}

/**
 * Holiday entitlement rules for an employment.
 * Can be fixed (X days per month) or recurring (specific weekdays off).
 */
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
}

/**
 * A public holiday that applies to all employments in the household.
 */
export interface PublicHoliday {
  id: string
  date: string
  name: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface AttendanceAndHolidaysProps {
  /** List of Monthly employments to track attendance for */
  employments: AttendanceEmployment[]
  /** Absence records (exceptions to the "present by default" rule) */
  absenceRecords: AbsenceRecord[]
  /** Extended inactivity periods */
  inactivityPeriods: InactivityPeriod[]
  /** Holiday entitlement rules per employment */
  holidayRules: HolidayRule[]
  /** Public holidays for the household */
  publicHolidays: PublicHoliday[]
  /** Currently selected date for the daily view */
  selectedDate?: string

  /** Called when user marks an employee as absent for a specific date */
  onAddAbsence?: (
    employmentId: string,
    date: string,
    reason?: string,
    applyToOtherHouseholds?: boolean
  ) => void
  /** Called when user removes an absence record (marking as present) */
  onRemoveAbsence?: (absenceId: string) => void
  /** Called when user updates an existing absence record */
  onUpdateAbsence?: (absenceId: string, updates: Partial<AbsenceRecord>) => void

  /** Called when user marks an employment as inactive */
  onMarkInactive?: (
    employmentId: string,
    startDate: string,
    reason?: string,
    applyToOtherHouseholds?: boolean
  ) => void
  /** Called when user marks an inactive employment as active again */
  onMarkActive?: (employmentId: string, endDate: string) => void

  /** Called when user adds a public holiday */
  onAddPublicHoliday?: (date: string, name: string) => void
  /** Called when user removes a public holiday */
  onRemovePublicHoliday?: (holidayId: string) => void

  /** Called when user saves holiday rules for an employment */
  onSaveHolidayRules?: (employmentId: string, rule: Omit<HolidayRule, 'id' | 'employmentId'>) => void

  /** Called when user navigates to a different date */
  onDateChange?: (date: string) => void
  /** Called when user wants to view an employment's attendance history */
  onViewHistory?: (employmentId: string) => void
}
