import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmployeeForm } from '../components/staff-directory/EmployeeForm'
import { createEmployee } from '../lib/api/employees'
import { useHousehold } from '../hooks/useHousehold'
import type { UIEmployee } from '../types'

export function AddEmployee() {
  const navigate = useNavigate()
  const { activeHouseholdId, loading: householdLoading } = useHousehold()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (employeeData: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>) => {
    if (!activeHouseholdId) {
      setError('No active household selected')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Extract current employment data from form
      const currentEmployment = employeeData.employmentHistory[0]
      const currentSalary = employeeData.salaryHistory[0]

      if (!currentEmployment || !currentEmployment.startDate) {
        throw new Error('Employment start date is required')
      }

      if (!currentSalary || !currentSalary.amount) {
        throw new Error('Current salary is required')
      }

      // Create employee core data (without household-specific fields)
      const employeeCoreData = {
        name: employeeData.name,
        photo: employeeData.photo,
        phoneNumbers: employeeData.phoneNumbers,
        addresses: employeeData.addresses,
        documents: employeeData.documents,
        customProperties: employeeData.customProperties,
        notes: employeeData.notes,
      }

      // Create employment data
      const employmentData = {
        householdId: activeHouseholdId,
        employmentType: 'monthly' as const, // Default to monthly, can be made configurable later
        role: currentEmployment.role,
        startDate: currentEmployment.startDate,
        holidayBalance: 0, // Default holiday balance
        currentSalary: currentSalary.amount,
        paymentMethod: currentSalary.paymentMethod,
      }

      const createdEmployee = await createEmployee(employeeCoreData, employmentData)

      // Navigate to the created employee's detail page
      navigate(`/staff/${createdEmployee.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
      console.error('Error creating employee:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/staff')
  }

  if (householdLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!activeHouseholdId) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">No active household selected</p>
          <button
            onClick={() => navigate('/staff')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 mb-6 mx-4 mt-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">Creating employee...</p>
          </div>
        </div>
      )}
      <EmployeeForm
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
