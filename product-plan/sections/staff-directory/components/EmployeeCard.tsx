import { Phone, MapPin, Calendar, MoreVertical, Eye, Pencil, Archive, Palmtree, CalendarClock, Wrench, IndianRupee } from 'lucide-react'
import { useState } from 'react'
import type { Employee } from '../types'

interface EmployeeCardProps {
  employee: Employee
  onView?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

export function EmployeeCard({ employee, onView, onEdit, onArchive }: EmployeeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const { employment } = employee
  const isMonthly = employment.employmentType === 'monthly'
  const isArchived = employment.status === 'archived'

  // Get primary phone
  const primaryPhone = employee.phoneNumbers[0]
  // Get current address
  const currentAddress = employee.addresses.find(a => a.label === 'Current') || employee.addresses[0]

  // Generate initials for avatar
  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
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
    <div
      className={`
        group relative bg-white dark:bg-stone-900 rounded-2xl border
        ${isArchived
          ? 'border-stone-200 dark:border-stone-800 opacity-60'
          : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
        }
        transition-all duration-200 hover:shadow-lg overflow-hidden
      `}
    >
      {/* Status & Type Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        {isArchived && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
            Archived
          </span>
        )}
        <span className={`
          text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1
          ${isMonthly
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
          }
        `}>
          {isMonthly ? (
            <CalendarClock className="w-3 h-3" />
          ) : (
            <Wrench className="w-3 h-3" />
          )}
          {isMonthly ? 'Monthly' : 'Ad-hoc'}
        </span>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          <MoreVertical className="w-4 h-4 text-stone-500" />
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 z-20">
              <button
                onClick={() => { setMenuOpen(false); onView?.() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); onEdit?.() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => { setMenuOpen(false); onArchive?.() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Archive className="w-4 h-4" />
                {isArchived ? 'Restore' : 'Archive'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div
        className="p-5 pt-12 cursor-pointer"
        onClick={onView}
      >
        {/* Avatar & Name */}
        <div className="flex items-start gap-4 mb-4">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-amber-100 dark:ring-amber-900"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-2 ring-amber-100 dark:ring-amber-900">
              <span className="text-lg font-bold text-white">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
              {employee.name}
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              {employment.role}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {primaryPhone && (
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Phone className="w-4 h-4 text-stone-400" />
              <span className="truncate">{primaryPhone.number}</span>
            </div>
          )}
          {currentAddress && (
            <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
              <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{currentAddress.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>Since {formatDate(employment.startDate)}</span>
          </div>
        </div>

        {/* Footer - Holiday Balance & Salary */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            {isMonthly && employment.holidayBalance !== null ? (
              <div className="flex items-center gap-2">
                <Palmtree className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {employment.holidayBalance}
                  <span className="text-xs font-normal text-stone-500 ml-1">days left</span>
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-400 dark:text-stone-500">No attendance tracking</span>
            )}
            {isMonthly && employment.currentSalary !== null ? (
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {formatSalary(employment.currentSalary)}
                <span className="text-xs font-normal text-stone-500">/mo</span>
              </span>
            ) : (
              <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                <IndianRupee className="w-3 h-3" />
                <span>Per job</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
