import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { needsOnboarding } from '../lib/api/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth()
  const location = useLocation()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  const [shouldRedirectToOnboarding, setShouldRedirectToOnboarding] = useState(false)

  useEffect(() => {
    async function checkOnboarding() {
      // Only check onboarding if auth is ready, user is authenticated, and not already on onboarding page
      if (auth.authReady && !auth.loading && auth.user && location.pathname !== '/onboarding') {
        setIsCheckingOnboarding(true)
        try {
          const needs = await needsOnboarding()
          if (needs) {
            setShouldRedirectToOnboarding(true)
          }
        } catch (error) {
          // If onboarding check fails, log error but don't block access
          console.error('Failed to check onboarding status:', error)
        } finally {
          setIsCheckingOnboarding(false)
        }
      }
    }

    checkOnboarding()
  }, [auth.user, auth.loading, auth.authReady, location.pathname])
  
  // Show loading spinner while auth is initializing or checking onboarding
  // Wait for authReady before making any auth decisions
  if (!auth.authReady || auth.loading || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (only check after authReady is true)
  if (auth.authReady && !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to onboarding if needed
  if (shouldRedirectToOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
