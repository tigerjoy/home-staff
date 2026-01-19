# Payroll & Finance

## Overview

A lightweight payroll system for calculating monthly salaries, managing advances, and settling holiday imbalances. It handles both excess absences (penalties) and unused leave (encashment/carry forward) for financial transparency.

## User Flows

- View monthly payroll dashboard with totals
- See detailed calculation breakdown per employee
- Settle excess absences (penalize or carry forward)
- Settle unused leave (encash, carry forward, or lapse)
- Record and track salary advances
- Add one-time bonuses
- Finalize payments and mark as paid
- Attach payment receipts
- View searchable payment ledger

## Components Provided

- `PayrollDashboard.tsx` — Main dashboard with summary
- `CalculationBreakdown.tsx` — Detailed salary calculation
- `SettlementWorkspace.tsx` — Interactive settlement decisions
- `PaymentLedger.tsx` — Transaction history table
- `ReceiptComponents.tsx` — Receipt upload and gallery

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSettleAbsence(employeeId, decision)` | 'penalize' or 'carry_forward' |
| `onSettleUnusedLeave(employeeId, decision)` | 'encash', 'carry_forward', or 'lapse' |
| `onFinalizePayment(id)` | Mark payroll as paid |
| `onRecordAdvance(employeeId, amount, notes)` | Create new advance |
| `onAddBonus(employeeId, amount, reason)` | Add one-time bonus |
| `onUploadReceipt(ledgerEntryId, file)` | Attach payment proof |

## Visual Reference

See screenshots in `product/sections/payroll-and-finance/` for the target UI design.
