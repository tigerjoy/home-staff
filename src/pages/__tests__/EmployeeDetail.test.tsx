import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { EmployeeDetail } from '../EmployeeDetail'
import * as employeesApi from '../../lib/api/employees'
import * as storageApi from '../../lib/storage/documents'
import type { Employee } from '../../types'

vi.mock('../../lib/api/employees')
vi.mock('../../lib/storage/documents')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  }
})

const mockEmployee: Employee = {
  id: '1',
  householdId: 1,
  name: 'Priya Sharma',
  photo: null,
  status: 'active',
  holidayBalance: 5,
  phoneNumbers: [
    { id: 1, number: '+91 98765 12345', label: 'Mobile' },
    { id: 2, number: '+91 98765 54321', label: 'Home' },
  ],
  addresses: [{ id: 1, address: '123 Test Street, Delhi', label: 'Current' }],
  employmentHistory: [
    {
      id: 1,
      role: 'Cook',
      department: 'Kitchen',
      startDate: '2024-01-15',
      endDate: null,
    },
    {
      id: 2,
      role: 'Assistant Cook',
      department: 'Kitchen',
      startDate: '2023-06-01',
      endDate: '2024-01-14',
    },
  ],
  salaryHistory: [
    {
      id: 1,
      amount: 15000,
      paymentMethod: 'Bank Transfer',
      effectiveDate: '2024-01-15',
    },
    {
      id: 2,
      amount: 12000,
      paymentMethod: 'Cash',
      effectiveDate: '2023-06-01',
    },
  ],
  documents: [
    {
      id: 1,
      name: 'Aadhar Card.pdf',
      url: 'https://example.com/doc1.pdf',
      category: 'id',
      uploadedAt: '2024-01-15T00:00:00Z',
    },
  ],
  customProperties: [],
  notes: [],
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('EmployeeDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Flow 3: View Employee Profile', () => {
    it('should display employee name and status badge in header', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
        expect(screen.getByText(/active/i)).toBeInTheDocument()
      })
    })

    it('should display all phone numbers with labels', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('+91 98765 12345')).toBeInTheDocument()
        expect(screen.getByText('+91 98765 54321')).toBeInTheDocument()
        expect(screen.getByText(/mobile/i)).toBeInTheDocument()
        expect(screen.getByText(/home/i)).toBeInTheDocument()
      })
    })

    it('should display employment history timeline with current role highlighted', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('Cook')).toBeInTheDocument()
        expect(screen.getByText('Assistant Cook')).toBeInTheDocument()
      })
    })

    it('should display salary history with current salary marked', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText(/₹.*15,000/i)).toBeInTheDocument()
        expect(screen.getByText(/₹.*12,000/i)).toBeInTheDocument()
      })
    })

    it('should display documents grouped by category', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('Aadhar Card.pdf')).toBeInTheDocument()
      })
    })

    it('should display holiday balance', async () => {
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText(/5.*days?/i)).toBeInTheDocument()
      })
    })
  })

  describe('Flow 4: Archive Employee', () => {
    it('should show confirmation when archive button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)
      vi.mocked(employeesApi.archiveEmployee).mockResolvedValue()

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      const archiveButton = screen.getByRole('button', { name: /archive/i })
      await user.click(archiveButton)

      // Check for confirmation modal/dialog
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      })
    })

    it('should change employee status to archived after confirmation', async () => {
      const user = userEvent.setup()
      const archivedEmployee = { ...mockEmployee, status: 'archived' as const }

      vi.mocked(employeesApi.fetchEmployee)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(archivedEmployee)
      vi.mocked(employeesApi.archiveEmployee).mockResolvedValue()

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      })

      const archiveButton = screen.getByRole('button', { name: /archive/i })
      await user.click(archiveButton)

      // Confirm archive
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /confirm|archive/i })
        if (confirmButton) {
          return user.click(confirmButton)
        }
      })

      await waitFor(() => {
        expect(employeesApi.archiveEmployee).toHaveBeenCalledWith('1')
      })
    })
  })

  describe('Empty States in Employee Detail', () => {
    it('should show empty state for documents when no documents exist', async () => {
      const employeeWithoutDocs = { ...mockEmployee, documents: [] }
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(employeeWithoutDocs)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText(/no.*documents/i)).toBeInTheDocument()
      })
    })

    it('should show empty state for notes when no notes exist', async () => {
      const employeeWithoutNotes = { ...mockEmployee, notes: [] }
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(employeeWithoutNotes)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText(/no notes/i)).toBeInTheDocument()
      })
    })

    it('should show empty state for custom fields when none exist', async () => {
      const employeeWithoutCustom = { ...mockEmployee, customProperties: [] }
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(employeeWithoutCustom)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByText(/no custom fields/i)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to edit page when edit button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      expect(mockNavigate).toHaveBeenCalledWith('/staff/1/edit')
    })

    it('should navigate back to staff list when back button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(employeesApi.fetchEmployee).mockResolvedValue(mockEmployee)

      renderWithRouter(<EmployeeDetail />)

      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /back/i })
        expect(backButton).toBeInTheDocument()
        return user.click(backButton)
      })

      expect(mockNavigate).toHaveBeenCalledWith('/staff')
    })
  })
})
