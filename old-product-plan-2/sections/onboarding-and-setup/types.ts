// =============================================================================
// Data Types
// =============================================================================

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  status: 'pending' | 'in_progress' | 'completed'
}

export interface OnboardingConfig {
  currentStepIndex: number
  totalSteps: number
  isCompleted: boolean
  lastSavedAt: string
}

export interface PresetOption {
  id: string
  label: string
  description: string
}

export interface OnboardingPresets {
  holidayRules: PresetOption[]
  attendance: PresetOption[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface OnboardingAndSetupProps {
  /** Configuration for the wizard progress */
  config: OnboardingConfig
  /** The list of steps in the onboarding flow */
  steps: OnboardingStep[]
  /** Suggested presets for the defaults step */
  presets: OnboardingPresets

  /** Called when user moves to the next step */
  onNextStep?: (currentStepId: string, data: any) => void
  /** Called when user skips an optional step */
  onSkipStep?: (currentStepId: string) => void
  /** Called when user moves to the previous step */
  onPreviousStep?: () => void
  /** Called when the wizard is finalized */
  onComplete?: () => void
  /** Called to save intermediate progress */
  onSaveProgress?: (stepId: string, data: any) => void
}
