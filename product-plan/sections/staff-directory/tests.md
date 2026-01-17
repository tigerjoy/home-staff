# Test Instructions: Staff Directory

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Staff Directory is the central hub for managing household staff profiles. Test the list views, filtering, multi-step form, detail page, and archive functionality.

---

## User Flow Tests

### Flow 1: View Staff Directory

**Scenario:** User views the staff list on the main directory page

#### Success Path

**Setup:**
- Employees array with 2+ employees
- Summary object with correct counts

**Steps:**
1. User navigates to `/staff`
2. User sees summary cards at the top
3. User sees staff displayed in card grid (default view)

**Expected Results:**
- [ ] Summary card shows "Total Staff: X"
- [ ] Summary card shows "Active: X"
- [ ] Each employee card displays name, role, phone, holiday balance
- [ ] Card shows "Add Staff" button in header

### Flow 2: Add New Staff Member

**Scenario:** User creates a new employee through the multi-step wizard

#### Success Path

**Setup:**
- Empty or existing employees list

**Steps:**
1. User clicks "Add Staff" button
2. User sees Step 1: Basic Info with progress indicator "Step 1 of 5"
3. User enters name "Priya Sharma"
4. User adds phone number "+91 98765 12345"
5. User clicks "Next"
6. User sees Step 2: Role
7. User enters role "Cook", department "Kitchen", start date "2024-01-15"
8. User clicks "Next"
9. User sees Step 3: Documents (optional)
10. User clicks "Next" (skipping documents)
11. User sees Step 4: Salary
12. User enters amount "15000", selects "Bank Transfer"
13. User clicks "Next"
14. User sees Step 5: Custom Fields (optional)
15. User clicks "Add Staff Member"

**Expected Results:**
- [ ] Progress indicator updates at each step
- [ ] "Next" button disabled when required fields empty (name, role, salary)
- [ ] "Next" button enabled when required fields filled
- [ ] On submit, new employee appears in directory
- [ ] User redirected to staff list

#### Failure Path: Empty Required Fields

**Steps:**
1. User clicks "Add Staff"
2. User leaves name empty
3. User tries to click "Next"

**Expected Results:**
- [ ] "Next" button is disabled (greyed out)
- [ ] Cannot proceed without filling required field

### Flow 3: View Employee Profile

**Scenario:** User views detailed profile of an employee

**Setup:**
- Employee with full data (phones, addresses, employment history, salary history, documents)

**Steps:**
1. User clicks on employee card or "View Profile" from menu
2. User sees full profile page

**Expected Results:**
- [ ] Header shows employee name and status badge
- [ ] Contact section shows all phone numbers with labels
- [ ] Employment history shows timeline with current role highlighted
- [ ] Salary history table shows all records with "Current" badge on first
- [ ] Documents grouped by category (ID, Contract, Certificate)
- [ ] Holiday balance card shows remaining days
- [ ] Current salary card shows amount

### Flow 4: Archive Employee

**Scenario:** User archives an employee

**Steps:**
1. User views employee profile
2. User clicks "Archive" button
3. Confirmation modal appears with message about archiving
4. User clicks "Archive" to confirm

**Expected Results:**
- [ ] Confirmation modal shows employee name
- [ ] After confirmation, employee status changes to "archived"
- [ ] Employee card shows reduced opacity and "Archived" badge
- [ ] Employee remains in list (soft delete, data preserved)

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no staff yet

**Setup:**
- `employees = []`
- `summary = { totalStaff: 0, activeStaff: 0, ... }`

**Expected Results:**
- [ ] Shows empty state message "No staff found"
- [ ] Shows "Get started by adding your first staff member"
- [ ] Shows "Add Staff" button
- [ ] Clicking button navigates to add form

### Filtered Empty State

**Scenario:** User applies filters that return no results

**Setup:**
- Employees exist but filter matches none

**Expected Results:**
- [ ] Shows "No staff found"
- [ ] Shows "Try adjusting your search or filters"
- [ ] Does NOT show "Add Staff" button (data exists, just filtered)

### Employee Detail Empty States

**Scenario:** Employee has no optional data

**Setup:**
- Employee with empty documents, notes, customProperties arrays

**Expected Results:**
- [ ] Documents section shows "No ID documents", "No contracts", "No certificates"
- [ ] Notes section shows "No notes added"
- [ ] Custom Fields section shows "No custom fields added"

---

## Component Interaction Tests

### Search and Filter

**Steps:**
1. User types "Cook" in search box
2. Employees are filtered to show only matches

**Expected Results:**
- [ ] Results count updates: "Showing X of Y staff members"
- [ ] Only employees matching role "Cook" are displayed
- [ ] Clear button (X) appears in search box
- [ ] Clicking clear resets search

### View Toggle

**Steps:**
1. User clicks table view icon

**Expected Results:**
- [ ] View switches from cards to table
- [ ] Table shows columns: Employee, Role, Phone, Start Date, Holiday Balance, Salary, Status
- [ ] Toggle button shows table as active

### Filter Panel

**Steps:**
1. User clicks "Filters" button
2. User selects "Active" status filter
3. User selects "Housekeeper" role filter

**Expected Results:**
- [ ] Filter panel expands
- [ ] Active filters count badge shows "2"
- [ ] Only active housekeepers shown
- [ ] "Clear all filters" link appears

---

## Edge Cases

- [ ] Very long employee names truncate properly
- [ ] Works with 1 employee and 100+ employees
- [ ] Phone numbers display correctly with formatting
- [ ] Dates format correctly (Indian format: 15 Jan 2024)
- [ ] Currency formats as INR (₹18,000)
- [ ] Holiday balance shows correctly with "days" suffix

---

## Sample Test Data

```typescript
const mockEmployee = {
  id: "emp-test-1",
  name: "Test Employee",
  photo: null,
  status: "active",
  holidayBalance: 5,
  phoneNumbers: [{ number: "+91 98765 43210", label: "Mobile" }],
  addresses: [{ address: "123 Test Street, Delhi", label: "Current" }],
  employmentHistory: [{
    role: "Housekeeper",
    department: "Household",
    startDate: "2024-01-15",
    endDate: null
  }],
  salaryHistory: [{
    amount: 18000,
    paymentMethod: "Bank Transfer",
    effectiveDate: "2024-01-15"
  }],
  documents: [],
  customProperties: [],
  notes: []
};

const mockSummary = {
  totalStaff: 5,
  activeStaff: 4,
  archivedStaff: 1,
  roleBreakdown: { Housekeeper: 2, Cook: 1, Driver: 1 }
};
```
