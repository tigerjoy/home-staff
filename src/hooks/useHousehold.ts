import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as householdsApi from '../lib/api/households'
import * as profileApi from '../lib/api/profile'
import type { Household } from '../types'

const ACTIVE_HOUSEHOLD_KEY = 'active_household_id'

export interface HouseholdWithRole extends Household {
  role: 'Admin' | 'Member'
  isPrimary: boolean
}

interface UseHouseholdReturn {
  activeHousehold: Household | null
  activeHouseholdId: string | null
  households: HouseholdWithRole[]
  loading: boolean
  error: string | null
  switchHousehold: (householdId: string) => Promise<void>
  refreshHouseholds: () => Promise<void>
  setPrimaryHousehold: (householdId: string) => Promise<void>
}

export function useHousehold(): UseHouseholdReturn {
  const navigate = useNavigate()
  const [activeHousehold, setActiveHousehold] = useState<Household | null>(null)
  const [activeHouseholdId, setActiveHouseholdId] = useState<string | null>(null)
  const [households, setHouseholds] = useState<HouseholdWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load active household ID from localStorage
  const loadActiveHouseholdId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACTIVE_HOUSEHOLD_KEY)
  }, [])

  // Save active household ID to localStorage
  const saveActiveHouseholdId = useCallback((householdId: string | null) => {
    if (typeof window === 'undefined') return
    if (householdId) {
      localStorage.setItem(ACTIVE_HOUSEHOLD_KEY, householdId)
    } else {
      localStorage.removeItem(ACTIVE_HOUSEHOLD_KEY)
    }
  }, [])

  // Fetch households for the current user
  const fetchHouseholds = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userHouseholds = await householdsApi.getUserHouseholdsWithRoles()
      setHouseholds(userHouseholds)

      if (userHouseholds.length > 0) {
        // Priority: last opened > primary > first household
        let activeId: string | null = null

        // 1. Check last opened household from database
        const lastOpenedId = await householdsApi.getLastOpenedHousehold()
        if (lastOpenedId && userHouseholds.find((h) => h.id === lastOpenedId)) {
          activeId = lastOpenedId
        }

        // 2. Fallback to primary household
        if (!activeId) {
          const primaryHousehold = userHouseholds.find((h) => h.isPrimary)
          if (primaryHousehold) {
            activeId = primaryHousehold.id
          }
        }

        // 3. Fallback to first household
        if (!activeId) {
          activeId = userHouseholds[0].id
        }

        // Also check localStorage as a temporary cache
        const storedId = loadActiveHouseholdId()
        if (storedId && userHouseholds.find((h) => h.id === storedId)) {
          // If stored ID exists and is valid, use it (but still update database)
          activeId = storedId
        }

        setActiveHouseholdId(activeId)
        saveActiveHouseholdId(activeId)

        // Update database with last opened household
        try {
          await householdsApi.setLastOpenedHousehold(activeId)
        } catch (err) {
          // Log but don't fail - localStorage is already updated
          console.error('Failed to update last opened household in database:', err)
        }

        // Load the active household details
        const household = await householdsApi.getHousehold(activeId)
        setActiveHousehold(household)
      } else {
        // No households - redirect to onboarding
        setActiveHouseholdId(null)
        setActiveHousehold(null)
        saveActiveHouseholdId(null)
        navigate('/onboarding')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load households')
      console.error('Error loading households:', err)
    } finally {
      setLoading(false)
    }
  }, [loadActiveHouseholdId, saveActiveHouseholdId, navigate])

  // Switch to a different household
  const switchHousehold = useCallback(
    async (householdId: string) => {
      try {
        setLoading(true)
        setError(null)

        const household = await householdsApi.getHousehold(householdId)
        if (!household) {
          throw new Error('Household not found')
        }

        setActiveHouseholdId(householdId)
        setActiveHousehold(household)
        saveActiveHouseholdId(householdId)

        // Update database with last opened household (for cross-device sync)
        try {
          await householdsApi.setLastOpenedHousehold(householdId)
        } catch (err) {
          // Log but don't fail - localStorage is already updated
          console.error('Failed to update last opened household in database:', err)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to switch household')
        console.error('Error switching household:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [saveActiveHouseholdId]
  )

  // Set primary household
  const setPrimaryHousehold = useCallback(
    async (householdId: string) => {
      try {
        setError(null)
        await householdsApi.setPrimaryHousehold(householdId)
        // Refresh households to get updated primary status
        await fetchHouseholds()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to set primary household')
        console.error('Error setting primary household:', err)
        throw err
      }
    },
    [fetchHouseholds]
  )

  // Refresh households list
  const refreshHouseholds = useCallback(async () => {
    await fetchHouseholds()
  }, [fetchHouseholds])

  // Initialize on mount
  useEffect(() => {
    fetchHouseholds()
  }, [fetchHouseholds])

  return {
    activeHousehold,
    activeHouseholdId,
    households,
    loading,
    error,
    switchHousehold,
    refreshHouseholds,
    setPrimaryHousehold,
  }
}
