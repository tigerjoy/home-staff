import type { RegisterForm } from '@/../product/sections/user-authentication/types'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check, X } from 'lucide-react'

interface RegisterFormComponentProps {
  form: RegisterForm
  isLoading?: boolean
  error?: string
  onSubmit?: (name: string, email: string, password: string) => void
}

export function RegisterFormComponent({
  form,
  isLoading,
  error,
  onSubmit,
}: RegisterFormComponentProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(name, email, password)
  }

  // Password strength checks
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const requirementChecks = [
    { text: form.passwordRequirements[0], met: hasMinLength },
    { text: form.passwordRequirements[1], met: hasUppercase },
    { text: form.passwordRequirements[2], met: hasNumberOrSymbol },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Name field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {form.fields.name.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={form.fields.name.placeholder}
            className="block w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

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
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {form.fields.password.label}
        </label>
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

        {/* Password requirements */}
        {password.length > 0 && (
          <div className="space-y-1 mt-2">
            {requirementChecks.map((req, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs ${
                  req.met
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {req.met ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                {req.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm password field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {form.fields.confirmPassword.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={form.fields.confirmPassword.placeholder}
            className={`block w-full pl-10 pr-12 py-3 bg-stone-50 dark:bg-stone-800 border rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
              confirmPassword.length > 0 && !passwordsMatch
                ? 'border-red-300 dark:border-red-700'
                : 'border-stone-200 dark:border-stone-700'
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-500 dark:text-red-400">
            Passwords don't match
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !passwordsMatch}
        className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
