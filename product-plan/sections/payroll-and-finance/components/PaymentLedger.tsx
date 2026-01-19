import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Wallet,
  Gift,
  AlertTriangle,
  Coins,
  TrendingUp,
  Paperclip,
  Download,
  Eye,
  FileText
} from 'lucide-react'
import type { LedgerEntry } from '@/../product/sections/payroll-and-finance/types'

// =============================================================================
// Types
// =============================================================================

interface PaymentLedgerProps {
  entries: LedgerEntry[]
  onSearch?: (query: string) => void
  onViewReceipts?: (entryId: string) => void
  onUploadReceipt?: (entryId: string, file: File) => void
}

type SortField = 'date' | 'amount' | 'type'
type SortDirection = 'asc' | 'desc'
type FilterType = 'all' | 'Salary' | 'Advance' | 'Bonus' | 'Penalty' | 'Encashment'

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getTypeConfig(type: LedgerEntry['type']) {
  const configs = {
    Salary: {
      icon: Wallet,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'Salary'
    },
    Advance: {
      icon: Coins,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      label: 'Advance'
    },
    Bonus: {
      icon: Gift,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      label: 'Bonus'
    },
    Penalty: {
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Penalty'
    },
    Encashment: {
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      label: 'Encashment'
    }
  }
  return configs[type]
}

// =============================================================================
// Sub-Components
// =============================================================================

function LedgerRow({
  entry,
  onViewReceipts,
  onUploadReceipt
}: {
  entry: LedgerEntry
  onViewReceipts?: () => void
  onUploadReceipt?: (file: File) => void
}) {
  const config = getTypeConfig(entry.type)
  const Icon = config.icon
  const hasReceipts = entry.receipts && entry.receipts.length > 0

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadReceipt?.(file)
    }
  }

  return (
    <tr className="group hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
      {/* Date */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400 hidden sm:block" />
          <span className="text-sm text-stone-900 dark:text-white font-medium">
            {formatDate(entry.date)}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bg}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </td>

      {/* Reference */}
      <td className="px-4 py-4">
        <p className="text-sm text-stone-900 dark:text-white font-medium truncate max-w-[200px]">
          {entry.reference}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          ID: {entry.id}
        </p>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <span className={`text-sm font-semibold tabular-nums ${
          entry.type === 'Penalty' ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-white'
        }`}>
          {entry.type === 'Penalty' ? '-' : ''}{formatCurrency(entry.amount)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          entry.status === 'Paid'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : entry.status === 'Disbursed'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {entry.status}
        </span>
      </td>

      {/* Receipts */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {hasReceipts ? (
            <button
              onClick={onViewReceipts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              {entry.receipts!.length}
            </button>
          ) : (
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer">
              <Paperclip className="w-3.5 h-3.5" />
              Add
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </td>
    </tr>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PaymentLedger({
  entries,
  onSearch,
  onViewReceipts,
  onUploadReceipt
}: PaymentLedgerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort entries
  const processedEntries = useMemo(() => {
    let result = [...entries]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        entry =>
          entry.reference.toLowerCase().includes(query) ||
          entry.type.toLowerCase().includes(query) ||
          entry.id.toLowerCase().includes(query)
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(entry => entry.type === filterType)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [entries, searchQuery, filterType, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  // Calculate totals
  const totals = useMemo(() => {
    return processedEntries.reduce(
      (acc, entry) => {
        if (entry.type === 'Penalty') {
          acc.debits += entry.amount
        } else {
          acc.credits += entry.amount
        }
        return acc
      },
      { credits: 0, debits: 0 }
    )
  }, [processedEntries])

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'Salary', label: 'Salary' },
    { value: 'Advance', label: 'Advance' },
    { value: 'Bonus', label: 'Bonus' },
    { value: 'Penalty', label: 'Penalty' },
    { value: 'Encashment', label: 'Encashment' }
  ]

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              Payment Ledger
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              {processedEntries.length} transaction{processedEntries.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Total Credits</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totals.credits)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Total Debits</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totals.debits)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Net Flow</p>
              <p className="text-xl font-bold text-stone-900 dark:text-white">
                {formatCurrency(totals.credits - totals.debits)}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors
                ${showFilters
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }
              `}
            >
              <Filter className="w-4 h-4" />
              Filters
              {filterType !== 'all' && (
                <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="px-4 pb-4 pt-0 border-t border-stone-100 dark:border-stone-800">
              <div className="flex flex-wrap gap-2 pt-4">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterType(option.value)}
                    className={`
                      px-3 py-1.5 text-sm rounded-lg font-medium transition-colors
                      ${filterType === option.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <th
                    onClick={() => handleSort('date')}
                    className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:text-stone-700 dark:hover:text-stone-300"
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('type')}
                    className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:text-stone-700 dark:hover:text-stone-300"
                  >
                    <div className="flex items-center gap-1">
                      Type
                      <SortIcon field="type" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Reference
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="px-4 py-3 text-right text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:text-stone-700 dark:hover:text-stone-300"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <SortIcon field="amount" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Receipts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {processedEntries.length > 0 ? (
                  processedEntries.map((entry) => (
                    <LedgerRow
                      key={entry.id}
                      entry={entry}
                      onViewReceipts={() => onViewReceipts?.(entry.id)}
                      onUploadReceipt={(file) => onUploadReceipt?.(entry.id, file)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <FileText className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-1">
                        No transactions found
                      </h3>
                      <p className="text-stone-500 dark:text-stone-400">
                        {searchQuery || filterType !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'Transactions will appear here once recorded'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
