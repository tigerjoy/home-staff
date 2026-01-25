# Onboarding & Setup

## Overview

A focused, multi-step wizard designed to guide new users through the essential first steps of setting up their HomeStaff environment. It ensures that the primary "container"—the Household—is established and allows users to optionally add their first employee and configure basic rules. The wizard is designed to be distraction-free and ensures a successful transition into the main application.

## Key Functionality

- **Full-Screen Wizard:** A dedicated layout without the standard application sidebar to keep users focused on the setup tasks.
- **Progress Tracking:** A clear stepper indicates where the user is in the process (e.g., Step 1 of 4).
- **Household Initialization:** Mandatory first step to name and create the user's primary household.
- **Optional Employee Creation:** A simplified version of the staff creation flow to get users started quickly.
- **Global Default Settings:** Configure basic household-wide rules (e.g., default work days or currency).
- **Persistence:** Progress is saved at each step, allowing users to return and finish if they are interrupted.
- **Seamless Transition:** Automatically redirects to the Staff Directory upon completion.

## User Flows

### Initial Household Setup
1. User enters the wizard after registration.
2. User provides a name for their household (e.g., "Skyline Apartments").
3. User clicks "Next" to save and proceed.

### Adding First Staff (Optional)
1. User is prompted to add their first staff member.
2. User enters basic info (Name, Role).
3. User can click "Skip" if they prefer to do this later.
4. If added, the system creates both the Employee record and the Employment link to the new household.

### Completion
1. User reviews a summary of their setup.
2. User clicks "Finish Setup".
3. System sets the new household as the "Active Household" and redirects to the dashboard.

## Design Decisions

- **No Shell:** To reduce cognitive load, the navigation shell is hidden.
- **Save-as-you-go:** Each step is committed to the database upon clicking "Next" to prevent data loss.
- **Low Friction:** Optional steps like adding staff are clearly marked as "Skip-able" to get the user to the dashboard as fast as possible.

## Components Provided

| Component | Description |
|-----------|-------------|
| `OnboardingWizard` | Main container managing step state and navigation |
| `ProgressStepper` | Visual indicator of current and remaining steps |
| `HouseholdSetupStep` | Form for naming and initializing the household |
| `AddFirstEmployeeStep` | Simplified form for adding an initial staff member |
| `GlobalDefaultsStep` | Interface for setting basic household rules |
| `OnboardingSummary` | Final review screen before entering the app |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onStepComplete` | Called when a step is successfully submitted |
| `onSkipStep` | Called when an optional step is skipped |
| `onFinish` | Called when the entire wizard is completed |
| `onSaveDraft` | Internal callback to persist partial progress |

## Empty States

- **No Active Household:** The wizard is the primary "empty state" for the entire application for new users.

## Visual Reference

See `OnboardingWizardPreview.png` for the target UI design.
