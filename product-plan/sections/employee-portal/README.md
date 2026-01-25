# Employee Portal

## Overview

A public-facing, read-only portal designed for domestic staff to access their employment records with transparency. Using only their registered phone number, staff can verify their attendance, check their holiday balances, and review their payment history across all households where they are employed. The portal is mobile-first, ensuring accessibility for users on basic smartphones.

## Key Functionality

- **Phone-Based Access:** Simple login using the registered phone number; no complex passwords required.
- **Multi-Household Dashboard:** If working for multiple households, staff can see a summary of all employments and switch between them.
- **Employment Type Adaptation:**
    - **Monthly Staff:** View holiday balance, detailed attendance (absences), and full payment history.
    - **Ad-hoc Staff:** View payment history only; attendance and holiday sections are hidden.
- **Household Switcher:** A persistent control to quickly jump between different household records.
- **Financial Transparency:** Detailed list of payments received, including base salary, bonuses, advances, and repayments.
- **Read-Only Interface:** Ensures data integrity while providing full visibility to the employee.

## User Flows

### Accessing the Portal
1. Staff member enters their registered phone number on the **Landing Page**.
2. System identifies the employee and shows the **Household Selection** screen (if multiple) or the **Staff Dashboard** (if single).
3. Staff member reviews their key stats (e.g., "4 Holidays Left").

### Reviewing Monthly Records
1. Staff member selects a Monthly employment.
2. The dashboard shows current `holidayBalance` and "Absences This Month".
3. Staff member scrolls to the **Activity Feed** to see specific dates marked as absent.
4. Staff member reviews the **Payment History** for base salary and bonuses.

### Reviewing Ad-hoc Records
1. Staff member selects an Ad-hoc employment.
2. The dashboard shows "Total Payments" and "Last Payment".
3. Staff member views the list of one-off payments and descriptions.
4. No attendance or holiday data is displayed.

## Design Decisions

- **Mobile-First Design:** Large touch targets, high contrast, and simplified navigation for small screens.
- **No Shell:** Does not use the employer-facing application shell; features its own minimal header and navigation.
- **Read-Only:** No edit actions are available to staff members within this portal.
- **Privacy by Phone:** Access is granted based on the phone number registered by the employer in the Staff Directory.

## Components Provided

| Component | Description |
|-----------|-------------|
| `EmployeePortal` | Main entry point and layout |
| `PhoneLogin` | Mobile-first login screen |
| `HouseholdPicker` | List/cards for selecting which household to view |
| `StaffDashboard` | Context-aware dashboard (Monthly vs. Ad-hoc) |
| `HouseholdSwitcher` | Header component for switching households |
| `ActivityFeed` | Chronological list of attendance and payment events |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogin` | Called when a phone number is submitted |
| `onSelectHousehold` | Called when a household card is clicked |
| `onSwitchHousehold` | Called when switching households from the header |
| `onLogout` | Called when the staff member exits the portal |

## Empty States

- **No Employment Found:** Shows a message suggesting the user contact their employer to ensure their phone number is registered.
- **No Recent Activity:** Shows "No records found for this household" in the activity feed.

## Visual Reference

See `EmployeePortalPreview.png` for the target UI design.
