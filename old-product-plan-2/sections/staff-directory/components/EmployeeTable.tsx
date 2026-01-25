import { Eye, Pencil, Archive, MoreHorizontal, Palmtree } from 'lucide-react'
import { useState } from 'react'
import type { Employee } from '@/../product/sections/staff-directory/types'

interface EmployeeTableProps {
  employees: Employee[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
}

export function EmployeeTable({ employees, onView, onEdit, onArchive }: EmployeeTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3">
                Employee
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                Role
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                Phone
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                Start Date
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                Holiday Balance
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                Salary
              </th>
              <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-right text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {employees.map((employee) => {
              const currentRole = employee.employmentHistory.find(e => e.endDate === null)
              const primaryPhone = employee.phoneNumbers[0]
              const currentSalary = employee.salaryHistory[0]
              const initials = employee.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <tr
                  key={employee.id}
                  className={`
                    group transition-colors hover:bg-amber-50/50 dark:hover:bg-amber-950/20
                    ${employee.status === 'archived' ? 'opacity-60' : ''}
                  `}
                >
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {employee.photo ? (
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{initials}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          {employee.name}
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 md:hidden">
                          {currentRole?.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div>
                      <p className="text-sm text-stone-900 dark:text-stone-100">
                        {currentRole?.role || '—'}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {currentRole?.department}
                      </p>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {primaryPhone?.number || '—'}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {currentRole ? formatDate(currentRole.startDate) : '—'}
                    </span>
                  </td>

                  {/* Holiday Balance */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Palmtree className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {employee.holidayBalance}
                        <span className="text-xs font-normal text-stone-500 ml-1">days</span>
                      </span>
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {currentSalary ? formatSalary(currentSalary.amount) : '—'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${employee.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                        }
                      `}
                    >
                      {employee.status === 'active' ? 'Active' : 'Archived'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-stone-500" />
                      </button>
                      {openMenuId === employee.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 z-20">
                            <button
                              onClick={() => { setOpenMenuId(null); onView?.(employee.id) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => { setOpenMenuId(null); onEdit?.(employee.id) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => { setOpenMenuId(null); onArchive?.(employee.id) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Archive className="w-4 h-4" />
                              {employee.status === 'archived' ? 'Restore' : 'Archive'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-stone-500 dark:text-stone-400">No employees found</p>
        </div>
      )}
    </div>
  )
}
