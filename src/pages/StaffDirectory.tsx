import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StaffDirectory as StaffDirectoryComponent } from '../components/staff-directory/StaffDirectory'
import { fetchEmployees, archiveEmployee, restoreEmployee, fetchEmployeesFromOtherHouseholds } from '../lib/api/employees'
import { fetchSummary } from '../lib/api/summary'
import { exportToCSV, exportToPDF } from '../lib/utils/export'
import { useHousehold } from '../hooks/useHousehold'
import type { UIEmployee, Summary, ExistingEmployeeFromOtherHousehold } from '../types'

export function StaffDirectory() {
  const navigate = useNavigate()
  const { activeHouseholdId, loading: householdLoading } = useHousehold()
  const [employees, setEmployees] = useState<UIEmployee[]>([])
  const [summary, setSummary] = useState<Summary>({
    totalStaff: 0,
    activeStaff: 0,
    archivedStaff: 0,
    monthlyStaff: 0,
    adhocStaff: 0,
    roleBreakdown: {},
  })
  const [existingEmployees, setExistingEmployees] = useState<ExistingEmployeeFromOtherHousehold[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  useEffect(() => {
    if (activeHouseholdId) {
      loadData()
    }
  }, [activeHouseholdId, page])

  const loadData = async () => {
    if (!activeHouseholdId) return

    try {
      setLoading(true)
      setError(null)

      const [employeesData, summaryData, existingEmployeesData] = await Promise.all([
        fetchEmployees(activeHouseholdId, page, pageSize),
        fetchSummary(activeHouseholdId),
        fetchEmployeesFromOtherHouseholds(activeHouseholdId).catch(() => []), // Don't fail if this errors
      ])

      setEmployees(employeesData.data)
      setSummary(summaryData)
      setExistingEmployees(existingEmployeesData)
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
    if (!activeHouseholdId) return

    try {
      const employee = employees.find((e) => e.id === id)
      if (employee?.status === 'archived') {
        await restoreEmployee(id, activeHouseholdId)
      } else {
        await archiveEmployee(id, activeHouseholdId)
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

  const handleLinkExisting = (employeeId: string) => {
    navigate(`/staff/new?link=${employeeId}`)
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

  if (householdLoading || (loading && employees.length === 0)) {
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
      existingEmployeesFromOtherHouseholds={existingEmployees}
      onView={handleView}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onRestore={handleArchive}
      onCreate={handleCreate}
      onLinkExisting={handleLinkExisting}
      onExport={handleExport}
      onSearch={handleSearch}
      onFilterStatus={handleFilterStatus}
      onFilterRole={handleFilterRole}
    />
  )
}
