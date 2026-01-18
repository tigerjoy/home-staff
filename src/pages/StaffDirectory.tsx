import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StaffDirectory as StaffDirectoryComponent } from '../components/staff-directory/StaffDirectory'
import { fetchEmployees, archiveEmployee, restoreEmployee } from '../lib/api/employees'
import { fetchSummary } from '../lib/api/summary'
import { exportToCSV, exportToPDF } from '../lib/utils/export'
import type { Employee, Summary } from '../types'

export function StaffDirectory() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [summary, setSummary] = useState<Summary>({
    totalStaff: 0,
    activeStaff: 0,
    archivedStaff: 0,
    roleBreakdown: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  // TODO: Get household ID from context/auth - using placeholder for now
  const householdId = '1'

  useEffect(() => {
    loadData()
  }, [householdId, page])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [employeesData, summaryData] = await Promise.all([
        fetchEmployees(householdId, page, pageSize),
        fetchSummary(householdId),
      ])

      setEmployees(employeesData.data)
      setSummary(summaryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff directory')
      console.error('Error loading staff directory:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (id: string) => {
    navigate(`/staff/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/staff/${id}/edit`)
  }

  const handleArchive = async (id: string) => {
    try {
      const employee = employees.find((e) => e.id === id)
      if (employee?.status === 'archived') {
        await restoreEmployee(id)
      } else {
        await archiveEmployee(id)
      }
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive/restore employee')
      console.error('Error archiving employee:', err)
    }
  }

  const handleCreate = () => {
    navigate('/staff/new')
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(employees, `staff-directory-${new Date().toISOString().split('T')[0]}.csv`)
    } else if (format === 'pdf') {
      exportToPDF(employees)
    }
  }

  const handleSearch = (query: string) => {
    // Search is handled locally by the component
    console.log('Search:', query)
  }

  const handleFilterStatus = (status: 'all' | 'active' | 'archived') => {
    // Filter is handled locally by the component
    console.log('Filter status:', status)
  }

  const handleFilterRole = (role: string | null) => {
    // Filter is handled locally by the component
    console.log('Filter role:', role)
  }

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading staff directory...</p>
        </div>
      </div>
    )
  }

  if (error && employees.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <StaffDirectoryComponent
      summary={summary}
      employees={employees}
      onView={handleView}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onRestore={handleArchive}
      onCreate={handleCreate}
      onExport={handleExport}
      onSearch={handleSearch}
      onFilterStatus={handleFilterStatus}
      onFilterRole={handleFilterRole}
    />
  )
}
