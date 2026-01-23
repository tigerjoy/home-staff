import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { needsOnboarding } from '../lib/api/auth'

export function AuthCallback() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for OAuth errors in URL query params
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      setError(errorDescription || errorParam)
      // Redirect to login after showing error
      setTimeout(() => {
        navigate('/login', { state: { error: errorDescription || errorParam } })
      }, 3000)
      return
    }
  }, [navigate, searchParams])

  // Handle redirect once session is available
  useEffect(() => {
    if (session) {
      // User is authenticated, check onboarding status
      needsOnboarding().then((needs) => {
        if (needs) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate('/staff', { replace: true })
        }
      })
    } else if (session === null && !error) {
      // Session is null (not loading), but no explicit error
      // Wait a moment for session to be processed, then check again
      const timeout = setTimeout(() => {
        if (!session) {
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            navigate('/login', { state: { error: 'Authentication failed. Please try again.' } })
          }, 3000)
        }
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [session, error, navigate])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Authentication Error
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{error}</p>
          <p className="text-sm text-stone-500 dark:text-stone-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  // Show loading while session is being determined (session is undefined during initial load)
  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Completing authentication...</p>
        </div>
      </div>
    )
  }

  return null
}
