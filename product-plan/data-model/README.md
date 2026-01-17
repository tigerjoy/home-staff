# Data Model

## Overview

HomeStaff uses a hierarchical data model centered around Households as the primary organizational unit. All staff, attendance, and financial data is scoped to a specific household.

## Core Entities

### User
Individual employers or family members who access the platform.
- Authenticated via social login (Google, etc.)
- Can belong to multiple Households

### Household
The primary container representing a home or employer unit. All staff and management logic are scoped to a household.
- Has a name and status (active/archived)
- Contains Members, Employees, and all related records

### Member
A join entity that links a User to a Household. It defines the access level (Admin or Member) for that specific household.
- Admins can manage payroll, invite members, archive household
- Members have view-only access to certain sections

### Invitation
Tracks pending requests for new users to join a Household via their email address.
- Contains email, assigned role, and status

### Employee
Domestic staff members managed within a Household.
- Stores personal details, contact info, documents
- Has a `startDate` (when attendance tracking begins)
- Maintains a running `holidayBalance`
- Status: active or archived

### Attendance Record (Absence)
Records specific dates when an employee was absent.
- Each absence reduces the `holidayBalance`
- System assumes "present by default" unless an Absence exists

### Inactivity Period
Blocks of time (start and end dates) when an employee is completely inactive.
- Used for long-term absences (e.g., gone home for months)
- No attendance tracking during these periods

### Holiday Rule
Defines the holiday entitlement for an employee.
- Fixed monthly days (e.g., 4 days/month)
- Or recurrence rule (e.g., "Every Sunday")
- Includes auto-mark absence toggle

### Payroll Item
Financial entries related to an employee's compensation.
- Types: Base Salary, Advances, Bonuses, Penalties, Encashments
- Tracks payment status and attached receipts

## Relationships

```
User ─────┬──── Member ────┬──── Household
          │                │
          │                ├──── Employee ─────┬──── Attendance Record
          │                │                   ├──── Inactivity Period
          │                │                   ├──── Holiday Rule
          │                │                   └──── Payroll Item
          │                │
          │                └──── Invitation
          │
          └──── (can belong to multiple Households)
```

- **User** can belong to multiple **Households** (via **Member**)
- **Household** has many **Members**, **Invitations**, and **Employees**
- **Employee** belongs to one **Household**
- **Employee** has many **Attendance Records**, **Inactivity Periods**, **Holiday Rules**, and **Payroll Items**
- **Holiday Rules** and **Attendance Records** update the **Employee's** running `holidayBalance`
