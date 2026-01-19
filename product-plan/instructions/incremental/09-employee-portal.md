# Milestone 9: Employee Portal

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1, 4, 5, and 6 complete (Foundation, Staff Directory, Attendance, Payroll)

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Employee Portal — a public-facing, read-only portal for staff to view their records.

## Overview

A public-facing, read-only portal that provides domestic staff with transparent access to their employment records. It allows employees to independently verify their attendance, holiday balance, and payment history using only their registered phone number for access.

**Key Functionality:**
- Simple phone number login (no account needed)
- View current holiday balance
- View attendance summary
- View payment history
- View basic profile information
- Mobile-first, read-only interface

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/employee-portal/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/employee-portal/components/`:

- `EmployeePortal.tsx` — Full portal with login and dashboard

### Data Layer

The components expect these data shapes:

```typescript
interface EmployeePortalProps {
  staff?: StaffProfile
  summary?: StaffSummary
  activity: ActivityItem[]
  isAuthenticating: boolean
  loginError?: string
  onLogin?: (phoneNumber: string) => void
  onLogout?: () => void
  onViewActivityDetail?: (id: string) => void
}

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

You'll need to:
- Implement phone number lookup API
- Aggregate attendance and payment data
- Generate activity timeline
- Ensure read-only access (no mutations)

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onLogin` | Look up employee by phone number |
| `onLogout` | Clear session, return to login |
| `onViewActivityDetail` | Show detail for activity item (optional) |

### Security Considerations

- **No authentication required** — Simple phone number lookup
- **Read-only access** — No edit actions available
- **Rate limiting** — Prevent brute force phone number guessing
- **Data scoping** — Only show data for the specific employee

### Empty States

Implement empty state UI for when no records exist:

- **Phone not found:** Show "No employee found with this phone number"
- **No activity:** Show "No recent activity to display"
- **No payments:** Show "No payment history yet"

## Files to Reference

- `product-plan/sections/employee-portal/README.md` — Feature overview and design intent
- `product-plan/sections/employee-portal/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/employee-portal/components/` — React components
- `product-plan/sections/employee-portal/types.ts` — TypeScript interfaces
- `product-plan/sections/employee-portal/sample-data.json` — Test data
- `product-plan/sections/employee-portal/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Access Portal and View Records

1. Staff member navigates to `/portal`
2. Staff member enters their registered phone number
3. Staff member clicks "View My Records"
4. Dashboard displays with summary cards and activity feed
5. **Outcome:** Staff can see holiday balance, last payment, activity

### Flow 2: Phone Number Not Found

1. Staff member enters unregistered phone number
2. Staff member clicks "View My Records"
3. Error message displays: "No employee found with this phone number"
4. **Outcome:** Staff can try again with correct number

### Flow 3: View Activity Details

1. Staff member is logged in and viewing dashboard
2. Staff member taps on an activity item
3. Detail view shows more information
4. **Outcome:** Staff sees full details of the event

### Flow 4: Logout

1. Staff member clicks "Logout" or "Exit"
2. **Outcome:** Returns to phone number login screen

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Portal accessible at `/portal` (no auth required)
- [ ] Phone number login works
- [ ] Invalid phone number shows error
- [ ] Dashboard displays staff profile
- [ ] Summary cards show holiday balance, last payment, etc.
- [ ] Activity feed shows chronological events
- [ ] Activity items show correct icons and colors
- [ ] Logout returns to login screen
- [ ] Mobile-first responsive design
- [ ] High legibility on small screens
- [ ] Read-only (no edit actions)
- [ ] Empty states display properly
- [ ] Dark mode support
