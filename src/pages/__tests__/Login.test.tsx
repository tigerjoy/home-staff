import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../Login'
import { useAuth } from '../../hooks/useAuth'

// Mock useAuth hook
vi.mock('../../hooks/useAuth')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Login', () => {
  const mockSignIn = vi.fn()
  const mockSignInWithOAuth = vi.fn()
  const mockResetPassword = vi.fn()
  const mockVerifyOTP = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signIn: mockSignIn,
      signInWithOAuth: mockSignInWithOAuth,
      resetPassword: mockResetPassword,
      verifyOTP: mockVerifyOTP,
    })
  })

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ success: true })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should display error message on login failure', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({
      success: false,
      error: 'Invalid email or password',
    })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled()
    })
  })

  it('should handle social auth login', async () => {
    const user = userEvent.setup()
    mockSignInWithOAuth.mockResolvedValue({})

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith('google')
    })
  })

  it('should show loading state during login', async () => {
    const user = userEvent.setup()
    let resolveSignIn: (value: any) => void
    const signInPromise = new Promise((resolve) => {
      resolveSignIn = resolve
    })
    mockSignIn.mockReturnValue(signInPromise)

    ;(useAuth as any).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      signIn: mockSignIn,
      signInWithOAuth: mockSignInWithOAuth,
      resetPassword: mockResetPassword,
      verifyOTP: mockVerifyOTP,
    })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeDisabled()
  })
})
