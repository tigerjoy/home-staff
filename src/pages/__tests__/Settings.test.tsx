import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Settings } from '../Settings'
import * as profileApi from '../../lib/api/profile'
import * as householdsApi from '../../lib/api/households'
import * as membersApi from '../../lib/api/members'
import * as invitationsApi from '../../lib/api/invitations'
import { useHousehold } from '../../hooks/useHousehold'

vi.mock('../../lib/api/profile')
vi.mock('../../lib/api/households')
vi.mock('../../lib/api/members')
vi.mock('../../lib/api/invitations')
vi.mock('../../hooks/useHousehold')

describe('Settings', () => {
  const mockUserProfile = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null,
    timezone: 'UTC',
  }

  const mockHouseholds = [
    {
      id: 'hh-1',
      name: 'Test Household',
      role: 'Admin' as const,
      status: 'active' as const,
      isPrimary: true,
    },
  ]

  const mockMembers = [
    {
      id: 'mem-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin' as const,
      joinedAt: '2024-01-01T00:00:00Z',
      avatarUrl: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useHousehold).mockReturnValue({
      activeHousehold: { id: 'hh-1', name: 'Test Household', status: 'active', createdAt: '', updatedAt: '' },
      activeHouseholdId: 'hh-1',
      households: [],
      loading: false,
      error: null,
      switchHousehold: vi.fn(),
      refreshHouseholds: vi.fn(),
      setPrimaryHousehold: vi.fn(),
    })

    vi.mocked(profileApi.getUserProfile).mockResolvedValue({
      ...mockUserProfile,
      lastOpenedHouseholdId: null,
    })

    vi.mocked(householdsApi.getUserHouseholdsWithRoles).mockResolvedValue(mockHouseholds)

    vi.mocked(membersApi.getHouseholdMembers).mockResolvedValue(mockMembers)
    vi.mocked(membersApi.getCurrentUserRole).mockResolvedValue('Admin')

    vi.mocked(invitationsApi.getInvitationCode).mockResolvedValue(null)
  })

  it('should render SettingsDashboard with user profile', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should display households tab', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Your Households')).toBeInTheDocument()
      expect(screen.getByText('Test Household')).toBeInTheDocument()
    })
  })

  it('should display members when members tab is active', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Team Members')).toBeInTheDocument()
    })
  })

  it('should handle loading state', () => {
    vi.mocked(profileApi.getUserProfile).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<Settings />)

    expect(screen.getByText('Loading settings...')).toBeInTheDocument()
  })

  it('should handle error state', async () => {
    vi.mocked(profileApi.getUserProfile).mockRejectedValue(
      new Error('Failed to load profile')
    )

    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load profile/)).toBeInTheDocument()
    })
  })
})
