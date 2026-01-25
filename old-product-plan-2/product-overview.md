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

## Key Features

- Employee Profiles & Document Management
- Automated Attendance System & Calendar View
- Flexible Holiday Rules (Recurrence patterns)
- Payroll Management (Salary, Advances, Bonuses)
- Configurable Settings & Defaults
- Multi-user Household Access
- Secure Social Auth for Employers
- Public Employee Portal (Phone Number Access)

## Planned Sections

1. **Landing Page** — Marketing page showcasing product features, benefits, and call-to-action for new users.
2. **User Authentication** — Registration and login flows supporting Social Auth (Google, Facebook) and email/password.
3. **Staff Directory** — Manage employee profiles, roles, contact details, and documents.
4. **Attendance & Holidays** — Track daily presence, manage absences, and configure recurring holiday rules.
5. **Payroll & Finance** — Handle salary calculation, advances, bonuses, and payment history.
6. **Settings & Access** — User registration, household management, and member invitations.
7. **Onboarding & Setup** — Guide new users through the initial configuration of their household and staff.
8. **Employee Portal** — Public-facing view for staff to check their own records via phone number.

## Data Model

**Core Entities:**
- User — Individual employers or family members who access the platform
- Household — The primary container representing a home or employer unit
- Member — Join entity linking a User to a Household with access level
- Invitation — Pending requests for new users to join a Household
- Employee — Domestic staff member's core identity (shared across households)
- Employment — Links Employee to Household with household-specific data
- Attendance Record (Absence) — Records specific dates when an employee was absent
- Inactivity Period — Blocks of time when an employee is completely inactive
- Holiday Rule — Defines the holiday entitlement for an Employment
- Payroll Item — Financial entries related to an Employment's compensation

**Key Relationships:**
- User can belong to multiple Households (via Member)
- Household has many Members, Invitations, and Employments
- Employee can work for multiple Households (via Employment)
- Employment belongs to one Employee and one Household
- Employment has many Attendance Records, Inactivity Periods, Holiday Rules, and Payroll Items

**Employment Types:**
- Monthly — Regular employees with attendance/holiday tracking
- Ad-hoc — Irregular workers with only payment records (no attendance/holiday tracking)

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
2. **Landing Page** — Marketing page showcasing product features and call-to-action
3. **User Authentication** — Registration and login flows with Social Auth support
4. **Staff Directory** — Employee profiles, documents, and multi-step wizard
5. **Attendance & Holidays** — Present-by-default tracking and holiday rule management
6. **Payroll & Finance** — Salary calculation, advances, and payment ledger
7. **Settings & Access** — Household management and member invitations
8. **Onboarding & Setup** — Multi-step wizard for new user setup
9. **Employee Portal** — Public-facing read-only portal for staff

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
