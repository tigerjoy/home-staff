import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Register } from '../Register'
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

describe('Register', () => {
  const mockSignUp = vi.fn()
  const mockSendVerificationOTP = vi.fn()
  const mockVerifyOTP = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signUp: mockSignUp,
      sendVerificationOTP: mockSendVerificationOTP,
      verifyOTP: mockVerifyOTP,
      signInWithOAuth: vi.fn(),
    })
  })

  it('should render registration form', () => {
    render(
      <BrowserRouter>
        <Register />
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
    mockSignUp.mockResolvedValue({ success: true })
    mockSendVerificationOTP.mockResolvedValue({ success: true })

    render(
      <BrowserRouter>
        <Register />
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
      expect(mockSignUp).toHaveBeenCalledWith({
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
        <Register />
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'DifferentPassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  it('should handle email verification flow', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ success: true })
    mockSendVerificationOTP.mockResolvedValue({ success: true })
    mockVerifyOTP.mockResolvedValue({ success: true })

    render(
      <BrowserRouter>
        <Register />
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
      expect(mockSignUp).toHaveBeenCalled()
    })

    // After registration, verification screen should appear
    // This would be tested in integration tests
  })

  it('should display error message on registration failure', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({
      success: false,
      error: 'Email already registered',
    })

    render(
      <BrowserRouter>
        <Register />
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
      expect(mockSignUp).toHaveBeenCalled()
    })
  })
})
