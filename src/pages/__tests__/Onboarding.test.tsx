import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Onboarding } from '../Onboarding'
import * as onboardingApi from '../../lib/api/onboarding'
import * as householdsApi from '../../lib/api/households'
import * as householdDefaultsApi from '../../lib/api/householdDefaults'
import * as employeesApi from '../../lib/api/employees'

// Mock API modules
vi.mock('../../lib/api/onboarding')
vi.mock('../../lib/api/households')
vi.mock('../../lib/api/householdDefaults')
vi.mock('../../lib/api/employees')
vi.mock('../../lib/constants/onboardingPresets', () => ({
  getOnboardingPresets: () => ({
    holidayRules: [
      { id: 'p1', label: '4 Days per Month', description: 'Standard flexible entitlement.' },
      { id: 'p2', label: 'Every Sunday Off', description: 'Weekly recurring holiday.' },
      { id: 'p3', label: 'Custom', description: 'Set your own rules later.' },
    ],
    attendance: [
      { id: 'a1', label: 'Present by Default', description: 'Only mark absences (Recommended).' },
      { id: 'a2', label: 'Manual Entry', description: 'Mark attendance for every person daily.' },
    ],
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

describe('Onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(onboardingApi.getOnboardingProgress as any).mockResolvedValue({
      userId: 'user-123',
      currentStepIndex: 0,
      totalSteps: 4,
      isCompleted: false,
      lastSavedAt: '2024-01-01T00:00:00Z',
    })
    ;(onboardingApi.getStepData as any).mockResolvedValue(null)
    ;(onboardingApi.saveOnboardingProgress as any).mockResolvedValue(undefined)
    ;(onboardingApi.completeOnboarding as any).mockResolvedValue(undefined)
    ;(householdsApi.createHousehold as any).mockResolvedValue({
      id: 'household-123',
      name: 'Test Household',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    })
    ;(householdDefaultsApi.setHolidayRulePreset as any).mockResolvedValue(null)
    ;(householdDefaultsApi.setAttendancePreset as any).mockResolvedValue({
      id: 'settings-123',
      householdId: 'household-123',
      trackingMethod: 'present_by_default',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    })
    ;(employeesApi.createEmployee as any).mockResolvedValue({
      id: 'employee-123',
      householdId: 'household-123',
      name: 'Test Employee',
      photo: null,
      status: 'active',
      holidayBalance: 0,
      phoneNumbers: [],
      addresses: [],
      employmentHistory: [],
      salaryHistory: [],
      documents: [],
      customProperties: [],
      notes: [],
    })
  })

  it('should render loading state initially', () => {
    ;(onboardingApi.getOnboardingProgress as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    expect(screen.getByText(/loading onboarding/i)).toBeInTheDocument()
  })

  it('should render onboarding wizard', async () => {
    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })
  })

  it('should complete full onboarding flow', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    // Wait for wizard to load
    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })

    // Step 1: Enter household name
    const nameInput = screen.getByPlaceholderText(/morgan residence/i)
    await user.type(nameInput, 'Test Household')

    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    await waitFor(() => {
      expect(householdsApi.createHousehold).toHaveBeenCalledWith('Test Household')
    })

    // Step 2: Select defaults (should be visible after step 1)
    await waitFor(() => {
      expect(screen.getByText(/set global defaults/i)).toBeInTheDocument()
    })

    // Skip defaults step
    const skipButton = screen.getByRole('button', { name: /skip/i })
    await user.click(skipButton)

    // Step 3: Add employee (should be visible after step 2)
    await waitFor(() => {
      expect(screen.getByText(/add your first employee/i)).toBeInTheDocument()
    })

    // Skip employee step
    const skipButton2 = screen.getByRole('button', { name: /skip/i })
    await user.click(skipButton2)

    // Step 4: Completion screen
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeInTheDocument()
    })

    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)

    await waitFor(() => {
      expect(onboardingApi.completeOnboarding).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/staff')
    })
  })

  it('should handle going back in wizard', async () => {
    const user = userEvent.setup()

    // Start at step 2
    ;(onboardingApi.getOnboardingProgress as any).mockResolvedValue({
      userId: 'user-123',
      currentStepIndex: 1,
      totalSteps: 4,
      isCompleted: false,
      lastSavedAt: '2024-01-01T00:00:00Z',
    })

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/set global defaults/i)).toBeInTheDocument()
    })

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)

    // Should go back to step 1
    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })
  })

  it('should save progress when moving to next step', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText(/morgan residence/i)
    await user.type(nameInput, 'Test Household')

    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    await waitFor(() => {
      expect(onboardingApi.saveOnboardingProgress).toHaveBeenCalled()
    })
  })

  it('should handle errors gracefully', async () => {
    ;(householdsApi.createHousehold as any).mockRejectedValue(
      new Error('Failed to create household')
    )

    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText(/morgan residence/i)
    await user.type(nameInput, 'Test Household')

    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)

    // Error should be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to create household/i)).toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/name your household/i)).toBeInTheDocument()
    })

    // Try to continue without entering name
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeDisabled()
  })

  it('should resume from saved progress', async () => {
    ;(onboardingApi.getOnboardingProgress as any).mockResolvedValue({
      userId: 'user-123',
      currentStepIndex: 2,
      totalSteps: 4,
      isCompleted: false,
      lastSavedAt: '2024-01-01T00:00:00Z',
    })
    ;(onboardingApi.getStepData as any).mockResolvedValue({
      householdId: 'household-123',
      householdName: 'Test Household',
    })

    render(
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    )

    // Should start at step 3 (employee step)
    await waitFor(() => {
      expect(screen.getByText(/add your first employee/i)).toBeInTheDocument()
    })
  })
})
