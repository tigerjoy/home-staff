# Milestone 5: Attendance & Holidays

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 4 (Staff Directory) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Test-writing instructions (see `product-plan/sections/attendance-and-holidays/tests.md`)

**What you need to build:**
- Attendance tracking logic (present by default, marking absences)
- Holiday entitlement calculation and balance tracking
- Inactivity period management (pausing tracking)
- Cross-household absence propagation logic
- Automated marking logic based on recurrence rules

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your API calls
- **DO** replace sample data with real data from your backend
- **DO** implement logic to exclude Ad-hoc employees from this section
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Manage staff attendance and holiday balances, focusing on exceptions and automated rule-based tracking.

## Overview
A "present by default" system for tracking **Monthly** household staff. It records absences and manages holiday entitlements that carry forward month-to-month. It handles inactivity periods (long-term leave) and allows for cross-household synchronization of absences for shared staff.

**Key Capabilities:**
- Daily attendance marking (recording absences)
- Running holiday balance tracking per employment
- Holiday rule configuration (fixed monthly days vs. recurrence patterns)
- Inactivity period management (back-datable start/end)
- "Auto-mark Absence" for scheduled off-days
- Cross-household absence/inactivity propagation

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/attendance-and-holidays/tests.md`. Start by testing the holiday balance calculation logic and the "Apply to all households" prompt.

## What to Implement

### Components
Copy these from `product-plan/sections/attendance-and-holidays/components/`:
- `AttendanceDashboard.tsx` — Main overview and employee list
- `AttendanceCalendar.tsx` — Detailed history view for an employee
- `HolidayRuleModal.tsx` — Interface for setting entitlement rules
- `InactivityModal.tsx` — Interface for marking periods of inactivity

### Data Layer
- **Attendance Records:** Store absences with date, employee ID, and household ID.
- **Holiday Balances:** Maintain a running balance that updates when absences are recorded or when new entitlements are granted at month-end.
- **Rules:** Store `HolidayRule` per Employment (Monthly days or recurrence).

### Callbacks
- `onMarkAbsence`: Record an absence and update holiday balance.
- `onMarkInactive`: Create an `InactivityPeriod`.
- `onSaveHolidayRule`: Update the entitlement settings for an employment.
- `onToggleAutoMark`: Enable/disable automated absence recording.

### Empty States
Show a "No Monthly Staff" state if all employees in the household are Ad-hoc, explaining that attendance is only tracked for Monthly staff.

## Files to Reference
- `product-plan/sections/attendance-and-holidays/spec.md` — UI requirements
- `product-plan/sections/attendance-and-holidays/sample-data.json` — Sample records
- `product-plan/sections/attendance-and-holidays/types.ts` — Prop definitions

## Expected User Flows
1. **The Absence Marking Flow:** User views the attendance list → All staff are "Present" → User clicks an employee to mark an "Absence" → `holidayBalance` decrements immediately.
2. **The Cross-Household Flow:** User marks an absence for a shared employee → System prompts "Apply to all households?" → User clicks Yes → Absence records are created for all of the employee's Monthly employments.
3. **The Inactivity Flow:** Employee goes on long-term leave → User clicks "Mark Inactive" → Sets start date → Employee status changes to "Inactive" and is excluded from daily marking until "Marked Active".

## Done When
- [ ] Attendance sheet displays only Monthly employees
- [ ] Marking an absence correctly updates the holiday balance
- [ ] Holiday rules (fixed days vs. recurrence) can be configured
- [ ] Inactivity periods correctly pause attendance tracking
- [ ] Cross-household propagation prompt appears and works for shared staff
- [ ] Running balance carries over correctly
- [ ] All tests in `tests.md` pass
