# Milestone 8: Onboarding & Setup

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 3 (User Authentication) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement Onboarding & Setup — a configurable multi-step wizard that guides new users through initial setup.

## Overview

A configurable multi-step wizard that guides new users through the initial setup of their household. It ensures that the core "container" is created while allowing flexibility in how much staff and rule data is collected upfront. Progress is saved at each step.

**Key Functionality:**
- Full-screen wizard experience (no app shell)
- Progress stepper showing current step
- Required and optional steps
- Automatic progress saving
- Resume wizard if user leaves mid-way
- Seamless transition to main app on completion

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/onboarding-and-setup/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/onboarding-and-setup/components/`:

- `OnboardingWizard.tsx` — Full-screen wizard with all steps

### Data Layer

The components expect these data shapes:

```typescript
interface OnboardingAndSetupProps {
  config: OnboardingConfig
  steps: OnboardingStep[]
  presets: OnboardingPresets
  onNextStep?: (currentStepId: string, data: any) => void
  onSkipStep?: (currentStepId: string) => void
  onPreviousStep?: () => void
  onComplete?: () => void
  onSaveProgress?: (stepId: string, data: any) => void
}

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
```

You'll need to:
- Store onboarding progress per user
- Create household on first step
- Optionally create first employee
- Apply default presets
- Mark onboarding as complete

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onNextStep` | Save step data and move to next |
| `onSkipStep` | Skip optional step |
| `onPreviousStep` | Go back to previous step |
| `onComplete` | Finish wizard, redirect to app |
| `onSaveProgress` | Auto-save step progress |

### Wizard Steps

1. **Name Your Household** (Required)
   - Input: Household name
   - Creates the primary household record

2. **Set Global Defaults** (Optional)
   - Choose holiday rule preset (4 days/month, Sundays off, Custom)
   - Choose attendance preset (Present by default, Manual entry)

3. **Add Your First Employee** (Optional)
   - Quick add form for first staff member
   - Uses subset of full employee form

4. **You're All Set!** (Required)
   - Completion screen
   - Welcome message
   - "Go to Dashboard" button

## Files to Reference

- `product-plan/sections/onboarding-and-setup/README.md` — Feature overview and design intent
- `product-plan/sections/onboarding-and-setup/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/onboarding-and-setup/components/` — React components
- `product-plan/sections/onboarding-and-setup/types.ts` — TypeScript interfaces
- `product-plan/sections/onboarding-and-setup/sample-data.json` — Test data
- `product-plan/sections/onboarding-and-setup/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Complete Full Onboarding

1. New user lands on onboarding after first login
2. User enters household name → clicks "Next"
3. User selects default presets → clicks "Next"
4. User adds first employee details → clicks "Next"
5. User sees completion screen → clicks "Go to Dashboard"
6. **Outcome:** Redirected to Staff Directory with household created

### Flow 2: Skip Optional Steps

1. User enters household name → clicks "Next"
2. User clicks "Skip" on defaults step
3. User clicks "Skip" on employee step
4. User sees completion screen → clicks "Go to Dashboard"
5. **Outcome:** Household created with no defaults or employees

### Flow 3: Resume Interrupted Onboarding

1. User completes step 1, then closes browser
2. User logs in again
3. User is redirected to onboarding at step 2
4. **Outcome:** Progress preserved, user continues from where they left

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Wizard displays full-screen (no app shell)
- [ ] Progress stepper shows current step
- [ ] Household name step works (required)
- [ ] Defaults step works with presets (optional, skippable)
- [ ] First employee step works (optional, skippable)
- [ ] Completion step displays correctly
- [ ] Progress is saved automatically
- [ ] User can resume after leaving
- [ ] "Go to Dashboard" redirects to Staff Directory
- [ ] Responsive on mobile
- [ ] Dark mode support
