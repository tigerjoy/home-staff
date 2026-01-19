# Section Implementation Prompt

Use this template when implementing sections one at a time. Fill in the variables at the top before using.

---

## Define Section Variables

Replace these before copying the prompt:

- **SECTION_NAME** = `[Human-readable name, e.g., "Staff Directory" or "Payroll & Finance"]`
- **SECTION_ID** = `[Folder name, e.g., "staff-directory" or "payroll-and-finance"]`
- **NN** = `[Milestone number, e.g., "04" for Staff Directory — sections start at 02]`

---

I need you to implement the **SECTION_NAME** section of my application.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary for overall context
2. **@product-plan/instructions/incremental/NN-SECTION_ID.md** — Specific instructions for this section

Also review the section assets:
- **@product-plan/sections/SECTION_ID/README.md** — Feature overview and design intent
- **@product-plan/sections/SECTION_ID/tests.md** — Test-writing instructions (use TDD approach)
- **@product-plan/sections/SECTION_ID/components/** — React components to integrate
- **@product-plan/sections/SECTION_ID/types.ts** — TypeScript interfaces
- **@product-plan/sections/SECTION_ID/sample-data.json** — Test data

## Before You Begin

Please ask me clarifying questions about:

1. **Authentication & Authorization** (if not yet established)
   - How should users authenticate?
   - What permissions are needed for this section?

2. **Data Relationships**
   - How does this section's data relate to other entities?
   - Are there any cross-section dependencies?

3. **Integration Points**
   - How should this section connect to existing features?
   - Any API endpoints already built that this should use?

4. **Backend Business Logic**
   - Any server-side logic, validations or processes needed beyond what's shown in the UI?
   - Background processes, notifications, or other processes to trigger?

5. **Any Other Clarifications**
   - Questions about specific user flows in this section
   - Edge cases that need clarification

## Implementation Approach

Use test-driven development:
1. Read the `tests.md` file and write failing tests first
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

Lastly, be sure to ask me if I have any other notes to add for this implementation.

Once I answer your questions, proceed with implementation.

---

## Quick Reference: Section Milestones

| Milestone | Section ID | Section Name |
|-----------|------------|--------------|
| 01 | (foundation) | Foundation |
| 02 | landing-page | Landing Page |
| 03 | user-authentication | User Authentication |
| 04 | staff-directory | Staff Directory |
| 05 | attendance-and-holidays | Attendance & Holidays |
| 06 | payroll-and-finance | Payroll & Finance |
| 07 | settings-and-access | Settings & Access |
| 08 | onboarding-and-setup | Onboarding & Setup |
| 09 | employee-portal | Employee Portal |
