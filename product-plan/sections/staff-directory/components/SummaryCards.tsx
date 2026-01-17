import { Users, UserCheck, UserX, Briefcase } from 'lucide-react'
import type { Summary } from '../types'

interface SummaryCardsProps {
  summary: Summary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const topRoles = Object.entries(summary.roleBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Staff */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-amber-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {summary.totalStaff}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Total Staff
        </p>
      </div>

      {/* Active Staff */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {summary.activeStaff}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Active
        </p>
      </div>

      {/* Archived Staff */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 transition-all hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
            <UserX className="w-5 h-5 text-stone-500 dark:text-stone-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {summary.archivedStaff}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Archived
        </p>
      </div>

      {/* Roles Breakdown */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950">
            <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {Object.keys(summary.roleBreakdown).length}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Roles
        </p>
        {topRoles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="flex flex-wrap gap-1.5">
              {topRoles.map(([role, count]) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                >
                  {role}
                  <span className="font-semibold">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
