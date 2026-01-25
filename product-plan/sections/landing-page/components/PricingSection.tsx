import type { Pricing } from '../types'
import { Sparkles, Check, ArrowRight } from 'lucide-react'

interface PricingSectionProps {
  pricing: Pricing
  onGetStarted?: () => void
}

export function PricingSection({ pricing, onGetStarted }: PricingSectionProps) {
  const includedFeatures = [
    'Unlimited staff profiles',
    'Full attendance tracking',
    'Payroll management',
    'Employee portal access',
    'Multi-user collaboration',
    'All future updates',
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-amber-50 dark:from-stone-950 dark:to-stone-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
            Simple, Transparent Pricing
          </h2>
        </div>

        {/* Pricing card */}
        <div className="relative bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xl shadow-amber-500/10">
          {/* Badge ribbon */}
          <div className="absolute top-6 -right-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-12 py-2 rotate-45 shadow-lg">
            {pricing.badge}
          </div>

          <div className="p-8 sm:p-12">
            {/* Main offer */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Early Access
              </div>

              <h3 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50 mb-4">
                {pricing.headline}
              </h3>

              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto mb-8">
                {pricing.subtext}
              </p>

              {/* CTA Button */}
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
              >
                {pricing.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-stone-500 dark:text-stone-500 mt-4">
                {pricing.note}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200 dark:border-stone-800 my-8" />

            {/* Included features */}
            <div className="grid sm:grid-cols-2 gap-4">
              {includedFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-stone-700 dark:text-stone-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
