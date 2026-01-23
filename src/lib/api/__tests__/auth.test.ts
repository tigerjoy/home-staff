import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as authApi from '../auth'
import { supabase } from '../../../supabase'

// Mock Supabase client
vi.mock('../../supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      updateUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      upsert: vi.fn().mockReturnThis(),
    })),
    functions: {
      invoke: vi.fn(),
    },
  },
}))

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
        email_confirmed_at: null,
      }

      ;(supabase.auth.signUp as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      ;(supabase.from as any).mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'user-123',
            name: 'Test User',
            avatar_url: null,
            onboarding_completed: false,
          },
        }),
      })

      const result = await authApi.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(result.error).toBeNull()
      expect(result.user).toBeTruthy()
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should return error for invalid email', async () => {
      ;(supabase.auth.signUp as any).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid email address', status: 400 },
      })

      const result = await authApi.signUp({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      })

      expect(result.user).toBeNull()
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toContain('email')
    })
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
        email_confirmed_at: '2024-01-01T00:00:00Z',
      }

      ;(supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      ;(supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'user-123',
            name: 'Test User',
            avatar_url: null,
            onboarding_completed: false,
          },
        }),
      })

      const result = await authApi.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.error).toBeNull()
      expect(result.user).toBeTruthy()
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should return error for invalid credentials', async () => {
      ;(supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials', status: 400 },
      })

      const result = await authApi.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(result.user).toBeNull()
      expect(result.error).toBeTruthy()
      expect(result.error?.message).toContain('Invalid')
    })
  })

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      ;(supabase.auth.signOut as any).mockResolvedValue({
        error: null,
      })

      const result = await authApi.signOut()

      expect(result.error).toBeNull()
    })
  })

  describe('sendOTP', () => {
    it('should successfully send OTP for email verification', async () => {
      ;(supabase.functions.invoke as any).mockResolvedValue({
        data: { success: true },
        error: null,
      })

      const result = await authApi.sendOTP({
        email: 'test@example.com',
        purpose: 'email_verification',
      })

      expect(result.error).toBeNull()
      expect(supabase.functions.invoke).toHaveBeenCalledWith('send-otp', {
        body: {
          email: 'test@example.com',
          purpose: 'email_verification',
        },
      })
    })

    it('should handle errors when sending OTP', async () => {
      ;(supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { message: 'Rate limit exceeded' },
      })

      const result = await authApi.sendOTP({
        email: 'test@example.com',
        purpose: 'email_verification',
      })

      expect(result.error).toBeTruthy()
    })
  })

  describe('verifyOTP', () => {
    it('should successfully verify OTP code', async () => {
      ;(supabase.functions.invoke as any).mockResolvedValue({
        data: { verified: true, success: true },
        error: null,
      })

      const result = await authApi.verifyOTP({
        email: 'test@example.com',
        code: '123456',
        purpose: 'email_verification',
      })

      expect(result.verified).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should return error for invalid OTP code', async () => {
      ;(supabase.functions.invoke as any).mockResolvedValue({
        data: { error: 'Invalid verification code' },
        error: null,
      })

      const result = await authApi.verifyOTP({
        email: 'test@example.com',
        code: '000000',
        purpose: 'email_verification',
      })

      expect(result.verified).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })
})
