# Test Instructions: Attendance & Holidays

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test the "present by default" attendance system including marking absences, holiday rules, and inactivity periods.

---

## User Flow Tests

### Flow 1: View Daily Attendance

**Scenario:** User views today's attendance

**Setup:**
- Provide list of employees with no absences for today

**Steps:**
1. Navigate to `/attendance`

**Expected Results:**
- [ ] All employees are displayed
- [ ] All employees show as "Present" (default status)
- [ ] Holiday balance is visible for each employee
- [ ] Date selector shows current date

---

### Flow 2: Mark Employee Absent

**Scenario:** User marks an employee as absent

**Setup:**
- Mock `onAddLeaveRecord` callback

**Steps:**
1. Click on an employee to mark absence
2. Select leave type "Sick"
3. Optionally add notes "Fever"
4. Click "Save" or "Confirm"

**Expected Results:**
- [ ] `onAddLeaveRecord` is called with:
  - employeeId
  - date (today)
  - type: "sick"
  - notes: "Fever"
- [ ] Employee now shows as "Absent" with red indicator
- [ ] Holiday balance decrements by 1

---

### Flow 3: Remove Absence (Mark Present)

**Scenario:** User removes an incorrectly marked absence

**Setup:**
- Provide employee with existing absence
- Mock `onRemoveLeaveRecord` callback

**Steps:**
1. Click on absent employee
2. Click "Mark Present" or "Remove Absence"

**Expected Results:**
- [ ] `onRemoveLeaveRecord` is called with leave record ID
- [ ] Employee returns to "Present" status
- [ ] Holiday balance increments back

---

### Flow 4: Configure Holiday Rules (Fixed Days)

**Scenario:** User sets 4 days per month entitlement

**Setup:**
- Mock `onSaveHolidayRules` callback

**Steps:**
1. Click "Holiday Rules" button for an employee
2. Select "Fixed days per month"
3. Enter "4" days
4. Leave "Auto-mark absence" unchecked
5. Click "Save"

**Expected Results:**
- [ ] Modal displays with rule options
- [ ] `onSaveHolidayRules` is called with:
  - employeeId
  - type: "fixed"
  - monthlyAllowance: 4
  - autoMarkAbsence: false

---

### Flow 5: Configure Holiday Rules (Recurring)

**Scenario:** User sets Sundays as weekly off

**Setup:**
- Mock `onSaveHolidayRules` callback

**Steps:**
1. Click "Holiday Rules" for employee
2. Select "Recurring weekly off"
3. Check "Sunday"
4. Enable "Auto-mark absence"
5. Click "Save"

**Expected Results:**
- [ ] `onSaveHolidayRules` is called with:
  - type: "recurring"
  - weeklyOffDays: [0] (Sunday)
  - autoMarkAbsence: true

---

### Flow 6: Mark Employee Inactive

**Scenario:** Employee is going on extended leave

**Setup:**
- Mock `onMarkInactive` callback

**Steps:**
1. Click "Mark Inactive" for employee
2. Select start date (can be past date)
3. Enter reason "Gone home for 2 months"
4. Click "Confirm"

**Expected Results:**
- [ ] `onMarkInactive` is called with employeeId, startDate, reason
- [ ] Employee shows amber "Inactive" status
- [ ] No attendance is tracked during inactivity

---

### Flow 7: Mark Employee Active

**Scenario:** Employee returns from extended leave

**Setup:**
- Provide employee with active inactivity period
- Mock `onMarkActive` callback

**Steps:**
1. Click "Mark Active" for inactive employee
2. Select end date
3. Click "Confirm"

**Expected Results:**
- [ ] `onMarkActive` is called with employeeId, endDate
- [ ] Employee returns to active status
- [ ] Attendance tracking resumes

---

## Empty State Tests

### No Employees

**Scenario:** Household has no employees

**Expected Results:**
- [ ] Message: "Add employees in Staff Directory first"
- [ ] Link or button to go to Staff Directory

### All Present

**Scenario:** All employees are present today

**Expected Results:**
- [ ] All employees show green "Present" status
- [ ] No absences in the list

---

## Calendar View Tests

### View Month Calendar

**Steps:**
1. Switch to calendar view
2. View current month

**Expected Results:**
- [ ] Calendar shows full month
- [ ] Days with absences show red indicator
- [ ] Days with holidays show gray indicator
- [ ] Inactive periods show amber shading

---

## Accessibility Checks

- [ ] Date picker is keyboard accessible
- [ ] Status indicators have text labels (not just color)
- [ ] Modal can be closed with Escape key
- [ ] Form fields in modals have proper labels
