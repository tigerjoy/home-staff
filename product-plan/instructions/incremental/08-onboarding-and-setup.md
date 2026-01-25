# Milestone 8: Onboarding & Setup

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 3 (User Authentication) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions (see `product-plan/sections/onboarding-and-setup/tests.md`)

**What you need to build:**
- Persistence for onboarding progress (save-as-you-go)
- Household initialization logic
- First employee/employment creation logic
- Transition logic from onboarding to the main application shell

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your backend initialization logic
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Guide new users through the initial setup of their first household and optionally their first employee.

## Overview
A focused, full-screen multi-step wizard that creates the user's primary "container" (the Household). It allows for a gradual setup, ensuring the user has a functional environment before entering the full complexity of the application.

**Key Capabilities:**
- Full-screen, distraction-free setup experience
- Progress persistence (users can resume if they leave)
- Mandatory household naming and initialization
- Optional first employee addition (creates both Employee and Employment)
- Seamless transition to the Staff Directory upon completion

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/onboarding-and-setup/tests.md`. Start by testing the "Next" button validation and the progress saving mechanism.

## What to Implement

### Components
Copy these from `product-plan/sections/onboarding-and-setup/components/`:
- `OnboardingWizard.tsx` — The main container with the multi-step layout
- Individual step components (Household Setup, Employee Setup, Finalize) as defined in the wizard

### Data Layer
- **Onboarding State:** Track which step the user is on in the `User` or `Household` record.
- **Initialization:** Create the first `Household` record and associate it with the authenticated user as the "Owner/Admin".

### Callbacks
- `onNext`: Save current step data and move to the next step.
- `onSkip`: Skip optional steps (like adding an employee).
- `onFinish`: Mark onboarding as complete and redirect the user to `/staff`.
- `onSaveStep`: Periodically persist data to prevent loss.

### Empty States
N/A - This is a controlled wizard flow.

## Files to Reference
- `product-plan/sections/onboarding-and-setup/spec.md` — UI requirements
- `product-plan/sections/onboarding-and-setup/types.ts` — Prop definitions
- `product-plan/data-model/types.ts` — Household and Employee entities

## Expected User Flows
1. **The Fast Track:** User lands on Onboarding → Names their household "My Home" → Skips adding an employee → Clicks "Finish" → Arrives at the (empty) Staff Directory.
2. **The Full Setup:** User names their household → Adds details for their first employee "Maria" → Sets Maria's role and salary → Maria appears in the directory upon completion.
3. **The Resume Flow:** User starts onboarding → Closes browser halfway → Returns later → System remembers they were on Step 2 and resumes.

## Done When
- [ ] Onboarding wizard triggers for all new users without a household
- [ ] Progress is saved at each step
- [ ] Primary household is correctly created in the database
- [ ] Optional first employee/employment is created if provided
- [ ] User is correctly transitioned to the main app shell after finishing
- [ ] All tests in `tests.md` pass
