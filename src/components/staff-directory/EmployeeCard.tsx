import { Phone, MapPin, Calendar, MoreVertical, Eye, Pencil, Archive, Palmtree } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { UIEmployee } from '../../types'
import { getSignedPhotoUrl } from '../../lib/storage/documents'

interface EmployeeCardProps {
  employee: UIEmployee
  onView?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

export function EmployeeCard({ employee, onView, onEdit, onArchive }: EmployeeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signedPhotoUrl, setSignedPhotoUrl] = useState<string | null>(null)
  const [photoLoading, setPhotoLoading] = useState(false)

  // Fetch signed URL for photo
  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!employee.photo || employee.photo.startsWith('blob:')) {
        setSignedPhotoUrl(employee.photo)
        return
      }

      setPhotoLoading(true)
      try {
        const signedUrl = await getSignedPhotoUrl(employee.photo)
        setSignedPhotoUrl(signedUrl)
      } catch (error) {
        console.error('Error generating signed photo URL:', error)
        // Fallback to original URL if signed URL generation fails
        setSignedPhotoUrl(employee.photo)
      } finally {
        setPhotoLoading(false)
      }
    }

    fetchSignedUrl()
  }, [employee.photo])

  // Get current role (first in employment history with no end date)
  const currentRole = employee.employmentHistory.find(e => e.endDate === null)
  // Get primary phone
  const primaryPhone = employee.phoneNumbers[0]
  // Get current address
  const currentAddress = employee.addresses.find(a => a.label === 'Current') || employee.addresses[0]
  // Get current salary
  const currentSalary = employee.salaryHistory[0]
  // Infer employment type from salary (if salary exists and > 0, it's monthly, otherwise adhoc)
  const employmentType = currentSalary && currentSalary.amount > 0 ? 'monthly' : 'adhoc'

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
        ${employee.status === 'archived'
          ? 'border-stone-200 dark:border-stone-800 opacity-60'
          : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
        }
        transition-all duration-200 hover:shadow-lg overflow-hidden
      `}
    >
      {/* Status Badge */}
      {employee.status === 'archived' && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
            Archived
          </span>
        </div>
      )}

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
                {employee.status === 'archived' ? 'Restore' : 'Archive'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div
        className="p-5 cursor-pointer"
        onClick={onView}
      >
        {/* Avatar & Name */}
        <div className="flex items-start gap-4 mb-4">
          {photoLoading ? (
            <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center ring-2 ring-amber-100 dark:ring-amber-900">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : signedPhotoUrl ? (
            <img
              src={signedPhotoUrl}
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
            {currentRole && (
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  {currentRole.role}
                </p>
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${employmentType === 'monthly'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    }
                  `}
                >
                  {employmentType === 'monthly' ? 'Monthly' : 'Ad-hoc'}
                </span>
              </div>
            )}
            {currentRole && (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {currentRole.department}
              </p>
            )}
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
          {currentRole && (
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Since {formatDate(currentRole.startDate)}</span>
            </div>
          )}
        </div>

        {/* Footer - Holiday Balance & Salary */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            {employmentType === 'monthly' ? (
              <div className="flex items-center gap-2">
                <Palmtree className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {employee.holidayBalance}
                  <span className="text-xs font-normal text-stone-500 ml-1">days left</span>
                </span>
              </div>
            ) : (
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Ad-hoc employee
              </div>
            )}
            {employmentType === 'monthly' && currentSalary ? (
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {formatSalary(currentSalary.amount)}
                <span className="text-xs font-normal text-stone-500">/mo</span>
              </span>
            ) : employmentType === 'adhoc' ? (
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Per job
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
