# Test Instructions: Staff Directory

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Staff Directory is the central hub for managing employee profiles. Key functionality includes viewing staff in card/table views, adding new employees, linking existing employees from other households, searching/filtering, and managing individual profiles.

---

## User Flow Tests

### Flow 1: Add New Employee

**Scenario:** User creates a new staff member from scratch

#### Success Path

**Setup:**
- User is authenticated and has an active household
- Staff directory is loaded (can be empty or populated)

**Steps:**
1. User clicks "Add Staff" button
2. Dropdown menu appears with "Create New Staff" and "Link Existing Staff" options
3. User clicks "Create New Staff"
4. Multi-step wizard appears at "Basic Info" step
5. User enters name (e.g., "Lakshmi Devi")
6. User adds phone number
7. User clicks "Next" button
8. Wizard advances to "Role" step
9. User selects employment type ("Monthly" or "Ad-hoc")
10. User enters role (e.g., "Housekeeper")
11. User enters start date
12. User clicks "Next" through remaining steps (Documents, Salary, Custom Fields)
13. User clicks "Add Staff Member" on final step

**Expected Results:**
- [ ] Dropdown menu shows exactly two options: "Create New Staff" and "Link Existing Staff"
- [ ] Wizard shows progress indicator (Step 1 of 5)
- [ ] "Next" button is disabled until required fields are filled
- [ ] After submission, new employee appears in the staff list
- [ ] Success feedback is shown
- [ ] Staff count in summary cards updates

#### Failure Path: Missing Required Fields

**Setup:**
- User is on Basic Info step

**Steps:**
1. User leaves name field empty
2. User clicks "Next" button

**Expected Results:**
- [ ] "Next" button remains disabled
- [ ] Form does not advance
- [ ] Visual indication that name is required

---

### Flow 2: Link Existing Employee

**Scenario:** User links a staff member from another household

#### Success Path

**Setup:**
- User has access to multiple households
- At least one employee exists in another household

**Steps:**
1. User clicks "Add Staff" button
2. User clicks "Link Existing Staff" in dropdown
3. Modal appears showing "Link Existing Staff" heading
4. Modal shows list of employees from other households
5. Each employee card shows name, role, and "Currently at: [household name]"
6. User clicks on an employee
7. Wizard opens at Role step (Basic Info is pre-filled)
8. User completes Role, Documents, Salary, Custom Fields steps
9. User clicks "Add Staff Member"

**Expected Results:**
- [ ] Modal title shows "Link Existing Staff"
- [ ] Modal subtitle explains "Select an employee from another household"
- [ ] Employee list shows name, role, household name, phone number
- [ ] Clicking employee closes modal and opens wizard
- [ ] Basic Info step is skipped or shows read-only data
- [ ] After completion, employee appears in current household's staff list

#### Empty State: No Employees in Other Households

**Setup:**
- User has no employees in other households OR user only has one household

**Steps:**
1. User clicks "Add Staff" button

**Expected Results:**
- [ ] "Link Existing Staff" option is hidden OR
- [ ] Clicking it shows empty state message

---

### Flow 3: Search and Filter Staff

**Scenario:** User searches for a specific employee

**Setup:**
- Staff directory has multiple employees

**Steps:**
1. User types "Lakshmi" in search field
2. Results filter in real-time
3. User clears search
4. All employees are shown again

**Expected Results:**
- [ ] Search filters by name, role, and phone number
- [ ] Matching employees are shown, non-matching are hidden
- [ ] "Showing X of Y staff members" text updates
- [ ] Clear button (X) appears when search has text
- [ ] Clicking clear restores full list

---

### Flow 4: Toggle View Mode

**Scenario:** User switches between card and table views

**Steps:**
1. User clicks table view icon
2. Staff displays in table format
3. User clicks grid view icon
4. Staff displays in card format

**Expected Results:**
- [ ] View toggle shows grid and table icons
- [ ] Active view icon is highlighted (amber color)
- [ ] Table view shows columns: Employee, Role, Type, Phone, Start Date, Holiday Balance, Salary, Status, Actions
- [ ] Card view shows photo/initials, name, role, type badge, phone, holiday balance, salary

