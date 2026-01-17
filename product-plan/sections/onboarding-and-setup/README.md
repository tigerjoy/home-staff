# Onboarding & Setup

## Overview

A configurable multi-step wizard that guides new users through the initial setup of their household. It ensures that the core "container" is created while allowing flexibility in how much data is collected upfront.

## User Flows

- Full-screen wizard experience (no shell)
- Progress stepper showing current step
- Required steps must be completed
- Optional steps can be skipped
- Progress saved at each step for resumption
- Seamless transition to main app on completion

## Components Provided

- `OnboardingWizard.tsx` — Full-screen wizard with step management

## Wizard Steps

1. **Name Your Household** (Required) — Create the primary household
2. **Set Global Defaults** (Optional) — Configure holiday and attendance rules
3. **Add Your First Employee** (Optional) — Quick add first staff member
4. **You're All Set!** (Required) — Confirmation and transition

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNextStep(currentStepId, data)` | Move to next step with data |
| `onSkipStep(currentStepId)` | Skip optional step |
| `onPreviousStep()` | Go back one step |
| `onComplete()` | Finish wizard, transition to app |
| `onSaveProgress(stepId, data)` | Auto-save current progress |

## Visual Reference

See screenshots in `product/sections/onboarding-and-setup/` for the target UI design.
