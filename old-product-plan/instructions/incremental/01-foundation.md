# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Key colors:**
- Primary: `amber` — buttons, links, active states
- Secondary: `orange` — gradients, accents
- Neutral: `stone` — backgrounds, text, borders

**Typography:**
- Headings & Body: Nunito Sans
- Monospace: Fira Code

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core entities to define:**
- User, Household, Member, Invitation
- Employee (with nested types: PhoneNumber, Address, EmploymentRecord, etc.)
- LeaveRecord, Holiday, HolidayRule, InactivityPeriod
- PayrollRecord, Advance, LedgerEntry
- OnboardingStep, OnboardingConfig
- ActivityItem (for portal)

### 3. Routing Structure

Create routes for each section:

| Route | Section | Notes |
|-------|---------|-------|
| `/staff` | Staff Directory | Default view after login |
| `/staff/:id` | Employee Detail | Individual profile |
| `/staff/new` | Add Employee | Multi-step form |
| `/staff/:id/edit` | Edit Employee | Multi-step form |
| `/attendance` | Attendance & Holidays | Calendar and tracking |
| `/payroll` | Payroll & Finance | Dashboard and ledger |
| `/settings` | Settings & Access | Household and members |
| `/onboarding` | Onboarding | Full-screen wizard (no shell) |
| `/portal` | Employee Portal | Public, no auth required |

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar and dropdown

**Navigation Items:**
```typescript
const navigationItems = [
  { label: 'Staff Directory', href: '/staff', icon: Users, isActive: true },
  { label: 'Attendance & Holidays', href: '/attendance', icon: Calendar },
  { label: 'Payroll & Finance', href: '/payroll', icon: Wallet },
  { label: 'Settings & Access', href: '/settings', icon: Settings },
]
```

**Wire Up Navigation:**
- Connect `onNavigate` to your router (React Router, Next.js, etc.)
- Set `isActive` based on current route

**User Menu:**
The user menu expects:
- `user.name` — Display name
- `user.avatarUrl` — Optional avatar image
- `household.name` — Current household name
- `onLogout` — Logout callback
- `onSwitchHousehold` — Switch household callback
- `onAccountSettings` — Navigate to settings

**Responsive Behavior:**
- Desktop (≥1024px): Full sidebar always visible
- Tablet (768px–1023px): Collapsed sidebar
- Mobile (<768px): Hamburger menu, slide-out overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Google Fonts are loading (Nunito Sans, Fira Code)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation sidebar
- [ ] Navigation links work and highlight active route
- [ ] User menu shows user info and dropdown works
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Dark mode toggle works (if implementing)
