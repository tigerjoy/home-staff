# Test Instructions: Employee Portal

These test-writing instructions are **framework-agnostic**. Adapt to your testing setup.

## Overview

Test the public-facing employee portal with phone login, read-only dashboard, and activity feed.

---

## User Flow Tests

### Flow 1: Employee Logs In

**Scenario:** Employee accesses their records with phone number

**Setup:**
- Employee exists with phone "+91 98765 43210"

**Steps:**
1. Employee navigates to `/portal`
2. Employee sees login screen with phone input
3. Employee enters "+91 98765 43210"
4. Employee clicks "View My Records"

**Expected Results:**
- [ ] Login screen shows phone input field
- [ ] Input accepts formatted phone numbers
- [ ] `onLogin` called with phone number
- [ ] Dashboard displays with employee data
- [ ] Shows employee name and household

### Flow 2: View Dashboard

**Scenario:** Employee views their summary metrics

**Setup:**
- Logged in employee with summary data

**Expected Results:**
- [ ] Holiday Balance card shows "X days"
- [ ] Last Payment card shows amount and date
- [ ] Outstanding Advance shown if any
- [ ] Activity feed shows recent events

### Flow 3: Failed Login

**Scenario:** Employee enters unregistered phone number

**Steps:**
1. Employee enters phone not in system
2. Employee clicks "View My Records"

**Expected Results:**
- [ ] Error message appears: "We couldn't find an employee with this phone number"
- [ ] Login form remains visible
- [ ] Employee can try again
- [ ] No sensitive info leaked

### Flow 4: Logout

**Scenario:** Employee logs out

**Steps:**
1. Employee is logged in
2. Employee clicks "Log Out"

**Expected Results:**
- [ ] Session cleared
- [ ] `onLogout` called
- [ ] Returned to login screen

---

## Empty State Tests

### No Activity

**Setup:**
- `activity = []`

**Expected Results:**
- [ ] Shows "No recent activity to show"
- [ ] Summary cards still display

### No Payments Yet

**Setup:**
- `summary.lastPaymentAmount = 0`

**Expected Results:**
- [ ] Payment section shows appropriate message
- [ ] No broken UI elements

---

## Read-Only Tests

**Expected Results:**
- [ ] No "Edit" buttons anywhere
- [ ] No form inputs except login
- [ ] No delete actions
- [ ] Data is display-only

---

## Mobile Responsiveness

**Expected Results:**
- [ ] Readable on small screens (320px width)
- [ ] Large touch targets for buttons
- [ ] Clear, high-contrast text
- [ ] No horizontal scrolling

---

## Security Tests

### Phone Number Validation

**Expected Results:**
- [ ] Invalid phone formats rejected
- [ ] Rate limiting on login attempts (backend)
- [ ] No employee enumeration (same error for invalid vs not found)

---

## Sample Test Data

```typescript
const mockStaffProfile = {
  id: "emp-001",
  name: "Lakshmi Devi",
  role: "Housekeeper",
  phoneNumber: "+91 98765 43210",
  joinDate: "2019-03-15",
  householdName: "Morgan Residence"
};

const mockSummary = {
  holidayBalance: 6,
  totalAbsencesYear: 2,
  lastPaymentAmount: 18500,
  lastPaymentDate: "2023-12-31",
  outstandingAdvance: 0
};

const mockActivity = [
  {
    id: "act-1",
    type: "absence",
    date: "2024-01-11",
    title: "Absence Recorded",
    description: "Family Emergency",
    impact: "-1 day from balance"
  },
  {
    id: "act-2",
    type: "payment",
    date: "2023-12-31",
    title: "Salary Paid",
    description: "December 2023 Payroll",
    amount: 18500
  },
  {
    id: "act-3",
    type: "entitlement",
    date: "2024-01-01",
    title: "Monthly Entitlement Added",
    description: "Monthly holiday credit",
    impact: "+4 days to balance"
  }
];
```
