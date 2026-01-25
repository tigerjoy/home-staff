# Milestone 9: Employee Portal

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 4 (Staff Directory), Milestone 5 (Attendance & Holidays), and Milestone 6 (Payroll & Finance) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions (see `product-plan/sections/employee-portal/tests.md`)

**What you need to build:**
- Phone-number based authentication (Read-only access)
- Household selection logic for multi-employment staff
- Data retrieval for attendance, holiday balance, and payment history
- Mobile-optimized read-only dashboard

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your data fetching logic
- **DO NOT** implement any edit functionality — the portal is strictly read-only
- **DO** handle the different display requirements for Monthly vs Ad-hoc employees
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Provide a transparent, mobile-accessible portal for staff to view their own employment records across all households.

## Overview
A public-facing, mobile-first portal where household staff can independently verify their attendance, holiday balance, and payment history. Access is granted via their registered phone number. The portal dynamically adjusts to show relevant data based on whether the employee is Monthly (full attendance/holidays) or Ad-hoc (payments only).

**Key Capabilities:**
- Simple phone-number based entry (OTP or lookup)
- Household selection and persistent switcher for staff working multiple jobs
- Monthly view: Holiday balance, attendance exceptions, and payment history
- Ad-hoc view: Payment history only (no attendance/holidays)
- Activity feed of recent events (payments, absences)
- Mobile-optimized, high-legibility interface

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/employee-portal/tests.md`. Start by testing the phone number lookup logic and the conditional rendering of sections based on employment type.

## What to Implement

### Components
Copy these from `product-plan/sections/employee-portal/components/`:
- `EmployeePortal.tsx` — Main portal container with login and dashboard views
- Household picker and switcher components
- Dashboard cards for Monthly and Ad-hoc views

### Data Layer
- **Staff Access:** Implement a lookup by phone number that returns all `Employment` records associated with that `Employee` across all households.
- **Read-Only Data:** Fetch `AttendanceRecord`, `PayrollItem`, and `holidayBalance` specifically for the selected employee context.

### Callbacks
- `onLogin(phoneNumber)`: Validate phone number and retrieve employee records.
- `onSelectHousehold(householdId)`: Load data for the specific employment.
- `onSwitchHousehold`: Toggle between different household contexts.

### Empty States
Show a "No Records Found" message if a phone number is entered that doesn't match any active employment in the system.

## Files to Reference
- `product-plan/sections/employee-portal/spec.md` — UI requirements
- `product-plan/sections/employee-portal/types.ts` — Prop definitions
- `product-plan/data-model/types.ts` — Employee, Employment, and Attendance entities

## Expected User Flows
1. **The Monthly Staff Access:** Staff enters phone number → Selects "Main Residence" (Monthly) → Views they have "4 Days Holiday Left" and "1 Absence this Month" → Reviews last salary payment.
2. **The Ad-hoc Staff Access:** Staff enters phone number → Selects "Beach House" (Ad-hoc) → Views a list of 5 recent payments for car washing and garden work → No holiday or attendance sections are visible.
3. **The Multi-Job Switcher:** Staff is viewing Main Residence records → Clicks household switcher in header → Selects Beach House → Dashboard updates immediately to show Ad-hoc records.

## Done When
- [ ] Portal is accessible via phone number lookup
- [ ] Household picker correctly identifies all employments for a staff member
- [ ] Dashboard correctly shows/hides sections based on Monthly vs Ad-hoc status
- [ ] Holiday balance and attendance history are accurate for Monthly staff
- [ ] Payment history is visible for all employment types
- [ ] Household switcher allows seamless transitions
- [ ] Interface is fully responsive and legible on mobile devices
- [ ] All tests in `tests.md` pass
