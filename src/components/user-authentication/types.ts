// =============================================================================
// Data Types
// =============================================================================

export interface AuthConfig {
  logo: string
  tagline: string
  tabs: {
    login: string
    register: string
  }
  dividerText: string
  termsText: string
  termsLink: { label: string; href: string }
  privacyLink: { label: string; href: string }
}

export interface SocialProvider {
  id: string
  name: string
  icon: string
  buttonText: string
}

export interface FormField {
  label: string
  placeholder: string
  type: 'text' | 'email' | 'password'
  hint?: string
}

export interface LoginForm {
  title: string
  subtitle: string
  fields: {
    email: FormField
    password: FormField
  }
  forgotPasswordText: string
  submitText: string
  loadingText: string
}

export interface RegisterForm {
  title: string
  subtitle: string
  fields: {
    name: FormField
    email: FormField
    password: FormField
    confirmPassword: FormField
  }
  passwordRequirements: string[]
  submitText: string
  loadingText: string
}

export interface VerificationForm {
  title: string
  subtitle: string
  codeLength: number
  codePlaceholder: string
  resendText: string
  resendButtonText: string
  resendCooldown: number
  submitText: string
  loadingText: string
  changeEmailText: string
}

export interface ForgotPasswordForm {
  requestStep: {
    title: string
    subtitle: string
    emailPlaceholder: string
    submitText: string
    loadingText: string
    backText: string
  }
  codeStep: {
    title: string
    subtitle: string
    codeLength: number
    submitText: string
    loadingText: string
  }
  newPasswordStep: {
    title: string
    subtitle: string
    passwordPlaceholder: string
    confirmPlaceholder: string
    submitText: string
    loadingText: string
  }
}

export interface ErrorMessages {
  invalidEmail: string
  invalidPassword: string
  passwordMismatch: string
  emailInUse: string
  invalidCredentials: string
  userNotFound: string
  invalidCode: string
  codeExpired: string
  networkError: string
  socialAuthFailed: string
  tooManyAttempts: string
}

// =============================================================================
// Component Props
// =============================================================================

export type AuthView = 'login' | 'register' | 'verification' | 'forgot-password' | 'reset-password'

export interface UserAuthenticationProps {
  /** Configuration for branding and labels */
  authConfig: AuthConfig
  /** Available social login providers */
  socialProviders: SocialProvider[]
  /** Login form configuration */
  loginForm: LoginForm
  /** Registration form configuration */
  registerForm: RegisterForm
  /** Email/code verification form configuration */
  verificationForm: VerificationForm
  /** Forgot password flow configuration */
  forgotPasswordForm: ForgotPasswordForm
  /** Error message templates */
  errorMessages: ErrorMessages
  /** Current active view */
  currentView?: AuthView
  /** Email being verified (for verification screen) */
  verificationEmail?: string
  /** Whether form is in loading state */
  isLoading?: boolean
  /** Current error message to display */
  error?: string
  /** Called when user submits login form */
  onLogin?: (email: string, password: string) => void
  /** Called when user submits registration form */
  onRegister?: (name: string, email: string, password: string) => void
  /** Called when user clicks a social auth provider */
  onSocialAuth?: (providerId: string) => void
  /** Called when user submits verification code */
  onVerifyCode?: (code: string) => void
  /** Called when user requests code resend */
  onResendCode?: () => void
  /** Called when user requests password reset email */
  onForgotPassword?: (email: string) => void
  /** Called when user submits new password */
  onResetPassword?: (password: string) => void
  /** Called when user switches between login/register tabs */
  onTabChange?: (tab: 'login' | 'register') => void
  /** Called when user clicks back/cancel in a flow */
  onBack?: () => void
  /** Called when user clicks terms/privacy links */
  onNavigate?: (href: string) => void
}
