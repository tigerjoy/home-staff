// =============================================================================
// Data Types
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
  employeeName: string
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
  /** Optional payment receipts (screenshots or PDFs) attached to this transaction */
  receipts?: PaymentReceipt[]
}

export interface SettlementItem {
  employeeId: string
  name: string
  days: number
  type: 'excess_absence' | 'unused_leave'
  dailyRate: number
  potentialPenalty?: number
  potentialEncashment?: number
}

export interface PayrollSummary {
  totalPayroll: number
  outstandingAdvances: number
  pendingSettlements: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface PayrollAndFinanceProps {
  /** Summary of current financial state */
  summary: PayrollSummary
  /** Current month's payroll records being processed */
  currentPayroll: PayrollRecord[]
  /** Outstanding advances */
  advances: Advance[]
  /** Historical transaction log */
  ledger: LedgerEntry[]
  /** Items requiring interactive settlement decisions */
  settlementItems: SettlementItem[]

  /** Called when user settles an excess absence (penalize or carry forward) */
  onSettleAbsence?: (employeeId: string, decision: 'penalize' | 'carry_forward') => void
  /** Called when user settles unused leave (encash, carry forward, or lapse) */
  onSettleUnusedLeave?: (employeeId: string, decision: 'encash' | 'carry_forward' | 'lapse') => void
  /** Called to finalize and mark a payroll record as paid */
  onFinalizePayment?: (id: string) => void
  /** Called to record a new advance */
  onRecordAdvance?: (employeeId: string, amount: number, notes?: string) => void
  /** Called to add a one-time bonus */
  onAddBonus?: (employeeId: string, amount: number, reason: string) => void
  /** Called to view the detailed calculation for an employee */
  onViewCalculation?: (id: string) => void
  /** Called to search the transaction ledger */
  onSearchLedger?: (query: string) => void
  /** Called to upload a payment receipt to a ledger entry */
  onUploadReceipt?: (ledgerEntryId: string, file: File) => void
  /** Called to delete a payment receipt from a ledger entry */
  onDeleteReceipt?: (ledgerEntryId: string, receiptId: string) => void
  /** Called to view all receipts for a ledger entry */
  onViewReceipts?: (ledgerEntryId: string) => void
}
