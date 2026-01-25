# Payroll & Finance

## Overview

A lightweight payroll system for calculating monthly salaries, managing advances, and settling holiday imbalances. Payroll is tracked per Employment—each household maintains independent salary and payment history for the same employee. It handles the logic for both excess absences (penalties) and unused leave entitlements (carry forward, encashment, or lapse) to ensure financial transparency between employers and household staff.

## Key Functionality

- **Monthly Payroll Processing:** Automated calculation of salary for Monthly employees based on base pay, bonuses, and attendance-driven penalties.
- **Interactive Settlement:** Workspace to decide how to handle excess absences (Penalty vs. Carry Forward) and unused leave (Carry Forward vs. Encashment vs. Lapse).
- **Advance Management:** Record salary advances and track their repayment status per household.
- **Ad-hoc Payments:** Simple ledger for recording one-off payments for Ad-hoc staff (e.g., occasional help).
- **Payment Ledger:** Searchable, chronological history of all financial transactions (Salary, Advances, Bonuses, Penalties).
- **Receipt Management:** Upload and view proof of payment (screenshots or PDFs) for any transaction.
- **Finalize Payment:** "Mark as Paid" action to settle records and update the employee's financial history.

## User Flows

### Processing Monthly Payroll
1. User enters the **Payroll Dashboard**.
2. User selects the current month for a Monthly employee.
3. System shows the **Calculation Breakdown** (Base + Bonuses - Penalties).
4. User enters the **Settlement Workspace** to decide on unused leave (e.g., "Encash as Bonus").
5. User clicks "Finalize Payment".
6. User optionally uploads a payment receipt.

### Managing Advances
1. User clicks "Record Advance" for a Monthly employee.
2. User enters the amount and date.
3. The advance is added to the ledger and automatically tracked for future salary deductions if configured.

### Recording Ad-hoc Work
1. User goes to the **Ad-hoc Payments** tab.
2. User clicks "Record Payment".
3. User enters the description (e.g., "Garden cleanup"), amount, and date.
4. Payment is added to the ledger.

## Design Decisions

- **Split Workflows:** Monthly employees have a structured "Processing" flow, while Ad-hoc employees have a simple "Ledger" flow.
- **Independent Context:** Financial data is strictly per-household; an employee's salary in one household does not affect another.
- **Transparency:** Every deduction or bonus (encashment/penalty) is explicitly listed in the breakdown.

## Components Provided

| Component | Description |
|-----------|-------------|
| `PayrollDashboard` | Summary of monthly payroll status and pending actions |
| `CalculationBreakdown` | Itemized view of earnings and deductions |
| `SettlementWorkspace` | Interface for leave settlement decisions |
| `PaymentLedgerTable` | Searchable history of all transactions |
| `AdHocPaymentForm` | Form for recording one-off payments |
| `ReceiptGallery` | Modal for viewing and managing uploaded receipts |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onFinalizePayment` | Called when a payroll record is marked as paid |
| `onRecordAdvance` | Called when a new advance is created |
| `onAddBonus` | Called when a manual bonus is added |
| `onRecordAdHoc` | Called when an ad-hoc payment is recorded |
| `onUploadReceipt` | Called when a file is attached to a transaction |
| `onSettleLeave` | Called when a settlement decision is made |

## Empty States

- **No Transactions:** Shows "No payment history yet" with a primary action to record the first payment.
- **No Pending Payroll:** Shows "All caught up for this month" when all Monthly staff are paid.

## Visual Reference

See `PayrollDashboardPreview.png` and `SettlementWorkspacePreview.png` for the target UI design.
