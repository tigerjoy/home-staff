import { supabase } from '../../supabase'
import type {
  AuthUser,
  SignUpParams,
  SignInParams,
  OTPParams,
  VerifyOTPParams,
  ResetPasswordParams,
  AuthProvider,
  AuthError,
} from '../../types/auth'

// Map Supabase errors to user-friendly messages
function mapAuthError(error: any): AuthError {
  if (!error) {
    return { message: 'An unknown error occurred' }
  }

  const errorMessage = error.message || error.error_description || 'An error occurred'
  const errorCode = error.status || error.code

  // Common Supabase auth error codes
  const errorMap: Record<string, string> = {
    'invalid_credentials': 'Invalid email or password',
    'email_not_confirmed': 'Please verify your email address',
    'user_not_found': 'No account found with this email',
    'email_already_registered': 'An account with this email already exists',
    'weak_password': 'Password must be at least 8 characters',
    'signup_disabled': 'Registration is currently disabled',
    'too_many_requests': 'Too many requests. Please try again later.',
  }

  // Check if we have a mapped message
  for (const [code, message] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(code) || errorCode === code) {
      return { message, code, status: error.status }
    }
  }

  return { message: errorMessage, code: errorCode, status: error.status }
}

// Transform Supabase user to AuthUser
async function transformUser(supabaseUser: any): Promise<AuthUser | null> {
  if (!supabaseUser) return null

  // Fetch profile data with error handling
  let profile = null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    console.log('error', error);
    console.log('data', data);
    if (!error && data) {
      profile = data
    }
  } catch (error) {
    // Log error but don't throw - return user with defaults
    console.error('Error fetching profile:', error)
  }

  const authProvider = supabaseUser.app_metadata?.provider || 'email'
  const isEmailVerified = !!supabaseUser.email_confirmed_at

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
    avatarUrl: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
    isEmailVerified,
    onboardingCompleted: profile?.onboarding_completed || false,
    authProvider: authProvider === 'google' ? 'google' : authProvider === 'facebook' ? 'facebook' : 'email',
  }
}

// Sign up with email and password
export async function signUp(params: SignUpParams): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.name,
          name: params.name,
        },
      },
    })

    if (error) {
      return { user: null, error: mapAuthError(error) }
    }

    // Profile is created automatically by database trigger
    // But we can update it with the name if needed
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: params.name,
        })

      if (profileError) {
        console.error('Failed to update profile:', profileError)
      }

      const user = await transformUser(data.user)
      return { user, error: null }
    }

    return { user: null, error: { message: 'Failed to create user' } }
  } catch (error: any) {
    return { user: null, error: mapAuthError(error) }
  }
}

// Sign in with email and password
export async function signIn(params: SignInParams): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    })

    if (error) {
      return { user: null, error: mapAuthError(error) }
    }

    if (data.user) {
      const user = await transformUser(data.user)
      return { user, error: null }
    }

    return { user: null, error: { message: 'Failed to sign in' } }
  } catch (error: any) {
    return { user: null, error: mapAuthError(error) }
  }
}

// Sign in with OAuth provider
export async function signInWithOAuth(provider: AuthProvider): Promise<{ error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: mapAuthError(error) }
    }

    // OAuth redirects, so we don't return a user here
    return { error: null }
  } catch (error: any) {
    return { error: mapAuthError(error) }
  }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: mapAuthError(error) }
    }

    return { error: null }
  } catch (error: any) {
    return { error: mapAuthError(error) }
  }
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return await transformUser(user)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get current session
// Note: This function should NOT be used for initial auth state determination.
// Use onAuthStateChange in useAuth hook instead, as it properly waits for session restoration.
export async function getSession(): Promise<{ user: AuthUser | null; session: any | null }> {
  try {
    // Get the current user - this validates the JWT but does not wait for session hydration
    // on page load. For initial auth state, use onAuthStateChange instead.
    const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !validatedUser) {
      return { user: null, session: null }
    }

    // Now get the session object
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return { user: null, session: null }
    }

    // Transform user - now safe to query profiles because session is initialized
    const user = await transformUser(session.user)
    
    // If transformUser fails but we have a valid session, create user from session data
    if (!user && session.user) {
      const authProvider = session.user.app_metadata?.provider || 'email'
      const isEmailVerified = !!session.user.email_confirmed_at
      
      return {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url || null,
          isEmailVerified,
          onboardingCompleted: false,
          authProvider: authProvider === 'google' ? 'google' : authProvider === 'facebook' ? 'facebook' : 'email',
        },
        session,
      }
    }

    return { user, session }
  } catch (error) {
    console.error('Error getting session:', error)
    return { user: null, session: null }
  }
}

