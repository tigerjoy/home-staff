import type { StickyCta } from '../types'
import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

interface StickyCtaBarProps {
  stickyCta: StickyCta
  onGetStarted?: () => void
}

export function StickyCtaBar({ stickyCta, onGetStarted }: StickyCtaBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl shadow-amber-500/20 safe-area-inset-bottom">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Text - hidden on small screens */}
        <p className="hidden sm:block text-white font-medium truncate">
          {stickyCta.text}
        </p>

        <div className="flex items-center gap-3 ml-auto">
          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-amber-600 font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-all hover:-translate-y-0.5"
          >
            <span className="hidden xs:inline">{stickyCta.buttonText}</span>
            <span className="xs:hidden">Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white p-2 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
