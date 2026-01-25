# Test Instructions: Employee Portal

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Phone Login and Dashboard Access

**Scenario:** Staff member logs in to view their records

**Steps:**
1. Load Employee Portal landing page.
2. Enter registered phone number "+91 98765 43210".
3. Click "View My Records".
4. Verify the Staff Dashboard loads.

**Expected Results:**
- [ ] `onLogin` callback is triggered with the phone number.
- [ ] If the user has one household, it skips the picker and goes straight to the dashboard.
- [ ] If the user has multiple households, the HouseholdPicker is displayed.

### Flow 2: Switching Between Households

**Scenario:** Staff member works for two families and switches views

**Steps:**
1. Login and arrive at Household Picker.
2. Click on "Family A (Monthly)".
3. Verify "Holiday Balance" is visible.
4. Click the Household Switcher in the header.
5. Select "Family B (Ad-hoc)".
6. Verify "Holiday Balance" section disappears and only payments are shown.

**Expected Results:**
- [ ] UI correctly adapts based on the `employmentType` of the selected household.
- [ ] `onSwitchHousehold` is triggered with the new household ID.

---

## Component Interaction Tests

### StaffDashboard (Context Awareness)
- [ ] **Monthly View:** Displays "Holiday Balance", "Attendance", and "Payments".
- [ ] **Ad-hoc View:** Displays ONLY "Payments" and "Profile Info". Attendance sections must be hidden.

### ActivityFeed
- [ ] Displays attendance events (Absence, Holiday) for Monthly employees.
- [ ] Displays payment events (Salary, Bonus, Ad-hoc) for both types.
- [ ] Shows "No activity found" if the list is empty.

---

## Edge Cases

- **Unregistered Number:** Verify that entering a number not in the system shows a helpful "Number not found" message.
- **Inactive Employment:** Verify that archived or inactive employments are either hidden or clearly marked in the portal.
- **No Internet:** Verify that the mobile-first UI handles offline/loading states gracefully.

---

## Accessibility Checks

- [ ] Phone input uses `type="tel"` for optimized mobile keyboards.
- [ ] Large, accessible tap targets (minimum 44x44px) for all buttons.
- [ ] High color contrast for readability on various screen types.

---

## Sample Test Data

```typescript
const mockEmployeeData = {
  name: "Lakshmi Devi",
  phone: "+91 98765 43210",
  employments: [
    {
      id: "hh-001",
      householdName: "The Kapoors",
      type: "monthly",
      holidayBalance: 4,
      lastPayment: { amount: 15000, date: "2024-01-01" }
    },
    {
      id: "hh-002",
      householdName: "Sharma Residency",
      type: "adhoc",
      lastPayment: { amount: 500, date: "2024-01-05" }
    }
  ]
};
```
