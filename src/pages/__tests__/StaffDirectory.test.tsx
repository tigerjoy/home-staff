import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { StaffDirectory } from '../StaffDirectory'
import * as employeesApi from '../../lib/api/employees'
import * as summaryApi from '../../lib/api/summary'
import type { Employee, Summary } from '../../types'

// Mock the API functions
vi.mock('../../lib/api/employees')
vi.mock('../../lib/api/summary')
vi.mock('../../lib/utils/export')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockEmployee: Employee = {
  id: '1',
  householdId: 1,
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
  holidayBalance: 5,
  phoneNumbers: [{ id: 1, number: '+91 98765 12345', label: 'Mobile' }],
  addresses: [],
  employmentHistory: [
    {
      id: 1,
      role: 'Cook',
      department: 'Kitchen',
      startDate: '2024-01-15',
      endDate: null,
    },
  ],
  salaryHistory: [
    {
      id: 1,
      amount: 15000,
      paymentMethod: 'Bank Transfer',
      effectiveDate: '2024-01-15',
    },
  ],
  documents: [],
  customProperties: [],
  notes: [],
}

const mockSummary: Summary = {
  totalStaff: 5,
  activeStaff: 4,
  archivedStaff: 1,
  roleBreakdown: { Housekeeper: 2, Cook: 1, Driver: 1 },
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('StaffDirectory Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Flow 1: View Staff Directory', () => {
    it('should display summary cards with correct counts', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee],
        totalCount: 1,
        error: null,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/total staff/i)).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText(/active/i)).toBeInTheDocument()
        expect(screen.getByText('4')).toBeInTheDocument()
      })
    })

    it('should display employee cards with name, role, phone, and holiday balance', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee],
        totalCount: 1,
        error: null,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
        expect(screen.getByText('Cook')).toBeInTheDocument()
        expect(screen.getByText('+91 98765 12345')).toBeInTheDocument()
        expect(screen.getByText(/5.*days?/i)).toBeInTheDocument()
      })
    })

    it('should show "Add Staff" button in header', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        ...mockSummary,
        totalStaff: 0,
        activeStaff: 0,
      })

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add staff/i })).toBeInTheDocument()
      })
    })
  })

  describe('Empty State Tests', () => {
    it('should show empty state when no staff exists', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        totalStaff: 0,
        activeStaff: 0,
        archivedStaff: 0,
        roleBreakdown: {},
      })

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/no staff found/i)).toBeInTheDocument()
        expect(screen.getByText(/get started by adding/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /add staff/i })).toBeInTheDocument()
      })
    })

    it('should show filtered empty state when filters return no results', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/no staff found/i)).toBeInTheDocument()
        expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument()
      })
    })
  })

  describe('Component Interactions', () => {
    it('should navigate to add employee page when "Add Staff" is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        totalStaff: 0,
        activeStaff: 0,
        archivedStaff: 0,
        roleBreakdown: {},
      })

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add staff/i })).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /add staff/i })
      await user.click(addButton)

      expect(mockNavigate).toHaveBeenCalledWith('/staff/new')
    })

    it('should navigate to employee detail when employee card is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee],
        totalCount: 1,
        error: null,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      const employeeCard = screen.getByText('Priya Sharma').closest('div[role="button"]')
      if (employeeCard) {
        await user.click(employeeCard)
        expect(mockNavigate).toHaveBeenCalledWith('/staff/1')
      }
    })
  })

  describe('Loading and Error States', () => {
    it('should show loading state initially', () => {
      vi.mocked(employeesApi.fetchEmployees).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )
      vi.mocked(summaryApi.fetchSummary).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      renderWithRouter(<StaffDirectory />)

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should show error message when API fails', async () => {
      vi.mocked(employeesApi.fetchEmployees).mockRejectedValue(new Error('API Error'))
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
      })
    })
  })
})
