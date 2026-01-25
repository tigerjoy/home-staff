import type { UserAuthenticationProps, AuthView } from '../types'
import { useState } from 'react'
import { Home } from 'lucide-react'
import { SocialAuthButtons } from './SocialAuthButtons'
import { LoginFormComponent } from './LoginFormComponent'
import { RegisterFormComponent } from './RegisterFormComponent'
import { VerificationFormComponent } from './VerificationFormComponent'
import { ForgotPasswordComponent } from './ForgotPasswordComponent'

export function UserAuthentication({
  authConfig,
  socialProviders,
  loginForm,
  registerForm,
  verificationForm,
  forgotPasswordForm,
  currentView: initialView = 'login',
  verificationEmail = '',
  isLoading = false,
  error,
  onLogin,
  onRegister,
  onSocialAuth,
  onVerifyCode,
  onResendCode,
  onForgotPassword,
  onResetPassword,
  onTabChange,
  onBack,
  onNavigate,
}: UserAuthenticationProps) {
  const [activeView, setActiveView] = useState<AuthView>(initialView)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    initialView === 'register' ? 'register' : 'login'
  )
  const [pendingEmail, setPendingEmail] = useState(verificationEmail)

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setActiveView(tab)
    onTabChange?.(tab)
  }

  const handleForgotPasswordClick = () => {
    setActiveView('forgot-password')
  }

  const handleBackToLogin = () => {
    setActiveView('login')
    setActiveTab('login')
    onBack?.()
  }

  const handleRegisterSubmit = (name: string, email: string, password: string) => {
    setPendingEmail(email)
    onRegister?.(name, email, password)
    setActiveView('verification')
  }

  const showTabs = activeView === 'login' || activeView === 'register'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-orange-50/30 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-amber-200/30 dark:border-amber-700/30 rounded-xl rotate-12" />
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-orange-200/30 dark:border-orange-700/30 rounded-2xl -rotate-12" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-400/50 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400/50 rounded-full" />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              {authConfig.logo}
            </span>
          </div>
          <p className="mt-2 text-stone-600 dark:text-stone-400 text-sm">
            {authConfig.tagline}
          </p>
        </div>

        {/* Card container */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl shadow-stone-900/10 dark:shadow-black/30 border border-stone-200/50 dark:border-stone-800 p-8 backdrop-blur-xl">
          {/* Tabs - only show for login/register */}
          {showTabs && (
            <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-1 mb-6">
              <button
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                {authConfig.tabs.login}
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                {authConfig.tabs.register}
              </button>
            </div>
          )}

          {/* Social auth - only show for login/register */}
          {showTabs && (
            <div className="mb-6">
              <SocialAuthButtons
                providers={socialProviders}
                dividerText={authConfig.dividerText}
                onSocialAuth={onSocialAuth}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Forms */}
          {activeView === 'login' && (
            <LoginFormComponent
              form={loginForm}
              isLoading={isLoading}
              error={error}
              onSubmit={onLogin}
              onForgotPassword={handleForgotPasswordClick}
            />
          )}

          {activeView === 'register' && (
            <RegisterFormComponent
              form={registerForm}
              isLoading={isLoading}
              error={error}
              onSubmit={handleRegisterSubmit}
            />
          )}

          {activeView === 'verification' && (
            <VerificationFormComponent
              form={verificationForm}
              email={pendingEmail}
              isLoading={isLoading}
              error={error}
              onSubmit={onVerifyCode}
              onResend={onResendCode}
              onBack={handleBackToLogin}
            />
          )}

          {(activeView === 'forgot-password' || activeView === 'reset-password') && (
            <ForgotPasswordComponent
              form={forgotPasswordForm}
              passwordRequirements={registerForm.passwordRequirements}
              isLoading={isLoading}
              error={error}
              onRequestCode={onForgotPassword}
              onVerifyCode={onVerifyCode}
              onResetPassword={onResetPassword}
              onBack={handleBackToLogin}
            />
          )}

          {/* Terms and privacy - only show for login/register */}
          {showTabs && (
            <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
              {authConfig.termsText}{' '}
              <button
                onClick={() => onNavigate?.(authConfig.termsLink.href)}
                className="text-amber-600 dark:text-amber-400 hover:underline"
              >
                {authConfig.termsLink.label}
              </button>{' '}
              and{' '}
              <button
                onClick={() => onNavigate?.(authConfig.privacyLink.href)}
                className="text-amber-600 dark:text-amber-400 hover:underline"
              >
                {authConfig.privacyLink.label}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
