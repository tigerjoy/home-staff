import { useNavigate } from 'react-router-dom'
import { UserAuthentication } from '../../product-plan/sections/user-authentication/components/UserAuthentication'
import type { UserAuthenticationProps } from '../../product-plan/sections/user-authentication/types'

export function Login() {
  const navigate = useNavigate()

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

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', { email, password })
    // TODO: Implement actual login logic
    navigate('/staff')
  }

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Register:', { name, email, password })
    // TODO: Implement actual registration logic
  }

  const handleSocialAuth = (providerId: string) => {
    console.log('Social auth:', providerId)
    // TODO: Implement social auth logic
  }

  const handleVerifyCode = (code: string) => {
    console.log('Verify code:', code)
    // TODO: Implement verification logic
    navigate('/staff')
  }

  const handleResendCode = () => {
    console.log('Resend code')
    // TODO: Implement resend logic
  }

  const handleForgotPassword = (email: string) => {
    console.log('Forgot password:', email)
    // TODO: Implement forgot password logic
  }

  const handleResetPassword = (password: string) => {
    console.log('Reset password')
    // TODO: Implement reset password logic
    navigate('/login')
  }

  const handleTabChange = (tab: 'login' | 'register') => {
    if (tab === 'register') {
      navigate('/register')
    }
  }

  const handleNavigate = (href: string) => {
    navigate(href)
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
      currentView="login"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onSocialAuth={handleSocialAuth}
      onVerifyCode={handleVerifyCode}
      onResendCode={handleResendCode}
      onForgotPassword={handleForgotPassword}
      onResetPassword={handleResetPassword}
      onTabChange={handleTabChange}
      onNavigate={handleNavigate}
    />
  )
}
