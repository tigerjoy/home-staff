# Test Instructions: Settings & Access

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Inviting a New Member

**Scenario:** Admin invites a spouse to manage the household

**Steps:**
1. Navigate to Settings > Members.
2. Click "Invite Member".
3. Enter email "spouse@example.com".
4. Select "Member" role.
5. Click "Send Invite".
6. Verify a new row appears in the Members Table with "Pending" status.

**Expected Results:**
- [ ] `onInviteMember` is called with correct email and role.
- [ ] UI reflects the new pending invitation immediately.

### Flow 2: Switching Households

**Scenario:** User switches from "Primary Home" to "Summer House"

**Steps:**
1. Open the Household Switcher.
2. Click on "Summer House" from the list.
3. Verify the global application state updates to the new household ID.

**Expected Results:**
- [ ] `onSwitchHousehold` callback is triggered.
- [ ] Active household indicator updates in the UI.

---

## Component Interaction Tests

### MembersTable
- [ ] Shows "Admin" badge for the owner.
- [ ] "Remove" action is hidden or disabled for the user's own record.
- [ ] "Change Role" dropdown is only accessible if the current user is an Admin.

### HouseholdList
- [ ] Shows "Archive" button for households where the user is an Admin.
- [ ] Displays the "Create New Household" button.

---

## Edge Cases

- **Last Admin:** Prevent an Admin from removing themselves if they are the only Admin in the household.
- **Duplicate Invitation:** Handle cases where an invitation is sent to an email that is already a member.
- **Archived Household Access:** Ensure archived households are hidden from the primary switcher but accessible via a "Show Archived" toggle.

---

## Accessibility Checks

- [ ] Modals (Invite, Archive Confirmation) trap focus correctly.
- [ ] Table headers use appropriate `scope` attributes.
- [ ] Role badges have sufficient color contrast.

---

## Sample Test Data

```typescript
const mockHousehold = {
  id: "hh-001",
  name: "Green Valley Residence",
  role: "admin",
  status: "active"
};

const mockMember = {
  id: "user-002",
  name: "Sarah Miller",
  email: "sarah@example.com",
  role: "member",
  status: "active"
};

const mockPendingInvite = {
  email: "newuser@example.com",
  role: "member",
  status: "pending"
};
```
