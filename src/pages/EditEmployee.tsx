import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EmployeeForm } from '../components/staff-directory/EmployeeForm'
import { fetchEmployee, updateEmployee } from '../lib/api/employees'
import type { Employee } from '../types'

export function EditEmployee() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadEmployee()
    }
  }, [id])

  const loadEmployee = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await fetchEmployee(id)
      setEmployee(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employee')
      console.error('Error loading employee:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    if (!id) return

    try {
      setSubmitting(true)
      setError(null)

      await updateEmployee(id, employeeData)

      // Navigate back to employee detail page
      navigate(`/staff/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee')
      console.error('Error updating employee:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (id) {
      navigate(`/staff/${id}`)
    } else {
      navigate('/staff')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading employee...</p>
        </div>
      </div>
    )
  }

  if (error && !employee) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadEmployee}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/staff')}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-4">Employee not found</p>
          <button
            onClick={() => navigate('/staff')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
          >
            Back to Staff Directory
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
      {submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">Saving changes...</p>
          </div>
        </div>
      )}
      <EmployeeForm
        employee={employee}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
