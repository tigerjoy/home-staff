# Milestone 5: Attendance & Holidays

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 4 (Staff Directory) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement Attendance & Holidays — a "present by default" system for tracking staff attendance and managing holiday entitlements.

## Overview

A "present by default" system for tracking household staff attendance and managing holiday entitlements. It focuses on recording exceptions (absences) and tracking a running holiday balance that carries forward month-to-month. The system automatically pauses tracking for employees during defined inactivity periods.

**Key Functionality:**
- View daily attendance with all staff defaulted to present
- Mark absences (only record exceptions)
- Configure holiday entitlements per employee (fixed days or recurring)
- View running holiday balance for each employee
- Mark employees inactive for extended periods
- Auto-mark absences on scheduled work days
- View attendance history in calendar format

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/attendance-and-holidays/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/attendance-and-holidays/components/`:

- `AttendanceDashboard.tsx` — Main attendance view
- `AttendanceCalendar.tsx` — Calendar view of attendance
- `HolidayRuleModal.tsx` — Configure holiday entitlements
- `InactivityModal.tsx` — Mark employee inactive/active

### Data Layer

The components expect these data shapes:

```typescript
interface AttendanceAndHolidaysProps {
  employees: Employee[]
  leaveRecords: LeaveRecord[]
  holidays: Holiday[]
  holidayRules: HolidayRule[]
  selectedDate?: string
  onAddLeaveRecord?: (record: Omit<LeaveRecord, 'id'>) => void
  onUpdateLeaveRecord?: (id: string, updates: Partial<LeaveRecord>) => void
  onRemoveLeaveRecord?: (id: string) => void
  onAddHoliday?: (holiday: Omit<Holiday, 'id'>) => void
  onRemoveHoliday?: (id: string) => void
  onDateChange?: (date: string) => void
  onSaveHolidayRules?: (employeeId: string, config: HolidayRuleConfig) => void
  onMarkInactive?: (employeeId: string, startDate: string, reason?: string) => void
  onMarkActive?: (employeeId: string, endDate: string) => void
}

interface LeaveRecord {
  id: string
  employeeId: string
  date: string
  type: 'sick' | 'casual' | 'paid' | 'unpaid' | 'other'
  notes?: string
}

interface HolidayRuleConfig {
  type: 'fixed' | 'recurring'
  monthlyAllowance?: number
  weeklyOffDays?: number[]
  autoMarkAbsence: boolean
}
```

You'll need to:
- Create Attendance API endpoints
- Implement "present by default" logic
- Calculate running holiday balances
- Handle inactivity periods

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onAddLeaveRecord` | Mark employee absent for a date |
| `onUpdateLeaveRecord` | Change leave type or notes |
| `onRemoveLeaveRecord` | Remove absence (mark as present) |
| `onAddHoliday` | Add a public holiday |
| `onRemoveHoliday` | Remove a public holiday |
| `onDateChange` | Navigate to different date in calendar |
| `onSaveHolidayRules` | Save holiday entitlement config |
| `onMarkInactive` | Start inactivity period |
| `onMarkActive` | End inactivity period |

### Empty States

Implement empty state UI for when no records exist:

- **No employees:** Show "Add employees in Staff Directory first"
- **No absences for selected date:** Show all employees as "Present"
- **No holiday rules configured:** Show prompt to configure in Holiday Rule Modal

## Files to Reference

- `product-plan/sections/attendance-and-holidays/README.md` — Feature overview and design intent
- `product-plan/sections/attendance-and-holidays/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/attendance-and-holidays/components/` — React components
- `product-plan/sections/attendance-and-holidays/types.ts` — TypeScript interfaces
- `product-plan/sections/attendance-and-holidays/sample-data.json` — Test data
- `product-plan/sections/attendance-and-holidays/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Mark Employee Absent

1. User views daily attendance sheet
2. All employees show as "Present" by default
3. User clicks on an employee to mark absence
4. User selects leave type (Sick, Casual, Paid, Unpaid)
5. User optionally adds notes
6. User confirms
7. **Outcome:** Absence recorded, holiday balance decremented

### Flow 2: Configure Holiday Rules

1. User clicks "Holiday Rules" button for an employee
2. Modal opens with options
3. User selects "4 days per month" or "Every Sunday off"
4. User toggles "Auto-mark absence" if desired
5. User saves configuration
6. **Outcome:** Rules saved, balance calculations updated

### Flow 3: Mark Employee Inactive

1. User clicks "Mark Inactive" for an employee
2. User selects start date (can back-date)
3. User optionally adds reason
4. User confirms
5. **Outcome:** Employee marked inactive, no attendance tracked during period

### Flow 4: View Calendar History

1. User navigates to calendar view
2. User sees month view with color-coded days
3. Red = Absence, Gray = Off-day/Holiday, Amber = Inactive
4. User clicks on a date to see details
5. **Outcome:** Detailed view of that day's attendance

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Daily attendance view shows all employees
- [ ] Employees default to "Present" unless absence recorded
- [ ] Absence can be marked with type and notes
- [ ] Holiday balance displayed for each employee
- [ ] Holiday rules modal works (fixed days or recurring)
- [ ] Auto-mark absence toggle works
- [ ] Inactivity periods can be created and ended
- [ ] Calendar view shows attendance history
- [ ] Visual indicators work (Red, Gray, Amber)
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Dark mode support
