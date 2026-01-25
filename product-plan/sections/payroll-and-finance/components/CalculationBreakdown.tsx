import { X, TrendingUp, TrendingDown, Minus, AlertTriangle, Gift, Coins, Calendar } from 'lucide-react'
import type { MonthlyPayrollRecord } from '../types'

// =============================================================================
// Types
// =============================================================================

interface CalculationBreakdownProps {
  record: MonthlyPayrollRecord
  onClose?: () => void
}

// =============================================================================
// Helper
// =============================================================================

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

// =============================================================================
// Component
// =============================================================================

export function CalculationBreakdown({ record, onClose }: CalculationBreakdownProps) {
  const dailyRate = Math.round(record.baseSalary / 30)

  // Calculate breakdown items
  const breakdownItems = [
    {
      label: 'Base Salary',
      amount: record.baseSalary,
      type: 'base' as const,
      icon: Calendar,
      description: 'Monthly contracted salary'
    },
    ...(record.bonuses > 0 ? [{
      label: 'Bonuses',
      amount: record.bonuses,
      type: 'add' as const,
      icon: Gift,
      description: 'Performance or festival bonuses'
    }] : []),
    ...(record.encashments > 0 ? [{
      label: 'Leave Encashment',
      amount: record.encashments,
      type: 'add' as const,
      icon: Coins,
      description: 'Unused leave days paid out'
    }] : []),
    ...(record.penalties > 0 ? [{
      label: 'Absence Penalties',
      amount: -record.penalties,
      type: 'subtract' as const,
      icon: AlertTriangle,
      description: `Excess absences (${Math.round(record.penalties / dailyRate)} days × ${formatCurrency(dailyRate)}/day)`
    }] : []),
    ...(record.advanceRepayment > 0 ? [{
      label: 'Advance Repayment',
      amount: -record.advanceRepayment,
      type: 'subtract' as const,
      icon: TrendingDown,
      description: 'Monthly deduction for advance'
    }] : [])
  ]

  const initials = record.employeeName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header gradient strip */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Employee Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                {record.employeeName}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Salary Breakdown • {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-1 mb-6">
            {breakdownItems.map((item, index) => {
              const Icon = item.icon
              const isBase = item.type === 'base'
              const isAdd = item.type === 'add'
              const isSubtract = item.type === 'subtract'

              return (
                <div
                  key={item.label}
                  className={`
                    relative flex items-center justify-between p-4 rounded-xl transition-all
                    ${isBase ? 'bg-stone-50 dark:bg-stone-800/50' : ''}
                    ${isAdd ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
                    ${isSubtract ? 'bg-red-50/50 dark:bg-red-900/10' : ''}
                    hover:scale-[1.01]
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isBase ? 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300' : ''}
                      ${isAdd ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : ''}
                      ${isSubtract ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white text-sm">
                        {item.label}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdd && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                    {isSubtract && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {isBase && <Minus className="w-4 h-4 text-stone-400" />}
                    <span className={`
                      font-semibold tabular-nums
                      ${isBase ? 'text-stone-900 dark:text-white' : ''}
                      ${isAdd ? 'text-emerald-600 dark:text-emerald-400' : ''}
                      ${isSubtract ? 'text-red-600 dark:text-red-400' : ''}
                    `}>
                      {isAdd ? '+' : ''}{formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-stone-200 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-400 bg-white dark:bg-stone-900">
                Net Payable
              </span>
            </div>
          </div>

          {/* Net Payable */}
          <div className="text-center">
            <p className="text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
              {formatCurrency(record.netPayable)}
            </p>
            {record.holidayImbalance !== 0 && (
              <p className={`
                mt-2 text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                ${record.holidayImbalance > 0
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                }
              `}>
                <Calendar className="w-3.5 h-3.5" />
                {record.holidayImbalance > 0 ? '+' : ''}{record.holidayImbalance} days holiday balance
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors"
            >
              Close
            </button>
            {record.status !== 'paid' && (
              <button
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
