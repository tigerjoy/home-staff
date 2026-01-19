# Data Model

## Overview

HomeStaff uses a hierarchical data model centered around Households. All staff and management logic are scoped to a household, enabling multi-household and multi-user support.

A key design decision is the **Employee/Employment separation**: An Employee's core identity (name, photo, phone, address) is shared across households, while household-specific data (role, salary, attendance, payroll) is stored in the Employment entity.

## Entity Relationships

```
User ──────┐
           │ (many-to-many via Member)
           ▼
      Household ──────────────────┐
           │                      │
           │ (one-to-many)        │ (one-to-many)
           ▼                      ▼
      Invitation              Employment ◄──── Employee
                                  │              (shared across households)
                     ┌────────────┼────────────┬────────────┐
                     │            │            │            │
                     ▼            ▼            ▼            ▼
              Attendance    Inactivity    Holiday     Payroll
               Record         Period        Rule        Item
```

## Entities

### User
Individual employers or family members who access the platform. Users can register and sign in via Social Auth (Google, Facebook) or with email and password. Each user has an "active household" context that determines where new employees are added and which data is displayed.

### Household
The primary container representing a home or employer unit. All staff and management logic are scoped to a household.

### Member
A join entity that links a User to a Household. It defines the access level (e.g., Admin or Member) for that specific household.

### Invitation
Tracks pending requests for new users to join a Household via their email address.

### Employee
The core identity of a domestic staff member — their personal information (name, photo, phone number, address). An employee's profile is independent of any specific household, allowing the same person to work for multiple families.

### Employment
A join entity that links an Employee to a Household. This represents the working relationship and contains household-specific data: `startDate` (when the employment began), running `holidayBalance`, and employment terms.

**Employment Types:**
- **Monthly** (default): Regular employees on a fixed salary. Full tracking applies — attendance (present by default), holiday rules, holiday balance, and monthly payroll processing.
- **Ad-hoc**: Irregular workers not on a monthly salary. No attendance or holiday tracking — only financial records (payments made) are maintained.

### Attendance Record (Absence)
Records specific dates when an employee was absent from a particular household. Each absence reduces the `holidayBalance` for that Employment. The system assumes an employee is "present by default" unless an Absence record exists for a date.

### Inactivity Period
Blocks of time (start and end dates) when an employee is completely inactive at a household (e.g., gone home for a few months). No attendance or absence is tracked during these periods.

### Holiday Rule
Defines the holiday entitlement for an Employment. This can be a fixed number of days per month (e.g., 4 days) or a recurrence rule (e.g., "Every Sunday"). Holiday rules are per-household since different employers may have different arrangements with the same worker.

### Payroll Item
Financial entries related to an Employment's compensation. This includes Base Salary, Advances, Bonuses, Penalties, and Ad-hoc Payments. Payroll is always per-household — each Employment tracks its own salary and payment history independently.

## Key Relationships

- **User** can belong to multiple **Households** (via **Member**)
- **Household** has many **Members**, **Invitations**, and **Employments**
- **Employee** can work for multiple **Households** (via **Employment**)
- **Employment** belongs to one **Employee** and one **Household**
- **Employment** has many **Attendance Records**, **Inactivity Periods**, **Holiday Rules**, and **Payroll Items**
- **Holiday Rules** and **Attendance Records** update the **Employment's** running `holidayBalance`

## Notes

When adding an employee to a household, users can either:
1. Create a new employee profile (new person)
2. Link an existing employee from another household they belong to (avoids re-entering the same details)
