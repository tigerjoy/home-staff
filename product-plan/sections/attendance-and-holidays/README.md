# Attendance & Holidays

## Overview

A "present by default" system for tracking household staff attendance and managing holiday entitlements. It focuses on recording exceptions (absences) and tracking a running holiday balance that carries forward month-to-month.

## User Flows

- View daily attendance with all staff defaulted to present
- Mark absences for employees who didn't show up
- Configure holiday entitlements (fixed days or recurring)
- View running holiday balance for each employee
- Mark employees inactive for extended periods
- View attendance history in calendar format

## Components Provided

| Component | Description |
|-----------|-------------|
| `AttendanceDashboard` | Main attendance view with employee list |
| `AttendanceCalendar` | Calendar view of attendance history |
| `HolidayRuleModal` | Configure holiday entitlements |
| `InactivityModal` | Mark employee inactive/active |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onAddLeaveRecord` | Mark employee absent for a date |
| `onUpdateLeaveRecord` | Change leave type or notes |
| `onRemoveLeaveRecord` | Remove absence (mark as present) |
| `onAddHoliday` | Add a public holiday |
| `onRemoveHoliday` | Remove a public holiday |
| `onDateChange` | Navigate to different date |
| `onSaveHolidayRules` | Save holiday entitlement config |
| `onMarkInactive` | Start inactivity period |
| `onMarkActive` | End inactivity period |

## Design Notes

- Visual status indicators: Red (Absence), Gray (Off-day), Amber (Inactive)
- Holiday balance displayed for each employee
- Present by default — only exceptions are recorded
- Calendar shows month view with color coding
