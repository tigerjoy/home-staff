# Test Instructions: Attendance & Holidays

These test-writing instructions are **framework-agnostic**. Adapt to your testing setup.

## Overview

The Attendance system uses "present by default" logic. Test marking absences, holiday rules, inactivity periods, and balance tracking.

---

## User Flow Tests

### Flow 1: Mark Employee Absent

**Scenario:** User marks an employee as absent for a specific date

**Setup:**
- Active employees list
- Selected date (today)
- No leave records for today

**Steps:**
1. User navigates to `/attendance`
2. User sees list of employees (all showing as present)
3. User clicks on employee row
4. User selects leave type "Sick"
5. User optionally adds notes "Fever"
6. User confirms

**Expected Results:**
- [ ] Employee row shows red absence indicator
- [ ] Holiday balance decrements by 1
- [ ] Leave record created with type "sick" and notes
- [ ] `onAddLeaveRecord` called with correct data

### Flow 2: Configure Holiday Rules

**Scenario:** User sets up holiday entitlement for an employee

**Steps:**
1. User clicks "Holiday Rules" button for employee
2. Modal opens with configuration options
3. User selects "Fixed Days" and enters "4"
4. User toggles "Auto-mark absence" on
5. User clicks "Save"

**Expected Results:**
- [ ] Modal shows current configuration
- [ ] "Fixed Days" and "Recurring" options available
- [ ] Auto-mark toggle visible with explanation
- [ ] `onSaveHolidayRules` called with config object
- [ ] Modal closes on save

### Flow 3: Mark Inactive Period

**Scenario:** User marks employee as inactive for extended absence

**Steps:**
1. User clicks "Mark Inactive" on employee
2. Modal opens with date picker
3. User enters start date and reason
4. User confirms

**Expected Results:**
- [ ] Date picker allows selecting past dates (back-dating)
- [ ] Reason field is optional
- [ ] Employee shows amber "Inactive" indicator
- [ ] `onMarkInactive` called with employeeId, startDate, reason

### Flow 4: Navigate Attendance Calendar

**Scenario:** User views historical attendance

**Steps:**
1. User clicks on calendar navigation
2. User selects previous month
3. User sees past attendance records

**Expected Results:**
- [ ] Calendar updates to show selected month
- [ ] Past absences marked on calendar
- [ ] Holidays/off-days marked in gray
- [ ] `onDateChange` called with new date

---

## Empty State Tests

### No Employees

**Setup:**
- `employees = []`

**Expected Results:**
- [ ] Shows message "Add staff in the Staff Directory first"
- [ ] No attendance sheet displayed

### No Absences for Date

**Setup:**
- Employees exist
- No leave records for selected date

**Expected Results:**
- [ ] All employees shown as present (default state)
- [ ] No red absence indicators

---

## Business Logic Tests

### Present by Default

**Scenario:** Verify employee is present when no leave record exists

**Setup:**
- Employee "emp-001"
- Date "2024-01-15"
- No LeaveRecord for emp-001 on 2024-01-15

**Expected Results:**
- [ ] Employee displays as "Present"
- [ ] No absence indicator shown

### Holiday Balance Calculation

**Scenario:** Balance decreases when absence recorded

**Setup:**
- Employee with holidayBalance: 5
- Mark absence for one day

**Expected Results:**
- [ ] After absence, balance shows 4
- [ ] Balance displayed on employee row

---

## Sample Test Data

```typescript
const mockEmployee = {
  id: "emp-001",
  name: "Rajesh Kumar",
  role: "Driver",
  avatar: "https://example.com/avatar.jpg",
  status: "active",
  joiningDate: "2023-01-15",
  holidayBalance: 8
};

const mockLeaveRecord = {
  id: "lv-101",
  employeeId: "emp-001",
  date: "2024-03-05",
  type: "sick",
  notes: "Fever"
};

const mockHolidayRule = {
  employeeId: "emp-001",
  dayOfWeek: 0, // Sunday
  type: "weekly_off"
};
```
