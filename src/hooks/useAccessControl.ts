import { useState, useEffect } from 'react'
import {
  canAccessHousehold,
  getMemberInfo,
  getUserPermissions,
  checkPermission,
  type AccessCheckResult,
  type MemberInfo,
} from '../lib/permissions/accessControl'
import type { Permission } from '../lib/permissions/constants'

export interface UseHouseholdAccessResult {
  hasAccess: boolean
  isPending: boolean
  role: 'Admin' | 'Member' | null
  permissions: string[]
  loading: boolean
  error: string | null
  memberInfo: MemberInfo | null
  checkPermission: (permission: Permission) => Promise<boolean>
  refetch: () => Promise<void>
}

/**
 * React hook for checking household access and permissions
 * 
 * @param householdId - The household ID to check access for
 * @returns Access status, permissions, and utility functions
 * 
 * @example
 * ```tsx
 * const { hasAccess, isPending, permissions, loading } = useHouseholdAccess(householdId)
 * 
 * if (loading) return <Loading />
 * if (!hasAccess) return <AccessDenied isPending={isPending} />
 * ```
 */
export function useHouseholdAccess(householdId: string | null): UseHouseholdAccessResult {
  const [accessResult, setAccessResult] = useState<AccessCheckResult | null>(null)
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccess = async () => {
    if (!householdId) {
      setAccessResult({
        hasAccess: false,
        isPending: false,
        role: null,
        permissions: [],
        error: 'No household selected',
      })
      setMemberInfo(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [accessCheck, info] = await Promise.all([
        canAccessHousehold(householdId),
        getMemberInfo(householdId),
      ])

      setAccessResult(accessCheck)
      setMemberInfo(info)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check access'
      setError(errorMessage)
      setAccessResult({
        hasAccess: false,
        isPending: false,
        role: null,
        permissions: [],
        error: errorMessage,
      })
      setMemberInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccess()
  }, [householdId])

  const checkPermissionAsync = async (permission: Permission): Promise<boolean> => {
    if (!householdId || !accessResult?.hasAccess) {
      return false
    }

    try {
      return await checkPermission(householdId, permission)
    } catch (err) {
      console.error('Error checking permission:', err)
      return false
    }
  }

  return {
    hasAccess: accessResult?.hasAccess ?? false,
    isPending: accessResult?.isPending ?? false,
    role: accessResult?.role ?? null,
    permissions: accessResult?.permissions ?? [],
    loading,
    error: error || accessResult?.error || null,
    memberInfo,
    checkPermission: checkPermissionAsync,
    refetch: fetchAccess,
  }
}

/**
 * Simplified hook that only checks if access is available
 * Useful for simple access gates
 */
export function useHasAccess(householdId: string | null): {
  hasAccess: boolean
  loading: boolean
} {
  const { hasAccess, loading } = useHouseholdAccess(householdId)
  return { hasAccess, loading }
}
