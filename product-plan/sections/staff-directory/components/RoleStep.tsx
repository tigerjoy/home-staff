import { useState } from 'react'
import { Plus, Trash2, Briefcase, Building2, Calendar } from 'lucide-react'
import type { Employee, EmploymentRecord } from '../types'

interface RoleStepProps {
  data: Omit<Employee, 'id'>
  onChange: (updates: Partial<Omit<Employee, 'id'>>) => void
}

const COMMON_ROLES = [
  'Housekeeper',
  'Cook',
  'Driver',
  'Gardener',
  'Nanny',
  'Security Guard',
  'Caretaker',
  'Cleaner',
  'Kitchen Helper',
]

const DEPARTMENTS = [
  'Household',
  'Kitchen',
  'Transport',
  'Childcare',
  'Maintenance',
  'Security',
]

export function RoleStep({ data, onChange }: RoleStepProps) {
  const employmentHistory = data.employmentHistory || [{ role: '', department: '', startDate: '', endDate: null }]

  // Track which records are using custom (other) values
  const [customRoleIndexes, setCustomRoleIndexes] = useState<Set<number>>(() => {
    const indexes = new Set<number>()
    employmentHistory.forEach((record, idx) => {
      if (record.role && !COMMON_ROLES.includes(record.role)) {
        indexes.add(idx)
      }
    })
    return indexes
  })

  const [customDeptIndexes, setCustomDeptIndexes] = useState<Set<number>>(() => {
    const indexes = new Set<number>()
    employmentHistory.forEach((record, idx) => {
      if (record.department && !DEPARTMENTS.includes(record.department)) {
        indexes.add(idx)
      }
    })
    return indexes
  })
  const updateEmploymentRecord = (index: number, updates: Partial<EmploymentRecord>) => {
    const newHistory = [...employmentHistory]
    newHistory[index] = { ...newHistory[index], ...updates }

    const changes: Partial<Omit<Employee, 'id'>> = { employmentHistory: newHistory }

    // Sync with employment object if it's the current role
    if (index === 0) {
      changes.employment = {
        ...data.employment,
        role: newHistory[0].role,
        startDate: newHistory[0].startDate
      }
    }

    onChange(changes)
  }

  const addEmploymentRecord = () => {
    onChange({
      employmentHistory: [
        { role: '', department: '', startDate: '', endDate: null },
        ...employmentHistory,
      ],
    })
  }

  const removeEmploymentRecord = (index: number) => {
    if (employmentHistory.length > 1) {
      onChange({ employmentHistory: employmentHistory.filter((_, i) => i !== index) })
    }
  }

  const formatDateForInput = (dateStr: string | null): string => {
    if (!dateStr) return ''
    return dateStr.slice(0, 10) // YYYY-MM-DD format
  }

  const currentRole = employmentHistory[0]
  const pastRoles = employmentHistory.slice(1)

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Role & Employment
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Define the current role and track employment history
        </p>
      </div>

      {/* Current Role (First Entry) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Current Position
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Employment Type */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Employment Type
            </label>
            <div className="flex gap-4">
              {(['monthly', 'adhoc'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onChange({
                      employment: {
                        ...data.employment,
                        employmentType: type,
                        // Reset salary/holiday balance if switching to adhoc
                        currentSalary: type === 'adhoc' ? null : data.employment.currentSalary,
                        holidayBalance: type === 'adhoc' ? null : data.employment.holidayBalance,
                      }
                    })
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all
                    ${data.employment.employmentType === type
                      ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/30 dark:border-amber-500 dark:text-amber-300'
                      : 'bg-white border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${data.employment.employmentType === type ? 'border-amber-500' : 'border-stone-300 dark:border-stone-600'}
                  `}>
                    {data.employment.employmentType === type && (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold capitalize">{type}</p>
                    <p className="text-xs opacity-70">
                      {type === 'monthly' ? 'Regular salaried staff' : 'Irregular work / No tracking'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {data.employment.employmentType === 'adhoc' && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Ad-hoc employees do not have attendance or holiday tracking.
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={customRoleIndexes.has(0) ? '__other__' : (currentRole?.role || '')}
              onChange={(e) => {
                if (e.target.value === '__other__') {
                  setCustomRoleIndexes(prev => new Set(prev).add(0))
                  updateEmploymentRecord(0, { role: '' })
                } else {
                  setCustomRoleIndexes(prev => {
                    const next = new Set(prev)
                    next.delete(0)
                    return next
                  })
                  updateEmploymentRecord(0, { role: e.target.value })
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            >
              <option value="">Select a role...</option>
              {COMMON_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
              <option value="__other__">Other (custom)</option>
            </select>
            {customRoleIndexes.has(0) && (
              <input
                type="text"
                value={currentRole?.role || ''}
                onChange={(e) => updateEmploymentRecord(0, { role: e.target.value })}
                placeholder="Enter custom role"
                autoFocus
                className="mt-2 w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-stone-400 pointer-events-none" />
              <select
                value={customDeptIndexes.has(0) ? '__other__' : (currentRole?.department || '')}
                onChange={(e) => {
                  if (e.target.value === '__other__') {
                    setCustomDeptIndexes(prev => new Set(prev).add(0))
                    updateEmploymentRecord(0, { department: '' })
                  } else {
                    setCustomDeptIndexes(prev => {
                      const next = new Set(prev)
                      next.delete(0)
                      return next
                    })
                    updateEmploymentRecord(0, { department: e.target.value })
                  }
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="__other__">Other (custom)</option>
              </select>
            </div>
            {customDeptIndexes.has(0) && (
              <input
                type="text"
                value={currentRole?.department || ''}
                onChange={(e) => updateEmploymentRecord(0, { department: e.target.value })}
                placeholder="Enter custom department"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="date"
                value={formatDateForInput(currentRole?.startDate || null)}
                onChange={(e) => updateEmploymentRecord(0, { startDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-end">
            <div className="px-4 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
              Currently Active
            </div>
          </div>
        </div>
      </div>

      {/* Employment History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Previous Positions
          </h3>
          <button
            type="button"
            onClick={addEmploymentRecord}
            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Previous Role
          </button>
        </div>

        {pastRoles.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No previous positions recorded. Click "Add Previous Role" to track employment history.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastRoles.map((record, idx) => {
              const actualIndex = idx + 1 // Account for current role at index 0
              return (
                <div
                  key={actualIndex}
                  className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                      </div>
                      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                        Previous Position #{idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEmploymentRecord(actualIndex)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                        Role
                      </label>
                      <select
                        value={customRoleIndexes.has(actualIndex) ? '__other__' : (record.role || '')}
                        onChange={(e) => {
                          if (e.target.value === '__other__') {
                            setCustomRoleIndexes(prev => new Set(prev).add(actualIndex))
                            updateEmploymentRecord(actualIndex, { role: '' })
                          } else {
                            setCustomRoleIndexes(prev => {
                              const next = new Set(prev)
                              next.delete(actualIndex)
                              return next
                            })
                            updateEmploymentRecord(actualIndex, { role: e.target.value })
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select role...</option>
                        {COMMON_ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                        <option value="__other__">Other (custom)</option>
                      </select>
                      {customRoleIndexes.has(actualIndex) && (
                        <input
                          type="text"
                          value={record.role || ''}
                          onChange={(e) => updateEmploymentRecord(actualIndex, { role: e.target.value })}
                          placeholder="Enter custom role"
                          className="mt-2 w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                        Department
                      </label>
                      <select
                        value={customDeptIndexes.has(actualIndex) ? '__other__' : (record.department || '')}
                        onChange={(e) => {
                          if (e.target.value === '__other__') {
                            setCustomDeptIndexes(prev => new Set(prev).add(actualIndex))
                            updateEmploymentRecord(actualIndex, { department: '' })
                          } else {
                            setCustomDeptIndexes(prev => {
                              const next = new Set(prev)
                              next.delete(actualIndex)
                              return next
                            })
                            updateEmploymentRecord(actualIndex, { department: e.target.value })
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                        <option value="__other__">Other (custom)</option>
                      </select>
                      {customDeptIndexes.has(actualIndex) && (
                        <input
                          type="text"
                          value={record.department || ''}
                          onChange={(e) => updateEmploymentRecord(actualIndex, { department: e.target.value })}
                          placeholder="Enter custom department"
                          className="mt-2 w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      )}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(record.startDate)}
                        onChange={(e) => updateEmploymentRecord(actualIndex, { startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(record.endDate)}
                        onChange={(e) => updateEmploymentRecord(actualIndex, { endDate: e.target.value || null })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Validation Hint */}
      {!employmentHistory.some(e => e.role.trim() !== '') && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Please select or enter a role for the current position to continue.
          </p>
        </div>
      )}
    </div>
  )
}
