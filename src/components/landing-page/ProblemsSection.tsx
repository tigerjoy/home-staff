import type { Problem } from './types'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

interface ProblemsSectionProps {
  problems: Problem[]
}

export function ProblemsSection({ problems }: ProblemsSectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-stone-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-stone-200 dark:via-stone-800 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-stone-200 dark:via-stone-800 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
            Managing Household Staff is Harder Than It Should Be
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            From scattered records to confusing payments, we understand the daily struggles.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className="group bg-gradient-to-br from-stone-50 to-stone-100/50 dark:from-stone-900 dark:to-stone-900/50 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-xl hover:shadow-amber-500/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Problem */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>

              {/* Arrow divider */}
              <div className="flex items-center gap-3 my-4 ml-12">
                <div className="flex-1 h-px bg-gradient-to-r from-stone-300 dark:from-stone-700 to-transparent" />
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                <div className="flex-1 h-px bg-gradient-to-l from-stone-300 dark:from-stone-700 to-transparent" />
              </div>

              {/* Solution */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Our Solution
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed mt-1">
                    {problem.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
