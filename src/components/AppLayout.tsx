import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Users, Calendar, Wallet, Settings } from 'lucide-react'
import { AppShell, type NavigationItem } from './shell'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems: NavigationItem[] = [
    { label: 'Staff Directory', href: '/staff', icon: Users, isActive: location.pathname.startsWith('/staff') },
    { label: 'Attendance & Holidays', href: '/attendance', icon: Calendar, isActive: location.pathname === '/attendance' },
    { label: 'Payroll & Finance', href: '/payroll', icon: Wallet, isActive: location.pathname === '/payroll' },
    { label: 'Settings & Access', href: '/settings', icon: Settings, isActive: location.pathname === '/settings' },
  ]

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  const handleSwitchHousehold = () => {
    console.log('Switch household clicked')
  }

  const handleAccountSettings = () => {
    navigate('/settings')
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={{ name: 'Alex Morgan' }}
      household={{ name: 'Morgan Residence' }}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onSwitchHousehold={handleSwitchHousehold}
      onAccountSettings={handleAccountSettings}
    >
      <Outlet />
    </AppShell>
  )
}
