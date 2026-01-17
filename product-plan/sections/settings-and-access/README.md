# Settings & Access

## Overview

The control center for managing your HomeStaff account and collaborative environments. It allows users to manage multiple households, invite family members or stakeholders with specific roles, and configure administrative restrictions.

## User Flows

- View and manage multiple households
- Switch between households
- Create new households
- Archive households (preserves data)
- Invite members via email
- Assign roles (Admin or Member)
- Change member roles
- Remove members
- Update personal profile

## Components Provided

- `SettingsDashboard.tsx` — Main settings interface with tabs/sections

## Callback Props

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

## Role Permissions

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

## Visual Reference

See screenshots in `product/sections/settings-and-access/` for the target UI design.
