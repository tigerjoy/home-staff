# Application Shell

## Overview

HomeStaff uses a sidebar navigation pattern optimized for household workforce management. The persistent left sidebar provides quick access to all main sections, while the user menu at the bottom keeps account actions easily accessible.

## Components

- `AppShell.tsx` — Main layout wrapper with responsive behavior
- `MainNav.tsx` — Navigation list with icons and active states
- `UserMenu.tsx` — User avatar, name, household, and dropdown menu

## Navigation Structure

| Label | Route | Icon |
|-------|-------|------|
| Staff Directory | `/staff` | Users |
| Attendance & Holidays | `/attendance` | Calendar |
| Payroll & Finance | `/payroll` | Wallet |
| Settings & Access | `/settings` | Settings |

### Not in Main Nav

- **Onboarding & Setup** — Full-screen wizard for new users
- **Employee Portal** — Public page at `/portal`

## User Menu

Located at the bottom of the sidebar:
- User avatar (with initials fallback)
- User name
- Current household name
- Dropdown with: Switch Household, Account Settings, Logout

## Layout Pattern

- **Sidebar Width:** 240px (desktop), full overlay (mobile)
- **Content Area:** Flexible, fills remaining space
- **Header:** Only visible on mobile with hamburger menu

## Responsive Behavior

- **Desktop (≥1024px):** Full sidebar always visible
- **Tablet (768px–1023px):** Sidebar collapses to icons
- **Mobile (<768px):** Hamburger menu, slide-out overlay

## Design Tokens Applied

- **Primary (amber):** Active nav items, buttons
- **Secondary (orange):** Hover states, accents
- **Neutral (stone):** Sidebar background, borders, text
- **Typography:** Nunito Sans for all nav labels

## Props

### AppShellProps

```typescript
interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: { name: string; avatarUrl?: string }
  household?: { name: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onSwitchHousehold?: () => void
  onAccountSettings?: () => void
}
```

### NavigationItem

```typescript
interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}
```

## Usage Example

```tsx
import { AppShell } from './components/AppShell'
import { Users, Calendar, Wallet, Settings } from 'lucide-react'

const navigationItems = [
  { label: 'Staff Directory', href: '/staff', icon: Users, isActive: true },
  { label: 'Attendance & Holidays', href: '/attendance', icon: Calendar },
  { label: 'Payroll & Finance', href: '/payroll', icon: Wallet },
  { label: 'Settings & Access', href: '/settings', icon: Settings },
]

function App() {
  return (
    <AppShell
      navigationItems={navigationItems}
      user={{ name: 'Alex Morgan' }}
      household={{ name: 'Morgan Residence' }}
      onNavigate={(href) => router.push(href)}
      onLogout={() => signOut()}
    >
      <YourPageContent />
    </AppShell>
  )
}
```
