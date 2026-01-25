import { Plus, Trash2, Wallet, Calendar, CreditCard, IndianRupee } from 'lucide-react'
import type { UIEmployee, SalaryRecord } from '../../types'

interface SalaryStepProps {
  data: Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>
  onChange: (updates: Partial<Omit<UIEmployee, 'id' | 'householdId' | 'status' | 'holidayBalance'>>) => void
}

const PAYMENT_METHODS: { value: SalaryRecord['paymentMethod']; label: string }[] = [
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
]

export function SalaryStep({ data, onChange }: SalaryStepProps) {
  // Get employment type from form data
  const employmentType = (data as any).employmentType || 'monthly'
  const isMonthly = employmentType === 'monthly'

  const updateSalaryRecord = (index: number, updates: Partial<SalaryRecord>) => {
    const newHistory = [...data.salaryHistory]
    newHistory[index] = { ...newHistory[index], ...updates }
    onChange({ salaryHistory: newHistory })
  }

  const addSalaryRecord = () => {
    onChange({
      salaryHistory: [
        { amount: 0, paymentMethod: 'Bank Transfer', effectiveDate: '' },
        ...data.salaryHistory,
      ],
    })
  }

  const removeSalaryRecord = (index: number) => {
    if (data.salaryHistory.length > 1) {
      onChange({ salaryHistory: data.salaryHistory.filter((_, i) => i !== index) })
    }
  }

  const formatDateForInput = (dateStr: string): string => {
    if (!dateStr) return ''
    return dateStr.slice(0, 10)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const currentSalary = data.salaryHistory[0]
  const pastSalaries = data.salaryHistory.slice(1)

  // Note: Total compensation could be calculated if needed for display

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Salary & Compensation
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {isMonthly
            ? 'Set current salary and track compensation history'
            : 'Ad-hoc employees are paid per job. No monthly salary is required.'}
        </p>
      </div>

      {/* Current Salary Card - Only show for monthly employees */}
      {isMonthly ? (
        <div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Current Salary
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Amount */}
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Monthly Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="number"
                value={currentSalary?.amount || ''}
                onChange={(e) => updateSalaryRecord(0, { amount: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                step="1000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            {currentSalary?.amount > 0 && (
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {formatCurrency(currentSalary.amount)}/month
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Payment Method
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <select
                value={currentSalary?.paymentMethod || 'Bank Transfer'}
                onChange={(e) => updateSalaryRecord(0, { paymentMethod: e.target.value as SalaryRecord['paymentMethod'] })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Effective From
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="date"
                value={formatDateForInput(currentSalary?.effectiveDate || '')}
                onChange={(e) => updateSalaryRecord(0, { effectiveDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Quick Amount Suggestions */}
        <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Quick amounts:</p>
          <div className="flex flex-wrap gap-2">
            {[10000, 15000, 18000, 20000, 25000, 30000].map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => updateSalaryRecord(0, { amount })}
                className={`
                  px-3 py-1.5 rounded-lg text-sm transition-all
                  ${currentSalary?.amount === amount
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                  }
                `}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Salary History */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Salary History
            </h3>
            <button
              type="button"
              onClick={addSalaryRecord}
              className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Previous Salary
            </button>
          </div>

          {pastSalaries.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                No previous salary records. Track salary changes to maintain a compensation history.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastSalaries.map((salary, idx) => {
                const actualIndex = idx + 1
                return (
                  <div
                    key={actualIndex}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700"
                  >
                    {/* Amount */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 sm:hidden">
                        Amount
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="number"
                          value={salary.amount || ''}
                          onChange={(e) => updateSalaryRecord(actualIndex, { amount: parseInt(e.target.value) || 0 })}
                          placeholder="Amount"
                          min="0"
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 sm:hidden">
                        Payment Method
                      </label>
                      <select
                        value={salary.paymentMethod}
                        onChange={(e) => updateSalaryRecord(actualIndex, { paymentMethod: e.target.value as SalaryRecord['paymentMethod'] })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        {PAYMENT_METHODS.map(method => (
                          <option key={method.value} value={method.value}>{method.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 sm:hidden">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(salary.effectiveDate)}
                        onChange={(e) => updateSalaryRecord(actualIndex, { effectiveDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeSalaryRecord(actualIndex)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {data.salaryHistory.length > 1 && (
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Total Records</p>
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {data.salaryHistory.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Highest Salary</p>
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {formatCurrency(Math.max(...data.salaryHistory.map(s => s.amount)))}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Current Salary</p>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                {formatCurrency(currentSalary?.amount || 0)}
              </p>
            </div>
          </div>
        )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-center">
          <Wallet className="w-12 h-12 mx-auto text-stone-400 dark:text-stone-600 mb-3" />
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Ad-hoc employees are paid per job. No monthly salary configuration is needed.
          </p>
        </div>
      )}

      {/* Validation Hint - Only for monthly employees */}
      {isMonthly && !data.salaryHistory.some(s => s.amount > 0) && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Please enter a salary amount to continue.
          </p>
        </div>
      )}
    </div>
  )
}
