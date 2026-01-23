import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'
import * as authApi from '../../lib/api/auth'

// Mock the auth API
vi.mock('../../lib/api/auth')
vi.mock('../../lib/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should load user session on mount', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      isEmailVerified: true,
      onboardingCompleted: false,
      authProvider: 'email' as const,
    }

    ;(authApi.getSession as any).mockResolvedValue({
      user: mockUser,
      session: { access_token: 'token' },
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('should sign up a new user', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })
    ;(authApi.signUp as any).mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const signUpResult = await result.current.signUp({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })

    expect(signUpResult.success).toBe(true)
    expect(authApi.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })
  })

  it('should sign in an existing user', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })
    ;(authApi.signIn as any).mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const signInResult = await result.current.signIn({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(signInResult.success).toBe(true)
    expect(authApi.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should handle sign in errors', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })
    ;(authApi.signIn as any).mockResolvedValue({
      user: null,
      error: { message: 'Invalid credentials' },
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const signInResult = await result.current.signIn({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    expect(signInResult.success).toBe(false)
    expect(signInResult.error).toBe('Invalid credentials')
  })

  it('should send verification OTP', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })
    ;(authApi.sendOTP as any).mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const otpResult = await result.current.sendVerificationOTP('test@example.com')

    expect(otpResult.success).toBe(true)
    expect(authApi.sendOTP).toHaveBeenCalledWith({
      email: 'test@example.com',
      purpose: 'email_verification',
    })
  })

  it('should verify OTP code', async () => {
    ;(authApi.getSession as any).mockResolvedValue({
      user: null,
      session: null,
    })
    ;(authApi.verifyOTP as any).mockResolvedValue({
      verified: true,
      error: null,
    })
    ;(authApi.getCurrentUser as any).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const verifyResult = await result.current.verifyOTP(
      'test@example.com',
      '123456',
      'email_verification'
    )

    expect(verifyResult.success).toBe(true)
    expect(authApi.verifyOTP).toHaveBeenCalledWith({
      email: 'test@example.com',
      code: '123456',
      purpose: 'email_verification',
    })
  })

  it('should sign out user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    }

    ;(authApi.getSession as any).mockResolvedValue({
      user: mockUser,
      session: { access_token: 'token' },
    })
    ;(authApi.signOut as any).mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeTruthy()

    await result.current.signOut()

    await waitFor(() => {
      expect(result.current.user).toBeNull()
    })
  })
})
