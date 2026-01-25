import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../Login'
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
    useLocation: () => ({ state: null }),
  }
})

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSession.mockReturnValue({ session: null })
    ;(needsOnboarding as any).mockResolvedValue(false)
  })

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    )

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      isEmailVerified: true,
      onboardingCompleted: false,
      authProvider: 'email' as const,
    }
    
    vi.spyOn(authApi, 'signIn').mockResolvedValue({ user: mockUser, error: null })
    ;(needsOnboarding as any).mockResolvedValue(false)

    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should display error message on login failure', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'signIn').mockResolvedValue({
      user: null,
      error: { message: 'Invalid email or password' },
    })

    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.signIn).toHaveBeenCalled()
    })
  })

  it('should handle social auth login', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'signInWithOAuth').mockResolvedValue({ error: null })

    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    await waitFor(() => {
      expect(authApi.signInWithOAuth).toHaveBeenCalledWith('google')
    })
  })

  it('should show loading state during login', async () => {
    const user = userEvent.setup()
    let resolveSignIn: (value: any) => void
    const signInPromise = new Promise<{ user: any; error: any }>((resolve) => {
      resolveSignIn = resolve
    })
    vi.spyOn(authApi, 'signIn').mockReturnValue(signInPromise)

    render(
      <BrowserRouter>
        <SessionProvider>
          <Login />
        </SessionProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Button should be disabled during loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    // Resolve the promise
    resolveSignIn!({ user: null, error: null })
  })
})
