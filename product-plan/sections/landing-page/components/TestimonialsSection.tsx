import type { Testimonial } from '@/../product/sections/landing-page/types'
import { Quote, Star } from 'lucide-react'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Generate initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-orange-400 to-red-500',
      'from-amber-500 to-yellow-500',
      'from-stone-400 to-stone-600',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <section id="testimonials" className="py-24 bg-stone-900 dark:bg-stone-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-amber-400 rounded-full" />
        <div className="absolute bottom-32 right-32 w-48 h-48 border border-orange-400 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-amber-400/50 rounded-xl rotate-45" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-50 mb-4">
            Loved by Households Across India
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Hear from families who transformed how they manage their domestic staff.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-stone-800/50 dark:bg-stone-900/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-700 dark:border-stone-800 hover:border-amber-600/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Quote text */}
              <blockquote className="text-stone-300 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {testimonial.avatarUrl ? (
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.authorName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(testimonial.authorName)} flex items-center justify-center text-white font-semibold text-sm ring-2 ring-amber-500/30`}>
                    {getInitials(testimonial.authorName)}
                  </div>
                )}

                {/* Name and role */}
                <div>
                  <p className="font-semibold text-stone-100">
                    {testimonial.authorName}
                  </p>
                  <p className="text-sm text-stone-500">
                    {testimonial.authorRole}
                  </p>
                </div>
              </div>

              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
