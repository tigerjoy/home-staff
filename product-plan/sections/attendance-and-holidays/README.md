# Attendance & Holidays

## Overview

A "present by default" system for tracking household staff attendance and managing holiday entitlements. The system focuses on recording exceptions (absences) and tracking a running holiday balance per Employment that carries forward month-to-month. It ensures that employers only need to act when something changes, while maintaining a precise record of leave for Monthly employees.

## Key Functionality

- **Monthly-Only Tracking:** Automatically filters the view to show only Monthly staff; Ad-hoc employees are excluded as they don't have attendance tracking.
- **Daily Exception Marking:** Quickly mark an "Absence" for employees who didn't show up.
- **Running Holiday Balance:** Real-time visibility into how many days an employee has left, used, or carried over.
- **Cross-Household Absence:** Optionally apply a recorded absence to an employee's other Monthly employments across different households (e.g., for sick leave).
- **Holiday Rules:** Configure fixed monthly counts (e.g., 4 days/month) or recurring off-days (e.g., "Every Sunday").
- **Inactivity Management:** Define long-term inactive periods (e.g., extended leave) to pause attendance tracking and holiday accrual.
- **Auto-Marking:** Toggle to automatically record absences on scheduled work days based on the recurrence rule.

## User Flows

### Marking an Absence
1. User views the **Attendance Dashboard**.
2. User identifies a Monthly employee and clicks the status toggle.
3. User selects "Absence".
4. If the employee works in other households for this user, a prompt appears asking to "Apply to all households?".
5. The employee's `holidayBalance` is updated in real-time.

### Managing Holiday Rules
1. User opens the **Holiday Rule Modal** for an employee.
2. User chooses between "Fixed Days" or "Recurrence Rule".
3. User sets the parameters (e.g., 2 days per month or every Saturday).
4. User toggles "Auto-mark Absence" if they want the system to handle off-days automatically.
5. Save configuration (specific to current household).

### Recording Inactivity
1. User selects "Mark Inactive" for an employee.
2. User selects the start date (supports back-dating).
3. The system pauses all attendance logic for this period.
4. User can later "Mark Active" to resume tracking.

## Design Decisions

- **Exception-Based UI:** The interface defaults to showing everyone as present to reduce data entry effort.
- **Color Coding:** Distinct indicators for Absence (Red), Scheduled Holiday (Gray), and Inactive (Amber).
- **Household Specificity:** Holiday rules are stored per Employment, acknowledging that the same employee may have different arrangements with different households.

## Components Provided

| Component | Description |
|-----------|-------------|
| `AttendanceDashboard` | Main list view with attendance toggles and balances |
| `AttendanceCalendar` | Monthly view of absences and inactivity |
| `HolidayRuleModal` | Interface for setting entitlement and recurrence rules |
| `InactivityModal` | Form for defining start/end dates for inactive periods |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onMarkAbsence` | Called when an absence is recorded |
| `onMarkInactivity` | Called when an employee is marked inactive/active |
| `onUpdateHolidayRule` | Called when holiday rules are modified |
| `onToggleAutoMark` | Called when auto-marking is enabled/disabled |

## Empty States

- **No Monthly Staff:** Shows a message explaining that attendance is only tracked for Monthly employees, with a link to the Staff Directory.
- **No History:** Shows a placeholder in the calendar/history view if no exceptions have been recorded yet.

## Visual Reference

See `AttendanceDashboard.png` and `AttendanceCalendar.png` for the target UI design.
