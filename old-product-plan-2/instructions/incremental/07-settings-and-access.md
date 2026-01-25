# Milestone 7: Settings & Access

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

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

Implement Settings & Access — the control center for managing accounts, households, and collaborative access.

## Overview

The control center for managing your HomeStaff account and collaborative environments. It allows users to manage multiple households, invite family members or stakeholders with specific roles, and configure administrative restrictions.

**Key Functionality:**
- View and update personal profile
- Create and manage multiple households
- Switch between households
- Archive households (Admins only)
- Invite members via email
- Assign roles (Admin or Member)
- Manage member permissions
- Remove members or cancel invitations

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/settings-and-access/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/settings-and-access/components/`:

- `SettingsDashboard.tsx` — Main settings page with all sections

### Data Layer

The components expect these data shapes:

```typescript
interface SettingsAndAccessProps {
  userProfile: UserProfile
  households: Household[]
  members: Member[]
  invitations: Invitation[]
  permissions: PermissionsMap
  onUpdateProfile?: (updates: Partial<UserProfile>) => void
  onSwitchHousehold?: (id: string) => void
  onCreateHousehold?: (name: string) => void
  onRenameHousehold?: (id: string, newName: string) => void
  onArchiveHousehold?: (id: string) => void
  onInviteMember?: (email: string, role: 'Admin' | 'Member') => void
  onChangeMemberRole?: (id: string, newRole: 'Admin' | 'Member') => void
  onRemoveMember?: (id: string) => void
  onCancelInvitation?: (id: string) => void
}

interface Household {
  id: string
  name: string
  role: 'Admin' | 'Member'
  status: 'active' | 'archived'
  isPrimary: boolean
}

interface Member {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Member'
  joinedDate: string
  avatarUrl: string | null
}
```

You'll need to:
- Implement household management APIs
- Handle invitation emails
- Enforce role-based permissions
- Manage multi-household context

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onUpdateProfile` | Update user name, email, timezone |
| `onSwitchHousehold` | Change active household context |
| `onCreateHousehold` | Create new household |
| `onRenameHousehold` | Rename existing household |
| `onArchiveHousehold` | Archive household (Admin only) |
| `onInviteMember` | Send invitation email |
| `onChangeMemberRole` | Promote/demote member |
| `onRemoveMember` | Remove member from household |
| `onCancelInvitation` | Cancel pending invitation |

### Empty States

Implement empty state UI for when no records exist:

- **Single household:** Don't show "Switch Household" option
- **No other members:** Show "You're the only member" with invite CTA
- **No pending invitations:** Hide invitations section or show empty state

## Files to Reference

- `product-plan/sections/settings-and-access/README.md` — Feature overview and design intent
- `product-plan/sections/settings-and-access/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/settings-and-access/components/` — React components
- `product-plan/sections/settings-and-access/types.ts` — TypeScript interfaces
- `product-plan/sections/settings-and-access/sample-data.json` — Test data
- `product-plan/sections/settings-and-access/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Update Personal Profile

1. User navigates to Settings
2. User sees personal profile section
3. User edits name or email
4. User clicks "Save"
5. **Outcome:** Profile updated, changes reflected in user menu

### Flow 2: Create New Household

1. User clicks "Create Household" button
2. User enters household name
3. User clicks "Create"
4. **Outcome:** New household created, user becomes Admin

### Flow 3: Invite Member

1. User clicks "Invite Member" button
2. User enters email address
3. User selects role (Admin or Member)
4. User clicks "Send Invitation"
5. **Outcome:** Invitation email sent, appears in pending list

### Flow 4: Manage Member Roles

1. User sees member list with roles
2. User clicks "Change Role" on a member
3. User selects new role
4. **Outcome:** Member role updated

### Flow 5: Switch Household

1. User clicks on household in list
2. **Outcome:** App context switches to selected household

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Profile section displays and allows edits
- [ ] Household list displays correctly
- [ ] Create household flow works
- [ ] Rename household works
- [ ] Archive household works (Admin only)
- [ ] Switch household works
- [ ] Member list displays with roles
- [ ] Invite member flow works
- [ ] Change member role works
- [ ] Remove member works with confirmation
- [ ] Pending invitations display
- [ ] Cancel invitation works
- [ ] Permissions overview shows role capabilities
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Dark mode support
