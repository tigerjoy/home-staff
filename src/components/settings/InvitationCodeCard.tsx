import { Copy, RefreshCw } from 'lucide-react'
import type { InvitationCode } from './types'

interface InvitationCodeCardProps {
  invitationCode: InvitationCode | null
  onRegenerate?: () => void
  isAdmin: boolean
}

export function InvitationCodeCard({
  invitationCode,
  onRegenerate,
  isAdmin,
}: InvitationCodeCardProps) {
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!invitationCode) {
    return (
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No invitation code available. {isAdmin && 'Generate one to invite members.'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Invitation Code
        </h3>
        {isAdmin && onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <code className="text-2xl font-mono font-bold text-amber-900 dark:text-amber-100 tracking-wider">
            {invitationCode.code}
          </code>
        </div>
        <button
          onClick={() => copyToClipboard(invitationCode.code)}
          className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          title="Copy code"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
        {invitationCode.expiresAt && (
          <p>
            Expires: {new Date(invitationCode.expiresAt).toLocaleDateString()}
          </p>
        )}
        {invitationCode.maxUses !== null && (
          <p>
            Uses: {invitationCode.currentUses} / {invitationCode.maxUses}
          </p>
        )}
        {!invitationCode.expiresAt && invitationCode.maxUses === null && (
          <p className="text-green-600 dark:text-green-400">No expiration or usage limit</p>
        )}
      </div>
    </div>
  )
}
