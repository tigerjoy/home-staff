import type { ForgotPasswordForm } from '../types'
import { useState, useRef } from 'react'
import { Mail, Lock, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff, Check, X, KeyRound } from 'lucide-react'

type ForgotPasswordStep = 'request' | 'code' | 'newPassword'

interface ForgotPasswordComponentProps {
  form: ForgotPasswordForm
  passwordRequirements?: string[]
  isLoading?: boolean
  error?: string
  onRequestCode?: (email: string) => void
  onVerifyCode?: (code: string) => void
  onResetPassword?: (password: string) => void
  onBack?: () => void
}

export function ForgotPasswordComponent({
  form,
  passwordRequirements = ['At least 8 characters', 'One uppercase letter', 'One number or symbol'],
  isLoading,
  error,
  onRequestCode,
  onVerifyCode,
  onResetPassword,
  onBack,
}: ForgotPasswordComponentProps) {
  const [step, setStep] = useState<ForgotPasswordStep>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(new Array(form.codeStep.codeLength).fill(''))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Password validation
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const requirementChecks = [
    { text: passwordRequirements[0], met: hasMinLength },
    { text: passwordRequirements[1], met: hasUppercase },
    { text: passwordRequirements[2], met: hasNumberOrSymbol },
  ]

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRequestCode?.(email)
    setStep('code')
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < form.codeStep.codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every((digit) => digit) && value) {
      onVerifyCode?.(newCode.join(''))
      setStep('newPassword')
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, form.codeStep.codeLength)
    const newCode = [...code]
    pastedData.split('').forEach((digit, index) => {
      newCode[index] = digit
    })
    setCode(newCode)

    if (pastedData.length === form.codeStep.codeLength) {
      onVerifyCode?.(pastedData)
      setStep('newPassword')
    }
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.every((d) => d)) {
      onVerifyCode?.(code.join(''))
      setStep('newPassword')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordsMatch) {
      onResetPassword?.(password)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Request code */}
      {step === 'request' && (
        <>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {form.requestStep.backText}
          </button>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              {form.requestStep.title}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mt-2">
              {form.requestStep.subtitle}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={form.requestStep.emailPlaceholder}
                className="block w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {form.requestStep.loadingText}
                </>
              ) : (
                <>
                  {form.requestStep.submitText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* Step 2: Enter code */}
      {step === 'code' && (
        <>
          <button
            onClick={() => setStep('request')}
            className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change email
          </button>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              {form.codeStep.title}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mt-2">
              {form.codeStep.subtitle}
            </p>
            <p className="text-amber-600 dark:text-amber-400 font-medium mt-1">
              {email}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCodeSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  onPaste={handleCodePaste}
                  className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !code.every((d) => d)}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {form.codeStep.loadingText}
                </>
              ) : (
                form.codeStep.submitText
              )}
            </button>
          </form>
        </>
      )}

      {/* Step 3: New password */}
      {step === 'newPassword' && (
        <>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              {form.newPasswordStep.title}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mt-2">
              {form.newPasswordStep.subtitle}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={form.newPasswordStep.passwordPlaceholder}
                  className="block w-full pl-10 pr-12 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="space-y-1">
                  {requirementChecks.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        req.met
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {req.met ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {req.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={form.newPasswordStep.confirmPlaceholder}
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
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 dark:text-red-400">Passwords don't match</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {form.newPasswordStep.loadingText}
                </>
              ) : (
                <>
                  {form.newPasswordStep.submitText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
