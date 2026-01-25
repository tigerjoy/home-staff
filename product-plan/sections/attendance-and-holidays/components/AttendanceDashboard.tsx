import { format, isSameDay, isWithinInterval, parseISO } from 'date-fns'
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
  PauseCircleIcon,
  HomeIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'

import type {
  AttendanceAndHolidaysProps,
  AttendanceEmployment,
  AbsenceRecord,
  InactivityPeriod,
  HolidayRule,
} from '../types'

// =============================================================================
// Helper Components
// =============================================================================

type DayStatus = 'present' | 'absent' | 'public_holiday' | 'weekly_off' | 'inactive'

function StatusBadge({ type }: { type: DayStatus }) {
  const styles = {
    present: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    public_holiday: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    weekly_off: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-500 border-stone-200 dark:border-stone-700',
    inactive: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  }

  const labels = {
    present: 'Present',
    absent: 'Absent',
    public_holiday: 'Public Holiday',
    weekly_off: 'Weekly Off',
    inactive: 'Inactive',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

function EmploymentRow({
  employment,
  status,
  absenceRecord,
  inactivityPeriod,
  holidayRule,
  onMarkAbsent,
  onMarkPresent,
  onMarkInactive,
}: {
  employment: AttendanceEmployment
  status: DayStatus
  absenceRecord?: AbsenceRecord
  inactivityPeriod?: InactivityPeriod
  holidayRule?: HolidayRule
  onMarkAbsent: (applyToOther: boolean) => void
  onMarkPresent: () => void
  onMarkInactive: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showOtherHouseholdsPrompt, setShowOtherHouseholdsPrompt] = useState(false)
  const isInactive = employment.status === 'inactive' || !!inactivityPeriod

  const initials = employment.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleAbsentClick = () => {
    if (employment.otherHouseholds.length > 0) {
      setShowOtherHouseholdsPrompt(true)
    } else {
      onMarkAbsent(false)
    }
    setIsOpen(false)
  }

  return (
    <>
      <div className={`
        group relative flex items-center justify-between p-4 bg-white dark:bg-stone-900 border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md
        ${isInactive
          ? 'border-amber-300 dark:border-amber-700 opacity-60'
          : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
        }
      `}>
        <div className="flex items-center gap-4">
          <div className="relative">
            {employment.avatar ? (
              <img
                src={employment.avatar}
                alt={employment.name}
                className={`w-12 h-12 rounded-full object-cover border-2 ${
                  isInactive ? 'border-amber-200 dark:border-amber-800 grayscale' : 'border-stone-100 dark:border-stone-800'
                }`}
              />
            ) : (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 ${
                isInactive ? 'border-amber-200 dark:border-amber-800 grayscale' : 'border-white dark:border-stone-900'
              }`}>
                <span className="text-sm font-bold text-white">{initials}</span>
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center ${
              isInactive ? 'bg-amber-400' :
              status === 'present' ? 'bg-emerald-500' :
              status === 'absent' ? 'bg-red-500' :
              'bg-stone-300 dark:bg-stone-600'
            }`}>
              {isInactive ? <PauseCircleIcon className="w-3 h-3 text-white" /> :
               status === 'present' && <CheckCircle2Icon className="w-3 h-3 text-white" />}
              {status === 'absent' && <XIcon className="w-3 h-3 text-white" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-900 dark:text-white">{employment.name}</h3>
              {isInactive && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Inactive
                </span>
              )}
              {employment.otherHouseholds.length > 0 && !isInactive && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                  <HomeIcon className="w-3 h-3" />
                  +{employment.otherHouseholds.length}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{employment.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Holiday Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <PalmtreeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {employment.holidayBalance}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">days</span>
          </div>

          {status !== 'present' && !isInactive && (
            <div className="flex flex-col items-end">
              <StatusBadge type={status} />
              {absenceRecord?.reason && (
                <span className="text-xs text-stone-500 mt-1 max-w-[150px] truncate text-right">
                  {absenceRecord.reason}
                </span>
              )}
            </div>
          )}

          {status === 'present' && !isInactive && (
             <span className="px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
               Present
             </span>
          )}

          {inactivityPeriod && (
            <div className="flex flex-col items-end">
              <StatusBadge type="inactive" />
              {inactivityPeriod.reason && (
                <span className="text-xs text-stone-500 mt-1 max-w-[150px] truncate text-right">
                  {inactivityPeriod.reason}
                </span>
              )}
            </div>
          )}

          {!isInactive && status !== 'public_holiday' && status !== 'weekly_off' && (
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
                    {status === 'absent' ? (
                      <button
                        onClick={() => {
                          onMarkPresent()
                          setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Mark Present
                      </button>
                    ) : (
                      <button
                        onClick={handleAbsentClick}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Mark Absent
                      </button>
                    )}
                    <div className="h-px bg-stone-100 dark:bg-stone-800 my-1" />
                    <button
                      onClick={() => {
                        onMarkInactive()
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-amber-600 dark:text-amber-400 flex items-center gap-2"
                    >
                      <PauseCircleIcon className="w-4 h-4" />
                      Mark Inactive
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Other Households Prompt Modal */}
      {showOtherHouseholdsPrompt && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowOtherHouseholdsPrompt(false)} />
          <div className="fixed inset-x-4 top-[20%] max-w-sm mx-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl z-50 p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Apply to Other Households?
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
              {employment.name} also works at {employment.otherHouseholds.map(h => h.name).join(', ')}.
              Mark as absent there too?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onMarkAbsent(false)
                  setShowOtherHouseholdsPrompt(false)
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors"
              >
                This Household Only
              </button>
              <button
                onClick={() => {
                  onMarkAbsent(true)
                  setShowOtherHouseholdsPrompt(false)
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors"
              >
                Apply to All
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass
}: {
  label: string
  value: string | number
  icon: any
  colorClass: string
}) {
  return (
    <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
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
  employments,
  absenceRecords,
  inactivityPeriods,
  holidayRules,
  publicHolidays,
  selectedDate = new Date().toISOString().split('T')[0],
  onAddAbsence,
  onRemoveAbsence,
  onMarkInactive,
  onMarkActive,
  onAddPublicHoliday,
  onDateChange,
}: AttendanceAndHolidaysProps) {
  const currentDate = parseISO(selectedDate)

  // Check if employment is in an inactivity period on the selected date
  const getInactivityPeriod = (employmentId: string): InactivityPeriod | undefined => {
    return inactivityPeriods.find(ip => {
      if (ip.employmentId !== employmentId) return false
      const start = parseISO(ip.startDate)
      const end = ip.endDate ? parseISO(ip.endDate) : new Date('9999-12-31')
      return isWithinInterval(currentDate, { start, end })
    })
  }

  // Get the holiday rule for an employment
  const getHolidayRule = (employmentId: string): HolidayRule | undefined => {
    return holidayRules.find(r => r.employmentId === employmentId)
  }

  // Helper to get status for an employment on a specific date
  const getStatus = (employmentId: string): { status: DayStatus; record?: AbsenceRecord; inactivity?: InactivityPeriod } => {
    // Check for inactivity period first
    const inactivity = getInactivityPeriod(employmentId)
    if (inactivity) return { status: 'inactive', inactivity }

    // Check for absence records
    const absence = absenceRecords.find(
      r => r.employmentId === employmentId && r.date === selectedDate
    )
    if (absence) return { status: 'absent', record: absence }

    // Check for public holidays
    const publicHoliday = publicHolidays.find(h => h.date === selectedDate)
    if (publicHoliday) return { status: 'public_holiday' }

    // Check for weekly off
    const dayOfWeek = currentDate.getDay()
    const rule = getHolidayRule(employmentId)
    if (rule?.weeklyOffDays.includes(dayOfWeek)) {
      return { status: 'weekly_off' }
    }

    // Default to present
    return { status: 'present' }
  }

  // Calculate stats
  const stats = employments.reduce(
    (acc, emp) => {
      const inactivity = getInactivityPeriod(emp.id)
      if (inactivity) {
        acc.inactive++
        return acc
      }

      const { status } = getStatus(emp.id)
      if (status === 'present') acc.present++
      else if (status === 'absent') acc.absent++
      else acc.off++
      return acc
    },
    { present: 0, absent: 0, off: 0, inactive: 0 }
  )

  // Get upcoming absences
  const upcomingAbsences = absenceRecords
    .filter(r => parseISO(r.date) > new Date())
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  // Get current inactivity periods
  const currentInactivities = inactivityPeriods.filter(ip => {
    const start = parseISO(ip.startDate)
    const end = ip.endDate ? parseISO(ip.endDate) : new Date('9999-12-31')
    return isWithinInterval(new Date(), { start, end })
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Header with Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Track daily presence for Monthly staff
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Present Today"
          value={stats.present}
          icon={CheckCircle2Icon}
          colorClass="bg-emerald-500"
        />
        <StatCard
          label="Absent Today"
          value={stats.absent}
          icon={UserIcon}
          colorClass="bg-red-500"
        />
        <StatCard
          label="Off / Holiday"
          value={stats.off}
          icon={PalmtreeIcon}
          colorClass="bg-indigo-500"
        />
        <StatCard
          label="Inactive"
          value={stats.inactive}
          icon={AlertCircleIcon}
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              Monthly Staff
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400">
                {employments.length}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {employments.map(employment => {
              const { status, record, inactivity } = getStatus(employment.id)
              const rule = getHolidayRule(employment.id)

              return (
                <EmploymentRow
                  key={employment.id}
                  employment={employment}
                  status={status}
                  absenceRecord={record}
                  inactivityPeriod={inactivity}
                  holidayRule={rule}
                  onMarkAbsent={(applyToOther) => {
                    onAddAbsence?.(employment.id, selectedDate, undefined, applyToOther)
                  }}
                  onMarkPresent={() => {
                    if (record) onRemoveAbsence?.(record.id)
                  }}
                  onMarkInactive={() => {
                    onMarkInactive?.(employment.id, selectedDate, undefined, false)
                  }}
                />
              )
            })}
          </div>

          {employments.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <UserIcon className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-stone-500 dark:text-stone-400">
                No Monthly staff to track
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                Add Monthly employees to see attendance tracking
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Inactivities */}
          {currentInactivities.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PauseCircleIcon className="w-4 h-4" />
                Currently Inactive
              </h3>
              <div className="space-y-3">
                {currentInactivities.map(ip => {
                  const emp = employments.find(e => e.id === ip.employmentId)
                  return (
                    <div key={ip.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                        {emp?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{emp?.name}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Since {format(parseISO(ip.startDate), 'MMM d')}
                          {ip.endDate && ` until ${format(parseISO(ip.endDate), 'MMM d')}`}
                        </p>
                        {ip.reason && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 truncate">{ip.reason}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onMarkActive?.(ip.employmentId, new Date().toISOString().split('T')[0])}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        End
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upcoming Absences */}
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-4">
              Recent Absences
            </h3>

            {upcomingAbsences.length > 0 ? (
              <div className="space-y-4">
                {upcomingAbsences.map(absence => {
                  const emp = employments.find(e => e.id === absence.employmentId)
                  return (
                    <div key={absence.id} className="flex gap-3">
                      <div className="flex-col items-center justify-center min-w-[3rem] text-center hidden sm:flex">
                        <span className="text-xs font-bold text-stone-400 uppercase">
                          {format(parseISO(absence.date), 'MMM')}
                        </span>
                        <span className="text-xl font-bold text-stone-900 dark:text-white">
                          {format(parseISO(absence.date), 'd')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-stone-900 dark:text-white truncate">
                            {emp?.name}
                          </span>
                          {absence.appliedToOtherHouseholds && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                              All HH
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 truncate">{absence.reason || 'No reason given'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">No upcoming absences</p>
            )}

            <button className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors border border-dashed border-amber-200 dark:border-amber-800">
              <PlusIcon className="w-4 h-4" />
              Schedule Absence
            </button>
          </div>

          {/* Monthly Summary */}
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
                <span className="font-semibold">{publicHolidays.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
