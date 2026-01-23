/**
 * @deprecated This hook is deprecated. Use useSession() from SessionContext for session access
 * and import auth action functions directly from src/lib/api/auth.ts
 * 
 * Migration guide:
 * - Replace `useAuth()` with `useSession()` for session/user access
 * - Replace `auth.signIn()`, `auth.signUp()`, etc. with direct imports from `src/lib/api/auth.ts`
 * - Session state is automatically managed by SessionProvider
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import * as authApi from '../lib/api/auth'
import type { AuthUser, SignUpParams, SignInParams, OTPParams, VerifyOTPParams, ResetPasswordParams, AuthProvider } from '../types/auth'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  authReady: boolean
  error: string | null
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>
  signInWithOAuth: (provider: AuthProvider) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  sendVerificationOTP: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOTP: (email: string, code: string, purpose: 'email_verification' | 'password_reset') => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyResetOTP: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
  needsOnboarding: () => Promise<boolean>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track if initial auth state has been set to prevent race conditions
  const hasInitializedRef = useRef(false)

  // Initialize auth state - listen for changes first, then check for existing session
  useEffect(() => {
    let mounted = true

    // Check for token_hash in URL params (magic link callback)
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')

    // Handle magic link callback if token_hash exists
    if (token_hash) {
      supabase.auth
        .verifyOtp({
          token_hash,
          type: (type as any) || 'email',
        })
        .then(({ error }) => {
          if (error) {
            console.error('OTP verification error:', error)
            setError(error.message)
          } else {
            // Clear URL params after successful verification
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        })
    }

    // Helper function to handle session initialization
    const handleSession = async (session: { user: { id: string } } | null) => {
      if (session?.user) {
        try {
          const transformedUser = await authApi.getCurrentUser()
          if (mounted) {
            setUser(transformedUser)
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          if (mounted) {
            setUser(null)
          }
        }
      } else {
        if (mounted) {
          setUser(null)
        }
      }

      if (mounted) {
        setAuthReady(true)
        setLoading(false)
      }
    }

    // Set up listener for auth state changes (including INITIAL_SESSION)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      console.log('auth state change', event, session);
      if (!mounted) return

      try {
        if (event === 'INITIAL_SESSION') {
          // Handle initial session on page load/reload
          hasInitializedRef.current = true
          await handleSession(session)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('signed in or token refreshed', event, session);
          // User signed in or token refreshed
          hasInitializedRef.current = true
          if (session?.user) {
            console.log('session.user', session.user);
            try {
              const transformedUser = await authApi.getCurrentUser()
              console.log('transformedUser', transformedUser);
              if (mounted) {
                setUser(transformedUser)
                setAuthReady(true)
                setLoading(false)
              }
            } catch (error) {
              console.error('Failed to fetch user data:', error)
              if (mounted) {
                setUser(null)
                setAuthReady(true)
                setLoading(false)
              }
            }
          } else {
            if (mounted) {
              setUser(null)
              setAuthReady(true)
              setLoading(false)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          if (mounted) {
            setUser(null)
            setAuthReady(true)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error)
        if (mounted) {
          setAuthReady(true)
          setLoading(false)
        }
      }
    })

    // Fallback: Check for existing session if onAuthStateChange didn't fire INITIAL_SESSION
    // This handles edge cases where the event might not fire
    const fallbackTimeout = setTimeout(async () => {
      if (!hasInitializedRef.current && mounted) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted || hasInitializedRef.current) return

        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setAuthReady(true)
          setUser(null)
          setLoading(false)
          return
        }

        hasInitializedRef.current = true
        await handleSession(session)
      }
    }, 100)

    return () => {
      mounted = false
      clearTimeout(fallbackTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (params: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      const { user: newUser, error: authError } = await authApi.signUp(params)
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      if (newUser) {
        setUser(newUser)
        return { success: true }
      }

      return { success: false, error: 'Failed to create user' }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to sign up'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const signIn = useCallback(async (params: SignInParams): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      const { user: signedInUser, error: authError } = await authApi.signIn(params)
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      if (signedInUser) {
        setUser(signedInUser)
        return { success: true }
      }

      return { success: false, error: 'Failed to sign in' }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to sign in'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const signInWithOAuth = useCallback(async (provider: AuthProvider): Promise<{ error?: string }> => {
    setError(null)
    try {
      const { error: authError } = await authApi.signInWithOAuth(provider)
      if (authError) {
        setError(authError.message)
        return { error: authError.message }
      }
      // OAuth redirects, so we don't update state here
      return {}
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in with OAuth'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    setError(null)
    setLoading(true)
    try {
      const { error: authError } = await authApi.signOut()
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return
      }

      setUser(null)
    } catch (err: any) {
      setLoading(false)
      setError(err.message || 'Failed to sign out')
    }
  }, [])

  const sendVerificationOTP = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      const { error: authError } = await authApi.sendOTP({
        email,
        purpose: 'email_verification',
      })
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      return { success: true }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to send verification code'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const verifyOTP = useCallback(async (
    email: string,
    code: string,
    purpose: 'email_verification' | 'password_reset'
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      const { verified, error: authError } = await authApi.verifyOTP({
        email,
        code,
        purpose,
      })
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      if (verified) {
        // Refresh user data after verification
        const updatedUser = await authApi.getCurrentUser()
        if (updatedUser) {
          setUser(updatedUser)
        }
        return { success: true }
      }

      return { success: false, error: 'Verification failed' }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to verify code'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      const { error: authError } = await authApi.sendOTP({
        email,
        purpose: 'password_reset',
      })
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      return { success: true }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to send reset code'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const verifyResetOTP = useCallback(async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    return verifyOTP(email, code, 'password_reset')
  }, [verifyOTP])

  const updatePassword = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null)
    setLoading(true)
    try {
      // Get current user email for the API call
      const currentUser = await authApi.getCurrentUser()
      if (!currentUser) {
        setLoading(false)
        return { success: false, error: 'User not authenticated' }
      }

      const { error: authError } = await authApi.resetPassword({
        email: currentUser.email,
        newPassword: password,
      })
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return { success: false, error: authError.message }
      }

      return { success: true }
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to update password'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const updatedUser = await authApi.getCurrentUser()
      setUser(updatedUser)
    } catch (err) {
      console.error('Failed to refresh user:', err)
    }
  }, [])

  const needsOnboarding = useCallback(async (): Promise<boolean> => {
    try {
      return await authApi.needsOnboarding()
    } catch (err) {
      console.error('Failed to check onboarding status:', err)
      return false
    }
  }, [])

  return {
    user,
    loading,
    authReady,
    error,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    sendVerificationOTP,
    verifyOTP,
    resetPassword,
    verifyResetOTP,
    updatePassword,
    refreshUser,
    needsOnboarding,
  }
}
