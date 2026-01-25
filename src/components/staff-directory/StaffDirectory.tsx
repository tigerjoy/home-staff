import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Filter,
  X,
  ChevronDown,
  Link2,
  User
} from 'lucide-react'
import type { StaffDirectoryProps, EmploymentType } from '../../types'
import { SummaryCards } from './SummaryCards'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeTable } from './EmployeeTable'

type ViewMode = 'grid' | 'table'
type StatusFilter = 'all' | 'active' | 'archived'
type EmploymentTypeFilter = 'all' | EmploymentType

export function StaffDirectory({
  summary,
  employees,
  existingEmployeesFromOtherHouseholds = [],
  onView,
  onEdit,
  onArchive,
  onRestore,
  onCreate,
  onLinkExisting,
  onExport,
  onSearch,
  onFilterStatus,
  onFilterRole,
  onFilterEmploymentType
}: StaffDirectoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentTypeFilter>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)

  // Get unique roles from employees
  const roles = useMemo(() => {
    const roleSet = new Set<string>()
    employees.forEach(emp => {
      const currentRole = emp.employmentHistory.find(e => e.endDate === null)
      if (currentRole) roleSet.add(currentRole.role)
    })
    return Array.from(roleSet).sort()
  }, [employees])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = emp.name.toLowerCase().includes(query)
        const roleMatch = emp.employmentHistory.some(e =>
          e.role.toLowerCase().includes(query)
        )
        const phoneMatch = emp.phoneNumbers.some(p =>
          p.number.includes(query)
        )
        if (!nameMatch && !roleMatch && !phoneMatch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) return false

      // Role filter
      if (roleFilter) {
        const currentRole = emp.employmentHistory.find(e => e.endDate === null)
        if (!currentRole || currentRole.role !== roleFilter) return false
      }

      // Employment type filter - need to get from salary history or check if it's monthly/adhoc
      if (employmentTypeFilter !== 'all') {
        // For now, we'll infer from salary: if salary exists, it's monthly, otherwise adhoc
        // This is a simplification - ideally we'd have employment type in UIEmployee
        const hasSalary = emp.salaryHistory && emp.salaryHistory.length > 0 && emp.salaryHistory[0].amount > 0
        const isMonthly = hasSalary
        if (employmentTypeFilter === 'monthly' && !isMonthly) return false
        if (employmentTypeFilter === 'adhoc' && isMonthly) return false
      }

      return true
    })
  }, [employees, searchQuery, statusFilter, roleFilter, employmentTypeFilter])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status)
    onFilterStatus?.(status)
  }

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role)
    onFilterRole?.(role)
  }

  const handleEmploymentTypeFilter = (type: EmploymentTypeFilter) => {
    setEmploymentTypeFilter(type)
    onFilterEmploymentType?.(type)
  }

  const handleArchive = (id: string) => {
    const employee = employees.find(e => e.id === id)
    if (employee?.status === 'archived') {
      onRestore?.(id)
    } else {
      onArchive?.(id)
    }
  }

  const activeFiltersCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (roleFilter ? 1 : 0) +
    (employmentTypeFilter !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Staff Directory
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              Manage your household staff profiles and records
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Staff
              <ChevronDown className="w-4 h-4" />
            </button>
            {showAddMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAddMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 z-20">
                  <button
                    onClick={() => { setShowAddMenu(false); onCreate?.() }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    <Plus className="w-5 h-5 text-amber-500" />
                    <div className="text-left">
                      <p className="font-medium">Create New Staff</p>
                      <p className="text-xs text-stone-500">Add a brand new employee</p>
                    </div>
                  </button>
                  {existingEmployeesFromOtherHouseholds.length > 0 && (
                    <button
                      onClick={() => { setShowAddMenu(false); setShowLinkModal(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border-t border-stone-100 dark:border-stone-700"
                    >
                      <Link2 className="w-5 h-5 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">Link Existing Staff</p>
                        <p className="text-xs text-stone-500">From another household</p>
                      </div>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          <SummaryCards summary={summary} />
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, role, or phone..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg"
                >
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors
                  ${showFilters || activeFiltersCount > 0
                    ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750'
                  }
                `}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-amber-500 text-white rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${viewMode === 'grid'
                      ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }
                  `}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${viewMode === 'table'
                      ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }
                  `}
                  title="Table view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 z-20">
                      <button
                        onClick={() => { setShowExportMenu(false); onExport?.('csv') }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => { setShowExportMenu(false); onExport?.('pdf') }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <div className="flex gap-2">
                    {(['all', 'active', 'archived'] as StatusFilter[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusFilter(status)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                          ${statusFilter === status
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                          }
                        `}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Employment Type Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                    Employment Type
                  </label>
                  <div className="flex gap-2">
                    {(['all', 'monthly', 'adhoc'] as EmploymentTypeFilter[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleEmploymentTypeFilter(type)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                          ${employmentTypeFilter === type
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                          }
                        `}
                      >
                        {type === 'adhoc' ? 'Ad-hoc' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRoleFilter(null)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${roleFilter === null
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                        }
                      `}
                    >
                      All Roles
                    </button>
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleFilter(role)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                          ${roleFilter === role
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                          }
                        `}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        handleStatusFilter('all')
                        handleRoleFilter(null)
                        handleEmploymentTypeFilter('all')
                      }}
                      className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Showing <span className="font-medium text-stone-700 dark:text-stone-300">{filteredEmployees.length}</span> of {employees.length} staff members
          </p>
        </div>

        {/* Staff List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={() => onView?.(employee.id)}
                onEdit={() => onEdit?.(employee.id)}
                onArchive={() => handleArchive(employee.id)}
              />
            ))}
          </div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onView={onView}
            onEdit={onEdit}
            onArchive={handleArchive}
          />
        )}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              No staff found
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              {searchQuery || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first staff member'
              }
            </p>
            {!searchQuery && activeFiltersCount === 0 && (
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </button>
            )}
          </div>
        )}
      </div>

      {/* Link Existing Employee Modal */}
      {showLinkModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowLinkModal(false)}
          />
          <div className="fixed inset-x-4 top-[10%] max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Link Existing Staff
                </h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Select an employee from another household to add to this one
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {existingEmployeesFromOtherHouseholds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <User className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
                    No employees found
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    You don't have any employees in other households to link.
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
                    Create a new employee instead to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingEmployeesFromOtherHouseholds.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        setShowLinkModal(false)
                        onLinkExisting?.(emp.id)
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 dark:text-stone-100">{emp.name}</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{emp.role}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 truncate">
                          Currently at: {emp.householdName}
                        </p>
                      </div>
                      <div className="text-xs text-stone-400 dark:text-stone-500">
                        {emp.phoneNumber}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
