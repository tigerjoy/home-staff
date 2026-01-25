# Test Instructions: Attendance & Holidays

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Daily Absence Marking

**Scenario:** Employer marks a monthly staff member as absent

**Steps:**
1. Load Attendance Dashboard.
2. Find a Monthly employee (e.g., "Lakshmi Devi").
3. Click the status button (defaults to "Present").
4. Select "Absence" from the options.
5. Verify the holiday balance decreases or an absence record is created.

**Expected Results:**
- [ ] UI reflects "Absence" status immediately.
- [ ] `onMarkAbsence` callback is triggered with correct data.
- [ ] If cross-household: Modal appears asking to apply to other households.

### Flow 2: Setting Holiday Rules

**Scenario:** Configuring a weekly off-day

**Steps:**
1. Open Holiday Rule Modal for an employee.
2. Select "Recurrence Rule".
3. Select "Every Sunday".
4. Enable "Auto-mark Absence".
5. Click "Save Rules".

**Expected Results:**
- [ ] Modal correctly handles switching between "Fixed" and "Recurrence".
- [ ] Data sent to `onUpdateHolidayRule` includes the recurrence pattern.

---

## Component Interaction Tests

### AttendanceDashboard
- [ ] Correctly filters out Ad-hoc employees (list should only show Monthly).
- [ ] Displays the running `holidayBalance` for each row.
- [ ] Shows "Inactive" badge for employees currently in an inactivity period.

### InactivityModal
- [ ] Date picker allows selecting past dates (back-dating).
- [ ] Validation prevents end date from being before start date.

---

## Edge Cases

- **Carry Forward:** Verify that when a month changes, the holiday balance persists from the previous state.
- **Zero Balance:** Test marking an absence when the employee has 0 holiday balance (should result in a negative balance or flag for penalty).
- **Multiple Households:** Verify the prompt only appears for employees known to work in other households for the current user.

---

## Accessibility Checks

- [ ] Status toggles are focusable and operable via keyboard.
- [ ] Calendar grid uses proper table semantics or ARIA grids.
- [ ] Color-coded statuses have text equivalents (e.g., "Absence (Red)").

---

## Sample Test Data

```typescript
const mockMonthlyEmployment = {
  id: "emp-001",
  name: "Lakshmi Devi",
  type: "monthly",
  holidayBalance: 5.5,
  status: "active",
  households: ["Household A", "Household B"] // Works in 2 households
};

const mockAdHocEmployment = {
  id: "emp-002",
  name: "Raju Sharma",
  type: "adhoc",
  status: "active"
};
```
