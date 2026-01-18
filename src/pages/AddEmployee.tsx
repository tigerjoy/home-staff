import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmployeeForm } from '../components/staff-directory/EmployeeForm'
import { createEmployee } from '../lib/api/employees'
import { uploadPhoto as uploadPhotoFile, uploadDocument as uploadDocumentFile } from '../lib/storage/documents'
import type { Employee, Document } from '../types'

export function AddEmployee() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Get household ID from context/auth - using placeholder for now
  const householdId = '1'

  const handleSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      setLoading(true)
      setError(null)

      // Create employee first to get the ID
      let employeeToCreate: Omit<Employee, 'id'> = {
        ...employeeData,
        householdId,
      }

      // Upload photo if it's a File object (base64 string if from FileReader)
      let photoUrl: string | null = employeeData.photo
      if (employeeData.photo && employeeData.photo.startsWith('data:')) {
        // Photo is base64 - convert to File and upload
        // For now, we'll skip photo upload on create and let user update it later
        // or we could extract and upload here
        photoUrl = null // Will be set after employee creation
      }

      // Create employee without documents/photos first
      const employeeToSave = {
        ...employeeToCreate,
        photo: photoUrl,
        documents: [], // Documents will be uploaded after employee creation
      }

      const createdEmployee = await createEmployee(employeeToSave)
      const employeeId = Number(createdEmployee.id)

      // Upload documents if any
      const documentsToUpload = employeeData.documents.filter(
        (d): d is Document & { file?: File } => d.url.startsWith('blob:') || d.url.startsWith('data:')
      )

      if (documentsToUpload.length > 0) {
        // For now, skip document uploads on create - they can be added via detail page
        // This is because we need actual File objects, not base64 strings
      }

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
