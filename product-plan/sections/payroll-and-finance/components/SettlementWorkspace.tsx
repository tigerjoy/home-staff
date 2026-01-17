import { useState } from 'react'
import {
  AlertCircle,
  Calendar,
  ArrowRight,
  Check,
  X,
  Coins,
  RotateCcw,
  Trash2,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import type { SettlementItem } from '../types'

// =============================================================================
// Types
// =============================================================================

interface SettlementWorkspaceProps {
  items: SettlementItem[]
  onSettleAbsence?: (employeeId: string, decision: 'penalize' | 'carry_forward') => void
  onSettleUnusedLeave?: (employeeId: string, decision: 'encash' | 'carry_forward' | 'lapse') => void
  onClose?: () => void
}

type AbsenceDecision = 'penalize' | 'carry_forward'
type LeaveDecision = 'encash' | 'carry_forward' | 'lapse'

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
// Sub-Components
// =============================================================================

function ExcessAbsenceCard({
  item,
  onSettle
}: {
  item: SettlementItem
  onSettle?: (decision: AbsenceDecision) => void
}) {
  const [selectedOption, setSelectedOption] = useState<AbsenceDecision | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const initials = item.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-stone-900 dark:text-white">{item.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
                {item.days} excess days
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            -{formatCurrency(item.potentialPenalty || 0)}
          </span>
          <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone-100 dark:border-stone-800">
          <div className="pt-4 space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium">{item.name}</span> exceeded their holiday entitlement by{' '}
              <span className="font-semibold text-red-600 dark:text-red-400">{item.days} days</span>.
              Choose how to handle this:
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Penalize Option */}
              <button
                onClick={() => setSelectedOption('penalize')}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${selectedOption === 'penalize'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {selectedOption === 'penalize' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Coins className={`w-5 h-5 mb-2 ${selectedOption === 'penalize' ? 'text-amber-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Apply Penalty</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Deduct {formatCurrency(item.potentialPenalty || 0)} from salary
                </p>
              </button>

              {/* Carry Forward Option */}
              <button
                onClick={() => setSelectedOption('carry_forward')}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${selectedOption === 'carry_forward'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {selectedOption === 'carry_forward' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <RotateCcw className={`w-5 h-5 mb-2 ${selectedOption === 'carry_forward' ? 'text-amber-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Carry Forward</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Deduct from next month's entitlement
                </p>
              </button>
            </div>

            {/* Confirm Button */}
            {selectedOption && (
              <button
                onClick={() => onSettle?.(selectedOption)}
                className="w-full mt-2 py-2.5 px-4 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Decision
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function UnusedLeaveCard({
  item,
  onSettle
}: {
  item: SettlementItem
  onSettle?: (decision: LeaveDecision) => void
}) {
  const [selectedOption, setSelectedOption] = useState<LeaveDecision | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const initials = item.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-stone-900 dark:text-white">{item.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                {item.days} unused days
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(item.potentialEncashment || 0)}
          </span>
          <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone-100 dark:border-stone-800">
          <div className="pt-4 space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium">{item.name}</span> has{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.days} unused leave days</span>.
              Choose what to do with them:
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Encash Option */}
              <button
                onClick={() => setSelectedOption('encash')}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${selectedOption === 'encash'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {selectedOption === 'encash' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Sparkles className={`w-5 h-5 mb-2 ${selectedOption === 'encash' ? 'text-emerald-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Encash</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Pay out {formatCurrency(item.potentialEncashment || 0)}
                </p>
              </button>

              {/* Carry Forward Option */}
              <button
                onClick={() => setSelectedOption('carry_forward')}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${selectedOption === 'carry_forward'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {selectedOption === 'carry_forward' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <RotateCcw className={`w-5 h-5 mb-2 ${selectedOption === 'carry_forward' ? 'text-emerald-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Carry Forward</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Add to next month
                </p>
              </button>

              {/* Lapse Option */}
              <button
                onClick={() => setSelectedOption('lapse')}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${selectedOption === 'lapse'
                    ? 'border-stone-500 bg-stone-50 dark:bg-stone-800'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {selectedOption === 'lapse' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Trash2 className={`w-5 h-5 mb-2 ${selectedOption === 'lapse' ? 'text-stone-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Lapse</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Expire unused days
                </p>
              </button>
            </div>

            {/* Confirm Button */}
            {selectedOption && (
              <button
                onClick={() => onSettle?.(selectedOption)}
                className={`
                  w-full mt-2 py-2.5 px-4 text-sm font-medium text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2
                  ${selectedOption === 'lapse'
                    ? 'bg-stone-600 hover:bg-stone-700'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  }
                `}
              >
                <Check className="w-4 h-4" />
                Confirm Decision
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SettlementWorkspace({
  items,
  onSettleAbsence,
  onSettleUnusedLeave,
  onClose
}: SettlementWorkspaceProps) {
  const excessAbsences = items.filter(item => item.type === 'excess_absence')
  const unusedLeaves = items.filter(item => item.type === 'unused_leave')

  const totalPotentialPenalty = excessAbsences.reduce((sum, item) => sum + (item.potentialPenalty || 0), 0)
  const totalPotentialEncashment = unusedLeaves.reduce((sum, item) => sum + (item.potentialEncashment || 0), 0)

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">
          All Settled!
        </h3>
        <p className="text-stone-500 dark:text-stone-400 max-w-sm">
          There are no pending holiday imbalances to review. All employees are ready for payroll.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              Settlement Workspace
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              Review and resolve holiday imbalances before finalizing payroll
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {excessAbsences.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {excessAbsences.length}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Excess absences • {formatCurrency(totalPotentialPenalty)} potential penalty
                </p>
              </div>
            </div>
          )}

          {unusedLeaves.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {unusedLeaves.length}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Unused leave • {formatCurrency(totalPotentialEncashment)} potential payout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Excess Absences Section */}
        {excessAbsences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Excess Absences
            </h2>
            <div className="space-y-4">
              {excessAbsences.map(item => (
                <ExcessAbsenceCard
                  key={item.employeeId}
                  item={item}
                  onSettle={(decision) => onSettleAbsence?.(item.employeeId, decision)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Unused Leave Section */}
        {unusedLeaves.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Unused Leave
            </h2>
            <div className="space-y-4">
              {unusedLeaves.map(item => (
                <UnusedLeaveCard
                  key={item.employeeId}
                  item={item}
                  onSettle={(decision) => onSettleUnusedLeave?.(item.employeeId, decision)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="sticky bottom-6 flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800">
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {items.length} item{items.length !== 1 ? 's' : ''} pending
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all shadow-md">
              Resolve All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
