# Milestone 6: Payroll & Finance

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 4 (Staff Directory) and Milestone 5 (Attendance & Holidays) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Test-writing instructions (see `product-plan/sections/payroll-and-finance/tests.md`)

**What you need to build:**
- Monthly salary calculation engine
- Advance management and repayment logic
- Settlement workspace for holiday excess/unused days
- Ad-hoc payment recording system
- Financial ledger for transaction history
- Payment receipt upload and storage integration

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your financial logic and API
- **DO** replace sample data with real data from your backend
- **DO** implement strict validation for financial transactions
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Automate the monthly payroll process and manage all household financial transactions for staff.

## Overview
A lightweight payroll system that calculates monthly salaries for **Monthly** employees while managing ad-hoc payments for others. It handles complex logic for salary advances, holiday-related bonuses or penalties, and provides a full financial ledger for auditability.

**Key Capabilities:**
- Monthly payroll dashboard with status overview
- Automated salary calculation (Base + Bonuses - Penalties)
- Settlement workspace for deciding the fate of unused or excess holidays
- Advance management (recording advances and tracking repayments)
- Ad-hoc payment records for non-salaried work
- Payment ledger with searchable transaction history
- Multi-file receipt support (images and PDFs) for all transactions

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/payroll-and-finance/tests.md`. Start by testing the base salary calculation and the advance repayment logic.

## What to Implement

### Components
Copy these from `product-plan/sections/payroll-and-finance/components/`:
- `PayrollDashboard.tsx` — Monthly overview and action hub
- `CalculationBreakdown.tsx` — Detailed math for a single employee's pay
- `SettlementWorkspace.tsx` — Interface for holiday-related financial decisions
- `PaymentLedger.tsx` — Searchable transaction history
- `ReceiptComponents.tsx` — Gallery and upload components for payment proof

### Data Layer
- **Payroll Items:** Store each line item (Base Salary, Bonus, Penalty, Advance, Encashment).
- **Transactions:** Store finalized payments with links to receipt files.
- **Advances:** Track total advance amount and remaining balance per employment.

### Callbacks
- `onProcessPayroll`: Finalize a monthly payment and update status.
- `onRecordAdvance`: Save a new salary advance.
- `onRecordAdHocPayment`: Save a one-off payment for an Ad-hoc employee.
- `onSettleHolidays`: Apply decisions (Encash, Carry Forward, Penalty) to the current payroll.
- `onUploadReceipt`: Handle file uploads for payment proof.

### Empty States
Show "No Pending Payroll" when all Monthly staff have been paid for the current period. Show "No Transactions" in the Ledger when starting fresh.

## Files to Reference
- `product-plan/sections/payroll-and-finance/spec.md` — UI requirements
- `product-plan/sections/payroll-and-finance/sample-data.json` — Sample financial records
- `product-plan/sections/payroll-and-finance/types.ts` — Prop definitions

## Expected User Flows
1. **The Monthly Payroll Flow:** User opens Dashboard → Reviews calculated salaries → Enters Settlement Workspace to decide on holiday encashments → Finalizes payment → Records are updated.
2. **The Advance Flow:** User records a "Salary Advance" for an employee → The advance amount is automatically deducted from the next month's salary calculation.
3. **The Ad-hoc Flow:** User records a payment for an Ad-hoc employee for "Car Wash" → Amount is saved to the Ledger and marked as "Paid".

## Done When
- [ ] Monthly payroll calculates correctly based on base salary and attendance
- [ ] Settlement workspace correctly handles unused and excess holidays
- [ ] Salary advances are tracked and automatically deducted
- [ ] Ad-hoc payments are recorded independently of monthly payroll
- [ ] Payment Ledger shows full history for all employment types
- [ ] Receipts can be uploaded and viewed for all transactions
- [ ] All tests in `tests.md` pass
