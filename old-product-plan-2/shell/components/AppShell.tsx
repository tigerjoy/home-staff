import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav, type NavigationItem } from './MainNav'
import { UserMenu, type UserMenuProps } from './UserMenu'

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: UserMenuProps['user']
  household?: UserMenuProps['household']
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onSwitchHousehold?: () => void
  onAccountSettings?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  household,
  onNavigate,
  onLogout,
  onSwitchHousehold,
  onAccountSettings,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = (href: string) => {
    setMobileMenuOpen(false)
    onNavigate?.(href)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-stone-200 bg-white px-4 dark:border-stone-800 dark:bg-stone-900">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-stone-900 dark:text-stone-100" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
          HomeStaff
        </span>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-stone-900 shadow-xl">
            <div className="flex h-14 items-center justify-between px-4 border-b border-stone-200 dark:border-stone-800">
              <span className="font-semibold text-stone-900 dark:text-stone-100" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                HomeStaff
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col h-[calc(100%-3.5rem)]">
              <MainNav
                items={navigationItems}
                onNavigate={handleNavigate}
              />
              {user && (
                <UserMenu
                  user={user}
                  household={household}
                  onLogout={onLogout}
                  onSwitchHousehold={onSwitchHousehold}
                  onAccountSettings={onAccountSettings}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 w-60 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="flex h-14 items-center px-6 border-b border-stone-200 dark:border-stone-800">
            <span className="font-semibold text-stone-900 dark:text-stone-100" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              HomeStaff
            </span>
          </div>
          <div className="flex flex-col h-[calc(100%-3.5rem)]">
            <MainNav
              items={navigationItems}
              onNavigate={onNavigate}
            />
            {user && (
              <UserMenu
                user={user}
                household={household}
                onLogout={onLogout}
                onSwitchHousehold={onSwitchHousehold}
                onAccountSettings={onAccountSettings}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-60">
          {children}
        </main>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden">
        {children}
      </main>
    </div>
  )
}
