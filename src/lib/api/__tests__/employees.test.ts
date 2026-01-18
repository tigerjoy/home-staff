import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../supabase/client'
import {
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  archiveEmployee,
  restoreEmployee,
} from '../employees'
import type { Employee } from '../../../types'

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

const mockEmployeeData = {
  id: 1,
  household_id: 1,
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
  holiday_balance: 5,
  employee_phone_numbers: [{ id: 1, number: '+91 98765 12345', label: 'Mobile' }],
  employee_addresses: [],
  employment_history: [
    {
      id: 1,
      role: 'Cook',
      department: 'Kitchen',
      start_date: '2024-01-15',
      end_date: null,
    },
  ],
  salary_history: [
    {
      id: 1,
      amount: 15000,
      payment_method: 'Bank Transfer',
      effective_date: '2024-01-15',
    },
  ],
  employee_documents: [],
  employee_custom_properties: [],
  employee_notes: [],
}

describe('employees API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchEmployees', () => {
    it('should fetch employees with pagination and filters', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockEmployeeData],
          error: null,
          count: 1,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchEmployees('1', 1, 20)

      expect(supabase.from).toHaveBeenCalledWith('employees')
      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should handle errors when fetching employees', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
          count: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      // Note: fetchEmployees will throw on error, but we can test the error case differently
      // For now, we'll just check that the query was attempted
      await expect(fetchEmployees('1', 1, 20)).rejects.toThrow()
    })
  })

  describe('fetchEmployee', () => {
    it('should fetch a single employee by ID', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockEmployeeData,
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchEmployee('1')

      expect(result).toBeTruthy()
      expect(result?.name).toBe('Priya Sharma')
    })

    it('should return null when employee not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchEmployee('999')

      expect(result).toBeNull()
    })
  })

  describe('createEmployee', () => {
    it('should create a new employee with related data', async () => {
      const newEmployee: Omit<Employee, 'id'> = {
        householdId: 1,
        name: 'New Employee',
        photo: null,
        status: 'active',
        holidayBalance: 0,
        phoneNumbers: [{ number: '+91 98765 12345', label: 'Mobile' }],
        addresses: [],
        employmentHistory: [],
        salaryHistory: [],
        documents: [],
        customProperties: [],
        notes: [],
      }

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockEmployeeData, id: 2, name: 'New Employee' },
          error: null,
        }),
      }

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockInsertQuery as any) // Main insert
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Phone numbers
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Addresses
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Employment
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Salary
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Documents
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Custom props
        .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any) // Notes

      // Mock fetchEmployee to return the created employee
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue({
        ...mockEmployeeData,
        id: 2,
        name: 'New Employee',
      } as any)

      const result = await createEmployee(newEmployee)

      expect(result.name).toBe('New Employee')
      expect(supabase.from).toHaveBeenCalledWith('employees')
    })
  })

  describe('updateEmployee', () => {
    it('should update an employee and related data', async () => {
      const updateData = {
        name: 'Updated Name',
      }

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockEmployeeData, name: 'Updated Name' },
          error: null,
        }),
      }

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockUpdateQuery as any) // Main update
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete phones
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete addresses
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete employment
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete salary
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete documents
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete custom
        .mockReturnValueOnce({ delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) } as any) // Delete notes

      const result = await updateEmployee('1', updateData)

      expect(result.name).toBe('Updated Name')
    })
  })

  describe('archiveEmployee', () => {
    it('should update employee status to archived', async () => {
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockUpdateQuery as any)

      await archiveEmployee('1')

      expect(supabase.from).toHaveBeenCalledWith('employees')
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ status: 'archived' })
    })
  })

  describe('restoreEmployee', () => {
    it('should update employee status to active', async () => {
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockUpdateQuery as any)

      await restoreEmployee('1')

      expect(supabase.from).toHaveBeenCalledWith('employees')
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ status: 'active' })
    })
  })
})
