import type { LoginForm } from '@/../product/sections/user-authentication/types'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

interface LoginFormComponentProps {
  form: LoginForm
  isLoading?: boolean
  error?: string
  onSubmit?: (email: string, password: string) => void
  onForgotPassword?: () => void
}

export function LoginFormComponent({
  form,
  isLoading,
  error,
  onSubmit,
  onForgotPassword,
}: LoginFormComponentProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          {form.title}
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          {form.subtitle}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {form.fields.email.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={form.fields.email.placeholder}
            className="block w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
            {form.fields.password.label}
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
          >
            {form.forgotPasswordText}
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={form.fields.password.placeholder}
            className="block w-full pl-10 pr-12 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {form.loadingText}
          </>
        ) : (
          <>
            {form.submitText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  )
}
