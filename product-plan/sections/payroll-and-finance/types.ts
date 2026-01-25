// =============================================================================
// Data Types
// =============================================================================

export type EmploymentType = 'monthly' | 'adhoc'
export type PayrollStatus = 'draft' | 'calculated' | 'pending_settlement' | 'paid'
export type AdvanceStatus = 'active' | 'repaid' | 'cancelled'
export type LedgerEntryType = 'Salary' | 'Advance' | 'Bonus' | 'Penalty' | 'Encashment' | 'AdhocPayment'
export type LedgerStatus = 'Paid' | 'Disbursed' | 'Pending'
export type SettlementType = 'excess_absence' | 'unused_leave'
export type AbsenceDecision = 'penalize' | 'carry_forward'
export type UnusedLeaveDecision = 'encash' | 'carry_forward' | 'lapse'

export interface PaymentReceipt {
  id: string
  url: string
  fileName: string
  fileType: 'image' | 'pdf'
  uploadedAt: string
}

/**
 * Monthly payroll record for a Monthly employee.
 */
export interface MonthlyPayrollRecord {
  id: string
  employmentId: string
  employeeName: string
  employmentType: 'monthly'
  baseSalary: number
  bonuses: number
  penalties: number
  encashments: number
  advanceRepayment: number
  netPayable: number
  status: PayrollStatus
  /** Positive = unused leave, Negative = excess absences */
  holidayImbalance: number
}

/**
 * One-off payment record for an Ad-hoc employee.
 * No salary calculation — just work description and amount.
 */
export interface AdhocPayment {
  id: string
  employmentId: string
  employeeName: string
  employmentType: 'adhoc'
  /** Description of work done */
  description: string
  amount: number
  date: string
  status: 'pending' | 'paid'
  receipts?: PaymentReceipt[]
}

/**
 * Salary advance given to a Monthly employee.
 */
export interface Advance {
  id: string
  employmentId: string
  employeeName: string
  amount: number
  date: string
  repaidAmount: number
  /** Amount deducted from salary each month */
  monthlyDeduction: number
  reason?: string
  status: AdvanceStatus
}

/**
 * Historical transaction record in the ledger.
 */
export interface LedgerEntry {
  id: string
  employmentId: string
  employeeName: string
  employmentType: EmploymentType
  date: string
  type: LedgerEntryType
  amount: number
  status: LedgerStatus
  reference: string
  receipts?: PaymentReceipt[]
}

/**
 * Item requiring user decision on holiday imbalance.
 */
export interface SettlementItem {
  employmentId: string
  name: string
  days: number
  type: SettlementType
  dailyRate: number
  potentialPenalty?: number
  potentialEncashment?: number
  options: (AbsenceDecision | UnusedLeaveDecision)[]
}

export interface PayrollSummary {
  totalMonthlyPayroll: number
  totalAdhocPayments: number
  outstandingAdvances: number
  pendingSettlements: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface PayrollAndFinanceProps {
  /** Summary of current financial state */
  summary: PayrollSummary
  /** Current month's payroll records for Monthly employees */
  monthlyPayroll: MonthlyPayrollRecord[]
  /** Payment records for Ad-hoc employees */
  adhocPayments: AdhocPayment[]
  /** Outstanding advances for Monthly employees */
  advances: Advance[]
  /** Historical transaction log */
  ledger: LedgerEntry[]
  /** Items requiring interactive settlement decisions */
  settlementItems: SettlementItem[]

  // Monthly payroll actions
  /** Called when user settles an excess absence (penalize or carry forward) */
  onSettleAbsence?: (employmentId: string, decision: AbsenceDecision) => void
  /** Called when user settles unused leave (encash, carry forward, or lapse) */
  onSettleUnusedLeave?: (employmentId: string, decision: UnusedLeaveDecision) => void
  /** Called to finalize and mark a payroll record as paid */
  onFinalizePayment?: (id: string) => void
  /** Called to record a new advance for a Monthly employee */
  onRecordAdvance?: (employmentId: string, amount: number, monthlyDeduction: number, reason?: string) => void
  /** Called to add a one-time bonus for a Monthly employee */
  onAddBonus?: (employmentId: string, amount: number, reason: string) => void
  /** Called to view the detailed calculation for an employee */
  onViewCalculation?: (id: string) => void

  // Ad-hoc payment actions
  /** Called to record a new payment for an Ad-hoc employee */
  onRecordAdhocPayment?: (employmentId: string, description: string, amount: number, date: string) => void
  /** Called to mark an Ad-hoc payment as paid */
  onMarkAdhocPaid?: (paymentId: string) => void

  // Common actions
  /** Called to search the transaction ledger */
  onSearchLedger?: (query: string) => void
  /** Called to filter ledger by employment type */
  onFilterLedgerByType?: (type: EmploymentType | 'all') => void
  /** Called to upload a payment receipt */
  onUploadReceipt?: (entryId: string, file: File) => void
  /** Called to delete a payment receipt */
  onDeleteReceipt?: (entryId: string, receiptId: string) => void
  /** Called to view all receipts for a transaction */
  onViewReceipts?: (entryId: string) => void
}
