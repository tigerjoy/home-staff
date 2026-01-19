# Test Instructions: Staff Directory

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test the staff directory including listing, searching, filtering, and the multi-step employee wizard.

---

## User Flow Tests

### Flow 1: View Staff Directory

**Scenario:** User views the staff directory with employees

**Setup:**
- Provide summary data and list of employees

**Steps:**
1. Navigate to `/staff`

**Expected Results:**
- [ ] Summary cards display: Total Staff, Active Staff, Archived Staff
- [ ] Employee list displays (card or table view)
- [ ] Each employee shows: Name, Role, Holiday Balance
- [ ] "Add Staff" button is visible

---

### Flow 2: Add New Employee (Success)

**Scenario:** User adds a new staff member

**Setup:**
- Mock `onCreate` and `onSubmit` callbacks

**Steps:**
1. Click "Add Staff" button
2. Fill Basic Info step: Name "Lakshmi Devi", Phone "+91 98765 43210"
3. Click "Next"
4. Fill Role step: Role "Housekeeper", Start Date "2024-01-15"
5. Click "Next"
6. Skip Documents step (optional)
7. Click "Next"
8. Fill Salary step: Amount "18000", Method "Bank Transfer"
9. Click "Next"
10. Skip Custom Fields step (optional)
11. Click "Create Employee"

**Expected Results:**
- [ ] Progress indicator advances with each step
- [ ] `onSubmit` is called with complete employee data
- [ ] (In real app) New employee appears in directory
- [ ] Success message is shown

---

### Flow 3: View Employee Detail

**Scenario:** User views full employee profile

**Setup:**
- Mock `onView` callback

**Steps:**
1. Click on employee card or row

**Expected Results:**
- [ ] `onView` is called with employee ID
- [ ] (In real app) Detail page displays with full profile
- [ ] Profile shows: Contact info, Employment history, Salary history
- [ ] Documents section is visible
- [ ] Notes section is visible
- [ ] Holiday Balance is prominently displayed

---

### Flow 4: Search and Filter

**Scenario:** User searches for specific employee

**Setup:**
- Provide multiple employees
- Mock `onSearch` callback

**Steps:**
1. Type "Lakshmi" in search box

**Expected Results:**
- [ ] `onSearch` is called with "Lakshmi"
- [ ] List filters to show only matching employees

**Next steps:**
2. Select "Housekeeper" from role filter

**Expected Results:**
- [ ] `onFilterRole` is called with "Housekeeper"
- [ ] List filters to show only housekeepers

---

### Flow 5: Archive Employee

**Scenario:** User archives a staff member

**Setup:**
- Mock `onArchive` callback

**Steps:**
1. Click archive/delete icon on employee
2. Confirm in confirmation dialog

**Expected Results:**
- [ ] Confirmation dialog appears with employee name
- [ ] After confirm, `onArchive` is called with employee ID
- [ ] Employee moves to archived status

---

## Empty State Tests

### No Employees

**Scenario:** Household has no employees yet

**Setup:**
- Provide empty employee list `[]`

**Expected Results:**
- [ ] Empty state message appears: "No staff members yet"
- [ ] Helpful description explains what to do
- [ ] "Add Your First Staff Member" CTA button is visible
- [ ] Clicking CTA opens the employee form

### No Search Results

**Scenario:** Search returns no matches

**Setup:**
- Search for non-existent name

**Expected Results:**
- [ ] Message: "No employees match your search"
- [ ] Option to clear filters is visible

---

## Component Interaction Tests

### View Toggle

**Steps:**
1. Click table view icon

**Expected Results:**
- [ ] View switches from cards to table
- [ ] Table shows columns: Name, Role, Phone, Start Date, Holiday Balance, Status

---

### Multi-Step Form Navigation

**Steps:**
1. Complete step 1
2. Click "Back" button

**Expected Results:**
- [ ] Form returns to previous step
- [ ] Data from current step is preserved

---

### Document Upload

**Steps:**
1. In Documents step, click upload button
2. Select a file

**Expected Results:**
- [ ] File uploads (or mock upload)
- [ ] Thumbnail preview appears
- [ ] File name is displayed
- [ ] Delete button is available

---

## Validation Tests

### Required Fields

**Steps:**
1. Try to advance from Basic Info step without entering name

**Expected Results:**
- [ ] Validation error appears
- [ ] Cannot advance to next step

---

## Accessibility Checks

- [ ] All form fields have labels
- [ ] Error messages are descriptive
- [ ] Keyboard navigation works in wizard
- [ ] Archive confirmation is keyboard accessible
