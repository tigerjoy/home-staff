// =============================================================================
// Authentication Types
// =============================================================================

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  isEmailVerified: boolean
  onboardingCompleted: boolean
  authProvider: 'email' | 'google' | 'facebook'
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface SignUpParams {
  email: string
  password: string
  name: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface OTPParams {
  email: string
  purpose: 'email_verification' | 'password_reset'
}

export interface VerifyOTPParams {
  email: string
  code: string
  purpose: 'email_verification' | 'password_reset'
}

export interface ResetPasswordParams {
  email: string
  newPassword: string
}

export interface AuthError {
  message: string
  code?: string
  status?: number
}

export type AuthProvider = 'google' | 'facebook'
