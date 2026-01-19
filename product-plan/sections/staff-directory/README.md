# Staff Directory

## Overview

A centralized hub for managing household staff profiles. Users can add, edit, and archive employee records with a multi-step wizard. The directory displays staff in both card grid and table views, with full profile details on dedicated pages.

## User Flows

- View all staff in card grid or table view (toggle between views)
- Search and filter staff by name, role, or status
- Add new staff via multi-step wizard (Basic Info → Role → Documents → Salary → Custom Fields)
- View staff member's full profile with holiday balance
- Edit staff details, upload documents, add notes
- Archive staff member (soft delete)

## Components Provided

| Component | Description |
|-----------|-------------|
| `StaffDirectory` | Main directory page with list and filters |
| `SummaryCards` | Dashboard statistics cards |
| `EmployeeCard` | Card view for single employee |
| `EmployeeTable` | Table view for employee list |
| `EmployeeDetail` | Full profile detail page |
| `EmployeeForm` | Multi-step wizard for add/edit |
| `BasicInfoStep` | Step 1: Name, photo, contact |
| `RoleStep` | Step 2: Role, department, start date |
| `DocumentsStep` | Step 3: Document uploads |
| `SalaryStep` | Step 4: Salary configuration |
| `CustomFieldsStep` | Step 5: Custom properties |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onView` | Navigate to employee detail page |
| `onEdit` | Open employee form in edit mode |
| `onArchive` | Soft-delete with confirmation |
| `onRestore` | Restore archived employee |
| `onCreate` | Open form for new employee |
| `onExport` | Generate CSV or PDF export |
| `onSearch` | Filter by search query |
| `onFilterStatus` | Filter by active/archived |
| `onFilterRole` | Filter by role |

## Design Notes

- Summary cards show total, active, archived counts
- Toggle between card grid and table views
- Multi-step wizard with progress indicator
- Document upload with preview thumbnails
- Holiday balance displayed prominently
