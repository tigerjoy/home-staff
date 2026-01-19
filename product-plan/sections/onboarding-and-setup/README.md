# Onboarding & Setup

## Overview

A configurable multi-step wizard that guides new users through the initial setup of their household. Ensures the core "container" is created while allowing flexibility in how much data is collected upfront.

## User Flows

- Full-screen wizard experience (no app shell)
- Progress stepper showing current step
- Required and optional steps
- Automatic progress saving
- Resume wizard if user leaves mid-way
- Seamless transition to main app on completion

## Wizard Steps

1. **Name Your Household** (Required) — Create primary household
2. **Set Global Defaults** (Optional) — Choose holiday and attendance presets
3. **Add Your First Employee** (Optional) — Quick add first staff member
4. **You're All Set!** (Required) — Completion and welcome

## Components Provided

| Component | Description |
|-----------|-------------|
| `OnboardingWizard` | Full-screen wizard with all steps |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNextStep` | Save step data and move to next |
| `onSkipStep` | Skip optional step |
| `onPreviousStep` | Go back to previous step |
| `onComplete` | Finish wizard, redirect to app |
| `onSaveProgress` | Auto-save step progress |

## Design Notes

- Full-screen layout without app shell
- Progress stepper at top
- Clean, centered forms
- Dynamic navigation buttons (Next/Skip/Finish)
- Presets for quick configuration
