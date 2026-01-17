# Milestone 3: Attendance & Holidays

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation), Milestone 2 (Staff Directory) complete

## Goal

Implement the Attendance & Holidays feature — track daily presence with "present by default" logic, manage absences, and configure holiday rules.

## Overview

The Attendance system uses a "present by default" approach where employees are assumed present unless explicitly marked absent. This reduces daily tracking burden to just recording exceptions. The system also manages holiday entitlements and tracks a running holiday balance for each employee.

**Key Functionality:**
- View daily attendance sheet with all employees
- Mark absences by clicking on an employee (present by default)
- Configure holiday rules per employee (fixed days or recurring weekdays)
- Track running holiday balance that carries forward
- Mark employees as inactive for extended periods
- View attendance calendar with history

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/attendance-and-holidays/tests.md` for detailed test-writing instructions.

**TDD Workflow:**
1. Read `tests.md` and write failing tests
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/attendance-and-holidays/components/`:

- `AttendanceDashboard.tsx` — Main view with employee list and calendar
- `AttendanceCalendar.tsx` — Monthly calendar view
- `HolidayRuleModal.tsx` — Configure holiday entitlements
- `InactivityModal.tsx` — Mark employee inactive/active

### Data Layer

The components expect these data shapes (see `types.ts`):

```typescript
interface Employee {
  id: string
  name: string
  role: string
  avatar: string
  status: 'active' | 'inactive'
  joiningDate: string
  holidayBalance: number
}

interface LeaveRecord {
  id: string
  employeeId: string
  date: string
  type: 'sick' | 'casual' | 'paid' | 'unpaid' | 'other'
  notes?: string
}

interface Holiday {
  id: string
  date: string
  name: string
  type: 'public' | 'festival' | 'other'
}

interface HolidayRule {
  employeeId: string
  dayOfWeek: number
  type: 'weekly_off'
}
```

### Callbacks

Wire up these user actions from `AttendanceAndHolidaysProps`:

| Callback | Description |
|----------|-------------|
| `onAddLeaveRecord(record)` | Mark employee as absent |
| `onUpdateLeaveRecord(id, updates)` | Change leave type |
| `onRemoveLeaveRecord(id)` | Remove absence (mark present) |
| `onAddHoliday(holiday)` | Add public holiday |
| `onRemoveHoliday(id)` | Remove public holiday |
| `onDateChange(date)` | Navigate to different date |
| `onSaveHolidayRules(employeeId, config)` | Save holiday configuration |
| `onMarkInactive(employeeId, startDate, reason)` | Start inactivity period |
| `onMarkActive(employeeId, endDate)` | End inactivity period |

### Business Logic

**Present by Default:**
- If no LeaveRecord exists for an employee on a date, they are PRESENT
- Only absences need to be recorded
- This reduces daily data entry significantly

**Holiday Balance:**
- Each employee starts with an entitlement (e.g., 4 days/month or Sundays off)
- Taking leave reduces the balance
- Unused days carry forward to next month
- Excess absences create a deficit (handled in Payroll)

**Visual Status Indicators:**
- Present: No special indicator (default)
- Absent: Red indicator
- Scheduled Off/Holiday: Gray indicator
- Inactive: Amber indicator

### Empty States

- **No employees:** Show "Add staff in the Staff Directory first"
- **No absences for month:** Show all employees as present
- **No holiday rules:** Prompt to configure holiday entitlements

## Files to Reference

- `product-plan/sections/attendance-and-holidays/README.md`
- `product-plan/sections/attendance-and-holidays/tests.md`
- `product-plan/sections/attendance-and-holidays/components/`
- `product-plan/sections/attendance-and-holidays/types.ts`
- `product-plan/sections/attendance-and-holidays/sample-data.json`

## Expected User Flows

### Flow 1: Mark Employee Absent

1. User navigates to `/attendance`
2. User sees list of employees with today's date
3. User clicks on employee row (defaulted to present)
4. User selects leave type (Sick, Casual, Paid, Unpaid)
5. User optionally adds notes
6. **Outcome:** Leave record created, holiday balance decremented

### Flow 2: Configure Holiday Rules

1. User clicks "Holiday Rules" for an employee
2. Modal opens with configuration options
3. User selects "Fixed Days" (4 days/month) or "Recurring" (Every Sunday)
4. User toggles "Auto-mark absence" if desired
5. User clicks "Save"
6. **Outcome:** Holiday rule saved, balance calculations updated

### Flow 3: Mark Inactive Period

1. User clicks "Mark Inactive" on an employee
2. User enters start date and reason
3. User confirms
4. **Outcome:** Employee shown as inactive, no attendance tracked

### Flow 4: View Attendance History

1. User navigates to calendar view
2. User clicks on different dates to see historical attendance
3. User can see past absences marked on calendar
4. **Outcome:** Historical attendance is visible

## Done When

- [ ] Tests written and passing
- [ ] Attendance dashboard displays employees with status
- [ ] Clicking employee shows absence options
- [ ] Leave records are created/updated/deleted
- [ ] Holiday balance updates correctly
- [ ] Holiday rules modal works
- [ ] Inactivity periods work with date picker
- [ ] Calendar navigation works
- [ ] Present-by-default logic is correct
- [ ] Empty states display properly
- [ ] Responsive on mobile
