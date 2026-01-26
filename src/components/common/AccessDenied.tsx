import { AlertCircle, Clock, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AccessDeniedProps {
  isPending?: boolean
  message?: string
  showSettingsLink?: boolean
}

/**
 * AccessDenied Component
 * 
 * Displays user-friendly messages when access is denied or pending.
 * 
 * @param isPending - If true, shows pending approval message
 * @param message - Custom error message
 * @param showSettingsLink - If true, shows link to settings page
 */
export function AccessDenied({
  isPending = false,
  message,
  showSettingsLink = false,
}: AccessDeniedProps) {
  const defaultPendingMessage =
    'Your membership request is pending approval from an admin. You will be able to access this household once approved.'
  const defaultDeniedMessage =
    'You do not have access to this household. Please contact an admin if you believe this is an error.'

  const displayMessage = message || (isPending ? defaultPendingMessage : defaultDeniedMessage)
  const Icon = isPending ? Clock : AlertCircle

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-8 text-center">
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isPending
                ? 'bg-amber-100 dark:bg-amber-900/40'
                : 'bg-red-100 dark:bg-red-900/40'
            }`}
          >
            <Icon
              className={`w-8 h-8 ${
                isPending
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            />
          </div>

          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            {isPending ? 'Access Pending' : 'Access Denied'}
          </h2>

          <p className="text-stone-600 dark:text-stone-400 mb-6">{displayMessage}</p>

          {isPending && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                    What happens next?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    An admin will review your request and approve your membership. You'll be
                    notified once you have access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showSettingsLink && (
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Go to Settings
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
