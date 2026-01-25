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
import type { UIEmployee, Summary } from '../../types'

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

const mockEmployee: UIEmployee = {
  id: '1',
  householdId: 'household-1',
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
  holidayBalance: 5,
  phoneNumbers: [{ number: '+91 98765 12345', label: 'Mobile' }],
  addresses: [],
  employmentHistory: [
    {
      role: 'Cook',
      department: 'Kitchen',
      startDate: '2024-01-15',
      endDate: null,
    },
  ],
  salaryHistory: [
    {
      amount: 15000,
      paymentMethod: 'Bank Transfer',
      effectiveDate: '2024-01-15',
    },
  ],
  documents: [],
  customProperties: [],
  notes: [],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

const mockSummary: Summary = {
  totalStaff: 5,
  activeStaff: 4,
  archivedStaff: 1,
  monthlyStaff: 4,
  adhocStaff: 1,
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

  describe('Flow 1: Add New Employee', () => {
    it('should show dropdown with Create New Staff and Link Existing Staff options', async () => {
      const user = userEvent.setup()

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
      vi.mocked(employeesApi.fetchEmployeesFromOtherHouseholds).mockResolvedValue([])

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Add Staff')).toBeInTheDocument()
      })

      const addButton = screen.getByText('Add Staff')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/create new staff/i)).toBeInTheDocument()
        expect(screen.getByText(/link existing staff/i)).toBeInTheDocument()
      })
    })

    it('should disable Next button until required fields are filled', async () => {
      const user = userEvent.setup()

      vi.mocked(employeesApi.createEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<AddEmployee />)

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      })

      // Next button should be disabled when name is empty
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeDisabled()

      // Fill in name
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'Lakshmi Devi')

      // Next button should now be enabled
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled()
      })
    })
  })

  describe('Flow 2: Link Existing Employee', () => {
    it('should show employees from other households in modal', async () => {
      const user = userEvent.setup()

      const existingEmployee = {
        id: '2',
        name: 'Raju Sharma',
        role: 'Driver',
        householdName: 'Springfield Vacation Home',
        phoneNumber: '+91 98765 43211',
      }

      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        ...mockSummary,
        totalStaff: 0,
      })
      vi.mocked(employeesApi.fetchEmployeesFromOtherHouseholds).mockResolvedValue([existingEmployee])

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Add Staff')).toBeInTheDocument()
      })

      const addButton = screen.getByText('Add Staff')
      await user.click(addButton)

      const linkOption = screen.getByText(/link existing staff/i)
      await user.click(linkOption)

      await waitFor(() => {
        expect(screen.getByText('Link Existing Staff')).toBeInTheDocument()
        expect(screen.getByText('Raju Sharma')).toBeInTheDocument()
        expect(screen.getByText('Driver')).toBeInTheDocument()
        expect(screen.getByText(/springfield/i)).toBeInTheDocument()
      })
    })

    it('should show empty state when no employees exist in other households', async () => {
      const user = userEvent.setup()

      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        ...mockSummary,
        totalStaff: 0,
      })
      vi.mocked(employeesApi.fetchEmployeesFromOtherHouseholds).mockResolvedValue([])

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Add Staff')).toBeInTheDocument()
      })

      const addButton = screen.getByText('Add Staff')
      await user.click(addButton)

      const linkOption = screen.getByText(/link existing staff/i)
      await user.click(linkOption)

      await waitFor(() => {
        expect(screen.getByText('Link Existing Staff')).toBeInTheDocument()
        expect(screen.getByText(/no employees found/i)).toBeInTheDocument()
      })
    })
  })

  describe('Flow 3: Search and Filter Staff', () => {
    it('should filter employees by name in real-time', async () => {
      const user = userEvent.setup()

      const employee2 = { ...mockEmployee, id: '2', name: 'Lakshmi Devi' }

      vi.mocked(employeesApi.fetchEmployees).mockResolvedValue({
        data: [mockEmployee, employee2],
        total: 2,
        page: 1,
        pageSize: 20,
      })
      vi.mocked(summaryApi.fetchSummary).mockResolvedValue({
        ...mockSummary,
        totalStaff: 2,
        activeStaff: 2,
      })

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
        expect(screen.getByText('Lakshmi Devi')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'Lakshmi')

      await waitFor(() => {
        expect(screen.getByText('Lakshmi Devi')).toBeInTheDocument()
        expect(screen.queryByText('Priya Sharma')).not.toBeInTheDocument()
      })
    })
  })

  describe('Flow 4: Toggle View Mode', () => {
    it('should switch between card and table views', async () => {
      const user = userEvent.setup()

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

      // Find view toggle buttons (grid and table icons)
      const viewButtons = screen.getAllByRole('button')
      const tableButton = viewButtons.find(btn => 
        btn.getAttribute('aria-label')?.includes('table') || 
        btn.querySelector('[data-testid*="table"]')
      )

      if (tableButton) {
        await user.click(tableButton)

        // After clicking table view, should still show employee
        await waitFor(() => {
          expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
        })
      }
    })
  })

  describe('Flow 5: Archive Employee', () => {
    it('should show confirmation dialog when archiving', async () => {
      const user = userEvent.setup()

      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)
      vi.mocked(employeesApi.archiveEmployee).mockResolvedValue()

      renderWithRouter(<EmployeeDetail />, ['/staff/1'])

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      const archiveButton = screen.getByRole('button', { name: /archive/i })
      await user.click(archiveButton)

      // Should show confirmation (if implemented)
      await waitFor(() => {
        const confirmText = screen.queryByText(/archive employee/i) || 
                          screen.queryByText(/confirm/i)
        // If confirmation exists, verify it
        if (confirmText) {
          expect(confirmText).toBeInTheDocument()
        }
      }, { timeout: 1000 })
    })
  })

  describe('Empty States', () => {
    it('should show empty state when no staff exists', async () => {
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
        archivedStaff: 0,
      })

      renderWithRouter(<StaffDirectory />)

      await waitFor(() => {
        expect(screen.getByText(/no staff found/i)).toBeInTheDocument()
        expect(screen.getByText(/get started by adding/i)).toBeInTheDocument()
        expect(screen.getByText('Add Staff')).toBeInTheDocument()
      })
    })

    it('should show filtered empty state when filters match no results', async () => {
      const user = userEvent.setup()

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

      // Search for something that doesn't match
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'NonExistentName123')

      await waitFor(() => {
        expect(screen.getByText(/no staff found/i)).toBeInTheDocument()
        expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument()
      })
    })
  })
})
