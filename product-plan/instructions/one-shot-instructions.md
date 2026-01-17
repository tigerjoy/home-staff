# HomeStaff — Complete Implementation Instructions

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

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

## Product Overview

A digital household workforce management and payroll platform designed for employers to manage domestic staff. It simplifies tracking employee records, automates attendance with "present by default" logic, and maintains a transparent financial history of salaries, advances, and bonuses.

### Planned Sections

1. **Staff Directory** — Manage employee profiles, roles, contact details, and documents.
2. **Attendance & Holidays** — Track daily presence, manage absences, and configure recurring holiday rules.
3. **Payroll & Finance** — Handle salary calculation, advances, bonuses, and payment history.
4. **Settings & Access** — User registration, household management, and member invitations.
5. **Onboarding & Setup** — Guide new users through the initial configuration of their household and staff.
6. **Employee Portal** — Public-facing view for staff to check their own records via phone number.

### Design System

- **Primary:** `amber` — buttons, links, active states
- **Secondary:** `orange` — gradients, accents
- **Neutral:** `stone` — backgrounds, text, borders
- **Typography:** Nunito Sans (headings/body), Fira Code (mono)

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:
- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Data Model Types

Create TypeScript interfaces for your core entities:
- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

### 3. Routing Structure

| Route | Section |
|-------|---------|
| `/staff` | Staff Directory (default) |
| `/staff/:id` | Employee Detail |
| `/staff/new` | Add Employee |
| `/staff/:id/edit` | Edit Employee |
| `/attendance` | Attendance & Holidays |
| `/payroll` | Payroll & Finance |
| `/settings` | Settings & Access |
| `/onboarding` | Onboarding (no shell) |
| `/portal` | Employee Portal (public) |

### 4. Application Shell

Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with dropdown

## Done When

- [ ] Design tokens configured
- [ ] Google Fonts loading
- [ ] Data model types defined
- [ ] Routes exist for all sections
- [ ] Shell renders with navigation
- [ ] Responsive layout works

---

# Milestone 2: Staff Directory

## Goal

Implement the Staff Directory feature — manage employee profiles, roles, contact details, and documents.

## What to Implement

Copy components from `product-plan/sections/staff-directory/components/`:
- `StaffDirectory.tsx`, `SummaryCards.tsx`, `EmployeeCard.tsx`, `EmployeeTable.tsx`
- `EmployeeDetail.tsx`, `EmployeeForm.tsx`, and form step components

### Key Features

- Card grid and table views with toggle
- Search and filter by name, role, status
- Multi-step form wizard (5 steps)
- Full profile page with all details
- Document upload and management
- Custom properties and notes
- Archive/restore functionality

## Done When

- [ ] Staff directory displays with summary cards
- [ ] View toggle and search/filters work
- [ ] Multi-step form creates employees
- [ ] Employee detail shows all information
- [ ] Documents, notes, custom fields work
- [ ] Archive/restore works

---

# Milestone 3: Attendance & Holidays

## Goal

Implement attendance tracking with "present by default" logic.

## What to Implement

Copy components from `product-plan/sections/attendance-and-holidays/components/`:
- `AttendanceDashboard.tsx`, `AttendanceCalendar.tsx`
- `HolidayRuleModal.tsx`, `InactivityModal.tsx`

### Key Features

- Daily attendance sheet (employees assumed present)
- Mark absences by clicking
- Configure holiday rules (fixed or recurring)
- Track running holiday balance
- Mark inactive periods for extended absences
- Calendar view with history

## Done When

- [ ] Attendance dashboard displays employees
- [ ] Click to mark absence works
- [ ] Holiday rules modal works
- [ ] Holiday balance updates correctly
- [ ] Inactivity periods work
- [ ] Calendar navigation works

---

# Milestone 4: Payroll & Finance

## Goal

Implement payroll calculation, settlements, and payment tracking.

## What to Implement

Copy components from `product-plan/sections/payroll-and-finance/components/`:
- `PayrollDashboard.tsx`, `CalculationBreakdown.tsx`
- `SettlementWorkspace.tsx`, `PaymentLedger.tsx`, `ReceiptComponents.tsx`

### Key Features

- Monthly payroll dashboard with totals
- Detailed calculation breakdown
- Settlement decisions (penalize/carry forward, encash/lapse)
- Advance recording and tracking
- Payment finalization with receipt upload
- Searchable payment ledger

## Done When

- [ ] Payroll dashboard shows summary
- [ ] Calculation breakdown accurate
- [ ] Settlement workspace works
- [ ] Advances and bonuses work
- [ ] Payment finalization works
- [ ] Ledger shows history with search

---

# Milestone 5: Settings & Access

## Goal

Implement household management and member access control.

## What to Implement

Copy components from `product-plan/sections/settings-and-access/components/`:
- `SettingsDashboard.tsx`

### Key Features

- View and switch households
- Create/rename/archive households
- Invite members via email
- Assign roles (Admin/Member)
- Manage member permissions
- Update personal profile

## Done When

- [ ] Household management works
- [ ] Member invitations work
- [ ] Role changes work
- [ ] Permission restrictions enforced
- [ ] Profile updates work

---

# Milestone 6: Onboarding & Setup

## Goal

Implement new user onboarding wizard.

## What to Implement

Copy components from `product-plan/sections/onboarding-and-setup/components/`:
- `OnboardingWizard.tsx`

### Key Features

- Full-screen wizard (no shell)
- Progress stepper
- Required/optional step handling
- Progress saving for resumption
- Transition to main app on completion

### Steps

1. Name Your Household (required)
2. Set Global Defaults (optional)
3. Add Your First Employee (optional)
4. You're All Set! (required)

## Done When

- [ ] Full-screen wizard works
- [ ] Progress stepper shows state
- [ ] Skip optional steps works
- [ ] Progress saves and resumes
- [ ] Completion redirects to app

---

# Milestone 7: Employee Portal

## Goal

Implement public read-only portal for staff.

## What to Implement

Copy components from `product-plan/sections/employee-portal/components/`:
- `EmployeePortal.tsx`

### Key Features

- Phone number login (no password)
- Read-only dashboard
- Holiday balance and absences
- Payment history
- Activity timeline
- Mobile-first design

## Done When

- [ ] Portal accessible without auth
- [ ] Phone login works
- [ ] Dashboard shows employee data
- [ ] Activity feed works
- [ ] Mobile responsive
- [ ] Read-only (no edit actions)

---

*Generated by Design OS*
