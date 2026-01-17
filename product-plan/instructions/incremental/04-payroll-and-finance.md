# Milestone 4: Payroll & Finance

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-3 complete

## Goal

Implement the Payroll & Finance feature — calculate monthly salaries, manage advances, handle holiday imbalance settlements, and maintain a payment ledger.

## Overview

The Payroll system provides a lightweight but comprehensive approach to household staff compensation. It calculates net payable amounts considering base salary, bonuses, penalties for excess absences, and advance repayments. The settlement workspace allows interactive decisions on how to handle holiday imbalances.

**Key Functionality:**
- View monthly payroll dashboard with totals and pending actions
- See detailed calculation breakdown per employee
- Settle excess absences (penalize or carry forward)
- Settle unused leave (encash, carry forward, or lapse)
- Record and track salary advances
- Add one-time bonuses
- Finalize payments and mark as paid
- Attach payment receipts (screenshots/PDFs)
- View searchable payment ledger history

## Recommended Approach: Test-Driven Development

See `product-plan/sections/payroll-and-finance/tests.md` for test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/payroll-and-finance/components/`:

- `PayrollDashboard.tsx` — Main dashboard with summary and list
- `CalculationBreakdown.tsx` — Detailed salary calculation view
- `SettlementWorkspace.tsx` — Interactive settlement decisions
- `PaymentLedger.tsx` — Transaction history table
- `ReceiptComponents.tsx` — Receipt upload and gallery

### Data Layer

Key types from `types.ts`:

```typescript
interface PayrollRecord {
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

interface SettlementItem {
  employeeId: string
  name: string
  days: number
  type: 'excess_absence' | 'unused_leave'
  dailyRate: number
  potentialPenalty?: number
  potentialEncashment?: number
}

interface LedgerEntry {
  id: string
  employeeId: string
  date: string
  type: 'Salary' | 'Advance' | 'Bonus' | 'Penalty' | 'Encashment'
  amount: number
  status: 'Paid' | 'Disbursed' | 'Pending'
  reference: string
  receipts?: PaymentReceipt[]
}
```

### Callbacks

| Callback | Description |
|----------|-------------|
| `onSettleAbsence(employeeId, decision)` | Handle excess absences: 'penalize' or 'carry_forward' |
| `onSettleUnusedLeave(employeeId, decision)` | Handle unused days: 'encash', 'carry_forward', or 'lapse' |
| `onFinalizePayment(id)` | Mark payroll as paid |
| `onRecordAdvance(employeeId, amount, notes)` | Create new advance |
| `onAddBonus(employeeId, amount, reason)` | Add one-time bonus |
| `onViewCalculation(id)` | Show calculation breakdown |
| `onSearchLedger(query)` | Filter ledger entries |
| `onUploadReceipt(ledgerEntryId, file)` | Attach payment proof |
| `onDeleteReceipt(ledgerEntryId, receiptId)` | Remove receipt |
| `onViewReceipts(ledgerEntryId)` | Open receipt gallery |

### Business Logic

**Salary Calculation:**
```
Net Payable = Base Salary + Bonuses + Encashments - Penalties - Advance Repayment
```

**Daily Rate:**
```
Daily Rate = Base Salary / 30
```

**Penalty Calculation:**
```
Penalty = Days Over Entitlement × Daily Rate
```

**Encashment Calculation:**
```
Encashment = Unused Days × Daily Rate
```

**Settlement Options:**
- **Excess Absences:** Penalize (deduct from salary) or Carry Forward (debt to next month)
- **Unused Leave:** Encash (pay out), Carry Forward (save for later), or Lapse (expire)

### Empty States

- **No payroll records:** "No payroll records for this month"
- **No settlements needed:** "All settlements are complete"
- **No ledger entries:** "No transactions recorded yet"
- **No receipts:** "No receipts attached"

## Files to Reference

- `product-plan/sections/payroll-and-finance/README.md`
- `product-plan/sections/payroll-and-finance/tests.md`
- `product-plan/sections/payroll-and-finance/components/`
- `product-plan/sections/payroll-and-finance/types.ts`
- `product-plan/sections/payroll-and-finance/sample-data.json`

## Expected User Flows

### Flow 1: Review Monthly Payroll

1. User navigates to `/payroll`
2. User sees dashboard with total payroll, outstanding advances, pending settlements
3. User sees list of employees with calculated amounts
4. **Outcome:** Monthly payroll status is visible

### Flow 2: Settle Holiday Imbalance

1. User sees employees with pending settlements
2. User clicks on employee with excess absences
3. User chooses "Apply Penalty" or "Carry Forward"
4. User confirms decision
5. **Outcome:** Settlement recorded, payroll updated

### Flow 3: Finalize Payment

1. User reviews calculated amount for employee
2. User clicks "Mark as Paid"
3. User optionally uploads receipt screenshot
4. **Outcome:** Ledger entry created, status updated to "Paid"

### Flow 4: Record Advance

1. User clicks "Record Advance"
2. User selects employee and enters amount
3. User adds optional notes
4. **Outcome:** Advance recorded, shows in outstanding advances

## Done When

- [ ] Tests written and passing
- [ ] Payroll dashboard shows summary
- [ ] Calculation breakdown is accurate
- [ ] Settlement workspace allows interactive decisions
- [ ] Advance recording works
- [ ] Bonus adding works
- [ ] Payment finalization works
- [ ] Receipt upload and preview works
- [ ] Ledger shows full history with search
- [ ] Empty states display properly
- [ ] Responsive on mobile
