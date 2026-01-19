# Milestone 5: Settings & Access

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete

## Goal

Implement the Settings & Access feature — manage households, invite members, assign roles, and configure user profile.

## Overview

The Settings section is the control center for managing your HomeStaff account and collaborative environments. It enables multi-user households where family members or stakeholders can share access with appropriate permissions.

**Key Functionality:**
- View and manage multiple households
- Switch between households
- Create new households
- Archive households (preserves data)
- Invite members via email
- Assign roles (Admin or Member)
- Manage member permissions
- Update personal profile

## Recommended Approach: Test-Driven Development

See `product-plan/sections/settings-and-access/tests.md` for test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/settings-and-access/components/`:

- `SettingsDashboard.tsx` — Main settings interface with tabs/sections

### Data Layer

Key types from `types.ts`:

```typescript
interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  timezone: string
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

interface Invitation {
  id: string
  email: string
  role: 'Admin' | 'Member'
  sentDate: string
  status: 'pending' | 'expired'
}

interface PermissionsMap {
  Admin: string[]
  Member: string[]
}
```

### Callbacks

| Callback | Description |
|----------|-------------|
| `onUpdateProfile(updates)` | Update user name, email, avatar |
| `onSwitchHousehold(id)` | Change current household context |
| `onCreateHousehold(name)` | Create new household |
| `onRenameHousehold(id, newName)` | Rename existing household |
| `onArchiveHousehold(id)` | Archive household (Admin only) |
| `onInviteMember(email, role)` | Send invitation |
| `onChangeMemberRole(id, newRole)` | Change member's role |
| `onRemoveMember(id)` | Remove member from household |
| `onCancelInvitation(id)` | Cancel pending invitation |

### Role Permissions

**Admin:**
- Manage Staff Directory
- Track Attendance
- Manage Payroll & Finance
- Invite & Remove Members
- Edit Household Settings
- Archive Household

**Member:**
- View Staff Directory
- Track Attendance
- View Reports

### Empty States

- **No other members:** "You're the only member. Invite others to collaborate."
- **No pending invitations:** "No pending invitations"
- **No other households:** "Create a new household for another property"

## Files to Reference

- `product-plan/sections/settings-and-access/README.md`
- `product-plan/sections/settings-and-access/tests.md`
- `product-plan/sections/settings-and-access/components/`
- `product-plan/sections/settings-and-access/types.ts`
- `product-plan/sections/settings-and-access/sample-data.json`

## Expected User Flows

### Flow 1: Invite a Member

1. User navigates to `/settings`
2. User clicks "Invite Member"
3. User enters email and selects role
4. User clicks "Send Invitation"
5. **Outcome:** Invitation created, email sent (if configured)

### Flow 2: Switch Household

1. User opens user menu or household switcher
2. User sees list of households they belong to
3. User clicks on different household
4. **Outcome:** App context switches, all data reloads for new household

### Flow 3: Change Member Role

1. User views members list
2. User clicks role dropdown for a member
3. User selects new role (Admin/Member)
4. **Outcome:** Member's permissions updated

### Flow 4: Archive Household

1. Admin clicks "Archive Household"
2. Confirmation modal appears with warning
3. Admin confirms
4. **Outcome:** Household archived, user redirected to another household

## Done When

- [ ] Tests written and passing
- [ ] Settings dashboard displays user profile
- [ ] Household list shows all user's households
- [ ] Household switching works
- [ ] Create/rename household works
- [ ] Archive household works (Admin only)
- [ ] Members table displays correctly
- [ ] Invite member modal works
- [ ] Role changes work
- [ ] Remove member works
- [ ] Cancel invitation works
- [ ] Permission restrictions enforced
- [ ] Empty states display properly
- [ ] Responsive on mobile
