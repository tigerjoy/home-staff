# HomeStaff — Full Implementation Instructions

> **Provide alongside:** `product-overview.md`

This document combines all milestones for a full implementation in one session.

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section

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
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

# Milestone 1: Foundation

## Goal
Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens
Configure your styling system with the tokens from:
- `product-plan/design-system/tokens.css`
- `product-plan/design-system/tailwind-colors.md`
- `product-plan/design-system/fonts.md`

**Colors:** Primary: `amber`, Secondary: `orange`, Neutral: `stone`
**Typography:** Heading & Body: Nunito Sans, Code/Mono: Fira Code

### 2. Data Model Types
Create TypeScript interfaces from `product-plan/data-model/`:
- User, Household, Member, Invitation
- Employee, Employment (Monthly vs Ad-hoc)
- AttendanceRecord, InactivityPeriod
- HolidayRule, PayrollItem

### 3. Routing Structure
| Route | Section | Access |
|-------|---------|--------|
| `/` | Landing Page | Public |
| `/login`, `/register` | User Authentication | Public |
| `/staff` | Staff Directory | Authenticated (default) |
| `/attendance` | Attendance & Holidays | Authenticated |
| `/payroll` | Payroll & Finance | Authenticated |
| `/settings` | Settings & Access | Authenticated |
| `/onboarding` | Onboarding & Setup | Authenticated (new users) |
| `/portal` | Employee Portal | Public |

### 4. Application Shell
Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx`, `MainNav.tsx`, `UserMenu.tsx`

---

# Milestone 2: Landing Page

## Goal
Create a public-facing marketing presence that introduces the product and drives registration.

## Components
Copy from `product-plan/sections/landing-page/components/`:
- `LandingPage.tsx`, `Navbar.tsx`, `HeroSection.tsx`
- `ProblemsSection.tsx`, `FeaturesSection.tsx`, `TestimonialsSection.tsx`
- `PricingSection.tsx`, `FooterSection.tsx`, `StickyCtaBar.tsx`

## Callbacks
- `onGetStarted`: Redirect to `/register`
- `onLogin`: Redirect to `/login`
- `onNavClick`: Implement smooth scroll to section IDs

---

# Milestone 3: User Authentication

## Goal
Create a secure, multi-method authentication system.

## Components
Copy from `product-plan/sections/user-authentication/components/`:
- `UserAuthentication.tsx`, `LoginFormComponent.tsx`, `RegisterFormComponent.tsx`
- `SocialAuthButtons.tsx`, `VerificationFormComponent.tsx`, `ForgotPasswordComponent.tsx`

## Callbacks
- `onEmailLogin`, `onEmailRegister`: Handle email/password auth
- `onSocialLogin`: Handle OAuth (Google, Apple)
- `onSendVerification`, `onVerifyCode`: Handle email verification
- `onForgotPassword`, `onResetPassword`: Handle password recovery

---

# Milestone 4: Staff Directory

## Goal
Establish the central hub for managing household staff.

## Components
Copy from `product-plan/sections/staff-directory/components/`:
- `StaffDirectory.tsx`, `SummaryCards.tsx`
- `EmployeeCard.tsx`, `EmployeeTable.tsx`, `EmployeeDetail.tsx`
- `EmployeeForm.tsx`, `BasicInfoStep.tsx`, `RoleStep.tsx`
- `DocumentsStep.tsx`, `SalaryStep.tsx`, `CustomFieldsStep.tsx`

## Key Features
- Toggleable Card and Table views
- Multi-step "Add Staff" wizard
- "Link Existing" flow for cross-household employees
- Search and filtering

## Callbacks
- `onAddStaff`, `onSaveEmployee`, `onArchiveEmployee`
- `onViewDetail`, `onUploadDocument`

---

# Milestone 5: Attendance & Holidays

## Goal
Manage staff attendance and holiday balances for Monthly employees.

## Components
Copy from `product-plan/sections/attendance-and-holidays/components/`:
- `AttendanceDashboard.tsx`, `AttendanceCalendar.tsx`
- `HolidayRuleModal.tsx`, `InactivityModal.tsx`

## Key Features
- "Present by default" tracking system
- Holiday entitlement and balance management
- Cross-household absence propagation
- Inactivity period management

## Callbacks
- `onMarkAbsence`, `onMarkInactive`
- `onSaveHolidayRule`, `onToggleAutoMark`

---

# Milestone 6: Payroll & Finance

## Goal
Automate monthly payroll and manage all staff financial transactions.

## Components
Copy from `product-plan/sections/payroll-and-finance/components/`:
- `PayrollDashboard.tsx`, `CalculationBreakdown.tsx`
- `SettlementWorkspace.tsx`, `PaymentLedger.tsx`, `ReceiptComponents.tsx`

## Key Features
- Monthly salary calculation engine
- Settlement workspace for holiday excess/unused
- Advance management and repayment
- Ad-hoc payment recording
- Receipt upload support

## Callbacks
- `onProcessPayroll`, `onRecordAdvance`
- `onRecordAdHocPayment`, `onSettleHolidays`, `onUploadReceipt`

---

# Milestone 7: Settings & Access

## Goal
Manage account settings, households, and user permissions.

## Components
Copy from `product-plan/sections/settings-and-access/components/`:
- `SettingsDashboard.tsx` and related modals

## Key Features
- Multi-household management
- Member invitations via email
- Role-based permissions (Admin vs Member)
- Profile settings

## Callbacks
- `onCreateHousehold`, `onSwitchHousehold`
- `onInviteMember`, `onChangeRole`, `onRemoveMember`
- `onUpdateProfile`

---

# Milestone 8: Onboarding & Setup

## Goal
Guide new users through initial household and employee setup.

## Components
Copy from `product-plan/sections/onboarding-and-setup/components/`:
- `OnboardingWizard.tsx` and step components

## Key Features
- Full-screen, distraction-free wizard
- Progress persistence
- Mandatory household initialization
- Optional first employee setup

## Callbacks
- `onNext`, `onSkip`, `onFinish`, `onSaveStep`

---

# Milestone 9: Employee Portal

## Goal
Provide a transparent, mobile-accessible portal for staff to view their records.

## Components
Copy from `product-plan/sections/employee-portal/components/`:
- `EmployeePortal.tsx` and related components

## Key Features
- Phone-number based access
- Multi-household dashboard
- Monthly vs Ad-hoc conditional display
- Activity feed

## Callbacks
- `onLogin(phoneNumber)`, `onSelectHousehold`, `onSwitchHousehold`

---

## Implementation Order

For best results, implement in this order:

1. **Foundation** — Design tokens, types, routing, shell
2. **Landing Page** — Public marketing page
3. **User Authentication** — Login/register flow
4. **Staff Directory** — Core employee management
5. **Attendance & Holidays** — Time tracking
6. **Payroll & Finance** — Financial management
7. **Settings & Access** — Multi-tenancy and permissions
8. **Onboarding & Setup** — New user experience
9. **Employee Portal** — Staff-facing view

## Files to Reference

- `product-plan/product-overview.md` — Product summary
- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/` — Application shell
- `product-plan/sections/[section]/` — Section components, types, and tests
