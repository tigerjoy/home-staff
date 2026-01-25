# Test Instructions: Payroll & Finance

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test payroll calculations, settlement decisions, advances, and payment tracking.

---

## User Flow Tests

### Flow 1: View Payroll Dashboard

**Scenario:** User views current month payroll

**Setup:**
- Provide summary and payroll records

**Steps:**
1. Navigate to `/payroll`

**Expected Results:**
- [ ] Summary cards display: Total Payroll, Outstanding Advances, Pending Settlements
- [ ] Payroll list shows each employee with: Name, Base Salary, Net Payable, Status
- [ ] Employees with pending settlements are highlighted

---

### Flow 2: View Calculation Breakdown

**Scenario:** User views detailed salary calculation

**Setup:**
- Mock `onViewCalculation` callback

**Steps:**
1. Click "View Calculation" on an employee

**Expected Results:**
- [ ] Modal opens with breakdown:
  - Base Salary
  - + Bonuses
  - + Encashments
  - - Penalties
  - - Advance Repayment
  - = Net Payable
- [ ] Each line item is explained

---

### Flow 3: Settle Excess Absence (Penalize)

**Scenario:** Employee exceeded holiday entitlement

**Setup:**
- Provide settlement item with type "excess_absence"
- Mock `onSettleAbsence` callback

**Steps:**
1. Find employee in settlement workspace
2. Click "Apply Penalty" option

**Expected Results:**
- [ ] `onSettleAbsence` is called with:
  - employeeId
  - decision: "penalize"
- [ ] Penalty amount is calculated (dailyRate × excessDays)
- [ ] Employee payroll updates to reflect penalty

---

### Flow 4: Settle Excess Absence (Carry Forward)

**Scenario:** User chooses to carry forward excess instead of penalizing

**Steps:**
1. Click "Carry Forward" option

**Expected Results:**
- [ ] `onSettleAbsence` is called with decision: "carry_forward"
- [ ] No penalty applied
- [ ] Balance will show negative next month

---

### Flow 5: Settle Unused Leave (Encash)

**Scenario:** Employee has unused leave to encash

**Setup:**
- Provide settlement item with type "unused_leave"
- Mock `onSettleUnusedLeave` callback

**Steps:**
1. Click "Encash" option

**Expected Results:**
- [ ] `onSettleUnusedLeave` is called with decision: "encash"
- [ ] Encashment amount added to salary (dailyRate × unusedDays)
- [ ] Holiday balance resets

---

### Flow 6: Record Advance

**Scenario:** User records a salary advance

**Setup:**
- Mock `onRecordAdvance` callback

**Steps:**
1. Click "Record Advance" button
2. Select employee
3. Enter amount "5000"
4. Add notes "Emergency"
5. Click "Save"

**Expected Results:**
- [ ] `onRecordAdvance` is called with employeeId, amount: 5000, notes
- [ ] Advance appears in advances list
- [ ] Outstanding Advances total updates

---

### Flow 7: Finalize Payment with Receipt

**Scenario:** User marks payment as complete

**Setup:**
- Mock `onFinalizePayment` and `onUploadReceipt` callbacks

**Steps:**
1. Click "Mark as Paid" on payroll record
2. Click "Upload Receipt"
3. Select image file
4. Click "Confirm Payment"

**Expected Results:**
- [ ] `onUploadReceipt` is called with ledgerEntryId and file
- [ ] `onFinalizePayment` is called with payroll ID
- [ ] Status changes to "Paid"
- [ ] Receipt thumbnail appears on transaction

---

### Flow 8: View Receipt Gallery

**Scenario:** User views all receipts for a transaction

**Setup:**
- Provide ledger entry with multiple receipts

**Steps:**
1. Click receipt thumbnail or "View Receipts"

**Expected Results:**
- [ ] Gallery modal opens
- [ ] All receipts are displayed (images and PDF icons)
- [ ] Can navigate between receipts
- [ ] Can delete individual receipts

---

## Empty State Tests

### No Payroll Records

**Scenario:** No payroll data for current month

**Expected Results:**
- [ ] Message: "No payroll data for this month"
- [ ] Instructions on when payroll generates

### No Advances

**Scenario:** No outstanding advances

**Expected Results:**
- [ ] Advances section shows "No outstanding advances"

### No Receipts

**Scenario:** Transaction has no receipts

**Expected Results:**
- [ ] "No receipts attached" message
- [ ] Upload button is visible

---

## Payment Ledger Tests

### Search Ledger

**Steps:**
1. Type employee name in search

**Expected Results:**
- [ ] `onSearchLedger` is called with query
- [ ] Ledger filters to matching transactions

### Ledger Columns

**Expected Results:**
- [ ] Table shows: Date, Employee, Type, Amount, Status, Reference
- [ ] Receipt indicator if receipts attached

---

## Accessibility Checks

- [ ] Modal dialogs are keyboard accessible
- [ ] Receipt gallery has keyboard navigation
- [ ] File upload has accessible label
- [ ] Currency amounts are properly formatted
