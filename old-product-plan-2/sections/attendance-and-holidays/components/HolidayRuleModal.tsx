import { useState } from 'react'
import {
  XIcon,
  CalendarDaysIcon,
  RepeatIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  CheckIcon,
  PalmtreeIcon,
} from 'lucide-react'

import type { Employee, HolidayRule } from '@/../product/sections/attendance-and-holidays/types'

// =============================================================================
// Types
// =============================================================================

export type HolidayRuleType = 'fixed' | 'recurring'

export interface HolidayRuleConfig {
  type: HolidayRuleType
  /** For fixed type: number of days per month */
  monthlyAllowance?: number
  /** For recurring type: days of week (0=Sunday, 6=Saturday) */
  weeklyOffDays?: number[]
  /** Auto-mark absence on scheduled off days */
  autoMarkAbsence: boolean
}

export interface HolidayRuleModalProps {
  employee: Employee
  existingRules?: HolidayRule[]
  isOpen: boolean
  onClose: () => void
  onSave?: (config: HolidayRuleConfig) => void
}

// =============================================================================
// Day Selector Component
// =============================================================================

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', full: 'Sunday' },
  { value: 1, label: 'Mon', full: 'Monday' },
  { value: 2, label: 'Tue', full: 'Tuesday' },
  { value: 3, label: 'Wed', full: 'Wednesday' },
  { value: 4, label: 'Thu', full: 'Thursday' },
  { value: 5, label: 'Fri', full: 'Friday' },
  { value: 6, label: 'Sat', full: 'Saturday' },
]

function DaySelector({
  selectedDays,
  onChange,
}: {
  selectedDays: number[]
  onChange: (days: number[]) => void
}) {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DAYS_OF_WEEK.map(day => {
        const isSelected = selectedDays.includes(day.value)
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`
              relative w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200
              ${isSelected
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }
            `}
            title={day.full}
          >
            {day.label}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                <CheckIcon className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function HolidayRuleModal({
  employee,
  existingRules = [],
  isOpen,
  onClose,
  onSave,
}: HolidayRuleModalProps) {
  // Derive initial state from existing rules
  const existingWeeklyOffs = existingRules
    .filter(r => r.employeeId === employee.id && r.type === 'weekly_off')
    .map(r => r.dayOfWeek)

  const [ruleType, setRuleType] = useState<HolidayRuleType>(
    existingWeeklyOffs.length > 0 ? 'recurring' : 'fixed'
  )
  const [monthlyAllowance, setMonthlyAllowance] = useState(4)
  const [weeklyOffDays, setWeeklyOffDays] = useState<number[]>(
    existingWeeklyOffs.length > 0 ? existingWeeklyOffs : [0] // Default to Sunday
  )
  const [autoMarkAbsence, setAutoMarkAbsence] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    onSave?.({
      type: ruleType,
      monthlyAllowance: ruleType === 'fixed' ? monthlyAllowance : undefined,
      weeklyOffDays: ruleType === 'recurring' ? weeklyOffDays : undefined,
      autoMarkAbsence,
    })
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
          <div className="relative px-6 py-5 border-b border-stone-100 dark:border-stone-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow-md">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Holiday Rules
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
            {/* Rule Type Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Holiday Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRuleType('fixed')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${ruleType === 'fixed'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                    }
                  `}
                >
                  <CalendarDaysIcon className={`w-5 h-5 mb-2 ${ruleType === 'fixed' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <p className={`font-semibold text-sm ${ruleType === 'fixed' ? 'text-amber-900 dark:text-amber-100' : 'text-stone-700 dark:text-stone-300'}`}>
                    Fixed Monthly
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Set days per month
                  </p>
                  {ruleType === 'fixed' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRuleType('recurring')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${ruleType === 'recurring'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                    }
                  `}
                >
                  <RepeatIcon className={`w-5 h-5 mb-2 ${ruleType === 'recurring' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <p className={`font-semibold text-sm ${ruleType === 'recurring' ? 'text-amber-900 dark:text-amber-100' : 'text-stone-700 dark:text-stone-300'}`}>
                    Weekly Recurring
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Same days each week
                  </p>
                  {ruleType === 'recurring' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Configuration based on type */}
            {ruleType === 'fixed' ? (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Days Per Month
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setMonthlyAllowance(Math.max(0, monthlyAllowance - 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={monthlyAllowance}
                      onChange={(e) => setMonthlyAllowance(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 h-12 text-center text-xl font-bold text-stone-900 dark:text-white bg-transparent outline-none"
                      min="0"
                      max="31"
                    />
                    <button
                      type="button"
                      onClick={() => setMonthlyAllowance(Math.min(31, monthlyAllowance + 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                    <PalmtreeIcon className="w-4 h-4" />
                    <span className="text-sm">holidays per month</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Weekly Off Days
                </label>
                <DaySelector
                  selectedDays={weeklyOffDays}
                  onChange={setWeeklyOffDays}
                />
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Select the days {employee.name} has off each week
                </p>
              </div>
            )}

            {/* Auto-mark Toggle */}
            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="flex-1">
                <p className="font-semibold text-stone-900 dark:text-white text-sm">
                  Auto-mark Absence
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Automatically record absences on scheduled off days
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoMarkAbsence(!autoMarkAbsence)}
                className={`
                  relative w-14 h-8 rounded-full transition-all duration-200
                  ${autoMarkAbsence
                    ? 'bg-amber-500'
                    : 'bg-stone-300 dark:bg-stone-600'
                  }
                `}
              >
                <div
                  className={`
                    absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-200
                    ${autoMarkAbsence ? 'left-7' : 'left-1'}
                  `}
                />
              </button>
            </div>
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
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95"
            >
              Save Rules
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
