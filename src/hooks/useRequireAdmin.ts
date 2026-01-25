import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHousehold } from './useHousehold'
import * as membersApi from '../lib/api/members'

/**
 * Hook to require admin access for the current household
 * Redirects to settings if user is not an admin
 */
export function useRequireAdmin() {
  const navigate = useNavigate()
  const { activeHouseholdId } = useHousehold()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminAccess() {
      if (!activeHouseholdId) {
        setLoading(false)
        return
      }

      try {
        const role = await membersApi.getCurrentUserRole(activeHouseholdId)
        setIsAdmin(role === 'Admin')
        if (role !== 'Admin') {
          navigate('/settings', { replace: true })
        }
      } catch (err) {
        console.error('Failed to check admin access:', err)
        setIsAdmin(false)
        navigate('/settings', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [activeHouseholdId, navigate])

  return { isAdmin, loading }
}
