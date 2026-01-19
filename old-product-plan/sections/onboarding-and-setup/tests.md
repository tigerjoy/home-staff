# Test Instructions: Onboarding & Setup

These test-writing instructions are **framework-agnostic**. Adapt to your testing setup.

## Overview

Test the full-screen onboarding wizard, step navigation, progress saving, and completion flow.

---

## User Flow Tests

### Flow 1: Complete Onboarding

**Scenario:** New user completes the full onboarding wizard

**Steps:**
1. New user is redirected to `/onboarding`
2. User sees Step 1: "Name Your Household"
3. User enters household name "Morgan Residence"
4. User clicks "Next"
5. User sees Step 2: "Set Global Defaults"
6. User selects "Every Sunday Off" preset
7. User clicks "Next"
8. User sees Step 3: "Add Your First Employee"
9. User clicks "Skip" (optional step)
10. User sees Step 4: "You're All Set!"
11. User clicks "Go to Dashboard"

**Expected Results:**
- [ ] Progress indicator shows "Step X of 4"
- [ ] "Next" button disabled until required field filled
- [ ] "Skip" button visible on optional steps
- [ ] `onNextStep` called with step data
- [ ] `onComplete` called on finish
- [ ] User redirected to `/staff`

### Flow 2: Resume Interrupted Onboarding

**Scenario:** User resumes after closing browser

**Setup:**
- User previously completed Step 1
- `config.currentStepIndex = 1`

**Steps:**
1. User returns to `/onboarding`
2. Wizard loads with Step 2 active

**Expected Results:**
- [ ] Progress shows Step 2 active
- [ ] Step 1 shows as completed
- [ ] User can continue from where they left off

### Flow 3: Skip All Optional Steps

**Scenario:** User only completes required steps

**Steps:**
1. User completes Step 1 (required)
2. User clicks "Skip" on Step 2 (optional)
3. User clicks "Skip" on Step 3 (optional)
4. User completes Step 4 (required confirmation)

**Expected Results:**
- [ ] `onSkipStep` called for each skipped step
- [ ] Wizard completes successfully
- [ ] Household created with minimal data

---

## Empty State Tests

### Already Completed Onboarding

**Setup:**
- `config.isCompleted = true`

**Expected Results:**
- [ ] User redirected to main app
- [ ] Wizard does not display

---

## UI Tests

### Full-Screen Layout

**Expected Results:**
- [ ] No sidebar navigation visible
- [ ] No header (except mobile logo)
- [ ] Content centered in viewport
- [ ] Progress stepper visible

### Step Navigation Buttons

**Step 1 (First Step):**
- [ ] "Cancel" button visible (no Back)
- [ ] "Next" button visible

**Step 2-3 (Middle Steps):**
- [ ] "Back" button visible
- [ ] "Next" or "Skip" buttons visible

**Step 4 (Final Step):**
- [ ] "Back" button visible
- [ ] "Go to Dashboard" button visible

---

## Sample Test Data

```typescript
const mockConfig = {
  currentStepIndex: 0,
  totalSteps: 4,
  isCompleted: false,
  lastSavedAt: "2024-01-17T12:00:00Z"
};

const mockSteps = [
  {
    id: "step-household",
    title: "Name Your Household",
    description: "Establish the primary container for your staff.",
    isRequired: true,
    status: "in_progress"
  },
  {
    id: "step-defaults",
    title: "Set Global Defaults",
    description: "Configure common holiday and attendance rules.",
    isRequired: false,
    status: "pending"
  },
  {
    id: "step-employee",
    title: "Add Your First Employee",
    description: "Start building your staff directory.",
    isRequired: false,
    status: "pending"
  },
  {
    id: "step-welcome",
    title: "You're All Set!",
    description: "Your household is ready.",
    isRequired: true,
    status: "pending"
  }
];

const mockPresets = {
  holidayRules: [
    { id: "p1", label: "4 Days per Month", description: "Standard flexible entitlement." },
    { id: "p2", label: "Every Sunday Off", description: "Weekly recurring holiday." },
    { id: "p3", label: "Custom", description: "Set your own rules later." }
  ],
  attendance: [
    { id: "a1", label: "Present by Default", description: "Only mark absences (Recommended)." },
    { id: "a2", label: "Manual Entry", description: "Mark attendance for every person daily." }
  ]
};
```
