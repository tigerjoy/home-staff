# Attendance & Holidays

## Overview

A "present by default" system for tracking household staff attendance and managing holiday entitlements. It focuses on recording exceptions (absences) and tracking a running holiday balance that carries forward month-to-month.

## User Flows

- View daily attendance sheet with all employees
- Mark absences by clicking on employees (present by default)
- Configure holiday rules per employee
- Track running holiday balance
- Mark employees as inactive for extended periods
- View attendance calendar with history

## Components Provided

- `AttendanceDashboard.tsx` — Main view with employee list and calendar
- `AttendanceCalendar.tsx` — Monthly calendar view
- `HolidayRuleModal.tsx` — Configure holiday entitlements
- `InactivityModal.tsx` — Mark employee inactive/active

## Callback Props

| Callback | Description |
|----------|-------------|
| `onAddLeaveRecord(record)` | Mark employee as absent |
| `onUpdateLeaveRecord(id, updates)` | Change leave type |
| `onRemoveLeaveRecord(id)` | Remove absence (mark present) |
| `onDateChange(date)` | Navigate to different date |
| `onSaveHolidayRules(employeeId, config)` | Save holiday configuration |
| `onMarkInactive(employeeId, startDate, reason)` | Start inactivity period |
| `onMarkActive(employeeId, endDate)` | End inactivity period |

## Key Concepts

- **Present by Default:** No record = present. Only absences are tracked.
- **Holiday Balance:** Tracks remaining entitled days, carries forward monthly.
- **Inactivity Period:** Extended absence where no attendance is tracked.

## Visual Reference

See screenshots in `product/sections/attendance-and-holidays/` for the target UI design.
