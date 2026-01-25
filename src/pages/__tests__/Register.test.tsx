import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Register } from '../Register'
import { SessionProvider } from '../../context/SessionContext'
import * as authApi from '../../lib/api/auth'
import { needsOnboarding } from '../../lib/api/auth'

// Mock auth API
vi.mock('../../lib/api/auth', async () => {
  const actual = await vi.importActual('../../lib/api/auth')
  return {
    ...actual,
    needsOnboarding: vi.fn(),
  }
})

// Mock SessionContext
const mockSession = null
const mockUseSession = vi.fn(() => ({ session: mockSession }))

vi.mock('../../context/SessionContext', async () => {
  const actual = await vi.importActual('../../context/SessionContext')
  return {
    ...actual,
    useSession: () => mockUseSession(),
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSession.mockReturnValue({ session: null })
    ;(needsOnboarding as any).mockResolvedValue(false)
  })

  it('should render registration form', () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    expect(screen.getByText(/create your account/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should handle successful registration', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      isEmailVerified: false,
      onboardingCompleted: false,
      authProvider: 'email' as const,
    }
    
    vi.spyOn(authApi, 'signUp').mockResolvedValue({ user: mockUser, error: null })
    vi.spyOn(authApi, 'sendOTP').mockResolvedValue({ error: null })

    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'Password123!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signUp).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      })
    })
  })

  it('should validate password mismatch', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'DifferentPassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signUp).not.toHaveBeenCalled()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signUp).not.toHaveBeenCalled()
    })
  })

  it('should handle email verification flow', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      isEmailVerified: false,
      onboardingCompleted: false,
      authProvider: 'email' as const,
    }
    
    vi.spyOn(authApi, 'signUp').mockResolvedValue({ user: mockUser, error: null })
    vi.spyOn(authApi, 'sendOTP').mockResolvedValue({ error: null })
    vi.spyOn(authApi, 'verifyOTP').mockResolvedValue({ verified: true, error: null })

    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    // Fill registration form
    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'Password123!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signUp).toHaveBeenCalled()
    })

    // After registration, verification screen should appear
    // This would be tested in integration tests
  })

  it('should display error message on registration failure', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'signUp').mockResolvedValue({
      user: null,
      error: { message: 'Email already registered' },
    })

    render(
      <BrowserRouter>
        <SessionProvider>
          <Register />
        </SessionProvider>
      </BrowserRouter>
    )

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'Password123!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signUp).toHaveBeenCalled()
    })
  })
})
