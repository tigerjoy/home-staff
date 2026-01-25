import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as invitationsApi from '../invitations'
import { supabase } from '../../../supabase'

vi.mock('../../../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}))

describe('invitations API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createInvitationCode', () => {
    it('should create an invitation code for a household', async () => {
      const mockUser = { id: 'user-1' }
      const mockHouseholdId = 'household-1'
      const mockCode = 'ABC12345'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      const mockInvitationQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'inv-1',
            household_id: mockHouseholdId,
            code: mockCode,
            created_by: mockUser.id,
            expires_at: null,
            max_uses: null,
            current_uses: 0,
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') return mockMemberQuery as any
        if (table === 'invitations') {
          // First call checks for existing, second call inserts
          if (mockInvitationQuery.single.mock.calls.length === 0) {
            return mockInvitationQuery as any
          }
          return mockInsertQuery as any
        }
        return {} as any
      })

      const result = await invitationsApi.createInvitationCode(mockHouseholdId)

      expect(result).toMatchObject({
        householdId: mockHouseholdId,
        code: mockCode,
        status: 'active',
      })
    })

    it('should throw error if user is not admin', async () => {
      const mockUser = { id: 'user-1' }
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'member' },
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') return mockMemberQuery as any
        return {} as any
      })

      await expect(
        invitationsApi.createInvitationCode(mockHouseholdId)
      ).rejects.toThrow('Only admins can create invitation codes')
    })
  })

  describe('validateInvitationCode', () => {
    it('should validate a valid invitation code', async () => {
      const mockCode = 'ABC12345'
      const mockHousehold = { name: 'Test Household' }

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'inv-1',
            household_id: 'household-1',
            code: mockCode,
            expires_at: null,
            max_uses: null,
            current_uses: 0,
            status: 'active',
            households: mockHousehold,
          },
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await invitationsApi.validateInvitationCode(mockCode)

      expect(result.valid).toBe(true)
      expect(result.householdName).toBe('Test Household')
    })

    it('should return invalid for expired code', async () => {
      const mockCode = 'ABC12345'
      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() - 1)

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'inv-1',
            household_id: 'household-1',
            code: mockCode,
            expires_at: expiredDate.toISOString(),
            max_uses: null,
            current_uses: 0,
            status: 'active',
            households: { name: 'Test Household' },
          },
          error: null,
        }),
        update: vi.fn().mockReturnThis(),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await invitationsApi.validateInvitationCode(mockCode)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('expired')
    })
  })

  describe('acceptInvitationCode', () => {
    it('should accept a valid invitation code', async () => {
      const mockUser = { id: 'user-1' }
      const mockCode = 'ABC12345'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      // Mock validateInvitationCode flow
      const mockValidateQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
          .mockResolvedValueOnce({
            // First call for validation
            data: {
              id: 'inv-1',
              household_id: mockHouseholdId,
              code: mockCode,
              expires_at: null,
              max_uses: null,
              current_uses: 0,
              status: 'active',
              households: { name: 'Test Household' },
            },
            error: null,
          })
          .mockResolvedValueOnce({
            // Second call for getting invitation
            data: {
              id: 'inv-1',
              household_id: mockHouseholdId,
              code: mockCode,
              expires_at: null,
              max_uses: null,
              current_uses: 0,
              status: 'active',
            },
            error: null,
          }),
      }

      const mockMembersQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
          .mockResolvedValueOnce({
            // Check existing member
            data: null,
            error: { code: 'PGRST116' },
          })
          .mockResolvedValueOnce({
            // Get existing households count
            data: [],
            error: null,
          }),
        insert: vi.fn().mockResolvedValue({ error: null }),
      }

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'invitations') return mockValidateQuery as any
        if (table === 'members') return mockMembersQuery as any
        return mockUpdateQuery as any
      })

      const result = await invitationsApi.acceptInvitationCode(mockCode)

      expect(result.success).toBe(true)
      expect(result.householdId).toBe(mockHouseholdId)
    })

    it('should return error for invalid code', async () => {
      const mockCode = 'INVALID'

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await invitationsApi.acceptInvitationCode(mockCode)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })
  })
})
