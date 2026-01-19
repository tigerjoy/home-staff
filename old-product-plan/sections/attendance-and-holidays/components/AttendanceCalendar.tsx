import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Palmtree,
  Stethoscope
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  AttendanceAndHolidaysProps,
  Employee,
  LeaveRecord,
  Holiday,
  HolidayRule
} from '../types'

export function AttendanceCalendar({
  employees,
  leaveRecords,
  holidays,
  holidayRules,
  selectedDate,
  onAddLeaveRecord,
  onUpdateLeaveRecord,
  onRemoveLeaveRecord,
  onAddHoliday,
  onRemoveHoliday,
  onDateChange
}: AttendanceAndHolidaysProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate || '2024-03-01'))
  const [viewMode, setViewMode] = useState<'all' | string>('all')

  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, 1)
    const days = []

    // Fill previous month days
    const firstDay = date.getDay()
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(year, month, 0 - (firstDay - i - 1))
      days.push({ date: prevDate, currentMonth: false })
    }

    // Current month days
    while (date.getMonth() === month) {
      days.push({ date: new Date(date), currentMonth: true })
      date.setDate(date.getDate() + 1)
    }

    // Fill next month days to complete grid (42 cells for 6 weeks)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, currentMonth: false })
    }

    return days
  }, [currentDate])

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(next)
    onDateChange?.(next.toISOString().split('T')[0])
  }

  const prevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(prev)
    onDateChange?.(prev.toISOString().split('T')[0])
  }

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayOfWeek = date.getDay()

    // Public Holiday
    const holiday = holidays.find(h => h.date === dateStr)
    if (holiday) return { type: 'holiday', name: holiday.name }

    if (viewMode === 'all') {
      const dayLeaves = leaveRecords.filter(r => r.date === dateStr)
      if (dayLeaves.length > 0) {
        return { type: 'mixed', count: dayLeaves.length }
      }
      return { type: 'present' }
    } else {
      // Individual view
      const isOffDay = holidayRules.some(r => r.employeeId === viewMode && r.dayOfWeek === dayOfWeek)
      if (isOffDay) return { type: 'off-day' }

      const leave = leaveRecords.find(r => r.employeeId === viewMode && r.date === dateStr)
      if (leave) return { type: leave.type, id: leave.id }

      return { type: 'present' }
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-[Nunito_Sans]">
            Attendance Calendar
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {viewMode === 'all'
              ? 'Overview for all household staff'
              : `Viewing attendance for ${employees.find(e => e.id === viewMode)?.name}`}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <button
            onClick={() => setViewMode('all')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              viewMode === 'all'
                ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100 shadow-inner"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
            )}
          >
            <Users size={16} />
            All Staff
          </button>
          <div className="w-px h-4 bg-stone-200 dark:bg-stone-800" />
          <select
            value={viewMode === 'all' ? '' : viewMode}
            onChange={(e) => setViewMode(e.target.value || 'all')}
            className="bg-transparent text-sm font-medium text-stone-600 dark:text-stone-400 outline-none pr-4"
          >
            <option value="">Switch Employee...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 min-w-[150px]">
            {monthName} {year}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={() => onAddHoliday?.({ date: currentDate.toISOString().split('T')[0], name: 'New Holiday', type: 'other' })}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-600/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-stone-50 dark:bg-stone-900/50 py-3 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-500">
              {day}
            </span>
          </div>
        ))}
        {daysInMonth.map(({ date, currentMonth }, i) => {
          const status = getDayStatus(date)
          const isToday = new Date().toDateString() === date.toDateString()
          const dateStr = date.toISOString().split('T')[0]

          return (
            <div
              key={i}
              onClick={() => {
                if (viewMode !== 'all') {
                  if (status.type === 'present') {
                    onAddLeaveRecord?.({ employeeId: viewMode, date: dateStr, type: 'casual' })
                  } else if (status.id) {
                    onRemoveLeaveRecord?.(status.id)
                  }
                }
              }}
              className={cn(
                "min-h-[100px] p-2 transition-all cursor-pointer group relative",
                currentMonth ? "bg-white dark:bg-stone-900" : "bg-stone-50/50 dark:bg-stone-950/50",
                "hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
              )}
            >
              <div className="flex justify-between items-start">
                <span className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-amber-600 text-white" : "text-stone-400 dark:text-stone-500",
                  currentMonth && !isToday && "text-stone-700 dark:text-stone-300"
                )}>
                  {date.getDate()}
                </span>

                {status.type === 'holiday' && (
                  <Palmtree size={14} className="text-orange-500" />
                )}
              </div>

              <div className="mt-2 space-y-1">
                {status.type === 'holiday' && (
                  <div className="px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-tighter truncate">
                    {status.name}
                  </div>
                )}

                {status.type === 'off-day' && (
                  <div className="flex items-center gap-1 text-[10px] font-medium text-stone-400 dark:text-stone-600 italic">
                    <Clock size={10} />
                    Weekly Off
                  </div>
                )}

                {status.type === 'sick' && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-900/30 text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-tighter">
                    <Stethoscope size={10} />
                    Sick Leave
                  </div>
                )}

                {status.type === 'casual' && (
                  <div className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tighter">
                    Casual Leave
                  </div>
                )}

                {status.type === 'unpaid' && (
                  <div className="px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tighter">
                    Unpaid Leave
                  </div>
                )}

                {status.type === 'mixed' && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex -space-x-1.5">
                      {[...Array(Math.min(status.count, 3))].map((_, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full bg-orange-400 border border-white dark:border-stone-900" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                      {status.count} Absent
                    </span>
                  </div>
                )}

                {status.type === 'present' && currentMonth && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    <CheckCircle2 size={10} />
                    Present
                  </div>
                )}
              </div>

              {/* Interaction Hint */}
              {viewMode !== 'all' && currentMonth && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/20 rounded-lg pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 items-center justify-center bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-200" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Sick</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Casual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Unpaid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Today</span>
        </div>
      </div>
    </div>
  )
}
