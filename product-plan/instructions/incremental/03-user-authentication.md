# Milestone 3: User Authentication

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement User Authentication — registration and login flows supporting Social Auth (Google, Facebook) and email/password.

## Overview

A single authentication page with tabbed Login/Register views, supporting both Social Auth (Google, Facebook) and email/password. Features email verification for new signups, code-based password reset, and smart post-login redirects based on user state.

**Key Functionality:**
- Login with email/password
- Login with Google or Facebook (Social Auth)
- Register with email/password
- Email verification with 6-digit code
- Forgot password flow with code verification
- Smart redirects after login (Onboarding for new users, Dashboard for existing)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/user-authentication/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/user-authentication/components/`:

- `UserAuthentication.tsx` — Main authentication page
- `SocialAuthButtons.tsx` — Google and Facebook buttons
- `LoginFormComponent.tsx` — Login form
- `RegisterFormComponent.tsx` — Registration form
- `VerificationFormComponent.tsx` — Code verification form
- `ForgotPasswordComponent.tsx` — Password reset flow

### Data Layer

The components expect these data shapes:

```typescript
interface UserAuthenticationProps {
  authConfig: AuthConfig
  socialProviders: SocialProvider[]
  loginForm: LoginForm
  registerForm: RegisterForm
  verificationForm: VerificationForm
  forgotPasswordForm: ForgotPasswordForm
  errorMessages: ErrorMessages
  currentView?: AuthView
  verificationEmail?: string
  isLoading?: boolean
  error?: string
  onLogin?: (email: string, password: string) => void
  onRegister?: (name: string, email: string, password: string) => void
  onSocialAuth?: (providerId: string) => void
  onVerifyCode?: (code: string) => void
  onResendCode?: () => void
  onForgotPassword?: (email: string) => void
  onResetPassword?: (password: string) => void
  onTabChange?: (tab: 'login' | 'register') => void
  onBack?: () => void
  onNavigate?: (href: string) => void
}
```

You'll need to:
- Implement authentication backend (email/password, OAuth)
- Handle session management
- Send verification emails
- Manage password reset tokens

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onLogin` | Submit login credentials → Authenticate → Redirect |
| `onRegister` | Submit registration → Create account → Send verification email |
| `onSocialAuth` | Initiate OAuth flow with provider (google/facebook) |
| `onVerifyCode` | Verify email/reset code → Complete registration or allow password reset |
| `onResendCode` | Request new verification code |
| `onForgotPassword` | Send password reset email |
| `onResetPassword` | Set new password after verification |
| `onTabChange` | Switch between Login and Register tabs |
| `onBack` | Return to previous step in multi-step flows |

## Files to Reference

- `product-plan/sections/user-authentication/README.md` — Feature overview and design intent
- `product-plan/sections/user-authentication/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/user-authentication/components/` — React components
- `product-plan/sections/user-authentication/types.ts` — TypeScript interfaces
- `product-plan/sections/user-authentication/sample-data.json` — Test data
- `product-plan/sections/user-authentication/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Register with Email

1. User navigates to `/register`
2. User clicks "Register" tab (if not already active)
3. User enters name, email, password, and confirms password
4. User clicks "Create account"
5. User receives verification email and sees verification code input
6. User enters 6-digit verification code
7. **Outcome:** Account created, user redirected to Onboarding

### Flow 2: Login with Email

1. User navigates to `/login`
2. User enters email and password
3. User clicks "Sign in"
4. **Outcome:** User authenticated, redirected to Staff Directory (or Onboarding if new)

### Flow 3: Login with Social Auth

1. User clicks "Continue with Google" or "Continue with Facebook"
2. User completes OAuth flow in popup/redirect
3. **Outcome:** User authenticated, redirected appropriately

### Flow 4: Forgot Password

1. User clicks "Forgot password?" on login form
2. User enters email address
3. User clicks "Send reset code"
4. User receives email with code
5. User enters verification code
6. User enters new password and confirms
7. **Outcome:** Password reset, user redirected to login

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Login form works with email/password
- [ ] Registration form works with validation
- [ ] Social Auth buttons trigger OAuth flows
- [ ] Email verification flow works
- [ ] Password reset flow works
- [ ] Error states display correctly
- [ ] Loading states show during async operations
- [ ] Redirect logic works (new users → Onboarding, existing → Dashboard)
- [ ] Responsive on mobile
- [ ] Dark mode support
