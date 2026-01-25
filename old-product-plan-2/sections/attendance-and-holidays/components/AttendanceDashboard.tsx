import { format } from 'date-fns'
import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  PalmtreeIcon,
  PlusIcon,
  UserIcon,
  AlertCircleIcon,
} from 'lucide-react'
import { useState } from 'react'

import type {
  AttendanceAndHolidaysProps,
  Employee,
  LeaveRecord,
  LeaveType,
} from '@/../product/sections/attendance-and-holidays/types'

// =============================================================================
// Helper Components
// =============================================================================

function StatusBadge({ type }: { type: LeaveType | 'present' | 'holiday' | 'off' }) {
  const styles = {
    present: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    sick: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    casual: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    unpaid: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700',
    other: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    holiday: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    off: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-500 border-stone-200 dark:border-stone-700',
  }

  const labels = {
    present: 'Present',
    sick: 'Sick Leave',
    casual: 'Casual Leave',
    paid: 'Paid Leave',
    unpaid: 'Unpaid Leave',
    other: 'Leave',
    holiday: 'Holiday',
    off: 'Weekly Off',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

function EmployeeRow({
  employee,
  status,
  leaveRecord,
  onUpdateStatus,
}: {
  employee: Employee
  status: LeaveType | 'present' | 'holiday' | 'off' | 'inactive'
  leaveRecord?: LeaveRecord
  onUpdateStatus: (type: LeaveType | 'present') => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isInactive = employee.status === 'inactive'

  return (
    <div className={`
      group relative flex items-center justify-between p-4 bg-white dark:bg-stone-900 border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md
      ${isInactive
        ? 'border-amber-300 dark:border-amber-700 opacity-60'
        : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
      }
    `}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={employee.avatar}
            alt={employee.name}
            className={`w-12 h-12 rounded-full object-cover border-2 ${
              isInactive ? 'border-amber-200 dark:border-amber-800 grayscale' : 'border-stone-100 dark:border-stone-800'
            }`}
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center ${
            isInactive ? 'bg-amber-400' :
            status === 'present' ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'
          }`}>
            {isInactive ? <AlertCircleIcon className="w-3 h-3 text-white" /> :
             status === 'present' && <CheckCircle2Icon className="w-3 h-3 text-white" />}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-900 dark:text-white">{employee.name}</h3>
            {isInactive && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{employee.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Holiday Balance */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <PalmtreeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {employee.holidayBalance}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">days</span>
        </div>

        {status !== 'present' && !isInactive && (
          <div className="flex flex-col items-end">
            <StatusBadge type={status} />
            {leaveRecord?.notes && (
              <span className="text-xs text-stone-500 mt-1 max-w-[150px] truncate text-right">
                {leaveRecord.notes}
              </span>
            )}
          </div>
        )}

        {status === 'present' && !isInactive && (
           <span className="px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
             Present
           </span>
        )}

        {!isInactive && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <MoreVerticalIcon className="w-5 h-5" />
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      onUpdateStatus('present')
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Mark Present
                  </button>
                  <div className="h-px bg-stone-100 dark:bg-stone-800 my-1" />
                  <div className="px-4 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wider">Mark Leave</div>
                  {(['sick', 'casual', 'paid', 'unpaid'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        onUpdateStatus(type)
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 capitalize pl-8"
                    >
                      {type} Leave
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  colorClass
}: {
  label: string
  value: string | number
  icon: any
  trend?: string
  colorClass: string
}) {
  return (
    <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-stone-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function AttendanceDashboard({
  employees,
  leaveRecords,
  holidays,
  holidayRules,
  selectedDate = new Date().toISOString().split('T')[0],
  onAddLeaveRecord,
  onUpdateLeaveRecord,
  onRemoveLeaveRecord,
  onDateChange,
}: AttendanceAndHolidaysProps) {
  const currentDate = new Date(selectedDate)

  // Helper to get status for an employee on a specific date
  const getStatus = (employeeId: string) => {
    // Check for leave records
    const leave = leaveRecords.find(
      r => r.employeeId === employeeId && r.date === selectedDate
    )
    if (leave) return { status: leave.type, record: leave }

    // Check for holidays
    const holiday = holidays.find(h => h.date === selectedDate)
    if (holiday) return { status: 'holiday', record: undefined }

    // Check for weekly off
    const dayOfWeek = currentDate.getDay()
    const rule = holidayRules.find(
      r => r.employeeId === employeeId && r.dayOfWeek === dayOfWeek
    )
    if (rule) return { status: 'off', record: undefined }

    // Default to present
    return { status: 'present', record: undefined }
  }

  // Calculate stats
  const stats = employees.reduce(
    (acc, emp) => {
      const { status } = getStatus(emp.id)
      if (status === 'present') acc.present++
      else if (status === 'sick' || status === 'casual' || status === 'paid' || status === 'unpaid') acc.absent++
      else acc.off++
      return acc
    },
    { present: 0, absent: 0, off: 0 }
  )

  const upcomingLeaves = leaveRecords
    .filter(r => new Date(r.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Header with Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Manage daily staff presence and leaves
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <button
            onClick={() => {
              const prev = new Date(currentDate)
              prev.setDate(prev.getDate() - 1)
              onDateChange?.(prev.toISOString().split('T')[0])
            }}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="px-4 text-center min-w-[140px]">
            <span className="block text-sm font-semibold text-stone-900 dark:text-white">
              {format(currentDate, 'MMMM d, yyyy')}
            </span>
            <span className="block text-xs text-stone-500">
              {format(currentDate, 'EEEE')}
            </span>
          </div>
          <button
            onClick={() => {
              const next = new Date(currentDate)
              next.setDate(next.getDate() + 1)
              onDateChange?.(next.toISOString().split('T')[0])
            }}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Present Today"
          value={stats.present}
          icon={CheckCircle2Icon}
          colorClass="bg-emerald-500"
        />
        <StatCard
          label="On Leave / Absent"
          value={stats.absent}
          icon={UserIcon}
          colorClass="bg-amber-500"
        />
        <StatCard
          label="Weekly Off / Holiday"
          value={stats.off}
          icon={PalmtreeIcon}
          colorClass="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              Staff List
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400">
                {employees.length}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {employees.map(employee => {
              const { status, record } = getStatus(employee.id)

              return (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  status={status as any}
                  leaveRecord={record}
                  onUpdateStatus={(newStatus) => {
                    if (newStatus === 'present') {
                      if (record) onRemoveLeaveRecord?.(record.id)
                    } else {
                      if (record) {
                        onUpdateLeaveRecord?.(record.id, { type: newStatus })
                      } else {
                        onAddLeaveRecord?.({
                          employeeId: employee.id,
                          date: selectedDate,
                          type: newStatus,
                          notes: '' // Could open a modal to ask for notes
                        })
                      }
                    }
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Leaves */}
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-4">
              Upcoming Leaves
            </h3>

            {upcomingLeaves.length > 0 ? (
              <div className="space-y-4">
                {upcomingLeaves.map(leave => {
                  const emp = employees.find(e => e.id === leave.employeeId)
                  return (
                    <div key={leave.id} className="flex gap-3">
                      <div className="flex-col items-center justify-center min-w-[3rem] text-center hidden sm:flex">
                        <span className="text-xs font-bold text-stone-400 uppercase">
                          {format(new Date(leave.date), 'MMM')}
                        </span>
                        <span className="text-xl font-bold text-stone-900 dark:text-white">
                          {format(new Date(leave.date), 'd')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <img src={emp?.avatar} className="w-5 h-5 rounded-full" alt="" />
                          <span className="text-sm font-medium text-stone-900 dark:text-white truncate">
                            {emp?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <StatusBadge type={leave.type} />
                          <span className="truncate">{leave.notes}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">No upcoming leaves scheduled</p>
            )}

            <button className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors border border-dashed border-amber-200 dark:border-amber-800">
              <PlusIcon className="w-4 h-4" />
              Schedule Leave
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-medium text-indigo-100 mb-1">Monthly Summary</h3>
            <p className="text-2xl font-bold mb-6">{format(currentDate, 'MMMM yyyy')}</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-100">Total Working Days</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-100">Avg. Attendance</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-100">Public Holidays</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
