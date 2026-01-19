# HomeStaff — Product Overview

## Summary

A digital household workforce management and payroll platform designed for employers to manage domestic staff. It simplifies tracking employee records, automates attendance with "present by default" logic, and maintains a transparent financial history of salaries, advances, and bonuses.

## Problems & Solutions

### Problem 1: Disorganized Employee Records
Centralized digital profiles allow employers to maintain structured records including photos, contact details, roles, and residential addresses in one place.

### Problem 2: Tedious Attendance Tracking
The system uses "present by default" automation so employers only need to mark absences, while supporting flexible recurring holiday rules similar to calendar events.

### Problem 3: Complex Payroll & Advances
A lightweight payroll system tracks base salary, periodic increments, bonuses, and advances to create a transparent and accurate financial history for each employee.

### Problem 4: Lack of Transparency for Staff
A public-facing employee portal allows staff to view their payment history, holidays, and attendance summary simply by entering their registered phone number.

### Problem 5: Collaborative Management
A "User > Household" hierarchy enables multiple family members or stakeholders to share access and collaborate on managing the same household staff records.

## Planned Sections

1. **Staff Directory** — Manage employee profiles, roles, contact details, and documents.
2. **Attendance & Holidays** — Track daily presence, manage absences, and configure recurring holiday rules.
3. **Payroll & Finance** — Handle salary calculation, advances, bonuses, and payment history.
4. **Settings & Access** — User registration, household management, and member invitations.
5. **Onboarding & Setup** — Guide new users through the initial configuration of their household and staff.
6. **Employee Portal** — Public-facing view for staff to check their own records via phone number.

## Data Model

**Core Entities:**
- User — Individual employers or family members who access the platform
- Household — The primary container representing a home or employer unit
- Member — A join entity that links a User to a Household with access levels
- Invitation — Tracks pending requests for new users to join a Household
- Employee — Domestic staff members managed within a Household
- Attendance Record (Absence) — Records specific dates when an employee was absent
- Inactivity Period — Blocks of time when an employee is completely inactive
- Holiday Rule — Defines holiday entitlement (fixed days or recurrence)
- Payroll Item — Financial entries (salary, advances, bonuses, penalties)

## Design System

**Colors:**
- Primary: `amber` — Used for buttons, links, key accents
- Secondary: `orange` — Used for tags, highlights, secondary elements
- Neutral: `stone` — Used for backgrounds, text, borders

**Typography:**
- Heading: Nunito Sans
- Body: Nunito Sans
- Mono: Fira Code

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **Staff Directory** — Employee profiles, multi-step wizard, documents, and notes
3. **Attendance & Holidays** — Present-by-default tracking, holiday rules, inactivity periods
4. **Payroll & Finance** — Salary calculation, advances, settlements, payment ledger
5. **Settings & Access** — Household management, member invitations, role permissions
6. **Onboarding & Setup** — New user wizard for household initialization
7. **Employee Portal** — Public read-only view for staff to check their records

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
