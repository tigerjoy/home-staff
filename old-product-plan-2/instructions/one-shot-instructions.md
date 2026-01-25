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

1. **Landing Page** — Marketing page showcasing product features, benefits, and call-to-action for new users.
2. **User Authentication** — Registration and login flows supporting Social Auth (Google, Facebook) and email/password.
3. **Staff Directory** — Manage employee profiles, roles, contact details, and documents.
4. **Attendance & Holidays** — Track daily presence, manage absences, and configure recurring holiday rules.
5. **Payroll & Finance** — Handle salary calculation, advances, bonuses, and payment history.
6. **Settings & Access** — User registration, household management, and member invitations.
7. **Onboarding & Setup** — Guide new users through the initial configuration of their household and staff.
8. **Employee Portal** — Public-facing view for staff to check their own records via phone number.

### Design System

**Colors:**
- Primary: `amber` — buttons, links, key accents
- Secondary: `orange` — tags, highlights, secondary elements
- Neutral: `stone` — backgrounds, text, borders

**Typography:**
- Heading: Nunito Sans
- Body: Nunito Sans
- Mono: Fira Code

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

| Route | Section | Shell |
|-------|---------|-------|
| `/` | Landing Page | No |
| `/login` | User Authentication | No |
| `/register` | User Authentication | No |
| `/onboarding` | Onboarding & Setup | No |
| `/portal` | Employee Portal | No |
| `/staff` | Staff Directory | Yes (Default) |
| `/attendance` | Attendance & Holidays | Yes |
| `/payroll` | Payroll & Finance | Yes |
| `/settings` | Settings & Access | Yes |

### 4. Application Shell

Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with dropdown

---

# Milestone 2: Landing Page

## Goal

Implement the Landing Page — a marketing page showcasing product features and call-to-action.

## Components

- `LandingPage.tsx`, `Navbar.tsx`, `HeroSection.tsx`, `ProblemsSection.tsx`
- `FeaturesSection.tsx`, `TestimonialsSection.tsx`, `PricingSection.tsx`
- `FooterSection.tsx`, `StickyCtaBar.tsx`

See `product-plan/sections/landing-page/` for all files.

---

# Milestone 3: User Authentication

## Goal

Implement User Authentication — registration and login with Social Auth and email/password.

## Components

- `UserAuthentication.tsx`, `SocialAuthButtons.tsx`, `LoginFormComponent.tsx`
- `RegisterFormComponent.tsx`, `VerificationFormComponent.tsx`, `ForgotPasswordComponent.tsx`

See `product-plan/sections/user-authentication/` for all files.

---

# Milestone 4: Staff Directory

## Goal

Implement the Staff Directory — manage employee profiles with a multi-step wizard.

## Components

- `StaffDirectory.tsx`, `SummaryCards.tsx`, `EmployeeCard.tsx`, `EmployeeTable.tsx`
- `EmployeeDetail.tsx`, `EmployeeForm.tsx`, `BasicInfoStep.tsx`, `RoleStep.tsx`
- `DocumentsStep.tsx`, `SalaryStep.tsx`, `CustomFieldsStep.tsx`

See `product-plan/sections/staff-directory/` for all files.

---

# Milestone 5: Attendance & Holidays

## Goal

Implement Attendance & Holidays — "present by default" tracking and holiday management.

## Components

- `AttendanceDashboard.tsx`, `AttendanceCalendar.tsx`
- `HolidayRuleModal.tsx`, `InactivityModal.tsx`

See `product-plan/sections/attendance-and-holidays/` for all files.

---

# Milestone 6: Payroll & Finance

## Goal

Implement Payroll & Finance — salary calculations, advances, and payment tracking.

## Components

- `PayrollDashboard.tsx`, `CalculationBreakdown.tsx`, `SettlementWorkspace.tsx`
- `PaymentLedger.tsx`, `ReceiptComponents.tsx`

See `product-plan/sections/payroll-and-finance/` for all files.

---

# Milestone 7: Settings & Access

## Goal

Implement Settings & Access — account, household, and member management.

## Components

- `SettingsDashboard.tsx`

See `product-plan/sections/settings-and-access/` for all files.

---

# Milestone 8: Onboarding & Setup

## Goal

Implement Onboarding & Setup — multi-step wizard for new users.

## Components

- `OnboardingWizard.tsx`

See `product-plan/sections/onboarding-and-setup/` for all files.

---

# Milestone 9: Employee Portal

## Goal

Implement the Employee Portal — public-facing read-only portal for staff.

## Components

- `EmployeePortal.tsx`

See `product-plan/sections/employee-portal/` for all files.

---

## Implementation Checklist

- [ ] **Foundation:** Design tokens, data model, routing, shell
- [ ] **Landing Page:** Marketing page with all sections
- [ ] **User Authentication:** Login, register, Social Auth, password reset
- [ ] **Staff Directory:** Employee CRUD, multi-step wizard, documents
- [ ] **Attendance & Holidays:** Present-by-default, holiday rules, inactivity
- [ ] **Payroll & Finance:** Calculations, settlements, advances, receipts
- [ ] **Settings & Access:** Households, members, invitations
- [ ] **Onboarding & Setup:** New user wizard
- [ ] **Employee Portal:** Phone number login, read-only dashboard

For detailed instructions on each milestone, see the individual files in `product-plan/instructions/incremental/`.
