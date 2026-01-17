import { useState } from 'react'
import type {
  EmployeePortalProps,
  StaffProfile,
  StaffSummary,
  ActivityItem,
} from '../types'
import {
  Phone,
  Home,
  Calendar,
  IndianRupee,
  Clock,
  ArrowRight,
  LogOut,
  User,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Gift,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

// Activity Icon Mapping
function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const iconProps = { className: 'w-4 h-4' }

  switch (type) {
    case 'absence':
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
          <Calendar {...iconProps} className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
      )
    case 'payment':
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
          <IndianRupee {...iconProps} className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
      )
    case 'entitlement':
      return (
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
          <Gift {...iconProps} className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
      )
    case 'advance':
      return (
        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
          <CreditCard {...iconProps} className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
          <Clock {...iconProps} className="w-4 h-4 text-stone-500" />
        </div>
      )
  }
}

// Login Screen
function LoginScreen({
  isAuthenticating,
  loginError,
  onLogin,
}: {
  isAuthenticating: boolean
  loginError?: string
  onLogin?: (phone: string) => void
}) {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      onLogin?.(phoneNumber.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-stone-950 dark:to-stone-900 flex flex-col">
      {/* Decorative Header */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-orange-300/40 blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">HomeStaff</h1>
            <p className="text-amber-100 mt-1">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-4 sm:px-6 -mt-12 relative z-10">
        <div className="max-w-sm mx-auto">
          <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl shadow-stone-200/50 dark:shadow-none p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 text-center mb-2">
              Check Your Records
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center mb-6">
              Enter your registered phone number to view your attendance and payment history.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 text-lg placeholder-stone-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={!phoneNumber.trim() || isAuthenticating}
                className={`
                  w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium text-lg transition-all
                  ${
                    !phoneNumber.trim() || isAuthenticating
                      ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                  }
                `}
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    View My Records
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-6 px-4">
            This portal is read-only. Contact your employer for any corrections or updates.
          </p>
        </div>
      </div>
    </div>
  )
}

// Dashboard Screen
function DashboardScreen({
  staff,
  summary,
  activity,
  onLogout,
  onViewActivityDetail,
}: {
  staff: StaffProfile
  summary: StaffSummary
  activity: ActivityItem[]
  onLogout?: () => void
  onViewActivityDetail?: (id: string) => void
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 px-4 sm:px-6 pt-6 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-white" />
              <span className="text-white font-medium">{staff.householdName}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {staff.name}
              </h1>
              <p className="text-amber-100">
                {staff.role} • Since {new Date(staff.joinDate).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-4 sm:px-6 -mt-16">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Holiday Balance */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-lg shadow-stone-200/50 dark:shadow-none">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Holidays Left</span>
              </div>
              <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                {summary.holidayBalance}
                <span className="text-lg font-normal text-stone-400 ml-1">days</span>
              </div>
            </div>

            {/* Last Payment */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-lg shadow-stone-200/50 dark:shadow-none">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Last Payment</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {formatCurrency(summary.lastPaymentAmount)}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {formatDate(summary.lastPaymentDate)}
              </div>
            </div>

            {/* Absences This Year */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-lg shadow-stone-200/50 dark:shadow-none">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Absences</span>
              </div>
              <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                {summary.totalAbsencesYear}
                <span className="text-lg font-normal text-stone-400 ml-1">this year</span>
              </div>
            </div>

            {/* Outstanding Advance */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-lg shadow-stone-200/50 dark:shadow-none">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Advance Due</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {summary.outstandingAdvance > 0
                  ? formatCurrency(summary.outstandingAdvance)
                  : 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {activity.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewActivityDetail?.(item.id)}
                className="w-full flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <ActivityIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {item.title}
                    </span>
                    <span className="text-xs text-stone-400 flex-shrink-0">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.description}
                  </p>
                  {(item.impact || item.amount) && (
                    <div className="mt-2">
                      {item.amount && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {formatCurrency(item.amount)}
                        </span>
                      )}
                      {item.impact && (
                        <span
                          className={`
                            inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium
                            ${
                              item.impact.startsWith('+')
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }
                          `}
                        >
                          {item.impact}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>

          {activity.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-stone-500 dark:text-stone-400">
                No recent activity to show
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-6 text-center">
        <p className="text-xs text-stone-400 dark:text-stone-500">
          This is a read-only portal. Contact your employer for corrections.
        </p>
        <p className="text-xs text-stone-300 dark:text-stone-600 mt-1">
          {staff.phoneNumber}
        </p>
      </footer>
    </div>
  )
}

// Main Component
export function EmployeePortal({
  staff,
  summary,
  activity,
  isAuthenticating,
  loginError,
  onLogin,
  onLogout,
  onViewActivityDetail,
}: EmployeePortalProps) {
  // Show dashboard if staff is logged in, otherwise show login
  if (staff && summary) {
    return (
      <DashboardScreen
        staff={staff}
        summary={summary}
        activity={activity}
        onLogout={onLogout}
        onViewActivityDetail={onViewActivityDetail}
      />
    )
  }

  return (
    <LoginScreen
      isAuthenticating={isAuthenticating}
      loginError={loginError}
      onLogin={onLogin}
    />
  )
}
