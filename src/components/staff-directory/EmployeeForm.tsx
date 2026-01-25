import { useState, useEffect } from 'react'
import { Check, ChevronLeft, ChevronRight, User, Briefcase, FileText, Wallet, Settings2 } from 'lucide-react'
import type { UIEmployee, EmployeeFormProps } from '../../types'
import { BasicInfoStep } from './BasicInfoStep'
import { RoleStep } from './RoleStep'
import { DocumentsStep } from './DocumentsStep'
import { SalaryStep } from './SalaryStep'
import { CustomFieldsStep } from './CustomFieldsStep'

const STEPS = [
  { id: 0, title: 'Basic Info', icon: User, description: 'Name, photo & contact details' },
  { id: 1, title: 'Role', icon: Briefcase, description: 'Employment history & department' },
  { id: 2, title: 'Documents', icon: FileText, description: 'ID proofs, contracts & certificates' },
  { id: 3, title: 'Salary', icon: Wallet, description: 'Compensation & payment method' },
  { id: 4, title: 'Custom Fields', icon: Settings2, description: 'Additional properties & notes' },
]

const emptyEmployee: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'> = {
  name: '',
  photo: null,
  phoneNumbers: [{ number: '', label: 'Mobile' }],
  addresses: [{ address: '', label: 'Current' }],
  employmentHistory: [{ role: '', department: '', startDate: '', endDate: null }],
  salaryHistory: [{ amount: 0, paymentMethod: 'Bank Transfer', effectiveDate: '' }],
  documents: [],
  customProperties: [],
  notes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function EmployeeForm({
  employee,
  currentStep,
  isLinkingExisting = false,
  onStepChange,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>>(() => {
    if (employee) {
      const { id, householdId, status, holidayBalance, ...rest } = employee
      return rest
    }
    return emptyEmployee
  })

  const isEditing = !!employee
  const isLinking = isLinkingExisting && !!employee

  useEffect(() => {
    if (employee) {
      const { id, ...rest } = employee
      setFormData(rest)
    }
  }, [employee])

  const updateFormData = (updates: Partial<Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      onStepChange?.(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      // Don't allow going back to BasicInfo step when linking
      const nextStep = isLinking && currentStep === 1 ? 1 : currentStep - 1
      onStepChange?.(nextStep)
    }
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
  }

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 0:
        return formData.name.trim() !== ''
      case 1:
        return formData.employmentHistory.some(e => e.role.trim() !== '')
      case 2:
        return true // Documents are optional
      case 3:
        return formData.salaryHistory.some(s => s.amount > 0)
      case 4:
        return true // Custom fields are optional
      default:
        return false
    }
  }

  const canProceed = isStepComplete(currentStep)

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            {isEditing
              ? 'Update the details for this staff member'
              : 'Complete the wizard to add a new staff member to your household'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          {/* Desktop: Horizontal steps */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-700" />
            {/* Progress line filled */}
            <div
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isComplete = step.id < currentStep || (step.id === currentStep && isStepComplete(step.id))
              const isPast = step.id < currentStep
              // Skip BasicInfo step when linking
              const isSkipped = isLinking && step.id === 0

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    // Don't allow clicking on BasicInfo step when linking
                    if (!isSkipped) {
                      onStepChange?.(step.id)
                    }
                  }}
                  disabled={isSkipped}
                  className="relative flex flex-col items-center group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isSkipped
                        ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 border-2 border-stone-200 dark:border-stone-700 opacity-50'
                        : isActive
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-110'
                          : isPast
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 border-2 border-stone-200 dark:border-stone-700'
                      }
                      ${!isActive && !isSkipped && 'group-hover:border-amber-300 dark:group-hover:border-amber-700'}
                    `}
                  >
                    {isSkipped ? (
                      <X className="w-5 h-5" />
                    ) : isPast ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium transition-colors
                      ${isSkipped
                        ? 'text-stone-400 dark:text-stone-500 line-through'
                        : isActive
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-stone-500 dark:text-stone-400'
                      }
                    `}
                  >
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Mobile: Compact step indicator */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {STEPS[currentStep].title}
              </span>
            </div>
            <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
              {STEPS[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 0 && (
                <BasicInfoStep
                  data={formData}
                  onChange={updateFormData}
                  isLinkingExisting={isLinking}
                />
              )}
              {currentStep === 1 && (
                <RoleStep
                  data={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 2 && (
                <DocumentsStep
                  data={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 3 && (
                <SalaryStep
                  data={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 4 && (
                <CustomFieldsStep
                  data={formData}
                  onChange={updateFormData}
                />
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="px-6 sm:px-8 py-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              {currentStep > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
                    ${canProceed
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                    }
                  `}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
                    ${canProceed
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                    }
                  `}
                >
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Save Changes' : 'Add Staff Member'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 hidden md:flex items-center justify-center gap-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => onStepChange?.(step.id)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${step.id === currentStep
                  ? 'w-8 bg-amber-500'
                  : step.id < currentStep
                    ? 'bg-amber-400/50 hover:bg-amber-400'
                    : 'bg-stone-300 dark:bg-stone-600 hover:bg-stone-400'
                }
              `}
              aria-label={`Go to step ${step.id + 1}: ${step.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
