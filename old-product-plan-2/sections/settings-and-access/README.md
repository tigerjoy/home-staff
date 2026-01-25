# Settings & Access

## Overview

The control center for managing your HomeStaff account and collaborative environments. Allows users to manage multiple households, invite family members with specific roles, and configure administrative restrictions.

## User Flows

- View and update personal profile
- Create and manage multiple households
- Switch between households
- Archive households (Admins only)
- Invite members via email
- Assign roles (Admin or Member)
- Manage member permissions
- Remove members or cancel invitations

## Components Provided

| Component | Description |
|-----------|-------------|
| `SettingsDashboard` | Main settings page with all sections |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onUpdateProfile` | Update user name, email, timezone |
| `onSwitchHousehold` | Change active household context |
| `onCreateHousehold` | Create new household |
| `onRenameHousehold` | Rename existing household |
| `onArchiveHousehold` | Archive household (Admin only) |
| `onInviteMember` | Send invitation email |
| `onChangeMemberRole` | Promote/demote member |
| `onRemoveMember` | Remove from household |
| `onCancelInvitation` | Cancel pending invitation |

## Design Notes

- Sectioned layout: Profile, Households, Members
- Role badges (Admin/Member) on household and member cards
- Permissions overview shows what each role can do
- Pending invitations displayed separately
