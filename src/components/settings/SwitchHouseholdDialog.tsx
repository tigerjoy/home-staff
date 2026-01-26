import { X } from 'lucide-react'

interface SwitchHouseholdDialogProps {
  householdName: string
  onConfirm: () => void
  onCancel: () => void
}

export function SwitchHouseholdDialog({
  householdName,
  onConfirm,
  onCancel,
}: SwitchHouseholdDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Switch Household
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-stone-600 dark:text-stone-400">
            Are you sure you want to switch to <strong className="text-stone-900 dark:text-stone-100">{householdName}</strong>? This will change your active household context.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
            >
              Switch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
