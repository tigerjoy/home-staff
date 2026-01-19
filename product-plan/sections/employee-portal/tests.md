# Test Instructions: Employee Portal

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test the public-facing employee portal including phone number login and read-only dashboard.

---

## User Flow Tests

### Flow 1: Login with Valid Phone Number

**Scenario:** Employee enters registered phone number

**Setup:**
- Mock `onLogin` callback to succeed
- Provide staff profile and summary data

**Steps:**
1. Navigate to `/portal`
2. Enter phone number "+91 98765 43210"
3. Click "View My Records"

**Expected Results:**
- [ ] `onLogin` called with phone number
- [ ] Loading state shows during authentication
- [ ] Dashboard appears with staff profile
- [ ] Summary cards show: Holiday Balance, Last Payment, Outstanding Advance

---

### Flow 2: Login with Invalid Phone Number

**Scenario:** Employee enters unregistered phone number

**Setup:**
- Set `loginError` prop to "No employee found with this phone number"

**Steps:**
1. Enter unregistered phone number
2. Click "View My Records"

**Expected Results:**
- [ ] Error message displays: "No employee found with this phone number"
- [ ] User remains on login screen
- [ ] Can try again with different number

---

### Flow 3: View Dashboard

**Scenario:** Logged-in employee views their dashboard

**Setup:**
- Provide complete staff profile, summary, and activity

**Steps:**
1. After successful login, view dashboard

**Expected Results:**
- [ ] Profile shows: Name, Role, Join Date, Household Name
- [ ] Summary cards display:
  - Holiday Balance (e.g., "6 days remaining")
  - Last Payment (e.g., "₹18,500 on Dec 31")
  - Outstanding Advance (e.g., "₹0")
- [ ] Activity feed shows recent events
- [ ] No edit buttons or forms visible

---

### Flow 4: View Activity Feed

**Scenario:** Employee views their activity history

**Expected Results:**
- [ ] Activity items show in chronological order (newest first)
- [ ] Each item shows: Date, Title, Description
- [ ] Absence items show impact (e.g., "-1 day from balance")
- [ ] Payment items show amount
- [ ] Icons/colors differentiate activity types

---

### Flow 5: Logout

**Scenario:** Employee logs out of portal

**Setup:**
- Mock `onLogout` callback

**Steps:**
1. Click "Logout" or "Exit" button

**Expected Results:**
- [ ] `onLogout` is called
- [ ] Returns to phone number login screen
- [ ] Previous session data is cleared

---

## Empty State Tests

### Phone Not Found

**Scenario:** Phone number lookup fails

**Expected Results:**
- [ ] Error message: "No employee found with this phone number"
- [ ] Phone input remains editable
- [ ] User can retry

### No Activity

**Scenario:** Employee has no recent activity

**Setup:**
- Provide empty activity array `[]`

**Expected Results:**
- [ ] Message: "No recent activity to display"
- [ ] Summary cards still show balances

---

## Component Tests

### Login Screen

**Renders correctly:**
- [ ] HomeStaff logo/branding visible
- [ ] "Employee Portal" heading
- [ ] Phone number input field
- [ ] "View My Records" button

**Validation:**
- [ ] Phone number format is validated
- [ ] Cannot submit empty phone number

---

### Summary Cards

**Expected Results:**
- [ ] Holiday Balance card shows days remaining
- [ ] Last Payment card shows amount and date
- [ ] If outstanding advance exists, shows amount

---

### Activity Item Types

| Type | Visual |
|------|--------|
| `absence` | Red indicator, shows impact |
| `payment` | Green indicator, shows amount |
| `entitlement` | Blue indicator, shows credit |
| `advance` | Orange indicator, shows amount |

---

## Read-Only Verification

**Expected Results:**
- [ ] No "Edit" buttons anywhere
- [ ] No form inputs (except login)
- [ ] No "Delete" or "Remove" actions
- [ ] All data is display-only

---

## Mobile Responsiveness

**Expected Results:**
- [ ] Login screen works on small phones
- [ ] Dashboard is scrollable
- [ ] Text is readable without zooming
- [ ] Touch targets are large enough
- [ ] Summary cards stack vertically on mobile

---

## Security Tests

### Rate Limiting (Implementation Note)

- [ ] Backend should rate-limit phone number lookups
- [ ] Prevent brute-force phone number guessing

### Data Scoping

- [ ] Only shows data for the authenticated employee
- [ ] Cannot access other employees' data

---

## Accessibility Checks

- [ ] Phone input has proper label
- [ ] Error messages are announced
- [ ] Activity items are readable by screen readers
- [ ] Color is not the only indicator (use icons too)
