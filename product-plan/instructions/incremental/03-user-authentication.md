# Milestone 3: User Authentication

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Test-writing instructions (see `product-plan/sections/user-authentication/tests.md`)

**What you need to build:**
- Backend authentication logic (Auth0, Firebase, or custom JWT)
- Social Auth integration (Google, Facebook)
- Email service for verification codes
- Session management and protected routes
- Password reset logic

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your API calls
- **DO** implement proper error handling for invalid credentials or expired codes
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Implement a secure, multi-method authentication system that handles user registration, login, and password recovery.

## Overview
A single authentication page with tabbed Login/Register views. It supports both traditional email/password credentials and Social Auth (Google/Facebook). New signups require email verification via a 6-digit code.

**Key Capabilities:**
- Tabbed interface for Login/Register
- Social Auth integration (Google/Facebook)
- Email verification flow for new accounts
- "Forgot Password" flow with code-based reset
- Inline validation and server-side error display

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/user-authentication/tests.md`. Start by testing the form validation and the toggle between Login and Register tabs.

## What to Implement

### Components
Copy these from `product-plan/sections/user-authentication/components/`:
- `UserAuthentication.tsx` — Main container with tab logic
- `LoginFormComponent.tsx` — Email/password login form
- `RegisterFormComponent.tsx` — Signup form with name, email, password
- `SocialAuthButtons.tsx` — Google and Facebook login buttons
- `VerificationFormComponent.tsx` — Code entry for email/password reset
- `ForgotPasswordComponent.tsx` — Email entry for password recovery

### Data Layer
- **Auth Provider:** Set up your choice of authentication provider.
- **Verification Codes:** Implement a temporary store (Redis or DB) for 6-digit verification codes with expiration.

### Callbacks
- `onLogin(credentials)`: Authenticate user and redirect to dashboard or previous page.
- `onRegister(data)`: Create user and trigger verification email.
- `onVerify(code)`: Validate code and activate account or allow password reset.
- `onSocialLogin(provider)`: Trigger OAuth flow for Google/Facebook.
- `onForgotPassword(email)`: Send password reset code.

### Empty States
N/A - This is a form-driven section.

## Files to Reference
- `product-plan/sections/user-authentication/spec.md` — UI requirements
- `product-plan/sections/user-authentication/types.ts` — Prop definitions
- `product-plan/data-model/types.ts` — User and Household entities

## Expected User Flows
1. **The Registration Flow:** User selects "Register" → Enters details → Receives code via email → Enters code → Redirects to `/onboarding`.
2. **The Social Login Flow:** User clicks "Google" → Completes OAuth → Redirects to Dashboard (or Onboarding if first time).
3. **The Password Reset Flow:** User clicks "Forgot Password" → Enters email → Receives code → Enters code and new password → Redirects to Login.

## Done When
- [ ] Users can register with email/password
- [ ] Email verification is enforced for new signups
- [ ] Login works for verified users
- [ ] Social Auth (Google/Facebook) is functional
- [ ] Password reset flow is fully operational
- [ ] Protected routes correctly redirect unauthenticated users to `/login`
- [ ] All tests in `tests.md` pass
