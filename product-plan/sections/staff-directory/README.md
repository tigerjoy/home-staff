# Staff Directory

## Overview

A centralized hub for managing household staff within the current household context. Users can add new employees or link existing ones from other households they belong to, avoiding duplicate data entry. The directory displays staff in both card grid and table views, with full profile details on dedicated pages.

## Key Functionality

- View all staff in card grid or table view (toggle between views)
- Search and filter staff by name, role, employment type, or status
- **Add Staff** button with dropdown menu:
  - **Create New Staff** — Multi-step wizard for new employee
  - **Link Existing Staff** — Import from another household
- View detailed employee profiles
- Edit staff details (core profile edits affect all households)
- Archive/restore employments
- Upload and manage documents
- Add custom properties and notes
- Export staff list to CSV or PDF

## User Flows

### Add New Employee
1. User clicks "Add Staff" button
2. Dropdown shows "Create New Staff" and "Link Existing Staff" options
3. User selects "Create New Staff"
4. Multi-step wizard: Basic Info → Role → Documents → Salary → Custom Fields
5. Employee is added to current household

### Link Existing Employee
1. User clicks "Add Staff" → "Link Existing Staff"
2. Modal shows employees from user's other households
3. User searches and selects an employee
4. Wizard starts at Role step (Basic Info is pre-filled)
5. Employee is linked to current household with new employment record

### View/Edit Employee
1. User clicks on employee card or row
2. Detail page shows full profile
3. Edit button opens form for modifications
4. Changes to core profile (name, photo, phone) sync across all households

## Design Decisions

- Employment type badge (Monthly/Ad-hoc) shown on cards and table
- Holiday balance displayed for Monthly employees
- Salary shown for Monthly employees, "Per job" for Ad-hoc
- Archive action is soft-delete — data is preserved

## Components Provided

| Component | Description |
|-----------|-------------|
| `StaffDirectory` | Main list view with search, filters, and view toggle |
| `SummaryCards` | Dashboard cards showing staff counts and roles |
| `EmployeeCard` | Card view for individual staff member |
| `EmployeeTable` | Table view for staff list |
| `EmployeeDetail` | Full profile page |
| `EmployeeForm` | Multi-step wizard for add/edit |
| `BasicInfoStep` | Wizard step for name, photo, contact |
| `RoleStep` | Wizard step for role and employment type |
| `DocumentsStep` | Wizard step for document uploads |
| `SalaryStep` | Wizard step for salary configuration |
| `CustomFieldsStep` | Wizard step for custom properties |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onView` | Called when user clicks to view profile |
| `onEdit` | Called when user clicks to edit |
| `onArchive` | Called when user archives an employment |
| `onRestore` | Called when user restores an archived employment |
| `onCreate` | Called when user clicks "Create New Staff" |
| `onLinkExisting` | Called when user selects employee to link |
| `onExport` | Called when user exports (CSV or PDF) |
| `onSearch` | Called on search input change |
| `onFilterStatus` | Called on status filter change |
| `onFilterRole` | Called on role filter change |
| `onFilterEmploymentType` | Called on employment type filter change |

## Empty States

- **No staff yet:** Show helpful message with "Add Staff" CTA
- **No search results:** Show "No staff found" with suggestion to adjust filters
- **No documents:** Show placeholder in document sections

## Visual Reference

See `screenshot.png` for the target UI design.
