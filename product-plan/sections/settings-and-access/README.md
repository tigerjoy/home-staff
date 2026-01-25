# Settings & Access

## Overview

The control center for managing your HomeStaff account and collaborative environments. This section allows users to manage multiple households, invite family members or stakeholders with specific roles, and configure administrative restrictions. It ensures that data remains secure and accessible only to authorized individuals.

## Key Functionality

- **Household Management:** Create, rename, and switch between different households.
- **Archive Household:** Soft-delete households to remove them from active use while preserving historical records.
- **Member Invitations:** Invite others via email to join a household.
- **Role Assignment:** Define user permissions with roles (Admin vs. Member).
- **Access Control:** Admins can manage payroll visibility and member access for other participants.
- **Personal Profile:** Update individual user settings including name, email, and security preferences.

## User Flows

### Creating and Switching Households
1. User clicks the **Household Switcher** in the sidebar or settings.
2. User selects "Create New Household".
3. User enters the household name and saves.
4. User can then switch between households; the app context (staff, payroll, attendance) updates instantly.

### Inviting a Family Member
1. User navigates to the **Members** tab in Settings.
2. User clicks "Invite Member".
3. User enters the invitee's email and selects a role (e.g., "Member").
4. If the user already exists in HomeStaff, they are added; otherwise, an invitation link is generated.
5. The member appears as "Pending" until they accept.

### Managing Permissions
1. Admin user identifies a member in the **Members Table**.
2. Admin clicks "Change Role" to upgrade or downgrade access.
3. Admin can toggle sensitive permissions (e.g., "Can View Payroll") for specific members.

## Design Decisions

- **Admin Superiority:** Only Admins can archive households, manage payroll settings, or invite/remove members.
- **Non-Destructive Archiving:** Households are never permanently deleted to ensure financial and employment history is preserved for legal/compliance reasons.
- **Context-Aware Settings:** Most settings (Members, Household Name) are specific to the active household, while Profile settings are global to the User account.

## Components Provided

| Component | Description |
|-----------|-------------|
| `SettingsDashboard` | Main layout with tabbed navigation (Household, Members, Profile) |
| `HouseholdList` | List of households with "Create" and "Switch" actions |
| `MembersTable` | List of household participants with role management |
| `InviteModal` | Form for inviting new members via email |
| `PermissionsOverview` | Visual guide to what different roles can access |
| `ProfileForm` | User account settings interface |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onCreateHousehold` | Called when a new household is created |
| `onSwitchHousehold` | Called when the user switches their active context |
| `onArchiveHousehold` | Called when an Admin archives a household |
| `onInviteMember` | Called when an invitation is sent |
| `onChangeRole` | Called when a member's role is updated |
| `onRemoveMember` | Called when a member is removed from the household |
| `onUpdateProfile` | Called when user saves personal settings |

## Empty States

- **No Members:** (Rare) Shows the current user as the sole member with an "Invite" CTA.
- **No Other Households:** Shows "You only belong to one household" in the switcher.

## Visual Reference

See `SettingsDashboardPreview.png` for the target UI design.
