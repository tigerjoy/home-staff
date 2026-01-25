# Application Shell

## Overview

HomeStaff uses a sidebar navigation pattern optimized for household workforce management. The persistent left sidebar provides quick access to all main sections, while the user menu at the bottom keeps account actions easily accessible.

## Components Provided

- `AppShell.tsx` — Main layout wrapper with mobile and desktop sidebar
- `MainNav.tsx` — Navigation component with active state styling
- `UserMenu.tsx` — User menu with avatar, household name, and dropdown

## Navigation Structure

| Label | Route | Icon |
|-------|-------|------|
| Staff Directory | `/staff` | Users |
| Attendance & Holidays | `/attendance` | Calendar |
| Payroll & Finance | `/payroll` | Wallet |
| Settings & Access | `/settings` | Settings |

## Separate Flows (Not in Main Nav)

- **Landing Page** — Public marketing page at `/`
- **User Authentication** — Login/register flows at `/login` and `/register`
- **Onboarding & Setup** — Displayed for new users after first login
- **Employee Portal** — Public-facing page at `/portal`

## User Menu

Located at the bottom of the sidebar, displays:
- User avatar (with initials fallback)
- User name
- Current household name
- Dropdown with: Switch Household, Account Settings, Logout

## Layout Pattern

- **Sidebar Width:** 240px (desktop), full overlay (mobile)
- **Content Area:** Flexible, fills remaining space
- **Header:** Minimal — only visible on mobile with hamburger menu and logo

## Responsive Behavior

- **Desktop (≥1024px):** Full sidebar always visible, no header
- **Tablet (768px–1023px):** Sidebar collapses to icons only, expands on hover
- **Mobile (<768px):** Sidebar hidden, hamburger menu in sticky header, sidebar slides in as overlay

## Design Tokens Applied

- **Primary (amber):** Active nav items, primary buttons
- **Secondary (orange):** Hover states, accent highlights
- **Neutral (stone):** Sidebar background, borders, text
- **Typography:** Nunito Sans for nav labels and UI text

## Props Interface

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

interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}
```

## Usage Example

```tsx
import { AppShell } from './components'
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
