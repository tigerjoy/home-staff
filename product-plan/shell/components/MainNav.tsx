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
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <nav className="px-3 py-4">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.href)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${item.isActive
                    ? 'bg-amber-50 text-amber-900 border-l-2 border-amber-500 dark:bg-amber-400/20 dark:text-amber-300'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                  }
                `}
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                <Icon className={`h-5 w-5 ${item.isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