---

### Flow 5: Archive Employee

**Scenario:** User archives an active employee

**Steps:**
1. User clicks menu icon on employee card/row
2. Dropdown shows "View Profile", "Edit", "Archive" options
3. User clicks "Archive"
4. Confirmation dialog appears
5. User confirms

**Expected Results:**
- [ ] Archive option text is "Archive" for active employees
- [ ] Confirmation asks "Archive Employee?"
- [ ] After confirmation, employee card shows "Archived" badge
- [ ] Employee is dimmed/grayed out
- [ ] Status filter can show/hide archived employees

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no staff yet (first-time or all archived)

**Setup:**
- Staff list is empty (`[]`)

**Expected Results:**
- [ ] Shows icon placeholder (search or users icon)
- [ ] Shows heading "No staff found"
- [ ] Shows text "Get started by adding your first staff member"
- [ ] Shows "Add Staff" button as primary CTA
- [ ] Clicking "Add Staff" opens the add wizard
- [ ] Summary cards show 0 for all counts

### Filtered Empty State

**Scenario:** User applies filters that match no results

**Setup:**
- Staff list has employees but none match current filters

**Expected Results:**
- [ ] Shows "No staff found"
- [ ] Shows "Try adjusting your search or filters"
- [ ] Does NOT show "Add Staff" CTA (since employees exist)

---

## Component Interaction Tests

### StaffDirectory Component

**Renders correctly:**
- [ ] Shows page title "Staff Directory"
- [ ] Shows description "Manage your household staff profiles and records"
- [ ] Shows summary cards with counts
- [ ] Shows search input with placeholder "Search by name, role, or phone..."
- [ ] Shows Filters button
- [ ] Shows view toggle (grid/table)
- [ ] Shows Export button with dropdown

**Filter panel:**
- [ ] Filters button shows badge with active filter count
- [ ] Clicking Filters shows filter panel
- [ ] Status filter has: All, Active, Archived
- [ ] Employment Type filter has: All, Monthly, Ad-hoc
- [ ] Role filter shows available roles dynamically
- [ ] "Clear all filters" link appears when filters active

### EmployeeCard Component

**Renders correctly:**
- [ ] Shows employee photo or initials avatar
- [ ] Shows name and role
- [ ] Shows employment type badge (Monthly = blue, Ad-hoc = purple)
- [ ] Shows phone number
- [ ] Shows "Since [date]" for start date
- [ ] Shows holiday balance for Monthly employees
- [ ] Shows salary for Monthly employees
- [ ] Shows "Per job" for Ad-hoc employees

**Actions menu:**
- [ ] Menu icon appears on hover
- [ ] Clicking opens dropdown with View, Edit, Archive
- [ ] Clicking outside closes menu

---

## Edge Cases

- [ ] Handles very long employee names with text truncation
- [ ] Works correctly with 1 employee and 100+ employees
- [ ] Preserves search/filter state when navigating away and back
- [ ] After archiving last active employee, shows appropriate empty state
- [ ] After adding first employee, list renders correctly (transition from empty to populated)

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Add Staff dropdown is navigable with keyboard
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately after modal closes

---

## Sample Test Data

```typescript
// Populated state
const mockEmployee = {
  id: "emp-001",
  name: "Lakshmi Devi",
  photo: null,
  phoneNumbers: [{ number: "+91 98765 43210", label: "Mobile" }],
  addresses: [{ address: "123 Main Street", label: "Current" }],
  employment: {
    employmentType: "monthly",
    role: "Housekeeper",
    startDate: "2019-03-15",
    status: "active",
    holidayBalance: 8,
    currentSalary: 18000,
    paymentMethod: "Bank Transfer"
  }
};

const mockEmployees = [mockEmployee, /* ... more */];

// Empty states
const mockEmptyList = [];

// Employees from other households (for link existing)
const mockExistingEmployees = [
  {
    id: "emp-002",
    name: "Raju Sharma",
    role: "Driver",
    householdName: "Springfield Vacation Home",
    phoneNumber: "+91 98765 43211"
  }
];
```
