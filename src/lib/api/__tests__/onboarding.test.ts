import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as onboardingApi from '../onboarding'
import { supabase } from '../../../supabase'

// Mock Supabase client
vi.mock('../../supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('onboarding API', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  describe('getOnboardingProgress', () => {
    it('should return progress when it exists', async () => {
      const mockProgress = {
        user_id: 'user-123',
        current_step_index: 1,
        step_data: { step_0: { householdName: 'Test Household' } },
        last_saved_at: '2024-01-01T00:00:00Z',
      }

      ;(supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockProgress,
          error: null,
        }),
      })

      const progress = await onboardingApi.getOnboardingProgress()

      expect(progress).toEqual({
        userId: 'user-123',
        currentStepIndex: 1,
        totalSteps: 4,
        isCompleted: false,
        lastSavedAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should return default progress when not found', async () => {
      ;(supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      })

      const progress = await onboardingApi.getOnboardingProgress()

      expect(progress).toEqual({
        userId: 'user-123',
        currentStepIndex: 0,
        totalSteps: 4,
        isCompleted: false,
        lastSavedAt: expect.any(String),
      })
    })

    it('should return null when user is not authenticated', async () => {
      ;(supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const progress = await onboardingApi.getOnboardingProgress()

      expect(progress).toBeNull()
    })
  })

  describe('saveOnboardingProgress', () => {
    it('should create new progress when it does not exist', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })

      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'onboarding_progress') {
          return {
            select: mockSelect,
            insert: vi.fn().mockReturnValue({
              insert: mockInsert,
            }),
            eq: mockEq,
            single: mockSingle,
          }
        }
        return {}
      })

      await onboardingApi.saveOnboardingProgress(1, { householdName: 'Test' })

      expect(mockInsert).toHaveBeenCalled()
    })

    it('should update existing progress', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: { user_id: 'user-123', step_data: {} },
        error: null,
      })

      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'onboarding_progress') {
          return {
            select: mockSelect,
            update: vi.fn().mockReturnValue({
              update: mockUpdate,
              eq: mockEq,
            }),
            eq: mockEq,
            single: mockSingle,
          }
        }
        return {}
      })

      await onboardingApi.saveOnboardingProgress(1, { householdName: 'Test' })

      expect(mockUpdate).toHaveBeenCalled()
    })

    it('should throw error for invalid step index', async () => {
      await expect(onboardingApi.saveOnboardingProgress(-1, {})).rejects.toThrow(
        'Invalid step index'
      )
      await expect(onboardingApi.saveOnboardingProgress(4, {})).rejects.toThrow(
        'Invalid step index'
      )
    })
  })

  describe('completeOnboarding', () => {
    it('should mark onboarding as complete', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null })

      ;(supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          update: mockUpdate,
        }),
      })

      await onboardingApi.completeOnboarding()

      expect(mockUpdate).toHaveBeenCalled()
    })
  })

  describe('resetOnboardingProgress', () => {
    it('should delete progress and reset onboarding status', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null })

      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'onboarding_progress') {
          return {
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({
              delete: mockDelete,
            }),
          }
        }
        if (table === 'profiles') {
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({
              update: mockUpdate,
            }),
          }
        }
        return {}
      })

      await onboardingApi.resetOnboardingProgress()

      expect(mockDelete).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
    })
  })
})
