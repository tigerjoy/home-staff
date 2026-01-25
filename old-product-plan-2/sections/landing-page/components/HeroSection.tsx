import type { Hero } from '@/../product/sections/landing-page/types'
import { ArrowRight, Sparkles } from 'lucide-react'

interface HeroSectionProps {
  hero: Hero
  onGetStarted?: () => void
}

export function HeroSection({ hero, onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-32 right-1/4 w-4 h-4 bg-amber-500 rounded-full" />
        <div className="absolute top-48 right-1/3 w-2 h-2 bg-orange-400 rounded-full" />
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-amber-400 rounded-full" />
        <div className="absolute top-1/3 left-20 w-20 h-20 border-2 border-amber-300/50 rounded-2xl rotate-12" />
        <div className="absolute bottom-1/4 right-32 w-16 h-16 border-2 border-orange-300/50 rounded-xl -rotate-12" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Free for limited time</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 dark:text-stone-50 leading-tight mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            {hero.headline.split(' ').slice(0, 2).join(' ')}
          </span>
          <br />
          <span className="text-stone-800 dark:text-stone-100">
            {hero.headline.split(' ').slice(2).join(' ')}
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.subtext}
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:-translate-y-0.5"
        >
          {hero.ctaText}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 text-stone-500 dark:text-stone-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            No credit card required
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Setup in 2 minutes
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-stone-950 to-transparent" />
    </section>
  )
}
