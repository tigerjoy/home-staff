import type { LandingPageProps } from '../types'
import { Navbar } from './Navbar'
import { HeroSection } from './HeroSection'
import { ProblemsSection } from './ProblemsSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection } from './PricingSection'
import { FooterSection } from './FooterSection'
import { StickyCtaBar } from './StickyCtaBar'

export function LandingPage({
  hero,
  problems,
  features,
  testimonials,
  pricing,
  navigation,
  stickyCta,
  footer,
  onNavigate,
  onGetStarted,
  onLogin,
  onSignUp,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* Navigation */}
      <Navbar
        navigation={navigation}
        onNavigate={onNavigate}
        onLogin={onLogin}
        onSignUp={onSignUp}
      />

      {/* Main content */}
      <main>
        {/* Hero */}
        <HeroSection hero={hero} onGetStarted={onGetStarted} />

        {/* Problems & Solutions */}
        <ProblemsSection problems={problems} />

        {/* Features */}
        <FeaturesSection features={features} />

        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* Pricing */}
        <PricingSection pricing={pricing} onGetStarted={onGetStarted} />
      </main>

      {/* Footer */}
      <FooterSection footer={footer} onNavigate={onNavigate} />

      {/* Sticky CTA Bar */}
      <StickyCtaBar stickyCta={stickyCta} onGetStarted={onGetStarted} />
    </div>
  )
}
