# Test Instructions: Onboarding & Setup

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test the multi-step onboarding wizard including required/optional steps, progress saving, and completion.

---

## User Flow Tests

### Flow 1: Complete Full Onboarding

**Scenario:** New user completes all steps

**Setup:**
- Mock all onboarding callbacks
- Start with fresh onboarding state

**Steps:**
1. Navigate to `/onboarding`
2. Enter household name "Morgan Residence"
3. Click "Next"
4. Select holiday preset "4 Days per Month"
5. Select attendance preset "Present by Default"
6. Click "Next"
7. Enter first employee name "Lakshmi Devi"
8. Enter role "Housekeeper"
9. Click "Next"
10. Click "Go to Dashboard"

**Expected Results:**
- [ ] Step 1: `onNextStep` called with household name
- [ ] Step 2: `onNextStep` called with preset selections
- [ ] Step 3: `onNextStep` called with employee data
- [ ] Step 4: `onComplete` called
- [ ] (In real app) Redirected to Staff Directory

---

### Flow 2: Skip Optional Steps

**Scenario:** User skips optional steps

**Steps:**
1. Enter household name
2. Click "Next"
3. Click "Skip" on defaults step
4. Click "Skip" on employee step
5. Click "Go to Dashboard"

**Expected Results:**
- [ ] `onSkipStep` called for each skipped step
- [ ] Wizard advances correctly
- [ ] `onComplete` called at end
- [ ] Household created without defaults or employees

---

### Flow 3: Go Back in Wizard

**Scenario:** User goes back to previous step

**Steps:**
1. Complete step 1
2. Click "Next"
3. On step 2, click "Back"

**Expected Results:**
- [ ] `onPreviousStep` called
- [ ] Returns to step 1
- [ ] Previously entered data is preserved

---

### Flow 4: Progress Auto-Save

**Scenario:** Progress is saved automatically

**Setup:**
- Mock `onSaveProgress` callback

**Steps:**
1. Enter household name
2. Wait for auto-save (or click Next)

**Expected Results:**
- [ ] `onSaveProgress` called with step ID and data
- [ ] Progress is persisted

---

### Flow 5: Resume Interrupted Onboarding

**Scenario:** User returns after leaving mid-way

**Setup:**
- Provide config with currentStepIndex: 1 (step 2)
- Provide completed step 1 data

**Steps:**
1. Navigate to `/onboarding`

**Expected Results:**
- [ ] Wizard opens at step 2 (not step 1)
- [ ] Step 1 shows as completed in stepper
- [ ] Previously entered data is available

---

## Component Tests

### Progress Stepper

**Expected Results:**
- [ ] Shows current step number ("Step 2 of 4")
- [ ] Completed steps have checkmark
- [ ] Current step is highlighted
- [ ] Future steps are dimmed

---

### Required vs Optional Steps

**Step 1 (Required):**
- [ ] Cannot skip, only "Next" button

**Step 2 (Optional):**
- [ ] Shows both "Skip" and "Next" buttons
- [ ] Can proceed without filling

**Step 4 (Required):**
- [ ] Only "Go to Dashboard" button (no skip)

---

### Form Validation

**Household Name:**
- [ ] Cannot proceed with empty name
- [ ] Error message appears

---

## Layout Tests

### Full Screen

**Expected Results:**
- [ ] No sidebar navigation visible
- [ ] No app shell chrome
- [ ] Centered content area
- [ ] Clean, focused design

---

## Mobile Responsiveness

**Expected Results:**
- [ ] Forms are usable on mobile
- [ ] Stepper adapts to small screens
- [ ] Navigation buttons are touch-friendly

---

## Accessibility Checks

- [ ] Progress stepper announces current step
- [ ] Form fields have labels
- [ ] Required fields are indicated
- [ ] Keyboard navigation works
