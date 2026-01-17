# Milestone 6: Onboarding & Setup

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-5 complete

## Goal

Implement the Onboarding & Setup feature — guide new users through initial household configuration with a full-screen wizard.

## Overview

The Onboarding wizard provides a focused, distraction-free experience for new users to set up their first household. It runs without the main application shell and saves progress at each step, allowing users to resume if interrupted.

**Key Functionality:**
- Full-screen wizard (no sidebar navigation)
- Progress stepper showing current step
- Save progress at each step for resumption
- Required steps must be completed
- Optional steps can be skipped
- Seamless transition to main app on completion

## Recommended Approach: Test-Driven Development

See `product-plan/sections/onboarding-and-setup/tests.md` for test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/onboarding-and-setup/components/`:

- `OnboardingWizard.tsx` — Full-screen wizard with step management

### Data Layer

Key types from `types.ts`:

```typescript
interface OnboardingStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  status: 'pending' | 'in_progress' | 'completed'
}

interface OnboardingConfig {
  currentStepIndex: number
  totalSteps: number
  isCompleted: boolean
  lastSavedAt: string
}

interface PresetOption {
  id: string
  label: string
  description: string
}

interface OnboardingPresets {
  holidayRules: PresetOption[]
  attendance: PresetOption[]
}
```

### Wizard Steps

1. **Name Your Household** (Required)
   - Input for household name
   - Creates the primary household record

2. **Set Global Defaults** (Optional)
   - Holiday rule presets: "4 Days per Month", "Every Sunday Off", "Custom"
   - Attendance mode: "Present by Default" (recommended), "Manual Entry"

3. **Add Your First Employee** (Optional)
   - Simplified version of the employee form
   - Can be skipped to add later

4. **You're All Set!** (Required)
   - Confirmation screen
   - "Go to Dashboard" button

### Callbacks

| Callback | Description |
|----------|-------------|
| `onNextStep(currentStepId, data)` | Move to next step with data |
| `onSkipStep(currentStepId)` | Skip optional step |
| `onPreviousStep()` | Go back one step |
| `onComplete()` | Finish wizard, transition to app |
| `onSaveProgress(stepId, data)` | Auto-save current progress |

### UI Requirements

- **Full-screen layout:** No sidebar, no header (except mobile logo)
- **Progress stepper:** Shows "Step 1 of 4" with visual indicator
- **Centered forms:** Clean, focused input areas
- **Adaptive buttons:** "Next", "Skip", "Back", "Finish" based on step

### Empty States

This section doesn't have traditional empty states, but handle:
- **Returning user:** Resume from last saved step
- **All steps completed:** Redirect to main app if onboarding already done

## Files to Reference

- `product-plan/sections/onboarding-and-setup/README.md`
- `product-plan/sections/onboarding-and-setup/tests.md`
- `product-plan/sections/onboarding-and-setup/components/`
- `product-plan/sections/onboarding-and-setup/types.ts`
- `product-plan/sections/onboarding-and-setup/sample-data.json`

## Expected User Flows

### Flow 1: Complete Onboarding

1. New user signs up and is redirected to `/onboarding`
2. User sees Step 1: "Name Your Household"
3. User enters household name and clicks "Next"
4. User sees Step 2: "Set Global Defaults"
5. User selects presets or skips
6. User sees Step 3: "Add Your First Employee"
7. User adds employee or skips
8. User sees Step 4: "You're All Set!"
9. User clicks "Go to Dashboard"
10. **Outcome:** Redirected to `/staff` with household created

### Flow 2: Resume Interrupted Onboarding

1. User starts onboarding but closes browser at Step 2
2. User returns and navigates to `/onboarding`
3. Wizard loads previous progress
4. User continues from Step 2
5. **Outcome:** Progress preserved, user completes wizard

### Flow 3: Skip Optional Steps

1. User completes Step 1 (required)
2. User clicks "Skip" on Step 2 (optional)
3. User clicks "Skip" on Step 3 (optional)
4. User completes Step 4
5. **Outcome:** Wizard completed with only required steps

## Done When

- [ ] Tests written and passing
- [ ] Full-screen wizard displays without shell
- [ ] Progress stepper shows current step
- [ ] Household name step creates household
- [ ] Defaults step allows preset selection
- [ ] Employee step allows adding first staff
- [ ] Skip functionality works for optional steps
- [ ] Progress is saved and resumable
- [ ] Completion redirects to main app
- [ ] Mobile responsive layout
