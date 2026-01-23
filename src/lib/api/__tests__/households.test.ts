import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as householdsApi from '../households'
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
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('households API', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  describe('createHousehold', () => {
    it('should create household and add user as admin member', async () => {
      const mockHousehold = {
        id: 'household-123',
        name: 'Test Household',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const mockInsertHousehold = vi.fn().mockResolvedValue({
        data: mockHousehold,
        error: null,
      })

      const mockInsertMember = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      })

      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'households') {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: mockHousehold,
              error: null,
            }),
          }
        }
        if (table === 'members') {
          return {
            insert: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
        return {}
      })

      const household = await householdsApi.createHousehold('Test Household')

      expect(household).toEqual({
        id: 'household-123',
        name: 'Test Household',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should throw error for empty name', async () => {
      await expect(householdsApi.createHousehold('')).rejects.toThrow('Household name is required')
      await expect(householdsApi.createHousehold('   ')).rejects.toThrow(
        'Household name is required'
      )
    })

    it('should throw error for name too short', async () => {
      await expect(householdsApi.createHousehold('A')).rejects.toThrow(
        'Household name must be at least 2 characters'
      )
    })
  })

  describe('getUserHouseholds', () => {
    it('should return all households for user', async () => {
      const mockMembers = [{ household_id: 'household-123' }, { household_id: 'household-456' }]
      const mockHouseholds = [
        {
          id: 'household-123',
          name: 'Household 1',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'household-456',
          name: 'Household 2',
          status: 'active',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]

      let callCount = 0
      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'members') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: mockMembers,
              error: null,
            }),
          }
        }
        if (table === 'households') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
              data: mockHouseholds,
              error: null,
            }),
          }
        }
        return {}
      })

      const households = await householdsApi.getUserHouseholds()

      expect(households).toHaveLength(2)
      expect(households[0].name).toBe('Household 1')
      expect(households[1].name).toBe('Household 2')
    })

    it('should return empty array when user has no households', async () => {
      ;(supabase.from as any).mockImplementation((table: string) => {
        if (table === 'members') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }
        }
        return {}
      })

      const households = await householdsApi.getUserHouseholds()

      expect(households).toEqual([])
    })
  })

  describe('getHousehold', () => {
    it('should return household by ID', async () => {
      const mockHousehold = {
        id: 'household-123',
        name: 'Test Household',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      ;(supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockHousehold,
          error: null,
        }),
      })

      const household = await householdsApi.getHousehold('household-123')

      expect(household).toEqual({
        id: 'household-123',
        name: 'Test Household',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should return null when household not found', async () => {
      ;(supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      })

      const household = await householdsApi.getHousehold('non-existent')

      expect(household).toBeNull()
    })
  })

  describe('updateHousehold', () => {
    it('should update household name', async () => {
      const mockHousehold = {
        id: 'household-123',
        name: 'Updated Name',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      ;(supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockHousehold,
          error: null,
        }),
      })

      const household = await householdsApi.updateHousehold('household-123', {
        name: 'Updated Name',
      })

      expect(household.name).toBe('Updated Name')
    })

    it('should throw error for invalid status', async () => {
      await expect(
        householdsApi.updateHousehold('household-123', { status: 'invalid' as any })
      ).rejects.toThrow('Invalid status value')
    })
  })
})
