# Test Instructions: Payroll & Finance

These test-writing instructions are **framework-agnostic**. Adapt to your testing setup.

## Overview

Test payroll calculations, settlement decisions, advance tracking, and payment finalization.

---

## User Flow Tests

### Flow 1: Review Monthly Payroll

**Scenario:** User views current month's payroll status

**Steps:**
1. User navigates to `/payroll`
2. User sees dashboard with summary cards
3. User sees list of employees with calculated amounts

**Expected Results:**
- [ ] Summary shows "Total Payroll: ₹X"
- [ ] Summary shows "Outstanding Advances: ₹X"
- [ ] Summary shows "Pending Settlements: X"
- [ ] Each employee row shows net payable amount

### Flow 2: Settle Excess Absences

**Scenario:** Employee took more days off than entitled

**Setup:**
- Settlement item with type "excess_absence", days: 2

**Steps:**
1. User clicks on settlement item
2. User sees options: "Apply Penalty" or "Carry Forward"
3. User selects "Apply Penalty"
4. User confirms

**Expected Results:**
- [ ] Shows penalty calculation: "2 days × ₹600/day = ₹1,200"
- [ ] `onSettleAbsence` called with 'penalize'
- [ ] Payroll record updated with penalty amount

### Flow 3: Settle Unused Leave

**Scenario:** Employee has unused holiday balance

**Setup:**
- Settlement item with type "unused_leave", days: 5

**Steps:**
1. User clicks on settlement item
2. User sees options: "Encash", "Carry Forward", "Lapse"
3. User selects "Encash"
4. User confirms

**Expected Results:**
- [ ] Shows encashment calculation: "5 days × ₹833/day = ₹4,165"
- [ ] `onSettleUnusedLeave` called with 'encash'
- [ ] Encashment added to payroll record

### Flow 4: Finalize Payment

**Scenario:** User marks payroll as paid

**Steps:**
1. User clicks "Mark as Paid" for employee
2. Optional: User uploads receipt
3. User confirms

**Expected Results:**
- [ ] Status changes to "Paid"
- [ ] Ledger entry created
- [ ] Receipt attached if uploaded
- [ ] `onFinalizePayment` called

### Flow 5: Record Advance

**Scenario:** User records a salary advance

**Steps:**
1. User clicks "Record Advance"
2. User selects employee
3. User enters amount "5000"
4. User adds notes "Emergency home repair"
5. User confirms

**Expected Results:**
- [ ] Advance created with status "active"
- [ ] Shows in outstanding advances
- [ ] `onRecordAdvance` called with data

---

## Empty State Tests

### No Payroll Records

**Setup:**
- `currentPayroll = []`

**Expected Results:**
- [ ] Shows "No payroll records for this month"
- [ ] Dashboard still shows summary (with zeros)

### No Settlements Needed

**Setup:**
- `settlementItems = []`

**Expected Results:**
- [ ] Settlement section shows "All settlements are complete"
- [ ] No pending action indicators

### No Receipts

**Setup:**
- Ledger entry with `receipts = []`

**Expected Results:**
- [ ] "No receipts attached" shown
- [ ] Upload button visible

---

## Calculation Tests

### Net Payable Calculation

**Given:**
- Base Salary: ₹18,000
- Bonuses: ₹500
- Encashments: ₹1,000
- Penalties: ₹600
- Advance Repayment: ₹2,000

**Expected:**
- [ ] Net Payable = 18000 + 500 + 1000 - 600 - 2000 = ₹16,900

### Daily Rate Calculation

**Given:**
- Base Salary: ₹18,000

**Expected:**
- [ ] Daily Rate = 18000 / 30 = ₹600

---

## Sample Test Data

```typescript
const mockPayrollRecord = {
  id: "pay-2024-01-emp-001",
  employeeId: "emp-001",
  employeeName: "Lakshmi Devi",
  baseSalary: 18000,
  bonuses: 500,
  penalties: 0,
  encashments: 0,
  advanceRepayment: 0,
  netPayable: 18500,
  status: "pending_settlement",
  holidayImbalance: -2
};

const mockSettlementItem = {
  employeeId: "emp-001",
  name: "Lakshmi Devi",
  days: 2,
  type: "excess_absence",
  dailyRate: 600,
  potentialPenalty: 1200
};
```
