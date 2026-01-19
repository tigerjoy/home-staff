# Staff Directory

## Overview

A centralized hub for managing household staff profiles. Users can add, edit, and archive employee records with a multi-step wizard. The directory displays staff in both card grid and table views, with full profile details on dedicated pages.

## User Flows

- View all staff in a card grid or table view
- Search and filter staff by name, role, or status
- Add a new staff member via a multi-step wizard
- View a staff member's full profile
- Edit staff details using the same wizard
- Archive a staff member (soft delete)
- Upload and manage documents
- Add custom properties and notes

## Components Provided

- `StaffDirectory.tsx` — Main list view with search, filters, toggle
- `SummaryCards.tsx` — Dashboard summary cards
- `EmployeeCard.tsx` — Card view item
- `EmployeeTable.tsx` — Table view
- `EmployeeDetail.tsx` — Full profile page
- `EmployeeForm.tsx` — Multi-step wizard
- `BasicInfoStep.tsx` — Name, photo, contact info
- `RoleStep.tsx` — Job title, department, dates
- `DocumentsStep.tsx` — File uploads
- `SalaryStep.tsx` — Compensation details
- `CustomFieldsStep.tsx` — Custom properties and notes

## Callback Props

| Callback | Description |
|----------|-------------|
| `onView(id)` | Navigate to employee detail page |
| `onEdit(id)` | Navigate to edit form |
| `onArchive(id)` | Archive employee |
| `onRestore(id)` | Restore archived employee |
| `onCreate()` | Navigate to new employee form |
| `onExport(format)` | Export as CSV or PDF |
| `onSearch(query)` | Filter employees |

## Visual Reference

See screenshots in `product/sections/staff-directory/` for the target UI design.
