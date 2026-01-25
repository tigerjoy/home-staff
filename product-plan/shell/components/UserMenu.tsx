import { useState, useRef, useEffect } from 'react'
import { ChevronUp, LogOut, Settings, RefreshCw } from 'lucide-react'

export interface UserMenuProps {
  user: {
    name: string
    avatarUrl?: string
  }
  household?: {
    name: string
  }
  onLogout?: () => void
  onSwitchHousehold?: () => void
  onAccountSettings?: () => void
  collapsed?: boolean
}

export function UserMenu({
  user,
  household,
  onLogout,
  onSwitchHousehold,
  onAccountSettings,
  collapsed = false,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get initials for avatar fallback
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div ref={menuRef} className="relative mt-auto border-t border-stone-200 dark:border-stone-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={collapsed ? user.name : undefined}
        aria-label={collapsed ? `User menu: ${user.name}` : undefined}
        className={`
          w-full flex items-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors
          ${collapsed ? 'justify-center gap-0 px-2 py-3' : 'gap-3 px-4 py-3'}
        `}
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              {initials}
            </span>
          </div>
        )}

        {/* User Info */}
        {!collapsed && (
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              {user.name}
            </p>
            {household && (
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                {household.name}
              </p>
            )}
          </div>
        )}

        {/* Chevron */}
        <ChevronUp
          className={`h-4 w-4 text-stone-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''} ${collapsed ? 'hidden' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={
            collapsed
              ? 'absolute bottom-full left-0 mb-1 min-w-48 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden'
              : 'absolute bottom-full left-0 right-0 mb-1 mx-3 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden'
          }
        >
          {onSwitchHousehold && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onSwitchHousehold()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            >
              <RefreshCw className="h-4 w-4" />
              Switch Household
            </button>
          )}
          {onAccountSettings && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onAccountSettings()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          )}
        </div>
      )}
    </div>
  )
}
