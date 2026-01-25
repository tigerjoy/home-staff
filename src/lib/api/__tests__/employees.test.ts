import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../../supabase'
import {
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  archiveEmployee,
  restoreEmployee,
  getCurrentEmployment,
} from '../employees'
import type { Employee, UIEmployee } from '../../../types'

vi.mock('../../supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      count: 'exact' as const,
    })),
  },
}))

const mockHouseholdId = 'household-123'
const mockEmployeeId = 'employee-456'
const mockEmploymentId = 'employment-789'

const mockEmployee = {
  id: mockEmployeeId,
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockEmployment = {
  id: mockEmploymentId,
  employee_id: mockEmployeeId,
  household_id: mockHouseholdId,
  employment_type: 'monthly',
  role: 'Cook',
  start_date: '2024-01-15',
  end_date: null,
  status: 'active',
  holiday_balance: 5,
  current_salary: 15000,
  payment_method: 'Bank Transfer',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

describe('employees API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchEmployees', () => {
    it('should fetch employees for a household via employments', async () => {
      const mockEmployments = {
        data: [mockEmployment],
        error: null,
        count: 1,
      }

      const mockEmployees = {
        data: [mockEmployee],
        error: null,
      }

      const mockPhoneNumbers = { data: [], error: null }
      const mockAddresses = { data: [], error: null }
      const mockDocuments = { data: [], error: null }
      const mockCustomProperties = { data: [], error: null }
      const mockNotes = { data: [], error: null }
      const mockAllEmployments = { data: [mockEmployment], error: null }

      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue(mockEmployments),
              }),
            }),
          }),
        }),
      })

      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue(mockEmployees),
        }),
      })

      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue(mockAllEmployments),
        }),
      })

      // Mock related data fetches
      ;[mockPhoneNumbers, mockAddresses, mockDocuments, mockCustomProperties, mockNotes].forEach((mock) => {
        fromMock.mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue(mock),
          }),
        })
      })

      ;(supabase.from as any) = fromMock

      const result = await fetchEmployees(mockHouseholdId, 1, 20)

      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should return empty array when no employments exist', async () => {
      const mockEmployments = {
        data: [],
        error: null,
        count: 0,
      }

      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue(mockEmployments),
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as any) = fromMock

      const result = await fetchEmployees(mockHouseholdId, 1, 20)

      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })

  describe('fetchEmployee', () => {
    it('should fetch a single employee with employment data', async () => {
      const mockEmployeeData = {
        data: mockEmployee,
        error: null,
      }

      const mockEmployments = {
        data: [mockEmployment],
        error: null,
      }

      const mockRelatedData = {
        data: [],
        error: null,
      }

      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockEmployeeData),
          }),
        }),
      })

      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue(mockEmployments),
          }),
        }),
      })

      // Mock related data (5 calls)
      for (let i = 0; i < 5; i++) {
        fromMock.mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue(mockRelatedData),
          }),
        })
      }

      ;(supabase.from as any) = fromMock

      const result = await fetchEmployee(mockEmployeeId, mockHouseholdId)

      expect(result).toBeDefined()
      if (result) {
        expect(result.id).toBe(mockEmployeeId)
        expect(result.householdId).toBe(mockHouseholdId)
      }
    })

    it('should return null when employee not found', async () => {
      const mockEmployeeData = {
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      }

      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockEmployeeData),
          }),
        }),
      })

      ;(supabase.from as any) = fromMock

      const result = await fetchEmployee('non-existent', mockHouseholdId)

      expect(result).toBeNull()
    })
  })

  describe('createEmployee', () => {
    it('should create employee and initial employment via RPC', async () => {
      const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Employee',
        photo: null,
        phoneNumbers: [],
        addresses: [],
        documents: [],
        customProperties: [],
        notes: [],
      }

      const employmentData = {
        householdId: mockHouseholdId,
        employmentType: 'monthly' as const,
        role: 'Cook',
        startDate: '2024-01-15',
        holidayBalance: 0,
        currentSalary: 15000,
        paymentMethod: 'Bank Transfer' as const,
      }

      const rpcMock = vi.fn().mockResolvedValue({
        data: mockEmployeeId,
        error: null,
      })
      ;(supabase as unknown as { rpc: typeof rpcMock }).rpc = rpcMock

      const mockCreatedEmployee = { data: mockEmployee, error: null }
      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockCreatedEmployee),
          }),
        }),
      })
      fromMock.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [mockEmployment], error: null }),
          }),
        }),
      })
      for (let i = 0; i < 5; i++) {
        fromMock.mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        })
      }
      ;(supabase.from as unknown) = fromMock

      const result = await createEmployee(employeeData, employmentData)

      expect(result).toBeDefined()
      expect(result.id).toBe(mockEmployeeId)
      expect(rpcMock).toHaveBeenCalledWith('create_employee_with_employment', {
        p_employee: { name: 'Test Employee', photo: null },
        p_employment: {
          household_id: mockHouseholdId,
          employment_type: 'monthly',
          role: 'Cook',
          start_date: '2024-01-15',
          holiday_balance: 0,
          current_salary: 15000,
          payment_method: 'Bank Transfer',
        },
        p_phone_numbers: [],
        p_addresses: [],
        p_documents: [],
        p_custom_properties: [],
        p_notes: [],
      })
    })

    it('should throw error if RPC fails', async () => {
      const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Employee',
        photo: null,
        phoneNumbers: [],
        addresses: [],
        documents: [],
        customProperties: [],
        notes: [],
      }

      const employmentData = {
        householdId: mockHouseholdId,
        employmentType: 'monthly' as const,
        role: 'Cook',
        startDate: '2024-01-15',
        holidayBalance: 0,
        currentSalary: 15000,
        paymentMethod: 'Bank Transfer' as const,
      }

      const rpcMock = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Creation failed' },
      })
      ;(supabase as unknown as { rpc: typeof rpcMock }).rpc = rpcMock

      await expect(createEmployee(employeeData, employmentData)).rejects.toThrow()
    })
  })

  describe('archiveEmployee', () => {
    it('should archive employee employment', async () => {
      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      ;(supabase.from as any) = fromMock

      await expect(archiveEmployee(mockEmployeeId, mockHouseholdId)).resolves.not.toThrow()
    })
  })

  describe('restoreEmployee', () => {
    it('should restore archived employee employment', async () => {
      const fromMock = vi.fn()
      fromMock.mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      ;(supabase.from as any) = fromMock

      await expect(restoreEmployee(mockEmployeeId, mockHouseholdId)).resolves.not.toThrow()
    })
  })
})
