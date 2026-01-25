import { useState } from 'react'
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronRight,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Coins,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CalendarClock,
  Wrench,
  Filter
} from 'lucide-react'
import type {
  PayrollAndFinanceProps,
  MonthlyPayrollRecord,
  AdhocPayment,
  Advance,
  EmploymentType
} from '../types'

// =============================================================================
// Helper Components
// =============================================================================

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  trend,
  colorClass,
  onClick
}: {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: { value: string; positive: boolean }
  colorClass: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800
        shadow-sm hover:shadow-lg transition-all duration-300 group
        ${onClick ? 'cursor-pointer hover:border-amber-300 dark:hover:border-amber-700' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend.positive
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{label}</p>
      </div>
      {onClick && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: MonthlyPayrollRecord['status'] }) {
  const config = {
    draft: { label: 'Draft', className: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
    calculated: { label: 'Calculated', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    pending_settlement: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
  }

  const { label, className } = config[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

function AdhocStatusBadge({ status }: { status: AdhocPayment['status'] }) {
  const config = {
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
  }

  const { label, className } = config[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

function MonthlyPayrollRow({
  record,
  onViewCalculation,
  onFinalizePayment
}: {
  record: MonthlyPayrollRecord
  onViewCalculation?: () => void
  onFinalizePayment?: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = record.employeeName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-900 dark:text-white">{record.employeeName}</h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CalendarClock className="w-3 h-3" />
              Monthly
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-stone-500 dark:text-stone-400">Base: {formatCurrency(record.baseSalary)}</span>
            {record.holidayImbalance !== 0 && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                record.holidayImbalance > 0
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {record.holidayImbalance > 0 ? '+' : ''}{record.holidayImbalance} days
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Calculation breakdown */}
        <div className="hidden md:flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
          {record.bonuses > 0 && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Plus className="w-3 h-3" />
              {formatCurrency(record.bonuses)}
            </span>
          )}
          {record.penalties > 0 && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <XCircle className="w-3 h-3" />
              {formatCurrency(record.penalties)}
            </span>
          )}
          {record.advanceRepayment > 0 && (
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Coins className="w-3 h-3" />
              -{formatCurrency(record.advanceRepayment)}
            </span>
          )}
        </div>

        {/* Net Payable */}
        <div className="text-right">
          <p className="text-lg font-bold text-stone-900 dark:text-white">
            {formatCurrency(record.netPayable)}
          </p>
          <StatusBadge status={record.status} />
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 z-20 py-1 overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); onViewCalculation?.() }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  View Breakdown
                </button>
                {record.status !== 'paid' && (
                  <button
                    onClick={() => { setMenuOpen(false); onFinalizePayment?.() }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Paid
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AdhocPaymentRow({
  payment,
  onMarkPaid
}: {
  payment: AdhocPayment
  onMarkPaid?: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = payment.employeeName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-900 dark:text-white">{payment.employeeName}</h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Wrench className="w-3 h-3" />
              Ad-hoc
            </span>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 max-w-xs truncate">
            {payment.description}
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Amount */}
        <div className="text-right">
          <p className="text-lg font-bold text-stone-900 dark:text-white">
            {formatCurrency(payment.amount)}
          </p>
          <AdhocStatusBadge status={payment.status} />
        </div>

        {/* Actions Menu */}
        {payment.status === 'pending' && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 z-20 py-1 overflow-hidden">
                  <button
                    onClick={() => { setMenuOpen(false); onMarkPaid?.() }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Paid
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AdvanceCard({
  advance
}: {
  advance: Advance
}) {
  const remaining = advance.amount - advance.repaidAmount
  const progress = (advance.repaidAmount / advance.amount) * 100

  return (
    <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-stone-900 dark:text-white text-sm">{advance.employeeName}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {new Date(advance.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          advance.status === 'active'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : advance.status === 'repaid'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
        }`}>
          {advance.status.charAt(0).toUpperCase() + advance.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">Total</span>
          <span className="font-semibold text-stone-900 dark:text-white">{formatCurrency(advance.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">Remaining</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(remaining)}</span>
        </div>
        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 text-right">{Math.round(progress)}% repaid</p>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

type ViewFilter = 'all' | 'monthly' | 'adhoc'

export function PayrollDashboard({
  summary,
  monthlyPayroll,
  adhocPayments,
  advances,
  ledger,
  settlementItems,
  onSettleAbsence,
  onSettleUnusedLeave,
  onFinalizePayment,
  onRecordAdvance,
  onAddBonus,
  onViewCalculation,
  onRecordAdhocPayment,
  onMarkAdhocPaid,
  onSearchLedger
}: PayrollAndFinanceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all')

  const pendingPayroll = monthlyPayroll.filter(p => p.status === 'pending_settlement')
  const activeAdvances = advances.filter(a => a.status === 'active')
  const pendingAdhoc = adhocPayments.filter(p => p.status === 'pending')

  // Current month/year for display
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  // Filter records based on search and type
  const filteredMonthly = monthlyPayroll.filter(p =>
    (viewFilter === 'all' || viewFilter === 'monthly') &&
    (searchQuery === '' || p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredAdhoc = adhocPayments.filter(p =>
    (viewFilter === 'all' || viewFilter === 'adhoc') &&
    (searchQuery === '' || p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              Payroll & Finance
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              {currentMonth} • {monthlyPayroll.length} monthly + {adhocPayments.length} ad-hoc
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onRecordAdvance?.('', 0, 0)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Banknote className="w-4 h-4" />
              <span className="hidden sm:inline">Record Advance</span>
            </button>
            <button
              onClick={() => onRecordAdhocPayment?.('', '', 0, new Date().toISOString().split('T')[0])}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-500/20"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Ad-hoc Payment</span>
            </button>
            <button
              onClick={() => onAddBonus?.('', 0, '')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Bonus
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            label="Monthly Payroll"
            value={summary.totalMonthlyPayroll}
            icon={Wallet}
            colorClass="bg-gradient-to-br from-amber-500 to-orange-500"
            trend={{ value: '+2.5%', positive: true }}
          />
          <SummaryCard
            label="Ad-hoc Payments"
            value={summary.totalAdhocPayments}
            icon={Wrench}
            colorClass="bg-gradient-to-br from-purple-500 to-violet-500"
          />
          <SummaryCard
            label="Outstanding Advances"
            value={summary.outstandingAdvances}
            icon={TrendingUp}
            colorClass="bg-gradient-to-br from-blue-500 to-indigo-500"
          />
          <SummaryCard
            label="Pending Settlements"
            value={summary.pendingSettlements}
            icon={AlertCircle}
            colorClass="bg-gradient-to-br from-amber-400 to-orange-400"
            onClick={settlementItems.length > 0 ? () => {} : undefined}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payroll List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                Payroll Records
                <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400">
                  {filteredMonthly.length + filteredAdhoc.length}
                </span>
              </h2>

              <div className="flex items-center gap-3">
                {/* Type Filter */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                  {(['all', 'monthly', 'adhoc'] as ViewFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setViewFilter(filter)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize
                        ${viewFilter === filter
                          ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm'
                          : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                        }
                      `}
                    >
                      {filter === 'adhoc' ? 'Ad-hoc' : filter}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 md:w-56 pl-9 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pending Settlements Alert */}
            {pendingPayroll.length > 0 && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {pendingPayroll.length} Monthly employee{pendingPayroll.length > 1 ? 's' : ''} need{pendingPayroll.length === 1 ? 's' : ''} settlement decisions
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    Review holiday imbalances before finalizing payroll
                  </p>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors">
                  Review
                </button>
              </div>
            )}

            {/* Pending Ad-hoc Alert */}
            {pendingAdhoc.length > 0 && viewFilter !== 'monthly' && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    {pendingAdhoc.length} Ad-hoc payment{pendingAdhoc.length > 1 ? 's' : ''} pending
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                    Mark as paid once completed
                  </p>
                </div>
              </div>
            )}

            {/* Monthly Payroll Section */}
            {filteredMonthly.length > 0 && (
              <div className="space-y-3">
                {viewFilter === 'all' && (
                  <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    Monthly Staff ({filteredMonthly.length})
                  </h3>
                )}
                {filteredMonthly.map(record => (
                  <MonthlyPayrollRow
                    key={record.id}
                    record={record}
                    onViewCalculation={() => onViewCalculation?.(record.id)}
                    onFinalizePayment={() => onFinalizePayment?.(record.id)}
                  />
                ))}
              </div>
            )}

            {/* Ad-hoc Payments Section */}
            {filteredAdhoc.length > 0 && (
              <div className="space-y-3">
                {viewFilter === 'all' && (
                  <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-2 mt-6">
                    <Wrench className="w-4 h-4" />
                    Ad-hoc Workers ({filteredAdhoc.length})
                  </h3>
                )}
                {filteredAdhoc.map(payment => (
                  <AdhocPaymentRow
                    key={payment.id}
                    payment={payment}
                    onMarkPaid={() => onMarkAdhocPaid?.(payment.id)}
                  />
                ))}
              </div>
            )}

            {filteredMonthly.length === 0 && filteredAdhoc.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                <Wallet className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-1">No payroll records</h3>
                <p className="text-stone-500 dark:text-stone-400">
                  {searchQuery ? 'No results found for your search' : 'Payroll will appear here once calculated'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Advances */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  Active Advances
                </h3>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {activeAdvances.length} active
                </span>
              </div>

              {activeAdvances.length > 0 ? (
                <div className="space-y-3">
                  {activeAdvances.map(advance => (
                    <AdvanceCard
                      key={advance.id}
                      advance={advance}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4 italic">
                  No active advances
                </p>
              )}

              <button
                onClick={() => onRecordAdvance?.('', 0, 0)}
                className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors border border-dashed border-amber-200 dark:border-amber-800"
              >
                <Plus className="w-4 h-4" />
                Record New Advance
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Recent Transactions
                </h3>
                <button
                  onClick={() => onSearchLedger?.('')}
                  className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View All
                </button>
              </div>

              {ledger.length > 0 ? (
                <div className="space-y-3">
                  {ledger.slice(0, 4).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-stone-900 dark:text-white">{entry.type}</p>
                          {entry.employmentType === 'adhoc' && (
                            <span className="px-1 py-0.5 rounded text-xs bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                              Ad-hoc
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{entry.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          entry.type === 'Penalty' ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-white'
                        }`}>
                          {entry.type === 'Penalty' ? '-' : ''}{formatCurrency(entry.amount)}
                        </p>
                        <p className="text-xs text-stone-400">{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4 italic">
                  No transactions yet
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/20">
              <h3 className="text-sm font-medium text-amber-100 mb-1">Monthly Summary</h3>
              <p className="text-2xl font-bold mb-6">{currentMonth}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-100">Monthly Paid</span>
                  <span className="font-semibold">{monthlyPayroll.filter(p => p.status === 'paid').length} / {monthlyPayroll.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-100">Ad-hoc Paid</span>
                  <span className="font-semibold">{adhocPayments.filter(p => p.status === 'paid').length} / {adhocPayments.length}</span>
                </div>
                <div className="h-px bg-white/20 my-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-100">Pending Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      monthlyPayroll.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.netPayable, 0) +
                      adhocPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
