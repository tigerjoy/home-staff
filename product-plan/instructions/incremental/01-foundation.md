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

**Colors:**
- Primary: `amber` — Buttons, links, key accents
- Secondary: `orange` — Tags, highlights, gradients
- Neutral: `stone` — Backgrounds, text, borders

**Typography:**
- Heading & Body: Nunito Sans
- Code/Mono: Fira Code

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/README.md` for entity relationships
- See `product-plan/data-model/types.ts` for interface definitions

**Core entities to define:**
- User, Household, Member, Invitation
- Employee, Employment (Monthly vs Ad-hoc)
- AttendanceRecord, InactivityPeriod
- HolidayRule, PayrollItem

### 3. Routing Structure

Create placeholder routes for each section:

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

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar
- `MainNav.tsx` — Navigation component with nav items
- `UserMenu.tsx` — User menu with avatar and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:
- Staff Directory → `/staff`
- Attendance & Holidays → `/attendance`
- Payroll & Finance → `/payroll`
- Settings & Access → `/settings`

**User Menu:**

The user menu expects:
- User name
- User avatar URL (optional, falls back to initials)
- Current household name
- Logout callback
- Switch household callback

**Responsive Behavior:**
- Desktop (≥1024px): Full sidebar always visible
- Tablet (768px–1023px): Sidebar collapses to icons only
- Mobile (<768px): Sidebar hidden, hamburger menu in header

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts loaded)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation sidebar
- [ ] Navigation links to correct routes
- [ ] User menu shows user info
- [ ] Active nav item is highlighted
- [ ] Responsive layout works on mobile/tablet/desktop
