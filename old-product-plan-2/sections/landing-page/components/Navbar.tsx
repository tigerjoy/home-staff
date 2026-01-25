import type { Navigation } from '@/../product/sections/landing-page/types'
import { Home } from 'lucide-react'

interface NavbarProps {
  navigation: Navigation
  onNavigate?: (href: string) => void
  onLogin?: () => void
  onSignUp?: () => void
}

export function Navbar({ navigation, onNavigate, onLogin, onSignUp }: NavbarProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    onNavigate?.(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-900 dark:text-stone-50">
              {navigation.logo}
            </span>
          </a>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-3 py-2"
            >
              {navigation.loginText}
            </button>
            <button
              onClick={onSignUp}
              className="text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
            >
              {navigation.signupText}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
