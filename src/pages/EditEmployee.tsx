import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EmployeeForm } from '../components/staff-directory/EmployeeForm'
import { fetchEmployee, updateEmployee, getCurrentEmployment, updateEmployment, renameDocument } from '../lib/api/employees'
import { useHousehold } from '../hooks/useHousehold'
import type { UIEmployee, Document, CustomProperty, Note } from '../types'

export function EditEmployee() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeHouseholdId, loading: householdLoading } = useHousehold()
  const [employee, setEmployee] = useState<UIEmployee | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id && activeHouseholdId) {
      loadEmployee()
    }
  }, [id, activeHouseholdId])

  const loadEmployee = async () => {
    if (!id || !activeHouseholdId) return

    try {
      setLoading(true)
      setError(null)
      const data = await fetchEmployee(id, activeHouseholdId)
      setEmployee(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employee')
      console.error('Error loading employee:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (employeeData: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>) => {
    if (!id || !activeHouseholdId) return

    try {
      setSubmitting(true)
      setError(null)

      // Update employee core data
      await updateEmployee(id, {
        name: employeeData.name,
        photo: employeeData.photo,
        phoneNumbers: employeeData.phoneNumbers,
        addresses: employeeData.addresses,
        documents: employeeData.documents,
        customProperties: employeeData.customProperties,
        notes: employeeData.notes,
      })

      // Update employment data if it changed
      const currentEmployment = await getCurrentEmployment(id, activeHouseholdId)
      if (currentEmployment) {
        const currentRole = employeeData.employmentHistory[0]
        const currentSalary = employeeData.salaryHistory[0]

        if (currentRole && currentSalary) {
          await updateEmployment(currentEmployment.id, {
            role: currentRole.role,
            startDate: currentRole.startDate,
            endDate: currentRole.endDate || undefined,
            currentSalary: currentSalary.amount,
            paymentMethod: currentSalary.paymentMethod,
            holidayBalance: employee?.holidayBalance ?? 0,
          })
        }
      }

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

  const handleSaveProgress = async (employeeData: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>) => {
    if (!id || !activeHouseholdId) return

    try {
      setSaving(true)
      setError(null)

      // Update employee core data
      await updateEmployee(id, {
        name: employeeData.name,
        photo: employeeData.photo,
        phoneNumbers: employeeData.phoneNumbers,
        addresses: employeeData.addresses,
        documents: employeeData.documents,
        customProperties: employeeData.customProperties,
        notes: employeeData.notes,
      })

      // Update employment data if it changed
      const currentEmployment = await getCurrentEmployment(id, activeHouseholdId)
      if (currentEmployment) {
        const currentRole = employeeData.employmentHistory[0]
        const currentSalary = employeeData.salaryHistory[0]

        if (currentRole && currentSalary) {
          await updateEmployment(currentEmployment.id, {
            role: currentRole.role,
            startDate: currentRole.startDate,
            endDate: currentRole.endDate || undefined,
            currentSalary: currentSalary.amount,
            paymentMethod: currentSalary.paymentMethod,
            holidayBalance: employee?.holidayBalance ?? 0,
          })
        }
      }

      // Reload employee to refresh form state
      await loadEmployee()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress')
      console.error('Error saving progress:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUploaded = async (photoUrl: string) => {
    if (!id) return

    try {
      // Update employee with new photo
      await updateEmployee(id, {
        photo: photoUrl,
      })
      // Reload employee to get updated data
      await loadEmployee()
    } catch (err) {
      console.error('Error persisting photo:', err)
      setError(err instanceof Error ? err.message : 'Failed to save photo')
    }
  }

  const handleDocumentUploaded = async (documents: Document[]) => {
    if (!id || !employee) return

    try {
      // Get current documents from employee state, excluding any that match the new documents by URL
      const currentDocs = employee.documents.filter(
        d => !documents.some(nd => nd.url === d.url)
      )
      // Update employee with new documents
      await updateEmployee(id, {
        documents: [...currentDocs, ...documents],
      })
      // Reload employee to get updated data
      await loadEmployee()
    } catch (err) {
      console.error('Error persisting documents:', err)
      setError(err instanceof Error ? err.message : 'Failed to save documents')
    }
  }

  const handleRenameDocument = async (documentUrl: string, newName: string) => {
    if (!id) return

    try {
      await renameDocument(id, documentUrl, newName)
      // Reload employee to get updated data
      await loadEmployee()
    } catch (err) {
      console.error('Error renaming document:', err)
      setError(err instanceof Error ? err.message : 'Failed to rename document')
    }
  }

  const handleCustomPropertyAdded = async (property: CustomProperty) => {
    if (!id || !employee) return

    try {
      // Get current custom properties from employee state
      const updatedProperties = [...employee.customProperties, property]
      // Update employee with new custom property
      await updateEmployee(id, {
        customProperties: updatedProperties,
      })
      // Reload employee to get updated data
      await loadEmployee()
    } catch (err) {
      console.error('Error persisting custom property:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to save custom property')
    }
  }

  const handleNoteAdded = async (note: Note) => {
    if (!id || !employee) return

    try {
      // Get current notes from employee state and prepend new note (newest first)
      const updatedNotes = [note, ...employee.notes]
      // Update employee with new note
      await updateEmployee(id, {
        notes: updatedNotes,
      })
      // Reload employee to get updated data
      await loadEmployee()
    } catch (err) {
      console.error('Error persisting note:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to save note')
    }
  }

  if (householdLoading || loading) {
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
      {(submitting || saving) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">{saving ? 'Saving progress...' : 'Saving changes...'}</p>
          </div>
        </div>
      )}
      <EmployeeForm
        employee={employee}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onPhotoUploaded={handlePhotoUploaded}
        onDocumentUploaded={handleDocumentUploaded}
        onRenameDocument={handleRenameDocument}
        onCustomPropertyAdded={handleCustomPropertyAdded}
        onNoteAdded={handleNoteAdded}
        onSaveProgress={handleSaveProgress}
      />
    </div>
  )
}
