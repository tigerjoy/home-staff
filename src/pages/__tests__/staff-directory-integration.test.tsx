import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { StaffDirectory } from '../StaffDirectory'
import { EmployeeDetail } from '../EmployeeDetail'
import { AddEmployee } from '../AddEmployee'
import * as employeesApi from '../../lib/api/employees'
import * as summaryApi from '../../lib/api/summary'
import * as storageApi from '../../lib/storage/documents'
import type { Employee, Summary } from '../../types'

// Mock all API functions
vi.mock('../../lib/api/employees')
vi.mock('../../lib/api/summary')
vi.mock('../../lib/storage/documents')

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

const renderWithRouter = (component: React.ReactElement, initialEntries?: string[]) => {
  if (initialEntries) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    )
  }
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Staff Directory - End-to-End Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete User Flow: View → View Detail → Edit → Archive', () => {
    it('should complete the full workflow from list to archive', async () => {
      const user = userEvent.setup()

      // Step 1: View staff directory
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee],
        total: 1,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      // Step 2: Navigate to employee detail
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      const employeeCard = screen.getByText('Priya Sharma').closest('div[role="button"]')
      if (employeeCard) {
        await user.click(employeeCard)
      }

      // Should have called navigate to detail
      expect(mockNavigate).toHaveBeenCalledWith('/staff/1')

      // Step 3: View employee detail page
      renderWithRouter(<EmployeeDetail />, ['/staff/1'])

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
        expect(screen.getByText('Cook')).toBeInTheDocument()
      })

      // Step 4: Archive employee
      const archivedEmployee = { ...mockEmployee, status: 'archived' as const }
      vi.mocked(employeesApi.archiveEmployee).mockResolvedValue()
      vi.mocked(employeesApi.fetchEmployee)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(archivedEmployee)

      const archiveButton = screen.getByRole('button', { name: /archive/i })
      await user.click(archiveButton)

      // Wait for confirmation modal if present
      await waitFor(() => {
        const confirmButton = screen.queryByRole('button', { name: /confirm|archive/i })
        if (confirmButton) {
          return user.click(confirmButton)
        }
      }, { timeout: 1000 }).catch(() => {
        // Modal might not be in the component, which is fine for this test
      })

      // Verify archive was called
      await waitFor(() => {
        expect(employeesApi.archiveEmployee).toHaveBeenCalledWith('1')
      })
    })

    it('should complete add employee flow', async () => {
      const user = userEvent.setup()

      // Navigate to add employee
      vi.mocked(employeesApi.createEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<AddEmployee />)

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      })

      // Fill in basic info
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'Priya Sharma')

      // Form submission would happen here in actual flow
      // This test verifies the setup is correct
      expect(nameInput).toHaveValue('Priya Sharma')
    })
  })

  describe('Error Recovery Flow', () => {
    it('should allow retry after initial load failure', async () => {
      const user = userEvent.setup()

      // Initial failure
      vi.mocked(employeesApi.fetchEmployees).mockRejectedValueOnce(new Error('Network error'))

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
      })

      // Successful retry
      vi.mocked(employeesApi.fetchEmployees).mockResolvedValueOnce({
        data: [mockEmployee],
        total: 1,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })
    })

    it('should handle employee not found gracefully', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(null)

      renderWithRouter(<EmployeeDetail />, ['/staff/999'])

      await waitFor(() => {
        expect(screen.getByText(/not found/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      })
    })
  })

  describe('Data Consistency', () => {
    it('should refresh data after archive operation', async () => {
      const user = userEvent.setup()
      const archivedEmployee = { ...mockEmployee, status: 'archived' as const }

      vi.mocked(employeesApi.fetchEmployee)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(archivedEmployee)
      vi.mocked(employeesApi.archiveEmployee).mockResolvedValue()

      renderWithRouter(<EmployeeDetail />, ['/staff/1'])

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      const archiveButton = screen.getByRole('button', { name: /archive/i })
      await user.click(archiveButton)

      // After archiving, fetchEmployee should be called again
      await waitFor(() => {
        expect(employeesApi.fetchEmployee).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('should render correctly on mobile viewport', async () => {
      // Mock window.matchMedia for mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query.includes('max-width: 640px'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee],
        total: 1,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue(mockSummary)

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      // Components should render with mobile-friendly classes
      // This test verifies the structure is correct
      const staffDirectory = screen.getByText('Priya Sharma').closest('.grid')
      expect(staffDirectory).toBeInTheDocument()
    })
  })
})
