# Milestone 4: Staff Directory

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Staff Directory — a centralized hub for managing household staff profiles with a multi-step wizard for adding employees.

## Overview

A centralized hub for managing household staff profiles. Users can add, edit, and archive employee records with a multi-step wizard. The directory displays staff in both card grid and table views, with full profile details on dedicated pages. Supports custom properties and notes for flexible record-keeping.

**Key Functionality:**
- View all staff in card grid or table view (toggle between views)
- Search and filter staff by name, role, or status
- Add new staff member via multi-step wizard
- View staff member's full profile with holiday balance
- Edit staff details
- Archive staff member (soft delete)
- Upload and manage documents
- Add custom properties and notes
- Export staff list to CSV or PDF

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/staff-directory/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/staff-directory/components/`:

- `StaffDirectory.tsx` — Main directory page
- `SummaryCards.tsx` — Dashboard summary statistics
- `EmployeeCard.tsx` — Card view for employee
- `EmployeeTable.tsx` — Table view for employees
- `EmployeeDetail.tsx` — Full profile page
- `EmployeeForm.tsx` — Multi-step wizard
- `BasicInfoStep.tsx` — Step 1: Basic info
- `RoleStep.tsx` — Step 2: Role and department
- `DocumentsStep.tsx` — Step 3: Document uploads
- `SalaryStep.tsx` — Step 4: Salary configuration
- `CustomFieldsStep.tsx` — Step 5: Custom properties

### Data Layer

The components expect these data shapes:

```typescript
interface StaffDirectoryProps {
  summary: Summary
  employees: Employee[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
  onRestore?: (id: string) => void
  onCreate?: () => void
  onExport?: (format: 'csv' | 'pdf') => void
  onSearch?: (query: string) => void
  onFilterStatus?: (status: 'all' | 'active' | 'archived') => void
  onFilterRole?: (role: string | null) => void
}

interface Employee {
  id: string
  name: string
  photo: string | null
  status: 'active' | 'archived'
  phoneNumbers: PhoneNumber[]
  addresses: Address[]
  employmentHistory: EmploymentRecord[]
  salaryHistory: SalaryRecord[]
  documents: Document[]
  customProperties: CustomProperty[]
  notes: Note[]
  holidayBalance: number
}
```

You'll need to:
- Create Employee API endpoints (CRUD)
- Handle file uploads for photos and documents
- Implement search and filtering
- Generate export files

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onView` | Navigate to employee detail page |
| `onEdit` | Open employee form in edit mode |
| `onArchive` | Soft-delete employee (with confirmation) |
| `onRestore` | Restore archived employee |
| `onCreate` | Open employee form for new employee |
| `onExport` | Generate and download CSV or PDF |
| `onSearch` | Filter employees by search query |
| `onFilterStatus` | Filter by active/archived status |
| `onFilterRole` | Filter by role |

### Empty States

Implement empty state UI for when no records exist:

- **No employees yet:** Show helpful message with "Add Your First Staff Member" CTA
- **No search results:** Show "No employees match your search" with option to clear filters
- **No documents:** In employee detail, show "No documents uploaded yet" with upload button

## Files to Reference

- `product-plan/sections/staff-directory/README.md` — Feature overview and design intent
- `product-plan/sections/staff-directory/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/staff-directory/components/` — React components
- `product-plan/sections/staff-directory/types.ts` — TypeScript interfaces
- `product-plan/sections/staff-directory/sample-data.json` — Test data
- `product-plan/sections/staff-directory/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Add New Staff Member

1. User clicks "Add Staff" button
2. User fills out Basic Info step (name, photo, phone, address)
3. User clicks "Next" and fills Role step (role, department, start date)
4. User clicks "Next" and uploads documents (optional)
5. User clicks "Next" and sets salary info
6. User clicks "Next" and adds custom properties (optional)
7. User clicks "Create Employee"
8. **Outcome:** Employee appears in directory, success message shown

### Flow 2: View and Edit Staff Profile

1. User clicks on an employee card or row
2. User sees full profile with all details
3. User clicks "Edit" button
4. User modifies details in the form wizard
5. User clicks "Save Changes"
6. **Outcome:** Profile updated, changes reflected immediately

### Flow 3: Archive Staff Member

1. User clicks archive/delete icon on employee
2. Confirmation dialog appears
3. User confirms the action
4. **Outcome:** Employee moved to archived, removed from active list

### Flow 4: Search and Filter

1. User types in search box
2. List filters in real-time
3. User selects role filter dropdown
4. List filters by role
5. **Outcome:** Only matching employees displayed

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Directory displays employees in card and table views
- [ ] View toggle works between card and table
- [ ] Summary cards show correct statistics
- [ ] Search filters employees in real-time
- [ ] Role and status filters work
- [ ] Multi-step form wizard works for adding employees
- [ ] Employee detail page shows all information
- [ ] Edit flow works with pre-populated form
- [ ] Archive confirmation dialog appears
- [ ] Document upload and preview works
- [ ] Custom properties can be added and removed
- [ ] Notes can be added with timestamps
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Dark mode support
