import type { Footer } from '../types'
import type { LucideIcon } from 'lucide-react'
import { Home, Twitter, Facebook, Linkedin } from 'lucide-react'

interface FooterSectionProps {
  footer: Footer
  onNavigate?: (href: string) => void
}

const socialIconMap: Record<string, LucideIcon> = {
  Twitter,
  Facebook,
  Linkedin,
}

export function FooterSection({ footer, onNavigate }: FooterSectionProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    onNavigate?.(href)
  }

  return (
    <footer className="bg-stone-950 text-stone-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-stone-50">
                {footer.companyName}
              </span>
            </div>
            <p className="text-stone-500 max-w-sm leading-relaxed mb-6">
              {footer.tagline}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {footer.socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon] || Twitter
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-stone-900 hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-all hover:-translate-y-0.5"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-stone-50 font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, '#features')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick(e, '#pricing')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  onClick={(e) => handleLinkClick(e, '#testimonials')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-stone-50 font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800">
          <p className="text-sm text-stone-600 text-center">
            © {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
