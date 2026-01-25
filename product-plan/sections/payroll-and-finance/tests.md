# Test Instructions: Payroll & Finance

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Processing Monthly Salary

**Scenario:** Employer finalizes the monthly payment for a housekeeper

**Steps:**
1. Navigate to Payroll Dashboard.
2. Select a Monthly employee with "Pending" status.
3. Review the Calculation Breakdown.
4. Click "Mark as Paid".
5. Upload a mock receipt file.
6. Verify status changes to "Paid".

**Expected Results:**
- [ ] Calculation correctly sums base salary and bonuses.
- [ ] `onFinalizePayment` is called with the total amount.
- [ ] Receipt thumbnail appears after upload.

### Flow 2: Leave Settlement

**Scenario:** User decides to pay out (encash) unused leave

**Steps:**
1. Open Settlement Workspace for an employee with a positive holiday balance.
2. Select "Encashment" option for the remaining days.
3. Verify the "Encashment Bonus" appears in the Calculation Breakdown.
4. Click "Apply Settlement".

**Expected Results:**
- [ ] The bonus amount is calculated as (Daily Rate × Unused Days).
- [ ] The employee's holiday balance for the next month resets or updates based on the decision.

---

## Component Interaction Tests

### PaymentLedgerTable
- [ ] Shows columns: Date, Description, Type, Amount, Status, Receipts.
- [ ] Filter by "Monthly" or "Ad-hoc" correctly updates the list.
- [ ] Clicking a receipt icon opens the ReceiptGallery.

### AdHocPaymentForm
- [ ] Validation prevents submission without an amount or description.
- [ ] Successfully triggers `onRecordAdHoc` on submission.

---

## Edge Cases

- **Negative Balance Penalty:** Verify that if an employee has negative holiday balance, a "Penalty" deduction is automatically calculated in the breakdown.
- **Advance Repayment:** If an advance is outstanding, verify it appears as a potential deduction in the payroll process.
- **Large Files:** Test the ReceiptGallery's behavior with multiple large image uploads.

---

## Accessibility Checks

- [ ] Interactive tables are navigable via keyboard.
- [ ] Settlement radio buttons/options have clear labels.
- [ ] Finalize button has a loading state that is announced to screen readers.

---

## Sample Test Data

```typescript
const mockPayrollRecord = {
  employmentId: "emp-001",
  baseSalary: 15000,
  bonuses: [{ label: "Festival Bonus", amount: 1000 }],
  penalties: [{ label: "Excess Absence (2 days)", amount: 1000 }],
  leaveSettlement: {
    days: 3,
    decision: "encash",
    amount: 1500
  }
};

const mockAdHocPayment = {
  id: "pay-002",
  description: "Deep cleaning services",
  amount: 2500,
  date: "2024-01-20",
  type: "adhoc"
};
```
