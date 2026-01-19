# Test Instructions: Settings & Access

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test account settings, household management, and member access control.

---

## User Flow Tests

### Flow 1: View Settings Dashboard

**Scenario:** User views settings page

**Setup:**
- Provide user profile, households, members, invitations

**Steps:**
1. Navigate to `/settings`

**Expected Results:**
- [ ] Profile section shows: Name, Email, Timezone
- [ ] Households list shows all user's households
- [ ] Current household is highlighted
- [ ] Members table shows household members
- [ ] Pending invitations are listed

---

### Flow 2: Update Profile

**Scenario:** User updates their name

**Setup:**
- Mock `onUpdateProfile` callback

**Steps:**
1. Click "Edit" on profile section
2. Change name to "Alex Smith"
3. Click "Save"

**Expected Results:**
- [ ] `onUpdateProfile` is called with { name: "Alex Smith" }
- [ ] Profile displays updated name
- [ ] Success message appears

---

### Flow 3: Create New Household

**Scenario:** User creates a new household

**Setup:**
- Mock `onCreateHousehold` callback

**Steps:**
1. Click "Create Household" button
2. Enter "Beach House"
3. Click "Create"

**Expected Results:**
- [ ] `onCreateHousehold` is called with "Beach House"
- [ ] New household appears in list
- [ ] User is Admin of new household

---

### Flow 4: Switch Household

**Scenario:** User switches to different household

**Setup:**
- Provide multiple households
- Mock `onSwitchHousehold` callback

**Steps:**
1. Click on different household in list

**Expected Results:**
- [ ] `onSwitchHousehold` is called with household ID
- [ ] (In real app) App context switches to selected household

---

### Flow 5: Invite Member

**Scenario:** Admin invites new member

**Setup:**
- User has Admin role
- Mock `onInviteMember` callback

**Steps:**
1. Click "Invite Member" button
2. Enter email "newuser@example.com"
3. Select role "Member"
4. Click "Send Invitation"

**Expected Results:**
- [ ] `onInviteMember` is called with email and role
- [ ] Invitation appears in pending list
- [ ] Success message about email being sent

---

### Flow 6: Change Member Role

**Scenario:** Admin promotes member to Admin

**Setup:**
- User has Admin role
- Mock `onChangeMemberRole` callback

**Steps:**
1. Click "Change Role" on a Member
2. Select "Admin"

**Expected Results:**
- [ ] `onChangeMemberRole` is called with memberId and "Admin"
- [ ] Member's role badge updates to "Admin"

---

### Flow 7: Remove Member

**Scenario:** Admin removes a member

**Setup:**
- Mock `onRemoveMember` callback

**Steps:**
1. Click "Remove" on a member
2. Confirm in dialog

**Expected Results:**
- [ ] Confirmation dialog appears
- [ ] `onRemoveMember` is called with member ID
- [ ] Member removed from list

---

### Flow 8: Archive Household

**Scenario:** Admin archives a household

**Setup:**
- User has Admin role on household
- Mock `onArchiveHousehold` callback

**Steps:**
1. Click "Archive" on household
2. Confirm in dialog

**Expected Results:**
- [ ] Confirmation dialog warns about archiving
- [ ] `onArchiveHousehold` is called with household ID
- [ ] Household moves to archived status

---

## Empty State Tests

### Single Household

**Scenario:** User only has one household

**Expected Results:**
- [ ] "Switch Household" option may be hidden or disabled

### No Other Members

**Scenario:** User is only member

**Expected Results:**
- [ ] Message: "You're the only member"
- [ ] "Invite Member" CTA is prominently shown

### No Pending Invitations

**Expected Results:**
- [ ] Invitations section is hidden or shows empty state

---

## Permission Tests

### Member Cannot Archive

**Setup:**
- User has Member role (not Admin)

**Expected Results:**
- [ ] "Archive Household" option is not visible or disabled
- [ ] Attempting action shows error

### Member Cannot Invite

**Setup:**
- User has Member role

**Expected Results:**
- [ ] "Invite Member" option is not visible or disabled

---

## Accessibility Checks

- [ ] Profile form fields have labels
- [ ] Modal dialogs are keyboard accessible
- [ ] Confirmation dialogs have cancel option
- [ ] Role selection is accessible
