# Milestone 7: Settings & Access

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions (see `product-plan/sections/settings-and-access/tests.md`)

**What you need to build:**
- Multi-tenancy logic (Household management and switching)
- Invitation system with email triggers
- Role-based access control (RBAC) for Admin vs Member roles
- Personal profile update logic

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your backend and state management
- **DO** replace sample data with real data from your backend
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Manage account settings, collaborative household environments, and user permissions.

## Overview
The control center for managing the HomeStaff environment. It allows users to handle multiple households, invite family members or stakeholders with specific roles, and manage their personal profile.

**Key Capabilities:**
- Household management (Create, Switch, Rename, Archive)
- Member invitations via email
- Role-based permissions (Admin vs Member)
- Access control for sensitive sections (Payroll & Finance)
- Personal profile and security settings

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/settings-and-access/tests.md`. Start by testing the household switching logic and member invitation form validation.

## What to Implement

### Components
Copy these from `product-plan/sections/settings-and-access/components/`:
- `SettingsDashboard.tsx` — Main settings interface with tabs for Household, Members, and Profile
- Additional components for Modals (Invite Member, Create Household) as defined in the dashboard

### Data Layer
- **Households:** Implement a many-to-many relationship between Users and Households.
- **Invitations:** A table for pending invites (email, household_id, role, token).
- **Roles:** Define permissions where Admins can manage members and archive households, while Members have read-only or restricted access.

### Callbacks
- `onCreateHousehold`: Create a new household and set it as active.
- `onSwitchHousehold`: Change the current active household context.
- `onInviteMember`: Generate an invitation link or add an existing user to the household.
- `onChangeRole`: Update a member's role (Admin/Member).
- `onRemoveMember`: Remove a member's access to the current household.
- `onUpdateProfile`: Save user name and security settings.

### Empty States
Show "No Members Invited" in the members table for a single-user household, with a call-to-action to invite a family member.

## Files to Reference
- `product-plan/sections/settings-and-access/spec.md` — UI requirements
- `product-plan/sections/settings-and-access/types.ts` — Prop definitions
- `product-plan/data-model/types.ts` — Household and Invitation entities

## Expected User Flows
1. **The Collaboration Flow:** User opens Members tab → Clicks "Invite" → Enters email and selects "Admin" → Invitation is sent → New member appears as "Pending" until they accept.
2. **The Multi-Household Flow:** User clicks "Create New Household" → Names it "Beach House" → App switches context to Beach House → User can now add separate staff for this location.
3. **The Role Management Flow:** Admin changes a member's role from "Member" to "Admin" → That user gains access to the Payroll & Finance section.

## Done When
- [ ] Users can create and switch between multiple households
- [ ] Household archiving works (soft-delete)
- [ ] Member invitations are sent and tracked correctly
- [ ] Role-based access control is enforced across the application
- [ ] Profile updates are persisted
- [ ] All tests in `tests.md` pass
