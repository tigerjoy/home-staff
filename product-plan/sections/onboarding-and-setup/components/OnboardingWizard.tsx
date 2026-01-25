import { useState } from 'react'
import type {
  OnboardingAndSetupProps,
  OnboardingStep,
  PresetOption,
} from '../types'
import {
  Home,
  Settings,
  UserPlus,
  PartyPopper,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
} from 'lucide-react'

// Step Icons
const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'step-household': Home,
  'step-defaults': Settings,
  'step-employee': UserPlus,
  'step-welcome': PartyPopper,
}

// Step Content Components
function HouseholdStep({
  householdName,
  setHouseholdName,
}: {
  householdName: string
  setHouseholdName: (name: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4">
          <Home className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Name Your Household
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          This will be the primary container for managing your staff and records.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Household Name
        </label>
        <input
          type="text"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          placeholder="e.g., Morgan Residence"
          className="w-full px-5 py-4 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-lg placeholder-stone-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
          autoFocus
        />
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 text-center">
          You can always add more households later in Settings
        </p>
      </div>
    </div>
  )
}

function DefaultsStep({
  presets,
  selectedHolidayRule,
  setSelectedHolidayRule,
  selectedAttendance,
  setSelectedAttendance,
}: {
  presets: { holidayRules: PresetOption[]; attendance: PresetOption[] }
  selectedHolidayRule: string
  setSelectedHolidayRule: (id: string) => void
  selectedAttendance: string
  setSelectedAttendance: (id: string) => void
}) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Set Global Defaults
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Choose default rules that will apply to all staff. You can customize per employee later.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        {/* Holiday Rules */}
        <div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Holiday Entitlement
          </h3>
          <div className="space-y-3">
            {presets.holidayRules.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedHolidayRule(preset.id)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all
                  ${
                    selectedHolidayRule === preset.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">
                      {preset.label}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                  {selectedHolidayRule === preset.id && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Attendance Tracking */}
        <div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Attendance Tracking
          </h3>
          <div className="space-y-3">
            {presets.attendance.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedAttendance(preset.id)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all
                  ${
                    selectedAttendance === preset.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">
                      {preset.label}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                  {selectedAttendance === preset.id && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmployeeStep({
  employeeName,
  setEmployeeName,
  employeeRole,
  setEmployeeRole,
  employmentType,
  setEmploymentType,
}: {
  employeeName: string
  setEmployeeName: (name: string) => void
  employeeRole: string
  setEmployeeRole: (role: string) => void
  employmentType: 'monthly' | 'adhoc'
  setEmploymentType: (type: 'monthly' | 'adhoc') => void
}) {
  const roles = ['Housekeeper', 'Cook', 'Driver', 'Gardener', 'Nanny', 'Security', 'Other']

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Add Your First Employee
        </h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Get started by adding one staff member. You can add more anytime.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Employment Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEmploymentType('monthly')}
              className={`
                px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-center
                ${
                  employmentType === 'monthly'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-600'
                }
              `}
            >
              Monthly Staff
            </button>
            <button
              onClick={() => setEmploymentType('adhoc')}
              className={`
                px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-center
                ${
                  employmentType === 'adhoc'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-600'
                }
              `}
            >
              Ad-hoc Worker
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Employee Name
          </label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="e.g., Lakshmi Devi"
            className="w-full px-5 py-4 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-lg placeholder-stone-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setEmployeeRole(role)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                  ${
                    employeeRole === role
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-600'
                  }
                `}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WelcomeStep({ householdName }: { householdName: string }) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-6 animate-bounce">
        <Sparkles className="w-10 h-10" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
        You're All Set!
      </h2>
      <p className="text-lg text-stone-600 dark:text-stone-400 max-w-md mx-auto mb-8">
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {householdName || 'Your household'}
        </span>{' '}
        is ready to go. Welcome to HomeStaff!
      </p>

      <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-stone-100 dark:bg-stone-800/50">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-stone-900 dark:text-stone-100">
              Household Created
            </div>
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Ready for staff
            </div>
          </div>
        </div>
        <div className="hidden sm:block w-8 border-t-2 border-dashed border-stone-300 dark:border-stone-600" />
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-stone-900 dark:text-stone-100">
              Defaults Set
            </div>
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Customizable anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Stepper
function ProgressStepper({
  steps,
  currentIndex,
}: {
  steps: OnboardingStep[]
  currentIndex: number
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const Icon = stepIcons[step.id] || Home
        const isComplete = step.status === 'completed'
        const isCurrent = index === currentIndex
        const isPending = step.status === 'pending'

        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-3">
            <div
              className={`
                relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300
                ${
                  isComplete
                    ? 'bg-amber-500 text-white'
                    : isCurrent
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500'
                }
              `}
            >
              {isComplete ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  hidden sm:block w-8 md:w-12 h-0.5 rounded-full transition-colors duration-300
                  ${
                    steps[index].status === 'completed'
                      ? 'bg-amber-500'
                      : 'bg-stone-200 dark:bg-stone-700'
                  }
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Main Component
export function OnboardingWizard({
  config,
  steps,
  presets,
  onNextStep,
  onSkipStep,
  onPreviousStep,
  onComplete,
  onSaveProgress,
}: OnboardingAndSetupProps) {
  const [currentIndex, setCurrentIndex] = useState(config.currentStepIndex)
  const [householdName, setHouseholdName] = useState('')
  const [selectedHolidayRule, setSelectedHolidayRule] = useState('p1')
  const [selectedAttendance, setSelectedAttendance] = useState('a1')
  const [employeeName, setEmployeeName] = useState('')
  const [employeeRole, setEmployeeRole] = useState('')
  const [employmentType, setEmploymentType] = useState<'monthly' | 'adhoc'>('monthly')

  const currentStep = steps[currentIndex]
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === steps.length - 1
  const canSkip = !currentStep.isRequired

  const handleNext = () => {
    const data = getStepData()
    onNextStep?.(currentStep.id, data)
    onSaveProgress?.(currentStep.id, data)

    if (isLastStep) {
      onComplete?.()
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleSkip = () => {
    onSkipStep?.(currentStep.id)
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    onPreviousStep?.()
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const getStepData = () => {
    switch (currentStep.id) {
      case 'step-household':
        return { householdName }
      case 'step-defaults':
        return { holidayRule: selectedHolidayRule, attendance: selectedAttendance }
      case 'step-employee':
        return { name: employeeName, role: employeeRole, employmentType }
      default:
        return {}
    }
  }

  const isStepValid = () => {
    switch (currentStep.id) {
      case 'step-household':
        return householdName.trim().length > 0
      case 'step-defaults':
        return true
      case 'step-employee':
        return !currentStep.isRequired || (employeeName.trim().length > 0 && employeeRole)
      case 'step-welcome':
        return true
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'step-household':
        return (
          <HouseholdStep
            householdName={householdName}
            setHouseholdName={setHouseholdName}
          />
        )
      case 'step-defaults':
        return (
          <DefaultsStep
            presets={presets}
            selectedHolidayRule={selectedHolidayRule}
            setSelectedHolidayRule={setSelectedHolidayRule}
            selectedAttendance={selectedAttendance}
            setSelectedAttendance={setSelectedAttendance}
          />
        )
      case 'step-employee':
        return (
          <EmployeeStep
            employeeName={employeeName}
            setEmployeeName={setEmployeeName}
            employeeRole={employeeRole}
            setEmployeeRole={setEmployeeRole}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
          />
        )
      case 'step-welcome':
        return <WelcomeStep householdName={householdName} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30 dark:from-stone-950 dark:to-stone-900 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              HomeStaff
            </span>
          </div>
          <div className="text-sm text-stone-500 dark:text-stone-400">
            Step {currentIndex + 1} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <ProgressStepper steps={steps} currentIndex={currentIndex} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
          {renderStepContent()}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="py-6 px-4 sm:px-6 border-t border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${
                isFirstStep
                  ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {canSkip && !isLastStep && (
              <button
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={currentStep.isRequired && !isStepValid()}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  currentStep.isRequired && !isStepValid()
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25'
                }
              `}
            >
              {isLastStep ? 'Get Started' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
