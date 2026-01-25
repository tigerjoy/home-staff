import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../Login'
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
    useLocation: () => ({ state: null }),
  }
})

describe('Authentication Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSession.mockReturnValue({ session: null })
    ;(needsOnboarding as any).mockResolvedValue(false)
  })

  describe('Flow 1: Registration and Verification', () => {
    it('should complete full registration flow with email verification', async () => {
      const user = userEvent.setup()
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
        avatarUrl: null,
        isEmailVerified: false,
        onboardingCompleted: false,
        authProvider: 'email' as const,
      }

      vi.spyOn(authApi, 'signUp').mockResolvedValue({ user: mockUser, error: null })
      vi.spyOn(authApi, 'sendOTP').mockResolvedValue({ error: null })
      vi.spyOn(authApi, 'verifyOTP').mockResolvedValue({ verified: true, error: null })
      ;(needsOnboarding as any).mockResolvedValue(true)

      render(
        <BrowserRouter>
          <SessionProvider>
            <Register />
          </SessionProvider>
        </BrowserRouter>
      )

      // Step 1: Switch to Register tab (already on register page)
      expect(screen.getByText(/create your account/i)).toBeInTheDocument()

      // Step 2: Enter valid registration details
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')

      // Step 3: Verify submit button is enabled when form is valid
      expect(submitButton).not.toBeDisabled()

      // Step 4: Click Create Account
      await user.click(submitButton)

      // Step 5: Verify registration API was called
      await waitFor(() => {
        expect(authApi.signUp).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        })
      })

      // Step 6: Verify OTP was sent
      await waitFor(() => {
        expect(authApi.sendOTP).toHaveBeenCalledWith({
          email: 'john@example.com',
          purpose: 'email_verification',
        })
      })

      // Step 7: Verify verification screen appears
      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument()
        expect(screen.getByText(/we sent a verification code to/i)).toBeInTheDocument()
      })
    })

    it('should handle tab switching between Login and Register', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <SessionProvider>
            <Login />
          </SessionProvider>
        </BrowserRouter>
      )

      // Should start on Login tab
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()

      // Click Register tab
      const registerTab = screen.getByRole('button', { name: /register/i })
      await user.click(registerTab)

      // Should navigate to register page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/register')
      })
    })
  })

  describe('Flow 2: Password Recovery', () => {
    it('should complete password reset flow', async () => {
      const user = userEvent.setup()

      vi.spyOn(authApi, 'sendOTP').mockResolvedValue({ error: null })
      vi.spyOn(authApi, 'verifyOTP').mockResolvedValue({ verified: true, error: null })
      vi.spyOn(authApi, 'resetPassword').mockResolvedValue({ error: null })

      render(
        <BrowserRouter>
          <SessionProvider>
            <Login />
          </SessionProvider>
        </BrowserRouter>
      )

      // Step 1: Click "Forgot Password" on Login form
      const forgotPasswordLink = screen.getByText(/forgot password/i)
      await user.click(forgotPasswordLink)

      // Step 2: Verify forgot password screen appears
      await waitFor(() => {
        expect(screen.getByText(/reset your password/i)).toBeInTheDocument()
      })

      // Step 3: Enter email and send reset code
      const emailInput = screen.getByPlaceholderText(/you@example.com/i)
      const sendButton = screen.getByRole('button', { name: /send reset code/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(sendButton)

      // Step 4: Verify OTP was sent for password reset
      await waitFor(() => {
        expect(authApi.sendOTP).toHaveBeenCalledWith({
          email: 'test@example.com',
          purpose: 'password_reset',
        })
      })

      // Step 5: Verify code entry screen appears
      await waitFor(() => {
        expect(screen.getByText(/enter reset code/i)).toBeInTheDocument()
      })

      // Step 6: Enter verification code
      const codeInputs = screen.getAllByRole('textbox').filter(
        (input) => (input as HTMLInputElement).placeholder === '0'
      )
      
      // Enter code 123456
      if (codeInputs.length > 0) {
        for (let i = 0; i < Math.min(6, codeInputs.length); i++) {
          await user.type(codeInputs[i], i < 6 ? String(i + 1) : '')
        }
      }

      // Step 7: Verify code
      const verifyButton = screen.getByRole('button', { name: /verify code/i })
      await user.click(verifyButton)

      await waitFor(() => {
        expect(authApi.verifyOTP).toHaveBeenCalledWith({
          email: 'test@example.com',
          code: expect.any(String),
          purpose: 'password_reset',
        })
      })

      // Step 8: Verify new password screen appears
      await waitFor(() => {
        expect(screen.getByText(/set new password/i)).toBeInTheDocument()
      })

      // Step 9: Enter new password
      const newPasswordInput = screen.getByPlaceholderText(/new password/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i)
      const resetButton = screen.getByRole('button', { name: /reset password/i })

      await user.type(newPasswordInput, 'NewPassword123!')
      await user.type(confirmPasswordInput, 'NewPassword123!')
      await user.click(resetButton)

      // Step 10: Verify password was reset
      await waitFor(() => {
        expect(authApi.resetPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          newPassword: 'NewPassword123!',
        })
      })

      // Step 11: Should redirect to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', expect.any(Object))
      })
    })
  })

  describe('Social Authentication', () => {
    it('should trigger Google OAuth when Google button is clicked', async () => {
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

    it('should trigger Facebook OAuth when Facebook button is clicked', async () => {
      const user = userEvent.setup()
      vi.spyOn(authApi, 'signInWithOAuth').mockResolvedValue({ error: null })

      render(
        <BrowserRouter>
          <SessionProvider>
            <Login />
          </SessionProvider>
        </BrowserRouter>
      )

      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)

      await waitFor(() => {
        expect(authApi.signInWithOAuth).toHaveBeenCalledWith('facebook')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should display error message for invalid verification code', async () => {
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
      vi.spyOn(authApi, 'verifyOTP').mockResolvedValue({
        verified: false,
        error: { message: 'Invalid verification code' },
      })

      render(
        <BrowserRouter>
          <SessionProvider>
            <Register />
          </SessionProvider>
        </BrowserRouter>
      )

      // Complete registration
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

      // Wait for verification screen
      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument()
      })

      // Enter invalid code
      const codeInputs = screen.getAllByRole('textbox').filter(
        (input) => (input as HTMLInputElement).placeholder === '0'
      )
      
      if (codeInputs.length > 0) {
        for (let i = 0; i < Math.min(6, codeInputs.length); i++) {
          await user.type(codeInputs[i], '0')
        }
      }

      const verifyButton = screen.getByRole('button', { name: /verify/i })
      await user.click(verifyButton)

      // Should display error message
      await waitFor(() => {
        expect(screen.getByText(/invalid verification code/i)).toBeInTheDocument()
      })
    })

    it('should prevent registration with weak password', async () => {
      const user = userEvent.setup()

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
      await user.type(passwordInput, 'weak')
      await user.type(confirmPasswordInput, 'weak')
      await user.click(submitButton)

      // Should not call signUp with weak password
      await waitFor(() => {
        expect(authApi.signUp).not.toHaveBeenCalled()
      })
    })

    it('should handle duplicate email error', async () => {
      const user = userEvent.setup()

      vi.spyOn(authApi, 'signUp').mockResolvedValue({
        user: null,
        error: { message: 'An account with this email already exists' },
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

      // Should display error message
      await waitFor(() => {
        expect(screen.getByText(/already exists/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels associated with inputs', () => {
      render(
        <BrowserRouter>
          <SessionProvider>
            <Login />
          </SessionProvider>
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have accessible error messages', async () => {
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

      // Error message should be accessible
      await waitFor(() => {
        const errorMessage = screen.getByText(/invalid email or password/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })
  })
})
