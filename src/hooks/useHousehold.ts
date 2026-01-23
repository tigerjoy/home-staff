import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as householdsApi from '../lib/api/households'
import type { Household } from '../types'

const ACTIVE_HOUSEHOLD_KEY = 'active_household_id'

interface UseHouseholdReturn {
  activeHousehold: Household | null
  activeHouseholdId: string | null
  households: Household[]
  loading: boolean
  error: string | null
  switchHousehold: (householdId: string) => Promise<void>
  refreshHouseholds: () => Promise<void>
}

export function useHousehold(): UseHouseholdReturn {
  const navigate = useNavigate()
  const [activeHousehold, setActiveHousehold] = useState<Household | null>(null)
  const [activeHouseholdId, setActiveHouseholdId] = useState<string | null>(null)
  const [households, setHouseholds] = useState<Household[]>([])
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
      const userHouseholds = await householdsApi.getUserHouseholds()
      setHouseholds(userHouseholds)

      // If no active household is set, use the first one
      if (userHouseholds.length > 0) {
        const storedId = loadActiveHouseholdId()
        const activeId = storedId && userHouseholds.find((h) => h.id === storedId)
          ? storedId
          : userHouseholds[0].id

        setActiveHouseholdId(activeId)
        saveActiveHouseholdId(activeId)

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
  }
}
