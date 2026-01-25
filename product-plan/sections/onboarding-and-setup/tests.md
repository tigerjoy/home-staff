# Test Instructions: Onboarding & Setup

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Complete Onboarding Success

**Scenario:** New user completes all steps of the wizard

**Steps:**
1. Load Onboarding Wizard.
2. Enter "My Home" in Household Name field and click "Next".
3. Enter "Lakshmi" and "Housekeeper" in Add Staff step and click "Next".
4. Select default currency and click "Next".
5. Click "Finish Setup" on summary screen.

**Expected Results:**
- [ ] `onStepComplete` is called for each step.
- [ ] `onFinish` is called at the end.
- [ ] Final redirect state is triggered.

### Flow 2: Skipping Optional Steps

**Scenario:** User wants to set up staff later

**Steps:**
1. Complete Household Name step.
2. On Add First Employee step, click the "Skip" button.
3. Verify the wizard advances to the next step without creating an employee.

**Expected Results:**
- [ ] `onSkipStep` callback is triggered.
- [ ] Wizard advances to Step 3.

---

## Component Interaction Tests

### ProgressStepper
- [ ] Shows "Active" status for the current step.
- [ ] Shows "Completed" checkmarks for previous steps.
- [ ] Prevents clicking on future steps (navigation must be linear).

### HouseholdSetupStep
- [ ] "Next" button is disabled if the household name is empty.
- [ ] Character limit on household name is enforced.

---

## Edge Cases

- **Resume Onboarding:** If a user closes the browser at Step 2, verify that re-opening the app loads the wizard at Step 2 with Step 1 data preserved.
- **Multiple Employees:** Verify that the "Add Staff" step in onboarding only handles a single employee for simplicity (additional staff should be added via the main Staff Directory).
- **Network Failure:** Verify that if `onStepComplete` fails, the user remains on the current step with an error message.

---

## Accessibility Checks

- [ ] All form inputs have clear, visible labels.
- [ ] Keyboard focus is moved to the top of the card when a step changes.
- [ ] Progress (e.g., "Step 2 of 4") is announced by screen readers.

---

## Sample Test Data

```typescript
const mockOnboardingData = {
  householdName: "Greenwood Villa",
  firstEmployee: {
    name: "Raju",
    role: "Driver"
  },
  defaults: {
    currency: "INR",
    timezone: "IST"
  }
};
```
