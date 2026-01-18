import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EmployeeDetail as EmployeeDetailComponent } from '../components/staff-directory/EmployeeDetail'
import { fetchEmployee, updateEmployee, archiveEmployee, restoreEmployee } from '../lib/api/employees'
import { uploadDocument as uploadDocumentFile, deleteDocument as deleteDocumentFile } from '../lib/storage/documents'
import type { Employee, CustomProperty, Document } from '../types'

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
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

  const handleEdit = () => {
    if (id) {
      navigate(`/staff/${id}/edit`)
    }
  }

  const handleArchive = async () => {
    if (!id || !employee) return

    try {
      if (employee.status === 'archived') {
        await restoreEmployee(id)
      } else {
        await archiveEmployee(id)
      }
      await loadEmployee()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive/restore employee')
      console.error('Error archiving employee:', err)
    }
  }

  const handleBack = () => {
    navigate('/staff')
  }

  const handleUploadDocument = async (file: File, category: Document['category']) => {
    if (!id || !employee) return

    try {
      const employeeId = Number(id)
      const url = await uploadDocumentFile(file, employeeId, category)

      // Update employee with new document
      const newDocument: Document = {
        name: file.name,
        url,
        category,
        uploadedAt: new Date().toISOString(),
      }

      const updatedEmployee = await updateEmployee(id, {
        documents: [...employee.documents, newDocument],
      })

      setEmployee(updatedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document')
      console.error('Error uploading document:', err)
    }
  }

  const handleDeleteDocument = async (documentName: string) => {
    if (!id || !employee) return

    try {
      const document = employee.documents.find((d) => d.name === documentName)
      if (document) {
        await deleteDocumentFile(document.url)
        const updatedEmployee = await updateEmployee(id, {
          documents: employee.documents.filter((d) => d.name !== documentName),
        })
        setEmployee(updatedEmployee)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document')
      console.error('Error deleting document:', err)
    }
  }

  const handleAddCustomProperty = async (property: CustomProperty) => {
    if (!id || !employee) return

    try {
      const updatedEmployee = await updateEmployee(id, {
        customProperties: [...employee.customProperties, property],
      })
      setEmployee(updatedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add custom property')
      console.error('Error adding custom property:', err)
    }
  }

  const handleRemoveCustomProperty = async (propertyName: string) => {
    if (!id || !employee) return

    try {
      const updatedEmployee = await updateEmployee(id, {
        customProperties: employee.customProperties.filter((p) => p.name !== propertyName),
      })
      setEmployee(updatedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove custom property')
      console.error('Error removing custom property:', err)
    }
  }

  const handleAddNote = async (content: string) => {
    if (!id || !employee) return

    try {
      const newNote = {
        content,
        createdAt: new Date().toISOString(),
      }
      const updatedEmployee = await updateEmployee(id, {
        notes: [newNote, ...employee.notes],
      })
      setEmployee(updatedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note')
      console.error('Error adding note:', err)
    }
  }

  const handleDeleteNote = async (createdAt: string) => {
    if (!id || !employee) return

    try {
      const updatedEmployee = await updateEmployee(id, {
        notes: employee.notes.filter((n) => n.createdAt !== createdAt),
      })
      setEmployee(updatedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
      console.error('Error deleting note:', err)
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
            onClick={handleBack}
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
            onClick={handleBack}
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
      {error && employee && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 mb-4 mx-4 mt-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <EmployeeDetailComponent
        employee={employee}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onBack={handleBack}
        onUploadDocument={handleUploadDocument}
        onDeleteDocument={handleDeleteDocument}
        onAddCustomProperty={handleAddCustomProperty}
        onRemoveCustomProperty={handleRemoveCustomProperty}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  )
}
