import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../supabase/client'
import { fetchSummary } from '../summary'

vi.mock('../../supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      head: true,
    })),
  },
}))

describe('summary API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch summary statistics for a household', async () => {
    const mockEmployeesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [
          { id: 1, status: 'active' },
          { id: 2, status: 'active' },
          { id: 3, status: 'archived' },
        ],
        error: null,
      }),
    }

    const mockEmploymentQuery = {
      select: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({
        data: [
          { employee_id: 1, role: 'Cook' },
          { employee_id: 2, role: 'Cook' },
          { employee_id: 2, role: 'Driver' },
        ],
        error: null,
      }),
    }

    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockEmployeesQuery as any) // Employees query
      .mockReturnValueOnce(mockEmploymentQuery as any) // Employment history query

    const result = await fetchSummary('1')

    expect(result.totalStaff).toBe(3)
    expect(result.activeStaff).toBe(2)
    expect(result.archivedStaff).toBe(1)
    expect(result.roleBreakdown).toEqual({ Cook: 2, Driver: 1 })
  })

  it('should return zeros when no employees exist', async () => {
    const mockEmployeesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }

    const mockEmploymentQuery = {
      select: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }

    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockEmployeesQuery as any)
      .mockReturnValueOnce(mockEmploymentQuery as any)

    const result = await fetchSummary('1')

    expect(result.totalStaff).toBe(0)
    expect(result.activeStaff).toBe(0)
    expect(result.archivedStaff).toBe(0)
    expect(result.roleBreakdown).toEqual({})
  })

  it('should handle errors when fetching summary', async () => {
    const mockEmployeesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    }

    vi.mocked(supabase.from).mockReturnValue(mockEmployeesQuery as any)

    await expect(fetchSummary('1')).rejects.toThrow()
  })
})
