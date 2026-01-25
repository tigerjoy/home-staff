import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OnboardingWizard } from '../components/onboarding'
import type { OnboardingStep, OnboardingConfig, OnboardingPresets } from '../components/onboarding/types'
import * as onboardingApi from '../lib/api/onboarding'
import * as householdsApi from '../lib/api/households'
import * as householdDefaultsApi from '../lib/api/householdDefaults'
import * as employeesApi from '../lib/api/employees'
import * as invitationsApi from '../lib/api/invitations'
import { getOnboardingPresets } from '../lib/constants/onboardingPresets'
import { useSession } from '../context/SessionContext'
import type { Employee } from '../types'

export function Onboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { session } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitationCode, setInvitationCode] = useState<string | null>(
    searchParams.get('code') || null
  )
  const [config, setConfig] = useState<OnboardingConfig>({
    currentStepIndex: 0,
    totalSteps: 4,
    isCompleted: false,
    lastSavedAt: new Date().toISOString(),
  })
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'step-household',
      title: 'Name Your Household',
      description: 'Establish the primary container for your staff and management records.',
      isRequired: true,
      status: 'in_progress',
    },
    {
      id: 'step-defaults',
      title: 'Set Global Defaults',
      description: 'Configure common holiday and attendance rules for your household.',
      isRequired: false,
      status: 'pending',
    },
    {
      id: 'step-employee',
      title: 'Add Your First Employee',
      description: 'Start building your staff directory by adding one profile now.',
      isRequired: false,
      status: 'pending',
    },
    {
      id: 'step-welcome',
      title: "You're All Set!",
      description: 'Your household is ready. Welcome to HomeStaff.',
      isRequired: true,
      status: 'pending',
    },
  ])
  const [presets] = useState<OnboardingPresets>(getOnboardingPresets())
  const [householdId, setHouseholdId] = useState<string | null>(null)

  // Check for invitation code on mount
  useEffect(() => {
    async function checkInvitationCode() {
      if (invitationCode) {
        try {
          const result = await invitationsApi.acceptInvitationCode(invitationCode)
          if (result.success && result.householdId) {
            // User joined via invitation code - skip household creation
            setHouseholdId(result.householdId)
            // Mark household step as completed
            await onboardingApi.saveOnboardingProgress(1, {
              householdId: result.householdId,
              joinedViaInvitation: true,
            })
            // Update steps to skip household creation
            const updatedSteps = steps.map((step, index) => {
              if (step.id === 'step-household') {
                return { ...step, status: 'completed' as const }
              } else if (index === 1) {
                return { ...step, status: 'in_progress' as const }
              }
              return step
            })
            setSteps(updatedSteps)
            setConfig({
              currentStepIndex: 1,
              totalSteps: 4,
              isCompleted: false,
              lastSavedAt: new Date().toISOString(),
            })
          } else {
            setError(result.error || 'Invalid invitation code')
          }
        } catch (err: any) {
          setError(err.message || 'Failed to accept invitation code')
        } finally {
          setLoading(false)
        }
        return
      }

      // No invitation code - proceed with normal onboarding
      try {
        const progress = await onboardingApi.getOnboardingProgress()
        if (progress) {
          setConfig({
            currentStepIndex: progress.currentStepIndex,
            totalSteps: 4,
            isCompleted: false,
            lastSavedAt: progress.lastSavedAt,
          })

          // Load step data to restore form state
          const step0Data = await onboardingApi.getStepData(0)
          if (step0Data?.householdId) {
            setHouseholdId(step0Data.householdId)
          }

          // Update step statuses based on progress
          const updatedSteps = steps.map((step, index) => {
            if (index < progress.currentStepIndex) {
              return { ...step, status: 'completed' as const }
            } else if (index === progress.currentStepIndex) {
              return { ...step, status: 'in_progress' as const }
            } else {
              return { ...step, status: 'pending' as const }
            }
          })
          setSteps(updatedSteps)
        }
      } catch (err: any) {
        console.error('Failed to load onboarding progress:', err)
        setError(err.message || 'Failed to load progress')
      } finally {
        setLoading(false)
      }
    }

    checkInvitationCode()
  }, [invitationCode])

  const handleNextStep = async (currentStepId: string, data: any) => {
    try {
      setError(null)

      switch (currentStepId) {
        case 'step-household': {
          // Only create household if we don't already have one (from invitation)
          if (!householdId) {
            const household = await householdsApi.createHousehold(data.householdName)
            setHouseholdId(household.id)
            // Save progress with household ID
            await onboardingApi.saveOnboardingProgress(1, {
              householdId: household.id,
              householdName: data.householdName,
            })
          }
          break
        }

        case 'step-defaults': {
          if (householdId) {
            // Apply presets
            if (data.holidayRule) {
              await householdDefaultsApi.setHolidayRulePreset(householdId, data.holidayRule)
            }
            if (data.attendance) {
              await householdDefaultsApi.setAttendancePreset(householdId, data.attendance)
            }
            await onboardingApi.saveOnboardingProgress(2, data)
          }
          break
        }

        case 'step-employee': {
          if (householdId && data.name && data.role) {
            // Create employee with minimal fields
            const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
              name: data.name,
              photo: null,
              phoneNumbers: [],
              addresses: [],
              documents: [],
              customProperties: [],
              notes: [],
            }
            
            const employmentType = data.employmentType || 'monthly'
            const startDate = new Date().toISOString().split('T')[0]
            
            const employmentData = {
              householdId,
              employmentType: employmentType as 'monthly' | 'adhoc',
              role: data.role,
              startDate,
              paymentMethod: 'Cash' as const, // Default payment method for onboarding
            }
            
            await employeesApi.createEmployee(employeeData, employmentData)
            await onboardingApi.saveOnboardingProgress(3, data)
          }
          break
        }
      }

      // Update step statuses
      const currentIndex = steps.findIndex((s) => s.id === currentStepId)
      if (currentIndex >= 0) {
        const updatedSteps = steps.map((step, index) => {
          if (index === currentIndex) {
            return { ...step, status: 'completed' as const }
          } else if (index === currentIndex + 1) {
            return { ...step, status: 'in_progress' as const }
          }
          return step
        })
        setSteps(updatedSteps)
        setConfig({
          ...config,
          currentStepIndex: currentIndex + 1,
          lastSavedAt: new Date().toISOString(),
        })
      }
    } catch (err: any) {
      console.error('Failed to process step:', err)
      setError(err.message || 'Failed to save progress')
    }
  }

  const handleSkipStep = async (currentStepId: string) => {
    try {
      setError(null)
      const currentIndex = steps.findIndex((s) => s.id === currentStepId)
      if (currentIndex >= 0) {
        // Save that step was skipped
        await onboardingApi.saveOnboardingProgress(currentIndex + 1, { skipped: true })

        // Update step statuses
        const updatedSteps = steps.map((step, index) => {
          if (index === currentIndex) {
            return { ...step, status: 'completed' as const }
          } else if (index === currentIndex + 1) {
            return { ...step, status: 'in_progress' as const }
          }
          return step
        })
        setSteps(updatedSteps)
        setConfig({
          ...config,
          currentStepIndex: currentIndex + 1,
          lastSavedAt: new Date().toISOString(),
        })
      }
    } catch (err: any) {
      console.error('Failed to skip step:', err)
      setError(err.message || 'Failed to skip step')
    }
  }

  const handlePreviousStep = () => {
    const updatedSteps = steps.map((step, index) => {
      if (index === config.currentStepIndex - 1) {
        return { ...step, status: 'in_progress' as const }
      } else if (index === config.currentStepIndex) {
        return { ...step, status: 'pending' as const }
      }
      return step
    })
    setSteps(updatedSteps)
    setConfig({
      ...config,
      currentStepIndex: Math.max(0, config.currentStepIndex - 1),
    })
  }

  const handleComplete = async () => {
    try {
      setError(null)
      // Mark onboarding as complete
      await onboardingApi.completeOnboarding()
      // Session will automatically update via SessionProvider
      // Small delay to ensure state propagation
      await new Promise(resolve => setTimeout(resolve, 100))
      // Redirect to staff directory
      navigate('/staff')
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err)
      setError(err.message || 'Failed to complete onboarding')
    }
  }

  const handleSaveProgress = async (stepId: string, data: any) => {
    try {
      const currentIndex = steps.findIndex((s) => s.id === stepId)
      if (currentIndex >= 0) {
        await onboardingApi.saveOnboardingProgress(currentIndex, data)
      }
    } catch (err) {
      // Silently fail for auto-save
      console.error('Failed to auto-save progress:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-stone-600 dark:text-stone-400">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (error && !householdId) {
    // Show error only if we haven't created household yet
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 z-50 max-w-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      <OnboardingWizard
        config={config}
        steps={steps}
        presets={presets}
        onNextStep={handleNextStep}
        onSkipStep={handleSkipStep}
        onPreviousStep={handlePreviousStep}
        onComplete={handleComplete}
        onSaveProgress={handleSaveProgress}
      />
    </>
  )
}
