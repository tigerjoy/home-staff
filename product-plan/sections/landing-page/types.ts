// =============================================================================
// Data Types
// =============================================================================

export interface Hero {
  headline: string
  subtext: string
  ctaText: string
  ctaLink: string
}

export interface Problem {
  id: string
  title: string
  description: string
  solution: string
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorRole: string
  avatarUrl: string | null
}

export interface Pricing {
  badge: string
  headline: string
  subtext: string
  ctaText: string
  ctaLink: string
  note: string
}

export interface NavLink {
  label: string
  href: string
}

export interface Navigation {
  logo: string
  links: NavLink[]
  loginText: string
  loginLink: string
  signupText: string
  signupLink: string
}

export interface StickyCta {
  text: string
  buttonText: string
  buttonLink: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface Footer {
  companyName: string
  tagline: string
  copyright: string
  socialLinks: SocialLink[]
  legalLinks: LegalLink[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface LandingPageProps {
  /** Hero section content */
  hero: Hero
  /** List of problems and their solutions */
  problems: Problem[]
  /** List of product features */
  features: Feature[]
  /** List of user testimonials */
  testimonials: Testimonial[]
  /** Pricing/promotion information */
  pricing: Pricing
  /** Navigation bar configuration */
  navigation: Navigation
  /** Sticky CTA bar content */
  stickyCta: StickyCta
  /** Footer content */
  footer: Footer
  /** Called when user clicks a navigation link */
  onNavigate?: (href: string) => void
  /** Called when user clicks the main CTA button */
  onGetStarted?: () => void
  /** Called when user clicks Login */
  onLogin?: () => void
  /** Called when user clicks Sign Up */
  onSignUp?: () => void
}
