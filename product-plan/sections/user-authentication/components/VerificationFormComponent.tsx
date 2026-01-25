import type { VerificationForm } from '../types'
import { useState, useRef, useEffect } from 'react'
import { Mail, ArrowLeft, Loader2, RefreshCw, Clock } from 'lucide-react'

interface VerificationFormComponentProps {
  form: VerificationForm
  email: string
  isLoading?: boolean
  error?: string
  onSubmit?: (code: string) => void
  onResend?: () => void
  onBack?: () => void
}

export function VerificationFormComponent({
  form,
  email,
  isLoading,
  error,
  onSubmit,
  onResend,
  onBack,
}: VerificationFormComponentProps) {
  const [code, setCode] = useState<string[]>(new Array(form.codeLength).fill(''))
  const [cooldown, setCooldown] = useState(0)
  const [expirationTime, setExpirationTime] = useState(600) // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // Countdown timer for OTP expiration (10 minutes)
  useEffect(() => {
    if (expirationTime > 0) {
      const timer = setTimeout(() => setExpirationTime(expirationTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [expirationTime])

  // Reset expiration timer when resending code
  const handleResend = () => {
    setCooldown(form.resendCooldown)
    setExpirationTime(600) // Reset to 10 minutes
    onResend?.()
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only keep last digit
    setCode(newCode)

    // Auto-focus next input
    if (value && index < form.codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit) && value) {
      onSubmit?.(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, form.codeLength)
    const newCode = [...code]
    pastedData.split('').forEach((digit, index) => {
      newCode[index] = digit
    })
    setCode(newCode)

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length - 1, form.codeLength - 1)
    inputRefs.current[lastFilledIndex]?.focus()

    // Auto-submit if complete
    if (pastedData.length === form.codeLength) {
      onSubmit?.(pastedData)
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.every((digit) => digit)) {
      onSubmit?.(code.join(''))
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {form.changeEmailText}
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
          <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          {form.title}
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-2">
          {form.subtitle}
        </p>
        <p className="text-amber-600 dark:text-amber-400 font-medium mt-1">
          {email}
        </p>
        {/* Expiration timer */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Code expires in: <span className="font-mono">{formatTime(expirationTime)}</span>
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Code input */}
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 sm:gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !code.every((d) => d)}
          className="group w-full flex items-center justify-center gap-2 py-3 px-4 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {form.loadingText}
            </>
          ) : (
            form.submitText
          )}
        </button>
      </form>

      {/* Resend code */}
      <div className="text-center">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {form.resendText}
        </p>
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="mt-2 inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${cooldown > 0 ? '' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {cooldown > 0 ? `Resend in ${cooldown}s` : form.resendButtonText}
        </button>
      </div>
    </div>
  )
}
