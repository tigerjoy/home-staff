# Test Instructions: Settings & Access

These test-writing instructions are **framework-agnostic**. Adapt to your testing setup.

## Overview

Test household management, member invitations, role assignments, and permission enforcement.

---

## User Flow Tests

### Flow 1: Invite a Member

**Scenario:** Admin invites a new member to the household

**Steps:**
1. User navigates to `/settings`
2. User clicks "Invite Member"
3. Modal opens with email and role fields
4. User enters email "newmember@example.com"
5. User selects role "Member"
6. User clicks "Send Invitation"

**Expected Results:**
- [ ] Modal shows email input and role selector
- [ ] Role options: "Admin" and "Member"
- [ ] `onInviteMember` called with email and role
- [ ] Modal closes on success
- [ ] Invitation appears in pending list

### Flow 2: Switch Household

**Scenario:** User switches to a different household

**Setup:**
- User belongs to 2+ households

**Steps:**
1. User opens household switcher
2. User sees list of their households
3. User clicks on different household

**Expected Results:**
- [ ] Current household highlighted
- [ ] `onSwitchHousehold` called with household ID
- [ ] App context switches to new household

### Flow 3: Change Member Role

**Scenario:** Admin changes a member's role

**Steps:**
1. User views members table
2. User clicks role dropdown for member "Taylor Chen"
3. User selects "Admin"
4. Change is confirmed

**Expected Results:**
- [ ] Dropdown shows current role
- [ ] `onChangeMemberRole` called with memberId and newRole
- [ ] Member's role updates in table

### Flow 4: Archive Household

**Scenario:** Admin archives a household

**Steps:**
1. Admin clicks "Archive Household"
2. Confirmation modal appears
3. Admin confirms

**Expected Results:**
- [ ] Confirmation shows warning about archiving
- [ ] `onArchiveHousehold` called with household ID
- [ ] Household status changes to "archived"
- [ ] User redirected to another active household

---

## Empty State Tests

### No Other Members

**Setup:**
- `members = [currentUser]` (only user)

**Expected Results:**
- [ ] Shows "You're the only member"
- [ ] Shows "Invite others to collaborate" suggestion
- [ ] Invite button prominently displayed

### No Pending Invitations

**Setup:**
- `invitations = []`

**Expected Results:**
- [ ] Pending invitations section shows "No pending invitations"

---

## Permission Tests

### Member Cannot Access Admin Actions

**Setup:**
- Current user role is "Member" (not Admin)

**Expected Results:**
- [ ] "Archive Household" button not visible
- [ ] Role change dropdown disabled for other members
- [ ] "Remove Member" not visible
- [ ] "Payroll & Finance" section restricted

### Admin Has Full Access

**Setup:**
- Current user role is "Admin"

**Expected Results:**
- [ ] All management actions visible
- [ ] Can change other members' roles
- [ ] Can archive household
- [ ] Can access all sections

---

## Sample Test Data

```typescript
const mockUserProfile = {
  id: "user-001",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  avatarUrl: "https://example.com/avatar.jpg",
  timezone: "UTC+5:30"
};

const mockHousehold = {
  id: "hh-001",
  name: "Morgan Residence",
  role: "Admin",
  status: "active",
  isPrimary: true
};

const mockMember = {
  id: "mem-2",
  name: "Jordan Morgan",
  email: "jordan.m@example.com",
  role: "Admin",
  joinedDate: "2023-01-15",
  avatarUrl: null
};

const mockInvitation = {
  id: "inv-1",
  email: "accountant@finance.com",
  role: "Member",
  sentDate: "2024-01-15",
  status: "pending"
};
```