// Send OTP for email verification or password reset
export async function sendOTP(params: OTPParams): Promise<{ error: AuthError | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: {
        email: params.email,
        purpose: params.purpose,
      },
    })

    if (error) {
      return { error: mapAuthError(error) }
    }

    if (data?.error) {
      return { error: { message: data.error } }
    }

    return { error: null }
  } catch (error: any) {
    return { error: mapAuthError(error) }
  }
}

// Verify OTP code
export async function verifyOTP(params: VerifyOTPParams): Promise<{ verified: boolean; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: {
        email: params.email,
        code: params.code,
        purpose: params.purpose,
      },
    })

    // Check for error in response data first (even if HTTP status is non-2xx, data may contain error message)
    // This handles cases where the edge function returns { error: "message" } in the response body
    if (data?.error) {
      return { verified: false, error: { message: data.error } }
    }

    // If there's an HTTP error, the response body might still be in data
    // Supabase may set error for non-2xx statuses, but data can still contain the JSON response
    if (error) {
      // If data exists and has an error field, use it (this handles non-2xx responses with JSON bodies)
      if (data && typeof data === 'object' && 'error' in data) {
        return { verified: false, error: { message: data.error as string } }
      }
      // Otherwise, try to extract from error object or use mapped error
      return { verified: false, error: mapAuthError(error) }
    }

    if (data?.verified) {
      return { verified: true, error: null }
    }

    return { verified: false, error: { message: 'Verification failed' } }
  } catch (error: any) {
    // For caught errors, try to extract error message from response if available
    if (error?.data?.error) {
      return { verified: false, error: { message: error.data.error } }
    }
    return { verified: false, error: mapAuthError(error) }
  }
}

// Reset password (after OTP verification)
export async function resetPassword(params: ResetPasswordParams): Promise<{ error: AuthError | null }> {
  try {
    // First verify that OTP was verified (this should be checked before calling this)
    // Then update password
    const { error } = await supabase.auth.updateUser({
      password: params.newPassword,
    })

    if (error) {
      return { error: mapAuthError(error) }
    }

    return { error: null }
  } catch (error: any) {
    return { error: mapAuthError(error) }
  }
}

// Update user profile
export async function updateProfile(updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { user: null, error: { message: 'User not authenticated' } }
    }

    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      return { user: null, error: mapAuthError(error) }
    }

    const updatedUser = await transformUser(user)
    return { user: updatedUser, error: null }
  } catch (error: any) {
    return { user: null, error: mapAuthError(error) }
  }
}

// Mark onboarding as completed
export async function completeOnboarding(): Promise<{ error: AuthError | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: 'User not authenticated' } }
    }

    // Mark onboarding as completed in profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id)

    if (profileError) {
      return { error: mapAuthError(profileError) }
    }

    // Clear onboarding progress
    const { error: progressError } = await supabase
      .from('onboarding_progress')
      .delete()
      .eq('user_id', user.id)

    if (progressError) {
      // Log but don't fail - progress cleanup is not critical
      console.error('Failed to clear onboarding progress:', progressError)
    }

    return { error: null }
  } catch (error: any) {
    return { error: mapAuthError(error) }
  }
}

// Check if user needs onboarding
export async function needsOnboarding(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    return !profile?.onboarding_completed
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return false
  }
}
