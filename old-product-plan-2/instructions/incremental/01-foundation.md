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

**Color Palette:**
- Primary: `amber` — buttons, links, key accents
- Secondary: `orange` — tags, highlights, secondary elements
- Neutral: `stone` — backgrounds, text, borders

**Typography:**
- Heading: Nunito Sans
- Body: Nunito Sans
- Mono: Fira Code

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core Entities:**
- User
- Household
- Member
- Invitation
- Employee
- Attendance Record (Absence)
- Inactivity Period
- Holiday Rule
- Payroll Item

### 3. Routing Structure

Create routes for each section:

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

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar navigation
- `MainNav.tsx` — Navigation component with active state styling
- `UserMenu.tsx` — User menu with avatar and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:

| Label | Route | Icon |
|-------|-------|------|
| Staff Directory | `/staff` | Users |
| Attendance & Holidays | `/attendance` | Calendar |
| Payroll & Finance | `/payroll` | Wallet |
| Settings & Access | `/settings` | Settings |

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional, shows initials fallback)
- Current household name
- Logout callback
- Switch Household callback
- Account Settings callback

**Responsive Behavior:**
- Desktop (≥1024px): Full sidebar always visible, no header
- Tablet (768px–1023px): Sidebar collapses to icons only, expands on hover
- Mobile (<768px): Sidebar hidden, hamburger menu in sticky header, sidebar slides in as overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, typography)
- [ ] Google Fonts are imported (Nunito Sans, Fira Code)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] Active navigation state is highlighted
- [ ] User menu shows user info and household name
- [ ] User menu dropdown works (Switch Household, Account Settings, Logout)
- [ ] Responsive on mobile (hamburger menu, slide-out sidebar)
- [ ] Dark mode support works
