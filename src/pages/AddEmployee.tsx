import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EmployeeForm } from '../components/staff-directory/EmployeeForm'
import { createEmployee, linkExistingEmployee, fetchEmployee, updateEmployee } from '../lib/api/employees'
import { uploadPhoto, uploadDocument } from '../lib/storage/documents'
import { useHousehold } from '../hooks/useHousehold'
import type { UIEmployee, Document } from '../types'

export function AddEmployee() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const linkEmployeeId = searchParams.get('link')
  const { activeHouseholdId, loading: householdLoading } = useHousehold()
  const [currentStep, setCurrentStep] = useState(linkEmployeeId ? 1 : 0) // Start at Role step if linking
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingEmployee, setExistingEmployee] = useState<UIEmployee | null>(null)
  const [loadingExisting, setLoadingExisting] = useState(false)
  const pendingPhotoFile = useRef<File | null>(null)
  const pendingDocumentFiles = useRef<Map<string, { file: File; category: Document['category'] }>>(new Map())

  // Load existing employee if linking
  useEffect(() => {
    const loadExistingEmployee = async () => {
      if (!linkEmployeeId || !activeHouseholdId) return

      try {
        setLoadingExisting(true)
        // Fetch from any household - we just need the employee data
        // We'll use the first household the user has access to as a fallback
        const employee = await fetchEmployee(linkEmployeeId, activeHouseholdId)
        if (employee) {
          setExistingEmployee(employee)
        } else {
          setError('Employee not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee')
        console.error('Error loading existing employee:', err)
      } finally {
        setLoadingExisting(false)
      }
    }

    if (linkEmployeeId && activeHouseholdId) {
      loadExistingEmployee()
    }
  }, [linkEmployeeId, activeHouseholdId])

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

      if (linkEmployeeId && existingEmployee) {
        // Linking existing employee - create new employment only
        // Extract employment type from form data (stored in employmentType property)
        const employmentType = (employeeData as any).employmentType || 'monthly'
        
        // For monthly employees, salary is required
        if (employmentType === 'monthly' && (!currentSalary || !currentSalary.amount)) {
          throw new Error('Current salary is required for monthly employees')
        }

        const employmentData = {
          householdId: activeHouseholdId,
          employmentType: employmentType as 'monthly' | 'adhoc',
          role: currentEmployment.role,
          startDate: currentEmployment.startDate,
          holidayBalance: employmentType === 'monthly' ? 0 : undefined,
          currentSalary: employmentType === 'monthly' ? (currentSalary?.amount || 0) : undefined,
          paymentMethod: currentSalary?.paymentMethod || 'Cash',
        }

        const linkedEmployee = await linkExistingEmployee(
          linkEmployeeId,
          activeHouseholdId,
          employmentData
        )

        // Navigate to the linked employee's detail page
        navigate(`/staff/${linkedEmployee.id}`)
      } else {
        // Creating new employee
        // Extract employment type from form data (stored in employmentType property)
        const employmentType = (employeeData as any).employmentType || 'monthly'
        
        // For monthly employees, salary is required
        if (employmentType === 'monthly' && (!currentSalary || !currentSalary.amount)) {
          throw new Error('Current salary is required for monthly employees')
        }

        // Create employee core data (without household-specific fields)
        // Filter out documents with blob URLs - they'll be uploaded after employee creation
        const documentsToSave = employeeData.documents.filter(doc => !doc.url.startsWith('blob:'))
        const employeeCoreData = {
          name: employeeData.name,
          photo: employeeData.photo?.startsWith('blob:') ? null : employeeData.photo, // Don't save blob URLs
          phoneNumbers: employeeData.phoneNumbers,
          addresses: employeeData.addresses,
          documents: documentsToSave,
          customProperties: employeeData.customProperties,
          notes: employeeData.notes,
        }

        // Create employment data
        const employmentData = {
          householdId: activeHouseholdId,
          employmentType: employmentType as 'monthly' | 'adhoc',
          role: currentEmployment.role,
          startDate: currentEmployment.startDate,
          holidayBalance: employmentType === 'monthly' ? 0 : undefined, // Only for monthly
          currentSalary: employmentType === 'monthly' ? (currentSalary?.amount || 0) : undefined, // Only for monthly
          paymentMethod: currentSalary?.paymentMethod || 'Cash',
        }

        const createdEmployee = await createEmployee(employeeCoreData, employmentData)

        // Upload pending photo if exists
        if (pendingPhotoFile.current) {
          try {
            const photoUrl = await uploadPhoto(createdEmployee.id, pendingPhotoFile.current)
            await updateEmployee(createdEmployee.id, { photo: photoUrl })
          } catch (error) {
            console.error('Error uploading photo:', error)
            // Continue even if photo upload fails
          }
        }

        // Upload pending documents if any
        if (pendingDocumentFiles.current.size > 0) {
          try {
            const uploadedDocuments: Document[] = []
            for (const [blobUrl, { file, category }] of pendingDocumentFiles.current.entries()) {
              try {
                const url = await uploadDocument(createdEmployee.id, file, category)
                // Find the document in employeeData by blob URL
                const doc = employeeData.documents.find(d => d.url === blobUrl)
                if (doc) {
                  uploadedDocuments.push({
                    ...doc,
                    url,
                  })
                }
              } catch (error) {
                console.error(`Error uploading document ${file.name}:`, error)
                // Continue with other documents
              }
            }

            // Update employee with uploaded document URLs
            if (uploadedDocuments.length > 0) {
              const existingDocs = createdEmployee.documents.filter(d => !d.url.startsWith('blob:'))
              await updateEmployee(createdEmployee.id, {
                documents: [...existingDocs, ...uploadedDocuments],
              })
            }
          } catch (error) {
            console.error('Error uploading documents:', error)
            // Continue even if document upload fails
          }
        }

        // Navigate to the created employee's detail page
        navigate(`/staff/${createdEmployee.id}`)
      }
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

  if (householdLoading || (linkEmployeeId && loadingExisting)) {
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
        employee={existingEmployee || undefined}
        currentStep={currentStep}
        isLinkingExisting={!!linkEmployeeId}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onPhotoFileChange={(file) => { pendingPhotoFile.current = file }}
        onDocumentFilesChange={(files) => { pendingDocumentFiles.current = files }}
      />
    </div>
  )
}
