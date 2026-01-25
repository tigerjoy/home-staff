import type { Feature } from '@/../product/sections/landing-page/types'
import type { LucideIcon } from 'lucide-react'
import {
  Users,
  Calendar,
  CalendarDays,
  Wallet,
  Settings,
  UserPlus,
} from 'lucide-react'

interface FeaturesSectionProps {
  features: Feature[]
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  Calendar,
  CalendarDays,
  Wallet,
  Settings,
  UserPlus,
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
            Everything You Need to Manage Your Staff
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            A complete toolkit for household employers, designed to save time and reduce friction.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Users

            return (
              <div
                key={feature.id}
                className="group relative bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
