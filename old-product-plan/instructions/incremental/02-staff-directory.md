# Milestone 2: Staff Directory

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the Staff Directory feature — manage employee profiles, roles, contact details, and documents.

## Overview

The Staff Directory is the central hub for managing household staff profiles. Users can add, edit, view, and archive employee records. The feature includes a multi-step wizard for creating/editing employees, card and table views for browsing, and detailed profile pages.

**Key Functionality:**
- View all staff in a card grid or table view with toggle
- Search and filter staff by name, role, or status
- Add new staff via a 5-step wizard (Basic Info → Role → Documents → Salary → Custom Fields)
- View detailed employee profiles with contact info, employment history, salary history, and documents
- Edit and archive employees
- Upload and manage documents (ID proofs, contracts, certificates)
- Add custom properties and notes

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/staff-directory/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/staff-directory/components/`:

- `StaffDirectory.tsx` — Main list view with search, filters, and view toggle
- `SummaryCards.tsx` — Dashboard summary cards
- `EmployeeCard.tsx` — Card view item
- `EmployeeTable.tsx` — Table view
- `EmployeeDetail.tsx` — Full profile page
- `EmployeeForm.tsx` — Multi-step wizard
- `BasicInfoStep.tsx`, `RoleStep.tsx`, `DocumentsStep.tsx`, `SalaryStep.tsx`, `CustomFieldsStep.tsx` — Form steps

### Data Layer

The components expect these data shapes (see `types.ts`):

```typescript
interface Employee {
  id: string
  name: string
  photo: string | null
  status: 'active' | 'archived'
  holidayBalance: number
  phoneNumbers: PhoneNumber[]
  addresses: Address[]
  employmentHistory: EmploymentRecord[]
  salaryHistory: SalaryRecord[]
  documents: Document[]
  customProperties: CustomProperty[]
  notes: Note[]
}

interface Summary {
  totalStaff: number
  activeStaff: number
  archivedStaff: number
  roleBreakdown: { [role: string]: number }
}
```

You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching with loading states
- Handle file uploads for documents and photos

### Callbacks

Wire up these user actions from `StaffDirectoryProps`:

| Callback | Description |
|----------|-------------|
| `onView(id)` | Navigate to employee detail page |
| `onEdit(id)` | Navigate to edit form |
| `onArchive(id)` | Archive employee (soft delete) |
| `onRestore(id)` | Restore archived employee |
| `onCreate()` | Navigate to new employee form |
| `onExport(format)` | Export list as CSV or PDF |
| `onSearch(query)` | Filter employees (handled locally) |
| `onFilterStatus(status)` | Filter by status |
| `onFilterRole(role)` | Filter by role |

### Empty States

Implement empty state UI for when no records exist:

- **No staff yet:** Show message "No staff found" with "Add Staff" CTA
- **No search results:** Show "Try adjusting your search or filters"
- **No documents:** Show "No documents" for each category
- **No notes:** Show "No notes added"
- **No custom fields:** Show "No custom fields added"

## Files to Reference

- `product-plan/sections/staff-directory/README.md` — Feature overview
- `product-plan/sections/staff-directory/tests.md` — Test-writing instructions
- `product-plan/sections/staff-directory/components/` — React components
- `product-plan/sections/staff-directory/types.ts` — TypeScript interfaces
- `product-plan/sections/staff-directory/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View Staff Directory

1. User navigates to `/staff`
2. User sees summary cards (total staff, active, archived, role breakdown)
3. User sees staff listed in card grid view by default
4. **Outcome:** Staff are displayed with name, role, phone, holiday balance, and salary

### Flow 2: Add New Staff Member

1. User clicks "Add Staff" button
2. User is taken to multi-step form
3. User fills in Basic Info (name, phone, address)
4. User fills in Role (job title, department, start date)
5. User optionally uploads documents
6. User fills in Salary (amount, payment method)
7. User optionally adds custom fields
8. User clicks "Add Staff Member"
9. **Outcome:** New employee appears in directory, redirected to list

### Flow 3: View Employee Profile

1. User clicks on employee card or "View Profile" from menu
2. User sees full profile with all details
3. User can see employment history timeline
4. User can see salary history table
5. **Outcome:** Complete employee information is displayed

### Flow 4: Archive Employee

1. User clicks "Archive" from employee menu
2. User sees confirmation modal
3. User confirms archival
4. **Outcome:** Employee is marked as archived, shown with reduced opacity

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Staff directory displays with summary cards
- [ ] Card and table view toggle works
- [ ] Search and filters work
- [ ] Multi-step form creates new employees
- [ ] Employee detail page shows all information
- [ ] Documents can be uploaded and previewed
- [ ] Notes and custom properties can be added
- [ ] Archive/restore functionality works
- [ ] Empty states display properly
- [ ] Responsive on mobile
