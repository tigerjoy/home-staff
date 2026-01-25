# Payroll & Finance

## Overview

A lightweight payroll system for calculating monthly salaries, managing advances, and settling holiday imbalances. Handles both excess absences (penalties) and unused leave (encashment, carry forward, or lapse). Payment receipts can be attached to transactions.

## User Flows

- View monthly payroll summary
- Review calculated salary for each employee
- Settle excess absences (penalize or carry forward)
- Settle unused leave (encash, carry forward, or lapse)
- Record salary advances
- Add bonuses
- View payment history ledger
- Attach payment receipts
- Mark payments as finalized

## Components Provided

| Component | Description |
|-----------|-------------|
| `PayrollDashboard` | Main view with summary and payroll list |
| `CalculationBreakdown` | Detailed salary breakdown modal |
| `SettlementWorkspace` | Interactive settlement decisions |
| `PaymentLedger` | Transaction history table |
| `ReceiptUploadButton` | Upload receipt button |
| `ReceiptPreview` | Thumbnail preview of receipts |
| `ReceiptGallery` | Gallery modal for all receipts |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSettleAbsence` | Decide penalty or carry forward |
| `onSettleUnusedLeave` | Decide encash, carry forward, or lapse |
| `onFinalizePayment` | Mark payroll as paid |
| `onRecordAdvance` | Create new advance |
| `onAddBonus` | Add one-time bonus |
| `onViewCalculation` | Show salary breakdown |
| `onSearchLedger` | Search payment history |
| `onUploadReceipt` | Attach receipt to transaction |
| `onDeleteReceipt` | Remove receipt |
| `onViewReceipts` | Open receipt gallery |

## Design Notes

- Summary cards show total payroll, outstanding advances, pending settlements
- Color coding for payroll status (Draft, Calculated, Pending, Paid)
- Settlement workspace shows both excess absences and unused leave
- Receipt thumbnails with click-to-expand gallery
