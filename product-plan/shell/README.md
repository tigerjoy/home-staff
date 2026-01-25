# Application Shell

## Overview

HomeStaff uses a sidebar navigation pattern optimized for household workforce management. The persistent left sidebar provides quick access to all main sections, while the user menu at the bottom keeps account actions easily accessible.

## Navigation Structure

| Route | Section | Access |
|-------|---------|--------|
| `/staff` | Staff Directory | Authenticated (default) |
| `/attendance` | Attendance & Holidays | Authenticated |
| `/payroll` | Payroll & Finance | Authenticated |
| `/settings` | Settings & Access | Authenticated |

### Separate Flows (Not in Main Nav)

- **Landing Page** — Public marketing page at `/`
- **User Authentication** — Registration and login at `/login` and `/register`
- **Onboarding & Setup** — For new users after first login
- **Employee Portal** — Public-facing page at `/portal`

## User Menu

Located at the bottom of the sidebar, the user menu displays:
- User avatar (with initials fallback)
- User name
- Current household name
- Dropdown with: Switch Household, Account Settings, Logout

## Components

### AppShell.tsx
Main layout wrapper that provides the sidebar structure and content area.

**Props:**
- `children` — Content to render in the main area
- `currentPath` — Current route path for active nav highlighting
- `user` — User object with name, avatar, household info
- `onNavigate` — Navigation callback
- `onLogout` — Logout callback

### MainNav.tsx
Navigation component with nav items and icons.

**Nav Items:**
- Staff Directory (Users icon)
- Attendance & Holidays (Calendar icon)
- Payroll & Finance (Wallet icon)
- Settings & Access (Settings icon)

### UserMenu.tsx
User menu with avatar and dropdown actions.

**Props:**
- `user` — User object
- `households` — List of user's households
- `onSwitchHousehold` — Household switch callback
- `onSettings` — Settings navigation callback
- `onLogout` — Logout callback

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

## Design Notes

- Navigation icons accompany each nav item for visual recognition
- Active nav item has amber-500 left border accent and amber-50 background
- Sidebar has subtle border-right separator
- Dark mode: Sidebar uses stone-900 background, text adapts accordingly
