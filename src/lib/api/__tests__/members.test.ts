import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as membersApi from '../members'
import { supabase } from '../../../supabase'

vi.mock('../../../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}))

describe('members API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHouseholdMembers', () => {
    it('should fetch household members with profile data', async () => {
      const mockHouseholdId = 'household-1'
      const mockMembers = [
        {
          id: 'mem-1',
          user_id: 'user-1',
          household_id: mockHouseholdId,
          role: 'admin',
          joined_at: '2024-01-01T00:00:00Z',
          is_primary: true,
          profiles: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar_url: 'https://example.com/avatar.jpg',
          },
        },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockMembers,
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await membersApi.getHouseholdMembers(mockHouseholdId)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'mem-1',
        role: 'Admin',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      })
    })
  })

  describe('updateMemberRole', () => {
    it('should update member role if user is admin', async () => {
      const mockUser = { id: 'admin-user' }
      const mockMemberId = 'mem-1'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockCurrentMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      const mockAdminCountQuery = {
        select: vi.fn().mockReturnValue({
          data: [{ id: 'mem-1' }, { id: 'mem-2' }],
          error: null,
        }),
      }

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') {
          // First call checks current user role
          if (mockCurrentMemberQuery.single.mock.calls.length === 0) {
            return mockCurrentMemberQuery as any
          }
          // Second call gets admin count
          if (mockAdminCountQuery.select.mock.calls.length === 0) {
            return mockAdminCountQuery as any
          }
          // Third call updates
          return mockUpdateQuery as any
        }
        return {} as any
      })

      await membersApi.updateMemberRole(mockMemberId, mockHouseholdId, 'Member')

      expect(mockUpdateQuery.update).toHaveBeenCalled()
    })

    it('should throw error if user is not admin', async () => {
      const mockUser = { id: 'regular-user' }
      const mockMemberId = 'mem-1'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'member' },
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      await expect(
        membersApi.updateMemberRole(mockMemberId, mockHouseholdId, 'Admin')
      ).rejects.toThrow('Only admins can change member roles')
    })

    it('should prevent changing role of last admin', async () => {
      const mockUser = { id: 'admin-user' }
      const mockMemberId = 'mem-1'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockCurrentMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      const mockAdminCountQuery = {
        select: vi.fn().mockReturnValue({
          data: [{ id: 'mem-1' }], // Only one admin
          error: null,
        }),
      }

      const mockTargetMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') {
          // First call checks current user
          if (mockCurrentMemberQuery.single.mock.calls.length === 0) {
            return mockCurrentMemberQuery as any
          }
          // Second call gets admin count
          if (mockAdminCountQuery.select.mock.calls.length === 0) {
            return mockAdminCountQuery as any
          }
          // Third call gets target member
          return mockTargetMemberQuery as any
        }
        return {} as any
      })

      await expect(
        membersApi.updateMemberRole(mockMemberId, mockHouseholdId, 'Member')
      ).rejects.toThrow('Cannot change role of the last admin')
    })
  })

  describe('removeMember', () => {
    it('should remove member if user is admin', async () => {
      const mockUser = { id: 'admin-user' }
      const mockMemberId = 'mem-1'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockCurrentMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      const mockAdminCountQuery = {
        select: vi.fn().mockReturnValue({
          data: [{ id: 'mem-1' }, { id: 'mem-2' }],
          error: null,
        }),
      }

      const mockTargetMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { user_id: 'other-user' },
          error: null,
        }),
      }

      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') {
          // First call checks current user
          if (mockCurrentMemberQuery.single.mock.calls.length === 0) {
            return mockCurrentMemberQuery as any
          }
          // Second call gets admin count
          if (mockAdminCountQuery.select.mock.calls.length === 0) {
            return mockAdminCountQuery as any
          }
          // Third call gets target member
          if (mockTargetMemberQuery.single.mock.calls.length === 0) {
            return mockTargetMemberQuery as any
          }
          // Fourth call deletes
          return mockDeleteQuery as any
        }
        return {} as any
      })

      await membersApi.removeMember(mockMemberId, mockHouseholdId)

      expect(mockDeleteQuery.delete).toHaveBeenCalled()
    })

    it('should prevent removing yourself', async () => {
      const mockUser = { id: 'user-1' }
      const mockMemberId = 'mem-1'
      const mockHouseholdId = 'household-1'

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any)

      const mockCurrentMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { role: 'admin' },
          error: null,
        }),
      }

      const mockAdminCountQuery = {
        select: vi.fn().mockReturnValue({
          data: [{ id: 'mem-1' }, { id: 'mem-2' }],
          error: null,
        }),
      }

      const mockTargetMemberQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { user_id: mockUser.id }, // Same user
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'members') {
          if (mockCurrentMemberQuery.single.mock.calls.length === 0) {
            return mockCurrentMemberQuery as any
          }
          if (mockAdminCountQuery.select.mock.calls.length === 0) {
            return mockAdminCountQuery as any
          }
          return mockTargetMemberQuery as any
        }
        return {} as any
      })

      await expect(
        membersApi.removeMember(mockMemberId, mockHouseholdId)
      ).rejects.toThrow('You cannot remove yourself')
    })
  })
})
