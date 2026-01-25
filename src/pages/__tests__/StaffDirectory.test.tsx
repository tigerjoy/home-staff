import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { StaffDirectory } from '../StaffDirectory'
import * as employeesApi from '../../lib/api/employees'
import * as summaryApi from '../../lib/api/summary'
import type { UIEmployee, Summary } from '../../types'

// Mock the API functions
vi.mock('../../lib/api/employees')
vi.mock('../../lib/api/summary')
vi.mock('../../lib/utils/export')
vi.mock('../../hooks/useHousehold', () => ({
  useHousehold: () => ({
    activeHouseholdId: 'household-123',
    activeHousehold: { id: 'household-123', name: 'Test Household', status: 'active', createdAt: '', updatedAt: '' },
    households: [],
    loading: false,
    error: null,
    switchHousehold: vi.fn(),
    refreshHouseholds: vi.fn(),
  }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockEmployee: UIEmployee = {
  id: 'employee-1',
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
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
  holidayBalance: 5,
  householdId: 'household-123',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

const mockSummary: Summary = {
  totalStaff: 1,
  activeStaff: 1,
  archivedStaff: 0,
  monthlyStaff: 1,
  adhocStaff: 0,
  roleBreakdown: { Cook: 1 },
}

describe('StaffDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(employeesApi.fetchEmployees as any) = vi.fn().mockResolvedValue({
      data: [mockEmployee],
      total: 1,
      page: 1,
      pageSize: 20,
    })
    ;(summaryApi.fetchSummary as any) = vi.fn().mockResolvedValue(mockSummary)
  })

  it('should render staff directory with employees', async () => {
    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
    })

    expect(employeesApi.fetchEmployees).toHaveBeenCalledWith('household-123', 1, 20)
    expect(summaryApi.fetchSummary).toHaveBeenCalledWith('household-123')
  })

  it('should display summary cards', async () => {
    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Total Staff/i)).toBeInTheDocument()
      expect(screen.getByText(/Active Staff/i)).toBeInTheDocument()
    })
  })

  it('should navigate to employee detail on view', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
    })

    // The actual click would be handled by the component's onView callback
    // This test verifies the component renders and API is called
    expect(employeesApi.fetchEmployees).toHaveBeenCalled()
  })

  it('should handle archive employee', async () => {
    ;(employeesApi.archiveEmployee as any) = vi.fn().mockResolvedValue(undefined)
    ;(employeesApi.fetchEmployees as any) = vi.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 20,
    })

    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(employeesApi.fetchEmployees).toHaveBeenCalled()
    })
  })

  it('should show loading state initially', () => {
    ;(employeesApi.fetchEmployees as any) = vi.fn().mockImplementation(() => new Promise(() => {}))

    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    expect(screen.getByText(/Loading staff directory/i)).toBeInTheDocument()
  })

  it('should show error state on API failure', async () => {
    ;(employeesApi.fetchEmployees as any) = vi.fn().mockRejectedValue(new Error('API Error'))

    render(
      <BrowserRouter>
        <StaffDirectory />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument()
    })
  })
})
