import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserAuthentication } from '../../product-plan/sections/user-authentication/components/UserAuthentication'
import type { UserAuthenticationProps } from '../../product-plan/sections/user-authentication/types'
import { useSession } from '../context/SessionContext'
import * as authApi from '../lib/api/auth'
import { needsOnboarding } from '../lib/api/auth'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useSession()
  const [currentView, setCurrentView] = useState<UserAuthenticationProps['currentView']>('login')
  const [verificationEmail, setVerificationEmail] = useState<string | undefined>()
  const [resetEmail, setResetEmail] = useState<string | undefined>()
  const [resetCodeVerified, setResetCodeVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = location.state?.from?.pathname || '/staff'

  const authConfig: UserAuthenticationProps['authConfig'] = {
    logo: 'HomeStaff',
    tagline: 'Manage your household staff with ease',
    tabs: {
      login: 'Login',
      register: 'Register',
    },
    dividerText: 'or continue with',
    termsText: 'By continuing, you agree to our',
    termsLink: { label: 'Terms of Service', href: '/terms' },
    privacyLink: { label: 'Privacy Policy', href: '/privacy' },
  }

  const socialProviders: UserAuthenticationProps['socialProviders'] = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Google',
      buttonText: 'Continue with Google',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      buttonText: 'Continue with Facebook',
    },
  ]

  const loginForm: UserAuthenticationProps['loginForm'] = {
    title: 'Welcome back',
    subtitle: 'Sign in to your HomeStaff account',
    fields: {
      email: {
        label: 'Email address',
        placeholder: 'you@example.com',
        type: 'email',
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
      },
    },
    forgotPasswordText: 'Forgot password?',
    submitText: 'Sign in',
    loadingText: 'Signing in...',
  }

  const registerForm: UserAuthenticationProps['registerForm'] = {
    title: 'Create your account',
    subtitle: 'Start managing your household staff today',
    fields: {
      name: {
        label: 'Full name',
        placeholder: 'Your full name',
        type: 'text',
      },
      email: {
        label: 'Email address',
        placeholder: 'you@example.com',
        type: 'email',
      },
      password: {
        label: 'Password',
        placeholder: 'Create a password',
        type: 'password',
        hint: 'Must be at least 8 characters',
      },
      confirmPassword: {
        label: 'Confirm password',
        placeholder: 'Confirm your password',
        type: 'password',
      },
    },
    passwordRequirements: [
      'At least 8 characters',
      'One uppercase letter',
      'One number or symbol',
    ],
    submitText: 'Create account',
    loadingText: 'Creating account...',
  }

  const verificationForm: UserAuthenticationProps['verificationForm'] = {
    title: 'Check your email',
    subtitle: 'We sent a verification code to',
    codeLength: 6,
    codePlaceholder: '000000',
    resendText: "Didn't receive the code?",
    resendButtonText: 'Resend code',
    resendCooldown: 60,
    submitText: 'Verify',
    loadingText: 'Verifying...',
    changeEmailText: 'Use a different email',
  }

  const forgotPasswordForm: UserAuthenticationProps['forgotPasswordForm'] = {
    requestStep: {
      title: 'Reset your password',
      subtitle: "Enter your email and we'll send you a reset code",
      emailPlaceholder: 'you@example.com',
      submitText: 'Send reset code',
      loadingText: 'Sending...',
      backText: 'Back to login',
    },
    codeStep: {
      title: 'Enter reset code',
      subtitle: 'We sent a code to',
      codeLength: 6,
      submitText: 'Verify code',
      loadingText: 'Verifying...',
    },
    newPasswordStep: {
      title: 'Set new password',
      subtitle: 'Create a strong password for your account',
      passwordPlaceholder: 'New password',
      confirmPlaceholder: 'Confirm new password',
      submitText: 'Reset password',
      loadingText: 'Resetting...',
    },
  }

  const errorMessages: UserAuthenticationProps['errorMessages'] = {
    invalidEmail: 'Please enter a valid email address',
    invalidPassword: 'Password must be at least 8 characters',
    passwordMismatch: "Passwords don't match",
    emailInUse: 'An account with this email already exists',
    invalidCredentials: 'Invalid email or password',
    userNotFound: 'No account found with this email',
    invalidCode: 'Invalid verification code',
    codeExpired: 'This code has expired. Please request a new one',
    networkError: 'Something went wrong. Please try again',
    socialAuthFailed: 'Unable to connect to {provider}. Please try again',
    tooManyAttempts: 'Too many attempts. Please try again in a few minutes',
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      needsOnboarding().then((needs) => {
        if (needs) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      })
    }
  }, [session, navigate, from])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, error: authError } = await authApi.signIn({ email, password })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }
      if (user) {
        const needs = await needsOnboarding()
        if (needs) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setIsLoading(false)
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, error: authError } = await authApi.signUp({ name, email, password })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }
      if (user) {
        setVerificationEmail(email)
        setCurrentView('verification')
        setIsLoading(false)
        // Send verification OTP
        await authApi.sendOTP({ email, purpose: 'email_verification' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (providerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error: authError } = await authApi.signInWithOAuth(providerId as 'google' | 'facebook')
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
      }
      // OAuth redirects, so we don't handle navigation here
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with OAuth')
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (code: string) => {
    if (!verificationEmail) return
    
    setIsLoading(true)
    setError(null)
    try {
      const { verified, error: authError } = await authApi.verifyOTP({
        email: verificationEmail,
        code,
        purpose: 'email_verification',
      })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }
      if (verified) {
        const needs = await needsOnboarding()
        if (needs) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      } else {
        setError('Verification failed')
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code')
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!verificationEmail && !resetEmail) return
    
    const email = verificationEmail || resetEmail
    if (email) {
      setIsLoading(true)
      setError(null)
      try {
        if (currentView === 'verification') {
          await authApi.sendOTP({ email, purpose: 'email_verification' })
        } else if (currentView === 'forgot-password' || currentView === 'reset-password') {
          await authApi.sendOTP({ email, purpose: 'password_reset' })
        }
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to send code')
        setIsLoading(false)
      }
    }
  }

  const handleForgotPassword = async (email: string) => {
    setResetEmail(email)
    setResetCodeVerified(false)
    setCurrentView('forgot-password')
    setIsLoading(true)
    setError(null)
    try {
      const { error: authError } = await authApi.sendOTP({ email, purpose: 'password_reset' })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code')
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (password: string) => {
    if (!resetCodeVerified || !resetEmail) return
    
    setIsLoading(true)
    setError(null)
    try {
      const { error: authError } = await authApi.resetPassword({
        email: resetEmail,
        newPassword: password,
      })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
      setIsLoading(false)
    }
  }

  const handleForgotPasswordCodeVerify = async (code: string) => {
    if (!resetEmail) return
    
    setIsLoading(true)
    setError(null)
    try {
      const { verified, error: authError } = await authApi.verifyOTP({
        email: resetEmail,
        code,
        purpose: 'password_reset',
      })
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }
      if (verified) {
        setResetCodeVerified(true)
        setCurrentView('reset-password')
        setIsLoading(false)
      } else {
        setError('Verification failed')
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code')
      setIsLoading(false)
    }
  }

  const handleTabChange = (tab: 'login' | 'register') => {
    if (tab === 'register') {
      navigate('/register')
    }
  }

  const handleNavigate = (href: string) => {
    navigate(href)
  }

  // Handle forgot password flow - need to intercept verification for password reset
  const handleVerifyCodeWithPurpose = async (code: string) => {
    if (currentView === 'forgot-password' && resetEmail) {
      await handleForgotPasswordCodeVerify(code)
    } else {
      await handleVerifyCode(code)
    }
  }

  return (
    <UserAuthentication
      authConfig={authConfig}
      socialProviders={socialProviders}
      loginForm={loginForm}
      registerForm={registerForm}
      verificationForm={verificationForm}
      forgotPasswordForm={forgotPasswordForm}
      errorMessages={errorMessages}
      currentView={currentView}
      verificationEmail={verificationEmail || resetEmail}
      isLoading={isLoading}
      error={error || undefined}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onSocialAuth={handleSocialAuth}
      onVerifyCode={handleVerifyCodeWithPurpose}
      onResendCode={handleResendCode}
      onForgotPassword={handleForgotPassword}
      onResetPassword={handleResetPassword}
      onTabChange={handleTabChange}
      onNavigate={handleNavigate}
      onBack={() => {
        if (currentView === 'forgot-password' || currentView === 'reset-password') {
          setCurrentView('login')
          setResetEmail(undefined)
          setResetCodeVerified(false)
        } else if (currentView === 'verification') {
          setCurrentView('register')
          setVerificationEmail(undefined)
        }
      }}
    />
  )
}
