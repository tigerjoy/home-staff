# Milestone 7: Employee Portal

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete (Staff, Attendance, Payroll)

## Goal

Implement the Employee Portal — a public-facing, read-only portal for staff to view their own records using their phone number.

## Overview

The Employee Portal provides transparency for household staff by allowing them to independently verify their attendance, holiday balance, and payment history. It's a simple, mobile-first interface that requires only a phone number for access (no account required).

**Key Functionality:**
- Simple phone number login (no password)
- Read-only dashboard with key metrics
- View holiday balance and absences
- View payment history
- See activity timeline
- Mobile-first, accessible on basic smartphones

## Recommended Approach: Test-Driven Development

See `product-plan/sections/employee-portal/tests.md` for test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/employee-portal/components/`:

- `EmployeePortal.tsx` — Complete portal with login and dashboard

### Data Layer

Key types from `types.ts`:

```typescript
interface StaffProfile {
  id: string
  name: string
  role: string
  phoneNumber: string
  joinDate: string
  householdName: string
}

interface StaffSummary {
  holidayBalance: number
  totalAbsencesYear: number
  lastPaymentAmount: number
  lastPaymentDate: string
  outstandingAdvance: number
}

interface ActivityItem {
  id: string
  type: 'absence' | 'payment' | 'entitlement' | 'advance'
  date: string
  title: string
  description: string
  impact?: string
  amount?: number
}
```

### Callbacks

| Callback | Description |
|----------|-------------|
| `onLogin(phoneNumber)` | Authenticate with phone number |
| `onLogout()` | Clear session and return to login |
| `onViewActivityDetail(id)` | View more details for activity item |

### UI Requirements

- **No authentication barrier:** Phone number only, no password
- **Mobile-first:** Optimized for small screens
- **High legibility:** Large text, clear numbers
- **Read-only:** No edit actions anywhere
- **Simple navigation:** Dashboard only, no complex routing

### Security Considerations

- Phone number lookup should be rate-limited
- Consider SMS verification for sensitive data
- Only show data for employees with registered phone numbers
- No personally identifiable info of other employees

### Empty States

- **Phone not found:** "We couldn't find an employee with this phone number. Please check and try again."
- **No activity:** "No recent activity to show"
- **No payments:** "No payments recorded yet"

## Files to Reference

- `product-plan/sections/employee-portal/README.md`
- `product-plan/sections/employee-portal/tests.md`
- `product-plan/sections/employee-portal/components/`
- `product-plan/sections/employee-portal/types.ts`
- `product-plan/sections/employee-portal/sample-data.json`

## Expected User Flows

### Flow 1: Employee Logs In

1. Employee navigates to `/portal` on their phone
2. Employee sees clean login screen with phone input
3. Employee enters their registered phone number
4. Employee taps "View My Records"
5. **Outcome:** Dashboard shows with their data

### Flow 2: View Dashboard

1. Employee is logged in
2. Employee sees summary cards: Holiday Balance, Last Payment
3. Employee sees activity feed with recent events
4. **Outcome:** Employee can verify their records

### Flow 3: Failed Login

1. Employee enters phone number not in system
2. Error message appears: "Phone number not found"
3. Employee can try again
4. **Outcome:** Clear feedback, no security leak

### Flow 4: Logout

1. Employee taps "Log Out"
2. Session cleared
3. Returned to login screen
4. **Outcome:** Clean logout, ready for next user

## Done When

- [ ] Tests written and passing
- [ ] Portal accessible at `/portal` without auth
- [ ] Phone number login works
- [ ] Dashboard shows employee summary
- [ ] Holiday balance displayed correctly
- [ ] Payment information visible
- [ ] Activity feed shows recent events
- [ ] Error handling for invalid phone
- [ ] Logout functionality works
- [ ] Mobile responsive and readable
- [ ] No edit actions available (read-only)
