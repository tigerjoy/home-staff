# Milestone 4: Staff Directory

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Test-writing instructions (see `product-plan/sections/staff-directory/tests.md`)

**What you need to build:**
- API endpoints for Employee and Employment management
- Logic for "Linking" existing employees across households
- Search and filtering logic for staff records
- Document upload and storage integration
- Custom fields persistence

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement empty states when no staff records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Establish the central hub for managing household staff, supporting both new hires and cross-household employee linking.

## Overview
A comprehensive directory of household staff with toggleable card and table views. It features a multi-step onboarding wizard for new staff and a specialized "Link Existing" flow to pull in employees already registered in other households managed by the user.

**Key Capabilities:**
- Toggleable Card and Table views
- Dashboard summary cards (staff count, role breakdown)
- Multi-step "Add Staff" wizard (Basic Info, Role, Documents, Salary, Custom Fields)
- "Link Existing" flow to share core employee profiles across households
- Document management and custom property support
- Soft-archive functionality for employment records

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/staff-directory/tests.md`. Focus on testing the view toggle, the search functionality, and the multi-step form validation.

## What to Implement

### Components
Copy these from `product-plan/sections/staff-directory/components/`:
- `StaffDirectory.tsx` — Main dashboard container
- `SummaryCards.tsx` — Top-level metrics
- `EmployeeCard.tsx` / `EmployeeTable.tsx` — Data display components
- `EmployeeForm.tsx` — The multi-step wizard container
- `BasicInfoStep.tsx`, `RoleStep.tsx`, `DocumentsStep.tsx`, `SalaryStep.tsx`, `CustomFieldsStep.tsx` — Individual wizard steps
- `EmployeeDetail.tsx` — Full profile view

### Data Layer
- **Core Profile vs. Employment:** Store name, photo, and phone in a shared `Employee` record. Store role, salary, and start date in a household-specific `Employment` record.
- **Filtering:** Implement server-side or client-side filtering by name, role, and employment type (Monthly vs Ad-hoc).

### Callbacks
- `onAddStaff`: Trigger the "Add New" or "Link Existing" flow.
- `onSaveEmployee`: Persist the employee and employment data.
- `onArchiveEmployee`: Set the employment status to `archived`.
- `onViewDetail`: Route to `/staff/:id`.
- `onUploadDocument`: Handle file uploads to your storage provider.

### Empty States
Implement a "No Staff Found" state with a prominent "Add Your First Employee" button when the directory is empty.

## Files to Reference
- `product-plan/sections/staff-directory/spec.md` — UI requirements
- `product-plan/sections/staff-directory/sample-data.json` — Sample employee records
- `product-plan/sections/staff-directory/types.ts` — Prop definitions

## Expected User Flows
1. **The New Hire Flow:** User clicks "Add New" → Completes all 5 wizard steps → New employee appears in the directory.
2. **The Linking Flow:** User clicks "Link Existing" → Selects an employee from another household → Configures their role and salary for *this* household → Employment is created.
3. **The Search Flow:** User types a name in the search bar → The list filters in real-time to match the query.

## Done When
- [ ] Staff directory displays all active employments for the current household
- [ ] Toggle between Card and Table views works correctly
- [ ] "Add Staff" wizard correctly saves both core and employment data
- [ ] "Link Existing" flow correctly reuses existing employee profiles
- [ ] Employee detail page shows all relevant info and documents
- [ ] Search and filtering are functional
- [ ] All tests in `tests.md` pass
