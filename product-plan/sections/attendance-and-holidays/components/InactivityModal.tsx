import { useState } from 'react'
import {
  XIcon,
  CalendarIcon,
  UserXIcon,
  UserCheckIcon,
  AlertCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

import type { Employee } from '../types'

// =============================================================================
// Types
// =============================================================================

export interface InactivityPeriod {
  startDate: string
  endDate?: string
  reason?: string
}

export interface InactivityModalProps {
  employee: Employee
  isOpen: boolean
  onClose: () => void
  onMarkInactive?: (startDate: string, reason?: string) => void
  onMarkActive?: (endDate: string) => void
}

// =============================================================================
// Simple Date Picker Component
// =============================================================================

function SimpleDatePicker({
  selectedDate,
  onChange,
  label,
}: {
  selectedDate: string
  onChange: (date: string) => void
  label: string
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const monthName = currentMonth.toLocaleString('default', { month: 'long' })
  const year = currentMonth.getFullYear()

  const daysInMonth = () => {
    const days: (Date | null)[] = []
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Fill in blanks for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d))
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toISOString().split('T')[0] === selectedDate
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        {label}
      </label>

      <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-stone-400 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth().map((date, i) => (
            <div key={i} className="aspect-square">
              {date ? (
                <button
                  type="button"
                  onClick={() => onChange(date.toISOString().split('T')[0])}
                  className={`
                    w-full h-full rounded-lg text-sm font-medium transition-all duration-150
                    ${isSelected(date)
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                      : isToday(date)
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function InactivityModal({
  employee,
  isOpen,
  onClose,
  onMarkInactive,
  onMarkActive,
}: InactivityModalProps) {
  const isCurrentlyInactive = employee.status === 'inactive'
  const today = new Date().toISOString().split('T')[0]

  const [selectedDate, setSelectedDate] = useState(today)
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (isCurrentlyInactive) {
      onMarkActive?.(selectedDate)
    } else {
      onMarkInactive?.(selectedDate, reason || undefined)
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            relative px-6 py-5 border-b border-stone-100 dark:border-stone-800
            ${isCurrentlyInactive
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20'
            }
          `}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow-md">
                  <img
                    src={employee.avatar || undefined}
                    alt={employee.name}
                    className={`w-full h-full object-cover ${isCurrentlyInactive ? 'grayscale' : ''}`}
                  />
                </div>
                <div className={`
                  absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-stone-800 flex items-center justify-center
                  ${isCurrentlyInactive ? 'bg-amber-500' : 'bg-emerald-500'}
                `}>
                  {isCurrentlyInactive
                    ? <AlertCircleIcon className="w-3 h-3 text-white" />
                    : <UserCheckIcon className="w-3 h-3 text-white" />
                  }
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  {isCurrentlyInactive ? 'Mark Active' : 'Mark Inactive'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {employee.name} &middot; {employee.role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-white/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Info */}
            <div className={`
              flex items-start gap-3 p-4 rounded-xl border
              ${isCurrentlyInactive
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
              }
            `}>
              {isCurrentlyInactive ? (
                <>
                  <AlertCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                      Currently Inactive
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      This employee is marked as inactive. Choose a date to reactivate them.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ClockIcon className="w-5 h-5 text-stone-500 dark:text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                      Long-term Absence
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Mark this employee as inactive for an extended period. Attendance tracking will pause.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Date Picker */}
            <SimpleDatePicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              label={isCurrentlyInactive ? 'Reactivation Date' : 'Start Date'}
            />

            {/* Reason (only for marking inactive) */}
            {!isCurrentlyInactive && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Extended leave, Medical leave, Personal reasons..."
                  rows={3}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                />
              </div>
            )}

            {/* Back-dating notice */}
            {selectedDate < today && (
              <div className="flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
                <ClockIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  You're selecting a past date. This will back-date the {isCurrentlyInactive ? 'reactivation' : 'inactivity period'} to ensure records are accurate.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`
                px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2
                ${isCurrentlyInactive
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                }
              `}
            >
              {isCurrentlyInactive ? (
                <>
                  <UserCheckIcon className="w-4 h-4" />
                  Mark Active
                </>
              ) : (
                <>
                  <UserXIcon className="w-4 h-4" />
                  Mark Inactive
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
