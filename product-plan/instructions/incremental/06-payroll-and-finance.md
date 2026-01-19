# Milestone 6: Payroll & Finance

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1, 4, and 5 complete (Foundation, Staff Directory, Attendance)

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement Payroll & Finance — a lightweight payroll system for calculating salaries, managing advances, and settling holiday imbalances.

## Overview

A lightweight payroll system for calculating monthly salaries, managing advances, and settling holiday imbalances. It handles the logic for both excess absences (penalties) and unused leave entitlements (carry forward, encashment, or lapse). Payment receipts can be attached to transactions as proof of payment.

**Key Functionality:**
- View monthly payroll summary
- Review calculated salary for each employee
- Settle excess absences (penalize or carry forward)
- Settle unused leave (encash, carry forward, or lapse)
- Record salary advances
- Add bonuses
- View payment history ledger
- Attach payment receipts (images or PDFs)
- Mark payments as finalized

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/payroll-and-finance/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/payroll-and-finance/components/`:

- `PayrollDashboard.tsx` — Main payroll view with summary
- `CalculationBreakdown.tsx` — Detailed salary breakdown
- `SettlementWorkspace.tsx` — Interactive settlement decisions
- `PaymentLedger.tsx` — Transaction history table
- `ReceiptComponents.tsx` — Receipt upload, preview, and gallery

### Data Layer

The components expect these data shapes:

```typescript
interface PayrollAndFinanceProps {
  summary: PayrollSummary
  currentPayroll: PayrollRecord[]
  advances: Advance[]
  ledger: LedgerEntry[]
  settlementItems: SettlementItem[]
  onSettleAbsence?: (employeeId: string, decision: 'penalize' | 'carry_forward') => void
  onSettleUnusedLeave?: (employeeId: string, decision: 'encash' | 'carry_forward' | 'lapse') => void
  onFinalizePayment?: (id: string) => void
  onRecordAdvance?: (employeeId: string, amount: number, notes?: string) => void
  onAddBonus?: (employeeId: string, amount: number, reason: string) => void
  onViewCalculation?: (id: string) => void
  onSearchLedger?: (query: string) => void
  onUploadReceipt?: (ledgerEntryId: string, file: File) => void
  onDeleteReceipt?: (ledgerEntryId: string, receiptId: string) => void
  onViewReceipts?: (ledgerEntryId: string) => void
}

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
```

You'll need to:
- Calculate payroll based on salary and attendance
- Handle settlement decisions
- Track advances and repayments
- Store payment receipts
- Generate payment ledger

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onSettleAbsence` | Decide penalty or carry forward for excess absences |
| `onSettleUnusedLeave` | Decide encashment, carry forward, or lapse |
| `onFinalizePayment` | Mark payroll as paid |
| `onRecordAdvance` | Create new advance record |
| `onAddBonus` | Add one-time bonus |
| `onViewCalculation` | Show detailed salary breakdown |
| `onSearchLedger` | Search payment history |
| `onUploadReceipt` | Attach receipt to transaction |
| `onDeleteReceipt` | Remove receipt from transaction |
| `onViewReceipts` | Open receipt gallery modal |

### Empty States

Implement empty state UI for when no records exist:

- **No payroll records:** Show "No payroll data for this month"
- **No advances:** Show "No outstanding advances"
- **No ledger entries:** Show "No transactions recorded yet"
- **No receipts:** Show "No receipts attached" with upload button

## Files to Reference

- `product-plan/sections/payroll-and-finance/README.md` — Feature overview and design intent
- `product-plan/sections/payroll-and-finance/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/payroll-and-finance/components/` — React components
- `product-plan/sections/payroll-and-finance/types.ts` — TypeScript interfaces
- `product-plan/sections/payroll-and-finance/sample-data.json` — Test data
- `product-plan/sections/payroll-and-finance/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Process Monthly Payroll

1. User views payroll dashboard
2. User sees calculated payroll for each employee
3. User clicks "View Calculation" to see breakdown
4. User sees base salary, bonuses, penalties, net payable
5. **Outcome:** User understands the calculation

### Flow 2: Settle Excess Absences

1. User sees employee with negative holiday imbalance
2. User clicks "Settle" button
3. Modal shows options: "Apply Penalty" or "Carry Forward"
4. User selects "Apply Penalty"
5. **Outcome:** Penalty calculated and deducted from salary

### Flow 3: Settle Unused Leave

1. User sees employee with positive holiday balance
2. User clicks "Settle" button
3. Modal shows options: "Encash", "Carry Forward", or "Lapse"
4. User selects "Encash"
5. **Outcome:** Encashment amount added to salary

### Flow 4: Record Advance

1. User clicks "Record Advance" button
2. User selects employee, enters amount and notes
3. User confirms
4. **Outcome:** Advance recorded, appears in advances list

### Flow 5: Finalize Payment with Receipt

1. User clicks "Mark as Paid" on payroll record
2. User optionally uploads receipt image
3. User confirms payment
4. **Outcome:** Payment finalized, ledger entry created, receipt attached

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Payroll dashboard shows summary
- [ ] Payroll calculations are correct
- [ ] Calculation breakdown modal works
- [ ] Settlement workspace shows pending items
- [ ] Excess absence settlement works (penalize/carry forward)
- [ ] Unused leave settlement works (encash/carry forward/lapse)
- [ ] Advance recording works
- [ ] Bonus addition works
- [ ] Payment finalization works
- [ ] Payment ledger displays history
- [ ] Ledger search works
- [ ] Receipt upload works (images and PDFs)
- [ ] Receipt gallery modal works
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Dark mode support
