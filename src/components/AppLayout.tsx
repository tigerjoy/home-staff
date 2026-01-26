import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Users, Calendar, Wallet, Settings } from 'lucide-react'
import { AppShell, type NavigationItem } from './shell'
import { SwitchHouseholdModal, SwitchHouseholdDialog } from './settings'
import { useSession } from '../context/SessionContext'
import { signOut as signOutApi, getCurrentUser } from '../lib/api/auth'
import { useHousehold } from '../hooks/useHousehold'
import { useState, useEffect } from 'react'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useSession()
  const { activeHousehold, activeHouseholdId, households, switchHousehold } = useHousehold()
  const [user, setUser] = useState<{ name: string; avatarUrl?: string }>({ name: 'User' })
  const [showSwitchHouseholdModal, setShowSwitchHouseholdModal] = useState(false)
  const [pendingSwitch, setPendingSwitch] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (session?.user) {
      getCurrentUser().then((authUser) => {
        if (authUser) {
          setUser({
            name: authUser.name,
            avatarUrl: authUser.avatarUrl || undefined,
          })
        }
      })
    } else {
      setUser({ name: 'User' })
    }
  }, [session])

  const navigationItems: NavigationItem[] = [
    { label: 'Staff Directory', href: '/staff', icon: Users, isActive: location.pathname.startsWith('/staff') },
    { label: 'Attendance & Holidays', href: '/attendance', icon: Calendar, isActive: location.pathname === '/attendance' },
    { label: 'Payroll & Finance', href: '/payroll', icon: Wallet, isActive: location.pathname === '/payroll' },
    { label: 'Settings & Access', href: '/settings', icon: Settings, isActive: location.pathname === '/settings' },
  ]

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  const handleLogout = async () => {
    await signOutApi()
    navigate('/login')
  }

  const handleSwitchHousehold = () => {
    setShowSwitchHouseholdModal(true)
  }

  const handleSwitchHouseholdSelect = (id: string, name: string) => {
    setShowSwitchHouseholdModal(false)
    setPendingSwitch({ id, name })
  }

  const handleSwitchHouseholdConfirm = async () => {
    if (!pendingSwitch) return
    try {
      await switchHousehold(pendingSwitch.id)
      setPendingSwitch(null)
    } catch {
      setPendingSwitch(null)
    }
  }

  const handleAccountSettings = () => {
    navigate('/settings')
  }


  // Get household data from hook
  const household = activeHousehold ? { name: activeHousehold.name } : undefined

  return (
    <>
      <AppShell
        navigationItems={navigationItems}
        user={user}
        household={household}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSwitchHousehold={handleSwitchHousehold}
        onAccountSettings={handleAccountSettings}
      >
        <Outlet />
      </AppShell>
      {showSwitchHouseholdModal && (
        <SwitchHouseholdModal
          households={households}
          activeHouseholdId={activeHouseholdId}
          onSelect={handleSwitchHouseholdSelect}
          onClose={() => setShowSwitchHouseholdModal(false)}
        />
      )}
      {pendingSwitch && (
        <SwitchHouseholdDialog
          householdName={pendingSwitch.name}
          onConfirm={handleSwitchHouseholdConfirm}
          onCancel={() => setPendingSwitch(null)}
        />
      )}
    </>
  )
}
