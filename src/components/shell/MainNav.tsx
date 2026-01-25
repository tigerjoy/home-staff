import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
  collapsed?: boolean
}

export function MainNav({ items, onNavigate, collapsed = false }: MainNavProps) {
  return (
    <nav className={collapsed ? 'px-2 py-4' : 'px-3 py-4'}>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.href)}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center rounded-lg text-sm font-medium transition-colors
                  ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'}
                  ${item.isActive
                    ? 'bg-amber-50 text-amber-900 border-l-2 border-amber-500 dark:bg-amber-400/20 dark:text-amber-300'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                  }
                `}
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                <Icon className={`h-5 w-5 shrink-0 ${item.isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
